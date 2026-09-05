import type { ProvenanceType, LabStatus } from '../types/clinical';

export interface ProvenanceMeta {
  type: ProvenanceType;
  label: string;
  shortLabel: string;
  description: string;
  iconName: 'user' | 'bot' | 'check-circle' | 'alert-triangle' | 'help-circle';
  badgeStyle: string;
}

export function getProvenanceMeta(provenance: ProvenanceType): ProvenanceMeta {
  switch (provenance) {
    case 'PATIENT_PROVIDED':
      return {
        type: 'PATIENT_PROVIDED',
        label: 'Patient-provided',
        shortLabel: 'Patient',
        description: 'Information entered directly by patient or caregiver during intake history',
        iconName: 'user',
        badgeStyle: 'bg-[#F2ECE4] text-[#2B1E2F] border-[#D9CEC1]',
      };
    case 'AI_EXTRACTED':
      return {
        type: 'AI_EXTRACTED',
        label: 'AI-extracted',
        shortLabel: 'AI Extracted',
        description: 'Information extracted by natural language OCR model from uploaded source report',
        iconName: 'bot',
        badgeStyle: 'bg-[#F6ECE8] text-[#7A4036] border-[#E7C7BF]',
      };
    case 'AI_GENERATED':
      return {
        type: 'AI_GENERATED',
        label: 'AI-generated',
        shortLabel: 'AI Generated',
        description: 'Patient-friendly summary generated from the structured record; not a medical diagnosis or treatment recommendation',
        iconName: 'bot',
        badgeStyle: 'bg-[#F2ECE4] text-[#6B4A5A] border-[#D9CEC1]',
      };
    case 'HUMAN_VERIFIED':
      return {
        type: 'HUMAN_VERIFIED',
        label: 'Human-verified',
        shortLabel: 'Verified',
        description: 'Extracted data reviewed and confirmed by healthcare staff or user',
        iconName: 'check-circle',
        badgeStyle: 'bg-[#EBF3ED] text-[#4F7359] border-[#C3D9C9]',
      };
    case 'CONFLICTING':
      return {
        type: 'CONFLICTING',
        label: 'Conflicting source',
        shortLabel: 'Conflict',
        description: 'Discrepancy detected between patient history and uploaded report',
        iconName: 'alert-triangle',
        badgeStyle: 'bg-[#FDF3E7] text-[#C08A3E] border-[#F4D9B4]',
      };
    case 'MISSING':
    default:
      return {
        type: 'MISSING',
        label: 'Missing / Undetermined',
        shortLabel: 'Undetermined',
        description: 'Information missing or omitted from source documentation',
        iconName: 'help-circle',
        badgeStyle: 'bg-[#F7F4EE] text-[#6F6870] border-[#E0D8CC]',
      };
  }
}

export interface StatusMeta {
  status: LabStatus;
  label: string;
  description: string;
  iconName: 'arrow-down' | 'check' | 'arrow-up' | 'help-circle';
  badgeStyle: string;
}

export function getLabStatusMeta(status: LabStatus): StatusMeta {
  switch (status) {
    case 'LOW':
      return {
        status: 'LOW',
        label: 'LOW',
        description: 'Value is below the source report reference range',
        iconName: 'arrow-down',
        badgeStyle: 'bg-[#FDF1F0] text-[#A54E43] border-[#F2C7C2] font-semibold',
      };
    case 'HIGH':
      return {
        status: 'HIGH',
        label: 'HIGH',
        description: 'Value is above the source report reference range',
        iconName: 'arrow-up',
        badgeStyle: 'bg-[#FDF1F0] text-[#A54E43] border-[#F2C7C2] font-semibold',
      };
    case 'NORMAL':
      return {
        status: 'NORMAL',
        label: 'NORMAL',
        description: 'Value is within source report reference range',
        iconName: 'check',
        badgeStyle: 'bg-[#EBF3ED] text-[#4F7359] border-[#C3D9C9]',
      };
    case 'UNDETERMINED':
    default:
      return {
        status: 'UNDETERMINED',
        label: 'Cannot determine from source',
        description: 'Source report did not provide a reference range; status unclassified',
        iconName: 'help-circle',
        badgeStyle: 'bg-[#F4F1EA] text-[#6F6870] border-[#D9D2C7]',
      };
  }
}
