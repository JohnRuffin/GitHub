//Array for All IBOB Open matrix IDs
var ibobOpenMatrixIds = new Array();
// Boolean flag to determine if the request is from Network Schedule or not
var isNetworkScheduleFlag;
// Var to have flag for Schedule or Network Schedule
var dayWhereClauses = {};
//Favorite component
var favoriteComponent;

var commonMatrixConstants = {
		//Array for Week Local columns
	    WEEK_COLUMNS_L: ["EFFWEEKSL_W5"],
	    //Array for Week Zulu columns
	    WEEK_COLUMNS_Z: ["EFFWEEKSZ_W5"],
	    ROUTE_WEEK_COLUMNS_L: ["RTEEFFWEEKSL_W5"],
	    ROUTE_WEEK_COLUMNS_Z: ["RTEEFFWEEKSZ_W5"],
	    FILTER_TYPE_STRING: "string",
	    FILTER_TYPE_NUMBER: "number",
	    FILTER_TYPE_DATE: "date",
	    FILTER_TYPE_BOOLEAN: "boolean",
	    FILTER_TYPE_NONE: "none",
	    FILTER_TYPE_DESCRIPTION: "description",
	    FILTER_TYPE_TIME: "time",
		volColLabelMap:{},
		timeColLabelMap:{}
	};
	

var volumeUtilizationTreeGridMatrixConstants = {
		PROGRESS_DIALOG_MESSAGE_SCHEDULE_MATRIX:"Loading volume utilization matrix...",
		calenderRowTemplateL:"#= calenderRowEditor(data,getContainerId()[0],'L') #",
		calenderRowTemplateZ:"#= calenderRowEditor(data,getContainerId()[0],'Z') #",
		calenderRouteRowTemplateL:"#= calenderRowEditor(data,getContainerId()[0],'RL') #",
		calenderRouteRowTemplateZ:"#= calenderRowEditor(data,getContainerId()[0],'RZ') #",
		EFF_LOCAL_COLUMNS:["EFFDAYSL_D1","EFFDAYSL_D2","EFFDAYSL_D3","EFFDAYSL_D4","EFFDAYSL_D5","EFFDAYSL_D6","EFFDAYSL_D7","EFFWEEKSL_W1","EFFWEEKSL_W2","EFFWEEKSL_W3","EFFWEEKSL_W4"],
		EFF_ZULU_COLUMNS:["EFFDAYSZ_D1","EFFDAYSZ_D2","EFFDAYSZ_D3","EFFDAYSZ_D4","EFFDAYSZ_D5","EFFDAYSZ_D6","EFFDAYSZ_D7","EFFWEEKSZ_W1","EFFWEEKSZ_W2","EFFWEEKSZ_W3","EFFWEEKSZ_W4"],
		ROUTE_EFF_LOCAL_COLUMNS:["RTEEFFDAYSL_D1","RTEEFFDAYSL_D2","RTEEFFDAYSL_D3","RTEEFFDAYSL_D4","RTEEFFDAYSL_D5","RTEEFFDAYSL_D6","RTEEFFDAYSL_D7","RTEEFFWEEKSL_W1","RTEEFFWEEKSL_W2","RTEEFFWEEKSL_W3","RTEEFFWEEKSL_W4"],
		ROUTE_EFF_ZULU_COLUMNS:[ "RTEEFFDAYSZ_D1","RTEEFFDAYSZ_D2","RTEEFFDAYSZ_D3","RTEEFFDAYSZ_D4","RTEEFFDAYSZ_D5","RTEEFFDAYSZ_D6","RTEEFFDAYSZ_D7","RTEEFFWEEKSZ_W1","RTEEFFWEEKSZ_W2","RTEEFFWEEKSZ_W3","RTEEFFWEEKSZ_W4"],
		LOCAL_COLUMNS:["NOOP_DAYS_L", "BO_TIME_L", "BI_TIME_L", "BI_DAY_L", "CAL_BUTTON_L", "EFFDAYSL", "KEYWORD_EFFDT_L", "DAY", "RTEEFFDAYSL","ROUTE_KEYWORD_EFFDT_L", "CAL_BUTTON_ROUTE_L"],
		ZULU_COLUMNS:["NOOP_DAYS_Z","BO_TIME_Z", "BI_TIME_Z", "BI_DAY_Z", "CAL_BUTTON_Z", "EFFDAYSZ", "KEYWORD_EFFDT_Z", "DAYZ", "RTEEFFDAYSZ","ROUTE_KEYWORD_EFFDT_Z", "CAL_BUTTON_ROUTE_Z"],
		DAY_COLUMN: "DAY",
		WEEK_COLUMNS_L:["EFFWEEKSL_W5"],
		ROUTE_WEEK_COLUMNS_L:["RTEEFFWEEKSL_W5"],
		WEEK_COLUMNS_Z: ["EFFWEEKSZ_W5"],
		ROUTE_WEEK_COLUMNS_Z:["RTEEFFWEEKSZ_W5"],
		LOCAL_COLUMNS_IBOB :["availTimeL","arrivalDayL","dueTimeL","EFFDAYSL_D1","EFFDAYSL_D2","EFFDAYSL_D3","EFFDAYSL_D4","EFFDAYSL_D5","EFFDAYSL_D6","EFFDAYSL_D7","EFFWEEKSL_W1","EFFWEEKSL_W2","EFFWEEKSL_W3","EFFWEEKSL_W4","CAL_BUTTON_L","CAL_BUTTON_ROUTE_L"],
		ZULU_COLUMNS_IBOB:["availTimeZ","arrivalDayZ","dueTimeZ","EFFDAYSZ_D1","EFFDAYSZ_D2","EFFDAYSZ_D3","EFFDAYSZ_D4","EFFDAYSZ_D5","EFFDAYSZ_D6","EFFDAYSZ_D7","EFFWEEKSZ_W1","EFFWEEKSZ_W2","EFFWEEKSZ_W3","EFFWEEKSZ_W4","CAL_BUTTON_Z","CAL_BUTTON_ROUTE_Z"],
		
		gridConfig: '<grid headerClicked  = "itemheaderClickedHandler"  ' + 'itemClick = "itemClickHandler"  ' + 'horizontalScrollPolicy="auto" ' + //Enables the horizontal scroll policy
		    //'itemOpen="itemOpenHandler" '+
		    //'itemClose="itemCloseHandler" '+
		    /*'enableExport="true" ' +*/ // This Enables the export operation in the toolbar
		    'forcePagerRow="true" ' +
		    'enablePaging="true" pageSize="1000" '+
		    /*Flag to force appearance of the pager row even with enablePaging=false. 
			Use this flag to show the pager control even if the enablePaging is set to false. 
			This is used in a scenario where you wish to show buttons other than the paging buttons in the pager bar*/
		    'enableFilters="true" ' + // This Enables the inline filters
		    'enableFooters="true" ' + // This Enables the footers.
		    'variableHeaderHeight="true" ' + // This Enables the variable header heights.			
		    'footerDrawTopBorder="true" ' + // ??
		    'enableMultiColumnSort="true" ' + // This enables the multi sorting of columns
		    'useCompactPreferences="true" ' + 
		    'preferencePersistenceKey="scheduleMatrix" ' + /*'selectionMode="singleCells" '+*/
		    /*'enableSplitHeader="false" '+*/
		    /*'enableDrillDown="true" '+*/
		    'borderColor="0x9f9f9f" '+
		    'enableDefaultDisclosureIcon="true" '+
		    'disclosureOpenIcon="custom/collapse.png" ' +
		    'disclosureClosedIcon="custom/expand.png" '+
		    'enableDynamicLevels="true" ' +
		    'autoLoadPreferences="false" '+
		    'enableMultiplePreferences="true" '+
		    'showSpinnerOnFilterPageSort="true" '+
		    /*'enableSelectionBubble="true" '+	
			'enableSelectionCascade="true" '+
			'selectedKeyField="LEG_TYPE" '+	*/
		    '>' +
	    '</grid>'
	};

	commonMatrixConstants.timeColLabelMap["NOOP_DAYS_L"] = ["No Op Days"];
	commonMatrixConstants.timeColLabelMap["BO_TIME_L"] = ["Dept"];
	commonMatrixConstants.timeColLabelMap["BI_TIME_L"] = ["Arriv"];
	commonMatrixConstants.timeColLabelMap["BI_DAY_L"] = ["Arriv Day"];
	commonMatrixConstants.timeColLabelMap["NOOP_DAYS_Z"] = ["No Op Days"];
	commonMatrixConstants.timeColLabelMap["BO_TIME_Z"] = ["Dept"];
	commonMatrixConstants.timeColLabelMap["BI_TIME_Z"] = ["Arriv"];
	commonMatrixConstants.timeColLabelMap["BI_DAY_Z"] = ["Arriv Day"];
	commonMatrixConstants.timeColLabelMap["DAY"] = ["Vol Day"];
	commonMatrixConstants.timeColLabelMap["DAYZ"] = ["Vol Day"];

	commonMatrixConstants.volColLabelMap["TOTAL_WGT"] = ["Ttl Wt"];
	commonMatrixConstants.volColLabelMap["TOTAL_WGT_PER"] = ["Ttl Wt %"];
	commonMatrixConstants.volColLabelMap["AVAIL_WGT"] = ["Avail Wt"];
	commonMatrixConstants.volColLabelMap["EXCESS_WEIGHT"] = ["Excess Wt"];
	commonMatrixConstants.volColLabelMap["MAX_PAYLOAD_WT"] = ["Max Pld Wt"];
	commonMatrixConstants.volColLabelMap["TOTAL_CU"] = ["Ttl Cu"];
	commonMatrixConstants.volColLabelMap["TOTAL_CU_PER"] = ["Ttl Cu %"];
	commonMatrixConstants.volColLabelMap["AVAIL_CU"] = ["Avail Cu"];
	commonMatrixConstants.volColLabelMap["EXCESS_CUBE"] = ["Excess Cu"];
	commonMatrixConstants.volColLabelMap["MAX_PAYLOAD_CU"] = ["Max Pld Cu"];
	commonMatrixConstants.volColLabelMap["TOTAL_PCS"] = ["Ttl Pcs"];

/******* common methods - start *******/

/**
* Called when Plan is changed
* To hide/unhide matrix columns based on the selected plan.
*/
function onPlanChange() {
	// hide/unhide columns based on week plan.
	updateEffectiveSettingsClick("All_Local_Columns");
	updateEffectiveSettingsClick("All_Zulu_Columns");
}

function onTabSelect(tabName) {
}

/**
* Called before Volume Utilization Query executed
* To clear the volume utilization matrix out.
*/
function onBeforeRunQuery() {
	clear(false, false);
}

function onNetworkQuerySuccess() {
}

function onNetworkScheduleQuerySuccess() {
	if (parent.isNetworkQuery && isNetworkScheduleFlag) {
		refreshMatrix();
	}
}

/**
* Called on Schedule Query success
* To refresh Volume Utilization matrix.
*/
function onScheduleQuerySuccess() {
	if (!parent.isNetworkQuery && !isNetworkScheduleFlag) {
		refreshMatrix();
	}
}

/**
* Called on Volume Utilization Matrix refresh
* To refresh volume utilization matrix.
*/
function refresh() {
	if(parent.needToLoadData(parent.DASHBOARD_ID_VOLUME_UTILIZATION_TREE_GRID_MATRIX, isNetworkScheduleFlag)) {
		refreshMatrix();
	}
}

