var everlive = new Everlive({
    apiKey: "KGCVGkuoa3Zw0Auj",
    scheme: "https",
    token: localStorage.getItem('access-token')
});
function changeUI(){
    if (kendo.support.mobileOS.android) {
      //  $('#logo').css('height','150px');
        $('.option').css('height','50px');
        $('.login-icon').css('height','27px');
        $('.password-icon').css('height','31px');
    }
}
function show(){
       $("#header").show("fast");
}
function hide(){
       $("#header").hide("fast");
}
function login(){
    var validator = $("#loginForm").kendoValidator().data("kendoValidator");
              //  alert("Checking alert in login");
                var username = $("#userName").val();
                var password = $("#password").val();
         if (validator.validate()) {
             //       alert(username+"  "+password);
                    everlive.Users.login(username, password, function(data) {
                    var accessToken = data.result.access_token;
               //     alert("Successfully logged the user in! Received access token: " + accessToken);
                    localStorage.setItem('access-token', accessToken);
                    app.navigate("views/home.html","slide"); 
                  //  show();
                }, function(err) {
                    console.log(err.message);
                     $("#errMsg").text("Invalid Username or Password!");
                     $("#userName").val("");
                     $("#password").val("");
            });
         } 
}
function removeMessage(){
    $("#errMsg").text("");
}
function logout(){
            everlive.Users.logout(function() {
         //   alert("Logout successful!");
            localStorage.getItem('access-token');
            app.navigate("views/login.html","slide");    
          //  hide();
        }, function(err) {
           // alert("Failed to logout: " + err.message);
        });
}
function isLoggedIn(){
       everlive.Users.currentUser(function(data) {
            if (data.result) {
                var username = data.result.Username;
                 app.navigate("views/home.html","slide");
           //     alert(username + " is logged in!");
                $("#userName").val("");
                $("#password").val("");
            } else {
             //   alert("Missing access token. Please login!");
                  app.navigate("views/login.html","slide");
            }
       }, function(err) {
          //  alert(err.message + " Please login.");
            app.navigate("views/login.html","slide");
       });
}

function faceBookLogin(){
    
    facebookConnectPlugin.login(["email", "user_friends"], function(response) { 
                if (response) {
                    // contains the 'status' - bool, 'authResponse' - object with 'session_key', 'accessToken', 'expiresIn', 'userID'
                    alert("You are: " + response.authResponse.accessToken);
                    var accessToken = response.authResponse.accessToken;
                    everlive.Users.loginWithFacebook(accessToken,
                        function (data) {
                            alert(JSON.stringify(data));
                            var accessToken = data.result.access_token;
                            alert("Successfully logged the user in! Received access token: " + accessToken);
                            localStorage.setItem('access-token', accessToken);
                            app.navigate("views/home.html","slide");
                        },
                        function(error){
                            alert(JSON.stringify(error));
                        });
                } else {
                    alert("You are not logged in");
                }
            });
}

/********************* Twitter login*********************************/

var options = {
	consumerKey: 'fcOV9LQh18Nmvhy4HS8JWAVxq', // YOUR Twitter CONSUMER_KEY
	consumerSecret: 'jYNX90Ccm83KgfIKa9WdJbtmoumtdUsLlT7IFJtl4LkKJoYAAR', // YOUR Twitter CONSUMER_SECRET
	callbackUrl: window.location.host + window.location.pathname
};
var twitterKey = "twtrKey";
function logInTwitter() {
	var oauth = OAuth(options);
	var requestParams; 
	var appBrowser;
	//Step 1: Obtaining a request token
	oauth.get('https://api.twitter.com/oauth/request_token', 
			  function(data) {
				  requestParams = data.text;
				  //Step 2: Redirecting the user to authenticate using the received request token
				  appBrowser = window.open('https://api.twitter.com/oauth/authenticate?' + data.text, "_blank"); // This opens the Twitter authentication / sign in page
				  appBrowser.addEventListener('loadstart', function(event) {
                      console.log("Check location " + event+event.url);   
					  authorized(appBrowser, oauth, event.url, requestParams);
				  });
			  }, onError
		);
}

function authorized(appBrowser, oauth, loc, requestParams){
	
	if (loc.indexOf(options.callbackUrl) >= 0) {
		console.log("Check location " + loc);   
		// Parse the returned URL
		var index, verifier = '';
		var params = loc.substr(loc.indexOf('?') + 1);
                                 
		params = params.split('&');
		for (var i = 0; i < params.length; i++) {
			var y = params[i].split('=');
			if (y[0] === 'oauth_verifier') {
				verifier = y[1];
			}
		}
		//Step 3: Converting the request token to an access token
		oauth.get('https://api.twitter.com/oauth/access_token?oauth_verifier=' + verifier + '&' + requestParams,
				  function(data) {
					  var accessParams = {};
					  var qvars_tmp = data.text.split('&');
					  for (var i = 0; i < qvars_tmp.length; i++) {
						  var y = qvars_tmp[i].split('=');
						  accessParams[y[0]] = decodeURIComponent(y[1]);
					  }         
					  oauth.setAccessToken([accessParams.oauth_token, accessParams.oauth_token_secret]);
                                           
					  // Saving token of access in Local_Storage
					  var accessData = {};
					  accessData.accessTokenKey = accessParams.oauth_token;
					  accessData.accessTokenSecret = accessParams.oauth_token_secret;
					  console.log(accessData.accessTokenSecret+"TWITTER: Storing token key/secret in localStorage"+accessData.accessTokenKey);
					  localStorage.setItem(twitterKey, JSON.stringify(accessData));
					  //Determine the identity of the user by verifying their credentials
					  oauth.get('https://api.twitter.com/1.1/account/verify_credentials.json?skip_status=true', credentialsVerified, onError);
				  },
				  onError
			);
		appBrowser.close();
	} 
}

