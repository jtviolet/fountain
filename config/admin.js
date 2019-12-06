var User = require('../app/server/models/User');

// Load the AWS SDK
var AWS = require('aws-sdk'),
  region = process.env.AWS_REGION;

// Create a Secrets Manager client
var client = new AWS.SecretsManager({
  region: region
});

// Create a default admin user
// if there isn't already one
if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASS) {
  createAdminUser(process.env.ADMIN_EMAIL, process.env.ADMIN_PASS);
} else {
  // Load the credentials for the initial admin user of the registration portal
  client.getSecretValue({ SecretId: process.env.AWS_SM_ADMIN_USER }, function (err, data) {
    if (err) {
      console.error(err);
    }
    else {
      const secret = JSON.parse(data.SecretString);
      createAdminUser(secret.email, secret.password);
    }
  });
}

function createAdminUser(email, password) {
  User
    .findOne({
      email
    })
    .exec(function (err, user) {
      if (!user) {
        var adminUser = new User();
        adminUser.email = email;
        adminUser.password = User.generateHash(password);
        adminUser.admin = true;
        adminUser.verified = true;
        adminUser.save(function (err) {
          if (err) {
            console.error(err);
          }
        });
      }
    });
}

