function MarketViewPopUp() {
    this.marketviewPopUpWin = null;
    this.dataObject;
    this.marketviewPopUpMap = {};
    this.isMarketViewExpanded;
    this.top = 100;
    this.left = 100;
    this.updatedTop;
    this.updatedLeft;
    this.loadIndicator;
    this.loadIndicatorMin;
    this.loadIndicatorMax;
    this.loadIndicatorNormal;
    this.loadIndicatorUnder;
    this.marketViewWChk = false;
    this.marketViewWPercentChk = true;
    this.marketViewCuChk = false;
    this.marketViewCuPercentChk = true;
    this.routesLabelChk = true;
    this.marketViewVolChk = true;
    this.iataEquipDescLabelChk = true;
    this.departureTimeLabelChk = false;
    this.equipCodeLabelChk = false;
    this.effDaysLabelChk = true;
    this.arrivalTimeLabelChk = false;
    this.marketOrgDestChk = true;
}

/**
 * initialize all the variables
 * @param isMarketViewExpanded
 * @param marketViewDisplaySettingsMap
 */
MarketViewPopUp.prototype.initialize = function(isMarketViewExpanded, marketViewDisplaySettingsMap) {

    this.isMarketViewExpanded = isMarketViewExpanded;
    this.loadIndicator = marketViewDisplaySettingsMap["loadIndicator"] != undefined ? marketViewDisplaySettingsMap["loadIndicator"] : this.loadIndicator;
    this.loadIndicatorMin = marketViewDisplaySettingsMap["loadIndicatorMin"] != undefined ? marketViewDisplaySettingsMap["loadIndicatorMin"] : this.loadIndicatorMin;
    this.loadIndicatorMax = marketViewDisplaySettingsMap["loadIndicatorMax"] != undefined ? marketViewDisplaySettingsMap["loadIndicatorMax"] : this.loadIndicatorMax;;
    this.loadIndicatorUnder = marketViewDisplaySettingsMap["loadIndicatorUnder"] != undefined ? marketViewDisplaySettingsMap["loadIndicatorUnder"] : this.loadIndicatorUnder;;
    this.loadIndicatorNormal = marketViewDisplaySettingsMap["loadIndicatorNormal"] != undefined ? marketViewDisplaySettingsMap["loadIndicatorNormal"] : this.loadIndicatorNormal;;
    this.marketViewWChk = marketViewDisplaySettingsMap["marketViewWChk"] != undefined ? marketViewDisplaySettingsMap["marketViewWChk"] : this.marketViewWChk;
    this.marketViewWPercentChk = marketViewDisplaySettingsMap["marketViewWPercentChk"] != undefined ? marketViewDisplaySettingsMap["marketViewWPercentChk"] : this.marketViewWPercentChk;
    this.marketViewCuChk = marketViewDisplaySettingsMap["marketViewCuChk"] != undefined ? marketViewDisplaySettingsMap["marketViewCuChk"] : this.marketViewCuChk;
    this.marketViewCuPercentChk = marketViewDisplaySettingsMap["marketViewCuPercentChk"] != undefined ? marketViewDisplaySettingsMap["marketViewCuPercentChk"] : this.marketViewCuPercentChk;
    this.routesLabelChk = marketViewDisplaySettingsMap["routesLabelChk"] != undefined ? marketViewDisplaySettingsMap["routesLabelChk"] : this.routesLabelChk;
    this.marketViewVolChk = marketViewDisplaySettingsMap["marketViewVolChk"] != undefined ? marketViewDisplaySettingsMap["marketViewVolChk"] : this.marketViewVolChk;
    this.iataEquipDescLabelChk = marketViewDisplaySettingsMap["iataEquipDescLabelChk"] != undefined ? marketViewDisplaySettingsMap["iataEquipDescLabelChk"] : this.iataEquipDescLabelChk;

    this.departureTimeLabelChk = marketViewDisplaySettingsMap["departureTimeLabelChk"] != undefined ? marketViewDisplaySettingsMap["departureTimeLabelChk"] : this.departureTimeLabelChk;
    this.equipCodeLabelChk = marketViewDisplaySettingsMap["equipCodeLabelChk"] != undefined ? marketViewDisplaySettingsMap["equipCodeLabelChk"] : this.equipCodeLabelChk;
    this.effDaysLabelChk = marketViewDisplaySettingsMap["effDaysLabelChk"] != undefined ? marketViewDisplaySettingsMap["effDaysLabelChk"] : this.effDaysLabelChk;
    this.arrivalTimeLabelChk = marketViewDisplaySettingsMap["arrivalTimeLabelChk"] != undefined ? marketViewDisplaySettingsMap["arrivalTimeLabelChk"] : this.arrivalTimeLabelChk;
    this.marketOrgDestChk = marketViewDisplaySettingsMap["marketOrgDestChk"] != undefined ? marketViewDisplaySettingsMap["marketOrgDestChk"] : this.marketOrgDestChk;

    this.top = marketViewDisplaySettingsMap["top"] != undefined ? marketViewDisplaySettingsMap["top"] : 100;
    this.left = marketViewDisplaySettingsMap["left"] != undefined ? marketViewDisplaySettingsMap["left"] : 100;;

};

MarketViewPopUp.prototype.openPopup = function(graphic, top, left) {
    this.top = top;
    this.left = left;
    this.showPopup(graphic);
};
/**
 * Entry point to create a popup for a selcted graphic 
 * @param graphic
 */
