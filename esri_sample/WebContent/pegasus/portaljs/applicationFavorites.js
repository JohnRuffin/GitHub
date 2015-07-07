var applicationFavoriteComponent;
var globalFavoriteComponent;

/**
 * Main component to apply the application level favorites or clear application level favorites
 * @param favoriteDetails	- a favorite that need to be applied
 * @param isApplicationLevel	- flag to indicate whether its a application level or not?? (deprecated)
 * @param isClearApplicationFavorite	- flag to indicate whether this is an clear application favorite...
 * @returns {GlobalFavoriteComponent}	
 */
function GlobalFavoriteComponent(favoriteDetails, isApplicationLevel, isClearApplicationFavorite) {
   this.favoriteDetails = favoriteDetails;
   this.zIndexMap = {};
   this.isApplicationLevel = isApplicationLevel;
   this.isClearApplicationFavorite = isClearApplicationFavorite;
   this.checkDashboardLayoutInitializeHandler;
   this.isScheduleTabFavoriteApplied = false;
   this.scheduleFavoriteDisplayOptionSettings;
}

/**
 * apply application level favorite....
 */
GlobalFavoriteComponent.prototype.applyGlobalFavorite = function() {
	var globalWindowComponent = this;
	var dashboardKeys; 
	if(this.favoriteDetails != undefined){
		///get all the keys of the dashbaords...
		dashboardKeys = Object.keys(this.favoriteDetails.dashboardFavorites);
		//iterate the dashboards and set/apply the window level settings
		for(var i=0; i<dashboardKeys.length; i++){
			//load the initial layout 
			this.createLayout(dashboardKeys[i]);
		}
		//stack the windows by order...
		dashboardController.orderByZIndex(this.zIndexMap);
		//repeater to validate that all the dashboards are initialized & loaded successfully...then 
		this.checkDashboardLayoutInitializeHandler = setInterval(function() { 
			if (globalWindowComponent.allDashboardsInitialized()) { /// if so...then
	       		 // kill / clear the repeater
	       		 window.clearInterval(globalWindowComponent.checkDashboardLayoutInitializeHandler);
	       		 //applying the favorites...
	       		 for(var i=0; i<dashboardKeys.length; i++){
	     			//if its a query window....
	     			if(dashboardKeys[i] == DASHBOARD_ID_QUERY){
	     				globalWindowComponent.applyQueryFavorite(dashboardKeys[i]);
	     			}else {
	     				//if other than query window....
	     				//globalWindowComponent.applyFavorite(dashboardKeys[i]);
	     			}
	     		}	
	        }
       }, 1500);
	}
};	

/**
 * checks whether all the dashbaords are initialized or not...
 * @returns {Boolean}
 */
GlobalFavoriteComponent.prototype.allDashboardsInitialized = function() {
	//get all the open dashboards...
    var dashboardIds = this.getOpenDashboardKeys();
    var isAppLoaded = true;
    if (dashboardIds) {
        for (var i = 0; i < dashboardIds.length; i++) {
        	//check whether the dashboards is initialized.....or not...
            if (!dashboardController.isDashboardInitialized(dashboardIds[i])) {
                return false;
            }
        }
    }

    return isAppLoaded;
};

/**
 * returns an array of open dashboards...
 * @returns {Array}
 */
GlobalFavoriteComponent.prototype.getOpenDashboardKeys = function() {
	//get all the dashbaords...
    var dashboardIds = dashboardController.getAllDashboardIds();
    var dashboardContentWindow;
    var loadedDashboardIds = [];
    for (var i = 0; i < dashboardIds.length; i++) { //iterate over all the dashboards...
        dashboardContentWindow = dashboardController.getDashboardContentWindow(dashboardIds[i]);
        //check whether the content window is loaded...
        if (dashboardContentWindow != undefined || dashboardContentWindow != null) {
        	// push -- loaded....
            loadedDashboardIds.push(dashboardIds[i]);
        }
    }
    return loadedDashboardIds;
};

/**
 * creating the application level layout....(opening dashboard, setting dashboard positions and (minimize, maximize, closed, opened) states )
 * @param dashboardId
 */
