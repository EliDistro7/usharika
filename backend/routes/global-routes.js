
const express = require('express');
const router = express.Router();

// Import the controllers for the existing global functionalities
const {
    getActiveUsers,
    addActiveUser,
    getTotalUsersToday,
    updateTotalUsersToday,
    getTrendingTopics,
    getTrendingTopics2,
    updateSystemMetrics,
    addOrUpdateTrendingTopic,
    removeTrendingTopic,
    getSiteAnnouncements,
    addSiteAnnouncement,
    removeSiteAnnouncement,
    incrementTotalPosts,
    getGlobalInfo,
} = require('../controllers/global-controller.js'); // Adjust the path as necessary


// Routes for existing global functionalities

//console.log('here is  global route directory')

// Get all active users
router.get('/activeusers', getActiveUsers);

// Get global info
router.get('/global-info', getGlobalInfo);

// Add an active user
router.post('/addactiveusers', addActiveUser);

// Get total users today
router.get('/totaluserstoday', getTotalUsersToday);

// Update total users today
router.put('/updatetotaluserstoday', updateTotalUsersToday);

// Update system metrics (totalUsers, totalPosts, postsToday)
router.put('/systemmetrics', updateSystemMetrics);

// Get trending topics
router.get('/trending/posts', getTrendingTopics);

router.get('/trending/posts/general', getTrendingTopics2);

// Add or update a trending topic
router.post('/addorupdatetrending-topics', addOrUpdateTrendingTopic);

// Remove a trending topic
router.delete('/removetrendingtopics/:topic', removeTrendingTopic);

// Get all site announcements
router.get('/siteannouncements', getSiteAnnouncements)

// Add a site announcement
router.post('/add-site-announcements', addSiteAnnouncement);

// Remove a site announcement
router.delete('/remove-site-announcements/:id', removeSiteAnnouncement);

// Increment the total number of posts
router.post('/increment-total-posts', incrementTotalPosts);






module.exports = router;
