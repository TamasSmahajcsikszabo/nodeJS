process.env.NODE_ENV = 'test'
const chai = require('chai')
const { expect } = chai
const chaiHTTP = require('chai-http')
const app = require('../main.js')

chai.use(chaiHTTP)

describe('/users GET', () => {
  it('it should GET all the users', (done) => {
    chai.request(app)
      .get('/users')
      .end((errors, res) => {
        expect(res).to.have.status(200)
        expect(errors).to.be.equal(null)
        done()
      })
  })
})
