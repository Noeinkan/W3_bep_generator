import React from 'react';
import { Table2, FileText, CheckCircle, Briefcase } from 'lucide-react';

const StatisticsCards = ({ stats, loading }) => {
  const cards = [
    {
      title: 'IM Activities',
      value: stats.totalIMActivities,
      icon: Table2,
      color: 'purple',
      bgColor: 'bg-purple-500',
      lightBg: 'bg-purple-50'
    },
    {
      title: 'Deliverables',
      value: stats.totalDeliverables,
      icon: FileText,
      color: 'blue',
      bgColor: 'bg-blue-500',
      lightBg: 'bg-blue-50'
    },
    {
      title: 'Templates',
      value: stats.totalTemplates,
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-500',
      lightBg: 'bg-green-50'
    },
    {
      title: 'Active Projects',
      value: stats.activeProjects,
      icon: Briefcase,
      color: 'orange',
      bgColor: 'bg-orange-500',
      lightBg: 'bg-orange-50'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`${card.lightBg} rounded-xl shadow-sm border-2 border-${card.color}-200 p-6 hover:shadow-md transition-all duration-200`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">{card.title}</p>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatisticsCards;
