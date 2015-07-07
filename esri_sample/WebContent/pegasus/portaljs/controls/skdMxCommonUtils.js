function getRouteObj(mode, capacityCd, conveyanceCd, routeTypeCd, routeContextCd){
	return {
			"OPERATION_CD": parent.OPERATION_CD_ADD,
			"ROUTE_ID": EMPTY_STRING,
			"MV_NUM":  EMPTY_STRING,
			"LEG_TYPE": EMPTY_STRING,
			"EQUIP_TYPE": EMPTY_STRING,
			"MODE": mode != null ? mode : EMPTY_STRING,
			"CAPACITY_CD" : capacityCd != null ? capacityCd : EMPTY_STRING,
			"EFFDAYSZ_DESC": EMPTY_STRING,
			"HOL_EFFDAYSZ_DESC": EMPTY_STRING,
			"EFFDAYSL_ORIG_DESC": EMPTY_STRING,
			"HOL_EFFDAYSL_ORIG_DESC": EMPTY_STRING,
			"EFFDAYSZ_ORIG_DESC": EMPTY_STRING,
			"HOL_EFFDAYSZ_ORIG_DESC": EMPTY_STRING,
			"EFF_DAYS_OFFSET_L": EMPTY_STRING,
			"ANCHOR_LEG_SEQ": EMPTY_STRING,
			"CHANGE_FLAG": EMPTY_STRING,
			"PERFORM_TM_CALC_FLAG": EMPTY_STRING,
			"ANCHOR_LEG_TM_CD": EMPTY_STRING,
			"CARRIER_TYPE": EMPTY_STRING,
			"CAL_BUTTON": EMPTY_STRING,
			"ROUTE_TYPE_CD": routeTypeCd != null ? routeTypeCd : EMPTY_STRING,
			"ROUTE_CONTEXT_CD": routeContextCd != null ? routeContextCd : EMPTY_STRING,
			"CC_COST_AMT": EMPTY_STRING,
			"COST_AMT": EMPTY_STRING,
			"ONEWAY_COST_AMT": EMPTY_STRING,
			"ROUNDTRIP_COST_AMT": EMPTY_STRING,
			"DRIVER_COST_AMT": EMPTY_STRING,
			"OPERATING_COST_AMT": EMPTY_STRING,
			"CAPITAL_COST_AMT": EMPTY_STRING,
			"DAILYRATE_PLUSCC_CHG_AMT": EMPTY_STRING,
			"TOTALMONTH_COST_AMT": EMPTY_STRING,
			"CCAP_STATE_DESC": EMPTY_STRING,
			"USE_LEG_MINS_FLAG": EMPTY_STRING,
			"LAST_FORTE_OCA_NBR": EMPTY_STRING,
			"TEMP_RT_FLAG": EMPTY_STRING,
			"GBT_GEN_CD": EMPTY_STRING,
			"BAL_MV_NUM": EMPTY_STRING,
			"LAST_UPDT_USER_NM": EMPTY_STRING,
			"LAST_UPDT_TIME": EMPTY_STRING,
			"SCHEDULE_ID": EMPTY_STRING,
			"MASTER_PERSL_FLAG": EMPTY_STRING,
			"CARRYOVER_FLAG": EMPTY_STRING,
			"OCA_NBR": EMPTY_STRING,
			"SECRET_0LAS_FLAG": EMPTY_STRING,
			"SECRET_CCAP_FLAG": EMPTY_STRING,
			"SECRET_LOADPLANS_FLAG": EMPTY_STRING,
			"SECRET_AGFS_FLAG": EMPTY_STRING,
			"SECRET_TRIP_FLAG": EMPTY_STRING,
			"SECRET_CREW_FLAG": EMPTY_STRING,
			// Display Only (Edit mode)
			"ROUTE_LOCAL_DAYS": EMPTY_STRING,
			"ROUTE_ZULU_DAYS": EMPTY_STRING,
			"ROUTE_NOOP_DAYS_L": EMPTY_STRING,
			"ROUTE_NOOP_DAYS_Z": EMPTY_STRING,
			"ROUTE_HOL_DAYS_L": EMPTY_STRING,
			"ROUTE_HOL_DAYS_Z": EMPTY_STRING,
			"ROUTE_KEYWORD_EFFDT_L": EMPTY_STRING,
			"ROUTE_KEYWORD_EFFDT_Z": EMPTY_STRING,
			"ROUTE_FULL_EFFDT_L": EMPTY_STRING,
			"ROUTE_FULL_EFFDT_Z": EMPTY_STRING,
			"CONVEYANCE": conveyanceCd != null ? conveyanceCd : EMPTY_STRING,
			//Extra columns
			"FORTE_STAGE_LOAD_DAY": EMPTY_STRING,
			"IN_DST": EMPTY_STRING,
			"VALID": EMPTY_STRING,
			"IATA_MV_NBR": EMPTY_STRING,
			"DSTPARENT_ROUTE_ID":  EMPTY_STRING
	};
}

