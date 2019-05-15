const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

test('2 users should be returned as json', async () => {
  const response = await api.get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  expect(response.body.length).toBe(2)
})

test('a new user should be created', async () => {
  const user = {
    username: 'bigboi',
    name: 'Big Boi',
    password: 'qwerty'
  }
  await api.post('/api/users').send(user)
  const response = await api.get('/api/users')
  expect(response.body.length).toBe(3)
  const names = response.body.map(res => res.name)
  expect(names).toContain('Big Boi')
})

test('username must be at least 3 characters long', async () => {
  const user = {
    username: 'te',
    password: 'qwerty'
  }
  await api.post('/api/users').send(user).expect(400)
})

test('password must be at least 3 characters long', async () => {
  const user = {
    username: 'test',
    password: 'qw'
  }
  await api.post('/api/users').send(user).expect(400)
})

test('username must be unique', async () => {
  const user = {
    username: 'test.user',
    password: 'qwerty'
  }
  await api.post('/api/users').send(user).expect(400)
})

beforeEach(async () => {
  await User.deleteMany({})

  await new User({ username: 'test.user', password: 'foobar' }).save()
  await new User({ username: 'test.user2', password: 'foobar' }).save()
})

afterAll(() => mongoose.connection.close())