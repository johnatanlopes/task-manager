require('dotenv').config({ path: '.test.env' });
const request = require('supertest');

const app = require('../src/app');
const User = require('../src/models/user');
const { userOneId, userOne, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);

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

test('Should upload avatar image', async () => {
    await request(app).post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile.jpg')
        .expect(200);

    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update valid user fields', async () => {
    await request(app).put('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Josuel',
        })
        .expect(200);

    const user = await User.findById(userOneId);
    expect(user.name).toEqual('Josuel');
});

test('Should not update invalid user fields', async () => {
    await request(app).put('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Rio de Janeiro',
        })
        .expect(400);
});