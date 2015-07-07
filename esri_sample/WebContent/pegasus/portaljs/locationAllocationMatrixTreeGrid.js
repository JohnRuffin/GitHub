/**
* @author 888600 Abhishek Sharma
* This script belongs to Location Allocation Matrix Dashboard.
* Included in locationAllocationMatrix.jsp
*/

//Progress message in Location Allocation Matrix

var commonMatrixConstants = {
		   // Array for All Local columns
		LOCAL_COLUMNS : ["NOOP_DAYS_L", "CAL_BUTTON_L", "EFF_DATS_L", "KEYWORD_EFFDT_L", "DAY"],
		   //Array for All Zulu columns
		ZULU_COLUMNS : [ "NOOP_DAYS_Z", "CAL_BUTTON_Z", "EFF_DATS_Z", "KEYWORD_EFFDT_Z", "DAYZ"],
		   //Array for Week Local columns
		WEEK_COLUMNS_L : ["EFFWEEKSL_W5"],
		   //Array for Week Zulu columns
		WEEK_COLUMNS_Z : ["EFFWEEKSZ_W5"],
		volColLabelMap:{},
		timeColLabelMap:{}
};

//Favorite component
var favoriteComponent;
var locAllocMatrixTreeGridConstants = {
		PROGRESS_DIALOG_MESSAGE_SCHEDULE_MATRIX: "Loading allocation matrix...",
		calenderRowTemplateL: "#= calenderRowEditor(data,'locAllocMatrixTreeGrid','L') #",
		calenderRowTemplateZ: "#= calenderRowEditor(data,'locAllocMatrixTreeGrid','Z') #",
		HEADER_S: "S",
		HEADER_ROUTE_NO: "Mv No",
		HEADER_SCHEDULE_DEST: "Dest",
		HEADER_SCHEDULE_ORG: "Orig",
		EFF_LOCAL_COLUMNS:["EFFDAYSL_D1","EFFDAYSL_D2","EFFDAYSL_D3","EFFDAYSL_D4","EFFDAYSL_D5","EFFDAYSL_D6","EFFDAYSL_D7","EFFWEEKSL_W1","EFFWEEKSL_W2","EFFWEEKSL_W3","EFFWEEKSL_W4"],
		EFF_ZULU_COLUMNS : ["EFFDAYSZ_D1","EFFDAYSZ_D2","EFFDAYSZ_D3","EFFDAYSZ_D4","EFFDAYSZ_D5","EFFDAYSZ_D6","EFFDAYSZ_D7","EFFWEEKSZ_W1","EFFWEEKSZ_W2","EFFWEEKSZ_W3","EFFWEEKSZ_W4"],
		   //Network ID column
		ID_COLUMN : "LANE_ID",
		gridConfig: '<grid headerClicked  = "itemheaderClickedHandler"  ' + 'itemClick = "itemClickHandler"  ' + 'horizontalScrollPolicy="auto" ' + //Enables the horizontal scroll policy
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
		    'useCompactPreferences="true" ' + 'preferencePersistenceKey="scheduleMatrix" ' + /*'selectionMode="singleCells" '+*/
		    /*'enableSplitHeader="false" '+*/
		    /*'enableDrillDown="true" '+*/
		    'enableDynamicLevels="true" ' +
		    'autoLoadPreferences="false" '+
		    'enableMultiplePreferences="true" '+
		    'showSpinnerOnFilterPageSort="true" '+
		    'enableEagerDraw="true" '+
		/*'enableSelectionBubble="true" '+	
					'enableSelectionCascade="true" '+
					'selectedKeyField="LEG_TYPE" '+	*/
		    '>' + '</grid>'
};

