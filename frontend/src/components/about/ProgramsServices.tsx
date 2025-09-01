'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  Baby, 
  Music, 
  Heart, 
  HandHeart, 
  BookOpen, 
  Sparkles,
  MapPin,
  Phone,
  UserCheck,
  Crown,
  MessageCircle
} from 'lucide-react';

const ProgramsServices = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredSchedule, setHoveredSchedule] = useState<string | null >(null);
  const [hoveredService, setHoveredService] = useState<string | null >(null);

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
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

  const weeklyPrograms = [
    {
      id: 'sunday',
      title: 'Ibada ya Jumapili',
      time: '9:00 AM',
      icon: <Crown className="w-5 h-5" />,
      gradient: 'from-primary-600 to-purple-600',
      description: 'Ibada kuu ya kila wiki'
    },
    {
      id: 'bible',
      title: 'Mafunzo ya Biblia',
      time: 'Jumatano, 6:00 PM',
      icon: <BookOpen className="w-5 h-5" />,
      gradient: 'from-green-600 to-green-700',
      description: 'Kujifunza neno la Mungu'
    },
    {
      id: 'youth',
      title: 'Huduma ya Vijana',
      time: 'Jumamosi, 3:00 PM',
      icon: <Users className="w-5 h-5" />,
      gradient: 'from-yellow-600 to-yellow-700',
      description: 'Vijana wakikua kiimani'
    },
    {
      id: 'prayer',
      title: 'Maombi ya Usiku',
      time: 'Ijumaa ya Kwanza, 9:00 PM',
      icon: <Heart className="w-5 h-5" />,
      gradient: 'from-purple-600 to-purple-700',
      description: 'Maombi makuu ya mwezi'
    }
  ];

  const officeHours = [
    {
      id: 'weekdays',
      title: 'Jumatatu - Jumatano',
      time: '10:00 AM - 4:00 PM',
      icon: <Calendar className="w-5 h-5" />,
      available: true
    },
    {
      id: 'thursday',
      title: 'Alhamisi',
      time: '2:00 PM - 6:00 PM',
      icon: <Clock className="w-5 h-5" />,
      available: true
    },
    {
      id: 'sunday-office',
      title: 'Jumapili',
      time: 'Baada ya ibada',
      icon: <UserCheck className="w-5 h-5" />,
      available: true
    }
  ];

  const ministries = [
    {
      id: 'women',
      title: 'Huduma ya Wanawake',
      description: 'Kukuza wanawake katika imani na huduma.',
      icon: <Heart className="w-6 h-6" />,
      gradient: 'from-pink-500 to-rose-600',
      bgGradient: 'from-pink-50 to-rose-50'
    },
    {
      id: 'youth-ministry',
      title: 'Huduma ya Vijana',
      description: 'Kuwasaidia vijana kukua kiroho na kijamii.',
      icon: <Users className="w-6 h-6" />,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100'
    },
    {
      id: 'children',
      title: 'Huduma ya Watoto',
      description: 'Kuwafundisha watoto njia za Mungu.',
      icon: <Baby className="w-6 h-6" />,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100'
    },
    {
      id: 'music',
      title: 'Kwaya na Muziki',
      description: 'Kuhudumu kupitia nyimbo za sifa.',
      icon: <Music className="w-6 h-6" />,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100'
    },
    {
      id: 'evangelism',
      title: 'Huduma ya Uinjilisti',
      description: 'Kupeleka injili kwa jamii pana.',
      icon: <MessageCircle className="w-6 h-6" />,
      gradient: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-50 to-orange-50'
    },
    {
      id: 'support',
      title: 'Huduma ya Msaada',
      description: 'Kusaidia wenye uhitaji kwa rasilimali mbalimbali.',
      icon: <HandHeart className="w-6 h-6" />,
      gradient: 'from-red-500 to-red-600',
      bgGradient: 'from-red-50 to-red-100'
    }
  ];

  return (
    <div 
      className="relative overflow-hidden py-20"
      style={{
        background: `
          radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
            rgba(107, 70, 193, 0.04) 0%, 
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
        {/* Floating Music Notes */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`note-${i}`}
            className="absolute opacity-20"
            style={{
              left: `${10 + i * 20}%`,
              top: `${5 + i * 18}%`,
              transform: `translate(${mousePosition.x * (0.008 + i * 0.002)}px, ${mousePosition.y * (0.004 + i * 0.001)}px)`,
              animation: `gentle-float ${6 + i * 1.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.8}s`
            }}
          >
            <Music className="w-8 h-8 text-primary-300" />
          </div>
        ))}

        {/* Geometric Shapes */}
        <div 
          className="absolute animate-spin opacity-20"
          style={{
            top: "15%",
            right: "10%",
            width: "100px",
            height: "100px",
            background: `conic-gradient(from 0deg, transparent, rgba(168, 85, 247, 0.1), transparent)`,
            borderRadius: "50%",
            animationDuration: "20s",
            transform: `translate(${mousePosition.x * -0.005}px, ${mousePosition.y * -0.005}px)`
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
              Mafunzo na Huduma
            </span>
            <Sparkles className="w-4 h-4 text-primary-600" />
          </div>

          {/* Main Title */}
          <h2 className="text-4xl lg:text-5xl font-bold text-text-primary mb-6 font-display leading-tight">
            Programu Zetu za{' '}
            <span className="bg-gradient-to-r from-primary-600 via-purple-500 to-primary-700 bg-clip-text text-transparent">
              Kila Wiki
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Tunawakaribisha katika programu mbalimbali za ukuaji wa kiroho
          </p>
        </div>

        {/* Weekly Programs and Office Hours */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-20">
          
          {/* Weekly Programs */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <div className="glass-strong rounded-3xl p-8 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary-600 to-purple-600 text-white">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-text-primary font-display">
                  Ratiba ya Mafunzo na Ibada
                </h3>
              </div>

              <div className="space-y-4">
                {weeklyPrograms.map((program, index) => (
                  <div
                    key={program.id}
                    className={`p-4 rounded-2xl transition-all duration-300 cursor-pointer group ${
                      hoveredSchedule === program.id ? 'scale-105 shadow-medium' : 'scale-100'
                    }`}
                    style={{
                      background: hoveredSchedule === program.id 
                        ? `linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.95) 100%)`
                        : `linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(248, 250, 252, 0.8) 100%)`,
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}
                    onMouseEnter={() => setHoveredSchedule(program.id)}
                    onMouseLeave={() => setHoveredSchedule(null)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div 
                          className={`p-2 rounded-lg bg-gradient-to-br ${program.gradient} text-white transition-transform duration-300 ${
                            hoveredSchedule === program.id ? 'scale-110 rotate-3' : 'scale-100'
                          }`}
                        >
                          {program.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-text-primary group-hover:text-primary-600 transition-colors">
                            {program.title}
                          </h4>
                          <p className="text-sm text-text-tertiary">{program.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-text-secondary">{program.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Office Hours */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <div className="glass-strong rounded-3xl p-8 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-600 to-green-700 text-white">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-text-primary font-display">
                  Ratiba ya Ofisi ya Mchungaji
                </h3>
              </div>

              <div className="space-y-4">
                {officeHours.map((hour, index) => (
                  <div
                    key={hour.id}
                    className="p-4 rounded-2xl glass transition-all duration-300 hover:scale-105 hover:shadow-medium group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white group-hover:scale-110 transition-transform">
                          {hour.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-text-primary">{hour.title}</h4>
                          {hour.available && (
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                              <span className="text-xs text-green-600 font-medium">Inapatikana</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-text-secondary">{hour.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Info */}
              <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-green-50 to-green-100 border border-green-200">
                <div className="flex items-center gap-3 text-green-700">
                  <Phone className="w-5 h-5" />
                  <span className="font-medium">Piga simu kabla ya kuja</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ministries Section */}
        <div
          className={`transition-all duration-1000 ease-out ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          {/* Section Header */}
          <div className="text-center mb-12">
            <h3 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4 font-display">
              Huduma Zinazopatikana{' '}
              <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Kanisani
              </span>
            </h3>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Kila mtu ana mahali katika huduma za kanisa letu
            </p>
          </div>

          {/* Ministries Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ministries.map((ministry, index) => (
              <div
                key={ministry.id}
                className={`transition-all duration-1000 ease-out ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: `${800 + index * 100}ms` }}
                onMouseEnter={() => setHoveredService(ministry.id)}
                onMouseLeave={() => setHoveredService(null)}
              >
                <div 
                  className={`relative overflow-hidden rounded-3xl p-6 h-full transition-all duration-500 group cursor-pointer ${
                    hoveredService === ministry.id ? 'scale-105 shadow-primary-lg' : 'scale-100 shadow-medium'
                  }`}
                  style={{
                    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.95) 100%)`,
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  {/* Background Pattern */}
                  <div 
                    className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${ministry.bgGradient} rounded-bl-full opacity-30 transition-all duration-500 ${
                      hoveredService === ministry.id ? 'scale-150' : 'scale-100'
                    }`}
                  />

                  <div className="relative">
                    {/* Icon */}
                    <div 
                      className={`p-4 rounded-2xl bg-gradient-to-br ${ministry.gradient} text-white shadow-lg mb-4 transition-all duration-300 ${
                        hoveredService === ministry.id ? 'scale-110 rotate-3' : 'scale-100'
                      }`}
                    >
                      {ministry.icon}
                    </div>

                    {/* Content */}
                    <h4 className="text-xl font-bold text-text-primary mb-3 font-display group-hover:text-primary-600 transition-colors">
                      {ministry.title}
                    </h4>
                    
                    <p className="text-text-secondary leading-relaxed mb-4">
                      {ministry.description}
                    </p>

                    {/* Join Button */}
                    <div className={`transition-all duration-300 ${
                      hoveredService === ministry.id ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                    }`}>
                      <button className="text-primary-600 font-semibold text-sm hover:text-primary-700 transition-colors flex items-center gap-2">
                        <span>Jiunge</span>
                        <MapPin className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Hover Shimmer Effect */}
                  {hoveredService === ministry.id && (
                    <div 
                      className="absolute inset-0 opacity-20 pointer-events-none"
                      style={{
                        background: `linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)`,
                        animation: 'shimmer 1.5s ease-out'
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
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
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes gentle-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-8px) rotate(5deg); }
          66% { transform: translateY(4px) rotate(-5deg); }
        }
      `}</style>
    </div>
  );
};

export default ProgramsServices;