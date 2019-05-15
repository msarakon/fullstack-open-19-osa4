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
  expect(response.body.length).toBe(6)
})

test('a specific blog should be within the result set', async () => {
  const response = await api.get('/api/blogs')
  const titles = response.body.map(res => res.title)
  expect(titles).toContain('Go To Statement Considered Harmful')
})

test('blog identifier should be \'id\'', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

test('a new blog should be created', async () => {
  const blog = {
    title: 'IT-testi',
    author: 'Testaaja',
    url: 'www.google.fi',
    likes: 3
  }
  await api.post('/api/blogs').send(blog).expect(201)
  const response = await api.get('/api/blogs')
  expect(response.body.length).toBe(7)
  const titles = response.body.map(res => res.title)
  expect(titles).toContain('IT-testi')
})

test('if no \'likes\' value is given, use default of 0', async () => {
  const blog = {
    title: 'IT-testi',
    author: 'Testaaja',
    url: 'www.google.fi'
  }
  const response = await api.post('/api/blogs').send(blog).expect(201)
  expect(response.body.likes).toBe(0)
})

test('\'title\' and \'url\' should be mandatory fields', async () => {
  const blog = {
    author: 'Testaaja',
    likes: 3
  }
  await api.post('/api/blogs').send(blog).expect(400)
})

test('should remove a blog', async () => {
  await api.delete('/api/blogs/5a422aa71b54a676234d17f8').expect(204)
  const response = await api.get('/api/blogs')
  expect(response.body.length).toBe(5)
  const titles = response.body.map(res => res.title)
  expect(titles).not.toContain('Go To Statement Considered Harmful')
})

test('should return 404 when attempting to delete a blog that does not exist', async () => {
  await api.delete('/api/blogs/5a422aa71b54a676234d17f7').expect(404)
  const response = await api.get('/api/blogs')
  expect(response.body.length).toBe(6)
})

test('should update blog likes count', async () => {
  const blog = { likes: 9 }
  const response = await api.put('/api/blogs/5a422aa71b54a676234d17f8').send(blog)
  console.log(response)
  expect(response.body.likes).toBe(9)
})

test('should return 404 when attempting to update a blog that does not exist', async () => {
  const blog = { likes: 9 }
  await api.put('/api/blogs/5a422aa71b54a676234d17f7').send(blog).expect(404)
})

beforeEach(async () => {
  await Blog.deleteMany({})

  mockData.blogs.forEach(async mockBlog => {
    let blog = new Blog(mockBlog)
    await blog.save()
  })
})

afterAll(() => mongoose.connection.close())