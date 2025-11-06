const express = require('express');

const protect = require('../middleware/login'); // FIXED import
const { signup, login } = require('../controller/login');

const router = express.Router();

// POST route for admin signup
router.post('/admin/signup', signup);

// POST route for admin login
router.post('/admin/login', login);



// Protected route (Admin dashboard)
router.get('/admin/dashboard', protect, (req, res) => {
  res.status(200).json({ message: 'Welcome to the admin dashboard', admin: req.admin });
});

module.exports = router;