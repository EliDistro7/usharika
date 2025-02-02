import React from "react";

const UserTableRows = ({
  users,
  sortBy,
  calculatePledgeTotals,
  handleUserClick,
}) => {

//console.log('users', users);
//console.log('sort by', sortBy);

  if (users.length === 0) {
    return (
      <tr>
        <td colSpan="8" className="text-center text-muted p-3">
          Hakuna mtumiaji aliyesajiliwa 
        </td>
      </tr>
    );
  }

  return (
    <>
      {users.map((user) => {
        const { totalPledged, totalPaid, totalRemaining } =
          sortBy !== "none" ? calculatePledgeTotals(user, sortBy) : {};
  
        const hasKiongoziRole = user.selectedRoles.some((role) =>
          role.startsWith("kiongozi")
        );
  
        return (
          <tr
            key={user._id}
            onClick={() => handleUserClick(user)}
            className="align-middle"
            style={{
              cursor: "pointer",
              transition: "background-color 0.2s ease, transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f5f3ff"; // Light purple background on hover
              e.currentTarget.style.transform = "scale(1.005)"; // Slight scale effect
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "white"; // Reset background
              e.currentTarget.style.transform = "scale(1)"; // Reset scale
            }}
          >
            {/* Profile Picture */}
            <td className="text-center">
              <img
                src={user.profilePicture || "/img/default-profile.png"}
                alt={user.name}
                className="rounded-circle border shadow-sm"
                width="40"
                height="40"
                style={{ borderColor: "#e0d8ff" }} // Light purple border
              />
            </td>
  
            {/* User Name with Kiongozi Badge */}
            <td>
              <span className="fw-bold" style={{ color: "#4a2ea0" }}>
                {user.name}
              </span>
              {hasKiongoziRole && (
                <span
                  className="badge ms-2 text-white"
                  style={{
                    backgroundColor: "#6a0dad", // Purple badge
                    fontSize: "0.75rem",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "12px",
                  }}
                >
                  Kiongozi
                </span>
              )}
            </td>
  
            {/* User Details */}
            {sortBy === "none" ? (
              <>
                {/* Phone column - hidden on small screens */}
                <td className="text-muted d-none d-md-table-cell">{user.phone}</td>
  
                {/* Gender column - hidden on extra small screens */}
                <td className="text-capitalize d-none d-sm-table-cell">
                  {user.gender === "me" ? "Mume" : "Mke"}
                </td>
  
                {/* Jumuiya column - hidden on small screens */}
                <td
                  className="d-none d-lg-table-cell"
                  style={{
                    maxWidth: "200px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    color: "#6a0dad", // Purple text
                  }}
                  title={user.jumuiya}
                >
                  {user.jumuiya}
                </td>
  
                {/* Occupation column - always visible */}
                <td style={{ color: "#4a2ea0" }}>{user.occupation}</td>
              </>
            ) : (
              <>
                <td className="text-success fw-bold">{totalPledged}</td>
                <td className="text-primary fw-bold">{totalPaid}</td>
                <td className="text-danger fw-bold">{totalRemaining}</td>
              </>
            )}
          </tr>
        );
      })}
    </>
  );
};

export default UserTableRows;
