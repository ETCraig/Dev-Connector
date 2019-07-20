const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// @route   POST api/user
// @desc    Register a new User
// @access  Public 
router.post('/', [
    check('name', 'Name is Required.').not().isEmpty(),
    check('email', 'Please Include a Valid Email.').isEmail(),
    check('password', 'Please Enter a Password with 6 or More Characters.').isLength({ min: 6 })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body);
});

module.exports = router;