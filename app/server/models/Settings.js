var mongoose = require('mongoose');

var whitelistDomains = process.env.WHITELIST_DOMAINS || '.com';

/**
 * Settings Schema!
 *
 * Fields with select: false are not public.
 * These can be retrieved in controller methods.
 *
 * @type {mongoose}
 */
var schema = new mongoose.Schema({
  status: String,
  timeOpen: {
    type: Number,
    default: 0
  },
  timeClose: {
    type: Number,
    default: Date.now() + 31104000000 // Add a year from now.
  },
  whitelistedDomains: {
    type: [String],
    select: false,
    default: whitelistDomains.split(' '),
  },
  confirmationText: {
    type: String,
  },
  helpqUrl: {
    type: String,
  }
});

/**
 * Get the list of whitelisted domains.
 * @param  {Function} callback args(err, emails)
 */
schema.statics.getWhitelistedDomains = function(callback){
  this
    .findOne({})
    .select('whitelistedDomains')
    .exec(function(err, settings){
      return callback(err, settings.whitelistedDomains);
    });
};

/**
 * Get the open and close time for registration.
 * @param  {Function} callback args(err, times : {timeOpen, timeClose, timeConfirm})
 */
schema.statics.getRegistrationTimes = function(callback){
  this
    .findOne({})
    .select('timeOpen timeClose timeConfirm')
    .exec(function(err, settings){
      callback(err, {
        timeOpen: settings.timeOpen,
        timeClose: settings.timeClose,
        timeConfirm: settings.timeConfirm
      });
    });
};

schema.statics.getPublicSettings = function(callback){
  this
    .findOne({})
    .exec(callback);
};

module.exports = mongoose.model('Settings', schema);
