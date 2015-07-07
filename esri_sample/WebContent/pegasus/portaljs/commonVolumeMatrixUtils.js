/**
* @author 888600 Abhishek Sharma
* This utils script belongs to common volume group configurations.
* This is the utility script which has common volume group related constants and utility methods for all the matrix.
*/

/**
 * Volume group constants.
 */
var HEADER_ORIG="Orig Loc";
var HEADER_ORIG_TOOLTIP="Origin location";
var HEADER_DES="Dest Loc";
var HEADER_DES_TOOLTIP="Destination location";
var HEADER_EFF_DAYS_L="Eff Days (L)";
var HEADER_EFF_DAYS_L_TOOLTIP="Effective Days";
var HEADER_WGT_TOTAL="Ttl Wt";
var HEADER_WGT_TOTAL_TOOLTIP="Total Weight";
var HEADER_CB_TOTAL="Ttl Cu";
var HEADER_CB_TOTAL_TOOLTIP="Total Cube";
var HEADER_PCS_TOTAL="Ttl Pcs";
var HEADER_PCS_TOTAL_TOOLTIP="Total Pieces";
var HEADER_WGT_EXCESS="Excess Wt";
var HEADER_WGT_EXCESS_TOOLTIP="Excess Weight";
var HEADER_CB_EXCESS="Excess Cu";
var HEADER_CB_EXCESS_TOOLTIP="Excess Cube";

var POUND_TO_KG_VALUE = 0.453592;
var COLUMNS_SUFFIX_WC = [ "_WGT", "_CU" ];
var COLUMNS_SUFFIX_WPC = [ "_WGT", "_CU", "_PCS" ];

var HEADER_SUFFIX_WC = [ " Wt", " Cu" ];
var HEADER_SUFFIX_WPC = [ " Wt", " Cu", " Pcs" ];

var	COLUMNS_OTHER_WC = [ "OTHER_WGT", "OTHER_CU" ];
var	COLUMNS_OTHER_WPC = [ "OTHER_WGT", "OTHER_CU", "OTHER_PCS" ];

var	HEADER_OTHER_WC = [ "Other Wt", "Other Cu" ];
var	HEADER_OTHER_WPC = [ "Other Wt", "Other Cu", "Other Pcs" ];

// Adding Excess columns in Volume Utilization matrix
var COLUMNS_EXCESS_SUFFIX_WC = [ "_EXCESS_WGT", "_EXCESS_CU" ];

var HEADER_EXCESS_SUFFIX_WC = [ " Excess Wt", " Excess Cu" ];

var	COLUMNS_EXCESS_OTHER_WC = [ "OTHER_EXCESS_WGT", "OTHER_EXCESS_CU" ];

var	HEADER_EXCESS_OTHER_WC = [ "Other Excess Wt", "Other Excess Cu" ];

/**
 * Method to check if weight is in Kg or Pounds.
 * @returns - true if weight is in Kg.
 */
function isWeightInKgsFlag() {
	var weightFlag = parent.VIEWER.isWeightInKgsFlag();
	return weightFlag;
}

/**
 * Method to change given column to product group column.
 * @param name - column name
 * @returns _columnName
 */
function toProductGroupColumn(name) {
	name = name.replaceAll('-', "_").replaceAll(" ", "__");
	if(isDigit(name.charAt(0))) {
		name = "_"+name;
	}
	
	return name;
}

/**
 * Method to get product group configurations.
 * @returns product groups
 */
function getProdGroupConfiguration() {
	var prodGrps = parent.VIEWER.getProdGroupConfiguration();
	return prodGrps;
}
/**
 * Method to get product group configurations.
 * @returns product groups
 */
function getProdGroupNames() {
	var prodGrpsNames = parent.VIEWER.getProdGroupNames();
	return prodGrpsNames;
}

/**
 * Method to get product group configurations.
 * @returns product groups
 */
function getNwProdGroupNames() {
	var prodGrpsNames;
	var queryWindow;
    if (parent.getDashboardContentWindow(parent.DASHBOARD_ID_QUERY) != undefined) {
        queryWindow = parent.getDashboardContentWindow(parent.DASHBOARD_ID_QUERY);
        prodGrpsNames = queryWindow.$("#productGroupsTextArea")[0].value;
    }
	return prodGrpsNames;
}

/**
 * This method add the product group coulmn in matrix columns.
 * @param matrixCols - All the matrix columns
 * @param volumeColumns - All the product groups columns
 * @param headerLabels - matrix column headers
 * @param productGroup - product group column
 * @param isAddAggregation - Flag to add aggregation properties in the product group column 
 */
function addProductGroupVolumeColums(matrixCols,volumeColumns, headerLabels, productGroup, isAddAggregation,productGroupName) {
	var prodGrpColumn = "";
	if(productGroup) {
	 	prodGrpColumn = toProductGroupColumn(productGroup);
	 } else {
	 	productGroup = "";
	 }
	 if(productGroupName == undefined ){
		 productGroupName = productGroup;
	 }
	var volumeColumn;
	for (var i = 0; i < volumeColumns.length; i++) {
		volumeColumn = {
				field: prodGrpColumn+volumeColumns[i] ,
				title: productGroupName+headerLabels[i] ,
				headerText: productGroupName+headerLabels[i],
				attributes:{style:"text-align:right;"}, format:"{0:n0}",
				width: 55,
				headerAttributes: {
		      		  title: productGroupName+headerLabels[i]
	      	  },
	  		labelFunction: typeof flexiciousNmsp == "object"?flexiciousNmsp.UIUtils.dataGridFormatCurrencyLabelFunction: undefined ,
			footerFormatter: typeof flexiciousNmsp == "object"?flexiciousNmsp.NumberFormatter: undefined ,
			labelFunction2: typeof flexiciousNmsp == "function"? reverseIndent: undefined,
	      	footerOperation:"sum",
	      	footerAlign:"right",
	      	textAlign:"right",
	      	footerOperationPrecision:"0",
	      	isSortNumeric:true
			};
		/*if(isAddAggregation == undefined || isAddAggregation == true) {
			volumeColumn.aggregates = ["sum"];
			volumeColumn.footerTemplate = "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>";
			volumeColumn.groupFooterTemplate = "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>";
			
		}*/
		matrixCols.push(volumeColumn);
	}
}

/**
 * This method gets all the product group columns
 * @param isAddPieces - Flag to determine if pieces have to be added in matrix columns
 * @param isAddAggregation - Flag to add aggregation properties in the product group column
 */
function getProductGroupColumns(isAddPieces, isAddAggregation, isAddExcessColumns) {
	var matrixCols;
	var prodGrps = getProdGroupConfiguration();
	var prodGrpNames = getProdGroupNames();
	if (prodGrps && prodGrps != "") {
		var columnsSuffix = isAddPieces ? COLUMNS_SUFFIX_WPC : COLUMNS_SUFFIX_WC;
		var headersSuffix = isAddPieces ? HEADER_SUFFIX_WPC : HEADER_SUFFIX_WC;
		var selectedGrpsArray = prodGrps.split(":")[1].split(",");
		var selectedGrpsNamesArray = prodGrpNames.split(",");
		if (selectedGrpsArray && selectedGrpsArray.length > 0) {
			matrixCols = [];
			for (var i = 0; i < selectedGrpsArray.length; i++) {
				addProductGroupVolumeColums(matrixCols,columnsSuffix, headersSuffix,selectedGrpsArray[i], isAddAggregation,selectedGrpsNamesArray[i]);
			}
			var prdGrp;
			addProductGroupVolumeColums(matrixCols, 
				(isAddPieces ? COLUMNS_OTHER_WPC : COLUMNS_OTHER_WC) , 
				(isAddPieces ? HEADER_OTHER_WPC : HEADER_OTHER_WC), prdGrp, isAddAggregation);
			// Adding Excess Wgt/Cu columns by Product Group for Volume Utilization matrix
			if (isAddExcessColumns == true) {
				for (var i = 0; i < selectedGrpsArray.length; i++) {
					addProductGroupVolumeColums(matrixCols,COLUMNS_EXCESS_SUFFIX_WC, HEADER_EXCESS_SUFFIX_WC,selectedGrpsArray[i], isAddAggregation,selectedGrpsNamesArray[i]);
				}
				addProductGroupVolumeColums(matrixCols, 
						COLUMNS_EXCESS_OTHER_WC , 
						HEADER_EXCESS_OTHER_WC, prdGrp, isAddAggregation);
			}
		}
	}
	
	return matrixCols;
}

/**
 * This method gets all the network product group columns
 * @param isAddPieces - Flag to determine if pieces have to be added in matrix columns
 * @param isAddAggregation - Flag to add aggregation properties in the product group column
 */
