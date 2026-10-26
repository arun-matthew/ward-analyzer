// ============================================================================
// DATA RESOURCES
// ============================================================================

const DEFAULT_MOM_TOPICS = [
  { topic: "Mobile Phone Usage", discussion: "- Using personal mobile phones for private calls during duty hours is not allowed.\n- Each unit will be given a separate official phone once available. Until that time, only the TL is allowed to keep one phone at the nursing station to communicate with doctors for official purposes.\n- All staff must keep their personal phones safely inside their lockers.\n- Family members should be informed in advance that staff will not have access to personal phones while on duty.\n- For any urgent situations, families can reach out to the unit in-charge or duty supervisor through the official contact number.", action: "➤ Monitor the staffs", responsibility: "ALL STAFF" },
  { topic: "Leave", discussion: "- Staff members who take leave must make sure their leave card is filled out on time and kept in the unit.\n- All leaves, including LOP (Loss of Pay), must be entered in the leave record as well as applied in the system.", action: "", responsibility: "ALL STAFF" },
  { topic: "CNE Attendance", discussion: "- Any staff member attending a CNE class should mark their attendance in the CNE register on that day itself.\n- The CNE attendance record will be checked at the end of each month to verify how many classes each staff member has attended.", action: "", responsibility: "ALL STAFF" },
  { topic: "Linen Management", discussion: "- As per Lissy Madam's instructions, torn or damaged linen should never be used for patients.\n- Any damaged linen must be placed in a separate cover and sent to the laundry.\n- Every unit should always keep a minimum stock of emergency linen ready.\n- If the emergency linen stock gets low, the laundry department must be informed beforehand to refill it.", action: "", responsibility: "ALL STAFF" },
  { topic: "Difficult IV Cannulation", discussion: "- Whenever a staff member faces difficulty with IV cannulation, they should first take help from a senior staff member on the floor.\n- If the cannulation still cannot be done, the duty supervisor should be contacted for further help.", action: "", responsibility: "ALL STAFF" },
  { topic: "Handover and Patient Transfer", discussion: "- Proper bedside handover must be strictly followed.\n- While receiving a patient from the ICU or any other area, both the incoming and outgoing staff must go together and check:\n  • Condition of the patient\n  • Vital signs\n  • IV lines and connected equipment\n  • Other important clinical details\n- A patient should be formally taken over only after all these checks are completed.\n- Patients under DNR status must never be neglected. All basic nursing care should be given to them properly regardless of their DNR status.\n- All transfer checklists have to be filled out properly.\n- The supervisor must be informed whenever there is a transfer-out.", action: "", responsibility: "ALL STAFF" },
  { topic: "Patient Complaints and Patient Satisfaction", discussion: "- Any complaints from patients should be checked and sorted out as early as possible.\n- Staff must try their best to solve patient concerns right away.\n- Clearing complaints on time will help increase patient satisfaction and improve patient occupancy.", action: "", responsibility: "ALL STAFF" },
  { topic: "Staff as Brand Ambassadors", discussion: "- Lissy Madam advised all staff members to actively promote our hospital and refer maximum patients whenever possible.\n- All staff should work as brand ambassadors for the institution by behaving professionally, giving good quality patient care, and ensuring a pleasant experience for both patients and their families.", action: "", responsibility: "ALL STAFF" }
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

  // Set default dates
  document.getElementById('report-month').value = `${monthName} - ${now.getFullYear()}`;
  document.getElementById('mom-date').value = now.toLocaleDateString('en-GB');

  const todayStr = getLocalISODate();
  document.getElementById('rounding-date').value = todayStr;
  document.getElementById('report-end-date').value = todayStr;

  // Default report start date to 7 days ago
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 6);
  lastWeek.setMinutes(lastWeek.getMinutes() - lastWeek.getTimezoneOffset());
  document.getElementById('report-start-date').value = lastWeek.toISOString().split('T')[0];

  // Initialize UI Components
  renderMOMTable(DEFAULT_MOM_TOPICS);
  renderRoundingCheckpoints();
  loadRoundingDataForDate();

  // API Key Handling
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

