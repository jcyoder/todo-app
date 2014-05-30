$(document).ready(function () {
    
    //name to use for local storage
    var todoList = '';
    
    
    //get the list from local storage and insert the to do items
    function loadTheList() {
        var allCompleted = true, i = 0; //used to determine whether the chevron(.toggle-all) should be checked
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
        var newlistitem = $('#todo-list li:last-child');
		setListItemListeners(newlistitem);
    }
    
    //generate unique id for each to do item
    function getUuid() {
        /*jshint bitwise:false */
        var i, random, uuid = '';

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
    
    function saveToStorage(todoentry) {
        todoList = [];
        if (localStorage.getItem('todoList') === null) {
            todoList = [];
        } else {
            // Parse the serialized data back into an array of objects
            todoList = JSON.parse(localStorage.getItem('todoList'));
        }
        // Push the new data (whether it be an object or anything else) onto the array
	    todoList.push(todoentry);
	    // Re-serialize the array back into a string and store it in localStorage
	    localStorage.setItem('todoList', JSON.stringify(todoList));
        
    }
    
    function removeFromStorage(idnum) {
        var i = 0;
        for (i = 0; i <  todoList.length; i++) {
			if (todoList[i]['id'] === idnum) {
				todoList.splice(i, 1);  //splice - remove 1 item from position i in the array
				localStorage.setItem('todoList', JSON.stringify(todoList));
            }
        }
    }
    
    function updateListTextStorage(idnum, newtext) {
		var i = 0;
		// var idnum = $('.editing').attr('data-id');
		for (i = 0; i <= todoList.length - 1; i++) {
			if (todoList[i]['id'] === idnum) {
				todoList[i]['todotext'] = newtext;
			}
		}
		localStorage.setItem('todoList', JSON.stringify(todoList));
    }
    
    function updateCompletedStorage(idnum, checked) {
        var i = 0;
		for (i = 0; i <= todoList.length - 1; i++) {
			if (todoList[i]['id'] === idnum) {
				todoList[i]['completed'] = checked;
			}
			localStorage.setItem('todoList', JSON.stringify(todoList));
		}
    }
    
    var listfunctions = {
        
        addtoList: function (todoitem) {
            var entry = todoitem, dataUUID = getUuid(), newlistitem;
            var todoentry = {
                'id': dataUUID,
                'todotext': entry,
                'completed': false
            };
            
            $('.template li').clone().appendTo('#todo-list');
            $('#todo-list li:last-child .view label').text(entry);
            $('#todo-list li:last-child').attr('data-id', dataUUID);
            
            newlistitem = $('#todo-list li:last-child');
            //setupNewListeners(newlistitem);
            setListItemListeners(newlistitem);
            saveToStorage(todoentry);
            $('#new-todo').val('');
            listfunctions.updateListCount();
            verifyClearCompletedDisplay();
            
        },
        
        deleteListItem: function (listitem) {
            var idnum = listitem.attr('data-id');
            removeFromStorage(idnum);
            listitem.off();// turn off the listeners
            listitem.remove();
            listfunctions.updateListCount();
            verifyClearCompletedDisplay();
        },
        
        completedListItem: function (currentlist, checked) {
            var idnum = currentlist.attr('data-id');
            if (checked === true) {
                currentlist.addClass('completed');
            } else {
                currentlist.removeClass('completed');
            }
            updateCompletedStorage(idnum, checked);
            listfunctions.updateListCount();
            verifyClearCompletedDisplay();
        },
        
        editListItem: function (event) {
            
            if (event.target.nodeName === 'LABEL') {
                var labeltext = $(event.target).text();
                var listitem = $(event.target).closest('li').addClass('editing');
                listitem.find('.edit').val(labeltext).focus();
                setupEditListeners(listitem);
                
            }
        },
        
        //I finished editing the list item
        completeEditListItem: function (event) {
            
            var newtext = $(event.target).val();
            var labelelement = $(event.target).parent().find('.view label');
            labelelement.text(newtext);
            var idnum = $(event.target).parent().attr('data-id');
            updateListTextStorage(idnum, newtext);
            $(event.target).closest('li').removeClass('editing');
            
        },
        
        cancelEditListItem: function (event) {
            $(event.target).closest('li').removeClass('editing');
			$('.edit').off('blur');
        },
        
        //clicked on chevron to cross everything off the list
        markAllCompleted: function (checked) {
			var i = 0;
            if (checked === true) {
                $('.completed').removeClass('completed');
                $('#todo-list li').addClass('completed');
                $('.toggle').prop('checked', true);
                
            } else {
                $('.completed').removeClass('completed');
                $('.toggle').prop('checked', false);
                
            }
            
            for (i = 0; i <= todoList.length - 1; i++) {
				todoList[i]['completed'] = true;
			}
            
            localStorage.setItem('todoList', JSON.stringify(todoList));
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
    
    
    function setListItemListeners() {
        $('#todo-list li').on('dblclick', function (event) {
            //if double click on the list item then can edit it
            listfunctions.editListItem(event);
        });
        
        $('.toggle').on('click', function () {
            var currentlist = $(this).parent().parent();
            if (this.checked === true) {
                listfunctions.completedListItem(currentlist, true);
            } else {
                listfunctions.completedListItem(currentlist, false);
            }
            
        });
        
        $('.destroy').on('click', function () {
           //clicked on the 'X' button
            var listitem = $(this).parent().parent();
            listfunctions.deleteListItem(listitem);
        });
    }
    
    function setListeners() {
        
        $('#new-todo').on('keyup', function (event) {
            //13 is the enter key
            if (event.which === 13) {
                var listentry = this.value;
                if (listentry !== '') {
                    listfunctions.addtoList(listentry);
                }
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
	};
    
    function setupEditListeners(listitem) {
        listitem.find('.edit').on('keyup', function (event) {
			if (event.which === 13) { //return key pressed
				var listentry = this.value;
				listfunctions.completeEditListItem(event);

			} else if (event.which === 27) { //escape key pressed
				listfunctions.cancelEditListItem(event);
			}
		});
        
        listitem.find('.edit').on('blur', function (event) {
            listfunctions.completeEditListItem(event);
        });
    }
    
    function deleteAllCompletedItems() {
        var todoitems = $('#todo-list li');
        todoitems.each(function () {
            var checkmark = $(this).find('.toggle').prop('checked');
            if (checkmark === true) {
                var idnum = $(this).attr('data-id');
                removeFromStorage(idnum);
                $(this).off();// turn off the listeners
                $(this).remove();// remove element including on child nodes
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