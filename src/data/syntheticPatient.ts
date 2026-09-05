import type { PatientProfile, MedicalReport, ConflictItem, TimelineEvent, AISummary } from '../types/clinical';
import { generateResponsibleAISummary } from '../utils/safetyGuard';

export const INITIAL_SYNTHETIC_PATIENT: PatientProfile = {
  id: 'patient-eleanor-vance',
  name: 'Eleanor Vance',
  mrn: 'MRN-8942-01',
  age: 68,
  sex: 'Female',
  dob: '1958-03-14',
  updatedAt: '04 Sep 2026',
  symptoms: [
    {
      id: 'sym-1',
      description: 'Persistent mild fatigue over the last 4 weeks',
      onsetDate: '2026-08-05',
      severity: 'MILD',
      notes: 'Patient reports feeling sluggish in afternoons despite 8 hours of sleep.',
    },
    {
      id: 'sym-2',
      description: 'Occasional mild shortness of breath upon climbing stairs',
      onsetDate: '2026-08-18',
      severity: 'MILD',
    },
  ],
  conditions: [
    {
      id: 'cond-1',
      name: 'Essential Hypertension',
      diagnosedDate: '2019-05-10',
      status: 'ACTIVE',
      source: 'PATIENT_PROVIDED',
      sourceDetail: 'Patient Intake Questionnaire (04 Sep 2026)',
    },
    {
      id: 'cond-2',
      name: 'Osteoarthritis (Left Knee)',
      diagnosedDate: '2021-11-04',
      status: 'ACTIVE',
      source: 'PATIENT_PROVIDED',
      sourceDetail: 'Patient Intake Questionnaire (04 Sep 2026)',
    },
  ],
  allergies: [
    {
      id: 'alg-1',
      allergen: 'Penicillin VK',
      reaction: 'Generalized hives and mild swelling',
      severity: 'MODERATE',
      source: 'PATIENT_PROVIDED',
      sourceDetail: 'Patient Intake Questionnaire (04 Sep 2026)',
    },
  ],
  medications: [
    {
      id: 'med-1',
      name: 'Lisnopril',
      dosage: '10 mg',
      frequency: 'Once daily (morning)',
      source: 'HUMAN_VERIFIED',
      sourceDetail: 'Verified from Pharmacy Dispensing Record & Patient Intake',
      startDate: '2019-05-12',
    },
    {
      id: 'med-2',
      name: 'Metformin',
      dosage: '500 mg',
      frequency: 'Twice daily with meals',
      source: 'PATIENT_PROVIDED',
      sourceDetail: 'Patient Intake Questionnaire (04 Sep 2026)',
      notes: 'Conflicting: Discrepancy detected with 02 Sep 2026 report listing no active diabetes meds.',
    },
  ],
  notes: 'Synthetic patient record created for MedLens clinical workspace evaluation.',
};

