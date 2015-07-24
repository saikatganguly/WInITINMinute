var everlive;
var userId;

$(document).ready(function(){
     console.log("access-token************"+localStorage.getItem('access-token'));
     everlive = new Everlive({
        apiKey: "elKw1nKoaJB4RIJ8",
        scheme: "https",
        token: localStorage.getItem('access-token')
    });
    if (localStorage.getItem("trialFlag") === null) {
        localStorage.setItem('trialFlag', false);
    }
    if (localStorage.getItem("quizCount") === null) {
        localStorage.setItem('quizCount', 0);
    }
    /*if (localStorage.getItem("trialPoints") === null) {
        var trialPoints = 0;
        localStorage.setItem('trialPoints', trialPoints);
    }*/
    
});

function changeUI(){
    console.log("changeUI**************");
    createLoader();
    if (kendo.support.mobileOS.android) {
       // $('.logo').css('height','165px');
       // $('.option').css('height','50px');
       // $('.login-icon').css('height','27px');
       // $('.password-icon').css('height','31px');
    }
     if (kendo.support.mobileOS.wp) {
        $('.textbox').css('font-size','25px');
       /* $('.logo').css('height','165px');
        $('.logo').css('margin','10% 0  0 36%');*/
        $('.error').css('height','60px');
        $('.loginContent').css('margin-top','3%');
        $('.option').css('height','75px');
        $('.feild').css('margin-left','16%');
        $('.feild').css('height','50px');
        $('#acceptButton').css('height','55px');
        $('#acceptButton').css('margin-top','6%');
        $('#signup_btn_for_login').css('height','55px');
        $('#fb_btn').css('height','90px');
        $('#fb_btn').css('width','20%');
        $('#twitter_btn').css('height','90px');
        $('#twitter_btn').css('width','20%');
        $('#google_btn').css('height','90px');
        $('#google_btn').css('width','20%');
        $('#microsoft_btn').css('height','90px');
        $('#microsoft_btn').css('width','20%');
        $('#password').css('padding-top','10px');
         
    }
}
function show(){
       $("#header").show("fast");
}
function hide(){
       $("#header").hide("fast");
}
function removeLoginMessage(){
    console.log("removeLoginMessage***********");
    $("#errLoginMsg").text("");
}
function login(fromRegistration){
    $('#acceptButton').fadeTo(100, 0.1).fadeTo(200, 1.0);
    console.log("inside login fromRegistration***********  "+fromRegistration);
      
    var username;
    var password;
    var validator;
        if(fromRegistration){
            username  =  $("#registration_name").val();
            password  =  $("#registration_pwd").val();
            validator = $("#registerForm").kendoValidator().data("kendoValidator");  
        }else{
            
            username = $("#userName").val();
            password = $("#password").val();
            validator = $("#loginForm").kendoValidator().data("kendoValidator"); 
        }
    
         if (validator.validate()) {
              
                console.log("username*****"+username+"  password*****"+password);
                everlive.Users.login(username, password, function(data) {
                    console.log("login success************* " +JSON.stringify(data));
                    var accessToken = data.result.access_token;
                    console.log("Successfully logged the user in! Received access token: " + accessToken);
                    localStorage.setItem('access-token', accessToken);
                    localStorage.setItem('userId',data.result.principal_id);
                    console.log("login userId*********** "+userId);
                    localStorage.setItem('userName' , username);
                    localStorage.setItem('trialFlag', 'false');
                    localStorage.removeItem('trialPoints');
                    app.navigate("views/home.html","slide");
                }, 
                function(error) {
                    console.log("login error************* " +JSON.stringify(error));
                    console.log(error.message);
                    $("#errLoginMsg").text("Invalid Username or Password!");
                    // $("#userName").val("");
                    $("#password").val("");
                });
         } 
}
function logout(){
        console.log("Logout!");
        everlive.Users.logout(function() {
            console.log("Logout successful!");
            console.log("userId  "+userId);
            localStorage.removeItem('access-token');
            localStorage.removeItem('userId');
            $("#appDrawer").data("kendoMobileDrawer").hide();   
            setTimeout(function(){
                 app.navigate("views/login.html","slide");  
            },400);
            $("#userName").val("");
            $("#password").val("");
        }, 
        function(error) {
            console.log("Failed to logout************"+JSON.stringify(error));
        });
}
function isLoggedIn(){
    console.log("isLoggedIn!");
    if(homeImageId !== null){
       getLocation();
       everlive.Users.currentUser(function(data) {
            if (data.result) {
                console.log("isLoggedIn success**********"+data.result.Id);
                app.pane.loader.hide();
                var username = data.result.Username;
                 app.navigate("views/home.html","slide");
                localStorage.setItem('userId',data.result.Id);
                localStorage.setItem('userName' , username);
                //localStorage.setItem('displayName' , data.result.Name);
               //  getHomeImage();
                console.log(username + " is logged in!");
                $("#userName").val("");
                $("#password").val("");
            } else {
                console.log("Missing access token. Please login!");
                app.navigate("views/login.html","slide");
            }
       }, function(error) {
            console.log(error.message + " Please login.");
            app.navigate("views/login.html","slide");
       });
    }
}
function sign_up(){
    console.log("navigate to sign_up**********");
    $('#signup_btn_for_login').fadeTo(100, 0.1).fadeTo(200, 1.0);
    app.navigate('views/registration.html', 'slide');
}