function getNwProductGroupColumns(isAddPieces, isAddAggregation) {
	var matrixCols;
	var prodGrps = getNwProdGroupNames();
	var prodGrpNames = getNwProdGroupNames();
	if (prodGrps && prodGrps != "") {
		var columnsSuffix = isAddPieces ? COLUMNS_SUFFIX_WPC : COLUMNS_SUFFIX_WC;
		var headersSuffix = isAddPieces ? HEADER_SUFFIX_WPC : HEADER_SUFFIX_WC;
		var selectedGrpsArray = prodGrps.split(" ");
		var selectedGrpsNamesArray = prodGrpNames.split(" ");
		if (selectedGrpsArray && selectedGrpsArray.length > 0) {
			matrixCols = [];
			for (var i = 0; i < selectedGrpsArray.length; i++) {
				addProductGroupVolumeColums(matrixCols,columnsSuffix, headersSuffix,selectedGrpsArray[i], isAddAggregation,selectedGrpsNamesArray[i]);
			}
			var prdGrp;
			addProductGroupVolumeColums(matrixCols, 
				(isAddPieces ? COLUMNS_OTHER_WPC : COLUMNS_OTHER_WC) , 
				(isAddPieces ? HEADER_OTHER_WPC : HEADER_OTHER_WC), prdGrp, isAddAggregation);
		}
	}
	
	return matrixCols;
}

/**
 * This method is used to add product group column names
 * @param matrixCols - All the matrix columns
 * @param volumeColumns - All the product groups columns
 * @param productGroup - product group column
 */
function addProductGroupVolumeColumNames(matrixCols,volumeColumns, productGroup) {
	var prodGrpColumn = "";
	if(productGroup) {
	 	prodGrpColumn = toProductGroupColumn(productGroup);
	 } else {
	 	productGroup = "";
	 }
	 
	for (var i = 0; i < volumeColumns.length; i++) {
		matrixCols.push(prodGrpColumn+volumeColumns[i]);
	}
}

/**
 * This method gets all the product group columns
 * @param isAddPieces - Flag to determine if pieces have to be added in matrix columns
 */
function getProductGroupColumnNames(isAddPieces, isAddExcessColumns) {
	var matrixCols;
	var prodGrps = getProdGroupConfiguration();
	if (prodGrps && prodGrps != "") {
		var columnsSuffix = isAddPieces ? COLUMNS_SUFFIX_WPC : COLUMNS_SUFFIX_WC;
		//var headersSuffix = isAddPieces ? HEADER_SUFFIX_WPC : HEADER_SUFFIX_WC;
		var selectedGrpsArray = prodGrps.split(":")[1].split(",");
		if (selectedGrpsArray && selectedGrpsArray.length > 0) {
			matrixCols = [];
			for (var i = 0; i < selectedGrpsArray.length; i++) {
				addProductGroupVolumeColumNames(matrixCols, columnsSuffix, selectedGrpsArray[i]);
			}
			addProductGroupVolumeColumNames(matrixCols, (isAddPieces ? COLUMNS_OTHER_WPC : COLUMNS_OTHER_WC));
			// Adding Excess Wgt/Cu columns by Product Group for Volume Utilization matrix
			if (isAddExcessColumns == true) {
				for (var i = 0; i < selectedGrpsArray.length; i++) {
					addProductGroupVolumeColumNames(matrixCols, COLUMNS_EXCESS_SUFFIX_WC, selectedGrpsArray[i]);
				}
				addProductGroupVolumeColumNames(matrixCols, COLUMNS_EXCESS_OTHER_WC);
			}
		}
	}
	
	return matrixCols;
}

/**
 * This method gets all the product group columns
 * @param isAddPieces - Flag to determine if pieces have to be added in matrix columns
 */
function getNwProductGroupColumnNames(isAddPieces) {
	var matrixCols;
	var prodGrps = getNwProdGroupNames();
	if (prodGrps && prodGrps != "") {
		var columnsSuffix = isAddPieces ? COLUMNS_SUFFIX_WPC : COLUMNS_SUFFIX_WC;
		//var headersSuffix = isAddPieces ? HEADER_SUFFIX_WPC : HEADER_SUFFIX_WC;
		var selectedGrpsArray = prodGrps.split(" ");
		if (selectedGrpsArray && selectedGrpsArray.length > 0) {
			matrixCols = [];
			for (var i = 0; i < selectedGrpsArray.length; i++) {
				addProductGroupVolumeColumNames(matrixCols, columnsSuffix, selectedGrpsArray[i]);
			}
			addProductGroupVolumeColumNames(matrixCols, (isAddPieces ? COLUMNS_OTHER_WPC : COLUMNS_OTHER_WC));
		}
	}
	
	return matrixCols;
}

/**
 * This method is used to add schema properties for product group columns
 * @param gridFields - Column schema properties
 * @param isAddPieces - Flag to determine if pieces have to be added in matrix columns
 */
