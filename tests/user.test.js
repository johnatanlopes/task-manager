require('dotenv').config({ path: '.test.env' })
const request = require('supertest');

const app = require('../src/app');
const User = require('../src/models/user');

const userOne = {
    name: 'Jose',
    email: 'jose@example.com',
    password: '90abcd!!',
};

beforeEach(async () => {
    await User.deleteMany();
    await new User(userOne).save();
});

test('Should signup a new user', async () => {
    await request(app).post('/users').send({
        name: 'Test',
        email: 'test@exemple.com',
        password: '123456789'
    }).expect(201);
});

test('Should login existing user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password,
    }).expect(200);
});

test('Should not login nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: 'non@example.com',
        password: 'thisisnotmypass',
    }).expect(400);
});