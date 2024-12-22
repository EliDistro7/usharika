import React from "react";

const BreakingNews = () => (
  <div className="container-fluid bg-dark py-3 mb-3">
    <div className="container">
      <div className="row align-items-center">
        <div className="col-12">
          <div className="d-flex justify-content-between">
            {/* Breaking News Label */}
            <div
              className="bg-primary text-dark text-center font-weight-medium py-2"
              style={{ width: "170px" }}
            >
              Habari za Hivi Punde
            </div>

            {/* Breaking News Carousel */}
            <div
              className="owl-carousel tranding-carousel position-relative d-inline-flex align-items-center ml-3"
              style={{ width: "calc(100% - 170px)", paddingRight: "90px" }}
            >
              {[
                "Ibada Kuu ya Kumbukumbu ya Watakatifu Itafanyika",
                "Ratiba za Mafundisho ya Imani Zimetangazwa",
              ].map((newsItem, index) => (
                <div key={index} className="text-truncate">
                  <a
                    className="text-white text-uppercase font-weight-semi-bold"
                    href="#"
                  >
                    {newsItem}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default BreakingNews;
