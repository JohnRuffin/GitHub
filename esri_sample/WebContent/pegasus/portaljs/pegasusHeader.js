var PLAN_SERVICE_URL = "/dataServlet/DataRendererServlet?renderertype=com.spacetimeinsight.fedex.renderer.ServiceDataRenderer&datatype=CaseTypeRequest";
var DEFAULT_PLAN_SERVICE_URL = "/dataServlet/DataRendererServlet?renderertype=com.spacetimeinsight.fedex.renderer.SystemSettingRenderer";
var SCHEDULE_SERVICE_URL = "/dataServlet/DataRendererServlet?renderertype=com.spacetimeinsight.fedex.renderer.ServiceDataRenderer&datatype=AllResourcesRequest&commonCaseId=";
var SCHEDULE_AUTHORIZATION_SERVICE_URL = "/dataServlet/DataRendererServlet?renderertype=com.spacetimeinsight.fedex.renderer.ServiceDataRenderer&datatype=AuthorizationRequest&commonCaseId=";
var PROGRESS_DIALOG_MESSAGE_PLAN_SERVICE = "Loading case type list...";
var PROGRESS_DIALOG_MESSAGE_SCHEDULE_SERVICE = "Loading schedule list...";
var PROGRESS_DIALOG_MESSAGE_SCHEDULE_SERVICE_ACCESS = "Loading access list...";
var ERROR_MESSAGE_SELECT_PLAN = "Please select a plan.";
var ERROR_MESSAGE_REFRESH_PLAN = "Selected plan is disabled, please select other plan";

var lastSelectedCase;
var lastSelectedSchedule;
var EMPTY_STRING = "";
var commonCaseMap = [];
var scheduleAuthMap;
var favoriteDataCache;
var isScheduleMaintenanance = false;
var scheduleMaintenananceSeletedMenu = "";
var scheduleMxMode = "";
var selectedMode = "";
var dashboardDatasource = [{text:"", spriteCssClass:"k-icon window-select-disable", items: []}];
var scheduleDatasource =  [{text:"", spriteCssClass:"k-icon icon-schedule-maintenance", items: []}];

var scheduleAccess;
var fltFeederAccess;
var fltTrunkAccess;
var fltCLHAccess;
var TrkStdGNPAccess;
var TrkStdLHAccess;
var TrkStdSHAccess;
var TrkOverAccess;

function initializeHeader(){
	/* call the case service to get the list of plans. */	
	createHeaderComponents();
	initializeSystemSettings();
	showProgressDialog(true, PROGRESS_DIALOG_MESSAGE_PLAN_SERVICE);
	invokeCaseService();
}

function createHeaderComponents() {
	var planTemplate =  '#if(data.allowed == true){ #<span>#:data.commonCaseName#</span>' + 
						'#}else{#<div class="k-item" style="color:grey" disabled="disabled" >#:data.commonCaseName#</div>#}#';
	
	createKendoDropDown("planCmb", "commonCaseName", "commonCaseId", planTemplate, onPlanChangeHandler, "allowed");
	
	var scheduleTemplate = '#if(data.hasAccess == true){ #<span>#:data.name#</span>' + 
							'#}else{#<div class="k-item" style="color:grey" disabled="disabled" >#:data.name#</div>#}#';
	
	createKendoDropDown("scheduleCmb", "name", "id", scheduleTemplate,onScheduleChangeHandler, "hasAccess");
	
	createorRefreshDashboardMenu();
}

