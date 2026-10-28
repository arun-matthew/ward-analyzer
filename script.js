// ============================================================================
// DATA RESOURCES
// ============================================================================

const DEFAULT_MOM_TOPICS = [
  { topic: "Mobile Phone Usage", discussion: "- Using personal mobile phones for private calls during duty hours is not allowed.\n- Each unit will be given a separate official phone once available.", action: "➤ Monitor the staffs", responsibility: "ALL STAFF" },
  { topic: "Leave", discussion: "- Staff members who take leave must make sure their leave card is filled out on time.\n- All leaves must be entered in the leave record and system.", action: "", responsibility: "ALL STAFF" },
  { topic: "CNE Attendance", discussion: "- Mark attendance in the CNE register on that day itself.\n- Records checked monthly.", action: "", responsibility: "ALL STAFF" },
  { topic: "Linen Management", discussion: "- Torn or damaged linen should never be used for patients.\n- Minimum emergency stock must be maintained.", action: "", responsibility: "ALL STAFF" },
  { topic: "Difficult IV Cannulation", discussion: "- Take help from a senior staff member.\n- Escalate to duty supervisor if required.", action: "", responsibility: "ALL STAFF" },
  { topic: "Handover and Patient Transfer", discussion: "- Proper bedside handover must be strictly followed.\n- Check vitals, IV lines, and records before takeover.", action: "", responsibility: "ALL STAFF" },
  { topic: "Patient Complaints", discussion: "- Complaints should be checked and sorted out as early as possible.", action: "", responsibility: "ALL STAFF" },
  { topic: "Staff as Brand Ambassadors", discussion: "- Work as brand ambassadors by behaving professionally and giving good care.", action: "", responsibility: "ALL STAFF" }
];

const ROUNDING_CHECKPOINTS = [
  "Patient census, occupancy, patient acuity and workload reviewed",
  "Staffing adequacy, skill mix, attendance and patient allocation verified",
  "Structured handover and pending clinical tasks reviewed",
  "Patient identification and identification-band compliance verified",
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

// ============================================================================
// SYSTEM & UI INITIALIZATION
// ============================================================================

function switchTab(tabId, btn) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  btn.classList.add('active');
}

function getLocalISODate() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split('T')[0];
}

window.onload = function () {
  const now = new Date();
  const monthName = now.toLocaleString('en-US', { month: 'long' }).toUpperCase();

  document.getElementById('report-month').value = `${monthName} - ${now.getFullYear()}`;
  document.getElementById('mom-date').value = now.toLocaleDateString('en-GB');

  const todayStr = getLocalISODate();
  document.getElementById('rounding-date').value = todayStr;
  document.getElementById('report-end-date').value = todayStr;

  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 6);
  lastWeek.setMinutes(lastWeek.getMinutes() - lastWeek.getTimezoneOffset());
  document.getElementById('report-start-date').value = lastWeek.toISOString().split('T')[0];

  renderMOMTable(DEFAULT_MOM_TOPICS);
  renderRoundingCheckpoints();
  loadRoundingDataForDate();

  const savedKey = localStorage.getItem('geminiApiKey');
  const apiPanel = document.getElementById('apiSettingsPanel');
  if (savedKey) {
    document.getElementById('api-key-input').value = savedKey;
    apiPanel.style.display = 'none';
  } else {
    apiPanel.style.display = 'block';
  }
};

function toggleApiSettings() {
  const panel = document.getElementById('apiSettingsPanel');
  panel.style.display = (panel.style.display === 'none' || panel.style.display === '') ? 'block' : 'none';
}

function saveApiKey() {
  const key = document.getElementById('api-key-input').value;
  if (key.trim() === "") return alert("Please enter a valid key.");
  localStorage.setItem('geminiApiKey', key.trim());
  alert("API Key saved securely to your browser!");
  document.getElementById('apiSettingsPanel').style.display = 'none';
}

