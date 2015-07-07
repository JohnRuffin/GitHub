/**
 * @author 888608
 */
var BROWSER_SESSION_ID;
var headerErrorMsgWin;
var dashboardController;
var cloneWindowController;
var isScheduleMatrixInit;//FDX-1286 WIP: initialize WIP with other tabs 
var VIEWER_ID = "simpleQuery";

var DASHBOARD_ID_QUERY = "queryWindowDiv";
var DASHBOARD_ID_MAP_VIEW = "mapViewDiv";
var DASHBOARD_ID_SCHEMATIC_VIEW = "schematicViewDiv";
var DASHBOARD_ID_FILTERS = "filterViewPopUpDiv";
var DASHBOARD_ID_ITRS = "trackRouteDiv";
//var DASHBOARD_TITLE_ROUTE_EDITOR = "Route Editor";
/*//kendo grid constants
var DASHBOARD_ID_NETWORK_MATRIX = "networkMatrixDiv";
var DASHBOARD_ID_SCHEDULE_MATRIX = "scheduleMatrixDiv";
var DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX = "networkscheduleMatrixDiv";
var DASHBOARD_ID_NETWORK_SUMMARY_MATRIX = "networkSummaryMatrixDiv";
var DASHBOARD_ID_ALLOCATION_MATRIX = "scheduleLocAllocMatrixDiv";
var DASHBOARD_ID_VOLUME_UTILIZATION_MATRIX = "schedulevolUtilizationMatrixDiv";*/

/*//tree grid constants
var DASHBOARD_ID_NETWORK_MATRIX_TREE_GRID = "networkMatrixTreeGridDiv";
var DASHBOARD_ID_SCHEDULE_MATRIX_TREE_GRID = "scheduleMatrixTreeGridDiv";
var DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX_TREE_GRID = "networkscheduleMatrixTreeGridDiv";
var DASHBOARD_ID_NETWORK_SUMMARY_MATRIX_TREE_GRID = "networkSummaryMatrixTreeGridDiv";
var DASHBOARD_ID_ALLOCATION_MATRIX_TREE_GRID = "scheduleLocAllocMatrixTreeGridDiv";*/


//mode analysis constants
var DASHBOARD_ID_MODE_ANALYSIS = "modeAnalysisViewDiv";
var DASHBOARD_ID_MAP_MODE_ANALYSIS = "mapModeAnalysisViewDiv";
var DASHBOARD_ID_MATRIX_ROUTE_EDITOR = "scheduleMatrixRouteEditorDiv";
var DASHBOARD_ID_SCHEDULE_MATRIX_WIP = "scheduleWIPMatrixDiv";
var DASHBOARD_ID_INTERNAL_COMMENTS = "internalCommentsDiv";
var DASHBOARD_ID_REVISION_COMMENTS = "revisionComentsDiv";
//tree grid container constant
var PARAM_TREE_GRID = "Container";

//tree grid constants
var DASHBOARD_ID_NETWORK_MATRIX = "networkMatrixTreeGridDiv";
var DASHBOARD_ID_SCHEDULE_MATRIX = "scheduleMatrixTreeGridDiv";
var DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX = "networkscheduleMatrixTreeGridDiv";
var DASHBOARD_ID_NETWORK_SUMMARY_MATRIX = "networkSummaryMatrixTreeGridDiv";
var DASHBOARD_ID_ALLOCATION_MATRIX = "scheduleLocAllocMatrixTreeGridDiv";
var DASHBOARD_ID_VOLUME_UTILIZATION_TREE_GRID_MATRIX = "volumeUtilizationTreeGridMatrix";

//data type constants
var DATA_TYPE_NETWORK = "Network";
var DATA_TYPE_NETWORK_SCHEDULE = "NetworkSchedule";
var DATA_TYPE_SCHEDULE = "Schedule";
var DATA_TYPE_SCHEDULE_UPDATE = "ScheduleUpdateRequest";
var DATA_TYPE_DEFAULT_VALUES = "DefaultValuesRequest";
var DATA_TYPE_SAVE_UPDATE_VALUES = "ScheduleUpdateRequest";

// Validation Service
var DATA_TYPE_MANAGER_VALUES = "ManagerRequest";
var DATA_TYPE_CARRIER_VALUES = "CarrierTypeRequest";
var DATA_TYPE_EQUIP_VALUES = "EquipTypeRequest";
var DATA_TYPE_LEG_VALUES = "LegTypeRequest";
var DATA_TYPE_LOCATION_VALUES = "LocationRequest";
var DATA_TYPE_PROD_GRP_VALUES = "ProductGroupRequest";
var DATA_TYPE_ROUTE_REASON_VALUES = "RouteReasonRequest";
var DATA_TYPE_ROUTE_TYPE_VALUES = "RouteTypeRequest";
var DATA_TYPE_SCAC_CD_VALUES = "ScacCodeRequest";
var DATA_TYPE_TRAIL_OPT_VALUES = "TrailerOptionRequest";
var DATA_TYPE_TRAIL_TYPE_VALUES = "TrailerTypeRequest";

var DATA_TYPE_LOCATION_ALLOCATION = "LocationAllocation";
var DATA_TYPE_VOLUME_UTILIZATION_TREE_GRID_SCHEDULE = "VolumeUtilizationSchedule";
var DATA_TYPES_ALL = [DATA_TYPE_NETWORK, DATA_TYPE_NETWORK_SCHEDULE, DATA_TYPE_SCHEDULE];

var ERROR_MESSAGE_SERVICE_ERROR = "Service error: ";

var PROGRESS_DIALOG_INITIALIZING = "Initializing...";
var queryDataLoadStatus = {};
var isNetworkQuery = true;
var isNetworkScheduleDataAvailable = false;
var availableDays = {};
var availableDaysSearchCriterias = {};
var dashboardSelectedDays = {};
var legTypeMap = {};
var legTypeDataStatusMap = {};
var equipmentTypeMap = {};
var equipmentTypeDataStatusMap = {};
var isCloneWindowInitialized = false;
var isAtleastOneSyncOn = false;
var isRunQuery = false;
var isByRouteQuery = true;
var searchPopUpMap = new Object();
var selectedRouteList = [];
var selectedLegList = [];
var selectedSeasonLegList = [];
var selectedWIPLegList;
var selectedWIPRouteList;
var selectedWIPSeasonLegList = [];
var finalLegMasterInfo;
var routeMasterInfo;
var oldEquipType;
var OPERATION_CD_ADD = "Insert";
var OPERATION_CD_MODIFY = "Modify";
var OPERATION_CD_DELETE = "Deleted";
var OPERATION_CD_NOCHANGE = "Read";
var OPERATION_FROM_DRAWER = "fromDrawer";
var OPERATION_FROM_MATRIX = "fromMatrix";
var OPERATION_FROM_MATRIX_SAVE = "fromMatrixSave";
var COMMENT_SEPERATOR = "-";
var FIELD_SEPARATOR = "<0x03>"
var revisionsUpdateMap = {};
var isDelete = false;

var isAddleg = false;
var isAddRoute = false;
var isheaderNeedtoCose= false;
var currentSelectedRouteComment;
var selectedDetails;
var initialRouteList = [];
var initialLegList = [];
var initialWIPRouteList = [];
var initialWIPLegList = [];
var revisionInterCommentButton;
var selectedCheckBox ;
var grid_id;
var isContextMode = false;
var queryWindowLayoutDetails = {
    "details": {
        "isNetworkTabActive": true,
        "Network": {
            "#generalWindow": {
                "height": "65px",
                "width": "268px",
                "top": "4px",
                "left": "4px",
                "isOpen": true
            },
            "#preActivitiesWindow": {
                "height": "113px",
                "width": "465px",
                "top": "90px",
                "left": "4px",
                "isOpen": true
            },
            "#priActivitiesWindow": {
                "height": "221px",
                "width": "465px",
                "top": "225px",
                "left": "4px",
                "isOpen": true
            },
            "#nxtActivitiesWindow": {
                "height": "113px",
                "width": "465px",
                "top": "480px",
                "left": "4px",
                "isOpen": true
            }
        },
        "Schedule": {
            "#routeWindow": {
                "height": "68px",
                "width": "465px",
                "top": "33px",
                "left": "4px",
                "isOpen": true
            },
            "#orgDestiWindow": {
                "height": "121px",
                "width": "465px",
                "top": "145px",
                "left": "4px",
                "isOpen": true
            },
            "#depArrActTimeWindow": {
                "height": "49px",
                "width": "465px",
                "top": "290px",
                "left": "4px",
                "isOpen": true
            },
            "#typesWindow": {
                "height": "176px",
                "width": "465px",
                "top": "364px",
                "left": "4px",
                "isOpen": true
            },
            "#modeWindow": {
                "height": "103px",
                "width": "465px",
                "top": "565px",
                "left": "4px",
                "isOpen": true
            }
        }
    }
};

function getBrowserSessionId() {
    return BROWSER_SESSION_ID;
}
/**
 * get the clone id
 * @returns
 */

function getCloneId() {
    return IS_CLONE_WINDOW_ID;
}

function isCloneInitialized() {
    return (!isCloned() || isCloneWindowInitialized);
}

function isCloneScheduleFavoriteApplied() {
    if (cloneWindowComponent != undefined) {
        return cloneWindowComponent.cloneScheduleFavoriteApplied;
    }
    return true;
}

function resetCloneId() {
    IS_CLONE_WINDOW_ID = "";
}
/**
 * returns whether the window is cloned or not./..
 * @returns {Boolean}
 */

function isCloned() {
    return IS_CLONE_WINDOW_ID != "";
}

/**
 * get the clone favorite object
 * @returns
 */

function getClonedWindowFavorite() {
    if (isCloned()) {
        return cloneWindowFavorite;
    }
    return null;
}

/**
 * clonning in progress.....
 */

function cloneLoadHandler() {
    //kill/clear the repeated interval checker ...as all the dashboards are initialized....
    if (cloneCallbackHandler) {
        window.clearInterval(cloneCallbackHandler);
    }
    cloneWindowController.applyCloneFavorite();
}

function initializeViewer(viewerId) {
    VIEWER_ID = viewerId;
    createBrowserSession();
    multiSelectComponent();
    capturCtrlR($(window));
    createFilterComponents();
}

function capturCtrlR(windowobj) {
    windowobj.keydown(function(event) {
        if (event.ctrlKey && event.keyCode == 82) {
//            console.log("Hey! Ctrl+R event captured!");
            getDashboardContentWindow(DASHBOARD_ID_QUERY).runQuery();
            event.preventDefault();
        }
    });
}

function initializeViewerComponents() {
    addDashboardConfigurations();
    populateDashboardsList();
}

function populateDashboardsList() {
    var dashboardIds = dashboardController.getAllDashboardIds();
    if (dashboardIds) {
        var dashboardConfiguration;
        var items = dashboardDatasource[0].items;
        for (var i = 0; i < dashboardIds.length; i++) {
            dashboardConfiguration = dashboardController.getDashboardConfiguration(dashboardIds[i]);
            if (!dashboardConfiguration.isRuntime) {
                items.push({
                    text: dashboardConfiguration.title,
                    value: dashboardIds[i]
                });
            }
        }
    }
    createorRefreshDashboardMenu();
}

function addDashboardConfigurations() {
    if (dashboardController == undefined) {
        //var bodyWidth = document.body.clientWidth - 20 ;
        //var bodyHeight = document.documentElement.clientHeight - 70;
        var screenWidth = window.screen.availWidth - 20;
        var screenHeight = window.screen.availHeight - 165;

        var queryDashboardWidth = 490;
        var otherDashboardsWidth = screenWidth - queryDashboardWidth;

        var queryDashboardHeight = (screenHeight - 155) > 705 ? 705 : (screenHeight - 155);
        var mapDashboardHeight = (screenHeight - 20) * 0.52 - 5;
        var otherDashboardsHeight = screenHeight - mapDashboardHeight - 58;
        dashboardController = new DashboardController(screenWidth, screenHeight);
        //map view dashboard
        dashboardController.addDashboardConfiguration(DASHBOARD_ID_MAP_VIEW, 'Map View', 3, 4, null, 500, otherDashboardsWidth, mapDashboardHeight, "icon-window-map", "mapViewer.do?" + simpleQueryUri, true, false, true);
        //schematic view dashboard
        dashboardController.addDashboardConfiguration(DASHBOARD_ID_SCHEMATIC_VIEW, 'Schematic View', 100, 50, 100, 600, otherDashboardsWidth - 200, mapDashboardHeight + 100, "window-header-schematic", "schematicViewer.do?" + simpleQueryUri, true, false, true);

        // added for ITRS -tc
        var itrsHeight = 555;
        var itrsWidth = 705;
        dashboardController.addDashboardConfiguration(DASHBOARD_ID_ITRS, 'ITRS View', 
            0, 0, null, window.innerWidth - itrsWidth, itrsWidth, itrsHeight, "icon-window-itrs", 
            "itrs.do?" + simpleQueryUri, true);        
    }
    var simpleQueryUri = "isSimpleQuery=false";
    if (isAdvanceQuery()) {

        //query dashboard                                                 Id, Title, top, right, bottom, left, width, height
        dashboardController.addDashboardConfiguration(DASHBOARD_ID_QUERY, 'Query', 3, null, 32, 4, queryDashboardWidth, queryDashboardHeight, "window-header-query", "queryWindow.do?" + simpleQueryUri, true);
        //map view dashboard
        dashboardController.addDashboardConfiguration(DASHBOARD_ID_MAP_VIEW, 'Map View', 3, 4, null, 500, otherDashboardsWidth, mapDashboardHeight, "icon-window-map", "mapViewer.do?" + simpleQueryUri, true);
        //schematic view dashboard
        dashboardController.addDashboardConfiguration(DASHBOARD_ID_SCHEMATIC_VIEW, 'Schematic View', 100, 50, 100, 600, otherDashboardsWidth - 200, mapDashboardHeight + 100, "window-header-schematic", "schematicViewer.do?" + simpleQueryUri, true);

        dashboardController.addDashboardConfiguration(DASHBOARD_ID_FILTERS, 'Filter', queryDashboardHeight + 36, null, null, 4, queryDashboardWidth, 100, "icon-window-filter", "", false);
    } else {
        simpleQueryUri = "isSimpleQuery=true";
    }

    addTreeGridDashboardConfigurations(simpleQueryUri, otherDashboardsWidth, otherDashboardsHeight);
}

function addKendoDashboardConfigurations(simpleQueryUri) {
/*
	//network summary matrix dashboard
    dashboardController.addDashboardConfiguration(DASHBOARD_ID_NETWORK_SUMMARY_MATRIX, 'Summary Network Matrix', "50%", 4, 32, 500, otherDashboardsWidth, otherDashboardsHeight, "window-header-table", "networkSummaryMatrix.do?" + simpleQueryUri, true);
    //network matrix dashboard
    dashboardController.addDashboardConfiguration(DASHBOARD_ID_NETWORK_MATRIX, 'Full Network Matrix', "50%", 4, 32, 500, otherDashboardsWidth, otherDashboardsHeight, "window-header-table", "networkMatrix.do?" + simpleQueryUri, true, true);
    //schedule matrix dashboard
    dashboardController.addDashboardConfiguration(DASHBOARD_ID_SCHEDULE_MATRIX, 'Schedule Matrix', "50%", 4, 32, 500, otherDashboardsWidth, otherDashboardsHeight, "window-header-table", "scheduleMatrix.do?" + simpleQueryUri, true);
    //network schedule matrix dashboard
    dashboardController.addDashboardConfiguration(DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX, 'Schedule Overlay Matrix', "50%", 4, 32, 500, otherDashboardsWidth, otherDashboardsHeight, "window-header-table", "scheduleMatrix.do?isNetworkSchedule=true&" + simpleQueryUri, true);

    //location allocations matrix dashboard
    dashboardController.addDashboardConfiguration(DASHBOARD_ID_ALLOCATION_MATRIX, 'Allocation Matrix', "50%", 4, 32, 500, otherDashboardsWidth, otherDashboardsHeight, "window-header-table", "locationAllocationMatrix.do?" + simpleQueryUri, true, true);
    //volume utilization matrix dashboard
    dashboardController.addDashboardConfiguration(DASHBOARD_ID_VOLUME_UTILIZATION_MATRIX, 'Volume Utilization Matrix', "50%", 4, 32, 500, otherDashboardsWidth, otherDashboardsHeight, "window-header-table", "volumeUtilizationMatrix.do?" + simpleQueryUri, true, true);

*/
}

