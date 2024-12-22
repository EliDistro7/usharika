

import React from "react";

const Kwaya: React.FC = () => {
  return (
    <div className="container my-5">
      <div className="card shadow">
        <div className="card-header bg-info text-white text-center">
          <h2 className="mb-0 text-white">Fomu ya Kujiunga na Kwaya</h2>
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
              <label htmlFor="jumuiya">Jumuiya Wanayosali *</label>
              <input
                type="text"
                className="form-control"
                id="jumuiya"
                placeholder="Ingiza Jumuiya"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="leader">Kiongozi wa Jumuiya *</label>
              <input
                type="text"
                className="form-control"
                id="leader"
                placeholder="Ingiza jina la Kiongozi"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="choir">Kwaya Unayotaka Kujiunga *</label>
              <select className="form-control" id="choir" required>
                <option value="">Chagua Kwaya</option>
                <option>Kwaya Kuu</option>
                <option>Kwaya ya Umoja wa Vijana</option>
                <option>Kwaya ya Uinjilisti</option>
                <option>Kwaya ya Wamama</option>
                <option>Kwaya ya Wanaume</option>
              </select>
            </div>

            <button type="submit" className="btn btn-info btn-block">
              Omba Kujiunga
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Kwaya;
