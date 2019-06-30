const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StorySchema = new Schema({
  business: {
    type: Schema.Types.ObjectId,
    ref: 'businesses'
  },
  caption: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  content: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 120
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
      }
    }
  ],
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      }
    }
  ],
  published_by: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  published_at: {
    type: Date,
    default: Date.now,
  },
  expires_at: {
    type: Date,
    required: true,
    index: { expires: 60, background: true }
  }
});
// StorySchema.indexes({ "expires_at": 1 },{ expireAfterSeconds: 0 });

module.exports = Story = mongoose.model('stories', StorySchema);