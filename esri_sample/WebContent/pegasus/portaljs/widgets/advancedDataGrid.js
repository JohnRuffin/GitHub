/**
 * Constructs and returns the AdvancedDataGrid object
 * @param gridId
 * @param options
 * @param matrixColumns
 * @param preCallbackHandler
 * @returns {AdvancedDataGrid}
 */

function AdvancedDataGrid(gridId, options, matrixColumns, preCallbackHandler) {
    this.gridId = gridId;
    this.options = options;
    this.matrixColumns = matrixColumns;
    //initialize the data grid
    if (this.gridId != undefined) {
        this.grid = this.initializeAdvancedDataGrid();
    }
    //adding the matrix columns
    if (this.matrixColumns != undefined) {
        this.addDataGridColumns();
    }

    //append a pre-callbackHandler for future reference...
    if (this.grid != undefined && preCallbackHandler != undefined) {
        this.grid["preCallbackHandler"] = preCallbackHandler;
    }


    if (this.grid != undefined) {

        if (this.options.isCreationCompleteDefault) {
            this.grid.addEventListener("creationComplete", this.creationComplete);
        }

        if (this.options.isCellCustomBackgroundDrawFunctionDefault) {
            this.grid.setCellCustomBackgroundDrawFunction(this.cellCustomDrawFunction);
        }

        if (this.options.isRowTextColorFunctionDefault) {
            this.grid.rowTextColorFunction;
        }
    
        if (this.options.itemLoadHandler != undefined) {
            this.grid.addEventListener("itemLoad", this.options.itemLoadHandler);
        }
    }

    //add the wrapper referecen to grid for future purpose...
    this.grid["wrapper"] = this;
}

/**
 * FlexDataGrid is the class name for HTMLTreeGrid, a DataGrid component built
 * from the ground up to cater to the needs of UI developers who create complex Line of Business applications 
 * @returns {flexiciousNmsp.FlexDataGrid}
 */
AdvancedDataGrid.prototype.initializeAdvancedDataGrid = function() {
    if (this.gridId != undefined) {
        return new flexiciousNmsp.FlexDataGrid(document.getElementById(this.gridId), this.options);
    }
};

/**
 * method which creates the {flexiciousNmsp.FlexDataGridColumn}'s which is the 
 * FlexDataGridColumn class describes a column in a FlexDataGrid Column control.
 * 
 */
AdvancedDataGrid.prototype.addDataGridColumns = function() {
    if (this.gridId != undefined && this.grid != undefined) {
        this.createAndAddColumns();
    }
    //refresh the advanced data grid
    this.refreshAdvancedDataGrid();
};

/**
 * refresh/redraw the grid
 */
AdvancedDataGrid.prototype.refreshAdvancedDataGrid = function() {
    if (this.grid != undefined) {
        this.grid.reDraw();
    }
};

/**
 * * redraw the grid
 * @param gridId
 */
 
AdvancedDataGrid.reDrawAdvancedDataGrid = function(gridId) {
    var grid;
    if (gridId != undefined) {
        grid = AdvancedDataGrid.getAdvancedDataGrid(gridId);
        if (grid != undefined) {
            grid.reDraw();
        }
    }
};

/**
 * creates and add's the columns
 */
AdvancedDataGrid.prototype.createAndAddColumns = function() {
    var count;
    if (this.matrixColumns != undefined) {
        count = this.matrixColumns.length;
        var matrixColumn;
        for (var i = 0; i < count; i++) {
            //create the {flexiciousNmsp.FlexDataGridColumn} and add the same to {flexiciousNmsp.FlexDataGrid} grid
            matrixColumn = this.createColumn(this.matrixColumns[i]);
            if (matrixColumn != undefined) {
                this.grid.addColumn(matrixColumn);
            }
        }
    }
};

/**
 * creates the grid column based on the column type property
 * @param matrixColumn
 * @param level
 * @returns {flexiciousNmsp.FlexDataGridColumn} or {flexiciousNmsp.FlexDataGridCheckBoxColumn} 
 */
AdvancedDataGrid.prototype.createColumn = function(matrixColumn, level) {
    if (matrixColumn != undefined) {
        switch (matrixColumn.type) {
        case 'checkbox':
            return this.createCheckBoxDataGridColumn(matrixColumn);
            break;
        case 'nextlevel':
            return this.createDataGridLevel(matrixColumn, level);
            break;
        default:
            return this.createDataGridColumn(matrixColumn);
        }
    }
};

/**
 * creates checkBox DataGridColumn 
 * @param matrixColumn
 * @returns {flexiciousNmsp.FlexDataGridCheckBoxColumn} 
 */
