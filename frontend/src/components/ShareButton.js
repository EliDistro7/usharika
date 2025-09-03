import React, { useState, useRef, useEffect } from "react";
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, WhatsappIcon } from "react-share";
import { FaInstagram, FaShareAlt } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { ChevronDownIcon } from "lucide-react";

const ShareButton = ({ url, title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleWebShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: title,
          text: `Angalia ${title} kwenye platform yetu!`,
          url: url,
        })
        .then(() => {
          console.log("Content shared successfully!");
          setIsOpen(false);
        })
        .catch((error) => console.error("Error sharing content:", error));
    } else {
      alert("Sharing is not supported on this browser.");
      setIsOpen(false);
    }
  };

  const instagramShareUrl = `https://www.instagram.com/?url=${encodeURIComponent(url)}`;

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          glass-strong rounded-xl px-4 py-2.5
          flex items-center gap-2 
          text-text-primary font-medium text-sm
          hover:bg-white/20 hover:scale-105
          transition-all duration-300 ease-out
          shadow-soft hover:shadow-medium
          border border-white/30
          backdrop-blur-md
        "
      >
        <FaShareAlt className="text-primary-600" size={16} />
        <span>Share</span>
        <ChevronDownIcon 
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="
          absolute top-full left-0 mt-2 z-90
          min-w-[200px] 
          glass-strong rounded-2xl
          border border-white/30
          shadow-strong
          backdrop-blur-md
          animate-slide-down
        ">
          <div className="p-2 space-y-1">
            {/* Web Share Button */}
            <button
              onClick={handleWebShare}
              className="
                w-full text-left px-4 py-3 rounded-xl
                hover:bg-primary-50 hover:bg-opacity-50
                transition-all duration-200
                flex items-center gap-3
                text-text-primary font-medium
                group
              "
            >
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                <FaShareAlt className="text-primary-600" size={14} />
              </div>
              Share Link
            </button>
            
            {/* Social Media Share Buttons */}
            <div className="
              px-4 py-3 rounded-xl
              hover:bg-primary-50 hover:bg-opacity-50
              transition-all duration-200
            ">
              <FacebookShareButton 
                url={url} 
                quote={`Check out ${title} on our platform!`}
                className="w-full flex items-center gap-3 text-text-primary font-medium group"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                  <FacebookIcon size={32} round />
                </div>
                Facebook
              </FacebookShareButton>
            </div>
            
            <div className="
              px-4 py-3 rounded-xl
              hover:bg-primary-50 hover:bg-opacity-50
              transition-all duration-200
            ">
              <TwitterShareButton 
                url={url} 
                title={`Check out ${title} on our platform!`}
                className="w-full flex items-center gap-3 text-text-primary font-medium group"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                  <BsTwitterX className="text-white" size={16} />
                </div>
                Twitter
              </TwitterShareButton>
            </div>
            
            <div className="
              px-4 py-3 rounded-xl
              hover:bg-primary-50 hover:bg-opacity-50
              transition-all duration-200
            ">
              <WhatsappShareButton 
                url={url} 
                title={`Check out ${title} on our platform!`}
                className="w-full flex items-center gap-3 text-text-primary font-medium group"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                  <WhatsappIcon size={32} round />
                </div>
                WhatsApp
              </WhatsappShareButton>
            </div>

            {/* Instagram Share Button */}
            <a
              href={instagramShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="
                w-full text-left px-4 py-3 rounded-xl
                hover:bg-primary-50 hover:bg-opacity-50
                transition-all duration-200
                flex items-center gap-3
                text-text-primary font-medium
                group block
              "
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-500 flex items-center justify-center">
                <FaInstagram className="text-white" size={16} />
              </div>
              Instagram
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareButton;