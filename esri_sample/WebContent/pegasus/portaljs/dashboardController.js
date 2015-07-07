function Dashboard(dashboardId, title, top, rightPosition, bottomPosition, left, width, height, imageClass, content, hasiframe, isRuntime, isNotKendoWindow, modal) {
	this.dashboardId = dashboardId;
	this.title = title;
	this.xPosition = top;
	this.yPosition = left;
	this.rightPosition = rightPosition;
	this.bottomPosition = bottomPosition;
	this.width = width;
	this.height = height;
	this.imageClass = imageClass;
	this.content = content;
	this.hasiframe = hasiframe;
	this.isRuntime = isRuntime;
	this.isInitialized = false;
	this.dataStatus = {};
	this.isNotKendoWindow=isNotKendoWindow;
	this.isModal = modal; 
}

function DashboardController(bodyWidth, bodyHeight) {
	this.bodyWidth = bodyWidth;
	this.bodyHeight = bodyHeight;
		
	this.allDashboards = [];
	this.allDashboardIFrames = [];
	this.allDashboardConfigurations = [];
	this.allRuntimeDashboards = [];
	this.allDomModules = [];
	this.draggable = true;
	this.resizable = true;
}

DashboardController.prototype.removeDashboard = function(dashboardId) {
	//remove the dashboard, destroy the window, you can only remove runtime dashboards
};

DashboardController.prototype.removeDashboards = function(dashboardIds) {
	//remove the dashboard, destroy the window, you can only remove runtime dashboards
};

DashboardController.prototype.removeAllDashboards = function() {
	//remove the dashboard, destroy the window, you can only remove runtime dashboards
};

DashboardController.prototype.acquireFocus = function(dashboardId) {
/*
	var dashboardWindow;
	if(dashboardId) {
		//temporary fix
		var dashboardConfiguration = this.getDashboardConfiguration(dashboardId);
		if(dashboardConfiguration) {
			if(this.existsDashboard(dashboardId)) {
				dashboardWindow = this.getDashboard(dashboardId);
				if(dashboardWindow) {
					dashboardWindow.data("kendoWindow").open();//toFront();
				}
			}
		}
	}
*/
};

DashboardController.prototype.openDashboard = function(dashboardId, isRefresh) {
	var dashboardWindow;
	if(dashboardId) {
		var dashboardConfiguration = this.getDashboardConfiguration(dashboardId);
		var isNew = false;
		if(dashboardConfiguration) {
			if(!this.existsDashboard(dashboardId)) {
				dashboardWindow = this.createDashboard(dashboardConfiguration);
				isNew = true;
			} else {
				dashboardWindow = this.getDashboard(dashboardId);
			}
			
			if(dashboardWindow) {
				dashboardWindow.data("kendoWindow").open();
				dashboardWindow.isMinimized = false;
				dashboardWindow.isClosed = false;
				dashboardWindow.data("kendoWindow").toFront();
				if(!isNew && (isRefresh != undefined || isRefresh == true)) {
					this.refreshDashboard(dashboardId);
				}			
			}
			//logic used to check whether there is a taskbar button or not...?? if not present then will add the  button to taskbar
			if($('#taskbar').find("#btn"+dashboardId).length < 1){
				this.addDashboardToTaskBar(dashboardWindow, dashboardId, dashboardConfiguration.title, dashboardConfiguration.imageClass);
			}
			if(dashboardWindow.data("kendoWindow").wrapper.find(".k-i-close")[0] !=null)
				dashboardWindow.data("kendoWindow").wrapper.find(".k-i-close")[0].title="Close window";
			if(dashboardWindow.data("kendoWindow").wrapper.find(".k-i-maximize")[0] !=null)
				dashboardWindow.data("kendoWindow").wrapper.find(".k-i-maximize")[0].title="Maximize window";
			if(dashboardWindow.data("kendoWindow").wrapper.find(".k-i-minimizetotaskbar")[0] !=null)
				dashboardWindow.data("kendoWindow").wrapper.find(".k-i-minimizetotaskbar")[0].title="Minimize window";
			if(dashboardWindow.data("kendoWindow").wrapper.find(".k-i-restore")[0] !=null)
				dashboardWindow.data("kendoWindow").wrapper.find(".k-i-restore")[0].title="Return window to previous size";
				//resetting left of the dashboard header for clipping of icons 
				dashboardWindow.data("kendoWindow").wrapper.find(".window-header").css({
				    left: this.getMinWidth(dashboardWindow,dashboardId,15)
				  });
				//resetting minWidth of the dashboard 
				dashboardWindow.closest(".k-window").css({
				    minWidth: this.getMinWidth(dashboardWindow,dashboardId,90)
				  });
		} else {
			console.log("Dashboard configuration does not exist for ["+dashboardId+"]");
		}
	}
	
	return dashboardWindow;
};

