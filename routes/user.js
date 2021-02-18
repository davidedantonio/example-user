'use strict'

module.exports = async function (fastify, opts) {
  const users = fastify.mongo.example.db.collection('users')
  const { ObjectId } = fastify.mongo

  users.createIndex({
    username: 1
  }, { unique: true })

  fastify.post('/', async function (request, reply) {
    const { body } = request
    
    try {
      Object.assign(body, {
        creationDate: new Date()
      })

      await users.insertOne(body)
    } catch (e) {
      if (e.code === 11000) {
        return reply.code(400).send({ message: `Username ${body.username} already exist!` })  
      }
      return reply.code(500).send({ message: e.message })
    }
    return body
  })

  fastify.get('/:id', async function (request, reply) {
    const { id } = request.params

    try {
      const result = await users.findOne({ _id: new ObjectId(id) })
      
      if (!result) {
        return reply.code(404).send({ message: 'User not found' })
      }

      return result
    } catch (e) {
      return reply.code(500).send({ message: e.message })
    }
  })

  fastify.get('/all', async function (request, reply) {
    try {
      const result = await users
        .find({})
        .sort({ creationDate: -1 })
        .toArray()

      return result
    } catch (e) {
      return reply.code(500).send({ message: e.message })
    }
  })

  fastify.delete('/:id', async function (request, reply) {
    const { id } = request.params
    try {
      const result = await users.deleteOne({ _id: new ObjectId(id) })
      
      if (!result) {
        return reply.code(404).send({ message: 'User not found' })
      }

      return reply.code(204).send()
    } catch (e) {
      return reply.code(500).send({ message: e.message })
    }
  })
}

module.exports.autoPrefix = '/user'
