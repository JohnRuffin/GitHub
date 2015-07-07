/**
 * Is an utility component.
 * @author 888608
 */

/**
 * Is a custom implementation for auto complete component
 */
$.widget("widgets.AdvancedAutoComplete", $.ui.autocomplete, {

    //overriding the create method;
    _create: function() {
        this._super();
        //property that encapsulated the selected item object
        this._selectedUIItem;
        //property that is having the property names of item object on which the search operation need to perform 
        this.searchAttributes;
        //property that is having the property names of the item object from which the label and values patterns are rendered
        this.labelValuePattern;
        //property indicating what type of datasource the component is holding or will hold.
        this.type = "Locations";
    },

/*    _renderMenu: function( ul, items ) {
        var that = this;
        var currentCategory = "";
        items.sort( descending ); // [ 6, 4, 3, 1 ]
        
        $.each( items, function( index, item ) {
          if (item.facType != currentCategory) {
            $('<li/>').addClass('ui-autocomplete-category').html(item.facType).appendTo(ul);
            currentCategory = item.facType;
          }
          that._renderItemData( ul, item );
        });
      },  */

    //overridding the render item method;
    _renderItem: function(ul, item) {
        //item id for each item...if there is no item id them default to value as item id
        var itemId = this.options.itemId == undefined ? "value" : this.options.itemId;

        //renderind the label and value for the UI component
        AdvancedAutoComplete.createLabelValuePattern(item, this.options.type);
        //returns the list item
        return $("<li>").attr("data-value", item[itemId]).append(
        $("<a>").html(item.label)).appendTo(ul);
    },

    //overridding the render item method;
    _destroy: function() {
        this._super();
        $(this).detach();
        $(this).unbind();
        $(this).remove().empty();
        delete this;
    },

    /**
     * method used to set the item to the ui component
     * @param itemId	- ID that need to be searched and selected from the datasource
     * @param dataSource	
     */
    setSelectedUIItem: function(itemId, dataSource) {
        //retrieve the search attributes based on the {type} property
        if (this.options.searchAttributes == "" || this.options.searchAttributes == undefined) {
            this.options.searchAttributes = AdvancedAutoComplete.getSearchAttributes(this.options.type);
        }
        //retrieve the matched results
        var results = Util.getExactMatchResults(itemId, dataSource, [this.options.searchAttributes[1]]);
        if (results != undefined && results.length > 0) {
            this.options._selectedUIItem = results[0];
            AdvancedAutoComplete.createLabelValuePattern(this.options._selectedUIItem, this.options.type);
        } else {
            this.options._selectedUIItem = undefined;
        }

        this._trigger("selectItemComplete", null, {
            item: this.options._selectedUIItem
        });
    }
});


/**
 * constructor for AdvancedAutoComplete
 * @param divId
 * @param placeholder
 * @param type
 * @param treeId
 * @returns {AdvancedAutoComplete}
 */

function AdvancedAutoComplete(divId, placeholder, type, treeId, value) {
    this.divId = divId;
    this.treeId = treeId;
    this.placeholder = placeholder;
    this.type = type;
    this.value = value;
    this.minLength = type == "Schedule" ? 1 : 0;
    this.createWidget();
}

/**
 * creates the expected label and value pattern that is shown in the dropdown.
 * @param item	- {Object}
 * @param labelValuePattern	- is an {Object} that is having and property names for label and value to consider in the item object
 */
AdvancedAutoComplete.createLabelValuePattern = function(item, type) {
    if (item != undefined && type != undefined) {
        item.label = AdvancedAutoComplete.getLabelValuePatterns(type, item);
        item.value = AdvancedAutoComplete.getValuePatterns(type, item);
    } else {
        item.label = "";
        item.value = item.label;
    }
};

/**
 * method to create the advanced auto complete Widget 
 */
AdvancedAutoComplete.prototype.createWidget = function() {
    var advancedAutoCompleteComponent = this;
    var jQueryObject = $("#" + this.divId);

    if (jQueryObject != undefined && jQueryObject.length > 0) {
        //place holder
        $("#jQueryObject").attr("placeholder", this.placeholder);
        //returns the advanced auto complete component
        var autocomplete =  jQueryObject.AdvancedAutoComplete({
            delay: 0,
            minLength: advancedAutoCompleteComponent.minLength,
            type: advancedAutoCompleteComponent.type,
            isInitialized: true,
            treeId: advancedAutoCompleteComponent.treeId,
            //object indicated what should be treated as label and value in the item object
            source: function(request, response) {
                jQueryObject.addClass("autoCompleteInputTest");
                //method to filter /search based on the user input
                if (request.term != undefined && request.term != "") {
                    response(Util.getMatchedResults(jQueryObject.AdvancedAutoComplete('option', 'type'), request.term, AdvancedAutoComplete.getDatasource(jQueryObject.AdvancedAutoComplete('option', 'type')), AdvancedAutoComplete.getSearchAttributes(jQueryObject.AdvancedAutoComplete('option', 'type'))));
                } else {
                    response(AdvancedAutoComplete.getDatasource(jQueryObject.AdvancedAutoComplete('option', 'type')));
                    jQueryObject.removeClass("autoCompleteInputTest");
                }
                return;
            },
            //select listener for the widget
            select: function(event, ui) {
                AdvancedAutoComplete.selectListener(event, ui, advancedAutoCompleteComponent.divId);
            },
            // method triggered on the change event 
            change: function(event, ui) {
                var type;
                if (ui.item == undefined && jQueryObject.val() != "" && jQueryObject.val() != undefined) {
                    type = jQueryObject.AdvancedAutoComplete('option', 'type');
                    var result = Util.getExactMatchResults(jQueryObject.val(), AdvancedAutoComplete.getDatasource(type), AdvancedAutoComplete.getSearchAttributes(type));

                    if (result != undefined && result.length == 1) {
                        AdvancedAutoComplete.setSelectedItem(advancedAutoCompleteComponent.divId, jQueryObject.val(), type);
                        ui.item = result[0];
                    }
                }
                AdvancedAutoComplete.changeListener(event, ui, advancedAutoCompleteComponent.divId);
            },
            // method triggered on the selectItemComplete event 
            selectItemComplete: function(event, ui) {
                if (ui.item != undefined && ui.item.value != undefined) {
                    jQueryObject.val(ui.item.value);
                } else {
                    jQueryObject.val("");
                    jQueryObject.removeClass("autoCompleteInputTest");
                }
                AdvancedAutoComplete.selectionCompleteHandler(event, ui, jQueryObject);
                AdvancedAutoComplete.changeListener(event, ui, advancedAutoCompleteComponent.divId);
            }
        });
        if(this.value != undefined){
        	AdvancedAutoComplete.setSelectedItem(this.divId, this.value, this.type);
        }        
    }
    delete jQueryObject;
};

/**
 * method to handle select event 
 * @param event
 * @param ui
 * @param divId
 */
AdvancedAutoComplete.selectListener = function(event, ui, divId) {
    AdvancedAutoComplete.changeHandler(event, ui, divId);
};

/**
 * method to handle the select event 
 * @param event
 * @param ui
 * @param divId
 */
AdvancedAutoComplete.changeListener = function(event, ui, divId) {
    AdvancedAutoComplete.changeHandler(event, ui, divId);
};

/**
 * method to handle the change event 
 * @param event
 * @param ui
 * @param divId
 */
AdvancedAutoComplete.changeHandler = function(event, ui, divId) {
    //set the selected ui item to the component
	var previousLocCode = AdvancedAutoComplete.getSelectedItem(divId);
    $("#" + divId).AdvancedAutoComplete('option', '_selectedUIItem', ui);
    SQW.locationChangeHandler(event, ui, divId);
    
    var locationCode = ui;
    if(previousLocCode != undefined && previousLocCode.item != undefined && previousLocCode.item.locCd != undefined)
    	setPlacemarkHighlight(false, previousLocCode.item.locCd);
	if(locationCode != undefined && locationCode.item != undefined && locationCode.item.locCd != undefined)
		setPlacemarkHighlight(true, locationCode.item.locCd);
};