// ============================================================================
// UNIVERSAL AI ROUTER
// ============================================================================

async function callAIProvider(prompt, apiKey, loadingEl) {
  if (apiKey.startsWith("gsk_")) {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({ model: "llama-3.3-70b-versatile", temperature: 0.2, messages: [{ role: "user", content: prompt }] })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.choices[0].message.content;
  }
  else if (apiKey.startsWith("sk-ant-")) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
      body: JSON.stringify({ model: "claude-3-5-haiku-latest", max_tokens: 2000, temperature: 0.2, messages: [{ role: "user", content: prompt }] })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.content[0].text;
  }
  else if (apiKey.startsWith("sk-")) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({ model: "gpt-4o-mini", temperature: 0.2, messages: [{ role: "user", content: prompt }] })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.choices[0].message.content;
  }
  else {
    let candidateModels = ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-2.5-flash-lite', 'gemini-2.5-flash', 'gemma-3-27b-it'];
    try {
      const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      const listData = await listRes.json();
      if (listData.models) {
        const available = listData.models
          .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent"))
          .map(m => m.name.replace("models/", ""))
          .filter(name => !name.includes("tts") && !name.includes("image") && !name.includes("embedding") && !name.includes("vision") && !name.includes("thinking"));
        const prioritized = candidateModels.filter(m => available.includes(m));
        const others = available.filter(m => !prioritized.includes(m));
        if (prioritized.length > 0 || others.length > 0) candidateModels = [...prioritized, ...others];
      }
    } catch (e) { }

    let lastError = "";
    for (const model of candidateModels) {
      try {
        if (loadingEl) loadingEl.innerText = `Communicating with AI (${model})...`;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.2 } })
        });

        const data = await response.json();
        const parts = data.candidates?.[0]?.content?.parts;
        if (Array.isArray(parts) && parts.length > 0) {
          const answerParts = parts.filter(p => !p.thought && typeof p.text === "string" && p.text.trim().length > 0);
          const chosenPart = answerParts.length > 0 ? answerParts[answerParts.length - 1] : parts[parts.length - 1];
          if (chosenPart && chosenPart.text) return chosenPart.text;
        } else if (data.error) {
          lastError = data.error.message;
        }
      } catch (err) {
        lastError = err.message;
      }
    }
    throw new Error(lastError || "All Gemini servers are currently busy. Please try again in a moment.");
  }
}


