/**
 * 
 */
var Slider = function() {

    };
 /**
 * method to initialize Horizontal panel
 * @param divClass
 * @param horizontalDivId
 */
Slider.isVerticalSliderOpen = false;
Slider.isHorizontalSliderOpen = false;
Slider.initializeHorizontalPanel = function(divClass, horizontalDivId) {
    if (!this.isHPanelInitialize) {
        $('.' + divClass).click(function() {
            if ($(this).hasClass('show')) {
                Slider.hideHorizontalPanel(divClass, horizontalDivId);
            } else {
                Slider.showHorizontalPanel(divClass, horizontalDivId);
            }
        });
        Slider.hideHorizontalPanel(divClass, horizontalDivId);
    }
    this.isHPanelInitialize = true;
};

/**
 * method to show horizontal panel
 * @param divClass
 * @param horizontalDivId
*/ 
Slider.showHorizontalPanel = function(divClass, horizontalDivId) {
    $("." + divClass).animate({
				left: "-=224"
				}, 30, function() {
        // Animation complete.
    });
    $("." + horizontalDivId).animate({
        left: "-=280"
				}, 50, function() {
        // Animation complete.
    });
    $("." + divClass).html('').removeClass('hide').addClass('show');
};

/**
 * method to hide Horizontal panel
 * @param divClass
 * @param horizontalDivId
*/ 
Slider.hideHorizontalPanel = function(divClass, horizontalDivId) {
    $("." + divClass).animate({
				left: "+=224"
				}, 60, function() {
        // Animation complete.
    });
    $("." + horizontalDivId).animate({
        left: "+=280"
				}, 50, function() {
        // Animation complete.
    });
    $("." + divClass).html('').removeClass('show').addClass('hide');
};

/**
 * method is used for initializing Vertical panel
 * @param divClass
 * @param verticalDivId
*/ 
Slider.initializeVerticalPanel = function(divClass, verticalDivId) {
    if (!this.isVPanelInitialize) {
    	showHideMapToolBar(Slider.isVerticalSliderOpen);
        $('.' + divClass).click(function() {
            if ($(this).hasClass('show')) {
                Slider.showVerticalPanel(divClass, Slider.getVerticalDivId());
            } else {
                Slider.hideVerticalPanel(divClass, Slider.getVerticalDivId());
            }
        });
    }
    this.isVPanelInitialize = true;
};

/**
 * method to return the panel id
*/ 
Slider.getVerticalDivId = function() {
    if ($("#scheduleVPanel").is(":visible")) {
        return "scheduleVPanel";
    } else {
        return "networkVPanel";
    }
};


/**
 * method to hide Vertical panel
 * @param divClass
 * @param verticalDivId
*/ 
Slider.hideVerticalPanel = function(divClass, verticalDivId) {
    var height = Slider.getSliderHeight();
    if (Slider.isVerticalSliderOpen) {
        $("#" + verticalDivId).animate({
            top: "-=" + (height) + ""
        }, 60, function() {
            // Animation complete.
        });
        $("." + divClass).animate({
            top: 36
        }, 60, function() {
            // Animation complete.
        });
        $("." + divClass).html('Search').removeClass('hide hideSlider').addClass('show showSlider');
        Slider.isVerticalSliderOpen = false;
        showHideMapToolBar(!Slider.isVerticalSliderOpen);
    }
    delete height;
};

/**
 * method to show vertical panel
 * @param divClass
 * @param verticalDivId
*/ 
Slider.showVerticalPanel = function(divClass, verticalDivId) {
    var height = Slider.getSliderHeight();
    if (!Slider.isVerticalSliderOpen) {
        $("#" + verticalDivId).animate({
            top: "+=" + (height) + ""
        }, 60, function() {
            // Animation complete.
        });
        $("." + divClass).animate({
            top: (height + 30)
        }, 60, function() {
            // Animation complete.
        });
        $("." + divClass).html('Search').removeClass('show showSlider').addClass('hide hideSlider');
        Slider.isVerticalSliderOpen = true;
        showHideMapToolBar(!Slider.isVerticalSliderOpen);
    }
    delete height;
};


/**
 * method to initialize the facility panel
 * @param divClass
 * @param horizontalDivId
*/ 
Slider.isFacilitySliderOpen = false;
Slider.isFacilityInitialize = false;
Slider.initializeFacilityPanel = function(divClass, horizontalDivId) {
    if (!this.isFacilityInitialize) {
        $('.' + divClass).click(function() {
            if ($(this).hasClass('show')) {
                Slider.hideFacilityPanel(divClass, horizontalDivId);
            } else {
                Slider.showFacilityPanel(divClass, horizontalDivId);
            }
        });
        Slider.hideFacilityPanel(divClass, horizontalDivId);
        setTimeout(function() {
            var screenWidth = parent.outerWidth;
            Slider.resizeFacilityHandler();
        }, 2000);
    }
    this.isFacilityInitialize = true;
};

/**
 * method to show facility panel
 * @param divClass
 * @param horizontalDivId
*/ 
Slider.showFacilityPanel = function(divClass, horizontalDivId) {
    var width = 460;
    $("." + divClass).animate({
        left: "-=" + (width) + ""
    }, 70, function() {
        // Animation complete.
    });
    $("." + horizontalDivId).animate({
        left: "-=" + (width) + ""
    }, 70, function() {
        // Animation complete.
    });
    $("." + divClass).html('').removeClass('hide').addClass('show');
};

/**
 * method to hide facility panel
 * @param divClass
 * @param horizontalDivId
*/ 
Slider.hideFacilityPanel = function(divClass, horizontalDivId) {
    var width = 460;
    $("." + divClass).animate({
        left: "+=" + (width) + ""
    }, 70, function() {
        // Animation complete.
    });
    $("." + horizontalDivId).animate({
        left: "+=" + (width) + ""
    }, 70, function() {
        // Animation complete.
    });
    $("." + divClass).html('').removeClass('show').addClass('hide');
};

Slider.resizeFacilityHandler = function() {
	var screenWidth = parent.outerWidth;
    $(".faciSlider-arrow")[0].style.left = (screenWidth) + "px";
    $(".fPanel")[0].style.left = (screenWidth) + "px";
};

/**
 * method to adjust the search button height for vartical panel
 * @param divClass
 * @param height
*/ 
Slider.moveSearchButton = function(divClass, height) {
    if (height == undefined) {
        height = Slider.getSliderHeight();
    }
    if (Slider.isVerticalSliderOpen) {
        $("." + divClass).animate({
            top: (height + 30)
        }, 10, function() {
            // Animation complete.
        });
    }
    delete height;
};

