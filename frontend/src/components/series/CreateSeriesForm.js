// components/CreateSeriesForm.jsx
'use client';

import React from 'react';
import PropTypes from 'prop-types';

const CreateSeriesForm = ({ newSeries, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-6">
      <div className="space-y-2">
        <label 
          htmlFor="seriesName" 
          className="block text-sm font-medium text-text-primary"
        >
          Jina
        </label>
        <input
          id="seriesName"
          type="text"
          placeholder="Enter series name"
          value={newSeries.name}
          onChange={(e) => onChange({ ...newSeries, name: e.target.value })}
          required
          className="w-full px-4 py-3 rounded-lg border border-border-default bg-background-50 text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-border-medium"
        />
      </div>

      <div className="space-y-2">
        <label 
          htmlFor="seriesDescription" 
          className="block text-sm font-medium text-text-primary"
        >
         Maelezo
        </label>
        <input
          id="seriesDescription"
          type="text"
          placeholder="Enter description"
          value={newSeries.description}
          onChange={(e) => onChange({ ...newSeries, description: e.target.value })}
          required
          className="w-full px-4 py-3 rounded-lg border border-border-default bg-background-50 text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-border-medium"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label 
            htmlFor="seriesStartDate" 
            className="block text-sm font-medium text-text-primary"
          >
            Tarehe ya kuanza
          </label>
          <input
            id="seriesStartDate"
            type="date"
            value={newSeries.startDate}
            onChange={(e) => onChange({ ...newSeries, startDate: e.target.value })}
            required
            className="w-full px-4 py-3 rounded-lg border border-border-default bg-background-50 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-border-medium"
          />
        </div>

        <div className="space-y-2">
          <label 
            htmlFor="seriesEndDate" 
            className="block text-sm font-medium text-text-primary"
          >
           Tarehe ya kuisha
          </label>
          <input
            id="seriesEndDate"
            type="date"
            value={newSeries.endDate}
            onChange={(e) => onChange({ ...newSeries, endDate: e.target.value })}
            required
            className="w-full px-4 py-3 rounded-lg border border-border-default bg-background-50 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-border-medium"
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="btn-primary px-6 py-3 rounded-lg font-medium text-white shadow-primary hover:shadow-primary-lg transform transition-all duration-300 ease-out flex items-center gap-2"
        >
          <i className="fa fa-save"></i>
          <span>Unda Series</span>
        </button>
      </div>
    </form>
  );
};

CreateSeriesForm.propTypes = {
  newSeries: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default CreateSeriesForm;