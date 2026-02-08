import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  BarChart3,
  ArrowRight,
  Zap,
  Users,
  Calendar,
  Download,
  TrendingUp,
  CheckCircle,
  Sparkles,
  ChevronDown,
  Play,
  Table2,
  RefreshCw,
  ShieldCheck,
  Upload,
  MessageSquareText
} from 'lucide-react';
import ProductCard from './ProductCard';
import SectionLoader from './SectionLoader';
import SocialProofSection from './SocialProofSection';

// Lazy load heavy sections for better performance
const IntegrationSection = lazy(() => import('./IntegrationSection'));
const ISOComplianceSection = lazy(() => import('./ISOComplianceSection'));

const HomePage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [visibleSections, setVisibleSections] = useState({
    hero: false,
    products: false,
    bepCard: false,
    supportCards: false,
    social: false
  });

  useEffect(() => {
    setIsVisible(true);

    // Intersection Observer for scroll-triggered animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-section');
            if (sectionId) {
              setVisibleSections(prev => ({ ...prev, [sectionId]: true }));
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    // Observe all sections
    const sections = document.querySelectorAll('[data-section]');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const features = {
    bep: [
      { icon: Zap, title: 'AI Text Generation', desc: 'Local LLM with 24+ field types — your data never leaves your machine', color: 'text-yellow-600' },
      { icon: FileText, title: 'Rich Text Editor', desc: 'TipTap editor with tables, images & formatting', color: 'text-blue-600' },
      { icon: Download, title: 'Professional Export', desc: 'High-quality PDF/DOCX with TOC & diagrams', color: 'text-green-600' },
      { icon: CheckCircle, title: 'Command Palette', desc: 'Quick navigation (Ctrl+K) & onboarding', color: 'text-purple-600' }
    ],
    tidp: [
      { icon: BarChart3, title: 'Auto MIDP Generation', desc: 'Consolidate TIDPs into master plans', color: 'text-teal-600' },
      { icon: TrendingUp, title: 'Evolution Dashboard', desc: 'Real-time progress tracking & analytics', color: 'text-orange-600' },
      { icon: Users, title: 'Batch Operations', desc: 'Excel/CSV import & bulk TIDP creation', color: 'text-indigo-600' },
      { icon: Calendar, title: 'Dependency Matrix', desc: 'Cross-team visualization & risk register', color: 'text-red-600' }
    ],
    idrm: [
      { icon: Table2, title: 'IM Activities RACI', desc: 'ISO 19650-2 Annex A responsibility matrix', color: 'text-purple-600' },
      { icon: FileText, title: 'Deliverables Tracking', desc: 'LOD/LOIN specs with auto-TIDP sync', color: 'text-blue-600' },
      { icon: CheckCircle, title: 'Reusable Templates', desc: 'Pre-configured matrices for project types', color: 'text-green-600' },
      { icon: Download, title: 'Matrix Export', desc: 'Excel/CSV export for stakeholder review', color: 'text-orange-600' }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" data-page-uri="/">
      {/* Hero Section */}
      <div
        className="relative overflow-hidden"
        data-section="hero"
      >
        {/* Background with animated gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          }}></div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-white opacity-10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white opacity-10 rounded-full animate-pulse delay-2000"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className={`text-center transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 mb-4" role="status" aria-label="Platform compliance badge">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 mr-1.5" aria-hidden="true" />
              <span className="text-xs lg:text-sm font-medium text-white">ISO 19650-Compliant Information Management Platform</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Create ISO 19650-Compliant BEPs in Hours, Not Weeks
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-blue-100 mb-6 max-w-4xl mx-auto leading-relaxed">
              Reduce manual errors, automate TIDP/MIDP coordination, and ensure full compliance—with AI-powered assistance that understands your project requirements.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
              <button
                onClick={() => navigate('/bep-generator')}
                className="group relative inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 ease-out shadow-xl hover:shadow-2xl will-change-transform text-lg animate-pulse-subtle"
                aria-label="Launch BEP Generator to create BIM Execution Plans"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                <Play className="w-5 h-5 mr-2 relative z-10 group-hover:scale-110 transition-transform duration-200" aria-hidden="true" />
                <span className="relative z-10">Launch BEP Generator</span>
                <ArrowRight className="ml-2 w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" />
              </button>
            </div>

            {/* Key Features Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-white mb-0.5">ISO 19650</div>
                <div className="text-blue-200 text-xs lg:text-sm">Full Compliance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-white mb-0.5">AI-Powered</div>
                <div className="text-blue-200 text-xs lg:text-sm">Content Generation</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-white mb-0.5">RACI Matrix</div>
                <div className="text-blue-200 text-xs lg:text-sm">Responsibility Tracking</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-white mb-0.5">Multi-Export</div>
                <div className="text-blue-200 text-xs lg:text-sm">PDF • DOCX • Excel</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce" aria-hidden="true">
          <ChevronDown className="w-6 h-6 text-white opacity-70" />
        </div>
      </div>

      {/* Products Section */}
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16"
        data-section="products"
      >
        <div className={`text-center mb-8 lg:mb-12 transition-all duration-1000 ease-out ${visibleSections.products ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Integrated Workflow from Planning to Delivery
          </h2>
          <p className="text-base lg:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Three powerful tools working seamlessly together. Generate compliant BEPs, coordinate information delivery with TIDP/MIDP,
            and manage responsibility matrices—all synchronized in real-time.
          </p>
        </div>

        {/* BEP Generator - Main Card (Prominent) */}
        <div
          className="max-w-5xl mx-auto mb-8 lg:mb-12"
          data-section="bepCard"
        >
          <div className={`group bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 ease-out transform hover:-translate-y-2 border border-gray-100 overflow-hidden will-change-transform ${visibleSections.bepCard ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 lg:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
              {/* Start Here Badge */}
              <div
                className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg font-semibold text-sm z-20"
                role="status"
                aria-label="Recommended starting point for ISO 19650 workflow"
              >
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span>Start Here</span>
              </div>
              <div className="relative z-10 flex items-center text-white">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                  <FileText className="w-8 h-8 lg:w-10 lg:h-10" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-3xl lg:text-4xl font-bold mb-1">BEP Generator</h3>
                  <p className="text-blue-100 text-base lg:text-lg">Professional BIM Execution Plans</p>
                </div>
              </div>
            </div>

            <div className="p-8 lg:p-10">
              <p className="text-gray-600 mb-6 lg:mb-8 text-base lg:text-lg leading-relaxed">
                The master plan for your entire ISO 19650 workflow. Start here to create comprehensive BEPs that automatically integrate with TIDP/MIDP delivery plans and responsibility matrices. AI-powered content generation, professional export formats, and intelligent wizards guide you through pre- and post-appointment phases.
              </p>

              {/* Integration Callouts */}
              <div className="grid grid-cols-2 gap-4 mb-6 lg:mb-8" role="region" aria-label="BEP integration capabilities">
                <div className="flex items-start p-3 bg-blue-50 border-l-4 border-green-500 rounded">
                  <RefreshCw className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h5 className="font-semibold text-gray-900 text-sm">Auto-Sync with TIDP/MIDP</h5>
                    <p className="text-xs text-gray-600">Delivery plans flow into BEP appendices</p>
                  </div>
                </div>
                <div className="flex items-start p-3 bg-blue-50 border-l-4 border-purple-500 rounded">
                  <Table2 className="w-5 h-5 text-purple-600 mr-3 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h5 className="font-semibold text-gray-900 text-sm">Live RACI Integration</h5>
                    <p className="text-xs text-gray-600">Responsibility matrices embed directly in BEP</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6 mb-6 lg:mb-8">
                {features.bep.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-start p-4 lg:p-4.5 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors duration-200"
                    >
                      <div className="flex-shrink-0 mr-3">
                        <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-lg bg-white flex items-center justify-center shadow-sm">
                          <IconComponent className={`w-5 h-5 lg:w-6 lg:h-6 ${feature.color}`} aria-hidden="true" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 mb-1 text-base lg:text-lg">{feature.title}</h4>
                        <p className="text-gray-600 text-sm lg:text-base leading-relaxed">{feature.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => navigate('/bep-generator')}
                className="group inline-flex items-center justify-center w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl will-change-transform"
                aria-label="Navigate to BEP Generator"
              >
                <span className="text-lg lg:text-xl">Start Creating BEP</span>
                <ArrowRight className="ml-3 lg:ml-4 w-5 h-5 lg:w-6 lg:h-6 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* TIDP/MIDP and Responsibility Matrix - Two Column Grid */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto"
          data-section="supportCards"
        >
          <div className={`transition-all duration-700 ease-out delay-100 ${visibleSections.supportCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            {/* TIDP/MIDP Manager */}
            <ProductCard
              title="TIDP/MIDP Manager"
              subtitle="Information Delivery Planning"
              description="Coordinate information delivery across task teams with comprehensive TIDP management. Automatically consolidate into MIDPs, track dependencies, manage LOINs, and maintain responsibility matrices aligned with ISO 19650 requirements. Automatically integrates delivery timelines and responsibilities into your BEP."
              icon={BarChart3}
              colorScheme={{
                gradient: 'from-green-500 to-green-600',
                subtitleColor: 'text-green-100',
                hoverBg: 'bg-green-50',
                buttonGradient: 'from-green-600 to-green-700',
                buttonHover: 'from-green-700 to-green-800'
              }}
              features={features.tidp}
              route="/tidp-midp"
              buttonText="Manage Information Delivery"
            />
          </div>

          <div className={`transition-all duration-700 ease-out delay-300 ${visibleSections.supportCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            {/* Responsibility Matrix Manager */}
            <ProductCard
              title="Responsibility Matrix Manager"
              subtitle="High-level & Detailed Responsibility Matrices"
              description="Manage ISO 19650-compliant responsibility matrices (high-level for pre-appointment BEP, detailed for post-appointment). Automatic synchronization with TIDP and deliverables. Create reusable templates, track deliverables with LOIN requirements, and auto-sync with TIDP containers."
              icon={Table2}
              colorScheme={{
                gradient: 'from-purple-500 to-purple-600',
                subtitleColor: 'text-purple-100',
                hoverBg: 'bg-purple-50',
                buttonGradient: 'from-purple-600 to-purple-700',
                buttonHover: 'from-purple-700 to-purple-800'
              }}
              features={features.idrm}
              route="/idrm-manager"
              buttonText="Manage Responsibility Matrices"
            />
          </div>
        </div>
      </div>

      {/* AI Differentiator Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 lg:py-16 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.3"%3E%3Ccircle cx="20" cy="20" r="1.5"/%3E%3C/g%3E%3C/svg%3E")'
        }}></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 lg:mb-10">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-green-500 bg-opacity-10 border border-green-500 border-opacity-30 mb-4">
              <ShieldCheck className="w-4 h-4 text-green-400 mr-2" aria-hidden="true" />
              <span className="text-sm font-medium text-green-300">100% Local AI — Your Data Never Leaves Your Machine</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              AI That No Competitor Offers
            </h2>
            <p className="text-base lg:text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Upload your EIR, get structured intelligence, and generate field-specific BEP content — all powered by a local LLM via Ollama. No confidential bid documents ever leave your network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Step 1: EIR Upload */}
            <div className="relative bg-white bg-opacity-5 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white border-opacity-10 hover:border-opacity-20 transition-all duration-300">
              <div className="absolute -top-3 left-6 inline-flex items-center px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-bold">
                Step 1
              </div>
              <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-xl flex items-center justify-center mb-4 mt-2">
                <Upload className="w-6 h-6 text-blue-400" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Upload EIR Document</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Upload your Exchange Information Requirements (PDF or DOCX). The AI parses the entire document and extracts structured JSON covering project info, standards, deliverables, and requirements.
              </p>
            </div>

            {/* Step 2: Structured Extraction */}
            <div className="relative bg-white bg-opacity-5 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white border-opacity-10 hover:border-opacity-20 transition-all duration-300">
              <div className="absolute -top-3 left-6 inline-flex items-center px-3 py-1 rounded-full bg-yellow-500 text-white text-xs font-bold">
                Step 2
              </div>
              <div className="w-12 h-12 bg-yellow-500 bg-opacity-20 rounded-xl flex items-center justify-center mb-4 mt-2">
                <Zap className="w-6 h-6 text-yellow-400" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">AI Extracts & Suggests</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                The extracted EIR data flows into every BEP field as tailored suggestions. Each section gets content pre-aligned to the client's specific requirements — no generic boilerplate.
              </p>
            </div>

            {/* Step 3: Guided Authoring */}
            <div className="relative bg-white bg-opacity-5 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white border-opacity-10 hover:border-opacity-20 transition-all duration-300">
              <div className="absolute -top-3 left-6 inline-flex items-center px-3 py-1 rounded-full bg-green-500 text-white text-xs font-bold">
                Step 3
              </div>
              <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-xl flex items-center justify-center mb-4 mt-2">
                <MessageSquareText className="w-6 h-6 text-green-400" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Guided Q&A Authoring</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Not sure what to write? Answer a few contextual questions and the AI composes professional, ISO 19650-aligned content from your responses. No BIM expertise required to get started.
              </p>
            </div>
          </div>

          <div className="mt-8 lg:mt-10 text-center">
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-white bg-opacity-5 border border-white border-opacity-10">
              <ShieldCheck className="w-5 h-5 text-green-400" aria-hidden="true" />
              <span className="text-sm text-gray-300">
                Powered by <span className="text-white font-semibold">Ollama</span> running locally — ideal for firms handling confidential bid documents and sensitive infrastructure projects.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Compare Tools</h2>
          <p className="text-gray-600 text-base lg:text-lg max-w-3xl mx-auto">
            Understanding the hierarchy ensures efficient workflow
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden bg-white shadow-lg" role="table" aria-label="Product feature comparison between BEP Generator, TIDP/MIDP Manager, and IDRM Manager">
            <caption className="sr-only">Comparison of features across BEP Generator (core tool), TIDP/MIDP Manager, and IDRM Manager to help you understand their roles in the ISO 19650 workflow</caption>
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-900 bg-blue-50 border-l border-r border-blue-200">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" aria-hidden="true" />
                    <span>BEP Generator</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-600 text-white" role="status" aria-label="Core product">CORE</span>
                  </div>
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-600" aria-hidden="true" />
                    <span>TIDP/MIDP Manager</span>
                  </div>
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  <div className="flex items-center gap-2">
                    <Table2 className="w-5 h-5 text-purple-600" aria-hidden="true" />
                    <span>IDRM Manager</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Role in Workflow</td>
                <td className="px-6 py-4 text-sm text-gray-700 bg-blue-50 border-l border-r border-blue-100">Master plan & central hub</td>
                <td className="px-6 py-4 text-sm text-gray-700">Delivery coordination</td>
                <td className="px-6 py-4 text-sm text-gray-700">Responsibility tracking</td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Start Here</td>
                <td className="px-6 py-4 text-sm bg-blue-50 border-l border-r border-blue-100">
                  <div className="flex items-center gap-2 text-green-600 font-semibold">
                    <CheckCircle className="w-5 h-5" aria-hidden="true" />
                    <span>Always start here</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">After BEP created</td>
                <td className="px-6 py-4 text-sm text-gray-500">After BEP created</td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Auto-Sync</td>
                <td className="px-6 py-4 text-sm text-gray-700 bg-blue-50 border-l border-r border-blue-100">
                  <span className="font-semibold text-blue-600">Source of truth</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">Syncs to BEP</td>
                <td className="px-6 py-4 text-sm text-gray-700">Syncs to BEP</td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">AI Generation</td>
                <td className="px-6 py-4 text-sm bg-blue-50 border-l border-r border-blue-100">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" aria-hidden="true" />
                    <span>Full support (24+ fields)</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">Limited support</td>
                <td className="px-6 py-4 text-sm text-gray-500">Not applicable</td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Primary Use Case</td>
                <td className="px-6 py-4 text-sm text-gray-700 bg-blue-50 border-l border-r border-blue-100">Project foundation & strategy</td>
                <td className="px-6 py-4 text-sm text-gray-700">Manage deliveries & timelines</td>
                <td className="px-6 py-4 text-sm text-gray-700">Track responsibilities</td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">ISO 19650 Focus</td>
                <td className="px-6 py-4 text-sm text-gray-700 bg-blue-50 border-l border-r border-blue-100">Clauses 5.1-5.7 (comprehensive)</td>
                <td className="px-6 py-4 text-sm text-gray-700">Clause 5.4 (delivery)</td>
                <td className="px-6 py-4 text-sm text-gray-700">Annex A (responsibilities)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 italic">
            All three tools work seamlessly together - the BEP serves as the master plan that coordinates information requirements and workflows
          </p>
        </div>
      </div>

      {/* Social Proof Section */}
      <div data-section="social">
        <div className={`transition-all duration-1000 ease-out ${visibleSections.social ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <SocialProofSection />
        </div>
      </div>

      {/* Integration Section - Lazy Loaded */}
      <Suspense fallback={<SectionLoader isDark={true} />}>
        <IntegrationSection />
      </Suspense>

      {/* ISO 19650 Compliance Section - Lazy Loaded */}
      <Suspense fallback={<SectionLoader isDark={false} />}>
        <ISOComplianceSection />
      </Suspense>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Streamline Your Information Management
          </h2>
          <p className="text-base lg:text-lg text-blue-100 mb-6 leading-relaxed">
            Professional tools for BIM Managers and Information Managers to deliver ISO 19650-compliant projects with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/bep-generator')}
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transform hover:scale-105 transition-all duration-200 shadow-lg will-change-transform"
              aria-label="Create new BIM Execution Plan"
            >
              <FileText className="w-4 h-4 mr-2" aria-hidden="true" />
              Create BEP
            </button>
            <button
              onClick={() => navigate('/tidp-midp')}
              className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-200 will-change-transform"
              aria-label="Manage TIDP and MIDP information delivery plans"
            >
              <BarChart3 className="w-4 h-4 mr-2" aria-hidden="true" />
              Manage TIDP/MIDP
            </button>
            <button
              onClick={() => navigate('/idrm-manager')}
              className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-200 will-change-transform"
              aria-label="Manage responsibility matrices"
            >
              <Table2 className="w-4 h-4 mr-2" aria-hidden="true" />
              Manage Matrices
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 lg:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="w-7 h-7 lg:w-8 lg:h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-white" />
              </div>
              <span className="text-white font-bold text-lg lg:text-xl">BEP Suite</span>
            </div>
            <p className="text-gray-400 mb-4 lg:mb-5 max-w-md mx-auto text-sm lg:text-base">
              ISO 19650-compliant information management platform for BIM professionals in the AEC industry.
            </p>
            <div className="flex items-center justify-center space-x-4 lg:space-x-6 text-xs lg:text-sm text-gray-400 mb-4">
              <span className="text-gray-500">React 19 • PyTorch 2.6 • FastAPI</span>
              <span>•</span>
              <span className="text-gray-500">Version 2.0.0</span>
            </div>
            <div className="mt-4 lg:mt-5 pt-4 lg:pt-5 border-t border-gray-800">
              <p className="text-gray-500 text-xs lg:text-sm">
                © 2024-2025 BEP Suite. Professional ISO 19650 information management tools.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;