var IS_APPLY_FILTER = true;

function applyDisplaySettings(isRefreshDashboard) {
	IS_APPLY_FILTER = true;
	if(!isDisplaySettingsValid()){
		parent.showFilterErrorMsg("Please enter valid number range");    	
		return;
	}
	var displaySettings = getDisplaySettings();
	if(displaySettings) {
		if(parent.isNetworkQuery) {
			applyNetworkDisplaySettings(displaySettings[parent.DATA_TYPE_NETWORK], window[viewerDashboardId].LAYER_ID_NETWORK_LANES);
			applyScheduleDisplaySettings(displaySettings[parent.DATA_TYPE_NETWORK_SCHEDULE], window[viewerDashboardId].LAYER_ID_NETWORK_SCHEDULE_LEGS) ;
		} else {
			applyScheduleDisplaySettings(displaySettings[parent.DATA_TYPE_SCHEDULE], window[viewerDashboardId].LAYER_ID_SCHEDULE_LEGS) ;
		}
	}
	applyViewerDisplaySettings();
	var isRefreshFlag = true;
	if(isRefreshDashboard != undefined) {
		isRefreshFlag = isRefreshDashboard;
	}
	if(isRefreshFlag){
		isRefreshFlag = getIsDataLoaded();
	}	
	if(isRefreshFlag) {
		refreshDashboard();
		$('#mapOptions').panel('hideMapOptionDiv');
	}
}

function getIsDataLoaded(){
	if(parent.isNetworkQuery) {
		if(isScheduleForNetworkFlag) {
			return parent.isNetworkScheduleDataAvailable;
		} else {
			return parent.queryDataLoadStatus[parent.DATA_TYPE_NETWORK];
		}
	} else {
		return parent.queryDataLoadStatus[parent.DATA_TYPE_SCHEDULE];
	}
}
function isDisplaySettingsValid(){
	var flag=true;
	if(!parent.isNetworkQuery || (parent.isNetworkQuery && isScheduleForNetworkFlag)){
		if(!isMinValueValid($('#txtUnder')[0],$('#txtNormal')[0])){
			$('#txtNormal').addClass("red-border");
			flag= false;
		}else {
			$('#txtNormal').removeClass("red-border");
		}
		if(!isMinValueValid($('#txtNormal')[0],$('#txtCaution')[0])){
			$('#txtNormal').addClass("red-border");
			flag= false;
		}else {
			$('#txtNormal').removeClass("red-border");
		}
		if(!isMinValueValid($('#txtCaution')[0],$('#txtExcess')[0])){
			$('#txtCaution').addClass("red-border");
			flag= false;
		}else{
			$('#txtCaution').removeClass("red-border");
		}
	}
	return flag;
}

/**
 * method that applies the network display settings to the layer
 * @param displaySettings
 * @param layerId - selected layer id
 * @returns {Boolean}
 */
function applyNetworkDisplaySettings(displaySettings, layerId) {
	var errorType = displaySettings["errorType"];
	var whereClause;	
	if(errorType) {
		isApply = true;
		if(errorType == parent.CONN_ERROR_TYPES[0]) {
			whereClause = " (CONNECTIVITY_STATUS is not null or CAPACITY_STATUS = 5) ";
		} else if(errorType == parent.CONN_ERROR_TYPES[1]) {
			whereClause = " CONNECTIVITY_STATUS is not null ";
		} else if(errorType == parent.CONN_ERROR_TYPES[2]) {
			whereClause = " CAPACITY_STATUS = 5";
		}
	}
	toggleFilterDirection(parent.$("input:radio[name ='ntwFilterDirectionOption']:checked").val());
	var usedModeFlag;
	if(displaySettings[CRITERIA_USED_MODE_FLAG]) {
		usedModeFlag = true;
	}
	setSearchCriteria(CRITERIA_USED_MODE_FLAG, usedModeFlag, false, layerId, TYPE_BOOLEAN);
	if(!isScheduleForNetworkFlag) {
		var suggestedMode = displaySettings[CRITERIA_SM];
		var mandatoryMode = displaySettings[CRITERIA_MM];
		if(suggestedMode || mandatoryMode) {
			isApply = true;
		}
		setSearchCriteria(CRITERIA_SM, suggestedMode, !(!suggestedMode || !mandatoryMode));
		setSearchCriteria(CRITERIA_MM, mandatoryMode, !(!suggestedMode || !mandatoryMode));
	}
	if(whereClause) {
		whereClause += " AND "+CRITERIA_BROWSER_SESSION_ID+" = '"+parent.getBrowserSessionId()+"'";
	}
	setWhereClause(whereClause, layerId);
	parent.setDashboardDataStatus(viewerDashboardId, parent.DATA_TYPE_NETWORK_SCHEDULE, false);	
	if(viewerDashboardId == parent.DASHBOARD_ID_SCHEMATIC_VIEW) {
		isShowDepartureDays = $("#labelDepartureDaysChk")[0].checked;
		isShowArrivalDays = $("#labelArrivalDaysChk")[0].checked;
		isShowAvailableTime = $("#labelAvailableTimeChk")[0].checked;
		isShowDueTime = $("#labelDueTimeChk")[0].checked;
	}
}

/**
 * method that applies the schedule /schedule overlay display settings to the layer
 * @param displaySettings
 * @param layerId - selected layer id
 * @returns {Boolean}
 */
