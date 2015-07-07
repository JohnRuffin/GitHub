var  AdvancedActivityComponent ={};

AdvancedActivityComponent.getActivitiesData = function(filterByLocCd, filterByDays, facilityType, divId, activityType) {
    var html = '';
    var type = "activity";
    //var divId = "PrimaryActivity";
    //var facilityType = "location";
    var datasource = AdvancedActivityComponent.getDatasource(type);
    var activityArray = [];
    if (datasource && datasource.length > 0) {
        var searchAttributes = AdvancedActivityComponent.getSearchAttributes(type);
        var id = searchAttributes[0];
        var code = searchAttributes[1];
        var value = searchAttributes[2];

        if (type == "activity") {
            if (facilityType == "location") {
                activityArray = AdvancedActivityComponent.searchActivitiesByLocAndDays(datasource, filterByLocCd, filterByDays);
            } else {
                activityArray = AdvancedActivityComponent.searchActivitiesByFacilityTypeAndDays(datasource, filterByLocCd, filterByDays, facilityType);
            }
            if (activityType) {
                activityArray = AdvancedActivityComponent.filterActivityTypes(activityArray, activityType);
            }
            html = AdvancedActivityComponent.getActivityHTMLOptions(divId, activityArray, code, id);
        }
    }
    return html;
};

/**
 * Methods to get the datasource
 * @param type
 * @returns
 */
AdvancedActivityComponent.getDatasource = function(type) {
    switch (type) {
    case 'activity':
        return getDashboardContentWindow(DASHBOARD_ID_QUERY).queryDatasources["ActivitiesDetailSQW"].data();
        break;
    }
};

/**
 * Methods to get the search attributes
 * @param type
 * @returns {Array}
 */
AdvancedActivityComponent.getSearchAttributes = function(type) {

    switch (type) {
    case 'activity':
        return ["actyId", "actyCd", "availWinL", "OpenWinL", "DueTimeL", "EffDaysL", "NightOrDay"];
        break;
    }
};

/**
 * Methods to search activity based on location and days
 * @param datasource
 * @param filterByLocCd
 * @param filterByDays
 * @returns
 */
AdvancedActivityComponent.searchActivitiesByLocAndDays = function(datasource, filterByLocCd, filterByDays) {
    if (datasource != null && datasource.length > 0) {
        if (filterByLocCd != undefined && filterByLocCd != "") {
            var locIndex = datasource[0].indexOf(filterByLocCd);
            var actObj = {};
            //filterByDays = [6];
            if (locIndex >= 0) {
                if (filterByDays != undefined && filterByDays.length > 0) {
                    actObj = AdvancedActivityComponent.searchActivitiesByDays(datasource[1][locIndex].value, filterByDays);
                } else {
                    actObj = datasource[1][locIndex].value;
                }
                return actObj;
            }
        }
    }
    return "";
};

/**
 * Methods to searchActivities By days
 * @param activityObj
 * @param filterByDays
 * @returns
 */
AdvancedActivityComponent.searchActivitiesByDays = function(activityObj, filterByDays) {
    var filterDaysStr = "";
    var activeActiviy = [];

    filterByDays = AdvancedActivityComponent.getSelectedDays(filterByDays);

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
                //console.log("Activity Code ["+obj.actyCd+"] with Effective day string ["+obj["effDaysL"]+"], Week ["+ (week )+"] & Day ["+(day)+"] is ["+effDaysArr[week - 1].trim().charAt(day - 1)+"] ?");
                // return effDaysArr[week - 1].trim().charAt(day - 1) != '-';
                return effDaysArr[week - 1] != undefined ? (effDaysArr[week - 1].trim().charAt(day - 1) != '-') : "";
            });

            activeActiviy = $.merge(activeActiviy, actObj);
        }

        var uniqueAct = AdvancedActivityComponent.getUniqueDays(activeActiviy);

        return uniqueAct;
    }
};


