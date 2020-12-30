const express = require('express');
const router = express.Router();

const Task = require('../models/task');

router.get('/tasks', async (req, res) => {
	try {
		const tasks = await Task.find({});
		return res.status(200).json(tasks);
	} catch (error) {
		return res.status(500).json(error);
	}
});

router.post('/tasks', async (req, res) => {
	try {
		const task = new Task(req.body);
		await task.save();
		return res.status(201).json(task);
	} catch (error) {
		return res.status(400).json(error);
	}
});

router.get('/tasks/:id', async (req, res) => {
	try {
		const _id = req.params.id;
		const task = await Task.findById(_id);

		if (!task) {
			return res.status(404).json();
		}

		return res.status(200).json(task);
	} catch (error) {
		return res.status(500).json(error);
	}
});

router.put('/tasks/:id', async (req, res) => {
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
		const task = await Task.findById(_id);

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

router.delete('/tasks/:id', async (req, res) => {
	try {
		const _id = req.params.id;
		const task = await Task.findByIdAndDelete(_id);

		if (!task) {
			return res.status(404).json();
		}

		return res.status(200).json(task);
	} catch (error) {
		return res.status(500).json(error);
	}
});

module.exports = router;