const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const mockData = require('./mock_data.js')

const api = supertest(app)

test('1 user should be returned as json', async () => {
  const response = await api.get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  expect(response.body.length).toBe(1)
})

test('a new user should be created', async () => {
  const user = {
    username: 'bigboi',
    name: 'Big Boi',
    password: 'qwerty'
  }
  await api.post('/api/users').send(user)
  const response = await api.get('/api/users')
  expect(response.body.length).toBe(2)
})

beforeEach(async () => {
  await User.deleteMany({})
  
  mockData.users.forEach(async mockBlog => {
    let blog = new User(mockBlog)
    await blog.save()
  })
})

afterAll(() => mongoose.connection.close())