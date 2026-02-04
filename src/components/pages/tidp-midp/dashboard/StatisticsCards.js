import { Users, Calendar, FileText, TrendingUp } from 'lucide-react';

const StatisticsCards = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 animate-pulse">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
              <div className="ml-4 flex-1">
                <div className="h-7 bg-slate-200 rounded w-12 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      icon: Users,
      value: stats.totalTidps,
      label: 'TIDPs',
      colorClass: 'blue'
    },
    {
      icon: Calendar,
      value: stats.totalMidps,
      label: 'MIDPs',
      colorClass: 'green'
    },
    {
      icon: FileText,
      value: stats.totalDeliverables,
      label: 'Deliverables',
      colorClass: 'purple'
    },
    {
      icon: TrendingUp,
      value: stats.activeMilestones,
      label: 'Milestones',
      colorClass: 'orange'
    }
  ];

  const colorStyles = {
    blue: {
      border: 'border-blue-200',
      hoverBorder: 'hover:border-blue-400',
      bg: 'bg-blue-50',
      text: 'text-blue-600'
    },
    green: {
      border: 'border-green-200',
      hoverBorder: 'hover:border-green-400',
      bg: 'bg-green-50',
      text: 'text-green-600'
    },
    purple: {
      border: 'border-purple-200',
      hoverBorder: 'hover:border-purple-400',
      bg: 'bg-purple-50',
      text: 'text-purple-600'
    },
    orange: {
      border: 'border-orange-200',
      hoverBorder: 'hover:border-orange-400',
      bg: 'bg-orange-50',
      text: 'text-orange-600'
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ icon: Icon, value, label, colorClass }) => {
        const styles = colorStyles[colorClass];
        return (
          <div
            key={label}
            className={`bg-white rounded-xl border-2 ${styles.border} ${styles.hoverBorder} shadow-sm hover:shadow-md transition-all duration-200 p-5 transform hover:-translate-y-0.5`}
          >
            <div className="flex items-center">
              <div className={`p-3 ${styles.bg} rounded-xl`}>
                <Icon className={`w-6 h-6 ${styles.text}`} />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-slate-900">{value}</p>
                <p className="text-sm text-slate-500 font-medium">{label}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatisticsCards;
