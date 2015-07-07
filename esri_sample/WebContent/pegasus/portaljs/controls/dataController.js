/**
 * @author 888608 - Module & Singleton design pattern ESRI Graphic Manager for Map
 * @returns {ESRIGraphicManager}
 */
var DataHelper = (function() {
    function constructorFn() {
        
    };

    return constructorFn;
})();


DataHelper.getMasterDataManager = function(){
	return DataManager.getInstance();
};

DataHelper.getTooltipManager = function(){
	return TooltipManager.getInstance();
};

var DataContants = {
	/* Equipment constants*/
	EQUIPMENT: "equipment",	
	EQUIP_FLIGHT_FEEDER: "FlightEquipmentTypes_1",
	EQUIP_FLIGHT_TRUNK: "FlightEquipmentTypes_2",
	EQUIP_FLIGHT_CLH: "FlightEquipmentTypes_Y",
	EQUIP_TRUCK_STANDARD: "TruckEquipmentTypes_S",
	EQUIP_TRUNK_OVERSIZE: "TruckEquipmentTypes_O",
	EQUIP_CD: "eqType",
	EQUIP_DESC: "eqTypeDesc",
	EQUIP_CONVEYANCE: "conveyance",
	EQUIP_IS_LINE_HAUL: "isCommercialLinehaul",
	EQUIP_CAPACITY_TYPE: "capacityType",
	
	/* Leg type constants*/
	LEG_TYPE: "legType",
	LEGTYPE_FLIGHT: "FlightLegTypes",
	LEGTYPE_TRUCK: "TruckLegTypes",
	LEGTYPE_OTHER: "OtherLegTypes",
	LEGTYPE_CD: "legTypeCd",
	LEGTYPE_DESC: "legTypeDesc",
	
	/*Common constants*/
	EMPTY_STRING: "",
	UNDER_SCROE: "_"
};