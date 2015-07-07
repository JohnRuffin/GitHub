/**
 * SQW constants
 */
var sqwConstants = {
    PREVIOUS: 'Previous',
    PRIMARY: 'Primary',
    NEXT: 'Next',
    TREE_VIEW: "treeview",
    TREEVIEW_DIV: "treeviewDiv",
    DAY_CAL: "DayCal",
    SCHEDULE_DATASET: "Schedule Dataset",
    NETWORK_DATASET: "Network Dataset",
    ORIGIN: "Origin",
    DESTINATION: "Destination",
    SCHEDULE: "Schedule"
};

/**
 * SQW component to manipulate the top search panel UI of the SQW.
 */
var SQW = (function() {
    this.primaryDatasetCount;
    this.previousDatasetCount;
    this.nextDatasetCount;
    this.originDatasetCount;
    this.destinationDatasetCount;
    this.primaryActivityTemplate;
    this.priviousActivityTemplate;
    this.nextActivityTemplate;

    this.networkDatasetTemplate;
    this.scheduleDatasetTemplate;
    
    this.allTemplatesInitialized = false;
    this.originTemplate;
    this.destinationTemplate;

    this.iscachedAllDatasources = false;

    /*class constructor.*/

    function constructorFn() {

    };
    /**
     * method to open the dashboard
     * @param dashboardId
     */
    constructorFn.openDashboard = function(dashboardId) {
        openDashboard(dashboardId);
        if (typeof getDashboardContentWindow(dashboardId).refresh != 'undefined') {
            getDashboardContentWindow(dashboardId).refresh();
            setTimeout(function() {
                toFront(dashboardId);
            }, 50);
        }
    };

    /* 
     * This will initialize the page,  
     */
    constructorFn.initialize = function() {
        this.primaryDatasetCount = 1;
        this.previousDatasetCount = 1;
        this.nextDatasetCount = 1;
        this.originDatasetCount = 1;
        this.destinationDatasetCount = 1;
        this.addFirstLocations(1);
        //        products component for network query
        this.createMultiSelectComponent("products", "Products", "product", "productSelectedTextDiv", "Select or type product");
        //        products Group component for network query
        this.createMultiSelectComponent("productGroups", "Product groups", "productGroup", "productGroupSelectedTextDiv", "Select or type product group");
        //        flight leg-type for search component for schedule query
        this.createMultiSelectComponent("flylegtypeSearch", "Fly", "legTypesFly", "flylegtypeSearchTextDiv", "Select or type fly leg type");
        //        truck leg-type for search component for schedule query
        this.createMultiSelectComponent("trucklegtypeSearch", "Truck", "legTypesTruck", "trucklegtypeSearchTextDiv", "Select or type truck leg type");
        //        flight leg-type for search component for schedule overlay query
        this.createMultiSelectComponent("networkFlyCombo", "select", "legTypesFly", "flylegtypeFilterTextDiv", "Select or type fly leg type");
        //        truck leg-type for search component for schedule overlay query
        this.createMultiSelectComponent("networkTruckCombo", "select", "legTypesTruck", "trucklegtypeFilterTextDiv", "Select or type truck leg type");
        //        flight leg-type for search component for schedule query
        this.createMultiSelectComponent("scheduleFlyCombo", "select", "legTypesFly", "scheduleflylegtypeFilterTextDiv", "Select or type fly leg type");
        //        truck leg-type for search component for schedule query
        this.createMultiSelectComponent("scheduletruckCombo", "select", "legTypesTruck", "scheduletrucklegtypeFilterTextDiv", "Select or type truck leg type");
        //        flight Equipments-type component for schedule query
        this.createMultiSelectComponent("flightEquipments", "Flight Equipment type", "EquipmentTypesFly", "flightsSelectedTextDiv", "Select or type equipment type");
        //        truck Equipments-type component for schedule query
        this.createMultiSelectComponent("truckEquipment", "Truck Equipment type", "EquipmentTypesTruck", "trucksSelectedTextDiv", "Select or type equipment type");
        //      flight Equipments-type component for schedule query
        this.createMultiSelectComponent("flyeqptypeFilter", "select", "EquipmentTypesFly", "flyeqptypeFilterTextDiv", "Select or type equipment type");
        //        truck Equipments-type component for schedule query
        this.createMultiSelectComponent("truckeqptypeFilter", "select", "EquipmentTypesTruck", "truckeqptypeFilterTextDiv", "Select or type equipment type");
        //
        this.initializeAdvancedAutoComplete("showNearByLocCd", "Location", "location");
        // initialize Favorite Components
        this.initializeFavoriteComponents();
        //      flight leg-type for search component for schedule overlay query
        this.createMultiSelectComponent("networkEquipmentFlyCombo", "select", "flightEquipments", "flyEqptypeFilterTextDiv", "Select or type equipment type");
        //        truck leg-type for search component for schedule overlay query
        this.createMultiSelectComponent("networkEquipmentTruckCombo", "select", "truckEquipment", "truckEqptypeFilterTextDiv", "Select or type equipment type");
        //        flight leg-type for search component for schedule query
        this.createMultiSelectComponent("scheduleEquipmentFlyCombo", "select", "flightEquipments", "scheduleflyEqptypeFilterTextDiv1", "Select or type equipment type");
        //        truck leg-type for search component for schedule query
        this.createMultiSelectComponent("scheduleEquipmenttruckCombo", "select", "truckEquipment", "scheduletruckEqptypeFilterTextDiv1", "Select or type equipment type");

    };

    /**
     * method to cache templates, which will be used to build the repeatable parts of the UI, with the index increase
     */
    constructorFn.cacheTemplates = function(template) {
        this.networkDatasetTemplate = this.cacheTemplate(sqwConstants.NETWORK_DATASET, template);
        this.scheduleDatasetTemplate = this.cacheTemplate(sqwConstants.SCHEDULE_DATASET, template);
        this.primaryActivityTemplate = this.cacheTemplate(sqwConstants.PRIMARY, template);
        this.priviousActivityTemplate = this.cacheTemplate(sqwConstants.PREVIOUS, template);
        this.nextActivityTemplate = this.cacheTemplate(sqwConstants.NEXT, template);
        this.originTemplate = this.cacheTemplate(sqwConstants.ORIGIN, template);
        this.destinationTemplate = this.cacheTemplate(sqwConstants.DESTINATION, template);
        this.allTemplatesInitialized = true;
    };

    /**
     * method to cache template identified using the given key
     * @param key to identify a particular template location
     * @param template full template string to get the template from.
     * @returns template string for the given key
     */
    constructorFn.cacheTemplate = function(key, template) {
        var startIndex, endIndex;
        if (key != undefined && template != undefined) {
            startIndex = template.indexOf("<!--" + key + "-->");
            endIndex = template.indexOf("<!--/" + key + "-->");
            return template.substring(startIndex, endIndex);
        }
    };
    /**
     * To get the template based on key
     * @param key to identify a particular template
     * @returns template string for the given key
     */
    constructorFn.getTemplate = function(key) {
        if (key != undefined) {
            switch (key) {
            case sqwConstants.PRIMARY:
                return this.primaryActivityTemplate;
                break;
            case sqwConstants.PREVIOUS:
                return this.priviousActivityTemplate;
                break;
            case sqwConstants.NEXT:
                return this.nextActivityTemplate;
                break;
            case sqwConstants.ORIGIN:
                return this.originTemplate;
                break;
            case sqwConstants.DESTINATION:
                return this.destinationTemplate;
                break;
            }
        }
    };

    /**
     * To add the location template in top search panel
     * @param count number of locations to add
     * @param isInitialized 
     */
    constructorFn.addFirstLocations = function(count, isInitialized) {
        var sqwComponent = this;
        var templateStr = "";
        if (!isInitialized) {
            new AdvancedDialog("showNearBy", ["content1"], {
                width: 280,
                height: 150,
                openListener: this.dialogOpenListener
            });
        }
        
        if(!this.allTemplatesInitialized){
        	$.get('pegasus/portaljsp/sqw/networkTemplate.html', function(template) {
                for (var i = 0; i < count; i++) {
                    sqwComponent.cacheTemplates(template);
                    sqwComponent.afterTemplatesCachedHandler(i, isInitialized);
                }
            });
        }else {
        	 for (var i = 0; i < count; i++) {
                 sqwComponent.afterTemplatesCachedHandler(i, isInitialized);
             }
        }
        

        delete templateStr;
    };
    /**
     * handler method which gets invoked after caching templates, to add the locations to UI.
     * @param i index
     * @param isInitialized
     */
    constructorFn.afterTemplatesCachedHandler = function(i, isInitialized) {
    	var sqwComponent = this;
    	var templateStr = "";
    	 if (!isInitialized) {
             $("#horizontalLayout").empty();
             if (sqwComponent.networkDatasetTemplate != undefined) {
                 templateStr = sqwComponent.networkDatasetTemplate.replace(/@count/g, i).replace(/@none/g, 'none');
                 $("#horizontalLayout").append(templateStr);
                 sqwComponent.renderUI(0);
             }

             if (sqwComponent.scheduleDatasetTemplate != undefined) {
                 templateStr = sqwComponent.scheduleDatasetTemplate.replace(/@count/g, i);
                 $("#scheduleDatasets").prepend(templateStr);
                 sqwComponent.renderUI(0, sqwConstants.SCHEDULE);
             }
         } else if (isNetworkQuery) {
             $("#horizontalLayout").empty();
             if (sqwComponent.networkDatasetTemplate != undefined) {
                 templateStr = sqwComponent.networkDatasetTemplate.replace(/@count/g, i).replace(/@none/g, 'none');
                 $("#horizontalLayout").append(templateStr);
                 sqwComponent.renderUI(0);
             }
         } else {
             if (sqwComponent.scheduleDatasetTemplate != undefined) {
                 templateStr = sqwComponent.scheduleDatasetTemplate.replace(/@count/g, i);
                 $("#scheduleDatasets").prepend(templateStr);
                 sqwComponent.renderUI(0, sqwConstants.SCHEDULE);
             }
         }
    };
    
    /**
     * miles selection handler, to refresh the show near by locations.
     */
    constructorFn.milesChangeHandler = function() {
        $("#showNearBy").trigger("refresh", undefined, {});
    };

    /**
     * show near by locations open dialog listener
     * @param e
     * @param datasetType
     * @param targetDivId
     * @param type
     */
    constructorFn.dialogOpenListener = function(e, datasetType, targetDivId, type) {
        callService({
            url: parent.getNearByLocationsRenderer() + "&rand=" + getTime(),
            paramsMap: {
                locCd: AdvancedAutoComplete.getLocCd("showNearByLocCd"),
                radius: $("#miles").val(),
                type: type
            },
            successCallback: function(response, io) {
                SQW.renderDialogUI(response, io, this, datasetType, targetDivId);
            },
            showProgressWindow: false
        });
    };

    /**
     * renders the dialog ui (for show near by)
     * @param response response from server
     * @param io
     * @param sourceObject
     * @param datasetType
     * @param targetDivId
     */
    constructorFn.renderDialogUI = function(response, io, sourceObject, datasetType, targetDivId) {
        if (response != undefined) {
            this.renderDialogDatasource(response, datasetType, targetDivId);
        }
    };

    constructorFn.renderDialogDatasource = function(response, datasetType, targetDivId) {
        if (response != undefined) {
            $("#dialogDatasource").empty();
            $("#dialogDatasource").attr("datasetType", datasetType);
            $("#dialogDatasource").attr("targetDivId", targetDivId);
            for (var i = 0; i < response.length; i++) {
                $("#dialogDatasource").append("<tr rowId='" + i + "'>" + "<td><input type='checkbox' id='checkbox" + i + "' value='" + response[i].locCd + "' style='vertical-align: top !important'>" + "</input></td><td>" + AdvancedAutoComplete.getLabelValuePatterns('location', response[i]) + "</td></tr>");
            }
            //dynamic height
            AdvancedDialog.setPropertyValue("showNearBy", "height", $("#content1").height() + 70);
        }
    };

    /**
     * To create a nearby location
     */
    constructorFn.nearByLocationsSelectionHandler = function() {
        //create a jquery object of the rows
        var rows = $("#dialogDatasource").find("tr");
        var locations = [];
        //get the locations....
        if (rows != undefined) {
            var rowId;
            rows.each(function(i, v) {
                rowId = $(this).attr("rowId");
                if ($("#checkbox" + rowId).is(":checked")) {
                    locations.push($("#checkbox" + rowId).val());
                }
            });
        }
        var autocompleteId = $("#dialogDatasource").attr("targetDivId");
        var checkboxId = $("#" + autocompleteId).attr("checkbox");
        if (checkboxId != undefined) {
            $("#" + checkboxId).attr("checked", false);
        }
/*//clear the content
        //AdvancedAutoComplete.setSelectedItem(autocompleteId, "");
        $("#" + autocompleteId).AdvancedAutoComplete('option', '_selectedUIItem', "");
        */
        //build the datasets
        SQW.buildAllDatasets($("#dialogDatasource").attr("datasetType"), locations);
        //close the dialog
        this.closeDialog("showNearBy");

        delete checkboxId;
        delete autocompleteId;
    };

    /**
     * To build the datasets of the given key
     * @param key dataset key
     * @param data data to be set
     * return
     */
    constructorFn.buildAllDatasets = function(key, data) {
        switch (key) {
        case sqwConstants.PREVIOUS:
            SQW.buildDatasets(sqwConstants.PREVIOUS, data);
            break;
        case sqwConstants.NEXT:
            SQW.buildDatasets(sqwConstants.NEXT, data);
            break;
        case sqwConstants.PRIMARY:
            SQW.buildDatasets(sqwConstants.PRIMARY, data);
            break;
        case sqwConstants.ORIGIN:
            SQW.buildDatasets(sqwConstants.ORIGIN, data);
            break;
        case sqwConstants.DESTINATION:
            SQW.buildDatasets(sqwConstants.DESTINATION, data);
            break;
        }
    };


    /**
     * To add more location template in top search panel
     * @param count locations count
     * @param key dataset key
     */
    constructorFn.addMoreLocations = function(count, key) {
        var sqwComponent = this;
        if (count > 0) {
            switch (key) {
            case sqwConstants.PRIMARY:
            case sqwConstants.NEXT:
            case sqwConstants.PREVIOUS:
            case sqwConstants.ORIGIN:
            case sqwConstants.DESTINATION:
                sqwComponent.addDatasets(key, count, true);
                break;
            case sqwConstants.SCHEDULE:
                sqwComponent.addDatasets(sqwConstants.ORIGIN, count, true);
                sqwComponent.addDatasets(sqwConstants.DESTINATION, count, true);
                break;
            default:
                sqwComponent.addDatasets(sqwConstants.PREVIOUS, count, true);
                sqwComponent.addDatasets(sqwConstants.PRIMARY, count, true);
                sqwComponent.addDatasets(sqwConstants.NEXT, count, true);
            }
            this.togglePrimaryOptions();
        }

        delete templateStr;
    };

    /**
     * To add more datasets in top search panel
     * @param key dataset key
     * @param count count of datasets
     * @param isForceAddLocation flag to force add dataset
     */
    constructorFn.addDatasets = function(key, count, isForceAddLocation) {
        if (key != undefined && count > 0) {
            for (var i = 0; i < count; i++) {
                this.addDataset(key, isForceAddLocation);
            }
        }
    };

    /**
     * To add dataset in top search panel
     * @param key dataset key
     * @param isForceAddLocation flag to force add dataset even if the empty dataset of that exist already
     * @returns
     */
    constructorFn.addDataset = function(key, isForceAddLocation) {
        var templateStr;
        var regExpId = EMPTY_STRING;
        if (key != undefined) {
            if (!isForceAddLocation) {
                regExpId = this.getFirstEmptyDataset(key);
            }
            if (regExpId == undefined || regExpId === EMPTY_STRING) {
                templateStr = this.getTemplate(key);
                if (templateStr != undefined) {
                    regExpId = this.getDatasetCount(key);
                    templateStr = templateStr.replace(/@count/g, regExpId);
                    $(this.getDatasetId(key)).append("<span regExpId='" + regExpId + "' id='" + key + "DataSet" + regExpId + "'>" + templateStr + "</span>");
                    this.renderUI(regExpId, key);
                    this.incrementDatasetCount(key);
                }
            }
            return regExpId;
        }
    };

    /**
     * To bind the datasets based on the given key and preset the location to the given
     * @param key dataset key
     * @param locationId location to preset
     */
    constructorFn.buildDataset = function(key, locationId) {
        var regExpId;
        if (key != undefined) {
            regExpId = this.addDataset(key);
            this.setLocation(key + regExpId, locationId);
            delete regExpId;
        }
    };

    /**
     * sets the given location to the component (id) 
     * @param id component id
     * @param locationId location
     */
    constructorFn.setLocation = function(id, locationId) {
        if (id != undefined && locationId != undefined) {
            AdvancedAutoComplete.setSelectedItem(id, locationId);
            console.log($("#" + id).attr("activityCompId") + " " + locationId);
/*SQW.refreshActivityDatasource($("#" + id).attr("datasetType"), 
            		AdvancedAutoComplete.getLocCd(id), $("#" + id).attr("regExpId"), 
            		undefined, 
            		AdvancedAutoComplete.getValue(id, 'type'));*/
        }
    };
    
	/**
	 * builds the datasets prefilling the given locations.
	 * @param key dataset key
	 * @param locations locations to preset
	 */
    constructorFn.buildDatasets = function(key, locations) {
        if (key != undefined && (locations != undefined && locations.length > 0)) {
            for (var i = 0; i < locations.length; i++) {
                this.buildDataset(key, locations[i]);
            }
            Slider.moveSearchButton('vSlider-arrow');
        }
    };

    /**
     * gets the first empty dataset for the given key.
     * @param key datset key
     * @returns first free dataset
     */
    constructorFn.getFirstEmptyDataset = function(key) {
        if (key != undefined) {
            var dataSetCount = this.getDatasetCount(key);
            for (var i = 0; i < dataSetCount; i++) {
                return this.getEmptyDatasetId(key, dataSetCount);
            }
        }
    };
    /**
     * To get the datset based on key
     * @param key
     * @returns {String}
     */
    constructorFn.getDatasetId = function(key) {
        if (key != undefined) {
            switch (key) {
            case sqwConstants.PRIMARY:
                return ".primaryDataSet";
                break;
            case sqwConstants.PREVIOUS:
                return ".previousDataSet";
                break;
            case sqwConstants.NEXT:
                return ".nextDataSet";
                break;
            case sqwConstants.ORIGIN:
                return ".originDataSet";
                break;
            case sqwConstants.DESTINATION:
                return ".destinationDataSet";
                break;
            }
        }
    };

    /**
     * To get the dataset count for top search panel based on the given key
     * @param key dataset key
     * @returns dataset count
     */
    constructorFn.getDatasetCount = function(key) {
        if (key != undefined) {
            switch (key) {
            case sqwConstants.PRIMARY:
                return this.primaryDatasetCount;
                break;
            case sqwConstants.PREVIOUS:
                return this.previousDatasetCount;
                break;
            case sqwConstants.NEXT:
                return this.nextDatasetCount;
                break;
            case sqwConstants.ORIGIN:
                return this.originDatasetCount;
                break;
            case sqwConstants.DESTINATION:
                return this.destinationDatasetCount;
                break;
            }
        }
    };

    /**
     * increases the dataset count for the given key and gives the count (next dataset count)
     * @param key dataset key
     * @returns {Number}
     */
    constructorFn.incrementDatasetCount = function(key) {
        if (key != undefined) {
            switch (key) {
            case sqwConstants.PRIMARY:
                this.primaryDatasetCount++;
                break;
            case sqwConstants.PREVIOUS:
                this.previousDatasetCount++;
                break;
            case sqwConstants.NEXT:
                this.nextDatasetCount++;
                break;
            case sqwConstants.ORIGIN:
                return this.originDatasetCount++;
                break;
            case sqwConstants.DESTINATION:
                return this.destinationDatasetCount++;
                break;
            }
        }
    };

    constructorFn.renderValue = function() {
        console.log(AdvancedAutoComplete.getSelectedItem("previous0"));
    };

    /**
     * To render UI with the given count of datasets for the given key.
     * @param count dataset count
     * @param key dataset key
     */
    constructorFn.renderUI = function(count, key) {
        switch (key) {
        case sqwConstants.PRIMARY:
            this.renderDataset(count, sqwConstants.PRIMARY);
            break;
        case sqwConstants.PREVIOUS:
            this.renderDataset(count, sqwConstants.PREVIOUS);
            break;
        case sqwConstants.NEXT:
            this.renderDataset(count, sqwConstants.NEXT);
            break;
        case sqwConstants.ORIGIN:
            this.renderDataset(count, sqwConstants.ORIGIN);
            break;
        case sqwConstants.DESTINATION:
            this.renderDataset(count, sqwConstants.DESTINATION);
            break;
        case sqwConstants.SCHEDULE:
            this.renderDataset(count, sqwConstants.ORIGIN);
            this.renderDataset(count, sqwConstants.DESTINATION);
            //AdvancedMultiSelectComponent.refreshDatasource(sqwConstants.ORIGIN + sqwConstants.TREE_VIEW + count, "regions");
            // AdvancedMultiSelectComponent.refreshDatasource(sqwConstants.DESTINATION + sqwConstants.TREE_VIEW + count, "regions");
/*AdvancedAutoComplete.setTreeDatasources([sqwConstants.ORIGIN + sqwConstants.TREE_VIEW + count,
                                                         sqwConstants.DESTINATION + sqwConstants.TREE_VIEW + count]);*/
            break;
        default:
            this.renderDataset(count, sqwConstants.PREVIOUS);
            this.renderDataset(count, sqwConstants.PRIMARY);
            this.renderDataset(count, sqwConstants.NEXT);
            if (this.iscachedAllDatasources) {
                AdvancedMultiSelectComponent.refreshDatasource(sqwConstants.PRIMARY + sqwConstants.TREE_VIEW + count, "regions");
                AdvancedMultiSelectComponent.refreshDatasource(sqwConstants.PREVIOUS + sqwConstants.TREE_VIEW + count, "regions");
                AdvancedMultiSelectComponent.refreshDatasource(sqwConstants.NEXT + sqwConstants.TREE_VIEW + count, "regions");

/* AdvancedAutoComplete.setTreeDatasources([sqwConstants.PRIMARY + sqwConstants.TREE_VIEW + count, 
                                                         sqwConstants.PREVIOUS + sqwConstants.TREE_VIEW + count,
                                                         sqwConstants.NEXT + sqwConstants.TREE_VIEW + count]);*/
            }
        }

        $(document).on('propertychange keyup input paste mouseover mouseout', 'input.locations_field', function() {
            var io = $(this).val().length ? 1 : 0;
            if (io > 0) {
                Util.addClearGlass($(this).attr("ref"));
            } else {
                Util.removeClearGlass($(this).attr("ref"));
            }
        }).on('click', '.icon_clear', function(event) {
            var clearRenderCallBack = $("#" + $(this).attr("ref")).attr("onClearClick");
            if (clearRenderCallBack == undefined) {
            	var locationCode = AdvancedAutoComplete.getSelectedItem($(this).attr("ref"));
            	if(locationCode != undefined && locationCode.item != undefined)
            		setPlacemarkHighlight(false, locationCode.item.locCd);
                $("#showNearByLocCd").val("");
                AdvancedAutoComplete.setSelectedItem($(this).attr("ref"), "");
                $("#" + $(this).attr("ref")).removeClass("autoCompleteInputTest");
                AdvancedAutoComplete.setSelectedItem("showNearByLocCd", "");
                //SQW.locationChangeHandler(undefined, undefined, $(this).attr("ref"));
                Util.removeClearGlass($(this).attr("id"));
            } else if (clearRenderCallBack != undefined) {
                if (window[clearRenderCallBack] != undefined) {
                    window[clearRenderCallBack]();
                }
            }
        });


    };

    /**
     * method to render the given count of datasets for the given key in the top search panel.
     * @param count dataset count
     * @param key dataset key
     */
    constructorFn.renderDataset = function(count, key) {
        if (key != undefined) {
            this.createMultiSelectComponent(key + sqwConstants.TREE_VIEW + count, "", "regions", key + sqwConstants.TREE_VIEW + "SelectedTextDiv" + count, "Select or type region");
            //AdvancedMultiSelectComponent.refreshDatasource(key + sqwConstants.TREE_VIEW + count, "regions");
            //AdvancedAutoComplete.createRegionTree(key + sqwConstants.TREE_VIEW + count);
            //AdvancedAutoComplete.setTreeDatasource(key + sqwConstants.TREE_VIEW + count);
            switch (key) {
            case sqwConstants.PRIMARY:
                this.initializeAdvancedAutoComplete(key + count, "Locations", "location", key + sqwConstants.TREE_VIEW + count);
                this.createMultiSelectComponent(key + "Activity" + count, "Activity", "activity", key + "ActivitySelectedTextDiv" + count, "Select or type activity");
                break;
            case sqwConstants.PREVIOUS:
            case sqwConstants.NEXT:
                this.initializeAdvancedAutoComplete(key + count, "Locations", "location", key + sqwConstants.TREE_VIEW + count);
                this.createMultiSelectComponent(key + "Transit" + count, "Transit", "location", key + "TransitSelectedTextDiv" + count, "Select or type transit");
                this.createMultiSelectComponent(key + "Activity" + count, "Activity", "activity", key + "ActivitySelectedTextDiv" + count, "Select or type activity");
                break;
            case sqwConstants.ORIGIN:
            case sqwConstants.DESTINATION:
            case sqwConstants.SCHEDULE:
                this.initializeAdvancedAutoComplete(key + count, "Locations", sqwConstants.SCHEDULE, key + sqwConstants.TREE_VIEW + count);
                break;
            default:

            }
        }
    };
    /**
     * method to initialize AdvancedAutoComplete component for the given details.
     * @param key div id
     * @param placeHolder place holder text
     * @param type type
     * @param treeId tree id (for regions)
     * @param value value to set
     */
    constructorFn.initializeAdvancedAutoComplete = function(key, placeHolder, type, treeId, value) {
    	if(!AdvancedAutoComplete.isInitialized(key)){
    		new AdvancedAutoComplete(key, placeHolder, type, treeId, value);
    	}    	
    };
    /**
     * datasource change handler based on the given type
     * @param dropdownId
     * @param type
     * @param nearById
     */
    constructorFn.facilityDatasourceChangeHandler = function(dropdownId, type, nearById) {
        this.enableDisableShowNearBy(dropdownId, type, nearById);
        AdvancedAutoComplete.changeDatasource(dropdownId, type);
    };

    /**
     * To enable or disable the show nearBy
     * @param dropdownId
     * @param type
     * @param nearById
     */
    constructorFn.enableDisableShowNearBy = function(dropdownId, type, nearById) {
        switch (type) {
        case sqwConstants.SCHEDULE:
        case 'location':
            $("#" + nearById).attr("disabled", false);
            break;
        case 'facilityGroup':
        case 'country':
        case 'region':
            $("#" + nearById).attr("checked", false);
            $("#" + nearById).attr("disabled", "disabled");
            break;
        }
    };
    
    /**
     * To get/return previous activity details
     * @returns
     */
    constructorFn.previousActivitiesDetails = function() {
        return this.tojsonString(this.getActivityDetails(sqwConstants.PREVIOUS));
    };
    
    /**
     * To get/return next activity details
     * @returns
     */
    constructorFn.nextActivitiesDetails = function() {
        return this.tojsonString(this.getActivityDetails(sqwConstants.NEXT));
    };

    /**
     * To get/return primary activity details
     * @returns
     */
    constructorFn.primaryActivitiesDetails = function() {
        return this.tojsonString(this.getActivityDetails(sqwConstants.PRIMARY));
    };

    /**
     * To get activity details based on key
     * @param key
     * @returns
     */
    constructorFn.getActivityDetails = function(key) {
        var locCd = EMPTY_STRING;
        var SM = EMPTY_STRING;
        var MM = EMPTY_STRING;
        var facilityType = EMPTY_STRING;
        var transitType = EMPTY_STRING;
        var tempActArrObj;
        var dataSetCount = this.getDatasetCount(key);
        if (dataSetCount >= 0) {
            tempActArrObj = [];
            var selectedItem = null;
            var activities;
            var locationComponentType;
            for (var i = 0; i < dataSetCount; i++) {
            	locCd = EMPTY_STRING;
                facilityType = EMPTY_STRING;
                activities = EMPTY_STRING;
                locationComponentType = AdvancedAutoComplete.getValue(key + i, 'type');
                selectedItem = AdvancedAutoComplete.getSelectedItem(key + i);
                if (selectedItem != undefined && selectedItem.item != undefined) {
                    if (selectedItem.item.locCd != undefined) {
                        locCd = selectedItem.item.locCd;
                        facilityType = EMPTY_STRING;
                    } else if (selectedItem.item.groupName != undefined) {
                        locCd = selectedItem.item.groupName;
                        facilityType = "FacGrp";
                    } else if (selectedItem.item.countryCode != undefined) {
                        locCd = selectedItem.item.countryCode;
                        facilityType = "Country";
                    }
                } else if (locationComponentType == 'region') {
                    locCd = AdvancedAutoComplete.getSelectedNodeIds(key + "treeview" + i);;
                    facilityType = "Zone";
                }
                day = $("#" + key + sqwConstants.DAY_CAL + i).attr("selectedPlanDays");
                activity = AdvancedMultiSelectComponent.getSelectedItems(key + "Activity" + i);
                transits = AdvancedMultiSelectComponent.getSelectedItems(key + "Transit" + i);
                if (activity != undefined && activity != "" && activity.indexOf(",") > 0) {
                    activities = activity.split(",");
                    for (var j = 0; j < activities.length; j++) {
                        if (activities[i] != undefined || activities[i] != "") {
                            // tempActArrObj.push(this.getActivity(locCd, activities[j], day, transits, transitType, facilityType, SM, MM));
                            this.splitByRegions(key, tempActArrObj, locCd, activities[j], day, "", transits, transitType, facilityType, SM, MM, locationComponentType);
                        }
                    }
                } else if (activity != undefined && activity != "" && activity.indexOf(",") == -1) {
                    //tempActArrObj.push(this.getActivity(locCd, activity, day, transits, transitType, facilityType, SM, MM));
                    this.splitByRegions(key, tempActArrObj, locCd, activity, day, "", transits, transitType, facilityType, SM, MM, locationComponentType);
                } else {
/*if (sqwConstants.PRIMARY == key && !(activity != "" || activity != undefined)) {
                        //tempActArrObj.push(this.getActivity(locCd, activity, day, transits, transitType, facilityType, SM, MM));
                        this.splitByRegions(key, tempActArrObj, locCd, activity, day, "", transits, transitType, facilityType, SM, MM);
                    } else if (sqwConstants.PRIMARY != key) {
                        //tempActArrObj.push(this.getActivity(locCd, activity, day, transits, transitType, facilityType, SM, MM));
                        this.splitByRegions(key, tempActArrObj, locCd, activity, day, "", transits, transitType, facilityType, SM, MM);
                    }*/
                    this.splitByRegions(key, tempActArrObj, locCd, activity, day, "", transits, transitType, facilityType, SM, MM, locationComponentType);
                }
            }
          
            delete locCd, dataSetCount, selectedItem, MM, SM, transitType, facilityType;
            return tempActArrObj;
        }
    };

    /**
     * builds the activity object based on the given details.
     * @param locCd
     * @param activity
     * @param day
     * @param dayDivText
     * @param transits
     * @param transitType
     * @param facilityType
     * @param SM
     * @param MM
     * @returns activity json object
     */
    constructorFn.getActivity = function(locCd, activity, day, dayDivText, transits, transitType, facilityType, SM, MM) {

        var tempJsonObj = {};
        tempJsonObj.isFilter = false;
        tempJsonObj.Location = locCd;
        tempJsonObj.Activity = activity;
        tempJsonObj.Day = day;
        tempJsonObj.DayDivText = dayDivText;
        tempJsonObj.Transits = transits;
        tempJsonObj.transitType = transitType;
        tempJsonObj.facilityType = facilityType;
        tempJsonObj.SM = SM;
        tempJsonObj.MM = MM;
        return tempJsonObj;
    };
    /**
     * gives the empty datset id based on the given key and within the given dataset count.
     * @param key dataset key
     * @param dataSetCount
     * @returns id of the empty dataset
     */
    constructorFn.getEmptyDatasetId = function(key, dataSetCount) {
        var locCd;
        var type;
        if (dataSetCount != undefined && dataSetCount >= 0 && key != undefined) {
            for (var i = 0; i < dataSetCount; i++) {
                locCd = $("#" + key + i).val();
                type = AdvancedAutoComplete.getValue(key + i, "type");
                day = $("#" + key + sqwConstants.DAY_CAL + i).attr("selectedPlanDays");
                if ((locCd == undefined || locCd == EMPTY_STRING) && (day == undefined || day == EMPTY_STRING) && (type === "location" || type === sqwConstants.SCHEDULE)) {
                    return i;
                }
            }
        }
        delete dataSetCount;
        return EMPTY_STRING;
    };

    /**
     * This will create a Multi select component
     * @param divId
     * @param componentName
     * @param type
     * @param selectedTextDivId
     * @param placeholder
     */
    constructorFn.createMultiSelectComponent = function(divId, componentName, type, selectedTextDivId, placeholder) {
        new AdvancedMultiSelectComponent(divId, componentName, type, selectedTextDivId, placeholder, undefined, undefined, function() {
            Slider.moveSearchButton('vSlider-arrow');
        });
    };
    /**
     * method to get the lane status
     * @returns
     */
    constructorFn.getLaneStatusObj = function() {
        var rtObject = getLaneStatusTypes();
        var selectedValue = $('input[name=ntwConnectivityCapacityOption]:radio:checked').val();
        for (var i = 0; i < rtObject.length; i++) {
            if (rtObject[i].label == selectedValue) {
                return rtObject[i];
            }
        }
        return null;
    };

    /**
     * Builds the query map, to be used in to create network map query
     * @returns query params map
     */
    constructorFn.createNetworkQueryMap = function() {
        //flag that is used to indicate whether its an full routing or lane level query
        isFullRoutingQuery = this.isFullRoutingQuery();
        // Network Filter Variables
        var pathType = this.getPathType();
        var laneStatusCmbDataText = this.tojsonString(this.getLaneStatusObj(), replacer);
        var preActivityText = this.previousActivitiesDetails();
        var priActivityText = this.primaryActivitiesDetails();
        var nxtActivityText = this.nextActivitiesDetails();
        var productResult = null;
        if (AdvancedMultiSelectComponent.getSelectedItems("products") != EMPTY_STRING) {
            productResult = (AdvancedMultiSelectComponent.getSelectedItems("products").split(",")).map(function(x) {
                return parseInt(x, 10);
            });
        }

        var priProductText = JSON.stringify(productResult, replacer).replace('[]', '');
        var priProductGpText = EMPTY_STRING;
        if (AdvancedMultiSelectComponent.getSelectedItems("productGroups") != EMPTY_STRING) {
            priProductGpText = JSON.stringify((AdvancedMultiSelectComponent.getSelectedItems("productGroups")).split(","), replacer).replace('[]', '');
        }
        var routingTypesCmbDataText = this.tojsonString(this.getRoutingTypesData(), replacer);

        return paramsMap = {
            "browserSessionId": parent.getBrowserSessionId(),
            "commonCaseId": parent.getCommonCaseId(),
            "planWeek": parent.getSelectedPlanWeek(),
            "effDayPatternStr": parent.getSelectedEffDayStrPattern(),
            "laneStatusCmbDatastr": laneStatusCmbDataText,
            "pathType": pathType,
            "dataType": parent.DATA_TYPE_NETWORK,
            "preActivitystr": preActivityText,
            "priActivitystr": priActivityText,
            "priProductstr": priProductText,
            "priProductGpstr": priProductGpText,
            "previousDirectChkValstr": false,
            "nextDirectChkValstr": false,
            "notPreviousChkValstr": false,
            "notNextChkValstr": false,
            "routingTypesCmbDatastr": routingTypesCmbDataText,
            "nxtActivitystr": nxtActivityText,
            "preFacCodestr": undefined,
            "priFacCodestr": undefined,
            "nxtFacCodestr": undefined,
            "localZuluFlag": "L",
            "isAddToResults": $("#addNetworkResultsToDisplay").is(":checked"),
            "dataType": parent.DATA_TYPE_NETWORK,
            "isSimpleQuery": true,
            "rand": getTime()
        };
    };

    /**
     * To get schedule location details for the given dataset
     * @param key dataset key
     * @returns
     */
    constructorFn.getScheduleLocationDetails = function(key) {
        var locCd = EMPTY_STRING;
        var SM = EMPTY_STRING;
        var MM = EMPTY_STRING;
        var facilityType = "LocCd";
        var transitType = EMPTY_STRING;
        var tempActArrObj;
        var dataSetCount = this.getDatasetCount(key);
        if (dataSetCount >= 0) {
            tempActArrObj = [];
            var selectedItem = null;
            var activities;
            var locationComponentType;
            for (var i = 0; i < dataSetCount; i++) {
            	 locCd = EMPTY_STRING;
                 SM = EMPTY_STRING;
                 MM = EMPTY_STRING;
                 facilityType = "LocCd";
                 transitType = EMPTY_STRING;
                locationComponentType = AdvancedAutoComplete.getValue(key + i, 'type');
                selectedItem = AdvancedAutoComplete.getSelectedItem(key + i);
                if (selectedItem != undefined && selectedItem.item != undefined) {
                    if (selectedItem.item.locCd != undefined) {
                        locCd = selectedItem.item.locCd;
                        facilityType = "LocCd";
                    } else if (selectedItem.item.groupName != undefined) {
                        locCd = selectedItem.item.groupName;
                        facilityType = "FacGrp";
                    } else if (selectedItem.item.countryCode != undefined) {
                        locCd = selectedItem.item.countryCode;
                        facilityType = "Country";
                    }
                } else if (locationComponentType == 'region') {
                    locCd = AdvancedAutoComplete.getSelectedNodeIds(key + "treeview" + i);;
                    facilityType = "Zone";
                }

                var regionCds;
                var zoneCds;
                if (locCd != undefined && locCd != "" && (locCd.indexOf(",") >= 0 || locCd.indexOf("-") >= 0) && locationComponentType == 'region') {
                    regionCds = locCd.split(",");
                    for (var r = 0; r < regionCds.length; r++) {
                        zoneCds = regionCds[r].split("-");
                        tempActArrObj.push({
                            name: facilityType,
                            value: zoneCds[0] + "," + zoneCds[1]
                        });
                    }
                } else if (locCd != undefined && locCd != "") {
                    tempActArrObj.push({
                        name: facilityType,
                        value: locCd
                    });
                }



            }
            delete locCd, dataSetCount, selectedItem, MM, SM, transitType, facilityType;
            return tempActArrObj;
        }
    };

    /**
     * builds the Schedule query params map
     * @returns schedule query params
     */
    constructorFn.createScheduleQueryMap = function() {
        // Schedule Filter Variables
        var showResultsDivText = $("#showByRoute").is(":checked") == true ? "byRoute" : "byLeg"; //need to rectify this new design dont have the checkboxes
        var originsText = this.tojsonString(this.getScheduleLocationDetails(sqwConstants.ORIGIN)); //EMPTY_STRING;//JSON.stringify(schedulerWinsMap["origins"], replacer).replace('[]','');//get origins 
        var destinationText = this.tojsonString(this.getScheduleLocationDetails(sqwConstants.DESTINATION)); //JSON.stringify(schedulerWinsMap["destination"], replacer).replace('[]','');//get destinations 
        var orgNDesParing = {};
        orgNDesParing["isPaired"] = $("#isPaired").is(":checked");
        orgNDesParing["isDirect"] = $("#isDirect").is(":checked");
        orgNDesParing["isByAirport"] = $("#isByAirport").is(":checked");
        var depArrTimeWin = {};
        depArrTimeWin["type"] = $("#departsCmb")[0].value;
        depArrTimeWin["betweenTime"] = $("#betweenTime").val().replace(":", EMPTY_STRING).replace("hhmm", EMPTY_STRING);
        depArrTimeWin["andTime"] = $("#andTime").val().replace(":", EMPTY_STRING).replace("hhmm", EMPTY_STRING);
        depArrTimeWin["onDays"] = ($("#scheduleDays").attr("selectedPlanDays")).replace(/\s{1,}/g, ',');
        var typesWin = {};
        typesWin["laneHaul"] = $("#laneHaulChk").is(":checked");
        typesWin["shuttle"] = $("#stuttleChk").is(":checked");
        typesWin["fx"] = $("#fxChk").is(":checked");
        typesWin["contract"] = $("#contractChk").is(":checked");
        typesWin["others"] = $("#othersChk").is(":checked");
        typesWin["flightLeg"] = AdvancedMultiSelectComponent.getSelectedItems("flylegtypeSearch");
        typesWin["truckLeg"] = AdvancedMultiSelectComponent.getSelectedItems("trucklegtypeSearch");
        typesWin["flightEquipment"] = AdvancedMultiSelectComponent.getSelectedItems("flightEquipments");
        typesWin["truckEquipment"] = AdvancedMultiSelectComponent.getSelectedItems("truckEquipment");
        typesWin["otherLeg"] = EMPTY_STRING; //need to rectify this new design dont have the component
        serviceUrl = SERVICE_DATA_URL + "ScheduleRequest";
        successCallBackFn = onScheduleQuerySuccess;
        return paramsMap = {
            "browserSessionId": parent.getBrowserSessionId(),
            "commonCaseId": parent.getCommonCaseId(),
            "scheduleId": parent.getScheduleId(),
            "planWeek": parent.getSelectedPlanWeek(),
            "effDayPatternStr": parent.getSelectedEffDayStrPattern(),
            "showResultsDivstr": showResultsDivText,
            "enterRouteWinstr": JSON.stringify(($("#enterRoute").val()).replace(/\s{1,}/g, ','), replacer),
            "originsstr": originsText,
            "operatorstr": $("#operatorCmb0").val(),
            "destinationstr": destinationText,
            "orgNDesParingstr": JSON.stringify(orgNDesParing, replacer),
            "depArrTimeWinstr": JSON.stringify(depArrTimeWin, replacer),
            "typesWinstr": JSON.stringify(typesWin, replacer),
            "modesWinstr": JSON.stringify(this.getScheduleSearchModes(), replacer),
            "localZuluFlag": getLocalZuluFlag(),
            "isAddToResults": $("#addScheduleResultsToDisplay").is(":checked"),
            "dataType": parent.DATA_TYPE_SCHEDULE
        };
    };

    /**
     * To get serch modes object for Schedule tab
     * @returns {___anonymous43741_43742}
     */
    constructorFn.getScheduleSearchModes = function() {
        var modesWin = {};
        if ($("#scheduleModeFlyChk").is(":checked")) {
            if ($("#scheduleModeFlyCombo")[0].value == "All") {
                modesWin["flightTrunk"] = true;
                modesWin["flightFeeder"] = true;
            } else if ($("#scheduleModeFlyCombo")[0].value == "Trunk") {
                modesWin["flightTrunk"] = true;
                modesWin["flightFeeder"] = false;
            } else if ($("#scheduleModeFlyCombo")[0].value == "Feeder") {
                modesWin["flightTrunk"] = false;
                modesWin["flightFeeder"] = true;
            }
        } else {
            modesWin["flightTrunk"] = false;
            modesWin["flightFeeder"] = false;
        }
        if ($("#scheduleModeTruckChk").is(":checked")) {
            if ($("#scheduleModeTruckCombo")[0].value == "All") {
                modesWin["truckStandard"] = true;
                modesWin["truckOversize"] = true;
            } else if ($("#scheduleModeTruckCombo")[0].value == "Standard") {
                modesWin["truckStandard"] = true;
                modesWin["truckOversize"] = false;
            } else if ($("#scheduleModeTruckCombo")[0].value == "Oversize") {
                modesWin["truckStandard"] = false;
                modesWin["truckOversize"] = true;
            }
        } else {
            modesWin["truckStandard"] = false;
            modesWin["truckOversize"] = false;
        }
        modesWin["shipOversize"] = true; //need conformation
        modesWin["railOversize"] = true; //need conformation
        return modesWin;
    };

    /**
     * To be used in to get schedule filter mode object
     * @returns {___anonymous45535_45536}
     */
    constructorFn.getScheduleFilterModes = function() {
        var modesWin = {};
        if ($("#scheduleFlightChk").is(":checked")) {
            if ($("#scheduleFlightCombo :selected").text() == "All") {
                modesWin["flightTrunk"] = true;
                modesWin["flightFeeder"] = true;
            } else if ($("#scheduleFlightCombo :selected").text() == "Trunk") {
                modesWin["flightTrunk"] = true;
                modesWin["flightFeeder"] = false;
            } else if ($("#scheduleFlightCombo :selected").text() == "Feeder") {
                modesWin["flightTrunk"] = false;
                modesWin["flightFeeder"] = true;
            }
        }

        if ($("#scheduleTruckChk").is(":checked")) {
            if ($("#scheduleFilterModeTruckCombo  :selected").text() == "All") {
                modesWin["truckStandard"] = true;
                modesWin["truckOversize"] = true;
            } else if ($("#scheduleFilterModeTruckCombo  :selected").text() == "Standard") {
                modesWin["truckStandard"] = true;
                modesWin["truckOversize"] = false;
            } else if ($("#scheduleFilterModeTruckCombo  :selected").text() == "Oversize") {
                modesWin["truckStandard"] = false;
                modesWin["truckOversize"] = true;
            }
        }
        modesWin["shipOversize"] = true; //need conformation
        modesWin["railOversize"] = true; //need conformation
        return modesWin;
    };

    /**
     * To check whether its a full routing or not
     * @returns
     */
    constructorFn.isFullRoutingQuery = function() {
        return $("#ntwFullRoutingQueryRadio").is(":checked");
    };

    /**
     * gives the path type
     * @returns
     */
    constructorFn.getPathType = function() {
        return $('input[name=networkSearchQueryType]:radio:checked').val();
    };

    /**
     * To be used in to get routing type data for network tab
     * @returns {___anonymous47507_48414}
     */
    constructorFn.getRoutingTypesData = function() {
        return {
            "routingNotHAR": isFullRoutingQuery == true ? ($('#ntwFullRountingAtRampChk').is(":checked") && $('#ntwAtRampRoutingNotHoldRadio').is(":checked")) : isFullRoutingQuery,
            "routingSingleSort": isFullRoutingQuery == true ? $('#ntwFullRountingSingleChk').is(":checked") : isFullRoutingQuery,
            "routingHAR": isFullRoutingQuery == true ? ($('#ntwFullRountingAtRampChk').is(":checked") && $('#ntwAtRampRoutingHoldRadio').is(":checked")) : $('#ntwLaneRountingHoldChk').is(":checked"),
            "notNextMultiSort": isFullRoutingQuery == true ? $('#ntwFullRountingMultiChk').is(":checked") : isFullRoutingQuery,
            "routingPTP": isFullRoutingQuery == true ? $('#ntwFullRountingPointChk').is(":checked") : isFullRoutingQuery,
            "routingCustomSort": isFullRoutingQuery == true ? $('#ntwFullRountingCustomChk').is(":checked") : isFullRoutingQuery
        };
    };

    /**
     * stringifies given object.
     * @param object
     * @param replacer
     * @returns
     */
    constructorFn.tojsonString = function(object, replacer) {
        if (object != undefined) {
            return JSON.stringify(object, replacer);
        }
    };

    /**
     * removes the auto complete for the given object.
     * @param closeObject
     */
    constructorFn.removeNode = function(closeObject) {
        var targetNodeId;
        var targetNode;
        if (closeObject != undefined) {
            SQW.destroy(closeObject);
            targetNodeId = $(closeObject).attr("datasetType") + "Table" + $(closeObject).attr("regExpId");
            targetNode = $("#" + targetNodeId);
            if (targetNode.length > 0 && targetNode.parent().parent().children().length > 1) {
                targetNode.remove();
            }
        }
    };

    /**
     * destroys the auto complete for the given object.
     * @param closeObject
     */
    constructorFn.destroy = function(closeObject) {
        var regExpId;
        var datasetType;
        if (closeObject != undefined) {
            regExpId = $(closeObject).attr("regExpId");
            datasetType = $(closeObject).attr("datasetType");
            AdvancedAutoComplete.destroy(datasetType + regExpId);
        }
    };
	/**
	 * To clear the dataset for the givne key
	 * @param key
	 */
    constructorFn.clearDatasets = function(key) {
        var dataSetCount = this.getDatasetCount(key);
        if (dataSetCount >= 0) {
            for (var i = 0; i < dataSetCount; i++) {
                this.clearDataset(key, i);
            }
        }
    };
	/**
	 * To clear the dataset for top search panel
	 */
    constructorFn.clearAllDatasets = function() {
        if (isNetworkQuery) {
            this.clearDatasets(sqwConstants.PREVIOUS);
            this.clearDatasets(sqwConstants.PRIMARY);
            this.clearDatasets(sqwConstants.NEXT);
            this.primaryDatasetCount = 1;
            this.previousDatasetCount = 1;
            this.nextDatasetCount = 1;
        } else {
            this.clearDatasets(sqwConstants.ORIGIN);
            this.clearDatasets(sqwConstants.DESTINATION);
            this.originDatasetCount = 1;
            this.destinationDatasetCount = 1;
            $("#scheduleDatasets").empty();
        }
        this.addFirstLocations(1, true);
    };
    /**
     * method is used to reset the highlight placemark
     */
    constructorFn.resetPlacemarkHighlight = function(){
    	var locationCode;
    	$.each([sqwConstants.PREVIOUS, sqwConstants.PRIMARY, sqwConstants.NEXT], function(key, value) {
            for (var index = 0; index < SQW.getDatasetCount(value); index++) {
                locationCode = AdvancedAutoComplete.getSelectedItem(value + index);
                if(locationCode != undefined && locationCode.item != undefined)
                	setPlacemarkHighlight(false, locationCode.item.locCd);
            }
        });
    	
    };
    
    /**
     * This will reset all the data to default on click of clear favorite
     */
    constructorFn.resetAllData = function(resetFilterSettings, applyDefaultFavoriteFlag) {
    	commonViewer.pointerClickHandler();
        if (isNetworkQuery) {
        	if (resetFilterSettings) {
        		this.resetNetworkFilterData();
        	}
            this.resetPlacemarkHighlight();
            if (isScheduleForNetworkFlag) this.resetScheduleFilterData();
            /*for(var i = 0; i < this.primaryDatasetCount;i++){
    			 AdvancedMultiSelectComponent.destroy(sqwConstants.PREVIOUS + "Activity" + i);
    			 AdvancedMultiSelectComponent.destroy(sqwConstants.PRIMARY + "Activity" + i);
    			 AdvancedMultiSelectComponent.destroy(sqwConstants.NEXT + "Activity" + i);
    		}*/
            
            //multiselect component - Products
            AdvancedMultiSelectComponent.reset("products", "productSelectedTextDiv", "product");
            //multiselect component - Product Groups
            AdvancedMultiSelectComponent.reset("productGroups", "productGroupSelectedTextDiv", "productGroup");
            this.primaryDatasetCount = 1;
            this.previousDatasetCount = 1;
            this.nextDatasetCount = 1;
        } else {
        	if (resetFilterSettings) {
                this.resetScheduleFilterData();
        	}
            this.clearScheduleQueryData();
            this.originDatasetCount = 1;
            this.destinationDatasetCount = 1;
            $("#scheduleDatasets").empty();
        }
        this.addFirstLocations(1, true);
        parent.resetViewerContents();
        Slider.moveSearchButton('vSlider-arrow');
        if (applyDefaultFavoriteFlag) {
            setTimeout(function() {
            	SQW.applyDefaultFavorite();
            }, 200);
        }

    };
    
    /**
     * This will clear all the data field
     */
    constructorFn.clearAllData = function() {
        this.resetFilterData();
        this.clearAllDatasets();
        this.clearScheduleQueryData();
        //multiselect component - Products
        AdvancedMultiSelectComponent.reset("products", "productSelectedTextDiv", "product");
        //multiselect component - Product Groups
        AdvancedMultiSelectComponent.reset("productGroups", "productGroupSelectedTextDiv", "productGroup");
    };

    /**
     * clears the schedule query data
     */
    constructorFn.clearScheduleQueryData = function() {
        $("#enterRoute").val("");
        //multiselect component - Products
        AdvancedMultiSelectComponent.reset("flightEquipments", "flightsSelectedTextDiv", "flightEquipments");
        //multiselect component - Product Groups
        AdvancedMultiSelectComponent.reset("truckEquipment", "trucksSelectedTextDiv", "truckEquipment");
    };

    /**
     * resets the filter data
     */
    constructorFn.resetFilterData = function() {
        this.resetNetworkFilterData();
        this.resetScheduleFilterData();
    };

    /**
     * This will reset all the network filter data
     */
    constructorFn.resetNetworkFilterData = function() {
        // resetting network more search options
        $("#ntwLaneLevelQueryRadio").prop("checked", true);
        showHideNetworkRoutingDiv();
        $("#ntwLaneRountingHoldChk").prop("checked", false);

        $("#ntwFullRountingAtRampChk").prop("checked", true);
        $("#ntwFullRountingPointChk").prop("checked", true);
        $("#ntwFullRountingSingleChk").prop("checked", true);
        $("#ntwFullRountingMultiChk").prop("checked", true);
        $("#ntwFullRountingCustomChk").prop("checked", true);
        $("#ntwAtRampRoutingHoldRadio").prop("checked", true);
        //    connectivity and capacity status
        $("#ntwConnectivityAnyStatusRadio").prop("checked", true);

        //      resetting filter options   	
        $("#schduleFilterDirectionBothRadio").prop("checked", true);
        $("#ntwFilterDirectionBothRadio").prop("checked", true);
        commonViewerUtils.toggleDirection($("#ntwFilterDirectionBothRadio"));
        commonViewerUtils.toggleDirection($("#schduleFilterDirectionBothRadio"));
        $("#divNtwFilterOption input:checkbox").each(function() {
            if ($(this)[0].id == "differentmodeChk" || $(this)[0].id == "ntwFilterErrorConnectivityChk" || $(this)[0].id == "ntwFilterErrorCapacityChk") {
                $(this).prop("checked", false);
            } else {
                $(this).prop("checked", true);
            }
        });
        $("#divNtwFilterOption").children().find("input").prop("disabled", "disabled");
        $("#divNtwFilterOption").find('label').each(function() {
            $(this).removeClass("label_style");
            $(this).addClass("label_style_disable");
        });
    };

    /**
     * This will reset all the schedule filter data
     */
    constructorFn.resetScheduleFilterData = function() {
        //    	 resetting network more search options
        //o & D Relationship
        $("#isPaired").prop("checked", false);
        $("#isDirect").prop("checked", false);
        $("#isByAirport").prop("checked", false);
        //route
        $("#laneHaulChk").prop("checked", false);
        $("#stuttleChk").prop("checked", false);
        //carrier
        $("#fxChk").prop("checked", false);
        $("#contractChk").prop("checked", false);
        $("#othersChk").prop("checked", false);
        $("#scheduleModeFlyChk").prop("checked", true);
        $("#scheduleModeTruckChk").prop("checked", true);
        //Mode
        $("#scheduleModeFlyCombo").val("All");
        $("#scheduleModeTruckCombo").val("All");
        //leg
        AdvancedMultiSelectComponent.reset("flylegtypeSearch", "flylegtypeSearchTextDiv", "flylegtype");
        AdvancedMultiSelectComponent.reset("trucklegtypeSearch", "trucklegtypeSearchTextDiv", "trucklegtype");

        //      resetting filter options   	
        $("#cuberadio").prop("checked", true);
        $("#divSchduleFilter input:checkbox").prop("checked", false);
        $("#txtWeightPercentageLow").val("80");
        $("#txtWeightPercentageHigh").val("100");
        $("#txtCubePercentageLow").val("80");
        $("#txtCubePercentageHigh").val("100");
        $("#txtCautionLow").text = "20";
        $("#txtCautionHigh").text = "180";
        $("#lblSchdUtiWeightValue").text("80 - 100%");
        $("#lblSchdUtiCubeValue").text("80 - 100%");
        $("#scheduleFlightCombo").val("All");
        $("#scheduleFilterModeTruckCombo").val("All");

        parent.resetLegTypeData();
        parent.resetEquipmentTypeData();
        //leg
        AdvancedMultiSelectComponent.reset("networkFlyCombo", "flylegtypeFilterTextDiv", "legTypesFly");
        AdvancedMultiSelectComponent.reset("networkTruckCombo", "trucklegtypeFilterTextDiv", "legTypesTruck");
        AdvancedMultiSelectComponent.reset("scheduleFlyCombo", "scheduleflylegtypeFilterTextDiv", "legTypesFly");
        AdvancedMultiSelectComponent.reset("scheduletruckCombo", "scheduletrucklegtypeFilterTextDiv", "legTypesTruck");

        AdvancedMultiSelectComponent.reset("networkEquipmentFlyCombo", "flyEqptypeFilterTextDiv", "EquipmentTypesFly");
        AdvancedMultiSelectComponent.reset("networkEquipmentTruckCombo", "truckEqptypeFilterTextDiv", "EquipmentTypesTruck");
        AdvancedMultiSelectComponent.reset("scheduleEquipmentFlyCombo", "scheduleflyEqptypeFilterTextDiv1", "EquipmentTypesFly");
        AdvancedMultiSelectComponent.reset("scheduleEquipmenttruckCombo", "scheduletruckEqptypeFilterTextDiv1", "EquipmentTypesTruck");

        $("#departsCmb").val("Departs");
        $('#betweenTime').val("");
        $('#andTime').val("");
        $("#scheduleDays").attr("selectedPlanDays", "");
        var dayTextDivId = $("#scheduleDays").attr("ref");
        $("#" + dayTextDivId).html("");

        $("#scheduleFilterContainerDiv *").attr("disabled", "disabled");
        $("#scheduleFilterContainerDiv").find('a').each(function() {
            $(this).addClass("ui-state-disabled");
        });
        $("#scheduleFilterContainerDiv").find('label').each(function() {
            $(this).removeClass("label_style");
            $(this).addClass("label_style_disable");
        });
    };

    /**
     * This will clear all the dataset 
     */
    constructorFn.clearDataset = function(key, regExpId) {
        if (key != undefined && regExpId != undefined) {
            AdvancedAutoComplete.setFacilityType(key + regExpId, "", 'location');
            //autocomplete
            AdvancedAutoComplete.setSelectedItem(key + regExpId, "");
            //show near by
            $("#" + key + "NearBy" + regExpId).attr("checked", false);
            if(key != sqwConstants.ORIGIN && key != sqwConstants.DESTINATION){
            	//day component clear
                $("#" + key + sqwConstants.DAY_CAL + regExpId).attr("selectedPlanDays", "");
                $("#" + key + "DayText" + regExpId).empty();
                //multiselect component - Activity
                AdvancedMultiSelectComponent.reset(key + "Activity" + regExpId, key + "ActivitySelectedTextDiv" + regExpId, "activity");
                //multiselect component - Transits
                AdvancedMultiSelectComponent.reset(key + "Transit" + regExpId, key + "TransitSelectedTextDiv" + regExpId, "location");
            }            
        }
    };

    /**
     * This is used to refresh the multi select component data sources
     */
    constructorFn.refreshDatasources = function() {
        //Refreshing the Location/Product/Product Group components
        AdvancedMultiSelectComponent.reset(sqwConstants.PRIMARY + "Activity" + "0", sqwConstants.PRIMARY + "ActivitySelectedTextDiv" + "0", "activity", "", "");
        AdvancedMultiSelectComponent.reset(sqwConstants.PREVIOUS + "Activity" + "0", sqwConstants.PREVIOUS + "ActivitySelectedTextDiv" + "0", "activity", "", "");
        AdvancedMultiSelectComponent.reset(sqwConstants.PREVIOUS + "Transit" + "0", sqwConstants.PREVIOUS + "TransitSelectedTextDiv" + "0", "location");
        AdvancedMultiSelectComponent.reset(sqwConstants.NEXT + "Activity" + "0", sqwConstants.NEXT + "ActivitySelectedTextDiv" + "0", "activity", "", "");
        AdvancedMultiSelectComponent.reset(sqwConstants.NEXT + "Transit" + "0", sqwConstants.NEXT + "TransitSelectedTextDiv" + "0", "location");
        AdvancedMultiSelectComponent.reset("products", "productSelectedTextDiv", "product");
        AdvancedMultiSelectComponent.reset("productGroups", "productGroupSelectedTextDiv", "productGroup");

        AdvancedMultiSelectComponent.reset("flylegtypeSearch", "flylegtypeSearchTextDiv", "flylegtype");
        AdvancedMultiSelectComponent.reset("trucklegtypeSearch", "trucklegtypeSearchTextDiv", "trucklegtype");
        AdvancedMultiSelectComponent.reset("flightEquipments", "flightsSelectedTextDiv", "flightEquipments");
        AdvancedMultiSelectComponent.reset("truckEquipment", "trucksSelectedTextDiv", "truckEquipment");
        AdvancedMultiSelectComponent.reset("flyeqptypeFilter", "flyeqptypeFilterTextDiv", "flightEquipments");
        AdvancedMultiSelectComponent.reset("truckeqptypeFilter", "truckeqptypeFilterTextDiv", "truckEquipment");

        AdvancedMultiSelectComponent.refreshDatasource(sqwConstants.PRIMARY + "treeview0", "regions");
        AdvancedMultiSelectComponent.refreshDatasource(sqwConstants.PREVIOUS + "treeview0", "regions");
        AdvancedMultiSelectComponent.refreshDatasource(sqwConstants.NEXT + "treeview0", "regions");
        AdvancedMultiSelectComponent.refreshDatasource(sqwConstants.ORIGIN + "treeview0", "regions");
        AdvancedMultiSelectComponent.refreshDatasource(sqwConstants.DESTINATION + "treeview0", "regions");

        //AdvancedAutoComplete.setTreeDatasources([sqwConstants.PRIMARY + "treeview0", sqwConstants.PREVIOUS + "treeview0", sqwConstants.NEXT + "treeview0"]);
        this.iscachedAllDatasources = true;
    };

    /**
     * method to set the selected days component
     */
    constructorFn.setSelectedDays = function(lastClickedCalBtn, responseObj, keyObject) {
        var dayTextDivId;
        var dateString;
        var selectedDaysString;
        if (responseObj) {
            dayTextDivId = $(lastClickedCalBtn).attr("ref");

            if (dayTextDivId != undefined) {
                if (responseObj.dateString != undefined && responseObj.dateString.length > 25) {
                    dateString = responseObj.dateString.substring(0, 20) + "...";
                } else {
                    dateString = responseObj.dateString;
                }
                if (responseObj.selectedDays != undefined && responseObj.selectedDays.length > 25) {
                    selectedDaysString = responseObj.selectedDays.substring(0, 20) + "...";
                } else {
                    selectedDaysString = responseObj.selectedDays;
                }
                $("#" + dayTextDivId).html(selectedDaysString + '<br/>' + dateString);
                $(lastClickedCalBtn).attr("selectedPlanDays", responseObj.selectedPlanDays);
                var divId = $(lastClickedCalBtn).attr("locationInputId");
                var jQueryObject = $("#" + divId);
                var activityId = $(lastClickedCalBtn).attr("activityCompId");
                var activityTextId = $(lastClickedCalBtn).attr("activityTextId");
                $("#" + activityTextId).empty();
                //logic for loading the activity with location cd
                SQW.refreshActivityDatasource(jQueryObject.attr("datasetType"), AdvancedAutoComplete.getLocCd(divId), jQueryObject.attr("regExpId"), responseObj.selectedPlanDays, AdvancedAutoComplete.getValue(divId, 'type'));
            }
        }
    };
    /**
     * method to open the day control multi select component
     * @param btn
     * @param singleDaySelection
     */
    constructorFn.openDayControl = function(btn, singleDaySelection) {
        var selectedCase = parent.getSelectedCase();
        if (selectedCase) {
            var startDate = new Date(changeCaseDateFormat(selectedCase.planPerStartDtml));
            var endDate = new Date(changeCaseDateFormat(selectedCase.planPerEndDtml));
            var daysSelectable = '0-' + getTotalDays(startDate, endDate);
            showDayControl(singleDaySelection, $(btn).attr("selectedPlanDays"), btn, true, null, true, daysSelectable, parent.getSelectedCase(), null, true, undefined, undefined, this.setSelectedDays);
        }
    };
    /**
     * callback handler for day slecttions
     * @param calBtn
     * @param responseObj
     * @param keyObject
     * @returns {Boolean}
     */
    constructorFn.filterBySelectedDays = function(calBtn, responseObj, keyObject) {
        var selectedDays = responseObj.selectedPlanDays;
        if (selectedDays == EMPTY_STRING) {
            calBtn.isNoDaySelected = true;
            showErrorMsg("Please select at least one day on the calendar");
            return true;
        } else {
            showErrorMsg(EMPTY_STRING);
            calBtn.isNoDaySelected = false;
        }
        if (!(calBtn && calBtn.lastSelectedDays && calBtn.lastSelectedDays == selectedDays) && selectedDays != EMPTY_STRING) {
            if (!dashboardSelectedDays[keyObject.dataType]) {
                dashboardSelectedDays[keyObject.dataType] = {};
            }
            dashboardSelectedDays[keyObject.dataType][keyObject.dashboardId] = selectedDays;
            setDashboardDataStatus(keyObject.dashboardId, keyObject.dataType, false);
            getDashboardContentWindow(keyObject.dashboardId).onDaySelect(selectedDays, keyObject.dataType);
        }
    };

    /*public instance method privaliged at the  class level*/
    constructorFn.prototype.getContentSettings = function() {

    };
    /**
     * method to be used for opening dialog popup
     * @param divId
     * @param targetDivId
     * @param options
     */
    constructorFn.openDialog = function(divId, targetDivId, options) {
        AdvancedDialog.openDialog(divId, targetDivId, options);
    };
    /**
     * method to be used for closing dialog popup
     * @param divId
     */
    constructorFn.closeDialog = function(divId) {
        AdvancedDialog.closeDialog(divId);
    };
    /**
     * method to initialize the dialog popup and their properties 
     */
    constructorFn.initializeScheduleSearchOptions = function() {
        new AdvancedDialog("dialog", ["dialog1", "dialog3", "dialog2", "dialog4"], {
            width: 280,
            height: 150,
            position: "hrefSchdUtiColor"
        });
    };
    /**
     * location change handler for auto complte components
     * @param event
     * @param ui
     * @param divId
     */
    constructorFn.locationChangeHandler = function(event, ui, divId) {
        var checkboxId;
        var type;
        var jQueryObject = $("#" + divId);
        if (jQueryObject != undefined && jQueryObject.length > 0) {
            checkboxId = jQueryObject.attr("checkbox");
            type = jQueryObject.AdvancedAutoComplete('option', 'type');
            //logic for show near by functionality
            if ($("#" + checkboxId).is(":checked")) {
                SQW.loadShowNearByProperties(divId);
                if ($("#showNearByLocCd").val() != "" && $("#showNearByLocCd").val() != undefined) {
                    setTimeout(function() {
                        SQW.openDialog("showNearBy", "content1", {
                            position: jQueryObject.attr("dialog"),
                            datasetType: jQueryObject.attr("datasetType"),
                            targetDivId: divId,
                            type: type,
                            width: 427,
                            resizable: false
                        });
                    }, 100);

                }
            }
            var selectedPlanDays = $("#" + $("#" + divId).attr("daySelector")).attr("selectedPlanDays");
            //logic for loading the activity with location cd
            SQW.refreshActivityDatasource(jQueryObject.attr("datasetType"), AdvancedAutoComplete.getLocCd(divId), jQueryObject.attr("regExpId"), selectedPlanDays, AdvancedAutoComplete.getValue(divId, 'type'));
        }
    };
    /**
     * method to refresh the activity datasource 
     * @param key
     * @param locCd
     * @param regExpId
     * @param selectedDaysArr
     * @param facilityType
     */
    constructorFn.refreshActivityDatasource = function(key, locCd, regExpId, selectedDaysArr, facilityType) {
        if (key != undefined) {
        	var activityTypeToShow;
    		if (key == sqwConstants.PRIMARY && this.isFullRoutingQuery()
    				&& $('#ntwFullRountingAtRampChk').is(":checked") && $('#ntwAtRampRoutingNotHoldRadio').is(":checked")) {
    			activityTypeToShow = 'O'; // type value for Origin activities.
        	}
            AdvancedMultiSelectComponent.refreshDatasource(key + "Activity" + regExpId, "activity", locCd, selectedDaysArr, facilityType, activityTypeToShow);
        }
    };
    /**
     * set show near by properties on opening it.
     * @param divId
     */
    constructorFn.loadShowNearByProperties = function(divId) {
        var jQueryObject = $("#" + divId);
        var selectedItem;
        if (jQueryObject != undefined && jQueryObject.length > 0) {
            selectedItem = AdvancedAutoComplete.getSelectedItem(divId);
            if (selectedItem != undefined && selectedItem.item != undefined) {
                locCd = selectedItem.item.locCd;
                AdvancedAutoComplete.setSelectedItem("showNearByLocCd", locCd);
            }
        }
    };
    /**
     * method to get the primary locations
     * @returns
     */
    constructorFn.getPrimaryLocations = function() {
        var priLocations = EMPTY_STRING;
        var primaryGridData = JSON.parse(this.primaryActivitiesDetails());
        if (primaryGridData) {
            for (var i = 0; i < primaryGridData.length; i++) {
                if (primaryGridData[i].Location != undefined && primaryGridData[i].Location != EMPTY_STRING) {
                    priLocations += primaryGridData[i].Location + ",";
                }
            }
        }
        return priLocations;

    };
    /**
     * method to get the same as above functionality
     * @param source
     */
    constructorFn.sameasabove = function(source) {
        var regExpId = parseInt($(source).attr("regExpId"));
        var previousDatasetId = regExpId - 1;
        var datsetType = $(source).attr("datasetType");
        var valueObject;
        switch ($(source).attr("type")) {
        case 'day':
            valueObject = this.getComponentValue(datsetType, 'day', previousDatasetId);
            this.setComponentValue(datsetType, 'day', regExpId, valueObject);
            break;
        case 'activity':
            AdvancedAutoComplete.setSelectedItem(datsetType + regExpId, AdvancedAutoComplete.getLocCd(datsetType + previousDatasetId), AdvancedAutoComplete.getValue(datsetType + previousDatasetId, 'type'));
            valueObject = this.getComponentValue(datsetType, 'activity', previousDatasetId);
            this.setComponentValue(datsetType, 'activity', regExpId, valueObject);
            break;
        case 'transit':
            valueObject = this.getComponentValue(datsetType, 'transit', previousDatasetId);
            this.setComponentValue(datsetType, 'transit', regExpId, valueObject);
            break;
        }
    };
    /**
     * method to get the multi select component value
     * @param key
     * @param type
     * @param regExpId
     * @returns
     */
    constructorFn.getComponentValue = function(key, type, regExpId) {
        if (regExpId < 0) {
            return;
        }

        switch (type) {
        case 'day':
            return {
                selectedPlanDays: $("#" + key + sqwConstants.DAY_CAL + regExpId).attr("selectedPlanDays"),
                dateString: $("#" + key + "DayText" + regExpId).html()
            };
            break;
        case 'activity':
            return {
                selectedActivities: AdvancedMultiSelectComponent.getSelectedItems(key + "Activity" + regExpId),
                activityText: $("#" + key + "ActivitySelectedTextDiv" + regExpId).html()
            };
            break;
        case 'transit':
            return {
                selectedTransits: AdvancedMultiSelectComponent.getSelectedItems(key + "Transit" + regExpId),
                transitText: $("#" + key + "TransitSelectedTextDiv" + regExpId).html()
            };
            break;
        }
    };

    /**
     * method to set the multi select component value
     * @param key
     * @param type
     * @param regExpId
     * @param valueObject
     */
    constructorFn.setComponentValue = function(key, type, regExpId, valueObject) {
        if (regExpId < 0) {
            return;
        }
        switch (type) {
        case 'day':
            $("#" + key + sqwConstants.DAY_CAL + regExpId).attr("selectedPlanDays", valueObject.selectedPlanDays);
            $("#" + key + "DayText" + regExpId).html(valueObject.dateString);
            break;
        case 'activity':
            AdvancedMultiSelectComponent.setSelectedItems(key + "Activity" + regExpId, valueObject.selectedActivities.split(","));
            $("#" + key + "ActivitySelectedTextDiv" + regExpId).html(valueObject.activityText);
            break;
        case 'transit':
            AdvancedMultiSelectComponent.setSelectedItems(key + "Transit" + regExpId, valueObject.selectedTransits.split(","));
            $("#" + key + "TransitSelectedTextDiv" + regExpId).html(valueObject.transitText);
            break;
        }
    };
    /**
     * method to initialize favorite components and reterive all the favorites
     */
    constructorFn.initializeFavoriteComponents = function() {
        if (this.networkFavoriteComponent == undefined) {
            this.networkFavoriteComponent = new FavoriteComponent("SQW_Network", "networkQueryFavoritesMenu", "Query", null, EMPTY_STRING, true, true);
            if (parent.getFavoriteDataCache() != null) {
                this.networkFavoriteComponent.onInitalizeFavorite(parent.getFavoriteDataCache());
            } else {
                this.networkFavoriteComponent.retrieveAllFavorites();
            }
        }
        if (this.scheduleFavoriteComponent == undefined) {
            this.scheduleFavoriteComponent = new FavoriteComponent("SQW_Schedule", "scheduleQueryFavoritesMenu", "Query", null, EMPTY_STRING, true, true);
            if (parent.getFavoriteDataCache() != null) {
                this.scheduleFavoriteComponent.onInitalizeFavorite(parent.getFavoriteDataCache());
            } else {
                this.scheduleFavoriteComponent.retrieveAllFavorites();
            }
        }
    };
    /**
     * method to apply default favorite
     * @param initializeAll
     */
    constructorFn.applyDefaultFavorite = function(initializeAll) {
    	if (initializeAll) {
    		var currentFavoriteComponent;
    		if (isNetworkQuery) {
    			SQW.scheduleFavoriteComponent.applyDefaultFavorite();
    			currentFavoriteComponent = SQW.networkFavoriteComponent;
    		} else {
    			SQW.networkFavoriteComponent.applyDefaultFavorite();
    			currentFavoriteComponent = SQW.scheduleFavoriteComponent;
    		}
            setTimeout(function() {    
            	currentFavoriteComponent.applyDefaultFavorite();
            }, 1000);
    	} else {
    		if (isNetworkQuery && SQW.networkFavoriteComponent) {
    			SQW.networkFavoriteComponent.applyDefaultFavorite();
    		} else if (!isNetworkQuery && SQW.scheduleFavoriteComponent) {
    			SQW.scheduleFavoriteComponent.applyDefaultFavorite();
    		}
    	}
    };
    /**
     * method to add Network tab state of the query window in favorite map
     */
    constructorFn.getNetworkFavoriteSettings = function() {
        var favoriteSettings = {};
        this.addNetworkMoreSearchDetails(favoriteSettings);
        this.addNetworkDrawerSettings(favoriteSettings);
        this.addNetworkQueryMapSettings(favoriteSettings);
        this.addNetworkFilterSettings(favoriteSettings);
        return favoriteSettings;
    };

    /**
     * method to add Schedule tab state of the query window in favorite map
     */
    constructorFn.getScheduleFavoriteSettings = function() {
        var favoriteSettings = {};
        this.addScheduleMoreSearchDetails(favoriteSettings);
        this.addScheduleDrawerSettings(favoriteSettings);
        this.addScheduleQueryDetails(favoriteSettings);
        this.addScheduleFilterDetails(favoriteSettings);
        return favoriteSettings;
    };

    /**
     * method to add Schedule query tab state of the query window in favorite map
     * @param favoriteSettings
     */
    constructorFn.addScheduleQueryDetails = function(favoriteSettings) {

        favoriteSettings["scheduleFilterShowByRoute"] = $('#showByRoute').is(":checked");
        favoriteSettings["scheduleFilterShowByLeg"] = $('#showByLeg').is(":checked");

        favoriteSettings["scheduleFilterEnterRoute"] = $('#enterRoute').val();
        favoriteSettings["scheduleFilterOperatorCmb"] = $("#operatorCmb0").val();

        favoriteSettings["scheduleFilterOriginProduct"] = this.getScheduleFavoriteLocationDetails(sqwConstants.ORIGIN);
        favoriteSettings["scheduleFilterDestProduct"] = this.getScheduleFavoriteLocationDetails(sqwConstants.DESTINATION);

        favoriteSettings["scheduleFilterDepartsCmb"] = $('#departsCmb').val();
        favoriteSettings["scheduleFilterBetweenTime"] = $('#betweenTime').val();
        favoriteSettings["scheduleFilterAndTime"] = $('#andTime').val();
        favoriteSettings["scheduleFilterOnDays"] = day = $("#scheduleDays").attr("selectedPlanDays");
        var dayTextDivId = $("#scheduleDays").attr("ref");
        favoriteSettings["scheduleFilterOnDaysTxt"] = $("#" + dayTextDivId).html();

        favoriteSettings["scheduleFilterFlightEquipment"] = AdvancedMultiSelectComponent.getSelectedItems("flightEquipments");
        favoriteSettings["scheduleFilterTruckEquipment"] = AdvancedMultiSelectComponent.getSelectedItems("truckEquipment");

        favoriteSettings["scheduleFilterInclDeletedRoutes"] = $("#showDeletedChk").is(":checked");
        favoriteSettings["addScheduleResultsToDisplay"] = $('#addScheduleResultsToDisplay').is(":checked");
        favoriteSettings["addResultsToDisplay"] = $('#addScheduleResultsToDisplay').is(":checked");
    };

    /**
     * To get the schedule favorite location details
     * @param key
     * @returns
     */
    constructorFn.getScheduleFavoriteLocationDetails = function(key) {
        var locCd = EMPTY_STRING;
        var facilityType = "LocCd";
        var tempActArrObj;
        var dataSetCount = this.getDatasetCount(key);
        if (dataSetCount >= 0) {
            tempActArrObj = [];
            var selectedItem = null;
            var locationComponentType;
            for (var i = 0; i < dataSetCount; i++) {
                locationComponentType = AdvancedAutoComplete.getValue(key + i, 'type');
                selectedItem = AdvancedAutoComplete.getSelectedItem(key + i);
                if (selectedItem != undefined && selectedItem.item != undefined) {
                    if (selectedItem.item.locCd != undefined) {
                        locCd = selectedItem.item.locCd;
                        facilityType = sqwConstants.SCHEDULE;
                    } else if (selectedItem.item.groupName != undefined) {
                        locCd = selectedItem.item.groupName;
                        facilityType = "facilityGroup";
                    } else if (selectedItem.item.countryCode != undefined) {
                        locCd = selectedItem.item.countryCode;
                        facilityType = "country";
                    }
                } else if (locationComponentType == 'region') {
                    locCd = AdvancedAutoComplete.getSelectedNodeIds(key + "treeview" + i);;
                    facilityType = "region";
                }

                if (locCd != undefined && locCd != "") {
                    tempActArrObj.push({
                        name: facilityType,
                        value: locCd
                    });
                }



            }
            delete locCd, dataSetCount, selectedItem, facilityType;
            return tempActArrObj;
        }
    };

	/**
	 * method to add Schedule drawer state of the query window in favorite map
	 * @param favoriteSettings
	 */
    constructorFn.addScheduleDrawerSettings = function(favoriteSettings) {
        favoriteSettings["scheduleDisplayFav"] = parent.getScheduleTabSettingsFavorite(true);
        favoriteSettings["generalDisplayFav"] = parent.getGeneralTabSettingsFavorite();
    };

    /**
     * method to add Schedule left seacrh panel state of the query window in favorite map
     * @param favoriteSettings
     */
    constructorFn.addScheduleMoreSearchDetails = function(favoriteSettings) {

        //query window
        favoriteSettings["scheduleFilterIsPaired"] = $('#isPaired').is(":checked");
        favoriteSettings["scheduleFilterIsDirect"] = $('#isDirect').is(":checked");
        favoriteSettings["scheduleFilterIsByAirport"] = $('#isByAirport').is(":checked");
        //route
        favoriteSettings["scheduleFilterLaneHaulChk"] = $('#laneHaulChk').is(":checked");
        favoriteSettings["scheduleFilterStuttleChk"] = $('#stuttleChk').is(":checked");
        //carrier
        favoriteSettings["scheduleFilterFxChk"] = $('#fxChk').is(":checked");
        favoriteSettings["scheduleFilterContractChk"] = $('#contractChk').is(":checked");
        favoriteSettings["scheduleFilterOthersChk"] = $('#othersChk').is(":checked");

        //mode
        favoriteSettings["scheduleFlightModeChk"] = $('#scheduleModeFlyChk').is(":checked");
        favoriteSettings["scheduleTruckModeChk"] = $('#scheduleModeTruckChk').is(":checked");
        favoriteSettings["scheduleFlightModeVal"] = $("#scheduleModeFlyCombo").find('option:selected').val();
        favoriteSettings["scheduleTruckModeVal"] = $("#scheduleModeTruckCombo").find('option:selected').val();
        //leg
        favoriteSettings["scheduleFilterFlightLeg"] = AdvancedMultiSelectComponent.getSelectedItems("flylegtypeSearch");
        favoriteSettings["scheduleFilterTruckLeg"] = AdvancedMultiSelectComponent.getSelectedItems("trucklegtypeSearch");
    };
    
    constructorFn.addScheduleFilterDetails = function(favoriteSettings) {
    	
    	favoriteSettings["scheduleFilterWeightChk"] = $('#weightChk').is(":checked");
    	favoriteSettings["scheduleFilterCubeChk"] = $('#cubeChk').is(":checked");
    	favoriteSettings["scheduleFilterUtilization"] = $("#schudleUtilizationDiv :radio:checked").attr('id');
    	
    	//mode
        favoriteSettings["scheduleFilterFlightChk"] = $('#scheduleFlightChk').is(":checked");
        favoriteSettings["scheduleFilterTruckChk"] = $('#scheduleTruckChk').is(":checked");
        favoriteSettings["scheduleFilterFlightVal"] = $("#scheduleFlightCombo").find('option:selected').val();
        favoriteSettings["scheduleFilterTruckVal"] = $("#scheduleFilterModeTruckCombo").find('option:selected').val();
        
        //Legtype
        favoriteSettings["schdllegtypeFlyChk"] =  $('#schdllegtypeFlyChk').is(":checked");
        favoriteSettings["schdllegtypeTruckChk"] = $('#schdllegtypeTruckChk').is(":checked");
     
        //EquipmentType
        favoriteSettings["schdlequiptypeFlyChk"] =  $('#schdlequiptypeFlyChk').is(":checked");
        favoriteSettings["schdlequiptypeTruckChk"] = $('#schdlequiptypeTruckChk').is(":checked");
        
        favoriteSettings["lblFilterSchdUtiWeightValue"] = $('#lblSchdUtiWeightValue').text();
        favoriteSettings["lblFilterSchdUtiCubeValue"] = $('#lblSchdUtiCubeValue').text();
        favoriteSettings["txtFilterWeightPercentageLow"] = $('#txtWeightPercentageLow').val();
        favoriteSettings["txtFilterWeightPercentageHigh"] = $('#txtWeightPercentageHigh').val();
        favoriteSettings["txtFilterCubePercentageLow"] = $('#txtCubePercentageLow').val();
        favoriteSettings["txtFilterCubePercentageHigh"] = $('#txtCubePercentageHigh').val();
    
    };

    /**
     * method to add network drwaer tab state of the query window in favorite map
     * @param favoriteMap
     */
    constructorFn.addNetworkDrawerSettings = function(favoriteMap) {
        favoriteMap["networkDisplayFav"] = parent.getNetworkTabSettingsFavorite(true);
        favoriteMap["generalDisplayFav"] = parent.getGeneralTabSettingsFavorite();
    };

    /**
     * method to add Network left search panel state of the query window in favorite map
     * @param favoriteMap
     */
    constructorFn.addNetworkMoreSearchDetails = function(favoriteMap) {
        favoriteMap["routingTypeCmb"] = $("#divNetworkSearchQueryOption :radio:checked").attr('id');
        favoriteMap["laneStatusCmb"] = $("#divNetworkConnectivity :radio:checked").attr('id');
        var isFullRoutingQuery = this.isFullRoutingQuery();
        favoriteMap["routingTypesData"] = {
            "routingNotHAR": isFullRoutingQuery == true ? $('#ntwAtRampRoutingNotHoldRadio').is(":checked") : isFullRoutingQuery,
            "routingSingleSort": isFullRoutingQuery == true ? $('#ntwFullRountingSingleChk').is(":checked") : isFullRoutingQuery,
            "routingHAR": isFullRoutingQuery == true ? $('#ntwAtRampRoutingHoldRadio').is(":checked") : $('#ntwLaneRountingHoldChk').is(":checked"),
            "notNextMultiSort": isFullRoutingQuery == true ? $('#ntwFullRountingMultiChk').is(":checked") : isFullRoutingQuery,
            "routingPTP": isFullRoutingQuery == true ? $('#ntwFullRountingPointChk').is(":checked") : isFullRoutingQuery,
            "routingCustomSort": isFullRoutingQuery == true ? $('#ntwFullRountingCustomChk').is(":checked") : isFullRoutingQuery,
            "ntwFullRountingAtRampChk": $("#ntwFullRountingAtRampChk").is(":checked")
        };
    };

    /**
     * method to get the network activity details
     * @param key
     * @returns
     */
    constructorFn.getNetworkActivityDetails = function(key) {
        var locCd = EMPTY_STRING;
        var SM = EMPTY_STRING;
        var MM = EMPTY_STRING;
        var facilityType = EMPTY_STRING;
        var transitType = EMPTY_STRING;
        var tempActArrObj;
        var dataSetCount = this.getDatasetCount(key);
        if (dataSetCount >= 0) {
            tempActArrObj = [];
            var selectedItem = null;
            var activities;
            var locationComponentType;
            var regionCds;
            for (var i = 0; i < dataSetCount; i++) {
                locationComponentType = AdvancedAutoComplete.getValue(key + i, 'type');
                selectedItem = AdvancedAutoComplete.getSelectedItem(key + i);
                if (selectedItem != undefined && selectedItem.item != undefined) {
                    if (selectedItem.item.locCd != undefined) {
                        locCd = selectedItem.item.locCd;
                        facilityType = "location";
                    } else if (selectedItem.item.groupName != undefined) {
                        locCd = selectedItem.item.groupName;
                        facilityType = "facilityGroup";
                    } else if (selectedItem.item.countryCode != undefined) {
                        locCd = selectedItem.item.countryCode;
                        facilityType = "country";
                    }
                } else if (locationComponentType == 'region') {
                    locCd = AdvancedAutoComplete.getSelectedNodeIds(key + "treeview" + i);;
                    facilityType = "region";
                }
                day = $("#" + key + sqwConstants.DAY_CAL + i).attr("selectedPlanDays");
                var dayTextDivId = $("#" + key + sqwConstants.DAY_CAL + i).attr("ref");
                var dayDivText = $("#" + dayTextDivId).html();

                activity = AdvancedMultiSelectComponent.getSelectedItems(key + "Activity" + i);
                transits = AdvancedMultiSelectComponent.getSelectedItems(key + "Transit" + i);
                tempActArrObj.push(this.getActivity(locCd, activity, day, dayDivText, transits, transitType, facilityType, SM, MM));
            }
            delete locCd, dataSetCount, selectedItem, MM, SM, transitType, facilityType;
            return tempActArrObj;
        }
    };

    /**
     * method to get the activity objects for the given regions 
     * @param key
     * @param tempActArrObj
     * @param locCd
     * @param activity
     * @param day
     * @param dayDivText
     * @param transits
     * @param transitType
     * @param facilityType
     * @param SM
     * @param MM
     * @param locationComponentType
     */
    constructorFn.splitByRegions = function(key, tempActArrObj, locCd, activity, day, dayDivText, transits, transitType, facilityType, SM, MM, locationComponentType) {
        var regionCds;
        var zoneCds;
        if (locCd != undefined && locCd != "" && (locCd.indexOf(",") >= 0 || locCd.indexOf("-") >= 0) && locationComponentType == "region") {
            regionCds = locCd.split(",");
            for (var r = 0; r < regionCds.length; r++) {
                zoneCds = regionCds[r].split("-");
                tempActArrObj.push(this.getActivity(zoneCds[0] + "," + zoneCds[1], activity, day, dayDivText, transits, transitType, facilityType, SM, MM));
            }
        } else {
            tempActArrObj.push(this.getActivity(locCd, activity, day, dayDivText, transits, transitType, facilityType, SM, MM));
        }
    };

    /**
     * method to add network query tab state of the query window in favorite map
     * @param favoriteMap
     */
    constructorFn.addNetworkQueryMapSettings = function(favoriteMap) {
        //get activities details
        favoriteMap["preActivitiesWindowDetails"] = this.tojsonString(this.getNetworkActivityDetails(sqwConstants.PREVIOUS));
        favoriteMap["primaryGridDetails"] = this.tojsonString(this.getNetworkActivityDetails(sqwConstants.PRIMARY));
        favoriteMap["nxtActivitiesWindowDetails"] = this.tojsonString(this.getNetworkActivityDetails(sqwConstants.NEXT));
        //get products detail
        if (AdvancedMultiSelectComponent.getSelectedItems("products") != EMPTY_STRING) {
            favoriteMap["priActivityP"] = JSON.stringify(AdvancedMultiSelectComponent.getSelectedItems("products").split(","), replacer);
        }
        //get products group detail
        var priProductGpText = EMPTY_STRING;
        if (AdvancedMultiSelectComponent.getSelectedItems("productGroups") != EMPTY_STRING) {
            priProductGpText = JSON.stringify((AdvancedMultiSelectComponent.getSelectedItems("productGroups")).split(","), replacer);
        }
        favoriteMap["priActivityGP"] = priProductGpText;
        favoriteMap["addNetworkResultsToDisplay"] = $('#addNetworkResultsToDisplay').is(":checked");
        favoriteMap["addResultsToDisplay"] = $('#addNetworkResultsToDisplay').is(":checked");
    };

    /**
     * apply network filter setting to the map viewer
     * @param favoriteMap
     * @returns
     */
    constructorFn.addNetworkFilterSettings = function(favoriteMap) {
        //var networkDisplaySettings = {};
        //networkDisplaySettings["errorTypeChk"] = $("#showerrorsChk").is(":checked");
        favoriteMap["direction"] = $("#divNtwFilterOption :radio:checked").attr('id');
        favoriteMap["errorConnectivityType"] = $("#ntwFilterErrorConnectivityChk").is(":checked");
        favoriteMap["errorCapacityType"] = $("#ntwFilterErrorCapacityChk").is(":checked");
        favoriteMap["showModesFlySuggested"] = $("#flySuggestedChk").is(":checked");
        favoriteMap["showModesFlyMandatory"] = $("#flyMandatoryChk").is(":checked");
        favoriteMap["showModesTruckSuggested"] = $("#truckSuggestedChk").is(":checked");
        favoriteMap["showModesTruckMandatory"] = $("#truckMandatoryChk").is(":checked");
        favoriteMap["showModesOtherSuggested"] = $("#otherSuggestedChk").is(":checked");
        favoriteMap["showModesOtherMandatory"] = $("#otherMandatoryChk").is(":checked");
        favoriteMap["showModesUsedDiffThnSugg"] = $("#differentmodeChk").is(":checked");

        return favoriteMap;
    };
/*constructorFn.applyScheduleFavoriteSettings = function(favoriteSettings, isApplicationLevel) {
    	this.applyScheduleMoreSearchSettings(favoriteSettings, isApplicationLevel);
    	parent.applyScheduleTabSettingsFavorite(favoriteSettings.scheduleDisplayFav,true);
    	parent.applyGeneralTabSettingsFavorite(favoriteSettings.generalDisplayFav);
    	if(!parent.isNetworkQuery) {
    		$("#scheduleHPanel")[0].style.top = "50px";
    	}
    };*/

    /**
     * apply schedule query settings to the query window
     */
    constructorFn.applyScheduleQueryDetails = function(favoriteSettings, isApplicationLevel) {
        this.clearAllDatasets();
        favoriteSettings.scheduleFilterShowByRoute == true ? $("#showByRoute").prop("checked", true) : $("#showByRoute").prop("checked", false);
        favoriteSettings.scheduleFilterShowByLeg == true ? $("#showByLeg").prop("checked", true) : $("#showByLeg").prop("checked", false);
        $("#operatorCmb0").val(favoriteSettings.scheduleFilterOperatorCmb);
        $('#enterRoute').val(favoriteSettings.scheduleFilterEnterRoute);
        $("#departsCmb").val(favoriteSettings.scheduleFilterDepartsCmb);
        $('#betweenTime').val(favoriteSettings.scheduleFilterBetweenTime);
        $('#andTime').val(favoriteSettings.scheduleFilterAndTime);
        $("#scheduleDays").attr("selectedPlanDays", favoriteSettings.scheduleFilterOnDays);
        var dayTextDivId = $("#scheduleDays").attr("ref");
        $("#" + dayTextDivId).html("");
        $("#" + dayTextDivId).html(favoriteSettings.scheduleFilterOnDaysTxt);
        this.applyScheduleQueryLocationDetails(sqwConstants.ORIGIN, favoriteSettings.scheduleFilterOriginProduct);
        this.applyScheduleQueryLocationDetails(sqwConstants.DESTINATION, favoriteSettings.scheduleFilterDestProduct);
        var flightEquip = favoriteSettings.scheduleFilterFlightEquipment;
        var truckEquip = favoriteSettings.scheduleFilterTruckEquipment;
        AdvancedMultiSelectComponent.reset("flightEquipments", "flightsSelectedTextDiv", "flightEquipments");
        AdvancedMultiSelectComponent.reset("truckEquipment", "trucksSelectedTextDiv", "truckEquipment");
        AdvancedMultiSelectComponent.setSelectedItems("flightEquipments", flightEquip.split(","), "flightsSelectedTextDiv");
        AdvancedMultiSelectComponent.setSelectedItems("truckEquipment", truckEquip.split(","), "trucksSelectedTextDiv");
        favoriteSettings.scheduleFilterInclDeletedRoutes == true ? $("#showDeletedChk").prop("checked", true) : $("#showDeletedChk").prop("checked", false);
        favoriteSettings.addResultsToDisplay == true ? $('#addScheduleResultsToDisplay').prop("checked", true) : $("#addScheduleResultsToDisplay").prop("checked", false);
    };

    /**
     * apply schedule loaction settings to the query window
     * @param key
     * @param locationFavoriteArray
     */
    constructorFn.applyScheduleQueryLocationDetails = function(key, locationFavoriteArray) {
        var dataSetCount = this.getDatasetCount(key);
        var favLocCount = 0;
        if (locationFavoriteArray && locationFavoriteArray.length > 0) {
            favLocCount = locationFavoriteArray.length;
        }
/*for (var i = 0; i < dataSetCount; i++) {
			AdvancedAutoComplete.setSelectedItem(key + i, "");
		}*/
        if (favLocCount > 0) {
            if (dataSetCount < favLocCount) {
                for (var i = 0; i < (favLocCount - dataSetCount); i++) {
                    this.addDataset(key, true);
                }
            }
            for (var i = 0; i < favLocCount; i++) {
                switch (locationFavoriteArray[i].name) {
                case "location":
                    $("#" + key + "location" + i).prop("checked", true);
                    break;
                case "facilityGroup":
                    $("#" + key + "Facility" + i).prop("checked", true);
                    break;
                case "country":
                    $("#" + key + "Country" + i).prop("checked", true);
                    break;
                case "region":
                    $("#" + key + "Region" + i).prop("checked", true);
                    break;
                default:
                    break;
                }
                AdvancedAutoComplete.setSelectedItem((key + i), locationFavoriteArray[i].value, locationFavoriteArray[i].name);
            }
        }
    };

    /**
     * To clear schedule favorite settings
     */
    constructorFn.clearScheduleFavoriteSettings = function() {
        //        this.clearAllDatasets();
         SQW.resetAllData(true, true);
    };

    /**
     * method to apply schedule favorite settings to the map viewer settings...
     * @param favoriteSettings
     * @param isApplicationLevel
     */
    constructorFn.applyScheduleFavoriteSettings = function(favoriteSettings, isApplicationLevel) {
        SQW.resetAllData(false, false);
        var scheduleFavoriteSettings = favoriteSettings;
        setTimeout(function() {
            SQW.applyScheduleMoreSearchSettings(scheduleFavoriteSettings, isApplicationLevel);
            SQW.applyScheduleQueryDetails(scheduleFavoriteSettings, isApplicationLevel);
            SQW.applyScheduleFilterSettings(scheduleFavoriteSettings, isApplicationLevel);
        }, 1000);
    };

    /**
     * apply schedule left serach panel settings to the map viewer
     * @param favoriteSettings
     * @param isApplicationLevel
     */
    constructorFn.applyScheduleMoreSearchSettings = function(favoriteSettings, isApplicationLevel) {
        //o & D Relationship
        favoriteSettings.scheduleFilterIsPaired == true ? $("#isPaired").prop("checked", true) : $("#isPaired").prop("checked", false);
        favoriteSettings.scheduleFilterIsDirect == true ? $("#isDirect").prop("checked", true) : $("#isDirect").prop("checked", false);
        favoriteSettings.scheduleFilterIsByAirport == true ? $("#isByAirport").prop("checked", true) : $("#isByAirport").prop("checked", false);
        //route
        favoriteSettings.scheduleFilterLaneHaulChk == true ? $("#laneHaulChk").prop("checked", true) : $("#laneHaulChk").prop("checked", false);
        favoriteSettings.scheduleFilterStuttleChk == true ? $("#stuttleChk").prop("checked", true) : $("#stuttleChk").prop("checked", false);
        //carrier
        favoriteSettings.scheduleFilterFxChk == true ? $("#fxChk").prop("checked", true) : $("#fxChk").prop("checked", false);
        favoriteSettings.scheduleFilterContractChk == true ? $("#contractChk").prop("checked", true) : $("#contractChk").prop("checked", false);
        favoriteSettings.scheduleFilterOthersChk == true ? $("#othersChk").prop("checked", true) : $("#othersChk").prop("checked", false);
        //Mode
        $("#scheduleModeFlyCombo").val(favoriteSettings["scheduleFlightModeVal"]);
        $("#scheduleModeTruckCombo").val(favoriteSettings["scheduleTruckModeVal"]);
        favoriteSettings.scheduleFlightModeChk == true ? $("#scheduleModeFlyChk").prop("checked", true) : $("#scheduleModeFlyChk").prop("checked", false);
        favoriteSettings.scheduleTruckModeChk == true ? $("#scheduleModeTruckChk").prop("checked", true) : $("#scheduleModeTruckChk").prop("checked", false);
        $("#scheduleModeFlyChk").is(":checked") ? $("#scheduleModeFlyCombo").prop("disabled", false) : $("#scheduleModeFlyCombo").prop("disabled", true);
        $("#scheduleModeTruckChk").is(":checked") ? $("#scheduleModeTruckCombo").prop("disabled", false) : $("#scheduleModeTruckCombo").prop("disabled", true);
        //leg
        AdvancedMultiSelectComponent.refreshDatasource("flylegtypeSearch", "flylegtype");
        AdvancedMultiSelectComponent.refreshDatasource("trucklegtypeSearch", "trucklegtype");
        AdvancedMultiSelectComponent.setSelectedItems("flylegtypeSearch", favoriteSettings.scheduleFilterFlightLeg);
        AdvancedMultiSelectComponent.setSelectedItems("trucklegtypeSearch", favoriteSettings.scheduleFilterTruckLeg);
    };
    
    constructorFn.applyScheduleFilterSettings = function(favoriteSettings, isApplicationLevel) {
    	
    	favoriteSettings.scheduleFilterWeightChk == true ? $('#weightChk').prop("checked", true) :  $('#weightChk').prop("checked", false);
    	favoriteSettings.scheduleFilterCubeChk == true ? $('#cubeChk').prop("checked", true) :  $('#cubeChk').prop("checked", false);
    	$("#" + favoriteSettings.scheduleFilterUtilization).prop("checked", true);
    	
    	favoriteSettings.scheduleFilterFlightChk == true ? $('#scheduleFlightChk').prop("checked", true) :  $('#scheduleFlightChk').prop("checked", false);
    	favoriteSettings.scheduleFilterTruckChk == true ?  $('#scheduleTruckChk').prop("checked", true) :  $('#scheduleTruckChk').prop("checked", false);
    	$("#scheduleFlightCombo").val(favoriteSettings["scheduleFilterFlightVal"]);
    	$("#scheduleFilterModeTruckCombo").val(favoriteSettings["scheduleFilterTruckVal"]);
    	
    	favoriteSettings.schdllegtypeFlyChk == true ? $('#schdllegtypeFlyChk').prop("checked", true) :  $('#schdllegtypeFlyChk').prop("checked", false);
    	favoriteSettings.schdllegtypeTruckChk == true ?  $('#schdllegtypeTruckChk').prop("checked", true) :  $('#schdllegtypeTruckChk').prop("checked", false);
    	
    	favoriteSettings.schdlequiptypeFlyChk == true ? $('#schdlequiptypeFlyChk').prop("checked", true) :  $('#schdlequiptypeFlyChk').prop("checked", false);
    	favoriteSettings.schdlequiptypeTruckChk == true ? $('#schdlequiptypeTruckChk').prop("checked", true) :  $('#schdlequiptypeTruckChk').prop("checked", false);
    	
    	$("#lblSchdUtiWeightValue").text(favoriteSettings["lblFilterSchdUtiWeightValue"]);
    	$("#lblSchdUtiCubeValue").text(favoriteSettings["lblFilterSchdUtiCubeValue"]);
    	$("#txtWeightPercentageLow").val( favoriteSettings["txtFilterWeightPercentageLow"]);
    	$("#txtWeightPercentageHigh").val(favoriteSettings["txtFilterWeightPercentageHigh"]);
    	$("#txtCubePercentageLow").val(favoriteSettings["txtFilterCubePercentageLow"]);
    	$("#txtCubePercentageHigh").val(favoriteSettings["txtFilterCubePercentageHigh"]);
    };

    /**
     * apply network tab settings to the map viewer
     * @param favoriteSettings
     * @param isApplicationLevel
     */
    constructorFn.applyNetworkFavoriteSettings = function(favoriteSettings, isApplicationLevel) {
        //        this.clearNetworkFavoriteSettings();
        SQW.resetAllData(false, false);
        var networkFavoriteSettings = favoriteSettings;
        setTimeout(function() {
            SQW.applyNetworkQueryMapSettings(networkFavoriteSettings, isApplicationLevel);
            SQW.applyMoreSearchSettings(networkFavoriteSettings, isApplicationLevel);
             SQW.applyNetworkFilterSettings(favoriteSettings, isApplicationLevel);
        }, 1000);
       
    };

    /**
     * method to clear network favorite settings
     */
    constructorFn.clearNetworkFavoriteSettings = function() {
         SQW.resetAllData(true, true);
/* this.clearAllDatasets();
        this.refreshActivityDetails();
        $("#productSelectedTextDiv").empty();
        $("#productGroupSelectedTextDiv").empty();
        $("#addNetworkResultsToDisplay").prop("checked", false);*/
    };

    /**
     * method to referesh activity details
     */
    constructorFn.refreshActivityDetails = function() {
        $.each([sqwConstants.PREVIOUS, sqwConstants.PRIMARY, sqwConstants.NEXT], function(key, value) {
            for (var index = 0; index < SQW.getDatasetCount(value); index++) {
                AdvancedMultiSelectComponent.refreshDatasource(value + "Transit" + index, "location");
            }
        });
        AdvancedMultiSelectComponent.reset("products", "productSelectedTextDiv", "product");
        //multiselect component - Product Groups
        AdvancedMultiSelectComponent.reset("productGroups", "productGroupSelectedTextDiv", "productGroup");
/* AdvancedMultiSelectComponent.refreshDatasource("products", "product"); //Refresh product component
        AdvancedMultiSelectComponent.refreshDatasource("productGroups", "productGroup"); //Refresh product group component
*/
    };

    /**
     * apply network left serach panel settings to the map viewer
     * @param favoriteSettings
     * @param isApplicationLevel
     */
    constructorFn.applyMoreSearchSettings = function(favoriteSettings, isApplicationLevel) {
        //query Type
        $("#" + favoriteSettings.routingTypeCmb).prop("checked", true);
        showHideNetworkRoutingDiv();
        if (favoriteSettings.routingTypeCmb == "ntwLaneLevelQueryRadio") {
            favoriteSettings.routingTypesData.routingHAR == true ? $("#ntwLaneRountingHoldChk").prop("checked", true) : $("#ntwLaneRountingHoldChk").prop("checked", false);
        } else {
            favoriteSettings.routingTypesData.ntwFullRountingAtRampChk == true ? $("#ntwFullRountingAtRampChk").prop("checked", true) : $("#ntwFullRountingAtRampChk").prop("checked", false);
            favoriteSettings.routingTypesData.routingNotHAR == true ? $("#ntwAtRampRoutingNotHoldRadio").prop("checked", true) : $("#ntwAtRampRoutingNotHoldRadio").prop("checked", false);
            favoriteSettings.routingTypesData.routingHAR == true ? $("#ntwAtRampRoutingHoldRadio").prop("checked", true) : $("#ntwAtRampRoutingHoldRadio").prop("checked", false);
            favoriteSettings.routingTypesData.routingPTP == true ? $("#ntwFullRountingPointChk").prop("checked", true) : $("#ntwFullRountingPointChk").prop("checked", false);
            favoriteSettings.routingTypesData.routingSingleSort == true ? $("#ntwFullRountingSingleChk").prop("checked", true) : $("#ntwFullRountingSingleChk").prop("checked", false);
            favoriteSettings.routingTypesData.notNextMultiSort == true ? $("#ntwFullRountingMultiChk").prop("checked", true) : $("#ntwFullRountingMultiChk").prop("checked", false);
            favoriteSettings.routingTypesData.routingCustomSort == true ? $("#ntwFullRountingCustomChk").prop("checked", true) : $("#ntwFullRountingCustomChk").prop("checked", false);
            this.modifyFullRoutingSearchOptions();
        }
        //connectivity and capacity status
        $("#" + favoriteSettings.laneStatusCmb).prop("checked", true);
    };
    /**
     * method to apply filter settings to the map viewer
     * @param favoriteSettings
     * @param isApplicationLevel
     */
    constructorFn.applyNetworkFilterSettings = function(favoriteSettings, isApplicationLevel) {
        //filter 
        $("#" + favoriteSettings.direction).prop("checked", true);

        favoriteSettings.errorConnectivityType == true ? $("#ntwFilterErrorConnectivityChk").prop("checked", true) : $("#ntwFilterErrorConnectivityChk").prop("checked", false);
        favoriteSettings.errorCapacityType == true ? $("#ntwFilterErrorCapacityChk").prop("checked", true) : $("#ntwFilterErrorCapacityChk").prop("checked", false);
        favoriteSettings.showModesFlySuggested == true ? $("#flySuggestedChk").prop("checked", true) : $("#flySuggestedChk").prop("checked", false);
        favoriteSettings.showModesFlyMandatory == true ? $("#flyMandatoryChk").prop("checked", true) : $("#flyMandatoryChk").prop("checked", false);
        favoriteSettings.showModesTruckSuggested == true ? $("#truckSuggestedChk").prop("checked", true) : $("#truckSuggestedChk").prop("checked", false);
        favoriteSettings.showModesTruckMandatory == true ? $("#truckMandatoryChk").prop("checked", true) : $("#truckMandatoryChk").prop("checked", false);
        favoriteSettings.showModesOtherSuggested == true ? $("#otherSuggestedChk").prop("checked", true) : $("#otherSuggestedChk").prop("checked", false);
        favoriteSettings.showModesOtherMandatory == true ? $("#otherMandatoryChk").prop("checked", true) : $("#otherMandatoryChk").prop("checked", false);
        favoriteSettings.showModesUsedDiffThnSugg == true ? $("#differentmodeChk").prop("checked", true) : $("#differentmodeChk").prop("checked", false);
    };


    /**
     * apply network query map settings to the map viewer
     * @param favoriteSettings
     * @param isApplicationLevel
     */
    constructorFn.applyNetworkQueryMapSettings = function(favoriteSettings, isApplicationLevel) {
    	if (favoriteSettings.preActivitiesWindowDetails) {
    		this.setNetworkQueryMapSettings(sqwConstants.PREVIOUS, JSON.parse(favoriteSettings.preActivitiesWindowDetails));
    	}
    	if (favoriteSettings.primaryGridDetails) {
    		this.setNetworkQueryMapSettings(sqwConstants.PRIMARY, JSON.parse(favoriteSettings.primaryGridDetails));
    	}
    	if (favoriteSettings.nxtActivitiesWindowDetails) {
    		this.setNetworkQueryMapSettings(sqwConstants.NEXT, JSON.parse(favoriteSettings.nxtActivitiesWindowDetails));
    	}
        if (favoriteSettings.priActivityP != undefined && favoriteSettings.priActivityP != "") {
            AdvancedMultiSelectComponent.setSelectedItems("products", JSON.parse(favoriteSettings.priActivityP), "productSelectedTextDiv");
        }
        if (favoriteSettings.priActivityGP != undefined && favoriteSettings.priActivityGP != "") {
            AdvancedMultiSelectComponent.setSelectedItems("productGroups", JSON.parse(favoriteSettings.priActivityGP), "productGroupSelectedTextDiv");
        }
        favoriteSettings.addResultsToDisplay == true ? $('#addNetworkResultsToDisplay').prop("checked", true) : $("#addNetworkResultsToDisplay").prop("checked", false);

        //$("#rowId input:checkbox")[0].checked=true;
    };

    /**
     * apply network query map settings to the map viewer
     * @param key
     * @param activityObject
     */
    constructorFn.setNetworkQueryMapSettings = function(key, activityObject) {
        var count = activityObject.length - 1;
        if (count > 0 && this.getDatasetCount(key) <= count) this.addMoreLocations(count, key);
        $.each(activityObject, function(index, valueObject) {
            switch (valueObject.facilityType) {
            case "location":
                $("#" + key + "location" + index).prop("checked", true);
                AdvancedAutoComplete.setSelectedItem(key + index, valueObject.Location, valueObject.facilityType);
                break;
            case "facilityGroup":
                $("#" + key + "Facility" + index).prop("checked", true);
                AdvancedAutoComplete.setSelectedItem(key + index, valueObject.Location, valueObject.facilityType);
                break;
            case "country":
                $("#" + key + "Country" + index).prop("checked", true);
                AdvancedAutoComplete.setSelectedItem(key + index, valueObject.Location, valueObject.facilityType);
                break;
            case "region":
                $("#" + key + "Region" + index).prop("checked", true);
                SQW.facilityDatasourceChangeHandler(key + index, 'region', key + 'NearBy' + index);
                AdvancedMultiSelectComponent.setSelectedItems(key + "treeview" + index, valueObject.Location != undefined ? valueObject.Location.split(",") : undefined);
                break;
            default:
                break;
            }

            $("#" + key + sqwConstants.DAY_CAL + index).attr("selectedPlanDays", valueObject.Day);
            var dayTextDivId = $("#" + key + sqwConstants.DAY_CAL + index).attr("ref");
            $("#" + dayTextDivId).html(valueObject.DayDivText);
            $("#" + key + "ActivitySelectedTextDiv" + index).html("");
            $("#" + key + "TransitSelectedTextDiv" + index).html("");
            AdvancedMultiSelectComponent.setSelectedItems(key + "Activity" + index, valueObject.Activity.split(","), key + "ActivitySelectedTextDiv" + index);
            AdvancedMultiSelectComponent.setSelectedItems(key + "Transit" + index, valueObject.Transits.split(","), key + "TransitSelectedTextDiv" + index);

        });
    };
    /**
     * this method will set up the window layout of the map viewer
     * @param dashboardId
     * @param favoriteDetails
     */
    constructorFn.setWindowLayoutDetails = function(dashboardId, favoriteDetails) {
        if (dashboardId == "applicationFav") {
            SQWApplicationFavorite.applyContentFavoriteSettings(favoriteDetails);
        } else if (dashboardId == "networkQueryFav") {
            SQWNetworkFavorite.applyContentFavoriteSettings(favoriteDetails);;
        } else {
            SQWScheduleFavorite.applyContentFavoriteSettings(favoriteDetails);;
        }
    };
	
    /**
     * modifies the full routing search options based on the route types selections dynamically.
     * @param selectAllFullRoutingTypes
     */
    constructorFn.modifyFullRoutingSearchOptions = function(selectAllFullRoutingTypes){
        if (this.isFullRoutingQuery()) {
        	var oldSelectionHAR = $("#ntwAtRampRoutingHoldRadio").is(":checked");
        	if ($('#ntwFullRountingAtRampChk').is(":checked")) {
        		$("#ntwAtRampRoutingHoldRadio, #ntwAtRampRoutingNotHoldRadio").removeAttr("disabled");
        	} else {
        		$("#ntwAtRampRoutingHoldRadio").prop("checked", true);
        		// $("#ntwAtRampRoutingNotHoldRadio").prop("checked", false);
        		$("#ntwAtRampRoutingHoldRadio, #ntwAtRampRoutingNotHoldRadio").attr("disabled", true);
        	}
			if ($('#ntwAtRampRoutingHoldRadio').is(":checked")) {
				$("#ntwFullRountingPointChk, #ntwFullRountingSingleChk, #ntwFullRountingMultiChk, #ntwFullRountingCustomChk").removeAttr("disabled");
				if (selectAllFullRoutingTypes || !oldSelectionHAR) {
					$("#ntwFullRountingPointChk, #ntwFullRountingSingleChk, #ntwFullRountingMultiChk, #ntwFullRountingCustomChk").prop("checked", true);
				}
			} else {
				$("#ntwFullRountingPointChk, #ntwFullRountingSingleChk, #ntwFullRountingMultiChk, #ntwFullRountingCustomChk").attr("disabled", true);
				$("#ntwFullRountingPointChk, #ntwFullRountingSingleChk, #ntwFullRountingMultiChk, #ntwFullRountingCustomChk").prop("checked", false);
			}
    		this.togglePrimaryOptions();
    		this.filterPrimaryActivities();
        }
	};
	/**
	 * toggles the primary location's type radio buttons based on the selected routing type.
	 */
    constructorFn.togglePrimaryOptions = function() {
    	var enableOptions = true;
    	if (this.isFullRoutingQuery()) {
        	if ($('#ntwFullRountingSingleChk').is(":checked")
        			|| $('#ntwFullRountingMultiChk').is(":checked")
        			|| $('#ntwFullRountingCustomChk').is(":checked")) {
        		enableOptions = false;
    	    }
    	}
    	var primaryActivityCount = this.getDatasetCount(sqwConstants.PRIMARY);
        for (var i = 0; i < primaryActivityCount; i++) {
        	if (!enableOptions) {
            	if ($("#" + sqwConstants.PRIMARY + "location" + i).prop("checked") != true
            			&& $("#" + sqwConstants.PRIMARY + "Facility" + i).prop("checked") != true) {
            		$("#" + sqwConstants.PRIMARY + "location" + i).prop("checked", true);
            		AdvancedAutoComplete.setFacilityType(sqwConstants.PRIMARY + i, "", 'location');
            		AdvancedAutoComplete.setSelectedItem(sqwConstants.PRIMARY + i, "");
            	}
                $("#" + sqwConstants.PRIMARY + "Country" + i).attr("disabled", true);
                $("#" + sqwConstants.PRIMARY + "Region" + i).attr("disabled", true);
        	} else {
                $("#" + sqwConstants.PRIMARY + "Country" + i).removeAttr("disabled");
                $("#" + sqwConstants.PRIMARY + "Region" + i).removeAttr("disabled");
        	}
        }
    };
    /**
     * method to filter primary activities
     */
    constructorFn.filterPrimaryActivities = function() {
    	var primaryActivityCount = this.getDatasetCount(sqwConstants.PRIMARY);
        for (var i = 0; i < primaryActivityCount; i++) {
        	var divId = sqwConstants.PRIMARY + i;
        	var activities = AdvancedMultiSelectComponent.getSelectedItems(sqwConstants.PRIMARY + "Activity" + i);
            SQW.refreshActivityDatasource(sqwConstants.PRIMARY, AdvancedAutoComplete.getLocCd(divId), i,
            		$("#" + $("#" + divId).attr("daySelector")).attr("selectedPlanDays"), AdvancedAutoComplete.getValue(divId, 'type'));
            if (activities) {
            	AdvancedMultiSelectComponent.setSelectedItems(sqwConstants.PRIMARY + "Activity" + i, activities.split(","), sqwConstants.PRIMARY + "ActivitySelectedTextDiv" + i);
            }
        }
    };
    /**
     * method to Validate network full query routing
     * @returns {Boolean}
     */
    constructorFn.validateNetworkQueryInput = function() {
        isFullRoutingQuery = this.isFullRoutingQuery();
    	var previousFilled = false;
    	var nextFilled = false;
    	for (var index = 0; index < this.previousDatasetCount; index++) {
    		if (!this.isEmptyActivity(sqwConstants.PREVIOUS, index)) {
    			previousFilled = true;
    			break;
    		}
    	}
    	for (var index = 0; index < this.nextDatasetCount; index++) {
    		if (!this.isEmptyActivity(sqwConstants.NEXT, index)) {
    			nextFilled = true;
    			break;
    		}
    	}
        if (isFullRoutingQuery) {
        	var errorMessage = "";
        	var facilitesAllowed = 1;
        	var primaryMandatory = false;
        	var facilityCount = 0;
        	var primaryFilled = false;
        	if ($('#ntwFullRountingAtRampChk').is(":checked") && $('#ntwAtRampRoutingNotHoldRadio').is(":checked")) {
        		primaryMandatory = true;
        	} else {
            	if ($('#ntwFullRountingSingleChk').is(":checked")
            			|| $('#ntwFullRountingMultiChk').is(":checked")
            			|| $('#ntwFullRountingCustomChk').is(":checked")) {
            		primaryMandatory = true;
            		facilitesAllowed = 0;
            	} else if (($('#ntwFullRountingAtRampChk').is(":checked") && $('#ntwAtRampRoutingHoldRadio').is(":checked"))
        				|| $('#ntwFullRountingPointChk').is(":checked"))  {
            		primaryMandatory = false;
        		} else {
        			showErrorMsg("For Full Routing at least one routing type must be selected");
            		return false;
        		}
        	}
        	for (var index = 0; index < this.primaryDatasetCount; index++) {
        		if (!this.isEmptyActivity(sqwConstants.PRIMARY, index)) {
        	    	var locationType = AdvancedAutoComplete.getValue(sqwConstants.PRIMARY + index, 'type');
        	        var activity = AdvancedMultiSelectComponent.getSelectedItems(sqwConstants.PRIMARY + "Activity" + index);
        	        var day = $("#" + sqwConstants.PRIMARY + sqwConstants.DAY_CAL + index).attr("selectedPlanDays");
        	        primaryFilled = true;
        	        var locStr = AdvancedAutoComplete.getLocCd(sqwConstants.PRIMARY + index);
        			if (locStr) {
        				if (locationType == 'facilityGroup') {
        					facilityCount++;
        				}
        				if (!activity) {
        					errorMessage = "Primary activity code cannot be blank for full routing queries.";
        				}
        			} else {
    					errorMessage = "Location information is required. Primary activity code cannot be blank for full routing queries.";
        			}
        			if (!errorMessage && !day ) {
        				errorMessage = "Primary day(s) cannot be blank for full routing queries.";
        			}else if(day){
        				var totalDays = AdvancedMultiSelectComponent.getSelectedDays(day).length;
        				if(totalDays > 7){
        					errorMessage = "More than 7 days are not allowed in case of Primary day(s) for full routing queries.";
        				}
        			}
        			if (errorMessage) {
                		showErrorMsg(errorMessage);
                		return false;
        			}
        		}
        	}
        	if (!primaryFilled) {
        		if (previousFilled || nextFilled) {
        			errorMessage = "For Full Routing if previous and/or next activity is entered, then primary activity must be entered";
        		} else if (primaryMandatory) {
					errorMessage = "Only Hold-At-Ramp or Point-To-Point routing types are allowed when Previous/Primary/Next activities are empty.";
        		}
        	} else if (!previousFilled && !nextFilled) {
    			errorMessage = "Previous or next activity info is required for full rtg queries.";
        	}
        	if (!errorMessage && facilityCount > facilitesAllowed) {
        		if (facilitesAllowed == 0) {
					errorMessage = "For Full Routing (Single sort, Multisort and Custom Sort) facility groups are not allowed in Primary activity";
        		} else {
					errorMessage = "Only one facility group is allowed in primary activities for full routing queries with selected routing types.";
        		}
        	}
        	if (errorMessage.length > 0) {
        		showErrorMsg(errorMessage);
        		return false;
        	}
        } else if (previousFilled || nextFilled) {
        	for (var index = 0; index < this.primaryDatasetCount; index++) {
    	        var locStr = AdvancedAutoComplete.getLocCd(sqwConstants.PRIMARY + index);
    	        if (locStr) {
    	            return true;
    	        }
        	}
        	showErrorMsg("For Lane Level if previous and/or next activity is entered, then primary activity must be entered");
    		return false;
        }
        return true;
    };
    /**
     * To check whether activity is empty
     * @param key
     * @param index
     * @returns {Boolean}
     */
    constructorFn.isEmptyActivity = function(key, index) {
        var day = $("#" + key + sqwConstants.DAY_CAL + index).attr("selectedPlanDays");
        var activity = AdvancedMultiSelectComponent.getSelectedItems(key + "Activity" + index);
        var transits = AdvancedMultiSelectComponent.getSelectedItems(key + "Transit" + index);
        var locStr = AdvancedAutoComplete.getLocCd(key + index);;
        if (locStr || day || activity || transits) {
        	return false;
        }
        return true;
    };

    return constructorFn;
})();

