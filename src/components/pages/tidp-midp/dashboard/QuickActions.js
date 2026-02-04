import React from 'react';
import { Users, Calendar, Upload, ChevronRight } from 'lucide-react';

const QuickActions = ({ onViewTIDPs, onViewMIDPs, onImport, showImport = true }) => {
  const actions = [
    {
      icon: Users,
      title: 'Manage TIDPs',
      description: 'Create and edit team plans',
      onClick: onViewTIDPs,
      colorClass: 'blue'
    },
    {
      icon: Calendar,
      title: 'View MIDP',
      description: 'Monitor master plan',
      onClick: onViewMIDPs,
      colorClass: 'green'
    }
  ];

  // Only include the Import action when allowed
  if (showImport) {
    actions.push({
      icon: Upload,
      title: 'Import Data',
      description: 'Import from Excel/CSV',
      onClick: onImport,
      colorClass: 'purple'
    });
  }

  const colorStyles = {
    blue: {
      border: 'border-slate-200',
      hoverBorder: 'hover:border-blue-400',
      iconBg: 'bg-blue-100',
      iconText: 'text-blue-600',
      text: 'text-blue-600'
    },
    green: {
      border: 'border-slate-200',
      hoverBorder: 'hover:border-green-400',
      iconBg: 'bg-green-100',
      iconText: 'text-green-600',
      text: 'text-green-600'
    },
    purple: {
      border: 'border-slate-200',
      hoverBorder: 'hover:border-purple-400',
      iconBg: 'bg-purple-100',
      iconText: 'text-purple-600',
      text: 'text-purple-600'
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-5">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map(({ icon: Icon, title, description, onClick, colorClass }) => {
          const styles = colorStyles[colorClass];
          return (
            <button
              key={title}
              onClick={onClick}
              className={`group flex items-center p-4 border-2 ${styles.border} ${styles.hoverBorder} rounded-xl hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-[1.02] text-left`}
            >
              <div className={`p-3 ${styles.iconBg} rounded-lg transition-all duration-200`}>
                <Icon className={`w-5 h-5 ${styles.iconText}`} />
              </div>
              <div className="ml-4 flex-1">
                <p className="font-semibold text-slate-900 text-sm mb-0.5">{title}</p>
                <p className="text-slate-500 text-xs">{description}</p>
              </div>
              <ChevronRight className={`w-4 h-4 ${styles.text} opacity-0 group-hover:opacity-100 transition-opacity`} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
