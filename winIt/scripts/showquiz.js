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
    data.questions=
        [
        {
            question: "what is Java?",
            options: ["Computer Language","OS","Hardware","ETC"],
            answer: "Computer Language"
        },
        {
            question: "what is India?",
            options: ["Computer Language","OS","country","ETC"],
            answer: "country"
        },
        {
            question: "what is cricket?",
            options: ["Computer Language","OS","Hardware","outdore Game"],
            answer: "outdore Game"
        },
        {
            question: "what is cow?",
            options: ["Animal","aeroplane","neavy","things"],
            answer: "Animal"
        },
        {
            question: "what is asia?",
            options: ["continent","aeroplane","neavy","things"],
            answer: "continent"
        }, 
        ];
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
     selected = $("#"+id).val();
        var tabId = id.split("_").pop();
     if(previousId!==null){
         previousId.css('background','#E0DEDF');
     }
  
     if(data.questions[user.questionIndex].answer === selected) {
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
            if(data.questions[user.questionIndex].options[i] === data.questions[user.questionIndex].answer){
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
}
function changeQuection(index){
        //alert("question index"+index);
        //alert("score is"+user.score);
        questionTemplate = kendo.template($("#temp").html(), {useWithBlock:true});
        $("#results").html(questionTemplate(data.questions[index]));  
}
initQuiz();
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
/*$("#openButton").click(function(){
      $("#confirm").kendoWindow({
        title: "Confirm Exit",
        modal: true,
        width: 200,
        height: 100
      }).data("kendoWindow").center();*/
    /*var window = $("#confirm").kendoWindow({
            title: "Confirm Exit",
            resizable: false,
            modal: true
        });
    
     window.data("kendoWindow")
        .content($("#confirmTemplate").html())
        .center().open();
});
/*function confirmExitQuiz(){
      $("#confirm").kendoWindow({
        title: "Confirm Exit",
        modal: true,
        width: 200,
        height: 100
      }).data("kendoWindow").center();*/
    /*var window = $("#confirm").kendoWindow({
            title: "Confirm Exit",
            resizable: false,
            modal: true
        });
    
     window.data("kendoWindow")
        .content($("#confirmTemplate").html())
        .center().open();*/
//}