DashboardController.prototype.getAllDashboardFavoriteDetails = function(isApplicationLevel) {
	var dashbaordFavoriteDetails = {};
	//get all ids
	var dashboardIds = this.getAllDashboardIds();
	if(dashboardIds) {		
//		var dashboardContentWindow;
		for(var i = 0; i < dashboardIds.length; i++) {
			if(typeof parent.isAdvanceQuery == "function" && !parent.isAdvanceQuery() && (dashboardIds[i] != parent.DASHBOARD_ID_MAP_VIEW) && (dashboardIds[i] != parent.DASHBOARD_ID_SCHEMATIC_VIEW)) {
				dashbaordFavoriteDetails[dashboardIds[i]] = this.getDashboardFavoriteDetails(dashboardIds[i], isApplicationLevel);
				dashbaordFavoriteDetails["applicationFav"] = SQWApplicationFavorite.getContentFavoriteSettings();
				dashbaordFavoriteDetails["networkQueryFav"] = SQWNetworkFavorite.getContentFavoriteSettings();
				dashbaordFavoriteDetails["scheduleQueryFav"] = SQWScheduleFavorite.getContentFavoriteSettings();
			}else if(typeof parent.isAdvanceQuery == "function" && parent.isAdvanceQuery()){
				dashbaordFavoriteDetails[dashboardIds[i]] = this.getDashboardFavoriteDetails(dashboardIds[i], isApplicationLevel);
			}	
		}
	}
	return dashbaordFavoriteDetails;
};

DashboardController.prototype.getDashboardFavoriteDetails = function(dashboardId, isApplicationLevel) {
	var favoriteDetails;
	if(dashboardId){
		//get dashboard content window
		dashboardContentWindow = this.getDashboardContentWindow(dashboardId);
		if(dashboardContentWindow){
			try{
				//invoke the method in dashboard to get all preferences 
				favoriteDetails = dashboardContentWindow.getFavoriteDetails(isApplicationLevel);
			}catch(e){
				console.log("Error ["+e.message+"] occurred while retriving the favorites for dashboard ["+dashboardId+"]");
			}
		}else {
			///in there in no preferences  then initialize the object
			favoriteDetails = {};
		}			
		//get the dashboard layout preferences
		var layoutDetails = this.getLayoutDetails(dashboardId);
		if(layoutDetails){
			favoriteDetails["layoutDetails"] = layoutDetails;
		}
		//if this dashboard is a query window then get the preference of child windows
		if(dashboardId == DASHBOARD_ID_QUERY) {				
			favoriteDetails["queryWindowLayoutDetails"] = dashboardContentWindow.getQryWindowLayoutDetails();
		}
		favoriteDetails["networkDashboardLoadStatus"] = this.isDashboardDataLoaded(dashboardId, "Network");
		favoriteDetails["scheduleDashboardLoadStatus"] = this.isDashboardDataLoaded(dashboardId, "NetworkSchedule");
	}
	
	return favoriteDetails;
};

/**
 * retrive all the layout preferences for the corresponding dashbaord id
 */
DashboardController.prototype.getLayoutDetails = function(dashboardId) { 
	var dashboardWindow;
	var layoutDetails ;
	if(dashboardId) {
		//retrive the dashbaord configuration - dummay check to find whether the window is available or not
		var dashboardConfiguration = this.getDashboardConfiguration(dashboardId);
		if(dashboardConfiguration) {
			//get the dashboard window
			dashboardWindow = this.getDashboard(dashboardId);
			if(dashboardWindow) {
				//window layout details 
				layoutDetails = {};
				layoutDetails.height = dashboardWindow.data("kendoWindow").wrapper.css("height");
				layoutDetails.width = dashboardWindow.data("kendoWindow").wrapper.css("width");
				layoutDetails.top = dashboardWindow.data("kendoWindow").wrapper.css("top");
				layoutDetails.left = dashboardWindow.data("kendoWindow").wrapper.css("left");
				layoutDetails.zIndex = dashboardWindow.data("kendoWindow").wrapper.css("z-index");
				layoutDetails.isMinimized = dashboardWindow.isMinimized;
				layoutDetails.isClosed = dashboardWindow.isClosed;	
				layoutDetails.isMaximized = dashboardWindow.isMaximized;
				layoutDetails.isRestore = dashboardWindow.isRestore;
				layoutDetails.isOpen= dashboardWindow.isOpen;
			}
		} else {
			console.log("Dashboard configuration does not exist for ["+dashboardId+"]");
		}
	}
	
	return layoutDetails;
};

DashboardController.prototype.orderByZIndex = function(zIndexMap) { 
	if(zIndexMap){
		var zIndexKeys = Object.keys(zIndexMap);
		if(zIndexKeys){
			var dashboardId;
			var dashboardWindow;
			zIndexKeys.sort();
			for(var i=0; i<zIndexKeys.length; i++ ){
				dashboardId = zIndexMap[zIndexKeys[i]];
				dashboardWindow = this.getDashboard(dashboardId);
				if(dashboardWindow){
					dashboardWindow.data("kendoWindow").toFront();
				}
			}
		}
	}
};

/**
 * setting the layout details.... 
 */
DashboardController.prototype.setLayoutDetails = function(dashboardId, favoriteDetails, isQueryWindow, isClone) { 
	var layoutDetails;
	var queryWindowLayoutDetails;	
	var dashboardWindow;
	if(favoriteDetails){
		//get the layout details 
		layoutDetails = favoriteDetails["layoutDetails"];		
		///set the window layout preferences
		this.setWindowLayoutPreferences(dashboardId, layoutDetails, isQueryWindow, isClone);		
	}
	
};



/**
 * 
 * @param dashboardId
 * @param layoutDetails
 * @param isQueryWindow
 */
