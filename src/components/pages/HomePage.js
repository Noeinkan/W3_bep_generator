import { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  FileSearch,
  ArrowRight,
  ChevronDown,
  BarChart3,
  Table2,
  Layers,
  ShieldCheck,
  Download,
  Sparkles
} from 'lucide-react';
import { usePartyRole, PARTY_ROLE } from '../../contexts/PartyRoleContext';
import SectionLoader from './SectionLoader';

const IntegrationSection = lazy(() => import('./IntegrationSection'));
const ISOComplianceSection = lazy(() => import('./ISOComplianceSection'));

// ── Feature data ────────────────────────────────────────────────────────────

const apFeatures = [
  {
    icon: FileSearch,
    title: 'EIR Manager',
    desc: 'Create ISO 19650-compliant EIR documents',
    color: 'text-indigo-600',
    isNew: true,
  },
  {
    icon: ShieldCheck,
    title: 'Standards Definition',
    desc: 'Define information standards and criteria',
    color: 'text-blue-700',
  },
  {
    icon: FileText,
    title: 'OIR / PIR',
    desc: 'Organisational and Project requirements',
    color: 'text-indigo-400',
    isSoon: true,
  },
  {
    icon: ArrowRight,
    title: 'EIR → BEP Handoff',
    desc: 'Requirements flow directly into the BEP',
    color: 'text-indigo-500',
  },
];

const lapFeatures = [
  {
    icon: FileText,
    title: 'BEP Generator',
    desc: 'AI-powered BIM Execution Plans, 14-step wizard',
    color: 'text-blue-600',
  },
  {
    icon: BarChart3,
    title: 'TIDP/MIDP Manager',
    desc: 'Coordinate delivery across all task teams',
    color: 'text-green-600',
  },
  {
    icon: Table2,
    title: 'Responsibility Matrix',
    desc: 'ISO 19650 Annex A RACI with TIDP auto-sync',
    color: 'text-purple-600',
  },
  {
    icon: Layers,
    title: 'LOIN Tables',
    desc: 'Level of Information Need per deliverable',
    color: 'text-indigo-600',
  },
];

const workflowSteps = [
  {
    step: '1',
    icon: FileSearch,
    role: 'Appointing Party',
    title: 'Define Requirements',
    desc: 'Author EIR, OIR, and PIR documents that set information standards for the project',
    accent: 'text-indigo-400',
    border: 'border-indigo-500',
  },
  {
    step: '2',
    icon: FileText,
    role: 'Lead Appointed Party',
    title: 'Author & Deliver',
    desc: 'Respond with a compliant BEP; coordinate delivery through TIDP, MIDP, and RACI',
    accent: 'text-blue-400',
    border: 'border-blue-500',
  },
  {
    step: '3',
    icon: Download,
    role: 'Both Parties',
    title: 'Export & Submit',
    desc: 'High-quality PDF, DOCX, and Excel exports for client submission and archiving',
    accent: 'text-green-400',
    border: 'border-green-500',
  },
];

// ── Component ────────────────────────────────────────────────────────────────

