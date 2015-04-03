var everlive = new Everlive({
    apiKey: "KGCVGkuoa3Zw0Auj",
    scheme: "https",
    token: localStorage.getItem('access-token')
});

function login(){
                alert("Checking alert in login");
                var username = $("#userName").val();
                var password = $("#password").val();
                alert(username+"  "+password);
                everlive.Users.login(username, password, function(data) {
                    var accessToken = data.result.access_token;
                    alert("Successfully logged the user in! Received access token: " + accessToken);
                    localStorage.setItem('access-token', accessToken);
                   app.navigate("views/home.html","slide"); 
                }, function(err) {
                    alert("Unfortunately an error occurred: " + err.message);
                    
            });
}

function logout(){
            everlive.Users.logout(function() {
            alert("Logout successful!");
            localStorage.getItem('access-token');
        }, function(err) {
            alert("Failed to logout: " + err.message);
        });
}

function isLoggedIn(){
            everlive.Users.currentUser(function(data) {
            if (data.result) {
                var username = data.result.Username;
                alert(username + " is logged in!");
            } else {
                alert("Missing access token. Please login!");
            }
        }, function(err) {
            alert(err.message + " Please login.");
        });
}