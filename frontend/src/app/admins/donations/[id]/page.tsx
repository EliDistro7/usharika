'use client';
import React, { useState } from "react";
import CreateDonation from "@/components/admins/CreateDonation";
import UserDonationsTable from "@/components/admins/UserDonationsTable";
import UserDonationsTableAll from "@/components/admins/UserDonationsTableAll";
import { getLoggedInUserId } from "@/hooks/useUser";
import Cookie from "js-cookie";
import { formatRoleName } from "@/actions/utils";
import CustomNavbar from "@/components/admins/CustomNavbar";
import Sidebar from "@/components/admins/Sidebar";

export default function AdminDonationsPage() {
  const [activeTab, setActiveTab] = useState("create");

  // Retrieve userId and group dynamically
  const userId = getLoggedInUserId();
  const group = Cookie.get("role") || "Unknown Group";

  const tabs = [
    { id: "create", label: "Anzisha Mchango", icon: "➕" },
    { id: "view", label: "Angalia Michango", icon: "👀" },
    { id: "all", label: "Balances", icon: "💰" }
  ];

  return (
    <>
      <Sidebar>
        <div className="min-h-screen bg-background-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-display font-bold text-text-primary mb-2">
                Mfumo wa Michango
              </h1>
              <p className="text-text-secondary text-lg">
                Dhibiti michango ya kikundi chako
              </p>
            </div>

            {/* Custom Breadcrumb Navigation */}
            <div className="mb-8">
              <nav className="flex space-x-1 bg-white rounded-2xl p-2 shadow-soft border border-border-light">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center space-x-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 ease-out
                      ${activeTab === tab.id 
                        ? 'bg-primary-gradient text-white shadow-primary transform scale-105' 
                        : 'text-text-secondary hover:text-text-primary hover:bg-background-200 hover:scale-102'
                      }
                    `}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content Container */}
            <div className="bg-white rounded-3xl shadow-medium border border-border-light overflow-hidden">
              <div className="animate-fade-in">
                {activeTab === "create" && (
                  <div className="p-8">
                    <div className="mb-6 pb-6 border-b border-border-light">
                      <h2 className="text-2xl font-display font-bold text-text-primary flex items-center space-x-3">
                        <span className="w-10 h-10 bg-primary-gradient rounded-xl flex items-center justify-center text-white text-xl">
                          ➕
                        </span>
                        <span>Unda Mchango Mpya</span>
                      </h2>
                      <p className="text-text-secondary mt-2 ml-13">
                        Jaza fomu ili kuanzisha mchango mpya kwa kikundi
                      </p>
                    </div>
                    <CreateDonation />
                  </div>
                )}

                {activeTab === "view" && (
                  <div className="p-8">
                    <div className="mb-6 pb-6 border-b border-border-light">
                      <h2 className="text-2xl font-display font-bold text-text-primary flex items-center space-x-3">
                        <span className="w-10 h-10 bg-yellow-gradient rounded-xl flex items-center justify-center text-white text-xl">
                          👀
                        </span>
                        <span>Michango Yako</span>
                      </h2>
                      <p className="text-text-secondary mt-2 ml-13">
                        Angalia michango yako ya kibinafsi na historia yake
                      </p>
                    </div>
                    <UserDonationsTable
                      userId={userId}
                      group={group}
                      field_type="michango"
                    />
                  </div>
                )}

                {activeTab === "all" && (
                  <div className="p-8">
                    <div className="mb-6 pb-6 border-b border-border-light">
                      <h2 className="text-2xl font-display font-bold text-text-primary flex items-center space-x-3">
                        <span className="w-10 h-10 bg-green-gradient rounded-xl flex items-center justify-center text-white text-xl">
                          💰
                        </span>
                        <span>Mizani ya Michango</span>
                      </h2>
                      <p className="text-text-secondary mt-2 ml-13">
                        Angalia mizani ya wanachama wote wa kikundi
                      </p>
                    </div>
                    <UserDonationsTableAll
                      userId={userId}
                      group={group}
                      field_type="michango"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Footer Info Card */}
            <div className="mt-8 bg-primary-gradient rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg mb-1">
                    Kikundi: {formatRoleName(group)}
                  </h3>
                  <p className="text-purple-100 text-sm">
                    Utawala wa michango kwa kikundi chako
                  </p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <span className="text-3xl">🏛️</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Sidebar>
    </>
  );
}