// ============================================================================
// TAB 4: CLINICAL ROUNDING LOGIC (NEW)
// ============================================================================

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
                        <option value="C">C</option>
                        <option value="PC">PC</option>
                        <option value="NC">NC</option>
                        <option value="NA">NA</option>
                        <option value="CR">CR</option>
                    </select>
                </div>
                <input type="text" id="${cpId}-remarks" class="cp-remarks" placeholder="Remarks / Corrective action">
            </div>
        `;
    container.insertAdjacentHTML('beforeend', html);
  });
}

function getRoundingDataStore() {
  return JSON.parse(localStorage.getItem('nursingRoundingData') || '{}');
}

function loadRoundingDataForDate() {
  const selectedDate = document.getElementById('rounding-date').value;
  const store = getRoundingDataStore();
  const dayData = store[selectedDate];

  ROUNDING_CHECKPOINTS.forEach((_, index) => {
    const cpId = `cp-${index + 1}`;
    const ratingSelect = document.getElementById(`${cpId}-rating`);
    const remarksInput = document.getElementById(`${cpId}-remarks`);

    if (dayData && dayData[index]) {
      ratingSelect.value = dayData[index].rating || 'C';
      remarksInput.value = dayData[index].remarks || '';
    } else {
      ratingSelect.value = 'C';
      remarksInput.value = '';
    }
  });
}

function saveRoundingDataForDate() {
  const selectedDate = document.getElementById('rounding-date').value;
  if (!selectedDate) return alert("Please select a date first.");

  const store = getRoundingDataStore();
  const dayData = [];

  ROUNDING_CHECKPOINTS.forEach((_, index) => {
    const cpId = `cp-${index + 1}`;
    dayData.push({
      rating: document.getElementById(`${cpId}-rating`).value,
      remarks: document.getElementById(`${cpId}-remarks`).value.trim()
    });
  });

  store[selectedDate] = dayData;
  localStorage.setItem('nursingRoundingData', JSON.stringify(store));
  alert(`Rounding data saved securely for ${selectedDate}!`);
}

function exportRoundingDataToExcel() {
  const store = getRoundingDataStore();
  const dates = Object.keys(store).sort();

  if (dates.length === 0) {
    return alert("No rounding data saved yet.");
  }

  let csv = "Date,Checkpoint No.,Checkpoint Description,Rating,Remarks/Corrective Action\n";

  dates.forEach(date => {
    const dayData = store[date];
    dayData.forEach((data, index) => {
      const cleanDesc = ROUNDING_CHECKPOINTS[index].replace(/"/g, '""');
      const cleanRemarks = data.remarks.replace(/"/g, '""');
      csv += `${date},${index + 1},"${cleanDesc}",${data.rating},"${cleanRemarks}"\n`;
    });
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', `Clinical_Rounding_Export.csv`);
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
  dates.forEach(date => {
    if (date >= startDateStr && date <= endDateStr) {
      rawLogData += `\nDATE: ${date}\n`;
      store[date].forEach((data, idx) => {
        // To save AI processing logic, only include items with remarks or non-C ratings
        if (data.rating !== 'C' || data.remarks) {
          rawLogData += `Q${idx + 1}. [${data.rating}] ${ROUNDING_CHECKPOINTS[idx]}\n   Remarks: ${data.remarks || "None"}\n`;
        }
      });
    }
  });

  if (!rawLogData) {
    return alert("No rounding data found for this date range. Please save daily rounds first.");
  }

  const loadingEl = document.getElementById('rounding-loading');
  loadingEl.style.display = 'block';
  loadingEl.innerText = "Synthesizing weekly rounding data with AI...";
  document.getElementById('rounding-output-section').style.display = 'none';

  const prompt = `You are an expert Nursing In-Charge preparing a formal "Executive Clinical Rounding Summary Report" for hospital management.
Based on the daily ward rounding data logged below, synthesize a professional narrative report.

Focus on creating a structured summary covering:
1. Overall Unit Stability & Staffing
2. Patient Safety & Clinical Care Trends (highlighting any recurring non-compliance or critical risks)
3. Infection Control & Environment
4. Corrective Actions Taken

Do NOT just list day-by-day notes. Analyze the entire week and write it as an executive overview. Maintain professional clinical hospital terminology.

DAILY ROUNDING DATA LOG:
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

// ============================================================================
// TAB 2: ACTIVITY REPORT LOGIC (PRESERVED)
// ============================================================================

function parseTableFromAI(rawText) {
  if (!rawText || !rawText.trim()) throw new Error("Empty response from AI. Please try again.");
  const lines = rawText.replace(/```[a-z]*/gi, "").replace(/```/g, "").trim().split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  const taggedLines = lines.filter(l => l.toUpperCase().startsWith("ROW||") || l.toUpperCase().startsWith("ROW ||"));
  const targetLines = taggedLines.length > 0 ? taggedLines : lines;
  const rows = [];
  const seenKeys = new Set();

  for (let line of targetLines) {
    if (/^[\|\-\s:]+$/.test(line)) continue;
    line = line.replace(/^ROW\s*\|\|\s*/i, "");
    let parts = line.includes("||") ? line.split("||").map(p => p.trim()) : line.replace(/^\|/, "").replace(/\|$/, "").split("|").map(p => p.trim());
    if (parts.length >= 4) {
      if (parts.length >= 5 && (/^\d+[\.\)]?$/.test(parts[0]) || parts[0].toLowerCase().includes("no"))) parts.shift();
      let focus = parts[0].replace(/^\*?Row\s*\d+\s*:\*?\s*/i, "").replace(/^\d+[\.\)]\s*/, "").replace(/^[\-\*]+\s*/, "").replace(/\*\*/g, "").replace(/`/g, "").trim();
      let act = parts[1].replace(/\*\*/g, "").replace(/`/g, "").trim();
      let keyAct = parts[2].replace(/\*\*/g, "").replace(/`/g, "").trim();
      let ev = parts[3].replace(/\*\*/g, "").replace(/`/g, "").trim();
      const lowerFocus = focus.toLowerCase();
      if (lowerFocus === "focus area" || lowerFocus.includes("specific rule") || lowerFocus.includes("order:") || lowerFocus.includes("format as") || act.toLowerCase() === "activities") continue;

      const uniqueSig = `${lowerFocus}|${act.toLowerCase()}`;
      if (seenKeys.has(uniqueSig)) continue;
      seenKeys.add(uniqueSig);
      rows.push({ focus_area: focus, activities: act, key_activities: keyAct, evidence: ev });
    }
  }
  if (rows.length > 0) return rows;
  throw new Error("Could not format the notes into a table. Please tap Generate again.");
}

