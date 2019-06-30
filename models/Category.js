const mongoose = require('mongoose');
const APP = require('../util/app-default-value');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  keyword: {
    type: String,
    required: true,
    lowercase: true
  }
});

module.exports = Category = mongoose.model('categories', CategorySchema);