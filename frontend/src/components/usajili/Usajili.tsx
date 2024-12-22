
'use client';

import React, { useState } from 'react';
import Msharika from './Msharika';
import Ubatizo from './Ubatizo';
import Kipaimara from './Kipaimara';
import Kwaya from './Kwaya';

const Usajili: React.FC = () => {
  const [activeForm, setActiveForm] = useState<string>('msharika');

  const renderForm = () => {
    switch (activeForm) {
      case 'msharika':
        return <Msharika />;
      case 'ubatizo':
        return <Ubatizo />;
      case 'kipaimara':
        return <Kipaimara />;
      case 'kwaya':
        return <Kwaya />;
      default:
        return <Msharika />;
    }
  };

  return (
    <div className="container my-5">
      <div className="card shadow">
        <div className="card-header bg-dark text-white">
          <h3 className="text-center mb-0">Fomu za Usajili</h3>
        </div>
        <div className="card-body">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${activeForm === 'msharika' ? 'active' : ''}`}
                onClick={() => setActiveForm('msharika')}
              >
                Usajili wa Msharika
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeForm === 'ubatizo' ? 'active' : ''}`}
                onClick={() => setActiveForm('ubatizo')}
              >
                Usajili wa Ubatizo
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeForm === 'kipaimara' ? 'active' : ''}`}
                onClick={() => setActiveForm('kipaimara')}
              >
                Usajili wa Kipaimara
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeForm === 'kwaya' ? 'active' : ''}`}
                onClick={() => setActiveForm('kwaya')}
              >
                Kujiunga na Kwaya
              </button>
            </li>
          </ul>
          <div className="mt-4">{renderForm()}</div>
        </div>
      </div>
    </div>
  );
};

export default Usajili;