function parseSingleRowFromAI(rawText, fallbackRow) {
  try { const parsed = parseTableFromAI(rawText); if (parsed && parsed.length > 0) return parsed[0]; } catch (e) { }
  return fallbackRow;
}

async function generateAIReport(mode) {
  const apiKey = (localStorage.getItem('geminiApiKey') || "").trim();
  if (!apiKey) return alert("Please save your API Key in settings.");

  const activeNotes = [];
  ['patient', 'docs', 'staff', 'ward'].forEach(id => {
    const val = document.getElementById(`note-${id}`).value.trim();
    if (val) activeNotes.push(`- ${id === 'patient' ? 'Patient Care' : id === 'docs' ? 'Documentation' : id === 'staff' ? 'Staff Development' : 'Ward Management'}: ${val}`);
  });
  if (activeNotes.length === 0) return alert("Type notes into at least one box.");

  const loadingEl = document.getElementById('loading');
  loadingEl.style.display = 'block';
  document.getElementById('ai-output-section').style.display = 'none';
  document.getElementById('ai-table-section').style.display = 'none';

  try {
    if (mode === 'table') {
      const prompt = `You are a Nursing In-Charge. Convert ONLY the provided rough notes into table rows.\nCRITICAL RULES:\n1. Only create rows for listed activities.\n2. Start every line with "ROW||" followed by columns separated by "||": ROW||Focus area||Activities||Key activities||Evidence\n\nROUGH NOTES:\n${activeNotes.join("\n")}`;
      const rows = parseTableFromAI(await callAIProvider(prompt, apiKey, loadingEl));
      renderActivityTable(rows);
      document.getElementById('ai-table-section').style.display = 'block';
    } else {
      const prompt = `You are a Nursing In-Charge writing a formal Monthly Nursing Activity Report. Rewrite ONLY the notes below into professional hospital report format.\nROUGH NOTES:\n${activeNotes.join("\n")}`;
      document.getElementById('final-report-text').value = await callAIProvider(prompt, apiKey, loadingEl);
      document.getElementById('ai-output-section').style.display = 'block';
    }
  } catch (e) { alert("API Notice: " + e.message); } finally { loadingEl.style.display = 'none'; }
}

async function polishSingleRowWithAI(btn) {
  const apiKey = (localStorage.getItem('geminiApiKey') || "").trim();
  if (!apiKey) return alert("Please save API Key.");
  const tr = btn.closest('tr');
  const cells = tr.querySelectorAll('td');
  const row = { focus_area: cells[1].innerText.trim(), activities: cells[2].innerText.trim(), key_activities: cells[3].innerText.trim(), evidence: cells[4].innerText.trim() };
  const origBtn = btn.innerText; btn.innerText = "⏳"; btn.disabled = true; tr.style.backgroundColor = "#f0fdfa";
  try {
    const prompt = `Polish this single Nursing Activity Report row. Keep all facts. Output ONLY one line:\nROW||Focus area||Activities||Key activities||Evidence\nCURRENT: ${row.focus_area} || ${row.activities} || ${row.key_activities} || ${row.evidence}`;
    const polished = parseSingleRowFromAI(await callAIProvider(prompt, apiKey, null), row);
    cells[1].innerText = polished.focus_area || row.focus_area; cells[2].innerText = polished.activities || row.activities; cells[3].innerText = polished.key_activities || row.key_activities; cells[4].innerText = polished.evidence || row.evidence;
  } catch (e) { alert(e.message); } finally { btn.innerText = origBtn; btn.disabled = false; tr.style.backgroundColor = ""; }
}

