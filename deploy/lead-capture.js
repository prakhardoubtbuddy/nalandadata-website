/* Nalandadata homepage lead capture — posts to the FastAPI backend at /api/leads.
   External file (CSP-safe under script-src 'self'). No inline handlers. */
(function () {
  "use strict";
  var ENDPOINT = "/api/leads";

  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || ""); }
  function val(id) { var el = document.getElementById(id); return el ? String(el.value || "").trim() : ""; }

  function baseLead() {
    return {
      full_name: "", work_email: "", company: "", role: "",
      company_type: "", use_case: "", dataset_interest: "",
      message: "", mobile_country_code: "", mobile_number: ""
    };
  }

  function makeStatus(anchorEl) {
    var s = document.createElement("div");
    s.style.marginTop = "10px";
    s.style.fontSize = "13px";
    s.style.fontFamily = "var(--mono, monospace)";
    anchorEl.appendChild(s);
    return s;
  }
  function say(status, text, ok) {
    if (!status) return;
    status.textContent = text;
    status.style.color = ok ? "var(--accent, #C8A96E)" : "#ff6b6b";
  }

  function submit(payload, btn, status, successMsg, onOk) {
    if (!isEmail(payload.work_email)) { say(status, "Please enter a valid work email.", false); return; }
    var orig = btn ? btn.textContent : "";
    if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(function (r) {
      if (r.ok) { say(status, successMsg, true); if (onOk) onOk(); }
      else { say(status, "Sorry, something went wrong. Please try again.", false); }
    }).catch(function () {
      say(status, "Network error — please try again.", false);
    }).finally(function () {
      if (btn) { btn.disabled = false; btn.textContent = orig; }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    // 1) Newsletter subscribe (email only)
    var nlBtn = document.getElementById("nl-submit");
    if (nlBtn) {
      var nlStatus = makeStatus(nlBtn.parentNode);
      nlBtn.addEventListener("click", function (e) {
        e.preventDefault();
        var p = baseLead();
        p.work_email = val("nl-email");
        p.use_case = "Newsletter"; p.dataset_interest = "Newsletter";
        p.message = "[Newsletter signup]";
        submit(p, nlBtn, nlStatus, "Subscribed — thank you.", function () {
          var i = document.getElementById("nl-email"); if (i) i.value = "";
        });
      });
    }

    // 2) Send the sample (email + use case)
    var smBtn = document.getElementById("sample-submit");
    if (smBtn) {
      var smStatus = makeStatus(smBtn.parentNode);
      smBtn.addEventListener("click", function (e) {
        e.preventDefault();
        var p = baseLead();
        p.work_email = val("sample-email");
        var uc = val("sample-usecase");
        p.use_case = uc; p.dataset_interest = uc;
        p.message = "[Sample request]";
        submit(p, smBtn, smStatus, "On its way — check your inbox shortly.", function () {
          var i = document.getElementById("sample-email"); if (i) i.value = "";
        });
      });
    }

    // 3) Talk to a researcher (full form)
    var form = document.getElementById("lead-form");
    if (form) {
      var fStatus = makeStatus(form);
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var p = baseLead();
        p.full_name = val("lf-name");
        p.work_email = val("lf-email");
        p.company = val("lf-org");
        var uc = val("lf-usecase");
        p.use_case = uc; p.dataset_interest = uc;
        p.message = val("lf-message");
        if (!p.full_name) { say(fStatus, "Please enter your name.", false); return; }
        var btn = form.querySelector('button[type="submit"], button:not([type])');
        submit(p, btn, fStatus, "Thank you — a researcher will be in touch shortly.", function () {
          form.reset();
        });
      });
    }

    // 4) Contact page — full dataset-access request form
    var cform = document.getElementById("contact-form");
    if (cform) {
      var cStatus = makeStatus(cform);
      cform.addEventListener("submit", function (e) {
        e.preventDefault();
        var p = baseLead();
        p.full_name = val("cf-name");
        p.work_email = val("cf-email");
        p.company = val("cf-company");
        p.role = val("cf-role");
        p.company_type = val("cf-ctype");
        p.use_case = val("cf-usecase");
        p.dataset_interest = val("cf-dataset");
        p.mobile_country_code = val("cf-ccode");
        p.mobile_number = val("cf-mobile");
        p.message = val("cf-message");
        if (!p.full_name) { say(cStatus, "Please enter your full name.", false); return; }
        if (!p.company) { say(cStatus, "Please enter your company.", false); return; }
        if (!p.role) { say(cStatus, "Please enter your role.", false); return; }
        if (!p.company_type) { say(cStatus, "Please select a company type.", false); return; }
        if (!p.use_case) { say(cStatus, "Please select a use case.", false); return; }
        if (!p.dataset_interest) { say(cStatus, "Please select a dataset.", false); return; }
        var btn = cform.querySelector('button[type="submit"], button:not([type])');
        submit(p, btn, cStatus, "Request received — our team will reach out within 24 hours.", function () {
          cform.reset();
        });
      });
    }
  });
})();
