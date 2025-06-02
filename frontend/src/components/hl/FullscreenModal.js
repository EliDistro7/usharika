import React, { useEffect, memo, useCallback } from "react";
import FadeCarousel from "@/components/FadeCarousel2";
import CarouselItem from "./CarouselItem";
import { Cinzel } from "next/font/google";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["700", "900"],
  display: "swap",
});

const CloseButton = memo(({ onClick, colors }) => (
  <button 
    onClick={onClick}
    style={{
      background: `linear-gradient(135deg, ${colors.secondary}, ${colors.accent})`,
      border: 'none',
      color: colors.surface,
      fontSize: '1.8rem',
      cursor: 'pointer',
      padding: '0.8rem 1.2rem',
      borderRadius: '12px',
      fontWeight: 'bold',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
      minWidth: '48px',
      height: '48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'scale(1.05)';
      e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
    }}
  >
    ×
  </button>
));

CloseButton.displayName = "CloseButton";

const ActionButton = memo(({ onClick, children, colors }) => (
  <button 
    onClick={onClick}
    style={{
      background: `linear-gradient(135deg, ${colors.accent}, ${colors.primary})`,
      color: colors.text,
      border: "none",
      padding: "1rem 3rem",
      borderRadius: "50px",
      fontSize: "1.2rem",
      fontWeight: 700,
      cursor: "pointer",
      textTransform: "uppercase",
      letterSpacing: "1px",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
      position: "relative",
      overflow: "hidden",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.boxShadow = "0 12px 35px rgba(0, 0, 0, 0.25)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.15)";
    }}
  >
    {children}
  </button>
));

ActionButton.displayName = "ActionButton";

const FullscreenModal = ({
  showModal,
  handleModalClose,
  isPaused,
  isMuted,
  toggleMute,
  activeTab,
  content,
  videoRefs,
  setIsPaused,
  title,
  colors,
}) => {
  // Optimized body scroll management
  useEffect(() => {
    if (showModal) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [showModal]);

  // Keyboard event handler
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Escape') {
      handleModalClose();
    }
  }, [handleModalClose]);

  useEffect(() => {
    if (showModal) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [showModal, handleKeyDown]);

  if (!showModal) return null;

  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))',
    backdropFilter: 'blur(20px)',
    animation: 'modalFadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const headerStyle = {
    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
    padding: '1.5rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
  };

  const titleStyle = {
    color: colors.surface,
    fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
    letterSpacing: "2px",
    textTransform: "uppercase",
    margin: 0,
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
  };

  const contentStyle = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  };

  const footerStyle = {
    background: `linear-gradient(135deg, ${colors.primary}dd, ${colors.secondary}dd)`,
    backdropFilter: 'blur(10px)',
    padding: '2rem',
    display: 'flex',
    justifyContent: 'center',
    borderTop: `1px solid rgba(255, 255, 255, 0.1)`,
  };

  return (
    <>
      <div style={modalStyle} className="fullscreen-modal">
        {/* Enhanced Header */}
        <header style={headerStyle}>
          <h1 className={`${cinzel.className}`} style={titleStyle}>
            {title}
          </h1>
          <CloseButton onClick={handleModalClose} colors={colors} />
        </header>
        
        {/* Main Content */}
        <main style={contentStyle}>
          <FadeCarousel 
            isPaused={isPaused} 
            isMuted={isMuted} 
            onToggleMute={toggleMute}
            colors={colors}
            isFullscreen={true}
          >
            {content[activeTab]?.content?.map((item, index) => (
              <CarouselItem
                key={`fullscreen-${activeTab}-${index}`}
                item={item}
                isMuted={isMuted}
                isFullscreen={true}
                videoRef={(el) => (videoRefs.current[index] = el)}
                onPauseCarousel={() => setIsPaused(true)}
                colors={colors}
              />
            ))}
          </FadeCarousel>
        </main>
        
        {/* Enhanced Footer */}
        <footer style={footerStyle}>
          <ActionButton onClick={handleModalClose} colors={colors}>
            FUNGA
          </ActionButton>
        </footer>
      </div>

      <style jsx>{`
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .fullscreen-modal header {
          animation: slideDown 0.5s ease-out 0.1s both;
        }
        
        .fullscreen-modal main {
          animation: modalFadeIn 0.6s ease-out 0.2s both;
        }
        
        .fullscreen-modal footer {
          animation: slideUp 0.5s ease-out 0.3s both;
        }
        
        /* Enhanced scrollbar for webkit browsers */
        .fullscreen-modal ::-webkit-scrollbar {
          width: 8px;
        }
        
        .fullscreen-modal ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        
        .fullscreen-modal ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
          border-radius: 4px;
        }
        
        .fullscreen-modal ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, ${colors.secondary}, ${colors.accent});
        }
      `}</style>
    </>
  );
};

export default memo(FullscreenModal);