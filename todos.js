$(document).ready(function () {
    
    function setListeners() {
        
        $('#new-todo').keyup(function (event) {
            //13 is the enter key
            if (event.which === 13) {
                console.log("enter key was pressed");
                var listentry = this.value;
                console.log(listentry);
                listfunctions.addtoList(listentry);
            }
            
        });
        
        $('#todo-list li').dblclick(function (event) {
            //if double click on the list item then can edit it
            console.log("Double click event");
            console.log(event.target.nodeName);
            listfunctions.editListItem(event);
        });
        
        $('#todo-list li').keyup(function (event) {
            //if press the escape key then throw away the edits and keep what you had
            if (event.which === 27) {
                console.log("Escape was clicked");
            }
        });
       
        $('.toggle').click(function () {
            console.log("Clicked on a checkmark");
            var labelitem = $(this).siblings('label'); 
            if(this.checked) {
                listfunctions.completedListItem(labelitem, true);   
            }
            else {
                console.log("check mark is not checked");
                listfunctions.completedListItem(labelitem, false);   
            }  
            //click on a checkmark
            
        });
        
        $('#toggle-all').click(function (event) {
            //click on the chevron
            console.log("clicked on the chevron");
            if(this.checked === true) {
                console.log("chevron is checked");
                listfunctions.completedAll(true);
            }
            else {
                console.log("chevron is un-checked");
                listfunctions.completedAll(false); 
            }
                
                /*    
                $('#todo-list li').each( function () {
                    $(this).find('label').css('text-decoration', 'line-through');
                    console.log("crossing off: " + $(this).find('label').text());
                    $(this).find('.toggle').click();
                    
                    
                });
            } else {
                console.log("chevron is un-checked");
                $('#todo-list li').each( function () {
                    $(this).find('label').css('text-decoration', 'none');
                    console.log("Un-crossing off: " + $(this).find('label').text());
                    $(this).find('.toggle').click();
                });
            }
            */
            
        });
        
        $('.destroy').click(function () {
           //clicked on the 'X' button
            console.log("clicked to delete to do item");
            var listitem = $(this).parent().parent();
            listfunctions.deleteListItem(listitem);
        });
        
        
        $('.selected').click(function () {
            console.log("clicked on All link in footer");
            
        });
        
        $('.active').click(function () {
            console.log("clicked on Active link in footer");
            
        });
        
        $('.completed').click(function () {
            console.log("clicked on Completed link in footer");
            
        });
        
    }
    
    var util = {
		uuid: function () {
			/*jshint bitwise:false */
			var i, random;
			var uuid = '';

			for (i = 0; i < 32; i++) {
				random = Math.random() * 16 | 0;
				if (i === 8 || i === 12 || i === 16 || i === 20) {
					uuid += '-';
				}
				uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
			}

			return uuid;
		},
		pluralize: function (count, word) {
			return count === 1 ? word : word + 's';
		},
		store: function (namespace, data) {
			if (arguments.length > 1) {
				return localStorage.setItem(namespace, JSON.stringify(data));
			} else {
				var store = localStorage.getItem(namespace);
				return (store && JSON.parse(store)) || [];
			}
		}
	};
    
    
    var listfunctions = {
        
        addtoList: function (todoitem) {
            var dataUUID = util.uuid();
            $('.template li').clone().appendTo('#todo-list');
            $('#todo-list li:last-child .view label').text(todoitem);
            $('#todo-list li:last-child').attr('data-id', dataUUID);
            $('#new-todo').val('');
        },
        
        deleteListItem: function (listitem) {
            var idnum = listitem.attr('data-id');
            listitem.remove();
            // add code to remove from local storage too
        },
        
        completedListItem: function (labelitem, checked) {
           if (checked === true) {
               labelitem.css('text-decoration', 'line-through');
           } else {
               labelitem.css('text-decoration', 'none');
           }
        },
        
        editListItem: function(event) {
            if (event.target.nodeName === 'LABEL') {
                console.log('label');
                var inputsib = $(event.target).siblings('input');
                //save the to do item out and hide the label
                var labeltext = $(event.target).text();
                $(event.target).hide();
                var par = $(event.target).parent();
                console.log(par);
                //TODO turn off double click listener??
                //clone inputtemplate and add it in where the label used to be
                var test = $('.inputtemplate input').clone().after('inputsib');
              //  var test = $('.inputtemplate input').clone().appendTo('par');
                test.value = labeltext;
                
                console.log(test.value);
                
               // $('par .toggle').after(test);
                
                
            }
        },
        
        completedAll: function(checked) {
            if(checked === true) {
                 $('#todo-list li').each( function () {
                    $(this).find('label').css('text-decoration', 'line-through');
                    console.log("crossing off: " + $(this).find('label').text());
                    $(this).find('.toggle').click();
                    
                    
                });
            } else {
                $('#todo-list li').each( function () {
                    $(this).find('label').css('text-decoration', 'none');
                    console.log("Un-crossing off: " + $(this).find('label').text());
                    $(this).find('.toggle').click();
                });
            }
        }
        
    };

    setListeners();
});