MarketViewPopUp.prototype.showPopup = function(graphic) {
    var attributes;
    var legDetails;
    var windowCount;
    //lane key or ID
    var laneKey = graphic.toolTip;
    var left = this.left; //evt.screenPoint.y;
    var top = this.top; //evt.screenPoint.x;
    //main data object for the selected node
    this.dataObject = graphic.data;
    var kendoWindowId;
    if (this.dataObject) {
        attributes = this.dataObject.attributes;
        legDetails = attributes.LegDetails;
        //get number of lanes
        windowCount = attributes.LegDetails ? attributes.LegDetails.length : 0;

        if (windowCount > 0) {
            var updatedTop = this.top;
            var updatedLeft = this.left;
            for (var i = 0; i < windowCount; i++) {
                if (i > 0) {
                    updatedLeft = updatedLeft + 25;
                    updatedTop = updatedTop + 25;
                }
                //unique id for each window
                kendoWindowId = "marketView" + new Date().getTime() + "_" + laneKey + "_" + i;
                //initialize the window
                this.initializeMarketViewWindow(kendoWindowId, laneKey, updatedTop, updatedLeft, "350px", true, "win" + i, legDetails[i]);
                this.top = updatedTop;
                this.left = updatedLeft;
            }
        }
        //open the window
        this.openAll(this.marketviewPopUpMap[laneKey], top, left, laneKey);
    }
};

MarketViewPopUp.prototype.updateMarketViewWindows = function() {
    var marketViewComponent = this;
    try {
        var popupKeys = Object.keys(this.marketviewPopUpMap);
        var windowKey;
        var popupWindow;
        if (this.marketviewPopUpMap) {
            for (var i = 0; i < popupKeys.length; i++) {
                if (popupKeys[i]) {
                    marketViewComponent.openAll(this.marketviewPopUpMap[popupKeys[i]], null, null, popupKeys[i]);
                }
            }
        }
    } catch (e) {
        console.log("market view window is not created");
    }
};

MarketViewPopUp.prototype.getSelectedLabelsCount = function() {
    var marketviewComponent = this;
    var count = 0;
    if (marketviewComponent.marketViewWChk) {
        count += 1;
    }
    if (marketviewComponent.marketViewCuChk) {
        count += 1;
    }
    if (marketviewComponent.marketViewCuPercentChk) {
        count += 1;
    }
    if (marketviewComponent.marketViewWPercentChk) {
        count += 1;
    }
    if (marketviewComponent.routesLabelChk) {
        count += 1;
    }
    if (marketviewComponent.marketViewVolChk) {
        count += 1;
    }
    if (marketviewComponent.iataEquipDescLabelChk) {
        count += 1;
    }

    if (marketviewComponent.departureTimeLabelChk) {
        count += 1;
    }
    if (marketviewComponent.equipCodeLabelChk) {
        count += 1;
    }

    if (marketviewComponent.effDaysLabelChk) {
        count += 1;
    }

    if (marketviewComponent.arrivalTimeLabelChk) {
        count += 1;
    }
    if (marketviewComponent.marketOrgDestChk) {
        count += 1;
    }

    return count;
};

MarketViewPopUp.prototype.getExpandedWindowWidth = function(count) {
    var width = "100px";

    if (count == 12) {
        return "600px";
    } else if (count == 11) {
        return "600px";
    } else if (count == 10) {
        return "600px";
    } else if (count == 9) {
        return "550px";
    } else if (count == 8) {
        return "550px";
    } else if (count == 7) {
        return "500px";
    } else if (count == 6) {
        return "467px";
    } else if (count == 5) {
        return "467px";
    } else if (count == 4) {
        return "467px";
    } else if (count == 3) {
        return "467px";
    } else if (count == 2) {
        return "467px";
    } else if (count == 1) {
        return "467px";
    }
    return "467px";
};

MarketViewPopUp.prototype.getCollapsedWindowWidth = function(count) {
    var width = "100px";

    if (count == 11) {
        return "500px";
    } else if (count == 10) {
        return "480px";
    } else if (count == 9) {
        return "450px";
    } else if (count == 8) {
        return "420px";
    } else if (count == 7) {
        return "350px";
    } else if (count == 6) {
        return "330px";
    } else if (count == 5) {
        return "300px";
    } else if (count == 4) {
        return "250px";
    } else if (count == 3) {
        return "205px";
    } else if (count == 2) {
        return "150px";
    } else if (count == 1) {
        return "100px";
    }
    return "100px";
};

MarketViewPopUp.prototype.getWindowWidth = function(isCollapsed, marketviewWindow) {
    var windowWidth;
    var count = this.getSelectedLabelsCount();
    if (!isCollapsed) {
        windowWidth = this.getExpandedWindowWidth(count);
    } else {
        windowWidth = this.getHeaderTextLength(marketviewWindow);
        if (windowWidth == 0) {
            this.getCollapsedWindowWidth(count);
        }
    }
    return windowWidth;
};


MarketViewPopUp.prototype.getHeaderTextLength = function(marketviewWindow) {
    var windowTitle = marketviewWindow.parent().find(".k-window-titlebar").find(".k-window-title").text();

    var marketHeaderTitle = marketviewWindow.parent().find(".k-window-titlebar").find("#marketHeader").text();
    var width = getTextLength(windowTitle) + getTextLength(marketHeaderTitle);

    if ($.trim(marketHeaderTitle) != "") {
        width += 100;
    } else {
        width += 20;
    }
    return width;
};

