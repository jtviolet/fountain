ADMIN_EMAIL = process.env.ADMIN_EMAIL;
ADMIN_PASSWORD = process.env.ADMIN_PASS;

var User = require('../app/server/models/User');

// Create a default admin user
// if there isn't already one
User
  .findOne({
    email: ADMIN_EMAIL
  })
  .exec(function(err, user){
    if (!user){
      var adminUser = new User();
      adminUser.email = ADMIN_EMAIL;
      adminUser.password = User.generateHash(ADMIN_PASSWORD);
      adminUser.admin = true;
      adminUser.verified = true;
      adminUser.save(function(err){
        if (err){
          console.log(err);
        }
      });
    }
  });
