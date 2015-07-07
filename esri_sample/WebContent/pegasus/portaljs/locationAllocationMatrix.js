/**
* @author 888600 Abhishek Sharma
* This script belongs to Location Allocation Matrix Dashboard.
* Included in locationAllocationMatrix.jsp
*/

//Progress message in Location Allocation Matrix
var PROGRESS_DIALOG_MESSAGE_SCHEDULE_MATRIX = "Loading allocation matrix...";
//Calendar row template for Local & Zulu
var	calenderRowTemplateL="#= calenderRowEditor(data,'locAllocMatrixGrid','L') #";
var	calenderRowTemplateZ="#= calenderRowEditor(data,'locAllocMatrixGrid','Z') #";

var EFF_LOCAL_COLUMNS=["EFFDAYSL_D1","EFFDAYSL_D2","EFFDAYSL_D3","EFFDAYSL_D4","EFFDAYSL_D5","EFFDAYSL_D6","EFFDAYSL_D7",
     					"EFFWEEKSL_W1","EFFWEEKSL_W2","EFFWEEKSL_W3","EFFWEEKSL_W4"];
var EFF_ZULU_COLUMNS = ["EFFDAYSZ_D1","EFFDAYSZ_D2","EFFDAYSZ_D3","EFFDAYSZ_D4","EFFDAYSZ_D5","EFFDAYSZ_D6","EFFDAYSZ_D7",
    					"EFFWEEKSZ_W1","EFFWEEKSZ_W2","EFFWEEKSZ_W3","EFFWEEKSZ_W4"];
//Array for All Local columns
var LOCAL_COLUMNS = ["NOOP_DAYS_L", "CAL_BUTTON_L", "EFF_DATS_L", "KEYWORD_EFFDT_L", "DAY"];
//Array for All Zulu columns
var ZULU_COLUMNS = [ "NOOP_DAYS_Z", "CAL_BUTTON_Z", "EFF_DATS_Z", "KEYWORD_EFFDT_Z", "DAYZ"];

//Array for Week Local columns
var WEEK_COLUMNS_L = ["EFFWEEKSL_W5"];
//Array for Week Zulu columns
var WEEK_COLUMNS_Z = ["EFFWEEKSZ_W5"];
//Boolean flag to determine if the request is from Network Schedule or not
var isNetworkScheduleFlag;
//Var to have flag for Schedule or Network Schedule
var dayWhereClauses = {};
//Favorite component
var favoriteComponent;

var timeColLabelMap = new Object(); 
	timeColLabelMap["NOOP_DAYS_L"] = ["No Op Days"];
	timeColLabelMap["NOOP_DAYS_Z"] = ["No Op Days"];
	timeColLabelMap["DAY"] = ["Vol Day"];
	timeColLabelMap["DAYZ"] = ["Vol Day"];
	
var volColLabelMap = new Object(); 
	volColLabelMap["ALLOC_WEIGHT"] = ["Ttl Wt"];
	volColLabelMap["USED_WEIGHT"] = ["Used Wt"];
	volColLabelMap["EXCESS_WEIGHT"] = ["Excess Wt"];
	volColLabelMap["ALLOC_CUBE"] = ["Ttl Cu"];
	volColLabelMap["USED_CUBE"] = ["Used Cu"];
	volColLabelMap["EXCESS_CUBE"] = ["Excess Cu"];

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
	if(parent.isNetworkQuery && isNetworkScheduleFlag) {
		refreshMatrix();
	}
}

/**
* Called on Schedule Query success
* To refresh location allocation matrix.
*/
function onScheduleQuerySuccess() {
		refreshMatrix();			
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
	return getColumnsSettings('locAllocMatrixGrid');
}

/**
* Location allocation Contents setting
* get location allocation matrix contents favorites setting.
*/
function getContentFavoriteSettings() {
	return getMatrixContentFavoriteSettings('locAllocMatrixGrid');
}
function applyHeaderButtonSettings(headerButtonSettings) {
}

/**
* Location allocation Display option setting
* apply location allocation matrix display option favorites setting.
*/
function applyDisplayOptionSettings(displayOptionSettings, isDefaultFavorite, isApplicationLevel, isRefreshDashboard) {
	setColumnsSettings(displayOptionSettings,"locAllocMatrixGrid");
}

