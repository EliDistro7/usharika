import React, { useEffect, useState } from "react";
import { fetchUsersBornThisMonth } from "@/actions/users";

const formatDate = (dob) => {
  const date = new Date(dob);
  return date.toLocaleDateString("en-US", { day: "numeric", month: "long" });
};

const UserCards = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchUsersBornThisMonth();
        setUsers(data.users || []);
      } catch (err) {
        setError("Failed to load users.");
      } finally {
        setLoading(false);
        setTimeout(() => setIsVisible(true), 100);
      }
    };
    getUsers();
  }, []);

  // Mouse tracking for parallax effect
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

  const FloatingElement = ({ emoji, index, size = "text-2xl" }) => (
    <div
      className={`absolute ${size} opacity-60 animate-gentle-float pointer-events-none`}
      style={{
        left: `${10 + index * 12}%`,
        top: `${15 + index * 10}%`,
        transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.01}px)`,
        animationDelay: `${index * 0.5}s`,
        animationDuration: `${6 + index * 1.5}s`
      }}
    >
      {emoji}
    </div>
  );

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
        <p className="text-text-primary text-lg font-medium">
          Loading birthday celebrations... 🎉
        </p>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="text-center p-8 bg-white rounded-3xl border border-border-light shadow-soft">
      <div className="text-6xl mb-4">🎈</div>
      <h4 className="text-text-primary text-xl font-bold mb-2">
        Hakuna Birthdays kwa mwezi huu
      </h4>
      <p className="text-text-secondary">
        Looks like we'll have to wait for next month's celebrations!
      </p>
    </div>
  );

  const ErrorState = () => (
    <div className="text-center p-6 bg-gradient-to-br from-error-50 to-error-100 rounded-3xl border-2 border-error-200 shadow-soft">
      <div className="text-4xl mb-2">😔</div>
      <p className="text-error-700 font-medium">{error}</p>
    </div>
  );

  const BirthdayCard = ({ user, index }) => (
    <div
      className="group"
      style={{
        transform: isVisible ? 'scale(1)' : 'scale(0.9)',
        opacity: isVisible ? 1 : 0,
        transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${0.1 + index * 0.1}s`
      }}
    >
      <div className="relative bg-white rounded-3xl border border-border-light shadow-soft hover:shadow-primary-lg transition-all duration-500 hover:-translate-y-2 hover:scale-105 overflow-hidden h-full backdrop-blur-sm">
        
        {/* Decorative background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-purple-50/30 to-yellow-50/50 opacity-60 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-200/20 to-transparent rounded-full -translate-y-6 translate-x-6"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-yellow-200/20 to-transparent rounded-full translate-y-6 -translate-x-6"></div>

        {/* Profile Image Container */}
        <div className="relative overflow-hidden rounded-t-3xl h-56">
          <img
            src={user.profilePicture || "https://via.placeholder.com/400x300?text=🎂"}
            alt={user.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Image overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

          {/* Birthday badge */}
          <div className="absolute top-4 right-4 glass rounded-2xl px-3 py-2 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎈</span>
              <span className="text-primary-700 font-semibold text-sm">Birthday</span>
            </div>
          </div>

          {/* Floating celebration elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {['✨', '🎊', '⭐'].map((emoji, i) => (
              <div
                key={i}
                className="absolute text-xl opacity-0 group-hover:opacity-70 transition-all duration-700"
                style={{
                  left: `${20 + i * 25}%`,
                  top: `${20 + i * 15}%`,
                  transform: `translate(${Math.sin(i) * 10}px, ${Math.cos(i) * 10}px)`,
                  animationDelay: `${i * 0.2}s`
                }}
              >
                <div className="animate-bounce">{emoji}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Card Content */}
        <div className="relative p-6 z-10">
          {/* Name */}
          <h3 className="text-xl font-bold text-text-primary mb-4 text-center font-display">
            {user.name}
          </h3>

          {/* Birthday Date */}
          <div className="flex items-center justify-center mb-4">
            <div className="inline-flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-primary-50 to-purple-50 border border-primary-200 rounded-2xl">
              <span className="text-lg">🗓️</span>
              <span className="text-primary-700 font-semibold">
                {formatDate(user.dob)}
              </span>
            </div>
          </div>

          {/* Celebration elements */}
          <div className="flex justify-center items-center gap-3">
            {['🎂', '🎉', '🎁'].map((emoji, i) => (
              <div
                key={i}
                className="w-10 h-10 bg-gradient-to-br from-yellow-50 to-primary-50 rounded-xl border border-yellow-200 flex items-center justify-center transition-transform duration-300 hover:scale-110 hover:rotate-12"
                style={{
                  animation: `bounce ${1.2 + i * 0.2}s ease-in-out infinite`,
                  animationDelay: `${i * 0.1}s`
                }}
              >
                <span className="text-lg">{emoji}</span>
              </div>
            ))}
          </div>

          {/* Interactive hover effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-purple-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"></div>
        </div>

        {/* Card border glow effect */}
        <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-primary-200/50 via-purple-200/50 to-yellow-200/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
      </div>
    </div>
  );

  return (
    <div 
      className="relative min-h-screen overflow-hidden transition-all duration-300 ease-out pt-8 pb-16"
      style={{
        background: `
          radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
            rgba(107, 70, 193, 0.08) 0%, 
            transparent 50%
          ),
          linear-gradient(135deg, 
            #fefefe 0%, 
            #fdfdfd 25%, 
            #fafafb 50%, 
            #f7f8fa 75%, 
            #f3f4f7 100%
          )
        `
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Birthday Elements */}
        {['🎂', '🎉', '🎈', '🎁', '🌟', '✨', '🎊', '💝'].map((emoji, i) => (
          <FloatingElement key={i} emoji={emoji} index={i} />
        ))}

        {/* Decorative Circles */}
        <div 
          className="absolute top-1/5 right-[15%] w-36 h-36 opacity-30"
          style={{
            background: `conic-gradient(from 0deg, transparent, rgba(107, 70, 193, 0.15), transparent)`,
            borderRadius: "50%",
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`,
            animation: "spin 25s linear infinite"
          }}
        />
        
        <div 
          className="absolute bottom-1/5 left-[10%] w-30 h-30 opacity-20"
          style={{
            background: `linear-gradient(45deg, transparent, rgba(168, 85, 247, 0.1), transparent)`,
            borderRadius: "40%",
            transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * 0.01}px)`,
            animation: "spin 20s linear infinite reverse"
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div 
          className="text-center mb-12"
          style={{
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            opacity: isVisible ? 1 : 0,
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {/* Birthday Badge */}
          <div className="inline-block px-6 py-3 bg-gradient-to-r from-primary-100 to-purple-100 border-2 border-primary-200 rounded-full mb-6 glass">
            <span className="text-primary-700 font-semibold text-sm uppercase tracking-wider">
              🎈 Birthday Celebration
            </span>
          </div>

          {/* Main Title */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-primary-gradient bg-clip-text text-transparent font-display leading-tight">
            🎂 Birthdays Mwezi huu 🎉
            
            {/* Decorative Underline */}
            <div className="w-32 h-1 bg-primary-gradient rounded-full mx-auto mt-4 opacity-70"></div>
          </h2>

          {/* Decorative Elements */}
          <div className="flex justify-center gap-4 mb-6">
            {['🎈', '🎂', '🎉'].map((emoji, i) => (
              <div
                key={i}
                className="w-12 h-12 bg-white rounded-2xl border-2 border-primary-200 flex items-center justify-center text-2xl shadow-soft hover:shadow-primary transition-all duration-300 hover:-translate-y-1"
                style={{
                  animation: `bounce ${1.5 + i * 0.3}s ease-in-out infinite`
                }}
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>

        {/* Content States */}
        {loading && <LoadingSpinner />}
        {error && <ErrorState />}
        {!loading && !error && users.length === 0 && <EmptyState />}

        {/* Users Grid */}
        {!loading && !error && users.length > 0 && (
          <div
            style={{
              transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
              opacity: isVisible ? 1 : 0,
              transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.3s'
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              {users.map((user, index) => (
                <BirthdayCard key={user._id} user={user} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Bottom Decoration */}
        {!loading && users.length > 0 && (
          <div 
            className="text-center mt-12 pt-8"
            style={{
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              opacity: isVisible ? 1 : 0,
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 1s'
            }}
          >
            <div className="flex justify-center items-center gap-6 mb-4">
              <div className="w-16 h-1 bg-primary-gradient rounded-full opacity-70"></div>
              <span className="text-2xl animate-pulse">🎈</span>
              <div className="w-16 h-1 bg-primary-gradient rounded-full opacity-70"></div>
            </div>
            <p className="text-text-secondary font-medium max-w-2xl mx-auto">
              Usharika unamtakia kila mmoja wenu heri njema ya kumbukumbu ya siku ya kuzaliwa! 🎉
            </p>
          </div>
        )}
      </div>

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes bounce {
          0%, 100% { 
            transform: translateY(0); 
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% { 
            transform: translateY(-25%); 
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }
      `}</style>
    </div>
  );
};

export default UserCards;