DashboardController.prototype.setWindowLayoutPreferences = function(dashboardId, layoutDetails, isQueryWindow, isClone) {
	var dashboardWindow;
	//get the dashboardWindow for  the given dashboard Id
	if(dashboardId && !isQueryWindow){
		dashboardWindow  = this.getDashboard(dashboardId);
		// if the dashboard window is not present but layout details are saved as favorite then initialize the window and close it... 
		if(!dashboardWindow && layoutDetails && !isQueryWindow){
			//opening the dashboard
			dashboardWindow = dashboardController.openDashboard(dashboardId);
			//closing 
			this.closeDashboard(dashboardId, false);
		}
	}else if(isQueryWindow){
		dashboardWindow = dashboardId;
	}
	if(dashboardWindow && layoutDetails) {
		//setting the layour details
		if(isQueryWindow){
		    dashboardWindow.data("kendoWindow").wrapper.css({
    			"width": layoutDetails.width,
    			"top": layoutDetails.top,
    			"left":	layoutDetails.left			
    		});
		}else {
		    dashboardWindow.data("kendoWindow").wrapper.css({
    			"height": layoutDetails.height,
    			"width": layoutDetails.width,
    			"top": layoutDetails.top,
    			"left":	layoutDetails.left			
    		});
		}
		if(isQueryWindow){
			if(layoutDetails.isMinimized){
				//dashboardWindow.data("kendoWindow").minimize();
				dashboardWindow.data("kendoWindow").wrapper.find(".k-i-minimize").trigger("click");
			}
			if(layoutDetails.isClosed){
				dashboardWindow.data("kendoWindow").close();
			}
			
			if((!layoutDetails.isMinimized || layoutDetails.isMinimized == undefined)  && (!layoutDetails.isClosed || layoutDetails.isClosed == undefined)){
				dashboardWindow.data("kendoWindow").wrapper.find(".k-i-restore").trigger("click");
			}
		}else {
			//minimize event handler
			if(layoutDetails.isMinimized){
				this.minimizeDashboard(dashboardId, true, isClone);
			}
			
			//close event handler
			if(layoutDetails.isClosed){
				this.closeDashboard(dashboardId, true);
			}
			
			//maximize event handler
			if(layoutDetails.isMaximized){
				this.maximizeDashboard(dashboardId, true);			
			}
			
			//restore event handler
			if(layoutDetails.isRestore){
				this.restoreDashboard(dashboardId, true);
			}
			
			//open event handelrs 
			if(layoutDetails.isOpen){
				this.openDashboard(dashboardId);			
			}
			
		}
		// params 
		dashboardWindow.isMinimized = layoutDetails.isMinimized;
		dashboardWindow.isClosed = layoutDetails.isClosed;
		dashboardWindow.isMaximized = layoutDetails.isMaximized;
		dashboardWindow.isRestore = layoutDetails.isRestore;
	}else if(!layoutDetails && dashboardWindow){
		//layout details are not present for the selected favorite but the dashboard is available then close it... from view
		this.closeDashboard(dashboardId, true);
	}
};

/**
 * restore event handelrs 
 */
DashboardController.prototype.restoreDashboard = function(dashboardId, isRuntime) {
	//closes the dashboard
	var dashboardWindow;
	if(dashboardId ){
		dashboardWindow = this.getDashboard(dashboardId);
		dashboardWindow.data("kendoWindow").restore();
		dashboardWindow.data("kendoWindow").wrapper.find(".k-i-restore").trigger("click");		
	}
};

/**
 * maximize event handelrs 
 * @param dashboardId
 * @param isRuntime
 */
DashboardController.prototype.maximizeDashboard = function(dashboardId, isRuntime) {
	//closes the dashboard
	var dashboardWindow;
	if(dashboardId ){
		dashboardWindow = this.getDashboard(dashboardId);
		dashboardWindow.data("kendoWindow").maximize();
		dashboardWindow.data("kendoWindow").wrapper.find(".k-i-maximize").trigger("click");		
	}
};

/**
 * minimize event handekrs 
 * @param dashboardId
 * @param isRuntime
 */
DashboardController.prototype.minimizeDashboard = function(dashboardId, isRuntime, isClone) {
	//closes the dashboard
	var dashboardWindow;
	if(dashboardId ){
		var dashboardConfiguration = this.getDashboardConfiguration(dashboardId);
		dashboardWindow = this.getDashboard(dashboardId);		
		this.addDashboardToTaskBar(dashboardWindow, dashboardId, dashboardConfiguration.title, dashboardConfiguration.imageClass, true);
	
		setTimeout(function(){
			dashboardWindow.data("kendoWindow").close();
			dashboardWindow.data("kendoWindow").wrapper.find(".k-i-minimize").trigger("click");
		}, 500);
		
	}
};

/**
 * close event handkers 
 * @param dashboardId
 * @param isRuntime
 */
DashboardController.prototype.closeDashboard = function(dashboardId, isRuntime) {
	//closes the dashboard
	var dashboardWindow;
	if(dashboardId ){
		dashboardWindow = this.getDashboard(dashboardId);
		dashboardWindow.data("kendoWindow").close();
		dashboardWindow.data("kendoWindow").wrapper.find(".k-i-close").trigger("click");		
	}
};

/**
 * close event handelr 
 * @param dashboardIds
 * @param isRuntime
 */
