const bcrypt = require('bcrypt');
const Admin = require('../models/adminSchema.js');

const User = require('../models/yombo/yomboUserSchema.js');
//const Notification = require('../models/notificationSchema.js');
const mongoose = require('mongoose');

const origin = process.env.ORIGIN;



const userRegister = async (req, res) => {
    try {
      // Handle the file upload
    
      console.log('Form Data:', req.body); // For debugging purposes
  
        // Parse the form data (including roles, dob, etc.)
        const { name, password, selectedRoles, jumuiya,occupation,phone,pledges,gender,
           dob,maritalStatus,kipaimara,ubatizo,marriageType,profilePicture } = req.body;
        // const selectedRoles = roles; 
  
       
       
        // Validate input
        if (!name || !password) {
          return res.status(400).send({ message: 'Jina na password vinahitajika' });
        }
  
        // Check if user already exists
        const existingUser = await User.findOne({ name });
        if (existingUser) {
          return res.status(400).send({ message: 'Jina tayari lipo, jaribu jina lingine' });
        }
  
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        if (!salt) throw new Error("Salt generation failed"); // Optional debugging step
        const hashedPassword = await bcrypt.hash(password, salt);
        if (!hashedPassword) throw new Error("Hashing failed"); // Optional debugging step
  
        // Create new user object
        const user = new User({
          name,
          password: hashedPassword,
          selectedRoles, // Make sure roles are saved as an array
          jumuiya,
          dob, // Ensure dob is properly formatted
          profilePicture, // Save the file path if file is uploaded
          occupation,phone,pledges,gender,maritalStatus,
          marriageType:marriageType==='' ? 'bado':marriageType,
          kipaimara: kipaimara === 'on' ? true : false,
          ubatizo: ubatizo === 'on' ? true : false,
        });
  
        // Save the user
        const savedUser = await user.save();
        savedUser.password = undefined; // Remove password from response for security
  
        // Send success response
        res.status(201).send({
          message: 'User registered successfully',
          user: savedUser,
        });
    ;
    } catch (err) {
      console.error('Registration Error:', err);
      res.status(500).send({ message: 'An error occurred during registration', error: err.message });
    }
  };



const userLogIn = async (req, res) => {
    try {
        const { name, password } = req.body;

        // Log user login attempt
        console.log('User Login Attempt:', { name });

        // Validate input
        if (!name || !password) {
            console.log('Missing name or password');
            return res.status(400).json({ message: "Name and password are required" });
        }

        // Fetch the user by name and include the password field explicitly
        const user = await User.findOne({ name }).select('+password');
        console.log('Retrieved User:', user);

        if (!user) {
            console.log('Mtumiaji huyo hayupo');
            return res.status(404).json({ message: "Mtumiaji huyo hayupo" });
        }

        // Ensure the password field exists
        if (!user.password) {
            console.error('Password field is missing for user:', name);
            return res.status(500).json({ message: "Server error: Password si sahihi" });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password Valid:', isPasswordValid);

        if (!isPasswordValid) {
            console.log('Invalid password');
            return res.status(400).json({ message: "Password si sahihi" });
        }

        // Remove the password field before sending the response
        user.password = undefined;

        // Log the user object before sending
        console.log('User Object to Send:', user);

        // Send the user object
        res.json({ message: "Login successful", user });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: "Server error" });
    }
};


// Handler to retrieve users lazily with admin validation
const getAllUsers = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const {adminId} = req.body;
  //console.log('req body', req.body)

  if (!mongoose.Types.ObjectId.isValid(adminId)) {
    return res.status(400).json({ message: 'Invalid Admin ID' });
  }

  try {
    // Check if the requester is an admin
    const adminUser = await Admin.findById(adminId);

    if (!adminUser) {
      return res.status(403).json({ message: 'Access denied. Only admins can retrieve users.' });
    }

    // Retrieve users with pagination
    const users = await User.find()
      .select('-password') // Exclude password
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    // Count total users for pagination
    const totalUsers = await User.countDocuments();

    // Calculate category counts
    const categories = await User.aggregate([
      { $unwind: '$selectedRoles' }, // Flatten roles
      { $group: { _id: '$selectedRoles', count: { $sum: 1 } } }, // Count each role
      { $sort: { _id: 1 } }, // Sort alphabetically
    ]);

    res.status(200).json({
      users,
      categories,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
    });
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ message: 'Server error while retrieving users.' });
  }
};






 // Decode the name from the request parameter before fetching the user from the database
 // This prevents potential security vulnerabilities such as SQL injection
