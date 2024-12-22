import React from "react";
import PropTypes from "prop-types";

const Team = ({ title, subtitle, members }) => {
  return (
    <div className="container-fluid team py-5">
      <div className="container py-5">
        <div
          className="mx-auto text-center wow fadeIn"
          data-wow-delay="0.1s"
          style={{ maxWidth: "600px" }}
        >
          <h4 className="text-primary mb-4 border-bottom border-primary border-2 d-inline-block p-2 title-border-radius">
            {title}
          </h4>
          <h1 className="mb-5 display-3">{subtitle}</h1>
        </div>
        <div className="row g-5 justify-content-center ">
          {members.map((member, index) => (
            <div
              key={index}
              className="col-md-6 col-lg-4 col-xl-3 wow fadeIn "
              data-wow-delay={member.delay || "0.1s"}
            >
              <div className="team-item border border-primary img-border-radius overflow-hidden">
                <img
                  src={member.image}
                  className="img-fluid w-100"
                  alt={member.name}
                />
                <div className="team-icon d-flex align-items-center justify-content-center">
                  {member.socialLinks &&
                    member.socialLinks.map((link, linkIndex) => (
                      <a
                        key={linkIndex}
                        className="btn btn-primary btn-md-square text-white rounded-circle me-3"
                        href={link.url}
                      >
                        <i className={link.icon}></i>
                      </a>
                    ))}
                </div>
                <div className="team-content text-center py-3">
                  <h4 className="text-primary">{member.name}</h4>
                  <p className="text-muted mb-2">{member.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Define PropTypes for validation
Team.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  members: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      delay: PropTypes.string,
      socialLinks: PropTypes.arrayOf(
        PropTypes.shape({
          url: PropTypes.string.isRequired,
          icon: PropTypes.string.isRequired,
        })
      ),
    })
  ).isRequired,
};

export default Team;
