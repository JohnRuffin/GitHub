/**
 * common javascript file for map viewer dashboard and schematic dashboard. 
 */
var isScheduleForNetworkFlag = false;

var searchCriterias = {};
var whereClauses = {};
var dayWhereClauses = {};
var activityWhereClause = "";

var popUpMap = new Object();
var transitPopUpMap = new Object();

var isSyncOn = false;
var isSyncMatrix = false;
var isSyncViewer = false;
var isSyncVolumeAndAllocationMatrix = false;
var viewerSyncSearchCriterias = {};
var matrixSyncStates = {};

var isMarketViewEnable = false;

var labelType = "";
var directionBtnConstant = 1;
var intImage = 1;

var currentDirectionBtnConstant = 1;
var currentViewerConstant = 2;

var enableAutosyncFromMatrix;

// network settings labels 
var isShowDepartureDays = false;
var isShowArrivalDays = false;
var isShowAvailableTime = false;
var isShowDueTime = false;

// schedule settings labels 
var isShowRouteNo = false;
var isShowIATADesc = false;
var isShowEquipCode = false;
var isShowDepartureTime = false;
var isShowArrivalTime = false;
var isShowEffectiveDays = false;

var isReturnAll = false;
var isLocalFlag = true;
var viewerDataEnabled = new Object();

var lastSelectedLineIds = {}; /******** Activity Popup **************/
var activityPopUp;

/******** Activity Popup **************/
var marketviewPopUp;
var lastSelectedLineId;

function clear(isClearAll) {
    clearSync(isClearAll);
    dayWhereClauses = {};
    updateViewerToggleButton();

    if (isClearAll) {
        window[viewerDashboardId].clearLayers();
    } else {
        if (parent.isNetworkQuery) {
            window[viewerDashboardId].clearLayers(window[viewerDashboardId].LAYER_IDS_NETWORK);
        } else {
            window[viewerDashboardId].clearLayers(window[viewerDashboardId].LAYER_IDS_SCHEDULE);
        }
    }
    closePopups();
    populateLegTypeDropDowns();
    if (isAdvancedQueryModule()) {
        enableDisableRefresh(false, null, true);
    } else {
        populateEquipmentTypeDropDowns();
    }
    if (viewerDashboardId == parent.DASHBOARD_ID_MAP_VIEW) {
        parent.toggleButton(false, "marketView", "icon-market-view-disable", "icon-market-view");
    }
    removeHighlightPlacemarks();
}

function onBeforeRunQuery(dashboardId) {
	IS_APPLY_FILTER = true;
    if (parent.isNetworkQuery) {
        //isNetworkScheduleDataAvailable = false;
        dayWhereClauses[window[dashboardId].LAYER_ID_NETWORK_LANES] = "";
        dayWhereClauses[window[dashboardId].LAYER_ID_NETWORK_SCHEDULE_LEGS] = "";
        if (isAdvancedQueryModule()) {
            updateViewerToggleButton();
        }
        window[dashboardId].clearLayers(window[dashboardId].LAYER_IDS_NETWORK);

        if (intImage != 1) {
            toggleView($("#" + viewerToggleBtnDivId, parent.document)[0], false);
        }
    } else {
        dayWhereClauses[window[dashboardId].LAYER_ID_SCHEDULE_LEGS] = "";
        window[dashboardId].clearLayers(window[dashboardId].LAYER_IDS_SCHEDULE);
        SkdMxHelper.getMapOpeationManager().setByLegQuery(parent.getDashboardContentWindow(parent.DASHBOARD_ID_QUERY).isByLegQuery());
    }
    closePopups(true);
    clearSync(false);
    setDefaultDirection();
    removeHighlightPlacemarks();
    
}

function removeHighlightPlacemarks() {
    var graphic;
    var dojoColorCode = new dojo.Color([153, 153, 153]);

    for (var i = 0; i < parent.selectedHighlightedGraphic.length; i++) {
        graphic = parent.selectedHighlightedGraphic[i];
        if (graphic.symbol.outline) {
            graphic.symbol.outline.setColor(dojoColorCode);
        }
        graphic.setSymbol(graphic.symbol.setColor(dojoColorCode));
    }
}

function setDefaultDirection() {
    var queryWindow = parent.getDashboardContentWindow(parent.DASHBOARD_ID_QUERY);
    if (queryWindow) {
        var directionBtnName = "btnMapDirection";
        if (viewerDashboardId == parent.DASHBOARD_ID_SCHEMATIC_VIEW) {
            directionBtnName = "btnSchematicDirection";
        }
        var isInbound = queryWindow.hasPreviousData();
        var isOutbound = queryWindow.hasNextData();
        if (isInbound && !isOutbound) {
            directionBtnConstant = 1;
        } else if (!isInbound && isOutbound) {
            directionBtnConstant = 2;
        } else {
            directionBtnConstant = 3;
        }
        toggleDirection($("#" + directionBtnName, parent.document)[0], false);
    }
}

/* Initialize the controls */

function initialize() {
    //MultiSelect Component - A user extension of KendoUI DropDownList widget
    multiSelectComponent();
    //adding header buttons
    addButtonsBar();
    //setting LOCALE as default view.
    setLocalZuluButtonState(parent.isLocalTimeFlag(), false);
    //initializing the favorites
    favoriteComponent = new FavoriteComponent(viewerDashboardId, favoritesMenuId, (favoritesMenuId == "mapViewerFavoritesMenu") ? "Map View" : "Schematic View");
    //if the favorite(s) are already cached
    if (parent.getFavoriteDataCache() != null) {
        // then initialize from cache 
        favoriteComponent.onInitalizeFavorite(parent.getFavoriteDataCache());
    } else {
        //as favorite(s) are not cached, so retrieve favorites from database and render(s) the favorites menu
        favoriteComponent.retrieveAllFavorites();
    }
    //initializing display options...
    initializeDisplayOptions();
    //logic to handle the map viewer dashboard title & change the icon class from network to schedule overlay 
    //or from schedule overlay to network or to schedule view
    updateViewerToggleButton(true);
    //if the current dashboard is schematic...
    if (viewerDashboardId == parent.DASHBOARD_ID_SCHEMATIC_VIEW) {
        //then synchronize the schematic viewer setting(s) with map.(includes display options etc.,)
        syncSchematicViewerSettingsWithMap();
    }
    //refresh / load the necessary layers...
    refresh();
    //if network or schematic dashboard synchronization is ON 
    if (parent.isAtleastOneSyncOn) {
        //then disable the refresh option on the map viewer dashboard.... 
        enableDisableRefresh(false);
    } else {
        //if network and schematic dashboard synchronization is OFF then enable the refresh functionality
        enableDisableRefresh(parent.hasRunQuery(), null, true);
    }
}

/**
 * adding header buttons to map viewer dashboard 
 */

function addButtonsBar() {
    parent.VIEWER.addButtonsBar(viewerDashboardId, $("#headerButtonsBar"));
}

function setIsScheduleForNetworkFlag(flag) {
    isScheduleForNetworkFlag = flag;
}

function refresh() {
    if (parent.needToLoadData(viewerDashboardId, isScheduleForNetworkFlag)) {
        refreshDashboard();
    }
}

function refreshViewer() {
    if (parent.isNetworkQuery) {
        if (isSyncOn) {
            if (parent.isNetworkQuery) {
                if (parent.getIsScheduleForNetworkFlagInSync(viewerDashboardId) != undefined ? parent.getIsScheduleForNetworkFlagInSync(viewerDashboardId) : isScheduleForNetworkFlag) {
                    loadNetworkScheduleData();
                } else {
                    onNetworkQuerySuccess();
                }
            }
        } else if (isScheduleForNetworkFlag) {
            loadNetworkScheduleData();
        } else {
            onNetworkQuerySuccess();
        }
    } else {
        onScheduleQuerySuccess();
    }
}

function refreshDashboard() {
    refreshViewer();
}

function getLayerIdByDataType(dataType) {
    if (dataType == parent.DATA_TYPE_NETWORK_SCHEDULE) {
        return window[viewerDashboardId].LAYER_ID_NETWORK_SCHEDULE_LEGS;
    }
    if (dataType == parent.DATA_TYPE_NETWORK) {
        return window[viewerDashboardId].LAYER_ID_NETWORK_LANES;
    } else {
        return window[viewerDashboardId].LAYER_ID_SCHEDULE_LEGS;
    }
}

/**
 * get the layer id...
 * @returns
 */

function getLayerId() {
    if (parent.isNetworkQuery) {
        if (isScheduleForNetworkFlag) {
            return window[viewerDashboardId].LAYER_ID_NETWORK_SCHEDULE_LEGS;
        }
        return window[viewerDashboardId].LAYER_ID_NETWORK_LANES;
    } else {
        return window[viewerDashboardId].LAYER_ID_SCHEDULE_LEGS;
    }
}

function onPlanChange() {
    dayWhereClauses = {};
    SkdMxHelper.getDrawer().resetSkdMxDrawerOnPlanChangeHandler();
}

function onBeforeTabSelect(tabName) {
    closePopups();
}

function onTabSelect(tabName) {
    showNetworkDisplayOptionsTab(parent.isNetworkQuery && !isScheduleForNetworkFlag);
    if (isAdvancedQueryModule()) {
        updateViewerToggleButton();
        enableDisableRefresh(parent.hasRunQuery(), null, !parent.hasRunQuery());
    }
    showLayers();
    marketviewTabChangeHandler(tabName);
    refresh();
}

function marketviewTabChangeHandler(tabName) {
    if (tabName == parent.DATA_TYPE_NETWORK || tabName == parent.DATA_TYPE_NETWORK_SCHEDULE) {
        if (marketviewPopUp) {
            marketviewPopUp.closeAll();
        }
        parent.toggleButton(false, "marketView", "icon-market-view-disable", "icon-market-view");
    } else {
        if (parent.hasRunQuery()) {
            parent.toggleButton(true, "marketView", "icon-market-view-disable", "icon-market-view");
        } else {
            parent.toggleButton(false, "marketView", "icon-market-view-disable", "icon-market-view");
        }
        if (marketviewPopUp) {
            marketviewPopUp.updateMarketViewWindows();
        }
    }
}

function updateDashboardTitle() {
    var title = viewerDashboardId == parent.DASHBOARD_ID_MAP_VIEW ? "Map: " : "Schematic: ";
    if (parent.isNetworkQuery) {
        if (isScheduleForNetworkFlag) {
            title += "Schedule Overlay View";
        } else {
            title += "Network View";
        }
    } else {
        title += "Schedule View";
    }

    parent.setDashboardTitle(viewerDashboardId, title);
}

function onNetworkQuerySuccess(isImplicitNetworkScheduleLoading) {
    loadLayer(window[viewerDashboardId].ECOEXPML_NETWORK_LANES, window[viewerDashboardId].LAYER_ID_NETWORK_LANES, addNetworkLayer, isImplicitNetworkScheduleLoading);
}



function onNetworkScheduleQuerySuccess() {
    if (isAdvancedQueryModule()) {
        updateViewerToggleButton();
    }
    callLegTypeService();
    callEquipmentTypeService();
    if (parent.isNetworkQuery && isScheduleForNetworkFlag) {
        loadNetworkScheduleData();
    }
}

function loadNetworkScheduleData() {
    loadLayer(window[viewerDashboardId].ECOEXPML_SCHEDULE_LEGS, window[viewerDashboardId].LAYER_ID_NETWORK_SCHEDULE_LEGS, addNetworkScheduleLayer);
}

function onScheduleQuerySuccess() {
    loadLayer(window[viewerDashboardId].ECOEXPML_SCHEDULE_LEGS, window[viewerDashboardId].LAYER_ID_SCHEDULE_LEGS, addScheduleLayer);
}

function callLegTypeService() {
    if (parent.isLegTypeDataLoaded()) {
        return;
    }

    var legTypeSearchCriteria = new SearchCriteria();
    legTypeSearchCriteria.setCriteria(CRITERIA_BROWSER_SESSION_ID, parent.getBrowserSessionId());
    legTypeSearchCriteria.setCriteria(CRITERIA_IS_NW_RELATED, parent.isNetworkQuery);

    var params = {};
    params.commonCaseId = parent.getCommonCaseId();
    params.effDayPatternStr = parent.getSelectedEffDayStrPattern();    
    params.searchcriteria = legTypeSearchCriteria.getSearchCriteria();

    //service request to load legType comboboxes
    callService({
        url: getScheduleLegTypeUrl(),
        paramsMap: params,
        successCallback: successCallBackFnLegType,
        failureCallback: onServiceRequestFailureLegType,
        showProgressWindow: false
    });
}

function callEquipmentTypeService() {
    if (parent.isEquipmentTypeDataLoaded()) {
        return;
    }

    var equipmentTypeSearchCriteria = new SearchCriteria();
    equipmentTypeSearchCriteria.setCriteria(CRITERIA_BROWSER_SESSION_ID, parent.getBrowserSessionId());
    equipmentTypeSearchCriteria.setCriteria(CRITERIA_IS_NW_RELATED, parent.isNetworkQuery);

    var params = {};
    params.commonCaseId = parent.getCommonCaseId();
    params.effDayPatternStr = parent.getSelectedEffDayStrPattern();    
    params.searchcriteria = equipmentTypeSearchCriteria.getSearchCriteria();

    //service request to load legType comboboxes
    callService({
        url: getScheduleEquipmentTypeSearchCriteriaTypeUrl(),
        paramsMap: params,
        successCallback: successCallBackFnEquipmentType,
        failureCallback: onServiceRequestFailureLegType,
        showProgressWindow: false
    });
}

