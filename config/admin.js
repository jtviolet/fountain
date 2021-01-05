var User = require('../app/server/models/User');


// Create a default admin user
// if there isn't already one
if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASS) {
  createAdminUser(process.env.ADMIN_EMAIL, process.env.ADMIN_PASS);
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

