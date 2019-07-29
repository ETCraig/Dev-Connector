const express = require('express');
const Account = require('../../models/Account');
const Authentication = require('../../middleware/Authentication');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const config = require('config');
const jwt = require('jsonwebtoken');
const router = express.Router();

// @route   GET api/auth
// @desc    Test Route
// @access  Public 
router.get('/', Authentication, async (req, res) => {
    try {
        const account = await Account.findById(req.account.id).select('-password');
        res.json(account)
    } catch (err) {
        res.status(500).send('Server Error.');
    }
});

// @route   POST api/auth
// @desc    Authenticate User & Get token
// @access  Public 
router.post('/', [
    check('email', 'Please Include a Valid Email.').isEmail(),
    check('password', 'Password is Required.').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
        let account = await Account.findOne({ email });

        if (!account) {
            res.status(400).json({ errors: [{ msg: 'Invalid Credentials.' }] });
        }

        const isMatch = await bcrypt.compare(password, account.password);

        if (!isMatch) {
            res.status(400).json({ errors: [{ msg: 'Invalid Credentials.' }] });
        }

        const payload = {
            account: {
                id: account.id
            }
        }
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err)
        res.status(500).send('Server Error');
    }
});

module.exports = router;