function addTreeGridDashboardConfigurations(simpleQueryUri, otherDashboardsWidth, otherDashboardsHeight) {
    //network summary matrix dashboard
    dashboardController.addDashboardConfiguration(DASHBOARD_ID_NETWORK_SUMMARY_MATRIX, 'Network - Summary', "50%", 4, 32, 500, otherDashboardsWidth, otherDashboardsHeight, "window-header-table", "networkSummaryMatrixTreeGrid.do?" + simpleQueryUri, true);
    //network matrix dashboard
    dashboardController.addDashboardConfiguration(DASHBOARD_ID_NETWORK_MATRIX, 'Network - Detail', "50%", 4, 32, 500, otherDashboardsWidth, otherDashboardsHeight, "window-header-table", "networkMatrixTreeGrid.do?" + simpleQueryUri, true, true);
    //schedule matrix dashboard
    dashboardController.addDashboardConfiguration(DASHBOARD_ID_SCHEDULE_MATRIX, 'Schedule Matrix', "50%", 4, 32, 500, otherDashboardsWidth, otherDashboardsHeight, "window-header-table", "scheduleMatrixTreeGrid.do?" + simpleQueryUri, true);
    //network schedule matrix dashboard
    dashboardController.addDashboardConfiguration(DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX, 'Schedule Overlay Matrix', "50%", 4, 32, 500, otherDashboardsWidth, otherDashboardsHeight, "window-header-table", "scheduleMatrixTreeGrid.do?isNetworkSchedule=true&" + simpleQueryUri, true);
    //location allocations matrix tree grid dashboard
    dashboardController.addDashboardConfiguration(DASHBOARD_ID_ALLOCATION_MATRIX, 'Allocation Matrix', "50%", 4, 32, 500, otherDashboardsWidth, otherDashboardsHeight, "window-header-table", "locAllocMatrixTreeGrid.do?" + simpleQueryUri, true, true);
    //volume utilization Tree Grid matrix dashboard
    dashboardController.addDashboardConfiguration(DASHBOARD_ID_VOLUME_UTILIZATION_TREE_GRID_MATRIX, 'Volume Utilization Matrix', "50%", 4, 32, 500, otherDashboardsWidth, otherDashboardsHeight, "window-header-table", "volumeUtilizationTreeGridMatrix.do?" + simpleQueryUri, true);
    dashboardController.addDashboardConfiguration(DASHBOARD_ID_MODE_ANALYSIS, 'Mode Analysis', "50%", 4, 32, 500, otherDashboardsWidth, otherDashboardsHeight, "window-header-mode-analysis", "modeAnalysisViewer.do?" + simpleQueryUri, true);
    dashboardController.addDashboardConfiguration(DASHBOARD_ID_MAP_MODE_ANALYSIS, 'Map Mode Analysis', "50%", 4, 32, 500, otherDashboardsWidth, otherDashboardsHeight, "window-header-mode-analysis", "modeAnalysisViewer.do?isFetchLocations=true&" + simpleQueryUri, true);
//    dashboardController.addDashboardConfiguration(DASHBOARD_ID_MATRIX_ROUTE_EDITOR, DASHBOARD_TITLE_ROUTE_EDITOR, "50%", 4, 32, 500, otherDashboardsWidth, otherDashboardsHeight, "window-header-table", "scheduleMatrixRouteEditor.do?" + simpleQueryUri, true);
    dashboardController.addDashboardConfiguration(DASHBOARD_ID_SCHEDULE_MATRIX_WIP, 'Schedule Maintenance / WIP', "50%", 4, 32, 500, otherDashboardsWidth, otherDashboardsHeight, "window-header-table", "scheduleWIPMatrix.do?" + simpleQueryUri, true);
    dashboardController.addDashboardConfiguration(DASHBOARD_ID_INTERNAL_COMMENTS, 'Comments', "50%", 4, 32, 500, (otherDashboardsWidth), (otherDashboardsHeight+40), "window-header-table", "internalComments.do?" + simpleQueryUri, true,true,false,true);
    dashboardController.addDashboardConfiguration(DASHBOARD_ID_REVISION_COMMENTS, 'Revision  Notes For:', "50%", 4, 32, 500, (otherDashboardsWidth), (otherDashboardsHeight+40), "window-header-table", "revisionComments.do?" + simpleQueryUri, true,true,false,true);
    			
}

function getDashboardsOptionList() {
    var optionListStr = '';
    var dashboardIds = dashboardController.getAllDashboardIds();
    if (dashboardIds) {
        var dashboardConfiguration;

        for (var i = 0; i < dashboardIds.length; i++) {
            dashboardConfiguration = dashboardController.getDashboardConfiguration(dashboardIds[i]);
            if (!dashboardConfiguration.isRuntime) {
                optionListStr += '<option value="' + dashboardIds[i] + '">' + dashboardConfiguration.title + '</option>';
            }
        }
    }

    return optionListStr;
}


/**
 * 
 * @returns {___anonymous4457_4458}
 */

function getDashboardsFavoriteDetails(isApplicationLevel) {
    if (dashboardController) {
        var favoriteDetails = dashboardController.getAllDashboardFavoriteDetails(isApplicationLevel);
        return favoriteDetails;
    }
}

function getDashBoardKey(dashboardId) {
    if (dashboardId == DASHBOARD_ID_QUERY) {
        if (isNetworkQuery) {
            return DASHBOARD_ID_QUERY + "_Network";
        } else {
            return DASHBOARD_ID_QUERY + "_Schedule";
        }
    } else {
        return dashboardId;
    }
}
//method to clear the application favorite

function clearApplicationFavorite() {
    globalFavoriteComponent = new GlobalFavoriteComponent(queryWindowLayoutDetails["details"], false, true);
    globalFavoriteComponent.clearApplicationFavorite();
}
//method to apply the application favorite

function applyDefaultAppFavorite() {
    //changes for defect #387
    if (applicationFavoriteComponent != null && !applicationFavoriteComponent.isFavoriteApplied) {
        if (dashboardController.isAllDashboardLInitialized()) {
            applicationFavoriteComponent.applyDefaultFavorite();
        }
    }
}

/**
 * favoriteDetails["headerButtonSettings"] = getHeaderButtonSettings();
 * favoriteDetails["displayOptionSettings"] = getDisplayOptionSettings();
 * favoriteDetails["contentSettings"] = getContentFavoriteSettings();
 * favoriteDetails["layoutDetails"] = getLayoutDetails();
 * favoriteDetails["queryWindowLayoutDetails"] 
 */

/**
 * 
 * @param dashboardId
 * @param networkLayoutDetails
 */

function setQueryWindowChildrenLayoutDetails(dashboardId, networkLayoutDetails) {
    if (networkLayoutDetails) {
        var networkQryWindows = Object.keys(networkLayoutDetails);
        if (networkQryWindows) {
            var qryWindow;
            var dashboardContentWindow = dashboardController.getDashboardContentWindow(dashboardId);
            for (var i = 0; i < networkQryWindows.length; i++) {
                dashboardController.setWindowLayoutPreferences(dashboardContentWindow.$(networkQryWindows[i]), networkLayoutDetails[networkQryWindows[i]], true);
            }
        }
    }
};

/**
 * setting query window layout  pref's
 * @param dashboardId
 * @param queryWindowLayoutDetails
 */

function setQueryWindowLayoutDetails(dashboardId, queryWindowLayoutDetails) {
    if (queryWindowLayoutDetails) {
        setQueryWindowChildrenLayoutDetails(dashboardId, queryWindowLayoutDetails["Network"]);
        setQueryWindowChildrenLayoutDetails(dashboardId, queryWindowLayoutDetails["Schedule"]);
        var isNetworkTabActive = queryWindowLayoutDetails["isNetworkTabActive"];
        var dashboardContentWindow = dashboardController.getDashboardContentWindow(dashboardId);
        if (isNetworkTabActive) {
            dashboardContentWindow.tabSelectHandler("Network");
        } else {
            dashboardContentWindow.tabSelectHandler("Schedule");
        }
    }
};

function openScheduleMatrixDashboard(dashboardId, isNetworkScheduleFlag) {
    openDashboard(dashboardId);
    var dashboardContentWindow = dashboardController.getDashboardContentWindow(dashboardId);
    if (dashboardContentWindow) {
        if (typeof dashboardContentWindow.setNetworkScheduleFlag == "function") {
            dashboardContentWindow.setNetworkScheduleFlag(isNetworkScheduleFlag);
            if (typeof dashboardContentWindow.refresh != 'undefined') {
                dashboardContentWindow.refresh();
            }
        }
    }
}

function openNetworkMatrixDashboard(dashboardId) {
    openDashboard(dashboardId);
    var dashboardContentWindow = dashboardController.getDashboardContentWindow(dashboardId);
    if (dashboardContentWindow) {
        if (typeof dashboardContentWindow.refresh != 'undefined') {
            dashboardContentWindow.refresh();
        }
    }
}

function addButtonsBar(dashboardId, buttonsDivObj) {
    VIEWER.addButtonsBar(dashboardId, buttonsDivObj);
}

function resetAllDashboardsNetworkDataStatus(flag) {
    isNetworkScheduleDataAvailable = false;
    resetNetworkDataStatus(flag);
    setAllDashboardsDataStatus(DATA_TYPE_NETWORK, flag);
    setAllDashboardsDataStatus(DATA_TYPE_NETWORK_SCHEDULE, flag);
}

function resetAllDashboardsScheduleDataStatus(flag) {
    resetScheduleDataStatus(flag);
    setAllDashboardsDataStatus(DATA_TYPE_SCHEDULE, flag);
}

function setAllDashboardsDataStatus(dataType, isDataLoaded) {
    dashboardController.setAllDashboardsDataStatus(dataType, isDataLoaded);
}

function setDashboardTitle(dashboardId, title) {
    dashboardController.setDashboardTitle(dashboardId, title);
}

function setDashboardDataStatus(dashboardId, dataType, isDataLoaded) {
    dashboardController.setDashboardDataStatus(dashboardId, dataType, isDataLoaded);
}

function setDashboardInitialized(dashboardId) {
    dashboardController.setDashboardInitialized(dashboardId);
}

function isDashboardInitialized(dashboardId) {
    return dashboardController.isDashboardInitialized(dashboardId);
}

function isDataLoadedFor(dashboardId, dataType) {
    return dashboardController.isDashboardDataLoaded(dashboardId, dataType);
}

function isDataLoaded(dataType) {
    if (queryDataLoadStatus[dataType] == undefined) {
        return false;
    }
    return queryDataLoadStatus[dataType];
}

function hasRunQuery() {
    if (isNetworkQuery) {
        return isDataLoaded(DATA_TYPE_NETWORK);
    }
    return isDataLoaded(DATA_TYPE_SCHEDULE);
}

function enableDragging(dashboardId, enableDragging) {
    return dashboardController.enableDragging(dashboardId, enableDragging);
}

function needToLoadData(dashboardId, isScheduleForNetworkFlag) {
    var dataType = DATA_TYPE_SCHEDULE;
    if (isNetworkQuery || isScheduleForNetworkFlag) {
        dataType = isScheduleForNetworkFlag ? DATA_TYPE_NETWORK_SCHEDULE : DATA_TYPE_NETWORK;
    }
    return isDataLoaded(dataType) && !isDataLoadedFor(dashboardId, dataType);
}





function resetOrApplyDefaultSettings() {
    if (isCloneInitialized()) {
        var dashboardIds = dashboardController.getAllDashboardIds();
        if (dashboardIds) {
            for (var i = 0; i < dashboardIds.length; i++) {
                try {
                    if (dashboardIds[i] == DASHBOARD_ID_QUERY) {
                        continue;
                    }

                    var dashboardContentWindow = dashboardController.getDashboardContentWindow(dashboardIds[i]);
                    if (dashboardContentWindow) {
                        if (dashboardContentWindow.favoriteComponent != undefined) {
                            if (dashboardContentWindow.favoriteComponent.defaultfavorite == undefined) {
                                dashboardContentWindow.favoriteComponent.resetFavoriteMenu();
                                dashboardContentWindow.resetDashboard(true, false, false);
                            } else {
                                dashboardContentWindow.favoriteComponent.applyDefaultFavorite();
                            }
                        }

                    }
                } catch (e) {
                    //console.log("Error ["+e.message+"] occurred onBeforeRunQuery for = ["+dashboardIds[i]+"]");
                    console.log("Error [" + e.message + "] occurred onBeforeRunQuery for = [" + dashboardIds[i] + "]");
                }
            }
        }
    }
}



function resetNetworkDataStatus(flag) {
    queryDataLoadStatus[DATA_TYPE_NETWORK] = flag;
    queryDataLoadStatus[DATA_TYPE_NETWORK_SCHEDULE] = flag;
}

function resetScheduleDataStatus(flag) {
    queryDataLoadStatus[DATA_TYPE_SCHEDULE] = flag;
}

function onQuerySuccess(dataType, isImplicitNetworkScheduleLoading) {
    queryDataLoadStatus[dataType] = true;
    var dashboardIds = dashboardController.getAllDashboardIds();
    if (dashboardIds) {
        for (var i = 0; i < dashboardIds.length; i++) {
            try {
                if (dashboardIds[i] == DASHBOARD_ID_QUERY) {
                    continue;
                }
                //call only if the dashboard is not minimized
                if (!dashboardController.isDashboardActive(dashboardIds[i])) {
                    continue;
                }
                var dashboardContentWindow = dashboardController.getDashboardContentWindow(dashboardIds[i]);
                if (dashboardContentWindow != undefined) {
                    if (dataType == DATA_TYPE_NETWORK) {
                        if (typeof dashboardContentWindow.onNetworkQuerySuccess == "function") {
                            dashboardContentWindow.onNetworkQuerySuccess(isImplicitNetworkScheduleLoading);
                        }
                    } else if (dataType == DATA_TYPE_NETWORK_SCHEDULE) {
                        if (typeof dashboardContentWindow.onNetworkScheduleQuerySuccess == "function") {
                            if (dashboardContentWindow.hasOwnProperty("isNetworkScheduleFlag") && dashboardIds[i] != DASHBOARD_ID_SCHEDULE_MATRIX) {
                                dashboardContentWindow.isNetworkScheduleFlag = true;
                            }
                            dashboardContentWindow.onNetworkScheduleQuerySuccess();
                        }
                    } else if (dataType == DATA_TYPE_SCHEDULE) {
                        if (typeof dashboardContentWindow.onScheduleQuerySuccess == "function") {
                            if (dashboardContentWindow.hasOwnProperty("isNetworkScheduleFlag") && dashboardIds[i] != DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX) {
                                dashboardContentWindow.isNetworkScheduleFlag = false;
                            }
                            dashboardContentWindow.onScheduleQuerySuccess();
                        }
                    }
                }
            } catch (e) {
                console.log("Error [" + e.message + "] occurred on" + dataType + "QuerySuccess for = [" + dashboardIds[i] + "]");
            }
        }
    }
}

function getDashboardTitle(dashboardId) {
    return dashboardController.getDashboardConfiguration(dashboardId).title;
}

function isDashboardActive(dashboardId) {
    return dashboardController.isDashboardActive(dashboardId);
}

function isDashboardClosed(dashboardId) {
    return dashboardController.isDashboardClosed(dashboardId);
}

function openDashboard(dashboardId, isRefreshDashboard) {
    VIEWER.openDashboard(dashboardId, isRefreshDashboard);
}

function setDashboardFocus(dashboardId) {
    dashboardController.acquireFocus(dashboardId);
}

