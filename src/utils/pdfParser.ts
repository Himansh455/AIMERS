import type { LabResult, MedicalReport } from '../types/clinical';
import { classifyLabResult } from './referenceRange';

export interface FileValidationError {
  isValid: boolean;
  errorMessage?: string;
}

export function validateReportFile(file: File): FileValidationError {
  const MAX_SIZE_BYTES = 10 * 1024 * 1024;
  const ALLOWED_TYPES = ['application/pdf', 'text/plain', 'image/png', 'image/jpeg', 'image/jpg'];
  const ALLOWED_EXTENSIONS = ['.pdf', '.txt', '.png', '.jpg', '.jpeg'];

  const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

  if (file.size > MAX_SIZE_BYTES) {
    return {
      isValid: false,
      errorMessage: `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds maximum limit of 10MB.`,
    };
  }

  if (!ALLOWED_TYPES.includes(file.type) && !ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      isValid: false,
      errorMessage: `Unsupported file type "${extension}". Please upload a PDF, TXT, PNG, or JPG document.`,
    };
  }

  return { isValid: true };
}

export function parseReportTextToStructuredData(
  reportId: string,
  reportName: string,
  reportDate: string,
  rawText: string
): LabResult[] {
  const lines = rawText.split('\n');
  const results: LabResult[] = [];

  let currentCategory = 'General Chemistry';

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('//')) return;

    if (trimmed.toLowerCase().includes('complete blood count') || trimmed.toLowerCase().includes('hematology')) {
      currentCategory = 'Hematology';
      return;
    }
    if (trimmed.toLowerCase().includes('metabolic panel') || trimmed.toLowerCase().includes('chemistry')) {
      currentCategory = 'Metabolic & Chemistry';
      return;
    }
    if (trimmed.toLowerCase().includes('lipid panel')) {
      currentCategory = 'Lipid Profile';
      return;
    }

    const pipeParts = trimmed.split('|').map((p) => p.trim());
    if (pipeParts.length >= 3) {
      const testName = pipeParts[0];
      const valStr = pipeParts[1];
      const unitStr = pipeParts[2];
      const rangeStr = pipeParts[3] || undefined;

      const { status, statusExplanation, sourceRangePreserved } = classifyLabResult(valStr, rangeStr);

      results.push({
        id: `extracted-${reportId}-${index}`,
        testName,
        value: valStr,
        unit: unitStr,
        referenceRange: rangeStr ? sourceRangePreserved : undefined,
        status,
        statusExplanation,
        sourceReportId: reportId,
        sourceReportName: reportName,
        sourceDate: reportDate,
        sourcePage: 1,
        sourceExcerpt: trimmed,
        provenance: 'AI_EXTRACTED',
        // Demo extraction confidence is deterministic so repeated parsing is
        // reproducible and tests/UI comparisons do not change randomly.
        confidence: 96,
        category: currentCategory,
      });
    }
  });

  return results;
}

export function getSampleReportData(file: File): { rawText: string; results: LabResult[]; reportType: MedicalReport['reportType'] } {
  const fileName = file.name.toLowerCase();
  
  if (fileName.includes('cbc') || fileName.includes('blood')) {
    const rawText = `METROPOLITAN CLINICAL LABORATORY
Report Date: 04 Sep 2026
Patient: Vance, Eleanor (68F)

COMPLETE BLOOD COUNT (CBC) WITH DIFFERENTIAL
Test Name | Result | Units | Reference Range
Hemoglobin | 11.2 | g/dL | 12.0 - 16.0
White Blood Cell (WBC) | 6.8 | 10^3/uL | 4.5 - 11.0
Platelets | 240 | 10^3/uL | 150 - 450
Red Blood Cell (RBC) | 3.85 | 10^6/uL | 4.20 - 5.40
Hematocrit | 34.1 | % | 37.0 - 48.0
Mean Corpuscular Volume (MCV) | 88.5 | fL | 80.0 - 100.0
High-Sensitivity CRP | 4.2 | mg/L | Not provided in report`;

    const results = parseReportTextToStructuredData('report-cbc-demo', file.name, '04 Sep 2026', rawText);
    return { rawText, results, reportType: 'CBC' };
  }

  if (fileName.includes('lipid') || fileName.includes('cholesterol')) {
    const rawText = `METROPOLITAN CLINICAL LABORATORY
Report Date: 01 Aug 2026
Patient: Vance, Eleanor (68F)

LIPID PANEL
Test Name | Result | Units | Reference Range
Total Cholesterol | 215 | mg/dL | < 200
Triglycerides | 165 | mg/dL | < 150
HDL Cholesterol | 58 | mg/dL | > 50
LDL Cholesterol | 124 | mg/dL | < 100
ApoB Level | 92 | mg/dL | Not provided in report`;

    const results = parseReportTextToStructuredData('report-lipid-demo', file.name, '01 Aug 2026', rawText);
    return { rawText, results, reportType: 'LIPID' };
  }

  const rawText = `METROPOLITAN CLINICAL LABORATORY
Report Date: 04 Sep 2026
Patient: Vance, Eleanor (68F)

METABOLIC PANEL
Test Name | Result | Units | Reference Range
Glucose (Fasting) | 94 | mg/dL | 70 - 99
Blood Urea Nitrogen (BUN) | 18 | mg/dL | 7 - 20
Creatinine | 0.95 | mg/dL | 0.60 - 1.20
Sodium | 141 | mmol/L | 135 - 145
Potassium | 4.2 | mmol/L | 3.5 - 5.0
Vitamin D (25-OH) | 22.0 | ng/mL | 30.0 - 100.0
Serum Iron | 62 | ug/dL | Not provided in report`;

  const results = parseReportTextToStructuredData('report-gen-demo', file.name, '04 Sep 2026', rawText);
  return { rawText, results, reportType: 'METABOLIC' };
}