DashboardController.prototype.closeDashboards = function(dashboardIds, isRuntime) {
	var dashboardWindow;
	for(var dashboardId in dashboardIds) {
		dashboardWindow = this.getDashboard(dashboardIds[dashboardId]);
		if(dashboardWindow) {
			dashboardWindow.data("kendoWindow").close();
		}
	}
};

/**
 * returns the dashbaord window
 * @param dashboardId
 * @returns
 */
DashboardController.prototype.getDashboard = function(dashboardId) {
	//get the dashboard by id
	
	var dashboardObj;
	if(dashboardId) {
		dashboardObj = this.allDashboards[dashboardId];
		if(!dashboardObj) {
			dashboardObj = this.allRuntimeDashboards[dashboardId];
		}
	}
	
	return dashboardObj;
};

DashboardController.prototype.existsDashboard = function(dashboardId) {
	//returns true or false based on whether the dashboard exists
	var dashboardObj = this.getDashboard(dashboardId);
	if(dashboardObj) {
		return true;
	}
	
	return false;
};


DashboardController.prototype.getDashboardIds = function(isRuntime, isDomModule) {
	//returns all the ids of the dashboards for which the windows were created
	if(isRuntime) {
		return Object.keys(this.allRuntimeDashboards);
	}
	
	if(isDomModule == undefined ){
		return Object.keys(this.allDashboards);		
	}
	
	if(isDomModule){
		return this.allDomModules;
	}
	return null;
};

DashboardController.prototype.createDashboard = function(dasboardObj) {
    // get the Jquery object by id
    var window = $('#' + dasboardObj.dashboardId);
	var controller = this;
    // checking whether the div is avaialable or not...if not create one....
    if (window == null || window.length < 1) {
        $('#mainBody').append('<div id="' + dasboardObj.dashboardId + '" style="height: 100%;width: 100%; overflow: hidden;"> </div>');
        window = $('#' + dasboardObj.dashboardId);
    }

    //"WindowTearOff", - removed
    // creating the kendo window
    if (!window.data("kendoWindow")) {
        window.kendoWindow({
        	width: dasboardObj.width,
            height: dasboardObj.height,
            actions: ["MinimizeToTaskbar", "Maximize", "Close"],
            title: dasboardObj.title,
            content: dasboardObj.content,
        	iframe: dasboardObj.hasiframe,
            resize: function(event) {
        		controller.onResize(event, controller);
        	},
            close: this.onWindowClose,
            open: function(e){
            	window.isOpen = true;
            }
        });
        window.isMinimized = false;
        window.isClosed = false;
    }
    
    //maximize event 
    window.data("kendoWindow").wrapper.find(".k-i-maximize").click(function(e){
    	if (!window.isMaximized) {		        	
        	window.isMaximized = true;
        	window.isMinimized = false;
	        window.isClosed = false;
	        window.isRestore= false;
        } 
        controller.onResize(e);	  
       
        setTimeout(function(){
        	//cache the height of the container
        	window.cachedHeight = window.data("kendoWindow").wrapper.css("height");
        	window.data("kendoWindow").wrapper.css({	                
                "height": ((getHeight(window.cachedHeight))-65)+"px"	               
            });
        	// restore  event
        	window.data("kendoWindow").wrapper.find(".k-i-restore").click(    			
        	function(e1) {
        		window.data("kendoWindow").wrapper.css({	                
	                "height": window.cachedHeight	               
	            });
	            window.isMaximized = false;	 
	            window.isMinimized = false;
	            window.isClosed = false;
	            window.isRestore= true;
	            window.isOpen = true;
        		controller.onResize(e1);
        		e1.preventDefault();
        	});
        }, 50);
    	
        
        e.preventDefault();
    });
    //modal
    if (dasboardObj.isModal != undefined ) {
    	window.data("kendoWindow").options.modal = true;
    }
    // setting the x, y position
    window.closest(".k-window").css({
        top: dasboardObj.xPosition,
        left: dasboardObj.yPosition,
        right: dasboardObj.rightPosition,
        bottom: dasboardObj.bottomPosition,
        minWidth: dasboardObj.minWidth/*,
        minHeight: dasboardObj.minHeight*/
    });

    window.parent().find('.k-window-title').before('<div class="titlebar-icon '+dasboardObj.imageClass+'"></div>');
    window.parent().find('.k-window-title').after('<div class="window-titlebar-bar" ></div>');
    window.parent().find('.k-window-titlebar').bind("dblclick", function(e){
    	e.stopImmediatePropagation();
    	if(window.isMaximized){
    		window.isMaximized = false;
    	}else {
    		
    		window.isMaximized = true;
    	}
    	if(controller.resizable && controller.draggable) {
	    	if(window.isMaximized){
	    		window.data("kendoWindow").wrapper.find(".k-i-maximize").trigger("click");
	    	}else {
	    		window.data("kendoWindow").wrapper.find(".k-i-restore").trigger("click");
	    	}
    	}
    	controller.resizable = true;
    	controller.draggable = true;
	});
    
    window.parent().find('.k-window-titlebar').css({
    	"border-top-left-radius":"11px",
		"border-top-right-radius":"11px"
    });
    window.find(".k-content-frame").parent().css({
    	"padding-top":"0px",
    	"padding-left": "0px",
    	"padding-bottom": "0px",
    	"padding-right": "0px"
    });
    // added a task bar button for the current window
    taskbarBtn = this.addDashboardToTaskBar(window, dasboardObj.dashboardId, dasboardObj.title, dasboardObj.imageClass);

    // loading all the windows to drop down widget
    $('#allWindows').append('<li><a href="#' + dasboardObj.dashboardId + '" id="btf' + dasboardObj.dashboardId + '">' + dasboardObj.title + '</a></li>');
    var headerBtn = $("#btf" + dasboardObj.dashboardId);

    // close operation
    window.data("kendoWindow").wrapper.find(".k-i-close").click(
	    function(e) {
	        window.isMinimized = true;
	        window.isClosed = true;
	        window.isMaximized = false;
	        window.isRestore = false;
	        window.isOpen = false;
	        $("#btn" + dasboardObj.dashboardId).remove(); 
	        controller.onResize(e);
	    });

    // minimize event
    window.data("kendoWindow").wrapper.find(".k-i-minimizetotaskbar").click(
	    function(e) {
	    	window.data("kendoWindow").close();
	        window.isMinimized = true;
	        window.isClosed = false;
	        window.isMaximized = false;
	        window.isRestore = false;
	        window.isOpen = false;
	        controller.onResize(e);
	    });
    
    // tear off event
    /*window.data("kendoWindow").wrapper.find(".k-i-windowtearoff").click(
	    function(e) {
			    
	    });*/
    window.data("kendoWindow").wrapper.find('>.k-header').on('mousedown',
		function(e){
	  		if(!controller.draggable){
	        	e.stopImmediatePropagation();
	        }
		}
    );
    
    
    // header button click event
    headerBtn.bind("click", function() {
        if (!window.isClosed) {
            taskbarBtn = _createAndBindTaskBarOperations(window, dasboardObj.dashboardId, dasboardObj.title, dasboardObj.imageUrl);
            window.data("kendoWindow").open();
        } else {
            window.data("kendoWindow").open();
        }
        window.isMinimized = false;
        window.isClosed = false;
        window.isMaximized = false;
        window.isRestore = true;
        window.isOpen = true;
        window.data("kendoWindow").toFront();
        window.data("kendoWindow").center();
        controller.onResizeDashboard(dasboardObj.dashboardId);
    });
    if(dasboardObj.hasiframe){
    	this.allDashboardIFrames[dasboardObj.dashboardId] = window.data("kendoWindow").wrapper.find(".k-content-frame");
    }
    //resetting minWidth of the dashboard 
    window.closest(".k-window").css({
    	minWidth: this.getMinWidth(window,dasboardObj.dashboardId,90)
    });
    
    if(!dasboardObj.isRuntime) {
		this.allDashboards[dasboardObj.dashboardId] = window;
	} else {
		this.allRuntimeDashboards[dasboardObj.dashboardId] = window;
	}
    
    window.parent().addClass("applicationWindow");
    this.addMouseEvents(window);
    
    window.find("iframe").removeAttr("title");
    if (dasboardObj.dashboardId == DASHBOARD_ID_SCHEDULE_MATRIX){
    	 window.find("iframe").attr("scrolling","no");
    }
    try {
	    if(dasboardObj.dashboardId == DASHBOARD_ID_MAP_VIEW) {
	    	$("#"+DASHBOARD_ID_MAP_VIEW).css({"padding":"5px"});
	    	
	    }
    }catch (e) {
		console.log(e.message);
	}
    return window;
};