GlobalFavoriteComponent.prototype.createLayout = function (dashboardId){
	var dashboardContentWindow;
	var dashboardFavorite;
	
	if(dashboardId != undefined){
		//get the dashboard content...
		dashboardContentWindow = dashboardController.getDashboardContentWindow(dashboardId);
		//get the favorite that need to apply for the current dashboard 
		dashboardFavorite = this.favoriteDetails.dashboardFavorites[dashboardId];
		//set the initial settings for window
		dashboardController.setLayoutDetails(dashboardId, dashboardFavorite);
		//order of window ... (caching the order of window...)
		if(dashboardFavorite["layoutDetails"] != undefined && dashboardFavorite["layoutDetails"].zIndex != undefined){
			this.zIndexMap[dashboardFavorite["layoutDetails"]["zIndex"]] = dashboardId;
		}
	}
};

/**
 * apply the settings to dashboard
 * @param dashboardId
 */
GlobalFavoriteComponent.prototype.applyFavorite = function (dashboardId){
	var dashboardContentWindow;
	var dashboardFavorite;
	
	if(dashboardId != undefined){
		//get the dashboard content...
		dashboardContentWindow = dashboardController.getDashboardContentWindow(dashboardId);
		//get the favorite that need to be applied for the current dashboard  
		dashboardFavorite = this.favoriteDetails.dashboardFavorites[dashboardId];
		//apply the favorites 
		if(dashboardContentWindow != undefined){
			try{
				//don't apply application level if default favorite is available or favorite is Applied at least once
				if(getFavoriteDataCache().defaultFavorite[dashboardId] == null || dashboardContentWindow.getFavoriteComponent().isFavoriteApplied==false){
					//apply the favorite details...
					dashboardContentWindow.applyFavoriteDetails(dashboardFavorite,dashboardId, false, this.isApplicationLevel);					
				}
			}catch(e){
				console.log("Error ["+e.message+"] occurred while applying favorites on the window ["+dashboardId+"]");						
			}
		}
	}
};

/**
 * apply favorite for query window....
 * @param dashboardId
 */
GlobalFavoriteComponent.prototype.applyQueryFavorite = function (dashboardId){
	var dashboardContentWindow;
	var dashboardFavorite;
	
	if(dashboardId != undefined){
		//get the dashboard content window reference...
		dashboardContentWindow = dashboardController.getDashboardContentWindow(dashboardId);
		//get the favorite that need to be applied for the current dashboard  
		dashboardFavorite = this.favoriteDetails.dashboardFavorites[dashboardId];
		//apply the favorites 
		if(dashboardContentWindow != undefined){
			//get the layout details and the set the same.... 
			var queryWindowLayoutDetails = dashboardFavorite["queryWindowLayoutDetails"];
			
			if(queryWindowLayoutDetails != undefined){
				//apply settings to the child windows of the query window...
				this.applyQueryWindowChildrenLayout(queryWindowLayoutDetails);
				//create a schedule favorite with window preferences from the actual favorite object....
				var scheduleFavorite = this.deepclone(dashboardFavorite);
				scheduleFavorite.displayOptionSettings[DATA_TYPE_NETWORK] = undefined;
				//if the schedule favorite component is created and it don't ahve the default favorite 
				if(dashboardContentWindow.scheduleFavoriteComponent != undefined && dashboardContentWindow.scheduleFavoriteComponent.defaultfavorite == undefined){
					//then....apply the schedule favorite
					this.isScheduleTabFavoriteApplied = true;
					dashboardContentWindow.applyScheduleDisplayOptionsSettings(scheduleFavorite["displayOptionSettings"][DATA_TYPE_SCHEDULE] , true);
				}else if(dashboardContentWindow.scheduleFavoriteComponent == undefined ){
					//if the schedule component is not yet created...then 
					this.scheduleFavoriteDisplayOptionSettings = scheduleFavorite["displayOptionSettings"][DATA_TYPE_SCHEDULE];
				}
				
				//check for which tab is active ...
				var isNetworkQuery = queryWindowLayoutDetails["isNetworkTabActive"];
				if(isNetworkQuery){
					//switch the tab..accordingly
					dashboardContentWindow.tabSelectHandler(DATA_TYPE_NETWORK);
					//close the schedule windows if they are opened....
					dashboardContentWindow.clearScheduleWindowStates();
				}else {
					//else...switch the tab to schedule...
					dashboardContentWindow.tabSelectHandler(DATA_TYPE_SCHEDULE);	
				}
			}
		}
	}
};

/**
 * applying settings to the query window children,...
 * @param dashboardId
 */
