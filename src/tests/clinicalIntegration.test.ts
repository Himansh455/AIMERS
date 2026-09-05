/**
 * @file clinicalIntegration.test.ts
 * @description Integration-level tests covering the full data pipeline:
 * conflict detection → provenance assignment → safety guard summary generation.
 * Ensures the MedLens problem statement requirements are covered end-to-end.
 */
import { describe, it, expect } from 'vitest';
import { detectClinicalConflicts } from '../utils/conflictDetector';
import { generateResponsibleAISummary, evaluateMedicalSafety } from '../utils/safetyGuard';
import { classifyLabResult } from '../utils/referenceRange';
import { INITIAL_SYNTHETIC_PATIENT, INITIAL_SYNTHETIC_REPORTS } from '../data/syntheticPatient';

describe('End-to-End: Conflict Detector → Provenance Assignment', () => {
  it('detected conflicts always have UNRESOLVED status initially', () => {
    const conflicts = detectClinicalConflicts(INITIAL_SYNTHETIC_PATIENT, INITIAL_SYNTHETIC_REPORTS);
    const allUnresolved = conflicts.every((c) => c.status === 'UNRESOLVED');
    expect(allUnresolved).toBe(true);
  });

  it('detected conflicts always carry a known provenance on both source sides', () => {
    const validProvenances = ['PATIENT_PROVIDED', 'AI_EXTRACTED', 'HUMAN_VERIFIED', 'CONFLICTING', 'MISSING'];
    const conflicts = detectClinicalConflicts(INITIAL_SYNTHETIC_PATIENT, INITIAL_SYNTHETIC_REPORTS);
    for (const conflict of conflicts) {
      expect(validProvenances).toContain(conflict.sourceA.provenance);
      expect(validProvenances).toContain(conflict.sourceB.provenance);
    }
  });

  it('all conflicts have a non-empty field description', () => {
    const conflicts = detectClinicalConflicts(INITIAL_SYNTHETIC_PATIENT, INITIAL_SYNTHETIC_REPORTS);
    for (const conflict of conflicts) {
      expect(conflict.field).toBeTruthy();
      expect(conflict.category).toMatch(/^(MEDICATION|ALLERGY|CONDITION|LAB_RESULT)$/);
    }
  });

  it('patient with no medications produces no medication conflict', () => {
    // Use a non-demo MRN so the synthetic fallback in conflictDetector does not trigger
    const patientNoMeds = { ...INITIAL_SYNTHETIC_PATIENT, mrn: 'MRN-TESTONLY-99', medications: [] };
    const reportWithNoMedText = [
      { ...INITIAL_SYNTHETIC_REPORTS[0], rawText: 'Laboratory values: Hemoglobin 11.2' },
    ];
    const conflicts = detectClinicalConflicts(patientNoMeds, reportWithNoMedText);
    const medConflicts = conflicts.filter((c) => c.category === 'MEDICATION');
    expect(medConflicts.length).toBe(0);
  });

});

describe('End-to-End: Reference Classifier → AI Summary (No Invented Diagnoses)', () => {
  it('all synthetic report lab results have status classified by source range only', () => {
    for (const report of INITIAL_SYNTHETIC_REPORTS) {
      for (const lab of report.extractedResults) {
        if (!lab.referenceRange || lab.referenceRange.trim() === '') {
          // Must be UNDETERMINED — never LOW/HIGH without source range
          expect(lab.status).toBe('UNDETERMINED');
        }
        const allowedStatuses = ['LOW', 'NORMAL', 'HIGH', 'UNDETERMINED'];
        expect(allowedStatuses).toContain(lab.status);
      }
    }
  });

  it('generates AI summary that counts only records with source reference ranges', () => {
    const summary = generateResponsibleAISummary(9, 3, 2, 0);
    expect(summary).toContain('9 laboratory test results');
    expect(summary).toContain('3');
    expect(summary).toContain('2');
    // Ensure it does not contain diagnostic conclusions
    expect(summary).not.toMatch(/diagnos/i);
    expect(summary).not.toMatch(/treatment/i);
  });

  it('AI summary for 0 abnormal results correctly states all values are normal', () => {
    const summary = generateResponsibleAISummary(5, 0, 0, 0);
    expect(summary).toContain('All test results');
    expect(summary).toContain('normal');
  });

  it('AI summary with conflict count > 0 mentions attention required', () => {
    const summary = generateResponsibleAISummary(9, 2, 1, 2);
    expect(summary).toMatch(/attention|conflict/i);
  });
});

describe('Safety Guard: Boundary and Edge Cases', () => {
  it('does not intercept neutral clinical record descriptions', () => {
    const neutralQueries = [
      'Hemoglobin result is 11.2 g/dL',
      'Fasting glucose recorded at 94 mg/dL',
      'Patient has listed Metformin 500mg in their intake history',
      'Reference range is 12.0-16.0',
    ];
    for (const q of neutralQueries) {
      expect(evaluateMedicalSafety(q).isSafe).toBe(true);
    }
  });

  it('intercepts all major prohibited patterns', () => {
    const dangerousQueries = [
      'You have anemia',
      'diagnosed with iron deficiency',
      'diagnosis is diabetes',
      'you should take iron supplements',
      'prescribe 50mg daily',
      'stop taking metformin',
    ];
    for (const q of dangerousQueries) {
      const result = evaluateMedicalSafety(q);
      expect(result.isSafe).toBe(false);
      expect(result.violations.length).toBeGreaterThan(0);
    }
  });

  it('sanitized text always includes the standard safety disclaimer', () => {
    const check = evaluateMedicalSafety('You have type 2 diabetes');
    expect(check.isSafe).toBe(false);
    expect(check.sanitizedText).toContain('consult a qualified healthcare professional');
  });

  it('classifyLabResult returns UNDETERMINED for empty string reference range', () => {
    const result = classifyLabResult('11.2', '');
    expect(result.status).toBe('UNDETERMINED');
    expect(result.statusExplanation).toBe('Cannot determine from source');
  });

  it('classifyLabResult returns UNDETERMINED for null reference range', () => {
    const result = classifyLabResult('11.2', null);
    expect(result.status).toBe('UNDETERMINED');
  });

  it('classifyLabResult handles complex reference range text gracefully', () => {
    // Complex formats that can't be parsed should fallback to UNDETERMINED
    const result = classifyLabResult('11.2', 'See clinical interpretation table');
    expect(result.status).toBe('UNDETERMINED');
    expect(result.sourceRangePreserved).toBe('See clinical interpretation table');
  });
});