function successCallBackFnLegType(response, io) {
    if (response && response._errorCd && response._errorCd > 0) {
        parent.showFilterErrorMsg(response._errorDesc);
    } else {
        parent.setLegTypeData(response);
    }

    if (!parent.isNetworkQuery || (parent.isNetworkQuery && isScheduleForNetworkFlag)) {
        populateLegTypeDropDowns();
    }
}

function successCallBackFnEquipmentType(response, io) {
    if (response && response._errorCd && response._errorCd > 0) {
        parent.showFilterErrorMsg(response._errorDesc);
    } else {
        parent.setEquipmentTypeData(response);
    }

    if (!parent.isNetworkQuery || (parent.isNetworkQuery && isScheduleForNetworkFlag)) {
        populateEquipmentTypeDropDowns();
    }
}

function populateEquipmentTypeDropDowns() {
    if (parent.isNetworkQuery && isScheduleForNetworkFlag) {
        $('#networkEquipmenttypeOptions').show();
        $('#scheduleEquipmenttypeOptions').hide();
        if (typeof AdvancedMultiSelectComponent == "function") {
            AdvancedMultiSelectComponent.refreshDatasource("networkEquipmentFlyCombo", "EquipmentTypesFly");
            AdvancedMultiSelectComponent.refreshDatasource("networkEquipmentTruckCombo", "EquipmentTypesTruck");
        }
    } else {
        $('#networkEquipmenttypeOptions').hide();
        $('#scheduleEquipmenttypeOptions').show();
        if (typeof AdvancedMultiSelectComponent == "function") {
            AdvancedMultiSelectComponent.refreshDatasource("scheduleEquipmentFlyCombo", "EquipmentTypesFly");
            AdvancedMultiSelectComponent.refreshDatasource("scheduleEquipmenttruckCombo", "EquipmentTypesTruck");
        }
    }
}

function populateLegTypeDropDowns() {
    if (isAdvancedQueryModule()) {
        var legTypeDatasource = parent.getLegTypeData(isScheduleForNetworkFlag);
        if (parent.isNetworkQuery && isScheduleForNetworkFlag) {
            $('#networkLegtypeOptions').show();
            //$('#scheduleLegtypeOptions').hide();
            $("#networkFlyCombo").data("kendoMultiSelectBox").setDataSource(legTypeDatasource['F']);
            $("#networkTruckCombo").data("kendoMultiSelectBox").setDataSource(legTypeDatasource['T']);
        } else {
            $('#networkLegtypeOptions').hide();
            //$('#scheduleLegtypeOptions').show();
            //$("#scheduleFlyCombo").data("kendoMultiSelectBox").setDataSource(legTypeDatasource['F']);
            //$("#scheduletruckCombo").data("kendoMultiSelectBox").setDataSource(legTypeDatasource['T']);
        }
    } else {
        if (parent.isNetworkQuery && isScheduleForNetworkFlag) {
            $('#networkLegtypeOptions').show();
            $('#scheduleLegtypeOptions').hide();
            if (typeof AdvancedMultiSelectComponent == "function") {
                AdvancedMultiSelectComponent.refreshDatasource("networkFlyCombo", "legTypesFly");
                AdvancedMultiSelectComponent.refreshDatasource("networkTruckCombo", "legTypesTruck");
            }
        } else {
            $('#networkLegtypeOptions').hide();
            $('#scheduleLegtypeOptions').show();
            if (typeof AdvancedMultiSelectComponent == "function") {
                AdvancedMultiSelectComponent.refreshDatasource("scheduleFlyCombo", "legTypesFly");
                AdvancedMultiSelectComponent.refreshDatasource("scheduletruckCombo", "legTypesTruck");
            }
        }
    }
}

function onServiceRequestFailureLegType(response, io) {
    //	alert(response);
}

function onDaySelect(selectedDays, dataType) {
/*if(viewerDashboardId == parent.DASHBOARD_ID_MAP_VIEW) {
		enableLabelDisplayOptions(getNumberValue(selectedDays) > 0);
	}*/
    setDayWhereClause(selectedDays, getLayerIdByDataType(dataType));
    parent.setDashboardDataStatus(viewerDashboardId, parent.DATA_TYPE_NETWORK_SCHEDULE, false);
    closePopups();
    refresh();
}

function getNumberValue(text) {
    try {
        if (text.toString().indexOf(",") >= 0) {
            return -1;
        }
        return parseInt(text);
    } catch (e) {}

    return -1;
}

function getTextLength(text) {
    return parent.VIEWER.getTextLength(text);
}

function loadFacLocsLayer(ecoexpml, layerId, callbackMethod, facTypes) {
    var params = new Object();
    params.facTypes = JSON.stringify(facTypes);
    params.ecoexpmodel = ecoexpml;
    params.renderdata = "true";
    params.rendertype = "json";
    params.layerid = layerId;
    params.commonCaseId = parent.getCommonCaseId();
    params.effDayPatternStr = parent.getSelectedEffDayStrPattern();    
    params.scheduleId = parent.getScheduleId();
    params.browserSessionId = parent.getBrowserSessionId();
    params.isDontFireEcosystemEvents = true;
    params.layerMinScale = getLodIndex();
    params.labelType = getGeneralDisplaySettings().labeltype;

    var windowTitle = "Please wait...";
    callService({
        url: LAYER_REQUEST_URL,
        paramsMap: params,
        successCallback: callbackMethod,
        showProgressWindow: true,
        progressDialogTitle: windowTitle
    });
}

function addFacLocsLayer(response, io) {
    window[parent.DASHBOARD_ID_MAP_VIEW].addLayer(response, io);
    //reorder the layers ..so that always facility graphics are at the bottom
    esriMap.reorderAllLayers(window[viewerDashboardId].LAYER_ID_FACILITY_LOCATIONS, 0);
    $("#applyDisplaySettings").removeAttr("disabled");
}

function loadLayer(ecoexpml, layerId, callbackMethod, isImplicitNetworkScheduleLoading) {
    //close any existing popup
    closePopups();

    var params = {};
    params.ecoexpmodel = ecoexpml;
    params.renderdata = "true";
    params.rendertype = "json";
    params.layerid = layerId;
    params.commonCaseId = parent.getCommonCaseId();
    params.effDayPatternStr = parent.getSelectedEffDayStrPattern();    
    params.scheduleId = parent.getScheduleId();
    params.labelType = labelType;
    params.browserSessionId = parent.getBrowserSessionId();
    params.returnAll = isReturnAll;
    params.isLocalTime = isLocalFlag;
    params.isDontFireEcosystemEvents = true;

    popupLinkTemplateMap[layerId] = {};

    var windowTitle = "Please wait...";
    if (parent.isNetworkQuery) {
        //params.primaryLocs = parent.getPrimaryLocations();
        if (layerId == window[viewerDashboardId].LAYER_ID_NETWORK_SCHEDULE_LEGS) {
            windowTitle = "Loading schedule " + PROGRESS_DIALOG_TITLE + " view for the network...";
        } else if (layerId == window[viewerDashboardId].LAYER_ID_NETWORK_LANES) {
            windowTitle = "Loading network " + PROGRESS_DIALOG_TITLE + " view...";
        }

    } else {
        params.isScheduleQuery = true;
        if (layerId == window[viewerDashboardId].LAYER_ID_SCHEDULE_LEGS) {
            windowTitle = "Loading schedule " + PROGRESS_DIALOG_TITLE + " view...";
        }
        params.isShowDeletedRoutes = parent.getDashboardContentWindow(parent.DASHBOARD_ID_QUERY).$("#showDeletedChk").is(":checked");
    }

    if (!isSyncOn) {
        setSearchCriteria(CRITERIA_BROWSER_SESSION_ID, parent.getBrowserSessionId(), false, layerId);
    }
    if (layerId != window[viewerDashboardId].LAYER_ID_NETWORK_LANES) {
        if (!isSyncOn) {
            if (layerId == window[viewerDashboardId].LAYER_ID_SCHEDULE_LEGS) {
                setSearchCriteria(CRITERIA_IS_NW_RELATED, false);
            } else {
                setSearchCriteria(CRITERIA_IS_NW_RELATED, isScheduleForNetworkFlag);
            }
        }
        params.volumePercentageBy = getVolumePercentageType();
        params.cautionUnder = getCautionUnder();
        params.cautionNormal = getCautionNormal();
        params.cautionLow = getCautionLow();
        params.cautionHigh = getCautionHigh();

        params.isCautionUnder = isCautionUnder();
        params.isCautionNormal = isCautionNormal();
        params.isCautionLow = isCautionLow();
        params.isCautionHigh = isCautionHigh();

        params.isShowRouteNo = isShowRouteNo;
        params.isShowIATADesc = isShowIATADesc;
        params.isShowEquipCode = isShowEquipCode;
        params.isShowDepartureTime = isShowDepartureTime;
        params.isShowArrivalTime = isShowArrivalTime;
        params.isShowEffectiveDays = isShowEffectiveDays;
    } else {
        if (viewerDashboardId == parent.DASHBOARD_ID_SCHEMATIC_VIEW) {
            params.isShowDepartureDays = isShowDepartureDays;
            params.isShowArrivalDays = isShowArrivalDays;
            params.isShowAvailableTime = isShowAvailableTime;
            params.isShowDueTime = isShowDueTime;
        }
    }
    //release 1.1: zoom level for labels
    if (viewerDashboardId != parent.DASHBOARD_ID_SCHEMATIC_VIEW) {
        params.layerMinScale = getLodIndex();
        params.mapZoomLevel = getMapZoomLevel();
    }
    //set the general tab settings that are used to filter the data 
    setGeneralTabParameters(params);

    if (layerId == window[viewerDashboardId].LAYER_ID_NETWORK_SCHEDULE_LEGS) {
        if (!isSyncOn) {
            if (searchCriterias[window[viewerDashboardId].LAYER_ID_NETWORK_LANES] != undefined && searchCriterias[window[viewerDashboardId].LAYER_ID_NETWORK_LANES].getSearchCriteria()) {
                params.nwSearchCriteria = searchCriterias[window[viewerDashboardId].LAYER_ID_NETWORK_LANES].getSearchCriteria();
                var nwSelectedDays = parent.getDashboardSelectedDays(viewerDashboardId, parent.DATA_TYPE_NETWORK);
                var nwWhereClause = getWhereClause(window[viewerDashboardId].LAYER_ID_NETWORK_LANES);
                if (activityWhereClause != "") {
                    params.nwActivityWhereClause = activityWhereClause;
                }
                if (nwWhereClause && nwWhereClause != "") {
                    params.nwWhereClause = nwWhereClause;
                }
            }
        } else {
            if (viewerSyncSearchCriterias[window[viewerDashboardId].LAYER_ID_NETWORK_LANES] != undefined) {
                if (viewerSyncSearchCriterias[window[viewerDashboardId].LAYER_ID_NETWORK_LANES].searchCriteria) {
                    params.nwSearchCriteria = viewerSyncSearchCriterias[window[viewerDashboardId].LAYER_ID_NETWORK_LANES].searchCriteria.getSearchCriteria();
                }
                if (viewerSyncSearchCriterias[window[viewerDashboardId].LAYER_ID_NETWORK_LANES].whereClause) {
                    params.nwWhereClause = viewerSyncSearchCriterias[window[viewerDashboardId].LAYER_ID_NETWORK_LANES].whereClause;
                }
            }
        }
    }

    if (!isSyncOn) {
        params.searchcriteria = searchCriterias[layerId].getSearchCriteria();
        var whereClause = getWhereClause(layerId);
        if (whereClause) {
            params.whereClause = whereClause;
        }
        if (layerId == window[viewerDashboardId].LAYER_ID_NETWORK_LANES) {
            if (activityWhereClause != "") {
                params.activityWhereClause = activityWhereClause;
            }
        }
    } else {
        if (viewerSyncSearchCriterias[layerId] && viewerSyncSearchCriterias[layerId].searchCriteria) {
            params.searchcriteria = viewerSyncSearchCriterias[layerId].searchCriteria.getSearchCriteria();
        }
        if (viewerSyncSearchCriterias[layerId] && viewerSyncSearchCriterias[layerId].whereClause) {
            params.whereClause = viewerSyncSearchCriterias[layerId].whereClause;
        }
    }
    params.flightConveyanceType = getFlightConveyanceType();
    params.truckCapacityType = getTruckConveyanceType();
    if (typeof(this.getFacLocStatus) != "undefined") params.facTypes = JSON.stringify(getFacLocStatus());

    callService({
        url: LAYER_REQUEST_URL,
        paramsMap: params,
        successCallback: function(response, io) {
            callbackMethod(response, io);
            afterLoadLayerEvent(response, io);
            if (isImplicitNetworkScheduleLoading) {
                parent.commonViewer.toggleNetworkScheduleView(response, io, isImplicitNetworkScheduleLoading);
                parent.VIEWER.onNetworkScheduleQuerySuccess();
            }
        },
        showProgressWindow: true,
        progressDialogTitle: windowTitle
    });
}

/**
 * method that set the additional general tab settings
 * @param params
 */

