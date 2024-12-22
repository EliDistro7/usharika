'use client';

import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginUser, getCookie } from '@/hooks/useUser'; // Adjust the path based on your file structure

const Form = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // Attempt to log in the user
      const user = await loginUser({
        name: formData.name, // Assuming "name" corresponds to email in your login logic
        password: formData.password,
      });

      setMessage('Umeingia kwa mafanikio!');
      setTimeout(() => {
        router.push(`/akaunti/${getCookie()}`); // Redirect to the user's timeline
      }, 1500);
    } catch (err) {
      setError(err.message || 'Imeshindikana kuingia. Tafadhali jaribu tena.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light px-3">
        <header className="text-center mb-4">
          <h1 className="display-4 text-primary">Fungua akaunti yako</h1>
          <p className="text-muted">Ingia kuendelea</p>
        </header>

        <div className="bg-white p-4 shadow rounded w-100" style={{ maxWidth: '400px' }}>
          <h2 className="text-center mb-4">Akaunti</h2>

          {error && <div className="alert alert-danger text-center">{error}</div>}
          {message && <div className="alert alert-success text-center">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                jina
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`form-control ${error ? 'is-invalid' : ''}`}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Nenosiri
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-control ${error ? 'is-invalid' : ''}`}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? 'Inapakia...' : 'Ingia'}
            </button>
          </form>

          <p className="mt-3 text-center">
            Hauna akaunti?{' '}
            <Link href="/register" className="text-decoration-none text-primary">
              Unda akaunti
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Form;