const getUserDetail = async (req, res) => {
  try {
    // Decode the name from the request parameter
    const userName = decodeURIComponent(req.params.name);

    // Find the user by name
    const user = await User.findOne({ name: userName });
    if (user) {
      // Remove sensitive data
      user.password = undefined;
      res.send(user);
    } else {
      res.status(404).send({ message: "No user found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: err });
  }
};

const getUserDetailById = async (req, res) => {
  try {
    const { userId } = req.params; // Assuming userId is passed as a URL parameter

    // Find the user by userId (assuming userId is a unique field like _id or custom id)
    const user = await User.findById(userId); // Use findById if you are using MongoDB's ObjectId

    if (user) {
      // Remove sensitive data
      user.password = undefined;
      res.send(user);
    } else {
      res.status(404).send({ message: "No user found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: err });
  }
};


// Example function to add payment using username
async function addPayment(username, pledgeType, amount) {
  const update = {};
  if (pledgeType === 'ahadi') {
    update.$inc = { 'pledges.paidAhadi': amount };
  } else if (pledgeType === 'jengo') {
    update.$inc = { 'pledges.paidJengo': amount };
  }

  try {
    const result = await User.findOneAndUpdate({ name: username }, update, { new: true });
    if (!result) {
      console.error('User not found with the provided username:', username);
      return;
    }
   // console.log('Updated user:', result);
    return result;
  } catch (err) {
    console.error('Error updating pledge:', err);
  }
}

async function addPaymentMain(req, res) {
  if (req.method === 'POST') {
    const { username, pledgeType, amount } = req.body;

    try {
      const result = await addPayment(username, pledgeType, amount);
      if (!result) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      console.error('Error processing payment:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

const addPledge = async (req, res) => {
  try {
    // Extract data from the request body and cookies
    const { pledgeName, pledgeAmount,name } = req.body;
   // Extract the user's name from cookies

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "User name is required and must be stored in cookies.",
      });
    }

    if (!pledgeName || !pledgeAmount) {
      return res.status(400).json({
        success: false,
        message: "Pledge name and amount are required.",
      });
    }

    // Find the user by their name
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Add the new pledge to the user's `pledges.other` Map
    user.pledges.other.set(pledgeName, { total: pledgeAmount, paid: 0 });

    // Save the updated user document
    await user.save();

    // Respond with success and the updated user data
    return res.status(200).json({
      success: true,
      message: "Pledge added successfully.",
      user,
    });
  } catch (error) {
    console.error("Error in addPledge controller:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while adding the pledge.",
      error: error.message,
    });
  }
}

// Function to retrieve users by selected role, with admin validation
const getUsersByRole = async (req, res) => {
  
  const { adminId, role, page, limit } = req.body;

  // Validate adminId
  if (!mongoose.Types.ObjectId.isValid(adminId)) {
    return res.status(400).json({ message: 'Invalid Admin ID' });
  }

  try {
    // Check if the requester is an admin
    const adminUser = await User.findById(adminId);
    if (!adminUser) {
      return res.status(403).json({ message: 'Access denied. Only admins can retrieve users.' });
    }

    // Validate that role is provided
    if (!role) {
      return res.status(400).json({ message: 'Role parameter is required.' });
    }

    // Retrieve users that have the role in their selectedRoles field
    const users = await User.find({ selectedRoles: role })
      .select('-password') // Exclude password
      .skip((page - 1) * limit)  // Pagination
      .limit(parseInt(limit))    // Limit number of users per page
      .sort({ createdAt: -1 });  // Sort by most recent

    // Count total users for pagination
    const totalUsers = await User.countDocuments({ selectedRoles: role });

    // Calculate category counts (optional, can be useful for analytics)
    const categories = await User.aggregate([
      { $unwind: '$selectedRoles' },
      { $group: { _id: '$selectedRoles', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      users,
      categories,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
    });
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ message: 'Server error while retrieving users.' });
  }
};



// Function to push a notification
const pushMatangazoNotification = async (req, res) => {
  try {
    const { group, message } = req.body;

    // Validate request input
    if (!group || !message) {
      return res
        .status(400)
        .json({ error: "Group and message fields are required." });
    }

    // Find users where `selectedRoles` matches the provided group
    const users = await User.find({ selectedRoles: group });

    if (!users.length) {
      return res
        .status(404)
        .json({ message: `No users found with the role "${group}".` });
    }

    // Loop through users and push the notification
    const notification = {
      group,
      message,
      type: "matangazoNotification",
      status: "unread",
      time: new Date(),
    };

    for (const user of users) {
      user.matangazoNotifications.push(notification);
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: `Notification sent to users with role "${group}".`,
      totalNotified: users.length,
    });
  } catch (error) {
    console.error("Error pushing notification:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId, "matangazoNotifications");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send notifications with their unique _id
    res.status(200).json({ notifications: user.matangazoNotifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const markNotificationAsRead = async (req, res) => {
  try {
    const { userId, notificationId } = req.params;

    console.log('params', req.params)

    const result = await User.updateOne(
      { _id: userId, "matangazoNotifications._id": notificationId },
      {
        $set: {
          "matangazoNotifications.$.status": "read",
        },
      }
    );

    if (result.nModified === 0) {
      return res
        .status(404)
        .json({ error: "Notification not found or already updated" });
    }

    res
      .status(200)
      .json({ message: "Notification marked as read successfully" });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const removeNotification = async (req, res) => {
  try {
    const { userId, notificationId } = req.params;

    console.log('params', req.params);

    // Use $pull to remove the notification from the array
    const result = await User.updateOne(
      { _id: userId },
      {
        $pull: {
          matangazoNotifications: { _id: notificationId },
        },
      }
    );

    // Check if any document was modified
    if (result.nModified === 0) {
      return res
        .status(404)
        .json({ error: "Notification not found or already removed" });
    }

    res.status(200).json({ message: "Notification removed successfully" });
  } catch (error) {
    console.error("Error removing notification:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};





module.exports = {
    getUsersByRole,
    pushMatangazoNotification,
    userRegister,
    userLogIn,
    getUserDetail,
    getUserDetailById,
    getAllUsers,
    addPledge,
    addPaymentMain,
    getUserNotifications,
    markNotificationAsRead,
    removeNotification,
  };
