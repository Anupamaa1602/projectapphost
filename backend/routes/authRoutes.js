



const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../model/userData');

const JWT_SECRET = 'resApp'; 

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// REGISTER
router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword, role } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).send({ message: 'All fields are required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).send({ message: 'Passwords do not match' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: 'User already exists' });
    }

    const newUser = new User({
      name,
      email,
      password, // plain text (⚠️ not secure)
      role: role || 'user'
    });

    await newUser.save();

    const token = jwt.sign({ email, role: newUser.role }, JWT_SECRET);

    res.status(201).send({
      message: 'Registration successful',
      token,
      role: newUser.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error during registration' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ message: 'User not found' });

    if (user.password !== password) {
      return res.status(401).send({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET,);

    res.status(200).send({
      message: 'Login successful',
      token,
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error during login' });
  }
});

// FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).send({ message: 'Email is required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ message: 'User not found' });

    const token = crypto.randomBytes(20).toString('hex');

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // valid for 15 mins
    await user.save();

    // For dev only - in real use, send via email
    res.status(200).send({
      message: 'Reset token generated',
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error generating reset token' });
  }
});

// RESET PASSWORD
router.post('/reset-password', async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;

  if (!token || !newPassword || !confirmPassword) {
    return res.status(400).send({ message: 'All fields are required' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).send({ message: 'Passwords do not match' });
  }

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) return res.status(400).send({ message: 'Invalid or expired token' });

    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.status(200).send({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error resetting password' });
  }
});

module.exports = router;