/**
 * initializes the window and cached
 * @param kendoWindowId
 * @param laneKey
 * @param xPosition
 * @param yPosition
 * @param width
 * @param isResize
 * @param windowKey
 * @param legDetail
 */
MarketViewPopUp.prototype.initializeMarketViewWindow = function(kendoWindowId, laneKey, xPosition, yPosition, width, isResize, windowKey, legDetail) {
    var marketviewWindow;
    //check whether the window is already created in the @link marketviewPopUpMap
    if (!this.marketviewPopUpMap[laneKey]) { // initializing the map object if it not created Map<LANE_KEY, Map<Window Key , kendoWindow>>
        this.marketviewPopUpMap[laneKey] = {};
    }

    //check whether there are windows on the selected lane and that window key
    if (this.marketviewPopUpMap[laneKey] && this.marketviewPopUpMap[laneKey][windowKey]) { //get the window
        marketviewWindow = this.marketviewPopUpMap[laneKey][windowKey];
    }

    //if market view window is not created ... 
    if (!marketviewWindow) {
        //create one... 
        marketviewWindow = this.createMarketWindows(kendoWindowId, laneKey, yPosition, xPosition, width, isResize, legDetail);
        //assign the id to the window for future reference 
        marketviewWindow.id = kendoWindowId;
    }else {
        marketviewWindow.data("kendoWindow").open();
    }
    //add the leg detail to the window object for future reference 
    this.addLegDetail(legDetail, marketviewWindow);
    //cache it.... ready to go
    this.marketviewPopUpMap[laneKey][windowKey] = marketviewWindow;
};

/**
 * adding leg detail to the window
 */
MarketViewPopUp.prototype.addLegDetail = function(legDetail, kendoWindow) {
    if (kendoWindow) {
        kendoWindow.legDetail = legDetail;
        kendoWindow.isMatrixLoaded = false;
        kendoWindow.data("kendoWindow").content("<div id='" + legDetail.legId + "'> </div>");
    }
};

/**
 * opens all the windows for that selected lane... 
 * @param allWindowMap
 * @param top
 * @param left
 * @param key
 */
MarketViewPopUp.prototype.openAll = function(allWindowMap, top, left, key) {
    var marketviewComponent = this;
    if (allWindowMap) { // make sure we received all windows that are going to be opened.... 
        var marketviewWindow;
        var updatedTop = top;
        var updatedLeft = left;

        var kendoWindowWidth;
        var windowKeys = Object.keys(allWindowMap); // get the keys for the selected map of windows 
        for (var i = 0; i < windowKeys.length; i++) {
            marketviewWindow = allWindowMap[windowKeys[i]]; //get the market view window... 
            var kendoWindow = marketviewWindow.data("kendoWindow"); // get the kendo window from market view window... 

            if (left != null) { //if the event is generated from the graphic then we have the top and left ..so proceed to add the content... 
                kendoWindow.content(marketviewComponent.addMatrix(marketviewWindow, key));
            }
            //update the header title 
            kendoWindow.options.title = marketviewComponent.updateHeaderTitle(null, marketviewWindow.legDetail, marketviewWindow, key);

            marketviewWindow.parent().find('.k-window-content').css({
                "overflow": "hidden !important"
            });

            if (kendoWindow.wrapper.find(".k-i-restore").length > 0 && kendoWindow.isClose == undefined) {
                kendoWindow.minimize(); // restore the kendo window.... 				
            }
        }

        marketviewComponent.resizeAllWindows(allWindowMap);
    }
};

MarketViewPopUp.prototype.closeAllExcept = function(popupId, isDestroy) {
    try {
        var popupKeys = Object.keys(this.marketviewPopUpMap);
        var windowKey;
        var popupWindow;
        if (this.marketviewPopUpMap) {
            for (var i = 0; i < popupKeys.length; i++) {
                if (popupKeys[i]) {
                    popupWindows = this.marketviewPopUpMap[popupKeys[i]] ? Object.keys(this.marketviewPopUpMap[popupKeys[i]]) : null;
                    if (popupWindows == null) {
                        continue;
                    }
                    for (var j = 0; j < popupWindows.length; j++) {
                        windowKey = popupWindows[j];
                        popupWindow = this.marketviewPopUpMap[popupKeys[i]][windowKey];
                        if (popupId != popupKeys[i] && popupWindow) {
                            popupWindow.data("kendoWindow").close();
                            if (isDestroy) {
                                popupWindow.data("kendoWindow").destroy();
                                this.marketviewPopUpMap[popupKeys[i]][windowKey] = null;
                            }
                        }
                    }
                    if (isDestroy) {
                        this.marketviewPopUpMap[popupKeys[i]] = null;
                    }
                }
            }
        }
    } catch (e) {
        console.log("market view window is not created");
    }

};

MarketViewPopUp.prototype.closeAll = function() {
    this.closeAllExcept(null, false);
};

