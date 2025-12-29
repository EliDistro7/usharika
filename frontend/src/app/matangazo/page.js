'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Download, Eye, Search, Filter, ChevronRight, Bell, Clock, Tag, Share2, Bookmark } from 'lucide-react';

// Simulated API endpoint - replace with your actual endpoint
const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER || 'http://localhost:5000';

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [filteredNotices, setFilteredNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [stats, setStats] = useState(null);

  const categories = [
    { value: 'all', label: 'Zote', icon: '📋', color: 'primary' },
    { value: 'tangazo', label: 'Matangazo', icon: '📢', color: 'primary' },
    { value: 'fomu', label: 'Fomu', icon: '📝', color: 'lavender' },
    { value: 'barua', label: 'Barua Rasmi', icon: '✉️', color: 'peaceful' },
    { value: 'taarifa', label: 'Taarifa', icon: '📰', color: 'gold' },
    { value: 'matukio', label: 'Matukio', icon: '🎉', color: 'rose' },
    { value: 'ibada', label: 'Ratiba za Ibada', icon: '⛪', color: 'lavender' },
    { value: 'mafundisho', label: 'Mafundisho', icon: '📖', color: 'peaceful' }
  ];

  useEffect(() => {
    fetchNotices();
    fetchStats();
  }, []);

  useEffect(() => {
    filterNotices();
  }, [searchTerm, selectedCategory, notices]);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/pdfs?status=active`);
      const data = await response.json();
      if (data.success) {
        setNotices(data.data);
        setFilteredNotices(data.data);
      }
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pdfs/stats`);
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const filterNotices = () => {
    let filtered = notices;
    
    if (searchTerm) {
      filtered = filtered.filter(notice => 
        notice.fileName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(notice => notice.category === selectedCategory);
    }
    
    setFilteredNotices(filtered);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('sw-TZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryConfig = (category) => {
    return categories.find(c => c.value === category) || categories[0];
  };

  return (
    <div className="min-h-screen bg-reverent-gradient">
      {/* Hero Section with Christmas Decorations */}
      <div className="relative overflow-hidden text-white" style={{
        background: 'linear-gradient(135deg, #991b1b 0%, #166534 25%, #b91c1c 50%, #15803d 75%, #991b1b 100%)',
        backgroundSize: '200% 200%',
        animation: 'christmas-bg 10s ease infinite'
      }}>
        {/* Falling Snow Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="snowflake"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${6 + Math.random() * 10}s`,
                fontSize: `${10 + Math.random() * 14}px`,
                opacity: 0.6 + Math.random() * 0.4
              }}
            >
              ❄
            </div>
          ))}
        </div>

        {/* Christmas Lights Top Border */}
        <div className="absolute top-0 left-0 right-0 h-3 flex justify-around z-20">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="christmas-light"
              style={{
                animationDelay: `${i * 0.08}s`,
                backgroundColor: ['#ef4444', '#22c55e', '#eab308', '#3b82f6', '#ec4899'][i % 5]
              }}
            />
          ))}
        </div>

        {/* Festive Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
        </div>

        {/* Festive Overlay Text - Merry Christmas */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-5 overflow-hidden">
          <div className="festive-text text-6xl md:text-8xl font-black opacity-80 select-none text-white/80">
            🎉 Happy New Year 2026 🎊
          </div>
        </div>
        
        {/* Festive Overlay Text - Happy New Year */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-5 overflow-hidden">
          <div 
            className="festive-text-alt text-6xl md:text-8xl font-black opacity-80 select-none text-white/80"
            style={{animationDelay: '5s'}}
          > 🎄 Merry Christmas 🎄
           
          </div>
        </div>

        {/* Christmas Ornaments - Floating Decorations */}
        <div className="absolute top-10 left-10 animate-swing" style={{animationDelay: '0s'}}>
          <div className="text-5xl opacity-80 drop-shadow-lg">🎄</div>
        </div>
        <div className="absolute top-20 right-16 animate-swing" style={{animationDelay: '1s'}}>
          <div className="text-4xl opacity-80 drop-shadow-lg">⭐</div>
        </div>
        <div className="absolute top-32 left-1/4 animate-swing" style={{animationDelay: '0.5s'}}>
          <div className="text-3xl opacity-70 drop-shadow-lg">🎁</div>
        </div>
        <div className="absolute top-24 right-1/3 animate-swing" style={{animationDelay: '1.5s'}}>
          <div className="text-4xl opacity-75 drop-shadow-lg">🎅</div>
        </div>
        <div className="absolute top-40 right-20 animate-swing" style={{animationDelay: '2s'}}>
          <div className="text-3xl opacity-70 drop-shadow-lg">🔔</div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-15">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full mb-6 animate-pulse-soft shadow-2xl border-4 border-white/30">
              <Bell className="w-12 h-12 animate-ring" />
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-4 animate-slide-up drop-shadow-2xl">
              Ubao wa Matangazo
            </h1>
            <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto animate-slide-up drop-shadow-lg" style={{animationDelay: '0.1s'}}>
              Taarifa na matangazo ya Kanisa
            </p>
            
            {/* Christmas Ribbon Decoration */}
            <div className="mt-8 flex items-center justify-center gap-4 animate-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="h-1 w-20 bg-gradient-to-r from-transparent via-red-300 to-green-300 rounded-full"></div>
              <div className="text-4xl animate-bounce-gentle">🎄</div>
              <div className="h-1 w-20 bg-gradient-to-r from-green-300 via-red-300 to-transparent rounded-full"></div>
            </div>
          </div>
        </div>
        
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#FAF5FF"></path>
          </svg>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="rounded-3xl shadow-primary-lg p-4 backdrop-blur-lg border bg-white/95">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full whitespace-nowrap transition-all duration-300 font-medium ${
                  selectedCategory === cat.value
                    ? `bg-${cat.color}-gradient text-white shadow-${cat.color} scale-105`
                    : 'bg-background-100 text-text-secondary hover:bg-background-200 hover:scale-105'
                }`}
              >
                <span className="text-xl">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-text-tertiary" size={24} />
          <input
            type="text"
            placeholder="Tafuta tangazo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-6 py-5 rounded-2xl bg-white border-2 border-border-light focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100 text-lg shadow-soft transition-all duration-300"
          />
        </div>
      </div>

      {/* Notices Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
            <p className="mt-4 text-text-secondary text-lg">Inapakia matangazo...</p>
          </div>
        ) : filteredNotices.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-soft">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-display font-bold text-text-primary mb-2">
              Hakuna Matangazo
            </h3>
            <p className="text-text-secondary">
              {searchTerm ? 'Hakuna matokeo ya utafutaji wako' : 'Hakuna matangazo kwa sasa'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNotices.map((notice, index) => {
              const categoryConfig = getCategoryConfig(notice.category);
              return (
                <div
                  key={notice._id}
                  className="group bg-white rounded-3xl shadow-soft hover:shadow-primary-lg transition-all duration-500 overflow-hidden border border-border-light hover:border-primary-300 hover:-translate-y-2 animate-fade-in cursor-pointer"
                  style={{animationDelay: `${index * 0.1}s`}}
                  onClick={() => setSelectedNotice(notice)}
                >
                  {/* Category Banner */}
                  <div className={`bg-${categoryConfig.color}-gradient p-4 relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImRvdHMiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IndoaXRlIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2RvdHMpIi8+PC9zdmc+')]"></div>
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{categoryConfig.icon}</span>
                        <div>
                          <div className="text-white/90 text-sm font-medium">{categoryConfig.label}</div>
                          {notice.mimeType === 'text/html' && (
                            <div className="text-white/70 text-xs">Rich Text</div>
                          )}
                        </div>
                      </div>
                      <div className="text-white/80 text-xs flex items-center gap-1">
                        <Clock size={14} />
                        <span>{formatDate(notice.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-display font-bold text-text-primary mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {notice.fileName}
                    </h3>
                    
                    {notice.description && (
                      <p className="text-text-secondary mb-4 line-clamp-3 leading-relaxed">
                        {notice.description}
                      </p>
                    )}

                    {/* Tags */}
                    {notice.tags && notice.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {notice.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-lavender-50 text-lavender-700 rounded-full text-xs font-medium"
                          >
                            <Tag size={12} />
                            {tag}
                          </span>
                        ))}
                        {notice.tags.length > 3 && (
                          <span className="inline-flex items-center px-3 py-1 bg-background-200 text-text-tertiary rounded-full text-xs">
                            +{notice.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-text-tertiary mb-4 pb-4 border-b border-border-light">
                      <div className="flex items-center gap-1">
                        <Eye size={16} />
                        <span>{notice.viewCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download size={16} />
                        <span>{notice.downloadCount}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-gradient text-white rounded-xl hover:shadow-primary transition-all duration-300 font-medium">
                        <Eye size={18} />
                        <span>Angalia</span>
                      </button>
                      {notice.mimeType === 'application/pdf' && (
                        <a
                          href={notice.cloudinaryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-peaceful-50 text-peaceful-600 rounded-xl hover:bg-peaceful-100 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Download size={20} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-primary-lg animate-scale-in">
            {/* Modal Header */}
            <div className={`bg-${getCategoryConfig(selectedNotice.category).color}-gradient p-8 relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9InBhdHRlcm4iIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0id2hpdGUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiLz48L3N2Zz4=')]"></div>
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-5xl">{getCategoryConfig(selectedNotice.category).icon}</span>
                    <div>
                      <div className="text-white text-sm font-medium">{getCategoryConfig(selectedNotice.category).label}</div>
                      <div className="text-white/80 text-xs flex items-center gap-1 mt-1">
                        <Calendar size={12} />
                        {formatDate(selectedNotice.createdAt)}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedNotice(null)}
                    className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                <h2 className="text-3xl font-display font-bold text-white mb-2">
                  {selectedNotice.fileName}
                </h2>
                {selectedNotice.description && (
                  <p className="text-white/90 text-lg">
                    {selectedNotice.description}
                  </p>
                )}
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 overflow-y-auto max-h-[60vh]">
              {selectedNotice.mimeType === 'text/html' ? (
                <div
                  className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-text-primary prose-p:text-text-secondary prose-a:text-primary-600 prose-strong:text-text-primary"
                  dangerouslySetInnerHTML={{ __html: selectedNotice.metadata?.content }}
                />
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-50 rounded-full mb-4">
                    <Download className="w-10 h-10 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">PDF Document</h3>
                  <p className="text-text-secondary mb-6">Bonyeza kifungo cha chini kupakua hati</p>
                  <a
                    href={selectedNotice.cloudinaryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-primary-gradient text-white rounded-xl hover:shadow-primary-lg transition-all duration-300 font-medium"
                  >
                    <Download size={20} />
                    Pakua PDF
                  </a>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-border-light bg-background-50 flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-text-tertiary">
                <div className="flex items-center gap-1">
                  <Eye size={16} />
                  <span>{selectedNotice.viewCount} maoni</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download size={16} />
                  <span>{selectedNotice.downloadCount} vipakuliwa</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedNotice(null)}
                className="px-6 py-3 bg-primary-gradient text-white rounded-xl hover:shadow-primary transition-all duration-300 font-medium"
              >
                Funga
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-20px) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(50px) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes twinkle-lights {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1);
            box-shadow: 0 0 10px currentColor;
          }
          50% { 
            opacity: 0.3; 
            transform: scale(0.7);
            box-shadow: 0 0 5px currentColor;
          }
        }

        @keyframes festive-fade {
          0%, 100% { 
            opacity: 0.06; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.12; 
            transform: scale(1.02);
          }
        }

        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes swing {
          0%, 100% { 
            transform: rotate(-5deg); 
          }
          50% { 
            transform: rotate(5deg); 
          }
        }

        @keyframes ring {
          0%, 100% { transform: rotate(0deg); }
          10% { transform: rotate(-15deg); }
          20% { transform: rotate(15deg); }
          30% { transform: rotate(-10deg); }
          40% { transform: rotate(10deg); }
          50% { transform: rotate(0deg); }
        }

        .snowflake {
          position: absolute;
          top: -20px;
          color: white;
          animation: snowfall linear infinite;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.9), 0 0 20px rgba(255, 255, 255, 0.6);
          user-select: none;
        }

        .christmas-light {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          animation: twinkle-lights 1.5s ease-in-out infinite;
        }

        .festive-text {
          animation: festive-fade 10s ease-in-out infinite;
          user-select: none;
        }

        .festive-text-alt {
          animation: festive-fade 10s ease-in-out infinite;
          user-select: none;
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }

        .animate-swing {
          animation: swing 3s ease-in-out infinite;
          transform-origin: top center;
        }

        .animate-ring {
          animation: ring 2s ease-in-out infinite;
        }

        .animate-pulse-soft {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }

        @keyframes christmas-bg {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}

export default NoticeBoard;