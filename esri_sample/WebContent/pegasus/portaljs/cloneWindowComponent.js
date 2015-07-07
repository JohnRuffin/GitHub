/**
 * Entry point for clonning the window and setting up
 * @param cloneWindowFavorite
 * @returns {CloneWindowComponent}
 */
function CloneWindowComponent(cloneWindowFavorite) {
    this.cloneWindowFavorite = cloneWindowFavorite;
    this.cloneWindowFavoriteDetails = cloneWindowFavorite.favoriteDetails;
    this.isCloned = isCloned();
    this.checkDashboardLayoutInitializeHandler;
    this.cloneScheduleFavoriteApplied = false;
}

/**
 * applying clone favorite....
 */
CloneWindowComponent.prototype.applyCloneFavorite = function() {
	//applying header favorite....
    this.cloneHeaderFavorite();
    //applying favorite settings to all dashbaords
    this.cloneDashboards();
};

/**
 * update the pegasus header 
 */
CloneWindowComponent.prototype.manualHeaderFavorite = function() {
    if (this.cloneWindowFavorite) {
        $('#planCmb').data("kendoComboBox").value(this.cloneWindowFavorite.commonCaseId);
        $('#planCmb').data("kendoComboBox").trigger("change");
        lastSelectedSchedule = this.cloneWindowFavorite.scheduleId;
        changeWindowTitle(getCommonCaseLabel());
    }
};

/**
 * update the pegasus header 
 */
CloneWindowComponent.prototype.cloneHeaderFavorite = function() {
    if (this.cloneWindowFavorite) {
        $('#planCmb').data("kendoComboBox").value(this.cloneWindowFavorite.commonCaseId);
        
        lastSelectedSchedule = this.cloneWindowFavorite.scheduleId;
        changeWindowTitle(getCommonCaseLabel());
    }
};

/**
 * clonning the dashboards...
 * 
 */
CloneWindowComponent.prototype.cloneDashboards = function() {
	var cloneWindowComponent = this;
	//check for validating whether we are having the clone favorite that need to apply
    if (this.cloneWindowFavorite != undefined) {
    	//create the initial layout....
        this.createLayout();
        //repeater -- checks whether all the dashboards are initialized or not...
        this.checkDashboardLayoutInitializeHandler = setInterval(function() { 
        	 if (cloneWindowComponent.allDashboardsInitialized()) { /// if so...then
        		 // kill / clear the repeater
        		 window.clearInterval(cloneWindowComponent.checkDashboardLayoutInitializeHandler);
        		 //set the favorites to all opened dashboards 
        		 cloneWindowComponent.setFavorites();
        		 //execute the favorites....
        		 cloneWindowComponent.executeFavorites();	
             }
        }, 1500);
    }
};

/**
 * checks whether all the dashbaords are initialized or not...
 * @returns {Boolean}
 */
CloneWindowComponent.prototype.allDashboardsInitialized = function() {
	//get all the open dashboards...
    var dashboardIds = this.getOpenDashboardKeys();
    var isAppLoaded = true;
    if (dashboardIds) {
        for (var i = 0; i < dashboardIds.length; i++) {
        	if(typeof parent.isAdvanceQuery == "function" && !parent.isAdvanceQuery()){
        		if(!QueryCacheManager.getInstance().isCacheInitialized()){
        			return false;
        		}
        		if(dashboardIds[i] != DASHBOARD_ID_MAP_VIEW && dashboardIds[i] != DASHBOARD_ID_SCHEMATIC_VIEW ){
        			if (!dashboardController.isDashboardInitialized(dashboardIds[i])) {
                        return false;
                    }
        		}else{
        			//check whether the dashboards is initialized.....or not...
                    if (!(dashboardController.isDashboardInitialized(DASHBOARD_ID_MAP_VIEW) || dashboardController.isDashboardInitialized(DASHBOARD_ID_SCHEMATIC_VIEW))) {
                    	return false;
                    }
        		}	
        	}else{
        		//check whether the dashboards is initialized.....or not...
                if (!dashboardController.isDashboardInitialized(dashboardIds[i])) {
                    return false;
                }	
        	}
        }
    }

    return isAppLoaded;
};

/**
 * returns an array of open dashboards...
 * @returns {Array}
 */
