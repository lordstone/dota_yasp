
// var async = require('async');
var config = require('../config');

function logUser(db, user_id, password,  cb){
	console.log("logging user");
	db.select().from('my_users').where({
		user_id: user_id,
		password: password
	}).asCallback(function(err, result){
		if(err){
			return cb('failed', err);
		}
		if(!result){
			return cb('failed', 'unknown error');
		}
		result.forEach(function(res){
			if(res.is_logged){
					return cb('logged');
			}else{
					db('my_users').update({is_logged: true}).where({user_id: user_id}).asCallback(function(err1, result1){
						if(err1){
							console.log('update islogged error');
							return cb('failed');
						}else{
							console.log('log in successfully. user_id:' + user_id);
							return cb('success', {user_id: user_id});
						}
					});
					//return cb('success', {user:id: result.user_id});
			}
		});
	});	
}

function logoutUser(db, user_id, cb){
	console.log("logging out user");
	db('my_users').where('user_id', '=', user_id).update({is_logged: false}).asCallback(function(err){
		if(err){
			console.log('logout failed');
			return cb();
		}
		// console.log('logout failed: cannot find the user');
		return cb();
	});	
}



function findUser(db, user_id, cb){
	console.log("finding user");
	db.select().from('my_users').where('user_id', '=', user_id).asCallback(function(err, result){
		if(err){
			return cb(err);
		}
		var t = null;
		result.forEach(function(result){
			t = result;
		});
		return cb(err, t);
	});	
}


function findAll(db, cb){
	console.log("listing all users");
	db.select().table('my_users').asCallback(function(err, results){
		//results.forEach(function(res){
		//	console.log(res.user_id + ':' + res.password);
		//});		
		if(err){
			console.log('error in listing all users');
			return cb(err, 'failed');
		}
		return cb(err, results);
	});
}

function newUser(db, myuser, cb){
	console.log("new user");
	db.table('my_users').insert({
		user_id: myuser.user_id,
		password: myuser.password,
		invitation_code: myuser.invitation_code	
	}).asCallback(function(err, result){
		if(err){
			console.log('error in adding new user');
			return cb(err, 'failed');
		}else{
			return cb(err, 'success');
		}
	});
}

function deleteUser(db, user_id, cb){
	console.log("delete user");
	db.table('my_users').where({
		user_id: user_id
	}).del().asCallback(function(err, result){
		if(err){
			console.log('error in deleting user');
			return cb(err, 'failed');
		}else{
			return cb(err, 'success');
		}
	});
}

function editUser(db, new_user, old_user_id, cb){
	console.log("edit user");
	db.table('my_users').where({
		user_id: old_user_id
	}).update({
		user_id: new_user.user_id,
		password: new_user.password,
		invitation_code: new_user.invitation_code
	}).asCallback(function(err, result){
		if(err){
			console.log('error in editing user');
			return cb(err, 'failed');
		}else{
			return cb(err, 'success');
		}
	});
}

function register(db, new_user, cb){
	console.log("new register:"+new_user.invitation_code);
	db.table('my_invitation_codes').where({
		invitation_code: new_user.invitation_code
	}).select().asCallback(function(err, result)
	{
		if(err){
			console.log('error in registering');
			return cb(err, 'failed in db phase');
		}else{
			if(!result){
				console.log('empty satisfying set');
				return cb(err, 'invalid invitation code');
			}
			result.forEach(function(res){
				if(res.invitation_code == new_user.invitation_code && res.max_users > 0 && res.current_users < res.max_users)
				{
					// matching invitation code, inserting
					var current_users = res.current_users + 1;
					newUser(db, new_user, function(err1, msg){
					if(err1 || msg != 'success'){
						return cb(err1, msg);
					}else{
						db.table('my_invitation_codes').where({invitation_code: new_user.invitation_code}).update({
							current_users: current_users
						}).asCallback(function(err2, update_res)
						{
							if(err2){
								return cb(err2, 'failed');
							}else{
								console.log('register successful');
								return cb('', 'success');
							}
						});// end update
					}	// return cb(err, 'success');
					}); // end new user 
				}else{
					return cb(err, 'invalid invitation code');
				} //end if
			// end inserting
			}); //end for each	
			// return cb(err, 'invalid invitation code');
		}// end if else
	});//end callback
}

// invitation code

function findAll_inv(db, cb){
	console.log("listing all invitation codes");
	db.select().table('my_invitation_codes').asCallback(function(err, results){
		if(err){
			console.log('error in listing all users');
			return cb(err, 'failed');
		}
		return cb(err, results);
	});
}

function findInv(db, invitation_code, cb){
	console.log("finding invitation code");
	db.select().from('my_invitation_codes').where('invitation_code', '=', invitation_code).asCallback(function(err, result){
		if(err){
			return cb(err);
		}
		var t = null;
		result.forEach(function(result){
			t = result;
		});
		return cb(err, t);
	});	
}



function newInv(db, myinv, cb){
	console.log("new invitation code");
	db.table('my_invitation_codes').insert({
		invitation_code: myinv.invitation_code,
		max_users: myinv.max_users,
		current_users: myinv.current_users
	}).asCallback(function(err, result){
		if(err){
			console.log('error in adding new invitation code');
			return cb(err, 'failed');
		}else{
			return cb(err, 'success');
		}
	});
}

function deleteInv(db, invitation_code, cb){
	console.log("delete invitation code");
	db.table('my_invitation_codes').where({
		invitation_code: invitation_code
	}).del().asCallback(function(err, result){
		if(err){
			console.log('error in deleting invitation code');
			return cb(err, 'failed');
		}else{
			return cb(err, 'success');
		}
	});
}

function editInv(db, new_inv, old_invitation_code, cb){
	console.log("edit invitation code");
	db.table('my_invitation_codes').where({
		invitation_code: old_invitation_code
	}).update({
		invitation_code: new_inv.invitation_code,
		max_users: new_inv.max_users,
		current_users: new_inv.current_users
	}).asCallback(function(err, result){
		if(err){
			console.log('error in editing invitation code');
			return cb(err, 'failed');
		}else{
			return cb(err, 'success');
		}
	});
}


module.exports = {
	logUser: logUser,
	logoutUser: logoutUser,
	findAll: findAll,
	newUser: newUser,
	deleteUser: deleteUser,
	editUser: editUser,
	findUser: findUser,
	register: register,
	findAll_inv: findAll_inv,
	findInv: findInv,
	newInv: newInv,
	editInv: editInv,
	deleteInv: deleteInv
};