function enablescheduleMaintenanace(btn) {
	parent.isContextMode = false;
	parent.isDelete = false;
    highlightBtn(btn, !btn.isHighlighted);
    if (!btn.isHighlighted) {
        btn.children[0].title = "Enable Schedule Maintenance";
    } else {
        btn.children[0].title = "Disable Schedule Maintenance";
    }
    if (btn.isHighlighted) {
    	isScheduleMaintenanance = true;
    	$(".icon-add-route").parent().parent().show();
    	$("#scheduleMaintenanaceMenu").removeClass("iconbtn-active");
    	if(dashboardController != undefined && dashboardController.getDashboardContentWindow(DASHBOARD_ID_MAP_VIEW) != undefined){
			dashboardController.getDashboardContentWindow(DASHBOARD_ID_MAP_VIEW).SkdMxHelper.getDrawer().showDrawer(undefined, scheduleMaintenananceSeletedMenu);
		}
    	if(dashboardController != undefined && dashboardController.getDashboardContentWindow(DASHBOARD_ID_SCHEDULE_MATRIX) != undefined){
    		dashboardController.getDashboardContentWindow(DASHBOARD_ID_SCHEDULE_MATRIX).enableDisableEditInWIP();
    	}
    } else {
    		$("#routeEditorHeaderId").removeClass("n-icon-active");
		if ($("#routeEditorHeaderId")[0].isHighlighted != undefined) {
			$("#routeEditorHeaderId")[0].isHighlighted = false;
			$("#routeEditorHeaderId")[0].children[0].title ="";
			
		}
		closeSearchPopUP("scheduleMaintenanceRouteType");
		isScheduleMaintenanance = false;
		scheduleMaintenananceSeletedMenu = "";
		closeScheduleMaintenanceDashboard();
		dashboardController.getDashboardContentWindow(DASHBOARD_ID_MAP_VIEW).SkdMxHelper.getDrawer().changeCursor("Reset");
		dashboardController.getDashboardContentWindow(DASHBOARD_ID_MAP_VIEW).SkdMxHelper.getDrawer().restoreSkdMxState("Reset");		
		$(".icon-add-route").parent().parent().hide();
		if(dashboardController != undefined && dashboardController.getDashboardContentWindow(DASHBOARD_ID_SCHEDULE_MATRIX) != undefined){
    		dashboardController.getDashboardContentWindow(DASHBOARD_ID_SCHEDULE_MATRIX).enableDisableEditInWIP(true);
    	}
    }
    oldEquipType = null;
	if(dashboardController != undefined && dashboardController.getDashboardContentWindow(DASHBOARD_ID_MAP_VIEW) != undefined){
		dashboardController.getDashboardContentWindow(DASHBOARD_ID_MAP_VIEW).SkdMxHelper.getDrawer().showHideDrawer(isScheduleMaintenanance,true);
	}
}
    

/*function setEnableRightClick() {
	if(dashboardController != undefined && dashboardController.getDashboardContentWindow(DASHBOARD_ID_SCHEDULE_MATRIX) != undefined){
		dashboardController.getDashboardContentWindow(DASHBOARD_ID_SCHEDULE_MATRIX).setRightClickMenu(isScheduleMaintenanance);
	}
	if(dashboardController != undefined && dashboardController.getDashboardContentWindow(DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX) != undefined){
		dashboardController.getDashboardContentWindow(DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX).setRightClickMenu(isScheduleMaintenanance);
	}
}*/

function closeScheduleMaintenanceDashboard() {
	if (dashboardController.getDashboard(DASHBOARD_ID_MATRIX_ROUTE_EDITOR) != undefined){
		dashboardController.closeDashboard(DASHBOARD_ID_MATRIX_ROUTE_EDITOR);
	}
	if (dashboardController.getDashboard(DASHBOARD_ID_SCHEDULE_MATRIX_WIP) != undefined){
		dashboardController.closeDashboard(DASHBOARD_ID_SCHEDULE_MATRIX_WIP);
	}
}

function openSelectedDashboard(selectObj) {
	setScheduleMaintenananceMode("CREATE");
	openDashboard(DASHBOARD_ID_SCHEDULE_MATRIX_WIP, true);
	/*if (dashboardController.getDashboard(DASHBOARD_ID_SCHEDULE_MATRIX_WIP)[0] != undefined 
			&& dashboardController.getDashboardContentWindow(DASHBOARD_ID_SCHEDULE_MATRIX_WIP).handleNewRoute != undefined){
		dashboardController.getDashboardContentWindow(DASHBOARD_ID_SCHEDULE_MATRIX_WIP).handleNewRoute();
	}*/
}

function createorRefreshDashboardMenu(){
	var windowComboMenu = $("#winsCmbDiv").kendoMenu({
				dataSource:dashboardDatasource,
				openOnClick: true,
				open: function(e){
					windowComboMenu.attr("title", "");
				},
				close: function(e){
					windowComboMenu.attr("title", "Open selected window");
				},
				select: function(e) {
				openApplicationDashboard($(e.item).children(".k-link").text());
				}
			}); 
	addMenuTooltips(windowComboMenu);
}
	
