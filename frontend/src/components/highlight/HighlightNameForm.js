import React from "react";

const HighlightNameForm = ({ name, setName }) => (
  <div className="mb-6">
    <div className="space-y-3">
      <label 
        htmlFor="highlight-name"
        className="block text-sm font-semibold text-text-primary tracking-wide"
      >
        Jina la Albamu
      </label>
      <input
        id="highlight-name"
        type="text"
        placeholder="Ingiza jina"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-3 text-text-primary bg-background-100 border-2 border-border-default rounded-xl 
                   placeholder:text-text-tertiary placeholder:font-normal
                   focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                   hover:border-primary-300 hover:bg-background-50
                   transition-all duration-200 ease-in-out
                   shadow-soft focus:shadow-primary"
      />
    </div>
  </div>
);

export default HighlightNameForm;