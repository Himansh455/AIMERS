import React, { useState } from 'react';
import type { LabResult } from '../../types/clinical';
import { StatusBadge } from '../common/StatusBadge';
import { ProvenanceBadge } from '../common/ProvenanceBadge';
import { ShieldCheck, Edit3, Check, X, Percent, HelpCircle } from 'lucide-react';

interface ExtractionReviewModalProps {
  extractedResults: LabResult[];
  reportFileName: string;
  onConfirmAll: (verifiedResults: LabResult[]) => void;
  onClose: () => void;
}

export const ExtractionReviewModal: React.FC<ExtractionReviewModalProps> = ({
  extractedResults,
  reportFileName,
  onConfirmAll,
  onClose,
}) => {
  const [results, setResults] = useState<LabResult[]>(extractedResults);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ value: string; unit: string; range: string }>({
    value: '',
    unit: '',
    range: '',
  });

  const handleStartEdit = (lab: LabResult) => {
    setEditingId(lab.id);
    setEditForm({
      value: lab.value,
      unit: lab.unit,
      range: lab.referenceRange || '',
    });
  };

  const handleSaveEdit = (id: string) => {
    setResults((prev) =>
      prev.map((lab) =>
        lab.id === id
          ? {
              ...lab,
              value: editForm.value,
              unit: editForm.unit,
              referenceRange: editForm.range.trim() ? editForm.range : undefined,
              provenance: 'HUMAN_VERIFIED',
              verificationRecord: {
                verifiedBy: 'Healthcare Staff (User)',
                verifiedAt: new Date().toLocaleString('en-GB'),
                previousValue: lab.value !== editForm.value ? lab.value : undefined,
              },
            }
          : lab
      )
    );
    setEditingId(null);
  };

  const handleConfirm = () => {
    onConfirmAll(results);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FCFAF6] border border-[#E0D8CC] rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-[#2B1E2F] text-white px-6 py-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#728B78]" />
              <span className="text-xs font-mono uppercase tracking-wider text-[#D9CEC1]">AI Extraction Human Review</span>
            </div>
            <h2 className="text-xl font-bold text-[#F7F4EE] mt-1">{reportFileName}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#D9CEC1] hover:text-white rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#C08A3E]"
            aria-label="Close review modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-[#F7F4EE] px-6 py-3 border-b border-[#E0D8CC] text-xs text-[#6F6870] flex items-center justify-between">
          <span>Review and confirm AI extractions before committing to patient record.</span>
          <span className="font-semibold text-[#2B1E2F]">{results.length} Extracted Items</span>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {results.map((lab) => {
            const isEditing = editingId === lab.id;

            return (
              <div
                key={lab.id}
                className="bg-white border border-[#E0D8CC] rounded-xl p-4 transition-all hover:border-[#2B1E2F] space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0EBE1] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#2B1E2F] text-sm">{lab.testName}</span>
                    <span className="text-xs text-[#6F6870] font-mono">[{lab.category}]</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {lab.confidence !== undefined && (
                      <span className="text-xs font-mono font-semibold text-[#728B78] flex items-center gap-1 bg-[#EBF3ED] px-2 py-0.5 rounded border border-[#C3D9C9]">
                        <Percent className="w-3 h-3" /> {lab.confidence}% Extraction Confidence
                      </span>
                    )}
                    <ProvenanceBadge provenance={lab.provenance} size="sm" />
                  </div>
                </div>

                {!isEditing ? (
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs items-center">
                    <div>
                      <span className="text-[#6F6870] uppercase font-semibold block text-[10px]">Extracted Value</span>
                      <span className="font-bold font-mono text-[#2B1E2F] text-base">
                        {lab.value} <span className="text-xs font-normal text-[#6F6870]">{lab.unit}</span>
                      </span>
                    </div>

                    <div>
                      <span className="text-[#6F6870] uppercase font-semibold block text-[10px]">Source Reference Range</span>
                      <span className="font-mono text-[#242126]">
                        {lab.referenceRange || 'Reference range not provided'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[#6F6870] uppercase font-semibold block text-[10px]">Classification</span>
                      <StatusBadge status={lab.status} size="sm" />
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => handleStartEdit(lab)}
                        className="px-3 py-1.5 border border-[#E0D8CC] hover:bg-[#F7F4EE] text-[#242126] font-semibold rounded-lg transition-colors flex items-center gap-1 text-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit Field
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#F7F4EE] p-3 rounded-lg grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block text-[#6F6870] font-semibold mb-1">Value</label>
                      <input
                        type="text"
                        value={editForm.value}
                        onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
                        className="w-full p-2 bg-white border border-[#E0D8CC] rounded-lg font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[#6F6870] font-semibold mb-1">Unit</label>
                      <input
                        type="text"
                        value={editForm.unit}
                        onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
                        className="w-full p-2 bg-white border border-[#E0D8CC] rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[#6F6870] font-semibold mb-1">Source Reference Range</label>
                      <input
                        type="text"
                        value={editForm.range}
                        onChange={(e) => setEditForm({ ...editForm, range: e.target.value })}
                        className="w-full p-2 bg-white border border-[#E0D8CC] rounded-lg font-mono"
                        placeholder="Leave empty if not in report"
                      />
                    </div>
                    <div className="flex items-end justify-end gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-2 text-[#6F6870] hover:underline"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(lab.id)}
                        className="px-3 py-2 bg-[#728B78] text-white font-semibold rounded-lg flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Save
                      </button>
                    </div>
                  </div>
                )}

                <div className="text-[11px] font-mono text-[#6F6870] bg-[#F7F4EE] px-3 py-1.5 rounded border border-[#E0D8CC]">
                  Excerpt: "{lab.sourceExcerpt}"
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-[#F7F4EE] px-6 py-4 border-t border-[#E0D8CC] flex items-center justify-between">
          <div className="text-xs text-[#6F6870] flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-[#728B78]" />
            <span>Extracted ranges are strictly parsed from the report source.</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#E0D8CC] hover:bg-white text-[#242126] rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-5 py-2 bg-[#2B1E2F] hover:bg-[#3E2D44] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
            >
              <ShieldCheck className="w-4 h-4 text-[#728B78]" />
              Confirm & Add to Patient Record
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
