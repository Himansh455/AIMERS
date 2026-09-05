/**
 * @file provenance.test.ts
 * @description Unit tests for the provenance metadata helper functions.
 * Covers all ProvenanceType variants and LabStatus metadata.
 */
import { describe, it, expect } from 'vitest';
import {
  getProvenanceMeta,
  getLabStatusMeta,
} from '../utils/provenance';
import type { ProvenanceType, LabStatus } from '../types/clinical';

describe('Provenance Metadata Helper', () => {
  const allProvenanceTypes: ProvenanceType[] = [
    'PATIENT_PROVIDED',
    'AI_EXTRACTED',
    'AI_GENERATED',
    'HUMAN_VERIFIED',
    'CONFLICTING',
    'MISSING',
  ];

  it('returns metadata for all valid ProvenanceType values', () => {
    for (const type of allProvenanceTypes) {
      const meta = getProvenanceMeta(type);
      expect(meta).toBeDefined();
      expect(meta.type).toBe(type);
      expect(meta.label).toBeTruthy();
      expect(meta.shortLabel).toBeTruthy();
      expect(meta.description).toBeTruthy();
      expect(meta.iconName).toBeTruthy();
      expect(meta.badgeStyle).toBeTruthy();
    }
  });

  it('PATIENT_PROVIDED meta includes meaningful label', () => {
    const meta = getProvenanceMeta('PATIENT_PROVIDED');
    expect(meta.label.toLowerCase()).toMatch(/patient/i);
    expect(meta.iconName).toBe('user');
  });

  it('AI_EXTRACTED meta describes AI extraction', () => {
    const meta = getProvenanceMeta('AI_EXTRACTED');
    expect(meta.label.toLowerCase()).toMatch(/ai|extract/i);
    expect(meta.iconName).toBe('bot');
  });


  it('AI_GENERATED meta clearly describes generated summary provenance', () => {
    const meta = getProvenanceMeta('AI_GENERATED');
    expect(meta.label.toLowerCase()).toContain('ai-generated');
    expect(meta.description).toMatch(/summary|generated/i);
  });

  it('HUMAN_VERIFIED meta includes verification semantics', () => {
    const meta = getProvenanceMeta('HUMAN_VERIFIED');
    expect(meta.label.toLowerCase()).toMatch(/human|verified/i);
    expect(meta.iconName).toBe('check-circle');
  });

  it('CONFLICTING meta signals a conflict state', () => {
    const meta = getProvenanceMeta('CONFLICTING');
    expect(meta.label.toLowerCase()).toMatch(/conflict/i);
    expect(meta.iconName).toBe('alert-triangle');
  });

  it('MISSING meta signals absence of data', () => {
    const meta = getProvenanceMeta('MISSING');
    expect(meta.label.toLowerCase()).toMatch(/missing|undetermined/i);
    expect(meta.iconName).toBe('help-circle');
  });
});

describe('Lab Status Metadata Helper', () => {
  const allStatuses: LabStatus[] = ['LOW', 'NORMAL', 'HIGH', 'UNDETERMINED'];

  it('returns metadata for all LabStatus values', () => {
    for (const status of allStatuses) {
      const meta = getLabStatusMeta(status);
      expect(meta).toBeDefined();
      expect(meta.status).toBe(status);
      expect(meta.label).toBeTruthy();
      expect(meta.badgeStyle).toBeTruthy();
    }
  });

  it('NORMAL status label is NORMAL', () => {
    const meta = getLabStatusMeta('NORMAL');
    expect(meta.label).toBe('NORMAL');
  });

  it('HIGH status has visually distinct badgeStyle from NORMAL', () => {
    const high = getLabStatusMeta('HIGH');
    const normal = getLabStatusMeta('NORMAL');
    expect(high.badgeStyle).not.toBe(normal.badgeStyle);
  });

  it('UNDETERMINED status label does not claim normal or abnormal', () => {
    const meta = getLabStatusMeta('UNDETERMINED');
    expect(meta.label.toLowerCase()).not.toBe('normal');
    expect(meta.label.toLowerCase()).not.toBe('high');
    expect(meta.label.toLowerCase()).not.toBe('low');
    // Ensures no fabricated classification
    expect(meta.description).toContain('reference range');
  });
});