function applyScheduleDisplaySettings(displaySettings, layerId) {
	var mode = displaySettings[CRITERIA_MODE];
	// mode is mandatory, automatically check them until the validation is added
	var flightChk = parent.isNetworkQuery ? "scheduleOverlayFlightChk" : "scheduleFlightChk";
	var truckChk = parent.isNetworkQuery ? "scheduleOverlayTruckChk" : "scheduleTruckChk";
	var flightCombo = parent.isNetworkQuery ? "scheduleOverlayFlightCombo" : "scheduleFlightCombo";
	var truckCombo = parent.isNetworkQuery ? "scheduleOverlayFilterModeTruckCombo" : "scheduleFilterModeTruckCombo";
	if(parent.$("#"+flightChk)[0].checked == false && parent.$("#"+truckChk)[0].checked == false){
		parent.$("#"+flightChk)[0].checked = true;
		parent.$("#"+truckChk)[0].checked = true;
		parent.$("#"+flightCombo).removeAttr("disabled");
		parent.$("#"+truckCombo).removeAttr("disabled");
		mode = getModeStr(true, true, false);
 	}
	setSearchCriteria(CRITERIA_MODE, mode, undefined, layerId);
	if(isAdvancedQueryModule()){
		setSearchCriteria(CRITERIA_CONVEYANCE, displaySettings[CRITERIA_CONVEYANCE], undefined, layerId);
	}
	isShowRouteNo = $("#routesLabelChk")[0].checked;
	if($("#marketViewVolChk")[0] != undefined) {
		isShowVolume = $("#marketViewVolChk")[0].checked;
	}
	isShowIATADesc = $("#iataEquipDescLabelChk")[0].checked;
	isShowEquipCode = $("#equipCodeLabelChk")[0].checked;
	isShowDepartureTime = $("#departureTimeLabelChk")[0].checked;
	isShowEffectiveDays = $("#effDaysLabelChk")[0].checked;
	isShowArrivalTime  = $("#arrivalTimeLabelChk")[0].checked;
	
	var legTypesStr;
	var equipTypesStr;
	var flyChkName = parent.isNetworkQuery ? "schdllegtypeOverlayFlyChk" : "schdllegtypeFlyChk";
	var truckChkName = parent.isNetworkQuery ? "schdllegtypeOverlayTruckChk" : "schdllegtypeTruckChk";
	var flyComboName = parent.isNetworkQuery ? "flightLegTypesOverlay" : "flightLegTypes";
	var truckComboName = parent.isNetworkQuery ? "truckLegTypesOverlay" : "truckLegTypes";
	
	var flyEquipChkName = parent.isNetworkQuery ? "schdlequiptypeOverlayFlyChk" : "schdlequiptypeFlyChk";
	var truckEquipChkName = parent.isNetworkQuery ? "schdlequiptypeOverlayTruckChk" : "schdlequiptypeTruckChk";
	var flyEquipComboName = parent.isNetworkQuery ? "flightEquipTypesOverlay" : "flightEquipTypes";
	var truckEquipComboName = parent.isNetworkQuery ? "truckEquipTypesOverlay" : "truckEquipTypes";
	
	if(isAdvancedQueryModule()){
		if((parent.$("#"+flyChkName)[0]).checked) {
			legTypesStr = (parent.$("#"+flyComboName)).text();
		}
		if((parent.$("#"+truckChkName)[0]).checked && (parent.$("#"+truckComboName)).text() != "") {
			if(legTypesStr != undefined ) {
				legTypesStr += ",";
			} else {
				legTypesStr = "";
			}
			legTypesStr += (parent.$("#"+truckComboName)).text();
		}
	}
	setSearchCriteria(CRITERIA_LEG_TYPE, legTypesStr, false, layerId, TYPE_STRING, OPERATOR_IN);

	if(isAdvancedQueryModule()){
		if((parent.$("#"+flyEquipChkName)[0]).checked) {
			equipTypesStr = (parent.$("#"+flyEquipComboName)).text();
		}
		if((parent.$("#"+truckEquipChkName)[0]).checked && (parent.$("#truckEquipTypes")).text() != "") {
			if(equipTypesStr != undefined ) {
				equipTypesStr += ",";
			} else {
				equipTypesStr = "";
			}
			equipTypesStr += (parent.$("#"+truckEquipComboName)).text();
		}
		setSearchCriteria(CRITERIA_EQUIP_TYPE, equipTypesStr, false, layerId, TYPE_STRING, OPERATOR_IN);
	}
}

/**
 * returns the display settings option for network , schedule or schedule overlay
 * @returns {Object}
 */
function getDisplaySettings() {
	var displaySettings = {};
	if(parent.isNetworkQuery) {
		displaySettings[parent.DATA_TYPE_NETWORK_SCHEDULE] = getScheduleDisplaySettings();
		displaySettings[parent.DATA_TYPE_NETWORK] = getNetworkDisplaySettings();		
	} else {
		displaySettings[parent.DATA_TYPE_SCHEDULE] = getScheduleDisplaySettings();
	}
	return displaySettings;
}

function getAllDisplaySettings() {
	var allDisplaySettings = {};
	allDisplaySettings[parent.DATA_TYPE_NETWORK] = getNetworkDisplaySettings();
	allDisplaySettings[parent.DATA_TYPE_SCHEDULE] = getScheduleDisplaySettings();
	return allDisplaySettings;
}

function getNetworkDisplaySettings() {
	var displaySettings = {};
	if( isAdvancedQueryModule()){
		displaySettings["errorType"] = parent.$("#connErrorCombo")[0].value;
	}else{
		if($("#ntwFilterErrorConnectivityChk")[0].checked && $("#ntwFilterErrorCapacityChk")[0].checked){
			displaySettings["errorType"] = "Connectivity and capacity";
		}else if($("#ntwFilterErrorConnectivityChk")[0].checked){
			displaySettings["errorType"] = $("#ntwFilterErrorConnectivityChk").val();
		}else if($("#ntwFilterErrorCapacityChk")[0].checked){
			displaySettings["errorType"] = $("#ntwFilterErrorCapacityChk").val();
		}
	}
	var showModesVaues = parent.$("#showModes").data("kendoMultiSelectBox").value();
	if(showModesVaues == "DifferentMode") {
		displaySettings[CRITERIA_USED_MODE_FLAG] = true;
	} else {
		var isFlySuggested = showModesVaues.indexOf("FlySuggested") > -1;
		var isTruckSuggested = showModesVaues.indexOf("TruckSuggested") > -1;
		var isOtherSuggested = showModesVaues.indexOf("OtherSuggested") > -1;
		
		var isFlyMandatory = showModesVaues.indexOf("FlyMandatory") > -1;
		var isTruckMandatory = showModesVaues.indexOf("TruckMandatory") > -1;
		var isOtherMandatory = showModesVaues.indexOf("OtherMandatory") > -1;
		
		//if at least one of them is not selected
		if(!isFlySuggested || !isTruckSuggested || !isOtherSuggested || !isFlyMandatory || !isTruckMandatory || !isOtherMandatory) {
			var suggestedMode = getModeStr(isFlySuggested, isTruckSuggested, isOtherSuggested);
			if(suggestedMode.length > 0) {
				displaySettings[CRITERIA_SM] = suggestedMode;
			}
			
			var mandatoryMode = getModeStr(isFlyMandatory, isTruckMandatory, isOtherMandatory);
			if(mandatoryMode.length > 0) {
				displaySettings[CRITERIA_MM] = mandatoryMode;
			}
			
		}
	}
	return displaySettings;
}
function setNetworkDisplaySettings(displaySettings) {
	
	if($("#showerrorsChk")[0].checked) {
		displaySettings["errorType"] = $("#connErrorCombo")[0].value;
	}
	
	if($("#differentmodeChk")[0].checked) {
		displaySettings[CRITERIA_USED_MODE_FLAG] = true;
	} else {
		var isFlySuggested = $("#flySuggestedChk")[0].checked;
		var isTruckSuggested = $("#truckSuggestedChk")[0].checked;
		var isOtherSuggested = $("#otherSuggestedChk")[0].checked;
		
		var isFlyMandatory = $("#flyMandatoryChk")[0].checked;
		var isTruckMandatory = $("#truckMandatoryChk")[0].checked;
		var isOtherMandatory = $("#otherMandatoryChk")[0].checked;
		
		//if at least one of them is not selected
		if(!isFlySuggested || !isTruckSuggested || !isOtherSuggested || !isFlyMandatory || !isTruckMandatory || !isOtherMandatory) {
			var suggestedMode = getModeStr(isFlySuggested, isTruckSuggested, isOtherSuggested);
			if(suggestedMode.length > 0) {
				displaySettings[CRITERIA_SM] = suggestedMode;
			}
			
			var mandatoryMode = getModeStr(isFlyMandatory, isTruckMandatory, isOtherMandatory);
			if(mandatoryMode.length > 0) {
				displaySettings[CRITERIA_MM] = mandatoryMode;
			}
			
		}
	}
}
function getModeStr(fly, truck, other) {
	var mode = "";
	if(fly) {
		mode = "Flight";
	}
	if(truck) {
		if(mode.length > 0) {
			mode += ",";
		}
		mode += "Truck";
	}
	if(other) {
		if(mode.length > 0) {
			mode += ",";
		}
		mode += "Rail,Ship";
	}
	
	return mode;
}

