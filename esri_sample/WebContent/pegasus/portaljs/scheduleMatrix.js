/**
* @author 888600 Abhishek Sharma
* This script belongs to Schedule Matrix Dashboard.
* Included in scheduleMatrix.jsp
*/

//Progress message in Schedule Matrix
var PROGRESS_DIALOG_MESSAGE_SCHEDULE_MATRIX = "Loading schedule matrix...";
//Progress message in Schedule Overlay Matrix
var PROGRESS_DIALOG_MESSAGE_NETWORK_SCHEDULE_MATRIX = "Loading network schedule matrix...";
//Calendar row template for Local & Zulu
var	calenderRowTemplateL="#= calenderRowEditor(data,'scheduleMatrixGrid','L') #";
var	calenderRowTemplateZ="#= calenderRowEditor(data,'scheduleMatrixGrid','Z') #";

// In these templates 'RL' means Route Local & 'RZ' means Route Zulu.
var	calenderRouteRowTemplateL="#= calenderRowEditor(data,'scheduleMatrixGrid','RL') #";
var	calenderRouteRowTemplateZ="#= calenderRowEditor(data,'scheduleMatrixGrid','RZ') #";

var EFF_LOCAL_COLUMNS=["EFFDAYSL_D1","EFFDAYSL_D2","EFFDAYSL_D3","EFFDAYSL_D4","EFFDAYSL_D5","EFFDAYSL_D6","EFFDAYSL_D7",
    					"EFFWEEKSL_W1","EFFWEEKSL_W2","EFFWEEKSL_W3","EFFWEEKSL_W4"];
var EFF_ZULU_COLUMNS = [ "EFFDAYSZ_D1","EFFDAYSZ_D2","EFFDAYSZ_D3","EFFDAYSZ_D4","EFFDAYSZ_D5","EFFDAYSZ_D6","EFFDAYSZ_D7",
     					"EFFWEEKSZ_W1","EFFWEEKSZ_W2","EFFWEEKSZ_W3","EFFWEEKSZ_W4"];

// Route Effective days column array
var ROUTE_EFF_LOCAL_COLUMNS=["RTEEFFDAYSL_D1","RTEEFFDAYSL_D2","RTEEFFDAYSL_D3","RTEEFFDAYSL_D4","RTEEFFDAYSL_D5","RTEEFFDAYSL_D6","RTEEFFDAYSL_D7",
   					"RTEEFFWEEKSL_W1","RTEEFFWEEKSL_W2","RTEEFFWEEKSL_W3","RTEEFFWEEKSL_W4"];
var ROUTE_EFF_ZULU_COLUMNS = [ "RTEEFFDAYSZ_D1","RTEEFFDAYSZ_D2","RTEEFFDAYSZ_D3","RTEEFFDAYSZ_D4","RTEEFFDAYSZ_D5","RTEEFFDAYSZ_D6","RTEEFFDAYSZ_D7",
    					"RTEEFFWEEKSZ_W1","RTEEFFWEEKSZ_W2","RTEEFFWEEKSZ_W3","RTEEFFWEEKSZ_W4"];

//Array for All Local columns
var LOCAL_COLUMNS = ["NOOP_DAYS_L","ROUTE_NOOP_DAYS_L","LOCAL_DEP", "LOCAL_ARR", "ARRIVAL_DAY_L", "B_OFFTIME_L", "LANDING_TIME_L", 
                    "CAL_BUTTON_L","LOCAL_DAYS","KEYWORD_EFFDT_L","LEG_HOL_DAYS_L","ROUTE_HOL_DAYS_L","FULL_EFFDT_L","ROUTE_LOCAL_DAYS","ROUTE_KEYWORD_EFFDT_L","ROUTE_FULL_EFFDT_L", "CAL_BUTTON_ROUTE_L"];
//Array for All Zulu columns
var ZULU_COLUMNS = ["NOOP_DAYS_Z","ROUTE_NOOP_DAYS_Z","ZULU_DEP", "ZULU_ARR", "ARRIVAL_DAY_Z", "B_OFFTIME_Z", "LANDING_TIME_Z",
                   "CAL_BUTTON_Z","ZULU_DAYS","KEYWORD_EFFDT_Z","LEG_HOL_DAYS_Z","ROUTE_HOL_DAYS_Z","FULL_EFFDT_Z","ROUTE_ZULU_DAYS","ROUTE_KEYWORD_EFFDT_Z","ROUTE_FULL_EFFDT_Z", "CAL_BUTTON_ROUTE_Z"];
var LOCAL_TOTAL_FREQ =["TOTAL_FREQ_1","TOTAL_FREQ_2","TOTAL_FREQ_3","TOTAL_FREQ_4","TOTAL_FREQ_5","TOTAL_FREQ_6","TOTAL_FREQ_7"];
var ZULU_TOTAL_FREQ =["TOTAL_FREQZ_1","TOTAL_FREQZ_2","TOTAL_FREQZ_3","TOTAL_FREQZ_4","TOTAL_FREQZ_5","TOTAL_FREQZ_6","TOTAL_FREQZ_7"];

//Array for Week Local columns
var WEEK_COLUMNS_L = ["EFFWEEKSL_W5"];
var ROUTE_WEEK_COLUMNS_L = ["RTEEFFWEEKSL_W5"];
//Array for Week Zulu columns
var WEEK_COLUMNS_Z = ["EFFWEEKSZ_W5"];
var ROUTE_WEEK_COLUMNS_Z = ["RTEEFFWEEKSZ_W5"];
//Array for Holiday columns
var HIDDEN_COLUMNS = ["LEG_HOL_DAYS_L","LEG_HOL_DAYS_Z", "OPERATING_COST", "GLOBAL_RGN_DESC"];
// Array of Days.
var days=['M', 'T', 'W', 'T', 'F', 'S', 'S', 'R', 'N'];
//Array of Weeks.
var weekData=[1, 2, 3, 4];
//Schedule ID column
var ID_COLUMN = "LEG_ID";
//Favorite component
var favoriteComponent;

var timeColLabelMap = new Object(); 
	timeColLabelMap["NOOP_DAYS_L"] = ["Leg No Op Days"];
	timeColLabelMap["ROUTE_NOOP_DAYS_L"] = ["Route No Op Days"];
	timeColLabelMap["LOCAL_DEP"] = ["Dept"];
	timeColLabelMap["LOCAL_ARR"] = ["Arriv"];
	timeColLabelMap["AVAIL_TIME_Z"] = ["Freq Days (M-S)"];
	timeColLabelMap["ARRIVAL_DAY_L"] = ["Arriv Day"];
	timeColLabelMap["B_OFFTIME_L"] = ["Off"];
	timeColLabelMap["LANDING_TIME_L"] = ["On"];
	timeColLabelMap["LEG_HOL_DAYS_L"] = ["Leg Hol Eff Days"];
	timeColLabelMap["ROUTE_HOL_DAYS_L"] = ["Route Hol Eff Days"];
	timeColLabelMap["NOOP_DAYS_Z"] = ["Leg No Op Days"];
	timeColLabelMap["ROUTE_NOOP_DAYS_Z"] = ["Route No Op Days"];
	timeColLabelMap["ZULU_DEP"] = ["Dept"];
	timeColLabelMap["ZULU_ARR"] = ["Arriv"];
	timeColLabelMap["AVAIL_TIME_Z"] = ["Freq Days (M-S)"];
	timeColLabelMap["ARRIVAL_DAY_Z"] = ["Arriv Day"];
	timeColLabelMap["B_OFFTIME_Z"] = ["Off"];
	timeColLabelMap["LANDING_TIME_Z"] = ["On"];
	timeColLabelMap["LEG_HOL_DAYS_Z"] = ["Leg Hol Eff Days"];
	timeColLabelMap["ROUTE_HOL_DAYS_Z"] = ["Route Hol Eff Days"];
	//timeColLabelMap["FULL_EFFDT_L"] = ["Leg Weekly Pattern"];
	//timeColLabelMap["FULL_EFFDT_Z"] = ["Leg Weekly Pattern"];
	//timeColLabelMap["ROUTE_FULL_EFFDT_L"] = ["Route Weekly Pattern"];
	//timeColLabelMap["ROUTE_FULL_EFFDT_Z"] = ["Route Weekly Pattern"];

/******* common methods - start *******/

/**
* Called when Plan is changed
* To hide/unhide matrix columns based on the selected plan.
*/
function onPlanChange() {
	var combobox = $("#freqComboSettings").data("kendoComboBox");
	if (isFiveWeekPlan()) {
		weekData=getWeekData();
		combobox.dataSource._data=weekData;
		combobox.options.dataSource=weekData;
		combobox.dataSource.query();
	}
	else {
		weekData=getWeekData();
		combobox.dataSource._data=weekData;
		combobox.options.dataSource=weekData;
		combobox.dataSource.query();
	}
	combobox.select(0);
	updateEffectiveSettingsClick("All_Local_Columns");
	updateEffectiveSettingsClick("All_Zulu_Columns");
}
/**
 * method to get frequency week combo dataSource
 * @returns {Array}
 */
