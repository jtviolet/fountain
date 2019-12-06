var path = require('path');
var nodemailer = require('nodemailer');
// var smtpTransport = require('nodemailer-smtp-transport');
var nodeoutlook = require('nodejs-nodemailer-outlook')


var templatesDir = path.join(__dirname, '../templates');
var Email = require('email-templates');

var ROOT_URL = process.env.ROOT_URL;

var HACKATHON_NAME = process.env.HACKATHON_NAME;
var EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;
var TWITTER_HANDLE = process.env.TWITTER_HANDLE;
var FACEBOOK_HANDLE = process.env.FACEBOOK_HANDLE;

var EMAIL_USER = process.env.EMAIL_USER;
var EMAIL_PASS = process.env.EMAIL_PASS;
var EMAIL_CONTACT = process.env.EMAIL_CONTACT;
var EMAIL_HEADER_IMAGE = process.env.EMAIL_HEADER_IMAGE;
if (EMAIL_HEADER_IMAGE.indexOf("https") == -1) {
  EMAIL_HEADER_IMAGE = ROOT_URL + EMAIL_HEADER_IMAGE;
}
var controller = {};

/**
 * Send a verification email to a user, with a verification token to enter.
 * @param  {[type]}   email    [description]
 * @param  {[type]}   token    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
controller['sendVerificationEmail'] = function (email, token, callback) {

  nodeoutlook.sendEmail({
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    },
    from: EMAIL_USER,
    to: email,
    subject: "["+HACKATHON_NAME+"] - Verify your email",
    text: ROOT_URL + '/verify/' + token,
    onError: (e) => {
      console.error(e);
      if (callback) {
        callback(e, undefined);
      }
    },
    onSuccess: (i) => {
      console.log(i);
      if (callback) {
        callback(undefined, i)
      }
    }
  });
};

/**
 * Send a password recovery email.
 * @param  {[type]}   email    [description]
 * @param  {[type]}   token    [description]
 * @param  {Function} callback [description]
 */
controller['sendPasswordResetEmail'] = function (email, token, callback) {

  nodeoutlook.sendEmail({
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    },
    from: EMAIL_USER,
    to: email,
    subject: 'Password Reset Request',
    text: `Somebody (hopefully you!) has requested that your password be reset. If this was not you, feel free to disregard this email. This link will expire in one hour.\n\n${ROOT_URL}/reset/${token}`,
    onError: (e) => {
      console.error(e);
      if (callback) {
        callback(e, undefined);
      }
    },
    onSuccess: (i) => {
      console.log(i);
      if (callback) {
        callback(undefined, i)
      }
    }
  });
};

/**
 * Send a password recovery email.
 * @param  {[type]}   email    [description]
 * @param  {Function} callback [description]
 */
controller['sendPasswordChangedEmail'] = function (email, callback) {

  nodeoutlook.sendEmail({
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    },
    from: EMAIL_USER,
    to: email,
    subject: "[" + HACKATHON_NAME + "] - Your password has been changed!",
    text: 'Password Updated\n\nSomebody (hopefully you!) has successfully changed your password.',
    onError: (e) => {
      console.error(e);
      if (callback) {
        callback(e, undefined);
      }
    },
    onSuccess: (i) => {
      console.log(i);
      if (callback) {
        callback(undefined, i)
      }
    }
  });
};



module.exports = controller;
