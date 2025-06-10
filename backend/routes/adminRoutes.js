// const express = require('express');
// const router = express.Router();
// const jwt = require('jsonwebtoken');
// const Notification = require('../model/announcementData'); 
// const JWT_SECRET = 'resApp'; 

// router.use(express.json());
// router.use(express.urlencoded({ extended: true }));


// function verifyToken(req, res, next) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) return res.status(401).send({ message: 'Unauthorized: No token provided' });

//   const token = authHeader.split(' ')[1];
//   try {
//     const payload = jwt.verify(token, JWT_SECRET);
//     req.user = payload;
//     next();
//   } catch (err) {
//     return res.status(403).send({ message: 'Invalid or expired token' });
//   }
// }


// function verifyAdminToken(req, res, next) {
//   verifyToken(req, res, () => {
//     if (req.user.role !== 'admin') {
//       return res.status(403).send({ message: 'Access denied: Admins only' });
//     }
//     next();
//   });
// }

// router.get('/', verifyToken, async (req, res) => {
//   try {
//     const announcements = await Notification.find().sort({ createdAt: -1 });
//     res.status(200).json(announcements);
//   } catch (err) {
//     res.status(500).send({ message: 'Failed to fetch announcements', error: err.message });
//   }
// });


// router.post('/add', verifyAdminToken, async (req, res) => {
//   try {
//     const { title, message } = req.body;

//     const newAnnouncement = new Notification({
//       title,
//       message,
//       createdBy: 'admin',
//       createdAt: new Date() 
//     });

//     await newAnnouncement.save();
//     res.status(201).send({ message: 'Announcement created successfully', announcement: newAnnouncement });
//   } catch (err) {
//     res.status(400).send({ message: 'Failed to create announcement', error: err.message });
//   }
// });


// router.put('/edit/:id', verifyAdminToken, async (req, res) => {
//   try {
//     const updated = await Notification.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updated) return res.status(404).send({ message: 'Announcement not found' });

//     res.status(200).send({ message: 'Announcement updated', announcement: updated });
//   } catch (err) {
//     res.status(500).send({ message: 'Failed to update announcement', error: err.message });
//   }
// });


// router.delete('/delete/:id', verifyAdminToken, async (req, res) => {
//   try {
//     const deleted = await Notification.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).send({ message: 'Announcement not found' });

//     res.status(200).send({ message: 'Announcement deleted' });
//   } catch (err) {
//     res.status(500).send({ message: 'Failed to delete announcement', error: err.message });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Notification = require('../model/announcementData');
const JWT_SECRET = 'resApp';
const Message = require('../model/messageData')
const User=require('../model/userData')
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

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

function verifyAdminToken(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).send({ message: 'Access denied: Admins only' });
    }
    next();
  });
}

// router.get('/', verifyToken, async (req, res) => {      working one
//   try {
//     const announcements = await Notification.find().sort({ createdAt: -1 });
//     res.status(200).json(announcements);
//   } catch (err) {
//     res.status(500).send({ message: 'Failed to fetch announcements', error: err.message });
//   }
// });
router.get('/',verifyToken, async (req, res) => {
  try {
    const announcements = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json(announcements);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch announcements.' });
  }
});

router.post('/add', verifyAdminToken, async (req, res) => {       //working one
  try {
    const { title, message } = req.body;

    const newAnnouncement = new Notification({
      title,
      message,
      createdBy: 'admin',
      createdAt: new Date(),
      likes: 0,
      dislikes: 0,
      votedUsers: []
    });

    await newAnnouncement.save();
    res.status(201).send({ message: 'Announcement created successfully', announcement: newAnnouncement });
  } catch (err) {
    res.status(400).send({ message: 'Failed to create announcement', error: err.message });
  }
});



router.put('/edit/:id', verifyAdminToken, async (req, res) => {               //workin one
  try {   
    const { title, message } = req.body;

    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      { title, message,  $currentDate: { updatedAt: true } }, // <-- only allow these fields
      { new: true }
    );

    if (!updated) {
      return res.status(404).send({ message: 'Announcement not found' });
    }

    res.status(200).send({ message: 'Announcement updated', announcement: updated });

  } catch (err) {
    res.status(500).send({ message: 'Failed to update announcement', error: err.message });
  }
});


