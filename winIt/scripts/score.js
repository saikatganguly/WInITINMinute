function updateScore(isPassed){
    console.log("updateScore**************");
    var data = everlive.data('User_quiz_details');
    var userName=localStorage.getItem('userName');
    var userId=localStorage.getItem('userId');
   // alert(userName+" "+ userId);
    data.create({ 'user_name' : userName , 'quiz_won' : isPassed ,  'user_id' : userId },
    function(data){
        //alert(data.result.Id);
     var data1 = everlive.data('Users');
      var quiz_id = data.result.Id;

      var attributes = {
      "$push": {
         "quiz_details": quiz_id
      }
      };

      var filter = {
      'Id': userId
      };

      data1.rawUpdate(attributes, filter, function (data1) {
    		 console.log("rawUpdate**************"+JSON.stringify(data1));
          //alert(JSON.stringify(data1));
      }, function (err) {
          console.log("rawUpdate**************"+JSON.stringify(err));
       	//alert(JSON.stringify(err));
      });
      },
      function(error){
        console.log("rawUpdate**************"+JSON.stringify(error));
        //alert(JSON.stringify(error));
      });
}

/*function login() {

        FB.init({ 
            appId: '1563251560601667', 
            cookie: true, 
            xfbml: true, 
            status: true });

        FB.getLoginStatus(function (response) {
            if (response.authResponse) {
               alert(response.authResponse.accessToken);
            } else {
                // do something...maybe show a login prompt
            }
        });

    }*/
/*function createHello(){
    var data = everlive.data('Hello');
    data.create({ 'string':'Hello','name' : 'Arpita'},
    function(data){
        alert(data.result.Id);
      },
      function(error){
        alert(JSON.stringify(error));
      });
}*/

//Ajax request using jQuery
/*function test(){
    var customParam = JSON.stringify({
    "filterParam" :{
      // 'difficulty_level': 1,
       'city': 'Indore',
       'country' : 'India' 
    }
});
    var data={};
    $.ajax({
        url: "https://platform.telerik.com/bs-api/v1/elKw1nKoaJB4RIJ8/Functions/getquestionservice",
        type: "GET",
        headers: {
            "Authorization" : localStorage.getItem('access-token'),
            "X-Everlive-Custom-Parameters" : customParam
        },
        contentType: "application/json",
        accept: "application/json",
        success: function(data){
            alert(JSON.stringify(data));
          //  data.questions = JSON.stringify(data);
          //  alert(data.questions);
        },
        error: function(error){
            alert(JSON.stringify(error));
        }
    })
}*/

/*function getQestions(){
    var data={};
    $.ajax({
    url: 'http://api.everlive.com/v1/elKw1nKoaJB4RIJ8/questions',
    type: "GET",
    headers: {
        "Authorization" : localStorage.getItem('access-token')
    },
    success: function(data){
         data.questions = data.Result;
         alert(JSON.stringify(data.questions));
    },
    error: function(error){
        alert(JSON.stringify(error));
    }
    })
}*/
/*$.ajax({
        url: 'https://api.everlive.com/v1/elKw1nKoaJB4RIJ8/questions',
        type: "GET",
        headers: {
            "Authorization" : localStorage.getItem('access-token')
        },
        success: function(result_data){
             data.questions = result_data.Result;
           //  alert(JSON.stringify(data.questions));
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
    })*/

function getQuestionsTest(){
    //alert('initquiz');
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
            alert("success");
            alert(JSON.stringify(result));
        },
        error: function(error){
            alert(JSON.stringify(error));
        }
    });
   // alert(app.view().id);
}