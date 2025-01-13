import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HighlightsTable from "./HighlightsTable";
import AddContentModal from "./AddContentModal2";
import Cookies from "js-cookie";
import { getRecentHighlights, addMediaToTab, addNewTab } from "@/actions/highlight";

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
    newGroupName: "", // Added for creating new tabs
    highlightId: "", // Selected highlight ID
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

      const highlight = highlights[0]; // Assuming first highlight; adjust as necessary.
      if (!highlight) {
        toast.error("No highlight available to add a new tab.");
        return;
      }

      const tabData = {
        groupName: newContent.newGroupName.trim(), // Use the provided newGroupName
        content: [], // New tab starts with empty content.
      };

      await addNewTab({
        highlightId: highlight._id,
        tabData,
      });

      toast.success(`New tab "${newContent.newGroupName}" added successfully!`);
      await fetchHighlights();
      setShowAddContentModal(false);
      setNewContent((prev) => ({ ...prev, newGroupName: "" })); // Reset newGroupName
    } catch (err) {
      toast.error(err.message || "Failed to add a new tab.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner animation="border" role="status" />;

  return (
    <>
      <HighlightsTable
        highlights={highlights}
        onAddContent={() => setShowAddContentModal(true)}
      />
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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
      />
    </>
  );
};

export default RecentHighlightsTable;