Slider.getSliderHeight = function() {
    if ($("#scheduleVPanel").is(":visible")) {
        return $("#scheduleVPanel").height();
    } else {
        return $("#networkVPanel").height();
    }
};

Slider.isPanelVisible = function(panelId) {
    return $("#" + panelId).is(":visible") && $("#" + panelId).css("top").indexOf("-") === -1;
};

Slider.changeVerticalAnchorPosition = function() {

};

/**
 * method to Map Change event
 * @param hPanelId
 * @param vPanelID
 * @param isIntialize
 * @param target
*/ 
function onMapChange(hPanelId, vPanelID, isIntialize, target) {
    if (Slider.isPanelVisible(vPanelID)) {
        return;
    }
    if (vPanelID == 'networkVPanel') {
        Slider.hideVerticalPanel("vSlider-arrow", "scheduleVPanel");
    } else {
        Slider.hideVerticalPanel("vSlider-arrow", "networkVPanel");
    }

    $(".hPanel").hide();
    $("#" + hPanelId).show();
    $(".vPanel").hide();
    $("#" + vPanelID).show();
    if (!isIntialize) {
        $("#viewerTabs").find('li').removeClass("selected");
        $(target).parent().addClass("selected");
        if (hPanelId.indexOf("network") >= 0) {
            uicontroller.changeView(commonViewer.currentView, "Network");
        } else {
            uicontroller.changeView(commonViewer.currentView, "Schedule");
            SQW.initializeFavoriteComponents(); //to initialize Schedule FavoriteComponents
        }
        Slider.showVerticalPanel("vSlider-arrow", vPanelID);
        Slider.moveSearchButton('vSlider-arrow');
    }

}
/**
 * method to show/hide the mapToolbar
 * @param isShow
 */
var showHideMapToolBarHandler;

function showHideMapToolBar(isShow){
	if(showHideMapToolBarHandler == undefined ){
		showHideMapToolBarHandler = setInterval(function() { ///then after repeated interval checking....
			var flag = false;
			if(isShow){
				if(isNetworkQuery){
					 if(isScheduleForNetworkFlag != undefined && isScheduleForNetworkFlag){
						if(isDataLoaded(DATA_TYPE_NETWORK_SCHEDULE)){
							$("#mapToolbar").show();
							flag = true;
						} 
					 }else if(isDataLoaded(DATA_TYPE_NETWORK)){
						$("#mapToolbar").show();
						flag = true;
					 }
				}else{
					if(isDataLoaded(DATA_TYPE_SCHEDULE))
				    	$("#mapToolbar").show();
						flag = true;
				}
			}else{
				$("#mapToolbar").hide();
					flag = true;
			}
	        if (flag && showHideMapToolBarHandler) {
	            window.clearInterval(showHideMapToolBarHandler);
	            showHideMapToolBarHandler = undefined; 
	        }else{
	        	$("#mapToolbar").hide();
	        }
	    }, 1500);
	}	
}	

/**
* to apply the settings of the application favorite
* @param hPanelId
* @param vPanelID
* @param isIntialize
* @param target
*/
function onApplyApplicationFav(hPanelId, vPanelID, isIntialize, target) {
	 if (!isIntialize) {
	     $("#viewerTabs").find('li').removeClass("selected");
	     $(target).parent().addClass("selected");

//	     Slider.isVerticalSliderOpen = false;
	     if(Slider.isVerticalSliderOpen){
	    	 if ($("#scheduleVPanel")[0].style.display != "none") {
	    		 Slider.hideVerticalPanel("vSlider-arrow", "scheduleVPanel");
	    	 } else {
	    		 Slider.hideVerticalPanel("vSlider-arrow", "networkVPanel");
	    	 }
	     }
	     $(".vPanel").hide();
		 $("#" + vPanelID).show();
	     if (parent.isNetworkQuery) {
	     	if(isScheduleForNetworkFlag){
	     		uicontroller.changeView(commonViewer.currentView, "NetworkSchedule");
	     	}else{
	     		uicontroller.changeView(commonViewer.currentView, "Network");
	     	}	
	     } else {
	         uicontroller.changeView(commonViewer.currentView, "Schedule");
	         SQW.initializeFavoriteComponents(); //to initialize Schedule FavoriteComponents
	     }
	     Slider.showVerticalPanel("vSlider-arrow", vPanelID);
	     Slider.moveSearchButton('vSlider-arrow');
	 }
}
function marketviewSelectHandler(target) {
    //closeAllMarketViewPopups();
    //enableMarketView(this,!(($(event.currentTarget).attr('isEnabled') == 'true' ) ? true : false));
    VIEWER.enableMarketView(target, DASHBOARD_ID_MAP_VIEW, null, true);
}

/**
 * method to enable disable filter on data load
 * @param isDataLoaded
 */ 