//Boolean flag to determine if the request is from Network Schedule or not
var isNetworkScheduleFlag;
//Var to have flag for Schedule or Network Schedule
var dayWhereClauses = {};


	commonMatrixConstants.timeColLabelMap["NOOP_DAYS_L"] = ["No Op Days"];
	commonMatrixConstants.timeColLabelMap["NOOP_DAYS_Z"] = ["No Op Days"];
	commonMatrixConstants.timeColLabelMap["DAY"] = ["Vol Day"];
	commonMatrixConstants.timeColLabelMap["DAYZ"] = ["Vol Day"];
	
	commonMatrixConstants.volColLabelMap["ALLOC_WEIGHT"] = ["Ttl Wt"];
	commonMatrixConstants.volColLabelMap["USED_WEIGHT"] = ["Used Wt"];
	commonMatrixConstants.volColLabelMap["EXCESS_WEIGHT"] = ["Excess Wt"];
	commonMatrixConstants.volColLabelMap["ALLOC_CUBE"] = ["Ttl Cu"];
	commonMatrixConstants.volColLabelMap["USED_CUBE"] = ["Used Cu"];
	commonMatrixConstants.volColLabelMap["EXCESS_CUBE"] = ["Excess Cu"];

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
* Called before Network Query executed
* To clear the network matrix out.
*/
function onBeforeRunQuery() {	
	clear(false, false);
}

function onNetworkQuerySuccess() {
}

/**
* Called on Network Schedule Query success
* To refresh location allocation matrix.
*/
function onNetworkScheduleQuerySuccess() {
	if (parent.isNetworkQuery && isNetworkScheduleFlag) {
		refreshMatrix();
	}
}

/**
* Called on Schedule Query success
* To refresh location allocation matrix.
*/
function onScheduleQuerySuccess() {
	if (!parent.isNetworkQuery && !isNetworkScheduleFlag) {
		refreshMatrix();
	}
}

/**
* Called on location allocation Matrix refresh
* To refresh location allocation matrix.
*/
function refresh() {
	if(parent.needToLoadData(parent.DASHBOARD_ID_ALLOCATION_MATRIX, isNetworkScheduleFlag)) {
		refreshMatrix();
	}
}

/**
* Called on day component click
* To open the location allocation matrix day control.
*/
function openDayControl(btn) {
	parent.VIEWER.openDayControl(btn, parent.DASHBOARD_ID_ALLOCATION_MATRIX, parent.getDataType(isNetworkScheduleFlag));
}
/******* common methods - end *******/
/******* common methods - favorites - start *******/
function getHeaderButtonSettings() {
}

/**
* Location allocation Display option setting
* get network matrix display option favorites setting.
*/
function getDisplayOptionSettings() {
	return getColumnsSettings(getContainerId()[0]);
}

/**
* Location allocation Contents setting
* get location allocation matrix contents favorites setting.
*/
function getContentFavoriteSettings() {
	return getMatrixContentFavoriteSettings(getContainerId()[0]);
}
function applyHeaderButtonSettings(headerButtonSettings) {
}

/**
* Location allocation Display option setting
* apply location allocation matrix display option favorites setting.
*/
function applyDisplayOptionSettings(displayOptionSettings, isDefaultFavorite, isApplicationLevel, isRefreshDashboard) {
	setColumnsSettings(displayOptionSettings,getContainerId()[0]);
}

/**
* Location allocation Content setting
* apply location allocation matrix contents favorites setting.
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
		
		parent.setDashboardDataStatus(parent.DASHBOARD_ID_ALLOCATION_MATRIX, getDataType(), false);
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

/**
* Location allocation Initialize method
* Method to use for initialization of Location allocation Matrix.
* @param flag - Flag to determine if the request is first time. If it's first time request, we will initialize display options else not.
* @param favoriteSettings - Columns which are stored in favorites
*/
function initialize(flag, favoriteSettings) {
	AdvancedDataGrid.setDataProvider(getMatrixID(), []);
	setMatrixFavoriteSettings(favoriteSettings);	
	if(flag == undefined) {
		setMatrixID(getContainerId());
		setDashboardID(parent.DASHBOARD_ID_ALLOCATION_MATRIX);
		isClearOn = false;
		addButtonsBar();
		favoriteComponent = new FavoriteComponent(parent.DASHBOARD_ID_ALLOCATION_MATRIX, "locationAllocMatrixFavoritesMenu","Allocation Matrix");
		favoriteComponent.retrieveAllFavorites(true, applyDefaultFavoriteOnInitialize);
		isNetworkScheduleFlag = parent.isNetworkQuery;
		searchCriteria.setCriteria(CRITERIA_IS_NW_RELATED, isNetworkScheduleFlag);
	}
	var matrixURL = getScheduleAllocationMatrixUrl();
	if (isClearOn == true) {
		matrixURL = null;
	}
	parent.setDashboardDataStatus(getDashboardID(), parent.getDataType(), false);	
	new AdvancedDataGrid(getContainerId()[0], {
		configuration: locAllocMatrixTreeGridConstants.gridConfig,
		id: getContainerId()[0],
		dataProvider: [],
		isCellCustomBackgroundDrawFunctionDefault: false
	}, getMatrixColumns(favColumns), updateResponseHandler);
	
	if(flag == undefined) {
		initializeDisplayOptions();
		parent.setDashboardInitialized(parent.DASHBOARD_ID_ALLOCATION_MATRIX);
	}
	refresh();
	parent.setDashboardInitialized(getDashboardID());
	parent.setDashboardInitialized(parent.DASHBOARD_ID_ALLOCATION_MATRIX);
	//setEffectiveSeperateDays();
}