AdvancedDataGrid.prototype.createCheckBoxDataGridColumn = function(matrixColumn) {
    var dataGridColumn;
    if (matrixColumn != undefined) {
        dataGridColumn = new flexiciousNmsp.FlexDataGridCheckBoxColumn();
        //this.setDataGridColumnProperties(matrixColumn, dataGridColumn);
        if (matrixColumn.field != undefined) {            
            dataGridColumn.setUniqueIdentifier(matrixColumn.field);
        }
        
        if (matrixColumn["columnWidthMode"] != undefined) {
            dataGridColumn.columnWidthMode = matrixColumn.columnWidthMode;
        }

        if (matrixColumn["excludeFromSettings"] != undefined) {
            dataGridColumn.excludeFromSettings = matrixColumn.excludeFromSettings;
        }

        if (matrixColumn["excludeFromPrint"] != undefined) {
            dataGridColumn.excludeFromPrint = matrixColumn.excludeFromPrint;
        }

        if (matrixColumn["excludeFromExport"] != undefined) {
            dataGridColumn.excludeFromExport = matrixColumn.excludeFromExport;
        }
        
        if (matrixColumn.columnLockMode != undefined) {
            dataGridColumn.setColumnLockMode(matrixColumn.columnLockMode);
        }
    }
    return dataGridColumn;
};

/**
 * creates a {flexiciousNmsp.FlexDataGridColumnLevel} level and the column definitions to that column.
 * @param matrixNextLevel
 * @param currentLevel
 */
AdvancedDataGrid.prototype.createDataGridLevel = function(matrixNextLevel, currentLevel, mustCreate) {
    if (currentLevel == undefined) {
        currentLevel = this.grid.getColumnLevel();
    }

    //check whether the level is already created....??
    if (currentLevel.nextLevel != undefined && !mustCreate) {
        return;
    }

    if (matrixNextLevel["parentChildrenField"] != undefined) {
        currentLevel.childrenField = (matrixNextLevel.parentChildrenField);
    }

    if (matrixNextLevel["parentChildrenCountField"] != undefined) {
        currentLevel.childrenCountField = (matrixNextLevel.parentChildrenCountField);
    }

    currentLevel.nextLevel = new flexiciousNmsp.FlexDataGridColumnLevel();

    if (matrixNextLevel["currentChildrenCountField"] != undefined) {
        currentLevel.nextLevel.childrenCountField = (matrixNextLevel.currentChildrenCountField);
    }

    if (matrixNextLevel["selectedKeyField"] != undefined) {
    	///currentLevel.selectedKeyField =  matrixNextLevel.selectedKeyField;
        currentLevel.nextLevel.selectedKeyField = matrixNextLevel.selectedKeyField;
    }

    if (matrixNextLevel["nestIndent"] != undefined) {
        currentLevel.nextLevel.nestIndent = matrixNextLevel.nestIndent;
    }

    if (matrixNextLevel["parentItemLoadMode"] != undefined) {
        currentLevel.itemLoadMode = (matrixNextLevel.parentItemLoadMode);
    }

    if (matrixNextLevel["currentLevelItemLoadMode"] != undefined) {
        currentLevel.nextLevel.itemLoadMode = matrixNextLevel.currentLevelItemLoadMode;
    }

    if (matrixNextLevel["enableFooters"] != undefined) {
        currentLevel.nextLevel.enableFooters = true;
        currentLevel.setEnableFooters(true);
    }

    if (matrixNextLevel["enableFooters"] != undefined) {
        currentLevel.enableFooters = true;
        currentLevel.setEnableFooters(true);
    }

    if (matrixNextLevel["isCellCustomBackgroundDrawFunctionDefault"] != undefined && matrixNextLevel["isCellCustomBackgroundDrawFunctionDefault"]) {
        currentLevel.nextLevel.cellCustomBackgroundDrawFunction = this.cellCustomDrawFunction;
    }

    if (matrixNextLevel["rowBackgroundColorFunction"] != undefined) {
        currentLevel.nextLevel.rowBackgroundColorFunction = matrixNextLevel["rowBackgroundColorFunction"];
    }

    if (currentLevel.nextLevel.grid == undefined) {
        currentLevel.nextLevel.grid = this.grid;
    }

/*this.grid.removeEventListener("itemLoad", currentLevel.nextLevel);
    this.grid.removeEventListener("itemLoad", currentLevel);*/

    if (matrixNextLevel["itemLoadHandler"] != undefined && !this.grid.hasEventListener("itemLoad")) {
        this.grid.addEventListener(currentLevel.nextLevel, "itemLoad", matrixNextLevel["itemLoadHandler"]);
    }
    if (matrixNextLevel["itemOpenHandler"] != undefined) {
    	this.grid.addEventListener(currentLevel.nextLevel, "itemOpen", matrixNextLevel["itemOpenHandler"]);
    }
    if (matrixNextLevel["itemCloseHandler"] != undefined) {
    	this.grid.addEventListener(currentLevel.nextLevel, "itemClose", matrixNextLevel["itemCloseHandler"]);
    }

    if (matrixNextLevel["isReusePreviousLevelColumns"] != undefined) {
        currentLevel.nextLevel.reusePreviousLevelColumns = true;
    }

    if (matrixNextLevel["childrenField"] != undefined) {
        currentLevel.nextLevel.childrenField = (matrixNextLevel.childrenField);
    }

    if (matrixNextLevel["currentLevelParentFiled"] != undefined) {
        currentLevel.nextLevel.parentField = (matrixNextLevel.currentLevelParentFiled);
    }
    if (matrixNextLevel["cellBorderFunction"] != undefined) {
        currentLevel.nextLevel.cellBorderFunction = matrixNextLevel.cellBorderFunction;
    }

    var matrixNextLevelColumns;
    if (matrixNextLevel["columns"] != undefined) {
        matrixNextLevelColumns = matrixNextLevel.columns;
        this.createAndAddColumnsToNextLevel(matrixNextLevelColumns, currentLevel.nextLevel);
    }
};

