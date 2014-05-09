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
        
        $('#todo-list li').dblclick(function () {
            //if double click on the list item then can edit it
            console.log("Double click event");
        });
        
        $('#todo-list li').keyup(function (event) {
            //if press the escape key then throw away the edits and keep what you had
            if (event.which === 27) {
                console.log("Escape was clicked");
            }
        });
       
        $('.toggle').click(function () {
            console.log("Clicked on a checkmark");
            //click on a checkmark
            
        });
        
        $('#toggle-all').click(function () {
            //click on the chevron
            console.log("clicked on the chevron");
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
          var letmesee =  $('#todo-list li:last-child').attr('data-id', dataUUID);
            $('#new-todo').val('');
        },
        
        deleteListItem: function (listitem) {
            var idnum = listitem.attr('data-id');
            listitem.remove();
            // add code to remove from local storage too
        },
        
        completedListItem: function () {
            
            
        }
        
        
        
        
        
    };

    setListeners();
});