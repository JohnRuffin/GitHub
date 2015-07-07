/**
 * Is an utility component.
 * @author 888600
 */

/**
 * Methods which create multiselect component
 * @param divId
 * @param component name
 * @param component type
 * @param selected text divId
 * @param dataSource
 * @param placeholder
 * @param searchAttributes
 * @returns {AdvancedMultiSelectComponent}
 */

function AdvancedMultiSelectComponent(divId, componentName, type, selectedTextDivId, placeholder, filterByLocCd, filterByDays, closeCallBack) {
    this.divId = divId;
    this.componentName = componentName;
    this.type = type;
    this.selectedTextDivId = selectedTextDivId;
    this.placeholder = placeholder;
    this.filterByLocCd = filterByLocCd;
    this.filterByDays = filterByDays;
    this.closeCallBack = closeCallBack;
    this.attributeConfig = this.getSearchAttributes(type);
    this.initialize(type);
}

/**
 * Methods to intialize the component
 * @param type
 */
AdvancedMultiSelectComponent.prototype.initialize = function(type) {
    this.createWidget();
    AdvancedMultiSelectComponent.refreshDatasource(this.divId, this.type);
};

/**
 * Methods to create the widget
 */
AdvancedMultiSelectComponent.prototype.createWidget = function() {
    var AdvancedMultiSelectComponentComponent = this;
    var jQueryObject = $("#" + this.divId);
    var selectedDecObject = $("#" + this.selectedTextDivId);
    if (jQueryObject != undefined && jQueryObject.length > 0) {
        //returns the advanced multiselect component
    	this.bindPopupDialog(this.selectedTextDivId,jQueryObject);
    	jQueryObject.multiselect({
            noneSelectedText: this.componentName,
            attributeConfig: this.attributeConfig,
            close: function(event, ui) {
                var checkedObj = jQueryObject.multiselect("getChecked");
                var checkedDesc = "";
                var isActivity = this.id.indexOf("Activity") > 0 ? true : false;
                if (isActivity) {
                    checkedDesc = AdvancedMultiSelectComponent.getActivityDescriptionText(jQueryObject, checkedObj, this.options, false);
                } else {
                    checkedDesc = AdvancedMultiSelectComponent.getDescriptionText(checkedObj, this, false);
                }

                selectedDecObject.html(checkedDesc);
                selectedDecObject.attr("title", checkedDesc);
                

                if (selectedDecObject[0].id == 'scheduleflylegtypeFilterTextDiv' || selectedDecObject[0].id == 'scheduletrucklegtypeFilterTextDiv' 
                	|| selectedDecObject[0].id == 'scheduleflyEqptypeFilterTextDiv1' || selectedDecObject[0].id == 'scheduletruckEqptypeFilterTextDiv1'
                		|| selectedDecObject[0].id == 'flylegtypeFilterTextDiv' || selectedDecObject[0].id == 'trucklegtypeFilterTextDiv'
                			|| selectedDecObject[0].id == 'flyEqptypeFilterTextDiv' || selectedDecObject[0].id == 'truckEqptypeFilterTextDiv') {
					applyDisplaySettings();
				}
                
                if (AdvancedMultiSelectComponentComponent.type == 'regions') {
                    AdvancedAutoComplete.closeRegionHandler(AdvancedMultiSelectComponentComponent.divId);
                }
                if (AdvancedMultiSelectComponentComponent.closeCallBack != undefined) {
                	AdvancedMultiSelectComponentComponent.closeCallBack();
                }
            },
            open: function () {
            	// jQueryObject.multiselectfilter('widget').find('input').focus();
            	jQueryObject.multiselectfilter('widget').find('input').blur(function() {
            		this.focus();
        		});
        	}
        }).multiselectfilter({
            width: "180",
            label: "",
            placeholder: this.placeholder
        });
    }
};

/**
 * Methods to create popup dialogue
 * @param selectedTextDivId
 * @param jQueryObject
 */
