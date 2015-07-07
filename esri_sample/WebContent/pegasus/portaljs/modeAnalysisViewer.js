/**
 * @author 927456 Honey Bansal
 * This script belongs to Map/Application Mode Analysis Dashboard.
 * Included in modeAnalysis.jsp
 */

//map contains the array of activities specific to location with loc as key
var activitiesMapByLoc;
//map contains the activities details with loc_act as key
var activitiesDetailMap;
//instance of ganttChartDiagram class
var ganttChartDiagram;
//for start position of slider box below the slider
var startClientX;
//time difference between mini avail time and max due time
var timeDiffInMilliSecs;
//current mode for origin/destination to include
//origin if user adding locs on origin side or destination if adding on destination side
var currentMode;
//list of location for the selected country(origin/destination to include)
var locationsMap = [];
//for activity start and end time saved in favorites 
var favStartTime, favEndTime;
//flag for local or zulu time
var isZulu = false;
//flag for whether to show alert when applying origin to include if any change then true otherwise false 
var showOriginAlert = false;
//flag for whether to show alert when applying destination to include if any change then true otherwise false
var showDestinationAlert = false;
//mapModeAnalysisViewDiv if launched from map or modeAnalysisViewDiv if launched from application 
var viewerDashboardId = parent.DASHBOARD_ID_MODE_ANALYSIS;
//contant for milliseconds in one hour
var ONE_HOUR_IN_MILLI_SECS = 3600000;


var activityConstraintsMap;

var onDConstraintsMap;

var locationMapCache;

var activityTimeCache = new Object();

/******* common methods - start *******/
/**
 * Called on query window clear
 * To clear the dashboard on clearing query if launched from map
 */
function clear() {
	if(isFetchLocations) {
		clearClickhandler();
		enableDisableRefresh(false, null, true);
	}
}
/**
 * Called on plan change
 * Clears the dashboard on plan change 
 */
function onPlanChange() {
	clearClickhandler();
	enableDisableRefresh(false, null, true);
}
/**
 * Called before toggling the query window tabs
 * @param tabName
 */
function onBeforeTabSelect(tabName) {

}
/**
 * Called after toggling the query window tabs
 * @param tabName
 */
function onTabSelect(tabName) {

}
/**
 * Called before run the query
 */
function onBeforeRunQuery() {

}
/**
 * Called on success of network query
 */
function onNetworkQuerySuccess() {

}
/**
 * Called on success of schedule query for network
 */
function onNetworkScheduleQuerySuccess() {
	
}
/**
 * Called on success of schedule query
 */
function onScheduleQuerySuccess() {

}
/**
 * To get the width of text label
 * @param text
 * @returns
 */
function getTextLength(text) {
	return parent.VIEWER.getTextLength(text);
}
/**
 * Called on resizing the window
 * and resizes the slider
 * @param event
 */
function onResize(event) {
	/*if(event && event.sender && event.sender.element && event.sender.element.find("iframe.k-content-frame").length > 0){
		event.sender.element.find("iframe.k-content-frame")[0].contentDocument.body.onresize = null;
	}*/
	createSlider(getSliderCurrentOptions());
	setLowerDivHeight();
}
/**
 * Called from parent to refresh the dashboard on conditions
 */
function refresh() {

}
/**
 * Called from parent to refresh the dashboard on conditions
 * @param restoreDefaultFavorite
 * @param isClearOperation
 * @param isRefreshDashboard
 */
function resetDashboard(restoreDefaultFavorite, isClearOperation, isRefreshDashboard){
	clearDisplaySetting();
	isLocalFlag = parent.isLocalTimeFlag();
	isZulu = !isLocalFlag;
	if(isClearOperation) {
		applyDisplaySettings();
	}
}
/******* common methods - end *******/

/******* Header Button methods - Start *******/
/**
 * Exports the analysis data to excel
 */
function exportDataToExcel() {
	var tableContentStr = "<table border='1'><tr>" +
			"<th>Origin Loc</th><th>Origin Acty</th><th>Acty Start/Available Time</th><th>Acty Duration</th><th>Acty End Time</th><th>Is Allowed</th>" +
			"<th>Destination Loc</th><th>Destination Acty</th><th>Acty Start Time</th><th>Acty Duration</th><th>Acty End Time</th><th>Acty Due Time</th><th>Is Allowed</th>" +
			"<th>Mode</th>" +
			"</tr>";
	
	if(ganttChartDiagram) {
		var nodesData = ganttChartDiagram.nodesArray;
		var fligthRow, truckRow;
		var leftFlight, leftTruck, rightFlight, rightTruck;
		var rowCount = 1;
		var i=1;
		var errorMsgF = EMPTY_STRING;
		var errorMsgT = EMPTY_STRING;
		while(i < nodesData.length){
			fligthRow = "<tr>";
			truckRow = "<tr>";
			try {
				leftFlight = $.grep(nodesData, function(e){ return e.key == "leftFlight"+rowCount; });
				if(leftFlight && leftFlight.length > 0) {
					fligthRow += "<td>" + getTableLocValue("originTable", rowCount) + "</td>" +
							"<td>" + getTableActValue("originTable", rowCount) + "</td>" +
							"<td>" + leftFlight[0].serverTime + "</td>" +
							"<td>" + leftFlight[0].text + "</td>" +
							"<td>" + convertToTimeFormat(convertTimeToHhs(leftFlight[0].serverTime) + convertTimeToHhs(leftFlight[0].text)) + "</td>" +
							"<td>" + leftFlight[0].visible + "</td>";
					i++;
				}else{
					fligthRow += "<td></td><td></td><td></td><td></td><td></td><td></td>";
				}
			}catch (e) {
				errorMsgF = "Error[" + e.message + "]occured in origin flight,";
			}
			try {
				leftTruck = $.grep(nodesData, function(e){ return e.key == "leftTruck"+rowCount; });
				if(leftTruck && leftTruck.length > 0) {
					truckRow += "<td>" + getTableLocValue("originTable", rowCount) + "</td>" +
							"<td>" + getTableActValue("originTable", rowCount) + "</td>" +
							"<td>" + leftTruck[0].serverTime + "</td>" +
							"<td>" + leftTruck[0].text + "</td>" +
							"<td>" + convertToTimeFormat(convertTimeToHhs(leftTruck[0].serverTime) + convertTimeToHhs(leftTruck[0].text)) + "</td>" +
							"<td>" + leftTruck[0].visible + "</td>";
					i++;
				}else {
					truckRow += "<td></td><td></td><td></td><td></td><td></td><td></td>";
				}
			}catch (e) {
				errorMsgT = "Error[" + e.message + "]occured in origin truck,";
			}
			try {
				rightFlight = $.grep(nodesData, function(e){ return e.key == "rightFlight"+rowCount; });
				if(rightFlight && rightFlight.length > 0) {
					fligthRow += "<td>" + getTableLocValue("destinationTable", rowCount) + "</td>" +
							"<td>" + getTableActValue("destinationTable", rowCount) + "</td>" +
							"<td>" + convertToTimeFormat(getSliderValues()[1]) + "</td>" +
							"<td>" + rightFlight[0].text + "</td>" +
							"<td>" + convertToTimeFormat(convertTimeToHhs(convertToTimeFormat(getSliderValues()[1])) + convertTimeToHhs(rightFlight[0].text)) + "</td>" +
							"<td>" + rightFlight[0].serverTime + "</td>" +
							"<td>" + rightFlight[0].visible + "</td>";
					i++;
				}else{
					fligthRow += "<td></td><td></td><td></td><td></td><td></td><td></td><td></td>";
				}
			}catch (e) {
				errorMsgF += "Error[" + e.message + "]occured in destination flight";
			}
			try {
				rightTruck = $.grep(nodesData, function(e){ return e.key == "rightTruck"+rowCount; });
				if(rightTruck && rightTruck.length > 0) {
					truckRow += "<td>" + getTableLocValue("destinationTable", rowCount) + "</td>" +
							"<td>" + getTableActValue("destinationTable", rowCount) + "</td>" +
							"<td>" + convertToTimeFormat(getSliderValues()[1]) + "</td>" +
							"<td>" + rightTruck[0].text + "</td>" +
							"<td>" + convertToTimeFormat(convertTimeToHhs(convertToTimeFormat(getSliderValues()[1])) + convertTimeToHhs(rightTruck[0].text)) + "</td>" +
							"<td>" + rightTruck[0].serverTime + "</td>" +
							"<td>" + rightTruck[0].visible + "</td>";
					i++;
				}else{
					truckRow += "<td></td><td></td><td></td><td></td><td></td><td></td><td></td>";
				}
			}catch (e) {
				errorMsgT += "Error[" + e.message + "]occured in destination truck";
			}
			
			fligthRow += "<td>Flight</td><td>"+  errorMsgF +"</td></tr>";
			truckRow  += "<td>Truck</td><td>"+  errorMsgT +"</td></tr>";
			tableContentStr += fligthRow;
			tableContentStr += truckRow;
			rowCount ++;
		}
	}
	tableContentStr += "</table>";
	
	var hubLoc = $("#hubLocation").val();
	var hubActy = $("#hubActivity").val();
	var startTime = $("#actStart").val().replace(":","-");
	var endTime = $("#actEnd").val().replace(":","-");
	
	var a = document.createElement('a');
	a.href = EXPORT_TO_EXCEL_PREFIX + encodeURIComponent(tableContentStr);
    a.download = parent.getCommonCaseLabel() + '_' + hubLoc + '_' + (hubActy != EMPTY_STRING ? (hubActy + '_'):EMPTY_STRING) + startTime + '_' + endTime + '_' + '.xls';
    a.click();
}
/**
 * To get the origin/desination location name by row index
 * @param tableId
 * @param rowIndex
 * @returns location name
 */
function getTableLocValue(tableId, rowIndex) {
	var tr = ($('#' + tableId + ' tbody tr:eq(' + rowIndex  +')'));
	return tr.find("input")[0].value;
}
/**
 * To get the origin/desination activity name by row index
 * @param tableId
 * @param rowIndex
 * @returns activity name
 */
function getTableActValue(tableId, rowIndex) {
	var tr = ($('#' + tableId + ' tbody tr:eq(' + rowIndex  +')'));
	return tr.find("input")[1].value;
}
/**
 * To clear the dashboard on clicking header clear button
 */
function clearClickhandler() {
	clearTablesChartAndSlider();
	clearInputAndCheckBoxes();
	clearDisplaySetting();
	
	addRowToTable('#originTable');
	addRowToTable('#destinationTable');
	setGanttDivHeight();
	createSlider(getSliderOptions(00,24,11,12));
	addRulerLabel(0, 24, 24);
	locationMapCache = null;
}
/**
 * To toggle the time local or zulu on clicking header button
 * @param event
 */
function toggleLocalZuluTime(event) {
	var span = $(event.currentTarget).find("span");
	if(span && span.length > 0 && span[0].className && span[0].className.indexOf("icon-toggle-local") > 0) {
		isZulu = false;
	}else {
		isZulu = true;
	}
	refreshChartHandler();
}

/******* Header Button methods - End *******/

/******* clear chart methods - start *******/
/**
 * To clear the inputs and checkboxes
 */
function clearInputAndCheckBoxes() {
	$("#showOrigins")[0].checked = false;
	$("#showDestinations")[0].checked = false;
	
	$("#originActivityCheckBox")[0].checked = false;
	$("#destinationActivityCheckBox")[0].checked = false;
	
	$("#originTimeCheckBox")[0].checked = false;
	$("#destinationTimeCheckBox")[0].checked = false;
	
	$("#modeOrigins").data("kendoAutoComplete").value(EMPTY_STRING);
	$("#modeDestinations").data("kendoAutoComplete").value(EMPTY_STRING);
	
	$("#originActivity").data("kendoAutoComplete").value(EMPTY_STRING);
	$("#destinationActivity").data("kendoAutoComplete").value(EMPTY_STRING);
	
	$("#originTime").val(EMPTY_STRING);
	$("#destinationTime").val(EMPTY_STRING);
	
	$("#hubLocation").data("kendoAutoComplete").value(EMPTY_STRING);
	$("#hubActivity").data("kendoAutoComplete").value(EMPTY_STRING);
}
/**
 * To clear the table o/d's loc, act and slider
 */
function clearTablesChartAndSlider() {
	clearTableById("originTable");
	clearTableById("destinationTable");
	clearAddRemoveRowTable();
	clearChartAndSlider();
}
/**
 * To clear the table by id
 * @param id
 */
function clearTableById(id) {
	var rowCount = $('#' + id + ' tr').length - 1;
	for(var i=rowCount; i>0;i--) {
		deleteRowFromTable(id, i);
	}
}
/**
 * To clear the add/remove icons from the dashboard 
 */
function clearAddRemoveRowTable() {
	var rowCount = $('#addRemoveRowTable tr').length - 2;
	for(var i=rowCount;i>=0;i--) {
		deleteRowFromTable('addRemoveRowTable', i);
	}
}
/**
 * To clear the gantt chart and reset the slider
 */
function clearChartAndSlider() {
	if(ganttChartDiagram && ganttChartDiagram.ganttDiagram) {
		ganttChartDiagram.ganttDiagram.clear();
	}
	setGanttDivHeight();
	setSliderBoxDiv();
}

