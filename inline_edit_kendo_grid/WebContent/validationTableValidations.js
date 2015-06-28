/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
*  Validation Tables validations
*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
*/
var isValidationError;
 function validateText(colValue, colName, required, minNoOfChar, maxNoOfChar){
	var errors = null;
	if(colValue == undefined || colValue == ""){
	errors = colName + " shouldn't be blank";
	}
	return errors;
 }
 
 function onSelect(e) {
	selectedItems = entityGrid.select();
	for(var i = 0; i < selectedItems.length; i++) {
		  var selectedItem = entityGrid.dataItem(selectedItems[i]);
			if(selectedItem.interfaceFlag == "Y" || selectedItem.interfaceFlag == undefined) {
				//parent.disableDeleteButton(true);
	    	} else {
				//parent.disableDeleteButton(false);
			}
	}
	
	if(itemChanged || disableDeleteBtn){
		//parent.disableDeleteButton(true);
	}
	entityGrid.element.on('click', 'tbody>tr>td:not(.k-edit-cell)', function (e) {	
			if (!isValidationError)  {
				entityGrid.closeCell();	
			}
	});
			
	entityGrid.element.on("dblclick", "tbody>tr>td:not(.k-edit-cell)", "dblclick", function (e) {
		if (!isValidationError)  {
		for(var i = 0; i < selectedItems.length; i++) {
			  var selectedItem = entityGrid.dataItem(selectedItems[i]);
			  if(selectedItem.interfaceFlag == "N" || selectedItem.interfaceFlag == undefined) {
				if(!disableDeleteBtn){
				  disableDeleteBtn = true;
				  //parent.disableDeleteButton(true);				  
				}
				entityGrid.editCell($(this));
				var input = $(this).find("input.k-input");
				input.keyup(function(e) {
					enableDisableSaveBtns($(this));
				});
				input.blur(function(e) {
					enableDisableSaveBtns($(this));
				});
			  } 
		}
		}
	});
 }

 function isNull(data){
	if(data == undefined || data == ""){
		return true;
	}
	return false;
}
 
 function greyOut() {
	dataView = $("#contentGrid").data("kendoGrid").dataSource.view();
	for(var i = 0; i < dataView.length; i++) {
		if(dataView[i].interfaceFlag == "Y") {
			var uid = dataView[i].uid;
			$("#contentGrid").find("tr[data-uid=" + uid + "]").addClass("k-checkit");
		}
	}
 }
 
 function grid_addNewRecord() {
	var grid = $("#contentGrid").data("kendoGrid");
	grid.addRow();
	
	//parent.disableSaveButton(true);
 }
		
 function grid_saveChanges() {
	if(confirm("Are you sure you want to save all changes?")){
		//dataSource.sync();
		$("#contentGrid").data("kendoGrid").dataSource.read();
	}
 }
		
 function grid_cancelChanges() {
	if(confirm("Are you sure you want to cancel all the changes?")){
		$("#contentGrid").data("kendoGrid").cancelChanges();
		itemChanged = false;
		disableDeleteBtn = false;
		//parent.disableDeleteButton(false);
	}
 }
 
 function validateAlphaNumericCharacters(key) {
	var regex = /^[A-Za-z0-9]+$/;
	return validateExp(regex,key);
}

 function validateCharacters(key) {
	var regex = /^[A-Za-z]+$/;
	return validateExp(regex,key);
}

function validateExp(regex,key){
	return regex.test(key);
}

function validateRegularExp(evt, regex) {
	try {
		var theEvent = evt || window.event;
		var key = theEvent.key || String.fromCharCode(theEvent.which);
		if( !validateExp(regex,key) ) {
			theEvent.returnValue = false;
			if(theEvent.preventDefault) theEvent.preventDefault();
			return false;
		}
		return true;
	}catch (e) {
		alert("Error occurred while validating the expression");
	}
	return false;
}

function validateNumberKey(key) {
	var regex = /[0-9]/;
	return validateExp(regex, key);
}

 function enableDisableSaveBtns(cell) {
 }