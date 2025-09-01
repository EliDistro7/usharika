'use client';
import React from 'react';
import { Plus, Minus, Users, User, Calendar, Heart, Info } from 'lucide-react';

const DependentsForm = ({ dependents, onDependentsChange }) => {
  // Add Dependent
  const addDependent = () => {
    const newDependent = { name: '', relation: '', dob: '' };
    const updatedDependents = [...dependents, newDependent];
    onDependentsChange(updatedDependents);
  };

  // Remove Dependent
  const removeDependent = (index) => {
    const updatedDependents = dependents.filter((dependent, i) => i !== index);
    onDependentsChange(updatedDependents);
  };

  // Handle dependent data change
  const handleDependentChange = (index, field, value) => {
    const updatedDependents = dependents.map((dependent, i) =>
      i === index ? { ...dependent, [field]: value } : dependent
    );
    onDependentsChange(updatedDependents);
  };

  return (
    <div className="bg-white/95 backdrop-blur-lg border border-border-light rounded-3xl shadow-primary-lg p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-gradient rounded-full mb-4">
          <Users size={32} className="text-white" />
        </div>
        <h2 className="text-4xl font-display font-bold bg-primary-gradient bg-clip-text text-transparent mb-2">
          Wategemezi
        </h2>
        <p className="text-text-secondary text-lg">Ongeza taarifa za watu wanaokutegemea usharikani</p>
      </div>

      {/* Dependents List */}
      <div className="mb-8">
        {dependents.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-dashed border-primary-400 rounded-full mb-4">
              <Users size={24} className="text-primary-600" />
            </div>
            <h5 className="text-text-secondary mb-2 font-semibold">Hakuna Wategemezi</h5>
            <p className="text-text-tertiary">Bofya kitufe cha chini kuongeza mtegemezi</p>
          </div>
        ) : (
          <div className="space-y-6">
            {dependents.map((dependent, index) => (
              <div key={index} className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                {/* Dependent Header */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-primary-gradient rounded-full mr-3">
                      <User size={20} className="text-white" />
                    </div>
                    <h5 className="text-primary-700 font-bold text-lg">
                      Mtegemezi #{index + 1}
                    </h5>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDependent(index)}
                    className="flex items-center gap-2 px-4 py-2 bg-error-500 text-white rounded-full hover:bg-error-600 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <Minus size={16} />
                    Ondoa
                  </button>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="md:col-span-1">
                    <label htmlFor={`dependentName${index}`} className="block text-sm font-semibold text-text-primary mb-2">
                      <User size={18} className="inline mr-2 text-primary-600" />
                      Jina la Mtegemezi
                    </label>
                    <input
                      type="text"
                      id={`dependentName${index}`}
                      placeholder="Jina la Mtegemezi"
                      value={dependent.name || ''}
                      onChange={(e) => handleDependentChange(index, 'name', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-primary-300 rounded-xl bg-white/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent hover:border-primary-400"
                    />
                  </div>

                  {/* Relation */}
                  <div className="md:col-span-1">
                    <label htmlFor={`dependentRelation${index}`} className="block text-sm font-semibold text-text-primary mb-2">
                      <Heart size={18} className="inline mr-2 text-primary-600" />
                      Uhusiano na Msharika
                    </label>
                    <select
                      id={`dependentRelation${index}`}
                      value={dependent.relation || ''}
                      onChange={(e) => handleDependentChange(index, 'relation', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-primary-300 rounded-xl bg-white/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent hover:border-primary-400"
                    >
                      <option value="">Chagua Uhusiano...</option>
                      <option value="Mke">Mke</option>
                      <option value="Mume">Mume</option>
                      <option value="Mtoto">Mtoto</option>
                      <option value="Binti">Binti</option>
                      <option value="Mama">Mama</option>
                      <option value="Baba">Baba</option>
                      <option value="Kaka">Kaka</option>
                      <option value="Dada">Dada</option>
                      <option value="Mjukuu">Mjukuu</option>
                      <option value="Mwingine">Mwingine</option>
                    </select>
                  </div>

                  {/* Date of Birth */}
                  <div className="md:col-span-2">
                    <label htmlFor={`dependentDob${index}`} className="block text-sm font-semibold text-text-primary mb-2">
                      <Calendar size={18} className="inline mr-2 text-primary-600" />
                      Tarehe ya Kuzaliwa
                    </label>
                    <input
                      type="date"
                      id={`dependentDob${index}`}
                      value={dependent.dob || ''}
                      onChange={(e) => handleDependentChange(index, 'dob', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-primary-300 rounded-xl bg-white/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent hover:border-primary-400"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Dependent Button */}
      <div className="text-center mb-6">
        <button 
          type="button" 
          onClick={addDependent}
          className="bg-primary-gradient text-white font-bold py-4 px-8 rounded-full shadow-primary transition-all duration-300 hover:shadow-primary-lg hover:-translate-y-1 inline-flex items-center gap-2"
        >
          <Plus size={20} />
          Ongeza Mtegemezi
        </button>
      </div>

      {/* Info Alert */}
      {dependents.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center">
            <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mr-3 flex-shrink-0">
              <Info size={16} className="text-white" />
            </div>
            <span className="text-blue-700 font-medium text-sm">
              Umesajili wategemezi {dependents.length}. 
              Hakikisha taarifa zote ni sahihi kabla ya kuendelea.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DependentsForm;