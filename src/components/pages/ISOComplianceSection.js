import React from 'react';
import { CheckCircle, Calendar, Users, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const FADE_UP = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const cards = [
  {
    gradient: 'from-blue-50 to-blue-100',
    border: 'border-blue-200',
    bg: 'bg-blue-500',
    icon: CheckCircle,
    title: 'Clause 5.1 & 5.3',
    desc: 'Information management process and information requirements framework',
  },
  {
    gradient: 'from-green-50 to-green-100',
    border: 'border-green-200',
    bg: 'bg-green-500',
    icon: Calendar,
    title: 'Clause 5.4',
    desc: 'Information delivery planning with TIDP/MIDP framework',
  },
  {
    gradient: 'from-violet-50 to-violet-100',
    border: 'border-violet-200',
    bg: 'bg-violet-500',
    icon: Users,
    title: 'Annex A',
    desc: 'Responsibility matrices for information management activities and deliverables',
  },
  {
    gradient: 'from-indigo-50 to-indigo-100',
    border: 'border-indigo-200',
    bg: 'bg-indigo-500',
    icon: TrendingUp,
    title: 'LOIN Management',
    desc: 'Level of Information Need specification and tracking for all deliverables',
  },
];

const ISOComplianceSection = () => {
  return (
    <motion.div
      className="bg-gradient-to-br from-gray-50 to-slate-100 py-12 lg:py-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={FADE_UP}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 lg:mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            ISO 19650 Compliance Built-In
          </h2>
          <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive implementation of ISO 19650-2:2018 requirements for information management
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {cards.map(({ gradient, border, bg, icon: Icon, title, desc }) => (
            <div
              key={title}
              className={`bg-gradient-to-br ${gradient} rounded-xl p-6 border ${border} shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200`}
            >
              <div className={`w-12 h-12 ${bg} rounded-lg flex items-center justify-center mb-4 shadow-sm`}>
                <Icon className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-700">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ISOComplianceSection;
