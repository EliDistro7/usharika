import React from "react";

const Footer = () => {
  return (
    <footer className="container-fluid footer py-5 wow fadeIn" data-wow-delay="0.1s">
      <div className="container py-5">
        <div className="row g-5">
          {/* About Section */}
          <div className="col-md-6 col-lg-4 col-xl-3">
            <div className="footer-item">
            <a href="/" className="navbar-brand d-flex align-items-center">
              <h1 className="m-0 fw-bold">
                <span className='' style={{color:"#6f42c1"}}>KKKT</span>{" "}
                <span className='text-secondary'>Yombo</span>
              </h1>
            </a>
              <p className="mb-4">
                Karibu katika familia ya kiroho ya KKKT Yombo Kuu, mahali pa kuabudu, kujifunza,
                na kushiriki upendo wa Kristo. Pamoja tunakua kiimani na kumtumikia Mungu kwa furaha.
              </p>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="col-md-6 col-lg-4 col-xl-3">
            <div className="footer-item">
              <h4 className="text-muted mb-4 border-bottom border-primary border-2 d-inline-block p-2 title-border-radius">
                Quick Links
              </h4>
              <ul className="list-unstyled">
                <li>
                  <a href="/" className="text-body mb-2 d-block">
                    <i className="fa fa-chevron-right me-2 text-primary"></i>Nyumbani
                  </a>
                </li>
                <li>
                  <a href="/about" className="text-body mb-2 d-block">
                    <i className="fa fa-chevron-right me-2 text-primary"></i>Fahamu Zaidi
                  </a>
                </li>
                <li>
                  <a href="/kalenda" className="text-body mb-2 d-block">
                    <i className="fa fa-chevron-right me-2 text-primary"></i>Kalenda ya Matukio
                  </a>
                </li>
                <li>
                  <a href="/uongozi" className="text-body mb-2 d-block">
                    <i className="fa fa-chevron-right me-2 text-primary"></i>Uongozi
                  </a>
                </li>
                <li>
                  <a href="/usajili" className="text-body mb-2 d-block">
                    <i className="fa fa-chevron-right me-2 text-primary"></i>Kujisajili
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-body mb-2 d-block">
                    <i className="fa fa-chevron-right me-2 text-primary"></i>Mawasiliano
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="col-md-6 col-lg-4 col-xl-3">
            <div className="footer-item">
              <div
                className="d-flex flex-column p-4 ps-5 text-dark"
              >
                <h5 className="fw-bold">OFISI YA MCHUNGAJI</h5>
                <p>Jumatatu: 8am - 5pm</p>
                <p>Jumanne: 8am - 5pm</p>
                <p>Jumatano: 8am - 5pm</p>
                <p>Alhamis: 8am - 5pm</p>
                <p>Ijumaa: 8am - 5pm</p>
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="col-md-6 col-lg-4 col-xl-3">
            <div className="footer-item">
              <h4 className="text-muted mb-4 border-bottom border-primary border-2 d-inline-block p-2 title-border-radius">
                MAHALI
              </h4>
              <div className="d-flex flex-column align-items-start">
                <a href="#" className="text-body mb-4">
                  <i className="fa fa-map-marker-alt text-primary me-2"></i>
                  104 Yombo Kiwalani, Dar Es Salaam, URT
                </a>
                <a href="#" className="text-body mb-4">
                  <i className="fa fa-phone-alt text-primary me-2"></i>
                  (+012) 3456 7890 123
                </a>
                <a href="#" className="text-body mb-4">
                  <i className="fas fa-envelope text-primary me-2"></i>
                  yombolutheran@gmail.com
                </a>
                <div className="footer-icon d-flex">
                  <a className="btn btn-primary btn-sm-square me-3 rounded-circle text-white" href="#">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a className="btn btn-primary btn-sm-square me-3 rounded-circle text-white" href="#">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a className="btn btn-primary btn-sm-square rounded-circle text-white" href="#">
                    <i className="fab fa-youtube"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Closing Information */}
          <div className="col-12 text-center mt-5">
            <p className="mt-3">
              KKKT Usharika wa Yombo Online System 2024 <br />
              Haki zote zimehifadhiwa
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