/**
 * Methods to filter activity types
 * @param activityArray
 * @param activityTypeToShow
 * @returns
 */
AdvancedActivityComponent.filterActivityTypes = function(activityArray, activityTypeToShow) {
    var respActivityArray = $.merge([], activityArray);
    if (respActivityArray && activityTypeToShow) {
        for (var i = respActivityArray.length - 1; i >= 0; i--) {
            if (respActivityArray[i].actyType != activityTypeToShow) {
                respActivityArray.splice(i, 1);
            }
        }
    }
    return respActivityArray;
};






/**
 * Methods to get the title
 * @param type
 * @returns {String}
 */
AdvancedActivityComponent.getTitle = function(type) {
    switch (type) {
    case 'location':
        return "Selected Transit";
        break;
    case 'activity':
        return "Selected Activities";
        break;
    case 'product':
        return "Selected Products";
        break;
    case 'productGroup':
        return "Selected Product Groups";
        break;
    case 'legTypesFly':
        return "Selected Leg - Fly";
        break;
    case 'legTypesTruck':
        return "Selected Leg - Truck";;
        break;
    case 'flightEquipments':
        return "Selected Equipments - Fly";
        break;
    case 'truckEquipment':
        return "Selected Equipments - Truck";;
        break;
    case 'EquipmentTypesFly':
        return "Selected Flight Equipments";
        break;
    case 'EquipmentTypesTruck':
        return "Selected Truck Equipments";
        break;
    case 'regions':
        return "Selected Regions";
        break;
    }
};


/**
 * Methods to search activity based on facility type and days
 * @param datasource
 * @param filterByLocCd
 * @param filterByDays
 * @param facilityType
 * @returns
 */
AdvancedActivityComponent.searchActivitiesByFacilityTypeAndDays = function(datasource, filterByLocCd, filterByDays, facilityType,isQueryWin) {
    var activeActiviy = [];
    var actObj = {};
    var locationList;
    var facilityCode;

    if (datasource != null && datasource.length > 0) {
        if (filterByLocCd != undefined && filterByLocCd != "") {
            var locList;
            if (facilityType === "facilityGroup") {
                facilityCode = "facLocCd";
                if(!isQueryWin){
                	locationList = getDashboardContentWindow(DASHBOARD_ID_QUERY).getQueryDatasources()["FacilityGroupLocations"].data();
                }else{
                	locationList = getQueryDatasources()["FacilityGroupLocations"].data();
                }
                // Filter locations based on Facility group name.
                var locKeyList = $.grep(locationList, function(obj) {
                    return obj["key"] === filterByLocCd;
                });
                if (locKeyList != undefined && locKeyList.length > 0) {
                    locList = locKeyList[0].value["location"];
                }

            } else if (facilityType === "country") {
                facilityCode = "locCd";
                if(!isQueryWin){
                	locationList = getDashboardContentWindow(DASHBOARD_ID_QUERY).getQueryDatasources()["Locations"].data();
                }else{
                	locationList = getQueryDatasources()["Locations"].data();
                }
                // Filter locations based on country code.
                locList = $.grep(locationList, function(obj) {
                    return obj["countryCd"] === filterByLocCd;
                });
            } else {
                facilityCode = "locCd";
                locList = [];
                if(!isQueryWin){
                	locationList = getDashboardContentWindow(DASHBOARD_ID_QUERY).getQueryDatasources()["LocationsWithGlobalRegion"].data();
                }else{
                	locationList = getQueryDatasources()["LocationsWithGlobalRegion"].data();
                }	
                var filterByLocCdArr = filterByLocCd.split(",");
                //var activeRegionZone = [];
                for (var i = 0; i < filterByLocCdArr.length; i++) {
                    var regionZoneArr = filterByLocCdArr[i].split("-");
                    // Filter locations based on global region code.
                    if (regionZoneArr != null && regionZoneArr.length > 0) {
                        locRegionList = $.grep(locationList, function(obj) {
                        	if(regionZoneArr[1] != undefined ){
                        		return obj["globalRegionCd"] === parseInt(regionZoneArr[0]) && obj["zone"] === parseInt(regionZoneArr[1]);;
                        	}else{
                        		return obj["globalRegionCd"] === parseInt(regionZoneArr[0]);
                        	}
                        });
                        locList = $.merge(locList, locRegionList);
                    }
                }
            }


            for (var i = 0; i < locList.length; i++) {
                var locObj = locList[i];
                var locIndex = datasource[0].indexOf(locObj[facilityCode]);
                if (locIndex != -1) {
                    var activityArr = datasource[1][locIndex].value;
                    activeActiviy = $.merge(activeActiviy, activityArr);
                }
            }

            var uniqueAct;
            if (filterByDays == undefined) {
                uniqueAct = AdvancedActivityComponent.getUniqueDaysForFacility(activeActiviy);
            } else {
                uniqueAct = activeActiviy;
            }


            if (filterByDays != undefined && filterByDays.length > 0) {
                actObj = AdvancedActivityComponent.searchActivitiesByDays(uniqueAct, filterByDays);
            } else {
                actObj = uniqueAct;
            }


        }
    }
    return AdvancedActivityComponent.getUniqueDaysForFacility(actObj);
};


