<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
<head>
	<meta charset="utf-8" />
	<title>Kendo UI Grid - inline editing </title>
	<style>html { font-size: 12px; font-family: Arial, Helvetica, sans-serif; }</style>
	<link rel="stylesheet" href="http://cdn.kendostatic.com/2015.2.624/styles/kendo.common.min.css" />
    <link rel="stylesheet" href="http://cdn.kendostatic.com/2015.2.624/styles/kendo.default.min.css"" />
    <script src="http://cdn.kendostatic.com/2015.2.624/js/jquery.min.js"></script>
    <script src="http://cdn.kendostatic.com/2015.2.624/js/kendo.all.min.js"></script>
  
</head>
<body>
	<div id="contentGrid" style="width:95%; align=center;"></div>
    <br/>
	<script src="validationTableValidations.js"></script>
	<script>  	
		var dataSource = null;
		var selectedItems = null;
		var entityGrid = null;
		var companyList = [];
		var itemChanged = false;
		var disableDeleteBtn = false;
		
	 	$(document).ready(function(){
			loadData();
			//parent.disableSaveButton(true);
	 	});
	 	
		function onCreate(newItems){
			var lookupList;
			
			if(newItems.length > 0)
				lookupList = new Array();
								
			for (var i=0;i< newItems.length;i++) {
				lookupList.push({"assetCompanyCode":newItems[i].assetCompanyCode, "locationNumber":newItems[i].locationNumber, "locationDesc":newItems[i].locationDesc, "interfaceFlag":"N"});
			}
			
			$.ajax({
				type: 'POST', 
				url: 'prod.json',
				data : { action :'create', 
						 values : JSON.stringify(lookupList),
						 type:'com.spacetimeinsight.quanta.validation.ui.model.Location', 
						 renderertype:'com.spacetimeinsight.quanta.validation.ui.ValidationUIRenderer'},
				
				success: function(data, textStatus, jQxhr ){
					$("#contentGrid").data("kendoGrid").destroy();
					$("#contentGrid").empty();
								loadData();
								alert(data.statusMessage);
				}
			});
		}
		
		function onUpdate(items){
			var lookupList;
			
			if(items.length > 0)
				lookupList = new Array();
				
			for (var i=0;i< items.length;i++) {
				lookupList.push({"assetCompanyCode":items[i].assetCompanyCode, "locationNumber":items[i].locationNumber, "locationDesc":items[i].locationDesc, "interfaceFlag":items[i].interfaceFlag,"id":items[i].id});
			}
			
			//alert(msg);
								
			$.ajax({
				type: 'POST', 
				url: 'prod.json',
				data : { action :'update', 
						 values : JSON.stringify(lookupList),
						 type:'com.spacetimeinsight.quanta.validation.ui.model.Location', 
						 renderertype:'com.spacetimeinsight.quanta.validation.ui.ValidationUIRenderer'},
				
				success: function(data, textStatus, jQxhr ){
					//$("#contentGrid").data("kendoGrid").destroy();
					//$("#contentGrid").empty();
								loadData();
								alert(data.statusMessage);
				}
			});
		}
		
		/*function onSelect(e) {
			selectedItems = entityGrid.select();
			
			entityGrid.element.on('click', 'tbody>tr>td:not(.k-edit-cell)', function (e) {				
				entityGrid.closeCell();
			});
			entityGrid.element.on("dblclick", "tbody>tr>td:not(.k-edit-cell)", "dblclick", function (e) {
				entityGrid.editCell($(this));
			});
		}
		
		function grid_addNewRecord() {
			var grid = $("#contentGrid").data("kendoGrid");
			grid.addRow();
		}
		
		function grid_saveChanges() {
			if(confirm("Are you sure you want to save all changes?")){
				dataSource.sync();
				$("#contentGrid").data("kendoGrid").dataSource.read();
			}
		}
		
		function grid_cancelChanges() {
			if(confirm("Are you sure you want to cancel all the changes?")){
				$("#contentGrid").data("kendoGrid").cancelChanges();
			}
		}*/
		
		function deleteSelectedItems() {
			if(confirm("Are you sure you want to delete selected items?")){			
				var selectedItem;
				var lookupList;
			
				if(selectedItems.length > 0)
					lookupList = new Array();
					
				for (var i=0;i< selectedItems.length;i++) {
					selectedItem = entityGrid.dataItem(selectedItems[i])
					lookupList.push({"assetCompanyCode":selectedItem.assetCompanyCode, "locationNumber":selectedItem.locationNumber, "locationDesc":selectedItem.locationDesc, "interfaceFlag":selectedItem.interfaceFlag,"id":selectedItem.id});
				}
				
				//alert(msg);
									
				$.ajax({
					type: 'POST', 
					url: 'prod.json',
					data : { action :'delete', 
							 values : JSON.stringify(lookupList),
							 type:'com.spacetimeinsight.quanta.validation.ui.model.Location', 
							 renderertype:'com.spacetimeinsight.quanta.validation.ui.ValidationUIRenderer'},
					
					success: function(data, textStatus, jQxhr ){
						//$("#contentGrid").data("kendoGrid").destroy();
					//	$("#contentGrid").empty();
								loadData();
								alert(data.statusMessage);
					}
				});
				
				$("#contentGrid").data("kendoGrid").dataSource.read();
			}
		}
		function onSelectCompanyId(e){
		  var checkVariable = false;
		   companyId="";
		   var dataItem = this.dataItem(e.item);
			companyId =dataItem.assetCompanyCode;
		   if (companyId == "Select Company#") {
				//parent.disableSaveButton(true);
		   } else {
				var dataItem = entityGrid.dataItem($(e.sender.element).closest("tr"));
				if (isNull(dataItem.locationNumber) || isNull(dataItem.locationDesc)) {
					//parent.disableSaveButton(true);
				} else {
					//parent.disableSaveButton(false);
					for (var i =0; i <entityGrid.dataItems().length; i++) {
						if (entityGrid.dataItems()[i].uid != dataItem.uid) {
							if (isNull(entityGrid.dataItems()[i].locationNumber) || isNull(entityGrid.dataItems()[i].locationDesc) 
								|| isNull(entityGrid.dataItems()[i].assetCompanyCode) 
								|| entityGrid.dataItems()[i].assetCompanyCode == "Select Company#") {
								//parent.disableSaveButton(true);
								checkVariable = true;
								break;
							}
						}
					}
					if (!checkVariable) {
						//parent.disableSaveButton(false);
					}
				}
			}
		}
		 function enableDisableSaveBtns(cell) {
			var checkVariable=false;
			if (cell.attr("data-bind").indexOf("value:locationDesc") > -1 && isNull(cell.val())) {
				//parent.disableSaveButton(true);
				checkVariable = true;
			} else if(cell.attr("data-bind").indexOf("value:locationNumber") > -1 && isNull(cell.val())) {
				//parent.disableSaveButton(true);
				checkVariable= true;
			} 
			var dataItem = entityGrid.dataItem($(cell).closest("tr"));
			if (checkVariable)  {
				//parent.disableSaveButton(true);
			} else {
				if (cell.attr("data-bind").indexOf("value:locationDesc") > -1 && isNull(dataItem.locationNumber)) {
					//parent.disableSaveButton(true);
				} else if (cell.attr("data-bind").indexOf("value:locationNumber") > -1 && isNull(dataItem.locationDesc)) {
					//parent.disableSaveButton(true);
				} else {
					//parent.disableSaveButton(false);
				}	
			}
			if (isNull(dataItem.assetCompanyCode) || dataItem.assetCompanyCode == "Select Company#" ) {
				//parent.disableSaveButton(true);
			}
			for (var i =0; i <entityGrid.dataItems().length; i++) {
		 		if (entityGrid.dataItems()[i].uid != dataItem.uid) {
					if (isNull(entityGrid.dataItems()[i].locationNumber) || isNull(entityGrid.dataItems()[i].locationDesc) 
						|| isNull(entityGrid.dataItems()[i].assetCompanyCode) 
						|| entityGrid.dataItems()[i] == "Select Company#") {
							//parent.disableSaveButton(true);
						break;
				}
			 }
		   }
		   dataItem.dirty = true;
		   if (cell.attr("data-bind").indexOf("value:locationDesc") > -1) {
		   dataItem.set("locationDesc", cell.val());
		 //  dataItem.locationDesc = cell.val();
		   } else if (cell.attr("data-bind").indexOf("value:locationNumber") > -1) {
				 dataItem.set("locationNumber", cell.val());
			//dataItem.locationNumber = cell.val();
		   }
		   //cell.trigger("change").trigger("blur")
		//   dataSource.sync();
		 //  dataItem.fields["locationDesc"].validation = { valid : locationtype };
		   //entityGrid.trigger("change");
 		}
 		
		function companyCodeDropDownEditor(container, options) {
			$('<input required  data-bind="value:' + options.field + '" />')
                .appendTo(container)
                .kendoDropDownList({
                autoBind: false,
				optionLabel: "Select Company#",
				value:"--",
				dataTextField: "assetCompanyCode",
				dataValueField: "assetCompanyCode",
				change: onSelectCompanyId,
                dataSource: companyList
            });
			//$('$<span class="k-invalid-msg" data-for="name"></span>').appendTo(container);
        }
		
		function getCompanyName(companyCode) {
			for(var i=0;i<companyList.length;i++){
				if(companyList[i].assetCompanyCode === companyCode){
					return companyList[i].assetCompanyName;
				}
			}
        }
		function loadData(){
			itemChanged = false;
			disableDeleteBtn = false;
			
		    $.ajax({
				type: 'POST', 
				url: 'prod.json',
				data : { action :'read', type:'com.spacetimeinsight.quanta.validation.ui.model.Location', renderertype:'com.spacetimeinsight.quanta.validation.ui.ValidationUIRenderer'},
				
				success: function(data, textStatus, jQxhr ){
					data = jQuery.parseJSON( data );
					
					// Define Kendo UI						
					buildGrid(data)
					
					entityGrid = $("#contentGrid").data("kendoGrid");
				}
			});
		}
		
		function getDatasource(data){
			var dataSource = new kendo.data.DataSource({
						transport: {
							read: function (e) {
								// on success
								companyList = data;//data.company;
								e.success(data);
								// on failure
								//e.error("XHR response", "status code", "error message");
							},
							create: function (e) {
								onCreate(e.data);
								//alert(JSON.stringify(e.data) + "\n" + JSON.stringify(e.data.models[0].MajorEqClassId));
								//alert(msg);
									
								// on success
								//e.success();
								
								// on failure
								//e.error("XHR response", "status code", "error message");
							},
							update: function (e) {
								// locate item in original datasource and update it
								onUpdate(e.data);
								//alert(JSON.stringify(e.data) + "\n" + JSON.stringify(e.data.models[0].MajorEqClassId));
								//alert(msg);
								
								// on success
								e.success();
								// on failure
								//e.error("XHR response", "status code", "error message");
							}
						},
						error: function (e) {
							// handle data operation error
							alert("Status: " + e.status + "; Error message: " + e.errorThrown);
						},
						change: function(e){
							if(e.action == "itemchange"){
								itemChanged = true;
								e.items[0].dirtyFields = e.items[0].dirtyFields || {};
								e.items[0].dirtyFields[e.field] = true;
							}
						},
						pageSize: 15,
						batch: true,
						schema: {
							model: {
								id: "id",
								fields: {
									id: { validation: { required: false } },
									assetCompanyCode: { validation: { required: true } },
									locationNumber: { validation: { required: false ,
									numbertype: function (input) {
                                                if(input.val() == undefined || input.val().trim() == "" ) {
                                                      input.attr("data-numbertype-msg", "Location Number Field is Required");                                    
                                                      isValidationError = true;
                                                      return false;
                                                }
                                                if (input.is("[name='locationNumber']")) {
													 if(!validateAlphaNumericCharacters(input.val())){
										 				input.attr("data-numbertype-msg", "Please enter alpha numeric characters only");
										 				 isValidationError = true;
														return false;
													 }
													 if (input.val().length>12) {
													 	input.attr("data-numbertype-msg", "Maximum 12 characters only");
										 				isValidationError = true;
														return false;
													 }
												}
                                               isValidationError = false;
                                                return true;      
                                           }
									} }, 
									locationDesc: { validation: { required: false,
									locationtype: function (input) {
                                                if(input.val() == undefined || input.val().trim() == "" ) {
                                                      input.attr("data-locationtype-msg", "Location Description Field is Required");
                                                      isValidationError = true;
                                                      return false;
                                                }
                                                 if (input.is("[name='locationtype']")) {
													 if(!validateAlphaNumericCharacters(input.val())){
										 				input.attr("data-locationtype-msg", "Please enter alpha numeric characters only");
										 				 isValidationError = true;
														return false;
													 }
													 if (input.val().length>30) {
													 	input.attr("data-numbertype-msg", "Maximum 30 characters only");
										 				isValidationError = true;
														return false;
													 }
													 
												}
                                               isValidationError = false;
                                                return true;      
                                           }
									} }

								}
							}
						}
					});
			return dataSource;
		}
		
		function buildGrid(data){
			$("#contentGrid").kendoGrid({
				dataSource: getDatasource(data),
				pageable: {
						input: true,
						pageSize: 15,
						numeric: false,
						buttonCount: 5
					},
					
				columns: [
					{field: "assetCompanyCode",
					 title: "Company Code",
					 editor: companyCodeDropDownEditor
					},
					{field: "locationNumber",
					 title: "Location Number"
					},
					{ field: "locationDesc",
					  title: "Location Description"
					}
				],
				editable: true,
				sortable: {
					mode: "multiple",
					allowUnsort: true
				},
				filterable: {
					mode: "row"
				},
				selectable: "multiple",
				change: onSelect,
				dataBound: greyOut
			});
		}
		
		function getGridDatasource(){
				return $("#contentGrid").data("kendoGrid").dataSource;			
		}
		//parent.document.getElementById('windowIframe').style.backgroundImage='none';
		
		function submitHandler(){
			$("#contentGrid").data("kendoGrid").destroy();
			$("#contentGrid").empty();
			loadData();			
		}
		
		function saveHandler(){
			//getGridDatasource().sync();
			getGridDatasource().read();	
		}
		
		function saveHandler2(){
			getGridDatasource().sync();
			getGridDatasource().read();	
		}
		
		function addHandler(){
			getGridDatasource().insert(0, {"assetCompanyCode":"62121003", "locationNumber":"", "locationDesc":"", "interfaceFlag":"N","id":62121003});
			entityGrid.refresh();
		}
	</script> 
	
<input type="button" value="Add a new record " onclick="addHandler()"	/>  <input type="button" value="Submit: Destroy the grid and recreate scenario(Having issues..)" onclick="submitHandler()"	/>  <input type="button" value="Save: Creating grid & datasourece on initialization and invoking read operation to get the latest data scenario" onclick="saveHandler()"	/> 
<input type="button" value="Save(2): Includes same functionality as Save but with SYNC operation before read scenario.. " onclick="saveHandler2()"	/> 
</body>
</html>