var PROGRESS_DIALOG_MESSAGE_INITIALIZE_MASTER_DATA = "Initializing master data...";
var PROGRESS_DIALOG_MESSAGE_RUN_QUERY = "Waiting for the query results...";
var PROGRESS_DIALOG_MESSAGE_MAP_INITIALIZE = "Initializing map...";

var queryDatasourceUrls = [parent.getActivitiesDataURL(), parent.getActivitiesDetailDataURL(), parent.getActivityFacilityDataURL(), parent.getFacilitesGroupDataURL(), 
                                  parent.getProductsDataURL(),  parent.getProductGroupsDataURL(), parent.getGlobalRegionDataURL(), parent.getCountryCodesDataURL(),
                                  parent.getLocationsDataURL(), parent.getEquipmentsDataURL("F"), parent.getEquipmentsDataURL("T"),
                                  parent.getLegsDataURL("F"), parent.getLegsDataURL("T"), parent.getLegsDataURL("O"), parent.getZonesDataURL(), 
                                  parent.getSQWActivitiesDetailDataURL(), parent.getFacilityDataURL(), parent.getLaneStatusRenderer(), 
                                  parent.getLocationsFacilitesGroupDataURL(), parent.getSQWActivitiesDetailDataURL(), parent.getFlightRoutesDataURL()]; 
                                  
var queryDatasourceNames = [{datasourceName: "Activities", isAsync: true},
							{datasourceName: "ActivitiesDetail", isAsync: false},
                            {datasourceName: "ActivityFacilities", isAsync: false},
                            {datasourceName: "FacilityGroups", isAsync: false},
                            {datasourceName: "Products", isAsync: false},
                            {datasourceName: "ProductGroups", isAsync: false},
                            {datasourceName: "GlobalRegions", isAsync: false},
                            {datasourceName: "CountryCodes", isAsync: false},
                            {datasourceName: "Locations", isAsync: false},
                            {datasourceName: "FlightEquipmentTypes", isAsync: false},
                            {datasourceName: "TruckEquipmentTypes", isAsync: false},
                            {datasourceName: "FlightLegTypes", isAsync: true},
                            {datasourceName: "TruckLegTypes", isAsync: true},
                            {datasourceName: "OtherLegTypes", isAsync: true},                            
                            {datasourceName: "ZonesList", isAsync: true},
                            {datasourceName: "ActivitiesDetailSQW", isAsync: true},
                            {datasourceName: "LocationsWithGlobalRegion", isAsync: true},
                            {datasourceName: "LaneStatus", isAsync: true},
                            {datasourceName: "FacilityGroupLocations", isAsync: true},
                            {datasourceName: "ActivitiesDetailSQW", isAsync: true},
                            {datasourceName: "FlightRoutes", isAsync: true},];
var queryDatasourceUsePagination = [true, true, true, false, false, false, false, false, true, false, false, false, false, false, false, false];

var queryDatasources = {};
var areQueryWindowsInitialized = false;
var isQueryWindowDataLoaded = false; //due to a bug in kendo ui
var isNetworkTab = true;
var isNetworkTab = true;
var isAddToResults = false;
var localZuluFlag = "L";

var scheduleFavoriteComponent;
var networkFavoriteComponent;
var scheduleQueryWindows = {};
var networkQueryWindows = {};
var orgDestProductCache = new Object();
var isFullRoutingQuery = false;

/** ***** common methods - start ****** */

/**
 * method called on clearing query
 */
function clear(isClearAll) {	
	resetDashboard(isClearAll);
	clearTooltips();
}

/**
 * method called on changing the plan
 */
function onPlanChange() {
	isQueryWindowDataLoaded = false;
	// reload the master data when the plan changes
	invokeDataSources();
	if(networkFavoriteComponent != null && isNetworkTab){
	    networkFavoriteComponent.applyDefaultFavorite();
	}
}

/**
 * method called on resize of the window
 */
function onResize() {
}

/**
 * method called on refreshing the window
 */
function refresh() {
}

/** ***** common methods - end ****** */

/******* common methods - favorites - start *******/

/**
 * method to return the favoriteComponent for the selected tab
 * 
 */
function getDashboardFavoriteComponent() {
	if(parent.isNetworkQuery) {
		return networkFavoriteComponent;
	}
	
	return scheduleFavoriteComponent;
}

/**
 * method to return the header state of the query window
 * 
 */
function getHeaderButtonSettings() {
	var headerButtonSettings;
	headerButtonSettings = addHeaderButtonsSettings();
	return headerButtonSettings;
}

/**
 * 
 * @param isApplicationLevel
 * @returns the network/schedule/all display settings of the query window
 */
function getDisplayOptionSettings(isApplicationLevel) {
	if(isApplicationLevel != undefined  && isApplicationLevel){
		var displayOptionSettings = {};
		displayOptionSettings[parent.DATA_TYPE_NETWORK] = getNetworkDisplayOptionSettings();
		displayOptionSettings[parent.DATA_TYPE_SCHEDULE] = getScheduleDisplayOptionSettings();
		return displayOptionSettings;
	}else {
		if(parent.isNetworkQuery) {
			return getNetworkDisplayOptionSettings();	
		} else {
			return getScheduleDisplayOptionSettings();
		}
	}
}

/**
 * 
 * @param isApplicationLevel
 * @returns the network/schedule/all content settings of the query window
 */
function getContentFavoriteSettings(isApplicationLevel) {	
	var favoriteSettings = {};
	if(isApplicationLevel != undefined && isApplicationLevel) {
		favoriteSettings[parent.DATA_TYPE_NETWORK] = getNetworkFavoriteSettings();
		favoriteSettings[parent.DATA_TYPE_SCHEDULE] = getScheduleFavoriteSettings();
	} else {
		if(parent.isNetworkQuery) {
			favoriteSettings = getNetworkFavoriteSettings();
		} else {
			favoriteSettings = getScheduleFavoriteSettings();
		}
	}
	return favoriteSettings;
}

/**
 * method to apply the display settings for the query window
 * @param displayOptionSettings
 * @param isDefaultFavorite
 * @param isApplicationLevel
 * @param isRefreshDashboard
 */
function applyDisplayOptionSettings(displayOptionSettings,isDefaultFavorite, isApplicationLevel, isRefreshDashboard) {
	if(isApplicationLevel != undefined && isApplicationLevel){
		if(displayOptionSettings[parent.DATA_TYPE_NETWORK] != undefined){
			applyNetworkDisplayOptionsSettings(displayOptionSettings[parent.DATA_TYPE_NETWORK], isApplicationLevel);
		}
		if (displayOptionSettings[parent.DATA_TYPE_SCHEDULE] != undefined){
			applyScheduleDisplayOptionsSettings(displayOptionSettings[parent.DATA_TYPE_SCHEDULE], isApplicationLevel);
		}
	}else {
		if(parent.isNetworkQuery) {
			applyNetworkDisplayOptionsSettings(displayOptionSettings);
		} else {
			applyScheduleDisplayOptionsSettings(displayOptionSettings);
		}
	}   
}

/**
 * method to apply the content settings for the query window
 * @param favoriteSettings
 * @param isDefaultFavorite
 * @param isApplicationLevel
 * @param isRefreshDashboard
 */
function applyContentFavoriteSettings(favoriteSettings, isDefaultFavorite, isApplicationLevel, isRefreshDashboard) {
	if(isApplicationLevel != undefined && isApplicationLevel){
		if(favoriteSettings[parent.DATA_TYPE_NETWORK] != undefined){
			applyNetworkFavoriteSettings(favoriteSettings[parent.DATA_TYPE_NETWORK], isApplicationLevel);
		}
		if (favoriteSettings[parent.DATA_TYPE_SCHEDULE] != undefined){
			applyScheduleFavoriteSettings(favoriteSettings[parent.DATA_TYPE_SCHEDULE], isApplicationLevel);
		}
		
	}else {
		if(parent.isNetworkQuery) {
			applyNetworkFavoriteSettings(favoriteSettings);
		} else {
			applyScheduleFavoriteSettings(favoriteSettings);
		}
	}
}

/**
 * method to apply the header settings for the query window
 * @param headerButtonSettings
 */
function applyHeaderButtonSettings(headerButtonSettings) {
	if(headerButtonSettings != null){
		parent.$('#toggleQZulu')[0].toggled = !headerButtonSettings["toggleQZuluClass"]; 
		parent.$('#toggleQuery')[0].toggled = !headerButtonSettings["toggleQueryClass"];
		toggleLZView(parent.$('#toggleQZulu')[0]);
		toggleQueryFlag(parent.$('#toggleQuery')[0]);
	} 
}
/******* common methods - favorites - end *******/

/******* favorites methods - start *******/

/**
 * method to add header state of the query window in favorite array
 */
function addHeaderButtonsSettings(){
 	var headerButtonSettings = {}; 
	if(parent.$('#toggleQZulu')[0].toggled != null){
		headerButtonSettings["toggleQZuluClass"] = parent.$('#toggleQZulu')[0].toggled;
	}else{
	    headerButtonSettings["toggleQZuluClass"]  = false;
	}
	if(parent.$('#toggleQuery')[0].toggled != null){
		headerButtonSettings["toggleQueryClass"] = parent.$('#toggleQuery')[0].toggled;
	}else{
	    headerButtonSettings["toggleQueryClass"]  = false;
	}
    return headerButtonSettings;  
}

/**
 * method to add Network tab state of the query window in favorite map
 */
function getNetworkFavoriteSettings() {
	var favoriteSettings = {};
	addGeneralDetails(favoriteSettings);
	addPreviousActivitiesDetails(favoriteSettings);
	addPrimaryActivitiesDetails(favoriteSettings);
	addNextActivitiesDetails(favoriteSettings);
	
	return favoriteSettings;
}

/**
 * method to get Network display settings of the query window
 */
function getNetworkDisplayOptionSettings(){
	var displayOptionSettings = {};
	//checkBox: Primary Filter
	displayOptionSettings["networkFilterproductsChk"] = $('#productsChk').is(":checked");	
	displayOptionSettings["networkFilterproductGroupsChk"] = $('#productGroupsChk').is(":checked");	
	displayOptionSettings["networkFilterdisplayConnectionsChk"] = $('#displayConnectionsChk').is(":checked");	
	displayOptionSettings["networkFilterroutingTypeChk"] = $('#routingTypeChk').is(":checked");	
	return displayOptionSettings;
}	

/**
 * method to add General window state of the query window in favorite map
 */
function addGeneralDetails(favoriteMap){
	favoriteMap["queryTypeCmb"] = $('#queryTypeCmb').val();
	favoriteMap["connectivityCmb"] = $('#connectivityCmb').val();
	favoriteMap["capacityTypeCmb"] = $('#capacityTypeCmb').val();
}

/**
 * method to add Previous Activities window state of the query window in favorite map
 */
function addPreviousActivitiesDetails(favoriteMap){
	favoriteMap["preActivitiesWindowDetails"] = getGridDataInJson("preActivitiesGrid");
}

/**
 * method to add Primary Activities window state of the query window in favorite map
 */
function addPrimaryActivitiesDetails(favoriteMap){
	favoriteMap["primaryGridDetails"] = getGridDataInJson("priActivitiesGrid");
	favoriteMap["priActivityP"] = $("#productsTextArea").val();
	favoriteMap["priActivityGP"] = $("#productGroupsTextArea").val();
	favoriteMap["previousDirectChkVal"] = $('#previousDirectChk').is(":checked");
	favoriteMap["nextDirectChkVal"] = $('#nextDirectChk').is(":checked");
	favoriteMap["routingTypesData"] = {
			"routingNotHAR":$('#routingNotHAR').is(":checked"),
			"routingSingleSort": $('#routingSingleSort').is(":checked"),
			"routingHAR": $('#routingHAR').is(":checked"),
			"notNextMultiSort": $('#notNextMultiSort').is(":checked"),
			"routingPTP": $('#routingPTP').is(":checked"),
			"routingCustomSort": $('#routingCustomSort').is(":checked")
	};   
}

/**
 * method to add Next Activities window state of the query window in favorite map
 */
function addNextActivitiesDetails(favoriteMap){
	favoriteMap["nxtActivitiesWindowDetails"] = getGridDataInJson("nxtActivitiesGrid");
}

/**
 * method to check if we there is any data in Previous grid
 * @returns {Boolean}
 */
function hasPreviousData() {
	return isDataInGrid("preActivitiesGrid");
}

/**
 * method to check if we there is any data in Next grid
 * @returns {Boolean}
 */
function hasNextData() {
	return isDataInGrid("nxtActivitiesGrid");
}

/**
 * method to check if we there is any data in grid
 * @param gridId
 * @returns {Boolean}
 */
function isDataInGrid(gridId) {
	var gridData = getSelectedGridDataInJson(gridId);
	if(gridData) {
		for(var i = 0; i < gridData.length; i++) {
			if(gridData[i].Location != "" || gridData[i].Activity != "" || gridData[i].Day != ""
				|| gridData[i].Transits != "" || gridData[i].transitType != "") {
				return true;	
			}		
		}
	}
	return false;
}

/**
 * method to get Schedule display settings of the query window
 * @returns {displayOptionSettings}
 */
