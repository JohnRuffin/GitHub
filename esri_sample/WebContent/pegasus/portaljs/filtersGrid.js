//map to hold the activities as per locations
var activitiesMapByLoc;
var rowCount = 1;
var rgnZoneMap = {};
/**
 * method to create blank dummy array  
 * @param length
 * @returns {Array}
 */
function getGridArray(facilityType,locCd){
	return {
		"isFilter": false,
		"facilityType":facilityType != null ? facilityType : "Location",
		"Location": locCd != null ? locCd : EMPTY_STRING,
		"Day":EMPTY_STRING,
		"Activity": EMPTY_STRING,
		"Transits":EMPTY_STRING
	};
}

function getGridArrayRows(length){
	var temparr = [];
	for (var i=0;i<length;i++){
		temparr.push(getGridArray());
	}
	return temparr;
}

/**
 * method to create the dummy dataSource to initialize the grids
 * @param length
 * @returns {kendo.data.DataSource}
 */
function getDatasource(){
	return new kendo.data.DataSource({
		pageSize: 500,
		data: getGridArrayRows(2),
		schema: {
			model: {
				id: "QueryGrid",
				fields: {
					facilityType: {
						type: "string"
					},
					isFilter: {
						type: "boolean"
					},
					Type: {
						type: "string"
					},
					Location: {
						type: "string"
					},
					Day: {
						type: "string"
					},
					Activity: {
						type: "string"
					},
					Transits: {
						type: "string"
					}
				}
			}
		}
	});
}

/**
 * method to create CustomDataBinder for nullable value in grid
 */
function createCustomDataBinder(){
	 //create a custom binder that always sets the value from the widget
	kendo.data.binders.widget.nullableValue = kendo.data.Binder.extend({
		init: function (widget, bindings, options) {
			kendo.data.Binder.fn.init.call(this, widget.element[0], bindings, options);
			this.widget = widget;
			this._change = $.proxy(this.change, this);
			this.widget.bind("change", this._change);
		},
		refresh: function () {
			var value = this.bindings.nullableValue.get();
			this.widget.value(value);
		},
		change: function () {
			var value = this.widget.value();
			if (value === "") {
				value = null;
			}

			this.bindings.nullableValue.set(value);
		},
		destroy: function () {
			this.widget.unbind("change", this._change);
		}
	});
}

/**
 * method to create KendoGrid with specified details 
 * @param grid_Id
 * @param locations
 * @param activities
 * @param days
 * @param dataSource
 * @param isPrimary
 */