function getWeekData(){
	if (isFiveWeekPlan()) {
		return weekData=[1,2,3,4,5];
	}
	else {
		return weekData=[1,2,3,4];
	}
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
* To refresh Network Schedule matrix.
*/
function onNetworkScheduleQuerySuccess() {
	if(parent.isNetworkQuery && isNetworkScheduleFlag) {
		refreshMatrix();
	}
}

/**
* Called on Schedule Query success
* To refresh Schedule matrix.
*/
function onScheduleQuerySuccess() {
	if(!parent.isNetworkQuery && !isNetworkScheduleFlag) {
		refreshMatrix();			
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
* Called on Schedule Matrix refresh
* To refresh schedule matrix.
*/
function refresh() {
	if(parent.needToLoadData(getDashboardID(), isNetworkScheduleFlag)) {
		refreshMatrix();
	}
}

/**
* Called on day component click
* To open the schedule matrix day control.
*/
function openDayControl(btn) {
	parent.VIEWER.openDayControl(btn, getDashboardID(), parent.getDataType(isNetworkScheduleFlag));
}

/******* common methods - end *******/

/******* common methods - favorites - start *******/

function getHeaderButtonSettings() {
 	var headerButtonSettings = {}; 
 	/*var btnSyncMap=parent.dashboardController.getDashboard(getDashboardID()).data("kendoWindow").wrapper.find('.sync-to-map');
 	var btnSyncSchematic=parent.dashboardController.getDashboard(getDashboardID()).data("kendoWindow").wrapper.find('.sync-to-schematic');
 	
	if(btnSyncMap.parent()[0].isHighlighted != null){
		headerButtonSettings["ScheduleMatrixSyncMapClass"] = btnSyncMap.parent()[0].isHighlighted;
	}else{
	    headerButtonSettings["ScheduleMatrixSyncMapClass"]  = false;
	}
	if(btnSyncSchematic.parent()[0].isHighlighted != null){
		headerButtonSettings["ScheduleMatrixSyncSchematicClass"] = btnSyncSchematic.parent()[0].isHighlighted;
	}else{
	    headerButtonSettings["ScheduleMatrixSyncSchematicClass"]  = false;
	}*/
    return headerButtonSettings;  
}

/**
* Schedule Display option setting
* get schedule matrix display option favorites setting.
*/
function getDisplayOptionSettings() {
	return getColumnsSettings('scheduleMatrixGrid');
}

/**
* Schedule Contents setting
* get schedule matrix contents favorites setting.
*/
function getContentFavoriteSettings() {
	return getMatrixContentFavoriteSettings('scheduleMatrixGrid');
}
function applyHeaderButtonSettings(headerButtonSettings) {
	if(headerButtonSettings != null){/*
		var btnSyncMap=parent.dashboardController.getDashboard(getDashboardID()).data("kendoWindow").wrapper.find('.sync-to-map');
	 	var btnSyncSchematic=parent.dashboardController.getDashboard(getDashboardID()).data("kendoWindow").wrapper.find('.sync-to-schematic');
	 	
		parent.highlightBtn(btnSyncMap.parent()[0],!headerButtonSettings["ScheduleMatrixSyncMapClass"]);
		parent.enableSync(btnSyncMap.parent()[0],getDashboardID(),[parent.DASHBOARD_ID_MAP_VIEW,parent.DASHBOARD_ID_SCHEMATIC_VIEW]);
		parent.highlightBtn(btnSyncSchematic.parent()[0],!headerButtonSettings["ScheduleMatrixSyncSchematicClass"]);
		parent.enableSync(btnSyncSchematic.parent()[0],getDashboardID(),parent.DASHBOARD_ID_NETWORK_MATRIX,[parent.DASHBOARD_ID_MAP_VIEW,parent.DASHBOARD_ID_SCHEMATIC_VIEW]);
		
	*/} 
}

/**
* Schedule Display option setting
* apply schedule matrix display option favorites setting.
*/
function applyDisplayOptionSettings(displayOptionSettings, isDefaultFavorite, isApplicationLevel, isRefreshDashboard) {
	setColumnsSettings(displayOptionSettings,"scheduleMatrixGrid");
}

/**
* Schedule Content setting
* apply schedule matrix contents favorites setting.
*/
function applyContentFavoriteSettings(contentSettings, isDefaultFavorite, isApplicationLevel, isRefreshDashboard) {
	setMatrixContentFavoriteSettings('scheduleMatrixGrid',contentSettings);
}
/******* common methods - favorites - end *******/

/**
* Schedule Initialize method
* Method to use for initialization of Schedule Matrix.
* @param flag - Flag to determine if the request is first time. If it's first time request, we will initialize display options else not.
* @param favoriteSettings - Columns which are stored in favorites
*/
function initialize(flag, favoriteSettings) {
	
	setMatrixFavoriteSettings(favoriteSettings);	
	if(flag == undefined) {
		setMatrixID("scheduleMatrixGrid");
		if(isNetworkScheduleFlag) {
			setDashboardID(parent.DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX);
		} else {
			setDashboardID(parent.DASHBOARD_ID_SCHEDULE_MATRIX);
		}
		isClearOn = false;
		addButtonsBar();
		favoriteComponent = new FavoriteComponent(getDashboardID(), 
								isNetworkScheduleFlag ? "networkScheduleMatrixFavoritesMenu" : "scheduleMatrixFavoritesMenu",isNetworkScheduleFlag ? "Network Schedule" : "Schedule Matrix");
		favoriteComponent.retrieveAllFavorites(true, applyDefaultFavoriteOnInitialize);
		searchCriteria.setCriteria(CRITERIA_IS_NW_RELATED, isNetworkScheduleFlag);
	}
	var matrixURL = getScheduleMatrixUrl();
	if (isClearOn == true) {
		matrixURL = null;
	}
	var matrixObject = this;
	var scheduleDiv =  $('<div id="scheduleMatrixGrid" style="width:100%;"></div>').empty().appendTo("#scheduleMatrix");
	var element = scheduleDiv.kendoGrid({
		dataSource : {
		transport: {		
		read: {
		  url: function (options) {
		        return matrixURL;
		    },
		  dataType: "json",
		  data: function() {
				return matrixObject.getDatasourceParams();
	 		}
		}
	  },
		schema: {
			model: {
				fields: {
					LEG_ID: {
						type: "string"
					},
					MV_NUM: {
						type: "string"
					},
					MV_NUM_SEQ: {
						type: "number"
					},
					EQUIP_TYPE: {
						type: "string"
					},
					EQUIP_DESC: {
						type: "string"
					},
					LEG_TYPE: {
						type: "string"
					},
					LOCAL_DAYS: {
						type: "string"
					},
					ZULU_DAYS: {
						type: "string"
					},
					KEYWORD_EFFDT_L: {
						type: "string"
					},
					KEYWORD_EFFDT_Z: {
						type: "string"
					},
					FULL_EFFDT_L: {
						type: "string"
					},
					FULL_EFFDT_Z: {
						type: "string"
					},
					LOCAL_WEEKS: {
						type: "string"
					},
					NOOP_DAYS_L: {
						type: "string"
					},
					NOOP_DAYS_Z: {
						type: "string"
					},
					CAL_BUTTON: {
						type: "string"
					},
					ORIGIN: {
						type: "string"
					},
					DESTINATION: {
						type: "string"
					},
					LOCAL_DEP: {
						type: "date"
					},
					LOCAL_ARR: {
						type: "date"
					},
					ZULU_DEP: {
						type: "date"
					},
					ZULU_ARR: {
						type: "date"
					},
					BLOCK_TIME_Z: {
						type: "date"
					},
					FLIGHT_MINS: {
						type: "date"
					},
					LOC_GRND_TIME: {
						type: "date"
					},
					TOTAL_FREQ: {
						type: "number"
					},
					FREQ: {
						type: "number"
					},
					FLIGHT_COUNT: {
						type: "number"
					},
					ARRIVAL_DAY_L: {
						type: "string"
					},
					ARRIVAL_DAY_Z: {
						type: "string"
					},
					TAXI_OUT: {
						type: "string"
					},
					TAXI_OUT_MIN_Z: {
						type: "date"
					},
					FLIGHT_CD: {
						type: "string"
					},
					B_OFFTIME_L: {
						type: "date"
					},
					B_OFFTIME_Z: {
						type: "date"
					},
					LANDING_TIME_L: {
						type: "date"
					},
					LANDING_TIME_Z: {
						type: "date"
					},
					TAXI_IN: {
						type: "string"
					},
					TAXI_IN_MIN_Z: {
						type: "date"
					},
					CARRIER_DESC: {
						type: "string"
					},
					LEG_MILES: {
						type: "string"
					},
					LEG_KMS: {
						type: "string"
					},
					MODE: {
						type: "string"
					},
					OPERATING_COST: {
						type: "string"
					},
					LEG_HOL_DAYS_L: {
						type: "string"
					},
					LEG_HOL_DAYS_Z: {
						type: "string"
					},
					SCAC_CD: {
						type: "string"
					},
					IATA_MV_NBR: {
						type: "string"
					},
					IN_DST: {
						type: "string"
					},
					TEMP_RT: {
						type: "string"
					},
					BAL_MV_NBR: {
						type: "string"
					},
					LAST_UPDT_TIME: {
						type: "date"
					},
					CHANGE_FLAG: {
						type: "string"
					},
					MPH: {
						type: "string"
					},
					OWNER_LOC_CD: {
						type: "string"
					},
					GLOBAL_RGN_DESC: {
						type: "string"
					},
					ALLOC_FLAG: {
						type: "string"
					},
					LAST_USER: {
						type: "string"
					},
					REASON_CD: {
						type: "string"
					},
					COMMENTS: {
						type: "string"
					},
					CARRIER_STG_TM: {
						type: "date"
					},
					DAILY_RT_CC_CHG: {
						type: "string"
					},
					TOTAL_MTH_CST: {
						type: "string"
					},
					TRACK_EQUIP_TYPE: {
						type: "string"
					},
					TRACK_PERSTAGE_TM: {
						type: "date"
					},
					TRACK_STAGE_TM: {
						type: "date"
					},
					TRAIL_OPT: {
						type: "string"
					},
					TRAIL_1PRESTAGE_TM: {
						type: "date"
					},
					TRAIL_1STAGE_TM: {
						type: "date"
					},
					TRAIL_2PRESTAGE_TM: {
						type: "date"
					},
					TRAIL_2STAGE_TM: {
						type: "date"
					},
					TRAIL_AVAIL_TM: {
						type: "date"
					},
					UNLOAD_TM: {
						type: "string"
					},
					LOAD_TM: {
						type: "string"
					},
					ROUTE_LOCAL_DAYS: {
						type: "string"
					},
					ROUTE_ZULU_DAYS: {
						type: "string"
					},
					ROUTE_KEYWORD_EFFDT_L: {
						type: "string"
					},
					ROUTE_KEYWORD_EFFDT_Z: {
						type: "string"
					},
					ROUTE_FULL_EFFDT_L: {
						type: "string"
					},
					ROUTE_FULL_EFFDT_Z: {
						type: "string"
					},
					ROUTE_NOOP_DAYS_L: {
						type: "string"
					},
					ROUTE_NOOP_DAYS_Z: {
						type: "string"
					},
					ROUTE_HOL_DAYS_L: {
						type: "string"
					},
					ROUTE_HOL_DAYS_Z: {
						type: "string"
					}
				}
			},
			parse: function (d) {
				$.each(d, function (idx, dataItem) {				            	
						populateEffectiveDayColumns(dataItem, "LOCAL_DAYS", "ZULU_DAYS", "");
						populateEffectiveDayColumns(dataItem, "ROUTE_LOCAL_DAYS", "ROUTE_ZULU_DAYS", "RTE");
						populateFltFreqColumns(dataItem, "FULL_EFFDT_L", "FULL_EFFDT_Z");
						populateTimeColumns(dataItem);
						 //idx.datetime = kendo.parseDate(idx.datetime, "yyyy-MM-ddTHH:mm:ss.fffZ");
		        });
		        return d;
			}
		}, pageSize: 100,
		aggregate: getAggregateColumns(),
		requestStart: function(e) {
			this.requestStartTime = getTime();
				LoggerUtils.trace("FROM BROWSER: Schedule Matrix[Request] -> Initiate the request to the schedule data that need to be rendered on UI");
				showProgressDialog(true, isNetworkScheduleFlag ? PROGRESS_DIALOG_MESSAGE_NETWORK_SCHEDULE_MATRIX : PROGRESS_DIALOG_MESSAGE_SCHEDULE_MATRIX);
				 this.requestStartTime = getTime();
		  },
		  requestEnd: function(e) {		  
		  	  showProgressDialog(false);
		  	  onResize();	
			  if(renderEmpty) {
		  	  		renderEmpty = false;
		  	  } else {		   
		  	  	parent.setDashboardDataStatus(getDashboardID(), getDataType(), true);
			  	setTimeout( function() {
			  			applyMatrixSortFilterGroupByFavoriteSettings();
						//sync other dashboards
						populateIdsAndSync();
						validateMatrixCheckboxStates("scheduleMatrixGrid");
						LoggerUtils.trace("FROM BROWSER: Schedule Matrix[Response][Completed] -> Applied sorting, grouping, filters and matrix checkbox validations ");
					}, 100);			  	
				}
			  logProcessingTime(this.requestStartTime, getTime(), true, true, (isNetworkScheduleFlag ? PROGRESS_DIALOG_MESSAGE_NETWORK_SCHEDULE_MATRIX : PROGRESS_DIALOG_MESSAGE_SCHEDULE_MATRIX));
			  LoggerUtils.trace("FROM BROWSER: Schedule Matrix[Response] -> Response received");
		  },
		  error: function(e) {
		  	  if(renderEmpty) {
		  	  	renderEmpty = false;
		  	  }
			  showProgressDialog(false);
			  parent.setDashboardDataStatus(getDashboardID(), getDataType(), true);
			  checkForTimeoutError(e);
		  }
		},
		 sortable: {
			 mode: "multiple",
	         allowUnsort: true
	     },
	     filterable: {
	    	 messages: {
	    	 filter: "Apply filter",
	    	 clear: "Clear filter",
	    	 info: "Only show values that:"
	    	 }
	     },
	    groupable: true,
		resizable: true,
		reorderable: true,
		dataBound: onResize,
		//dataBound:  aggregateCalc,
		height: DEFAULT_MATRIX_HEIGHT,
		dataBound:  showTooltip,
		selectable: "cell",
		change: onCellChange,
		scrollable: {
            virtual: true
        },
		columns: getMatrixColumns(favColumns)
	});
	if(flag == undefined) {
		refresh();
		initializeDisplayOptions();
		createKendoDropDown("weekCmb", "text", "value");
		if(isNetworkScheduleFlag) {
			if(parent.isAtleastOneSyncOn) {
				enableDisableRefresh(false);
			}else {
				enableDisableRefresh(parent.isNetworkScheduleDataAvailable, null, true);
			}
		} else {
			if(parent.isAtleastOneSyncOn) {
				enableDisableRefresh(false);
			}else {
				enableDisableRefresh(parent.isRunQuery, null, true);
			}
			parent.isRunQuery = false;
		}

		parent.setDashboardInitialized(getDashboardID());		
		
		if(isNetworkScheduleFlag) {
			//check if sync is already on
			var syncSearchCriteria;
			var viewerIds = [parent.DASHBOARD_ID_MAP_VIEW, parent.DASHBOARD_ID_SCHEMATIC_VIEW];
			var viewerDashboard;
			for(var i = 0; i < viewerIds.length; i++) {
				viewerDashboard = parent.getDashboardContentWindow(viewerIds[i]);
				if(viewerDashboard != undefined && viewerDashboard.isSyncMatrix) {
					syncSearchCriteria = viewerDashboard.getSyncSearchCriteria(parent.DASHBOARD_ID_NETWORK_SCHEDULE_MATRIX);
					if(syncSearchCriteria != undefined) {
						syncDashboard(syncSearchCriteria);
						break;
					}
				}
			}
		}
	}
	if(isNetworkScheduleFlag) {
		refreshMatrix();
	}
	/*if (isLocalTimeFlag()) {
		hideUnhideMatrixColumns(getMatrixID(), WEEK_COLUMNS_L, !isFiveWeekPlan());
	} else {
		hideUnhideMatrixColumns(getMatrixID(), WEEK_COLUMNS_Z, !isFiveWeekPlan());
	}*/
//	setEffectiveSeperateDays();
	
}

function aggregateCalc(arg) {

    //var UnitPrice = 0; // sum
    //var UnitsOnOrder = 0; //average
	var allData = arg.sender.dataSource.data();
	var query = new kendo.data.Query(allData);
	var total = 0;
    var filters = arg.sender.dataSource.filter();
    if (filters != undefined && filters.filters != undefined && filters.filters.length > 0) {
    	total = query.filter(filters).data.length; // total
    } else {
    	total = arg.sender.dataSource._data.length; // total
    }
 

   /* for (var i = 0; i < total; i++) {
        UnitPrice += parseInt(arg.sender.dataSource._data[i].UnitPrice);
        UnitsOnOrder += parseInt(arg.sender.dataSource._data[i].UnitsOnOrder);
    } */

    $("#spanMVNumfooter").html('Leg Cnt:'+kendo.toString(total, 'n0'));
    //resizeMatrix(getMatrixID(), getDashboardID());
    //$("#spanUnitPricefooter").html('Sum: '+UnitPrice);
    //$("#spanUnitsOnOrderfooter").html('average: '+parseInt(UnitsOnOrder/total));
}

/**
* Schedule Aggregate columns method
* Method to set Aggregate columns in schedule matrix.
*/
function getAggregateColumnsSettings(){
	var map = new Object(); 
	return map;
}

/**
* Schedule Timezone method
* Method to set Timezone columns.
*/
function getTimeZoneColumnsSettings(){
	var map = new Object(); 
	if(isFiveWeekPlan()){
		map["All_Local_Columns"] =$.merge($.merge($.merge([],getLocalColumns()),WEEK_COLUMNS_L),ROUTE_WEEK_COLUMNS_L);	
		map["All_Zulu_Columns"] = $.merge($.merge($.merge([],getZuluColumns()),WEEK_COLUMNS_Z),ROUTE_WEEK_COLUMNS_Z);
	}else{
		map["All_Local_Columns"] =getLocalColumns();
		map["All_Zulu_Columns"] = getZuluColumns();
	}
	showLocalOrZuluMatrixColumns("scheduleMatrixGrid", map["All_Local_Columns"], map["All_Zulu_Columns"], isLocalTimeFlag());
	return map;
}

/**
* Schedule Reserved columns visibility method
* Method to set columns visibility in matrix.
*/
function getReservedColumnsVisiblity(){
	var map = new Object(); 
	if (isLocalTimeFlag()) {
		map["All_Zulu_Columns"] = false;
	} else {
		map["All_Local_Columns"] = false;
	}
	map["LEG_HOL_DAYS_L"] = false;
	map["LEG_HOL_DAYS_Z"] = false;
	map["OPERATING_COST"] = false;
	map["GLOBAL_RGN_DESC"] = false;
	
	return map;
}

/**
* Schedule holiday columns visibility method
* Method to set holiday columns visibility in schedule matrix.
*/
function getRegularColumnsVisiblity(){
	var map = new Object(); 
	map["HIDDEN_COLUMNS"] = false;
	return map;
}

/**
* Schedule columns visibility method
* Method to set columns visibility in Display options.
*/
function getColumnsToHideInSettings(){
	var colToHide=[getIdColumn(),"CAL_BUTTON_L","CAL_BUTTON_Z","LOCAL_DAYS","ZULU_DAYS","ROUTE_LOCAL_DAYS","ROUTE_ZULU_DAYS","CAL_BUTTON_ROUTE_L","CAL_BUTTON_ROUTE_Z"];
	if(!isFiveWeekPlan()){
		$.merge(colToHide,WEEK_COLUMNS_L);
		$.merge(colToHide,WEEK_COLUMNS_Z);
		$.merge(colToHide,ROUTE_WEEK_COLUMNS_L);
		$.merge(colToHide,ROUTE_WEEK_COLUMNS_Z);
	}
	return colToHide;
}

/**
* Total Frequency method
* Method to compute total frequency of flights based on effective days string.
*/
function getTotalFreq(totalDays, totalWeeks) {
	totalFreq = 0;
	totalWeek = 0;
	var totDays = buildFlightCountStr(totalDays);
	var totWeeks = replaceAll(totalWeeks, "-", "").length;
	
	for (var i=0;i<7;i++){
	    if(totDays.charAt(i).indexOf('1') >= 0) {
	    	totalFreq +=1;
	    }
	}
	return totalFreq*totWeeks;
}

/**
* Flight count method
* Method to get total count on effective days
*/
function buildFlightCountStr(totalDays) {
	var flightCount = replaceAll(totalDays,"-","0");
	
	for (var i=0;i<7;i++){
	    if(isExists(days, totalDays.charAt(i))) {
	    	flightCount = flightCount.replace(totalDays.charAt(i),"1");
	    } 
	}
	return flightCount;
}

/*
function buildNoOpStr(totalWeeks) {
	var opDatStr="";
	for (var i = 0; i < totalWeeks.length; i++) {
		if(totalWeeks.charAt(i).indexOf('-') >= 0) {
			opDatStr += "X" +(i+1);
	    }  
	}
	return opDatStr;
} */

function setSearchCriteria() {
}

/**
* Schedule local columns method
* Method to get local columns of Schedule matrix.
*/
function getLocalColumns() {
	return $.merge($.merge($.merge($.merge([],LOCAL_COLUMNS),EFF_LOCAL_COLUMNS),ROUTE_EFF_LOCAL_COLUMNS),LOCAL_TOTAL_FREQ);
}

/**
* Schedule zulu columns method
* Method to get zulu columns of Schedule matrix.
*/
function getZuluColumns() {
	return $.merge($.merge($.merge($.merge([],ZULU_COLUMNS),EFF_ZULU_COLUMNS),ROUTE_EFF_ZULU_COLUMNS),ZULU_TOTAL_FREQ);
}

function getEffectiveColumns(isLocalTime){
	var weeksColumnL = ["EFFWEEKSL_W5"];
	var weeksColumnZ = ["EFFWEEKSZ_W5"];
	if(isLocalTime){
		if(isFiveWeekPlan()){
			return $.merge($.merge([],EFF_LOCAL_COLUMNS),weeksColumnL);
		}else{
			return EFF_LOCAL_COLUMNS;
		}
	}else{
		if(isFiveWeekPlan()){
			return $.merge($.merge([],EFF_ZULU_COLUMNS),weeksColumnZ);
		}else{
			return EFF_ZULU_COLUMNS;
		}
	}
}

function getRouteEffectiveColumns(isLocalTime){
	if(isLocalTime){
		if(isFiveWeekPlan()){
			return $.merge($.merge([],ROUTE_EFF_LOCAL_COLUMNS),ROUTE_WEEK_COLUMNS_L);	
		}else{
			return ROUTE_EFF_LOCAL_COLUMNS;
		}
	}else{
		if(isFiveWeekPlan()){
			return $.merge($.merge([],ROUTE_EFF_ZULU_COLUMNS),ROUTE_WEEK_COLUMNS_Z);
		}else{
			return ROUTE_EFF_ZULU_COLUMNS;
		}
	}
}

/**
* Schedule holidays columns method
* Method to get holidays columns of Schedule matrix.
*/
function getHolidayColumns() {
	return HOLIDAY_COLUMNS;
}

/**
* Schedule id column method
* Method to get id column of Schedule matrix.
*/
function getIdColumn() {
	return ID_COLUMN;
}

/**
* week dropdown component in Schedule matrix display setting.
* Method to create week dropdown in display settings.
*/
function createKendoDropDown (id, dataTextField, dataValueField) {
	$("#"+id).kendoDropDownList({
	    dataSource: weekData,
        index: 0,
        change: onChange
	});
}

/**
* onChange event of week dropdown in display option.
* Event to set total frequency for selected week.
*/
function onChange() {
    var selectVal = $('#weekCmb').val();
	var selectInd = $('#weekCmb')[0].selectedIndex;
    var grid = $("#scheduleMatrixGrid").data("kendoGrid");
	var effDaysLIndex = getMatrixColumnIndex(grid, "LOCAL_DAYS");
	var noopDaysLIndex = getMatrixColumnIndex(grid, "NOOP_DAYS_L");
	var freqWkIndex = getMatrixColumnIndex(grid, "FREQ");
	
	var effDayStr = "";
    var noOpDaysStr = "";
    grid.tbody.find("tr").each(function(i){
    	effDayStr = $(this).find("td").eq(effDaysLIndex)[0].innerHTML;
    	noOpDaysStr = $(this).find("td").eq(noopDaysLIndex)[0].innerHTML;
    	var dayStringArray = effDayStr.split(" ");
    	var totFreq = 0;
    	if (isExists(dayStringArray[1], selectInd + 1)) {
    		totFreq = getTotalFreq(dayStringArray[0], selectVal);
    	}
    	if (totFreq != 0) {
        	totFreq = totFreq - getTotalFreqPerWeek(noOpDaysStr,selectVal);
    	}
    	grid._data[i].field = totFreq;
    	$(this).find("td").eq(freqWkIndex).html(totFreq);
    });
};

/**
* To compute total freq of flights per week.
* Method to compute total freq per week excluding no op days.
*/
function getTotalFreqPerWeek(noOpDaysStr, selectedWeek) {
	var count = 0;
	if (noOpDaysStr != undefined || noOpDaysStr != "") {
		var noOpArray = noOpDaysStr.split('X');
		for(var i =0; i < noOpArray.length; i++) {
			var noOpWeek = Math.ceil(noOpArray[i]/7);
		    if(noOpWeek == selectedWeek) {
		    	count++;	    	
		    }
		}
	}
	return count; 
}

/**
* To compute total freq of flights per week.
* Method to compute total freq per week excluding no op days.
*/
function getFreqDaysPerWeek(noOpDaysStr, selectedWeek) {
	var freqColumns = new Array();
	if (noOpDaysStr != undefined || noOpDaysStr != "") {
		var noOpArray = noOpDaysStr.split('X');
		for(var i =0; i < noOpArray.length; i++) {
			var noOpWeek = Math.ceil(noOpArray[i]/7);
		    if(noOpWeek == selectedWeek) {
		    	var noopDay = noOpArray[i]%7;
		    	freqColumns.push(noopDay);
		    }
		}
	}
	return freqColumns; 
}

/**
* To compute total flight count.
* Method to compute total flight count excluding no op days.
*/
function getTotalFlightCount(noOpDaysStr) {
	var count = 0;
	if (noOpDaysStr != undefined || noOpDaysStr != "") {
		var noOpArray = noOpDaysStr.split('X');
		for(var i =0; i < noOpArray.length; i++) {
			var noOpWeek = Math.ceil(noOpArray[i]/7);
		    	count++;	    	
		}
	}
	return count; 
}

/**
* calender Row Handler method
* Custom item editor to render calender button.
* It will show the results in calendar based on LOCAL_DAYS & ZULU_DAYS depending on localZuluFlag.
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
		if (localZuluFlag == 'RL' || localZuluFlag == 'RZ') {
			effDaysLIndex = getMatrixColumnIndex(grid, "ROUTE_LOCAL_DAYS") + groupColCorrection;
			effDaysZIndex = getMatrixColumnIndex(grid, "ROUTE_ZULU_DAYS") + groupColCorrection;
			noopDaysLIndex = getMatrixColumnIndex(grid, "ROUTE_NOOP_DAYS_L") + groupColCorrection;
			noopDaysZIndex = getMatrixColumnIndex(grid, "ROUTE_NOOP_DAYS_Z") + groupColCorrection;
			holDaysLIndex = getMatrixColumnIndex(grid, "ROUTE_HOL_DAYS_L") + groupColCorrection;
			holDaysZIndex = getMatrixColumnIndex(grid, "ROUTE_HOL_DAYS_Z") + groupColCorrection;
		} else {
			effDaysLIndex = getMatrixColumnIndex(grid, "LOCAL_DAYS") + groupColCorrection;
			effDaysZIndex = getMatrixColumnIndex(grid, "ZULU_DAYS") + groupColCorrection;
			noopDaysLIndex = getMatrixColumnIndex(grid, "NOOP_DAYS_L") + groupColCorrection;
			noopDaysZIndex = getMatrixColumnIndex(grid, "NOOP_DAYS_Z") + groupColCorrection;
			holDaysLIndex = getMatrixColumnIndex(grid, "LEG_HOL_DAYS_L") + groupColCorrection;
			holDaysZIndex = getMatrixColumnIndex(grid, "LEG_HOL_DAYS_Z") + groupColCorrection;
		}
		
		if(childrens && childrens.length > effDaysLIndex){
			if (localZuluFlag == 'L' || localZuluFlag == 'RL') {
				selDays = childrens[effDaysLIndex].innerText;
				noOpDays = childrens[noopDaysLIndex].innerText;
				holDays = childrens[holDaysLIndex].innerText;
			} else if (localZuluFlag == 'Z' || localZuluFlag == 'RZ') {
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
* Schedule Matrix columns
* Method to get Schedule Matrix columns
* @param favColumns - Columns which are stored as part of favorite.
*/
function getMatrixColumns(favColumns) {
	var matrixCols = [{
		field: "LEG_ID",
		title: " ", 
		width: 20, 
		sortable:false,
		filterable:false,
		attributes: { style:"padding-left:4px;"}, 
		template: "<input type='checkbox' id='#=data.LEG_ID#' value='#=data.LEG_ID#' class='tickCheckBox' onclick='selectMatrixColumn(this);'/><label></label>",
		headerAttributes: {
      		  title:"Check legs that you want to synchronize with Map or Schematic"
      	  },
        headerTemplate: "<input type='checkbox' id='matrixHeaderChk' class='tickCheckBox' onclick='selectAllMatrixColumns(this);'/><label></label>"
	}, {
		field: "MV_NUM",
		title: HEADER_ROUTE_NO,
		attributes:  { style:"text-align:center;" },
		width: 75,
		aggregates: ["count"],
		footerTemplate: "<div id='spanMVNumfooter' style='text-align: right'></div>",
		groupFooterTemplate: "<div style='text-align: right'>Leg Cnt:#=kendo.toString(count, 'n0') #</div>",
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + dataItem.MV_NUM +'</span>';
			}else {
				return dataItem.MV_NUM;
			}
		},
		headerAttributes: {
  		  title:HEADER_ROUTE_NO_TOOLTIP
  	  }
	},{
		field: "MV_NUM_SEQ",
		title: HEADER_S,
		attributes:  { style:"text-align:center;" },
		width: 20,
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + dataItem.MV_NUM_SEQ +'</span>';
			}else {
				return dataItem.MV_NUM_SEQ;
			}
		},
		headerAttributes: {
      		  title:HEADER_S_TOOLTIP
      	  }
	},{
		field: "EQUIP_TYPE",
		title: HEADER_EQ,
		attributes:  { style:"text-align:center;" },
		width: 40,
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + dataItem.EQUIP_TYPE +'</span>';
			}else {
				return dataItem.EQUIP_TYPE;
			}
		},
		headerAttributes: {
  		  title:HEADER_EQ_TOOLTIP
  	  }
	},{
		field: "EQUIP_DESC",
		title: HEADER_IATA_DESC,
		attributes:  { style:"text-align:center;" },
		width: 55,
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + dataItem.EQUIP_DESC +'</span>';
			}else {
				return dataItem.EQUIP_DESC;
			}
		},
		headerAttributes: {
      		  title:HEADER_IATA__DESC_TOOLTIP
      	  }
	},{
		field: "LEG_TYPE",
		title: HEADER_LEG_TYPE,
		attributes:  { style:"text-align:center;" },
		width: 30,
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + dataItem.LEG_TYPE +'</span>';
			}else {
				return dataItem.LEG_TYPE;
			}
		},
		headerAttributes: {
      		  title:HEADER_LEG_TYPE_TOOLTIP
      	  }
	}, {
		hidden: true,
		field: "RTEEFFDAYSL_D1",
		title: getEffDaysConfiguration()[0]+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_ROUTE_EFF_DAYS_L_TOOLTIP
      	  },
      	  template: function(dataItem) {
      	  	return applyEffectiveDaysDayTemplate(dataItem, "RTEEFFDAYSL_D", "ROUTE_HOL_DAYS_L", 1);
		}
		
	}, {
		hidden: true,
		field: "RTEEFFDAYSL_D2",
		title: getEffDaysConfiguration()[1]+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_ROUTE_EFF_DAYS_L_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysDayTemplate(dataItem, "RTEEFFDAYSL_D", "ROUTE_HOL_DAYS_L", 2);
		}
		
	}, {
		hidden: true,
		field: "RTEEFFDAYSL_D3",
		title: getEffDaysConfiguration()[2]+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_ROUTE_EFF_DAYS_L_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysDayTemplate(dataItem, "RTEEFFDAYSL_D", "ROUTE_HOL_DAYS_L", 3);
		}
		
	}, {
		hidden: true,
		field: "RTEEFFDAYSL_D4",
		title: getEffDaysConfiguration()[3]+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_ROUTE_EFF_DAYS_L_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysDayTemplate(dataItem, "RTEEFFDAYSL_D", "ROUTE_HOL_DAYS_L", 4);
		}
		
	}, {
		hidden: true,
		field: "RTEEFFDAYSL_D5",
		title: getEffDaysConfiguration()[4]+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 20,
		headerAttributes: {
      		  title:HEADER_ROUTE_EFF_DAYS_L_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysDayTemplate(dataItem, "RTEEFFDAYSL_D", "ROUTE_HOL_DAYS_L", 5);
		}
		
	}, {
		hidden: true,
		field: "RTEEFFDAYSL_D6",
		title: getEffDaysConfiguration()[5]+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_ROUTE_EFF_DAYS_L_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysDayTemplate(dataItem, "RTEEFFDAYSL_D", "ROUTE_HOL_DAYS_L", 6);
		}
		
	}, {
		hidden: true,
		field: "RTEEFFDAYSL_D7",
		title: getEffDaysConfiguration()[6]+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_ROUTE_EFF_DAYS_L_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysDayTemplate(dataItem, "RTEEFFDAYSL_D", "ROUTE_HOL_DAYS_L", 7);
		}
		
	},  {
		hidden: true,
		field: "RTEEFFWEEKSL_W1",
		title: HEADER_W1+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_ROUTE_EFF_WEEKS_L_TOOLTIP
      	  },
      	  template: function(dataItem) {
      	  	return applyEffectiveDaysWeekTemplate(dataItem, "RTEEFFWEEKSL_W", 1);			
		}
		
	}, {
		hidden: true,
		field: "RTEEFFWEEKSL_W2",
		title: HEADER_W2+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_ROUTE_EFF_WEEKS_L_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysWeekTemplate(dataItem, "RTEEFFWEEKSL_W", 2);
		}
		
	}, {
		hidden: true,
		field: "RTEEFFWEEKSL_W3",
		title: HEADER_W3+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_ROUTE_EFF_WEEKS_L_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysWeekTemplate(dataItem, "RTEEFFWEEKSL_W", 3);
		}
		
	}, {
		hidden: true,
		field: "RTEEFFWEEKSL_W4",
		title: HEADER_W4+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_ROUTE_EFF_WEEKS_L_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysWeekTemplate(dataItem, "RTEEFFWEEKSL_W", 4);
		}
		
	}, {
		hidden: true,
		field: "RTEEFFWEEKSL_W5",
		title: HEADER_W5+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_ROUTE_EFF_WEEKS_L_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysWeekTemplate(dataItem, "RTEEFFWEEKSL_W", 5);
		}			
	}, {
		hidden:true,
		field: "ROUTE_LOCAL_DAYS",
		title: HEADER_ROUTE_EFF_DAYS_L,
		attributes:  { style:"text-align:center;" },
		width: 120,
		headerAttributes: {
    		  title:HEADER_ROUTE_EFF_DAYS_L_TOOLTIP
    	  },
      	  template: function(dataItem) {
      		if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + parent.getEffDaysStringFromSystemSetting(dataItem, "ROUTE_LOCAL_DAYS") +'</span>';
			}else {
				return parent.getEffDaysStringFromSystemSetting(dataItem, "ROUTE_LOCAL_DAYS");
			}
  		}	
	}, {
		hidden:!isLocalTimeFlag(),
		field: "ROUTE_KEYWORD_EFFDT_L",
		title: HEADER_ROUTE_KEY_EFF_DAYS_L,
		attributes:  { style:"text-align:left;" },
		width: 175,
		headerAttributes: {
    		  title:HEADER_ROUTE_KEY_EFF_DAYS_L_TOOLTIP
    	  },
    	  template: function(dataItem) {
				if(dataItem.CHANGE_FLAG == "D") {
					return '<span style="color:#ff0000">' + dataItem.ROUTE_KEYWORD_EFFDT_L +'</span>';
				}else {
					return dataItem.ROUTE_KEYWORD_EFFDT_L;
				}
			}
	}, {
		hidden:true,
		field: "ROUTE_FULL_EFFDT_L",
		title: HEADER_ROUTE_WEEK_EFF_DAYS_L,
		attributes:  { style:"text-align:left;" },
		width: 175,
		headerAttributes: {
    		  title:HEADER_ROUTE_WEEK_EFF_DAYS_L_TOOLTIP
    	  },
    	  template: function(dataItem) {
				if(dataItem.CHANGE_FLAG == "D") {
					return '<span style="color:#ff0000">' + parent.getEffDaysStringFromSystemSetting(dataItem, "ROUTE_FULL_EFFDT_L", true) +'</span>';
				}else {
					return parent.getEffDaysStringFromSystemSetting(dataItem, "ROUTE_FULL_EFFDT_L", true);
				}
			}
	}, {
		hidden:!isLocalTimeFlag(),
		field: "ROUTE_NOOP_DAYS_L",
		title: HEADER_ROUTE_NO_OPS_L,
		attributes:  { style:"text-align:center;" },
		template: calenderRowTemplateL,
		width: 60,
		headerAttributes: {
      		  title:HEADER_NO_OPS_TOOLTIP
      	  },
      	  template: function(dataItem) {
				var noopStr = getNoOpString(dataItem.ROUTE_NOOP_DAYS_L);
				if(dataItem.CHANGE_FLAG == "D") {
					return '<span style="color:#ff0000">' + noopStr +'</span>';
				}else {
					return noopStr;
				}
			}	
	}, {
		hidden:!isLocalTimeFlag(),
		field: "ROUTE_HOL_DAYS_L",
		title: HEADER_ROUTE_HOL_DAYS_L,
		attributes:  { style:"text-align:center;" },
		width: 65,
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + dataItem.ROUTE_HOL_DAYS_L +'</span>';
			}else {
				return dataItem.ROUTE_HOL_DAYS_L;
			}
		},
		headerAttributes: {
      		  title:HEADER_ROUTE_HOL_DAYS_L_TOOLTIP
      	  }
	}, {
		hidden:!isLocalTimeFlag(),
		field: "CAL_BUTTON_ROUTE_L",
		title: "&nbsp;",
		template: calenderRouteRowTemplateL,
		filterable:false,
		sortable:false,
		width: 25
	}, {
		hidden: true,
		field: "EFFDAYSL_D1",
		title: getEffDaysConfiguration()[0]+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_LEG_EFF_DAYS_L_TOOLTIP
      	  },
      	  template: function(dataItem) {
      	  	return applyEffectiveDaysDayTemplate(dataItem, "EFFDAYSL_D", "LEG_HOL_DAYS_L", 1);
		}
		
	}, {
		hidden: true,
		field: "EFFDAYSL_D2",
		title: getEffDaysConfiguration()[1]+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_LEG_EFF_DAYS_L_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysDayTemplate(dataItem, "EFFDAYSL_D", "LEG_HOL_DAYS_L", 2);
		}
		
	}, {
		hidden: true,
		field: "EFFDAYSL_D3",
		title: getEffDaysConfiguration()[2]+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_LEG_EFF_DAYS_L_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysDayTemplate(dataItem, "EFFDAYSL_D", "LEG_HOL_DAYS_L", 3);
		}
		
	}, {
		hidden: true,
		field: "EFFDAYSL_D4",
		title: getEffDaysConfiguration()[3]+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_LEG_EFF_DAYS_L_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysDayTemplate(dataItem, "EFFDAYSL_D", "LEG_HOL_DAYS_L", 4);
		}
		
	}, {
		hidden: true,
		field: "EFFDAYSL_D5",
		title: getEffDaysConfiguration()[4]+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 20,
		headerAttributes: {
      		  title:HEADER_LEG_EFF_DAYS_L_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysDayTemplate(dataItem, "EFFDAYSL_D", "LEG_HOL_DAYS_L", 5);
		}
		
	}, {
		hidden: true,
		field: "EFFDAYSL_D6",
		title: getEffDaysConfiguration()[5]+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_LEG_EFF_DAYS_L_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysDayTemplate(dataItem, "EFFDAYSL_D", "LEG_HOL_DAYS_L", 6);
		}
		
	}, {
		hidden: true,
		field: "EFFDAYSL_D7",
		title: getEffDaysConfiguration()[6]+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_LEG_EFF_DAYS_L_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysDayTemplate(dataItem, "EFFDAYSL_D", "LEG_HOL_DAYS_L", 7);
		}
		
	},  {
		hidden: true,
		field: "EFFWEEKSL_W1",
		title: HEADER_W1+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_LEG_EFF_WEEKS_L_TOOLTIP
      	  },
      	  template: function(dataItem) {
      	  	return applyEffectiveDaysWeekTemplate(dataItem, "EFFWEEKSL_W", 1);			
		}
		
	}, {
		hidden: true,
		field: "EFFWEEKSL_W2",
		title: HEADER_W2+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_LEG_EFF_WEEKS_L_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysWeekTemplate(dataItem, "EFFWEEKSL_W", 2);
		}
		
	}, {
		hidden: true,
		field: "EFFWEEKSL_W3",
		title: HEADER_W3+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_LEG_EFF_WEEKS_L_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysWeekTemplate(dataItem, "EFFWEEKSL_W", 3);
		}
		
	}, {
		hidden: true,
		field: "EFFWEEKSL_W4",
		title: HEADER_W4+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_LEG_EFF_WEEKS_L_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysWeekTemplate(dataItem, "EFFWEEKSL_W", 4);
		}
		
	}, {
		hidden: true,
		field: "EFFWEEKSL_W5",
		title: HEADER_W5+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_LEG_EFF_WEEKS_L_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysWeekTemplate(dataItem, "EFFWEEKSL_W", 5);
		}			
	}, {
		hidden:true,
		field: "LOCAL_DAYS",
		title: HEADER_LEG_EFF_DAYS_L,
		attributes:  { style:"text-align:center;" },
		width: 120,
		headerAttributes: {
    		  title:HEADER_LEG_EFF_DAYS_L_TOOLTIP
    	  },
      	  template: function(dataItem) {
      		if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + parent.getEffDaysStringFromSystemSetting(dataItem, "LOCAL_DAYS") +'</span>';
			}else {
				return parent.getEffDaysStringFromSystemSetting(dataItem, "LOCAL_DAYS");
			}
  		}	
	}, {
		hidden:!isLocalTimeFlag(),
		field: "KEYWORD_EFFDT_L",
		title: HEADER_LEG_KEY_EFF_DAYS_L,
		attributes:  { style:"text-align:left;" },
		width: 175,
		headerAttributes: {
    		  title:HEADER_LEG_KEY_EFF_DAYS_L_TOOLTIP
    	  },
    	  template: function(dataItem) {
				if(dataItem.CHANGE_FLAG == "D") {
					return '<span style="color:#ff0000">' + dataItem.KEYWORD_EFFDT_L +'</span>';
				}else {
					return dataItem.KEYWORD_EFFDT_L;
				}
			}
	}, {
		hidden:true,
		field: "FULL_EFFDT_L",
		title: HEADER_WEEK_EFF_DAYS_L,
		attributes:  { style:"text-align:left;" },
		width: 175,
		headerAttributes: {
    		  title:HEADER_WEEK_EFF_DAYS_L_TOOLTIP
    	  },
    	  template: function(dataItem) {
				if(dataItem.CHANGE_FLAG == "D") {
					return '<span style="color:#ff0000">' + parent.getEffDaysStringFromSystemSetting(dataItem, "FULL_EFFDT_L", true) +'</span>';
				}else {
					return parent.getEffDaysStringFromSystemSetting(dataItem, "FULL_EFFDT_L", true);
				}
			}
	}, {
		hidden:!isLocalTimeFlag(),
		field: "NOOP_DAYS_L",
		title: HEADER_LEG_NO_OPS_L,
		attributes:  { style:"text-align:center;" },
		template: calenderRowTemplateL,
		width: 60,
		headerAttributes: {
      		  title:HEADER_NO_OPS_TOOLTIP
      	  },
      	  template: function(dataItem) {
				var noopStr = getNoOpString(dataItem.NOOP_DAYS_L);
				if(dataItem.CHANGE_FLAG == "D") {
					return '<span style="color:#ff0000">' + noopStr +'</span>';
				}else {
					return noopStr;
				}
			}	
	}, {
		hidden:!isLocalTimeFlag(),
		field: "LEG_HOL_DAYS_L",
		title: HEADER_LEG_HOL_DAYS_L,
		attributes:  { style:"text-align:center;" },
		width: 65,
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + dataItem.LEG_HOL_DAYS_L +'</span>';
			}else {
				return dataItem.LEG_HOL_DAYS_L;
			}
		},
		headerAttributes: {
      		  title:HEADER_LEG_HOL_DAYS_L_TOOLTIP
      	  }
	}, {
		hidden:!isLocalTimeFlag(),
		field: "CAL_BUTTON_L",
		title: "&nbsp;",
		template: calenderRowTemplateL,
		filterable:false,
		sortable:false,
		width: 25
	}, {
		hidden:true,
		field: "RTEEFFDAYSZ_D1",
		title: getEffDaysConfiguration()[0]+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_ROUTE_EFF_DAYS_Z_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysDayTemplate(dataItem, "RTEEFFDAYSZ_D", "ROUTE_HOL_DAYS_Z", 1);
		}
		
	}, {
		hidden:true,
		field: "RTEEFFDAYSZ_D2",
		title: getEffDaysConfiguration()[1]+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_ROUTE_EFF_DAYS_Z_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysDayTemplate(dataItem, "RTEEFFDAYSZ_D", "ROUTE_HOL_DAYS_Z", 2);
		}
		
	}, {
		hidden:true,
		field: "RTEEFFDAYSZ_D3",
		title: getEffDaysConfiguration()[2]+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_ROUTE_EFF_DAYS_Z_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysDayTemplate(dataItem, "RTEEFFDAYSZ_D", "ROUTE_HOL_DAYS_Z", 3);
		}
		
	}, {
		hidden:true,
		field: "RTEEFFDAYSZ_D4",
		title: getEffDaysConfiguration()[3]+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_ROUTE_EFF_DAYS_Z_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysDayTemplate(dataItem, "RTEEFFDAYSZ_D", "ROUTE_HOL_DAYS_Z", 4);
		}
		
	}, {
		hidden:true,
		field: "RTEEFFDAYSZ_D5",
		title: getEffDaysConfiguration()[4]+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 20,
		headerAttributes: {
      		  title:HEADER_ROUTE_EFF_DAYS_Z_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysDayTemplate(dataItem, "RTEEFFDAYSZ_D", "ROUTE_HOL_DAYS_Z", 5);
		}
		
	}, {
		hidden:true,
		field: "RTEEFFDAYSZ_D6",
		title: getEffDaysConfiguration()[5]+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_ROUTE_EFF_DAYS_Z_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysDayTemplate(dataItem, "RTEEFFDAYSZ_D", "ROUTE_HOL_DAYS_Z", 6);
		}
		
	}, {
		hidden:true,
		field: "RTEEFFDAYSZ_D7",
		title: getEffDaysConfiguration()[6]+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_ROUTE_EFF_DAYS_Z_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysDayTemplate(dataItem, "RTEEFFDAYSZ_D", "ROUTE_HOL_DAYS_Z", 7);
		}
		
	}, {
		hidden:true,
		field: "RTEEFFWEEKSZ_W1",
		title: HEADER_W1+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_ROUTE_EFF_WEEKS_Z_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysWeekTemplate(dataItem, "RTEEFFWEEKSZ_W", 1);
		}
		
	}, {
		hidden:true,
		field: "RTEEFFWEEKSZ_W2",
		title: HEADER_W2+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_ROUTE_EFF_WEEKS_Z_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysWeekTemplate(dataItem, "RTEEFFWEEKSZ_W", 2);
		}
		
	}, {
		hidden:true,
		field: "RTEEFFWEEKSZ_W3",
		title: HEADER_W3+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_ROUTE_EFF_WEEKS_Z_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysWeekTemplate(dataItem, "RTEEFFWEEKSZ_W", 3);
		}
		
	}, {
		hidden:true,
		field: "RTEEFFWEEKSZ_W4",
		title: HEADER_W4+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_ROUTE_EFF_WEEKS_Z_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysWeekTemplate(dataItem, "RTEEFFWEEKSZ_W", 4);
		}
		
	}, {
		hidden: true,
		field: "RTEEFFWEEKSZ_W5",
		title: HEADER_W5+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_ROUTE_EFF_WEEKS_Z_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysWeekTemplate(dataItem, "RTEEFFWEEKSZ_W", 5);
		}			
	}, {
		hidden:true,
		field: "ROUTE_ZULU_DAYS",
		title: HEADER_ROUTE_EFF_DAYS_Z,
		attributes:  { style:"text-align:center;" },
		width: 120,
		headerAttributes: {
  		  title:HEADER_ROUTE_EFF_DAYS_Z_TOOLTIP
  	  },
  	  template: function(dataItem) {
  		if(dataItem.CHANGE_FLAG == "D") {
			return '<span style="color:#ff0000">' + parent.getEffDaysStringFromSystemSetting(dataItem, "ROUTE_ZULU_DAYS") +'</span>';
		}else {
			return parent.getEffDaysStringFromSystemSetting(dataItem, "ROUTE_ZULU_DAYS");
		}
	  }
	}, {
		hidden:isLocalTimeFlag(),
		field: "ROUTE_KEYWORD_EFFDT_Z",
		title: HEADER_ROUTE_KEY_EFF_DAYS_Z,
		attributes:  { style:"text-align:left;" },
		width: 175,
		headerAttributes: {
    		  title:HEADER_ROUTE_KEY_EFF_DAYS_Z_TOOLTIP
    	  },
    	  template: function(dataItem) {
				if(dataItem.CHANGE_FLAG == "D") {
					return '<span style="color:#ff0000">' + dataItem.ROUTE_KEYWORD_EFFDT_Z +'</span>';
				}else {
					return dataItem.ROUTE_KEYWORD_EFFDT_Z;
				}
			}
	}, {
		hidden:true,
		field: "ROUTE_FULL_EFFDT_Z",
		title: HEADER_ROUTE_WEEK_EFF_DAYS_Z,
		attributes:  { style:"text-align:left;" },
		width: 175,
		headerAttributes: {
    		  title:HEADER_ROUTE_WEEK_EFF_DAYS_Z_TOOLTIP
    	  },
    	  template: function(dataItem) {
				if(dataItem.CHANGE_FLAG == "D") {
					return '<span style="color:#ff0000">' + parent.getEffDaysStringFromSystemSetting(dataItem, "ROUTE_FULL_EFFDT_Z", true) +'</span>';
				}else {
					return parent.getEffDaysStringFromSystemSetting(dataItem, "ROUTE_FULL_EFFDT_Z", true);
				}
			}
	}, {
		hidden:isLocalTimeFlag(),
		field: "ROUTE_NOOP_DAYS_Z",
		title: HEADER_ROUTE_NO_OPS_Z,
		attributes:  { style:"text-align:center;" },
		template: calenderRowTemplateZ,
		width: 60,
		headerAttributes: {
      		  title:HEADER_NO_OPS_TOOLTIP
      	  },
      	  template: function(dataItem) {
				var onOpStr = getNoOpString(dataItem.ROUTE_NOOP_DAYS_Z); 
				if(dataItem.CHANGE_FLAG == "D") {
					return '<span style="color:#ff0000">' + onOpStr +'</span>';
				}else {
					return onOpStr;
				}
			}	
	}, {
		hidden:isLocalTimeFlag(),
		field: "ROUTE_HOL_DAYS_Z",
		title: HEADER_ROUTE_HOL_DAYS_Z,
		attributes:  { style:"text-align:center;" },
		width: 60,
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + dataItem.ROUTE_HOL_DAYS_Z +'</span>';
			}else {
				return dataItem.ROUTE_HOL_DAYS_Z;
			}
		},
		headerAttributes: {
      		  title:HEADER_ROUTE_HOL_DAYS_Z_TOOLTIP
      	  }
	}, {
		hidden:isLocalTimeFlag(),
		field: "CAL_BUTTON_ROUTE_Z",
		title: "&nbsp;",
		template: calenderRouteRowTemplateZ,
		filterable:false,
		sortable:false,
		width: 25
	}, {
		hidden:true,
		field: "EFFDAYSZ_D1",
		title: getEffDaysConfiguration()[0]+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_LEG_EFF_DAYS_Z_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysDayTemplate(dataItem, "EFFDAYSZ_D", "LEG_HOL_DAYS_Z", 1);
		}
		
	}, {
		hidden:true,
		field: "EFFDAYSZ_D2",
		title: getEffDaysConfiguration()[1]+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_LEG_EFF_DAYS_Z_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysDayTemplate(dataItem, "EFFDAYSZ_D", "LEG_HOL_DAYS_Z", 2);
		}
		
	}, {
		hidden:true,
		field: "EFFDAYSZ_D3",
		title: getEffDaysConfiguration()[2]+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_LEG_EFF_DAYS_Z_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysDayTemplate(dataItem, "EFFDAYSZ_D", "LEG_HOL_DAYS_Z", 3);
		}
		
	}, {
		hidden:true,
		field: "EFFDAYSZ_D4",
		title: getEffDaysConfiguration()[3]+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_LEG_EFF_DAYS_Z_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysDayTemplate(dataItem, "EFFDAYSZ_D", "LEG_HOL_DAYS_Z", 4);
		}
		
	}, {
		hidden:true,
		field: "EFFDAYSZ_D5",
		title: getEffDaysConfiguration()[4]+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 20,
		headerAttributes: {
      		  title:HEADER_LEG_EFF_DAYS_Z_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysDayTemplate(dataItem, "EFFDAYSZ_D", "LEG_HOL_DAYS_Z", 5);
		}
		
	}, {
		hidden:true,
		field: "EFFDAYSZ_D6",
		title: getEffDaysConfiguration()[5]+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_LEG_EFF_DAYS_Z_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysDayTemplate(dataItem, "EFFDAYSZ_D", "LEG_HOL_DAYS_Z", 6);
		}
		
	}, {
		hidden:true,
		field: "EFFDAYSZ_D7",
		title: getEffDaysConfiguration()[6]+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_LEG_EFF_DAYS_Z_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysDayTemplate(dataItem, "EFFDAYSZ_D", "LEG_HOL_DAYS_Z", 7);
		}
		
	}, {
		hidden:true,
		field: "EFFWEEKSZ_W1",
		title: HEADER_W1+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_LEG_EFF_WEEKS_Z_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysWeekTemplate(dataItem, "EFFWEEKSZ_W", 1);
		}
		
	}, {
		hidden:true,
		field: "EFFWEEKSZ_W2",
		title: HEADER_W2+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_LEG_EFF_WEEKS_Z_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysWeekTemplate(dataItem, "EFFWEEKSZ_W", 2);
		}
		
	}, {
		hidden:true,
		field: "EFFWEEKSZ_W3",
		title: HEADER_W3+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_LEG_EFF_WEEKS_Z_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysWeekTemplate(dataItem, "EFFWEEKSZ_W", 3);
		}
		
	}, {
		hidden:true,
		field: "EFFWEEKSZ_W4",
		title: HEADER_W4+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_LEG_EFF_WEEKS_Z_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysWeekTemplate(dataItem, "EFFWEEKSZ_W", 4);
		}
		
	}, {
		hidden: true,
		field: "EFFWEEKSZ_W5",
		title: HEADER_W5+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_LEG_EFF_WEEKS_Z_TOOLTIP
      	  },
      	  template: function(dataItem) {
			return applyEffectiveDaysWeekTemplate(dataItem, "EFFWEEKSZ_W", 5);
		}			
	}, {
		hidden:true,
		field: "ZULU_DAYS",
		title: HEADER_LEG_EFF_DAYS_Z,
		attributes:  { style:"text-align:center;" },
		width: 120,
		headerAttributes: {
  		  title:HEADER_LEG_EFF_DAYS_Z_TOOLTIP
  	  },
  	  template: function(dataItem) {
  		if(dataItem.CHANGE_FLAG == "D") {
			return '<span style="color:#ff0000">' + parent.getEffDaysStringFromSystemSetting(dataItem, "ZULU_DAYS") +'</span>';
		}else {
			return parent.getEffDaysStringFromSystemSetting(dataItem, "ZULU_DAYS");
		}
	  }
	}, {
		hidden:isLocalTimeFlag(),
		field: "KEYWORD_EFFDT_Z",
		title: HEADER_LEG_KEY_EFF_DAYS_Z,
		attributes:  { style:"text-align:left;" },
		width: 175,
		headerAttributes: {
    		  title:HEADER_LEG_KEY_EFF_DAYS_Z_TOOLTIP
    	  },
    	  template: function(dataItem) {
				if(dataItem.CHANGE_FLAG == "D") {
					return '<span style="color:#ff0000">' + dataItem.KEYWORD_EFFDT_Z +'</span>';
				}else {
					return dataItem.KEYWORD_EFFDT_Z;
				}
			}
	}, {
		hidden:true,
		field: "FULL_EFFDT_Z",
		title: HEADER_WEEK_EFF_DAYS_Z,
		attributes:  { style:"text-align:left;" },
		width: 175,
		headerAttributes: {
    		  title:HEADER_WEEK_EFF_DAYS_Z_TOOLTIP
    	  },
    	  template: function(dataItem) {
				if(dataItem.CHANGE_FLAG == "D") {
					return '<span style="color:#ff0000">' + parent.getEffDaysStringFromSystemSetting(dataItem, "FULL_EFFDT_Z", true) +'</span>';
				}else {
					return parent.getEffDaysStringFromSystemSetting(dataItem, "FULL_EFFDT_Z", true);
				}
			}
	}, {
		hidden:isLocalTimeFlag(),
		field: "NOOP_DAYS_Z",
		title: HEADER_LEG_NO_OPS_Z,
		attributes:  { style:"text-align:center;" },
		template: calenderRowTemplateZ,
		width: 60,
		headerAttributes: {
      		  title:HEADER_NO_OPS_TOOLTIP
      	  },
      	  template: function(dataItem) {
				var onOpStr = getNoOpString(dataItem.NOOP_DAYS_Z); 
				if(dataItem.CHANGE_FLAG == "D") {
					return '<span style="color:#ff0000">' + onOpStr +'</span>';
				}else {
					return onOpStr;
				}
			}	
	}, {
		hidden:isLocalTimeFlag(),
		field: "LEG_HOL_DAYS_Z",
		title: HEADER_LEG_HOL_DAYS_Z,
		attributes:  { style:"text-align:center;" },
		width: 60,
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + dataItem.LEG_HOL_DAYS_Z +'</span>';
			}else {
				return dataItem.LEG_HOL_DAYS_Z;
			}
		},
		headerAttributes: {
      		  title:HEADER_LEG_HOL_DAYS_Z_TOOLTIP
      	  }
	}, {
		hidden:isLocalTimeFlag(),
		field: "CAL_BUTTON_Z",
		title: "&nbsp;",
		template: calenderRowTemplateZ,
		filterable:false,
		sortable:false,
		width: 25
	}, {
		field: "ORIGIN",
		title: HEADER_SCHEDULE_ORG,
		attributes:  { style:"text-align:center;" },
		width: 50,
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + dataItem.ORIGIN +'</span>';
			}else {
				return dataItem.ORIGIN;
			}
		},
		headerAttributes: {
      		  title:HEADER_SCHEDULE_ORG_TOOLTIP
      	  }
	},{
		field: "DESTINATION",
		title: HEADER_SCHEDULE_DEST,
		attributes:  { style:"text-align:center;" },
		width: 50,
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + dataItem.DESTINATION +'</span>';
			}else {
				return dataItem.DESTINATION;
			}
		},
		headerAttributes: {
      		  title:HEADER_SCHEDULE_DEST_TOOLTIP
      	  }
	},{
		hidden:!isLocalTimeFlag(),
		field: "LOCAL_DEP",
		title: HEADER_LOCAL_DEP,
		width: 50,
		format:"{0:HH:mm}", 
		filterable: { ui: timeFilter},
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + kendo.toString(dataItem.LOCAL_DEP,'HH:mm') +'</span>';
			}else {
				return kendo.toString(dataItem.LOCAL_DEP,'HH:mm');
			}
		},
		headerAttributes: {
      		  title:HEADER_LOCAL_DEP_TOOLTIP
      	  }
	},{
		hidden:isLocalTimeFlag(),
		field: "ZULU_DEP",
		title: HEADER_ZULU_DEP,
		attributes:  { style:"text-align:center;" },
		width: 50,
		format:"{0:HH:mm}", 
		filterable: { ui: timeFilter},
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + kendo.toString(dataItem.ZULU_DEP,'HH:mm') +'</span>';
			}else {
				return kendo.toString(dataItem.ZULU_DEP,'HH:mm');
			}
		},
		headerAttributes: {
      		  title:HEADER_LOCAL_DEP_TOOLTIP
      	  }
	},{
		hidden:!isLocalTimeFlag(),
		field: "B_OFFTIME_L",
		title: HEADER_OFF_L,
		attributes:  { style:"text-align:center;" },
		width: 50,
		format:"{0:HHmm}", 
		filterable: { ui: timeFilterInHHMM},
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + kendo.toString(dataItem.B_OFFTIME_L,'HHmm') +'</span>';
			}else {
				return kendo.toString(dataItem.B_OFFTIME_L,'HHmm');
			}
		},
		headerAttributes: {
      		  title:HEADER_OFF_L_TOOLTIP
      	  }
	},{
		hidden:isLocalTimeFlag(),
		field: "B_OFFTIME_Z",
		title: HEADER_OFF_Z,
		attributes:  { style:"text-align:center;" },
		width: 50,
		format:"{0:HHmm}", 
		filterable: { ui: timeFilterInHHMM},
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + kendo.toString(dataItem.B_OFFTIME_Z,'HHmm') +'</span>';
			}else {
				return kendo.toString(dataItem.B_OFFTIME_Z,'HHmm');
			}
		},
		headerAttributes: {
      		  title:HEADER_OFF_Z_TOOLTIP
      	  }
	},{
		hidden:!isLocalTimeFlag(),
		field: "ARRIVAL_DAY_L",
		title: HEADER_ADY_L,
		attributes:  { style:"text-align:center;" },
		width: 50,
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + dataItem.ARRIVAL_DAY_L +'</span>';
			}else {
				return dataItem.ARRIVAL_DAY_L;
			}
		},
		headerAttributes: {
      		  title:HEADER_ADY_L_TOOLTIP
      	  }
	},{ 
		hidden:isLocalTimeFlag(),
		field: "ARRIVAL_DAY_Z",
		title: HEADER_ADY_Z,
		attributes:  { style:"text-align:center;" },
		width: 50,
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + dataItem.ARRIVAL_DAY_Z +'</span>';
			}else {
				return dataItem.ARRIVAL_DAY_Z;
			}
		},
		headerAttributes: {
      		  title:HEADER_ADY_Z_TOOLTIP
      	  }
	},{
		hidden:!isLocalTimeFlag(),
		field: "LANDING_TIME_L",
		title: HEADER_LAND_TIME_L,
		attributes:  { style:"text-align:center;" },
		width: 50,
		format:"{0:HHmm}", 
		filterable: { ui: timeFilterInHHMM},
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + kendo.toString(dataItem.LANDING_TIME_L,'HHmm') +'</span>';
			}else {
				return kendo.toString(dataItem.LANDING_TIME_L,'HHmm');
			}
		},
		headerAttributes: {
      		  title:HEADER_LAND_TIME_TOOLTIP
      	  }
	},{
		hidden:isLocalTimeFlag(),
		field: "LANDING_TIME_Z",
		title: HEADER_LAND_TIME_Z,
		attributes:  { style:"text-align:center;" },
		width: 40,
		format:"{0:HHmm}", 
		filterable: { ui: timeFilterInHHMM},
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + kendo.toString(dataItem.LANDING_TIME_Z,'HHmm') +'</span>';
			}else {
				return kendo.toString(dataItem.LANDING_TIME_Z,'HHmm');
			}
		},
		headerAttributes: {
      		  title:HEADER_LAND_TIME_TOOLTIP
      	  }
	},{
		hidden:!isLocalTimeFlag(),
		field: "LOCAL_ARR",
		title: HEADER_LOCAL_ARR,
		attributes:  { style:"text-align:center;" },
		width: 50,
		format:"{0:HH:mm}", 
		filterable: { ui: timeFilter},
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + kendo.toString(dataItem.LOCAL_ARR,'HH:mm') +'</span>';
			}else {
				return kendo.toString(dataItem.LOCAL_ARR,'HH:mm');
			}
		},
		headerAttributes: {
      		  title:HEADER_LOCAL_ARR_TOOLTIP
      	  }
	},{
		hidden:isLocalTimeFlag(),
		field: "ZULU_ARR",
		title: HEADER_ZULU_ARR,
		attributes:  { style:"text-align:center;" },
		width: 50,
		format:"{0:HH:mm}", 
		filterable: { ui: timeFilter},
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + kendo.toString(dataItem.ZULU_ARR,'HH:mm') +'</span>';
			}else {
				return kendo.toString(dataItem.ZULU_ARR,'HH:mm');
			}
		},
		headerAttributes: {
      		  title:HEADER_LOCAL_ARR_TOOLTIP
      	  }
	},{
		field: "LOC_GRND_TIME",
		width: 50,
		title: HEADER_GRND_TIME,
		attributes:  { style:"text-align:center;" },
		format:"{0:HHmm}", 
		filterable: { ui: timeFilterInHHMM},
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + kendo.toString(dataItem.LOC_GRND_TIME,'HHmm') +'</span>';
			}else {
				return kendo.toString(dataItem.LOC_GRND_TIME,'HHmm');
			}
		},
		headerAttributes: {
      		  title:HEADER_GRND_TIME_TOOLTIP
      	  }
	},{
		field: "BLOCK_TIME_Z",
		attributes:  { style:"text-align:center;" },
		title: HEADER_BLOCK_SCH,
		width: 50,
		format:"{0:HHmm}", 
		filterable: { ui: timeFilterInHHMM},
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + kendo.toString(dataItem.BLOCK_TIME_Z,'HHmm') +'</span>';
			}else {
				return kendo.toString(dataItem.BLOCK_TIME_Z,'HHmm');
			}
		},
		headerAttributes: {
      		  title:HEADER_BLOCK_SCH_TOOLTIP
      	  }
	},{
		field: "FLIGHT_MINS",
		title: HEADER_FLIGHT,
		attributes:  { style:"text-align:center;" },
		width: 50,
		format:"{0:HHmm}", 
		filterable: { ui: timeFilterInHHMM},
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + kendo.toString(dataItem.FLIGHT_MINS,'HHmm') +'</span>';
			}else {
				return kendo.toString(dataItem.FLIGHT_MINS,'HHmm');
			}
		},
		headerAttributes: {
      		  title:HEADER_FLIGHT_TOOLTIP
      	  }
	},{
		field: "ALLOC_FLAG",
		title: HEADER_ALLOC_FLAG,
		attributes:  { style:"text-align:center;" },
		width: 40,
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + dataItem.ALLOC_FLAG +'</span>';
			}else {
				return dataItem.ALLOC_FLAG;
			}
		},
		headerAttributes: {
      		  title:HEADER_ALLOC_FLAG_TOOLTIP
      	  }
	},{
		field: "LAST_UPDT_TIME",
		title: HEADER_LAST_UPDT_TIME,
		attributes:  { style:"text-align:center;" },
		width: 70,
		format:"{0:yyyy-MM-dd HH:mm}", 
		filterable: { ui: dateTimeFilter},
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + kendo.toString(dataItem.LAST_UPDT_TIME,'yyyy-MM-dd HH:mm') +'</span>';
			}else {
				return kendo.toString(dataItem.LAST_UPDT_TIME,'yyyy-MM-dd HH:mm');
			}
		},
		headerAttributes: {
      		  title:HEADER_LAST_UPDT_TIME_TOOLTIP
      	  }
	},{
		field: "LAST_USER",
		title: HEADER_LAST_CHG_USER,
		attributes:  { style:"text-align:center;" },
		width: 75,
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + dataItem.LAST_USER +'</span>';
			}else {
				return dataItem.LAST_USER;
			}
		},
		headerAttributes: {
      		  title:HEADER_LAST_CHG_USER_TOOLTIP
      	  }
	},{
		field: "CHANGE_FLAG",
		title: HEADER_CHANGE_FLAG,
		attributes:  { style:"text-align:center;" },
		width: 65,
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + dataItem.CHANGE_FLAG +'</span>';
			}else {
				return dataItem.CHANGE_FLAG;
			}
		},
		headerAttributes: {
      		  title:HEADER_CHANGE_FLAG_TOOLTIP
      	  }
	},{
		field: "LEG_MILES",
		title: HEADER_LEG_MILES,
		attributes:  { style:"text-align:center;" },
		width: 50,
		template: function(dataItem) {
			var distance = dataItem.LEG_MILES;
			if(isDistanceInKmsFlag()) {
				distance = distance * MILES_TO_KM_VALUE;
			}
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + kendo.toString(distance, 'n0') +'</span>';
			}else {
				return kendo.toString(distance, 'n0');
			}
		},
		headerAttributes: {
      		  title:HEADER_LEG_MILES_TOOLTIP
      	  }
	},{
		field: "LEG_KMS",
		title: HEADER_LEG_KMS,
		attributes:  { style:"text-align:center;" },
		width: 50,
		template: function(dataItem) {
			
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + kendo.toString(dataItem.LEG_KMS, 'n0') +'</span>';
			}else {
				return kendo.toString(dataItem.LEG_KMS, 'n0');
			}
		},
		headerAttributes: {
      		  title:HEADER_LEG_KMS_TOOLTIP
      	  }
	},{
		field: "FLIGHT_CD",
		title: HEADER_FLIGHT_HST_CD,
		attributes:  { style:"text-align:center;" },
		width: 55,
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + dataItem.FLIGHT_CD +'</span>';
			}else {
				return dataItem.FLIGHT_CD;
			}
		},
		headerAttributes: {
      		  title:HEADER_FLIGHT_HST_CD_TOOLTIP
      	  }
	},{
		field: "TAXI_OUT_MIN_Z",
		title: HEADER_TAXIOUT_MIN_Z,
		attributes:  { style:"text-align:center;" },
		width: 50,
		format:"{0:HHmm}", 
		filterable: { ui: timeFilterInHHMM},
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + kendo.toString(dataItem.TAXI_OUT_MIN_Z,'HHmm') +'</span>';
			}else {
				return kendo.toString(dataItem.TAXI_OUT_MIN_Z,'HHmm');
			}
		},
		headerAttributes: {
      		  title:HEADER_TAXIOUT_MIN_Z_TOOLTIP
      	  }
	},{
		field: "TAXI_OUT",
		title: HEADER_TAXIOUT_CD,
		attributes:  { style:"text-align:center;" },
		width: 50,
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + dataItem.TAXI_OUT +'</span>';
			}else {
				return dataItem.TAXI_OUT;
			}
		},
		headerAttributes: {
      		  title:HEADER_TAXIOUT_CD_TOOLTIP
      	  }
	},{
		field: "TAXI_IN_MIN_Z",
		title: HEADER_TAXIIN_MIN_Z,
		attributes:  { style:"text-align:center;" },
		width: 50,
		format:"{0:HHmm}", 
		filterable: { ui: timeFilterInHHMM},
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + kendo.toString(dataItem.TAXI_IN_MIN_Z,'HHmm') +'</span>';
			}else {
				return kendo.toString(dataItem.TAXI_IN_MIN_Z,'HHmm');
			}
		},
		headerAttributes: {
      		  title:HEADER_TAXIIN_MIN_Z_TOOLTIP
      	  }
	},{
		field: "TAXI_IN",
		title: HEADER_TAXIIN_CD,
		attributes:  { style:"text-align:center;" },
		width: 40,
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + dataItem.TAXI_IN +'</span>';
			}else {
				return dataItem.TAXI_IN;
			}
		},
		headerAttributes: {
      		  title:HEADER_TAXIIN_CD_TOOLTIP
      	  }
	},{
		field: "FREQ",
		title: HEADER_FREQ,
		attributes:  { style:"text-align:center;" },
		width: 30,
		headerAttributes: {
      		  title:HEADER_FREQ_TOOLTIP
      	  },
	       	 template: function(dataItem) {
					if(dataItem.CHANGE_FLAG == "D") {
						return '<span style="color:#ff0000">' + dataItem.FREQ +'</span>';
					}else {
						return dataItem.FREQ;
					}
				}
	},{
		hidden:!isLocalTimeFlag(),
		field: "TOTAL_FREQ_1",
		title: HEADER_TTL+getEffDaysConfiguration()[0]+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 50,
		headerAttributes: {
      		  title:HEADER_TTL_TOOLTIP
      	  },
	       	 template: function(dataItem) {
					return applyTotalFltFreqTemplate(dataItem, "TOTAL_FREQ_", 1);
				}
	},{
		hidden:!isLocalTimeFlag(),
		field: "TOTAL_FREQ_2",
		title: HEADER_TTL+getEffDaysConfiguration()[1]+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 45,
		headerAttributes: {
      		  title:HEADER_TTL_TOOLTIP
      	  },
	       	 template: function(dataItem) {
					return applyTotalFltFreqTemplate(dataItem, "TOTAL_FREQ_", 2);
				}
	},{
		hidden:!isLocalTimeFlag(),
		field: "TOTAL_FREQ_3",
		title: HEADER_TTL+getEffDaysConfiguration()[2]+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 50,
		headerAttributes: {
      		  title:HEADER_TTL_TOOLTIP
      	  },
	       	 template: function(dataItem) {
					return applyTotalFltFreqTemplate(dataItem, "TOTAL_FREQ_", 3);
				}
	},{
		hidden:!isLocalTimeFlag(),
		field: "TOTAL_FREQ_4",
		title: HEADER_TTL+getEffDaysConfiguration()[3]+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 45,
		headerAttributes: {
      		  title:HEADER_TTL_TOOLTIP
      	  },
	       	 template: function(dataItem) {
					return applyTotalFltFreqTemplate(dataItem, "TOTAL_FREQ_", 4);
				}
	},{
		hidden:!isLocalTimeFlag(),
		field: "TOTAL_FREQ_5",
		title: HEADER_TTL+getEffDaysConfiguration()[4]+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 45,
		headerAttributes: {
      		  title:HEADER_TTL_TOOLTIP
      	  },
	       	 template: function(dataItem) {
					return applyTotalFltFreqTemplate(dataItem, "TOTAL_FREQ_", 5);
				}
	},{
		hidden:!isLocalTimeFlag(),
		field: "TOTAL_FREQ_6",
		title: HEADER_TTL+getEffDaysConfiguration()[5]+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 45,
		headerAttributes: {
      		  title:HEADER_TTL_TOOLTIP
      	  },
	       	 template: function(dataItem) {
					return applyTotalFltFreqTemplate(dataItem, "TOTAL_FREQ_", 6);
				}
	},{
		hidden:!isLocalTimeFlag(),
		field: "TOTAL_FREQ_7",
		title: HEADER_TTL+getEffDaysConfiguration()[6]+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 45,
		headerAttributes: {
      		  title:HEADER_TTL_TOOLTIP
      	  },
	       	 template: function(dataItem) {
					return applyTotalFltFreqTemplate(dataItem, "TOTAL_FREQ_", 7);
				}
	},{
		hidden:isLocalTimeFlag(),
		field: "TOTAL_FREQZ_1",
		title: HEADER_TTL+getEffDaysConfiguration()[0]+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 50,
		headerAttributes: {
      		  title:HEADER_TTL_TOOLTIP
      	  },
	       	 template: function(dataItem) {
					return applyTotalFltFreqTemplate(dataItem, "TOTAL_FREQZ_", 1);
				}
	},{
		hidden:isLocalTimeFlag(),
		field: "TOTAL_FREQZ_2",
		title: HEADER_TTL+getEffDaysConfiguration()[1]+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 45,
		headerAttributes: {
      		  title:HEADER_TTL_TOOLTIP
      	  },
	       	 template: function(dataItem) {
					return applyTotalFltFreqTemplate(dataItem, "TOTAL_FREQZ_", 2);
				}
	},{
		hidden:isLocalTimeFlag(),
		field: "TOTAL_FREQZ_3",
		title: HEADER_TTL+getEffDaysConfiguration()[2]+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 50,
		headerAttributes: {
      		  title:HEADER_TTL_TOOLTIP
      	  },
	       	 template: function(dataItem) {
					return applyTotalFltFreqTemplate(dataItem, "TOTAL_FREQZ_", 3);
				}
	},{
		hidden:isLocalTimeFlag(),
		field: "TOTAL_FREQZ_4",
		title: HEADER_TTL+getEffDaysConfiguration()[3]+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 45,
		headerAttributes: {
      		  title:HEADER_TTL_TOOLTIP
      	  },
	       	 template: function(dataItem) {
					return applyTotalFltFreqTemplate(dataItem, "TOTAL_FREQZ_", 4);
				}
	},{
		hidden:isLocalTimeFlag(),
		field: "TOTAL_FREQZ_5",
		title: HEADER_TTL+getEffDaysConfiguration()[4]+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 45,
		headerAttributes: {
      		  title:HEADER_TTL_TOOLTIP
      	  },
	       	 template: function(dataItem) {
					return applyTotalFltFreqTemplate(dataItem, "TOTAL_FREQZ_", 5);
				}
	},{
		hidden:isLocalTimeFlag(),
		field: "TOTAL_FREQZ_6",
		title: HEADER_TTL+getEffDaysConfiguration()[5]+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 45,
		headerAttributes: {
      		  title:HEADER_TTL_TOOLTIP
      	  },
	       	 template: function(dataItem) {
					return applyTotalFltFreqTemplate(dataItem, "TOTAL_FREQZ_", 6);
				}
	},{
		hidden:isLocalTimeFlag(),
		field: "TOTAL_FREQZ_7",
		title: HEADER_TTL+getEffDaysConfiguration()[6]+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 45,
		headerAttributes: {
      		  title:HEADER_TTL_TOOLTIP
      	  },
	       	 template: function(dataItem) {
					return applyTotalFltFreqTemplate(dataItem, "TOTAL_FREQZ_", 7);
				}
	},{
		field: "FLIGHT_COUNT",
		title: HEADER_FLIGHT_COUNT,
		attributes:  { style:"text-align:center;" },
		width: 30,
		headerAttributes: {
      		  title:HEADER_FLIGHT_COUNT_TOOLTIP
      	  },
	       	 template: function(dataItem) {
					if(dataItem.CHANGE_FLAG == "D") {
						return '<span style="color:#ff0000">' + dataItem.FLIGHT_COUNT +'</span>';
					}else {
						return dataItem.FLIGHT_COUNT;
					}
				}
	}, {
		field: "COMMENTS",
		title: HEADER_COMMENTS,
		attributes:  { style:"text-align:center;padding:0px !important" },
		width: 90,
		template: function(dataItem) {
			if (dataItem.COMMENTS == "") {
				return "";
			}
			var commObj = jQuery.parseJSON( dataItem.COMMENTS);
			var commentsText = "";
			if (commObj != null) {
				commentsText = commObj[0].commentDesc;
			}
			
			if (commentsText == "") {
				return "";
			}
			if(dataItem.CHANGE_FLAG == "D") {
				return '<table cellpadding="0" cellspacing="0" border="0"><tr><td style="border:0;color:#ff0000"><a href="#" style="text-decoration: none"><font color="#ff0000">' + commentsText + '</font></a></td><td style="width: 7px;padding: 0 !important;border:0;"><img src="'+IOCN_IMAGE_PATH_COMMENT+'" style="vertical-align: top;"></td></tr></table>';
			}else {
				return '<table cellpadding="0" cellspacing="0" border="0"><tr><td style="border:0;color:#376092"><a href="#" style="text-decoration: none"><font color="#376092">' + commentsText + '</font></a></td><td style="width: 7px;padding: 0 !important;border:0;"><img src="'+IOCN_IMAGE_PATH_COMMENT+'" style="vertical-align: top;"></td></tr></table>';
			}
		},
		headerAttributes: {
      		  title:HEADER_COMMENTS_TOOLTIP
      	  }
	},{
		field: "CARRIER_DESC",
		title: HEADER_CARRIER,
		attributes:  { style:"text-align:center;" },
		width: 50,
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + dataItem.CARRIER_DESC +'</span>';
			}else {
				return dataItem.CARRIER_DESC;
			}
		},
		headerAttributes: {
      		  title:HEADER_CARRIER
      	  }
	},{
		field: "MODE",
		title: HEADER_MODE,
		attributes:  { style:"text-align:center;" },
		width: 40,
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + dataItem.MODE +'</span>';
			}else {
				return dataItem.MODE;
			}
		},
		headerAttributes: {
      		  title:HEADER_MODE_TOOLTIP
      	  }
	},{
		hidden:true,
		field: "OPERATING_COST",
		title: HEADER_OPERATING_COST,
		attributes:  { style:"text-align:center;" },
		width: 40,
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + dataItem.OPERATING_COST +'</span>';
			}else {
				return dataItem.OPERATING_COST;
			}
		},
		headerAttributes: {
      		  title:HEADER_OPERATING_COST_TOOLTIP
      	  }
	},{
		field: "SCAC_CD",
		title: HEADER_SCAC_CD,
		attributes:  { style:"text-align:center;" },
		width: 40,
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + dataItem.SCAC_CD +'</span>';
			}else {
				return dataItem.SCAC_CD;
			}
		},
		headerAttributes: {
      		  title:HEADER_SCAC_CD_TOOLTIP
      	  }
	},{
		field: "IATA_MV_NBR",
		title: HEADER_IATA_MV_NBR,
		attributes:  { style:"text-align:center;" },
		width: 50,
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + dataItem.IATA_MV_NBR +'</span>';
			}else {
				return dataItem.IATA_MV_NBR;
			}
		},
		headerAttributes: {
      		  title:HEADER_IATA_MV_NBR_TOOLTIP
      	  }
	},{
		field: "IN_DST",
		title: HEADER_IN_DST,
		attributes:  { style:"text-align:center;" },
		width: 40,
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + dataItem.IN_DST +'</span>';
			}else {
				return dataItem.IN_DST;
			}
		},
		headerAttributes: {
      		  title:HEADER_IN_DST_TOOLTIP
      	  }
	},{
		field: "TEMP_RT",
		title: HEADER_TEMP_RT,
		attributes:  { style:"text-align:center;" },
		width: 40,
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + dataItem.TEMP_RT +'</span>';
			}else {
				return dataItem.TEMP_RT;
			}
		},
		headerAttributes: {
      		  title:HEADER_TEMP_RT_TOOLTIP
      	  }
	},{
		field: "BAL_MV_NBR",
		title: HEADER_BAL_MV_NBR,
		attributes:  { style:"text-align:center;" },
		width: 50,
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + dataItem.BAL_MV_NBR +'</span>';
			}else {
				return dataItem.BAL_MV_NBR;
			}
		},
		headerAttributes: {
      		  title:HEADER_BAL_MV_NBR_TOOLTIP
      	  }
	},{
		field: "MPH",
		title: HEADER_MPH,
		attributes:  { style:"text-align:center;" },
		width: 40,
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + dataItem.MPH +'</span>';
			}else {
				return dataItem.MPH;
			}
		},
		headerAttributes: {
      		  title:HEADER_MPH_TOOLTIP
      	  }
	},{
		field: "OWNER_LOC_CD",
		title: HEADER_OWNER_LOC_CD,
		attributes:  { style:"text-align:center;" },
		width: 65,
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + dataItem.OWNER_LOC_CD +'</span>';
			}else {
				return dataItem.OWNER_LOC_CD;
			}
		},
		headerAttributes: {
      		  title:HEADER_OWNER_LOC_CD_TOOLTIP
      	  }
	},{
		hidden: true,
		field: "GLOBAL_RGN_DESC",
		title: HEADER_GLOBAL_RGN_CD,
		attributes:  { style:"text-align:center;" },
		width: 90,
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + dataItem.GLOBAL_RGN_DESC +'</span>';
			}else {
				return dataItem.GLOBAL_RGN_DESC;
			}
		},
		headerAttributes: {
      		  title:HEADER_GLOBAL_RGN_CD_TOOLTIP
      	  }
	},{
		field: "REASON_CD",
		title: HEADER_REASON_CD,
		attributes:  { style:"text-align:center;" },
		width: 60,
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + dataItem.REASON_CD +'</span>';
			}else {
				return dataItem.REASON_CD;
			}
		},
		headerAttributes: {
      		  title:HEADER_REASON_CD_TOOLTIP
      	  }
	},{
		field: "CARRIER_STG_TM",
		title: HEADER_CARRIER_STG_TM,
		attributes:  { style:"text-align:center;" },
		width: 60,
		format:"{0:HHmm}", 
		filterable: { ui: timeFilterInHHMM},
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + kendo.toString(dataItem.CARRIER_STG_TM,'HHmm') +'</span>';
			}else {
				return kendo.toString(dataItem.CARRIER_STG_TM,'HHmm');
			}
		},
		headerAttributes: {
      		  title:HEADER_CARRIER_STG_TM_TOOLTIP
      	  }
	},{
		field: "DAILY_RT_CC_CHG",
		title: HEADER_DAILY_RT_CC_CHG,
		attributes:  { style:"text-align:center;" },
		width: 60,
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + dataItem.DAILY_RT_CC_CHG +'</span>';
			}else {
				return dataItem.DAILY_RT_CC_CHG;
			}
		},
		headerAttributes: {
      		  title:HEADER_DAILY_RT_CC_CHG_TOOLTIP
      	  }
	},{
		field: "TOTAL_MTH_CST",
		title: HEADER_TOTAL_MTH_CST,
		attributes:  { style:"text-align:center;" },
		width: 60,
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + dataItem.TOTAL_MTH_CST +'</span>';
			}else {
				return dataItem.TOTAL_MTH_CST;
			}
		},
		headerAttributes: {
      		  title:HEADER_TOTAL_MTH_CST_TOOLTIP
      	  }
	},{
		field: "TRACK_EQUIP_TYPE",
		title: HEADER_TRACK_EQUIP_TYPE,
		attributes:  { style:"text-align:center;" },
		width: 60,
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + dataItem.TRACK_EQUIP_TYPE +'</span>';
			}else {
				return dataItem.TRACK_EQUIP_TYPE;
			}
		},
		headerAttributes: {
      		  title:HEADER_TRACK_EQUIP_TYPE_TOOLTIP
      	  }
	},{
		field: "TRACK_PERSTAGE_TM",
		title: HEADER_TRACK_PERSTAGE_TM,
		attributes:  { style:"text-align:center;" },
		width: 60,
		format:"{0:HHmm}", 
		filterable: { ui: timeFilterInHHMM},
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + kendo.toString(dataItem.TRACK_PERSTAGE_TM,'HHmm') +'</span>';
			}else {
				return kendo.toString(dataItem.TRACK_PERSTAGE_TM,'HHmm');
			}
		},
		headerAttributes: {
      		  title:HEADER_TRACK_PERSTAGE_TM_TOOLTIP
      	  }
	},{
		field: "TRACK_STAGE_TM",
		title: HEADER_TRACK_STAGE_TM,
		attributes:  { style:"text-align:center;" },
		width: 60,
		format:"{0:HHmm}", 
		filterable: { ui: timeFilterInHHMM},
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + kendo.toString(dataItem.TRACK_STAGE_TM,'HHmm') +'</span>';
			}else {
				return kendo.toString(dataItem.TRACK_STAGE_TM,'HHmm');
			}
		},
		headerAttributes: {
      		  title:HEADER_TRACK_STAGE_TM_TOOLTIP
      	  }
	},{
		field: "TRAIL_OPT",
		title: HEADER_TRAIL_OPT,
		attributes:  { style:"text-align:center;" },
		width: 60,
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + dataItem.TRAIL_OPT +'</span>';
			}else {
				return dataItem.TRAIL_OPT;
			}
		},
		headerAttributes: {
      		  title:HEADER_TRAIL_OPT_TOOLTIP
      	  }
	},{
		field: "TRAIL_1PRESTAGE_TM",
		title: HEADER_TRAIL_1PRESTAGE_TM,
		attributes:  { style:"text-align:center;" },
		width: 60,
		format:"{0:HHmm}", 
		filterable: { ui: timeFilterInHHMM},
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + kendo.toString(dataItem.TRAIL_1PRESTAGE_TM,'HHmm') +'</span>';
			}else {
				return kendo.toString(dataItem.TRAIL_1PRESTAGE_TM,'HHmm');
			}
		},
		headerAttributes: {
      		  title:HEADER_TRAIL_1PRESTAGE_TM_TOOLTIP
      	  }
	},{
		field: "TRAIL_1STAGE_TM",
		title: HEADER_TRAIL_1STAGE_TM,
		attributes:  { style:"text-align:center;" },
		width: 60,
		format:"{0:HHmm}", 
		filterable: { ui: timeFilterInHHMM},
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + kendo.toString(dataItem.TRAIL_1STAGE_TM,'HHmm') +'</span>';
			}else {
				return kendo.toString(dataItem.TRAIL_1STAGE_TM,'HHmm');
			}
		},
		headerAttributes: {
      		  title:HEADER_TRAIL_1STAGE_TM_TOOLTIP
      	  }
	},{
		field: "TRAIL_2PRESTAGE_TM",
		title: HEADER_TRAIL_2PRESTAGE_TM,
		attributes:  { style:"text-align:center;" },
		width: 60,
		format:"{0:HHmm}", 
		filterable: { ui: timeFilterInHHMM},
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + kendo.toString(dataItem.TRAIL_2PRESTAGE_TM,'HHmm') +'</span>';
			}else {
				return kendo.toString(dataItem.TRAIL_2PRESTAGE_TM,'HHmm');
			}
		},
		headerAttributes: {
      		  title:HEADER_TRAIL_2PRESTAGE_TM_TOOLTIP
      	  }
	},{
		field: "TRAIL_2STAGE_TM",
		title: HEADER_TRAIL_2STAGE_TM,
		attributes:  { style:"text-align:center;" },
		width: 60,
		format:"{0:HHmm}", 
		filterable: { ui: timeFilterInHHMM},
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + kendo.toString(dataItem.TRAIL_2STAGE_TM,'HHmm') +'</span>';
			}else {
				return kendo.toString(dataItem.TRAIL_2STAGE_TM,'HHmm');
			}
		},
		headerAttributes: {
      		  title:HEADER_TRAIL_2STAGE_TM_TOOLTIP
      	  }
	},{
		field: "TRAIL_AVAIL_TM",
		title: HEADER_TRAIL_AVAIL_TM,
		attributes:  { style:"text-align:center;" },
		width: 60,
		format:"{0:HHmm}", 
		filterable: { ui: timeFilterInHHMM},
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + kendo.toString(dataItem.TRAIL_AVAIL_TM,'HHmm') +'</span>';
			}else {
				return kendo.toString(dataItem.TRAIL_AVAIL_TM,'HHmm');
			}
		},
		headerAttributes: {
      		  title:HEADER_TRAIL_AVAIL_TM_TOOLTIP
      	  }
	},{
		field: "UNLOAD_TM",
		title: HEADER_UNLOAD_TM,
		attributes:  { style:"text-align:center;" },
		width: 60,
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + dataItem.UNLOAD_TM +'</span>';
			}else {
				return dataItem.UNLOAD_TM;
			}
		},
		headerAttributes: {
      		  title:HEADER_UNLOAD_TM_TOOLTIP
      	  }
	},{
		field: "LOAD_TM",
		title: HEADER_LOAD_TM,
		attributes:  { style:"text-align:center;" },
		width: 60,
		template: function(dataItem) {
			if(dataItem.CHANGE_FLAG == "D") {
				return '<span style="color:#ff0000">' + dataItem.LOAD_TM +'</span>';
			}else {
				return dataItem.LOAD_TM;
			}
		},
		headerAttributes: {
      		  title:HEADER_LOAD_TM_TOOLTIP
      	  }
	}];

	// If there are favorite on schedule matrix, hiding the columns based on saved favorites configuration.
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

