const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    first: {
      type: String,
      required: true,
      trim: true
    },
    last: {
      type: String,
      required: true,
      trim: true
    },
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  },
  emailAuth: {
    in_used: {
      type: Boolean,
      default: false
    },
    password_required: {
      type: Boolean,
      default: true
    },
    password: {
      type: String,
      minlength: 8
    },
    email_verified: {
      type: Boolean,
      default: false
    }
  },
  googleAuth: {
    in_used: {
      type: Boolean,
      default: false
    },
    id: {
      type: String
    },
  },
  facebookAuth: {
    in_used: {
      type: Boolean,
      default: false
    },
    id: {
      type: String
    },
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model('users', UserSchema);
