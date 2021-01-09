require('dotenv').config({ path: '.test.env' });
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = require('../../src/models/user');
const Task = require('../../src/models/Task');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: 'Jose',
    email: 'jose@example.com',
    password: '90abcd!!',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    }],
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoId,
    name: 'Maria',
    email: 'Maria@example.com',
    password: '70abcd!!',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
    }],
};

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First task',
    completed: false,
    owner: userOne._id,
};

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second task',
    completed: true,
    owner: userOne._id,
};

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third task',
    completed: false,
    owner: userTwo._id,
};

const setupDatabase = async () => {
    await User.deleteMany();
    await Task.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();
};

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase,
};