function faceBookLogin(){
    console.log("faceBookLogin**********");
    $('#fb_btn').fadeTo(100, 0.1).fadeTo(200, 1.0);
    facebookConnectPlugin.login(["email", "user_friends"], function(response) { 
            if (response) {
                 // contains the 'status' - bool, 'authResponse' - object with 'session_key', 'accessToken', 'expiresIn', 'userID'
                 console.log("You are: " + response.authResponse.accessToken);
                 var accessToken = response.authResponse.accessToken;
                 everlive.Users.loginWithFacebook(accessToken,
                    function (data) {
                            console.log(JSON.stringify(data));
                            var accessToken = data.result.access_token;
                            console.log("Successfully logged the user in! Received access token: " + accessToken);
                            alert("Successfully logged the user in!");
                            localStorage.setItem('access-token', accessToken);
                            loginFromSocial = true;
                            app.navigate("views/home.html","slide");
                    },
                    function(error){
                         console.log("faceBookLogin error*********** "+JSON.stringify(error));
                    });
            } else {
                 console.log("You are not logged in");
            }
    });
}

function trialAccess(){
    var userName = 'Trial User';
    var password = 'trai1234';
    
    everlive.Users.login(userName, password, 
        function(data) {
             console.log("trail login success************* " +JSON.stringify(data));
             localStorage.setItem('trialFlag', 'true');
             localStorage.setItem('access-token', data.result.access_token);
             localStorage.setItem('userId',data.result.principal_id);
             app.navigate("views/home.html","slide");
        }, 
        function(error) {
             console.log("login error************* " +JSON.stringify(error));
             console.log(error.message);
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
     $('#twitter_btn').fadeTo(100, 0.1).fadeTo(200, 1.0);
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
/*var googleapi = {
    authorize: function(options,appBrowser) {
        var deferred = $.Deferred();
        var authUrl = 'https://accounts.google.com/o/oauth2/auth?' + $.param({
            client_id: options.client_id,
            redirect_uri: options.redirect_uri,
            response_type: 'code',
            scope: options.scope
        });
    
       // appBrowser = window.open(authUrl, '_blank', 'location=no,toolbar=no');
       setTimeout(function(){
           appBrowser = window.open(authUrl, '_blank', 'location=no,toolbar=no');
       },500);
        $(appBrowser).on('loadstart', function(e) {
            var url = e.originalEvent.url;
            var code = /\?code=(.+)$/.exec(url);
            var error = /\?error=(.+)$/.exec(url);
            console.log(""+url);
            if (code || error) {
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
                   // alert("successful login");
                    deferred.resolve(data);
                }).fail(function(response) {
                    //alert("failed login");
                    deferred.reject(response.responseJSON);
                });
            } else if (error) {
                //The user denied access to the app
                 // alert("error to login");
                deferred.reject({
                    error: error[1]
                });
            }
        });
        return deferred.promise();
    }
};

function logInGoogle() {
    alert("logInGoogle");
    $('#google_btn').fadeTo(100, 0.1).fadeTo(200, 1.0);
    var appBrowser;
    googleapi.authorize({
        client_id: '400469019178-s6ess817q9lb22l5jmrf9o8bjqr9vmol.apps.googleusercontent.com',
        client_secret: '2unax4_pBRkw6GdzauRDB-M4',
        redirect_uri: 'http://localhost',
        scope: 'https://www.googleapis.com/auth/plus.me'
    },appBrowser).done(function(data) {
        alert(JSON.stringify(data));
        // alert("in google api");
        everlive.Users.loginWithGoogle(data.access_token,
            function (data) {
                //alert("login success");
                alert(JSON.stringify(data));
                var accessToken = data.result.access_token;
                alert("Successfully logged the user in! Received access token: " + accessToken);
                localStorage.setItem('access-token', accessToken);
                app.navigate("views/home.html","slide");
            },
            function(error){
                // alert("login error");
                alert("everlive"+JSON.stringify(error));
            });
    }).fail(function(data) {
        // alert("login failed");
        alert("err"+JSON.stringify(data));
    });
}*/
/*********************************Microsoft Login************************************/
/*var microsoftapi = {
    authorize: function(options) {
        var deferred = $.Deferred();
        var authWindow; 
        //Build the OAuth consent page URL
        var authUrl = 'https://login.live.com/oauth20_authorize.srf?client_id='+ options.client_id+'&response_type=token&scope='+options.scope;
        console.log(authUrl);
        setTimeout(function(){
                  authWindow=window.open(authUrl, '_blank', 'location=no,toolbar=no');
                },500);
             
        // window.open(authUrl, '_blank', 'location=no,toolbar=no');

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
     $('#microsoft_icon_height').fadeTo(150, 0.1).fadeTo(200, 1.0);
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
                //alert("Successfully logged the user in! Received access token: " + accessToken);
                localStorage.setItem('access-token', accessToken);
                app.navigate("views/home.html","slide");
            },
            function(error){
                alert("everlive"+JSON.stringify(error));
            });
    }).fail(function(data) {
        alert("err"+JSON.stringify(data));
    });
}*/
