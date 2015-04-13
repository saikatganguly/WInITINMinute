var data={}; 
var questionTemplate = null;
 var selected = null;
var user= {
        questionIndex:0,
        score:0
};
var minutes=10;
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
}
function restart(){
    console.log("restart**************");
    user.questionIndex=0;
    user.score=0;
    app.navigate("views/quiz.html","slide"); 
    initQuiz();
    $("#quiz_result").empty();  
    $("#user_score").empty(); 
}
function next(){
    console.log("next**************");
    if(data.questions[user.questionIndex].answer == selected) {
       alert(""+user.score++);
     }  
    if(user.questionIndex>3){
       timeisUp();
       //displayStatus();
        
    }
      user.questionIndex++;
      changeQuection(user.questionIndex);  
}
function activitiesChanged(id){
     selected = $("#"+id).val();
}
function timeisUp() {
    console.log("Times up**************");
    displayStatus();
}

function displayStatus(){
     if(user.score==5){
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