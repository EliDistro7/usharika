
const express = require('express');
const router = express.Router();
const { 
           registerAdmin,
           loginAdmin,
           addRegisteringNotification,
           markRegisteringNotificationAsRead,
           getAdminById } = require('../controllers/admin-controller.js');
const { verifyUser, unverifyUser } = require('../controllers/user-controller.js');



// Admin registration route
router.post('/admin/register', registerAdmin);

router.post('/admin/addRegisterNotifications', addRegisteringNotification);

// Admin login route
router.post('/admin/login', loginAdmin);

// Route to verify a user (set verified to true)
router.post('/verify-user', verifyUser);

// Route to unverify a user (set verified to false)
router.post('/unverify-user', unverifyUser);

router.get('/admin/:adminId', getAdminById);

router.post('/admin/markNotificationAsRead', markRegisteringNotificationAsRead);



module.exports = router;