/**
* Schedule Matrix Aggregate columns
* Method to configure aggregate columns in Schedule matrix
*/
function getAggregateColumns() {
	var aggregateCols = [
	  { field: "MV_NUM", aggregate: "count" }
  ];
	return aggregateCols;
}

function onCellChange(arg) {
    
	var grid = $("#scheduleMatrixGrid").data("kendoGrid");
	/*
	var selectedRow = grid.select();
	
	currentSelection = grid.select();
    selectedRows = [];
    currentSelection.each(function () {
        var currentRowIndex = $(this).closest("tr").index();
        if (selectedRows.indexOf(currentRowIndex) == -1) {
            selectedRows.push(currentRowIndex);
        }
    });*/
    
	/*var selected = $.map(this.select(), function(item) {
    	//var cellItem = $(item).find('td').last();
    	
    	var cell = grid.select(),
        cellIndex = cell.index(),
        column = grid.columns[cellIndex],
        dataSource = grid.dataSource,
        dataItem = dataSource.view()[cell.closest("tr").index()];
    	
    	var commentObjArr = jQuery.parseJSON(dataItem.COMMENTS);
    	var commentText = "";
    	
    	for(var i = 0; i < commentObjArr.length; i++) {
    		commentText += "<font color='#376092' size=2px>" +commentObjArr[i].commentDesc +"</font> by " +commentObjArr[i].createUser +" on " +commentObjArr[i].createDtTm +"<br>";
    	}
    	
    	
    	//var selectedRowIndex = selectedRows[0];
    	//var selectedCellIndex = grid.cellIndex(grid.select());  // correct selected cell index returned
    	
    	//var effDaysLIndex = getMatrixColumnIndex(grid, "COMMENTS");
    	//if(dataItem[cellIndex].innerHTML && dataItem[cellIndex].innerHTML.indexOf("<a href") >= 0) {
    		return $(commentText).html();
    	//} 
    }); */
    
	var cell = grid.select(),
    cellIndex = cell.index(),
    column = grid.columns[cellIndex],
    dataSource = grid.dataSource,
    dataItem = dataSource.view()[cell.closest("tr").index()];
	var commentText = "";
	
	if (column && column.field == "COMMENTS") {
		var commentObjArr = jQuery.parseJSON(dataItem.COMMENTS);
		
		for(var i = 0; i < commentObjArr.length; i++) {
			commentText += "<font color='#376092' size=2px>" +commentObjArr[i].commentDesc +"</font> by " +commentObjArr[i].createUser +" on " +dateTimeFormat(new Date(parseInt(commentObjArr[i].createDtTm))) +"<br><br>";
		}
		createCommentsWin('commentsWindowDiv', commentText);
	}
}

