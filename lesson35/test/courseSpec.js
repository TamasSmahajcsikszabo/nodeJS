process.env.NODE_ENV = 'test'

const mongoose = require('mongoose')
const Course = require('../models/course.js')
const chai = require('chai')
const { expect } = chai
const chaiHTTP = require('chai-http')
const app = require('../main.js')

require('../main.js')

chai.use(chaiHTTP)
describe('/courses GET', () => {
  it('should GET all courses', (done) => {
    chai.request(app)
      .get('/courses')
      .end((errors, res) => {
        expect(res).to.have.status(200)
        expect(errors).to.be.equal(null)
        done()
      })
  })
})
beforeEach(done => {
  Course.remove({})
    .then(() => {
      done()
    })
})

describe('SAVE course', () => {
  it('should create a course successfully', () => {
    const courseData = new Course({
      title: 'Write nice tests',
      description: 'Test your skills at writing tests',
      item: ['keyboard'],
      zipCode: 12334
    })
    courseData.save()
      .then(() => {
        Course.find({})
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
