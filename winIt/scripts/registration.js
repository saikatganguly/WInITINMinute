var everlive = new Everlive({
    apiKey: "elKw1nKoaJB4RIJ8",
    scheme: "http"
});
function showLoaderAtRegistration() {
        app.pane.loader.show();
       $('#registration_email').prop('disabled', true);
       $('#registration_name').prop('disabled', true);
       $('#registration_pwd').prop('disabled', true);
       $('#registration_confirmPwd').prop('disabled', true);
       $("#signup_btn").data("kendoMobileButton").enable(false); 
       $("#login_btn").data("kendoMobileButton").enable(false); 
       $("#fb_btn").data("kendoMobileButton").enable(false); 
       $("#google_btn").data("kendoMobileButton").enable(false); 
       $("#microsoft_btn").data("kendoMobileButton").enable(false); 
} 
function hideLoaderAtRegistration(){
      //setTimeout(function(){
       app.pane.loader.hide();
       $('#registration_email').prop('disabled', false);
       $('#registration_name').prop('disabled', false);
       $('#registration_pwd').prop('disabled', false);
       $('#registration_confirmPwd').prop('disabled', false);
        $("#registration_email").val("");
        $("#registration_name").val("");
        $("#registration_pwd").val("");
        $("#registration_confirmPwd").val("");
       $("#signup_btn").data("kendoMobileButton").enable(true); 
       $("#login_btn").data("kendoMobileButton").enable(true); 
       $("#fb_btn").data("kendoMobileButton").enable(true); 
       $("#google_btn").data("kendoMobileButton").enable(true); 
       $("#microsoft_btn").data("kendoMobileButton").enable(true); 
       //},1000);
}
var registerFlag = false;
function changeRegistrationUI(){
    if (kendo.support.mobileOS.wp) {
        $('.registration_logo').css('height','140px');
        $('.registration_textbox').css('font-size','16px');
        $('.registration_error').css('height','30px');
        $('.registration_textbox').css('font-size','25px');
        $('.registrationContent').css('margin-top','3%');
        $('.registration_option').css('height','70px');
        $('.registration_feild').css('height','45px');
        $('#signup_btn').css('height','55px');
        $('#signup_btn').css('margin-top','5%');
        $('#login_btn').css('height','55px');
        $('#fb_btn').css('height','90px');
        $('#fb_btn').css('width','20%');
        $('#twitter_btn').css('height','90px');
        $('#twitter_btn').css('width','20%');
        $('#google_btn').css('height','90px');
        $('#google_btn').css('width','20%');
        $('#microsoft_btn').css('height','90px');
        $('#microsoft_btn').css('width','20%');
    }
}
function removeMessage(){
    $("#registration_errMsg").text("");
}
function sign_in_from_registration(){
     //$('#login_btn').css('background-color','#B1CB36');
    $('#login_btn').fadeTo(100, 0.1).fadeTo(200, 1.0);
}
function show(){
       $("#header").show("fast");
}
function hide(){
       $("#header").hide("fast");
}
function validateRegistration(){
    //alert("inside validateRegistration");
    var validatable = $("#registerForm").kendoValidator().data("kendoValidator");  
    if (validatable.validate()){  
      // alert("inside validate");
       var Pwd = $('#registration_pwd').val();
      var confirmPwd = $('#registration_confirmPwd').val();
         if(!(Pwd === confirmPwd)){
             $('#registration_errMsg').append('both Password should be match');
            $('#registration_confirmPwd').val("");
             // $('#registration_confirmPwd').focus();
            registerFlag=false;
        }
        else{
           showLoaderAtRegistration();
           registerFlag = true;  
            register();
        }  
   }
    else{
        console.log("inside error of validation");
        $("#registration_email").val("");
        $("#registration_name").val("");
        $("#registration_pwd").val("");
        $("#registration_confirmPwd").val("");
       registerFlag=false;
    } 
    $('body').css('pointer-events','visible');
        return registerFlag;   
}
function register(){
    $('#signup_btn').fadeTo(100, 0.1).fadeTo(200, 1.0);
    //$('#signup_btn').css('background-color','#3FCDE1');
    changeRegistrationUI();
    var username = $("#registration_email").val();
    var password = $("#registration_pwd").val();
   
            var attrs = {
                Email: $("#registration_email").val(),
                DisplayName: $("#registration_name").val(),
                city: city,
                country: country
            }
                everlive.Users.register(username,
                password,
                attrs,
                function(data) {
                     console.log(JSON.stringify(data));
                    var registeredUserId = data.result.Id;
                     console.log("registeredUserId****************"+registeredUserId);
                    updateProfileImage(registeredUserId);
                   // uploadDefaultImage(registeredUserId);
                },
                function(error) {
                    alert(JSON.stringify(error));
                });
}
function updateProfileImage(registeredUserId){
    var fileId = defaultProfileImageId;
    var data1 = everlive.data('Users');
    data1.updateSingle({'Id': registeredUserId, 'ProfileImage': fileId, 'isImageProvided' : 'false' },
    function(data){
       // alert("ProfileImage****************"+data.result.ProfileImage);
        hideLoaderAtRegistration();
        console.log("ProfileImage Updated Successfully****************");
        alert("User created Successfully****************");
    },
    function(error){
        alert(JSON.stringify(error));
    }); 
} 
var googleapi = {
    authorize: function(options,appBrowser) {
        console.log("=====================Startig google login====================");
        var deferred = $.Deferred();
        var authUrl = 'https://accounts.google.com/o/oauth2/auth?' + $.param({
            client_id: options.client_id,
            redirect_uri: options.redirect_uri,
            response_type: 'code',
            scope: options.scope
        });
        console.log(authUrl);
        appBrowser = window.open(authUrl, '_blank', 'location=no,toolbar=no');
               /* setTimeout(function(){
                  appBrowser = window.open(authUrl, '_blank', 'location=no,toolbar=no');
                },500);*/
        $(appBrowser).on('loadstart', function(e) {
            console.log(e.originalEvent.url);
            var url = e.originalEvent.url;
            var code = /\?code=(.+)$/.exec(url);
            var error = /\?error=(.+)$/.exec(url);
            console.log(code+"========"+error);

            if (code || error) {
                //Always close the browser when match is found
                appBrowser.close();
            }

            if (code) {
                //Exchange the authorization code for an access token
                $.post('https://accounts.google.com/o/oauth2/token', {
                    code: code[1],
                    client_id: options.client_id,
                    client_secret: options.client_secret,
                    redirect_uri: options.redirect_uri,
                    grant_type: 'authorization_code'
                }).done(function(data) {
                    deferred.resolve(data);
                }).fail(function(response) {
                    deferred.reject(response.responseJSON);
                });
            } else if (error) {
                //The user denied access to the app
                deferred.reject({
                    error: error[1]
                });
            }
        });

        return deferred.promise();
    }
};