function enableDisableFilter(isDataLoaded) {
    if (isNetworkQuery) {
        if (isDataLoaded){
        	$("#divNtwFilterOption").children().find("input").removeAttr("disabled");
        	$("#divNtwFilterOption").find('label').each(function() {
            	$(this).removeClass("label_style_disable");
                $(this).addClass("label_style");
            });
        }
        else {
        	$("#divNtwFilterOption").children().find("input").prop("disabled", "disabled");
        	$("#divNtwFilterOption").find('label').each(function() {
            	$(this).removeClass("label_style");
                $(this).addClass("label_style_disable");
            });
        }

        if (isScheduleForNetworkFlag) {
            $("#scheduleFilterContainerDiv  *").removeAttr("disabled");
            $("#scheduleFilterContainerDiv").find('a').each(function() {
                $(this).removeClass("ui-state-disabled");
            });
            $("#scheduleFilterContainerDiv").find('label').each(function() {
            	$(this).removeClass("label_style_disable");
                $(this).addClass("label_style");
            });
            
            if(!("#weightChk")[0].checked){
            	$("#hrefSchdUtiWeight").addClass("ui-state-disabled");
            	$("#hrefSchdUtiWeight").attr("disabled", "disabled");
            }
            if(!("#cubeChk")[0].checked){
            	$("#hrefSchdUtiCube").addClass("ui-state-disabled");
            	$("#hrefSchdUtiCube").attr("disabled", "disabled");
            }
			if(!("#netlegtypeFlyChk")[0].checked){
				$("#flylegtypeFilterTextDiv").parent().find('a').each(function() {
                    $(this).addClass("ui-state-disabled");
                });
                $("#flylegtypeFilterTextDiv").parent().find('label').each(function() {
                	$(this).removeClass("label_style");
                    $(this).addClass("label_style_disable");
                });
			}
			if(!("#netlegtypeTruckChk")[0].checked){
				$("#trucklegtypeFilterTextDiv").parent().find('a').each(function() {
                    $(this).addClass("ui-state-disabled");
                });
                $("#trucklegtypeFilterTextDiv").parent().find('label').each(function() {
                	$(this).removeClass("label_style");
                    $(this).addClass("label_style_disable");
                });
			}
			if(!("#netequiptypeFlyChk")[0].checked){
				$("#flyEqptypeFilterTextDiv").parent().find('a').each(function() {
                    $(this).addClass("ui-state-disabled");
                });
                $("#flyEqptypeFilterTextDiv").parent().find('label').each(function() {
                	$(this).removeClass("label_style");
                    $(this).addClass("label_style_disable");
                });
			}
			if(!("#netequiptypeTruckChk")[0].checked){
				$("#truckEqptypeFilterTextDiv").parent().find('a').each(function() {
                    $(this).addClass("ui-state-disabled");
                });
                $("#truckEqptypeFilterTextDiv").parent().find('label').each(function() {
                	$(this).removeClass("label_style");
                    $(this).addClass("label_style_disable");
                });
			}
			
            $("#scheduleFlightCombo").attr("disabled", "disabled");
            $("#scheduleFilterModeTruckCombo").attr("disabled", "disabled");
        }
    } else {
        if (isDataLoaded) {
            $("#scheduleFilterContainerDiv  *").removeAttr("disabled");
            $("#scheduleFilterContainerDiv").find('a').each(function() {
                $(this).removeClass("ui-state-disabled");
            });
            $("#scheduleFilterContainerDiv").find('label').each(function() {
            	$(this).removeClass("label_style_disable");
                $(this).addClass("label_style");
            });
            if(!("#weightChk")[0].checked){
            	$("#hrefSchdUtiWeight").addClass("ui-state-disabled");
            	$("#hrefSchdUtiWeight").attr("disabled", "disabled");
            }
            if(!("#cubeChk")[0].checked){
            	$("#hrefSchdUtiCube").addClass("ui-state-disabled");
            	$("#hrefSchdUtiCube").attr("disabled", "disabled");
            }
			if(!("#schdllegtypeFlyChk")[0].checked){
				$("#scheduleflylegtypeFilterTextDiv").parent().find('a').each(function() {
                    $(this).addClass("ui-state-disabled");
                });
                $("#scheduleflylegtypeFilterTextDiv").parent().find('label').each(function() {
                	$(this).removeClass("label_style");
                    $(this).addClass("label_style_disable");
                });
			}
			if(!("#schdllegtypeTruckChk")[0].checked){
				$("#scheduletrucklegtypeFilterTextDiv").parent().find('a').each(function() {
                    $(this).addClass("ui-state-disabled");
                });
                $("#scheduletrucklegtypeFilterTextDiv").parent().find('label').each(function() {
                	$(this).removeClass("label_style");
                    $(this).addClass("label_style_disable");
                });
			}
			if(!("#schdlequiptypeFlyChk")[0].checked){
				$("#scheduleflyEqptypeFilterTextDiv1").parent().find('a').each(function() {
                    $(this).addClass("ui-state-disabled");
                });
                $("#scheduleflyEqptypeFilterTextDiv1").parent().find('label').each(function() {
                	$(this).removeClass("label_style");
                    $(this).addClass("label_style_disable");
                });
			}
			if(!("#schdlequiptypeTruckChk")[0].checked){
				$("#scheduletruckEqptypeFilterTextDiv1").parent().find('a').each(function() {
                    $(this).addClass("ui-state-disabled");
                });
                $("#scheduletruckEqptypeFilterTextDiv1").parent().find('label').each(function() {
                	$(this).removeClass("label_style");
                    $(this).addClass("label_style_disable");
                });
			}
            $("#scheduleFlightCombo").attr("disabled", "disabled");
            $("#scheduleFilterModeTruckCombo").attr("disabled", "disabled");
        } else {
            $("#scheduleFilterContainerDiv *").attr("disabled", "disabled");
            $("#scheduleFilterContainerDiv").find('a').each(function() {
                $(this).addClass("ui-state-disabled");
            });
            $("#scheduleFilterContainerDiv").find('label').each(function() {
            	$(this).removeClass("label_style");
                $(this).addClass("label_style_disable");
            });
        }
    }
}
var SQWApplicationFavorite = function() {

    };
/**
 * method to clear favorite
 */
SQWApplicationFavorite.clearSQWFavorite = function() {
    commonViewer.currentView = "map";
    parent.isNetworkQuery = true;
    isScheduleForNetworkFlag = false;
	onApplyApplicationFav('networkHPanel', 'networkVPanel', false, $('#networkLink'));
};

/**
 * retrieve the header button settings of the map viewer dashboard
 * @param isApplicationLevel
 */
SQWApplicationFavorite.getHeaderButtonSettings = function(isApplicationLevel) {
    var headerButtonSettings = {};
    //    console.log("getHeaderButtonSettings");
    return headerButtonSettings;
};

/**
 * retrieve the display option settings of map viewer settings...
 * @param isApplicationLevel
 * @returns {___anonymous8714_8715}
 */
SQWApplicationFavorite.getDisplayOptionSettings = function(isApplicationLevel) {
    var displaySettings = {};
    //    console.log("getDisplayOptionSettings");
    return displaySettings;
};

/**
 * retrieve the content settings of map viewer
 * @param isApplicationLevel
 * @returns {___anonymous9176_9177}
 */
SQWApplicationFavorite.getContentFavoriteSettings = function(isApplicationLevel) {
    var contentFav = {};
    contentFav["isNetworkQuery"] = parent.isNetworkQuery;
    contentFav["isScheduleForNetworkFlag"] = isScheduleForNetworkFlag;
    contentFav["currentView"] = commonViewer.currentView;
    //     console.log("getContentFavoriteSettings");
    return contentFav;
};

/**
 * apply the header button settings 
 * @param headerButtonSettings
 * @param isDefaultFavorite
 * @param isApplicationLevel
 * @param isRefreshDashboard
 */
