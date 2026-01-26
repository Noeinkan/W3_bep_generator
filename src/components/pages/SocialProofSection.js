import React, { useState, useEffect, useRef } from 'react';
import { Building2, Award, TrendingUp, FlaskConical, MessageSquare, Wrench } from 'lucide-react';

const SocialProofSection = () => {
  const [visibleStats, setVisibleStats] = useState([]);
  const [visibleTestimonials, setVisibleTestimonials] = useState([]);
  const statsRef = useRef(null);
  const testimonialsRef = useRef(null);

  useEffect(() => {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Stagger stats animation
            stats.forEach((_, index) => {
              setTimeout(() => {
                setVisibleStats(prev => [...prev, index]);
              }, index * 150);
            });
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    const testimonialsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Stagger highlights animation
            highlights.forEach((_, index) => {
              setTimeout(() => {
                setVisibleTestimonials(prev => [...prev, index]);
              }, index * 200);
            });
            testimonialsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (statsRef.current) statsObserver.observe(statsRef.current);
    if (testimonialsRef.current) testimonialsObserver.observe(testimonialsRef.current);

    return () => {
      statsObserver.disconnect();
      testimonialsObserver.disconnect();
    };
  }, []);

  const highlights = [
    {
      title: "Private beta",
      description: "This tool is currently in development with a small group of pilot users.",
      icon: FlaskConical
    },
    {
      title: "Feedback-driven",
      description: "Features and workflows are evolving based on real project input.",
      icon: MessageSquare
    },
    {
      title: "Focused scope",
      description: "Built to streamline BEP creation, EIR analysis, and TIDP coordination.",
      icon: Wrench
    }
  ];

  const stats = [
    { number: "Beta", label: "Early access stage", icon: Building2 },
    { number: "ISO 19650", label: "Standards-aligned focus", icon: Award },
    { number: "In progress", label: "Rapid feature iteration", icon: TrendingUp }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Built with BIM Professionals
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            This tool is not commercially available yet. We are currently iterating with early users and partners.
          </p>
        </div>

        {/* Stats Grid */}
        <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            const isVisible = visibleStats.includes(index);
            return (
              <div
                key={index}
                className={`bg-white rounded-xl p-6 shadow-md border border-gray-100 text-center hover:shadow-lg transition-all duration-500 ease-out ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-3 ${
                  isVisible ? 'animate-scale-in' : ''
                }`}>
                  <IconComponent className="w-6 h-6 text-blue-600" aria-hidden="true" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Highlights Grid */}
        <div ref={testimonialsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {highlights.map((highlight, index) => {
            const isVisible = visibleTestimonials.includes(index);
            const IconComponent = highlight.icon;
            return (
              <div
                key={index}
                className={`bg-white rounded-xl p-6 lg:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 ease-out hover:-translate-y-1 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
                    <IconComponent className="w-5 h-5 text-purple-600" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{highlight.title}</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {highlight.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Focus Areas */}
        <div className="mt-12 pt-12 border-t border-gray-200">
          <div className="text-center mb-6">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Current focus areas</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="text-gray-400 font-semibold text-lg hover:text-gray-600 transition-colors duration-300 cursor-default">BEP creation workflows</div>
            <div className="text-gray-400 font-semibold text-lg hover:text-gray-600 transition-colors duration-300 cursor-default">EIR analysis support</div>
            <div className="text-gray-400 font-semibold text-lg hover:text-gray-600 transition-colors duration-300 cursor-default">TIDP coordination</div>
            <div className="text-gray-400 font-semibold text-lg hover:text-gray-600 transition-colors duration-300 cursor-default">ISO 19650 alignment</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialProofSection;