/**
 * To cleat/reset the display settings
 */
function clearDisplaySetting() {
	var defaultDisplaySetting = new Object();
	defaultDisplaySetting["flight"] = 525;
	defaultDisplaySetting["truck"] = 45;
	defaultDisplaySetting["availableTime"] = 0;
	defaultDisplaySetting["dueTime"] = 0;
	defaultDisplaySetting["activityToDest"] = 1;
	defaultDisplaySetting["originToActivity"] = 1;
	defaultDisplaySetting["rightFlightOption"] = true;
	defaultDisplaySetting["rightTruckOption"] = true;
	defaultDisplaySetting["leftFlightOption"] = true;
	defaultDisplaySetting["leftTruckOption"] = true;
	defaultDisplaySetting["showOnlyViableResultsChk"] = true;
	
	applyDisplayOptionSettings(defaultDisplaySetting);
}
/******* clear chart methods - end *******/

/******* launch from map methods - start *******/

/**
 * To add the hub location, activitie and min processing time when launched from map
 * and calls the mode analysis service, isFetchLocations true if launched from map
 * @param isFetchLocations
 */
function showMapLocations(isFetchLocations) {
	clearTablesChartAndSlider();
	//location from which mode analysis launched
	var hubLoc = parent.getDashboardContentWindow(parent.DASHBOARD_ID_MAP_VIEW).modeAnalysisLocation;
	var hubActivity = parent.getDashboardContentWindow(parent.DASHBOARD_ID_MAP_VIEW).modeAnalysisActivities;
	//primary locations
	var primaryLoc = parent.getPrimaryLocations();
	//if the location from which mode analysis launched is not same as primary location then don't consider hub activity 
	if(primaryLoc && primaryLoc.indexOf(hubLoc) == -1) {
		hubActivity = EMPTY_STRING;
	}
	if(hubLoc) {
		//to enable disable the header button based on data on UI 
		enableDisableRefresh(true);
		if(hubActivity && hubActivity.length > 0) {
			hubActivity = hubActivity[0];
		}else {
			hubActivity = EMPTY_STRING;
		}
		$("#hubLocation").data("kendoAutoComplete").value(hubLoc);
		$("#hubActivity").data("kendoAutoComplete").value(hubActivity);
		var acty = activitiesDetailMap[hubLoc+"_"+hubActivity];
		if(acty) {
			$("#minProTime").val(getMinProcessTime(acty));
		}else{
			$("#minProTime").val(15);
		}
		//mode analysis service renderer
		callMapModeAnalysisService(hubLoc, hubActivity, isFetchLocations);
	}
}

function getMinProcessTime(acty){
	var actyCloseWin = convertLocalToZuluInSecs(acty.closeWinL);
	var actyDueTime = convertLocalToZuluInSecs(acty.dueTimeL);
	
	actyCloseWin += acty.closeActOffsetL  * 24* 3600;
	actyDueTime += acty.dueActOffsetL  * 24* 3600;
	
	if(actyDueTime > actyCloseWin){
		return convertToHHMMTimeFormat(actyDueTime - actyCloseWin);	
	}else {
		return convertToHHMMTimeFormat(actyCloseWin - actyDueTime);
	}	
}
/**
 * Map mode analysis service handler
 * @param loc
 * @param activity
 * @param isFetchLocations
 */
function callMapModeAnalysisService(loc, activity, isFetchLocations) {
	var serviceUrl = MODE_ANALYSIS_SERVICE_DATA_URL + "ModeAnalysisRequest";
	var paramsMap;
	
	paramsMap = {
			"browserSessionId":parent.getBrowserSessionId(),
			"commonCaseId":parent.getCommonCaseId(),
			"hubLocs" : loc,
			"effDayPatternStr": parent.getSelectedEffDayStrPattern(),
			"hubActivity" : activity,
			"primaryLocs" : parent.getPrimaryLocations(),
			"isFetchLocations" : isFetchLocations,
			"isZulu" : isZulu,
			"zuluToLocalOffset" : getZuluToLocalOffset(),
			"flightSpeed" : $('#flight').val(),
			"truckSpeed" : $('#truck').val(),
			"isDistanceInKms" : parent.isDistanceInKms(),
			"availTimeOffset" : convertTimeToHhs($('#availableTime').val()),
			"dueTimeOffset" : convertTimeToHhs($('#dueTime').val()),
			"zuluMidNightOrigin" : $('#originToActivity').val(),
			"zuluMidNightDest" : $('#activityToDest').val()
		};
	if(paramsMap) {
		parent.showProgressDialog(true, "Loading...");
		
		callService({
			url : serviceUrl,
			paramsMap: paramsMap,
			successCallback : onMapModeServiceRequestSuccess, 
			failureCallback : onModeServiceRequestFailure,
			showProgressWindow : false
		  });		
	}
}
/**
 * Map mode analysis service success handler
 * Adds the orgin/destination locs and acts which are on map
 * @param response
 * @param io
 */
function onMapModeServiceRequestSuccess(response, io) {
	parent.showProgressDialog(false);
	if(response && response._errorCd && response._errorCd > 0) {
		parent.showErrorMsg(response._errorDesc);
	}else{
		onModeServiceRequestSuccess(response, io);
	}
}
/**
 * To add the location and activities pairs on origin and destination side 
 * when launched from map and also to add locs, acts saved in favorites
 * @param response
 * @param io
 */
function addMapLocationsTables(response, io) {
	if(response) {
		for(var i=0; i<response.length; i++){
			if(response[i].isOrigin == "true" || response[i].isOrigin == true) {
				addRowToTable('#originTable', response[i].originCd, response[i].activityCd);
			}else {
				if(response[i].rowIndex >  $('#destinationTable tr').length) {
					var emptyRowCount = parseInt(response[i].rowIndex) - $('#destinationTable tr').length;
					for(var k=0; k<emptyRowCount; k++) {
						addRowToTable('#destinationTable');
					}
				}
				addRowToTable('#destinationTable', response[i].originCd, response[i].activityCd);
				if($('#originTable tr').length < $('#destinationTable tr').length) {
					addRowToTable('#originTable');
				}
			}
		}
		var maxRowCount = $('#originTable tr').length > $('#destinationTable tr').length ? $('#originTable tr').length - 1: $('#destinationTable tr').length - 1;
		for(i=1;i<maxRowCount;i++) {
			addRowToAddDeleteTable('#addRemoveRowTable');
		}
	}
}
/**
 * 
 * @param response
 * @param io
 */
 function updateTimeTextForLocationsTables(response, io) {
 	$.grep($("#originTable").find('.timeInput'), function(eInput){
 		activityTimeHandler(eInput,"#originTable");
	});
 	$.grep($("#destinationTable").find('.timeInput'), function(eInput){
 		activityTimeHandler(eInput,"#destinationTable");
 	});
 	activityTimeCache = new Object();
}
/******* launch from map methods - end ********/

/******* apply display setting methods - start ********/
/**
 * To apply the display setting changes
 */
function applyDisplaySettings(event) {
	refreshChartHandler();
	applyButtonDisplaySetting();
	$('#modeanalysisDisplayOptions').panel('hideMapOptionDiv');
}
/**
 * To apply the fligh/truck checkboxes display setting
 */
function applyButtonDisplaySetting() {
	//applyFilterConstraints();
}
/******* apply display setting methods - end ********/

/******* favorites methods - start ********/
/**
 * To get the header button states for favorites
 */
function getHeaderButtonSettings() {
	
}
/**
 * To get the display setting for favorites
 * @returns {Object}
 */
function getDisplayOptionSettings() {
	var favoriteDisplaySetting = new Object();
	$("#modeanalysisDisplayOptions input").each(function(i) {
		if(this.type == "text") {
			favoriteDisplaySetting[this.id] = this.value;
		}else if(this.type == "checkbox") {
			favoriteDisplaySetting[this.id] = this.checked;
		}
	});
	return favoriteDisplaySetting;
}
/**
 * To get the dashboard content for favorites
 * @returns {Object}
 */
function getContentFavoriteSettings() {
	var favoriteContentSetting = new Object();
	$("#topLeftOriginsDiv input").each(function(i) {
		if(this.type == "text") {
			favoriteContentSetting[this.id] = this.value;
		}else if(this.type == "checkbox") {
			favoriteContentSetting[this.id] = this.checked;
		}
	});
	$("#topRightDestinationsDiv input").each(function(i) {
		if(this.type == "text") {
			favoriteContentSetting[this.id] = this.value;
		}else if(this.type == "checkbox") {
			favoriteContentSetting[this.id] = this.checked;
		}
	});
	$("#centerTopFirstDiv input").each(function(i) {
		if(this.type == "text") {
			favoriteContentSetting[this.id] = this.value;
		}else if(this.type == "checkbox") {
			favoriteContentSetting[this.id] = this.checked;
		}
	});
	var tableData = new Array();
	$("#originTable tr").each(function(i){
		if(i > 0) {
			x = $(this).children(':first-child');
			if(x.find("input.k-input")) {
				locCd = x.find("input.k-input").val();
			}
			y = x.next();
			if(y.find("input.k-input")) {
				actyCd = y.find("input.k-input").val();
			}
			z = y.next();
			if(z.find("input.k-input")) {
				time = z.find("input.k-input").val();
			}
			tableData.push({originCd: locCd, activityCd: actyCd, isOrigin: true, rowIndex: this.rowIndex});
		}
	});
	$("#destinationTable tr").each(function(i){
		if(i > 0) {
			x = $(this).children(':first-child').next();
			if(x.find("input.k-input")) {
				time = x.find("input.k-input").val();
			}
			y = x.next();
			if(y.find("input.k-input")) {
				locCd = y.find("input.k-input").val();
			}
			z = y.next();
			if(z.find("input.k-input")) {
				actyCd = z.find("input.k-input").val();
			}
			tableData.push({originCd: locCd, activityCd: actyCd, isOrigin: false, rowIndex: this.rowIndex});
		}
	});
	favoriteContentSetting["tableData"] = tableData;
	
	return favoriteContentSetting;
}
/**
 * To apply dashboard favorite header settings
 * @param headerSetting
 */
function applyHeaderButtonSettings(headerSetting) {
	
}
/**
 * To apply dashboard favorite display settings
 * @param displaySetting
 * @param isDefaultFavorite
 * @param isApplicationLevel
 * @param isRefreshDashboard
 */
function applyDisplayOptionSettings(displaySetting, isDefaultFavorite, isApplicationLevel, isRefreshDashboard) {
	if(displaySetting) {
		var keys = Object.keys(displaySetting);
		for(var i=0; i<keys.length; i++) {
			var obj = $("#" + keys[i])[0]; 
			if(obj.type == "text") {
				obj.value = displaySetting[keys[i]];
			}else if(obj.type == "checkbox") {
				obj.checked = displaySetting[keys[i]];
			}
		}
	}
}
/**
 * To apply dashboard favorite content settings
 * @param contentSetting
 * @param isDefaultFavorite
 * @param isApplicationLevel
 * @param isRefreshDashboard
 */
function applyContentFavoriteSettings(contentSetting, isDefaultFavorite, isApplicationLevel, isRefreshDashboard) {
	if(contentSetting) {
		clearTablesChartAndSlider();
		var keys = Object.keys(contentSetting);
		for(var i=0; i<keys.length; i++) {
			var obj = $("#" + keys[i])[0];
			if(keys[i] == "tableData") {
			}else if(obj.type == "text") {
				obj.value = contentSetting[keys[i]];
			}else if(obj.type == "checkbox") {
				obj.checked = contentSetting[keys[i]];
			}
		}
	}
	favStartTime =  contentSetting["actStart"];
	favEndTime = contentSetting["actEnd"]; 
	
	parent.showProgressDialog(true, "Adding locations...");
	setTimeout(function() {
		addMapLocationsTables(contentSetting["tableData"]);
		parent.showProgressDialog(false);
		if(contentSetting["hubLocation"] != EMPTY_STRING){
			refreshChartHandler();
		}
	},100);
}
/******* favorites methods - start ********/
/**
 * To get the states of flight/truck buttons on origin and destination side
 */
function getBtnMap() {
	var btnMap = new Object();
	if($('#allmodesOrigin')[0].checked) {
		btnMap["leftFlight"] = true;
		btnMap["leftTruck"] = true;
	}else {
		btnMap["leftFlight"] = false;
		btnMap["leftTruck"] = $('#canTruckOrigin')[0].checked;
	}
	if($('#allmodesDest')[0].checked) {
		btnMap["rightFlight"] = true;
		btnMap["rightTruck"] = true;
	}else {
		btnMap["rightFlight"] = false;
		btnMap["rightTruck"] = $('#canTruckDest')[0].checked;
	}
	btnMap["ignoreDueTime"] = !$('#showOnlyViableResultsChk')[0].checked;
	btnMap["mustFlyOrigin"] = $('#mustFlyOrigin')[0].checked;
	btnMap["mustFlyDest"] = $('#mustFlyDest')[0].checked;
	btnMap["travelTimeFromOrigin"] = convertTimeToHhs($('#travelTimeFromOrigin').val()) * 60;	 	//time in mins
	btnMap["travelTimeToDestination"] = convertTimeToHhs($('#travelTimeToDestination').val()) * 60;	//time in mins
	return btnMap;
}
/**
 * To initialize mode analysis dashboard
 * isFetchLocations true if launched from map otherwise false
 * @param isFetchLocations
 */
