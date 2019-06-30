const mongoose = require('mongoose');
const APP = require('../util/app-default-value');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  imageUrl: {
    type: String,
  },
  account_type: {
    type: String,
    default: APP.ACCOUNT_TYPE.STANDARD,
  },
  preferences: [
    {
      keyword: {
        type: String,
        lowercase: true
      }
    }
  ],
  collections: [
    {
      business: {
        type: Schema.Types.ObjectId,
        ref: 'businesses'
      },
      collected_at: {
        type: Date,
        default: Date.now
      }
    }
  ],
  saved_events: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: 'events'
      },
      saved_at: {
        type: Date,
        default: Date.now
      }
    }
  ],
  friends: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      }
    }
  ],
  administration: {
    is_admin: {
      type: Boolean,
      default: false,
    },
    business_id: {
      type: Schema.Types.ObjectId,
      ref: 'businesses'
    },
    upgraded: {
      type: Boolean,
      default: false,
    },
    created_at: {
      type: Date,
      default: null
    }
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