function setGeneralTabParameters(params) {
    //hub location logic
    if (parent.isNetworkQuery) {
        params.hubActivityType = getHubActivityType();
    }
    //release 1.2: Add setting that allows users to show or hide numbers and symbols on map/schematic  lines
    //condition checks for both schematic and map viewer to identify whether the print service is running or not
    if (typeof esriMap === "undefined" || (typeof esriMap != "undefined" && esriMap.isPrintting === false)) {
        if ($('input[id=shwNumberSymbolsId]').length > 0) {
            //found the NUmbers checkbox
            params.shwNumberSymbols = $('input[id=shwNumberSymbolsId]').is(':checked');
        } else {
            //not ound the NUmbers checkbox....default to true (Mostly in schematic)
            params.shwNumberSymbols = true;
        }
        if ($('input[id=shwPictureMarkerSymbolsId]').length > 0) {
            //found the Symbols checkbox....
            params.shwPictureMarkerSymbols = $('input[id=shwPictureMarkerSymbolsId]').is(':checked');
        } else {
            //not found the Symbols checkbox....default to true	 (Mostly in schematic)	
            params.shwPictureMarkerSymbols = true;
        }
    }
}



function getWhereClause(layerId) {
    var whereClause;
    if (whereClauses[layerId] && whereClauses[layerId] != "") {
        whereClause = whereClauses[layerId];
    }

/*
	if(layerId == window[viewerDashboardId].LAYER_ID_NETWORK_LANES) {
		if(activityWhereClause != "") {
			if(whereClause) {
				whereClause += " AND "+activityWhereClause;
			} else {
				whereClause = activityWhereClause;
			}
		}
	}
	*/
    var dataType = parent.getDataType(isScheduleForNetworkFlag);
    if (layerId == window[viewerDashboardId].LAYER_ID_NETWORK_LANES) {
        //changes are made to identify whether selected day(s) are available in available days of the plan..if not then select the first day 
        //of the available days
        if (dayWhereClauses != undefined && (((dayWhereClauses[layerId] == undefined || dayWhereClauses[layerId] == "") || !parent.isValidDayWhereClause(dataType, dayWhereClauses[layerId])))) {
            var firstDay = parent.getFirstAvailableDay(dataType);
            if (firstDay != undefined) {
                parent.setDashboardSelectedDays(viewerDashboardId, dataType, [firstDay]);
                setDayWhereClause(firstDay, layerId);
            }
        }
    }

    if (dayWhereClauses != undefined && dayWhereClauses[layerId] && dayWhereClauses[layerId] != "") {
        if (whereClause) {
            whereClause += " AND " + dayWhereClauses[layerId];
        } else {
            whereClause = dayWhereClauses[layerId];
        }
    }

    return whereClause;
}

function addNetworkLayer(response, io) {
    window[viewerDashboardId].addLayer(response, io);
    parent.setDashboardDataStatus(viewerDashboardId, parent.DATA_TYPE_NETWORK, true);
    //    printLogger(viewerDashboardId + " onNetworkQuerySuccess");
}

function addNetworkScheduleLayer(response, io) {
    window[viewerDashboardId].addLayer(response, io);
    parent.setDashboardDataStatus(viewerDashboardId, parent.DATA_TYPE_NETWORK_SCHEDULE, true);
    //    printLogger(viewerDashboardId + " onNetworkScheduleQuerySuccess");
}

function addScheduleLayer(response, io) {
    callLegTypeService();
    callEquipmentTypeService();
    window[viewerDashboardId].addLayer(response, io);
    parent.setDashboardDataStatus(viewerDashboardId, parent.DATA_TYPE_SCHEDULE, true);
    //    printLogger(viewerDashboardId + " onScheduleQuerySuccess");
    if(viewerDashboardId == parent.DASHBOARD_ID_MAP_VIEW){
        marketviewTabChangeHandler(parent.DATA)
    }
}

function afterLoadLayerEvent(response, io) {
/*if (isAdvancedQueryModule()) { //need to conform 
        //custom code
    } else {
        isSyncMatrix = true;
        isSyncVolumeAndAllocationMatrix = true;
    }*/
    syncDashboards();
}

function setWhereClause(whereClause, layerId) {
    if (!layerId) {
        layerId = getLayerId();
    }

    whereClauses[layerId] = parent.escapeWhereClause(whereClause);
}

function setDayWhereClause(selectedDays, layerId) {
    if (!layerId) {
        layerId = getLayerId();
    }
    if (selectedDays != undefined) {
        selectedDays = getDaysArray(selectedDays).toString();
        var whereClause = " DAY in (" + selectedDays + ")";
        if (layerId != window[viewerDashboardId].LAYER_ID_NETWORK_LANES && layerId != window[viewerDashboardId].LAYER_ID_SCHEDULE_LEGS && layerId != window[viewerDashboardId].LAYER_ID_NETWORK_SCHEDULE_LEGS) {
            whereClause += " and BROWSER_SESSION_ID='" + parent.getBrowserSessionId() + "' and IS_NW_RELATED=" + parent.isNetworkQuery;
        }
        dayWhereClauses[layerId] = parent.escapeWhereClause(whereClause);
    } else {
        dayWhereClauses[layerId] = "";
    }
}


function setSearchCriteria(name, value, isMatchAny, layerId, type, operator) {
    if (!layerId) {
        layerId = getLayerId();
    }
    if (!searchCriterias[layerId]) {
        searchCriterias[layerId] = new SearchCriteria();
    }

    searchCriterias[layerId].setCriteria(name, value, isMatchAny, type, operator);
}

function openDayControl(btn) {
    parent.VIEWER.openDayControl(btn, viewerDashboardId, parent.getDataType(isScheduleForNetworkFlag));
}

/******* header button methods - start *******/

/**
 * this method is to used to toggle between LOCALE / ZULU and refresh the viewer 
 * @param isLocalFlag  --- indicates whether its LOCALE /ZULU. if LOCALE then true else false for ZULU
 * @param isRefreshViewer --- flag to indicate whether to refresh or not
 * @param isLocalZuluButtonDisabled --- flag that indicates whether locale/zulu button is disable or not
 * @param clickHandler	--- callback handler.
 */

function setLocalZuluButtonState(isLocalFlag, isRefreshViewer, isLocalZuluButtonDisabled, clickHandler) {
    // get the local zulu button...
    var btn = parent.$('#' + localZuluBtnName)[0];
    //set the state of the button
    if (btn != undefined) {
        btn.toggled = isLocalFlag;
    }
    //update refresh viewer state
    var refreshViewerFlag = true;
    if (isRefreshViewer != undefined) {
        refreshViewerFlag = isRefreshViewer;
    }
    //switch from local / zulu ... 
    if (btn != undefined) {
        toggleTimeView(btn, refreshViewerFlag, isLocalZuluButtonDisabled);
        //trigger callback handler...
        if (clickHandler) {
            $(btn).attr('onclick', clickHandler).bind('click');
        }
    }
}

/**
 * logic to reset the dashboard data status and refresh the dashboard w.r.t local/zulu flag
 * @param btn	--- local /zulu button object....
 * @param isRefreshViewer --- flag to indicate whether to refresh or not
 * @param isLocalZuluButtonDisabled --- flag that indicates whether locale/zulu button is disable or not
 */

function toggleTimeView(btn, isRefreshViewer, isLocalZuluButtonDisabled) {
    //if not the locale / zulu button is not disabled 
    if (!(isLocalZuluButtonDisabled != null && isLocalZuluButtonDisabled == true)) {
        //then reset the dashboard data status only when the dashboard require(s) refresh...
        if (isRefreshViewer) {
            if (parent.isDataLoaded(parent.DATA_TYPE_NETWORK)) {
                parent.setDashboardDataStatus(viewerDashboardId, parent.DATA_TYPE_NETWORK, false);
            }

            if (parent.isDataLoaded(parent.DATA_TYPE_NETWORK_SCHEDULE)) {
                parent.setDashboardDataStatus(viewerDashboardId, parent.DATA_TYPE_NETWORK_SCHEDULE, false);
            }
            if (parent.isDataLoaded(parent.DATA_TYPE_SCHEDULE)) {
                parent.setDashboardDataStatus(viewerDashboardId, parent.DATA_TYPE_SCHEDULE, false);
            }
        }
    }
    if (typeof(SkdMxHelper) != "undefined" && SkdMxHelper != undefined) SkdMxHelper.getSkdMxGridComponentManager().showLocalZuluColumns(btn);
    parent.VIEWER.toggleTimeView(btn, isLocalZuluButtonDisabled, viewerDashboardId);
    if (!(isLocalZuluButtonDisabled != null && isLocalZuluButtonDisabled == true)) {
        isLocalFlag = !btn.toggled;
    }
    //refresh the  dashboard.
    if (isRefreshViewer) {
        refresh();
    }
}

function toggleView(btn, isRefreshDashboard, isSyncViewer) {
    if (btn == null) {
        return;
    }
    closePopups();
    currentViewerConstant = intImage;
    switch (intImage) {
    case 1:
        btn.children[0].className = Icon_Schedule_Overlay;
        btn.children[0].title = Tooltip_Map_Switch_To_Network;
        intImage = 2;

        setIsScheduleForNetworkFlag(true);
        //			marketviewTabChangeHandler("Schedule");
        enableDisableRefresh(isSyncOn ? false : parent.isDataLoaded(parent.DATA_TYPE_NETWORK_SCHEDULE));
        break;
    case 2:
        btn.children[0].className = Icon_Network_Overlay;
        btn.children[0].title = Tooltip_Map_Switch_To_Schedule;
        intImage = 1;

        setIsScheduleForNetworkFlag(false);
        //			marketviewTabChangeHandler("Network");
        enableDisableRefresh(isSyncOn ? false : parent.isDataLoaded(parent.DATA_TYPE_NETWORK));
        break;
    default:
        break;
    }
    updateViewerToggleButton(null, isSyncViewer);
    /*
     * Defect: When toggle from Network to schedule in schematic view, the display options are not getting synced with the tab selection... 
     * Fixes are made...
     */
    showNetworkDisplayOptionsTab(parent.isNetworkQuery && !isScheduleForNetworkFlag);
    showLayers();
    if (parent.isNetworkQuery && isScheduleForNetworkFlag || !parent.isNetworkQuery) {
        marketviewTabChangeHandler("Schedule");
    } else if (parent.isNetworkQuery) {
        marketviewTabChangeHandler("Network");
    }
    if (isRefreshDashboard) {
        refresh();
    }
    parent.switchFiters(isScheduleForNetworkFlag);
}

function validateToggledView(isMapViewSynchronization, sourceDashboardId, buttonSrc) {
    var currentView = sourceDashboardId + currentViewerConstant + parent.isNetworkQuery;

    if (isAdvancedQueryModule()) {
        advancedQueryWindowToggleViewValidator(currentView, isMapViewSynchronization, sourceDashboardId, buttonSrc);
    } else {
        simpleQueryWindowToggleViewValidator(currentView, isMapViewSynchronization, sourceDashboardId, buttonSrc);
    }
}

function advancedQueryWindowToggleViewValidator(currentView, isMapViewSynchronization, sourceDashboardId, buttonSrc) {
    switch (currentView) {
    case parent.DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX + "1false":
        parent.getDashboardContentWindow(parent.DASHBOARD_ID_QUERY).tabSelectHandler(parent.DATA_TYPE_NETWORK);
        break;
    case parent.DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX + "2false":
        parent.getDashboardContentWindow(parent.DASHBOARD_ID_QUERY).tabSelectHandler(parent.DATA_TYPE_NETWORK);
        toggleView(buttonSrc, true);
        break;
    case parent.DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX + "2true":
        toggleView(buttonSrc, true);
        break;
    case parent.DASHBOARD_ID_NETWORK_SUMMARY_MATRIX + "2false":
    case parent.DASHBOARD_ID_NETWORK_MATRIX + "2false":
        parent.getDashboardContentWindow(parent.DASHBOARD_ID_QUERY).tabSelectHandler(parent.DATA_TYPE_NETWORK);
        break;
    case parent.DASHBOARD_ID_MAP_VIEW + "1true":
    case parent.DASHBOARD_ID_MAP_VIEW + "2true":
    case parent.DASHBOARD_ID_SCHEMATIC_VIEW + "1true":
    case parent.DASHBOARD_ID_SCHEMATIC_VIEW + "2true":
        parent.getDashboardContentWindow(parent.DASHBOARD_ID_QUERY).tabSelectHandler(parent.DATA_TYPE_NETWORK);
        if ((currentViewerConstant != parent.getDashboardContentWindow(sourceDashboardId).currentViewerConstant) && isMapViewSynchronization) toggleView(buttonSrc, true);
        break;
    case parent.DASHBOARD_ID_NETWORK_MATRIX + "1false":
    case parent.DASHBOARD_ID_NETWORK_SUMMARY_MATRIX + "1false":
        parent.getDashboardContentWindow(parent.DASHBOARD_ID_QUERY).tabSelectHandler(parent.DATA_TYPE_NETWORK);
        toggleView(buttonSrc, true);
        break;
    case parent.DASHBOARD_ID_NETWORK_SUMMARY_MATRIX + "1true":
    case parent.DASHBOARD_ID_NETWORK_MATRIX + "1true":
        toggleView(buttonSrc, true);
        break;
    case parent.DASHBOARD_ID_SCHEDULE_MATRIX + "1true":
    case parent.DASHBOARD_ID_SCHEDULE_MATRIX + "2true":
        parent.getDashboardContentWindow(parent.DASHBOARD_ID_QUERY).tabSelectHandler(parent.DATA_TYPE_SCHEDULE);
        break;
    }
}

