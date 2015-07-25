var currentUserPoints;
var currentUserName;
var groupedData;
var imageUrl = {};
//var getDuretion;

function getLeaderBoard() {
    console.log("getLeaderBoard");
   
    //getDuretion=new Date().getTime();
    showLoaderAtLeaderboard();
    changeBoardUI();
    trackFeatureLeaderboard();
   
    var customParam = 
        JSON.stringify({
         "registrationFilterParam" :{
                'country' : country
            }
          });
    
    $.ajax({
               url: 'https://platform.telerik.com/bs-api/v1/elKw1nKoaJB4RIJ8/Functions/getTopUsers',
               type: "GET",
               Async: false,
               cache: false,
               headers: {
                   "Authorization" : localStorage.getItem('access-token'),
                   "X-Everlive-Custom-Parameters" : customParam
                },
               contentType: "application/json",
               accept: "application/json",
               success: function(result , statusText, xhr) {
                   console.log("getLeaderBoard  success status  "+xhr.status);
                   groupedData = result; 
                   mobileListViewTemplatesInit();
                   getCurrentUserPoints();
                  
               },
               error: function(error) {
                    console.log(JSON.stringify(error));
               }
           }) 
}
function mobileListViewTemplatesInit() {
    console.log("mobileListViewTemplatesInit");
    var leadersTemplate;
    $("#scroller").data("kendoMobileScroller");
   
    $('#customListViewTemplate').addClass("transitions-button");
    leadersTemplate = kendo.template($("#customListViewTemplate").html(), {useWithBlock:true});
    $("#leadersBoard").html(leadersTemplate(groupedData));
    
    /*$("#leaders_ul").kendoMobileListView({
          dataSource: kendo.data.DataSource.create({data: groupedData}),
          template: $("#customListViewTemplate").html(),
    });*/
    
    if (kendo.support.mobileOS.wp) {
        $('.leaderBoard_profile_img').css('height', '90px');
        $('.leaderBoard_profile_img').css('width', '20%');
        $('.top_users_detail').css('font-size', '25px');
        $('.top_users_detail_points').css('font-size', '25px');
        $('.top_users_detail_points span').css('font-size', '20px');
    }
   // setImages();
} 
function setImages(){
    for(var i=0; i<groupedData.length; i++){
        //document.getElementById('image_'+i).src ="data:image/"+groupedData[i].imageType+";base64,"+groupedData[i].imageBase64;
        //alert("groupedData[i].Id "+groupedData[i].Id);
       var data1 = everlive.data('Users');
        
        //everlive.Users.getById(groupedData[i].Id);
      data1.getById(groupedData[i].Id).
        then(function(data) {
            console.log("image id   "+'image_'+data.result.Id);
            document.getElementById('image_'+data.result.Id).src ="data:image/"+data.result.imageType+";base64,"+data.result.imageBase64;
           // j++;
        },
        function(error) {
             console.log(JSON.stringify(error));
        });
    }
}
function getCurrentUserPoints() {
    console.log("getCurrentUserPoints");
    var userId = localStorage.getItem('userId');
    var data1 = everlive.data('Users');
    var points;
    data1.getById(userId).then(function(data) {
        if (data.result.points===null) {
            currentUserPoints = 0;
            points = currentUserPoints;
            $('#current_user_score').text(points);
        } else {
            currentUserPoints = data.result.points;
            currentUserName = data.result.DisplayName;
            console.log(data.result.Id);
            points = currentUserPoints;
            $('#current_user_score').text(points);
            $('.User_name').text(currentUserName);
        }
        getUserProfileImage(data.result.imageType , data.result.imageBase64);
    },
    function(error) {
         console.log(JSON.stringify(error));
    });
} 
function getUserProfileImage(imageType , imageString) {
      document.getElementById('img_leaderBoard').src ="data:image/"+imageType+";base64,"+imageString;
      hideLoaderAtLeaderboard();
}
function changeBoardUI() {
    if (kendo.support.mobileOS.wp) {
        $('.leaderboard-content').css('font-size', '25px');
        $('#img_leaderBoard').css('height', '145px');
        $('.header_logo').css('height', '55px');
        $('.header_logo_title').css('font-size', '30px');
        $('.current_user_score').css('font-size', '30px');
        $('.points_text').css('font-size', '20px');
        //  $('#scroller').css('height', '460px');
        
         $('.star-field.field1').css('margin-top', '60%');
         $('.star-field.field2').css('margin-top', '-20%');
         $('.star-field.field3').css('margin-top', '140%');
         $('.star-field').css('left', '-210%');
         $('.star-field.field2').css('margin-left', '80%');
         $('.star-field.field2').css('margin-left', '-70%');
         $('.star-field.field3').css('margin-right', '-5%');
         $('.score_content > h4').css('width', '95%');
         $('#scoreBtn').css('height', '50px');
         $('#scoreBtn').css('margin-left', '35%');
         $('#scoreBtn').css('margin-top', '5%');
    }
}
function trackFeatureLeaderboard() {
    try {
        monitor.Start();
        monitor.TrackFeature("feature.LeaderBoard"); 
        console.log("inside track feature monitor******************");
    }catch (err) {
        console.log('Something went wrong:');
        console.log(err);
    }
}
function showLoaderAtLeaderboard() {
    createLoader();
    //$('<div class="k-overlay" style="z-index: 10002; opacity: 0.5;"></div>').insertBefore('.km-loader');
    $('.leaderboard-content').hide();
    $('.header_logo').hide();
    $('#custom-listview').hide();
    $('.leaderBoard_profile_img').hide();
    $('#img_leaderBoard').hide();
    $('#leadersBoard').hide();
    app.pane.loader.show();
    
}   
function hideLoaderAtLeaderboard() {
        $('#LeaderBoard').css('opacity','1');
        $('.header_logo').show();
        $('#custom-listview').show();
        $('.leaderboard-content').show();
        $('#img_leaderBoard').show();
        $('#leadersBoard').show();
       // $('.k-overlay').remove();
        // $('.leaderBoard_profile_img').show();
        app.pane.loader.hide();  
      console.log($('.leaderboard-content').outerHeight());
      console.log($('.header_logo').outerHeight());
      console.log(Math.floor($('.km-view-title').css('line-height').replace('px', '')));
  
      var contentHeight = ($('.leaderboard-content').outerHeight() + 3 + Math.floor($('.km-view-title').css('line-height').replace('px', '')) + $('.header_logo').outerHeight());
      $('#scroller').css('height', (window.innerHeight-contentHeight)+'px');
      console.log("window.innerHeight-contentHeight**********"+(window.innerHeight-contentHeight));
    
    //getDuretion=new Date().getTime()-getDuretion;
   // console.log("getDuretion is "+getDuretion+"ms");
    
     setImages();
} 