/**
* Called on day component click
* To open the volume utilization matrix day control.
*/
function openDayControl(btn) {
	parent.VIEWER.openDayControl(btn, parent.DASHBOARD_ID_VOLUME_UTILIZATION_TREE_GRID_MATRIX, parent.getDataType(isNetworkScheduleFlag));
}

/******* common methods - end *******/

/******* common methods - favorites - start *******/

function getHeaderButtonSettings() {
}

/**
* Volume utilization Display option setting
* get volume utilization matrix display option favorites setting.
*/
function getDisplayOptionSettings() {
	return getColumnsSettings(getContainerId()[0]);
}

/**
* Volume utilization Contents setting
* get volume utilization matrix contents favorites setting.
*/
function getContentFavoriteSettings() {
	return getMatrixContentFavoriteSettings(getContainerId()[0]);
}
function applyHeaderButtonSettings(headerButtonSettings) {
}

/**
* Volume utilization Display option setting
* apply volume utilization matrix display option favorites setting.
*/
function applyDisplayOptionSettings(displayOptionSettings, isDefaultFavorite, isApplicationLevel, isRefreshDashboard) {
	setColumnsSettings(displayOptionSettings,getContainerId()[0]);
}

/**
* Volume utilization Content setting
* apply volume utilization matrix contents favorites setting.
*/
function applyContentFavoriteSettings(contentSettings, isDefaultFavorite, isApplicationLevel, isRefreshDashboard) {
	setMatrixContentFavoriteSettings(getContainerId()[0],contentSettings);
}
/******* common methods - favorites - end *******/

/**
* set network schedule flag.
* Method to set isNetworkScheduleFlag to determine if the request is from Network Schedule.
*/
function setNetworkScheduleFlag(flag) {
	var flag = flag == "true" ? true : false;
	var hasDataTypeChanged = isNetworkScheduleFlag != flag;
	if(hasDataTypeChanged) {
		if(isNetworkScheduleFlag != undefined) {
			dayWhereClauses[getDataType()] = dayWhereClause;
		}
		isNetworkScheduleFlag = flag;
		searchCriteria.setCriteria(CRITERIA_IS_NW_RELATED, isNetworkScheduleFlag);
		dayWhereClause = dayWhereClauses[getDataType()];
		
		parent.setDashboardDataStatus(parent.DASHBOARD_ID_VOLUME_UTILIZATION_TREE_GRID_MATRIX, getDataType(), false);
	}
}

/**
* get matrix data type.
* Method to check data type for Schedule or Network Schedule.
*/
function getDataType() {
	if(isNetworkScheduleFlag) {
		return parent.DATA_TYPE_NETWORK_SCHEDULE;
	}
	return parent.DATA_TYPE_SCHEDULE;
}

function getContainerId() {
    return [parent.DASHBOARD_ID_VOLUME_UTILIZATION_TREE_GRID_MATRIX+ parent.PARAM_TREE_GRID];
}

/**
* Volume utilization Initialize method
* Method to use for initialization of Volume utilization Matrix.
* @param flag - Flag to determine if the request is first time. If it's first time request, we will initialize display options else not.
* @param favoriteSettings - Columns which are stored in favorites
*/
function initialize(flag, favoriteSettings) {
	AdvancedDataGrid.setDataProvider(getMatrixID(), []);
	setMatrixFavoriteSettings(favoriteSettings);	
	if(flag == undefined) {
		setMatrixID(getContainerId());
		setDashboardID(parent.DASHBOARD_ID_VOLUME_UTILIZATION_TREE_GRID_MATRIX);
		isClearOn = false;
		addButtonsBar();
		favoriteComponent = new FavoriteComponent(parent.DASHBOARD_ID_VOLUME_UTILIZATION_TREE_GRID_MATRIX, "volUtilMatrixFavoritesMenu","Volume Utilization");
		favoriteComponent.retrieveAllFavorites(true, applyDefaultFavoriteOnInitialize);
		isNetworkScheduleFlag = parent.isNetworkQuery;
		searchCriteria.setCriteria(CRITERIA_IS_NW_RELATED, isNetworkScheduleFlag);
	}
	var matrixURL = getVolumeUtilizationMatrixUrl();
	if (isClearOn == true) {
		matrixURL = null;
	}
	var matrixObject = this;

	var grid = new AdvancedDataGrid(getContainerId()[0], {
	        		configuration: volumeUtilizationTreeGridMatrixConstants.gridConfig,
	        		id: getContainerId()[0],
	        		dataProvider: [],
	        		isCellCustomBackgroundDrawFunctionDefault: false
	    		}, getMatrixColumns(favColumns), updateResponseHandler);
	parent.setDashboardDataStatus(getDashboardID(), parent.getDataType(), false);
	refresh();
	if(flag == undefined) {		
		initializeDisplayOptions();
		parent.setDashboardInitialized(parent.DASHBOARD_ID_VOLUME_UTILIZATION_TREE_GRID_MATRIX);
	}
    parent.setDashboardInitialized(getDashboardID());
    parent.setDashboardInitialized(parent.DASHBOARD_ID_VOLUME_UTILIZATION_TREE_GRID_MATRIX);
    initializeDisplayOptions(true);
    //setEffectiveSeperateDays();
}

function updateResponseHandler(response) {
	if(response != undefined && response.length >= 0){
	    $.each(response, function(idx, dataItem) {
	        populateEffectiveDayColumns(dataItem, "FULL_EFFDT_L", "FULL_EFFDT_Z");
			populateEffectiveDayColumns(dataItem, "ROUTE_FULL_EFFDT_L", "ROUTE_FULL_EFFDT_Z", "RTE");
	    });
	} 
    parent.showProgressDialog(false);
    return response;
}

/**
* Volume utilization Matrix columns model
* Method to get Volume utilization Matrix columns model configuration.
*/
function getMatrixModel() {
	var matrixModelArr = {};
	matrixModelArr.LEG_ID = { type: "string" };
	matrixModelArr.MV_NUM = { type : "string" };
	matrixModelArr.MV_NUM_SEQ = { type : "string" };
	matrixModelArr.EQUIP_TYPE = { type : "string" };
	matrixModelArr.EQUIP_DESC = { type : "string" };
	matrixModelArr.OP_DAYS = { type : "string" };
	matrixModelArr.ORIGIN = { type : "string" };
	matrixModelArr.DESTINATION = { type : "string" };
	matrixModelArr.BO_TIME_L = { type : "date" };
	matrixModelArr.BO_TIME_Z = { type : "date" };
	matrixModelArr.BI_TIME_L = { type : "date" };
	matrixModelArr.BI_TIME_Z = { type : "date" };
	matrixModelArr.DAY = { type : "number" };
	matrixModelArr.DAYZ = { type : "number" };
	matrixModelArr.NOOP_DAYS_L = { type : "string" };
	matrixModelArr.NOOP_DAYS_Z = { type : "string" };
	matrixModelArr.KEYWORD_EFFDT_L = { type : "string" };
	matrixModelArr.KEYWORD_EFFDT_Z = { type : "string" };
	matrixModelArr.LEG_HOL_DAYS_L = { type : "string" };
	matrixModelArr.LEG_HOL_DAYS_Z = { type : "string" };
	matrixModelArr.ROUTE_NOOP_DAYS_L = { type : "string" };
	matrixModelArr.ROUTE_NOOP_DAYS_Z = { type : "string" };
	matrixModelArr.ROUTE_KEYWORD_EFFDT_L = { type : "string" };
	matrixModelArr.ROUTE_KEYWORD_EFFDT_Z = { type : "string" };
	matrixModelArr.ROUTE_HOL_DAYS_L = { type : "string" };
	matrixModelArr.ROUTE_HOL_DAYS_Z = { type : "string" };
	matrixModelArr.TOTAL_WGT = { type : "number" };
	matrixModelArr.TOTAL_PCS = { type : "number" };
	matrixModelArr.TOTAL_CU = { type : "number" };
	matrixModelArr.TOTAL_WGT_PER = { type : "number" };
	matrixModelArr.TOTAL_CU_PER = { type : "number" };
	matrixModelArr.AVAIL_WGT = { type : "number" };
	matrixModelArr.AVAIL_CU = { type : "number" };
	matrixModelArr.LEG_TYPE = { type : "string" };
	matrixModelArr.BI_DAY_L = { type : "number" };
	matrixModelArr.BI_DAY_Z = { type : "number" };
	matrixModelArr.MAX_PAYLOAD_WT = { type : "number" };
	matrixModelArr.MAX_PAYLOAD_CU = { type : "number" };
	matrixModelArr.EXCESS_WEIGHT = { type : "number" };
	matrixModelArr.EXCESS_CUBE = { type : "number" };
		
	return addProductGroupsSchema(matrixModelArr, true, true);
}

