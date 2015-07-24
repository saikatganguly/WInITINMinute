var data={}; 
var questionTemplate = null;
var selected = null;
var interval = null;
var previousId = null;
var total_points;
var user= {
        questionIndex:0,
        score:0,
        "points":0
};
var currentUserPoints;
//var totalPoints=0;
var minutes=1;
var seconds=0;
//var points=0;
//parseInt(level_value)
function initQuiz(){
    
    //alert('initquiz');
     getPoints(); 
   
    var customParam = JSON.stringify({
    "filterParam" :{
       'city': 'Indore',
       'country' : 'India' 
    }
    });
    $.ajax({
        url: "https://platform.telerik.com/bs-api/v1/elKw1nKoaJB4RIJ8/Functions/getquestionservice",
        type: "GET",
        datatype: "json",
        headers: {
            "Authorization" : localStorage.getItem('access-token'),
            "X-Everlive-Custom-Parameters" : customParam
        },
        contentType: "application/json",
        accept: "application/json",
        success: function(result){
           // alert("success");
            data.questions = result;
           // changeBeforeQuizUI();
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
        },
        error: function(error){
            alert(JSON.stringify(error));
        }
    });
    
      addAdsBannerAtBottom();
   // alert(app.view().id);
}
function getPoints(){
     //alert("getPoints");
    userId=localStorage.getItem('userId');
    var data1 = everlive.data('Users');
    var points;
    data1.getById(userId).then(function(data){
         //alert(JSON.stringify("Current points "+data.result.points));
        if(data.result.points===null){
            total_points=0;
           // alert(JSON.stringify("Current points "+points));
        }
        else{
        total_points=data.result.points;      
        //alert(JSON.stringify("Current points "+points));
        }
    },
    function(error){
        alert(JSON.stringify(error));
    });
    
} 
function addAdsBannerAtBottom(){
    //alert("addAdsBannerAtBottom")//ios 'ca-app-pub-7748174862052689/8033820856' android 'ca-app-pub-7748174862052689/6975890055' windows  'ca-app-pub-7748174862052689/1987287250';
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
          //  alert('This plugin is not available in the simulator.');
            return true;
       } else if (window.plugins === undefined || window.plugins.AdMob === undefined) {
           // alert('Plugin not found. Maybe you are running in AppBuilder Companion app which currently does not support this plugin.');
            return true;
       } else {
            return false;
       }
} 
function changeBeforeQuizUI(){
    trackFeatureQuiz();
    if (kendo.support.mobileOS.wp) {
        //alert("changeBeforeQuizUI()");
         $('.timer-div').css('height', '45px');
        // $('.timer-div').css('position', 'absolute');
        // $('.timer-div').css('margin-top', '3%');
    }
}
function changeQuection(index){
       // alert("question index "+index);
    //    alert("question "+JSON.stringify(data.questions));
  //  alert("after adding transition button");
        $("#results").fadeTo(100, 0);
       /* $('.km-flat .km-listview-label input[type=radio]').attr('disabled', true);*/
         setTimeout(function(){
            $('#temp').addClass("transitions-button");
            questionTemplate = kendo.template($("#temp").html(), {useWithBlock:true});
            $("#results").html(questionTemplate(data.questions[index]));
            changeQuizUI();
                //kendo.fx($("#results")).fade("in").duration(500).play();
               $("#results").fadeTo(200, 1.0);
         }, 300);
        /*setTimeout(function(){
             $('.km-flat .km-listview-label input[type=radio]').attr('disabled', false);
        },600);*/
}
function changeQuizUI(){
    if (kendo.support.mobileOS.wp) {
       // alert("changeQuizUI()");
         $('#option_ul li').css('height', '70px');
         $('.km-widget .km-listview-label').css('margin-top', '1%');
         $('.km-widget .km-listview-label').css('font-size', '15px');
         $('.km-flat .km-listview-label input[type=radio]').css('height', '35px');
         $('.km-flat .km-listview-label input[type=radio]').css('width', '8%');
         $('.question').css('font-size', '20px');
         $('#results').css('position', 'fixed');
         $('#results').css('width', '100%');
         $('.km-wp .km-listview-label input[type=radio]').css('border', '0');
         $('.km-wp .km-listview-label input[type=radio]').css('box-shadow', '0 0 0 #fff');
        
         //$('#header').css('position', 'fixed');
    }
}
function activitiesChanged(id){
     var answerId = null;
     selected = $("#"+id).val().trim();
     var tabId = parseInt(id.split("_").pop());
     if(previousId!==null){
         previousId.css('background','#E0DEDF');
     }
     if(data.questions[user.questionIndex].answer === tabId) {
         user.score++;
         $('#optionList_'+tabId).css('background','#E0DEDF');
         $('#answerId').css('background','#E0DEDF');
         $('#optionList_'+tabId).css('background','#37DD52');
       //  alert(interval);
          //   clearInterval(interval);
        blink('optionList_'+tabId);
        setTimeout(function(){
             next(id);
         }, 500);
     } 
    else{
       previousId = $('#optionList_'+tabId).css('background','#E55849');
        for(var i=0; i<=3; i++){
            if(i === data.questions[user.questionIndex].answer){
                 'optionList_'+tabId;
                $('#optionList_'+i).css('background','#37DD52');
                answerId = 'optionList_'+i;
            }
        }
       // clearInterval(interval);
        // interval = setInterval(function(){blink(answerId)}, 1000);
        blink(answerId);
        setTimeout(function(){
             next(id);
        }, 500);
    }
}  
function next(id){
    //alert("next**************");
   /* if(data.questions[user.questionIndex].answer == selected) {
       alert(""+user.score++);
     }  */
    if(user.questionIndex>8){
       timeisUp(id);
       //displayStatus();
    }
    else{
      user.questionIndex++;
      changeQuection(user.questionIndex);  
    }
}
function blink(id) {
   // setInterval(function(){$("#"+id).fadeTo(100, 0.1).fadeTo(200, 1.0)}, 10);
    $("#"+id).fadeTo(100, 0.1).fadeTo(200, 1.0);
    $("#"+id).fadeTo(100, 0.1).fadeTo(200, 1.0);
}
function timeisUp(id) {
    console.log("Times up**************");
    displayStatus(id);
}
function displayStatus(id){
     console.log("displayStatus**************");
    stopTimer();
    //alert(total_points);
    //alert(user.score);
    var points=0;
    if(user.score===10){  
          console.log("score win************** "+user.score);
         // $("#quiz_result").text("Congrates, You have won the Game"); 
         total_points=total_points+(10*10);
        points=100;
         // alert(total_points);
        // $("#user_score").text(user.score);  
         // redirectToScoreBoard("Win");
         //$('#quizResult').text('You Win');
     }
     else{
         console.log("score loose************** "+user.score);
         total_points=total_points+user.score;
         points=user.score;
        // $("#user_score").text(user.point);  
         //$("#quiz_result").text("You have lost the Game"); 
        // redirectToScoreBoard("Loose");
         //$('#quizResult').text('You Loose');
     } 
   // alert(total_points);
    $("#user_score").text("You gained "+points+" points. Your total point is "+total_points);
     $("#modalview").kendoMobileModalView("open");
    updatePoints(total_points);
    
}
function updatePoints(points){
     userId=localStorage.getItem('userId');
    var data1 = everlive.data('Users');
    data1.updateSingle({'Id': userId, 'points': points },
    function(data){
        currentUserPoints=total_points;
        //alert(JSON.stringify(data));
        //alert("total points"+total_points);
    },
    function(error){
        alert(JSON.stringify(error));
    });
        
} 
function redirectToScoreBoard(quizScore){
    console.log("redirectToScoreBoard**************");
    if(quizScore==="Win"){
         updateScore('Yes');
        user.point=user.score*10;
       // updatePoints();
       // totalPoints=user.score*10;
         //alert("your total points are:"+user.point);
    	 $('#quizResult').text('You Win');
        $("#user_score").text(user.point); 
    }else{
         updateScore('No');
         user.point=user.score;
       // totalPoints=user.score;
       // updatePoints();
        //alert("your total points are:"+user.point);
     	 $('#quizResult').text('You Loose');
          $("#user_score").text(user.point); 
    }
    $("#modalview").kendoMobileModalView("open");
    stopTimer();
   // app.navigate("views/scoreCard.html","slide");
    // hideBanner();
}
function ok(){
    console.log("ok**************");
    $("#modalview").kendoMobileModalView("close");
     $('#ms_timer').empty();
    app.navigate("views/home.html","slide"); 
    setTimeout(function(){
          stopTimer();
          hideBanner();
    }, 500);
}
function restart(){
    console.log("restart**************");
    $("#modalview").kendoMobileModalView("close");
    stopTimer();
    user.questionIndex=0;
    user.score=0;
    app.navigate("views/quiz.html","slide"); 
    initQuiz();
    $("#quiz_result").empty();  
    $("#user_score").empty(); 
}
function addRightItem(){   
    if(app.view().id === "views/quiz.html"){
     var country = localStorage.getItem('country');
     var city = localStorage.getItem('city');
     $("#navbar #right_item #city").text(city+',');
        $("#navbar #right_item #country").text(country);
    }
    else{
        $("#navbar #right_item").text("");
    }
}
function trackFeatureQuiz(){
    try{
        
                monitor.Start();
        monitor.TrackFeature("feature.Quiz"); 
              console.log("inside track feature monitor******************");        
             //alert("after track feature");
                
   }
    catch(err) {
    		console.log('Something went wrong:');
    		console.log(err);
    	}
}

/*function redirectToLoseScoreBoard(){
    console.log("redirectToScoreBoard**************");
    updateScore('false');
     $('#quizResult').text('You Loose');
    $("#modalview").kendoMobileModalView("open");
     stopTimer();
   // app.navigate("views/scoreCard.html","slide");
   // hideBanner();
}*/

/*function startQuiz(level_value){     
   $('#start_btn').css('background-color','green');
    if(isQuizVisited == false){
         // $('#start_btn').css('background-color','green');
         app.navigate("views/quiz.html","slide"); 
          //  onSelect(level_value);
    }
    else{
        app.navigate("views/quiz.html","slide"); 
       /* clearInterval(interval);
          initQuiz();
        restart();
    }
} */
/*function onSelect(level_value){
    initQuiz(level_value);
}*/
/*initQuiz();*/