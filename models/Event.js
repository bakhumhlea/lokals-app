const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  business: {
    type: Schema.Types.ObjectId,
    ref: 'businesses'
  },
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
  },
  description: {
    type: String,
    required: true
  },
  event_date: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },
  ticket: {
    needs: {
      type: Boolean,
      default: false
    },
    price: {
      type: Number,
      default: null
    },
    limit: {
      type: Number,
      default: null
    }
  },
  capacity: {
    type: Number,
    default: null
  },
  categories: [
    {
      keyword: {
        type: String,
        required: true
      }
    }
  ],
  images: [
    {
      url: {
        type: String
      },
      alt: {
        type: String
      },
      caption: {
        type: String
      }
    }
  ],
  interested_by: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      }
    }
  ],
  expires_at: {
    type: Date,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});
// EventSchema.indexes({ "expires_at": 1 },{ expireAfterSeconds: 0 })

module.exports = Event = mongoose.model('events', EventSchema);