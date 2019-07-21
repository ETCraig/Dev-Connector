const express = require('express');
const Account = require('../../models/Account');
const Authentication = require('../../middleware/Authentication');
const { check, validationResult } = require('express-validator');
const Profile = require('../../models/Profile');
const router = express.Router();

// @route   GET api/profile/me
// @desc    Get Current User's Profile
// @access  Private 
router.get('/me', Authentication, async (req, res) => {
    try {
        const profile = await Profile.findOne({ account: req.account.id }).populate('account', ['name', 'avatar']);

        if (!profile) {
            res.status(400).json({ msg: 'There is no Profile for this Account.' });
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error.');
    }
});



// @route   POST api/profile
// @desc    Create or Update a User's Profile
// @access  Private 
router.post('/', (req, res) => {

});

module.exports = router;