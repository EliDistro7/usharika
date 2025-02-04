'use client';

import React, { useState, useEffect } from "react";
import Team from "@/components/Team";
import { getDefaultRoles, getLeadersByRole } from "@/actions/users";
import { formatRoleName2 } from "@/actions/utils";
import { Tabs, Tab } from "react-bootstrap";
import Image from "next/image";

const Leadership: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const groupedRoles = userRoles.reduce((acc, role) => {
    const prefix = role.split("_")[1];
    if (!acc[prefix]) {
      acc[prefix] = [];
    }
    acc[prefix].push(role);
    return acc;
  }, {} as Record<string, string[]>);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const defaultRoles = await getDefaultRoles();
        const leaderRoleNames = defaultRoles
          .filter((roleObj: any) => roleObj.role.startsWith("kiongozi"))
          .map((roleObj: any) => roleObj.role);
        setUserRoles(leaderRoleNames);
        if (leaderRoleNames.length > 0) {
          setActiveTab(leaderRoleNames[0]);
        }
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    if (activeTab) {
      const fetchLeaders = async () => {
        setLoading(true);
        try {
          const leadersData = await getLeadersByRole(activeTab);
          setLeaders(leadersData.leaders);
        } catch (error) {
          console.error(`Failed to fetch leaders for role ${activeTab}:`, error);
        } finally {
          setLoading(false);
        }
      };
      fetchLeaders();
    }
  }, [activeTab]);

  return (
    <div className="p-3 p-md-4 pt-0" style={{ backgroundColor: "#f8f1fc" }}>
      <div className="text-center mb-5">
        <div className="bg-white p-4 p-md-5 rounded-lg">
          <div
            className="mb-4"
            style={{
              width: '100%',
              height: '400px',
              overflow: 'hidden',
              borderRadius: '10px',
              position: 'relative',
              backgroundColor: imageLoaded ? 'transparent' : '#eee', // Placeholder background
            }}
          >
            {!imageLoaded && !imageError && (
              <p style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#888' }}>
                Loading image...
              </p>
            )}

            {imageError ? (
              <p style={{ textAlign: 'center', paddingTop: '180px', color: 'red' }}>
                Failed to load image.
              </p>
            ) : (
              <Image
                src="/img/mchungaji.jpg"
                alt="Deogratias Katabazi"
                layout="fill"
                objectFit="cover"
                priority
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            )}
          </div>

          <h2 className="display-4 font-weight-bold text-dark mb-3">Deogratias Katabazi</h2>
          <p className="h5 text-purple font-weight-medium">Mchungaji Kiongozi</p>
        </div>
      </div>

      <Tabs
        id="role-tabs"
        activeKey={activeTab || ""}
        onSelect={(key) => setActiveTab(key as string)}
        className="mb-0"
      >
        {Object.entries(groupedRoles).map(([prefix, roles]) => (
          <Tab
            key={prefix}
            eventKey={prefix}
            title={
              <span className="text-capitalize font-weight-bold text-dark">
                {prefix}
              </span>
            }
          >
            <div className="d-flex flex-wrap justify-content-center gap-2 gap-md-3 bg-white p-3 p-md-4 rounded-lg shadow-sm mt-4">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => setActiveTab(role)}
                  className={`btn btn-lg px-4 py-2 px-md-5 py-md-3 rounded-pill font-weight-bold ${
                    activeTab === role
                      ? "btn-purple text-white"
                      : "btn-outline-purple"
                  }`}
                >
                  {formatRoleName2(role)}
                </button>
              ))}
            </div>
          </Tab>
        ))}
      </Tabs>

      <div className="mt-5">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <div className="spinner-border text-purple" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="ml-3 text-purple font-weight-medium mb-0">Loading leaders...</p>
          </div>
        ) : (
          <Team leaders={leaders} activeSelection={activeTab ? formatRoleName2(activeTab) : ""} />
        )}
      </div>
    </div>
  );
};

export default Leadership;
