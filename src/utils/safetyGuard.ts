export interface SafetyCheckResult {
  isSafe: boolean;
  violations: string[];
  sanitizedText: string;
  disclaimer: string;
}

const DANGEROUS_PATTERNS = [
  { pattern: /\b(you have|diagnosed with|diagnosis is|suffering from)\b/i, reason: 'Definitive diagnosis phrase detected' },
  { pattern: /\b(you should take|prescribe|prescribing|recommend taking|dosage of|increase your dose|decrease your dose|stop taking|start taking)\b/i, reason: 'Treatment / dosage recommendation detected' },
  { pattern: /\b(100% medically accurate|medical certainty|guaranteed cure|definitive proof)\b/i, reason: 'Medical certainty claim detected' },
];

export const STANDARD_SAFETY_DISCLAIMER =
  'MedLens organizes and explains information contained in available records. It cannot diagnose conditions or recommend treatment changes. Please consult a qualified healthcare professional for medical decisions.';

/**
 * Validates generated AI text or user queries against medical safety guardrails.
 * Automatically flags and sanitizes prohibited diagnostic or treatment language.
 */
export function evaluateMedicalSafety(text: string): SafetyCheckResult {
  const violations: string[] = [];

  for (const { pattern, reason } of DANGEROUS_PATTERNS) {
    if (pattern.test(text)) {
      violations.push(reason);
    }
  }

  if (violations.length > 0) {
    return {
      isSafe: false,
      violations,
      sanitizedText: `${STANDARD_SAFETY_DISCLAIMER}\n\n[System Note: Diagnostic or treatment guidance requested was intercepted by MedLens Responsible-AI Safety Layer.]`,
      disclaimer: STANDARD_SAFETY_DISCLAIMER,
    };
  }

  return {
    isSafe: true,
    violations: [],
    sanitizedText: text,
    disclaimer: STANDARD_SAFETY_DISCLAIMER,
  };
}

/**
 * Generates a strictly descriptive, non-diagnostic patient AI summary based on available structured records.
 */
export function generateResponsibleAISummary(
  labCount: number,
  abnormalCount: number,
  missingRangeCount: number,
  conflictCount: number
): string {
  const summaryParts: string[] = [];

  summaryParts.push(
    `The structured medical record contains ${labCount} laboratory test results from uploaded source documents.`
  );

  if (abnormalCount > 0) {
    summaryParts.push(
      `${abnormalCount} ${abnormalCount === 1 ? 'value is' : 'values are'} outside the explicit reference ranges stated on the source reports.`
    );
  } else {
    summaryParts.push(`All test results with stated reference ranges fall within normal boundaries.`);
  }

  if (missingRangeCount > 0) {
    summaryParts.push(
      `Reference ranges were not provided in the source report for ${missingRangeCount} ${missingRangeCount === 1 ? 'test' : 'tests'}, so MedLens preserved these as unclassified.`
    );
  }

  if (conflictCount > 0) {
    summaryParts.push(
      `Attention required: ${conflictCount} potential ${conflictCount === 1 ? 'information conflict exists' : 'information conflicts exist'} between patient-provided history and uploaded clinical reports.`
    );
  }

  return summaryParts.join(' ');
}