function refreshDashboard(dashboardId) {
    dashboardController.refreshDashboard(dashboardId);
}

function toFront(dashboardId) {
    dashboardController.toFront(dashboardId);
}

function logoutEvent() {
    window.location.href = "logout.do";
}

function resetAvailableDays() {
    availableDays[DATA_TYPE_NETWORK] = [];
    availableDays[DATA_TYPE_NETWORK_SCHEDULE] = [];
    availableDays[DATA_TYPE_SCHEDULE] = [];
    dashboardSelectedDays = {};
}

function fetchAvailableDays(dataType, isImplicitNetworkScheduleLoading) {
    if (isCloneInitialized()) {
        dashboardSelectedDays[dataType] = {};
    }
    if (availableDaysSearchCriterias[dataType] == undefined) {
        availableDaysSearchCriterias[dataType] = new SearchCriteria();
    }
    availableDaysSearchCriterias[dataType].setCriteria(CRITERIA_BROWSER_SESSION_ID, getBrowserSessionId());

    var params = {};
    params.datatype = dataType;
    params.commonCaseId = getCommonCaseId();
    params.effDayPatternStr = getSelectedEffDayStrPattern();    
    params.searchcriteria = availableDaysSearchCriterias[dataType].getSearchCriteria();

    callService({
        url: DAYS_RENDER_DATA_URL,
        paramsMap: params,
        successCallback: function(response, io) {
/*if(!isAdvanceQuery()){
        		showProgressDialog(false);
        	}*/
            onFetchAvailableDaysSuccess(response, io, isImplicitNetworkScheduleLoading);
        },
        showProgressWindow: false
    });

}

function cloneDashboardHandler() {
    dashboardController.cloneDashboard();
}

function onSavedCloneDetailsResponseHandler(response, io, cloneId) {
    if (typeof isAdvancedQueryModule == "function" && !isAdvancedQueryModule()) {
        window.open("pegasusSimpleQueryViewer.do?isSimpleQuery=true&cloneId=" + cloneId, "_blank", "fullscreen=1, menubar=1");
    } else {
        window.open("pegasusViewer.do?isSimpleQuery=false&cloneId=" + cloneId, "_blank", "fullscreen=1, menubar=1");
    }
}

function onFetchAvailableDaysSuccess(response, io, isImplicitNetworkScheduleLoading) {
    try {
        if (response && response._errorCd && response._errorCd > 0) {
            showFilterErrorMsg(response._errorDesc);
        } else {
            var dataType = response.dataType;
            availableDays[response.dataType] = response.days;
            onQuerySuccess(dataType, isImplicitNetworkScheduleLoading);
        }
        if (isCloned()) {
            isCloneWindowInitialized = true;
        }
    } catch (e) {
        console.log("Error = [" + e.message + "] occurred while fetching available days");
    }
}

function getDataType(isNetworkSchedule) {
    if (isNetworkQuery) {
        if (isNetworkSchedule) {
            return DATA_TYPE_NETWORK_SCHEDULE;
        }
        return DATA_TYPE_NETWORK;
    }

    return DATA_TYPE_SCHEDULE;
}

function getAvailableDays(dataType) {
    return availableDays[dataType];
}

function getFirstAvailableDay(dataType) {
    var firstDay;
    if (availableDays[dataType] != undefined) {
        firstDay = availableDays[dataType][0];
    }

    return firstDay;
}

function getFirstAvailableWeek(dataType) {
    var firstWkDays = [];
    if (availableDays[dataType] != undefined) {
        for (var i = 0; i < availableDays[dataType].length; i++) {
            var week = Math.ceil(availableDays[dataType][i] / 7);
            if (week == 1) {
                firstWkDays.push(availableDays[dataType][i]);
            }
        }
    }

    return firstWkDays.join();
}

/**
 * method checks whether the day(s) that are selected are in  available days..or not...
 * @param dataType   	flag indicating whether network / schedule / schedule overlay 
 * @param dayWhereClause	- day where clause 
 * @returns {Boolean}	-
 */

function isValidDayWhereClause(dataType, dayWhereClause) {
    var dayString;
    var daysArray;
    if (availableDays[dataType] != undefined && dayWhereClause != undefined) {
        //DAY in (18, 19, 20)
        //get the days 
        dayString = dayWhereClause.substring(dayWhereClause.indexOf("(") + 1, dayWhereClause.indexOf(")"));
        //split by comma
        daysArray = dayString.split(",");
        if (daysArray != undefined) {
            //iterate and validate whether the selected day is in available days for that plan
            for (var i = 0; i < daysArray.length; i++) {
                if (availableDays[dataType].indexOf(parseInt(daysArray[i])) >= 0) {
                    return true;
                }
            }
        }
        delete dayString;
        delete daysArray;
    }

    return false;
}

function getDashboardSelectedDays(dashboardId, dataType) {
    var selectedDays;
    if (dashboardSelectedDays[dataType]) {
        selectedDays = dashboardSelectedDays[dataType][dashboardId];
    }
    return selectedDays;
}

function getEffDaysStringFromSystemSetting(dataItem, effDays, applyForAllFlag) {
    var effDaysConfig = getEffDaysConfiguration();
    var effDaysArray;
    if (effDaysConfig != undefined) {
        effDaysArray = effDaysConfig.toString().split(",");
    }
    var effDaysStr = dataItem[effDays];

    if (effDaysArray != undefined && effDaysArray.toString() == "M,T,W,T,F,S,S") {
        return effDaysStr;
    }
    if (effDaysStr) {
        var dayStringArray = effDaysStr.split(" ");
        var dayStr = "";
        var applyTokenCount = 1;
        var appendStr = "";
        if (applyForAllFlag != undefined && applyForAllFlag) {
            applyTokenCount = dayStringArray.length;
        } else {
            appendStr = dayStringArray[1];
        }
        for (var count = 0; count < applyTokenCount; count++) {
            for (var i = 1; i < 8; i++) {
                if (dayStringArray[count] != undefined) {
                    if (dayStringArray[count].charAt(i - 1) != '-') {
                        dayStr += effDaysArray[i - 1];
                    } else {
                        dayStr += '-';
                    }
                }
            }
            dayStr += dayStringArray[count].substring(7) + ' ';
        }
        return dayStr + " " + appendStr;
    }
    return null;
}

function afterTabChangeHandler(isNetworkQuery) {
    if (isNetworkQuery) {
        toggleButton(false, "marketView", "icon-market-view-disable", "icon-market-view");
        highlightBtn(document.getElementById("marketView"), false);
        var isScheduleForNetworkFlag = dashboardController.getDashboardContentWindow(DASHBOARD_ID_MAP_VIEW).isScheduleForNetworkFlag;
        if (isScheduleForNetworkFlag) {
            toggleButton(true, "marketView", "icon-market-view-disable", "icon-market-view");
        }
    } else {

    }
}

function closeAllWindows() {
    dashboardController.closeDashboards(dashboardController.getAllDashboardIds());
    if (!isAdvanceQuery()) {
        $("#mainBody").removeClass("visibleDiv");
        $("#mainBody").addClass("invisibleDiv");
    }
}

function clearAll(isClearAll) {
    if (!isClearAll) {
        deleteOrDestroyBrowserSession("clearSessionDetails", function(response, io) {
            responseDeleteBrowserSessoinHandler(response, io);
            resetApplicatoin(isClearAll);
            resetFilterComponent();
            showProgressDialog(false);
        }, true);
    } else {
        resetApplicatoin(isClearAll);
    }
}

function resetApplicatoin(isClearAll) {
    if (isClearAll) {
        resetLegTypeData();
        resetAvailableDays();
    }

    isRunQuery = false;
    dashboardController.clearAllDashboards(isClearAll);

    if (isClearAll) {
        resetAllDashboardsNetworkDataStatus();
        resetAllDashboardsScheduleDataStatus();
    } else {
        if (isNetworkQuery) {
            resetAllDashboardsNetworkDataStatus();
        } else {
            resetAllDashboardsScheduleDataStatus();
        }
    }
}



function getEffDaysConfiguration() {
    return getEffDaysConfig();
}

function isDistanceInKmsFlag() {
    return isDistanceInKms();
}

function isWeightInKgsFlag() {
    return VIEWER.isWeightInKgsFlag();
}

function isLocalTimeFlag() {
    return isLocal();
}

function getProdGroupConfiguration() {
    return VIEWER.getProdGroupConfiguration();
}

function getProdGroupNames() {
    return VIEWER.getProdGroupNames();
}

function getPrimaryLocations() {
    return VIEWER.getPrimaryLocations();
}

function showFilterErrorMsg(msg) {
    showErrorMsg(msg);
    setTimeout(function() {
        showErrorMsg(EMPTY_STRING);
    }, 20000);
}

function createBrowserSession() {
    callService({
        url: getBrowserRendererUrl("createSession"),
        successCallback: responseCreateBrowserSessoinHandler,
        showProgressWindow: true,
        progressDialogTitle: PROGRESS_DIALOG_INITIALIZING
    });
}

function needsToDeleteOldSessionDetails() {
    return isDataLoaded(DATA_TYPE_NETWORK) || isDataLoaded(DATA_TYPE_NETWORK_SCHEDULE) || isDataLoaded(DATA_TYPE_SCHEDULE);
}

function deleteBrowserSessionDetails() {
    if (needsToDeleteOldSessionDetails()) {
        deleteOrDestroyBrowserSession("deleteSessionDetails", responseDeleteBrowserSessoinHandler, false);
    }
}

function destroyBrowserSession() {
    deleteOrDestroyBrowserSession("destroySession", responseLogoutBrowserSessoinHandler, false);
}

function deleteOrDestroyBrowserSession(deleteOperationType, callBackFunction, showProgressWindow) {
    var paramsMap = {
        "browserSessionId": BROWSER_SESSION_ID,
        "isNetworkQuery": isNetworkQuery
    };

    callService({
        url: getBrowserRendererUrl(deleteOperationType),
        paramsMap: paramsMap,
        successCallback: callBackFunction,
        showProgressWindow: showProgressWindow
    });
}

function isAdvanceQuery() {
    if (VIEWER_ID == "advanceQuery") {
        return true;
    }
    //else
    return false;
}

function responseCreateBrowserSessoinHandler(response, io) {
    showProgressDialog(false);
    if (response) {
        BROWSER_SESSION_ID = response.browserSessionId;
    }

    //initialize the header
    initializeHeader();
    //initialize viewer components
    initializeViewerComponents();

    //check whether the window is cloned or not... 
    if (isCloned()) { //yes ..window is cloned....
        //check whether all the dashboards are initialized in repeated intervals....
        cloneCallbackHandler = setInterval(function() {
            if (!cloneWindowController) {
                cloneWindowController = new CloneWindowComponent(getClonedWindowFavorite());
            }
            if (getCommonCaseId() == EMPTY_STRING) {
                cloneWindowController.manualHeaderFavorite();
            }
            //make sure that all the dasboards are initialized before clonning the dashboard.... 
            if (typeof parent.isAdvanceQuery == "function" && parent.isAdvanceQuery()) {
                //make sure that all the dasboards are initialized before clonning the dashboard.... 
                if (dashboardController && dashboardController.isAllDashboardLInitialized() && hasMapInitialized() && getCommonCaseId() != EMPTY_STRING) {
                    //clone trigger...
                    cloneLoadHandler();
                }
            } else {
                //make sure that all the dasboards are initialized before clonning the dashboard.... 
                //				if(dashboardController && dashboardController.isAllDashboardLInitialized() && hasMapInitialized() && getCommonCaseId() != EMPTY_STRING ){
                //clone trigger...
                if (QueryCacheManager != null && QueryCacheManager.getInstance().isCacheInitialized() && getCommonCaseId() != EMPTY_STRING) {
                    cloneLoadHandler();
                }
            }
        }, 1500);
    } else { //if window is not cloned...
        cloneCallbackHandler = setInterval(function() { ///then after repeated interval checking....
            if (dashboardController && dashboardController.isAllDashboardLInitialized() && hasMapInitialized()) {
                //apply the default application favorite....
                if (applicationFavoriteComponent != null && !applicationFavoriteComponent.isFavoriteApplied) applyDefaultAppFavorite();
                if (cloneCallbackHandler) {
                    window.clearInterval(cloneCallbackHandler);
                }
            }
        }, 1500);
    }
}

function responseDeleteBrowserSessoinHandler(response, io) {
    if (response) {
        BROWSER_SESSION_ID = response.browserSessionId;
    }
}

function responseLogoutBrowserSessoinHandler(response, io) {
    parent.invalidateSession();
}

function setHeaderErrorMsg(errorMessage) {
    if (errorMessage) {
        showErrorMsg(errorMessage);
    }
    showProgressDialog(false);
}

function showErrorMsg(msg, msgType) {
    headerErrorMsgWin = $('#headerErrorDiv');
    if (!headerErrorMsgWin.data("kendoWindow")) {
        headerErrorMsgWin.kendoWindow({
            height: "28px",
            width: "700px",
            draggable: false,
            modal: false,
            resizable: false,
            actions: ["close"],
            title: msg
        });
    }
    var msgTypeClass; 
    
    switch(msgType){
    case "S":
    	msgTypeClass = "success-msg-header";
    	break;
    default: 
    	msgTypeClass = "error-msg-header";
    }
  
    if (msg == EMPTY_STRING) {
        headerErrorMsgWin.data("kendoWindow").close();
    } else {
        headerErrorMsgWin.data("kendoWindow").wrapper[0].className = "k-widget k-window "+msgTypeClass;
        headerErrorMsgWin.data("kendoWindow").title(msg);
        headerErrorMsgWin.data("kendoWindow").open();
        headerErrorMsgWin.parent().attr("title", msg);
        headerErrorMsgWin.parent().find("span.k-window-title").html(msg);
        headerErrorMsgWin.parent().css({
            "padding-top": "0px"

        });
        headerErrorMsgWin.parent().find(".k-window").css({
            "className": "sat"
        });
        headerErrorMsgWin.parent().find('.k-header').css({
            "height": "18px",
            "margin-top": "0px",
            "border": "none",
            "margin-top": "1px",
            "color": "red"
        });
        headerErrorMsgWin.parent().find('.k-window-title').css({
            "text-align": "center",
            "position": "absolute"
        });

        headerErrorMsgWin.parent().find('.k-window-content').css({
            "min-height": "0px",
            "display": "none"
        });
    }
}

function closeHeaderMsgWin() {
    if (headerErrorMsgWin && headerErrorMsgWin.data("kendoWindow")) {
        headerErrorMsgWin.data("kendoWindow").close();
    }
}

/**
 * returns the layer id w.r.t the view/mode the user exists
 * @param isScheduleForNetworkFlag
 * @returns {String}
 */

function getMatrixId(isScheduleForNetworkFlag) {
    if (isNetworkQuery) {
        if (isScheduleForNetworkFlag) {
            return DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX;
        }

        return DASHBOARD_ID_NETWORK_MATRIX;
    } else {
        return DASHBOARD_ID_SCHEDULE_MATRIX;
    }
}

function enableSync(btn, dashboardId, syncDashboardIds, secondBtnClassName, isSyncDashboardIdsString, isRunQuery) {
    VIEWER.enableSync(btn, dashboardId, syncDashboardIds, secondBtnClassName, isSyncDashboardIdsString, isRunQuery);
}

function toggleButton(isDisabled, btnId, disabledClass, activeClassName) {
    if (isDisabled) {
        $('#' + btnId).find("." + disabledClass).addClass(activeClassName);
        if (($('#' + btnId).find("." + disabledClass)[0]) != null) {
            $('#' + btnId).find("." + disabledClass)[0].title = "Turn market view on";
        }
        $('#' + btnId).find("." + disabledClass).removeClass(disabledClass);
    } else {
        $('#marketView').find("." + activeClassName).addClass(disabledClass);
        if (($('#marketView').find("." + activeClassName)[0]) != null) {
            $('#marketView').find("." + activeClassName)[0].title = "Market view is not available";
        }
        $('#marketView').find("." + activeClassName).removeClass(activeClassName);
    }
}



