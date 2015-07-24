var registerFlag = false;

var everlive = new Everlive({
                                apiKey: "elKw1nKoaJB4RIJ8",
                                scheme: "http"
                            });

function clearData() {
    $("#registration_email").val("");
    $("#registration_name").val("");
    $("#registration_pwd").val("");
    $("#registration_confirmPwd").val("");
    $('.k-tooltip-validation').css('display', 'none');
}
function showLoaderAtRegistration() {
    createLoader();
    app.pane.loader.show();
    $('#registration_email').prop('disabled', true);
    $('#registration_name').prop('disabled', true);
    $('#registration_pwd').prop('disabled', true);
    $('#registration_confirmPwd').prop('disabled', true);
    $("#signup_btn").data("kendoMobileButton").enable(false); 
    $("#login_btn").data("kendoMobileButton").enable(false); 
} 
function hideLoaderAtRegistration() {
    //setTimeout(function(){
    app.pane.loader.hide();
    $('#registration_email').prop('disabled', false);
    $('#registration_name').prop('disabled', false);
    $('#registration_pwd').prop('disabled', false);
    $('#registration_confirmPwd').prop('disabled', false);
    $("#signup_btn").data("kendoMobileButton").enable(true); 
    $("#login_btn").data("kendoMobileButton").enable(true); 
    //},1000);
}
function changeRegistrationUI() {
    clearData();
    if (kendo.support.mobileOS.wp) {
        $('.registration_logo').css('height', '140px');
        $('.registration_textbox').css('font-size', '16px');
        $('.registration_error').css('height', '30px');
        $('.registration_textbox').css('font-size', '25px');
        $('.registrationContent').css('margin-top', '3%');
        $('.registration_option').css('height', '70px');
        $('.registration_feild').css('height', '45px');
        $('#signup_btn').css('height', '55px');
        $('#signup_btn').css('margin-top', '5%');
        $('#login_btn').css('height', '55px');
    }
}
function showError(error_id, text) {
    /* $('#'+error_id).text(text+' already exists!');
    $('#'+error_id).css('display','inline-block');*/
    //hideError(error_id);
    $('#' + error_id + '>span').css('display', 'inline-block');
    $('#' + error_id + '>span').addClass('k-widget');
    $('#' + error_id + '>span').addClass('k-tooltip');
    $('#' + error_id + '>span').addClass('k-tooltip-validation');
    $('#' + error_id + '>span').css('display', 'inline-block');
    $('#' + error_id + '>span').attr('role', 'alert');
    $('#' + error_id + '>span').append('<span class="k-icon k-warning"> </span>');
    $('#' + error_id + '>span').append(text);
}
function hideError(error_id) {
    console.log("hideError    " + error_id);
    $('#' + error_id + '>span').removeClass('k-widget');
    $('#' + error_id + '>span').removeClass('k-tooltip');
    $('#' + error_id + '>span').removeClass('k-tooltip-validation');
    $('.k-icon k-warning').remove();
    $('#' + error_id + '>span').text('');
}
function removeMessage() {
    $("#registration_errMsg").text(""); 
}
function sign_in_from_registration() {
    //$('#login_btn').css('background-color','#B1CB36');
    $('#login_btn').fadeTo(100, 0.1).fadeTo(200, 1.0);
}
function validateRegistration() {
    console.log("inside validateRegistration");
    var validatable = $("#registerForm").kendoValidator().data("kendoValidator");  
    if (validatable.validate()) {  
        console.log("inside validate");
        
        var Pwd = $('#registration_pwd').val();
        var confirmPwd = $('#registration_confirmPwd').val();
        if (!(Pwd === confirmPwd)) {
            $('#registration_errMsg').append('Both Password should match');
            $('#registration_confirmPwd').val("");
            // $('#registration_confirmPwd').focus();
            registerFlag = false;
        }else {
            showLoaderAtRegistration();
            registerFlag = true;  
            register();
        }  
        /*else{
        var display_Name = $('#registration_name').val()
        checkNameDuplicacy(display_Name);
        }*/
        /* if(isExists){
        console.log("in if   ");
        $('#nameError').text('Display Name already exists! Try different one');
        registerFlag=false;
        }
        else{
        showLoaderAtRegistration();
        registerFlag = true;  
        register();
        }  */
    } else {
        console.log("inside error of validation");
        /*$("#registration_email").val("");
        $("#registration_name").val("");
        $("#registration_pwd").val("");
        $("#registration_confirmPwd").val("");*/
        registerFlag = false;
    } 
    $('body').css('pointer-events', 'visible');
    return registerFlag;   
}
function checkNameDuplicacy(display_Name) {
    console.log('checkNameDuplicacy  display_Name  ' + display_Name);
    hideError('registration_option_for_name');
    showLoaderAtRegistration();
    if(display_Name !== ''){
        var filter = { "DisplayName" : display_Name };
  
        //Ajax request using jQuery
        everlive.data('Users').count(filter, 
             function(data) {
                 console.log("checkNameDuplicacy success data   " + JSON.stringify(data));
                 if (data.result  > 0) {
                     console.log("checkNameDuplicacy  in if count  " + data.result);
                     hideLoaderAtRegistration();
                     showError('registration_option_for_name', 'Display Name already exist');
                     $("#registration_name").val("");
                     registerFlag = false;
                 } else {
                     console.log("checkNameDuplicacy else count  " + data.result);
                     hideLoaderAtRegistration();
                     // checkEmailDuplicay(email);
                     /*showLoaderAtRegistration();
                     registerFlag = true;  
                     register();*/
                 }  
             },
             function(error) {
                 console.log("checkNameDuplicacy error  " + JSON.stringify(error));
                 console.log(JSON.stringify(error));
             }); 
    }
    else{
        hideLoaderAtRegistration();
        showError('registration_option_for_name', 'Enter Display Name');
    }
    
}
function checkEmailDuplicay(email) {
    showLoaderAtRegistration();
    hideError('registration_option_for_email');
    console.log('checkEmailDuplicay  email  ' + email);
    if(email !== ''){
        var filter = {"Email" :  email} ;
    
        everlive.data('Users').count(filter, 
             function(data) {
                 console.log('checkEmailDuplicay success data   ' + JSON.stringify(data));
                 if (data.result > 0) {
                     console.log('checkEmailDuplicay in if  ' + data.result);
                     hideLoaderAtRegistration();
                     showError('registration_option_for_email', 'Email already exist');
                     $("#registration_email").val("");
                     registerFlag = false;
                 } else {
                     console.log('checkEmailDuplicay in else  ' + data.result);
                     hideLoaderAtRegistration();
                     /* showLoaderAtRegistration();
                     registerFlag = true;  
                     register();*/
                 }  
             },
             function(error) {
                 console.log('checkEmailDuplicay error   ' + JSON.stringify(error));
                 console.log(JSON.stringify(error));
             }); 
    }
    else{
        hideLoaderAtRegistration();
        showError('registration_option_for_email', 'Enter Email');
    }
}
function register() {
    $('#signup_btn').fadeTo(100, 0.1).fadeTo(200, 1.0);
    //$('#signup_btn').css('background-color','#3FCDE1');
    // changeRegistrationUI();
    var username = $("#registration_name").val();
    var password = $("#registration_pwd").val();
    console.log('register  username  ' + username + ' , password' + password);
    var attrs = {
        Email: $("#registration_email").val(),
        DisplayName: $("#registration_name").val()
    }
    everlive.Users.register(username,
         password,
         attrs,
         function(data) {
             console.log('register succes data   ' + JSON.stringify(data));
             var registeredUserId = data.result.Id;
             console.log("register  registeredUserId****************" + registeredUserId);
             updateRegistrationDetails(registeredUserId);
             // uploadDefaultImage(registeredUserId);
         },
         function(error) {
             console.log("register error   " + JSON.stringify(error));
             hideLoaderAtRegistration();
             //showError('emailError', 'Email')
         });
}
function updateRegistrationDetails(registeredUserId) {
    console.log('updateRegistrationDetails  city  ' + city + ' , country' + country);
    var points = 0;
    var trialFlag = localStorage.getItem('trialFlag');
    if(trialFlag === 'true'){
        points = Number(localStorage.getItem('trialPoints'));
    }
    var data1 = everlive.data('Users');
    data1.updateSingle({
         'Id': registeredUserId, 'imageBase64': defaultImageString, 'imageType' : 'png', 
         'city': city, 'country': country, 'points': points
     },
     function(data) {
         // alert("ProfileImage****************"+data.result.ProfileImage);
         console.log("updateRegistrationDetails ProfileImage Updated Successfully****************" + JSON.stringify(data));
         console.log("User created Successfully****************");
         login(true);
         localStorage.setItem('trialFlag', 'false');
         localStorage.removeItem('trialPoints');
         hideLoaderAtRegistration();
         clearData();
     },
     function(error) {
         console.log("updateRegistrationDetails error   " + JSON.stringify(error));
         console.log(JSON.stringify(error));
     }); 
}
 