function getScheduleDisplayOptionSettings(){
	var displayOptionSettings = {};
	displayOptionSettings["scheduleDisplayByRoute"] = $('#byRoute').is(":checked");
	displayOptionSettings["scheduleDisplayLeg"] = $('#byLeg').is(":checked");
	displayOptionSettings["scheduleDisplayRoutesOpt"] = $('#routesOpt').is(":checked");
	displayOptionSettings["scheduleDisplayRoutesExpandOpt"] = $('#routesExpandOpt').is(":checked");
	displayOptionSettings["scheduleDisplayOrgNDesOpt"] = $('#orgNDesOpt').is(":checked");
	displayOptionSettings["scheduleDisplayOrgNDesExpandOpt"] = $('#orgNDesExpandOpt').is(":checked");
	displayOptionSettings["scheduleDisplayDepNArrOpt"] = $('#depNArrOpt').is(":checked");
	displayOptionSettings["scheduleDisplayDepNArrExpandOpt"] = $('#depNArrExpandOpt').is(":checked");
	displayOptionSettings["scheduleDisplayTypeOpt"] = $('#typeOpt').is(":checked");
	displayOptionSettings["scheduleDisplayTypeExpandOpt"] = $('#typeExpandOpt').is(":checked");
	displayOptionSettings["scheduleDisplayTypeModeOpt"] = $('#modeOpt').is(":checked");
	displayOptionSettings["scheduleDisplayModeOpt"] = $('#modeExpandOpt').is(":checked");
	displayOptionSettings["scheduleDisplayFlightOpt"] = $('#flightOpt').is(":checked");
	displayOptionSettings["scheduleDisplayRailOpt"] = $('#railOpt').is(":checked");
	displayOptionSettings["scheduleDisplayTruckOpt"] = $('#truckOpt').is(":checked");
	displayOptionSettings["scheduleDisplayShipOpt"] = $('#shipOpt').is(":checked");
	return displayOptionSettings;
}

/**
 * method to get Schedule favorite settings of the query window
 * @returns {favoriteSettings}
 */
function getScheduleFavoriteSettings() {
	var favoriteSettings = {};
		addRoutesDetails(favoriteSettings);
		addRouteWindowDetails(favoriteSettings);
		addOriginalDestinationDetails(favoriteSettings);
		addDepartureArrivalActivityDetails(favoriteSettings);
		addTypesDetails(favoriteSettings);
		addModeDetails(favoriteSettings);
	return favoriteSettings;
}

/**
 * method to add Routes Details window state of the query window in favorite map
 */
function addRoutesDetails(favoriteSettings){
	favoriteSettings["scheduleFilterShowByRoute"] = $('#showByRoute').is(":checked");
	favoriteSettings["scheduleFilterShowByLeg"] = isByLegQuery();
}

function isByLegQuery() {
    return $('#showByLeg').is(":checked");
}

/**
 * method to add OriginalDestination Details window state of the query window in favorite map
 */
function addOriginalDestinationDetails(favoriteSettings){
	favoriteSettings["scheduleFilterOperatorCmb"] = $("#operatorCmb")[0].value;
	favoriteSettings["scheduleFilterIsPaired"] = $('#isPaired').is(":checked");
	favoriteSettings["scheduleFilterIsDirect"] = $('#isDirect').is(":checked");
	favoriteSettings["scheduleFilterIsByAirport"] = $('#isByAirport').is(":checked");
	favoriteSettings["scheduleFilterOriginProduct"] = $('#orignDestWinOrigin').val();
	favoriteSettings["scheduleFilterDestProduct"] = $('#orignDestWinDest').val();
}

//need to change below 2 methods
function getScheduleLocations(divId){
	return formatLocationsStr(getScheduleInputLocations(divId));	
}

function formatLocationsStr(locationStr) {
	if(locationStr != undefined){
		return  locationStr.replace(/ /g, ",").split(",");
	}
};

function getAllScheduleLocations(){
	var allLocations=[];
	$.each(["orignDestWinOrigin", "orignDestWinDest"], function(key, value) {		
		$.merge( allLocations, getScheduleLocations(value) );
    });
	
	return allLocations;
}

/**
 * method to add RouteWindow Details window state of the query window in favorite map
 */
function addRouteWindowDetails(favoriteSettings){
	favoriteSettings["scheduleFilterEnterRoute"] = $('#enterRoute')[0].value;
}	 

/**
 * method to add DepartureArrival window state of the query window in favorite map
 */
function addDepartureArrivalActivityDetails(favoriteSettings){
	favoriteSettings["scheduleFilterDepartsCmb"] = $('#departsCmb')[0].value;
	favoriteSettings["scheduleFilterBetweenTime"] = $('#betweenTime')[0].value;
	favoriteSettings["scheduleFilterAndTime"] = $('#andTime')[0].value;
	favoriteSettings["scheduleFilterOnDays"] = $('#onDays')[0].value;
}	 

/**
 * method to add Types window state of the query window in favorite map
 */
function addTypesDetails(favoriteSettings){
	favoriteSettings["scheduleFilterLaneHaulChk"] = $('#laneHaulChk').is(":checked");
	favoriteSettings["scheduleFilterStuttleChk"] = $('#stuttleChk').is(":checked");
	favoriteSettings["scheduleFilterFxChk"] = $('#fxChk').is(":checked");
	favoriteSettings["scheduleFilterContractChk"] = $('#contractChk').is(":checked");
	favoriteSettings["scheduleFilterOthersChk"] = $('#othersChk').is(":checked");
	favoriteSettings["scheduleFilterEquipment"] = $("#equipmentType").val();
	favoriteSettings["scheduleFilterLeg"] = $("#legType").val();
}
/**
 * method to add Modes window state of the query window in favorite map
 */
function addModeDetails(favoriteSettings){
	favoriteSettings["scheduleFilterFlightTrunk"] = $('#flightTrunk').is(":checked");
	favoriteSettings["scheduleFilterTruckStandard"] = $('#truckStandard').is(":checked");
	favoriteSettings["scheduleFilterRailOversize"] = $('#railOversize').is(":checked");
	favoriteSettings["scheduleFilterShipOversize"] = $('#shipOversize').is(":checked");
	favoriteSettings["scheduleFilterShipFlightFeeder"] = $('#flightFeeder').is(":checked");
	favoriteSettings["scheduleTruckOversize"] = $('#truckOversize').is(":checked");
	//favoriteSettings["scheduleFlightOversizeObc"] = $('#flightOversizeObc').is(":checked");
}

/**
 * method to apply NetworkFavorite Settings of the query window
 * @param favoriteSettings
 * @param isApplicationLevel
 */
function applyNetworkFavoriteSettings(favoriteSettings, isApplicationLevel) {
	//General Details 
	$("#queryTypeCmb").data('kendoComboBox').value(favoriteSettings.queryTypeCmb);
	$("#connectivityCmb").data('kendoComboBox').value(favoriteSettings.connectivityCmb);
	$("#capacityTypeCmb").data('kendoComboBox').value(favoriteSettings.capacityTypeCmb);
	if(favoriteSettings.queryTypeCmb){
		enableDisableRoutingType(favoriteSettings.queryTypeCmb);
	}
	$("#previousDirectChk")[0].checked	= favoriteSettings.previousDirectChkVal; 
	$("#nextDirectChk")[0].checked	= favoriteSettings.nextDirectChkVal; 
	
	$('#routingNotHAR')[0].checked = favoriteSettings.routingTypesData.routingNotHAR;
	$('#routingSingleSort')[0].checked = favoriteSettings.routingTypesData.routingSingleSort;
	$('#routingHAR')[0].checked = favoriteSettings.routingTypesData.routingHAR;
	$('#notNextMultiSort')[0].checked = favoriteSettings.routingTypesData.notNextMultiSort;
	$('#routingPTP')[0].checked = favoriteSettings.routingTypesData.routingPTP;
	$('#routingCustomSort')[0].checked = favoriteSettings.routingTypesData.routingCustomSort;
	
	$("#productsTextArea").val(favoriteSettings.priActivityP);
	$("#productGroupsTextArea").val(favoriteSettings.priActivityGP);
	
	addDataToGrid("#priActivitiesGrid",favoriteSettings.primaryGridDetails,true);
	addDataToGrid("#preActivitiesGrid",favoriteSettings.preActivitiesWindowDetails,true);
	addDataToGrid("#nxtActivitiesGrid",favoriteSettings.nxtActivitiesWindowDetails,true);
}

/**
 *  method to apply NetworkDisplay Settings of the query window
 * @param displayOptionSettings
 * @param isApplicationLevel
 */
function applyNetworkDisplayOptionsSettings(displayOptionSettings, isApplicationLevel){
	$("#productsChk")[0].checked = displayOptionSettings.networkFilterproductsChk; 
	showHideWindowItems($("#productsChk")[0], 'productId','productId2');
	$("#productGroupsChk")[0].checked = displayOptionSettings.networkFilterproductGroupsChk;
	showHideWindowItems($("#productGroupsChk")[0], 'productGrpsId', 'productGrpsId2');
	$("#displayConnectionsChk")[0].checked = displayOptionSettings.networkFilterdisplayConnectionsChk; 	
	showHideWindowItems($("#displayConnectionsChk")[0], 'displayConnections');
	$("#routingTypeChk")[0].checked	= displayOptionSettings.networkFilterroutingTypeChk; 	
	showHideWindowItems($("#routingTypeChk")[0], 'routingTypes');
}

/**
 * method to apply ScheduleFavorite Settings of the query window
 * @param favoriteSettings
 * @param isApplicationLevel
 */
function applyScheduleFavoriteSettings(favoriteSettings, isApplicationLevel){
	$('#showByLeg')[0].checked = favoriteSettings.scheduleFilterShowByLeg;
	$('#showByRoute')[0].checked = favoriteSettings.scheduleFilterShowByRoute;
	$('#isPaired')[0].checked = favoriteSettings.scheduleFilterIsPaired;
	$('#isDirect')[0].checked = favoriteSettings.scheduleFilterIsDirect;
    $('#isByAirport')[0].checked = favoriteSettings.scheduleFilterIsByAirport;
    $('#orignDestWinOrigin').val(favoriteSettings["scheduleFilterOriginProduct"]);
    $('#orignDestWinDest').val(favoriteSettings["scheduleFilterDestProduct"]);
	$("#operatorCmb").data('kendoDropDownList').value(favoriteSettings.scheduleFilterOperatorCmb); 
	$('#enterRoute')[0].value = favoriteSettings.scheduleFilterEnterRoute;
	$('#departsCmb').data("kendoComboBox").value(favoriteSettings.scheduleFilterDepartsCmb);
	$('#betweenTime')[0].value = favoriteSettings.scheduleFilterBetweenTime;
	$('#andTime')[0].value = favoriteSettings.scheduleFilterAndTime;
	$('#onDays')[0].value = favoriteSettings.scheduleFilterOnDays;
	$('#laneHaulChk')[0].checked = favoriteSettings.scheduleFilterLaneHaulChk;
	$('#stuttleChk')[0].checked	= favoriteSettings.scheduleFilterStuttleChk;
	$('#fxChk')[0].checked = favoriteSettings.scheduleFilterFxChk;
	$('#contractChk')[0].checked = favoriteSettings.scheduleFilterContractChk;
	$('#othersChk')[0].checked = favoriteSettings.scheduleFilterOthersChk;
	$("#equipmentType").val(favoriteSettings["scheduleFilterEquipment"]);
	$("#legType").val(favoriteSettings["scheduleFilterLeg"]);
	$('#flightTrunk')[0].checked = favoriteSettings.scheduleFilterFlightTrunk;
	$('#truckStandard')[0].checked = favoriteSettings.scheduleFilterTruckStandard;
	$('#railOversize')[0].checked = favoriteSettings.scheduleFilterRailOversize;
	$('#shipOversize')[0].checked = favoriteSettings.scheduleFilterShipOversize; 
	$('#flightFeeder')[0].checked = favoriteSettings.scheduleFilterShipFlightFeeder;
	$('#truckOversize')[0].checked = favoriteSettings.scheduleTruckOversize;
}

/**
 * method to apply ScheduleDisplay Settings of the query window
 * @param displayOptionSettings
 * @param isApplicationLevel
 */
function applyScheduleDisplayOptionsSettings(displayOptionSettings, isApplicationLevel){
    $('#byRoute')[0].checked = displayOptionSettings.scheduleDisplayByRoute;
    $('#byLeg')[0].checked = displayOptionSettings.scheduleDisplayLeg;
    $('#routesOpt')[0].checked = displayOptionSettings.scheduleDisplayRoutesOpt;
	$('#routesExpandOpt')[0].checked = displayOptionSettings.scheduleDisplayRoutesExpandOpt;
	$('#orgNDesOpt')[0].checked = displayOptionSettings.scheduleDisplayOrgNDesOpt;
    $('#orgNDesExpandOpt')[0].checked= displayOptionSettings.scheduleDisplayOrgNDesExpandOpt;
	$('#depNArrOpt')[0].checked= displayOptionSettings.scheduleDisplayDepNArrOpt; 
    $('#depNArrExpandOpt')[0].checked= displayOptionSettings.scheduleDisplayDepNArrExpandOpt;
    $('#typeOpt')[0].checked = displayOptionSettings.scheduleDisplayTypeOpt;
    $('#typeExpandOpt')[0].checked = displayOptionSettings.scheduleDisplayTypeExpandOpt;
	$('#modeOpt')[0].checked= displayOptionSettings.scheduleDisplayTypeModeOpt; 
    $('#modeExpandOpt')[0].checked = displayOptionSettings.scheduleDisplayModeOpt; 
    $('#flightOpt')[0].checked= displayOptionSettings.scheduleDisplayFlightOpt;
	$('#railOpt')[0].checked= displayOptionSettings.scheduleDisplayRailOpt;
	$('#truckOpt')[0].checked = displayOptionSettings.scheduleDisplayTruckOpt; 
	$('#shipOpt')[0].checked = displayOptionSettings.scheduleDisplayShipOpt;
	showHideWindow($('#routesOpt')[0], 'routeWindow',isApplicationLevel, undefined, displayOptionSettings.scheduleDisplayRoutesExpandOpt);
	showHideWindow($('#orgNDesOpt')[0], 'orgDestiWindow', isApplicationLevel, undefined, displayOptionSettings.scheduleDisplayOrgNDesExpandOpt);
	showHideWindow($('#depNArrOpt')[0], 'depArrActTimeWindow', isApplicationLevel, undefined, displayOptionSettings.scheduleDisplayDepNArrExpandOpt);
	showHideWindow($('#typeOpt')[0], 'typesWindow', isApplicationLevel, undefined, displayOptionSettings.scheduleDisplayTypeExpandOpt);
	showHideWindow($('#modeOpt')[0], 'modeWindow', isApplicationLevel, undefined, displayOptionSettings.scheduleDisplayModeOpt);
	validateExpandCheckbox($('#routesOpt')[0], 'routesExpandOpt');
	validateExpandCheckbox($('#orgNDesOpt')[0], 'orgNDesExpandOpt');
	validateExpandCheckbox($('#depNArrOpt')[0], 'depNArrExpandOpt');
	validateExpandCheckbox($('#typeOpt')[0], 'typeExpandOpt');
	validateExpandCheckbox($('#modeOpt')[0], 'modeExpandOpt');
	
	minMaxWindow($('#routesExpandOpt')[0], 'routeWindow');
	minMaxWindow($('#orgNDesExpandOpt')[0], 'orgDestiWindow');
	minMaxWindow($('#depNArrExpandOpt')[0], 'depArrActTimeWindow');
	minMaxWindow($('#typeExpandOpt')[0], 'typesWindow');
	minMaxWindow($('#modeExpandOpt')[0], 'modeWindow');
	
	validateExpandCheckboxes($('#flightOpt')[0], ['flightTrunk','flightFeeder'], true);
	validateExpandCheckboxes($('#railOpt')[0], ['railOversize'], true);
	validateExpandCheckboxes($('#truckOpt')[0], ['truckStandard','truckOversize'], true);
	validateExpandCheckboxes($('#shipOpt')[0], ['shipOversize'], true);
}

