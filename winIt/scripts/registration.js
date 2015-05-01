var everlive = new Everlive({
    apiKey: "KGCVGkuoa3Zw0Auj",
    scheme: "https"
});
 var country_name;
 var city_name;
/*$( document ).ready(function() {
// geoplugin_countryName();
    alert("Test");
    country_name= geoplugin_countryName();
    city_name=geoplugin_city();
alert(country_name+","+geoplugin_city()); 
    $('#geoLocation').text(city_name+","+country_name);
    localStorage.setItem('country',country_name);
    localStorage.setItem('city',city_name);
});*/
function changeUI(){
    if (kendo.support.mobileOS.android) {
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
function register(){
    var username = $("#email").val();
var password = $("#pwd").val();
var attrs = {
    Email: $("#email").val(),
    Name: $("#name").val(),
    country : country_name,
    location : city_name
};
    //alert(username +"===="+password);
    everlive.Users.register(username,
    password,
    attrs,
    function(data) {
        //alert(JSON.stringify(data));
    },
    function(error) {
       // alert(JSON.stringify(error));
    });
}