function getContainerId() {
    return [parent.DASHBOARD_ID_ALLOCATION_MATRIX + parent.PARAM_TREE_GRID];
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
   if (event && (event.column.dataField == "LEG_ID" || event.column.getUniqueIdentifier() == "LEG_ID" )){
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
        if (event.column.dataField == 'CAL_BUTTON_L') {
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
/**
* Location allocation Matrix columns
* Method to get Location allocation Matrix columns
* @param favColumns - Columns which are stored as part of favorite.
*/
function getMatrixColumns(favColumns) {
	var matrixCols = [{
		field: "MV_NUM",
		title: HEADER_ROUTE_NO,
		textAlign:"center",
		width: 65,
		columnLockMode: "left",
		headerText: HEADER_ROUTE_NO_TOOLTIP
	},{
		field: "MV_NUM_SEQ",
		title: HEADER_S,
		textAlign:"center",
		width: 40,
		columnLockMode: "left",
		headerText: HEADER_S_TOOLTIP
	},{
        field: "ORIGIN",
        title: locAllocMatrixTreeGridConstants.HEADER_SCHEDULE_ORG,
        textAlign:"center",
        filterable: true,
        width: 50,
        headerText: HEADER_SCHEDULE_ORG_TOOLTIP
    },{
        field: "DESTINATION",
        title: locAllocMatrixTreeGridConstants.HEADER_SCHEDULE_DEST,
        textAlign:"center",
        filterable: true,
        width: 50,
        headerText: HEADER_SCHEDULE_DEST_TOOLTIP
    }, {
		hidden:true,
		field: "EFFDAYSL_D1",
		title: getEffDaysConfiguration()[0]+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_DAYS_L_TOOLTIP,
          cellBackgroundColorFunction: function(cell) {
  	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSL_D", "LEG_HOL_DAYS_L", 1);
      	}
	}, {
		hidden:true,
		field: "EFFDAYSL_D2",
		title: getEffDaysConfiguration()[1]+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_DAYS_L_TOOLTIP,
          cellBackgroundColorFunction: function(cell) {
  	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSL_D", "LEG_HOL_DAYS_L", 2);
      	}
	}, {
		hidden:true,
		field: "EFFDAYSL_D3",
		title: getEffDaysConfiguration()[2]+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_DAYS_L_TOOLTIP,
          cellBackgroundColorFunction: function(cell) {
  	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSL_D", "LEG_HOL_DAYS_L", 3);
      	}
	}, {
		hidden:true,
		field: "EFFDAYSL_D4",
		title: getEffDaysConfiguration()[3]+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_DAYS_L_TOOLTIP,
          cellBackgroundColorFunction: function(cell) {
  	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSL_D", "LEG_HOL_DAYS_L", 4);
      	}
	}, {
		hidden:true,
		field: "EFFDAYSL_D5",
		title: getEffDaysConfiguration()[4]+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_DAYS_L_TOOLTIP,
          cellBackgroundColorFunction: function(cell) {
  	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSL_D", "LEG_HOL_DAYS_L", 5);
      	}
	}, {
		hidden:true,
		field: "EFFDAYSL_D6",
		title: getEffDaysConfiguration()[5]+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_DAYS_L_TOOLTIP,
          cellBackgroundColorFunction: function(cell) {
  	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSL_D", "LEG_HOL_DAYS_L", 6);
      	}
	}, {
		hidden:true,
		field: "EFFDAYSL_D7",
		title: getEffDaysConfiguration()[6]+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_DAYS_L_TOOLTIP,
          cellBackgroundColorFunction: function(cell) {
  	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSL_D", "LEG_HOL_DAYS_L", 7);
      	}
	},{
		hidden:true,
		field: "EFFWEEKSL_W1",
		title: HEADER_W1+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_WEEKS_L_TOOLTIP,
          cellBackgroundColorFunction: function(cell) {
    			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "EFFWEEKSL_W", 1);
    		}
	}, {
		hidden:true,
		field: "EFFWEEKSL_W2",
		title: HEADER_W2+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_WEEKS_L_TOOLTIP,
          cellBackgroundColorFunction: function(cell) {
    			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "EFFWEEKSL_W", 2);
    		}
	}, {
		hidden:true,
		field: "EFFWEEKSL_W3",
		title: HEADER_W3+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_WEEKS_L_TOOLTIP,
          cellBackgroundColorFunction: function(cell) {
    			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "EFFWEEKSL_W", 3);
    		}
	}, {
		hidden:true,
		field: "EFFWEEKSL_W4",
		title: HEADER_W4+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_WEEKS_L_TOOLTIP,
          cellBackgroundColorFunction: function(cell) {
    			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "EFFWEEKSL_W", 4);
    		}
	}, {
		hidden:true,
		field: "EFFWEEKSL_W5",
		title: HEADER_W5+HEADER_LOCAL_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_WEEKS_L_TOOLTIP,
          cellBackgroundColorFunction: function(cell) {
    			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "EFFWEEKSL_W", 5);
    		}
	}, {
		hidden: true,
		field: "EFF_DATS_L",
		title: HEADER_EFF_DAYS_L,
		textAlign:"center",
		width: 120,
		headerText: HEADER_EFF_DAYS_L_TOOLTIP,
      	  template: function(dataItem) {
  			return parent.getEffDaysStringFromSystemSetting(dataItem, "EFF_DATS_L");
  		}
	}, {
		hidden:!isLocalTimeFlag(),
		field: "KEYWORD_EFFDT_L",
		title: HEADER_KEY_EFF_DAYS_L,
		textAlign:"left",
		width: 175,
		headerText: HEADER_KEY_EFF_DAYS_L_TOOLTIP
	}, {
		hidden:!isLocalTimeFlag(),
		field: "NOOP_DAYS_L",
		title: HEADER_NO_OPS_L,
		textAlign:"center",
		width: 60,
		headerText: HEADER_NO_OPS_TOOLTIP,
		template: function(dataItem) {
				var onOpStr = getNoOpString(dataItem.NOOP_DAYS_L);
				return onOpStr;
			}	
	}, {
		hidden:!isLocalTimeFlag(),
		field: "CAL_BUTTON_L",
		title: "&nbsp;",
		excludeFromExport: true,
		filterable:false,
		sortable:false,
		headerText: HEADER_LEG_CAL_L_TOOLTIP,
		width: 25,
		labelFunction: calLabelFunction
	}, {
		field: "DAY",
		title: HEADER_VOL_DAY,
		textAlign:"center",
		width: 40,
		headerText: HEADER_VOL_DAY_L_TOOLTIP,
		isSortNumeric:true
	}, {
		hidden: true,
		field: "EFFDAYSZ_D1",
		title: getEffDaysConfiguration()[0]+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_DAYS_Z_TOOLTIP,
          cellBackgroundColorFunction: function(cell) {
  	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSZ_D", "LEG_HOL_DAYS_Z", 1);
      	}
	}, {
		hidden: true,
		field: "EFFDAYSZ_D2",
		title: getEffDaysConfiguration()[1]+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_DAYS_Z_TOOLTIP,
          cellBackgroundColorFunction: function(cell) {
  	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSZ_D", "LEG_HOL_DAYS_Z", 2);
      	}
	}, {
		hidden: true,
		field: "EFFDAYSZ_D3",
		title: getEffDaysConfiguration()[2]+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_DAYS_Z_TOOLTIP,
          cellBackgroundColorFunction: function(cell) {
  	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSZ_D", "LEG_HOL_DAYS_Z", 3);
      	}
	}, {
		hidden: true,
		field: "EFFDAYSZ_D4",
		title: getEffDaysConfiguration()[3]+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_DAYS_Z_TOOLTIP,
          cellBackgroundColorFunction: function(cell) {
  	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSZ_D", "LEG_HOL_DAYS_Z", 4);
      	}
	}, {
		hidden: true,
		field: "EFFDAYSZ_D5",
		title: getEffDaysConfiguration()[4]+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_DAYS_Z_TOOLTIP,
          cellBackgroundColorFunction: function(cell) {
  	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSZ_D", "LEG_HOL_DAYS_Z", 5);
      	}
	}, {
		hidden: true,
		field: "EFFDAYSZ_D6",
		title: getEffDaysConfiguration()[5]+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_DAYS_Z_TOOLTIP,
          cellBackgroundColorFunction: function(cell) {
  	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSZ_D", "LEG_HOL_DAYS_Z", 6);
      	}
	}, {
		hidden: true,
		field: "EFFDAYSZ_D7",
		title: getEffDaysConfiguration()[6]+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_DAYS_Z_TOOLTIP,
          cellBackgroundColorFunction: function(cell) {
  	    	return applyEffectiveDaysDayTemplate(cell, cell.getRowInfo().getData(), "EFFDAYSZ_D", "LEG_HOL_DAYS_Z", 7);
      	}
	},  {
		hidden: true,
		field: "EFFWEEKSZ_W1",
		title: HEADER_W1+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_WEEKS_Z_TOOLTIP,
          cellBackgroundColorFunction: function(cell) {
    			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "EFFWEEKSZ_W", 1);
    		}
	}, {
		hidden: true,
		field: "EFFWEEKSZ_W2",
		title: HEADER_W2+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_WEEKS_Z_TOOLTIP,
          cellBackgroundColorFunction: function(cell) {
    			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "EFFWEEKSZ_W", 2);
    		}
	}, {
		hidden: true,
		field: "EFFWEEKSZ_W3",
		title: HEADER_W3+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_WEEKS_Z_TOOLTIP,
          cellBackgroundColorFunction: function(cell) {
    			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "EFFWEEKSZ_W", 3);
    		}
	}, {
		hidden: true,
		field: "EFFWEEKSZ_W4",
		title: HEADER_W4+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_WEEKS_Z_TOOLTIP,
          cellBackgroundColorFunction: function(cell) {
    			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "EFFWEEKSZ_W", 4);
    		}
	}, {
		hidden:true,
		field: "EFFWEEKSZ_W5",
		title: HEADER_W5+HEADER_ZULU_SUFFIX,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EFF_WEEKS_Z_TOOLTIP,
          cellBackgroundColorFunction: function(cell) {
    			return applyEffectiveDaysWeekTemplate(cell, cell.getRowInfo().getData(), "EFFWEEKSZ_W", 5);
    		}
	}, {
		hidden: true,
		field: "EFF_DATS_Z",
		title: HEADER_EFF_DAYS_Z,
		textAlign:"center",
		width: 120,
		headerText: HEADER_EFF_DAYS_Z_TOOLTIP,
      	  template: function(dataItem) {
    			return parent.getEffDaysStringFromSystemSetting(dataItem, "EFF_DATS_Z");
    		}
	}, {
		hidden:isLocalTimeFlag(),
		field: "KEYWORD_EFFDT_Z",
		title: HEADER_KEY_EFF_DAYS_Z,
		textAlign:"left",
		width: 175,
		headerText: HEADER_KEY_EFF_DAYS_Z_TOOLTIP
	}, {
		hidden:isLocalTimeFlag(),
		field: "NOOP_DAYS_Z",
		title: HEADER_NO_OPS_Z,
		textAlign:"center",
		width: 60,
		headerText: HEADER_NO_OPS_TOOLTIP,
      	template: function(dataItem) {
				var onOpStr = getNoOpString(dataItem.NOOP_DAYS_Z);
				return onOpStr;
			}
	},{
		hidden:isLocalTimeFlag(),
		field: "CAL_BUTTON_Z",
		title: "&nbsp;",
		excludeFromExport: true,
		filterable:false,
		sortable:false,
		width: 25,
		headerText: HEADER_LEG_CAL_Z_TOOLTIP,
		labelFunction: calLabelFunction
	}, {
		hidden:isLocalTimeFlag(),
		field: "DAYZ",
		title: HEADER_VOL_DAY,
		textAlign:"center",
		width: 40,
		headerText: HEADER_VOL_DAY_L_TOOLTIP,
		isSortNumeric:true
	}, {
		hidden:true,
		field: "LEG_HOL_DAYS_L",
		title: HEADER_RTE_HOL_DAYS_L,
		textAlign:"center",
		width: 65,
		headerText: HEADER_RTE_HOL_DAYS_L_TOOLTIP
	},{
		hidden:true,
		field: "LEG_HOL_DAYS_Z",
		title: HEADER_RTE_HOL_DAYS_Z,
		textAlign:"center",
		width: 60,
		headerText: HEADER_RTE_HOL_DAYS_Z_TOOLTIP
	},{
		field: "EQUIP_TYPE",
		title: HEADER_EQ,
		textAlign:"center",
		width: 40,
		headerText: HEADER_EQ_TOOLTIP
	},{
		field: "PROD_GRP_NM",
		title: HEADER_PROD_GRP,
		textAlign:"center",
		width: 70,
		headerText: HEADER_PROD_GRP_TOOLTIP
	},{
		field: "ALLOC_WEIGHT",
		title: HEADER_WGT_TOTAL,
		textAlign:"right",
		width: 65,
//		aggregates: ["sum"],
//		footerTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		groupFooterTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		headerText: HEADER_WGT_TOTAL_ALLOWED_TOOLTIP,
		labelFunction: flexiciousNmsp.UIUtils.dataGridFormatCurrencyLabelFunction,
		footerFormatter: flexiciousNmsp.NumberFormatter,
		footerOperation:"sum",
      	footerAlign:"right",
      	isSortNumeric:true,
      	footerOperationPrecision:"0"
	},{
		field: "ALLOC_CUBE",
		title: HEADER_CB_TOTAL,
		textAlign:"right",
		width: 65,
//		aggregates: ["sum"],
//		footerTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		groupFooterTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		headerText: HEADER_CB_TOTAL_ALLOWED_TOOLTIP,
		labelFunction: flexiciousNmsp.UIUtils.dataGridFormatCurrencyLabelFunction,
		footerFormatter: flexiciousNmsp.NumberFormatter,
		footerOperation:"sum",
      	footerAlign:"right",
      	isSortNumeric:true,
      	footerOperationPrecision:"0"
	},{
		field: "USED_WEIGHT",
		title: HEADER_WGT_USED,
		textAlign:"right",
		width: 70,
//		aggregates: ["sum"],
//		footerTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		groupFooterTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		headerText: HEADER_WGT_USED_TOOLTIP,
		labelFunction: flexiciousNmsp.UIUtils.dataGridFormatCurrencyLabelFunction,
		footerFormatter: flexiciousNmsp.NumberFormatter,
		footerOperation:"sum",
      	footerAlign:"right",
      	isSortNumeric:true,
      	footerOperationPrecision:"0"
	},{
		field: "USED_CUBE",
		title: HEADER_CB_USED,
		textAlign:"right",
		width: 70,
//		aggregates: ["sum"],
//		footerTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		groupFooterTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		headerText: HEADER_CB_USED_TOOLTIP,
		labelFunction: flexiciousNmsp.UIUtils.dataGridFormatCurrencyLabelFunction,
		footerFormatter: flexiciousNmsp.NumberFormatter,
		footerOperation:"sum",
      	footerAlign:"right",
      	isSortNumeric:true,
      	footerOperationPrecision:"0"
	},{
		field: "EXCESS_WEIGHT",
		title: HEADER_WGT_EX,
		textAlign:"right",
		width: 60,
//		aggregates: ["sum"],
//		footerTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		groupFooterTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		headerText: HEADER_WGT_EX_TOOLTIP,
		labelFunction: flexiciousNmsp.UIUtils.dataGridFormatCurrencyLabelFunction,
		footerFormatter: flexiciousNmsp.NumberFormatter,
		footerOperation:"sum",
      	footerAlign:"right",
      	isSortNumeric:true,
      	footerOperationPrecision:"0"
	},{
		field: "EXCESS_CUBE",
		title: HEADER_CB_EX,
		textAlign:"right",
		width: 60,
		//aggregates: ["sum"],
		//footerTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		groupFooterTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		headerText: HEADER_CB_EX_TOOLTIP,
		labelFunction: flexiciousNmsp.UIUtils.dataGridFormatCurrencyLabelFunction,
		footerFormatter: flexiciousNmsp.NumberFormatter,
		footerOperation:"sum",
      	footerAlign:"right",
      	isSortNumeric:true,
      	footerOperationPrecision:"0"
	},{
		field: "COMMENTS",
		textAlign:"center",
		width: 70,
		title: HEADER_COMMENT,
		headerText: HEADER_COMMENT
	}];
	
	// If there are favorite on location allocation matrix, hiding the columns based on saved favorites configuration.
	if(favColumns) {
		var column;
		var columnArray = new Array();
		for(var i=0; i<favColumns.length; i++) {
			for(var j=0; j<matrixCols.length; j++) {
				if(matrixCols[j].field == favColumns[i].field) {
					matrixCols[j].width = favColumns[i].width;
					matrixCols[j].hidden = false;
					columnArray.push(matrixCols[j]);
				}
			}
		}
		for(var i=0; i<matrixCols.length; i++) {
			var flag = true;
			for(var j=0; j<favColumns.length; j++) {
				if(matrixCols[i].field == favColumns[j].field) {
					flag = false;
					break;
				}
			}
			if(flag) {
				matrixCols[i].hidden = true;
				columnArray.push(matrixCols[i]);
			}
		}
		return columnArray;
	}
	
	return matrixCols;
}

