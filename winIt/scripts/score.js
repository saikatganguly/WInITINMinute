
var everlive = new Everlive({
    apiKey: "elKw1nKoaJB4RIJ8",
    scheme: "https"
});


function updateScore(){
    var data = everlive.data('User_quiz_details');
data.create({ 'user_name' : 'saikat' , 'quiz_won' : 'false' , 'quiz_location' : 'Indore' , 'user_id' : '98a54760-e1bb-11e4-ac25-453968c2c38f' },
    function(data){
        alert(data.result.Id);
     var data1 = everlive.data('Users');
      var quiz_id = data.result.Id;

      var attributes = {
      "$push": {
         "quiz_details": quiz_id
      }
      };

      var filter = {
      'Id': "98a54760-e1bb-11e4-ac25-453968c2c38f"
      };

      data1.rawUpdate(attributes, filter, function (data1) {
     alert(JSON.stringify(data1));
      }, function (err) {
      alert(JSON.stringify(err));
      });
      },
      function(error){
        alert(JSON.stringify(error));
      });
}

function createLocation(){
    var data = everlive.data('localtion');
    data.create({ 'country_name':'India','city_name' : 'Indore'},
    function(data){
        alert(data.result.Id);
      },
      function(error){
        alert(JSON.stringify(error));
      });
}

function getQuestionsFromCloud(){
    
}

function login() {

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

    }
function createHello(){
    var data = everlive.data('Hello');
    data.create({ 'string':'Hello','name' : 'Arpita'},
    function(data){
        alert(data.result.Id);
      },
      function(error){
        alert(JSON.stringify(error));
      });
}

//Ajax request using jQuery
function test(){
    var data={};
    $.ajax({
        url: "https://platform.telerik.com/bs-api/v1/elKw1nKoaJB4RIJ8/Functions/get_questionservice",
        type: "GET",
        headers: {
            "Authorization" : localStorage.getItem('access-token'),
          
        },
        contentType: "application/json",
        accept: "application/json",
        success: function(data){
            alert(JSON.stringify(data));
          /*  data.questions = JSON.stringify(data);
            alert(data.questions);*/
        },
        error: function(error){
            alert(JSON.stringify(error));
        }
    })
}

function getQestions(){
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
}
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