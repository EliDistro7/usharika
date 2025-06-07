import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HighlightsTable from "./HighlightsTable";
import AddContentModal from "./AddContentModal2";
import Cookies from "js-cookie";
import { getRecentHighlights, addMediaToTab, addNewTab } from "@/actions/highlight";
import { Sparkles, Clock, RefreshCw } from "lucide-react";

const RecentHighlightsTable = () => {
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddContentModal, setShowAddContentModal] = useState(false);
  const [newContent, setNewContent] = useState({
    title: "",
    description: "",
    mediaType: "image",
    imageUrl: "",
    videoUrl: "",
    groupName: "",
    newGroupName: "",
    highlightId: "",
  });

  const fetchHighlights = async () => {
    try {
      setLoading(true);
      const recentHighlights = await getRecentHighlights();
      setHighlights(recentHighlights.data);
    } catch {
      toast.error("Failed to load recent highlights.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHighlights();
  }, []);

  const handleAddContent = async () => {
    if (!newContent.groupName) {
      toast.error("Please select a group (tab) to add the content.");
      return;
    }

    try {
      setLoading(true);
      const highlight = highlights.find((h) =>
        h.content.some((tab) => tab.groupName === newContent.groupName)
      );
      if (!highlight) {
        toast.error("No matching highlight found for the selected group.");
        return;
      }

      const tabIndex = highlight.content.findIndex(
        (tab) => tab.groupName === newContent.groupName
      );

      if (tabIndex === -1) {
        toast.error("Tab not found.");
        return;
      }

      const newMedia = {
        description: newContent.description,
        imageUrl: newContent.mediaType === "image" ? newContent.imageUrl : null,
        videoUrl: newContent.mediaType === "video" ? newContent.videoUrl : null,
        author: Cookies.get('role'),
      };

      await addMediaToTab({
        highlightId: highlight._id,
        tabKey: tabIndex,
        newMedia,
      });

      toast.success("Media added successfully!");
      await fetchHighlights();
      setShowAddContentModal(false);
    } catch (err) {
      toast.error(err.message || "Failed to add media to the tab.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewTab = async () => {
    if (!newContent.newGroupName.trim()) {
      toast.error("Please enter a group name for the new tab.");
      return;
    }

    try {
      setLoading(true);

      const highlight = highlights[0];
      if (!highlight) {
        toast.error("No highlight available to add a new tab.");
        return;
      }

      const tabData = {
        groupName: newContent.newGroupName.trim(),
        content: [],
      };

      await addNewTab({
        highlightId: highlight._id,
        tabData,
      });

      toast.success(`Umefanikiwa kuongeza "${newContent.newGroupName}" kwenye chapters!`);
      await fetchHighlights();
      setShowAddContentModal(false);
      setNewContent((prev) => ({ ...prev, newGroupName: "" }));
    } catch (err) {
      toast.error(err.message || "Imeshindwa kuongezwa.");
    } finally {
      setLoading(false);
    }
  };

  const customStyles = {
    container: {
      background: 'linear-gradient(135deg, #f8f9ff 0%, #e8ecff 100%)',
      minHeight: '100vh',
      padding: '30px',
      paddingLeft: '20px',
      paddingRight: '20px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    header: {
      background: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '20px',
      padding: '30px',
      marginBottom: '30px',
      boxShadow: '0 10px 30px rgba(124, 58, 237, 0.1)',
      border: '1px solid rgba(124, 58, 237, 0.1)',
      backdropFilter: 'blur(10px)',
    },
    headerTitle: {
      background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontSize: '32px',
      fontWeight: '700',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
    },
    headerSubtitle: {
      color: '#6b7280',
      fontSize: '16px',
      margin: '10px 0 0 0',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    contentCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      padding: '0',
      boxShadow: '0 20px 40px rgba(124, 58, 237, 0.12)',
      border: '1px solid rgba(124, 58, 237, 0.1)',
      overflow: 'hidden',
      backdropFilter: 'blur(15px)',
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '400px',
      background: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(124, 58, 237, 0.1)',
    },
    loadingSpinner: {
      width: '50px',
      height: '50px',
      color: '#7c3aed',
      marginBottom: '20px',
    },
    loadingText: {
      color: '#7c3aed',
      fontSize: '18px',
      fontWeight: '600',
    },
    refreshButton: {
      background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
      border: 'none',
      borderRadius: '12px',
      padding: '12px 20px',
      color: 'white',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
      marginLeft: 'auto',
    },
    statsContainer: {
      display: 'flex',
      gap: '20px',
      marginTop: '20px',
    },
    statCard: {
      background: 'rgba(124, 58, 237, 0.1)',
      borderRadius: '12px',
      padding: '15px 20px',
      flex: 1,
      textAlign: 'center',
      border: '1px solid rgba(124, 58, 237, 0.2)',
    },
    statNumber: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#7c3aed',
      margin: 0,
    },
    statLabel: {
      fontSize: '14px',
      color: '#6b7280',
      margin: '5px 0 0 0',
    },
  };

  // Custom toast configuration
  const toastConfig = {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    style: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '12px',
      border: '1px solid rgba(124, 58, 237, 0.2)',
      backdropFilter: 'blur(10px)',
    },
    progressStyle: {
      background: 'linear-gradient(90deg, #7c3aed 0%, #a855f7 100%)',
    },
  };

  if (loading) {
    return (
      <div style={customStyles.container}>
        <div style={customStyles.loadingContainer}>
          <div style={customStyles.loadingSpinner}>
            <Spinner animation="border" />
          </div>
          <div style={customStyles.loadingText}>
            Loading Recent Highlights...
          </div>
          <div style={{ color: '#9ca3af', fontSize: '14px', marginTop: '8px' }}>
            Please wait while we fetch your data
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={customStyles.container}>
      {/* Header Section */}
      <div style={customStyles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={customStyles.headerTitle}>
              <Sparkles size={32} />
              Recent Highlights
            </h1>
            <p style={customStyles.headerSubtitle}>
              <Clock size={16} />
              Manage your latest content highlights and chapters
            </p>
          </div>
          <button 
            style={customStyles.refreshButton}
            onClick={fetchHighlights}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(124, 58, 237, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(124, 58, 237, 0.3)';
            }}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
        
        {/* Stats Cards */}
        <div style={customStyles.statsContainer}>
          <div style={customStyles.statCard}>
            <div style={customStyles.statNumber}>{highlights.length}</div>
            <div style={customStyles.statLabel}>Total Highlights</div>
          </div>
          <div style={customStyles.statCard}>
            <div style={customStyles.statNumber}>
              {highlights.reduce((acc, h) => acc + (h.content?.length || 0), 0)}
            </div>
            <div style={customStyles.statLabel}>Total Chapters</div>
          </div>
          <div style={customStyles.statCard}>
            <div style={customStyles.statNumber}>
              {highlights.reduce((acc, h) => 
                acc + (h.content?.reduce((tabAcc, tab) => 
                  tabAcc + (tab.content?.length || 0), 0) || 0), 0)}
            </div>
            <div style={customStyles.statLabel}>Total Media</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={customStyles.contentCard}>
        <HighlightsTable
          highlights={highlights}
          onAddContent={() => setShowAddContentModal(true)}
        />
      </div>

      {/* Add Content Modal */}
      <AddContentModal
        show={showAddContentModal}
        onClose={() => setShowAddContentModal(false)}
        newContent={newContent}
        highlights={highlights}
        onContentChange={(key, value) =>
          setNewContent((prev) => ({ ...prev, [key]: value }))
        }
        onAdd={handleAddContent}
        onAddNewTab={handleAddNewTab}
      />

      {/* Enhanced Toast Container */}
      <ToastContainer
        {...toastConfig}
        toastStyle={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '12px',
          border: '1px solid rgba(124, 58, 237, 0.2)',
          backdropFilter: 'blur(10px)',
          color: '#374151',
          fontWeight: '500',
        }}
      />

      {/* Custom CSS for enhanced animations */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        .Toastify__toast--success {
          background: rgba(16, 185, 129, 0.1) !important;
          border: 1px solid rgba(16, 185, 129, 0.3) !important;
          color: #059669 !important;
        }
        
        .Toastify__toast--error {
          background: rgba(239, 68, 68, 0.1) !important;
          border: 1px solid rgba(239, 68, 68, 0.3) !important;
          color: #dc2626 !important;
        }
        
        .Toastify__progress-bar--success {
          background: linear-gradient(90deg, #10b981 0%, #34d399 100%) !important;
        }
        
        .Toastify__progress-bar--error {
          background: linear-gradient(90deg, #ef4444 0%, #f87171 100%) !important;
        }
        
        .Toastify__toast {
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        * {
          scrollbar-width: thin;
          scrollbar-color: #a855f7 #e0e7ff;
        }

        *::-webkit-scrollbar {
          width: 8px;
        }

        *::-webkit-scrollbar-track {
          background: #e0e7ff;
          border-radius: 4px;
        }

        *::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
          border-radius: 4px;
        }

        *::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #6d28d9 0%, #9333ea 100%);
        }
      `}</style>
    </div>
  );
};

export default RecentHighlightsTable;