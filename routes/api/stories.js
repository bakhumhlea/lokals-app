const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const passport = require('passport');

/** @desc Mongoose Model */
const Profile = require('../../models/Profile');
const Event = require('../../models/Event');
const Business = require('../../models/Business');
const Story = require('../..//models/Story');

/** @desc Validation function */
const isEmpty = require('../../validation/is-empty');

/** @desc Utilities */ 
const APP = require('../../util/app-default-value');
const { strToOfObj } = require('../../util/helpers');

/**
 * @route POST api/stories/
 * @desc Publish story
 * @access Private, only Admin of Business
 */
router.post('/', passport.authenticate('jwt', { session: false }),(req, res) => {
  const errors = {};

  const days = req.body.expires_in?parseInt(req.body.expires_in, 10):1;
  const defaultExpDate = Date.now() + (APP.VALUE.DAYS_IN_MS * days);
  const businessID = req.body.business_id;
  const storyFields = {};
  if (req.body.caption) storyFields.caption = req.body.caption;
  if (req.body.content) storyFields.content = req.body.content;
  if (req.body.categories) storyFields.categories = strToOfObj(req.body.categories, ',', 'keyword');
  if (req.body.image_url) storyFields.images = {
    url: req.body.image_url,
    alt: req.body.image_alt?req.body.image_alt:`${req.body.caption.substr(0, 20)}`,
  };
  storyFields.expires_at = new Date(defaultExpDate);

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (!profile) {
        errors.notfound = "Profile not found";
        return res.status(400).json(errors);
      } else if ((profile.administration.business_id.toString() !== businessID) || !profile.administration.is_admin) {
        errors.administration = "You are not admin of this business";
        return res.status(400).json(errors);
      }
      Business.findById({ _id: businessID })
        .then(business => {
          if (!business) {
            errors.notfound = "Business not found";
            return res.status(400).json(errors);
          }
          var newStory = new Story(storyFields);
          newStory.business = business._id;
          newStory.published_by = profile.user;
          newStory.save().then(story => {
            if (!story) {
              errors.story = "Something wrong during process, try again";
              return res.status(400).json(errors);
            }
            var stories = business.stories;
            stories.push({ story: story._id });
            business.stories = stories;
            business.save().then(b => res.json({
              stories: b.stories,
              new_story: story
            }));
          });
        })
    })
    .catch(err => res.status(400).json(err));
});

/**
 * @route POST api/stories/id/:story_id
 * @desc Edit and Update published story
 * @access Private, only Admin of Business
 */
router.post('/id/:story_id', passport.authenticate('jwt', { session: false }), (req,res) => {
  const errors = {};

  const storyID = req.params.story_id;
  const storyUpdates = {};
  if (req.body.caption) storyUpdates.caption = req.body.caption;
  if (req.body.content) storyUpdates.content = req.body.content;
  if (req.body.categories) storyUpdates.categories = strToOfObj(req.body.categories, ',', 'keyword');
  if (req.body.image_url) storyUpdates.images = {
    url: req.body.image_url,
    alt: req.body.image_alt?req.body.image_alt:`${req.body.caption.substr(0, 20)}`,
  };

  Story.findByIdAndUpdate(
    { _id: storyID },
    { $set: storyUpdates },
    { new: true }
  )
  .then(story => {
    if (isEmpty(story)) {
      errors.story = `Story ID: ${storyID} is not found`;
      return res.status(400).json(errors);
    }
    if (req.body.expires_in) {
      const calExpired = (publishedAt) => Date.parse(publishedAt) + (APP.VALUE.DAYS_IN_MS * parseInt(req.body.expires_in, 10));
      story.expires_at = calExpired(story.published_at);
      return story.save().then(s => res.json(s))
    }
    return res.json(story);
  })
  .catch(err => res.status(400).json(err));
});

/**
 * @route DELETE api/stories/id/:story_id
 * @desc Delete story and remove from stories list
 * @access Private, only Admin of Business
 */
router.delete('/id/:story_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};

  const storyID = req.params.story_id;
  Story.findByIdAndDelete({ _id: storyID })
    .then(story => {
      if (!story) {
        errors.story = `Story ID: ${storyID} is not found`;
        return res.status(400).json(errors);
      }
      Business.findById({ _id: story.business})
        .then(business => {
          var stories = business.stories;
          var removeIndex = stories.map(el => el.story).indexOf(storyID);
          stories.splice(removeIndex, 1);
          business.stories = stories;
          business.save().then(b => res.json({
            removed_story_id: story._id,
            from_stories: b.stories
          }));
        })
    })
    .catch(err => res.status(400).json(err));
});

/**
 * @route POST api/stories/id/:story_id/likes
 * @desc Likes and Unlikes story
 * @access Public, Login User
 */

router.post('/id/:story_id/likes', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};

  const storyID = req.params.story_id;
  const uid = req.user.id;
  Story.findById({ _id: storyID })
    .then(story => {
      if (isEmpty(story)) {
        errors.story = `Story ID: ${storyID} is not found`;
        return res.status(400).json(errors);
      }
      var likes = story.likes;
      if (!likes.map(l => l.user.toString()).includes(uid)) {
        likes.unshift({ user: uid });
        story.likes = likes;
        story.save().then(s => res.json(s));
      } else {
        var removeIndex = likes.map(l => l.user.toString()).indexOf(uid);
        likes.splice(removeIndex, 1);
        story.likes = likes;
        story.save().then(s => res.json(s));
      }
    })
    .catch(err => res.status(400).json(err));
});

module.exports = router;