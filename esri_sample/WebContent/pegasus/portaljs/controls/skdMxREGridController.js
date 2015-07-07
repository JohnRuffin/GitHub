var SkdMxREGridHelper = (function() {
    function constructorFn() {
    	this.commonGridManager;
        this.routeGridManager;
        this.legsGridManager;
        this.allocationGridManager;
        this.seasonsGridManager;
        this.locAllocationGridManager;
    };
    constructorFn.getCommonGridManager = function() {
        if (this.commonGridManager == undefined) {
            this.commonGridManager = (new CommonGridManager()).getInstance();
        }
        return this.commonGridManager;
    };
    constructorFn.getRouteGridManager = function() {
        if (this.routeGridManager == undefined) {
            this.routeGridManager = (new RouteGridManager()).getInstance();
        }
        return this.routeGridManager;
    };
    constructorFn.getLegsGridManager = function() {
        if (this.legsGridManager == undefined) {
            this.legsGridManager = (new LegsGridManager()).getInstance();
        }
        return this.legsGridManager;
    };
    constructorFn.getAllocationGridManager = function() {
        if (this.allocationGridManager == undefined) {
            this.allocationGridManager = (new AllocationGridManager()).getInstance();
        }
        return this.allocationGridManager;
    };
    constructorFn.getSeasonsGridManager = function() {
        if (this.seasonsGridManager == undefined) {
            this.seasonsGridManager = (new SeasonsGridManager()).getInstance();
        }
        return this.seasonsGridManager;
    };
    constructorFn.getLocAllocationGridManager = function() {
        if (this.locAllocationGridManager == undefined) {
            this.locAllocationGridManager = (new LocAllocationGridManager()).getInstance();
        }
        return this.locAllocationGridManager;
    };
    return constructorFn;
})();

function CommonGridManager() {

    function constructorFn() {
        this.initialize();
    };
    constructorFn.initialize = function() {
        //
    };
    constructorFn.getCalenderRowTemplate = function(grid_Id, localZuluFlag, dashboardId, isShowOnly,isAllocationField) {
    	return "#= " + parent.SkdGridHelper.getSkdGridManager().calenderRowEditor + "(data,'" + grid_Id + "','" + localZuluFlag + "','" + dashboardId + "','" + isShowOnly + "','" + isAllocationField + "') #";
    };
    constructorFn.getAddRowTemplate = function(grid_Id,isAllocation,dashboardID) {
    	return "#= addRowTemplate(data,'" + grid_Id + "','" + isAllocation + "','" + dashboardID + "') #";
    };

    constructorFn.getDeleteRowTemplate = function(grid_Id,isAllocation,dashboardID) {
    	return "#= deleteRowtemplate(data,'" + grid_Id + "','" + isAllocation + "','" + dashboardID + "') #";
    };
    
    constructorFn.getDeleteRouteRowTemplate = function(grid_Id,dashboardID) {
    	return "#= deleteRouteRowtemplate(data,'" + grid_Id + "', '" + dashboardID + "') #";
    };
  
    constructorFn.getRouteRowEditor = function(grid_Id) {
    	return "#= " + SkdMxREGridHelper.getCommonGridManager().routeRowEditor + "(data,'" + grid_Id + "') #";
    };
    constructorFn.routeRowEditor = function(data, grid_Id) {
    	var route;
    	if(data.CHANGE_FLAG == "Deleted") {
    		route="<img src ='"+ICON_IMAGE_PATH_ROUTE+"' style='margin-left:-1px;'/>";
    	} else {
    		route="<img src ='"+ICON_IMAGE_PATH_ROUTE+"' title='Select Route' style='margin-left:-1px;cursor:pointer' onclick= routeRowHandler(this,'"+grid_Id+"') />";
    	}
    	return route;
    };
    constructorFn.revisionComentButtonRowTemplatehandler = function(data,grid_Id){
    	var commentList = getCommnentData(data.COMMENTS);
    	var revisionList;
    	var revisionCount =0;
    	if (commentList != null) {
    		revisionList = $.grep(commentList, function(obj) {
    			return (obj["commentTypeCd"].type == 1);
    		});
    		if (revisionList != null && revisionList.length > 0) {
    			revisionCount = revisionList.length;
    		}
    	}
    	/*(if (data["OPERATION_CD"] =="Insert") {
    		return "<input type='button' disabled class='k-revision-comment' value ='New/Edit("+revisionCount+")' style='min-width:60px!important;min-height: 20px!important;' onclick=revisionCommentButtonRowHandler(this,'"+grid_Id+"') /><label style='min-width: 1px;'></label>";
    	} else {*/
    		return "<input type='button' class='k-revision-comment' value ='New/Edit("+revisionCount+")' style='min-width:60px!important;min-height: 20px!important;' onclick=revisionCommentButtonRowHandler(this,'"+grid_Id+"') /><label style='min-width: 1px;'></label>";
    	//}
    	
    };
    
    constructorFn.intenalCommentButtonRowTemplatehandler = function(data,grid_Id) {
    	var commentList = getCommnentData(data.COMMENTS);
    	var revisionList;
    	var revisionCount =0;
    	if (commentList != null) {
    		revisionList = $.grep(commentList, function(obj) {
    			return (obj["commentTypeCd"].type == 0);
    		});
    		if (revisionList != null && revisionList.length > 0) {
    			revisionCount = revisionList.length;
    		}
    	}
    	return "<input type='button'  class='k-internal-comment' value ='New/Edit("+revisionCount+")' style='min-width:60px!important;min-height: 20px!important;' onclick=internalCommentButtonRowHandler(this,'"+grid_Id+"') /><label style='min-width: 1px;'></label>";
    };
    constructorFn.locationAllocationCheckboxRowTemplatehandler = function(data,grid_Id){
    	data["IS_LOCAL"] = isLocalTimeFlag() ? "0" : "1";
    	if(((!isLocalTimeFlag() && isNotEmptyOrNull(data["ALLOCATION_EFF_L"])) || (isLocalTimeFlag() && isNotEmptyOrNull(data["ALLOCATION_EFF_Z"]))) && isNotEmptyOrNull(data["PROD_GRP_NM"]) && isNotEmptyOrNull(data["ALLOC_WEIGHT"]) && isNotEmptyOrNull(data["ALLOC_CUBE"])) {
	    	if(!data["LOC_ALLOCATION"]){
	    		return "<input type='checkbox' class='k-loc-allocation' onclick=locationAllocationCheckboxRowHandler(this,'"+grid_Id+"') /><label style='min-width: 1px;'></label>";
	    	}else{
	    		return "<input type='checkbox' checked='checked' class='k-loc-allocation' onclick=locationAllocationCheckboxRowHandler(this,'"+grid_Id+"') /><label style='min-width: 1px;'></label>";
	    	}
    	}else {
    		return "<input type='checkbox' disabled class='k-loc-allocation' onclick=locationAllocationCheckboxRowHandler(this,'"+grid_Id+"') /><label style='min-width: 1px;'></label>";
    	}
    };
    
    constructorFn.isNotEmptyOrNull = function(string) {
    	if(string != undefined && string != null && string != 'undefined' && string != 'null' && string.toString().trim() != EMPTY_STRING) {
    		return true;
    	}
    	return false;
    };
    
    var _instance = null;

    return {
        getInstance: function() {
            if (_instance == undefined) {
                _instance = constructorFn;
                _instance.initialize();
            }
            return _instance;
        }
    };
};    
    
