var flag = true;
var userName = null;
var userAddress = null;

function removePwdMessage(id){
    $("#errMsg").text("");
    $("#"+id).css('display','none');
    $("#"+id).text("");
}
function clearData(){
    $('#old-password').val(''); 
    $('#new-password').val('');
    $("#errMsg").text("");   
}
function changeProfileUI(){
    $("#currentUserName").prop('disabled', true);
    $("#currentUserAdd").prop('disabled', true);
    if(kendo.support.mobileOS.wp){
        console.log("changeProfileUI");
        $('#profileImage').css('width','38%');
        $('#profileImage').css('height','178px');
        $('#popoverBtn').css('width','40.8%');
        $('#popoverBtn').css('height','190px');
        $('#profileImage').css('position','fixed');
        $('#popoverBtn').css('position','fixed');
        $('.details-content').css('margin-top','50%');
        $('.details-content').css('position','fixed');
        $('.details').css('height','40px');
        $('#updateUser').css('height','55px');
        $('#errMsg').css('height','65px');
        $('.textbox').css('font-size','23px');
        $('.details-content > .subContent > form > .details > input').css('margin-top','-.5%');
        //$('.details-content > .details > input').css('margin-top','-1%');
        //$('.km-header').css('position','fixed');
        $('body').css('position','fixed');
    }
}
$(document).on("focus", "input", function (e) {
    var inputId = $(this).attr('id');
    if(app.view().id === 'views/my_profile.html'){
         var container = $('.km-scroll-container'),
        scrollTo = $('#'+inputId);

        setTimeout((function() {
            container.animate({
                scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
            });
        }), 500);
         /*setTimeout(function(){
           // alert("window.innerHeight "+window.innerHeight);
           
            if(window.innerHeight < initialScreenHeight){
                var keyboardHeight = window.innerHeight - initialScreenHeight;
                keyboardHeight = -keyboardHeight;
                $('#'+inputId).attr('style','-webkit-transform:translate3d(0px,'+keyboardHeight+'px, 0px) scale(1)');
                $('.km-scroll-container').attr('style','-webkit-transform-origin: 0% 0%');
            }
         }, 200); */
    }
});
$(document).on("blur", "input", function (e) {
    console.log("blur "+$(this).attr('id'));
    var inputId = $(this).attr('id');
    
        e.preventDefault();
    	e.stopPropagation();
    	window.scrollTo(0, 0);
	
    if(!(app.view().id === 'views/login.html' || app.view().id === 'views/registration.html')
            && inputId !== 'old-password' && inputId !== 'new-password'){
        console.log("keyup");
        $( "#"+inputId).prop('disabled', true);
    }
    
});
$(document).on("keyup", "input", function (e) {
    
    console.log("keypress "+$(this).attr('id'));
    var inputId = $(this).attr('id');
    var keycode = (e.keyCode ? e.keyCode : e.which);
      console.log("keycode   "+keycode);
    if(keycode === 13 ){
         console.log("keycode in if "+keycode);
         $('#'+inputId).blur();
    }
});
function callBeforeLoadingFunctions(){
    trackFeatureMyProfile();
    changeProfileUI();
    showLoaderAtProfile();
    getDetails();
}
function getDetails(){
    console.log("getDetails******************");
    userId = localStorage.getItem('userId');
    var data1 = everlive.data('Users');
    
    data1.getById(userId).then(function(data){
        console.log("getDetails  success data******************"+JSON.stringify(data));
        console.log("getDetails  Name******************"+data.result.DisplayName);
        console.log("getDetails  imageBase64******************"+data.result.imageBase64);
        console.log("getDetails  imageType ******************** "+data.result.imageType);
      
        userName = data.result.DisplayName;
        $('#currentUserName').val(userName);
        //userImageId = data.result.ProfileImage;
       // isImageProvided = data.result.isImageProvided;
       // var imageBase64 = data.result.imageBase64;
        var profileImage = document.getElementById('profileImage');
        profileImage.src = "data:image/"+data.result.imageType+";base64,"+data.result.imageBase64;
        /*if(userImageId !== null){
            getUserProfileImage(userImageId);
            profileImage.style.display = 'block';
            //$('#profileImage').css('display','block');
        }*/
       
        if(data.result.hasOwnProperty('address') !== ''){
            console.log("getDetails address******************"+data.result.address);
            userAddress = data.result.address;
            $('#currentUserAdd').val(userAddress);
        }
        else{
            userAddress = '';
            $('#currentUserAdd').val('');
        }
        hideLoaderAtProfile();
    },
    function(error){
        hideLoaderAtProfile();
        console.log(JSON.stringify(error));
    });
}
function id(element) {
    return document.getElementById(element);
}
function startCamera(){
        cameraApp = new cameraApp();
        cameraApp.run();
}
function cameraApp(){}