function logInGoogle() {
    alert("logingoogle");
    $('#google_btn').fadeTo(100, 0.1).fadeTo(200, 1.0);
    $('#google_btn_registration').fadeTo(100, 0.1).fadeTo(200, 1.0);
    var appBrowser;
    googleapi.authorize({
        client_id: '400469019178-s6ess817q9lb22l5jmrf9o8bjqr9vmol.apps.googleusercontent.com',
        client_secret: '2unax4_pBRkw6GdzauRDB-M4',
        redirect_uri: 'http://localhost',
        scope: 'https://www.googleapis.com/auth/plus.me'
    },appBrowser).done(function(data) {
        console.log(JSON.stringify(data));
        everlive.Users.loginWithGoogle(data.access_token,
            function (data) {
                alert(JSON.stringify(data));
                var accessToken = data.result.access_token;
                alert("Successfully logged the user in! Received access token: " + accessToken);
                localStorage.setItem('access-token', accessToken);
                loginFromSocial = true;
                app.navigate("views/home.html","slide");
            },
            function(error){
                alert("everlive"+JSON.stringify(error));
            });
    }).fail(function(data) {
        alert("err"+JSON.stringify(data));
    });
}
/*********************************Microsoft Login************************************/
var microsoftapi = {
    authorize: function(options) {
        var deferred = $.Deferred();
        var authWindow; 
        //Build the OAuth consent page URL
        var authUrl = 'https://login.live.com/oauth20_authorize.srf?client_id='+ options.client_id+'&response_type=token&scope='+options.scope;
        console.log(authUrl);
        
                  authWindow=window.open(authUrl, '_blank', 'location=no,toolbar=no');
               
             
        // window.open(authUrl, '_blank', 'location=no,toolbar=no');

       $(authWindow).on('loadstart', function(e) {
            var url = e.originalEvent.url;
            var code = /\#access_token=(.+)$/.exec(url);
            var error = /\#error=(.+)$/.exec(url);
            if (code || error) {
                //Always close the browser when match is found
                authWindow.close();
            }
            if (code) {
                console.log(url)
                var verifier = '';
        		var params = url.substr(url.indexOf('#') + 1);
                params = params.split('&');
        		for (var i = 0; i < params.length; i++) {
        			var y = params[i].split('=');
        			if (y[0] === 'access_token') {
        				verifier = y[1];
        			}
        		}
                var data={access_token:verifier}
                console.log(JSON.stringify(data))
                deferred.resolve(data);
            } else if (error) {
                //The user denied access to the app
                deferred.reject({
                    error: error[1]
                });
            }
        });

        return deferred.promise();
    }
};
function logInMicrosoft() {
    
     $('#microsoft_icon_height').fadeTo(150, 0.1).fadeTo(200, 1.0);
     microsoftapi.authorize({
            client_id: '000000004414C775',
            client_secret: 'TbuaTGfehBcy93bBI8AtOmp-N4xVTFYW',
            scope: 'wl.signin'
        }).done(function(data) {
         console.log(JSON.stringify(data))
        everlive.Users.loginWithLiveID(data.access_token,
            function (data) {
                alert(JSON.stringify(data));
                var accessToken = data.result.access_token;
                //alert("Successfully logged the user in! Received access token: " + accessToken);
                localStorage.setItem('access-token', accessToken);
                loginFromSocial = true;
                app.navigate("views/home.html","slide");
            },
            function(error){
                alert("everlive"+JSON.stringify(error));
            });
    }).fail(function(data) {
        alert("err"+JSON.stringify(data));
    });
}
function removeMessage(id){
    $("#registration_errMsg").text("");
    $("#"+id).css('display','none');
    $("#"+id).text("");
}



