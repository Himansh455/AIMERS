import { useState, useCallback, useMemo } from 'react';
import type {
  PatientProfile,
  MedicalReport,
  LabResult,
  ConflictItem,
  TimelineEvent,
  AISummary,
  ProvenanceType,
  LabStatus,
  PatientMedication,
  PatientAllergy,
  PatientCondition,
} from '../types/clinical';
import {
  INITIAL_SYNTHETIC_PATIENT,
  INITIAL_SYNTHETIC_REPORTS,
  INITIAL_SYNTHETIC_CONFLICTS,
  INITIAL_SYNTHETIC_TIMELINE,
  INITIAL_SYNTHETIC_AI_SUMMARY,
} from '../data/syntheticPatient';
import { generateResponsibleAISummary } from '../utils/safetyGuard';
import { classifyLabResult } from '../utils/referenceRange';

export type ActiveTab = 'overview' | 'patient' | 'reports' | 'labs' | 'timeline' | 'conflicts' | 'summary';

export function useClinicalStore() {
  const [patient, setPatient] = useState<PatientProfile>(INITIAL_SYNTHETIC_PATIENT);
  const [reports, setReports] = useState<MedicalReport[]>(INITIAL_SYNTHETIC_REPORTS);
  const [conflicts, setConflicts] = useState<ConflictItem[]>(INITIAL_SYNTHETIC_CONFLICTS);
  const [timeline, setTimeline] = useState<TimelineEvent[]>(INITIAL_SYNTHETIC_TIMELINE);
  const [aiSummary, setAiSummary] = useState<AISummary>(INITIAL_SYNTHETIC_AI_SUMMARY);

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [selectedLabResultForSource, setSelectedLabResultForSource] = useState<LabResult | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<LabStatus | 'ALL'>('ALL');
  const [filterProvenance, setFilterProvenance] = useState<ProvenanceType | 'ALL'>('ALL');

  // Keep derived clinical collections stable between renders. This avoids
  // rebuilding the entire lab index when unrelated UI state changes.
  const allLabResults = useMemo<LabResult[]>(
    () => reports.flatMap((report) => report.extractedResults),
    [reports]
  );

  const filteredLabResults = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return allLabResults.filter((lab) => {
      const matchesSearch = !normalizedQuery ||
        lab.testName.toLowerCase().includes(normalizedQuery) ||
        lab.sourceReportName.toLowerCase().includes(normalizedQuery) ||
        Boolean(lab.category?.toLowerCase().includes(normalizedQuery));

      const matchesStatus = filterStatus === 'ALL' || lab.status === filterStatus;
      const matchesProvenance = filterProvenance === 'ALL' || lab.provenance === filterProvenance;

      return matchesSearch && matchesStatus && matchesProvenance;
    });
  }, [allLabResults, searchQuery, filterStatus, filterProvenance]);

  const updatePatientInfo = useCallback((updated: Partial<PatientProfile>) => {
    setPatient((prev) => {
      const next = { ...prev, ...updated, updatedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) };
      return next;
    });

    setTimeline((prev) => [
      {
        id: `evt-${Date.now()}`,
        timestamp: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        title: 'Patient Intake Information Updated',
        description: 'Patient history profile updated by user/clinician.',
        category: 'PATIENT_INTAKE',
        provenance: 'PATIENT_PROVIDED',
        actor: 'User / Clinician',
      },
      ...prev,
    ]);
  }, []);

  const addPatientMedication = useCallback((med: Omit<PatientMedication, 'id'>) => {
    const newMed: PatientMedication = {
      ...med,
      id: `med-${Date.now()}`,
    };
    setPatient((prev) => ({
      ...prev,
      medications: [...prev.medications, newMed],
    }));
  }, []);

  const addPatientAllergy = useCallback((allergy: Omit<PatientAllergy, 'id'>) => {
    const newAllergy: PatientAllergy = {
      ...allergy,
      id: `alg-${Date.now()}`,
    };
    setPatient((prev) => ({
      ...prev,
      allergies: [...prev.allergies, newAllergy],
    }));
  }, []);

  const addPatientCondition = useCallback((cond: Omit<PatientCondition, 'id'>) => {
    const newCond: PatientCondition = {
      ...cond,
      id: `cond-${Date.now()}`,
    };
    setPatient((prev) => ({
      ...prev,
      conditions: [...prev.conditions, newCond],
    }));
  }, []);

  const addReport = useCallback((newReport: MedicalReport) => {
    setReports((prev) => [newReport, ...prev]);

    setTimeline((prev) => [
      {
        id: `evt-${Date.now()}`,
        timestamp: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        title: `Report Uploaded: ${newReport.fileName}`,
        description: `${newReport.extractedResults.length} laboratory test results extracted automatically.`,
        category: 'REPORT_UPLOAD',
        provenance: 'AI_EXTRACTED',
        actor: 'MedLens Upload Workflow',
        relatedReportId: newReport.id,
      },
      ...prev,
    ]);
  }, []);

  const verifyLabResult = useCallback((resultId: string, updatedFields?: Partial<LabResult>) => {
    setReports((prevReports) =>
      prevReports.map((report) => ({
        ...report,
        extractedResults: report.extractedResults.map((lab) => {
          if (lab.id === resultId) {
            const nextValue = updatedFields?.value ?? lab.value;
            const nextRange = updatedFields?.referenceRange ?? lab.referenceRange;
            const { status, statusExplanation } = classifyLabResult(nextValue, nextRange);

            return {
              ...lab,
              ...updatedFields,
              value: nextValue,
              referenceRange: nextRange,
              status,
              statusExplanation,
              provenance: 'HUMAN_VERIFIED',
              verificationRecord: {
                verifiedBy: 'Healthcare Staff (User)',
                verifiedAt: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                previousValue: lab.value !== nextValue ? lab.value : undefined,
              },
            };
          }
          return lab;
        }),
      }))
    );

    setTimeline((prev) => [
      {
        id: `evt-${Date.now()}`,
        timestamp: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        title: `Extraction Human Verified`,
        description: `Lab result verified and confirmed into structured record.`,
        category: 'HUMAN_VERIFICATION',
        provenance: 'HUMAN_VERIFIED',
        actor: 'Healthcare Staff (User)',
      },
      ...prev,
    ]);
  }, []);

  const resolveConflict = useCallback((conflictId: string, resolution: 'RESOLVED_SOURCE_A' | 'RESOLVED_SOURCE_B') => {
    setConflicts((prev) =>
      prev.map((c) => (c.id === conflictId ? { ...c, status: resolution } : c))
    );

    setTimeline((prev) => [
      {
        id: `evt-${Date.now()}`,
        timestamp: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        title: `Conflict Resolved by Clinician`,
        description: `Information inconsistency resolved in favor of ${resolution === 'RESOLVED_SOURCE_A' ? 'Source A' : 'Source B'}.`,
        category: 'CONFLICT_RESOLVED',
        provenance: 'HUMAN_VERIFIED',
        actor: 'Healthcare Staff (User)',
      },
      ...prev,
    ]);
  }, []);

  const refreshAISummary = useCallback(() => {
    const totalLabs = allLabResults.length;
    const abnormalLabs = allLabResults.filter((l) => l.status === 'LOW' || l.status === 'HIGH').length;
    const missingRanges = allLabResults.filter((l) => l.status === 'UNDETERMINED').length;
    const unresolvedConflicts = conflicts.filter((c) => c.status === 'UNRESOLVED').length;

    setAiSummary({
      id: `sum-${Date.now()}`,
      provenance: 'AI_GENERATED',
      generatedAt: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      summaryText: generateResponsibleAISummary(totalLabs, abnormalLabs, missingRanges, unresolvedConflicts),
      keyFindings: [
        `${totalLabs} total laboratory tests indexed across ${reports.length} uploaded source document(s).`,
        abnormalLabs > 0
          ? `${abnormalLabs} test result(s) are outside stated reference ranges on source reports.`
          : 'All lab results with stated reference ranges fall within normal limits.',
        missingRanges > 0
          ? `${missingRanges} test result(s) omit reference ranges on source reports and are preserved as unclassified.`
          : 'All extracted lab results contained explicit reference ranges.',
      ],
      omittedOrMissingInfo: [
        missingRanges > 0
          ? `Reference ranges were not provided for ${missingRanges} test(s) in source documentation.`
          : 'No missing reference ranges detected.',
      ],
      safetyVerified: true,
      disclaimer: 'MedLens organizes and explains information contained in available records. It cannot diagnose conditions or recommend treatment changes. Please consult a qualified healthcare professional for medical decisions.',
    });
  }, [allLabResults, reports.length, conflicts]);

  return {
    patient,
    reports,
    conflicts,
    timeline,
    aiSummary,
    activeTab,
    setActiveTab,
    selectedLabResultForSource,
    setSelectedLabResultForSource,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterProvenance,
    setFilterProvenance,
    allLabResults,
    filteredLabResults,
    updatePatientInfo,
    addPatientMedication,
    addPatientAllergy,
    addPatientCondition,
    addReport,
    verifyLabResult,
    resolveConflict,
    refreshAISummary,
  };
}