MarketViewPopUp.prototype.collapseAll = function() {

    try {
        var popupKeys = Object.keys(this.marketviewPopUpMap);
        var windowKey;
        var popupWindow;
        if (this.marketviewPopUpMap) {
            for (var i = 0; i < popupKeys.length; i++) {
                if (popupKeys[i]) {
                    popupWindows = this.marketviewPopUpMap[popupKeys[i]] ? Object.keys(this.marketviewPopUpMap[popupKeys[i]]) : null;
                    if (popupWindows == null) {
                        continue;
                    }
                    for (var j = 0; j < popupWindows.length; j++) {
                        windowKey = popupWindows[j];
                        popupWindow = this.marketviewPopUpMap[popupKeys[i]][windowKey];
                        popupWindow.data("kendoWindow").minimize();
                        this.marketviewResizeWidthUpdateHandler(popupWindow, true, false);
                    }
                }
            }
        }
    } catch (e) {
        console.log("market view window is not created");
    }


};

MarketViewPopUp.prototype.destroyAll = function() {
    this.closeAllExcept(null, true);
};


MarketViewPopUp.prototype.resizeAllWindows = function(marketviewWindow) {
    var marketviewComponent = this;
    try {
        if (marketviewWindow) {

            var windowKeys = Object.keys(marketviewWindow);
            for (var i = 0; i < windowKeys.length; i++) {
                var marketviewPopup = marketviewWindow[windowKeys[i]];
                if (!(marketviewPopup.data("kendoWindow").wrapper.find(".k-i-minimize").length > 0 && marketviewPopup.data("kendoWindow").wrapper.find(".k-i-minimize").parent().attr("style") == "display: none;")) {
                    marketviewComponent.marketviewResizeWidthUpdateHandler(marketviewWindow[windowKeys[i]], false, false);
                } else {
                    marketviewComponent.marketviewResizeWidthUpdateHandler(marketviewWindow[windowKeys[i]], true, false);
                }
            }
        }
    } catch (e) {
        console.log("market view window is not able to reset");
    }
};

/**
 *method to create kendoWindow with specfied winId,title, xPosition & yPosition 
 */
MarketViewPopUp.prototype.createMarketWindows = function(kendoWindowId, title, xPosition, yPosition, width, isResize, legDetail) {
    var marketViewComponent = this;
    //creating the window using Kendo API
    var marketViewWindow = $("<div id='" + kendoWindowId + "' style='overflow:hidden'/>");
    if (!marketViewWindow.data("kendoWindow")) {
        marketViewWindow = marketViewWindow.kendoWindow({
            width: width,
            height: "300px",
            actions: ["Minimize"],
            title: title,
            resize: true,
            open: function(e) { //open event
				if(marketViewWindow.isClose == undefined){
					marketViewWindow.isOpen = true;
					marketViewWindow.data("kendoWindow").toFront();
					marketViewComponent.configureEvents(marketViewWindow);
				}else {
					marketViewWindow.isClose = false;
					marketViewWindow.isOpen = true;
				}
            },	
			close: function(e){
				marketViewWindow.isClose = true;
				marketViewWindow.isOpen = false;
			},	
            resize: function(e) { //resize handler
                if (e.sender.wrapper.find('.k-grid')[0] != undefined) {
                    parent.resizeHandler(e.sender, $("#" + e.sender.wrapper.find('.k-grid')[0].id), 150, 140);
                }
            }
        });
    }
    marketViewWindow.closest(".k-window").css({
        top: yPosition,
        left: xPosition
    });


    marketViewWindow.parent().find('.k-window-content').css({
        "overflow": "hidden !important",
        "min-height": "110px"
    });


    marketViewWindow.parent().addClass("mktPopupWindow"); // adding styles or customizing the kendo window to accomidate to our requirements
    marketViewWindow.parent().addClass("mktpopup-window-actions"); // - do -
    marketViewWindow.parent().find('.k-window-title').css({
        "right": "auto" //alignment to right
    });

    //open the window..... once it is ready....
    marketViewWindow.data("kendoWindow").open();
    //adding minimize event
    this.addMinimizeEvent(marketViewWindow);
    marketViewWindow.data("kendoWindow").wrapper.find(".k-window-actions").attr("style", "width:0px");

    marketViewWindow.data("kendoWindow").wrapper.find(".k-window-actions").unbind("click");
    marketViewWindow.data("kendoWindow").wrapper.find(".k-window-actions").bind("click", function(e) {
    	if(e.target.className == "k-window-actions"){
    		return;
    	}
        if (!(marketViewWindow.data("kendoWindow").wrapper.find(".k-i-minimize").length > 0 &&
        		marketViewWindow.data("kendoWindow").wrapper.find(".k-i-minimize").parent().attr("style") == "display: none;")) {
            marketViewComponent.marketviewResizeWidthUpdateHandler(marketViewWindow, true, true);
        } else {
            marketViewComponent.marketviewResizeWidthUpdateHandler(marketViewWindow, false, true);
        }
    });

    return marketViewWindow;
};

MarketViewPopUp.prototype.configureEvents = function(marketViewWindow) {
    var marketViewComponent = this;

    marketViewWindow.data("kendoWindow").minimize();
    marketViewWindow.data("kendoWindow").wrapper.find("span").bind("click", function(e) {
        marketViewWindow.data("kendoWindow").wrapper.find(".k-i-restore").unbind("click");
    });

    //basic configutations for the created window... 
    marketViewWindow.data("kendoWindow").trigger("minimize"); // trigger minimize event..to make sure that the window is minimized by default
	marketViewWindow.isClose = false;
	marketViewWindow.isOpen = true;
};

