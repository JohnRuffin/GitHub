var LASSO_MENU_LABEL_POLYGON = "Polygon";
var LASSO_MENU_LABEL_RECTANGLE = "Rectangle";
var LASSO_MENU_LABEL_FREEHAND = "Freeform";
var LASSO_MENU_LABEL_CLEAR = "Clear Selections";

var LASSO_MENU_ICON_POLYGON_ON = "k-sprite k-icon lasso-polygon-on";
var LASSO_MENU_ICON_POLYGON_OFF = "k-sprite k-icon lasso-polygon-off";

var LASSO_MENU_IOCN_RECTANGLE_ON = "k-sprite k-icon lasso-square-on";
var LASSO_MENU_IOCN_RECTANGLE_OFF = "k-sprite k-icon lasso-square-off";

var LASSO_MENU_ICON_FREEHAND_ON = "k-sprite k-icon lasso-freeform-on";
var LASSO_MENU_ICON_FREEHAND_OFF = "k-sprite k-icon lasso-freeform-off";
var LASSO_TOOLTIP = "To select areas, click and drag.<br> " + "<br>" + "To apply selections,right-click on map.<br>" + "<br>" + "To clear selections, on toolbar click Lasso<br>" + " button > <b>Clear Selections</b>";
/**
 * Initializing the lasso menu and lasso functionality
 * @param lassoDiv 			place holder for creating the lasso menu
 * @param esriMapObject		esriMap object
 * @param lassoListenerFn 	callback handler
 * @returns {LassoComponent}
 */

function LassoComponent(lassoDiv, esriMapObject, lassoGraphicLayer, lassoListenerFn, lassoEndHandler) {
    try {
        var lassoComponent = this;
        var lassoText = EMPTY_STRING;
        var imageCssClass = EMPTY_STRING;
        if (!lassoDiv) {
            lassoDiv = "mapAreaDiv";
        }
        this.lassoDiv = lassoDiv;

        if (isAdvancedQueryModule()) {
            lassoText = "Lasso";
            imageCssClass = "k-icon icon-lasso-select-disable";
        } else {
            imageCssClass = "k-icon";
            lassoText = "Lasso";
        }

        //initializing the lasso menu datasoure
        this.lassoDatasource = [{
            text: "",
            spriteCssClass: "k-icon icon-lasso-select-disable",
            items: [{
                text: LASSO_MENU_LABEL_FREEHAND,
                spriteCssClass: LASSO_MENU_ICON_FREEHAND_ON
            }, {
                text: LASSO_MENU_LABEL_RECTANGLE,
                spriteCssClass: LASSO_MENU_IOCN_RECTANGLE_ON
            }, {
                text: LASSO_MENU_LABEL_POLYGON,
                spriteCssClass: LASSO_MENU_ICON_POLYGON_ON
            }, {
                text: LASSO_MENU_LABEL_CLEAR,
                spriteCssClass: "k-icon lasso-lasso-off"
            }]
        }];
        this.currentShape;
        this.esriMapObject = esriMapObject;
        this.lassoEndHandler = lassoEndHandler;
        this.lassoGraphicLayer = lassoGraphicLayer;
        this.lassoListenerFn = lassoListenerFn;
        this.lassoMenuComponent;
        this.lassoSelectedItem;

        //attaching the onDrawEnd event handler....
        //drawtool for lasso
        esriMapObject.createDrawTool();
        esriMapObject.addDrawEvent("draw-end", function(evt) {
            lassoComponent.lassoEndHandler(evt, lassoComponent.currentShape);
        });


    } catch (e) {
        alert("Error [" + e.message + "] occurred while initializing the map");
    }
}

/**
 * Menu creation
 */
