const mongoose = require('mongoose');

const MONGODB_URL = process.env.MONGODB_URL;
const MONGODB_DBNAME = process.env.MONGODB_DBNAME;

mongoose.connect(`${MONGODB_URL}/${MONGODB_DBNAME}`, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});
