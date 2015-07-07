/**
* @author 888600 Abhishek Sharma
* This script belongs to Volume Utilization Matrix Dashboard.
* Included in volumeUtilizationMatrix.jsp
*/

//Progress message in Volume Utilization Matrix
var PROGRESS_DIALOG_MESSAGE_SCHEDULE_MATRIX = "Loading volume utilization matrix...";
//Calendar row template for Local & Zulu
var	calenderRowTemplateL="#= calenderRowEditor(data,'volUtilizationMatrixGrid','L') #";
var	calenderRowTemplateZ="#= calenderRowEditor(data,'volUtilizationMatrixGrid','Z') #";

//In these templates 'RL' means Route Local & 'RZ' means Route Zulu.
var	calenderRouteRowTemplateL="#= calenderRowEditor(data,'volUtilizationMatrixGrid','RL') #";
var	calenderRouteRowTemplateZ="#= calenderRowEditor(data,'volUtilizationMatrixGrid','RZ') #";

var EFF_LOCAL_COLUMNS=["EFFDAYSL_D1","EFFDAYSL_D2","EFFDAYSL_D3","EFFDAYSL_D4","EFFDAYSL_D5","EFFDAYSL_D6","EFFDAYSL_D7",
    					"EFFWEEKSL_W1","EFFWEEKSL_W2","EFFWEEKSL_W3","EFFWEEKSL_W4"];
var EFF_ZULU_COLUMNS = ["EFFDAYSZ_D1","EFFDAYSZ_D2","EFFDAYSZ_D3","EFFDAYSZ_D4","EFFDAYSZ_D5","EFFDAYSZ_D6","EFFDAYSZ_D7",
    					"EFFWEEKSZ_W1","EFFWEEKSZ_W2","EFFWEEKSZ_W3","EFFWEEKSZ_W4"];

//Route Effective days column array
var ROUTE_EFF_LOCAL_COLUMNS=["RTEEFFDAYSL_D1","RTEEFFDAYSL_D2","RTEEFFDAYSL_D3","RTEEFFDAYSL_D4","RTEEFFDAYSL_D5","RTEEFFDAYSL_D6","RTEEFFDAYSL_D7",
   					"RTEEFFWEEKSL_W1","RTEEFFWEEKSL_W2","RTEEFFWEEKSL_W3","RTEEFFWEEKSL_W4"];
var ROUTE_EFF_ZULU_COLUMNS = [ "RTEEFFDAYSZ_D1","RTEEFFDAYSZ_D2","RTEEFFDAYSZ_D3","RTEEFFDAYSZ_D4","RTEEFFDAYSZ_D5","RTEEFFDAYSZ_D6","RTEEFFDAYSZ_D7",
    					"RTEEFFWEEKSZ_W1","RTEEFFWEEKSZ_W2","RTEEFFWEEKSZ_W3","RTEEFFWEEKSZ_W4"];

//Array for All Local columns
var LOCAL_COLUMNS = ["NOOP_DAYS_L", "BO_TIME_L", "BI_TIME_L", "BI_DAY_L", "CAL_BUTTON_L", "EFFDAYSL", "KEYWORD_EFFDT_L", "DAY", "RTEEFFDAYSL","ROUTE_KEYWORD_EFFDT_L", "CAL_BUTTON_ROUTE_L"];
//Array for All Zulu columns
var ZULU_COLUMNS = ["NOOP_DAYS_Z","BO_TIME_Z", "BI_TIME_Z", "BI_DAY_Z", "CAL_BUTTON_Z", "EFFDAYSZ", "KEYWORD_EFFDT_Z", "DAYZ", "RTEEFFDAYSZ","ROUTE_KEYWORD_EFFDT_Z", "CAL_BUTTON_ROUTE_Z"];
//Variable for Volume Day.
var DAY_COLUMN = "DAY";
//Array for Week Local columns
var WEEK_COLUMNS_L = ["EFFWEEKSL_W5"];
var ROUTE_WEEK_COLUMNS_L = ["RTEEFFWEEKSL_W5"];
//Array for Week Zulu columns
var WEEK_COLUMNS_Z = ["EFFWEEKSZ_W5"];
var ROUTE_WEEK_COLUMNS_Z = ["RTEEFFWEEKSZ_W5"];

//Array for All IBOB Local columns
var LOCAL_COLUMNS_IBOB = ["availTimeL","arrivalDayL","dueTimeL","EFFDAYSL_D1","EFFDAYSL_D2","EFFDAYSL_D3","EFFDAYSL_D4","EFFDAYSL_D5","EFFDAYSL_D6","EFFDAYSL_D7",
       					"EFFWEEKSL_W1","EFFWEEKSL_W2","EFFWEEKSL_W3","EFFWEEKSL_W4","CAL_BUTTON_L","CAL_BUTTON_ROUTE_L"];
//Array for All IBOB Zulu columns
var ZULU_COLUMNS_IBOB = ["availTimeZ","arrivalDayZ","dueTimeZ","EFFDAYSZ_D1","EFFDAYSZ_D2","EFFDAYSZ_D3","EFFDAYSZ_D4","EFFDAYSZ_D5","EFFDAYSZ_D6","EFFDAYSZ_D7",
     					"EFFWEEKSZ_W1","EFFWEEKSZ_W2","EFFWEEKSZ_W3","EFFWEEKSZ_W4","CAL_BUTTON_Z","CAL_BUTTON_ROUTE_Z"];
//Array for All IBOB Open matrix IDs
var ibobOpenMatrixIds = new Array();
// Boolean flag to determine if the request is from Network Schedule or not
var isNetworkScheduleFlag;
// Var to have flag for Schedule or Network Schedule
var dayWhereClauses = {};
//Favorite component
var favoriteComponent;

var timeColLabelMap = new Object(); 
	timeColLabelMap["NOOP_DAYS_L"] = ["No Op Days"];
	timeColLabelMap["BO_TIME_L"] = ["Dept"];
	timeColLabelMap["BI_TIME_L"] = ["Arriv"];
	timeColLabelMap["BI_DAY_L"] = ["Arriv Day"];
	timeColLabelMap["NOOP_DAYS_Z"] = ["No Op Days"];
	timeColLabelMap["BO_TIME_Z"] = ["Dept"];
	timeColLabelMap["BI_TIME_Z"] = ["Arriv"];
	timeColLabelMap["BI_DAY_Z"] = ["Arriv Day"];
	timeColLabelMap["DAY"] = ["Vol Day"];
	timeColLabelMap["DAYZ"] = ["Vol Day"];