/**
 * Method used to create Comments window
 * This method create kendo window for comments window
 */
function createCommentsWin(itemDiv, selectedText) {
	var commentWin = $('#'+itemDiv);
	
	$("#comments").html(selectedText);
	
	if(!commentWin.data("kendoWindow")) {
		commentWin.kendoWindow({
			height: "280px",
			width: "350px",
			modal: true,
			resizable: false,
			actions: ["close"],
			title: "Comments"
		});
	}
	commentWin.data("kendoWindow").open();
	commentWin.data("kendoWindow").center();
}

/**
 * Method which will be triggered on OK button of Comments window
 */
function commentsOKButtonEvent() {
	var commentWin = $('#commentsWindowDiv');
	if(commentWin !=null && commentWin.data("kendoWindow") !=null) {
		commentWin.data("kendoWindow").close();
	}
}


/**
* Reset Grid Header
* Method to reset Schedule matrix header with the default state of icons.
*/
function resetGridHeader(){
	var btnSyncMap=parent.dashboardController.getDashboard(getDashboardID()).data("kendoWindow").wrapper.find('.sync-to-map');
 	var btnSyncSchematic=parent.dashboardController.getDashboard(getDashboardID()).data("kendoWindow").wrapper.find('.sync-to-schematic');
 	
	parent.highlightBtn(btnSyncMap.parent()[0],true);
	parent.enableSync(btnSyncMap.parent()[0],getDashboardID(),[parent.DASHBOARD_ID_MAP_VIEW,parent.DASHBOARD_ID_SCHEMATIC_VIEW]);
	parent.highlightBtn(btnSyncSchematic.parent()[0],true);
	parent.enableSync(btnSyncSchematic.parent()[0],getDashboardID(),parent.DASHBOARD_ID_NETWORK_MATRIX,[parent.DASHBOARD_ID_MAP_VIEW,parent.DASHBOARD_ID_SCHEMATIC_VIEW]);
}


