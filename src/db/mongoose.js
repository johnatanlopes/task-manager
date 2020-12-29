const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
	useNewUrlParser: true,
	useCreateIndex: true,
});

const User = mongoose.model('User', {
	name: {
		type: String,
		required:  true,
	},
	email: {
		type: String,
		required: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error('Email is invalid')
			}
		},
	},
	password: {
		type: String,
		required: true,
		minlength: 7,
		trim: true,
		validate(value) {
			if (value.toLowerCase().includes('password')) {
				throw new Error('Password cannot contain "password"')
			}
		},
	},
	age: {
		type: Number,
		validate(value) {
			if (value < 0) {
				throw new Error('Age must be a positive number');
			}
		},
	},
});

const me = new User({
	name: 'Johnatan',
	email: 'johnatanlopes@gmail.com',
	password: '123456789',
	age: 31,
});

me.save().then((result) => {
	console.log(result);
}).catch((error) => {
	console.log(error);
});

const Task = mongoose.model('Task', {
	description: {
		type: String,
		required: true,
		trim: true,
	},
	completed: {
		type: Boolean,
		default: false,
	},	
});

const task = Task({
	description: 'Learn the Mongoose library',
	completed: false,
});

task.save().then((result) => {
	console.log(result);
}).catch((error) => {
	console.log(error);
});