// Spec is used to indicate test suite
const chai = require('chai')
const { expect } = chai
const userController = require('../controllers/usersController')

// two 'describe' blocks for testing
// the first defines the module being tested
// the second defines the function being tested

describe('userController', () => {
  describe('getUserParams', () => {
    it('should convert request body to contain the name attributes of the user object', () => {
      var body = {
        first: 'John',
        last: 'Nada',
        email: 'nada@drifter.com',
        password: 'nada',
        zipCode: 12345
      }
      expect(userController.getUserParams(body))
        .to.deep.include({
          name: {
            first: 'John',
            last: 'Nada'
          }
        })
    })
    it('should return an empty object with empty request body input', () => {
      var emptyBody = {}
      expect(userController.getUserParams(emptyBody))
        .to.deep.include({})
    })
  })
})
