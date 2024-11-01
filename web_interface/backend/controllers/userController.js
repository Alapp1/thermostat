// controllers/userController.js
import User from '../models/User.js';

export const registerUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Username already taken');
        }

        const newUser = new User({ username, password });
        await newUser.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while registering');
    }
};

export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).send('Invalid credentials');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).send('Invalid credentials');
        }

        // Set session data
        req.session.loggedIn = true;
        req.session.username = username;

        res.status(200).send('Login successful');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while logging in');
    }
};

