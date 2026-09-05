export type ProvenanceType = 
  | 'PATIENT_PROVIDED'
  | 'AI_EXTRACTED'
  | 'AI_GENERATED'
  | 'HUMAN_VERIFIED'
  | 'CONFLICTING'
  | 'MISSING';

export type LabStatus = 'LOW' | 'NORMAL' | 'HIGH' | 'UNDETERMINED';

export interface VerificationRecord {
  verifiedBy: string;
  verifiedAt: string;
  previousValue?: string;
  previousUnit?: string;
  previousRange?: string;
  notes?: string;
}

export interface LabResult {
  id: string;
  testName: string;
  value: string;
  numericValue?: number;
  unit: string;
  referenceRange?: string;
  status: LabStatus;
  statusExplanation: string;
  sourceReportId: string;
  sourceReportName: string;
  sourceDate: string;
  sourcePage?: number;
  sourceExcerpt?: string;
  provenance: ProvenanceType;
  confidence?: number; // Extraction confidence percentage
  verificationRecord?: VerificationRecord;
  category?: string;
}

export interface PatientMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  source: ProvenanceType;
  sourceDetail: string;
  startDate?: string;
  notes?: string;
}

export interface PatientCondition {
  id: string;
  name: string;
  diagnosedDate?: string;
  status: 'ACTIVE' | 'RESOLVED' | 'UNDER_INVESTIGATION';
  source: ProvenanceType;
  sourceDetail: string;
}

export interface PatientAllergy {
  id: string;
  allergen: string;
  reaction: string;
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'UNKNOWN';
  source: ProvenanceType;
  sourceDetail: string;
}

export interface PatientSymptom {
  id: string;
  description: string;
  onsetDate?: string;
  severity: 'MILD' | 'MODERATE' | 'SEVERE';
  notes?: string;
}

export interface PatientProfile {
  id: string;
  name: string;
  mrn: string; // Medical Record Number
  age: number;
  sex: 'Female' | 'Male' | 'Other';
  dob: string;
  symptoms: PatientSymptom[];
  conditions: PatientCondition[];
  allergies: PatientAllergy[];
  medications: PatientMedication[];
  notes?: string;
  updatedAt: string;
}

export interface MedicalReport {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  reportDate: string;
  facility: string;
  author: string;
  reportType: 'CBC' | 'METABOLIC' | 'LIPID' | 'GENERAL' | 'PRESCRIPTION_HISTORY';
  rawText: string;
  extractedResults: LabResult[];
  extractedMedications?: PatientMedication[];
  status: 'PROCESSED' | 'PENDING' | 'FAILED';
  verificationCount: number;
}

export interface ConflictItem {
  id: string;
  field: string; // e.g. "Medication: Metformin"
  category: 'MEDICATION' | 'ALLERGY' | 'CONDITION' | 'LAB_RESULT';
  sourceA: {
    title: string;
    provenance: ProvenanceType;
    value: string;
    date?: string;
  };
  sourceB: {
    title: string;
    provenance: ProvenanceType;
    value: string;
    date?: string;
  };
  status: 'UNRESOLVED' | 'RESOLVED_SOURCE_A' | 'RESOLVED_SOURCE_B' | 'RESOLVED_CUSTOM';
  resolutionDetails?: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  category: 'PATIENT_INTAKE' | 'REPORT_UPLOAD' | 'AI_EXTRACTION' | 'HUMAN_VERIFICATION' | 'CONFLICT_RESOLVED';
  provenance: ProvenanceType;
  actor: string;
  relatedReportId?: string;
}

export interface AISummary {
  id: string;
  provenance: 'AI_GENERATED';
  generatedAt: string;
  summaryText: string;
  keyFindings: string[];
  omittedOrMissingInfo: string[];
  safetyVerified: boolean;
  disclaimer: string;
}
