const mongodb = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';
const MongoClient = mongodb.MongoClient;

MongoClient.connect(
	connectionURL, 
	{ useNewUrlParser: true, useUnifiedTopology: true }, 
	(error, client) => {
		if (error) {
			console.log('Unable to connect to database!');
			return;
		}

		const db = client.db(databaseName);

		db.collection('users').insertOne({
			name: 'Johnatan',
			age: 31,
		});

		db.collection('users').insertMany([
			{
				name: 'Jen',
				age: 28,
			},
			{
				name: 'Gunther',
				age: 27,
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
	},
);