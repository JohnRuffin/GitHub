/**
 * 
 * @returns {PopupManager}
 */

function PopupManager() {
    this.popupMap = {};
    this.dataObject;
    this.top = 100;
    this.left = 100;
}

var popupManager = new PopupManager();

/**
 * 
 * @param graphic
 * @param laneOrLegKey
 */
PopupManager.prototype.showPopup = function(event, graphic, laneOrLegKey, callbackHandler, closeCallbackHandler, openCallbackHandler, options) {
    this.dataObject = graphic.data;
    this.initialize();
    if (this.dataObject) {
        this.left = event.screenPoint != undefined?event.screenPoint.x: event.screenX;
        this.top = event.screenPoint != undefined?event.screenPoint.y: event.screenY;
        //initialize the window
        var popupWindow = this.initializePopupWindow(laneOrLegKey, "Route Selection", "485px", false, "win" + i, closeCallbackHandler, openCallbackHandler, options);
        if (callbackHandler != undefined) {
            if (options != undefined) {
                callbackHandler(graphic, popupWindow, options.includeDeletedRoutes);
            } else{
                callbackHandler(graphic, popupWindow);
            }
        }
    }
};


PopupManager.prototype.initialize = function() {
    this.globalStylesMap = esriMap.getLayerGlobalStylesMap(getLayerId());
    this.clonedLegObject = clone(this.dataObject);
};
/**
 * 
 * @param kendoWindowId
 * @param laneKey
 * @param xPosition
 * @param yPosition
 * @param width
 * @param isResize
 * @param windowKey
 */
PopupManager.prototype.initializePopupWindow = function(kendoWindowId, laneKey, width, isResize, windowKey, closeCallbackHandler, openCallbackHandler, options) {
    var commonWidgetComponent;
    //check whether there are windows on the selected lane and that window key
    if (this.popupMap[laneKey]) { //get the window
        commonWidgetComponent = this.popupMap[laneKey];
    }

    //if common window popup  window is not created ... 
    if (!commonWidgetComponent) {
        //create one... 
        commonWidgetComponent = this.createPopupWindows(kendoWindowId, laneKey, width, isResize, closeCallbackHandler, openCallbackHandler, options);
    } {
        //update the position of the kendo window
        commonWidgetComponent.closest(".k-window").css({
            top: this.top,
            left: this.left
        });        
    }
    
    commonWidgetComponent.closest(".k-window").addClass(kendoWindowId);
    
    commonWidgetComponent.data("kendoWindow").open();
    //cache it.... ready to go
    this.popupMap[laneKey] = commonWidgetComponent;
    
    return commonWidgetComponent;
};

PopupManager.prototype.close = function(windowId) {
    if (windowId != undefined) {
        try {
            var windowKey;
            var popupWindow;
            if (this.popupMap) {
                if (windowId != undefined) {
                    popupWindow = this.popupMap[windowId];
                    popupWindow.data("kendoWindow").close();
                    if (isDestroy) {
                        popupWindow.destroy();
                        this.popupMap[windowId] = null;
                    }
                    if (isDestroy) {
                        this.popupMap[windowId] = null;
                    }
                }
            }
        } catch (e) {
            console.log("common window popup  window is not created");
        }
    }
};

/**
 * 
 * @param kendoWindowId
 * @param title
 * @param xPosition
 * @param yPosition
 * @param width
 * @param isResize
 * @returns {___popupWIndow1}
 */
PopupManager.prototype.createPopupWindows = function(kendoWindowId, title, width, isResize, closeCallbackHandler, openCallbackHandler, options) {
    var commonWidgetComponent = this;
    var popupWIndow;
    //creating the window using Kendo API
    if ($("#" + kendoWindowId).length > 0) {
        popupWIndow = $("#" + kendoWindowId);
    } else {
        popupWIndow = $("<div id='" + kendoWindowId + "' style='overflow:hidden'/>");
    }

    if (!popupWIndow.data("kendoWindow")) {
        popupWIndow = popupWIndow.kendoWindow({
            width: width,
            height: "300px",
            /*resizable: false,*/
            actions: ["Close"],
            title: title,
            close: function(event) {
                if (closeCallbackHandler != undefined) {
                    closeCallbackHandler(event);
                }
            },
            open:  function(event){
            	if (openCallbackHandler != undefined) {
                    if(options != undefined){
                        openCallbackHandler(event, popupWIndow, options.includeDeletedRoutes);
                    }else {
                        openCallbackHandler(event, popupWIndow);
                    }
                }
            }
        });
    }
    popupWIndow.id = kendoWindowId;
    return popupWIndow;
};