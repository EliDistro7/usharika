



const express = require('express');
const router = express.Router();
const {
    userRegister,
    userLogIn,
    getUserDetail,
    getUsersByGroupAndFieldType,
    addPledge,
    addPaymentMain,
    getUsersByRole,
    getUserDetailById,
    getAllUsers,
    pushMatangazoNotification,
    getUserNotifications,
    getUserDonations,
    addDonationAmount,
    markNotificationAsRead,
    removeNotification,
    pinNotification,
    createDonation,
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
router.post('/users/createDonation', createDonation);
// Fetch notifications for a user
router.get("/users/:userId/notifications", getUserNotifications);

router.get("/users/:userId/donations", getUserDonations);

// Fetch donations by group and field type
router.post("/users/getDonations", getUsersByGroupAndFieldType);

router.patch("/users/:userId/donations/:donationId/add", addDonationAmount);



// Pin a specific notification
router.patch('/users/:userId/notifications/:notificationId/pin', pinNotification);

// Mark a specific notification as read
router.put(
    "/users/:userId/notifications/:notificationId/read",
    markNotificationAsRead
  );

  router.delete(
    "/users/:userId/notifications/:notificationId/remove",
    removeNotification
  );



module.exports = router;
