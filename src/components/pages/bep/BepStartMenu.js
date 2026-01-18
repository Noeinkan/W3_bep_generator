import React, { useState } from 'react';
import { FolderOpen, Upload, Zap, ChevronRight, Layers, Grid3x3, Sparkles } from 'lucide-react';

const BepStartMenu = ({
  onNewBep,
  onLoadTemplate,
  onContinueDraft,
  onImportBep,
  user
}) => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const handleAction = async (option) => {
    if (!option.enabled || !option.action) return;
    setIsLoading(option.id);
    try {
      await option.action();
    } finally {
      setIsLoading(null);
    }
  };

  const heroOption = {
    id: 'new',
    title: 'Create New BEP',
    subtitle: 'Start from Scratch',
    description: 'Design your BIM Execution Plan step-by-step',
    icon: Layers,
    color: 'blue',
    action: onNewBep,
    enabled: true,
    isHero: true
  };

  const secondaryOptions = [
    {
      id: 'template',
      title: 'Templates',
      subtitle: 'Quick Start',
      description: 'Pre-configured industry examples',
      icon: Grid3x3,
      color: 'purple',
      action: onLoadTemplate,
      enabled: true,
      badge: 'Soon'
    },
    {
      id: 'draft',
      title: 'My Drafts',
      subtitle: 'Continue',
      description: 'Resume saved work',
      icon: FolderOpen,
      color: 'green',
      action: onContinueDraft,
      enabled: !!user,
      badge: null,
      requiresAuth: true
    },
    {
      id: 'import',
      title: 'Import',
      subtitle: 'From File',
      description: 'Load existing BEP JSON',
      icon: Upload,
      color: 'orange',
      action: onImportBep,
      enabled: true,
      badge: 'Soon'
    }
  ];

  const colorClasses = {
    blue: {
      border: 'border-blue-500',
      bg: 'bg-blue-50',
      gradient: 'from-blue-50 to-blue-100',
      iconBg: 'bg-blue-100',
      iconText: 'text-blue-600',
      text: 'text-blue-900',
      badge: 'bg-blue-100 text-blue-700',
      ring: 'ring-blue-200',
      hover: 'hover:border-blue-400'
    },
    purple: {
      border: 'border-purple-500',
      bg: 'bg-purple-50',
      gradient: 'from-purple-50 to-purple-100',
      iconBg: 'bg-purple-100',
      iconText: 'text-purple-600',
      text: 'text-purple-900',
      badge: 'bg-purple-100 text-purple-700',
      ring: 'ring-purple-200',
      hover: 'hover:border-purple-400'
    },
    green: {
      border: 'border-green-500',
      bg: 'bg-green-50',
      gradient: 'from-green-50 to-green-100',
      iconBg: 'bg-green-100',
      iconText: 'text-green-600',
      text: 'text-green-900',
      badge: 'bg-green-100 text-green-700',
      ring: 'ring-green-200',
      hover: 'hover:border-green-400'
    },
    orange: {
      border: 'border-orange-500',
      bg: 'bg-orange-50',
      gradient: 'from-orange-50 to-orange-100',
      iconBg: 'bg-orange-100',
      iconText: 'text-orange-600',
      text: 'text-orange-900',
      badge: 'bg-orange-100 text-orange-700',
      ring: 'ring-orange-200',
      hover: 'hover:border-orange-400'
    }
  };

  const renderHeroCard = (option) => {
    const isHovered = hoveredCard === option.id;
    const isLoading_ = isLoading === option.id;

    return (
      <div
        key={option.id}
        className={`relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl cursor-pointer transition-all duration-300 transform hover:scale-[1.01] shadow-2xl hover:shadow-blue-500/50 overflow-hidden ${
          isLoading_ ? 'opacity-75 cursor-wait' : ''
        }`}
        onClick={() => handleAction(option)}
        onMouseEnter={() => setHoveredCard(option.id)}
        onMouseLeave={() => setHoveredCard(null)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleAction(option);
          }
        }}
      >
        {/* Blueprint Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative p-5 lg:p-7">
          <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-5 lg:gap-8">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 bg-white/20 backdrop-blur-sm rounded-xl mb-3 shadow-lg">
                <option.icon className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
              </div>

              <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-1.5 tracking-tight">
                {option.title}
              </h2>

              <p className="text-blue-100 text-sm lg:text-base font-medium mb-2">
                {option.subtitle}
              </p>

              <p className="text-blue-50/90 text-xs lg:text-sm mb-4 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {option.description}
              </p>

              {/* Primary CTA Button */}
              <button
                className={`inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-600 font-bold rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${
                  isHovered ? 'translate-x-2' : ''
                } ${isLoading_ ? 'cursor-wait' : ''}`}
                disabled={isLoading_}
              >
                <span className="text-sm lg:text-base">Start Now</span>
                {isLoading_ ? (
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
                )}
              </button>
            </div>

            {/* Right Decorative Element */}
            <div className="hidden xl:flex relative">
              <div className="w-28 h-28 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Layers className="w-14 h-14 text-white/30" strokeWidth={1} />
              </div>
            </div>
          </div>
        </div>

        {/* Animated Border on Hover */}
        {isHovered && (
          <div className="absolute inset-0 border-4 border-white/30 rounded-3xl pointer-events-none" />
        )}
      </div>
    );
  };

  const renderSecondaryCard = (option) => {
    const colors = colorClasses[option.color];
    const isHovered = hoveredCard === option.id;
    const isDisabled = !option.enabled;
    const isLoading_ = isLoading === option.id;

    return (
      <div
        key={option.id}
        className={`group relative bg-white border-2 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-1 shadow-md hover:shadow-xl ${
          isDisabled
            ? 'opacity-50 cursor-not-allowed border-slate-200'
            : `${colors.hover} border-slate-200`
        } ${isLoading_ ? 'cursor-wait' : ''}`}
        onClick={() => handleAction(option)}
        onMouseEnter={() => !isDisabled && setHoveredCard(option.id)}
        onMouseLeave={() => setHoveredCard(null)}
        role="button"
        tabIndex={isDisabled ? -1 : 0}
        aria-disabled={isDisabled}
        onKeyDown={(e) => {
          if (!isDisabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleAction(option);
          }
        }}
      >
        <div className="p-4 lg:p-5">
          {/* Icon and Badge Row */}
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2 lg:p-2.5 rounded-lg transition-all duration-300 ${
              isDisabled ? 'bg-slate-100' : colors.iconBg
            }`}>
              <option.icon className={`w-6 h-6 lg:w-7 lg:h-7 ${
                isDisabled ? 'text-slate-400' : colors.iconText
              }`} />
            </div>
            {option.badge && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
                {option.badge}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className={`text-lg lg:text-xl font-bold mb-1 ${
            isDisabled ? 'text-slate-600' : 'text-slate-900'
          }`}>
            {option.title}
          </h3>

          {/* Subtitle */}
          <p className={`text-xs font-semibold mb-2 uppercase tracking-wider ${
            isDisabled ? 'text-slate-400' : colors.text
          }`}>
            {option.subtitle}
          </p>

          {/* Description */}
          <p className={`text-xs lg:text-sm leading-relaxed mb-3 min-h-[32px] ${
            isDisabled ? 'text-slate-500' : 'text-slate-600'
          }`}>
            {option.description}
          </p>

          {/* Auth Warning */}
          {option.requiresAuth && !user && (
            <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-800 font-medium">
                Login required
              </p>
            </div>
          )}

          {/* CTA */}
          {!isDisabled && (
            <div className={`flex items-center gap-2 transition-all duration-300 ${
              isHovered ? 'translate-x-2' : ''
            }`}>
              {isLoading_ ? (
                <div className={`w-4 h-4 border-2 ${colors.border} border-t-transparent rounded-full animate-spin`} />
              ) : (
                <>
                  <span className={`text-xs font-bold uppercase tracking-wider ${colors.text}`}>
                    {option.badge === 'Soon' ? 'Coming Soon' : 'Open'}
                  </span>
                  {option.badge !== 'Soon' && (
                    <ChevronRight className={`w-4 h-4 ${colors.iconText}`} />
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Hover Border */}
        {!isDisabled && isHovered && (
          <div className={`absolute inset-0 border-2 ${colors.border} rounded-2xl pointer-events-none`} />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden flex items-center justify-center p-3 sm:p-4 lg:p-6">
      {/* Architectural Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, #94a3b8 1px, transparent 1px),
            linear-gradient(to bottom, #94a3b8 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, #64748b 2px, transparent 2px),
            linear-gradient(to bottom, #64748b 2px, transparent 2px)
          `,
          backgroundSize: '180px 180px'
        }} />
      </div>

      <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-7xl p-5 sm:p-6 lg:p-8 border border-slate-200/50">
        {/* Header Section */}
        <div className="text-center mb-5 lg:mb-7">
          <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3 lg:mb-4 shadow-lg">
            <Zap className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-1.5 lg:mb-2 tracking-tight">
            BEP Generator
          </h1>
          <p className="text-sm lg:text-base text-slate-600 max-w-2xl mx-auto">
            Professional BIM Execution Plans in minutes
          </p>
        </div>

        {/* Hero Card - New BEP */}
        <div className="mb-5 lg:mb-6">
          {renderHeroCard(heroOption)}
        </div>

        {/* Secondary Options Grid - 3 columns on large screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 mb-5 lg:mb-6">
          {secondaryOptions.map(renderSecondaryCard)}
        </div>

        {/* Info Footer */}
        <div className="relative bg-gradient-to-r from-slate-50/80 to-slate-100/80 backdrop-blur-sm border-2 border-slate-200/50 rounded-xl p-3 lg:p-4 text-center overflow-hidden">
          {/* Subtle pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `
              linear-gradient(45deg, #64748b 25%, transparent 25%),
              linear-gradient(-45deg, #64748b 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #64748b 75%),
              linear-gradient(-45deg, transparent 75%, #64748b 75%)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
          }} />

          <div className="relative">
            <h4 className="text-sm lg:text-base font-bold text-slate-900 mb-1.5 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              What is a BEP?
            </h4>
            <p className="text-xs lg:text-sm text-slate-600 leading-relaxed max-w-3xl mx-auto">
              BIM Execution Plans define information management throughout your project lifecycle.
              Choose <span className="font-semibold">Pre-Appointment</span> for early planning or <span className="font-semibold">Post-Appointment</span> for detailed delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BepStartMenu;