function initializeModeAnalysis(isFetchLocations) {
	activityConstraintsMap = getBtnMap();
	onDConstraintsMap = getBtnMap();
	if(!isFetchLocations) {
		//set map mode analysis dashboard id
		viewerDashboardId = parent.DASHBOARD_ID_MODE_ANALYSIS;
		//add header button
		addButtonsBar(parent.DASHBOARD_ID_MODE_ANALYSIS);
		//initialize favorite component
		favoriteComponent = new FavoriteComponent(parent.DASHBOARD_ID_MODE_ANALYSIS, "modeAnalysisFavoritesMenu", "Mode Analysis");
	}else {
		//set application mode analysis dashboard id
		viewerDashboardId = parent.DASHBOARD_ID_MAP_MODE_ANALYSIS;
		//add header button
		addButtonsBar(parent.DASHBOARD_ID_MAP_MODE_ANALYSIS);
		//initialize favorite component
		favoriteComponent = new FavoriteComponent(parent.DASHBOARD_ID_MAP_MODE_ANALYSIS, "modeAnalysisMapFavoritesMenu", "Mode Analysis");
	}
	if(parent.getFavoriteDataCache() != null){
		favoriteComponent.onInitalizeFavorite(parent.getFavoriteDataCache());
	}else{
		favoriteComponent.retrieveAllFavorites();
	}
	//set local/zulu flag based on system setting
	parent.setLocalZuluButtonState(localZuluBtnName);
	//add display options
	initializeDisplayOptions();
	//initialize country datasoure for origins to inculde
	initLocationsDataSource("modeOrigins");
	//initialize country datasoure for destination to inculde
	initLocationsDataSource("modeDestinations");
	//create the map of activities and activity details for each location
	initActivitiesByLoc();
	//create the kendo UI components
	createComponents();
	//enable disable the header button
	enableDisableRefresh(false, null, true);
	if(isFetchLocations) {
		//hide origin and destination to include if map mode analysis
		hideOriginDestTopDivs();
		//to show the data when launched form map first time only 
		showMapLocations(isFetchLocations);
		parent.setDashboardInitialized(parent.DASHBOARD_ID_MAP_MODE_ANALYSIS);
	}else {
		parent.setDashboardInitialized(parent.DASHBOARD_ID_MODE_ANALYSIS);
	}
	//apply the default favorite if any
	favoriteComponent.applyDefaultFavorite();
}
/**
 * To add the header button while initializing
 * @param id
 */
function addButtonsBar(id) {
	parent.VIEWER.addButtonsBar(id, $("#headerButtonsBar"));
}
/**
 * To initialize the display setting
 */
function initializeDisplayOptions() {
	parent.createOptionsPanelByDiv($("#modeanalysisDisplayOptions"),'slide-right',true,true,'66px','250px');
}
/**
 * To hide the Orign/Destination to include for map mode analysis
 */
function hideOriginDestTopDivs() {
	$("#topLeftOriginsDiv").hide();
	$("#topRightDestinationsDiv").hide();
}
/**
 * To get the data for locations and activities from parent
 * @param dataType
 * @returns
 */
function getDataSources(dataType) {
	try {
		if(typeof parent.isAdvanceQuery == "function" && parent.isAdvanceQuery()){
			return parent.getDashboardContentWindow(parent.DASHBOARD_ID_QUERY).getQueryDatasources()[dataType];	
		}else{
			return parent.QueryCacheManager.getInstance().getDatasource(dataType);
		}
		
		
	}catch (e) {
		parent.showErrorMsg("Error occured while fetching the data for " + dataType);
	}
}
/**
 * Service handler to get the list of locs for the selected country
 * @param autoCompleteId
 */
function initLocationsDataSource(autoCompleteId) {
	locationsMap[autoCompleteId] = new kendo.data.DataSource({
		serverFiltering:false,
		transport: {
		    read: {
	    		url:function (options) {
			        return getFacilityLocsByCountryCodeDataURL()+parent.getCommonCaseId()+"&rand="+getTime();
			    },
			    dataType: OUTPUT_TYPE_JSON,
			    data: {
			    	countryCd:"US"
			    }
	    	}
		}, 
		requestStart: function(e) {
			parent.showProgressDialog(true, "Retrieving locations..");
		},
		requestEnd: function(e) {
			parent.showProgressDialog(false);
		},
		error: function(e) {
			parent.showProgressDialog(false);
		}
	});
}
/**
 * To invoke the location of selected country service 
 * @param autoCompleteId
 * @param countryCd
 */
function invokeDataSource(autoCompleteId, countryCd) {
	locationsMap[autoCompleteId].transport.options.read.data.countryCd = countryCd;
	locationsMap[autoCompleteId].read();
}
/**
 * Checkbox click handler to set the flag whether needs to show alert whiling applying origins to include
 */
function originCheckBoxClickHandler() {
	showOriginAlert = true;
}
/**
 * Checkbox click handler to set the flag whether needs to show alert whiling applying destinations to include
 */
function destinationCheckBoxClickHandler() {
	showDestinationAlert = true;
}
/**
 * To show the alert and add the locations on applying O/D's include
 * @param event
 * @param mode
 */
function applyModeData(event, mode) {
	locationMapCache = null;
	currentMode = mode;
	if(currentMode == "modeOrigins" && showOriginAlert) {
		if(!checkTableData("originTable")) {
			showOriginAlert = false;
			alertClickHandler(null, true);
		}else {
			showConfirmation();
		}
	}else if(currentMode == "modeDestinations" && showDestinationAlert){
		if(!checkTableData("destinationTable")) {
			showDestinationAlert = false;
			alertClickHandler(null, true);
		}else {
			showConfirmation();
		}
	}
}

/**
 * Confirmation alert to add or replace current locs for O/D's to include
 * If yes, locs will be added, if no, locs will not be added and alert will be closed
 */
function showConfirmation() {
	var alertWindow = $("#alertWindow");
	if(!alertWindow.data("kendoWindow")) {
		alertWindow.css({display : "block"});
		alertWindow.kendoWindow({
			height: "120px",
			width: "250px",
			draggable: true,
			modal: true,
			resizable: false,
			actions: ["close"],
			title: "Alert"
		});
	}
	alertWindow.parent("div.k-widget.k-window").addClass('alertWInStyle');
	alertWindow.data("kendoWindow").center();
	alertWindow.data("kendoWindow").open();
}
/**
 * Confirmation yes/no click handler
 * If yes, locs will be added, if no, locs will not be added and alert will be closed
 * @param event
 * @param isRefresh
 */
function alertClickHandler(event, isRefresh) {
	if($("#alertWindow").data("kendoWindow")) {
		$("#alertWindow").data("kendoWindow").close();
	}
	if(isRefresh) {
		parent.showErrorMsg(EMPTY_STRING);
		parent.showProgressDialog(true, "Refreshing locations..");
		setTimeout(function() {
			refreshLocations();
			parent.showProgressDialog(false);
		},100);
	}
}
/**
 * To add the locations and activities for the selected country for O/D's to include
 * If activity is provided then locations which have that activity will be added only
 * otherwise all locs will be added
 */
function refreshLocations() {
	if(currentMode == "modeOrigins") {
		showOriginAlert = false;
		clearTableById("originTable");
		if($("#showOrigins").is(":checked")) {
			refreshLocsDataSource("originTable", locationsMap[currentMode], EMPTY_STRING);
			var locs = locationsMap[currentMode].data();
			var acitivity;
			if($("#originActivityCheckBox")[0].checked) {
				acitivity = $("#originActivity").val();
			}
			if(locs && locs.length > 0) {
				for(var i=0;i<locs.length;i++) {
					if(acitivity) {
						if(activitiesDetailMap && activitiesDetailMap[locs[i] + "_" + acitivity]) {
							addRowToTable('#originTable', locs[i], acitivity);
						}
					}else {
						addRowToTable('#originTable', locs[i], acitivity);
					}
				}
			}else {
				parent.showErrorMsg("No Primary HU/DL/RP location found for country " + $("#modeOrigins").val());
				addRowToTable('#originTable');
				refreshLocsDataSource("originTable", getDataSources("Locations"), LOCCD);
			}
		}else {
			addRowToTable('#originTable');
			refreshLocsDataSource("originTable", getDataSources("Locations"), LOCCD);
		}
	}else if(currentMode == "modeDestinations") {
		showDestinationAlert = false;
		clearTableById("destinationTable");
		if($("#showDestinations").is(":checked")) {
			refreshLocsDataSource("destinationTable", locationsMap[currentMode], EMPTY_STRING);
			var locs = locationsMap[currentMode].data();
			var acitivity;
			if($("#destinationActivityCheckBox")[0].checked) {
				acitivity = $("#destinationActivity").val();
			}
			if(locs && locs.length > 0) {
				for(var i=0;i<locs.length;i++) {
					if(acitivity) {
						if(activitiesDetailMap && activitiesDetailMap[locs[i] + "_" + acitivity]) {
							addRowToTable('#destinationTable', locs[i], acitivity);
						}
					}else {
						addRowToTable('#destinationTable', locs[i], acitivity);
					}
				}
			}else {
				parent.showErrorMsg("No Primary HU/DL/RP location found for country " + $("#modeDestinations").val());
				addRowToTable('#destinationTable');
				refreshLocsDataSource("destinationTable", getDataSources("Locations"), LOCCD);
			}
		}else {
			addRowToTable('#destinationTable');
			refreshLocsDataSource("destinationTable", getDataSources("Locations"), LOCCD);
		}
	}
	clearAddRemoveRowTable();
	var maxRowCount = $('#originTable tr').length > $('#destinationTable tr').length ? $('#originTable tr').length - 1: $('#destinationTable tr').length - 1;
	for(i=1;i<maxRowCount;i++) {
		addRowToAddDeleteTable('#addRemoveRowTable');
	}
	clearChartAndSlider();
}
/**
 * To initialize the map for list of activities for each location and activities details map for each loc/act pair
 */
function initActivitiesByLoc() {
	//map contains the array of activities specific to location with loc as key
	activitiesMapByLoc = new Object();
	//map contains the activities details with loc_act as key
	activitiesDetailMap = new Object();
	var activitiesDetail;
	if(typeof parent.isAdvanceQuery == "function" && parent.isAdvanceQuery()){
		activitiesDetail = getDataSources("ActivitiesDetail").data();
	}else{
		activitiesDetail = getDataSources("ActivitiesDetail");
	}
	for (var i=0;i<activitiesDetail.length;i++) {
		if(!activitiesMapByLoc[activitiesDetail[i].locCd]) {
			activitiesMapByLoc[activitiesDetail[i].locCd] = new Array();
		}
		activitiesMapByLoc[activitiesDetail[i].locCd].push(activitiesDetail[i].actyCd);
		activitiesDetailMap[activitiesDetail[i].locCd + "_" + activitiesDetail[i].actyCd] = activitiesDetail[i];
		(activitiesMapByLoc[activitiesDetail[i].locCd]).sort();
	}
}
/**
 * To get the zulu to local time difference in hours for the hub loaction/activity
 * @returns
 */
function getZuluToLocalOffset() {
	try {
		var location =	$("#hubLocation").val();
		var activity = $("#hubActivity").val();
		var activityDetail;
		if(location && activitiesDetailMap) {
			if(!activity && activitiesMapByLoc && activitiesMapByLoc[location] && activitiesMapByLoc[location].length > 0){
				activity = activitiesMapByLoc[location][0];
			}
			activityDetail = activitiesDetailMap[location+ "_" + activity];
			if(activityDetail && activityDetail.availTimeL) {
				var time;
				if(activityDetail.availTimeL.toString().indexOf("+") > -1) {
					time = activityDetail.availTimeL.toString().split("+");
					if(time && time.length > 1){
						return "-" + convertTimeToHhs(time[1]);
					}
				}else {
					time = activityDetail.availTimeL.toString().split("-");
					if(time && time.length > 1){
						return convertTimeToHhs(time[1]);
					}
				}
			}
		}
	}catch (e) {
		console.log(e.message);
	}
}
/**
 * To initialize the location/activity autocomplete and other components
 */
function createComponents(){
	//create the hub loc/act kendo autocomplete
	createKendoAutoComplete($('#hubLocation'), LOCCD, getDataSources("Locations"));
	createKendoAutoComplete($('#hubActivity'),EMPTY_STRING, getDataSources("Activities"));
	
	//create the origin to include loc/act kendo autocomplete
	createKendoAutoComplete($('#modeOrigins'),COUNTRYCODE, getDataSources("CountryCodes"), TEMPLATE_COUNTRYCODE);
	createKendoAutoComplete($('#originActivity'),EMPTY_STRING, getDataSources("Activities"));
	
	//create the destination to include loc/act kendo autocomplete
	createKendoAutoComplete($('#modeDestinations'),COUNTRYCODE, getDataSources("CountryCodes"), TEMPLATE_COUNTRYCODE);
	createKendoAutoComplete($('#destinationActivity'),EMPTY_STRING, getDataSources("Activities"));
	
	//add a blank row on origin and destination side 
	addRowToTable('#originTable');
	addRowToTable('#destinationTable');
	
	//set the height for gantt chart
	setGanttDivHeight();
	//set the lower div height for show the scroll only on lower div
	setLowerDivHeight();
	//create the kendo slider with dummy values
	createSlider(getSliderOptions(00,24,11,12));
	//add time scale with dummy value
	addRulerLabel(0, 24, 24);
	
	$('#hubLocation').focus();
	
}
/**
 * To set the height of gantt chart dynamically
 */
