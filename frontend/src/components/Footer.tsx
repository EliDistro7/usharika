


import React from "react";

const Footer = () => {
  return (
    <footer className="container-fluid footer py-5 wow fadeIn" data-wow-delay="0.1s">
      <div className="container py-5">
        <div className="row g-5">
          {/* About Section */}
          <div className="col-md-6 col-lg-4 col-xl-3">
            <div className="footer-item">
              <h2 className="fw-bold mb-3">
                <span className="text-primary">KKKT</span>{" "}
                <span className="text-secondary">YOMBO</span>
              </h2>
              <p className="mb-4">
  Karibu katika familia ya kiroho ya KKKT Yombo Kuu, mahali pa kuabudu, kujifunza, 
  na kushiriki upendo wa Kristo. Pamoja tunakua kiimani na kumtumikia Mungu kwa furaha.
</p>
          
            </div>
          </div>

          {/* Operating Hours */}
          <div className="col-md-6 col-lg-4 col-xl-3">
            <div className="footer-item">
              <div
                className="d-flex flex-column p-4 ps-5 text-dark border border-primary"
                style={{ borderRadius: "50% 20% / 10% 40%" }}
              >
                <p>Jumatatu: 8am to 5pm</p>
                <p>Jumanne: 8am to 5pm</p>
                <p>Jumatano: 8am to 5pm</p>
                <p>Alhamis: 8am to 5pm</p>
                <p>Ijumaa: 8am to 5pm</p>
                <p>Jumamosi: 8am to 5pm</p>
                <p className="mb-0">Sunday: 8am to 5pm</p>
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="col-md-6 col-lg-4 col-xl-3">
            <div className="footer-item">
              <h4 className="text-primary mb-4 border-bottom border-primary border-2 d-inline-block p-2 title-border-radius">
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
                <a href="#" className="text-body mb-4">
                  <i className="fa fa-clock text-primary me-2"></i>
                  24/7 Hours Service
                </a>
                <div className="footer-icon d-flex">
                  <a className="btn btn-primary btn-sm-square me-3 rounded-circle text-white" href="#">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a className="btn btn-primary btn-sm-square me-3 rounded-circle text-white" href="#">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a className="btn btn-primary btn-sm-square me-3 rounded-circle text-white" href="#">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a className="btn btn-primary btn-sm-square rounded-circle text-white" href="#">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Gallery Section 
          <div className="col-md-6 col-lg-4 col-xl-3">
            <div className="footer-item">
              <h4 className="text-primary mb-4 border-bottom border-primary border-2 d-inline-block p-2 title-border-radius">
                OUR GALLERY
              </h4>
              <div className="row g-3">
                {[1, 2, 3, 4, 5, 6].map((imgIndex) => (
                  <div key={imgIndex} className="col-4">
                    <div className="footer-gallery-img rounded-circle border border-primary">
                      <img
                        src={`img/galary-${imgIndex}.jpg`}
                        className="img-fluid rounded-circle p-2"
                        alt={`Gallery ${imgIndex}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
