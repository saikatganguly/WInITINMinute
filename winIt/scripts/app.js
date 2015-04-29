var isQuizVisited = false; 
var exitWindow;
var min;
var sec;
var app;
(function () {
    // store a reference to the application object that will be created
    // later on so that we can use it if need be
    // create an object to store the models for each view
    window.APP = {
      models: {
        home: {
          title: 'DashBoard',
             ds: new kendo.data.DataSource({
            data: [{ }]
          })
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
        initial: 'views/splash.html'
      });
        document.addEventListener("backbutton", onBackButton, true);
    }, false);
    
}());

function startTimer(min,sec){
        $('#ms_timer').countdowntimer({
         minutes :min,
         seconds :sec,
         size : "lg",
         timeSeparator : ".",
         timeUp : timeisUp
         });
}
/*function timeisUp() {
  app.navigate("views/scoreCard.html","slide"); 
}*/
function beforeShow(beforeShowEvt) {
   /* var timer = $('#ms_timer').text();
    alert(timer);*/
  //  $('.km-content.km-widget.km-scroll-wrapper').css('background','#090E11');
    if(app.view().id === "views/splash.html" || app.view().id === "views/login.html" || app.view().id === "views/registration.html") {
         beforeShowEvt.preventDefault();
    }
}
function stopTimer() {
     if(isQuizVisited === true){
          clearInterval(window['timer_MS' + 'ms_timer']);
         if(!(app.view().id === "views/quiz.html"))
             hideBanner();
     }
 }
  
function hideBanner() {
      if (!this.checkSimulator()) {
	       window.plugins.AdMob.destroyBannerView();
     }
}
function onBackButton() {
    var item = app.view().id;
   
        switch (item) {
                case "views/login.html":{
                     navigator.app.exitApp();
                     break;
                 }
                 case "views/registration.html":{
                     navigator.app.exitApp();
                     break;
                 }
                 case "views/home.html":{
                     navigator.app.exitApp();
                     break;
                 }
                 case "views/quiz.html":{
                     stopTimer();
                    confirmExit();
                     break;
                }
                 case "views/scoreCard.html":{
                    app.navigate("views/home.html","slide"); 
                    break;
                }
                case "views/settings.html":{
                    confirmExit();
                    break;
                }
       }

}
function confirmExit(){
     exitWindow = $("#confirmExitWindow").kendoWindow({
            height: "100px",
            title: "Confirm Exit",
            visible: false,
            width: "250px"
        }).data("kendoWindow").center().open();
}
function confirm(viewId){
     exitWindow.close();
     app.navigate("views/home.html","slide"); 
    if(viewId === "views/quiz.html")
        hideBanner();
}
function cancelled(viewId){
    
    if(viewId === "views/quiz.html"){
        var value = $("#ms_timer").html();
        min = value.substring(0,2);
         sec = value.substring(3,5);
            startTimer(min,sec);
    }
    
     exitWindow.close();
}