function simpleQueryWindowToggleViewValidator(currentView, isMapViewSynchronization, sourceDashboardId, buttonSrc) {
    switch (currentView) {
    case parent.DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX + "1false":
    case parent.DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX + "2false":
    case parent.DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX + "2true":
        parent.uicontroller.showSchematicView(commonViewer.currentView, 'NetworkSchedule', false, true);
        parent.uicontroller.showNetworkTab('networkHPanel', 'networkVPanel');
        break;
    case parent.DASHBOARD_ID_NETWORK_MATRIX + "2false":
    case parent.DASHBOARD_ID_NETWORK_MATRIX + "1false":
    case parent.DASHBOARD_ID_NETWORK_SUMMARY_MATRIX + "2false":
    case parent.DASHBOARD_ID_NETWORK_SUMMARY_MATRIX + "1false":
        uicontroller.showSchematicView(commonViewer.currentView, 'Network', false, true);
        parent.uicontroller.showNetworkTab('networkHPanel', 'networkVPanel');
        break;
    case parent.DASHBOARD_ID_NETWORK_MATRIX + "1true":
    case parent.DASHBOARD_ID_NETWORK_SUMMARY_MATRIX + "1true":
        parent.uicontroller.showSchematicView(commonViewer.currentView, 'Network', false, true);
        break;
    case parent.DASHBOARD_ID_SCHEDULE_MATRIX + "1true":
    case parent.DASHBOARD_ID_SCHEDULE_MATRIX + "2true":
        parent.uicontroller.showSchematicView(commonViewer.currentView, 'Schedule', false, true);
        parent.uicontroller.showScheduleTab('scheduleHPanel', 'scheduleVPanel');
        break;
    case parent.DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX + "1true":
        parent.isScheduleForNetworkFlag = true;
        break;
    }
}

function toggleFilterDirection(value) {
    switch (value) {
    case "inbound":
        directionBtnConstant = 1;
        break;
    case "outbound":
        directionBtnConstant = 2;
        break;
    case "both":
        directionBtnConstant = 3;
        break;
    default:
        break;
    }
    var directionBtnName = "btnMapDirection";
    if (viewerDashboardId == parent.DASHBOARD_ID_SCHEMATIC_VIEW) {
        directionBtnName = "btnSchematicDirection";
    }
    toggleDirection($("#" + directionBtnName, parent.document)[0], false);
}


function toggleDirection(btn, isRefreshDashboard) {
    if (btn == null) {
        return;
    }
    var direction;
    currentDirectionBtnConstant = directionBtnConstant;
    switch (directionBtnConstant) {
    case 1:
        btn.children[0].className = Icon_Inbound_View;
        btn.children[0].title = ToolTip_Viewer_Inbound;
        directionBtnConstant = 2;
        direction = "I";
        break;
    case 2:
        btn.children[0].className = Icon_Outbound_View;
        btn.children[0].title = ToolTip_Viewer_Outbound;
        directionBtnConstant = 3;
        direction = "O";
        break;
    case 3:
        btn.children[0].className = Icon_Both_View;
        btn.children[0].title = ToolTip_Viewer_Both;
        directionBtnConstant = 1;
        break;
    default:
        break;
    }

    /**
     * Changes are made to filter the inbound / outbound in schedule overlay view tooo
     */
    if (parent.isNetworkQuery) {
        setSearchCriteria(CRITERIA_DIRECTION, direction, undefined, window[viewerDashboardId].LAYER_ID_NETWORK_LANES);
        if (!isScheduleForNetworkFlag) {
            parent.setDashboardDataStatus(viewerDashboardId, parent.DATA_TYPE_NETWORK_SCHEDULE, false);
        } else if (isScheduleForNetworkFlag) {
            parent.setDashboardDataStatus(viewerDashboardId, parent.DATA_TYPE_NETWORK, false);
        }
    }

    if (isRefreshDashboard) {
        refreshDashboard();
    }
}

function enableDisableDirection(btn, enableSync) {
    if (btn == null) {
        var directionBtnName = "btnMapDirection";
        if (viewerDashboardId == parent.DASHBOARD_ID_SCHEMATIC_VIEW) {
            directionBtnName = "btnSchematicDirection";
        }
        btn = $("#" + directionBtnName, parent.document);
    }
    var networkFlag;
    if (enableSync != null && enableSync == true) {
        networkFlag = false;
    } else {
        networkFlag = (parent.isNetworkQuery || isScheduleForNetworkFlag) && parent.isRunQuery;
    }
    var direction;
    switch (directionBtnConstant) {
    case 1:
        if (networkFlag) {
            btn[0].children[0].className = Icon_Both_View;
            btn[0].children[0].title = ToolTip_Viewer_Both;
            btn.attr('onclick', 'getDashboardContentWindow("' + viewerDashboardId + '").toggleDirection(this, true)').bind('click');
        } else {
            btn[0].children[0].className = ToolTip_Viewer_Both_Disabled;
            btn[0].children[0].title = ToolTip_Viewer_NoDirection;
            btn.attr('onclick', '').unbind('click');
        }
        break;
    case 2:
        if (networkFlag) {
            btn[0].children[0].className = Icon_Inbound_View;
            btn[0].children[0].title = ToolTip_Viewer_Inbound;
            btn.attr('onclick', 'getDashboardContentWindow("' + viewerDashboardId + '").toggleDirection(this, true)').bind('click');
        } else {
            btn[0].children[0].className = ToolTip_Viewer_Inbound_Disabled;
            btn[0].children[0].title = ToolTip_Viewer_NoDirection;
            btn.attr('onclick', '').unbind('click');
        }
        break;
    case 3:
        if (networkFlag) {
            btn[0].children[0].className = Icon_Outbound_View;
            btn[0].children[0].title = ToolTip_Viewer_Outbound;
            btn.attr('onclick', 'getDashboardContentWindow("' + viewerDashboardId + '").toggleDirection(this, true)').bind('click');
        } else {
            btn[0].children[0].className = ToolTip_Viewer_Outbound_Disabled;
            btn[0].children[0].title = ToolTip_Viewer_NoDirection;
            btn.attr('onclick', '').unbind('click');
        }
        break;
    default:
        break;
    }
}

function removeHighlight() {
    if (viewerDashboardId == parent.DASHBOARD_ID_MAP_VIEW) {
        parent.highlightBtn($("#btnMapSyncSchematic", parent.document)[0], false);
        parent.highlightBtn($("#btnMapSyncMatrix", parent.document)[0], false);
    } else {
        parent.highlightBtn($("#btnSchematicSyncMap", parent.document)[0], false);
        parent.highlightBtn($("#btnSchematicSyncMatrix", parent.document)[0], false);
    }
}

/**
 * logic to handle the map viewer dashboard title & change the icon class from network to 
 * schedule overlay or from schedule overlay to network or to schedule view
 * @param isGettingInitialized
 * @param isDisable
 */

function updateViewerToggleButton(isGettingInitialized, isDisable) {
    //get the button parent object
    var buttonParentElement = $("#" + viewerToggleBtnDivId, parent.document);
    if (buttonParentElement != undefined && buttonParentElement[0] != undefined) {
        //get the button object
        var buttonObj = buttonParentElement[0].children[0];
        if (buttonObj) {
            //checking for isSyncOn property in the viewerDashboard
/*if(parent.getDashboardContentWindow(viewerDashboardId).isSyncOn) {
				isDisable = true;
			}*/
            //if the isDisable flag is true
            if (isDisable != null && isDisable == true) {
                //then update the button with respective tooltips and styles
                buttonObj.className = Icon_Schedule_Overlay_Disabled; //"k-icon icon-schedule-overlay-view-disable";
                buttonObj.title = ToolTip_Viewer_NoNetworkView;
                if (parent.isNetworkQuery && !parent.isNetworkScheduleDataAvailable) {
                    buttonObj.title = ToolTip_Viewer_NoData;
                }
                buttonParentElement.attr('onclick', '').unbind('click');
            } else if (parent.isNetworkQuery && parent.isNetworkScheduleDataAvailable) {
                //if network query is executed and having the netowrk schedule data then 
                if (isScheduleForNetworkFlag) {
                    //update the tooltip and corresponding styles
                    buttonObj.className = Icon_Schedule_Overlay;
                    buttonObj.title = Tooltip_Map_Switch_To_Network;
                    if (!isGettingInitialized) {
                        //if it is initialized then checking whether the schedule overlay matirx is closed.... 
                        if (parent.isDashboardClosed(parent.DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX)) {
                            //if closed then open the dashboard and refresh 
                            parent.openDashboard(parent.DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX);
                            parent.refreshDashboard(parent.DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX);
                        }
                    }
                } else {
                    //if its not the schedule overlay then update the tooltips and styles to schedule query
                    buttonObj.className = Icon_Network_Overlay;
                    buttonObj.title = Tooltip_Map_Switch_To_Schedule; //fix #190
/*
					if(!isGettingInitialized) {
						parent.openDashboard(parent.DASHBOARD_ID_NETWORK_MATRIX);
					}
					*/
                }
                bindToggleButtonClick(buttonParentElement);
            } else {
                //if not then update the tooltip and styles to no data....
                buttonObj.className = Icon_Schedule_Overlay_Disabled; //"k-icon icon-schedule-overlay-view-disable";
                buttonObj.title = ToolTip_Viewer_NoNetworkView;
                if (parent.isNetworkQuery && !parent.isNetworkScheduleDataAvailable) {
                    buttonObj.title = ToolTip_Viewer_NoData;
                }
                buttonParentElement.attr('onclick', '').unbind('click');
            }
            //chnage the state of the inbound/outbound direction button ..accordingly...
            if (isAdvancedQueryModule()) {
                enableDisableDirection(null, isDisable);
            }
        }
    }
    //update the dashboard title...
    updateDashboardTitle();
} /******* header button methods - end *******/

/**
 * initializes all the common display setting(s)
 */

function initializeCommmonDisplayOptions() {
    createMultiSelectComboBox('networkFlyCombo', [], DATA_LEG_DESC, DATA_LEG_TYPE);
    createMultiSelectComboBox('networkTruckCombo', [], DATA_LEG_DESC, DATA_LEG_TYPE);
    createComboBox('railCombo', parent.getRailTypes());
    createComboBox('shipCombo', parent.getShipTypes());

    $("#networkFlyCombo").data("kendoMultiSelectBox").enable(false);
    $("#networkTruckCombo").data("kendoMultiSelectBox").enable(false);
    $("#railCombo").data("kendoComboBox").enable(false);
    $("#shipCombo").data("kendoComboBox").enable(false);
}

function getKendoComboBox(id) {
    return $("#" + id).data("kendoComboBox");
}

function addRemoveSettingHeight(addClass, removeClasses) {
    if (removeClasses == null) {
        removeClasses = ["mapScheduleSettings", "mapNetworkSettings", "mapNetworkLegendSettings", "mapScheduleLegendSettings", "mapGeneralSettings", "schematicNetworkSettings", "schematicNetworkLegendSettings", "schematicScheduleSettings", "schematicScheduleLegendSettings"];
    }
    for (var i = 0; i < removeClasses.length; i++) {
        $("#mapOptions").removeClass(removeClasses[i]);
    }
    $("#mapOptions").addClass(addClass);
}

/**
 * initializes the display option setting(s) based on the tab that is selected on Query Window...
 * @param isNetworkQuery - denotes whether the selected tab is network query or schedule query
 */

function showNetworkDisplayOptionsTab(isNetworkQuery) {
    var displaytabStrip = $("#displayOptionsTabstrip").data('kendoTabStrip');
    if (!isNetworkQuery) {
        $("#scheduletabli").show();
        $("#scheduletabDiv").show();
        $("#networktabli").hide();
        $("#networktabDiv").hide();
/*$("#scheduleLegend").show();
		$("#scheduleLegendTabDiv").show();
		$("#networkLegend").hide();
		$("#networkLegendTabDiv").hide();*/

        if (viewerDashboardId == parent.DASHBOARD_ID_SCHEMATIC_VIEW) {
            addRemoveSettingHeight("schematicScheduleSettings");
        } else {
            addRemoveSettingHeight("mapScheduleSettings");
        }

        displaytabStrip.select(displaytabStrip.tabGroup.children("li").eq(2));
        populateLegTypeDropDowns();
    } else {
        $("#scheduletabli").hide();
        $("#scheduletabDiv").hide();
        $("#networktabli").show();
        $("#networktabDiv").show();
/*$("#scheduleLegend").hide();
		$("#scheduleLegendTabDiv").hide();
		$("#networkLegend").show();
		$("#networkLegendTabDiv").show();*/
        displaytabStrip.select(displaytabStrip.tabGroup.children("li").eq(2));
        if (viewerDashboardId == parent.DASHBOARD_ID_SCHEMATIC_VIEW) {
            addRemoveSettingHeight("schematicNetworkSettings");
        } else {
            addRemoveSettingHeight("mapNetworkSettings");
        }
    }
    populateEquipmentTypeDropDowns();
}

function enableLabelDisplayOptions(isEnable) {
    if (isEnable) {
        $("#labelWeightChk").removeAttr("disabled");
        $("#labelCubeChk").removeAttr("disabled");
        $("#labelPiecesChk").removeAttr("disabled");
/*
		 $("#labelDepartureDaysChk").removeAttr("disabled");
		 $("#labelArrivalDaysChk").removeAttr("disabled");
		 $("#labelAvailableTimeChk").removeAttr("disabled");
		 $("#labelDueTimeChk").removeAttr("disabled");
		 */
    } else {
        $("#labelWeightChk").attr("disabled", true);
        $("#labelCubeChk").attr("disabled", true);
        $("#labelPiecesChk").attr("disabled", true);
/*
		 $("#labelDepartureDaysChk").attr("disabled", true);
		 $("#labelArrivalDaysChk").attr("disabled", true);
		 $("#labelAvailableTimeChk").attr("disabled", true);
		 $("#labelDueTimeChk").attr("disabled", true);
		 */
    }
}