SQWApplicationFavorite.applyHeaderButtonSettings = function(headerButtonSettings, isDefaultFavorite, isApplicationLevel, isRefreshDashboard) {
    if (headerButtonSettings != null) {
        //    	console.log("applyDisplayOptionSettings");
    }
};

/**
 * apply display option settings for map viewer dashboard
 * @param displayOptionSettings
 * @param isDefaultFavorite
 * @param isApplicationLevel
 * @param isRefreshDashboard
 */
SQWApplicationFavorite.applyDisplayOptionSettings = function(displayOptionSettings, isDefaultFavorite, isApplicationLevel, isRefreshDashboard) {
    if (displayOptionSettings) {
        //    	console.log("applyDisplayOptionSettings");
    }
};

/**
 * apply content settings to the map viewer settings...
 * @param contentSettings
 * @param isDefaultFavorite
 * @param isApplicationLevel
 * @param isRefreshDashboard
 */
SQWApplicationFavorite.applyContentFavoriteSettings = function(contentSettings, isDefaultFavorite, isApplicationLevel, isRefreshDashboard) {
    commonViewer.currentView = contentSettings.currentView;
    parent.isNetworkQuery = contentSettings.isNetworkQuery;
    isScheduleForNetworkFlag = contentSettings.isScheduleForNetworkFlag;
    if (!parent.isNetworkQuery) {
    	onApplyApplicationFav('scheduleHPanel', 'scheduleVPanel', false, $('#scheduleLink'));
    } else {
    	onApplyApplicationFav('networkHPanel', 'networkVPanel', false, $('#networkLink'));
    }
};
var SQWNetworkFavorite = function() {

    };

SQWNetworkFavorite.clearSQWFavorite = function() {
    SQW.clearNetworkFavoriteSettings();
}; /******* common methods - favorites - start *******/
/**
 * retrieve the header button settings of the map viewer dashboard
 * @param isApplicationLevel
 */
SQWNetworkFavorite.getHeaderButtonSettings = function(isApplicationLevel) {
    var headerButtonSettings = {};
    //    console.log("getHeaderButtonSettings");
    return headerButtonSettings;
};

/**
 * retrieve the display option settings of map viewer settings...
 * @param isApplicationLevel
 * @returns {___anonymous8714_8715}
 */
SQWNetworkFavorite.getDisplayOptionSettings = function(isApplicationLevel) {
    var displaySettings = {};
    //    console.log("getDisplayOptionSettings");
    return displaySettings;
};

/**
 * retrieve the content settings of map viewer
 * @param isApplicationLevel
 * @returns {___anonymous9176_9177}
 */
SQWNetworkFavorite.getContentFavoriteSettings = function(isApplicationLevel) {
    var contentFav = {};
    if (parent.isNetworkQuery) {
        contentFav = SQW.getNetworkFavoriteSettings();
    } else {
        contentFav = SQW.getScheduleFavoriteSettings();
    }
    //    console.log("getContentFavoriteSettings");
    return contentFav;
};

/**
 * apply the header button settings 
 * @param headerButtonSettings
 * @param isDefaultFavorite
 * @param isApplicationLevel
 * @param isRefreshDashboard
 */
SQWNetworkFavorite.applyHeaderButtonSettings = function(headerButtonSettings, isDefaultFavorite, isApplicationLevel, isRefreshDashboard) {
    if (headerButtonSettings != null) {
        //    	console.log("applyDisplayOptionSettings");
    }
};

/**
 * apply display option settings for map viewer dashboard
 * @param displayOptionSettings
 * @param isDefaultFavorite
 * @param isApplicationLevel
 * @param isRefreshDashboard
 */
SQWNetworkFavorite.applyDisplayOptionSettings = function(displayOptionSettings, isDefaultFavorite, isApplicationLevel, isRefreshDashboard) {
    if (displayOptionSettings) {
        //    	console.log("applyDisplayOptionSettings");
    }
};

/**
 * apply content settings to the map viewer settings...
 * @param contentSettings
 * @param isDefaultFavorite
 * @param isApplicationLevel
 * @param isRefreshDashboard
 */
SQWNetworkFavorite.applyContentFavoriteSettings = function(contentSettings, isDefaultFavorite, isApplicationLevel, isRefreshDashboard) {
    //	console.log("applyDisplayOptionSettings");
/*if(favoriteSettings[parent.DATA_TYPE_NETWORK] != undefined){
		SQW.applyNetworkFavoriteSettings(contentSettings[parent.DATA_TYPE_NETWORK], isApplicationLevel);
	}
	if (favoriteSettings[parent.DATA_TYPE_SCHEDULE] != undefined){
		SQW.applyScheduleFavoriteSettings(contentSettings[parent.DATA_TYPE_SCHEDULE], isApplicationLevel);
	}*/

    SQW.applyNetworkFavoriteSettings(contentSettings, isApplicationLevel);
    //this.applyFilterSettings(contentSettings, isApplicationLevel);
    parent.applyNetworkTabSettingsFavorite(contentSettings.networkDisplayFav, true);
    parent.applyGeneralTabSettingsFavorite(contentSettings.generalDisplayFav);
    if(parent.isNetworkQuery){
    	enableDisableFilter(isDataLoaded("Network"));
    }else{
    	enableDisableFilter(isDataLoaded("NetworkSchedule"));
    }
/*
	if(contentSettings.routingTypeCmb){
		enableDisableRoutingType(contentSettings.routingTypeCmb);
	}
	*/


};
var SQWScheduleFavorite = function() {

    };

SQWScheduleFavorite.clearSQWFavorite = function() {
    SQW.clearScheduleFavoriteSettings();
}; /******* common methods - favorites - start *******/
/**
 * retrieve the header button settings of the map viewer dashboard
 * @param isApplicationLevel
 */

SQWScheduleFavorite.getHeaderButtonSettings = function(isApplicationLevel) {
    var headerButtonSettings = {};
    //    console.log("getHeaderButtonSettings");
    return headerButtonSettings;
};

/**
 * retrieve the display option settings of map viewer settings...
 * @param isApplicationLevel
 * @returns {___anonymous8714_8715}
 */

SQWScheduleFavorite.getDisplayOptionSettings = function(isApplicationLevel) {
    var displaySettings = {};
    //    console.log("getDisplayOptionSettings");
    return displaySettings;
};

/**
 * retrieve the content settings of map viewer
 * @param isApplicationLevel
 * @returns {___anonymous9176_9177}
 */

