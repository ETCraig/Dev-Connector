const express = require('express');
const Authentication = require('../../middleware/Authentication');
const Account = require('../../models/Account');
const { check, validationResult } = require('express-validator');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const router = express.Router();

// @route   POST api/posts
// @desc    Create a Post
// @access  Public 
router.post('/', [Authentication, [
    check('text', 'Text is Required.').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const account = await Account.findById(req.account.id).select('-password');

        const newPost = new Post({
            text: req.body.text,
            name: account.name,
            avatar: account.avatar,
            account: req.account.id
        });

        const post = await newPost.save();

        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error.');
    }

});

module.exports = router;