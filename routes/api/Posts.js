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

// @route   PUT api/posts/like/:id
// @desc    Adds a like to Post
// @access  Private
router.put('/like/:id', Authentication, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        //Check if Post Account Already liked
        if (post.likes.filter(like => like.account.toString() === req.account.id).length > 0) {
            return res.status(400).json({ msg: 'Post Already Liked.' });
        }

        post.likes.unshift({ account: req.account.id });

        await post.save();

        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error.');
    }
});

// @route   PUT api/posts/unlike/:id
// @desc    Adds a like to Post
// @access  Private
router.put('/unlike/:id', Authentication, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        //Check if Post Account Already liked
        if (post.likes.filter(like => like.account.toString() === req.account.id).length === 0) {
            return res.status(400).json({ msg: "Post Hasn't Liked." });
        }

        //Get Remove Index
        const removeIndex = post.likes.map(like => like.account.toString()).indexOf(req.account.id);

        post.likes.splice(removeIndex, 1);

        await post.save();

        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error.');
    }
});

// @route   POST api/posts/comment/:id
// @desc    Comment on a Post
// @access  Private 
router.post('/comment/:id', [Authentication, [
    check('text', 'Text is Required.').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const account = await Account.findById(req.account.id).select('-password');

        const post = await Post.findById(req.params.id);

        const newComment = {
            text: req.body.text,
            name: account.name,
            avatar: account.avatar,
            account: req.account.id
        };

        post.comments.unshift(newComment);

        await post.save();

        res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error.');
    }
});

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete Comment on a Post
// @access  Private 
router.delete('/comment/:id/:comment_id', Authentication, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        const comment = post.comments.find(comment => comment.id === req.params.comment_id);

        if (!comment) {
            return res.status(404).json({ msg: 'Comment Not Found.' });
        }

        if (comment.account.toString() !== req.account.id) {
            return res.status(401).json({ msg: 'Account Not Authorized.' });
        }

        const removeIndex = post.comments.map(comment => comment.account.toString()).indexOf(req.account.id);

        post.comments.splice(removeIndex, 1);

        await post.save();

        res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error.');
    }
});

module.exports = router;