function getLegObj(mode, capacityCd, conveyanceCd, routeContextCd, routeTypeCd,legObject, isLeg){
	return {
			"OPERATION_CD": parent.OPERATION_CD_ADD,
			"ROUTE_ID": EMPTY_STRING,
			"LEG_ID": EMPTY_STRING,
			"MV_NUM": EMPTY_STRING,
			"EFFDAYSZ_ORDER": EMPTY_STRING,
			"MV_NUM_SEQ": 1,
			"ORIGIN": legObject !=undefined ? legObject["ORIGIN"]: EMPTY_STRING,
			"DESTINATION": legObject !=undefined ? legObject["DESTINATION"]:EMPTY_STRING,
			"EQUIP_TYPE": EMPTY_STRING,
			"CONVEYANCE": conveyanceCd != null ? conveyanceCd : EMPTY_STRING,
			"ORIGIN_DAY_Z_NBR": EMPTY_STRING,
			"ORIGIN_DAY_L_NBR": EMPTY_STRING,
			"CAL_BUTTON": EMPTY_STRING,
			"BLOCK_OUT_Z_TM": EMPTY_STRING,
			"BLOCK_OUT_L_TM": EMPTY_STRING,
			"BLOCK_IN_Z_TM": EMPTY_STRING,
			"BLOCK_IN_L_TM": EMPTY_STRING,
			"BLOCK_INDAY_Z_NBR": EMPTY_STRING,
			"BLOCK_INDAY_L_NBR": EMPTY_STRING,
			"BLOCK_OFF_Z_TM": EMPTY_STRING,
			"BLOCK_OFF_L_TM": EMPTY_STRING,
			"BLOCK_ON_Z_TM": EMPTY_STRING,
			"BLOCK_ON_L_TM": EMPTY_STRING,
			"FLIGHT_MIN_QTY": EMPTY_STRING,
			"LEG_MILES": EMPTY_STRING,
			"LOC_GRND_MIN_QTY": EMPTY_STRING,
			"LEG_MIN_QTY": EMPTY_STRING,
			"MAX_PAYLOAD_WT": EMPTY_STRING,
			"MAX_PAYLOAD_CU": EMPTY_STRING,
			"LEG_TYPE": EMPTY_STRING,
			"CHANGE_FLAG": EMPTY_STRING,
			"MPH": EMPTY_STRING,
			"EFFDAYSZ_DESC": EMPTY_STRING,
			"EFF_DAYS_OFFSET_L": EMPTY_STRING,
			"HOL_EFFDAYSZ_DESC": EMPTY_STRING,
			"TAXIOUT_DESC": EMPTY_STRING,
			"TAXIIN_DESC": EMPTY_STRING,
			"FLIGHT_DESC": EMPTY_STRING,
			"SOURCE_NBR": EMPTY_STRING,
			"GLOBAL_RGN_CD": EMPTY_STRING,
			"ZONE_CD": EMPTY_STRING,
			"SCHEDULE_ID": EMPTY_STRING,
			"MASTER_PERSL_FLAG": EMPTY_STRING,
			"CARRYOVER_FLAG": EMPTY_STRING,
			"ALLOC_FLAG": EMPTY_STRING,
			"OCA_NBR": EMPTY_STRING,
			"LAST_UPDT_USER": EMPTY_STRING,
			"LAST_UPDT_TIME": EMPTY_STRING,
			"REASON_CD": EMPTY_STRING,
			"BREAK_MIN_QTY": EMPTY_STRING,
			"ORIG_TECH_STOP_FLAG": EMPTY_STRING,
			"DEST_TECH_STOP_FLAG": EMPTY_STRING,
			"MAX_PAYLOAD_WGT_SRC_CD": EMPTY_STRING,
			"ESTOPS_SCHE_FLAG": EMPTY_STRING,
			"LEG_KMS": EMPTY_STRING,
			"OWNER_LOC_CD": EMPTY_STRING,
			"CARRIER_STG_TM": EMPTY_STRING,
			"TRACK_EQUIP_TYPE": EMPTY_STRING,
			"TRACK_PERSTAGE_TM": EMPTY_STRING,
			"TRACK_STAGE_TM": EMPTY_STRING,
			"TRAIL_OPT": EMPTY_STRING,
			"TRAIL_1PRESTAGE_TM": EMPTY_STRING,
			"TRAIL_1STAGE_TM": EMPTY_STRING,
			"TRAIL_2PRESTAGE_TM": EMPTY_STRING,
			"TRAIL_2STAGE_TM": EMPTY_STRING,
			"TRAIL_AVAIL_TM": EMPTY_STRING,
			"UNLOAD_TM": EMPTY_STRING,
			"LOAD_TM": EMPTY_STRING,
			"SCAC_CD": EMPTY_STRING,
			"IATA_MV_NBR": EMPTY_STRING,
			"IN_DST": EMPTY_STRING,
			"TEMP_RT": EMPTY_STRING,
			"BAL_MV_NBR": EMPTY_STRING,
			"CARRIER_TYPE": EMPTY_STRING,
			"COMMENTS": EMPTY_STRING,
			"DAILY_RT_CC_CHG": EMPTY_STRING,
			"TOTAL_MTH_CST": EMPTY_STRING,
			"MODE": mode != null ? mode : EMPTY_STRING,
			// Display Only (Edit mode)
			"LOCAL_DAYS": EMPTY_STRING,
			"ZULU_DAYS": EMPTY_STRING,
			"LOCAL_WEEKS_L": EMPTY_STRING,
			"LOCAL_WEEKS_Z": EMPTY_STRING,
			"LOCAL_DEP": EMPTY_STRING,
			"LOCAL_ARR": EMPTY_STRING,
			"ZULU_DEP": EMPTY_STRING,
			"ZULU_ARR": EMPTY_STRING,
			"FLIGHT_MINS": EMPTY_STRING,
			"BLOCK_TIME_Z": EMPTY_STRING,
			"LOC_GRND_TIME": EMPTY_STRING,
			"TAXI_OUT_MIN_Z": EMPTY_STRING,
			"B_ONTIME_L": EMPTY_STRING,
			"B_ONTIME_Z": EMPTY_STRING,
			"B_OFFTIME_L": EMPTY_STRING,
			"B_OFFTIME_Z": EMPTY_STRING,
			"BLK_HHMM_L": EMPTY_STRING,
			"BLK_HHMM_Z": EMPTY_STRING,
			"LANDING_TIME_L": EMPTY_STRING,
			"LANDING_TIME_Z": EMPTY_STRING,
			"TAXI_IN_MIN_Z": EMPTY_STRING,
			"OPERATING_COST": EMPTY_STRING,
			"TOTAL_FREQ": EMPTY_STRING,
			"FLIGHT_COUNT": EMPTY_STRING,
			"NOOP_DAYS_L": EMPTY_STRING,
			"NOOP_DAYS_Z": EMPTY_STRING,
			"LEG_HOL_DAYS_L": EMPTY_STRING,
			"LEG_HOL_DAYS_Z": EMPTY_STRING,
			"KEYWORD_EFFDT_L": EMPTY_STRING,
			"KEYWORD_EFFDT_Z": EMPTY_STRING,
			"FULL_EFFDT_L": EMPTY_STRING,
			"FULL_EFFDT_Z": EMPTY_STRING,
			"ROUTE_TYPE_CD": routeTypeCd != null ? routeTypeCd : EMPTY_STRING,
			"ROUTE_CONTEXT_CD": routeContextCd != null ? routeContextCd : EMPTY_STRING,
			"CAPACITY_CD" : capacityCd != null ? capacityCd : EMPTY_STRING,
			"isLeg":isLeg != null ? isLeg : true
	};
}

