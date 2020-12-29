const mongodb = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;

MongoClient.connect(
	connectionURL, 
	{ useNewUrlParser: true, useUnifiedTopology: true }, 
	(error, client) => {
		if (error) {
			console.log('Unable to connect to database!');
			return;
		}

		const db = client.db(databaseName);

		// Insert one
		db.collection('users').insertOne({
			name: 'Johnatan',
			age: 31,
		});

		db.collection('users').insertOne({
			name: 'Caroline',
			age: 26,
		});

		// Insert many
		db.collection('users').insertMany([
			{
				name: 'Jen',
				age: 28,
			},
			{
				name: 'Gunther',
				age: 26,
			},
		]);

		db.collection('tasks').insertMany([
			{
				description: 'Clean the house',
				completed: true,
			},
			{
				description: 'Renew inspection',
				completed: false,
			},
			{
				description: 'Pot plants',
				completed: false,
			},
		]);

		// Querying one document
		db.collection('users').findOne({ name: 'Johnatan' }, (error, user) => {
			if (error) {
				console.log('Unable to fetch');
			}

			console.log(user);
		});

		// Querying multiple documents
		db.collection('users').find({ age: 26 }).toArray((error, users) => {
			console.log(users);
		});

		// count
		db.collection('users').find({ age: 26 }).count((error, count) => {
			console.log(count);
		});

		// Querying id
		db.collection('users').findOne({ _id: new ObjectID('5feaf8117146a24b5c3f5c89')  }, (error, user) => {
			console.log(user);
		});

		// Update
		db.collection('users').updateOne({
			_id: new ObjectID('5feaf8117146a24b5c3f5c89'),
		},
		{
			$set: {
				name: 'Johnatan Lopes',
			},
		}).then((result) => {
			console.log(result);
		}).catch((error) => {
			console.log(error);
		});

		db.collection('tasks').updateMany({
			completed: false,
		}, {
			$set: {
				completed: true,
			},
		}).then((result) => {
			console.log(result);
		}).catch((error) => {
			console.log(error);
		});
	},
);