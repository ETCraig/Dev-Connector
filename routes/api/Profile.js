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
router.post('/', [Authentication, [
    check('status', 'Status is Required.').not().isEmpty(),
    check('skills', 'Skills is Required.').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;

    //Build Profile Object
    const profileFields = {};
    profileFields.account = req.account.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    //Build Social Object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
        let profile = await Profile.findOne({ account: req.account.id });

        //  Update
        if (profile) {
            profile = await Profile.findOneAndUpdate(
                { account: req.account.id },
                { $set: profileFields },
                { new: true }
            );
            return res.json(profile);
        }
        // Create
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error.');
    }

    console.log(profileFields.skills);
    res.send('YO');
});


// @route   GET api/profile
// @desc    Get all Profiles
// @access  Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('account', ['name', 'avatar']);

        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error.');
    }
});

// @route   GET api/profile/account/:account_id
// @desc    Get Profile by Account ID
// @access  Public
router.get('/account/:account_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ account: req.params.account_id }).populate('account', ['name', 'avatar']);
        if (!profile) return res.status(400).json({ msg: 'There is no Profile for This Account.' });
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile is not Found.' });
        }
        res.status(500).send('Server Error.');
    }
});

// @route   GET api/profile
// @desc    Deletes Profile, Account, and Posts
// @access  Private
router.delete('/', Authentication, async (req, res) => {
    try {
        console.log('YO');
        console.log('ID', req.account.id)
        await Profile.findOneAndRemove({ account: req.account.id });
        await Account.findOneAndRemove({ _id: req.account.id });

        res.json({ msg: 'Account Deleted.' }); 
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile is not Found.' });
        }
        res.status(500).send('Server Error.');
    }
});

module.exports = router;