/**
 * creates and add Columns to next Level 
 * @param matrixNextLevelColumns
 * @param level
 */
AdvancedDataGrid.prototype.createAndAddColumnsToNextLevel = function(matrixNextLevelColumns, level) {
    var count;
    if (matrixNextLevelColumns != undefined) {
        count = matrixNextLevelColumns.length;
        var matrixColumn;
        for (var i = 0; i < count; i++) {
            matrixColumn = this.createColumn(matrixNextLevelColumns[i], level);
            if (matrixColumn != undefined) {
                level.addColumn(matrixColumn);
            }
        }
    }
};

/**
 * creates data grid column
 * @param matrixColumn
 * @returns
 */
AdvancedDataGrid.prototype.createDataGridColumn = function(matrixColumn) {
    var dataGridColumn;
    if (matrixColumn != undefined) {
        dataGridColumn = new flexiciousNmsp.FlexDataGridColumn();
        this.setDataGridColumnProperties(matrixColumn, dataGridColumn);
        this.setFilterControls(matrixColumn, dataGridColumn);
    }
    return dataGridColumn;
};

/**
 * method to set the grid column Properties
 * @param matrixColumn
 * @param dataGridColumn
 */
AdvancedDataGrid.prototype.setDataGridColumnProperties = function(matrixColumn, dataGridColumn) {
    if (matrixColumn != undefined) {
        //header text
        if (matrixColumn.title != undefined) {
            dataGridColumn.setHeaderText("<span title='"+matrixColumn.headerText +"'>"+matrixColumn.title +"</span>");
        }
        //column data field & unique identifier for column
        if (matrixColumn.field != undefined) {
            dataGridColumn.setDataField(matrixColumn.field);
            dataGridColumn.setUniqueIdentifier(matrixColumn.field);
        }

        //labelFunction2
        if (matrixColumn.labelFunction2 != undefined) {
            dataGridColumn.setLabelFunction2(matrixColumn.labelFunction2);
        }

        //headerAlign
        if (matrixColumn.headerAlign != undefined) {
            dataGridColumn.headerAlign = matrixColumn.headerAlign;
        }
        
        if (matrixColumn.textAlign != undefined) {
            dataGridColumn.textAlign = matrixColumn.textAlign;
        }

        //matrixColumn.enableHierarchicalNestIndent flag
        if (matrixColumn.enableHierarchicalNestIndent != undefined) {
            dataGridColumn.enableHierarchicalNestIndent = matrixColumn.enableHierarchicalNestIndent;
        }

        //enableExpandCollapseIcon flag
        if (matrixColumn.enableExpandCollapseIcon != undefined) {
            dataGridColumn.enableExpandCollapseIcon = matrixColumn.enableExpandCollapseIcon;
        }

        //column width
        if (matrixColumn.width != undefined) {
            dataGridColumn.setWidth(matrixColumn.width);
        }
        //visible flag for grid column
        if (matrixColumn.hidden != undefined) {
            dataGridColumn.setVisible(!matrixColumn.hidden);
        }
        //sortable for column
        if (matrixColumn.sortable != undefined) {
            dataGridColumn.sortable = matrixColumn.sortable;
        }
        //label function
        if (matrixColumn.labelFunction != undefined) {
            dataGridColumn.setLabelFunction(matrixColumn.labelFunction);
        }
        //column lock mode
        if (matrixColumn.columnLockMode != undefined) {
            dataGridColumn.setColumnLockMode(matrixColumn.columnLockMode);
        }
        //enable filter
        if (matrixColumn["filterable"] != undefined) {
            dataGridColumn.enableFilters = matrixColumn.filterable;
        }

        if (matrixColumn["footerLabel"] != undefined) {
            dataGridColumn.footerPaddingLeft = 2;
            dataGridColumn.footerLabel = matrixColumn.footerLabel;
        }
        if (matrixColumn["footerOperation"] != undefined) {
            dataGridColumn.footerOperation = matrixColumn.footerOperation;
        }
        
        if (matrixColumn["footerFormatter"] != undefined) {
            dataGridColumn.footerFormatter = matrixColumn.footerFormatter;
        }
        
        if (matrixColumn["footerLabelFunction"] != undefined) {
            dataGridColumn.footerLabelFunction = matrixColumn.footerLabelFunction;
        }
        
        if (matrixColumn["columnWidthModeFitToContentExcludeHeader"] != undefined) {
            dataGridColumn.columnWidthModeFitToContentExcludeHeader = matrixColumn.columnWidthModeFitToContentExcludeHeader;
        }

        if (matrixColumn["columnWidthMode"] != undefined) {
            dataGridColumn.columnWidthMode = matrixColumn.columnWidthMode;
        }

        if (matrixColumn["excludeFromSettings"] != undefined) {
            dataGridColumn.excludeFromSettings = matrixColumn.excludeFromSettings;
        }

        if (matrixColumn["excludeFromPrint"] != undefined) {
            dataGridColumn.excludeFromPrint = matrixColumn.excludeFromPrint;
        }

        if (matrixColumn["excludeFromExport"] != undefined) {
            dataGridColumn.excludeFromExport = matrixColumn.excludeFromExport;
        }

        if (matrixColumn["paddingLeft"] != undefined) {
            dataGridColumn.paddingLeft = matrixColumn.paddingLeft;
        }

        if (matrixColumn["paddingRight"] != undefined) {
            dataGridColumn.paddingRight = matrixColumn.paddingRight;
        }

        if (matrixColumn["minWidth"] != undefined) {
            dataGridColumn.minWidth = matrixColumn.minWidth;
        }

        if (matrixColumn["footerAlign"] != undefined) {
            dataGridColumn.footerAlign = matrixColumn.footerAlign;
        }

        if (matrixColumn["footerOperationPrecision"] != undefined) {
            dataGridColumn.footerOperationPrecision = (matrixColumn.footerOperationPrecision);
        }
        if (matrixColumn["cellBackgroundColorFunction"] != undefined) {
        	dataGridColumn.cellBackgroundColorFunction = matrixColumn["cellBackgroundColorFunction"];
        }else  if (!this.options.isCellCustomBackgroundDrawFunctionDefault) {
        	if(this.options.isAddCellBackgroundDrawFunction == false) {
        		//do nothing
        	}else {
        		dataGridColumn.cellBackgroundColorFunction = this.cellBackgroundColorDefaultFunction;
        	}
        }

        if (matrixColumn["cellTextColorFunction"] != undefined) {
        	dataGridColumn.cellTextColorFunction = matrixColumn["cellTextColorFunction"];
        } else {
        	dataGridColumn.cellTextColorFunction = this.cellTextColorFunctionHandler;
        }
        
        if (matrixColumn["excludeFromExport"] != undefined) {
            dataGridColumn.excludeFromExport = (matrixColumn.excludeFromExport);
        }
        
        if (matrixColumn["isSortNumeric"] != undefined) {
            dataGridColumn.sortNumeric= matrixColumn.isSortNumeric;
        }
        
        dataGridColumn.headerWordWrap = true;
        dataGridColumn.truncateToFit = true;
        dataGridColumn.enableRecursiveSearch = true;
        dataGridColumn.enableLocalStyles = true; 
    }
};