function init_ActivityKendoGrid(grid_Id) {
	var types = getPlacesTypes();
	var dataSource = getDatasource();
	var locTemplate="<span style='white-space: nowrap;width:auto;'> #: locCd #  -  #: city #</span>";
	var grid =$(HASH_STRING + grid_Id).kendoGrid({
		scrollable: true,
		dataSource: dataSource,
		pageable: false,
		height:75,
		selectable:false,
		change: function(){
			var grid = $(HASH_STRING+grid_Id).data("kendoGrid");
			grid.selectable=false;
			grid.editable=true;
		},
		columns: [{
		        	  title: EMPTY_STRING, 
		        	  width: "16px", 
		        	  attributes: {
		        		  style:"padding-left:2px !important;"
		        	  }, 
		        	  template: function(data) {
		        		  return checkboxRowTemplatehandler(data,grid_Id);
		        	  }
		          }, {
		        	  field: "facilityType",
		        	  title: TITLE_TYPE,
		     	  	  width:"70px",
		        	  editor: function(container, options) {
		        		  gridKendoComboBoxEditor(container,options,grid_Id);
		        	  },
		        	  headerAttributes: {
		        		  title:HEADER_LABEL_TYPE,
		        		  style: "text-align:center"
		        	  }
		          }, {
		        	  field: "Location",
		        	  title: TITLE_LOCS,
		        	  width:"60px",
		        	  editable:true,
		        	  /*editor: function(container, options) {
		        		  gridCellEditor(container, options, grid_Id);
		        	  },*/
		        	  attributes: { 
		        		  style:"border-right:none !important"
		        	  },
		        	  headerAttributes: {
		        		  title:HEADER_LABEL_LOCS,
		        		  style: "text-align:center;padding-right: 0px !important;padding-left:12px !important;overflow:visible !important; border-right:none !important"
		        	  }
		          }, {
		        	  title: EMPTY_STRING,
		        	  template: function(data) {
		        		  return arrowIconRowTemplate(data,grid_Id,"Location");
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
		        	  field: "Day",
		        	  title: grid_Id == 'priActivitiesGrid' ? TITLE_DAYS : TITLE_DAY,
		        	  width:"50px",
		        	  editable:true,
		        	  attributes: { 
		        		  style:"border-right:none !important"
		        	  },
		        	  headerAttributes: {
		        		  title:HEADER_LABEL_DAYS,
		        		  style: "text-align:center;padding-right: 0px !important;padding-left:12px !important;overflow:visible !important; border-right:none !important"
		        	  }
		          }, {
		        	  title: EMPTY_STRING,
		        	  width:"14px",
		        	  editable:false,
		        	  template: function(data) {
		        		  return calenderRowEditor(data,grid_Id);
		        	  },
					  attributes: {
						  style:"text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"
					  },
					  headerAttributes: {
						  style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
		        	  }
		          },{
		        	  field: "Activity",
		        	  title: TITLE_ACTIVITY,
		        	  width:"60px",
		        	  editable:true,
		        	  attributes: { 
		        		  style:"border-right:none !important"
		        	  },
		        	  headerAttributes: {
		        		  title:HEADER_LABEL_ACTIVITIES,
		        		  style: "text-align:center;padding-right: 0px !important;padding-left:12px !important;overflow:visible !important; border-right:none !important"
		        	  }
		          },{
		        	  title: EMPTY_STRING,
		        	  template: function(data) {
		        		  return arrowIconRowTemplate(data,grid_Id,"Activity");
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
		        	  field: "Transits",
		        	  title: TITLE_TRANSITS,
		     	  	  width:"60px",
		     	  	  editable:true,
		     	  	  hidden: grid_Id == 'priActivitiesGrid' ? true : false,
		        	  attributes: { 
		        		  style:"border-right:none !important"
		        	  },
		        	  headerAttributes: {
		        		  title:HEADER_LABEL_TRANSIT,
		        		  style: "text-align:center;padding-right: 0px !important;padding-left:12px !important;overflow:visible !important; border-right:none !important"
		        	  }
		          },{
		        	  title: EMPTY_STRING,
		        	  template: function(data) {
		        		  return arrowIconRowTemplate(data,grid_Id,"Transits");
		        	  },
		        	  width:"14px",
		        	  hidden: grid_Id == 'priActivitiesGrid' ? true : false,
		        	  editable:false,
					  attributes: { style:"text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"},
					  headerAttributes: {
						  style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
		        	  }
		          },{
		        	  title: EMPTY_STRING, 
		        	  width: "70px", 
		        	  template: function(data) {
		        		  return addRowTemplate(data,grid_Id); 
		        	  },
		        	  attributes: {
		        		  style:"padding-left:0px; padding-right:0px; text-align:center"
		        	  }
		          }],
		          editable: true,
		          editable: {
		              confirmation: false
		          },
		          navigatable: true,
		          edit: function(e) {
		        	  var input = e.container.find("input");
		        	  if(input.attr("data-bind") == "value:Location" && e.container.closest('tr')[0].children[1].innerText == "Region"){
		        		  this.closeCell();
		        	  }
		        	  setTimeout(function() {
		        		  input.select();//FDX-1070
		        	  },100);
		        	  input.on("keyup", function(e) {
		        		  validateDay(e, $(this), grid_Id);
		        		  validateActivity(e, $(this), grid_Id);
		        		  validateCheckBoxStatus(this, this.value);
		        		  changeCase($(this), grid_Id);
		        	  });
		        	  addKeyDownHandler(e.container, grid_Id);
		          }
			});
	//Added to fix Products/Product Groups are too close to last 'Thru' row by increasing grid height		
	$("#priActivitiesGrid").css("height", "90");		
	addMouseOverEventToGrid(grid_Id);
}

function validateCheckBoxStatus(that, value) {
	try {
		var source = that.kendoBindingTarget.source;
		if(source.Location == EMPTY_STRING && source.Activity == EMPTY_STRING && source.Day == EMPTY_STRING	&& source.Transits == EMPTY_STRING && value == EMPTY_STRING) {
			$(that).closest("tr").find("input:checkbox")[0].checked = false;
		}else {
			$(that).closest("tr").find("input:checkbox")[0].checked = true;
		}
	}catch (e) {
		console.log("Error while validating checkbox status");
	}
}

function changeCase(that, grid_Id) {
	try {
		var index = that.closest("tr").index();
		var data = $("#"+grid_Id).data("kendoGrid").dataSource.data();
		if(data != null && data.length >= index) {
			if(that.attr('data-bind') == 'value:Activity') {
				data[index].Activity = that.val().toUpperCase();
				that.val(that.val().toUpperCase());
			}else if(that.attr('data-bind') == 'value:Transits') {
				data[index].Transits = that.val().toUpperCase();
				that.val(that.val().toUpperCase());
			}else if(that.attr('data-bind') == 'value:Location') {
				data[index].Location = that.val().toUpperCase();
				that.val(that.val().toUpperCase());
			}
		}
	}catch (e) {
		console.log("Error while changing case");
	}
}

function validateDay(event, input, grid_Id){
	try {
		if(input.attr('data-bind') != null && input.attr('data-bind') == 'value:Day') {
			var isValid = true;
			if(input.val() != EMPTY_STRING && grid_Id == "priActivitiesGrid") {
				isValid = validateMultipleDayExp(input.val());
			}else if(input.val() != EMPTY_STRING) {
				isValid= validateSingleDayExp(input.val());
			}
			if(isValid){
				isValid = validateCaseDates(event);
	   		}
			if(!isValid){
				if(event.keyCode != 32) {
					parent.showFilterErrorMsg(NOT_ENOUGH_DAYS_IN_PLAN_ERROR);
				}
				input.val(EMPTY_STRING);
			}else {
				parent.closeHeaderMsgWin();
			}
			if(input[0].kendoBindingTarget.source.Day != input.val()){
				input.parent().next().next()[0].innerText ="";
			}
			input[0].kendoBindingTarget.source.Day = input.val();
		}else if(input.attr('data-bind') != null && input.attr('data-bind') == 'value:Location') {
			if(input[0].kendoBindingTarget.source.Day != input.val()){
				input.parent().next().next()[0].innerText ="";
			}
		}
	}catch (e) {
		console.log("Error while validating day");
	}
}
function validateActivity(event, input, grid_Id){
	try {
		if(input.attr('data-bind') != null && input.attr('data-bind') == 'value:Day') {
			if(input[0].kendoBindingTarget.source.Day != input.val()){
				input.parent().next().next()[0].innerText =EMPTY_STRING;
				input[0].kendoBindingTarget.source.Activity=EMPTY_STRING;
			}
		}else if(input.attr('data-bind') != null && input.attr('data-bind') == 'value:Location') {
//			if(input[0].kendoBindingTarget.source.Location != input.val()){
				input.parent().parent().next().next().next().next()[0].innerText =EMPTY_STRING;
				input[0].kendoBindingTarget.source.Activity=EMPTY_STRING;
//			}
		}
	}catch (e) {
		console.log("Error while validating day");
	}
}

function addMouseOverEventToGrid(grid_Id) {
	var table = $(HASH_STRING+grid_Id).find("div.k-grid-content table");
	table.on("mouseover", "td", function(event) {
		showHideImage(this,true);
		addToolTip(this);
	});
	table.on("mouseout", "td", function(event) {
		showHideImage(this,false);
	});
}

function showHideImage(that, isShow) {
	var img = $(that).next().find("img");
	if(img == null || img.length != 1) {
		img = $(that).find("img");
	}
	if(img != null && img.length > 0 ) {
		if(img.attr("name") == "arrow" || img.attr("name") == "calendar") {
			if(isShow) {
				img.show();
			}else {
				img.hide();
			}
		}
	}
}

function addToolTip(that) {
	var tooltip = "";
	if(that.cellIndex == 2) {
		var type = $(that).prev().text();
		var datasource = getDataSource(type);
		var field = getDataField(type);
		var loc = $(that).text();
		var dataObj = $.grep(datasource, function(e) {
			return e[field].toString().toLowerCase() == loc.toString().toLowerCase();
		});
		if(dataObj && dataObj.length > 0 || (type == "Region" && (loc.toString()).split("_")[0] != undefined )) {
			if(type == "Location") {
				tooltip = dataObj[0].city + ", " + (dataObj[0].provStCd != undefined ? dataObj[0].provStCd : "") + ", " + dataObj[0].countryCd + " (" + dataObj[0].locCd + ") - " + dataObj[0].facType;
			}else if(type == "Country") {
				tooltip = dataObj[0].countryDesc;
			}else if(type == FACILITY_GROUP) {
				tooltip = dataObj[0].grpDesc;
			}else if(type == "Region") {
				tooltip = loc.toString();
			}
		}
	}else if(that.cellIndex == 6) {
		var acts = $(that).text();
		var type = $(that).prev().prev().prev().prev().prev().text();
		var locCd = $(that).parent().children().eq(2).text();
		var facilityType = null;
		if(locCd == "") {
			locCd = $(that).parent().children().eq(2).find("input").val();
		}
		if(type == "Location") {
			facilityType = "location";
		}else if(type == "Country") {
			facilityType = "country";
		}else if(type == FACILITY_GROUP) {
			facilityType = "facilityGroup";
		}else if(type == "Region") {
			facilityType = "globalRegion";
		}
		if(acts != null && acts != "") {
			var data = getActivitiesList(locCd, $(that).prev().prev().text(), facilityType);
//			var actDataArr = data[0].concat(data[1]);
			var actArray = acts.split(",");
			var actDeatils;
			for(var i=0; i<actArray.length; i++) {
				actDeatils = $.grep(data, function(e) {
					return (e.actyCd == actArray[i]);
				});
				if(actDeatils && actDeatils.length > 0) {
					tooltip = tooltip + getActivityType(actDeatils[0]) + "\x0A";
				}else {
					tooltip = tooltip + "Activity (" + actArray[i] + ") doesn't exsit for location " + locCd + "\x0A";
				}
			}
		}
	}
	$(that).attr("title", tooltip.trim());
}
function getActivitiesList(filterByLocCd, filterByDays, facilityType){
    var type = "activity";
    var datasource = queryDatasources["ActivitiesDetailSQW"].data();
    var activityArray = [];
    if (datasource && datasource.length > 0) {
        if (type == "activity") {
            if (facilityType == "location") {
                activityArray = AdvancedActivityComponent.searchActivitiesByLocAndDays(datasource, filterByLocCd, filterByDays);
            } else {
                activityArray = AdvancedActivityComponent.searchActivitiesByFacilityTypeAndDays(datasource, filterByLocCd, filterByDays, facilityType,true);
            }
            /* if (activityType) {
                activityArray = AdvancedActivityComponent.filterActivityTypes(activityArray, activityType);
            }*/
        }
    }
    return activityArray;
}
function getActivityType(actDeatils) {
	var type = "";
	switch (actDeatils.actyType) {
    case 'C':
        // Custom Activities
    	if(actDeatils.nightOrDay == "D") {
    		type = actDeatils.actyCd + " - Day Custom";
    	}else {
    		type = actDeatils.actyCd + " - Night Custom";
    	}
        break;
    case 'O':
        // Origin Activities 
    	type = actDeatils.actyCd + " - Origin Activity";
        break;
    case 'D':
        // Destination Activities
    	type = actDeatils.actyCd + " - Destination Activity";
        break;
    case 'M':
        // Consolidation Activities
    	if(actDeatils.nightOrDay == "D") {
    		type = actDeatils.actyCd + " - Day Consolidation";
    	}else {
    		type = actDeatils.actyCd + " - Night Consolidation";
    	}
        break;
    case 'P':
        // Point to Point Activities
    	type = "Point to Point Activity";
        break;
    case 'S':
        // Sort Activities
    	if(actDeatils.nightOrDay == "D" && actDeatils.inTransitFlg != "N") {
    		type = actDeatils.actyCd + " - Day In-Transit";
    	}else if(actDeatils.nightOrDay == "N" && actDeatils.inTransitFlg != "N") {
    		type = actDeatils.actyCd + " - Night In-Transit";
    	}else if(actDeatils.nightOrDay == "D" && actDeatils.inTransitFlg == "N") {
    		type = actDeatils.actyCd + " - Day Sort";
    	}else {
    		type = actDeatils.actyCd + " - Night Sort";
    	}
        break;
    }
	return type;
}

function getDataSource(type) {
	var dataSource = [];
	if(type == "" || type == "Location" ){
		dataSource = queryDatasources["ActivityFacilities"].data();
	}else if(type == "Country"){
		dataSource = queryDatasources["CountryCodes"].data();
	}else if(type == "Facility Group"){
		dataSource = queryDatasources["FacilityGroups"].data();
	}else if(type == "Region"){
		dataSource = queryDatasources["GlobalRegions"].data();
	}
	return dataSource;
}

function getDataField(type) {
	var dataTextField = LOCCD;
	if(type == "" || type == "Location" ){
		dataTextField = LOCCD;
	}else if(type == "Country"){
		dataTextField = COUNTRYCODE;
	}else if(type == FACILITY_GROUP){
		dataTextField = GROUPNAME;
	}else if(type == "Region"){
		dataTextField = 'globalRgnCd';
	}
	return dataTextField;
}

/**
 * method to create and render the kendoComboBox 
 * @param container
 * @param options
 * @param grid_Id
 */
function gridKendoComboBoxEditor(container,options,grid_Id) {
	if(options.field=="facilityType"){
		var dataSource = getPlacesTypes();
		var comboinput = '<input  name="' + options.field +'"'+EMPTY_STRING+'/>';
		var kendoComboBoxEditor = $(comboinput).appendTo(container).kendoDropDownList({
			select : function(event) {
				onChangeCombo(grid_Id, event);
			},
			open : function(event) {
				event.sender.list.css("width", "100px");
			},
			dataSource: dataSource
		});
		setTimeout(function() {
			if($(kendoComboBoxEditor).data("kendoDropDownList")) {
				$(kendoComboBoxEditor).data("kendoDropDownList").popup.open();
			}
		},50);
		//addKeyDownHandler(container, grid_Id);
	}
}

function onChangeCombo(grid_Id, event) {
	//validateCheckBoxStatus(event.sender.element[0], event.item.text().trim());
	var grid = $("#"+grid_Id).data("kendoGrid");
	var row = event.sender.element.closest("tr");
	var data = grid.dataItem(row);
	if(data != null) {
		data.Location = "";
		data.Activity = "";
		data.Transits = "";
		data.facilityType = event.item.text();
	}
	//Added code to replace grid.refresh
	getTableCellByFieldName(row, "Location").text("");
	getTableCellByFieldName(row, "Activity").text("");
	getTableCellByFieldName(row, "Transits").text("");
	getTableCellByFieldName(row, "facilityType").text(event.item.text());
	//grid.refresh();
}

function getTableCellByFieldName(row, fieldName) {
	var grid = row.closest("div.k-grid.k-widget").data("kendoGrid");
	var cellIndex = grid.thead.find("th.k-header[data-field='" + fieldName + "']").index();
	var cell = row.find("td").eq(cellIndex);
	return cell;
}

function gridCellEditor(container, options, grid_Id) {
	var dataSource = {};
	if(options.model.facilityType == "" || options.model.facilityType == "Location" ){
		dataSource = queryDatasources["ActivityFacilities"];
		gridTemplate = TEMPLATE_LOCATIONS;
		dataTextField = LOCCD;
	}else if(options.model.facilityType == "Country"){
		dataSource = queryDatasources["CountryCodes"];
		gridTemplate = TEMPLATE_COUNTRYCODE;
		dataTextField = COUNTRYCODE;
	}else if(options.model.facilityType == FACILITY_GROUP){
		dataSource = queryDatasources["FacilityGroups"];
		gridTemplate = TEMPLATE_FACGROUP;
		dataTextField = GROUPNAME;
	}else if(options.model.facilityType == "Region"){
		dataTextField = GLOBALRGNDESC;
		dataSource = queryDatasources["GlobalRegions"];
		gridTemplate = TEMPLATE_GLOBALRGN;
	}
	var locationAutocomplete;
	if (dataTextField == LOCCD){
		locationAutocomplete = $('<input name="' + options.field + '"' + EMPTY_STRING + '/>').appendTo(container).kendoAutoComplete({
			minLength: 0,
			dataTextField: dataTextField,
			filter: FILTER_TYPE_STARTS_WITH,
			animation : false,
			dataSource: (dataSource)
		});		
	} else {
		locationAutocomplete = $('<input name="' + options.field + '"' + EMPTY_STRING + '/>').appendTo(container).kendoAutoComplete({
			minLength: 0,
			dataTextField: dataTextField,
			filter: FILTER_TYPE_STARTS_WITH,
			dataSource: (dataSource)
		});
	}
	if(gridTemplate){
		locationAutocomplete.data("kendoAutoComplete").setOptions({template:gridTemplate});
		locationAutocomplete.data("kendoAutoComplete").list.addClass("locList");
	}
	locationAutocomplete.on("keyup", function(e) {
		locationAutocomplete[0].value = locationAutocomplete.data("kendoAutoComplete").value().toUpperCase();
	});
	//addKeyDownHandler(container, grid_Id);
}

function addKeyDownHandler(container,grid_Id) {
	container.find("input").on("keydown", function(e) {
		try {
			var that = $(this);
			var currentRow = that.closest("tr");
			var nextRowIndex = currentRow.index() + 1;
			var parent = currentRow.parent();
			if(that.attr('data-bind') == 'value:Location' && e.keyCode == 13 && (grid_Id == "preActivitiesGrid" || grid_Id == "nxtActivitiesGrid")) {
				validateAndAddRowToGrid(grid_Id);
				setTimeout(function (){
					(parent.find("tr").eq(nextRowIndex).find('td:nth-child(3)')).click();
				},100);
				e.stopImmediatePropagation();
				e.preventDefault();
			}else if((e.shiftKey || e.key == "Shift") && e.keyCode == 9) {
				setTimeout(function() {
					if(that.attr('data-bind') == 'value:Location') {
						(currentRow.find('td:nth-child(2)')).click();
					}else if(that.attr('data-bind') == 'value:Day') {
						(currentRow.find('td:nth-child(3)')).click();
					}else if(that.attr('data-bind') == 'value:Activity') {
						(currentRow.find('td:nth-child(5)')).click();
					}else if(that.attr('data-bind') == 'value:Transits') {
						(currentRow.find('td:nth-child(7)')).click();
					}else if(that.attr('data-bind') == 'value:facilityType') {
						(currentRow.prev().find('td:nth-child(9)')).click();
					}
					e.stopImmediatePropagation();
					e.preventDefault();
				},30);
			}else if(e.keyCode == 9 || (e.keyCode == 13 && that.attr('data-bind') != 'value:Location')) {
				if(that.attr('data-bind') == 'value:Transits' && (currentRow.next() == null || currentRow.next().length < 1)) {
					addRowHandler(null, grid_Id);
				}
				setTimeout(function() {
					if(that.attr('data-bind') == 'value:Location') {
						(currentRow.find('td:nth-child(5)')).click();
					}else if(that.attr('data-bind') == 'value:Day') {
						(currentRow.find('td:nth-child(7)')).click();
					}else if(that.attr('data-bind') == 'value:Activity') {
						(currentRow.find('td:nth-child(9)')).click();
					}else if(that.attr('data-bind') == 'value:Transits') {
						(parent.find("tr").eq(nextRowIndex).find('td:nth-child(2)')).click();
					}
					e.stopImmediatePropagation();
					e.preventDefault();
				},30);
			}
		}catch (e) {
			console.log("Error in addKeyDownHandler");
		}
		
	});	
}

function validateAndAddRowToGrid(grid_Id) {
	var grid = $(HASH_STRING+grid_Id).data("kendoGrid");
	var datasource = grid.dataSource;
	var flag = isRowEmpty(datasource);
	if(!flag){
		datasource.add(getGridArray());
		scrollToSelectedRow(grid);
	}
	return flag;
}


function isRowEmptyById(grid_Id){
	var grid = $(HASH_STRING+grid_Id).data("kendoGrid");
	var datasource = grid.dataSource;
	if(datasource.data().length > 0){
		var model = datasource.data()[datasource.data().length - 1];
		if(model.Activity != EMPTY_STRING || model.Location!= EMPTY_STRING || model.Day != EMPTY_STRING || model.Transits != EMPTY_STRING){
			return false;
		}
	}
	return true;
}

function isRowEmpty(datasource){
	if(datasource.data().length > 0){
		var model = datasource.data()[datasource.data().length - 1];
		if(model.Activity != EMPTY_STRING || model.Location!= EMPTY_STRING || model.Day != EMPTY_STRING || model.Transits != EMPTY_STRING){
			return false;
		}
	}
	return true;
}


/**
 * custom item editor to render row selection checkbox in query window 
 * @param model
 * @param grid_Id
 * @returns {String}
 */
function checkboxRowTemplatehandler(model,grid_Id) {
	if(model.Activity != EMPTY_STRING || model.Location!= EMPTY_STRING || model.Day != EMPTY_STRING || model.Transits != EMPTY_STRING){
		return "<input id='chkBox"+model.uid+"' checked='checked' type='checkbox' onclick=checkboxRowHandler(this,'"+grid_Id+"') /><label></label>";
	}
	return "<input id='chkBox"+model.uid+"'  type='checkbox' onclick=checkboxRowHandler(this,'"+grid_Id+"') /><label></label>";
}

/**
 * click handler for row checkbox
 * @param checkBox
 * @param grid_Id
 */
function checkboxRowHandler(checkBox,grid_Id){
	var currentTR = $(checkBox).closest("tr");
	if(!checkBox.checked) {
		$(currentTR).removeClass("text-blue");
		$(currentTR).addClass("text-grey");
	}else{
		$(checkBox).removeAttr("disabled");
		$(currentTR).removeClass("text-grey");
		$(currentTR).addClass("text-blue");
	} 
}

/**
 * custom item editor to render calender button in query grids
 * @param model
 * @param grid_Id
 * @returns {String}
 */
function calenderRowEditor(model,grid_Id) {
	return "<img name='calendar' style='display:none; cursor: pointer;' title='Open calendar' src ='"+ICON_IMAGE_PATH_DAYS+"' style='margin-left:-1px' onclick=calenderRowHandler(this,'"+grid_Id+"') isOpenState='false'/>";
}

/**
 * click handler for calendar button in query grids
 * @param calBtn
 * @param grid_Id
 */
function calenderRowHandler(calBtn,grid_Id) {
	var grid = $("#"+grid_Id).data("kendoGrid");
	var currentTR = $(calBtn).closest("tr");
	var rowData = grid.dataItem(currentTR);
	selDays = rowData.Day.replace(/\s{1,}/g, ',');
	if(selDays == "" || selDays == null){
		if($(".k-edit-cell").find("input") && $(".k-edit-cell").find("input").length > 0){
			selDays = ($(".k-edit-cell").find("input")[0].value).replace(/\s{1,}/g, ',');
		}
	}
	var isSingleSelection = true;
	if(grid_Id == "priActivitiesGrid") {
		isSingleSelection = false;
	}else{
		isSingleSelection = true;
	}
	calBtn.gridId = grid_Id;
	calBtn.rowIndex = currentTR.index();
	var disableZero = getLocalZuluFlag() == "L" ? true : false;
	showDayControl(isSingleSelection,selDays,calBtn, false, currentTR, false, null, null, null, disableZero);
}

/**
 * method to handle the selection of days from calender
 * @param calBtn
 * @param selectedDays
 * @param keyObj
 */
function setSelectedDays(calBtn, selectedDays, keyObj) {
	if(calBtn.gridId !=null){
		var grid = $("#"+calBtn.gridId).data("kendoGrid");
		var currentTR = $(calBtn).closest("tr");
		if(currentTR == null || currentTR.length < 1){
			currentTR = keyObj;
		}
		if((currentTR == null || currentTR.length < 1) && calBtn.rowIndex){
			currentTR = grid.tbody.find("tr").eq(calBtn.rowIndex);
		}
		grid.dataItem(currentTR).Day = selectedDays;
		grid.dataItem(currentTR).Activity = "";
		grid.refresh();
		//grid.dataSource.data()[currentTR[0].sectionRowIndex].set("Day", selectedDays);
	}else{
		$("#onDays")[0].value=selectedDays;
	}	
}


function arrowIconRowTemplate(model, grid_Id, field) {
	return "<img name='arrow' style='display:none; cursor: pointer;' title='Open popup' src ='"+ICON_IMAGE_ARROW+"' style='margin-left:-1px' onclick=arrowRowHandler(this,'"+grid_Id+"','"+field+"') isOpenState='false'/>"; 
}

function arrowRowHandler(btn,grid_Id,field) {
	var type = $(btn).parent().parent().children().eq(1).text();
	var locCd = $(btn).parent().parent().children().eq(2).text();
	if(locCd == "") {
		locCd = $(btn).parent().parent().children().eq(2).find("input").val();
	}
	var days = $(btn).parent().parent().children().eq(4).text();
	if(type == null || type == "") {
		type = "Location";
	}
	if(field == "Location"){
		parent.openSelectLocDialog(grid_Id+field,"Select locations", null, grid_Id, null, null, type, btn);
	}else if(field == "Transits") {
		parent.openSelectLocDialog(grid_Id+field,"Select transits", null, grid_Id, null, null, null, btn);
	}else if(field == "Activity") {
		parent.openSelectLocDialog(grid_Id+field,"Select activity", type != "Region" ? locCd : getSelectedRegionId(locCd), grid_Id, null, null, getFacilityType(type), btn, days);
	}
}

function getFacilityType(type) {
	switch(type) {
	case "Location":
		return "location";
		break;
	case "Country":
		return "country";
		break;
	case FACILITY_GROUP:
		return "facilityGroup";
		break;
	case "Region":
		return "globalRegion";
		break;
		
	}
}
function getSelectedRegionId(regionDesc){
	var gregion = (regionDesc.toString()).split("-");
	if (regionDesc.indexOf("-") > -1) {
		var locCd = gregion[0];
		var zoneId = gregion[1];
		var rgnDesc = $.grep(getQueryDatasources()["GlobalRegions"].data(),
				function(key, value) {
					if (locCd == key.globalRgnDesc) {
						return key.globalRgnCd;
					}
				});
		var zoneDesc = $.grep(getQueryDatasources()["ZonesList"].data(),
				function(key, value) {
					if (rgnDesc[0].globalRgnCd == key.globalRgnCd && zoneId == key.zoneDesc) {
						return key.zone;
					}
				});
		return (rgnDesc[0].globalRgnCd +"_"+ zoneDesc[0].zone).toString();
	}else{
		var rgnDesc = $.grep(getQueryDatasources()["GlobalRegions"].data(),
				function(key, value) {
					if (regionDesc == key.globalRgnDesc) {
						return key.globalRgnCd;
					}
				});
		if(rgnDesc[0] != undefined)
			return (rgnDesc[0].globalRgnCd).toString();
	}
}
function getFacilityTypeForQuery(type,tempData) {
	switch(type) {
	case "Location":
		return "LocCd";
		break;
	case "Country":
		return "Country";
		break;
	case FACILITY_GROUP:
		return "FacGrp";
		break;
	case "Region":
		//tempData;
		return "Rgn";
		break;
	}
}

function showNearByRowTemplate(model,grid_Id) {
	return "<img style='padding-left:5px; cursor:pointer;' title='Add nearby locations' src ='"+ICON_IMAGE_PATH_NEARBY+"' onclick=showNearByRowHandler(this,'"+grid_Id+"') />";
}

function showNearByRowHandler(btn, grid_Id) {
	var rowIndex = $(btn).closest("tr").index();
	var grid = $("#" + grid_Id).data("kendoGrid");
	var locCd = grid.dataSource.data()[rowIndex]["Location"];
	if(locCd != null && locCd != "") {
		parent.openSelectLocDialog("showNearBy", "Add nearby locations (" + locCd + ")", locCd, grid_Id, null, null, "Location", btn);
	}
}

/**
 * custom item editor to render delete button in query grids
 * @param model
 * @param grid_Id
 * @param iconUrl
 * @param imageClickMethod
 * @returns {String}
 */
function addRowTemplate(model,grid_Id) {
	var grid = $(HASH_STRING+grid_Id).data("kendoGrid");
	var datasource = grid.dataSource;
	var nearByTemplate = showNearByRowTemplate(model,grid_Id);
	var deleteTemplate = deleteRowtemplate(model, grid_Id);
	if(rowCount==datasource.data().length){
		rowCount=1;
		return deleteTemplate + "<img title='Add a row' style='cursor:pointer;' src ='"+ICON_IMAGE_PATH_ADD+"' onclick=addRowHandler(this,'"+grid_Id+"') />"  + nearByTemplate;
	}else{
		rowCount= rowCount+1;
	}
	return deleteTemplate + "<img src ='"+ICON_IMAGE_PATH_ADD_DISABLE+"'/>" + nearByTemplate;
}

function deleteRowtemplate(model, grid_Id) {
	var grid = $(HASH_STRING+grid_Id).data("kendoGrid");
	var datasource = grid.dataSource;
	if(datasource.view().length == 1) {
		return "<img style='padding-right:5px;' src ='"+ICON_IMAGE_PATH_CLOSE_DISABLE+"' />";
	}
	return "<img title='Remove a row' style='padding-right:5px;cursor:pointer' src ='"+ICON_IMAGE_PATH_CLOSE+"' onclick=deleteRowHandler(this,'" + grid_Id + "') />";
}

/**
 * method to handle add row in query grids
 * @param deleteBtn
 * @param grid_Id
 */
function addRowHandler(deleteBtn,grid_Id) {
	var grid = $(HASH_STRING+grid_Id).data("kendoGrid");
	var datasource = grid.dataSource;
	datasource.add(getGridArray());
	scrollToSelectedRow(grid);
	//datasource.insert(datasource.data().length,{ Location: '', Activity: '' ,Day: ''});
	//resetGridHeight(grid_Id);
}

/**
 *  method to handle deletion of the row in query grids
 * @param deleteBtn
 * @param grid_Id
 */
function deleteRowHandler(deleteBtn,grid_Id) {
	var currentTR = $(deleteBtn).closest("tr");
	var grid = $(HASH_STRING+grid_Id).data("kendoGrid");
	var datasource = grid.dataSource;
	if(datasource.data().length > 1){// at least one row shud be there in the grid
		grid.removeRow(currentTR);
		//resetGridHeight(grid_Id);
	}
}

/**
 *  method to handle in height of the grid on deletion/add of the row
 * @param grid_Id
 */
function resetGridHeight(grid_Id) {
	var gridDiv = $(HASH_STRING+grid_Id);
	var tableHeight = gridDiv.find("div.k-grid-content table").height();
	var headerTableHeight = gridDiv.find("div.k-grid-header table").height();
	gridDiv.closest(".k-window.querySubWindow").height(headerTableHeight + tableHeight);
	gridDiv.height(headerTableHeight + tableHeight);
	gridDiv.find("div.k-grid-content").height(tableHeight);
}

/**
 * method to scroll at last row
 * @param grid
 */
function scrollToSelectedRow(grid) {
    grid.element.find(".k-grid-content").animate({
        scrollTop: grid.tbody.height() //  scroll to the selected row given by 'this.select()'
    }, 1);
}

/**
 * method to show/hide the colums as per settings 
 * @param chkBtn
 * @param grid_Id
 * @param columnName
 * @param isResize
 */
function showHideColumn(chkBtn,grid_Id,columnName, isResize){
	var grid = $(HASH_STRING+grid_Id).data("kendoGrid");
	if(grid!=null){
		resizeGridParent(grid_Id, columnName, chkBtn.checked);
		if(chkBtn.checked) {
			grid.showColumn(columnName);
		}else{
			grid.hideColumn(columnName);
		}
		$(HASH_STRING+grid_Id).find("table").each(function(i) {
			this.style.width = '100%';
		});
	}	
}

/**
 * method to resize the kendoGrid on show/hide of the columns  
 * @param grid_Id
 * @param columnName
 * @param isAdd
 */
function resizeGridParent(grid_Id, columnName, isAdd) {
	try {
		var grid = $(HASH_STRING+grid_Id).data("kendoGrid");
		var column = $.grep(grid.columns, function(e){ return e.field == columnName;});
		var width = parseInt(column[0].width.replace("px",""));
		var parentWidth = $(HASH_STRING+grid_Id).parent().parent().width();
		if(isAdd) {
			if(column[0].hidden) {
				$(HASH_STRING+grid_Id).parent().parent().width(parentWidth + width);
			}
		}else {
			if(!column[0].hidden) {
				$(HASH_STRING+grid_Id).parent().parent().width(parentWidth - width);
			}
		}
	}catch (e) {
		console.log("Error ["+e.message+"] occurred while resizing grid parent");
	}
}
/**
 * To initialize the map for list of activities for each location
 */
function initActivitiesByLoc() {
	//map contains the array of activities specific to location with loc as key
	activitiesMapByLoc = new Object();
	//map contains the activities details with loc_act as key
	var activitiesDetail = (getQueryDatasources()['ActivitiesDetail']).data();
	for (var i=0;i<activitiesDetail.length;i++) {
		if(!activitiesMapByLoc[activitiesDetail[i].locCd]) {
			activitiesMapByLoc[activitiesDetail[i].locCd] = new Array();
		}
		activitiesMapByLoc[activitiesDetail[i].locCd].push(activitiesDetail[i].actyCd);
		(activitiesMapByLoc[activitiesDetail[i].locCd]).sort();
	}
}
/**
 * To get the activites based on location entered
 * @param selectedLocCd
 */
function getActivitiesData(selectedLocCd) {
	try{
		if(selectedLocCd != null && selectedLocCd != EMPTY_STRING) {
			if(activitiesMapByLoc[selectedLocCd]){
				return new kendo.data.DataSource({data : activitiesMapByLoc[selectedLocCd]});
			}
		}
	}catch (e) {
		console.log(e.message);
	}
}
function getSelectedRegionDesc(locations,locationsArray) {
	var gregion;
	var rgnDesc;
	var zoneDesc;
	var zoneId;
	var locCd;
	
	if (locations.indexOf("_") > -1) {
		gregion = locations.split("_");
		locCd = gregion[0];//regionId
		zoneId = gregion[1];//zoneId
		//if all zones selcted need to update the locations array 
		rgnDesc = $.grep(getQueryDatasources()["GlobalRegions"].data().toJSON(),
				function(key, value) {
					if (locCd == key.globalRgnCd) {
						return key.globalRgnDesc;
					}
				});
		zoneDesc = $.grep(getQueryDatasources()["ZonesList"].data().toJSON(),
				function(key, value) {
					if (locCd == key.globalRgnCd && zoneId == key.zone) {
						return key.zoneDesc;
					}
				});
		return rgnDesc[0].globalRgnDesc +"-"+ zoneDesc[0].zoneDesc;
	}else{
		//if only region send desc
		rgnDesc = $.grep(getQueryDatasources()["GlobalRegions"].data().toJSON(),
				function(key, value) {
					if (locations == key.globalRgnCd) {
						return key.globalRgnDesc;
					}
				});
		return rgnDesc[0].globalRgnDesc;
	}
	delete gregion;
	delete rgnDesc;
	delete zoneDesc;
	delete zoneId;
	delete locCd;
}
function getlocationsArrForRegions(locs) {
	var locations = "";
	var onlyRegion = false;
	var gregion; 
	var selectedRgnZoneMap= {};
	var resultArr =[];
	var uniqueValues = [];
	for(var i = 0; i < locs.length; i++) {
		locations = locs[i];
		onlyRegion = false;
		gregion = locations.split("_");
		selectedRgnZoneMap= {};
		if (locations.indexOf("_") > -1) {
			//if only region-zone 
			//create map with existing data to validate how many zones selectd out of region, if all selected we need to add only region
			if((Object.keys(rgnZoneMap)).length <= 0){
				$.each(getQueryDatasources()["ZonesList"].data().toJSON(), function(key, value) {
					if(rgnZoneMap[value.globalRgnCd] != undefined){
						(rgnZoneMap[value.globalRgnCd]).push(value.globalRgnCd + "_" + value.zone);
					}else{
						rgnZoneMap[value.globalRgnCd] = [value.globalRgnCd + "_" + value.zone];
					}
				});
			}
			
			var locCd = gregion[0];//regionId
//			var zoneId = gregion[1];//zoneId
			//create map for the available locations to validate how many zones selectd out of region
			$.each(locs, function(key, value) {
				if(value.split("_")[0] == locCd){
					if(selectedRgnZoneMap[locCd] != undefined){
						(selectedRgnZoneMap[locCd]).push(value);
					}else{
						selectedRgnZoneMap[locCd] = [value];
					}
				}
			});	
			//if all zones selcted need to update the flag 
			if(selectedRgnZoneMap[locCd] != undefined && selectedRgnZoneMap[locCd].length == rgnZoneMap[locCd].length){
				onlyRegion = true;
			}	
			if(!onlyRegion){
				//push regionId-zoneId
				resultArr.push(locations);
			}else{
				//if only region push regionId
				resultArr.push(locCd);
			}
		}else{
			//if only region push regionId
			resultArr.push(locations);
		}
	}
	//send only unique values
	$.each(resultArr, function(i, el){
	    if($.inArray(el, uniqueValues) === -1) uniqueValues.push(el);
	});
//	console.log(uniqueValues);
	
	return uniqueValues;
	
	delete locations;
	delete onlyRegion;
	delete gregion; 
	delete selectedRgnZoneMap;
	delete resultArr;
	delete uniqueValues;
}
function setLocationInGrid(uniqueId, locations, options) {
	var gridId,grid,gridData;
	var flag = false;
	var rowIndex = $(options.parentObj).closest("tr").index();
	if(uniqueId == "preActivitiesGridLocation" || uniqueId == "priActivitiesGridLocation" || uniqueId == "nxtActivitiesGridLocation") {
		gridId = uniqueId.replace("Location", "");
		grid = $("#" + gridId).data("kendoGrid");
		gridData = grid.dataSource.data(); 
		if(locations != null && locations.length > 0 && grid.dataSource.data() && gridData[rowIndex]) {
			if(options.facilityType == "Region"){
				locations = getlocationsArrForRegions(locations);
			}
			gridData[rowIndex]["facilityType"] = options.facilityType;
			if(options.facilityType == "Region"){
				gridData[rowIndex]["Location"] = getSelectedRegionDesc(locations[0]);
			}else{
				gridData[rowIndex]["Location"] = locations[0];
			}
			gridData[rowIndex]["Activity"] = "";
			for(var i = 1; i < locations.length; i++) {
				flag = false;
				for(var j = rowIndex+1; j < gridData.length; j++) {
					if(gridData[j]["Location"] == "") {
						gridData[j]["facilityType"] = options.facilityType;
						gridData[j]["Activity"] = "";
						if(options.facilityType == "Region"){
							gridData[j]["Location"] = getSelectedRegionDesc(locations[i]);
						}else{
							gridData[j]["Location"] = locations[i];
						}
						flag = true;
						break;
					}
				}
				if(!flag) {
					var locCd = EMPTY_STRING;
					if(options.facilityType == "Region"){
						locCd = getSelectedRegionDesc(locations[i]);
					}else{
						locCd = locations[i];
					}
					grid.dataSource.add(getGridArray(options.facilityType, locCd));
				}
			}
		}
	}else if(uniqueId == "preActivitiesGridTransits" || uniqueId == "priActivitiesGridTransits" || uniqueId == "nxtActivitiesGridTransits") {
		gridId = uniqueId.replace("Transits", "");
		grid = $("#" + gridId).data("kendoGrid");
		if(locations != null && locations.length > 0 && grid.dataSource.data() && grid.dataSource.data()[rowIndex]) {
			grid.dataSource.data()[rowIndex]["Transits"] = locations.toString();
		}
	}else if(uniqueId == "showNearBy") {
		gridId = options.parentId;
		grid = $("#" + gridId).data("kendoGrid");
		gridData = grid.dataSource.data(); 
		for(var i = 0; i < locations.length; i++) {
			flag = false;
			for(var j = rowIndex+1; j < gridData.length; j++) {
				if(gridData[j]["Location"] == "") {
					gridData[j]["facilityType"] = options.facilityType;
					gridData[j]["Location"] = locations[i];
					flag = true;
					break;
				}
			}
			if(!flag) {
				grid.dataSource.add(getGridArray(options.facilityType, locations[i]));
			}
		}
	}else if(uniqueId == "preActivitiesGridActivity" || uniqueId == "priActivitiesGridActivity" || uniqueId == "nxtActivitiesGridActivity") {
		gridId = uniqueId.replace("Activity", "");
		grid = $("#" + gridId).data("kendoGrid");
		if(locations != null && locations.length > 0 && grid.dataSource.data() && grid.dataSource.data()[rowIndex]) {
			grid.dataSource.data()[rowIndex]["Activity"] = locations.toString();
		}
	}
	if(grid != null) {
		//scrollToSelectedRow(grid);
		grid.refresh();
	}
}