// ============================================================================
// DATA RESOURCES (Clinical Rounding Structure aligned with NABH/JCI)
// ============================================================================

// QUICK ROUND (Pages 1-3)
const QUICK_DOC_CONTROL = ["Document number", "Version/Effective date", "Prepared by", "Reviewed by (Nursing/Quality/IPC/Medical)", "Approved by", "Review date"];
const QUICK_SEC2 = [
  "Patient census, occupancy, patient acuity and workload reviewed",
  "Staffing adequacy, skill mix, attendance and patient allocation verified",
  "Structured handover and pending clinical tasks reviewed",
  "Patient identification and identification-band compliance verified, where applicable",
  "Nursing assessments, care plans, reassessments and records reviewed",
  "Medication orders, administration, storage and high-alert safeguards verified",
  "Hand hygiene, PPE, aseptic practice, waste segregation and sharps safety verified",
  "Deterioration recognition and escalation arrangements confirmed",
  "Emergency trolley, essential equipment and emergency supplies checked",
  "Patient privacy, dignity, communication and education maintained",
  "Environmental cleanliness, facility safety and equipment maintenance reviewed",
  "Incident reporting, quality indicators and previous audit findings reviewed",
  "Staff competency, training requirements and professional conduct assessed",
  "Previous corrective actions verified for effectiveness"
];
const QUICK_UNIT_DETAILS = ["Unit/department", "Date/time/shift", "Rounding leader", "Nurse In-charge", "Total beds / occupied beds", "Required / available staff", "High-risk patients or concerns"];

// COMPREHENSIVE ROUND (Pages 8-18)
const COMP_GENERAL = ["Hospital/Unit/Ward", "Date", "Rounding time / Shift", "Name of Nursing Leader", "Nurse In-charge on duty", "Total beds / Occupied beds", "Nurses required / Available", "Patient acuity/High-risk patients", "Previous round's pending actions"];
const COMP_SEC_B = [
  { group: "1. Staffing and duty management", items: ["1.1 Adequate staffing based on census, acuity and workload", "1.2 Appropriate patient allocation and workload distribution", "1.3 Attendance, punctuality, uniform and identification badges", "1.4 Staff competency and deployment according to skill mix", "1.5 Break coverage and availability of emergency replacement"] },
  { group: "2. Nursing station organization", items: ["2.1 Nursing station clean, organized and free from clutter", "2.2 Patient census, bed status and admission/discharge updates accurate", "2.3 Current duty roster, contact list and escalation details available", "2.4 Patient records and nursing documents properly maintained and secured", "2.5 Pending investigations, procedures and clinical reviews tracked", "2.6 Nursing staff present at the station when required"] },
  { group: "3. Handover and communication", items: ["3.1 Structured shift handover completed with critical information", "3.2 High-risk patients and pending clinical issues communicated", "3.3 Verbal orders and critical results managed according to policy", "3.4 Escalation of deterioration, incidents and delays documented", "3.5 Huddles, rounds and multidisciplinary coordination conducted"] },
  { group: "4. Medication management", items: ["4.1 Medication storage, segregation and expiry checks compliant", "4.2 High-alert and look-alike/sound-alike medications managed safely", "4.3 Controlled drugs and narcotics accounted for as per policy", "4.4 Medication administration records complete and accurate", "4.5 Omitted, delayed and pending medications followed up", "4.6 Medication refrigerator temperature and storage conditions monitored"] },
  { group: "5. Infection prevention and control", items: ["5.1 Hand hygiene facilities and compliance satisfactory", "5.2 PPE available and appropriately used", "5.3 Sharps containers correctly positioned and not overfilled", "5.4 Bio-medical waste segregation and disposal compliant", "5.5 Cleaning schedules and environmental hygiene monitored", "5.6 Isolation precautions and transmission-based precautions followed"] },
  { group: "6. Equipment and supplies", items: ["6.1 Emergency trolley/crash cart/ refrigerator checked as per policy", "6.2 Emergency equipment functional and ready for use", "6.3 Oxygen, suction and other essential utilities available", "6.4 Essential nursing consumables and emergency supplies available", "6.5 Equipment faults reported and tracked until resolution"] },
  { group: "7. Documentation and administrative control", items: ["7.1 Nursing assessment, care plans and reassessments complete", "7.2 Vital signs and monitoring records completed on time", "7.3 Intake/output, pain scores and other relevant assessments documented", "7.4 Incident reports and corrective actions completed as applicable", "7.5 Pending discharge, transfer and billing-related nursing tasks followed up"] },
  { group: "8. Professionalism and patient experience", items: ["8.1 Staff demonstrate respectful communication and professional conduct", "8.2 Patient complaints and concerns acknowledged and escalated", "8.3 Privacy, confidentiality and patient dignity maintained", "8.4 Patient call bells and requests respond to promptly", "8.5 Patient/family education and discharge instructions addressed"] }
];
const COMP_SEC_3 = [
  { param: "Patient identification", desc: "Two approved identifiers and identification band" },
  { param: "Clinical condition", desc: "Current condition, vital signs, early warning score, deterioration risks" },
  { param: "Nursing care plan", desc: "Individualized plan, goals, interventions and reassessment" },
  { param: "Medication safety", desc: "Medication orders, administration, allergies and adverse effects" },
  { param: "IV lines and devices", desc: "Site condition, necessity, securement, date/labeling and infection prevention" },
  { param: "Fall prevention", desc: "Risk assessment, precautions, call bell and environmental safety" },
  { param: "Pressure injury prevention", desc: "Risk assessment, skin condition, repositioning and preventive measures" },
  { param: "Infection prevention", desc: "Hand hygiene, aseptic technique, device care and isolation precautions" },
  { param: "Pain and comfort", desc: "Pain assessment, intervention and reassessment" },
  { param: "Nutrition and elimination", desc: "Intake, diet, hydration, bowel/bladder needs" },
  { param: "Investigations & treatment", desc: "Pending reports, procedures, referrals and timely escalation" },
  { param: "Patient communication", desc: "Patient understanding, concerns, education and plan of care" },
  { param: "Transfer/discharge readiness", desc: "Clinical readiness, documentation, and medication reconciliation" },
  { param: "High-risk care", desc: "Specific monitoring and precautions appropriate to patient's condition" }
];
const COMP_SUMMARY_TEXT = [
  "Immediate patient safety concerns", "Major clinical practice gaps", "Documentation gaps", "Environmental/equipment issues",
  "Staff training or competency needs", "Patient/family concerns", "Good practices observed", "Priority actions for next 24 hours", "Issues requiring management support"
];
const COMP_SIGNATURES = ["Nurse In-charge", "Rounding Nurse Leader", "Nursing Manager / ANS review", "Follow-up date and time"];

