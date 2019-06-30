const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const isEmpty = require('../../validation/is-empty');
const { byKeyword } = require('../../util/helpers');

const Category = require('../../models/Category');

// @route GET api/admin/categories/all
// @desc Get all categories
// @access Admin
router.get('/all', (req, res) => {
  const errors = {};

  Category.find()
    .then(categories => {
      if(!categories) {
        errors.category = "No category";
        return res.status(400).json(errors);
      }
      res.json(categories);
    })
    .catch(err => {
      res.status(400).json(err);
    })
});

// @route GET api/admin/categories/:keyword
// @desc Get category by keyword
// @access Admin/Public
router.get('/:keyword', (req, res) => {
  const errors = {};
  const inputKeyword = req.params.keyword.split('-').join(' ').toLowerCase();

  Category.findOne({ keyword: inputKeyword })
    .then(category => {
      if (!category) {
        errors.category = `No ${inputKeyword} category found`;
        return res.json(errors)
      }
      res.json(category);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

// @route POST api/admin/categories/:keyword
// @desc Get category or Create one if not found
// @access Private
router.post('/:keyword', (req, res) => {
  const errors = {};
  const inputKeyword = req.params.keyword.split('-').join(' ').toLowerCase();

  Category.findOne({ keyword: inputKeyword })
    .then(category => {
      if (category) {
        return res.json(category);
      }
      const newCategory = new Category({
        keyword: inputKeyword
      });
      newCategory.save()
        .then(newCat => {
          res.json(newCat);
        })
        .catch(err => {
          res.status(400).json(err);
        });
    })
    .catch(err => res.status(400).json(err));
});



router.get('/keyword/:keyword', (req, res) => {
  const errors = {};
  const keyword = req.params.keyword.split('-').join(' ').toLowerCase();
  const keywordLength = keyword.length;

  Category.find()
    .then(categories => {
      if (keywordLength > 1) {
        var results = [];
        for (var n = keywordLength; n > 1; n--) {
          var mappedCategories = categories.map(category => category.keyword.substring(0, n));
          if (mappedCategories.includes(keyword.substring(0, n))) {
            mappedCategories.forEach((el, index) => {
              if (el === keyword.substring(0, n)){
                results.push(categories[index]);
              }
            });
            break
          }
        }
        results.sort(byKeyword);
        return res.json(results);
      }
      errors.nomatch = `No result for '${keyword}'`;
      res.status(400).json(errors)
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

// @route POST api/admin/categories/add
// @desc Add new categories
// @access Admin
router.post('/add', (req, res) => {
  const errors = {};
  const keyword = req.body.keyword.trim().toLowerCase();
  const newInputCategory = { keyword: keyword };

  Category.findOne({ keyword: keyword })
    .then(category => {
      if (category) {
        errors.category = `${keyword} category is already existed`;
        return res.json(errors);
      }
      const newCategory = new Category(newInputCategory);
      newCategory.save()
        .then(category => res.json(category))
        .catch(err => res.status(400).json(err));
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

// @route DELETE api/admin/categories/:category_id
// @desc Delete category
// @access Admin
router.delete('/:category_id', (req, res) => {
  const errors = {};
  
  Category.findByIdAndRemove({ _id: req.params.category_id })
    .then(category => {
      if (isEmpty(category)) {
        errors.not_found = `${req.params.category_id} is not found`;
        return res.json(errors);
      }
      res.json(category);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

module.exports = router;