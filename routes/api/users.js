const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const verifyClientId = require('../../util/verifyClientId')
 
// Model
const User = require('../../models/User');
const Profile = require('../../models/Profile');
// Validators
const validateSignUpInput = require('../../validation/signup-validator');
const validateSignInInput = require('../../validation/signin-validator');

// Utilities
const APP = require('../../util/app-default-value');

router.post('/auth/google/:token_id', (req,res) => {
  const errors = {};

  verifyClientId(req.params.token_id)
    .then(payload => {
      if (payload.errors) {
        return res.status(400).json(payload);
      }
      User.findOne({ email: payload.email })
        .then(user => {
          if (!user) {
            var newUser = new User({
              name: {
                first: payload.given_name,
                last: payload.family_name,
              },
              email: payload.email,
              emailAuth: {
                password_required: false
              },
              googleAuth:{
                in_used: true,
                id: payload.sub
              }
            });
            newUser.save()
              .then(newuser => {
                new Profile({
                  user: newuser._id,
                  imageUrl: payload.picture
                }).save()
                .then(profile => {
                  const payload = {
                    id: newuser._id,
                    name: newuser.name,
                    email: newuser.email,
                    imageUrl: profile.imageUrl
                  };
                  jwt.sign(payload, keys.secretOrKey, { expiresIn: APP.TOKEN.EXPIRES_IN }, (err, token) => {
                    return res.json({
                      profile: profile,
                      token: `${APP.TOKEN.BEARER} ${token}`
                    });
                  });
                })
              })
              .catch(err => res.status(400).json(err));
          }
          if (user && user.googleAuth.in_used && (payload.sub.toString() === user.googleAuth.id)) {
            Profile.findOne({ user: user._id })
              .then(profile => {
                const payload = {
                  id: user._id,
                  name: user.name,
                  email: user.email,
                  imageUrl: profile.imageUrl
                }
                jwt.sign(payload, keys.secretOrKey, { expiresIn: APP.TOKEN.EXPIRES_IN }, (err, token) => {
                  return res.json({
                    profile: profile,
                    token: `${APP.TOKEN.BEARER} ${token}`
                  });
                });
              })
              .catch(err => res.status(400).json(err));
          } else {
            errors.userexisted = `${payload.email} has been registered in our database. Try login with your Email and Password.`
            return res.status(400).json(errors);
          }
        })
    })
    .catch(err => res.json(err));
})

router.post('/auth/facebook', (req, res) => {
  const errors = {};
  
  const imageUrl = req.body.imageUrl;
  const userData = {
    name: req.body.name,
    email: req.body.email,
    emailAuth: {
      password_required: false
    },
    facebookAuth: {
      in_used: true,
      id: req.body.facebookAuth.id
    }
  }
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        const newUser = new User(userData);
        newUser.save()
          .then(newuser => {
            new Profile({
              user: newuser._id,
              imageUrl: imageUrl
            }).save()
            .then(profile => {
              const payload = {
                id: newuser._id,
                name: newuser.name,
                email: newuser.email,
                imageUrl: profile.imageUrl
              };
              jwt.sign(payload, keys.secretOrKey, { expiresIn: APP.TOKEN.EXPIRES_IN }, (err, token) => {
                return res.json({
                  profile: profile,
                  token: `${APP.TOKEN.BEARER} ${token}`
                });
              });
            })
          })
      }
      if (user && user.facebookAuth.in_used && (userData.facebookAuth.id === user.facebookAuth.id)) {
        Profile.findOne({ user: user._id })
          .then(profile => {
            const payload = {
              id: user._id,
              name: user.name,
              email: user.email,
              imageUrl: profile.imageUrl
            }
            jwt.sign(payload, keys.secretOrKey, { expiresIn: APP.TOKEN.EXPIRES_IN }, (err, token) => {
              return res.json({
                profile: profile,
                token: `${APP.TOKEN.BEARER} ${token}`
              });
            });
          })
          .catch(err => res.status(400).json(err));
      } else {
        errors.userexisted = `${payload.email} has been registered in our database. Try login with your Email and Password.`
        return res.status(400).json(errors);
      }
    })
});

router.post('/login/facebook', (req, res) => {
  const { email } = req.body;
  const { id } = req.body.facebookAuth;
  User.findOne({ email: email })
    .then(user => {
      if (user && user.facebookAuth.in_used && (id === user.facebookAuth.id)) {
        Profile.findOne({ user: user._id })
          .then(profile => {
            const payload = {
              id: user._id,
              name: user.name,
              email: user.email,
              imageUrl: profile.imageUrl
            }
            jwt.sign(payload, keys.secretOrKey, { expiresIn: APP.TOKEN.EXPIRES_IN }, (err, token) => {
              return res.json({
                profile: profile,
                token: `${APP.TOKEN.BEARER} ${token}`
              });
            });
          })
          .catch(err => res.status(400).json(err));
      } else {
        errors.notfound = `${payload.email} has not found`
        return res.status(400).json(errors);
      }
    })
});

// @rotue POST api/users/signup
// @desc Sign Up User
// @access Public
router.post('/signup', (req, res) => {
  const { errors, isValid } = validateSignUpInput(req.body);
  const userData = {
    name: {
      first: req.body.first,
      last: req.body.last
    },
    email: req.body.email,
    emailAuth: {
      in_used: true,
      password: req.body.password
    }
  };

  if (!isValid) {
    return res.status(400).json(errors);
  }
  // console.log(req.body);
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        errors.email = APP.ERRORS.EMAIL.EXISTED;
        return res.status(400).json(errors);
      } else {
        var newUser = new User(userData);
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.emailAuth.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.emailAuth.password = hash;
            newUser.save()
              .then(user => {
                const newProfile = new Profile({ user: user._id, imageUrl: '' });
                newProfile
                  .save()
                  .then(profile => res.json({
                    user: user,
                    profile: profile
                  }));
              })
              .catch(err => console.log("Error: " + err));
          });
        });
      }
    })
    .catch(err => res.status(400).json(err));
});

// @rotue POST api/users/signin
// @desc Sign Up User
// @access Public
router.post('/signin', (req, res) => {
  const { errors, isValid } = validateSignInInput(req.body);
  console.log(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const { email, password } = req.body;

  User.findOne({email: email})
    .then(user => {
      if (!user) {
        errors.login = APP.ERRORS.LOGIN.INVALID_CREDENTIAL;
        return res.status(400).json(errors);
      }
      bcrypt.compare(password, user.emailAuth.password)
        .then(isMatch => {
          if (isMatch) {
            const payload = {
              id: user._id,
              name: user.name,
              email: user.email
            };
            Profile.findOne({ user: user._id })
              .then(profile => {
                const payload = {
                  id: user._id,
                  name: user.name,
                  email: user.email,
                  imageUrl: profile.imageUrl
                }
                jwt.sign(payload, keys.secretOrKey, { expiresIn: APP.TOKEN.EXPIRES_IN }, (err, token) => {
                  if (!err) {
                    return res.json({
                      profile: profile,
                      token: `${APP.TOKEN.BEARER} ${token}`
                    });
                  }
                  return res.status(400).json(err);
                });
              })
          } else {
            errors.password = APP.ERRORS.PASSWORD.INCORRECT;
            return res.status(400).json(errors);
          }
        })
        .catch(err=>console.log(err));
    });
});

// @rotue GET api/users/current
// @desc Get Current User
// @access Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
});

module.exports = router;