SQWScheduleFavorite.getContentFavoriteSettings = function(isApplicationLevel) {
    var contentFav = {};
    if (parent.isNetworkQuery) {
        contentFav = SQW.getNetworkFavoriteSettings();
    } else {
        contentFav = SQW.getScheduleFavoriteSettings();
    }
    //    console.log("getContentFavoriteSettings");
    return contentFav;
};

/**
 * apply the header button settings 
 * @param headerButtonSettings
 * @param isDefaultFavorite
 * @param isApplicationLevel
 * @param isRefreshDashboard
 */

SQWScheduleFavorite.applyHeaderButtonSettings = function(headerButtonSettings, isDefaultFavorite, isApplicationLevel, isRefreshDashboard) {
    if (headerButtonSettings != null) {
        //    	console.log("applyDisplayOptionSettings");
    }
};

/**
 * apply display option settings for map viewer dashboard
 * @param displayOptionSettings
 * @param isDefaultFavorite
 * @param isApplicationLevel
 * @param isRefreshDashboard
 */

SQWScheduleFavorite.applyDisplayOptionSettings = function(displayOptionSettings, isDefaultFavorite, isApplicationLevel, isRefreshDashboard) {
    if (displayOptionSettings) {
        //    	console.log("applyDisplayOptionSettings");
    }
};

/**
 * apply content settings to the map viewer settings...
 * @param contentSettings
 * @param isDefaultFavorite
 * @param isApplicationLevel
 * @param isRefreshDashboard
 */

SQWScheduleFavorite.applyContentFavoriteSettings = function(contentSettings, isDefaultFavorite, isApplicationLevel, isRefreshDashboard) {
    //	console.log("Schedule : applyDisplayOptionSettings");
    SQW.applyScheduleFavoriteSettings(contentSettings, isApplicationLevel);
    parent.applyScheduleTabSettingsFavorite(contentSettings.scheduleDisplayFav, true);
    parent.applyGeneralTabSettingsFavorite(contentSettings.generalDisplayFav);
    enableDisableFilter(isDataLoaded("Schedule"));
/*if (!parent.isNetworkQuery) {
        $("#scheduleHPanel")[0].style.top = "50px";
    }*/
};
/**
 * method to return the favoriteComponent for the selected tab
 * @param dashboardId
 */

function getDashboardFavoriteComponent(dashboardId) {
    if (dashboardId == "SQW_Application") {
        return applicationFavoriteComponent;
    } else if (dashboardId == "SQW_Network") {
        return SQW.networkFavoriteComponent;
    } else {
        return SQW.scheduleFavoriteComponent;
    }
}

function getDashboardFavoriteObject(dashboardId) {
    if (dashboardId == "SQW_Application") {
        return SQWApplicationFavorite;
    } else if (dashboardId == "SQW_Network") {
        return SQWNetworkFavorite;
    } else {
        return SQWScheduleFavorite;
    }

}

