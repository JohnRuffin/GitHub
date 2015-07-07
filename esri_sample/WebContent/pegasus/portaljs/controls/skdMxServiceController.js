/**
 * @author Honey Bansal
 */
var SkdMxServiceHelper = (function() {
    function constructorFn() {
        this.timeAndCostServiceManager;
        this.defaultServiceManager;
        this.validationServiceManager;
        this.validationServiceData;
        this.saveUpdateServiceManager;
        this.availableRouteListService;
        this.masterDataService;
    };

    constructorFn.getTimeAndCostServiceManagerManager = function() {
        if (this.timeAndCostServiceManager == undefined) {
            this.timeAndCostServiceManager = (new TimeAndCostServiceManager()).getInstance();
        }
        return this.timeAndCostServiceManager;
    };
    constructorFn.getDefaultServiceManager = function() {
        if (this.defaultServiceManager == undefined) {
            this.defaultServiceManager = (new DefaultServiceManager()).getInstance();
        }
        return this.defaultServiceManager;
    };
    constructorFn.getValidationServiceManager = function() {
        if (this.validationServiceManager == undefined) {
            this.validationServiceManager = (new ValidationServiceManager()).getInstance();
        }
        return this.validationServiceManager;
    };
    constructorFn.getSaveUpdateServiceManager = function() {
        if (this.saveUpdateServiceManager == undefined) {
            this.saveUpdateServiceManager = (new SaveUpdateServiceManager()).getInstance();
        }
        return this.saveUpdateServiceManager;
    };
    constructorFn.getAvailableRouteListServiceManager = function() {
        if (this.availableRouteListServiceManager == undefined) {
            this.availableRouteListServiceManager = (new AvailableRouteListServiceManager()).getInstance();
        }
        return this.availableRouteListServiceManager;
    };
    constructorFn.getMasterDataServiceManager = function() {
        if (this.masterDataServiceManager == undefined) {
            this.masterDataServiceManager = (new MasterDataServiceManager()).getInstance();
        }
        return this.masterDataServiceManager;
    };
    return constructorFn;
})();

