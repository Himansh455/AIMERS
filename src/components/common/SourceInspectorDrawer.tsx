import React, { useEffect } from 'react';
import type { LabResult } from '../../types/clinical';
import { ProvenanceBadge } from './ProvenanceBadge';
import { StatusBadge } from './StatusBadge';
import { X, FileText, Calendar, Percent, ShieldCheck } from 'lucide-react';

interface SourceInspectorDrawerProps {
  labResult: LabResult | null;
  onClose: () => void;
  onVerify?: (id: string) => void;
}

export const SourceInspectorDrawer: React.FC<SourceInspectorDrawerProps> = ({
  labResult,
  onClose,
  onVerify,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (labResult) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [labResult, onClose]);

  if (!labResult) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="source-inspector-title"
    >
      <div className="w-full max-w-lg bg-[#FCFAF6] h-full shadow-2xl flex flex-col border-l border-[#E0D8CC]">
        <div className="px-6 py-5 bg-[#2B1E2F] text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#C08A3E]" />
              <span className="text-xs font-mono uppercase tracking-wider text-[#D9CEC1]">Source Provenance Inspector</span>
            </div>
            <h2 id="source-inspector-title" className="text-xl font-bold mt-1 text-[#F7F4EE]">
              {labResult.testName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#D9CEC1] hover:text-white rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#C08A3E]"
            aria-label="Close provenance inspector drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-[#242126]">
          <div className="bg-[#F7F4EE] border border-[#E0D8CC] rounded-xl p-5 space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium text-[#6F6870]">Extracted Value</span>
              <span className="text-3xl font-bold font-mono text-[#2B1E2F]">
                {labResult.value} <span className="text-sm font-normal text-[#6F6870]">{labResult.unit}</span>
              </span>
            </div>

            <div className="pt-3 border-t border-[#E0D8CC] grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#6F6870]">Classification</span>
                <div className="mt-1">
                  <StatusBadge status={labResult.status} />
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#6F6870]">Report Reference Range</span>
                <div className="mt-1 font-mono text-sm font-medium text-[#2B1E2F]">
                  {labResult.referenceRange || 'Reference range not provided'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E0D8CC] rounded-xl p-4 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6F6870]">Classification Rationale</span>
            <p className="text-sm text-[#242126] font-medium leading-relaxed">
              {labResult.statusExplanation}
            </p>
            {labResult.status === 'UNDETERMINED' && (
              <p className="text-xs text-[#6F6870] bg-[#F7F4EE] p-2.5 rounded border border-[#E0D8CC]">
                Strict Rule: MedLens never invents reference ranges. Because this source report omitted a reference range, the value remains unclassified.
              </p>
            )}
          </div>

          <div className="bg-white border border-[#E0D8CC] rounded-xl p-4 space-y-3 text-sm">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE1]">
              <span className="text-xs text-[#6F6870] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#2B1E2F]" /> Source Document
              </span>
              <span className="font-semibold text-[#2B1E2F] truncate max-w-[200px]" title={labResult.sourceReportName}>
                {labResult.sourceReportName}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE1]">
              <span className="text-xs text-[#6F6870] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#2B1E2F]" /> Document Date
              </span>
              <span className="font-medium text-[#2B1E2F]">{labResult.sourceDate}</span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE1]">
              <span className="text-xs text-[#6F6870] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2B1E2F]" /> Provenance Origin
              </span>
              <ProvenanceBadge provenance={labResult.provenance} size="sm" />
            </div>

            {labResult.confidence !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#6F6870] flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-[#2B1E2F]" /> Extraction Confidence
                </span>
                <span className="font-mono font-bold text-[#728B78]">{labResult.confidence}%</span>
              </div>
            )}
          </div>

          <div className="bg-[#F7F4EE] border border-[#E0D8CC] rounded-lg p-3 text-xs text-[#6F6870] flex items-start gap-2">
            <Percent className="w-4 h-4 text-[#728B78] shrink-0 mt-0.5" />
            <span>
              Extraction confidence reflects document text OCR accuracy and does not indicate medical certainty.
            </span>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6F6870] flex items-center justify-between">
              <span>Source Document Excerpt</span>
              {labResult.sourcePage && <span>Page {labResult.sourcePage}</span>}
            </span>
            <div className="bg-[#2B1E2F] text-[#F7F4EE] font-mono text-xs p-4 rounded-xl leading-relaxed whitespace-pre-wrap border border-[#3E2D44]">
              {labResult.sourceExcerpt || `${labResult.testName} ...... ${labResult.value} ${labResult.unit}  (Ref: ${labResult.referenceRange || 'Not provided'})`}
            </div>
          </div>

          {labResult.verificationRecord && (
            <div className="bg-[#EBF3ED] border border-[#C3D9C9] rounded-xl p-4 text-xs space-y-1 text-[#242126]">
              <div className="font-semibold text-[#4F7359] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Human Verification Log
              </div>
              <div>Verified By: <strong>{labResult.verificationRecord.verifiedBy}</strong></div>
              <div>Verified Date: <strong>{labResult.verificationRecord.verifiedAt}</strong></div>
            </div>
          )}
        </div>

        <div className="p-4 bg-[#F7F4EE] border-t border-[#E0D8CC] flex items-center gap-3">
          {labResult.provenance === 'AI_EXTRACTED' && onVerify && (
            <button
              onClick={() => {
                onVerify(labResult.id);
                onClose();
              }}
              className="flex-1 bg-[#728B78] hover:bg-[#5C7361] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#728B78]"
            >
              <ShieldCheck className="w-4 h-4" /> Verify Result
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-[#E0D8CC] hover:bg-white text-[#242126] rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#2B1E2F]"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
