// Load the dotfiles.
require('dotenv').load({ silent: true });

const fs = require('fs');
const certFileBuf = fs.readFileSync('./rds-combined-ca-bundle.pem');

var express = require('express');
const serverless = require('serverless-http');

// Middleware!
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var morgan = require('morgan');
const compression = require('compression');

var mongoose = require('mongoose');

var app = express();

// Load the AWS SDK
var AWS = require('aws-sdk'),
  region = process.env.AWS_REGION;

// Create a Secrets Manager client
var client = new AWS.SecretsManager({
  region: region
});

// Load the credentials for the initial admin user of the registration portal
client.getSecretValue({ SecretId: process.env.AWS_SM_ADMIN_USER }, function (err, data) {
  if (err) {
    throw err;
  }
  else {
    const secret = JSON.parse(data.SecretString);
    process.env['ADMIN_EMAIL'] = secret.email;
    process.env['ADMIN_PASS'] = secret.password;
  }
});

// Load the password for the email account that sends out verification emails
client.getSecretValue({ SecretId: process.env.AWS_SM_HACKATHON_EMAIL_PASSWORD }, function (err, data) {
  if (err) {
    throw err;
  }
  else {
    const secret = JSON.parse(data.SecretString);
    process.env['EMAIL_PASS'] = secret.password;
  }
});

// Load the mongo DB credentials and connect to the database
client.getSecretValue({ SecretId: process.env.AWS_SM_DATABASE_CREDENTIALS }, function (err, data) {
  if (err) {
    throw err;
  }
  else {
    const secret = JSON.parse(data.SecretString);
    // Connect to mongodb
    const database = `mongodb://${secret.username}:${secret.password}@${process.env.DB_HOST}:27017/?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0`
    mongoose.connect(database, {
      sslCA: certFileBuf,
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
      .then(() => console.log('Connection to DB successful'))
      .catch((err) => console.error(err, 'Error'));
  }
});

app.use(morgan('dev'));
app.use(compression());

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(methodOverride());

app.use(express.static(__dirname + '/app/client'));

// Routers =====================================================================

var apiRouter = express.Router();
require('./app/server/routes/api')(apiRouter);
app.use('/api', apiRouter);

var authRouter = express.Router();
require('./app/server/routes/auth')(authRouter);
app.use('/auth', authRouter);

require('./app/server/routes')(app);

// listen (start app with node server.js) ======================================
// app.listen(port);
// console.log("App listening on port " + port);

module.exports.handler = serverless(app);