//changing width to resolve resize issue due to iframe
DashboardController.prototype.addMouseEvents = function(window){
	window.siblings("div.k-resize-handle.k-resize-e").mousedown(function(e){
		window.siblings("div.k-resize-handle.k-resize-e").width(30);
	});
	
	window.siblings("div.k-resize-handle.k-resize-e").mouseout(function(e){
		window.siblings("div.k-resize-handle.k-resize-e").width(6);
	});
	
	window.siblings("div.k-resize-handle.k-resize-s").mousedown(function(e){
		window.siblings("div.k-resize-handle.k-resize-s").height(30);
	});
	
	window.siblings("div.k-resize-handle.k-resize-s").mouseout(function(e){
		window.siblings("div.k-resize-handle.k-resize-s").height(6);
	});
	
	window.siblings("div.k-resize-handle.k-resize-w").mousedown(function(e){
		window.siblings("div.k-resize-handle.k-resize-w").width(30);
	});
	
	window.siblings("div.k-resize-handle.k-resize-w").mouseout(function(e) {
		window.siblings("div.k-resize-handle.k-resize-w").width(6);
	});
	
	window.siblings("div.k-resize-handle.k-resize-se").mousedown(function(e){
		window.siblings("div.k-resize-handle.k-resize-se").width(30);
		window.siblings("div.k-resize-handle.k-resize-se").height(30);
	});
	
	window.siblings("div.k-resize-handle.k-resize-se").mouseout(function(e) {
		window.siblings("div.k-resize-handle.k-resize-se").width(6);
		window.siblings("div.k-resize-handle.k-resize-se").height(6);
	});
	
	window.siblings("div.k-resize-handle.k-resize-sw").mousedown(function(e){
		window.siblings("div.k-resize-handle.k-resize-sw").width(30);
		window.siblings("div.k-resize-handle.k-resize-sw").height(30);
	});
	
	window.siblings("div.k-resize-handle.k-resize-sw").mouseout(function(e) {
		window.siblings("div.k-resize-handle.k-resize-sw").width(6);
		window.siblings("div.k-resize-handle.k-resize-sw").height(6);
	});
};

