const express = require('express');                                        // original one
const router = express.Router();
const jwt = require('jsonwebtoken');
const Stripe = require('stripe');
require ('dotenv').config()

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const JWT_SECRET = 'resApp'; // same secret used for auth

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// ✅ Middleware: Verify JWT token
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send({ message: 'Unauthorized: No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(403).send({ message: 'Invalid or expired token' });
  }
}

// ✅ Create Payment Intent (only for authenticated users)
router.post('/create-payment-intent', verifyToken, async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount < 1) {
    return res.status(400).send({ message: 'Invalid amount' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(amount), // amount in paise (e.g., 500 = ₹5)
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Stripe error:', error.message);
    res.status(500).send({ message: 'Stripe error', error: error.message });
  }
});

module.exports = router;




// const express = require('express');
// const router = express.Router();
// const jwt = require('jsonwebtoken');
// const Stripe = require('stripe');
// const mongoose = require('mongoose');
// require('dotenv').config();

// const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
// const JWT_SECRET = 'resApp';

// const Event = require('../model/eventData');
// const Message = require('../model/messageDta');
// const Booking = require('../model/bookingData');
// const User = require('../models/userData'); // Assuming you have this

// router.use(express.json());

// // Middleware
// function verifyToken(req, res, next) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });

//   const token = authHeader.split(' ')[1];
//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(403).json({ message: 'Invalid or expired token' });
//   }
// }

// // Create Payment Intent
// router.post('/create-payment-intent', verifyToken, async (req, res) => {
//   const { type, id } = req.body;

//   try {
//     let amount = 0;
//     let title = '';
//     let metadata = {};

//     if (type === 'event') {
//       const event = await Event.findById(id);
//       if (!event) return res.status(404).json({ message: 'Event not found' });

//       amount = event.bookingRate * 100; // cents
//       title = event.name;
//       metadata = {
//         type,
//         eventId: event._id.toString(),
//         eventName: event.name,
//         date: event.date.toISOString(),
//         time: event.time,
//       };
//     } else if (type === 'dues') {
//       const message = await Message.findById(id);
//       if (!message) return res.status(404).json({ message: 'Dues not found' });

//       amount = message.amount * 100;
//       title = message.title;
//       metadata = {
//         type,
//         messageId: message._id.toString(),
//         messageTitle: message.title,
//       };
//     } else {
//       return res.status(400).json({ message: 'Invalid type' });
//     }

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency: 'usd',
//       metadata,
//       automatic_payment_methods: { enabled: true },
//     });

//     res.status(200).json({ clientSecret: paymentIntent.client_secret, title, amount: amount / 100 });
//   } catch (error) {
//     console.error('Stripe Error:', error);
//     res.status(500).json({ message: 'Stripe error', error: error.message });
//   }
// });

// // Handle post-payment actions (called after frontend confirms success)
// router.post('/payment-success', verifyToken, async (req, res) => {
//   const { type, id } = req.body;
//   const userId = req.user.id;

//   try {
//     const user = await User.findById(userId);

//     if (type === 'event') {
//       const event = await Event.findById(id);
//       if (!event) return res.status(404).json({ message: 'Event not found' });

//       const booking = new Booking({
//         eventId: event._id,
//         eventName: event.name,
//         bookingRate: event.bookingRate,
//         date: event.date,
//         time: event.time,
//         paymentMode: 'Credit Card',
//         user: userId,
//         userEmail: user.email,
//         paymentStatus: 'completed',
//       });

//       await booking.save();
//       return res.status(200).json({ message: 'Booking created successfully' });
//     }

//     if (type === 'dues') {
//       const message = await Message.findById(id);
//       if (!message) return res.status(404).json({ message: 'Dues not found' });

//       message.isPaid = true;
//       await message.save();
//       return res.status(200).json({ message: 'Dues marked as paid' });
//     }

//     res.status(400).json({ message: 'Invalid type' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });

// module.exports = router;