function credentialsVerified(data) { 
	var entry = JSON.parse(data.text);
	console.log(JSON.stringify(entry));
	screeenName = entry.screen_name;
	var accessData=JSON.parse(localStorage.getItem(twitterKey));
    console.log(accessData.accessTokenKey+"TWITTER USER: " + entry.screen_name);
    everlive.Users.loginWithTwitter(accessData.accessTokenKey, accessData.accessTokenSecret,
    function (data) {
        alert("success"+JSON.stringify(data));
        var accessToken = data.result.access_token;
        alert("Successfully logged the user in! Received access token: " + accessToken);
        localStorage.setItem('access-token', accessToken);
        app.navigate("views/home.html","slide");
    },
    function(error){
        alert("error"+JSON.stringify(error));
    });
}

function onError(error) {
	console.log("ERROR: " +JSON.stringify( error));
}
/**************************google login********************/
var googleapi = {
    authorize: function(options,appBrowser) {
        var deferred = $.Deferred();
        var authUrl = 'https://accounts.google.com/o/oauth2/auth?' + $.param({
            client_id: options.client_id,
            redirect_uri: options.redirect_uri,
            response_type: 'code',
            scope: options.scope
        });

        appBrowser = window.open(authUrl, '_blank', 'location=no,toolbar=no');
        $(appBrowser).on('loadstart', function(e) {
            var url = e.originalEvent.url;
            var code = /\?code=(.+)$/.exec(url);
            var error = /\?error=(.+)$/.exec(url);

            if (code || error) {
                //Always close the browser when match is found
                appBrowser.close();
            }

            if (code) {
                //Exchange the authorization code for an access token
                $.post('https://accounts.google.com/o/oauth2/token', {
                    code: code[1],
                    client_id: options.client_id,
                    client_secret: options.client_secret,
                    redirect_uri: options.redirect_uri,
                    grant_type: 'authorization_code'
                }).done(function(data) {
                    deferred.resolve(data);
                }).fail(function(response) {
                    deferred.reject(response.responseJSON);
                });
            } else if (error) {
                //The user denied access to the app
                deferred.reject({
                    error: error[1]
                });
            }
        });

        return deferred.promise();
    }
};

function logInGoogle() {
    var appBrowser;
    googleapi.authorize({
        client_id: '400469019178-s6ess817q9lb22l5jmrf9o8bjqr9vmol.apps.googleusercontent.com',
        client_secret: '2unax4_pBRkw6GdzauRDB-M4',
        redirect_uri: 'http://localhost',
        scope: 'https://www.googleapis.com/auth/plus.me'
    },appBrowser).done(function(data) {
        console.log(JSON.stringify(data));
        everlive.Users.loginWithGoogle(data.access_token,
            function (data) {
                alert(JSON.stringify(data));
                var accessToken = data.result.access_token;
                alert("Successfully logged the user in! Received access token: " + accessToken);
                localStorage.setItem('access-token', accessToken);
                app.navigate("views/home.html","slide");
            },
            function(error){
                alert("everlive"+JSON.stringify(error));
            });
    }).fail(function(data) {
        alert("err"+JSON.stringify(data));
    });
}
/*********************************Microsoft Login************************************/
var microsoftapi = {
    authorize: function(options) {
        var deferred = $.Deferred();

        //Build the OAuth consent page URL
        var authUrl = 'https://login.live.com/oauth20_authorize.srf?client_id='+ options.client_id+'&response_type=token&scope='+options.scope;
        console.log(authUrl);

        var authWindow = window.open(authUrl, '_blank', 'location=no,toolbar=no');

       $(authWindow).on('loadstart', function(e) {
            var url = e.originalEvent.url;
            var code = /\#access_token=(.+)$/.exec(url);
            var error = /\#error=(.+)$/.exec(url);
            if (code || error) {
                //Always close the browser when match is found
                authWindow.close();
            }
            if (code) {
                console.log(url)
                var verifier = '';
        		var params = url.substr(url.indexOf('#') + 1);
                params = params.split('&');
        		for (var i = 0; i < params.length; i++) {
        			var y = params[i].split('=');
        			if (y[0] === 'access_token') {
        				verifier = y[1];
        			}
        		}
                var data={access_token:verifier}
                console.log(JSON.stringify(data))
                deferred.resolve(data);
            } else if (error) {
                //The user denied access to the app
                deferred.reject({
                    error: error[1]
                });
            }
        });

        return deferred.promise();
    }
};
function logInMicrosoft() {
     microsoftapi.authorize({
            client_id: '000000004414C775',
            client_secret: 'TbuaTGfehBcy93bBI8AtOmp-N4xVTFYW',
            scope: 'wl.signin'
        }).done(function(data) {
         console.log(JSON.stringify(data))
        everlive.Users.loginWithLiveID(data.access_token,
            function (data) {
                alert(JSON.stringify(data));
                var accessToken = data.result.access_token;
                alert("Successfully logged the user in! Received access token: " + accessToken);
                localStorage.setItem('access-token', accessToken);
                app.navigate("views/home.html","slide");
            },
            function(error){
                alert("everlive"+JSON.stringify(error));
            });
    }).fail(function(data) {
        alert("err"+JSON.stringify(data));
    });
}