function setGanttDivHeight() {
	var height = $("#bottomLeftDiv").height() > $("#bottomRightDiv").height() ? $("#bottomLeftDiv").height() : $("#bottomRightDiv").height();
	$("#gantChartOuterDiv").height(height);
	$("#ganttChart").height(height);
}
/**
 * To set the height of lower scrollable div
 */
function setLowerDivHeight() {
	var height = $("#modeAnalysisView").parent().height() - $("#upperDiv").height();
	$("#lowerDiv").height(height);
}
/**
 * To create and add slider to dashboard
 * @param options
 */
function createSlider(options){
	//remove the slider and add again to resize slider on resizing dashbaord
	if($("#slider").data("kendoRangeSlider")) {
		removeSlider();
	}
	$("#slider").kendoRangeSlider(options);
	sliderChangeHandler();
}
/**
 * To remove the slider from dashboard
 * used to resize the slider
 */
function removeSlider() {
	var sliderOuterDiv = $("#sliderOuterDiv");
	sliderOuterDiv.empty();
	var sliderDiv = $('<div id="slider" class="sliderDiv"/>').appendTo(sliderOuterDiv);
	$('<input/>').appendTo(sliderDiv);
	$('<input/>').appendTo(sliderDiv);
}
/**
 * To set the slider options like min/max values, tooltip and change handlers etc.
 * @param minRange
 * @param maxRange
 * @param startValue
 * @param endValue
 * @returns {Object}
 */
function getSliderOptions(minRange, maxRange, startValue, endValue) {
	var toolTipTemplate = "#=convertToTimeFormat(selectionStart)# - #=convertToTimeFormat(selectionEnd)#";
	return {
	    change: sliderChangeHandler,
	    slide: sliderChangeHandler,
	    min: minRange == null ? 0:minRange,
	    max: maxRange == null ? 24:maxRange,
	    selectionStart:  startValue == null ? 0:startValue,
	    selectionEnd:  endValue == null ? 24:endValue,
	    smallStep: .0167,
	    largeStep: 1,
	    tickPlacement: "none",
	    tooltip: {
			enabled : true,
			format : "{0}",
			template : toolTipTemplate
		}
	};
}
/**
 * To get the slider options
 * used to resize the slider
 * @returns
 */
function getSliderCurrentOptions() {
	if($("#slider").data("kendoRangeSlider")){
		return $("#slider").data("kendoRangeSlider").options;
	}
}
/**
 * To set the slider min/max, start/end values according to mode analysis service response
 * @param minAvailTimeInSec
 * @param maxDueTimeInSec
 * @param diffTimeInSec
 * @param originsActivityMaxAirEndTime
 * @param minAvailTimeStr
 * @param maxDueTimeStr
 */
function setSliderMinMaxValues(minAvailTimeInSec, maxDueTimeInSec, diffTimeInSec, originsActivityMaxAirEndTime, minAvailTimeStr, maxDueTimeStr) {
	var diffTimeInhrs = diffTimeInSec/ONE_HOUR_IN_MILLI_SECS;
	var hubLoc = $("#hubLocation").data("kendoAutoComplete").value();
	var hubActivity = $("#hubActivity").data("kendoAutoComplete").value();
	var activity = activitiesDetailMap[hubLoc+"_"+hubActivity];
	var minValue, maxValue, startValue, endValue;
	minValue = convertTimeToHhs(minAvailTimeStr);
	maxValue = minValue + diffTimeInhrs;
	if(activity) {
		if(isZulu) {
			startValue = getTimeInSeconds(activity.openWinZ)/3600;
			endValue = getTimeInSeconds(activity.closeWinZ)/3600;
		}else {
			startValue = getTimeInSeconds(activity.openWinL)/3600;
			endValue = getTimeInSeconds(activity.closeWinL)/3600;
		}
	}else{
		startValue = minValue + (originsActivityMaxAirEndTime - minAvailTimeInSec)/ONE_HOUR_IN_MILLI_SECS - 2;
		endValue = minValue + (originsActivityMaxAirEndTime - minAvailTimeInSec)/ONE_HOUR_IN_MILLI_SECS + convertTimeToHhs(getMinProcessingTime());
	}
	if($('#originToActivity').val() > 1) {
		var count = 1;
		var zuluOrgMidNight = $('#originToActivity').val();
		while(count < zuluOrgMidNight) {
			if(maxValue > endValue + count * 24) {
				startValue = startValue + 24;
				endValue = endValue + 24;
			}
			count++;
		}
	}
	if(ganttChartDiagram) {
		ganttChartDiagram.scaleOffset = 0;
	}
	if(startValue < minValue) {
		startValue = startValue + 24;
		endValue = endValue + 24;
		maxValue = maxValue + 24;
		if(ganttChartDiagram) {
			ganttChartDiagram.maxDueTimeInMilliSec = ganttChartDiagram.maxDueTimeInMilliSec + 24 * ONE_HOUR_IN_MILLI_SECS;
			ganttChartDiagram.scaleOffset += 24;
		}
	}
	if(endValue <= startValue) {
		endValue = endValue + 24;
	}
	while(endValue > maxValue){
		maxValue = maxValue + 24;
		if(ganttChartDiagram) {
			ganttChartDiagram.maxDueTimeInMilliSec = ganttChartDiagram.maxDueTimeInMilliSec + 24 * ONE_HOUR_IN_MILLI_SECS;
			ganttChartDiagram.scaleOffset += 24;
		}
	}
	diffTimeInhrs = maxValue - minValue;
	timeDiffInMilliSecs = diffTimeInhrs * ONE_HOUR_IN_MILLI_SECS;
	if(startValue > maxValue || startValue < minValue) {
		startValue = minValue + diffTimeInhrs/3;
	}
	if(endValue > maxValue || endValue < minValue || endValue <= startValue) {
		endValue = minValue + diffTimeInhrs * 2/3;
	}
	createSlider(getSliderOptions(minValue, maxValue, startValue, endValue));
	addRulerLabel(minValue, maxValue, diffTimeInhrs);
}
/**
 * To get the slider min/max value
 * @returns {Array}
 */
function getSliderMinMaxValues() {
	return [$("#slider").data("kendoRangeSlider").options.min, $("#slider").data("kendoRangeSlider").options.max];
}
/**
 * To add the hours label on time scale/ruler
 * @param startValue
 * @param endValue
 * @param diffTime
 */
function addRulerLabel(startValue, endValue, diffTime) {
	var scaleWidth = $("#scaleDiv").width();
	var widthFactor = scaleWidth/diffTime;
	var startWidth = (startValue % 1 > 0 ? (1-startValue % 1) : 0) * widthFactor;
	var endWidth = (endValue % 1) * widthFactor;
	var diff = parseInt(diffTime - (startValue % 1) - (endValue % 1));
	startValue = Math.ceil(startValue);
	var i = 1, cell1, cell2, cellText1, cellText2;
	var table = document.createElement("table");
	var row1 = document.createElement("tr");
	var row2 = document.createElement("tr");
	$("#scaleDiv").empty();
	if(startWidth > 0) {
		cell1 = document.createElement("td");
		cell2 = document.createElement("td");
		cell1.style.width = startWidth + 4 + "px";
		cell2.style.width = startWidth + 4 + "px";
		cellText1 = document.createTextNode(startValue);
		cellText2 = document.createTextNode("|");
		cell1.appendChild(cellText1);
		cell2.appendChild(cellText2);
	    row1.appendChild(cell1);
	    row2.appendChild(cell2);
	}
	while(i <= diff) {
		cell1 = document.createElement("td");
		cell2 = document.createElement("td");
		if(startWidth <=0 && i == 1) {
    		cell1.style.width = widthFactor + 4 + "px";
    		cell2.style.width = widthFactor + 4 + "px";
    	}else {
    		cell1.style.width = widthFactor + "px";
    		cell2.style.width = widthFactor + "px";
    	}
		cellText1 = document.createTextNode(getHours(startValue + i));
		cellText2 = document.createTextNode("|  ");
    	cell1.appendChild(cellText1);
    	cell2.appendChild(cellText2);
        row1.appendChild(cell1);
        row2.appendChild(cell2);
        i++;
	}
	if(endWidth > 0) {
		cell1 = document.createElement("td");
		cell2 = document.createElement("td");
		cell1.style.width = endWidth + "px";
		cell2.style.width = endWidth + "px";
		//cellText1 = document.createTextNode(convertToTimeFormat(endValue));
		cellText1 = document.createTextNode("");
		cellText2 = document.createTextNode("|");
		cell1.appendChild(cellText1);
    	cell2.appendChild(cellText2);
        row1.appendChild(cell1);
        row2.appendChild(cell2);
	}
    table.appendChild(row1);
    table.appendChild(row2);
    document.getElementById("scaleDiv").appendChild(table);
}
/**
 * To get the slider current values
 * @returns {Array}
 */
function getSliderValues() {
	return $("#slider").data("kendoRangeSlider").value();
}
/**
 * To set the slider values on the changing the activity start/end time
 * @param firstValue
 * @param secondValue
 */
function setSliderValues(firstValue, secondValue) {
	if(firstValue && secondValue) {
		$("#slider").data("kendoRangeSlider").values(firstValue, secondValue);
		sliderChangeHandler();
	}
}
/**
 * To set the slider start value on the changing the activity start time
 * @param value
 */
function setSliderFirstValue(firstVal, secondVal) {
	var slider = $("#slider").data("kendoRangeSlider");
	var sliderValues = slider.value();
	if(secondVal == null || secondVal == undefined) {
		secondVal = sliderValues[1];
	}
	if(firstVal ) {
		slider.values(firstVal, secondVal);
		sliderChangeHandler();
	}
}
/**
 * To set the slider end value on the changing the activity end time
 * @param value
 */
function setSliderSecondValue(value) {
	var slider = $("#slider").data("kendoRangeSlider");
	var sliderValues = slider.value();
	if(value) {
		slider.values(sliderValues[0], value);
		sliderChangeHandler();
	}
}
/**
 * Slider change handler, called on sliding the cursors of slider
 * On sliding, sets the activity start/end time and refreshes the gantt chart to show/hide the bars
 * @param event
 */
function sliderChangeHandler(event) {
	setTimeout(function() {
		setSliderBoxDiv();
	},10);
	var viewDtlsMap = null;
	if(event && event.value) {
		setActivityStartValue(event.value[0]);
		setActivityEndValue(event.value[1]);
		setDueTimeLbl(event.value[1]);
		if(ganttChartDiagram) {
			viewDtlsMap =ganttChartDiagram.refreshGanttChart(event.value, getSliderMinMaxValues(), timeDiffInMilliSecs, getMinProcessingTime(), getBtnMap());
		}
	} else {
		setActivityStartValue(getSliderValues()[0]);
		setActivityEndValue(getSliderValues()[1]);
		setDueTimeLbl(getSliderValues()[1]);
		if(ganttChartDiagram) {
			viewDtlsMap = ganttChartDiagram.refreshGanttChart(getSliderValues(), getSliderMinMaxValues(), timeDiffInMilliSecs, getMinProcessingTime(), getBtnMap());
		}
	}
	if(event != null){
		refreshModeAnalsysisView(viewDtlsMap,getBtnMap(),$("input:radio[name='originDisplay']:checked")[0]);
		refreshModeAnalsysisView(viewDtlsMap,getBtnMap(),$("input:radio[name='destinationsDisplay']:checked")[0]);
	}
}
/**
 * To set the poisition of box below the slider
 */
function setSliderBoxDiv() {
	var tempHeight = $("#bottomLeftDiv").height() > $("#bottomRightDiv").height() ? $("#bottomLeftDiv").height() : $("#bottomRightDiv").height();
	var height = tempHeight < $("#lowerDiv").height() ? tempHeight : $("#lowerDiv").height();
	var sliderDivHgt = $("#sliderOuterDiv").height();
	var dragCursors = $("#sliderOuterDiv").find("a.k-draghandle");
	var leftDragCursor, rightDragCursor, sliderWidth;
	if(dragCursors && dragCursors.length > 1) {
		$("#sliderBox").show();
		$("#dashedLine").show();
		leftDragCursor = dragCursors[0];
		rightDragCursor = dragCursors[1];
		sliderWidth = $(rightDragCursor).position().left - $(leftDragCursor).position().left; 
		$("#sliderBox").css({
			height:height + sliderDivHgt/2 - 7,
			top: -(sliderDivHgt /2 - 5),
			marginBottom: -(sliderDivHgt /2 - 5),
			left: $(leftDragCursor).position().left + $(leftDragCursor).width()/1.8,
			width: sliderWidth
		});
		$("#dashedLine").css({
			height:height + sliderDivHgt/2 - 7,
			right: getDashedLinePosition()
		});
		leftDragCursor.onmousedown = sliderBoxMouseUpHandler;
		rightDragCursor.onmousedown = sliderBoxMouseUpHandler;
		$("#sliderOuterDiv").find("div.k-slider-track").mousedown(function(){
			sliderBoxMouseUpHandler();
		});
	}else {
		$("#sliderBox").hide();
		$("#dashedLine").hide();
	}
}
/**
 * To get the minimum processing time
 * @returns
 */
