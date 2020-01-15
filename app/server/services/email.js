var path = require('path');
var nodemailer = require('nodemailer');
// var smtpTransport = require('nodemailer-smtp-transport');
var nodeoutlook = require('nodejs-nodemailer-outlook')


var templatesDir = path.join(__dirname, '../templates');
var Email = require('email-templates');

var ROOT_URL = process.env.ROOT_URL;

var HACKATHON_NAME = process.env.HACKATHON_NAME;
var EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;
// var TWITTER_HANDLE = process.env.TWITTER_HANDLE;
// var FACEBOOK_HANDLE = process.env.FACEBOOK_HANDLE;

var EMAIL_USER = process.env.EMAIL_USER;
var EMAIL_CONTACT = process.env.EMAIL_CONTACT;
var EMAIL_HEADER_IMAGE = process.env.EMAIL_HEADER_IMAGE;
if (EMAIL_HEADER_IMAGE.indexOf("https") == -1) {
  EMAIL_HEADER_IMAGE = ROOT_URL + EMAIL_HEADER_IMAGE;
}

var NODE_ENV = process.env.NODE_ENV;

// Load the AWS SDK
var AWS = require('aws-sdk');
var region = process.env.AWS_REGION;

// Create a Secrets Manager client
var client = new AWS.SecretsManager({
  region: region
});

var controller = {};

// Load the password for the email account that sends out verification emails
client.getSecretValue({ SecretId: process.env.AWS_SM_HACKATHON_SES_EMAIL_CREDENTIALS }, function (err, data) {
  if (err) {
    throw err;
  }
  else {
    const secret = JSON.parse(data.SecretString);

    var options = {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
      auth: {
        user: secret.username,
        pass: secret.password
      }
    };

    let transporter = nodemailer.createTransport(options);

    controller.transporter = transporter;

    function sendOne(templateName, options, data, callback) {
      if (NODE_ENV === "dev") {
        console.log(templateName);
        console.log(JSON.stringify(data, "", 2));
      }

      const email = new Email({
        message: {
          from: EMAIL_USER
        },
        send: true,
        transport: transporter
      });

      data.emailHeaderImage = EMAIL_HEADER_IMAGE;
      data.emailAddress = EMAIL_ADDRESS;
      data.hackathonName = HACKATHON_NAME;
      // data.twitterHandle = TWITTER_HANDLE;
      // data.facebookHandle = FACEBOOK_HANDLE;
      data.copyright = process.env.COPYRIGHT;

      email.send({
        locals: data,
        message: {
          subject: options.subject,
          to: options.to
        },
        template: path.join(__dirname, "..", "emails", templateName),
      }).then(res => {
        console.log(`Email sent: ${res}`);
        if (callback) {
          callback(undefined, res)
        }
      }).catch(err => {
        console.error(`Unable to send email: ${err}`);
        if (callback) {
          callback(err, undefined);
        }
      });
    }

    /**
     * Send a verification email to a user, with a verification token to enter.
     * @param  {[type]}   email    [description]
     * @param  {[type]}   token    [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    controller.sendVerificationEmail = function (email, token, callback) {
      console.log(`Sending verification email to ${email}`);

      var options = {
        to: email,
        subject: "[" + HACKATHON_NAME + "] - Verify your email"
      };

      var locals = {
        verifyUrl: ROOT_URL + '/verify/' + token
      };

      /**
       * Eamil-verify takes a few template values:
       * {
       *   verifyUrl: the url that the user must visit to verify their account
       * }
       */
      sendOne('email-verify', options, locals, function (err, info) {
        if (err) {
          console.log(err);
        }
        if (info) {
          console.log(info.message);
        }
        if (callback) {
          callback(err, info);
        }
      });

    };

    /**
     * Send a password recovery email.
     * @param  {[type]}   email    [description]
     * @param  {[type]}   token    [description]
     * @param  {Function} callback [description]
     */
    controller.sendPasswordResetEmail = function (email, token, callback) {

      var options = {
        to: email,
        subject: "[" + HACKATHON_NAME + "] - Password reset requested!"
      };

      var locals = {
        title: 'Password Reset Request',
        subtitle: '',
        description: 'Somebody (hopefully you!) has requested that your password be reset. If ' +
          'this was not you, feel free to disregard this email. This link will expire in one hour.',
        actionUrl: ROOT_URL + '/reset/' + token,
        actionName: "Reset Password"
      };

      /**
       * Eamil-verify takes a few template values:
       * {
       *   verifyUrl: the url that the user must visit to verify their account
       * }
       */
      sendOne('email-link-action', options, locals, function (err, info) {
        if (err) {
          console.log(err);
        }
        if (info) {
          console.log(info.message);
        }
        if (callback) {
          callback(err, info);
        }
      });

    };

    /**
     * Send a password recovery email.
     * @param  {[type]}   email    [description]
     * @param  {Function} callback [description]
     */
    controller.sendPasswordChangedEmail = function (email, callback) {

      var options = {
        to: email,
        subject: "[" + HACKATHON_NAME + "] - Your password has been changed!"
      };

      var locals = {
        title: 'Password Updated',
        body: 'Somebody (hopefully you!) has successfully changed your password.',
      };

      /**
       * Eamil-verify takes a few template values:
       * {
       *   verifyUrl: the url that the user must visit to verify their account
       * }
       */
      sendOne('email-basic', options, locals, function (err, info) {
        if (err) {
          console.log(err);
        }
        if (info) {
          console.log(info.message);
        }
        if (callback) {
          callback(err, info);
        }
      });

    };
  }
});

module.exports = controller;
