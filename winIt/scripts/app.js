 var app;
(function () {

    // store a reference to the application object that will be created
    // later on so that we can use it if need be
   
    
    // create an object to store the models for each view
    window.APP = {
      models: {
        home: {
          title: 'DashBoard'
        },
        settings: {
          title: 'Settings'
        },
        scoreCard:{
           title: 'ScoreCard' 
        },
        start:{
           title: 'Start',
           ds: new kendo.data.DataSource({
            data: [{ }]
          })
         
        },
        contacts: {
          title: 'Contacts',
          ds: new kendo.data.DataSource({
            data: [{ }]
          }),
          alert: function(e) {
          
          }
        }
      }
    };

    // this function is called by Cordova when the application is loaded by the device
    document.addEventListener('deviceready', function () {  
      
      // hide the splash screen as soon as the app is ready. otherwise
      // Cordova will wait 5 very long seconds to do it for you.
      navigator.splashscreen.hide();

      app = new kendo.mobile.Application(document.body, {
      
        // comment out the following line to get a UI which matches the look
        // and feel of the operating system
        skin: 'flat',

        // the application needs to know which view to load first
        initial: 'views/registration.html'
      });

    }, false);



   
}());