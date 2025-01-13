import React, { useState } from 'react';
import { Accordion, Tabs, Tab } from 'react-bootstrap';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { archiveAttendance, unarchiveAttendance } from '@/actions/attendance';
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

const SessionList = ({ groupedSessions, onView }) => {
  const [activeTab, setActiveTab] = useState('unarchived');

  const handleArchiveToggle = async (session, isArchived) => {
    const attendanceId = session._id;
    try {
      if (isArchived) {
        await unarchiveAttendance(attendanceId);
        toast.success('Umefanikiwa kutoa kumbukumbu kwenye makabadhi!', {
        
        });
      } else {
        await archiveAttendance(attendanceId);
        toast.success('Umefanikiwa kuweka kwenye makabadhi!', {
         
        });
      }

      // Update the session's archived status
      session.archived = !isArchived;
    } catch (error) {
      console.log(error)
      toast.error('An error occurred while updating the session.', {

      });
    }
  };

  const renderSessions = (sessions, isArchived) => {
    if (!Object.keys(sessions ?? {}).length) {
      return (
        <p className="text-muted text-center">
          {isArchived ? 'Hakuna vipindi vilivyohifadhiwa.' : 'Daftari ni tupu.'}
        </p>
      );
    }

    return (
      <Accordion defaultActiveKey="0">
        {Object.keys(sessions).map((sessionName, idx) => (
          <Accordion.Item eventKey={idx.toString()} key={idx} className="mb-3 shadow-sm">
            <Accordion.Header>{sessionName}</Accordion.Header>
            <Accordion.Body>
              <div className="row g-3">
                {sessions[sessionName].map((session) => (
                  <div key={session._id} className="col-md-6 col-lg-4">
                    <div className="card border-primary shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title text-primary">
                          {new Date(session.date).toLocaleDateString()}
                        </h5>
                        <p className="card-text text-muted">{session.session_name}</p>
                        <p className="card-text">
                          Idadi ya Waliohudhuria: {session.num_attendees}
                        </p>
                        <div className="d-flex justify-content-between">
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => onView(session)}
                          >
                            <i className="bi bi-eye me-2"></i>View/Download
                          </button>
                          <button
                            className={`btn ${
                              isArchived ? 'btn-success' : 'btn-outline-secondary'
                            } btn-sm`}
                            onClick={() =>
                              handleArchiveToggle(session, isArchived)
                            }
                          >
                            <i
                              className={`bi ${
                                isArchived ? 'bi-arrow-up-circle' : 'bi-archive'
                              } me-2`}
                            ></i>
                            {isArchived ? 'Unarchive' : 'Archive'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    );
  };

  const groupedArchived = Object.fromEntries(
    Object.entries(groupedSessions).map(([key, sessions]) => [
      key,
      sessions.filter((session) => session.archived), // Implicit truthy check
    ])
  );
  
  const groupedUnarchived = Object.fromEntries(
    Object.entries(groupedSessions).map(([key, sessions]) => [
      key,
      sessions.filter((session) => !session.archived), // Implicit falsy check
    ])
  );

  return (
    <>
      <Tabs
        id="attendance-tabs"
        activeKey={activeTab}
        onSelect={(key) => setActiveTab(key)}
        className="mb-3"
      >
        <Tab eventKey="unarchived" title="Vipindi Visivyohifadhiwa">
          {renderSessions(groupedUnarchived, false)}
        </Tab>
        <Tab eventKey="archived" title="Vipindi Vilivyohifadhiwa">
          {renderSessions(groupedArchived, true)}
        </Tab>
      </Tabs>

      {/* ToastContainer to render toast notifications */}
      <ToastContainer />
    </>
  );
};

export default SessionList;
