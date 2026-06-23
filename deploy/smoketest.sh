#!/usr/bin/env bash
set -uo pipefail
BASE="https://nalandadata.ai"; ENV=/root/schand/backend/.env
PASS=0; FAIL=0
ok(){ echo "  [PASS] $1"; PASS=$((PASS+1)); }
no(){ echo "  [FAIL] $1"; FAIL=$((FAIL+1)); }
page(){
  local out code body
  out=$(curl -s -w $'\n%{http_code}' "$BASE$1"); code=$(printf '%s' "$out"|tail -n1); body=$(printf '%s' "$out"|sed '$d')
  if [ "$code" = "$2" ]; then
    if printf '%s' "$body"|grep -qF "$3"; then ok "$1 -> $code, '$3' found"; else no "$1 -> $code but marker missing (React fallback?)"; fi
  else no "$1 -> $code (expected $2)"; fi
}
echo "== 1. Pages serve correct static content =="
page "/"                          200 "Verified reasoning data"
page "/research"                  200 "Verified reasoning data"
page "/research/nalandabench"     200 "Verified reasoning data"
page "/research/nalanda-image-vl" 200 "Verified reasoning data"
page "/research/drishtitable"     200 "Verified reasoning data"
page "/benchmarks"                200 "An independent benchmark"
page "/about"                     200 "From the classroom to the frontier model"
page "/solutions"                 200 "Built for every stage of the"
page "/contact"                   200 "Request access to Nalandadata"
echo "== 2. Security headers inherit onto new static page =="
H=$(curl -sI "$BASE/contact")
printf '%s' "$H"|grep -qi 'content-security-policy'   && ok "CSP present on /contact"  || no "CSP missing on /contact"
printf '%s' "$H"|grep -qi 'strict-transport-security' && ok "HSTS present on /contact" || no "HSTS missing on /contact"
echo "== 3. Lead-capture asset =="
out=$(curl -s -w $'\n%{http_code}' "$BASE/lead-capture.js?v=2"); c=$(printf '%s' "$out"|tail -n1); b=$(printf '%s' "$out"|sed '$d')
[ "$c" = "200" ] && ok "/lead-capture.js -> 200" || no "/lead-capture.js -> $c"
printf '%s' "$b"|grep -qF 'contact-form' && ok "contact-form handler in served JS" || no "contact-form handler missing"
echo "== 4. Lead API end-to-end =="
LC=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/leads" -H 'Content-Type: application/json' \
  -d '{"full_name":"Smoke Test","work_email":"smoke@example.com","company":"QA","role":"Tester","company_type":"Other","use_case":"Research","dataset_interest":"Custom dataset","mobile_country_code":"+91","mobile_number":"0","message":"[TEST] smoketest — safe to delete"}')
[ "$LC" = "200" ] && ok "POST /api/leads -> 200" || no "POST /api/leads -> $LC"
sleep 2
MURL=$(grep -E '^MONGO_URL=' "$ENV"|sed -E 's/^MONGO_URL=//; s/^"//; s/"$//')
STORED=$(mongosh --quiet "$MURL" --eval 'db.leads.countDocuments({message:/smoketest/})' 2>/dev/null)
[ "${STORED:-0}" -ge 1 ] && ok "lead stored (read via authed app user)" || no "lead not found in Mongo"
journalctl -u nalanda-backend.service --since "1 min ago" --no-pager|grep -q 'email sent for smoke@example.com' && ok "Resend notification fired" || no "no Resend 'email sent' log"
echo "== 5. Mongo auth enforced =="
if mongosh --quiet "mongodb://localhost:27017/test_database" --eval 'db.leads.countDocuments()' >/dev/null 2>&1; then
  no "anonymous Mongo access ALLOWED (auth NOT enforced!)"; else ok "anonymous Mongo access denied"; fi
mongosh --quiet "$MURL" --eval 'db.runCommand({ping:1})' >/dev/null 2>&1 && ok "app user authenticates" || no "app user cannot authenticate"
mongosh --quiet "$MURL" --eval 'db.leads.deleteMany({message:/smoketest/})' >/dev/null 2>&1 && ok "smoke-test lead cleaned up" || no "cleanup failed"
echo "== 6. Config + backend health =="
nginx -t >/dev/null 2>&1 && ok "nginx config valid" || no "nginx -t failed"
AC=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/")
case "$AC" in 200|404|405) ok "/api/ reachable (HTTP $AC)";; *) no "/api/ -> $AC";; esac
echo ""; echo "============ RESULT: $PASS passed, $FAIL failed ============"
