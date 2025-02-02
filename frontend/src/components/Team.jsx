import React from "react";
import PropTypes from "prop-types";

const Team = ({ leaders, activeSelection }) => {
  console.log('leaders', leaders);
  
  // Format activeSelection: remove spaces and replace with underscores, then prefix with "kiongozi_"
  const formattedSelection = `kiongozi_${(activeSelection || "").toLowerCase().replace(/\s+/g, '_')}`;

  return (
    <div className="container-fluid team py-0" style={{ backgroundColor: "#F3E5F5" }}>
      <div className="container py-5">
        <div
          className="mx-auto text-center wow fadeIn"
          data-wow-delay="0.1s"
          style={{ maxWidth: "600px" }}
        >
          <h4 className="text-purple mb-3">{activeSelection || "Leadership Team"}</h4>
          <h1 className="display-5 text-dark mb-5">USHARIKA WA YOMBO</h1>
        </div>
        <div className="row g-4 justify-content-center">
          {leaders.map((leader, index) => {
            // Extract the positions from the leader's `leadershipPositions` field
            const leaderPositions = leader.leadershipPositions?.[formattedSelection] || [];

            return (
              <div
                className="col-lg-4 col-md-6 col-sm-12 wow fadeInUp"
                data-wow-delay={`${0.1 * index}s`}
                key={leader.id || index}
              >
                <div
                  className="team-item text-center rounded p-4 shadow-sm position-relative"
                  style={{
                    backgroundColor: "#E1BEE7",
                    color: "#4A148C",
                    border: "1px solid #D1C4E9",
                    transition: "transform 0.3s ease-in-out",
                  }}
                >
                  <img
                    src={leader.profilePicture || "/default-profile.png"}
                    alt={leader.name}
                    className="img-fluid rounded-circle mb-3"
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  />
                  <h5 className="mb-1">{leader.name}</h5>
                  <p className="text-dark">
                    <i className="fas fa-user-tie me-1"></i> 
                    {leaderPositions.length > 0 ? leaderPositions.join(", ") : "Leader"}
                  </p>
                  <p className="mb-0">
                    <a
                      href={`tel:${leader.phone}`}
                      className="text-purple fw-bold"
                      style={{ textDecoration: "none", color: "#6A1B9A" }}
                    >
                      <i className="fas fa-phone-alt me-1"></i> {leader.phone}
                    </a>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

Team.propTypes = {
  leaders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
      profilePicture: PropTypes.string,
      leadershipPositions: PropTypes.object, // Ensuring leaders have leadershipPositions
    })
  ).isRequired,
  activeSelection: PropTypes.string,
};

export default Team;