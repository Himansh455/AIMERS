import type { PatientProfile, MedicalReport, LabResult, ConflictItem, AISummary } from '../types/clinical';
import { getProvenanceMeta, getLabStatusMeta } from './provenance';

export function exportStructuredClinicalRecordToPrint(
  patient: PatientProfile,
  _reports: MedicalReport[],
  labs: LabResult[],
  _conflicts: ConflictItem[],
  aiSummary: AISummary
) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to export the structured clinical record.');
    return;
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>MedLens Clinical Information Record - ${patient.name} (${patient.mrn})</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #242126;
      background: #FFFFFF;
      margin: 0;
      padding: 40px;
      line-height: 1.5;
    }
    .header {
      border-bottom: 2px solid #2B1E2F;
      padding-bottom: 20px;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .logo {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #2B1E2F;
    }
    .subtitle {
      font-size: 13px;
      color: #6F6870;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .badge-demo {
      background: #F7F4EE;
      border: 1px solid #E0D8CC;
      color: #2B1E2F;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
    }
    .section {
      margin-bottom: 35px;
    }
    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: #2B1E2F;
      border-bottom: 1px solid #E0D8CC;
      padding-bottom: 6px;
      margin-bottom: 15px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
    .card {
      background: #FCFAF6;
      border: 1px solid #E8E2D9;
      padding: 16px;
      border-radius: 6px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      margin-top: 10px;
    }
    th, td {
      padding: 10px 12px;
      text-align: left;
      border-bottom: 1px solid #E8E2D9;
    }
    th {
      background: #F7F4EE;
      font-weight: 600;
      color: #2B1E2F;
    }
    .status-LOW, .status-HIGH {
      color: #A54E43;
      font-weight: 700;
    }
    .status-NORMAL {
      color: #4F7359;
      font-weight: 600;
    }
    .status-UNDETERMINED {
      color: #6F6870;
      font-style: italic;
    }
    .disclaimer {
      background: #FDF3E7;
      border: 1px solid #C08A3E;
      color: #7C521A;
      padding: 16px;
      border-radius: 6px;
      font-size: 12px;
      margin-top: 40px;
    }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>

  <div class="no-print" style="margin-bottom: 20px;">
    <button onclick="window.print()" style="background: #2B1E2F; color: #FFFFFF; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; cursor: pointer;">Print / Save as PDF</button>
  </div>

  <div class="header">
    <div>
      <div class="logo">MEDLENS</div>
      <div class="subtitle">Clinical Information Intelligence — Structured Record</div>
    </div>
    <div class="badge-demo">SYNTHETIC DEMO RECORD</div>
  </div>

  <div class="section">
    <div class="section-title">Patient Profile</div>
    <div class="grid">
      <div class="card">
        <strong>Name:</strong> ${patient.name}<br>
        <strong>MRN:</strong> ${patient.mrn}<br>
        <strong>Age / Sex:</strong> ${patient.age}y / ${patient.sex}<br>
        <strong>DOB:</strong> ${patient.dob}
      </div>
      <div class="card">
        <strong>Active Conditions:</strong> ${patient.conditions.map((c) => c.name).join(', ')}<br>
        <strong>Known Allergies:</strong> ${patient.allergies.map((a) => `${a.allergen} (${a.reaction})`).join(', ')}<br>
        <strong>Active Medications:</strong> ${patient.medications.map((m) => `${m.name} ${m.dosage}`).join(', ')}
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">AI Information Summary</div>
    <div class="card" style="background: #F7F4EE;">
      <p style="margin: 0 0 10px 0;">${aiSummary.summaryText}</p>
      <ul style="margin: 0; padding-left: 20px; font-size: 13px;">
        ${aiSummary.keyFindings.map((f) => `<li>${f}</li>`).join('')}
      </ul>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Structured Laboratory Results</div>
    <table>
      <thead>
        <tr>
          <th>Test Name</th>
          <th>Result Value</th>
          <th>Units</th>
          <th>Report Reference Range</th>
          <th>Status</th>
          <th>Source Document</th>
          <th>Provenance</th>
        </tr>
      </thead>
      <tbody>
        ${labs
          .map((lab) => {
            const statusMeta = getLabStatusMeta(lab.status);
            const provMeta = getProvenanceMeta(lab.provenance);
            return `
            <tr>
              <td><strong>${lab.testName}</strong></td>
              <td>${lab.value}</td>
              <td>${lab.unit}</td>
              <td>${lab.referenceRange || 'Reference range not provided'}</td>
              <td class="status-${lab.status}">${statusMeta.label}</td>
              <td>${lab.sourceReportName}</td>
              <td>${provMeta.label}</td>
            </tr>
          `;
          })
          .join('')}
      </tbody>
    </table>
  </div>

  <div class="disclaimer">
    <strong>SAFETY & RESPONSIBLE AI NOTICE:</strong><br>
    ${aiSummary.disclaimer}
  </div>

</body>
</html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