function getScheduleDisplaySettings() {
	var displaySettings = {};
	var flightChk = parent.isNetworkQuery ? "scheduleOverlayFlightChk" : "scheduleFlightChk";
	var truckChk = parent.isNetworkQuery ? "scheduleOverlayTruckChk" : "scheduleTruckChk";
	var isFlight = parent.$("#"+flightChk)[0].checked;
	var isTruck = parent.$("#"+truckChk)[0].checked;
	var mode = getModeStr(isFlight, isTruck);
	if(mode.length > 0) {
		displaySettings[CRITERIA_MODE] = mode;
	}
	return displaySettings;
}

function getFlightConveyanceType() {
	var flightChk = parent.isNetworkQuery ? "scheduleOverlayFlightChk" : "scheduleFlightChk";
	var flightCombo = parent.isNetworkQuery ? "scheduleOverlayFlightCombo" : "scheduleFlightCombo";
	if (parent.$("#"+flightChk).is(":checked")) {
	    if (parent.$("#" + flightCombo + " :selected").text() == "Trunk") {
	        return "Flt Trunk";
	    } else if (parent.$("#" + flightCombo + " :selected").text() == "Feeder") {
    		return "Flt Feeder";
	    }
	}
}

function getTruckConveyanceType() {
	var truckChk = parent.isNetworkQuery ? "scheduleOverlayTruckChk" : "scheduleTruckChk";
	var truckCombo = parent.isNetworkQuery ? "scheduleOverlayFilterModeTruckCombo" : "scheduleFilterModeTruckCombo";
	if (parent.$("#"+truckChk).is(":checked")) {
		if (parent.$("#" + truckCombo + " :selected").text() == "Standard") {
			return "S";
		} else if (parent.$("#" + truckCombo + " :selected").text() == "Oversize") {
			return "O";
		}
	}
}

function setScheduleDisplaySettings(displaySettings) {
	
	var isFlight = $("#scheduleFlightChk")[0].checked;
	var isTruck = $("#scheduleTruckChk")[0].checked;
	
	var mode = getModeStr(isFlight, isTruck);
	if(mode.length > 0) {
		displaySettings[CRITERIA_MODE] = mode;
	}
	
}
function setDisplaySettings(displaySettings) {
	if(parent.isNetworkQuery) {
		if(isScheduleForNetworkFlag) {
			setScheduleDisplaySettings(displaySettings);
		} else {
			setNetworkDisplaySettings(displaySettings);
		}
	} else {
		getScheduleDisplaySettings(displaySettings);
	}
}

function getCautionType(value) {
	if(value) {
		var low = getCautionLow();
		var high = getCautionHigh();
		var normal = getCautionNormal();
		if(value >= high) {
			return "Excess";
		} else if(value >= low && value < high ) {
			return "Caution";
		}else if(value >= normal && value < low){
			return "Normal";
		}
	}
	
	return "Under";
}

function getVolumePercentageType() {
	if($("#weightradio")[0].checked) {
		return "weight";
	} else if($("#cuberadio")[0].checked) {
		return "cube";
	}
	return "heighestWC";
}

function getCautionUnder() {
	return $("#txtUnder").val();
}

function getCautionNormal() {
	return $("#txtNormal").val();
}

function getCautionLow() {
	return $("#txtCaution").val();
}

function getCautionHigh() {
	return $("#txtExcess").val();
}

function isCautionUnder() {
	if($("#isUnderSelected")!=undefined && $("#isUnderSelected")[0]!= undefined)
		{
		return $("#isUnderSelected")[0].checked;}
	else
		{return false;}
	
}

function isCautionNormal() {	
	if($("#isNormalSelected")!=undefined && $("#isNormalSelected")[0]!= undefined)
	{
		return $("#isNormalSelected")[0].checked;
	}
	else
	{return false;}
}

function isCautionLow() {
	if($("#isCautionSelected")!=undefined && $("#isCautionSelected")[0]!= undefined)
	{
		return $("#isCautionSelected")[0].checked;	
	}
	else
	{return false;}
}

function isCautionHigh() {
	if($("#isExcessSelected")!=undefined && $("#isExcessSelected")[0]!= undefined)
	{
		return $("#isExcessSelected")[0].checked;	
	}
	else
	{return false;}
}

