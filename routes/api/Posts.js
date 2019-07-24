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

// @route   GET api/posts
// @desc    Gets all Posts
// @access  Private
router.get('/', Authentication, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });

        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error.');
    }
});

// @route   GET api/posts/:id
// @desc    Gets Post by id
// @access  Private
router.get('/:id', Authentication, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: 'Post Not Found.' });
        }

        res.json(post);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post Not Found.' });
        }
        res.status(500).send('Server Error.');
    }
});

// @route   DELETE api/posts/id
// @desc    Deletes Post by id
// @access  Private
router.delete('/:id', Authentication, async (req, res) => {
    try {
        const posts = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: 'Post Not Found.' });
        }

        //Check account
        if (post.account.toString() !== req.account.id) {
            res.status(401).json({ msg: 'Account Not Authorized.' });
        }

        await post.remove();

        res.json({ msg: 'Post Removed.' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post Not Found.' });
        }
        res.status(500).send('Server Error.');
    }
});

module.exports = router;