$(document).ready(function() {
    
    function setListeners() {
        
        $('#new-todo').keyup(function(event) {
            //13 is the enter key
            if(event.which === 13) {
                console.log("enter key was pressed");
                // get the entry
                var listentry = this.value;
                console.log(listentry);
                //Add new entry to the list
                //store it in local storage
                //display the chevron toggle button
                //display the checkmark
                //display the 'X'
                //if not already shown, display the footer info  
            } 
            console.log("leaving keyup");
            
        });
        
        $('#todo-list li').dblclick(function() {
            //if double click on the list item then can edit it
            
        });
        
        $('#todo-list li').keyup(function(event) {
            //if press the escape key then throw away the edits and keep what you had
            if(event.which === 27) {
                
            }
        });
      /*  
        $('.toggle').click()  {
            //click on a checkmark
        }
        
        $('#toggle-all').click()  {
            //click on the chevron
        }
       */ 
    }
    
    
});