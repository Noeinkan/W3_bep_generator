import React, { useState, useEffect, useRef } from 'react';
import { Star, Building2, Award, TrendingUp } from 'lucide-react';

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
            // Stagger testimonials animation
            testimonials.forEach((_, index) => {
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

  const testimonials = [
    {
      quote: "BEP Suite reduced our BEP preparation time by 60%. The AI assistance and TIDP integration are game-changers for our workflow.",
      author: "Marco Rossi",
      role: "BIM Manager",
      company: "Autostrade per l'Italia",
      rating: 5
    },
    {
      quote: "Finally, a tool that understands ISO 19650 requirements. No more manual coordination between documents—everything syncs automatically.",
      author: "Sarah Johnson",
      role: "Information Manager",
      company: "Mace Group UK",
      rating: 5
    },
    {
      quote: "We've delivered 15+ projects with zero non-conformities since adopting BEP Suite. The responsibility matrix feature alone is worth it.",
      author: "Andreas Schmidt",
      role: "Project Lead",
      company: "Hochtief Germany",
      rating: 5
    }
  ];

  const stats = [
    { number: "500+", label: "Projects Delivered", icon: Building2 },
    { number: "98%", label: "Compliance Rate", icon: Award },
    { number: "60%", label: "Time Saved", icon: TrendingUp }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by BIM Professionals Worldwide
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join hundreds of BIM Managers and Information Managers delivering ISO 19650-compliant projects with confidence
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

        {/* Testimonials Grid */}
        <div ref={testimonialsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => {
            const isVisible = visibleTestimonials.includes(index);
            return (
              <div
                key={index}
                className={`bg-white rounded-xl p-6 lg:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 ease-out hover:-translate-y-1 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                {/* Rating Stars */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 text-yellow-400 fill-current transition-all duration-300 ${
                        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                      }`}
                      style={{ transitionDelay: isVisible ? `${i * 100}ms` : '0ms' }}
                      aria-hidden="true"
                    />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author Info */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                  <div className="text-sm text-blue-600 font-medium">{testimonial.company}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-12 border-t border-gray-200">
          <div className="text-center mb-6">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">As Featured In</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="text-gray-400 font-semibold text-lg hover:text-gray-600 transition-colors duration-300 cursor-default">buildingSMART International</div>
            <div className="text-gray-400 font-semibold text-lg hover:text-gray-600 transition-colors duration-300 cursor-default">BIM4You</div>
            <div className="text-gray-400 font-semibold text-lg hover:text-gray-600 transition-colors duration-300 cursor-default">AEC Magazine</div>
            <div className="text-gray-400 font-semibold text-lg hover:text-gray-600 transition-colors duration-300 cursor-default">Digital Construction</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialProofSection;