/**
 * function to handle the cell background color
 * @param cell
 * @returns {Number}
 */
AdvancedDataGrid.prototype.cellBackgroundColorDefaultFunction = function(cell) {
	var lvl = cell.level.getNestDepth();
	var color = 0xffffff;
	var column;
    if (cell.rowInfo.getIsDataRow()) {
    	switch( cell.getColumn().dataField) {
    	case "TOTAL_WEIGHT":    		
    	case "TOTAL_PIECES":
    	case "TOTAL_CUBE":
    		removeAllCellStyles(6, $(cell.domElement).find("label"));
    		break;
    	default :
    		if(cell.getColumn().dataField != undefined && cell.getColumn().dataField != "" && 
    				(cell.getColumn().dataField.indexOf("_CU") >=0 || cell.getColumn().dataField.indexOf("_WGT") >=0 || cell.getColumn().dataField.indexOf("_PCS") >=0) ){
    			removeAllCellStyles(6, $(cell.domElement).find("label"));
    		}	
    	}
    	
        if (true) switch (lvl) {
        case 0:
        case 1:
            $(cell.domElement).css('background-color', '#FFFFFF').css('color', '#003366').css('border-color', '#C0D2E7');
            break;
        case 2:
            $(cell.domElement).css('background-color', '#D8EDFD !important').css('color', '#003366').css('border-color', '#C0D2E7');
            color = 0xD8EDFD;
            break;
        case 3:
            $(cell.domElement).css('background-color', 'rgba(219,237,253,0.8)  !important').css('color', '#003366').css('border-color', '#C0D2E7').css('opacity', .8);
            color = 0xDBEDFD;
            break;
        case 4:
            $(cell.domElement).css('background-color', 'rgba(219,237,253,0.6)  !important').css('color', '#003366').css('border-color', '#C0D2E7').css('opacity', .6);
            color = 0xDBEDFD;
            break;
        case 5:
            $(cell.domElement).css('background-color', 'rgba(219,237,253,0.4)  !important').css('color', '#003366').css('border-color', '#C0D2E7');
            color = 0xDBEDFD;
            break;
        }
    }
    return color;
};

