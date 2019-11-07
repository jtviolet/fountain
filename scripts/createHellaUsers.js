// Connect to mongodb
var mongoose        = require('mongoose');
var database        = process.env.DATABASE || { url: "mongodb://localhost:27017"};
var User = require('../app/server/models/User');

mongoose.connect(database.url);

var users = 1000;
var username = 'hacker';
var teamName = "team_";

for (var i = 0; i < users; i++){
  console.log(username, i);
  var newUser = new User();
  newUser.email = username + "_" + i + "@gmail.com";
  newUser.password = "123456_" + i;
  newUser.teamCode = teamName + i;
  newUser.save(function(err){
    console.error(err);
  });
}
