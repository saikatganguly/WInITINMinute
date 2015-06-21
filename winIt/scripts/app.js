var isQuizVisited = false; 
var slideFromLogin = false;
var loginFromSocial = false;
var exitWindow;
var min;
var sec;
var app;
var city;
var country;
var IsStarted;
(function (global) {
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
    var APPFEEDBACK_API_KEY = 'ea35ad70-f2bb-11e4-83ad-a764fd037f71';
    
    // this function is called by Cordova when the application is loaded by the device
    document.addEventListener('deviceready', function () {  
        
        var feedbackOptions = {
    			enableShake: true
        };
        try {
            console.log("feedback");
           window.analytics.Start();
            //window.monitor.TrackFeature();
         
            
 
            
    		feedback.initialize(APPFEEDBACK_API_KEY, feedbackOptions);
    	}
    	catch(err) {
    		console.log('Something went wrong:');
    		console.log(err);
    	}
        
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
})(window);
function sendFeedback() {
   // alert("sendfeedback");
    feedback.showFeedback();
};

function beforeShow(beforeShowEvt) {
   // alert('beforeShow');
    if(isWindowOpen || app.view().id === "views/splash.html" || app.view().id === "views/login.html" || app.view().id === "views/registration.html") {
        beforeShowEvt.preventDefault();
        console.log("isWindowOpen  "+isWindowOpen);
    }
    else{
        $('#appDrawer').addClass('k-overlay');
        kendo.fx($("#appDrawer")).slideIn("right").duration(500).play();
        /* if(app.view().id === "views/quiz.html"  && isQuizVisited === true){
            //alert("isQuizVisited  "+isQuizVisited);
                stopTimer();
        }*/
    }
}
function onHide(){
      //alert("onHide");
     var viewId = app.view().id.split('/')[1].split('.')[0];
     setTimeout(function(){
         if (kendo.support.mobileOS.wp) {
               $('#'+viewId).attr('style','transform :translate3d(0px, 0px, 0px) scale(1) !important;');
         }else{
               $('#'+viewId).attr('style','-webkit-transform :translate3d(0px, 0px, 0px) scale(1) !important;');
         }
     },500);
     kendo.fx($("#appDrawer")).slideIn("right").duration(500).reverse();
   /* if(app.view().id === "views/quiz.html" && isQuizVisited === true){
        //alert("isQuizVisited  "+isQuizVisited);
        var value = $("#ms_timer").html();
        min = value.substring(0,2);
         sec = value.substring(3,5);
            startTimer(min,sec);
    }*/
}
function startTimer(min,sec){
        $('#ms_timer').countdowntimer({
         minutes :min,
         seconds :sec,
         size : "lg",
         timeSeparator : ".",
         timeUp : timeisUp
         });
}
function stopTimer() {
    
    if(isQuizVisited === true){
          console.log(app.view().id+" inside if ");
          clearInterval(window['timer_MS' + 'ms_timer']);
        /* if(!(app.view().id === "views/quiz.html")){
              console.log(app.view().id+" before hidebanner");
             hideBanner();
         }*/
    }
}
 var initialScreenHeight = window.innerHeight; 
 var initialScreenWidth = window.innerWidth; 
alert("hidebanner initialScreenSize   "+initialScreenSize);
function hideBanner() {
   // var viewId = app.view().id.split('/')[1].split('.')[0];
     console.log("hideBanner**************");
      if (!this.checkSimulator()) {
          //alert("hideBanner");
	       window.plugins.AdMob.destroyBannerView();
        setTimeout(function(){
             if(window.innerHeight < initialScreenHeight){
              
                   alert("hidebanner  window.innerHeight"+window.innerHeight);
              window.resizeTo(initialScreenWidth,initialScreenHeight);
                //$('#home').attr('style','height:'+ initialScreenSize+'px !important');
                 //  $(document.body).height(initialScreenSize);
              
             } 
         }, 600);
          
          
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
                      confirmExit();
                      //stopTimer();
                     backButtonFlag = true;
                     break;
                }
                default:{
                    app.navigate("views/home.html","slide"); 
                    break;
                }
                 /*case "views/LeaderBoard.html":{
                    app.navigate("views/home.html","slide"); 
                    break;
                }
                case "views/settings.html":{
                     app.navigate("views/home.html","slide"); 
                    break;
                }*/
       }
}
function confirmExit(){
    $("#appDrawer").data("kendoMobileDrawer").hide();
    stopTimer();
     //alert("confirmExit  ");
        exitWindow = $("#confirmExitWindow").kendoWindow({
            title: "Confirm Exit",
            visible: false,
            width: "250px",
            height: "100px",
            draggable: false,
            close: function(e){
                //alert("close");
                  $('#quiz').css('opacity', '1');
                  $('#quiz').prop('disabled', false);
                  $('#appDrawer').prop('disabled', false);
                  $('a#drawerBtn').attr('href', '#appDrawer');
                  $('a#drawerBtn').attr('data-enable', 'true');
                for(var i=0; i<4; i++){
                     $("#option_"+i).prop('disabled', false);
                }
                  isWindowOpen = false;
                    
                  if(confirmFlag){
                        setTimeout(function(){
                              stopTimer();
                              hideBanner();
                        }, 800);
                        if(backButtonFlag){
                             app.navigate("views/home.html","slide"); 
                        }else{
                            if(globalLinkId === 'logout'){
                                 logout();
                            }else{
                                 app.navigate(globalLinkId,"slide"); 
                            }
                        }
                      confirmFlag = false;
                  }else{
                       var value = $("#ms_timer").html();
                       min = value.substring(0,2);
                       sec = value.substring(3,5);
                       startTimer(min,sec);
                  }
            }
         }).data("kendoWindow");
    if(kendo.support.mobileOS.wp){
        // alert("confirmExit  in if");
         exitWindow.wrapper.css({
            width: 300,
            height: 150
        });
    }
    exitWindow.center().open();
    setTimeout(function(){
        $('#quiz').css('opacity', '0.5');
    }, 600);
    
    $('#quiz').prop('disabled', true);
    $('#appDrawer').prop('disabled', true);
    $('a#drawerBtn').removeAttr('href');
    for(var i=0; i<4; i++){
         $("#option_"+i).prop('disabled', true);
    }
    isWindowOpen = true;
}
function confirm(viewId){
   // alert("confirmed  "+viewId);
    confirmFlag = true;
    exitWindow.close();
    /*$('#quiz').css('opacity', '1');
    $('#quiz').prop('disabled', false);
    $('#appDrawer').prop('disabled', false);
    $('a#drawerBtn').attr('href', '#appDrawer');
    $('a#drawerBtn').attr('data-enable', 'true');
    isWindowOpen = false;
    setTimeout(function(){
          stopTimer();
          hideBanner();
    }, 800);
    if(backButtonFlag){
         app.navigate("views/home.html","slide"); 
    }else{
        if(globalLinkId === 'logout'){
             logout();
        }else{
             app.navigate(globalLinkId,"slide"); 
        }
    }*/
}
function cancelled(viewId){
      // alert("cancelled  "+viewId);
      confirmFlag = false;
      /*$('#quiz').css('opacity', '1');
      $('#quiz').prop('disabled', false);
      $('#appDrawer').prop('disabled', false);
      $('a#drawerBtn').attr('href', '#appDrawer');
      $('a#drawerBtn').attr('data-enable', 'true');
      isWindowOpen = false;
    
      var value = $("#ms_timer").html();
      min = value.substring(0,2);
      sec = value.substring(3,5);
      startTimer(min,sec);*/
      exitWindow.close();
}
function confirmation(linkId){
    globalLinkId = linkId;
    if(app.view().id === "views/quiz.html"){
        confirmExit();
    }
    else{
        console.log("linkId********************"+linkId);
        $('#quiz').hide('fast');
         if(linkId === 'logout'){
             logout();
        }else{
           
            app.navigate(linkId,"slide"); 
        }
    }
}
var globalLinkId = null;
var backButtonFlag = false;
var isWindowOpen = false;
var confirmFlag = false;
/*$('.k-window-action').click(function() {
    alert("close  "+app.view().id);
    cancelled(app.view().id);
});*/