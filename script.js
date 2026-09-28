// --- DEFAULT PRE-POPULATED MOM TOPICS (From Nursing Department PDF) ---
const DEFAULT_MOM_TOPICS = [
  {
    topic: "Mobile Phone Usage",
    discussion: "- Using personal mobile phones for private calls during duty hours is not allowed.\n- Each unit will be given a separate official phone once available. Until that time, only the TL is allowed to keep one phone at the nursing station to communicate with doctors for official purposes.\n- All staff must keep their personal phones safely inside their lockers.\n- Family members should be informed in advance that staff will not have access to personal phones while on duty.\n- For any urgent situations, families can reach out to the unit in-charge or duty supervisor through the official contact number.",
    action: "➤ Monitor the staffs",
    responsibility: "ALL STAFF"
  },
  {
    topic: "Leave",
    discussion: "- Staff members who take leave must make sure their leave card is filled out on time and kept in the unit.\n- All leaves, including LOP (Loss of Pay), must be entered in the leave record as well as applied in the system.",
    action: "",
    responsibility: "ALL STAFF"
  },
  {
    topic: "CNE Attendance",
    discussion: "- Any staff member attending a CNE class should mark their attendance in the CNE register on that day itself.\n- The CNE attendance record will be checked at the end of each month to verify how many classes each staff member has attended.",
    action: "",
    responsibility: "ALL STAFF"
  },
  {
    topic: "Linen Management",
    discussion: "- As per Lissy Madam's instructions, torn or damaged linen should never be used for patients.\n- Any damaged linen must be placed in a separate cover and sent to the laundry.\n- Every unit should always keep a minimum stock of emergency linen ready.\n- If the emergency linen stock gets low, the laundry department must be informed beforehand to refill it.",
    action: "",
    responsibility: "ALL STAFF"
  },
  {
    topic: "Difficult IV Cannulation",
    discussion: "- Whenever a staff member faces difficulty with IV cannulation, they should first take help from a senior staff member on the floor.\n- If the cannulation still cannot be done, the duty supervisor should be contacted for further help.",
    action: "",
    responsibility: "ALL STAFF"
  },
  {
    topic: "Handover and Patient Transfer",
    discussion: "- Proper bedside handover must be strictly followed.\n- While receiving a patient from the ICU or any other area, both the incoming and outgoing staff must go together and check:\n  • Condition of the patient\n  • Vital signs\n  • IV lines and connected equipment\n  • Other important clinical details\n- A patient should be formally taken over only after all these checks are completed.\n- Patients under DNR status must never be neglected. All basic nursing care should be given to them properly regardless of their DNR status.\n- All transfer checklists have to be filled out properly.\n- The supervisor must be informed whenever there is a transfer-out.",
    action: "",
    responsibility: "ALL STAFF"
  },
  {
    topic: "Patient Complaints and Patient Satisfaction",
    discussion: "- Any complaints from patients should be checked and sorted out as early as possible.\n- Staff must try their best to solve patient concerns right away.\n- Clearing complaints on time will help increase patient satisfaction and improve patient occupancy.",
    action: "",
    responsibility: "ALL STAFF"
  },
  {
    topic: "Staff as Brand Ambassadors",
    discussion: "- Lissy Madam advised all staff members to actively promote our hospital and refer maximum patients whenever possible.\n- All staff should work as brand ambassadors for the institution by behaving professionally, giving good quality patient care, and ensuring a pleasant experience for both patients and their families.",
    action: "",
    responsibility: "ALL STAFF"
  }
];

// --- UI/TAB LOGIC ---
function switchTab(tabId, btn) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  btn.classList.add('active');
}

