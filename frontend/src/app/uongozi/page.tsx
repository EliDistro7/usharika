'use client';

import React, { useState } from "react";
import Team from "@/components/Team";
import {
  pastoralTeam,
  eldersCouncil,
  fathersGroup,
  mothersGroup,
  youthGroup,
  bibleStudy,
  choirs,
} from "@/data/main";

const Leadership: React.FC = () => {
  const [activeTab, setActiveTab] = useState("pastoral");

  const tabs = [
    { id: "pastoral", title: "Ofisi ya Mchungaji", data: pastoralTeam },
    { id: "elders", title: "Baraza la Wazee", data: eldersCouncil },
    { id: "fathers", title: "Wababa", data: fathersGroup },
    { id: "mothers", title: "Wamama", data: mothersGroup },
    { id: "youth", title: "Vijana", data: youthGroup },
    { id: "bible", title: "Fellowship & Bible Study", data: bibleStudy },
    { id: "choirs", title: "Vikundi vya Uimbaji", data: choirs },
  ];

  const activeTabData = tabs.find((tab) => tab.id === activeTab)?.data || [];

  return (
    <div className="container py-5">
      <h2 className="text-center text-primary mb-4">Uongozi wa Kanisa</h2>
      <ul className="nav nav-tabs justify-content-center" role="tablist">
        {tabs.map((tab) => (
          <li className="nav-item" key={tab.id}>
            <a
              className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
              href="#!"
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.title}
            </a>
          </li>
        ))}
      </ul>
      <div className="tab-content mt-4">
        <Team
          title={tabs.find((tab) => tab.id === activeTab)?.title || ""}
          subtitle="Kutana na watumishi wa Usharika wetu"
          members={activeTabData}
        />
      </div>
    </div>
  );
};

export default Leadership;
