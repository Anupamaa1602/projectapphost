// import mongoose from 'mongoose';

// const bookingSchema = new mongoose.Schema({
//   eventName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   time: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   date: {
//     type: Date,
//     required: true
//   },
//   paymentMode: {
//     type: String,
//     enum: ['online', 'offline', 'upi', 'cash'],
//     required: true
//   }
// }, {
//   timestamps: true
// });

// export default mongoose.model('booking', bookingSchema);

// const mongoose = require('mongoose');

// const bookingSchema = new mongoose.Schema({
//   eventName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   time: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   date: {
//     type: Date,
//     required: true
//   },
//   paymentMode: {
//     type: String,
//      enum: ['Credit Card', 'Debit Card', 'Cash', 'UPI'],
//     required: true
//   },
//   userEmail: { 
//     type: String,
//     required: true,
//     trim: true
//   }
// }, {
//   timestamps: true
// });

// module.exports = mongoose.model('Booking', bookingSchema);


const mongoose = require('mongoose');                       //the working

const bookingSchema = new mongoose.Schema({
  
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'event',
    required: false
  },
  eventName: {
    type: String,
    required: true,
    trim: true
  },
  bookingRate: {
    type: Number, 
    required: true
  },
  date: {
    type: Date,
    required: false
  },
  time: {
    type: String,
    required: false,
    trim: true
  },
  paymentMode: {
    type: String,
    enum: [' Card', 'Debit Card', 'Cash', 'UPI'],
    default:"Card",
    required: true
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'userdb', required: false },
  userEmail: {
    type: String,
    required: false,
    trim: false
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'paid'
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);


