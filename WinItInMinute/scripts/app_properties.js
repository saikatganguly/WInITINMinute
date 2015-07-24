var homeImageId = null;
var defaultImageString = null;
function getAppProperties(){
    
   /* if(kendo.support.mobileOS.wp){
        $('.splash_logo').css('height','190px');
    }*/
     registerDeviceForPushNotification();
    var data = everlive.data('app_properties')
    data.get()
    .then(function(data){
        console.log("APP PROPERTIES****************"+data.homeImageId);
        homeImageId = data.result[0].homeImageId;
        defaultImageString = data.result[0].defaultPicBase64;
        isLoggedIn();
        app.pane.loader.hide();
    },
    function(error){
        alert(JSON.stringify(error));
    });
}

function registerDeviceForPushNotification(){
      //This code is to register device for push notification
        var pushSettings = {
    iOS: {
        badge: true,
        sound: true,
        alert: true,
        clearBadge: true
    },
    android: {
        projectNumber: '518343520190'
    },
    wp8: {
        channelName: 'EverlivePushChannel'
    },
    notificationCallbackIOS: function(e) {
        // logic for handling push in iOS
    },
    notificationCallbackAndroid: function(e) {
        // logic for handling push in Android
    },
    notificationCallbackWP8: function(e) {
        // logic for handling push in Windows Phone
    }
};
    
    everlive.push.register(
    pushSettings, 
    function successCallback(data) {
        // This function will be called once the device is successfully registered
        alert("Registered");
    },
    function errorCallback(error) {
        // This callback will be called any errors occurred during the device
        // registration process
        alert("Error registering");
    }
);
        //End of push notification code
}
