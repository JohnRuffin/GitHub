/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function draggableOnDragStart(e) {
    console.log("dragstart");
}

function draggableOnDrag(e) {
    console.log("drag");
}

function draggableOnCancel(e) {
    console.log("drag cancel");
}

function draggableOnDragEnd(e) {
    console.log("dragend");
}

function droptargetOnDragEnter(e) {
    console.log("dragenter");
}

function droptargetOnDragLeave(e) {
    console.log("dragleave");
}

function droptargetOnDrop(e) {
    console.log("drop");
}

function lassoDragHandler() {
    var imgSource = $('#lassoDragImg').attr('src');

    if (imgSource.indexOf("icon-move-hand-off") > -1) {
        map.isPan = false;
        $('#lassoDragImg').attr("src", "html5/assets/icons/icon-move-hand.png");
        $("#map").kendoDraggable({
            hint: function() {
                return $("<span class='normal'><img src='html5/assets/icons/icon-move-hand.png' ></img></span>").css({
                    marginLeft: "-40px",
                    marginTop: "-40px"
                });
            },
            cursorOffset: {
                top: -($('.normal').height() / 2),
                left: -($('.normal').width() / 2)
            },
            dragstart: draggableOnDragStart,
            drag: draggableOnDrag,
            dragend: draggableOnDragEnd,
            dragcancel: draggableOnCancel
        });

        $("#filtersGrid").kendoDropTarget({
            dragenter: droptargetOnDragEnter,
            dragleave: droptargetOnDragLeave,
            drop: droptargetOnDrop
        });
    } else {
        map.isPan = true;
        $('#lassoDragImg').attr("src", "html5/assets/icons/icon-move-hand-off.png");
        $("#map").off();
    }
}