function getMinProcessingTime() {
	if($("#minProTime").val() == EMPTY_STRING) {
		$("#minProTime").val(15);
	}
	return $("#minProTime").val();
}
/**
 * To get the poition of due time vertical dashded line
 * @returns {Number}
 */
function getDashedLinePosition() {
	var minProTime = getMinProcessingTime();
	var sliderWidth = $("#slider").width();
	if(minProTime) {
		if(timeDiffInMilliSecs) {
			return convertTimeToHhs(minProTime) * (sliderWidth/timeDiffInMilliSecs)*ONE_HOUR_IN_MILLI_SECS;
		}else {
			return convertTimeToHhs(minProTime) * 60 * 1.5;
		}
	}
	return 45;
}
/**
 * To add the mouse handler to the box below slider 
 * @param event
 */
function sliderBoxMouseDownHandler(event) {
	startClientX = event.clientX;
	$("#sliderBox")[0].onmousemove = sliderBoxMouseMoveHandler;
}
/**
 * Mouse handler to move the box below slider with mouse
 * and set the change values and slider cursor poisition
 * @param event
 */
function sliderBoxMouseMoveHandler(event) {
	var slider = $("#slider").data("kendoRangeSlider");
	var sliderValues = slider.value();
	if((event.clientX - startClientX) > 0) {
		slider.values(sliderValues[0] + .0167, sliderValues[1] + .0167);
	}else {
		slider.values(sliderValues[0] - .0167, sliderValues[1] - .0167);
	}
	slider.trigger("change");
	startClientX = event.clientX;
}
/**
 * To remove the mouse handler whlie releasing the mouse to prevent box movement
 * @param event
 */
function sliderBoxMouseUpHandler(event) {
	$("#sliderBox")[0].onmousemove = null;
}
/**
 * Handler to set the activity start time from input box
 * @param event
 */
function activityStartHandler(event){
	try {
		//parent.showErrorMsg(EMPTY_STRING);
		if(event.currentTarget.value == EMPTY_STRING) {
			sliderChangeHandler();
		}else {
			var timeInHrs = convertTimeToHhs(convertTimeWithoutColon(event.currentTarget.value));
			var tempTimeInHrs = timeInHrs;
			var sliderMinValue = getSliderMinMaxValues()[0];
			var sliderMaxValue = getSliderMinMaxValues()[1];
			var duration = convertTimeToHhs(convertTimeWithoutColon($("#actDuration").val()));
			if(timeInHrs > sliderMinValue) {
				setSliderFirstValue(timeInHrs, timeInHrs+duration);
			}else {
				while(timeInHrs <= sliderMinValue) {
					timeInHrs = timeInHrs + 24;
				}
				setSliderFirstValue(timeInHrs, timeInHrs+duration);
			}
			if(timeInHrs > getSliderMinMaxValues()[1] && tempTimeInHrs < sliderMinValue) {
				parent.showErrorMsg("Please enter activity start time after start time on scale");
			}else if(timeInHrs+duration > sliderMaxValue) {
				parent.showErrorMsg("Please enter activity start time + activity duration before end time on scale");
			}
			
		}
	}catch (e) {
		console.log(e.message);
	}
}
/**
 * Handler to set the activity end time from input box
 * @param event
 */
function activityEndHandler(event) {
	try {
		//parent.showErrorMsg(EMPTY_STRING);
		if(event.currentTarget.value == EMPTY_STRING) {
			sliderChangeHandler();
		}else {
			var timeInHrs = convertTimeToHhs(convertTimeWithoutColon(event.currentTarget.value));
			var tempTimeInHrs = timeInHrs;
			var sliderFirstValue = getSliderValues()[0];
			if(timeInHrs > sliderFirstValue) {
				setSliderSecondValue(timeInHrs);
			}else {
				while(timeInHrs <= sliderFirstValue) {
					timeInHrs = timeInHrs + 24;
				}
				setSliderSecondValue(timeInHrs);
			}
			if(timeInHrs > getSliderMinMaxValues()[1] && tempTimeInHrs < sliderFirstValue && tempTimeInHrs > getSliderMinMaxValues()[0]) {
				parent.showErrorMsg("Please enter activity end time after start time");
			}else if(timeInHrs > getSliderMinMaxValues()[1]) {
				parent.showErrorMsg("Please enter activity end time before end time on scale");
			}
		}
	}catch (e) {
		console.log(e.message);
	}
}
/**
 * Handler to set the activity duration from input box
 * @param event
 */
function activityDurationHandler(event) {
	try {
		if(event.currentTarget.value == EMPTY_STRING) {
			sliderChangeHandler();
		}else {
			var timeInHrs = convertTimeToHhs(convertTimeWithoutColon(event.currentTarget.value));
			var startTime = getSliderValues()[0];
			setActivityEndValue(timeInHrs + startTime);
			setSliderSecondValue(timeInHrs + startTime);
		}
	}catch (e) {
		console.log(e.message);
	}
}
/**
 * Handler to set the min processing time from input box
 * and also sets the due time verical dashed line
 * @param event
 */
function minProTimeHandler(event) {
	$("#dashedLine").css({
		right: getDashedLinePosition()
	});
	setDueTimeLbl(getSliderValues()[1]);
}
/**
 * To show the due time above due time vertical dashded line
 * @param sliderEndValue
 */
function setDueTimeLbl(sliderEndValue) {
	var dueTime = convertToTimeFormat(sliderEndValue - convertTimeToHhs(getMinProcessingTime()));
	$('#dueTimeLbl').text("Due Time:" + dueTime);
	$('#headerDueTimeLbl').text(dueTime);
}
/**
 * To get the key code for keyboard keys
 * @param keyEvent
 * @returns
 */
function getKeyCode(keyEvent) {
	var evtobj = keyEvent || window.event || event;
	return evtobj.charCode ? evtobj.charCode : evtobj.keyCode;
}
/**
 * To convert the time string in hours
 * use only for text input times - timeStr format (hh:mm)
 * @param timeStr
 * @returns {Number}
 */
function convertTimeToHhs(timeStr) {
	if(timeStr) {
		var timeArray = timeStr.toString().split(":");
		if(timeArray && timeArray.length == 2) {
			return timeArray[0] * 1 + timeArray[1]/60;
		}else if(timeArray.length == 1){
			return timeArray[0]/60 * 1;
		}
	}
}
/**
 * To convert the time string without colon to with colon
 * hhmm format to hh:mm format
 * @param timeStr
 * @returns
 */
function convertTimeWithoutColon(timeStr) {
	if(timeStr && timeStr.indexOf(":") == -1) {
		var strLength = timeStr.toString().length;
		for(var i=0;i<4-strLength; i++) {
			timeStr = "0" + timeStr;
		}
		strLength = timeStr.toString().length;
		var mins = timeStr.substring(strLength - 2, strLength);
		var hrs = timeStr.substring(0, strLength-2);
		
		return hrs + ":" + mins;
	}else {
		var colonIndex = timeStr.indexOf(":");
		for(var i=0;i<2-colonIndex; i++) {
			timeStr = "0" + timeStr;
		}
		strLength = timeStr.length;
		for(var i=0;i<5-strLength; i++) {
			timeStr = timeStr + "0";
		}
	}
	return timeStr;
}
/**
 * To set the activity start time while moving the slider
 * @param timeInHrs
 */
function setActivityStartValue(timeInHrs) {
	if(timeInHrs) {
		$("#actStart").val(convertToTimeFormat(timeInHrs));
		setActivityDuration();
	}
}
/**
 * To set the activity end time while moving the slider
 * @param timeInHrs
 */
function setActivityEndValue(timeInHrs) {
	if(timeInHrs) {
		$("#actEnd").val(convertToTimeFormat(timeInHrs));
		$('#headerAvailTimeLbl').text(convertToTimeFormat(timeInHrs));
		setActivityDuration();
	}
}
/**
 * To set the activity duration while moving the slider
 */
function setActivityDuration() {
	try {
		var startTime = convertTimeToHhs($("#actStart").val());
		var endTime = convertTimeToHhs($("#actEnd").val());
		while(endTime <= startTime) {
			endTime = endTime + 24;
		}
		$("#actDuration").val(convertToTimeFormat(endTime - startTime));
	}catch (e) {
		console.log("Error[" + e.message + "]occured while setting the activity duration");
	}
}
/**
 * Refresh button click handler
 * Call the service and show the mode analyis data
 */
function refreshChartHandler() {
	parent.showErrorMsg(EMPTY_STRING);
	enableDisableRefresh(true);
	setActivityTimeCache();
	callModeAnalysisService(getAllLocationsMap());
}

function setActivityTimeCache() {
	activityTimeCache.hubLoc = $("#hubLocation").val();
	activityTimeCache.hubActy = $("#hubActivity").val();
	activityTimeCache.startTime = $("#actStart").val();
	activityTimeCache.endTime = $("#actEnd").val();
	activityTimeCache.minProTime = $("#minProTime").val();
	$("#originTable tr").each(function(i){
		if(i > 0) {
			x = $(this).children(':first-child');
			if(x.find("input.k-input")) {
				locCd = x.find("input.k-input").val();
			}
			y = x.next();
			if(y.find("input.k-input")) {
				actyCd = y.find("input.k-input").val();
			}
			z = y.next();
			if(z.find("input.k-input")) {
				time = z.find("input.k-input.greenInput").val();
			}
			if(locCd && actyCd && time) {
				activityTimeCache[locCd + "_" + actyCd] = time;
			}
		}
	});
	$("#destinationTable tr").each(function(i){
		if(i > 0) {
			x = $(this).children(':first-child');
			if(x.find("input.k-input")) {
				time = x.find("input.k-input.greenInput").val();
			}
			y = x.next();
			if(y.find("input.k-input")) {
				locCd = y.find("input.k-input").val();
			}
			z = y.next();
			if(z.find("input.k-input")) {
				actyCd = z.find("input.k-input").val();
			}
			if(locCd && actyCd && time) {
				activityTimeCache[locCd + "_" + actyCd] = time;
			}
		}
	});
}
/**
 * To get the list of all the locations, activities added for analysis
 * @returns {Array}
 */
function getAllLocationsMap() {
	var locationsMap = [];
	if(locationMapCache == null) {
		locationsMap["origins"] = getFirstColumnTableValuesArray("originTable");
		locationsMap["hub"] = {Location : $("#hubLocation").data("kendoAutoComplete").value()};
		locationsMap["destinations"] = getFirstColumnTableValuesArray("destinationTable");
		locationMapCache = clone(locationsMap);
	}else{
		return locationMapCache;
	}
	return locationsMap;
}
/**
 * Mode analysis service handler
 * @param locationsMap
 */
function callModeAnalysisService(locationsMap) {
	var serviceUrl = MODE_ANALYSIS_SERVICE_DATA_URL + "ModeAnalysisRequest";
	var paramsMap;
	
	var originLocs = JSON.stringify(locationsMap["origins"], replacer);
	var hubLocs = JSON.stringify(locationsMap["hub"], replacer);
	var destinationsLocs = JSON.stringify(locationsMap["destinations"], replacer);
	
	paramsMap ={
			"browserSessionId":parent.getBrowserSessionId(),
			"commonCaseId":parent.getCommonCaseId(),
			"effDayPatternStr": parent.getSelectedEffDayStrPattern(),
			"originLocs" : originLocs,
			"hubLocs" : hubLocs,
			"destinationsLocs" : destinationsLocs,
			"isZulu" : isZulu,
			"zuluToLocalOffset" : getZuluToLocalOffset(),
			"flightSpeed" : $('#flight').val(),
			"truckSpeed" : $('#truck').val(),
			"isDistanceInKms" : parent.isDistanceInKms(),
			"availTimeOffset" : convertTimeToHhs($('#availableTime').val()),
			"dueTimeOffset" : convertTimeToHhs($('#dueTime').val()),
			"zuluMidNightOrigin" : $('#originToActivity').val(),
			"zuluMidNightDest" : $('#activityToDest').val()
		};
	if(paramsMap) {
		parent.showProgressDialog(true, "Waiting for results...");
		
		callService({
			url : serviceUrl,
			paramsMap: paramsMap,
			successCallback : onModeServiceRequestSuccess, 
			failureCallback : onModeServiceRequestFailure,
			showProgressWindow : false
		  });		
	}
}
/**
 * Mode analysis service success handler
 * Adds the response data to the chart
 * @param response
 * @param io
 */
function onModeServiceRequestSuccess(response, io) {
	parent.showProgressDialog(false);
	if(response && response._errorCd && response._errorCd > 0) {
		parent.showErrorMsg(response._errorDesc);
	} else {
		clearTablesChartAndSlider();
		addMapLocationsTables(response, io);
		setGanttDivHeight();
		addGanttchart(response);
		setTimeout(function() {
			updateTimeTextForLocationsTables(response, io);
			applyFilterConstraints($("input:radio[name='originDisplay']:checked")[0]);
			applyFilterConstraints($("input:radio[name='destinationsDisplay']:checked")[0]);
		},1000);
	}
}
/**
 * Mode analysis service failure handler
 * @param response
 * @param io
 */
