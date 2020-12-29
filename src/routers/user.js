const express = require('express');
const router = new express.Router();

const User = require('../models/user');

router.get('/users', async (req, res) => {
	try {
		const users = await User.find({});
		return res.status(200).json(users);
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

router.get('/users/:id', async (req, res) => {
	try {
		const _id = req.params.id;
		const user = await User.findById(_id);

		if (!user) {
			return res.status(404).json();
		}

		return res.status(200).json(user);
	} catch (error) {
		return res.status(500).json(error);
	}
});

router.put('/users/:id', async (req, res) => {
	try {
		const updates = Object.keys(req.body);
		const allowedUpdates = ['name', 'email', 'password', 'age'];

		const isValidOperation = updates.every((update) => {
			return allowedUpdates.includes(update);
		});

		if (!isValidOperation) {
			return res.status(400).json({ error: 'Invalid updates' });
		}

		const _id = req.params.id;
		const user = await User.findByIdAndUpdate(_id, req.body, { 
			new: true, 
			runValidators: true,
		});

		if (!user) {
			return res.status(404).json();
		}

		return res.status(200).json(user);
	} catch (error) {
		return res.status(500).json(error);
	}
});

router.delete('/users/:id', async (req, res) => {
	try {
		const _id = req.params.id;
		const user = await User.findByIdAndDelete(_id);

		if (!user) {
			return res.status(404).json();
		}

		return res.status(200).json(user);
	} catch (error) {
		return res.status(500).json(error);
	}
});

module.exports = router;