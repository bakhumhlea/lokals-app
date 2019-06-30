const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const APP = require('../../util/app-default-value');
const passport = require('passport');

const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Category = require('../../models/Category');

const isEmpty = require('../../validation/is-empty');
const { capitalize, strToOfObj, getOpeningHours, byKeyword } = require('../../util/helpers');

// @route POST api/profile
// @desc Create and Edit Profile
// @access Private

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  // const { errors, isValid } = validateProfileInput(req.body);

  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }

  const profileFields = {};
  
});
// @route GET api/profile/is-admin
// @desc Get Profile administration status
// @access Private
router.get('/uid/:id/is-admin', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.id })
    .then(profile => {
      if (!profile) {
        errors.noprofile = APP.ERRORS.PROFILE.NOT_FOUND;
        return res.status(400).json(errors);
      }
      return res.json(profile.administration.is_admin);
    });
});
// @route GET api/profile/
// @desc Get Profile by UserID
// @access Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  // const id = req.params.profile_id;
  Profile.findOne({ user: req.user.id })
    .populate('user', ['name','email'])
    .populate('preferences.category', ['keyword'])
    .populate('saved_events.event', ['title','description','event_date'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = APP.ERRORS.PROFILE.NOT_FOUND;
        return res.status(400).json(errors);
      }
      res.json(profile);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

// @route GET api/profile/id/:profile_id
// @desc Get Profile by Profile ID
// @access Public
router.get('/id/:profile_id', (req, res) => {
  const errors = {};
  const id = req.params.profile_id;

  Profile.findById({ _id: id })
    .populate('user', [ 'name' ])
    .then(profile => {
      res.json(profile);
    })
    .catch(err => {
      errors.profile = APP.ERRORS.PROFILE.NOT_EXISTED(id);
      res.status(400).json(errors)
    });
});

// @route GET api/profile/preferences/categories
// @desc Get user preferences categories
// @access Private

router.get('/preferences/keywords', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      const currentUserPreferences = profile.preferences.map(category => category.keyword);
      res.json(currentUserPreferences);
    })
    .catch(err => {
      res.status(400).json(err);
    })
});

// @route POST api/profile/preferences/
// @desc Add preference by category id (Get category IDs from categories search API)
// @access Private
router.post('/preferences', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  
  const preferences = strToOfObj(req.body.keywords, ',', 'keyword');
  Profile.findOneAndUpdate(
    { user: req.user.id },
    { $set: { preferences: preferences } },
    { new: true }
  )
  .then(profile => res.json(profile))
  .catch(err => res.status(400).json(err));

});

/**
 * @route POST api/profile/collections
 * @desc Save or unsave business in user's collection
 * @access Private, Logged in user only
 * @TODO_NEXT Add validation input
 */
router.post('/collections', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  const businessID = req.body.business_id;
  
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Business.findById({ _id: businessID })
        .then(business => {
          if (!business) {
            errors.notfound = "Business not found";
            return res.status(400).json(errors);
          }
          const userCollections = profile.collections;

          if (userCollections.map(collection => collection.business.toString()).includes(businessID)) {
            const removeIndex = userCollections.map(collection => collection.business.toString()).indexOf(businessID);
            userCollections.splice(removeIndex, 1);
            profile.collections = userCollections;
            // Profile.findOneAndUpdate(
            //   { _id: req.user.id },
            //   { $set: { collections: userCollections }},
            //   { new: true })
            //   .then(p => res.json(p))
            //   .catch(err => res.status(400).json(err));
          } else {
            userCollections.unshift({ business: businessID });
            profile.collections = userCollections;
            // Profile.findOneAndUpdate(
            //   { _id: req.user.id },
            //   { $set: { collections: userCollections }},
            //   { new: true })
            //   .then(p => res.json(p))
            //   .catch(err => res.status(400).json(err));
          }
          profile.save().then(p => res.json(p));
        })
        .catch(err => res.status(400).json(err));
    })
  
});

/**
 * @mark UNUSED
 * @route GET api/profile/preferences/
 * @desc Get user preferences categories
 * @access Private
*/
// router.get('/preferences', passport.authenticate('jwt', { session: false }), (req, res) => {
//   const errors = {};

//   Profile.findOne({ user: req.user.id })
//     .populate('preferences.category', ['keyword'])
//     .then(profile => {
//       if (!profile) {
//         errors.profile = "Oops! Something wrong while fetching your profile";
//         return res.json(errors);
//       }
//       res.json(profile.preferences);
//     })
//     .catch(err => res.status(400).json(err));
// });

// @route DELETE api/profile/uid/:user_id
// @desc Delete user and its profile by user id
// @access Private
router.delete('/uid/:user_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};

  Profile.findOneAndDelete({ user: req.user.id })
    .then(profile => {
      User.findOneAndDelete({ _id: profile.user })
        .then(user => {
          const success = {
            status: "SUCCESS",
            user_email: user.email,
            user_id: user._id,
            profile_id: profile._id,
            status: "This account has been deleted successfully"
          };
          return res.json(success);
        })
    })
    .catch(err => res.status(400).json(err));
});

module.exports = router;