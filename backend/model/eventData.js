
// const mongoose = require('mongoose');

// const hallSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   location: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   capacity: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   phoneNo: {
//     type: Number,
//     required: true,
//   },
//   availability: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   date: Date,           
//   time: String,
//   image: {
//     type: String,
//     required: true,
//   }
// }, {
//   timestamps: true
// });

// const Hall = mongoose.model('event', hallSchema);

// module.exports = Hall;

const mongoose = require('mongoose');

const hallSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  }, paymentMode:String,
  location: {
    type: String,
    required: true,
    trim: true,
  },
  capacity: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNo: {
    type: Number,
    required: true,
  },
  availability: {
    type: String,
    required: true,
    trim: true,
  },
  date: Date,
  time: String,
  image: {
    type: String,
    required: true,
  },
  bookingRate: {
    type: Number,       
    required: true,    
  }
 
}, {
  timestamps: true
});

const Hall = mongoose.model('event', hallSchema);

module.exports = Hall;
