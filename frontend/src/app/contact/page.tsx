'use client';

import React, { useState } from 'react';
import { ArrowUp, Send, User, Mail, MessageSquare, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import MapEmbed from '../../components/Map';

const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'success' | 'error' | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (response.ok) {
        setStatus('success');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-200">
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form Section */}
          <div className="animate-fade-in">
            <div className="mb-8">
              <h6 className="text-primary-600 text-sm font-bold uppercase tracking-wider mb-3">
                Wasiliana Nasi
              </h6>
              <h1 className="text-4xl lg:text-5xl font-display font-bold text-text-primary mb-6">
                Tuwasiliane kwa Maswali Yoyote
              </h1>
            </div>

            {/* Status Messages */}
            {status && (
              <div className={`mb-6 animate-scale-in ${
                status === 'success' 
                  ? 'bg-success-50 border-success-500 text-success-700' 
                  : 'bg-error-50 border-error-500 text-error-700'
              } border-l-4 p-4 rounded-r-lg shadow-soft`}>
                <div className="flex items-center">
                  {status === 'success' ? (
                    <CheckCircle className="w-5 h-5 mr-3 text-success-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 mr-3 text-error-600" />
                  )}
                  <span className="font-medium">
                    {status === 'success'
                      ? 'Ujumbe umetumwa kwa mafanikio!'
                      : 'Kumetokea hitilafu wakati wa kutuma ujumbe wako.'}
                  </span>
                </div>
              </div>
            )}

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="bg-white p-8 shadow-medium rounded-2xl border border-border-light">
              <div className="space-y-6">
                {/* Name Field */}
                <div className="relative">
                  <label htmlFor="name" className="block text-sm font-semibold text-text-primary mb-2">
                    Jina Lako
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-border-default rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-text-primary placeholder-text-tertiary"
                      placeholder="Ingiza jina lako"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="relative">
                  <label htmlFor="email" className="block text-sm font-semibold text-text-primary mb-2">
                    Barua Pepe
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-border-default rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-text-primary placeholder-text-tertiary"
                      placeholder="Ingiza barua pepe yako"
                      required
                    />
                  </div>
                </div>

                {/* Subject Field */}
                <div className="relative">
                  <label htmlFor="subject" className="block text-sm font-semibold text-text-primary mb-2">
                    Mada
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                    <input
                      type="text"
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-border-default rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-text-primary placeholder-text-tertiary"
                      placeholder="Ingiza mada ya ujumbe"
                      required
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div className="relative">
                  <label htmlFor="message" className="block text-sm font-semibold text-text-primary mb-2">
                    Ujumbe
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-4 w-5 h-5 text-text-tertiary" />
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-border-default rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-text-primary placeholder-text-tertiary resize-none"
                      rows={5}
                      placeholder="Andika ujumbe wako hapa"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-4 px-6 rounded-xl font-semibold text-white flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Inatuma...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                      <span>Tuma Ujumbe</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Map Section */}
          <div className="animate-fade-in lg:animate-slide-up">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-medium overflow-hidden border border-border-light">
                <div className="h-96 lg:h-[500px]">
                  <MapEmbed />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      <a
        href="#"
        className="fixed bottom-6 right-6 btn-primary w-14 h-14 rounded-full flex items-center justify-center shadow-primary-lg hover:shadow-primary z-50 group"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        <ArrowUp className="w-6 h-6 text-white group-hover:-translate-y-1 transition-transform duration-200" />
      </a>
    </div>
  );
};

export default ContactPage;