function onModeServiceRequestFailure(response, io){
	parent.onServiceRequestFailure(response, io);
}
/**
 * Creates the instance of gantChartDiagram class and
 * plots gantt chart on the dashboard, sets the slider, activity times
 * based in min avail time and max due time
 * @param response
 */
function addGanttchart(response) {
	applyButtonDisplaySetting();
	if(!ganttChartDiagram) {
		//initilize gantt chart diagram for first time
		ganttChartDiagram = new GanttChartDiagram("ganttChart", activitiesDetailMap);
	}
	//calculate the min available time from the origins activities in response
	var minAvailTimeAct = getMinAvailTime(response);
	var minAvailTime = minAvailTimeAct.activityAvailTime; 
	//calculate the max due time from the destination activities in response
	var maxDueTimeAct = getMaxDueTime(response);
	var maxDueTime = maxDueTimeAct.activityDueTime;
	//max due time is less then min avail time add 24 hrs to time diff, as destination time crossed mide night 
	if(maxDueTime > minAvailTime) {
		timeDiffInMilliSecs = maxDueTime - minAvailTime;
	}else {
		timeDiffInMilliSecs = maxDueTime - minAvailTime + 24 * ONE_HOUR_IN_MILLI_SECS;
	}
	//adds the gojs gantt chart on UI
	ganttChartDiagram.addGanttChart(response, minAvailTime, maxDueTime, timeDiffInMilliSecs);
	//calculate origin act max air time to show the slider due time line at the end of this bar 
	var originsActivityMaxAirEndTime = getOriginsActivityMaxAirEndTime(ganttChartDiagram.nodesArray);
	//set the slider values according to reponse
	setSliderMinMaxValues(minAvailTime, maxDueTime, timeDiffInMilliSecs, originsActivityMaxAirEndTime, minAvailTimeAct.serverTime, maxDueTime.serverTime);
	//hide/unhide the gantt chart bars according to slider times and due time
	ganttChartDiagram.refreshGanttChart(getSliderValues(), getSliderMinMaxValues(), timeDiffInMilliSecs, getMinProcessingTime(), getBtnMap());
	//to apply the favorites data
	if(favStartTime && favEndTime) {
		$("#actStart").val(favStartTime);
		$("#actEnd").val(favEndTime);
		setSliderFirstValue(convertTimeToHhs(favStartTime));
		setSliderSecondValue(convertTimeToHhs(favEndTime));
		favStartTime = null;
		favEndTime = null;
	}
	if(activityTimeCache.hubLoc == $("#hubLocation").val() && activityTimeCache.hubActy == $("#hubActivity").val()) {
		if(activityTimeCache.startTime && activityTimeCache.endTime) {
			$("#actStart").val(activityTimeCache.startTime);
			$("#actEnd").val(activityTimeCache.endTime);
			setSliderFirstValue(convertTimeToHhs(activityTimeCache.startTime));
			setSliderSecondValue(convertTimeToHhs(activityTimeCache.endTime));
		}
	}
}
/**
 * To create the autocompletes for locations and activities
 * @param element
 * @param dataTextField
 * @param sourceData
 * @param template
 * @returns
 */
function createKendoAutoComplete(element, dataTextField, sourceData, template) {
	var autoComplete = element.kendoAutoComplete({
		dataTextField: dataTextField,
		placeholder: EMPTY_STRING,
		filter: FILTER_TYPE_STARTS_WITH,
		dataSource: typeof sourceData.data == "function" ? sourceData.data().toJSON(): sourceData,
		template : template,
		change: autoCompleteChangehandler
	});
	if(autoComplete[0].name == "#originTable_location" || autoComplete[0].name == "#destinationTable_location" || autoComplete[0].id == "hubLocation") {
		autoComplete[0].onblur = function(event){
			autoCompleteBlurHandler(event, autoComplete);
		};
	}
	autoComplete[0].onkeyup = function(event){
		autoCompleteKeyUpHandler(event, autoComplete);
	};
	if(isActivityAutoComplete(autoComplete)) {
		autoComplete[0].onfocus = function(event) {
			setTimeout(function(){
				showAutoCompleteDropDown(autoComplete);
			},150);
		};
		autoComplete[0].onkeydown = function(event) {
			checkCheckBox(autoComplete[0].id);
		};
	}
	
	return autoComplete;
}
/**
 * To check whether autocomplete is activity dropdown 
 * @param autoComplete
 * @returns {Boolean}
 */
function isActivityAutoComplete(autoComplete) {
	if(autoComplete[0].id == "modeOrigins" || autoComplete[0].id == "modeDestinations" || autoComplete[0].id == "hubActivity" ||
			autoComplete[0].id == "originActivity" || autoComplete[0].id == "destinationActivity" ||
			autoComplete[0].name == "#originTable_activity" || autoComplete[0].name == "#destinationTable_activity") {
		return true;
	}
	return false;
}
/**
 * To open the autocomplete popup on focus
 * @param autoComplete
 */
function showAutoCompleteDropDown(autoComplete) {
	var selValue = EMPTY_STRING;
	var fieldValue = EMPTY_STRING;
	if(autoComplete.data('kendoAutoComplete').options != null && autoComplete.data('kendoAutoComplete').options.dataTextField != undefined){
		fieldValue = autoComplete.data('kendoAutoComplete').options.dataTextField;
	}
	if(autoComplete != null && autoComplete.val() != null && autoComplete.val() != EMPTY_STRING){
		selValue = (autoComplete.val()).toLowerCase();
		autoComplete.data("kendoAutoComplete").dataSource.filter({field:fieldValue,operator: "startswith", value: selValue});
	}else{
		autoComplete.data("kendoAutoComplete").dataSource.filter({field:fieldValue,operator: "startswith", value: selValue});
	}
	autoComplete.data("kendoAutoComplete").popup.open();
}
/**
 * To check the checkboxes automatically on entering the values in O/D's to include country/activity
 * @param id
 */
function checkCheckBox(id) {
	if(id == "originActivity"){
		$("#originActivityCheckBox")[0].checked = true;
	}else if(id == "destinationActivity") {
		$("#destinationActivityCheckBox")[0].checked = true;
	}else if(id == "modeOrigins") {
		$("#showOrigins")[0].checked = true;
	}else if(id == "modeDestinations"){
		$("#showDestinations")[0].checked = true;
	}
}
/**
 * All country/location/activity autocomplete change handler
 * @param event
 */
function autoCompleteChangehandler(event) {
	if(event.sender.element[0].id == "originActivity"){
		$("#originActivityCheckBox")[0].checked = true;
		showOriginAlert = true;
	}else if(event.sender.element[0].id == "destinationActivity") {
		$("#destinationActivityCheckBox")[0].checked = true;
		showDestinationAlert = true;
	}else if(event.sender.element[0].name == "#originTable_activity") {
		addDestinationLocation(event.sender.element);
		showOriginAlert = true;
	}else if(event.sender.element[0].name == "#originTable_location") {
		showOriginAlert = true;
	}else if(event.sender.element[0].name == "#destinationTable_activity") {
		showDestinationAlert = true;
	}else if(event.sender.element[0].name == "#destinationTable_location") {
		showDestinationAlert = true;
	}else if(event.sender.element[0].id == "modeOrigins") {
		$("#showOrigins")[0].checked = true;
		showOriginAlert = true;
		invokeDataSource(event.sender.element[0].id, $(event.sender.element).data("kendoAutoComplete").value());
	}else if(event.sender.element[0].id == "modeDestinations"){
		$("#showDestinations")[0].checked = true;
		showDestinationAlert = true;
		invokeDataSource(event.sender.element[0].id, $(event.sender.element).data("kendoAutoComplete").value());
	}else if(event.sender.element[0].id == "hubLocation"){
		locationMapCache = null;
	}
}
/**
 * To add the same destination loc as origin loc and destination activity AM* on adding PM* as origin activity automatically  
 * @param actAutoComplete
 */
function addDestinationLocation(actAutoComplete) {
	try{
		if(actAutoComplete.val().indexOf("PM") == 0) {
			var location = actAutoComplete.parent().parent().parent().children(":first").find("input").val();
			if(location) {
				var rowIndex = actAutoComplete.parent().parent().parent().index();
				var destActivity = actAutoComplete.val().replace("PM", "AM");
				var destinationTR = $('#destinationTable tr').eq(rowIndex);
				destinationTR.children(":first").next().find("input").val(location);
				var destActAutoComplete = destinationTR.children(":first").next().next().find("input").data("kendoAutoComplete");
				if(destActAutoComplete && destActAutoComplete.dataSource.transport.data) {
					if($.inArray(destActivity, destActAutoComplete.dataSource.transport.data) > -1){
						destActAutoComplete.value(destActivity);
					}
				}
			}
		}
	}catch (e) {
		console.log(e.message);
	}
}
/**
 * Location autocomplete focus out handler
 * To change the list of activites based on location entered
 * @param evt
 * @param element
 */
function autoCompleteBlurHandler(evt, element) {
	try{
		var activityAutoComplete = element.parent().parent().next().find("input.k-input").data("kendoAutoComplete");
		if(activityAutoComplete && element[0].value) {
			if(activitiesMapByLoc[element[0].value]){
				activityAutoComplete.setDataSource(new kendo.data.DataSource({data : activitiesMapByLoc[element[0].value]}));
			}else{
				activityAutoComplete.setDataSource(new kendo.data.DataSource({data : {}}));
			}
			//activityAutoComplete.value(EMPTY_STRING);
			//activityAutoComplete.trigger("change");
		}
		setTimeout(function(){
			if(activityAutoComplete != null && activityAutoComplete.element != null && $(activityAutoComplete.element).is(':focus')){
				showAutoCompleteDropDown(activityAutoComplete.element);
			}
		},200);
	}catch (e) {
		console.log(e.message);
	}
}
/**
 * Location/activity autocomplete key up handler
 * To validate and filter the data
 * @param evt
 * @param element
 */
function autoCompleteKeyUpHandler(evt, element) {
	var evtobj = evt || window.event || event;
	var unicode = evtobj.charCode ? evtobj.charCode : evtobj.keyCode;
	//var actualkey = String.fromCharCode(unicode);
	var kendoAutoComplete = element.data("kendoAutoComplete");
	if(element && element[0] && element[0].value){
		element[0].value = kendoAutoComplete.value().toUpperCase();
	}
	if(kendoAutoComplete) {
		if(unicode == 40 && kendoAutoComplete.ul.children() && kendoAutoComplete.ul.children().length == 0){
			showAutoCompleteDropDown(element);
		}else if(unicode != 37 && unicode != 38 && unicode != 39 && unicode != 40 && kendoAutoComplete.value() != EMPTY_STRING){
			kendoAutoComplete.search(kendoAutoComplete.value()); 
			kendoAutoComplete.refresh();
			var listChildren = kendoAutoComplete.ul.children();
			var inputText = element[0].value.substring(0, element[0].value.length - 1);
			if(listChildren.length == 1 && unicode != 8 && unicode != 9 && unicode != 13 && unicode != 16 && unicode != 46){
				setTimeout(function(){
					if(listChildren[0] && unicode != 8 && unicode != 9 && unicode != 13 && unicode != 16 && unicode != 46){
						kendoAutoComplete.select(listChildren[0]);
						//kendoAutoComplete.trigger("change");
						kendoAutoComplete.close();
						element.blur();
						moveCursorToNextTabInput(element);
					}
				},100);
			}else if(listChildren.length == 0) {
				kendoAutoComplete.value(inputText);
			}
		}else if(isActivityAutoComplete(element) && unicode == 8 && element.val() == EMPTY_STRING) {
			setTimeout(function(){
				showAutoCompleteDropDown(element);
			},250);
		}
	}
}
/**
 * To move the cursor to next input on selecting the loc/act value 
 * @param element
 */
function moveCursorToNextTabInput(element) {
	var tabables = $("*[tabindex != '-1']:visible");
	var index = tabables.index(element);
	var nextElement = tabables.eq(++index);
	//var preElementValue = element[0].value;
	while(nextElement[0]){
		if(nextElement[0].tagName == "INPUT" && nextElement[0].type == "text") {
			nextElement.focus();
			break;
		}else{
			nextElement = tabables.eq(index++);
		}
	}
}
/**
 * To add the empty row to origin/destination table on click of plus sign
 * and set the default loc/act if available
 * @param id
 * @param defaultLoc
 * @param defaultAct
 */
