var homeImageUrl;
 function openQuizCategory(){
      app.navigate("views/quiz_category.html","slide"); 
 }
function startQuiz(){
    if(isQuizVisited === false){
         console.log("isQuizVisited******************"+isQuizVisited);
         $('#start_btn').fadeTo(100, 0.1).fadeTo(200, 1.0);
        setTimeout(function(){
            app.navigate("views/quiz.html","slide");
            initQuiz();
        },500);
    }
    else{
        restart();
    }
}
function changeHomeUI(){
    setTimeout(function(){
        $('.km-scroll-container').attr('style','-webkit-transform:translate3d(0px, 0px, 0px) scale(1)');
        $('.km-vertical-scrollbar').attr('style','-webkit-transform:translate3d(0px, 0px, 0px) scale(1)');
    },200);
    var trialFlag = localStorage.getItem('trialFlag');
    trackFeatureHome();
     if (kendo.support.mobileOS.wp) {
         console.log("changeHomeUI**********************");
         $('.img-div').css('height', '250px');
        // $('#appDrawer').css('margin-top', '11.3%');
         $('.quiz_info_logo').css('height', '150px');
         $('.quiz_info_logo').css('margin-top', '1%');
         $('.span12').css('margin-top', '0%');
         $('#start_btn').css('margin-bottom', '15%');
         $('#start_btn').css('height', '55px');
     }
    
     if(trialFlag === 'true'){
        $('#drawerBtn').hide();
     }else{
        $('#drawerBtn').show();
     }
}
function changeHomeUIBefore(e){
     createLoader();
     if(homeImageId === null){
         document.getElementById('imgDiv').src = 'images/about_img.png';
         $('#imgDiv').addClass('img-div');
    }else{
        if(typeof homeImageUrl === 'undefined'){
            getHomeImage();
        }
        else{
            console.log("homeImageUrl "+homeImageUrl);
            document.getElementById('imgDiv').src = homeImageUrl;
            $('#imgDiv').addClass('img-div');
        }
    }
}
function trackFeatureHome(){
     try{
         monitor.Start();
         monitor.TrackFeature("feature.Home"); 
         console.log("inside track feature monitor******************");        
         //alert("after track feature");
     }
     catch(err) {
        console.log('Something went wrong:');
    	console.log(err);
     }
}
function getHomeImage() {
       console.log("getHomeImage*******************");
       
        //var fileId = '827a26c0-14f3-11e5-8fc7-cf9911258a6d'; // the file identifier is retrived from the REST services
           console.log("homeImageId"+homeImageId);
        everlive.Files.getDownloadUrlById(homeImageId)
        .then(function(downloadUrl){
             //setTimeout(function(){
             console.log("getHomeImage  downloadUrl "+downloadUrl);
             homeImageUrl = downloadUrl;
             console.log("getHomeImage  homeImageUrl "+homeImageUrl);
             if (kendo.support.mobileOS.wp) {
                 console.log("changeHomeUI**********************");
                document.getElementById('imgDiv').style.height = 250+'px';
             }
             
             $('#imgDiv').addClass('img-div');
             document.getElementById('imgDiv').src = homeImageUrl;
            
            
              //isLoggedIn();
           /*$('.img-div-wp').src = downloadUrl
           $('.img-div-wp').css('background','url('+downloadUrl+')');
           $('.img-div-wp').css('background-size','100%');
           $('.img-div-wp').css('background-repeat','no-repeat');*/
        },
        function(error){
            console.log(JSON.stringify(error));
            
        });
}
    /*function showLoaderAtHome() {
createLoader();
        $('#home_logo').hide();
        $('.span12').hide();
        $('.start_btnDiv').hide();
        $('#imgDiv').hide();
         app.pane.loader.show();
      setTimeout(function(){
              app.pane.loader.hide();
                  $('#home_logo').show();
                 $('.span12').show();
                  $('.start_btnDiv').show();
                $('.img-div').show();
          },1000);
    }  */