function TimeAndCostServiceManager() {

    function constructorFn() {
        this.initialize();
    };

    constructorFn.initialize = function() {
        //
    };
   
    constructorFn.triggerTimeNCostServiceFromRoute = function(that,serviceSuccessCallback,grid,ledGridId,isLocalTime,isRouteEditor) {
    	if(this.needToCallTimeNCostServiceForCell(that)) {
    		var legsGrid = that.closest("tr").next().find(ledGridId).data("kendoGrid");
    		//var routeData = parent.selectedRouteList;//grid.data("kendoGrid").dataItem(legsGrid.closest("tr").prev());
    		//var legsData = parent.selectedLegList;//legsGrid.data("kendoGrid").dataSource.data();
    		var routeData = grid.data("kendoGrid").dataItem(that.closest("tr"));
    		var legsData = legsGrid.dataSource.data();
    		if(this.needToCallTimeNCostServiceForData(routeData, legsData)) {
    			return this.triggerTimeNCostService(routeData.toJSON(), legsData.toJSON(),serviceSuccessCallback,isLocalTime,isRouteEditor, that);
    		}
    	}
    };

    constructorFn.triggerTimeNCostServiceFromLeg = function(that,serviceSuccessCallback,grid,ledGridId,isLocalTime,isRouteEditor) {
    	if(this.needToCallTimeNCostServiceForCell(that)) {
    		var legsGridRow = that.closest("tr");
    		var legsGrid = that.closest(ledGridId);
    		//var routeData = parent.selectedRouteList;//var routeData = grid.data("kendoGrid").dataItem(legsGrid.closest("tr").prev());
    		//var legsData = parent.selectedLegList;//var legsData = legsGrid.data("kendoGrid").dataSource.data();
    		var routeData = grid.data("kendoGrid").dataItem(legsGrid.closest("tr").prev());
    		var legsData = legsGrid.data("kendoGrid").dataSource.data();
    		if(this.needToCallTimeNCostServiceForData(routeData, legsData)) {
    			return this.triggerTimeNCostService(routeData.toJSON(), legsData.toJSON(),serviceSuccessCallback,isLocalTime,isRouteEditor, that);
    		}
    	}
    };

    constructorFn.needToCallTimeNCostServiceForCell = function(cell) {
    	if(cell.attr("data-bind").indexOf("value:FULL_EFFDAY_HOLIDAY") > -1 || 
    			cell.attr("data-bind").indexOf("value:LEG_TYPE") > -1 || cell.attr("data-bind").indexOf("value:EQUIP_TYPE") > -1 || 
    			cell.attr("data-bind").indexOf("value:ORIGIN") > -1 || cell.attr("data-bind").indexOf("value:DESTINATION") > -1 ||
    			cell.attr("data-bind").indexOf("value:LOCAL_DEP") > -1 || cell.attr("data-bind").indexOf("value:ZULU_DEP") > -1 ||
    			cell.attr("data-bind").indexOf("value:LOCAL_ARR") > -1 || cell.attr("data-bind").indexOf("value:ZULU_ARR") > -1 ||
    			cell.attr("data-bind").indexOf("value:B_OFFTIME_L") > -1 || cell.attr("data-bind").indexOf("value:B_OFFTIME_Z") > -1 ||
    			cell.attr("data-bind").indexOf("value:LANDING_TIME_L") > -1 || cell.attr("data-bind").indexOf("value:LANDING_TIME_Z") > -1 ||
    			cell.attr("data-bind").indexOf("value:FLIGHT_MINS") > -1 || cell.attr("data-bind").indexOf("value:LOC_GRND_MIN_QTY") > -1) {
    		return true;
    	}
    	return false;
    }; 

    constructorFn.needToCallTimeNCostServiceForData = function(routeData, legsData) {
    	if(routeData && routeData.dirty) {
    		return true;
    	}
    	if(legsData && legsData.length > 0) {
    		for(var i=0; i<legsData.length; i++) {
    			if(legsData[i].dirty == true) {
    				return true;
    			}
    		}
    	}
    	return false;
    };
    constructorFn.needToCallDefaultValueServiceAlso = function(cell) {
    	if((cell && cell.attr("data-bind") && cell.attr("data-bind").indexOf("value:EQUIP_TYPE") > -1) ||
    			(cell && cell.attr("dataField") && cell.attr("dataField").indexOf("EQUIP_TYPE") > -1)) {
    		var value = cell.attr("cellValue") != null ? cell.attr("cellValue") : cell.val();
    		if(oldEquipType == null || oldEquipType !=  value) {
    			oldEquipType = value;
    			return true; 
    		}
    	}
    	return false;
    };

    constructorFn.triggerTimeNCostService = function(routeData, legsData, serviceSuccessCallback, isLocalTime, isRouteEditor,cell, isNeedToCallDefaultService) {
    	var canCallTimeNCodeService = this.canTriggerTimeNCostService(routeData, legsData, serviceSuccessCallback, isLocalTime, isRouteEditor);
    	var needToCallDefaultService;
    	if(isNeedToCallDefaultService == undefined || !isNeedToCallDefaultService){
    		needToCallDefaultService = this.needToCallDefaultValueServiceAlso(cell);
    	}else {
    		needToCallDefaultService = isNeedToCallDefaultService;
    	}
    	
    	if(canCallTimeNCodeService ||  needToCallDefaultService) {
			this.callTimeCostService([routeData],legsData,serviceSuccessCallback,isLocalTime,canCallTimeNCodeService,needToCallDefaultService);
    	}
    	return canCallTimeNCodeService;
    };
    
    constructorFn.checkIsDataValid = function(cell) {
    	LoggerUtils.console("checkIsDataValid");
    	//LoggerUtils.console("SkdMxServiceHelper.validationServiceData   ["+SkdMxServiceHelper.validationServiceData+"]");
    	try {
	    	if(SkdMxServiceHelper.validationServiceData != null && cell && cell.val() != "") {
	    		var fieldName, fieldCd;
	    		if(cell.attr("data-bind").indexOf("value:LEG_TYPE") > -1) {
	    			fieldName = "LEG_TYPE";
	    			fieldCd = "legTypeCd";
	    		}else if(cell.attr("data-bind").indexOf("value:EQUIP_TYPE") > -1) {
	    			fieldName = "EQUIP_TYPE";
	    			fieldCd = "equipTypeCd";
	    		}else if(cell.attr("data-bind").indexOf("value:ORIGIN") > -1) {
	    			fieldName = "ORIGIN";
	    			fieldCd = "locationCd";
	    		}else if(cell.attr("data-bind").indexOf("value:DESTINATION") > -1) {
	    			fieldName = "DESTINATION";
	    			fieldCd = "locationCd";
	    		}
	    		if(fieldName != null) {
		    		var matchData = $.grep(SkdMxServiceHelper.validationServiceData, function(data) {
		    			//LoggerUtils.console("data[fieldCd] ["+data[fieldCd]+"] is cell.val() ["+cell.val()+"]");
		    			return data[fieldCd].toString().toUpperCase() == cell.val().toString().toUpperCase();
		    		});
		    		
		    		//LoggerUtils.console("match length ["+matchData.length+"]");
		    		if(matchData && matchData.length > 0) {
		    			SkdMxServiceHelper.validationServiceData = null;
		    			showErrorMsg("");
		    			return true;
		    		}
		    		//cell.val("");
		    		//cell[0].kendoBindingTarget.source[fieldName] = "";
		    		//SkdMxServiceHelper.validationServiceData = null;
		    		//showErrorMsg("Please enter the valid type or click adjacent icon for valid type.");
		    		return false;
	    		}
	    	}
    	}catch (e) {
			console.log("Error while validing the data from service");
		}
    	SkdMxServiceHelper.validationServiceData = null;
    	showErrorMsg("");
    	return true;
    };
    
    constructorFn.validateDataFromValidationService = function(cell) {
    	var requestType;
    	if(cell && cell.length > 0) {
	    	if(cell.attr("data-bind").indexOf("value:LEG_TYPE") > -1) {
	    		requestType = "LegTypeRequest";
	    	}else if(cell.attr("data-bind").indexOf("value:EQUIP_TYPE") > -1){
	    		requestType = "EquipTypeRequest";
	    	}else if(cell.attr("data-bind").indexOf("value:ORIGIN") > -1){
	    		requestType = "LocationRequest";
	    	}else if(cell.attr("data-bind").indexOf("value:DESTINATION") > -1){
	    		requestType = "LocationRequest";
	    	}
	    	if(requestType != null) {
	    		var data = cell[0].kendoBindingTarget.source;
	    		SkdMxServiceHelper.getValidationServiceManager().callValidationService(requestType, this.getNotNullStr(data.MODE), 
	    				this.getNotNullStr(data.CAPACITY_CD), this.getNotNullStr(data.CARRIER_TYPE), this.getNotNullStr(data.ROUTE_TYPE_CD), 
	    				this.getNotNullStr(data.EQUIP_TYPE),this.getNotNullStr(data.LEG_TYPE), this.getNotNullStr(data.ROUTE_CONTEXT_CD), 
	    				this.validationServiceSuccessCallBack, true);
	
	    	}
    	}
    };
    
    constructorFn.validationServiceSuccessCallBack = function(response, io) {
		showProgressDialog(false);
		if(response && response._errorCd && response._errorCd > 0) {
			//
		}else {
			SkdMxServiceHelper.validationServiceData = response;
		}
    };
    
    constructorFn.getNotNullStr = function(string) {
    	if(string != undefined && string != null && string != 'undefined' && string != 'null') {
    		return string;
    	}
    	return EMPTY_STRING;
    };
    
    constructorFn.isNotEmptyOrNull = function(string) {
    	if(string != undefined && string != null && string != 'undefined' && string != 'null' && string.toString().trim() != EMPTY_STRING) {
    		return true;
    	}
    	return false;
    };
    /**
     * Departure Time  	Leg.BLOCK_OUT_L_TM = Leg.LOCAL_DEP
     * Arrival Time    	Leg.BLOCK_IN_L_TM = Leg.LOCAL_ARR
     * Off Time			Leg.BLOCK_OFF_L_TM = B_OFFTIME_L
     * On Time      	Leg.BLOCK_ON_L_TM = LANDING_TIME_L
     */
    constructorFn.canTriggerTimeNCostService = function(routeData, legsData, serviceSuccessCallback, isLocalTime, isRouteEditor) {
    	try {
	    	var isCallService = false;
	    	if(routeData != null && ((isLocalTime && this.isNotEmptyOrNull(routeData.EFFDAYSL_DESC)) ||
	    			(!isLocalTime && this.isNotEmptyOrNull(routeData.EFFDAYSZ_DESC))) && this.isNotEmptyOrNull(routeData.LEG_TYPE) && this.isNotEmptyOrNull(routeData.EQUIP_TYPE)) {
	    		if(legsData && legsData.length > 0) {
	    			if((this.isNotEmptyOrNull(legsData[0].EFFDAYSL_DESC) && isLocalTime) || (this.isNotEmptyOrNull(legsData[0].EFFDAYSZ_DESC) && !isLocalTime)){
	    				isCallService = true;
	    				for(var i=0; i<legsData.length; i++) {
							if(!this.isNotEmptyOrNull(legsData[i].ORIGIN) || !this.isNotEmptyOrNull(legsData[i].DESTINATION) || 
									!this.isNotEmptyOrNull(legsData[i].LEG_TYPE) || !this.isNotEmptyOrNull(legsData[i].EQUIP_TYPE)) {
								isCallService = false;
								break;
							}
						}
	    				if(isCallService) {
	    					isCallService = false;
	    					if(isRouteEditor == true) {
	    						for(var i=0; i<legsData.length; i++) {
	    							if(isLocalTime && (this.isNotEmptyOrNull(legsData[i].LOCAL_DEP) || this.isNotEmptyOrNull(legsData[i].LOCAL_ARR))) {
	    								isCallService = true;
	    								break;
	    							}else if(!isLocalTime && (this.isNotEmptyOrNull(legsData[i].ZULU_DEP) || this.isNotEmptyOrNull(legsData[i].ZULU_ARR))) {
	    								isCallService = true;
	    								break;
	    							}
	    						}
	    						for(var i=0; i<legsData.length; i++) {
	    							if(isLocalTime && (!this.isNotEmptyOrNull(legsData[i].ORIGIN_DAY_L_NBR) || !this.isNotEmptyOrNull(legsData[i].BLOCK_INDAY_L_NBR) 
	    									|| (!this.isNotEmptyOrNull(legsData[i].LOC_GRND_MIN_QTY) && parseInt(legsData[i].LOC_GRND_MIN_QTY) < 0))) {
	    								isCallService = false;
	    								break;
	    							}else if(!isLocalTime && (!this.isNotEmptyOrNull(legsData[i].ORIGIN_DAY_Z_NBR) || !this.isNotEmptyOrNull(legsData[i].BLOCK_INDAY_Z_NBR) 
	    									|| (!this.isNotEmptyOrNull(legsData[i].LOC_GRND_MIN_QTY) && parseInt(legsData[i].LOC_GRND_MIN_QTY) < 0))) {
	    								isCallService = false;
	    								break;
	    							}
	    						}
	    					}else {
	    						for(var i=0; i<legsData.length; i++) {
	    							if(isLocalTime && (this.isNotEmptyOrNull(legsData[i].LOCAL_DEP) || this.isNotEmptyOrNull(legsData[i].LOCAL_ARR) 
	    									|| this.isNotEmptyOrNull(legsData[i].B_OFFTIME_L) || this.isNotEmptyOrNull(legsData[i].LANDING_TIME_L))) {
	    								isCallService = true;
	    								break;
	    							}else if(!isLocalTime && (this.isNotEmptyOrNull(legsData[i].ZULU_DEP) || this.isNotEmptyOrNull(legsData[i].ZULU_ARR)
	    									|| this.isNotEmptyOrNull(legsData[i].B_OFFTIME_Z) || this.isNotEmptyOrNull(legsData[i].LANDING_TIME_Z))) {
	    								isCallService = true;
	    								break;
	    							}
	    						}
	    						for(var i=0; i<legsData.length; i++) {
	    							if(isLocalTime && (!this.isNotEmptyOrNull(legsData[i].ORIGIN_DAY_L_NBR) || !this.isNotEmptyOrNull(legsData[i].BLOCK_INDAY_L_NBR) 
	    									|| (!this.isNotEmptyOrNull(legsData[i].LOC_GRND_MIN_QTY) && parseInt(legsData[i].LOC_GRND_MIN_QTY) < 0))) {
	    								isCallService = false;
	    								break;
	    							}else if(!isLocalTime && (!this.isNotEmptyOrNull(legsData[i].ORIGIN_DAY_Z_NBR) || !this.isNotEmptyOrNull(legsData[i].BLOCK_INDAY_Z_NBR) 
	    									|| (!this.isNotEmptyOrNull(legsData[i].LOC_GRND_MIN_QTY) && parseInt(legsData[i].LOC_GRND_MIN_QTY) < 0))) {
	    								isCallService = false;
	    								break;
	    							}
	    						}
	    					}
	    				}
	    				if(legsData.length > 0) {
	    					for(var i=0; i<legsData.length; i++) {
	    						if(!this.isNotEmptyOrNull(legsData[i].LOC_GRND_MIN_QTY)) {
	    							isCallService = false;
	    						}
	    					}
	    				}
	    			}
	    		}
	    	}
	    	return isCallService;
    	}catch (e) {
    		console.log("Error in triggerTimeNCostService");
		}
    };

    constructorFn.callTimeCostService = function(routeMasterInfo,legMasterInfo,serviceSuccessCallback,isLocalTime,canCallTimeNCodeService,needToCallDefaultService) {
    	var serviceUrl = ROUTE_TIMECOST_SERVICE_DATA_URL;
    	var paramsMap;
    	var routeInfos = JSON.stringify(routeMasterInfo, replacer);
    	var legMasterInfos = JSON.stringify(legMasterInfo, replacer);
    	paramsMap ={
    			"browserSessionId":getBrowserSessionId(),
    			"commonCaseId":getCommonCaseId(),
    			"timeReference": isLocalTime ? "L" : "Z",
    			"routeInfos" : routeInfos,
    			"legMasterInfos" : legMasterInfos,
    			"canCallTimeNCodeService" : canCallTimeNCodeService,
    			"needToCallDefaultService" : needToCallDefaultService,
    			"datatype":DATA_TYPE_DEFAULT_VALUES,
    			"planWeek":getSelectedPlanWeek(),
    			"effDayPatternStr": parent.getSelectedEffDayStrPattern(),
    			"scheduleId":getScheduleId(),
    			"majorVersion":1,
    			"minorVersion":0
    		};
    	if(paramsMap) {
    		showProgressDialog(true, "Loading time and cost values...");
    		callService({
    			url : serviceUrl,
    			paramsMap: paramsMap,
    			successCallback : serviceSuccessCallback != undefined ? serviceSuccessCallback : this.onTimeCostServiceSuccess, 
    			failureCallback : this.onTimeCostServiceFailure,
    			showProgressWindow : false
    		});		
    	}
    };
    constructorFn.onTimeCostServiceSuccess = function(response, io) {
    	showProgressDialog(false);
    	if(response && response._errorCd && response._errorCd > 0) {
    		showErrorMsg(response._errorDesc);
    	} else {
    		//this.onDefaultsServiceSuccess(response, io);
    	}
    };
    
    constructorFn.onTimeCostServiceFailure = function(response, io){
    	onServiceRequestFailure(response, io);
    };
    var _instance;

    return {
        getInstance: function() {
            if (_instance == undefined) {
                _instance = constructorFn;
                _instance.initialize();
            }
            return _instance;
        }
    };
}
function DefaultServiceManager() {

    function constructorFn() {
        this.initialize();
    };

    constructorFn.initialize = function() {
        //
    };
    
    //pass routeGridId as null if there is no parent route grid and pass routeData obj
    constructorFn.callDefaultValueServiceOnEquipTypeChange = function(that, serviceSuccessCallback, routeGridId, routeData) {
    	if(that.attr("data-bind").indexOf("value:EQUIP_TYPE") > -1) {
    		var legsGrid;
    		var legsData;
    		if(routeGridId != null && that.closest("div.k-grid.k-widget").attr("id") == routeGridId) {
    			routeData = that.closest("div.k-grid.k-widget").data("kendoGrid").dataItem(that.closest("tr")).toJSON();
    			legsGrid = that.closest("tr").next().find("div.k-grid.k-widget").data("kendoGrid");
        		legsData = legsGrid.dataSource.data().toJSON();
    		}else {
    			legsGrid = that.closest("div.k-grid.k-widget").data("kendoGrid");
    			legsData = legsGrid.dataSource.data().toJSON();
    		}
    	//	var routeData = parent.selectedRouteList;//var routeData = grid.data("kendoGrid").dataItem(legsGrid.closest("tr").prev());
    		//var legsData = parent.selectedLegList;//var legsData = legsGrid.data("kendoGrid").dataSource.data();
    		this.callDefautValuesService([routeData], legsData, serviceSuccessCallback);
    	}
    };

    constructorFn.callDefautValuesService = function(routeMasterInfo ,legMasterInfo,serviceSuccessCallback) {
    	var serviceUrl = ROUTE_SERVICE_DATA_URL;
    	var paramsMap;
    	var routeInfos = JSON.stringify(routeMasterInfo, "");
    	var legMasterInfos = JSON.stringify(legMasterInfo, "");
    	paramsMap ={
    			"browserSessionId":getBrowserSessionId(),
    			"commonCaseId":getCommonCaseId(),
    			"planWeek":getSelectedPlanWeek(),
    			"effDayPatternStr": parent.getSelectedEffDayStrPattern(),
    			"scheduleId":getScheduleId(),
    			"majorVersion":1,
    			"minorVersion":0,
    			"datatype":DATA_TYPE_DEFAULT_VALUES,
    			"routeInfos" : routeInfos,
    			"legMasterInfos" : legMasterInfos
    		};
    	if(paramsMap) {
    		//showProgressDialog(true, "Loading default values...");
    		callService({
    			url : serviceUrl,
    			paramsMap: paramsMap,
    			successCallback : serviceSuccessCallback != undefined ? serviceSuccessCallback : this.onDefaultValuesServiceSuccess, 
    			failureCallback : this.onDefaultValuesServiceFailure,
    			showProgressWindow : false
    		});		
    	}
    };

    constructorFn.onDefaultValuesServiceSuccess = function(response, io) {
    	showProgressDialog(false);
    	if(response && response._errorCd && response._errorCd > 0) {
    		showErrorMsg(response._errorDesc);
    	} else {
    		//this.onDefaultsServiceSuccess(response, io);
    	}
    };

    constructorFn.onDefaultValuesServiceFailure = function(response, io){
    	onServiceRequestFailure(response, io);
    };
    var _instance;

    return {
        getInstance: function() {
            if (_instance == undefined) {
                _instance = constructorFn;
                _instance.initialize();
            }
            return _instance;
        }
    };
}
function ValidationServiceManager() {

	function constructorFn() {
        this.initialize();
    };

    constructorFn.initialize = function() {
        //
    };

    constructorFn.callValidationService = function(dataType, modeDesc, capacityDesc, carrierDesc, routeDesc, equipDesc,legDesc, routeContextCd, successCallBack, hideProgressBar) {
    	var serviceUrl = ROUTE_SCHEDULE_VALIDATION_SERVICE_DATA_URL + dataType;
    	var paramsMap;
    	paramsMap = {
    			"browserSessionId":getBrowserSessionId(),
    			"commonCaseId":getCommonCaseId(),
    			"scheduleId":getScheduleId(),
    			"effDayPatternStr": parent.getSelectedEffDayStrPattern(),
    			"modeDesc" : modeDesc,
    			"capacityDesc" : capacityDesc,
    			"carrierDesc" : carrierDesc,
    			"routeTypeDesc" : routeDesc,
    			"equipDesc" : equipDesc,
    			"legDesc":legDesc,
    			"routeContextCD":routeContextCd
    		};
    	if(paramsMap) {
    		if(hideProgressBar) {
    			showProgressDialog(false, "Waiting for results...");
    		}else {
    			showProgressDialog(true, "Waiting for results...");
    		}
    		callService({
    			url : serviceUrl,
    			paramsMap: paramsMap,
    			successCallback : successCallBack != null ? successCallBack : this.onValidationServiceSuccess, 
    			failureCallback : this.onValidationServiceFailure,
    			showProgressWindow : false
    		  });		
    	}
    };

    constructorFn.onValidationServiceSuccess = function(response, io) {
    	showProgressDialog(false);
    	if(response && response._errorCd && response._errorCd > 0) {
    		showErrorMsg(response._errorDesc);
    	} else {
    		SkdGridHelper.getSkdGridManager().openSelectLocDialog(searchPopupBtn.uniqueId, searchPopupBtn.title, response);
    	}
    };

    constructorFn.onValidationServiceFailure = function(response, io){
    	onServiceRequestFailure(response, io);
    };
    var _instance;

    return {
        getInstance: function() {
            if (_instance == undefined) {
                _instance = constructorFn;
                _instance.initialize();
            }
            return _instance;
        }
    };
}