/**
 * method to set the filter controls for the grid column 
 * @param matrixColumn
 * @param dataGridColumn
 */
AdvancedDataGrid.prototype.setFilterControls = function(matrixColumn, dataGridColumn) {
    if (matrixColumn != undefined) {
        switch (matrixColumn["filterComparisionType"]) {
        case gridFilterTypeConstants.FILTER_TYPE_BOOLEAN:
        case gridFilterTypeConstants.FILTER_TYPE_DATE:
        case gridFilterTypeConstants.FILTER_TYPE_NUMBER:
        case gridFilterTypeConstants.FILTER_TYPE_STRING:
        case gridFilterTypeConstants.FILTER_TYPE_TIME:
            dataGridColumn.filterComparisionType = matrixColumn.filterComparisionType;
            break;
        case gridFilterTypeConstants.FILTER_TYPE_DESCRIPTION:
            dataGridColumn.filterComparisionType = gridFilterTypeConstants.FILTER_TYPE_STRING;
            break;
        default:
            dataGridColumn.filterComparisionType = gridFilterTypeConstants.FILTER_TYPE_STRING;
            dataGridColumn.filterComparisionType = "string";
        }

        switch (dataGridColumn.filterComparisionType) {
        case gridFilterTypeConstants.FILTER_TYPE_BOOLEAN:
            dataGridColumn.setFilterControl("ComboBox");
            dataGridColumn.filterComboBoxBuildFromGrid = true;
            break;
        case gridFilterTypeConstants.FILTER_TYPE_DATE:
            dataGridColumn.setFilterControl("DateComboBox");
            dataGridColumn.filterComparisionType = "date";
            dataGridColumn.labelFunction = flexiciousNmsp.UIUtils.dataGridFormatDateLabelFunction;
            break;
        /*case gridFilterTypeConstants.FILTER_TYPE_NUMBER:
            //dataGridColumn.setFilterControl("NumericRangeBox");
            break; */
        case gridFilterTypeConstants.FILTER_TYPE_STRING:
            if (matrixColumn["filterComparisionType"] != gridFilterTypeConstants.FILTER_TYPE_DESCRIPTION) {
                dataGridColumn.setFilterControl("MultiSelectComboBox");
                dataGridColumn.filterComboBoxBuildFromGrid = true;
                dataGridColumn.filterOperation = "InList";
            } else {
                dataGridColumn.setFilterControl("TextInput");
                dataGridColumn.filterOperation = "Contains";
            }
            break;
        case gridFilterTypeConstants.FILTER_TYPE_DESCRIPTION:
            dataGridColumn.setFilterControl("TextInput");
            dataGridColumn.filterOperation = "Contains";
            break;
        case gridFilterTypeConstants.FILTER_TYPE_NUMBER:
        case gridFilterTypeConstants.FILTER_TYPE_TIME:
            dataGridColumn.setFilterRenderer(new flexiciousNmsp.ClassFactory(myCompanyNameSpace.SpaceTime_CustomFilterControl));
            dataGridColumn.setFilterControl("CustomFilterControl");
            break;
        default:

        }
        //filterComboBoxWidth="150"		
    }
};
/**
 * method triggered on creationComplete event
 * @param event
 */
AdvancedDataGrid.prototype.creationComplete = function(event) {
    var lvl = event.target.getColumnLevel();
    while (lvl) {
        lvl.cellCustomBackgroundDrawFunction = cellCustomDrawFunction;
        lvl.setEnableFooters(lvl.getNestDepth() == 1 || lvl.getNestDepth() == 2);
        lvl = lvl.nextLevel;
    }
};
/**
 * method to handle the color coding for the cells
 * @param cell
 * @returns {Boolean}
 */
