#!/usr/bin/env bash
# One-time: enable MongoDB auth (app + admin users), point backend/.env at the
# authenticated URL, flip authorization on. Self-verifying with auto-rollback.
set -euo pipefail
TS=$(date +%Y%m%d-%H%M%S)
ENV=/root/schand/backend/.env
MCONF=/etc/mongod.conf
DB=$(grep -E '^DB_NAME=' "$ENV" | sed -E 's/^DB_NAME=//; s/^"//; s/"$//')
echo "DB=$DB"
mongosh --quiet "mongodb://localhost:27017/$DB" --eval 'db.runCommand({ping:1})' >/dev/null
echo "==> mongod reachable (auth currently off)"
APP_PW=$(openssl rand -hex 24)
ADMIN_PW=$(openssl rand -hex 24)
mongosh --quiet "mongodb://localhost:27017/admin" --eval "
  try{db.getSiblingDB('admin').dropUser('admin')}catch(e){}
  db.getSiblingDB('admin').createUser({user:'admin',pwd:'$ADMIN_PW',roles:[{role:'root',db:'admin'}]});
  try{db.getSiblingDB('$DB').dropUser('nalanda_app')}catch(e){}
  db.getSiblingDB('$DB').createUser({user:'nalanda_app',pwd:'$APP_PW',roles:[{role:'readWrite',db:'$DB'}]});
"
echo "==> users created"
cp "$ENV" "$ENV.bak-$TS"
sed -i "s|^MONGO_URL=.*|MONGO_URL=\"mongodb://nalanda_app:${APP_PW}@localhost:27017/${DB}?authSource=${DB}\"|" "$ENV"
grep -q "nalanda_app:" "$ENV" && echo "==> .env updated" || { echo "ENV update failed"; exit 1; }
cp "$MCONF" "$MCONF.bak-$TS"
if ! grep -qE '^security:' "$MCONF"; then
  printf '\nsecurity:\n  authorization: enabled\n' >> "$MCONF"
else
  echo "!! existing 'security:' block — aborting, enable manually"; exit 1
fi
echo "==> mongod.conf authorization enabled"
systemctl restart mongod; sleep 2
systemctl restart nalanda-backend.service; sleep 2
CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST https://nalandadata.ai/api/leads \
  -H 'Content-Type: application/json' \
  -d '{"full_name":"Auth Test","work_email":"authtest@example.com","company":"Acme","role":"Eng","company_type":"AI Lab","use_case":"Pretraining","dataset_interest":"Custom dataset","mobile_country_code":"+91","mobile_number":"1","message":"[TEST] post-auth check"}')
if [ "$CODE" = "200" ]; then
  echo ""; echo "SUCCESS - auth enabled, backend still writing leads (POST -> 200)."
  if mongosh --quiet "mongodb://localhost:27017/$DB" --eval 'db.leads.countDocuments()' >/dev/null 2>&1; then
    echo "WARNING: anonymous read still works - check mongod.conf."
  else echo "Confirmed: anonymous Mongo access denied."; fi
  mongosh --quiet "mongodb://admin:${ADMIN_PW}@localhost:27017/$DB?authSource=admin" --eval 'db.leads.deleteMany({message:/\[TEST\]/})' >/dev/null || true
  echo ""; echo ">>> SAVE THIS (password manager): admin / $ADMIN_PW"
  echo "    app password lives only in $ENV"
else
  echo ""; echo "POST -> $CODE - backend cannot reach Mongo. ROLLING BACK..."
  cp "$ENV.bak-$TS" "$ENV"; cp "$MCONF.bak-$TS" "$MCONF"
  systemctl restart mongod; sleep 2; systemctl restart nalanda-backend.service
  echo "Rolled back to no-auth. Site restored."; exit 1
fi