async function callAIProvider(prompt, apiKey, loadingEl) {
  if (apiKey.startsWith("gsk_")) {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({ model: "llama-3.3-70b-versatile", temperature: 0.2, messages: [{ role: "user", content: prompt }] })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message); return data.choices[0].message.content;
  } else if (apiKey.startsWith("sk-")) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({ model: "gpt-4o-mini", temperature: 0.2, messages: [{ role: "user", content: prompt }] })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message); return data.choices[0].message.content;
  } else {
    let candidateModels = ['gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-1.5-flash'];
    let lastError = "";
    for (const model of candidateModels) {
      try {
        if (loadingEl) loadingEl.innerText = `Communicating with AI (${model})...`;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.2 } })
        });
        const data = await response.json();
        const parts = data.candidates?.[0]?.content?.parts;
        if (Array.isArray(parts) && parts.length > 0) {
          const answerParts = parts.filter(p => !p.thought && typeof p.text === "string" && p.text.trim().length > 0);
          const chosenPart = answerParts.length > 0 ? answerParts[answerParts.length - 1] : parts[parts.length - 1];
          if (chosenPart && chosenPart.text) return chosenPart.text;
        } else if (data.error) lastError = data.error.message;
      } catch (err) { lastError = err.message; }
    }
    throw new Error(lastError || "All servers busy. Please try again.");
  }
}

// ============================================================================
// TAB 4: CLINICAL ROUNDING LOGIC (FULL NABH FRAMEWORK)
// ============================================================================

function getRoundingDataStore() {
  return JSON.parse(localStorage.getItem('nursingRoundingFullData') || '{}');
}

function renderRoundingCheckpoints() {
  const container = document.getElementById('checkpoints-container');
  container.innerHTML = "";
  ROUNDING_CHECKPOINTS.forEach((checkpointText, index) => {
    const cpId = `cp-${index + 1}`;
    const html = `
            <div class="cp-card">
                <div class="cp-header">
                    <p class="cp-title">${index + 1}. ${checkpointText}</p>
                    <select id="${cpId}-rating" class="cp-rating">
                        <option value="C">C</option><option value="PC">PC</option><option value="NC">NC</option><option value="NA">NA</option><option value="CR">CR</option>
                    </select>
                </div>
                <input type="text" id="${cpId}-remarks" class="cp-remarks" placeholder="Remarks / Corrective action">
            </div>
        `;
    container.insertAdjacentHTML('beforeend', html);
  });
}

function renderCapaRows(actionsArray) {
  const tbody = document.getElementById('capa-table-body');
  tbody.innerHTML = "";
  if (!actionsArray || actionsArray.length === 0) {
    addCapaRow(); // Add one blank by default
    return;
  }
  actionsArray.forEach(action => addCapaRow(action));
}

function addCapaRow(data = {}) {
  const tbody = document.getElementById('capa-table-body');
  const tr = document.createElement('tr');
  tr.innerHTML = `
        <td><textarea class="capa-input" rows="2" placeholder="Gap observed...">${data.gap || ''}</textarea></td>
        <td>
            <select class="capa-select">
                <option value="Low" ${data.risk === 'Low' ? 'selected' : ''}>Low</option>
                <option value="Medium" ${data.risk === 'Medium' ? 'selected' : ''}>Medium</option>
                <option value="High" ${data.risk === 'High' ? 'selected' : ''}>High</option>
            </select>
        </td>
        <td><textarea class="capa-input" rows="2" placeholder="Action taken...">${data.correction || ''}</textarea></td>
        <td><input type="text" class="capa-input" value="${data.responsible || ''}"></td>
        <td>
            <select class="capa-select">
                <option value="Open" ${data.status === 'Open' ? 'selected' : ''}>Open</option>
                <option value="In Progress" ${data.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                <option value="Closed" ${data.status === 'Closed' ? 'selected' : ''}>Closed</option>
                <option value="Escalated" ${data.status === 'Escalated' ? 'selected' : ''}>Escalated</option>
            </select>
        </td>
        <td style="text-align: center;"><button class="row-action-btn del-row-btn" onclick="this.closest('tr').remove()">&times;</button></td>
    `;
  tbody.appendChild(tr);
}

