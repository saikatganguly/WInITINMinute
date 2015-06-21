var flag = true;
var userName = null;
var userAddress = null;
var userImageId = null;
var isImageProvided;

function removePwdMessage(id){
    $("#errMsg").text("");
    $("#"+id).css('display','none');
    $("#"+id).text("");
}
function clearData(){
    $('#old-password').val(''); 
    $('#new-password').val('');
   // $('#retype-password').val('');
    $("#errMsg").text("");
   /* $("#errOldPwd").text("");
    $("#errNewPwd").text("");*/
    
  /*  if (kendo.support.mobileOS.wp) {
        $('#modalview-password .btnDiv a').css('height', '45px');
        $('#modalview-password .btnDiv a').css('margin-bottom', '3%');
    }*/
    
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
        $('#errMsg').css('height','65px');
        $('.textbox').css('font-size','23px');
       // $('.km-header').css('position','fixed');
        $('body').css('position','fixed');
    }
}
function callBeforeLodingFunctions(){
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
        console.log("getDetails  Name******************"+data.result.Name);
        console.log("getDetails  imageId******************"+data.result.ProfileImage);
        console.log("isImageProvided ******************** "+data.result.isImageProvided);
         var profileImage = document.getElementById('profileImage');
        profileImage.style.display = 'none';
       // document.getElementById('profileImage').style.display = none;
        userName = data.result.DisplayName;
        userImageId = data.result.ProfileImage;
        isImageProvided = data.result.isImageProvided;
        if(userImageId !== null){
            getUserProfileImage(userImageId);
            profileImage.style.display = 'block';
            //$('#profileImage').css('display','block');
        }
        $('#currentUserName').val(userName);
        
        if(data.result.address !== null){
            console.log("getDetails address******************"+data.result.address);
            userAddress = data.result.address;
            $('#currentUserAdd').val(userAddress);
        }
    },
    function(error){
        alert(JSON.stringify(error));
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
            destinationType: that._destinationType.DATA_URL
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
            sourceType: source
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
        if(isImageProvided === "true"){
            console.log("isImageProvided true  "+isImageProvided);
            updateImageFile(imageData);
        }else{
            console.log("isImageProvided false  "+isImageProvided);
            uploadImageFile(imageData);
        }
    },
    
    _onFail: function(message) {
        alert(message);
    }
}
function updateImageFile(imageData){
        console.log("updateImageFile");

        var file = {
            "Filename": userName+'.png',
            "ContentType": 'image/png',
            "base64": imageData
        };

        everlive.Files.updateContent(userImageId, file,
            function(data) {
                console.log(JSON.stringify(data));
                setTimeout(function(){
                    getUserProfileImage(userImageId);
                    /*$('#profileImage').src ='';
                    $('#profileImage').src = "data:image/jpeg;base64," + imageData;*/
                },500);
                
            },
            function(error) {
                hideLoaderAtProfile();
                alert(JSON.stringify(error));
                console.log(JSON.stringify(error));
            });
}
function  uploadImageFile(imageData){
    console.log("uploadImageFile");
        var file = {
            "Filename": userName+'.png',
            "ContentType": "image/png",
            "CustomField": "customValue",
            "base64": imageData
        };
        everlive.Files.create(file,
            function (data) {
                console.log(JSON.stringify(data));
                // Show the captured photo.
                fileId = data.result.Id;
                updateUserProfileImage(fileId);
            },
            function (error) {
                hideLoaderAtProfile();
                alert(JSON.stringify(error));
           });
}
function updateUserProfileImage(fileId){
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
}
function editName(){
    console.log("editName");
    $("#currentUserName").prop('disabled', false);
    $("#nameEdit").fadeTo(100, 0.1).fadeTo(200, 1.0);
    $('#currentUserName').focus();
    $("#nameEdit").css('color', '#fff');
}
function editAddress(){
    console.log("editaddress");
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
            alert("Display Name Updated Successfully!");
        },
        function(error){
            hideLoaderAtProfile();
            console.log("updateName error*****************"+JSON.stringify(error));
            alert("Server taking too long to respond.. Please check your internet connection");
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
            alert("Address Updated Successfully!");
        },
        function(error){
            hideLoaderAtProfile();
            console.log("updateAddress error*****************"+JSON.stringify(error));
            alert("Server taking too long to respond.. Please check your internet connection");
        });
}
function updateDetails(){
    $('#updateUser').fadeTo(100, 0.1).fadeTo(200, 1.0);
    var data1 = everlive.data('Users');
   //  setTimeout(function(){
             
    // }, 200);
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
    if(userName !== newName &&  newName !== '' 
                && userAddress !== newAdd && newAdd !== ''){
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
              alert("Data Updated Successfully!");
        	  console.log("Data Updated**************"+JSON.stringify(data1));
              //alert(JSON.stringify(data1));
          }, function (err) {
              hideLoaderAtProfile();
              alert("Server taking too long to respond.. Please check your internet connection");
              alert("Update failed!");
              console.log("Update failed**************"+JSON.stringify(err));
          });
    }else{
        if(userName !== newName &&  newName !== ''){
            updateName(data1,newName);
        }else
        if(userAddress !== newAdd && newAdd !== ''){
            updateAddress(data1,newAdd);
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
                  alert("User password successfully changed");
             },
             function(error){
                   hideLoaderAtProfile();
                   alert("Please make sure your Old password is correct...");
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
        alert('Something went wrong:');
        console.log('Something went wrong:');
        console.log(err);
   }
}
function showLoaderAtProfile() {
    console.log("showLoader******************");
    $('#my_profile').hide();
    $('#profile-content').hide();
   // $('.details-content').hide();
  // $('#custom-listview').css('display','none');
   app.pane.loader.show();
}
function showLoaderOnUpdate(){
    app.pane.loader.show();
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
    setTimeout(function() {
            app.pane.loader.hide(); 
            $('#my_profile').show();
            $('#profile-content').show();
            $('#my_profile').css('opacity', '1');
            $('#my_profile').prop('disabled', false);
            $('#old-password').prop('disabled', false);
            $('#new-password').prop('disabled', false);
            $("#nameEdit").data("kendoMobileButton").enable(true);
            $("#addressEdit").data("kendoMobileButton").enable(true); 
            $("#updateUser").data("kendoMobileButton").enable(true);
    }, 1500);
}