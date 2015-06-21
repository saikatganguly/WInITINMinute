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
     document.getElementById('imgDiv').src = homeImageUrl;
             $('#imgDiv').addClass('img-div');
    trackFeatureHome();
     if (kendo.support.mobileOS.wp) {
         console.log("changeHomeUI**********************");
         //$('#home_logo').removeClass('quiz_info_logo');
        // $('#home_logo').addClass('quiz_info_logo_wp');
          $('.img-div').css('height', '250px');
         $('.km-widget .km-navbar').css('height', '60px');
         $('#appDrawer').css('margin-top', '60px');
         $('.quiz_info_logo').css('height', '150px');
         $('.quiz_info_logo').css('margin-top', '1%');
         $('.span12').css('margin-top', '0%');
         $('#start_btn').css('margin-bottom', '15%');
         $('#start_btn').css('height', '55px');
         if(slideFromLogin && loginFromSocial){
              console.log("changeHomeUI slideFromLogin**********************"+slideFromLogin);
              console.log("changeHomeUI loginFromSocial**********************"+loginFromSocial);
              $('#appDrawer').css('margin-top', '60px');
             //$('.km-header').css('margin-top', '30px');
             slideFromLogin = false;
             loginFromSocial = false;
         }else if(slideFromLogin){
              console.log("changeHomeUI slideFromLogin**********************"+slideFromLogin);
              $('#appDrawer').css('margin-top', '90px');
             $('.km-header').css('margin-top', '30px');
             slideFromLogin = false;
         }
     }
}
function changeHomeUIBefore(){
    
    if(app.view().id === "views/login.html" && kendo.support.mobileOS.wp){
        // $('.km-header').css('margin-top', '90px');
        slideFromLogin = true;
        console.log("changeHomeUIBefore slideFromLogin******************"+slideFromLogin);
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
    function getHomeImage(){
       console.log("getHomeImage*******************");
       
        //var fileId = '827a26c0-14f3-11e5-8fc7-cf9911258a6d'; // the file identifier is retrived from the REST services
           console.log("homeImageId"+homeImageId);
        everlive.Files.getDownloadUrlById(homeImageId)
        .then(function(downloadUrl){
             //setTimeout(function(){
            console.log("downloadUrl "+downloadUrl);
            homeImageUrl = downloadUrl;
            console.log("homeImageUrl "+homeImageUrl);
              isLoggedIn();
           /*$('.img-div-wp').src = downloadUrl
           $('.img-div-wp').css('background','url('+downloadUrl+')');
           $('.img-div-wp').css('background-size','100%');
           $('.img-div-wp').css('background-repeat','no-repeat');*/
        },
        function(error){
            alert(JSON.stringify(error));
            
        });
    }
    /*function showLoaderAtHome() {
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