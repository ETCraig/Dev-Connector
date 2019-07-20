const express = require('express');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Account = require('../../models/User');

// @route   POST api/account
// @desc    Register a new User
// @access  Public 
router.post('/', [
    check('name', 'Name is Required.').not().isEmpty(),
    check('email', 'Please Include a Valid Email.').isEmail(),
    check('password', 'Please Enter a Password with 6 or More Characters.').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;

    try {
        let account = await Account.findOne({ email });

        if (account) {
            res.status(400).json({ errors: [{ msg: 'Account Already Exists.' }] });
        }

        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });

        account = new Account({
            name,
            email,
            password,
            avatar
        });

        const salt = await bcrypt.genSalt(10);

        account.password = await bcrypt.hash(password, salt);

        await account.save();

        res.status(200).send('Account Register.');
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;