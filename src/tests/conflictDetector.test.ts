import { describe, it, expect } from 'vitest';
import { detectClinicalConflicts } from '../utils/conflictDetector';
import { INITIAL_SYNTHETIC_PATIENT, INITIAL_SYNTHETIC_REPORTS } from '../data/syntheticPatient';

describe('Clinical Conflict Detection Engine', () => {
  it('surfaces conflicts when patient medication intake differs from report document', () => {
    const conflicts = detectClinicalConflicts(INITIAL_SYNTHETIC_PATIENT, INITIAL_SYNTHETIC_REPORTS);
    expect(conflicts.length).toBeGreaterThan(0);
    expect(conflicts[0].category).toBe('MEDICATION');
    expect(conflicts[0].status).toBe('UNRESOLVED');
  });

  it('surfaces allergy vs prescription conflicts if amoxicillin is mentioned in report', () => {
    const patientWithPenicillinAllergy = {
      ...INITIAL_SYNTHETIC_PATIENT,
      allergies: [
        {
          id: 'alg-pen',
          allergen: 'Penicillin',
          reaction: 'Anaphylaxis',
          severity: 'SEVERE' as const,
          source: 'PATIENT_PROVIDED' as const,
          sourceDetail: 'Intake form',
        },
      ],
    };

    const reportWithAmoxicillin = [
      {
        ...INITIAL_SYNTHETIC_REPORTS[0],
        rawText: 'Prescription history: Amoxicillin 500mg ordered',
      },
    ];

    const conflicts = detectClinicalConflicts(patientWithPenicillinAllergy, reportWithAmoxicillin);
    const allergyConflict = conflicts.find((c) => c.category === 'ALLERGY');
    expect(allergyConflict).toBeDefined();
  });
});