function setLabelType(type) {
    labelType = type;
}

/**
 * create a combo box for the provided divId.
 * @param divId
 * @param data
 * @param dataTextField
 * @param dataValueField
 * @returns
 */

function createComboBox(divId, data, dataTextField, dataValueField, selectIndex) {
    var comboObj = parent.createKendoComboBoxByDiv($("#" + divId), EMPTY_STRING, FILTER_TYPE_STARTS_WITH, data, dataTextField, dataValueField);
    if (selectIndex != undefined) {
        comboObj.data("kendoComboBox").select(selectIndex);
    } else {
        comboObj.data("kendoComboBox").select(0);
    }


    return comboObj;
}

function createMultiSelectComboBox(divId, data, dataTextField, dataValueField) {
    var multiComboObj = $("#" + divId).kendoMultiSelectBox({
        dataTextField: dataTextField,
        dataValueField: dataValueField,
        dataSource: data
    });
    multiComboObj.data("kendoMultiSelectBox").select(0);
}

function getDataSource(name, url, usePagination) {
    var datasource = new kendo.data.DataSource({
        serverFiltering: false,
        transport: {
            read: {
                url: function(options) {
                    return url;
                },
                dataType: OUTPUT_TYPE_JSON
            }
        },
        change: function(e) {
            refreshProductGroups();
        },
        requestStart: function(e) {
            //!areQueryWindowsInitialized is due to an error, shouldn;t actually be there
        },
        requestEnd: function(e) {

        },
        error: function(e) {
            checkForTimeoutError(e);
        }
    });

    if (usePagination) {
        datasource.pageSize(20);
    }

    return datasource;
}

function showDiv(divId, isShow) {
    var divElement = document.getElementById(divId);
    var state = divElement.style.display;
    if (isShow) {
        divElement.style.display = 'block';
        //divElement.style.zIndex = 9999;
    } else {
        divElement.style.display = 'none';
        // divElement.style.zIndex = 1;
    }
}

function getLaneDetailPopupId(laneObj) {
    var laneId = laneObj.name;
    var laneObjAttributes = laneObj.attributes;

    if (laneObjAttributes != undefined) {
        var laneActivities = laneObjAttributes.LaneActivities;
        if (laneActivities != undefined) {
            if (laneActivities.length > 1) {
                laneId = laneObjAttributes.Guid;
            } else {
                laneId = laneActivities[0].guid;
            }
        }
    }
    return laneId;
}

function showLaneDetailPopup(laneObj, originObj, destinationObj, globalStylesMap, styleByIdFn, isTemplateAlreadyDefined, styleByNameFn) {
    try {
        var laneId = getLaneDetailPopupId(laneObj);
        if (laneId) {
            if (!popUpMap[laneId]) {
                popUpMap[laneId] = new LaneDetailPopUp(laneObj, originObj, destinationObj, globalStylesMap, styleByIdFn, isTemplateAlreadyDefined, styleByNameFn);
                popUpMap[laneId].key = laneId;
            }
            popUpMap[laneId].showPopUp();
            showHideColumnsInPopup($("#popupDisplayOptionWeightChk")[0], "TOTAL_WEIGHT", "lane");
            showHideColumnsInPopup($("#popupDisplayOptionPiecesChk")[0], "TOTAL_PIECES", "lane");
            showHideColumnsInPopup($("#popupDisplayOptionCubeChk")[0], "TOTAL_CUBE", "lane");
            showHideColumnsInPopup($("#popupDisplayOptionOdpdChk")[0], "ODPD", "lane");
        }
        return laneId;
    } catch (e) {
        parent.showErrorMsg("Error [" + e.message + "] occured while showing the lane details popup for [" + laneObj.name + "]");
        hideBusyCursor();
    }
}

function showTransitPopup(laneObj, originObj, destinationObj, schematicDiagramObj, styleByIdFn, isTemplateAlreadyDefined, styleByNameFn) {
    try {
        var laneId = laneObj.name;
        if (laneId) {
            if (!transitPopUpMap[laneId]) {
                transitPopUpMap[laneId] = new TransitPopUp(laneObj, originObj, destinationObj, schematicDiagramObj, styleByIdFn, isTemplateAlreadyDefined, styleByNameFn);
            }
            transitPopUpMap[laneId].showPopUp();
        }
    } catch (e) {
        //parent.showErrorMsg("Error ["+e.message+"] occured while showing the lane details popup for ["+laneObj.name+"]");
        hideBusyCursor();
    }

}

function getLegDetailPopupId(legObj) {
    var legId = legObj.id;
    var legObjAttributes = legObj.attributes;

    if (legObjAttributes != undefined) {
        var legDetails = legObjAttributes.LegDetails;
        if (legDetails != undefined) {
            if (legDetails.length > 1) {
                legId = legObjAttributes.Guid;
            } else {
                legId = legDetails[0].guid;
            }
        }
    }
    return legId;
}

function showLegDetailPopup(legObj, originObj, destinationObj, globalStylesMap, styleFn, isTemplateAlreadyDefined, styleByNameFn) {
    try {
        var legId = getLegDetailPopupId(legObj);
        if (!legId) {
            return;
        }
        if (!popUpMap[legId]) {
            popUpMap[legId] = new LegDetailPopUp(legObj, originObj, destinationObj, globalStylesMap, isScheduleForNetworkFlag, styleFn, isTemplateAlreadyDefined, styleByNameFn, isLocalFlag);
            popUpMap[legId].key = legId;
        }
        popUpMap[legId].showPopUp();
        showHideColumnsInPopup($("#schematicMatrixweightChk")[0], "TOTAL_WEIGHT", "leg");
        showHideColumnsInPopup($("#schematicMatrixpiecesChk")[0], "TOTAL_PIECES", "leg");
        showHideColumnsInPopup($("#schematiMatrixccubeChk")[0], "TOTAL_CUBE", "leg");

        return legId;
    } catch (e) {
        parent.showErrorMsg("Error [" + e.message + "] occured while showing the leg details popup for [" + legObj.name + "]");
        hideBusyCursor();
    }
}

function closePopups(isDestroy) {
    closeAllDetailPopUps(isDestroy);
    closeActivityPopup(isDestroy);
    closeAllMarketViewPopups();
}

function closeAllDetailPopUps(isDestroy) {
    closeAllPopUps("LanePopUps");
    closeAllPopUps("LegPopUps");

    if (isDestroy != undefined && isDestroy) {
        if (parent.isNetworkQuery) {
            removeAllPopUps("LanePopUps");
        } else {
            removeAllPopUps("LegPopUps");
        }
    }
}

function closeAllMarketViewPopups() {
    if (marketviewPopUp) {
        marketviewPopUp.destroyAll();
    }
}

function updateMarketViewHeader(chkBtn) {
    marketviewPopUp.updatemarketviewPopUpHeader(chkBtn);
}

function closeActivityPopup(isDestroy) {
    if (activityPopUp) {
        activityPopUp.close(isDestroy);
    }
}

function closeAllPopUps(popUpType) {
    var keys = Object.keys(this.popUpMap);
    for (var i in keys) {
        if (popUpType == "LanePopUps" && this.popUpMap[keys[i]] instanceof LaneDetailPopUp) {
            if (!this.popUpMap[keys[i]].isClosed) {
                this.popUpMap[keys[i]].laneDetailPopUpWin.data("kendoWindow").close();
            }
        } else if (popUpType == "LegPopUps" && this.popUpMap[keys[i]] instanceof LegDetailPopUp) {
            if (!this.popUpMap[keys[i]].isClosed) {
                this.popUpMap[keys[i]].legDetailPopUpWin.data("kendoWindow").close();
            }
        }
    }
}

function removeAllPopUps(popUpType) {
    var keys = Object.keys(this.popUpMap);
    for (var i in keys) {
        if (popUpType == "LanePopUps" && this.popUpMap[keys[i]] instanceof LaneDetailPopUp) {
            delete this.popUpMap[keys[i]];
        } else if (popUpType == "LegPopUps" && this.popUpMap[keys[i]] instanceof LegDetailPopUp) {
            delete this.popUpMap[keys[i]];
        }
    }
}

function closeTrasientPopUp(key) {
    if (transitPopUpMap && key && transitPopUpMap[key]) {
        transitPopUpMap[key].laneDetailPopUpWin.data("kendoWindow").close();
    }
}

function resizeAllPopUps() {
    try {
        var keys = Object.keys(this.popUpMap);
        for (var i in keys) {
            if (this.popUpMap[keys[i]] instanceof LaneDetailPopUp) {
                this.popUpMap[keys[i]].resizePopUp();
            } else if (this.popUpMap[keys[i]] instanceof LegDetailPopUp) {
                this.popUpMap[keys[i]].resizePopUp();
            }
        }
    } catch (e) {
        console.log("Error [" + e.message + "] occurred while resizing popups");
    }
}

function clearSync(isClearAll) {
    if (!isAdvancedQueryModule()) {
        return;
    }
    isSyncOn = false;
    isSyncMatrix = false;
    isSyncViewer = false;

    removeHighlight();
    if (isClearAll) {
        matrixSyncStates = {};
        lastSelectedLineIds = [];
    } else {
        if (parent.isNetworkQuery) {
            matrixSyncStates[parent.DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX] = false;
            matrixSyncStates[parent.DASHBOARD_ID_NETWORK_MATRIX] = false;
            lastSelectedLineIds[window[viewerDashboardId].LAYER_ID_NETWORK_SCHEDULE_LEGS] = null;
            lastSelectedLineIds[window[viewerDashboardId].LAYER_ID_NETWORK_LANES] = null;
        } else {
            matrixSyncStates[parent.DASHBOARD_ID_SCHEDULE_MATRIX] = false;
            lastSelectedLineIds[window[viewerDashboardId].LAYER_ID_SCHEDULE_LEGS] = null;
        }
    }
}

function enableSync(btnId, isEnableSync) {
    var dashboardId;
    if (btnId == "btnMapSyncMatrix" || btnId == "btnSchematicSyncMatrix") {
        isSyncMatrix = isEnableSync;
        dashboardId = parent.getMatrixId(isScheduleForNetworkFlag);
    } else {
        if (viewerDashboardId == parent.DASHBOARD_ID_MAP_VIEW) {
            dashboardId = parent.DASHBOARD_ID_SCHEMATIC_VIEW;
        } else {
            dashboardId = parent.DASHBOARD_ID_MAP_VIEW;
        }
        isSyncViewer = isEnableSync;
    }

    if (isEnableSync && isSyncOn) {
        isSyncOn = false;
    }
    if (parent.isDashboardActive(dashboardId)) {
        parent.getDashboardContentWindow(dashboardId).setSyncOn(isEnableSync);
        if (isEnableSync) {
            parent.setIsScheduleForNetworkFlagInSync(dashboardId, isScheduleForNetworkFlag);
            parent.VIEWER.syncDashboard(dashboardId, getSyncSearchCriteria(dashboardId), viewerDashboardId);
        }
    }
    if (dashboardId == parent.DASHBOARD_ID_NETWORK_MATRIX) {
        if (parent.getDashboardContentWindow(parent.DASHBOARD_ID_NETWORK_SUMMARY_MATRIX) != undefined) {
            parent.getDashboardContentWindow(parent.DASHBOARD_ID_NETWORK_SUMMARY_MATRIX).setSyncOn(isEnableSync);
        }
        if (isEnableSync) {
            parent.VIEWER.syncDashboard(parent.DASHBOARD_ID_NETWORK_SUMMARY_MATRIX, getSyncSearchCriteria(dashboardId), viewerDashboardId);
        }
    }
}

function applyFilterSynchronization(btnId, isEnableSync) {
    var dashboardId;
    if (btnId == "btnMapSyncMatrix" || btnId == "btnSchematicSyncMatrix") {
        isSyncMatrix = isEnableSync;
        dashboardId = parent.getMatrixId(isScheduleForNetworkFlag);
    } else {
        if (viewerDashboardId == parent.DASHBOARD_ID_MAP_VIEW) {
            dashboardId = parent.DASHBOARD_ID_SCHEMATIC_VIEW;
        } else {
            dashboardId = parent.DASHBOARD_ID_MAP_VIEW;
        }
        isSyncViewer = isEnableSync;
    }

    if (isEnableSync && isSyncOn) {
        isSyncOn = false;
    }
    if (parent.isDashboardActive(dashboardId)) {
        parent.getDashboardContentWindow(dashboardId).setSyncOn(isEnableSync);
        if (isEnableSync) {
            parent.VIEWER.syncDashboard(dashboardId, getSyncSearchCriteria(dashboardId));
        }
    }
    if (dashboardId == parent.DASHBOARD_ID_NETWORK_MATRIX) {
        parent.getDashboardContentWindow(parent.DASHBOARD_ID_NETWORK_SUMMARY_MATRIX).setSyncOn(isEnableSync);
        if (isEnableSync) {
            parent.VIEWER.syncDashboard(parent.DASHBOARD_ID_NETWORK_SUMMARY_MATRIX, getSyncSearchCriteria(dashboardId));
        }
    }
}