var volColLabelMap = new Object(); 
	volColLabelMap["TOTAL_WGT"] = ["Ttl Wt"];
	volColLabelMap["TOTAL_WGT_PER"] = ["Ttl Wt %"];
	volColLabelMap["AVAIL_WGT"] = ["Avail Wt"];
	volColLabelMap["EXCESS_WEIGHT"] = ["Excess Wt"];
	volColLabelMap["MAX_PAYLOAD_WT"] = ["Max Pld Wt"];
	volColLabelMap["TOTAL_CU"] = ["Ttl Cu"];
	volColLabelMap["TOTAL_CU_PER"] = ["Ttl Cu %"];
	volColLabelMap["AVAIL_CU"] = ["Avail Cu"];
	volColLabelMap["EXCESS_CUBE"] = ["Excess Cu"];
	volColLabelMap["MAX_PAYLOAD_CU"] = ["Max Pld Cu"];
	volColLabelMap["TOTAL_PCS"] = ["Ttl Pcs"];

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
}

/**
* Called on Schedule Query success
* To refresh Volume Utilization matrix.
*/
function onScheduleQuerySuccess() {
	refreshMatrix();		
}

/**
* Called on Volume Utilization Matrix refresh
* To refresh volume utilization matrix.
*/
function refresh() {
	if(parent.needToLoadData(parent.DASHBOARD_ID_VOLUME_UTILIZATION_MATRIX, isNetworkScheduleFlag)) {
		refreshMatrix();
	}
}

/**
* Called on day component click
* To open the volume utilization matrix day control.
*/
function openDayControl(btn) {
	parent.VIEWER.openDayControl(btn, parent.DASHBOARD_ID_VOLUME_UTILIZATION_MATRIX, parent.getDataType(isNetworkScheduleFlag));
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
	return getColumnsSettings('volUtilizationMatrixGrid');
}

/**
* Volume utilization Contents setting
* get volume utilization matrix contents favorites setting.
*/
function getContentFavoriteSettings() {
	return getMatrixContentFavoriteSettings('volUtilizationMatrixGrid');
}
function applyHeaderButtonSettings(headerButtonSettings) {
}

/**
* Volume utilization Display option setting
* apply volume utilization matrix display option favorites setting.
*/
function applyDisplayOptionSettings(displayOptionSettings, isDefaultFavorite, isApplicationLevel, isRefreshDashboard) {
	setColumnsSettings(displayOptionSettings,"volUtilizationMatrixGrid");
}

/**
* Volume utilization Content setting
* apply volume utilization matrix contents favorites setting.
*/
function applyContentFavoriteSettings(contentSettings, isDefaultFavorite, isApplicationLevel, isRefreshDashboard) {
	setMatrixContentFavoriteSettings('volUtilizationMatrixGrid',contentSettings);
}
/******* common methods - favorites - end *******/

