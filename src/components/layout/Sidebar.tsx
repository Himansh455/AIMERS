import React from 'react';
import type { ActiveTab } from '../../hooks/useClinicalStore';
import {
  LayoutDashboard,
  User,
  FileText,
  TestTube,
  Clock,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  reportCount: number;
  labCount: number;
  conflictCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  reportCount,
  labCount,
  conflictCount,
}) => {
  const navItems: {
    id: ActiveTab;
    label: string;
    icon: React.ElementType;
    badge?: number | string;
    badgeColor?: string;
    badgeAriaLabel?: string;
  }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'patient', label: 'Patient Information', icon: User },
    { id: 'reports', label: 'Reports', icon: FileText, badge: reportCount, badgeAriaLabel: `${reportCount} source reports` },
    { id: 'labs', label: 'Lab Results', icon: TestTube, badge: labCount, badgeAriaLabel: `${labCount} extracted lab results` },
    { id: 'timeline', label: 'Timeline & Audit', icon: Clock },
    {
      id: 'conflicts',
      label: 'Conflicts',
      icon: AlertTriangle,
      badge: conflictCount > 0 ? conflictCount : undefined,
      badgeColor: 'bg-[#C08A3E] text-white',
      badgeAriaLabel: conflictCount > 0 ? `${conflictCount} unresolved conflict${conflictCount > 1 ? 's' : ''} requiring review` : undefined,
    },
    { id: 'summary', label: 'AI Patient Summary', icon: Sparkles },
  ];

  return (
    <nav
      className="w-full md:w-64 bg-[#FCFAF6] border-r border-[#E0D8CC] p-4 flex flex-col justify-between shrink-0"
      aria-label="Clinical record navigation"
    >
      <div>
        <div
          className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#6F6870]"
          id="nav-section-label"
        >
          Clinical Record Views
        </div>

        <ul role="list" className="space-y-1 mt-1" aria-labelledby="nav-section-label">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <li key={item.id} role="listitem">
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#2B1E2F] text-white shadow-xs'
                      : 'text-[#242126] hover:bg-[#F7F4EE] hover:text-[#2B1E2F]'
                  } focus:outline-none focus:ring-2 focus:ring-[#C08A3E]`}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={`${item.label}${item.badgeAriaLabel ? `, ${item.badgeAriaLabel}` : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#C08A3E]' : 'text-[#6F6870]'}`} aria-hidden="true" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        item.badgeColor || (isActive ? 'bg-[#3E2D44] text-[#F7F4EE]' : 'bg-[#E0D8CC] text-[#242126]')
                      }`}
                      aria-hidden="true"
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="pt-4 border-t border-[#E0D8CC] mt-6 text-xs text-[#6F6870] space-y-1 px-3">
        <div className="font-semibold text-[#2B1E2F]">Responsible AI Guard Active</div>
        <div>Strict Reference-Range Logic Enforcement</div>
      </div>
    </nav>
  );
};
