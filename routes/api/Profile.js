const express = require('express');
const Account = require('../../models/Account');
const Authentication = require('../../middleware/Authentication');
const { check, validationResult } = require('express-validator');
const config = require('config');
const Profile = require('../../models/Profile');
const request = require('request');
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

// @route   PUT api/profile/experience
// @desc    Add profile Experience
// @access  Private
router.put('/experience', [Authentication, [
    check('title', 'Title is Required.').not().isEmpty(),
    check('company', 'Company is Required.').not().isEmpty(),
    check('from', 'Starting Date is Required.').not().isEmpty()
]], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }

        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }

        try {
            const profile = await Profile.findOne({ account: req.account.id });
            console.log(profile)
            profile.experience.unshift(newExp);

            await profile.save();

            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error.');
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error.');
    }
});

// @route   DELETE api/profile/experience/:exp_id
// @desc    Remove profile's Experience
// @access  Private
router.delete('/experience/:exp_id', Authentication, async (req, res) => {
    try {
        const profile = await Profile.findOne({ account: req.account.id });

        //Get & Remove Index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error.');
    }
});

// @route   PUT api/profile/education
// @desc    Add profile education
// @access  Private
router.put('/education', [Authentication, [
    check('school', 'School is Required.').not().isEmpty(),
    check('degree', 'Degree is Required.').not().isEmpty(),
    check('fieldofstudy', 'Field of Study is Required.').not().isEmpty(),
    check('from', 'Starting Date is Required.').not().isEmpty()
]], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }

        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        } = req.body;

        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        }

        try {
            const profile = await Profile.findOne({ account: req.account.id });
            console.log(profile)
            profile.education.unshift(newEdu);

            await profile.save();

            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error.');
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error.');
    }
});

// @route   DELETE api/profile/education/:edu_id
// @desc    Remove profile's education
// @access  Private
router.delete('/education/:edu_id', Authentication, async (req, res) => {
    try {
        const profile = await Profile.findOne({ account: req.account.id });

        //Get & Remove Index
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

        profile.education.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error.');
    }
});

// @route   GET api/profile/github/:username
// @desc    Get Account Repos from Gitub
// @access  Public
router.get('/github/:username', (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_scret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
        }

        request(options, (error, response, body) => {
            if (error) console.error(error);

            if (response.statusCode !== 200) {
                res.status(404).json({ msg: 'No Github Profile Found' });
            }

            res.json(JSON.parse(body));
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error.');
    }
});

module.exports = router;