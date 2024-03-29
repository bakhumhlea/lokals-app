const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BusinessSchema = new Schema({
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  business_name: {
    type: String,
    required: true
  },
  business_type: {
    type: String,
    required: true,
  },
  contacts: {
    number: {
      type: Number
    },
    email: {
      type: String
    }
  },
  price: {
    level: {
      type: Number
    },
    range: {
      type: String
    }
  },
  cuisines: [
    {
      tag: {
        type: String
      }
    }
  ],
  dining_style: {
    type: String
  },
  about: {
    type: String
  },
  photos: [
    {
      url: {
        type: String,
      },
      uploaded: {
        type: Date,
        default: Date.now
      }
    }
  ],
  cover_photo: {
    photo_reference: {
      type: String
    },
    height: {
      type: Number
    },
    width: {
      type: Number
    },
    third_party: {
      type: Boolean,
      default: false
    }
  },
  formatted_address: {
    type: String,
    required: true
  },
  address: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    zipcode: {
      type: String,
      required: true
    },
    neighborhood: {
      type: String
    },
  },
  location: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  map_url: {
    type: String
  },
  opening_hours: [
    {
      close: {
        day: {
          type: Number
        },
        time: {
          type: String
        }
      },
      open: {
        day: {
          type: Number
        },
        time: {
          type: String
        }
      }
    }
  ],
  categories: [
    {
      keyword: {
        type: String,
      }
    }
  ],
  socials: {
    website: {
      type: String
    },
    facebook: {
      type: String
    },
    twitter: {
      type: String
    },
    instagram: {
      type: String
    }
  },
  payment_options: [
    {
      payment_type: {
        type: String
      }
    }
  ],
  reservation: {
    available: {
      type: Boolean,
      default: true
    },
    note: {
      type: String
    }
  },
  additional_info: [
    {
      title: {
        type: String
      },
      detail: {
        type: String
      }
    }
  ],
  recommended: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      }
    }
  ],
  talk_about: [
    {
      keyword: {
        type: String,
      }
    }
  ],
  events: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: 'events'
      }
    }
  ],
  stories: [
    {
      story: {
        type: Schema.Types.ObjectId,
        ref: 'stories'
      }
    }
  ],
  feature_in: [
    {
      list: {
        type: Schema.Types.ObjectId,
        ref: 'lists'
      }
    }
  ],
  messages: [
    {
      conversation: {
        type: Schema.Types.ObjectId,
        ref: 'conversations'
      }
    }
  ],
  approved: {
    status: {
      type: Boolean,
      default: false
    }
  },
  google_rating: {
    type: Number
  },
  google_place_id: {
    type: String,
  },
  create_at: {
    type: Date,
    default: Date.now
  }
});

BusinessSchema.index({
  'categories.keyword': 'text',
  'business_name': 'text',
  'business_type': 'text',
})

module.exports = Business = mongoose.model('businesses', BusinessSchema);