/**
 * method to clear the values of the kendoGrid
 * @param gridId
 */
function clearGridData(gridId, isRemoveNullRecords) {
	var grid = $(gridId).data("kendoGrid");
	var dataObj = grid.dataSource.data();
	var len = dataObj.length;
	for(var i = (len-1); i >=0 ; i--) {
		if(isRemoveNullRecords){
			if( isNullActivity(dataObj[i])){
				grid.dataSource.remove(dataObj[i]);
			}
		}else {
			grid.dataSource.remove(dataObj[0]);
		}	
	}
}

function getKendoGridTotalRecords(gridId){
	var kendoGridData;
	if(gridId != undefined){
		kendoGridData = getKendoGridData(gridId);
		if(kendoGridData != undefined){
			return kendoGridData.length;
		}
	}	
}

function getKendoGridData(gridId){
	if(gridId != undefined){
		var kendoGridDatasource = getKendoGridDatasource(gridId);
		if(kendoGridDatasource != undefined){
			return kendoGridDatasource.data();			
		}
	}		
}

function getKendoGridDatasource(gridId){
	var kendoGrid = getKendoGrid(gridId);
	if(kendoGrid != undefined){
		return kendoGrid.dataSource;			
	}
}
function getKendoGrid(gridId){
	if(gridId!= undefined){
		return $(gridId).data("kendoGrid");
	}
}

function isNullActivity(dataObj){
	return (
			dataObj.Activity == "" &&
	dataObj.Day == "" && 
	dataObj.Location == "" &&
	(dataObj.Transits == undefined || dataObj.Transits == "")
	);
}


/**
 * method to set values to kendoGrid
 * @param gridId
 * @param objArray
 * @param isClearData
 */
function addDataToGrid(gridId, objArray,isClearData, isRemoveNullRecords) {
	if(isClearData){
		clearGridData(gridId, isRemoveNullRecords);
	}
	if(objArray) {
		var grid = $(gridId).data("kendoGrid");
		for(var i = 0; i < objArray.length; i++) {
			grid.dataSource.add(objArray[i]);
		}
	}
}
/******* favorites methods - end *******/

/**
 * method to get the value of IsAddToResults(header button)   
 * @returns {Boolean}
 */
function getIsAddToResults() {
	return isAddToResults;
}

/**
 * method to set the value of IsAddToResults(header button state)   
 */
function setAddToResults(isAddToResults) {
	this.isAddToResults=isAddToResults;
}

/**
 * method to get the value of localZuluFlag(header button)   
 * @returns {Boolean}
 */
function getLocalZuluFlag() {
	return localZuluFlag;
}

/**
 * method to set the value of localZuluFlag(header button state)   
 */
function setLocalZuluFlag(localZuluFlag) {
	this.localZuluFlag=localZuluFlag;
}

/**
 * method to initialize the query window
 */
function initialize() {
	//adding the header buttons for the query window
	addButtonsBar();
	//setting the initial state of LocalZuluButton button
	setLocalZuluButtonState(parent.isLocalTimeFlag());
	
	//adding the network and schedule tab select listener and setting the position as top  
	var kendotabstrip = $("#tabStrip").kendoTabStrip({select: onTabSelect});
	kendotabstrip.parent().find('.k-tabstrip').css({
         "padding-top": "0px"
	});
	kendotabstrip.parent().find('.k-tabstrip-items').css({
         "padding-top": "0px"
	});
	
	//initialize Network Windows
	initializeNetworkWindows();
	
	//method to initialize Network Windows
    initializeSchedulerWindows();

    //hide/close the schedule windows to show network as initial view
    $("#schedulersGeneralDiv").hide();
    $("#schedulefilterOptions").hide();
    $("#routeWindow").data("kendoWindow").close();
    $("#orgDestiWindow").data("kendoWindow").close();
    $("#depArrActTimeWindow").data("kendoWindow").close();
    $("#typesWindow").data("kendoWindow").close();
    $("#modeWindow").data("kendoWindow").close();
	
    //initialize the datasources
	createDataSources();
	//read the data from the datasources
	invokeDataSources();
	
	//create and initialize the network query favorites. 
	networkFavoriteComponent = new FavoriteComponent(parent.DASHBOARD_ID_QUERY+"_Network", "networkQueryFavoritesMenu","Query");
	if(parent.getFavoriteDataCache() !=null){
		networkFavoriteComponent.onInitalizeFavorite(parent.getFavoriteDataCache());
	}else{
		networkFavoriteComponent.retrieveAllFavorites();
	}
	parent.capturCtrlR($(window));
	initializeInputAndTextareaFocus();//FDX-1070
}

/**
 * method to create dataSources for the query window controls
 */
function createDataSources() {
	for(var i = 0; i < queryDatasourceNames.length; i++) {
		queryDatasources[queryDatasourceNames[i]["datasourceName"]] = createDataSource(queryDatasourceNames[i]["datasourceName"], queryDatasourceUrls[i], queryDatasourceUsePagination[i],queryDatasourceNames[i]["isAsync"]);
	}	
}

/**
 * method to read the values from the dataSources
 */
function invokeDataSources() {
	for(var i = 0; i < queryDatasourceNames.length; i++) {
		queryDatasources[queryDatasourceNames[i]["datasourceName"]].data([]);
		queryDatasources[queryDatasourceNames[i]["datasourceName"]].read();
	}	
}

/**
 * method to add header button bar to Query window.
 */
function addButtonsBar() {
	parent.addButtonsBar(parent.DASHBOARD_ID_QUERY, $("#headerButtonsBar"));		
}

/**
 * method to set LocalZuluButton State for query window 
 * @param isLocalFlag
 */
function setLocalZuluButtonState(isLocalFlag) {
	var btn = parent.$('#toggleQZulu')[0];
	btn.toggled = isLocalFlag;
	toggleLZView(btn);
}

/**
 * method to toggle the LocalZulu state
 * @param btn
 */
function toggleLZView(btn) {
	parent.toggleTimeView(btn);
	localZuluFlag = btn.toggled ? "Z" : "L";			
}

/**
 * method to toggle the Replace results with new query/Add to previous results button state.
 * @param btn
 */
function toggleQueryFlag(btn) {
	if(btn.toggled){
		btn.children[0].className = "k-icon replace-results";
		setAddToResults(false);
		btn.toggled = false;
		btn.children[0].title="Replace results with new query";
	} else {
		btn.children[0].className = "k-icon add-to-results";
		setAddToResults(true);
		btn.toggled = true;
		btn.children[0].title="Add to previous results";
	}
}

/**
 * method to validate the availability of the textContent in an array. 
 * @param selectedValues
 * @param textContent
 * @returns {Boolean}
 */
function isSelectedItemValid(selectedValues,textContent){
	for(var i=0;i<selectedValues.length;i++){
		if(selectedValues[i]==textContent){
			return false;
		}
	}
	return true;
}

/**
 * method to get selected values matching dataValueField 
 * @param dataValueField
 * @param tempValues
 * @returns {Array}
 */
function getSelectedValues(dataValueField,tempValues){
	var selectedValues=[];
	if(tempValues!=null && dataValueField !=null){
		for(var i=0;i<tempValues.length;i++){
			if(dataValueField==PRODGROUPMASKID){//for prodMaskId
				selectedValues.push(tempValues[i].prodMaskId);
			}else if(dataValueField==PRODOFFSET){//prodOffset
				selectedValues.push(tempValues[i].prodOffset);
			}else if(dataValueField==LOCCD){//for locCd
				selectedValues.push(tempValues[i].locCd);
			}else if(dataValueField==EQTYPE){//for eqType
				selectedValues.push(tempValues[i].eqType);
			}else if(dataValueField==LEGTYPECD){//for legTypeCd 
				selectedValues.push(tempValues[i].legTypeCd);
			}else if(dataValueField==EMPTY_STRING){//for others 
				selectedValues.push(tempValues[i]);
			}
		}
	}
	return selectedValues;
}


/**
 * method to create dataSource
 * @param name
 * @param url
 * @param usePagination
 * @returns {kendo.data.DataSource}
 */
function createDataSource(name, url, usePagination, isAsync) {
	var datasource = new kendo.data.DataSource({
		serverFiltering:false,
		transport: {
		    read: {
		        url:
		        function (options) {
			        return url+parent.getCommonCaseId()+"&rand="+getTime();
			    },
			    dataType: OUTPUT_TYPE_JSON
		    }
		  },
		  requestStart: function(e, isAsync) {
			  //!areQueryWindowsInitialized is due to an error, shouldn't actually be there
			  if(!areQueryWindowsInitialized && !isQueryWindowDataLoaded) {
				  parent.showProgressDialog(!isAsync, PROGRESS_DIALOG_MESSAGE_INITIALIZE_MASTER_DATA);
			  }
		  },
		  requestEnd: function(e, isAsync) {
			  if(!areQueryWindowsInitialized && !isQueryWindowDataLoaded) {
				  if(!isAsync){
					  hideProgressDialog(); 
				  }				  
			  }
			  if(isQueryWindowDataLoaded != null && isQueryWindowDataLoaded == true){
				  //initialize the map for list of activities for each location
				  parent.getDashboardContentWindow(parent.DASHBOARD_ID_QUERY).initActivitiesByLoc();
				  //fix for initializing the move number popup after master data is loaded
				  parent.getDashboardContentWindow(parent.DASHBOARD_ID_SCHEDULE_MATRIX_WIP).afterMasterDataInitialized();
			  }
		  },
		  error: function(e,isAsync) {
			  if(!areQueryWindowsInitialized && !isQueryWindowDataLoaded) {
				  if(!isAsync){
					  hideProgressDialog();
				  }				  
			  }
		  }
		});
	
	if(usePagination) {
		datasource.pageSize(20);	    
	}
	
	return datasource;
}

/**
 * method to close the ProgressDialog of query window
 */
function hideProgressDialog() {
	parent.showProgressDialog(false);
	//console.log("request count "+parent.getOpenRequestCount());
	if(!isQueryWindowDataLoaded && parent.getOpenRequestCount() == 0) {
		if(!areQueryWindowsInitialized) {
			//initialize the query windows
			initializeNetworkQueryWindow();
			areQueryWindowsInitialized = true;
		}
		isQueryWindowDataLoaded = true;
		if(networkFavoriteComponent != null && !networkFavoriteComponent.isFavoriteApplied){
		    networkFavoriteComponent.applyDefaultFavorite();
		    parent.setDashboardInitialized(parent.DASHBOARD_ID_QUERY);
		}
		if(!parent.hasMapInitialized()){
			console.log("Query Window is loaded and showing map progress bar");
			parent.showProgressDialog(true, PROGRESS_DIALOG_MESSAGE_MAP_INITIALIZE);
		}
	}
}

/**
 * method to initialize NetworkQuery Window MasterData
 */
function initializeNetworkQueryWindowMasterData() {
	if(!isNetworkQueryWindowInitialized) {
		initializeNetworkQueryWindow();
	} 
}

/**
 *  method to initialize NetworkQuery Window MasterData
 */
function initializeNetworkQueryWindow() {
    var days = getDays();
    var queryTypes = getQueryTypes();
    var connectivityTypes = getConnectivityTypes();
    var capacityTypes = getCapacityTypes();
    var routingTypes = getRoutingTypes();
    
    //create and initialize filters grid
    init_ActivityKendoGrid('preActivitiesGrid');
    init_ActivityKendoGrid('priActivitiesGrid');
    init_ActivityKendoGrid('nxtActivitiesGrid');
    
    createKendoComboBoxWithSelect($('#queryTypeCmb'),EMPTY_STRING,FILTER_TYPE_STARTS_WITH,queryTypes,LABEL,VALUE,onRoutingTypeCmbSelect);
    createKendoComboBox('connectivityCmb',EMPTY_STRING,FILTER_TYPE_STARTS_WITH,connectivityTypes,LABEL,VALUE);
    var cptyTypeCmb =createKendoComboBox('capacityTypeCmb',EMPTY_STRING,FILTER_TYPE_STARTS_WITH,capacityTypes,LABEL,VALUE);
    $(cptyTypeCmb).data("kendoComboBox").input.bind("keydown", function(evt) {
    	if(evt.keyCode == 9){
    		$("#generalWindow").data("kendoWindow").wrapper.find(".k-i-minimize").click();
    		setTimeout(function() {
    			var grid = $("#preActivitiesGrid").data("kendoGrid");
    			grid.editCell(grid.tbody.find("tr").eq(0).find("td").eq(1));  
    			setTimeout(function() {
	    			var grid = $("#preActivitiesGrid").data("kendoGrid");
	    			(grid.tbody.find("tr").eq(0).find(".k-input")).focus();
    			}, 200);
    		}, 150);
    	}
    });			
    //createKendoComboBox('routingTypeCmb',EMPTY_STRING,FILTER_TYPE_STARTS_WITH,routingTypes,LABEL,VALUE);
    $("#queryTypeCmb").data("kendoComboBox").select(0);
    $("#connectivityCmb").data("kendoComboBox").select(0);
    $("#capacityTypeCmb").data("kendoComboBox").select(0);
    //$("#routingTypeCmb").data("kendoComboBox").select(0);
    enableDisableRoutingType("L");
}

