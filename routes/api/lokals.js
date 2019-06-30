const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const passport = require('passport');
const apiKey = require('../../config/keys');

/** @desc Mongoose Model */
const Profile = require('../../models/Profile');
const Business = require('../../models/Business');
const Category = require('../../models/Category');
const PhotoRef = require('../../models/GooglePhotoRef');

/** @desc Validation function */
const isEmpty = require('../../validation/is-empty');

/** @desc Utilities */ 
const APP = require('../../util/app-default-value');
const { capitalize, strToOfObj, getOpeningHours, byKeyword } = require('../../util/helpers');

const googleMapsClient = require('@google/maps').createClient({
  key: apiKey.googleMapAPI,
  Promise: Promise
});

router.get('/test', (req,res) => {
  console.log("Test");
  return res.json({test: 'lokals route'})
});

router.get('/business/list/:keyword/:type/:lat/:lng/:radius/:opennow', (req,res) => {
  const { keyword, type, lat, lng, radius, opennow } = req.params;
  const request = { 
    location: {lat: parseFloat(lat,10), lng: parseFloat(lng, 10)},
    radius: parseInt(radius, 10),
    keyword: keyword,
    opennow: opennow === 'true',
    type: type,
  };
  // console.log(request);
  googleMapsClient.placesNearby(request)
    .asPromise()
    .then(response => {
      // console.log(response.json.results[0].place_id);
      return res.json(response.json.results);
    }).catch(err => console.log(err));
});

router.get('/business/get-profile-by/:id', (req,res) => {
  const request = { 
    placeid: req.params.id,
    fields: APP.REQUEST.GOOGLEMAPS.PLACE.FIELDS
  };
  googleMapsClient.place(request)
    .asPromise()
    .then(response => {
      if(!response) {
        errors.thirdparty = "Third party request has failed";
        return res.json(errors);
      }
      const businessFields = {};
      const data = response.json.result;
      // console.log(data);
      businessFields.business_name = data.name;
      businessFields.business_type = data.types[0];
      businessFields.categories = data.types.map(type => ({keyword:type}));
      businessFields.formatted_address = data.formatted_address;
      businessFields.google_place_id = data.place_id;

      businessFields.contacts = {};
      businessFields.contacts.phone_number = data.formatted_phone_number;

      businessFields.google_rating = data.rating;

      businessFields.price = {};
      businessFields.price.level = data.price_level;

      businessFields.socials = {};
      businessFields.socials.website = data.website;

      businessFields.map_url = data.url;
      businessFields.location = data.geometry.location;
      businessFields.opening_hours = data.opening_hours.periods.map(place => `${place.open.day}:${place.open.time}:${place.close.time}`).join(',');
      const addressFields = data.formatted_address.split(',').map(field => field.trim());
      const stateAndZip = addressFields.splice(addressFields.length - 2,1)[0].split(' ');
      const keys = ['street','city','country','state','zipcode','neighborhood'];
      addressFields.push(stateAndZip[0],stateAndZip[1]);
      data.address_components.forEach(comp => {
        if (comp.types.includes('neighborhood')) {
          addressFields.push(comp.long_name);
        }
      })
      const addressObj = keys.reduce((obj, key, i) => Object.assign(obj, {[key]:addressFields[i]}), {})
      businessFields.address = addressObj;
      businessFields.photos = data.photos;
      
      return res.json(businessFields);
    })
    .catch(err => res.json(err));
});

/**
 * @route POST api/lokals/business/add
 * @desc Create place profile from google business profile without administration assigned
 * @access Private, only Lokals team
 * @TODO_NEXT Add validation input
 */

// passport.authenticate('jwt', { session: false })

router.post('/business/add',(req, res) => {
  const errors = {};
  console.log(req.body);
  // const { errors, inValid } = validateBusinessDetailInput(req.body);
  
  // if (inValid) {
  //   return res.status(400).json(errors);
  // }
  // console.log(req.body.google_place_id);
  if (req.body.password !== apiKey.adminKey) {
    console.log(req.body.password !== apiKey.adminKey);
    console.log('password required');
    return res.status(400).json({password: isEmpty(req.body.password)? 'Password Required':'Incorrect Password'});
  }
  const businessFields = {};
  
  if (req.body.businessdata.business_name) businessFields.business_name = req.body.businessdata.business_name.trim();
  businessFields.business_type = req.body.businessdata.business_type? req.body.businessdata.business_type : "restaurant";
  if (req.body.businessdata.categories) businessFields.categories = req.body.businessdata.categories;
  if (req.body.businessdata.formatted_address) businessFields.formatted_address = req.body.businessdata.formatted_address;
  if (req.body.businessdata.google_place_id) businessFields.google_place_id = req.body.businessdata.google_place_id;
  if (req.body.businessdata.contacts) businessFields.contacts = req.body.businessdata.contacts;
  if (req.body.businessdata.google_rating) businessFields.google_rating = req.body.businessdata.google_rating;
  if (req.body.businessdata.price) businessFields.price = req.body.businessdata.price;
  if (req.body.businessdata.socials) businessFields.socials = req.body.businessdata.socials;
  if (req.body.businessdata.map_url) businessFields.map_url = req.body.businessdata.map_url;
  if (req.body.businessdata.location) businessFields.location = req.body.businessdata.location;
  if (req.body.businessdata.opening_hours) businessFields.opening_hours = req.body.businessdata.opening_hours.split(',').map(el => getOpeningHours(el.trim()));
  if (req.body.businessdata.address) businessFields.address = req.body.businessdata.address;

  Business.findOne({ google_place_id: req.body.businessdata.google_place_id })
    .then(business => {
      if (business) {
        errors.business_name = req.body.businessdata.business_name;
        errors.message = `${req.body.businessdata.business_name}'s profile is already existed`;
        return res.status(400).json(errors);
      }
      new Business(businessFields)
        .save()
        .then(business => {
          // create photo refs
          const photoRefFields = {};
          const business_id = business._id;
          const { photos } = req.body; //array
          console.log(photos);
          photoRefFields.business = business_id; //string
          photoRefFields.photos = photos;
          
          PhotoRef.findOne({ business: business_id})
            .then(photoref => {
              if (photoref) {
                photoref.photos = photos;
                photoref.save()
                  .then(p => res.json(p))
                  .catch(e => res.json(e));
              }
              new PhotoRef(photoRefFields)
                .save()
                .then(newp => {
                  return res.json({ 
                    data: business,
                    photo_refs: newp,
                    status: 'OK'
                  })
                })
                .catch(saveErr => res.status(400).json(saveErr))
            })
            .catch(findErr => res.status(400).json(findErr))
        });
    })
    .catch(err => res.status(400).json(err));
});

router.post('/update/:business_id/photo-ref',(req,res) => {
  const errors = {};

  const photoRefFields = {};
  const { business_id } = req.params;
  const { photo_refs } = req.body; //array

  photoRefFields.business = business_id; //string
  photoRefFields.photos = photo_refs;
  
  
  PhotoRef.findOne({ business: businessID})
    .then(photoref => {
      if (photoref) {
        photoref.photos = photo_refs;
        photoref.save()
          .then(p => res.json(p))
          .catch(e => res.json(e))
      }
      new PhotoRef(photoRefFields)
        .save()
        .then(newp => res.json(newp))
        .catch(err => res.status(400).json(err))
    })
    .catch(err => res.status(400).json(err));
})

module.exports = router;