/**
 * Methods to filter by days
 * @param filterByDays
 * @returns {Array}
 */
AdvancedActivityComponent.getUniqueDays = function(filterByDays) {
    var result = [];
    $.each(filterByDays, function(i, v) {
        if ($.inArray(v, result) == -1) result.push(v);
    });
    return result;
};

/**
 * Methods to filter unique days for facility
 * @param filterByDays
 * @returns {Array}
 */
AdvancedActivityComponent.getUniqueDaysForFacility = function(filterByDays) {
    var dupArr = {};
    var result = [];

    $.each(filterByDays, function(i, el) {

        if (!dupArr[el.actyCd]) {
            dupArr[el.actyCd] = true;
            result.push(el);
        }
    });
    return result;
};
/**
 * Methods to get the selected days
 * @param filterByDays
 * @returns {Array}
 */
AdvancedActivityComponent.getSelectedDays = function(filterByDays) {
    var daysArr = [];
    var allDays = filterByDays.split(",");
    for (var i = 0; i < allDays.length; i++) {
        var day = allDays[i];
        if (day.indexOf("-") >= 0) {
            var dayRange = day.split("-");
            AdvancedActivityComponent.getSelectedDaysByRange(daysArr, parseInt(dayRange[0]), parseInt(dayRange[1]));
        } else {
            daysArr.push(day);
        }
    }
    return daysArr;
};

/**
 * Method to get selected days by range
 * @param daysArr
 * @param stIndex
 * @param enIndex
 */
AdvancedActivityComponent.getSelectedDaysByRange = function(daysArr, stIndex, enIndex) {

    for (var i = stIndex; i <= enIndex; i++) {
        daysArr.push(i);
    }
};

/**
 * Methods to get description text 
 * @param checkedObj
 * @param allOptions
 * @param isFullTextRequired
 * @returns {String}
 */
AdvancedActivityComponent.getDescriptionText = function(checkedObj, allOptions, isFullTextRequired) {
    var desc = "";
    if (checkedObj.length > 0) {
        for (var i = 0; i < checkedObj.length; i++) {
            for (var j = 0; j < allOptions.length; j++) {
                if (checkedObj[i].value == allOptions[j].value) {
                    if (isFullTextRequired) desc += allOptions[j].innerHTML + "<br>";
                    else desc += allOptions[j].innerHTML + (i == 2 ? "..." : ", ");
                }
            }
            if (!isFullTextRequired && i == 2) {
                return desc;
            }
        }
    }
    return desc;
};