function triggerPrintMap() {
    getDashboardContentWindow(DASHBOARD_ID_MAP_VIEW).createPrintDijit();
}


function hasMapInitialized() {
    var mapviewContentWindow = getDashboardContentWindow(DASHBOARD_ID_MAP_VIEW);
    if (mapviewContentWindow != undefined && (typeof mapviewContentWindow.hasMapInitialized == "function")) {
        var isInitialized = mapviewContentWindow.hasMapInitialized();
        if (isInitialized != undefined) {
            return isInitialized;
        }
    }
    return false;
}


function highlightBtn(btn, highlight) {
    if (btn != undefined) {
        if (!highlight) {
            btn.className = "iconbtn n-icon";
            btn.isHighlighted = false;
        } else {
            btn.className = "iconbtn iconbtn-active n-icon-active";
            btn.isHighlighted = true;
        }
    }
}

function isBtnHighlighted(btnId) {
    var button = document.getElementById(btnId);
    if (button != undefined) {
        if (button.className != undefined && button.className.indexOf("iconbtn iconbtn-active n-icon-active") >= 0) {
            return true;
        }
    }
    return false;
}

function setLocalZuluButtonState(btnName) {
    var btn = $('#' + btnName)[0];
    btn.toggled = isLocalTimeFlag();
    toggleTimeView(btn);
}

function toggleTimeView(btn, isLocalZuluButtonDisabled, viewerDashboardId) {
    VIEWER.toggleTimeView(btn, isLocalZuluButtonDisabled, viewerDashboardId);
}

function onServiceRequestFailure(response, io) {
    var errorMessage;
    var showProgressDialog = false;
    if (response) {
        if (response && response._errorCd && response._errorCd > 0) {
            errorMessage = ERROR_MESSAGE_SERVICE_ERROR + response._errorDesc;
        } else if (io) {
            errorMessage = io;
            if (io == "parsererror") {
                var responseText = response.responseText;
                if (responseText.indexOf("<html") >= 0 && responseText.indexOf("wsso") >= 0) {
                    window.location = "ssoLoginAction.do";
                    return false;
                } else if (responseText.indexOf("<html") >= 0 && responseText.indexOf("/loginAction.do") >= 0) {
                    window.location = "ssoLoginAction.do";
                    return false;
                }
            }
            if (io == "error" && response.status != 200) {
                if (response.statusText == "Bad Gateway") {
                    log(errorMessage + " Bad Gateway ...received");
                    //call the renderer
                    if (response.dataType == undefined) {
                        errorMessage = response.statusText;
                    } else {
                        checkServiceResponseStatus(response.successCallback, response.dataType);
                        return false;
                    }
                } else {
                    errorMessage = response.statusText;
                }
            }
        }
    }

    try {
        showProgressDialog(false);
    } catch (er) {
/*if(er.message =="boolean is not a function"){
			window.location = "ssoLoginAction.do";
			return false;
		}*/
    }

    if (errorMessage) {
        setHeaderErrorMsg(errorMessage);
        return true;
    }

    return false;
}

function checkServiceResponseStatus(successCallBack, dataType) {
    log("Data type [" + dataType + "]");
    var params = {};
    params.datatype = dataType;
    params.browserSessionId = getBrowserSessionId();
    params.isLoggerActive = false;
    callService({
        url: SERVICE_RESPOSNE_STATUS_RENDER_URL,
        paramsMap: params,
        successCallback: function(response, io) {
            if (!isAdvanceQuery()) {
                showProgressDialog(false);
            }
            serviceResponseStatusHandler(response, io, successCallBack, dataType);
        },
        showProgressWindow: !isAdvanceQuery() ? true : false
    });
}

function serviceResponseStatusHandler(response, io, successCallBack, dataType) {
    if (response != undefined && response.status != undefined) {
        log("Service Response [" + response.status + "]");
        if (response.status == RESPOSNE_LOADING) {
            //read if the status is loading then call the same renderer after 30 secs
            setTimeout(function() {
                checkServiceResponseStatus(successCallBack, dataType);
            }, 60000);

        } else if (response.status == RESPOSNE_LOADED) {
            //if the status is loaded, call the success method
            successCallBack(response, io);
        } else if (response.status == RESPOSNE_ERROR) {
            showProgressDialog(false);
            //if the status is error, show the error message
            setHeaderErrorMsg(response.errorMessage);

        }
    } else {
        showProgressDialog(false);
    }
}

function setSelectedDays(calBtn, selectedDays, keyObject) {
    if (selectedDays == EMPTY_STRING) {
        calBtn.isNoDaySelected = true;
        showErrorMsg("Please select at least one day on the calendar");
        return true;
    } else {
        showErrorMsg(EMPTY_STRING);
        calBtn.isNoDaySelected = false;
    }
    if (!(calBtn && calBtn.lastSelectedDays && calBtn.lastSelectedDays == selectedDays) && selectedDays != EMPTY_STRING) {
        if (!dashboardSelectedDays[keyObject.dataType]) {
            dashboardSelectedDays[keyObject.dataType] = {};
        }
        dashboardSelectedDays[keyObject.dataType][keyObject.dashboardId] = selectedDays;
        setDashboardDataStatus(keyObject.dashboardId, keyObject.dataType, false);
        getDashboardContentWindow(keyObject.dashboardId).onDaySelect(selectedDays, keyObject.dataType);
    }
}

function setDashboardSelectedDays(dashboardId, dataType, selectedDays) {
    if (dashboardSelectedDays[dataType] == undefined) {
        dashboardSelectedDays[dataType] = {};
    }
    dashboardSelectedDays[dataType][dashboardId] = selectedDays;
}

function getDashboardContentWindow(dashboardId) {
    return dashboardController.getDashboardContentWindow(dashboardId);
}

function getDashboardIframe(dashboardId) {
    return dashboardController.getDashboardIframe(dashboardId);
}

function getDashboardWidth(dashboardId) {
    return getDashboardIframe(dashboardId).clientWidth;
}

function getDashboardHeight(dashboardId) {
    return getDashboardIframe(dashboardId).clientHeight;
}

function isLegTypeDataLoaded() {
    return VIEWER.isLegTypeDataLoaded();
}

function setLegTypeData(data) {
    return VIEWER.setLegTypeData(data);
}

function resetLegTypeData() {
    return VIEWER.resetLegTypeData();
}

function getLegTypeData(isScheduleForNetworkFlag) {
    return VIEWER.getLegTypeData(isScheduleForNetworkFlag);
}

function isEquipmentTypeDataLoaded() {
    return VIEWER.isEquipmentTypeDataLoaded();
}

function setEquipmentTypeData(data) {
    return VIEWER.setEquipmentTypeData(data);
}

function resetEquipmentTypeData() {
    return VIEWER.resetEquipmentTypeData();
}

function getEquipmentTypeData(isScheduleForNetworkFlag) {
    return VIEWER.getEquipmentTypeData(isScheduleForNetworkFlag);
}

function changeMapBackgroundColor(color) {
    $("#" + DASHBOARD_ID_MAP_VIEW).css({
        "background": color
    });
}

function getButtonObject(buttonId) {
    if (buttonId != undefined) {
        return document.getElementById(buttonId);
    }
    return undefined;
}
/**
 * method that set the additional simple query window settings
 * @param params
 */

function setSQWParameters(params) {
    if (!isAdvanceQuery()) {
        var conveyanceModes = SQW.getScheduleFilterModes();
        if (conveyanceModes != undefined) {
            if (conveyanceModes["truckStandard"] && !conveyanceModes["truckOversize"]) {
                params.truckCapacityType = "S";
            } else if (!conveyanceModes["truckStandard"] && conveyanceModes["truckOversize"]) {
                params.truckCapacityType = "O";
            }
        }
    }
}
var scheduleForNetworkFlagInSync = {};

function setIsScheduleForNetworkFlagInSync(dashboardId, flag) {
    scheduleForNetworkFlagInSync[dashboardId] = flag;
}

function getIsScheduleForNetworkFlagInSync(dashboardId) {
    return scheduleForNetworkFlagInSync[dashboardId];
}

function openSelectLocDialog(uniqueId, title, locCd, parentId, isUniqueObjects, flag, facilityType, parentObj, days) {
    closeSearchPops();
    if (!searchPopUpMap[uniqueId]) {
        var window = new SearchPopUp(uniqueId, {
            setApplyResponseHandler: setApplyResponseHandler,
            getApplyResponseHandler: getApplyResponseHandler
        });
        searchPopUpMap[uniqueId] = window;
    }
    searchPopUpMap[uniqueId].options.title = title;
    searchPopUpMap[uniqueId].options.nearByLoc = locCd;
    searchPopUpMap[uniqueId].options.parentId = parentId;
    searchPopUpMap[uniqueId].options.parentObj = parentObj;
    searchPopUpMap[uniqueId].options.isUniqueObjects = isUniqueObjects;
    searchPopUpMap[uniqueId].options.flag = flag;
    searchPopUpMap[uniqueId].options.facilityType = facilityType;
    searchPopUpMap[uniqueId].options.days = days;
    searchPopUpMap[uniqueId].openFilterPopUp();
}

function closeSearchPops() {
    if (typeof(searchPopUpMap) != undefined && searchPopUpMap != undefined) {
        var searchPopIds = Object.keys(searchPopUpMap); //get available matrixids
        for (var j = 0; j < searchPopIds.length; j++) {
            searchPopUpMap[searchPopIds[j]].ClearNClosePopup();
        }
    }
}

function setApplyResponseHandler(uniqueId, locations, options) {
    if (uniqueId == "flightLegTypes" || uniqueId == "truckLegTypes" || uniqueId == "flightEquipTypes" || uniqueId == "truckEquipTypes" || 
    		uniqueId == "flightLegTypesOverlay" || uniqueId == "truckLegTypesOverlay" || uniqueId == "flightEquipTypesOverlay" || uniqueId == "truckEquipTypesOverlay") {
        var datasource, typeCd, typeDesc;
        if (uniqueId == "flightLegTypes") {
            datasource = getLegTypeData(false)['F'];
            typeCd = "legTypeCd";
            typeDesc = "legTypeDesc";
        } else if (uniqueId == "truckLegTypes") {
            datasource = getLegTypeData(false)['T'];
            typeCd = "legTypeCd";
            typeDesc = "legTypeDesc";
        } else if (uniqueId == "flightEquipTypes") {
            datasource = getEquipmentTypeData(false)['F'];
            typeCd = "eqType";
            typeDesc = "eqTypeDesc";
        } else if (uniqueId == "truckEquipTypes") {
            datasource = getEquipmentTypeData(false)['T'];
            typeCd = "eqType";
            typeDesc = "eqTypeDesc";
        } else if (uniqueId == "flightLegTypesOverlay") {
            datasource = getLegTypeData(true)['F'];
            typeCd = "legTypeCd";
            typeDesc = "legTypeDesc";
        } else if (uniqueId == "truckLegTypesOverlay") {
            datasource = getLegTypeData(true)['T'];
            typeCd = "legTypeCd";
            typeDesc = "legTypeDesc";
        } else if (uniqueId == "flightEquipTypesOverlay") {
            datasource = getEquipmentTypeData(true)['F'];
            typeCd = "eqType";
            typeDesc = "eqTypeDesc";
        } else if (uniqueId == "truckEquipTypesOverlay") {
            datasource = getEquipmentTypeData(true)['T'];
            typeCd = "eqType";
            typeDesc = "eqTypeDesc";
        }
        var typeObj;
        var descString = "";
        for (var i = 0; i < locations.length; i++) {
            typeObj = $.grep(datasource, function(e) {
                return e[typeCd] == locations[i];
            });
            if (typeObj && typeObj.length > 0) {
                descString = descString + typeObj[0][typeCd] + "-" + typeObj[0][typeDesc];
                if (i < locations.length - 1) {
                    descString = descString + ", ";
                }
            }
        }
        $("#" + uniqueId).text(locations.toString());
        $("#" + uniqueId).attr("title", descString);
        if (locations && locations.length > 0) {
            $("#" + options.parentId)[0].checked = true;
        } else {
            $("#" + options.parentId)[0].checked = false;
        }
        filterElementClickHandler();
    } else if (uniqueId == "selectLocations") {
        var mapView = getDashboardContentWindow(DASHBOARD_ID_MAP_VIEW);
        if (mapView != undefined && mapView.ESRIHelper.getEsriZoomManager() != undefined) {
            if (mapView.ESRIHelper.getEsriZoomManager().showNearBy != undefined && mapView.ESRIHelper.getEsriZoomManager().showNearBy) {
                mapView.ESRIHelper.getEsriZoomManager().userAddedLocsArr = locations.concat(mapView.ESRIHelper.getEsriZoomManager().userAddedNearByLocsArr);
            } else {
                mapView.ESRIHelper.getEsriZoomManager().userAddedLocsArr = locations;
            }
        }
        manageLocationSelectionHandler(mapView.ESRIHelper.getEsriZoomManager().userAddedLocsArr);
        delete mapView;
        return;
    } else if (options.parentId == "selectLocations" && uniqueId == "showNearBy") {
        var mapView = getDashboardContentWindow(DASHBOARD_ID_MAP_VIEW);
        if (mapView != undefined && mapView.ESRIHelper.getEsriZoomManager() != undefined) {
            mapView.ESRIHelper.getEsriZoomManager().showNearBy = true;
            mapView.ESRIHelper.getEsriZoomManager().userAddedNearByLocsArr = locations; //.concat(mapView.ESRIHelper.getEsriZoomManager().userAddedLocsArr);

        }
        //manageLocationSelectionHandler(locations);
        delete mapView;
        return;
    } else if(uniqueId == "caseTypes") {
    	setPlanDropDowndata(locations);
    	$("#" + uniqueId).val(locations.toString());
        $("#" + uniqueId).attr("title", locations.toString());
    }
    if (locations && locations.length > 0) {
        if ((options.parentId == undefined || (options.parentId != undefined && options.parentId != "selectLocations")) && getDashboardContentWindow(DASHBOARD_ID_QUERY) != null) {
            if (isNetworkQuery) {
                getDashboardContentWindow(DASHBOARD_ID_QUERY).setNetworkInputLocations(uniqueId, locations, options);
            } else {
                getDashboardContentWindow(DASHBOARD_ID_QUERY).setScheduleInputLocations(uniqueId, locations, options);
            }
        }
    }
    if (uniqueId == "scheduleMaintenanceRouteType" && locations[0] != null) { 
    	setScheduleMaintenananceSelectedMenu(locations[0]);
    	openSelectedDashboard(locations[0]);
    }
    
    if (uniqueId == "skdMxMapRouteType" && locations[0] != null) { 
    	setScheduleMaintenananceSelectedMenu(locations[0]);
    	getDashboardContentWindow(DASHBOARD_ID_MAP_VIEW).routeTypeSelectHandler();
    }
}

function manageLocationSelectionHandler(locations) {
    $.each(locations, function(key, value) {
        if (value != undefined) {
            VIEWER.setVisibleAndHighlight(true, value);
        }
    });

    getDashboardContentWindow(DASHBOARD_ID_MAP_VIEW).ESRIHelper.getEsriZoomManager().validateHighlightedGraphicsNow(locations);
    if (locations == undefined || locations.length <= 0) {
        getDashboardContentWindow(DASHBOARD_ID_MAP_VIEW).contextManager.clearHighlightedGraphics();
    }
}