/*function validateForm(){
   var userName= $('#registration_name').val();
    if(userName==''){
         $('#registration_name_err').css('display','inline-block');
        $('#registration_name_err').html('<span class="k-icon k-warning"> </span>');
        $('#registration_name_err').append('Enter user name foe registration');
        $('#registration_name').focus();
    }
    flag = false;
}*/

/*function getBase64Image() {
      console.log("registration  getBase64Image************************");
    var preview = document.getElementById("preview");
    var fileToUpload =  document.getElementById("fileToUpload");
   
    fileToUpload.setAttribute('value','../images/1.png');
     alert(fileToUpload.value);
    $('#fileToUploadForm').submit();
   // if(){}
    var file    = fileToUpload.files[0];
     var reader  = new FileReader();

          reader.onloadend = function () {
              preview.src = reader.result;
              var imageData = preview.src;
               alert(imageData.split(",")[1]);
          }

              reader.readAsDataURL(file);
    //console.log(file);
    // alert(fileToUpload.value);
    /* var c = document.getElementById("myCanvas");
      var img = document.getElementById("preview");
      c.width = img.width;
      c.height = img.height;
      var ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0);
     alert(c.toDataURL("image/png").split(",")[1]);
      var imageData = c.toDataURL().split(",")[1];
    return imageData;
}*/
/*function uploadDefaultImage(registeredUserId){
    var name = $('#registration_name').val();
    var fileName = name+'.png';
    alert("uploadDefaultImage");
  //  var imageData = getBase64Image();
       /* var file = {
            "Filename": fileName,
            "ContentType": "image/png",
            "CustomField": "customValue",
            "base64": imageData
        };
        everlive.Files.create(file,
            function (data) {
                 console.log(JSON.stringify(data));
                // Show the captured photo.
                var fileId = data.result.Id;
               console.log("fileId****************"+fileId);
                updateProfileImage(registeredUserId,fileId);
            },
            function (error) {
                alert(JSON.stringify(error));
            });
    /* var imageURI = "images/1.png"; // the retrieved URI of the file on the file system, e.g. using navigator.camera.getPicture()
        var uploadUrl = everlive.Files.getUploadUrl();
        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = fileName;
        options.mimeType = "image/png";
        options.headers = everlive.buildAuthHeader();

        var ft = new FileTransfer();
        ft.upload(imageURI, uploadUrl, function(r) {
            alert("uploading....");
            var res = JSON.parse(r.response);
            var uploadedFileId = res.Result[0].Id;
            var uploadedFileUri = res.Result[0].Uri;
             $('#profileImage').src = uploadedFileUri;
               console.log("fileId****************"+uploadedFileId);
              //  updateProfileImage(registeredUserId,uploadedFileId);
            // use the Id and the Uri of the uploaded file 
        }, function(error) {
            alert("An error has occurred:" + JSON.stringify(error));
            console.log( JSON.stringify(error));
        }, options)
}*/

     