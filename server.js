var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var bodyParser = require('body-parser'); 
app.use(bodyParser.json()); // to support JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies

var validator = require('express-validator');
var path = require('path');
var port = process.env.PORT || 8080;
//var client = require('twilio')('ACb6e259a2df685f6dd1fb5f1fb8d0b9ff' , '6bcb7ffe749b37717cd9a365a655cd43')

var passportSocketIo = require('passport.socketio');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
app.use(validator());
var passport = require('passport');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo')(session);
var autoIncrement = require('mongoose-auto-increment');

var configDB = require('./config/database.js');
mongoose.Promise = global.Promise;
mongoose.connect(configDB.url);
//autoIncrement.initialize(mongoose.connect(configDB.url));

app.use(express.static(__dirname + '/public'));


app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'mysrmsession',
				 saveUninitialized: true,
				 resave: true,
				 store: new MongoStore({ mongooseConnection: mongoose.connection,
				 							ttl: 2 * 24 * 60 * 60 })}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

/*io.use(passportSocketIo.authorize({
	key: 'connect.sid',
	secret: 'mysrmsession',
	store: new MongoStore({ mongooseConnection: mongoose.connection,ttl: 2 * 24 * 60 * 60 }),
	passport: passport,
	cookieParser: cookieParser
})); */


app.set('views' , path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var auth = express.Router();
require('./app/routes/auth.js')(auth,passport,io);
app.use('/auth',auth);

var aadhar = express.Router();
require('./app/routes/aadhar.js')(aadhar,passport,io);
app.use('/aadhar',aadhar);

var secure = express.Router();
require('./app/routes/secure.js')(secure, passport,io);
app.use('/', secure);

http.listen(port);
console.log('Server running on port: ' + port);
