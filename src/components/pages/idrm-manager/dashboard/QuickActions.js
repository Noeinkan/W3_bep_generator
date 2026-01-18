import React from 'react';
import { Users, FileText, CheckCircle, ArrowRight } from 'lucide-react';

const QuickActions = ({ onViewIMActivities, onViewDeliverables, onViewTemplates }) => {
  const actions = [
    {
      title: 'IM Activities Matrix',
      description: 'Manage ISO 19650-2 Annex A responsibility assignments',
      icon: Users,
      color: 'purple',
      onClick: onViewIMActivities
    },
    {
      title: 'Deliverables Matrix',
      description: 'Track information deliverables and responsibilities',
      icon: FileText,
      color: 'blue',
      onClick: onViewDeliverables
    },
    {
      title: 'Matrix Templates',
      description: 'Reusable templates for common project types',
      icon: CheckCircle,
      color: 'green',
      onClick: onViewTemplates
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.onClick}
              className={`group text-left bg-white rounded-xl shadow-sm border-2 border-${action.color}-200 p-6 hover:shadow-lg hover:border-${action.color}-300 transition-all duration-200 transform hover:-translate-y-1`}
            >
              <div className={`w-12 h-12 bg-${action.color}-500 rounded-lg flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{action.description}</p>
              <div className="flex items-center text-sm font-medium text-purple-600 group-hover:text-purple-700">
                <span>Open</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
