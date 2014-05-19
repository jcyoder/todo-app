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
        
        $('#todo-list li').on("dblclick", function (event) {
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
       
        $('.toggle').on("click", function () {
            console.log("Clicked on a checkmark");
            var currentlist = $(this).parent().parent();
            if (this.checked === true) {
                listfunctions.completedListItem(currentlist, true);
            } else {
                listfunctions.completedListItem(currentlist, false);
            }
            
        });
        
        $('#toggle-all').on("click", function (event) {
            //click on the chevron
            console.log("clicked on the chevron");
            if (this.checked === true) {
                console.log("chevron is checked");
                listfunctions.completedAll(true);
            } else {
                console.log("chevron is un-checked");
                listfunctions.completedAll(false);
            }
        });
        
        $('.destroy').on("click", function () {
           //clicked on the 'X' button
            console.log("clicked to delete to do item");
            var listitem = $(this).parent().parent();
            listfunctions.deleteListItem(listitem);
        });
        
        
        $('.selectall').on("click", function () {
            console.log("clicked on All link in footer");
            $(this).addClass("selected");
            $(".active").removeClass("selected");
            $(".completedlink").removeClass("selected");
            $('#todo-list li').each(function () {
                $(this).show();
                                 
            });
            
        });
        
        $('.active').on("click", function () {
            console.log("clicked on Active link in footer");
            $(this).addClass("selected");
            $(".selectall").removeClass("selected");
            $(".completedlink").removeClass("selected");
            //find all the checked checkboxes and hide them
            listfunctions.showActiveItems();
            
        });
        
        $('.completedlink').on("click", function () {
            console.log("clicked on Completed link in footer");
            $(this).addClass("selected");
            $(".active").removeClass("selected");
            $(".selectall").removeClass("selected");
            listfunctions.showCompletedItems();
        });
        
        $('#clear-completed').on("click", function () {
            console.log("clear-completed button pressed");
            deleteAllCompletedItems();
        });
        
        $('.edit').on("focusout", function (event) {
            console.log("edit box lost focus");
            listfunctions.completeEditListItem(event);
        });
    };
    
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
                console.log("checkmark is checked");
                currentlist.addClass('completed');
            } else {
                currentlist.removeClass('completed');
            }
            listfunctions.updateListCount();
            verifyClearCompletedDisplay();
        },
        
        editListItem: function (event) {
            
            if (event.target.nodeName === 'LABEL') {
                console.log('Editing todo list item label');
                var labeltext = $(event.target).text();
                var listitem = $(event.target).closest('li').addClass('editing');
                listitem.find(".edit").val(labeltext).focus();
                setupEditListener(listitem);
                
            }
        },
        
        completeEditListItem: function (event) {
            var newtext = $(event.target).val();
            var labelelement = $(event.target).parent().find('.view label');
            labelelement.text(newtext);
            console.log(labelelement.text());
            $(event.target).closest('li').removeClass('editing');
           
        },
        
        cancelEditListItem: function (event, listentry) {
            console.log("Cancel edit");
            $(event.target).closest('li').removeClass('editing');
        },
        
        //clicked on chevron to cross everything off the list
        completedAll: function (checked) {
            if (checked === true) {
                $(".completed").removeClass("completed");
                $("#todo-list li").addClass("completed");
                $(".toggle").prop("checked", true);
                
            } else {
                $(".completed").removeClass("completed");
                $(".toggle").prop("checked", false);
                
            }
            listfunctions.updateListCount();
            verifyClearCompletedDisplay();
        },
        //clicked on the Completed link in the footer
        showCompletedItems: function () {
            $('#todo-list li').each(function () {
                var checkmark = $(this).find('.toggle').prop("checked");
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
                var checkmark = $(this).find('.toggle').prop("checked");
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
                var checkmark = $(this).find('.toggle').prop("checked");
                if (checkmark === true) {
                    numcompleted++;
                }
            });
            var numactive = totallistnum - numcompleted;
            console.log("active items: " + numactive);
            var countstring = '';
            if (numactive === 1) {
                countstring = numactive + " item left";
               $('#footer #todo-count').text(countstring);     
            } else {
                countstring = numactive + " items left";
                $('#footer #todo-count').text(countstring);   
            }
       /*   
            $('#footer #todo-count #numcountstyle').text(numactive);
            if (numactive === 1) {
                $('#footer #todo-count').text(" item left");
                
                // countstring = numactive + " item left";
             //  $('#footer #todo-count').text(" item left");     
            } else {
                var  finalstr = $('#footer #todo-count').text().replace("item", "items");
           //     $('#footer #todo-count').text("items left");
          //      $('#footer #todo-count #numcountstyle').text(numactive);
               // countstring = numactive + " items left";
               
            }
            */
        }
    };
    
    function setupNewListeners(newlistitem) {
        
        newlistitem.on("dblclick", function (event) {
            //if double click on the list item then can edit it
            console.log("Double click event");
            console.log(event.target.nodeName);
            listfunctions.editListItem(event);
        });
       
        newlistitem.find('.toggle').on("click", function () {
            console.log("Clicked on a checkmark");
            var currentlist = $(this).parent().parent();
            if (this.checked === true) {
                listfunctions.completedListItem(currentlist, true);
            } else {
                listfunctions.completedListItem(currentlist, false);
            }
            
        });
        
        newlistitem.find('#toggle-all').on("click", function (event) {
            //click on the chevron
            console.log("clicked on the chevron");
            if (this.checked === true) {
                console.log("chevron is checked");
                listfunctions.completedAll(true);
            } else {
                console.log("chevron is un-checked");
                listfunctions.completedAll(false);
            }
            
        });
        
        newlistitem.find('.destroy').on("click", function () {
           //clicked on the 'X' button
            console.log("clicked to delete to do item");
            var listitem = $(this).parent().parent();
            listfunctions.deleteListItem(listitem);
        });
        
        newlistitem.find('#clear-completed').on("click", function () {
            console.log("clear-completed button pressed");
            deleteAllCompletedItems();
        });
        
        
        $('.edit').on("focusout", function (event) {
            console.log("edit box lost focus");
            listfunctions.completeEditListItem(event);
        });
        
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
                listfunctions.cancelEditListItem(event, listentry);
            }
        });
    }
        
    function turnOffListeners(listitem) {
        //TODO turn off listeners here
    }
    
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
    
    function deleteAllCompletedItems() {
        console.log("deleteAllCompletedItems");
        var todoitems = $('#todo-list li');
        todoitems.each(function () {
            var checkmark = $(this).find('.toggle').prop("checked");
            if (checkmark === true) {
               // var idnum = $(this).attr('data-id');
                turnOffListeners(todoitems);
                $(this).remove();
                listfunctions.updateListCount();
                verifyClearCompletedDisplay();
            }
        });
    }
    
    setListeners();
    listfunctions.updateListCount();
    verifyClearCompletedDisplay();
});