const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const mockData = require('./mock_data.js')

const api = supertest(app)

test('4 blogs should be returned as json', async () => {
  const response = await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  expect(response.body.length).toBe(4)
})

test('a specific blog should be within the result set', async () => {
  const response = await api.get('/api/blogs')
  const contents = response.body.map(res => res.title)
  expect(contents).toContain('Go To Statement Considered Harmful')
})

test('blog identifier should be \'id\'', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

beforeEach(async () => {
  await Blog.deleteMany({})

  let blog = new Blog(mockData.blogs[0])
  await blog.save()

  blog = new Blog(mockData.blogs[1])
  await blog.save()

  blog = new Blog(mockData.blogs[2])
  await blog.save()

  blog = new Blog(mockData.blogs[3])
  await blog.save()
})

afterAll(() => mongoose.connection.close())