function addRowToTable(id, defaultLoc, defaultAct) {
	var row = $('<tr></tr>').appendTo($(id));
	var td1 = $('<td></td>').appendTo(row);
	//if(defaultLoc != undefined && defaultAct  != undefined){
		var input1 = $('<input name="' + id + '_location" style="width:45px"/>').appendTo(td1);
		var autoComplete;
		if($("#showOrigins").is(":checked") && id == "#originTable") {
			autoComplete = createKendoAutoComplete(input1, EMPTY_STRING, locationsMap["modeOrigins"]);
		}else if($("#showDestinations").is(":checked") && id == "#destinationTable") {
			autoComplete = createKendoAutoComplete(input1, EMPTY_STRING, locationsMap["modeDestinations"]);
		}else {
			autoComplete = createKendoAutoComplete(input1, LOCCD, getDataSources("Locations"));
		}
		if(defaultLoc) {
			autoComplete.data("kendoAutoComplete").value(defaultLoc);
		}
		var td2 = $('<td></td>').appendTo(row);
		var input2 = $('<input name="' + id + '_activity" style="width:45px"/>').appendTo(td2);
		autoComplete = createKendoAutoComplete(input2, EMPTY_STRING, getDataSources("Activities"));
		autoCompleteBlurHandler("", input1);
		var actAutoComplete = autoComplete.data("kendoAutoComplete");
		if(defaultAct && actAutoComplete.dataSource.transport.data) {
			if($.inArray(defaultAct, actAutoComplete.dataSource.transport.data) > -1){
				actAutoComplete.value(defaultAct);
			}
		}else{
			actAutoComplete.value(EMPTY_STRING);
		}
		var td3 = $('<td></td>');
		input3 = $("<input style='width:40px; padding-left:3px' onkeypress='popUpInputKeyPressHandler(event)' onblur='timeblurHandler(event)'" +
				"maxlength='5'  placeholder='hh:mm' class='k-input timeInput'/>").appendTo(td3);
		input3.css({"display" : "inline-table"});
		if(id == "#originTable") {
			td3.appendTo(row);
		}else{
			row.prepend(td3);
		}
	/*}else{
		$('<td></td>').appendTo(row);
		$('<td></td>').appendTo(row);
	}*/	
}

function getOriginCachedTime(input) {
	var tr = $(input).parent().parent();
	var locCd, actyCd;
	var x = tr.children(':first-child');
	if(x.find("input.k-input")) {
		locCd = x.find("input.k-input").val();
	}
	var y = x.next();
	if(y.find("input.k-input")) {
		actyCd = y.find("input.k-input").val();
	}
	if(locCd && actyCd && activityTimeCache[locCd + "_" + actyCd]) {
		return activityTimeCache[locCd + "_" + actyCd];
	}
	return null;
}

function getDestCachedTime(input) {
	var tr = $(input).parent().parent();
	var locCd, actyCd;
	var x = tr.children(':first-child');
	var y = x.next();
	if(y.find("input.k-input")) {
		locCd = y.find("input.k-input").val();
	}
	var z = y.next();
	if(z.find("input.k-input")) {
		actyCd = z.find("input.k-input").val();
	}
	if(locCd && actyCd && activityTimeCache[locCd + "_" + actyCd]) {
		return activityTimeCache[locCd + "_" + actyCd];
	}
	return null;
}

/**
 * Activity time handler
 * to open the pop-up input box on clicking the clock icon on O/D's side
 * also shows the activity time in the input box by default
 * @param event
 */
function activityTimeHandler(input,id) {
	try {
		var index = $(input).parent().parent().index();
		var tempTime;
		if(id == "#originTable") {
			if($("#originTimeCheckBox")[0].checked && $('#originTime').val()) {
				activityTime = $('#originTime').val();
			}else {
				if(ganttChartDiagram && ganttChartDiagram.nodesArray) {
					currentChartNode = $.grep(ganttChartDiagram.nodesArray, function(e){ return e.key == "leftFlight"+index; });
				}
				if(currentChartNode && currentChartNode.length > 0) {
					activityTime = currentChartNode[0].serverTime;
				}else{
					activityTime = null;
				}
				if(activityTimeCache) {
					tempTime = getOriginCachedTime(input);
				}
			}
		}else {
			if($("#destinationTimeCheckBox")[0].checked && $('#destinationTime').val()) {
				activityTime = $('#destinationTime').val();
			}else {
				if(ganttChartDiagram && ganttChartDiagram.nodesArray) {
					currentChartNode = $.grep(ganttChartDiagram.nodesArray, function(e){ return e.key == "rightFlight"+index; });
				}
				if(currentChartNode && currentChartNode.length > 0) {
					activityTime = currentChartNode[0].serverTime;
				}else{
					activityTime = null;
				}
				if(activityTimeCache) {
					tempTime = getDestCachedTime(input);
				}
			}
		}
		if(!(input && input.length > 0)){
			input.actualActivityTime = activityTime;
		}
		$(input).val(activityTime);
		if(!input.actualActivityTime) {
			input.actualActivityTime = activityTime;
		}
		if(tempTime) {
			$(input).val(tempTime);
			$(input).focus();
			$("#hubLocation").focus();
		}
	}catch (e) {
		console.log(e.message);
	}
}
/**
 * To change and apply the activity time on hitting enter and closes the pop-up  
 * @param event
 */
function popUpInputKeyPressHandler(event) {
	try {
		if(getKeyCode(event) == 13 || event.type == "blur") {
			//$(event.currentTarget).hide();
			var newActivityTime;
			if(ganttChartDiagram && $(event.currentTarget).val() != null && $(event.currentTarget).val() != EMPTY_STRING) {
				var index = $(event.currentTarget).parent().parent().index();
				newActivityTime = convertTimeToHhs(convertTimeWithoutColon($(event.currentTarget).val()));
				if($(event.currentTarget).parent().parent().parent().parent().attr('id') == "originTable") {
					ganttChartDiagram.applyActivityTime(newActivityTime, getSliderValues(), getSliderMinMaxValues(), timeDiffInMilliSecs, getMinProcessingTime(), getBtnMap(), "left", index);
				}else {
					ganttChartDiagram.applyActivityTime(newActivityTime, getSliderValues(), getSliderMinMaxValues(), timeDiffInMilliSecs, getMinProcessingTime(), getBtnMap(), "right", index);
				}
			}
			if(event.currentTarget.actualActivityTime && (newActivityTime != convertTimeToHhs(convertTimeWithoutColon(event.currentTarget.actualActivityTime)))) {
				$(event.currentTarget).parent().find('.timeInput').removeClass("blueInput");
				$(event.currentTarget).parent().find('.timeInput').addClass("greenInput");
			}else {
				$(event.currentTarget).parent().find('.timeInput').removeClass("greenInput");
				$(event.currentTarget).parent().find('.timeInput').addClass("blueInput");
			}
		}
	}catch (e) {
		console.log(e.message);
	}
}

/**
 * To close the pop-up input box on focus out
 * @param event
 */
function timeblurHandler(event,formatTimeOnly) {
	var value = $(event.currentTarget).val();
	parent.showErrorMsg(EMPTY_STRING);
	if(value != null && value != EMPTY_STRING){
		value = convertTimeWithoutColon(value);
		$(event.currentTarget).val(value);
		if(!validateTimeWithOrWithoutColon(event)) {
			$(event.currentTarget).val(EMPTY_STRING);
			parent.showErrorMsg("Please enter the valid time");
		}else{
			if(!formatTimeOnly){
					popUpInputKeyPressHandler(event);	
			}else{
				if((event.currentTarget.id).indexOf('Origin') >= 0){
					applyFilterConstraints($("input:radio[name='originDisplay']:checked")[0]);
				}else{
					applyFilterConstraints($("input:radio[name='destinationsDisplay']:checked")[0]);
				}	
			}
		}	
	}else if(formatTimeOnly){
		applyFilterConstraints($("input:radio[name='originDisplay']:checked")[0]);
		applyFilterConstraints($("input:radio[name='destinationsDisplay']:checked")[0]);
	}	
}
/**
 * To check the time checkbox on entering the time in input box in O/D's to include
 * @param event
 */
function locTimeKeyPressHandler(event) {
	if($(event.currentTarget).attr('id') == "originTime") {
		$("#originTimeCheckBox")[0].checked = true;
	}else {
		$("#destinationTimeCheckBox")[0].checked = true;
	}
}
/**
 * To add plus/minus sign icons for adding/removing rows
 * @param id
 */
function addRowToAddDeleteTable(id) {
	var row = $('<tr></tr>');
	var td = $('<td></td>').appendTo(row);
	var anchor = $('<a onclick="addRemoveRowClickHandler(event)" class="k-window-action iconbtn" href="#!"></a>').appendTo(td);
	$('<span class="k-icon delete-row" style="height: 16px;width: 16px;"></span>').appendTo(anchor);
	$(id).prepend(row);
}
/**
 * To delete the row from table by table id and row index
 * @param tableId
 * @param rowIndex
 */
function deleteRowFromTable(tableId, rowIndex) {
	($('#' + tableId + ' tbody tr:eq(' + rowIndex  +')')).remove();
}
/**
 * To add new row on clicking of plus icon
 * @param tableId
 */
function cloneLastRowAndAddToTable(tableId) {
	var table = $("#"+tableId);
	$(table).append(table.find('tr:last').clone(true));
}
/**
 * Plus/Minus sign icon click handlers to add/remove the row
 * @param event
 * @param element
 */
function addRemoveRowClickHandler(event, element) {
	if($(event.currentTarget).find(".add-row").length > 0) {
		addRowToTable('#originTable');
		addRowToTable('#destinationTable');
		cloneLastRowAndAddToTable("addRemoveRowTable");
		$(event.currentTarget).find(".add-row")[0].className = "k-icon delete-row";
		var elem = $("#lowerDiv")[0];
		elem.scrollTop = elem.scrollHeight;
		//window.scrollTo(0, document.body.scrollHeight);
	}else {
		var rowIndex = $(event.currentTarget).parents('tr').index();
		deleteRowFromTable("originTable", rowIndex + 1);
		deleteRowFromTable("destinationTable", rowIndex + 1);
		deleteRowFromTable("addRemoveRowTable", rowIndex);
		setGanttDivHeight();
		createSlider(getSliderCurrentOptions());
		if(ganttChartDiagram) {
			ganttChartDiagram.deleteRow(rowIndex + 1);
		}
	}
	showOriginAlert = true;
	showDestinationAlert = true;
}
/**
 * To get the list of all the origin/destination locs, acts, available, due times for analysis
 * @param tableId
 * @returns {Array}
 */
function getFirstColumnTableValuesArray(tableId) {
	var values = new Array();
	$('#'+tableId+' tr').each(function(i) {
		var locCd,actyCd, availTimeL, dueTimeL, availTimeZ, dueTimeZ;
		if(i > 0) {
			if($(this).parent().parent().attr("id") == "originTable") {
				x = $(this).children(':first-child');
			}else {
				x = $(this).children(':first-child').next();
			}
			if(x.find("input.k-input").data("kendoAutoComplete")) {
				locCd = x.find("input.k-input").data("kendoAutoComplete").value();
			}
			y = x.next();
			if(y.find("input.k-input").data("kendoAutoComplete")) {
				actyCd = y.find("input.k-input").data("kendoAutoComplete").value();
			}
			if(locCd && actyCd && activitiesDetailMap[locCd+"_"+actyCd]) {
				availTimeL = convertToFullTimeFormat((convertLocalToZuluInSecs(activitiesDetailMap[locCd+"_"+actyCd].availTimeL)));
				dueTimeL = convertToFullTimeFormat((convertLocalToZuluInSecs(activitiesDetailMap[locCd+"_"+actyCd].dueTimeL)));
				availTimeZ =  activitiesDetailMap[locCd+"_"+actyCd].availTimeZ;
				availTimeZ = availTimeZ == null ? availTimeL : availTimeZ;
				dueTimeZ = activitiesDetailMap[locCd+"_"+actyCd].dueTimeZ;
				dueTimeZ = dueTimeZ == null ? dueTimeL : dueTimeZ;
				values.push({Location : locCd, Activity:actyCd, RowIndex:$(this).index(), AvailTimeL:availTimeL, AvailTimeZ:availTimeZ, DueTimeL:dueTimeL, DueTimeZ:dueTimeZ});
			}else if(locCd && !actyCd && $(this).parent().parent().attr("id") == "originTable" && $("#originTimeCheckBox")[0].checked) {
				availTimeL = getValueInTimeFormat($('#originTime').val());
				dueTimeL = getValueInTimeFormat($('#destinationTime').val());
				availTimeZ = getValueInTimeFormat($('#originTime').val());
				dueTimeZ = getValueInTimeFormat($('#destinationTime').val());
				values.push({Location : locCd, Activity:actyCd, RowIndex:$(this).index(), AvailTimeL:availTimeL, AvailTimeZ:availTimeZ, DueTimeL:dueTimeL, DueTimeZ:dueTimeZ});
			}else if(locCd && !actyCd && $(this).parent().parent().attr("id") == "destinationTable" && $("#destinationTimeCheckBox")[0].checked) {
				availTimeL = getValueInTimeFormat($('#originTime').val());
				dueTimeL = getValueInTimeFormat($('#destinationTime').val());
				availTimeZ = getValueInTimeFormat($('#originTime').val());
				dueTimeZ = getValueInTimeFormat($('#destinationTime').val());
				values.push({Location : locCd, Activity:actyCd, RowIndex:$(this).index(), AvailTimeL:availTimeL, AvailTimeZ:availTimeZ, DueTimeL:dueTimeL, DueTimeZ:dueTimeZ});
			}
		}
	});
	return values;
}
/**
 * To check whether any loc/act entered in the dashbaord
 * @param tableId
 * @returns {Boolean}
 */
