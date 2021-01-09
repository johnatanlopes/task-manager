require('dotenv').config({ path: '.test.env' })
const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = require('../src/app');
const User = require('../src/models/user');
const { send } = require('@sendgrid/mail');

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

beforeEach(async () => {
    await User.deleteMany();
    await new User(userOne).save();
});

test('Should signup a new user', async () => {
    const res = await request(app).post('/users').send({
        name: 'Test',
        email: 'test@exemple.com',
        password: '123456789'
    }).expect(201);

    expect(res.body.name).toBe('Test');

    expect(res.body).toMatchObject({
        name: 'Test',
        email: 'test@exemple.com',
    });

    const user = await User.findById(res.body._id);
    expect(user).not.toBeNull();
});

test('Should login existing user', async () => {
    const res = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password,
    }).expect(200);

    const user = await User.findById(userOneId);
    expect(res.body.token).toBe(user.tokens[1].token);
});

test('Should not login nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: 'non@example.com',
        password: 'thisisnotmypass',
    }).expect(400);
});

test('Should get profile for user', async () => {
    await request(app).get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
});

test('Should not get profile for unauthenticated user', async () => {
    await request(app).get('/users/me')
        .send()
        .expect(401);
});

test('Should delete account for user', async () => {
    await request(app).delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    const user = await User.findById(userOneId);
    expect(user).toBeNull();
});

test('Should not delete account for unauthenticated user', async () => {
    await request(app).delete('/users/me')
        .send()
        .expect(401);
});