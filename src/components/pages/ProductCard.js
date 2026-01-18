import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ProductCard = ({
  title,
  subtitle,
  description,
  icon: Icon,
  colorScheme,
  features,
  route,
  buttonText
}) => {
  const navigate = useNavigate();
  const [visibleFeatures, setVisibleFeatures] = useState([]);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Stagger the feature animations
            features.forEach((_, index) => {
              setTimeout(() => {
                setVisibleFeatures(prev => [...prev, index]);
              }, index * 100); // 100ms delay between each feature
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [features]);

  return (
    <div ref={cardRef} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-out transform hover:-translate-y-1 border border-gray-100 overflow-hidden will-change-transform">
      <div className={`bg-gradient-to-r ${colorScheme.gradient} p-5 lg:p-6 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -translate-y-12 translate-x-12 transition-transform duration-700 ease-out group-hover:scale-150 group-hover:opacity-5"></div>
        <div className="relative z-10 flex items-center text-white">
          <div className="w-12 h-12 lg:w-14 lg:h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-3 transition-all duration-300 ease-out group-hover:bg-opacity-30 group-hover:scale-105">
            <Icon className="w-6 h-6 lg:w-7 lg:h-7 transition-transform duration-300 ease-out group-hover:scale-110" />
          </div>
          <div>
            <h3 className="text-2xl lg:text-3xl font-bold mb-0.5">{title}</h3>
            <p className={`${colorScheme.subtitleColor} text-sm lg:text-base`}>{subtitle}</p>
          </div>
        </div>
      </div>

      <div className="p-5 lg:p-6">
        <p className="text-gray-600 mb-5 lg:mb-6 text-sm lg:text-base leading-relaxed">
          {description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5 mb-5 lg:mb-6">
          {features.map((feature, index) => {
            const FeatureIcon = feature.icon;
            const isVisible = visibleFeatures.includes(index);
            return (
              <div
                key={index}
                className={`flex items-start p-3 lg:p-3.5 rounded-lg bg-gray-50 hover:${colorScheme.hoverBg} transition-all duration-300 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <div className="flex-shrink-0 mr-3">
                  <div className={`w-8 h-8 lg:w-9 lg:h-9 rounded-lg bg-white flex items-center justify-center shadow-sm ${
                    isVisible ? 'animate-check-in' : ''
                  }`}>
                    <FeatureIcon className={`w-4 h-4 lg:w-5 lg:h-5 ${feature.color}`} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 mb-0.5 text-sm lg:text-base">{feature.title}</h4>
                  <p className="text-gray-600 text-xs lg:text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => navigate(route)}
          className={`group inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r ${colorScheme.buttonGradient} text-white font-semibold rounded-xl hover:${colorScheme.buttonHover} transform hover:scale-105 transition-all duration-300 ease-out shadow-lg hover:shadow-xl will-change-transform`}
          aria-label={`Navigate to ${title}`}
        >
          <span className="text-base lg:text-lg transition-all duration-200">{buttonText}</span>
          <ArrowRight className="ml-2 lg:ml-3 w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform duration-200 ease-out" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
