'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Form as BootstrapForm, Button, InputGroup, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  const [showPassword, setShowPassword] = useState(false);
  const [showNambaModal, setShowNambaModal] = useState(false);
  const [nambaYaAhadi, setNambaYaAhadi] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showCodePrompt, setShowCodePrompt] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleNambaSubmit = () => {
    if (!nambaYaAhadi) {
      toast.error('Tafadhali jaza namba ya ahadi.');
      return;
    }

    setShowNambaModal(false);
    toast.success('Tumetuma code kwenye namba yako.');
    setShowCodePrompt(true); // Show the code prompt after sending
  };

  const handleCodeSubmit = () => {
    if (!verificationCode) {
      toast.error('Tafadhali jaza msimbo uliopewa.');
      return;
    }

    toast.success('code imethibitishwa. Tafadhali badilisha password yako.');
    setShowCodePrompt(false); // Hide code prompt after successful verification
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const user = await loginUser({
        name: formData.name,
        password: formData.password,
      });
      toast.success('Umeingia kwa mafanikio!');
   
      setTimeout(() => {
        router.push(`/akaunti/${getCookie()}`);
      }, 1200);
    } catch (err) {
      toast.error(err.message || 'Imeshindikana kuingia. Tafadhali jaribu tena.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light-purple px-3" style={{ backgroundColor: '#f3e8ff' }}>
      <header className="text-center mb-4">
        <h1 className="display-4" style={{ color: '#6a0dad' }}>Fungua akaunti yako</h1>
        <p className="text-muted">Ingia kuendelea</p>
      </header>
  
      <div className="p-4 shadow rounded w-100" style={{ maxWidth: '400px', backgroundColor: 'white' }}>
        <h2 className="text-center mb-4" style={{ color: '#6a0dad' }}>Akaunti</h2>
  
        {error && <div className="alert alert-danger text-center">{error}</div>}
        {message && <div className="alert alert-success text-center">{message}</div>}
  
        <BootstrapForm onSubmit={handleSubmit}>
          <BootstrapForm.Group className="mb-3">
            <BootstrapForm.Label htmlFor="name" style={{ color: '#6a0dad' }}>Jina</BootstrapForm.Label>
            <BootstrapForm.Control
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              isInvalid={!!error}
              required
            />
          </BootstrapForm.Group>
  
          <BootstrapForm.Group className="mb-3">
            <BootstrapForm.Label htmlFor="password" style={{ color: '#6a0dad' }}>Nenosiri</BootstrapForm.Label>
            <InputGroup>
              <BootstrapForm.Control
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                isInvalid={!!error}
                required
              />
              <Button
                variant="outline-light"
                style={{ color: '#6a0dad', borderColor: '#6a0dad' }}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? 'Ficha' : 'Onyesha'}
              </Button>
            </InputGroup>
          </BootstrapForm.Group>
  
          <Button
            type="submit"
            style={{ backgroundColor: '#6a0dad', borderColor: '#6a0dad' }}
            className="w-100 text-white"
            disabled={loading}
          >
            {loading ? 'Inapakia...' : 'Ingia'}
          </Button>
  
          <Button
            variant="link"
            className="w-100 mt-2 text-decoration-none"
            style={{ color: '#6a0dad' }}
            onClick={() => setShowNambaModal(true)}
          >
            Umesahau password?
          </Button>
        </BootstrapForm>
  
        <p className="mt-3 text-center">
          Hauna akaunti?{' '}
          <Link href="/usajili" className="text-decoration-none" style={{ color: '#6a0dad' }}>
            Unda akaunti
          </Link>
        </p>
      </div>
  
      <Modal show={showNambaModal} onHide={() => setShowNambaModal(false)}>
        <Modal.Header closeButton style={{ backgroundColor: '#f3e8ff' }}>
          <Modal.Title style={{ color: '#6a0dad' }}>Ingiza Namba ya Ahadi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BootstrapForm.Group>
            <BootstrapForm.Label style={{ color: '#6a0dad' }}>Namba ya Ahadi</BootstrapForm.Label>
            <BootstrapForm.Control
              type="text"
              value={nambaYaAhadi}
              onChange={(e) => setNambaYaAhadi(e.target.value)}
              placeholder="Ingiza namba ya ahadi yako"
            />
          </BootstrapForm.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNambaModal(false)}>
            Funga
          </Button>
          <Button style={{ backgroundColor: '#6a0dad', borderColor: '#6a0dad' }} onClick={handleNambaSubmit}>
            Tuma Msimbo
          </Button>
        </Modal.Footer>
      </Modal>
  
      {showCodePrompt && (
        <Modal show={showCodePrompt} onHide={() => setShowCodePrompt(false)}>
          <Modal.Header closeButton style={{ backgroundColor: '#f3e8ff' }}>
            <Modal.Title style={{ color: '#6a0dad' }}>Ingiza Msimbo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <BootstrapForm.Group>
              <BootstrapForm.Label style={{ color: '#6a0dad' }}>Msimbo Uliopewa</BootstrapForm.Label>
              <BootstrapForm.Control
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Ingiza msimbo hapa"
              />
            </BootstrapForm.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCodePrompt(false)}>
              Funga
            </Button>
            <Button style={{ backgroundColor: '#6a0dad', borderColor: '#6a0dad' }} onClick={handleCodeSubmit}>
              Thibitisha
            </Button>
          </Modal.Footer>
        </Modal>
      )}
  
      <ToastContainer position="top-center" autoClose={5000} />
    </div>
  );
};

export default Form;