function getGeneralTabSettingsFavorite(){
	var generalDisplaySettings = {};
	generalDisplaySettings["isRamps"] = $("#rampsChk").is(":checked");
	generalDisplaySettings["isDockLocs"] = $("#dockChk").is(":checked");
	generalDisplaySettings["isHubs"] = $("#hubsChk").is(":checked");
	generalDisplaySettings["isDefaultConfig"] = $("#isDefaultConfig").is(":checked");	
	generalDisplaySettings["userAddedLocations"] = $("#userAddedLocations").is(":checked");	
	generalDisplaySettings["isAirpotFeeder"] = $("#airportFeeder").is(":checked");
	generalDisplaySettings["isAirpotTrunk"] = $("#airportTrunk").is(":checked");
	generalDisplaySettings["isAirpotLineHaul"] = $("#airportLineHaul").is(":checked");
	generalDisplaySettings["stations"] = $("#stations").is(":checked");
	generalDisplaySettings["meetPoints"] = $("#meetPoints").is(":checked");
	generalDisplaySettings["display"] = $("input:radio[name ='shwlocdisplaygrp']:checked")[0].id;
	generalDisplaySettings["baseMaps"]=$('#baseMapsCmb').data('kendoComboBox').value();
	generalDisplaySettings["region"]=$('#regionCmb').data('kendoComboBox').value();
	generalDisplaySettings["autozoomChk"]=$('#autozoomChk').is(":checked");
	generalDisplaySettings["transparency"]=$('#transparencySlider').data("kendoSlider").value();
	generalDisplaySettings["locationLabels"]=$('#nolblradio').is(":checked");
	generalDisplaySettings["pointLabels"]=$("input:radio[name ='shwptlblgrp']:checked")[0].id;
	//retrieve the zoom level at which location labels appear
	generalDisplaySettings["zoomLevelId"] = $("#zoomLevelId").data("kendoComboBox").value();	
	//retrieve the symbols and numbers details....
	generalDisplaySettings["shwPictureMarkerSymbols"]=$('#shwPictureMarkerSymbolsId').is(":checked");
	generalDisplaySettings["shwNumberSymbols"]=$('#shwNumberSymbolsId').is(":checked");
	return generalDisplaySettings;
}

function applyGeneralTabSettingsFavorite(generalDisplaySettings){
	$("#rampsChk")[0].checked = generalDisplaySettings["isRamps"];
	$("#dockChk")[0].checked = generalDisplaySettings["isDockLocs"];
	$("#hubsChk")[0].checked = generalDisplaySettings["isHubs"];
	$("#userAddedLocations")[0].checked = generalDisplaySettings["userAddedLocations"];	
	$("#isDefaultConfig")[0].checked = generalDisplaySettings["isDefaultConfig"];	
	$("#airportFeeder")[0].checked = generalDisplaySettings["isAirpotFeeder"];
	$("#airportTrunk")[0].checked = generalDisplaySettings["isAirpotTrunk"];
	$("#airportLineHaul")[0].checked = generalDisplaySettings["isAirpotLineHaul"];
	$("#meetPoints")[0].checked = generalDisplaySettings["meetPoints"];
	$("#stations")[0].checked = generalDisplaySettings["stations"];	
	if($("#"+generalDisplaySettings["display"])[0] != undefined)
		$("#"+generalDisplaySettings["display"])[0].checked=true;
	if(generalDisplaySettings["baseMaps"]!=null && generalDisplaySettings["baseMaps"]!=EMPTY_STRING){
		$('#baseMapsCmb').data('kendoComboBox').value(generalDisplaySettings["baseMaps"]);
		changeMapWinBackgroundColor(generalDisplaySettings["baseMaps"]);
		changeMapExtent(generalDisplaySettings["region"]!= undefined?generalDisplaySettings["region"]: $('#regionCmb').data('kendoComboBox').value());
		esriMap.showMapLayer(selectedBaseMap, false);
		selectedBaseMap = generalDisplaySettings["baseMaps"];
	}
	if($('#autozoomChk')[0] != undefined){
		$('#autozoomChk')[0].checked=generalDisplaySettings["autozoomChk"];
		 enableAutoZoom($('#autozoomChk')[0]);
	}		
	if(generalDisplaySettings["region"]!=null && generalDisplaySettings["region"]!=EMPTY_STRING){
		$('#regionCmb').data('kendoComboBox').value(generalDisplaySettings["region"]);
		esriMap.showMapLayer(selectedBaseMap, true);
		esriMap.setMapTransparency(selectedBaseMap, selectedMapTransparency);
	}
	if(generalDisplaySettings["transparency"]!=null && (generalDisplaySettings["transparency"]).toString()!=EMPTY_STRING){
		$('#transparencySlider').data("kendoSlider").value(generalDisplaySettings["transparency"]);
		selectedMapTransparency = generalDisplaySettings["transparency"]; 
		esriMap.setMapTransparency(selectedBaseMap, selectedMapTransparency);
	}
	//apply the saved zoom level on the UI
	if(generalDisplaySettings["zoomLevelId"] != undefined){
		$("#zoomLevelId").data("kendoComboBox").value(generalDisplaySettings["zoomLevelId"]) ;
	}
	
	generalDisplaySettings["locationLabels"] == true ? $("#nolblradio").prop("checked", true).triggerHandler('click') : $("#nolblradio").prop("checked", false).triggerHandler('click');
	if($("#"+generalDisplaySettings["pointLabels"])[0] != undefined)
		$("#"+generalDisplaySettings["pointLabels"])[0].checked=true;
	//apply the symbols and numbers states
	//$('#shwPictureMarkerSymbolsId')[0].checked=generalDisplaySettings["shwPictureMarkerSymbols"];
	//$('#shwNumberSymbolsId')[0].checked=generalDisplaySettings["shwNumberSymbols"];
	generalDisplaySettings["shwPictureMarkerSymbols"] == true ? $("#shwPictureMarkerSymbolsId").prop("checked", true): $("#shwPictureMarkerSymbolsId").prop("checked", false);
	generalDisplaySettings["shwNumberSymbols"] == true ? $("#shwNumberSymbolsId").prop("checked", true): $("#shwNumberSymbolsId").prop("checked", false);
}
function getNetworkTabSettingsFavorite(isMapView){
	
	var networkDisplaySettings = {};
	if(isAdvancedQueryModule()){
		networkDisplaySettings["ntwFilterDirectionOption"] = parent.$("input:radio[name ='ntwFilterDirectionOption']:checked").attr("id");
		networkDisplaySettings["errorType"] = parent.$("#connErrorCombo").val();
		networkDisplaySettings["showModes"] = parent.$("#showModes").data("kendoMultiSelectBox").value();
	}	
	if(!isMapView){
		networkDisplaySettings["showVolumesDepartureDays"]=$("#labelDepartureDaysChk").is(":checked");
		networkDisplaySettings["showVolumesArrivalDays"]=$("#labelArrivalDaysChk").is(":checked");
		networkDisplaySettings["showVolumesAvailableTime"]=$("#labelAvailableTimeChk").is(":checked");
		networkDisplaySettings["showVolumesDueTime"]=$("#labelDueTimeChk").is(":checked");
	}
	
	networkDisplaySettings["showColumnsWeight"]=$("#popupDisplayOptionWeightChk").is(":checked");
	networkDisplaySettings["showColumnsCube"]=$("#popupDisplayOptionCubeChk").is(":checked");
	networkDisplaySettings["showColumnsPieces"]=$("#popupDisplayOptionPiecesChk").is(":checked");
	networkDisplaySettings["showColumnsODPD"]=$("#popupDisplayOptionOdpdChk").is(":checked");
	
	//get the show as hub settings...
	networkDisplaySettings["showAsHubGroup"] = getHubActivityType();
	
	return networkDisplaySettings;
}

