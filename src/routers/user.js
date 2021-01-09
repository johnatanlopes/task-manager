const express = require('express');
const router = new express.Router();
const multer = require('multer');
const sharp = require('sharp');

const authMiddleware = require('../middleware/auth');
const User = require('../models/user');
const { 
	sendWelcomeEmail, 
	sendCancelationEmail
} = require('../emails/account');

const upload = multer({
	dest: 'avatar',
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 1000000,
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(png|jpeg|jpg)$/)) {
			return cb(new Error('Please upload a png or jpg'));
		}

		cb(undefined, true);
	},
});

router.post('/users/login', async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findByCredentials(email, password);
		const token = await user.generateAuthToken();
		return res.status(200).json({ user, token });
	} catch (error) {
		return res.status(400).json(error);
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
		sendWelcomeEmail(user.email, user.name);
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
		sendCancelationEmail(req.user.email, req.user.name);
		return res.status(200).json(req.user);
	} catch (error) {
		return res.status(500).json(error);
	}
});

router.post('/users/me/avatar', authMiddleware, 
	upload.single('avatar'), async (req, res) => {
	const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
	req.user.avatar = buffer;
	await req.user.save();
	return res.status(200).json();
}, (error, req, res, next) => {
	return res.status(404).json({ error:error.message });
});

router.get('/users/:id/avatar', async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		if (!user || !user.avatar) {
			throw new Error();
		}

		res.set('Content-Type', 'image/jpg');
		return res.status(200).send(user.avatar);
	} catch (error) {
		return res.status(404).json();
	}
});

module.exports = router;