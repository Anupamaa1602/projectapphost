// models/Message.js

// const mongoose = require('mongoose');

// const messageSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   content: {
//     type: String,
//     required: true,
//   },
//   type: {
//     type: String,
//     enum: ['Maintenance', 'Charity', 'Event', 'General'],
//     required: true,
//   },
//   amount: String,
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   isRead: {
//     type: Boolean,
//     default: false,
//   }
// });

// module.exports = mongoose.model('Message', messageSchema);

// const mongoose = require('mongoose');                            //working one

// const messageSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   content: {
//     type: String,
//     required: true,
//   },
//   type: {
//     type: String,
//     enum: ['Maintenance', 'Charity', 'Event', 'General'],
//     required: true,
//   },
//   amount: {
//     type: Number,  // changed from String to Number
//     required: true,
//     default: null,  // optional field, defaults to null if not set
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   isRead: {
//     type: Boolean,
//     default: false,
//   },
// });

// module.exports = mongoose.model('Message', messageSchema);



const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Maintenance', 'Charity', 'Event', 'General'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    default: null,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
    isPaid: { type: Boolean, default: false },
     paymentDate: {
    type: Date,
  },
  paymentAmount: {
    type: Number,
  },
  paymentMethod: {
    type: String,
  },
  paidBy: {
   type: String,
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

module.exports = mongoose.model('Message', messageSchema);
