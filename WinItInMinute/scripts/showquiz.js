var data={}; 
var questionTemplate = null;
var selected = null;
var interval = null;
var previousId = null;
var total_points;
var user= {
        questionIndex:0,
        score:0,
        points:0,
        isBonusGame: false
};
var currentUserPoints;
var randomArray = [];
var questionIndex = 0;

function initQuiz(){
     $('#results').hide();
     console.log('initquiz');
     var duration;
     duration=new Date().getTime();
     getPoints(); 
     min = 1;
     sec = 0;
     var trialFlag = localStorage.getItem('trialFlag');
    
    if(trialFlag === 'false'){
         var isMax10Prizes = false;
         var quizCount = parseInt(localStorage.getItem("quizCount"));
         if(quizCount < 20){
            isMax10Prizes = true;
         }
    }
    
    var customParam = JSON.stringify({
    "filterParam" :{
       'city': city,
       'country' : country,
       'userId' : localStorage.getItem('userId'),
       'isMax10Prizes' : 'true'
    }
    });
    console.log(customParam);
    $.ajax({
        url: "https://platform.telerik.com/bs-api/v1/elKw1nKoaJB4RIJ8/Functions/getQuestionsService",
        type: "GET",
        datatype: "json",
        cache: false,
        headers: {
            "Authorization" : localStorage.getItem('access-token'),
            "X-Everlive-Custom-Parameters" : customParam
        },
        contentType: "application/json",
        accept: "application/json",
        success: function(result , statusText, xhr){
           console.log("initQuiz  success status  "+xhr.status);
            app.pane.loader.hide();
           console.log("initQuiz  success duration  "+result.duration);
           //console.log("initQuiz  success questions  "+JSON.stringify(result.questions));
           // changeBeforeQuizUI();
            for(var i=0; i<result.questions.length; i++){
              //  console.log("initQuiz  success options  "+i +">>>>>>>>"+JSON.stringify(result.questions[i].options));
                result.questions[i].options = result.questions[i].options.trim().split("|");
                console.log("initQuiz  OPTIONS LENGTH  "+result.questions[i].options.length);
                if(result.questions[i].options.length > 4){
                    var array =[];
                    var optionsIndex = getRandomArray(result.questions[i].answer, result.questions[i].options.length,4);

                    for(var j = 0; j<optionsIndex.length; j++){
                            array[j] = result.questions[i].options[optionsIndex[j]];
                    }

                    result.questions[i].options = array;
                    result.questions[i].answer = optionsIndex.indexOf(result.questions[i].answer);
                   // alert('index of correct answer in if '+i+'  '+optionsIndex.indexOf(result.questions[i].answer));
                }
            }
             data.questions = result.questions;
              //if(user.questionIndex<=4){
                changeQuection(user.questionIndex);
            // }
            randomArray = getArrayofNum(1,9,9);
            if(result.isBonusGame && trialFlag === 'false'){
                user.isBonusGame = result.isBonusGame;
              //  $('#messagemodalview').parent().parent().parent().css('border-radius', '10px');
               // $('#messagemodalview').css('border-radius', '10px');
                $('#message').text('This is the Bonus Game!');
                $("#messagemodalview").kendoMobileModalView("open");
                kendo.fx("#messagemodalview").zoom("in").endValue(1).startValue(0).play();
            }else{
                startTimer(min,sec);
            }
           
            isQuizVisited = true;
            
             if(isWindowOpen){
                 console.log("isWindowOpen  "+isWindowOpen);
                 stopTimer();
                 isWindowOpen = false;
                 console.log("isWindowOpen after stoptimer  "+isWindowOpen);
             }
            duration=new Date().getTime()-duration;
            console.log("ajax call duration is "+duration+"ms");
        },
        error: function(error){
            console.log("initQuiz error******************"+error);
            console.log("Server taking too long to respond");
        }
    });
    
      addAdsBannerAtBottom();
}
function closeMessage(){
     $('#messageBtn').fadeTo(100, 0.1).fadeTo(200, 1.0);
     startTimer(min,sec);
     $("#messagemodalview").kendoMobileModalView("close");
}
function getPoints(){
     console.log("getPoints");
    userId=localStorage.getItem('userId');
    var data1 = everlive.data('Users');
    
    data1.getById(userId).then(function(data){
        
         total_points = data.result.points;      
         console.log("in else total_points "+total_points);
    },
    function(error){
        console.log("getPoints Error  "+JSON.stringify(error));
    });
    
} 
function getRandomArray(answer, length, maxArrLen){
	//console.log("getRandomArray  "); 
    var arr = [];
    arr = getArrayofNum(0,length-1, maxArrLen);
       
    var flag = arr.contains(answer);
    
    if(!flag){
        var index = randomIntFromInterval(0,3);
        arr[index]=answer;
        //console.log("index  "+index); 
    }
    
       
    return arr;
}
function getArrayofNum(min, max, maxArrLen){
    var arr = [];
    while(arr.length < maxArrLen){
        var randomnumber = randomIntFromInterval(min, max);
        var found=false;
          
        for(var j=0;j<arr.length;j++){
            if(arr[j]===randomnumber){
                 found=true;
                 break;
            }   
        }
        if(!found){
            arr[arr.length]=randomnumber;
        }
    }
    console.log("array of random numbers   "+arr);
    return arr;
}
function randomIntFromInterval(min,max)
{
    return Math.ceil(Math.floor(Math.random()*(max-min+1)+min));
}
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
};
function addAdsBannerAtBottom(){
    console.log("addAdsBannerAtBottom")//ios 'ca-app-pub-7748174862052689/8033820856' android 'ca-app-pub-7748174862052689/6975890055' windows  'ca-app-pub-7748174862052689/1987287250';
     var ad_units = {
          ios : {
            banner: 'ca-app-pub-5766924451654547/3292000119',
          },
          android : {
            banner: 'ca-app-pub-5766924451654547/7861800510',
          },
          wp8 : {
            banner: 'ca-app-pub-5766924451654547/7722199717',
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
                            function() { console.log('failed to show ad')});
                      },
                      // requestAd error callback
                      function(){ console.log('failed to request ad'); }
                  );
                },
                // createBannerView error callback
                function(){ console.log('failed to create banner view'); }
		      );
    }

}
function checkSimulator() {
     
       if (window.navigator.simulator === true) {
            console.log('This plugin is not available in the simulator.');
            return true;
       } else if (window.plugins === undefined || window.plugins.AdMob === undefined) {
           console.log('Plugin not found. Maybe you are running in AppBuilder Companion app which currently does not support this plugin.');
            return true;
       } else {
            return false;
       }
} 
function changeBeforeQuizUI(){
    trackFeatureQuiz();
    if (kendo.support.mobileOS.wp) {
        console.log("changeBeforeQuizUI");
         $('.timer-div').css('height', '45px');
        $('.timer-div').css('position', 'fixed');
        // $('.timer-div').css('position', 'absolute');
        // $('.timer-div').css('margin-top', '3%');
    }
}
function changeQuection(index){
       console.log("question index "+index);
     //  console.log("question "+JSON.stringify(data.questions));
       
        $("#results").fadeTo(100, 0);
       /* $('.km-flat .km-listview-label input[type=radio]').attr('disabled', true);*/
         setTimeout(function(){
            $('#temp').addClass("transitions-button");
            questionTemplate = kendo.template($("#temp").html(), {useWithBlock:true});
            $("#results").html(questionTemplate(data.questions[index]));
            changeQuizUI();
                //kendo.fx($("#results")).fade("in").duration(500).play();
               $("#results").fadeTo(200, 1.0);
            //  alert('correct answer '+data.questions[index].answer);
            //  alert('value of correct answer '+data.questions[index].options[data.questions[index].answer]);
         }, 300);
         $('#results').show();
}
function changeQuizUI(){
    console.log("initialScreenHeight  "+initialScreenHeight);
    createLoader();
    $('#quizmodalview').css('height', initialScreenHeight);
   // $('#quizmodalview').parent().parent().parent().css('opacity', '0.8');
    $('.km-modalview-root').css('opacity', '0.8');
    
    if (kendo.support.mobileOS.wp) {
       console.log("changeQuizUI wp8");
       /*  $('#option_ul li').css('height', '70px');*/
        // $('.km-widget .km-navbar').css('height', '60px');
         $('.km-widget .km-listview-label').css('padding', '20px');
         $('.km-widget .km-listview-label').css('font-size', '15px');
         $('.km-flat .km-listview-label input[type=radio]').css('height', '35px');
         $('.km-flat .km-listview-label input[type=radio]').css('width', '8%');
         $('.km-widget .km-listview-label input[type=radio]').css('margin-top', '-3%');
        // $('.radio-text').css('margin-top', '3%');
         $('.question').css('font-size', '20px');
         $('#results').css('position', 'fixed');
         $('#results').css('width', '100%');
         $('#results').css('margin-top', '15%');
         $('.km-wp .km-listview-label input[type=radio]').css('border', '0');
         $('.km-wp .km-listview-label input[type=radio]').css('box-shadow', '0 0 0 #fff');
        
         $('.star-field.field1').css('margin-top', '60%');
         $('.star-field.field2').css('margin-top', '-20%');
         $('.star-field.field3').css('margin-top', '140%');
         $('.star-field').css('left', '-210%');
         $('.star-field.field2').css('margin-left', '80%');
         $('.star-field.field2').css('margin-left', '-70%');
         $('.star-field.field3').css('margin-right', '-5%');
         $('.score_content > h4').css('width', '95%');
         $('#registerBtn').css('margin-left', '10%');
         $('#skipBtn').css('margin-left', '3%');
         $('#registerBtn').css('margin-top', '5%');
         $('#skipBtn').css('margin-top', '5%');
         $('#registerBtn').css('height', '50px');
         $('#skipBtn').css('height', '50px');
         $('#messageBtn').css('height', '40px');
         //$('#header').css('position', 'fixed');
    }
}
function activitiesChanged(id){
     console.log("activitiesChanged radio button id***********"+id);
     var answerId = null;
     selected = $("#"+id).val().trim();
     var tabId = parseInt(id.split("_").pop());
     
     if(previousId!==null){
         previousId.css('background','#E0DEDF');
     }
     if(data.questions[questionIndex].answer === tabId) {
         console.log("activitiesChanged correct answer id***********optionList_"+tabId);
         user.score++;
         $('#optionList_'+tabId).css('background','#E0DEDF');
         $('#answerId').css('background','#E0DEDF');
         $('#optionList_'+tabId).css('background','#37DD52');
          //   clearInterval(interval);
         blink('optionList_'+tabId);
         setTimeout(function(){
             next();
         }, 500);
     } 
    else{
       console.log("activitiesChanged else wrong answer id***********optionList_"+tabId);
       previousId = $('#optionList_'+tabId).css('background','#E55849');
        for(var i=0; i<=3; i++){
            if(i === data.questions[questionIndex].answer){
                 'optionList_'+tabId;
                 console.log("activitiesChanged else correct answer id***********optionList_"+i);
                $('#optionList_'+i).css('background','#37DD52');
                answerId = 'optionList_'+i;
            }
        }
       // clearInterval(interval);
        // interval = setInterval(function(){blink(answerId)}, 1000);
        blink(answerId);
        setTimeout(function(){
             next();
        }, 500);
    }
}  
function next(){
    console.log("next**************");
    if(user.questionIndex>8){
       console.log("next calling timeisUp**************"); 
       timeisUp();
    }
    else{
      console.log("next calling changeQuection**************"); 
       //alert('randomArray['+user.questionIndex+']  >>>>>>>>>'+randomArray[user.questionIndex]);
        questionIndex = randomArray[user.questionIndex];
       changeQuection(randomArray[user.questionIndex]);  
        user.questionIndex++;
    }
}
function blink(id) {
    console.log("blink id  "+id);
   // setInterval(function(){$("#"+id).fadeTo(100, 0.1).fadeTo(200, 1.0)}, 10);
    $("#"+id).fadeTo(100, 0.1).fadeTo(200, 1.0);
    $("#"+id).fadeTo(100, 0.1).fadeTo(200, 1.0);
}
function timeisUp() {
    console.log("Times up**************");
    //displayStatus();
    console.log("Times up  user score**************"+user.score);
    console.log("Times up  total_points**************"+total_points);
    stopTimer();
    var points = 0;
    var trialFlag = localStorage.getItem('trialFlag');
    if(!(localStorage.getItem('trialPoints') === null)){
        total_points = Number(localStorage.getItem('trialPoints'));
    }
    
        if(user.score === 10){  
             console.log("score win************** "+user.score);
             points = 100;
             total_points += points;
            if(trialFlag === 'false'){
                updateQuizStatus('true');
            }
             
         }
         else{
             console.log("score loose************** "+user.score);
             points = user.score;
             total_points += user.score;
             if(trialFlag === 'false'){
                 updateQuizStatus('false');
             }
             
         } 
    
    // $("#trial_text").before('<span id="user_score"></span><br>');
    
    if(trialFlag === 'true'){
         $("#trial_user_score").text("You gained "+points+" points. Your total point is "+total_points+".");
         $("#trial_text").text('If you want to save your points, just register yourself!');
        /* $("#scoreBtn").hide();*/
         $("#registerBtn").show();
         $("#skipBtn").show();
         localStorage.setItem('trialPoints', total_points);
         $("#quizmodalview").addClass('check-modalview');
         $("#quizmodalview").kendoMobileModalView("open");
    }else{
         var quizCount = parseInt(localStorage.getItem("quizCount"));
         quizCount++;
         localStorage.setItem('quizCount', quizCount);   
         $('#ms_timer').empty();
         $('#results').empty();
         $("#scoreBtn").show();
         setTimeout(function(){
               stopTimer();
               hideBanner();
         }, 500);
        /* $("#registerBtn").hide();
         $("#skipBtn").hide();*/
         app.navigate("views/LeaderBoard.html","slide"); 
        showScoreView();
        // $("#user_score").text("You gained "+user.score+" points. Your total point is "+total_points);
        if(!(user.isBonusGame && user.score >= 5)){
            updatePoints(total_points);
        }
         
    }
     
  
}
function updatePoints(points){
    console.log("updatePoints************** "+points);
    userId=localStorage.getItem('userId');
    var data1 = everlive.data('Users');
    data1.updateSingle({'Id': userId, 'points': points },
    function(data){
        currentUserPoints=total_points;
        console.log("updatePoints success************** "+JSON.stringify(data));
    },
    function(error){
        console.log("updatePoints error************** "+JSON.stringify(error));
    });
        
} 
function ok(btnId){
    console.log("ok**************");
    /*$('#ms_timer').empty();
    $('#results').empty();*/
     setTimeout(function(){
           stopTimer();
           hideBanner();
     }, 500);
    $("#"+btnId).fadeTo(100, 0.1).fadeTo(200, 1.0);
    $("#modalview").removeClass('check-modalview');
    $("#modalview").kendoMobileModalView("close");
    $("#quizmodalview").removeClass('check-modalview');
    $("#quizmodalview").kendoMobileModalView("close");
   /* if(btnId === 'scoreBtn'){
        app.navigate("views/LeaderBoard.html","slide"); 
    }else{*/
        if(btnId === 'registerBtn'){
            app.navigate("views/registration.html","slide"); 
        }
        if(btnId === 'skipBtn'){
            app.navigate("views/home.html","slide"); 
        }
    
}
function restart(){
    console.log("restart**************");
   // $("#modalview").kendoMobileModalView("close");
  //  stopTimer();
    user.questionIndex=0;
    user.score=0;
    app.navigate("views/quiz.html","slide"); 
    initQuiz();
    $('#ms_timer').empty();
    $("#quiz_result").empty();  
    $("#user_score").empty(); 
    //data={}; 
}
function trackFeatureQuiz(){
    console.log("trackFeatureQuiz******************");       
    try{
        monitor.Start();
        monitor.TrackFeature("feature.Quiz"); 
        console.log("inside track feature monitor******************");       
                
   }
   catch(err) {
        console.log('Something went wrong:');
    	console.log(err);
   }
}
function updateQuizStatus(isWon){
    console.log("update Quiz status**************");
    //alert("inside update quiz status :"+isWon);
    var data = everlive.data('user_quiz_status');
    var userName=localStorage.getItem('userName');
    var userId=localStorage.getItem('userId');
   // alert(userName+" "+ userId);
    data.create({ 'user_name' : userName , 'quiz_status' : isWon ,  'user_id' : userId },
    function(data){
        //alert(data.result.Id);
     
      },
      function(error){
        console.log("rawUpdate**************"+JSON.stringify(error));
         console.log(JSON.stringify(error));
      });
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


/*function displayStatus(){
    console.log("displayStatus**************");
    console.log("displayStatus  user score**************"+user.score);
    console.log("displayStatus  total_points**************"+total_points);
    var points = 0;
    stopTimer();
    
    if(user.score===10){  
          console.log("score win************** "+user.score);
         // $("#quiz_result").text("Congrates, You have won the Game"); 
        points=100;
        total_points=total_points+points;
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
     $("#user_score").text("You gained "+points+" points. Your total point is "+total_points);
     $("#modalview").kendoMobileModalView("open");
     updatePoints(total_points);
    
}*/
/*function redirectToScoreBoard(quizScore){
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
}*/
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