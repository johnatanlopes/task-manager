const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth');
const Task = require('../models/task');

router.get('/tasks', authMiddleware, async (req, res) => {
	try {
		const tasks = await Task.find({ owner: req.user._id });
		return res.status(200).json(tasks);
	} catch (error) {
		return res.status(500).json(error);
	}
});

router.post('/tasks', authMiddleware, async (req, res) => {
	try {
		const task = new Task({
			...req.body,
			owner: req.user._id,
		});

		await task.save();
		
		return res.status(201).json(task);
	} catch (error) {
		return res.status(400).json(error);
	}
});

router.get('/tasks/:id', authMiddleware, async (req, res) => {
	try {
		const _id = req.params.id;
		const task = await Task.findOne({	_id, owner: req.user._id });

		if (!task) {
			return res.status(404).json();
		}

		return res.status(200).json(task);
	} catch (error) {
		return res.status(500).json(error);
	}
});

router.put('/tasks/:id', authMiddleware, async (req, res) => {
	try {
		const updates = Object.keys(req.body);
		const allowedUpdates = ['description', 'completed'];

		const isValidOperation = updates.every((update) => {
			return allowedUpdates.includes(update);
		});

		if (!isValidOperation) {
			return res.status(400).json({ error: 'Invalid updates' });
		}

		const _id = req.params.id;
		const task = await Task.findOne({	_id, owner: req.user._id });

		if (!task) {
			return res.status(404).json();
		}

		updates.forEach((update) => task[update] = req.body[update]);

		await task.save();

		return res.status(200).json(task);
	} catch (error) {
		return res.status(500).json(error);
	}
});

router.delete('/tasks/:id', authMiddleware, async (req, res) => {
	try {
		const _id = req.params.id;
		const task = await Task.findOneAndDelete({	_id, owner: req.user._id });

		if (!task) {
			return res.status(404).json();
		}

		return res.status(200).json(task);
	} catch (error) {
		return res.status(500).json(error);
	}
});

module.exports = router;