async function polishEntireTableWithAI() {
  const apiKey = (localStorage.getItem('geminiApiKey') || "").trim();
  if (!apiKey) return alert("Please save API Key.");
  const trs = document.querySelectorAll('#activity-table-body tr');
  if (trs.length === 0) return alert("No rows to polish.");
  const lines = Array.from(trs).map(tr => { const c = tr.querySelectorAll('td'); return `${c[1].innerText.trim()} || ${c[2].innerText.trim()} || ${c[3].innerText.trim()} || ${c[4].innerText.trim()}`; });
  const loadingEl = document.getElementById('loading'); loadingEl.style.display = 'block';
  try {
    const prompt = `Polish ${lines.length} row(s) of a Nursing Activity table. Keep EXACTLY ${lines.length} rows and all facts.\nOutput one line per row:\nROW||Focus area||Activities||Key activities||Evidence\n\nROWS:\n${lines.join("\n")}`;
    renderActivityTable(parseTableFromAI(await callAIProvider(prompt, apiKey, loadingEl)));
  } catch (e) { alert(e.message); } finally { loadingEl.style.display = 'none'; }
}

async function polishNarrativeWithAI() {
  const apiKey = (localStorage.getItem('geminiApiKey') || "").trim();
  if (!apiKey) return alert("Please save API Key.");
  const text = document.getElementById('final-report-text').value.trim();
  if (!text) return alert("Nothing to polish.");
  const loadingEl = document.getElementById('loading'); loadingEl.style.display = 'block';
  try {
    document.getElementById('final-report-text').value = await callAIProvider(`Polish this edited Nursing Activity Report. Keep all new points intact.\n\n${text}`, apiKey, loadingEl);
  } catch (e) { alert(e.message); } finally { loadingEl.style.display = 'none'; }
}

