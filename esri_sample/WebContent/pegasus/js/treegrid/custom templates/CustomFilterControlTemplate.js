/**
 * First we hook into the filtering mechanism, so we always use the custom filter control
 * @param val
 */
flexiciousNmsp.FlexDataGridColumn.prototype.setFilterControl = function(val) {
    this._filterControlClass=val;
    //regardless of what the configuration says, we use a custom filter control
    this._filterRenderer = new flexiciousNmsp.ClassFactory(myCompanyNameSpace.SpaceTime_CustomFilterControl);
};




(function(window)
{
    "use strict";
    var CustomFilterControl, uiUtil = flexiciousNmsp.UIUtils, flxConstants = flexiciousNmsp.Constants;
    /**
     * A TextInputRenderer is a custom item renderer, that defines how to use custom cells with logic that you can control
     * @constructor
     * @namespace com.flexicious.controls
     * @extends TextInput
     */
    CustomFilterControl=function(){
        //make sure to call constructor

        flexiciousNmsp.UIComponent.apply(this,["div"]);//second parameter is the tag name for the dom element.
        /**
         * Width of the dropdown. If -1, the popup will take the width of the control.
         * @property dropdownWidth
         * @type Number
         * @default 250
         */
        this.dropdownWidth=250;

        this.filterExpression1 = new flexiciousNmsp.FilterExpression();

        this.filterExpression2 = new flexiciousNmsp.FilterExpression();

        this.andOr = "AND";
    };

    myCompanyNameSpace.SpaceTime_CustomFilterControl= CustomFilterControl; //add to name space
    CustomFilterControl.prototype = new flexiciousNmsp.UIComponent(); //setup hierarchy
    CustomFilterControl.prototype.typeName = CustomFilterControl.typeName = 'CustomFilterControl';//for quick inspection
    CustomFilterControl.prototype.getClassNames=function(){
        //we need to implement ICustomMatchFilterControl because we want to tell the grid to call our isMatch method to do the filter
        //we need to implement IFilterControl to tell the grid that we are actually a filter control, and not a placeholder for non-filterable columns
        //we need to implement iDelayedChange so that the grid listens to our "delayedChange" event, and not the regular change method.
        //if we had set filterTriggerEvent on the column to "enterKeyUp", we would not have had to implement IDelayedChange, but then the
        //user would have had to hit the enter key to run the filter.
        return ["CustomFilterControl","UIComponent","ICustomMatchFilterControl","IFilterControl"]; //this is a mechanism to replicate the "is" and "as" keywords of most other OO programming languages. We need to

    };
    CustomFilterControl.prototype.isMatch=function(emp){
        if(this.filterExpression1.expression || this.filterExpression2.expression)
        {
            var fe1Result=true , fe2Result=true;
            if(this.filterExpression1.expression)
            {
                fe1Result = this.filterExpression1.isMatch(emp, this.parent.getGrid());
            }

            if(this.filterExpression2.expression)
            {
                fe2Result = this.filterExpression2.isMatch(emp, this.parent.getGrid());
                if(this.andOr == "AND")
                {
                    return fe1Result && fe2Result;
                }
                else
                {
                    return fe1Result || fe2Result;
                }
            }
            else
            {
                return fe1Result;
            }

        }
        return true;
    };

    CustomFilterControl.prototype.addFilterExpressions=function(){
        var optionsHTML="";
        var fe = flexiciousNmsp.FilterExpression;
        var numericOptions = [
            fe.FILTER_OPERATION_TYPE_EQUALS
            ,fe.FILTER_OPERATION_TYPE_NOT_EQUALS
            ,fe.FILTER_OPERATION_TYPE_GREATER_THAN
            ,fe.FILTER_OPERATION_TYPE_GREATERTHANEQUALS
            ,fe.FILTER_OPERATION_TYPE_LESS_THAN
            ,fe.FILTER_OPERATION_TYPE_LESS_THAN_EQUALS
        ];

        var stringOptions = [
            fe.FILTER_OPERATION_TYPE_EQUALS
            ,fe.FILTER_OPERATION_TYPE_NOT_EQUALS
            ,fe.FILTER_OPERATION_TYPE_BEGINS_WITH
            ,fe.FILTER_OPERATION_TYPE_ENDS_WITH
            ,fe.FILTER_OPERATION_TYPE_CONTAINS
            ,fe.FILTER_OPERATION_TYPE_DOES_NOT_CONTAIN
        ];
        var options = stringOptions;
        if(this.parent.getColumn().filterComparisionType ==fe.FILTER_COMPARISION_TYPE_STRING)
        {
            options = stringOptions;
        }
        else if(this.parent.getColumn().filterComparisionType ==fe.FILTER_COMPARISION_TYPE_NUMBER
            ||this.parent.getColumn().filterComparisionType ==fe.FILTER_COMPARISION_TYPE_DATE)
        {
            options = numericOptions;
        }
        else if(this.parent.getColumn().filterComparisionType ==fe.FILTER_COMPARISION_TYPE_BOOLEAN)
        {
            options = stringOptions;
        }
        else if(this.parent.getGrid().getDataProvider().length>0)
        {
            var obj = this.parent.getGrid().getDataProvider()[0];
            if(typeof uiUtil.resolveExpression(obj,this.parent.getColumn().getDataField()) == 'string')
            {
                options = stringOptions;
            }
            else
            {
                options = numericOptions;
            }
        }

        $(options).each(function(index,opt){
            optionsHTML += "<option label='"+opt+"'>"+opt+"</option>";
        });
        return optionsHTML;
    };
    
    CustomFilterControl.prototype.showPopup=function(parent){
        if(this.popup){
            this.destroyPopup();
            return;
        }
        this._previousValue = this.getValue();

        var container = new flexiciousNmsp.UIComponent("div");
        container.domElement.className = "multiSelectComboBoxPopup";



        var filterDiv=new flexiciousNmsp.UIComponent("div");
        filterDiv.domElement.innerHTML="Show items with value that : <br/>" +
            "<table><tr><td><select id='selectFilter1'>"+this.addFilterExpressions()+"</select></td><td class='multiSelectComboBoxPopupTd'>" +
            "<input id='valueFilter1'></td></tr>" +
            "<tr><td colspan='2' align='center'><select id='selectAndOr'><option label='AND'>AND</option><option label='OR'>OR</option> </select></td></tr>" +
            "<tr><td><select id='selectFilter2'>"+this.addFilterExpressions()+"</select></td>" +
            "<td class='multiSelectComboBoxPopupTd'><input id='valueFilter2'></td></tr></table>";
        container.addChild(filterDiv);


        var okCancel=new flexiciousNmsp.UIComponent("div");
        okCancel.domElement.className="okCancelDiv";
        okCancel.domElement.innerHTML="<div class='okCancel'><span class='okButton'>Ok</span><span class='cancelButton'>Cancel</span></div>";
        container.addChild(okCancel);

        var pt=new flexiciousNmsp.Point(0,0);

        pt=this.localToGlobal(pt);
        {
            if(!parent)
                parent=flexiciousNmsp.DisplayList.instance().documentComponent.domElement.body;
            else{
                pt = parent.globalToLocal(pt);
            }

            //pt=new flexiciousNmsp.Point(pt.x , pt.y);
            var parentContainer = new flexiciousNmsp.UIComponent("div");
            parentContainer.addChild(container);
            container=parentContainer;
        }
        uiUtil.addChild(parent,container);
        container.setWidth((this.dropdownWidth===-1)?this.getWidth():this.dropdownWidth);
        //okCancel.setWidth(this.domElement.parentNode.offsetWidth-2);
        container.domElement.className = "flexiciousGrid";

        uiUtil.positionComponent(this.domElement,container.domElement);
        //container.move(pt.x,pt.y + this.getHeight());
        //container.domElement.style.position = "fixed";
        this.popup=container;

        if(this.filterExpression1.filterOperation )
            $(this.popup.domElement).find("#selectFilter1").val(this.filterExpression1.filterOperation );
        if(this.filterExpression1.expression != null )
            $(this.popup.domElement).find("#valueFilter1").val(this.filterExpression1.expression );

        if(this.filterExpression2.filterOperation )
            $(this.popup.domElement).find("#selectFilter2").val(this.filterExpression2.filterOperation );
        if(this.filterExpression2.expression != null )
            $(this.popup.domElement).find("#valueFilter2").val(this.filterExpression2.expression );
        $(this.popup.domElement).find("#selectAndOr").val(this.andOr );

        this.popup.addEventListener(this,flxConstants.EVENT_CLICK,
            function(e){
                if(e.triggerEvent.target.className=="okButton"){
                    this.onOkButton();
                }
                else if(e.triggerEvent.target.className=="cancelButton"){
                    //this.setValue(this._previousValue);
                    this.destroyPopup();
                }
            }
        );

        flexiciousNmsp.DisplayList.instance().documentComponent.addEventListener(this,flxConstants.EVENT_MOUSE_UP, this.onDocumentMouseUp);
        this.popup.domElement.style.zIndex=999;
    };
    //==================IFilterControl Methods===============================/
    CustomFilterControl.prototype.clear = function () {
        this.setValue("");
    };
    /**
     * Generic function that returns the value of a IFilterControl
     */
    CustomFilterControl.prototype.getValue = function () {
        var val="";
        if(this.filterExpression1.expression)
            val+=(this.filterExpression1.filterOperation+"_" + this.filterExpression1.expression.toString() );
        if(this.filterExpression2.expression)
            val+=("_"+ this.andOr + "_"+ this.filterExpression2.filterOperation+"_" + this.filterExpression1.expression.toString() );
        return val;
    };
    /**
     * Generic function that sets the value of a IFilterControl
     * @param val
     */
    CustomFilterControl.prototype.setValue = function (val) {


        var headerCell = this.parent.getGrid().getHeaderContainer() && this.parent.getGrid().getHeaderContainer().rows.length>0?this.parent.getGrid().getHeaderContainer().getCellForRowColumn(this.parent.getGrid().getHeaderContainer().rows[0].getData(),this.parent.getColumn()):null;
        if(val)
        {
            var vals = val.split("_");
            if(vals.length == 2)
            {
                this.filterExpression1.filterOperation = vals[0];
                this.filterExpression1.expression = vals[1];
            }
            else if(vals.length== 5)
            {
                this.filterExpression1.filterOperation = vals[0];
                this.filterExpression1.expression = vals[1];
                this.andOr = vals[2];
                this.filterExpression2.filterOperation = vals[3];
                this.filterExpression2.expression = vals[4];
            }
            else
            {
                alert('Invalid state for filter');
            }
        }
        else
        {
            this.filterExpression1.expression = null;
            this.filterExpression2.expression = null;
        }
        if(headerCell)
        {
            headerCell.refreshCell();//this updates the icon.
        }

    };
    //==================End IFilterControl Methods===============================/

    CustomFilterControl.prototype.onOkButton=function(){

        this.filterExpression1.columnName = this.parent.getColumn().getSearchField();
        this.filterExpression2.columnName = this.parent.getColumn().getSearchField();


        this.filterExpression1.filterOperation = $(this.popup.domElement).find("#selectFilter1").val();
        this.filterExpression1.expression = $(this.popup.domElement).find("#valueFilter1").val();


        this.filterExpression2.filterOperation = $(this.popup.domElement).find("#selectFilter2").val();
        this.filterExpression2.expression = $(this.popup.domElement).find("#valueFilter2").val();

        this.andOr = $(this.popup.domElement).find("#selectAndOr").val();

        this.destroyPopup();
        this.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(flxConstants.EVENT_CHANGE));
        this.dispatchEvent(new flexiciousNmsp.FlexDataGridEvent(flxConstants.EVENT_VALUE_COMMIT));

        var headerCell = this.parent.getGrid().getHeaderContainer().getCellForRowColumn(this.parent.getGrid().getHeaderContainer().rows[0].getData(),this.parent.getColumn());
        headerCell.colIcon.setSource(headerCell.getIconUrl());
    };


    CustomFilterControl.prototype.destroyPopup=function(force){
        if(this.alwaysVisible && !force)return;
        this.removeChild(this.popup);
        this.popup=null;
        flexiciousNmsp.DisplayList.instance().documentComponent.removeEventListener(flxConstants.EVENT_MOUSE_UP,this.onDocumentMouseUp);
    };
    CustomFilterControl.prototype.onDocumentMouseUp=function(e){
        if(this.owns(e.triggerEvent.target)){

        }  else{
            this.destroyPopup();
        }
    };

    CustomFilterControl.prototype.owns=function(elem){
        return flexiciousNmsp.UIComponent.prototype.owns.apply(this,[elem]) || (this.popup &&this.popup.owns(elem));
    };

    CustomFilterControl.prototype.kill=function(){
        flexiciousNmsp.DisplayList.instance().documentComponent.removeEventListener(flxConstants.EVENT_MOUSE_UP,this.onDocumentMouseUp);
        flexiciousNmsp.TextInput.prototype.kill.apply(this);
        if(this.popup){
            this.popup.kill();
            this.popup=null;
        }
    };
    /**
     * Initializes the auto complete and watermark plugins
     */
    CustomFilterControl.prototype.initialize=function(){
        flexiciousNmsp.UIComponent.prototype.initialize.apply(this);

    };
    CustomFilterControl.prototype.getDataProvider = function () {
        return this._dataProvider;
    };
    CustomFilterControl.prototype.setDataProvider=function(value){
        this._dataProvider=value;
    };
}(window));
