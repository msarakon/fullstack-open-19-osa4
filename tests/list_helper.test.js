const listHelper = require('../utils/list_helper')

test('dummy should return one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})