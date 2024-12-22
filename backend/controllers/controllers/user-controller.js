const bcrypt = require('bcrypt');
const Admin = require('../models/adminSchema.js');
const User = require('../models/userSchema.js');
const Notification = require('../models/notificationSchema.js');
const mongoose = require('mongoose');

const origin = process.env.ORIGIN;




// Function to manually create a global user
const createGlobalUser = async () => {
    try {
        // Define the user details
        const hardUsername = 'Global_Admin_123$!';
        const email = 'global_admin@example.com'; // Replace with a unique email
        const rawPassword = 'HardToGuessPassword!123'; // Replace with a strong password
        const role = 'admin'; // Give admin rights to make the user globally accessible

        // Check if the email already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('exixsting user', existingUser)
            console.log('User with this email already exists.');
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        // Create the new user
        const newUser = new User({
            username: hardUsername,
            email: email,
            password: hashedPassword,
            role: role,
            verified: true, // Assuming the user is automatically verified
            // Add other optional fields like country, bio, etc. if necessary
        });

        // Save the user to the database
        await newUser.save();
        console.log('Global user created successfully:', newUser);
    } catch (error) {
        console.error('Error creating global user:', error);
    }
};

// Call the function to create the user
createGlobalUser();


// Handler to verify a user (set verified to true)
const verifyUser = async (req, res) => {
    const { adminId, userId } = req.body;

    // Validate adminId and userId
    if (!mongoose.Types.ObjectId.isValid(adminId) || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid Admin ID or User ID' });
    }

    try {
        // Check if the requester is an admin
        const adminUser = await Admin.findById(adminId);
        if (!adminUser) {
            return res.status(403).json({ message: 'Access denied. Only admins can verify users.' });
        }

        // Update the user's verified status to true
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { verified: true },
            { new: true }
        );

        if (updatedUser) {
            res.status(200).json({ message: 'User verified successfully', user: updatedUser });
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (error) {
        console.error('Error verifying user:', error);
        res.status(500).json({ message: 'Server error while verifying user.' });
    }
};

// Handler to unverify a user (set verified to false)
const unverifyUser = async (req, res) => {
    const { adminId, userId } = req.body;

    // Validate adminId and userId
    if (!mongoose.Types.ObjectId.isValid(adminId) || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid Admin ID or User ID' });
    }

    try {
        // Check if the requester is an admin
        const adminUser = await Admin.findById(adminId);
        if (!adminUser) {
            return res.status(403).json({ message: 'Access denied. Only admins can unverify users.' });
        }

        // Update the user's verified status to false
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { verified: false },
            { new: true }
        );

        if (updatedUser) {
            res.status(200).json({ message: 'User unverified successfully', user: updatedUser });
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (error) {
        console.error('Error unverifying user:', error);
        res.status(500).json({ message: 'Server error while unverifying user.' });
    }
};

const getUserFollowers = async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate the userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid User ID' });
        }

        // Find the user by ID and populate the followers array
        const user = await User.findById(userId).populate('followers', '_id username profilePicture');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Send back the list of followers
        res.status(200).json({ followers: user.followers });
    } catch (error) {
        console.error('Error retrieving followers:', error);
        res.status(500).json({ message: 'Server error while retrieving followers.' });
    }
};

const getUserFollowing = async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate the userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid User ID' });
        }

        // Find the user by ID and populate the following array
        const user = await User.findById(userId).populate('following', '_id username profilePicture');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Send back the list of users they are following
        res.status(200).json({ following: user.following });
    } catch (error) {
        console.error('Error retrieving following:', error);
        res.status(500).json({ message: 'Server error while retrieving following.' });
    }
};



// Handler to retrieve users lazily with admin validation
const getAllUsers = async (req, res) => {
    const { adminId } = req.body;
    //console.log('adminId', adminId);
    const { page = 1, limit = 10 } = req.query; // Default to page 1, 20 users per page
  
    // Check if the adminId is valid
    if (!mongoose.Types.ObjectId.isValid(adminId)) {
      return res.status(400).json({ message: 'Invalid Admin ID' });
    }
  
    try {
      // Check if the requester is an admin
      const adminUser = await Admin.findById(adminId);

      //console.log('adminUser', adminUser);
  
      if (!adminUser ) {
        return res.status(403).json({ message: 'Access denied. Only admins can retrieve users.' });
      }
  
      //console.log(`Fetching users, Page: ${page}, Limit: ${limit}`);
  
      // Retrieve users with pagination
      const users = await User.find()
        .select('-password') // Exclude the password field for security reasons
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }); // Optionally sort by creation date (newest first)
  
      // Count total users for pagination
      const totalUsers = await User.countDocuments();
  
      res.status(200).json({
        users,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers
      });
    } catch (error) {
      console.error('Error retrieving users:', error);
      res.status(500).json({ message: 'Server error while retrieving users.' });
    }
  };

  // Handler to delete a user with admin validation
