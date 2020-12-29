const express = require('express');
require('./db/mongoose');

const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = process.env.PORT || 3335;

app.use(express.json());

app.get('/users', (req, res) => {
    User.find({}).then((users) => {
        return res.status(200).json(users);
    }).catch((error) => {
        return res.status(500).json(error);
    });
});

app.post('/users', (req, res) => {
    const user = new User(req.body);

    user.save().then(() => {
        return res.status(201).json(user);
    }).catch((error) => {
        return res.status(400).json(error);
    });
});

app.get('/users/:id', (req, res) => {
    const _id = req.params.id;

    User.findById(_id).then((user) => {
        if (!user) {
            return res.status(404).json();
        }

        return res.status(200).json(user);
    }).catch((error) => {
        return res.status(500).json(error);
    });
});

app.get('/tasks', (req, res) => {
    Task.find({}).then((tasks) => {
        return res.status(200).json(tasks);
    }).catch((error) => {
        return res.status(500).json(error);
    });
});

app.post('/tasks', (req, res) => {
    const task = new Task(req.body);

    task.save().then(() => {
        return res.status(201).json(task);
    }).catch((error) => {
        return res.status(400).json(error);
    });
});

app.get('/tasks/:id', (req, res) => {
    const _id = req.params.id;

    Task.findById(_id).then((task) => {
        if (!task) {
            return res.status(404).json();
        }

        return res.status(200).json(task);
    }).catch((error) => {
        return res.status(500).json(error);
    });
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});