GlobalFavoriteComponent.prototype.applyQueryWindowChildrenLayout = function (queryWindowLayoutDetails){
		//apply the favorites 
		if(queryWindowLayoutDetails != undefined){
				//applying the min/max settings for network query window only...as the min and mx settings for schedule is controled by some flags in the display settings
				this.applyQueryWindowMinMaxSettings(DASHBOARD_ID_QUERY, queryWindowLayoutDetails[DATA_TYPE_NETWORK], true);
				//apply the network window positions...
				this.applyQueryWindowChildPositions(DASHBOARD_ID_QUERY, queryWindowLayoutDetails[DATA_TYPE_NETWORK]);
				//apply the schedule window positions...
				this.applyQueryWindowChildPositions(DASHBOARD_ID_QUERY, queryWindowLayoutDetails[DATA_TYPE_SCHEDULE], true);				
		}
};

/**
 * 
 * @param dashboardId
 * @param subWindowFavoriteDetails
 * @param isOnlyPositions
 */
GlobalFavoriteComponent.prototype.applyQueryWindowChildPositions = function (dashboardId, subWindowFavoriteDetails, isOnlyPositions){
	if(subWindowFavoriteDetails != undefined){	
		//get the sub window favorite details...
		var qryWindowsKeys = Object.keys(subWindowFavoriteDetails);
		if(qryWindowsKeys){		
			//get the dashboard content window....
			var dashboardContentWindow = dashboardController.getDashboardContentWindow(dashboardId);
			var windowDetails;
			for(var i=0; i<qryWindowsKeys.length; i++){
				//get the window details (positions, width etc.,)
				windowDetails = subWindowFavoriteDetails[qryWindowsKeys[i]];
				//get the child window kendo object
				kendoWindow = dashboardContentWindow. $(qryWindowsKeys[i]).data("kendoWindow");
				kendoWindow.wrapper.css({
		    			"width": windowDetails.width,
		    			"top": windowDetails.top,
		    			"left":	windowDetails.left			
		    		});
				
			}
		}
	}
};

/**
 * settings for man / max and restore of the query sub windows...
 * @param dashboardId
 * @param subWindowFavoriteDetails
 * @param isOnlyPositions
 */
GlobalFavoriteComponent.prototype.applyQueryWindowMinMaxSettings = function (dashboardId, subWindowFavoriteDetails, isOnlyPositions){
	if(subWindowFavoriteDetails != undefined){			
		var qryWindowsKeys = Object.keys(subWindowFavoriteDetails);
		if(qryWindowsKeys){			
			var dashboardContentWindow = dashboardController.getDashboardContentWindow(dashboardId);
			var windowDetails;
			for(var i=0; i<qryWindowsKeys.length; i++){
				windowDetails = subWindowFavoriteDetails[qryWindowsKeys[i]];
				kendoWindow = dashboardContentWindow. $(qryWindowsKeys[i]).data("kendoWindow");
				
				if(windowDetails.isMinimized){
					//kendoWindow.wrapper.find(".k-i-minimize").trigger("click");
					kendoWindow.minimize();
				}
				if(windowDetails.isClosed){
					kendoWindow.close();
				}
				
				if((!windowDetails.isMinimized || windowDetails.isMinimized == undefined)  && (!windowDetails.isClosed || windowDetails.isClosed == undefined)){
					//kendoWindow.wrapper.find(".k-i-restore").trigger("click");
					kendoWindow.restore();
				}
			}
		}
	}
};

/**
 * clear application level favorite...
 */
GlobalFavoriteComponent.prototype.clearApplicationFavorite = function (){
	//restore the query window 
	dashboardController.restoreDashbordView(DASHBOARD_ID_QUERY,3,3,32,4,490,document.documentElement.clientHeight - 105 + "px");
	//clear query window favorite...
	this.clearQueryWindowFavorite();
	//restore the map viewer dashbaord
	dashboardController.restoreDashbordView(DASHBOARD_ID_MAP_VIEW,3,500,4,null,"63.5%","44.5%");
	//clear all the dashbaords contents except the query window....
	clearAll([DASHBOARD_ID_QUERY]);
	//do the needful..
	var dashboardIds=dashboardController.getDashboardIds();
	for(var i=0;i<dashboardIds.length;i++){
		if(dashboardIds[i]==DASHBOARD_ID_QUERY || dashboardIds[i]==DASHBOARD_ID_MAP_VIEW){
			dashboardController.openDashboard(dashboardIds[i]);
		}else{
			dashboardController.closeDashboard(dashboardIds[i]);
		}
		dashboardController.resetDashboard(dashboardIds[i]);
	}
};