function applyNetworkTabSettingsFavorite(networkDisplaySettings,isMapView){
	if(networkDisplaySettings == undefined){
		return;
	}
	if(isAdvancedQueryModule()){
		parent.$("#"+networkDisplaySettings["ntwFilterDirectionOption"]).prop("checked", true);
		parent.$("#connErrorCombo").val(networkDisplaySettings["errorType"]);
		if(!isMapView){
			$("#labelDepartureDaysChk")[0].checked=networkDisplaySettings["showVolumesDepartureDays"];
			$("#labelArrivalDaysChk")[0].checked=networkDisplaySettings["showVolumesArrivalDays"];
			$("#labelAvailableTimeChk")[0].checked=networkDisplaySettings["showVolumesAvailableTime"];
			$("#labelDueTimeChk")[0].checked=networkDisplaySettings["showVolumesDueTime"];
		}
		var modes = networkDisplaySettings["showModes"];
		if(modes != null) {
			var modesArray = modes.split(",");
			parent.$("#showModes").data("kendoMultiSelectBox").unselectAll();
			for(var i=0;i<modesArray.length;i++) {
				parent.$("#showModes").data("kendoMultiSelectBox")._select(parent.modeTypes.indexOf(modesArray[i]));
			}
		}
	}
	$("#popupDisplayOptionWeightChk")[0].checked=networkDisplaySettings["showColumnsWeight"];
	$("#popupDisplayOptionCubeChk")[0].checked=networkDisplaySettings["showColumnsCube"];
	$("#popupDisplayOptionPiecesChk")[0].checked=networkDisplaySettings["showColumnsPieces"];
	$("#popupDisplayOptionOdpdChk")[0].checked=networkDisplaySettings["showColumnsODPD"];
	
	//apply the settings for show as hub group
	if(networkDisplaySettings["showAsHubGroup"] != undefined){
		document.getElementById(networkDisplaySettings["showAsHubGroup"]).checked = "checked";
	}
	/*if(isMapView){
		$("#labelWeightChk")[0].checked=networkDisplaySettings["showVolumesWeight"];
		$("#labelCubeChk")[0].checked=networkDisplaySettings["showVolumesCube"];
		$("#labelPiecesChk")[0].checked=networkDisplaySettings["showVolumesPieces"];
	}*/	
}