function createKendoDropDown (id, dataTextField, dataValueField, template, changeFq, accessType) {
	$("#"+id).kendoComboBox({
		dataTextField: dataTextField,
	    dataValueField: dataValueField,
	    template:template,
		filter: "contains",
	    change: function(e){
	    	if(accessType == "allowed"){
	    		var dataItem = $('#'+id).data("kendoComboBox").dataItem();
				if(!dataItem["allowed"]){
					 if(lastSelectedCase != undefined && window.event.keyCode != 13){
						 $('#'+id).data("kendoComboBox").value(lastSelectedCase);
					}else {
						$('#'+id).data("kendoComboBox").value("");
	                    changeFq();
					}
				}else {
					lastSelectedCase = dataItem.commonCaseId;
					changeFq();
				}
	    	}else if(accessType == "hasAccess"){
	    		var dataItem = $('#'+id).data("kendoComboBox").dataItem();
				if(!dataItem["hasAccess"]){
					 if(lastSelectedSchedule != undefined && window.event.keyCode != 13){
						 $('#'+id).data("kendoComboBox").value(lastSelectedSchedule);
					}else {
						$('#'+id).data("kendoComboBox").value("");
						changeFq();
					}
				}else {
					lastSelectedSchedule = dataItem.id;
					changeFq();
				}
	    	}
			
		}
	});
}

function disableListElement(id) {
	try{
		$("#"+id+"_listbox").find("li").each(function(i){
			try {
				if($(this).html().indexOf('disabled') != -1) {
					var cnt = $(this).contents();
					$(this).replaceWith(cnt);
				}
				if(i==0){
					$(this).height(16);
				}
			} catch (e) {
			}
		});
	}catch (e) {
	}
}

function invokeCaseService() {
	callService({
		url : CONTEXT_NAME+PLAN_SERVICE_URL,
		successCallback : caseTypeRequestSucceeded, 
		failureCallback : onServiceRequestFailure,
		showProgressWindow : false
	  });
}

function caseTypeRequestSucceeded(response, io) {
	if(response && response.caseList && response.caseList.caseCount) {
		var caseObj;
		for (var i = 0; i < response.caseList.caseCount; i++) {
			caseObj = response.caseList["case"][i];
			commonCaseMap[caseObj.commonCaseId] = caseObj;
		}
		setHeaderErrorMsg(EMPTY_STRING);
		loadDefaultCase();
	} else {
		if(response && response._errorCd && response._errorCd > 0) {
			setHeaderErrorMsg(response._errorDesc);
		}else if(response && response.errorCd && response.errorCd > 0) {
			setHeaderErrorMsg(response.errorDesc);
		}
	}
}

function getUnqiueCaseTypes() {
	var caseTypesMap = [];
	if(commonCaseMap != null) {
		var caseTypes = [];
		var keys = Object.keys(commonCaseMap);
		for(var i=0;i<keys.length;i++) {
			if(caseTypes.indexOf(commonCaseMap[keys[i]].caseType) < 0) {
				caseTypes.push(commonCaseMap[keys[i]].caseType);
				caseTypesMap.push({caseType:commonCaseMap[keys[i]].caseType, caseDesc:""});
			}
		}
	}
	return caseTypesMap;
}

function setPlanDropDowndata(caseTypes) {
	if(commonCaseMap != null && caseTypes != null) {
		var planData = [];
		var planDataArray = [];
		var casePlanData;
		var keys = Object.keys(commonCaseMap);
		for(var i=0;i<keys.length;i++) {
			planDataArray.push(commonCaseMap[keys[i]]);
		}
		planData.push({commonCaseName:"Select Plan", commonCaseId:"", allowed:false});
		for(var i=0; i<caseTypes.length; i++) {
			casePlanData = $.grep(planDataArray, function(data) {
				return data.caseType == caseTypes[i];
			});
			$.merge(planData, casePlanData);
		}
		
		$("#planCmb").data("kendoComboBox").setDataSource(planData);
		if (caseTypes.length == 0) {
			$("#planCmb").data("kendoComboBox").setDataSource(new Array());
			$("#planCmb").data("kendoComboBox").value("");
		}
		
		disableListElement("planCmb");
		var selectedCases = $("#caseTypes").val();
		if(selectedCases != caseTypes.toString()) {
			$("#planCmb").data("kendoComboBox").select(0);
			onPlanChangeHandler();
		}
	}
}

