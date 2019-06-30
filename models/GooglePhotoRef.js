const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PhotoRefSchema = new Schema({
  business: {
    type: Schema.Types.ObjectId,
    ref: 'businesses'
  },
  photos: [
    {
      photo_reference: {
        type: String,
        required: true
      },
      height: {
        type: Number
      },
      width: {
        type: Number
      }
    }
  ]
});

module.exports = PhotoRef = mongoose.model('photo_refs', PhotoRefSchema);