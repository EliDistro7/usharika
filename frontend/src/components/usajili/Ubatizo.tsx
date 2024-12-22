

import React from "react";

const Ubatizo: React.FC = () => {
  return (
    <div className="container my-5">
      <div className="card shadow">
        <div className="card-header bg-success text-white text-center">
          <h2 className="mb-0 text-white">Fomu ya Usajili wa Ubatizo</h2>
        </div>
        <div className="card-body">
          <form>
            <div className="form-group">
              <label htmlFor="name">Jina Kamili *</label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Ingiza jina kamili"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="parentsName">Jina la Wazazi *</label>
              <input
                type="text"
                className="form-control"
                id="parentsName"
                placeholder="Ingiza jina la wazazi"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="jumuiya">Jumuiya Wanayosali *</label>
              <input
                type="text"
                className="form-control"
                id="jumuiya"
                placeholder="Ingiza Jumuiya"
                required
              />
            </div>

            <button type="submit" className="btn btn-success btn-block">
              Sajili
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Ubatizo;