function defaultCaseTypeRequestSucceeded(response, io) {
	if(response!=null){
		if(lastSelectedCase) {
			if(!commonCaseMap[lastSelectedCase].allowed) {
				lastSelectedCase = null;
				lastSelectedSchedule = null;
				setHeaderErrorMsg(ERROR_MESSAGE_REFRESH_PLAN);
			}
			$('#planCmb').data("kendoComboBox").value(lastSelectedCase);
			onLoadCase(lastSelectedCase);
		}else {
			var selectedCaseTypes = "PRE";
			if(response['onstartdefaultplan'] != EMPTY_STRING && response['onstartdefaultplan'] != null){
				if(commonCaseMap[response['onstartdefaultplan']] !=null && commonCaseMap[response['onstartdefaultplan']].allowed){
					if(response['onstartdefaultcasetype'] && response['onstartdefaultcasetype'] != "") {
						selectedCaseTypes = response['onstartdefaultcasetype'];
					}else {
						selectedCaseTypes = commonCaseMap[response['onstartdefaultplan']].caseType;
					}
					$("#caseTypes").val(selectedCaseTypes);
					$("#caseTypes").attr("title", selectedCaseTypes);
					setPlanDropDowndata(selectedCaseTypes.split(","));
					
					$('#planCmb').data("kendoComboBox").value(response['onstartdefaultplan']);
					lastSelectedCase = response['onstartdefaultplan'];
					onLoadCase(response['onstartdefaultplan']);
				}else{
					setHeaderErrorMsg(ERROR_MESSAGE_REFRESH_PLAN);
				}	
			}else{
			//FDX-1302 UI: Default Case Types to "PRE"
				$("#caseTypes").val(selectedCaseTypes);
				$("#caseTypes").attr("title", selectedCaseTypes);
				setPlanDropDowndata(selectedCaseTypes.split(","));
				$("#planCmb").data("kendoComboBox").select(0);
			}
			resetSystemSettings(response);
		}
		/*try{
			$("#planCmb").data("kendoComboBox").focus();
		}catch(e){
			console.log("planCmb focus issue");
		}*/
		changeWindowTitle(getCommonCaseLabel());
	}
}

function loadDefaultCase(){
	var paramsMap = {
			'datatype':"READ",
			'moduleId':1,
			'languageId':1
	    };
	callService({
		url : CONTEXT_NAME+DEFAULT_PLAN_SERVICE_URL,
		paramsMap:paramsMap,
		successCallback : defaultCaseTypeRequestSucceeded, 
		failureCallback : onServiceRequestFailure,
		showProgressWindow : false
	  });
}

function loadSchedules(){
	showProgressDialog(true, PROGRESS_DIALOG_MESSAGE_SCHEDULE_SERVICE);
	callService({
		url : CONTEXT_NAME+SCHEDULE_SERVICE_URL+getCommonCaseId(),
		successCallback : scheduleRequestSucceeded, 
		failureCallback : onServiceRequestFailure,
		showProgressWindow : false
	  });
	
}

function scheduleRequestSucceeded(response, io) {
	volumeGroupsRefreshHandler();
	if(response && response.scheduleList && response.scheduleList.scheduleCount) {
		var scheduleObj;
		var defaultSchedule;
		var scheduleData = new Array();
		//scheduleData.push({name:EMPTY_STRING, id:EMPTY_STRING, hasAccess:true});
		for (var i = 0; i < response.scheduleList.scheduleCount; i++) {
			scheduleObj = response.scheduleList.schedule[i];
			scheduleData.push(scheduleObj);
			if(lastSelectedSchedule && scheduleObj.id == lastSelectedSchedule) {
				defaultSchedule = lastSelectedSchedule;
			}else if(scheduleObj.hasAccess && scheduleObj.name.toUpperCase() == "MASTER"){
				defaultSchedule = scheduleObj.id;
			}
		}
		var dropdownlist = $("#scheduleCmb").data("kendoComboBox");		
		dropdownlist.setDataSource(scheduleData);
		$("#scheduleCmb").data("kendoComboBox").value(defaultSchedule);
		lastSelectedSchedule = defaultSchedule;
		//dropdownlist.open();
		//dropdownlist.close();		
		
		disableListElement("scheduleCmb");
		setHeaderErrorMsg(EMPTY_STRING);
		//everything is loaded in the header, call viewer method to open the windows and refresh the content
		setTimeout(function() {
			if(lastSelectedCase != undefined) {
				VIEWER.onPlanChange();
				onSaveSystemSettings(false);
			}
		},100);
		loadScheduleAuthorization();
	} else {
		 if(response && response._errorCd && response._errorCd > 0) {
			 setHeaderErrorMsg(response._errorDesc);
		 }
	 }
	if(isAdvanceQuery()){	 
		applicationFavoriteComponent = new FavoriteComponent("Application", "applicationFavoritesMenu","Application", "applicationFavoriteWindowsParentDiv", CONTEXT_NAME+"/", false);
	}else{
		//initializing the masterdata cache 
		commonViewer.setQueryCacheController();
		applicationFavoriteComponent = new FavoriteComponent("SQW_Application", "applicationFavoritesMenu","Application", "applicationFavoriteWindowsParentDiv", CONTEXT_NAME+"/", false, false);		
	}	
		applicationFavoriteComponent.retrieveAllFavorites();	
}