/**
 * method to handle the selectionComplete event 
 * @param event
 * @param ui
 * @param jQueryObject
 */
AdvancedAutoComplete.selectionCompleteHandler = function(event, ui, jQueryObject) {
    if (ui.item == undefined || ui.item.value == undefined || ui.item.value == "") {
        AdvancedDialog.closeDialog("showNearBy");
    }
};
/**
 * method to create the region tree for the component 
 * @param treeId
 */
AdvancedAutoComplete.createRegionTree = function(treeId) {
    // Creating kendo tree view component based on product group data.
    if ($("#" + treeId).data('kendoTreeView') == undefined) {
        $("#" + treeId).kendoTreeView({
            checkboxes: {
                checkChildren: true
            },
            expand: function(e) {
                var data = e;
                setTimeout(function() {
                    var label;
                    $(data.node).find("ul").find("input:checkbox").each(function() {
                        if ($(this).next().prop("tagName") != "LABEL") {
                            label = $("<label>");
                            label[0].className = 'clear-labelMargin';
                            $(this).parent().append(label);
                        }
                    });
                }, 100);
            },
            dataTextField: ["globalRgnDesc", "zlabel"]
        });
    }
};

/**
 * method to get selected node Ids 
 * @param treeId
 * @returns comma separated selected Ids. 
 */
AdvancedAutoComplete.getSelectedNodeIds = function(treeId) {
    return AdvancedMultiSelectComponent.getSelectedItems(treeId) != undefined ? AdvancedMultiSelectComponent.getSelectedItems(treeId) : undefined;
};

/**
 * method to get selected global regions 
 * @param treeId
 * @returns
 */
AdvancedAutoComplete.getSelectedGlobalRegions = function(treeId) {
    var selectedGlobalRgn;
    if (treeId != undefined) {
        var selectedRgns = AdvancedMultiSelectComponent.getSelectedItems(treeId) != undefined ? AdvancedMultiSelectComponent.getSelectedItems(treeId).split(",") : undefined;
        if (selectedRgns != undefined) {
            selectedGlobalRgn = [];
            var selectedRgn;
            for (var i = 0; i < selectedRgns.length; i++) {
                selectedRgn = selectedRgns[i];
                if (selectedRgn != undefined) {
                    selectedRgn = selectedRgns[i];
                    selectedGlobalRgn.push(selectedRgn.split("-")[0]);
                }
            }
            return selectedGlobalRgn.toString();
        }
    }
    return selectedGlobalRgn;
};

/**
 * method to get selectedNode Ids
 * @param nodes
 * @param checkedNodeIds
 * @returns
 */
AdvancedAutoComplete.retrieveSelectedNodeIds = function(nodes, checkedNodeIds) {
    if (nodes != undefined) {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].checked) {
                checkedNodeIds.push(nodes[i].globalRgnDesc);
            }

            if (nodes[i].hasChildren) {
                AdvancedAutoComplete.retrieveSelectedNodeIds(nodes[i].children.view(), checkedNodeIds);
            }
        }
    }

    return checkedNodeIds;
};

/**
 * method to set the dataSources for global region trees 
 * @param treeIds
 */
AdvancedAutoComplete.setTreeDatasources = function(treeIds) {
    if (treeIds != undefined) {
        for (var i = 0; i < treeIds.length; i++) {
            AdvancedAutoComplete.setTreeDatasource(treeIds[i]);
        }
    }
};

/**
 * method to set the dataSource for global region tree
 * @param treeId
 */

AdvancedAutoComplete.setTreeDatasource = function(treeId) {
    if (treeId != undefined) {
        if (AdvancedAutoComplete.getDatasource("region") != undefined || AdvancedAutoComplete.getDatasource("region") != null) {
            if ($("#" + treeId).data('kendoTreeView') != undefined) {
                var treeview = $("#" + treeId).data("kendoTreeView");
                treeview.setDataSource(new kendo.data.HierarchicalDataSource({
                    data: AdvancedAutoComplete.getDatasource("region")
                }));
            }
        }
    }
};

