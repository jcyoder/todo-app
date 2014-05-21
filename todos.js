$(document).ready(function () {
    
    //name to use for local storage
    var todoList = '';
    
    
    //get the list from local storage and insert the to do items
    function loadTheList() {
        var allCompleted = true; //used to determine whether the chevron(.toggle-all) should be checked
        var i = 0;
        todoList = JSON.parse(localStorage.getItem('todoList'));
        if (todoList.length > 0) {
            for (i = 0; i <= todoList.length - 1; i++) {
				// insert the todo into the html list.
				insertEntry(todoList[i]['todotext'], todoList[i]['id'], todoList[i]['completed']);
                if (todoList[i]['completed'] === false) {
					allCompleted = false;
				}
			}
            
            if (allCompleted === true) {
                $('#toggle-all').prop('checked', true);
            }
        }
        
        listfunctions.updateListCount();
    }
    
    //check to see if we have items in local storage otherwise set up to save to local storage
    function loadFromLocalStorage() {
        
      //  if(typeof(Storage)!=="undefined") {
        //    console.log(Storage);
        //}
        if (localStorage && localStorage.length > 0) {
			// run LoadtheList to insert all the todo list items
            loadTheList();
		} else {
            //create an empty array and store it in local storage
			var a = [];
			localStorage.setItem('todoList', JSON.stringify(a));
		}
  
    }
    
    function insertEntry(todotext, id, completedstatus) {
        $('.template li').clone().appendTo('#todo-list');
		$('#todo-list li:last-child label').text(todotext);
		$('#todo-list li:last-child').attr('data-id', id);
		if (completedstatus) {
			$('#todo-list li:last-child').addClass('completed');
			$('#todo-list li:last-child .toggle').attr('checked', true);
		}
		$('#new-todo').val('');
        //should I add listeners here?  Right now in InitApp()
		//addListItemListener(id);
    }
    
    //generate unique id for each to do item
    function getUuid() {
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
	}
    
    //check to see if the Clear Completed button needs to be displayed and
    //keep track of the number of completed items that is displayed on the button.
    function verifyClearCompletedDisplay() {
        var numcompleted = 0;
        $('#todo-list li').each(function () {
            var checkmark = $(this).find('.toggle').prop("checked");
            if (checkmark === true) {
                numcompleted++;
            }
        });
        if (numcompleted > 0) {
            var buttontext = "Clear Completed (" + numcompleted + ")";
            $('footer #clear-completed').css("display", "block").text(buttontext);
            
        } else {
            
            $('footer #clear-completed').css("display", "none");
        }
    }
    
    var listfunctions = {
        
        addtoList: function (todoitem) {
            var dataUUID = getUuid();
            $('.template li').clone().appendTo('#todo-list');
            $('#todo-list li:last-child .view label').text(todoitem);
            $('#todo-list li:last-child').attr('data-id', dataUUID);
            $('#new-todo').val('');
            var newlistitem = $('#todo-list li:last-child');
            setupNewListeners(newlistitem);
            listfunctions.updateListCount();
            verifyClearCompletedDisplay();
            
        },
        
        deleteListItem: function (listitem) {
            var idnum = listitem.attr('data-id');
            turnOffListeners(listitem);
            listitem.remove();
            listfunctions.updateListCount();
            verifyClearCompletedDisplay();
           
            // add code to remove from local storage too
        },
        
        completedListItem: function (currentlist, checked) {
            if (checked === true) {
                currentlist.addClass('completed');
            } else {
                currentlist.removeClass('completed');
            }
            listfunctions.updateListCount();
            verifyClearCompletedDisplay();
        },
        
        editListItem: function (event) {
            
            if (event.target.nodeName === 'LABEL') {
                var labeltext = $(event.target).text();
                var listitem = $(event.target).closest('li').addClass('editing');
                listitem.find('.edit').val(labeltext).focus();
                setupEditListener(listitem);
                
            }
        },
        
        completeEditListItem: function (event) {
            var newtext = $(event.target).val();
            var labelelement = $(event.target).parent().find('.view label');
            labelelement.text(newtext);
            $(event.target).closest('li').removeClass('editing');
           
        },
        
        cancelEditListItem: function (event) {
            $(event.target).closest('li').removeClass('editing');
        },
        
        //clicked on chevron to cross everything off the list
        markAllCompleted: function (checked) {
            if (checked === true) {
                $('.completed').removeClass('completed');
                $('#todo-list li').addClass('completed');
                $('.toggle').prop('checked', true);
                
            } else {
                $('.completed').removeClass('completed');
                $('.toggle').prop('checked', false);
                
            }
            listfunctions.updateListCount();
            verifyClearCompletedDisplay();
        },
        //clicked on the Completed link in the footer
        showCompletedItems: function () {
            $('#todo-list li').each(function () {
                var checkmark = $(this).find('.toggle').prop('checked');
                if (checkmark === false) {
                    $(this).hide();
                } else {
                    $(this).show();
                    
                }
            });
        },
        
        showActiveItems: function () {
          //  $(":checked").parent().parent().show();
            $('#todo-list li').each(function () {
                var checkmark = $(this).find('.toggle').prop('checked');
                if (checkmark === false) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        },
        
        updateListCount: function () {
            var totallistnum = $('#todo-list li').length;
            var numcompleted = 0;
            $('#todo-list li').each(function () {
                var checkmark = $(this).find('.toggle').prop('checked');
                if (checkmark === true) {
                    numcompleted++;
                }
            });
            var numactive = totallistnum - numcompleted;
            var countstring = "<strong>" + numactive + "</strong> item" + ((numactive ===  1) ? '' : 's') + " left";
            //.html() allows you to insert an actual html content
            $('#footer #todo-count').html(countstring);
            
        }
    };
    
    
    
    function setListeners() {
        
        $('#new-todo').keyup(function (event) {
            //13 is the enter key
            if (event.which === 13) {
                var listentry = this.value;
                if(listentry !== '') {
                    listfunctions.addtoList(listentry);
                }
            }
            
        });
        
        $('#todo-list li').on('dblclick', function (event) {
            //if double click on the list item then can edit it
            listfunctions.editListItem(event);
        });
        
    /*    $('#todo-list li').keyup(function (event) {
            //if press the escape key then throw away the edits and keep what you had
            if (event.which === 27) {
                console.log("Escape was clicked");
            }
        });
    */
       
        $('.toggle').on('click', function () {
            console.log("Clicked on a checkmark");
            var currentlist = $(this).parent().parent();
            if (this.checked === true) {
                listfunctions.completedListItem(currentlist, true);
            } else {
                listfunctions.completedListItem(currentlist, false);
            }
            
        });
        
        //click to cross all items off or on
        $('#toggle-all').on('click', function (event) {
            //click on the chevron
            if (this.checked === true) {
                listfunctions.markAllCompleted(true);
            } else {
                listfunctions.markAllCompleted(false);
            }
        });
        
        $('.destroy').on('click', function () {
           //clicked on the 'X' button
            var listitem = $(this).parent().parent();
            listfunctions.deleteListItem(listitem);
        });
        
        
        $('.selectall').on('click', function () {
            $(this).addClass("selected");
            $('.active').removeClass('selected');
            $('.completedlink').removeClass('selected');
            $('#todo-list li').each(function () {
                $(this).show();
                                 
            });
            
        });
        
        $('.active').on('click', function () {
            $(this).addClass('selected');
            $('.selectall').removeClass('selected');
            $('.completedlink').removeClass('selected');
            //find all the checked checkboxes and hide them
            listfunctions.showActiveItems();
            
        });
        
        $('.completedlink').on('click', function () {
            $(this).addClass('selected');
            $('.active').removeClass('selected');
            $('.selectall').removeClass('selected');
            listfunctions.showCompletedItems();
        });
        
        $('#clear-completed').on('click', function () {
            deleteAllCompletedItems();
        });
        
        $('.edit').on('focusout', function (event) {
            console.log("edit box lost focus");
            listfunctions.completeEditListItem(event);
        });
    };
    
    function setupNewListeners(newlistitem) {
        
        newlistitem.on('dblclick', function (event) {
            //if double click on the list item then can edit it
            console.log("Double click event");
            console.log(event.target.nodeName);
            listfunctions.editListItem(event);
        });
       
        newlistitem.find('.toggle').on('click', function () {
            var currentlist = $(this).parent().parent();
            if (this.checked === true) {
                listfunctions.completedListItem(currentlist, true);
            } else {
                listfunctions.completedListItem(currentlist, false);
            }
            
        });
        
        newlistitem.find('#toggle-all').on('click', function (event) {
            //click on the chevron
            if (this.checked === true) {
                listfunctions.markAllCompleted(true);
            } else {
                listfunctions.markAllCompleted(false);
            }
            
        });
        
        newlistitem.find('.destroy').on('click', function () {
           //clicked on the 'X' button
            var listitem = $(this).parent().parent();
            listfunctions.deleteListItem(listitem);
        });
        
        newlistitem.find('#clear-completed').on('click', function () {
            deleteAllCompletedItems();
        });
        
     /*  newlistitem.find('.edit').on("focusout", function (event) {
            console.log("edit box lost focus");
      
            listfunctions.completeEditListItem(event);
        });*/
        
    }
    
    function setupEditListener (listitem) {
        listitem.find('.edit').keyup(function (event) {
             console.log("new keyup listener for editbox");
            if (event.which === 13) {
                console.log("enter key was pressed");
                var listentry = this.value;
                console.log(listentry);
                listfunctions.completeEditListItem(event);
                
            } else if (event.which === 27) {
                console.log("Escape was clicked");
                listfunctions.cancelEditListItem(event);
            }
        });
    }
        
    function turnOffListeners(listitem) {
        //TODO turn off listeners here
    }
    
    function deleteAllCompletedItems() {
        console.log("deleteAllCompletedItems");
        var todoitems = $('#todo-list li');
        todoitems.each(function () {
            var checkmark = $(this).find('.toggle').prop('checked');
            if (checkmark === true) {
               // var idnum = $(this).attr('data-id');
                turnOffListeners(todoitems);
                $(this).remove();
                listfunctions.updateListCount();
                verifyClearCompletedDisplay();
            }
        });
    }
    
    function InitApp() {
        loadFromLocalStorage();
        setListeners();
        listfunctions.updateListCount();
        verifyClearCompletedDisplay();
    }
    
    InitApp();
});