'use client';

import React, { useEffect, useState } from "react";
import { 
  Pin, 
  Calendar, 
  User, 
  TrendingUp, 
  LogOut, 
  Download, 
  Tag, 
  CheckCircle, 
  Target, 
  BarChart3, 
  Clock,
  HelpCircle,
  Check,
  X
} from "lucide-react";
import NavbarTabs from "./NavbarTabs";
import { getUserNotifications, getUserDonations } from "@/actions/users";
import { getLoggedInUserId, removeCookie } from "@/hooks/useUser";
import Donations from './Donations';
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Check if the user has any "kiongozi" roles
const hasKiongoziRole = (roles) => roles.some((role) => role.startsWith("kiongozi"));

// Enhanced Pinned Announcements Component
const PinnedAnnouncements = ({ notifications }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pinned = notifications.filter((notification) => notification.pinned);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary-gradient text-white font-semibold rounded-full px-5 py-2.5 shadow-primary transition-all duration-300 hover:shadow-primary-lg hover:-translate-y-0.5 flex items-center justify-between min-w-[180px]"
      >
        <Pin className="w-4 h-4 mr-2" />
        <span className="flex-grow text-left">Matangazo</span>
        {pinned.length > 0 && (
          <span className="bg-white/25 text-white rounded-full px-2 py-1 text-xs font-semibold ml-2 min-w-[20px] text-center">
            {pinned.length}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div 
          className="absolute right-0 top-full mt-2 w-[350px] max-h-96 overflow-y-auto bg-white rounded-3xl shadow-strong border border-border-light animate-slide-down z-50"
          onMouseLeave={() => setIsOpen(false)}
        >
          {pinned.length > 0 ? (
            <div className="p-2">
              {pinned.map((announcement, index) => (
                <div 
                  key={index}
                  className="p-4 mb-2 mx-2 rounded-2xl bg-gradient-to-br from-background-200 to-background-300 border border-border-accent/10 transition-all duration-300 hover:bg-primary-gradient hover:text-white group"
                >
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-primary-600 mt-2 mr-3 flex-shrink-0 group-hover:bg-white"></div>
                    <div className="flex-grow">
                      <p className="mb-2 font-medium text-sm leading-relaxed">
                        {announcement.message}
                      </p>
                      <div className="text-xs text-text-tertiary group-hover:text-white/75 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(announcement.time).toLocaleDateString('sw-TZ', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-text-tertiary">
                <Pin className="w-10 h-10 mx-auto opacity-30 mb-4" />
                <p className="text-text-tertiary">Hakuna matangazo uliyo-pin.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Dashboard = ({ user, summary }) => {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const isKiongozi = hasKiongoziRole(user?.selectedRoles || []);
  const userRoles = user?.selectedRoles || [];

  const pledges = [
    { title: "Ahadi", paid: user?.pledges?.paidAhadi || 0, total: user?.pledges?.ahadi || 0 },
    { title: "Jengo", paid: user?.pledges?.paidJengo || 0, total: user?.pledges?.jengo || 0 },
    ...(user?.pledges?.other
      ? Object.keys(user?.pledges?.other).map((key) => ({
          title: key,
          paid: user?.pledges?.other[key]?.paid || 0,
          total: user?.pledges?.other[key]?.total || 0,
        }))
      : []),
  ];

  // Fetch admin notifications
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        const notifications = await getUserNotifications(getLoggedInUserId());
        setNotifications(notifications || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    loadNotifications();
  }, []);

  const confirmLogout = (isConfirmed) => {
    if (isConfirmed) {
      removeCookie();
      router.push("/");
    } else {
      toast.dismiss();
    }
  };

  const handleLogout = () => {
    toast.info(
      <div className="text-center p-3">
        <div className="mb-3">
          <HelpCircle className="w-10 h-10 mx-auto text-primary-600" />
        </div>
        <h6 className="mb-3 font-semibold">Unataka ku-log-out?</h6>
        <div className="flex gap-3 justify-center">
          <button
            className="bg-error-500 hover:bg-error-600 text-white font-semibold rounded-full px-4 py-2 transition-all duration-200 flex items-center"
            onClick={() => confirmLogout(true)}
          >
            <Check className="w-4 h-4 mr-1" />
            Ndio
          </button>
          <button
            className="bg-text-secondary hover:bg-text-primary text-white font-semibold rounded-full px-4 py-2 transition-all duration-200 flex items-center"
            onClick={() => confirmLogout(false)}
          >
            <X className="w-4 h-4 mr-1" />
            Hapana
          </button>
        </div>
      </div>,
      { 
        autoClose: false,
        closeButton: false,
        className: 'custom-toast'
      }
    );
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    
    // Add a title with styling
    doc.setFontSize(20);
    doc.setTextColor(111, 66, 193);
    doc.text("Ripoti ya Sadaka za Kanisa", 14, 25);
    
    // Add date
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Tarehe: ${new Date().toLocaleDateString('sw-TZ')}`, 14, 35);

    // Format table data
    const tableColumn = ["Aina", "Kilicholipwa (TZS)", "Iliyoahidiwa (TZS)", "Maendeleo (%)", "Iliyobaki (TZS)"];
    const tableRows = pledges.map((pledge) => [
      pledge.title,
      pledge.paid.toLocaleString(),
      pledge.total.toLocaleString(),
      `${Math.round((pledge.paid / pledge.total) * 100)}%`,
      (pledge.total - pledge.paid).toLocaleString(),
    ]);

    // Add the table with enhanced styling
    doc.autoTable({
      startY: 45,
      head: [tableColumn],
      body: tableRows,
      styles: { 
        fontSize: 10,
        cellPadding: 8
      },
      headStyles: {
        fillColor: [111, 66, 193],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [248, 249, 255]
      },
      theme: "striped",
    });

    doc.save("Ripoti_Sadaka_za_Kanisa.pdf");
  };

  return (
    <div className="min-h-screen bg-light-gradient py-5">
      <div className="container mx-auto px-4 animate-fade-in">
        {/* Enhanced Navbar */}
        <div className=" rounded-4xl p-4 mb-6 animate-slide-up">
          <NavbarTabs roles={userRoles} notifications={notifications || []} user={user} />
        </div>
        
        {/* Enhanced Header Section */}
        <div className=" rounded-4xl p-6 lg:p-8 mb-6 animate-slide-up">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center">
              <div className="w-15 h-15 bg-primary-gradient rounded-full flex items-center justify-center text-white text-2xl shadow-primary flex-shrink-0 mr-4">
                <User className="w-7 h-7" />
              </div>
              <div className="flex-grow">
              
                <p className="text-text-secondary flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Hali ya sadaka zako za kanisa
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
              <PinnedAnnouncements notifications={notifications} />
              <button 
                className="bg-gradient-to-r from-error-500 to-error-600 text-white font-semibold rounded-full px-6 py-2.5 shadow-soft hover:shadow-medium hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center min-w-[120px]"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span>Toka</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Donations Component */}
        <div className=" rounded-4xl p-6 lg:p-8 mb-6 animate-slide-up">
          <Donations />
        </div>

        {/* Enhanced Contributions Table */}
        <div className=" rounded-4xl overflow-hidden shadow-medium hover:shadow-strong hover:-translate-y-1 transition-all duration-300 animate-slide-up">
          <div className="bg-primary-gradient text-white p-6 lg:p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-50"></div>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between relative z-10">
              <div className="flex items-center mb-4 lg:mb-0">
                <div className="mr-3">
                  <BarChart3 className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-xl lg:text-2xl font-bold mb-1">Sadaka za Kanisa</h4>
                  <p className="text-white/75 text-sm">
                    Muhtasari wa michango yako
                  </p>
                </div>
              </div>
              <button
                className="bg-white/20 border-2 border-white/30 text-white font-semibold rounded-3xl px-6 py-2.5 backdrop-blur-sm hover:bg-white/30 hover:-translate-y-0.5 hover:shadow-soft transition-all duration-300 flex items-center justify-center min-w-[150px]"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4 mr-2" />
                <span>Pakua Ripoti</span>
              </button>
            </div>
          </div>
          
          <div className="p-0">
            {/* Desktop Table */}
            <div className="hidden xl:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-background-200 to-background-300">
                      <th className="text-left py-5 px-5 text-primary-700 font-bold text-xs uppercase tracking-wider">
                        <div className="flex items-center">
                          <Tag className="w-4 h-4 mr-2" />
                          Aina ya Sadaka
                        </div>
                      </th>
                      <th className="text-right py-5 px-5 text-primary-700 font-bold text-xs uppercase tracking-wider">
                        <div className="flex items-center justify-end">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Kilicholipwa
                        </div>
                      </th>
                      <th className="text-right py-5 px-5 text-primary-700 font-bold text-xs uppercase tracking-wider">
                        <div className="flex items-center justify-end">
                          <Target className="w-4 h-4 mr-2" />
                          Iliyoahidiwa
                        </div>
                      </th>
                      <th className="text-center py-5 px-5 text-primary-700 font-bold text-xs uppercase tracking-wider">
                        <div className="flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Maendeleo
                        </div>
                      </th>
                      <th className="text-right py-5 px-5 text-primary-700 font-bold text-xs uppercase tracking-wider">
                        <div className="flex items-center justify-end">
                          <Clock className="w-4 h-4 mr-2" />
                          Iliyobaki
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pledges.map((pledge, index) => (
                      <tr key={index} className="hover:bg-gradient-to-r hover:from-background-200 hover:to-background-300 hover:scale-[1.005] transition-all duration-300 border-t border-border-light">
                        <td className="py-5 px-5">
                          <div className="flex items-center">
                            <div 
                              className={`w-3 h-3 rounded-full mr-3 flex-shrink-0 ${
                                index % 2 === 0 ? 'bg-primary-600' : 'bg-purple-600'
                              }`}
                            ></div>
                            <strong className="text-text-primary font-semibold whitespace-nowrap">{pledge.title}</strong>
                          </div>
                        </td>
                        <td className="text-right py-5 px-5">
                          <span className="font-semibold text-success-600 font-mono">
                            TZS {pledge.paid.toLocaleString()}
                          </span>
                        </td>
                        <td className="text-right py-5 px-5">
                          <span className="font-semibold text-text-primary font-mono">
                            TZS {pledge.total.toLocaleString()}
                          </span>
                        </td>
                        <td className="text-center py-5 px-5">
                          <div className="relative">
                            <div className="w-full bg-gradient-to-r from-border-light to-background-300 rounded-full h-6 shadow-inner">
                              <div
                                className="bg-primary-gradient rounded-full h-6 shadow-primary relative overflow-hidden flex items-center justify-center"
                                style={{ width: `${Math.min((pledge.paid / pledge.total) * 100, 100)}%` }}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-50"></div>
                                <span className="text-white text-xs font-bold relative z-10">
                                  {Math.round((pledge.paid / pledge.total) * 100)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="text-right py-5 px-5">
                          <span className="font-semibold text-error-600 font-mono">
                            TZS {(pledge.total - pledge.paid).toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile/Tablet Cards */}
            <div className="xl:hidden p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {pledges.map((pledge, index) => (
                  <div key={index} className="glass rounded-3xl p-6 hover:shadow-medium hover:-translate-y-1 transition-all duration-300 border-l-4 border-primary-600">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <div 
                          className={`w-3 h-3 rounded-full mr-3 ${
                            index % 2 === 0 ? 'bg-primary-600' : 'bg-purple-600'
                          }`}
                        ></div>
                        <h6 className="font-bold text-primary-700">
                          {pledge.title}
                        </h6>
                      </div>
                      <span className="bg-primary-gradient text-white rounded-2xl px-3 py-2 text-sm font-semibold">
                        {Math.round((pledge.paid / pledge.total) * 100)}%
                      </span>
                    </div>
                    
                    <div className="mb-6">
                      <div className="w-full bg-gradient-to-r from-border-light to-background-300 rounded-full h-6 shadow-inner">
                        <div
                          className="bg-primary-gradient rounded-full h-6 shadow-primary relative overflow-hidden"
                          style={{ width: `${Math.min((pledge.paid / pledge.total) * 100, 100)}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-50"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-gradient-to-br from-background-200 to-background-300 rounded-2xl p-4 text-center hover:bg-primary-gradient hover:text-white transition-all duration-300 group">
                        <div className="text-xs text-text-tertiary group-hover:text-white/75 font-semibold mb-1">Kilicholipwa</div>
                        <div className="font-bold text-success-600 group-hover:text-white text-sm">
                          TZS {(pledge.paid / 1000000).toFixed(1)}M
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-background-200 to-background-300 rounded-2xl p-4 text-center hover:bg-primary-gradient hover:text-white transition-all duration-300 group">
                        <div className="text-xs text-text-tertiary group-hover:text-white/75 font-semibold mb-1">Lengo</div>
                        <div className="font-bold text-text-primary group-hover:text-white text-sm">
                          TZS {(pledge.total / 1000000).toFixed(1)}M
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-background-200 to-background-300 rounded-2xl p-4 text-center hover:bg-primary-gradient hover:text-white transition-all duration-300 group">
                        <div className="text-xs text-text-tertiary group-hover:text-white/75 font-semibold mb-1">Imebaki</div>
                        <div className="font-bold text-error-600 group-hover:text-white text-sm">
                          TZS {((pledge.total - pledge.paid) / 1000000).toFixed(1)}M
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastClassName="rounded-3xl shadow-strong border border-white/20 backdrop-blur-lg bg-white/95"
        bodyClassName="p-5"
        style={{
          marginTop: '80px'
        }}
      />
    </div>
  );
};

export default Dashboard;