function RouteGridManager() {

    function constructorFn() {
        this.initialize();
    };

    constructorFn.initialize = function() {
        //
    };

    constructorFn.getRouteGridColumns = function(grid_Id,dashboardID) {
    	if(menu == "FT" || menu == "FF" || menu == "FC" || menu == "TO" || menu == "TSG") {
    		return this.getRouteGridFlightColumns(grid_Id,dashboardID);
    	}else {
    		return this.getRouteGridTruckColumns(grid_Id,dashboardID);
    	}
    };

    constructorFn.getRouteGridFlightColumns =  function(grid_Id,dashboardID) {
    	var	calenderRowTemplateL = SkdMxREGridHelper.getCommonGridManager().getCalenderRowTemplate(grid_Id, "L", dashboardID);
    	var	calenderRowTemplateZ = SkdMxREGridHelper.getCommonGridManager().getCalenderRowTemplate(grid_Id, "Z", dashboardID);
    	var routeRowTemplate = SkdMxREGridHelper.getCommonGridManager().getRouteRowEditor(grid_Id);
    	return [{
    			field : "ROUTE_ID",
    			title : " ",
    			hidden : true,
    			width : "20px",
    			attributes : {
    				style : "padding-left:4px;"
    			},
    			headerAttributes : {
    				title : "Route Id",
    				style:"text-align:center;"
    			}
    		},/*{
    			hidden : false,
    			sortable : false,
    			filterable : false,
    			editable:false,
    			title: EMPTY_STRING, 
    			width: "15px", 
    			attributes: {
    				style:"text-align:center;"
    			}, 
    			template: function(data) {
    				return duplicateRouteRadioRowTemplatehandler(data,grid_Id);
    			},
    			headerAttributes: {
          		  	title:"Internal Comment",
          		  	style:"text-align:center;"
          	  	}
        	},*/{ 
    			field : "MV_NUM",
    			title : "Mv No*",
    			width : "50px",
    			hidden : false,
    			sortable : false,
    			filterable : false,
    			editable:true,
    			attributes : {
    				style:"border-right:none !important"
    			},
    			headerAttributes: {
          		  	title:"Move Number",
          		  	style: "text-align:center;padding-right: 0px !important;padding-left:12px !important;overflow:visible !important; border-right:none !important"
          	  	}
    		},{
    			field : "ROUTE_BUTTON",
    			title : " ",
    			width : "16px",
    			hidden : false,
    			sortable : false,
    			filterable : false,
    			editable:false,
    			template: routeRowTemplate,
    			attributes: {
    				style:"text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
    			},
    			headerAttributes: {
    				style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
    			}	
    		},{
    			field : "FULL_EFFDAY_HOLIDAY_L",
    			title : "Route Eff Days (L)*",
    			width : "150px",
    			hidden : isLocalTimeFlag(),
    			sortable : false,
    			filterable : false,
    			editable:false,
    			attributes : {
    				style:"border-right:none !important"
    			},
    			headerAttributes: {
          		  	title:"Route Effective Days",
          		  	style: "text-align:center;padding-right: 0px !important;padding-left:12px !important;overflow:visible !important; border-right:none !important"
          	  	}
    		},{
    			field : "CAL_BUTTON_L",
    			title : " ",
    			width : "14px",
    			hidden : isLocalTimeFlag(),
    			sortable : false,
    			filterable : false,
    			editable:false,
    			template: calenderRowTemplateL,
    			attributes: {
    				style:"text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
    			},
    			headerAttributes: {
    				style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
    			}	
    		},{
    			field : "FULL_EFFDAY_HOLIDAY_Z",
    			title : "Route Eff Days (Z)*",
    			hidden: !isLocalTimeFlag(),
    			width : "150px",
    			attributes : {
    				style:"border-right:none !important"
    			},
    			headerAttributes : {
    				title : "Route Effective Days",
    				style: "text-align:center;padding-right: 0px !important;padding-left:12px !important;overflow:visible !important; border-right:none !important"
    			}
    		},{
    			field : "CAL_BUTTON_Z",
    			title: " ",
    			hidden: !isLocalTimeFlag(),
    			width: "14px",
    			template: calenderRowTemplateZ,
    			attributes: {
    				style:"text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
    			},
    			headerAttributes: {
    				style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
    			}
    		},{
    			field : "LEG_TYPE",
    			title : "Leg Type*",
    			width : "40px",
    			hidden : false,
    			sortable : false,
    			filterable : false,
    			editable:true,
    			attributes : {
    				style:"border-right:none !important"
    			},
    			headerAttributes: {
          		  	title:"Leg Type",
          		  	style:"text-align:center;"
          	  	}
    		},{
          	  	title: EMPTY_STRING,
          	  	template: function(data) {
          	  		return parent.SkdGridHelper.getSkdGridManager().arrowIconRowTemplate(data, grid_Id, "LegTypeRequest", "routeLegTypeTextArea", "LEG_TYPE", dashboardID);
          	  	},
          	  	width:"14px",
          	  	editable:false,
          	  	attributes: {
          	  		style:"text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
          	  	},
          	  	headerAttributes: {
          	  		style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
          	  	}
        	},{
    			field : "EQUIP_TYPE",
    			title : "Equip Type*",
    			width : "40px",
    			hidden : false,
    			sortable : false,
    			filterable : false,
    			editable:true,
    			attributes : {
    				style:"border-right:none !important"
    			},
    			headerAttributes: {
          		  	title:"Equipment Type",
          		  	style:"text-align:center;"
          	  	}
    		},{
      	  		title: EMPTY_STRING,
      	  		template: function(data) {
      	  			return parent.SkdGridHelper.getSkdGridManager().arrowIconRowTemplate(data, grid_Id, "EquipTypeRequest", "routeEquipTypeTextArea", "EQUIP_TYPE", dashboardID);
      	  		},
      	  		width:"14px",
      	  		editable:false,
      	  		attributes: {
      	  			style:"text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
      	  		},
      	  		headerAttributes: {
      	  			style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
      	  		}
        	},{
    			field : "CARRIER_TYPE",
    			title : "Carrier*",
    			width : "50px",
    			hidden : false,
    			sortable : false,
    			filterable : false,
    			editable: true,
    			attributes : {
    				style:"border-right:none !important"
    			},
    			headerAttributes: {
          		  	title:"Carrier Type",
          		  	style:"text-align:center;"
          	  	}
    		},{
      	  		title: EMPTY_STRING,
      	  		template: function(data) {
      	  			return parent.SkdGridHelper.getSkdGridManager().arrowIconRowTemplate(data, grid_Id, "CarrierTypeRequest", "carrierTypeTextArea", "CARRIER_TYPE", dashboardID);
      	  		},
      	  		width:"14px",
      	  		editable:false,
      	  		attributes: {
      	  			style:"text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
      	  		},
      	  		headerAttributes: {
      	  			style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
      	  		}
        	},{
    			field : "SCAC_CD",
    			title : "SCAC Code",
    			width : "40px",
    			hidden : ((menu == "TO" || menu == "TSG") ? true : false),
    			sortable : false,
    			filterable : false,
    			//editable:(menu == "FF" ? true : false),
    			editable:false,
    			attributes : {
    				//style: (menu == "FF" ? "border-right:none !important" : "")
    				style: ""
    			},
    			headerAttributes: {
          		  	title:"SCAC Code",
          		  	style:"text-align:center;"
          	  	}
    		},{
      	  		title: EMPTY_STRING,
      	  		template: function(data) {
      	  			return parent.SkdGridHelper.getSkdGridManager().arrowIconRowTemplate(data, grid_Id, "ScacCodeRequest", "scacCodeTextArea", "SCAC_CD", dashboardID);
      	  		},
      	  		width:"14px",
      	  		editable:false,
      	  		hidden : true,
      	  		attributes: {
      	  			style:"text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
      	  		},
      	  		headerAttributes: {
      	  			style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
      	  		}
        	},{
    			field : "DAILYRATE_PLUSCC_CHG_AMT",
    			title : "Daily Route Cost",
    			width : "100px",
    			hidden : ((menu == "FT" || menu == "FF" || menu == "FC") ? false : true),
    			sortable : false,
    			filterable : false,
    			editable:false,
    			attributes : {
    				style : "padding-left:4px;"
    			},
    			headerAttributes: {
          		  	title:"Daily Route Cost",
          		  	style:"text-align:center;"
          	  	}
    		},{
    			field : "TOTALMONTH_COST_AMT",
    			title : "Monthly Route Cost",
    			width : "100px",
    			hidden : ((menu == "FT" || menu == "FF" || menu == "FC") ? false : true),
    			sortable : false,
    			filterable : false,
    			editable:false,
    			attributes : {
    				style : "padding-left:4px;"
    			},
    			headerAttributes: {
          		  	title:"Monthly Route Cost",
          		  	style:"text-align:center;"
          	  	}
    		},
    		{
    			hidden : false,
    			sortable : false,
    			filterable : false,
    			editable:((menu != null) ? false : true),
    			title: "Revision Comment", 
    			width: "65px", 
    			attributes: {
    				style:"text-align:center;"
    			}, 
    			template: function(data) {
    				return SkdMxREGridHelper.getCommonGridManager().revisionComentButtonRowTemplatehandler(data,grid_Id);
    			},
    			headerAttributes: {
          		  	title:"Revision Comment",
          		  	style:"text-align:center;"
          	  	}
        	},{
    			hidden : false,
    			sortable : false,
    			filterable : false,
    			editable:((menu != null) ? false : true),
    			title: "Internal Comment", 
    			width: "65px", 
    			attributes: {
    				style:"text-align:center;"
    			}, 
    			template: function(data) {
    				return SkdMxREGridHelper.getCommonGridManager().intenalCommentButtonRowTemplatehandler(data,grid_Id);
    			},
    			headerAttributes: {
          		  	title:"Internal Comment",
          		  	style:"text-align:center;"
          	  	}
        	},{
    			field : "USE_LEG_MINS_FLAG",
    			title : "Manually Timed",
    			width : "60px",
    			hidden : ((menu == "FF" || menu == "FT") ? true : false),
    			sortable : false,
    			filterable : false,
    			editable:true,
    			attributes : {
    				style : "padding-left:4px;"
    			},
    			template: function(data) {
    				return manTimedCheckboxRowTemplatehandler(data,grid_Id);
    			},
    			headerAttributes: {
          		  	title:"Manually Timed",
          		  	style:"text-align:center;"
          	  	}
    		}
        ];
    };

    constructorFn.getRouteGridTruckColumns =  function(grid_Id,dashboardID) {
    	var	calenderRowTemplateL = SkdMxREGridHelper.getCommonGridManager().getCalenderRowTemplate(grid_Id, "L", dashboardID);
    	var	calenderRowTemplateZ = SkdMxREGridHelper.getCommonGridManager().getCalenderRowTemplate(grid_Id, "Z", dashboardID);
    	var routeRowTemplate=SkdMxREGridHelper.getCommonGridManager().getRouteRowEditor(grid_Id);
    	return [/*{
    			hidden : true,
    			sortable : false,
    			filterable : false,
    			editable:false,
    			title: EMPTY_STRING, 
    			width: "20px", 
    			attributes: {
    				style:"text-align:center;"
    			}, 
    			template: function(data) {
    				return checkboxRowTemplatehandler(data,grid_Id);
    			},
    			headerAttributes: {
          		  	title:"checkbox"
          	  	}
        	},*/
        	{
    			field : "ROUTE_TYPE_CD",
    			title : "Route Type",
    			width : "70px",
    			hidden : true,
    			sortable : false,
    			filterable : false,
    			editable: true,
    			attributes : {
    				style:"border-right:none !important"
    			},
    			headerAttributes: {
          		  	title:"Route Type",
          		  	style:"text-align:center;"
          	  	}
    		},{
      	  		title: EMPTY_STRING,
      	  		template: function(data) {
      	  			return parent.SkdGridHelper.getSkdGridManager().arrowIconRowTemplate(data, grid_Id, "RouteTypeRequest", "routeTypeTextArea", "ROUTE_TYPE_CD", dashboardID);
      	  		},
      	  		width:"14px",
      	  		editable:false,
      	  		attributes: {
      	  			style:"text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
      	  		},
      	  		headerAttributes: {
      	  			style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
      	  		}
        	},{    			hidden : true,    			sortable : false,
    			filterable : false,
    			editable:false,
    			title: "Temp Rte", 
    			width: "40px", 
    			attributes: {
    				style:"text-align:center;"
    			}, 
    			template: function(data) {
    				return tempRouteCheckboxRowTemplatehandler(data,grid_Id);
    			},
    			headerAttributes: {
          		  	title:"Temporary Route",
          		  	style:"text-align:center;"
          	  	}
        	},{
    			field : "EXPIRATION_DATE",
    			title : "Expiration Date",
    			format:"{0:yyyy-MM-dd HH:mm}",
    			editor: dateTimeEditor,
    			width : "100px",
    			hidden : true,
    			sortable : false,
    			filterable : false,
    			editable: true,
    			attributes : {
    				style : "padding-left:4px;"
    			},
    			headerAttributes: {
          		  	title:"Expiration Date",
          		  	style:"text-align:center;"
          	  	}
    		},{
    			field : "CARRIER_TYPE",
    			title : "Carrier*",
    			width : "50px",
    			hidden : false,
    			sortable : false,
    			filterable : false,
    			editable: true,
    			attributes : {
    				style:"border-right:none !important"
    			},
    			headerAttributes: {
          		  	title:"Carrier",
          		  	style:"text-align:center;"
          	  	}
    		},{
      	  		title: EMPTY_STRING,
      	  		template: function(data) {
      	  			return parent.SkdGridHelper.getSkdGridManager().arrowIconRowTemplate(data, grid_Id, "CarrierTypeRequest", "carrierTypeTextArea", "CARRIER_TYPE", dashboardID);
      	  		},
      	  		width:"14px",
      	  		editable:false,
      	  		attributes: {
      	  			style:"text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
      	  		},
      	  		headerAttributes: {
      	  			style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
      	  		}
        	},{
    			field : "ROUTE_ID",
    			title : "Mv No",
    			hidden : true,
    			width : "20px",
    			attributes : {
    				style : "padding-left:4px;"
    			},
    			headerAttributes : {
    				title : "Mv No",
    				style:"text-align:center;"
    			}
    		},{ 
    			field : "MV_NUM",
    			title : "Mv No*",
    			width : "60px",
    			hidden : false,
    			sortable : false,
    			filterable : false,
    			editable:true,
    			attributes : {
    				style:"border-right:none !important"
    			},
    			headerAttributes: {
          		  	title:"Mv No",
          		  	style: "text-align:center;padding-right: 0px !important;padding-left:12px !important;overflow:visible !important; border-right:none !important"
          	  	}
    		},{
    			field : "ROUTE_BUTTON",
    			title : " ",
    			width : "16px",
    			hidden : false,
    			sortable : false,
    			filterable : false,
    			editable:false,
    			template: routeRowTemplate,
    			attributes: {
    				style:"text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
    			},
    			headerAttributes: {
    				style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
    			}	
    		},{
    			field : "FULL_EFFDAY_HOLIDAY_L",
    			title : "Route Eff Days (L)*",
    			width : "150px",
    			hidden : isLocalTimeFlag(),
    			sortable : false,
    			filterable : false,
    			editable:false,
    			attributes : {
    				style:"border-right:none !important"
    			},
    			headerAttributes: {
          		  	title:"Route Effective Days",
          		  	style: "text-align:center;padding-right: 0px !important;padding-left:12px !important;overflow:visible !important; border-right:none !important"
          	  	}
    		},{
    			field : "CAL_BUTTON_L",
    			title : " ",
    			width : "14px",
    			hidden : false,
    			sortable : false,
    			filterable : false,
    			editable:false,
    			template: calenderRowTemplateL,
    			attributes: {
    				style:"text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
    			},
    			headerAttributes: {
    				style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
    			}	
    		},{
    			field : "FULL_EFFDAY_HOLIDAY_Z",
    			title : "Route Eff Days (Z)*",
    			hidden: !isLocalTimeFlag(),
    			width : "150px",
    			attributes : {
    				style:"border-right:none !important"
    			},
    			headerAttributes : {
    				title : "Route Effective Days",
    				style: "text-align:center;padding-right: 0px !important;padding-left:12px !important;overflow:visible !important; border-right:none !important"
    			}
    		},{
    			field : "CAL_BUTTON_Z",
    			title: " ",
    			hidden: !isLocalTimeFlag(),
    			width: "14px",
    			template: calenderRowTemplateZ,
    			attributes: {
    				style:"text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
    			},
    			headerAttributes: {
    				style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
    			}
    		},{
    			field : "LEG_TYPE",
    			title : "T*",
    			width : "30px",
    			hidden : false,
    			sortable : false,
    			filterable : false,
    			editable:true,
    			attributes : {
    				style:"border-right:none !important"
    			},
    			headerAttributes: {
          		  	title:"T",
          		  	style:"text-align:center;"
          	  	}
    		},{
          	  	title: EMPTY_STRING,
          	  	template: function(data) {
          	  		return parent.SkdGridHelper.getSkdGridManager().arrowIconRowTemplate(data, grid_Id, "LegTypeRequest", "routeLegTypeTextArea", "LEG_TYPE", dashboardID);
          	  	},
          	  	width:"14px",
          	  	editable:false,
          	  	attributes: {
          	  		style:"text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
          	  	},
          	  	headerAttributes: {
          	  		style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
          	  	}
        	},{
    			field : "EQUIP_TYPE",
    			title : "Eq*",
    			width : "40px",
    			hidden : false,
    			sortable : false,
    			filterable : false,
    			editable:true,
    			attributes : {
    				style:"border-right:none !important"
    			},
    			headerAttributes: {
          		  	title:"Eq",
          		  	style:"text-align:center;"
          	  	}
    		},{
          	  	title: EMPTY_STRING,
          	  	template: function(data) {
          	  		return parent.SkdGridHelper.getSkdGridManager().arrowIconRowTemplate(data, grid_Id, "EquipTypeRequest", "routeEquipTypeTextArea", "EQUIP_TYPE", dashboardID);
          	  	},
          	  	width:"14px",
          	  	editable:false,
          	  	attributes: {
          	  		style:"text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
          	  	},
          	  	headerAttributes: {
          	  		style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
          	  	}
        	},{
    			field : "IATA_MV_NBR",
    			title : "IATA Mv No",
    			width : "40px",
    			hidden : true,
    			sortable : false,
    			filterable : false,
    			editable:true,
    			attributes : {
    				style : "padding-left:4px;"
    			},
    			headerAttributes: {
          		  	title:"IATA Mv No",
          		  	style:"text-align:center;"
          	  	}
    		},{
    			field : "BAL_MV_NBR",
    			title : "Bal Mv No",
    			width : "60px",
    			hidden : true,
    			sortable : false,
    			filterable : false,
    			editable:true,
    			attributes : {
    				style : "padding-left:4px;"
    			},
    			headerAttributes: {
          		  	title:"Bal Mv No",
          		  	style:"text-align:center;"
          	  	}
    		},{
    			field : "USE_LEG_MINS_FLAG",
    			title : "Manually Timed",
    			width : "60px",
    			hidden : false,
    			sortable : false,
    			filterable : false,
    			editable:true,
    			attributes : {
    				style : "padding-left:4px;"
    			},
    			template: function(data) {
    				return manTimedCheckboxRowTemplatehandler(data,grid_Id);
    			},
    			headerAttributes: {
          		  	title:"Manually Timed",
          		  	style:"text-align:center;"
          	  	}
    		},{
    			field : "SCAC_CD",
    			title : "SCAC Code",
    			width : "50px",
    			hidden : false,
    			sortable : false,
    			filterable : false,
    			editable: false,
    			attributes : {
    				style : "padding-left:4px;"
    			},
    			headerAttributes: {
          		  	title:"SCAC Code",
          		  	style:"text-align:center;"
          	  	}
    		},{
    			field : "TOTALMONTH_COST_AMT",
    			title : "Monthly Route Cost",
    			width : "100px",
    			hidden : false,
    			sortable : false,
    			filterable : false,
    			editable:false,
    			attributes : {
    				style : "padding-left:4px;"
    			},
    			headerAttributes: {
          		  	title:"Monthly Route Cost",
          		  	style:"text-align:center;"
          	  	}
    		},
    		{
    			hidden : false,
    			sortable : false,
    			filterable : false,
    			editable:false,
    			title: "Revision Comment", 
    			width: "65px", 
    			attributes: {
    				style:"text-align:center;"
    			}, 
    			template: function(data) {
    				return SkdMxREGridHelper.getCommonGridManager().revisionComentCheckboxRowTemplatehandler(data,grid_Id);
    			},
    			headerAttributes: {
          		  	title:"Revision Comment",
          		  	style:"text-align:center;"
          	  	}
        	},{
    			hidden : false,
    			sortable : false,
    			filterable : false,
    			editable:false,
    			title: "Internal Comment", 
    			width: "65px", 
    			attributes: {
    				style:"text-align:center;"
    			}, 
    			template: function(data) {
    				return SkdMxREGridHelper.getCommonGridManager().intenalCommentCheckboxRowTemplatehandler(data,grid_Id);
    			},
    			headerAttributes: {
          		  	title:"Internal Comment",
          		  	style:"text-align:center;"
          	  	}
        	}
        ];
    };

    constructorFn.getRouteGridDataSource = function(data, isDelete, menu) {
    	return new kendo.data.DataSource({
    		pageSize: 500,
    		data: (data != undefined) ? data : [],
    		schema: {
    			model: {
    				id: "RouteData",
    				fields: {
    					ROUTE_ID: {
    						type: "string",
    						editable: false
    					},
    					MV_NUM: {
    						type: "string",
    						editable: !isDelete,
    						validation: {
    							 required: false,
    							 legtype: function (input) {
    								 if(input.val() == undefined || input.val() == "") {
    									 input.attr("data-legtype-msg", "RouteNo Field is Required");
    									 isValidationError = true;
    									 return false;
    								 }
    								isValidationError = false;
    								return true;
    								 
    							 }
    						 }
    					},
    					ROUTE_BUTTON: {
    						type: "string",
    						editable: false
    					},
    					FULL_EFFDAY_HOLIDAY_L: {
    						type: "string",
    						editable: false
    					},
    					CAL_BUTTON_L: {
    						type: "string",
    						editable: false
    					},
    					FULL_EFFDAY_HOLIDAY_Z: {
    						type: "string",
    						editable: false
    					},
    					CAL_BUTTON_Z: {
    						type: "string",
    						editable: false
    					},
    					LEG_TYPE: {
    						type: "string",
    						editable: !isDelete,
    						validation: {
    							 required: false,
    							 legtype: function (input) {
    								 if(input.val() == undefined || input.val() == "") {
    									 input.attr("data-legtype-msg", "LegType Field is Required");
    									 isValidationError = true;
    									 return false;
    								 }
    								 if (input.is("[name='LEG_TYPE']")) {
    									 var isValid = parent.SkdMxServiceHelper.getTimeAndCostServiceManagerManager().checkIsDataValid(input);
    									 if(!isValid){
    										 input.attr("data-legtype-msg", "Please enter the valid LegType");
    										 isValidationError = true;
    										 return false;
    									 }
    								}
    								isValidationError = false;
    								return true;
    								 
    							 }
    						 }
    					},
    					EQUIP_TYPE: {
    						type: "string",
    						editable:!isDelete,
    						validation: {
    							 required: false,
    							 equipmenttype: function (input) {
    								 if(input.val() == undefined || input.val() == "") {
    									 input.attr("data-equipmenttype-msg", "EqType Field is Required");
    									 isValidationError = true;
    									 return false;
    								 }
    								 if (input.is("[name='EQUIP_TYPE']")) {
    									 var isValid = parent.SkdMxServiceHelper.getTimeAndCostServiceManagerManager().checkIsDataValid(input);
    									 if(!isValid){
    										 input.attr("data-equipmenttype-msg", "Please enter the valid equipmentType");
    										 isValidationError = true;
    										 return false;
    									 }
    								}
    								isValidationError = false;
    								return true;
    								 
    							 }
    						}
    					},
    					CARRIER_TYPE: {
    						type: "string",
    						editable:!isDelete
    					},
    					SCAC_CD:{
    						type: "string",
    						//editable:(menu == "FF" ? true : false)
    						editable:false
    					},
    					DAILYRATE_PLUSCC_CHG_AMT: {
    						type: "string",
    						editable:false
    					},
    					TOTALMONTH_COST_AMT: {
    						type: "string",
    						editable:false
    					},
    					TEMPORARY_ROUTE: {
    						type: "string",
    						editable:false
    					},
    					EXPIRATION_DATE: {
    						type: "date",
    						editable:!isDelete
    					},
    					ROUTE_TYPE_CD: {
    						type: "string",
    						editable:!isDelete
    					},
    					IATA_MV_NBR: {
    						type: "string",
    						editable:!isDelete,
    						 validation: {
    							 required: false,
    							 iatamvnbrvalidation: function (input) {
    								 if(input.val() == undefined || input.val() == "") {
    									 return true;
    								 }
    								 if (input.is("[name='IATA_MV_NBR']")) {
    									 if(!validateAlphaNumericCharacters(input.val())){
    										 input.attr("data-iatamvnbrvalidation-msg", "Please enter alpha numeric characters only");
    										 return false;
    									 }
    								}
    								return true;
    								 
    							 }
    						 }
    					},
    					BAL_MV_NBR: {
    						type: "string",
    						editable:!isDelete
    					},
    					USE_LEG_MINS_FLAG: {
    						type: "string",
    						editable:false
    					}
    				}
    			},
    			parse: function (d) {
    				$.each(d, function (idx, dataItem) {	
    					parseCostData(dataItem);
    				});
    				return d;
    			}
    		}
    	});
    };
    var _instance = null;

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

function SeasonsGridManager() {

    function constructorFn() {
        this.initialize();
    };

    constructorFn.initialize = function() {
        //
    };

    constructorFn.getSeasonsGridColumns = function(grid_Id) {

    	var	calenderRowTemplateL = SkdMxREGridHelper.getCommonGridManager().getCalenderRowTemplate(grid_Id, "L", dashboardID);
    	var	calenderRowTemplateZ = SkdMxREGridHelper.getCommonGridManager().getCalenderRowTemplate(grid_Id, "Z", dashboardID);
    		return [{
    			field : "SEASON",
    			title : "Season",
    			width : "60px",
    			hidden: false,
    			attributes : {
    				style:"text-align:center;"
    			},
    			headerAttributes : {
    				title : "Season",
    				style:"text-align:center;"
    			}
    		},{
    			field : "FULL_EFFDAY_HOLIDAY_L",
    			title : "Leg Effective Days (L)",
    			hidden: isLocalTimeFlag(),
    			width : "150px",
    			attributes : {
    				style:"border-right:none !important"
    			},
    			headerAttributes: {
          		  	title:"Leg Effective Days",
          		  	style: "text-align:center;padding-right: 0px !important;padding-left:12px !important;overflow:visible !important; border-right:none !important"
          	  	}
    		},{
    			field : "FULL_EFFDAY_HOLIDAY_Z",
    			title : "Leg Effective Days (Z)",
    			hidden: !isLocalTimeFlag(),
    			width : "150px",
    			attributes : {
    				style:"border-right:none !important"
    			},
    			headerAttributes : {
    				title : "Leg Effective Days",
    				style: "text-align:center;padding-right: 0px !important;padding-left:12px !important;overflow:visible !important; border-right:none !important"
    			}
    		},{
    			field: "CAL_BUTTON_L",
    			title: "&nbsp;",
    			hidden:isLocalTimeFlag(),
    			width: "14px",
    			template: calenderRowTemplateL,
    			attributes: {
    				style:"text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
    			},
    			headerAttributes: {
    				style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
    			}	
    		},{
    			field : "CAL_BUTTON_Z",
    			title: "&nbsp;",
    			hidden:!isLocalTimeFlag(),
    			width: "14px",
    			template: calenderRowTemplateZ,
    			attributes: {
    				style:"text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
    			},
    			headerAttributes: {
    				style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
    			}
    		},{
    			field : "LEG_TYPE",
    			title : "Leg Type",
    			hidden: false,
    			width : "30px",
    			attributes : {
    				style:"text-align:center;"
    			},
    			headerAttributes : {
    				title : "Leg Type",
    				style : "text-align:center"
    			}
    		},{
    			field : "EQUIP_TYPE",
    			title : "Equip Type",
    			width : "40px",
    			hidden : false,
    			attributes : {
    				style:"text-align:center;"
    			},
    			headerAttributes : {
    				title : "Equipment Type",
    				style : "text-align:center"
    			}
    		},{
    			field : "ORIGIN",
    			title : "Orig",
    			hidden: false,
    			width : "45px",
    			attributes : {
    				style:"text-align:center;"
    			},
    			headerAttributes : {
    				title : "Origin",
    				style : "text-align:center"
    			}
    		},{
    			field : "DESTINATION",
    			title : "Dest",
    			hidden: false,
    			width : "45px",
    			attributes : {
    				style:"text-align:center;"
    			},
    			headerAttributes : {
    				title : "Destination",
    				style : "text-align:center"
    			}
    		},{
    			field : "LOCAL_DEP",
    			title : "Dept (L)",
    			hidden: isLocalTimeFlag(),
    			width : "45px",
    			attributes : {
    				style : "text-align:center;"
    			},
    			headerAttributes : {
    				title : "Departure Time",
    				style:"text-align:center;"
    			}
    		},{
    			field : "ZULU_DEP",
    			title : "Dept (Z)",
    			hidden: !isLocalTimeFlag(),
    			width : "45px",
    			attributes : {
    				style : "text-align:center;"
    			},
    			headerAttributes : {
    				title : "Departure Time",
    				style:"text-align:center;"
    			}
    		},{
    			field : "LOCAL_ARR",
    			title : "Arriv (L)",
    			hidden: isLocalTimeFlag(),
    			width : "45px",
    			attributes : {
    				style : "text-align:center;"
    			},
    			headerAttributes : {
    				title : "Arrival Time",
    				style:"text-align:center;"
    			}
    		},{	
    			field : "ZULU_ARR",
    			title : "Arriv (Z)",
    			hidden: !isLocalTimeFlag(),
    			width : "45px",
    			attributes : {
    				style : "text-align:center;"
    			},
    			headerAttributes : {
    				title : "Arrival Time",
    				style:"text-align:center;"
    			}
    		},{
    			field : "BLOCK_INDAY_L_NBR",
    			title : "Arriv Day (L)",
    			width : "50px",
    			hidden: isLocalTimeFlag(),
    			attributes : {
    				style : "text-align:center;"
    			},
    			headerAttributes : {
    				title : "Arrival Day",
    				style:"text-align:center;"
    			}
    		},{
    			field : "BLOCK_INDAY_Z_NBR",
    			title : "Arriv Day (Z)",
    			hidden: !isLocalTimeFlag(),
    			width : "50px",
    			attributes : {
    				style : "text-align:center;"
    			},
    			headerAttributes : {
    				title : "Arrival Day",
    				style:"text-align:center;"
    			}
    		},{
    			field : "LOC_GRND_MIN_QTY",
    			title : "Grnd Mins",
    			hidden : false,
    			width : "60px",
    			attributes : {
    				style : "text-align:center;"
    			},
    			headerAttributes : {
    				title : "Ground Minutes",
    				style:"text-align:center;"
    			}
    		},{
    			field : "FLIGHT_MINS",
    			title : "Transit (hhmm)",
    			hidden : false,
    			width : "60px",
    			attributes : {
    				style : "text-align:center;"
    			},
    			headerAttributes : {
    				title : "Transit Minutes",
    				style:"text-align:center;"
    			}
    		},{
    			field : "BLOCK_TIME_Z",
    			title : "Block (hhmm)",
    			hidden : false,
    			width : "60px",
    			attributes : {
    				style : "text-align:center;"
    			},
    			headerAttributes : {
    				title : "Block Minutes",
    				style:"text-align:center;"
    			}
    		},{
    			field : "LEG_MILES",
    			title : "Leg Miles",
    			width : "50px",
    			attributes : {
    				style : "text-align:center;"
    			},
    			headerAttributes : {
    				title : "Leg Miles",
    				style:"text-align:center;"
    			}
    		},{
    			field : "DAILY_RT_CC_CHG",
    			title : "Daily Leg Cost",
    			width : "70px",
    			hidden : false,
    			attributes : {
    				style : "text-align:center;"
    			},
    			headerAttributes : {
    				title : "Daily Leg Cost",
    				style:"text-align:center;"
    			}
    		},{
    			field : "TOTAL_MTH_CST",
    			title : "Total Leg Cost",
    			width : "70px",
    			hidden : false,
    			attributes : {
    				style : "text-align:center;"
    			},
    			headerAttributes : {
    				title : "Total Leg Cost",
    				style:"text-align:center;"
    			}
    		},{
    			field : "TOTALMONTH_COST_AMT",
    			title : "Monthly Route Cost",
    			width : "100px",
    			attributes : {
    				style : "text-align:center;"
    			},
    			headerAttributes : {
    				title : "Monthly Route Cost",
    				style:"text-align:center;"
    			}
    		}/*{
    			field : "MV_NUM_SEQ",
    			title : "S",
    			hidden: false,
    			width : "20px",
    			attributes : {
    				style : "text-align:center;"
    			},
    			headerAttributes : {
    				title : "Seq#",
    				style:"text-align:center;"
    			}
    		}*/
    	];

    };

    constructorFn.getSeasonsGridDataSource = function(data) {

    	return new kendo.data.DataSource({
    		pageSize: 500,
    		data: (data != undefined) ? data : {},
    		schema: {
    			model: {
    				id: "SeasonGrid",
    				fields: {
    					MV_NUM_SEQ: {
    						type: "string",
    						editable: false
    					},
    					EQUIP_TYPE: {
    						type: "string",
    						editable: false
    					},
    					LEG_TYPE: {
    						type: "string",
    						editable: false
    					},
    					FULL_EFFDAY_HOLIDAY_L: {
    						type: "string",
    						editable: false
    					},
    					FULL_EFFDAY_HOLIDAY_Z: {
    						type: "string",
    						editable: false
    					},
    					CAL_BUTTON_L: {
    						type: "string",
    						editable: false
    					},
    					CAL_BUTTON_Z: {
    						type: "string",
    						editable: false
    					},
    					ORIGIN: {
    						type: "string",
    						editable: false
    					},
    					DESTINATION: {
    						type: "string",
    						editable: false
    					},
    					LOCAL_DEP: {
    						type: "string",
    						editable: false
    					},
    					ZULU_DEP: {
    						type: "string",
    						editable: false
    					},
    					LOCAL_ARR: {
    						type: "string",
    						editable: false
    					},
    					ZULU_ARR: {
    						type: "string",
    						editable: false
    					},
    					LOC_GRND_MIN_QTY: {
    						type: "string",
    						editable: false
    					},
    					BLOCK_INDAY_L_NBR: {
    						type: "string",
    						editable: false
    					},
    					BLOCK_INDAY_Z_NBR: {
    						type: "string",
    						editable: false
    					},
    					FLIGHT_MINS: {
    						type: "string",
    						editable: false
    					},
    					BLOCK_TIME_Z: {
    						type: "string",
    						editable: false
    					},
    					SEASON: {
    						type: "string",
    						editable: false
    					},
    					LEG_MILES: {
    						type: "string",
    						editable: false
    					},
    					DAILY_RT_CC_CHG: {
    						type: "string",
    						editable: false
    					},
    					TOTAL_MTH_CST: {
    						type: "string",
    						editable: false
    					},
    					TOTALMONTH_COST_AMT: {
    						type: "string",
    						editable: false
    					}
    				}
    			},
    			parse: function (d) {
    				$.each(d, function (idx, dataItem) {	
    					parseCostData(dataItem);
    				});
    				return d;
    			}
    		}
    	});
    };
    var _instance = null;

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
function AllocationGridManager() {

    function constructorFn() {
        this.initialize();
    };

    constructorFn.initialize = function() {
        //
    };

    constructorFn.getAllocationGridColumns = function(grid_Id) {
    	/*var addRowTemplate = "#= addRowTemplate(data,'" + grid_Id + "',true)#";
    	var deleteRowTemplate = "#= deleteRowtemplate(data,'" + grid_Id + "',true)#";*/
    	var flag = false;
    	
    	var addRowTemplate = SkdMxREGridHelper.getCommonGridManager().getAddRowTemplate(grid_Id,true,dashboardID);
    	var deleteRowTemplate = SkdMxREGridHelper.getCommonGridManager().getDeleteRowTemplate(grid_Id,true,dashboardID);
    	var	calenderRowTemplateL = SkdMxREGridHelper.getCommonGridManager().getCalenderRowTemplate(grid_Id, "L", dashboardID,false);
    	var	calenderRowTemplateZ = SkdMxREGridHelper.getCommonGridManager().getCalenderRowTemplate(grid_Id, "Z", dashboardID,false);
    	var	allocCalenderRowTemplateL = SkdMxREGridHelper.getCommonGridManager().getCalenderRowTemplate(grid_Id, "L", dashboardID,true,true);
    	var	allocCalenderRowTemplateZ = SkdMxREGridHelper.getCommonGridManager().getCalenderRowTemplate(grid_Id, "Z", dashboardID,true,true);
    	return [
    			{
    				title : EMPTY_STRING,
    				width : "20px",
    				hidden : flag,
    				template : addRowTemplate,
    				attributes : {
    					style : "text-align:center;"
    				}
    			},
    			{
    				title : EMPTY_STRING,
    				width : "20px",
    				hidden : flag,
    				template : deleteRowTemplate,
    				attributes : {
    					style : "text-align:center;"
    				}
    			},
    			{
    				field : "MV_NUM_SEQ",
    				title : "Leg S",
    				hidden : false,
    				width : "30px",
    				attributes : {
    					style : "text-align:center;"
    				},
    				headerAttributes : {
    					title : "Leg Sequence",//FDX-1090
    					style : "text-align:center;"
    				}
    			},
    			{
    				field : "ORIGIN",
    				title : "Orig",
    				hidden: false,
    				width : "45px",
    				attributes : {
    					style:"text-align:center;"
    				},
    				headerAttributes : {
    					title : "Origin",
    					style : "text-align:center;"
    				}
    			},{
    				field : "DESTINATION",
    				title : "Dest",
    				hidden: false,
    				width : "45px",
    				attributes : {
    					style:"text-align:center;"
    				},
    				headerAttributes : {
    					title : "Destination",
    					style : "text-align:center;"
    				}
    			},
    			{
    				field : "LEG_EFFDAYSL_DESC",
    				title : "Leg Effective Days (L)",
    				hidden : isLocalTimeFlag(),
    				width : "150px",
    				attributes : {
    					style : "border-right:none !important"
    				},
    				headerAttributes : {
    					title : "Leg Effective Days",
    					style : "text-align:center;padding-right: 0px !important;padding-left:12px !important;overflow:visible !important; border-right:none !important"
    				}
    			},
    			{
    				field : "LEG_EFFDAYSZ_DESC",
    				title : "Leg Effective Days (Z)",
    				hidden : !isLocalTimeFlag(),
    				width : "150px",
    				attributes : {
    					style : "border-right:none !important"
    				},
    				headerAttributes : {
    					title : "Leg Effective Days",
    					style : "text-align:center;padding-right: 0px !important;padding-left:12px !important;overflow:visible !important; border-right:none !important"
    				}
    			},
    			{
    				field : "CAL_BUTTON_L",
    				title : "&nbsp;",
    				hidden : isLocalTimeFlag(),
    				width : "14px",
    				template : calenderRowTemplateL,
    				attributes : {
    					style : "text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
    				},
    				headerAttributes : {
    					style : "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
    				}
    			},
    			{
    				field : "CAL_BUTTON_Z",
    				title : "&nbsp;",
    				hidden : !isLocalTimeFlag(),
    				width : "14px",
    				template : calenderRowTemplateZ,
    				attributes : {
    					style : "text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
    				},
    				headerAttributes : {
    					style : "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
    				}
    			},{
    				field : "EQUIP_TYPE",
    				title : "Equip Type",
    				width : "40px",
    				hidden : false,
    				attributes : {
    					style : "text-align:center;"
    				},
    				headerAttributes : {
    					title : "Equipment Type",
    					style : "text-align:center"
    				}
    			},/*{
    	  	  		title: EMPTY_STRING,
    	  	  		template: function(data) {
    	  	  			return parent.SkdGridHelper.getSkdGridManager().arrowIconRowTemplate(data, grid_Id, "EquipTypeRequest", "routeEquipTypeTextArea", "EQUIP_TYPE", dashboardID);
    	  	  		},
    	  	  		width:"14px",
    	  	  		editable:false,
    	  	  		attributes: {
    	  	  			style:"text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
    	  	  		},
    	  	  		headerAttributes: {
    	  	  			style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
    	  	  		}
    	    	},*/{
    				field : "FULL_EFFDAY_HOLIDAY_L",
    				title : "Allocation Eff Days (L)*",
    				hidden : isLocalTimeFlag(),
    				width : "150px",
    				attributes : {
    					style : "border-right:none !important"
    				},
    				headerAttributes : {
    					title : "Allocation Effective Days",
    					style : "text-align:center;padding-right: 0px !important;padding-left:12px !important;overflow:visible !important; border-right:none !important"
    				}
    			},
    			{
    				field : "FULL_EFFDAY_HOLIDAY_Z",
    				title : "Allocation Eff Days (Z)*",
    				hidden : !isLocalTimeFlag(),
    				width : "150px",
    				attributes : {
    					style : "border-right:none !important"
    				},
    				headerAttributes : {
    					title : "Allocation Effective Days",
    					style : "text-align:center;padding-right: 0px !important;padding-left:12px !important;overflow:visible !important; border-right:none !important"
    				}
    			},
    			{
    				field : "ALLOC_CAL_BUTTON_L",
    				title : "&nbsp;",
    				hidden : isLocalTimeFlag(),
    				width : "14px",
    				template : allocCalenderRowTemplateL,
    				attributes : {
    					style : "text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
    				},
    				headerAttributes : {
    					style : "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
    				}
    			},
    			{
    				field : "ALLOC_CAL_BUTTON_Z",
    				title : "&nbsp;",
    				hidden : !isLocalTimeFlag(),
    				width : "14px",
    				template : allocCalenderRowTemplateZ,
    				attributes : {
    					style : "text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
    				},
    				headerAttributes : {
    					style : "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
    				}
    			},{
    				field : "PROD_GRP_NM",
    				title : "Prod Group*",
    				width : "60px",
    				hidden : false,
    				attributes : {
    					style : "border-right:none !important"
    				},
    				headerAttributes : {
    					title : "Product Volume Group",
    					style : "text-align:right"
    				}
    			}, {
    	  	  		title: EMPTY_STRING,
    	  	  		template: function(data) {
    	  	  			return parent.SkdGridHelper.getSkdGridManager().arrowIconRowTemplate(data, grid_Id, "ProductGroupRequest", "productVolGroupsTextArea", "PROD_GRP_NM", dashboardID);
    	  	  		},
    	  	  		width:"14px",
    	  	  		editable:false,
    	  	  		attributes: {
    	  	  			style:"text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
    	  	  		},
    	  	  		headerAttributes: {
    	  	  			style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
    	  	  		}
    	    	},{
    				field : "ALLOC_WEIGHT",
    				title : "Total Weight*",
    				width : "60px",
    				hidden : false,
    				headerAttributes : {
    					title : "Total Weight",
    					style : "text-align:center;"
    				}
    			}, {
    				field : "ALLOC_CUBE",
    				title : "Total Cubes*",
    				width : "60px",
    				hidden : false,
    				headerAttributes : {
    					title : "Total Cubes",
    					style : "text-align:center;"
    				}
    			} , {
    				field : "USED_WEIGHT",
    				title : "Used Weight",
    				width : "60px",
    				hidden : false,
    				attributes : {
    					style : "text-align:center;"
    				},
    				headerAttributes : {
    					title : "Used Weight",
    					style : "text-align:center;"
    				}
    			}, {
    				field : "USED_CUBE",
    				title : "Used Cubes",
    				width : "60px",
    				hidden : false,
    				attributes : {
    					style : "text-align:center;"
    				},
    				headerAttributes : {
    					title : "Used Cubes",
    					style : "text-align:center;"
    				}
    			} , {
    				field : "EXCESS_WEIGHT",
    				title : "Excess Weight",
    				width : "60px",
    				hidden : false,
    				attributes : {
    					style : "text-align:center;"
    				},
    				headerAttributes : {
    					title : "Excess Weight",
    					style : "text-align:center;"
    				}
    			}, {
    				field : "EXCESS_CUBE",
    				title : "Excess Cubes",
    				width : "60px",
    				hidden : false,
    				attributes : {
    					style : "text-align:center;"
    				},
    				headerAttributes : {
    					title : "Excess Cubes",
    					style : "text-align:center;"
    				}
    			},{
    				hidden : false,
    				sortable : false,
    				filterable : false,
    				title: "Comment", 
    				field : "COMMENTS",
    				width: "85px", 
    				attributes: {
    					style:"text-align:center;"
    				}/*, 
    				template: function(data) {
    					return revisionComentCheckboxRowTemplatehandler(data,grid_Id);
    				}*/,
    				headerAttributes: {
    	      		  	title:"Comment",
    	      		  	style:"text-align:center;"
    	      	  	}
    	    	},{
    				hidden : false,
    				sortable : false,
    				filterable : false,
    				editable:false,
    				field : "LOC_ALLOCATION",
    				title: "Location Allocation", 
    				width: "65px", 
    				attributes: {
    					style:"text-align:center;"
    				}, 
    				template: function(data) {
    					return SkdMxREGridHelper.getCommonGridManager().locationAllocationCheckboxRowTemplatehandler(data,grid_Id);
    				},
    				headerAttributes: {
    	      		  	title:"Location Allocation",
    	      		  	style:"text-align:center;"
    	      	  	}
    	    	} ];
    };

    constructorFn.getAllocationGridDataSource = function(data) {
    	return new kendo.data.DataSource({
    		pageSize: 500,
    		data: (data != undefined) ? data : {},
    		schema: {
    			model: {
    				id: "allocationGrid",
    				fields: {
    					ALLOC_ID: {
    						type: "string",
    						editable: false
    					},
    					ALLOC_POS: {
    						type: "string",
    						editable: false
    					},
    					ALLOC_VOLUMES: {
    						type: "string",
    						editable: false
    					},
    					CHANGE_FLAG: {
    						type: "string",
    						editable: false
    					},
    					CONVERT_FLAG: {
    						type: "string",
    						editable: false
    					},
    					DOWN_LOAD_AMT: {
    						type: "string",
    						editable: false
    					},
    					LAST_UPDT_TIME: {
    						type: "string",
    						editable: false
    					},
    					LAST_UPDT_USER_NM: {
    						type: "string",
    						editable: false
    					},
    					LEG_ID: {
    						type: "string",
    						editable: false
    					},
    					OCA_NBR: {
    						type: "string",
    						editable: false
    					},
    					OPERATION_CD: {
    						type: "string",
    						editable: false
    					},
    					PROD_GRP_NM: {
    						type: "string",
    						editable: false
    					},
    					SUM_FLAG: {
    						type: "string",
    						editable: false
    					},
    					SUM_UNIT_MEAS_CD: {
    						type: "string",
    						editable: false
    					},
    					UP_LIFT_AMT: {
    						type: "string",
    						editable: false
    					},
    					MV_NUM: {
    						type: "string",
    						editable: false
    					},
    					MV_NUM_SEQ: {
    						type: "string",
    						editable: false
    					},
    					EQUIP_TYPE: {
    						type: "string",
    						editable: false
    					},
    					LEG_TYPE: {
    						type: "string",
    						editable: false
    					},
    					LEG_EFFDAYSL_DESC: {
    						type: "string",
    						editable: false
    					},
    					LEG_EFFDAYSZ_DESC: {
    						type: "string",
    						editable: false
    					},
    					CAL_BUTTON_L: {
    						type: "string",
    						editable: false
    					},
    					CAL_BUTTON_Z: {
    						type: "string",
    						editable: false
    					},
    					ALLOC_CAL_BUTTON_L: {
    						type: "string",
    						editable: false
    					},
    					ALLOC_CAL_BUTTON_Z: {
    						type: "string",
    						editable: false
    					},
    					ORIGIN: {
    						type: "string",
    						editable: false
    					},
    					DESTINATION: {
    						type: "string",
    						editable: false
    					},
    					PROD_GRP_NM: {
    						type: "string",
    						editable: false
    					},
    					ALLOC_WEIGHT: {
    						type: "string",
    						editable: true
    					},
    					ALLOC_CUBE: {
    						type: "string",
    						editable: true
    					},
    					USED_WEIGHT: {
    						type: "string",
    						editable: false
    					},
    					USED_CUBE: {
    						type: "string",
    						editable: false
    					},
    					EXCESS_WEIGHT: {
    						type: "string",
    						editable: false
    					},
    					EXCESS_CUBE: {
    						type: "string",
    						editable: false
    					},
    					COMMENTS: {
    						type: "string",
    						editable: true
    					},
    					LOC_ALLOCATION: {
    						type: "boolean",
    						editable: true
    					},
    					ALLOCATION_EFF_L:{
    						type: "string",
    						editable: false
    					},
    					ALLOCATION_EFF_Z:{
    						type: "string",
    						editable: false
    					},
    					FULL_EFFDAY_HOLIDAY_L:{
    						type: "string",
    						editable: false
    					},
    					FULL_EFFDAY_HOLIDAY_Z:{
    						type: "string",
    						editable: false
    					}
    				}
    			},
    			parse: function (d) {
    				$.each(d, function (idx, dataItem) {	
    					parseAllocationCostData(dataItem);
    				});
    				return d;
    			}
    		}
    	});
    };
    var _instance = null;

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
function LegsGridManager() {

    function constructorFn() {
        this.initialize();
    };

    constructorFn.initialize = function() {
        //
    };

    constructorFn.getLegsGridColumns = function(grid_Id,dashboardID, isDelete, menu) {
    	var addRowTemplate = SkdMxREGridHelper.getCommonGridManager().getAddRowTemplate(grid_Id,false,dashboardID);
    	var deleteRowTemplate = SkdMxREGridHelper.getCommonGridManager().getDeleteRowTemplate(grid_Id,false,dashboardID);
    	var	calenderRowTemplateL = SkdMxREGridHelper.getCommonGridManager().getCalenderRowTemplate(grid_Id, "L", dashboardID);
    	var	calenderRowTemplateZ = SkdMxREGridHelper.getCommonGridManager().getCalenderRowTemplate(grid_Id, "Z", dashboardID);
    	return [{
    				title : EMPTY_STRING,
    				width : "20px",
    				hidden: isDelete,
    				template : addRowTemplate,
    				attributes : {
    					style:"text-align:center;"
    				}
    			},{
    				title : EMPTY_STRING,
    				width : "20px",
    				hidden: isDelete,
    				template : deleteRowTemplate,
    				attributes : {
    					style:"text-align:center;"
    				}
    			},{
    				field : "LEG_ID",
    				title : "",
    				hidden : true,
    				width : "20px",
    				attributes : {
    					style : "padding-left:4px;"
    				},
    				headerAttributes : {
    					title : "Leg Id",
    					style:"text-align:center;"
    				}
    			}, {
    				field : "ROUTE_ID",
    				title : "Mv No",
    				hidden : true,
    				width : "20px",
    				attributes : {
    					style : "padding-left:4px;"
    				},
    				headerAttributes : {
    					title : "Route Id",
    					style:"text-align:center;"
    				}
    			}, {
    				field : "MV_NUM",
    				title : "Mv No",
    				hidden : true,
    				width : "60px",
    				attributes : {
    					style : ""
    				},
    				headerAttributes : {
    					title : "Route#",
    					style:"text-align:center;"
    				}
    			},{
    				field : "MV_NUM_SEQ",
    				title : "S",
    				hidden: false,
    				width : "20px",
    				attributes : {
    					style : ""
    				},
    				headerAttributes : {
    					title : "Sequence",
    					style:"text-align:center;"
    				}
    			},{
    				field : "FULL_EFFDAY_HOLIDAY_L",
    				title : "Leg Effective Days (L)",
    				hidden: isLocalTimeFlag(),
    				width : "150px",
    				attributes : {
    					style:"border-right:none !important"
    				},
    				headerAttributes: {
    	      		  	title:"Leg Effective Days",
    	      		  	style: "text-align:center;padding-right: 0px !important;padding-left:12px !important;overflow:visible !important; border-right:none !important"
    	      	  	}
    			},{
    				field : "FULL_EFFDAY_HOLIDAY_Z",
    				title : "Leg Effective Days (Z)",
    				hidden: !isLocalTimeFlag(),
    				width : "150px",
    				attributes : {
    					style:"border-right:none !important"
    				},
    				headerAttributes : {
    					title : "Leg Effective Days",
    					style: "text-align:center;padding-right: 0px !important;padding-left:12px !important;overflow:visible !important; border-right:none !important"
    				}
    			},{
    				field: "CAL_BUTTON_L",
    				title: "&nbsp;",
    				hidden:isLocalTimeFlag(),
    				width: "14px",
    				template: calenderRowTemplateL,
    				attributes: {
    					style:"text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
    				},
    				headerAttributes: {
    					style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
    				}	
    			},{
    				field : "CAL_BUTTON_Z",
    				title: "&nbsp;",
    				hidden:!isLocalTimeFlag(),
    				width: "14px",
    				template: calenderRowTemplateZ,
    				attributes: {
    					style:"text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
    				},
    				headerAttributes: {
    					style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
    				}
    			},{
    				field : "LEG_TYPE",
    				title : "Leg Type",
    				hidden: false,
    				width : "40px",
    				attributes : {
    					style:"border-right:none !important"
    				},
    				headerAttributes : {
    					title : "Leg Type",
    					style : "text-align:right"
    				}
    			},{
    	      	  	title: EMPTY_STRING,
    	      	  	template: function(data) {
    	      	  		return parent.SkdGridHelper.getSkdGridManager().arrowIconRowTemplate(data, grid_Id, "LegTypeRequest", "routeLegTypeTextArea", "LEG_TYPE", dashboardID);
    	      	  	},
    	      	  	width:"14px",
    	      	  	editable:false,
    	      	  	attributes: {
    	      	  		style:"text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
    	      	  	},
    	      	  	headerAttributes: {
    	      	  		style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
    	      	  	}
    	    	},{
    				field : "EQUIP_TYPE",
    				title : "Equip Type",
    				width : "40px",
    				hidden : ((menu == "TS" || menu == "TSS") ? true : false),
    				attributes : {
    					style:"border-right:none !important"
    				},
    				headerAttributes : {
    					title : "Equipment Type",
    					style : "text-align:right"
    				}
    			},{
    		      	  title: EMPTY_STRING,
    		    	  template: function(data) {
    		    		  return parent.SkdGridHelper.getSkdGridManager().arrowIconRowTemplate(data, grid_Id, "EquipTypeRequest", "routeEquipTypeTextArea", "EQUIP_TYPE", dashboardID);
    		    	  },
    		    	  width:"14px",
    		    	  hidden : ((menu == "TS" || menu == "TSS") ? true : false),
    		    	  editable:false,
    				  attributes: {
    					  style:"text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
    				  },
    				  headerAttributes: {
    					  style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
    		    	  }
    	    	},{
    				field : "ORIGIN",
    				title : "Orig*",
    				hidden: false,
    				width : "45px",
    				attributes : {
    					style:"border-right:none !important"
    				},
    				headerAttributes : {
    					title : "Origin",
    					style : "text-align:right"
    				}
    			},{
    				title: EMPTY_STRING,
    				template: function(data) {
    					return parent.SkdGridHelper.getSkdGridManager().arrowIconRowTemplate(data, grid_Id, "LocationRequest", "routeLocationTextArea", "ORIGIN", dashboardID);
    				},
    				width:"14px",
    				editable:false,
    				attributes: {
    					style:"text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
    				},
    				headerAttributes: {
    					style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
    				}
            	},{
    				field : "DESTINATION",
    				title : "Dest*",
    				hidden: false,
    				width : "45px",
    				attributes : {
    					style:"border-right:none !important"
    				},
    				headerAttributes : {
    					title : "Destination",
    					style : "text-align:right"
    				}
    			},{
    				title: EMPTY_STRING,
    				template: function(data) {
    					return parent.SkdGridHelper.getSkdGridManager().arrowIconRowTemplate(data, grid_Id, "LocationRequest", "routeLocationTextArea", "DESTINATION", dashboardID);
    				},
    				width:"14px",
    				editable:false,
    				attributes: {
    					style:"text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
    				},
    				headerAttributes: {
    					style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
    				}
            	},{
    				field : "OWNER_LOC_CD",
    				title : "Owner Loc Code",
    				width : "55px",
    				hidden : true, //((menu == "TS" || menu == "TSS") ? false : true),
    				headerAttributes : {
    					title : "Owner",
    					style : "text-align:center"
    				}
    			},{
    				field : "MANAGER_ID",
    				title : "Mgr#",
    				width : "40px",
    				hidden : true,//((menu == "TS" || menu == "TSS") ? false : true),
    				attributes : {
    					style:"border-right:none !important"
    				},
    				headerAttributes : {
    					title : "Owner",
    					style : "text-align:center"
    				}
    			},{
    	  	  		title: EMPTY_STRING,
    	  	  		template: function(data) {
    	  	  			return parent.SkdGridHelper.getSkdGridManager().arrowIconRowTemplate(data, grid_Id, "ManagerRequest", "managerTextArea", "MANAGER_ID", dashboardID);
    	  	  		},
    	  	  		width:"14px",
    	  	  		hidden : true,// ((menu == "TS" || menu == "TSS") ? false : true),
    	  	  		editable:false,
    	  	  		attributes: {
    	  	  			style:"text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
    	  	  		},
    	  	  		headerAttributes: {
    	  	  			style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
    	  	  		}
    	    	},{
    				field : "LOCAL_DEP",
    				title : "Dept (L)*",
    				hidden: isLocalTimeFlag(),
    				width : "45px",
    				attributes : {
    					style : ""
    				},
    				headerAttributes : {
    					title : "Departure Time",
    					style:"text-align:center;"
    				}
    			},{
    				field : "ZULU_DEP",
    				title : "Dept (Z)*",
    				hidden: !isLocalTimeFlag(),
    				width : "45px",
    				attributes : {
    					style : ""
    				},
    				headerAttributes : {
    					title : "Departure Time",
    					style:"text-align:center;"
    				}
    			},{
    				field : "FLIGHT_MINS",
    				title : "Transit (hhmm)",
    				width : "60px",
    				hidden : ((menu == "FC" || menu == "TS" || menu == "TSS" || menu == "TO" || menu == "TSG") ? false : true),
    				attributes : {
    					style : ""
    				},
    				headerAttributes : {
    					title : "Transit HHMM",
    					style:"text-align:center;"
    				},
    				editor : function(container, options) {
    					transitMinsEditor(container, options);
    				}
    			},{
    				hidden: isLocalTimeFlag(),
    				field : "LOCAL_ARR",
    				title : "Arriv (L)*",
    				width : "45px",
    				attributes : {
    					style : ""
    				},
    				headerAttributes : {
    					title : "Arrival Time",
    					style:"text-align:center;"
    				}
    			},{	
    				hidden: !isLocalTimeFlag(),
    				field : "ZULU_ARR",
    				title : "Arriv (Z)*",
    				width : "45px",
    				attributes : {
    					style : ""
    				},
    				headerAttributes : {
    					title : "Arrival Time",
    					style:"text-align:center;"
    				}
    			},{
    				field : "BLOCK_INDAY_L_NBR",
    				title : "Arriv Day (L)",
    				width : "50px",
    				hidden: isLocalTimeFlag(),
    				attributes : {
    					style : ""
    				},
    				headerAttributes : {
    					title : "Arrival Day",
    					style:"text-align:center;"
    				}
    			},{
    				hidden: !isLocalTimeFlag(),
    				field : "BLOCK_INDAY_Z_NBR",
    				title : "Arriv Day (Z)",
    				width : "50px",
    				attributes : {
    					style : ""
    				},
    				headerAttributes : {
    					title : "Arrival Day",
    					style:"text-align:center;"
    				}
    			},{
    				field : "LOC_GRND_MIN_QTY",
    				title : "Grnd Mins",
    				hidden : ((menu == "TS" || menu == "TSS") ? true : false),
    				width : "60px",
    				attributes : {
    					style : ""
    				},
    				headerAttributes : {
    					title : "Ground Minutes",
    					style:"text-align:center;"
    				},
    				editor : function(container, options) {
    					grndMinCellEditor(container, options);
    				}
    			},{
    				field : "FLIGHT_MINS",
    				title : "Transit (hhmm)",
    				hidden : ((menu == "FC" || menu == "TS" || menu == "TSS" || menu == "TO" || menu == "TSG") ? true : false),
    				width : "60px",
    				attributes : {
    					style : ""
    				},
    				headerAttributes : {
    					title : "Transit Minutes",
    					style:"text-align:center;"
    				}
    			},{
    				field : "BLOCK_TIME_Z",
    				title : "Block (hhmm)",
    				hidden : ((menu == "TS" || menu == "TSS") ? true : false),
    				width : "60px",
    				attributes : {
    					style : ""
    				},
    				headerAttributes : {
    					title : "Block Minutes",
    					style:"text-align:center;"
    				}
    			},{
    				field : "LEG_MILES",
    				title : "Leg Miles",
    				width : "50px",
    				attributes : {
    					style : ""
    				},
    				headerAttributes : {
    					title : "Leg Miles",
    					style:"text-align:center;"
    				}
    			},{
    				field : "TRACK_EQUIP_TYPE",
    				title : "Tractor Type",
    				hidden :true,// ((menu == "TS" || menu == "TSS") ? false : true),
    				width : "60px",
    				attributes : {
    					style : ""
    				},
    				headerAttributes : {
    					title : "Tractor Type",
    					style:"text-align:center;"
    				}
    			},{
    				//change the field
    				field : "TRAIL_AVAIL_TM",
    				title : "Trailer Type",
    				hidden : true,//((menu == "TS" || menu == "TSS") ? false : true),
    				width : "60px",
    				attributes : {
    					style:"border-right:none !important"
    				},
    				headerAttributes : {
    					title : "Trailer Type",
    					style:"text-align:center;"
    				}
    			},{
    	  	  		title: EMPTY_STRING,
    	  	  		template: function(data) {
    	  	  			return parent.SkdGridHelper.getSkdGridManager().arrowIconRowTemplate(data, grid_Id, "TrailerTypeRequest", "trailerTypeTextArea", "TRAIL_AVAIL_TM", dashboardID);
    	  	  		},
    	  	  		width:"14px",
    	  	  		hidden : true,//((menu == "TS" || menu == "TSS") ? false : true),
    	  	  		editable:false,
    	  	  		attributes: {
    	  	  			style:"text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
    	  	  		},
    	  	  		headerAttributes: {
    	  	  			style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
    	  	  		}
    	    	},{
    				field : "TRAIL_OPT",
    				title : "Trailer Option",
    				hidden : true,//((menu == "TS" || menu == "TSS") ? false : true),
    				width : "60px",
    				attributes : {
    					style:"border-right:none !important"
    				},
    				headerAttributes : {
    					title : "Trailer Options",
    					style:"text-align:center;"
    				}
    			},{
    	  	  		title: EMPTY_STRING,
    	  	  		template: function(data) {
    	  	  			return parent.SkdGridHelper.getSkdGridManager().arrowIconRowTemplate(data, grid_Id, "TrailerOptionRequest", "trailerOptionTextArea", "TRAIL_OPT", dashboardID);
    	  	  		},
    	  	  		width:"14px",
    	  	  		hidden : true,//((menu == "TS" || menu == "TSS") ? false : true),
    	  	  		editable:false,
    	  	  		attributes: {
    	  	  			style:"text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
    	  	  		},
    	  	  		headerAttributes: {
    	  	  			style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
    	  	  		}
    	    	},{
    				field : "DAILY_RT_CC_CHG",
    				title : "Daily Leg Cost",
    				width : "70px",
    				hidden : ((menu == "TS" || menu == "TSS" || menu == "TO" || menu == "TSG") ? true : false),
    				attributes : {
    					style : ""
    				},
    				headerAttributes : {
    					title : "Daily Leg Cost",
    					style:"text-align:center;"
    				}
    			},{
    				field : "TOTAL_MTH_CST",
    				title : "Total Leg Cost",
    				width : "70px",
    				hidden : ((menu == "TS" || menu == "TSS" || menu == "TO" || menu == "TSG") ? true : false),
    				attributes : {
    					style : ""
    				},
    				headerAttributes : {
    					title : "Total Leg Cost",
    					style:"text-align:center;"
    				}
    			},{
    				field : "MAX_PAYLOAD_WT",
    				title : "Max Wt",
    				width : "60px",
    				attributes : {
    					style : ""
    				},
    				headerAttributes : {
    					title : "Max Weight",
    					style:"text-align:center;"
    				}
    			},{
    				field : "MAX_PAYLOAD_CU",
    				title : "Max Cu",
    				width : "60px",
    				attributes : {
    					style : ""
    				},
    				headerAttributes : {
    					title : "Max Cubes",
    					style:"text-align:center;"
    				}
    			},{
    				field : "IN_DST",
    				title : "In Dst",
    				hidden : true,//((menu == "TS" || menu == "TSS") ? true : false),
    				width : "60px",
    				attributes : {
    					style : ""
    				},
    				headerAttributes : {
    					title : "In Dest",
    					style:"text-align:center;"
    				}
    			}
    	];
    };

    constructorFn.getLegsGridDataSource = function(data, isDelete, menu) {
    	return new kendo.data.DataSource({
    		pageSize: 500,
    		data: (data != undefined) ? data : {},
    		filter: [{ field: "OPERATION_CD", operator: "neq", value: parent.OPERATION_CD_DELETE }],
    		schema: {
    			model: {
    				id: "LegsGrid",
    				fields: {
    					LEG_ID: {
    						type: "string",
    						editable: false
    					},
    					ROUTE_ID: {
    						type: "string",
    						editable: false
    					},
    					MV_NUM: {
    						type: "string",
    						editable: false
    					},
    					MV_NUM_SEQ: {
    						type: "number",
    						editable: false
    					},
    					FULL_EFFDAY_HOLIDAY_L: {
    						type: "string",
    						editable:false
    					},
    					FULL_EFFDAY_HOLIDAY_Z: {
    						type: "string",
    						editable:false
    					},
    					CAL_BUTTON_L: {
    						type: "string",
    						editable: false
    					},
    					FULL_EFFDT_Z: {
    						type: "string",
    						editable:!isDelete
    					},
    					CAL_BUTTON_Z: {
    						type: "string",
    						editable: false
    					},
    					LEG_TYPE: {
    						type: "string",
    						editable:!isDelete,
    						validation: {
    							 required: false,
    							 legtype: function (input) {
    								 if(input.val() == undefined || input.val() == "") {
    									 input.attr("data-legtype-msg", "LegType Field is Required");
    									 isValidationError = true;
    									 return false;
    								 }
    								 if (input.is("[name='LEG_TYPE']")) {
    									 var isValid = parent.SkdMxServiceHelper.getTimeAndCostServiceManagerManager().checkIsDataValid(input);
    									 if(!isValid){
    										 input.attr("data-legtype-msg", "Please enter the valid LegType");
    										 isValidationError = true;
    										 return false;
    									 }
    								}
    								isValidationError = false;
    								return true;
    								 
    							 }
    						 }
    					},
    					EQUIP_TYPE: {
    						type: "string",
    						editable:!isDelete,
    						validation: {
    							 required: false,
    							 equipmenttype: function (input) {
    								 if(input.val() == undefined || input.val() == "") {
    									 input.attr("data-equipmenttype-msg", "EqType Field is Required");
    									 isValidationError = true;
    									 return false;
    								 }
    								 if (input.is("[name='EQUIP_TYPE']")) {
    									 var isValid = parent.SkdMxServiceHelper.getTimeAndCostServiceManagerManager().checkIsDataValid(input);
    									 if(!isValid){
    										 input.attr("data-equipmenttype-msg", "Please enter the valid equipmentType");
    										 isValidationError = true;
    										 return false;
    									 }
    								}
    								isValidationError = false;
    								return true;
    								 
    							 }
    						 }
    					},
    					ORIGIN: {
    						type: "string",
    						editable:!isDelete,
    						validation: {
    							 required: false,
    							 originvalidation: function (input) {
    								 if(input.val() == undefined || input.val() == "") {
    									 input.attr("data-originvalidation-msg", "Orig Field is Required");
    									 isValidationError = true;
    									 return false;
    								 }
    								 if (input.is("[name='ORIGIN']")) {
    									 var isValid = parent.SkdMxServiceHelper.getTimeAndCostServiceManagerManager().checkIsDataValid(input);
    									 if(!isValid){
    										 input.attr("data-originvalidation-msg", "Please enter the valid location");
    										 isValidationError = true;
    										 return false;
    									 }
    								}
    								isValidationError = false;
    								return true;
    								 
    							 }
    						 }
    					},
    					DESTINATION: {
    						type: "string",
    						editable:!isDelete,
    						validation: {
    							 required: false,
    							 destinationvalidation: function (input) {
    								 if(input.val() == undefined || input.val() == "") {
    									 input.attr("data-destinationvalidation-msg", "Dest Field is Required");
    									 isValidationError = true;
    									 return false;
    								 }
    								 if (input.is("[name='DESTINATION']")) {
    									 var isValid = parent.SkdMxServiceHelper.getTimeAndCostServiceManagerManager().checkIsDataValid(input);
    									 if(!isValid){
    										 input.attr("data-destinationvalidation-msg", "Please enter the valid location");
    										 isValidationError = true;
    										 return false;
    									 }
    								}
    								isValidationError = false;
    								return true;
    								 
    							 }
    						 }
    					},
    					OWNER_LOC_CD: {
    						type: "string",
    						editable:!isDelete
    					},
    					MANAGER_ID: {
    						type: "string",
    						editable:!isDelete
    					},
    					LOCAL_DEP: {
    						type: "string",
    						editable:!isDelete,
    						validation: {
    							 required: false,
    							 localdepvalidation: function (input) {
    								 if(input.val() == undefined || input.val() == "") {
    									 input.attr("data-localdepvalidation-msg", "Dept Field is Required");
    									 isValidationError = true;
    									 return false;
    								 }
    								 if (input.is("[name='LOCAL_DEP']")) {
    									 if(!validateTimeWithOrWithoutColon(input.val())){
    										 input.attr("data-localdepvalidation-msg", "Please enter the valid Time");
    										 isValidationError = true;
    										 return false;
    									 }
    								}
    								 isValidationError = false;
    								return true;
    								 
    							 }
    						 }
    					},
    					ZULU_DEP: {
    						type: "string",
    						editable:!isDelete,
    						validation: {
    							 required: false,
    							 zuludepvalidation: function (input) {
    								 if(input.val() == undefined || input.val() == "") {
    									 input.attr("data-zuludepvalidation-msg", "Dept Field is Required");
    									 isValidationError = true;
    								 }
    								 if (input.is("[name='ZULU_DEP']")) {
    									 if(!validateTimeWithOrWithoutColon(input.val())){
    										 input.attr("data-zuludepvalidation-msg", "Please enter the valid Time");
    										 isValidationError = true;
    										 return false;
    									 }
    								}
    								 isValidationError = false;
    								return true;
    								 
    							 }
    						 }
    					},
    					LOCAL_ARR: {
    						type: "string",
    						editable:!isDelete,
    						validation: {
    							 required: false,
    							 localarrvalidation: function (input) {
    								 if(input.val() == undefined || input.val() == "") {
    									 input.attr("data-localarrvalidation-msg", "Arr Field is Required");
    									 isValidationError = true;
    								 }
    								 if (input.is("[name='LOCAL_ARR']")) {
    									 if(!validateTimeWithOrWithoutColon(input.val())){
    										 input.attr("data-localarrvalidation-msg", "Please enter the valid Time");
    										 isValidationError = true;
    										 return false;
    									 }
    								}
    								isValidationError = false;
    								return true;
    							 }
    						 }
    					},
    					ZULU_ARR: {
    						type: "string",
    						editable:!isDelete,
    						validation: {
    							 required: false,
    							 zuluarrvalidation: function (input) {
    								 if(input.val() == undefined || input.val() == "") {
    									 input.attr("data-zuluarrvalidation-msg", "Arr Field is Required");
    									 isValidationError = true;
    								 }
    								 if (input.is("[name='ZULU_ARR']")) {
    									 if(!validateTimeWithOrWithoutColon(input.val())){
    										 input.attr("data-zuluarrvalidation-msg", "Please enter the valid Time");
    										 isValidationError = true;
    										 return false;
    									 }
    								}
    								 isValidationError = false;
    								return true;
    							 }
    						 }
    					},
    					CALCULATED_ARR_TIME: {
    						type: "string",
    						editable:!isDelete
    					},
    					LOC_GRND_MIN_QTY: {
    						type: "string",
    						editable:!isDelete/*,
    						validation: {
    							 required: false,
    							 locgrndtimevalidation: function (input) {
    								 if(input.val() == undefined || input.val() == "") {
    									 return true;
    								 }
    								 if (input.is("[name='LOC_GRND_TIME']")) {
    									 if(!validateTimeWithOrWithoutColon(input.val())){
    										 input.attr("data-locgrndtimevalidation-msg", "Please enter the valid Time");
    										 return false;
    									 }
    								}
    								return true;
    								 
    							 }
    						 }*/
    					},
    					ARRIVAL_DAY_L: {
    						type: "string",
    						editable: false
    					},
    					ARRIVAL_DAY_Z: {
    						type: "string",
    						editable: false
    					},
    					BLOCK_INDAY_L_NBR: {
    						type: "string",
    						editable: false
    					},
    					BLOCK_INDAY_L_NBR: {
    						type: "string",
    						editable: false
    					},
    					FLIGHT_MINS: {
    						type: "string",
    						editable: ((menu == "FC" || menu == "TS" || menu == "TSS" || menu == "TO" || menu == "TSG") ? true : false)
    					},
    					BLOCK_TIME_Z: {
    						type: "string",
    						editable: false
    					},
    					LEG_MILES: {
    						type: "string",
    						editable: false
    					},
    					TRACK_EQUIP_TYPE: {
    						type: "string",
    						editable: !isDelete
    					},
    					TRAIL_AVAIL_TM: {
    						type: "string",
    						editable: !isDelete
    					},
    					TRAIL_OPT: {
    						type: "string",
    						editable: !isDelete
    					},
    					DAILY_RT_CC_CHG: {
    						type: "string",
    						editable: false
    					},
    					TOTAL_MTH_CST: {
    						type: "string",
    						editable: false
    					},
    					TOTALMONTH_COST_AMT:{
    						type: "string",
    						editable: ((menu == "TS" || menu == "TSS") ? true : false)
    					},
    					MAX_PAYLOAD_WT: {
    						type: "string",
    						editable: !isDelete/*,
    						 validation: {
    							 required: false,
    							 maxpayloadwt: function (input) {
    								 if(input.val() == undefined || input.val() == "") {
    									 return true;
    								 }
    								 if (input.is("[name='MAX_PAYLOAD_WT']")) {
    									 if(!validateNumberKey(input.val())){
    										 input.attr("data-maxpayloadwt-msg", "Please enter numeric value");
    										 input.attr("width","90px");
    										 return false;
    									 }
    								}
    								return true;
    								 
    							 }
    						 }*/
    					},
    					MAX_PAYLOAD_CU: {
    						type: "string",
    						editable: !isDelete/*,
    						 validation: {
    							 required: false,
    							 maxpayloadcu: function (input) {
    								 if(input.val() == undefined || input.val() == "") {
    									 return true;
    								 }
    								 if (input.is("[name='MAX_PAYLOAD_CU']")) {
    									 if(!validateNumberKey(input.val())){
    										 input.attr("data-maxpayloadcu-msg", "Please enter numeric value");
    										 input.attr("width","90px");
    										 return false;
    									 }
    								}
    								return true;
    								 
    							 }
    						 }*/
    					},
    					IN_DST: {
    						type: "string",
    						editable: false
    					}
    				}
    			},
    			parse: function (d) {
    				$.each(d, function (idx, dataItem) {	
    					parseCostData(dataItem);
    				});
    				return d;
    			}
    		}
    	});
    };
    var _instance = null;

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

function LocAllocationGridManager() {

    function constructorFn() {
        this.initialize();
    };

    constructorFn.initialize = function() {
        //
    };

    constructorFn.getLocAllocationGridColumns = function(grid_Id,dashboardID) {

    	var flag = false;
    	
    	var addRowTemplate = SkdMxREGridHelper.getCommonGridManager().getAddRowTemplate(grid_Id,false,dashboardID);
    	var deleteRowTemplate = SkdMxREGridHelper.getCommonGridManager().getDeleteRowTemplate(grid_Id,false,dashboardID);
    	var	allocCalenderRowTemplateL = SkdMxREGridHelper.getCommonGridManager().getCalenderRowTemplate(grid_Id, "L", dashboardID);
    	var	allocCalenderRowTemplateZ = SkdMxREGridHelper.getCommonGridManager().getCalenderRowTemplate(grid_Id, "Z", dashboardID);
    	return [
    			{
    				title : EMPTY_STRING,
    				width : "20px",
    				hidden : flag,
    				template : addRowTemplate,
    				attributes : {
    					style : "text-align:center;"
    				}
    			},
    			{
    				title : EMPTY_STRING,
    				width : "20px",
    				hidden : flag,
    				template : deleteRowTemplate,
    				attributes : {
    					style : "text-align:center;"
    				}
    			},
    			/*{
    				field : "MV_NUM_SEQ",
    				title : "S",
    				hidden : false,
    				width : "30px",
    				attributes : {
    					style : "text-align:center;"
    				},
    				headerAttributes : {
    					title : "Loc Allocation Sequence",
    					style : "text-align:center;"
    				}
    			},*/
    			{
    				field : "ORIG_DEST_CD",
    				title : "O/D Loc Ind*",
    				hidden: false,
    				width : "45px",
    				attributes : {
    					style:"text-align:center;border-right:none !important"
    				},
    				headerAttributes : {
    					title : "Origin/Dest Location Indicator",
    					style : "text-align:center;"
    				}
    			},{
    				title: EMPTY_STRING,
    				template: function(data) {
    					return parent.SkdGridHelper.getSkdGridManager().arrowIconRowTemplate(data, grid_Id, "OrgDesListRequest", "orgDestTextArea", "ORIG_DEST_CD", dashboardID);
    				},
    				width:"14px",
    				editable:false,
    				attributes: {
    					style:"text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
    				},
    				headerAttributes: {
    					style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
    				}
            	},{
    				field : "LOC_CD",
    				title : "Loc Code*",
    				hidden: false,
    				width : "45px",
    				attributes : {
    					style:"border-right:none !important"
    				},
    				headerAttributes : {
    					title : "Location Code",
    					style : "text-align:center;"
    				}
    			},{
    				title: EMPTY_STRING,
    				template: function(data) {
    					return parent.SkdGridHelper.getSkdGridManager().arrowIconRowTemplate(data, grid_Id, "LocationRequest", "routeLocationTextArea", "LOC_CD", dashboardID);
    				},
    				width:"14px",
    				editable:false,
    				attributes: {
    					style:"text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
    				},
    				headerAttributes: {
    					style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
    				}
            	},{
    				field : "FULL_EFFDAY_HOLIDAY_L",
    				title : "Loc Allocation Eff Days (L)*",
    				hidden : isLocalTimeFlag(),
    				width : "150px",
    				attributes : {
    					style : "border-right:none !important"
    				},
    				headerAttributes : {
    					title : "Loc Allocation Effective Days",
    					style : "text-align:center;padding-right: 0px !important;padding-left:12px !important;overflow:visible !important; border-right:none !important"
    				}
    			},
    			{
    				field : "FULL_EFFDAY_HOLIDAY_Z",
    				title : "Loc Allocation Eff Days (Z)*",
    				hidden : !isLocalTimeFlag(),
    				width : "150px",
    				attributes : {
    					style : "border-right:none !important"
    				},
    				headerAttributes : {
    					title : "Loc Allocation Effective Days",
    					style : "text-align:center;padding-right: 0px !important;padding-left:12px !important;overflow:visible !important; border-right:none !important"
    				}
    			},
    			{
    				field : "CAL_BUTTON_L",
    				title : "&nbsp;",
    				hidden : isLocalTimeFlag(),
    				width : "14px",
    				template : allocCalenderRowTemplateL,
    				attributes : {
    					style : "text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
    				},
    				headerAttributes : {
    					style : "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
    				}
    			},
    			{
    				field : "CAL_BUTTON_Z",
    				title : "&nbsp;",
    				hidden : !isLocalTimeFlag(),
    				width : "14px",
    				template : allocCalenderRowTemplateZ,
    				attributes : {
    					style : "text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
    				},
    				headerAttributes : {
    					style : "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
    				}
    			},{
    				field : "ALLOC_WEIGHT",
    				title : "Total Weight*",
    				width : "60px",
    				hidden : false,
    				headerAttributes : {
    					title : "Total Weight",
    					style : "text-align:center;"
    				}
    			}, {
    				field : "ALLOC_CUBE",
    				title : "Total Cubes*",
    				width : "60px",
    				hidden : false,
    				headerAttributes : {
    					title : "Total Cubes",
    					style : "text-align:center;"
    				}
    			} , {
    				field : "USED_WEIGHT",
    				title : "Used Weight",
    				width : "60px",
    				hidden : false,
    				attributes : {
    					style : "text-align:center;"
    				},
    				headerAttributes : {
    					title : "Used Weight",
    					style : "text-align:center;"
    				}
    			}, {
    				field : "USED_CUBE",
    				title : "Used Cubes",
    				width : "60px",
    				hidden : false,
    				attributes : {
    					style : "text-align:center;"
    				},
    				headerAttributes : {
    					title : "Used Cubes",
    					style : "text-align:center;"
    				}
    			} , {
    				field : "EXCESS_WEIGHT",
    				title : "Excess Weight",
    				width : "60px",
    				hidden : false,
    				attributes : {
    					style : "text-align:center;"
    				},
    				headerAttributes : {
    					title : "Excess Weight",
    					style : "text-align:center;"
    				}
    			}, {
    				field : "EXCESS_CUBE",
    				title : "Excess Cubes",
    				width : "60px",
    				hidden : false,
    				attributes : {
    					style : "text-align:center;"
    				},
    				headerAttributes : {
    					title : "Excess Cubes",
    					style : "text-align:center;"
    				}
    			},{
    				hidden : false,
    				sortable : false,
    				filterable : false,
    				field : "COMMENTS",
    				title: "Comment", 
    				width: "85px", 
    				attributes: {
    					style:"text-align:center;"
    				}/*, 
    				template: function(data) {
    					return revisionComentCheckboxRowTemplatehandler(data,grid_Id);
    				}*/,
    				headerAttributes: {
    	      		  	title:"Comment",
    	      		  	style:"text-align:center;"
    	      	  	}
    	    	}];
    };

    constructorFn.getLocAllocationGridDataSource = function(data) {

    	return new kendo.data.DataSource({
    		pageSize: 500,
    		data: (data != undefined) ? data : {},
    		filter: [{ field: "OPERATION_CD", operator: "neq", value: parent.OPERATION_CD_DELETE }],
    		schema: {
    			model: {
    				id: "locAllocationGrid",
    				fields: {
    					MV_NUM_SEQ: {
    						type: "string",
    						editable: false
    					},
    					EQUIP_TYPE: {
    						type: "string",
    						editable: false
    					},
    					LEG_TYPE: {
    						type: "string",
    						editable: false
    					},
    					FULL_EFFDAY_HOLIDAY_L: {
    						type: "string",
    						editable: false
    					},
    					FULL_EFFDAY_HOLIDAY_Z: {
    						type: "string",
    						editable: false
    					},
    					CAL_BUTTON_L: {
    						type: "string",
    						editable: false
    					},
    					CAL_BUTTON_Z: {
    						type: "string",
    						editable: false
    					},
    					LOC_CD: {
    						type: "string",
    						editable: true
    					},
    					ORIG_DEST_CD: {
    						type: "string",
    						editable: false
    					},
    					PROD_GRP_NM: {
    						type: "string",
    						editable: false
    					},
    					ALLOC_WEIGHT: {
    						type: "string",
    						editable: true,
    						validation: {
	   							required: false,
	   							allocweight: function (input) {
	   								if(input.val() == undefined || input.val() == "") {
	   									return true;
	   								}
	   								if (input.is("[name='ALLOC_WEIGHT']")) {
	   									if(!validateTotalWeightCube(input, 'ALLOC_WEIGHT')){
	   										input.attr("data-allocweight-msg", "Please enter weight less than allocation weight");
	   										return false;
	   									}
									}
									return true;
								}
    						}
    					},
    					ALLOC_CUBE: {
    						type: "string",
    						editable: true,
    						validation: {
	   							required: false,
	   							alloccube: function (input) {
	   								if(input.val() == undefined || input.val() == "") {
	   									return true;
	   								}
	   								if (input.is("[name='ALLOC_CUBE']")) {
	   									if(!validateTotalWeightCube(input, 'ALLOC_CUBE')){
	   										input.attr("data-alloccube-msg", "Please enter cube less than allocation cube");
	   										return false;
	   									}
									}
									return true;
								}
    						}
    					},
    					USED_WEIGHT: {
    						type: "string",
    						editable: false
    					},
    					USED_CUBE: {
    						type: "string",
    						editable: false
    					},
    					EXCESS_WEIGHT: {
    						type: "string",
    						editable: false
    					},
    					EXCESS_CUBE: {
    						type: "string",
    						editable: false
    					},
    					COMMENTS: {
    						type: "string",
    						editable: true
    					},
    					ALLOCATION_EFF_L:{
    						type: "string",
    						editable: false
    					},
    					ALLOCATION_EFF_Z:{
    						type: "string",
    						editable: false
    					}
    				}
    			},
    			parse: function (d) {
    				$.each(d, function (idx, dataItem) {	
    					parseLocAllocationCostData(dataItem);
    				});
    				return d;
    			}
    		}
    	});
    };
    var _instance = null;

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