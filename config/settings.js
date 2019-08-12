var Settings = require('../app/server/models/Settings');

// Create settings in database
// if there isn't already one
Settings
  .findOne({})
  .exec(function(err, settings){
    if (!settings){
      var settings = new Settings();
      settings.save();
    }
  });
