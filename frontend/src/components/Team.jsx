import React from "react";
import PropTypes from "prop-types";
import { UserCheck, Phone } from "lucide-react";

const Team = ({ leaders, activeSelection }) => {
  console.log('leaders', leaders);
  
  // Format activeSelection: remove spaces and replace with underscores, then prefix with "kiongozi_"
  const formattedSelection = `kiongozi_${(activeSelection || "").toLowerCase().replace(/\s+/g, '_')}`;

  return (
    <div className="w-full py-0" >
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div
          className="mx-auto text-center animate-fade-in"
          style={{ maxWidth: "600px" }}
        >
          <h4 className="text-primary-50 mb-3 text-lg font-semibold tracking-wide uppercase">
            {activeSelection || "Leadership Team"}
          </h4>
          <h1 className="text-5xl font-display font-bold text-primary-100 mb-12">
            USHARIKA WA YOMBO
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {leaders.map((leader, index) => {
            // Extract the positions from the leader's `leadershipPositions` field
            const leaderPositions = leader.leadershipPositions?.[formattedSelection] || [];

            return (
              <div
                className="w-full max-w-sm animate-slide-up hover:animate-scale-in"
                style={{ animationDelay: `${0.1 * index}s` }}
                key={leader.id || index}
              >
                <div className="text-center rounded-2xl p-6 shadow-medium relative bg-gradient-to-br from-purple-100 to-purple-200 border border-purple-300 hover:shadow-primary-lg transition-all duration-300 hover:-translate-y-2 group">
                  <div className="mb-6">
                    <img
                      src={leader.profilePicture || "/default-profile.png"}
                      alt={leader.name}
                      className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-soft group-hover:shadow-primary transition-all duration-300"
                    />
                  </div>
                  
                  <h5 className="text-xl font-display font-bold text-text-primary mb-2">
                    {leader.name}
                  </h5>
                  
                  <div className="flex items-center justify-center text-text-secondary mb-4">
                    <UserCheck className="w-4 h-4 mr-2 text-primary-600" />
                    <span className="text-sm font-medium">
                      {leaderPositions.length > 0 ? leaderPositions.join(", ") : "Leader"}
                    </span>
                  </div>
                  
                  <div className="border-t border-purple-200 pt-4">
                    <a
                      href={`tel:${leader.phone}`}
                      className="inline-flex items-center text-primary-700 font-semibold hover:text-primary-800 transition-colors duration-200 group/phone"
                    >
                      <Phone className="w-4 h-4 mr-2 group-hover/phone:animate-pulse" />
                      <span className="group-hover/phone:underline">{leader.phone}</span>
                    </a>
                  </div>
                  
                  {/* Decorative element */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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