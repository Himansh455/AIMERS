import { describe, it, expect } from 'vitest';
import { classifyLabResult, parseNumericValue } from '../utils/referenceRange';

describe('Strict Reference Range Rule Classifier', () => {
  it('CRITICAL TEST 1: missing reference range returns UNDETERMINED and "Cannot determine from source"', () => {
    const result = classifyLabResult('11.2 g/dL', undefined);
    expect(result.status).toBe('UNDETERMINED');
    expect(result.statusExplanation).toBe('Cannot determine from source');
    expect(result.sourceRangePreserved).toBe('Reference range not provided');
  });

  it('CRITICAL TEST 2: value below reference range returns LOW', () => {
    const result = classifyLabResult('11.2', '12.0 - 16.0');
    expect(result.status).toBe('LOW');
    expect(result.statusExplanation).toContain('below the report reference range');
  });

  it('CRITICAL TEST 3: value within reference range returns NORMAL', () => {
    const result = classifyLabResult('13.0', '12.0 - 16.0');
    expect(result.status).toBe('NORMAL');
    expect(result.statusExplanation).toContain('within the report reference range');
  });

  it('CRITICAL TEST 4: value above reference range returns HIGH', () => {
    const result = classifyLabResult('17.0', '12.0 - 16.0');
    expect(result.status).toBe('HIGH');
    expect(result.statusExplanation).toContain('above the report reference range');
  });

  it('handles explicit "Not provided in report" string', () => {
    const result = classifyLabResult('4.2 mg/L', 'Not provided in report');
    expect(result.status).toBe('UNDETERMINED');
    expect(result.statusExplanation).toBe('Cannot determine from source');
  });

  it('handles upper-limit reference ranges (< 100)', () => {
    const normalResult = classifyLabResult('94', '< 100');
    expect(normalResult.status).toBe('NORMAL');

    const highResult = classifyLabResult('124', '< 100');
    expect(highResult.status).toBe('HIGH');
  });

  it('handles lower-limit reference ranges (> 50)', () => {
    const normalResult = classifyLabResult('58', '> 50');
    expect(normalResult.status).toBe('NORMAL');

    const lowResult = classifyLabResult('42', '> 50');
    expect(lowResult.status).toBe('LOW');
  });

  it('parses numeric values accurately from string tokens', () => {
    expect(parseNumericValue('11.2 g/dL')).toBe(11.2);
    expect(parseNumericValue('240')).toBe(240);
    expect(parseNumericValue('150,000')).toBe(150000);
    expect(parseNumericValue('Non-numeric')).toBeNull();
  });
});