/**
* To populate Flight Frequency columns.
* Method to configure all Freq columns on Schedule matrix data.
*/
function populateFltFreqColumns(dataItem, effDaysL, effDaysZ) {
	var effDaysL = dataItem[effDaysL];
	var dayStringArray = effDaysL.split(",");
	//var totFreqL = buildFlightCountStr(dayStringArrayL[0]);
	//var noOpDaysL = getNoOpString(dataItem.NOOP_DAYS_L);
		
	var effDaysZ = dataItem[effDaysZ];
	var dayStringZArray = effDaysZ.split(",");
	//var totFreqZ = buildFlightCountStr(dayStringArrayZ[0]);
	//var noOpDaysZ = getNoOpString(dataItem.NOOP_DAYS_Z);
	
	
	var noOpfreqColumnsL = new Array();
	var noOpfreqColumnsZ = new Array();
	
	// Updating Local Freq columns based on selected week
	var freqSelectedInd = $('#freqComboSettings')[0].value - 1;
	var totFreqL = buildFlightFreqStr(dayStringArray[freqSelectedInd]);
	var totFreq = 0;
	for(var i = 1; i < 8; i++) {
		dataItem["TOTAL_FREQ_"+i] = totFreqL.charAt(i-1);
		totFreq =  parseInt(totFreq) + parseInt(totFreqL.charAt(i-1));
	}

	
	var totFreqZ = buildFlightFreqStr(dayStringZArray[freqSelectedInd]);
	for(var j = 1; j < 8; j++) {
		dataItem["TOTAL_FREQZ_"+j] = totFreqZ.charAt(j-1);
	}
	
	/*noOpfreqColumnsL = getFreqDaysPerWeek(noOpDaysL,$('#freqComboSettings')[0].value);
	for(var i = 1; i < 8; i++) {
		if (isExists(noOpfreqColumnsL, (i))) {
			dataItem["TOTAL_FREQ_"+i] = 0;
		} else {
			dataItem["TOTAL_FREQ_"+i] = totFreqL.charAt(i-1);
		}
	}
	
	noOpfreqColumnsZ = getFreqDaysPerWeek(noOpDaysZ,$('#freqComboSettings')[0].value);
	for(var i = 1; i < 8; i++) {
		if (isExists(noOpfreqColumnsZ, (i))) {
			dataItem["TOTAL_FREQZ_"+i] = 0;
		} else {
			dataItem["TOTAL_FREQZ_"+i] = totFreqZ.charAt(i-1);
		}
	}*/
	
	// Computing Ttl Freq columns	
	/*var totFreq = 0;
	if (isExists(dayStringArrayL[1], $('#freqComboSettings')[0].value)) {
		totFreq = getTotalFreq(dayStringArrayL[0], $('#freqComboSettings')[0].value);
	}
	if (totFreq != 0) {
		totFreq = totFreq - getTotalFreqPerWeek(noOpDaysL,$('#freqComboSettings')[0].value);			
	}*/
	// Computing Flight Count columns
	var fltCount = buildTotalFlightCount(dayStringArray);
	
	/*var totDaysL = replaceAll(dayStringArrayL[0], "-", "").length;
	var totWeek = isFiveWeekPlan() ? 5 : 4;
	if (charOccurrInString(noOpDaysL, 'X') != 0) {
		fltCount = totDaysL * totWeek - charOccurrInString(noOpDaysL, 'X');	
	}else {
		fltCount = getTotalFreq(dayStringArrayL[0], dayStringArrayL[1]);
	}*/

	if (totFreq == 0) {
		for(var i = 1; i < 8; i++) {
				dataItem["TOTAL_FREQ_"+i] = 0;
				dataItem["TOTAL_FREQZ_"+i] = 0;
		}
	}
	
	dataItem.FREQ = totFreq;					
	dataItem.FLIGHT_COUNT = fltCount;
}

