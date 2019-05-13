const logger = require('./logger')

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).send({ error: 'malformed id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message })
  }
  next(error)
}

module.exports = { errorHandler }