const deleteUser = async (req, res) => {
    const { adminId } = req.body;
    const { userId } = req.params;

   // console.log('userId', userId);
   // console.log('adminId', adminId);
  
    // Check if the adminId and userId are valid ObjectIds
    if (!mongoose.Types.ObjectId.isValid(adminId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid Admin ID or User ID' });
    }
  
    try {
      // Check if the requester is an admin
      const adminUser = await Admin.findById(adminId);
     // console.log('admin user', adminUser)
  
      if (!adminUser ) {
        return res.status(403).json({ message: 'Access denied. Only admins can delete users.' });
      }
  
      // Prevent the admin from deleting their own account
      if (adminId === userId) {
        return res.status(400).json({ message: 'You cannot delete your own account.' });
      }
  
      // Find the user to be deleted
      const userToDelete = await User.findById(userId);
  
      if (!userToDelete) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Delete the user
      await User.findByIdAndDelete(userId);
  
      res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Server error while deleting user.' });
    }
  };


// Function to find and update the username
const updateUsername = async () => {
    try {
        // Find user with username 'Briannashauri' and update to 'Brianna Shawn'
        const updatedUser = await User.findOneAndUpdate(
            { username: "Bari Kaneno" }, // Find criteria
            { verified: true },  // Update verified
            { new: true }                   // Return the updated document
        );

        if (updatedUser) {
           // console.log(` updated successfully: ${updatedUser}`);
        } else {
           // console.log("User not found.");
        }
    } catch (error) {
        console.error("Error updating username:", error);
    }
};

updateUsername()



// Helper function to create notifications
const createNotification = async (recipient, sender, type, message, link) => {
    try {
      const notification = new Notification({
        recipient,
        sender,
        type,
        message,
        link,
      });
      await notification.save();
    } catch (error) {
      console.error('Error creating notification:', error);
      throw new Error('Failed to create notification');
    }
  };
  

// Add a follower to the user
const addFollower = async (req, res) => {
    try {
       // console.log('started to add a follower');
        const { userId } = req.params;
        const { followerId } = req.body;

        if (userId === followerId) {
          // console.log('Users cannot follow themselves.');
            return res.status(400).send({ message: "Users cannot follow themselves."});
        }
 console.log('it reaches here')
        // Update the user being followed
        await User.findByIdAndUpdate(userId, {
            $addToSet: { followers: followerId }
        });

        // Update the follower's following list
        await User.findByIdAndUpdate(followerId, {
            $addToSet: { following: userId }
        });

       // console.log('User followed successfully');

        // Fetch usernames for the notification
        const followedUser = await User.findById(userId);
        const followerUser = await User.findById(followerId);
        const followedUsername = followedUser.username; // assuming 'username' field exists
        const followerUsername = followerUser.username;

        // Create notification for the followed user
        const notificationMessage = `${followerUsername} started following you.`;
        const notificationLink = `${origin}/profileViewer/${followerId}`; // Example: Link to the follower's profile

        await createNotification(userId, followerId, 'follow', notificationMessage, notificationLink);

        

        res.status(200).send({ message: `User ${followerId} is now following ${userId}` });
    } catch (error) {
       console.log(error);
        res.status(500).send({ message: 'Error adding follower: ' + error.message });
    }
};

const removeFollower = async (req, res) => {
    const { userId, followerId } = req.params;
    try {
        // Remove the follower from the user's followers array
        await User.findByIdAndUpdate(userId, {
            $pull: { followers: followerId },
        });

        // Remove the user from the follower's following array
        await User.findByIdAndUpdate(followerId, {
            $pull: { following: userId },
        });

       // console.log('User unfollowed successfully');

        // Fetch usernames for the notification
        const unfollowedUser = await User.findById(userId);
        const unfollowerUser = await User.findById(followerId);
        const unfollowedUsername = unfollowedUser.username; // assuming 'username' field exists
        const unfollowerUsername = unfollowerUser.username;

        // Create notification for the unfollowed user
        const notificationMessage = `${unfollowerUsername} unfollowed you.`;
        const notificationLink = `${origin}/user/${followerId}`; // Example: Link to the unfollower's profile

        await createNotification(userId, followerId, 'unfollow', notificationMessage, notificationLink);

        res.status(200).send({ message: `User ${followerId} has unfollowed ${userId}` });
    } catch (error) {
       // console.log(error);
        res.status(500).send({ message: 'Error removing follower: ' + error.message });
    }
};


const userRegister = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

      

        //console.log('Hashed Password:', hashedPass); // Log hashed password

        const user = new User({
            ...req.body,
            password: hashedPass
        });

       // console.log('newe user',user);

        const existingUserByEmail = await User.findOne({ email: req.body.email });

        if (existingUserByEmail) {
            res.status(400).send({ message: 'Email already exists' });
        } else {
            let result = await user.save();
           // console.log('Saved User:', result); // Log saved user before removing password
            result.password = undefined;
            res.status(201).send(result);
        }
    } catch (err) {
       // console.log(error);
        console.error('Registration Error:', err); // Log errors
        res.status(500).json(err);
    }
};


