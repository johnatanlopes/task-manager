const express = require('express');
require('./db/mongoose');

const User = require('./models/user');

const app = express();
const port = process.env.PORT || 3335;

app.use(express.json());

app.post('/users', (req, res) => {
    const user = new User(req.body);

    user.save().then(() => {
        return res.json(user);
    }).catch((error) => {
        return res.status(400).json(error);
    });
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});