/**
 * method to get Region TreeId
 * @returns
 */
AdvancedAutoComplete.getRegionTreeId = function() {
    return this.regionTreeId;
};

/**
 * method to get Selected Item
 * @param divId
 * @returns
 */
AdvancedAutoComplete.getSelectedItem = function(divId) {
    var jQueryObject = $("#" + divId);

    if (jQueryObject != undefined && jQueryObject.length > 0) {
        return jQueryObject.AdvancedAutoComplete('option', "_selectedUIItem");
    }
};

/**
 * method to get LocCd 
 * @param divId
 * @returns
 */
AdvancedAutoComplete.getLocCd = function(divId) {
    var jQueryObject = $("#" + divId);
    var selectedItem;
    var locationComponentType;
    var regExpId;
    var datasetType;
    if (jQueryObject != undefined && jQueryObject.length > 0) {
        locationComponentType = AdvancedAutoComplete.getValue(divId, "type");
        selectedItem = AdvancedAutoComplete.getValue(divId, "_selectedUIItem");
        regExpId = jQueryObject.attr("regExpId");
        datasetType = jQueryObject.attr("datasetType");
        if (selectedItem != undefined && selectedItem.item != undefined) {
            return AdvancedAutoComplete.getLocationComponentSelectedValue(divId, locationComponentType, selectedItem, regExpId, datasetType);
        } else if (selectedItem != undefined && selectedItem.locCd != undefined) {
            return selectedItem.locCd;
        } else {
            return AdvancedAutoComplete.getLocationComponentSelectedValue(divId, locationComponentType, selectedItem, regExpId, datasetType);
        }

        return "";
    }
};
/**
 * method to get location component selectedValue
 * @param divId
 * @param type
 * @param selectedItem
 * @param regExpId
 * @param datasetType
 * @returns
 */
AdvancedAutoComplete.getLocationComponentSelectedValue = function(divId, type, selectedItem, regExpId, datasetType) {
    var jQueryObject = $("#" + divId);
    switch (type) {
    case 'location':
        return selectedItem != undefined && selectedItem.item != undefined ? selectedItem.item.locCd : undefined;
        break;
    case 'facilityGroup':
        return selectedItem != undefined && selectedItem.item != undefined ? selectedItem.item.groupName : undefined;
        break;
    case 'country':
        return selectedItem != undefined && selectedItem.item != undefined ? selectedItem.item.countryCode : undefined;
        break;
    case 'region':
        return AdvancedAutoComplete.getSelectedNodeIds(datasetType + "treeview" + regExpId);
        break;
    }
};
/**
 * method to set selected item
 * @param divId
 * @param itemId
 * @param type
 */
AdvancedAutoComplete.setSelectedItem = function(divId, itemId, type) {
    var jQueryObject = $("#" + divId);
    var locationComponentType;
    if (type != undefined) {
        locationComponentType = AdvancedAutoComplete.getValue(divId, "type"); //jQueryObject.AdvancedAutoComplete('option', 'type')
        if (type != locationComponentType) {
            AdvancedAutoComplete.setFacilityType(divId, itemId, type);
        }
    }

    if (jQueryObject != undefined && jQueryObject.length > 0) {
        jQueryObject.AdvancedAutoComplete("setSelectedUIItem", itemId, AdvancedAutoComplete.getDatasource(jQueryObject.AdvancedAutoComplete('option', 'type')));
    }
};
/**
 * method to set Facility Type
 * @param divId
 * @param itemId
 * @param type
 */
