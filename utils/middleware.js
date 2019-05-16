const logger = require('./logger')

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).send({ error: 'malformed id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).send({ error: 'unauthorized' })
  }
  next(error)
}

module.exports = { errorHandler }