function getScheduleTabSettingsFavorite(isMapView){
	var scheduleDisplaySettings = {};
	if(isAdvancedQueryModule()){
		scheduleDisplaySettings["showModesFlight"]=parent.$("#scheduleFlightChk").is(":checked");
		scheduleDisplaySettings["showModesTruck"]=parent.$("#scheduleTruckChk").is(":checked");
		scheduleDisplaySettings["showOverlayModesFlight"]=parent.$("#scheduleOverlayFlightChk").is(":checked");
		scheduleDisplaySettings["showOverlayModesTruck"]=parent.$("#scheduleOverlayTruckChk").is(":checked");
		scheduleDisplaySettings["scheduleFlightCombo"] = parent.$("#scheduleFlightCombo").val();
		scheduleDisplaySettings["scheduleFilterModeTruckCombo"] = parent.$("#scheduleFilterModeTruckCombo").val();
		scheduleDisplaySettings["scheduleOverlayFlightCombo"] = parent.$("#scheduleOverlayFlightCombo").val();
		scheduleDisplaySettings["scheduleOverlayFilterModeTruckCombo"] = parent.$("#scheduleOverlayFilterModeTruckCombo").val();
		
		scheduleDisplaySettings["showLegTypeSchdlFly"]=parent.$("#schdllegtypeFlyChk").is(":checked");
		scheduleDisplaySettings["showLegTypeschdlTruck"]=parent.$("#schdltypeTruckChk").is(":checked");
		scheduleDisplaySettings["showEquipTypeSchdlFly"]=parent.$("#schdlequiptypeFlyChk").is(":checked");
		scheduleDisplaySettings["showEquipTypeschdlTruck"]=parent.$("#schdlequiptypeTruckChk").is(":checked");
		scheduleDisplaySettings["showOverlayLegTypeSchdlFly"]=parent.$("#schdllegtypeOverlayFlyChk").is(":checked");
		scheduleDisplaySettings["showOverlayLegTypeschdlTruck"]=parent.$("#schdltypeOverlayTruckChk").is(":checked");
		scheduleDisplaySettings["showOverlayEquipTypeSchdlFly"]=parent.$("#schdlequiptypeOverlayFlyChk").is(":checked");
		scheduleDisplaySettings["showOverlayEquipTypeschdlTruck"]=parent.$("#schdlequiptypeOverlayTruckChk").is(":checked");
		
		scheduleDisplaySettings["scheduleFlyComboValue"]=parent.$("#flightLegTypes").text();
		scheduleDisplaySettings["scheduleTruckComboValue"]=parent.$("#truckLegTypes").text();
		scheduleDisplaySettings["scheduleFlyEquipComboValue"]=parent.$("#flightEquipTypes").text();
		scheduleDisplaySettings["scheduleTruckEquipComboValue"]=parent.$("#truckEquipTypes").text();
		scheduleDisplaySettings["scheduleOverlayFlyComboValue"]=parent.$("#flightLegTypesOverlay").text();
		scheduleDisplaySettings["scheduleOverlayTruckComboValue"]=parent.$("#truckLegTypesOverlay").text();
		scheduleDisplaySettings["scheduleOverlayFlyEquipComboValue"]=parent.$("#flightEquipTypesOverlay").text();
		scheduleDisplaySettings["scheduleOverlayTruckEquipComboValue"]=parent.$("#truckEquipTypesOverlay").text();
		
		scheduleDisplaySettings["loadIndicator"]=$("input:radio[name ='loadindicatorsgrp']:checked")[0].id;
		scheduleDisplaySettings["loadIndicatorUnder"]=$("#txtUnder")[0].value;
		scheduleDisplaySettings["loadIndicatorNormal"]=$("#txtNormal")[0].value;
		scheduleDisplaySettings["loadIndicatorMin"]=$("#txtCaution")[0].value;
		scheduleDisplaySettings["loadIndicatorMax"]=$("#txtExcess")[0].value;
				
		scheduleDisplaySettings["showLegTypeNetFly"]=$("#netlegtypeFlyChk").is(":checked");
		scheduleDisplaySettings["showLegTypeNetTruck"]=$("#netlegtypeTruckChk").is(":checked");
		
		scheduleDisplaySettings["showLegTypeRail"]=$("#schematiclegtypeRailChk").is(":checked");
		scheduleDisplaySettings["showLegTypeShip"]=$("#schematiclegtypeShipChk").is(":checked");
		
		if($('#networkFlyCombo').data('kendoMultiSelectBox').selectedValues != null)
			scheduleDisplaySettings["networkFlyComboValue"]=($('#networkFlyCombo').data('kendoMultiSelectBox').selectedValues).toString();
		if($('#networkTruckCombo').data('kendoMultiSelectBox').selectedValues != null)
			scheduleDisplaySettings["networkTruckComboValue"]=($('#networkTruckCombo').data('kendoMultiSelectBox').selectedValues).toString();

		if($('#railCombo').data('kendoComboBox') != null)
			scheduleDisplaySettings["railComboValue"]=($('#railCombo').data('kendoComboBox').value());
		if($('#shipCombo').data('kendoComboBox') != null)
			scheduleDisplaySettings["shipComboValue"]=($('#shipCombo').data('kendoComboBox').value());
	}
	
	if(isMapView){
		scheduleDisplaySettings["marketOrgDest"]=$("#marketOrgDestChk").is(":checked");
	}
	
	//market view display options 
	scheduleDisplaySettings["showVolumesRoutes"]=$("#routesLabelChk").is(":checked");
	scheduleDisplaySettings["showVolumesLabel"]=$("#marketViewVolChk").is(":checked");
	scheduleDisplaySettings["showVolumesIataEquipDesc"]=$("#iataEquipDescLabelChk").is(":checked");
	scheduleDisplaySettings["showVolumesEquipCode"]=$("#equipCodeLabelChk").is(":checked");
	scheduleDisplaySettings["showVolumesDepartureTime"]=$("#departureTimeLabelChk").is(":checked");
	scheduleDisplaySettings["showVolumesEffDays"]=$("#effDaysLabelChk").is(":checked");
	scheduleDisplaySettings["showVolumesArrivalTime"]=$("#arrivalTimeLabelChk").is(":checked");
	
	if(isMapView){
		scheduleDisplaySettings["marketViewWChk"] = $("#marketViewWChk").is(":checked");
		scheduleDisplaySettings["marketViewWPercentChk"] = $("#marketViewWPercentChk").is(":checked");
		scheduleDisplaySettings["marketViewCuChk"] = $("#marketViewCuChk").is(":checked");
		scheduleDisplaySettings["marketViewCuPercentChk"] = $("#marketViewCuPercentChk").is(":checked");
	}
	
	scheduleDisplaySettings["showLegDetailWeight"]=$("#schematicMatrixweightChk").is(":checked");
	scheduleDisplaySettings["showLegDetailCube"]=$("#schematicMatrixpiecesChk").is(":checked");
	scheduleDisplaySettings["showLegDetailPieces"]=$("#schematiMatrixccubeChk").is(":checked");
	
	return scheduleDisplaySettings;
}
function applyScheduleTabSettingsFavorite(scheduleDisplaySettings,isMapView){
	if(scheduleDisplaySettings == undefined){
		return;
	}
	if(isAdvancedQueryModule()){
		parent.$("#scheduleFlightChk")[0].checked=scheduleDisplaySettings["showModesFlight"];
		parent.$("#scheduleTruckChk")[0].checked=scheduleDisplaySettings["showModesTruck"];
		parent.$("#scheduleOverlayFlightChk")[0].checked=scheduleDisplaySettings["showOverlayModesFlight"];
		parent.$("#scheduleOverlayTruckChk")[0].checked=scheduleDisplaySettings["showOverlayModesTruck"];
		parent.$("#scheduleFlightCombo").val(scheduleDisplaySettings["scheduleFlightCombo"]);
		parent.$("#scheduleFilterModeTruckCombo").val(scheduleDisplaySettings["scheduleFilterModeTruckCombo"]);
		parent.$("#scheduleOverlayFlightCombo").val(scheduleDisplaySettings["scheduleOverlayFlightCombo"]);
		parent.$("#scheduleOverlayFilterModeTruckCombo").val(scheduleDisplaySettings["scheduleOverlayFilterModeTruckCombo"]);
		
		parent.$("#schdllegtypeFlyChk")[0].checked=scheduleDisplaySettings["showLegTypeSchdlFly"];
		parent.$("#schdllegtypeTruckChk")[0].checked=scheduleDisplaySettings["showLegTypeschdlTruck"];
		parent.$("#schdlequiptypeFlyChk")[0].checked=scheduleDisplaySettings["showEquipTypeSchdlFly"];
		parent.$("#schdlequiptypeTruckChk")[0].checked=scheduleDisplaySettings["showEquipTypeschdlTruck"];
		parent.$("#schdllegtypeOverlayFlyChk")[0].checked=scheduleDisplaySettings["showOverlayLegTypeSchdlFly"];
		parent.$("#schdllegtypeOverlayTruckChk")[0].checked=scheduleDisplaySettings["showOverlayLegTypeschdlTruck"];
		parent.$("#schdlequiptypeOverlayFlyChk")[0].checked=scheduleDisplaySettings["showOverlayEquipTypeSchdlFly"];
		parent.$("#schdlequiptypeOverlayTruckChk")[0].checked=scheduleDisplaySettings["showOverlayEquipTypeschdlTruck"];
		
		parent.$("#flightLegTypes").text(scheduleDisplaySettings["scheduleFlyComboValue"]);
		parent.$("#truckLegTypes").text(scheduleDisplaySettings["scheduleTruckComboValue"]);
		parent.$("#flightEquipTypes").text(scheduleDisplaySettings["scheduleFlyEquipComboValue"]);
		parent.$("#truckEquipTypes").text(scheduleDisplaySettings["scheduleTruckEquipComboValue"]);
		parent.$("#flightLegTypesOverlay").text(scheduleDisplaySettings["scheduleOverlayFlyComboValue"]);
		parent.$("#truckLegTypesOverlay").text(scheduleDisplaySettings["scheduleOverlayTruckComboValue"]);
		parent.$("#flightEquipTypesOverlay").text(scheduleDisplaySettings["scheduleOverlayFlyEquipComboValue"]);
		parent.$("#truckEquipTypesOverlay").text(scheduleDisplaySettings["scheduleOverlayTruckEquipComboValue"]);
	
		$("#"+scheduleDisplaySettings["loadIndicator"])[0].checked=true;
		
		if(scheduleDisplaySettings["loadIndicatorUnder"] !=null)
			if($("#txtUnder")[0]!=undefined)
				{
					$("#txtUnder")[0].value=scheduleDisplaySettings["loadIndicatorUnder"];
				}
		if(scheduleDisplaySettings["loadIndicatorNormal"] !=null)
			if($("#txtNormal")[0]!=undefined)
			{
				$("#txtNormal")[0].value=scheduleDisplaySettings["loadIndicatorNormal"];
			}
		if(scheduleDisplaySettings["loadIndicatorMin"] !=null)
			if($("#txtCaution")[0]!=undefined)
			{
				$("#txtCaution")[0].value=scheduleDisplaySettings["loadIndicatorMin"];
			}
		if(scheduleDisplaySettings["loadIndicatorMax"] !=null)
			if($("#txtExcess")[0]!=undefined)
			{
				$("#txtExcess")[0].value=scheduleDisplaySettings["loadIndicatorMax"];
			}
		
		$("#netlegtypeFlyChk")[0].checked=scheduleDisplaySettings["showLegTypeNetFly"];
		$("#netlegtypeTruckChk")[0].checked=scheduleDisplaySettings["showLegTypeNetTruck"];
		
		$("#schematiclegtypeRailChk")[0].checked=scheduleDisplaySettings["showLegTypeRail"];
		$("#schematiclegtypeShipChk")[0].checked=scheduleDisplaySettings["showLegTypeShip"];
		$('#networkFlyCombo').data('kendoMultiSelectBox').selectedValues=scheduleDisplaySettings["networkFlyComboValue"];
		$('#networkTruckCombo').data('kendoMultiSelectBox').selectedValues=scheduleDisplaySettings["networkTruckComboValue"];
		
		if(scheduleDisplaySettings["networkFlyComboValue"]) {
			$('#networkFlyCombo').data('kendoMultiSelectBox').value((scheduleDisplaySettings["networkFlyComboValue"]).split(COMMA_STRING));
		}
		
		if(scheduleDisplaySettings["networkTruckComboValue"]) {
			$('#networkTruckCombo').data('kendoMultiSelectBox').value((scheduleDisplaySettings["networkTruckComboValue"]).split(COMMA_STRING));
		}
		
		if(scheduleDisplaySettings["railComboValue"]) {
			$('#railCombo').data('kendoComboBox').value((scheduleDisplaySettings["railComboValue"]).split(COMMA_STRING));
		}
		
		if(scheduleDisplaySettings["shipComboValue"]) {
			$('#shipCombo').data('kendoComboBox').value((scheduleDisplaySettings["shipComboValue"]).split(COMMA_STRING));
		}
	}
	if(isMapView){
		$("#marketOrgDestChk")[0].checked=scheduleDisplaySettings["marketOrgDest"];
	}

	//market view options
	$("#routesLabelChk")[0].checked=scheduleDisplaySettings["showVolumesRoutes"];
	if($("#marketViewVolChk")[0]!= undefined){
		$("#marketViewVolChk")[0].checked=scheduleDisplaySettings["showVolumesLabel"];
	}
	
	$("#iataEquipDescLabelChk")[0].checked=scheduleDisplaySettings["showVolumesIataEquipDesc"];
	$("#equipCodeLabelChk")[0].checked=scheduleDisplaySettings["showVolumesEquipCode"];
	$("#departureTimeLabelChk")[0].checked=scheduleDisplaySettings["showVolumesDepartureTime"];
	$("#effDaysLabelChk")[0].checked=scheduleDisplaySettings["showVolumesEffDays"];
	$("#arrivalTimeLabelChk")[0].checked=scheduleDisplaySettings["showVolumesArrivalTime"];
	
	if(isMapView) {
		$("#marketViewWChk")[0].checked = scheduleDisplaySettings["marketViewWChk"];
		$("#marketViewWPercentChk")[0].checked = scheduleDisplaySettings["marketViewWPercentChk"];
		$("#marketViewCuChk")[0].checked = scheduleDisplaySettings["marketViewCuChk"];
		$("#marketViewCuPercentChk")[0].checked = scheduleDisplaySettings["marketViewCuPercentChk"];
	}
	
	$("#schematicMatrixweightChk")[0].checked=scheduleDisplaySettings["showLegDetailWeight"];
	$("#schematicMatrixpiecesChk")[0].checked=scheduleDisplaySettings["showLegDetailCube"];
	$("#schematiMatrixccubeChk")[0].checked=scheduleDisplaySettings["showLegDetailPieces"];
}