AdvancedAutoComplete.setFacilityType = function(divId, itemId, type) {
    var regExpId = $("#" + divId).attr("regExpId");
    var datasetType = $("#" + divId).attr("datasetType");
    switch (type) {
    case 'location':
    case sqwConstants.SCHEDULE:
        $("#" + datasetType + "location" + regExpId).prop("checked", true);
        $("#" + datasetType + "location" + regExpId).trigger("onchange");
        break;
    case 'facilityGroup':
        $("#" + datasetType + "Facility" + regExpId).prop("checked", true);
        $("#" + datasetType + "Facility" + regExpId).trigger("onchange");
        break;
    case 'country':
        $("#" + datasetType + "Country" + regExpId).prop("checked", true);
        $("#" + datasetType + "Country" + regExpId).trigger("onchange");
        break;
    case 'region':
        $("#" + datasetType + "Region" + regExpId).prop("checked", true);
        if (itemId != undefined) {
            AdvancedMultiSelectComponent.setSelectedItems(datasetType + "treeview" + regExpId, itemId.split(","));
        }
        break;
    }
};
/**
 * method to getDatasource for the specified type
 * @param type
 * @returns
 */
AdvancedAutoComplete.getDatasource = function(type) {
    switch (type) {
    case 'location':
        return QueryCacheManager.getInstance().getDatasource("ActivityFacilities");
        break;
    case 'facilityGroup':
        return QueryCacheManager.getInstance().getDatasource("FacilityGroups");
        break;
    case 'country':
        return QueryCacheManager.getInstance().getDatasource("CountryCodes");
        break;
    case 'region':
        return QueryCacheManager.getInstance().getDatasource("GlobalRegions");
        break;
    case sqwConstants.SCHEDULE:
        return QueryCacheManager.getInstance().getDatasource("Locations");
        break;
    }
};
/**
 * method to getSearchAttributes for the specified type
 * @param type
 * @returns {Array}
 */
AdvancedAutoComplete.getSearchAttributes = function(type) {
    switch (type) {
    case sqwConstants.SCHEDULE:
    case 'location':
        return ["relFacilityName","locCd" , "provStCd", "countryCd"];
        break;
    case 'facilityGroup':
        return ["grpDesc", "groupName"];
        break;
    case 'country':
        return ["countryDesc", "countryCode"];
        break;
    case 'region':
        return ["grpDesc", "groupName"];
        break;
    }
};
/**
 * method to getLabelValuePatterns for the specified type
 * @param type
 * @param item
 * @returns
 */
AdvancedAutoComplete.getLabelValuePatterns = function(type, item) {
    switch (type) {
    case sqwConstants.SCHEDULE:
    case 'location':
        //return item.city +","+item.provStCd+","+item.countryCd+" ("+item.locCd+") - "+AdvancedAutoComplete.getFacilityTypeDescription(item.facType);
        return "<b>" +item.locCd+ "</b> - " + item.relFacilityName + ", " + (item.provStCd != undefined ? item.provStCd + ", " + item.countryCd : item.countryCd) + " - " + AdvancedAutoComplete.getFacilityTypeDescription(item.facType);
        break;
    case 'facilityGroup':
        return "<b>"+item.groupName+"</b> - "+item.grpDesc;
        break;
    case 'country':
        return "<b>"+item.countryCode + "</b> - " + item.countryDesc;
        break;
    case 'region':
        return item.countryCode + " - " + item.countryDesc;
        break;
    default:
        return "";
    }
};

/**
 * method to getLabelValuePatterns for the specified type
 * @param type
 * @param item
 * @returns
 */
AdvancedAutoComplete.getValuePatterns = function(type, item) {
    switch (type) {
    case sqwConstants.SCHEDULE:
    case 'location':
        //return item.city +","+item.provStCd+","+item.countryCd+" ("+item.locCd+") - "+AdvancedAutoComplete.getFacilityTypeDescription(item.facType);
        return item.locCd;
        break;
    case 'facilityGroup':
        return item.groupName;
        break;
    case 'country':
        return item.countryCode + " - " + item.countryDesc;
        break;
    case 'region':
        return item.countryCode + " - " + item.countryDesc;
        break;
    default:
        return "";
    }
};
/**
 * method to getFacilityTypeDescription for the specified type
 * @param facilityType
 * @returns
 */
AdvancedAutoComplete.getFacilityTypeDescription = function(facilityType) {
    switch (facilityType) {
    case 'HU':
        return "Hub";
        break;
    case 'RP':
        return "Ramp";
        break;
    case 'AP':
        return "Airport";
        break;
    default:
        return facilityType;
    }
};
/**
 * method to getLocationCd for the specified type
 * @param item
 * @returns
 */