/**
* set network schedule flag.
* Method to set isNetworkScheduleFlag to determine if the request is from Network Schedule.
*/
function setNetworkScheduleFlag(flag) {
	var hasDataTypeChanged = isNetworkScheduleFlag != flag;
	if(hasDataTypeChanged) {
		if(isNetworkScheduleFlag != undefined) {
			dayWhereClauses[getDataType()] = dayWhereClause;
		}
		isNetworkScheduleFlag = flag;
		searchCriteria.setCriteria(CRITERIA_IS_NW_RELATED, isNetworkScheduleFlag);
		dayWhereClause = dayWhereClauses[getDataType()];
		
		parent.setDashboardDataStatus(parent.DASHBOARD_ID_VOLUME_UTILIZATION_MATRIX, getDataType(), false);
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
* Volume utilization Initialize method
* Method to use for initialization of Volume utilization Matrix.
* @param flag - Flag to determine if the request is first time. If it's first time request, we will initialize display options else not.
* @param favoriteSettings - Columns which are stored in favorites
*/
function initialize(flag, favoriteSettings) {
	setMatrixFavoriteSettings(favoriteSettings);	
	if(flag == undefined) {
		setMatrixID("volUtilizationMatrixGrid");
		setDashboardID(parent.DASHBOARD_ID_VOLUME_UTILIZATION_MATRIX);
		isClearOn = false;
		addButtonsBar();
		favoriteComponent = new FavoriteComponent(parent.DASHBOARD_ID_VOLUME_UTILIZATION_MATRIX, "volUtilMatrixFavoritesMenu","Volume Utilization");
		favoriteComponent.retrieveAllFavorites(true, applyDefaultFavoriteOnInitialize);
		isNetworkScheduleFlag = parent.isNetworkQuery;
		searchCriteria.setCriteria(CRITERIA_IS_NW_RELATED, isNetworkScheduleFlag);
	}
	var matrixURL = getVolumeUtilizationMatrixUrl();
	if (isClearOn == true) {
		matrixURL = null;
	}
	var matrixObject = this;
	var volumeDiv =  $('<div id="volUtilizationMatrixGrid" style="width:100%;"></div>').appendTo("#volumeUtilizationMatrix");
	var element = volumeDiv.kendoGrid({
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
				fields: getMatrixModel()
			},
			parse: function (d) {
				$.each(d, function (idx, dataItem) {				            	
						populateEffectiveDayColumns(dataItem, "EFFDAYSL", "EFFDAYSZ");
						populateEffectiveDayColumns(dataItem, "RTEEFFDAYSL", "RTEEFFDAYSZ", "RTE");
						populateTimeColumns(dataItem);
		        });
		        return d;
			}
		},
		  aggregate: getAggregateColumns(),
		  requestStart: function(e) {
				 showProgressDialog(true, PROGRESS_DIALOG_MESSAGE_SCHEDULE_MATRIX);
		  },
		  requestEnd: function(e) {
		  	  showProgressDialog(false);
			  onResize();	
			  if(renderEmpty) {
		  	  		renderEmpty = false;
		  	  } else {		   
		  	  		parent.setDashboardDataStatus(parent.DASHBOARD_ID_VOLUME_UTILIZATION_MATRIX, getDataType(), true);
			  		setTimeout( function() {
			  				applyMatrixSortFilterGroupByFavoriteSettings();
							//sync other dashboards
							populateIdsAndSync();
							validateMatrixCheckboxStates("volUtilizationMatrixGrid");
						}, 100);			  	
				}		  
		  },
		  error: function(e) {
		  	  if(renderEmpty) {
		  	  	renderEmpty = false;
		  	  }
		  	  checkForTimeoutError(e);
			  showProgressDialog(false);
			  parent.setDashboardDataStatus(parent.DASHBOARD_ID_VOLUME_UTILIZATION_MATRIX, getDataType(), true);
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
		height: DEFAULT_MATRIX_HEIGHT,
		dataBound:  showTooltip,
		detailInit: detailInit,
		/*dataBound: function() {
            this.expandRow(this.tbody.find("tr.k-master-row").first());
        },*/
        //turned off virtual scrolling and pagination to fix an issue wtih scrollbar
        //when virtual scrolling is turned on the last few rows when expanded are not visible
		scrollable: true,
		columns: getMatrixColumns(favColumns)
	});
	if(flag == undefined) {
		refresh();
		initializeDisplayOptions();
		parent.setDashboardInitialized(parent.DASHBOARD_ID_VOLUME_UTILIZATION_MATRIX);
	}
	
	//setEffectiveSeperateDays();
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
	var matrixCols = [{
		hidden: true,
		field: "LEG_ID",
		title: HEADER_S,
		width: 10,
		headerAttributes: {
      		  title:HEADER_S
      	  }
	},{
		field: "MV_NUM",
		title: HEADER_ROUTE_NO,
		attributes:  { style:"text-align:center;" },
		width: 65,
		headerAttributes: {
      		  title:HEADER_ROUTE_NO_TOOLTIP
      	  }
	},{
		field: "MV_NUM_SEQ",
		title: HEADER_S,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_S_TOOLTIP
      	  }
	},{
		field: "EQUIP_TYPE",
		title: HEADER_EQ,
		attributes:  { style:"text-align:center;" },
		width: 40,
		headerAttributes: {
  		  title:HEADER_EQ_TOOLTIP
  	  }
	},{
		field: "EQUIP_DESC",
		title: HEADER_EQ_DESC,
		attributes:  { style:"text-align:center;" },
		width: 55,
		headerAttributes: {
  		  title:HEADER_EQ_DESC_TOOLTIP
  	  }
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
		width: 25,
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
	}, {
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
		hidden: true,
		field: "EFFDAYSL",
		title: HEADER_LEG_EFF_DAYS_L,
		attributes:  { style:"text-align:center;" },
		width: 120,
		headerAttributes: {
      		  title:HEADER_LEG_EFF_DAYS_L_TOOLTIP
      	  },
      	  template: function(dataItem) {
  			return parent.getEffDaysStringFromSystemSetting(dataItem, "EFFDAYSL");
  		}
	}, {
		hidden:!isLocalTimeFlag(),
		field: "KEYWORD_EFFDT_L",
		title: HEADER_LEG_KEY_EFF_DAYS_L,
		attributes:  { style:"text-align:left;" },
		width: 175,
		headerAttributes: {
    		  title:HEADER_LEG_KEY_EFF_DAYS_L_TOOLTIP
    	  }
	}, {
		hidden:!isLocalTimeFlag(),
		field: "NOOP_DAYS_L",
		title: HEADER_NO_OPS_L,
		attributes:  { style:"text-align:center;" },
		width: 60,
		headerAttributes: {
      		  title:HEADER_NO_OPS_TOOLTIP
      	  }, template: function(dataItem) {
				var onOpStr = getNoOpString(dataItem.NOOP_DAYS_L);
				return onOpStr;
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
		width: 25,
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
	}, {
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
		hidden: true,
		field: "RTEEFFDAYSL",
		title: HEADER_ROUTE_EFF_DAYS_L,
		attributes:  { style:"text-align:center;" },
		width: 120,
		headerAttributes: {
      		  title:HEADER_ROUTE_EFF_DAYS_L_TOOLTIP
      	  },
      	  template: function(dataItem) {
  			return parent.getEffDaysStringFromSystemSetting(dataItem, "RTEEFFDAYSL");
  		}
	}, {
		hidden:!isLocalTimeFlag(),
		field: "ROUTE_KEYWORD_EFFDT_L",
		title: HEADER_ROUTE_KEY_EFF_DAYS_L,
		attributes:  { style:"text-align:left;" },
		width: 175,
		headerAttributes: {
    		  title:HEADER_ROUTE_KEY_EFF_DAYS_L_TOOLTIP
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
		field: "DAY",
		title: HEADER_VOL_DAY,
		attributes:  { style:"text-align:center;" },
		width: 50,
		headerAttributes: {
  		  title:HEADER_VOL_DAY_TOOLTIP
  	  }
	}, {
		hidden: true,
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
		hidden: true,
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
		hidden: true,
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
		hidden: true,
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
		hidden: true,
		field: "EFFDAYSZ_D5",
		title: getEffDaysConfiguration()[4]+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_LEG_EFF_DAYS_Z_TOOLTIP
      	  },
      	  template: function(dataItem) {
  			return applyEffectiveDaysDayTemplate(dataItem, "EFFDAYSZ_D", "LEG_HOL_DAYS_Z", 5);
  		}
	}, {
		hidden: true,
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
		hidden: true,
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
	},  {
		hidden: true,
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
		hidden: true,
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
		hidden: true,
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
		hidden: true,
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
		hidden: true,
		field: "EFFDAYSZ",
		title: HEADER_LEG_EFF_DAYS_Z,
		attributes:  { style:"text-align:center;" },
		width: 120,
		headerAttributes: {
      		  title:HEADER_LEG_EFF_WEEKS_Z_TOOLTIP
      	  },
      	  template: function(dataItem) {
    			return parent.getEffDaysStringFromSystemSetting(dataItem, "EFFDAYSZ");
    		}
	}, {
		hidden:isLocalTimeFlag(),
		field: "KEYWORD_EFFDT_Z",
		title: HEADER_LEG_KEY_EFF_DAYS_Z,
		attributes:  { style:"text-align:left;" },
		width: 175,
		headerAttributes: {
    		  title:HEADER_LEG_KEY_EFF_DAYS_Z_TOOLTIP
    	  }
	}, {
		hidden:isLocalTimeFlag(),
		field: "NOOP_DAYS_Z",
		title: HEADER_NO_OPS_Z,
		attributes:  { style:"text-align:center;" },
		width: 60,
		headerAttributes: {
      		  title:HEADER_NO_OPS_TOOLTIP
      	  }, template: function(dataItem) {
				var onOpStr = getNoOpString(dataItem.NOOP_DAYS_Z);
				return onOpStr;
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
		hidden: true,
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
		hidden: true,
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
		hidden: true,
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
		hidden: true,
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
		hidden: true,
		field: "RTEEFFDAYSZ_D5",
		title: getEffDaysConfiguration()[4]+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_ROUTE_EFF_DAYS_Z_TOOLTIP
      	  },
      	  template: function(dataItem) {
  			return applyEffectiveDaysDayTemplate(dataItem, "RTEEFFDAYSZ_D", "ROUTE_HOL_DAYS_Z", 5);
  		}
	}, {
		hidden: true,
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
		hidden: true,
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
	},  {
		hidden: true,
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
		hidden: true,
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
		hidden: true,
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
		hidden: true,
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
		hidden: true,
		field: "RTEEFFDAYSZ",
		title: HEADER_ROUTE_EFF_DAYS_Z,
		attributes:  { style:"text-align:center;" },
		width: 120,
		headerAttributes: {
      		  title:HEADER_ROUTE_EFF_DAYS_Z_TOOLTIP
      	  },
      	  template: function(dataItem) {
    			return parent.getEffDaysStringFromSystemSetting(dataItem, "RTEEFFDAYSZ");
    		}
	}, {
		hidden:isLocalTimeFlag(),
		field: "ROUTE_KEYWORD_EFFDT_Z",
		title: HEADER_ROUTE_KEY_EFF_DAYS_Z,
		attributes:  { style:"text-align:left;" },
		width: 175,
		headerAttributes: {
    		  title:HEADER_ROUTE_KEY_EFF_DAYS_Z_TOOLTIP
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
		field: "LEG_HOL_DAYS_L",
		title: HEADER_RTE_HOL_DAYS_L,
		attributes:  { style:"text-align:center;" },
		width: 65,
		headerAttributes: {
      		  title:HEADER_RTE_HOL_DAYS_L_TOOLTIP
      	  }
	},{
		hidden:true,
		field: "LEG_HOL_DAYS_Z",
		title: HEADER_RTE_HOL_DAYS_Z,
		attributes:  { style:"text-align:center;" },
		width: 60,
		headerAttributes: {
      		  title:HEADER_RTE_HOL_DAYS_Z_TOOLTIP
      	  }
	},{
		hidden:true,
		field: "ROUTE_NOOP_DAYS_L",
		title: HEADER_NO_OPS_L,
		attributes:  { style:"text-align:center;" },
		template: calenderRowTemplateL,
		width: 60,
		headerAttributes: {
      		  title:HEADER_NO_OPS_TOOLTIP
      	  },
      	  template: function(dataItem) {
				var noopStr = getNoOpString(dataItem.ROUTE_NOOP_DAYS_L);
					return noopStr;
			}	
	}, {
		hidden:true,
		field: "ROUTE_NOOP_DAYS_Z",
		title: HEADER_NO_OPS_Z,
		attributes:  { style:"text-align:center;" },
		template: calenderRowTemplateZ,
		width: 60,
		headerAttributes: {
      		  title:HEADER_NO_OPS_TOOLTIP
      	  },
      	  template: function(dataItem) {
				var onOpStr = getNoOpString(dataItem.ROUTE_NOOP_DAYS_Z); 
					return onOpStr;
			}	
	}, {
		hidden:true,
		field: "ROUTE_HOL_DAYS_L",
		title: HEADER_RTE_HOL_DAYS_L,
		attributes:  { style:"text-align:center;" },
		width: 65,
		headerAttributes: {
      		  title:HEADER_RTE_HOL_DAYS_L_TOOLTIP
      	  }
	}, {
		hidden:true,
		field: "ROUTE_HOL_DAYS_Z",
		title: HEADER_RTE_HOL_DAYS_Z,
		attributes:  { style:"text-align:center;" },
		width: 60,
		headerAttributes: {
      		  title:HEADER_RTE_HOL_DAYS_Z_TOOLTIP
      	  }
	}, {
		field: "ORIGIN",
		title: HEADER_SCHEDULE_ORG,
		attributes:  { style:"text-align:center;" },
		width: 50,
		headerAttributes: {
      		  title:HEADER_SCHEDULE_ORG_TOOLTIP
      	  }
	},{
		field: "DESTINATION",
		title: HEADER_SCHEDULE_DEST,
		attributes:  { style:"text-align:center;" },
		width: 50,
		headerAttributes: {
      		  title:HEADER_SCHEDULE_DEST_TOOLTIP
      	  }
	},{
		hidden:!isLocalTimeFlag(),
		field: "BO_TIME_L",
		title: HEADER_LOCAL_DEP,
		attributes:  { style:"text-align:center;" },
		width: 50,
		format:"{0:HH:mm}", 
		filterable: { ui: timeFilter},
		headerAttributes: {
      		  title:HEADER_LOCAL_DEP_SCH_TOOLTIP
      	  }
	},{
		hidden:isLocalTimeFlag(),
		field: "BO_TIME_Z",
		title: HEADER_ZULU_DEP,
		attributes:  { style:"text-align:center;" },
		width: 50,
		format:"{0:HH:mm}", 
		filterable: { ui: timeFilter},
		headerAttributes: {
      		  title:HEADER_ZULU_DEP_TOOLTIP
      	  }
	},{
		hidden:!isLocalTimeFlag(),
		field: "BI_TIME_L",
		title: HEADER_LOCAL_ARR,
		attributes:  { style:"text-align:center;" },
		width: 50,
		format:"{0:HH:mm}", 
		filterable: { ui: timeFilter},
		headerAttributes: {
      		  title:HEADER_ZULU_ARR_SCH_TOOLTIP
      	  }
	},{
		hidden:isLocalTimeFlag(),
		field: "BI_TIME_Z",
		title: HEADER_ZULU_ARR,
		attributes:  { style:"text-align:center;" },
		width: 50,
		format:"{0:HH:mm}", 
		filterable: { ui: timeFilter},
		headerAttributes: {
      		  title:HEADER_ZULU_ARR_TOOLTIP
      	  }
	},{
		hidden:isLocalTimeFlag(),
		field: "DAYZ",
		title: HEADER_VOL_DAY,
		attributes:  { style:"text-align:center;" },
		width: 50,
		headerAttributes: {
  		  title:HEADER_VOL_DAY_TOOLTIP
  	  }
	}];
	
	matrixCols = addProductGroupsColumns(matrixCols, true, undefined, true);
	
	matrixCols = matrixCols.concat([ {
		field: "TOTAL_WGT",
		title: HEADER_WGT_TOTAL,
		attributes:{style:"text-align:right;"}, format:"{0:n0}",
		width: 70,
		aggregates: ["sum"],
		footerTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		groupFooterTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		headerAttributes: {
      		  title:HEADER_WGT_TOTAL_TOOLTIP
      	  }
	},{
		field: "TOTAL_PCS",
		title: HEADER_PCS_TOTAL,
		attributes:{style:"text-align:right;"}, format:"{0:n0}",
		width: 70,
		aggregates: ["sum"],
		footerTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		groupFooterTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		headerAttributes: {
      		  title:HEADER_PCS_TOTAL_TOOLTIP
      	  }
	},{
		field: "TOTAL_CU",
		title: HEADER_CB_TOTAL,
		attributes:{style:"text-align:right;"}, format:"{0:n0}",
		width: 70,
		aggregates: ["sum"],
		footerTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		groupFooterTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		headerAttributes: {
      		  title:HEADER_CB_TOTAL_TOOLTIP
      	  }
	},{
		field: "TOTAL_WGT_PER",
		title: HEADER_WGT_TOTAL_PER,
		attributes:{style:"text-align:right;"}, format:"{0:p0}",
		width: 70,
		headerAttributes: {
      		  title:HEADER_WGT_TOTAL_PER_TOOLTIP
      	  }
	},{
		field: "TOTAL_CU_PER",
		title: HEADER_CU_TOTAL_PER,
		attributes:{style:"text-align:right;"}, format:"{0:p0}",
		width: 70,
		headerAttributes: {
      		  title:HEADER_CU_TOTAL_PER_TOOLTIP
      	  }
	},{
		field: "AVAIL_WGT",
		title: HEADER_WGT_AVAIL,
		attributes:{style:"text-align:right;"}, format:"{0:n0}",
		width: 70,
		aggregates: ["sum"],
		footerTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		groupFooterTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		headerAttributes: {
      		  title:HEADER_WGT_AVAIL_TOOLTIP
      	  }
	},{
		field: "AVAIL_CU",
		title: HEADER_CU_AVAIL,
		attributes:{style:"text-align:right;"}, format:"{0:n0}",
		width: 70,
		aggregates: ["sum"],
		footerTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		groupFooterTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		headerAttributes: {
      		  title:HEADER_CU_AVAIL_TOOLTIP
      	  }
	},{
		field: "EXCESS_WEIGHT",
		title: HEADER_WGT_EX,
		attributes:{style:"text-align:right;"}, format:"{0:n0}",
		width: 70,
		aggregates: ["sum"],
		footerTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		groupFooterTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		headerAttributes: {
      		  title:HEADER_WGT_EX_VOL_TOOLTIP
      	  }
	},{
		field: "EXCESS_CUBE",
		title: HEADER_CB_EX,
		attributes:{style:"text-align:right;"}, format:"{0:n0}",
		width: 70,
		aggregates: ["sum"],
		footerTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		groupFooterTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		headerAttributes: {
      		  title:HEADER_CB_EX_VOL_TOOLTIP
      	  }
	},{
		field: "MAX_PAYLOAD_WT",
		title: HEADER_MAX_PAY_WT,
		attributes:{style:"text-align:right;"}, format:"{0:n0}",
		width: 70,
		aggregates: ["sum"],
		footerTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		groupFooterTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		headerAttributes: {
      		  title:HEADER_MAX_PAY_WT_TOOLTIP
      	  }
	},{
		field: "MAX_PAYLOAD_CU",
		title: HEADER_MAX_PAY_CU,
		attributes:{style:"text-align:right;"}, format:"{0:n0}",
		width: 70,
		aggregates: ["sum"],
		footerTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		groupFooterTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		headerAttributes: {
      		  title:HEADER_MAX_PAY_CU_TOOLTIP
      	  }
	},{
		field: "LEG_TYPE",
		title: HEADER_LEG_TYPE,
		attributes:  { style:"text-align:center;" },
		width: 30,
		headerAttributes: {
      		  title:HEADER_LEG_TYPE_TOOLTIP
      	  }
	},{
		field: "BI_DAY_L",
		title: HEADER_ADY_L,
		attributes:  { style:"text-align:center;" },
		width: 50,
		headerAttributes: {
  		  title:HEADER_ADY_L_TOOLTIP
  	  }
	},{
		field: "BI_DAY_Z",
		title: HEADER_ADY_Z,
		attributes:  { style:"text-align:center;" },
		width: 50,
		headerAttributes: {
  		  title:HEADER_ADY_Z_TOOLTIP
  	  }
	}]);
	
	// If there are favorite on volume utilization matrix, hiding the columns based on saved favorites configuration.
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
		map["All_Local_Columns"] =$.merge($.merge($.merge([],getLocalColumns()),WEEK_COLUMNS_L),ROUTE_WEEK_COLUMNS_L);
		map["All_Zulu_Columns"] = $.merge($.merge($.merge([],getZuluColumns()),WEEK_COLUMNS_Z),ROUTE_WEEK_COLUMNS_Z);
	}else{
		map["All_Local_Columns"] =getLocalColumns();
		map["All_Zulu_Columns"] = getZuluColumns();
	}
	showLocalOrZuluMatrixColumns("volUtilizationMatrixGrid", map["All_Local_Columns"], map["All_Zulu_Columns"], isLocalTimeFlag());
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
		$.merge(colToHide,WEEK_COLUMNS_L);
		$.merge(colToHide,WEEK_COLUMNS_Z);
		$.merge(colToHide,ROUTE_WEEK_COLUMNS_L);
		$.merge(colToHide,ROUTE_WEEK_COLUMNS_Z);
	}
	return colToHide;
}
function setSearchCriteria() {
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
			"effDayPatternStr": parent.getSelectedEffDayStrPattern(),
			"timeReference":"L",
			"legDay":e.data.DAY,
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
	map["All_LOCAL_Columns"] = LOCAL_COLUMNS_IBOB;
	map["All_Zulu_Columns"] = ZULU_COLUMNS_IBOB;
	showLocalOrZuluMatrixColumns("IBOBMatrix"+e.detailRow.index(), map["All_LOCAL_Columns"], map["All_Zulu_Columns"], isLocalTimeFlag());
}

