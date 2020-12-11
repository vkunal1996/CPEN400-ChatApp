const crypto = require('crypto');
const { runInNewContext } = require('vm');

class SessionError extends Error {};

function SessionManager (){
	// default session length - you might want to
	// set this to something small during development
	const CookieMaxAgeMs = 600000;

	// keeping the session data inside a closure to keep them protected
	const sessions = {};

	// might be worth thinking about why we create these functions
	// as anonymous functions (per each instance) and not as prototype methods
	this.createSession = (response, username, maxAge = CookieMaxAgeMs) => {
        /* To be implemented */
        var token = crypto.randomBytes(64).toString('hex');
        var sessionObject={
            username:username,
            createdAt:Date.now(),
        }
        if(maxAge===undefined){
            maxAge=2000;
        }
        sessions[token]=sessionObject;
        response.cookie('cpen400a-session',token,{maxAge:maxAge});
        
        setTimeout(() => {
            delete sessions[token];
        }, maxAge);

    };

	this.deleteSession = (request) => {
		/* To be implemented */
		delete request.username;
		delete sessions[request.session];
		delete request.session;
	};

	this.middleware = (request, response, next) => {
		/* To be implemented */
		var cookieRecieved=request.headers.cookie;
		
		if(cookieRecieved===undefined){
			next(new SessionError());
		}else{
				// function getValidCookie(cookieRecieved){
				// 	console.log("Recieved Cookies");
				// 	console.log(cookieRecieved);
				// 	console.log("Inside getValidCookie");
				// 	var x=cookieRecieved.split(";");
				// 	var cookie=x[0];
				// 	console.log("Cookie Setting to 0th Element after splitting ; "+cookie);
				// 	for(var i=0;i<x.length;i++){
				// 		console.log("Inside For Loop");
				// 		console.log("Cookie "+i+": "+x[i]);
				// 		if(x[i].startsWith("cpen400a-session")){
				// 			console.log('cookie Found');
				// 			cookie=x[i];
				// 			break;
				// 		}
				// 	}
				// 	console.log("Updating Cookie Value: "+cookie);
				// 	console.log("Returning Cookie: "+cookie);
				// 	return cookie;

				// }
				// console.log("Getting Cookies after checking for multiple cookies");
				// console.log(getValidCookie(request.headers.cookie));
				function getCookie(name) {
					var nameEQ = name + "=";
					var ca = request.headers.cookie.split(';');
					for(var i=0;i < ca.length;i++) {
						var c = ca[i];
						while (c.charAt(0)==' ') c = c.substring(1,c.length);
						if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
					}
					return null;
				}
				var cookie=getCookie("cpen400a-session");

				if(cookie in sessions){
					request.username=sessions[cookie].username;
					request.session=cookie;
					next();
				}else{
					next(new SessionError());
				}
			
			
		}
		

	};

	// this function is used by the test script.
	// you can use it if you want.
	this.getUsername = (token) => ((token in sessions) ? sessions[token].username : null);
};

// SessionError class is available to other modules as "SessionManager.Error"
SessionManager.Error = SessionError;

module.exports = SessionManager;