function getApplyResponseHandler(uniqueId) {
    if (uniqueId == "flightLegTypes" || uniqueId == "truckLegTypes" || uniqueId == "flightEquipTypes" || uniqueId == "truckEquipTypes" 
    	|| uniqueId == "flightLegTypesOverlay" || uniqueId == "truckLegTypesOverlay" || uniqueId == "flightEquipTypesOverlay" ||
    	uniqueId == "truckEquipTypesOverlay" || uniqueId == "scheduleMaintenanceRouteType" || uniqueId == "skdMxMapRouteType") {
        return $("#" + uniqueId).text();
    } else if (uniqueId == "selectLocations") {
        //the comma separted list from the userAddedlocationcache
        if (getDashboardContentWindow(DASHBOARD_ID_MAP_VIEW) != undefined && getDashboardContentWindow(DASHBOARD_ID_MAP_VIEW).ESRIHelper.getEsriZoomManager() != undefined) {
            return getDashboardContentWindow(DASHBOARD_ID_MAP_VIEW).ESRIHelper.getEsriZoomManager().userAddedLocsArr;
        }
    }else if(uniqueId == "caseTypes") {
    	return $("#" + uniqueId).val();
    }
    if (isNetworkQuery) {
        if (uniqueId == "productsTextArea" || uniqueId == "productGroupsTextArea") {
            return getDashboardContentWindow(DASHBOARD_ID_QUERY).$("#" + uniqueId).val();
        }
        return "";
    } else {
        return getDashboardContentWindow(DASHBOARD_ID_QUERY).getScheduleInputLocations(uniqueId);
    }
}

function openFilterPopUpWindow() {
    //resetFilterComponent();
    var win = dashboardController.getDashboard(DASHBOARD_ID_FILTERS);
    if (win == null || (!win.isClosed && !win.isMinimized)) {
        dashboardController.openDashboard(DASHBOARD_ID_FILTERS);
    }
}

function createFilterComponents() {
    var multiComboObj = $("#showModes");
    if (multiComboObj.data("kendoMultiSelectBox") == null) {
        multiComboObj.kendoMultiSelectBox({
            dataTextField: 'label',
            dataValueField: 'value',
            dataSource: getFilterModes(),
            showSelectAll: false,
            emptySelectionLabel: "",
            preSummaryCount: 10,
            selectionChanged: filterElementClickHandler
        });
        multiComboObj.data("kendoMultiSelectBox").list.addClass("dropDownWidth");
    }
}

function resetFilterComponent() {
    $("#ntwFilterDirectionBothRadio").prop("checked", true);
    $("#connErrorCombo").val('None');
    $("#showModes").data("kendoMultiSelectBox").unselectAll();
    $("#showModes").data("kendoMultiSelectBox")._select(0);
    $("#showModes").data("kendoMultiSelectBox")._select(1);
    $("#showModes").data("kendoMultiSelectBox")._select(2);
    $("#showModes").data("kendoMultiSelectBox")._select(3);
    $("#showModes").data("kendoMultiSelectBox")._select(4);
    $("#showModes").data("kendoMultiSelectBox")._select(5);
    $("#scheduleFlightChk").prop("checked", true);
    $("#scheduleTruckChk").prop("checked", true);
    $("#scheduleFlightCombo").val("All");
    $("#scheduleFilterModeTruckCombo").val("All");
    $("#schdllegtypeFlyChk").prop("checked", false);
    $("#schdllegtypeTruckChk").prop("checked", false);
    $("#flightLegTypes").text("");
    $("#truckLegTypes").text("");
    $("#schdlequiptypeFlyChk").prop("checked", false);
    $("#schdlequiptypeTruckChk").prop("checked", false);
    $("#flightEquipTypes").text("");
    $("#truckEquipTypes").text("");

    $("#scheduleOverlayFlightChk").prop("checked", true);
    $("#scheduleOverlayTruckChk").prop("checked", true);
    $("#scheduleOverlayFlightCombo").val("All");
    $("#scheduleOverlayFilterModeTruckCombo").val("All");
    $("#schdllegtypeOverlayFlyChk").prop("checked", false);
    $("#schdllegtypeOverlayTruckChk").prop("checked", false);
    $("#flightLegTypesOverlay").text("");
    $("#truckLegTypesOverlay").text("");
    $("#schdlequiptypeOverlayFlyChk").prop("checked", false);
    $("#schdlequiptypeOverlayTruckChk").prop("checked", false);
    $("#flightEquipTypesOverlay").text("");
    $("#truckEquipTypesOverlay").text("");
}

function filterElementClickHandler(event) {
    dashboardController.getDashboardContentWindow(DASHBOARD_ID_MAP_VIEW).applyDisplaySettings();
}

function filterToggleDirection(that) {
    dashboardController.getDashboardContentWindow(DASHBOARD_ID_MAP_VIEW).toggleFilterDirection(that);
}

function switchFiters(isScheduleForNetworkFlag) {
    if (isNetworkQuery) {
        if (isScheduleForNetworkFlag) {
            $("#networkFilter").hide();
            $("#scheduleFilter").hide();
            $("#scheduleOverlayFilter").show();
        } else {
            $("#networkFilter").show();
            $("#scheduleFilter").hide();
            $("#scheduleOverlayFilter").hide();
        }
    } else {
        $("#networkFilter").hide();
        $("#scheduleFilter").show();
        $("#scheduleOverlayFilter").hide();
    }
}

function openLegTypesWindow(uniqueId, title, locCd, parentId, isUniqueObjects, btn) {
    var mapWin = dashboardController.getDashboardContentWindow(DASHBOARD_ID_MAP_VIEW);
    openSelectLocDialog(uniqueId, title, locCd, parentId, isUniqueObjects, mapWin.isScheduleForNetworkFlag, null, btn);
}

function validateDropDownOnCheckbox(chkBoxObj, comboBoxId) {
    if (chkBoxObj.checked) {
        document.getElementById(comboBoxId).removeAttribute("disabled");
    } else {
        document.getElementById(comboBoxId).setAttribute("disabled", "disabled");
    }
}

setInterval(function() {
    callService({
        url: LoggerUtils.loggerDataUrl,
        paramsMap: {
            data: '[{"logger":"[anonymous]","timestamp":' + getTime() + ',"level":"INFO","message":"HeartBeat Service...... ping"}]',
            browserSessionId: getBrowserSessionId()
        },
        successCallback: function(response, io) {
            console.log("session extended");
        },
        failureCallback: function(response, io) {

        },
        showProgressWindow: false
    });
}, 60000);

var VIEWER = function() {

    };

VIEWER.onBeforeRunQuery = function() {
    if (isNetworkQuery) {
        isNetworkScheduleDataAvailable = false;
        availableDays[DATA_TYPE_NETWORK] = [];
        availableDays[DATA_TYPE_NETWORK_SCHEDULE] = [];
        legTypeMap[DATA_TYPE_NETWORK_SCHEDULE] = {};
        equipmentTypeMap[DATA_TYPE_NETWORK_SCHEDULE] = {};
        legTypeDataStatusMap[DATA_TYPE_NETWORK_SCHEDULE] = false;
        equipmentTypeDataStatusMap[DATA_TYPE_NETWORK_SCHEDULE] = false;
        dashboardSelectedDays[DATA_TYPE_NETWORK] = {};
        dashboardSelectedDays[DATA_TYPE_NETWORK_SCHEDULE] = {};
    } else {
        availableDays[DATA_TYPE_SCHEDULE] = [];
        legTypeMap[DATA_TYPE_SCHEDULE] = {};
        equipmentTypeMap[DATA_TYPE_SCHEDULE] = {};
        legTypeDataStatusMap[DATA_TYPE_SCHEDULE] = false;
        equipmentTypeDataStatusMap[DATA_TYPE_SCHEDULE] = false;
        dashboardSelectedDays[DATA_TYPE_SCHEDULE] = {};
    }
    isRunQuery = true;
    var dashboardIds = dashboardController.getAllDashboardIds();
    if (dashboardIds) {
        for (var i = 0; i < dashboardIds.length; i++) {
            try {
                if (dashboardIds[i] == DASHBOARD_ID_QUERY || dashboardIds[i] == DASHBOARD_ID_MODE_ANALYSIS) {
                    continue;
                }

                var dashboardContentWindow = dashboardController.getDashboardContentWindow(dashboardIds[i]);
                if (dashboardContentWindow) {
                    dashboardContentWindow.onBeforeRunQuery(dashboardIds[i]);
                    if (isNetworkQuery) {
                        if (dashboardIds[i] == DASHBOARD_ID_SCHEDULE_MATRIX) {
                            continue;
                        }
                    } else {
                        if (dashboardIds[i] == DASHBOARD_ID_NETWORK_MATRIX || dashboardIds[i] == DASHBOARD_ID_NETWORK_MATRIX || dashboardIds[i] == DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX || dashboardIds[i] == DASHBOARD_ID_MAP_MODE_ANALYSIS) {
                            continue;
                        }
                    }
                    if (dashboardContentWindow.favoriteComponent != undefined) {
                        if (dashboardContentWindow.favoriteComponent.defaultfavorite == undefined) {
                            dashboardContentWindow.favoriteComponent.resetFavoriteMenu();
                            dashboardContentWindow.resetDashboard(true, false, false);
                        } else {
                            dashboardContentWindow.favoriteComponent.applyDefaultFavorite(false);
                        }
                    }

                }
            } catch (e) {
                //console.log("Error ["+e.message+"] occurred onBeforeRunQuery for = ["+dashboardIds[i]+"]");
                console.log("Error [" + e.message + "] occurred onBeforeRunQuery for = [" + dashboardIds[i] + "]");
            }
        }
    }
};

VIEWER.onNetworkQuerySuccess = function() {
    onBeforeNetworkQuerySuccess();
    fetchAvailableDays(DATA_TYPE_NETWORK);
    openFilterPopUpWindow();
};

function onBeforeNetworkQuerySuccess() {
    if (!parent.isAdvanceQuery()) {
        if (isFullRoutingQuery && isNetworkQuery) {
            $("#summarymatrixLink").removeAttr("onclick");
            $("#summarymatrixLink").addClass("ui-state-disabled");
        } else {
            $("#summarymatrixLink").attr("onclick", "SQW.openDashboard(DASHBOARD_ID_NETWORK_SUMMARY_MATRIX)");
            $("#summarymatrixLink").removeClass("ui-state-disabled");
        }
    } else {
        if (parent.isAdvanceQuery()) {
            var items = $("#winsCmbDiv").find(".k-link:contains(Network Summary Tree Grid)").parent();
            var menu = $("#winsCmbDiv").data("kendoMenu");
            if (VIEWER.getIsFullRouting() && isNetworkQuery) {
                menu.enable(items, false);
            } else {
                menu.enable(items, true);
            }
        }
    }
}


VIEWER.onNetworkScheduleQuerySuccess = function(isImplicitLoading) {
    if (isImplicitLoading) {
        fetchAvailableDays(DATA_TYPE_NETWORK, isImplicitLoading);
    } else {
        isNetworkScheduleDataAvailable = true;
        fetchAvailableDays(DATA_TYPE_NETWORK_SCHEDULE);
    }
};

VIEWER.onScheduleQuerySuccess = function() {
    fetchAvailableDays(DATA_TYPE_SCHEDULE);
    openFilterPopUpWindow();
};
VIEWER.onTabSelect = function(tabName) {
    //close all the runtime dashboards later
    isNetworkQuery = (tabName == DATA_TYPE_NETWORK || tabName == DATA_TYPE_NETWORK_SCHEDULE);
    try {
        //reset the mandatory dashboards
        var dashboardIds = dashboardController.getAllDashboardIds();
        var isScheduleForNetworkFlag = false;
        if (dashboardIds) {
            for (var i = 0; i < dashboardIds.length; i++) {
                try {
                    if (dashboardIds[i] == DASHBOARD_ID_QUERY) {
                        continue;
                    }
                    var dashboardContentWindow = dashboardController.getDashboardContentWindow(dashboardIds[i]);
                    if (dashboardContentWindow && (typeof dashboardContentWindow.onTabSelect == "function")) {
                        dashboardContentWindow.onTabSelect(tabName);
                    }
                    if (dashboardIds[i] == DASHBOARD_ID_MAP_VIEW) {
                        isScheduleForNetworkFlag = dashboardContentWindow.isScheduleForNetworkFlag;
                    }
                } catch (e) {
                    console.log("Error [" + e.message + "] occurred onTabSelect [" + dashboardIds[i] + "]");
                }
            }
        }
    } catch (e) {
        console.log("Error [" + e.message + "] occurred onTabSelect");
    }
    if (typeof parent.isAdvanceQuery == "function" && parent.isAdvanceQuery()) {
        afterTabChangeHandler(isNetworkQuery);
    }
    switchFiters(isScheduleForNetworkFlag);
};
VIEWER.onPlanChange = function() {
    clearAll(true);
    //close all the runtime dashboards later
    try {
        //reset the mandatory dashboards
        var dashboardIds = dashboardController.getAllDashboardIds();
        if (dashboardIds) {
            //			var iframe;
            for (var i = 0; i < dashboardIds.length; i++) {
                try {
                    var dashboardContentWindow = dashboardController.getDashboardContentWindow(dashboardIds[i]);
                    if (dashboardContentWindow) {
                        dashboardContentWindow.onPlanChange();
                    }
                } catch (e) {
                    console.log("Error [" + e.message + "] occurred onPlanChange [" + dashboardIds[i] + "]");
                }
            }
        }

        //open the query and map view dashboards after the plan is changed,
        //first time the windows will be created
        if (isAdvanceQuery()) {
            dashboardController.openDashboard(DASHBOARD_ID_QUERY);
            dashboardController.openDashboard(DASHBOARD_ID_MAP_VIEW);
            if(!isScheduleMatrixInit){
	            dashboardController.openDashboard(DASHBOARD_ID_SCHEDULE_MATRIX_WIP,true);
    	        dashboardController.closeDashboard(DASHBOARD_ID_SCHEDULE_MATRIX_WIP,true);
    	        dashboardController.openDashboard(DASHBOARD_ID_REVISION_COMMENTS,true);
    	        dashboardController.closeDashboard(DASHBOARD_ID_REVISION_COMMENTS,true);
    	        dashboardController.openDashboard(DASHBOARD_ID_INTERNAL_COMMENTS,true);
    	        dashboardController.closeDashboard(DASHBOARD_ID_INTERNAL_COMMENTS,true);
    	        isScheduleMatrixInit = true;
            }
        } else {
            $("#mainBody").removeClass("invisibleDiv");
            $("#mainBody").addClass("visibleDiv");
        }
    } catch (e) {
        console.log("Error [" + e.message + "] occurred onPlanChange");
    }

    //delete the current data from the in-memory tables
    deleteBrowserSessionDetails();
    $("#headercoverId").hide();
    disableIcon(false);
};
VIEWER.setIsScheduleForNetworkFlag = function(IsScheduleForNetworkFlag) {
    setIsScheduleForNetworkFlag(IsScheduleForNetworkFlag);
};
VIEWER.openDashboard = function(dashboardId, isRefreshDashboard) {
    dashboardController.openDashboard(dashboardId, isRefreshDashboard);
};
VIEWER.addButtonsBar = function(dashboardId, buttonsDivObj) {
    var dashboardWindow = dashboardController.getDashboard(dashboardId);
    if (dashboardWindow) {
        dashboardWindow.parent().find('.k-window-titlebar').append(buttonsDivObj);
        //resetting left of the dashboard header for clipping of icons 
        dashboardWindow.data("kendoWindow").wrapper.find(".window-header").css({
            left: dashboardController.getMinWidth(dashboardWindow, dashboardId, 15)
        });
        //resetting minWidth of the dashboard 
        dashboardWindow.closest(".k-window").css({
            minWidth: dashboardController.getMinWidth(dashboardWindow, dashboardId, 90)
        });
        buttonsDivObj.find("a.iconbtn").each(function(i) {
            $(this).dblclick(function(e) {
                dashboardController.enableResizable(false);
            });
        });
    }
};
VIEWER.toggleTimeView = function(btn, isLocalZuluButtonDisabled, viewerDashboardId) {
    if (isLocalZuluButtonDisabled != null && isLocalZuluButtonDisabled == true) {
        if (btn.toggled) {
            btn.children[0].className = "k-icon icon-toggle-local-disable";
        } else {
            btn.children[0].className = "k-icon icon-toggle-zulu-disable";
        }
        if (viewerDashboardId != null && viewerDashboardId != EMPTY_STRING) {
            $(btn).attr('onclick', EMPTY_STRING).unbind('click');
        }
    } else {
        if (btn.toggled) {
            btn.children[0].className = "k-icon icon-toggle-local";
            if (btn.children[1] != undefined) {
                btn.children[1].innerHTML = "Local";
            }
            btn.toggled = false;
        } else {
            btn.children[0].className = "k-icon icon-toggle-zulu";
            if (btn.children[1] != undefined) {
                btn.children[1].innerHTML = "Zulu";
            }

            btn.toggled = true;
        }
        if (viewerDashboardId != null && viewerDashboardId != EMPTY_STRING) {
            $(btn).attr('onclick', "getDashboardContentWindow('" + viewerDashboardId + "').toggleTimeView(this, '" + !btn.toggled + "')").bind('click');
        }
    }
};