AdvancedMultiSelectComponent.prototype.bindPopupDialog= function(selectedTextDivId,jQueryObject) {
	var header = AdvancedMultiSelectComponent.getTitle(this.type);
	
	$("#"+selectedTextDivId).on('mousemove', function(e){
		if($( "#"+selectedTextDivId).html().indexOf("...") < 0 ){
			$("#"+selectedTextDivId).css('cursor', 'default');
		}
		else{
			$("#"+selectedTextDivId).css('cursor', 'pointer');
		}
	});

	$( "#"+selectedTextDivId).click(function() {
		if($( "#"+selectedTextDivId).html().indexOf("...") < 0 ){
			e.preventDefault();
		}
		else{
			$("#dialog4Div").empty();
			var checkedObj = jQueryObject.multiselect("getChecked");
	        var checkedDesc = "";
	        var isActivity = this.id.indexOf("Activity") > 0 ? true : false;
	        if (isActivity) {
	        	checkedDesc = AdvancedMultiSelectComponent.getActivityDescriptionText(jQueryObject, checkedObj, jQueryObject.multiselect().find('option'), true);
		    } else {
		        checkedDesc = AdvancedMultiSelectComponent.getDescriptionText(checkedObj, jQueryObject.multiselect()[0], true);
		    }
	
			$("#dialog4Div").append(checkedDesc);
			SQW.openDialog("dialog", "dialog4",{width: 369, 
												height: 169,
												title: header,
												position: this.id, 
												draggable: true, 
												resizable: false});
			AdvancedDialog.setPropertyValue("dialog", "title", header);
		}
	});
};

/**
 * Methods to refresh the datsource
 * @param divId
 * @param type
 * @param filterByLocCd
 * @param filterByDays
 * @param facilityType
 * @param activityType
 */
AdvancedMultiSelectComponent.refreshDatasource = function(divId, type, filterByLocCd, filterByDays, facilityType, activityType) {
	LoggerUtils.console("refreshDatasource for component Id ["+divId+"]  & filter type: ["+type+"]");
    var jQueryObject = $("#" + divId);
    var datasource = AdvancedMultiSelectComponent.getDatasource(type);
    if (jQueryObject != undefined) {
        jQueryObject.next().next().html("");
    }
    var html = '';
    if (datasource && datasource.length > 0) {
        var searchAttributes = this.prototype.getSearchAttributes(type);
        var id = searchAttributes[0];
        var code = searchAttributes[1];
        var value = searchAttributes[2];

        if (type == "activity") {
        	var activityArray;
        	if (facilityType == "location") {
                activityArray = AdvancedMultiSelectComponent.searchActivitiesByLocAndDays(datasource, filterByLocCd, filterByDays);
            } else {
            	activityArray = AdvancedMultiSelectComponent.searchActivitiesByFacilityTypeAndDays(datasource, filterByLocCd, filterByDays, facilityType);
            }
            if (activityType) {
            	activityArray = AdvancedMultiSelectComponent.filterActivityTypes(activityArray, activityType);
            }
            html = AdvancedMultiSelectComponent.getActivityHTMLOptions(divId, activityArray, code, id);
        } else if (type == "product") {
            html = AdvancedMultiSelectComponent.getProductHTMLOptions(divId, datasource, code, id, value);

        } else if (type == "regions") {
            html = AdvancedMultiSelectComponent.getGlobalRegionOptions(divId, datasource, code, id, value);

        } else {
            for (var i = 0, length = datasource.length; i < length; ++i) {
                html += '<option value="' + datasource[i][code] + '" id="' + datasource[i][id] + '">' + datasource[i][value] + '</option>';
            }
        }

    }
    jQueryObject.find('option').remove().end().append(html);
    try {
        jQueryObject.multiselect("refresh");
    } catch (error) {
    	// console.log("ERROR:  Multiselect component is not initialized for ["+divId+"]");
    }
    try {
    	jQueryObject.multiselectfilter("updateCache");
    } catch (error) {
    	// console.log("ERROR:  Multiselect component is not initialized for ["+divId+"]");
    }
};

/**
 * Methods to filter activity types
 * @param activityArray
 * @param activityTypeToShow
 * @returns
 */
AdvancedMultiSelectComponent.filterActivityTypes = function(activityArray, activityTypeToShow) {
	var respActivityArray = $.merge([], activityArray);
	if (respActivityArray && activityTypeToShow) {
		for(var i = respActivityArray.length - 1; i >= 0; i--) {
			if(respActivityArray[i].actyType != activityTypeToShow) {
				respActivityArray.splice(i, 1);
			}
		}
	}
	return respActivityArray;
};

