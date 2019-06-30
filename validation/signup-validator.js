const Validator = require('validator');
const isEmpty = require('./is-empty');

function validateSignUpInput(data) {
  let errors = {};

  data.first = !isEmpty(data.first)? data.first : '';
  data.last = !isEmpty(data.last)? data.last : '';
  data.email = !isEmpty(data.email)? data.email : '';
  data.password = !isEmpty(data.password)? data.password : '';
  data.password2 = !isEmpty(data.password2)? data.password2 : '';

  if (!Validator.isLength(data.first, { min: 2, max: 30 }) || !Validator.isLength(data.last, { min: 2, max: 30 })) {
    errors.name = "Firstname and Lastname should be between 2 and 30 characters";
  }
  if (Validator.isEmpty(data.first) || Validator.isEmpty(data.last)) {
    errors.name = "Firstname and Lastname are required"
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = "Invalid Email address";
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email is required"
  }
  if (!Validator.isLength(data.password, { min: 8, max: 30 })) {
    errors.password = "Password length minimum is 8 characters";
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password is required";
  }
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Please confirm your password";
  }
  if (!Validator.isEmpty(data.password2) && !Validator.equals(data.password2, data.password)) {
    errors.password2 = "Passwords is not matched";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

module.exports = validateSignUpInput;