function getViewerHeaderButtonSettings(isFavorite) {
	var headerButtonSettings = {}; 
	if(isFavorite !=null && !isFavorite){
		headerButtonSettings["directionBtnConstant"] = currentDirectionBtnConstant;
		headerButtonSettings["intImage"] = currentViewerConstant;
		headerButtonSettings["isScheduleForNetworkFlag"] = isScheduleForNetworkFlag;
	}
	if(parent.$('#'+localZuluBtnName)[0] != undefined){
		headerButtonSettings["isLocalZulu"] = parent.$('#'+localZuluBtnName)[0].toggled;	
	}
	
	if(isSyncOn) {
		headerButtonSettings["syncSearchCriterias"] = viewerSyncSearchCriterias;
	} else {	
		headerButtonSettings["searchCriterias"] = searchCriterias;
		headerButtonSettings["whereClauses"] = whereClauses;
		headerButtonSettings["dayWhereClauses"] = dayWhereClauses;
		headerButtonSettings["activityWhereClause"] = activityWhereClause;
	} 
	var selectedDays = {};
	for(var i = 0; i < parent.DATA_TYPES_ALL.length; i++) {
		selectedDays[parent.DATA_TYPES_ALL[i]] = parent.getDashboardSelectedDays(viewerDashboardId, parent.DATA_TYPES_ALL[i]);
	}
	headerButtonSettings["selectedDays"] = selectedDays;
	
	return headerButtonSettings;
}

