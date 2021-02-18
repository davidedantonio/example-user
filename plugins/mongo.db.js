'use strict'

const fp = require('fastify-plugin')
const MongoDB = require('fastify-mongodb')

async function MongoDBPlugin (fastify, opts) {
  const options = Object.assign({
    useNewUrlParser: true,
    useUnifiedTopology: true,
    url: process.env.MONGO_DB_URL || 'mongodb://localhost:27017/example-2',
    name: 'example'
  }, opts.mongodb)

  fastify.register(MongoDB, options)
}

module.exports = fp(MongoDBPlugin)