MarketViewPopUp.prototype.marketviewResizeWidthUpdateHandler = function(marketviewWindow, isClickEvent, isSetTimeout) {
    var marketviewComponent = this;
    var kendoWindow = marketviewWindow.data("kendoWindow");

    kendoWindowWidth = marketviewComponent.getWindowWidth(isClickEvent, marketviewWindow); //measure dynamic width based on the selected labels in display options
    // set the dynamic width
    kendoWindow.options.width = kendoWindowWidth;
    marketviewWindow.closest(".k-window").css({
        "width": kendoWindowWidth
    });
    if (isSetTimeout) {
        setTimeout(function() {
            kendoWindow.wrapper.css({
                "width": kendoWindowWidth
            });
        }, 100);
    } else {
        kendoWindow.wrapper.css({
            "width": kendoWindowWidth
        });
    }



};

MarketViewPopUp.prototype.addMinimizeEvent = function(marketViewWindow) {
    var marketviewComponent = this;
    var kendoWindow = marketViewWindow.data("kendoWindow");
    kendoWindow.wrapper.find(".k-i-minimize").click(function(e) {
        marketViewWindow.isMinimized = true;
        marketViewWindow.isRestore = false;
        marketViewWindow.isOpen = false;
        kendoWindow.toFront();
        setTimeout(function(e) {
            kendoWindow.wrapper.find(".k-i-restore").unbind("click");
            kendoWindow.wrapper.find(".k-i-restore").bind("click", function(e) {
                marketviewComponent.addRestoreEvent(marketViewWindow);
            });
        }, 50);

    });
};

MarketViewPopUp.prototype.addRestoreEvent = function(marketViewWindow) {
    var marketviewComponent = this;
    var kendoWindow = marketViewWindow.data("kendoWindow");
    marketViewWindow.isMinimized = false;
    marketViewWindow.isRestore = true;
    marketViewWindow.isOpen = true;
    marketViewWindow.isMatrixLoaded = true;
    kendoWindow.toFront();
};

MarketViewPopUp.prototype.openMarketViewCalendar = function(calBtn, legDay, day, legId, noOpDaysL) {
    $("#detailsselection_" + legId).find("#getVolumeBtn").attr("disabled", "disabled");
    showDayControl(true, legDay, calBtn, true, null, true, day, null, noOpDaysL,null,null,null,setSelectedDays);
};

MarketViewPopUp.prototype.onVolumnKeyUp = function(keyEvent, legId) {
    $("#detailsselection_" + legId).find("#getVolumeBtn").attr("disabled", false);
    var evtobj = keyEvent || window.event || event;
    var code = evtobj.charCode ? evtobj.charCode : evtobj.keyCode;
    if (code == 13) {
        $("#volumeDay" + legId).blur();
        $("#detailsselection_" + legId).find("#getVolumeBtn").trigger("click");
    }
};

MarketViewPopUp.prototype.addMatrix = function(kendoWindow, key) {
    var details = kendoWindow.legDetail;
    var marketviewComponent = this;

    var mdiv = document.createElement("div");
    mdiv.id = "matrix_" + details.legId;
    mdiv.style.width = "99%";
    mdiv.legDetails = details;
    $("<div/>").appendTo(document.getElementById(details.legId)).html("<div id=\"detailsselection_" + details.legId + "\" style='padding-top: 10px;' class=\"showMarketStyle\" " + " width='300px'><table border='0'><tr valign='top'><td align='right' style='padding-right:5px;'><label>View volumes for day</label></td><td align='left'><input id=\"volumeDay" + details.legId + "\" " + " type=\"text\" style='width:20px; margin-right:5px;' value=" + kendoWindow.legDetail.legDay + "></td><td><div class=\"calendar-mini\"></div></td><td style='padding-left:5px' ><input type=\"button\" " + " class='closeAll' value=\"Get volumes\" id='getVolumeBtn' disabled='disabled' onclick=\"marketviewVolumeChangeHandler('" + mdiv.id + "', '" + details.legId + "','volumeDay" + details.legId + "'  )\" /></td></tr></table></div>");

    $("#volumeDay" + details.legId).keyup(function(event) {
        marketviewComponent.onVolumnKeyUp(event, details.legId);
    });

    $("#" + details.legId).find("div.calendar-mini").click(function() {
        marketviewComponent.openMarketViewCalendar(this, $("#volumeDay" + details.legId).val(), details.day, details.legId, details.noOpDaysL);
    });

    document.getElementById(details.legId).appendChild(mdiv);

    marketviewComponent.gridId = mdiv.id;
    this.gridParentDivId = details.legId;
    $(mdiv).kendoGrid({
        dataSource: {
        	transport: {
			read: {
				url: function (options) {
			        return getVolumeIBOBMatrixUrl();
			    },
				dataType: "json",
				data: function() {
				  	return marketviewComponent.getParametersMap(details.legId, details.legDay);
			  }
			},
            parameterMap: function(data, operation) {
                return marketviewComponent.getParametersMap(details.legId, details.legDay);
            }
        },
        schema: {
            model: {
                fields: getMarketViewIBOBMatrixSchema()
            }
        },
		aggregate: getAggregateColumns(),
        requestEnd: function(e) {
            $("#detailsselection_" + details.legId).find("#getVolumeBtn").attr("disabled", "disabled");
			try{
				marketviewComponent.updateHeaderTitle(e.response, kendoWindow.legDetail, kendoWindow, key);
				marketviewComponent.resizeAllWindows(marketviewComponent.marketviewPopUpMap[key]);
				parent.resizeHandler($(kendoWindow[0]).data('kendoWindow'), $($(kendoWindow[0]).data('kendoWindow').wrapper.find('.k-grid')[0]), 150, 140);	
			}catch(er){
				console.log("Exception while resizing market view window...."); 
			}
        }
        },
        filterable:true,
	    resizable: true,
		reorderable: true,
		scrollable: true,
        height: "90%",
        requestEnd: function(e) {
            $("#detailsselection_" + details.legId).find("#getVolumeBtn").attr("disabled", "disabled");
            checkForTimeoutError(e);
        },
        columns: getMarketViewIBOBMatrixColumns()
    });
    $(mdiv).addClass("popUpMatriStyle");
    $("<div align='center'/>").appendTo(document.getElementById(details.legId)).html("<div id=\"footerCloseButtonDiv_1372821414153121067321033704320\" align='center' style='padding-top:2px;' ><input type=\"button\" onclick='collapseHandler()' class='closeAll' value=\"Collapse All\"></div>");

};


