import React from 'react';
import { FileSearch, FileText, BarChart3, Table2, Layers, ArrowRight, ShieldCheck } from 'lucide-react';

const apTools = [
  { icon: FileSearch, label: 'EIR Manager', desc: 'Author ISO 19650-compliant information requirements', color: 'text-indigo-600', badge: 'New' },
  { icon: ShieldCheck, label: 'Standards Definition', desc: 'Set BIM standards, protocols and formats', color: 'text-blue-700' },
  { icon: FileText, label: 'OIR / PIR', desc: 'Organisational & Project information requirements', color: 'text-indigo-400', badge: 'Soon' },
  { icon: ArrowRight, label: 'EIR → BEP Handoff', desc: 'Requirements flow directly to the delivery team', color: 'text-indigo-500' },
];

const lapTools = [
  { icon: FileText, label: 'Moliari BEP', desc: 'AI-powered BIM Execution Plans, 14-step wizard', color: 'text-blue-600' },
  { icon: BarChart3, label: 'TIDP / MIDP Manager', desc: 'Coordinate delivery across all task teams', color: 'text-green-600' },
  { icon: Table2, label: 'Responsibility Matrix', desc: 'ISO 19650 Annex A RACI with TIDP auto-sync', color: 'text-purple-600' },
  { icon: Layers, label: 'LOIN Tables', desc: 'Level of Information Need per deliverable', color: 'text-indigo-600' },
];

const ToolItem = ({ icon: Icon, label, desc, color, badge, bgColor }) => (
  <div className={`flex items-start gap-3 px-3 py-2.5 ${bgColor} rounded-lg`}>
    <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${color}`} aria-hidden="true" />
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-800">{label}</span>
        {badge === 'New' && (
          <span className="px-1.5 py-0.5 bg-indigo-500 text-white text-[10px] font-bold rounded-full leading-none">New</span>
        )}
        {badge === 'Soon' && (
          <span className="px-1.5 py-0.5 bg-gray-200 text-gray-500 text-[10px] font-medium rounded-full leading-none">Soon</span>
        )}
      </div>
      <p className="text-xs text-gray-500 leading-tight mt-0.5">{desc}</p>
    </div>
  </div>
);

const IntegrationSection = () => {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 py-12 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-10 lg:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            How the Two Roles Connect
          </h2>
          <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
            The Appointing Party sets the requirements; the Lead Appointed Party delivers against them.
            One platform handles both sides of the ISO 19650 handoff.
          </p>
        </div>

        {/* Handoff flow */}
        <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-0">

          {/* Appointing Party side */}
          <div className="flex-1 bg-white border border-indigo-200 rounded-2xl md:rounded-r-none p-6 lg:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <FileSearch className="w-5 h-5 text-indigo-600" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Appointing Party</p>
                <p className="text-gray-900 font-bold text-lg leading-tight">Set Requirements</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-5 leading-relaxed">
              Author EIR, OIR, and PIR documents that define the information standards
              the delivery team must meet.
            </p>
            <div className="space-y-2">
              {apTools.map((tool) => (
                <ToolItem key={tool.label} {...tool} bgColor="bg-indigo-50" />
              ))}
            </div>
          </div>

          {/* Arrow connector */}
          <div className="hidden md:flex flex-col items-center justify-center px-4 z-10">
            <div className="flex flex-col items-center gap-1">
              <div className="w-0.5 h-8 bg-gray-200" />
              <div className="px-3 py-2 bg-white border border-gray-200 rounded-xl shadow-sm">
                <ArrowRight className="w-5 h-5 text-gray-500" aria-hidden="true" />
              </div>
              <div className="w-0.5 h-8 bg-gray-200" />
            </div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-2 text-center leading-tight">
              EIR informs<br />BEP
            </p>
          </div>

          {/* Mobile arrow */}
          <div className="flex md:hidden justify-center items-center py-2">
            <ArrowRight className="w-6 h-6 text-gray-300 rotate-90" aria-hidden="true" />
          </div>

          {/* Lead Appointed Party side */}
          <div className="flex-1 bg-white border border-blue-200 rounded-2xl md:rounded-l-none p-6 lg:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Lead Appointed Party</p>
                <p className="text-gray-900 font-bold text-lg leading-tight">Respond & Deliver</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-5 leading-relaxed">
              Respond with a compliant BEP and coordinate information delivery across
              task teams using TIDP, MIDP, RACI matrices, and LOIN specifications.
            </p>
            <div className="space-y-2">
              {lapTools.map((tool) => (
                <ToolItem key={tool.label} {...tool} bgColor="bg-blue-50" />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default IntegrationSection;
