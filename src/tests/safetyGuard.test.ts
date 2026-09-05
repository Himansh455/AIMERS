import { describe, it, expect } from 'vitest';
import { evaluateMedicalSafety, generateResponsibleAISummary, STANDARD_SAFETY_DISCLAIMER } from '../utils/safetyGuard';

describe('Responsible-AI Safety Guard & Summary Generator', () => {
  it('passes safe factual query statements', () => {
    const check = evaluateMedicalSafety('Hemoglobin is 11.2 g/dL');
    expect(check.isSafe).toBe(true);
    expect(check.violations.length).toBe(0);
  });

  it('intercepts definitive diagnosis statements', () => {
    const check = evaluateMedicalSafety('You have anemia and severe iron deficiency');
    expect(check.isSafe).toBe(false);
    expect(check.violations).toContain('Definitive diagnosis phrase detected');
    expect(check.sanitizedText).toContain(STANDARD_SAFETY_DISCLAIMER);
  });

  it('intercepts prescription and dosage recommendation statements', () => {
    const check = evaluateMedicalSafety('You should take 50mg of Iron supplements daily');
    expect(check.isSafe).toBe(false);
    expect(check.violations).toContain('Treatment / dosage recommendation detected');
  });

  it('generates non-diagnostic descriptive patient summaries', () => {
    const summary = generateResponsibleAISummary(9, 3, 2, 1);
    expect(summary).toContain('9 laboratory test results');
    expect(summary).toContain('3 values are outside');
    expect(summary).toContain('Reference ranges were not provided');
    expect(summary).not.toContain('diagnosed');
    expect(summary).not.toContain('prescribe');
  });
});
