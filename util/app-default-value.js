const DEFAULT_VALUE = {
  ACCOUNT_TYPE: {
    STANDARD: 'standard',
  },
  TOKEN: {
    BEARER: "Bearer",
    EXPIRES_IN: "1d",
  },
  REQUEST: {
    GOOGLEMAPS: {
      PLACE: {
        FIELDS: ['formatted_address', 'geometry', 'name', 'type', 'url', 'price_level', 'rating', 'website', 'opening_hours', 'place_id', 'formatted_phone_number', 'address_component','photo'],
        ALL_FIELDS: ["address_component", "adr_address", "alt_id", "formatted_address", "geometry", "icon", "id", "name", "permanently_closed", "photo", "place_id", "scope", "type", "url", "utc_offset", "vicinity", "formatted_phone_number", "international_phone_number", "opening_hours", "website", "price_level", "rating", "review"]
      }
    }
  },
  VALUE: {
    DAYS_IN_MS: 86400000,
  },
  ERRORS: {
    EMAIL: {
      EXISTED: "Email already existed",
      NOT_FOUND: (email) => `${email} has never been registered`,
      INVALID: "Email is invalid"
    },
    LOGIN: {
      INVALID_CREDENTIAL: "Incorrect email or password",
      REQUIRED: (credential) => `${credential} is required`
    },
    PASSWORD: {
      INCORRECT: "Incorrect password",
    },
    PROFILE: {
      NOT_EXISTED: (id) => `Profile ID:${id} is not existed`,
      NOT_FOUND: "User profile is not found"
    }
  }
}

module.exports = DEFAULT_VALUE;