/**
* Volume utilization Matrix columns
* Method to get Volume utilization Matrix columns
* @param favColumns - Columns which are stored as part of favorite.
*/
function getMatrixColumns(favColumns) {
	var matrixCols = [
	 {  // 1.Leg ID
		field: "LEG_ID",
		title: HEADER_S,
		//hidden: true,
		hidden: getPropertyValue(favColumns, "LEG_ID", "isVisible", true),
		width: 10,
		columnLockMode: "left",
		headerText: HEADER_S 
	},
	
	{   // 2.Mv No
		field: "MV_NUM",
		title: HEADER_ROUTE_NO,
		textAlign:"center",
		sortable: true,
	   // hidden: false,
		hidden: getPropertyValue(favColumns, "MV_NUM", "isVisible", false),
		width: 65,
		columnLockMode: "left",
		filterable:true,
		filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_STRING,
		headerText: HEADER_ROUTE_NO_TOOLTIP,
		footerLabel: "Leg Cnt: ",
		footerOperation: "count"
	},
	
	{   // 3. S
		field: "MV_NUM_SEQ",
		title: HEADER_S,
		textAlign:"center",
		width: 40,
		hidden: false,
		hidden: getPropertyValue(favColumns, "MV_NUM_SEQ", "isVisible", false),
	    sortable: true,
        columnLockMode: "left",
    	filterable:true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_STRING,
		headerText: HEADER_S_TOOLTIP
	},
	
	{   // 4. Eq
		field: "EQUIP_TYPE",
		title: HEADER_EQ,
		textAlign:"center",
		//hidden: false,
		hidden: getPropertyValue(favColumns, "EQUIP_TYPE", "isVisible", false),
	    sortable: true,
        columnLockMode: "left",
    	filterable:true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_STRING,
		width: 40,
		headerText: HEADER_EQ_TOOLTIP
	},
	
	{   // 5. IATA Desc
		field: "EQUIP_DESC",
		title: HEADER_EQ_DESC,
		textAlign:"center",
		//hidden: false,
		hidden: getPropertyValue(favColumns, "EQUIP_DESC", "isVisible", false),
		width: 55,
		columnLockMode: "left",
		filterable:true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_STRING,
        headerText: HEADER_EQ_DESC_TOOLTIP
	},
	
	{   // 6. M(L)(Monday)
		field: "EFFDAYSL_D1",
		//hidden: true,
		hidden: getPropertyValue(favColumns, "EFFDAYSL_D1", "isVisible", true),
		title: getEffDaysConfiguration()[0]+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_LEG_EFF_DAYS_L_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
  	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSL_D", "LEG_HOL_DAYS_L", 1);
      	}
	}, 
	{   // 7. T(L)Tuesday
		field: "EFFDAYSL_D2",
		//hidden: true,
		hidden: getPropertyValue(favColumns, "EFFDAYSL_D2", "isVisible", true),
		title: getEffDaysConfiguration()[1]+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_LEG_EFF_DAYS_L_TOOLTIP,
          cellBackgroundColorFunction: function(cell) {
  	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSL_D", "LEG_HOL_DAYS_L", 2);
      	}

	},
	
	{   // 8. W(L)Wednesday
		field: "EFFDAYSL_D3",
		//hidden: true,
		hidden: getPropertyValue(favColumns, "EFFDAYSL_D3", "isVisible", true),
		title: getEffDaysConfiguration()[2]+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_LEG_EFF_DAYS_L_TOOLTIP,
          cellBackgroundColorFunction: function(cell) {
  	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSL_D", "LEG_HOL_DAYS_L", 3);
      	}
	}, 
	
	{  // 9. T(L)Thursday
		field: "EFFDAYSL_D4",
		//hidden: true,
		hidden: getPropertyValue(favColumns, "EFFDAYSL_D4", "isVisible", true),
		title: getEffDaysConfiguration()[3]+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_LEG_EFF_DAYS_L_TOOLTIP,
          cellBackgroundColorFunction: function(cell) {
  	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSL_D", "LEG_HOL_DAYS_L", 4);
      	}
	},
	
	{   // 10. F(L)Friday
		field: "EFFDAYSL_D5",
		//hidden: true,
		hidden: getPropertyValue(favColumns, "EFFDAYSL_D5", "isVisible", true),
		title: getEffDaysConfiguration()[4]+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_LEG_EFF_DAYS_L_TOOLTIP,
          cellBackgroundColorFunction: function(cell) {
  	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSL_D", "LEG_HOL_DAYS_L", 5);
      	}
	},
	
	{   // 11. S(L)Saturday
		field: "EFFDAYSL_D6",
		//hidden: true,
		hidden: getPropertyValue(favColumns, "EFFDAYSL_D6", "isVisible", true),
		title: getEffDaysConfiguration()[5]+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_LEG_EFF_DAYS_L_TOOLTIP,
          cellBackgroundColorFunction: function(cell) {
  	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSL_D", "LEG_HOL_DAYS_L", 6);
      	}
	}, 
	
	{   // 12. S(L)Sunday
		field: "EFFDAYSL_D7",
		//hidden: true,
		hidden: getPropertyValue(favColumns, "EFFDAYSL_D7", "isVisible", true),
		title: getEffDaysConfiguration()[6]+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_LEG_EFF_DAYS_L_TOOLTIP,
          cellBackgroundColorFunction: function(cell) {
  	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSL_D", "LEG_HOL_DAYS_L", 7);
      	}
	},
	
	{   //13. W1(L)
		field: "EFFWEEKSL_W1",
		//hidden: true,
		hidden: getPropertyValue(favColumns, "EFFWEEKSL_W1", "isVisible", true),
		title: HEADER_W1+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		filterable:true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_STRING,
		headerText: HEADER_LEG_EFF_WEEKS_L_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "EFFWEEKSL_W", 1);
		}
 	}, 
 	
 	{   // 14.  W2(L)
		field: "EFFWEEKSL_W2",
		//hidden: true,
		hidden: getPropertyValue(favColumns, "EFFWEEKSL_W2", "isVisible", true),
		title: HEADER_W2+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_LEG_EFF_WEEKS_L_TOOLTIP ,
        cellBackgroundColorFunction: function(cell) {
			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "EFFWEEKSL_W", 2);
		}

	}, 
	
	{   // 15. W3(L)      
		field: "EFFWEEKSL_W3",
		//hidden: true,
		hidden: getPropertyValue(favColumns, "EFFWEEKSL_W3", "isVisible", true),
		title: HEADER_W3+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_LEG_EFF_WEEKS_L_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "EFFWEEKSL_W", 3);
		}
	}, 
	
	{	// 16.  W4(L) 
		field: "EFFWEEKSL_W4",
		//hidden: true,
		hidden: getPropertyValue(favColumns, "EFFWEEKSL_W4", "isVisible", true),
		title: HEADER_W4+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_LEG_EFF_WEEKS_L_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "EFFWEEKSL_W", 4);
		}
      	 
	},
	
	{  // 17.  W5(L) 
		field: "EFFWEEKSL_W5",
		//hidden: true,
		hidden: getPropertyValue(favColumns, "EFFWEEKSL_W5", "isVisible", true),
		title: HEADER_W5+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_LEG_EFF_WEEKS_L_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "EFFWEEKSL_W", 5);
		}
	},
	
	{  // 18.  W6(L) 
		field: "EFFDAYSL",
		title: HEADER_LEG_EFF_DAYS_L,
		textAlign:"center",
		width: 40,
		//hidden: true,
		hidden: getPropertyValue(favColumns, "EFFDAYSL", "isVisible", true),
		headerText: HEADER_LEG_EFF_DAYS_L_TOOLTIP
	}, 
	
	{  // 19.
		field: "KEYWORD_EFFDT_L",
		title: HEADER_LEG_KEY_EFF_DAYS_L,
		//hidden:!isLocalTimeFlag(),
		hidden: getPropertyValue(favColumns, "KEYWORD_EFFDT_L", "isVisible", !isLocalTimeFlag()),
		textAlign:"left",
		width: 175,
		headerText: HEADER_LEG_KEY_EFF_DAYS_L_TOOLTIP
	}, 
	
	{   // 20. No Of Op Days
		field: "NO OP_DAYS_L",
		title: HEADER_NO_OPS_L,
		//hidden:!isLocalTimeFlag(),
		hidden: getPropertyValue(favColumns, "NO OP_DAYS_L", "isVisible",!isLocalTimeFlag()),
		textAlign:"center",
		width: 65,
		headerText: HEADER_NO_OPS_TOOLTIP,
      	template: function(dataItem) { 
				var onOpStr = getNoOpString(dataItem.NOOP_DAYS_L);
				return onOpStr;
			}  
	},
	
	{   // 21. Calendar
		field: "CAL_BUTTON_L",
		title: "&nbsp;",
		excludeFromExport: true,
		//hidden:!isLocalTimeFlag(),
		hidden: getPropertyValue(favColumns, "CAL_BUTTON_L", "isVisible", !isLocalTimeFlag()),
		width: 45,
		sortable:false,
		filterable: false,
		headerText: HEADER_LEG_CAL_L_TOOLTIP,
		filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_NONE,
        labelFunction: calLabelFunction
   
	},
	
	{
		// 22. M(L)
		field: "RTEEFFDAYSL_D1",
		title: getEffDaysConfiguration()[0]+HEADER_LOCAL_SUFFIX,
		//hidden: true,
		hidden: getPropertyValue(favColumns, "RTEEFFDAYSL_D1", "isVisible", true),
		textAlign:"center",
		width: 40,
		headerText: HEADER_ROUTE_EFF_DAYS_L_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "RTEEFFDAYSL_D", "ROUTE_HOL_DAYS_L", 1);
    	}
	}, 
	
	{   // 23. T(L)
		field: "RTEEFFDAYSL_D2",
		//hidden: true,
		hidden: getPropertyValue(favColumns, "RTEEFFDAYSL_D2", "isVisible", true),
		title: getEffDaysConfiguration()[1]+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_ROUTE_EFF_DAYS_L_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "RTEEFFDAYSL_D", "ROUTE_HOL_DAYS_L", 2);
    	}
	},
	
	{    // 24. W(L)
		field: "RTEEFFDAYSL_D3",
		//hidden: true,
		hidden: getPropertyValue(favColumns, "RTEEFFDAYSL_D3", "isVisible", true),
		title: getEffDaysConfiguration()[2]+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_ROUTE_EFF_DAYS_L_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "RTEEFFDAYSL_D", "ROUTE_HOL_DAYS_L", 3);
    	}
	},
	
	{    // 25. T(L)
		field: "RTEEFFDAYSL_D4",
		title: getEffDaysConfiguration()[3]+HEADER_LOCAL_SUFFIX,
		//hidden: true,
		hidden: getPropertyValue(favColumns, "RTEEFFDAYSL_D4", "isVisible", true),
		textAlign:"center",
		width: 40,
		headerText: HEADER_ROUTE_EFF_DAYS_L_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "RTEEFFDAYSL_D", "ROUTE_HOL_DAYS_L", 4);
    	}
	},
	
	{   // 26. F(L)
		field: "RTEEFFDAYSL_D5",
		title: getEffDaysConfiguration()[4]+HEADER_LOCAL_SUFFIX,
		//hidden: true,
		hidden: getPropertyValue(favColumns, "RTEEFFDAYSL_D5", "isVisible", true),
		textAlign:"center",
		width: 40,
		headerText: HEADER_ROUTE_EFF_DAYS_L_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "RTEEFFDAYSL_D", "ROUTE_HOL_DAYS_L", 5);
    	}
	},
	
	{   // 27. F(L)
		field: "RTEEFFDAYSL_D6",
		title: getEffDaysConfiguration()[5]+HEADER_LOCAL_SUFFIX,
		//hidden: true,
		hidden: getPropertyValue(favColumns, "RTEEFFDAYSL_D6", "isVisible", true),
		textAlign:"center",
		width: 40,
		headerText: HEADER_ROUTE_EFF_DAYS_L_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "RTEEFFDAYSL_D", "ROUTE_HOL_DAYS_L", 6);
    	}
	}, 
	
	{   // 28. F(L)
		field: "RTEEFFDAYSL_D7",
		title: getEffDaysConfiguration()[6]+HEADER_LOCAL_SUFFIX,
		//hidden: true,
		hidden: getPropertyValue(favColumns, "RTEEFFDAYSL_D7", "isVisible", true),
		textAlign:"center",
		width: 40,
		headerText: HEADER_ROUTE_EFF_DAYS_L_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "RTEEFFDAYSL_D", "ROUTE_HOL_DAYS_L", 7);
    	}
	},
	
	{   // 29. W1(L)
		field: "RTEEFFWEEKSL_W1",
		title: HEADER_W1+HEADER_LOCAL_SUFFIX,
		//hidden: true,
		hidden: getPropertyValue(favColumns, "RTEEFFWEEKSL_W1", "isVisible", true),
		textAlign:"center",
		width: 40,
		headerText: HEADER_ROUTE_EFF_WEEKS_L_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "RTEEFFWEEKSL_W", 1);
		}
	}, 
	
	{   // 30. W2(L)
		field: "RTEEFFWEEKSL_W2",
		title: HEADER_W2+HEADER_LOCAL_SUFFIX,
		//hidden: true,
		hidden: getPropertyValue(favColumns, "RTEEFFWEEKSL_W2", "isVisible", true),
		textAlign:"center",
		width: 40,
		headerText: HEADER_ROUTE_EFF_WEEKS_L_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "RTEEFFWEEKSL_W", 2);
		}
	}, 
	
	{
		// 31. W3(L)
		field: "RTEEFFWEEKSL_W3",
		//hidden: true,
		hidden: getPropertyValue(favColumns, "RTEEFFWEEKSL_W3", "isVisible", true),
		title: HEADER_W3+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_ROUTE_EFF_WEEKS_L_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "RTEEFFWEEKSL_W", 3);
		}
	}, 
	
	{
		// 33. W4(L)
		field: "RTEEFFWEEKSL_W4",
		//hidden: true,
		hidden: getPropertyValue(favColumns, "RTEEFFWEEKSL_W4", "isVisible", true),
		title: HEADER_W4+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_ROUTE_EFF_WEEKS_L_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "RTEEFFWEEKSL_W", 4);
		}
	}, 
	
	{   // 34. W5(L)
		field: "RTEEFFWEEKSL_W5",
		//hidden: true,
		hidden: getPropertyValue(favColumns, "RTEEFFWEEKSL_W5", "isVisible", true),
		title: HEADER_W5+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_ROUTE_EFF_WEEKS_L_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "RTEEFFWEEKSL_W", 5);
		}
	},
	
	{
		// 35. ROUTE Effective Days
		field: "RTEEFFDAYSL",
		//hidden: true,
		hidden: getPropertyValue(favColumns, "RTEEFFDAYSL", "isVisible", true),
		title: HEADER_ROUTE_EFF_DAYS_L,
		textAlign:"center",
		width: 125,
		headerText: HEADER_ROUTE_EFF_DAYS_L_TOOLTIP
	},
	
	{   // 36. 
		field: "ROUTE_KEYWORD_EFFDT_L",
		title: HEADER_ROUTE_KEY_EFF_DAYS_L,
		//hidden:!isLocalTimeFlag(),
		hidden: getPropertyValue(favColumns, "ROUTE_KEYWORD_EFFDT_L", "isVisible", !isLocalTimeFlag()),
		textAlign:"left",
		width: 175,
		headerText: HEADER_ROUTE_KEY_EFF_DAYS_L_TOOLTIP
	},
	
	{   // 37.
		field: "CAL_BUTTON_ROUTE_L",
		title: "&nbsp;",
		//hidden:!isLocalTimeFlag(),
		//hidden: getPropertyValue(favColumns, "ROUTE_KEYWORD_EFFDT_L", "isVisible", !isLocalTimeFlag()),
		sortable:false,
		filterable: false,
		width: 55,
		headerText: HEADER_ROUTE_CAL_L_TOOLTIP,
		filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_NONE,
		labelFunction: calLabelFunction
	},
	
	{   // 38.
		field: "DAY",
		title: HEADER_VOL_DAY,
		textAlign:"center",
		width: 65,
		headerText: HEADER_VOL_DAY_TOOLTIP,
		isSortNumeric:true
	},
	
	{   // 39.
		field: "EFFDAYSZ_D1",
		title: getEffDaysConfiguration()[0]+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 45,
		hidden: true,
		hidden: getPropertyValue(favColumns, "EFFDAYSZ_D1", "isVisible", true),
		headerText: HEADER_LEG_EFF_DAYS_Z_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSZ_D", "LEG_HOL_DAYS_Z", 1);
    	}
	},
	
	{   // 40.
		field: "EFFDAYSZ_D2",
		title: getEffDaysConfiguration()[1]+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 40,
		hidden: true,
		hidden: getPropertyValue(favColumns, "EFFDAYSZ_D2", "isVisible", true),
		headerText: HEADER_LEG_EFF_DAYS_Z_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSZ_D", "LEG_HOL_DAYS_Z", 2);
    	}
	},
	
	{   // 41.
		field: "EFFDAYSZ_D3",
		title: getEffDaysConfiguration()[2]+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 45,
		hidden: true,
		hidden: getPropertyValue(favColumns, "EFFDAYSZ_D3", "isVisible", true),
		headerText: HEADER_LEG_EFF_DAYS_Z_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSZ_D", "LEG_HOL_DAYS_Z", 3);
    	}
	}, 
	
	{
	    // 42. T()
		field: "EFFDAYSZ_D4",
		hidden: true,
		title: getEffDaysConfiguration()[3]+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 45,
		headerText: HEADER_LEG_EFF_DAYS_Z_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSZ_D", "LEG_HOL_DAYS_Z", 4);
    	}
	}, 
	
	{   // 43. F(Z)
		field: "EFFDAYSZ_D5",
		hidden: true,
		title: getEffDaysConfiguration()[4]+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 45,
		headerText: HEADER_LEG_EFF_DAYS_Z_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSZ_D", "LEG_HOL_DAYS_Z", 5);
    	}
	},
	
	{
		// 44.S(Z)
		field: "EFFDAYSZ_D6",
		title: getEffDaysConfiguration()[5]+HEADER_ZULU_SUFFIX,
		hidden: true,
		textAlign:"center",
		width: 45,
		headerText: HEADER_LEG_EFF_DAYS_Z_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSZ_D", "LEG_HOL_DAYS_Z", 6);
    	}
	}, 
	{   // 45.
		hidden: true,
		field: "EFFDAYSZ_D7",
		title: getEffDaysConfiguration()[6]+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 45,
		headerText: HEADER_LEG_EFF_DAYS_Z_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSZ_D", "LEG_HOL_DAYS_Z", 7);
    	}
	}, 
	
	{   // 45.
		hidden: true,
		field: "EFFWEEKSZ_W1",
		title: HEADER_W1+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 45,
		headerText: HEADER_LEG_EFF_WEEKS_Z_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "EFFWEEKSZ_W", 1);
		}
	}, 
	
	{   // 46.
		hidden: true,
		field: "EFFWEEKSZ_W2",
		title: HEADER_W2+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 45,
		headerText: HEADER_LEG_EFF_WEEKS_Z_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "EFFWEEKSZ_W", 2);
		}
	},
	
	{   // 47.
		hidden: true,
		field: "EFFWEEKSZ_W3",
		title: HEADER_W3+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 45,
		headerText: HEADER_LEG_EFF_WEEKS_Z_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "EFFWEEKSZ_W", 3);
		}
	},
	
	{   // 48.
		hidden: true,
		field: "EFFWEEKSZ_W4",
		title: HEADER_W4+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 45,
		headerText: HEADER_LEG_EFF_WEEKS_Z_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "EFFWEEKSZ_W", 4);
		}
	},
	
	{   // 49.
		hidden: true,
		field: "EFFWEEKSZ_W5",
		title: HEADER_W5+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 45,
		headerText: HEADER_LEG_EFF_WEEKS_Z_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "EFFWEEKSZ_W", 5);
		}
	}, 
	
	{   // 50.
		hidden: true,
		field: "EFFDAYSZ",
		title: HEADER_LEG_EFF_DAYS_Z,
		textAlign:"center",
		width: 120,
		headerText: HEADER_LEG_EFF_WEEKS_Z_TOOLTIP,
      	template: function(dataItem) {
    			return parent.getEffDaysStringFromSystemSetting(dataItem, "EFFDAYSZ");
    		} 
	},
	
	{   // 51.
		field: "KEYWORD_EFFDT_Z",
		title: HEADER_LEG_KEY_EFF_DAYS_Z,
		textAlign:"left",
		width: 175,
		hidden:isLocalTimeFlag(),
		headerText: HEADER_LEG_KEY_EFF_DAYS_Z_TOOLTIP
	}, 
	
	{   // 52.
		field: "NOOP_DAYS_Z",
		title: HEADER_NO_OPS_Z,
		textAlign:"center",
		//hidden:!isLocalTimeFlag(),
		hidden: getPropertyValue(favColumns, "NO OP_DAYS_L", "isVisible", isLocalTimeFlag()),
		width: 60,
		headerText: HEADER_NO_OPS_TOOLTIP,
     	template: function(dataItem) {
				var onOpStr = getNoOpString(dataItem.NOOP_DAYS_Z);
				return onOpStr;
			}  
	}, 
	
	{   // 53.
		field: "CAL_BUTTON_Z",
		hidden:isLocalTimeFlag(),
		title: "&nbsp;",
		excludeFromExport: true,
		width: 45,
		sortable:false,
		filterable: false,
		headerText: HEADER_LEG_CAL_Z_TOOLTIP,
		filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_NONE,
		labelFunction: calLabelFunction
	},
	
	{   // 54.
		hidden: true,
		field: "RTEEFFDAYSZ_D1",
		title: getEffDaysConfiguration()[0]+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 45,
		headerText: HEADER_ROUTE_EFF_DAYS_Z_TOOLTIP,
          cellBackgroundColorFunction: function(cell) {
  	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "RTEEFFDAYSZ_D", "ROUTE_HOL_DAYS_Z", 1);
      	}
	}, 
	
	{   // 55.
		hidden: true,
		field: "RTEEFFDAYSZ_D2",
		title: getEffDaysConfiguration()[1]+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 45,
		headerText: HEADER_ROUTE_EFF_DAYS_Z_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "RTEEFFDAYSZ_D", "ROUTE_HOL_DAYS_Z", 2);
    	}
	},
	
	{   // 56.
		hidden: true,
		field: "RTEEFFDAYSZ_D3",
		title: getEffDaysConfiguration()[2]+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 45,
		headerText: HEADER_ROUTE_EFF_DAYS_Z_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "RTEEFFDAYSZ_D", "ROUTE_HOL_DAYS_Z", 3);
    	}
	}, 
	
	{  // 57.
		hidden: true,
		field: "RTEEFFDAYSZ_D4",
		title: getEffDaysConfiguration()[3]+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 45,
		headerText: HEADER_ROUTE_EFF_DAYS_Z_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "RTEEFFDAYSZ_D", "ROUTE_HOL_DAYS_Z", 4);
    	}
	},
	
	{  // 58.
		hidden: true,
		field: "RTEEFFDAYSZ_D5",
		title: getEffDaysConfiguration()[4]+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 45,
		headerText: HEADER_ROUTE_EFF_DAYS_Z_TOOLTIP,
          cellBackgroundColorFunction: function(cell) {
  	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "RTEEFFDAYSZ_D", "ROUTE_HOL_DAYS_Z", 5);
      	}
	},
	
	{    // 59.
		hidden: true,
		field: "RTEEFFDAYSZ_D6",
		title: getEffDaysConfiguration()[5]+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 45,
		headerText: HEADER_ROUTE_EFF_DAYS_Z_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "RTEEFFDAYSZ_D", "ROUTE_HOL_DAYS_Z", 6);
    	}
	}, 

	{    // 60.
		hidden: true,
		field: "RTEEFFDAYSZ_D7",
		title: getEffDaysConfiguration()[6]+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 45,
		headerText: HEADER_ROUTE_EFF_DAYS_Z_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "RTEEFFDAYSZ_D", "ROUTE_HOL_DAYS_Z", 7);
    	}
	}, 
	{   // 61.
		hidden: true,
		field: "RTEEFFWEEKSZ_W1",
		title: HEADER_W1+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 45,
		headerText: HEADER_ROUTE_EFF_WEEKS_Z_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "RTEEFFWEEKSZ_W", 1);
		}
	},
	
	{   // 62.
		hidden: true,
		field: "RTEEFFWEEKSZ_W2",
		title: HEADER_W2+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 45,
		headerText: HEADER_ROUTE_EFF_WEEKS_Z_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "RTEEFFWEEKSZ_W", 2);
		}
	},
	
	{
		// 63.
		field: "RTEEFFWEEKSZ_W3",
		title: HEADER_W3+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 45,
		hidden: true,
		headerText: HEADER_ROUTE_EFF_WEEKS_Z_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "RTEEFFWEEKSZ_W", 3);
		}
	},
	
	{   // 64.
		hidden: true,
		field: "RTEEFFWEEKSZ_W4",
		title: HEADER_W4+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 45,
		headerText: HEADER_ROUTE_EFF_WEEKS_Z_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "RTEEFFWEEKSZ_W", 4);
		}
	},
	
	{   // 65.
		hidden: true,
		field: "RTEEFFWEEKSZ_W5",
		title: HEADER_W5+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 45,
		headerText: HEADER_ROUTE_EFF_WEEKS_Z_TOOLTIP,
        cellBackgroundColorFunction: function(cell) {
			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "RTEEFFWEEKSZ_W", 5);
		}
	},
	
	{   // 66.
		hidden: true,
		field: "RTEEFFDAYSZ",
		title: HEADER_ROUTE_EFF_DAYS_Z,
		textAlign:"center",
		width: 120,
		headerText: HEADER_ROUTE_EFF_DAYS_Z_TOOLTIP,
       template: function(dataItem) {	return parent.getEffDaysStringFromSystemSetting(dataItem, "RTEEFFDAYSZ"); }
	}, 
	
	{   // 67.
		hidden:isLocalTimeFlag(),
		field: "ROUTE_KEYWORD_EFFDT_Z",
		title: HEADER_ROUTE_KEY_EFF_DAYS_Z,
		textAlign:"left",
		width: 175,
		headerText: HEADER_ROUTE_KEY_EFF_DAYS_Z_TOOLTIP
	},
	
	{   // 68.
		hidden:isLocalTimeFlag(),
		field: "CAL_BUTTON_ROUTE_Z",
		title: "&nbsp;",
		width: 45,
		sortable:false,
		filterable: false,
		headerText: HEADER_ROUTE_CAL_Z_TOOLTIP,
		filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_NONE,
		labelFunction: calLabelFunction

	},
	{   // 81.Vol Day
		hidden:isLocalTimeFlag(),
		field: "DAYZ",
		title: HEADER_VOL_DAY,
		textAlign:"center",
		width: 60,
		headerText: HEADER_VOL_DAY_TOOLTIP,
		isSortNumeric:true
	},
	{   // 69.
		hidden:true,
		field: "LEG_HOL_DAYS_L",
		title: HEADER_RTE_HOL_DAYS_L,
		textAlign:"center",
		width: 65,
		headerText: HEADER_RTE_HOL_DAYS_L_TOOLTIP
	},
	
	{  // 70.
	
		field: "LEG_HOL_DAYS_Z",
		title: HEADER_RTE_HOL_DAYS_Z,
		textAlign:"center",
		width: 60,
		hidden: getPropertyValue(favColumns, "LEG_HOL_DAYS_Z", "isVisible", true),
		headerText: HEADER_RTE_HOL_DAYS_Z_TOOLTIP 
	},
	
	{  // 71.
		//hidden:true,
		field: "ROUTE_NOOP_DAYS_L",
		title: HEADER_NO_OPS_L,
		textAlign:"center",
		hidden: getPropertyValue(favColumns, "ROUTE_NOOP_DAYS_L", "isVisible", true),
		//template: volumeUtilizationTreeGridMatrixConstants.calenderRowTemplateL,
		width: 60,
		headerText: HEADER_NO_OPS_TOOLTIP,
      	template: function(dataItem) {
				var noopStr = getNoOpString(dataItem.ROUTE_NOOP_DAYS_L);
					return noopStr;
			}	  
	},
	
	{   // 72.
		field: "ROUTE_NOOP_DAYS_Z",
		title: HEADER_NO_OPS_Z,
		hidden:true,
		textAlign:"center",
		//template: volumeUtilizationTreeGridMatrixConstants.calenderRowTemplateZ,
		width: 60,
		headerText: HEADER_NO_OPS_TOOLTIP,
        template: function(dataItem) {
				var onOpStr = getNoOpString(dataItem.ROUTE_NOOP_DAYS_Z); 
				return onOpStr;
			}
	}, 
	{   // 73.
		field: "ROUTE_HOL_DAYS_L",
		hidden:true,
		title: HEADER_RTE_HOL_DAYS_L,
		textAlign:"center",
		width: 65,
		headerText: HEADER_RTE_HOL_DAYS_L_TOOLTIP
	},
	
	{   // 74.

		field: "ROUTE_HOL_DAYS_Z",
		title: HEADER_RTE_HOL_DAYS_Z,
		hidden: getPropertyValue(favColumns, "LEG_HOL_DAYS_Z", "isVisible", true),
		textAlign:"center",
		width: 60,
		headerText: HEADER_RTE_HOL_DAYS_Z_TOOLTIP
	}, 
	
	{   // 75. ORIGIN
		field: "ORIGIN",
		title: HEADER_SCHEDULE_ORG,
		hidden:false,
		textAlign:"center",
		width: 60,
		headerText: HEADER_SCHEDULE_ORG_TOOLTIP
	},
	
	{   // 76. Dest
		field: "DESTINATION",
		title: HEADER_SCHEDULE_DEST,
		hidden:false,
		textAlign:"center",
		width: 60,
		headerText: HEADER_SCHEDULE_DEST_TOOLTIP
	},
	
	{
		// 77.
		field: "BO_TIME_L",
		title: HEADER_LOCAL_DEP,
		hidden:!isLocalTimeFlag(),
		hidden:false,
		textAlign:"center",
		width: 60,
		filterable: true,
		filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_TIME,
		headerText: HEADER_LOCAL_DEP_SCH_TOOLTIP
	},
	
	{   // 78.
		field: "BO_TIME_Z",
		title: HEADER_ZULU_DEP,
		hidden:isLocalTimeFlag(),
		textAlign:"center",
		width: 60,
		filterable: true,
		filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_TIME,
		headerText: HEADER_ZULU_DEP_TOOLTIP
	},
	{   // 79. Arriv Day(L)
		hidden:!isLocalTimeFlag(),
		field: "BI_TIME_L",
		title: HEADER_LOCAL_ARR,
		textAlign:"center",
		width: 60,
		filterable: true,
		filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_TIME,
		headerText: HEADER_ZULU_ARR_SCH_TOOLTIP
	},
	
	{   //80.
		field: "BI_TIME_Z",
		title: HEADER_ZULU_ARR,
		hidden:isLocalTimeFlag(),
		textAlign:"center",
		width: 60,
		filterable: true,
		filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_TIME,
		headerText: HEADER_ZULU_ARR_TOOLTIP
	},
	{   // 82. Ttl Wgt
		field: "TOTAL_WGT",
		title: HEADER_WGT_TOTAL,
		width: 70,
		hidden:false,
	    filterable: true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_NUMBER,
		aggregates: ["sum"],
		headerText: HEADER_WGT_TOTAL_TOOLTIP,
		labelFunction: flexiciousNmsp.UIUtils.dataGridFormatCurrencyLabelFunction,
		footerFormatter: flexiciousNmsp.NumberFormatter,
		footerOperation:"sum",
      	footerAlign:"right",
      	textAlign:"right",
      	isSortNumeric:true,
      	footerOperationPrecision:"0"
	},
	{   // 83. Ttl Pcs
		field: "TOTAL_PCS",
		title: HEADER_PCS_TOTAL,
		width: 70,
		hidden:false,
	    filterable: true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_NUMBER,
		aggregates: ["sum"],
		headerText: HEADER_PCS_TOTAL_TOOLTIP,
		labelFunction: flexiciousNmsp.UIUtils.dataGridFormatCurrencyLabelFunction,
		footerFormatter: flexiciousNmsp.NumberFormatter,
		footerOperation:"sum",
      	footerAlign:"right",
      	textAlign:"right",
      	isSortNumeric:true,
      	footerOperationPrecision:"0"
	},
	{   // 84. Ttl Cu
		field: "TOTAL_CU",
		title: HEADER_CB_TOTAL,
	    filterable: true,
	    hidden:false,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_NUMBER,
		width: 70,
		aggregates: ["sum"],
		headerText: HEADER_CB_TOTAL_TOOLTIP,
		labelFunction: flexiciousNmsp.UIUtils.dataGridFormatCurrencyLabelFunction,
		footerFormatter: flexiciousNmsp.NumberFormatter,
		footerOperation:"sum",
      	footerAlign:"right",
      	textAlign:"right",
      	isSortNumeric:true,
      	footerOperationPrecision:"0"
	}];
	
	matrixCols = addProductGroupsColumns(matrixCols, true, undefined, true);
	
	matrixCols = matrixCols.concat([ 
	{   // 85.Ttl Wt %
		field: "TOTAL_WGT_PER",
		title: HEADER_WGT_TOTAL_PER,
		hidden:false,
	    filterable: true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_NUMBER,
		width: 70,
		headerText: HEADER_WGT_TOTAL_PER_TOOLTIP,
		labelFunction: function(dataItem, column) {
        	var perValue = dataItem.TOTAL_WGT_PER;
        	return Math.round(perValue)+ "%";
        },
		footerOperation:"average",
      	footerAlign:"right",
      	textAlign:"right",
      	isSortNumeric:true,
      	footerOperationPrecision:"0"
	},
	{   // 90. Ttl Cu %
		field: "TOTAL_CU_PER",
		title: HEADER_CU_TOTAL_PER,
		hidden:false,
	    filterable: true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_NUMBER,
		width: 70,
		headerText: HEADER_CU_TOTAL_PER_TOOLTIP,
		labelFunction: function(dataItem, column) {
        	var perValue = dataItem.TOTAL_CU_PER;
        	return Math.round(perValue)+ "%";
        },
		footerOperation:"average",
      	footerAlign:"right",
      	textAlign:"right",
      	isSortNumeric:true,
      	footerOperationPrecision:"0"
	},
	{   // 91. Avail Wgt
		field: "AVAIL_WGT",
		title: HEADER_WGT_AVAIL,
		hidden:false,
	    filterable: true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_NUMBER,
		width: 70,
		aggregates: ["sum"],
		headerText: HEADER_WGT_AVAIL_TOOLTIP,
		labelFunction: flexiciousNmsp.UIUtils.dataGridFormatCurrencyLabelFunction,
		footerFormatter: flexiciousNmsp.NumberFormatter,
		footerOperation:"sum",
      	footerAlign:"right",
      	textAlign:"right",
      	isSortNumeric:true,
      	footerOperationPrecision:"0"
	},
	{   // 92 Avail CU
		field: "AVAIL_CU",
		title: HEADER_CU_AVAIL,
	    filterable: true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_NUMBER,
		width: 70,
		aggregates: ["sum"],
		headerText: HEADER_CU_AVAIL_TOOLTIP,
		labelFunction: flexiciousNmsp.UIUtils.dataGridFormatCurrencyLabelFunction,
		footerFormatter: flexiciousNmsp.NumberFormatter,
		footerOperation:"sum",
      	footerAlign:"right",
      	textAlign:"right",
      	isSortNumeric:true,
      	footerOperationPrecision:"0"
	},
	{   // 93. Excess Wt
		field: "EXCESS_WEIGHT",
		title: HEADER_WGT_EX,
		width: 70,
		aggregates: ["sum"],
	    filterable: true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_NUMBER,
		headerText: HEADER_WGT_EX_VOL_TOOLTIP,
		labelFunction: flexiciousNmsp.UIUtils.dataGridFormatCurrencyLabelFunction,
		footerFormatter: flexiciousNmsp.NumberFormatter,
		footerOperation:"sum",
      	footerAlign:"right",
      	textAlign:"right",
      	isSortNumeric:true,
      	footerOperationPrecision:"0"
	},
	
	{   // 94. Excess Cu
		field: "EXCESS_CUBE",
		title: HEADER_CB_EX,
		hidden:false,
	    filterable: true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_NUMBER,
		width: 70,
		aggregates: ["sum"],
		headerText: HEADER_CB_EX_VOL_TOOLTIP,
		labelFunction: flexiciousNmsp.UIUtils.dataGridFormatCurrencyLabelFunction,
		footerFormatter: flexiciousNmsp.NumberFormatter,
		footerOperation:"sum",
      	footerAlign:"right",
      	textAlign:"right",
      	isSortNumeric:true,
      	footerOperationPrecision:"0"
	},
	
	{   // 95. Max Pld Wt
		field: "MAX_PAYLOAD_WT",
		title: HEADER_MAX_PAY_WT,
		width: 70,
		hidden:false,
		aggregates: ["sum"],
	    filterable: true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_NUMBER,
		headerText: HEADER_MAX_PAY_WT_TOOLTIP,
		labelFunction: flexiciousNmsp.UIUtils.dataGridFormatCurrencyLabelFunction,
		footerFormatter: flexiciousNmsp.NumberFormatter,
		footerOperation:"sum",
      	footerAlign:"right",
      	textAlign:"right",
      	isSortNumeric:true,
      	footerOperationPrecision:"0"
	},
	
	{   // 96. Max Pld Cu
		field: "MAX_PAYLOAD_CU",
		title: HEADER_MAX_PAY_CU,
		hidden:false,
		width: 70,
		aggregates: ["sum"],
	    filterable: true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_NUMBER,
		headerText: HEADER_MAX_PAY_CU_TOOLTIP,
		labelFunction: flexiciousNmsp.UIUtils.dataGridFormatCurrencyLabelFunction,
		footerFormatter: flexiciousNmsp.NumberFormatter,
		footerOperation:"sum",
      	footerAlign:"right",
      	textAlign:"right",
      	isSortNumeric:true,
      	footerOperationPrecision:"0"
	},
	
	{   // 97. T
		field: "LEG_TYPE",
		title: HEADER_LEG_TYPE,
		textAlign:"center",
		width: 30,
		headerText: HEADER_LEG_TYPE_TOOLTIP
	},
	
	{   // 98. Arriv Day(L)
		field: "BI_DAY_L",
		title: HEADER_ADY_L,
		hidden:false,
	    filterable: true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_NUMBER,
		textAlign:"center",
		width: 50,
		headerText: HEADER_ADY_L_TOOLTIP
	},
	
	{   // 99. Arriv Day(Z)
		field: "BI_DAY_Z",
		title: HEADER_ADY_Z,
		hidden:true,
	    filterable: true,
        filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_NUMBER,
		textAlign:"center",
		width: 50,
		headerText: HEADER_ADY_Z_TOOLTIP
	}]);
	
	matrixCols.push(getNestedColumnDtls());
	
	return matrixCols;
}