/**
 * Methods to select the selected item
 * @param divId
 * @param itemId
 */
AdvancedMultiSelectComponent.setSelectedItem = function(divId, itemId) {
    var jQueryObject = $("#" + divId);

    if (jQueryObject != undefined && jQueryObject.length > 0) {
        jQueryObject.AdvancedMultiSelectComponent("setSelectedUIItem", itemId, AdvancedMultiSelectComponent.getDatasource(jQueryObject.AdvancedMultiSelectComponent('option', 'type')));
    }
};

/**
 * Methods to get the datasource
 * @param type
 * @returns
 */
AdvancedMultiSelectComponent.getDatasource = function(type) {
    switch (type) {
    case 'location':
        return QueryCacheManager.getInstance().getDatasource("ActivityFacilities");
        break;
    case 'activity':
        return QueryCacheManager.getInstance().getDatasource("ActivitiesDetailSQW");
        break;
    case 'product':
        return QueryCacheManager.getInstance().getDatasource("Products");
        break;
    case 'productGroup':
        return QueryCacheManager.getInstance().getDatasource("ProductGroups");
        break;
    case 'legTypesFly':
        return parent.getLegTypeData(isScheduleForNetworkFlag)['F'];
        break;
    case 'legTypesTruck':
        return parent.getLegTypeData(isScheduleForNetworkFlag)['T'];
        break;
    case 'EquipmentTypesFly':
        return parent.getEquipmentTypeData(isScheduleForNetworkFlag)['F'];
        break;
    case 'EquipmentTypesTruck':
        return parent.getEquipmentTypeData(isScheduleForNetworkFlag)['T'];
        break;
    case 'flylegtype':
        return QueryCacheManager.getInstance().getDatasource("FlightLegTypes");
        break;
    case 'trucklegtype':
        return QueryCacheManager.getInstance().getDatasource("TruckLegTypes");
        break;
    case 'flightEquipments':
        return QueryCacheManager.getInstance().getDatasource("FlightEquipmentTypes");
        break;
    case 'truckEquipment':
        return QueryCacheManager.getInstance().getDatasource("TruckEquipmentTypes");
        break;
    case 'regions':
        return QueryCacheManager.getInstance().getDatasource("GlobalRegions");
        break;
    }
};
/**
 * Methods to get the search attributes
 * @param type
 * @returns {Array}
 */
AdvancedMultiSelectComponent.prototype.getSearchAttributes = function(type) {
/*var id = searchAttributes[0];
    var code = searchAttributes[1];
    var value = searchAttributes[2];*/
    switch (type) {
    case 'location':
        return ["locCd", "locCd", "city"];
        break;
    case 'activity':
        return ["actyId", "actyCd", "availWinL", "OpenWinL", "DueTimeL", "EffDaysL", "NightOrDay"];
        break;
    case 'product':
        return ["prodOffset", "productName", "productDesc"];
        break;
    case 'productGroup':
        return ["prodMaskId", "prodGrpName", "prodGrpDesc"];
        break;
    case 'legTypesFly':
    case 'legTypesTruck':
    case 'flylegtype':
    case 'trucklegtype':
        return ["legTypeCd", "legTypeCd", "legTypeDesc"];
        break;
    case 'EquipmentTypesFly':
    case 'EquipmentTypesTruck':
    case 'flightEquipments':
    case 'truckEquipment':
        return ["eqType", "eqType", "eqTypeDesc", "eqGrpCd", "eqTypeDesc", "conveyanceDesc"];
        break;
    case 'regions':
        return ["zoneDesc", "zoneDesc", "zoneDesc"];
        break;
    }
};

/**
 * Methods to get the title
 * @param type
 * @returns {String}
 */