MarketViewPopUp.prototype.getParametersMap = function(legId, legDay) {
    return {
        "commonCaseId": parent.getCommonCaseId(),
        "scheduleId": parent.getScheduleId(),
        "legId": legId,
        "effDayPatternStr": parent.getSelectedEffDayStrPattern(),
        "timeReference": "L",
        "legDay": $("#volumeDay" + legId).val() == undefined ? legDay : $("#volumeDay" + legId).val(),
        "wtConversionFactor": isWeightInKgsFlag() ? POUND_TO_KG_VALUE : 1,
        "prodGrps": getProdGroupConfiguration(),
        "isMarketView": true
    };
};

MarketViewPopUp.prototype.marketviewVolumeChangeHandler = function(divId, legId, volumeday) {
    var grid = $("#" + divId).data("kendoGrid");
    if (grid != undefined) {
        grid.dataSource.read();
    }
};

/**
 * returns the header string
 * @param legDetails
 * @param kendoWindow
 * @param key
 * @returns {String}
 */
MarketViewPopUp.prototype.updateHeaderTitle = function(response, legDetails, kendoWindow, key) {
    var marketviewComponent = this;
    var weightCubeHtmlStr = "";
    if (response != null) {
	    	kendoWindow.ttlWgt = 0;
	        kendoWindow.ttlCu = 0;
	        kendoWindow.excessWgt = 0;
	        kendoWindow.excessCu = 0;
	        kendoWindow.wgtPer = 0;
	        kendoWindow.cuPer = 0;
	        if(response.length != undefined){
	        	response.map(function(item){
	        		kendoWindow.ttlWgt += parseInt(item["totalWeight"]);
	        	});
	        	
	        	response.map(function(item){
	        		kendoWindow.ttlCu += parseInt(item["totalCube"]);
	        	});
	        	
	        	response.map(function(item){
	        		kendoWindow.excessWgt += parseInt(item["excessWeight"]);
	        	});
	        	
	        	response.map(function(item){
	        		kendoWindow.excessCu += parseInt(item["excessCube"]);
	        	});
	        	
	        	kendoWindow.wgtPer = Math.round(((kendoWindow.ttlWgt + kendoWindow.excessWgt) * 100) / legDetails.maxWt);
	        	kendoWindow.cuPer = Math.round(((kendoWindow.ttlCu + kendoWindow.excessCu) * 100) / legDetails.maxCu);
	        	
	        }
	        	weightCubeHtmlStr = "<div id='marketHeader' class='marketHeaderDiv'>" +
	    		marketviewComponent.getCubeHtmlStr(legDetails, kendoWindow.ttlCu, kendoWindow.cuPer) + 
	    		marketviewComponent.getWeightHtmlStr(legDetails, kendoWindow.ttlWgt, kendoWindow.wgtPer) + 
	    		marketviewComponent.getVolDayHtmlStr(legDetails,kendoWindow)+ "</div>";
        } else {
        	if( (kendoWindow.ttlWgt != undefined)||
        		(kendoWindow.ttlCu != undefined)||
		        (kendoWindow.excessWgt != undefined) ||
		        (kendoWindow.excessCu != undefined)||
		        (kendoWindow.wgtPer != undefined)||
		        (kendoWindow.cuPer != undefined)){
        		 weightCubeHtmlStr = "<div id='marketHeader' class='marketHeaderDiv'>" +
     	    		marketviewComponent.getCubeHtmlStr(legDetails, kendoWindow.ttlCu, kendoWindow.cuPer) + 
     	    		marketviewComponent.getWeightHtmlStr(legDetails, kendoWindow.ttlWgt, kendoWindow.wgtPer) + 
     	    		marketviewComponent.getVolDayHtmlStr(legDetails,kendoWindow)+ "</div>";
            
        	}else{
        		weightCubeHtmlStr = "<div id='marketHeader' class='marketHeaderDiv'>loading...</div>";
        	}
        }
    
    if ($("#marketHeader").length > 0) {
        kendoWindow.parent().find(".k-window-titlebar").find("#marketHeader").remove();
    }
    
    $(weightCubeHtmlStr).insertAfter($("div:last-child", kendoWindow.parent().find(".k-window-titlebar")));
    
    var titleHtmlStr = marketviewComponent.getRouteHtmlStr(legDetails) +" "+ marketviewComponent.getEquipmentDescHtmlStr(legDetails) + " " + 
    				   marketviewComponent.getEquipmentCodeHtmlStr(legDetails) + " " + marketviewComponent.getOriginDestinationHtmlStr(legDetails) +" "+
    				   marketviewComponent.getDeptTimeHtmlStr(legDetails) + " " +marketviewComponent.getArrivalTimeHtmlStr(legDetails) + " " + marketviewComponent.getEffectiveDaysHtmlStr(legDetails);
	
	
    kendoWindow.data("kendoWindow").title(titleHtmlStr);
    return titleHtmlStr;
};