function onRoutingTypeCmbSelect(e) {
	var dataItem = this.dataItem(e.item.index());
    if(dataItem != null && dataItem.value != null){
    	enableDisableRoutingType(dataItem.value);
    }	
};
function createKendoComboBoxWithSelect(comboDiv,placeholder,filterType,dataSource,dataTextField,dataValueField,onCmbSelect){
	//create kendoComboBox UI component
	return comboDiv.kendoComboBox({
		minLength: 0,
		dataSource: dataSource,
		filter: filterType,
		select:onCmbSelect,
		placeholder: placeholder,
		dataTextField: dataTextField,
		dataValueField: dataValueField,
		change: function(e){   
			if(e.sender._oldIndex < 0){
       			e.sender.text("");
       		}
		}
   });
}
/**
 * method triggred on toggle of the query tabs
 * @param e
 */
function onTabSelect(e) {
	var selectedTabName;
	if(e.item != undefined){
		selectedTabName = $(e.item).attr("tabname");//$(e.item).find("> .k-link").text(); 
	}else {
		selectedTabName = e;
	}
	parent.VIEWER.onBeforeTabSelect(selectedTabName);
	parent.closeSearchPops();
	isNetworkTab = (selectedTabName == FILTER_NETWORK_TAB);
	console.log("isNetworkTab ["+isNetworkTab +"]");
	if(selectedTabName == FILTER_NETWORK_TAB){
    	$("#priActivitiesWindow").data("kendoWindow").open();
    	$("#nxtActivitiesWindow").data("kendoWindow").open();
    	$("#preActivitiesWindow").data("kendoWindow").open();
    	$("#generalWindow").data("kendoWindow").open();
    	
    	$("#schedulersGeneralDiv").hide();
    	$("#schedulefilterOptions").hide();
    	$("#networkfilterOptions").show();
    	
    	$("#routeWindow").data("kendoWindow").close();
    	$("#orgDestiWindow").data("kendoWindow").close();
    	$("#depArrActTimeWindow").data("kendoWindow").close();
    	$("#typesWindow").data("kendoWindow").close();
    	$("#modeWindow").data("kendoWindow").close();
    	parent.$("#scheduleQueryFavoritesMenu")[0].style.display="none";
    	parent.$("#networkQueryFavoritesMenu")[0].style.display="";
	
	} else {
		$("#generalWindow").data("kendoWindow").close();
    	$("#preActivitiesWindow").data("kendoWindow").close();
    	$("#priActivitiesWindow").data("kendoWindow").close();
    	$("#nxtActivitiesWindow").data("kendoWindow").close();
    	
    	$("#schedulersGeneralDiv").show();
    	$("#schedulefilterOptions").show();
    	$("#networkfilterOptions").hide();
    	
    	if($("#modeOpt").is(":checked")) {
    		$("#modeWindow").data("kendoWindow").open();
    	}
    	if($("#typeOpt").is(":checked")) {
    		$("#typesWindow").data("kendoWindow").open();
    	}
    	if($("#depNArrOpt").is(":checked")) {
    		$("#depArrActTimeWindow").data("kendoWindow").open();
    	}
    	if($("#orgNDesOpt").is(":checked")) {
    		$("#orgDestiWindow").data("kendoWindow").open();
    	}
    	if($("#routesOpt").is(":checked")) {
    		$("#routeWindow").data("kendoWindow").open();
    	}
		parent.$("#networkQueryFavoritesMenu")[0].style.display="none";
        parent.$("#scheduleQueryFavoritesMenu")[0].style.display="";
        
    	setTimeout(function(){
    		$("html, body").animate({
                scrollTop: 0
            }, 100);
    		setTimeout(function(){
    			document.getElementById("enterRoute").focus();
    		},150);	
        },500);
	}
	setTimeout(function(){
		if(document.getElementById("manageFavoriteDiv") && document.getElementById("manageFavoriteDiv").firstChild) {
			document.getElementById("manageFavoriteDiv").firstChild.contentWindow.populateListControls();
		}
	},2000);
    showFilterErrorMsg(EMPTY_STRING);
    parent.VIEWER.onTabSelect(selectedTabName);
    if(scheduleFavoriteComponent == undefined) {
    	initializeScheduleFavoriteComponent();
	}
}

/**
 * method to initialize Schedule FavoriteComponent
 */
function initializeScheduleFavoriteComponent(){
	scheduleFavoriteComponent = new FavoriteComponent(parent.DASHBOARD_ID_QUERY+"_Schedule", "scheduleQueryFavoritesMenu","Query");
	if(parent.getFavoriteDataCache() !=null){
		scheduleFavoriteComponent.onInitalizeFavorite(parent.getFavoriteDataCache());
	}else{
		scheduleFavoriteComponent.retrieveAllFavorites();
	}
	 if(scheduleFavoriteComponent != null && !scheduleFavoriteComponent.isFavoriteApplied){
		 if(parent.isCloneInitialized() && parent.isCloneScheduleFavoriteApplied){
			 if(scheduleFavoriteComponent.defaultfavorite != undefined){
				 scheduleFavoriteComponent.applyDefaultFavorite();			  
			 }else if(scheduleFavoriteComponent.defaultfavorite == undefined 
					 && parent.globalFavoriteComponent != undefined 
					 && parent.globalFavoriteComponent.isScheduleTabFavoriteApplied != undefined 
					 && !parent.globalFavoriteComponent.isScheduleTabFavoriteApplied
					 && parent.globalFavoriteComponent.scheduleFavoriteDisplayOptionSettings != undefined) {
				 applyScheduleDisplayOptionsSettings(parent.globalFavoriteComponent.scheduleFavoriteDisplayOptionSettings , true);
				 parent.globalFavoriteComponent.isScheduleTabFavoriteApplied = true;
			 }
		 }
		 parent.setDashboardInitialized(parent.DASHBOARD_ID_QUERY);
	 }
}

/**
 * method to hide the schedule query windows 
 */
function clearScheduleWindowStates(){
	$("#schedulersGeneralDiv").hide();
	$("#schedulefilterOptions").hide();
	
	$("#routeWindow").data("kendoWindow").close();
	$("#orgDestiWindow").data("kendoWindow").close();
	$("#depArrActTimeWindow").data("kendoWindow").close();
	$("#typesWindow").data("kendoWindow").close();
	$("#modeWindow").data("kendoWindow").close();
	parent.$("#scheduleQueryFavoritesMenu")[0].style.display="none";
}

/**
 * method to show the selected tab
 * @param selectedTabName
 */
function tabSelectHandler(selectedTabName){
	var tabStrip = $("#tabStrip").data("kendoTabStrip");
	isNetworkTab = (selectedTabName == FILTER_NETWORK_TAB);
	
	if(!isNetworkTab){
		tabStrip.select(1);
	}else {
		tabStrip.select(0);
	}
}

/**
 * method to create kendoWindow with specfied winId,title, xPosition & yPosition
 * @param winId
 * @param title
 * @param xPosition
 * @param yPosition
 * @param width
 * @param isResize
 * @returns {kendoWindow}
 */
function createWindows(winId,title, xPosition, yPosition,width, isResize){
	 var window = $(winId);
     if (!window.data("kendoWindow")) {
         window.kendoWindow({
             width: width,
             actions: ["Minimize"],
             title: title,
             resize: function(e){
            	 if(isResize){
            		 resizeFilterWindowHandler(e, winId);
            	 }
             },
             open: function(e){
            	 window.isOpen  = true;
             }
         });
     }
 	 // setting the x, y position
     window.closest(".k-window").css({
         top: xPosition,
         left: yPosition
     });
     window.parent().find('.k-window-title').css({
    	 "right": "auto"
    });
     window.parent().addClass("querySubWindow");
     window.parent().addClass("k-subwindow-actions");
     attachMaxMinEvent(window,".k-i-minimize",true,false,false);
     return window;
}
/**
 * method to handle the min-max event of the query windows
 * @param window
 * @param buttonStyle
 * @param isMinimized
 * @param isRestore
 * @param isOpen
 */
function attachMaxMinEvent(window,buttonStyle,isMinimized,isRestore,isOpen){
	setTimeout(function(){
     	  window.data("kendoWindow").wrapper.find(buttonStyle).click(function(e){
         	 window.isMinimized = isMinimized;
         	 window.isRestore= isRestore;
         	 window.isOpen  = isOpen;
         	 updateSettingsExpandCheckBox(window[0].id,isOpen);
         	 generalWindowFocusHandler(window[0].id,isOpen);
         	 if(buttonStyle==".k-i-minimize"){
         		attachMaxMinEvent(window,".k-i-restore",false,true,true);
         	 }	
        });
	      (window.data("kendoWindow").wrapper.find(buttonStyle)).parent().click(function(e){
	    	  window.isMinimized = isMinimized;
	          window.isRestore= isRestore;
	          window.isOpen  = isOpen;
	       	  updateSettingsExpandCheckBox(window[0].id,isOpen);
	       	  generalWindowFocusHandler(window[0].id,isOpen);
	       	  if(buttonStyle==".k-i-minimize"){
	       		attachMaxMinEvent(window,".k-i-restore",false,true,true);
         	  }
	       });
      },50);
}

function generalWindowFocusHandler(windowId,isChecked){
	if(windowId == "generalWindow" && isChecked){
		setTimeout(function(){
			$("#queryTypeCmb").data("kendoComboBox").input.focus();
		},150);
	}
}
/**
 * method to update the settings expand checkbox for schedule query window 
 * @param windowId
 * @param isChecked
 */
function updateSettingsExpandCheckBox(windowId,isChecked){
	if(windowId == "routeWindow"){
		selectSettingsCheckBox("routesExpandOpt",isChecked);
	}else if(windowId == "orgDestiWindow"){
		selectSettingsCheckBox("orgNDesExpandOpt",isChecked);
	}else if(windowId == "depArrActTimeWindow"){
		selectSettingsCheckBox("depNArrExpandOpt",isChecked);
	}else if(windowId == "typesWindow"){
		selectSettingsCheckBox("typeExpandOpt",isChecked);
	}else if(windowId == "modeWindow"){
		selectSettingsCheckBox("modeExpandOpt",isChecked);
	}
	
}
/**
 * method to update the status of the checkbox in schedule settings
 * @param controlId
 * @param isChecked
 */
function selectSettingsCheckBox(controlId,isChecked){
	var itemDivObj=$(HASH_STRING+controlId);
	if(isChecked == null){
		itemDivObj[0].checked=!itemDivObj[0].checked;
		return;
	}
	if(isChecked) {
		itemDivObj.removeAttr("disabled");
			itemDivObj[0].checked=true;
	} else {
		itemDivObj[0].checked=false;
	}
}

/**
 * method triggred on resize of the window inside query window 
 * @param e
 * @param winId
 */
function resizeFilterWindowHandler(e, winId) {
	var gridId;
	if(winId =="#preActivitiesWindow"){
		gridId = "#preActivitiesGrid";
	}else if(winId =="#priActivitiesWindow"){
		gridId = "#priActivitiesGrid";
	}else if(winId =="#nxtActivitiesWindow"){
		gridId = "#nxtActivitiesGrid";
	}
 	var gridElement = $(gridId);
	var dataArea = gridElement.find(".k-grid-content");	    
 	var newHeight = $(winId).height();
 	var diff = gridElement.find(".k-grid-header").innerHeight() ;
 	if(newHeight > 0) {
 		if(winId =="#priActivitiesWindow"){
 			newHeight = ((newHeight)/2) - 45;
 		}
	    gridElement.height(newHeight);
	    dataArea.height(newHeight - diff);
    }
}

/**
 * method to initialize Network Windows
 */
function initializeNetworkWindows() {
	//create and initialize network filters window  
	networkQueryWindows["#generalWindow"] = createWindows("#generalWindow",WINDOW_HEADER_GERNRAL,4, 4,WINDOW_WIDTH);
	networkQueryWindows["#preActivitiesWindow"] = createWindows("#preActivitiesWindow",WINDOW_HEADER_PREVIOUS,25, 4,WINDOW_WIDTH,true);
	networkQueryWindows["#priActivitiesWindow"] = createWindows("#priActivitiesWindow",WINDOW_HEADER_PRIMARY,122, 4, WINDOW_WIDTH,true);
	networkQueryWindows["#nxtActivitiesWindow"] = createWindows("#nxtActivitiesWindow",WINDOW_HEADER_NEXT,395, 4,WINDOW_WIDTH,true);
	networkQueryWindows["#generalWindow"].data("kendoWindow").minimize();
	
	networkQueryWindows["#preActivitiesWindow"].parent().find(".k-window-titlebar.k-header").append('<a href="#" onclick="addRowsToGrid(\'preActivitiesGrid\');" style="position: absolute;top: 0;right: 5px;color:#3276C8;">Add 3 blank rows</a>');
	networkQueryWindows["#priActivitiesWindow"].parent().find(".k-window-titlebar.k-header").append('<a href="#" onclick="addRowsToGrid(\'priActivitiesGrid\');" style="position: absolute;top: 0;right: 5px;color:#3276C8;">Add 3 blank rows</a>');
	networkQueryWindows["#nxtActivitiesWindow"].parent().find(".k-window-titlebar.k-header").append('<a href="#" onclick="addRowsToGrid(\'nxtActivitiesGrid\');" style="position: absolute;top: 0;right: 5px;color:#3276C8;">Add 3 blank rows</a>');
	
	//initialize the networkfilterOptions	
	$('#networkfilterOptions').panel({
		collapseType: 'slide-right',
	    collapsed: true,
	    trueVerticalText: true,
	    vHeight: '52px',
	    width: '325px'
	});	
}

