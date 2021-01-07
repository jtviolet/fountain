var mongoose = require('mongoose'),
  bcrypt = require('bcrypt'),
  validator = require('validator'),
  jwt = require('jsonwebtoken');

var crypto = require('crypto');

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

  teamTimezone: {
    type: String,
    min: 0,
    max: 10,
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
  // const hash = crypto.createHash('sha256').update(password).digest('base64');
  return bcrypt.compareSync(SHA256(password), this.password);
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
  // const hash = crypto.createHash('sha256').update(password).digest('base64');
  return bcrypt.hashSync(SHA256(password), bcrypt.genSaltSync(10,'a'));
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

SHA256 = (function () {


  /**
  *
  *  Secure Hash Algorithm (SHA256)
  *  http://www.webtoolkit.info/javascript-sha256.html
  *  http://anmar.eu.org/projects/jssha2/
  *
  *  Original code by Angel Marin, Paul Johnston.
  *
  **/
  
  function SHA256(s){
  
    var chrsz   = 8;
    var hexcase = 0;
  
    function safe_add (x, y) {
      var lsw = (x & 0xFFFF) + (y & 0xFFFF);
      var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
      return (msw << 16) | (lsw & 0xFFFF);
    }
  
    function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }
    function R (X, n) { return ( X >>> n ); }
    function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
    function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
    function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
    function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
    function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
    function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }
  
    function core_sha256 (m, l) {
      var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
      var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
      var W = new Array(64);
      var a, b, c, d, e, f, g, h, i, j;
      var T1, T2;
  
      m[l >> 5] |= 0x80 << (24 - l % 32);
      m[((l + 64 >> 9) << 4) + 15] = l;
  
      for ( var i = 0; i<m.length; i+=16 ) {
        a = HASH[0];
        b = HASH[1];
        c = HASH[2];
        d = HASH[3];
        e = HASH[4];
        f = HASH[5];
        g = HASH[6];
        h = HASH[7];
  
        for ( var j = 0; j<64; j++) {
          if (j < 16) W[j] = m[j + i];
          else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
  
          T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
          T2 = safe_add(Sigma0256(a), Maj(a, b, c));
  
          h = g;
          g = f;
          f = e;
          e = safe_add(d, T1);
          d = c;
          c = b;
          b = a;
          a = safe_add(T1, T2);
        }
  
        HASH[0] = safe_add(a, HASH[0]);
        HASH[1] = safe_add(b, HASH[1]);
        HASH[2] = safe_add(c, HASH[2]);
        HASH[3] = safe_add(d, HASH[3]);
        HASH[4] = safe_add(e, HASH[4]);
        HASH[5] = safe_add(f, HASH[5]);
        HASH[6] = safe_add(g, HASH[6]);
        HASH[7] = safe_add(h, HASH[7]);
      }
      return HASH;
    }
  
    function str2binb (str) {
      var bin = Array();
      var mask = (1 << chrsz) - 1;
      for(var i = 0; i < str.length * chrsz; i += chrsz) {
        bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
      }
      return bin;
    }
  
    function Utf8Encode(string) {
      // METEOR change:
      // The webtoolkit.info version of this code added this
      // Utf8Encode function (which does seem necessary for dealing
      // with arbitrary Unicode), but the following line seems
      // problematic:
      //
      // string = string.replace(/\r\n/g,"\n");
      var utftext = "";
  
      for (var n = 0; n < string.length; n++) {
  
        var c = string.charCodeAt(n);
  
        if (c < 128) {
          utftext += String.fromCharCode(c);
        }
        else if((c > 127) && (c < 2048)) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }
  
      }
  
      return utftext;
    }
  
    function binb2hex (binarray) {
      var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
      var str = "";
      for(var i = 0; i < binarray.length * 4; i++) {
        str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
        hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
      }
      return str;
    }
  
    s = Utf8Encode(s);
    return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
  
  }
  
  /// METEOR WRAPPER
  return SHA256;
  })();

module.exports = mongoose.model('User', schema);
