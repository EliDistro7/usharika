'use client';

import React, { useState } from 'react';
import { BsArrowUp } from 'react-icons/bs';
import MapEmbed from '../../components/Map';
import { AttentionSeeker } from 'react-awesome-reveal';

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
    <div>
      <section className="container py-5">
        <div className="row">
          <div className="col-md-6 mb-4">
            <h6 className="text-primary text-uppercase fw-bold mb-2">Wasiliana Nasi</h6>
            <h1 className="display-5 fw-bold mb-4">Tuwasiliane kwa Maswali Yoyote</h1>

            {status && (
              <AttentionSeeker effect="bounce" duration={500}>
                <div
                  className={`alert ${
                    status === 'success' ? 'alert-success' : 'alert-danger'
                  } text-center`}
                  role="alert"
                >
                  {status === 'success'
                    ? 'Ujumbe umetumwa kwa mafanikio!'
                    : 'Kumetokea hitilafu wakati wa kutuma ujumbe wako.'}
                </div>
              </AttentionSeeker>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Jina Lako
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control"
                  placeholder="Ingiza jina lako"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Barua Pepe
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  placeholder="Ingiza barua pepe yako"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="subject" className="form-label">
                  Mada
                </label>
                <input
                  type="text"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="form-control"
                  placeholder="Ingiza mada ya ujumbe"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="message" className="form-label">
                  Ujumbe
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="form-control"
                  rows={5}
                  placeholder="Andika ujumbe wako hapa"
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary w-100">
                {loading ? 'Inatuma...' : 'Tuma Ujumbe'}
              </button>
            </form>
          </div>

          <div className="col-md-6">
            <MapEmbed />
          </div>
        </div>
      </section>

      <a
        href="#"
        className="btn btn-primary btn-lg rounded-circle position-fixed bottom-0 end-0 m-4"
        style={{ width: '60px', height: '60px' }}
      >
        <BsArrowUp size={24} />
      </a>
    </div>
  );
};

export default ContactPage;
