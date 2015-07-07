/**
 * @author 927452 Praveen Kumar
 * This script is to control the cache for various data widgets for the query
 * Included in pegasusSimpleQueryViewer.jsp
 */

/**
 *  This class holds responsibility for managing caching of objects 
 *  for all the UI Widgets for SQW window
 */
var QueryCacheManager = (function() {
	
//	single instance of the class for the application level
    var _instance;
    
//     initializing for the cache Manager  
    function init() {
//    	Hashmap to hold the (key:type) and (value:URL to load the cache)
        var simpleQueryDatasourceNames = {
            "Activities": parent.getActivitiesDataURL(),
            "ActivitiesDetail": parent.getActivitiesDetailDataURL(),
            "ActivitiesDetailSQW": parent.getSQWActivitiesDetailDataURL(),
            "ActivityFacilities": parent.getSQWActivityFacilityDataURL(),
            "FacilityGroups": parent.getFacilitesGroupDataURL(),
            "FacilityGroupLocations": parent.getLocationsFacilitesGroupDataURL(),
            "Products": parent.getProductsDataURL(),
            "ProductGroups": parent.getProductGroupsDataURL(),
            "GlobalRegions": parent.getGlobalRegionDataURL(),
            "ZonesList": parent.getZonesDataURL(),
            "CountryCodes": parent.getCountryCodesDataURL(),
            "Locations": parent.getLocationsDataURL(),
            "LocationsWithGlobalRegion": parent.getFacilityDataURL(),
            "FlightEquipmentTypes": parent.getEquipmentsDataURL("F"),
            "TruckEquipmentTypes": parent.getEquipmentsDataURL("T"),
            "FlightLegTypes": parent.getLegsDataURL("F"),
            "TruckLegTypes": parent.getLegsDataURL("T"),
            "OtherLegTypes": parent.getLegsDataURL("O"),
            "LaneStatus": parent.getLaneStatusRenderer()
        };
//		Hash-map to hold the (key:data source name) and (value:list of object for the corresponding data source)
        var simpleQueryDatasourceMap;
//      Hash-map to hold the (key:data source name) and (value:flag to determine if the data source is initialized)
        var isCacheInitializedMap;
//        call-back method to handle the cache initializing for the specified data source 
        var initializeCallbackHandler;
        return {
//        	method to get the simpleQueryDatasourceMap
            _getSimpleQueryDatasourceMap: function() {
                return simpleQueryDatasourceMap;
            },
//        	method to get the isCacheInitializedMap
            _getCacheInitializedMap: function() {
                return isCacheInitializedMap;
            },
//			initializer for the cache 
//          callbackMethod: call back method for the initializer
            initialize: function(callbackMethod) {
                var commonCaseId = parent.getCommonCaseId();
                this.clearCache();
                if (commonCaseId != undefined && commonCaseId != "") {
                    console.log("Loading the cache details for Common case id [" + commonCaseId + "] ");
                    this.initializeCache();
                } else {
                    console.log("Common case id [" + commonCaseId + "] is mandatory");
                }
                initializeCallbackHandler = callbackMethod;
                delete commonCaseId;
            },
//			method to initialize the cache
            initializeCache: function() {
                simpleQueryDatasourceMap = this.initializeSimpleQueryDatasourceMap();
            },
//			method to initialize the initializeSimpleQueryDatasourceMap
            initializeSimpleQueryDatasourceMap: function() {
                var cacheController = this;
                if (isCacheInitializedMap == undefined) {
                    isCacheInitializedMap = {};
                }
                if (simpleQueryDatasourceNames != undefined) {
                    for (var key in simpleQueryDatasourceNames) {
                        cacheController.refreshDatasource(key);
                        isCacheInitializedMap[key] = false;
                    }
                }
                return null;
            },
//			method to refresh  the specified datasource  
            refreshDatasource: function(dataSourceName) {
                var cacheController = this;
                if (dataSourceName != null) {
                    if (simpleQueryDatasourceMap != undefined && simpleQueryDatasourceMap[dataSourceName] != undefined) {
                        delete simpleQueryDatasourceMap[dataSourceName];
                    }
                    var paramsMap = {};
                    paramsMap.name = dataSourceName;
                    callService({
                        url: simpleQueryDatasourceNames[dataSourceName] + parent.getCommonCaseId() + "&rand=" + getTime(),
                        paramsMap: paramsMap,
                        successCallback: function(response, io, successObj) {
                            cacheController.refreshDatasourceSuccessHandler(response, io, successObj);
                        },
                        failureCallback: function(response, io) {
                            console.log("Error while initializing the cache for [" + dataSourceName + "] ");
                            isCacheInitializedMap[dataSourceName] = true;
                        },
                        showProgressWindow: false
                    });
                }

            },
//			call-back handler for the refresh success for the specified datasource  
            refreshDatasourceSuccessHandler: function(response, io, successObj) {
                var cacheController = this;
                if (simpleQueryDatasourceMap == undefined) {
                    simpleQueryDatasourceMap = {};
                }
                simpleQueryDatasourceMap[successObj.data.substring(successObj.data.indexOf("=") + 1, successObj.data.indexOf("&"))] = response;
                isCacheInitializedMap[successObj.data.substring(successObj.data.indexOf("=") + 1, successObj.data.indexOf("&"))] = true;
                if (initializeCallbackHandler != undefined && cacheController.isCacheInitialized()) {
                    cacheController.parseZonesByRegion();
                    initializeCallbackHandler(simpleQueryDatasourceMap);
                }

            },
//			method to return the cache object 
            getSimpleQueryDatasourceMap: function() {
                var cacheController = this;
                if (simpleQueryDatasourceMap == undefined || !cacheController.isCacheInitialized()) {
                    cacheController.initializeSimpleQueryDatasourceMap();
                    return cacheController._getSimpleQueryDatasourceMap();
                } else {
                    return simpleQueryDatasourceMap;
                }
                return null;
            },
//			method to check if the is initialized ?
            isCacheInitialized: function() {
                var isInitialized = true;
                if (isCacheInitializedMap != undefined) {
                    $.each(isCacheInitializedMap, function(key, value) {
                        if (!isCacheInitializedMap[key]) {
                            isInitialized = false;
                            return isInitialized;
                        }
                    });
                } else {
                    return false;
                }
                return isInitialized;
            },
//			method to clear the cache
            clearCache: function() {
                isCacheInitializedMap = undefined;
                simpleQueryDatasourceMap = undefined;
            },
//			method to get the values for the specified dataSource name
            getDatasource: function(key) {
                var cacheController = this;
                if (simpleQueryDatasourceMap != undefined && simpleQueryDatasourceMap[key] != undefined) {
                    return simpleQueryDatasourceMap[key];
                }
                return null;
            },
//			method to create the zones cache for the zone selector
            parseZonesByRegion: function() {
                $.each(simpleQueryDatasourceMap["GlobalRegions"], function(rKey, rValue) {
                    $.each(simpleQueryDatasourceMap["ZonesList"], function(zKey, zValue) {
                        if (rValue.globalRgnCd == zValue.globalRgnCd) {
                            if (rValue.items == undefined) {
                                rValue.items = new Array();
                                zValue.zlabel = zValue.zoneDesc;
                                rValue.items.push(zValue);
                            } else {
                                zValue.zlabel = zValue.zoneDesc;
                                rValue.items.push(zValue);
                            }
                        }
                    });
                });
            }
        };
    };

    return {
//    	method to get the instance of the cache if exist or initialize 
        getInstance: function() {
            if (!_instance) {
                _instance = init();
            }
            return _instance;
        }
    };
})();