function getNestedColumnDtls() {
	return  { 
		type: "nextlevel",
		parentChildrenField: "children",
		childrenField: undefined,
		currentLevelParentFiled: undefined,  
		selectedKeyField: undefined,
		nestIndent:undefined,
		isReusePreviousLevelColumns: undefined,
		parentItemLoadMode: "server",
		currentLevelItemLoadMode: "server",
		itemLoadHandler:itemLoadHandler,
		enableFooters:true,
		columns:getIBOBMatrixColumns("IBOBMatrix"),
		//parentChildrenCountField: "CHILD_COUNT",
		currentChildrenCountField: "CHILD_COUNT"
	};
}

function itemLoadHandler(gridEvent){
	gridEvent.filter.parentObject["children"]= [];	
	getChildData(gridEvent.filter.parentObject,gridEvent);
}

function getChildData(selectedItem, gridEvent){
	if(selectedItem != undefined){
		var paramsMap = {
				"commonCaseId":parent.getCommonCaseId(),
				"scheduleId":parent.getScheduleId(),
				"legId":selectedItem["LEG_ID"],
				"effDayPatternStr": parent.getSelectedEffDayStrPattern(),
				"timeReference":"L",
				"legDay":selectedItem["DAY"],
				"wtConversionFactor" : isWeightInKgsFlag() ? POUND_TO_KG_VALUE : 1,
				"prodGrps":getProdGroupConfiguration()
			};
		var params = {};
	    params["paramsMap"] = paramsMap;
	    params["url"] = getVolumeIBOBMatrixUrl();
	    params["successCallback"] = function(response, io){
	    	onLoadChildDataSuccess(response, io, gridEvent);
	    };
	    params["failureCallback"] = onServiceRequestFailure;
	    params["showProgressWindow"] = false;    
	    callService(params);
	}
}