function getAllocLegObj(legObj,isLeg) {
	var returnObj = {
		"ALLOCATION_EFF_Z" : EMPTY_STRING,
		"ALLOCATION_EFF_L" : EMPTY_STRING,
		"ALLOC_CUBE" : EMPTY_STRING,
		"ALLOC_ID" : randomString(),
		"ALLOC_POS" : EMPTY_STRING,
		"ALLOC_VOLUMES" : EMPTY_STRING,
		"CAPACITY_CD" : (legObj != undefined && legObj["CAPACITY_CD"] != null) ? legObj["CAPACITY_CD"] : EMPTY_STRING,
		"CARRIER_TYPE" : (legObj != undefined && legObj["CARRIER_TYPE"] != null) ? legObj["CARRIER_TYPE"] : EMPTY_STRING,
		"CHANGE_FLAG" : (legObj != undefined && legObj["CHANGE_FLAG"] != null) ? legObj["CHANGE_FLAG"] : EMPTY_STRING,
		"CONVERT_FLAG" : (legObj != undefined && legObj["CONVERT_FLAG"] != null) ? legObj["CONVERT_FLAG"] : EMPTY_STRING,
		"DESTINATION" : (legObj != undefined && legObj["DESTINATION"] != null) ? legObj["DESTINATION"] : EMPTY_STRING,
		"DOWN_LOAD_AMT" : EMPTY_STRING,
		"EQUIP_TYPE" : (legObj != undefined && legObj["EQUIP_TYPE"] != null) ? legObj["EQUIP_TYPE"] : EMPTY_STRING,
		"FULL_EFFDT_L" : EMPTY_STRING,
		"FULL_EFFDT_Z" : EMPTY_STRING,
		"LAST_UPDT_TIME" : EMPTY_STRING,
		"LAST_UPDT_USER_NM" : EMPTY_STRING,
		"LEG_ID" : (legObj != undefined && legObj["LEG_ID"] != null) ? legObj["LEG_ID"] : EMPTY_STRING,
		"LEG_TYPE" : (legObj != undefined && legObj["LEG_TYPE"] != null) ? legObj["LEG_TYPE"] : EMPTY_STRING,
		"LOC_ALLOCS" : EMPTY_STRING,
		"MODE" : (legObj != undefined && legObj["MODE"] != null) ? legObj["MODE"] : EMPTY_STRING,
		"MV_NUM" : (legObj != undefined && legObj["MV_NUM"] != null) ? legObj["MV_NUM"] : EMPTY_STRING,
		"MV_NUM_SEQ" : (legObj != undefined && legObj["MV_NUM_SEQ"] != null) ? legObj["MV_NUM_SEQ"] : EMPTY_STRING,
		"OCA_NBR" : (legObj != undefined && legObj["OCA_NBR"] != null) ? legObj["OCA_NBR"] : EMPTY_STRING,
		"OPERATION_CD" : parent.OPERATION_CD_ADD,
		"ORIGIN" : (legObj != undefined && legObj["ORIGIN"] != null) ? legObj["ORIGIN"] : EMPTY_STRING,
		"PROD_GRP_NM" : EMPTY_STRING,
		"ROUTE_ID" : (legObj != undefined && legObj["ROUTE_ID"] != null) ? legObj["ROUTE_ID"] : EMPTY_STRING,
		"ROUTE_CONTEXT_CD" : (legObj != undefined && legObj["ROUTE_CONTEXT_CD"] != null) ? legObj["ROUTE_CONTEXT_CD"] : EMPTY_STRING,
		"ROUTE_TYPE_CD" : (legObj != undefined && legObj["ROUTE_TYPE_CD"] != null) ? legObj["ROUTE_TYPE_CD"] : EMPTY_STRING,
		"SUM_FLAG" :  EMPTY_STRING,
		"SUM_UNIT_MEAS_CD" : EMPTY_STRING,
		"UP_LIFT_AMT" :  EMPTY_STRING,
		"isLeg":isLeg != null ? isLeg : true
	};
	if(!isLeg){
		returnObj["LEG_FULL_EFFDT_L"] = (legObj != undefined && legObj["LEG_FULL_EFFDT_L"] != null) ? legObj["LEG_FULL_EFFDT_L"] : EMPTY_STRING;
		returnObj["LEG_FULL_EFFDT_Z"] = (legObj != undefined && legObj["LEG_FULL_EFFDT_Z"] != null) ? legObj["LEG_FULL_EFFDT_Z"] : EMPTY_STRING;
		returnObj["LEG_EFFDAYSL_DESC"] = (legObj != undefined && legObj["LEG_EFFDAYSL_DESC"] != null) ? legObj["LEG_EFFDAYSL_DESC"] : EMPTY_STRING;
		returnObj["LEG_EFFDAYSZ_DESC"] = (legObj != undefined && legObj["LEG_EFFDAYSZ_DESC"] != null) ? legObj["LEG_EFFDAYSZ_DESC"] : EMPTY_STRING;
	}else{
		returnObj["LEG_FULL_EFFDT_L"] = (legObj != undefined && legObj["FULL_EFFDT_L"] != null) ? legObj["FULL_EFFDT_L"] : EMPTY_STRING;
		returnObj["LEG_FULL_EFFDT_Z"] = (legObj != undefined && legObj["FULL_EFFDT_Z"] != null) ? legObj["FULL_EFFDT_Z"] : EMPTY_STRING;
		returnObj["LEG_EFFDAYSL_DESC"] = (legObj != undefined && legObj["FULL_EFFDAY_HOLIDAY_L"] != null) ? legObj["FULL_EFFDAY_HOLIDAY_L"] : EMPTY_STRING;
		returnObj["LEG_EFFDAYSZ_DESC"] = (legObj != undefined && legObj["FULL_EFFDAY_HOLIDAY_Z"] != null) ? legObj["FULL_EFFDAY_HOLIDAY_Z"] : EMPTY_STRING;
		
	}
	return returnObj;
}
function getLocAllocLegObj(allocObj) {
	return {
		"ALLOC_CUBE" : EMPTY_STRING,
		"ALLOC_ID" : (allocObj != undefined && allocObj["ALLOC_ID"] != null) ? allocObj["ALLOC_ID"] : EMPTY_STRING,
		"ALLOC_POS" : (allocObj != undefined && allocObj["ALLOC_POS"] != null) ? allocObj["ALLOC_POS"] : EMPTY_STRING,
		"ALLOC_WEIGHT" : EMPTY_STRING,
		"CAPACITY_CD" : (allocObj != undefined && allocObj["CAPACITY_CD"] != null) ? allocObj["CAPACITY_CD"] : EMPTY_STRING,
		"CARRIER_TYPE" : (allocObj != undefined && allocObj["CARRIER_TYPE"] != null) ? allocObj["CARRIER_TYPE"] : EMPTY_STRING,
		"CHANGE_FLAG" : (allocObj != undefined && allocObj["CHANGE_FLAG"] != null) ? allocObj["CHANGE_FLAG"] : EMPTY_STRING,
		"CONVERT_FLAG" : (allocObj != undefined && allocObj["CONVERT_FLAG"] != null) ? allocObj["CONVERT_FLAG"] : EMPTY_STRING,
		"DAYZ" : EMPTY_STRING,
		"DOWN_LOAD_AMT" : EMPTY_STRING,
		"EFFDAYSL_DESC" : EMPTY_STRING,
		"EFFDAYSZ_DESC" : EMPTY_STRING,
		"EXCESS_CUBE" : EMPTY_STRING,
		"EXCESS_WEIGHT" : EMPTY_STRING,
		"FULL_EFFDAY_HOLIDAY_L" : EMPTY_STRING,
		"FULL_EFFDAY_HOLIDAY_Z" : EMPTY_STRING,
		"FULL_EFFDT_L" : EMPTY_STRING,
		"FULL_EFFDT_Z" : EMPTY_STRING,
		"LAST_UPDT_TIME" : EMPTY_STRING,
		"LAST_UPDT_USER_NM" : EMPTY_STRING,
		"LEG_ID" : (allocObj != undefined && allocObj["LEG_ID"] != null) ? allocObj["LEG_ID"] : EMPTY_STRING,
		"LEG_TYPE" : (allocObj != undefined && allocObj["LEG_TYPE"] != null) ? allocObj["LEG_TYPE"] : EMPTY_STRING,
		"LOC_ALLOC_ID" : EMPTY_STRING,
		"LOC_ALLOC_VOLUMES" : EMPTY_STRING,
		"LOC_CD" : EMPTY_STRING,
		"MODE" : (allocObj != undefined && allocObj["MODE"] != null) ? allocObj["MODE"] : EMPTY_STRING,
		"OCA_NBR" : EMPTY_STRING,
		"OPERATION_CD" : parent.OPERATION_CD_ADD,
		"ORIG_DEST_CD" : EMPTY_STRING,
		"ROUTE_CONTEXT_CD:" : (allocObj != undefined && allocObj["ROUTE_CONTEXT_CD"] != null) ? allocObj["ROUTE_CONTEXT_CD"] : EMPTY_STRING,
		"ROUTE_TYPE_CD" : (allocObj != undefined && allocObj["ROUTE_TYPE_CD"] != null) ? allocObj["ROUTE_TYPE_CD"] : EMPTY_STRING,
		"SUM_FLAG" : (allocObj != undefined && allocObj["SUM_FLAG"] != null) ? allocObj["SUM_FLAG"] : "False",
		"SUM_UNIT_MEAS_CD" : (allocObj != undefined && allocObj["SUM_UNIT_MEAS_CD"] != null) ? allocObj["SUM_UNIT_MEAS_CD"] : EMPTY_STRING,
		"UP_LIFT_AMT" : EMPTY_STRING,
		"USED_CUBE" : EMPTY_STRING,
		"USED_WEIGHT" : EMPTY_STRING,
		"ALLOC_FULL_EFFDT_L":(allocObj != undefined && allocObj["FULL_EFFDT_L"] != null) ? allocObj["FULL_EFFDT_L"] : EMPTY_STRING,
		"ALLOC_FULL_EFFDT_Z":(allocObj != undefined && allocObj["FULL_EFFDT_Z"] != null) ? allocObj["FULL_EFFDT_Z"] : EMPTY_STRING
	};
}
function initializeKendoWinodw(isMapViewer) {
	var routeNuberDialog = $('#routeNumberDialog');
	routeNuberDialog.kendoWindow({
		 width: "390px",
         height: "350px",
        resizable: true,
        title: (isMapViewer? "Select Move Number": "Route Editor")
	});
	/*routeNuberDialog.focusout(function(event) {
    	routeNuberDialog.data("kendoWindow").close();
	});*/
	
	var routeNuberDialog2 = $('#truckNumberDialog');
	routeNuberDialog2.kendoWindow({
		 width: "110px",
         height: "300px",
        resizable: true,
        title: (isMapViewer? "Select Move Number": "Route Editor")
	});
	
	/*routeNuberDialog2.focusout(function(event) {
    	routeNuberDialog2.data("kendoWindow").close();
	});*/
}

