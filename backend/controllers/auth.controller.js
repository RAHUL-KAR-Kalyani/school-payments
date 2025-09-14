const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

exports.register = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        const user = new User({ email, password, name });
        await user.save();
        res.status(201).json({ message: 'User created' });
    } catch (err) {
        if (err.code === 11000) return res.status(400).json({ message: 'Email already exists' });
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });
        const valid = await user.comparePassword(password);
        if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
        const token = jwt.sign({ id: user._id, email: user.email }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
        res.status(201).json({ message: 'User loggedin', token, user });
    } catch (err) {
        next(err);
    }
};