function checkTableData(tableId) {
	var flag = false;
	$('#'+tableId+' tr').each(function(i) {
		var locCd,actyCd;
		if(i > 0) {
			if($(this).parent().parent().attr("id") == "originTable") {
				x = $(this).children(':first-child');
			}else {
				x = $(this).children(':first-child').next();
			}
			if(x.find("input.k-input").data("kendoAutoComplete")) {
				locCd = x.find("input.k-input").data("kendoAutoComplete").value();
			}
			y = x.next();
			if(y.find("input.k-input").data("kendoAutoComplete")) {
				actyCd = y.find("input.k-input").data("kendoAutoComplete").value();
			}
			if(locCd || actyCd) {
				flag = true;
				return;
			}
		}
	});
	return flag;
}
/**
 * To convert the time string in service to hh:mm format
 * @param value
 * @returns {String}
 */
function getValueInTimeFormat(value) {
	if(value) {
		var valueArray = value.toString().split(":");
		if(valueArray && valueArray.length == 2) {
			if(!valueArray[0]){
				value = "00" + value;
			}
			return value + ":00";
		}else if(valueArray && valueArray.length == 1) {
			return "00:" + value + ":00";
		}
	}
}
/**
 * To change the datasource of locations autocomplete on changing the country
 * @param tableId
 * @param dataSource
 * @param dataTextField
 */
function refreshLocsDataSource(tableId, dataSource, dataTextField) {
	$('#'+tableId+' tr').each(function(i) {
		if(i > 0) {
			try {
				if($(this).parent().parent().attr("id") == "originTable") {
					x = $(this).children(':first-child');
				}else {
					x = $(this).children(':first-child').next();
				}
				if(x.find("input.k-input").data("kendoAutoComplete")) {
					x.find("input.k-input").data("kendoAutoComplete").setOptions({dataTextField:dataTextField});
					x.find("input.k-input").data("kendoAutoComplete").setDataSource(dataSource.data());
				}
			}catch (e) {
			}
		}
	});
}
/**
 * To get the max of all the origin activities flight times
 * @param nodesArray
 * @returns
 */
function getOriginsActivityMaxAirEndTime(nodesArray) {
	if(nodesArray && nodesArray.length > 0) {
		var endTimeArray = new Array();
		for(var i=0; i<nodesArray.length; i++) {
			if(nodesArray[i].mode == "F" && nodesArray[i].direction =="I" && nodesArray[i].visible){
				endTimeArray.push(nodesArray[i].activityAvailTime + nodesArray[i].activityAirTime);
			}
		}
		Array.max = function(array){
			return Math.max.apply(Math, array);
		};
		if(endTimeArray.length > 0) {
			return Array.max(endTimeArray);
		}
	}
	return 0;
}
/**
 * To get the minimum of origin activities avaiable time
 */
function getMinAvailTime(response){
	if(response){
		var availTimeArray = new Array();
		var minTime;
		for(var i=0;i<response.length;i++){
			if(response[i].activityAvailTime && (response[i].isOrigin == true || response[i].isOrigin == "true")) {
				availTimeArray.push(response[i].activityAvailTime);
			}
		}
		Array.min = function(array){
			return Math.min.apply(Math, array);
		};
		if(availTimeArray.length > 0) {
			minTime = Array.min(availTimeArray);
		}
		var minAvailTimeAct = $.grep(response, function(e){ return e.activityAvailTime == minTime; });
		if(minAvailTimeAct && minAvailTimeAct.length > 0) {
			return minAvailTimeAct[0];
		}
	}
	return {activityAvailTime:0, serverTime:"00:00"};
}
/**
 * To get the maximum of destination activities due time 
 * @param response
 * @returns
 */
function getMaxDueTime(response){
	if(response){
		var dueTimeArray = new Array();
		var minTime;
		for(var i=0;i<response.length;i++){
			if(response[i].activityDueTime && (response[i].isOrigin == false || response[i].isOrigin == "false")) {
				dueTimeArray.push(response[i].activityDueTime);
			}
		}
		Array.max = function(array){
			return Math.max.apply(Math, array);
		};
		if(dueTimeArray.length > 0) {
			minTime = Array.max(dueTimeArray);
		}
		var minDueTimeAct = $.grep(response, function(e){ return e.activityDueTime == minTime; });
		if(minDueTimeAct && minDueTimeAct.length > 0) {
			return minDueTimeAct[0];
		}
	}
	return {activityDueTime:0, serverTime:"00:00"};
}
/**
 * To convert the activity time string in seconds
 * @param time
 * @returns {Number}
 */
function getTimeInSeconds(time) {
	if(time){
		var tempTime;
		if(time.toString().indexOf("+") > -1) {
			tempTime = time.toString().replace("Z", "").split("+");
		}else {
			tempTime = time.toString().replace("Z", "").split("-");
		}
		var timeInSec = 0;
		if(tempTime.length > 0){
			var subTime = tempTime[0].toString().split(":");
			if(subTime && subTime.length == 3){
				timeInSec = subTime[0] * 3600 + subTime[1] * 60 + subTime[2] * 1;
			}else if(subTime && subTime.length == 2){
				timeInSec = subTime[0] * 60 + subTime[1] * 1;
			}else if(subTime && subTime.length == 1){
				timeInSec = subTime[0] * 1;
			}
		}
	}
	return timeInSec;
}
/**
 * To convert the local time in activity to zulu time in seconds
 * @param time
 * @returns
 */
function convertLocalToZuluInSecs(time) {
	if(time){
		var isAdd = true;
		var tempTime;
		if(time.toString().indexOf("+") > -1) {
			tempTime = time.toString().replace("Z", "").split("+");
			isAdd = false;
		}else {
			tempTime = time.toString().replace("Z", "").split("-");
			isAdd = true;
		}
		var timeInSec = 0;
		var timeZoneDiff;
		if(tempTime.length > 0){
			var subTime = tempTime[0].toString().split(":");
			if(subTime && subTime.length == 3){
				timeInSec = subTime[0] * 3600 + subTime[1] * 60 + subTime[2] * 1;
			}else if(subTime && subTime.length == 2){
				timeInSec = subTime[0] * 60 + subTime[1] * 1;
			}else if(subTime && subTime.length == 1){
				timeInSec = subTime[0] * 1;
			}
		}
		if(tempTime.length > 1){
			var subTime = tempTime[1].toString().split(":");
			if(subTime && subTime.length == 2){
				timeZoneDiff = (subTime[0] * 1) * 3600 + subTime[1] * 60;
			}else if(subTime && subTime.length == 1) {
				timeZoneDiff = (subTime[0] * 1) * 3600;
			}
		}
		if(timeInSec && timeZoneDiff && isAdd){
			return timeInSec + timeZoneDiff;
		}else if(timeInSec && timeZoneDiff && !isAdd){
			return timeInSec - timeZoneDiff;
		}else if(timeInSec){
			return timeInSec;
		}
	}
	return timeInSec;
}
/**
 * To convert the hours to time string hh:mm
 * @param hours
 * @returns
 */
function convertToTimeFormat(hours) {
	var time = Math.ceil(Number(hours) * 3600);
	var h = Math.floor(time / 3600);
	var m = time % 3600 / 60;
	if((m % 1) > .9) {
		m = Math.ceil(m);
	}else {
		m = Math.floor(m);
	}
	return ((h > 0 ? getHours(h) + ":" : "00:") + (m > 0 ? (h >= 0 && m < 10 ? "0" : EMPTY_STRING) + m + EMPTY_STRING : "00"));
}
/**
 * To convert the hours to correct format if hr >= 24
 * @param hours
 * @returns
 */
function getHours(hours) {
	var i = 1;
	while(hours >= 24) {
		hours = hours % (24*i);
		i++;
	}
	if(hours < 10) {
		hours = "0" + hours;
	}
	return hours;
}
/**
 * To convert the seconds in time string hh:mm:ss
 * @param seconds
 * @returns
 */
function convertToFullTimeFormat(seconds) {
	var h = Math.floor(seconds / 3600);
	var m = Math.floor(seconds % 3600 / 60);
	var s = Math.floor(seconds % 3600 / 3600);
	
	return ((h > 0 ? (h >= 24 ? h % 24 : h) + ":" : "00:") + (m > 0 ? (h >= 0 && m < 10 ? "0" : EMPTY_STRING) + m + ":" : "00:") + (s > 0 ? (m >= 0 && s < 10 ? "0" :  EMPTY_STRING) + s : "00"));
}

/**
 * To convert the seconds in time string hh:mm
 * @param seconds
 * @returns
 */
function convertToHHMMTimeFormat(seconds) {
	var h = Math.floor(seconds / 3600);
	var m = Math.floor(seconds % 3600 / 60);	
	
	return ((h > 0 ? (h >= 24 ? h % 24 : h) + ":" : "00:") + (m > 0 ? (h >= 0 && m < 10 ? "0" : EMPTY_STRING) + m + "" : "00") );
}

/**
 * To get the hub location entered in hub input box
 * @returns
 */
function getSortLocation() {
	return $("#hubLocation").data("kendoAutoComplete").value();
}
/**
 * To show the mode analysis data on map on clicking of synch header button
 */
function showDetailsOnMap() {
	var sortLocation = getSortLocation();
	if(ganttChartDiagram && sortLocation) {
		var nodeDetails = ganttChartDiagram.getNodeDetails();
		if(nodeDetails.length > 0) {
			if(!parent.isDashboardActive(parent.DASHBOARD_ID_MAP_VIEW)) {
			 	parent.openDashboard(parent.DASHBOARD_ID_MAP_VIEW);
			} else {
				parent.toFront(parent.DASHBOARD_ID_MAP_VIEW);
			}
			parent.getDashboardContentWindow(parent.DASHBOARD_ID_MAP_VIEW).loadModeAnalysisLayer(sortLocation, nodeDetails);
		} 
	}else {
		parent.showErrorMsg("No data to synchronize with map");
	}
}

function applyFilterConstraints(btn){
	if(ganttChartDiagram) {
		//hide/unhide the gantt chart bars according to slider times and due time
		var viewDtlsMap = ganttChartDiagram.refreshGanttChart(getSliderValues(), getSliderMinMaxValues(), timeDiffInMilliSecs, getMinProcessingTime(), getBtnMap());
		refreshModeAnalsysisView(viewDtlsMap,getBtnMap(),btn);
		setSliderBoxDiv();
	}
}
/**
 * method to refresh gantt chart position on filtering the data and resetting the height
 * @param viewDtlsMap
 * @param btnMap
 * @param btn
 */
function refreshModeAnalsysisView(viewDtlsMap, btnMap,btn){
	if(btnMap != undefined){
		if((btn.id).indexOf('Origin') > 0){
			refreshGanttChartPositions(viewDtlsMap, btnMap,"leftFlight","leftTruck","originTable","mustFlyOrigin");
		}else{
			refreshGanttChartPositions(viewDtlsMap, btnMap,"rightFlight","rightTruck","destinationTable","mustFlyDest");
		}
		setGanttDivHeight();
	}
}
/**
 * method to refresh gantt chart position on filtering the data
 * @param viewDtlsMap
 * @param btnMap
 * @param flightId
 * @param truckId
 * @param tableId
 * @param mustFlyId
 */
function refreshGanttChartPositions(viewDtlsMap, btnMap,flightId,truckId,tableId,mustFlyId){
	var flightOrTruckMap; 
	var rowKeys;
	if( btnMap[flightId] && btnMap[truckId]){
		flightOrTruckMap = viewDtlsMap[flightId];
		rowKeys = arrayUnique(Object.keys(flightOrTruckMap).concat(Object.keys(viewDtlsMap[truckId])));
		if(rowKeys != undefined){
			showHideTableRows(tableId,rowKeys);
			setChartRowPositions(flightOrTruckMap,rowKeys,5);
			setChartRowPositions(viewDtlsMap[truckId],rowKeys,28);
		}
	}else if(btnMap[mustFlyId]){
		flightOrTruckMap = viewDtlsMap[flightId];
		rowKeys = Object.keys(flightOrTruckMap);
		if(rowKeys != undefined){
			showHideTableRows(tableId,rowKeys);
			setChartRowPositions(flightOrTruckMap,rowKeys,7);
		}
	}else if(btnMap[truckId]){
		flightOrTruckMap = viewDtlsMap[truckId];
		rowKeys = Object.keys(flightOrTruckMap);
		if(rowKeys != undefined){
			showHideTableRows(tableId,rowKeys);
			setChartRowPositions(flightOrTruckMap,rowKeys,28);
		}
	}
}
/**
 * method to hide/unhide the table rows while filtering 
 * @param tableId
 * @param rowKeys
 */
function showHideTableRows(tableId,rowKeys){
	$('#'+tableId+' > tbody  > tr').each(function(i, row) {
		if(rowKeys.indexOf((i)+"") <= -1 ) {
			$(row).attr("style", "display:none");
		}else {
			$(row).attr("style", "display:");
		}	
	});
}
/**
 * method to setRow positions 
 * @param flightOrTruckMap
 * @param rowKeys
 * @param delta
 */
function setChartRowPositions(flightOrTruckMap,rowKeys,delta){
	var index;
	for(var i=0;i<rowKeys.length; i++){
		index = i+1;
		ganttChartDiagram.setPosition( flightOrTruckMap[rowKeys[i]] , (((index)-1)*42)+delta);
	}
}
