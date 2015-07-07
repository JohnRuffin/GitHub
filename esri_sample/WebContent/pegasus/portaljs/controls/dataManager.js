/**
 * 
 */

var DataManager = (function () {

    function constructorFn() {
        this.initialize();
    };

    constructorFn.initialize = function() {

    };


    constructorFn.getEquipmentData = function() {

    };

    constructorFn.getEquipmentDataByType = function(type) {
        var dataType = type.split(DataContants.UNDER_SCROE)[0];
        var filterType = type.split(DataContants.UNDER_SCROE)[1];
        var attributes = this.getSearchAttributes(type);
        var data = parent.getDashboardContentWindow(parent.DASHBOARD_ID_QUERY).getQueryDatasources()[dataType].data();
        return  $.grep(data, function(e) {
            return e[attributes[2]] != undefined ? e[attributes[2]].toString().toLowerCase() == filterType.toString().toLowerCase() : undefined;
        });
    };

    /**
     * FlightEquipmentTypes_1 => Flight - Feeder
     * FlightEquipmentTypes_2 => Flight - Trunk
     * FlightEquipmentTypes_Y => Flight - Commercial line haul
     * TruckEquipmentTypes_S => Truck - Standard
     * TruckEquipmentTypes_O => Truck - Over size
     */
    constructorFn.getSearchAttributes = function(type) {
        switch (type) {
        case DataContants.EQUIPMENT:
        case DataContants.EQUIP_FLIGHT_FEEDER:
        case DataContants.EQUIP_FLIGHT_TRUNK:
            return [DataContants.EQUIP_CD, DataContants.EQUIP_DESC, DataContants.EQUIP_CONVEYANCE];
            break;
        case DataContants.EQUIP_FLIGHT_CLH:
            return [DataContants.EQUIP_CD, DataContants.EQUIP_DESC, DataContants.EQUIP_IS_LINE_HAUL];
            break;
        case DataContants.EQUIP_TRUCK_STANDARD:
        case DataContants.EQUIP_TRUNK_OVERSIZE:
            return [DataContants.EQUIP_CD, DataContants.EQUIP_DESC, DataContants.EQUIP_CAPACITY_TYPE];
            break;
        case DataContants.LEG_TYPE:
        case DataContants.LEGTYPE_FLIGHT:
        case DataContants.LEGTYPE_TRUCK:
        case DataContants.LEGTYPE_OTHER:
            return [DataContants.LEGTYPE_CD, DataContants.LEGTYPE_DESC];
            break;
        }
    };

    constructorFn.getDataSource = function(type) {
        if (type == DataContants.EQUIP_FLIGHT_FEEDER || type == DataContants.EQUIP_FLIGHT_TRUNK || type == DataContants.EQUIP_FLIGHT_CLH || type == DataContants.EQUIP_TRUCK_STANDARD || type == DataContants.EQUIP_TRUNK_OVERSIZE) {
            return this.getEquipmentData(type);
        } else {
            return parent.getDashboardContentWindow(parent.DASHBOARD_ID_QUERY).getQueryDatasources()[type].data();
        }
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
})();

//tooltip manager
var TooltipManager = (function () {
	
	var _instance;
	
    function constructorFn() {
        this.initialize();
    };

    constructorFn.initialize = function() {

    };

    constructorFn.getEquipmentTooltip = function(equipCd) {
    	var tooltip = DataContants.EMPTY_STRING;
        if (equipCd != undefined) {
            var equipData = DataHelper.getMasterDataManager().getEquipmentDataByType(DataContants.EQUIP_FLIGHT_FEEDER);
            if (equipData != undefined) {
            	tooltip = this.getTooltip(DataContants.EQUIPMENT, equipCd, equipData);
            	
            	if(tooltip === DataContants.EMPTY_STRING || tooltip === undefined){
            		equipData = DataHelper.getMasterDataManager().getEquipmentDataByType(DataContants.EQUIP_FLIGHT_TRUNK);
            		if(equipData != undefined){
            			tooltip = this.getTooltip(DataContants.EQUIPMENT, equipCd, equipData);
            			
            			if(tooltip === DataContants.EMPTY_STRING || tooltip === undefined){
                    		equipData = DataHelper.getMasterDataManager().getEquipmentDataByType(DataContants.EQUIP_FLIGHT_CLH);
                    		if(equipData != undefined){
                    			tooltip = this.getTooltip(DataContants.EQUIPMENT, equipCd, equipData);
                    		}
                    	}            			
            		}
            	}
            }
        }
        return tooltip;
    };

    constructorFn.getTooltip = function(type, code, data) {
        switch (type) {
        case DataContants.EQUIPMENT:
            if (code != undefined && data != undefined) {
                var attributes = DataHelper.getMasterDataManager().getSearchAttributes(type);
                var results = $.grep(data, function(e) {
                    return (e[attributes[0]] === code);
                });
                
                return (results!= undefined && results.length > 0)?(results[0][attributes[0]]+" - "+ results[0][attributes[1]]): DataContants.EMPTY_STRING;
            }
            break;
        case DataContants.LEG_TYPE:
        	if (code != undefined && data != undefined) {
                var attributes = DataHelper.getMasterDataManager().getSearchAttributes(type);
                var results = $.grep(data, function(e) {
                    return (e[attributes[0]] === code);
                });
                
                return (results!= undefined && results.length > 0)?(results[0][attributes[0]]+" - "+ results[0][attributes[1]]): DataContants.EMPTY_STRING;
            }
            break;
        }
    };

    constructorFn.getLegTypeTooltip = function(legTypeCd) {
    	var tooltip = DataContants.EMPTY_STRING;
        if (legTypeCd != undefined) {
            var data = DataHelper.getMasterDataManager().getDataSource(DataContants.LEGTYPE_FLIGHT);
            if (data != undefined) {
            	tooltip = this.getTooltip(DataContants.LEG_TYPE, legTypeCd, data);
            	
            	if(tooltip === DataContants.EMPTY_STRING || tooltip === undefined){
            		data = DataHelper.getMasterDataManager().getEquipmentDataByType(DataContants.LEGTYPE_TRUCK);
            		if(data != undefined){
            			tooltip = this.getTooltip(DataContants.LEG_TYPE, legTypeCd, data);
            			
            			if(tooltip === DataContants.EMPTY_STRING || tooltip === undefined){
            				data = DataHelper.getMasterDataManager().getEquipmentDataByType(DataContants.LEGTYPE_OTHER);
                    		if(data != undefined){
                    			tooltip = this.getTooltip(DataContants.LEG_TYPE, legTypeCd, data);
                    		}
                    	}            			
            		}
            	}
            }
        }
        return tooltip;
    };

    constructorFn.setToolTip = function (that,dashboardId) {
    	var dashboard = null;
    	if(dashboardId != undefined){
			dashboard = getDashboardContentWindow(dashboardId);
    	}	
    	var tooltip = "";
    	var dataText = $(that).text();
    	var row = $(that).closest("tr");
    	var tblId = $(that).closest('table').parent().parent()[0].id;
//        var rowIdx = $("tr", $('#'+tblId).data('kendoGrid').tbody).index(row);
        var colIdx = $("td", row).index(that);
        var colName = dashboard.$('#'+tblId).find('th').eq(colIdx).text();
    	switch(colName){
    	case 'Equip Type':
    	case 'Equip Type*':
    		if(dataText != null && dataText != "") {
    			tooltip = DataHelper.getTooltipManager().getEquipmentTooltip(dataText);
    		}
    		break;
    	case 'Leg Type':
    	case 'Leg Type*':
    		if(dataText != null && dataText != "") {
    			tooltip = DataHelper.getTooltipManager().getLegTypeTooltip(dataText);
    		}
    		break;	
    	}
    	
    	if(isNull(tooltip)){
    		tooltip = dataText;
    	}
//    	console.log(tooltip.trim());
    	$(that).attr("title", tooltip.trim());
    	return tooltip.trim();
    };

    return {
        getInstance: function() {
            if (_instance == undefined) {
                _instance = constructorFn;
                _instance.initialize();
            }
            return _instance;
        }
    };
})();