function loadRoundingDataForDate() {
  const date = document.getElementById('rounding-date').value;
  const store = getRoundingDataStore();
  const data = store[date] || {};

  // Section 1: Unit Details
  const ud = data.unitDetails || {};
  document.getElementById('round-unit').value = ud.ward || '';
  document.getElementById('round-shift').value = ud.shift || 'Morning';
  document.getElementById('round-leader').value = ud.leader || '';
  document.getElementById('round-incharge').value = ud.incharge || '';
  document.getElementById('round-beds').value = ud.beds || '';
  document.getElementById('round-staff').value = ud.staff || '';
  document.getElementById('round-highrisk').value = ud.highrisk || '';

  // Section 2: Checkpoints
  const cps = data.checkpoints || [];
  ROUNDING_CHECKPOINTS.forEach((_, index) => {
    const cpId = `cp-${index + 1}`;
    if (cps[index]) {
      document.getElementById(`${cpId}-rating`).value = cps[index].rating || 'C';
      document.getElementById(`${cpId}-remarks`).value = cps[index].remarks || '';
    } else {
      document.getElementById(`${cpId}-rating`).value = 'C';
      document.getElementById(`${cpId}-remarks`).value = '';
    }
  });

  // Section 3: CAPA
  renderCapaRows(data.actions || []);

  // Section 4: Summary
  const sum = data.summary || {};
  document.getElementById('round-overall-status').value = sum.overall || 'Stable';
  document.getElementById('round-staffing-status').value = sum.staffing || 'Adequate';
  document.getElementById('round-priority').value = sum.priority || '';
  document.getElementById('round-support').value = sum.support || '';
}

function saveRoundingDataForDate() {
  const date = document.getElementById('rounding-date').value;
  if (!date) return alert("Please select a date.");

  // Scrape Unit Details
  const unitDetails = {
    ward: document.getElementById('round-unit').value.trim(),
    shift: document.getElementById('round-shift').value,
    leader: document.getElementById('round-leader').value.trim(),
    incharge: document.getElementById('round-incharge').value.trim(),
    beds: document.getElementById('round-beds').value.trim(),
    staff: document.getElementById('round-staff').value.trim(),
    highrisk: document.getElementById('round-highrisk').value.trim()
  };

  // Scrape Checkpoints
  const checkpoints = [];
  ROUNDING_CHECKPOINTS.forEach((_, index) => {
    checkpoints.push({
      rating: document.getElementById(`cp-${index + 1}-rating`).value,
      remarks: document.getElementById(`cp-${index + 1}-remarks`).value.trim()
    });
  });

  // Scrape CAPA
  const actions = [];
  document.querySelectorAll('#capa-table-body tr').forEach(tr => {
    const inputs = tr.querySelectorAll('textarea, select, input');
    const gap = inputs[0].value.trim();
    if (gap) {
      actions.push({
        gap: gap,
        risk: inputs[1].value,
        correction: inputs[2].value.trim(),
        responsible: inputs[3].value.trim(),
        status: inputs[4].value
      });
    }
  });

  // Scrape Summary
  const summary = {
    overall: document.getElementById('round-overall-status').value,
    staffing: document.getElementById('round-staffing-status').value,
    priority: document.getElementById('round-priority').value.trim(),
    support: document.getElementById('round-support').value.trim()
  };

  const store = getRoundingDataStore();
  store[date] = { unitDetails, checkpoints, actions, summary };
  localStorage.setItem('nursingRoundingFullData', JSON.stringify(store));
  alert(`Comprehensive rounding data securely saved for ${date}!`);
}

