
var everlive = new Everlive({
    apiKey: "KGCVGkuoa3Zw0Auj",
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