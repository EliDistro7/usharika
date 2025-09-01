import React from 'react';
import { MapPin } from 'lucide-react';

const MapEmbed = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 my-20">
      <div className="flex justify-center">
        <div className="w-full max-w-4xl">
          <div className="bg-white border border-primary-200 shadow-primary rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white text-center py-4 px-6">
              <h5 className="text-lg font-display font-semibold mb-0 flex items-center justify-center gap-2">
                <MapPin className="w-5 h-5" />
                Kanisa letu lipo Yombo Kuu, Dar es Salaam, Tanzania
              </h5>
            </div>

            {/* Map Container with Enhanced Styling */}
            <div className="relative aspect-video bg-background-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7922.434525639529!2d39.23515454921658!3d-6.864547184937864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x185c4a001f086fdb%3A0x8bf3060642c53afa!2sKanisa%20La%20Kiinjili%20La%20Kilutheri%20Ushirika%20Wa%20Yombo!5e0!3m2!1ssw!2stz!4v1732767341144!5m2!1ssw!2stz"    
                width="100%" 
                height="100%" 
                allowFullScreen
                aria-hidden="false"
                tabIndex={0}
                loading="lazy"
                className="absolute inset-0 w-full h-full border-0"
                style={{ filter: 'contrast(1.1) saturate(1.1)' }}
              />

              {/* Loading State Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-background-300 animate-pulse">
                <div className="flex flex-col items-center space-y-3 text-text-secondary">
                  <MapPin className="w-8 h-8 animate-gentle-float text-primary-500" />
                  <span className="text-sm font-medium">Inapakia ramani...</span>
                </div>
              </div>

              {/* Decorative Corner Elements */}
              <div className="absolute top-0 left-0 w-3 h-3 bg-primary-400 opacity-20"></div>
              <div className="absolute top-0 right-0 w-3 h-3 bg-primary-400 opacity-20"></div>
              <div className="absolute bottom-0 left-0 w-3 h-3 bg-primary-400 opacity-20"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary-400 opacity-20"></div>
            </div>

            {/* Footer with Additional Info */}
            <div className="bg-background-100 border-t border-border-light px-6 py-4">
              <div className="flex items-center justify-center text-sm text-text-secondary">
                <MapPin className="w-4 h-4 mr-2 text-primary-500" />
                <span className="font-medium">
                  Karibu sana kwenye huduma za kiroho za Kanisa letu
                </span>
              </div>
            </div>
          </div>

          {/* Additional Location Details */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-soft border border-border-light text-center hover:shadow-medium transition-all duration-300">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-primary-600" />
              </div>
              <h6 className="font-semibold text-text-primary mb-1">Mahali</h6>
              <p className="text-sm text-text-secondary">Yombo Kuu, Dar es Salaam</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-soft border border-border-light text-center hover:shadow-medium transition-all duration-300">
              <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-6 h-6 bg-success-500 rounded-full animate-pulse-soft"></div>
              </div>
              <h6 className="font-semibold text-text-primary mb-1">Hali</h6>
              <p className="text-sm text-success-600 font-medium">Wazi</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-soft border border-border-light text-center hover:shadow-medium transition-all duration-300">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-6 h-6 text-yellow-600 font-bold text-sm flex items-center justify-center">24/7</div>
              </div>
              <h6 className="font-semibold text-text-primary mb-1">Ufikiaji</h6>
              <p className="text-sm text-text-secondary">Kila wakati</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapEmbed;