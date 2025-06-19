
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
    <div className="px-0 my-5">
    
    
        
          
         
       {/*
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
       
       */}     
      
        
          <div className="mt-0">{renderForm()}</div>
      
      </div>
    
  );
};

export default Usajili;
