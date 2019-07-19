const express = require('express');
const router = express.Router();

// @route   GET api/user
// @desc    Test Route
// @access  Public 
router.get('/', (req, res) => res.send('User Route.'));

module.exports = router;