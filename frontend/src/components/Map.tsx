import React from 'react';
import { FiMapPin } from 'react-icons/fi';

const MapEmbed = () => {
  return (
    <div className="container my-5 px-0">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card border-primary shadow">
            {/* Header */}
            <div className="card-header bg-light text-white text-center">
              <h5 className="mb-0">
                Kanisa letu lipo Yombo Kuu, Dar es Salaam, Tanzania
              </h5>
            </div>

            {/* Map Iframe */}
            <div className="ratio ratio-16x9">

    

              <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7922.434525639529!2d39.23515454921658!3d-6.864547184937864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x185c4a001f086fdb%3A0x8bf3060642c53afa!2sKanisa%20La%20Kiinjili%20La%20Kilutheri%20Ushirika%20Wa%20Yombo!5e0!3m2!1ssw!2stz!4v1732767341144!5m2!1ssw!2stz"    width="600" height="450" 
              allowFullScreen
                aria-hidden="false"
                tabIndex={0}
                loading="lazy"
                className="rounded-bottom"
              ></iframe>
            </div>

            {/* Location Icon Overlay 
            <iframe  "></iframe>
            <div
              className="position-absolute top-50 start-50 translate-middle"
              style={{ zIndex: 10 }}

              <iframe  "></iframe>
            >
              <FiMapPin className="text-danger fs-2 animate-bounce" />
            </div>
            */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapEmbed;