function initalizeFlightRouteData(flightRoutesData){
	$("#listView").kendoListView({
        template: "<li>${firstNbr} ${lastNbr} ${flightNbrDesc}</li>",
        dataSource: {
            data:flightRoutesData
        }, 
        selectable: "single",
        change: function(e) {
            var index = this.select().index();
            var dataItem = this.dataSource.at(index);
            if(dataItem  != undefined){
                parent.SkdMxServiceHelper.getAvailableRouteListServiceManager().callAvailableRouteListService("Flight", dataItem.firstNbr, dataItem.lastNbr,onAvailableRouteListRequestSuccess);
            }
        }
    });
}


//Fdx - 6.	Route Assist UI for 8888 trucks
//a.	Need to force planner to enter 3 alpha characters
//when asking for rt # assistance for 8888 trucks
function onAvailableRouteListRequestSuccess(response, io) {
	parent.showProgressDialog(false);
	if(response && response.errorCd && response.errorCd > 0) {
		parent.showErrorMsg(response.errorDesc);
        return false;
	}else{
		onFlightDetailSuccess(response, io);
        return true;
	}
}

function onAvailableRouteListRequestFailure(response, io){
	parent.onServiceRequestFailure(response, io);
}

function onFlightDetailSuccess(response, io) {
	changeRoutObject= null;
	var subListView ;
	if(menu == "FT" || menu == "FF" || menu == "FC" || menu == "Flt Trunk" || menu == "Flt Feeder" || menu == "Flt CLH") {
		subListView = $("#subListView");
	}else {
		subListView = $("#trucksubListView");
	}
	if (!subListView.data("kendoListView")) {
		subListView.kendoListView({
			template: "<li>${mvNbr}</li>",
			dataSource: {
				data:response.availableRouteNumberList != null? response.availableRouteNumberList.availableRouteNumber:[]
			}, 
			change: function(e) {
				 var index = this.select().index();
		         var dataItem = this.dataSource.at(index);
		         changeRoutObject = new Object();
		         changeRoutObject.parentDiv = e.sender.wrapper.parent().parent();
		         changeRoutObject.value=dataItem.mvNbr;
			},
			selectable: "single"
		});
	}else {
		clearAndSetDataSource(response, io, subListView);
	}
}