function onLoadChildDataSuccess(response, io, gridEvent){
	if(response!= undefined){
		updateResponseHandler(response);
		gridEvent.target["wrapper"].createDataGridLevel(getNestedColumnDtls(), gridEvent.filter.level);
		gridEvent.target["wrapper"].rebuild();
		gridEvent.target.setChildData(gridEvent.filter.parentObject,response,gridEvent.filter.level.getParentLevel(),3);
	}else {
		gridEvent.target.setChildData(gridEvent.filter.parentObject,[],gridEvent.filter.level.getParentLevel(),3);
	}
}

/**
* Volume utilization Aggregate columns method
* Method to set Aggregate columns in location allocation matrix.
*/
function getAggregateColumnsSettings(){
	var map = new Object(); 
	map["All_Weight_Columns"] = ["TOTAL_WGT","TOTAL_WGT_PER", "AVAIL_WGT","EXCESS_WEIGHT","MAX_PAYLOAD_WT"];
	map["All_Cube_Columns"] = ["TOTAL_CU","TOTAL_CU_PER","AVAIL_CU","EXCESS_CUBE","MAX_PAYLOAD_CU"];
	map["All_Pieces_Columns"] = ["TOTAL_PCS"];
	return map; //addProductGroupsAggregateColumnSettings(map, true);
}

