


const Highlight = require("../models/yombo/highlightSchema"); // Import the Highlight model

// Create a New Highlight
const createHighlight = async (req, res) => {
  try {
    const { name, content } = req.body;

    // Validate required fields
    if (!name || !content || typeof content !== "object") {
      return res.status(400).json({
        message: "Name and content are required, and content must be an object.",
      });
    }

    // Initialize the Highlight object
    const highlight = new Highlight({
      name,
      content,
    });

    // Save the highlight to the database
    const savedHighlight = await highlight.save();

    return res.status(201).json({
      message: "Highlight created successfully",
      data: savedHighlight,
    });
  } catch (error) {
    console.error("Error creating highlight:", error);
    return res.status(500).json({
      message: "Server error while creating highlight",
      error: error.message,
    });
  }
};

// Fetch Highlights not older than 3 days
const getRecentHighlights = async (req, res) => {
  try {
    // Calculate the date for 3 days ago
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    // Query highlights created within the last 3 days
    const recentHighlights = await Highlight.find({
      createdAt: { $gte: threeDaysAgo },
    }).sort({ createdAt: -1 }); // Sort by most recent

    return res.status(200).json({
      message: "Recent highlights fetched successfully",
      data: recentHighlights,
    });
  } catch (error) {
    console.error("Error fetching recent highlights:", error);
    return res.status(500).json({
      message: "Server error while fetching highlights",
      error: error.message,
    });
  }
};

const addMediaToTab = async (req, res) => {
  try {
    const { highlightId, tabKey, newMedia } = req.body;

    if (!highlightId || tabKey === undefined || !newMedia) {
      return res.status(400).json({
        message: "Highlight ID, tab key, and new media are required.",
      });
    }

    // Find the highlight and ensure the tab exists
    const highlight = await Highlight.findById(highlightId);
    if (!highlight) {
      return res.status(404).json({ message: "Highlight not found." });
    }

    // Find the specified tab by index
    const targetTab = highlight.content[tabKey];
    if (!targetTab) {
      return res.status(404).json({ message: "Tab not found." });
    }

    // Push the new media to the tab's content array
    targetTab.content.push(newMedia);

    // Save the updated highlight
    await highlight.save();

    return res.status(200).json({
      message: "Media added to tab successfully",
      data: highlight,
    });
  } catch (error) {
    console.error("Error adding media to tab:", error);
    return res.status(500).json({
      message: "Server error while adding media to tab",
      error: error.message,
    });
  }
};


const addNewTab = async (req, res) => {
  try {
    const { highlightId, tabData } = req.body;

    if (!highlightId || !tabData || !tabData.groupName) {
      return res.status(400).json({
        message: "Highlight ID and tab data with group name are required.",
      });
    }

    // Add a new tab to the content array
    const updatedHighlight = await Highlight.findByIdAndUpdate(
      highlightId,
      {
        $push: {
          content: tabData, // Directly push the new tab data
        },
      },
      { new: true }
    );

    if (!updatedHighlight) {
      return res.status(404).json({
        message: "Highlight not found.",
      });
    }

    return res.status(200).json({
      message: "New tab added successfully",
      data: updatedHighlight,
    });
  } catch (error) {
    console.error("Error adding new tab:", error);
    return res.status(500).json({
      message: "Server error while adding new tab",
      error: error.message,
    });
  }
};

// Delete Media from a Tab
const deleteMediaFromTab = async (req, res) => {
  try {
    const { highlightId, tabKey, mediaId } = req.body;

    // Validate required fields
    if (!highlightId || !tabKey || !mediaId) {
      return res.status(400).json({
        message: "Highlight ID, tab key, and media ID are required.",
      });
    }

    // Remove the specified media from the tab
    const updatedHighlight = await Highlight.findOneAndUpdate(
      { _id: highlightId },
      {
        $pull: {
          [`content.${tabKey}.content`]: { _id: mediaId },
        },
      },
      { new: true }
    );

    if (!updatedHighlight) {
      return res.status(404).json({
        message: "Highlight, tab, or media not found.",
      });
    }

    return res.status(200).json({
      message: "Media deleted successfully",
      data: updatedHighlight,
    });
  } catch (error) {
    console.error("Error deleting media from tab:", error);
    return res.status(500).json({
      message: "Server error while deleting media from tab",
      error: error.message,
    });
  }
};

// Get Highlight by ID
const getHighlightById = async (req, res) => {
  try {
    const { highlightId } = req.params;

    if (!highlightId) {
      return res.status(400).json({
        message: "Highlight ID is required.",
      });
    }

    const highlight = await Highlight.findById(highlightId);

    if (!highlight) {
      return res.status(404).json({
        message: "Highlight not found.",
      });
    }

    return res.status(200).json({
      message: "Highlight retrieved successfully",
      data: highlight,
    });
  } catch (error) {
    console.error("Error retrieving highlight:", error);
    return res.status(500).json({
      message: "Server error while retrieving highlight",
      error: error.message,
    });
  }
};

module.exports = {
  createHighlight,
  addMediaToTab,
  addNewTab,
  deleteMediaFromTab,
  getHighlightById,
  getRecentHighlights,
};