cameraApp.prototype={
    _pictureSource: null,
    
    _destinationType: null,
    
    run: function(){
        var that=this;
	    that._pictureSource = navigator.camera.PictureSourceType;
	    that._destinationType = navigator.camera.DestinationType;
	    id("capturePhotoButton").addEventListener("click", function(){
            that._capturePhoto.apply(that,arguments);
        });
	    id("getPhotoFromLibraryButton").addEventListener("click", function(){
            that._getPhotoFromLibrary.apply(that,arguments)
        });
    },
    
    _capturePhoto: function() {
        var that = this;
        
        // Take picture using device camera and retrieve image as base64-encoded string.
        navigator.camera.getPicture(function(){
            that._onPhotoDataSuccess.apply(that,arguments);
        },function(){
            that._onFail.apply(that,arguments);
        },{
            quality: 50,
            destinationType: that._destinationType.DATA_URL,
            encodingType: Camera.EncodingType.PNG,
            correctOrientation : true
        });
    },
    
    _getPhotoFromLibrary: function() {
        var that= this;
        // On Android devices, pictureSource.PHOTOLIBRARY and
        // pictureSource.SAVEDPHOTOALBUM display the same photo album.
        that._getPhoto(that._pictureSource.PHOTOLIBRARY);         
    },
    
    _getPhoto: function(source) {
        var that = this;
        // Retrieve image file location from specified source.
        navigator.camera.getPicture(function(){
            that._onPhotoDataSuccess.apply(that,arguments);
        }, function(){
            cameraApp._onFail.apply(that,arguments);
        }, {
            quality: 50,
            destinationType: cameraApp._destinationType.DATA_URL,
            sourceType: source,
            encodingType: Camera.EncodingType.PNG,
            correctOrientation : true
        });
    },
    
    _onPhotoDataSuccess: function(imageData) {
         app.pane.loader.show();
        setTimeout(function(){
            $('#my_profile').css('opacity', '0.3');
            $('#my_profile').prop('disabled', true);
            $('#old-password').prop('disabled', true);
            $('#new-password').prop('disabled', true);
            $("#nameEdit").data("kendoMobileButton").enable(false); 
            $("#addressEdit").data("kendoMobileButton").enable(false); 
            $("#updateUser").data("kendoMobileButton").enable(false); 
        }, 600);
       
        app.pane.loader.show();
        $("#options").data("kendoMobilePopOver").close();
        console.log("_onPhotoDataSuccess***********************");
        updateImageFile(imageData);
        /*if(isImageProvided === "true"){
            console.log("isImageProvided true  "+isImageProvided);
            updateImageFile(imageData);
        }else{
            console.log("isImageProvided false  "+isImageProvided);
            uploadImageFile(imageData);
        }*/
    },
    
    _onFail: function(message) {
         console.log(message);
    }
}
function updateImageFile(imageData){
        console.log("updateImageFile");
        var userId = localStorage.getItem('userId');
        var data1 = everlive.data('Users');
        data1.updateSingle({'Id': userId, 'imageBase64' : imageData, 'imageType' : 'png'},
        function(data){
            console.log("updateImageFile success data******************"+JSON.stringify(data));
            getDetails();
           /* var profileImage = document.getElementById('profileImage');
            profileImage.style.display = 'none';
            profileImage.src = "data:image/jpeg;base64," + imageData;
             profileImage.style.display = 'block';*/
            //getUserProfileImage(fileId);
          //  hideLoaderAtProfile();
             console.log("ProfileImage Updated Successfully!");
        },
        function(error){
            hideLoaderAtProfile();
             console.log(JSON.stringify(error));
        });
}
/*function  uploadImageFile(imageData){
    console.log("uploadImageFile");
        var userId = localStorage.getItem('userId');
        var data1 = everlive.data('Users');
        data1.updateSingle({'Id': userId, 'imageBase64' : imageData },
        function(data){
            console.log(JSON.stringify(data));
            var profileImage = document.getElementById('profileImage');
            profileImage.style.display = 'none';
            profileImage.src = "data:image/jpeg;base64," + imageData;
            profileImage.style.display = 'block';
            hideLoaderAtProfile();
            //getUserProfileImage(fileId);
            alert("ProfileImage Updated Successfully!");
        },
        function(error){
            hideLoaderAtProfile();
            alert(JSON.stringify(error));
        });
}*/
/*function updateUserProfileImage(fileId){
    console.log("updateUserProfileImage  fileId****************** "+fileId);
        var userId = localStorage.getItem('userId');
        var data1 = everlive.data('Users');
        data1.updateSingle({'Id': userId, 'ProfileImage': fileId,  'isImageProvided' : 'true' },
        function(data){
            console.log(JSON.stringify(data));
            getUserProfileImage(fileId);
            alert("ProfileImage Updated Successfully!");
        },
        function(error){
            hideLoaderAtProfile();
            alert(JSON.stringify(error));
        });
}*/
function editName(){
    $("#currentUserName").prop('disabled', false);
    $("#nameEdit").fadeTo(100, 0.1).fadeTo(200, 1.0);
    $('#currentUserName').focus();
    $("#nameEdit").css('color', '#fff');
    // console.log("editName");
}
function editAddress(){
    //console.log("editaddress");
    $("#currentUserAdd").prop('disabled', false);
    $("#addressEdit").fadeTo(100, 0.1).fadeTo(200, 1.0);
    $('#currentUserAdd').focus();
}
function updateName(usersData, newName){
    console.log("updateName*****************");
    userId = localStorage.getItem('userId');
    
        usersData.updateSingle({'Id': userId, 'DisplayName': newName },
        function(data){
             getDetails();
             hideLoaderAtProfile();
             $("#currentUserName").prop('disabled', true);
            console.log("updateName success*****************"+JSON.stringify(data));
             console.log("Display Name Updated Successfully!");
        },
        function(error){
            hideLoaderAtProfile();
            console.log("updateName error*****************"+JSON.stringify(error));
             console.log("Server taking too long to respond.. Please check your internet connection");
        });
}
function updateAddress(usersData, newAdd){
    console.log("updateAddress*******************");
    userId = localStorage.getItem('userId');
    
        usersData.updateSingle({'Id': userId, 'address': newAdd },
        function(data){
            getDetails();
            hideLoaderAtProfile();
            $("#currentUserAdd").prop('disabled', true);
            console.log("updateAddress success*****************"+JSON.stringify(data));
             console.log("Address Updated Successfully!");
        },
        function(error){
            hideLoaderAtProfile();
            console.log("updateAddress error*****************"+JSON.stringify(error));
             console.log("Server taking too long to respond.. Please check your internet connection");
        });
}
function updateDetails(){
   
   // alert("body height is "+$("body").height());
    $('#updateUser').fadeTo(100, 0.1).fadeTo(200, 1.0);
    var data1 = everlive.data('Users');
    userId = localStorage.getItem('userId');
    var oldPwd = $('#old-password').val();
    var newPwd = $('#new-password').val();
    var newName = $('#currentUserName').val();
    var newAdd = $('#currentUserAdd').val();
    console.log("userName**************"+userName);
    console.log("newName**************"+newName);
    console.log("userAddress**************"+userAddress);
    console.log("newAdd**************"+newAdd);
    console.log("oldPwd**************"+oldPwd);
    console.log("newPwd**************"+newPwd);
    if(userName === newName && userAddress === newAdd 
                            &&  oldPwd === '' && newPwd === ''){
         console.log("There are no changes in Profile... Make changes and then Click Update!");
    }
    if(userName !== newName &&  newName !== ''){
            updateName(data1,newName);
    }
    else
        if(userAddress !== newAdd){
             updateAddress(data1,newAdd);
        }
        else{
           if(userName !== newName && newName !== '' 
                    && userAddress !== newAdd){
                        
                showLoaderOnUpdate();
                  var attributes = {
                      "$push": {
                         "DisplayName": newName,
                         "address" : newAdd
                      }
                  };

                  var filter = {
                      'Id': userId
                  };

                  data1.rawUpdate(attributes, filter, function (data1) {
                      getDetails();
                      hideLoaderAtProfile();
                       console.log("Data Updated Successfully!");
                	  console.log("Data Updated**************"+JSON.stringify(data1));
                      //alert(JSON.stringify(data1));
                  }, function (err) {
                      hideLoaderAtProfile();
                       console.log("Server taking too long to respond.. Please check your internet connection");
                      console.log("Update failed!");
                      console.log("Update failed**************"+JSON.stringify(err));
                  });
            }
        }
    if(oldPwd !== '' && newPwd !== ''){
        if(oldPwd === newPwd){
                hideLoaderAtProfile();
                console.log("New password must be different from Old one!");
                $('#errMsg').text("New password must be different from Old one!");
        }else{
            showLoaderOnUpdate();
             var userEmailName = localStorage.getItem('userName');
              console.log("old "+oldPwd+"  new  "+newPwd+"  userEmailName "+userEmailName);
             everlive.Users.changePassword(userEmailName, // username
                oldPwd, // password
                newPwd, // new password
                true, // keep user's tokens
             function (data) {
                  getDetails();
                  hideLoaderAtProfile();
                  clearData();
                  console.log("Password update success*****************"+JSON.stringify(data));
                  console.log("User password successfully changed");
                  $('#old-password').val('');
                  $('#new-password').val('');
             },
             function(error){
                   hideLoaderAtProfile();
                    console.log("Please make sure your Old password is correct...");
                   console.log("Password update error.. Please make sure your Old password is correct..."+JSON.stringify(error));
             });
        }
    }
    /*else{
        alert("There are no changes in Profile... Make changes and then Click Update!");
        console.log("There are no changes in Profile... Make changes and then Click Update!");
    }*/
}
function trackFeatureMyProfile(){
    try{
        monitor.Start();
        monitor.TrackFeature("feature.MyProfile"); 
        console.log("inside track feature monitor******************");        
        console.log("after track feature");
   }
   catch(err) {
        console.log('Something went wrong:');
        console.log(err);
   }
}
function showLoaderAtProfile() {
    createLoader();
    console.log("showLoader******************");
    $('#my_profile').hide();
    $('#profile-content').hide();
     // $('<div class="k-overlay" style="z-index: 10002; opacity: 0.5;"></div>').insertBefore('.km-loader');
   // $('.details-content').hide();
  // $('#custom-listview').css('display','none');
   app.pane.loader.show();
}
function showLoaderOnUpdate(){
    createLoader();
    app.pane.loader.show();
    // $('<div class="k-overlay" style="z-index: 10002; opacity: 0.5;"></div>').insertBefore('.km-loader');
     $('#my_profile').css('opacity', '0.3');
     $('#my_profile').prop('disabled', true);
     $('#old-password').prop('disabled', true);
     $('#new-password').prop('disabled', true);
     $("#nameEdit").data("kendoMobileButton").enable(false); 
     $("#addressEdit").data("kendoMobileButton").enable(false); 
     $("#updateUser").data("kendoMobileButton").enable(false);
}
function hideLoaderAtProfile(){
    console.log("hideLoaderAtProfile******************");
     app.pane.loader.hide(); 
     //$('#my_profile').show();
     $('#profile-content').show();
     $('#my_profile').css('opacity', '1');
     //$('.k-overlay').remove();
     $('#my_profile').prop('disabled', false);
     $('#old-password').prop('disabled', false);
     $('#new-password').prop('disabled', false);
     $("#nameEdit").data("kendoMobileButton").enable(true);
     $("#addressEdit").data("kendoMobileButton").enable(true); 
     $("#updateUser").data("kendoMobileButton").enable(true);
}