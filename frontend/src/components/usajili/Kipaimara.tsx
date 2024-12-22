import React from "react";

const Kipaimara: React.FC = () => {
  return (
    <div className="container my-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white text-center">
          <h2 className="mb-0 text-white font-weight-bold">
            Fomu ya Usajili wa Kipaimara
          </h2>
        </div>
        <div className="card-body">
          <form>
            <div className="form-group">
              <label
                htmlFor="name"
                className="font-weight-bold text-dark"
              >
                Jina Kamili <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control font-weight-bold"
                id="name"
                placeholder="Ingiza jina kamili"
                required
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="parentsName"
                className="font-weight-bold text-dark"
              >
                Jina la Wazazi <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control font-weight-bold"
                id="parentsName"
                placeholder="Ingiza jina la wazazi"
                required
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="jumuiya"
                className="font-weight-bold text-dark"
              >
                Jumuiya Wanayosali <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control font-weight-bold"
                id="jumuiya"
                placeholder="Ingiza Jumuiya"
                required
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="leader"
                className="font-weight-bold text-dark"
              >
                Kiongozi wa Jumuiya <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control font-weight-bold"
                id="leader"
                placeholder="Ingiza jina la Kiongozi"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block font-weight-bold"
            >
              Sajili
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Kipaimara;
