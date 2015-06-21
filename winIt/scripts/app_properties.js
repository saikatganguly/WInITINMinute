var homeImageId = null;
var defaultProfileImageId = null;
function getAppProperties(){
    if(kendo.support.mobileOS.wp){
        $('.splash_logo').css('height','190px');
    }
    var data = everlive.data('app_properties')
    data.get()
    .then(function(data){
        console.log("APP PROPERTIES****************"+JSON.stringify(data));
        homeImageId = data.result[0].homeImageId;
        defaultProfileImageId = data.result[0].defaultPicId;
       getHomeImage();
    },
    function(error){
        alert(JSON.stringify(error));
    });
}