/**
 * clears query window favorite details...
 */
GlobalFavoriteComponent.prototype.clearQueryWindowFavorite = function (){
	if(this.favoriteDetails != undefined){
		// get the dashbaord content...
		var dashboardContentWindow = dashboardController.getDashboardContentWindow(DASHBOARD_ID_QUERY);
		//switch the tab to networkkkk
		dashboardContentWindow.tabSelectHandler(DATA_TYPE_NETWORK);
		//clear the scheudle window layout settgins...
		dashboardContentWindow.clearLayoutSettings(this.favoriteDetails[DATA_TYPE_SCHEDULE], !this.favoriteDetails.isNetworkTabActive);
		//clear the network window layout settings...
		dashboardContentWindow.clearLayoutSettings(this.favoriteDetails[DATA_TYPE_NETWORK], this.favoriteDetails.isNetworkTabActive);
	}
};

/**
 * clears the network favorite and set the system level settings
 */
GlobalFavoriteComponent.prototype.clearNetworkFavorite = function (){
	if(this.favoriteDetails != undefined){
		var networkQryWindows = Object.keys(this.favoriteDetails[DATA_TYPE_NETWORK]);
		if(networkQryWindows){			
			var dashboardContentWindow = dashboardController.getDashboardContentWindow(DASHBOARD_ID_QUERY);
			//iterate overall the windows in the network query window and set the window level preferences
			for(var i=0; i<networkQryWindows.length; i++){
				dashboardController.setWindowLayoutPreferences(dashboardContentWindow.$(networkQryWindows[i]), this.favoriteDetails[DATA_TYPE_NETWORK][networkQryWindows[i]], true);
			}
		}
	}
};

/**
 * clear and reset to system level settings on schedule window 
 */
GlobalFavoriteComponent.prototype.resetScheduleQueryWindow = function (){
	if(this.favoriteDetails != undefined){
		var networkQryWindows = Object.keys(this.favoriteDetails[DATA_TYPE_NETWORK]);
		if(networkQryWindows){			
			var dashboardContentWindow = dashboardController.getDashboardContentWindow(DASHBOARD_ID_QUERY);
			for(var i=0; i<networkQryWindows.length; i++){
				dashboardController.setWindowLayoutPreferences(dashboardContentWindow.$(networkQryWindows[i]), this.favoriteDetails[DATA_TYPE_NETWORK][networkQryWindows[i]], true);
			}
		}
	}
};

GlobalFavoriteComponent.prototype.clearScheduleFavorite = function (){
	var dashboardContentWindow = dashboardController.getDashboardContentWindow(DASHBOARD_ID_QUERY);
	if(dashboardContentWindow != undefined){
		dashboardContentWindow.resetDashboard();
	}
};

//deep cloning....
GlobalFavoriteComponent.prototype.deepclone = function(object) {
    if (object) {
    	 return $.extend(true, {}, object);
    }
    return null;
};


//returns the application level favorite component...
function getFavoriteComponent(favoriteId) {
	console.log(favoriteId);
	return applicationFavoriteComponent;
}

//returns the application level favorite details...
function getFavoriteDetails() {
	var favoriteDetails = {};
	try {
		favoriteDetails.dashboardFavorites = getDashboardsFavoriteDetails(true);
	} catch(e) {
		showErrorMsg("Error ["+e.message+"] occurred while getting the favorite details");
	}	
	return favoriteDetails; 
}

//applying the application level favorite details...
function applyFavoriteDetails(favoriteDetails) {
	try {
		if(favoriteDetails) {
			if(globalFavoriteComponent == undefined){
				globalFavoriteComponent = new GlobalFavoriteComponent(favoriteDetails, true, false);
			}else {
				globalFavoriteComponent = new GlobalFavoriteComponent(favoriteDetails, true, false);
			}
			globalFavoriteComponent.applyGlobalFavorite();
		} 
	} catch(e) {
		showErrorMsg("Error ["+e.message+"] occurred while applying the favorite details");
	}
}

//clear appliction level favorite...
function clearFavoriteDetails() {
	clearApplicationFavorite();
}
