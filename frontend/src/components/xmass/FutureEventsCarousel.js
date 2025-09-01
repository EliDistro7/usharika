const getCategoryColor = (category) => {
      switch (category) {
        case 'Injili': return 'from-primary-600 to-primary-700';
        case 'Vijana': return 'from-green-600 to-green-700';
        case 'Safari': return 'from-yellow-600 to-yellow-700';
        default: return 'from-primary-600 to-primary-700';
      }
    };

    const getCategoryIcon = (category) => {
      switch (category) {
        case 'Injili': return <Heart className="w-4 h-4" />;
        case 'Vijana': return <Users className="w-4 h-4" />;
        case 'Safari': return <Star className="w-4 h-4" />;
        default: return <Sparkles className="w-4 h-4" />;
      }
    };import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock, Users, Star, ChevronRight, Heart, Sparkles, X, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const FutureEventsCarousel = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const events = [
    {
      targetDate: "2025-06-15T00:00:00Z",
      eventName: "Mkutano wa Injili",
      backgroundImage: "/img/injili.jpeg",
      description: `# MKUTANO WA INJILI

## 🏛️ KKKT - DMP
**JIMBO LA KUSINI USHARIKA WA YOMBO**

---

## 📖 Mada Kuu
**NGUVU MPYA KATIKA KRISTO YESU**  
*Isaya 40:29*

---

## 📅 Tarehe na Wakati
**15 - 21 JUNI 2025**

### ⏰ Mipango ya Kila Siku:
**Kuanzia saa 10 - 12 jioni**

---

## 📍 Mahali
**KKKT - USHARIKA WA YOMBO**

---

## 🎯 Lengo
Vikundi vyote vya usharikani vitahudumu waimbaji binafsi na kwaya kutoka nje ya usharika zitakuwepo

---

> **Karibuni nyote katika mkutano huu!** ✝️🙏`,
      venue: "KKKT - Usharika wa Yombo",
      time: "10:00 - 12:00 PM",
      category: "Injili"
    },
    {
      targetDate: "2025-06-19T00:00:00Z",
      eventName: "Twen'zetu Kwa Yesu",
      backgroundVideo: "/videos/YesuVideo.mp4",
      description: "Maelezo kwa Video",
      venue: "Kanisa Kuu",
      time: "6:00 PM",
      category: "Vijana"
    },
    {
      targetDate: "2025-06-26T00:00:00Z",
      eventName: "Vijana Experience",
      backgroundImage: "/img/vijana.webp",
      description: `# VIJANA EXPERIENCE 2025
⛪️🐘🦓🦏🐆🦛🌊☀️⛱️🏖️🏝️🐅🦓

## 💰 Ada ya Ushiriki
**Tsh. 125,000** kwa kila mmoja

### 📋 Ada hii itajumuisha:
- 🚌 **Usafiri**
- 🍽️ **Chakula**
- 🏨 **Malazi**
- 🦁 **Kutembelea Mbuga ya Wanyama ya Selous**
- 🏖️ **Ziara ya Kilwa Masoko**

## 💳 Njia za Malipo
- 💵 **Cash**
- 📄 **Fomu**

### 📱 Namba ya Kutuma Pesa:
**0687822465**

## ⏰ Tarehe Muhimu
**Mwisho wa kupokea michango:** 20.06.2025

---

> **KARIBUNI VIJANA WOTE!** 🎉  
> *HII NI YETU NA INATUHUSU SISI*`,
      venue: "Selous & Kilwa Masoko",
      time: "Safari Adventure",
      category: "Safari"
    }
  ];

  // Countdown hook
  const useCountdown = (targetDate) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
      const difference = +new Date(targetDate) - +new Date();
      let timeLeft = {};

      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }
      return timeLeft;
    }

    useEffect(() => {
      const timer = setTimeout(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);

      return () => clearTimeout(timer);
    });

    return timeLeft;
  };

  // Helper functions
  const getCategoryColor = (category) => {
    switch (category) {
      case 'Injili': return 'from-primary-600 to-primary-700';
      case 'Vijana': return 'from-green-600 to-green-700';
      case 'Safari': return 'from-yellow-600 to-yellow-700';
      default: return 'from-primary-600 to-primary-700';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Injili': return <Heart className="w-4 h-4" />;
      case 'Vijana': return <Users className="w-4 h-4" />;
      case 'Safari': return <Star className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  // Modal functions
  const openModal = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalVisible(false);
    document.body.style.overflow = 'auto';
    setTimeout(() => setSelectedEvent(null), 300);
  };

  // Event Card Component
  const EventCard = ({ event, index }) => {
    const timeLeft = useCountdown(event.targetDate);
    const [imageLoaded, setImageLoaded] = useState(false);
    const isHovered = hoveredCard === index;

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('sw-TZ', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    };

    return (
      <div
        className={`group relative overflow-hidden rounded-5xl transition-all duration-700 ease-out transform ${
          isHovered ? 'scale-105 shadow-primary-lg' : 'scale-100 shadow-primary'
        }`}
        onMouseEnter={() => setHoveredCard(index)}
        onMouseLeave={() => setHoveredCard(null)}
        style={{
          background: `linear-gradient(135deg, rgba(107, 70, 193, 0.05) 0%, rgba(168, 85, 247, 0.08) 100%)`,
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          minHeight: '500px'
        }}
      >
        {/* Background Media */}
        <div className="absolute inset-0 overflow-hidden rounded-5xl">
          {event.backgroundVideo ? (
            <video
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={event.backgroundVideo} type="video/mp4" />
            </video>
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${getCategoryColor(event.category)} transition-transform duration-700 group-hover:scale-110`}
              style={{
                backgroundImage: event.backgroundImage ? `url(${event.backgroundImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90" />
          
          {/* Animated Overlay Pattern */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x * 0.01}% ${mousePosition.y * 0.01}%, rgba(255,255,255,0.3) 0%, transparent 50%)`
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 p-8 h-full flex flex-col justify-between">
          {/* Header */}
          <div>
            {/* Category Badge */}
            <div className="flex items-center justify-between mb-4">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getCategoryColor(event.category)} text-white text-sm font-semibold shadow-lg`}>
                {getCategoryIcon(event.category)}
                {event.category}
              </div>
              
              {/* Favorite Icon */}
              <div className="p-2 rounded-full glass cursor-pointer transition-all duration-300 hover:scale-110">
                <Heart className="w-5 h-5 text-white/80 hover:text-red-400 transition-colors" />
              </div>
            </div>

            {/* Event Title */}
            <h3 className="text-3xl font-bold text-white mb-4 font-display leading-tight">
              {event.eventName}
            </h3>

            {/* Event Details */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-white/90">
                <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="font-medium">{formatDate(event.targetDate)}</span>
              </div>
              
              <div className="flex items-center gap-3 text-white/90">
                <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="font-medium">{event.time}</span>
              </div>
              
              <div className="flex items-center gap-3 text-white/90">
                <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="font-medium">{event.venue}</span>
              </div>
            </div>
          </div>

          {/* Countdown Timer */}
          {Object.keys(timeLeft).length > 0 && (
            <div className="mb-6">
              <div className="glass-strong rounded-2xl p-6">
                <h4 className="text-white font-semibold mb-4 text-center text-lg">
                  Countdown
                </h4>
                <div className="grid grid-cols-4 gap-4 text-center">
                  {Object.entries(timeLeft).map(([unit, value]) => (
                    <div key={unit} className="space-y-1">
                      <div className="text-2xl font-bold text-white bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        {value}
                      </div>
                      <div className="text-xs text-white/70 uppercase tracking-wider font-medium">
                        {unit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button 
            onClick={() => openModal(event)}
            className={`w-full btn-primary rounded-2xl py-4 px-6 font-semibold text-white transition-all duration-300 transform ${
              isHovered ? 'translate-y-0 shadow-primary-lg' : 'translate-y-1'
            } hover:shadow-primary-lg flex items-center justify-center gap-3 group`}
          >
            <span>Ona Maelezo Zaidi</span>
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Shimmer Effect */}
        <div 
          className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}
          style={{
            background: `linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)`,
            transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
            transition: 'transform 1.5s ease-out'
          }}
        />
      </div>
    );
  };

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
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

  return (
    <div 
      className="relative overflow-hidden min-h-screen"
      style={{
        background: `
          radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
            rgba(107, 70, 193, 0.08) 0%, 
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
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Orbs */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-gentle-float"
            style={{
              width: `${40 + i * 15}px`,
              height: `${40 + i * 15}px`,
              background: `radial-gradient(circle, rgba(168, 85, 247, ${0.08 - i * 0.01}) 0%, transparent 70%)`,
              left: `${10 + i * 12}%`,
              top: `${8 + i * 11}%`,
              animationDelay: `${i * 0.5}s`,
              transform: `translate(${mousePosition.x * (0.02 + i * 0.002)}px, ${mousePosition.y * (0.01 + i * 0.001)}px)`
            }}
          />
        ))}

        {/* Geometric Shapes */}
        <div 
          className="absolute animate-spin"
          style={{
            top: "15%",
            right: "12%",
            width: "180px",
            height: "180px",
            background: `conic-gradient(from 0deg, transparent, rgba(234, 179, 8, 0.06), transparent)`,
            borderRadius: "50%",
            animationDuration: "25s",
            transform: `translate(${mousePosition.x * -0.008}px, ${mousePosition.y * -0.008}px)`
          }}
        />
        
        <div 
          className="absolute animate-pulse"
          style={{
            bottom: "20%",
            left: "8%",
            width: "120px",
            height: "120px",
            background: `linear-gradient(45deg, transparent, rgba(34, 197, 94, 0.05), transparent)`,
            borderRadius: "25%",
            animationDuration: "4s",
            transform: `translate(${mousePosition.x * 0.012}px, ${mousePosition.y * 0.008}px)`
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div 
            className={`text-center mb-16 transition-all duration-1000 ease-out ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
            }`}
          >
            {/* Subtitle Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-strong mb-6 text-primary-700 font-semibold text-sm tracking-wide uppercase">
              <Sparkles className="w-4 h-4" />
              Huduma zinazokuja
              <Sparkles className="w-4 h-4" />
            </div>

            {/* Main Title */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold font-display mb-6 relative">
              <span 
                className="bg-gradient-to-r from-primary-600 via-purple-500 to-primary-700 bg-clip-text text-transparent animate-pulse-soft"
                style={{
                  backgroundSize: "200% 200%",
                  animation: "shimmer 3s ease-in-out infinite"
                }}
              >
                Yajayo
              </span>
              
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 text-yellow-400 animate-bounce">
                <Star className="w-8 h-8 fill-current" />
              </div>
              <div className="absolute -bottom-2 -left-4 text-green-400 animate-pulse">
                <Heart className="w-6 h-6 fill-current" />
              </div>
            </h1>

            {/* Description */}
            <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed font-medium">
              Fuatilia matukio yetu makubwa yanayokuja katika huduma ya Usharika wetu
            </p>

            {/* Decorative Separator */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent to-primary-400 rounded-full" />
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary-600 to-purple-500 animate-pulse" />
              <div className="w-20 h-0.5 bg-gradient-to-l from-transparent to-primary-400 rounded-full" />
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {events.map((event, index) => (
              <div
                key={index}
                className={`transition-all duration-1000 ease-out ${
                  isVisible 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-16 opacity-0'
                }`}
                style={{
                  transitionDelay: `${300 + index * 200}ms`
                }}
              >
                <EventCard event={event} index={index} />
              </div>
            ))}
          </div>

          {/* Bottom Section */}
          <div 
            className={`text-center mt-20 transition-all duration-1000 ease-out ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
            style={{ transitionDelay: '1s' }}
          >
            {/* Decorative Pattern */}
            <div className="flex justify-center items-center gap-6 mb-8">
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-primary-400 to-transparent rounded-full" />
              <div className="relative">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-primary-600 to-purple-500 animate-spin" 
                     style={{ animationDuration: '3s' }} />
                <div className="absolute inset-0 w-4 h-4 rounded-full bg-gradient-to-r from-yellow-400 to-green-400 animate-ping" />
              </div>
              <div className="w-24 h-0.5 bg-gradient-to-l from-transparent via-primary-400 to-transparent rounded-full" />
            </div>

            {/* Call to Action */}
            <div className="glass rounded-3xl p-8 max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-text-primary mb-4 font-display">
                Kumbuka Tarehe
              </h3>
              <p className="text-text-secondary mb-6 leading-relaxed">
                Usiache kupita matukio haya muhimu. Tengeneza ratiba yako mapema.
              </p>
              
              <button className="btn-secondary rounded-xl py-3 px-8 font-semibold transition-all duration-300 hover:scale-105 shadow-yellow inline-flex items-center gap-2 group">
                <Calendar className="w-5 h-5" />
                Ongeza Kalenda
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {modalVisible && selectedEvent && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(20px)',
            animation: modalVisible ? 'fadeIn 0.3s ease-out' : 'fadeOut 0.3s ease-out'
          }}
          onClick={closeModal}
        >
          <div 
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            {/* Modal Header */}
            <div className="relative h-64 overflow-hidden">
              {selectedEvent.backgroundVideo ? (
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <source src={selectedEvent.backgroundVideo} type="video/mp4" />
                </video>
              ) : (
                <div
                  className={`w-full h-full bg-gradient-to-br ${getCategoryColor(selectedEvent.category)}`}
                  style={{
                    backgroundImage: selectedEvent.backgroundImage ? `url(${selectedEvent.backgroundImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
              )}
              
              {/* Header Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40" />
              
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 p-3 rounded-full glass-strong text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 group"
              >
                <X className="w-6 h-6 transition-transform group-hover:rotate-90" />
              </button>

              {/* Back Button */}
              <button
                onClick={closeModal}
                className="absolute top-6 left-6 p-3 rounded-full glass-strong text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 group flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                <span className="font-medium">Rudi</span>
              </button>

              {/* Event Title Overlay */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getCategoryColor(selectedEvent.category)} text-white text-sm font-semibold mb-4`}>
                  {getCategoryIcon(selectedEvent.category)}
                  {selectedEvent.category}
                </div>
                <h2 className="text-4xl font-bold text-white font-display leading-tight">
                  {selectedEvent.eventName}
                </h2>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 max-h-[60vh] overflow-y-auto">
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({children}) => <h1 className="text-3xl font-bold text-text-primary mb-6 font-display">{children}</h1>,
                    h2: ({children}) => <h2 className="text-2xl font-semibold text-text-primary mt-8 mb-4 font-display">{children}</h2>,
                    h3: ({children}) => <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">{children}</h3>,
                    p: ({children}) => <p className="text-text-secondary leading-relaxed mb-4">{children}</p>,
                    strong: ({children}) => <strong className="text-text-primary font-semibold">{children}</strong>,
                    em: ({children}) => <em className="text-primary-600 italic">{children}</em>,
                    ul: ({children}) => <ul className="space-y-2 mb-4 ml-6">{children}</ul>,
                    li: ({children}) => <li className="text-text-secondary flex items-start gap-2">
                      <span className="text-primary-500 mt-2">•</span>
                      <span>{children}</span>
                    </li>,
                    blockquote: ({children}) => (
                      <blockquote className="border-l-4 border-primary-400 pl-6 py-4 bg-primary-50 rounded-r-lg my-6 italic text-primary-700">
                        {children}
                      </blockquote>
                    ),
                    hr: () => <hr className="my-8 border-border-light" />
                  }}
                >
                  {selectedEvent.description}
                </ReactMarkdown>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-border-light">
                <button className="btn-primary rounded-xl py-3 px-6 font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2 group">
                  <Calendar className="w-5 h-5" />
                  Ongeza Kalenda
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                
                <button className="btn-secondary rounded-xl py-3 px-6 font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2 group">
                  <Heart className="w-5 h-5" />
                  Pendekezo
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
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
        
        .btn-secondary {
          background: linear-gradient(135deg, #eab308 0%, #f59e0b 50%, #f97316 100%);
          border: none;
          color: white;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .btn-secondary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(234, 179, 8, 0.3);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.9) translateY(20px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default FutureEventsCarousel;