function renderActivityTable(rows) {
  const tbody = document.getElementById('activity-table-body');
  tbody.innerHTML = "";
  rows.forEach((row, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td class="col-no">${i + 1}</td><td contenteditable="true">${row.focus_area || ''}</td><td contenteditable="true">${row.activities || ''}</td><td contenteditable="true">${row.key_activities || ''}</td><td contenteditable="true">${row.evidence || ''}</td><td class="col-actions"><button class="row-action-btn polish-row-btn" onclick="polishSingleRowWithAI(this)">✨</button><button class="row-action-btn del-row-btn" onclick="deleteTableRow(this)">&times;</button></td>`;
    tbody.appendChild(tr);
  });
}

function addEmptyTableRow() {
  const tbody = document.getElementById('activity-table-body');
  const tr = document.createElement('tr');
  tr.innerHTML = `<td class="col-no">${tbody.children.length + 1}</td><td contenteditable="true">Ward Mgmt</td><td contenteditable="true">New</td><td contenteditable="true">Tap ✨ to polish...</td><td contenteditable="true">Ev...</td><td class="col-actions"><button class="row-action-btn polish-row-btn" onclick="polishSingleRowWithAI(this)">✨</button><button class="row-action-btn del-row-btn" onclick="deleteTableRow(this)">&times;</button></td>`;
  tbody.appendChild(tr);
}

function deleteTableRow(btn) {
  btn.closest('tr').remove();
  document.querySelectorAll('#activity-table-body tr').forEach((r, i) => r.querySelector('.col-no').innerText = i + 1);
}

function downloadTabularActivityPDF() {
  const my = (document.getElementById('report-month').value || "MONTHLY").toUpperCase().trim();
  let rowsHtml = "";
  document.querySelectorAll('#activity-table-body tr').forEach((r, i) => {
    const c = r.querySelectorAll('td');
    rowsHtml += `<tr><td class="col-no">${i + 1}</td><td>${c[1].innerHTML}</td><td>${c[2].innerHTML}</td><td>${c[3].innerHTML}</td><td>${c[4].innerHTML}</td></tr>`;
  });
  const win = window.open('', '_blank');
  win.document.write(`<html><head><title>${my}</title><style>@page{size:A4 landscape;margin:18mm;}body{font-family:sans-serif;}table{width:100%;border-collapse:collapse;}th{background:#163a5f;color:#fff;padding:12px;text-align:left;border:1px solid #163a5f;}td{padding:12px;border:1px solid #ccc;vertical-align:top;}</style></head><body onload="window.print()"><h2>${my} ACTIVITIES REPORT</h2><table><tr><th>No.</th><th>Focus area</th><th>Activities</th><th>Key activities</th><th>Evidence</th></tr>${rowsHtml}</table></body></html>`);
  win.document.close();
}

function downloadNarrativeActivityPDF() {
  const my = document.getElementById('report-month').value || "Monthly";
  const text = document.getElementById('final-report-text').value.replace(/\n/g, '<br>');
  const win = window.open('', '_blank');
  win.document.write(`<html><body onload="window.print()" style="font-family:sans-serif;padding:40px;"><h2>${my} - Report</h2><p>${text}</p></body></html>`);
  win.document.close();
}

// ============================================================================
// TAB 3: MINUTES OF MEETING (MOM) LOGIC (PRESERVED)
// ============================================================================

function renderMOMTable(rows) {
  const tbody = document.getElementById('mom-table-body');
  tbody.innerHTML = "";
  rows.forEach((row, i) => appendMOMRowElement(tbody, i + 1, row));
}

function appendMOMRowElement(tbody, indexNum, row) {
  const tr = document.createElement('tr');
  tr.innerHTML = `<td class="col-no">${indexNum}.</td><td class="col-mom-topic" contenteditable="true">${row.topic || ''}</td><td class="col-mom-disc" contenteditable="true">${row.discussion || ''}</td><td class="col-mom-act" contenteditable="true">${row.action || ''}</td><td class="col-mom-resp" contenteditable="true">${row.responsibility || 'ALL STAFF'}</td><td class="col-actions"><button class="row-action-btn polish-row-btn" onclick="polishSingleMOMRowWithAI(this)">✨</button><button class="row-action-btn del-row-btn" onclick="deleteMOMRow(this)">&times;</button></td>`;
  tbody.appendChild(tr);
}

function addEmptyMOMRow() {
  const tbody = document.getElementById('mom-table-body');
  appendMOMRowElement(tbody, tbody.children.length + 1, { topic: "New Topic", discussion: "- Tap ✨ to enhance...", action: "", responsibility: "ALL STAFF" });
}

function deleteMOMRow(btn) {
  btn.closest('tr').remove();
  document.querySelectorAll('#mom-table-body tr').forEach((r, i) => r.querySelector('.col-no').innerText = `${i + 1}.`);
}

function resetDefaultMOMRows() {
  if (confirm("Reset back to the 8 standard topics?")) renderMOMTable(DEFAULT_MOM_TOPICS);
}

function parseMOMRowsFromAI(rawText) {
  if (!rawText) throw new Error("Empty response.");
  const lines = rawText.replace(/```[a-z]*/gi, "").replace(/```/g, "").trim().split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  const taggedLines = lines.filter(l => l.toUpperCase().startsWith("MOM||") || l.toUpperCase().startsWith("MOM ||"));
  const targetLines = taggedLines.length > 0 ? taggedLines : lines;
  const rows = [];
  for (let line of targetLines) {
    if (/^[\|\-\s:]+$/.test(line)) continue;
    line = line.replace(/^MOM\s*\|\|\s*/i, "");
    let parts = line.includes("||") ? line.split("||").map(p => p.trim()) : line.replace(/^\|/, "").replace(/\|$/, "").split("|").map(p => p.trim());
    if (parts.length >= 4) {
      if (parts.length >= 5 && (/^\d+[\.\)]?$/.test(parts[0]) || parts[0].toLowerCase().includes("sl"))) parts.shift();
      let topic = parts[0].replace(/^\d+[\.\)]\s*/, "").replace(/\*\*/g, "").trim();
      if (topic.toLowerCase() === "topic") continue;
      let discussion = parts[1].replace(/<br\s*\/?>/gi, "\n").replace(/\s*;\s*-\s*/g, "\n- ").replace(/\*\*/g, "").trim();
      let action = parts[2].replace(/\*\*/g, "").trim();
      if (action === "none" || action === "-") action = "";
      let responsibility = parts[3].replace(/\*\*/g, "").trim() || "ALL STAFF";
      rows.push({ topic, discussion, action, responsibility });
    }
  }
  if (rows.length > 0) return rows;
  throw new Error("Could not parse MOM rows.");
}

async function appendRoughNotesToMOMWithAI() {
  const apiKey = (localStorage.getItem('geminiApiKey') || "").trim();
  if (!apiKey) return alert("Save API Key first.");
  const rough = document.getElementById('mom-rough-notes').value.trim();
  if (!rough) return alert("Type rough notes first.");
  const loadingEl = document.getElementById('mom-loading'); loadingEl.style.display = 'block';
  try {
    const prompt = `Convert meeting notes into MOM table rows.\nRULES:\n1. Output lines starting with "MOM||": MOM||Topic||Discussion Points||Action||Responsibility\n2. Use "<br>" for bullets in Discussion.\n3. Add "➤ " for actions.\nNOTES:\n${rough}`;
    const newRows = parseMOMRowsFromAI(await callAIProvider(prompt, apiKey, loadingEl));
    const tbody = document.getElementById('mom-table-body');
    newRows.forEach(r => appendMOMRowElement(tbody, tbody.children.length + 1, r));
    document.getElementById('mom-rough-notes').value = "";
  } catch (e) { alert(e.message); } finally { loadingEl.style.display = 'none'; }
}

async function polishSingleMOMRowWithAI(btn) {
  const apiKey = (localStorage.getItem('geminiApiKey') || "").trim();
  if (!apiKey) return alert("Save API Key first.");
  const tr = btn.closest('tr'); const c = tr.querySelectorAll('td');
  const row = { topic: c[1].innerText.trim(), discussion: c[2].innerText.trim(), action: c[3].innerText.trim(), responsibility: c[4].innerText.trim() };
  const origBtn = btn.innerText; btn.innerText = "⏳"; btn.disabled = true; tr.style.backgroundColor = "#f0fdfa";
  try {
    const prompt = `Polish this MOM row. Use <br> for bullets. Output ONE line:\nMOM||Topic||Discussion Points||Action||Responsibility\nROW: ${row.topic} || ${row.discussion.replace(/\n/g, " <br> ")} || ${row.action} || ${row.responsibility}`;
    const polished = parseMOMRowsFromAI(await callAIProvider(prompt, apiKey, null))[0];
    c[1].innerText = polished.topic || row.topic; c[2].innerText = polished.discussion || row.discussion; c[3].innerText = polished.action !== undefined ? polished.action : row.action; c[4].innerText = polished.responsibility || row.responsibility;
  } catch (e) { alert(e.message); } finally { btn.innerText = origBtn; btn.disabled = false; tr.style.backgroundColor = ""; }
}

async function polishEntireMOMWithAI() {
  const apiKey = (localStorage.getItem('geminiApiKey') || "").trim();
  if (!apiKey) return alert("Save API Key first.");
  const trs = document.querySelectorAll('#mom-table-body tr');
  if (trs.length === 0) return alert("No rows.");
  const lines = Array.from(trs).map(tr => { const c = tr.querySelectorAll('td'); return `${c[1].innerText.trim()} || ${c[2].innerText.trim().replace(/\n/g, " <br> ")} || ${c[3].innerText.trim()} || ${c[4].innerText.trim()}`; });
  const loadingEl = document.getElementById('mom-loading'); loadingEl.style.display = 'block';
  try {
    const prompt = `Polish ${lines.length} MOM rows. Keep exactly ${lines.length} rows.\nOutput lines starting with "MOM||": MOM||Topic||Discussion Points||Action||Responsibility\nROWS:\n${lines.join("\n")}`;
    renderMOMTable(parseMOMRowsFromAI(await callAIProvider(prompt, apiKey, loadingEl)));
  } catch (e) { alert(e.message); } finally { loadingEl.style.display = 'none'; }
}

function downloadMOMPDF() {
  const title = document.getElementById('mom-title').value || "MOM";
  const dt = document.getElementById('mom-date').value || "";
  let rowsHtml = "";
  document.querySelectorAll('#mom-table-body tr').forEach((r, i) => {
    const c = r.querySelectorAll('td');
    rowsHtml += `<tr><td style="text-align:center;">${i + 1}.</td><td>${c[1].innerText.replace(/\n/g, '<br>')}</td><td>${c[2].innerText.replace(/\n/g, '<br>')}</td><td>${c[3].innerText.replace(/\n/g, '<br>')}</td><td style="text-align:center;">${c[4].innerText.replace(/\n/g, '<br>')}</td></tr>`;
  });
  const win = window.open('', '_blank');
  win.document.write(`<html><head><title>${title}</title><style>@page{size:A4 portrait;margin:15mm;}body{font-family:sans-serif;}table{width:100%;border-collapse:collapse;margin-top:20px;}th,td{border:1px solid #222;padding:10px;}th{background:#163a5f;color:#fff;text-align:left;}</style></head><body onload="window.print()"><h2>${title}</h2><p>Date: ${dt}</p><table><tr><th>Sl. No.</th><th>Topic</th><th>Discussion Points</th><th>Action</th><th>Responsibility</th></tr>${rowsHtml}</table></body></html>`);
  win.document.close();
}

// ============================================================================
// TAB 1: WORKFORCE ANALYZER LOGIC (PRESERVED)
// ============================================================================
let reportData = {};
function calculateAnalyzer() {
  const beds = parseInt(document.getElementById('beds').value) || 0;
  const babies = parseInt(document.getElementById('babies').value) || 0;
  const targetRatio = parseInt(document.getElementById('targetRatio').value) || 6;
  const staff = parseInt(document.getElementById('staff').value) || 0;
  const days = parseInt(document.getElementById('days').value) || 0;
  const nursesPerShift = parseInt(document.getElementById('nursesPerShift').value) || 0;
  const weeklyOffs = parseInt(document.getElementById('weeklyOffs').value) || 0;
  const nightOffs = parseInt(document.getElementById('nightOffs').value) || 0;
  const cl = parseInt(document.getElementById('cl').value) || 0;
  const ph = parseInt(document.getElementById('ph').value) || 0;
  const emergency = parseInt(document.getElementById('emergency').value) || 0;

  const maxPatients = beds + babies;
  const actualRatio = maxPatients / (nursesPerShift || 1);
  const margin = (staff * (days - (weeklyOffs + nightOffs + cl + ph + emergency))) - (nursesPerShift * 3 * days);

  document.getElementById('resMaxPatients').innerText = maxPatients;
  document.getElementById('resRatio').innerText = `1:${actualRatio.toFixed(1)}`;
  document.getElementById('resMargin').innerText = margin;
  document.getElementById('results').style.display = 'block';
  reportData = { maxPatients, actualRatio: actualRatio.toFixed(1), staff, days, totalShiftsRequired: nursesPerShift * 3 * days, totalAvailableShifts: staff * (days - (weeklyOffs + nightOffs + cl + ph + emergency)), margin, verdict: margin > 5 ? "Adequate" : margin >= 0 ? "Tight" : "Understaffed" };
}
function downloadCSV() { calculateAnalyzer(); let csv = "Parameter,Value\n"; Object.keys(reportData).forEach(k => csv += `${k},${reportData[k]}\n`); const a = document.createElement('a'); a.href = window.URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'Workforce.csv'; document.body.appendChild(a); a.click(); document.body.removeChild(a); }
function downloadAnalyzerPDF() { calculateAnalyzer(); const win = window.open('', '_blank'); win.document.write(`<html><body onload="window.print()"><h2>Workforce Report</h2><p>Max Patients: ${reportData.maxPatients}</p><p>Margin: ${reportData.margin}</p><p>Verdict: ${reportData.verdict}</p></body></html>`); win.document.close(); }