function loadScheduleAuthorization(){
	//showProgressDialog(true, PROGRESS_DIALOG_MESSAGE_SCHEDULE_SERVICE_ACCESS);
	callService({
		url : CONTEXT_NAME+SCHEDULE_AUTHORIZATION_SERVICE_URL+getCommonCaseId(),
		successCallback : scheduleAuthorizationRequestSucceeded, 
		failureCallback : onServiceRequestFailure,
		showProgressWindow : false
	  });
}

function scheduleAuthorizationRequestSucceeded(response, io) {
	scheduleAuthMap = response;
	getScheduleResourceAccess();
}

function getFavoriteDataCache(){
	return favoriteDataCache;
}
function setFavoriteDataCache(favoriteData){
	favoriteDataCache=favoriteData;
}
function resetLogout(){
	destroyBrowserSession();
}

function getCommonCaseId(){
	return $("#planCmb").val();
}

function getSelectedCaseTypes(){
	return $("#caseTypes").val();
}

function getCommonCaseLabel() {
	 return $("#planCmb").find('option:selected').text();
}

function getScheduleId(){
	return $("#scheduleCmb").val();
}

function getSelectedPlanWeek() {
	var selectedCase = getSelectedCase();
	if(selectedCase == undefined){
		return EMPTY_STRING;
	}
	var selectedCaseWeek = selectedCase["planPerDayQty"] / 7;
	return selectedCaseWeek;
}

function onPlanChangeHandler(){
	var caseId = getCommonCaseId();
	onLoadCase(caseId);
	if(!caseId) {
		lastSelectedCase = null;
		lastSelectedSchedule = null;
	}
	changeWindowTitle(getCommonCaseLabel());	
}
function onLoadCase(caseId){
	resetScheduleComboBox();	
	if(caseId && caseId != EMPTY_STRING) {
		closeHeaderMsgWin();
		loadSchedules();
	}  else {
		$("#headercoverId").show();
		disableIcon(true);
		clearAndCloseAllWindows();
	}
}

function onScheduleChangeHandler(){
	var scheduleId = getScheduleId();
	onLoadSchedule(scheduleId);
}
function onLoadSchedule(scheduleId){
	if(scheduleId && scheduleId != EMPTY_STRING) {
		getScheduleResourceAccess();
	}
}

function disableIcon(isDisable) {
	try {
		$("#headerBtnBar").find("span.k-icon").not("span.k-icon.icon-help").not("span.k-icon.k-i-arrow-s").not("span.k-icon.icon-itrs-enabled").each(function(i){
			if(isDisable) {
				this.className = this.className.replace("-disable", EMPTY_STRING) + "-disable";
			}else {
				this.className = this.className.replace("-disable", EMPTY_STRING);
			}
		});
	}catch (e) {
		console.log("Error[" + e.message + "]occured while enabling/disabling the icons");
	}
}

function clearAndCloseAllWindows() {
	clearAll();
	closeAllWindows();	
}

function resetScheduleComboBox() {
	$("#scheduleCmb").data("kendoComboBox").select(0);
	$("#scheduleCmb").data("kendoComboBox").setDataSource(new Array());
	$("#scheduleCmb").data("kendoComboBox").value("");
}