var commonViewerUtils = (function() {

    function constructorFn() {

    };
    /**
     * method to toggle the direction
     * @param targetObject
     */
    constructorFn.toggleDirection = function(targetObject) {

        if (targetObject == null) {
            return;
        }
        var direction;
        currentDirectionBtnConstant = directionBtnConstant;
        switch ($(targetObject).val()) {
        case "inbound":
            directionBtnConstant = 2;
            direction = "I";
            break;
        case "outbound":
            directionBtnConstant = 3;
            direction = "O";
            break;
        case "both":
            directionBtnConstant = 1;
            break;
        default:
            break;
        }

        /**
         * Changes are made to filter the inbound / outbound in schedule overlay view tooo
         */
        if (parent.isNetworkQuery) {
            setSearchCriteria(CRITERIA_DIRECTION, direction, undefined, window[viewerDashboardId].LAYER_ID_NETWORK_LANES);
            if (!isScheduleForNetworkFlag) {
                parent.setDashboardDataStatus(viewerDashboardId, parent.DATA_TYPE_NETWORK_SCHEDULE, false);
            } else if (isScheduleForNetworkFlag) {
                parent.setDashboardDataStatus(viewerDashboardId, parent.DATA_TYPE_NETWORK, false);
            }
        }
    };

    return constructorFn;
})();


/**
 * gets the total no. of days between the start and end dates.
 * @param startDate
 * @param endDate
 * @returns
 */
function getTotalDays(startDate, endDate) {
    return Math.round(Math.abs((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000))) + 1;
}