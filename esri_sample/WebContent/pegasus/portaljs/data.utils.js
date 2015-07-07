/**
 * @author 888600 Abhishek Sharma
 * This is the data utils script.
 * This script contains common data related methods and constants.
 */
var OUTPUT_TYPE_JSON = "json";
var FACILITY_GROUP = "Fac Group";
/**
 * This method is used to replace few special chars in the where clause.
 * @param whereClause - where condition
 * @returns where clause query after removing special chars
 */

function escapeWhereClause(whereClause) {
    if (whereClause) {
        whereClause = whereClause.replace(/\=/g, ':');
        whereClause = whereClause.replace(/\'/g, '#');
        whereClause = whereClause.replace(/\!/g, '-');
    }

    return whereClause;
}

/** Methods to return the master data urls Start*/

/**
 * Methods to return the master data url for Product
 */

function getProductsDataURL() {
    return getDataURL(DATA_TYPE_PRODUCTS);
}

/**
 * Methods to return the master data url for Product Groups
 */

function getProductGroupsDataURL() {
    return getDataURL(DATA_TYPE_PRODUCTGROUPS + "&subCategory=Network");
}

/**
 * Methods to return the master data url for Product Groups Volume
 */

function getProductGroupsVolumeDataURL() {
    return getDataURL(DATA_TYPE_PRODUCTGROUPS + "&subCategory=Volume", true);
}

/**
 * Methods to return the master data url for Facilities Locations
 */

function getFacilityLocsByCountryCodeDataURL() {
    return getDataURL(DATA_TYPE_FACILITY_LOCS_BY_COUNTRY_CODE);
}

/**
 * Methods to return the master data url for Activities
 */

function getActivitiesDataURL() {
    return getDataURL(DATA_TYPE_ACTIVITIES);
}

/**
 * Methods to return the master data url for Activities Details
 */

function getActivitiesDetailDataURL() {
    return getDataURL(DATA_TYPE_ACTIVITIES_DETAIL);
}

/**
 * Methods to return the master data url for Locations
 */

function getLocationsDataURL() {
    return getDataURL(DATA_TYPE_LOCATIONS);
}

/**
 * Methods to return the master data url for Locations
 */

function getFacilityDataURL() {
    return getDataURL(DATA_TYPE_FACILITIES);
}

/**
 * Methods to return the master data url for Activity Facility
 */

function getActivityFacilityDataURL() {
    return getDataURL(DATA_TYPE_ACTIVITY_FACILITY);
}
/**
 * Methods to return the master data url for Activity Facility
 */

function getSQWActivityFacilityDataURL() {
    return getDataURL(DATA_TYPE_SQW_ACTIVITY_FACILITY);
}

/**
 * Methods to return the master data url for Activity Facility
 */

function getNearByLocationsRenderer() {
    return COMMON_SERVICE_RENDERER + "&commonCaseId=" + parent.getCommonCaseId() + "&operation=getNearestLocations";
}

/**
 * Methods to return the master data url for Activity Facility
 */

function getLaneStatusRenderer() {
    return COMMON_SERVICE_RENDERER + "&operation=getLaneStatus&commonCaseId=";
}
/**
 * Methods to return the master data url for Activity Facility
 */

function getSQWActivitiesDetailDataURL() {
    return getDataURL(DATA_TYPE_SQW_ACTIVITIES_DETAIL);
}
/**
 * Methods to return the master data url for Facility Groups
 */

function getFacilitesGroupDataURL() {
    return getDataURL(DATA_TYPE_FACILITIESGROUPS);
}
/**
 * Methods to return the master data url for Facility Group Locations
 */

function getLocationsFacilitesGroupDataURL() {
    return getDataURL(DATA_TYPE_LOCATIONS_BY_FACILITIESGROUP);
}
/**
 * Methods to return the master data url for Zones List
 */

function getZonesDataURL() {
    return getDataURL(DATA_TYPE_ZONESLIST);
}
/**
 * Methods to return the master data url for Global Region List
 */

function getGlobalRegionDataURL() {
    return getDataURL(DATA_TYPE_GLOBALREGION);
}
/**
 * Methods to return the master data url for Country Code List
 */

function getCountryCodesDataURL() {
    return getDataURL(DATA_TYPE_COUNTRYCODES);
}

/**
 * Methods to return the master data url
 */

function getDataURL(dataType, isNoNeedCommonCaseParam) {
    if (isNoNeedCommonCaseParam) {
        return MASTER_DATA_URL + dataType;
    }
    return MASTER_DATA_URL + dataType + "&commonCaseId=";
}
/**
 * Methods to return the master data url for Equipments
 * @param subCategory - It could be "Network", "Schedule", "Volume"
 */

function getEquipmentsDataURL(subCategory) {
    return getDataURL(DATA_TYPE_EQUIPMENTTYPES + "&subCategory=" + subCategory);
}
/**
 * Methods to return the master data url for Legs
 * @param subCategory - It could be "Network", "Schedule", "Volume"
 */

function getLegsDataURL(subCategory) {
    return getDataURL(DATA_TYPE_LEGTYPES + "&subCategory=" + subCategory);
}

/**
 * Methods to return the master data url for Legs
 * @param subCategory - It could be "Network", "Schedule", "Volume"
 */

function getFlightRoutesDataURL() {
    return getDataURL(DATA_TYPE_ROUTEFLIGHTS);
}

/**
 * Methods to return the master data url for Legs
 * @param subCategory - It could be "Network", "Schedule", "Volume"
 */

function getTruckRoutesDataURL() {
    return getDataURL(DATA_TYPE_ROUTETRUCKS);
}


/**
 * This method will return "L".
 * @returns "L"
 */

function getLocalZuluFlag() {
    return LOCAL_ZULU_FLAG;
}

/**
 * This method returns String value.
 */

function replacer(key, value) {
    if (typeof value === 'number' && !isFinite(value)) {
        return String(value);
    }
    return value;
} /** Methods to return the master data urls End */

/**
 * Constant of connectivity error types in Map/Schematic display setting.
 */
var CONN_ERROR_TYPES = ['Connectivity and capacity', 'Connectivity', 'Capacity'];

/**
 * Method to return array of connection error types.
 * @returns {Array}
 */

function getConnErrorTypes() {
    return CONN_ERROR_TYPES;
}
/**
 * Method to return Flight Trunk types in Map/Schematic display options. 
 * @returns {Array}
 */

function getFltTrunkTypes() {
    return ['All Flt-Trunk', 'Others'];
}
/**
 * Method to return Flight Feeder types in Schedule Map/Schedule Schematic display options.
 * @returns {Array}
 */

function getFltFeederTypes() {
    return ['All Flt-Feeder', 'Others'];
}
/**
 * Method to return Truck types in Schedule Map/Schedule Schematic display options.
 * @returns {Array}
 */

function getTruckTypes() {
    return ['All Trucks', 'Others'];
}
/**
 * Method to return Rail types in Schedule Map/Schedule Schematic display options.
 * @returns {Array}
 */

function getRailTypes() {
    return ['All Rail', 'Others'];
}
/**
 * Method to return Ship types in Schedule Map/Schedule Schematic display options.
 * @returns {Array}
 */

function getShipTypes() {
    return ['All Ship', 'Others'];
}

function getZoomLevels() {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
}
/*
function getflyTrunkTypes(){
	return ["Ad-hoc (intl)","Administrative","Airmail","Charter (military)","Charter (non-military)","Codeshare","Flex","Maintenance","Other","Package (domestic)","Package (intl)","Passenger flights","Staging","Staging (charter)","Staging (intl)","Training (FEC)","Training (feeder)"];
}*/

/**
 * Method to return hard coded values in Flight Trunk type dropdown in Schedule Map/Schedule Schematic display options.
 * This is not being used as data is coming from service now
 * @returns {Array}
 */

function getflyTrunkTypes() {
    return [{
        Text: "Ad-hoc (intl)",
        Value: "1"
    }, {
        Text: "Administrative",
        Value: "2"
    }, {
        Text: "Airmail",
        Value: "3"
    }, {
        Text: "Charter (military)",
        Value: "4"
    }, {
        Text: "Charter (non-military)",
        Value: "5"
    }, {
        Text: "Codeshare",
        Value: "6"
    }, {
        Text: "Flex",
        Value: "7"
    }, {
        Text: "Maintenance",
        Value: "8"
    }, {
        Text: "Other",
        Value: "9"
    }, {
        Text: "Package (domestic)",
        Value: "10"
    }, {
        Text: "Package (intl)",
        Value: "11"
    }, {
        Text: "Passenger flights",
        Value: "12"
    }, {
        Text: "Staging",
        Value: "13"
    }, {
        Text: "Staging (charter)",
        Value: "14"
    }, {
        Text: "Staging (intl)",
        Value: "15"
    }, {
        Text: "Training (FEC)",
        Value: "16"
    }, {
        Text: "Training (feeder)",
        Value: "17"
    }];
}

/**
 * Method to return hard coded values in Truck type dropdown in Schedule Map/Schedule Schematic display options.
 * This is not being used as data is coming from service now
 * @returns {Array}
 */

function gettruckTypes() {
    return ["CorpTraffic: Non-revenue truck", "LH Truck: All products", "LH Truck: Bobtail", "LH Truck: Meet point", "LH Truck: No PML", "LH Truck: Non-revenue", "LH Truck: PML non-revenue", "LH Truck: PML Revenue", "LH Truck: Void", "SH Truck: All products", "SH Truck: Bobtail", "SH Truck: Intl contract", "SH Truck: No PML", "SH Truck: Non-revenue", "SH Truck: PML non-revenue", "SH Truck: PML revenue", "SH Truck: PUD", "SH Truck: Void", "Taxi only"];
}

/**
 * Method to return hard coded values of days.
 * @returns {Array}
 */

function getDays() {
    return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"];
}

/**
 * Method to return Lane status configuration of Lane Status drop down in Network Query window based on how Network Query will accept on different combination.
 * @returns {Array}
 */

function getCapacityTypes() {
    return [{
        ErrorType: "Capacity",
        ErrorTypeValue: -1,
        value: "",
        label: "Any"
    }, {
        ErrorType: "Capacity",
        ErrorTypeValue: 4,
        value: 4,
        label: "All capacity errors"
    }, {
        ErrorType: "Capacity",
        ErrorTypeValue: 1,
        value: 1,
        label: "Has excess capacity"
    }, {
        ErrorType: "Capacity",
        ErrorTypeValue: 2,
        value: 2,
        label: "Has partial capacity"
    }, {
        ErrorType: "Capacity",
        ErrorTypeValue: 3,
        value: 3,
        label: "Has empty capacity"
    }, {
        ErrorType: "Capacity",
        ErrorTypeValue: 0,
        value: 0,
        label: "Capacity is OK"
    }];
}
/**
 * Method to return hard coded values in Routing type in Network Query window.
 *  This is not being used now
 * @returns {Array}
 */

function getQueryTypes() {
    return [{
        label: "Lane level",
        value: "L"
    }, {
        label: "Full routing",
        value: "F"
    }];
}

function getConnectivityTypes() {
    return [{
        ErrorType: "Connectivity",
        ErrorTypeValue: -1,
        value: -1,
        label: "Any"
    }, {
        ErrorType: "Connectivity",
        ErrorTypeValue: 1,
        value: 1,
        label: "Has connectivity errors"
    }, {
        ErrorType: "Connectivity",
        ErrorTypeValue: 0,
        value: 0,
        label: "Connectivity is OK"
    }];
}

function getRoutingTypes() {
    return [{
        label: "Any",
        value: "All"
    }, {
        label: "HAR",
        value: "HAR"
    }, {
        label: "Not HAR",
        value: "Not HAR"
    }, {
        label: "PTP",
        value: "PTP"
    }, {
        label: "Single sort",
        value: "Single sort"
    }, {
        label: "Multi-sort",
        value: "Multi-sort"
    }, {
        label: "Custom sort",
        value: "Custom sort"
    }];
}
var modeTypes = ["FlySuggested", "FlyMandatory", "TruckSuggested", "TruckMandatory", "OtherSuggested", "OtherMandatory", "DifferentMode"];

function getFilterModes() {
    return [{
        label: "Fly - Suggested",
        value: "FlySuggested"
    }, {
        label: "Fly - Mandatory",
        value: "FlyMandatory"
    }, {
        label: "Truck - Suggested",
        value: "TruckSuggested"
    }, {
        label: "Truck - Mandatory",
        value: "TruckMandatory"
    }, {
        label: "Other - Suggested",
        value: "OtherSuggested"
    }, {
        label: "Other - Mandatory",
        value: "OtherMandatory"
    }, {
        label: "Use different mode",
        value: "DifferentMode"
    }];
}


/**
 * Method to return configuration of Transit types in Network Query window.
 * Called in filters.grid.js
 * @returns {Array}
 */

function getTransitTypes(isTransitAvail) {
    if (isTransitAvail) {
        return [" ", "Any", "Optional", "Mandatory"];
    } else {
        return [" ", "Any", "Optional", "Mandatory", "No Transit"];
    }

}

function getPlacesTypes() {
    return ["Location", FACILITY_GROUP, "Country", "Region"];
}

/**
 * Method to return configuration of Suggested mode/Mandatory mode in Network Query window.
 * Called in filters.grid.js
 * @returns {Array}
 */

function getSMorMMTypes() {
    return [{
        value: "",
        desc: ""
    }, {
        value: "F",
        desc: "Fly"
    }, {
        value: "T",
        desc: "Truck"
    }, {
        value: "R",
        desc: "Rail"
    }, {
        value: "S",
        desc: "Ship"
    }];
}
/**
 * Method to return hard coded values in Routing type in Schedule Query window.
 *  This is not being used now
 * @returns {Array}
 */

function getRoutesTypes() {
    return ["All types", "Line haul", "Shuttle"];
}
/**
 * Method to return hard coded values in Carrier type in Schedule Query window.
 *  This is not being used now
 * @returns {Array}
 */

function getCarrierTypes() {
    return ["Fx", "Contract or Other"];
}
/**
 * Method to return Departure/Arrival dropdown configuration in Schedule Query window.
 * Called in filters.grid.js
 * @returns {Array}
 */

function getDeptAndArrivalsTypes() {
    return ["Departs", "Arrives", "Active"];
}
/**
 * Method to return Operator dropdown configuration in Schedule Query window.
 * Called in filters.grid.js
 * @returns {Array}
 */

function getOprationTypes() {
    return ["and", "or", "bi"];
}

function getFlightTypes() {
    return ['Flight-Trunk', 'Flight-Feeder','Flight-Commercial Line Haul','Truck-Standard Line Haul',
            'Truck-Standard Shuttle', 'Truck-Standard GNP/8888', 'Truck-Oversized/Z/GBT'];
}
/**
 * Method to return map type configuration in map window.
 * Called in mapViewer.js
 * @returns {Array}
 */

function getMapTypes() {
    return ["Relief", "Grey", "Topography", "Oceans"];
}
/**
 * Method to return region type configuration in map window.
 * Called in mapViewer.js
 * @returns {Array}
 */

function getRegionTypes() {
    return ["All", "APAC only", "APAC-US", "Europe only", "Europe-APAC", "North America", "US only", "US-Europe"];
}

/**
 * Method to return Filters Query type.
 * This method will return the index of the currently selected tab (Network/Schedule)
 * Called in mapViewer.js
 * @returns {Array}
 */

function getFiltersQueryType() {
    return $("#tabStrip").data("kendoTabStrip").select().index();
}

/**
 * method to create an array with unique values
 * @param array
 * @returns
 */

function arrayUnique(array) {
    var tempArray = array.concat();
    for (var i = 0; i < tempArray.length; ++i) {
        for (var j = i + 1; j < tempArray.length; ++j) {
            if (tempArray[i] === tempArray[j]) tempArray.splice(j--, 1);
        }
    }
    return tempArray;
};

function ActivityUtils() {

};
ActivityUtils.searchActivitiesByLocAndDays = function(datasource, filterByLocCd, filterByDays) {

    if (datasource != null && datasource.length > 0) {
        if (filterByLocCd != undefined && filterByLocCd != "") {
            var locIndex = datasource[0].indexOf(filterByLocCd);
            var actObj = {};
            //filterByDays = [6];
            if (locIndex >= 0) {
                if (filterByDays != undefined && filterByDays.length > 0) {
                    actObj = ActivityUtils.searchActivitiesByDays(datasource[1][locIndex].value, filterByDays);
                } else {
                    actObj = datasource[1][locIndex].value;
                }
                return actObj;
            }
        }
    }
    return "";

};

ActivityUtils.searchActivitiesByDays = function(activityObj, filterByDays) {
    var filterDaysStr = "";
    var activeActiviy = [];

    filterByDays = ActivityUtils.getSelectedDays(filterByDays);

    if (filterByDays != undefined) {
        for (var i = 0; i < filterByDays.length; i++) {
            var week = Math.ceil(parseInt(filterByDays[i]) / 7);
            var day = filterByDays[i] % 7;
            //var day = parseInt(filterByDays[i])%7;
            if (day == 0) {
                day = 7;
            }

            var actObj = $.grep(activityObj, function(obj) {
                var effDaysArr = obj["effDaysL"].split(",");
                return effDaysArr[week - 1].trim().charAt(day - 1) !== '-';
            });

            activeActiviy = $.merge(activeActiviy, actObj);
        }

        var uniqueAct = ActivityUtils.getUniqueDays(activeActiviy);

        return uniqueAct;
    }
};
ActivityUtils.getUniqueDays = function(filterByDays) {
    var result = [];
    $.each(filterByDays, function(i, v) {
        if ($.inArray(v, result) == -1) result.push(v);
    });
    return result;
};
ActivityUtils.getSelectedDays = function(filterByDays) {
    var daysArr = [];
    var allDays = filterByDays.split(",");
    for (var i = 0; i < allDays.length; i++) {
        var day = allDays[i];
        if (day.indexOf("-") >= 0) {
            var dayRange = day.split("-");
            ActivityUtils.getSelectedDaysByRange(daysArr, parseInt(dayRange[0]), parseInt(dayRange[1]));
        } else {
            daysArr.push(day);
        }
    }
    return daysArr;
};
ActivityUtils.getSelectedDaysByRange = function(daysArr, stIndex, enIndex) {
    console.log(daysArr);
    for (var i = stIndex; i <= enIndex; i++) {
        daysArr.push(i);
    }
};
ActivityUtils.getActivityHTMLOptions = function(divId, activityArray, code, id) {
    var html = "";
    var customActy = [];
    var origActy = [];
    var destActy = [];
    var consolActy = [];
    var ppActy = [];
    var sortActy = [];
    //		console.log("activityArray length"+ activityArray.length);
    for (var i = 0, length = activityArray.length; i < length; ++i) {
        var actType = activityArray[i].actyType;
        switch (actType) {
        case 'C':
            // Custom Activities
            customActy.push(activityArray[i]);
            break;
        case 'O':
            // Origin Activities 
            origActy.push(activityArray[i]);
            break;
        case 'D':
            // Destination Activities
            destActy.push(activityArray[i]);
            break;
        case 'M':
            // Consolidation Activities
            consolActy.push(activityArray[i]);
            break;
        case 'P':
            // Point to Point Activities
            ppActy.push(activityArray[i]);
            break;
        case 'S':
            // Sort Activities
            sortActy.push(activityArray[i]);
            break;
        }
    }

    // Sorting all arrays based on activity code
    customActy.sort(function(a, b) {
        var a1 = a.actyCd,
            b1 = b.actyCd;
        if (a1 == b1) return 0;
        return a1 > b1 ? 1 : -1;
    });

    origActy.sort(function(a, b) {
        var a1 = a.actyCd,
            b1 = b.actyCd;
        if (a1 == b1) return 0;
        return a1 > b1 ? 1 : -1;
    });

    destActy.sort(function(a, b) {
        var a1 = a.actyCd,
            b1 = b.actyCd;
        if (a1 == b1) return 0;
        return a1 > b1 ? 1 : -1;
    });

    consolActy.sort(function(a, b) {
        var a1 = a.actyCd,
            b1 = b.actyCd;
        if (a1 == b1) return 0;
        return a1 > b1 ? 1 : -1;
    });

    ppActy.sort(function(a, b) {
        var a1 = a.actyCd,
            b1 = b.actyCd;
        if (a1 == b1) return 0;
        return a1 > b1 ? 1 : -1;
    });

    sortActy.sort(function(a, b) {
        var a1 = a.actyCd,
            b1 = b.actyCd;
        if (a1 == b1) return 0;
        return a1 > b1 ? 1 : -1;
    });

    // Filter all sort type activities to sort activities & transit activities.
    var sortActyNoTransit = $.grep(sortActy, function(obj) {
        return obj["isInTransit"] === false;
    });

    var inTransitActy = $.grep(sortActy, function(obj) {
        return obj["isInTransit"] === true;
    });

    html = ActivityUtils.getActivityHTMLContent(code, id, customActy, origActy, destActy, consolActy, ppActy, sortActyNoTransit, inTransitActy, divId);
    return html;
};
/**
 * 
 * @param code
 * @param id
 * @param customActy
 * @param origActy
 * @param destActy
 * @param consolActy
 * @param ppActy
 * @param sortActyNoTransit
 * @param inTransitActy
 * @param divId
 * @returns {String}
 */
ActivityUtils.getActivityHTMLContent = function(code, id, customActy, origActy, destActy, consolActy, ppActy, sortActyNoTransit, inTransitActy, divId) {
    var isPrimaryActivity = false;
    var isPreviousActivity = false;
    var isNextActivity = false;
    var isNotLaneLevel = false;
    if (divId.indexOf("PrimaryActivity") >= 0) {
        isPrimaryActivity = true;
        if ($('input[name=networkSearchQueryType]:radio:checked').val() === "F") {
            isNotLaneLevel = true;
        }
    } else if (divId.indexOf("PreviousActivity") >= 0) {
        isPreviousActivity = true;
    }
    var activityOptions = "";

    if (isPreviousActivity == true) {
        if (origActy.length > 0) activityOptions = ActivityUtils.appendActivitesOptions(code, id, activityOptions, origActy, "Origin Activities", true);
        if (destActy.length > 0) activityOptions = ActivityUtils.appendActivitesOptions(code, id, activityOptions, destActy, "Destination Activities", true);
    }
    if (sortActyNoTransit.length > 0 || consolActy.length > 0 || customActy.length > 0 || inTransitActy.length > 0) {
        if (!isNotLaneLevel) {
            activityOptions = ActivityUtils.appendActivitesOptions(code, id, activityOptions, sortActyNoTransit, "Sorts", false, true);
        }
        activityOptions = ActivityUtils.appendActivitesOptions(code, id, activityOptions, consolActy, "Consolidations", false, true);
        if (!isNotLaneLevel) {
            activityOptions = ActivityUtils.appendActivitesOptions(code, id, activityOptions, inTransitActy, "In-Transits", false, true);
            activityOptions = ActivityUtils.appendActivitesOptions(code, id, activityOptions, customActy, "Customs", false, true);
        }
    }

    delete isPrimaryActivity, isPreviousActivity, isNextActivity, isNotLaneLevel;
    return activityOptions;
};
/**
 * 
 * @param code
 * @param id
 * @param activityOptions
 * @param tempActyArry
 * @param optGroupLabel
 * @param noOptGroup
 * @param isDayAct
 * @returns activityOptions
 */
ActivityUtils.appendActivitesOptions = function(code, id, activityOptions, tempActyArry, optGroupLabel, noOptGroup, isDayAct) {

    if (tempActyArry.length > 0) {
        activityOptions += '<table>';
        activityOptions += '<th>' + optGroupLabel + '</th>';
        if (optGroupLabel == "Origin Activities") {
            activityOptions += '<tr><td>' + "Open (L)" + '</td><td>' + "Avail (L)" + "</td>";
            activityOptions += '<td>' + "Operating Days" + '</td><td>' + "Code" + "</td>";
            activityOptions += '<td>' + "Blackout Weeks" + '</td><td>' + "Products" + "</td></tr>";

            for (var i = 0, length = tempActyArry.length; i < length; ++i) {
                activityOptions += '<tr>';
                activityOptions += '<td>' + tempActyArry[i]["openWinL"] + '</td><td>' + tempActyArry[i]["availTimeL"] + '</td>';
                activityOptions += '<td>' + tempActyArry[i]["keyEffDaysL"] + '</td><td>' + tempActyArry[i]["locCd"] + '</td>';
                activityOptions += '</tr>';
            }
        } else if (optGroupLabel == "Destination activities") {
            activityOptions += '<tr><td>' + "Open (L)" + '</td><td>' + "Due (L)" + "</td>";
            activityOptions += '<td>' + "Operating Days" + '</td><td>' + "Code" + "</td>";
            activityOptions += '<td>' + "Products" + '</td></tr>';

            for (var i = 0, length = tempActyArry.length; i < length; ++i) {
                activityOptions += '<tr>';
                activityOptions += '<td>' + tempActyArry[i]["openWinL"] + '</td><td>' + tempActyArry[i]["dueTimeL"] + '</td>';
                activityOptions += '<td>' + tempActyArry[i]["keyEffDaysL"] + '</td><td>' + tempActyArry[i]["locCd"] + '</td>';
                activityOptions += '</tr>';
            }
        } else if (optGroupLabel == "Consolidations") {
            activityOptions += '<tr><td>' + "Open (L)" + '</td><td>' + "Due (L)" + '</td><td>' + "Avail (L)" + "</td>";
            activityOptions += '<td>' + "Operating Days" + '</td><td>' + "Code" + "</td>";
            activityOptions += '<td>' + "Products" + '</td></tr>';
            for (var i = 0, length = tempActyArry.length; i < length; ++i) {
                activityOptions += '<tr>';
                activityOptions += '<td>' + tempActyArry[i]["openWinL"] + '</td><td>' + tempActyArry[i]["dueTimeL"] + '</td><td>' + tempActyArry[i]["availTimeL"] + '</td>';
                activityOptions += '<td>' + tempActyArry[i]["keyEffDaysL"] + '</td><td>' + tempActyArry[i]["locCd"] + '</td>';
                activityOptions += '</tr>';
            }
        } else {
            activityOptions += '<tr><td>' + "Open (L)" + '</td><td>' + "Avail (L)" + "</td>";
            activityOptions += '<td>' + "Operating Days" + '</td><td>' + "Code" + "</td></tr>";

            for (var i = 0, length = tempActyArry.length; i < length; ++i) {
                activityOptions += '<tr>';
                activityOptions += '<td>' + tempActyArry[i]["openWinL"] + '</td><td>' + tempActyArry[i]["availTimeL"] + '</td>';
                activityOptions += '<td>' + tempActyArry[i]["keyEffDaysL"] + '</td><td>' + tempActyArry[i]["locCd"] + '</td>';
                activityOptions += '</tr>';
            }
        }
        activityOptions += '</table>';
        delete dayActyArr;
        return activityOptions;
    }
    return activityOptions;
};

/**
 * 
 * @param length
 * @param chars
 * @returns {String}
 */

function randomString(length, chars) {
    if (length == undefined) {
        length = 32;
    }
    if (chars == undefined) {
        chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}

/**
 * 
 * @param timeStr in hhmm format
 */

function getTimeInMins(timeStr) {
    if (timeStr != undefined && timeStr != "" && timeStr.length == 4) {
        return parseInt(timeStr.slice(0, 2)) * 60 + parseInt(timeStr.slice(2, 4));
    } else {
        return 0;
    }
}
/**
 * 
 * @param timeStr in hhmm format
 */

function toSeconds(timeStr) {
    if (timeStr != undefined && timeStr != "" && timeStr.length == 4) {
        // Extract hours and minutes
        return parseInt(timeStr.slice(0, 2)) * 3600 + // an hour has 3600 seconds
        + parseInt(timeStr.slice(2, 4)) * 60; // a minute has 60 seconds
    } else {
        return 0;
    }
}

function isNull(data){
	if(data != undefined && data != EMPTY_STRING){
		return false;
	}
	return true;
}