const DEFAULT_MOM_TOPICS = [
  { topic: "Mobile Phone Usage", discussion: "- Using personal mobile phones for private calls during duty hours is not allowed.\n- Each unit will be given a separate official phone.", action: "➤ Monitor the staffs", responsibility: "ALL STAFF" },
  { topic: "Leave", discussion: "- Staff members who take leave must fill out their leave card on time.\n- Leaves must be applied in the system.", action: "", responsibility: "ALL STAFF" },
  { topic: "CNE Attendance", discussion: "- Mark attendance in the CNE register on that day itself.", action: "", responsibility: "ALL STAFF" },
  { topic: "Linen Management", discussion: "- Torn or damaged linen should never be used for patients.\n- Minimum emergency stock must be ready.", action: "", responsibility: "ALL STAFF" },
  { topic: "Difficult IV Cannulation", discussion: "- Take help from a senior staff member.\n- Escalate to duty supervisor if required.", action: "", responsibility: "ALL STAFF" },
  { topic: "Handover and Patient Transfer", discussion: "- Proper bedside handover must be strictly followed.\n- Check vitals, IV lines, and records.", action: "", responsibility: "ALL STAFF" },
  { topic: "Patient Complaints", discussion: "- Complaints should be checked and sorted out as early as possible.", action: "", responsibility: "ALL STAFF" },
  { topic: "Staff as Brand Ambassadors", discussion: "- Behave professionally and ensure a pleasant experience.", action: "", responsibility: "ALL STAFF" }
];

// ============================================================================
// SYSTEM & UI INITIALIZATION
// ============================================================================
function switchTab(tabId, btn) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  btn.classList.add('active');
}
function switchSubTab(tabId, btn) {
  document.querySelectorAll('.sub-tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.sub-tab-btn').forEach(t => t.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  btn.classList.add('active');
}
function getLocalISODate() { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().split('T')[0]; }

window.onload = function () {
  const now = new Date();
  document.getElementById('report-month').value = `${now.toLocaleString('en-US', { month: 'long' }).toUpperCase()} - ${now.getFullYear()}`;
  document.getElementById('mom-date').value = now.toLocaleDateString('en-GB');

  const todayStr = getLocalISODate();
  document.getElementById('rounding-date').value = todayStr;
  document.getElementById('report-end-date').value = todayStr;
  const lastWeek = new Date(); lastWeek.setDate(lastWeek.getDate() - 6);
  document.getElementById('report-start-date').value = lastWeek.toISOString().split('T')[0];

  renderMOMTable(DEFAULT_MOM_TOPICS);
  renderClinicalRoundingForms();
  loadRoundingDataForDate();

  const savedKey = localStorage.getItem('geminiApiKey');
  if (savedKey) document.getElementById('api-key-input').value = savedKey;
  else document.getElementById('apiSettingsPanel').style.display = 'block';
};

function toggleApiSettings() {
  const p = document.getElementById('apiSettingsPanel'); p.style.display = (p.style.display === 'none' || p.style.display === '') ? 'block' : 'none';
}
function saveApiKey() {
  const key = document.getElementById('api-key-input').value.trim();
  if (key === "") return alert("Please enter a key.");
  localStorage.setItem('geminiApiKey', key); alert("API Key saved!");
  document.getElementById('apiSettingsPanel').style.display = 'none';
}

// ============================================================================
// UNIVERSAL AI ROUTER
// ============================================================================
async function callAIProvider(prompt, apiKey, loadingEl) {
  if (apiKey.startsWith("gsk_")) {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` }, body: JSON.stringify({ model: "llama-3.3-70b-versatile", temperature: 0.2, messages: [{ role: "user", content: prompt }] }) });
    const data = await res.json(); if (data.error) throw new Error(data.error.message); return data.choices[0].message.content;
  } else if (apiKey.startsWith("sk-")) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` }, body: JSON.stringify({ model: "gpt-4o-mini", temperature: 0.2, messages: [{ role: "user", content: prompt }] }) });
    const data = await res.json(); if (data.error) throw new Error(data.error.message); return data.choices[0].message.content;
  } else {
    // UPDATED: Now points strictly to the 3.8 models to bypass the 2.5 restriction
    let candidateModels = ['gemini-3.8-flash', 'gemini-3.8-flash-lite', 'gemini-pro'];
    let lastError = "";
    for (const model of candidateModels) {
      try {
        if (loadingEl) loadingEl.innerText = `Communicating with AI (${model})...`;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.2 } }) });
        const data = await response.json();
        const parts = data.candidates?.[0]?.content?.parts;
        if (Array.isArray(parts) && parts.length > 0) {
          const ans = parts.filter(p => !p.thought && p.text?.trim().length > 0);
          if (ans.length > 0) return ans[ans.length - 1].text;
        } else if (data.error) lastError = data.error.message;
      } catch (err) { lastError = err.message; }
    }
    throw new Error(lastError || "All servers busy.");
  }
}

// ============================================================================
// TAB 4: CLINICAL ROUNDING (DYNAMIC RENDERING & STORAGE)
// ============================================================================

function getRoundingDataStore() { return JSON.parse(localStorage.getItem('NursingRoundingFullDBV2') || '{}'); }

function genInput(idPrefix, label, isTextarea = false) {
  return `<div class="form-group"><label>${label}:</label>${isTextarea ? `<textarea id="${idPrefix}" rows="2"></textarea>` : `<input type="text" id="${idPrefix}">`}</div>`;
}