/**
 * 
 * @param legDetails
 * @returns
 */
MarketViewPopUp.prototype.getEquipmentCodeHtmlStr = function(legDetails) {
    if (this.equipCodeLabelChk) {
        return legDetails.equipCode ? "" + legDetails.equipCode + "" : "";
    }
    return "";
};

/**
 * 
 * @param legDetails
 * @returns {String}
 */
MarketViewPopUp.prototype.getOriginDestinationHtmlStr = function(legDetails) {
    if (this.marketOrgDestChk) {
        return legDetails.origin + "-" + legDetails.destination;
    }

    return "";

};

/**
 * 
 * @param legDetails
 * @returns
 */
MarketViewPopUp.prototype.getDeptTimeHtmlStr = function(legDetails) {
    if (legDetails.departureTime && this.departureTimeLabelChk) {
        return legDetails.departureTime ? "" + legDetails.departureTime + "" : "";
    }
    return "";
};

/**
 * 
 * @param legDetails
 * @returns
 */
MarketViewPopUp.prototype.getEffectiveDaysHtmlStr = function(legDetails) {
	var effDay = parent.getEffDaysStringFromSystemSetting(legDetails, "day");
	if (effDay && this.effDaysLabelChk) {
        return effDay ? "" + effDay + "" : "";
    }
    return "";
};

/**
 * 
 * @param legDetails
 * @returns
 */
MarketViewPopUp.prototype.getArrivalTimeHtmlStr = function(legDetails) {
    if (legDetails.arrivalTime && this.arrivalTimeLabelChk) {
        var arrivalTimeStr = legDetails.arrivalTime ? "" + legDetails.arrivalTime + "" : "";
        if (arrivalTimeStr != undefined) {
            arrivalTimeStr += (legDetails.nextArrivalDay == "0" || legDetails.nextArrivalDay == "") ? "" : (legDetails.nextArrivalDay > 0 ? " (+" + legDetails.nextArrivalDay + ")" : " (" + legDetails.nextArrivalDay + ")");
        }
        return arrivalTimeStr;
    }
    return "";
};

/**
 * 
 * @param legDetails
 * @returns
 */
MarketViewPopUp.prototype.getEquipmentDescHtmlStr = function(legDetails) {
    if (this.iataEquipDescLabelChk) {
        return legDetails.iataEquipDesc ? "" + legDetails.iataEquipDesc + "" : "";
    }
    return "";
};
/**
 * 
 * @param legDetails
 * @returns {String}
 */
MarketViewPopUp.prototype.getVolDayHtmlStr = function(legDetails,kendoWindow) {
    var htmlStr = "";
    var className = "";
    if (this.marketViewVolChk != undefined && this.marketViewVolChk) {
	    if(legDetails != undefined && $("#volumeDay"+legDetails.legId).length > 0){
	    	className = this.getWeightClassName(legDetails);
	        htmlStr += "<span class='weight-value  " + className + "'>" + $("#volumeDay"+legDetails.legId).val() + "</span><span class='weight-label text-grey'>Day:</span>";
	    }
    }   
    return htmlStr;
};

/**
 * 
 * @param legDetails
 * @returns {String}
 */
MarketViewPopUp.prototype.getWeightHtmlStr = function(legDetails, ttlWeight, weightPercentage) {
    var marketViewComponent = this;
    var htmlStr = "";
    var className = marketViewComponent.getWeightClassName(weightPercentage);

    if (this.marketViewWPercentChk != undefined && this.marketViewWPercentChk) {
        if (legDetails.weightPercentage != undefined) {
            htmlStr += "<span class='weight-value  " + className + "'>" + weightPercentage + "%</span><span class='weight-label text-grey'>w%:</span>";
        }
    }

    if (this.marketViewWChk != undefined && this.marketViewWChk) {
        if (legDetails.weight != undefined) {
            htmlStr += "<span class='weight-value " + className + "'>" + ttlWeight + "</span><span class='weight-label text-grey'>w:</span>";
        }
    }

    return htmlStr;
};

/**
 * 
 * @param legDetails
 * @returns {String}
 */
MarketViewPopUp.prototype.getWeightClassName = function(weightPercentage) {
    var marketViewComponent = this;
    var className = "";

    if (parseInt(weightPercentage)<= marketViewComponent.loadIndicatorNormal)
    	{
    	className = "text-darkred";
    	}
    else if (parseInt(weightPercentage) > marketViewComponent.loadIndicatorNormal && parseInt(weightPercentage) <= marketViewComponent.loadIndicatorMin) {
        className = "text-green";
    } else if (parseInt(weightPercentage) > marketViewComponent.loadIndicatorMin && parseInt(weightPercentage) <= marketViewComponent.loadIndicatorMax) {
        className = "text-orange";
    } else {
        className = "text-red";
    }


    return className;
};


/**
 * 
 * @param legDetails
 * @returns {String}
 */