export const INITIAL_SYNTHETIC_REPORTS: MedicalReport[] = [
  {
    id: 'report-cbc-2026',
    fileName: 'CBC_Complete_Blood_Count_04Sep2026.pdf',
    fileSize: 428000,
    fileType: 'application/pdf',
    uploadedAt: '04 Sep 2026, 14:15',
    reportDate: '04 Sep 2026',
    facility: 'Metropolitan Clinical Laboratory',
    author: 'Dr. Marcus Thorne, MD (Pathology)',
    reportType: 'CBC',
    verificationCount: 3,
    status: 'PROCESSED',
    rawText: `METROPOLITAN CLINICAL LABORATORY
Report Date: 04 Sep 2026
Facility ID: MCL-8849
Patient: Vance, Eleanor (68F)
MRN: MRN-8942-01

COMPLETE BLOOD COUNT (CBC) WITH DIFFERENTIAL
Test Name | Result | Units | Reference Range
Hemoglobin | 11.2 | g/dL | 12.0 - 16.0
White Blood Cell (WBC) | 6.8 | 10^3/uL | 4.5 - 11.0
Platelets | 240 | 10^3/uL | 150 - 450
Red Blood Cell (RBC) | 3.85 | 10^6/uL | 4.20 - 5.40
Hematocrit | 34.1 | % | 37.0 - 48.0
Mean Corpuscular Volume (MCV) | 88.5 | fL | 80.0 - 100.0
High-Sensitivity CRP | 4.2 | mg/L | Not provided in report`,
    extractedResults: [
      {
        id: 'lab-hb-1',
        testName: 'Hemoglobin',
        value: '11.2',
        numericValue: 11.2,
        unit: 'g/dL',
        referenceRange: '12.0 - 16.0',
        status: 'LOW',
        statusExplanation: 'Value (11.2) is below the report reference range (12.0–16.0)',
        sourceReportId: 'report-cbc-2026',
        sourceReportName: 'CBC_Complete_Blood_Count_04Sep2026.pdf',
        sourceDate: '04 Sep 2026',
        sourcePage: 1,
        sourceExcerpt: 'Hemoglobin ........ 11.2 g/dL  (Reference range: 12.0 - 16.0 g/dL)',
        provenance: 'HUMAN_VERIFIED',
        confidence: 98,
        verificationRecord: {
          verifiedBy: 'Dr. Sarah Jenkins (Lead Clinician)',
          verifiedAt: '04 Sep 2026, 15:30',
        },
        category: 'Hematology',
      },
      {
        id: 'lab-wbc-1',
        testName: 'White Blood Cell (WBC)',
        value: '6.8',
        numericValue: 6.8,
        unit: '10^3/uL',
        referenceRange: '4.5 - 11.0',
        status: 'NORMAL',
        statusExplanation: 'Value (6.8) is within the report reference range (4.5–11.0)',
        sourceReportId: 'report-cbc-2026',
        sourceReportName: 'CBC_Complete_Blood_Count_04Sep2026.pdf',
        sourceDate: '04 Sep 2026',
        sourcePage: 1,
        sourceExcerpt: 'White Blood Cell (WBC) ........ 6.8 10^3/uL  (Reference range: 4.5 - 11.0)',
        provenance: 'HUMAN_VERIFIED',
        confidence: 96,
        verificationRecord: {
          verifiedBy: 'Dr. Sarah Jenkins (Lead Clinician)',
          verifiedAt: '04 Sep 2026, 15:30',
        },
        category: 'Hematology',
      },
      {
        id: 'lab-plt-1',
        testName: 'Platelets',
        value: '240',
        numericValue: 240,
        unit: '10^3/uL',
        referenceRange: '150 - 450',
        status: 'NORMAL',
        statusExplanation: 'Value (240) is within the report reference range (150–450)',
        sourceReportId: 'report-cbc-2026',
        sourceReportName: 'CBC_Complete_Blood_Count_04Sep2026.pdf',
        sourceDate: '04 Sep 2026',
        sourcePage: 1,
        sourceExcerpt: 'Platelets ........ 240 10^3/uL  (Reference range: 150 - 450)',
        provenance: 'HUMAN_VERIFIED',
        confidence: 99,
        category: 'Hematology',
      },
      {
        id: 'lab-rbc-1',
        testName: 'Red Blood Cell (RBC)',
        value: '3.85',
        numericValue: 3.85,
        unit: '10^6/uL',
        referenceRange: '4.20 - 5.40',
        status: 'LOW',
        statusExplanation: 'Value (3.85) is below the report reference range (4.20–5.40)',
        sourceReportId: 'report-cbc-2026',
        sourceReportName: 'CBC_Complete_Blood_Count_04Sep2026.pdf',
        sourceDate: '04 Sep 2026',
        sourcePage: 1,
        sourceExcerpt: 'Red Blood Cell (RBC) ........ 3.85 10^6/uL  (Reference range: 4.20 - 5.40)',
        provenance: 'AI_EXTRACTED',
        confidence: 94,
        category: 'Hematology',
      },
      {
        id: 'lab-hct-1',
        testName: 'Hematocrit',
        value: '34.1',
        numericValue: 34.1,
        unit: '%',
        referenceRange: '37.0 - 48.0',
        status: 'LOW',
        statusExplanation: 'Value (34.1) is below the report reference range (37.0–48.0)',
        sourceReportId: 'report-cbc-2026',
        sourceReportName: 'CBC_Complete_Blood_Count_04Sep2026.pdf',
        sourceDate: '04 Sep 2026',
        sourcePage: 1,
        sourceExcerpt: 'Hematocrit ........ 34.1 %  (Reference range: 37.0 - 48.0)',
        provenance: 'AI_EXTRACTED',
        confidence: 95,
        category: 'Hematology',
      },
      {
        id: 'lab-crp-1',
        testName: 'High-Sensitivity CRP',
        value: '4.2',
        numericValue: 4.2,
        unit: 'mg/L',
        referenceRange: 'Reference range not provided',
        status: 'UNDETERMINED',
        statusExplanation: 'Cannot determine from source',
        sourceReportId: 'report-cbc-2026',
        sourceReportName: 'CBC_Complete_Blood_Count_04Sep2026.pdf',
        sourceDate: '04 Sep 2026',
        sourcePage: 1,
        sourceExcerpt: 'High-Sensitivity CRP ........ 4.2 mg/L  (Reference range: Not provided in report)',
        provenance: 'AI_EXTRACTED',
        confidence: 91,
        category: 'Inflammatory Markers',
      },
    ],
  },
  {
    id: 'report-cmp-2026',
    fileName: 'Comprehensive_Metabolic_Panel_02Sep2026.pdf',
    fileSize: 384000,
    fileType: 'application/pdf',
    uploadedAt: '02 Sep 2026, 09:30',
    reportDate: '02 Sep 2026',
    facility: 'St. Jude Clinical Diagnostics',
    author: 'Dr. Aris Vance, MD',
    reportType: 'METABOLIC',
    verificationCount: 2,
    status: 'PROCESSED',
    rawText: `ST. JUDE CLINICAL DIAGNOSTICS
Report Date: 02 Sep 2026
Patient: Vance, Eleanor (68F)

COMPREHENSIVE METABOLIC PANEL
Current Medications section: None documented

Test Name | Result | Units | Reference Range
Glucose (Fasting) | 94 | mg/dL | 70 - 99
Blood Urea Nitrogen (BUN) | 18 | mg/dL | 7 - 20
Creatinine | 0.95 | mg/dL | 0.60 - 1.20
Sodium | 141 | mmol/L | 135 - 145
Potassium | 4.2 | mmol/L | 3.5 - 5.0
Serum Iron | 62 | ug/dL | Not provided in report`,
    extractedResults: [
      {
        id: 'lab-gluc-1',
        testName: 'Glucose (Fasting)',
        value: '94',
        numericValue: 94,
        unit: 'mg/dL',
        referenceRange: '70 - 99',
        status: 'NORMAL',
        statusExplanation: 'Value (94) is within the report reference range (70–99)',
        sourceReportId: 'report-cmp-2026',
        sourceReportName: 'Comprehensive_Metabolic_Panel_02Sep2026.pdf',
        sourceDate: '02 Sep 2026',
        sourcePage: 1,
        sourceExcerpt: 'Glucose (Fasting) ........ 94 mg/dL  (Reference range: 70 - 99)',
        provenance: 'AI_EXTRACTED',
        confidence: 97,
        category: 'Metabolic & Chemistry',
      },
      {
        id: 'lab-creat-1',
        testName: 'Creatinine',
        value: '0.95',
        numericValue: 0.95,
        unit: 'mg/dL',
        referenceRange: '0.60 - 1.20',
        status: 'NORMAL',
        statusExplanation: 'Value (0.95) is within the report reference range (0.60–1.20)',
        sourceReportId: 'report-cmp-2026',
        sourceReportName: 'Comprehensive_Metabolic_Panel_02Sep2026.pdf',
        sourceDate: '02 Sep 2026',
        sourcePage: 1,
        sourceExcerpt: 'Creatinine ........ 0.95 mg/dL  (Reference range: 0.60 - 1.20)',
        provenance: 'AI_EXTRACTED',
        confidence: 96,
        category: 'Metabolic & Chemistry',
      },
      {
        id: 'lab-fe-1',
        testName: 'Serum Iron',
        value: '62',
        numericValue: 62,
        unit: 'ug/dL',
        referenceRange: 'Reference range not provided',
        status: 'UNDETERMINED',
        statusExplanation: 'Cannot determine from source',
        sourceReportId: 'report-cmp-2026',
        sourceReportName: 'Comprehensive_Metabolic_Panel_02Sep2026.pdf',
        sourceDate: '02 Sep 2026',
        sourcePage: 1,
        sourceExcerpt: 'Serum Iron ........ 62 ug/dL  (Reference range: Not provided in report)',
        provenance: 'AI_EXTRACTED',
        confidence: 90,
        category: 'Metabolic & Chemistry',
      },
    ],
  },
];