LassoComponent.prototype.createMenu = function() {
    var lassoComponent = this;
    //tooltip for different shapes...
    esri.bundle.toolbars.draw.addShape = LASSO_TOOLTIP;
    esri.bundle.toolbars.draw.start = LASSO_TOOLTIP;
    esri.bundle.toolbars.draw.freehand = LASSO_TOOLTIP;
    //initializing lasso menu...
    this.lassoMenu = parent.$("#" + lassoComponent.lassoDiv).kendoMenu({
        dataSource: this.lassoDatasource,
        open: function(e) {
            //basic initialization methods...
            parent.enableDragging(parent.DASHBOARD_ID_QUERY, false);
            //remove the over flow style when opening the menu
            if (isAdvancedQueryModule()) {
                parent.dashboardController.getDashboard(parent.DASHBOARD_ID_MAP_VIEW).data("kendoWindow").wrapper.find(".window-header").removeClass("addOverflowStyle");
            }
            //remove the title for the lasso menu
            lassoComponent.lassoMenu.attr("title", "");
        },
        close: function(e) {
            //add style for Over flow 
            if (isAdvancedQueryModule()) {
                parent.dashboardController.getDashboard(parent.DASHBOARD_ID_MAP_VIEW).data("kendoWindow").wrapper.find(".window-header").addClass("addOverflowStyle");
            }
            //enable dragging
            parent.enableDragging(parent.DASHBOARD_ID_QUERY, true);
            //when menu is closed then re-assign the title / tooltip
            lassoComponent.lassoMenu.attr("title", "Select area on map");
        },
        openOnClick: true,
        select: function(e) {
            //event handler whenever we select a menu item 
            //get the selected menu text
            var selectedMenuText = $(e.item).children(".k-link").text();
            //get all the selected items...
            var selectedItems = this.element.find(".k-state-selected");
            //if there are items that are already selected and need to selected current menu item... 
            if (selectedItems && selectedMenuText != "") {
                //then..unselect all the items that are already selected except for the menu item that need to be selected...
                for (var i = 0; i < selectedItems.length; i++) {
                    var menuItem = selectedItems[i];
                    if (selectedMenuText != $(menuItem).children(".k-link").text()) {
                        $(menuItem).removeClass("k-state-selected");
                        //whenever making the menu item as un-selected then change the corresponding item icon 
                        if ($(menuItem).children(".k-link").text() == LASSO_MENU_LABEL_FREEHAND) {
                            lassoComponent.updateStyle(menuItem, LASSO_MENU_ICON_FREEHAND_ON);
                        }
                        if ($(menuItem).children(".k-link").text() == LASSO_MENU_LABEL_RECTANGLE) {
                            lassoComponent.updateStyle(menuItem, LASSO_MENU_IOCN_RECTANGLE_ON);
                        }
                        if ($(menuItem).children(".k-link").text() == LASSO_MENU_LABEL_POLYGON) {
                            lassoComponent.updateStyle(menuItem, LASSO_MENU_ICON_POLYGON_ON);
                        }
                    }
                }
            }

            //if the selected item is polygon 
            if (selectedMenuText == LASSO_MENU_LABEL_POLYGON) {
                //then add selected item style...
                lassoComponent.lassoMenuComponent = e.item; {
                    $(e.item).addClass("k-state-selected");
                    $(e.item).parents("ul#mapAreaDiv").addClass("n-icon-active");
                    //activate the drawtool to draw the polygon
                    lassoComponent.drawShape("Polygon");
                }
            } else if (selectedMenuText == LASSO_MENU_LABEL_RECTANGLE) {
                //if the selected item is rectangle 
                lassoComponent.lassoMenuComponent = e.item; {
                    $(e.item).addClass("k-state-selected");
                    $(e.item).parents("ul#mapAreaDiv").addClass("n-icon-active");
                    //activate the drawtool to draw the rectnagle
                    lassoComponent.drawShape("Rectangle");
                }
            } else if (selectedMenuText == LASSO_MENU_LABEL_FREEHAND) {
                //if the selected item is freehand  polygon
                lassoComponent.lassoMenuComponent = e.item; {
                    $(e.item).addClass("k-state-selected");
                    $(e.item).parents("ul#mapAreaDiv").addClass("n-icon-active");
                    //activate the drawtool to draw the freehand polygon
                    lassoComponent.drawShape("Freehand Polygon");
                }
            } else if (selectedMenuText == LASSO_MENU_LABEL_CLEAR) {
                //if the selected menu item is to clear the selections...then 
                lassoComponent.lassoMenuComponent = e.item;
                lassoComponent.resetLassoListener();
                $(e.item).parents("ul#mapAreaDiv").removeClass("n-icon-active");
            }

            //tooltip width
            $(".tooltip").width(250);
        }
    });
    
    if(!isAdvancedQueryModule()){
    	$("#"+this.lassoDiv).find("span.k-icon.k-i-arrow-s").parent().append("<span style='color:#000000;margin-top:-4px' class='icon-label'>Lasso<span>");        
    }
    
    
    //this.addTooltips();
    //complete lasso function when the user perform the right click operation....
    $('#map').mousedown(function(event) {
        var event = event || window.event;
        //check for right click event...
        if (event.which == '3') {
        	lassoComponent.rightClickListener(event);
        }
    });

};


