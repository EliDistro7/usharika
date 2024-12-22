import React from 'react';

const Summary = ({ summary }) => {
  return (
    <div className=" my-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0 text-white">Ahadi na Jengo</h5>
        </div>
        <div className="card-body">
          <table className="table table-striped table-hover">
            <tbody>
              <tr>
                <td className="fw-bold">Ahadi:</td>
                <td className="text-end">TZS {summary.ahadi.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="fw-bold">Jengo:</td>
                <td className="text-end">TZS {summary.jengo.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="fw-bold">Kiasi Kilicholipwa:</td>
                <td className="text-end">TZS {summary.totalPaid.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="fw-bold">Kiasi Kilichobaki:</td>
                <td className="text-end">TZS {summary.remainingBalance.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="fw-bold">Tarehe ya Mwisho:</td>
                <td className="text-end">{summary.deadline}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Summary;
