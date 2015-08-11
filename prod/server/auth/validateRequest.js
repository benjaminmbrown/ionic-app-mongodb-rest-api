var isEmailValid = function(db,email,callback){
	db.appUsers.findOne({
	email:email
	}, function(err,user){
	callback(user);
	});
};

module.exports.validate = function(req,res,db,callback){
 if(!req.params.token){
 	res.writeHead(403,{
 		'Content-Type' : 'application/json; charset=utf-8'
 	});
 	res.end(JSON.stringify({
 		error: 'you have no authorization for this app',
 		message: 'an email is required for this header'
 	}));
 };

 isValidEmail(db,req.params.token, function(user){
 	if(!user){
 		res.writeHead(403, {
 			'Content-Type' : 'application/json; charset=utf-8'
 		})

 		res.end(JSON.stringify({
 			error: 'you have no authorization for this app',
 			message: 'Invalid email address'
 		}))
 	}else{
 		callback();
 	}
 });
}