function addRowsToGrid(gridId) {
	var grid = $(HASH_STRING+gridId).data("kendoGrid");
	grid.dataSource.add(getGridArray());
	grid.dataSource.add(getGridArray());
	grid.dataSource.add(getGridArray());
	scrollToSelectedRow(grid);
}

/**
 * method to initialize Scheduler Windows
 */
function initializeSchedulerWindows() {
	//initialize the networkfilterOptions	
    $('#schedulefilterOptions').panel({
        collapseType: 'slide-right',
        collapsed: true,
        trueVerticalText: true,
        vHeight: '52px',
        width: '360px'
    });
    scheduleQueryWindows["#routeWindow"] = createWindows("#routeWindow",WINDOW_HEADER_ROUTES,65, 5,WINDOW_WIDTH);//,810, 10);
    scheduleQueryWindows["#orgDestiWindow"] = createWindows("#orgDestiWindow",WINDOW_HEADER_ORG_AND_DEST,160, 4,WINDOW_WIDTH);
    scheduleQueryWindows["#depArrActTimeWindow"] = createWindows("#depArrActTimeWindow",WINDOW_HEADER_DEPT_ARR_ACT,300, 4,WINDOW_WIDTH);
    scheduleQueryWindows["#typesWindow"] = createWindows("#typesWindow",WINDOW_HEADER_TYPES,363, 4,WINDOW_WIDTH);
    scheduleQueryWindows["#modeWindow"] = createWindows("#modeWindow",WINDOW_HEADER_MODE,555, 4,WINDOW_WIDTH);
	
    createKendoDropDown('operatorCmb');
	var departsComboBox=createKendoComboBox('departsCmb',PLACEHOLDER_SELECT,FILTER_TYPE_STARTS_WITH,getDeptAndArrivalsTypes());
	appendKeyupDown('departsCmb',"betweenTime");
	departsComboBox.bind("change", function(e) {//fix 169
		$("#betweenTime").focus();
	});
	$("#departsCmb").data("kendoComboBox").select(0);
}

/**
 * method to create kendoDropDownList
 * @param id
 */
function createKendoDropDown (id) {
	$("#"+id).kendoDropDownList({
	    dataSource: getOprationTypes(),
        index: 0
	});
}

/**
 * method to assign the checkbox state to the selected checkbox 
 * @param checkboxObj
 * @param itemId
 */
function selectDefaultDisplayOption(checkboxObj, itemId){
	$(itemId)[0].checked=checkboxObj.checked;
}

/**
 * method to show/hide the controls as per the checkbox status 
 * @param checkboxObj
 * @param itemId
 * @param itemType
 */
function showHideWindowItems(checkboxObj, itemId,itemId2) {
	if(checkboxObj.checked) {
		$(HASH_STRING+itemId+CONSTANTS_DIV).show();
		if(itemId2 != null) {
			$(HASH_STRING+itemId2+CONSTANTS_DIV).show();
		}
	}else {
		$(HASH_STRING+itemId+CONSTANTS_DIV).hide();
		if(itemId2 != null) {
			$(HASH_STRING+itemId2+CONSTANTS_DIV).hide();
		}
	}
}

/**
 * method to show/hide the network/schedule window's. 
 * @param checkboxObj
 * @param windowId
 * @param isApplicationLevel
 * @param isResetDashboard
 * @param isExpanded
 */
function showHideWindow(checkboxObj, windowId, isApplicationLevel, isResetDashboard, isExpanded) {
	var window=$(HASH_STRING+windowId).data("kendoWindow");
	if(checkboxObj.checked) {
		window.open();
		if(isApplicationLevel == undefined || !isApplicationLevel){
			updateSettingsExpandCheckBox(windowId, isExpanded);
		}
		if(isResetDashboard && isResetDashboard != undefined){
			updateSettingsExpandCheckBox(windowId, true);
		}
	}else {
		window.close();
	}
}

/**
 * method to min/max the kendoWindow
 * @param checkboxObj
 * @param windowId
 */
function minMaxWindow(checkboxObj, windowId) {
	var window=$(HASH_STRING+windowId).data("kendoWindow");
	if(checkboxObj.checked) {
		window.restore();
		window.toFront();
	}else {
		window.minimize();
		attachMaxMinEvent($(HASH_STRING+windowId),".k-i-restore",false,true,true);
	}
}

/**
 * method to get the kendoGrid data into JSON format. 
 * @param grid_Id
 * @returns {jsonData}
 */
function getGridDataInJson(grid_Id){
	var jsonData;
	var grid = $(HASH_STRING+grid_Id).data("kendoGrid");
	var gridDataSource = grid.dataSource;
	if(gridDataSource != undefined) {
		jsonData = gridDataSource.data().toJSON();
	}
	return jsonData;
}

/**
 * method to get only selected data toJSON()
 * @param grid_Id
 * @returns {Array}
 */
function getSelectedGridDataInJson(grid_Id){
	var grid = $(HASH_STRING+grid_Id).data("kendoGrid");
	
	var gridTable = grid.table[0];
	var selectedRows = [];
	var selectedRowsData = [];
	for(var i=0,row; row=gridTable.rows[i];i++){
		if(row.cells[0].childNodes[0].checked){
			selectedRows.push(row);
		 }
	}
	for (var i=0; i<selectedRows.length; i++) {
		var rowIndex = selectedRows[i].sectionRowIndex;
		selectedRowsData.push(grid.dataSource.data()[rowIndex].toJSON());
	}
		
	return selectedRowsData;
}

/**
 * method to execute the query 
 * @param isClone
 */
function runQuery(isClone,qbtn){
	if($(qbtn)[0] != undefined){
		$(qbtn).toggleClass('#runQryBtn:active');
	}else{
		$('#runQryBtn').toggleClass('#runQryBtn:active');
	}
	showFilterErrorMsg(EMPTY_STRING);
	var networkWinsMap = [];
	var schedulerWinsMap = [];
	
	if(isNetworkTab){
		networkWinsMap = runNetworkQuery();
		if (!validateNetworkQueryInput(networkWinsMap)) {
			return;
		}
	} else {
		schedulerWinsMap = runScheduleQuery();
	}
	
	if(isClone == undefined || !isClone){
		parent.VIEWER.onBeforeRunQuery();		
	}
	//to enable the sync btn's on all windows
	parent.enableSync(null, null,EMPTY_STRING+parent.DASHBOARD_ID_MAP_VIEW+COMMA_STRING+parent.DASHBOARD_ID_SCHEMATIC_VIEW+COMMA_STRING+parent.DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX+COMMA_STRING+parent.DASHBOARD_ID_NETWORK_MATRIX+COMMA_STRING+parent.DASHBOARD_ID_SCHEDULE_MATRIX+COMMA_STRING+parent.DASHBOARD_ID_ALLOCATION_MATRIX+COMMA_STRING+parent.DASHBOARD_ID_VOLUME_UTILIZATION_MATRIX+COMMA_STRING+parent.DASHBOARD_ID_NETWORK_SUMMARY_MATRIX+EMPTY_STRING, null,true,true);
	
	callNetworkOrScheduleService(networkWinsMap, schedulerWinsMap);
}

function addTooltips(tooltipMap){
	if(tooltipMap != undefined){
		var keys = Object.keys(tooltipMap);
		if(keys != undefined){
			for(var i=0; i<keys.length; i++){
				applyTooltip(keys[i], tooltipMap[keys[i]]);
			}
		}
	}
} 

function clearTooltips(){
	clearScheduleTooltip();
	clearNetworkTooltip();
}

function clearScheduleTooltip(){
	setTooltip("orignDestWinOrigin", "");
	setTooltip("orignDestWinDest", "");	
	setTooltip("legType", "");	
	setTooltip("equipmentType", "");	
}

function clearNetworkTooltip(){
	setTooltip("productsTextArea", "");
	setTooltip("productGroupsTextArea", "");
}

function applyTooltip(key, value){
	if(key != undefined){
		switch(key){
		case "Origins":
			setTooltip("orignDestWinOrigin", value);			
			break;
		case "Destinations":
			setTooltip("orignDestWinDest", value);			
			break;
		case "Equipment":
			setTooltip("equipmentType", value);			
			break;
		case "Leg":
			setTooltip("legType", value);
			break;
		case "Product":
			setTooltip("productsTextArea", value);
			break;
		case "Product Groups":
			setTooltip("productGroupsTextArea", value);	
			break;	
		}
	}	
}

function setTooltip(id, content){
	$("#"+id).attr("title", content.replace(/<BR>/g, "\x0A"));	
}

/**
 * method to validate the network query 
 * @returns {Boolean}
 */
function validateNetworkQueryInput(networkWinsMap){
	var primaryFilled = (networkWinsMap["priActivityGridData"].length > 0);
	var previousFilled = (networkWinsMap["preActivityGridData"].length > 0);
	var nextFilled = (networkWinsMap["nxtActivityGridData"].length > 0);
	if (isFullRoutingQuery) {
    	var errorMessage = "";
    	var facilitesAllowed = 1;
    	var primaryMandatory = false;
    	var facilityCount = 0;
    	var routingTypes = networkWinsMap["routingTypesData"];
    	if (routingTypes.routingNotHAR) {
    		primaryMandatory = true;
    	} else {
        	if (routingTypes.routingSingleSort || routingTypes.notNextMultiSort || routingTypes.routingCustomSort) {
        		primaryMandatory = true;
        		facilitesAllowed = 0;
        	} else if (routingTypes.routingHAR || routingTypes.routingPTP)  {
        		primaryMandatory = false;
    		} else {
    			parent.showFilterErrorMsg("For Full Routing at least one routing type must be selected");
        		return false;
    		}
    	}
    	if (primaryFilled) {
    		var primaryActivities = networkWinsMap["priActivityGridData"];
        	for (var index = 0; index < primaryActivities.length; index++) {
        		var primaryActivity = primaryActivities[index];
        		if (primaryActivity) {
        			var locStr = primaryActivity.Location;
        	    	var locationType = primaryActivity.facilityType;
        	        var activity = primaryActivity.Activity;
        	        var day = primaryActivity.Day;
        			if (locStr) {
        				if (locationType == 'FacGrp') {
        					facilityCount++;
        				}
        				if (!activity) {
        					errorMessage = "Primary activity code cannot be blank for full routing queries.";
        				}
        			} else {
    					errorMessage = "Location information is required. Primary activity code cannot be blank for full routing queries.";
        			}
        			if (!errorMessage && !day ) {
        				errorMessage = "Primary day(s) cannot be blank for full routing queries.";
        			}else if(day){
        				var totalDays = ActivityUtils.getSelectedDays(day).length;
        				if(totalDays > 7){
        					errorMessage = "More than 7 days are not allowed in case of Primary day(s) for full rtg queries.";
        				}
        			}
        			if (errorMessage) {
                		parent.showFilterErrorMsg(errorMessage);
                		return false;
        			}
        		}
        	}
    	}
    	if (!primaryFilled) {
    		if (previousFilled || nextFilled) {
    			errorMessage = "For Full Routing if previous and/or next activity is entered, then primary activity must be entered";
    		} else if (primaryMandatory) {
				errorMessage = "Only Hold-At-Ramp or Point-To-Point routing types are allowed when Previous/Primary/Next activities are empty.";
    		}
    	} else if (!previousFilled && !nextFilled) {
			errorMessage = "Previous or next activity info is required for full rtg queries.";
    	}
    	if (!errorMessage && facilityCount > facilitesAllowed) {
    		if (facilitesAllowed == 0) {
				errorMessage = "For Full Routing (Single sort, Multisort and Custom Sort) facility groups are not allowed in Primary activity";
    		} else {
				errorMessage = "Only one facility group is allowed in primary activities for full routing queries with selected routing types.";
    		}
    	}
    	if (errorMessage.length > 0) {
    		parent.showFilterErrorMsg(errorMessage);
    		return false;
    	}
	} else if ((previousFilled || nextFilled) && !primaryFilled) {
    	parent.showFilterErrorMsg("For Lane Level if previous and/or next activity is entered, then primary activity must be entered");
		return false;
    }
    return true;
}

function getGridRowDataPerActivity(tempData) {
	if(tempData && tempData.Activity) {
		var acts = tempData.Activity.split(",");
		var array = [];
		var obj = {};
		for(var i=0; i<acts.length; i++) {
			obj = jQuery.extend(true, {}, tempData);
			obj.Activity = acts[i];
			array.push(obj);
		}
		return array;
	}
}

/**
 * method to execute the network query 
 * @returns {Array}
 */
