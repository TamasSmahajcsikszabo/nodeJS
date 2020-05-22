process.env.NODE_ENV = 'test'

const mongoose = require('mongoose')
const User = require('../models/user.js')
const Message = require('../models/message.js')
const chai = require('chai')
const { expect } = chai
const chaiHTTP = require('chai-http')
const app = require('../main.js')
const socketUrl = 'http://localhost:3001'
const io = require('socket.io-client')

require('../main.js')

chai.use(chaiHTTP)
// beforeEach(done => {
//   User.remove({})
//     .then(() => {
//       done()
//     })
// })
// beforeEach(done => {
//   Message.remove({})
//     .then(() => {
//       done()
//     })
// })

describe('SAVE testuser and post', () => {
  it('should save a test user who will send a message', () => {
    const testUser = new User({
      name: {
        first: 'John',
        last: 'Nada'
      },
      email: 'thedrifer@nada.com',
      password: 'nada',
      zipCode: 23234,
      username: 'Nada'
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
  it('the user shoud log in', (done) => {
    chai.request(app)
      .get('/users/login')
      .end((errors, res) => {
        expect(res).to.have.status(200)
        expect(errors).to.be.equal(null)
      })

    chai.request(app)
      .post('/users/login')
      .send({
        username: 'Nada',
        password: 'nada'
      })
      .end((errors, res) => {
        expect(res).to.have.status(200)
        expect(errors).to.be.equal(null)
        done()
      })
  })
  it('the user should be able to post a message', (done) => {
    // var userId
    // User.find({})
    //   .then(user => {
    //     userId = user._id
    //     console.log(`user id is ${userId}`)
    //   })
    const testMessage = {
      content: 'test message',
      userName: 'Nada'
    }
    console.log(testMessage)
    client = io.connect(socketUrl)
    client.emit('message', testMessage)
    Message.find({})
      .then(result => {
        expect(result[0]).to.deep.include({ content: 'test message' })
        // expect(result[0]).to.have.property('_id')
        done()
      })
    done()
  })
})
