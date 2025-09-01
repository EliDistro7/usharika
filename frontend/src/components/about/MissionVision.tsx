'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Target, ArrowRight, Sparkles, Heart, Users, BookOpen, ChevronRight } from 'lucide-react';

const MissionVision = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Mouse tracking for interactive effects
  useEffect(() => {
    interface MousePosition {
      x: number;
      y: number;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
      x: (e.clientX / window.innerWidth) * 100,
      y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const missionVisionData = [
    {
      id: 'vision',
      icon: <Eye className="w-6 h-6" />,
      title: 'Maono',
      content: 'Kuwa taa ya nuru kwa ulimwengu kupitia neno la Mungu.',
      gradient: 'from-primary-600 to-purple-600',
      bgGradient: 'from-primary-50 to-purple-50'
    },
    {
      id: 'mission',
      icon: <Target className="w-6 h-6" />,
      title: 'Dhamira',
      content: 'Kumtumikia Mungu na wanadamu kwa upendo, huduma, na mshikamano.',
      gradient: 'from-green-600 to-green-700',
      bgGradient: 'from-green-50 to-green-100'
    }
  ];

  const leadershipStats = [
    { icon: <Users className="w-5 h-5" />, label: 'Wakristo', value: '1000+' },
    { icon: <BookOpen className="w-5 h-5" />, label: 'Mafunzo', value: '20+' },
    { icon: <Heart className="w-5 h-5" />, label: 'Miradi', value: '15+' }
  ];

  return (
    <div 
      className="relative overflow-hidden py-20"
      style={{
        background: `
          radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
            rgba(107, 70, 193, 0.06) 0%, 
            transparent 50%
          ),
          linear-gradient(135deg, 
            #fefefe 0%, 
            #f7f8fa 25%, 
            #f3f4f7 50%, 
            #f7f8fa 75%, 
            #fefefe 100%
          )
        `,
        transition: "background 0.3s ease-out"
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating Cross Shapes */}
        {[...Array(4)].map((_, i) => (
          <div
            key={`cross-${i}`}
            className="absolute opacity-20"
            style={{
              left: `${20 + i * 25}%`,
              top: `${15 + i * 20}%`,
              transform: `translate(${mousePosition.x * (0.01 + i * 0.002)}px, ${mousePosition.y * (0.005 + i * 0.001)}px)`,
              animation: `gentle-float ${8 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * 1}s`
            }}
          >
            <div 
              className="relative"
              style={{
                width: '40px',
                height: '40px',
                background: `linear-gradient(45deg, rgba(168, 85, 247, 0.1), rgba(34, 197, 94, 0.1))`
              }}
            >
              <div className="absolute inset-0 border-2 border-primary-200 rounded-lg rotate-45" />
              <div className="absolute inset-2 bg-gradient-to-br from-primary-300/30 to-green-300/30 rounded-sm" />
            </div>
          </div>
        ))}

        {/* Geometric Patterns */}
        <div 
          className="absolute animate-spin opacity-30"
          style={{
            top: "10%",
            right: "15%",
            width: "120px",
            height: "120px",
            background: `conic-gradient(from 0deg, transparent, rgba(234, 179, 8, 0.08), transparent)`,
            borderRadius: "50%",
            animationDuration: "25s",
            transform: `translate(${mousePosition.x * -0.008}px, ${mousePosition.y * -0.008}px)`
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div 
          className={`text-center mb-16 transition-all duration-1000 ease-out ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-strong mb-6">
            <Sparkles className="w-4 h-4 text-primary-600" />
            <span className="text-primary-700 font-semibold text-sm tracking-wide uppercase">
              Maono na Dhamira
            </span>
            <Sparkles className="w-4 h-4 text-primary-600" />
          </div>

          {/* Main Title */}
          <h2 className="text-4xl lg:text-5xl font-bold text-text-primary mb-6 font-display leading-tight">
            Mwelekeo Wetu wa{' '}
            <span className="bg-gradient-to-r from-primary-600 via-purple-500 to-primary-700 bg-clip-text text-transparent">
              Kiroho
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Tunajitahidi kuakisi upendo wa Mungu kupitia maono na dhamira yetu
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-center">
          
          {/* Pastor Section */}
          <div
            className={`lg:order-2 transition-all duration-1000 ease-out ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <div className="text-center">
              {/* Pastor Image */}
              <div className="relative inline-block mb-6 group">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary-600 via-purple-500 to-green-500 rounded-full opacity-20 blur-lg group-hover:opacity-30 transition-opacity duration-500" />
                <div className="relative">
                  <img
                    src="/img/mchungaji.jpeg"
                    alt="Rev. Deogratius Katabazi"
                    className="w-48 h-48 rounded-full object-cover shadow-primary-lg transition-all duration-500 group-hover:scale-105 group-hover:shadow-primary-xl border-4 border-white"
                  />
                  
                  {/* Decorative Ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-primary-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
                </div>
                
                {/* Floating Badge */}
                <div className="absolute -bottom-2 -right-2 glass-strong rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-5 h-5 text-primary-600" />
                </div>
              </div>

              {/* Pastor Info */}
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-text-primary font-display">
                  Rev. Deogratius Katabazi
                </h3>
                <p className="text-primary-600 font-semibold">Mtheolojia</p>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {leadershipStats.map((stat, index) => (
                    <div 
                      key={index}
                      className="glass rounded-xl p-3 text-center group hover:scale-105 transition-all duration-300"
                    >
                      <div className="text-primary-600 mb-1 flex justify-center group-hover:scale-110 transition-transform">
                        {stat.icon}
                      </div>
                      <div className="text-lg font-bold text-text-primary">{stat.value}</div>
                      <div className="text-xs text-text-tertiary">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mission & Vision Cards */}
          <div className="lg:col-span-2 lg:order-1 space-y-6">
            {missionVisionData.map((item, index) => (
              <div
                key={item.id}
                className={`transition-all duration-1000 ease-out ${
                  isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
                }`}
                style={{ transitionDelay: `${500 + index * 200}ms` }}
                onMouseEnter={() => setHoveredCard(item.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div 
                  className={`relative overflow-hidden rounded-3xl p-8 transition-all duration-500 group cursor-pointer ${
                    hoveredCard === item.id ? 'scale-105 shadow-primary-lg' : 'scale-100 shadow-medium'
                  }`}
                  style={{
                    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.95) 100%)`,
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  {/* Background Pattern */}
                  <div 
                    className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.bgGradient} rounded-bl-full opacity-20 transition-all duration-500 ${
                      hoveredCard === item.id ? 'scale-150' : 'scale-100'
                    }`}
                  />

                  <div className="relative flex items-start gap-6">
                    {/* Icon */}
                    <div 
                      className={`p-4 rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-lg transition-all duration-300 ${
                        hoveredCard === item.id ? 'scale-110 rotate-3' : 'scale-100 rotate-0'
                      }`}
                    >
                      {item.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-text-primary mb-4 font-display flex items-center gap-3">
                        {item.title}
                        {hoveredCard === item.id && (
                          <ArrowRight className="w-5 h-5 text-primary-600 animate-bounce" />
                        )}
                      </h3>
                      
                      <p className="text-lg text-text-secondary leading-relaxed">
                        {item.content}
                      </p>

                      {/* Decorative Element */}
                      <div className="mt-6 flex items-center gap-3">
                        <div className={`w-16 h-1 rounded-full bg-gradient-to-r ${item.gradient}`} />
                        <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
                      </div>
                    </div>
                  </div>

                  {/* Hover Shimmer Effect */}
                  {hoveredCard === item.id && (
                    <div 
                      className="absolute inset-0 opacity-30 pointer-events-none"
                      style={{
                        background: `linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)`,
                        animation: 'shimmer 1.5s ease-out'
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div 
          className={`text-center mt-16 transition-all duration-1000 ease-out ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
          style={{ transitionDelay: '900ms' }}
        >
          <div className="glass rounded-3xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-text-primary mb-4 font-display">
              Jifunze Zaidi Kuhusu Uongozi Wetu
            </h3>
            <p className="text-text-secondary mb-6 leading-relaxed">
              Tutayafanya maono na dhamira yetu kuwa ukweli kupitia uongozi wenye weledi na uzoefu
            </p>
            
            <button className="btn-primary rounded-2xl py-4 px-8 font-semibold text-white transition-all duration-300 hover:scale-105 shadow-primary inline-flex items-center gap-3 group">
              <span>Ujue Uongozi Wetu</span>
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Additional Info */}
            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-text-tertiary">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Uongozi wa Kimktah</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                <span>Huduma kwa Jamii</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .glass {
          backdrop-filter: blur(16px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .glass-strong {
          backdrop-filter: blur(24px);
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #6b46c1 0%, #9333ea 50%, #a855f7 100%);
          border: none;
          color: white;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(107, 70, 193, 0.3);
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes gentle-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(5deg); }
          66% { transform: translateY(5px) rotate(-5deg); }
        }
      `}</style>
    </div>
  );
};

export default MissionVision;