function SaveUpdateServiceManager() {

	function constructorFn() {
        this.initialize();
    };

    constructorFn.initialize = function() {
        //
    };
    
    constructorFn.verifyUserAccess = function(routes) {
    	var flag = true;
    	if(routes != null && routes.length > 0) {
    		var errorString = "Routes with mv num [";
    		for(var i=0; i<routes.length; i++) {
    			if(getResourceAccessType(getRouteType(routes[i].ROUTE_CONTEXT_CD)) != 2) {
    				errorString = errorString + routes[i].MV_NUM + ",";
    				flag = false;
    			}
    		}
    		if(!flag) {
	    		errorString = errorString.slice(0,-1);
	    		errorString = errorString + "] don't have edit rights";
	    		showErrorMsg(errorString);
    		}
    	}
    	return flag;
    };

    constructorFn.callSaveUpdateValuesService = function(routeMasterInfo, legMasterInfo, timeReference, successCallBack, hideProgressBar) {
    	if(this.verifyUserAccess(routeMasterInfo)) {
	    	var serviceUrl = ROUTE_SERVICE_DATA_URL;
	    	var routeInfos = JSON.stringify(routeMasterInfo, "");
	    	var legMasterInfos = JSON.stringify(legMasterInfo, "");
	    	var paramsMap;
	    	paramsMap ={
	    			"browserSessionId":getBrowserSessionId(),
	    			"commonCaseId":getCommonCaseId(),
	    			"planWeek":getSelectedPlanWeek(),
	    			"effDayPatternStr": parent.getSelectedEffDayStrPattern(),
	    			"scheduleId":getScheduleId(),
	    			"majorVersion":1,
	    			"minorVersion":0,
	    			"timeReference": timeReference,
	    			"datatype":DATA_TYPE_SAVE_UPDATE_VALUES,
	    			"routeInfos" : routeInfos,
	    			"legMasterInfos" : legMasterInfos
	    		};
	    	if(paramsMap) {
	    		if(hideProgressBar) {
	    			showProgressDialog(false, "Waiting for results...");
	    		}else {
	    			showProgressDialog(true, "Waiting for results...");
	    		}
	    		callService({
	    			url : serviceUrl,
	    			paramsMap: paramsMap,
	    			successCallback : successCallBack != null ? successCallBack : this.onSaveUpdateValuesServiceSuccess, 
	    	    	failureCallback : this.onSaveUpdateValuesServiceFailure,
	    			showProgressWindow : false
	    		});
	    	}
    	}
    };

    constructorFn.onSaveUpdateValuesServiceSuccess = function(response, io) {
    	showProgressDialog(false);
    	if(response && response._errorCd && response._errorCd > 0) {
    		showErrorMsg(response._errorDesc);
    	} else {
    		//parent.getDashboardContentWindow('queryWindowDiv').applySkdMxTempFav();
    		showErrorMsg("Successfully Saved");
    	}
    };

    constructorFn.onSaveUpdateValuesServiceFailure = function(response, io){
    	onServiceRequestFailure(response, io);
    };
    var _instance;

    return {
        getInstance: function() {
            if (_instance == undefined) {
                _instance = constructorFn;
                _instance.initialize();
            }
            return _instance;
        }
    };
}