CloneWindowComponent.prototype.getOpenDashboardKeys = function() {
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
 * create layout.....initial layout definition....
 */
CloneWindowComponent.prototype.createLayout = function() {
    var dashboardKeys;
    var favoriteDetails;
    var zIndexMap = {};
    var allFavoriteDetails = this.cloneWindowFavoriteDetails;
    if (allFavoriteDetails) {
//        var dashboardContentWindow;
//        var dashboardKey;
        //dashboardKeys contains all the window Id's in the container  
        dashboardKeys = Object.keys(allFavoriteDetails.dashboardFavorites);
        for (var i = 0; i < dashboardKeys.length; i++) {
        	// get the favorite details for the dashbaord...
            favoriteDetails = allFavoriteDetails.dashboardFavorites[dashboardKeys[i]];
            //get the content window.....
            dashboardContentWindow = dashboardController.getDashboardContentWindow(dashboardKeys[i]);
            //set the initial settings for window
            dashboardController.setLayoutDetails(dashboardKeys[i], favoriteDetails, null, true);
            //if its a query window....
            if (dashboardKeys[i] == DASHBOARD_ID_QUERY) { // yes..it is..
                //set the query window layout preferences 
                if (favoriteDetails["queryWindowLayoutDetails"]) { //get the query window children layout definition....
                    setQueryWindowLayoutDetails(dashboardKeys[i], favoriteDetails["queryWindowLayoutDetails"]); //apply the query window layout definition...
                }
            }
            //push the z-index order....
            if (favoriteDetails["layoutDetails"] && favoriteDetails["layoutDetails"].zIndex) {
                zIndexMap[favoriteDetails["layoutDetails"]["zIndex"]] = dashboardKeys[i];
            }
        }
        //stack the windows by order...
        dashboardController.orderByZIndex(zIndexMap);
    }
};

/**
 * set the favorite....to available dashbaords...
 */
CloneWindowComponent.prototype.setFavorites = function() {
    var dashboardKeys;
//    var favoriteDetails;
    var allFavoriteDetails = this.cloneWindowFavoriteDetails;
    if (allFavoriteDetails) {
        //dashboardKeys contains all the window Id's in the container  
        dashboardKeys = Object.keys(allFavoriteDetails.dashboardFavorites);
        for (var i = 0; i < dashboardKeys.length; i++) {
        	//set the favorite...to the dashbaord....
            this.setFavorite(dashboardKeys[i], false);
        }
    }
};

/**
 * set the favorite... 
 * @param dashboardId
 * @param isQueryWindowExecuted
 */
CloneWindowComponent.prototype.setFavorite = function(dashboardId, isQueryWindowExecuted) {
    if (dashboardId) {
        var queryWindowLayoutDetails;
        var dashboardContentWindow = dashboardController.getDashboardContentWindow(dashboardId);
        var favoriteDetails = this.cloneWindowFavoriteDetails.dashboardFavorites[dashboardId];
        //if its a query window....
        if (dashboardId == DASHBOARD_ID_QUERY && (!isQueryWindowExecuted && isQueryWindowExecuted != undefined)) {
            //get the query window layout preferences  
            queryWindowLayoutDetails = favoriteDetails["queryWindowLayoutDetails"];
            var isNetworkQuery = queryWindowLayoutDetails["isNetworkTabActive"];
            if (isCloned()) { //and cloned....
                // then apply the favorite....
                dashboardContentWindow.applyFavoriteDetails(favoriteDetails,dashboardId, false, true);
                if(dashboardContentWindow.scheduleFavoriteComponent != undefined){
                	this.isCloneScheduleFavoriteApplied = true;
                }
            	if(isNetworkQuery){
                	 dashboardContentWindow.clearScheduleWindowStates();
                }                
            }
        }else if (dashboardId == "applicationFav" || dashboardId == "networkQueryFav" || dashboardId == "scheduleQueryFav") { 
        	 if (favoriteDetails) { //get the query window children layout definition....
                 SQW.setWindowLayoutDetails(dashboardId, favoriteDetails); //apply the scheduleQuery window layout definition...
             }
        }else{
        	//apply the favorites 
            if (dashboardContentWindow) { //get the content window for that dashboard...
                try {
                    dashboardKey = getDashBoardKey(dashboardId);
                    dashboardContentWindow.applyFavoriteDetails(favoriteDetails,dashboardId, false, true);
                } catch (e) {
                    console.log("Error [" + e.message + "] occurred while applying favorites on the window [" + dashboardId + "]");
                }
            }
        }
    }

};

/**
 * execute the favorite...
 */
CloneWindowComponent.prototype.executeFavorites = function() {
	if(typeof parent.isAdvanceQuery == "function" && !parent.isAdvanceQuery()){
		commonViewer.runQuery(true);
	}else {	
	    var dashboardKeys = this.getDashboardKeys();
	    if (dashboardKeys) {
	        for (var i = 0; i < dashboardKeys.length; i++) {
	        	//calling execution....in progress
	            this.executeFavorite(this.cloneWindowFavoriteDetails.dashboardFavorites[dashboardKeys[i]], dashboardKeys[i]);
	        }
	    }
	}    
};

/**
 * execute favorite...in operation....
 * @param favorite
 * @param dashboardId
 */
CloneWindowComponent.prototype.executeFavorite = function(favorite, dashboardId) {
	if(dashboardId == undefined || dashboardId == ""){
		return;
	}
	var cloneWindowComponent = this;
	var dashboardContentWindow = dashboardController.getDashboardContentWindow(dashboardId);
	//check whether its an query window....
    if (dashboardId == DASHBOARD_ID_QUERY) {
    	//get the query window...layout...
        var queryWindowLayout = favorite["queryWindowLayoutDetails"];
        //check for active tab...
        var isNetworkTabActive = queryWindowLayout["isNetworkTabActive"];
        
        if (favorite["networkDashboardLoadStatus"] ) { // as network dashbaord had comepleted loading and ready to take favorite....
        	 dashboardContentWindow .tabSelectHandler(DATA_TYPE_NETWORK);
        	//trigger run query...
        	 dashboardContentWindow .runQuery(true); //runQuery();
        }
        
        if(favorite["networkDashboardLoadStatus"]){
        	cloneWindowComponent.checkDashboardLayoutInitializeHandler = setInterval(function() { 
            	 if (isDataLoadedFor(DASHBOARD_ID_QUERY, DATA_TYPE_NETWORK)) { /// if so...then            		 
            		 // kill / clear the repeater
            		 window.clearInterval(cloneWindowComponent.checkDashboardLayoutInitializeHandler);
            		 if(favorite["scheduleDashboardLoadStatus"]){
            			 dashboardContentWindow .tabSelectHandler(DATA_TYPE_SCHEDULE);
                		 dashboardContentWindow .runQuery(true); //runQuery();
            		 }
                 }
            }, 1500);
        }else if (favorite["scheduleDashboardLoadStatus"] ) {
        	dashboardContentWindow .tabSelectHandler(DATA_TYPE_SCHEDULE);
        	//-do--
        	dashboardContentWindow .runQuery(true); //runQuery();
        }
        
        var tabSwitchHandler = setInterval(function() {
        	if (((favorite["networkDashboardLoadStatus"] && isDataLoadedFor(DASHBOARD_ID_QUERY, DATA_TYPE_NETWORK))  || !favorite["networkDashboardLoadStatus"])
        			&& ((favorite["scheduleDashboardLoadStatus"] && (isDataLoadedFor(DASHBOARD_ID_QUERY, DATA_TYPE_SCHEDULE)
        			|| isDataLoadedFor(DASHBOARD_ID_QUERY, DATA_TYPE_NETWORK_SCHEDULE))) || !favorite["scheduleDashboardLoadStatus"])) { /// if so...then   
        		window.clearInterval(tabSwitchHandler);
        		if(isNetworkTabActive ){
                	dashboardContentWindow .tabSelectHandler(DATA_TYPE_NETWORK);
                }
        		if(!isNetworkTabActive ){
                	dashboardContentWindow .tabSelectHandler(DATA_TYPE_SCHEDULE);
                }
        	}
        }, 1000);
        
        
        
    } else if(dashboardId == DASHBOARD_ID_MAP_VIEW || dashboardId == DASHBOARD_ID_SCHEMATIC_VIEW){
    	if(dashboardContentWindow != undefined){
    		dashboardContentWindow.toggleDirectionAndViewHandler(favorite["headerButtonSettings"]);
    	}
    }

};


CloneWindowComponent.prototype.getDashboardKeys = function() {
    return Object.keys(this.cloneWindowFavoriteDetails.dashboardFavorites);
};