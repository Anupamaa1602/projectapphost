
const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: String,
  message: String,
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  votedUsers: [
    {
      name:String,
      email: String,
      voteType: String,
      votedAt: { type: Date, default: Date.now },
      updatedAtSnapshot: Date
    }
  ]
}, { timestamps: true }); 

module.exports = mongoose.model('announcement', announcementSchema);