AdvancedDataGrid.prototype.cellCustomDrawFunction = function(cell) {
    var lvl = cell.level.getNestDepth();

    if (cell.rowInfo.getIsDataRow()) {
        if (true) switch (lvl) {
        case 0:
        case 1:
            if ($(cell.domElement).css("background-color") != "#FFFFFF") {
                $(cell.domElement).css('background-color', '#FFFFFF').css('color', '#003366').css('border-color', '#C0D2E7');
                break;
            }
        case 2:
            if ($(cell.domElement).css("background-color") != "#D8EDFD !important") {
                $(cell.domElement).css('background-color', '#D8EDFD !important').css('color', '#003366').css('border-color', '#C0D2E7');
                break;
            }
        case 3:
            if ($(cell.domElement).css("background-color") != "rgba(219,237,253,0.8) !important") {
                $(cell.domElement).css('background-color', 'rgba(219,237,253,0.8)  !important').css('color', '#003366').css('border-color', '#C0D2E7');

                break;
            }
        case 4:
            if ($(cell.domElement).css("background-color") != "rgba(219,237,253,0.6) !important") {
                $(cell.domElement).css('background-color', 'rgba(219,237,253,0.6)  !important').css('color', '#003366').css('border-color', '#C0D2E7');
                break;
            }
        case 5:
            if ($(cell.domElement).css("background-color") != "rgba(219,237,253,0.4) !important") {
                $(cell.domElement).css('background-color', 'rgba(219,237,253,0.4)  !important').css('color', '#003366').css('border-color', '#C0D2E7');
                break;
            }
        }
        cell.domElement.isStyled = true;
        return false;
    } else if (cell.rowInfo.getIsFooterRow()) {
        if (lvl == 1) {
            $(cell.domElement).css('background-color', '#68A0D8').css('color', '#ffffff').css('font-weight', 'bold');
            return false;
        } else if (lvl == 2) {
            $(cell.domElement).css('background-color', '#EFF4E5').css('color', '#006600');
            return false;
        }
        return true;
    } else if (cell.rowInfo.getIsHeaderRow()) {
        if (lvl == 1) {
            $(cell.domElement).css('background-color', '#EDECDF').css('color', '#7F7F7F').css('font-weight', 'bold');
            return false;
        }
        return true;
    } else {
        return true; //use the grid default styles.
    }

};

/**
 * method to set cell Text Color 
 * @param cell
 * @returns {Number}
 */
AdvancedDataGrid.prototype.cellTextColorFunctionHandler = function(cell) {
	return 0x376092;
};

/**
 * method to get the flexicious grid component 
 * @param gridId
 * @returns {flexiciousNmsp.FlexDataGrid}
 */
AdvancedDataGrid.getAdvancedDataGrid = function(gridId) {
    if (gridId != undefined && document.getElementById(gridId) != null) {
        return document.getElementById(gridId).component;
    }
};

/**
 * method to get the flexicious grid column  
 * @param gridId
 * @param uniqueIdentifier
 * @returns {flexiciousNmsp.FlexDataGridColumn ()}
 */
AdvancedDataGrid.getColumnByUniqueIdentifier = function(gridId, uniqueIdentifier) {
    var matrixColumn;
    var grid;
    if (gridId != undefined) {
        grid = document.getElementById(gridId).component;
        if (grid != undefined) {
            return grid.getColumnByUniqueIdentifier(uniqueIdentifier);
        }
    }
};

/**
 * method to set the column visible state as true/false
 * @param gridId
 * @param uniqueIdentifier
 * @param isVisible
 */
AdvancedDataGrid.setColumnVisibleByUniqueIdentifier = function(gridId, uniqueIdentifier, isVisible) {
    var matrixColumn = null ;
    if (gridId != undefined) {
    	if(gridId instanceof Array){
        	for(var i = 0; i < gridId.length; i++){
//        		AdvancedDataGrid.setColumnVisibleByUniqueIdentifier(gridId[i], hideColumnsArr[p], false);
        		matrixColumn = AdvancedDataGrid.getColumnByUniqueIdentifier(gridId[i], uniqueIdentifier);
        		if (matrixColumn != undefined) {
                    matrixColumn.setVisible(isVisible);
                }
        	}
        }else{
//        	AdvancedDataGrid.setColumnVisibleByUniqueIdentifier(gridId, hideColumnsArr[p], false);
        	matrixColumn = AdvancedDataGrid.getColumnByUniqueIdentifier(gridId, uniqueIdentifier);
        	if (matrixColumn != undefined) {
        		matrixColumn.setVisible(isVisible);
        	}
        }
    }
};

AdvancedDataGrid.setColumnWidthByUniqueIdentifier = function(gridId, uniqueIdentifier, width) {
    var matrixColumn = null ;
    if (gridId != undefined) {
    	if(gridId instanceof Array){
        	for(var i = 0; i < gridId.length; i++){
        		matrixColumn = AdvancedDataGrid.getColumnByUniqueIdentifier(gridId[i], uniqueIdentifier);
        		if (matrixColumn != undefined) {
                    matrixColumn.setWidth(width);
                }
        	}
        }else{
        	matrixColumn = AdvancedDataGrid.getColumnByUniqueIdentifier(gridId, uniqueIdentifier);
        	if (matrixColumn != undefined) {
        		matrixColumn.setWidth(width);
        	}
        }
    }
};

/**
 * method to set the dataProvider 
 * @param gridId
 * @param data
 */
AdvancedDataGrid.setDataProvider = function(gridId, data) {
    var grid;
    if (gridId != undefined) {
        grid = AdvancedDataGrid.getAdvancedDataGrid(gridId);
        if (grid != undefined) {
            if (grid["preCallbackHandler"] != undefined) {
                grid["preCallbackHandler"](data);
            }
            grid.setDataProvider(data);
            grid.rebuild();
        }
    }
};
/**
 * Sets the selected keys for the top level. 
 * If you pass in TriStateCheckBox.STATE_CHECKED, all items are selected. 
 * If you pass in TriStateCheckBox.STATE_UNCHECKED, all items are unselected. 
 * TriStateCheckBox.STATE_MIDDLE is not valid parameter for this function.
 * @param gridId
 * @param checkState
 */

