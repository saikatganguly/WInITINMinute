 var correct = 0;
(function () {
window.APP = {
     models: {
       quiz: {
          title: 'Quiz',
           first:new kendo.data.DataSource({
               data: [{ id: 1, question: 'Computer Language', value:'correct'}, { id: 2, question: 'OS', value: 'wrong' }, { id: 3, question: 'Hardware', value: 'wrong'},{ id: 4, question: 'ETC', value:'wrong' }]
           }), 
          second: new kendo.data.DataSource({
               data: [{ id: 1, question: 'Computer Language', value: 'wrong' }, { id: 2, question: 'Structure Language', value: 'wrong' }, { id: 3, question: 'Object Language', value:'correct' },{ id: 4, question: 'Assembly Langugage', value: 'wrong' }]
          }),
          third: new kendo.data.DataSource({
               data: [{ id: 1, question: 'Iseland', value: 'wrong' }, { id: 2, question: 'Country' , value:'correct' }, { id: 3, question: 'Continent' , value: 'wrong'},{ id: 4, question: 'Univerce', value: 'wrong' }]
          }), 
          fourth: new kendo.data.DataSource({
               data: [{ id: 1, question: 'Indore Game' , value: 'wrong'}, { id: 2, question: 'Team Game', value: 'wrong'}, { id: 3, question: 'National game', value: 'wrong' },{ id: 4, question: 'Outdore Game', value:'correct' }]
          }),
          fifth: new kendo.data.DataSource({
               data: [{ id: 1, question: 'Computer Language' , value: 'wrong'}, { id: 2, question: 'OS6', value: 'wrong' }, { id: 3, question: 'Animal' , value:'correct' },{ id: 4, question: 'ETC', value: 'wrong' }]
          }),
           timer: function(e){
               alert("timer");
             //  app.navigate("#timer","slide:left reverse");
           },
          page1:function(e) {
             $('input[name="action"]').prop('checked', false);
               correct = 0;
                $('#ms_timer').countdowntimer({
                              minutes :1,
                              seconds :0,
                              size : "lg"
                              
                           });
             app.navigate("#page1","slide:left reverse");
          },
          
          page2: function(e) {
              alert("inside page2");
              app.navigate("#page2","slide");
          },
          page3: function(e) {
              app.navigate("#page3","slide");
          }, 
          page4: function(e) {
              app.navigate("#page4","slide");
          },
          page5: function(e) {
              app.navigate("#page5","slide");
          }, 
          activitiesChanged: function(e){
                if(e.data.value == "correct") {
                   correct++;    
                }
          },
           
          timer:function(e) {
              $('#ms_timer').countdowntimer({
                              minutes :1,
                              seconds :0,
                              size : "lg"
                              
                           });
          },
          result: function(e) {
             $(".title").text("Score:"+correct);
              app.navigate("#result","slide");
          },
        },
       quizmain:{ title: 'Quiz'} 
      }
    };
    
}());