function renderClinicalRoundingForms() {
  // --- QUICK ROUND (Pages 1-3) ---
  const qDoc = document.getElementById('quick-doc-control');
  QUICK_DOC_CONTROL.forEach((l, i) => qDoc.innerHTML += genInput(`q-doc-${i}`, l));

  const qSec2 = document.getElementById('quick-sec2-body');
  QUICK_SEC2.forEach((text, i) => {
    qSec2.innerHTML += `<tr><td class="col-no">${i + 1}</td><td>${text}</td><td class="td-rating"><select id="q-s2-rating-${i}"><option value="C">C</option><option value="PC">PC</option><option value="NC">NC</option><option value="NA">NA</option><option value="CR">CR</option></select></td><td class="td-remarks"><input type="text" id="q-s2-rmk-${i}"></td></tr>`;
  });

  const qUnit = document.getElementById('quick-unit-details');
  QUICK_UNIT_DETAILS.forEach((l, i) => qUnit.innerHTML += genInput(`q-unit-${i}`, l, l.includes('High-risk')));

  // --- COMPREHENSIVE ROUND (Pages 8-18) ---
  const cGen = document.getElementById('comp-general-info');
  COMP_GENERAL.forEach((l, i) => cGen.innerHTML += genInput(`c-gen-${i}`, l, l.includes('Pending') || l.includes('High-risk')));

  const cSecB = document.getElementById('comp-secB-body');
  let bIndex = 0;
  COMP_SEC_B.forEach(group => {
    cSecB.innerHTML += `<tr><td colspan="4" class="table-header-row">${group.group}</td></tr>`;
    group.items.forEach(item => {
      const no = item.split(' ')[0]; const text = item.replace(no, '').trim();
      cSecB.innerHTML += `<tr><td class="col-no">${no}</td><td>${text}</td><td class="td-rating"><select id="c-sb-rating-${bIndex}"><option value="C">C</option><option value="NC">NC</option><option value="NA">NA</option></select></td><td class="td-remarks"><input type="text" id="c-sb-rmk-${bIndex}"></td></tr>`;
      bIndex++;
    });
  });

  const cSec3 = document.getElementById('comp-sec3-body');
  COMP_SEC_3.forEach((item, i) => {
    cSec3.innerHTML += `<tr><td class="col-no">${i + 1}</td><td><strong>${item.param}</strong><br><span style="font-size:11px;color:#666;">${item.desc}</span></td><td class="td-rating"><select id="c-s3-rating-${i}"><option value="C">C</option><option value="PC">PC</option><option value="NC">NC</option><option value="NA">NA</option><option value="CR">CR</option></select></td><td class="td-remarks"><input type="text" id="c-s3-rmk-${i}"></td></tr>`;
  });

  const cSumTxt = document.getElementById('comp-summary-text-fields');
  COMP_SUMMARY_TEXT.forEach((l, i) => cSumTxt.innerHTML += genInput(`c-sum-${i}`, l, true));

  const cSumSig = document.getElementById('comp-summary-signatures');
  COMP_SIGNATURES.forEach((l, i) => cSumSig.innerHTML += genInput(`c-sig-${i}`, l));
}

function addCapaRow(data = {}) {
  const tbody = document.getElementById('capa-table-body');
  const tr = document.createElement('tr');
  tr.innerHTML = `
        <td><textarea class="capa-input" rows="2">${data.gap || ''}</textarea></td>
        <td><select class="capa-select"><option value="Low" ${data.risk === 'Low' ? 'selected' : ''}>Low</option><option value="Medium" ${data.risk === 'Medium' ? 'selected' : ''}>Medium</option><option value="High" ${data.risk === 'High' ? 'selected' : ''}>High</option></select></td>
        <td><textarea class="capa-input" rows="2">${data.correction || ''}</textarea></td>
        <td><input type="text" class="capa-input" value="${data.responsible || ''}"></td>
        <td><input type="text" class="capa-input" placeholder="Date/Time" value="${data.targetDate || ''}"></td>
        <td><select class="capa-select"><option value="Open" ${data.status === 'Open' ? 'selected' : ''}>Open</option><option value="In progress" ${data.status === 'In progress' ? 'selected' : ''}>In progress</option><option value="Closed" ${data.status === 'Closed' ? 'selected' : ''}>Closed</option><option value="Escalated" ${data.status === 'Escalated' ? 'selected' : ''}>Escalated</option></select></td>
        <td style="text-align:center;"><button class="row-action-btn del-row-btn" onclick="this.closest('tr').remove()">&times;</button></td>
    `;
  tbody.appendChild(tr);
}

function loadRoundingDataForDate() {
  const date = document.getElementById('rounding-date').value;
  const store = getRoundingDataStore(); const d = store[date] || {};

  // Load Quick
  const qd = d.quick || {};
  QUICK_DOC_CONTROL.forEach((_, i) => document.getElementById(`q-doc-${i}`).value = qd.doc?.[i] || '');
  QUICK_SEC2.forEach((_, i) => {
    document.getElementById(`q-s2-rating-${i}`).value = qd.sec2?.[i]?.r || 'C';
    document.getElementById(`q-s2-rmk-${i}`).value = qd.sec2?.[i]?.m || '';
  });
  QUICK_UNIT_DETAILS.forEach((_, i) => document.getElementById(`q-unit-${i}`).value = qd.unit?.[i] || '');

  // Load Comprehensive
  const cd = d.comp || {};
  COMP_GENERAL.forEach((_, i) => document.getElementById(`c-gen-${i}`).value = cd.gen?.[i] || '');

  let bIdx = 0;
  COMP_SEC_B.forEach(g => g.items.forEach(() => {
    document.getElementById(`c-sb-rating-${bIdx}`).value = cd.secB?.[bIdx]?.r || 'C';
    document.getElementById(`c-sb-rmk-${bIdx}`).value = cd.secB?.[bIdx]?.m || '';
    bIdx++;
  }));

  COMP_SEC_3.forEach((_, i) => {
    document.getElementById(`c-s3-rating-${i}`).value = cd.sec3?.[i]?.r || 'C';
    document.getElementById(`c-s3-rmk-${i}`).value = cd.sec3?.[i]?.m || '';
  });

  document.getElementById('capa-table-body').innerHTML = "";
  if (cd.capa && cd.capa.length > 0) cd.capa.forEach(act => addCapaRow(act)); else addCapaRow();

  document.getElementById('comp-sum-overall').value = cd.sumOver || 'Stable';
  document.getElementById('comp-sum-staffing').value = cd.sumStaff || 'Adequate';
  COMP_SUMMARY_TEXT.forEach((_, i) => document.getElementById(`c-sum-${i}`).value = cd.sumTxt?.[i] || '');
  COMP_SIGNATURES.forEach((_, i) => document.getElementById(`c-sig-${i}`).value = cd.sumSig?.[i] || '');
}