function getSelectedCase(){
	return commonCaseMap[getCommonCaseId()];
}

function getWindowSelect() {
	return $("#openWinsCmb");
}

function openApplicationDashboard(selectObj) {
   for(i=0;i<dashboardDatasource[0].items.length;i++){
     if(dashboardDatasource[0].items[i].text == selectObj){
		 openDashboard(dashboardDatasource[0].items[i].value, true);
		 break;
	 }
   }
}

function refreshPlanList() {
	lastSelectedCase = getCommonCaseId();
	lastSelectedSchedule = getScheduleId();
	$("#planCmb").data("kendoComboBox").select(0);
	resetScheduleComboBox();
	invokeCaseService();
}


function setHeaderProperties(headerProperties){
	if(headerProperties){		
		$('#planCmb').data("kendoComboBox").value(headerProperties.commonCaseId);
		lastSelectedSchedule = headerProperties.scheduleId;
		changeWindowTitle(getCommonCaseLabel());
	}
}

function changeWindowTitle(planLabel){
	window.document.title = "Pegasus: "+planLabel;
}

function openHelpWindow(){
	window.open("pegasus/help/PegasusUI.docx");
}

function getSelectedScheduleAuths(){
	return scheduleAuthMap[getScheduleId()];
}

function getSelectedScheduleAccessTypes(functionName){
	if(scheduleAuthMap && scheduleAuthMap[getScheduleId()]) {
		return scheduleAuthMap[getScheduleId()][functionName];
	}
	return null;
}

function getScheduleResourceAccess() {
	scheduleAccess = getResourceAccessType("Schedule_Access");
	fltFeederAccess = getResourceAccessType("FltFeeder");
	fltTrunkAccess = getResourceAccessType("FltTrunk");
	fltCLHAccess = getResourceAccessType("FltCLH");
	TrkStdGNPAccess = getResourceAccessType("TrkStdGNP");
	TrkStdLHAccess = getResourceAccessType("TrkStdLH");
	TrkStdSHAccess = getResourceAccessType("TrkStdSH");
	TrkOverAccess = getResourceAccessType("Oversized_Truck");
	//everything is loaded in the header, call viewer method to open the windows and refresh the content
	setTimeout(function() {
		if(lastSelectedSchedule != undefined) {
			VIEWER.onPlanChange();
		}
	},100);
}
/*
 * ACCESS_TYPE = 0 (Access)
 * ACCESS_TYPE = 1 (View)
 * ACCESS_TYPE = 2 (Edit)
 */
function getResourceAccessType(functionName) {
	var accessTypes = scheduleAuthMap[getScheduleId()][functionName];
	if (accessTypes != null && accessTypes.accessType != null) {
		var accessTypes = scheduleAuthMap[getScheduleId()][functionName];
		accessType = accessTypes.accessType.sort(function(a, b) { return a - b });
		return accessType[0].type;
	}
}

function getRouteType(routeContextObj) {
	var type;
    if (routeContextObj == 'Flight - Trunk' || routeContextObj == 'Flt Trunk') {
        type = "FltTrunk";
    } else if (routeContextObj == 'Flight - Feeder' || routeContextObj == 'Flt Feeder') {
    	 type = "FltFeeder";
    } else if (routeContextObj == 'Flight - Commercial Line Haul' || routeContextObj == 'Flt CLH') {
    	 type = "FltCLH";
    } else if (routeContextObj == 'Truck - Standard Line Haul' || routeContextObj == 'Trk Std LH') {
    	 type = "TrkStdLH";
    } else if (routeContextObj == 'Truck - Standard Shuttle' || routeContextObj == 'Trk Std SH') {
    	 type = "TrkStdSH";
    } else if (routeContextObj == 'Truck - Oversized/Z/GBT' || routeContextObj == 'Trk Ovr Z GBT') {
    	 type = "Oversized_Truck";
    } else if (routeContextObj == 'Truck - Standard GNP/8888' || routeContextObj == 'Trk Std GNP') {
    	 type = "TrkStdGNP";
    }
    return type;
}

function openITRSHandler(){
	//@second argument indicates whether to refresh the dashboard while opening or not ... 
	openDashboard(DASHBOARD_ID_ITRS, false); 
}