function applyViewerHeaderButtonSettings(viewerHeaderButtonSettings, isSyncSchematic,isFavorite, isSyncViewer) {
	if(isSyncSchematic == undefined || isSyncSchematic) {
		var viewerSearchCriterias = viewerHeaderButtonSettings["searchCriterias"];
		var viewerWhereClauses = viewerHeaderButtonSettings["whereClauses"];
		var viewerDayWhereClauses = viewerHeaderButtonSettings["dayWhereClauses"];
		var syncSearchCriterias = viewerHeaderButtonSettings["syncSearchCriterias"];
		
		var parentDashboard;
		var parentDashboardLayerIds;
		if(viewerDashboardId == parent.DASHBOARD_ID_SCHEMATIC_VIEW) {
			parentDashboard = parent.getDashboardContentWindow(parent.DASHBOARD_ID_MAP_VIEW);
			parentDashboardLayerIds = [parentDashboard[parent.DASHBOARD_ID_MAP_VIEW].LAYER_ID_NETWORK_LANES, parentDashboard[parent.DASHBOARD_ID_MAP_VIEW].LAYER_ID_NETWORK_SCHEDULE_LEGS, parentDashboard[parent.DASHBOARD_ID_MAP_VIEW].LAYER_ID_SCHEDULE_LEGS];
		} else if(viewerDashboardId == parent.DASHBOARD_ID_MAP_VIEW) {
			parentDashboard = parent.getDashboardContentWindow(parent.DASHBOARD_ID_MAP_VIEW);
			parentDashboardLayerIds = [parentDashboard[parent.DASHBOARD_ID_MAP_VIEW].LAYER_ID_NETWORK_LANES, parentDashboard[parent.DASHBOARD_ID_MAP_VIEW].LAYER_ID_NETWORK_SCHEDULE_LEGS, parentDashboard[parent.DASHBOARD_ID_MAP_VIEW].LAYER_ID_SCHEDULE_LEGS];
		}
		
		var layerIds = [window[viewerDashboardId].LAYER_ID_NETWORK_LANES,window[viewerDashboardId].LAYER_ID_NETWORK_SCHEDULE_LEGS,window[viewerDashboardId].LAYER_ID_SCHEDULE_LEGS];
		
		
		for(var i = 0; i < layerIds.length; i++) {
			if(parentDashboard.isSyncOn) {
				if(syncSearchCriterias != undefined && syncSearchCriterias[parentDashboardLayerIds[i]] != undefined) {
					searchCriterias[layerIds[i]] = syncSearchCriterias[parentDashboardLayerIds[i]].searchCriteria;
					whereClauses[layerIds[i]] = syncSearchCriterias[parentDashboardLayerIds[i]].whereClause;
				}				
			} else {
				searchCriterias[layerIds[i]] = clone(viewerSearchCriterias[parentDashboardLayerIds[i]]);
				whereClauses[layerIds[i]] = viewerWhereClauses[parentDashboardLayerIds[i]];
				dayWhereClauses[layerIds[i]] = viewerDayWhereClauses[parentDashboardLayerIds[i]];
			}
		}	
	} else {
		//searchCriterias = viewerHeaderButtonSettings["searchCriterias"];
		//whereClauses = viewerHeaderButtonSettings["whereClauses"];
		dayWhereClauses = viewerHeaderButtonSettings["dayWhereClauses"];	
		if(dayWhereClauses == undefined){
			dayWhereClauses  = {};
		}
	}
	
	if(isFavorite !=null && !isFavorite){
		toggleDirectionAndViewHandler(viewerHeaderButtonSettings, isSyncViewer);
	}	
	setLocalZuluButtonState(!viewerHeaderButtonSettings["isLocalZulu"], false,isSyncOn==true ? false :parent.isAtleastOneSyncOn);
	
	activityWhereClause = viewerHeaderButtonSettings["activityWhereClause"];
	if(viewerHeaderButtonSettings["selectedDays"] != undefined ) { //&& (isSyncSchematic == undefined || isSyncSchematic)
		var selectedDays = viewerHeaderButtonSettings["selectedDays"];
		for(var i = 0; i < parent.DATA_TYPES_ALL.length; i++) {
			if(selectedDays[parent.DATA_TYPES_ALL[i]] != undefined) {
				parent.setDashboardSelectedDays(viewerDashboardId, parent.DATA_TYPES_ALL[i], selectedDays[parent.DATA_TYPES_ALL[i]]);
			}
		}
	}	
}

function toggleDirectionAndViewHandler(viewerHeaderButtonSettings, isSyncViewer) {
	intImage = viewerHeaderButtonSettings["intImage"];
	isScheduleForNetworkFlag = viewerHeaderButtonSettings["isScheduleForNetworkFlag"];
	directionBtnConstant = viewerHeaderButtonSettings["directionBtnConstant"];
	if(isAdvancedQueryModule()){
		enableDisableDirection();
		var directionBtnName = "btnMapDirection";
		if(viewerDashboardId == parent.DASHBOARD_ID_SCHEMATIC_VIEW) {
			directionBtnName = "btnSchematicDirection";
		}
		toggleDirection($("#"+directionBtnName, parent.document)[0], false);	
		toggleView($("#"+viewerToggleBtnDivId, parent.document)[0], false, isSyncViewer);
	}
	//resetting / updating the graphics w.r.t the zoom level specifications...
	if(typeof esriZoomManager != "undefined"){
		esriZoomManager.constructLayerDetails(getLayerId());		
	}
}

//method to show-hide the apply button 
function onViewerSettingsTabSelect(e) {
	var tabId=$(e.item).find("> .k-link").text();
	if(tabId == "Legend"){
		$("#applyDisplaySettings").hide();
	}else{
		$("#applyDisplaySettings").show();
	}
	 if(tabId=="General"){
		 addRemoveSettingHeight("mapGeneralSettings");
	 }else if(tabId==parent.DATA_TYPE_NETWORK){
		 if(viewerDashboardId==parent.DASHBOARD_ID_SCHEMATIC_VIEW){
				addRemoveSettingHeight("schematicNetworkSettings");
			}else{
				addRemoveSettingHeight("mapNetworkSettings");
			}

	 }else if(tabId==parent.DATA_TYPE_SCHEDULE){
		 if(viewerDashboardId==parent.DASHBOARD_ID_SCHEMATIC_VIEW){
				addRemoveSettingHeight("schematicScheduleSettings");
			}else{
				addRemoveSettingHeight("mapScheduleSettings");
			}

	 }else if(tabId=="Legend"){
		 if(viewerDashboardId==parent.DASHBOARD_ID_SCHEMATIC_VIEW){
			 if(parent.isNetworkQuery) {
				 if(isScheduleForNetworkFlag) {
					 addRemoveSettingHeight("schematicScheduleLegendSettings");
				 } else {
					 addRemoveSettingHeight("schematicNetworkLegendSettings");
				 }	 
			 } else {
				 addRemoveSettingHeight("schematicScheduleLegendSettings");
			 }
			 
			}else{
				if(parent.isNetworkQuery) {
					 if(isScheduleForNetworkFlag) {
						 addRemoveSettingHeight("mapScheduleLegendSettings");
					 }else{
						 addRemoveSettingHeight("mapNetworkLegendSettings");
					 }
				 } else {
					 addRemoveSettingHeight("mapScheduleLegendSettings");
				 }
			}

	 }
}	