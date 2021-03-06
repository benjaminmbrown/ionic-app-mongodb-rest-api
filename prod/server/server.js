var restify = require('restify');
var mongojs = require('mongojs');
var morgan = require('morgan');
//var db = mongojs('bucketlist', ['appUsers', 'bucketLists']);
var db = mongojs('mongodb://bucketlist:bucket123@ds033123.mongolab.com:33123/ionic-bucket-list', ['appUsers','bucketLists']);
var server = restify.createServer();

var manageUsers = require('./auth/manageUser')(server,db);
var manageLists = require('./list/manageList')(server,db);

//restify middleware
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser);
server.use(restify.bodyParser);
server.use(morgan('dev'));//LOGGING

//CORS
server.use(function(req,res,next){
	res.header('Access-Control-Allow-Origin', "*");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

server.listen(process.env.PORT || 9804, function(){
	console.log("Server started on port:", process.env.PORT || 9804);
});