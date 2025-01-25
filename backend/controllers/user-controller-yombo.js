const bcrypt = require('bcrypt');
const Admin = require('../models/adminSchema.js');

const User = require('../models/yombo/yomboUserSchema.js');
//const Notification = require('../models/notificationSchema.js');
const mongoose = require('mongoose');

const { fetchDefaultRoles } = require("../controllers/roles-controller");

const origin = process.env.ORIGIN;



const userRegister = async (req, res) => {
    try {
      // Handle the file upload
    
      console.log('Form Data:', req.body); // For debugging purposes
  
        // Parse the form data (including roles, dob, etc.)
        const { name, password, selectedRoles, jumuiya,occupation,phone,pledges,gender,
           dob,maritalStatus,kipaimara,ubatizo,marriageType,profilePicture } = req.body;
        // const selectedRoles = roles; 
  
       const defaultRoles = await fetchDefaultRoles().roles;

      // console,log("default roles",defaultRoles);
/*
       if(!defaultRoles){
        return res.status(500).send({message: 'No default roles'})
       }

       for(let role of selectedRoles){
           if(!defaultRoles.includes(role)){
            return res.status(500).send({message: `enum error, ${role} is not registered`})
       }
      }
*/
    
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

const verifyUser = async (req, res) =>{
  try{
    const {adminId, userId} = req.body;
  // Find the user by userId (assuming userId is a unique field like _id or custom id)
  const user = await User.findById(userId); // Use findById if you are using MongoDB's ObjectId
  const isAdmin = await Admin.findById(adminId); 

  if(!isAdmin){
    console.error('admin not found');
    return res.status(404).send({message:"admin hayupo"});
  }

  if (user) {
    // Remove sensitive data
    user.verified = true;
    await user.save();
    return res.send(user);
  } 
  } catch(err){
    console.log(err);
    return res.status(404).json({message: err.message});
  }
}

const addSelectedRole = async (req, res) =>{
  try{
    const {adminId, userId, selectedRole} = req.body;
  // Find the user by userId (assuming userId is a unique field like _id or custom id)
  const user = await User.findById(userId); // Use findById if you are using MongoDB's ObjectId
  const isAdmin = await Admin.findById(adminId); 

  if(!isAdmin){
    console.error('admin not found');
    return res.status(404).send({message:"admin hayupo"});
  }

  if (user) {
    // Remove sensitive data
    user.selectedRoles.push(selectedRole) ;
    user.save() ;
    return res.send(user);
  } 
  } catch(err){
    console.log(err);
    return res.status(404).json({message: err.message});
  }
}


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
    const { userId, group, message } = req.body;

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

    // Notification object
    const notification = {
      group,
      message,
      type: "matangazoNotification",
      status: "unread",
      time: new Date(),
    };

    // Save notification for the sender regardless of the group
    const sender = await User.findById(userId);
    if (sender) {
      sender.matangazoNotifications.push(notification);
      await sender.save();
    }

    // Loop through users and push the notification, excluding the sender
    let totalNotified = 0;

    for (const user of users) {
      if (user._id.toString() !== userId) {
        user.matangazoNotifications.push(notification);
        await user.save();
        totalNotified++; // Increment counter for non-sender notifications
      }
    }

    // Respond with success message
    res.status(200).json({
      success: true,
      message: `Notification sent to users with role "${group}", and also saved for the sender.`,
      totalNotified: totalNotified + (sender ? 1 : 0), // Include sender in the total count
    });
  } catch (error) {
    console.error("Error pushing notification:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Function to retrieve notifications for a specific user
const getMatangazoNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate request input
    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Retrieve matangazo notifications
    const notifications = user.matangazoNotifications || [];

    res.status(200).json({
      success: true,
      message: "Notifications retrieved successfully.",
      notifications,
    });
  } catch (error) {
    console.error("Error retrieving notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to delete a specific notification
const deleteMatangazoNotification = async (req, res) => {
  try {
     console.log('it reaches here');
    const { userId, notificationId } = req.params;
    const { group,message } = req.body;
   console.log(`userId: ${userId}, notificationId: ${notificationId} and group: ${group}`);

    //console.log('goup is', group);
    // Validate request input
    if (!userId || !notificationId) {
      return res.status(400).json({ error: "User ID and Notification ID are required." });
    }

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Find the notification index in the user's array
    console.log('user notifications', user.matangazoNotifications);
    const notificationIndex = user.matangazoNotifications.findIndex(
      (notif) => notif._id.toString() === notificationId
    );

    if (notificationIndex === -1) {
      return res.status(404).json({ error: "Notification not found." });
    }

    // Remove the notification from the user's list
    user.matangazoNotifications.splice(notificationIndex, 1);
    await user.save();

    // Delete notifications for all users in the group
    if (group) {
      const usersInGroup = await User.find({ selectedRoles: group });

      for (const groupUser of usersInGroup) {
        const groupNotificationIndex = groupUser.matangazoNotifications.findIndex(
          (notif) => notif.message  === message
        );
        if (groupNotificationIndex !== -1) {
          groupUser.matangazoNotifications.splice(groupNotificationIndex, 1);
          await groupUser.save();
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully for the user and the group.",
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to edit a specific notification
const editMatangazoNotification = async (req, res) => {
  try {
    const { userId, notificationId } = req.params;
    const { group, message, status } = req.body; // Fields to update

    // Validate request input
    if (!userId || !notificationId) {
      return res.status(400).json({ error: "User ID and Notification ID are required." });
    }

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Find the notification
    const notification = user.matangazoNotifications.find(
      (notif) => notif._id.toString() === notificationId
    );

    if (!notification) {
      return res.status(404).json({ error: "Notification not found." });
    }

    // Update the notification fields
    if (group) notification.group = group;
    if (message) notification.message = message;
    if (status) notification.status = status;

    // Save changes
    await user.save();

    // Update notifications for all users in the group
    if (group) {
      const usersInGroup = await User.find({ selectedRoles: group });

      for (const groupUser of usersInGroup) {
        const groupNotification = groupUser.matangazoNotifications.find(
          (notif) => notif._id.toString() === notificationId
        );
        if (groupNotification) {
          if (message) groupNotification.message = message;
          if (status) groupNotification.status = status;
          if (group) groupNotification.group = group;
          await groupUser.save();
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Notification updated successfully for the user and the group.",
      notification,
    });
  } catch (error) {
    console.error("Error editing notification:", error);
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


const pinNotification = async (req, res) => {
  try {
    const { userId, notificationId } = req.params;

   // console.log('params', req.params);

    // Set the `pinned` field to true for the specified notification
    const result = await User.updateOne(
      { _id: userId, "matangazoNotifications._id": notificationId },
      {
        $set: {
          "matangazoNotifications.$.pinned": true,
        },
      }
    );

    // Check if any document was modified
    if (result.nModified === 0) {
      return res
        .status(404)
        .json({ error: "Notification not found or already pinned" });
    }

    res.status(200).json({ message: "Notification pinned successfully" });
  } catch (error) {
    console.error("Error pinning notification:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Function to create a new donation
const createDonation = async (req, res) => {
  try {
    const { name, details, startingDate, deadline, group, total } = req.body;

    // Validate request input
    if (!name || !details || !startingDate || !deadline) {
      return res
        .status(400)
        .json({ error: "Name, details, startingDate, and deadline are required." });
    }

    // Validate dates
    const start = new Date(startingDate);
    const end = new Date(deadline);

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ error: "Invalid date format for startingDate or deadline." });
    }

    if (start >= end) {
      return res
        .status(400)
        .json({ error: "Starting date must be earlier than the deadline." });
    }

    // Create the donation object
    const donation = {
      name,
      details,
      startingDate: start,
      deadline: end,
      group,
      total,
      createdAt: new Date(),
    };

    
     // Find users where `selectedRoles` matches the provided group
     const users = await User.find({ selectedRoles: group });
    if (!users.length) {
      return res.status(404).json({ message: "No users found to assign the donation." });
    }

    for (const user of users) {
      user.donations.push(donation);
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Donation created and assigned to all users.",
      totalUsers: users.length,
    });
  } catch (error) {
    console.error("Error creating donation:", error);
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


const getUserDonations = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID and retrieve only the donations field
    const user = await User.findById(userId, "donations");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send donations with their unique _id
    res.status(200).json({ donations: user.donations });
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const addDonationAmount = async (req, res) => {
  try {
    const { userId, donationId } = req.params; // Get user ID and donation ID from the request parameters
    const { amount } = req.body; // Get the amount to add from the request body

    console.log("Received Request - User ID:", userId, "Donation ID:", donationId, "Amount:", amount);

    if (!amount || amount <= 0) {
      console.log("Invalid or missing amount value.");
      return res.status(400).json({ error: "Invalid or missing amount value." });
    }

    // Fetch the user document with the specific donation
    const user = await User.findOne(
      { _id: userId, "donations._id": donationId },
      { "donations.$": 1 } // Only return the matched donation
    );

    if (!user || user.donations.length === 0) {
      console.log("No matching user or donation found.");
      return res.status(404).json({ error: "User or donation not found." });
    }

    // Get the current amountPaid and add the new amount
    const donation = user.donations[0]; // Since we used `donations.$`, there should be only one
    const updatedAmountPaid = donation.amountPaid + amount;

    // Update the donation's amountPaid with the new value
    const result = await User.updateOne(
      { _id: userId, "donations._id": donationId }, // Match the user and donation
      { $set: { "donations.$.amountPaid": updatedAmountPaid } } // Set the new amountPaid value
    );

    console.log("Update Result:", result);

    if (result.nModified === 0) {
      console.log("No updates were made.");
      return res.status(404).json({ error: "No updates were made." });
    }

    console.log("Amount added successfully to donation.");
    res.status(200).json({
      success: true,
      message: `Amount added successfully to donation.`,
    });
  } catch (error) {
    console.error("Error updating donation amount:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};





const getUsersByGroupAndFieldType = async (req, res) => {
  try {
    const { userId, group, field_type } = req.body;

    // Find the user by userId and check their roles
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user's selected roles contains "kiongozi_" + group
    const selectedRole = "kiongozi_" + group;
    if (!user.selectedRoles.includes(selectedRole)) {
      return res.status(403).json({ error: "User does not have the required role" });
    }

    // Find users who have the selected group in their selectedRoles
    const usersInGroup = await User.find({ selectedRoles: group });
    if (!usersInGroup.length) {
      return res.status(404).json({ error: "No users found in the specified group" });
    }

    // If field_type is 'michango', filter donations for users with the specified group
    if (field_type === "michango") {
      const donationsData = usersInGroup.map(user => {
        // Filter donations by group and return necessary donation details
        const donations = user.donations.filter(donation => donation.group === group);
        return {
          username: user.name,  // Assuming the user model has a 'username' field
          donations: donations,
          userId: user._id,
        };
      });

      // Return the aggregated donation data for the group
      return res.status(200).json({ donationsData });
    }

    // If the field_type is not 'michango', return an error
    return res.status(400).json({ error: "Invalid field_type" });

  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};







module.exports = {
    getUsersByRole,
    addSelectedRole,
    pushMatangazoNotification,
    verifyUser,
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
    pinNotification,
    createDonation,
    getUserDonations,
    getUsersByGroupAndFieldType,
    addDonationAmount,
    getMatangazoNotifications,
    deleteMatangazoNotification,
    editMatangazoNotification,
  };