/**
* Volume utilization local columns method
* Method to get local columns of Volume utilization matrix.
*/
function getLocalColumns() {
	return $.merge($.merge(LOCAL_COLUMNS,EFF_LOCAL_COLUMNS),ROUTE_EFF_LOCAL_COLUMNS);
}

/**
* Volume Utilization zulu columns method
* Method to get zulu columns of Volume utilization matrix.
*/
function getZuluColumns() {
	return $.merge($.merge(ZULU_COLUMNS,EFF_ZULU_COLUMNS),ROUTE_EFF_ZULU_COLUMNS);
}

/**
* Volume utilization day column method
* Method to get day column of Volume utilization matrix.
*/
function getDayColumn() {
	return DAY_COLUMN;
}

function getEffectiveColumns(isLocalTime){
	if(isLocalTime){
		if(isFiveWeekPlan()){
			return $.merge($.merge([],EFF_LOCAL_COLUMNS),WEEK_COLUMNS_L);	
		}else{
			return EFF_LOCAL_COLUMNS;
		}
	}else{
		if(isFiveWeekPlan()){
			return $.merge($.merge([],EFF_ZULU_COLUMNS),WEEK_COLUMNS_Z);
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
            	attributes:  { style:"text-align:center;" },
        		headerAttributes: {
            		  title:HEADER_ORIG_TOOLTIP
            	  } 
            },
            { field: "origActyCd", title:HEADER_ORG_ACT, width: 45, 
            	attributes:  { style:"text-align:center;" },
        		headerAttributes: {
            		  title:HEADER_ORG_ACT_TOOLTIP
            	  } 
            },
            { field: "availTimeL", title:HEADER_AVAIL_TIME_L, width: 55, 
            	attributes:  { style:"text-align:center;" },
        		headerAttributes: {
            		  title:HEADER_AVAIL_TIME_L_TOOLTIP
            	  } 
            },
            { field: "availTimeZ", title:HEADER_AVAIL_TIME_Z, width: 55, 
            	attributes:  { style:"text-align:center;" },
        		headerAttributes: {
            		  title:HEADER_AVAIL_TIME_Z_TOOLTIP
            	  } 
            },
            { field: "delay", title:HEADER_DL, width: 25, 
            	attributes:  { style:"text-align:center;" },
        		headerAttributes: {
            		  title:HEADER_DL_TOOLTIP
            	  } 
            },
            { field: "suggestedMode", title:HEADER_SM, width: 20, 
            	attributes:  { style:"text-align:center;" },
        		headerAttributes: {
            		  title:HEADER_SM_TOOLTIP
            	  } 
            },
            { field: "mandatoryMode", title:HEADER_MM, width: 20, 
            	attributes:  { style:"text-align:center;" },
        		headerAttributes: {
            		  title:HEADER_MM_TOOLTIP
            	  } 
            },
            { field: "transits", title:HEADER_TRANSITS, width: 60, 
            	attributes:  { style:"text-align:center;" },
        		headerAttributes: {
            		  title:HEADER_TRANSITS_TOOLTIP
            	  } 
            },
            { field: "arrivalDayL", title:HEADER_ADY_L, width: 55, 
            	attributes:  { style:"text-align:center;" },
        		headerAttributes: {
            		  title:HEADER_ADY_L_TOOLTIP
            	  } 
            },
            { field: "arrivalDayZ", title:HEADER_ADY_Z, width: 55, 
            	attributes:  { style:"text-align:center;" },
        		headerAttributes: {
            		  title:HEADER_ADY_Z_TOOLTIP
            	  } 
            },
            { field: "dueTimeL", title:HEADER_DUE_TIME_L, width: 55, 
            	attributes:  { style:"text-align:center;" },
        		headerAttributes: {
            		  title:HEADER_DUE_TIME_L_TOOLTIP
            	  } 
            },
            { field: "dueTimeZ", title:HEADER_DUE_TIME_Z, width: 55, 
            	attributes:  { style:"text-align:center;" },
        		headerAttributes: {
            		  title:HEADER_DUE_TIME_Z_TOOLTIP
            	  } 
            },
            { field: "destLocCd", title:HEADER_DES, width: 50, 
            	attributes:  { style:"text-align:center;" },
        		headerAttributes: {
            		  title:HEADER_DES_TOOLTIP
            	  } 
            },
            { field: "destActyCd", title:HEADER_DEST_ACT, width: 40, 
            	attributes:  { style:"text-align:center;" },
        		headerAttributes: {
            		  title:HEADER_DEST_ACT_TOOLTIP
            	  } 
            },
            { field: "effDaysL", title:"Effective Days (L)", width: 45, hidden:true, 
            	attributes:  { style:"text-align:center;" },
        		headerAttributes: {
            		  title:HEADER_LOCAL_SUFFIX
            	  },
              	  template: function(dataItem) {
          			return parent.getEffDaysStringFromSystemSetting(dataItem, "effDaysL");
          		}
            },
            { field: "effDaysZ", title:"Effective Days (Z)", width: 45, hidden:true,
            	attributes:  { style:"text-align:center;" },
        		headerAttributes: {
            		  title:HEADER_ZULU_SUFFIX
            	  },
              	  template: function(dataItem) {
            			return parent.getEffDaysStringFromSystemSetting(dataItem, "effDaysZ");
            		}
            },
            {
        		field: "EFFDAYSL_D1",
        		title: getEffDaysConfiguration()[0]+HEADER_LOCAL_SUFFIX,
        		attributes:  { style:"text-align:center;" },
        		width: 25,
        		headerAttributes: {
              		  title:HEADER_EFF_DAYS_L_TOOLTIP
              	  },
              	  template: function(dataItem) {
        			var effDays = parent.getEffDaysStringFromSystemSetting(dataItem, "effDaysL");
        			var dayStringArray = effDays.split(" ");
        			return dayStringArray[0].charAt(0);
        		}
        		
        	}, {
        		field: "EFFDAYSL_D2",
        		title: getEffDaysConfiguration()[1]+HEADER_LOCAL_SUFFIX,
        		attributes:  { style:"text-align:center;" },
        		width: 25,
        		headerAttributes: {
              		  title:HEADER_EFF_DAYS_L_TOOLTIP
              	  },
              	  template: function(dataItem) {
              		var effDays = parent.getEffDaysStringFromSystemSetting(dataItem, "effDaysL");
        			var dayStringArray = effDays.split(" ");
        			return dayStringArray[0].charAt(1);
        		}
        		
        	}, {
        		field: "EFFDAYSL_D3",
        		title: getEffDaysConfiguration()[2]+HEADER_LOCAL_SUFFIX,
        		attributes:  { style:"text-align:center;" },
        		width: 25,
        		headerAttributes: {
              		  title:HEADER_EFF_DAYS_L_TOOLTIP
              	  },
              	  template: function(dataItem) {
              		var effDays = parent.getEffDaysStringFromSystemSetting(dataItem, "effDaysL");
        			var dayStringArray = effDays.split(" ");
        			return dayStringArray[0].charAt(2);
        		}
        		
        	}, {
        		field: "EFFDAYSL_D4",
        		title: getEffDaysConfiguration()[3]+HEADER_LOCAL_SUFFIX,
        		attributes:  { style:"text-align:center;" },
        		width: 25,
        		headerAttributes: {
              		  title:HEADER_EFF_DAYS_L_TOOLTIP
              	  },
              	  template: function(dataItem) {
              		var effDays = parent.getEffDaysStringFromSystemSetting(dataItem, "effDaysL");
        			var dayStringArray = effDays.split(" ");
        			return dayStringArray[0].charAt(3);
        		}
        		
        	}, {
        		field: "EFFDAYSL_D5",
        		title: getEffDaysConfiguration()[4]+HEADER_LOCAL_SUFFIX,
        		attributes:  { style:"text-align:center;" },
        		width: 20,
        		headerAttributes: {
              		  title:HEADER_EFF_DAYS_L_TOOLTIP
              	  },
              	  template: function(dataItem) {
              		var effDays = parent.getEffDaysStringFromSystemSetting(dataItem, "effDaysL");
        			var dayStringArray = effDays.split(" ");
        			return dayStringArray[0].charAt(4);
        		}
        		
        	}, {
        		field: "EFFDAYSL_D6",
        		title: getEffDaysConfiguration()[5]+HEADER_LOCAL_SUFFIX,
        		attributes:  { style:"text-align:center;" },
        		width: 25,
        		headerAttributes: {
              		  title:HEADER_EFF_DAYS_L_TOOLTIP
              	  },
              	  template: function(dataItem) {
              		var effDays = parent.getEffDaysStringFromSystemSetting(dataItem, "effDaysL");
        			var dayStringArray = effDays.split(" ");
        			return dayStringArray[0].charAt(5);
        		}
        		
        	}, {
        		field: "EFFDAYSL_D7",
        		title: getEffDaysConfiguration()[6]+HEADER_LOCAL_SUFFIX,
        		attributes:  { style:"text-align:center;" },
        		width: 25,
        		headerAttributes: {
              		  title:HEADER_EFF_DAYS_L_TOOLTIP
              	  },
              	  template: function(dataItem) {
              		var effDays = parent.getEffDaysStringFromSystemSetting(dataItem, "effDaysL");
        			var dayStringArray = effDays.split(" ");
        			return dayStringArray[0].charAt(6);
        		}
        		
        	}, {
        		field: "EFFWEEKSL_W1",
        		title: HEADER_W1+HEADER_LOCAL_SUFFIX,
        		attributes:  { style:"text-align:center;" },
        		width: 25,
        		headerAttributes: {
              		  title:HEADER_EFF_WEEKS_L_TOOLTIP
              	  },
              	  template: function(dataItem) {
        			var effDays = dataItem.effDaysL;
        			var dayStringArray = effDays.split(" ");
        			return dayStringArray[1].charAt(0);
        		}
        		
        	}, {
        		field: "EFFWEEKSL_W2",
        		title: HEADER_W2+HEADER_LOCAL_SUFFIX,
        		attributes:  { style:"text-align:center;" },
        		width: 25,
        		headerAttributes: {
              		  title:HEADER_EFF_WEEKS_L_TOOLTIP
              	  },
              	  template: function(dataItem) {
        			var effDays = dataItem.effDaysL;
        			var dayStringArray = effDays.split(" ");
        			return dayStringArray[1].charAt(1);
        		}
        		
        	}, {
        		field: "EFFWEEKSL_W3",
        		title: HEADER_W3+HEADER_LOCAL_SUFFIX,
        		attributes:  { style:"text-align:center;" },
        		width: 25,
        		headerAttributes: {
              		  title:HEADER_EFF_WEEKS_L_TOOLTIP
              	  },
              	  template: function(dataItem) {
        			var effDays = dataItem.effDaysL;
        			var dayStringArray = effDays.split(" ");
        			return dayStringArray[1].charAt(2);
        		}
        		
        	}, {
        		field: "EFFWEEKSL_W4",
        		title: HEADER_W4+HEADER_LOCAL_SUFFIX,
        		attributes:  { style:"text-align:center;" },
        		width: 25,
        		headerAttributes: {
              		  title:HEADER_EFF_WEEKS_L_TOOLTIP
              	  },
              	  template: function(dataItem) {
        			var effDays = dataItem.effDaysL;
        			var dayStringArray = effDays.split(" ");
        			return dayStringArray[1].charAt(3);
        		}
        		
        	}, {
        		hidden: !isFiveWeekPlan(),
        		field: "EFFWEEKSL_W5",
        		title: HEADER_W5+HEADER_LOCAL_SUFFIX,
        		attributes:  { style:"text-align:center;" },
        		width: 25,
        		headerAttributes: {
              		  title:HEADER_EFF_WEEKS_L_TOOLTIP
              	  },
              	  template: function(dataItem) {
        			var effDays = dataItem.effDaysL;
        			var dayStringArray = effDays.split(" ");
        			return dayStringArray[1].charAt(4);
        		}			
        	}, {
        		field: "CAL_BUTTON_L",
        		title: "&nbsp;",
        		template: calenderIBOBRowTemplateL,
        		filterable:false,
				sortable:false,
        		width: 25
        	}, {
        		field: "EFFDAYSZ_D1",
        		title: getEffDaysConfiguration()[0]+HEADER_ZULU_SUFFIX,
        		attributes:  { style:"text-align:center;" },
        		width: 25,
        		headerAttributes: {
              		  title:HEADER_EFF_DAYS_Z_TOOLTIP
              	  },
              	  template: function(dataItem) {
              		var effDays = parent.getEffDaysStringFromSystemSetting(dataItem, "effDaysZ");
        			var dayStringArray = effDays.split(" ");
        			return dayStringArray[0].charAt(0);
        		}
        		
        	}, {
        		field: "EFFDAYSZ_D2",
        		title: getEffDaysConfiguration()[1]+HEADER_ZULU_SUFFIX,
        		attributes:  { style:"text-align:center;" },
        		width: 25,
        		headerAttributes: {
              		  title:HEADER_EFF_DAYS_Z_TOOLTIP
              	  },
              	  template: function(dataItem) {
              		var effDays = parent.getEffDaysStringFromSystemSetting(dataItem, "effDaysZ");
        			var dayStringArray = effDays.split(" ");
        			return dayStringArray[0].charAt(1);
        		}
        		
        	}, {
        		field: "EFFDAYSZ_D3",
        		title: getEffDaysConfiguration()[2]+HEADER_ZULU_SUFFIX,
        		attributes:  { style:"text-align:center;" },
        		width: 25,
        		headerAttributes: {
              		  title:HEADER_EFF_DAYS_Z_TOOLTIP
              	  },
              	  template: function(dataItem) {
              		var effDays = parent.getEffDaysStringFromSystemSetting(dataItem, "effDaysZ");
        			var dayStringArray = effDays.split(" ");
        			return dayStringArray[0].charAt(2);
        		}
        		
        	}, {
        		field: "EFFDAYSZ_D4",
        		title: getEffDaysConfiguration()[3]+HEADER_ZULU_SUFFIX,
        		attributes:  { style:"text-align:center;" },
        		width: 25,
        		headerAttributes: {
              		  title:HEADER_EFF_DAYS_Z_TOOLTIP
              	  },
              	  template: function(dataItem) {
              		var effDays = parent.getEffDaysStringFromSystemSetting(dataItem, "effDaysZ");
        			var dayStringArray = effDays.split(" ");
        			return dayStringArray[0].charAt(3);
        		}
        		
        	}, {
        		field: "EFFDAYSZ_D5",
        		title: getEffDaysConfiguration()[4]+HEADER_ZULU_SUFFIX,
        		attributes:  { style:"text-align:center;" },
        		width: 20,
        		headerAttributes: {
              		  title:HEADER_EFF_DAYS_Z_TOOLTIP
              	  },
              	  template: function(dataItem) {
              		var effDays = parent.getEffDaysStringFromSystemSetting(dataItem, "effDaysZ");
        			var dayStringArray = effDays.split(" ");
        			return dayStringArray[0].charAt(4);
        		}
        		
        	}, {
        		field: "EFFDAYSZ_D6",
        		title: getEffDaysConfiguration()[5]+HEADER_ZULU_SUFFIX,
        		attributes:  { style:"text-align:center;" },
        		width: 25,
        		headerAttributes: {
              		  title:HEADER_EFF_DAYS_Z_TOOLTIP
              	  },
              	  template: function(dataItem) {
              		var effDays = parent.getEffDaysStringFromSystemSetting(dataItem, "effDaysZ");
        			var dayStringArray = effDays.split(" ");
        			return dayStringArray[0].charAt(5);
        		}
        		
        	}, {
        		field: "EFFDAYSZ_D7",
        		title: getEffDaysConfiguration()[6]+HEADER_ZULU_SUFFIX,
        		attributes:  { style:"text-align:center;" },
        		width: 25,
        		headerAttributes: {
              		  title:HEADER_EFF_DAYS_Z_TOOLTIP
              	  },
              	  template: function(dataItem) {
              		var effDays = parent.getEffDaysStringFromSystemSetting(dataItem, "effDaysZ");
        			var dayStringArray = effDays.split(" ");
        			return dayStringArray[0].charAt(6);
        		}
        		
        	},  {
        		field: "EFFWEEKSZ_W1",
        		title: HEADER_W1+HEADER_ZULU_SUFFIX,
        		attributes:  { style:"text-align:center;" },
        		width: 25,
        		headerAttributes: {
              		  title:HEADER_EFF_WEEKS_Z_TOOLTIP
              	  },
              	  template: function(dataItem) {
        			var effDays = dataItem.effDaysZ;
        			var dayStringArray = effDays.split(" ");
        			return dayStringArray[1].charAt(0);
        		}
        		
        	}, {
        		field: "EFFWEEKSZ_W2",
        		title: HEADER_W2+HEADER_ZULU_SUFFIX,
        		attributes:  { style:"text-align:center;" },
        		width: 25,
        		headerAttributes: {
              		  title:HEADER_EFF_WEEKS_Z_TOOLTIP
              	  },
              	  template: function(dataItem) {
        			var effDays = dataItem.effDaysZ;
        			var dayStringArray = effDays.split(" ");
        			return dayStringArray[1].charAt(1);
        		}
        		
        	}, {
        		field: "EFFWEEKSZ_W3",
        		title: HEADER_W3+HEADER_ZULU_SUFFIX,
        		attributes:  { style:"text-align:center;" },
        		width: 25,
        		headerAttributes: {
              		  title:HEADER_EFF_WEEKS_Z_TOOLTIP
              	  },
              	  template: function(dataItem) {
        			var effDays = dataItem.effDaysZ;
        			var dayStringArray = effDays.split(" ");
        			return dayStringArray[1].charAt(2);
        		}
        		
        	}, {
        		field: "EFFWEEKSZ_W4",
        		title: HEADER_W4+HEADER_ZULU_SUFFIX,
        		attributes:  { style:"text-align:center;" },
        		width: 25,
        		headerAttributes: {
              		  title:HEADER_EFF_WEEKS_Z_TOOLTIP
              	  },
              	  template: function(dataItem) {
        			var effDays = dataItem.effDaysZ;
        			var dayStringArray = effDays.split(" ");
        			return dayStringArray[1].charAt(3);
        		}
        		
        	}, {
        		field: "EFFWEEKSZ_W5",
        		hidden: true,
        		title: HEADER_W5+HEADER_ZULU_SUFFIX,
        		attributes:  { style:"text-align:center;" },
        		width: 25,
        		headerAttributes: {
              		  title:HEADER_EFF_WEEKS_Z_TOOLTIP
              	  },
              	  template: function(dataItem) {
        			var effDays = dataItem.effDaysZ;
        			var dayStringArray = effDays.split(" ");
        			return dayStringArray[1].charAt(4);
        		}			
        	}, {
        		field: "CAL_BUTTON_Z",
        		title: "&nbsp;",
        		template: calenderIBOBRowTemplateZ,
        		filterable:false,
				sortable:false,
        		width: 25
        	},{
		field: "laneStatus",
		title: HEADER_LANE_STATUS,
		attributes:  { style:"text-align:center;" },
		width: 65,
		headerAttributes: {
      		  title:HEADER_LANE_STATUS_TOOLTIP
      	  },
		template: function(dataItem) {
			var laneStatus = dataItem.laneStatus;
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
				return "<span style='color:"+color+"'>"+laneStatus+"</span>";
			}
			return "";
		}

	}];
	
	matrixCols = addProductGroupsColumns(matrixCols, true, undefined, true);
	
	matrixCols = matrixCols.concat(        	
        [    { field: "totalWeight", 
        		title: HEADER_WGT_TOTAL, 
        		attributes:{style:"text-align:right;"}, format:"{0:n0}",
        		width: 60 },
            { field: "totalCube", 
            	title: HEADER_CB_TOTAL, 
            	attributes:{style:"text-align:right;"}, format:"{0:n0}",
            	width: 70 }
        ]);
        
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