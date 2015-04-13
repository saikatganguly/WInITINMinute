var everlive = new Everlive({
    apiKey: "KGCVGkuoa3Zw0Auj",
    scheme: "https",
    token: localStorage.getItem('access-token')
});
function changeUI(){
    if (kendo.support.mobileOS.android) {
        /*alert(kendo.support.mobileOS);*/
      //  $('#logo').css('height','150px');
        $('.option').css('height','50px');
        $('.login-icon').css('height','33px');
         $('.loginContent').css('margin-top','-6%');
    //    $('.password-icon').css('height','37px');
    }
}
function beforeShow(beforeShowEvt) {
    if(app.view().id == "views/login.html") {
         $("#header").hide("fast");
         beforeShowEvt.preventDefault();
         $("#drawerBtn").hide("fast");
         $("#appDrawer").hide("fast");
    }
}
function show(){
 //   alert("show");
       $("#header").show("fast");
}
function hide(){
       //alert("hide");
       $("#header").hide("fast");
}
function login(){
    var validator = $("#loginForm").kendoValidator().data("kendoValidator");
                alert("Checking alert in login");
                var username = $("#userName").val();
                var password = $("#password").val();
         if (validator.validate()) {
                    alert(username+"  "+password);
                    everlive.Users.login(username, password, function(data) {
                    var accessToken = data.result.access_token;
                    alert("Successfully logged the user in! Received access token: " + accessToken);
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
            alert("Logout successful!");
            localStorage.getItem('access-token');
            app.navigate("views/login.html","slide");    
          //  hide();
        }, function(err) {
            alert("Failed to logout: " + err.message);
        });
}
function isLoggedIn(){
       everlive.Users.currentUser(function(data) {
            if (data.result) {
                var username = data.result.Username;
                 app.navigate("views/home.html","slide");
                alert(username + " is logged in!");
                $("#userName").val("");
                $("#password").val("");
            } else {
                alert("Missing access token. Please login!");
                  app.navigate("views/login.html","slide");
            }
       }, function(err) {
            alert(err.message + " Please login.");
            app.navigate("views/login.html","slide");
       });
}