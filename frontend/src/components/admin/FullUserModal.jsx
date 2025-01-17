import React from "react";

const FullUserModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div
      className="modal-overlay d-flex align-items-center justify-content-center"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1050,
      }}
    >
      <div
        className="modal-content p-4 d-flex flex-column"
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          maxWidth: "700px",
          width: "100%",
          maxHeight: "90vh", // Restricts modal height to 90% of viewport height
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Header */}
        <div
          className="d-flex justify-content-between align-items-center border-bottom pb-3"
          style={{ marginBottom: "20px", flexShrink: 0 }}
        >
          <h5 className="modal-title mb-0" style={{ fontWeight: "600" }}>
            Maelezo ya Msharika: {user.name}
          </h5>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
            }}
          >
            &times;
          </button>
        </div>

        {/* Scrollable Body */}
        <div
          className="modal-body flex-grow-1 overflow-auto"
          style={{
            paddingRight: "15px", // Add padding to prevent scrollbars from overlapping content
          }}
        >
          {/* User Profile */}
          <div className="d-flex align-items-center mb-4">
            <img
              src={user.profilePicture || "/img/default-profile.png"}
              alt={`${user.name}'s profile`}
              className="rounded-circle"
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                marginRight: "20px",
              }}
            />
            <div>
              <h5 className="mb-1" style={{ fontWeight: "500" }}>
                {user.name}
              </h5>
              <p className="mb-1">
                <strong>Simu:</strong> {user.phone}
              </p>
              <p className="mb-1">
                <strong>Jumuiya:</strong> {user.jumuiya}
              </p>
              <p className="mb-0">
                <strong>Jinsia:</strong>{" "}
                {user.gender === "me" ? "Mwanaume" : "Mwanamke"}
              </p>
            </div>
          </div>

          {/* User Details */}
          <div className="mb-4">
            <h6 className="text-primary mb-2" style={{ fontWeight: "600" }}>
              Taarifa binafsi
            </h6>
            <p className="mb-1">
              <strong>Umri:</strong>{" "}
              {new Date().getFullYear() - new Date(user.dob).getFullYear()}{" "}
              miaka
            </p>
            <p className="mb-1">
              <strong>Hali ya Ndoa:</strong> {user.maritalStatus} (
              {user.marriageType})
            </p>
            <p className="mb-1">
              <strong>Ubatizo:</strong> {user.ubatizo ? "Ndiyo" : "Hapana"}
            </p>
            <p className="mb-1">
              <strong>Kipaimara:</strong> {user.kipaimara ? "Ndiyo" : "Hapana"}
            </p>
            <p className="mb-1">
              <strong>Kazi:</strong> {user.occupation}
            </p>
            <p className="mb-0">
              <strong>Amethibitishwa:</strong>{" "}
              {user.verified ? "Ndiyo" : "Hapana"}
            </p>
          </div>

          {/* Roles */}
          <div className="mb-4">
            <h6 className="text-primary mb-2" style={{ fontWeight: "600" }}>
              Nafasi na Vikundi alivyomo
            </h6>
            {user.selectedRoles.length > 0 ? (
              <ul className="list-group">
                {user.selectedRoles.map((role, index) => (
                  <li key={index} className="list-group-item">
                    {role.replace(/_/g, " ")}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">Hakuna majukumu yaliyotolewa.</p>
            )}
          </div>

         {/* Pledges */}
<div className="mb-4">
  <h6 className="text-primary mb-2" style={{ fontWeight: "600" }}>
    Ahadi za Msharika
  </h6>
  <ul className="list-group">
    {/* Default pledge types */}
    <li className="list-group-item">
      <strong>Ahadi:</strong> {user.pledges.ahadi} TZS / Iliyolipwa:{" "}
      {user.pledges.paidAhadi} TZS
    </li>
    <li className="list-group-item">
      <strong>Jengo:</strong> {user.pledges.jengo} TZS / Iliyolipwa:{" "}
      {user.pledges.paidJengo} TZS
    </li>

    {/* Dynamic pledge types from 'other' */}
    {user.pledges.other &&
      Object.entries(user.pledges.other).map(([key, { total, paid }]) => (
        <li className="list-group-item" key={key}>
          <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
          {total} TZS / Iliyolipwa: {paid} TZS
        </li>
      ))}
  </ul>
</div>


          {/* Dependents */}
          <div className="mb-4">
            <h6 className="text-primary mb-2" style={{ fontWeight: "600" }}>
              Wategemezi
            </h6>
            {user.dependents.length > 0 ? (
              <ul className="list-group">
                {user.dependents.map((dependent, index) => (
                  <li key={index} className="list-group-item">
                    {dependent.name} ({dependent.relation})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">Hakuna wategemezi waliosajiliwa.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="text-end border-top pt-3"
          style={{ flexShrink: 0 }}
        >
          <button
            type="button"
            className="btn btn-primary"
            style={{ padding: "10px 20px" }}
            onClick={onClose}
          >
            Funga
          </button>
        </div>
      </div>
    </div>
  );
};

export default FullUserModal;