function saveRoundingDataForDate() {
  const date = document.getElementById('rounding-date').value;
  if (!date) return alert("Select a date.");

  // Scrape Quick
  const quick = { doc: [], sec2: [], unit: [] };
  QUICK_DOC_CONTROL.forEach((_, i) => quick.doc.push(document.getElementById(`q-doc-${i}`).value.trim()));
  QUICK_SEC2.forEach((_, i) => quick.sec2.push({ r: document.getElementById(`q-s2-rating-${i}`).value, m: document.getElementById(`q-s2-rmk-${i}`).value.trim() }));
  QUICK_UNIT_DETAILS.forEach((_, i) => quick.unit.push(document.getElementById(`q-unit-${i}`).value.trim()));

  // Scrape Comprehensive
  const comp = { gen: [], secB: [], sec3: [], capa: [], sumTxt: [], sumSig: [] };
  COMP_GENERAL.forEach((_, i) => comp.gen.push(document.getElementById(`c-gen-${i}`).value.trim()));

  let bIdx = 0;
  COMP_SEC_B.forEach(g => g.items.forEach(() => {
    comp.secB.push({ r: document.getElementById(`c-sb-rating-${bIdx}`).value, m: document.getElementById(`c-sb-rmk-${bIdx}`).value.trim() });
    bIdx++;
  }));

  COMP_SEC_3.forEach((_, i) => comp.sec3.push({ r: document.getElementById(`c-s3-rating-${i}`).value, m: document.getElementById(`c-s3-rmk-${i}`).value.trim() }));

  document.querySelectorAll('#capa-table-body tr').forEach(tr => {
    const i = tr.querySelectorAll('.capa-input, .capa-select');
    if (i[0].value.trim()) comp.capa.push({ gap: i[0].value.trim(), risk: i[1].value, correction: i[2].value.trim(), responsible: i[3].value.trim(), targetDate: i[4].value, status: i[5].value });
  });

  comp.sumOver = document.getElementById('comp-sum-overall').value;
  comp.sumStaff = document.getElementById('comp-sum-staffing').value;
  COMP_SUMMARY_TEXT.forEach((_, i) => comp.sumTxt.push(document.getElementById(`c-sum-${i}`).value.trim()));
  COMP_SIGNATURES.forEach((_, i) => comp.sumSig.push(document.getElementById(`c-sig-${i}`).value.trim()));

  const store = getRoundingDataStore();
  store[date] = { quick, comp };
  localStorage.setItem('NursingRoundingFullDBV2', JSON.stringify(store));
  alert(`Rounding data saved securely for ${date}!`);
}