/**
* Volume utilization Timezone method
* Method to set Timezone columns.
*/
function getTimeZoneColumnsSettings(){
	var map = new Object(); 
	if(isFiveWeekPlan()){
		map["All_Local_Columns"] =$.merge($.merge($.merge([],getLocalColumns()),commonMatrixConstants.WEEK_COLUMNS_L),commonMatrixConstants.ROUTE_WEEK_COLUMNS_L);
		map["All_Zulu_Columns"] = $.merge($.merge($.merge([],getZuluColumns()),commonMatrixConstants.WEEK_COLUMNS_Z),commonMatrixConstants.ROUTE_WEEK_COLUMNS_Z);
	}else{
		map["All_Local_Columns"] =getLocalColumns();
		map["All_Zulu_Columns"] = getZuluColumns();
	}
	showLocalOrZuluMatrixColumns("volumeUtilizationTreeGridMatrixContainer", map["All_Local_Columns"], map["All_Zulu_Columns"], isLocalTimeFlag());
	return map;
}

/**
* Volume utilization Reserved columns visibility method
* Method to set columns visibility in matrix.
*/
function getReservedColumnsVisiblity(){
	var map = new Object(); 
	if (isLocalTimeFlag()) {
		map["All_Zulu_Columns"] = false;
	} else {
		map["All_Local_Columns"] = false;
	}
	return map;
}

/**
* Volume utilization columns visibility method
* Method to set columns visibility in Display options.
*/
function getColumnsToHideInSettings(){
	var colToHide=["CAL_BUTTON_L","CAL_BUTTON_Z","LEG_ID", "LEG_HOL_DAYS_L", "LEG_HOL_DAYS_Z", "CAL_BUTTON_ROUTE_L","CAL_BUTTON_ROUTE_Z","ROUTE_NOOP_DAYS_L","ROUTE_NOOP_DAYS_Z","ROUTE_HOL_DAYS_L","ROUTE_HOL_DAYS_Z"];
	if(!isFiveWeekPlan()){
		$.merge(colToHide,commonMatrixConstants.WEEK_COLUMNS_L);
		$.merge(colToHide,commonMatrixConstants.WEEK_COLUMNS_Z);
		$.merge(colToHide,commonMatrixConstants.ROUTE_WEEK_COLUMNS_L);
		$.merge(colToHide,commonMatrixConstants.ROUTE_WEEK_COLUMNS_Z);
	}
	return colToHide;
}
function setSearchCriteria() {
	if(searchCriteria) {
		searchCriteria.setCriteria(CRITERIA_IS_NW_RELATED, isNetworkScheduleFlag);
	}
}

/**
* Volume utilization columns IBOB matrix event
* Event to configure IBOB matrix. This will be called on expanding the row in Volume utilization matrix.
*/
function detailInit(e) {
	var paramsMap = {
			"commonCaseId":parent.getCommonCaseId(),
			"scheduleId":parent.getScheduleId(),
			"legId":e.data.LEG_ID,
			"timeReference":"L",
			"legDay":e.data.DAY,
			"effDayPatternStr": parent.getSelectedEffDayStrPattern(),
			"wtConversionFactor" : isWeightInKgsFlag() ? POUND_TO_KG_VALUE : 1,
			"prodGrps":getProdGroupConfiguration()
			};
	var id = "IBOBMatrix" + e.detailRow.index();
	$("<div id='" + id + "'/>").appendTo(e.detailCell).kendoGrid({
        dataSource: {
    	dataType: "json",
    	contentType: "application/json",
    	data: paramsMap,
            transport: {
                read: getVolumeIBOBMatrixUrl(),
                parameterMap: function (data, operation) {
                    return paramsMap;
                }
            },
            schema: {
                model: {
                	fields: getIBOBMatrixSchema()                    
                }
            },
            serverPaging: false,
            serverSorting: true,
            serverFiltering: true
        },
        scrollable: false,
        sortable: true,
        pageable: false,
        columns: getIBOBMatrixColumns(id)
    });
	// Pushing ibob windows id in ibobOpenMatrixIds array so that same configurations can be applied on all the open ibob matrix.
	ibobOpenMatrixIds.push( e.detailRow.index());
	var map = new Object();
	map["All_LOCAL_Columns"] = volumeUtilizationTreeGridMatrixConstants.LOCAL_COLUMNS_IBOB;
	map["All_Zulu_Columns"] = volumeUtilizationTreeGridMatrixConstants.ZULU_COLUMNS_IBOB;
	showLocalOrZuluMatrixColumns("IBOBMatrix"+e.detailRow.index(), map["All_LOCAL_Columns"], map["All_Zulu_Columns"], isLocalTimeFlag());
}

/**
* Volume utilization local columns method
* Method to get local columns of Volume utilization matrix.
*/
function getLocalColumns() {
	return $.merge($.merge(volumeUtilizationTreeGridMatrixConstants.LOCAL_COLUMNS,volumeUtilizationTreeGridMatrixConstants.EFF_LOCAL_COLUMNS),volumeUtilizationTreeGridMatrixConstants.ROUTE_EFF_LOCAL_COLUMNS);
}

/**
* Volume Utilization zulu columns method
* Method to get zulu columns of Volume utilization matrix.
*/
function getZuluColumns() {
	return $.merge($.merge(volumeUtilizationTreeGridMatrixConstants.ZULU_COLUMNS,volumeUtilizationTreeGridMatrixConstants.EFF_ZULU_COLUMNS),volumeUtilizationTreeGridMatrixConstants.ROUTE_EFF_ZULU_COLUMNS);
}

/**
* Volume utilization day column method
* Method to get day column of Volume utilization matrix.
*/
function getDayColumn() {
	return volumeUtilizationTreeGridMatrixConstants.DAY_COLUMN;
}