/******* common methods - favorites - end *******/
var commonViewer = (function() {
    var PROGRESS_DIALOG_MESSAGE_INITIALIZE_MASTER_DATA = "Initializing master data...";
    var PROGRESS_DIALOG_MESSAGE_RUN_QUERY = "Waiting for the query results...";
    var PROGRESS_DIALOG_MESSAGE_MAP_INITIALIZE = "Initializing map...";

    function constructorFn() {

    }
    constructorFn.currentView = 'map';
    constructorFn.initialize = function() {
        //initializing the horizontal slider
        Slider.initializeHorizontalPanel("hSlider-arrow", "hPanel");
        //initializing the vertical slider
        Slider.initializeVerticalPanel("vSlider-arrow", "networkVPanel");
        //initializing Facility Panel
        Slider.initializeFacilityPanel("faciSlider-arrow", "fPanel");
        multiSelectComponent();
        initializeDisplayOptions();
        onMapChange('networkHPanel', 'networkVPanel', true, $('networkLink'));
    };

    constructorFn.runQuery = function(isClone, dataType) {
        showFilterErrorMsg(EMPTY_STRING);
        uicontroller.changeView(this.currentView, dataType);
        if (isClone == undefined || !isClone) {
            VIEWER.onBeforeRunQuery();
        }
      //to enable the sync btn's on all windows
    	parent.VIEWER.enableSync(null, null,EMPTY_STRING+parent.DASHBOARD_ID_MAP_VIEW+COMMA_STRING+parent.DASHBOARD_ID_SCHEMATIC_VIEW+COMMA_STRING+parent.DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX+COMMA_STRING+parent.DASHBOARD_ID_NETWORK_MATRIX+COMMA_STRING+parent.DASHBOARD_ID_SCHEDULE_MATRIX+COMMA_STRING+parent.DASHBOARD_ID_ALLOCATION_MATRIX+COMMA_STRING+parent.DASHBOARD_ID_VOLUME_UTILIZATION_TREE_GRID_MATRIX+COMMA_STRING+parent.DASHBOARD_ID_NETWORK_SUMMARY_MATRIX+EMPTY_STRING, null,true,true);
    	
        Slider.hideVerticalPanel("vSlider-arrow", Slider.getVerticalDivId());
        if (parent.isNetworkQuery) {
        	if (SQW.validateNetworkQueryInput()) {
        		this.callNetworkOrScheduleService(SQW.createNetworkQueryMap(), "NetworkRequest", this.onNetworkQuerySuccess);
        	}
        } else {
            this.callNetworkOrScheduleService(SQW.createScheduleQueryMap(), "ScheduleRequest", this.onScheduleQuerySuccess);
        }
    };

    constructorFn.runNetworkScheduleQuery = function(isClone, dataType) {
        showFilterErrorMsg(EMPTY_STRING);
        uicontroller.changeView(this.currentView, "Network");
        if (isClone == undefined || !isClone) {
            VIEWER.onBeforeRunQuery();
        }
        Slider.hideVerticalPanel("vSlider-arrow", Slider.getVerticalDivId());
        if (parent.isNetworkQuery) {
            this.callNetworkOrScheduleService(SQW.createNetworkQueryMap(), "NetworkRequest", this.onNetworkScheduleQuerySuccess);
        }
    };

    constructorFn.onNetworkScheduleQuerySuccess = function(response, io) {
        var commonViewerComponent = this;
        
        parent.resetAllDashboardsNetworkDataStatus(false);
        if (response && response._errorCd && response._errorCd > 0) {
            parent.showFilterErrorMsg(response._errorDesc);
        } else {
            commonViewer.loadScheduleForNetwork(true);
            showHideMapToolBar(!Slider.isVerticalSliderOpen);
            enableDisableFilter(true);
            //todo : show direction div
        }
        showProgressDialog(false);
    };

    constructorFn.callNetworkOrScheduleService = function(paramsMap, networkType, callback) {
        var commonViewerComponent = this;
        if (paramsMap) {
            //showProgressDialog(true, PROGRESS_DIALOG_MESSAGE_RUN_QUERY);

            callService({
                url: SERVICE_DATA_URL + networkType,
                paramsMap: paramsMap,
                successCallback: function(response, io) {
                    callback(response, io);
                },
                failureCallback: onServiceRequestFailure,
                showProgressWindow: true
            });
        }
    };

    constructorFn.onNetworkQuerySuccess = function(response, io) {
        var commonViewerComponent = this;
        
        parent.resetAllDashboardsNetworkDataStatus(false);
        if (response && response._errorCd && response._errorCd > 0) {
            parent.showFilterErrorMsg(response._errorDesc);
        } else {
            commonViewer.loadScheduleForNetwork(false);
            VIEWER.onNetworkQuerySuccess();
            //not required to open any dashboard
            //SQW.openDashboard(DASHBOARD_ID_NETWORK_SUMMARY_MATRIX);
            showHideMapToolBar(!Slider.isVerticalSliderOpen);
            enableDisableFilter(true);
        }
        showProgressDialog(false);
    };

    constructorFn.onScheduleQuerySuccess = function(response, io) {
        parent.resetAllDashboardsScheduleDataStatus(false);
        if (response && response._errorCd && response._errorCd > 0) {
            parent.showFilterErrorMsg(response._errorDesc);
        } else {
            parent.VIEWER.onScheduleQuerySuccess();
            //SQW.openDashboard(DASHBOARD_ID_SCHEDULE_MATRIX);
            showHideMapToolBar(!Slider.isVerticalSliderOpen);
            enableDisableFilter(true);
            //todo : hide direction div
        }
         showProgressDialog(false);
    };

    /**
     * method to call webservice for ScheduleLegById  
     * @param isImplicitLoading
     */

    constructorFn.loadScheduleForNetwork = function(isImplicitLoading) {
        var commonViewerComponent = this;
        var serviceUrl = SERVICE_DATA_URL + "ScheduleLegByIdRequest";
        $("#networkSchduleMapViewSubLink").hide();
        $("#networkSchduleSchematicViewSubLink").hide();
        $("#networkSchduleMapViewSubLinkTpl").show();
        $("#networkSchduleSchematicViewSubLinkTpl").show();
        var paramsMap = {
            "browserSessionId": parent.getBrowserSessionId(),
            "commonCaseId": parent.getCommonCaseId(),
            "scheduleId": parent.getScheduleId(),
            "planWeek": parent.getSelectedPlanWeek(),
            "effDayPatternStr": parent.getSelectedEffDayStrPattern(),
            "localZuluFlag": getLocalZuluFlag(),
            "isAddToResults": $("#addResultsToDisplay").is(":checked"),
            "dataType": parent.DATA_TYPE_NETWORK_SCHEDULE
        };

        callService({
            url: serviceUrl,
            paramsMap: paramsMap,
            successCallback: function(response, io) {
                commonViewerComponent.onLoadScheduleForNetworkSuccess(response, io, isImplicitLoading);
                $("#networkSchduleMapViewSubLink").show();
                $("#networkSchduleSchematicViewSubLink").show();
                $("#networkSchduleMapViewSubLinkTpl").hide();
                $("#networkSchduleSchematicViewSubLinkTpl").hide();
            },
            showProgressWindow: isImplicitLoading? true: false
        });
    };

    /**
     * success responce handler for ScheduleLegById request. 
     * @param response
     * @param io
     * @param isImplicitLoading
     */

    constructorFn.onLoadScheduleForNetworkSuccess = function(response, io, isImplicitLoading) {
    	if(isImplicitLoading){
    		showProgressDialog(false);
    	}
        if (response && response._errorCd && response._errorCd > 0) {
            parent.showFilterErrorMsg(response._errorDesc);
        } else {
            VIEWER.onNetworkScheduleQuerySuccess(isImplicitLoading);
        }
    };
    
    constructorFn.toggleNetworkScheduleView = function(response, io, isImplicitLoading) {
        if (response && response._errorCd && response._errorCd > 0) {
            parent.showFilterErrorMsg(response._errorDesc);
        } else {            
            if (isImplicitLoading) {
                uicontroller.showSchematicView(commonViewer.currentView, 'NetworkSchedule');
                enableDisableFilter(true);
               // parent.showProgressDialog(false);
            }
        }
    };

    constructorFn.setQueryCacheController = function() {
        showProgressDialog(true, PROGRESS_DIALOG_MESSAGE_INITIALIZE_MASTER_DATA);
        QueryCacheManager.getInstance().initialize(this.dataInitializeCallbackHandler);
    };

    /*
     * method called when cache is loaded 
     */
    constructorFn.dataInitializeCallbackHandler = function(z) {
        //close the loading window
        SQW.clearAllData();
        commonViewer.refreshDatasource(z);
        enableDisableFilter(false);
        if (applicationFavoriteComponent != undefined) {
            applicationFavoriteComponent.applyDefaultFavorite();
        }
        SQW.applyDefaultFavorite(true);
        showProgressDialog(false);
    };

    /*
     * method to refresh datasource
     */
    constructorFn.refreshDatasource = function(z) {
    	showProgressDialog(true, "Refreshing datasources");
        SQW.refreshDatasources();
        showProgressDialog(false, "Refreshing datasources");
    };

    /*
     * method called when plan is changed
     */
    constructorFn.onPlanChange = function() {
        VIEWER.onPlanChange();
    };
    
    constructorFn.pointerClickHandler = function() {
        if(lasso != undefined){
        	lasso.rightClickListener(event);
        	lasso.resetLassoListener();
        }
    };



    return constructorFn;
})();