// ---------------- EXPORT NATIVE EXCEL ---------------- //
function exportRoundingDataToExcel() {
  const store = getRoundingDataStore(); const dates = Object.keys(store).sort();
  if (dates.length === 0) return alert("No data saved yet.");

  const secBTitles = []; COMP_SEC_B.forEach(g => g.items.forEach(i => secBTitles.push(i)));
  let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><style>table{border-collapse:collapse;margin-bottom:20px;} th,td{border:1px solid #000;padding:5px;vertical-align:top;} th{background-color:#163a5f;color:white;} .h{background-color:#e9ecef;font-weight:bold;} .d{background-color:#0d9488;color:white;font-size:14pt;font-weight:bold;} .qh{background-color:#f0ad4e;color:white;font-weight:bold;}</style></head><body><h2>Clinical Rounding Export</h2>`;

  dates.forEach(date => {
    const d = store[date]; const q = d.quick; const c = d.comp;
    html += `<table><tr><td colspan="6" class="d">DATE: ${date}</td></tr>`;

    // --- EXPORT QUICK ROUND ---
    html += `<tr><td colspan="6" class="qh">--- QUICK ROUND (Pages 1-3) ---</td></tr>`;
    html += `<tr><th colspan="2">Document Control</th><th colspan="4">Value</th></tr>`;
    QUICK_DOC_CONTROL.forEach((l, i) => html += `<tr><td colspan="2">${l}</td><td colspan="4">${q.doc[i] || ''}</td></tr>`);

    html += `<tr><th colspan="2">Unit Details</th><th colspan="4">Value</th></tr>`;
    QUICK_UNIT_DETAILS.forEach((l, i) => html += `<tr><td colspan="2">${l}</td><td colspan="4">${(q.unit[i] || '').replace(/\n/g, '<br>')}</td></tr>`);

    html += `<tr><th>No.</th><th colspan="3">Common Checkpoint</th><th>Rating</th><th>Findings</th></tr>`;
    q.sec2.forEach((item, i) => { if (item.r !== 'C' || item.m) html += `<tr><td>${i + 1}</td><td colspan="3">${QUICK_SEC2[i]}</td><td>${item.r}</td><td>${(item.m || '').replace(/\n/g, '<br>')}</td></tr>`; });

    // --- EXPORT COMPREHENSIVE ROUND ---
    html += `<tr><td colspan="6" style="height:15px; border:none;"></td></tr>`;
    html += `<tr><td colspan="6" class="qh" style="background:#0275d8;">--- COMPREHENSIVE ROUND (Pages 8-18) ---</td></tr>`;
    html += `<tr><th colspan="2">General Information</th><th colspan="4">Value</th></tr>`;
    COMP_GENERAL.forEach((l, i) => html += `<tr><td colspan="2">${l}</td><td colspan="4">${(c.gen[i] || '').replace(/\n/g, '<br>')}</td></tr>`);

    html += `<tr><td colspan="6" class="h">B. Nursing Station & Ward Management</td></tr>`;
    html += `<tr><th>No.</th><th colspan="3">Observation</th><th>Rating</th><th>Findings</th></tr>`;
    c.secB.forEach((item, i) => { if (item.r !== 'C' || item.m) html += `<tr><td>${secBTitles[i].split(' ')[0]}</td><td colspan="3">${secBTitles[i].replace(/^[\d\.]+ /, '')}</td><td>${item.r}</td><td>${(item.m || '').replace(/\n/g, '<br>')}</td></tr>`; });

    html += `<tr><td colspan="6" class="h">3. Clinical Patient Rounding</td></tr>`;
    html += `<tr><th>No.</th><th colspan="3">Parameter</th><th>Rating</th><th>Findings</th></tr>`;
    c.sec3.forEach((item, i) => { if (item.r !== 'C' || item.m) html += `<tr><td>${i + 1}</td><td colspan="3">${COMP_SEC_3[i].param}</td><td>${item.r}</td><td>${(item.m || '').replace(/\n/g, '<br>')}</td></tr>`; });

    html += `<tr><td colspan="6" class="h">4. CAPA Tracker</td></tr>`;
    html += `<tr><th colspan="2">Gap</th><th>Risk</th><th>Correction</th><th>Target Date/Resp.</th><th>Status</th></tr>`;
    if (c.capa) c.capa.forEach(a => html += `<tr><td colspan="2">${(a.gap || '').replace(/\n/g, '<br>')}</td><td>${a.risk}</td><td>${(a.correction || '').replace(/\n/g, '<br>')}</td><td>${a.targetDate} / ${a.responsible}</td><td>${a.status}</td></tr>`);

    html += `<tr><td colspan="6" class="h">5. Summary & Signatures</td></tr>`;
    html += `<tr><th colspan="2">Overall Status</th><td colspan="4">${c.sumOver || ''}</td></tr>`;
    html += `<tr><th colspan="2">Staffing</th><td colspan="4">${c.sumStaff || ''}</td></tr>`;
    COMP_SUMMARY_TEXT.forEach((l, i) => { if (c.sumTxt[i]) html += `<tr><th colspan="2">${l}</th><td colspan="4">${c.sumTxt[i].replace(/\n/g, '<br>')}</td></tr>`; });
    COMP_SIGNATURES.forEach((l, i) => { if (c.sumSig[i]) html += `<tr><th colspan="2">${l} (Signature)</th><td colspan="4">${c.sumSig[i]}</td></tr>`; });

    html += `<tr><td colspan="6" style="border:none; height:20px;"></td></tr></table>`;
  });

  html += `</body></html>`;
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([html], { type: 'application/vnd.ms-excel' }));
  a.download = `Rounding_Export_${new Date().toISOString().split('T')[0]}.xls`; document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

async function generateWeeklyRoundingReport() {
  const apiKey = (localStorage.getItem('geminiApiKey') || "").trim();
  if (!apiKey) return alert("Save API Key in settings.");
  const sd = document.getElementById('report-start-date').value; const ed = document.getElementById('report-end-date').value;
  if (!sd || !ed || sd > ed) return alert("Select valid date range.");

  const store = getRoundingDataStore(); let raw = ""; let dc = 0;
  const secBTitles = []; COMP_SEC_B.forEach(g => g.items.forEach(i => secBTitles.push(i)));

  Object.keys(store).sort().forEach(date => {
    if (date >= sd && date <= ed) {
      dc++; const c = store[date].comp;
      raw += `\n--- DATE: ${date} ---\nWard: ${c.gen[0] || 'N/A'} | Overall: ${c.sumOver || 'N/A'} | Staffing: ${c.sumStaff || 'N/A'}\n`;
      c.secB.forEach((cp, i) => { if (cp.r !== 'C' || cp.m) raw += `[Sec B] ${secBTitles[i]}: ${cp.r} - ${cp.m}\n`; });
      c.sec3.forEach((cp, i) => { if (cp.r !== 'C' || cp.m) raw += `[Sec 3] ${COMP_SEC_3[i].param}: ${cp.r} - ${cp.m}\n`; });
      c.capa.forEach(a => { raw += `[CAPA] ${a.risk} Risk: ${a.gap} -> Fix: ${a.correction} (${a.status})\n`; });
      if (c.sumTxt[0]) raw += `Safety Concerns: ${c.sumTxt[0]}\n`;
    }
  });

  if (!raw) return alert("No Comprehensive round data found for this range.");

  const loadingEl = document.getElementById('rounding-loading'); loadingEl.style.display = 'block';
  const prompt = `You are an expert Nursing In-Charge preparing an "Executive Clinical Rounding Summary".
STRICT RULES:
1. Base your report STRICTLY on the data below. Do not invent trends, gaps, or actions.
2. If only one day is provided, explicitly state "Based on a single day of rounding...".

Structure:
1. Overall Unit Stability & Staffing
2. Patient Safety & Clinical Care Findings
3. Corrective Actions Taken (CAPA)
4. Management Support Required

DATA (${dc} days):
${raw}`;

  try {
    document.getElementById('rounding-final-report').value = await callAIProvider(prompt, apiKey, loadingEl);
    document.getElementById('rounding-output-section').style.display = 'block';
  } catch (e) { alert("API Error: " + e.message); } finally { loadingEl.style.display = 'none'; }
}

function downloadRoundingWeeklyPDF() {
  const s = document.getElementById('report-start-date').value; const e = document.getElementById('report-end-date').value;
  const txt = document.getElementById('rounding-final-report').value.replace(/\n/g, '<br>');
  const win = window.open('', '_blank');
  win.document.write(`<html><body onload="window.print()" style="font-family:sans-serif;padding:40px;line-height:1.6;"><h2>Executive Clinical Rounding Summary</h2><p style="color:#666;font-style:italic;">Period: ${s} to ${e}</p><div>${txt}</div><div style="margin-top:60px;border-top:1px solid #333;width:250px;padding-top:5px;text-align:center;">Nursing In-Charge Signature</div></body></html>`);
  win.document.close();
}

// ============================================================================
// PRESERVED ACTIVITY & MOM LOGIC
// ============================================================================
function parseTableFromAI(rawText) {
  if (!rawText) throw new Error("Empty AI response.");
  const lines = rawText.replace(/```[a-z]*/gi, "").replace(/```/g, "").trim().split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  const tagged = lines.filter(l => l.toUpperCase().startsWith("ROW||") || l.toUpperCase().startsWith("ROW ||"));
  const rows = []; const seen = new Set();
  for (let line of (tagged.length > 0 ? tagged : lines)) {
    if (/^[\|\-\s:]+$/.test(line)) continue; line = line.replace(/^ROW\s*\|\|\s*/i, "");
    let p = line.includes("||") ? line.split("||").map(x => x.trim()) : line.replace(/^\|/, "").replace(/\|$/, "").split("|").map(x => x.trim());
    if (p.length >= 4) {
      if (p.length >= 5 && (/^\d+[\.\)]?$/.test(p[0]) || p[0].toLowerCase().includes("no"))) p.shift();
      let focus = p[0].replace(/^\*?Row\s*\d+\s*:\*?\s*/i, "").replace(/^\d+[\.\)]\s*/, "").replace(/^[\-\*]+\s*/, "").replace(/\*\*/g, "").replace(/`/g, "").trim();
      let act = p[1].replace(/\*\*/g, "").replace(/`/g, "").trim();
      if (focus.toLowerCase() === "focus area" || act.toLowerCase() === "activities") continue;
      const sig = `${focus.toLowerCase()}|${act.toLowerCase()}`;
      if (seen.has(sig)) continue; seen.add(sig);
      rows.push({ focus_area: focus, activities: act, key_activities: p[2].replace(/\*\*/g, "").replace(/`/g, "").trim(), evidence: p[3].replace(/\*\*/g, "").replace(/`/g, "").trim() });
    }
  }
  if (rows.length > 0) return rows; throw new Error("Could not format table.");
}
function parseSingleRowFromAI(rawText, fallbackRow) { try { const parsed = parseTableFromAI(rawText); if (parsed && parsed.length > 0) return parsed[0]; } catch (e) { } return fallbackRow; }
async function generateAIReport(mode) {
  const key = (localStorage.getItem('geminiApiKey') || "").trim(); if (!key) return alert("Save API Key.");
  const notes = ['patient', 'docs', 'staff', 'ward'].map(id => { const val = document.getElementById(`note-${id}`).value.trim(); return val ? `- ${id}: ${val}` : null; }).filter(n => n);
  if (!notes.length) return alert("Type notes first.");
  const lEl = document.getElementById('loading'); lEl.style.display = 'block';
  try {
    if (mode === 'table') {
      const rows = parseTableFromAI(await callAIProvider(`Nursing tabular report. Output lines starting with "ROW||": ROW||Focus area||Activities||Key activities||Evidence\nNOTES:\n${notes.join("\n")}`, key, lEl));
      const tb = document.getElementById('activity-table-body'); tb.innerHTML = "";
      rows.forEach((r, i) => tb.innerHTML += `<tr><td class="col-no">${i + 1}</td><td contenteditable="true">${r.focus_area || ''}</td><td contenteditable="true">${r.activities || ''}</td><td contenteditable="true">${r.key_activities || ''}</td><td contenteditable="true">${r.evidence || ''}</td><td class="col-actions"><button class="row-action-btn polish-row-btn" onclick="polishSingleRowWithAI(this)">✨</button><button class="row-action-btn del-row-btn" onclick="this.closest('tr').remove()">&times;</button></td></tr>`);
      document.getElementById('ai-table-section').style.display = 'block';
    } else {
      document.getElementById('final-report-text').value = await callAIProvider(`Nursing narrative report.\nNOTES:\n${notes.join("\n")}`, key, lEl);
      document.getElementById('ai-output-section').style.display = 'block';
    }
  } catch (e) { alert(e.message); } finally { lEl.style.display = 'none'; }
}
async function polishEntireTableWithAI() {
  const key = (localStorage.getItem('geminiApiKey') || "").trim(); if (!key) return alert("Save API Key.");
  const trs = document.querySelectorAll('#activity-table-body tr'); if (!trs.length) return;
  const lines = Array.from(trs).map(tr => { const c = tr.querySelectorAll('td'); return `${c[1].innerText.trim()} || ${c[2].innerText.trim()} || ${c[3].innerText.trim()} || ${c[4].innerText.trim()}`; });
  const lEl = document.getElementById('loading'); lEl.style.display = 'block';
  try {
    const rows = parseTableFromAI(await callAIProvider(`Polish table. EXACTLY ${lines.length} lines. Output: ROW||Focus area||Activities||Key activities||Evidence\nROWS:\n${lines.join("\n")}`, key, lEl));
    const tb = document.getElementById('activity-table-body'); tb.innerHTML = "";
    rows.forEach((r, i) => tb.innerHTML += `<tr><td class="col-no">${i + 1}</td><td contenteditable="true">${r.focus_area}</td><td contenteditable="true">${r.activities}</td><td contenteditable="true">${r.key_activities}</td><td contenteditable="true">${r.evidence}</td><td class="col-actions"><button class="row-action-btn polish-row-btn" onclick="polishSingleRowWithAI(this)">✨</button><button class="row-action-btn del-row-btn" onclick="this.closest('tr').remove()">&times;</button></td></tr>`);
  } catch (e) { alert(e.message); } finally { lEl.style.display = 'none'; }
}
function addEmptyTableRow() { document.getElementById('activity-table-body').innerHTML += `<tr><td class="col-no">-</td><td contenteditable="true"></td><td contenteditable="true"></td><td contenteditable="true"></td><td contenteditable="true"></td><td class="col-actions"><button class="row-action-btn del-row-btn" onclick="this.closest('tr').remove()">&times;</button></td></tr>`; }
async function polishSingleRowWithAI(btn) {
  const apiKey = (localStorage.getItem('geminiApiKey') || "").trim(); if (!apiKey) return alert("Save API Key.");
  const tr = btn.closest('tr'); const cells = tr.querySelectorAll('td'); const r = { f: cells[1].innerText, a: cells[2].innerText, k: cells[3].innerText, e: cells[4].innerText };
  const origBtn = btn.innerText; btn.innerText = "⏳"; btn.disabled = true; tr.style.backgroundColor = "#f0fdfa";
  try {
    const pol = parseSingleRowFromAI(await callAIProvider(`Polish row. Output ONE line:\nROW||Focus area||Activities||Key activities||Evidence\nCURRENT: ${r.f} || ${r.a} || ${r.k} || ${r.e}`, apiKey, null), r);
    cells[1].innerText = pol.focus_area || r.f; cells[2].innerText = pol.activities || r.a; cells[3].innerText = pol.key_activities || r.k; cells[4].innerText = pol.evidence || r.e;
  } catch (e) { alert(e.message); } finally { btn.innerText = origBtn; btn.disabled = false; tr.style.backgroundColor = ""; }
}
async function polishNarrativeWithAI() {
  const key = (localStorage.getItem('geminiApiKey') || "").trim(); if (!key) return alert("Save API Key.");
  const txt = document.getElementById('final-report-text').value.trim(); if (!txt) return;
  const lEl = document.getElementById('loading'); lEl.style.display = 'block';
  try { document.getElementById('final-report-text').value = await callAIProvider(`Polish this edited report.\n\n${txt}`, key, lEl); } catch (e) { alert(e.message); } finally { lEl.style.display = 'none'; }
}
function downloadTabularActivityPDF() {
  const my = (document.getElementById('report-month').value || "MONTHLY").toUpperCase().trim(); let rowsHtml = "";
  document.querySelectorAll('#activity-table-body tr').forEach((r, i) => { const c = r.querySelectorAll('td'); rowsHtml += `<tr><td class="col-no">${i + 1}</td><td>${c[1].innerHTML}</td><td>${c[2].innerHTML}</td><td>${c[3].innerHTML}</td><td>${c[4].innerHTML}</td></tr>`; });
  const win = window.open('', '_blank'); win.document.write(`<html><head><title>${my}</title><style>@page{size:A4 landscape;margin:18mm;}body{font-family:sans-serif;}table{width:100%;border-collapse:collapse;}th{background:#163a5f;color:#fff;padding:12px;text-align:left;border:1px solid #163a5f;}td{padding:12px;border:1px solid #ccc;vertical-align:top;}</style></head><body onload="window.print()"><h2>${my} ACTIVITIES REPORT</h2><table><tr><th>No.</th><th>Focus area</th><th>Activities</th><th>Key activities</th><th>Evidence</th></tr>${rowsHtml}</table></body></html>`); win.document.close();
}
function downloadNarrativeActivityPDF() {
  const my = document.getElementById('report-month').value || "Monthly"; const text = document.getElementById('final-report-text').value.replace(/\n/g, '<br>');
  const win = window.open('', '_blank'); win.document.write(`<html><body onload="window.print()" style="font-family:sans-serif;padding:40px;"><h2>${my} - Report</h2><p>${text}</p></body></html>`); win.document.close();
}