function getEffectiveColumns(isLocalTime){
	if(isLocalTime){
		if(isFiveWeekPlan()){
			return $.merge($.merge([],volumeUtilizationTreeGridMatrixConstants.EFF_LOCAL_COLUMNS),volumeUtilizationTreeGridMatrixConstants.WEEK_COLUMNS_L);	
		}else{
			return volumeUtilizationTreeGridMatrixConstants.EFF_LOCAL_COLUMNS;
		}
	}else{
		if(isFiveWeekPlan()){
			return $.merge($.merge([],volumeUtilizationTreeGridMatrixConstants.EFF_ZULU_COLUMNS),volumeUtilizationTreeGridMatrixConstants.WEEK_COLUMNS_Z);
		}else{
			return volumeUtilizationTreeGridMatrixConstants.EFF_ZULU_COLUMNS;
		}
	}
}

function getRouteEffectiveColumns(isLocalTime){
	if(isLocalTime){
		if(isFiveWeekPlan()){
			return $.merge($.merge([],volumeUtilizationTreeGridMatrixConstants.ROUTE_EFF_LOCAL_COLUMNS),volumeUtilizationTreeGridMatrixConstants.ROUTE_WEEK_COLUMNS_L);	
		}else{
			return volumeUtilizationTreeGridMatrixConstants.ROUTE_EFF_LOCAL_COLUMNS;
		}
	}else{
		if(isFiveWeekPlan()){
			return $.merge($.merge([],volumeUtilizationTreeGridMatrixConstants.ROUTE_EFF_ZULU_COLUMNS),commonMatrixConstants.ROUTE_WEEK_COLUMNS_Z);
		}else{
			return volumeUtilizationTreeGridMatrixConstants.ROUTE_EFF_ZULU_COLUMNS;
		}
	}
}

/**
* calender Row Handler method
* Custom item editor to render calender button.
* It will show the results in calendar based on EFFDAYSL & EFFDAYSZ depending on localZuluFlag.
*/
function calenderRowHandler(calBtn,grid_Id,localZuluFlag) {
	var grid = $("#"+grid_Id.id).data("kendoGrid");
	
	var groupColCorrection;
	var effDaysLIndex;
	var effDaysZIndex;
	var noopDaysLIndex;
	var noopDaysZIndex;
	var holDaysLIndex;
	var holDaysZIndex;

	var currentTR = $(calBtn).closest("tr");
	var childrens, selDays, noOpDays, holDays;
	if(currentTR && currentTR.length > 0){
		childrens = currentTR[0].childNodes;
		groupColCorrection = childrens.length - grid.columns.length;
		// Adding 1 as first column is expand/collapse icon.
		if (localZuluFlag == 'RL' || localZuluFlag == 'RZ') {
			var effDaysLIndex = getMatrixColumnIndex(grid, "RTEEFFDAYSL") + groupColCorrection;
			var effDaysZIndex = getMatrixColumnIndex(grid, "RTEEFFDAYSZ") + groupColCorrection;
			var noopDaysLIndex = getMatrixColumnIndex(grid, "ROUTE_NOOP_DAYS_L") + groupColCorrection;
			var noopDaysZIndex = getMatrixColumnIndex(grid, "ROUTE_NOOP_DAYS_Z") + groupColCorrection;
			var holDaysLIndex = getMatrixColumnIndex(grid, "ROUTE_HOL_DAYS_L") + groupColCorrection;
			var holDaysZIndex = getMatrixColumnIndex(grid, "ROUTE_HOL_DAYS_Z") + groupColCorrection;
		} else {
			var effDaysLIndex = getMatrixColumnIndex(grid, "EFFDAYSL") + groupColCorrection;
			var effDaysZIndex = getMatrixColumnIndex(grid, "EFFDAYSZ") + groupColCorrection;
			var noopDaysLIndex = getMatrixColumnIndex(grid, "NOOP_DAYS_L") + groupColCorrection;
			var noopDaysZIndex = getMatrixColumnIndex(grid, "NOOP_DAYS_Z") + groupColCorrection;
			var holDaysLIndex = getMatrixColumnIndex(grid, "LEG_HOL_DAYS_L") + groupColCorrection;
			var holDaysZIndex = getMatrixColumnIndex(grid, "LEG_HOL_DAYS_Z") + groupColCorrection;			
		}
		if (grid_Id.id.indexOf('IBOBMatrix') >= 0) {
			if (localZuluFlag == 'L') {
				selDays = childrens[14].innerText;
			} else {
				selDays = childrens[15].innerText;
			}
		} else if(childrens && childrens.length > 6){
			if (localZuluFlag == 'L' || localZuluFlag == 'RL') {
				selDays = childrens[effDaysLIndex].innerText;
				noOpDays = childrens[noopDaysLIndex].innerText;
				holDays = childrens[holDaysLIndex].innerText;
			} else if (localZuluFlag == 'Z' || localZuluFlag == 'RZ'){
				selDays = childrens[effDaysZIndex].innerText;
				noOpDays = childrens[noopDaysZIndex].innerText;
				holDays = childrens[holDaysZIndex].innerText;
			}
		}
		
	}
	
	calBtn.gridId = grid_Id.id;
	showDayControl(false,selDays,calBtn, true, null, true, null, null, noOpDays, null, holDays);
} 

/**
* Volume utilization IBOB matrix schema method
* Method to configure IBOB matrix schema.
*/
function getIBOBMatrixSchema() {
	var gridFields = {
            	origLocCd: { type: "string" },
            	origActyCd: { type: "string" },
            	availTimeL: { type: "string" },
            	availTimeZ: { type: "string" },
            	delay: { type: "number" },
            	suggestedMode: { type: "string" },
            	mandatoryMode: { type: "string" },
            	transits: { type: "string" },
            	arrivalDayL: { type: "number" },
            	arrivalDayZ: { type: "number" },
            	dueTimeL: { type: "string" },
            	dueTimeZ: { type: "string" },
            	destLocCd: { type: "string" },
            	destActyCd: { type: "string" },
            	effDaysL: { type: "string" },
            	effDaysZ: { type: "string" },
            	laneStatus: { type: "string" },
            	totalWeight: { type: "number" },
            	totalCube: { type: "number" }
    		};
    		
      return addProductGroupsSchema(gridFields, true, true);
}

