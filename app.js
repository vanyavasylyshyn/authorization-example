const Koa = require('koa'); // core
const bodyParser = require('koa-bodyparser'); // POST parser
const logger = require('koa-logger');
const mongoose = require('mongoose');
const passport = require('koa-passport');
const {routes, allowedMethods}  = require('./routes');

const app = new Koa();

mongoose.Promise = Promise; // Ask Mongoose to use standard Promises
mongoose.set('debug', true);  // Ask Mongoose to log DB request to console
mongoose.connect('mongodb://admin1:admin1@ds211865.mlab.com:11865/project',{useNewUrlParser: true}); // Connect to local database
mongoose.connection.on('error', console.error);

const port =  process.env.PORT ;

app.use(logger());
app.use(bodyParser());
app.use(passport.initialize());
app.use(routes());
app.use(allowedMethods());

app.listen(port, () => {
    console.log(`Server working on port: ${port}`);
});