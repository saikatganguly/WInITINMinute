var currentUserPoints;
 var currentUserName;
 var groupedData;
var imageUrl = {};
function getLeaderBoard(){
    showLoader();
     //alert("getLeaderBoard");
    trackFeatureLeaderboard();
    changeBoardUI();
  var customParam = JSON.stringify({
    "registrationFilterParam" :{
       'country' :country
    }
    });
    
        $.ajax({
    url: 'https://platform.telerik.com/bs-api/v1/elKw1nKoaJB4RIJ8/Functions/getTopUsers',
    type: "GET",
    Async: false,
    headers: {
        "Authorization" : localStorage.getItem('access-token'),
            "X-Everlive-Custom-Parameters" : customParam
    },
        contentType: "application/json",
        accept: "application/json",
    success: function(result){
        //alert(result[0].Name);
        //$('#LeaderBoard').hide();
        
        groupedData=result;
       // $('#LeaderBoard').hide();
        for (var i = 0; i < result.length; i++) {
            
           console.log("ProfileImage for loop  "+i);
           var img_id= result[i].ProfileImage;
           getUsersTemplateProfileImage(i,img_id);
           //alert("img_id "+img_id);
       }
      setTimeout(function(){
        for (var j = 0; j < result.length; j++) {
               console.log(imageUrl[j]);
               result[j].ProfileImage = imageUrl[j];
        }
        mobileListViewTemplatesInit();
        console.log("after mobileListViewTemplatesInit()");
           
      },2000);
        
      getCurrentUserPoints();
        /* setTimeout(function(){
           //  console.log("mobileListViewTemplatesInit()");
            mobileListViewTemplatesInit();
            console.log("after mobileListViewTemplatesInit()");
         },2000);*/  
       // $('#current_user_score').text(current_point);
        $('#user_location').text(city+','+country);
        //alert("country is "+country);
        /*setTimeout(function(){
             console.log("mobileListViewTemplatesInit()");
           mobileListViewTemplatesInit();
             console.log("after mobileListViewTemplatesInit()");
               
         },1500);*/
        // mobileListViewTemplatesInit();
      //  afterLoader(result);
       // $('#LeaderBoard').show();
        // 
    },
    error: function(error){
        alert(JSON.stringify(error));
    }
    }) 
}
function mobileListViewTemplatesInit() {
     console.log("mobileListViewTemplatesInit");
          //$('#location').text(city+','+country);
    //$('.location_country').text(country); 
        $("#custom-listview").kendoMobileListView({
            dataSource: kendo.data.DataSource.create({data: groupedData}),
            template: $("#customListViewTemplate").html(),
        });
        if(kendo.support.mobileOS.wp){
        $('.leaderBoard_profile_img').css('height','90px');
        $('.leaderBoard_profile_img').css('width','20%');
        $('.top_users_detail').css('font-size','25px');
        $('.top_users_detail_points').css('font-size','25px');
        $('.top_users_detail_points span').css('font-size','20px');
    }
}   
function getCurrentUserPoints(){
    
     console.log("getCurrentUserPoints");
    var userId=localStorage.getItem('userId');
    var data1 = everlive.data('Users');
    var points;
    data1.getById(userId).then(function(data){
         //alert(JSON.stringify("Current points "+data.result.points));
        if(data.result.points===null){
            currentUserPoints=0;
           //alert(JSON.stringify("Current points "+points));
            points=currentUserPoints;
             $('#current_user_score').text(points);
        }
        else{
            //var el = new Everlive('elKw1nKoaJB4RIJ8');
            currentUserPoints=data.result.points;
            currentUserName=data.result.DisplayName;
            //alert(JSON.stringify(data.result.ProfileImage));
                console.log(data.result.Id);
                points=currentUserPoints;
                $('#current_user_score').text(points);
                 $('.User_name').text(currentUserName);
        }
          var fileId = data.result.ProfileImage;
        //alert("current user fileid   "+fileId);
        if(fileId !== null){
          getUserProfileImage(fileId);
        }
         
    },
    function(error){
        alert(JSON.stringify(error));
    });
    //return points;
} 
function getUserProfileImage(fileId){
     console.log("getUserProfileImage");
    //alert(fileId);
     //var fileId1 = 'f5ade910-10f7-11e5-aa31-d7e25f26a686'; // the file identifier is retrived from the REST services
    everlive.Files.getDownloadUrlById(fileId)
    .then(function(downloadUrl){
       if(app.view().id === 'views/LeaderBoard.html'){
            document.getElementById('img_leaderBoard').src = downloadUrl;
           setTimeout(function(){
             $('#LeaderBoard').show();
             $('.leaderboard-content').show();
             $('.header_logo').show();
             $('#custom-listview').show();
             // $('.leaderBoard_profile_img').show();
             $('#img_leaderBoard').show();
             app.pane.loader.hide();   
          },2000);
           
       }else{
            document.getElementById('profileImage').src = downloadUrl;
            setTimeout(function(){
               hideLoaderAtProfile();
           },400);
       }
      
    },
    function(error){
        alert(JSON.stringify(error));
        
    });
}
function getUsersTemplateProfileImage(index,fileId){
    console.log("getUsersTemplateProfileImage");
    console.log("index  "+index);
    
    everlive.Files.getDownloadUrlById(fileId)
    .then(function(downloadUrl){
          imageUrl[index] = downloadUrl;
       // alert("downloadUrl************"+downloadUrl);
        console.log("imageUrl["+index+"]************"+imageUrl[index]);
    },
    function(error){
        alert(JSON.stringify(error));
        
    });
}
function changeBoardUI(){
    if(kendo.support.mobileOS.wp){
        $('.leaderboard-content').css('font-size','25px');
        $('#img_leaderBoard').css('height','145px');
        $('.leaderBoard_profile_img').css('height','120px');
        $('.header_logo').css('height','55px');
        $('.header_logo_title').css('font-size','30px');
        $('.current_user_score').css('font-size','30px');
        $('.points_text').css('font-size','20px');
        
    }
}
function trackFeatureLeaderboard(){
    try{
        monitor.Start();
        monitor.TrackFeature("feature.LeaderBoard"); 
        console.log("inside track feature monitor******************");
   }catch(err) {
      console.log('Something went wrong:');
      console.log(err);
   }
}

function showLoader() {
    //$('#LeaderBoard').hide();
    $('.leaderboard-content').hide();
   $('.header_logo').hide();
    $('#custom-listview').hide();
    $('.leaderBoard_profile_img').hide();
    $('#img_leaderBoard').hide();
  app.pane.loader.show();
    }   
function afterLoader(result){
   
} 