function enableMarketView(btnId, isMarketViewEnable) {
    if (isAdvancedQueryModule()) {
        $(btnId).attr('isEnabled', isMarketViewEnable);
        if (isMarketViewEnable) {
            $(btnId).text("Market - Enabled");
        } else {
            $(btnId).text("Market");
        }
    }
    this.isMarketViewEnable = isMarketViewEnable;
    if (this.isMarketViewEnable) {
        if (lasso) {
            lasso.onLassoDrawEnd(lasso.lassoMenuComponent);
            lasso.clearMenuSelection();
        }
    }
}

function isMarketViewEnabled() {
    return this.isMarketViewEnable;
}

function setSyncOn(flag) {
    isSyncOn = flag;
    if (!flag) {
        dayWhereClauses[getLayerId()] = "";
        refreshDashboard();
    }
}

function syncDashboard(searchCriteria) {
    setSyncOn(true);
    viewerSyncSearchCriterias[getLayerIdByDataType(searchCriteria.dataType)] = searchCriteria;
    refreshViewer();
}

function resetSyncFromPopup(popupId) {
    if (lastSelectedLineId == popupId) {
        syncDashboards([]);
    }
}

/**
 * synchronize the dashboards for the line Ids..
 * @param lineIds
 */

function syncDashboards(lineIds) {
    //cache the selected line / leg id(s) for that particular layer...
    lastSelectedLineIds[getLayerId()] = lineIds;
    var dashboardId;
    var dataType = parent.getDataType(isScheduleForNetworkFlag);
    //if synchronize matrix is true...then ...
    if (isSyncMatrix) {
        //get the dashboard id
        dashboardId = parent.getMatrixId(isScheduleForNetworkFlag);
        //synchronize the dashboard by settign the search criteria.,,.,
        parent.VIEWER.syncDashboard(dashboardId, getSyncSearchCriteria(dashboardId, lineIds));
        if (dashboardId == parent.DASHBOARD_ID_NETWORK_MATRIX) {
            parent.VIEWER.syncDashboard(parent.DASHBOARD_ID_NETWORK_SUMMARY_MATRIX, getSyncSearchCriteria(dashboardId, lineIds));
        }
    }
    if (isSyncVolumeAndAllocationMatrix && (dataType == parent.DATA_TYPE_NETWORK_SCHEDULE || parent.DATA_TYPE_SCHEDULE)) {
        //synchronize the dashboard by settign the search criteria.,,.,
        parent.VIEWER.syncDashboard(parent.DASHBOARD_ID_ALLOCATION_MATRIX, getSyncSearchCriteria(parent.DASHBOARD_ID_ALLOCATION_MATRIX, lineIds));
        parent.VIEWER.syncDashboard(parent.DASHBOARD_ID_VOLUME_UTILIZATION_TREE_GRID_MATRIX, getSyncSearchCriteria(parent.DASHBOARD_ID_VOLUME_UTILIZATION_TREE_GRID_MATRIX, lineIds));
    }

    if (isSyncViewer && lineIds == undefined) {
        if (viewerDashboardId == parent.DASHBOARD_ID_MAP_VIEW) {
            dashboardId = parent.DASHBOARD_ID_SCHEMATIC_VIEW;
        } else {
            dashboardId = parent.DASHBOARD_ID_MAP_VIEW;
        }
        parent.VIEWER.syncDashboard(dashboardId, getSyncSearchCriteria(dashboardId));
        parent.setDashboardSelectedDays(dashboardId, dataType, parent.getDashboardSelectedDays(viewerDashboardId, dataType));
    }
}

/**
 * @param  dashboardId
 * @param lineIds
 */

function getSyncSearchCriteria(dashboardId, lineIds) {
    var syncSearchCriteria = {};
    var layerId = getLayerId();
    syncSearchCriteria.dataType = parent.getDataType(isScheduleForNetworkFlag);

    if (lineIds) {
        syncSearchCriteria.ids = lineIds;
    } else {
        syncSearchCriteria.searchCriteria = searchCriterias[layerId];
        if (dashboardId == parent.DASHBOARD_ID_MAP_VIEW || dashboardId == parent.DASHBOARD_ID_SCHEMATIC_VIEW) {
            syncSearchCriteria.whereClause = getWhereClause(layerId);
        } else {
            syncSearchCriteria.whereClause = getWhereClause(layerId);
            if (dashboardId == parent.DASHBOARD_ID_NETWORK_MATRIX && activityWhereClause != "") {
                syncSearchCriteria.activityWhereClause = activityWhereClause;
            }
        }

        if (parent.isNetworkQuery && isScheduleForNetworkFlag) {
            syncSearchCriteria.nwSearchCriteria = searchCriterias[window[viewerDashboardId].LAYER_ID_NETWORK_LANES];
            var nwWhereClause = getWhereClause(window[viewerDashboardId].LAYER_ID_NETWORK_LANES);
            if (activityWhereClause != "") {
                syncSearchCriteria.nwActivityWhereClause = activityWhereClause;
            }
            if (nwWhereClause && nwWhereClause != "") {
                syncSearchCriteria.nwWhereClause = nwWhereClause;
            }
        }
    }
    return syncSearchCriteria;
}

/**
 * returns the lane / leg ids based on the network / schedule query windwo...
 * @param lineObj
 * @param ids
 * @returns
 */

function getIds(lineObj, ids) {
    if (ids == undefined) {
        ids = [];
    }
    if (parent.isNetworkQuery && !isScheduleForNetworkFlag) {
        //get the LaneActivities
        if (lineObj && lineObj.attributes.LaneActivities) {
            var laneActivities = lineObj.attributes.LaneActivities;
            for (var i = 0; i < laneActivities.length; i++) {
                //get the laneId
                if (!ids.contains(laneActivities[i].laneId)) {
                    ids.push(laneActivities[i].laneId);
                }
            }
        }
    } else {
        if (lineObj && lineObj.attributes.LegDetails) {
            //get the LegDetails
            var legDetails = lineObj.attributes.LegDetails;
            for (var i = 0; i < legDetails.length; i++) {
                //get the legId
                if (!ids.contains(legDetails[i].legId)) {
                    ids.push(legDetails[i].legId);
                }
            }
        }
    }
    return ids;
}

function clone(object) {
    var clonedObject;

    if (object != undefined) {
        clonedObject = jQuery.extend(true, {}, object);
    }

    return clonedObject;
}

/******** schematic diagram function - popup functions ********/
var popupLinkTemplateMap = {};

//network

function getSchematicTransit(attributes) {
    return attributes.LaneActivities[0].transits;
}

function getSchematicOriginActivity(attributes) {
    return attributes.LaneActivities[0].originActivity;
}

function getSchematicDestinationActivity(attributes) {
    return attributes.LaneActivities[0].destinationActivity;
}

function getSchematicDepartureDays(attributes) {
    return attributes.LaneActivities[0].departureDays;
}

function getSchematicArrivalDays(attributes) {
    return attributes.LaneActivities[0].arrivalDays;
}

function getSchematicDueTime(attributes) {
    return attributes.LaneActivities[0].dueTime;
}

function getSchematicAvailableTime(attributes) {
    return attributes.LaneActivities[0].availableTime;
}

//schedule

function getSchematicRouteNo(attributes) {
    return attributes.LegDetails[0].routeNbr;
}

function getSchematicIATADesc(attributes) {
    return attributes.LegDetails[0].iataEquipDesc;
}

function getSchematicEquipCode(attributes) {
    return attributes.LegDetails[0].equipCode;
}

function getSchematicDepartureTime(attributes) {
    return attributes.LegDetails[0].departureTime;
}

function getSchematicEffectiveDays(attributes) {
    return attributes.LegDetails[0].day;
}

function getSchematicArrivalTime(attributes) {
    return attributes.LegDetails[0].arrivalTime;
}

function getPopupLinkTemplateMap() {
    return popupLinkTemplateMap[getLayerId()];
}

/******** schematic diagram popup functiosn ********/

function showHideColumnsInPopup(chkbox, type, dashboardType) {
    var keys = Object.keys(this.popUpMap);
    var popUpGrid;
    for (var i = 0; i < keys.length; i++) {
        if (dashboardType == "lane" && this.popUpMap[keys[i]] instanceof LaneDetailPopUp) {
            popUpGrid = $("#" + this.popUpMap[keys[i]].gridId).data('kendoGrid');
        } else if (dashboardType == "leg" && this.popUpMap[keys[i]] instanceof LegDetailPopUp) {
            popUpGrid = $("#" + this.popUpMap[keys[i]].gridId).data('kendoGrid');
        }
        if (popUpGrid) {
            if (type == "TOTAL_WEIGHT") {
                for (var j = 0; j < popUpGrid.columns.length; j++) {
                    if (popUpGrid.columns[j].field.indexOf("WEIGHT") > 0 || popUpGrid.columns[j].field.indexOf("WGT") > 0) {
                        if (chkbox.checked) {
                            popUpGrid.showColumn(j);
                            popUpGrid.element.find("th").eq(j).css("display", "table-cell");
                        } else if (!chkbox.checked) {
                            popUpGrid.hideColumn(j);
                            popUpGrid.element.find("th").eq(j).css("display", "none");
                        }
                    }
                }
            } else if (type == "TOTAL_PIECES") {
                for (var j = 0; j < popUpGrid.columns.length; j++) {
                    if (popUpGrid.columns[j].field.indexOf("PIECES") > 0 || popUpGrid.columns[j].field.indexOf("PCS") > 0) {
                        if (chkbox.checked) {
                            popUpGrid.showColumn(j);
                            popUpGrid.element.find("th").eq(j).css("display", "table-cell");
                        } else if (!chkbox.checked) {
                            popUpGrid.hideColumn(j);
                            popUpGrid.element.find("th").eq(j).css("display", "none");
                        }
                    }
                }
            } else if (type == "TOTAL_CUBE") {
                for (var j = 0; j < popUpGrid.columns.length; j++) {
                    if (popUpGrid.columns[j].field.indexOf("CUBE") > 0 || popUpGrid.columns[j].field.indexOf("CU") > 0) {
                        if (chkbox.checked) {
                            popUpGrid.showColumn(j);
                            popUpGrid.element.find("th").eq(j).css("display", "table-cell");
                        } else if (!chkbox.checked) {
                            popUpGrid.hideColumn(j);
                            popUpGrid.element.find("th").eq(j).css("display", "none");
                        }
                    }
                }
            } else {
                for (var j = 0; j < popUpGrid.columns.length; j++) {
                    if (popUpGrid.columns[j].field == type) {
                        if (chkbox.checked) {
                            popUpGrid.showColumn(j);
                            popUpGrid.element.find("th").eq(j).css("display", "table-cell");
                        } else if (!chkbox.checked) {
                            popUpGrid.hideColumn(j);
                            popUpGrid.element.find("th").eq(j).css("display", "none");
                        }
                    }
                }
            }
        }
    }
}

/** Method to add product group column headers */

function addProductGroupColumnHeadersInPopUp() {
    var keys = Object.keys(this.popUpMap);
    var popUpGridId;
    for (var i = 0; i < keys.length; i++) {
        destroyGrid(this.popUpMap[keys[i]].gridId);
        this.popUpMap[keys[i]].createMatrix();
        this.popUpMap[keys[i]].resizeMatrix();
        if (this.popUpMap[keys[i]] instanceof LaneDetailPopUp) {
            showHideColumnsInPopup($("#popupDisplayOptionWeightChk")[0], "TOTAL_WEIGHT", "lane");
            showHideColumnsInPopup($("#popupDisplayOptionPiecesChk")[0], "TOTAL_PIECES", "lane");
            showHideColumnsInPopup($("#popupDisplayOptionCubeChk")[0], "TOTAL_CUBE", "lane");
            showHideColumnsInPopup($("#popupDisplayOptionOdpdChk")[0], "ODPD", "lane");
        } else if (this.popUpMap[keys[i]] instanceof LegDetailPopUp) {
            showHideColumnsInPopup($("#schematicMatrixweightChk")[0], "TOTAL_WEIGHT", "leg");
            showHideColumnsInPopup($("#schematicMatrixpiecesChk")[0], "TOTAL_PIECES", "leg");
            showHideColumnsInPopup($("#schematiMatrixccubeChk")[0], "TOTAL_CUBE", "leg");
        }
    }
}

function destroyGrid(grdId) {
    $('#' + grdId).data().kendoGrid.destroy();
    $('#' + grdId).empty();
}

/*function addProductGroupColumnHeadersInPopUp() {
	var keys = Object.keys(this.popUpMap);
	var popUpGridId;
	for(var i=0; i<keys.length; i++) {
		if(this.popUpMap[keys[i]] instanceof LaneDetailPopUp) {
			this.popUpMap[keys[i]].laneDetailPopUpWin.data("kendoWindow").destroy();
		}else if(this.popUpMap[keys[i]] instanceof LegDetailPopUp) {
			this.popUpMap[keys[i]].legDetailPopUpWin.data("kendoWindow").destroy();
		}
		delete this.popUpMap[keys[i]];
	}
}*/

function showNetworkActivityPopup(dataObject) {
    if (dataObject == undefined) {
        return;
    }
    var styleId = dataObject.styleId;
    if (styleId != undefined) {
        if (styleId == "H" || styleId.indexOf("L_H") == 0) {
            if (!activityPopUp) {
                activityPopUp = new ActivityDetailPopUp();
            }
            activityPopUp.showPopUp(dataObject);

        }
    }
}