function updateResponseHandler(response) {
	if(response != undefined && response.length >= 0){
	    $.each(response, function(idx, dataItem) {
	        populateEffectiveDayColumns(dataItem, "EFF_DATS_L", "EFF_DATS_Z", "");
	    });
	}   
    showProgressDialog(false); 
    return response;
}

/**
* Location allocation Aggregate columns method
* Method to set Aggregate columns in location allocation matrix.
*/
function getAggregateColumnsSettings(){
	var map = new Object(); 
	map["All_Weight_Columns"] = ["ALLOC_WEIGHT","USED_WEIGHT","EXCESS_WEIGHT"];
	map["All_Cube_Columns"] = ["ALLOC_CUBE","USED_CUBE","EXCESS_CUBE"];
	return map;
}

/**
* Location allocation Timezone method
* Method to set Timezone columns.
*/
function getTimeZoneColumnsSettings(){
	var map = new Object(); 
	if(isFiveWeekPlan()){
		map["All_Local_Columns"] =$.merge($.merge([],getLocalColumns()),commonMatrixConstants.WEEK_COLUMNS_L);	
		map["All_Zulu_Columns"] = $.merge($.merge([],getZuluColumns()),commonMatrixConstants.WEEK_COLUMNS_Z);
	}else{
		map["All_Local_Columns"] =getLocalColumns();
		map["All_Zulu_Columns"] = getZuluColumns();
	}
	showLocalOrZuluMatrixColumns("locAllocMatrixTreeGrid", map["All_Local_Columns"], map["All_Zulu_Columns"], isLocalTimeFlag());
	return map;
}

