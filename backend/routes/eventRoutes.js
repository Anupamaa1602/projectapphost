

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Hall = require('../model/eventData');
const Booking = require('../model/bookingData');
const JWT_SECRET = 'resApp';

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Middleware: Verify JWT token
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send({ message: 'Unauthorized: No token' });

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(403).send({ message: 'Invalid or expired token' });
  }
}

// Middleware: Admin check
function verifyAdminToken(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).send({ message: 'Access denied: Admins only' });
    }
    next();
  });
}

// GET all events
router.get('/', verifyToken, async (req, res) => {
  try {
    const events = await Hall.find().sort({ updatedAt: -1  });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).send({ message: 'Failed to fetch events', error: err.message });
  }
});
// router.get('/:id', async (req, res) => {
//   try {
//     const event = await Event.findById(req.params.id);
//     if (!event) return res.status(404).json({ message: 'Event not found' });
//     res.json(event);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });
const mongoose = require('mongoose');

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  // ✅ Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Event ID' });
  }

  try {
    const event = await Hall.findById(id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    res.json(event);
  } catch (err) {
    console.error('Error fetching event:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// ✅ GET all active/upcoming events
router.get('/active', verifyToken, async (req, res) => {
  try {
    const now = new Date();
    const events = await Hall.find({
      availability: 'available',
      date: { $gte: now }
    }).sort({ date: 1 });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// ✅ GET status of a specific event
router.get('/:id/status', verifyToken, async (req, res) => {
  try {
    const event = await Hall.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const now = new Date();
    const isActive = event.availability === 'available' && new Date(event.date) >= now;

    res.status(200).json({
      eventId: event._id,
      name: event.name,
      status: isActive ? 'active/upcoming' : 'unavailable or past',
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ADD event
router.post('/add', verifyAdminToken, async (req, res) => {
  try {
    const { name, location, capacity, phoneNo, availability, image, date, time,bookingRate } = req.body;

    const newEvent = new Hall({
      name,
      location,
      capacity,
      phoneNo,
      availability,
      image,
      date,
      time,
      bookingRate
    });

    await newEvent.save();
    res.status(201).send({ message: 'Event created successfully', event: newEvent });
  } catch (err) {
    res.status(400).send({ message: 'Failed to create event', error: err.message });
  }
});

// EDIT event
router.put('/edit/:id', verifyAdminToken, async (req, res) => {
  try {
    const updated = await Hall.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).send({ message: 'Event not found' });

    res.status(200).send({ message: 'Event updated', event: updated });
  } catch (err) {
    res.status(500).send({ message: 'Failed to update event', error: err.message });
  }
});

// DELETE event
router.delete('/delete/:id', verifyAdminToken, async (req, res) => {
  try {
    const deleted = await Hall.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send({ message: 'Event not found' });

    res.status(200).send({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).send({ message: 'Failed to delete event', error: err.message });
  }
});

// BOOK event
router.post('/book/:id', verifyToken, async (req, res) => {
  try {
    const { paymentMode, date, time } = req.body;

    const event = await Hall.findById(req.params.id);
    if (!event) return res.status(404).send({ message: 'Event not found' });

    const existingBooking = await Booking.findOne({
      eventName: event.name,
      userEmail: req.user.email
    });

    if (existingBooking) {
      return res.status(400).send({ message: 'You have already booked this event' });
    }

    const newBooking = new Booking({
      eventName: event.name,
      date,
      time,
      paymentMode,
      userEmail: req.user.email
    });

    await newBooking.save();
    res.status(200).send({ message: 'Event booked successfully', booking: newBooking });
  } catch (err) {
    res.status(500).send({ message: 'Failed to book event', error: err.message });
  }
});
// Cancel a booking by ID (requires authentication)
// router.delete('/cancel/:bookingId', verifyToken, async (req, res) => {                //older one
//   try {
//     const booking = await Booking.findById(req.params.bookingId);

//     if (!booking) {
//       return res.status(404).send({ message: 'Booking not found' });
//     }

//     // Ensure the logged-in user is canceling their own booking
//     if (booking.userEmail !== req.user.email) {
//       return res.status(403).send({ message: 'Unauthorized: You can only cancel your own bookings' });
//     }

//     await booking.deleteOne();
//     res.status(200).send({ message: 'Booking canceled successfully' });

//   } catch (err) {
//     res.status(500).send({ message: 'Failed to cancel booking', error: err.message });
//   }
// });
// // Get current user's bookings
//  router.get('/mybookings', verifyToken, async (req, res) => {
//   try {
//     const bookings = await Booking.find({ userEmail: req.user.email }).sort({ createdAt: -1 });
//     res.status(200).json(bookings);
//    } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch your bookings', error: err.message });
//    }
//  });



// router.post('/bookings',verifyToken, async (req, res) => {
//   try {
//     const {
//       eventId,
//       eventName,
//       bookingRate,
//       paymentMode,
//       date,
//       time,
//       userEmail,
//       paymentStatus,
//     } = req.body;

//     if (!eventId || !eventName || !bookingRate || !paymentMode || !date || !time || !userEmail) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     const newBooking = new Booking({
//       eventId,
//       eventName,
//       bookingRate,
//       paymentMode,
//       date,
//       time,
//       userEmail,
//       paymentStatus: paymentStatus || 'pending',
//     });

//     await newBooking.save();

//     res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
//   } catch (error) {
//     console.error('Booking creation error:', error);
//     res.status(500).json({ message: 'Server error while creating booking' });
//   }
// });

// router.post('/bookings', verifyToken, async (req, res) => {                                // the final working one
//   try {
//     const { eventName, bookingRate, paymentMode } = req.body;

//     // Validate only these three fields:
//     if (!eventName || bookingRate == null || !paymentMode) {
//       return res.status(400).json({
//         message: 'Missing required fields: eventName, bookingRate, or paymentMode'
//       });
//     }

//     // Create a new booking with only those three:
//     const newBooking = new Booking({
//       eventName,
//       bookingRate,
//       paymentMode,
//       // other fields will be undefined (since schema marks them optional)
//     });

//     await newBooking.save();

//     res.status(201).json({
//       message: 'Booking created successfully',
//       booking: newBooking
//     });
//   } catch (error) {
//     console.error('Booking creation error:', error);
//     res.status(500).json({ message: 'Server error while creating booking' });
//   }
// });

// //get the bookings on my bookings page
// router.get('/bookings', verifyToken, async (req, res) => {
//   try {
//     const bookings = await Booking.find().sort({ createdAt: -1 });
//     res.json(bookings);
//   } catch (error) {
//     console.error('Error fetching bookings:', error);
//     res.status(500).json({ message: 'Server error while fetching bookings' });
//   }
// });


router.post('/bookings', verifyToken, async (req, res) => {
  try {
    const { eventName, bookingRate, paymentMode,eventId,date,time} = req.body;
    const { email: userEmail, id: userId, role } = req.user; // assume JWT payload includes these

    // Validate required fields:
    if (!eventName || bookingRate == null || !paymentMode) {
      return res.status(400).json({
        message: 'Missing required fields: eventName, bookingRate, or paymentMode'
      });
    }

    // Create a new booking, automatically attaching userEmail (and user ID if you want)
    const newBooking = new Booking({
      eventName,
      bookingRate,
      paymentMode,
      userEmail,  
      eventId   ,
      date,time
      
      
    });

    await newBooking.save();

    res.status(201).json({
      message: 'Booking created successfully',
      booking: newBooking
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: 'Server error while creating booking' });
  }
});

// GET /bookings/user/me
router.get('/bookings/user/me', verifyToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const bookings = await Booking.find({ userEmail }).sort({ createdAt: -1 });
    if (!bookings.length) {
      return res.status(404).json({ message: 'You have no bookings' });
    }
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Server error while fetching your bookings' });
  }
});

// DELETE /bookings/:id - Cancel a booking
router.delete('/bookings/:id', verifyToken, async (req, res) => {
  const bookingId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    return res.status(400).json({ message: 'Invalid booking ID' });
  }

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check ownership or admin role
    if (req.user.role !== 'admin' && booking.userEmail !== req.user.email) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    await Booking.findByIdAndDelete(bookingId);
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Server error while cancelling the booking' });
  }
});






module.exports = router;
