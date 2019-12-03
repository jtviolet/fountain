const path = require('path');

module.exports = function(app) {

  // Application ------------------------------------------
  app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '../client', 'index.html'));
  });

  app.get('/build/app.js', function(req, res){
    res.sendFile(path.join(__dirname, '../client/build', 'app.js'));
  });

  app.get('/build/site.css', function(req, res){
    res.sendFile(path.join(__dirname, '../client/build', 'site.css'));
  });

  // Wildcard all other GET requests to the angular app
  app.get('*', function(req, res){
    res.sendFile(path.join(__dirname, '../client', 'index.html'));
  });

};
