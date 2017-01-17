$(document).ready(function () {

    $(function () {
        $("#sortable").sortable({
            placeholder: "ui-state-highlight"
        }).disableSelection().on("sortbeforestop", dragend);
    });

    var myDIV = $('#myDIV');
    var myUL = $('.myUL');
    $('#myInput').focus();

    myDIV.click(function (event) {
        if (event.target.tagName === 'SPAN') {
            newElement();
        }
    });

    myDIV.keydown(function (event) {
        if (event.keyCode === 13) {
            newElement();
        }
    });

    myUL.click(function (ev) {
        if (ev.target.tagName === 'LI') {
            var id = ev.target.getAttribute('id').substr(5);
            editLocalStorage(id, ev.target.firstChild.textContent, !ev.target.classList.contains('checked'));
        } else if (ev.target.classList.contains('close')) {
            id = ev.target.parentNode.getAttribute('id').substr(5);
            removeFromLocaleStorage(id);
        } else if (ev.target.classList.contains('edit')) {
            var li = ev.target.parentNode;
            var div = $("<div></div>").attr('id', 'popup');
            var input = $("<input>").val(li.firstChild.textContent);
            var buttonCancel = $('<button>').html('Cancel').click(function () {
                div.remove();
                show();
            });
            var buttonSave = $('<button>').html('Save').click(function (event) {
                editLocalStorage(li.getAttribute('id').substr(5), event.target.parentNode.firstChild.value, li.classList.contains('checked'));
                div.remove();
            });
            input.attr('type', 'text');
            div.append(input).append(buttonCancel).append(buttonSave);
            $('body').append(div);
            input.focus();
        }
    });

    function newElement() {
        var input = $('#myInput');
        if (input.val() === '') {
            alert("You must write something!");
        } else {
            addToLocalStorage(input.val());
        }
        input.val('');
    }

    function addToLocalStorage(todoItem) {
        var dataTDI = '{"todoitem":{"todoItem":"' + todoItem + '","checked":"false"}}';
        $.ajax({
            url: "/api/v1/todoitems",
            headers: {
                "Content-Type": "application/json"
            },
            type: "POST",
            data: dataTDI,
            success: onAjaxSuccess,
            dataType: "text"
        });
        function onAjaxSuccess(data) {
            show();
        }
    }

    function editLocalStorage(id, todoitem, checked) {
        var dataTDI = '{"todoitem":{"todoItem":"' + todoitem + '","checked":"' + checked + '"}}';
        $.ajax({
            url: "/api/v1/todoitems/" + id,
            headers: {
                "Content-Type": "application/json"
            },
            type: "PUT",
            data: dataTDI,
            success: onAjaxSuccess,
        });
        function onAjaxSuccess(data) {
            show();
        }
    }

    function removeFromLocaleStorage(id) {
        $.ajax({
            type: 'DELETE',
            url: "/api/v1/todoitems/" + id
        })
            .done(function (response) {
                show();
            }.bind(this))
            .fail(function (error) {
                alert(error.statusText);
            });
    }

    function show() {
        $.get("/api/v1/todoitems")
            .done(function (response) {
                var todos = response.todoitems;
                myUL.html('');
                for (var i = 0; i < todos.length; i++) {
                    var text = document.createTextNode(todos[i].todoItem);
                    var li = $("<li></li>").attr('id', 'todo-' + todos[i]._id).attr('draggable', true).append(text);
                    if (todos[i].checked === true) {
                        li.addClass('checked');
                    }
                    li.addClass('ui-state-default');
                    var span = $("<span>").html("\u00D7").addClass('close');
                    li.append(span);
                    span = $("<span>").html("Edit").addClass('edit');
                    li.append(span);
                    myUL.append(li);
                }
                count();
            }.bind(this))
            .fail(function (error) {
                alert(error.statusText);
            })
    }

    function count() {
        var allListItems = myUL.children().length;
        var selectedList = $('.checked').length;
        $('#done').html('').html(selectedList);
        $('#last').html('').html(allListItems - selectedList);
        $('#all').html('').html(allListItems)
    }
    show();
});
