import React, { useState } from 'react';
import type { AISummary } from '../../types/clinical';
import { evaluateMedicalSafety, STANDARD_SAFETY_DISCLAIMER } from '../../utils/safetyGuard';
import { ProvenanceBadge } from '../common/ProvenanceBadge';
import { Sparkles, ShieldCheck, RefreshCw, Send, CheckCircle2, ShieldAlert } from 'lucide-react';

interface AISummaryViewProps {
  aiSummary: AISummary;
  onRefreshSummary: () => void;
}

export const AISummaryView: React.FC<AISummaryViewProps> = ({ aiSummary, onRefreshSummary }) => {
  const [userQuery, setUserQuery] = useState('');
  const [queryResponse, setQueryResponse] = useState<string | null>(null);
  const [safetyViolation, setSafetyViolation] = useState<string[] | null>(null);

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    const safetyCheck = evaluateMedicalSafety(userQuery);

    if (!safetyCheck.isSafe) {
      setSafetyViolation(safetyCheck.violations);
      setQueryResponse(safetyCheck.sanitizedText);
      return;
    }

    setSafetyViolation(null);
    const queryLower = userQuery.toLowerCase();

    if (queryLower.includes('hemoglobin') || queryLower.includes('anemia')) {
      setQueryResponse(
        `Documented Record Response: Hemoglobin is recorded at 11.2 g/dL on the 04 Sep 2026 CBC report, which is below the report reference range of 12.0–16.0 g/dL. Note: MedLens provides record summaries and cannot evaluate clinical causes or diagnose conditions. Please review with your physician.`
      );
    } else if (queryLower.includes('glucose') || queryLower.includes('sugar')) {
      setQueryResponse(
        `Documented Record Response: Fasting Glucose is recorded at 94 mg/dL on the 02 Sep 2026 Metabolic Panel, which is within the stated report reference range of 70–99 mg/dL.`
      );
    } else if (queryLower.includes('medication') || queryLower.includes('metformin')) {
      setQueryResponse(
        `Documented Record Response: Patient history lists Metformin 500mg (twice daily), while the 02 Sep 2026 report lists no active diabetes medications. MedLens flagged this as a pending conflict for clinician review.`
      );
    } else {
      setQueryResponse(
        `Documented Record Response: The structured patient record contains 9 laboratory test results from 2 uploaded reports. ${aiSummary.summaryText}`
      );
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto text-[#242126]">
      <div className="border-b border-[#E0D8CC] pb-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#C08A3E]" />
            <h2 className="text-2xl font-bold text-[#2B1E2F]">AI Patient Summary & Information Intelligence</h2>
            <ProvenanceBadge provenance={aiSummary.provenance} />
          </div>
          <p className="text-xs text-[#6F6870] mt-1">
            Patient-friendly information summary strictly constrained by responsible-AI safety guardrails.
          </p>
        </div>

        <button
          onClick={onRefreshSummary}
          className="bg-white border border-[#E0D8CC] hover:bg-[#F7F4EE] text-[#2B1E2F] px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Re-generate Summary
        </button>
      </div>

      <div className="bg-[#EBF3ED] border border-[#C3D9C9] rounded-2xl p-4 flex items-start gap-3 text-xs text-[#242126]">
        <ShieldCheck className="w-5 h-5 text-[#4F7359] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#4F7359] text-sm block">Responsible AI Safety Guard Active</strong>
          This AI summary describes documented facts only. It strictly excludes definitive disease diagnoses, prescription advice, or treatment changes.
        </div>
      </div>

      <div className="bg-[#FCFAF6] border border-[#E0D8CC] rounded-2xl p-6 shadow-xs space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#6F6870]">Record Summary</span>
          <p className="text-sm font-medium leading-relaxed bg-[#F7F4EE] p-5 rounded-xl border border-[#E0D8CC] text-[#2B1E2F]">
            {aiSummary.summaryText}
          </p>
        </div>

        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#6F6870]">Documented Key Findings</span>
          <div className="space-y-2">
            {aiSummary.keyFindings.map((finding, idx) => (
              <div key={idx} className="bg-white border border-[#E0D8CC] p-3.5 rounded-xl text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#728B78] shrink-0 mt-0.5" />
                <span className="text-[#242126] font-medium">{finding}</span>
              </div>
            ))}
          </div>
        </div>

        {aiSummary.omittedOrMissingInfo.length > 0 && (
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6F6870]">Missing Reference Ranges & Omissions</span>
            <div className="space-y-2">
              {aiSummary.omittedOrMissingInfo.map((info, idx) => (
                <div key={idx} className="bg-[#F7F4EE] border border-[#E0D8CC] p-3 rounded-xl text-xs text-[#6F6870]">
                  • {info}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-[#FDF3E7] border border-[#F4D9B4] text-[#7C521A] p-4 rounded-xl text-xs space-y-1">
          <strong className="block text-sm font-bold">Standard Safety & Non-Diagnostic Disclaimer</strong>
          <p>{aiSummary.disclaimer || STANDARD_SAFETY_DISCLAIMER}</p>
        </div>
      </div>

      <div className="bg-[#FCFAF6] border border-[#E0D8CC] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="border-b border-[#E0D8CC] pb-3">
          <h3 className="text-base font-bold text-[#2B1E2F]">Record Information Query Sandbox</h3>
          <p className="text-xs text-[#6F6870]">
            Ask questions about documented laboratory results. Test safety guard interception by asking for diagnosis or prescription advice.
          </p>
        </div>

        <form onSubmit={handleQuerySubmit} className="flex gap-3">
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="e.g., What is documented for Hemoglobin? or Test: Diagnose my condition"
            className="flex-1 p-3 bg-white border border-[#E0D8CC] rounded-xl text-xs focus:ring-2 focus:ring-[#C08A3E] focus:outline-none"
          />
          <button
            type="submit"
            className="bg-[#2B1E2F] hover:bg-[#3E2D44] text-white px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shrink-0"
          >
            <Send className="w-3.5 h-3.5" /> Ask MedLens
          </button>
        </form>

        {safetyViolation && (
          <div className="bg-[#FDF1F0] border border-[#F2C7C2] text-[#A54E43] p-4 rounded-xl text-xs space-y-1" role="alert">
            <div className="font-bold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> Safety Guard Interception Alert
            </div>
            <div>Prohibited medical request detected: {safetyViolation.join(', ')}</div>
          </div>
        )}

        {queryResponse && (
          <div className="bg-white border border-[#E0D8CC] p-4 rounded-xl text-xs space-y-2">
            <span className="font-bold text-[#2B1E2F] uppercase tracking-wider text-[10px] block">MedLens Verified Response</span>
            <p className="text-[#242126] font-medium leading-relaxed">{queryResponse}</p>
          </div>
        )}
      </div>
    </div>
  );
};
