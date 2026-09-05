import React from 'react';
import type { ProvenanceType } from '../../types/clinical';
import { getProvenanceMeta } from '../../utils/provenance';
import { User, Bot, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';

interface ProvenanceBadgeProps {
  provenance: ProvenanceType;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({
  provenance,
  showIcon = true,
  size = 'md',
}) => {
  const meta = getProvenanceMeta(provenance);

  const renderIcon = () => {
    switch (meta.iconName) {
      case 'user':
        return <User className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} aria-hidden="true" />;
      case 'bot':
        return <Bot className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} aria-hidden="true" />;
      case 'check-circle':
        return <CheckCircle className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} aria-hidden="true" />;
      case 'alert-triangle':
        return <AlertTriangle className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} aria-hidden="true" />;
      case 'help-circle':
      default:
        return <HelpCircle className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} aria-hidden="true" />;
    }
  };

  const paddingClass = size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border ${paddingClass} ${meta.badgeStyle}`}
      title={meta.description}
      aria-label={`Provenance origin: ${meta.label}`}
    >
      {showIcon && renderIcon()}
      <span>{meta.label}</span>
    </span>
  );
};
