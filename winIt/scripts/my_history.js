var dataSource = [];

function initHistory(){
    var userId=localStorage.getItem('userId');
     var customObject = JSON.stringify({
            "filter" :{
               'userId': userId
            }
     });
    
     $.ajax({
            url: "https://platform.telerik.com/bs-api/v1/elKw1nKoaJB4RIJ8/Functions/getquizhistory",
            type: "GET",
            datatype: "json",
            headers: {
                "Authorization" : localStorage.getItem('access-token'),
                "X-Everlive-Custom-Parameters" : customObject
            },
            contentType: "application/json",
            accept: "application/json",
            success: function(result){
                alert(JSON.stringify(result));
                var jsonobject;
                for(var i=0; i< result.length; i++){
                   // alert(JSON.stringify(result[i]));
                    jsonobject = {'Date' : result[i].CreatedAt, 'Status' : result[i].quiz_won}; 
                   // dataSource.Status.push(result[i].quiz_won);
                    dataSource.push(jsonobject);
                }
                alert(JSON.stringify(dataSource));
                createGrid();
            },
            error: function(error){
                alert(JSON.stringify(error));
            }
     });
}
     
function createGrid(){
    $("#grid").kendoGrid({
        dataSource: dataSource,
        pageable: true,
        columns: [
           { field: "Date" },
           { field: "Status" }
        ],
        sortable: true
     });
}