LassoComponent.prototype.rightClickListener = function(event) {
	var lassoComponent = this;
    //then end the draw operation...
    if (lassoGraphicLayer != undefined && lassoGraphicLayer.graphics.length > 0) {
        lassoComponent.onLassoDrawEnd(lassoComponent.lassoMenu, event);
    }
    //clear the menu selection...
    lassoComponent.clearMenuSelection();
    lassoComponent.lassoMenu.removeClass("n-icon-active");

};


LassoComponent.prototype.resetLassoListener = function() {
	var lassoComponent = this;
	lassoComponent.clearSelections();
    //trigger the call back method...
    lassoListenerFn('onClear');
};


/**
 * clear the menu selection
 */
LassoComponent.prototype.clearMenuSelection = function() {
    $(this.lassoMenuComponent).removeClass("k-state-selected");
};

LassoComponent.prototype.addTooltips = function() {
    try {
        var menuChildren = $(this.lassoMenu).find("li");
        var count = 0;
        if (menuChildren != undefined) {
            count = menuChildren.length;
            if (count > 0) {
                var liElement;
                for (var i = 1; i < count; i++) {
                    liElement = menuChildren[i];
                    $(liElement).attr('title', ""); //$(liElement).text()
                }
            }
        }
    } catch (e) {
        console.log("Error while adding tooltips to menu...[" + e.message + "]");
    }

};

/**
 * update the menu style for that menu item...
 * @param lassoMenuItem	
 * @param className
 */
LassoComponent.prototype.updateStyle = function(lassoMenuItem, className) {
    $(lassoMenuItem).children(".k-link").find("span").removeClass();
    $(lassoMenuItem).children(".k-link").find("span").addClass(className);
};

/**
 * complete the lasso functionality
 * @param lassoMenu
 */
LassoComponent.prototype.onLassoDrawEnd = function(lassoMenu, event) {
    var lassoComponent = this;
    //remove the selected class from the menu ...
    if (lassoMenu != undefined && lassoMenu.element != undefined) {
        lassoMenu.element.find(".k-state-selected").removeClass("k-state-selected");
    }
    //deactivate the drawtool
    lassoComponent.esriMapObject.deactivateDrawTool();
    //callback handler...
    lassoListenerFn('onLassoDrawEnd', event);
};

/**
 * Draw lasso shape on map
 * @param shape
 */
LassoComponent.prototype.drawShape = function(shape) {
    var lassoComponent = this;
    lassoComponent.esriMapObject.activateDrawTool(shape, "crosshair");
    this.currentShape = shape;
};

/**
 * clear selections
 */
LassoComponent.prototype.clearSelections = function() {
    var lassoComponent = this;
    //deactivate the darw tool....
    lassoComponent.esriMapObject.deactivateDrawTool();

    if (lassoGraphicLayer) {
        //clear the lasso graphics...
        lassoGraphicLayer.clear();
    }
};