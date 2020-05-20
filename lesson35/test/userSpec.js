process.env.NODE_ENV = 'test'

const mongoose = require('mongoose')
const { expect } = require('chai')
const User = require('../models/user.js')

require('../main.js')

beforeEach(done => {
  User.remove({})
    .then(() => {
      done()
    })
})

describe('SAVE user', () => {
  it('should save a user', () => {
    const testUser = new User({
      name: {
        first: 'John',
        last: 'Nada'
      },
      email: 'nada@drifter.com',
      password: 'theylive',
      zipCode: 1234
    })
    testUser.save()
      .then(() => {
        User.find({})
          .then(result => {
            expect(result.length)
              .to.eq(1)
            expect(result[0])
              .to.have.property('_id')
            done()
          })
      })
  })
})