function clearAndSetDataSource(response, io,subListView) {
	if(subListView != undefined && subListView.data("kendoListView")) {
		if(response != null && response.availableRouteNumberList != null) {
			subListView.data("kendoListView").dataSource.data(response.availableRouteNumberList.availableRouteNumber);
		}else {
			subListView.data("kendoListView").dataSource.data([]);
		}
	}
}

/**
 * Route pop up issue... validate whether the popup is initialized successfully and loaded ..if not then initialize and load the data...
 * @param isMapviewer
 * @param isTruckMode
 */
function validateRoutePopupInitialization(isMapviewer, isTruckMode){
    try{
        if(isTruckMode){
            if($('#truckNumberDialog').data("kendoWindow") == undefined){
                initializeKendoWinodw(isMapviewer);
            }
        }else {
            if($('#routeNumberDialog').data("kendoWindow") == undefined ){
                initializeKendoWinodw(isMapviewer);
            }
            if(( $("#listView").data("kendoListView")  == undefined) || ($("#listView").data("kendoListView") != undefined && $("#listView").data("kendoListView").dataSource.data().length <= 0)){
                initalizeFlightRouteData(getDataSourceData("FlightRoutes"));
            }
        }
    }catch (err){
        console.log("Error while initializing and loading");
    }
}

