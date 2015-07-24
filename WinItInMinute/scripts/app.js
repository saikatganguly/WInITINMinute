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
var initialScreenHeight = window.innerHeight; 
//var initialScreenWidth = window.innerWidth; 
console.log("initialScreenHeight   "+initialScreenHeight);
//console.log("initialScreenWidth   "+initialScreenWidth);
(function (global) {
 
    var APPFEEDBACK_API_KEY = 'ea35ad70-f2bb-11e4-83ad-a764fd037f71';
    
    // this function is called by Cordova when the application is loaded by the device
    document.addEventListener('deviceready', function () {  
       navigator.splashscreen.hide();
        var feedbackOptions = {
    			enableShake: true
        };
        try {
            console.log("feedback");
            window.analytics.Start();
    		feedback.initialize(APPFEEDBACK_API_KEY, feedbackOptions);
    	}
    	catch(err) {
    		console.log('Something went wrong:');
    		console.log(err);
    	}
     
      //  getAppProperties();
        
      // hide the splash screen as soon as the app is ready. otherwise
      // Cordova will wait 5 very long seconds to do it for you.
        
          //  setTimeout(function() {
                
         //   }, 4000);

      app = new kendo.mobile.Application(document.body, {
        // comment out the following line to get a UI which matches the look
        // and feel of the operating system
        skin: 'flat',
        // the application needs to know which view to load first
        initial: 'views/splash.html'
      });
        document.addEventListener("backbutton", onBackButton, true);
        document.addEventListener("hidekeyboard", function(){ 
            //keyboard is OFF
              if(app.view().id === 'views/my_profile.html'){
                  $('.km-scroll-container').attr('style','-webkit-transform-origin: 0% 0%');
              }else{
                   $('.km-scroll-container').attr('style','-webkit-transform:translate3d(0px, 0px, 0px) scale(1)');
              }
                 
        }, false);
         window.app.log = console.log;
    }, false);
})(window);

function sendFeedback() {
    feedback.showFeedback();
};

function beforeShow(beforeShowEvt) {
   // alert('beforeShow');
    var trialFlag = localStorage.getItem('trialFlag');
  
    if(trialFlag === 'true' || isWindowOpen || app.view().id === "views/splash.html" || app.view().id === "views/login.html" || app.view().id === "views/registration.html") {
        beforeShowEvt.preventDefault();
        console.log("isWindowOpen  "+isWindowOpen);
    }
    else{
        $('#appDrawer').addClass('drawer-overlay');
        $('#appDrawer').css('margin-top', $('.km-view-title').css('line-height'));
        //$('#appDrawer').css('display','inline-block');
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
          
            /* if(isWindowOpen){
                 $('#quiz').css('opacity', '0.5');
             }*/
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
$(document).on("click", "a", function (e) {
    if($(this).attr('data-role') === 'button'){
        kendo.fx(this).zoom("in").endValue(1).startValue(0.9).play();
    }
    
});
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
    console.log("isQuizVisited  "+isQuizVisited);
    if(isQuizVisited){
          console.log(app.view().id+" inside if ");
          clearInterval(window['timer_MS' + 'ms_timer']);
        /* if(!(app.view().id === "views/quiz.html")){
              console.log(app.view().id+" before hidebanner");
             hideBanner();
         }*/
    }
}
function hideBanner() {
   // var viewId = app.view().id.split('/')[1].split('.')[0];
     console.log("hideBanner**************");
      if (!this.checkSimulator()) {
	       window.plugins.AdMob.destroyBannerView();
          /*if (kendo.support.mobileOS.wp){
               $('#appDrawer').css('margin-top', '60px');
          }*/
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
                     if(!($('.check-modalview').hasClass('check-modalview'))) {
                          confirmExit();
                         backButtonFlag = true;
                     }
                     //stopTimer();
                     
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
    console.log("confirmExit ");
    stopTimer();
    
     exitWindow = 
        $("#confirmExitWindow").kendoWindow({
            title: "Confirm Exit",
            width: "250px",
            height: "100px",
            draggable: false,
            modal: true,
            close: function(e){
                //alert("close");
                 /* $('#quiz').css('opacity', '1');
                  $('#quiz').prop('disabled', false);
                  $('#appDrawer').prop('disabled', false);
                  $('a#drawerBtn').attr('href', '#appDrawer');
                  $('a#drawerBtn').attr('data-enable', 'true');
                    for(var i=0; i<4; i++){
                         $("#option_"+i).prop('disabled', false);
                    }*/ 
                
                  isWindowOpen = false;
                  //$('.check-div').remove();  
                  if(confirmFlag){
                        //setTimeout(function(){
                              stopTimer();
                              hideBanner();
                        //}, 800);
                        if(backButtonFlag){
                             app.navigate("views/home.html","slide"); 
                            kendo.fx($("#home")).slideIn("right").duration(500).play();
                             $('#home').css('opacity', '1');
                             backButtonFlag = false;
                        }else{
                            if(globalLinkId === 'logout'){
                                 logout();
                            }else{
                                 app.navigate(globalLinkId,"slide"); 
                                var viewId = globalLinkId.split('/')[1].split('.')[0];
                                kendo.fx($('#'+viewId)).slideIn("left").duration(500).play();
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
   /* if(!($('.check-div').hasClass('check-div'))) {
       $('<div class="k-overlay check-div" style="z-index: 10002; opacity: 0.5;"></div>').insertBefore('.k-window');
    }*/
    
   /* $('#quiz').prop('disabled', true);
    $('#appDrawer').prop('disabled', true);
    $('a#drawerBtn').removeAttr('href');
    for(var i=0; i<4; i++){
         $("#option_"+i).prop('disabled', true);
    }*/
    isWindowOpen = true;
}
function confirm(viewId){
    console.log("confirmed  "+viewId);
    confirmFlag = true;
    exitWindow.close();
}
function cancelled(viewId){
      console.log("cancelled  "+viewId);
      confirmFlag = false;
      exitWindow.close();
}
function confirmation(linkId){
    
    globalLinkId = linkId;
    if(app.view().id === "views/quiz.html"){
         $("#appDrawer").data("kendoMobileDrawer").hide();
         setTimeout(function(){
            confirmExit();
         },400);
    }
    else{
        console.log("linkId********************"+linkId);
        $('#quiz').hide('fast');
         if(linkId === 'logout'){
             logout();
        }else{
             $("#appDrawer").data("kendoMobileDrawer").hide();
           if(app.view().id === "views/LeaderBoard.html" || app.view().id === "views/my_profile.html"){
               console.log(app.view().id);
              // $('#LeaderBoard').show();
               app.pane.loader.hide();  
              //  $('#LeaderBoard').hide();
           }
            setTimeout(function(){
                app.navigate(linkId,"slide"); 
            },400);
           
        }
    }
}

var globalLinkId = null;
var backButtonFlag = false;
var isWindowOpen = false;
var confirmFlag = false;
function createLoader(){
     $('.km-loading').remove();
    $('.km-loading-left').remove();
    $('.km-loading-right').remove();
  
   // $('.km-loader').html('<img src="images/loader.gif">');
}
/*$('.k-window-action').click(function() {
    alert("close  "+app.view().id);
    cancelled(app.view().id);
});*/