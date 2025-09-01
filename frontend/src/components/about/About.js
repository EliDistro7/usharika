'use client';

import React, { useState, useEffect } from "react";
import { Play, CheckCircle, X, Users, Heart, BookOpen, HandHeart, MessageCircle, Sparkles, ArrowRight } from 'lucide-react';

const AboutSection = () => {
  const [videoSrc, setVideoSrc] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handlePlayClick = (src) => {
    setVideoSrc(src + "?autoplay=1&modestbranding=1&showinfo=0&rel=0");
    document.body.style.overflow = 'hidden';
  };

  const handleClose = () => {
    setVideoSrc(null);
    document.body.style.overflow = 'auto';
  };

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Mouse tracking for interactive background
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "Mafunzo ya Biblia",
      color: "text-primary-600"
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Huduma za Jumuiya", 
      color: "text-green-600"
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: "Maombi ya Pamoja",
      color: "text-yellow-600"
    },
    {
      icon: <HandHeart className="w-5 h-5" />,
      title: "Msaada kwa Wenye Mahitaji",
      color: "text-primary-600"
    },
    {
      icon: <Heart className="w-5 h-5" />,
      title: "Uinjilisti na Huduma",
      color: "text-green-600"
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "Ushirikiano wa Kiroho",
      color: "text-yellow-600"
    }
  ];

  return (
    <>
      <div 
        className="relative overflow-hidden py-20"
        style={{
          background: `
            radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
              rgba(107, 70, 193, 0.05) 0%, 
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
          {/* Floating Orbs */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-gentle-float opacity-60"
              style={{
                width: `${60 + i * 20}px`,
                height: `${60 + i * 20}px`,
                background: `radial-gradient(circle, rgba(168, 85, 247, ${0.08 - i * 0.01}) 0%, transparent 70%)`,
                left: `${15 + i * 15}%`,
                top: `${10 + i * 12}%`,
                animationDelay: `${i * 0.8}s`,
                transform: `translate(${mousePosition.x * (0.01 + i * 0.002)}px, ${mousePosition.y * (0.005 + i * 0.001)}px)`
              }}
            />
          ))}

          {/* Geometric Shapes */}
          <div 
            className="absolute animate-spin opacity-30"
            style={{
              top: "20%",
              right: "10%",
              width: "150px",
              height: "150px",
              background: `conic-gradient(from 0deg, transparent, rgba(34, 197, 94, 0.1), transparent)`,
              borderRadius: "50%",
              animationDuration: "20s",
              transform: `translate(${mousePosition.x * -0.005}px, ${mousePosition.y * -0.005}px)`
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Video Section */}
            <div
              className={`transition-all duration-1000 ease-out ${
                isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
              }`}
            >
              <div className="relative group">
                {/* Video Thumbnail */}
                <div 
                  className="relative overflow-hidden rounded-3xl shadow-primary-lg transition-all duration-500 group-hover:shadow-primary-xl group-hover:scale-105"
                  style={{
                    aspectRatio: '16/9',
                    background: 'linear-gradient(135deg, #6b46c1 0%, #9333ea 50%, #a855f7 100%)',
                  }}
                >
                  {/* Video Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{
                      backgroundImage: `url('https://img.youtube.com/vi/Fhy4gc9DKlI/maxresdefault.jpg')`,
                    }}
                  />
                  
                  {/* Video Overlay */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />
                  
                  {/* Play Button */}
                  <button
                    onClick={() => handlePlayClick("https://www.youtube.com/embed/Fhy4gc9DKlI")}
                    className="absolute inset-0 flex items-center justify-center group/play"
                  >
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover/play:scale-125 group-hover/play:bg-white/30 border-2 border-white/30">
                      <Play className="w-8 h-8 text-white ml-1 fill-current" />
                    </div>
                  </button>

                  {/* Decorative Corner Elements */}
                  <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-gradient-to-br from-primary-400/30 to-primary-600/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Video Stats */}
                <div className="mt-6 flex items-center gap-6">
                  <div className="flex items-center gap-3 glass rounded-full px-4 py-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-medium text-text-secondary">Moja kwa moja</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-tertiary text-sm">
                    <Heart className="w-4 h-4" />
                    <span>Tazama Video yetu</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div
              className={`transition-all duration-1000 ease-out ${
                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              {/* Section Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
                <Sparkles className="w-4 h-4 text-primary-600" />
                <span className="text-primary-700 font-semibold text-sm tracking-wide">Kuhusu Sisi</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl lg:text-5xl font-bold text-text-primary mb-6 font-display leading-tight">
                Kujifunza, Kukua, na{' '}
                <span className="bg-gradient-to-r from-primary-600 via-purple-500 to-primary-700 bg-clip-text text-transparent">
                  Kumtumikia Mungu
                </span>{' '}
                Pamoja
              </h1>

              {/* Description */}
              <p className="text-lg text-text-secondary mb-8 leading-relaxed">
                Usharika wa KKKT Yombo Kuu ni mahali pa faraja, imani, na ukuaji
                wa kiroho. Tunajitahidi kuakisi upendo wa Mungu kupitia mafundisho
                ya Yesu Kristo na huduma kwa wengine. Lengo letu ni kusaidia watu
                wote kukua kiimani, kuelewa Neno la Mungu, na kuwa wafuasi wa kweli
                wa Kristo kwa kushirikiana kama familia moja ya kiroho.
              </p>

              {/* Features Grid */}
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-4 rounded-xl glass-strong transition-all duration-300 hover:scale-105 hover:shadow-soft group ${
                      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}
                    style={{
                      transitionDelay: `${400 + index * 100}ms`
                    }}
                  >
                    <div className={`p-2 rounded-lg bg-gradient-to-br from-white/50 to-white/20 ${feature.color} group-hover:scale-110 transition-transform`}>
                      {feature.icon}
                    </div>
                    <span className="font-medium text-text-primary group-hover:text-primary-600 transition-colors">
                      {feature.title}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div
                className={`transition-all duration-1000 ease-out ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
                style={{ transitionDelay: '1000ms' }}
              >
                <button className="btn-primary rounded-2xl py-4 px-8 font-semibold text-white transition-all duration-300 hover:scale-105 shadow-primary inline-flex items-center gap-3 group">
                  <span>Jiunge Nasi</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>

                {/* Additional Info */}
                <p className="text-sm text-text-tertiary mt-4 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Bila malipo · Karibu kila wakati
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {videoSrc && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(20px)',
            animation: 'fadeIn 0.3s ease-out'
          }}
          onClick={handleClose}
        >
          <div 
            className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-3 rounded-full glass-strong text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 group"
            >
              <X className="w-6 h-6 transition-transform group-hover:rotate-90" />
            </button>

            {/* Video iframe */}
            <iframe
              className="w-full h-full"
              src={videoSrc}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="About Us Video"
            />
          </div>
        </div>
      )}

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
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.9) translateY(20px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        
        @keyframes gentle-float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-3px) translateX(2px); }
          66% { transform: translateY(2px) translateX(-2px); }
        }
        
        .animate-gentle-float {
          animation: gentle-float 8s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default AboutSection;