//Fdx - 6.	Route Assist UI for 8888 trucks
//a.	Need to force planner to enter 3 alpha characters
//when asking for rt # assistance for 8888 trucks
/**
 * Route popup handler
 * @param btn
 * @param grid_Id
 * @param isMapviewer
 * @param mvNmId
 * @param routeId
 * @param routeTypeCd
 */
function routeRowHandler(btn, grid_Id, isMapviewer, mvNmId, routeId, routeTypeCd) {
	if(isMapviewer && !(document.getElementById("SchdleMntnceMapDwrGridRadio_"+routeId).checked)){
		return;
	}
	var index  = $(btn).closest("tr").index();
	var grid;
	if(!isMapviewer){
		grid = $("#"+grid_Id).data("kendoGrid");
		menu = grid.dataItem($(btn).closest("tr"))["ROUTE_CONTEXT_CD"];
	}
	if (menu  == "Flt CLH" || menu == "FC") {
		parent.showErrorMsg("Route number must be 6 alphanumeric characters");
	} else if(menu == "FT" || menu == "FF" || menu == "Flt Trunk" || menu == "Flt Feeder" ) {
		$('#truckNumberDialog').hide();
		$("#routeNumberDialog").show();
        //fix for route pop up issue...
        validateRoutePopupInitialization(isMapviewer, false);
        $('#routeNumberDialog').data("kendoWindow").center();
		$('#routeNumberDialog').data("kendoWindow").open();
		$("#routeNumberDialog").attr("rowIndex", index);
		$("#routeNumberDialog").data("btnObj", btn);
		if($("#subListView").data("kendoListView")) {
			clearAndSetDataSource(null,null,$("#subListView"));//FDX-1291 SMD & WIP: Clear MvNo Pop Up Routes (Rightside) on Subsequent Launch
			$("#subListView").data("kendoListView").refresh();
		}
		if($("#listView").data("kendoListView")) {
			$("#listView").data("kendoListView").refresh();
		}
	}else {
		var routeVal;
		var routeType;
		if(isMapviewer){
			routeVal = $("#"+mvNmId).val();
			routeType = routeTypeCd; //"Shuttle"; //Shuttle , Linehaul
		}else {
			grid = $("#"+grid_Id).data("kendoGrid");
			routeVal = grid.dataItem($(btn).closest("tr"))["MV_NUM"];
			routeType = grid.dataItem($(btn).closest("tr"))["ROUTE_TYPE_CD"];
		}
        validateRoutePopupInitialization(isMapviewer, true);
		//if(isNotEmptyOrNull(routeVal) && isNotEmptyOrNull(routeType)) {
        //Fdx - 	Route Assist UI for 8888 trucks
        //a.	Need to force planner to enter 3 alpha characters
        //when asking for rt # assistance for 8888 trucks
			parent.SkdMxServiceHelper.getAvailableRouteListServiceManager().callAvailableRouteListService("Truck", routeType, routeVal,function(response, io){
                var isRequestSuccess = onAvailableRouteListRequestSuccess(response, io);
                if(isRequestSuccess ){
                    $("#truckNumberDialog").show();
                    $('#truckNumberDialog').data("kendoWindow").center();
                    $('#truckNumberDialog').data("kendoWindow").open();
                    $("#routeNumberDialog").hide();
                    $("#truckNumberDialog").attr("rowIndex", index);
                    $("#truckNumberDialog").data("btnObj", btn);
                }
            });
		/*}else {
			parent.showErrorMsg("There must be 2 leading Alphabetic Characters for Route #");
		}*/
	}
}

function isNotEmptyOrNull(string) {
	if(string != undefined && string != null && string != 'undefined' && string != 'null' && string.toString().trim() != EMPTY_STRING) {
		return true;
	}
	return false;
}

function getDataSourceData(dataType) {
	try {
		return parent.getDashboardContentWindow(parent.DASHBOARD_ID_QUERY).getQueryDatasources()[dataType].data().toJSON();
	}catch (e) {
		parent.showErrorMsg("Error occured while fetching the data for " + dataType);
	}
}

var ROUTE_CONTEXT_CODES = {
	FLT_CLH: "Flt CLH",
	FLT_TRUNK: "Flt Trunk",
	FLT_FEEDER: "Flt Feeder",
	TRK_GBT: "Trk Ovr Z GBT",
	TRK_SLH: "Trk Std LH",
	TRK_GNP: "Trk Std GNP",
	TRK_SSH: "Trk Std SH"
};

var MODE_HEADER_LABELS = {
	FLT_CLH: "Flight - Commercial Line Haul",
	FLT_TRUNK: "Flight - Trunk",
	FLT_FEEDER: "Flight - Feeder",
	TRK_GBT: "Truck - Oversized/Z/GBT",
	TRK_SLH: "Truck - Standard Line Haul",
	TRK_GNP: "Truck - Standard GNP/8888",
	TRK_SSH: "Truck - Standard Shuttle"
};

var MODE_CODES = {
	FLT_CLH: "FC",
	FLT_TRUNK: "FT",
	FLT_FEEDER: "FF",
	TRK_GBT: "TO",
	TRK_SLH: "TS",
	TRK_GNP: "TSG",
	TRK_SSH: "TSS"
};

function showConfirmation(masterData, dataType, deleteBtn, grid_Id) {
	var alertWindow = $("#alertWindow");
	if(!alertWindow.data("kendoWindow")) {
		alertWindow.css({display : "block"});
		alertWindow.kendoWindow({
			width: "300px",
			draggable: true,
			modal: true,
			resizable: false,
			actions: [],
			title: "Delete Confirmation"
		});
	}
	var messageDiv = alertWindow.find("div#confirmationDiv").empty();
	if(dataType == "legRow") {
		messageDiv.append('<label style="display: table-row;vertical-align: middle;">Are you sure you want to delete this leg?</label>');
		$("#yesBtn").hide();
		$("#yesLegBtn").show();
		$("#yesLegBtn")[0].deleteBtn = deleteBtn;
		$("#yesLegBtn")[0].grid_Id = grid_Id;
	}else if(dataType == "routeRow" && masterData.length == 1) {
		messageDiv.append('<label style="display: table-row;vertical-align: middle;">Are you sure you want to delete this route?</label>');
		$("#yesBtn").val("Yes - Delete Route");
		$("#yesBtn").show();
		$("#yesLegBtn").hide();
	}else if(dataType == "routeRow"){
		messageDiv.append('<label style="display: table-row;vertical-align: middle;">Are you sure you want to delete these routes?</label>');
		for(var i=0; i<masterData.length; i++) {
			messageDiv.append('<label style="display: table-row;vertical-align: middle;">' + masterData[i].MV_NUM + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + masterData[i].FULL_EFFDAY_HOLIDAY_L +'</label>');
		}
		$("#yesBtn").val("Yes - Delete Routes");
		$("#yesBtn").show();
		$("#yesLegBtn").hide();
	}
	alertWindow.parent("div.k-widget.k-window").addClass('alertWInStyle');
	alertWindow.data("kendoWindow").center();
	alertWindow.data("kendoWindow").open();
}

function alertClickHandler(event, isDelete, dataType) {
	if($("#alertWindow").data("kendoWindow")) {
		$("#alertWindow").data("kendoWindow").close();
	}
	if(isDelete && dataType == "legRow") {
		deleteLegFromSchedule(event);
	}else if(isDelete) {
		deleteRouteFromSchedule();
	}
}

function deleteRouteFromSchedule() {
	if(window.hasOwnProperty("gridId") && gridId == "routeMatrixWIPGrid") {
		var routeList = getSelectedRouteListForFlightFnl();
		if (routeList.length > 0) {
			showAlertForRevsion(routeList);
		} else {
			deleteRouteFromScheduleWIP();
		}
	}else {
		deleteRouteFromScheduleDrawer();
	}
}

function deleteRouteFromScheduleWIP() {
	var gridData =  $("#"+gridId).data("kendoGrid");
	var masterRows = gridData.tbody.find("tr.k-master-row");
	var tempData;
	var deletableRteList = [];
	var deletableLegList = [];
	var tempLegList = [];
	for(var i=0; i < masterRows.length;i++){
		if($(masterRows[i]).parents().eq(3).attr("id").indexOf("routeMatrixWIPGrid") >= 0 && masterRows[i].childNodes[1].childNodes[0].checked){
			tempData = gridData.dataItem(masterRows[i]);
			tempData.OPERATION_CD = parent.OPERATION_CD_DELETE;
			deletableRteList.push(tempData.toJSON());
			tempLegList = $.grep(parent.selectedWIPLegList, function(obj) {
				return obj["ROUTE_ID"] == tempData.ROUTE_ID;
			});
			for(var obj in tempLegList) {
				tempLegList[obj].OPERATION_CD = parent.OPERATION_CD_DELETE;
			}
			$.merge(deletableLegList, tempLegList);
		}
	}
	if(deletableRteList.length > 0 && deletableLegList.length > 0) {
		var timeReference = !isLocalTimeFlag() ? "Local" : "Zulu";
		parent.SkdMxServiceHelper.getSaveUpdateServiceManager().callSaveUpdateValuesService(deletableRteList, deletableLegList, timeReference, onDeleteSaveUpdateServiceSuccessWIP);
	}
}

function deleteRouteFromScheduleDrawer() {
	var routeData = SkdMxHelper.getSkdMxGridComponentManager().rteDataMap[SkdMxHelper.getSkdMxGridComponentManager().currentSelectedRoute];
	var legData = SkdMxHelper.getSkdMxGridComponentManager().getSelectedDataSource(SkdMxHelper.getSkdMxGridComponentManager().currentSelectedRoute);
	var deletableRteList = [];
	var deletableLegList = [];
	var tempLegList = [];
	for(var i=0; i < routeData.length;i++){
		routeData[i].OPERATION_CD = parent.OPERATION_CD_DELETE;
		deletableRteList.push(routeData[i]);
		tempLegList = $.grep(legData, function(obj) {
			return obj["ROUTE_ID"] == routeData[i].ROUTE_ID;
		});
		for(var obj in tempLegList) {
			tempLegList[obj].OPERATION_CD = parent.OPERATION_CD_DELETE;
		}
		$.merge(deletableLegList, tempLegList);
	}
	if(deletableRteList.length > 0 && deletableLegList.length > 0) {
		if (deletableRteList[0].MODE=="Flight" && parent.getSelectedCase().caseType=='FNL') {
				parent.SkdGridHelper.getSkdGridManager().setInfoForCurrentSelectedRoute(
				deletableRteList[0],null, null,null,deletableLegList,deletableLegList,deletableRteList,parent.OPERATION_FROM_DRAWER);
					parent.SkdGridHelper.getSkdGridManager().setDashBoardTitle(deletableRteList[0],parent.DASHBOARD_ID_REVISION_COMMENTS);
					parent.openDashboard(parent.DASHBOARD_ID_REVISION_COMMENTS,true);
		} else {
			var timeReference = parent.getDashboardContentWindow('mapViewDiv').isLocalFlag ? "Local" : "Zulu";
			parent.SkdMxServiceHelper.getSaveUpdateServiceManager().callSaveUpdateValuesService(deletableRteList, deletableLegList, timeReference, onDeleteSaveUpdateServiceSuccessDrawer);
		}
	}
}

function onDeleteSaveUpdateServiceSuccessDrawer(response, io) {
	var isDelete = true;
	parent.showProgressDialog(false);
	if(response && response._errorCd && response._errorCd > 0) {
		parent.showErrorMsg(response._errorDesc);
	} else {
		var routeData = SkdMxHelper.getSkdMxGridComponentManager().rteDataMap[SkdMxHelper.getSkdMxGridComponentManager().currentSelectedRoute];
		parent.onSaveServiceSuccess(response, isDelete, null, routeData);
		SkdMxHelper.getDrawer().selectPointer({id:"btnCancelPointer"}, true);
	}
}

//function to validate GNP 8888 and 8889 for Truck - FDX-1161
function isValidRouteContextType(model){
	if (model['ROUTE_CONTEXT_CD'] == ROUTE_CONTEXT_CODES.TRK_SLH || model['ROUTE_CONTEXT_CD'] == ROUTE_CONTEXT_CODES.TRK_SSH) {
		return false;
	} else if (model['ROUTE_CONTEXT_CD'] == ROUTE_CONTEXT_CODES.TRK_GNP) {
		return model['EQUIP_TYPE'] =="8888" || model['EQUIP_TYPE'] =="8889";
	} else {
		return true;
	}
}

//FdxFDX-1268:- Anchor time not being managed correctly when 'add previous' used
/**
 * same memthod is referencing from SMD module...
 * @param routeData
 * @param legData
 */
function maintainAnchorLeg(routeData, legData) {
    if(routeData && legData) {
        for(var i=0; i<legData.length; i++) {
            if(routeData && routeData.ANCHOR_LEG_ID == legData[i].LEG_ID) {
                routeData["ANCHOR_LEG_SEQ"] = i;
                break;
            }
        }
    }
}

/**
 * set the WIP sessonal data
 * @param seasons
 */
function setSeasonalData(seasons) {
    parent.selectedWIPSeasonLegList = parseSeasonalData(seasons, parent.selectedWIPSeasonLegList);
}

/**
 * parses the season's data from response object
 * @param seasons
 * @param selectedWIPSeasonLegList
 * @returns {*}
 */
function parseSeasonalData(seasons, selectedWIPSeasonLegList){
    if(seasons != undefined){
        var seasonObj = $.parseJSON(seasons);
        var rteData = $.parseJSON(seasonObj.rteData);
        var legData = $.parseJSON(seasonObj.legData);
        var nonMachingLegs = selectedWIPSeasonLegList != null ? selectedWIPSeasonLegList : [];
        for(var i=0; i<rteData.length; i++) {
            nonMachingLegs = $.grep(nonMachingLegs, function(obj) {
                return (obj["ROUTE_ID"] != rteData[i]["ROUTE_ID"] && obj["ROUTE_ID"] != "");
            });
        }

        return $.merge(nonMachingLegs,legData);
    }
}

function getRowIndex(kendoDatasource, row){
    var _data = kendoDatasource.data();

    if(_data != undefined ){
        for(var i=0 ; i< _data.length; i++){
            if(_data[i].uid == row.uid){
                return i;
            }
        }
    }
}