var googleapi = {
    authorize: function(options, appBrowser) {
        console.log("=====================Startig google login====================");
        var deferred = $.Deferred();
        var authUrl = 'https://accounts.google.com/o/oauth2/auth?' + 
                      $.param({
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
            console.log(code + "========" + error);

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
    console.log("logingoogle");
    $('#google_btn').fadeTo(100, 0.1).fadeTo(200, 1.0);
    $('#google_btn_registration').fadeTo(100, 0.1).fadeTo(200, 1.0);
    //alert(localStorage.getItem('userId'));
    var appBrowser;
    googleapi.authorize({
                  client_id: '400469019178-s6ess817q9lb22l5jmrf9o8bjqr9vmol.apps.googleusercontent.com',
                  client_secret: '2unax4_pBRkw6GdzauRDB-M4',
                  redirect_uri: 'http://localhost',
                 // scope: 'https://www.googleapis.com/auth/plus.me'
                  scope: 'https://www.googleapis.com/auth/userinfo.email'

              }, appBrowser).done(function(data) {
                  console.log("logingoogle success data  " + JSON.stringify(data));
                  everlive.Users.loginWithGoogle(data.access_token,
                   function (data) {
                       console.log("logInGoogle  everlive success data   " + JSON.stringify(data));
                       console.log(".............................");
                       console.log("logInGoogle  everlive success data   " + JSON.stringify(data));
                       var accessToken = data.result.access_token;
                       console.log("Successfully logged the user in! Received access token: " + accessToken);
                       localStorage.setItem('access-token', accessToken);
                       //loginFromSocial = true;
                       if (data.result.hasOwnProperty('Id')) {
                           localStorage.setItem('userId', data.result.Id);
                           localStorage.setItem('googleId', data.result.Id);
                           insertSocialLoginDetails(data.result.Id);
                       }else{
                           console.log('googleId >>>>>>>>>>'+localStorage.getItem('googleId'));
                           localStorage.setItem('userId', localStorage.getItem('googleId'));
                           localStorage.setItem('trialFlag', 'false');
                           localStorage.removeItem('trialPoints');
                           app.navigate("views/home.html","slide");
                       }
                   },
                   function(error) {
                       console.log("logingoogle  everlive error   " + JSON.stringify(error));
                       if(error.code === 211){
                            $("#errLoginMsg").text(error.message);
                       }
                   });
              }).fail(function(data) {
                  console.log("logingoogle fail error   " + JSON.stringify(data));
                  console.log(JSON.stringify(data));
              });
}

/*********************************Microsoft Login************************************/
var microsoftapi = {
    authorize: function(options) {
        var deferred = $.Deferred();
        var authWindow; 
        //Build the OAuth consent page URL
        var authUrl = 'https://login.live.com/oauth20_authorize.srf?client_id=' + options.client_id + '&response_type=token&scope=' + options.scope;
        console.log(authUrl);
        
        authWindow = window.open(authUrl, '_blank', 'location=no,toolbar=no');
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
                var data = {access_token:verifier}
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
    console.log("logInMicrosoft");
    $('#microsoft_icon_height').fadeTo(150, 0.1).fadeTo(200, 1.0);
    microsoftapi.authorize({
                  client_id: '000000004414C775',
                  client_secret: 'TbuaTGfehBcy93bBI8AtOmp-N4xVTFYW',
                  //scope: 'wl.signin'
                  scope: 'wl.emails'
              }).done(function(data) {
                  console.log("logInMicrosoft  success data  " + JSON.stringify(data));
                  everlive.Users.loginWithLiveID(data.access_token,
                   function (data) {
                       console.log("logInMicrosoft  everlive data  " + JSON.stringify(data));
                       var accessToken = data.result.access_token;
                       console.log("logInMicrosoft  Successfully logged the user in! Received access token: " + accessToken);
                       localStorage.setItem('access-token', accessToken);
                      // loginFromSocial = true;
                       if (data.result.hasOwnProperty('Id')) {
                           localStorage.setItem('userId', data.result.Id);
                           localStorage.setItem('msLiveId', data.result.Id);
                           insertSocialLoginDetails(data.result.Id);
                       }else{
                           console.log('msLiveId >>>>>>>>>>'+localStorage.getItem('msLiveId'));
                           localStorage.setItem('userId', localStorage.getItem('msLiveId'));
                           localStorage.setItem('trialFlag', 'false');
                           localStorage.removeItem('trialPoints');
                           app.navigate("views/home.html","slide");
                       }
                   },
                   function(error) {
                       console.log("logInMicrosoft  everlive data  " + JSON.stringify(error));
                       if(error.code === 211){
                            $("#errLoginMsg").text(error.message);
                       }
                   });
              }).fail(function(data) {
                  console.log("logInMicrosoft  error  " + JSON.stringify(data));
                  console.log(JSON.stringify(data));
              });
}
function removeMessage(id) {
    console.log("removeMessage id  " + id);
    $("#registration_errMsg").text("");
    $("#" + id).css('display', 'none');
    $("#" + id).text("");
}

function insertSocialLoginDetails(registeredId) {
    console.log("insertSocialLoginDetails  " + registeredId);
    console.log(city + " , " + country);
    var data1 = everlive.data('Users');
    
    data1.getById(registeredId).then(function(data){
         console.log("****************" + JSON.stringify(data));
         var filter = new Everlive.Query();
         filter.where().equal('DisplayName',  data.result.DisplayName );
       //  var filter = { "DisplayName" : data.result.DisplayName };
          var displayName =  data.result.DisplayName;
        //Ajax request using jQuery
        everlive.data('Users').count(filter, 
             function(data) {
               // alert(JSON.stringify(data));
                 if (data.result > 0) {
                     updateSocialLoginDetails(data1, registeredId,displayName+data.result);
                 } else {
                     updateSocialLoginDetails(data1, registeredId, displayName);
                 }  
             },
             function(error) {
                 console.log("checkNameDuplicacy error  " + JSON.stringify(error));
                 console.log(JSON.stringify(error));
             }); 
    },
    function(error){
        console.log("getPoints Error  "+JSON.stringify(error));
    });
   
}
function updateSocialLoginDetails(data1, registeredId, displayName){
    var trialFlag = localStorage.getItem('trialFlag'),
    points = 0;
    if(trialFlag === 'true'){
        points = Number(localStorage.getItem('trialPoints'));
    }
     data1.updateSingle({
             'Id': registeredId, 'DisplayName': displayName, 'imageBase64': defaultImageString, 'imageType' : 'png', 
             'city': city, 'country': country, 'points': points
         },
         function(data) {
             // alert("ProfileImage****************"+data.result.ProfileImage);
             //hideLoaderAtRegistration();
             console.log("insertSocialLoginDetails Updated Successfully****************" + JSON.stringify(data));
             localStorage.setItem('trialFlag', 'false');
             localStorage.removeItem('trialPoints');
             app.navigate("views/home.html", "slide");
             console.log("Successfully logged the user in!");
         },
         function(error) {
             console.log("insertSocialLoginDetails error  " + JSON.stringify(error));
             console.log(JSON.stringify(error));
        }); 
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

     