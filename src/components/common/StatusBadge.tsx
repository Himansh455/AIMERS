import React from 'react';
import type { LabStatus } from '../../types/clinical';
import { getLabStatusMeta } from '../../utils/provenance';
import { ArrowDown, ArrowUp, Check, HelpCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: LabStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const meta = getLabStatusMeta(status);

  const renderIcon = () => {
    switch (meta.iconName) {
      case 'arrow-down':
        return <ArrowDown className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} aria-hidden="true" />;
      case 'arrow-up':
        return <ArrowUp className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} aria-hidden="true" />;
      case 'check':
        return <Check className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} aria-hidden="true" />;
      case 'help-circle':
      default:
        return <HelpCircle className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} aria-hidden="true" />;
    }
  };

  const paddingClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border ${paddingClass} ${meta.badgeStyle}`}
      title={meta.description}
      aria-label={`Status: ${meta.label}`}
    >
      {renderIcon()}
      <span>{meta.label}</span>
    </span>
  );
};
