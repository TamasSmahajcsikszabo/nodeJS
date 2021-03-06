const User = require('../models/user')
// bcrypt = require("bcrypt"),
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')
const httpStatus = require('http-status-codes')
// token = process.env.TOKEN || "recipeT0k3n";
const jsonWebToken = require('jsonwebtoken')
const io = require('socket.io')
const socket = io()

const getUserParams = body => {
  return {
    username: body.username,
    name: {
      first: body.first,
      last: body.last
    },
    email: body.email,
    password: body.password,
    zipCode: body.zipCode
  }
}

module.exports = {
  // action 1 to run the query
  index: (req, res, next) => {
    User.find()
      .then(users => {
        res.locals.users = users
        next()
      })
      .catch(error => {
        console.log(`Error fetching users: ${error.message}`)
        next(error)
      })
  },

  // action 2 to serve the results to the view
  indexView: (req, res) => {
    // flash message passed directly as local variable
    if (req.query.format == 'json') {
      res.json(res.locals.users)
    } else {
      res.render('users/index', {
        flashMessages: {
          success: 'Loaded all users!'
        }
      })
    }
  },

  new: (req, res) => {
    res.render('users/new')
  },

  create: (req, res, next) => {
    if (req.skip) next() // if 'validate finds errors'
    const newUser = new User(getUserParams(req.body))

    User.register(newUser, req.body.password, (error, user) => {
      if (user) {
        if (!req.originalUrl.indexOf('api')) {
          req.flash('success', `${user.fullName}'s account created successfully!`)
          req.locals.redirect = '/users'
          next()
        } else {
          res.json({
            status: httpStatus.OK,
            message: `user with username "${user.username}" created`
          })
        }
      } else {
        if (!req.originalUrl.indexOf('api')) {
          req.flash('error', `Failed to create user because: ${error.message}`)
          res.locals.redirect = '/users/new'
          next()
        } else {
          res.json({
            status: httpStatus.BAD_REQUEST,
            message: `failed to create: ${error.message}`
          })
        }
      }
    })
  },

  redirectView: (req, res, next) => {
    const redirectPath = res.locals.redirect
    if (redirectPath) res.redirect(redirectPath)
    else next()
  },
  show: (req, res, next) => {
    const userId = req.params.id
    User.findById(userId)
      .then(user => {
        res.locals.user = user
        next()
      })
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`)
      })
  },

  showView: (req, res) => {
    if (req.query.format == 'json' || req.originalUrl.indexOf('api') != -1) {
      res.json(res.locals.user)
    } else {
      res.render('users/show')
    }
  },

  edit: (req, res, next) => {
    const userId = req.params.id
    User.findById(userId)
      .then(user => {
        res.render('users/edit', {
          user: user
        })
      })
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`)
      })
  },

  update: (req, res, next) => {
    const userId = req.params.id
    const userParams = getUserParams(req.body)
    User.findById({ _id: userId })
      .then(user => {
        if (user.password != userParams.password) {
          user.password = userParams.password
          res.locals.user = user
          res.locals.redirect = `/users/${userId}`
        }
        if (user.email != userParams.email) {
          user.email = userParams.email
          res.locals.user = user
          res.locals.redirect = `/users/${userId}`
        }
        user.save()
        if (req.originalUrl.indexOf('api')) {
          res.json({
            status: httpStatus.OK,
            message: `User ${res.locals.user.username} updated successfully`
          })
        }
      })
      .catch(error => {
        console.log(error.message)
      })

    User.findByIdAndUpdate(userId,
      { $set: userParams })
      .then(user => {
        res.locals.redirect = `/users/${userId}`
        res.locals.user = user
        console.log('Update successful!')
        req.flash('success', `${user.fullName} successfully updated!`)
        next()
      })
      .catch(error => {
        req.flash('error', `Error ${error.message} occured while updating user.`)
        console.log(`Error updating user by ID: ${error.message}`)
        next()
      })
  },
  delete: (req, res, next) => {
    const userId = req.params.id
    User.findByIdAndRemove(userId)
      .then(() => {
        req.flash('success', 'User deleted!')
        res.locals.redirect = '/users'
        next()
      })
      .catch(error => {
        req.flash('error', `Error ${error.message} occured while deleting user!`)
        res.locals.redirect = '/users'
        console.log('Error deleting user by ID: ${error.message}')
        next()
      })
  },
  login: (req, res) => {
    res.render('users/login')
  },
  logout: (req, res, next) => {
    req.logout()
    req.flash('success', 'You have been logged out!')
    res.locals.redirect = '/'
    next()
  },

  // search: (req, res, next)  => {
  //     var id;
  //     User.find({})
  //         .then( users  => {
  //             users.forEach( user  => {
  //                 user.compareEmail(req.body.email)
  //                     .then(matched  => {
  //                         console.log(matched)
  //                         if (matched) {
  //                             id = user._id
  //                             res.locals.user = user;
  //                         } else {
  //                             console.log('no match found')
  //                         }
  //                     })
  //             } )
  //             return id;
  //         } )
  //         .catch(error  => {
  //             console.log(error.message)
  //         })
  // },
  authenticate: passport.authenticate('local', {
    failureRedirect: '/users/login',
    failureFlash: 'Failed to login',
    successRedirect: '/', // directs to the main page
    successFlash: 'Logged in'
  }),
  validate: (req, res, next) => {
    req.sanitizeBody('email').normalizeEmail({
      all_lowercase: true
    }).trim()
    req.check('email', 'Email is invalid').isEmail()
    req.check('zipCode', 'Zip code is invalid')
      .notEmpty().isInt().isLength({
        min: 4,
        max: 6
      }).equals(req.body.zipCode)
    req.check('password', 'Password cannot be empty').notEmpty()

    // collecting the results of previous validation steps
    req.getValidationResult().then((error) => {
      if (!error.isEmpty()) {
        const messages = error.array().map(e => e.msg)
        req.skip = true
        req.flash('error', messages.join(' and '))
        res.locals.redirect = '/users/new'
        next()
      } else {
        next()
      }
    })
  },
  logMail: (req, res, next) => {
    User.findOne({
      username: req.body.username
    }).then(user => {
      const email = user.email.toString()
      const domain = email.substring(email.indexOf('@') + 1, email.indexOf('.'))
      console.log(`Recently logged user email domain: ${domain}`)
    })
    next()
  },
  respondJSON: (req, res) => {
    res.json({
      status: httpStatus.OK,
      data: res.locals // the response's locals object already has attached data by this point
    })
  },
  verifyToken: (req, res, next) => {
    const token = req.query.apiToken
    if (token) {
      User.findOne({ apiToken: token })
        .then(user => {
          if (user) next()
          else next(new Error('Invalid API Token!'))
        })
        .catch(error => {
          next(new Error(error.message))
        })
    } else {
      next(new Error('Invalid API token!'))
    }
  },

  // action to use JWT and login outside of a browser
  apiAuthenticate: (req, res, next) => {
    passport.authenticate('local', (errors, user) => {
      if (user) {
        const signedToken = jsonWebToken.sign( // creating a user token
          {
            data: user._id,
            exp: new Date().setDate(new Date().getDate() + 1)
          },
          'secret_encoding_passphrase'
        )
        res.json({
          success: true,
          token: signedToken
        })
      } else {
        res.json({
          success: false,
          message: 'Could not authenticate user.'
        })
      }
    })(req, res, next)
  },
  verifyJWT: (req, res, next) => {
    const excluded_routes = ['/login', '/token', '/courses', '/courses/:id/jon', '/users/new']
    if (!excluded_routes.includes(req.url)) {
      console.log('Verification initiated!')
      const token = req.headers.token
      if (token) {
        jsonWebToken.verify(
          token,
          'secret_encoding_passphrase',
          (errors, payload) => { // decoded payload
            if (payload) {
              User.findById(payload.data).then(user => {
                if (user) {
                  console.log(`${user.username} authenticated`)
                  next()
                } else {
                  res.status(httpStatus.FORBIDDEN).json({
                    error: true,
                    message: 'No user account found.'
                  })
                }
              })
            } else {
              res.status(httpStatus.UNAUTHORIZED).json({
                error: true,
                message: 'Cannot verify API token,'
              })
              next()
            }
          }
        )
      } else {
        res.status(httpStatus.UNAUTHORIZED).json({
          error: true,
          message: 'Provide Token'
        })
      }
    }
  },
  token: (req, res, next) => {
    res.render('users/token')
  },
  getApiToken: (req, res, next) => {
    passport.authenticate('local', (error, currentUser) => {
      if (currentUser) {
        console.log(`${currentUser.fullName} found in database and authenticated.`)
        const signedToken = jsonWebToken.sign( // creating a user token
          {
            data: currentUser._id,
            exp: new Date().setDate(new Date().getDate() + 1)
          },
          'secret_encoding_passphrase'
        )
        res.locals.apiToken = signedToken
        res.locals.user = currentUser
        res.locals.user.apiToken = res.locals.apiToken
        res.locals.user.save()
        if (req.originalUrl.indexOf('api')) {
          res.json({
            token: signedToken
          })
          next()
        } else {
          res.locals.redirect = '/'
          req.flash('success', 'API token generated!')
          next()
        }
      } else {
        console.log('User not authenticated, please log in.')
        req.flash('error', 'Please try again to authenticate!')
        res.locals.redirect = '/users/token'
        next()
      }
    })(req, res, next)
  },
  emitUserName: (req, res, next) => {
    const userName = req.body.username
    socket.emit('user connected', {
      user: userName
    })
    next()
  },
  getUserParams: (body) => {
    return {
      username: body.username,
      name: {
        first: body.first,
        last: body.last
      },
      email: body.email,
      password: body.password,
      zipCode: body.zipCode
    }
  }
}