VIEWER.getIsFullRouting = function() {
    if (typeof isAdvanceQuery == "function" && isAdvanceQuery()) {
        return parent.getDashboardContentWindow(parent.DASHBOARD_ID_QUERY).isFullRouting();
    } else {
        return SQW.isFullRoutingQuery();
    }
};

VIEWER.isWeightInKgsFlag = function() {
    return isWeightInKgs();
};
VIEWER.getProdGroupConfiguration = function() {
    return getProductGroupConfiguration();
};
VIEWER.getProdGroupNames = function() {
    return getProductGroupNames();
};
VIEWER.getPrimaryLocations = function() {
    if (typeof isAdvanceQuery == "function" && isAdvanceQuery()) {
        return getDashboardContentWindow(DASHBOARD_ID_QUERY).getPrimaryLocations();
    } else {
        return SQW.getPrimaryLocations();
    }
};

VIEWER.getAllNetworkLocations = function() {
    return getDashboardContentWindow(DASHBOARD_ID_QUERY).getAllNetworkLocations();
};

VIEWER.setPlacemarkHighlight = function(isHighlight, locId) {
    return getDashboardContentWindow(DASHBOARD_ID_MAP_VIEW).setPlacemarkHighlight(isHighlight, locId);
};

VIEWER.setVisibleAndHighlight = function(isHighlight, locId) {
    return getDashboardContentWindow(DASHBOARD_ID_MAP_VIEW).setVisibleAndHighlight(isHighlight, locId);
};


VIEWER.getAllScheduleLocations = function() {
    return getDashboardContentWindow(DASHBOARD_ID_QUERY).getAllScheduleLocations();
};

VIEWER.highlightGraphicChangeHandler = function(tabName) {
    var nwlocations = parent.VIEWER.getAllNetworkLocations();
    var schedLocations = parent.VIEWER.getAllScheduleLocations();
    switch (tabName) {
    case "Network":
        if (schedLocations != undefined) {
            VIEWER.setPlcaemarkHighlightHandler(schedLocations, false);
        }
        if (nwlocations != undefined) {
            $.each(nwlocations, function(key, value) {
                if (value != undefined) {
                    VIEWER.setPlacemarkHighlight(true, value);
                }
            });
        }
        break;
    case "Schedule":
        if (nwlocations != undefined) {
            $.each(nwlocations, function(key, value) {
                if (value != undefined) {
                    VIEWER.setPlacemarkHighlight(false, value);
                }
            });
        }
        if (schedLocations != undefined) {
            VIEWER.setPlcaemarkHighlightHandler(schedLocations, true);
        }

        break;
    }
};

VIEWER.setPlcaemarkHighlightHandler = function(datasource, isHighlight) {
    if (datasource != undefined) {
        $.each(datasource, function(key, dataObj) {
            if (dataObj != undefined) {
                VIEWER.setPlacemarkHighlight(isHighlight, dataObj);
            }
        });
    }
};



VIEWER.clearAll = function(isClearAll) {
    if (!isClearAll) {
        deleteOrDestroyBrowserSession("clearSessionDetails", function(response, io) {
            responseDeleteBrowserSessoinHandler(response, io);
            SQW.resetAllData(true, true);
            resetApplicatoin(isClearAll);
            showProgressDialog(false);
        }, true);
    } else {
        resetApplicatoin(isClearAll);
    }
};

VIEWER.isLegTypeDataLoaded = function() {
    return legTypeDataStatusMap[isNetworkQuery ? DATA_TYPE_NETWORK_SCHEDULE : DATA_TYPE_SCHEDULE];
};
VIEWER.setLegTypeData = function(data) {
    var dataType = isNetworkQuery ? DATA_TYPE_NETWORK_SCHEDULE : DATA_TYPE_SCHEDULE;
    legTypeMap[dataType] = data;
    legTypeDataStatusMap[dataType] = true;
};

VIEWER.resetLegTypeData = function() {
    legTypeMap = {};
    legTypeDataStatusMap[DATA_TYPE_NETWORK_SCHEDULE] = false;
    legTypeDataStatusMap[DATA_TYPE_SCHEDULE] = false;
};

VIEWER.getLegTypeData = function(isScheduleForNetworkFlag) {
    var legTypeDatasources = legTypeMap[getDataType(isScheduleForNetworkFlag)];

    if (legTypeDatasources == undefined) {
        legTypeDatasources = {};
    }
    if (legTypeDatasources['F'] == undefined) {
        legTypeDatasources['F'] = [];
    }
    if (legTypeDatasources['T'] == undefined) {
        legTypeDatasources['T'] = [];
    }

    return legTypeDatasources;
};

VIEWER.openDayControl = function(btn, dashboardId, dataType) {
    var keyObject = {
        dashboardId: dashboardId,
        dataType: dataType
    };
    var selectedDays = getDashboardSelectedDays(dashboardId, dataType);
    var days = getAvailableDays(dataType);
    if (days && days.length > 0) {
        if (!selectedDays) {
            selectedDays = days.toString();
        }
        if (!selectedDays) {
            selectedDays = EMPTY_STRING;
        }
        btn.lastSelectedDays = selectedDays.toString();
        showDayControl(false, selectedDays, btn, true, keyObject, true, days.toString(), getSelectedCase(), null, false, undefined, undefined, VIEWER.filterBySelectedDays());
    } else {
        showErrorMsg("No days to select");
    }
};

VIEWER.filterBySelectedDays = function() {
    if (!parent.isAdvanceQuery()) {
        return SQW.filterBySelectedDays;
    }
    return undefined;
};
VIEWER.isEquipmentTypeDataLoaded = function() {
    return equipmentTypeDataStatusMap[isNetworkQuery ? DATA_TYPE_NETWORK_SCHEDULE : DATA_TYPE_SCHEDULE];
};
VIEWER.setEquipmentTypeData = function(data) {
    var dataType = isNetworkQuery ? DATA_TYPE_NETWORK_SCHEDULE : DATA_TYPE_SCHEDULE;
    equipmentTypeMap[dataType] = data;
    equipmentTypeDataStatusMap[dataType] = true;
};

VIEWER.resetEquipmentTypeData = function() {
    equipmentTypeMap = {};
    equipmentTypeDataStatusMap[DATA_TYPE_NETWORK_SCHEDULE] = false;
    equipmentTypeDataStatusMap[DATA_TYPE_SCHEDULE] = false;
};

VIEWER.getEquipmentTypeData = function(isScheduleForNetworkFlag) {
    var equipmentTypeDatasources = equipmentTypeMap[getDataType(isScheduleForNetworkFlag)];

    if (equipmentTypeDatasources == undefined) {
        equipmentTypeDatasources = {};
    }
    if (equipmentTypeDatasources['F'] == undefined) {
        equipmentTypeDatasources['F'] = [];
    }
    if (equipmentTypeDatasources['T'] == undefined) {
        equipmentTypeDatasources['T'] = [];
    }

    return equipmentTypeDatasources;
};

VIEWER.syncDashboard = function(dashboardId, syncSearchCriteria, sourceDashboardId) {
    if (!dashboardController.isDashboardActive(dashboardId)) {
        var contentWindow = dashboardController.getDashboardContentWindow(dashboardId);
        if (contentWindow != undefined) {
            contentWindow.setSyncOn(true);
            if (dashboardId == DASHBOARD_ID_SCHEMATIC_VIEW || dashboardId == DASHBOARD_ID_MAP_VIEW) {
                contentWindow.viewerSyncSearchCriterias[contentWindow.getLayerIdByDataType(syncSearchCriteria.dataType)] = syncSearchCriteria;
                setDashboardDataStatus(dashboardId, syncSearchCriteria.dataType, false);
            } else {
                contentWindow.syncSearchCriteria = syncSearchCriteria;
                setDashboardDataStatus(dashboardId, DATA_TYPE_NETWORK, false);
                setDashboardDataStatus(dashboardId, DATA_TYPE_NETWORK_SCHEDULE, false);
                setDashboardDataStatus(dashboardId, DATA_TYPE_SCHEDULE, false);
            }
        }
        return;
    }
    getDashboardContentWindow(dashboardId).syncDashboard(syncSearchCriteria, sourceDashboardId);
};

VIEWER.getTextLength = function(text) {
    $("#dummyText").text(text);

    return $("#dummyText").width();
};

VIEWER.enableMarketView = function(btn, dashboardId, enableSync, isClicked) {
    try {
        getDashboardContentWindow(dashboardId).closeAllMarketViewPopups();
    } catch (e) {
        console.log("Error while closing all the market view popup [" + e.message + "] ");
    }
    if (isAdvanceQuery()) {
        if (isClicked && btn.children[0].className == "k-icon icon-market-view-disable") {
            return;
        }
    }

    if (!isNetworkQuery || (isNetworkQuery && getDashboardContentWindow(dashboardId).isScheduleForNetworkFlag)) {
        var isHighlighted = false;
        if (isAdvanceQuery()) {
            if (enableSync != null && enableSync == true) {

            } else {
                highlightBtn(btn, !btn.isHighlighted);
            }
            if (!btn.isHighlighted) {
                btn.children[0].title = "Turn market view on";
            } else {
                btn.children[0].title = "Turn market view off";
            }
            if (enableSync != null && enableSync == true) {
                toggleButton(false, "marketView", "icon-market-view-disable", "icon-market-view");
            } else {
                toggleButton(true, "marketView", "icon-market-view-disable", "icon-market-view");
            }
            isHighlighted = btn.isHighlighted;
        } else {
            if ($(btn).parent().hasClass("submenuSelected")) {
                $(btn).parent().removeClass("submenuSelected");
                isHighlighted = false;
            } else {
                $(btn).parent().addClass("submenuSelected");
                isHighlighted = true;
            }
        }

        getDashboardContentWindow(dashboardId).enableMarketView(btn.id, isHighlighted);
    }
};

VIEWER.enableRouteEditor = function(btn, isClicked) {
        	var isHighlighted = false;
            highlightBtn(btn, !btn.isHighlighted);
            var title="";
            title ="WIP";
            if (!btn.isHighlighted) {
                btn.children[0].title = "Enable "+ title;
            } else {
                btn.children[0].title = "Disable " + title;
            }
            isHighlighted = btn.isHighlighted;
            var uniqueId = "scheduleMaintenanceRouteType";
            if (btn.isHighlighted) {
            	$("#"+btn.id).removeClass("iconbtn-active");
            	VIEWER.openRouteSelectionSearchPopup(uniqueId, btn);
            } else {
            	/*if (searchPopUpMap[uniqueId] != null) {
            		var object = searchPopUpMap[uniqueId] ;
            		object.searchPopUpWin.data("kendoWindow").close();
            		//searchPopUpWin.data("kendoWindow").close();
            	}*/
            	closeSearchPopUP(uniqueId);
            	if (btn.id != "WIPHeaderId") {
            		closeScheduleMaintenanceDashboard();
            	}
            }
};

VIEWER.openRouteSelectionSearchPopup = function(uniqueId, btn){
	if(!searchPopUpMap[uniqueId]) {
		var window =  new SearchPopUp(uniqueId, new Object());
		searchPopUpMap[uniqueId] = window;
	}
	searchPopUpMap[uniqueId].options.title = "Select Route Type";
	searchPopUpMap[uniqueId].options.setApplyResponseHandler = setApplyResponseHandler;
	searchPopUpMap[uniqueId].options.getApplyResponseHandler = getApplyResponseHandler;
	searchPopUpMap[uniqueId].options.response = getFlightandTruckType();
	searchPopUpMap[uniqueId].options.parentObj = btn;
	searchPopUpMap[uniqueId].options.isUniqueObjects = true;
	searchPopUpMap[uniqueId].openFilterPopUp();
};

function closeSearchPopUP(uniqueId) {
	if (searchPopUpMap[uniqueId] != null) {
		var object = searchPopUpMap[uniqueId] ;
		object.searchPopUpWin.data("kendoWindow").close();
		//searchPopUpWin.data("kendoWindow").close();
	}
}

function getFlightandTruckType() {
	return [
	{text: "Flight - Trunk", value:"FS"},  
    {text: "Flight - Feeder", value:"FF"},  
    //{text: "Flight - Interline/OBC", value:"Flight"},
    {text: "Flight - Commercial Line Haul", value:"FC"},
    /*{text: "Truck - Standard Line Haul", value:"TS"},   //commented for release 1
    {text: "Truck - Standard Shuttle", value:"TSS"}, */
    {text: "Truck - Standard GNP/8888", value:"TSG"},
    {text: "Truck - Oversized/Z/GBT", value:"TO"}];
}
VIEWER.onBeforeTabSelect = function(tabName) {
    try {
        //reset the mandatory dashboards
        var dashboardIds = dashboardController.getAllDashboardIds();
        if (dashboardIds) {
            for (var i = 0; i < dashboardIds.length; i++) {
                try {
                    if (dashboardIds[i] == DASHBOARD_ID_QUERY) {
                        continue;
                    }
                    var dashboardContentWindow = dashboardController.getDashboardContentWindow(dashboardIds[i]);
                    if (dashboardContentWindow && (typeof dashboardContentWindow.onBeforeTabSelect == "function")) {
                        dashboardContentWindow.onBeforeTabSelect(tabName);
                    }
                } catch (e) {
                    console.log("Error [" + e.message + "] occurred onBeforeTabSelect [" + dashboardIds[i] + "]");
                }
            }
        }
        VIEWER.highlightGraphicChangeHandler(tabName);
    } catch (e) {
        console.log("Error [" + e.message + "] occurred onBeforeTabSelect");
    }
};

VIEWER.getQueryDataSource = function(cacheKey) {
    try {
        return getDashboardContentWindow(parent.DASHBOARD_ID_QUERY).getQueryDatasources()[cacheKey];
    } catch (e) {
        parent.showErrorMsg("Error occured while fetching the data for " + cacheKey);
    }
};

