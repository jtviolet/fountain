var mongoose = require('mongoose'),
  bcrypt = require('bcrypt'),
  validator = require('validator'),
  jwt = require('jsonwebtoken');

var profile = {

  // Basic info
  name: {
    type: String,
    min: 1,
    max: 100,
  },

  // location: {
  //   type: String,
  //   enum: {
  //     values: [
  //       "Remote",
  //       "Alexandria",
  //       "Amsterdam",
  //       "Bangalore",
  //       "Bangkok",
  //       "Boston",
  //       "Bucharest",
  //       "Cebu City",
  //       "Charlotte",
  //       "Charlottesville",
  //       "Chicago",
  //       "Cork",
  //       "Dallas",
  //       "Denver",
  //       "Doha",
  //       "Draper",
  //       "Dubai",
  //       "Dublin",
  //       "El Segundo",
  //       "Herndon",
  //       "Hong Kong",
  //       "Istanbul",
  //       "Kiev",
  //       "Kildare",
  //       "London",
  //       "McLean",
  //       "Milan",
  //       "Milpitas",
  //       "Mumbai",
  //       "Munich",
  //       "Nagoya",
  //       "New Delhi",
  //       "NYC",
  //       "Osaka",
  //       "Paris",
  //       "Portland",
  //       "Pune",
  //       "Reston",
  //       "Riyadh",
  //       "San Diego",
  //       "San Francisco",
  //       "Selangor",
  //       "Seoul",
  //       "Shanghai",
  //       "Singapore",
  //       "State College",
  //       "Stockholm",
  //       "Sydney",
  //       "Taipei City",
  //       "Tokyo",
  //       "Toronto",
  //       "Warsaw",
  //       "Westborough"
  //     ]
  //   }
  // },

  // shirtSize: {
  //   type: String,
  //   enum: {
  //     values: 'XS S M L XL XXL WXS WS WM WL WXL WXXL'.split(' ')
  //   }
  // },

  previouslyAttended: {
    type: Boolean,
    default: false
  },

  // wantsFireeyeHardware: {
  //   type: Boolean,
  //   default: false
  // },

  // fireeyeHardware: {
  //   type: String
  // },

  // wantsFireeyeSoftware: {
  //   type: Boolean,
  //   default: false
  // },

  // fireeyeSoftware: {
  //   type: String
  // },

  // wantsThirdpartyHardware: {
  //   type: Boolean,
  //   default: false
  // },

  // thirdpartyHardware: {
  //   type: String
  // },

  // wantsThirdpartySoftware: {
  //   type: Boolean,
  //   default: false
  // },

  // thirdpartySoftware: {
  //   type: String
  // },

  // signatureLiability: {
  //   type: String
  // },

  // signaturePhotoRelease: {
  //   type: String
  // },

  // signatureCodeOfConduct: {
  //   type: String
  // },

  // hasFoodAllergies: {
  //   type: Boolean,
  //   default: false
  // },

  // foodAllergy: {
  //   type: String
  // },

  // hasDietaryRestriction: {
  //   type: Boolean,
  //   default: false
  // },

  // dietaryRestriction: {
  //   type: String
  // },

  // description: {
  //   type: String,
  //   min: 0,
  //   max: 300
  // },

  notes: {
    type: String,
    min: 0,
    max: 1500
  },
};

var status = {
  /**
   * Whether or not the user's profile has been completed.
   * @type {Object}
   */
  completedProfile: {
    type: Boolean,
    required: true,
    default: false,
  },

  confirmed: {
    type: Boolean,
    required: true,
    default: false,
  },

  checkedIn: {
    type: Boolean,
    required: true,
    default: false,
  },

  checkedInBy: {
    type: String
  },

  checkInTime: {
    type: Number,
  }
};

// define the schema for our admin model
var schema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
    unique: true,
    validate: [
      validator.isEmail,
      'Invalid Email',
    ]
  },

  password: {
    type: String,
    required: true,
    select: false
  },

  admin: {
    type: Boolean,
    required: true,
    default: false,
  },

  timestamp: {
    type: Number,
    required: true,
    default: Date.now(),
  },

  lastUpdated: {
    type: Number,
    default: Date.now(),
  },

  teamCode: {
    type: String,
    min: 0,
    max: 140,
  },

  verified: {
    type: Boolean,
    required: true,
    default: false
  },

  salt: {
    type: Number,
    required: true,
    default: Date.now(),
    select: false
  },

  /**
   * User Profile.
   *
   * This is the only part of the user that the user can edit.
   *
   * Profile validation will exist here.
   */
  profile: profile,

  /**
   * Status information
   *
   * Extension of the user model.
   */
  status: status

});

