var everlive = new Everlive({
    apiKey: "KGCVGkuoa3Zw0Auj",
    scheme: "https"
});
function changeUI(){
    if (kendo.support.mobileOS.android) {
        /*alert(kendo.support.mobileOS);*/
      //  $('#logo').css('height','150px');
        $('.option').css('height','50px');
        $('.login-icon').css('height','27px');
    //     $('.loginContent').css('margin-top','-6%');
        $('.password-icon').css('height','31px');
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