// router.put('/edit/:id', verifyAdminToken, async (req, res) => {
//   try {
//     const { title, description } = req.body;
//     await Notification.findByIdAndUpdate(req.params.id, { title, description });
//     res.status(200).json({ message: 'Announcement updated successfully.' });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to update announcement.' });
//   }
// });



router.delete('/delete/:id', verifyAdminToken, async (req, res) => {           //working one
  try {
    const deleted = await Notification.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send({ message: 'Announcement not found' });

    res.status(200).send({ message: 'Announcement deleted' });
  } catch (err) {
    res.status(500).send({ message: 'Failed to delete announcement', error: err.message });
  }
});

//POST: Vote on an announcement (user or admin)


// router.post('/vote/:id', verifyToken, async (req, res) => {      // the one that is working 
//   try {
//     const { voteType } = req.body; 
//     const userEmail = req.user.email;
//     const announcement = await Notification.findById(req.params.id);

//     if (!announcement) return res.status(404).send({ message: 'Announcement not found' });

//     const existingVote = announcement.votedUsers.find(vote => vote.email === userEmail);
//     if (existingVote) {
//       return res.status(400).send({ message: 'You have already voted on this announcement' });
//     }

//     if (voteType === 'like') {
//       announcement.likes += 1;
//     } else if (voteType === 'dislike') {
//       announcement.dislikes += 1;
//     } else {
//       return res.status(400).send({ message: 'Invalid vote type' });
//     }

//     announcement.votedUsers.push({ email: userEmail, voteType });
//     await announcement.save();

//     res.status(200).send({
//       message: `You have ${voteType}d this announcement`,
//       likes: announcement.likes,
//       dislikes: announcement.dislikes
//     });

//   } catch (err) {
//     res.status(500).send({ message: 'Failed to vote on announcement', error: err.message });
//   }
// });

router.delete('/announcement/:id/votes', verifyToken, async (req, res) => {
  try {
    const announcement = await Notification.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    announcement.votedUsers = []; // Clear all votes
    announcement.isNewVote = false;
    await announcement.save();

    res.status(200).json({ message: 'Votes cleared successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to clear votes' });
  }
});
router.post('/vote/:id', verifyToken, async (req, res) => {                                  // the voting one 
  try {
    const { voteType } = req.body;
    const userEmail = req.user.email;
    const announcement = await Notification.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    // Check if user already voted
    const existingVote = announcement.votedUsers.find(v => v.email === userEmail);

    if (existingVote) {
      return res.status(400).json({ message: 'You have already voted on this announcement.' });
    }

    // Validate voteType and update counts
    if (voteType === 'like') {
      announcement.likes += 1;
    } else if (voteType === 'dislike') {
      announcement.dislikes += 1;
    } else {
      return res.status(400).json({ message: 'Invalid vote type' });
    }

    // Add user vote record
    announcement.votedUsers.push({
      email: userEmail,
      voteType,
      votedAt: new Date(),
      updatedAtSnapshot: announcement.updatedAt
    });

    await announcement.save();

    res.status(200).json({
      message: `You have ${voteType}d this announcement.`,
      likes: announcement.likes,
      dislikes: announcement.dislikes
    });

  } catch (err) {
    res.status(500).json({
      message: 'Failed to vote on announcement',
      error: err.message
    });
  }
});


router.put('/messages/:id/pay', async (req, res) => {                                  // the working one for payment message
  try {
    const messageId = req.params.id;
    const {
      isPaid,
      paymentDate,
      paymentAmount,
      paymentMethod,
      paidBy,
    } = req.body;
   console.log('Received paidBy:', paidBy); 
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: 'Message not found' });

    if (typeof isPaid === 'boolean') message.isPaid = isPaid;
    if (paymentDate) message.paymentDate = new Date(paymentDate);
    if (paymentAmount) message.paymentAmount = paymentAmount;
    if (paymentMethod) message.paymentMethod = paymentMethod;
    if (paidBy) message.paidBy = paidBy;

    await message.save();

    res.json({
      message: 'Payment status updated successfully',
      updatedMessage: message,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});   



// router.put('/messages/:id/pay', verifyToken, async (req, res) => {
//   try {
//     const messageId = req.params.id;
//     const userId = req.user.id;

//     const {
//       isPaid,
//       paymentDate,
//       paymentAmount,
//       paymentMethod,
//     } = req.body;

//     const message = await Message.findById(messageId);
//     if (!message) return res.status(404).json({ message: 'Message not found' });

//     if (message.isPaid) {
//       return res.status(400).json({ message: 'This due is already paid.' });
//     }

//     message.isPaid = isPaid ?? true;
//     message.paymentDate = new Date(paymentDate) || new Date();
//     message.paymentAmount = paymentAmount || message.amount;
//     message.paymentMethod = paymentMethod || 'online';
//     message.paidBy = userId;

//     await message.save();

//     res.json({
//       message: 'Payment successful',
//       updatedMessage: message,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });



router.post('/messages/add', verifyAdminToken, async (req, res) => {
  try {
    const { title, content, type,amount  } = req.body;

    const newMessage = new Message({
      title,
      content,
      type,
      amount,
      
      createdAt: new Date()
    });

    await newMessage.save();
    res.status(201).send({ message: 'Message created successfully', data: newMessage });
  } catch (err) {
    res.status(400).send({ message: 'Failed to create message', error: err.message });
  }
});


// router.get('/messages', verifyToken, async (req, res) => {                  // working one for fetch message
//   try {
//     const messages = await Message.find().sort({ createdAt: -1 });
//     res.status(200).json(messages);
//   } catch (err) {
//     res.status(500).send({ message: 'Failed to fetch messages', error: err.message });
//   }
// });

router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().populate('paidBy', 'email name');
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});