schema.set('toJSON', {
  virtuals: true
});

schema.set('toObject', {
  virtuals: true
});

//=========================================
// Instance Methods
//=========================================

// checking if this password matches
schema.methods.checkPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// Token stuff
schema.methods.generateEmailVerificationToken = function () {
  return jwt.sign(this.email, process.env.JWT_SECRET);
};

schema.methods.generateAuthToken = function () {
  return jwt.sign(this._id, process.env.JWT_SECRET);
};

/**
 * Generate a temporary authentication token (for changing passwords)
 * @return JWT
 * payload: {
 *   id: userId
 *   iat: issued at ms
 *   exp: expiration ms
 * }
 */
schema.methods.generateTempAuthToken = function () {
  return jwt.sign({
    id: this._id
  }, process.env.JWT_SECRET, {
    expiresInMinutes: 60,
  });
};

//=========================================
// Static Methods
//=========================================

schema.statics.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

/**
 * Verify an an email verification token.
 * @param  {[type]}   token token
 * @param  {Function} cb    args(err, email)
 */
schema.statics.verifyEmailVerificationToken = function (token, callback) {
  jwt.verify(token, process.env.JWT_SECRET, function (err, email) {
    return callback(err, email);
  });
};

/**
 * Verify a temporary authentication token.
 * @param  {[type]}   token    temporary auth token
 * @param  {Function} callback args(err, id)
 */
schema.statics.verifyTempAuthToken = function (token, callback) {
  jwt.verify(token, process.env.JWT_SECRET, function (err, payload) {

    if (err || !payload) {
      return callback(err);
    }

    if (!payload.exp || Date.now() >= payload.exp * 1000) {
      return callback({
        message: 'Token has expired.'
      });
    }

    return callback(null, payload.id);
  });
};

schema.statics.findOneByEmail = function (email) {
  return this.findOne({
    email: email.toLowerCase()
  });
};

/**
 * Get a single user using a signed token.
 * @param  {String}   token    User's authentication token.
 * @param  {Function} callback args(err, user)
 */
schema.statics.getByToken = function (token, callback) {
  jwt.verify(token, process.env.JWT_SECRET, function (err, id) {
    if (err) {
      return callback(err);
    }
    this.findOne({ _id: id }, callback);
  }.bind(this));
};

schema.statics.validateProfile = function (profile, cb) {
  return cb(!(
    profile.name.length > 0 
    // &&
    // ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'WXS', 'WS', 'WM', 'WL', 'WXL', 'WXXL'].indexOf(profile.shirtSize) > -1 &&
    // ["Remote",
    // "Alexandria",
    // "Amsterdam",
    // "Bangalore",
    // "Bangkok",
    // "Boston",
    // "Bucharest",
    // "Cebu City",
    // "Charlotte",
    // "Charlottesville",
    // "Chicago",
    // "Cork",
    // "Dallas",
    // "Denver",
    // "Doha",
    // "Draper",
    // "Dubai",
    // "Dublin",
    // "El Segundo",
    // "Herndon",
    // "Hong Kong",
    // "Istanbul",
    // "Kiev",
    // "Kildare",
    // "London",
    // "McLean",
    // "Milan",
    // "Milpitas",
    // "Mumbai",
    // "Munich",
    // "Nagoya",
    // "New Delhi",
    // "NYC",
    // "Osaka",
    // "Paris",
    // "Portland",
    // "Pune",
    // "Reston",
    // "Riyadh",
    // "San Diego",
    // "San Francisco",
    // "Selangor",
    // "Seoul",
    // "Shanghai",
    // "Singapore",
    // "State College",
    // "Stockholm",
    // "Sydney",
    // "Taipei City",
    // "Tokyo",
    // "Toronto",
    // "Warsaw",
    // "Westborough"].indexOf(profile.location) > -1
    // profile.signatureLiability.length > 0 &&
    // profile.signaturePhotoRelease.length > 0 &&
    // profile.signatureCodeOfConduct.length > 0
  ));
};

//=========================================
// Virtuals
//=========================================

/**
 * Has the user completed their profile?
 * This provides a verbose explanation of their furthest state.
 */
schema.virtual('status.name').get(function () {

  if (this.status.checkedIn) {
    return 'checkedin';
  }

  if (this.status.completedProfile) {
    return "completed";
  }

  return "incomplete";

});

module.exports = mongoose.model('User', schema);