/* ////////////////////////////////////////////////////////
	UI Controller
	Methods to update UI settings
////////////////////////////////////////////////////////*/
var uicontroller = (function() {

    function constructorFn() {

    }
    /**
     * method to show Schematic view
     * @param viewType
     * @param dataType
     * @param isRefresh
     * @param isSyncOn
     */
    constructorFn.showSchematicView = function(viewType, dataType, isRefresh, isSyncOn) {
        this.changeView(viewType, dataType, isSyncOn);
        showHideMapToolBar(!Slider.isVerticalSliderOpen);
        if(isRefresh == undefined ){
        	isRefresh = true;
        }
        if(isRefresh ){
        	refresh();
        }        
    };
    
    /**
     * It get called when view changed to map or schematic.
     * @param viewType
     * @param dataType
     * @param isSyncActive
     */
    constructorFn.changeView = function(viewType, dataType, isSyncActive) {
        commonViewer.currentView = viewType;
        currentViewerConstant = intImage;
        switch (viewType) {
        case "schematic":
        	if(dashboardController != undefined){
            	dashboardController.setDashboardActive(DASHBOARD_ID_SCHEMATIC_VIEW, true);
            	dashboardController.setDashboardActive(DASHBOARD_ID_MAP_VIEW, false);
            }
            viewerDashboardId = DASHBOARD_ID_SCHEMATIC_VIEW;
            $("#schematicView").show();
            $("#map").hide();
            $("#headerMapOptionsDiv").hide();
            $("#schematicSandboxMenu").show();
            this.setViewerOptions(viewType, dataType, isSyncActive);
            parent.setDashboardInitialized(parent.DASHBOARD_ID_SCHEMATIC_VIEW);
            if($("#generaltabli").is(':visible')){
	            $("#generaltabli").hide();		//hiding general tab
            }
            setTimeout(function() {
            	  var displaytabStrip = $("#displayOptionsTabstrip").data('kendoTabStrip');
                  displaytabStrip.select(displaytabStrip.tabGroup.children("li").eq(3));
            }, 1000);
          
            break;
        case "map":
        	if(dashboardController != undefined){
            	dashboardController.setDashboardActive(DASHBOARD_ID_SCHEMATIC_VIEW, false);
            	dashboardController.setDashboardActive(DASHBOARD_ID_MAP_VIEW, true);
            }
            viewerDashboardId = DASHBOARD_ID_MAP_VIEW;
            $("#schematicView").hide();
            $("#map").show();
            $("#headerMapOptionsDiv").show();
            $("#schematicSandboxMenu").hide();
            if(!$("#generaltabli").is(':visible')){
            	$("#generaltabli").show();		//showing general tab
            }
            this.setViewerOptions(viewType, dataType, isSyncActive);
            showLayers();
            break;
        }
    };
    
    /** 
     * method to update UI on Network tab
     * @param hPanelId
     * @param vPanelID
     */
    constructorFn.showNetworkTab = function(hPanelId, vPanelID){
    	if (Slider.isPanelVisible(vPanelID)) {
            return;
        }
        if (vPanelID == 'networkVPanel') {
            Slider.hideVerticalPanel("vSlider-arrow", "scheduleVPanel");
        } else {
            Slider.hideVerticalPanel("vSlider-arrow", "networkVPanel");
        }

        $(".hPanel").hide();
        $("#" + hPanelId).show();
        $(".vPanel").hide();
        $("#" + vPanelID).show();   
        
        setTimeout(function(){
        	Slider.showVerticalPanel("vSlider-arrow", vPanelID);
            Slider.moveSearchButton('vSlider-arrow');
            $("#viewerTabs").find('li').removeClass("selected");
            $("#networkLink").parent().addClass("selected");
            
        }, 50);
    };
    
    /** 
     * method to update UI on Schedule tab
     * @param hPanelId
     * @param vPanelID
     */
    constructorFn.showScheduleTab = function(hPanelId, vPanelID){
    	if (Slider.isPanelVisible(vPanelID)) {
            return;
        }
        if (vPanelID == 'networkVPanel') {
            Slider.hideVerticalPanel("vSlider-arrow", "scheduleVPanel");
        } else {
            Slider.hideVerticalPanel("vSlider-arrow", "networkVPanel");
        }

        $(".hPanel").hide();
        $("#" + hPanelId).show();
        $(".vPanel").hide();
        $("#" + vPanelID).show(); 
        
        setTimeout(function(){
        	Slider.showVerticalPanel("vSlider-arrow", vPanelID);
            Slider.moveSearchButton('vSlider-arrow');
            $("#viewerTabs").find('li').removeClass("selected");
            $("#scheduleLink").parent().addClass("selected");
        }, 50);
    };
    
    /** 
     * method to update UI on Schedule tab selection
     */
    constructorFn.updateScheduleUI = function() {
        VIEWER.onBeforeTabSelect("Schedule");
        VIEWER.onTabSelect("Schedule");
        $("#networkHeaderMenus").hide();
        $("#scheduleHeaderMenus").show();
        $("#networkHPanel").hide();
        $("#parentNetworkDiv").hide();
        $("#divNtwFilterOption").hide();
        $("#scheduleHPanel")[0].style.top = "65px";
        $("#scheduleHPanel").show();
        $("#parentScheduleDiv").show();
        $("#divSchduleFilter").parent().show();
        $("#divSchduleFilter").show();
        $("#schudleDirectionDiv").hide();
        if(isDataLoaded("Schedule")){
	    	$("#divSchduleFilter  *").removeAttr("disabled");
	    	$("#scheduleFilterContainerDiv").find('a').each(function() {
	            $(this).removeClass("ui-state-disabled");
	        });
	        $("#scheduleFilterContainerDiv").find('label').each(function() {
	        	$(this).removeClass("label_style_disable");
	            $(this).addClass("label_style");
	        });
	        $("#scheduleFlightCombo").attr("disabled", "disabled");
         	$("#scheduleFilterModeTruckCombo").attr("disabled", "disabled");
        }
        else{
        	$("#divSchduleFilter *").attr("disabled", "disabled");
        	$("#scheduleFilterContainerDiv *").attr("disabled", "disabled");
            $("#scheduleFilterContainerDiv").find('a').each(function() {
                $(this).addClass("ui-state-disabled");
            });
            $("#scheduleFilterContainerDiv").find('label').each(function() {
            	$(this).removeClass("label_style");
                $(this).addClass("label_style_disable");
            });
        }
    };

    /** 
     * method to update UI on Schedule Overlay selection
     */
    constructorFn.updateNetworkScheduleUI = function() {
        VIEWER.onBeforeTabSelect("Network");
        VIEWER.onTabSelect("Network");
        $("#networkHPanel").show();
        $("#scheduleHPanel").show();
        $("#parentNetworkDiv").hide();
        $("#divSchduleFilter").parent().show();
        $("#divSchduleFilter").show();
        $("#schudleDirectionDiv").show();
        $("#networkMatrixMenu").hide();
        $("#networkScheduleMatrixMenu").show();
        $("#parentScheduleDiv").hide();
        $("#divNtwFilterOption").hide();
        showHideNetworkRoutingDiv();
        $("#networkHeaderMenus").show();
        $("#scheduleHeaderMenus").hide();
        $("#networkScheduleSandboxMenu").show();
        $("#networkLink").html("Schedule Overlay");
		if(isDataLoaded("NetworkSchedule") || isDataLoaded("Network")){	//disable it for network and schedule
			commonViewerUtils.toggleDirection($('input[name=schdFilterDirectionOption]:radio:checked'));
			$("#divSchduleFilter  *").removeAttr("disabled");
	    	$("#scheduleFilterContainerDiv").find('a').each(function() {
	            $(this).removeClass("ui-state-disabled");
	        });
	        $("#scheduleFilterContainerDiv").find('label').each(function() {
	        	$(this).removeClass("label_style_disable");
	            $(this).addClass("label_style");
	        });
	        $("#scheduleFlightCombo").attr("disabled", "disabled");
         	$("#scheduleFilterModeTruckCombo").attr("disabled", "disabled");
		}
	    else{
        	$("#divSchduleFilter *").attr("disabled", "disabled");
        	$("#scheduleFilterContainerDiv *").attr("disabled", "disabled");
            $("#scheduleFilterContainerDiv").find('a').each(function() {
                $(this).addClass("ui-state-disabled");
            });
            $("#scheduleFilterContainerDiv").find('label').each(function() {
            	$(this).removeClass("label_style");
                $(this).addClass("label_style_disable");
            });
	    }
    };

    /** 
     * method to update UI on Network tab selection
     */
    constructorFn.updateNetworkUI = function() {
        VIEWER.onBeforeTabSelect(DATA_TYPE_NETWORK);
        VIEWER.onTabSelect(parent.DATA_TYPE_NETWORK);
        $("#networkHPanel").show();
        $("#divNtwFilterOption").show();
        $("#networkHPanel").show();
        $("#parentNetworkDiv").show();
        $("#divNtwFilterOption").show();
        $("#scheduleHPanel").hide();

        $("#scheduleHPanel").hide();
        $("#divSchduleFilter").hide();
        $("#divSchduleFilter").parent().hide();

        $("#scheduleHPanel").css("top", "65px");
        $("#schematicNetworkLinesDiv").hide();
        $("#networkHeaderMenus").show();
        $("#scheduleHeaderMenus").hide();
        $("#networkMatrixMenu").show();
        $("#networkScheduleMatrixMenu").hide();
        $("#networkScheduleSandboxMenu").hide();
        $("#networkLink").html("Network");
        if(isDataLoaded("Network") || isDataLoaded("NetworkSchedule")){	//disable it for network and schedule
        	commonViewerUtils.toggleDirection($('input[name=ntwFilterDirectionOption]:radio:checked'));
        	$("#divNtwFilterOption").children().find("input").removeAttr("disabled");
        }
        else{
        	$("#divNtwFilterOption").children().find("input").prop("disabled", "disabled");        
        }
    };

    /**
     * method to update Schematic UI
     */
    constructorFn.updateSchematicScheduleUI = function() {
        $("#networkSchematicViewDiv").hide();
        $("#networkScheduleSchematicViewDiv").hide();
        $("#scheduleSchematicViewDiv").show();
    };

    constructorFn.updateSchematicNetworkScheduleUI = function() {
        $("#networkSchematicViewDiv").hide();
        $("#networkScheduleSchematicViewDiv").show();
        $("#scheduleSchematicViewDiv").hide();
        this.updateNetworkScheduleUI();
        $("#networkScheduleSandboxMenu").show();
        $("#networkLink").html("Schedule Overlay");
    };

    constructorFn.updateSchematicNetworkUI = function() {
        $("#networkSchematicViewDiv").show();
        $("#networkScheduleSchematicViewDiv").hide();
        $("#scheduleSchematicViewDiv").hide();
        this.updateNetworkUI();
        $("#schematicNetworkLinesDiv").show();
        $("#networkLink").html("Network");
    };

    /**
     * method to set viewer options for datatype
     * @param viewType
     * @param dataType
     * @param isSyncActive
     */
    constructorFn.setViewerOptions = function(viewType, dataType, isSyncActive) {
        switch (dataType) {
        case "Network":
        	intImage = 1;
            parent.isNetworkQuery = true;
            parent.isScheduleForNetworkFlag = false;
            if (viewType == "schematic") {
                this.updateSchematicNetworkUI();
            } else {
                this.updateNetworkUI();
            }
            break;
        case "NetworkSchedule":
        	intImage = 2;
            parent.isNetworkQuery = true;
            parent.isScheduleForNetworkFlag = true;
            if (viewType == "schematic") {
                this.updateSchematicNetworkScheduleUI();
            } else {
                this.updateNetworkScheduleUI();
            }
            break;
        case "Schedule":
            parent.isNetworkQuery = false;
            parent.isScheduleForNetworkFlag = false;
            parent.isScheduleQuery = true;
            if (viewType == "schematic") {
                this.updateSchematicScheduleUI();
            }
            this.updateScheduleUI();
            break;
        }
        VIEWER.setIsScheduleForNetworkFlag(parent.isScheduleForNetworkFlag);
        //to enable the sync btn's on all windows
        if(isSyncActive == undefined){
        	isSyncActive = false;
        }
        if(!isSyncActive){
        	parent.VIEWER.enableSync(null, null,EMPTY_STRING+parent.DASHBOARD_ID_MAP_VIEW+COMMA_STRING+parent.DASHBOARD_ID_SCHEMATIC_VIEW+COMMA_STRING+parent.DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX+COMMA_STRING+parent.DASHBOARD_ID_NETWORK_MATRIX+COMMA_STRING+parent.DASHBOARD_ID_SCHEDULE_MATRIX+COMMA_STRING+parent.DASHBOARD_ID_ALLOCATION_MATRIX+COMMA_STRING+parent.DASHBOARD_ID_VOLUME_UTILIZATION_TREE_GRID_MATRIX+COMMA_STRING+parent.DASHBOARD_ID_NETWORK_SUMMARY_MATRIX+EMPTY_STRING, null,true,true);
        }    	    	
    };

    return constructorFn;
})();