function runNetworkQuery(){
	var networkWinsMap = [];
	parent.resetAllDashboardsNetworkDataStatus();
	//network grid details
	networkWinsMap["queryTypeCmb"]=$("#queryTypeCmb").data("kendoComboBox").value();
	//flag that is used to indicate whether its an full routing or lane level query
	if(networkWinsMap["queryTypeCmb"] == "L"){
		isFullRoutingQuery = false;
		parent.openDashboard(parent.DASHBOARD_ID_NETWORK_SUMMARY_MATRIX);
	}else {
		parent.openDashboard(parent.parent.DASHBOARD_ID_NETWORK_MATRIX);
		isFullRoutingQuery = true;
	}
	networkWinsMap["connectivityCmbData"] = $("#connectivityCmb").data("kendoComboBox").value() == "-1" ? "" : $("#connectivityCmb").data("kendoComboBox").value();
	networkWinsMap["capacityTypeCmbData"] = $("#capacityTypeCmb").data("kendoComboBox").value();
	var previousGrid = $("#preActivitiesGrid").data("kendoGrid");
	var previousTable = previousGrid.table[0];
	var preSelectedRows = [];
	var preSelectedRowsData = [];
	for(var i=0,row; row=previousTable.rows[i];i++){
		if(row.cells[0].childNodes[0].checked){
			preSelectedRows.push(row);
		 }
	}
	var rowIndex;
	var tempData;
	var array;
	for (var i=0; i<preSelectedRows.length; i++) {
		rowIndex=-1;
		rowIndex = preSelectedRows[i].sectionRowIndex;
		tempData = previousGrid.dataSource.data()[rowIndex].toJSON();
		tempData.facilityType = getFacilityTypeForQuery(tempData.facilityType);
		if(tempData.facilityType =="Rgn"){
			tempData.Location = getSelectedRegionId(tempData.Location);
		}
		if(tempData != null && tempData.Transits != null){
			tempData.Transits = (tempData.Transits).replace(/\s{1,}/g, ',');
		}
		array = getGridRowDataPerActivity(tempData);
		if(array && array.length > 0) {
			$.merge(preSelectedRowsData, array);
		}else {
			preSelectedRowsData.push(tempData);
		}
		
	}
	var primaryGrid = $("#priActivitiesGrid").data("kendoGrid");
	var primaryTable = primaryGrid.table[0];
	var priSelectedRows = [];
	var priSelectedRowsData = [];
	for(var i=0,row; row=primaryTable.rows[i];i++){
		if(row.cells[0].childNodes[0].checked){
			priSelectedRows.push(row);
		 }
	}
	for (var i=0; i<priSelectedRows.length; i++) {
		var rowIndex = priSelectedRows[i].sectionRowIndex;
		tempData = primaryGrid.dataSource.data()[rowIndex].toJSON();
		tempData.facilityType = getFacilityTypeForQuery(tempData.facilityType);
		if(tempData.facilityType =="Rgn"){
			tempData.Location = getSelectedRegionId(tempData.Location);
		}
		if(tempData != null && tempData.Day != null){
			tempData.Day = (tempData.Day).replace(/\s{1,}/g, ',');
		}
		array = getGridRowDataPerActivity(tempData);
		if(array && array.length > 0) {
			$.merge(priSelectedRowsData, array);
		}else {
			priSelectedRowsData.push(tempData);
		}
	}
	var nextGrid = $("#nxtActivitiesGrid").data("kendoGrid");
	var nextTable = nextGrid.table[0];
	var nxtSelectedRows = [];
	var nxtSelectedRowsData = [];
	for(var i=0,row; row=nextTable.rows[i];i++){
		if(row.cells[0].childNodes[0].checked){
			nxtSelectedRows.push(row);
		 }
	}
	for (var i=0; i<nxtSelectedRows.length; i++) {
		rowIndex=-1;
		rowIndex = nxtSelectedRows[i].sectionRowIndex;
		tempData=nextGrid.dataSource.data()[rowIndex].toJSON();
		tempData.facilityType = getFacilityTypeForQuery(tempData.facilityType);
		if(tempData.facilityType =="Rgn"){
			tempData.Location = getSelectedRegionId(tempData.Location);
		}
		if(tempData.Transits != undefined){
			tempData.Transits = (tempData.Transits).replace(/\s{1,}/g, ',');
		}
		array = getGridRowDataPerActivity(tempData);
		if(array && array.length > 0) {
			$.merge(nxtSelectedRowsData, array);
		}else {
			nxtSelectedRowsData.push(tempData);
		}
	}
	networkWinsMap["preActivityGridData"] = preSelectedRowsData;
	networkWinsMap["priActivityGridData"] = priSelectedRowsData;
	networkWinsMap["priActivityP"] = $("#productsTextArea").val();
	networkWinsMap["priActivityGP"] = $("#productGroupsTextArea").val();
	networkWinsMap["previousDirectChkVal"]= $('#previousDirectChk').is(":checked");
	networkWinsMap["nextDirectChkVal"]= $('#nextDirectChk').is(":checked");
	networkWinsMap["routingTypesData"] = {
			"routingNotHAR":$('#routingNotHAR').is(":checked"),
			"routingSingleSort": $('#routingSingleSort').is(":checked"),
			"routingHAR": $('#routingHAR').is(":checked"),
			"notNextMultiSort": $('#notNextMultiSort').is(":checked"),
			"routingPTP": $('#routingPTP').is(":checked"),
			"routingCustomSort": $('#routingCustomSort').is(":checked")
	};
	networkWinsMap["nxtActivityGridData"] = nxtSelectedRowsData;
	networkWinsMap["preFacCode"] = getSelectedFacilityType("preActivitiesGrid");
	networkWinsMap["priFacCode"] = getSelectedFacilityType("priActivitiesGrid");
	networkWinsMap["nxtFacCode"] = getSelectedFacilityType("nxtActivitiesGrid");

	return networkWinsMap;
}

/**
 * method to execute the schedule query 
 * @returns {Array}
 */
function runScheduleQuery(){
	var schedulerWinsMap = [];
	parent.resetAllDashboardsScheduleDataStatus();
	parent.openDashboard(parent.DASHBOARD_ID_SCHEDULE_MATRIX);
	//Scheduler Filter window
	var showResultsDiv = $("#showByRoute").is(":checked") == true ? "byRoute":"byLeg";
	
	var enterRouteWin = ($("#enterRoute").val()).replace(/\s{1,}/g, ',');

	var origins = $("#orignDestWinOrigin").val();
	var destination = $("#orignDestWinDest").val();
	var operator = $("#operatorCmb")[0].value;
	var orgNDesParing = {};
	orgNDesParing["isPaired"] = $("#isPaired").is(":checked");
	orgNDesParing["isDirect"] = $("#isDirect").is(":checked");
	orgNDesParing["isByAirport"] = $("#isByAirport").is(":checked");
	
	var depArrTimeWin = {};
	depArrTimeWin["type"] = $("#departsCmb").data("kendoComboBox").value();
	depArrTimeWin["betweenTime"] = $("#betweenTime").val().replace("hhmm",EMPTY_STRING);
	depArrTimeWin["andTime"] = $("#andTime").val().replace("hhmm",EMPTY_STRING);
	depArrTimeWin["onDays"] = ($("#onDays").val()).replace(/\s{1,}/g, ',');
	
	var typesWin = {};
	typesWin["laneHaul"]= $("#laneHaulChk").is(":checked");
	typesWin["shuttle"]=$("#stuttleChk").is(":checked");
	typesWin["fx"]=$("#fxChk").is(":checked");
	typesWin["contract"]=$("#contractChk").is(":checked");
	typesWin["others"]=$("#othersChk").is(":checked");
	typesWin["equipment"] =  $("#equipmentType").val();
	typesWin["leg"] = $("#legType").val();
	
	var modesWin = {};
	modesWin["flightTrunk"] = $("#flightTrunk").is(":checked");
	modesWin["truckStandard"] = $("#truckStandard").is(":checked");
	modesWin["railOversize"] = $("#railOversize").is(":checked");
	modesWin["shipOversize"] = $("#shipOversize").is(":checked");
	modesWin["flightFeeder"] = $("#flightFeeder").is(":checked");
	modesWin["truckOversize"] = $("#truckOversize").is(":checked");
	//modesWin["flightOversizeObc"] = $("#flightOversizeObc").is(":checked");
	
	var schedulerWinsMap = {};
	schedulerWinsMap["showResultsDiv"] = showResultsDiv;
	schedulerWinsMap["enterRouteWin"] = enterRouteWin;
	schedulerWinsMap["origins"] = origins;
	schedulerWinsMap["operator"] = operator;
	schedulerWinsMap["destination"] = destination;
	schedulerWinsMap["orgNDesParing"] = orgNDesParing;
	schedulerWinsMap["depArrTimeWin"] = depArrTimeWin;
	schedulerWinsMap["typesWin"] = typesWin;
	schedulerWinsMap["modesWin"] = modesWin;
	
	return schedulerWinsMap;
}

/**
 * method to indicate whether its an Full routing or lane level
 * @returns {Boolean}
 */
function isFullRouting(){
	return isFullRoutingQuery;
}
/**
 * method to call network/schedule webservice. 
 * @param networkWinsMap
 * @param schedulerWinsMap
 */
function callNetworkOrScheduleService(networkWinsMap, schedulerWinsMap) {
	var serviceUrl;
	var paramsMap;
	var successCallBackFn;
	
	if(isNetworkTab && networkWinsMap != null) {
		clearNetworkTooltip();
		// Network Filter Variables
		var pathType = networkWinsMap["queryTypeCmb"];
		var connectivityCmbDataText = networkWinsMap["connectivityCmbData"];
		var capacityCmbDataText = networkWinsMap["capacityTypeCmbData"];
		var preActivityText = JSON.stringify(networkWinsMap["preActivityGridData"], replacer);
		var priActivityText = JSON.stringify(networkWinsMap["priActivityGridData"], replacer);
		var priProductText = networkWinsMap["priActivityP"];
		var priProductGpText = networkWinsMap["priActivityGP"];
		var previousDirectChkValText = JSON.stringify(networkWinsMap["previousDirectChkVal"], replacer);
		var nextDirectChkValText = JSON.stringify(networkWinsMap["nextDirectChkVal"], replacer);
		var routingTypesCmbDataText = JSON.stringify(networkWinsMap["routingTypesData"], replacer);
		var nxtActivityText = JSON.stringify(networkWinsMap["nxtActivityGridData"], replacer);
		var preFacCodeText = networkWinsMap["preFacCode"];
		var priFacCodeText = networkWinsMap["priFacCode"];
		var nxtFacCodeText = networkWinsMap["nxtFacCode"];
		
		serviceUrl = SERVICE_DATA_URL+"NetworkRequest";
		
		paramsMap = {
			"browserSessionId":parent.getBrowserSessionId(),
			"commonCaseId":parent.getCommonCaseId(),
			"effDayPatternStr": parent.getSelectedEffDayStrPattern(),
			"planWeek":parent.getSelectedPlanWeek(),
			"effDayPatternStr": parent.getSelectedEffDayStrPattern(),
			"connectivityCmbData":connectivityCmbDataText,
			"capacityCmbData":capacityCmbDataText,
			"pathType":pathType,
			"preActivitystr":preActivityText,
			"priActivitystr":priActivityText,
			"priProductstr":priProductText,
			"priProductGpstr":priProductGpText,
			"previousDirectChkValstr":previousDirectChkValText,
			"nextDirectChkValstr":nextDirectChkValText,
			"routingTypesCmbDatastr":routingTypesCmbDataText,
			"nxtActivitystr":nxtActivityText,
			"preFacCodestr":preFacCodeText,
			"priFacCodestr":priFacCodeText,
			"nxtFacCodestr":nxtFacCodeText,
			"localZuluFlag":getLocalZuluFlag(),
			"isAddToResults":getIsAddToResults(),
			"dataType":parent.DATA_TYPE_NETWORK
		};
		
		successCallBackFn = onNetworkQuerySuccess;
		
	} else if(schedulerWinsMap != null) {
		clearScheduleTooltip();
		// Schedule Filter Variables
		var showResultsDivText = schedulerWinsMap["showResultsDiv"];
		
		var enterRouteWinText = JSON.stringify(schedulerWinsMap["enterRouteWin"], replacer);
		
		var originsText = schedulerWinsMap["origins"];
		var operatorText = schedulerWinsMap["operator"];
		var destinationText = schedulerWinsMap["destination"];
		var orgNDesParingText = JSON.stringify(schedulerWinsMap["orgNDesParing"], replacer);
		
		var depArrTimeWinText = JSON.stringify(schedulerWinsMap["depArrTimeWin"], replacer);
		var typesWinText = JSON.stringify(schedulerWinsMap["typesWin"], replacer);
		var modesWinText = JSON.stringify(schedulerWinsMap["modesWin"], replacer);
		var isShowDeletedRoutes = $("#showDeletedChk").is(":checked");
		
		serviceUrl = SERVICE_DATA_URL+"ScheduleRequest";

		paramsMap ={
				"browserSessionId":parent.getBrowserSessionId(),
				"commonCaseId":parent.getCommonCaseId(),
				"effDayPatternStr": parent.getSelectedEffDayStrPattern(),
				"scheduleId":parent.getScheduleId(),
				"planWeek":parent.getSelectedPlanWeek(),
				"effDayPatternStr": parent.getSelectedEffDayStrPattern(),
				"showResultsDivstr":showResultsDivText,
				"enterRouteWinstr":enterRouteWinText,
				"originsstr":originsText,
				"operatorstr":operatorText,
				"destinationstr":destinationText,
				"orgNDesParingstr":orgNDesParingText,
				"depArrTimeWinstr":depArrTimeWinText,
				"typesWinstr":typesWinText,
				"modesWinstr":modesWinText,
				"localZuluFlag":getLocalZuluFlag(),
				"isAddToResults":getIsAddToResults(),
				"isShowDeletedRoutes":isShowDeletedRoutes,
				"dataType":parent.DATA_TYPE_SCHEDULE
			};
		
		successCallBackFn = onScheduleQuerySuccess;
	}	
	
	if(paramsMap) {
		parent.showProgressDialog(true, PROGRESS_DIALOG_MESSAGE_RUN_QUERY);
		callService({
			url : serviceUrl,
			paramsMap: paramsMap,
			successCallback : function(response, io){
				successCallBackFn(response, io);		
				addTooltips(response.tooltipMap);
			}, 
			failureCallback : onServiceRequestFailure,
			showProgressWindow : false
		});		
	}
}

/**
 * failure responce handler
 * @param response
 * @param io
 */
function onServiceRequestFailure(response, io) {
	parent.onServiceRequestFailure(response, io);
}

/**
 * success responce handler for NetworkQuery 
 * @param response
 * @param io
 */