DashboardController.prototype.cloneDashboard = function(){
	var cloneDetails = {};
	var cloneId;
	cloneDetails["favoriteDetails"] = getFavoriteDetails(true);
	cloneDetails["browserSessionId"] = getBrowserSessionId();
	cloneDetails["commonCaseId"] = getCommonCaseId();
	cloneDetails["effDayPatternStr"] = parent.getSelectedEffDayStrPattern();	
	cloneDetails["scheduleId"] = getScheduleId();
	cloneDetails["selectedPlanWeek"] = getSelectedPlanWeek();
	cloneId = new Date().getTime();
	cloneDetails["cloneId"] = cloneId;
	
	var params = {};
	params.cloneDetails = JSON.stringify(cloneDetails);
	params.cloneId = cloneId;
	callService({
		url : PEGASUS_AJAX_URL+"saveCloneDetails",
		paramsMap: params,
		successCallback : function(response, io){
			onSavedCloneDetailsResponseHandler(response, io, cloneId);
		}, 
		showProgressWindow : false
	});	
};

DashboardController.prototype.getMinWidth = function(window,dashboardId,minblankSpaceRequired){
	return parseInt((window.data("kendoWindow").wrapper.find(".k-window-title"))[0].offsetWidth) +parseInt((window.data("kendoWindow").wrapper.find(".k-window-title"))[0].offsetLeft)+minblankSpaceRequired+"px";
};

DashboardController.prototype.onMaximize = function(e) {
	var window = $('#' + e.sender.element[0].id);
	 window.data("kendoWindow").wrapper.css({
	                "margin-top": "50px",
	                "margin-bottom": "55px",
	                "height": document.documentElement.clientHeight - 115 + "px",
	                "width": $(document).width() + "px"
	            });
};

DashboardController.prototype.onResize = function(e, controller) {
	try {
		if(controller && e.sender && e.sender.element && e.sender.element.length > 0 && e.sender.element[0].id) {
			var dashboardContentWindow = controller.getDashboardContentWindow(e.sender.element[0].id);
			if(dashboardContentWindow) {
				dashboardContentWindow.onResize(e);
			}
		}
	}catch (e) {
		//console.log("Error ["+e.message+"] occurred while resizing the window ["+window.parent().attr('id')+"]");
	}
};

DashboardController.prototype.onWindowClose = function(e) {
	if(e.userTriggered){
		$('#btn'+e.sender.element[0].id).remove();
		onWindowCloseHandler(e);
	}	
};

DashboardController.prototype.addDashboardToTaskBar = function(window, windowId, title, imageClass, isClosedState) {
    var cloneWindow;
    var taskbarBtn = this.createTaskbarBtn(window, windowId, title, imageClass);
    var controller = this;
    // task bar button click event
    taskbarBtn.bind("click", function() {
    	if(window.isMinimized) {
	        controller.refreshDashboard(windowId);         
    	}
    	
		window.data("kendoWindow").open();
        window.isMinimized = false;
        window.isClosed = false;
        window.isOpen = true;
        window.data("kendoWindow").toFront();
        isClosedState = false;
	
        
    });
    return taskbarBtn;
};

// task bar button.... utility
DashboardController.prototype.createTaskbarBtn = function(window, windowId, title, imageClass) {
	var taskbarBtn = $("#btn" + windowId);
	if(taskbarBtn.length == 0){
		$('#taskbar').append('<div id="btn' + windowId + '" class="k-button undo"><div class="'+imageClass+' taskbar-icon" style="float:left;" >&nbsp;</div><div class="taskbar-window-title"  style="float:left; margin-left:4px;">' + title + '</div></div>');
		taskbarBtn = $("#btn" + windowId);
	}
	
    return taskbarBtn;
};


DashboardController.prototype.addDashboardConfiguration = function(dashboardId, title, top, right, bottom, left, width, height, imageClass, content, hasiframe, isRuntime, isNotKendoWindow,modal) {
	this.allDashboardConfigurations[dashboardId] = new Dashboard(dashboardId, title, top, right, bottom, left, width, height, imageClass, content, hasiframe, isRuntime, isNotKendoWindow,modal);
	//need to refractor the code.....
	if(isNotKendoWindow){
		this.allDomModules.push(dashboardId);
	}
};

DashboardController.prototype.getDashboardConfiguration = function(dashboardId) {
	return this.allDashboardConfigurations[dashboardId];
};

DashboardController.prototype.removeDashboardConfiguration = function(dashboardId) {
};

DashboardController.prototype.getAllDashboardIds = function() {
	return Object.keys(this.allDashboardConfigurations);
};

DashboardController.prototype.getDashboardIframe = function(dashboardId) {
	if(dashboardId){
		var frames = this.allDashboardIFrames[dashboardId];
		if(frames){
			return frames[0];
		}
	}
	
	return null;
};

DashboardController.prototype.getDashboardContentWindow = function(dashboardId) {
	var iframe = this.getDashboardIframe(dashboardId);
	
	if(iframe) {
		return iframe.contentWindow;
	}else if(this.isKendoDashboard(dashboardId)){		
		return parent;
	}
	
	return null;
};