AdvancedDataGrid.setSelectAllState = function(gridId, checkState) {
    var grid;
    if (gridId != undefined) {
        grid = AdvancedDataGrid.getAdvancedDataGrid(gridId);
        if (grid != undefined) {

            grid.setSelectAllState(checkState);
            grid.rebuild();
        }
    }
};

AdvancedDataGrid.setSelectedKeysState  = function(gridId, checkState, selectedKeys) {
    var gridLevel;
    if (gridId != undefined) {
    	gridLevel = AdvancedDataGrid.getGridLevel(gridId);
        if (gridLevel != undefined) {
        	gridLevel.setSelectedKeysState (checkState);           
        }
    }
};

AdvancedDataGrid.setAllLevelSelectedKeysState  = function(gridId, checkState, selectedKeys) {
    var grid;
    if (gridId != undefined) {
    	 grid = AdvancedDataGrid.getAdvancedDataGrid(gridId);
         if (grid != undefined) {
         	var gridLevel = grid.getColumnLevel();
	        if (gridLevel != undefined) {
	    		while(gridLevel != undefined){
	    			gridLevel.setSelectedKeysState (checkState);
	        		gridLevel = gridLevel.nextLevel; 
	        	}
	    	}
         }
    }
};

/**
 * method to rebuild the flexiciousNmsp.FlexDataGrid
 */
AdvancedDataGrid.getGridLevel = function(gridId) {
	var grid;
    if (gridId != undefined) {
        grid = AdvancedDataGrid.getAdvancedDataGrid(gridId);
        return grid.getLevel();
    }
};

/**
 * method to rebuild the flexiciousNmsp.FlexDataGrid
 */
AdvancedDataGrid.prototype.rebuild = function() {
    this.grid.rebuild();
};

/**
 * method to rebuild the flexiciousNmsp.FlexDataGrid
 */
AdvancedDataGrid.rebuild = function(gridId) {
    var grid;
    if (gridId != undefined) {
        grid = AdvancedDataGrid.getAdvancedDataGrid(gridId);
        if (grid != undefined) {
            grid.rebuild();
        }
    }
};

/**
 * Returns the list of columns at the root level. The grid always has at least one column level.
 * This is also referred to as the top level, or the root level. In flat grids (non hierarchical),
 * this is the only level. But in nested grids, you could have any number of nested levels. 
 * The columns collection actually belongs to the columnLevel, and since there is one root level, 
 * the columns collection of the grid basically points to the columns collection of this root level.
 * @param gridId
 */
AdvancedDataGrid.getColumns = function(gridId) {
    var grid;
    if (gridId != undefined) {
        grid = AdvancedDataGrid.getAdvancedDataGrid(gridId);
        if (grid != undefined) {
            return grid.getColumns();
        }
    }
    return;
};

/**
 * method to get all visible columns 
 * @param gridId
 * @returns
 */
AdvancedDataGrid.getVisibleColumns = function(gridId) {
    var grid;
    if (gridId != undefined) {
        grid = AdvancedDataGrid.getAdvancedDataGrid(gridId);
        if (grid != undefined) {
            return grid.getVisibleColumns();
        }
    }
    return;
};

/**
 * Returns an XML representation of the preferences specified in the preferencesToPersist property and values being the actual values.
 * @param gridId
 * @returns
 */
AdvancedDataGrid.getPreferences = function(gridId) {
    var grid;
    if (gridId != undefined) {
        grid = AdvancedDataGrid.getAdvancedDataGrid(gridId);
        if (grid != undefined) {
            return grid.getPreferences();
        }
    }
    return;
};

/**
 * method to set the preferences while applying the favorites 
 * @param gridId
 * @param preferences
 * @returns
 */
AdvancedDataGrid.setPreferences = function(gridId, preferences, isTimeoutEnabled) {
    var grid;
    if (gridId != undefined) {
        grid = AdvancedDataGrid.getAdvancedDataGrid(gridId);
        if (grid != undefined && preferences != undefined && !grid.getPreferencesLoaded()) {
        	grid.setPreferences(preferences);
        	grid.rebuild();
        	if(isTimeoutEnabled){
        		showProgressDialog(true, "Applying preferences");
            	setTimeout(function(){
                    grid.rebuildFilter();
            	    grid.rebuildHeader();    
                    grid.setPreferences(preferences);
                    grid.rebuild();            
                    showProgressDialog(false);
                }, 1000);
        	}        	
        }
    }
    return;
};

/**
 * Return the FilterSort objects at the top level
 * @param gridId
 * @returns
 */
