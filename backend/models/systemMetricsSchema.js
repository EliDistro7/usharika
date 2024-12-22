


// models/systemMetricsSchema.js
const mongoose = require('mongoose');

const systemMetricsSchema = new mongoose.Schema({
  systemMetrics: {
    totalUsers: { type: Number, default: 0 },
    totalPosts: { type: Number, default: 0 },
    activeUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    totalUsersToday: { type: Number, default: 0 },
    postsToday: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('SystemMetrics', systemMetricsSchema);
