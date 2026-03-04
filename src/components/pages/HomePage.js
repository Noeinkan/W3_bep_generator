import { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
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
import { motion } from 'framer-motion';
import Lenis from 'lenis';
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

// ── RoleCard ─────────────────────────────────────────────────────────────────

const VARIANT_CLASSES = {
  indigo: {
    header: 'from-indigo-600 to-blue-700',
    subtitle: 'text-indigo-100',
    featureBg: 'bg-indigo-50 hover:bg-indigo-100',
    btn: 'from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800',
  },
  blue: {
    header: 'from-blue-500 to-blue-600',
    subtitle: 'text-blue-100',
    featureBg: 'bg-blue-50 hover:bg-blue-100',
    btn: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
  },
};

const RoleCard = ({ title, subtitle, icon: Icon, description, features, variant, buttonText, onClick, highlighted }) => {
  const v = VARIANT_CLASSES[variant];
  return (
    <div className={`group bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 border overflow-hidden will-change-transform flex flex-col ${highlighted ? 'border-indigo-300 ring-4 ring-indigo-200 ring-offset-2 scale-[1.02]' : 'border-gray-100'}`}>
      <div className={`bg-gradient-to-r ${v.header} p-8 lg:p-10 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16" aria-hidden="true" />
        <div className="relative z-10 flex items-center text-white">
          <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
            <Icon className="w-8 h-8 lg:w-10 lg:h-10" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-3xl lg:text-4xl font-bold mb-1">{title}</h3>
            <p className={`${v.subtitle} text-base lg:text-lg`}>{subtitle}</p>
          </div>
        </div>
      </div>

      <div className="p-8 lg:p-10 flex flex-col flex-1">
        <p className="text-gray-600 mb-6 lg:mb-8 text-base lg:text-lg leading-relaxed">{description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5 mb-8">
          {features.map((f) => {
            const FIcon = f.icon;
            return (
              <div key={f.title} className={`flex items-start p-4 rounded-lg ${v.featureBg} transition-colors duration-200`}>
                <div className="flex-shrink-0 mr-3">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                    <FIcon className={`w-5 h-5 ${f.color}`} aria-hidden="true" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 text-sm">{f.title}</h4>
                    {f.isNew && (
                      <span className="px-1.5 py-0.5 bg-indigo-500 text-white text-[10px] font-bold rounded-full leading-none">New</span>
                    )}
                    {f.isSoon && (
                      <span className="px-1.5 py-0.5 bg-gray-200 text-gray-500 text-[10px] font-medium rounded-full leading-none">Soon</span>
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
          onClick={onClick}
          className={`group/btn inline-flex items-center justify-center w-full px-8 py-4 bg-gradient-to-r ${v.btn} text-white font-semibold rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl will-change-transform`}
          aria-label={buttonText}
        >
          <span className="text-base lg:text-lg">{buttonText}</span>
          <ArrowRight className="ml-3 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

// ── AnimatedCounter ───────────────────────────────────────────────────────────

const AnimatedCounter = ({ target, prefix = '', suffix = '', duration = 1500 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const steps = 40;
          const stepValue = target / steps;
          const stepDuration = duration / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += stepValue;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, stepDuration);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

// ── Component ────────────────────────────────────────────────────────────────

const FADE_UP = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const HomePage = () => {
  const navigate = useNavigate();
  const { setPartyRole } = usePartyRole();
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(null);
  const [orbActive, setOrbActive] = useState(false);
  const orbRef = useRef(null);

  // Hero entrance
  useEffect(() => { setIsVisible(true); }, []);

  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    let raf;
    const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);

  // Custom cursor orb — direct DOM update for performance
  const handleMouseMove = useCallback((e) => {
    if (orbRef.current) {
      orbRef.current.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  const goAs = (role) => {
    setPartyRole(role);
    navigate('/projects');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      {/* ── Cursor orb (hero only, pointer-events-none) ───────────────────── */}
      <div
        ref={orbRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 z-[9999] w-[400px] h-[400px] rounded-full transition-opacity duration-500 ${orbActive ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
          willChange: 'transform',
        }}
      />

      {/* ── Floating Navbar ───────────────────────────────────────────────── */}
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-white/85 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl px-5 py-2.5 flex items-center gap-3">
        <div className="flex items-center gap-2 font-bold text-indigo-700 text-sm">
          <FileText className="w-4 h-4" aria-hidden="true" /> BEP Suite
        </div>
        <div className="w-px h-5 bg-gray-200" />
        <div className="flex items-center gap-1 text-sm">
          <button
            onClick={() => goAs(PARTY_ROLE.APPOINTING_PARTY)}
            className="px-4 py-1.5 rounded-2xl text-gray-600 hover:text-indigo-700 hover:bg-indigo-50 transition-colors flex items-center gap-1.5 font-medium"
          >
            <FileSearch className="w-3.5 h-3.5" aria-hidden="true" /> Appointing Party
          </button>
          <button
            onClick={() => goAs(PARTY_ROLE.LEAD_APPOINTED_PARTY)}
            className="px-4 py-1.5 rounded-2xl text-gray-600 hover:text-blue-700 hover:bg-blue-50 transition-colors flex items-center gap-1.5 font-medium"
          >
            <FileText className="w-3.5 h-3.5" aria-hidden="true" /> Lead Appointed Party
          </button>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800"
        onMouseEnter={() => setOrbActive(true)}
        onMouseLeave={() => setOrbActive(false)}
      >
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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 lg:pt-28 lg:pb-16">
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
                <div className="text-2xl lg:text-3xl font-bold text-white mb-0.5">
                  <AnimatedCounter prefix="ISO " target={19650} duration={1800} />
                </div>
                <div className="text-blue-200 text-xs lg:text-sm">Full Compliance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-white mb-0.5">
                  <AnimatedCounter target={2} suffix=" Roles" duration={800} />
                </div>
                <div className="text-blue-200 text-xs lg:text-sm">AP & LAP Workflows</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-white mb-0.5">AI-Powered</div>
                <div className="text-blue-200 text-xs lg:text-sm">Local LLM via Ollama</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-white mb-0.5">
                  <AnimatedCounter target={3} suffix=" Exports" duration={800} />
                </div>
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
      <motion.div
        className="bg-gray-50 border-b border-gray-200 py-12 lg:py-16"
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
        variants={FADE_UP}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-10">
            How It Works — <span className="normal-case font-normal">click a step to highlight the role</span>
          </p>

          {/* Steps + arrows row */}
          <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-0">
            {workflowSteps.map(({ step, icon: Icon, role, title, desc, accent, border }, i) => (
              <>
                {/* Card */}
                <button
                  key={step}
                  onClick={() => setActiveStep(activeStep === i ? null : i)}
                  className={`flex-1 flex flex-col items-center text-center gap-3 rounded-2xl px-6 py-6 transition-all duration-300 cursor-pointer ${
                    activeStep === i ? 'bg-white shadow-lg scale-[1.04] ring-1 ring-gray-200' : 'hover:bg-white/70'
                  }`}
                >
                  {/* Number badge */}
                  <div className={`w-11 h-11 rounded-full border-2 ${border} bg-white flex items-center justify-center shadow-sm`}>
                    <span className={`text-sm font-bold ${accent}`}>{step}</span>
                  </div>

                  {/* Role label */}
                  <span className={`text-xs font-bold uppercase tracking-widest ${accent}`}>{role}</span>

                  {/* Icon + Title */}
                  <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 flex-shrink-0 ${accent}`} aria-hidden="true" />
                    <h3 className="text-gray-900 font-bold text-lg">{title}</h3>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed max-w-[240px]">{desc}</p>
                </button>

                {/* Connector arrow between cards (desktop only) */}
                {i < workflowSteps.length - 1 && (
                  <div className="hidden md:flex items-center justify-center self-center flex-shrink-0 px-1 text-gray-300" aria-hidden="true">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Role Cards ────────────────────────────────────────────────────── */}
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16"
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
        variants={FADE_UP}
      >
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
          <RoleCard
            title="Appointing Party"
            subtitle="Client / Asset Owner"
            icon={FileSearch}
            description="Set information requirements for the project. Author EIR, OIR, and PIR documents that define the standards the delivery team must meet — your EIR automatically informs the LAP's BEP response."
            features={apFeatures}
            variant="indigo"
            buttonText="Get Started as Appointing Party"
            onClick={() => goAs(PARTY_ROLE.APPOINTING_PARTY)}
            highlighted={activeStep === 0 || activeStep === 2}
          />
          <RoleCard
            title="Lead Appointed Party"
            subtitle="BIM Manager / Information Manager"
            icon={FileText}
            description="Respond to the EIR with a compliant BEP and manage information delivery across the project. Coordinate task teams with TIDP and MIDP plans, assign responsibilities via RACI matrices, and specify LOIN for every deliverable."
            features={lapFeatures}
            variant="blue"
            buttonText="Get Started as Lead Appointed Party"
            onClick={() => goAs(PARTY_ROLE.LEAD_APPOINTED_PARTY)}
            highlighted={activeStep === 1 || activeStep === 2}
          />
        </div>
      </motion.div>

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
          <span>© 2024–{new Date().getFullYear()} BEP Suite · v2.0.0</span>
        </div>
      </footer>

      {/* ── Mobile floating role chooser ──────────────────────────────────── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl px-4 py-3 flex gap-3">
        <button
          onClick={() => goAs(PARTY_ROLE.APPOINTING_PARTY)}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-700 text-white font-semibold rounded-xl active:scale-95 transition-transform duration-100 shadow-lg"
          aria-label="Get started as Appointing Party"
        >
          <FileSearch className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          <span className="text-sm">Appointing Party</span>
        </button>
        <button
          onClick={() => goAs(PARTY_ROLE.LEAD_APPOINTED_PARTY)}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl active:scale-95 transition-transform duration-100 shadow-lg"
          aria-label="Get started as Lead Appointed Party"
        >
          <FileText className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          <span className="text-sm">Lead Appointed Party</span>
        </button>
      </div>

    </div>
  );
};

export default HomePage;
