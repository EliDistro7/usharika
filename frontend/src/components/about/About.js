'use client';

import React, { useState } from "react";

const AboutSection = () => {
  const [videoSrc, setVideoSrc] = useState(null);

  const handlePlayClick = (src) => {
    setVideoSrc(src + "?autoplay=1&modestbranding=1&showinfo=0");
  };

  const handleClose = () => {
    setVideoSrc(null);
  };

  return (
    <>
      <div className="container-fluid py-5 about bg-light">
        <div className="container py-5">
          <div className="row g-5 align-items-center">
            <div
              className="col-lg-5 wow fadeIn"
              data-wow-delay="0.1s"
            >
              <div className="video border">
                <button
                  type="button"
                  className="btn btn-play"
                  data-bs-toggle="modal"
                  data-bs-target="#videoModal"
                  onClick={() =>
                    handlePlayClick("https://www.youtube.com/embed/urWBW0MRsiw")
                  }
                >
                  <span></span>
                </button>
              </div>
            </div>
            <div
              className="col-lg-7 wow fadeIn"
              data-wow-delay="0.3s"
            >
              <h4 className="text-primary mb-4 border-bottom border-primary border-2 d-inline-block p-2 title-border-radius">
                Kuhusu Sisi
              </h4>
              <h1 className="text-dark mb-4 display-5">
                Kujifunza, Kukua, na Kumtumikia Mungu Pamoja
              </h1>
              <p className="text-dark mb-4">
                Usharika wa KKKT Yombo Kuu ni mahali pa faraja, imani, na ukuaji
                wa kiroho. Tunajitahidi kuakisi upendo wa Mungu kupitia mafundisho
                ya Yesu Kristo na huduma kwa wengine. Lengo letu ni kusaidia watu
                wote kukua kiimani, kuelewa Neno la Mungu, na kuwa wafuasi wa kweli
                wa Kristo kwa kushirikiana kama familia moja ya kiroho.
              </p>
              <div className="row mb-4">
                <div className="col-lg-6">
                  <h6 className="mb-3">
                    <i className="fas fa-check-circle me-2 text-primary"></i>
                    Mafunzo ya Biblia
                  </h6>
                  <h6 className="mb-3">
                    <i className="fas fa-check-circle me-2 text-secondary"></i>
                    Huduma za Jumuiya
                  </h6>
                  <h6 className="mb-3">
                    <i className="fas fa-check-circle me-2 text-dark"></i>
                    Maombi ya Pamoja
                  </h6>
                </div>
                <div className="col-lg-6">
                  <h6 className="mb-3">
                    <i className="fas fa-check-circle me-2 text-primary"></i>
                    Msaada kwa Wenye Mahitaji
                  </h6>
                  <h6 className="mb-3">
                    <i className="fas fa-check-circle me-2 text-secondary"></i>
                    Uinjilisti na Huduma
                  </h6>
                  <h6>
                    <i className="fas fa-check-circle me-2 text-dark"></i>
                    Ushirikiano wa Kiroho
                  </h6>
                </div>
              </div>
              <a
                href="/auth"
                className="btn btn-primary px-5 py-3 btn-border-radius"
              >
                Jiunge Nasi
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <div
        className="modal fade"
        id="videoModal"
        tabIndex={-1}
        aria-labelledby="videoModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="videoModalLabel">Video</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleClose}
              ></button>
            </div>
            <div className="modal-body">
              <iframe
                id="video"
                className="w-100"
                height="315"
                src={videoSrc}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutSection;
