const express = require('express');
require('./db/mongoose');

const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = process.env.PORT || 3335;

app.use(express.json());

app.get('/users', async (req, res) => {
	try {
		const users = await User.find({});
		return res.status(200).json(users);
	} catch (error) {
		return res.status(500).json(error);
	}
});

app.post('/users', async (req, res) => {
	try {
		const user = new User(req.body);
		await user.save();
		return res.status(201).json(user);
	} catch (error) {
		return res.status(400).json(error);
	}
});

app.get('/users/:id', async (req, res) => {
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

app.put('/users/:id', async (req, res) => {
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

app.delete('/users/:id', async (req, res) => {
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

app.get('/tasks', async (req, res) => {
	try {
		const tasks = await Task.find({});
		return res.status(200).json(tasks);
	} catch (error) {
		return res.status(500).json(error);
	}
});

app.post('/tasks', async (req, res) => {
	try {
		const task = new Task(req.body);
		await task.save();
		return res.status(201).json(task);
	} catch (error) {
		return res.status(400).json(error);
	}
});

app.get('/tasks/:id', async (req, res) => {
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

app.put('/tasks/:id', async (req, res) => {
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
		const task = await Task.findByIdAndUpdate(_id, req.body, { 
			new: true, 
			runValidators: true,
		});

		if (!task) {
			return res.status(404).json();
		}

		return res.status(200).json(task);
	} catch (error) {
		return res.status(500).json(error);
	}
});

app.delete('/tasks/:id', async (req, res) => {
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


app.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});