VIEWER.enableSync = function(btn, dashboardId, syncDashboardIds, secondBtnClassName, isSyncDashboardIdsString, isRunQuery) {
    if (isSyncDashboardIdsString != null && isSyncDashboardIdsString == true) {
        syncDashboardIds = syncDashboardIds.split(COMMA_STRING);
    }
    if (btn != null) {
        highlightBtn(btn, !btn.isHighlighted);
        var dashboardName, targetDashboardId, secondTargetDashboardId;
        if (btn.innerText.indexOf("map") > 0) {
            dashboardName = "Map";
            targetDashboardId = DASHBOARD_ID_MAP_VIEW;
        } else if (btn.innerText.indexOf("schematic") > 0) {
            dashboardName = "Schematic";
            targetDashboardId = DASHBOARD_ID_SCHEMATIC_VIEW;
        } else {
            dashboardName = "Matrix";
            if (isNetworkQuery) {
                if (getDashboardContentWindow(dashboardId).isScheduleForNetworkFlag) {
                    targetDashboardId = DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX;
                    if (getDashboardContentWindow(dashboardId).matrixSyncStates) {
                        getDashboardContentWindow(dashboardId).matrixSyncStates[DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX] = btn.isHighlighted;
                    }
                } else {
                    targetDashboardId = DASHBOARD_ID_NETWORK_MATRIX;
                    secondTargetDashboardId = DASHBOARD_ID_NETWORK_SUMMARY_MATRIX;
                    if (getDashboardContentWindow(dashboardId).matrixSyncStates) {
                        getDashboardContentWindow(dashboardId).matrixSyncStates[DASHBOARD_ID_NETWORK_MATRIX] = btn.isHighlighted;
                    }
                    targetDashboardId = DASHBOARD_ID_NETWORK_MATRIX;
                    secondTargetDashboardId = DASHBOARD_ID_NETWORK_SUMMARY_MATRIX;
                    if (getDashboardContentWindow(dashboardId).matrixSyncStates) {
                        getDashboardContentWindow(dashboardId).matrixSyncStates[DASHBOARD_ID_NETWORK_MATRIX] = btn.isHighlighted;
                    }
                }
            } else {
                targetDashboardId = DASHBOARD_ID_SCHEDULE_MATRIX;
                if (getDashboardContentWindow(dashboardId).matrixSyncStates) {
                    getDashboardContentWindow(dashboardId).matrixSyncStates[DASHBOARD_ID_SCHEDULE_MATRIX] = btn.isHighlighted;
                }
            }
        }
        if (getDashboardContentWindow(targetDashboardId)) {
            if (btn.innerText.indexOf("map") > 0) {
                getDashboardContentWindow(targetDashboardId).validateToggledView(true, dashboardId, getButtonObject("map-view"));
            } else if (btn.innerText.indexOf("schematic") > 0) {
                getDashboardContentWindow(targetDashboardId).validateToggledView(true, dashboardId, getButtonObject("schematicSView"));
            }
        }

        if (btn.isHighlighted) {
            btn.children[0].title = dashboardName + " synchronization is on. Click to turn off.";
        } else {
            btn.children[0].title = btn.innerText;
        }
        try {
            getDashboardContentWindow(dashboardId).enableSync(btn.id, btn.isHighlighted);
        } catch (e) {
            console.log("Error while enabling sync [" + e.message + "] ");
        }
    }
    if (dashboardId != null) {
        getDashboardContentWindow(dashboardId).enableDisableRefresh(true, dashboardId); //to enable self
    }

    var isResetSync = true;
    var secondBtn = null;
    if (secondBtnClassName != undefined) {
        if (dashboardController.getDashboard(dashboardId) != undefined) {
            secondBtn = dashboardController.getDashboard(dashboardId).data("kendoWindow").wrapper.find('.' + secondBtnClassName).parent()[0];
        }
        if (secondBtn) {
            isResetSync = secondBtn != undefined && !secondBtn.isHighlighted && !btn.isHighlighted;
        }
    }
    if (btn != null && btn.isHighlighted || secondBtn != null && secondBtn.isHighlighted) {
        isAtleastOneSyncOn = true;
    } else {
        isAtleastOneSyncOn = false;
    }
    var dashboardContent;
    var selectedBtn;
    if (syncDashboardIds) {
        for (var i = 0; i < syncDashboardIds.length; i++) {
/*if(dashboardController.isDashboardClosed(syncDashboardIds[i])) {
				continue;
			}*/
            dashboardContent = getDashboardContentWindow(syncDashboardIds[i]);
            if (dashboardContent) {
                //if(isResetSync) {
                dashboardContent.isSyncOn = !isResetSync;
                //}
                if (btn != null && btn.isHighlighted) {
                    dashboardContent.enableDisableRefresh(false, null, false, targetDashboardId);
                    if (secondTargetDashboardId) {
                        dashboardContent.enableDisableRefresh(false, null, false, secondTargetDashboardId);
                    }
                } else {
                    if (isRunQuery == true) { //remove the highlight of the sync button on run query 
                        if (dashboardId != null && (isAdvancedQueryModule() || (dashboardId != parent.DASHBOARD_ID_MAP_VIEW && dashboardId != parent.DASHBOARD_ID_SCHEMATIC_VIEW))) {
                            selectedBtn = dashboardController.getDashboard(syncDashboardIds[i]).data("kendoWindow").wrapper.find("iconbtn .iconbtn-active .n-icon-active");
                        } else {
                            selectedBtn = $(".iconbtn.iconbtn-active.n-icon-active"); //dashboardController.getDashboard(syncDashboardIds[i]).data("kendoWindow").wrapper.find("iconbtn .iconbtn-active .n-icon-active");
                        }
                        if (selectedBtn[0] != null) {
                            selectedBtn[0].className = "iconbtn n-icon";
                            selectedBtn[0].isHighlighted = false;
                        }
                        if (selectedBtn[1] != null) {
                            selectedBtn[1].className = "iconbtn n-icon";
                            selectedBtn[1].isHighlighted = false;
                        }
                        isResetSync = isRunQuery;
                    }

                    if (typeof dashboardContent.enableDisableRefresh == "function") {
                        if (dashboardName == "Matrix" && getDashboardContentWindow(dashboardId).matrixSyncStates[syncDashboardIds[i]] == true && syncDashboardIds[i] != targetDashboardId) {
                            //do nothing
                        } else {
                            if (isResetSync) {
                                dashboardContent.enableDisableRefresh(isResetSync);
                            } else {
                                dashboardContent.enableDisableRefresh(true, null, null, targetDashboardId);
                            }
                        }
                    }
                }
            }
        }
    }
};

function setScheduleMaintenananceSelectedMenu(routeContextObj) {
	scheduleMaintenananceSeletedMenu = getScheduleMaintenananceSelectedMenu(routeContextObj);
    selectedMode = routeContextObj;
}

/**
 * method to return the menu type 
 * code updated for FDX-1238 CLH-ManuallyTimed: Cant select 'manually time' for 1st instance but can for 2nd instance
 * @param routeContextObj
 * @returns {String}
 */
function getScheduleMaintenananceSelectedMenu(routeContextObj) {
    if (routeContextObj == 'Flight - Trunk' || routeContextObj == 'Flt Trunk') {
        return "FT";
    } else if (routeContextObj == 'Flight - Feeder' || routeContextObj == 'Flt Feeder') {
    	 return "FF";
    } else if (routeContextObj == 'Flight - Commercial Line Haul' || routeContextObj == 'Flt CLH') {
    	 return "FC";
    } else if (routeContextObj == 'Truck - Standard Line Haul' || routeContextObj == 'Trk Std LH') {
    	 return "TS";
    } else if (routeContextObj == 'Truck - Standard Shuttle' || routeContextObj == 'Trk Std SH') {
    	 return "TSS";
    } else if (routeContextObj == 'Truck - Oversized/Z/GBT' || routeContextObj == 'Trk Ovr Z GBT') {
    	 return "TO";
    } else if (routeContextObj == 'Truck - Standard GNP/8888' || routeContextObj == 'Trk Std GNP') {
    	 return "TSG";
    }
    return "FT";
}

function setScheduleMaintenananceMode(mxMode) {
    scheduleMxMode = mxMode;
    oldEquipType = null;
}

function createSelectedLegList(rteData, matchingLegs, rowCmd, legId, legObject) {
    if (matchingLegs == undefined) {
        LoggerUtils.console("match legs are undefined");
        return;
    }
    var legListlen = (matchingLegs.slice(0)).length;
    var tempObj = null;
    var index = -1;
    isContextMode = true;
    if (rowCmd == 'addPreviousLeg') {
        isDelete = false;
        for (var i = 0; i < legListlen; i++) {
            if (matchingLegs[i]["LEG_ID"] === legId.toString()) {
                tempObj = getLegObj();
                tempObj.ORIGIN = "";
                tempObj.DESTINATION = matchingLegs[i].ORIGIN;
                //tempObj.LEG_ID = matchingLegs[i].ROUTE_ID;
                tempObj.ROUTE_ID = matchingLegs[i].ROUTE_ID;
                tempObj.MV_NUM = matchingLegs[i].MV_NUM;
                tempObj.LEG_TYPE = matchingLegs[i].LEG_TYPE;
                tempObj.EQUIP_TYPE = matchingLegs[i].EQUIP_TYPE;
                tempObj.MODE = matchingLegs[i].MODE;
                tempObj.OPERATION_CD = OPERATION_CD_ADD;
                if (legObject != undefined) {
                    tempObj.ORIGIN = legObject["ORIGIN"] != undefined ? legObject["ORIGIN"] : "";
                    tempObj.LEG_ID = legObject["LEG_ID"];
                }
                index = i;
            }
            matchingLegs[i]["OPERATION_CD"] = OPERATION_CD_NOCHANGE;
        }
        matchingLegs.splice(index, 0, tempObj);
    } else if (rowCmd == 'addNextLeg') {
        isDelete = false;
        for (var i = 0; i < legListlen; i++) {
            if (matchingLegs[i]["LEG_ID"] === legId.toString()) {
                tempObj = getLegObj();
                tempObj.DESTINATION = "";
                tempObj.ORIGIN = matchingLegs[i].DESTINATION;
                //tempObj.LEG_ID = matchingLegs[i].ROUTE_ID;
                tempObj.ROUTE_ID = matchingLegs[i].ROUTE_ID;
                tempObj.MV_NUM = matchingLegs[i].MV_NUM;
                tempObj.LEG_TYPE = matchingLegs[i].LEG_TYPE;
                tempObj.EQUIP_TYPE = matchingLegs[i].EQUIP_TYPE;
                tempObj.MODE = matchingLegs[i].MODE;
                tempObj.OPERATION_CD = OPERATION_CD_ADD;
                if (legObject != undefined) {
                    tempObj.DESTINATION = legObject["DESTINATION"] != undefined ? legObject["DESTINATION"] : "";
                    tempObj.LEG_ID = legObject["LEG_ID"];
                }
                index = i;
            }
            matchingLegs[i]["OPERATION_CD"] = OPERATION_CD_NOCHANGE;
        }
        matchingLegs.splice(index + 1, 0, tempObj);
    } else if (rowCmd == 'addRoute') {
        isDelete = false;
    } else if (rowCmd == 'deleteLeg') {
        isDelete = false;
    } else if (rowCmd == 'deleteRoute') {
        isDelete = true;
    } else if (rowCmd == 'copyRouteToWIP') {
        isDelete = false;
        setOperationCode(matchingLegs);
    }
    setLegSeqNo(matchingLegs, legObject);
    return matchingLegs;
}

function callScheduleRouteDataService(grid, rowData, rowCmd, onDataRequestSuccess, legId, routeId,isNetworkSchedule) {
    var serviceUrl = SCHEDULE_ROUTE_DATA_URL;
    var paramsMap;
    if (onDataRequestSuccess != undefined && typeof onDataRequestSuccess != 'function') {
        onDataRequestSuccess = onScheduleRouteDataRequestSuccess;
    }
    if(rowData != undefined){
    	if (legId == undefined) {
    		legId = rowData["LEG_ID"];
    	}
    	if (routeId == undefined) {
    		routeId = rowData["ROUTE_ID"];
    	}
    }
    
    var routeIds = [];
    if(grid != null &&  grid != undefined){
    	var selectedRows = grid.getSelectedKeys();        
        if(selectedRows != null) {
        	for(var i=0; i<selectedRows.length; i++) {
        		if(routeIds.indexOf(selectedRows[i].ROUTE_ID) < 0) {
        			routeIds.push(selectedRows[i].ROUTE_ID);
        		}
        	}
        }
    }else {
    	routeIds.push(routeId);
    }
    

    paramsMap = {
        "browserSessionId": getBrowserSessionId(),
        "commonCaseId": getCommonCaseId(),
        "planWeek": getSelectedPlanWeek(),
        "effDayPatternStr": parent.getSelectedEffDayStrPattern(),
        "effDayPatternStr": parent.getSelectedEffDayStrPattern(),
        "scheduleId": getScheduleId(),
        "timeReference": isLocalTimeFlag() ? "L" : "Z",
        "ROUTE_ID": routeId,
        "isNetworkQuery": isNetworkSchedule,
        "actionType": rowCmd,
        "legId": legId,
        "routeIds": routeIds.toString()
    };
    if (paramsMap) {
        callService({
            url: serviceUrl,
            paramsMap: paramsMap,
            successCallback: onDataRequestSuccess,
            failureCallback: onScheduleRouteDataRequestFailure,
            showProgressWindow: false
        });
    }
}

function onScheduleRouteDataRequestSuccess(response, io) {
	var initialLegList=[];
	var initialRouteList=[];
	var actionType = EMPTY_STRING;
    showProgressDialog(false);
    if(( response && response.errorCd && response.errorCd > 0 )|| response && response._errorCd && response._errorCd > 0) {
		if(response.errorDesc){
			parent.showErrorMsg(response.errorDesc);
		}else{
			parent.showErrorMsg(response._errorDesc);
		}
	} else {
		actionType= response.actionType;
        var legId = response.legId;
        var legData = $.parseJSON(response.legData);
        var rteData = $.parseJSON(response.rteData);
        var matchingLegs = [];
        var modifiedLegs = [];
        var temLegs = [];
        for (var i = 0; i < rteData.length; i++) {
            matchingLegs = $.grep(legData, function(obj) {
                return obj["ROUTE_ID"] === rteData[i]["ROUTE_ID"];
            });
            $.merge(initialLegList, jQuery.extend(true, [], matchingLegs));
            temLegs = createSelectedLegList(rteData[i], matchingLegs, actionType, legId);
            $.merge(modifiedLegs, temLegs);
            if (matchingLegs && matchingLegs.length > 0) {
                rteData[i]["MV_NUM"] = matchingLegs[0]["MV_NUM"];
                rteData[i]["LEG_TYPE"] = matchingLegs[0]["LEG_TYPE"];
                rteData[i]["EQUIP_TYPE"] = matchingLegs[0]["EQUIP_TYPE"];
                rteData[i]["MODE"] = matchingLegs[0]["MODE"];
            }
            setScheduleMaintenananceSelectedMenu(rteData[i]["ROUTE_CONTEXT_CD"]);
            rteData[i].MENU = scheduleMaintenananceSeletedMenu;
        }
        selectedLegList = modifiedLegs;
        selectedRouteList = rteData;
        initialRouteList = jQuery.extend(true, [], rteData);
       // initialLegList = matchingLegs;
    }
    if (actionType == 'copyRouteToWIP') {
        mergeData(selectedLegList, selectedRouteList);
        mergeInitialRouteData(initialLegList,initialRouteList);
        dashboardController.openDashboard(DASHBOARD_ID_SCHEDULE_MATRIX_WIP,true);
    }
    setSeasonalData(response.seasonData, actionType);
    refreshREWindows(actionType);
}


function mergeInitialRouteData(selectedLegList, selectedRouteList) {
	if (initialWIPRouteList != undefined && initialWIPRouteList.length > 0) {
		var nonMachingRoutes = initialWIPRouteList;
    	var nonMachingLegs = initialWIPLegList;
    	for(var i=0; i<selectedRouteList.length; i++) {
    		nonMachingRoutes = $.grep(nonMachingRoutes, function(obj) {
				return (obj["ROUTE_ID"] != selectedRouteList[i]["ROUTE_ID"]);
			});
    		nonMachingLegs = $.grep(nonMachingLegs, function(obj) {
				return (obj["ROUTE_ID"] != selectedRouteList[i]["ROUTE_ID"]);
			});
    	}
    	initialWIPRouteList = $.merge(selectedRouteList, nonMachingRoutes);
        initialWIPLegList = $.merge(selectedLegList, nonMachingLegs);
    } else {
    	initialWIPLegList = selectedLegList;
        initialWIPRouteList = selectedRouteList;
    }
	
}
function getRoutePropertyValue(routeId, propertyName) {
    if (routeId != undefined ) {
    	if(propertyName == undefined){
    		propertyName = "ROUTE_CONTEXT_CD";
    	}
    	for(var i=0; i<selectedRouteList.length; i++) {
    		if(selectedRouteList[i]["ROUTE_ID"] == routeId) {
    			return selectedRouteList[i]["ROUTE_CONTEXT_CD"];
    		}
    	}
    }
}