const userLogIn = async (req, res) => {
    try {
        const { email, password } = req.body;

       // console.log('User Login Attempt:', { email });

        // Validate input
        if (!email || !password) {
           // console.log('Missing email or password');
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Fetch the user and include the password field explicitly
        let user = await User.findOne({ email }).select('+password');
        //console.log('Retrieved User:', user);

        if (!user) {
           // console.log('User not found');
            return res.status(404).json({ message: "User not found" });
        }

        // Ensure the password field exists
        if (!user.password) {
            console.error('Password field is missing for user:', email);
            return res.status(500).json({ message: "Server error: Password not found" });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
       // console.log('Password Valid:', isPasswordValid);

        if (!isPasswordValid) {
           // console.log('Invalid password');
            return res.status(400).json({ message: "Invalid password" });
        }

        // Remove the password field before sending the response
        user.password = undefined;

        // Log the user object before sending
        //console.log('User Object to Send:', user);

        // Send the user object
        res.json({ message: "Login successful", user });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: "Server error" });
    }
};



// Get user detail by ID
const getUserDetail = async (req, res) => {
    try {
        let user = await User.findById(req.params.id);
        if (user) {
            user.password = undefined;
            res.send(user);
        } else {
            res.status(404).send({ message: "No user found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Check if email exists
const checkEmailExists = async (req, res) => {
    try {
        const { email } = req.query;
        const existingUser = await User.findOne({ email });
        res.status(200).send({ exists: !!existingUser });
    } catch (err) {
        res.status(500).json(err);
    }
};



// Update user profile (profilePicture, coverPicture, phone, address, bio, country, city, social media links)
const updateUserProfile = async (req, res) => {
    const { userId } = req.params;
    const {
        profilePicture, 
        coverPicture, 
        phone, 
        address, 
        bio,
        country, // New
        city,    // New
        facebook, 
        instagram, 
        twitter, 
        linkedin 
    } = req.body;
   console.log("request body", req.body)
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                profilePicture, 
                coverPicture, 
                phone, 
                address, 
                bio,
                country, // New
                city,    // New
                facebook, 
                instagram, 
                twitter, 
                linkedin
            },
            { new: true, runValidators: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).send({ message: "User not found" });
        }
          // console.log('user saved succesfull', updatedUser)
        res.status(200).send(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile: ' + error.message });
    }
};


// Get user along with followers
const getUserWithFollowers = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId)
            .populate('followers', 'username email') 
            .exec();

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        res.status(200).send(user);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user with followers: ' + error.message });
    }
};



module.exports = {
    userRegister,
    userLogIn,
    deleteUser,
    getAllUsers,
    getUserDetail,
    checkEmailExists,
    addFollower,
    removeFollower,
    updateUserProfile,
    getUserWithFollowers,
    verifyUser,
    unverifyUser,
    getUserFollowers,
    getUserFollowing,
};
