
var data={}; 
var questionTemplate = null;
 var selected = null;
var user= {
        questionIndex:0,
        score:0
};
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
    changeQuection(user.questionIndex);
    $('#ms_timer1').countdowntimer({
                              minutes :1,
                              seconds :0,
                              size : "lg",
                              timeUp : timeisUp
                           });
    
        
}
function restart(){
    user.questionIndex=0;
    user.score=0;
    app.navigate("views/quiz.html","slide"); 
    initQuiz();
    
}
function next(){
    if(user.questionIndex>4){
        alert("questionIndex  "+user.questionIndex);
        if(user.score==5){
            alert("score win  "+user.score);
            app.navigate("views/scoreCard.html","slide");
              $("#congrates").text("congrates you have won thae game");    
            $(".title").text("Score:"+user.score);   
        }
        else{
             //alert("score not win  "+user.score);
            $(".title").text("Score:"+user.score);   
            app.navigate("views/scoreCard.html","slide");
        }
    }
       else{
         if(data.questions[user.questionIndex].answer == selected) {
           user.score++;
          alert("score  "+user.score);
        }
    }
 /*   else{
        for(i=0;i<data.questions[user.questionIndex].options.length;i++){
            if(data.questions[user.questionIndex].options[i]==data.questions[user.questionIndex].answer){
                 user.score=user.score+1;  
                alert(user.score);
            }   
          }
    }*/
    user.questionIndex++;
    if(user.questionIndex!=5){
      changeQuection(user.questionIndex);  
    }
    //changeQuection(user.questionIndex);
}
function activitiesChanged(id){
     selected = $("#"+id).val();
}
function timeisUp() {
  if(user.score==5){
            alert("score win  "+user.score);
            app.navigate("views/scoreCard.html","slide");
              $("#congrates").text("congrates you have won thae game");    
            $(".title").text("Score:"+user.score);   
        }
        else{
             //alert("score not win  "+user.score);
            $(".title").text("Score:"+user.score);   
            app.navigate("views/scoreCard.html","slide");
        }
    }

function changeQuection(index){
     if(questionTemplate==null){
          questionTemplate = kendo.template($("#temp").html(), {useWithBlock:true});
     }
     $("#results").html(questionTemplate(data.questions[index]));
   // $("#results").html(kendo.render(questionTemplate, data.questions[index]));  
}

initQuiz();