/**
* Total Freq template.
* Method to apply Total Freq columns template on Schedule matrix data.
* If the CHANGE_FLAG is 'D'. It means leg is deleted.
*/
function applyTotalFltFreqTemplate(dataItem, totalFltFreqColumn, index) {
	var totalFltFreq = dataItem[totalFltFreqColumn+index];
	
	if(dataItem.CHANGE_FLAG == "D") {
		return '<span style="color:#ff0000">' + totalFltFreq +'</span>';
	} 
	
	return parseInt(totalFltFreq);
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

(function ($) {
    jQuery.event.special.destroyed = {
        remove: function (o) {
            if (o.handler) {
                o.handler.apply(this, arguments);
            }
        }
    };
    if (kendo && kendo.ui && kendo.ui.Widget) {
        kendo.ui.Widget.prototype.init = function (element, options) {
            var that = this;

            that.element = kendo.jQuery(element).handler(that);
            
            // This is the section that listens for destroy and calls it when this widget is being removed from the dom
            //  everything else is from the kendo libraries
            that.element.bind('destroyed', function() {
                if (that.destroy) {
                    var widget = that.element.data("kendo" + options.prefix + options.name);
                    if ((null !== widget) && (typeof widget !== "undefined")) that.destroy();
                }
            });

            kendo.Observable.fn.init.call(that);

            options = that.options = $.extend(true, {}, that.options, options);

            if (!that.element.attr(kendo.attr("role"))) {
                that.element.attr(kendo.attr("role"), (options.name || "").toLowerCase());
            }

            that.element.data("kendo" + options.prefix + options.name, that);

            that.bind(that.events, options);
        };
    }
})(jQuery);