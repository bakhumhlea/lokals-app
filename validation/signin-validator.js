const Validator = require('validator');
const isEmpty = require('./is-empty');
const APP = require('../util/app-default-value');

function validateSignInInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email)? data.email : '';
  data.password = !isEmpty(data.password)? data.password : '';

  if (!Validator.isEmail(data.email)) {
    errors.email = APP.ERRORS.EMAIL.INVALID;
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = APP.ERRORS.LOGIN.REQUIRED("Email");
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = APP.ERRORS.LOGIN.REQUIRED("Password");
  }
  return {
    errors,
    isValid: isEmpty(errors)
  }
}

module.exports = validateSignInInput;