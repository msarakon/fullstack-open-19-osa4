const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name : 1 })
  response.json(blogs)
})

blogRouter.post('/', async (request, response, next) => {
  const user = await User.findById(request.body.userId)
  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    user: user ? user._id : undefined
  })
  try {
    const result = await blog.save()
    if (user) {
      user.blogs = user.blogs.concat(result._id)
      await user.save()
    }
    response.status(201).json(result)
  } catch (error) {
    next(error)
  }
})

blogRouter.put('/:id', async (request, response, next) => {
  try {
    const result = await Blog.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true })
    if (result) response.status(200).json(result)
    else response.status(404).end()
  } catch (error) {
    next(error)
  }
})

blogRouter.delete('/:id', async (request, response, next) => {
  try {
    const result = await Blog.findByIdAndRemove(request.params.id)
    if (result) response.status(204).end()
    else response.status(404).end()
  } catch (error) {
    next(error)
  }
})

module.exports = blogRouter