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