MarketViewPopUp.prototype.getCubeHtmlStr = function(legDetails, ttlCube, cubePercentage) {
    var htmlStr = "<a role='button' href='#' class='k-window-action k-link weight-value'><span role='presentation' class='k-icon k-i-close'>CL</span></a>";
    var marketViewComponent = this;
    var className = marketViewComponent.getCubeClassName(cubePercentage);

    if (this.marketViewCuPercentChk != undefined && this.marketViewCuPercentChk) {
        if (legDetails.cubePercentage  != undefined) {
            htmlStr += "<span class='weight-value " + className + "''>" + cubePercentage + "%</span><span class='weight-label text-grey'> c%:</span>";
        }
    }

    if (this.marketViewCuChk != undefined && this.marketViewCuChk) {
        if (legDetails.cube != undefined) {
            htmlStr += "<span class='weight-value " + className + "''>" + ttlCube + "</span><span class='weight-label text-grey'>c:</span>";
        }
    }

    return htmlStr;
};

/**
 * 
 * @param legDetails
 * @returns {String}
 */
MarketViewPopUp.prototype.getCubeClassName = function(cubePercentage) {
    var marketViewComponent = this;
    var className = "";
    if (parseInt(cubePercentage)<= marketViewComponent.loadIndicatorNormal)
	{
	className = "text-darkred";
	}
    else if (parseInt(cubePercentage) > marketViewComponent.loadIndicatorNormal && parseInt(cubePercentage) <= marketViewComponent.loadIndicatorMin) {
    	className = "text-green";
    } else if (parseInt(cubePercentage) > marketViewComponent.loadIndicatorMin && parseInt(cubePercentage) <= marketViewComponent.loadIndicatorMax) {
    	className = "text-orange";
    } else {
    	className = "text-red";
    }

    return className;
};


/**
 * 
 * @param legDetails
 * @returns {String}
 */
MarketViewPopUp.prototype.getRouteHtmlStr = function(legDetails) {
    var htmlStr = "";
    if (this.routesLabelChk) {
        if (legDetails.routeNbr) {
            htmlStr += "" + legDetails.routeNbr + "";
        }
    }
    return htmlStr;
};

/**
 * converts the integer to string by deviding with 1000 and appending K.
 */
MarketViewPopUp.prototype.applyStringFormatter = function(value) {
    var htmlStr = "";
    if (value) {
        if (value > 1000) {
            htmlStr = Math.ceil(parseInt(value) / 1000) + "K";
        }
    }
    return htmlStr;
};



MarketViewPopUp.prototype.showTooltip = function(marketviewComponent) {
    $("td", "#" + marketviewComponent.gridId).on("mouseover", function(ev) {
        if ($(ev.currentTarget).find("span") && $(ev.currentTarget).find("span").length > 0) {
            ev.currentTarget.title = $(ev.currentTarget).find("span").html();
        } else if ($(ev.currentTarget).find("img") && $(ev.currentTarget).find("img").length > 0) {
            ev.currentTarget.title = "Cal";
        } else {
            ev.currentTarget.title = $(ev.currentTarget).html();
        }
    });
};


function getMarketViewIBOBMatrixSchema() {
    var gridFields = {
        origLocCd: {
            type: "string"
        },
        destLocCd: {
            type: "string"
        },
        totalWeight: {
            type: "number"
        },
        totalCube: {
            type: "number"
        },totalPieces: {
            type: "number"
        },
        excessWeight: {
            type: "number"
        },
        excessCube: {
            type: "number"
        }
    };

    return addProductGroupsSchema(gridFields, false);
}

function getMarketViewIBOBMatrixColumns() {
    var matrixCols = [{
        field: "origLocCd",
        title: "Orig",
        width: 75,
        attributes: {
            style: "text-align:center;"            	
        },
        headerAttributes: {
            title: HEADER_ORIG_TOOLTIP
        }
    }, {
        field: "destLocCd",
        title: "Dest",
        width: 75,
        attributes: {
            style: "text-align:center;"
        },
        headerAttributes: {
            title: HEADER_DES_TOOLTIP
        }
    }, {
        field: "effDaysL",
        title: "Eff Days",
        width: 75,
        attributes: {
            style: "text-align:center;"
        },
        headerAttributes: {
            title: HEADER_EFF_DAYS_L_TOOLTIP
        }
    }];

    matrixCols = matrixCols.concat([{
        field: "totalPieces",
        title: HEADER_PCS_TOTAL,
        attributes: {
            style: "text-align:right;"
        },
        format: "{0:n0}",
        width: 50
    }, {
        field: "totalWeight",
        title: HEADER_WGT_TOTAL,
        attributes: {
            style: "text-align:right;"
        },
        format: "{0:n0}",
        width: 50
    }, {
        field: "totalCube",
        title: HEADER_CB_TOTAL,
        attributes: {
            style: "text-align:right;"
        },
        format: "{0:n0}",
        width: 50
    }, {
        field: "excessWeight",
        title: HEADER_WGT_EXCESS,
        attributes: {
            style: "text-align:right;"
        },
        format: "{0:n0}",
        width: 65
    }, {
        field: "excessCube",
        title: HEADER_CB_EXCESS,
        attributes: {
            style: "text-align:right;"
        },
        format: "{0:n0}",
        width: 65
    }]);
    
    matrixCols = addProductGroupsColumns(matrixCols, false);

    return matrixCols;
}