/**
* Location allocation Content setting
* apply location allocation matrix contents favorites setting.
*/
function applyContentFavoriteSettings(contentSettings, isDefaultFavorite, isApplicationLevel, isRefreshDashboard) {
	setMatrixContentFavoriteSettings('locAllocMatrixGrid',contentSettings);
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
	setMatrixFavoriteSettings(favoriteSettings);	
	if(flag == undefined) {
		setMatrixID("locAllocMatrixGrid");
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
	var matrixObject = this;
	var locationDiv =  $('<div id="locAllocMatrixGrid" style="width:100%;"></div>').appendTo("#locationAllocationMatrix");
	var element = locationDiv.kendoGrid({
		dataSource : {
		transport: {		
		read: {
		  url: function (options) {
		        return matrixURL +"&rand="+getTime(); 
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
		  			MV_NUM: {
						type: "string"
					},
					MV_NUM_SEQ: {
						type: "number"
					},
					ORIGIN: {
						type: "string"
					},
					DESTINATION: {
						type: "string"
					},
					EFF_DATS_L: {
						type: "string"
					},
					EFF_DATS_Z: {
						type: "string"
					},
					KEYWORD_EFFDT_L: {
						type: "string"
					},
					KEYWORD_EFFDT_Z: {
						type: "string"
					},
					LEG_HOL_DAYS_L: {
						type: "string"
					},
					LEG_HOL_DAYS_L: {
						type: "string"
					},
					DAY: {
						type: "string"
					},
					DAYZ: {
						type: "string"
					},
					NOOP_DAYS_L: {
						type: "string"
					},
					NOOP_DAYS_Z: {
						type: "string"
					},
					EQUIP_TYPE: {
						type: "string"
					},
					PROD_GRP_NM: {
						type: "string"
					},
					ALLOC_WEIGHT: {
						type: "number"
					},
					ALLOC_CUBE: {
						type: "number"
					},
					USED_WEIGHT: {
						type: "number"
					},
					USED_CUBE: {
						type: "number"
					},
					EXCESS_WEIGHT: {
						type: "number"
					},
					EXCESS_CUBE: {
						type: "number"
					},
					COMMENTS: {
						type: "string"
					}
				}
			},
			parse: function (d) {
				$.each(d, function (idx, dataItem) {				            	
						populateEffectiveDayColumns(dataItem, "EFF_DATS_L", "EFF_DATS_Z");								
		        });
		        return d;
			}
		},
	        aggregate: [
			  { field: "ALLOC_WEIGHT", aggregate: "sum" },
			  { field: "ALLOC_CUBE", aggregate: "sum" },
			  { field: "USED_WEIGHT", aggregate: "sum" },
			  { field: "USED_CUBE", aggregate: "sum" },
			  { field: "EXCESS_WEIGHT", aggregate: "sum" },
			  { field: "EXCESS_CUBE", aggregate: "sum" }
		   ],
		  requestStart: function(e) {
				 showProgressDialog(true, PROGRESS_DIALOG_MESSAGE_SCHEDULE_MATRIX);
		  },
		  requestEnd: function(e) {
		  	  showProgressDialog(false);
			  onResize();	
			  if(renderEmpty) {
		  	  		renderEmpty = false;
		  	  } else {		   
		  	  	parent.setDashboardDataStatus(parent.DASHBOARD_ID_ALLOCATION_MATRIX, getDataType(), true);
			  	setTimeout( function() {
			  			applyMatrixSortFilterGroupByFavoriteSettings();
						//sync other dashboards
						populateIdsAndSync();
						validateMatrixCheckboxStates("locAllocMatrixGrid");
					}, 100);			  	
				}		  
		  },
		  error: function(e) {
		  	  if(renderEmpty) {
		  	  	renderEmpty = false;
		  	  }
		  	  checkForTimeoutError(e);
			  showProgressDialog(false);
			  parent.setDashboardDataStatus(parent.DASHBOARD_ID_ALLOCATION_MATRIX, getDataType(), true);
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
		scrollable: true,
		columns: getMatrixColumns(favColumns)
	});
	
	refreshMatrix();
	if(flag == undefined) {
		refresh();
		initializeDisplayOptions();
		parent.setDashboardInitialized(parent.DASHBOARD_ID_ALLOCATION_MATRIX);
	}
	//setEffectiveSeperateDays();
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
	}, {
		hidden: true,
		field: "EFFDAYSL_D1",
		title: getEffDaysConfiguration()[0]+HEADER_LOCAL_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_EFF_DAYS_L_TOOLTIP
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
      		  title:HEADER_EFF_DAYS_L_TOOLTIP
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
      		  title:HEADER_EFF_DAYS_L_TOOLTIP
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
      		  title:HEADER_EFF_DAYS_L_TOOLTIP
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
      		  title:HEADER_EFF_DAYS_L_TOOLTIP
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
      		  title:HEADER_EFF_DAYS_L_TOOLTIP
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
      		  title:HEADER_EFF_DAYS_L_TOOLTIP
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
      		  title:HEADER_EFF_WEEKS_L_TOOLTIP
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
      		  title:HEADER_EFF_WEEKS_L_TOOLTIP
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
      		  title:HEADER_EFF_WEEKS_L_TOOLTIP
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
      		  title:HEADER_EFF_WEEKS_L_TOOLTIP
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
      		  title:HEADER_EFF_WEEKS_L_TOOLTIP
      	  },
        	template: function(dataItem) {
          	  	return applyEffectiveDaysWeekTemplate(dataItem, "EFFWEEKSL_W", 5);			
    		}	
	}, {
		hidden: true,
		field: "EFF_DATS_L",
		title: HEADER_EFF_DAYS_L,
		attributes:  { style:"text-align:center;" },
		width: 120,
		headerAttributes: {
      		  title:HEADER_EFF_DAYS_L_TOOLTIP
      	  },
      	  template: function(dataItem) {
  			return parent.getEffDaysStringFromSystemSetting(dataItem, "EFF_DATS_L");
  		}
	}, {
		hidden:!isLocalTimeFlag(),
		field: "KEYWORD_EFFDT_L",
		title: HEADER_KEY_EFF_DAYS_L,
		attributes:  { style:"text-align:left;" },
		width: 175,
		headerAttributes: {
    		  title:HEADER_KEY_EFF_DAYS_L_TOOLTIP
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
		field: "DAY",
		title: HEADER_VOL_DAY,
		attributes:  { style:"text-align:center;" },
		width: 40,
		headerAttributes: {
      		  title:HEADER_VOL_DAY_L_TOOLTIP
      	  }	
	}, {
		hidden: true,
		field: "EFFDAYSZ_D1",
		title: getEffDaysConfiguration()[0]+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_EFF_DAYS_Z_TOOLTIP
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
      		  title:HEADER_EFF_DAYS_Z_TOOLTIP
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
      		  title:HEADER_EFF_DAYS_Z_TOOLTIP
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
      		  title:HEADER_EFF_DAYS_Z_TOOLTIP
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
      		  title:HEADER_EFF_DAYS_Z_TOOLTIP
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
      		  title:HEADER_EFF_DAYS_Z_TOOLTIP
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
      		  title:HEADER_EFF_DAYS_Z_TOOLTIP
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
      		  title:HEADER_EFF_WEEKS_Z_TOOLTIP
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
      		  title:HEADER_EFF_WEEKS_Z_TOOLTIP
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
      		  title:HEADER_EFF_WEEKS_Z_TOOLTIP
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
      		  title:HEADER_EFF_WEEKS_Z_TOOLTIP
      	  },
      	template: function(dataItem) {
      	  	return applyEffectiveDaysWeekTemplate(dataItem, "EFFWEEKSZ_W", 4);			
		}
	}, {
		hidden:true,
		field: "EFFWEEKSZ_W5",
		title: HEADER_W5+HEADER_ZULU_SUFFIX,
		attributes:  { style:"text-align:center;" },
		width: 25,
		headerAttributes: {
      		  title:HEADER_EFF_WEEKS_Z_TOOLTIP
      	  },
      	template: function(dataItem) {
      	  	return applyEffectiveDaysWeekTemplate(dataItem, "EFFWEEKSZ_W", 5);			
		}
	}, {
		hidden: true,
		field: "EFF_DATS_Z",
		title: HEADER_EFF_DAYS_Z,
		attributes:  { style:"text-align:center;" },
		width: 120,
		headerAttributes: {
      		  title:HEADER_EFF_DAYS_Z_TOOLTIP
      	  },
      	  template: function(dataItem) {
    			return parent.getEffDaysStringFromSystemSetting(dataItem, "EFF_DATS_Z");
    		}
	}, {
		hidden:isLocalTimeFlag(),
		field: "KEYWORD_EFFDT_Z",
		title: HEADER_KEY_EFF_DAYS_Z,
		attributes:  { style:"text-align:left;" },
		width: 175,
		headerAttributes: {
    		  title:HEADER_KEY_EFF_DAYS_Z_TOOLTIP
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
	},{
		hidden:isLocalTimeFlag(),
		field: "CAL_BUTTON_Z",
		title: "&nbsp;",
		template: calenderRowTemplateZ,
		filterable:false,
		sortable:false,
		width: 25
	}, {
		hidden:isLocalTimeFlag(),
		field: "DAYZ",
		title: HEADER_VOL_DAY,
		attributes:  { style:"text-align:center;" },
		width: 40,
		headerAttributes: {
      		  title:HEADER_VOL_DAY_L_TOOLTIP
      	  }	
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
		field: "EQUIP_TYPE",
		title: HEADER_EQ,
		attributes:  { style:"text-align:center;" },
		width: 40,
		headerAttributes: {
  		  title:HEADER_EQ_TOOLTIP
  	  }
	},{
		field: "PROD_GRP_NM",
		title: HEADER_PROD_GRP,
		attributes:  { style:"text-align:center;" },
		width: 70,
		headerAttributes: {
  		  title:HEADER_PROD_GRP_TOOLTIP
  	  }
	},{
		field: "ALLOC_WEIGHT",
		title: HEADER_WGT_TOTAL,
		attributes:{style:"text-align:right;"}, format:"{0:n0}",
		width: 65,
		aggregates: ["sum"],
		footerTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		groupFooterTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		headerAttributes: {
      		  title:HEADER_WGT_TOTAL_ALLOWED_TOOLTIP
      	  }
	},{
		field: "ALLOC_CUBE",
		title: HEADER_CB_TOTAL,
		attributes:{style:"text-align:right;"}, format:"{0:n0}",
		width: 65,
		aggregates: ["sum"],
		footerTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		groupFooterTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		headerAttributes: {
      		  title:HEADER_CB_TOTAL_ALLOWED_TOOLTIP
      	  }
	},{
		field: "USED_WEIGHT",
		title: HEADER_WGT_USED,
		attributes:{style:"text-align:right;"}, format:"{0:n0}",
		width: 70,
		aggregates: ["sum"],
		footerTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		groupFooterTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		headerAttributes: {
      		  title:HEADER_WGT_USED_TOOLTIP
      	  }
	},{
		field: "USED_CUBE",
		title: HEADER_CB_USED,
		attributes:{style:"text-align:right;"}, format:"{0:n0}",
		width: 70,
		aggregates: ["sum"],
		footerTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		groupFooterTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		headerAttributes: {
      		  title:HEADER_CB_USED_TOOLTIP
      	  }
	},{
		field: "EXCESS_WEIGHT",
		title: HEADER_WGT_EX,
		attributes:{style:"text-align:right;"}, format:"{0:n0}",
		width: 60,
		aggregates: ["sum"],
		footerTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		groupFooterTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		headerAttributes: {
      		  title:HEADER_WGT_EX_TOOLTIP
      	  }
	},{
		field: "EXCESS_CUBE",
		title: HEADER_CB_EX,
		attributes:{style:"text-align:right;"}, format:"{0:n0}",
		width: 60,
		aggregates: ["sum"],
		footerTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		groupFooterTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
		headerAttributes: {
      		  title:HEADER_CB_EX_TOOLTIP
      	  }
	},{
		field: "COMMENTS",
		attributes:  { style:"text-align:center;" },
		width: 70,
		title: HEADER_COMMENT,
		headerAttributes: {
      		  title:HEADER_COMMENT
      	  }
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
		map["All_Local_Columns"] =$.merge($.merge([],getLocalColumns()),WEEK_COLUMNS_L);	
		map["All_Zulu_Columns"] = $.merge($.merge([],getZuluColumns()),WEEK_COLUMNS_Z);
	}else{
		map["All_Local_Columns"] =getLocalColumns();
		map["All_Zulu_Columns"] = getZuluColumns();
	}
	showLocalOrZuluMatrixColumns("locAllocMatrixGrid", map["All_Local_Columns"], map["All_Zulu_Columns"], isLocalTimeFlag());
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
		$.merge(colToHide,WEEK_COLUMNS_L);
		$.merge(colToHide,WEEK_COLUMNS_Z);
	}
	return colToHide;

}
function setSearchCriteria() {
}

/**
* Location allocation local columns method
* Method to get local columns of Location allocation matrix.
*/
function getLocalColumns() {
	return $.merge($.merge([],LOCAL_COLUMNS),EFF_LOCAL_COLUMNS);
}

/**
* Location allocation zulu columns method
* Method to get zulu columns of Schedule matrix.
*/
function getZuluColumns() {
	return $.merge($.merge([],ZULU_COLUMNS),EFF_ZULU_COLUMNS);
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
function resetDashboard(restoreDefaultFavorite, isClearOperation){
	if(restoreDefaultFavorite != undefined || (isClearOperation != undefined && isClearOperation)){
		resetGridContent(getMatrixID());
		resetSettingsChkBoxes(getMatrixID());
	}else{
		//restore default favorite
		favoriteComponent.applyDefaultFavorite();
	}	
}

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