// --- INITIALIZATION ---
window.onload = function () {
  const now = new Date();
  const monthName = now.toLocaleString('en-US', { month: 'long' }).toUpperCase();
  document.getElementById('report-month').value = `${monthName} - ${now.getFullYear()}`;
  document.getElementById('mom-date').value = now.toLocaleDateString('en-GB');

  // Pre-populate the MOM table with the 8 standard points
  renderMOMTable(DEFAULT_MOM_TOPICS);

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

// --- UNIVERSAL AI CALLER (Ignores internal "thought" scratchpad parts) ---
async function callAIProvider(prompt, apiKey, loadingEl) {
  if (apiKey.startsWith("gsk_")) {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.2,
        messages: [{ role: "user", content: prompt }]
      })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.choices[0].message.content;
  }
  else if (apiKey.startsWith("sk-ant-")) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-latest",
        max_tokens: 2000,
        temperature: 0.2,
        messages: [{ role: "user", content: prompt }]
      })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.content[0].text;
  }
  else if (apiKey.startsWith("sk-")) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,
        messages: [{ role: "user", content: prompt }]
      })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.choices[0].message.content;
  }
  else {
    let candidateModels = [
      'gemini-2.0-flash',
      'gemini-2.0-flash-lite',
      'gemini-2.5-flash-lite',
      'gemini-2.5-flash',
      'gemma-3-27b-it'
    ];

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
        if (prioritized.length > 0 || others.length > 0) {
          candidateModels = [...prioritized, ...others];
        }
      }
    } catch (e) {
      console.warn("Using default fallback list.");
    }

    let lastError = "";
    for (const model of candidateModels) {
      try {
        if (loadingEl) loadingEl.innerText = `Communicating with AI (${model})...`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2 }
          })
        });

        const data = await response.json();
        const parts = data.candidates?.[0]?.content?.parts;
        if (Array.isArray(parts) && parts.length > 0) {
          const answerParts = parts.filter(p => !p.thought && typeof p.text === "string" && p.text.trim().length > 0);
          const chosenPart = answerParts.length > 0 ? answerParts[answerParts.length - 1] : parts[parts.length - 1];
          if (chosenPart && chosenPart.text) {
            return chosenPart.text;
          }
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
// TAB 2: ACTIVITY REPORT LOGIC
// ============================================================================

function parseTableFromAI(rawText) {
  if (!rawText || !rawText.trim()) {
    throw new Error("Empty response from AI. Please try again.");
  }

  const cleaned = rawText.replace(/```[a-z]*/gi, "").replace(/```/g, "").trim();
  const lines = cleaned.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

  const taggedLines = lines.filter(l => l.toUpperCase().startsWith("ROW||") || l.toUpperCase().startsWith("ROW ||"));
  const targetLines = taggedLines.length > 0 ? taggedLines : lines;

  const rows = [];
  const seenKeys = new Set();

  for (let line of targetLines) {
    if (/^[\|\-\s:]+$/.test(line)) continue;
    line = line.replace(/^ROW\s*\|\|\s*/i, "");

    let parts = [];
    if (line.includes("||")) {
      parts = line.split("||").map(p => p.trim());
    } else if ((line.match(/\|/g) || []).length >= 3) {
      const trimmedPipe = line.replace(/^\|/, "").replace(/\|$/, "");
      parts = trimmedPipe.split("|").map(p => p.trim());
    }

    if (parts.length >= 4) {
      if (parts.length >= 5 && (/^\d+[\.\)]?$/.test(parts[0]) || parts[0].toLowerCase().includes("no"))) {
        parts.shift();
      }

      let focus = parts[0]
        .replace(/^\*?Row\s*\d+\s*:\*?\s*/i, "")
        .replace(/^\d+[\.\)]\s*/, "")
        .replace(/^[\-\*]+\s*/, "")
        .replace(/\*\*/g, "")
        .replace(/`/g, "")
        .trim();

      let act = parts[1].replace(/\*\*/g, "").replace(/`/g, "").trim();
      let keyAct = parts[2].replace(/\*\*/g, "").replace(/`/g, "").trim();
      let ev = parts[3].replace(/\*\*/g, "").replace(/`/g, "").trim();

      const lowerFocus = focus.toLowerCase();
      if (
        lowerFocus === "focus area" ||
        lowerFocus.includes("specific rule") ||
        lowerFocus.includes("order:") ||
        lowerFocus.includes("format as") ||
        act.toLowerCase() === "activities" ||
        keyAct.toLowerCase() === "key activities"
      ) {
        continue;
      }

      const uniqueSignature = `${lowerFocus}|${act.toLowerCase()}`;
      if (seenKeys.has(uniqueSignature)) continue;
      seenKeys.add(uniqueSignature);

      rows.push({
        focus_area: focus,
        activities: act,
        key_activities: keyAct,
        evidence: ev
      });
    }
  }

  if (rows.length > 0) return rows;
  throw new Error("Could not format the notes into a table. Please tap Generate again.");
}

function parseSingleRowFromAI(rawText, fallbackRow) {
  try {
    const parsedRows = parseTableFromAI(rawText);
    if (parsedRows && parsedRows.length > 0) {
      return parsedRows[0];
    }
  } catch (ignore) { }
  return fallbackRow;
}

