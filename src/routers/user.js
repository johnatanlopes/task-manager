const express = require('express');
const router = new express.Router();
const multer = require('multer');

const authMiddleware = require('../middleware/auth');
const User = require('../models/user');

const upload = multer({
	dest: 'avatar',
});

router.post('/users/login', async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findByCredentials(email, password);
		const token = await user.generateAuthToken();
		return res.status(200).json({ user, token });
	} catch (error) {
		return res.status(500).json(error);
	}
});

router.get('/users', authMiddleware, async (req, res) => {
	try {
		const users = await User.find({});
		return res.status(200).json(users);
	} catch (error) {
		return res.status(500).json(error);
	}
});

router.get('/users/me', authMiddleware, async (req, res) => {
	return res.status(200).json(req.user);
});

router.post('/users/logout', authMiddleware, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token !== req.token;
		});

		await req.user.save();
		return res.status(200).json();
	} catch (error) {
		return res.status(500).json(error);
	}
});

router.post('/users/logout/all', authMiddleware, async (req, res) => {
	try {
		req.user.tokens = [];
		await req.user.save();
		return res.status(200).json();
	} catch (error) {
		return res.status(500).json(error);
	}
});

router.post('/users', async (req, res) => {
	try {
		const user = new User(req.body);
		await user.save();
		return res.status(201).json(user);
	} catch (error) {
		return res.status(400).json(error);
	}
});

router.put('/users/me', authMiddleware, async (req, res) => {
	try {
		const updates = Object.keys(req.body);
		const allowedUpdates = ['name', 'email', 'password', 'age'];

		const isValidOperation = updates.every((update) => {
			return allowedUpdates.includes(update);
		});

		if (!isValidOperation) {
			return res.status(400).json({ error: 'Invalid updates' });
		}

		updates.forEach((update) => req.user[update] = req.body[update]);

		await req.user.save();
		
		return res.status(200).json(req.user);
	} catch (error) {
		return res.status(500).json(error);
	}
});

router.delete('/users/me', authMiddleware, async (req, res) => {
	try {
		await req.user.remove();
		return res.status(200).json(req.user);
	} catch (error) {
		return res.status(500).json(error);
	}
});

router.post('/users/me/avatar', upload.single('avatar'), (req, res) => {
	return res.status(200).json();
});

module.exports = router;