function showFacilityEncyclopediaDrawer(dataObject) {
    var graphic = dataObject.graphic;
    if (isScheduleMaintainance() && SkdMxHelper.getMapOpeationManager().isActiveMode() && !SkdMxHelper.getMapOpeationManager().isByLegQuery()) {
        SkdMxHelper.getDrawer().invokeOperatoin(dataObject);
    } else {
        var allLocations;
        var refFacility;
        var relFacCityName;
        if (graphic != undefined) {
            allLocations = graphic.data.attributes.AllLocations;
        }
        var activityArray;
        var html;
        if (allLocations != undefined && allLocations.length > 0) {
            $("#facilityEncyclopedia").show();
            Slider.resizeFacilityHandler();
            $("#facilityEncycloContent").empty();
            var datasource = parent.VIEWER.getQueryDataSource("ActivitiesDetailSQW").data();
            //QueryCacheManager.getInstance().getDatasource("ActivitiesDetailSQW");
            for (var i = 0; i < allLocations.length; i++) {
                activityArray = ActivityUtils.searchActivitiesByLocAndDays(datasource, allLocations[i].locCd, false);
                html = ActivityUtils.getActivityHTMLOptions("PreviousActivity", activityArray, "locCd", "locCd");
                createFacilityEncyclopediaDiv(html, allLocations[i].locCd, allLocations[i].city, allLocations[i].country, allLocations[i].globalRegionName, allLocations[i].relFacilityName);
            }
            Slider.showFacilityPanel("faciSlider-arrow", "fPanel");
        }
    }
}

function createFacilityEncyclopediaDiv(html, facilityName, city, country, gblRegion, relFacCityName) {
    $("#facilityEncycloContent").append("<br/><table id='" + facilityName + "'></table>");
    $("#" + facilityName).append("<tr><td><label><b>Facility</b></label></td><td><label id='lblFacilityName'><b>Loc Code:</b> " + facilityName + "</br> <b>City:</b> " + (relFacCityName != undefined ? relFacCityName : city) + "</br><b>Country:</b> " + country + "</br> <b>Global Region:</b> " + gblRegion + "</label></td></tr>");
    $("#" + facilityName).append("<tr><td><label><b>Equipment</b></label></td><td><label id='lblFacilityEquipment'></label></td></tr>");
    $("#" + facilityName).append("<tr><td><label><b>Restrictions</b></label></td><td><label id='lblFacilityRestrictions'></label></td></tr>"); /*$("#" + facilityName).append("<tr><td><label><b>Products</b></label></td><td><label id='lblFacilityProducts'></label></td></tr><br>");*/
    $("#" + facilityName).append("<br>");
    $("#" + facilityName).append("<tr><td colspan= '2'><label><b>Activities</b></label></td></tr>");
    $("#" + facilityName).append("<tr><td colspan= '2'><hr></td></tr>");
    $("#" + facilityName).append("<tr><td colspan= '2'><div id='lblFacilityActivities'>" + html + "</div></tr>");
    $("#facilityEncycloContent").append("<br/>");
}

function onActivityPopupClick() {
    activityWhereClause = "";
    if (activityPopUp) {
        var selectedActivities = activityPopUp.getSelectedActivities();
        if (selectedActivities) {
            var layerId = getLayerId();

            if (selectedActivities.inboundActivities && selectedActivities.inboundActivities.length > 0) {
                activityWhereClause = "(DESTINATION = '" + selectedActivities.locCd + "' AND DESTINATION_ACTY IN (" + toDatabaseColumns(selectedActivities.inboundActivities) + "))";
            }

            if (selectedActivities.outboundActivities && selectedActivities.outboundActivities.length > 0) {
                if (activityWhereClause != "") {
                    activityWhereClause += " OR ";
                }
                activityWhereClause += "(ORIGIN = '" + selectedActivities.locCd + "' AND ORIGIN_ACTY IN (" + toDatabaseColumns(selectedActivities.outboundActivities) + "))";
            }

            if (activityWhereClause != "") {
                activityWhereClause = parent.escapeWhereClause("(" + activityWhereClause + ")");
            }
            refreshDashboard();
        }

    }
}

function toDatabaseColumns(arrValues) {
    var columnStr = "";
    for (var i = 0; i < arrValues.length; i++) {
        if (i != 0) {
            columnStr += ",";
        }
        columnStr += "'" + arrValues[i] + "'";
    }

    return columnStr;
}

function disableShowModes(btn) {
    $("#flyChk")[0].disabled = btn.checked;
    $("#truckChk")[0].disabled = btn.checked;
    $("#otherChk")[0].disabled = btn.checked;
    $("#flySuggestedChk")[0].disabled = btn.checked;
    $("#truckSuggestedChk")[0].disabled = btn.checked;
    $("#otherSuggestedChk")[0].disabled = btn.checked;
    $("#flyMandatoryChk")[0].disabled = btn.checked;
    $("#truckMandatoryChk")[0].disabled = btn.checked;
    $("#otherMandatoryChk")[0].disabled = btn.checked;
}

function disableTextBoxes(btn, controlArr) {
    for (var i = 0; i < controlArr.length; i++) {
        $("#" + controlArr[i])[0].disabled = !btn.checked;
    }
}

function resetDashboard(restoreDefaultFavorite, isClearOperation, isRefreshDashboard) {
    closeActivityPopup(true);

    if ((restoreDefaultFavorite != undefined && getFavoriteComponent(viewerDashboardId).defaultfavorite == null) || (isClearOperation && isClearOperation != undefined)) {
        if (isAdvancedQueryModule()) {
            resetViewerHeaderSettings(isClearOperation);
            if (viewerDashboardId == parent.DASHBOARD_ID_MAP_VIEW) {
                resetMarketView();
            }
            resetViewerContents();
        } else {
            if (isNetworkQuery) {
                SQW.resetNetworkFilterData();
                if (isScheduleForNetworkFlag) SQW.resetScheduleFilterData();
            } else {
                SQW.resetScheduleFilterData();
            }
            enableDisableFilter(true);
        }
        applyDisplaySettings(isRefreshDashboard);
    } else {
        //restore default favorite
        if (isAdvancedQueryModule()) {
            setDefaultDirection();
            enableDisableDirection();
        }
        getFavoriteComponent(viewerDashboardId).applyDefaultFavorite();
    }
}

function resetViewerHeaderSettings(isClearOperation) {
    if (parent.isNetworkQuery) {
        if (!isClearOperation || isClearOperation == undefined) {
            dayWhereClauses[window[viewerDashboardId].LAYER_ID_NETWORK_LANES] = "";
            dayWhereClauses[window[viewerDashboardId].LAYER_ID_NETWORK_SCHEDULE_LEGS] = "";
        }
        updateViewerToggleButton();
    } else {
        if (!isClearOperation || isClearOperation == undefined) {
            dayWhereClauses[window[viewerDashboardId].LAYER_ID_SCHEDULE_LEGS] = "";
        }

        window[viewerDashboardId].clearLayers(window[viewerDashboardId].LAYER_IDS_SCHEDULE);
    }
    closePopups();
    setDefaultDirection();
    enableDisableDirection();
    setLocalZuluButtonState(parent.isLocalTimeFlag(), false); //dont need to refresh the viewer
}

function setViewerDataEnabled(flag) {
    if (viewerDataEnabled != undefined) {
        if (parent.isNetworkQuery) {
            if (isScheduleForNetworkFlag) {
                viewerDataEnabled[parent.DATA_TYPE_NETWORK_SCHEDULE] = flag;
            } else {
                viewerDataEnabled[parent.DATA_TYPE_NETWORK] = flag;
            }
        } else {
            viewerDataEnabled[parent.DATA_TYPE_SCHEDULE] = flag;
        }
    }

}

function getViewerDataEnabled() {
    if (viewerDataEnabled != undefined) {
        if (parent.isNetworkQuery) {
            if (isScheduleForNetworkFlag) {
                return viewerDataEnabled[parent.DATA_TYPE_NETWORK_SCHEDULE];
            } else {
                return viewerDataEnabled[parent.DATA_TYPE_NETWORK];
            }
        } else {
            return viewerDataEnabled[parent.DATA_TYPE_SCHEDULE];
        }
    }
}
/**
 * 
 * @param enableFlag	flag that indicates to enable or disable the refresh button / functionality
 * @param dashboardId	source dashboard if
 * @param isInitializing	current status of the dashboard
 * @param targetDashboardId	target dashboard
 */