export const INITIAL_SYNTHETIC_CONFLICTS: ConflictItem[] = [
  {
    id: 'conflict-demo-metformin',
    field: 'Medication: Metformin',
    category: 'MEDICATION',
    sourceA: {
      title: 'Patient Intake Questionnaire',
      provenance: 'PATIENT_PROVIDED',
      value: 'Metformin 500 mg — Twice daily with meals',
      date: '04 Sep 2026',
    },
    sourceB: {
      title: 'Report (Comprehensive_Metabolic_Panel_02Sep2026.pdf)',
      provenance: 'AI_EXTRACTED',
      value: 'Current Medications section: None documented',
      date: '02 Sep 2026',
    },
    status: 'UNRESOLVED',
  },
];

export const INITIAL_SYNTHETIC_TIMELINE: TimelineEvent[] = [
  {
    id: 'evt-1',
    timestamp: '04 Sep 2026, 15:30',
    title: 'Extraction Verified by Clinician',
    description: 'Dr. Sarah Jenkins confirmed Hemoglobin (11.2 g/dL) and WBC extractions from CBC report.',
    category: 'HUMAN_VERIFICATION',
    provenance: 'HUMAN_VERIFIED',
    actor: 'Dr. Sarah Jenkins',
    relatedReportId: 'report-cbc-2026',
  },
  {
    id: 'evt-2',
    timestamp: '04 Sep 2026, 14:15',
    title: 'Report Processed & Extracted',
    description: 'CBC_Complete_Blood_Count_04Sep2026.pdf processed. 6 lab results extracted with confidence scores 91–98%.',
    category: 'AI_EXTRACTION',
    provenance: 'AI_EXTRACTED',
    actor: 'MedLens Extraction Engine v2.4',
    relatedReportId: 'report-cbc-2026',
  },
  {
    id: 'evt-3',
    timestamp: '04 Sep 2026, 14:10',
    title: 'Report Uploaded',
    description: 'CBC_Complete_Blood_Count_04Sep2026.pdf uploaded by clinical assistant.',
    category: 'REPORT_UPLOAD',
    provenance: 'PATIENT_PROVIDED',
    actor: 'Clinical Staff',
    relatedReportId: 'report-cbc-2026',
  },
  {
    id: 'evt-4',
    timestamp: '04 Sep 2026, 10:00',
    title: 'Patient Information Intake Recorded',
    description: 'Patient history captured (Essential Hypertension, Penicillin Allergy, Metformin & Lisinopril).',
    category: 'PATIENT_INTAKE',
    provenance: 'PATIENT_PROVIDED',
    actor: 'Eleanor Vance (Patient)',
  },
  {
    id: 'evt-5',
    timestamp: '02 Sep 2026, 09:30',
    title: 'Historical Report Uploaded',
    description: 'Comprehensive_Metabolic_Panel_02Sep2026.pdf added to patient record.',
    category: 'REPORT_UPLOAD',
    provenance: 'AI_EXTRACTED',
    actor: 'System Import',
    relatedReportId: 'report-cmp-2026',
  },
];

