



const express = require('express');
const router = express.Router();
const {
    userRegister,
    userLogIn,
    getUserDetail,
    addPledge,
    addPaymentMain,
    getUsersByRole,
    getUserDetailById,
    getAllUsers,
    pushMatangazoNotification,
    getUserNotifications,
    markNotificationAsRead,
    removeNotification,
} = require('../controllers/user-controller-yombo.js');

// User Routes
router.post('/registerYombo', userRegister);                    // Register a new user
router.post('/loginYombo', userLogIn);  
router.get('/:name', getUserDetail);  
router.get('/users/:userId', getUserDetailById);  
router.post('/allMembers', getAllUsers);
router.post('/addPayment', addPaymentMain);
router.post('/addPledge', addPledge);
router.post('/getUsersByRole', getUsersByRole);
router.post('/users/pushMatangazoNotifications', pushMatangazoNotification);
// Fetch notifications for a user
router.get("/users/:userId/notifications", getUserNotifications);

// Mark a specific notification as read
router.put(
    "/users/:userId/notifications/:notificationId/read",
    markNotificationAsRead
  );

  router.delete(
    "/users/:userId/notifications/:notificationId/remove",
    removeNotification
  );


/*// Log in a user
router.get('/:id', getUserDetail);                         // Get user details by ID
router.get('/checkEmail', checkEmailExists);               // Check if email exists
router.put('/user/:userId/follow', addFollower);           // Add a follower
router.put('/user/:userId/unfollow', removeFollower);      // Remove a follower
router.get('/user/:userId/followers', getUserWithFollowers); // Get user with followers

// Route to get a user's followers
router.get('/users/:userId/followers', getUserFollowers);

// Route to get a user's following list
router.get('/users/:userId/following', getUserFollowing);

router.post('/users/lazy', getAllUsers);

// New Route for updating the user profile
router.put('/user/:userId/update-profile', updateUserProfile); // Update user profile (avatar, phone, location, bio)

// new route fo deleting use
router.post('/user/:userId/delete-profile', deleteUser)


*/
module.exports = router;