const HomePage = () => {
  const navigate = useNavigate();
  const { setPartyRole } = usePartyRole();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const goAs = (role) => {
    setPartyRole(role);
    navigate('/projects');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        {/* Dot-grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
          aria-hidden="true"
        />
        {/* Floating circles */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-pulse" aria-hidden="true" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-white opacity-10 rounded-full animate-pulse delay-1000" aria-hidden="true" />
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white opacity-10 rounded-full animate-pulse delay-2000" aria-hidden="true" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div
            className={`text-center transition-all duration-1000 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 mr-1.5" aria-hidden="true" />
              <span className="text-xs lg:text-sm font-medium text-white">
                ISO 19650-2:2018 Compliant Platform
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              ISO 19650 Information Management
              <br className="hidden md:block" /> for the Full Project Team
            </h1>

            <p className="text-base md:text-lg lg:text-xl text-blue-100 mb-6 max-w-4xl mx-auto leading-relaxed">
              One platform, two roles — from defining requirements with EIR to delivering
              compliant BEPs and coordinating information with TIDP, MIDP, and RACI.
            </p>

            {/* Role CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
              <button
                onClick={() => goAs(PARTY_ROLE.APPOINTING_PARTY)}
                className="group inline-flex items-center px-7 py-3.5 border-2 border-white border-opacity-70 text-white font-bold rounded-xl hover:bg-white hover:bg-opacity-10 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 will-change-transform"
                aria-label="Get started as Appointing Party"
              >
                <FileSearch className="w-5 h-5 mr-2" aria-hidden="true" />
                I&apos;m an Appointing Party
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" />
              </button>
              <button
                onClick={() => goAs(PARTY_ROLE.LEAD_APPOINTED_PARTY)}
                className="group inline-flex items-center px-7 py-3.5 bg-white hover:bg-blue-50 text-blue-700 font-bold rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 will-change-transform"
                aria-label="Get started as Lead Appointed Party"
              >
                <FileText className="w-5 h-5 mr-2" aria-hidden="true" />
                I&apos;m a Lead Appointed Party
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" />
              </button>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-white mb-0.5">ISO 19650</div>
                <div className="text-blue-200 text-xs lg:text-sm">Full Compliance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-white mb-0.5">2 Roles</div>
                <div className="text-blue-200 text-xs lg:text-sm">AP & LAP Workflows</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-white mb-0.5">AI-Powered</div>
                <div className="text-blue-200 text-xs lg:text-sm">Local LLM via Ollama</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-white mb-0.5">Multi-Export</div>
                <div className="text-blue-200 text-xs lg:text-sm">PDF · DOCX · Excel</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
          <ChevronDown className="w-6 h-6 text-white opacity-70" />
        </div>
      </div>

      {/* ── How It Works strip ────────────────────────────────────────────── */}
      <div className="bg-slate-900 py-10 lg:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold text-gray-500 uppercase tracking-widest mb-8">
            How It Works
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {workflowSteps.map(({ step, icon: Icon, role, title, desc, accent, border }, i) => (
              <div key={i} className="relative flex gap-4">
                {/* Step number */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full border-2 ${border} bg-white bg-opacity-5 flex items-center justify-center`}>
                  <span className={`text-sm font-bold ${accent}`}>{step}</span>
                </div>
                <div>
                  <div className={`text-[11px] font-semibold uppercase tracking-wide mb-1 ${accent}`}>{role}</div>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${accent}`} aria-hidden="true" />
                    <h3 className="text-white font-bold text-base">{title}</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                </div>
                {/* Connector arrow (desktop only) */}
                {i < workflowSteps.length - 1 && (
                  <div className="hidden md:block absolute -right-4 top-4 text-gray-700">
                    <ArrowRight className="w-5 h-5" aria-hidden="true" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Role Cards ────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Role to Get Started
          </h2>
          <p className="text-base lg:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Each role in the ISO 19650 workflow has dedicated tools. Select yours to access
            the full suite designed for your responsibilities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">

          {/* ── Appointing Party Card ── */}
          <div className="group bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden will-change-transform flex flex-col">
            {/* Gradient header */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-700 p-8 lg:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16" aria-hidden="true" />
              <div className="relative z-10 flex items-center text-white">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                  <FileSearch className="w-8 h-8 lg:w-10 lg:h-10" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-3xl lg:text-4xl font-bold mb-1">Appointing Party</h3>
                  <p className="text-indigo-100 text-base lg:text-lg">Client / Asset Owner</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-8 lg:p-10 flex flex-col flex-1">
              <p className="text-gray-600 mb-6 lg:mb-8 text-base lg:text-lg leading-relaxed">
                Set information requirements for the project. Author EIR, OIR, and PIR documents
                that define the standards the delivery team must meet — your EIR automatically
                informs the LAP&apos;s BEP response.
              </p>

              {/* Feature grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5 mb-8">
                {apFeatures.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-start p-4 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200"
                    >
                      <div className="flex-shrink-0 mr-3">
                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                          <Icon className={`w-5 h-5 ${f.color}`} aria-hidden="true" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 text-sm">{f.title}</h4>
                          {f.isNew && (
                            <span className="px-1.5 py-0.5 bg-indigo-500 text-white text-[10px] font-bold rounded-full leading-none">
                              New
                            </span>
                          )}
                          {f.isSoon && (
                            <span className="px-1.5 py-0.5 bg-gray-200 text-gray-500 text-[10px] font-medium rounded-full leading-none">
                              Soon
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex-1" />
              <button
                onClick={() => goAs(PARTY_ROLE.APPOINTING_PARTY)}
                className="group/btn inline-flex items-center justify-center w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-700 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl will-change-transform"
                aria-label="Get started as Appointing Party"
              >
                <span className="text-base lg:text-lg">Get Started as Appointing Party</span>
                <ArrowRight className="ml-3 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* ── Lead Appointed Party Card ── */}
          <div className="group bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden will-change-transform flex flex-col">
            {/* Gradient header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 lg:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16" aria-hidden="true" />
              <div className="relative z-10 flex items-center text-white">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                  <FileText className="w-8 h-8 lg:w-10 lg:h-10" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-3xl lg:text-4xl font-bold mb-1">Lead Appointed Party</h3>
                  <p className="text-blue-100 text-base lg:text-lg">BIM Manager / Information Manager</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-8 lg:p-10 flex flex-col flex-1">
              <p className="text-gray-600 mb-6 lg:mb-8 text-base lg:text-lg leading-relaxed">
                Respond to the EIR with a compliant BEP and manage information delivery across
                the project. Coordinate task teams with TIDP and MIDP plans, assign responsibilities
                via RACI matrices, and specify LOIN for every deliverable.
              </p>

              {/* Feature grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5 mb-8">
                {lapFeatures.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-start p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
                    >
                      <div className="flex-shrink-0 mr-3">
                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                          <Icon className={`w-5 h-5 ${f.color}`} aria-hidden="true" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">{f.title}</h4>
                        <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex-1" />
              <button
                onClick={() => goAs(PARTY_ROLE.LEAD_APPOINTED_PARTY)}
                className="group/btn inline-flex items-center justify-center w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl will-change-transform"
                aria-label="Get started as Lead Appointed Party"
              >
                <span className="text-base lg:text-lg">Get Started as Lead Appointed Party</span>
                <ArrowRight className="ml-3 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" aria-hidden="true" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ── Integration Section ───────────────────────────────────────────── */}
      <Suspense fallback={<SectionLoader isDark={true} />}>
        <IntegrationSection />
      </Suspense>

      {/* ── ISO 19650 Compliance Section ─────────────────────────────────── */}
      <Suspense fallback={<SectionLoader isDark={false} />}>
        <ISOComplianceSection />
      </Suspense>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded flex items-center justify-center">
              <FileText className="w-3 h-3 text-white" aria-hidden="true" />
            </div>
            <span className="text-white font-semibold">BEP Suite</span>
            <span>— ISO 19650 information management for BIM professionals</span>
          </div>
          <span>© 2024–2025 BEP Suite · v2.0.0</span>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;