function enableDisableRefresh(enableFlag, dashboardId, isInitializing, targetDashboardId) {
    var dashboardIds;
    var isHighLight = false;
    if (dashboardId == null || dashboardId == EMPTY_STRING) {
        dashboardId = viewerDashboardId;
    }
    if (enableFlag) { //enable the refresh button / functionality		
        if (parent.isNetworkQuery) {
            //is a Network Query 
            if (isScheduleForNetworkFlag) {
                //is a schedule for network & schedule overlay.  
                //so..get to know the synchronization state of the corresponding module.
                isHighLight = matrixSyncStates[parent.DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX];
            } else {
                //is a schedule for network.  
                //so..get to know the synchronization state of the corresponding module.
                isHighLight = matrixSyncStates[parent.DASHBOARD_ID_NETWORK_MATRIX];
            }
        } else {
            //is a schedule view.  
            //so..get to know the synchronization state of the corresponding module.
            isHighLight = matrixSyncStates[parent.DASHBOARD_ID_SCHEDULE_MATRIX];
        }
        if (isHighLight == undefined) {
            isHighLight = false;
        }
        //change button states
        if (viewerDashboardId == parent.DASHBOARD_ID_MAP_VIEW) { //if the current dashboard is a map viewer dashboard
            //set of dashboard which may reflect the changes for icons...
            if (isAdvancedQueryModule()) {
                dashboardIds = "[DASHBOARD_ID_SCHEMATIC_VIEW,DASHBOARD_ID_NETWORK_MATRIX,DASHBOARD_ID_NETWORK_SUMMARY_MATRIX,DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX,DASHBOARD_ID_SCHEDULE_MATRIX,DASHBOARD_ID_MODE_ANALYSIS,DASHBOARD_ID_MAP_MODE_ANALYSIS]";
            } else {
                dashboardIds = "[DASHBOARD_ID_NETWORK_MATRIX,DASHBOARD_ID_NETWORK_SUMMARY_MATRIX,DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX,DASHBOARD_ID_SCHEDULE_MATRIX,DASHBOARD_ID_MODE_ANALYSIS,DASHBOARD_ID_MAP_MODE_ANALYSIS]";
            }
            if (targetDashboardId == null) {
                //update the button states for synchronize schematic settings....
                updateButtonAttrs(dashboardId, ".sync-to-schematic-disable", "k-icon sync-to-schematic", "Synchronize with schematic", "getDashboardContentWindow('" + dashboardId + "').switchAndEnableSync(this,'" + dashboardId + "'," + dashboardIds + ", 'icon-sync-to-matrix')", true);
                //update the button states for synchronize matrix settings....
                updateButtonAttrs(dashboardId, '.icon-sync-to-matrix-disable', "k-icon icon-sync-to-matrix", "Synchronize with matrix", "getDashboardContentWindow('" + dashboardId + "').switchAndEnableSync(this,'" + dashboardId + "'," + dashboardIds + ", 'sync-to-schematic')", true, isHighLight);
            }
            if (targetDashboardId == null || targetDashboardId == viewerDashboardId) {
                //update the button states for lasso menu
                updateDropDownAttrs(dashboardId, '.icon-lasso-select-disable', "k-sprite k-icon icon-lasso-select", EMPTY_STRING, true);
                //update the button states for schematic dashbaord
                updateButtonAttrs(dashboardId, '.schematic-diagram-disable', "k-icon schematic-diagram", "Open schematic diagram", 'getDashboardContentWindow("' + dashboardId + '").syncSchematicViewer()', true);
                //for overlay and direction button
                updateViewerToggleButton();
                //reset the market view button state
                //				resetMarketView();
                //reset the refresh button state...
                updateButtonAttrs(dashboardId, '.icon-refresh-disable', "k-icon icon-refresh", "Refresh data to match query", 'getDashboardContentWindow("' + dashboardId + '").resetDashboard(true)', true);
                //reset the local / zulu button state...
                setLocalZuluButtonState(isLocalFlag, false);
                //update the button state for calendar...
                if(parent.isNetworkQuery){
                    updateButtonAttrs(dashboardId, '.icon-select-calendar-disable', "k-icon icon-select-calendar", "Open day selector", 'getDashboardContentWindow("' + dashboardId + '").openDayControl(this)', true);
                }else {
                    updateButtonAttrs(dashboardId, '.icon-select-calendar', "k-icon icon-select-calendar-disable", "Day selector is not available", EMPTY_STRING, false);
                }
                //update the favorite(s) menu...
                updateDropDownAttrs(dashboardId, '.icon-favorites-disable', "k-sprite k-icon icon-favorites", EMPTY_STRING, true);
                //change the button state of apply...
                $("#applyDisplaySettings").removeAttr("disabled");
                setViewerDataEnabled(false);
            }
        } else if (viewerDashboardId == parent.DASHBOARD_ID_SCHEMATIC_VIEW) {
            if (isAdvancedQueryModule()) {
                dashboardIds = "[DASHBOARD_ID_MAP_VIEW,DASHBOARD_ID_NETWORK_MATRIX,DASHBOARD_ID_NETWORK_SUMMARY_MATRIX,DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX,DASHBOARD_ID_SCHEDULE_MATRIX,DASHBOARD_ID_MODE_ANALYSIS,DASHBOARD_ID_MAP_MODE_ANALYSIS]";
            } else {
                dashboardIds = "[DASHBOARD_ID_NETWORK_MATRIX,DASHBOARD_ID_NETWORK_SUMMARY_MATRIX,DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX,DASHBOARD_ID_SCHEDULE_MATRIX,DASHBOARD_ID_MODE_ANALYSIS,DASHBOARD_ID_MAP_MODE_ANALYSIS]";
            }
            if (targetDashboardId == null) {
                //update the button states for synchronize schematic settings....
                updateButtonAttrs(dashboardId, ".sync-to-map-disable", "k-icon sync-to-map", "Synchronize with map", "getDashboardContentWindow('" + dashboardId + "').switchAndEnableSync(this,'" + dashboardId + "'," + dashboardIds + ", 'icon-sync-to-matrix')", true);
                //update the button states for synchronize matrix settings....
                updateButtonAttrs(dashboardId, '.icon-sync-to-matrix-disable', "k-icon icon-sync-to-matrix", "Synchronize with matrix", "getDashboardContentWindow('" + dashboardId + "').switchAndEnableSync(this,'" + dashboardId + "'," + dashboardIds + ", 'sync-to-map')", true, isHighLight);
            }
            if (targetDashboardId == null || targetDashboardId == viewerDashboardId) {
                //update the button states for expand button
                updateButtonAttrs(dashboardId, '.expand-all-disable', "k-icon expand-all", "Expand all", 'getDashboardContentWindow("' + dashboardId + '").toggleExpand(this, true)', true);
                //update the button states for optimize button
                updateButtonAttrs(dashboardId, '.optimize-schematic-disable', "k-icon optimize-schematic", "Optimize line placement", 'getDashboardContentWindow("' + dashboardId + '").refreshWithOptimizedPlacement()', true);
                updateViewerToggleButton(); //for overlay and direction button
                //update the button states for refresh button
                updateButtonAttrs(dashboardId, '.icon-refresh-disable', "k-icon icon-refresh", "Refresh data to match query", 'getDashboardContentWindow("' + dashboardId + '").resetDashboard(true)', true);
                //reset the local / zulu button state...
                setLocalZuluButtonState(isLocalFlag, false);
                //update the button state for calendar...
                updateButtonAttrs(dashboardId, '.icon-select-calendar-disable', "k-icon icon-select-calendar", "Open day selector", 'getDashboardContentWindow("' + dashboardId + '").openDayControl(this)', true);
                //update the favorite(s) menu...
                updateDropDownAttrs(dashboardId, '.icon-favorites-disable', "k-sprite k-icon icon-favorites", EMPTY_STRING, true);
                //change the button state of apply...
                $("#applyDisplaySettings").removeAttr("disabled");
            }
        } else if (viewerDashboardId == parent.DASHBOARD_ID_MODE_ANALYSIS || viewerDashboardId == parent.DASHBOARD_ID_MAP_MODE_ANALYSIS) {
            //update the button states for synchronize map settings....
            updateButtonAttrs(dashboardId, ".sync-to-map-disable", "k-icon sync-to-map", "Synchronize with map", 'getDashboardContentWindow("' + dashboardId + '").showDetailsOnMap()', true);
            updateButtonAttrs(dashboardId, '.clear-query-disable', "k-icon clear-query", "Clear all origins and destinations", 'getDashboardContentWindow("' + dashboardId + '").clearClickhandler()', true);
            updateButtonAttrs(dashboardId, '.export-to-excel-disable', "k-icon export-to-excel", "Export to Excel", 'getDashboardContentWindow("' + dashboardId + '").exportDataToExcel()', true);
            setLocalZuluButtonState(isLocalFlag, false, null, 'getDashboardContentWindow("' + dashboardId + '").toggleTimeView(this, !this.toggled);getDashboardContentWindow("' + dashboardId + '").toggleLocalZuluTime(event)');
            updateDropDownAttrs(dashboardId, '.icon-favorites-disable', "k-sprite k-icon icon-favorites", EMPTY_STRING, true);
            $("#applyDisplaySettings").removeAttr("disabled");
        }
    } else {
        if (viewerDashboardId == parent.DASHBOARD_ID_MAP_VIEW) {
            //update the button states for synchronize schematic settings....
            updateButtonAttrs(dashboardId, ".sync-to-schematic", "k-icon sync-to-schematic-disable", "Synchronize with schematic is not available", EMPTY_STRING, false, false);
            //update the button states for synchronize matrix settings....
            updateButtonAttrs(dashboardId, '.icon-sync-to-matrix', "k-icon icon-sync-to-matrix-disable", "Synchronize with matrix is not available", EMPTY_STRING, false, false);

            if (isInitializing == true || viewerDashboardId == targetDashboardId) {
                //update the button states for lasso menu  -- commented for november release
                //updateDropDownAttrs(dashboardId, '.icon-lasso-select', "k-sprite k-icon icon-lasso-select-disable", "Lasso is not available", false);
                updateViewerToggleButton(null, true); //for overlay and direction button
                //reset the market view button state
                //				resetMarketView(true);
                //update the button states for refresh button
                updateButtonAttrs(dashboardId, '.icon-refresh', "k-icon icon-refresh-disable", "Refresh is not available", EMPTY_STRING, false);
                //reset the local / zulu button state...
                setLocalZuluButtonState(isLocalFlag, false, true);
                //update the button state for calendar...
                updateButtonAttrs(dashboardId, '.icon-select-calendar', "k-icon icon-select-calendar-disable", "Day selector is not available", EMPTY_STRING, false);
                //update the favorite(s) menu...
                updateDropDownAttrs(dashboardId, '.icon-favorites', "k-sprite k-icon icon-favorites-disable", "Favorites are not available", false);
                //change the button state of apply...
                //$("#applyDisplaySettings").attr("disabled", "disabled");
                if (!isInitializing) setViewerDataEnabled(true);
            }
            if (isInitializing) {
                updateButtonAttrs(dashboardId, '.schematic-diagram', "k-icon schematic-diagram-disable", "Schematic diagram is not available", EMPTY_STRING, false);
            }
        } else if (viewerDashboardId == parent.DASHBOARD_ID_SCHEMATIC_VIEW) {
            //update the button states for synchronize schematic settings....
            updateButtonAttrs(dashboardId, ".sync-to-map", "k-icon sync-to-map-disable", "Synchronize with map is not available", EMPTY_STRING, false, false);
            //update the button states for synchronize matrix settings....
            updateButtonAttrs(dashboardId, '.icon-sync-to-matrix', "k-icon icon-sync-to-matrix-disable", "Synchronize with matrix is not available", EMPTY_STRING, false, false);
            if (isInitializing == true || viewerDashboardId == targetDashboardId) {
                updateViewerToggleButton(null, true); //for overlay and direction button
                //update the button states for refresh button
                updateButtonAttrs(dashboardId, '.icon-refresh', "k-icon icon-refresh-disable", "Refresh is not available", EMPTY_STRING, false);
                //reset the local / zulu button state...
                setLocalZuluButtonState(isLocalFlag, false, true);
                //update the button state for calendar...
                updateButtonAttrs(dashboardId, '.icon-select-calendar', "k-icon icon-select-calendar-disable", "Day selector is not available", EMPTY_STRING, false);
                //update the favorite(s) menu...
                updateDropDownAttrs(dashboardId, '.icon-favorites', "k-sprite k-icon icon-favorites-disable", "Favorites are not available", false);
                //change the button state of apply...
                //$("#applyDisplaySettings").attr("disabled", "disabled");
            }
            if (isInitializing) {
                updateButtonAttrs(dashboardId, '.expand-all', "k-icon expand-all-disable", "Expand all is not available", EMPTY_STRING, false);
                updateButtonAttrs(dashboardId, '.optimize-schematic', "k-icon optimize-schematic-disable", "Optimize line placement is not available", EMPTY_STRING, false);
            }
        } else if (viewerDashboardId == parent.DASHBOARD_ID_MODE_ANALYSIS || viewerDashboardId == parent.DASHBOARD_ID_MAP_MODE_ANALYSIS) {
            updateButtonAttrs(dashboardId, ".sync-to-map", "k-icon sync-to-map-disable", "Synchronize with map is not available", EMPTY_STRING, false, false);
            if (isInitializing) {
                updateButtonAttrs(dashboardId, '.clear-query', "k-icon clear-query-disable", "Clear is not available", EMPTY_STRING, false);
                updateButtonAttrs(dashboardId, '.export-to-excel', "k-icon export-to-excel-disable", "Export is not available", EMPTY_STRING, false);
                setLocalZuluButtonState(isLocalFlag, false, true);
                updateDropDownAttrs(dashboardId, '.icon-favorites', "k-sprite k-icon icon-favorites-disable", "Favorites are not available", false);
                //$("#applyDisplaySettings").attr("disabled", "disabled");
            }
        }
    }
}

/**
 * logic to enable / disable the header buttons...
 * @param dashboardId
 * @param btnClass
 * @param btnClassName
 * @param btnTitle
 * @param onclickValue
 * @param enableClick
 * @param isHighLight
 */

function updateButtonAttrs(dashboardId, btnClass, btnClassName, btnTitle, onclickValue, enableClick, isHighLight) {
    var viewerBtn;
    if (dashboardId != null && (isAdvancedQueryModule() || (dashboardId != parent.DASHBOARD_ID_MAP_VIEW && dashboardId != parent.DASHBOARD_ID_SCHEMATIC_VIEW))) {
        viewerBtn = parent.dashboardController.getDashboard(dashboardId).data("kendoWindow").wrapper.find(btnClass);
    } else {
        viewerBtn = $($(btnClass)[0]);
    }
    if (viewerBtn[0] != null) {
        viewerBtn[0].className = btnClassName;
        viewerBtn.parent()[0].title = btnTitle;
        viewerBtn[0].title = btnTitle;
        if (enableClick) {
            viewerBtn.parent().attr('onclick', onclickValue).bind('click');
        } else {
            viewerBtn.parent().attr('onclick', EMPTY_STRING).unbind('click');
        }
    } else if (btnClass.indexOf("disable") > 0) {
        if (dashboardId != null && (isAdvancedQueryModule() || (dashboardId != parent.DASHBOARD_ID_MAP_VIEW && dashboardId != parent.DASHBOARD_ID_SCHEMATIC_VIEW))) {
            viewerBtn = parent.dashboardController.getDashboard(dashboardId).data("kendoWindow").wrapper.find(btnClass.replace("-disable", EMPTY_STRING));
        } else {
            viewerBtn = $($(btnClass.replace("-disable", EMPTY_STRING))[0]);
        }
        viewerBtn.parent().attr('onclick', onclickValue).bind('click');
    }
    if (isHighLight != undefined) {
        parent.highlightBtn(viewerBtn.parent()[0], isHighLight);
    }
}

/**
 * logic enable / disable menu (favorites ..etc.,)
 * @param dashboardId
 * @param btnClass
 * @param btnClassName
 * @param btnTitle
 * @param enableClick
 */

function updateDropDownAttrs(dashboardId, btnClass, btnClassName, btnTitle, enableClick) {
    if (!isAdvancedQueryModule()) {
        return;
    }
    var viewerBtn = parent.dashboardController.getDashboard(dashboardId).data("kendoWindow").wrapper.find(btnClass);
    if (viewerBtn[0] != null) {
        updateDropDown(dashboardId, btnClass, btnClassName, btnTitle, enableClick);
    } else if (!parent.dashboardController.isDashboardInitialized(dashboardId)) {
        setTimeout(function() {
            updateDropDown(dashboardId, btnClass, btnClassName, btnTitle, enableClick);
        }, 2000);
    }
    if (btnClass.indexOf("disable") > 0) {
        viewerBtn = parent.dashboardController.getDashboard(dashboardId).data("kendoWindow").wrapper.find(btnClass.replace("-disable", EMPTY_STRING));
        viewerBtn.parents("ul").next(".btnWrapper").remove();
    }
}

/**
 * 
 * @param dashboardId
 * @param btnClass
 * @param btnClassName
 * @param btnTitle
 * @param enableClick
 */

function updateDropDown(dashboardId, btnClass, btnClassName, btnTitle, enableClick) {
    var viewerBtn = parent.dashboardController.getDashboard(dashboardId).data("kendoWindow").wrapper.find(btnClass);
    if (viewerBtn[0] != null) {
        viewerBtn.parents("ul").next(".btnWrapper").remove();
        viewerBtn[0].className = btnClassName;
        if (!enableClick) {
            var wrapper = $("<div class='btnWrapper' title='" + btnTitle + "'></div>");
            viewerBtn.parents("ul").after(wrapper);
        }
    }
}

function selectAllActivityHandler(activityType, selectedObj) {
    if (activityType == 'inbound') {
        if (activityPopUp) {
            activityPopUp.selectAllActivityHandler(activityType, selectedObj.checked);
        }
    } else if (activityType == 'outbound') {
        if (activityPopUp) {
            activityPopUp.selectAllActivityHandler(activityType, selectedObj.checked);
        }
    }
}

function getHubActivityType() {
    return $("input:radio[name ='showAsHubGroup']:checked").val();
}

function labelClickHandler(elementId) {
    document.getElementById(elementId).checked = true;
}

function isAdvancedQueryModule() {
    return (typeof parent.isAdvanceQuery == "function" && parent.isAdvanceQuery());
}

function switchAndEnableSync(btn, dashboardId, syncDashboardIds, secondBtnClassName, isSyncDashboardIdsString, isRunQuery) {
    parent.VIEWER.enableSync(btn, dashboardId, syncDashboardIds, secondBtnClassName, isSyncDashboardIdsString, isRunQuery);
}