function renderMOMTable(rows) { const tb = document.getElementById('mom-table-body'); tb.innerHTML = ""; rows.forEach((r, i) => tb.innerHTML += `<tr><td class="col-no">${i + 1}.</td><td class="col-mom-topic" contenteditable="true">${r.topic || ''}</td><td class="col-mom-disc" contenteditable="true">${r.discussion || ''}</td><td class="col-mom-act" contenteditable="true">${r.action || ''}</td><td class="col-mom-resp" contenteditable="true">${r.responsibility || 'ALL STAFF'}</td><td class="col-actions"><button class="row-action-btn del-row-btn" onclick="this.closest('tr').remove()">&times;</button></td></tr>`); }
function addEmptyMOMRow() { document.getElementById('mom-table-body').innerHTML += `<tr><td class="col-no">-</td><td class="col-mom-topic" contenteditable="true">New</td><td class="col-mom-disc" contenteditable="true"></td><td class="col-mom-act" contenteditable="true"></td><td class="col-mom-resp" contenteditable="true">ALL STAFF</td><td class="col-actions"><button class="row-action-btn del-row-btn" onclick="this.closest('tr').remove()">&times;</button></td></tr>`; }
function resetDefaultMOMRows() { if (confirm("Reset to 8 defaults?")) renderMOMTable(DEFAULT_MOM_TOPICS); }
function parseMOMRowsFromAI(rawText) {
  if (!rawText) throw new Error("Empty response.");
  const lines = rawText.replace(/```[a-z]*/gi, "").replace(/```/g, "").trim().split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  const tagged = lines.filter(l => l.toUpperCase().startsWith("MOM||") || l.toUpperCase().startsWith("MOM ||"));
  const rows = [];
  for (let line of (tagged.length > 0 ? tagged : lines)) {
    if (/^[\|\-\s:]+$/.test(line)) continue; line = line.replace(/^MOM\s*\|\|\s*/i, "");
    let p = line.includes("||") ? line.split("||").map(x => x.trim()) : line.replace(/^\|/, "").replace(/\|$/, "").split("|").map(x => x.trim());
    if (p.length >= 4) {
      if (p.length >= 5 && (/^\d+[\.\)]?$/.test(p[0]) || p[0].toLowerCase().includes("sl"))) p.shift();
      let topic = p[0].replace(/^\d+[\.\)]\s*/, "").replace(/\*\*/g, "").trim(); if (topic.toLowerCase() === "topic") continue;
      rows.push({ topic, discussion: p[1].replace(/<br\s*\/?>/gi, "\n").replace(/\s*;\s*-\s*/g, "\n- ").replace(/\*\*/g, "").trim(), action: p[2].replace(/\*\*/g, "").trim(), responsibility: p[3].replace(/\*\*/g, "").trim() || "ALL STAFF" });
    }
  }
  if (rows.length > 0) return rows; throw new Error("Could not parse MOM rows.");
}
async function appendRoughNotesToMOMWithAI() {
  const key = (localStorage.getItem('geminiApiKey') || "").trim(); if (!key) return alert("Save API Key.");
  const rough = document.getElementById('mom-rough-notes').value.trim(); if (!rough) return;
  const lEl = document.getElementById('mom-loading'); lEl.style.display = 'block';
  try {
    const rows = parseMOMRowsFromAI(await callAIProvider(`Convert meeting notes into MOM table rows. Output lines starting with "MOM||": MOM||Topic||Discussion Points||Action||Responsibility\nUse "<br>" for bullets in Discussion.\n\nNOTES:\n${rough}`, key, lEl));
    const tb = document.getElementById('mom-table-body'); rows.forEach(r => tb.innerHTML += `<tr><td class="col-no">${tb.children.length + 1}.</td><td class="col-mom-topic" contenteditable="true">${r.topic}</td><td class="col-mom-disc" contenteditable="true">${r.discussion}</td><td class="col-mom-act" contenteditable="true">${r.action}</td><td class="col-mom-resp" contenteditable="true">${r.responsibility}</td><td class="col-actions"><button class="row-action-btn del-row-btn" onclick="this.closest('tr').remove()">&times;</button></td></tr>`);
    document.getElementById('mom-rough-notes').value = "";
  } catch (e) { alert(e.message); } finally { lEl.style.display = 'none'; }
}
async function polishEntireMOMWithAI() {
  const key = (localStorage.getItem('geminiApiKey') || "").trim(); if (!key) return alert("Save API Key.");
  const trs = document.querySelectorAll('#mom-table-body tr'); if (!trs.length) return;
  const lines = Array.from(trs).map(tr => { const c = tr.querySelectorAll('td'); return `${c[1].innerText.trim()} || ${c[2].innerText.trim().replace(/\n/g, " <br> ")} || ${c[3].innerText.trim()} || ${c[4].innerText.trim()}`; });
  const lEl = document.getElementById('mom-loading'); lEl.style.display = 'block';
  try { renderMOMTable(parseMOMRowsFromAI(await callAIProvider(`Polish ${lines.length} MOM rows. Keep exactly ${lines.length} rows. Output lines starting with "MOM||": MOM||Topic||Discussion Points||Action||Responsibility\nROWS:\n${lines.join("\n")}`, key, lEl))); } catch (e) { alert(e.message); } finally { lEl.style.display = 'none'; }
}
function downloadMOMPDF() {
  const title = document.getElementById('mom-title').value || "MOM"; const dt = document.getElementById('mom-date').value || ""; let rowsHtml = "";
  document.querySelectorAll('#mom-table-body tr').forEach((r, i) => { const c = r.querySelectorAll('td'); rowsHtml += `<tr><td style="text-align:center;">${i + 1}.</td><td>${c[1].innerText.replace(/\n/g, '<br>')}</td><td>${c[2].innerText.replace(/\n/g, '<br>')}</td><td>${c[3].innerText.replace(/\n/g, '<br>')}</td><td style="text-align:center;">${c[4].innerText.replace(/\n/g, '<br>')}</td></tr>`; });
  const win = window.open('', '_blank'); win.document.write(`<html><head><title>${title}</title><style>@page{size:A4 portrait;margin:15mm;}body{font-family:sans-serif;}table{width:100%;border-collapse:collapse;margin-top:20px;}th,td{border:1px solid #222;padding:10px;}th{background:#163a5f;color:#fff;text-align:left;}</style></head><body onload="window.print()"><h2>${title}</h2><p>Date: ${dt}</p><table><tr><th>Sl. No.</th><th>Topic</th><th>Discussion Points</th><th>Action</th><th>Responsibility</th></tr>${rowsHtml}</table></body></html>`); win.document.close();
}