async function generateAIReport(mode) {
  const apiKey = (localStorage.getItem('geminiApiKey') || "").trim();
  if (!apiKey) {
    alert("Please paste and save your API Key in the settings box first.");
    document.getElementById('apiSettingsPanel').style.display = 'block';
    return;
  }

  const patient = document.getElementById('note-patient').value.trim();
  const docs = document.getElementById('note-docs').value.trim();
  const staff = document.getElementById('note-staff').value.trim();
  const ward = document.getElementById('note-ward').value.trim();

  const activeNotes = [];
  if (patient) activeNotes.push(`- Patient Care & Safety: ${patient}`);
  if (docs) activeNotes.push(`- Nursing Documentation: ${docs}`);
  if (staff) activeNotes.push(`- Staff Development: ${staff}`);
  if (ward) activeNotes.push(`- Ward Management: ${ward}`);

  if (activeNotes.length === 0) {
    alert("Please type rough notes into at least one box before generating the report.");
    return;
  }

  const loadingEl = document.getElementById('loading');
  loadingEl.style.display = 'block';
  loadingEl.innerText = "Communicating with AI... Please wait...";
  document.getElementById('ai-output-section').style.display = 'none';
  document.getElementById('ai-table-section').style.display = 'none';

  try {
    if (mode === 'table') {
      const tablePrompt = `You are an expert Nursing In-Charge of the Fourth Floor (managing the Gynaecology and Paediatric wards) compiling a formal Monthly Nursing Activities Report.

Convert ONLY the provided rough notes below into table rows.
CRITICAL RULES:
1. Do NOT invent, assume, or add rows for categories that are not listed below.
2. Only create rows for the specific activities mentioned in the user's rough notes.
3. Start every single output line with "ROW||" followed by the 4 columns separated by "||":
ROW||Focus area||Activities||Key activities||Evidence

Do NOT output any thinking process, explanations, headers, or extra text.

USER'S ROUGH NOTES:
${activeNotes.join("\n")}`;

      const rawResponse = await callAIProvider(tablePrompt, apiKey, loadingEl);
      const rows = parseTableFromAI(rawResponse);
      renderActivityTable(rows);
      document.getElementById('ai-table-section').style.display = 'block';

    } else {
      const narrativePrompt = `You are an expert Nursing In-Charge of the Fourth Floor (managing the Gynaecology and Paediatric wards) writing a formal "Monthly Nursing Activity Report". 
Take ONLY the rough notes provided below and rewrite them into a highly professional, clinical hospital report.
Do NOT invent activities for categories that were not provided. Do not use conversational filler.

USER'S ROUGH NOTES:
${activeNotes.join("\n")}`;

      const aiText = await callAIProvider(narrativePrompt, apiKey, loadingEl);
      document.getElementById('final-report-text').value = aiText;
      document.getElementById('ai-output-section').style.display = 'block';
    }
  } catch (error) {
    alert("API Notice: " + error.message);
  } finally {
    loadingEl.style.display = 'none';
  }
}

async function polishSingleRowWithAI(btn) {
  const apiKey = (localStorage.getItem('geminiApiKey') || "").trim();
  if (!apiKey) return alert("Please save your API Key first.");

  const tr = btn.closest('tr');
  const cells = tr.querySelectorAll('td');
  const currentRowData = {
    focus_area: cells[1].innerText.trim(),
    activities: cells[2].innerText.trim(),
    key_activities: cells[3].innerText.trim(),
    evidence: cells[4].innerText.trim()
  };

  const originalBtnText = btn.innerText;
  btn.innerText = "⏳";
  btn.disabled = true;
  tr.style.backgroundColor = "#f0fdfa";

  const rowPrompt = `You are an expert Nursing In-Charge of the Fourth Floor (Gynaecology & Paediatric wards).
Polish the following single row from a Monthly Nursing Activity Report table into professional clinical hospital terminology. Keep all specific numbers or facts, and if any field is rough or placeholder text, infer appropriate professional content.

Output ONLY a single line starting with "ROW||" in this exact format:
ROW||Focus area||Activities||Key activities||Evidence

Do NOT output any thinking or extra lines.

CURRENT ROW:
${currentRowData.focus_area} || ${currentRowData.activities} || ${currentRowData.key_activities} || ${currentRowData.evidence}`;

  try {
    const rawResponse = await callAIProvider(rowPrompt, apiKey, null);
    const polished = parseSingleRowFromAI(rawResponse, currentRowData);

    cells[1].innerText = polished.focus_area || currentRowData.focus_area;
    cells[2].innerText = polished.activities || currentRowData.activities;
    cells[3].innerText = polished.key_activities || currentRowData.key_activities;
    cells[4].innerText = polished.evidence || currentRowData.evidence;
  } catch (error) {
    alert("Could not polish row: " + error.message);
  } finally {
    btn.innerText = originalBtnText;
    btn.disabled = false;
    setTimeout(() => { tr.style.backgroundColor = ""; }, 600);
  }
}

async function polishEntireTableWithAI() {
  const apiKey = (localStorage.getItem('geminiApiKey') || "").trim();
  if (!apiKey) return alert("Please save your API Key first.");

  const trs = document.querySelectorAll('#activity-table-body tr');
  if (trs.length === 0) return alert("No rows in the table to polish.");

  const currentLines = [];
  trs.forEach(tr => {
    const cells = tr.querySelectorAll('td');
    currentLines.push(`${cells[1].innerText.trim()} || ${cells[2].innerText.trim()} || ${cells[3].innerText.trim()} || ${cells[4].innerText.trim()}`);
  });

  const loadingEl = document.getElementById('loading');
  loadingEl.style.display = 'block';
  loadingEl.innerText = "Polishing your table edits with AI...";

  const polishTablePrompt = `You are an expert Nursing In-Charge of the Fourth Floor (Gynaecology & Paediatric wards).
Below are ${currentLines.length} row(s) of a Monthly Nursing Activity Report table that the user has manually edited.
Polish the grammar and clinical terminology of each row while keeping the EXACT same number of rows (${currentLines.length}) and preserving all facts/numbers.

Start every single output line with "ROW||" in this exact format:
ROW||Focus area||Activities||Key activities||Evidence

Do NOT output any thinking, headers, or extra text.

CURRENT TABLE ROWS:
${currentLines.join("\n")}`;

  try {
    const rawResponse = await callAIProvider(polishTablePrompt, apiKey, loadingEl);
    const polishedRows = parseTableFromAI(rawResponse);
    renderActivityTable(polishedRows);
  } catch (error) {
    alert("API Notice: " + error.message);
  } finally {
    loadingEl.style.display = 'none';
  }
}

