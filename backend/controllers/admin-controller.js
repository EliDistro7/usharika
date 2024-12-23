

const Post = require('../models/postSchema.js');
const Admin = require('../models/adminSchema.js');
const bcrypt = require('bcrypt');



const createStaticAdmin = async () => {
  const email = 'nishauri@gmail.com';
  const password = 'bari@brianna@nishauri2024';

  try {
    // Check if the admin already exists
    let admin = await Admin.findOne({ email });
    if (admin) {
      console.log('Admin already exists',admin);
      return;
    }

    if (!admin) {
      // Hash the static password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the new admin
      admin = new Admin({
        username: 'Admin_1', // You can customize this
        email,
        password: hashedPassword,
      });

      // Save the admin to the database
      await admin.save();
      console.log('Admin created successfully',admin);
    } else {
      console.log('Admin already exists');
    }
  } catch (error) {
    //console.error('Error creating admin:', error.message);
  }
};

createStaticAdmin();

const registerAdmin = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if admin with the email already exists
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Create a new admin
    admin = new Admin({
      username,
      email,
      password,
    });

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(password, salt);

    // Save the admin to the database
    await admin.save();

    res.status(201).json({ message: 'Admin registered successfully', admin });
  } catch (error) {
    res.status(500).json({ message: 'Error registering admin', error: error.message });
  }
};

// Controller for Admin Login
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // On successful login, send the admin data (without password)
    const { password: _, ...adminData } = admin.toObject(); // Remove password from the response
    res.status(200).json({ message: 'Login successful', admin: adminData });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};


// Function to add a registering notification
const addRegisteringNotification = async (req, res) => {
  const { userId, name } = req.body;
   console.log('req body', req.body)
  try {
    // Find the admin by ID
    const admin = await Admin.findById(process.env.ADMIN_ID);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Add the notification
    admin.registeringNotifications.push({ userId, status: 'unread', name });

    // Save the updated admin document
    await admin.save();

    res.status(200).json({ message: 'Notification added successfully', admin });
  } catch (error) {
    res.status(500).json({ message: 'Error adding notification', error: error.message });
  }
};

const getAdminById = async (req, res) => {
  const { adminId } = req.params; // Extract adminId from request parameters

  try {
    // Find the admin by ID
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Return the admin object (without sensitive information like the password)
    const { password, ...adminData } = admin.toObject();
    res.status(200).json({ message: 'Admin retrieved successfully', admin: adminData });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving admin', error: error.message });
  }
};



const markRegisteringNotificationAsRead = async (req, res) => {
  const { adminId, userId } = req.body; // Extract adminId and userId from the request body

  try {
    // Find the admin by ID
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Find the specific notification by userId
    const notification = admin.registeringNotifications.find(
      (notif) => notif.userId.toString() === userId
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Update the notification status to "read"
    notification.status = "read";

    // Save the updated admin document
    await admin.save();

    res.status(200).json({
      message: 'Notification marked as read successfully',
      notification,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error marking notification as read',
      error: error.message,
    });
  }
};

const deleteRegisteringNotification = async (req, res) => {
  const { adminId, userId } = req.body; // Extract adminId and userId from the request body

  try {
    // Find the admin by ID
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Find the index of the notification to delete
    const notificationIndex = admin.registeringNotifications.findIndex(
      (notif) => notif.userId.toString() === userId
    );

    if (notificationIndex === -1) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Remove the notification from the array
    admin.registeringNotifications.splice(notificationIndex, 1);

    // Save the updated admin document
    await admin.save();

    res.status(200).json({
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting notification',
      error: error.message,
    });
  }
};



module.exports = {
  registerAdmin,
  loginAdmin,
  addRegisteringNotification,
  getAdminById,
  markRegisteringNotificationAsRead,
  deleteRegisteringNotification
};
