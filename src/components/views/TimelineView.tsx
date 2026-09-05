import React from 'react';
import type { TimelineEvent } from '../../types/clinical';
import { ProvenanceBadge } from '../common/ProvenanceBadge';
import { Clock, User, FileText, Bot, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface TimelineViewProps {
  timeline: TimelineEvent[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({ timeline }) => {
  const renderCategoryIcon = (category: TimelineEvent['category']) => {
    switch (category) {
      case 'PATIENT_INTAKE':
        return <User className="w-4 h-4 text-[#2B1E2F]" />;
      case 'REPORT_UPLOAD':
        return <FileText className="w-4 h-4 text-[#C76D5B]" />;
      case 'AI_EXTRACTION':
        return <Bot className="w-4 h-4 text-[#1E3A8A]" />;
      case 'HUMAN_VERIFICATION':
        return <ShieldCheck className="w-4 h-4 text-[#4F7359]" />;
      case 'CONFLICT_RESOLVED':
        return <CheckCircle2 className="w-4 h-4 text-[#C08A3E]" />;
      default:
        return <Clock className="w-4 h-4 text-[#6F6870]" />;
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto text-[#242126]">
      <div className="border-b border-[#E0D8CC] pb-5">
        <h2 className="text-2xl font-bold text-[#2B1E2F]">Timeline & Provenance Audit Trail</h2>
        <p className="text-xs text-[#6F6870] mt-1">
          Chronological record of patient intake, report uploads, AI extractions, and clinician verification logs.
        </p>
      </div>

      <div className="relative pl-6 space-y-8 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E0D8CC]">
        {timeline.map((event) => (
          <div key={event.id} className="relative flex items-start gap-4 group">
            <div className="absolute -left-6 top-1.5 w-6 h-6 rounded-full bg-[#FCFAF6] border-2 border-[#2B1E2F] flex items-center justify-center shadow-xs">
              {renderCategoryIcon(event.category)}
            </div>

            <div className="bg-[#FCFAF6] border border-[#E0D8CC] rounded-2xl p-5 flex-1 hover:border-[#2B1E2F] transition-all shadow-xs space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0EBE1] pb-2">
                <div className="font-bold text-[#2B1E2F] text-sm">{event.title}</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#6F6870]">{event.timestamp}</span>
                  <ProvenanceBadge provenance={event.provenance} size="sm" />
                </div>
              </div>

              <p className="text-xs text-[#242126] leading-relaxed">{event.description}</p>

              <div className="text-[11px] text-[#6F6870] flex items-center gap-2 pt-1">
                <span>Actor: <strong>{event.actor}</strong></span>
                {event.relatedReportId && <span>• Document Ref: {event.relatedReportId}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