AdvancedAutoComplete.getLocationCd = function(item) {
    if (item != undefined) {
        if (item.locCd.indexOf(",") >= 0) {
            return item.relFacLocCd;
        }
        return item.locCd;
    }

    return;
};
/**
 * method to getPlaceHolderType for the specified type
 * @param type
 * @param divId
 * @returns {String}
 */
AdvancedAutoComplete.getPlaceHolderType = function(type, divId) {
    if (divId.indexOf("Previous") >= 0) {
        return "From ";
    } else if (divId.indexOf("Primary") >= 0) {
        return "Through ";
    } else if (divId.indexOf("Next") >= 0) {
        return "To ";
    } else if (divId.indexOf("Origin") >= 0) {
        return "Origin ";
    } else if (divId.indexOf("Destination") >= 0) {
        return "Destination ";
    } else {
        return "";
    }
};
/**
 * method to getPlaceHolder for the specified type
 * @param type
 * @param divId
 * @returns
 */
AdvancedAutoComplete.getPlaceHolder = function(type, divId) {
    switch (type) {
    case sqwConstants.SCHEDULE:
        return this.getPlaceHolderType(type, divId);
        break;
    case 'location':
        return this.getPlaceHolderType(type, divId) + "Location";
        break;
    case 'facilityGroup':
        return this.getPlaceHolderType(type, divId) + "Facility Group";
        break;
    case 'country':
        return this.getPlaceHolderType(type, divId) + "Country";
        break;
    case 'region':
        return this.getPlaceHolderType(type, divId) + "Region";
        break;
    default:
        return "";
    }
};
/**
 *  method to getValue for the specified type
 * @param divId
 * @param name
 * @returns
 */
AdvancedAutoComplete.getValue = function(divId, name) {
    var jQueryObject = $("#" + divId);

    if (jQueryObject != undefined && jQueryObject.length > 0) {
        return jQueryObject.AdvancedAutoComplete('option', name);
    }
};
/**
 * method to changeDatasource for the specified type
 * @param divId
 * @param type
 */
AdvancedAutoComplete.changeDatasource = function(divId, type) {
    var jQueryObject = $("#" + divId);

    if (jQueryObject != undefined && jQueryObject.length > 0) {
        jQueryObject.AdvancedAutoComplete('option', 'searchAttributes', "");
        jQueryObject.AdvancedAutoComplete('option', 'labelValuePattern', "");
        jQueryObject.AdvancedAutoComplete('option', 'type', type);
        AdvancedAutoComplete.setSelectedItem(divId, "");
        jQueryObject.removeClass("autoCompleteInputTest");
        jQueryObject.attr("placeholder", AdvancedAutoComplete.getPlaceHolder(type, divId));
    }
    var treeId = jQueryObject.AdvancedAutoComplete('option', 'treeId');
    if (type == "region") {
        $("#" + treeId).multiselect("open");
        jQueryObject.attr("disabled", "disabled");
        jQueryObject.attr("title", "");
    } else {
        jQueryObject.attr("disabled", false);
        jQueryObject.attr("title", "");
        var treeSelectedTextDiv = $("#" + treeId).attr("name");
        AdvancedMultiSelectComponent.clearAllSelections(treeId, treeSelectedTextDiv + "SelectedTextDiv");
    }
};
/**
 * method to closeRegionHandler for the specified type
 * @param divId
 */