function AvailableRouteListServiceManager() {

	function constructorFn() {
        this.initialize();
    };

    constructorFn.initialize = function() {
        //
    };

    constructorFn.callAvailableRouteListService = function(mode, firstParam, secondParam,successCallBack,showProgressWindow) {
    	var serviceUrl = AVAILABLE_ROUTES_SERVICE_DATA_URL + "AvailableRouteNumberRequest";
		var paramsMap;
		paramsMap = {
				"browserSessionId":parent.getBrowserSessionId(),
				"commonCaseId":parent.getCommonCaseId(),
				"effDayPatternStr": parent.getSelectedEffDayStrPattern(),
				"mode" : mode,
				"firstParam" : firstParam,
				"secondParam" : secondParam
			};
		if(paramsMap) {
			callService({
				url : serviceUrl,
				paramsMap: paramsMap,
				successCallback : successCallBack != null ? successCallBack : this.onAvailableRouteListRequestSuccess,
				failureCallback : this.onAvailableRouteListRequestFailure,
				showProgressWindow : showProgressWindow != undefined ? showProgressWindow : false
			});		
		}
	};

    constructorFn.onAvailableRouteListRequestSuccess = function(response, io) {
    	showProgressDialog(false);
    	if(response && response._errorCd && response._errorCd > 0) {
    		showErrorMsg(response._errorDesc);
    	} else {
//    		response.availableRouteNumberList.availableRouteNumber
    	}
    };

    constructorFn.onAvailableRouteListRequestFailure = function(response, io){
    	onServiceRequestFailure(response, io);
    };
    var _instance;

    return {
        getInstance: function() {
            if (_instance == undefined) {
                _instance = constructorFn;
                _instance.initialize();
            }
            return _instance;
        }
    };
}
function MasterDataServiceManager() {

	function constructorFn() {
        this.initialize();
    };

    constructorFn.initialize = function() {
        //
    };

    constructorFn.callMasterDataService = function(serviceUrl, successCallBack, hideProgressBar) {
    	var paramsMap;
    	paramsMap = {
    			"browserSessionId":getBrowserSessionId(),
    			"commonCaseId":getCommonCaseId(),
    			"effDayPatternStr": parent.getSelectedEffDayStrPattern(),
                 "uniqueRequestId": getUniqueId(),
                 "rand": getTime()
    		};
    	if(paramsMap) {
    		if(hideProgressBar) {
    			showProgressDialog(false, "Waiting for results...");
    		}else {
    			showProgressDialog(true, "Waiting for results...");
    		}
    		callService({
    			url : serviceUrl,
    			paramsMap: paramsMap,
    			successCallback : successCallBack != null ? successCallBack : this.onMasterDataServiceSuccess, 
    			failureCallback : this.onMasterDataServiceFailure,
    			showProgressWindow : false
    		  });		
    	}
    };

    constructorFn.onMasterDataServiceSuccess = function(response, io) {
    	showProgressDialog(false);
    	if(response && response._errorCd && response._errorCd > 0) {
    		showErrorMsg(response._errorDesc);
    	} else {
    		SkdGridHelper.getSkdGridManager().openSelectLocDialog(searchPopupBtn.uniqueId, searchPopupBtn.title, response);
    	}
    };

    constructorFn.onMasterDataServiceFailure = function(response, io){
    	onServiceRequestFailure(response, io);
    };
    var _instance;

    return {
        getInstance: function() {
            if (_instance == undefined) {
                _instance = constructorFn;
                _instance.initialize();
            }
            return _instance;
        }
    };
}