/**
* Location allocation Reserved columns visibility method
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
* Location allocation columns visibility method
* Method to set columns visibility in Display options.
*/
function getColumnsToHideInSettings(){
	var colToHide=["CAL_BUTTON_L","CAL_BUTTON_Z", "LEG_HOL_DAYS_L", "LEG_HOL_DAYS_Z"];
	if(!isFiveWeekPlan()){
		$.merge(colToHide,commonMatrixConstants.WEEK_COLUMNS_L);
		$.merge(colToHide,commonMatrixConstants.WEEK_COLUMNS_Z);
	}
	return colToHide;

}
function setSearchCriteria() {
	if(searchCriteria) {
		searchCriteria.setCriteria(CRITERIA_IS_NW_RELATED, isNetworkScheduleFlag);
	}
}

/**
* Location allocation local columns method
* Method to get local columns of Location allocation matrix.
*/
function getLocalColumns() {
	return $.merge($.merge([],commonMatrixConstants.LOCAL_COLUMNS),locAllocMatrixTreeGridConstants.EFF_LOCAL_COLUMNS);
}

/**
* Location allocation zulu columns method
* Method to get zulu columns of Schedule matrix.
*/
function getZuluColumns() {
	return $.merge($.merge([],commonMatrixConstants.ZULU_COLUMNS),locAllocMatrixTreeGridConstants.EFF_ZULU_COLUMNS);
}
function getEffectiveColumns(isLocalTime){
	if(isLocalTime){
		if(isFiveWeekPlan()){
			return $.merge($.merge([],locAllocMatrixTreeGridConstants.EFF_LOCAL_COLUMNS),commonMatrixConstants.WEEK_COLUMNS_L);	
		}else{
			return locAllocMatrixTreeGridConstants.EFF_LOCAL_COLUMNS;
		}
	}else{
		if(isFiveWeekPlan()){
			return $.merge($.merge([],locAllocMatrixTreeGridConstants.EFF_ZULU_COLUMNS),commonMatrixConstants.WEEK_COLUMNS_Z);
		}else{
			return locAllocMatrixTreeGridConstants.EFF_ZULU_COLUMNS;
		}
	}
}
/**
* calender Row Handler method
* Custom item editor to render calender button.
* It will show the results in calendar based on EFF_DATS_L & EFF_DATS_Z depending on localZuluFlag.
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
	var childrens, selDays, noOpDays;
	if(currentTR && currentTR.length > 0){
		childrens = currentTR[0].childNodes;
		groupColCorrection = childrens.length - grid.columns.length;
		effDaysLIndex = getMatrixColumnIndex(grid, "EFF_DATS_L") + groupColCorrection;
		effDaysZIndex = getMatrixColumnIndex(grid, "EFF_DATS_Z") + groupColCorrection;
		noopDaysLIndex = getMatrixColumnIndex(grid, "NOOP_DAYS_L") + groupColCorrection;
		noopDaysZIndex = getMatrixColumnIndex(grid, "NOOP_DAYS_Z") + groupColCorrection;
		holDaysLIndex = getMatrixColumnIndex(grid, "LEG_HOL_DAYS_L") + groupColCorrection;
		holDaysZIndex = getMatrixColumnIndex(grid, "LEG_HOL_DAYS_Z") + groupColCorrection;
		if(childrens && childrens.length > effDaysLIndex){
			if (localZuluFlag == 'L') {
				selDays = childrens[effDaysLIndex].innerText;
				noOpDays = childrens[noopDaysLIndex].innerText;
				holDays = childrens[holDaysLIndex].innerText;
			} else {
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
* Reset Location allocation matrix
* Method to reset Location allocation matrix.
*/
/*
function resetDashboard(restoreDefaultFavorite, isClearOperation){
	if(restoreDefaultFavorite != undefined || (isClearOperation != undefined && isClearOperation)){
		resetGridContent(getMatrixID());
		resetSettingsChkBoxes(getMatrixID());
	}else{
		//restore default favorite
		favoriteComponent.applyDefaultFavorite();
	}	
}*/

/**
* Location allocation id column method
* Method to get id column of Location allocation matrix.
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

function getGroupbarId(){
	return "groupBar";
}