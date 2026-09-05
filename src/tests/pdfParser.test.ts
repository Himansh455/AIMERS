import { describe, it, expect } from 'vitest';
import { validateReportFile, parseReportTextToStructuredData } from '../utils/pdfParser';

describe('Report Document Parser & File Validator', () => {
  it('validates file size limit (rejects files over 10MB)', () => {
    const hugeFile = new File(['a'.repeat(11 * 1024 * 1024)], 'huge_report.pdf', { type: 'application/pdf' });
    const validation = validateReportFile(hugeFile);
    expect(validation.isValid).toBe(false);
    expect(validation.errorMessage).toContain('exceeds maximum limit');
  });

  it('validates supported file types (rejects executable files)', () => {
    const exeFile = new File(['binary content'], 'malicious.exe', { type: 'application/x-msdownload' });
    const validation = validateReportFile(exeFile);
    expect(validation.isValid).toBe(false);
    expect(validation.errorMessage).toContain('Unsupported file type');
  });

  it('accepts valid PDF documents under 10MB', () => {
    const validFile = new File(['PDF content'], 'cbc_report.pdf', { type: 'application/pdf' });
    const validation = validateReportFile(validFile);
    expect(validation.isValid).toBe(true);
  });

  it('parses structured pipe-delimited text into LabResult objects with provenance', () => {
    const rawText = `Hemoglobin | 11.2 | g/dL | 12.0 - 16.0`;
    const results = parseReportTextToStructuredData('test-rep-1', 'cbc.pdf', '04 Sep 2026', rawText);

    expect(results.length).toBe(1);
    expect(results[0].testName).toBe('Hemoglobin');
    expect(results[0].value).toBe('11.2');
    expect(results[0].unit).toBe('g/dL');
    expect(results[0].status).toBe('LOW');
    expect(results[0].provenance).toBe('AI_EXTRACTED');
  });
});