function onNetworkQuerySuccess(response, io) {
	parent.showProgressDialog(false);
	parent.resetAllDashboardsNetworkDataStatus(false);
	parent.setDashboardDataStatus(parent.DASHBOARD_ID_QUERY, parent.DATA_TYPE_NETWORK, true);
	
	if(response && response._errorCd && response._errorCd > 0) {
    	parent.showFilterErrorMsg(response._errorDesc);    	
    } else {
    	loadScheduleForNetwork();
    	parent.VIEWER.onNetworkQuerySuccess();
    }   
 }

 /**
  *method to call webservice for ScheduleLegById  
  */
 function loadScheduleForNetwork() {
 	var serviceUrl = SERVICE_DATA_URL+"ScheduleLegByIdRequest";
		
 	var paramsMap = {
 			"browserSessionId":parent.getBrowserSessionId(),
			"commonCaseId":parent.getCommonCaseId(),
			"effDayPatternStr": parent.getSelectedEffDayStrPattern(),
			"scheduleId":parent.getScheduleId(),
			"planWeek":parent.getSelectedPlanWeek(),
			"effDayPatternStr": parent.getSelectedEffDayStrPattern(),
			"localZuluFlag":getLocalZuluFlag(),
			"isAddToResults":getIsAddToResults(),
			"dataType":parent.DATA_TYPE_NETWORK_SCHEDULE
 	};

	callService({
			url : serviceUrl,
			paramsMap: paramsMap,
			successCallback : onLoadScheduleForNetworkSuccess, 
			showProgressWindow : false
	}); 	
 }
 
 /**
  * success responce handler for ScheduleLegById request. 
  * @param response
  * @param io
  */
 function onLoadScheduleForNetworkSuccess(response, io) { 	
 	if(response && response._errorCd && response._errorCd > 0) {
    	parent.showFilterErrorMsg(response._errorDesc);    	
    } else {
    	parent.VIEWER.onNetworkScheduleQuerySuccess();
    }
 }
 
/**
 * success responce handler for ScheduleQuery
 * @param response
 * @param io
 */
function onScheduleQuerySuccess(response, io) {
	parent.showProgressDialog(false);
	parent.resetAllDashboardsScheduleDataStatus(false);
	parent.setDashboardDataStatus(parent.DASHBOARD_ID_QUERY, parent.DATA_TYPE_NETWORK_SCHEDULE, true);
	if(response && response._errorCd && response._errorCd > 0) {
    	parent.showFilterErrorMsg(response._errorDesc);    	
    } else {
    	parent.VIEWER.onScheduleQuerySuccess();
    	parent.isByRouteQuery = $("#showByRoute").is(":checked") == true ? true : false;
    }
 }
 
/**
 * method to show the error.
 * @param msg
 */ 
function showFilterErrorMsg(msg) {
	parent.showErrorMsg(msg);
}

/**
 * method to check/unCheck the Routing types
 * @param isChecked
 */
function chkUnchkRoutingType(isChecked) {
	document.getElementById("routingSingleSort").checked = isChecked;
	document.getElementById("routingHAR").checked = isChecked;
	document.getElementById("notNextMultiSort").checked = isChecked;
	document.getElementById("routingPTP").checked = isChecked;
	document.getElementById("routingCustomSort").checked = isChecked;
}
/**
 * method to enable/disable the Routing types
 * @param dataValue
 */
function enableDisableRoutingType(dataValue) {
	if(dataValue == "L"){
		disableRoutingTypes(true);
		$("#routingHAR").removeAttr("disabled");
	    setRoutingTypes(false, false);
    }else if(dataValue == "F"){
    	$("#routingNotHAR").removeAttr("disabled");
    	enableRoutingTypes();
    	setRoutingTypes(true, true);
    }
}


function setRoutingTypes(isEnable, isFullRouting, isnotHARChangeEvent){
	if(!isnotHARChangeEvent){
		$("#routingNotHAR")[0].checked = (!isEnable && isFullRouting);	
	}	
	$("#routingHAR")[0].checked = (isEnable && isFullRouting);	
    $("#routingPTP")[0].checked = isEnable;
    $("#routingSingleSort")[0].checked = isEnable;
    $("#notNextMultiSort")[0].checked = isEnable;
    $("#routingCustomSort")[0].checked = isEnable;
}


function notHARChangeHandler(){
	if($("#routingNotHAR")[0].checked){
		setRoutingTypes(false, true, true);
		disableRoutingTypes();
	}else {
		enableRoutingTypes();
    	setRoutingTypes(true, true, true);
	}
}

function enableRoutingTypes(){
	$("#routingHAR").removeAttr("disabled");
	$("#routingPTP").removeAttr("disabled");
	$("#routingSingleSort").removeAttr("disabled");
	$("#notNextMultiSort").removeAttr("disabled");
	$("#routingCustomSort").removeAttr("disabled");
}

function disableRoutingTypes(isComboSelection){
	if(isComboSelection){
		$("#routingNotHAR").attr("disabled", true);
	}
	$("#routingHAR").attr("disabled", true);
    $("#routingPTP").attr("disabled", true);
    $("#routingSingleSort").attr("disabled", true);
    $("#notNextMultiSort").attr("disabled", true);
    $("#routingCustomSort").attr("disabled", true);
}

/**
 * method to validate Routing Type
 * @returns {Boolean} return true if all selected else false
 */
function validateRoutingType() {
	if(!document.getElementById("routingSingleSort").checked) {
		return false;
	}else if(!document.getElementById("routingHAR").checked) {
		return false;
	}else if(!document.getElementById("notNextMultiSort").checked) {
		return false;
	}else if(!document.getElementById("routingPTP").checked) {
		return false;
	}else if(!document.getElementById("routingCustomSort").checked) {
		return false;
	}else {
		return true;
	}
}

/**
 * method to select all option for RoutingType
 * @param checkBox
 * @param type
 */
function selectRoutingType(checkBox, type) {
	if(type == 'all'){
		chkUnchkRoutingType(checkBox.checked);
	}else {
		if(!checkBox.checked){
			document.getElementById("routingNotHAR").checked = false;
		}else if(validateRoutingType()){
			document.getElementById("routingNotHAR").checked = true;
		}
	}
}

function initializeQueryWindowMasterData() {
}

/**
 * method to clear the data in KendoGrid
 * @param gridId
 * @param dataSource
 */
function clearKendoGrid(gridId, dataSource) {
	var grid = $(HASH_STRING+gridId).data("kendoGrid");
	grid.dataSource.data(dataSource);
    grid.refresh();
}

/**
 * method to get comma separated locations 
 */
function getPrimaryLocations(){
	return getNetworkLocations("priActivitiesGrid").toString();
}

function getNetworkLocations(gridId){
	var priLocations=[] ;
	if(gridId != undefined){
		var primaryGridData = getGridDataInJson(gridId);
		if(primaryGridData ){
			for(var i=0; i< primaryGridData.length; i++){
				if(!isNull(primaryGridData[i].Location)){
					priLocations.push(primaryGridData[i].Location);
				}
			}
		}
	}	
	
	return priLocations;
}

function getAllNetworkLocations(){
	var allLocations=[];
	$.each(["preActivitiesGrid", "priActivitiesGrid", "nxtActivitiesGrid"], function(key, value) {
		$.merge( allLocations, getNetworkLocations(value) );
    });
	
	return allLocations;
}

/**
 * method to show the calender for DepArrActTime
 * @param calBtn
 */
function onDepArrActTimeCalenderClick(calBtn){
	var selDays;
	if(selDays == "" || selDays == null){
		selDays = ($("#onDays")[0].value).replace(/\s{1,}/g, ',');
	}
	var disableZero = getLocalZuluFlag() == "L" ? true : false;
	showDayControl(false,selDays,calBtn, false, null, true, null, null, null, disableZero);
}

/**
 * method to validate if string is not null and not empty 
 * @param str
 * @returns {Boolean}
 */
function isNull(str){
	if(!str || (str == EMPTY_STRING) || (str == null)){
		return true;
	}
	return false;
}

/**
 * method to get QueryDataSources 
 * @returns {queryDatasources}
 */
function getQueryDatasources(){
	return queryDatasources;
}

/**
 * method to get window Layout Details for query window
 * @returns {windowLayoutDetails}
 */
function getQryWindowLayoutDetails(){
	var windowLayoutDetails = {};
	windowLayoutDetails["isNetworkTabActive"] =  isNetworkTab;
	windowLayoutDetails["Network"] = getQueryWindowMapDetails(networkQueryWindows);
	windowLayoutDetails["Schedule"] = getQueryWindowMapDetails(scheduleQueryWindows);
	return windowLayoutDetails;
}

/**
 * method to ger the query window layout details Map
 * @param queryWinMap
 * @returns {qryWindowLayoutDetails}
 */
function getQueryWindowMapDetails(queryWinMap) {
	var qryWindowLayoutDetails = {};
	var queryWindow;
	var networkWindowKeys = Object.keys(queryWinMap);
	if(networkWindowKeys){
		for(var i=0; i< networkWindowKeys.length; i++){
			queryWindow = queryWinMap[networkWindowKeys[i]];
			qryWindowLayoutDetails[networkWindowKeys[i]] = getQueryWindowDetails(queryWindow);
		}
	}
	return qryWindowLayoutDetails;
}

/**
 * method to ger the query window layout details
 * @param queryWindow
 * @returns {layoutDetails}
 */
function getQueryWindowDetails(queryWindow) {
	var layoutDetails = {};
	layoutDetails.height = queryWindow.data("kendoWindow").wrapper.css("height");
	layoutDetails.width = queryWindow.data("kendoWindow").wrapper.css("width");
	layoutDetails.top = queryWindow.data("kendoWindow").wrapper.css("top");
	layoutDetails.left = queryWindow.data("kendoWindow").wrapper.css("left");
	layoutDetails.isMinimized = queryWindow.isMinimized;
	layoutDetails.isClosed = queryWindow.isClosed;
	layoutDetails.isOpen= queryWindow.isOpen;
	
	return layoutDetails;
}

/**
 * method to reset the Dashboard state
 * @param isClearAll
 */
function resetDashboard(isClearAll){
	if(isClearAll) {	
		resetNetworkQuery(true);
		resetScheduleQueryWindow(true);
		if(parent.isNetworkQuery){
			clearScheduleWindowStates();
		}
	} else {
		if(parent.isNetworkQuery){
			resetNetworkQuery(true);
		} else{
			resetScheduleQueryWindow(true);
		}
	}
	
	parent.$('#toggleQZulu')[0].toggled = true; 
	parent.$('#toggleQuery')[0].toggled = true;
	toggleLZView(parent.$('#toggleQZulu')[0]);
	toggleQueryFlag(parent.$('#toggleQuery')[0]);
}

/**
 * method to clear layout settings of the query window
 * @param layoutSettings
 * @param isNetworkFalse
 */
function clearLayoutSettings(layoutSettings, isNetworkFalse){
	if(isNetworkFalse){
		networkFavoriteComponent.resetFavoriteMenu();
		resetNetworkQuery();
	}else {
		if(scheduleFavoriteComponent  != undefined){
			scheduleFavoriteComponent.resetFavoriteMenu();
		}
		//reset flag to true...
		resetScheduleQueryWindow(true);		
	}
	if(layoutSettings!= undefined){
		var qryWindows = Object.keys(layoutSettings);
		if(qryWindows){			
			var kendoWindow;
			for(var i=0; i<qryWindows.length; i++){
				kendoWindow = $(qryWindows[i]).data("kendoWindow");
				kendoWindow.wrapper.css({
	    			"width": layoutSettings[qryWindows[i]].width,
	    			"top": layoutSettings[qryWindows[i]].top,
	    			"left":	layoutSettings[qryWindows[i]].left			
	    		});
				kendoWindow.wrapper.find(".k-i-restore").trigger("click");
				kendoWindow.restore();
			}
		}
	}
	if(isNetworkFalse){
		clearScheduleWindowStates();
	}
}

/**
 * method to reset the network query state
 * @param isResetDashboard
 */
function resetNetworkQuery(isResetDashboard){
	var TAB_CHK_TRUE;
	var TAB_CHK_FALSE;
	var TAB_COMBO;
	var TAB_MULTISELECT;
	
	TAB_CHK_TRUE=["displayConnectionsChk","productsChk","routingTypeChk","productGroupsChk"];
	TAB_CHK_FALSE=["routingSingleSort","routingHAR","notNextMultiSort","routingPTP","routingCustomSort","routingNotHAR","previousDirectChk","nextDirectChk"];
	parent.updateControl(TAB_CHK_TRUE,true,parent.getDashboardContentWindow(parent.DASHBOARD_ID_QUERY));
	parent.updateControl(TAB_CHK_FALSE,false,parent.getDashboardContentWindow(parent.DASHBOARD_ID_QUERY));
	showHideWindowItems($("#productsChk")[0], 'productId','productId2');
	showHideWindowItems($("#productGroupsChk")[0], 'productGrpsId', 'productGrpsId2');
	showHideWindowItems($("#displayConnectionsChk")[0], 'displayConnections');
	showHideWindowItems($("#routingTypeChk")[0], 'routingTypes');
	enableDisableRoutingType("L");
	$("#queryTypeCmb").data("kendoComboBox").select(0);
    $("#connectivityCmb").data("kendoComboBox").select(0);
    $("#capacityTypeCmb").data("kendoComboBox").select(0);
    $("#productsTextArea").val("");
    $("#productGroupsTextArea").val("");
    addDataToGrid("#priActivitiesGrid",getGridArrayRows(2),true);
	addDataToGrid("#preActivitiesGrid",getGridArrayRows(2),true);
	addDataToGrid("#nxtActivitiesGrid",getGridArrayRows(2),true);
	
	if(isResetDashboard){
		$("#generalWindow").data("kendoWindow").minimize();
		$("#preActivitiesWindow").data("kendoWindow").restore();
		$("#preActivitiesWindow").data("kendoWindow").restore();
		$("#nxtActivitiesWindow").data("kendoWindow").restore();
	}
}

/**
 * method to reset the schedule query state
 * @param isResetDashboard
 */
