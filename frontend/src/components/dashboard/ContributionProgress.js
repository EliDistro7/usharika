

const ContributionProgress = ({ title, paid, total }) => {
    const progress = total > 0 ? Math.min(((paid / total) * 100).toFixed(0), 100) : 0;
    const progressBarClass = title === "Ahadi" ? "bg-success" : "bg-primary";
    const remaining = Math.max(total - paid, 0);
  
    return (
      <tr>
        <td>{title}</td>
        <td>TZS {paid.toLocaleString()}</td>
        <td>TZS {total.toLocaleString()}</td>
        <td>
          <div className="progress" style={{ height: "10px", backgroundColor: "#e9ecef", borderRadius: "6px" }}>
            <div
              className={`progress-bar ${progressBarClass}`}
              role="progressbar"
              style={{
                width: `${progress}%`,
                transition: "width 0.4s ease",
                borderRadius: "6px",
              }}
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </td>
        <td>
          <strong>{remaining > 0 ? "Iliyobakia:" : "Umemaliza!"}</strong>{" "}
          {remaining > 0 ? `TZS ${remaining.toLocaleString()}` : ""}
        </td>
      </tr>
    );
  };


  export default ContributionProgress;