/**
* Volume utilization IBOB matrix columns method
* Method to configure IBOB matrix columns.
*/
function getIBOBMatrixColumns(gridId) {
	var	calenderIBOBRowTemplateL="#= calenderRowEditor(data,'" + gridId + "'" +",'L' ) #";
	var	calenderIBOBRowTemplateZ="#= calenderRowEditor(data,'" + gridId + "'" +",'Z' ) #";
	var matrixCols = [
            { field: "origLocCd", title:HEADER_ORIG, width: 55, 
            	textAlign:"center",
        		headerText: HEADER_ORIG_TOOLTIP
            },
            { field: "origActyCd", title:HEADER_ORG_ACT, width: 45, 
            	textAlign:"center",
            	headerText:HEADER_ORG_ACT_TOOLTIP
            },
            { field: "availTimeL", title:HEADER_AVAIL_TIME_L, width: 55, 
            	textAlign:"center",
        		headerText: HEADER_AVAIL_TIME_L_TOOLTIP
            },
            { field: "availTimeZ", title:HEADER_AVAIL_TIME_Z, width: 55, 
            	textAlign:"center",
        		headerText: HEADER_AVAIL_TIME_Z_TOOLTIP
            },
            { field: "delay", title:HEADER_DL, width: 40, 
            	textAlign:"center",
        		headerText: HEADER_DL_TOOLTIP
            },
            { field: "suggestedMode", title:HEADER_SM, width: 20, 
            	textAlign:"center",
        		headerText: HEADER_SM_TOOLTIP
            },
            { field: "mandatoryMode", title:HEADER_MM, width: 20, 
            	textAlign:"center",
        		headerText: HEADER_MM_TOOLTIP
            },
            { field: "transits", title:HEADER_TRANSITS, width: 60, 
            	textAlign:"center",
        		headerText: HEADER_TRANSITS_TOOLTIP
            },
            { field: "arrivalDayL", title:HEADER_ADY_L, width: 55, 
            	textAlign:"center",
        		headerText: HEADER_ADY_L_TOOLTIP
            },
            { field: "arrivalDayZ", title:HEADER_ADY_Z, width: 55, 
            	textAlign:"center",
        		headerText: HEADER_ADY_Z_TOOLTIP
            },
            { field: "dueTimeL", title:HEADER_DUE_TIME_L, width: 55, 
            	textAlign:"center",
        		headerText: HEADER_DUE_TIME_L_TOOLTIP
            },
            { field: "dueTimeZ", title:HEADER_DUE_TIME_Z, width: 55, 
            	textAlign:"center",
        		headerText: HEADER_DUE_TIME_Z_TOOLTIP
            },
            { field: "destLocCd", title:HEADER_DES, width: 50, 
            	textAlign:"center",
        		headerText: HEADER_DES_TOOLTIP
            },
            { field: "destActyCd", title:HEADER_DEST_ACT, width: 40, 
            	textAlign:"center",
        		headerText: HEADER_DEST_ACT_TOOLTIP
            },
            { field: "effDaysL", title:"Effective Days (L)", width: 45, hidden:true, 
            	textAlign:"center",
        		headerText: HEADER_LOCAL_SUFFIX
            },
            { field: "effDaysZ", title:"Effective Days (Z)", width: 45, hidden:true,
            	textAlign:"center",
        		headerText: HEADER_ZULU_SUFFIX
            },
            {
        		field: "EFFDAYSL_D1",
        		title: getEffDaysConfiguration()[0]+HEADER_LOCAL_SUFFIX,
        		textAlign:"center",
        		width: 40,
        		headerText:HEADER_EFF_DAYS_L_TOOLTIP
        	}, {
        		field: "EFFDAYSL_D2",
        		title: getEffDaysConfiguration()[1]+HEADER_LOCAL_SUFFIX,
        		textAlign:"center",
        		width: 40,
        		headerText:HEADER_EFF_DAYS_L_TOOLTIP
        	}, {
        		field: "EFFDAYSL_D3",
        		title: getEffDaysConfiguration()[2]+HEADER_LOCAL_SUFFIX,
        		textAlign:"center",
        		width: 40,
        		headerText:HEADER_EFF_DAYS_L_TOOLTIP
        	}, {
        		field: "EFFDAYSL_D4",
        		title: getEffDaysConfiguration()[3]+HEADER_LOCAL_SUFFIX,
        		textAlign:"center",
        		width: 40,
        		headerText:HEADER_EFF_DAYS_L_TOOLTIP
        	}, {
        		field: "EFFDAYSL_D5",
        		title: getEffDaysConfiguration()[4]+HEADER_LOCAL_SUFFIX,
        		textAlign:"center",
        		width: 20,
        		headerText:HEADER_EFF_DAYS_L_TOOLTIP
        	}, {
        		field: "EFFDAYSL_D6",
        		title: getEffDaysConfiguration()[5]+HEADER_LOCAL_SUFFIX,
        		textAlign:"center",
        		width: 40,
        		headerText:HEADER_EFF_DAYS_L_TOOLTIP
        	}, {
        		field: "EFFDAYSL_D7",
        		title: getEffDaysConfiguration()[6]+HEADER_LOCAL_SUFFIX,
        		textAlign:"center",
        		width: 40,
        		headerText:HEADER_EFF_DAYS_L_TOOLTIP
        	}, {
        		field: "EFFWEEKSL_W1",
        		title: HEADER_W1+HEADER_LOCAL_SUFFIX,
        		textAlign:"center",
        		width: 40,
        		headerText:HEADER_EFF_WEEKS_L_TOOLTIP
        	}, {
        		field: "EFFWEEKSL_W2",
        		title: HEADER_W2+HEADER_LOCAL_SUFFIX,
        		textAlign:"center",
        		width: 40,
        		headerText:HEADER_EFF_WEEKS_L_TOOLTIP
        	}, {
        		field: "EFFWEEKSL_W3",
        		title: HEADER_W3+HEADER_LOCAL_SUFFIX,
        		textAlign:"center",
        		width: 40,
        		headerText:HEADER_EFF_WEEKS_L_TOOLTIP
        	}, {
        		field: "EFFWEEKSL_W4",
        		title: HEADER_W4+HEADER_LOCAL_SUFFIX,
        		textAlign:"center",
        		width: 40,
        		headerText:HEADER_EFF_WEEKS_L_TOOLTIP
        	}, {
        		hidden: !isFiveWeekPlan(),
        		field: "EFFWEEKSL_W5",
        		title: HEADER_W5+HEADER_LOCAL_SUFFIX,
        		textAlign:"center",
        		width: 40,
        		headerText:HEADER_EFF_WEEKS_L_TOOLTIP
        	},
        	{
        		field: "CAL_BUTTON_L",
        		title: "&nbsp;",
        		excludeFromExport: true,
        		template: calenderIBOBRowTemplateL,
        		filterable:false,
        		filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_NONE,
				sortable:false,
        		width: 25
        	},
        	{
        		field: "EFFDAYSZ_D1",
        		title: getEffDaysConfiguration()[0]+HEADER_ZULU_SUFFIX,
        		textAlign:"center",
        		width: 40,
        		headerText: HEADER_EFF_DAYS_Z_TOOLTIP
        	},
        	{
        		field: "EFFDAYSZ_D2",
        		title: getEffDaysConfiguration()[1]+HEADER_ZULU_SUFFIX,
        		textAlign:"center",
        		width: 40,
        		headerText: HEADER_EFF_DAYS_Z_TOOLTIP
        	},
        	{
        		field: "EFFDAYSZ_D3",
        		title: getEffDaysConfiguration()[2]+HEADER_ZULU_SUFFIX,
        		textAlign:"center",
        		width: 40,
        		headerText: HEADER_EFF_DAYS_Z_TOOLTIP
        	},
        	{
        		field: "EFFDAYSZ_D4",
        		title: getEffDaysConfiguration()[3]+HEADER_ZULU_SUFFIX,
        		textAlign:"center",
        		width: 40,
        		headerText: HEADER_EFF_DAYS_Z_TOOLTIP
        	},
        	{
        		field: "EFFDAYSZ_D5",
        		title: getEffDaysConfiguration()[4]+HEADER_ZULU_SUFFIX,
        		textAlign:"center",
        		width: 20,
        		headerText: HEADER_EFF_DAYS_Z_TOOLTIP
        	}, 
        	{
        		field: "EFFDAYSZ_D6",
        		title: getEffDaysConfiguration()[5]+HEADER_ZULU_SUFFIX,
        		textAlign:"center",
        		width: 40,
        		headerText: HEADER_EFF_DAYS_Z_TOOLTIP
        	}, 
        	{
        		field: "EFFDAYSZ_D7",
        		title: getEffDaysConfiguration()[6]+HEADER_ZULU_SUFFIX,
        		textAlign:"center",
        		width: 40,
        		headerText: HEADER_EFF_DAYS_Z_TOOLTIP
        	}, 
        	{
        		field: "EFFWEEKSZ_W1",
        		title: HEADER_W1+HEADER_ZULU_SUFFIX,
        		textAlign:"center",
        		width: 40,
        		headerText: HEADER_EFF_WEEKS_Z_TOOLTIP
        	}, 
        	{
        		field: "EFFWEEKSZ_W2",
        		title: HEADER_W2+HEADER_ZULU_SUFFIX,
        		textAlign:"center",
        		width: 40,
        		headerText: HEADER_EFF_WEEKS_Z_TOOLTIP
        	}, 
        	{
        		field: "EFFWEEKSZ_W3",
        		title: HEADER_W3+HEADER_ZULU_SUFFIX,
        		textAlign:"center",
        		width: 40,
        		headerText: HEADER_EFF_WEEKS_Z_TOOLTIP
        	}, {
        		field: "EFFWEEKSZ_W4",
        		title: HEADER_W4+HEADER_ZULU_SUFFIX,
        		textAlign:"center",
        		width: 40,
        		headerText: HEADER_EFF_WEEKS_Z_TOOLTIP
        	}, 
        	{
        		field: "EFFWEEKSZ_W5",
        		hidden: true,
        		title: HEADER_W5+HEADER_ZULU_SUFFIX,
        		textAlign:"center",
        		width: 40,
        		headerText: HEADER_EFF_WEEKS_Z_TOOLTIP
        	}, 
        	{
        		field: "CAL_BUTTON_Z",
        		title: "&nbsp;",
        		excludeFromExport: true,
        		filterable:false,
        		filterComparisionType: gridFilterTypeConstants.FILTER_TYPE_NONE,
				sortable:false,
				width: 45,
				labelFunction: calLabelFunction
        	},
        	{
				field: "laneStatus",
				title: HEADER_LANE_STATUS,
				textAlign:"center",
				width: 65,
				headerText: HEADER_LANE_STATUS_TOOLTIP,
	      	    labelFunction:laneLableFunction
      	  	},
      	  	{ 
      	  		field: "totalWeight", 
        		title: HEADER_WGT_TOTAL, 
        		textAlign:"right",
        		width: 60 
        	},
            { 
        		field: "totalCube", 
            	title: HEADER_CB_TOTAL, 
            	textAlign:"right",
            	width: 70 
            }
    	];
	
	matrixCols = addProductGroupsColumns(matrixCols, true, undefined, true);
	
	/*matrixCols = matrixCols.concat(        	
        [    { field: "totalWeight", 
        		title: HEADER_WGT_TOTAL, 
        		attributes:{style:"text-align:right;"}, 
        		width: 60 },
            { field: "totalCube", 
            	title: HEADER_CB_TOTAL, 
            	attributes:{style:"text-align:right;"},
            	width: 70 }
        ]); */
        
	return matrixCols;
}

/**
* Volume utilization id column method
* Method to get id column of Volume utilization matrix.
*/
function getIdColumn() {
	return "";
}

/**
* Can Apply Clear
* Method to check if clear operation can be applied in Schedule/Network Schedule matrix
*/
function canApplyClear() {
	if(isNetworkScheduleFlag) {
		return parent.isNetworkQuery;
	} else {
		return !parent.isNetworkQuery;
	}
}

function itemheaderClickedHandler(event) {
    if (event && (event.column.dataField == "LEG_ID" || event.column.getUniqueIdentifier() == "LEG_ID" ) ){
		if(event.cell != undefined && event.cell.children[0] != undefined && event.cell.children[0]._selected != undefined){
			 setTimeout(function() {
		            selectMatrixColumn(event.cell.children[0]);
		     },500);
		}
	}
}
function itemClickHandler(event) {
    if (event && event.column.dataField == "COMMENTS") {
        var commentObjArr = jQuery.parseJSON(event.item.COMMENTS);
        var commentText = "";
        for (var i = 0; i < commentObjArr.length; i++) {
            commentText += "<font color='#376092' size=2px>" + commentObjArr[i].commentDesc + "</font> by " + commentObjArr[i].createUser + " on " + dateTimeFormat(new Date(parseInt(commentObjArr[i].createDtTm))) + "<br><br>";
        }
        createCommentsWin('commentsWindowDiv', commentText);
    }if (event && (event.column.dataField == "LEG_ID" || event.column.getUniqueIdentifier() == "LEG_ID" ) ){
		if(event.cell != undefined && event.cell.children[0] != undefined && event.cell.children[0]._selected != undefined){
			 setTimeout(function() {
		            selectMatrixColumn(event.cell.children[0]);
		     },500);
		}
	}else {
        calenderCellClickHandler(event);
    }
}

function itemOpenHandler(event){
	console.log(event);
	event.preventDefault();
	loadChildren(event.item);
	AdvancedDataGrid.addNestedColumns(getMatrixID(), getNestedColumns(),  event.level);
}

function itemCloseHandler(event){
	console.log(event);
	event.preventDefault();
}

/**
 * calender Row Handler method
 * Custom item editor to render calender button.
 * It will show the results in calendar based on LOCAL_DAYS & ZULU_DAYS depending on localZuluFlag.
 */

function calenderCellClickHandler(event) {
    if (event && event.item) {
        var selDays, noOpDays, holDays;
        var flag = false;
        if (event.column.dataField == 'CAL_BUTTON_ROUTE_L') {
            selDays = event.item["ROUTE_FULL_EFFDT_L"];
            noOpDays = event.item["ROUTE_NOOP_DAYS_L"];
            holDays = event.item["ROUTE_HOL_DAYS_L"];
            flag = true;
        } else if (event.column.dataField == 'CAL_BUTTON_ROUTE_Z') {
            selDays = event.item["ROUTE_FULL_EFFDT_Z"];
            noOpDays = event.item["ROUTE_NOOP_DAYS_Z"];
            holDays = event.item["ROUTE_HOL_DAYS_Z"];
            flag = true;
        } else if (event.column.dataField == 'CAL_BUTTON_L') {
            selDays = event.item["FULL_EFFDT_L"];
            noOpDays = event.item["NOOP_DAYS_L"];
            holDays = event.item["LEG_HOL_DAYS_L"];
            flag = true;
        } else if (event.column.dataField == 'CAL_BUTTON_Z') {
            selDays = event.item["FULL_EFFDT_Z"];
            noOpDays = event.item["NOOP_DAYS_Z"];
            holDays = event.item["LEG_HOL_DAYS_Z"];
            flag = true;
        }
        if (flag == true) {
            parent.showDayControl(false, selDays, event.cell.domElement, true, null, true, null, null, noOpDays, null, holDays);
        }
    }
}

function getPropertyValue(favColumns, key, propertyName, defaultValue) {
    var column;
    if (favColumns != undefined) {
        column = favColumns[key];
        if (column == undefined) {
            switch (propertyName) {
            case "isVisible":
                return true;
                break;
            case "width":
                return defaultValue;
                break;
            }
        }
        return column != undefined && column[propertyName] != undefined ? column[propertyName] : defaultValue;
    }

    return defaultValue;
}

function laneLableFunction(item, column) {
	if (item.children != undefined && item.children.length > 0) {
		return "";
	}
	var laneStatus = item.laneStatus;
	var color;
	if(laneStatus) {
		if(laneStatus == 'No Paths') {
			color = "#ff0000";
		} else if(laneStatus == 'Prod Restricted') {
			color = "#ff0000"; 
		} else if(laneStatus == 'Bad Lane') {
			color = "#ff0000"; 
		} else {
		     if(laneStatus == 'Not Effective') {
		     	color = "#808080";
		     } if(laneStatus == 'N/A') {
		     	color = "#006600";
		     } else if(laneStatus == 'OK') {
		     	color = "#0080ff";
		     } else if(laneStatus == 'Zero') {
		     	color = "#ff0000";
		     } else if(laneStatus == 'Partial') {
		     	color = "#ffff00";
		     } else if(laneStatus == 'Excess') {
		     	color = "#ffc800";
		     } else if(laneStatus == 'Unknown') {
		     	color = "#ffffff";
		     }
		}
	}
	if(laneStatus) {
		return "<span title='"+ laneStatus +"' style='color:"+color+"'>"+laneStatus+"</span>";
	}
	return "";
}

function getGroupbarId(){
	return "groupBar";
}