function resetScheduleQueryWindow(isResetDashboard){
	var TAB_CHK_TRUE;
	var TAB_CHK_FALSE;
	var TAB_RADIO_TRUE;
	var TAB_COMBO;
	var TAB_MULTISELECT;
	
	TAB_CHK_TRUE=["showByRoute","flightFeeder","flightTrunk","truckStandard","truckOversize",'routesOpt','routesExpandOpt','orgNDesOpt','orgNDesExpandOpt','depNArrOpt','depNArrExpandOpt','typeOpt','typeExpandOpt','modeOpt','modeExpandOpt','flightOpt','truckOpt'];
	TAB_CHK_FALSE=["isPaired","isDirect","isByAirport","laneHaulChk","stuttleChk","fxChk","contractChk","othersChk","railOversize","shipOversize",'railOpt','shipOpt'];
	TAB_RADIO_TRUE=["byRoute"];
	TAB_COMBO=["departsCmb"];
	TAB_OPR_COMBO=["operatorCmb"];
	parent.updateControl(TAB_CHK_TRUE,true,parent.getDashboardContentWindow(parent.DASHBOARD_ID_QUERY));
	parent.updateControl(TAB_CHK_FALSE,false,parent.getDashboardContentWindow(parent.DASHBOARD_ID_QUERY));
	parent.updateControl(TAB_RADIO_TRUE,true,parent.getDashboardContentWindow(parent.DASHBOARD_ID_QUERY));
	parent.updatekendoCombo(TAB_COMBO,"kendoComboBox",parent.getDashboardContentWindow(parent.DASHBOARD_ID_QUERY));
	parent.updatekendoCombo(TAB_OPR_COMBO,"kendoDropDownList",parent.getDashboardContentWindow(parent.DASHBOARD_ID_QUERY));
	$("#orignDestWinOrigin").val(EMPTY_STRING);
	$("#orignDestWinDest").val(EMPTY_STRING);
	$('#enterRoute')[0].value = EMPTY_STRING;
    $('#betweenTime')[0].value = EMPTY_STRING;
    $('#andTime')[0].value = EMPTY_STRING;
    $('#onDays')[0].value = EMPTY_STRING;
    $("#equipmentType").val(EMPTY_STRING);
	$("#legType").val(EMPTY_STRING);
    showHideWindow($('#routesOpt')[0], 'routeWindow', null, isResetDashboard);
	validateExpandCheckbox($('#routesOpt')[0], 'routesExpandOpt');
	showHideWindow($('#orgNDesOpt')[0], 'orgDestiWindow', null, isResetDashboard);
	validateExpandCheckbox($('#orgNDesOpt')[0], 'orgNDesExpandOpt');
	showHideWindow($('#depNArrOpt')[0], 'depArrActTimeWindow', null, isResetDashboard);
	validateExpandCheckbox($('#depNArrOpt')[0], 'depNArrExpandOpt');
	showHideWindow($('#typeOpt')[0], 'typesWindow', null, isResetDashboard);
	validateExpandCheckbox($('#typeOpt')[0], 'typeExpandOpt');
	showHideWindow($('#modeOpt')[0], 'modeWindow', null, isResetDashboard);
	validateExpandCheckbox($('#modeOpt')[0], 'modeExpandOpt');
	minMaxWindow($('#routesExpandOpt')[0], 'routeWindow');
	minMaxWindow($('#orgNDesExpandOpt')[0], 'orgDestiWindow');
	minMaxWindow($('#depNArrExpandOpt')[0], 'depArrActTimeWindow');
	minMaxWindow($('#typeExpandOpt')[0], 'typesWindow');
	minMaxWindow($('#modeExpandOpt')[0], 'modeWindow');
	
	validateExpandCheckboxes($('#flightOpt')[0], ['flightTrunk'], true);
	validateExpandCheckboxes($('#railOpt')[0], ['railOversize'], true);
	validateExpandCheckboxes($('#truckOpt')[0], ['truckStandard','truckOversize'], true);
	validateExpandCheckboxes($('#shipOpt')[0], ['shipOversize'], true);
}

/**
 * method to add keyup event for kendoComboBox
 * @param kendoComboBoxEditor
 * @param nextItem
 */
function appendKeyupDown(kendoComboBoxEditor,nextItem){
	$("#"+kendoComboBoxEditor).data("kendoComboBox").input.bind("keyup", function(evt) {
		var evtobj=window.event? event : evt;
		var unicode=evtobj.charCode? evtobj.charCode : evtobj.keyCode;
		var actualkey=String.fromCharCode(unicode);

		var kendoAutoComplete = $("#"+kendoComboBoxEditor).data("kendoComboBox");
		if(actualkey =="\b"){
			return;
		}
		var listChildren;
		setTimeout(function(){
			listChildren = kendoAutoComplete.dataSource._view;
			if(listChildren != null){
				if((listChildren.length  == 1 && !(actualkey == "(" || actualkey == ")" || actualkey == "&")) || actualkey =="%" || actualkey =="Enter"){
					var t1 = setTimeout(function(){
						if(listChildren[0] !=null && actualkey != "%" && actualkey !="Enter"){
							if(listChildren[0].value != null){
								kendoAutoComplete.value(listChildren[0].value);
							}else{
								kendoAutoComplete.value(listChildren[0]);
							}
							$("#"+nextItem).focus();
						}	
						kendoAutoComplete.trigger("change");
						kendoAutoComplete.close();
					}, 100);
				}
			}
		},200);
	});
}

/**
 * method to validate if input text have is now empty and lenght is 4
 * @param event
 * @param nextItem
 */
function validateAndMove(event,nextItem){
	var inputText=$(event.currentTarget).val();
	if(!validateNumberKey(inputText)) { //defect #575
		$(event.currentTarget).val(($(event.currentTarget).val()).substring(0,($(event.currentTarget).val()).length-1));
	}
	setTimeout(function(){
		if(inputText !=null && inputText.toString()!=EMPTY_STRING && (inputText.toString()).length == 4){
			$("#"+nextItem).focus();
		}
	}, 20);
}

/**
 * method to set window layout preferences
 * @param dashboardId
 * @param layoutDetails
 * @param isQueryWindow
 */
function setWindowLayoutPreferences(dashboardId, layoutDetails, isQueryWindow){
	var dashboardWindow;
	if(isQueryWindow){
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
	}
}

/**
 * method to convert the time string to HHMM format 
 * @param timeStr
 * @returns
 */
function convertToHHMM(timeStr){
	var strLength = timeStr.toString().length;
	for(var i=0;i<4-strLength; i++) {
		timeStr = "0" + timeStr;
	}
	return timeStr;
}

/**
 * method to handle the focusout event 
 * @param event
 * @param startId
 * @param targetId
 */
function focusoutHandler(event){
	var value = $(event.currentTarget).val();
	value = convertToHHMM(value);
	$(event.currentTarget).val(value);
	if(!validateTime(event)) {
		parent.showFilterErrorMsg(TIME_LESS_THAN_2359_ERROR);
		$(event.currentTarget).val(EMPTY_STRING);
	}
}

function buildDatasets(key, data){
	if(data != undefined){
		var locations = [];
		switch(key){
		case "#preActivitiesGrid":			
		case "#nxtActivitiesGrid":			
		case "#priActivitiesGrid":
			for(var i=0; i<data.length; i++){
				locations.push({
					Activity: "",
					Day: "",
					Location: data[i],
					Transits: "",
					facilityType: "Location",
					isFilter: true
				});
			}
			addDataToGrid(key,locations,true, true );
			addEmptyActivity(key);
			break;
		case "orignDestWinOrigin":
		case "orignDestWinDest":
			setScheduleInputLocations(key, data);
			break;
		}
	}	
}

function addEmptyActivity(gridId, locations){
	var count = 2 - getKendoGridTotalRecords(gridId) ;
	if(count > 0){
		var kendoGridDatasource = getKendoGridDatasource(gridId);
		if(kendoGridDatasource != undefined){
			for(var i=0; i<count; i++){
				kendoGridDatasource.add({
					Activity: "",
					Day: "",
					Location: "",
					Transits: "",
					facilityType: "Location",
					isFilter: false
				});
			}
		}
	}
}

function setScheduleInputLocations(uniqueId, locations, options){
	if(uniqueId == "showNearBy") {
		uniqueId = options.parentId;
	}
	var textArea = $("#"+uniqueId);
	var value = textArea.val()+" "+formatScheduleLocations(locations,uniqueId,textArea.val());
	textArea.val(value.trim());
	if(uniqueId != undefined && uniqueId == "enterRoute")
		setTruckDescTooltip(uniqueId);
}

function formatScheduleLocations(locations,uniqueId,textVal){
	var locationStr;
	if(locations != undefined){
		if(uniqueId != undefined && uniqueId == "enterRoute"){
			locationStr = (textVal != "" ? ",": "") + locations.join(',');
		}else{
			locationStr = locations.toString();
			locationStr = locationStr.replace(/,/gi, " " );
		}
		return locationStr;
	}
}
function setTruckDescTooltip(){
	setTimeout(function() {
		var flightRoutes = getQueryDatasources()["FlightRoutes"].data();
		var matchingData;
		var firstNbr;
		var lastNbr;
		var locationsArr = ($("#enterRoute").val()).split(",");
		var tooltipStr = "";
		for (var i = 0; i < locationsArr.length; i++) {
			if(locationsArr[i].split("-").length > 1){
				firstNbr = locationsArr[i].split("-")[0];
				lastNbr = locationsArr[i].split("-")[1];
				matchingData = $.grep(flightRoutes, function(obj) {
					return obj["firstNbr"] == firstNbr.trim() && obj["lastNbr"] == lastNbr.trim();
				});
				if(matchingData[0] != undefined && matchingData[0].flightNbrDesc != undefined ){
					tooltipStr = (tooltipStr == "" ? tooltipStr : tooltipStr + ", ")  + matchingData[0].flightNbrDesc;
				}else{
					tooltipStr = (tooltipStr == "" ? tooltipStr : tooltipStr + ", ")  + firstNbr + ((lastNbr == undefined || lastNbr == "" )? lastNbr : "-" + lastNbr);
				}
				
			}else{
				tooltipStr = (tooltipStr == "" ? tooltipStr : tooltipStr + ", ") + locationsArr[i];
			}
		} 
		$("#enterRoute").attr("title", tooltipStr);
	}, 100);
}
function getScheduleInputLocations(uniqueId){
	return $("#"+uniqueId).val();
}

function setNetworkInputLocations(uniqueId, locations, options) {
	if(uniqueId == "productsTextArea" || uniqueId == "productGroupsTextArea") {
		setScheduleInputLocations(uniqueId, locations);
	}else {
		setLocationInGrid(uniqueId, locations, options);
	}
}

function styleChangeHandler(id){
	if(id != undefined){
		var val = $("#"+id).val();
		if(val != undefined && val.length > 0){
			if(!($("#"+id).hasClass("uppercaseText")))
					$("#"+id).addClass("uppercaseText");
		}else {
			$("#"+id).removeClass("uppercaseText");
			$("#"+id).attr("title", "");
		}
	}
}
//FdxFDX-1262 Query Panel: After creating a route, reset all query panel parameters.
// If not, the re-query doesn't show any results if extraneous parameters
// are present
function enterRouteDetails(moveNbrs, existingRtes){
	if(moveNbrs != undefined && moveNbrs.length > 0){
        var newRtes;
        if(existingRtes == undefined){
            newRtes = [];
        }else{
        	newRtes = [existingRtes];
        }

		for(var i=0; i<moveNbrs.length; i++) {
			if(moveNbrs[i] != undefined && newRtes.indexOf(moveNbrs[i].toUpperCase()) < 0) {
				newRtes.push(moveNbrs[i]);
			}
		}
		if(newRtes.length > 0) {
			$("#enterRoute").val( newRtes.toString());
		}
	}	
}

//FdxFDX-1262 Query Panel: After creating a route, reset all query panel parameters.
// If not, the re-query doesn't show any results if extraneous parameters
// are present
function getExistingRouteDtls() {
    return undefined;//$("#enterRoute").val().toUpperCase();
//updated for FDX-1228 WIP: When updates are processed, only successfully saved routes should be re-queried
}

//FdxFDX-1262 Query Panel: After creating a route, reset all query panel parameters.
// If not, the re-query doesn't show any results if extraneous parameters
// are present
function afterSaveHandler(isDelete, moveNbrs){
    tabSelectHandler(parent.DATA_TYPE_SCHEDULE);
    if(!isDelete) {
        //FdxFDX-1262 Query Panel: After creating a route, reset all query panel parameters.
        // If not, the re-query doesn't show any results if extraneous parameters
        // are present
        var enterRouteStr = getExistingRouteDtls();
        resetScheduleQueryWindow(true);
        enterRouteDetails(moveNbrs, enterRouteStr);
    }else if(parent.isNetworkQuery){
        /*resetScheduleQueryWindow(true);
        $("#showDeletedChk").attr("checked", "checked");
        enterRouteDetails(moveNbrs, "");*/
    }
    if(($("#enterRoute").val()).trim() != ""){
        runQuery(true);
    }
}

function initializeInputAndTextareaFocus() {
    var focusedElement;
    $(document).on('focus', 'input', function () {
        if (focusedElement == $(this)) return; //already focused, return so user can now place cursor at specific point in input.
        focusedElement = $(this);
        setTimeout(function () { focusedElement.select(); }, 50); //select all text in any field on focus for easy re-entry. Delay sightly to allow focus to "stick" before selecting.
    });
    var focusedTextAreaElement;
    $(document).on('focus', 'textarea', function () {
        if (focusedTextAreaElement == $(this)) return; //already focused, return so user can now place cursor at specific point in input.
        focusedTextAreaElement = $(this);
        setTimeout(function () { focusedTextAreaElement.select(); }, 50); //select all text in any field on focus for easy re-entry. Delay sightly to allow focus to "stick" before selecting.
    });
}
function toUpperCaseEquipType(e) {
	if (e.which >= 97 && e.which <= 122) {
        var newKey = e.which - 32;
        // I have tried setting those
        e.keyCode = newKey;
        e.charCode = newKey;
    }

    $("#equipmentType").val(($("#equipmentType").val()).toUpperCase());
}