AdvancedDataGrid.getCurrentSorts = function(gridId) {
    var grid;
    if (gridId != undefined) {
        grid = AdvancedDataGrid.getAdvancedDataGrid(gridId);
        if (grid != undefined) {
            return grid.getCurrentSorts();
        }
    }
    return;
};

/**
 * 
 * @param gridId
 * @param sorts
 */
AdvancedDataGrid.processSorts = function(gridId, sorts) {
    var grid;
    var filterSorts;
    if (gridId != undefined) {
        grid = AdvancedDataGrid.getAdvancedDataGrid(gridId);
        filterSorts = AdvancedDataGrid.getFilterSorts(sorts);
        if (grid != undefined && sorts != undefined) {
            if (filterSorts != undefined) {
                grid.processSort(filterSorts);
            }
        }
        AdvancedDataGrid.rebuild(gridId);
    }
};

/**
 * method to get the available filter Sorts for the grid
 * @param sorts
 * @returns {Array}
 */
AdvancedDataGrid.getFilterSorts = function(sorts) {
    if (sorts != undefined) {
        var filterSorts = [];
        var filterSort;
        for (var i = 0; i < sorts.length; i++) {
            filterSort = AdvancedDataGrid.getFilterSort(sorts[i]);
            if (filterSort != undefined) {
                filterSorts.push(filterSort);
            }
        }
        return filterSorts;
    }
};

/**
 * method to get flexiciousNmsp.FilterSort 
 * @param sort
 * @returns {flexiciousNmsp.FilterSort}
 */
AdvancedDataGrid.getFilterSort = function(sort) {
    if (sort != undefined) {
        var filterSort = new flexiciousNmsp.FilterSort();
        for (var propertyName in sort) {
            filterSort[propertyName] = sort[propertyName];
        }
        return filterSort;
    }
};

/**
 * method to get wrapper for the grid
 * @param gridId
 * @returns
 */
AdvancedDataGrid.getWaraper = function(gridId) {
    if (gridId != undefined) {
        var grid = AdvancedDataGrid.getAdvancedDataGrid(gridId);
        if (grid != undefined) {
            return grid["wrapper"];
        }
    }
};

/**
 * 
 * @param gridId
 * @param matrixNestedColumns
 * @param currentLevel
 */
AdvancedDataGrid.addNestedColumns = function(gridId, matrixNestedColumns, currentLevel) {
    if (gridId != undefined) {
        var wrapper = AdvancedDataGrid.getWaraper(gridId);
        wrapper.rebuild();
    }
};


AdvancedDataGrid.getSelectedKeys = function(gridId) {
    var grid;
    if (gridId != undefined) {
        grid = AdvancedDataGrid.getAdvancedDataGrid(gridId);
        if (grid != undefined) {
           return grid.getSelectedKeys();
        }
    }
};

AdvancedDataGrid.getUnSelectedKeys = function(gridId) {
    var grid;
    if (gridId != undefined) {
        grid = AdvancedDataGrid.getAdvancedDataGrid(gridId);
        if (grid != undefined) {
           return grid.getUnSelectedKeys();
        }
    }
};

AdvancedDataGrid.setSelectedKeys = function(gridId, selectedKeys) {
    var grid;
    if (gridId != undefined) {
        grid = AdvancedDataGrid.getAdvancedDataGrid(gridId);
        if (grid != undefined) {
           grid.setSelectedKeys(selectedKeys);
        }
    }
};

AdvancedDataGrid.setAllLevelSelectedKeys = function(gridId, selectedKeys) {
    var grid;
    if (gridId != undefined) {
        grid = AdvancedDataGrid.getAdvancedDataGrid(gridId);
        if (grid != undefined) {
        	var gridLevel = grid.getColumnLevel();
        	while(gridLevel != undefined){
        		gridLevel .setSelectedKeys(selectedKeys);
        		gridLevel = gridLevel.nextLevel; 
        	}
        }
    }
};

/**
 *  Extend the built in exporter
 * @param [iCollectionView]
 * @param [allOrSelectedPages]
 *
 */
flexiciousNmsp.ExtendedExportController.prototype.runExport=function (iCollectionView, allOrSelectedPages){
        
var grid = this._grid;
var col;
    var items=grid.getExportableColumns();
    for(var j=0;j<items.length;j++){
        col=items[j];
        col.origHeaderText=col.getHeaderText();
        //set your columns header text to non - html
        if($(col.origHeaderText).text() != "" || $(col.origHeaderText).text() != undefined ){
        	col.setHeaderText($(col.origHeaderText).text());
        }else{
        	col.setHeaderText(col.origHeaderText);
        }                
    }
        
    if(typeof  allOrSelectedPages=="undefined") allOrSelectedPages=false;
    
    this.runNestedExport(iCollectionView);


//set your column header text back to original
    var items=grid.getExportableColumns();
    for(var j=0;j<items.length;j++){
        col=items[j];
        col.setHeaderText(col.origHeaderText); 
    }

};