let reportData = {};
function calculateAnalyzer() {
  const beds = parseInt(document.getElementById('beds').value) || 0, babies = parseInt(document.getElementById('babies').value) || 0, tr = parseInt(document.getElementById('targetRatio').value) || 6;
  const staff = parseInt(document.getElementById('staff').value) || 0, days = parseInt(document.getElementById('days').value) || 0, ns = parseInt(document.getElementById('nursesPerShift').value) || 0;
  const off = (parseInt(document.getElementById('weeklyOffs').value) || 0) + (parseInt(document.getElementById('nightOffs').value) || 0) + (parseInt(document.getElementById('cl').value) || 0) + (parseInt(document.getElementById('ph').value) || 0) + (parseInt(document.getElementById('emergency').value) || 0);
  const maxP = beds + babies; const actR = maxP / (ns || 1); const mar = (staff * (days - off)) - (ns * 3 * days);
  document.getElementById('resMaxPatients').innerText = maxP; document.getElementById('resRatio').innerText = `1:${actR.toFixed(1)}`; document.getElementById('resMargin').innerText = mar; document.getElementById('results').style.display = 'block';
  reportData = { maxPatients, actualRatio: actR.toFixed(1), staff, days, totalShiftsRequired: ns * 3 * days, totalAvailableShifts: staff * (days - off), margin: mar, verdict: mar > 5 ? "Adequate" : mar >= 0 ? "Tight" : "Understaffed" };
}
function downloadCSV() { calculateAnalyzer(); let csv = "Parameter,Value\n"; Object.keys(reportData).forEach(k => csv += `${k},${reportData[k]}\n`); const a = document.createElement('a'); a.href = window.URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'Workforce.csv'; document.body.appendChild(a); a.click(); document.body.removeChild(a); }
function downloadAnalyzerPDF() { calculateAnalyzer(); const win = window.open('', '_blank'); win.document.write(`<html><body onload="window.print()"><h2>Workforce Report</h2><p>Max Patients: ${reportData.maxPatients}</p><p>Margin: ${reportData.margin}</p><p>Verdict: ${reportData.verdict}</p></body></html>`); win.document.close(); }