AdvancedMultiSelectComponent.getTitle = function(type) {
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
 * Methods to get the selected item
 * @returns
 */
AdvancedMultiSelectComponent.prototype.getSelectedItems = function() {
    var jQueryObject = $("#" + this.divId);
    var checkedIds = jQueryObject.multiselect("getChecked");
    var selectedIdArr = [];
    if (checkedIds != null) {
        for (var i = 0; i < checkedIds.length; i++) {
            var selectedId = (checkedIds[i].id).replace('ui-multiselect-', '');
            selectedIdArr.push(selectedId);
        }
        return selectedIdArr.toString();
    }
    return "";
};

/**
 * Methods to get the selected item
 * @returns
 */
AdvancedMultiSelectComponent.getSelectedItems = function(divId) {
    var jQueryObject = $("#" + divId);
    if (jQueryObject != undefined && jQueryObject.length > 0) {
        var checkedIds = jQueryObject.multiselect("getChecked");
        var isActivity = divId.indexOf("Activity") > 0 ? true : false;
        var selectedIdArr = [];
        if (checkedIds != null && checkedIds.length > 0) {
            if (isActivity) {
                for (var i = 0; i < checkedIds.length; i++) {
                    var selectedId = checkedIds[i].value;
                    selectedIdArr.push(selectedId);
                }
            } else {
                for (var i = 0; i < checkedIds.length; i++) {
                    var selectedId = (checkedIds[i].id).replace('ui-multiselect-', '');
                    selectedIdArr.push(selectedId);
                }
            }
            return selectedIdArr.toString();
        } else if (checkedIds == undefined || checkedIds.length <= 0) {
            return AdvancedMultiSelectComponent.getActivityDescriptionText(jQueryObject, checkedIds);
        }
    }
    return "";
};

/**
 * Methods to perform to clear the data
 * @param divId
 * @param selectedTextDivId
 */
AdvancedMultiSelectComponent.clearData = function(divId, selectedTextDivId) {
    var jQueryObject = $("#" + divId);
    var selectedDecObject = $("#" + selectedTextDivId);
    if (jQueryObject != undefined && jQueryObject.length > 0) {
        jQueryObject.multiselectfilter('widget').find('input').val("");
        jQueryObject.find('option').remove();
        jQueryObject.multiselect("refresh");

    }
    if (selectedDecObject != undefined && selectedDecObject.length > 0) {
        selectedDecObject.empty();
    }

};

/**
 * Methods to clear all selection data in widgets
 * @param divId
 * @param selectedTextDivId
 */

AdvancedMultiSelectComponent.clearAllSelections = function(divId, selectedTextDivId) {
    var jQueryObject = $("#" + divId);
    var selectedDecObject = $("#" + selectedTextDivId);
    if (jQueryObject != undefined && jQueryObject.length > 0) {
        jQueryObject.multiselectfilter('widget').find('input').val("");
        jQueryObject.multiselect("widget").find(":checkbox").each(function() {
            if(this.checked){
            	this.click();
            };
        });
        jQueryObject.multiselect("refresh");
    }
    if (selectedDecObject != undefined && selectedDecObject.length > 0) {
        selectedDecObject.empty();
    }

};
/**
 * Methods to reset the data
 * @param divId
 * @param selectedTextDivId
 * @param type
 * @param filterByLocCd
 * @param filterByDays
 * @param facilityType
 */
AdvancedMultiSelectComponent.reset = function(divId, selectedTextDivId, type, filterByLocCd, filterByDays, facilityType) {
    var jQueryObject = $("#" + divId);
    var selectedDecObject = $("#" + selectedTextDivId);
    if (jQueryObject != undefined && jQueryObject.length > 0) {
        AdvancedMultiSelectComponent.refreshDatasource(divId, type, filterByLocCd, filterByDays, facilityType);
    }
    if (selectedDecObject != undefined && selectedDecObject.length > 0) {
        selectedDecObject.empty();
    }
};

/**
 * Methods to destroy the object
 * @param divId
 */
AdvancedMultiSelectComponent.destroy = function(divId) {
    var jQueryObject = $("#" + divId);
    jQueryObject.multiselect("destroy");
};

/**
 * Methods to set selected items
 * @param selectedIDs
 */
AdvancedMultiSelectComponent.prototype.setSelectedItems = function(selectedIDs) {
    var jQueryObject = $("#" + this.divId);
    var selectedIDs = ["13"];
    jQueryObject.multiselect("widget").find(":checkbox").each(function() {
        var selectedId = (this.id).replace('ui-multiselect-', '');
        index = jQuery.inArray(selectedId, selectedIDs);
        if (index != -1) {
            this.click();
        }
    });
};

/**
 * Methods to set selected items
 * @param selectedIDs
 */
AdvancedMultiSelectComponent.setSelectedItems = function(divId, selectedIDs, labelTextId) {
    var jQueryObject = $("#" + divId);
    var isActivity = divId.indexOf("Activity") > 0 ? true : false;
    if (isActivity) {
        jQueryObject.multiselect("widget").find(":checkbox").each(function() {
            index = jQuery.inArray(this.value, selectedIDs);
            if (index != -1) {
                this.click();
            }
        });
    } else {
        jQueryObject.multiselect("widget").find(":checkbox").each(function() {
            var selectedId = (this.id).replace('ui-multiselect-', '');
            index = jQuery.inArray(selectedId, selectedIDs);
            if (index != -1) {
                this.click();
            }
        });
    }
    if (labelTextId != undefined && labelTextId != EMPTY_STRING) {
        var checkedObj = jQueryObject.multiselect("getChecked");
        var selectedDecObject = $("#" + labelTextId);
        var checkedDesc = "";
        var isActivity = false;
        if (jQueryObject.attr("id") != undefined && jQueryObject.attr("id") != EMPTY_STRING) {
            isActivity = jQueryObject.attr("id").indexOf("Activity") > 0 ? true : false;
        }
        if (isActivity) {
            if (selectedIDs != undefined && selectedIDs.length > 0 && selectedIDs[0].indexOf('%') >= 0) {
                jQueryObject.multiselectfilter('widget').find('input').val(selectedIDs[0]);
            }
            checkedDesc = AdvancedMultiSelectComponent.getActivityDescriptionText(jQueryObject, checkedObj, jQueryObject.multiselect().find('option'));
        } else {
            checkedDesc = AdvancedMultiSelectComponent.getDescriptionText(checkedObj, jQueryObject.multiselect()[0]);
        }
        selectedDecObject.html(checkedDesc);
    }

    jQueryObject.multiselect("close");
};

/**
 * Methods to search activity based on location and days
 * @param datasource
 * @param filterByLocCd
 * @param filterByDays
 * @returns
 */
AdvancedMultiSelectComponent.searchActivitiesByLocAndDays = function(datasource, filterByLocCd, filterByDays) {
    if (datasource != null && datasource.length > 0) {
        if (filterByLocCd != undefined && filterByLocCd != "") {
            var locIndex = datasource[0].indexOf(filterByLocCd);
            var actObj = {};
            //filterByDays = [6];
            if (locIndex >= 0) {
                if (filterByDays != undefined && filterByDays.length > 0) {
                    actObj = AdvancedMultiSelectComponent.searchActivitiesByDays(datasource[1][locIndex].value, filterByDays);
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
 * Methods to search activity based on facility type and days
 * @param datasource
 * @param filterByLocCd
 * @param filterByDays
 * @param facilityType
 * @returns
 */
AdvancedMultiSelectComponent.searchActivitiesByFacilityTypeAndDays = function(datasource, filterByLocCd, filterByDays, facilityType) {
    var activeActiviy = [];
    var actObj = {};
    var locationList;
    var facilityCode;

    if (datasource != null && datasource.length > 0) {
        if (filterByLocCd != undefined && filterByLocCd != "") {
            var locList;
            if (facilityType === "facilityGroup") {
                facilityCode = "facLocCd";
                locationList = QueryCacheManager.getInstance().getDatasource("FacilityGroupLocations");
                // Filter locations based on Facility group name.
                var locKeyList = $.grep(locationList, function(obj) {
                    return obj["key"] === filterByLocCd;
                });
                if (locKeyList != undefined && locKeyList.length > 0) {
                    locList = locKeyList[0].value["location"];
                }

            } else if (facilityType === "country") {
                facilityCode = "locCd";
                locationList = QueryCacheManager.getInstance().getDatasource("Locations");
                // Filter locations based on country code.
                locList = $.grep(locationList, function(obj) {
                    return obj["countryCd"] === filterByLocCd;
                });
            } else {
                facilityCode = "locCd";
                locList = [];
                locationList = QueryCacheManager.getInstance().getDatasource("LocationsWithGlobalRegion");
                var filterByLocCdArr = filterByLocCd.split(",");
                //var activeRegionZone = [];
                for (var i = 0; i < filterByLocCdArr.length; i++) {
                    var regionZoneArr = filterByLocCdArr[i].split("-");
                    // Filter locations based on global region code.
                    if (regionZoneArr != null && regionZoneArr.length > 0) {
                        locRegionList = $.grep(locationList, function(obj) {
                            return obj["globalRegionCd"] === parseInt(regionZoneArr[0]) && obj["zone"] === parseInt(regionZoneArr[1]);
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
            if(filterByDays == undefined){
            	uniqueAct = AdvancedMultiSelectComponent.getUniqueDaysForFacility(activeActiviy);
            }else {
            	uniqueAct = activeActiviy;
            }
            

            if (filterByDays != undefined && filterByDays.length > 0) {
                actObj = AdvancedMultiSelectComponent.searchActivitiesByDays(uniqueAct, filterByDays);
            } else {
                actObj = uniqueAct;
            }


        }
    }
    return AdvancedMultiSelectComponent.getUniqueDaysForFacility(actObj);
};

/**
 * Methods to searchActivities By days
 * @param activityObj
 * @param filterByDays
 * @returns
 */
AdvancedMultiSelectComponent.searchActivitiesByDays = function(activityObj, filterByDays) {
    var filterDaysStr = "";
    var activeActiviy = [];

    filterByDays = AdvancedMultiSelectComponent.getSelectedDays(filterByDays);

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
                return effDaysArr[week - 1]!= undefined ? (effDaysArr[week - 1].trim().charAt(day - 1) != '-') : "";
            });

            activeActiviy = $.merge(activeActiviy, actObj);
        }

        var uniqueAct = AdvancedMultiSelectComponent.getUniqueDays(activeActiviy);

        return uniqueAct;
    }
};
/**
 * Methods to filter by days
 * @param filterByDays
 * @returns {Array}
 */
AdvancedMultiSelectComponent.getUniqueDays = function(filterByDays) {
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
AdvancedMultiSelectComponent.getUniqueDaysForFacility = function(filterByDays) {
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
AdvancedMultiSelectComponent.getSelectedDays = function(filterByDays) {
    var daysArr = [];
    var allDays = filterByDays.split(",");
    for (var i = 0; i < allDays.length; i++) {
        var day = allDays[i];
        if (day.indexOf("-") >= 0) {
            var dayRange = day.split("-");
            AdvancedMultiSelectComponent.getSelectedDaysByRange(daysArr, parseInt(dayRange[0]), parseInt(dayRange[1]));
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
AdvancedMultiSelectComponent.getSelectedDaysByRange = function(daysArr, stIndex, enIndex) {

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
AdvancedMultiSelectComponent.getDescriptionText = function(checkedObj, allOptions, isFullTextRequired) {
    var desc = "";
    if (checkedObj.length > 0) {
        for (var i = 0; i < checkedObj.length; i++) {
            for (var j = 0; j < allOptions.length; j++) {
                if (checkedObj[i].value == allOptions[j].value) {
                	if(isFullTextRequired)
                		desc += allOptions[j].innerHTML + "<br>";
                	else
                		desc += allOptions[j].innerHTML + (i == 2 ? "..." : ", ");
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
 * Methods to get the description text
 * @param jQueryObject
 * @param checkedObj
 * @param allOptions
 * @param isFullTextRequired
 * @returns
 */
AdvancedMultiSelectComponent.getActivityDescriptionText = function(jQueryObject, checkedObj, allOptions, isFullTextRequired) {
    var desc = "";
    var inputBox = jQueryObject.multiselectfilter('widget').find('input')[0];
    if (checkedObj.length > 0) {
        for (var i = 0; i < checkedObj.length; i++) {
            var selectedId = (checkedObj[i].id).replace('ui-multiselect-', '');
            for (var j = 0; j < allOptions.length; j++) {
                if (selectedId == allOptions[j].id) {
                	var optionObj = jQuery.parseJSON(allOptions[j].innerHTML);
                	if(isFullTextRequired){
                		desc += optionObj.actyCd + "<br>";
                	}
                	else{
                		desc += optionObj.actyCd + (i == 2 ? "..." : ",");
                	}
                }
            }
            if (!isFullTextRequired && i == 2) {
                return desc += "...";
            }
        }
    } else if (inputBox != null && inputBox.value.indexOf('%') >= 0) {
        return inputBox.value;
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
AdvancedMultiSelectComponent.getActivityHTMLOptions = function(divId, activityArray, code, id) {
    var html = "";
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

    html = AdvancedMultiSelectComponent.getActivityHTMLContent(code, id, customActy, origActy, destActy, consolActy, ppActy, sortActyNoTransit, inTransitActy, divId);
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
AdvancedMultiSelectComponent.getActivityHTMLContent = function(code, id, customActy, origActy, destActy, consolActy, ppActy, sortActyNoTransit, inTransitActy, divId) {
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
    var activityOptions = "";

    if (isPreviousActivity == true || isPrimaryActivity == true) {
        if (origActy.length > 0) {
            activityOptions += '<optgroupparent label = "Origin Activities (Click to select all origin activities)">';
            activityOptions = this.appendActivitesOptions(code, id, activityOptions, origActy, "", true);
            activityOptions += '</optgroupparent>';
        }
    } else if (isNextActivity == true) {
        if (destActy.length > 0) {
            activityOptions += '<optgroupparent label = "Destination Activities (Click to select all destination activities)">';
            activityOptions = this.appendActivitesOptions(code, id, activityOptions, destActy, "", true);
            activityOptions += '</optgroupparent>';
        }
    }
    if (sortActyNoTransit.length > 0 || consolActy.length > 0 || customActy.length > 0 || inTransitActy.length > 0) {
        activityOptions += '<optgroupparent label = "Day Activities (Click to select all day activities)">';
        if (!isNotLaneLevel) {
            activityOptions = this.appendActivitesOptions(code, id, activityOptions, sortActyNoTransit, "Day Sorts(Click to select all day sorts)", false, true);
        }
        activityOptions = this.appendActivitesOptions(code, id, activityOptions, consolActy, "Day Consolidations(Click to select all day consolidation)", false, true);
        if (!isNotLaneLevel) {
            activityOptions = this.appendActivitesOptions(code, id, activityOptions, customActy, "Day Customs(Click to select all day custom)", false, true);
            activityOptions = this.appendActivitesOptions(code, id, activityOptions, inTransitActy, "Day In-Transits(Click to select all day transits)", false, true);
        }
        activityOptions += '</optgroupparent>';
    }
    if (destActy.length > 0) {
        if (isPrimaryActivity == true) {
            activityOptions += '<optgroupparent label = "Destination Activities (Click to select all destination activities)">';
            activityOptions = this.appendActivitesOptions(code, id, activityOptions, destActy, "", true);
            activityOptions += '</optgroupparent>';
        }
    }
    if (sortActyNoTransit.length > 0 || consolActy.length > 0 || customActy.length > 0 || inTransitActy.length > 0) {
        activityOptions += '<optgroupparent label = "Night Activities (Click to select all night activities)">';
        if (!isNotLaneLevel) {
            activityOptions = this.appendActivitesOptions(code, id, activityOptions, sortActyNoTransit, "Night Sorts(Click to select all night sorts)", false, false);
        }
        activityOptions = this.appendActivitesOptions(code, id, activityOptions, consolActy, "Night Consolidations(Click to select all night consolidation)", false, false);
        if (!isNotLaneLevel) {
            activityOptions = this.appendActivitesOptions(code, id, activityOptions, customActy, "Night Customs(Click to select all night custom)", false, false);
            activityOptions = this.appendActivitesOptions(code, id, activityOptions, inTransitActy, "Night In-Transits(Click to select all night transits)", false, false);
        }
        activityOptions += '</optgroupparent>';
    }
    delete isPrimaryActivity, isPreviousActivity, isNextActivity, isNotLaneLevel;
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
AdvancedMultiSelectComponent.appendActivitesOptions = function(code, id, activityOptions, tempActyArry, optGroupLabel, noOptGroup, isDayAct) {
    if (tempActyArry.length > 0) {
        //		if(!noOptGroup){
        activityOptions += '<optgroup label="' + optGroupLabel + '">';
        //		}	
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
            activityOptions += '<option value="' + tempActyArry[i][code] + '" id="' + tempActyArry[i][id] + '">' + JSON.stringify(tempActyArry[i]) + '</option>';
        }
        //		if(!noOptGroup){
        activityOptions += '</optgroup>';
        //		}
        delete dayActyArr;
        return activityOptions;
    }
    return activityOptions;
};
/**
 * Method to get the Product HTM option
 */
AdvancedMultiSelectComponent.getProductHTMLOptions = function(divId, prodArray, code, id, value) {
    var prodOptions = "";

    // Filter all sort type activities to sort activities & transit activities.

    var usProdArr = $.grep(prodArray, function(obj) {
        return (obj["productDesc"].indexOf("US") >= 0 || obj["productDesc"].indexOf("U.S") >= 0);
    });

    var intProdArr = $.grep(prodArray, function(obj) {
        return obj["productDesc"].indexOf("INTL") >= 0;
    });

    var intraCountryProdArr = $.grep(prodArray, function(obj) {
        return obj["productDesc"].indexOf("Intra-Country") >= 0;
    });

    var intraRegionProdArr = $.grep(prodArray, function(obj) {
        return obj["productDesc"].indexOf("Intra-Regional") >= 0;
    });

/*usProdArr.sort(function(a, b){
	    var a1= a.actyCd, b1= b.productName;
	    if(a1== b1) return 0;
	    return a1> b1? 1: -1;
	});
	
	intProdArr.sort(function(a, b){
	    var a1= a.actyCd, b1= b.productName;
	    if(a1== b1) return 0;
	    return a1> b1? 1: -1;
	});
	
	intraCountryProdArr.sort(function(a, b){
	    var a1= a.actyCd, b1= b.productName;
	    if(a1== b1) return 0;
	    return a1> b1? 1: -1;
	});
	
	intraRegionProdArr.sort(function(a, b){
	    var a1= a.actyCd, b1= b.productName;
	    if(a1== b1) return 0;
	    return a1> b1? 1: -1;
	});*/

    prodOptions += '<optgroup label="<b>US Products(Click to select all US products)</b>">';
    for (var i = 0, length = usProdArr.length; i < length; ++i) {
        prodOptions += '<option value="' + usProdArr[i][code] + '" id="' + usProdArr[i][id] + '">' + usProdArr[i][value] + '</option>';
    }
    prodOptions += '</optgroup>';

    prodOptions += '<optgroup label="<b>International Products(Click to select all International products)</b>">';
    for (var i = 0, length = intProdArr.length; i < length; ++i) {
        prodOptions += '<option value="' + intProdArr[i][code] + '" id="' + intProdArr[i][id] + '">' + intProdArr[i][value] + '</option>';
    }
    prodOptions += '</optgroup>';

    prodOptions += '<optgroup label="<b>Intra Country Products(Click to select all Intra Country products)</b>">';
    for (var i = 0, length = intraCountryProdArr.length; i < length; ++i) {
        prodOptions += '<option value="' + intraCountryProdArr[i][code] + '" id="' + intraCountryProdArr[i][id] + '">' + intraCountryProdArr[i][value] + '</option>';
    }
    prodOptions += '</optgroup>';

    prodOptions += '<optgroup label="<b>Intra Regional Products(Click to select all Intra Regional products)</b>">';
    for (var i = 0, length = intraRegionProdArr.length; i < length; ++i) {
        prodOptions += '<option value="' + intraRegionProdArr[i][code] + '" id="' + intraRegionProdArr[i][id] + '">' + intraRegionProdArr[i][value] + '</option>';
    }
    prodOptions += '</optgroup>';

    return prodOptions;
};

/**
 * Methods to get Global region options
 * @param divId
 * @param globalRegions
 * @param code
 * @param id
 * @param value
 * @returns {String}
 */
AdvancedMultiSelectComponent.getGlobalRegionOptions = function(divId, globalRegions, code, id, value) {
    var prodOptions = "";

    if (globalRegions != undefined) {
        var regionItems;
        for (var i = 0; i < globalRegions.length; i++) {
            prodOptions += '<optgroup label="' + globalRegions[i].globalRgnDesc + '">';
            regionItems = globalRegions[i].items;
            for (var j = 0; j < regionItems.length; j++) {
                prodOptions += '<option value="' + regionItems[j][value] + '" id="' + globalRegions[i].globalRgnCd + "-" + regionItems[j].zone + '"> &nbsp; </option>';
            }
            prodOptions += "</optgroup>";
        }
    }
    return prodOptions;
};