AdvancedAutoComplete.closeRegionHandler = function(divId) {
    var jQueryObject = $("#" + divId);
    var locationComponentId;
    var regionStr;
    if (jQueryObject != undefined && jQueryObject.length > 0) {
        locationComponentId = jQueryObject.attr("ref");
        var selectedItems = AdvancedMultiSelectComponent.getSelectedItems(divId);
        if (selectedItems != undefined && selectedItems != "") {
            regionStr = AdvancedAutoComplete.getGlobalRegionString(selectedItems);
            $("#" + locationComponentId).attr("placeholder", regionStr);
            $("#" + locationComponentId).attr("title", regionStr);
            var selectedPlanDays = $("#" + $("#" + locationComponentId).attr("daySelector")).attr("selectedPlanDays");
            SQW.refreshActivityDatasource($("#" + locationComponentId).attr("datasetType"), selectedItems, $("#" + locationComponentId).attr("regExpId"), selectedPlanDays, 'region');
        } else {
            $("#" + locationComponentId).attr("placeholder", AdvancedAutoComplete.getPlaceHolder('region', locationComponentId));
            $("#" + locationComponentId).attr("title", "");
        }
    }
};
/**
 * method to getGlobalRegionString for the specified type
 * @param selectedItems
 * @returns {String}
 */
AdvancedAutoComplete.getGlobalRegionString = function(selectedItems) {
    var regionDataSource;
    var selectedRgns;
    var regionData;
    var items;
    var globalRegion;
    var zone;
    var string = "";
    if (selectedItems != undefined) {
        selectedRgns = selectedItems.split(",");
        regionDataSource = AdvancedAutoComplete.getDatasource("region");
        for (var i = 0; i < selectedRgns.length; i++) {
            regionData = selectedRgns[i].split("-");
            if (regionData != undefined) {
                globalRegion = AdvancedAutoComplete.getGlobalRegion(regionDataSource, regionData[0]);
                zone = AdvancedAutoComplete.getGlobalRegionZone(globalRegion, regionData[1]);
                if ((selectedRgns.length - 1) != i) {
                    string += globalRegion.globalRgnDesc + ":" + zone.zoneDesc + ",";
                } else {
                    string += globalRegion.globalRgnDesc + ":" + zone.zoneDesc;
                }
            }
        }
    }
    return string;
};
/**
 * method to getGlobalRegion for the specified type
 * @param regionDataSource
 * @param globalRegionId
 * @returns
 */
AdvancedAutoComplete.getGlobalRegion = function(regionDataSource, globalRegionId) {
    if (regionDataSource != undefined && globalRegionId != undefined) {
        for (var i = 0; i < regionDataSource.length; i++) {
            if (regionDataSource[i].globalRgnCd == globalRegionId) {
                return regionDataSource[i];
            }
        }
    }
};
/**
 * method to getGlobalRegionZone for the specified type
 * @param globalRegion
 * @param zoneId
 * @returns
 */
AdvancedAutoComplete.getGlobalRegionZone = function(globalRegion, zoneId) {
    var allZones;
    if (globalRegion != undefined && zoneId != undefined) {
        allZones = globalRegion.items;
        for (var i = 0; i < allZones.length; i++) {
            if (allZones[i].zone == zoneId) {
                return allZones[i];
            }
        }
    }
};
/**
 * method to getGlobalRegionName for the specified type
 * @param regionDataSource
 * @param globalRegionId
 * @returns
 */
AdvancedAutoComplete.getGlobalRegionName = function(regionDataSource, globalRegionId) {
    if (regionDataSource != undefined && globalRegionId != undefined) {
        for (var i = 0; i < regionDataSource.length; i++) {
            if (regionDataSource[i].globalRgnCd == globalRegionId) {
                return regionDataSource[i]["globalRgnDesc"];
            }
        }
    }
};
/**
 *  method to check if the component is Initialized
 * @param divId
 * @returns
 */
AdvancedAutoComplete.isInitialized = function(divId) {
    var jQueryObject = $("#" + divId);

    if (jQueryObject != undefined && jQueryObject.length > 0 && jQueryObject.data('ui-autocomplete-input')) {
        return AdvancedAutoComplete.getValue(divId, "isInitialized");
    }
    return false;
};
/**
 * method to destroy the object 
 * @param divId
 */
AdvancedAutoComplete.destroy = function(divId) {
    var jQueryObject = $("#" + divId);

    if (jQueryObject != undefined && jQueryObject.length > 0) {
        jQueryObject.AdvancedAutoComplete("destroy");
    }
};

