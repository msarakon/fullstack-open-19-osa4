const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const mockData = require('./mock_data.js')

const api = supertest(app)

test('blogs should be returned as json', async () => {
  await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
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
  const loginResponse = await login()
  const blog = {
    title: 'IT-testi',
    author: 'Testaaja',
    url: 'www.google.fi',
    likes: 3
  }
  await api.post('/api/blogs')
    .set('Authorization', `Bearer ${loginResponse.body.token}`)
    .send(blog)
    .expect(201)
  const response = await api.get('/api/blogs')
  expect(response.body.length).toBe(7)
  const titles = response.body.map(res => res.title)
  expect(titles).toContain('IT-testi')
})

test('if no \'likes\' value is given, use default of 0', async () => {
  const loginResponse = await login()
  const blog = {
    title: 'IT-testi',
    author: 'Testaaja',
    url: 'www.google.fi'
  }
  const response = await api.post('/api/blogs')
    .set('Authorization', `Bearer ${loginResponse.body.token}`)
    .send(blog)
    .expect(201)
  expect(response.body.likes).toBe(0)
})

test('\'title\' and \'url\' should be mandatory fields', async () => {
  const loginResponse = await login()
  const blog = {
    author: 'Testaaja',
    likes: 3
  }
  await api.post('/api/blogs')
    .set('Authorization', `Bearer ${loginResponse.body.token}`)
    .send(blog)
    .expect(400)
})

test('user must be logged in for blog creation', async () => {
  const blog = {
    title: 'IT-testi ilman autentikointia',
    author: 'Testaaja',
    url: 'www.google.fi'
  }
  await api.post('/api/blogs').send(blog).expect(401)
})

test('should remove a blog', async () => {
  const loginResponse = await login()
  await api.delete('/api/blogs/5a422aa71b54a676234d17f8')
    .set('Authorization', `Bearer ${loginResponse.body.token}`)
    .expect(204)
  const response = await api.get('/api/blogs')
  expect(response.body.length).toBe(5)
  const titles = response.body.map(res => res.title)
  expect(titles).not.toContain('Go To Statement Considered Harmful')
})

test('should return 404 when attempting to delete a blog that does not exist', async () => {
  const loginResponse = await login()
  await api.delete('/api/blogs/5a422aa71b54a676234d17f7')
    .expect(404)
    .set('Authorization', `Bearer ${loginResponse.body.token}`)
  const response = await api.get('/api/blogs')
  expect(response.body.length).toBe(6)
})

test('should update blog likes count', async () => {
  const blog = { likes: 9 }
  const response = await api.put('/api/blogs/5a422aa71b54a676234d17f8').send(blog)
  expect(response.body.likes).toBe(9)
})

test('should return 404 when attempting to update a blog that does not exist', async () => {
  const blog = { likes: 9 }
  await api.put('/api/blogs/5a422aa71b54a676234d17f7').send(blog).expect(404)
})

const login = () => {
  return api.post('/api/login').send({
    username: 'blogger',
    password: 'foobar'
  })
}

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.findOneAndDelete({ username: 'blogger' })

  const mockBlogs = mockData.blogs.map(blog => new Blog(blog))
  const promiseArray = mockBlogs.map(blog => blog.save())
  await Promise.all(promiseArray)

  const user = new User({
    username: 'blogger',
    passwordHash: '$2b$10$q/FLk8iUdwcU45xh.pSjcOtCgsEie8m9tT8ZVXpgeZOC3NUYIN8kG'
  })
  await user.save()
})

afterAll(() => mongoose.connection.close())