DashboardController.prototype.isKendoDashboard = function(dashboardId) {	
	if(dashboardId != undefined){
		var dashboardConfiguration = this.getDashboardConfiguration(dashboardId);
		if(dashboardConfiguration != undefined){
			return this.getDashboardConfiguration(dashboardId).isNotKendoWindow != undefined && 
			this.getDashboardConfiguration(dashboardId).isNotKendoWindow;
		}
	}
	
	return false;
};

DashboardController.prototype.clearAllDashboards = function(isClearAll, excludedDashboardIds) {	
	var dashboardIds = this.getDashboardIds(false);
	if(dashboardIds) {
		this.clearDashboards(dashboardIds, isClearAll, excludedDashboardIds);
	}
	dashboardIds = this.getDashboardIds(true);
	if(dashboardIds) {
		this.clearDashboards(dashboardIds, isClearAll, excludedDashboardIds);
	}	
	
	dashboardIds = this.getDashboardIds(false, true);	
	if(dashboardIds) {
		this.clearDashboards(dashboardIds, isClearAll, excludedDashboardIds);
	}
};

DashboardController.prototype.clearDashboards = function(dashboardIds, isClearAll, excludedDashboardIds) {
	if(dashboardIds) {		
		var exclude = false;
		for(var i = 0; i < dashboardIds.length; i++) {			
			exclude = false;
			if(excludedDashboardIds) {
				for(var j = 0; j < excludedDashboardIds.length; j++) {
					if(excludedDashboardIds[j] == dashboardIds[i]) {
						exclude = true;
						break;
					}
				}
			}
			if(!exclude) {
				this.clearDashboard(dashboardIds[i], isClearAll);
			}			
		}		
	}
};

DashboardController.prototype.clearDashboard = function(dashboardId, isClearAll) {
	if(dashboardId) {		
		try {
			var dashboardContentWindow = this.getDashboardContentWindow(dashboardId);
			if(dashboardContentWindow) {
				dashboardContentWindow.clear(isClearAll);
			}
		} catch(e) {
			console.log("Error ["+e.message+"] occurred while clearing the window ["+dashboardId+"]");
		}
	}
};

DashboardController.prototype.refreshAllDashboards = function(excludedDashboardIds) {	
	var dashboardIds = this.getDashboardIds(false);
	if(dashboardIds) {
		this.refreshDashboards(dashboardIds, excludedDashboardIds);
	}
	dashboardIds = this.getDashboardIds(true);
	if(dashboardIds) {
		this.refreshDashboards(dashboardIds, excludedDashboardIds);
	}	
};

DashboardController.prototype.refreshDashboards = function(dashboardIds, excludedDashboardIds) {
	if(dashboardIds) {		
		var exclude = false;
		for(var i = 0; i < dashboardIds.length; i++) {			
			exclude = false;
			if(excludedDashboardIds) {
				for(var j = 0; j < excludedDashboardIds.length; j++) {
					if(excludedDashboardIds[j] == dashboardIds[i]) {
						exclude = true;
						break;
					}
				}
			}
			if(!exclude) {
				this.refreshDashboard(dashboardIds[i]);
			}			
		}		
	}
};

DashboardController.prototype.refreshDashboard = function(dashboardId) {
	if(dashboardId) {		
		try {
			var dashboardContentWindow = this.getDashboardContentWindow(dashboardId);
			if(dashboardContentWindow) {
				dashboardContentWindow.refresh();
			}
		} catch(e) {
			///console.log("Error ["+e.message+"] occurred while refreshing the window ["+dashboardId+"]");
			console.log("Error ["+e.message+"] occurred while refreshing the window ["+dashboardId+"]");
		}
	}
};
DashboardController.prototype.resetDashboard = function(dashboardId,restoreDefaultFavorite) {
	if(dashboardId) {		
		try {
			var dashboardContentWindow = this.getDashboardContentWindow(dashboardId);
			if(dashboardContentWindow) {
				dashboardContentWindow.resetDashboard(restoreDefaultFavorite);
			}
		} catch(e) {
			console.log("Error ["+e.message+"] occurred while resetting the window ["+dashboardId+"]");
		}
	}
};
DashboardController.prototype.setDashboardTitle = function(dashboardId, title) {
	if(dashboardId) {
		try {
			var dashboardConfiguration = this.getDashboardConfiguration(dashboardId);
			dashboardConfiguration.title = title;
			var dashboardWindow = this.getDashboard(dashboardId);
			if(dashboardWindow) {
				dashboardWindow.data("kendoWindow").title(title);
				dashboardWindow.data("kendoWindow").title(title);
				//resetting left of the dashboard header for clipping of icons 
				dashboardWindow.data("kendoWindow").wrapper.find(".window-header").css({
				    left: this.getMinWidth(dashboardWindow,dashboardId,15)
				  });
				//resetting minWidth of the dashboard 
				dashboardWindow.closest(".k-window").css({
				    minWidth: this.getMinWidth(dashboardWindow,dashboardId,90)
				  });
			}	
		} catch(e) {
			console.log("Error ["+e.message+"] occurred while updating the title for ["+dashboardId+"]");
		}
	}
};

DashboardController.prototype.setAllDashboardsDataStatus = function(dataType, isDataLoaded) {
	var dashboardIds = this.getAllDashboardIds();
	if(dashboardIds) {
		for(var i = 0; i < dashboardIds.length; i++) {
			this.setDashboardDataStatus(dashboardIds[i], dataType, isDataLoaded);			
		}
	}	
};

