

// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    default: '', // URL to the profile picture (optional)
  },
  city: {
    type: String,
    default: '', // URL to the profile picture (optional)
  },
  role: {
    type: String,
    required: true,
    enum: ['reader', 'contributor', 'admin'], 
  },
  profilePicture: {
    type: String,
    default: '', // URL to the profile picture (optional)
  },
  coverPicture: {
    type: String,
    default: '', // URL to the profile picture (optional)
  },
  phone: {
    type: String,
    default: '', // Optional field for phone number
  },
  verified: {
    type: String,
    default: false, // Optional 
  },
  address: {
    type: String,
    default: '', // Optional field for address
  },
  bio: {
    type: String,
    default: '', // Short bio or description
  },
  facebook: {
    type: String,
    default: '', // Facebook account URL
  },
  instagram: {
    type: String,
    default: '', // Instagram account URL
  },
  twitter: {
    type: String,
    default: '', // Twitter account URL
  },
  linkedin: {
    type: String,
    default: '', // LinkedIn account URL
  },
  followers: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  },
  following: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  },
}, { timestamps: true });

// Create the User model from the schema
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