function setSeasonalData(seasons, actionType) {
	if(seasons != undefined ){
		var seasonObj = $.parseJSON(seasons);
		var rteData = $.parseJSON(seasonObj.rteData);
		var legData = $.parseJSON(seasonObj.legData);
		var nonMachingLegs;
		if(actionType == 'copyRouteToWIP') {
			nonMachingLegs = selectedWIPSeasonLegList;
		}else {
			nonMachingLegs = selectedSeasonLegList;
		}
		for(var i=0; i<rteData.length; i++) {
			nonMachingLegs = $.grep(nonMachingLegs, function(obj) {
				return (obj["ROUTE_ID"] != rteData[i]["ROUTE_ID"] && obj["ROUTE_ID"] != "");
			});
		}
		if(actionType == 'copyRouteToWIP') {
			selectedWIPSeasonLegList = $.merge(nonMachingLegs,legData);
		}else {
			selectedSeasonLegList = $.merge(nonMachingLegs,legData);
		}
	}
}

function mergeData(selectedLegList, selectedRouteList) {
    if (selectedWIPLegList != undefined && selectedWIPLegList.length > 0) {
    	var nonMachingRoutes = selectedWIPRouteList;
    	var nonMachingLegs = selectedWIPLegList;
    	for(var i=0; i<selectedRouteList.length; i++) {
    		nonMachingRoutes = $.grep(nonMachingRoutes, function(obj) {
				return (obj["ROUTE_ID"] != selectedRouteList[i]["ROUTE_ID"]);
			});
    		nonMachingLegs = $.grep(nonMachingLegs, function(obj) {
				return (obj["ROUTE_ID"] != selectedRouteList[i]["ROUTE_ID"]);
			});
    	}
    	selectedWIPRouteList = $.merge(selectedRouteList, nonMachingRoutes);
        selectedWIPLegList = $.merge(selectedLegList, nonMachingLegs);
    } else {
        selectedWIPLegList = selectedLegList;
        selectedWIPRouteList = selectedRouteList;
    }
}

function refreshREWindows(rowCmd) {
    var dashboard;
    if (rowCmd == 'copyRouteToWIP') {
        dashboard = getDashboardContentWindow(DASHBOARD_ID_SCHEDULE_MATRIX_WIP);
        if (dashboard != undefined && dashboard.hasOwnProperty("refreshMatrixWithData")) {
            dashboard.refreshMatrixWithData();
        }
    } else {
        dashboard = getDashboardContentWindow(DASHBOARD_ID_MATRIX_ROUTE_EDITOR);
        if (dashboard != undefined && dashboard.hasOwnProperty("refreshMatrixWithData")) {
            dashboard.refreshMatrixWithData();
        }
    }
    dashboard = null;
}

function onScheduleRouteDataRequestFailure(response, io) {
    onServiceRequestFailure(response, io);
}


function setLegSeqNo(matchingLegs, legObject) {
    if (matchingLegs != undefined && matchingLegs.length > 0) {
        var autoIncreamentID = 1;
        for (var i = 0; i < matchingLegs.length; i++) {
            if (matchingLegs[i] == undefined) {
                continue;
            }
            matchingLegs[i].MV_NUM_SEQ = autoIncreamentID;
            if (matchingLegs[0].ROUTE_ID == matchingLegs[i].LEG_ID) {
                matchingLegs[i].LEG_ID = matchingLegs[0].ROUTE_ID + '-' + autoIncreamentID;
            }
            autoIncreamentID = autoIncreamentID + 1;
        }
    }
}

function setOperationCode(legList) {
    for (var i = 0; i < legList.length; i++) {
        if (legList[i]["OPERATION_CD"] == undefined) {
            legList[i]["OPERATION_CD"] = OPERATION_CD_NOCHANGE;
        }
    }
}

function isMoveToREFromMap(){
	return getDashboardContentWindow(DASHBOARD_ID_MAP_VIEW).SkdMxHelper.getMapOpeationManager().isMoveToRE();
}

/**
 * On Saving the route callback
 * @param response
 * @param io
 * @param routeId
 */
function onSaveServiceSuccess(response, isDelete, isUndelete, routeList) {
	if(response != undefined){
		var moveNbrs = getMoveNbrs(response);
		var dashboardContentWindow  = getDashboardContentWindow(DASHBOARD_ID_QUERY);
		if(moveNbrs != undefined && moveNbrs.length > 0){
            //FdxFDX-1262 Query Panel: After creating a route, reset all query panel parameters.
            // If not, the re-query doesn't show any results if extraneous parameters
            // are present
            dashboardContentWindow.afterSaveHandler(isDelete, moveNbrs);
		}
		showSaveServiceErrorMsg(response, isDelete, isUndelete,routeList);
		resetSkdMxDrawer(getRouteIds(response, true));
		setTimeout(function(){
			if (isheaderNeedtoCose) {
				closeHeaderMsgWin();
			}
		}, 10000);
	}
}

function showSaveServiceErrorMsg(response, isDelete, isUndelete,routeList) {
	var errorMsg = "";
	var savedMvNum = "";
	var notSavedMvNum = "";
	var scheduleErrWrgsMap = response.scheduleErrWrgsMap;
	var routeIds = Object.keys(scheduleErrWrgsMap);
	for(var i=0; i<routeIds.length; i++) {
		if(scheduleErrWrgsMap[routeIds[i]].success) {
			savedMvNum = savedMvNum + scheduleErrWrgsMap[routeIds[i]].moveNum + ", ";
		}else {
			notSavedMvNum = notSavedMvNum + scheduleErrWrgsMap[routeIds[i]].moveNum + ", ";
		}
	}
	
	var msgStr = isUndelete == true ? "undeleted" : (isDelete ? "deleted:" : "saved:");
	if(savedMvNum != "") {
		errorMsg = "Routes with following move numbers were successfully " +msgStr;
	}
	
	headerErrorMsgWin = $('#headerErrorDiv');
	
	//saved or deleted messgae
	var leftdiv=$('<div></div>').attr({style:"float:left;width:90%"});
	if (savedMvNum != "") {
		isheaderNeedtoCose= true;
		var saveTable =  $('<table></table>').attr({ id: "saveTable" });
		saveTable.appendTo(leftdiv);
		var row = $('<tr></tr>').appendTo(saveTable);
		$('<td></td>').text(errorMsg).appendTo(row); 
		for(var i=0; i<routeIds.length; i++) {
			if(scheduleErrWrgsMap[routeIds[i]].success) {
				matchedrouteObject = $.grep(routeList, function(obj) {
					return obj["ROUTE_ID"] == routeIds[i];
				});
				var row = $('<tr></tr>').appendTo(saveTable);
				var column = $('<td></td>').appendTo(row);
				$('<span style="padding-left:60px"></span>').text(matchedrouteObject[0]["MV_NUM"]).appendTo(column); 
				$('<span style="padding-left:10px"></span>').text(matchedrouteObject[0]["FULL_EFFDAY_HOLIDAY_L"]).appendTo(column); 
			}
		}
	}
	//error messages
		if (notSavedMvNum != "") {
			isheaderNeedtoCose= false;
			var errorTable =  $('<table></table>').attr({ id: "errorTable" },{style:"650px"});
			errorTable.appendTo(leftdiv);
			for(var i=0; i<routeIds.length; i++) {
				if(!scheduleErrWrgsMap[routeIds[i]].success) {
					matchedrouteObject = $.grep(routeList, function(obj) {
						return obj["ROUTE_ID"] == routeIds[i];
					});
					if (scheduleErrWrgsMap[routeIds[i]].errors != undefined) {
						var error = scheduleErrWrgsMap[routeIds[i]].errors[0];
						var wsErrors = error.wserror;
						if (wsErrors.length == 1) {
							var row = $('<tr></tr>').appendTo(errorTable);
							$('<td style="padding-left: 10px;width:50px;"></td>').text(matchedrouteObject[0]["MV_NUM"]).appendTo(row); 
							$('<td style="padding-left: 10px; width:200px;"></td>').text(matchedrouteObject[0]["FULL_EFFDAY_HOLIDAY_L"]).appendTo(row); 
							$('<td style="width:10px;"></td>').text(wsErrors[0].wserrorCd).appendTo(row); 
							$('<td style="padding-left: 10px;width:420px"></td>').text(wsErrors[0].wserrorDesc).appendTo(row); 
						} else {
							for (var j=0; j <wsErrors.length;j++) {
								var row = $('<tr></tr>').appendTo(errorTable);
								$('<td style="padding-left: 10px;width:50px;"></td>').text(matchedrouteObject[0]["MV_NUM"]).appendTo(row); 
								$('<td style="padding-left: 10px; width:200px;"></td>').text(matchedrouteObject[0]["FULL_EFFDAY_HOLIDAY_L"]).appendTo(row); 
								$('<td style="width:10px;"></td>').text(wsErrors[j].wserrorCd).appendTo(row); 
								$('<td style="padding-left: 10px;width:420px"></td>').text(wsErrors[j].wserrorDesc).appendTo(row); 
							}
						}
					}
				}
			}
		}
		//Warnings
		var infoTable =  $('<table></table>').attr({ id: "infoTable" },{style:"650px"});
		infoTable.appendTo(leftdiv);
		for(var i=0; i<routeIds.length; i++) {
			matchedrouteObject = $.grep(routeList, function(obj) {
				return obj["ROUTE_ID"] == routeIds[i];
			});
			if (scheduleErrWrgsMap[routeIds[i]].wsWarnings != undefined) {
				isheaderNeedtoCose= false;
				var warnings = scheduleErrWrgsMap[routeIds[i]].wsWarnings[0];
			
				var wsWarning = warnings.wswarning;
				if (wsWarning.length == 1) {
					var row = $('<tr></tr>').appendTo(infoTable);
					$('<td style="padding-left: 10px;width:50px;"></td>').text(matchedrouteObject[0]["MV_NUM"]).appendTo(row); 
					$('<td style="padding-left: 10px; width:200px;"></td>').text(matchedrouteObject[0]["FULL_EFFDAY_HOLIDAY_L"]).appendTo(row);
					$('<td style="width:10px;"></td>').text(wsWarning[0].wswarningCd).appendTo(row); 
					$('<td style="padding-left: 10px;width:420px"></td>').text(wsWarning[0].wswarningDesc).appendTo(row); 
				} else {
					for (var j=0; j <wsWarning.length;j++) {
						var row = $('<tr></tr>').appendTo(infoTable);
						$('<td style="padding-left: 10px;width:50px;"></td>').text(matchedrouteObject[0]["MV_NUM"]).appendTo(row); 
						$('<td style="padding-left: 10px; width:200px;"></td>').text(matchedrouteObject[0]["FULL_EFFDAY_HOLIDAY_L"]).appendTo(row);
						$('<td style="width:10px;"></td>').text(wsWarning[j].wswarningCd).appendTo(row); 
						$('<td style="padding-left: 10px;width:420px"></td>').text(wsWarning[j].wswarningDesc).appendTo(row); 
					}
				}
			}
		}
		
	if (savedMvNum != '' || notSavedMvNum != "") {
		showSaveMessage(true,leftdiv);
		$("<div id='closeDiv' style='float:right;width:17px;'>" +
		"<img title='Close' style='cursor:pointer' src='pegasus/assets/icons/close_window.png' onclick='closeHeaderMsgWin();'/></div>").appendTo(headerErrorMsgWin);
	}
	  
}

function showSaveMessage(msg,infoTable) {
	    headerErrorMsgWin = $('#headerErrorDiv');
	    if (!headerErrorMsgWin.data("kendoWindow")) {
	        headerErrorMsgWin.kendoWindow({
	            width: "700px",
	            draggable: false,
	            modal: false,
	            resizable: false,
	            actions: ["close"],
	            title: msg
	        });
	    }
	    headerErrorMsgWin.data("kendoWindow").content("");
	    var msgTypeClass = "success-msg-header";
	    
	    if (msg) {
	        headerErrorMsgWin.parent().find(".k-window").css({
	            "className": "sat"
	        });
	        headerErrorMsgWin.data("kendoWindow").wrapper[0].className = "k-widget k-window "+msgTypeClass;
	        headerErrorMsgWin.data("kendoWindow").open();
	        infoTable.appendTo(headerErrorMsgWin);
	        headerErrorMsgWin.data("kendoWindow").title(false);
	        headerErrorMsgWin.parent().attr("title", "");
	        headerErrorMsgWin.parent().find('.k-window-content').css({
	            "min-height": "10px",
	             "display": "block"
	        });
        	headerErrorMsgWin.parent().css({
                 "padding-top":"0px"
            });
        	headerErrorMsgWin.parent().css("height", "");
	    } 
}

function resetSkdMxDrawer(routeIds){
	getDashboardContentWindow(DASHBOARD_ID_MAP_VIEW).resetSkdMxDrawer(routeIds); // SkdMxHelper.getDrawer().clearGraphicLayers(true);
}

function getMoveNbrs(response){
	var moveNbrs = [];
	if(response && response.scheduleErrWrgsMap) {
		var scheduleErrWrgsMap = response.scheduleErrWrgsMap;
		var routeIds = Object.keys(scheduleErrWrgsMap);
		var routeId;
		var prevRouteList = selectedWIPRouteList;
		for(var i=0; i< routeIds.length; i++){
			routeId = routeIds[i];
			if(routeIds  != undefined && scheduleErrWrgsMap[routeId].success){//[FDX-1148]
                if(scheduleErrWrgsMap[routeId]["moveNum"] != undefined){
                    moveNbrs.push(scheduleErrWrgsMap[routeId]["moveNum"]);
                }
				if(prevRouteList != null) {
					prevRouteList = $.grep(prevRouteList, function(e) {
						return e["MV_NUM"] != scheduleErrWrgsMap[routeId]["moveNum"];
					});
				}
			}
		}
		if(prevRouteList != null) {
			for(var j=0; j<prevRouteList.length;j++) {
                if(prevRouteList[j]["MV_NUM"] != undefined){
                    moveNbrs.push(prevRouteList[j]["MV_NUM"]);
                }
			}
		}
	}
	
	return getUniqueList(moveNbrs);
}

/**
 * Method to remove duplicate from array
 * @param list
 * @returns {Array}
 */
function getUniqueList(list) {
    var result = [];
    $.each(list, function(i, v) {
        if ($.inArray(v, result) == -1) result.push(v);
    });
    return result;
};

function getRouteIds(response, isOnlySavedRoutes){
	if(response && response.scheduleErrWrgsMap) {
		var scheduleErrWrgsMap = response.scheduleErrWrgsMap;
        if(isOnlySavedRoutes){
            var routeIds = Object.keys(scheduleErrWrgsMap);
            var savedRouteIds;
            for(var i=0; i<routeIds.length; i++) {
                if (scheduleErrWrgsMap[routeIds[i]].success) {
                    if(savedRouteIds == undefined){
                        savedRouteIds = [];
                    }
                    savedRouteIds.push(routeIds[i]);
                }
            }
            return savedRouteIds;
        }

		return Object.keys(scheduleErrWrgsMap);		
	}
}

function onWindowCloseHandler(e){
	if(e != undefined){
        //FdxFDX-1260: MAP..WIP sync issue
		if(e.sender.element[0].id == DASHBOARD_ID_SCHEDULE_MATRIX_WIP){
			resetSkdMxDrawer([]);
		}
	}
}


function updateRevisionsCounter(routeId){
	if(revisionsUpdateMap[routeId] == undefined){
		var counter = getRevisionsCounter(routeId);
		 counter =  counter +1;
		revisionsUpdateMap[routeId] = counter;
	}
}

function getRevisionsCounter(routeId){
	if(revisionsUpdateMap[routeId] != undefined){
		return (revisionsUpdateMap[routeId]);
	}else{
		return 0;
	}
}

function isValidRevisionsCountOk(selectedRtList){
//	var keysArr = Object.keys(parent.revisionsUpdateMap);
	var validRoute = 0;
	if(selectedRtList != undefined && selectedRtList.length > 0){
		for(var i = 0;i < selectedRtList.length; i++){
			if((revisionsUpdateMap[selectedRtList[i]["ROUTE_ID"]]) > 0){
				validRoute++
			}
		}
		if(validRoute == selectedRtList.length){
			return false; 
		}else{
			return true;
		}
	}else{
		return true;
	}
}

function clearRevisionsUpdateMap(){
	revisionsUpdateMap = {};
}