function addProductGroupsSchema(gridFields, isAddPieces, isAddExcessColumns, isNwProdGrp) {
	var productGroupColumnNames;
	if (isNwProdGrp) {
		productGroupColumnNames = getNwProductGroupColumnNames(isAddPieces, isAddExcessColumns);
	} else {
		productGroupColumnNames = getProductGroupColumnNames(isAddPieces, isAddExcessColumns);
	}
	if(productGroupColumnNames && productGroupColumnNames.length > 0) {
		for(var i = 0; i <  productGroupColumnNames.length; i++) {
			gridFields[productGroupColumnNames[i]] = {type: "number"};
		}
	}	
	
	return gridFields;
}

/**
 * This method is used to add matrix columns properties for product group columns
 * @param matrixCols - All the matrix columns
 * @param isAddPieces - Flag to determine if pieces have to be added in matrix columns
 * @param isAddAggregation - Flag to add aggregation properties in the product group column
 */
function addProductGroupsColumns(matrixCols, isAddPieces, isAddAggregation, isAddExcessColumns, isNwProdGrp) {
	var productGroupColumns;
	if (isNwProdGrp) {
		productGroupColumns = getNwProductGroupColumns(isAddPieces, isAddAggregation);
	} else {
		productGroupColumns = getProductGroupColumns(isAddPieces, isAddAggregation, isAddExcessColumns);
	}
	
	if(productGroupColumns && productGroupColumns.length > 0) {
		matrixCols = matrixCols.concat(productGroupColumns);
	}
	
	return matrixCols;
}

/**
 * This method is used to add aggregate product group columns.
 * @param aggregateCols - matrix aggregate columns
 * @param isAddPieces - Flag to determine if pieces have to be added in matrix columns
 */
function addProductGroupsAggregateColumns(aggregateCols, isAddPieces, isAddExcessColumns, isNwProdGrp) {
	var productGroupColumnNames;
	if (isNwProdGrp) {
		productGroupColumnNames = getNwProductGroupColumnNames(isAddPieces, isAddExcessColumns);
	} else {
		productGroupColumnNames = getProductGroupColumnNames(isAddPieces, isAddExcessColumns);
	}
	if(productGroupColumnNames && productGroupColumnNames.length > 0) {
		for(var i = 0; i <  productGroupColumnNames.length; i++) {
			aggregateCols.push({ field: productGroupColumnNames[i], aggregate: "sum" });
		}
	}	
	
	return aggregateCols;
}

/**
 * This method is used to add product group columns based on the setting i.e. All the _WGT columns will be added to All_Weight_Columns map and so on.
 * @param map - map of all Weight,Pieces, Cube columns
 * @param isAddPieces - Flag to determine if pieces have to be added in matrix columns
 * @returns map of weight,pieces,cube columns
 */
function addProductGroupsAggregateColumnSettings(map, isAddPieces, isAddExcessColumns, isNwProdGrp) {
	var productGroupColumnNames;
	if (isNwProdGrp) {
		productGroupColumnNames = getNwProductGroupColumnNames(isAddPieces, isAddExcessColumns);
	} else {
		productGroupColumnNames = getProductGroupColumnNames(isAddPieces, isAddExcessColumns);
	}
	if(productGroupColumnNames && productGroupColumnNames.length > 0) {
		for(var i = 0; i <  productGroupColumnNames.length; i++) {
			if (productGroupColumnNames[i].indexOf("WGT") > 0 && map["All_Weight_Columns"] != null) {
				map["All_Weight_Columns"].push(productGroupColumnNames[i]);	
			} else if (productGroupColumnNames[i].indexOf("CU") > 0 && map["All_Weight_Columns"] != null) {
				map["All_Cube_Columns"].push(productGroupColumnNames[i]);
			} else if(isAddPieces && map["All_Pieces_Columns"] != null) {
				map["All_Pieces_Columns"].push(productGroupColumnNames[i]);
			}
		}
	}
	
	return map;
}

/**
* Volume utilization Aggregate columns method
* Method to set Aggregate columns in volume utilization matrix.
*/
function getAggregateColumns(){
	var aggregateCols = [
	  { field: "TOTAL_WGT", aggregate: "sum" },
	  { field: "TOTAL_PCS", aggregate: "sum" },
	  { field: "TOTAL_CU", aggregate: "sum" },
	  { field: "AVAIL_WGT", aggregate: "sum" },
	  { field: "AVAIL_CU", aggregate: "sum" },
	  { field: "EXCESS_WEIGHT", aggregate: "sum" },
	  { field: "EXCESS_CUBE", aggregate: "sum" },
	  { field: "MAX_PAYLOAD_WT", aggregate: "sum" },
	  { field: "MAX_PAYLOAD_CU", aggregate: "sum" }
  ];
	
	return addProductGroupsAggregateColumns(aggregateCols, true, true);
}
