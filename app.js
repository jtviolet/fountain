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


// Use this code snippet in your app.
// If you need more information about configurations or implementing the sample code, visit the AWS docs:
// https://aws.amazon.com/developers/getting-started/nodejs/

// Load the AWS SDK
var AWS = require('aws-sdk'),
  region = process.env.AWS_REGION,
  secretName = process.env.AWS_SM_DATABASE,
  secret,
  decodedBinarySecret;

// Create a Secrets Manager client
var client = new AWS.SecretsManager({
  region: region
});

// In this sample we only handle the specific exceptions for the 'GetSecretValue' API.
// See https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
// We rethrow the exception by default.

client.getSecretValue({ SecretId: secretName }, function (err, data) {
  if (err) {
    if (err.code === 'DecryptionFailureException')
      // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
      // Deal with the exception here, and/or rethrow at your discretion.
      throw err;
    else if (err.code === 'InternalServiceErrorException')
      // An error occurred on the server side.
      // Deal with the exception here, and/or rethrow at your discretion.
      throw err;
    else if (err.code === 'InvalidParameterException')
      // You provided an invalid value for a parameter.
      // Deal with the exception here, and/or rethrow at your discretion.
      throw err;
    else if (err.code === 'InvalidRequestException')
      // You provided a parameter value that is not valid for the current state of the resource.
      // Deal with the exception here, and/or rethrow at your discretion.
      throw err;
    else if (err.code === 'ResourceNotFoundException')
      // We can't find the resource that you asked for.
      // Deal with the exception here, and/or rethrow at your discretion.
      throw err;
    else
      throw err;
  }
  else {
    // Decrypts secret using the associated KMS CMK.
    // Depending on whether the secret is a string or binary, one of these fields will be populated.
    if ('SecretString' in data) {
      secret = JSON.parse(data.SecretString);
    } else {
      let buff = new Buffer(data.SecretBinary, 'base64');
      decodedBinarySecret = buff.toString('ascii');
    }
  }

  // Your code goes here. 
  // Connect to mongodb
  const database = `mongodb://${secret.username}:${secret.password}@${process.env.DB_HOST}:27017/?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0`
  mongoose.connect(database, {
    sslCA: certFileBuf,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => console.log('Connection to DB successful'))
    .catch((err) => console.error(err, 'Error'));
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
