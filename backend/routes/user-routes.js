const express = require('express');
const router = express.Router();
const {
    userRegister,
    userLogIn,
    getUserDetail,
    checkEmailExists,
    getAllUsers,  // New import for fetching all users (for lazy loading)
    addFollower,
    removeFollower,
    getUserWithFollowers,
    updateUserProfile,
    getUserFollowers,
    getUsersBornThisMonth,
    getUserFollowing,  // New import for fetching user's followers and following list (for lazy loading)
    deleteUser,  // New import for updating user profile
} = require('../controllers/user-controller.js');

// User Routes
router.post('/register', userRegister);                    // Register a new user
router.post('/login', userLogIn);                          // Log in a user
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

// Route to get users born this month
router.get('/users/born-this-month', getUsersBornThisMonth);

module.exports = router;
