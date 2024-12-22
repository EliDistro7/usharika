import React from "react";

const UserTableRows = ({
  users,
  sortBy,
  calculatePledgeTotals,
  handleUserClick,
}) => {
  if (users.length === 0) {
    return (
      <tr>
        <td colSpan="8" className="text-center text-muted p-3">
          No users found.
        </td>
      </tr>
    );
  }

  return (
    <>
      {users.map((user) => {
        const { totalPledged, totalPaid, totalRemaining } =
          sortBy !== "none" ? calculatePledgeTotals(user, sortBy) : {};

        // Determine if the user has a "kiongozi" role
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
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9f9f9")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
          >
            {/* Profile Picture */}
            <td className="text-center">
              <img
                src={user.profilePicture || "/img/default-profile.png"}
                alt={user.name}
                className="rounded-circle border"
                width="40"
                height="40"
              />
            </td>

            {/* User Name with Kiongozi Badge */}
            <td>
              <span className="fw-bold">{user.name}</span>
              {hasKiongoziRole && (
                <span
                  className="badge ms-2 text-white"
                  style={{
                    backgroundColor: "#17a2b8", // Info color for "kiongozi"
                    fontSize: "0.75rem",
                  }}
                >
                  Kiongozi
                </span>
              )}
            </td>

            {/* User Details */}
            {sortBy === "none" ? (
              <>
                <td className="text-muted">{user.phone}</td>
                <td className="text-capitalize">
                  {user.gender === "me" ? "Mume" : "Mke"}
                </td>
                {/* Vikundi column with width limit */}
                <td
                  style={{
                    maxWidth: "200px", // Limit column width
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                  title={user.jumuiya} // Show full text on hover
                >
                  {user.jumuiya}
                </td>
               
                <td>{user.occupation}</td>
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
