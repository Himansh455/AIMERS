import React from 'react';
import type { PatientProfile, MedicalReport, LabResult, ConflictItem, AISummary } from '../../types/clinical';
import type { ActiveTab } from '../../hooks/useClinicalStore';
import { StatusBadge } from '../common/StatusBadge';
import { ProvenanceBadge } from '../common/ProvenanceBadge';
import {
  FileText,
  TestTube,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  User,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

interface OverviewViewProps {
  patient: PatientProfile;
  reports: MedicalReport[];
  labs: LabResult[];
  conflicts: ConflictItem[];
  aiSummary: AISummary;
  setActiveTab: (tab: ActiveTab) => void;
  onInspectLab: (lab: LabResult) => void;
  onOpenUpload: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  patient,
  reports,
  labs,
  conflicts,
  aiSummary,
  setActiveTab,
  onInspectLab,
  onOpenUpload,
}) => {
  const verifiedCount = labs.filter((l) => l.provenance === 'HUMAN_VERIFIED').length;
  const abnormalCount = labs.filter((l) => l.status === 'LOW' || l.status === 'HIGH').length;
  const undeterminedCount = labs.filter((l) => l.status === 'UNDETERMINED').length;
  const unresolvedConflicts = conflicts.filter((c) => c.status === 'UNRESOLVED');

  const verificationPercentage = labs.length > 0 ? Math.round((verifiedCount / labs.length) * 100) : 0;

  return (
    <div className="space-y-8 text-[#242126]">
      <div className="bg-[#2B1E2F] text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-[#3E2D44] rounded-full blur-3xl opacity-50 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#3E2D44] text-[#D9CEC1] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-[#523B59]">
              <User className="w-3.5 h-3.5 text-[#C08A3E]" /> Patient Record Workspace
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-[#F7F4EE]">
              {patient.name} <span className="text-xl font-normal text-[#D9CEC1]">({patient.mrn})</span>
            </h2>
            <p className="text-sm text-[#D9CEC1] max-w-2xl leading-relaxed">
              {patient.age} year old {patient.sex} • Primary Symptoms: {patient.symptoms.map((s) => s.description).join(', ')}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenUpload}
              className="bg-[#C76D5B] hover:bg-[#B35C4B] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#C76D5B]"
            >
              <FileText className="w-4 h-4" /> Upload New Report
            </button>
            <button
              onClick={() => setActiveTab('labs')}
              className="bg-[#3E2D44] hover:bg-[#523B59] text-white border border-[#523B59] px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <span>View All Labs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab('reports')}
          className="bg-[#FCFAF6] border border-[#E0D8CC] p-5 rounded-2xl hover:border-[#2B1E2F] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#6F6870] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Source Reports</span>
            <FileText className="w-4 h-4 text-[#2B1E2F] group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-bold font-mono text-[#2B1E2F]">{reports.length}</div>
          <div className="text-xs text-[#6F6870] mt-1">Processed documents</div>
        </div>

        <div
          onClick={() => setActiveTab('labs')}
          className="bg-[#FCFAF6] border border-[#E0D8CC] p-5 rounded-2xl hover:border-[#2B1E2F] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#6F6870] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Extracted Lab Findings</span>
            <TestTube className="w-4 h-4 text-[#728B78] group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-bold font-mono text-[#2B1E2F]">{labs.length}</div>
          <div className="text-xs text-[#6F6870] mt-1">
            <span className="text-[#A54E43] font-semibold">{abnormalCount} out of range</span>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('labs')}
          className="bg-[#FCFAF6] border border-[#E0D8CC] p-5 rounded-2xl hover:border-[#2B1E2F] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#6F6870] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Verification State</span>
            <ShieldCheck className="w-4 h-4 text-[#4F7359] group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-bold font-mono text-[#4F7359]">{verificationPercentage}%</div>
          <div className="text-xs text-[#6F6870] mt-1">{verifiedCount} of {labs.length} verified by human</div>
        </div>

        <div
          onClick={() => setActiveTab('conflicts')}
          className={`border p-5 rounded-2xl transition-all cursor-pointer group ${
            unresolvedConflicts.length > 0
              ? 'bg-[#FDF3E7] border-[#C08A3E] text-[#7C521A]'
              : 'bg-[#FCFAF6] border-[#E0D8CC] text-[#242126]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Source Conflicts</span>
            <AlertTriangle className="w-4 h-4 text-[#C08A3E] group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-bold font-mono text-[#C08A3E]">{unresolvedConflicts.length}</div>
          <div className="text-xs mt-1">
            {unresolvedConflicts.length > 0 ? 'Requires clinician review' : 'No conflicts detected'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#FCFAF6] border border-[#E0D8CC] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E0D8CC] pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#C08A3E]" />
                <h3 className="text-lg font-bold text-[#2B1E2F]">Patient Record AI Intelligence Summary</h3>
              </div>
              <button
                onClick={() => setActiveTab('summary')}
                className="text-xs font-semibold text-[#C76D5B] hover:underline flex items-center gap-1"
              >
                Full AI Sandbox <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <p className="text-sm leading-relaxed text-[#242126] font-medium bg-[#F7F4EE] p-4 rounded-xl border border-[#E0D8CC]">
              {aiSummary.summaryText}
            </p>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#6F6870]">Key Documented Extractions</h4>
              <ul className="space-y-2">
                {aiSummary.keyFindings.map((finding, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-[#242126] bg-white p-3 rounded-lg border border-[#E0D8CC]">
                    <CheckCircle2 className="w-4 h-4 text-[#728B78] shrink-0 mt-0.5" />
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>

            {undeterminedCount > 0 && (
              <div className="bg-[#F4F1EA] border border-[#D9D2C7] p-3.5 rounded-xl flex items-start gap-3 text-xs text-[#6F6870]">
                <HelpCircle className="w-4 h-4 text-[#2B1E2F] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#2B1E2F]">Strict Reference-Range Logic Notice:</strong> {undeterminedCount} lab value(s) in this record omitted reference ranges on the source report. MedLens preserved these as unclassified without inventing external bounds.
                </div>
              </div>
            )}
          </div>

          <div className="bg-[#FCFAF6] border border-[#E0D8CC] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#2B1E2F]">Recent Laboratory Extractions</h3>
              <button
                onClick={() => setActiveTab('labs')}
                className="text-xs font-semibold text-[#2B1E2F] hover:underline flex items-center gap-1"
              >
                View All {labs.length} Results <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E0D8CC] text-[#6F6870]">
                    <th className="py-2.5 px-3 font-semibold uppercase">Test Name</th>
                    <th className="py-2.5 px-3 font-semibold uppercase">Result</th>
                    <th className="py-2.5 px-3 font-semibold uppercase">Source Range</th>
                    <th className="py-2.5 px-3 font-semibold uppercase">Status</th>
                    <th className="py-2.5 px-3 font-semibold uppercase">Provenance</th>
                    <th className="py-2.5 px-3 font-semibold uppercase text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0D8CC]">
                  {labs.slice(0, 5).map((lab) => (
                    <tr key={lab.id} className="hover:bg-[#F7F4EE] transition-colors">
                      <td className="py-3 px-3 font-semibold text-[#2B1E2F]">{lab.testName}</td>
                      <td className="py-3 px-3 font-mono font-bold text-[#242126]">
                        {lab.value} <span className="text-[11px] font-normal text-[#6F6870]">{lab.unit}</span>
                      </td>
                      <td className="py-3 px-3 font-mono text-[#6F6870]">
                        {lab.referenceRange || 'Reference range not provided'}
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={lab.status} size="sm" />
                      </td>
                      <td className="py-3 px-3">
                        <ProvenanceBadge provenance={lab.provenance} size="sm" />
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onInspectLab(lab)}
                          className="text-xs font-semibold text-[#C76D5B] hover:underline"
                        >
                          Inspect Source
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#FCFAF6] border border-[#E0D8CC] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E0D8CC] pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#C08A3E]" />
                <h3 className="text-sm font-bold text-[#2B1E2F]">Information Conflicts</h3>
              </div>
              <span className="text-xs font-mono font-bold text-[#C08A3E]">{unresolvedConflicts.length} Pending</span>
            </div>

            {unresolvedConflicts.length > 0 ? (
              <div className="space-y-3">
                {unresolvedConflicts.map((c) => (
                  <div key={c.id} className="bg-[#FDF3E7] border border-[#F4D9B4] p-3.5 rounded-xl space-y-2 text-xs">
                    <div className="font-bold text-[#7C521A]">{c.field}</div>
                    <div className="text-[#242126]">
                      <strong>Patient Intake:</strong> {c.sourceA.value}
                    </div>
                    <div className="text-[#6F6870]">
                      <strong>Report:</strong> {c.sourceB.value}
                    </div>
                    <button
                      onClick={() => setActiveTab('conflicts')}
                      className="w-full mt-1 bg-[#C08A3E] hover:bg-[#A67532] text-white py-1.5 rounded-lg font-semibold transition-colors text-center"
                    >
                      Resolve Conflict
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#6F6870]">No information discrepancies detected across source files.</p>
            )}
          </div>

          <div className="bg-[#FCFAF6] border border-[#E0D8CC] rounded-2xl p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#E0D8CC] pb-3">
              <h3 className="text-sm font-bold text-[#2B1E2F]">Patient Intake Summary</h3>
              <ProvenanceBadge provenance="PATIENT_PROVIDED" size="sm" />
            </div>

            <div>
              <span className="font-semibold text-[#6F6870] uppercase tracking-wider block mb-1">Active Conditions</span>
              <ul className="list-disc list-inside space-y-1 text-[#242126]">
                {patient.conditions.map((c) => (
                  <li key={c.id}>{c.name}</li>
                ))}
              </ul>
            </div>

            <div>
              <span className="font-semibold text-[#6F6870] uppercase tracking-wider block mb-1">Known Allergies</span>
              <ul className="list-disc list-inside space-y-1 text-[#A54E43] font-medium">
                {patient.allergies.map((a) => (
                  <li key={a.id}>{a.allergen} ({a.reaction})</li>
                ))}
              </ul>
            </div>

            <div>
              <span className="font-semibold text-[#6F6870] uppercase tracking-wider block mb-1">Reported Medications</span>
              <ul className="list-disc list-inside space-y-1 text-[#242126]">
                {patient.medications.map((m) => (
                  <li key={m.id}>{m.name} {m.dosage}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
