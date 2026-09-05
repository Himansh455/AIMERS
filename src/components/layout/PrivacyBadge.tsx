import React from 'react';
import { Lock } from 'lucide-react';

export const PrivacyBadge: React.FC = () => {
  return (
    <div className="bg-[#FCFAF6] border border-[#E0D8CC] px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs text-[#6F6870]">
      <Lock className="w-3.5 h-3.5 text-[#728B78] shrink-0" aria-hidden="true" />
      <span>
        <strong className="text-[#2B1E2F]">Synthetic Patient Record</strong> • Local Privacy Workspace
      </span>
    </div>
  );
};
