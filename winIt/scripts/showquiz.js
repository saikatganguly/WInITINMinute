var data={}; 
var questionTemplate = null;
var selected = null;
var interval = null;
var previousId = null;
var user= {
        questionIndex:0,
        score:0
};
var minutes=1;
var seconds=0;
function initQuiz(){
    $.ajax({
        url: "https://platform.telerik.com/bs-api/v1/KGCVGkuoa3Zw0Auj/Functions/get_questionservice",
        type: "GET",
        datatype: "json",
        headers: {
            "Authorization" : localStorage.getItem('access-token'),
        },
        contentType: "application/json",
        accept: "application/json",
        success: function(result){
            data.questions = result;
             if(user.questionIndex<=4){
                changeQuection(user.questionIndex);
             }
             $('#ms_timer').countdowntimer({
                  minutes :minutes,
                  seconds :seconds,
                  size : "lg",
                  timeSeparator : ".",
                  timeUp : timeisUp
            });
            isQuizVisited = true;
             addAdsBannerAtBottom();
        },
        error: function(error){
            alert(JSON.stringify(error));
        }
    });
   // alert(app.view().id);
      
}
function restart(){
    console.log("restart**************");
     clearInterval(interval);
    user.questionIndex=0;
    user.score=0;
    app.navigate("views/quiz.html","slide"); 
    initQuiz();
    $("#quiz_result").empty();  
    $("#user_score").empty(); 
}
function next(){
    //alert("next**************");
   /* if(data.questions[user.questionIndex].answer == selected) {
       alert(""+user.score++);
     }  */
    if(user.questionIndex>3){
       timeisUp();
       //displayStatus();
        
    }
      user.questionIndex++;
      changeQuection(user.questionIndex);  
}
function activitiesChanged(id){
      var answerId = null;
     selected = $("#"+id).val().trim();
        var tabId = id.split("_").pop();
     if(previousId!==null){
         previousId.css('background','#E0DEDF');
     }
  
     if(data.questions[user.questionIndex].answer.trim() === selected) {
         user.score++;
         $('#optionList_'+tabId).css('background','#E0DEDF');
         $('#answerId').css('background','#E0DEDF');
       //  alert(interval);
             clearInterval(interval);
         next();
     } 
    else{
       previousId = $('#optionList_'+tabId).css('background','#E55849');
        for(var i=0; i<=3; i++){
            if(data.questions[user.questionIndex].options[i].trim() === data.questions[user.questionIndex].answer.trim()){
                 'optionList_'+tabId;
                $('#optionList_'+i).css('background','#37DD52');
                answerId = 'optionList_'+i;
            }
        }
        clearInterval(interval);
         interval = setInterval(function(){blink(answerId)}, 1000);
    }
}          
function blink(id) {
     $("#"+id).fadeTo(100, 0.1).fadeTo(200, 1.0);
}
function timeisUp() {
    console.log("Times up**************");
    displayStatus();
}

function displayStatus(){
     if(user.score===5){
         // alert("score win  "+user.score);
          $("#quiz_result").text("congrates you have won the game");    
          $("#user_score").text(user.score);  
          redirectToScoreBoard();
     }
     else{
         $("#user_score").text(user.score);  
         $("#quiz_result").text("you have lost thae game"); 
         redirectToScoreBoard();
     }    
}
function redirectToScoreBoard(){
    console.log("redirectToScoreBoard**************");
    app.navigate("views/scoreCard.html","slide");
    hideBanner();
}
function changeQuection(index){
        //alert("question index "+index);
    //    alert("question "+JSON.stringify(data.questions));
        questionTemplate = kendo.template($("#temp").html(), {useWithBlock:true});
        $("#results").html(questionTemplate(data.questions[index]));  
}
function addRightItem(){   
    //restart();
    if(app.view().id === "views/quiz.html"){
     var country = localStorage.getItem('country');
     var city = localStorage.getItem('city');
    $("#navbar #right_item").append(city+','+country);
    }
    else{
        $("#navbar #right_item").text("");
    }
}

function addAdsBannerAtBottom(){
    
     var ad_units = {
          ios : {
            banner: 'ca-app-pub-7748174862052689/8033820856',
          },
          android : {
            banner: 'ca-app-pub-7748174862052689/6975890055',
          },
          wp8 : {
            banner: 'ca-app-pub-7748174862052689/1987287250',
          }
    };

    var adMobKeys;
    if (/(android)/i.test(navigator.userAgent)) {
      adMobKeys = ad_units.android;
    } else if (/(iphone|ipad)/i.test(navigator.userAgent)) {
      adMobKeys = ad_units.ios;
    } else {
      adMobKeys = ad_units.wp8;
    }
    
    if (!checkSimulator()) {
       
         window.plugins.AdMob.createBannerView(
                // createBannerView params
                {
                  'publisherId': adMobKeys.banner,
                  'adSize': window.plugins.AdMob.AD_SIZE.SMART_BANNER,
                  'bannerAtTop':false,
                  'overlap': false, // true doesn't push the webcontent away
                  'offsetTopBar': true // set to true if you want it below the iOS >= 7 statusbar
                },
                // createBannerView success callback
                function() {
                  window.plugins.AdMob.requestAd(
                      // requestAd params
                      {
                        'isTesting': false
                      },
                      // requestAd success callback
                      function(){
                        window.plugins.AdMob.showAd(
                            // showAd params
                            true,
                            // showAd success callback
                            function() {console.log('show ok')},
                            // showAd error callback
                            function() { alert('failed to show ad')});
                      },
                      // requestAd error callback
                      function(){ alert('failed to request ad'); }
                  );
                },
                // createBannerView error callback
                function(){ alert('failed to create banner view'); }
		      );
    }

}
function checkSimulator() {
       if (window.navigator.simulator === true) {
            alert('This plugin is not available in the simulator.');
            return true;
       } else if (window.plugins === undefined || window.plugins.AdMob === undefined) {
            alert('Plugin not found. Maybe you are running in AppBuilder Companion app which currently does not support this plugin.');
            return true;
       } else {
            return false;
       }
}   
initQuiz();