/**
 * MEthods to get the Activity HTML option
 * @param divId
 * @param activityArray
 * @param code
 * @param id
 * @returns {String}
 */
AdvancedActivityComponent.getActivityHTMLOptions = function(divId, activityArray, code, id) {
    var html;
    var customActy = [];
    var origActy = [];
    var destActy = [];
    var consolActy = [];
    var ppActy = [];
    var sortActy = [];
    //	console.log("activityArray length"+ activityArray.length);
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

    //html = AdvancedActivityComponent.getActivityHTMLContent(code, id, customActy, origActy, destActy, consolActy, ppActy, sortActyNoTransit, inTransitActy, divId);
    html = AdvancedActivityComponent.getActivityDataProvider(code, id, customActy, origActy, destActy, consolActy, ppActy, sortActyNoTransit, inTransitActy, divId);

    return html;
};

/**
 * Methods to get the Activity HTML content
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
AdvancedActivityComponent.getActivityDataProvider = function(code, id, customActy, origActy, destActy, consolActy, ppActy, sortActyNoTransit, inTransitActy, divId) {
    var isPrimaryActivity = false;
    var isPreviousActivity = false;
    var isNextActivity = false;
    var isNotLaneLevel = false;
    if (divId.indexOf("PrimaryActivity") >= 0) {
        isPrimaryActivity = true;
/*if ($('input[name=networkSearchQueryType]:radio:checked').val() === "F") {
            isNotLaneLevel = true;
        }*/
    } else if (divId.indexOf("PreviousActivity") >= 0) {
        isPreviousActivity = true;
    } else if (divId.indexOf("NextActivity") >= 0) {
        isNextActivity = true;
    }
    var activityOptions = [];

    if (isPreviousActivity == true || isPrimaryActivity == true) {
        if (origActy.length > 0) {
            activityOptions.push({
                locCd: "Origin Activities",
                desc: "Origin Activities",
                children: this.appendActivites(code, id, activityOptions, origActy, "", true)
            });
        }
    } else if (isNextActivity == true) {
        if (destActy.length > 0) {
            activityOptions.push({
                locCd: "Destination Activities",
                desc: "Destination Activities",
                children: this.appendActivites(code, id, activityOptions, destActy, "", true)
            });
        }
    }
    if (sortActyNoTransit.length > 0 || consolActy.length > 0 || customActy.length > 0 || inTransitActy.length > 0) {
        var daySorts;
        var dayCustoms;
        var dayTransits;
        var dayConsolitations;
        var dayActivities = [];
        if (!isNotLaneLevel) {
            daySorts = this.appendActivites(code, id, activityOptions, sortActyNoTransit, "Day Sorts", false, true);
        }
        dayConsolitations = this.appendActivites(code, id, activityOptions, consolActy, "Day Consolidations", false, true);
        if (!isNotLaneLevel) {
            dayCustoms = this.appendActivites(code, id, activityOptions, customActy, "Day Customs", false, true);
            dayTransits = this.appendActivites(code, id, activityOptions, inTransitActy, "Day In-Transits", false, true);
        }
        
        if(daySorts!= undefined && daySorts[0] != undefined){
        	dayActivities.push(daySorts[0]);
        }
        if(dayConsolitations!= undefined && dayConsolitations[0] != undefined){
        	dayActivities.push(dayConsolitations[0]);
        }
        if(dayCustoms!= undefined && dayCustoms[0] != undefined){
        	dayActivities.push(dayCustoms[0]);
        }
        if(dayTransits!= undefined && dayTransits[0] != undefined){
        	dayActivities.push(dayTransits[0]);
        }
        var children = [];
        if(daySorts && daySorts.length > 0) {
        	children.push(daySorts[0]);
        }
        if(dayConsolitations && dayConsolitations.length > 0) {
        	children.push(dayConsolitations[0]);
        }
        if(dayCustoms && dayCustoms.length > 0) {
        	children.push(dayCustoms[0]);
        }
        if(dayTransits && dayTransits.length > 0) {
        	children.push(dayTransits[0]);
        }
        if(children && children.length > 0) {
	        activityOptions.push({
	            locCd: "Day Activities",
	            desc: "Day Activities",
	            children: children
	        });
        }
    }
    if (destActy.length > 0) {
    	var temChild =  this.appendActivites(code, id, activityOptions, destActy, "", true);
        if (isPrimaryActivity == true && temChild && temChild.length > 0) {
            activityOptions.push({
                locCd: "Destination Activities",
                desc: "Destination Activities",
                children: temChild
            });
        }
    }
    if (sortActyNoTransit.length > 0 || consolActy.length > 0 || customActy.length > 0 || inTransitActy.length > 0) {
        var nightSorts;
        var nightConsolidations;
        var nightCustoms;
        var nightTransits;
        var nightActivities = [];
        if (!isNotLaneLevel) {
            nightSorts = this.appendActivites(code, id, activityOptions, sortActyNoTransit, "Night Sorts", false, false);
        }
        nightConsolidations = this.appendActivites(code, id, activityOptions, consolActy, "Night Consolidations", false, false);
        if (!isNotLaneLevel) {
            nightCustoms = this.appendActivites(code, id, activityOptions, customActy, "Night Customs", false, false);
            nightTransits = this.appendActivites(code, id, activityOptions, inTransitActy, "Night In-Transits", false, false);
        }
        
        if(nightSorts!= undefined && nightSorts[0] != undefined){
        	nightActivities.push(nightSorts[0]);
        }
        if(nightConsolidations!= undefined && nightConsolidations[0] != undefined){
        	nightActivities.push(nightConsolidations[0]);
        }
        if(nightCustoms!= undefined && nightCustoms[0] != undefined){
        	nightActivities.push(nightCustoms[0]);
        }
        if(nightTransits!= undefined && nightTransits[0] != undefined){
        	nightActivities.push(nightTransits[0]);
        }
        if(nightActivities && nightActivities.length > 0) {
	        activityOptions.push({
	            locCd: "Night Activities",
	            desc: "Night Activities",
	            children: nightActivities
	        });
        }
    }
    delete isPrimaryActivity, isPreviousActivity, isNextActivity, isNotLaneLevel;
    console.log(activityOptions);
    return activityOptions;
};
/**
 * Methods to append the Activities  options
 * @param code
 * @param id
 * @param activityOptions
 * @param tempActyArry
 * @param optGroupLabel
 * @param noOptGroup
 * @param isDayAct
 * @returns activityOptions
 */
AdvancedActivityComponent.appendActivites = function(code, id, activityOptions, tempActyArry, optGroupLabel, noOptGroup, isDayAct) {
    var parentChildActivities;
    var childActivities;
    if (tempActyArry.length > 0) {
        childActivities = [];
        var dayActyArr = null;
        if (isDayAct != null) {
            dayActyArr = $.grep(tempActyArry, function(obj) {
                return obj["isDayActivity"] === isDayAct;
            });
        }
        if (dayActyArr != undefined && dayActyArr.length >= 0) {
            tempActyArry = dayActyArr;
        }
        for (var i = 0, length = tempActyArry.length; i < length; ++i) {
        	tempActyArry[i]["locCd"] =  tempActyArry[i][code];
        	tempActyArry[i]["desc"] =  tempActyArry[i][code];        	 
            childActivities.push(tempActyArry[i]);
        }
        if (!noOptGroup) {
            parentChildActivities = [];
            if(childActivities.length > 0) {
	            parentChildActivities.push({
	                locCd: optGroupLabel,
	                desc: optGroupLabel,
	                children: childActivities
	            });
            }
            return parentChildActivities;
        }
        delete dayActyArr;
        return childActivities;
    }
    return childActivities;
};
