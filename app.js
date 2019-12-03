// Load the dotfiles.
require('dotenv').load({silent: true});

const fs = require('fs');
const certFileBuf = fs.readFileSync('./rds-combined-ca-bundle.pem');

var express         = require('express');
const serverless    = require('serverless-http');

// Middleware!
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var morgan          = require('morgan');
const compression   = require('compression');

var mongoose        = require('mongoose');
// var port            = process.env.PORT || 3000;
var database        = process.env.DATABASE || process.env.MONGODB_URI || "mongodb://localhost:27017";

var app             = express();

// Connect to mongodb
mongoose.connect(database, { 
  sslCA: certFileBuf,
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connection to DB successful'))
.catch((err) => console.error(err,'Error'));

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
