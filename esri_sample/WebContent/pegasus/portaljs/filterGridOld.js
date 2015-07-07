
//map to hold the activities as per locations
var activitiesMapByLoc;
/**
 * method to create blank dummy array  
 * @param length
 * @returns {Array}
 */
function getGridArray(length){
	var temparr=[];
	for (var i=0;i<length;i++){
		temparr.push({
			"isFilter": false,
			"Location": EMPTY_STRING,
			"Activity": EMPTY_STRING,
			"Day":EMPTY_STRING,
			"Transits":EMPTY_STRING,
			"transitType":EMPTY_STRING,
			"facilityType":EMPTY_STRING
		});
	}
	return temparr;
}

/**
 * method to create the dummy dataSource to initialize the grids
 * @param length
 * @returns {kendo.data.DataSource}
 */
function getDatasource(length){
	return new kendo.data.DataSource({
		pageSize: 500,
		data: getGridArray(length),
		schema: {
			model: {
				id: "Location",
				fields: {
					isFilter: {
						type: "boolean"
					},
					Location: {
						type: "string"
					},
					Activity: {
						type: "string"
					},
					Day: {
						type: "string"
					},
					Transits: {
						type: "string"
					},
					transitType: {
						type: "string"
					},
					facilityType:{
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
function init_ActivityKendoGrid(grid_Id, locations, activities, days,dataSource,isPrimary) {

	var deleteRowTemplate="#= imageRowTemplate(data,'"+grid_Id+"','"+ICON_IMAGE_PATH_CLOSE+"','deleteRowHandler')#";
	var checkboxRowTemplate="#= checkboxRowTemplatehandler(data,'"+grid_Id+"')#";
	var	calenderRowTemplate="#= calenderRowEditor(data,'"+grid_Id+"') #";
	var locTemplate="<span style='white-space: nowrap;width:auto;'> #: locCd #  -  #: city #</span>";
	var TEMPLATE_SSMM = "<span style='white-space: nowrap;width:auto;'> #:value# - #:desc#"+"</span>";
	var transitTypesdata;
	var smOrMMTypesdata;
	var dayTitle = TITLE_DAYS;
	var locTooltip=HEADER_LABEL_LOCS_PRI;
	var dayWidth="48px";
	var height="90";
	if(!isPrimary){
		transitTypesdata=getTransitTypes(false);
		smOrMMTypesdata =getSMorMMTypes();
		dayTitle = TITLE_DAY;
		createCustomDataBinder();
		locTooltip=HEADER_LABEL_LOCS;
		dayWidth = "25px";
		height="112";
	}
	var grid =$(HASH_STRING + grid_Id).kendoGrid({
		scrollable: true,
		dataSource: dataSource,
		pageable: false,
		height:height,
		selectable:false,
		change: function(){
			var grid = $(HASH_STRING+grid_Id).data("kendoGrid");
			grid.selectable=false;
			grid.editable=true;
		},
		columns: [
		          {title: EMPTY_STRING, width: "16px", attributes: { style:"padding-left:2px !important;"}, template: checkboxRowTemplate},
		          {
		        	  field: "Location",
		        	  title: TITLE_LOCS,
		        	  width:"60px",
		        	  editor: function(container, options) {gridCellEditor(container, options,grid_Id,'locations',LOCCD,locTemplate,true);},
		        	  headerAttributes: {
		        		  title:locTooltip,
		        		  style: "text-align:center"
		        	  }
		          }, {
		        	  field: "Activity",
		        	  title: TITLE_ACTIVITY,
		        	  width:"40px",
		        	  editor: function(container, options) {gridCellEditor(container, options,grid_Id,'activities');},
		        	  headerAttributes: {
		        		  title:HEADER_LABEL_ACTIVITIES,
		        		  style: "text-align:center"
		        	  }
		          }, {
		        	  field: "Day",
		        	  title: dayTitle,
		        	  width:dayWidth,
		        	  editable:true,
		        	  attributes: { style:"border-right:none !important"},
		        	  headerAttributes: {
		        		  title:HEADER_LABEL_DAYS,
		        		  style: "text-align:center;padding-right: 0px !important;padding-left:12px !important;overflow:visible !important; border-right:none !important"
		        	  }
		          },
		          {
		        	  title: EMPTY_STRING,
		        	  template: calenderRowTemplate,
		        	  width:"14px",
		        	  editable:false,
					  attributes: { style:"text-align:center; padding-right: 1px !important; padding-left: 2px !important;border-left:none;"},
					  headerAttributes: {
						  style: "text-align:right;padding-right:0px !important;padding-left:0px !important; border-left:none; background:transparent;"
		        	  }
		          }
		          , {
		        	  field: "Transits",
		        	  title: TITLE_TRANSITS,
		     	  	  width:"85px",
		        	  hidden:isPrimary,			
		        	  editor: function(container, options) {gridkendoAutoCompleteEditor(container, options,grid_Id,locations,LOCCD);},
		        	  headerAttributes: {
		        		  title:HEADER_LABEL_TRANSIT,
		        		  style: "text-align:center;"
		        	  }
		          }
		          , {
		        	  field: "transitType",
		        	  title: TITLE_TRANSIT_TYPE,
		     	  	  width:"80px",
		        	  hidden:isPrimary,
		        	  editor: function(container, options) {gridKendoComboBoxEditor(container, options,grid_Id,transitTypesdata,true);},
		        	  headerAttributes: {
		        		  title:HEADER_LABEL_TRANSIT_TYPE,
		        		  style: "text-align:center"
		        	  }
		          }, {
		        	  field: "SM",
		        	  title: TITLE_SM,
		       	  	  width:"30px",
		        	  hidden:isPrimary,
		        	  editor: function(container, options) {gridKendoComboBoxEditor(container, options,grid_Id,smOrMMTypesdata,true,"value",TEMPLATE_SSMM,true);},
		        	  headerAttributes: {
		        		  title:HEADER_LABEL_SM,
		        		  style: "text-align:center"
		        	  }
		          }, {
		        	  field: "MM",
		        	  title: TITLE_MM,
		        	  width:"30px",
		        	  hidden:isPrimary,
		        	  editor: function(container, options) {gridKendoComboBoxEditor(container, options,grid_Id,smOrMMTypesdata,true,"value",TEMPLATE_SSMM,true);},
		        	  headerAttributes: {
		        		  title:HEADER_LABEL_MM,
		        		  style: "text-align:center"
		        	  }
		          },
		          {
		        	  field: "facilityType",
		        	  title: "facilityType",
		        	  width:"70px",
		        	  hidden:true
		          },
		          {title: EMPTY_STRING, width: "20px", template: deleteRowTemplate, attributes: { style:"padding-left:0px; padding-right:0px; text-align:center"}},
		          ],
		          editable: true,
		          editable: {
		              confirmation: false
		          },
		          navigatable: true,
		          edit: function(e) {
		        	  $(".k-edit-cell").find("input").focus();
		        	  $(".k-edit-cell").find("input").select();
		        	  if($(".k-edit-cell").find("input")[0].attributes['data-bind'] != undefined &&
		        			  $(".k-edit-cell").find("input")[0].attributes['data-bind'].value=="value:Day"){
		        		  $(".k-edit-cell").find("input").bind('keyup', function(event) {
		        			  var inputEdit=$(".k-edit-cell").find("input");
			        			  var isValid=true;
			        			  if(inputEdit.parent().parent().parent().parent().parent().parent()[0]!=null){
			        				  if(event.keyCode==8 ||event.keyCode==9 ){//backspace && tab
			        					  if (inputEdit[0].value==EMPTY_STRING) {
			        						  inputEdit[0].kendoBindingTarget.source.Day=EMPTY_STRING;
						        			  validateCheckBoxStatus(null,inputEdit[0].kendoBindingTarget.source,$(event.currentTarget.parentElement.parentElement));
			        					  }
			        					  event.preventDefault();
			        					  return;
			        				  }
			        				if (inputEdit[0].value != EMPTY_STRING) {
				        				if (inputEdit.parent().parent().parent().parent().parent().parent()[0].id=="priActivitiesGrid"){
				  		 	                	isValid= validateMultipleDayExp(inputEdit[0].value);
				  		            	}else{
				  		            			isValid= validateSingleDayExp(inputEdit[0].value);
				  		            	}
			        				}else{
			        					validateCheckBoxStatus(null,inputEdit[0].kendoBindingTarget.source,$(event.currentTarget.parentElement.parentElement)[0]);
			        				}	
			  		            	if(isValid){
			  		            		isValid= validateCaseDates(event);
			  		            	}	
			  		            	if(!isValid){
			  		            		parent.showFilterErrorMsg(NOT_ENOUGH_DAYS_IN_PLAN_ERROR);
			  		            		inputEdit[0].value="";
			  		            		inputEdit[0].kendoBindingTarget.source.Day=inputEdit[0].value;
			  		            		return true;
			  		            	}else{
			  		            		if(inputEdit[0].value != EMPTY_STRING && event.currentTarget != null && event.currentTarget.parentElement != null && event.currentTarget.parentElement.parentElement !=null 
			  		            				&& $(event.currentTarget.parentElement.parentElement)[0] != null && $(event.currentTarget.parentElement.parentElement)[0].children[0] != null){
			  		            			$(event.currentTarget.parentElement.parentElement)[0].children[0].children[0].checked=true;
			  		            			checkboxRowHandler($(event.currentTarget.parentElement.parentElement)[0].children[0].children[0]);
			  		            			inputEdit[0].kendoBindingTarget.source.Day=inputEdit[0].value;
			  		            		}
			  		            		parent.closeHeaderMsgWin();//if all ready open
			  		            	}
			  	            	}
		        		  } );
		        	  }
		          }    
	});
	/*(function ($, kendo) {
	    //Extending the Grid build in validator
	    $.extend(true, kendo.ui.validator, {
	        rules: {
	            // custom rules
	            custom: function (input, params) {
	            	if(input.parent().parent().parent().parent().parent().parent()[0]!=null){
		            	if (input.parent().parent().parent().parent().parent().parent()[0].id=="priActivitiesGrid"){
		            		if (input[0].name=="Day" && input[0].value!=EMPTY_STRING) {
		 	                	return validateMultipleDayExp(input[0].value);
		 	                }
		            	}else{
		            		 if (input[0].name=="Day" && input[0].value!=EMPTY_STRING) {
		 	                	return validateSingleDayExp(input[0].value);
		 	                }
		            	}
	            	}	
	                //check for the rule attribute
	                return true;
	            }
	        },
	        messages: { //custom rules messages
	            custom: function (input) {
	                // return the message text
	            	parent.showFilterErrorMsg("please Enter Valid Day(s)!");    	
	                return EMPTY_STRING;
	            }
	        }
	    });
	})(jQuery, kendo);*/
}

/**
 * custom cell editor for grid to create and render kendoAutocomplete
 * @param container
 * @param options
 * @param grid_Id
 * @param dataSource
 * @param dataTextField
 * @param gridTemplate
 * @param validateDataSource
 */
function gridCellEditor(container, options,grid_Id,dataSourceType,dataTextField,gridTemplate,validateDataSource) {
	var dataSource = getDatasourceByType(dataSourceType);
	if(dataSource == undefined){
		dataSource = dataSourceType;
	}
	
	if(validateDataSource){
		if(options.model.facilityType=="" || options.model.facilityType=="locList" ){
			dataSource = queryDatasources["ActivityFacilities"];
			gridTemplate=TEMPLATE_LOCATIONS;
			dataTextField=LOCCD;
		}else if(options.model.facilityType=="Country"){
			dataSource=queryDatasources["CountryCodes"];
			gridTemplate=TEMPLATE_COUNTRYCODE;
			dataTextField=COUNTRYCODE;
		}else if(options.model.facilityType=="FacGrp"){
			dataSource=queryDatasources["FacilityGroups"];
			gridTemplate=TEMPLATE_FACGROUP;
			dataTextField=GROUPNAME;
		}else if(options.model.facilityType=="Rgn"){
			dataTextField=GLOBALRGNCD;
			dataSource=queryDatasources["GlobalRegions"];
			gridTemplate=TEMPLATE_GLOBALRGN;
		} 
	}else{
	//To update activities dataSource if the row have any location available.
	//only activities specfic to locations are available in the list.
		if(options.field == "Activity" && container != null && container.parent() != null && container.parent()[0] != null && container.parent()[0].cells != null && 
				(container.parent()[0].cells[9].innerText == "" || container.parent()[0].cells[9].innerText == "LocCd")){ // to update the dataSource of activities cell if some location is provided 
			var selectedLocCd, tempDataS;
			if(container.prev() != null && container.prev()[0] != null){
				selectedLocCd = container.prev()[0].innerText;
				tempDataS = getActivitiesData(selectedLocCd);
				if(tempDataS != null){
					dataSource = tempDataS;
					dataSource.read();
				}
			}	
				selectedLocCd = tempDataS = undefined;
		}
	}
	var locationAutocomplete;
	if (options.model.facilityType=="" || options.model.facilityType=="locList" ){
		locationAutocomplete = $('<input name="' + options.field +'"'+EMPTY_STRING+'/>').appendTo(container).kendoAutoComplete({
			minLength: 0,
			dataTextField: dataTextField,
			filter: FILTER_TYPE_STARTS_WITH,
			select: function(e) {onAutocompleteSelect(e, options,grid_Id,this);},
			animation : false,
			dataSource: (dataSource)
		});		
	} else {
		locationAutocomplete = $('<input name="' + options.field +'"'+EMPTY_STRING+'/>').appendTo(container).kendoAutoComplete({
			minLength: 0,
			dataTextField: dataTextField,
			filter: FILTER_TYPE_STARTS_WITH,
			select: function(e) {onAutocompleteSelect(e, options,grid_Id,this);},
			dataSource: (dataSource)
		});
	}

	if(gridTemplate){
		$(locationAutocomplete).data("kendoAutoComplete").setOptions({template:gridTemplate});
		$(locationAutocomplete).data("kendoAutoComplete").list.addClass("locList");
	}else{
		$(locationAutocomplete).data("kendoAutoComplete").list.addClass("actList");//style for activity list
	}
	//addblankSearch(locationAutocomplete);
	//addKeyUpHandler(locationAutocomplete,options,grid_Id);
	addKeyDownHandler(locationAutocomplete,options,dataSource,grid_Id,validateDataSource, $(locationAutocomplete).data("kendoAutoComplete"));
	//addfocusOutHandler(locationAutocomplete,options,dataSource,grid_Id);
	//addSelectListner(locationAutocomplete,options,dataSource,grid_Id);
}

/**
 * select handler for kendoAutoComplete in query Grid's
 * @param e
 * @param options
 * @param grid_Id
 * @param locationAutocomplete
 */
function onAutocompleteSelect(e, options,grid_Id,locationAutocomplete){
	// locationAutocomplete.select(e.item);
	locationAutocomplete.trigger("change");
	locationAutocomplete.close();
	var currentTD =locationAutocomplete.wrapper.parent();
	if(currentTD[0]!=null){
		//fix #390
		var textVal=e.sender.element[0].value;
		if(((textVal).toString()).lastIndexOf(COMMA_STRING) >= 0){
			currentTD[0].title=textVal.substring(0,((textVal).toString()).lastIndexOf(COMMA_STRING)+1)+e.item[0].innerHTML;
		}else{
			textVal=e.item[0].innerText;
			if((textVal).lastIndexOf(TEMPLETE_HYPHEN)>=0){
				currentTD[0].title=(textVal).substring(0,(textVal).lastIndexOf(TEMPLETE_HYPHEN));
			}else{
				currentTD[0].title=textVal;
			}
		}
	}
	var currentTR = (currentTD).parent();
	if(currentTR[0]!=null && currentTR[0].children[0] !=null && currentTR[0].children[0].children[0] !=null){
		currentTR[0].children[0].children[0].checked=true;
		checkboxRowHandler(currentTR[0].children[0].children[0]);
	}	
	validateAndMoveCusor(grid_Id,currentTD,currentTR,options);
	
}

/**
 * method to add focusOut Handler to kendoAutoComplete
 * @param locationAutocomplete
 * @param options
 * @param grid_Id
 */
function addfocusOutHandler(locationAutocomplete,options,grid_Id){
	locationAutocomplete.focusout(function(evt) {
		if(locationAutocomplete[0] != null)
		locationAutocomplete[0].value=EMPTY_STRING;
		return;
	});
}

/**
 * method to add KeyUp Handler to kendoAutoComplete
 * @param locationAutocomplete
 * @param options
 * @param grid_Id
 */
function addKeyUpHandler(locationAutocomplete,options,grid_Id){
	locationAutocomplete.keyup(function(evt) {
		if (event.ctrlKey  || event.metaKey || evt.keyCode==17 || evt.key=="Control" || evt.key == "%" || evt.key == "Shift" || evt.key =="Enter") {//ctrl event are handled in keydown handler
			return;
		}
		var evtobj=window.event? event : evt;
		var unicode=evtobj.charCode? evtobj.charCode : evtobj.keyCode;
				var actualkey=String.fromCharCode(unicode);
				keyPressHandler(actualkey,locationAutocomplete,options,grid_Id);

	});
}
/*
 *		Ctrl-L list for location selection
 *		Ctrl-C list for Country Code selection
 *		Ctrl-G list for facility group selection
 *		Ctrl-R list for Global Region selection
 */
/**
 * method to add KeyDown Handler to kendoAutoComplete, and Ctrl-L list for location,Ctrl-C list for Country Code,Ctrl-G list for facility group and Ctrl-I list for Global Region selection
 * @param locationAutocomplete
 * @param options
 * @param dataSource
 * @param grid_Id
 * @param validateDataSource
 */
function addKeyDownHandler(locationAutocomplete,options,dataSource,grid_Id, validateDataSource, kendoAutoCompleteObj){
	
	locationAutocomplete.keydown(function(event) {
		if(event.altKey){
			return;
		}else if (validateDataSource && (event.ctrlKey || event.metaKey)) {
			switch (String.fromCharCode(event.which).toLowerCase()) {
			case 'l':
				updateLocsAutoComplete(locationAutocomplete,LOCCD,"ActivityFacilities","locList",TEMPLATE_LOCATIONS,'LocCd',grid_Id);
				var kendoAutoComplete = locationAutocomplete.data("kendoAutoComplete");
				kendoAutoComplete.close();
				break;
			case 'c':
				updateLocsAutoComplete(locationAutocomplete,COUNTRYCODE,"CountryCodes","countryCodeList",TEMPLATE_COUNTRYCODE,'Country',grid_Id);
				break;
			case 'g':
				updateLocsAutoComplete(locationAutocomplete,GROUPNAME,"FacilityGroups","groupNameList",TEMPLATE_FACGROUP,'FacGrp',grid_Id);
				break;
			case 'i':
				updateLocsAutoComplete(locationAutocomplete,GLOBALRGNDESC,"GlobalRegions","globalRegionList",TEMPLATE_GLOBALRGN,'Rgn',grid_Id);
				break;
			}
		}else if(event.key =="%" || event.key =="Enter"){
			var actualkey =event.key;
			keyPressHandler(actualkey,locationAutocomplete,options,grid_Id, kendoAutoCompleteObj);
		}else if(event.keyCode =="9" || event.keyCode =="13" || event.keyCode == "27" || event.keyCode == "37"){//key code for tab, 27 for esc
			var actualkey =event.keyCode;
			keyPressHandler(actualkey,locationAutocomplete,options,grid_Id, kendoAutoCompleteObj);
		}else if(event.keyCode =="53"){//key code for %
			var actualkey ="%";
			keyPressHandler(actualkey,locationAutocomplete,options,grid_Id, kendoAutoCompleteObj);
		}else{
			var evtobj=window.event? event : evt;
			var unicode=evtobj.charCode? evtobj.charCode : evtobj.keyCode;
			var actualkey=String.fromCharCode(unicode);
			setTimeout(function(){
				keyPressHandler(actualkey,locationAutocomplete,options,grid_Id, kendoAutoCompleteObj);
			}, 200);	
		}
	});
	
	
	locationAutocomplete.blur(function(event) {//on focusout call keyPress handler using keycode 9(tab)
		//fixed smart board issue
		if($(locationAutocomplete).list != undefined){
			keyPressHandler("9",locationAutocomplete,options,grid_Id, kendoAutoCompleteObj);
		}
	});
}

/**
 * method to update the kendoAutoComplete on Ctrl + options to support various dataSources.
 * @param locationAutocomplete
 * @param dataTextField
 * @param datasourceType
 * @param widthClass
 * @param template
 * @param facilityType
 * @param grid_Id
 */
function updateLocsAutoComplete(locationAutocomplete,dataTextField,datasourceType,widthClass,template,facilityType,grid_Id){
	if (grid_Id == "priActivitiesGrid" && (datasourceType != "FacilityGroups" && datasourceType != "ActivityFacilities")){
		return;
	}else{
		var autocomplete = $(locationAutocomplete).data("kendoAutoComplete");
		addblankSearch(locationAutocomplete);
		autocomplete.setOptions({dataTextField:dataTextField});
		autocomplete.setDataSource(queryDatasources[datasourceType]);
		autocomplete.list.addClass(widthClass);
		autocomplete.setOptions({template:template});
		autocomplete.value(EMPTY_STRING);
		autocomplete.dataSource.filter([]);
		autocomplete.refresh();
		var firstItem = $('#'+grid_Id).data().kendoGrid.dataSource.data()[locationAutocomplete.parent().parent().parent().index()];
		firstItem.set('facilityType',facilityType);
		setSelectedFacilityType(facilityType, grid_Id);
		event.preventDefault();
	}
	
}

/**
 * method to validate and select the valid entry on tab key
 * @param listChildren
 * @param textContent
 * @param dataTextField
 * @returns {Boolean}
 */
function isValidSelectionOntab(listChildren,textContent,dataTextField){
	if(listChildren != undefined){
		for(var i=0;i<listChildren.length;i++){
			if(dataTextField==LOCCD && listChildren[i].locCd.toUpperCase() === textContent.toUpperCase()){//for locCd 
				return {result:true,index:i};
			}else if(dataTextField==PRODOFFSET && listChildren[i].productName.toUpperCase() === textContent.toUpperCase()){//prodGrpName
				return {result:true,index:i};
			}else if(dataTextField==PRODGROUPMASKID && listChildren[i].prodGrpName.toUpperCase() === textContent.toUpperCase()){//for productName
				return {result:true,index:i};
			}else if(dataTextField==EQTYPE && listChildren[i].eqType.toUpperCase() === textContent.toUpperCase()){//for eqType
				return {result:true,index:i};
			}else if(dataTextField==LEGTYPECD && listChildren[i].legTypeCd.toUpperCase() === textContent.toUpperCase()){//for legTypeCd 
				return {result:true,index:i};
			}else if(dataTextField==COUNTRYCODE && listChildren[i].countryCode.toUpperCase() === textContent.toUpperCase()){//for country 
				return {result:true,index:i};
			}else if(dataTextField== GROUPNAME && listChildren[i].groupName.toUpperCase() === textContent.toUpperCase()){//for groups
				return {result:true,index:i};
			}else if(dataTextField==GLOBALRGNDESC && listChildren[i].globalRgnDesc.toUpperCase() === textContent.toUpperCase()){//for global Rgn 
				return {result:true,index:i};
			}else if(dataTextField==EMPTY_STRING && listChildren[i]==textContent){//for others 
				return {result:true,index:i};
			} 
		}
	}
	return {result:false,index:-1};
}

/**
 * method to handle the keyPress event on kendoAutoComplete in query grids
 * @param actualkey
 * @param locationAutocomplete
 * @param options
 * @param grid_Id
 */
function keyPressHandler(actualkey,locationAutocomplete,options,grid_Id, kendoAutoCompleteObj){
	var kendoAutoComplete = locationAutocomplete.data("kendoAutoComplete");
	if(kendoAutoComplete == undefined){
		kendoAutoComplete =  kendoAutoCompleteObj;
	}
	var isEmpty;
	if(actualkey =="\b" || actualkey == "27" || actualkey == "37"){
		return;
	}
	if((locationAutocomplete[0].value).trim() == EMPTY_STRING){
		isEmpty = true;
	}
	if(locationAutocomplete != null && locationAutocomplete[0] != null && locationAutocomplete[0].value != null){
		if (kendoAutoComplete && kendoAutoComplete.value() != undefined) {
			locationAutocomplete[0].value = kendoAutoComplete.value().toUpperCase();//to change the input to upper case
		}
	}
	var currentTD = locationAutocomplete.parent().parent();
	
	if(actualkey=="9" || actualkey=="13" ){//keyCode for tab and Enter
//TODO:		bypassing the validation for groups will update as per inputs from fedEx team
		if(kendoAutoCompleteObj.options.dataTextField != GROUPNAME && !validateAlphaNumAndPercntExp(locationAutocomplete[0].value) || (locationAutocomplete[0].value).indexOf("%") < 0 && !(isValidSelectionOntab(
				kendoAutoComplete!= undefined? kendoAutoComplete.dataSource._data:undefined,
				locationAutocomplete[0].value,
				kendoAutoComplete!= undefined?kendoAutoComplete.options.dataTextField:EMPTY_STRING).result)){
			locationAutocomplete[0].value = EMPTY_STRING;
			if(currentTD != null && currentTD[0]!=null && locationAutocomplete[0].kendoBindingTarget != undefined){
				currentTD[0].title = EMPTY_STRING;
				if(options.field == "Location"){
					locationAutocomplete[0].kendoBindingTarget.source.Location = EMPTY_STRING;
				}else if(options.field == "Activity"){
					locationAutocomplete[0].kendoBindingTarget.source.Activity = EMPTY_STRING;
				}
				validateCheckBoxStatus(locationAutocomplete,locationAutocomplete[0].kendoBindingTarget.source,(currentTD).parent());
			}
			if(!isEmpty){
				if(grid_Id == "preActivitiesGrid"){
					parent.showFilterErrorMsg("Invalid "+options.field+" in previous subwindow");
				}else if(grid_Id == "priActivitiesGrid"){
					parent.showFilterErrorMsg("Invalid "+options.field+" in primary subwindow");
				}else if(grid_Id == "nxtActivitiesGrid"){
					parent.showFilterErrorMsg("Invalid "+options.field+" in next subwindow");
				}
			}	
		}else{
			if(currentTD != null && currentTD[0]!=null){
				currentTD[0].title=locationAutocomplete[0].value;
			}
			var currentTR = (currentTD).parent();
			if(currentTR != null && currentTR[0]!=null && currentTR[0].children[0] !=null && currentTR[0].children[0].children[0] !=null){
				currentTR[0].children[0].children[0].checked=true;
				checkboxRowHandler(currentTR[0].children[0].children[0]);
			}
			if(actualkey=="13" ){
				validateAndMoveCusor(grid_Id,currentTD,currentTR,options);
			}
		}	
		if(kendoAutoComplete != undefined){
			kendoAutoComplete.close();
		}
		
		return;
	}
	if( !( (actualkey == "'" || actualkey == "(" || actualkey == ")" || actualkey == "&" || actualkey == "%"))){
		if(kendoAutoComplete == undefined){
			return;
		}
		kendoAutoComplete.search(kendoAutoComplete.value()); 
		kendoAutoComplete.refresh();
	}
	if (options.field=="Location"){
		return;
	}
	var listChildren = kendoAutoComplete.ul.children();
	if(listChildren != null){
		if((listChildren.length  == 1 && !(actualkey == "(" || actualkey == ")" || actualkey == "&")) || actualkey =="%" || actualkey =="Enter"){
			var t1 = setTimeout(function(){
				if(listChildren[0] !=null && actualkey != "%" && actualkey !="Enter"){
					kendoAutoComplete.select(listChildren[0]);
				}
				// need to ask if we are skipping for some specfic requirement 
				/*if (actualkey == "%") {
					return;
				}*/
				
				kendoAutoComplete.trigger("change");
				kendoAutoComplete.close();
				var currentTD = locationAutocomplete.parent().parent();
				if(currentTD != null && currentTD[0]!=null){
					currentTD[0].title=locationAutocomplete[0].value;
				}
				var currentTR = (currentTD).parent();
				if(currentTR != null && currentTR[0]!=null && currentTR[0].children[0] !=null && currentTR[0].children[0].children[0] !=null){
					currentTR[0].children[0].children[0].checked=true;
					checkboxRowHandler(currentTR[0].children[0].children[0]);
				}	
				validateAndMoveCusor(grid_Id,currentTD,currentTR,options);
			}, 100);
		}
	}
}

/**
 * method to validate the grid row for data and enable/disable row checkbox.  
 * @param locationAutocomplete
 * @param source
 * @param currentTR
 */
function validateCheckBoxStatus(locationAutocomplete,source,currentTR){
	if(source.Location == EMPTY_STRING && source.Activity == EMPTY_STRING && source.Day == EMPTY_STRING	
			&& source.Transits == EMPTY_STRING && source.transitType == EMPTY_STRING){
			if(currentTR != null && currentTR[0]!=null && currentTR[0].children[0] !=null && currentTR[0].children[0].children[0] !=null){
				currentTR[0].children[0].children[0].checked=false;
				$(currentTR[0].children[0].children[0])[0].disabled=true;
			}
		}
}

/**
 * method to validate and move the cursor to next entry on the valid selection
 * @param grid_Id
 * @param currentTD
 * @param currentTR
 * @param options
 */
function validateAndMoveCusor(grid_Id,currentTD,currentTR,options){

	if(validateAndInsert(grid_Id,currentTD,currentTR)){
		setTimeout(function (){	
			if(options.field =="Location" && grid_Id =="priActivitiesGrid"){
				$(HASH_STRING+grid_Id).find("tr:last").prev().find('td:nth-child(3)').click();						
			}else if(options.field =="Activity"){
				$(HASH_STRING+grid_Id).find("tr:last").prev().find('td:nth-child(4)').click();						
			}else{
				$(HASH_STRING+grid_Id).find("tr:last").find('td:nth-child(2)').click();						
			}
		}, 100);
	}else{
		setTimeout(function (){
			if(options.field =="Activity" ||(options.field =="Location" && grid_Id =="priActivitiesGrid")){
				if(currentTD){
					currentTD.next().click();
				}	
			}else{
				if(currentTR){
					if(options.field == "Transits") {
						currentTD.click();
						setTimeout(function(){
							currentTD.find("input")[0].selectionStart = currentTD.find("input")[0].selectionEnd +1;
						},100);
					}else{
						(currentTR.next().find('td:nth-child(2)')).click();
					}
				}
			}
		}, 100);
	}
}

/**
 * method to validate the current editing row and add empty row if grid don't have atleast one blank row.
 * @param grid_Id
 * @param currentTD
 * @param currentTR
 * @returns {Boolean}
 */
function validateAndInsert(grid_Id,currentTD,currentTR){
	if(currentTD){
		var rowValue;
		currentTR.each(function() {
			rowValue = $(this).text();
		});
		if(rowValue!=EMPTY_STRING || rowValue !=null){
			var kendoAutoComplete = (currentTR.find('td:nth-child(2)')).data("kendoAutoComplete");
			var grid = $(HASH_STRING+grid_Id).data("kendoGrid");
			var datasource = grid.dataSource;

			if(!isRowEmpty(datasource)){
				datasource.insert(datasource._data.length,{ Location: '', Activity: '' ,Day: ''});
				return true;
			}

		}
	}
	return false;
}

/**
 * custom cell editor for grid to render kendoAutocomplete for transits 
 * @param container
 * @param options
 * @param grid_Id
 * @param dataSource
 * @param dataTextField
 */
function gridkendoAutoCompleteEditor(container, options,grid_Id,dataSource,dataTextField) {
	var transitAutocomplete = $('<input  name="' + options.field +'"'+EMPTY_STRING+'/>').appendTo(container).kendoAutoComplete({
		dataSource: dataSource,
		dataTextField: dataTextField,
		select: function(e) {onAutocompleteSelect(e, options,grid_Id,this);},
		filter: FILTER_TYPE_STARTS_WITH,
		separator: " "
	});
	transitAutocomplete.keydown(function(evt) {
		kendoAutoCompleteEditorKeyPressHandler(evt,transitAutocomplete,options,grid_Id);
	});
	transitAutocomplete.blur(function(event) {//on focusout call keyPress handler using keycode 9(tab) defect #568
		kendoAutoCompleteEditorKeyPressHandler("9",transitAutocomplete,options,grid_Id);
	});
}

/**
 * method to handle keyPress event on transit kendoAutocomplete
 * @param evtobj
 * @param locationAutocomplete
 * @param options
 * @param grid_Id
 */
function kendoAutoCompleteEditorKeyPressHandler(event,transitAutocomplete,options,grid_Id){
	var eventKeyCode = null;
	
	if(event.hasOwnProperty('keyCode')){
		eventKeyCode = event.keyCode;
	}else{
		eventKeyCode = event;
	}
	if((event.hasOwnProperty('altKey') && event.altKey) || (event.hasOwnProperty('ctrlKey') && event.ctrlKey) || eventKeyCode == "35" || eventKeyCode == "36" || eventKeyCode == "37" || 
			eventKeyCode == "38"|| eventKeyCode == "39" || eventKeyCode == "40"){
		return;
	}
	var kendoAutoComplete = transitAutocomplete.data("kendoAutoComplete");
		if(transitAutocomplete != null && transitAutocomplete[0] != null && transitAutocomplete[0].value != null){
			setTimeout(function(){
				if (kendoAutoComplete && kendoAutoComplete.value() != undefined) {
					transitAutocomplete[0].value = kendoAutoComplete.value().toUpperCase();//to change the input to upper case
				}
			}, 10);	
			var currentTD = transitAutocomplete.parent().parent();
			if(eventKeyCode == "9" || eventKeyCode == "13"){//keyCode for tab and Enter
				var valuesArr;// = (transitAutocomplete[0].value).split(" ");
				if(transitAutocomplete[0].value != null && transitAutocomplete[0].value != EMPTY_STRING){
					valuesArr = (transitAutocomplete[0].value).split(" ");
				}
				var flag = false;
				if(valuesArr != null){
					for(var j=0; j < valuesArr.length; j++){
						if(valuesArr[j] != EMPTY_STRING ){
							if(valuesArr[j].indexOf("%") >= 0){
								flag = true;
							}else{
								flag = isValidSelectionOntab(
										kendoAutoComplete!= undefined ? kendoAutoComplete.dataSource._data:undefined,
												valuesArr[j],
												kendoAutoComplete!= undefined ?  kendoAutoComplete.options.dataTextField:EMPTY_STRING).result;
							}
						}	
						if(!flag){
							break;
						}
					}
				}
				
				if((transitAutocomplete[0].value != EMPTY_STRING && !validateAlphaSpaceAndPercntExp((transitAutocomplete[0].value).trim())) || 
						(valuesArr != null && !flag)){
					transitAutocomplete[0].value = EMPTY_STRING;
					if(currentTD != null && currentTD[0]!=null && transitAutocomplete[0].kendoBindingTarget != undefined){
						currentTD[0].title=EMPTY_STRING;
						if(options.field=="Transits"){
							transitAutocomplete[0].kendoBindingTarget.source.Transits=EMPTY_STRING;
						}
						validateCheckBoxStatus(transitAutocomplete,transitAutocomplete[0].kendoBindingTarget.source,(currentTD).parent());
					}
					if(grid_Id == "preActivitiesGrid"){
						parent.showFilterErrorMsg("Invalid transit location in previous subwindow");
					}else if(grid_Id == "nxtActivitiesGrid"){
						parent.showFilterErrorMsg("Invalid transit location in next subwindow");
					}
				}else{
					if(currentTD != null && currentTD[0] != null){
						currentTD[0].title = transitAutocomplete[0].value;
					}
					var currentTR = (currentTD).parent();
					if(transitAutocomplete[0].value != EMPTY_STRING && currentTR != null && currentTR[0] != null && currentTR[0].children[0] != null && currentTR[0].children[0].children[0] != null){
						currentTR[0].children[0].children[0].checked=true;
						checkboxRowHandler(currentTR[0].children[0].children[0]);
					}
				}	
				return;
			}
		}		
}

/**
 * method to create and render the kendoComboBox 
 * @param container
 * @param options
 * @param grid_Id
 * @param dataSource
 * @param isfirstValueBlank
 * @param dataTextField
 * @param dataTemplate
 * @param isSMMM
 */
function gridKendoComboBoxEditor(container, options,grid_Id,dataSource,isfirstValueBlank,dataTextField,dataTemplate,isSMMM) {
	if(options.field=="transitType"){
		if(options.model.Transits != undefined && options.model.Transits.trim() !=EMPTY_STRING){
			dataSource=getTransitTypes(true);
		}
	}
	var comboinput;
	if(isSMMM){
		comboinput='<input data-text-field="'+dataTextField+'"  data-skip = "true" data-value-field="'+dataTextField+'" data-bind="nullableValue:' + options.field + '"/>';
	}else{
		comboinput='<input  name="' + options.field +'"'+EMPTY_STRING+'/>';
	}	
	var kendoComboBoxEditor = $(comboinput).appendTo(container).kendoComboBox({
		minLength: 0,
		filter: FILTER_TYPE_STARTS_WITH,
		dataSource: dataSource,
		template:dataTemplate,
		dataTextField:dataTextField,
		select : onChangeCombo
	});
	if(isfirstValueBlank){
		$(kendoComboBoxEditor).data("kendoComboBox").one("open", function() {
			if(this.ul[0].firstChild.textContent=="  - " || this.ul[0].firstChild.textContent==" "){
				$(this.ul[0].firstChild).html("&nbsp;");
			}
	    });
	}
	if(isSMMM){
		$(kendoComboBoxEditor).data("kendoComboBox").list.addClass("smMMList");
	}
	$(kendoComboBoxEditor).data("kendoComboBox").input.bind("keydown", function(evt) {
		var evtobj=window.event? event : evt;
		var unicode=evtobj.charCode? evtobj.charCode : evtobj.keyCode;
				var actualkey=String.fromCharCode(unicode);

				var kendoAutoComplete = kendoComboBoxEditor.data("kendoComboBox");
				if(actualkey =="\b"){
					return;
				}
				var listChildren;
				setTimeout(function(){
					listChildren = kendoAutoComplete.dataSource._view;
				if(listChildren != null){
					if((listChildren.length  == 1 && !(actualkey == "(" || actualkey == ")" || actualkey == "&")) || actualkey =="%" || actualkey =="Enter"){
						var t1 = setTimeout(function(){
							if(listChildren[0] !=null && actualkey != "%" && actualkey !="Enter"){
								if(listChildren[0].value != null){
									kendoAutoComplete.value(listChildren[0].value);
								}else{
									kendoAutoComplete.value(listChildren[0]);
								}
							}	
							kendoAutoComplete.trigger("change");
							kendoAutoComplete.close();
							var currentTD = kendoComboBoxEditor.parent().parent();
							if(currentTD != null && currentTD[0]!=null){
								if(listChildren[0].value !=null && listChildren[0].desc !=null){
									currentTD[0].title=listChildren[0].value +"-"+listChildren[0].desc;
								}else{
									currentTD[0].title=listChildren[0];
								}	
							}
							var currentTR = (currentTD).parent();
							if(currentTR != null && currentTR[0]!=null && currentTR[0].children[0] !=null && currentTR[0].children[0].children[0] !=null){
								currentTR[0].children[0].children[0].checked=true;
								checkboxRowHandler(currentTR[0].children[0].children[0]);
							}
								setTimeout(function (){
									if(options.field !="MM"){
										if(currentTD){
											currentTD.next().click();
										}	
									}else{
										if(currentTR ){
											(currentTR.next().find('td:nth-child(2)')).click();
										}
									}
								}, 100);
						}, 100);
					}
				}
				},200);	


	});
}

/**
 * method to handle select event of kendoComboBox
 * @param evt
 */
function onChangeCombo(evt) {
	try {
		if (evt.sender.value()!=EMPTY_STRING) {
			evt.sender.element.parent().parent().parent()[0].firstChild.firstChild.checked = true;
		}
	}catch(e){
		//alert("Error occured while setting the check box");
	}
}

/**
 * method to validate if last row is empty in the grid
 * @param datasource
 * @returns {Boolean}
 */
function isRowEmpty(datasource){
	if(datasource._data.length > 0){
		var len=datasource._data.length-1;
		if(datasource._data[len].Activity !=EMPTY_STRING || datasource._data[len].Location!=EMPTY_STRING || datasource._data[len].Day !=EMPTY_STRING){
			return false;
		}
	}
	return true;
}

var rowCount=1;
/**
 * custom item editor to render delete button in query grids
 * @param model
 * @param grid_Id
 * @param iconUrl
 * @param imageClickMethod
 * @returns {String}
 */
function imageRowTemplate(model,grid_Id,iconUrl,imageClickMethod) {
	var grid = $(HASH_STRING+grid_Id).data("kendoGrid");
	var datasource = grid.dataSource;
	if(rowCount==datasource._data.length){
		rowCount=1;
		return "<img title='Add a row' src ='"+ICON_IMAGE_PATH_ADD+"' onclick=addRowHandler(this,"+grid_Id+") />";
	}else{
		rowCount= rowCount+1;
	}

	return "<img title='Remove a row' src ='"+iconUrl+"' onclick="+imageClickMethod+"(this,"+grid_Id+") />";
} 

var checkboxCount=0;
/**
 * custom item editor to render row selection checkbox in query window 
 * @param model
 * @param grid_Id
 * @returns {String}
 */
function checkboxRowTemplatehandler(model,grid_Id) {
	var grid = $(HASH_STRING+grid_Id).data("kendoGrid");
	var datasource = grid.dataSource;
	if(datasource._data[checkboxCount].Activity !=EMPTY_STRING || datasource._data[checkboxCount].Location!=EMPTY_STRING || datasource._data[checkboxCount].Day !=EMPTY_STRING){
		if(checkboxCount ==(datasource._data.length-1)){
			checkboxCount=-1;
		}
		checkboxCount=checkboxCount + 1;
		return "<input id='chkBox"+model.uid+"' type='checkbox' checked='checked' onclick=checkboxRowHandler(this,'"+grid_Id+"') /><label></label>";
	}
	if(checkboxCount ==(datasource._data.length-1)){
		checkboxCount=-1;
	}
	checkboxCount=checkboxCount + 1;
	return "<input id='chkBox"+model.uid+"'  type='checkbox' disabled='disabled' onclick=checkboxRowHandler(this,'"+grid_Id+"') /><label></label>";
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
 * method to handle add row in query grids
 * @param deleteBtn
 * @param grid_Id
 */
function addRowHandler(deleteBtn,grid_Id) {
	var currentTR = $(deleteBtn).closest("tr");
	var grid = $(HASH_STRING+grid_Id.id).data("kendoGrid");
	var datasource = grid.dataSource;
	datasource.insert(datasource._data.length,{ Location: '', Activity: '' ,Day: ''});
	resetGridHeight(grid_Id);
	scrollToSelectedRow(grid);
//	resizeGrid(); 
}

/**
 *  method to handle deletion of the row in query grids
 * @param deleteBtn
 * @param grid_Id
 */
function deleteRowHandler(deleteBtn,grid_Id) {
	var currentTR = $(deleteBtn).closest("tr");
	var grid = $(HASH_STRING+grid_Id.id).data("kendoGrid");
	var datasource = grid.dataSource;
	/*var actyObj = datasource.getByUid($(currentTR).attr("data-uid"));
	if(actyObj != undefined && (actyObj["Location"] != "" || actyObj["Location"] != undefined) ){
		parent.VIEWER.setPlacemarkHighlight(false, actyObj["Location"]);
	}*/
	if(datasource._data.length > 1){// at least one row shud be there in the grid
		grid.removeRow(currentTR);
		resetGridHeight(grid_Id);
	}
}

/**
 *  method to handle in height of the grid on deletion/add of the row
 * @param grid_Id
 */
function resetGridHeight(grid_Id) {
	if(grid_Id.id == "priActivitiesGrid") {/*
		var gridDiv = $(HASH_STRING+grid_Id.id);
		var tableHeight = gridDiv.find("div.k-grid-content table").height();
		if(tableHeight < 66) {
			gridDiv.find("div.k-grid-content").height(tableHeight);
		}else {
			gridDiv.find("div.k-grid-content").height(66);
		}
	*/}
}

/**
 * method to scroll at last row
 * @param grid
 */
function scrollToSelectedRow(grid) {
//	console.log('scroll height.. '+grid.tbody.height());
    //    animate our scroll
    grid.element.find(".k-grid-content").animate({
        scrollTop: grid.tbody.height() //  scroll to the selected row given by 'this.select()'
    }, 1);
}

/**
 * custom item editor to render calender button in query grids
 * @param model
 * @param grid_Id
 * @returns {String}
 */
function calenderRowEditor(model,grid_Id) {
	return "<img title='Open calendar' src ='"+ICON_IMAGE_PATH_DAYS+"' style='margin-left:-1px' onclick=calenderRowHandler(this,"+grid_Id+") isOpenState='false'/>";
}

/**
 * click handler for calender button in query grids
 * @param calBtn
 * @param grid_Id
 */
function calenderRowHandler(calBtn,grid_Id) {
	var grid = $("#"+grid_Id.id).data("kendoGrid");
	var currentTR = $(calBtn).closest("tr");
	var childrens, selDays;
	if(currentTR && currentTR.length > 0){
		childrens = currentTR[0].childNodes;
		if(childrens && childrens.length > 3){
			selDays = childrens[3].innerText.replace(/\s{1,}/g, ',');
		}
	}
	if(selDays == "" || selDays == null){
		if($(".k-edit-cell").find("input") && $(".k-edit-cell").find("input").length > 0){
			selDays = ($(".k-edit-cell").find("input")[0].value).replace(/\s{1,}/g, ',');
		}
	}
	var isSingleSelection = true;
	if(grid_Id.id == "priActivitiesGrid") {
		isSingleSelection = false;
	}else{
		isSingleSelection = true;
	}
	calBtn.gridId = grid_Id.id;
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
		var childrens;
		if(currentTR && currentTR.length > 0){
			childrens = currentTR[0].childNodes;
			if(childrens && childrens.length > 3){
				childrens[3].innerText = selectedDays;
				grid.dataSource.data()[currentTR[0].sectionRowIndex].set("Day", selectedDays);
			}
		}
	}else{
		//spl case for depArrActTimeWindow cal btn
		$("#onDays")[0].value=selectedDays;
	}	
}

/**
 * method to enhance the control to support blank search
 * @param locationAutocomplete
 */
function addblankSearch(locationAutocomplete){
	try {
		var _autocomplete = $(locationAutocomplete).data("kendoAutoComplete");
		_autocomplete.search = function (word) {
			var that = this,
			options = that.options,
			ignoreCase = options.ignoreCase,
			separator = options.separator,
			length;
			word = word || that.value();
			that._current = null;
			clearTimeout(that._typing);
			if (separator) {
				word = wordAtCaret(caretPosition(that.element[0]), word, separator);
			}
			length = word.length;
			if (!length && !length == 0) {
				that.popup.close();
			} else if (length >= that.options.minLength) {
				that._open = true;
				that.dataSource.filter({
					value: ignoreCase ? word.toLowerCase() : word,
							operator: options.filter,
							field: options.dataTextField,
							ignoreCase: ignoreCase
				});
			}
		};
		_autocomplete.search(EMPTY_STRING);
	} catch (e) {
		console.log(e.message);
	}
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