async function polishNarrativeWithAI() {
  const apiKey = (localStorage.getItem('geminiApiKey') || "").trim();
  if (!apiKey) return alert("Please save your API Key first.");

  const currentText = document.getElementById('final-report-text').value.trim();
  if (!currentText) return alert("Nothing to polish.");

  const loadingEl = document.getElementById('loading');
  loadingEl.style.display = 'block';
  loadingEl.innerText = "Polishing your edited report with AI...";

  const polishTextPrompt = `You are an expert Nursing In-Charge of the Fourth Floor (Gynaecology & Paediatric wards).
The user has manually edited or added notes to the following Monthly Nursing Activity Report.
Please polish the grammar, sentence flow, and clinical terminology while strictly keeping all their newly added points, numbers, and structure intact. Do not include conversational filler.

CURRENT EDITED REPORT:
${currentText}`;

  try {
    const polishedText = await callAIProvider(polishTextPrompt, apiKey, loadingEl);
    document.getElementById('final-report-text').value = polishedText;
  } catch (error) {
    alert("API Notice: " + error.message);
  } finally {
    loadingEl.style.display = 'none';
  }
}

function renderActivityTable(rows) {
  const tbody = document.getElementById('activity-table-body');
  tbody.innerHTML = "";
  rows.forEach((row, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
            <td class="col-no">${index + 1}</td>
            <td contenteditable="true">${row.focus_area || ''}</td>
            <td contenteditable="true">${row.activities || ''}</td>
            <td contenteditable="true">${row.key_activities || ''}</td>
            <td contenteditable="true">${row.evidence || ''}</td>
            <td class="col-actions">
                <button class="row-action-btn polish-row-btn" onclick="polishSingleRowWithAI(this)" title="Polish this row with AI">✨</button>
                <button class="row-action-btn del-row-btn" onclick="deleteTableRow(this)" title="Remove row">&times;</button>
            </td>
        `;
    tbody.appendChild(tr);
  });
}

function addEmptyTableRow() {
  const tbody = document.getElementById('activity-table-body');
  const tr = document.createElement('tr');
  const nextNo = tbody.children.length + 1;
  tr.innerHTML = `
        <td class="col-no">${nextNo}</td>
        <td contenteditable="true">Ward Management</td>
        <td contenteditable="true">Type activity...</td>
        <td contenteditable="true">Type rough details here, then tap ✨ to polish...</td>
        <td contenteditable="true">Type evidence...</td>
        <td class="col-actions">
            <button class="row-action-btn polish-row-btn" onclick="polishSingleRowWithAI(this)" title="Polish this row with AI">✨</button>
            <button class="row-action-btn del-row-btn" onclick="deleteTableRow(this)" title="Remove row">&times;</button>
        </td>
    `;
  tbody.appendChild(tr);
}

function deleteTableRow(btn) {
  const tr = btn.closest('tr');
  tr.remove();
  const rows = document.querySelectorAll('#activity-table-body tr');
  rows.forEach((row, idx) => {
    row.querySelector('.col-no').innerText = idx + 1;
  });
}

function downloadTabularActivityPDF() {
  const monthYear = (document.getElementById('report-month').value || "MONTHLY").toUpperCase().trim();
  const rows = document.querySelectorAll('#activity-table-body tr');
  let tableRowsHtml = "";

  rows.forEach((row, idx) => {
    const cells = row.querySelectorAll('td');
    tableRowsHtml += `
            <tr>
                <td class="col-no">${idx + 1}</td>
                <td>${cells[1].innerHTML}</td>
                <td>${cells[2].innerHTML}</td>
                <td>${cells[3].innerHTML}</td>
                <td>${cells[4].innerHTML}</td>
            </tr>
        `;
  });

  const printWindow = window.open('', '_blank');
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>${monthYear} ACTIVITIES REPORT</title>
        <style>
            @page { size: A4 landscape; margin: 18mm; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            body { font-family: 'Segoe UI', Helvetica, Arial, sans-serif; color: #333; margin: 0; padding: 20px; }
            .title-wrapper { text-align: center; margin-bottom: 30px; }
            h1 {
                color: #163a5f;
                font-size: 24px;
                font-weight: 700;
                letter-spacing: 0.5px;
                margin: 0;
                display: inline-block;
                padding-bottom: 8px;
                border-bottom: 2px solid #163a5f;
                text-transform: uppercase;
            }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13.5px; }
            th {
                background-color: #163a5f !important;
                color: #ffffff !important;
                font-weight: 600;
                text-align: left;
                padding: 14px 12px;
                border: 1px solid #163a5f;
            }
            td {
                padding: 14px 12px;
                border: 1px solid #dcdcdc;
                vertical-align: top;
                line-height: 1.5;
                color: #2c3e50;
            }
            .col-no { width: 45px; text-align: center; font-weight: 700; }
            .col-focus { width: 18%; }
            .col-act { width: 18%; }
            .col-key { width: 39%; }
            .col-ev { width: 20%; }
        </style>
    </head>
    <body onload="window.print()">
        <div class="title-wrapper">
            <h1>${monthYear} ACTIVITIES REPORT</h1>
        </div>
        <table>
            <thead>
                <tr>
                    <th class="col-no">No.</th>
                    <th class="col-focus">Focus area</th>
                    <th class="col-act">Activities</th>
                    <th class="col-key">Key activities</th>
                    <th class="col-ev">Evidence</th>
                </tr>
            </thead>
            <tbody>
                ${tableRowsHtml}
            </tbody>
        </table>
    </body>
    </html>`;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

function downloadNarrativeActivityPDF() {
  const monthYear = (document.getElementById('report-month').value || "Monthly").trim();
  const reportText = document.getElementById('final-report-text').value.replace(/\n/g, '<br>');
  const printWindow = window.open('', '_blank');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>${monthYear} Nursing Activity Report</title>
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
            <h1>${monthYear} - Nursing Activity Report</h1>
            <div class="date">Fourth Floor (Gynaecology & Paediatric Wards) | Generated: ${new Date().toLocaleDateString()}</div>
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
// TAB 3: MINUTES OF MEETING (MOM) LOGIC
// ============================================================================

function renderMOMTable(rows) {
  const tbody = document.getElementById('mom-table-body');
  tbody.innerHTML = "";
  rows.forEach((row, index) => {
    appendMOMRowElement(tbody, index + 1, row);
  });
}

function appendMOMRowElement(tbody, indexNum, row) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
        <td class="col-no">${indexNum}.</td>
        <td class="col-mom-topic" contenteditable="true">${row.topic || ''}</td>
        <td class="col-mom-disc" contenteditable="true">${row.discussion || ''}</td>
        <td class="col-mom-act" contenteditable="true">${row.action || ''}</td>
        <td class="col-mom-resp" contenteditable="true">${row.responsibility || 'ALL STAFF'}</td>
        <td class="col-actions">
            <button class="row-action-btn polish-row-btn" onclick="polishSingleMOMRowWithAI(this)" title="Enhance this MOM row with AI">✨</button>
            <button class="row-action-btn del-row-btn" onclick="deleteMOMRow(this)" title="Remove row">&times;</button>
        </td>
    `;
  tbody.appendChild(tr);
}

function addEmptyMOMRow() {
  const tbody = document.getElementById('mom-table-body');
  const nextNo = tbody.children.length + 1;
  appendMOMRowElement(tbody, nextNo, {
    topic: "New Topic",
    discussion: "- Type rough discussion points here, then tap ✨ to enhance...",
    action: "",
    responsibility: "ALL STAFF"
  });
}

function deleteMOMRow(btn) {
  const tr = btn.closest('tr');
  tr.remove();
  const rows = document.querySelectorAll('#mom-table-body tr');
  rows.forEach((row, idx) => {
    row.querySelector('.col-no').innerText = `${idx + 1}.`;
  });
}

function resetDefaultMOMRows() {
  if (confirm("Reset the MOM table back to the 8 standard Nursing Department topics?")) {
    renderMOMTable(DEFAULT_MOM_TOPICS);
  }
}

function parseMOMRowsFromAI(rawText) {
  if (!rawText || !rawText.trim()) {
    throw new Error("Empty response from AI. Please try again.");
  }

  const cleaned = rawText.replace(/```[a-z]*/gi, "").replace(/```/g, "").trim();
  const lines = cleaned.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

  const taggedLines = lines.filter(l => l.toUpperCase().startsWith("MOM||") || l.toUpperCase().startsWith("MOM ||"));
  const targetLines = taggedLines.length > 0 ? taggedLines : lines;

  const rows = [];
  for (let line of targetLines) {
    if (/^[\|\-\s:]+$/.test(line)) continue;
    line = line.replace(/^MOM\s*\|\|\s*/i, "");

    let parts = [];
    if (line.includes("||")) {
      parts = line.split("||").map(p => p.trim());
    } else if ((line.match(/\|/g) || []).length >= 3) {
      const trimmedPipe = line.replace(/^\|/, "").replace(/\|$/, "");
      parts = trimmedPipe.split("|").map(p => p.trim());
    }

    if (parts.length >= 4) {
      if (parts.length >= 5 && (/^\d+[\.\)]?$/.test(parts[0]) || parts[0].toLowerCase().includes("sl"))) {
        parts.shift();
      }

      let topic = parts[0]
        .replace(/^\d+[\.\)]\s*/, "")
        .replace(/\*\*/g, "")
        .trim();

      if (topic.toLowerCase() === "topic") continue;

      // Convert <br> tags back to clean newlines with bullets
      let discussion = parts[1]
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/\s*;\s*-\s*/g, "\n- ")
        .replace(/\*\*/g, "")
        .trim();

      let action = parts[2].replace(/\*\*/g, "").trim();
      if (action.toLowerCase() === "none" || action === "-") action = "";

      let responsibility = parts[3].replace(/\*\*/g, "").trim() || "ALL STAFF";

      rows.push({ topic, discussion, action, responsibility });
    }
  }

  if (rows.length > 0) return rows;
  throw new Error("Could not parse MOM rows from AI response. Please try again.");
}

// --- MOM AI 1: CONVERT ROUGH NOTES & APPEND TO MOM TABLE ---
async function appendRoughNotesToMOMWithAI() {
  const apiKey = (localStorage.getItem('geminiApiKey') || "").trim();
  if (!apiKey) {
    alert("Please paste and save your API Key in the settings box first.");
    document.getElementById('apiSettingsPanel').style.display = 'block';
    return;
  }

  const roughNotes = document.getElementById('mom-rough-notes').value.trim();
  if (!roughNotes) {
    alert("Please type some rough discussion notes into the box first.");
    return;
  }

  const loadingEl = document.getElementById('mom-loading');
  loadingEl.style.display = 'block';
  loadingEl.innerText = "Formatting your new MOM points with AI...";

  const prompt = `You are an expert Nursing In-Charge preparing official "Minutes of Meeting - Nursing Department".
Convert the user's rough meeting notes below into one or more formal MOM table rows.

CRITICAL FORMAT RULES:
1. Start every single output row with "MOM||" followed by the 4 columns separated by "||":
MOM||Topic||Discussion Points||Action||Responsibility
2. Inside "Discussion Points", write clear, professional hospital instructions as bullet points separated by "<br>" (for example: "- First point.<br>- Second point.").
3. If there is a specific action item, start it with "➤ " (e.g., "➤ Monitor the staffs"), or leave it empty if none.
4. Default "Responsibility" to "ALL STAFF" unless a specific role is mentioned.
5. Do NOT output any thinking, headers, or extra lines.

USER'S ROUGH MEETING NOTES:
${roughNotes}`;

  try {
    const rawResponse = await callAIProvider(prompt, apiKey, loadingEl);
    const newRows = parseMOMRowsFromAI(rawResponse);
    const tbody = document.getElementById('mom-table-body');
    newRows.forEach(r => {
      const nextNo = tbody.children.length + 1;
      appendMOMRowElement(tbody, nextNo, r);
    });
    document.getElementById('mom-rough-notes').value = "";
  } catch (error) {
    alert("API Notice: " + error.message);
  } finally {
    loadingEl.style.display = 'none';
  }
}

// --- MOM AI 2: POLISH A SINGLE MOM ROW ---
async function polishSingleMOMRowWithAI(btn) {
  const apiKey = (localStorage.getItem('geminiApiKey') || "").trim();
  if (!apiKey) return alert("Please save your API Key first.");

  const tr = btn.closest('tr');
  const cells = tr.querySelectorAll('td');
  const currentRow = {
    topic: cells[1].innerText.trim(),
    discussion: cells[2].innerText.trim(),
    action: cells[3].innerText.trim(),
    responsibility: cells[4].innerText.trim()
  };

  const originalBtnText = btn.innerText;
  btn.innerText = "⏳";
  btn.disabled = true;
  tr.style.backgroundColor = "#f0fdfa";

  const rowPrompt = `You are an expert Nursing In-Charge preparing official "Minutes of Meeting - Nursing Department".
Polish the following single MOM topic row into clear, professional nursing department guidelines while preserving all specific names (e.g., Lissy Madam) and facts.
Format multiple sentences in "Discussion Points" as bullet points separated by "<br>" (e.g., "- Point 1.<br>- Point 2.").

Output ONLY a single line starting with "MOM||" in this exact format:
MOM||Topic||Discussion Points||Action||Responsibility

Do NOT output any thinking or extra text.

CURRENT ROW:
${currentRow.topic} || ${currentRow.discussion.replace(/\r?\n/g, " <br> ")} || ${currentRow.action} || ${currentRow.responsibility}`;

  try {
    const rawResponse = await callAIProvider(rowPrompt, apiKey, null);
    const polishedList = parseMOMRowsFromAI(rawResponse);
    if (polishedList && polishedList.length > 0) {
      const polished = polishedList[0];
      cells[1].innerText = polished.topic || currentRow.topic;
      cells[2].innerText = polished.discussion || currentRow.discussion;
      cells[3].innerText = polished.action !== undefined ? polished.action : currentRow.action;
      cells[4].innerText = polished.responsibility || currentRow.responsibility;
    }
  } catch (error) {
    alert("Could not polish MOM row: " + error.message);
  } finally {
    btn.innerText = originalBtnText;
    btn.disabled = false;
    setTimeout(() => { tr.style.backgroundColor = ""; }, 600);
  }
}

// --- MOM AI 3: POLISH ALL MOM TABLE EDITS ---
async function polishEntireMOMWithAI() {
  const apiKey = (localStorage.getItem('geminiApiKey') || "").trim();
  if (!apiKey) return alert("Please save your API Key first.");

  const trs = document.querySelectorAll('#mom-table-body tr');
  if (trs.length === 0) return alert("No MOM rows to polish.");

  const currentLines = [];
  trs.forEach(tr => {
    const cells = tr.querySelectorAll('td');
    const discSingleLine = cells[2].innerText.trim().replace(/\r?\n/g, " <br> ");
    currentLines.push(`${cells[1].innerText.trim()} || ${discSingleLine} || ${cells[3].innerText.trim()} || ${cells[4].innerText.trim()}`);
  });

  const loadingEl = document.getElementById('mom-loading');
  loadingEl.style.display = 'block';
  loadingEl.innerText = "Polishing all MOM rows with AI...";

  const prompt = `You are an expert Nursing In-Charge preparing official "Minutes of Meeting - Nursing Department".
Below are ${currentLines.length} row(s) from the Minutes of Meeting table.
Polish the grammar and professional nursing terminology of every row while keeping the EXACT same number of rows (${currentLines.length}), their order, and all specific instructions/names intact.
Keep bullet points inside "Discussion Points" separated by "<br>".

Start every single output line with "MOM||" in this exact format:
MOM||Topic||Discussion Points||Action||Responsibility

Do NOT output any thinking, headers, or extra text.

CURRENT MOM ROWS:
${currentLines.join("\n")}`;

  try {
    const rawResponse = await callAIProvider(prompt, apiKey, loadingEl);
    const polishedRows = parseMOMRowsFromAI(rawResponse);
    renderMOMTable(polishedRows);
  } catch (error) {
    alert("API Notice: " + error.message);
  } finally {
    loadingEl.style.display = 'none';
  }
}

// --- PDF DOWNLOAD: MINUTES OF MEETING (MATCHES NURSING DEPT MOM PDF) ---
function downloadMOMPDF() {
  const title = (document.getElementById('mom-title').value || "Minutes of Meeting - Nursing Department").trim();
  const dateStr = (document.getElementById('mom-date').value || "").trim();
  const preparedBy = (document.getElementById('mom-prepared').value || "DANY MATHEW").trim();
  const approvedBy = (document.getElementById('mom-approved').value || "").trim();

  const rows = document.querySelectorAll('#mom-table-body tr');
  let tableRowsHtml = "";

  rows.forEach((row, idx) => {
    const cells = row.querySelectorAll('td');
    const topicHtml = cells[1].innerText.trim().replace(/\n/g, '<br>');
    const discHtml = cells[2].innerText.trim().replace(/\n/g, '<br>');
    const actHtml = cells[3].innerText.trim().replace(/\n/g, '<br>');
    const respHtml = cells[4].innerText.trim().replace(/\n/g, '<br>');

    tableRowsHtml += `
            <tr>
                <td class="col-sl">${idx + 1}.</td>
                <td class="col-topic">${topicHtml}</td>
                <td class="col-disc">${discHtml}</td>
                <td class="col-act">${actHtml}</td>
                <td class="col-resp">${respHtml}</td>
            </tr>
        `;
  });

  const printWindow = window.open('', '_blank');
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>${title}</title>
        <style>
            @page { size: A4 portrait; margin: 15mm; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            body { font-family: 'Segoe UI', Arial, sans-serif; color: #111; margin: 0; padding: 10px; }
            .header-box { text-align: center; margin-bottom: 18px; }
            h1 { font-size: 20px; margin: 0 0 5px 0; color: #163a5f; text-transform: uppercase; }
            .date-sub { font-size: 13px; color: #444; font-weight: 600; }
            table { width: 100%; border-collapse: collapse; font-size: 13px; page-break-inside: auto; }
            tr { page-break-inside: avoid; page-break-after: auto; }
            thead { display: table-header-group; }
            th {
                background-color: #163a5f !important;
                color: #fff !important;
                padding: 10px 8px;
                border: 1px solid #222;
                text-align: left;
                font-weight: 700;
            }
            td {
                padding: 10px 8px;
                border: 1px solid #222;
                vertical-align: top;
                line-height: 1.45;
            }
            .col-sl { width: 40px; text-align: center; font-weight: 700; }
            .col-topic { width: 19%; font-weight: 700; }
            .col-disc { width: 51%; }
            .col-act { width: 14%; font-weight: 600; }
            .col-resp { width: 11%; text-align: center; font-weight: 700; vertical-align: middle; }
            .signoff-table { width: 100%; border-collapse: collapse; margin-top: 22px; font-size: 13px; page-break-inside: avoid; }
            .signoff-table td { border: 1px solid #222; padding: 10px 12px; font-weight: 700; }
            .signoff-label { width: 25%; background-color: #f8f9fa !important; }
        </style>
    </head>
    <body onload="window.print()">
        <div class="header-box">
            <h1>${title}</h1>
            ${dateStr ? `<div class="date-sub">Date: ${dateStr}</div>` : ''}
        </div>
        <table>
            <thead>
                <tr>
                    <th class="col-sl">Sl. No.</th>
                    <th class="col-topic">Topic</th>
                    <th class="col-disc">Discussion Points</th>
                    <th class="col-act">Action</th>
                    <th class="col-resp">Responsibility</th>
                </tr>
            </thead>
            <tbody>
                ${tableRowsHtml}
            </tbody>
        </table>

        <table class="signoff-table">
            <tr>
                <td class="signoff-label">Prepared by:</td>
                <td>${preparedBy}</td>
            </tr>
            <tr>
                <td class="signoff-label">Approved by:</td>
                <td>${approvedBy}</td>
            </tr>
        </table>
    </body>
    </html>`;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

// ============================================================================
// TAB 1: WORKFORCE ANALYZER LOGIC
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
  const dailyShiftsNeeded = nursesPerShift * 3;
  const totalShiftsRequired = dailyShiftsNeeded * days;
  const totalLeaves = weeklyOffs + nightOffs + cl + ph + emergency;
  const workingDays = days - totalLeaves;
  const totalAvailableShifts = staff * workingDays;
  const margin = totalAvailableShifts - totalShiftsRequired;
  const idealNursesPerShift = Math.ceil(maxPatients / targetRatio);

  document.getElementById('resMaxPatients').innerText = maxPatients;
  const ratioEl = document.getElementById('resRatio');
  if (actualRatio > targetRatio) {
    ratioEl.innerHTML = `1:${actualRatio.toFixed(1)} <span class="ratio-alert">(Danger: Exceeds 1:${targetRatio})</span>`;
  } else {
    ratioEl.innerText = `1:${actualRatio.toFixed(1)}`;
  }

  document.getElementById('resRequired').innerText = totalShiftsRequired;
  document.getElementById('resAvailable').innerText = totalAvailableShifts;
  document.getElementById('resMargin').innerText = margin;

  const statusEl = document.getElementById('resStatus');
  statusEl.className = "";
  let verdict = "";

  if (actualRatio > targetRatio) {
    verdict = `Unsafe Ratio (Requires ${idealNursesPerShift} nurses/shift)`;
    statusEl.classList.add("status-understaffed");
  } else if (margin > 5) {
    verdict = "Adequate Staffing";
    statusEl.classList.add("status-adequate");
  } else if (margin >= 0) {
    verdict = "Extremely Tight";
    statusEl.classList.add("status-tight");
  } else {
    verdict = "Understaffed Shift Roster";
    statusEl.classList.add("status-understaffed");
  }
  statusEl.innerText = verdict;
  document.getElementById('results').style.display = 'block';

  reportData = { beds, babies, maxPatients, targetRatio, actualRatio: actualRatio.toFixed(1), staff, days, nursesPerShift, idealNursesPerShift, totalLeaves, workingDays, totalShiftsRequired, totalAvailableShifts, margin, verdict, statusClass: statusEl.className };
}

function downloadCSV() {
  calculateAnalyzer();
  let csv = "Parameter,Value\n";
  csv += `Maximum Patient Load,${reportData.maxPatients}\n`;
  csv += `Actual Assigned Ratio,1 to ${reportData.actualRatio}\n\n`;
  csv += `Total Current Staff,${reportData.staff}\n`;
  csv += `Days in Month,${reportData.days}\n`;
  csv += `Total Monthly Shifts Required,${reportData.totalShiftsRequired}\n`;
  csv += `Total Available Staff Shifts,${reportData.totalAvailableShifts}\n\n`;
  csv += `Shift Surplus/Deficit,${reportData.margin}\n`;
  csv += `Verdict,${reportData.verdict}\n`;
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', 'Workforce_Analysis.csv');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function downloadAnalyzerPDF() {
  calculateAnalyzer();
  let bgColor = "#fff3cd"; let txtColor = "#856404"; let borderColor = "#ffeeba";
  if (reportData.statusClass.includes("adequate")) { bgColor = "#d4edda"; txtColor = "#155724"; borderColor = "#c3e6cb"; }
  if (reportData.statusClass.includes("understaffed")) { bgColor = "#f8d7da"; txtColor = "#721c24"; borderColor = "#f5c6cb"; }

  const printWindow = window.open('', '_blank');
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Workforce Analysis Report</title>
        <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #333; max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 30px; padding-bottom: 10px; border-bottom: 2px solid #2c3e50; }
            h1 { color: #2c3e50; margin: 0 0 10px 0; font-size: 24px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f8f9fa; width: 60%; font-weight: 600; }
            .section-title { background-color: #2c3e50; color: white; padding: 10px; font-weight: bold; margin: 0; }
            .verdict-box { margin-top: 20px; padding: 20px; background-color: ${bgColor}; color: ${txtColor}; border: 1px solid ${borderColor}; border-radius: 8px; text-align: center; }
        </style>
    </head>
    <body onload="window.print()">
        <div class="header">
            <h1>Gynaecology Ward - Workforce Analysis Report</h1>
            <div>Generated on: ${new Date().toLocaleDateString()}</div>
        </div>
        <div class="section-title">1. Patient Capacity & Ratios</div>
        <table>
            <tr><th>Maximum Patient Load</th><td><strong>${reportData.maxPatients}</strong></td></tr>
            <tr><th>Actual Assigned Ratio</th><td><strong>1 to ${reportData.actualRatio}</strong></td></tr>
        </table>
        <div class="section-title">2. Shift & Staffing Metrics</div>
        <table>
            <tr><th>Total Current Staff</th><td>${reportData.staff}</td></tr>
            <tr><th>Total Monthly Shifts Required</th><td><strong>${reportData.totalShiftsRequired}</strong></td></tr>
            <tr><th>Total Available Staff Shifts</th><td><strong>${reportData.totalAvailableShifts}</strong></td></tr>
            <tr><th>Shift Surplus / Deficit</th><td><strong>${reportData.margin}</strong></td></tr>
        </table>
        <div class="verdict-box">
            <h3>Final Workforce Assessment</h3>
            <p style="font-size: 20px; font-weight: bold; margin: 10px 0 0 0;">${reportData.verdict}</p>
        </div>
    </body>
    </html>`;
  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}