DashboardController.prototype.setDashboardDataStatus = function(dashboardId, dataType, isDataLoaded) {
	if(dashboardId) {
		var dashboardConfiguration = this.getDashboardConfiguration(dashboardId);
		if(dashboardConfiguration != undefined)
			dashboardConfiguration.dataStatus[dataType] = isDataLoaded;
	}
};

DashboardController.prototype.isDashboardDataLoaded = function(dashboardId, dataType) {
	if(dashboardId) {
		var dashboardConfiguration = this.getDashboardConfiguration(dashboardId);
		if(dashboardConfiguration != undefined)
			return dashboardConfiguration.dataStatus[dataType];
	}
	
	return false;
};

DashboardController.prototype.setDashboardInitialized = function(dashboardId) {
	if(dashboardId) {
		var dashboardConfiguration = this.getDashboardConfiguration(dashboardId);
		if(dashboardConfiguration != undefined)	
			dashboardConfiguration.isInitialized = true;
	}
};

DashboardController.prototype.isAllDashboardLInitialized = function() {
	var dashboardIds = this.getAllDashboardIds();
	var isAppLoaded = false;
	if(dashboardIds) {
		/*for(var i = 0; i < dashboardIds.length; i++) {
			//this.setDashboardDataStatus(dashboardIds[i], dataType, isDataLoaded);
			if(!this.isDashboardInitialized(dashboardIds[i])){
				return false;
			}
		}*/
		if(this.isDashboardInitialized("queryWindowDiv") && this.isDashboardInitialized("mapViewDiv")){
			isAppLoaded = true;
		}
	}	
	
	return isAppLoaded;
};


DashboardController.prototype.isDashboardInitialized = function(dashboardId) {
	if(dashboardId) {
		var dashboardConfiguration = this.getDashboardConfiguration(dashboardId);
		if(dashboardConfiguration != undefined)
			return dashboardConfiguration.isInitialized;
	}
};
DashboardController.prototype.isDashboardActive = function(dashboardId) {
	if(dashboardId) {
		var dashboardWindow = this.getDashboard(dashboardId);
		if(dashboardWindow) {
			return !(dashboardWindow.isMinimized || dashboardWindow.isClosed);
		}else if(this.isKendoDashboard(dashboardId)){
			dashboardWindow = this.getDashboardContentWindow(dashboardId);
			if(dashboardWindow != undefined && dashboardWindow[dashboardId]["windowStatus"] != undefined) {
				return dashboardWindow[dashboardId]["windowStatus"];
			}
			return true;
		}
	}
	
	return false;
};

DashboardController.prototype.setDashboardActive = function(dashboardId, flag) {
	if(dashboardId) {
		var dashboardContentWindow;
		if(this.isKendoDashboard(dashboardId)){
			dashboardContentWindow = this.getDashboardContentWindow(dashboardId);
			if(dashboardContentWindow != undefined) {
				dashboardContentWindow[dashboardId]["windowStatus"] = flag;
			}
		}
	}
};


DashboardController.prototype.isDashboardClosed = function(dashboardId) {
	if(dashboardId) {
		var dashboardWindow = this.getDashboard(dashboardId);
		if(dashboardWindow) {
			return dashboardWindow.isClosed;
		}
	}
	
	return true;
};

DashboardController.prototype.onResizeDashboard = function(dashboardId) {
	if(dashboardId) {		
		try {
			var dashboardContentWindow = this.getDashboardContentWindow(dashboardId);
			if(dashboardContentWindow) {
				dashboardContentWindow.onResize();
			}
		} catch(e) {
			console.log("Error ["+e.message+"] occurred while resizing the window ["+dashboardId+"]");
		}
	}
};

DashboardController.prototype.toFront = function(dashboardId) {
	var dashboardWindow = this.getDashboard(dashboardId);
	if(dashboardWindow) {
		dashboardWindow.data("kendoWindow").toFront();
	}			
};

DashboardController.prototype.enableDragging = function(dashboardId, enableDragging) {
/*
	if(dashboardId) {
		var dashboardWindow = this.getDashboard(dashboardId);
		if(dashboardWindow) {
			dashboardWindow.draggable = isEnable;
		}
	}
*/
	this.draggable = enableDragging;
};

DashboardController.prototype.enableResizable = function(enableResizable) {
	this.resizable = enableResizable;
};

function getHeight(pixelHeight){
	return  pixelHeight.substring(0,pixelHeight.length-2);
}
DashboardController.prototype.restoreDashbordView = function(dashboardId,top,left,right,bottom, width, height) {
	var dashboardWindow;
	// setting the x, y position
	dashboardWindow = this.getDashboard(dashboardId);
	dashboardWindow.closest(".k-window").css({
        top: top,
        left: left,
        right: right,
        bottom: bottom,
        width: width,
        height:height 	 
    });
};

DashboardController.prototype.getWindowProperties = function(dashboardId) {
	if(dashboardId) {		
		try {
			var dashboardContentWindow = this.getDashboardContentWindow(dashboardId);
			return {width: $(dashboardContentWindow).width(), height: $(dashboardContentWindow).height()};			
		} catch(e) {
			console.log("Error ["+e.message+"] occurred while resizing the window ["+dashboardId+"]");
		}
	}
};
