const dummy = () => 1

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((fav, blog) => fav.likes > blog.likes ? fav : blog, {})
}

const mostBlogs = (blogs) => {
  const blogsByAuthor = blogs.reduce((coll, blog) => {
    coll[blog.author] = coll[blog.author] || 0
    coll[blog.author]++
    return coll
  }, {})
  const author = Object.keys(blogsByAuthor).reduce((author1, author2) =>
    blogsByAuthor[author1] > blogsByAuthor[author2] ? author1 : author2
  )
  return {
    author: author,
    blogs: blogsByAuthor[author]
  }
}

const mostLikes = (blogs) => {
  const likesByAuthor = blogs.reduce((coll, blog) => {
    coll[blog.author] = coll[blog.author] || 0
    coll[blog.author] += blog.likes
    return coll
  }, {})
  const author = Object.keys(likesByAuthor).reduce((author1, author2) =>
    likesByAuthor[author1] > likesByAuthor[author2] ? author1 : author2
  )
  return {
    author: author,
    likes: likesByAuthor[author]
  }
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }