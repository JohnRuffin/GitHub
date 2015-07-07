/**
 * @author Honey Bansal
 */
var SkdGridHelper = (function() {
    function constructorFn() {
        this.skdGridManager;
    };

    constructorFn.getSkdGridManager = function() {
        if (this.skdGridManager == undefined) {
            this.skdGridManager = (new SkdGridManager()).getInstance();
        }
        return this.skdGridManager;
    };
    return constructorFn;
})();

function SkdGridManager() {

    function constructorFn() {
        this.initialize();
    };

    constructorFn.initialize = function() {
        //
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
    constructorFn.calenderRowEditor = function(model,grid_Id,localZuluFlag,dashboardDiv,isSelectable,isAllocationField) {
    	if(model.CHANGE_FLAG == "Deleted") {
    		return "<img src ='"+ICON_IMAGE_PATH_DAYS+"' style='margin-left:-1px;' isOpenState='false'/>";
    	}
    	return "<img title='Open calendar' src ='"+ICON_IMAGE_PATH_DAYS+"' style='margin-left:-1px;cursor:pointer' onclick=parent.SkdGridHelper.getSkdGridManager().calenderRowHandler(this,'"+grid_Id+"','" + localZuluFlag + "','" + dashboardDiv + "','"+isSelectable + "','"+isAllocationField+"') isOpenState='false'/>";
    };
    
    constructorFn.getSelectableDays = function(effDayBits, planDays) {
    	if(effDayBits != null && planDays != null) {
    		try {
    			if(parseInt(effDayBits.charAt(0)) == 1) {
    				return "0-" + (parseInt(planDays) - 1);
    			}else if(effDayBits.lastIndexOf("1") > planDays){
    				return (effDayBits.lastIndexOf("1") - planDays + 1) + "-" + effDayBits.lastIndexOf("1");
    			}
    		}catch (e) {
				console.log("Error while making the selectable days");
			}
    	}
    	return "0-" + planDays;
    };

    constructorFn.calenderRowHandler = function(calBtn,grid_Id,localZuluFlag,dashboardDiv,isSelectable,isAllocationField) {
    	var currentCase = getSelectedCase();
    	var plansDay = planPerDayQty = currentCase.planPerDayQty;
    	var currentTR = $(calBtn).closest("tr");
    	var gridDiv, grid;
    	if(dashboardDiv != undefined && dashboardDiv != "undefined"){
    		gridDiv = getDashboardContentWindow(dashboardDiv).$(HASH_STRING+grid_Id);
    		grid = gridDiv.data("kendoGrid");
    		if(parent.DASHBOARD_ID_MAP_VIEW === dashboardDiv){
    			if(grid_Id != getDashboardContentWindow(dashboardDiv).SkdMxHelper.getSkdMxGridComponentManager().getSelectedGridId()){
        			return "";
        		}
    		}    		
    	}else{
    		grid = $(HASH_STRING+grid_Id).data("kendoGrid");
    	}
    	var data  = grid.dataItem(currentTR);
    	var selectableDays = "0-" + plansDay;
    	if(isSelectable != "undefined" && !(isSelectable =="true")){
    		selectableDays = EMPTY_STRING;
    	}
    	var isDisableZero = true;
    	calBtn.gridId = grid_Id;
    	if((grid_Id.indexOf("allocationGrid") == 0 && !(isAllocationField != 'undefined')) && localZuluFlag == "L"){
    		showDayControl(false, this.parseFullEffDayStr(data.LEG_FULL_EFFDT_L), calBtn, true, grid_Id, true, null, 
						null, null, isDisableZero, data.LEG_HOL_DAYS_L, null, null, this.setSelectedDays, dashboardDiv);
    	}else if((grid_Id.indexOf("legsGrid") == 0 || grid_Id.indexOf("seasonsGrid") == 0 || grid_Id.indexOf("SchdleMntnceMapDwrContentGrid") == 0 ) && localZuluFlag == "L") {
    		selectableDays = this.getSelectableDays(data.EFFDAYSL_DESC, plansDay);
    		if(data && data.EFFDAYSL_DESC && parseInt(data.EFFDAYSL_DESC.charAt(0)) == 1) {
        		isDisableZero = false;
        	}
    		if(currentTR.index() == 0 && grid_Id.indexOf("seasonsGrid") != 0) {
    			showDayControl(false, this.parseFullEffDayStr(data.FULL_EFFDT_L), calBtn, true, grid_Id, true, selectableDays, 
    					null, null, isDisableZero, data.LEG_HOL_DAYS_L, null, null, this.setSelectedDays, dashboardDiv);
    		}
    		showDayControl(false, this.parseFullEffDayStr(data.FULL_EFFDT_L), calBtn, true, grid_Id, true, null, 
						null, null, isDisableZero, data.LEG_HOL_DAYS_L, null, null, this.setSelectedDays, dashboardDiv);
    	}else if((grid_Id.indexOf("allocationGrid") == 0 && !(isAllocationField != 'undefined')) && localZuluFlag == "Z"){
    		showDayControl(false, this.parseFullEffDayStr(data.LEG_FULL_EFFDT_Z), calBtn, true, grid_Id, true, null, 
						null, null, isDisableZero, data.LEG_HOL_DAYS_Z, null, null, this.setSelectedDays, dashboardDiv);
    	}else if((grid_Id.indexOf("legsGrid") == 0 || grid_Id.indexOf("seasonsGrid") == 0 || grid_Id.indexOf("SchdleMntnceMapDwrContentGrid") == 0 ) && localZuluFlag == "Z") {
    		selectableDays = this.getSelectableDays(data.EFFDAYSZ_DESC, plansDay);
    		if(data && data.EFFDAYSZ_DESC && parseInt(data.EFFDAYSZ_DESC.charAt(0)) == 1) {
        		isDisableZero = false;
        	}
    		if(currentTR.index() == 0 && grid_Id.indexOf("seasonsGrid") != 0) {
    			showDayControl(false, this.parseFullEffDayStr(data.FULL_EFFDT_Z), calBtn, true, grid_Id, true, selectableDays, 
    					null, null, isDisableZero, data.LEG_HOL_DAYS_Z, null, null, this.setSelectedDays, dashboardDiv);
    		}
    		showDayControl(false, this.parseFullEffDayStr(data.FULL_EFFDT_Z), calBtn, true, grid_Id, true, null, 
					null, null, isDisableZero, data.LEG_HOL_DAYS_Z, null, null, this.setSelectedDays, dashboardDiv);
    	}else if(localZuluFlag == "L"){
    		var selDays;
    		if(grid_Id.indexOf("loc_allocationGrid") >= 0) {
    			var allocRow = gridDiv.closest("tr").prev();
    			var allocGrid = getDashboardContentWindow(dashboardDiv).$(gridDiv.closest("tr").closest("div.k-grid.k-widget")).data("kendoGrid");
    			var allocData = allocGrid.dataItem(allocRow);
    			selDays = this.parseFullEffDayStr(data["FULL_EFFDT_L"]);
    			selectableDays = this.parseFullEffDayStr(allocData['FULL_EFFDT_L']);
    			if(selectableDays) {
        			var daysArr = getDaysArray(selectableDays);
        			if(daysArr && (daysArr.indexOf(0) >=0 || daysArr.indexOf("0") >= 0)) {
        				isDisableZero = false;
        			}
        		}
    		}else if(grid_Id.indexOf("allocationGrid") >= 0){
    			selDays = this.parseFullEffDayStr(data["FULL_EFFDT_L"]);
    			selectableDays = this.parseFullEffDayStr(data['LEG_FULL_EFFDT_L']);
    			if(selectableDays) {
        			var daysArr = getDaysArray(selectableDays);
        			if(daysArr && (daysArr.indexOf(0) >=0 || daysArr.indexOf("0") >= 0)) {
        				isDisableZero = false;
        			}
        		}
    		}else{
    			selDays = this.parseFullEffDayStr(data.ROUTE_FULL_EFFDT_L);
    			selectableDays = this.getSelectableDays(data.EFFDAYSL_DESC, plansDay);
    			if(data && data.EFFDAYSL_DESC && parseInt(data.EFFDAYSL_DESC.charAt(0)) == 1) {
            		isDisableZero = false;
            	}
    		}
    		showDayControl(false, selDays, calBtn, isSelectable, grid_Id, true, selectableDays, 
    				null, null, isDisableZero, data.ROUTE_HOL_DAYS_L, null, null, this.setSelectedDays,dashboardDiv);
    	}else if(localZuluFlag == "Z") {
    		var selDays;
    		if(grid_Id.indexOf("loc_allocationGrid") >= 0) {
    			var allocRow = gridDiv.closest("tr").prev();
    			var allocGrid = getDashboardContentWindow(dashboardDiv).$(gridDiv.closest("tr").closest("div.k-grid.k-widget")).data("kendoGrid");
    			var allocData = allocGrid.dataItem(allocRow);
    			selDays = this.parseFullEffDayStr(data["FULL_EFFDT_Z"]);
    			selectableDays = this.parseFullEffDayStr(allocData['FULL_EFFDT_Z']);
    			if(selectableDays) {
        			var daysArr = getDaysArray(selectableDays);
        			if(daysArr && (daysArr.indexOf(0) >=0 || daysArr.indexOf("0") >= 0)) {
        				isDisableZero = false;
        			}
        		}
    		}else if(grid_Id.indexOf("allocationGrid") >= 0){
    			selDays = this.parseFullEffDayStr(data["FULL_EFFDT_Z"]);
    			selectableDays = this.parseFullEffDayStr(data['LEG_FULL_EFFDT_Z']);
    			if(selectableDays) {
        			var daysArr = getDaysArray(selectableDays);
        			if(daysArr && (daysArr.indexOf(0) >=0 || daysArr.indexOf("0") >= 0)) {
        				isDisableZero = false;
        			}
        		}
    		}else{
    			selDays = this.parseFullEffDayStr(data.ROUTE_FULL_EFFDT_Z);
    			selectableDays = this.getSelectableDays(data.EFFDAYSZ_DESC, plansDay);
    			if(data && data.EFFDAYSZ_DESC && parseInt(data.EFFDAYSZ_DESC.charAt(0)) == 1) {
            		isDisableZero = false;
            	}
    		}
    		showDayControl(false, selDays, calBtn, isSelectable, grid_Id, true, selectableDays, 
    				null, null, isDisableZero, data.ROUTE_HOL_DAYS_Z, null, null, this.setSelectedDays,dashboardDiv);
    	}
    };

    constructorFn.setSelectedDays = function(calBtn, selectedDaysRange, keyObj, selectedDays, holidayStr,dashboardDiv) {
		var effDayStr = SkdGridHelper.getSkdGridManager().getEffectiveDays(selectedDays);
		var mergedStr = SkdGridHelper.getSkdGridManager().mergeEffDayAndHolidayStr(effDayStr, holidayStr);
		var effDayStrCombined = SkdGridHelper.getSkdGridManager().changeEffDayStrFormat(mergedStr);
		var dashboard;
		var grid;
		if(dashboardDiv != undefined && dashboardDiv != "undefined"){
			dashboard = getDashboardContentWindow(dashboardDiv);
    		grid = dashboard.$(HASH_STRING+calBtn.gridId);
    	}else {
    		grid = $(HASH_STRING+calBtn.gridId);
    	}
        var isLocalFlag;
        if(dashboard.SkdMxHelper != null) {
            isLocalFlag = dashboard.isLocalFlag;
        }else {
            isLocalFlag = !dashboard.isLocalTimeFlag();
        }
        var routeData, legData;
		var routeRow, legRow;
		var routeGrid, legGrid;
		if(calBtn.gridId.indexOf("allocationGrid") >= 0){
			legGrid = grid.data("kendoGrid");
			legRow = $(calBtn).closest("tr");
			legData = legGrid.dataItem(legRow);
		}else if(calBtn.gridId.indexOf("legsGrid") == 0 || calBtn.gridId.indexOf("SchdleMntnceMapDwrContentGrid") == 0){
			legGrid = grid.data("kendoGrid");
			legRow = $(calBtn).closest("tr");
			legData = legGrid.dataItem(legRow);
			var routeRow = grid.closest("tr").prev();
			routeGrid = dashboard.$(grid.closest("tr").closest("div.k-grid.k-widget")).data("kendoGrid");
			if(routeGrid != null) {
				routeData = routeGrid.dataItem(routeRow);
			}else {
				routeData = dashboard.SkdMxHelper.getSkdMxGridComponentManager().rteDataMap[dashboard.SkdMxHelper.getMapOpeationManager().getRouteId()][0];
			}
		}else {
			routeGrid = grid.data("kendoGrid");
			routeRow = $(calBtn).closest("tr");
			routeData = routeGrid.dataItem(routeRow);
			routeGrid.expandRow(routeRow);
			legGrid = dashboard.$(routeRow.next().find("div.k-legs-grid")).data("kendoGrid");
			var legRow = legGrid.tbody.find("tr").eq(0);
			legData = legGrid.dataItem(legRow);
			
		}
		if(routeData != undefined){
			routeData["EFFDAYSL_ORIG_DESC"] = routeData["EFFDAYSL_DESC"];
			routeData["HOL_EFFDAYSL_ORIG_DESC"] = routeData["HOL_EFFDAYSL_DESC"];
			routeData["EFFDAYSZ_ORIG_DESC"] = routeData["EFFDAYSZ_DESC"];
			routeData["HOL_EFFDAYSZ_ORIG_DESC"] = routeData["HOL_EFFDAYSZ_DESC"];
			
			routeData["ROUTE_FULL_EFFDT_L"] = mergedStr;
			routeData["ROUTE_HOL_DAYS_L"] = holidayStr;
			routeData["FULL_EFFDAY_HOLIDAY_L"] = effDayStrCombined;
			routeData["EFFDAYSL_DESC"] = SkdGridHelper.getSkdGridManager().convertDayEffStrToBits(effDayStr);
			routeData["HOL_EFFDAYSL_DESC"] = SkdGridHelper.getSkdGridManager().convertDayHoliStrToBits(holidayStr);
			
			routeData["ROUTE_FULL_EFFDT_Z"] = mergedStr;
			routeData["ROUTE_HOL_DAYS_Z"] = holidayStr;
			routeData["FULL_EFFDAY_HOLIDAY_Z"] = effDayStrCombined;
			routeData["EFFDAYSZ_DESC"] = SkdGridHelper.getSkdGridManager().convertDayEffStrToBits(effDayStr);
			routeData["HOL_EFFDAYSZ_DESC"] = SkdGridHelper.getSkdGridManager().convertDayHoliStrToBits(holidayStr);
		
			legData["FULL_EFFDT_L"] = routeData["ROUTE_FULL_EFFDT_L"];
			legData["LEG_HOL_DAYS_L"] = routeData["ROUTE_HOL_DAYS_L"];
			legData["FULL_EFFDAY_HOLIDAY_L"] = routeData["FULL_EFFDAY_HOLIDAY_L"];
			legData["EFFDAYSL_DESC"] = routeData["EFFDAYSL_DESC"];
			legData["HOL_EFFDAYSL_DESC"] = routeData["HOL_EFFDAYSL_DESC"];
			
			legData["FULL_EFFDT_Z"] = routeData["ROUTE_FULL_EFFDT_L"];
			legData["LEG_HOL_DAYS_Z"] = routeData["ROUTE_HOL_DAYS_L"];
			legData["FULL_EFFDAY_HOLIDAY_Z"] = routeData["FULL_EFFDAY_HOLIDAY_L"];
			legData["EFFDAYSZ_DESC"] = routeData["EFFDAYSZ_DESC"];
			legData["HOL_EFFDAYSZ_DESC"] = routeData["HOL_EFFDAYSZ_DESC"];
			
		}else{
			if(calBtn.gridId.indexOf("loc_allocationGrid") == 0 && isLocalFlag){
				legData["FULL_EFFDT_L"] = mergedStr;
				legData["FULL_EFFDAY_HOLIDAY_L"] = effDayStrCombined;
				legData["EFFDAYSL_DESC"] = SkdGridHelper.getSkdGridManager().convertDayEffStrToBits(effDayStr);
			}else if(calBtn.gridId.indexOf("loc_allocationGrid") == 0 && !isLocalFlag) {
				legData["FULL_EFFDT_Z"] = mergedStr;
				legData["FULL_EFFDAY_HOLIDAY_Z"] = effDayStrCombined;
				legData["EFFDAYSZ_DESC"] = SkdGridHelper.getSkdGridManager().convertDayEffStrToBits(effDayStr);
			}else if(calBtn.gridId.indexOf("allocationGrid") == 0 && isLocalFlag) {
				legData["FULL_EFFDT_L"] = mergedStr;
				legData["FULL_EFFDAY_HOLIDAY_L"] = effDayStrCombined;
				legData["ALLOCATION_EFF_L"] = SkdGridHelper.getSkdGridManager().convertDayEffStrToBits(effDayStr);
			} else if(calBtn.gridId.indexOf("allocationGrid") == 0 && !isLocalFlag) {
				legData["FULL_EFFDT_Z"] = mergedStr;
				legData["FULL_EFFDAY_HOLIDAY_Z"] = effDayStrCombined;
				legData["ALLOCATION_EFF_Z"] = SkdGridHelper.getSkdGridManager().convertDayEffStrToBits(effDayStr);
			}
			legData["IS_LOCAL"] = isLocalFlag? "1": "0";
		}
		if(calBtn.gridId.indexOf("allocationGrid") >= 0) {
			try {
				if(legGrid != null && legRow != null && legRow.length > 0) {
					if(selectedDaysRange == EMPTY_STRING && !SkdGridHelper.getSkdGridManager().isCharExist(holidayStr)){
						effDayStrCombined = EMPTY_STRING;
					}
					if(isLocalFlag) {
						SkdGridHelper.getSkdGridManager().getTableCellByGridNFieldName(legGrid, legRow, "FULL_EFFDAY_HOLIDAY_L").text(effDayStrCombined);
					}else {
						SkdGridHelper.getSkdGridManager().getTableCellByGridNFieldName(legGrid, legRow, "FULL_EFFDAY_HOLIDAY_Z").text(effDayStrCombined);
					}
				}
				SkdGridHelper.getSkdGridManager().enableDisableLocAllocCheckBox(legRow, legData, effDayStrCombined);
			}catch (e) {
				console.log("Error while setting leg days");
			}
		}else {
			try {
				if(legGrid != null && legRow != null && legRow.length > 0) {
					if(selectedDaysRange == EMPTY_STRING && !SkdGridHelper.getSkdGridManager().isCharExist(holidayStr)){
						effDayStrCombined = EMPTY_STRING;
					}
					SkdGridHelper.getSkdGridManager().getTableCellByGridNFieldName(legGrid, legRow, "FULL_EFFDAY_HOLIDAY_L").text(effDayStrCombined);
					SkdGridHelper.getSkdGridManager().getTableCellByGridNFieldName(legGrid, legRow, "FULL_EFFDAY_HOLIDAY_Z").text(effDayStrCombined);
				}
			}catch (e) {
				console.log("Error while setting leg days");
			}
		}
		try {
			if(routeGrid != null && routeRow != null && routeRow.length > 0) {
				if(selectedDaysRange == EMPTY_STRING && !SkdGridHelper.getSkdGridManager().isCharExist(holidayStr)){
					effDayStrCombined = EMPTY_STRING;
				}
				SkdGridHelper.getSkdGridManager().getTableCellByGridNFieldName(routeGrid, routeRow, "FULL_EFFDAY_HOLIDAY_L").text(effDayStrCombined);
				SkdGridHelper.getSkdGridManager().getTableCellByGridNFieldName(routeGrid, routeRow, "FULL_EFFDAY_HOLIDAY_Z").text(effDayStrCombined);
			}
		}catch (e) {
			console.log("Error while setting route days");
		}
		var legGridData = legGrid.dataSource.data().toJSON();
		var successCallBack;
		var isLocalFlag;
		var isRouteEditor = true;
		if(dashboard.SkdMxHelper != null) {
			if(legRow.index() >= 0)
				dashboard.SkdMxHelper.getSkdMxGridComponentManager().matchingLegsMap[dashboard.SkdMxHelper.getMapOpeationManager().getRouteId()][legRow.index()] = legData;
			successCallBack =  dashboard.SkdMxHelper.getSkdMxGridComponentManager().onDefaultsServiceSuccess;
			isLocalFlag = dashboard.isLocalFlag;
			isRouteEditor = true;
            if(dashboard.SkdMxHelper != null) {
                if(isLocalFlag){
                    dashboard.GridFocusManager.followCursor(SkdGridHelper.getSkdGridManager().getTableCellByGridNFieldName(legGrid, legRow, "FULL_EFFDAY_HOLIDAY_L"), calBtn.gridId, dashboard.SkdMxHelper.getMapOpeationManager().getRouteId(),"LOCAL_DEP");
                }else {
                    dashboard.GridFocusManager.followCursor(SkdGridHelper.getSkdGridManager().getTableCellByGridNFieldName(legGrid, legRow, "FULL_EFFDAY_HOLIDAY_Z"), calBtn.gridId, dashboard.SkdMxHelper.getMapOpeationManager().getRouteId(),"ZULU_DEP");
                }
            }
		}else {
			dashboard.updateSelectedRouteNLegList();
			successCallBack = dashboard.onDefaultsServiceSuccess;
			isLocalFlag = !dashboard.isLocalTimeFlag();
			isRouteEditor = dashboard.gridId == "routeMatrixGrid" ? true : false;
			parent.SkdGridHelper.getSkdGridManager().setPopUpEditValues(calBtn.gridId, grid.data("kendoGrid"), $(calBtn).closest("tr"), "LEG_TYPE");
		}
		if(routeData != undefined){
            var canCallTimeNCodeService = SkdMxServiceHelper.getTimeAndCostServiceManagerManager().triggerTimeNCostService(routeData, legGridData, successCallBack, isLocalFlag, isRouteEditor);
            if(!canCallTimeNCodeService){
                if(dashboard.SkdMxHelper != null) {
                    dashboard.GridFocusManager.placeCursorToFiledName(calBtn.gridId, dashboard.SkdMxHelper.getMapOpeationManager().getRouteId());
                } else {
                	var dashboard = getDashboardContentWindow("scheduleWIPMatrixDiv");
                	dashboard.placeCursorToFieldName(undefined,undefined,undefined,true,undefined);
                }
            }
		}


    };
    
    constructorFn.setCalendarEditValues = function(calBtn, kGrid, currentEditCellType) {
    	if(calBtn != undefined && calBtn.gridId.indexOf("legsGrid") >= 0){
    		isEditLeg = true;
    	}else{
    		isEditLeg = false;
    	}
    	var dashboard = getDashboardContentWindow("scheduleWIPMatrixDiv");
    	dashboard.isServiceCallOnEdit = true;
    	var grid = kGrid.data("kendoGrid");
    	var row = $(calBtn).closest("tr");
    	if(grid != null) {
    		var dataItem = {};
    		dataItem = jQuery.extend(true, {}, grid.dataItem(row));
    		dashboard.currentEditIndex = getRowIndex(grid.dataSource,dataItem);
    		dashboard.currentEditCellType = currentEditCellType;
    		dashboard.isEditLeg = isEditLeg;
    		dashboard.currentGridId = calBtn.gridId;
    		console.log("currentEditIndex:"+dashboard.currentEditIndex +"\n currentEditCellType:"+dashboard.currentEditCellType);
    	}
    };
    
    constructorFn.setPopUpEditValues = function(gridId, grid, row, currentEditCellType) {
    	if(gridId != undefined && gridId.indexOf("legsGrid") >= 0){
    		isEditLeg = true;
    	}else{
    		isEditLeg = false;
    	}
    	var dashboard = getDashboardContentWindow("scheduleWIPMatrixDiv");
    	dashboard.isServiceCallOnEdit = true;
    	/*var grid = kGrid.data("kendoGrid");
    	var row = $(calBtn).closest("tr");
    	
		routeGrid = grid.data("kendoGrid");
		routeRow = $(options.parentObj).closest("tr");*/
    	
    	if(grid != null) {
    		var dataItem = {};
    		dataItem = jQuery.extend(true, {}, grid.dataItem(row));
    		dashboard.currentEditIndex = getRowIndex(grid.dataSource,dataItem);
    		dashboard.currentEditCellType = currentEditCellType;
    		dashboard.isEditLeg = isEditLeg;
    		dashboard.currentGridId = gridId;
    		console.log("currentEditIndex:"+dashboard.currentEditIndex +"\n currentEditCellType:"+dashboard.currentEditCellType);
    	}
    };
    
    constructorFn.enableDisableLocAllocCheckBox = function(gridRow, rowData, inputValue) {
    	if(rowData["IS_LOCAL"] == 1) {
    		if(this.isNotEmptyOrNull(inputValue) && this.isCharExist(rowData["FULL_EFFDT_L"]) && this.isNotEmptyOrNull(rowData["PROD_GRP_NM"]) && this.isNotEmptyOrNull(rowData["ALLOC_WEIGHT"]) && this.isNotEmptyOrNull(rowData["ALLOC_CUBE"])){
        		gridRow.find("input.k-loc-allocation").prop('disabled', false);
        	}else {
        		gridRow.find("input.k-loc-allocation").prop('disabled', true);
        	}
    	}else {
	    	if(this.isNotEmptyOrNull(inputValue) && this.isCharExist(rowData["FULL_EFFDT_Z"]) && this.isNotEmptyOrNull(rowData["PROD_GRP_NM"]) && this.isNotEmptyOrNull(rowData["ALLOC_WEIGHT"]) && this.isNotEmptyOrNull(rowData["ALLOC_CUBE"])){
	    		gridRow.find("input.k-loc-allocation").prop('disabled', false);
	    	}else {
	    		gridRow.find("input.k-loc-allocation").prop('disabled', true);
	    	}
    	}
    };
    
    constructorFn.isCharExist = function(str) {
    	if(str != null) {
    		var match = str.match(/[a-zA-Z]/g);
    		if(match && match.length > 0) {
    			return true;
    		}
    	}
    	return false;
    };
    
    constructorFn.convertDayEffStrToBits = function(effDays) {
    	if(effDays != null) {
    		effDays = effDays.replace(new RegExp(",", 'g'),"");
    		effDays = effDays.replace(new RegExp("C", 'g'),"0");
    		effDays = effDays.replace(new RegExp("[A-Za-z]", 'g'),"1");
    		effDays = effDays.replace(new RegExp("-", 'g'),"0");
    		effDays = effDays.substring(6);
    		//effDays = "0" + effDays;
    		while(effDays.length < 128) {
    			effDays = effDays + "0";
    		}
    	}
    	return effDays;
    };

    constructorFn.convertDayHoliStrToBits = function(holidays) {
    	if(holidays != null) {
    		holidays = holidays.replace(new RegExp(",", 'g'),"");
    		holidays = holidays.replace(new RegExp("-", 'g'),"0");
    		holidays = holidays.substring(6);
    		//holidays = "0" + holidays;
    	}
    	return holidays;
    };


    constructorFn.mergeEffDayAndHolidayStr = function(effDayStr, holidayStr) {
    	var mergedStr = "";
    	if(effDayStr != null && holidayStr != null) {
    		for(var i=0; i<effDayStr.length; i++) {
    			if(holidayStr.charAt(i) == "C" || holidayStr.charAt(i) == "H") {
    				mergedStr = mergedStr + holidayStr.charAt(i);
    			}else {
    				mergedStr = mergedStr + effDayStr.charAt(i);
    			}
    		}
    		return mergedStr;
    	}
    	return effDayStr;
    };
    constructorFn.parseFullEffDayStr = function(str) {
    	var days = [];
    	if(str != null) {
    		str = replaceAll(str, " ", "");
    		str = replaceAll(str, ",", "");
    		str = str.substring(6);
    		for(var i=0; i<str.length; i++) {
    			if(str.charAt(i) != "-" && str.charAt(i) != "C" && str.charAt(i) != "H") {
    				days.push(i);
    			}
    		}
    	}
    	return days.toString();
    };

    constructorFn.parseFullEffDayNoHolidayStr = function(str) {
    	var days = [];
    	if(str != null) {
    		str = replaceAll(str, " ", "");
    		str = replaceAll(str, ",", "");
    		str = str.substring(6);
    		for(var i=0; i<str.length; i++) {
    			if(str.charAt(i) != "-") {
    				days.push(i);
    			}
    		}
    	}
    	return days.toString();
    };
    
    constructorFn.getEffectiveDays = function(tempSD) {
    	var DAY_ARRAY = parent.getSelectedEffDayPattern(); //['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    	var weeks = new Array();
    	var weekDays = "";
    	var index = 0;
    	var weekCount = 6;
    	var currentCase = getSelectedCase();
    	if(currentCase && currentCase.planPerDayQty) {
    		weekCount = currentCase.planPerDayQty/7 + 1;
    		if(tempSD && tempSD[tempSD.length-1] > currentCase.planPerDayQty) {
    			weekCount = Math.ceil(tempSD[tempSD.length-1]/7) + 1;
    		}
    	}
		weeks[0] = "------" + (($.inArray(0, tempSD) > -1) ? DAY_ARRAY[6] : "-");
    	for (var week = 0; week < weekCount-1; week++) {
    		weekDays = "";
    		for (var day = 0; day < 7; day++) {
    			index = ((7 * week) + day + 1);
    			if ($.inArray(index, tempSD) > -1 ) {
    				weekDays = weekDays + DAY_ARRAY[day];
    			}else {
    				weekDays = weekDays + "-";
    			}
    		}
    		weeks[week + 1] = weekDays;
    	}
    	return weeks.toString();
    };

    constructorFn.getOperatedWeek = function(weeks) {
    	if (weeks != null) {
    		var daysArray = new Array();
    		var dayChar;
    		var count = weeks == null ? 0 : weeks.length;
    		for (var i = 0; i < count; i++) {
    			if (weeks[i] != null) {
    				for (var j = 0; j < weeks[i].length; j++) {
    					dayChar = weeks[i].charAt(j);
    					if (i == 0) {
    						daysArray[j] = dayChar;
    					} else if (dayChar != '-') {
    						daysArray[j] = dayChar;
    					}
    				}
    			}
    		}
    		return daysArray.join("");
    	}
    	return null;
    };

    constructorFn.changeEffDayStrFormat = function(effDays) {
    	if(effDays != null) {
    		var weeks = effDays.split(",");
    		var uniqueArray = [];
    		var isDistinct = false;
    		for(var i=0;i<weeks.length;i++){
    			isDistinct = false;
    			for(var j=0;j<i;j++){
                    if(weeks[i] == weeks[j]){
                        isDistinct = true;
                        break;
                    }
                }
    			if(!isDistinct){
    				uniqueArray.push(weeks[i]);
                }
    		}
    		var holidayStr = "";
    		var finalHolidayStr = "";
    		for(var i=0; i<uniqueArray.length; i++) {
    			holidayStr = uniqueArray[i] + " ";
    			for(var j=0; j<weeks.length; j++) {
    				if(uniqueArray[i] == weeks[j]) {
    					holidayStr = holidayStr + j;
    				}
    			}
    			finalHolidayStr = finalHolidayStr + holidayStr;
    			if(i < uniqueArray.length-1) {
    				finalHolidayStr = finalHolidayStr + ",";
    			}
    		}
    		finalHolidayStr = finalHolidayStr.replace("------- 0,", "");
    		finalHolidayStr = finalHolidayStr.replaceAll(",", ", ");
    		return finalHolidayStr;
    	}
    	return effDays;
    };
    
    constructorFn.getTitleOrToolTip = function(dataField) {
    	var buttonTitle = "";
    	if (dataField == "LEG_TYPE") {
    		buttonTitle = "Select leg type";
    	} else if (dataField == "EQUIP_TYPE") {
    		buttonTitle = "Select equipment type";
    	} else if (dataField == "ORIGIN") {
    		buttonTitle = "Select route origin";
    	} else if (dataField == "DESTINATION") {
    		buttonTitle = "Select Route Destination";
    	} else if (dataField == "CARRIER_TYPE") {
    		buttonTitle = "Select carrier type";
    	} else if (dataField == "SCAC_CD") {
    		buttonTitle = "Select scac code";
    	} else if (dataField == "ROUTE_TYPE_CD") {
    		buttonTitle = "Select route type";
    	} else if (dataField == "MANAGER_ID") {
    		buttonTitle = "Select manager id";
    	} else if (dataField == "TRAIL_AVAIL_TM") {
    		buttonTitle = "Select tariler type";
    	} else if (dataField == "TRAIL_OPT") {
    		buttonTitle = "Select trailer option";
    	} else if (dataField == "PROD_GRP_NM") {
    		buttonTitle = "Select product volume group";
    	} else if (dataField == "ORIG_DEST_CD") {
    		buttonTitle = "Select location indicator";
    	} else if (dataField == "LOC_CD") {
    		buttonTitle = "Select Location";
    	} else {
    		buttonTitle="Open Popup";
    	}
    	return buttonTitle;
    };
    
    constructorFn.arrowIconRowTemplate = function(data, grid_Id, reqType, uniqueId, dataField,dashboardDiv) {
    	if(data.CHANGE_FLAG == "Deleted") {
    		return "<img name='arrow' src ='"+ICON_IMAGE_ARROW+"' isOpenState='false'/>";
    	}
    	return "<img name='arrow' style='cursor: pointer;' title='"+ this.getTitleOrToolTip(dataField) +"' src ='"+ICON_IMAGE_ARROW+"' style='margin-left:-1px' onclick=parent.SkdGridHelper.getSkdGridManager().arrowRowHandler(this,'"+grid_Id+"','" + reqType + "','" + uniqueId + "','" + dataField + "','"+dashboardDiv + "') isOpenState='false'/>";
    };

    constructorFn.arrowRowHandler = function(btn, grid_Id, reqType, uniqueId, dataField, dashboardDiv) {
    	var currentTR = $(btn).closest("tr");
    	var grid;
    	if(dashboardDiv != undefined && dashboardDiv != "undefined"){
    		grid = getDashboardContentWindow(dashboardDiv).$(HASH_STRING+grid_Id).data("kendoGrid");
    		if(parent.DASHBOARD_ID_MAP_VIEW === dashboardDiv){
	    		if(grid_Id != getDashboardContentWindow(dashboardDiv).SkdMxHelper.getSkdMxGridComponentManager().getSelectedGridId()){
	    			return "";
	    		}
    		}
    	}else{
    		grid = $(HASH_STRING+grid_Id).data("kendoGrid");
    	}
    	var data = grid.dataItem(currentTR);
    	searchPopupBtn = btn;
    	searchPopupBtn.title = this.getTitleOrToolTip(dataField);
    	searchPopupBtn.grid_id = grid_Id;
    	searchPopupBtn.uniqueId = uniqueId;
    	searchPopupBtn.dataField = dataField;
    	searchPopupBtn.dashboardId = dashboardDiv;
    	/*if(reqType == "ProductGroupRequest"){
    		SkdMxServiceHelper.getMasterDataServiceManager().callMasterDataService(getProductGroupsVolumeDataURL());
    		
    	}*/
    	if(reqType == "OrgDesListRequest"){
    		SkdGridHelper.getSkdGridManager().openSelectLocDialog(searchPopupBtn.uniqueId, searchPopupBtn.title);
    	}else{
    		SkdMxServiceHelper.getValidationServiceManager().callValidationService(reqType, this.getNotNullStr(data.MODE), 
    				this.getNotNullStr(data.CAPACITY_CD), this.getNotNullStr(data.CARRIER_TYPE), this.getNotNullStr(data.ROUTE_TYPE_CD), 
    				this.getNotNullStr(data.EQUIP_TYPE), this.getNotNullStr(data.LEG_TYPE), this.getNotNullStr(data.ROUTE_CONTEXT_CD));
    	}
    };

    constructorFn.openSelectLocDialog = function(uniqueId, title, response) {
    	if(!searchPopUpMap[uniqueId]) {
    		var window =  new SearchPopUp(uniqueId, new Object());
    		searchPopUpMap[uniqueId] = window;
    	}
    	searchPopUpMap[uniqueId].options.title = title;
    	searchPopUpMap[uniqueId].options.setApplyResponseHandler = this.setApplyResponseHandler;
    	searchPopUpMap[uniqueId].options.getApplyResponseHandler = this.getApplyResponseHandler;
    	searchPopUpMap[uniqueId].options.response = response;
    	searchPopUpMap[uniqueId].options.parentObj = searchPopupBtn;
    	searchPopUpMap[uniqueId].options.dataField = searchPopupBtn.dataField;
    	searchPopUpMap[uniqueId].options.grid_Id = searchPopupBtn.grid_id;
    	searchPopUpMap[uniqueId].options.dashboardId = searchPopupBtn.dashboardId;
    	searchPopUpMap[uniqueId].openFilterPopUp();
    };

    constructorFn.setApplyResponseHandler = function(uniqueId, locations, options) {
    	if(locations && locations.length > 0) {
    		SkdGridHelper.getSkdGridManager().updatePopUpValues(options, locations[0]);
    	}
    };
    
    constructorFn.getApplyResponseHandler = function(uniqueId, locations, options) {
    	return "";
    };
    
    constructorFn.updatePopUpValues = function(options, value) {
    	var dashboard, grid, targetCell;
    	var model = {};
		if(options.dashboardId != null){
			dashboard = getDashboardContentWindow(options.dashboardId);
			grid = dashboard.$(HASH_STRING+options.grid_Id);
    	}else{
    		grid = $(HASH_STRING+options.grid_Id);
    	}
		var routeData, legData;
		var routeRow, legRow;
		var routeGrid, legGrid;
		var isUpdateRoute = false;
		if(options.grid_Id.indexOf("loc_allocationGrid") == 0 || options.grid_Id.indexOf("allocationGrid") == 0 || options.grid_Id.indexOf("legsGrid") == 0 || options.grid_Id.indexOf("SchdleMntnceMapDwrContentGrid") == 0){
			legGrid = grid.data("kendoGrid");
			legRow = $(options.parentObj).closest("tr");
			legData = legGrid.dataItem(legRow);
			var routeRow = grid.closest("tr").prev();
			routeGrid = dashboard.$(grid.closest("tr").closest("div.k-grid.k-widget")).data("kendoGrid");
			if(routeGrid != null) {
				routeData = routeGrid.dataItem(routeRow);
			}else {
				routeData = dashboard.SkdMxHelper.getSkdMxGridComponentManager().rteDataMap[dashboard.SkdMxHelper.getMapOpeationManager().getRouteId()][0];
			}
			if(legRow.index() == 0) {
				isUpdateRoute = true;
			}
			targetCell = SkdGridHelper.getSkdGridManager().getTableCellByGridNFieldName(legGrid, legRow, options.dataField);
		}else {
			routeGrid = grid.data("kendoGrid");
			routeRow = $(options.parentObj).closest("tr");
			routeData = routeGrid.dataItem(routeRow);
			routeGrid.expandRow(routeRow);
			legGrid = dashboard.$(routeRow.next().find("div.k-legs-grid")).data("kendoGrid");
			var legRow = legGrid.tbody.find("tr").eq(0);
			legData = legGrid.dataItem(legRow);
			isUpdateRoute = true;
			targetCell = SkdGridHelper.getSkdGridManager().getTableCellByGridNFieldName(routeGrid, routeRow, options.dataField);
		}
		legData[options.dataField] = value;
		SkdGridHelper.getSkdGridManager().getTableCellByGridNFieldName(legGrid, legRow, options.dataField).text(value);
		if(options.dataField == "DESTINATION" && legRow.next().is("tr")) {
			model = legGrid.dataItem(legRow.next("tr"));
    		model.ORIGIN = value;
    		SkdGridHelper.getSkdGridManager().getTableCellByGridNFieldName(legGrid, legRow.next("tr"), "ORIGIN").text(value);
    	}else if(options.dataField == "ORIGIN" && legRow.prev().is("tr")) {
    		model = legGrid.dataItem(legRow.prev("tr"));
    		model.DESTINATION = value;
    		SkdGridHelper.getSkdGridManager().getTableCellByGridNFieldName(legGrid, legRow.prev("tr"), "DESTINATION").text(value);
    	}else if(options.dataField == "LEG_TYPE" || options.dataField == "EQUIP_TYPE") {
    		if(isUpdateRoute) {
    			routeData[options.dataField] = value;
    			if(routeGrid != null && routeRow != null && routeRow.length > 0) {
					SkdGridHelper.getSkdGridManager().getTableCellByGridNFieldName(routeGrid, routeRow, options.dataField).text(value);
                    //WIP Route-level data change propagated to 1st leg only - see eq type 12 in route level vs
                    // 12 in 1st leg vs 26 in 2nd leg
                    var allLegsData = legGrid.dataSource.data();
                    //fix for only when route grid changes
                    if(allLegsData.length > 0 && legData["uid"] == allLegsData[0]["uid"] && options.grid_Id == "routeMatrixWIPGrid"){
                        var legData;
                        for(var i=0; i<allLegsData.length; i++){
                            legData = allLegsData[i];
                            legData[options.dataField] = value;
                        }
                    }
				}
    		}
    	}else if(options.dataField == "CARRIER_TYPE" || options.dataField == "SCAC_CD" || options.dataField == "ROUTE_TYPE_CD"){
    		routeData[options.dataField] = value;
    		SkdGridHelper.getSkdGridManager().getTableCellByGridNFieldName(routeGrid, routeRow, options.dataField).text(value);
    		if (parent.scheduleMaintenananceSeletedMenu =='TSG' || parent.scheduleMaintenananceSeletedMenu =='TO') {
    			if (options.dataField == "CARRIER_TYPE") {
    				if (value =='FedEx') {
    					SkdGridHelper.getSkdGridManager().getTableCellByGridNFieldName(routeGrid, routeRow, 'MV_NUM').text('aa');
    					routeData['MV_NUM'] = "aa";
    				} else if (value == 'Contract') {
    					SkdGridHelper.getSkdGridManager().getTableCellByGridNFieldName(routeGrid, routeRow, 'MV_NUM').text('ax');
        				routeData['MV_NUM'] = "ax";
    				} else {
    					routeData['MV_NUM'] = "";
    					SkdGridHelper.getSkdGridManager().getTableCellByGridNFieldName(routeGrid, routeRow, 'MV_NUM').text('');
    				}
    			}
    		}
    	}
		var legGridData = legGrid.dataSource.data().toJSON();
		var successCallBack;
		var isLocalFlag;
		var isRouteEditor = true;
		if(dashboard.SkdMxHelper != null) {
			if(legRow.index() >= 0)
				dashboard.SkdMxHelper.getSkdMxGridComponentManager().matchingLegsMap[dashboard.SkdMxHelper.getMapOpeationManager().getRouteId()][legRow.index()] = legData;
			successCallBack =  dashboard.SkdMxHelper.getSkdMxGridComponentManager().onDefaultsServiceSuccess;
			isLocalFlag = dashboard.isLocalFlag;
			isRouteEditor = true;
		}else {
			dashboard.updateSelectedRouteNLegList();
			successCallBack = dashboard.onDefaultsServiceSuccess;
			isLocalFlag = !dashboard.isLocalTimeFlag();
			isRouteEditor = dashboard.gridId == "routeMatrixGrid" ? true : false;
		}
		if(targetCell.is("td")) {
			targetCell.attr("dataField", options.dataField);
			targetCell.attr("cellValue", value);

            if(dashboard.SkdMxHelper != null) {
                dashboard.GridFocusManager.followCursor(targetCell, options.grid_Id, dashboard.SkdMxHelper.getMapOpeationManager().getRouteId(), options.dataField);
            } else {
            	parent.SkdGridHelper.getSkdGridManager().setPopUpEditValues(options.grid_Id, grid.data("kendoGrid"), $(options.parentObj).closest("tr"), options.dataField);
            }
		}
		if(options.grid_Id.indexOf("allocationGrid") != 0 ) {
            var canCallTimeNCodeService =  SkdMxServiceHelper.getTimeAndCostServiceManagerManager().triggerTimeNCostService(routeData, legGridData, successCallBack, isLocalFlag, isRouteEditor, targetCell);
            if(!canCallTimeNCodeService){
                if(dashboard.SkdMxHelper != null) {
                    dashboard.GridFocusManager.placeCursorToFiledName(options.grid_Id, dashboard.SkdMxHelper.getMapOpeationManager().getRouteId());
                }else {
                    var dashboard = getDashboardContentWindow("scheduleWIPMatrixDiv");
                    dashboard.placeCursorToFieldName(undefined,undefined,undefined,true,undefined);
                }
            }
		}
		if(options.grid_Id.indexOf("allocationGrid") >= 0) {
			SkdGridHelper.getSkdGridManager().enableDisableLocAllocCheckBox(legRow, legData, value);
		}
    };
    
    constructorFn.updateRouteFromFirstLegGridDataSource = function (that,routeData) {
    	var legRow = that.closest("tr");
    	if(legRow.index() == 0 && (that.attr('data-bind').indexOf('value:LEG_TYPE') > -1 || that.attr('data-bind').indexOf('value:EQUIP_TYPE') > -1)) {
    		var routeRow = that.closest("tr.k-detail-row").prev();
    		if(that.attr('data-bind').indexOf('value:LEG_TYPE') > -1) {
    			routeData["LEG_TYPE"] = that.val();
    			if(routeRow && routeRow.length > 0) {
    				this.getTableCellByFieldName(routeRow, "LEG_TYPE").text(that.val());
    			}
    		}else if(that.attr('data-bind').indexOf('value:EQUIP_TYPE') > -1) {
    			routeData["EQUIP_TYPE"] = that.val();
    			if(routeRow && routeRow.length > 0) {
    				this.getTableCellByFieldName(routeRow, "EQUIP_TYPE").text(that.val());
    			}
    		}
    	}
    };
    
    constructorFn.updateFirstLegGridDataSourceFromRoute = function(that,grid_Id) {
    	var legsGrid = that.closest("tr").next().find(grid_Id).data("kendoGrid");
    	if(legsGrid != null) {
    		var gridData = legsGrid.dataSource.view();
    		if(gridData && gridData.length > 0 && this.isNotEmptyOrNull(that.val())) {
                //WIP Route-level data change propagated to 1st leg only - see eq type 12
                // in route level vs 12 in 1st leg vs 26 in 2nd leg
                var firstRow;
                for(var i=0; i< gridData.length; i++){
                    firstRow = gridData[i];
                    if(that.attr('data-bind').indexOf('value:MV_NUM') > -1 ) {
                        firstRow["MV_NUM"] = that.val();
                    }else if(that.attr('data-bind').indexOf('value:LEG_TYPE') > -1) {
                        firstRow["LEG_TYPE"] = that.val();
                        this.getTableCellByFieldName(legsGrid.tbody.find("tr").eq(0), "LEG_TYPE").text(that.val());
                    }else if(that.attr('data-bind').indexOf('value:EQUIP_TYPE') > -1) {
                        firstRow["EQUIP_TYPE"] = that.val();
                        firstRow["MAX_PAYLOAD_WGT_SRC_CD"] = "Eq Type";
                        this.getTableCellByFieldName(legsGrid.tbody.find("tr").eq(0), "EQUIP_TYPE").text(that.val());
                    }
    		    }
    	    }
        }
    };

    constructorFn.updateLegGridDataSourceFromLeg = function(that,grid_Id, routeData) {
    	var legRow = that.closest("tr");
    	var legsGrid = that.closest(grid_Id).data("kendoGrid");
    	var dataItem = legsGrid.dataItem(legRow);
    	var isChange = false;
    	LoggerUtils.console(that.attr('data-bind').indexOf('value:LOCAL_DEP')  +" value:LOCAL_DEP");
    	if(that.attr('data-bind').indexOf('value:LOCAL_ARR') > -1){
    		dataItem["BLOCK_IN_L_TM"] = that.val();
    		routeData["ANCHOR_LEG_TM_CD"] = "Block In";
    		isChange = true;
    	}else if(that.attr('data-bind').indexOf('value:LOCAL_DEP') > -1) {
    		dataItem["BLOCK_OUT_L_TM"] = that.val();
    		routeData["ANCHOR_LEG_TM_CD"] = "Block Out";
    		isChange = true;
    	}else if(that.attr('data-bind').indexOf('value:ZULU_ARR') > -1) {
    		dataItem["BLOCK_IN_Z_TM"] = that.val();
    		routeData["ANCHOR_LEG_TM_CD"] = "Block In";
    		isChange = true;
    	}else if(that.attr('data-bind').indexOf('value:ZULU_DEP') > -1) {
    		dataItem["BLOCK_OUT_Z_TM"] = that.val();
    		routeData["ANCHOR_LEG_TM_CD"] = "Block Out";
    		isChange = true;
    	}else if(that.attr('data-bind').indexOf('value:B_OFFTIME_L') > -1) {
    		dataItem["BLOCK_OFF_L_TM"] = that.val();
    		routeData["ANCHOR_LEG_TM_CD"] = "Off";
    		isChange = true;
    	}else if(that.attr('data-bind').indexOf('value:LANDING_TIME_L') > -1) {
    		dataItem["BLOCK_ON_L_TM"] = that.val();
    		routeData["ANCHOR_LEG_TM_CD"] = "On";
    		isChange = true;
    	}else if(that.attr('data-bind').indexOf('value:B_OFFTIME_Z') > -1) {
    		dataItem["BLOCK_OFF_Z_TM"] = that.val();
    		routeData["ANCHOR_LEG_TM_CD"] = "Off";
    		isChange = true;
    	}else if(that.attr('data-bind').indexOf('value:LANDING_TIME_Z') > -1) {
    		dataItem["BLOCK_ON_Z_TM"] = that.val();
    		routeData["ANCHOR_LEG_TM_CD"] = "On";
    		isChange = true;
    	}else if(that.attr('data-bind').indexOf('value:FLIGHT_MINS') > -1) {
    		dataItem["FLIGHT_MIN_QTY"] = that.val();
    		isChange = true;
    	}else if(that.attr('data-bind').indexOf('value:MAX_PAYLOAD_WT') > -1) {
    		dataItem["MAX_PAYLOAD_WGT_SRC_CD"] = "User";
    	}else if(that.attr('data-bind').indexOf('value:MAX_PAYLOAD_CU') > -1) {
    		dataItem["MAX_PAYLOAD_WGT_SRC_CD"] = "User";
    	}else if(that.attr('data-bind').indexOf('value:EQUIP_TYPE') > -1) {
    		dataItem["MAX_PAYLOAD_WGT_SRC_CD"] = "Eq Type";
    	}
    	if(isChange && this.isNotEmptyOrNull(that.val())) {
    		routeData["ANCHOR_LEG_SEQ"] = legRow.index();
    	}
    };
    
    constructorFn.updateOriginNDestinationOnBlur = function(that, gridId) {
    	var model = {};
    	var row = that.closest("tr");
    	var grid = that.closest(gridId).data("kendoGrid");
    	if(that.attr('data-bind').indexOf('value:DESTINATION') > -1 && row.next().is("tr")) {
    		model = grid.dataItem(row.next("tr"));
    		model.ORIGIN = that.val();
    		this.getTableCellByFieldName(row.next("tr"), "ORIGIN").text(that.val());
    	}else if(that.attr('data-bind').indexOf('value:ORIGIN') > -1 && row.prev().is("tr")) {
    		model = grid.dataItem(row.prev("tr"));
    		model.DESTINATION = that.val();
    		this.getTableCellByFieldName(row.prev("tr"), "DESTINATION").text(that.val());
    	}
    	if (model != undefined && model.OPERATION_CD != OPERATION_CD_ADD) {
    		 model.OPERATION_CD = OPERATION_CD_MODIFY;
    	}
    };
    
    constructorFn.getTableCellByFieldName = function(row, fieldName) {
    	var grid = row.closest("div.k-grid.k-widget").data("kendoGrid");
    	var cellIndex = grid.thead.find("th.k-header[data-field='" + fieldName + "']").index();
    	var cell = row.find("td").eq(cellIndex);
    	return cell;
    };
    
    constructorFn.getTableCellByGridNFieldName = function(grid, row, fieldName) {
    	var cellIndex = grid.thead.find("th.k-header[data-field='" + fieldName + "']").index();
    	var cell = row.find("td").eq(cellIndex);
    	return cell;
    };
    

    constructorFn.changeCaseToUpperCase = function(input) {
    	var dataField;
    	if(input != null && input.length > 0) {
    		if(input.attr("data-bind").indexOf("ORIGIN") > -1) {
    			dataField = "ORIGIN";
    		}else if(input.attr("data-bind").indexOf("DESTINATION") > -1) {
    			dataField = "DESTINATION";
    		}else if(input.attr("data-bind").indexOf("LEG_TYPE") > -1) {
    			dataField = "LEG_TYPE";
    		}else if(input.attr("data-bind").indexOf("EQUIP_TYPE") > -1) {
    			dataField = "EQUIP_TYPE";
    		}else if(input.attr("data-bind").indexOf("OWNER_LOC_CD") > -1) {
    			dataField = "OWNER_LOC_CD";
    		}else if (input.attr("data-bind").indexOf("MV_NUM") > -1) {
    			dataField = "MV_NUM";
    		}else if (input.attr("data-bind").indexOf("LOC_CD") > -1) {
    			dataField = "LOC_CD";
    		}
    		if(dataField != null) {
    			this.changeCase(input, dataField);
    		}
    	}
    };
    
    constructorFn.changeCase = function(input, dataField) {
    	var row = input.closest("tr");
    	var grid = row.closest("div.k-grid").data("kendoGrid");
    	var dataItem = grid.dataItem(row);
    	if(!(this.isTruckStandard(dataItem,dataField))) { //fixed as per FDX-1321 WIP: Force Leg Type Entry to Upper Case (GBT)
    		dataItem[dataField] = input.val().toUpperCase();
    		input.val(input.val().toUpperCase());
    	}else if(this.isTruckStandard(dataItem,dataField)){
    		dataItem[dataField] = input.val().toLowerCase();
    		input.val(input.val().toLowerCase());
    	}
    };
    
    constructorFn.isTruckStandard = function(dataItem,dataField){
    	return dataItem.MODE == "Truck" && dataField == "LEG_TYPE" && dataItem.CAPACITY_CD == "Standard"
    };
    constructorFn.showAnchorTimeFlag = function(gridId, dashboardId) {
    	try {
	    	var dashboard = getDashboardContentWindow(dashboardId);
	    	var routeGrid = dashboard.$("#"+gridId).data("kendoGrid");
	    	var routeRows = dashboard.$("#"+gridId).find("tr.k-master-row");
	    	var routeData, legData;
	    	var legGrid, legRow;
	    	var cellL, cellZ;
	    	for(var i=0; i<routeRows.length; i++) {
	    		if($(routeRows[i]).parents().eq(3).attr("id").indexOf("routeMatrixWIPGrid") >= 0){
		    		routeData = routeGrid.dataItem($(routeRows[i]));
		    		if(routeData != undefined){
		    			legGrid = dashboard.$(routeRows[i]).next().find("div.k-legs-grid").data("kendoGrid");
			    		if(legGrid != undefined){
				    		legRow = legGrid.tbody.find("tr").eq(routeData.ANCHOR_LEG_SEQ);
				    		if(legRow == null || legRow.length < 0) {
				    			legRow = legGrid.tbody.find("tr").eq(legGrid.tbody.find("tr").length - 1);
				    		}
				    		if(routeData.ANCHOR_LEG_TM_CD == "Block In") {
				    			cellL = SkdGridHelper.getSkdGridManager().getTableCellByGridNFieldName(legGrid, legRow, "LOCAL_ARR");
				    			cellZ = SkdGridHelper.getSkdGridManager().getTableCellByGridNFieldName(legGrid, legRow, "ZULU_ARR");
				    		}else if(routeData.ANCHOR_LEG_TM_CD == "Block Out") {
				    			cellL = SkdGridHelper.getSkdGridManager().getTableCellByGridNFieldName(legGrid, legRow, "LOCAL_DEP");
				    			cellZ = SkdGridHelper.getSkdGridManager().getTableCellByGridNFieldName(legGrid, legRow, "ZULU_DEP");
				    		}else if(routeData.ANCHOR_LEG_TM_CD == "Off") {
				    			cellL = SkdGridHelper.getSkdGridManager().getTableCellByGridNFieldName(legGrid, legRow, "B_OFFTIME_L");
				    			cellZ = SkdGridHelper.getSkdGridManager().getTableCellByGridNFieldName(legGrid, legRow, "B_OFFTIME_Z");
				    		}else if(routeData.ANCHOR_LEG_TM_CD == "On") {
				    			cellL = SkdGridHelper.getSkdGridManager().getTableCellByGridNFieldName(legGrid, legRow, "LANDING_TIME_L");
				    			cellZ = SkdGridHelper.getSkdGridManager().getTableCellByGridNFieldName(legGrid, legRow, "LANDING_TIME_Z");
				    		}
			    			if(cellL != undefined && cellZ != undefined){
			    				cellL.css("font-style", "italic");
			    				cellZ.css("font-style", "italic");
			    				routeData["ANCHOR_LEG_ID"] = legGrid.dataItem(legRow)["LEG_ID"];
			    				break;
			    			}
			    		}
		    		}
	    		}
	    	}
    	}catch (e) {
			console.log("Error while applying the anchor flag");
		}
    };
    constructorFn.setInfoForCurrentSelectedRoute = function(routeData,grid_id, dashboardId,selectedCheckBox,changedLegData,staticLegData,staticRouteData,from) {
    	parent.currentSelectedRouteComment = routeData;
    	parent.selectedDetails= new Object();
    	parent.selectedDetails.selectedCheckBox = selectedCheckBox;
    	parent.selectedDetails.grid_id = grid_id;
    	//parent.selectedDetails.parentGridId = gridId;
    	parent.selectedDetails.dashboardID = dashboardId;
    	parent.selectedDetails.staticLegData = staticLegData;
    	parent.selectedDetails.changedRouteData = [routeData];
    	parent.selectedDetails.changedLegData = changedLegData;
    	parent.selectedDetails.staticRouteData = staticRouteData;
    	parent.selectedDetails.from = from;
    };
    constructorFn.setDashBoardTitle = function(routeData, dashboardId){
    	var currentCase = parent.getSelectedCase();
    	
    	var dashboardTitle="Comments - Plan: " + currentCase.commonCaseDesc + " "
    	+ "Schedule: Master"+" "+ "Route: "+routeData.MV_NUM;
    	if (dashboardId == parent.DASHBOARD_ID_REVISION_COMMENTS) {
    		dashboardTitle = "Revision " + dashboardTitle;
    	} 
    	parent.dashboardController.setDashboardTitle(dashboardId, dashboardTitle);
    };
    constructorFn.isRouteDataModified = function(initalroute, updatedRoute) { 
    	if (initalroute["FULL_EFFDAY_HOLIDAY_L"] != updatedRoute["FULL_EFFDAY_HOLIDAY_L"] 
    		|| initalroute["FULL_EFFDAY_HOLIDAY_Z"] != updatedRoute["FULL_EFFDAY_HOLIDAY_Z"] 
    		|| initalroute["LEG_TYPE"] != updatedRoute["LEG_TYPE"] || initalroute["EQUIP_TYPE"] != updatedRoute["EQUIP_TYPE"]
    		|| initalroute["CARRIER_TYPE"] != updatedRoute["CARRIER_TYPE"]) {
    		return true;
    	}
    	return false;
    };

    constructorFn.isLegDataModified = function(filterInitialLegList, updatedLegList) {
    	if (filterInitialLegList.length != updatedLegList.length) {
    		return true;
    	} else {
    		for (var i=0; i <filterInitialLegList.length; i++) {
    			var filteredLegList =  $.grep(updatedLegList, function(obj) {
    				return obj["LEG_ID"] == filterInitialLegList[i]["LEG_ID"];
    			 });
    			if (filteredLegList != undefined  && filteredLegList.length >0) {
    				 if (filterInitialLegList[i]["FULL_EFFDAY_HOLIDAY_L"] != filteredLegList[0]["FULL_EFFDAY_HOLIDAY_L"] ||
    						 filterInitialLegList[i]["FULL_EFFDAY_HOLIDAY_Z"] != filteredLegList[0]["FULL_EFFDAY_HOLIDAY_Z"]||
    						 filterInitialLegList[i]["ORIGIN"] != filteredLegList[0]["ORIGIN"]||
    						 filterInitialLegList[i]["DESTINATION"] != filteredLegList[0]["DESTINATION"]||
    						 filterInitialLegList[i]["LOCAL_DEP"] != filteredLegList[0]["LOCAL_DEP"]||
    						 filterInitialLegList[i]["ZULU_DEP"] != filteredLegList[0]["ZULU_DEP"]||
    						 filterInitialLegList[i]["LOCAL_ARR"] != filteredLegList[0]["LOCAL_ARR"]||
    						 filterInitialLegList[i]["BLOCK_INDAY_L_NBR"] != filteredLegList[0]["BLOCK_INDAY_L_NBR"]|| 
    						 filterInitialLegList[i]["BLOCK_INDAY_Z_NBR"] != filteredLegList[0]["BLOCK_INDAY_Z_NBR"]) {
    					 return true;
    				 };
    			} else {
    				return true;
    			};
    		};
    	}
    	return false;
    };
    constructorFn.isDataModified = function(staticRouteData, staticlegData,dynamicRouteData,dynamicLegData) {
    	if (this.isRouteDataModified(staticRouteData[0],dynamicRouteData[0])) {
    		return true;
    	}else if (this.isLegDataModified(staticlegData,dynamicLegData)) {
    		return true;
    	}
    	return false;
    };
    constructorFn.getFormattedData = function (routeData,finalString) {
    	var oneDay = 24*60*60*1000;
    	currentCase = parent.getSelectedCase();
    	var planStartDate, planEndDate, planPerDayQty;
    	if(currentCase){
    		planStartDate = currentCase.planPerStartDtml;
    		planEndDate = currentCase.planPerEndDtml;
    		planPerDayQty = currentCase.planPerDayQty;
    	}
    	var selectableDaysStr = "0-" + planPerDayQty;
    	startDate = new Date(parent.changeCaseDateFormat(planStartDate));
    	startDate = new Date(startDate.getTime() - oneDay);
    	endDate = new Date(parent.changeCaseDateFormat(planEndDate));
    	totalDays = parent.getTotalDays(startDate, endDate);
    	var totalFullWeeks = Math.floor(totalDays/7);
    	endDate = new Date(startDate.getTime() + (7 * (totalFullWeeks + 2) + 1) * oneDay);
    	totalDays = parent.getTotalDays(startDate, endDate);
    	//var selectableDaysStr = "0-" + planPerDayQty;
    	selectedDaysStr = parent.SkdGridHelper.getSkdGridManager().parseFullEffDayStr(routeData.ROUTE_FULL_EFFDT_L);
    	var selectedDaysArray = parent.getDaysArray(selectedDaysStr, null);
    	var selectableDaysArray = parent.getDaysArray(selectableDaysStr, null);
    	var selectedHolDaysArray = parent.getHolidayDayssArray(selectedDaysStr, routeData.ROUTE_HOL_DAYS_L);
    	
    	var firstDay = startDate.getDay();
    	var datesArr = [];

    	var i, tempDate;
    	var dayCount = 0;
    	if(firstDay == 0){
    		firstDay = 7;
    	}
    	for(i=0; i<totalDays;i++) {
    		dayCount++;
    		tempDate = new Date(startDate.getTime() + oneDay*i);
    		var isDisable = false;
    		if(selectableDaysArray && !($.inArray(i, selectableDaysArray) > -1)){
    			isDisable = true;
    		}
    		datesArr.push({datedatesArr:tempDate, selected:false, disabled:isDisable, planDay:i, week:Math.ceil(dayCount/7)});
    	}
    	var availablePlan =[];
    	var notAvailable =[];
    	var planMap = {};
    	var tempSelectedDaysArray = selectedDaysArray.concat(selectedHolDaysArray["H"]).concat(selectedHolDaysArray["C"])
    	for (var p=0; p < tempSelectedDaysArray.length; p++) {
    		plan = tempSelectedDaysArray[p] % 7;
    		if(plan == 0){	//FDX-1355 Revision Comment: Cancel Results in Incorrect "D0 Zulu" Logic in RDC
    			plan = 7;
    		}
    		if(planMap[plan] != undefined){
    			(planMap[plan]).push(tempSelectedDaysArray[p]) 
    		}else{
    			planMap[plan] = [tempSelectedDaysArray[p]];
    		}
    	}
    	availablePlan = Object.keys(planMap);
    	//var totalweek = planPerDayQty/7;
    	for (var j=0; j <= availablePlan.length; j++) {
    		var plan= parseInt(availablePlan[j]);
    			for (k = plan; k <= planPerDayQty;) {
    				if (k <= planPerDayQty) {
    					var nextPlan = $.grep(selectedDaysArray, function(value, m) {
    			            return (value) == k;
    			        });
    					if (nextPlan.length == 0) {
    						var isAvailable = false;
    						if (selectedHolDaysArray != null && selectedHolDaysArray ["C"].length >0) {
    							var cancelArray = selectedHolDaysArray ["C"];
    							var cancelDay = $.grep(cancelArray, function(value, m) {
    	    			            return (value) == k;
    	    			        });
    							if (cancelDay.length > 0) {
    								isAvailable = false;
    							}
    						}
    						if (!isAvailable) {
    							if (selectedHolDaysArray != null && selectedHolDaysArray ["H"].length >0) {
        							var holidaysArray = selectedHolDaysArray ["H"];
        							var holiday = $.grep(holidaysArray, function(value, m) {
        	    			            return (value) == k;
        	    			        });
        							if (holiday.length > 0) {
        								isAvailable = true;
        							}
        						}
    						}
    						if (!isAvailable) {
    							notAvailable.push(k);
    						}
    					}
    			}
    			k = k+7;
    		} 
    	}
    	
    	if (availablePlan.length >0) {
    		finalString = finalString +" D " + availablePlan.join(",");
    	} else {
    		
    	}
    	if (selectedHolDaysArray != null && selectedHolDaysArray ["C"].length >0) {
    		$.merge(notAvailable,selectedHolDaysArray ["C"]);
    	}
    	// remove the duplicate as not available can be canceled , there can be better way to filter an array 
    	notAvailable= notAvailable.filter(function(item, pos) {
			return notAvailable.indexOf(item) == pos;
		})	
    	 if (notAvailable.length > 0) {
    		 notAvailable.sort(function(a,b){return a - b});
    		 finalString = finalString + " NOT ";
    		/*var selectedCancelDays = selectedHolDaysArray ["C"];
    		if (!notAdded) {
    			 finalString = finalString + " NOT ";
    		}*/
    		for (var i = 0; i< notAvailable.length; i++) {
    			 var effectiveDays = $.grep(datesArr, function(obj) {
    					return (obj["planDay"] == notAvailable[i]);
    			});
    				if (i == (notAvailable.length-1)) {
    					finalString =  finalString + this.getDDMMFormat(effectiveDays[0]["datedatesArr"]) + " ";
    				} else  {
    					finalString = finalString + this.getDDMMFormat(effectiveDays[0]["datedatesArr"])+" & " ;
    				}
    		}
    	}
    	if (parent.isLocalTimeFlag()) {
    		finalString = finalString.trim() + " L";
    	} else {
    		finalString = finalString.trim() + " Z";
    	}
    	return finalString;
    };
    constructorFn.getDDMMFormat = function (date) {
    	var month = (date.getMonth()+1) > 9 ? (date.getMonth()) : "0" + (date.getMonth()+1);
    	var day = (date.getDate()) > 9 ? (date.getDate()) : "0" + (date.getDate());
    	var dateString = 
    	    month + "/" + 
    	    day ;
    	   
    	return dateString;
    	
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
