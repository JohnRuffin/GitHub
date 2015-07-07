/**
 * 
 */

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
                activityOptions += '<td>' + tempActyArry[i]["keyEffDaysL"] + '</td><td>' + tempActyArry[i]["actyCd"] + '</td>';
                activityOptions += '</tr>';
            }
        } else if (optGroupLabel == "Destination activities") {
            activityOptions += '<tr><td>' + "Open (L)" + '</td><td>' + "Due (L)" + "</td>";
            activityOptions += '<td>' + "Operating Days" + '</td><td>' + "Code" + "</td>";
            activityOptions += '<td>' + "Products" + '</td></tr>';

            for (var i = 0, length = tempActyArry.length; i < length; ++i) {
                activityOptions += '<tr>';
                activityOptions += '<td>' + tempActyArry[i]["openWinL"] + '</td><td>' + tempActyArry[i]["dueTimeL"] + '</td>';
                activityOptions += '<td>' + tempActyArry[i]["keyEffDaysL"] + '</td><td>' + tempActyArry[i]["actyCd"] + '</td>';
                activityOptions += '</tr>';
            }
        } else if (optGroupLabel == "Consolidations") {
            activityOptions += '<tr><td>' + "Open (L)" + '</td><td>' + "Due (L)" + '</td><td>' + "Avail (L)" + "</td>";
            activityOptions += '<td>' + "Operating Days" + '</td><td>' + "Code" + "</td>";
            activityOptions += '<td>' + "Products" + '</td></tr>';
            for (var i = 0, length = tempActyArry.length; i < length; ++i) {
                activityOptions += '<tr>';
                activityOptions += '<td>' + tempActyArry[i]["openWinL"] + '</td><td>' + tempActyArry[i]["dueTimeL"] + '</td><td>' + tempActyArry[i]["availTimeL"] + '</td>';
                activityOptions += '<td>' + tempActyArry[i]["keyEffDaysL"] + '</td><td>' + tempActyArry[i]["actyCd"] + '</td>';
                activityOptions += '</tr>';
            }
        } else {
            activityOptions += '<tr><td>' + "Open (L)" + '</td><td>' + "Avail (L)" + "</td>";
            activityOptions += '<td>' + "Operating Days" + '</td><td>' + "Code" + "</td></tr>";

            for (var i = 0, length = tempActyArry.length; i < length; ++i) {
                activityOptions += '<tr>';
                activityOptions += '<td>' + tempActyArry[i]["openWinL"] + '</td><td>' + tempActyArry[i]["availTimeL"] + '</td>';
                activityOptions += '<td>' + tempActyArry[i]["keyEffDaysL"] + '</td><td>' + tempActyArry[i]["actyCd"] + '</td>';
                activityOptions += '</tr>';
            }
        }
        activityOptions += '</table>';
        delete dayActyArr;
        return activityOptions;
    }
    return activityOptions;
};