// FIX: Native Excel (.xls) HTML-Table Generator to prevent CSV corruption issues
function exportRoundingDataToExcel() {
  const store = getRoundingDataStore();
  const dates = Object.keys(store).sort();

  if (dates.length === 0) return alert("No rounding data saved yet.");

  let tableHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
        <meta charset="utf-8">
        <style>
            table { border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #000; padding: 5px; vertical-align: top; }
            th { background-color: #163a5f; color: white; font-weight: bold; }
            .section-head { background-color: #e9ecef; font-weight: bold; font-size: 14pt; }
            .date-head { background-color: #0d9488; color: white; font-size: 16pt; font-weight: bold; }
        </style>
    </head>
    <body>
    <h2>Clinical Leadership Rounding Export</h2>
    <p>Exported on: ${new Date().toLocaleDateString()}</p>
    `;

  dates.forEach(date => {
    const data = store[date];
    const ud = data.unitDetails || {};
    const sum = data.summary || {};

    tableHtml += `<table>`;
    tableHtml += `<tr><td colspan="5" class="date-head">ROUNDING DATE: ${date}</td></tr>`;

    // 1. Unit Details
    tableHtml += `<tr><td colspan="5" class="section-head">1. Unit Details</td></tr>`;
    tableHtml += `<tr><th>Ward</th><th>Shift</th><th>Leader</th><th>In-Charge</th><th>Beds (Total/Occ)</th></tr>`;
    tableHtml += `<tr><td>${ud.ward || ''}</td><td>${ud.shift || ''}</td><td>${ud.leader || ''}</td><td>${ud.incharge || ''}</td><td>${ud.beds || ''}</td></tr>`;
    tableHtml += `<tr><th>Staff (Req/Avail)</th><th colspan="4">High-risk Patients / Concerns</th></tr>`;
    tableHtml += `<tr><td>${ud.staff || ''}</td><td colspan="4">${(ud.highrisk || '').replace(/\n/g, '<br>')}</td></tr>`;

    // 2. Checkpoints
    tableHtml += `<tr><td colspan="5" class="section-head">2. Checkpoints</td></tr>`;
    tableHtml += `<tr><th>No.</th><th colspan="2">Checkpoint Description</th><th>Rating</th><th>Remarks</th></tr>`;
    if (data.checkpoints) {
      data.checkpoints.forEach((cp, idx) => {
        tableHtml += `<tr><td>${idx + 1}</td><td colspan="2">${ROUNDING_CHECKPOINTS[idx]}</td><td>${cp.rating}</td><td>${(cp.remarks || '').replace(/\n/g, '<br>')}</td></tr>`;
      });
    }

    // 3. CAPA
    if (data.actions && data.actions.length > 0) {
      tableHtml += `<tr><td colspan="5" class="section-head">3. Corrective Action Tracker (CAPA)</td></tr>`;
      tableHtml += `<tr><th colspan="2">Gap / Observation</th><th>Risk Level</th><th>Immediate Correction</th><th>Status</th></tr>`;
      data.actions.forEach(act => {
        tableHtml += `<tr><td colspan="2">${(act.gap || '').replace(/\n/g, '<br>')}</td><td>${act.risk}</td><td>${(act.correction || '').replace(/\n/g, '<br>')}</td><td>${act.status}</td></tr>`;
      });
    }

    // 4. Summary
    tableHtml += `<tr><td colspan="5" class="section-head">4. Rounding Summary</td></tr>`;
    tableHtml += `<tr><th>Overall Status</th><th>Staffing Adequacy</th><th colspan="3">Priority Actions</th></tr>`;
    tableHtml += `<tr><td>${sum.overall || ''}</td><td>${sum.staffing || ''}</td><td colspan="3">${(sum.priority || '').replace(/\n/g, '<br>')}</td></tr>`;
    tableHtml += `<tr><th colspan="5">Issues requiring management support:</th></tr>`;
    tableHtml += `<tr><td colspan="5">${(sum.support || '').replace(/\n/g, '<br>')}</td></tr>`;

    tableHtml += `<tr><td colspan="5" style="border:none; height:20px;"></td></tr></table>`;
  });

  tableHtml += `</body></html>`;

  // Download as XLS
  const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Clinical_Rounding_Export_${new Date().toISOString().split('T')[0]}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

async function generateWeeklyRoundingReport() {
  const apiKey = (localStorage.getItem('geminiApiKey') || "").trim();
  if (!apiKey) {
    alert("Please paste and save your API Key in the settings box first.");
    document.getElementById('apiSettingsPanel').style.display = 'block';
    return;
  }

  const startDateStr = document.getElementById('report-start-date').value;
  const endDateStr = document.getElementById('report-end-date').value;

  if (!startDateStr || !endDateStr) return alert("Please select both a start and end date.");
  if (new Date(startDateStr) > new Date(endDateStr)) return alert("Start date must be before end date.");

  const store = getRoundingDataStore();
  const dates = Object.keys(store).sort();

  let rawLogData = "";
  let dayCount = 0;

  dates.forEach(date => {
    if (date >= startDateStr && date <= endDateStr) {
      dayCount++;
      const d = store[date];
      rawLogData += `\n--- DATE: ${date} ---\n`;
      rawLogData += `Ward: ${d.unitDetails.ward} | Shift: ${d.unitDetails.shift} | Overall: ${d.summary.overall} | Staffing: ${d.summary.staffing}\n`;

      rawLogData += `* Notable Checkpoints:\n`;
      d.checkpoints.forEach((cp, idx) => {
        if (cp.rating !== 'C' || cp.remarks) {
          rawLogData += `  Q${idx + 1}. [${cp.rating}] ${ROUNDING_CHECKPOINTS[idx]} -> ${cp.remarks || "None"}\n`;
        }
      });

      if (d.actions && d.actions.length > 0) {
        rawLogData += `* Corrective Actions (CAPA):\n`;
        d.actions.forEach(a => {
          rawLogData += `  - [${a.risk} Risk | ${a.status}] ${a.gap} -> Fix: ${a.correction}\n`;
        });
      }
      if (d.summary.priority || d.summary.support) {
        rawLogData += `* Summary Notes:\n  Priority: ${d.summary.priority}\n  Mgmt Support: ${d.summary.support}\n`;
      }
    }
  });

  if (!rawLogData) return alert("No rounding data found for this date range.");

  const loadingEl = document.getElementById('rounding-loading');
  loadingEl.style.display = 'block';
  loadingEl.innerText = "Synthesizing clinical rounding data with AI...";
  document.getElementById('rounding-output-section').style.display = 'none';

  // Strict guardrails to prevent AI hallucination on sparse data
  const prompt = `You are an expert Nursing In-Charge preparing a formal "Executive Clinical Rounding Summary Report" for hospital management.
Based on the rounding data logged below, synthesize a professional narrative report.

CRITICAL INSTRUCTIONS:
1. Base your report STRICTLY on the data provided below. Do not invent trends, missing check points, fake corrective actions, or hallucinate names.
2. If only one day of data is provided, explicitly state "Based on a single day of rounding..." and summarize ONLY that day's findings without inventing multi-day trends.
3. Maintain professional clinical hospital terminology.

Structure the summary clearly covering:
1. Overall Unit Stability & Staffing
2. Patient Safety & Clinical Care Findings
3. Corrective Actions Taken (CAPA)
4. Management Support Required (if any)

DATA LOG (${dayCount} day(s) provided):
${rawLogData}`;

  try {
    const aiText = await callAIProvider(prompt, apiKey, loadingEl);
    document.getElementById('rounding-final-report').value = aiText;
    document.getElementById('rounding-output-section').style.display = 'block';
  } catch (error) {
    alert("API Notice: " + error.message);
  } finally {
    loadingEl.style.display = 'none';
  }
}

function downloadRoundingWeeklyPDF() {
  const startDate = document.getElementById('report-start-date').value;
  const endDate = document.getElementById('report-end-date').value;
  const reportText = document.getElementById('rounding-final-report').value.replace(/\n/g, '<br>');
  const printWindow = window.open('', '_blank');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Weekly Rounding Report</title>
        <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #333; max-width: 800px; margin: 0 auto; line-height: 1.6; }
            .header { text-align: center; margin-bottom: 30px; padding-bottom: 10px; border-bottom: 2px solid #163a5f; }
            h1 { color: #163a5f; margin: 0 0 10px 0; font-size: 24px; text-transform: uppercase; }
            .date { color: #666; font-style: italic; }
            .content { font-size: 14px; }
            .content h2, .content strong { color: #163a5f; font-size: 16px; margin-top: 20px; display: block; }
            .signature-line { margin-top: 60px; border-top: 1px solid #333; width: 250px; padding-top: 5px; text-align: center; }
        </style>
    </head>
    <body onload="window.print()">
        <div class="header">
            <h1>Executive Clinical Rounding Summary</h1>
            <div class="date">Period: ${startDate} to ${endDate} | Generated: ${new Date().toLocaleDateString()}</div>
        </div>
        <div class="content">
            ${reportText}
        </div>
        <div class="signature-line">
            Nursing In-Charge Signature
        </div>
    </body>
    </html>`;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}