export const INITIAL_SYNTHETIC_AI_SUMMARY: AISummary = {
  id: 'sum-demo-1',
  provenance: 'AI_GENERATED',
  generatedAt: '04 Sep 2026, 15:45',
  summaryText: generateResponsibleAISummary(9, 3, 2, 1),
  keyFindings: [
    'CBC report from 04 Sep 2026 contains 3 parameters below reported reference ranges: Hemoglobin (11.2 g/dL vs 12.0–16.0), RBC (3.85 vs 4.20–5.40), and Hematocrit (34.1% vs 37.0–48.0).',
    'Fasting Glucose (94 mg/dL) and Creatinine (0.95 mg/dL) from 02 Sep 2026 are within normal reference ranges.',
    'High-Sensitivity CRP (4.2 mg/L) and Serum Iron (62 ug/dL) were reported without reference ranges in source documents.',
  ],
  omittedOrMissingInfo: [
    'Reference ranges were not provided for High-Sensitivity CRP and Serum Iron in source reports.',
    'Metformin 500mg is listed in patient-provided intake history but missing from the 02 Sep 2026 clinical report medication list.',
  ],
  safetyVerified: true,
  disclaimer: 'MedLens organizes and explains information contained in available records. It cannot diagnose conditions or recommend treatment changes. Please consult a qualified healthcare professional for medical decisions.',
};