// DELETE: Delete message by ID (Admin only)
router.delete('/messages/delete/:id', verifyAdminToken, async (req, res) => {
  try {
    const deleted = await Message.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send({ message: 'Message not found' });

    res.status(200).send({ message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).send({ message: 'Failed to delete message', error: err.message });
  }
});
// UPDATE: Update message by ID (Admin only)
router.put('/messages/edit/:id', verifyAdminToken, async (req, res) => {
  try {
    const { title, content, type, amount } = req.body;

    const updatedMessage = await Message.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        type,
        amount,
        updatedAt: new Date(), // optional: track when updated
      },
      { new: true, runValidators: true }
    );

    if (!updatedMessage) {
      return res.status(404).send({ message: 'Message not found' });
    }

    res.status(200).send({ message: 'Message updated successfully', data: updatedMessage });
  } catch (err) {
    res.status(400).send({ message: 'Failed to update message', error: err.message });
  }
});





router.post('/messages/:id/pay', async (req, res) => {            // new one that perfectly works
  try {
    const messageId = req.params.id;
    const {
      isPaid,
      paymentDate,
      paymentAmount,
      paymentMethod,
      // paidBy,                 // changed here
    } = req.body;

     const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    // Decode the token to get the user's email
    const decoded = jwt.verify(token, JWT_SECRET); // c
    const paidByEmail = decoded.email;  //c

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: 'Message not found' });

    if (typeof isPaid === 'boolean') message.isPaid = isPaid;
    if (paymentDate) message.paymentDate = new Date(paymentDate);
    if (paymentAmount) message.paymentAmount = paymentAmount;
    if (paymentMethod) message.paymentMethod = paymentMethod;
    // if (paidBy) message.paidBy = paidBy;
 if (paidByEmail) message.paidBy = paidByEmail; //c
    await message.save();

    res.json({
      message: 'Payment status updated successfully',
      updatedMessage: message,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// display the due paid by users for admin

router.get('/paid-dues-details', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    const paidMessages = await Message.find({ isPaid: true }).select('title amount paymentDate paidBy');

    const grouped = {};

    for (const msg of paidMessages) {
      const userEmail = msg.paidBy;
      if (!userEmail) continue;

      // 🔍 Find user by email
      const user = await User.findOne({ email: userEmail }).select('name email');
      if (!user) continue;

      if (!grouped[userEmail]) {
        grouped[userEmail] = {
          name: user.name,
          email: user.email,
          payments: []
        };
      }

      grouped[userEmail].payments.push({
        title: msg.title,
        amount: msg.amount,
        paymentDate: msg.paymentDate,
      });
    }

    res.json(Object.values(grouped));

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// delete paid list

// DELETE /admin/paid-dues/:id
router.delete('/admin/paid-dues/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    const { id } = req.params;

    // Ensure the message exists and is paid
    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ message: 'Paid message not found' });
    }

    if (!message.isPaid) {
      return res.status(400).json({ message: 'This message is not marked as paid' });
    }

    // Delete the paid message
    await Message.findByIdAndDelete(id);
    res.status(200).json({ message: 'Paid dues record deleted successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while deleting paid dues' });
  }
});












module.exports = router;
