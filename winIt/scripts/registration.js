var everlive = new Everlive({
    apiKey: "KGCVGkuoa3Zw0Auj",
    scheme: "https"
});


function register(){
    var username = $("#email").val();
var password = $("#password").val();
var attrs = {
    Email: $("#email").val(),
    Name: $("#name").val()
};
    alert(username +"===="+password);
    everlive.Users.register(username,
    password,
    attrs,
    function(data) {
        alert(JSON.stringify(data));
    },
    function(error) {
        alert(JSON.stringify(error));
    });
}
