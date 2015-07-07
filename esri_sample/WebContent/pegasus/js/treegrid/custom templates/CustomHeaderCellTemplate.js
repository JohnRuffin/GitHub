
/**
 * Base functionality:
 * Places the sort icon after it is created. By default the column is placed 3 pixels from the right, half way from the top.
 * If the enableMultiColumnSort flag is set to true, the label is places above or below the icon based on if it is ascending or
 * descending respectively.
 *
 * Overriden functionality
 * Place icon to the left, place filter icon to the right.
 *
 */
flexiciousNmsp.FlexDataGridHeaderCell.prototype.placeSortIcon=function(){
    if(this.icon){
        var pt=new flexiciousNmsp.Point(1,(this.getHeight()-18)/2);
        pt= this.icon.parent.globalToLocal(this.localToGlobal(pt));
        //pt.x += this.level.grid.getHorizontalScrollPosition();
        this.icon.move(pt.getX(),pt.getY());
        if(this.sortLabel && this.level.getEnableMultiColumnSort()){
            var right=this.level.grid.headerSortSeparatorRight;
            this.sortLabel.setWidth(this.level.grid.getStyle("multiColumnSortNumberWidth"));
            this.sortLabel.setHeight(this.level.grid.getStyle("multiColumnSortNumberHeight"));
            //pt=new flexiciousNmsp.Point(this.getWidth() - right+2, Math.max(0,((this.getHeight()-this.sortLabel.getHeight)/2)-1));
            //pt= this.icon.parent.globalToLocal(this.localToGlobal(pt));
            this.sortLabel.move(pt.getX(),pt.getY()+4);
        }
    }

    //if(this.getColumn().getFilterRenderer().classConstruct.typeName == "CustomFilterControl")
    {
        if(!this.colIcon && this.getColumn().enableFilters == true)
        {
            this.createColumnIcon();
            this.colIcon.setSource(this.getIconUrl());
            this.colIcon.setHandCursor(true);
            this.colIcon.addEventListener(this,flexiciousNmsp.Constants.EVENT_CLICK, this.onFilterIconMouseClick);
        }
    }
};

/**
 * when the icon is enables, handles the mouse click event of the icon.
 * @param evt
 */
flexiciousNmsp.FlexDataGridHeaderCell.prototype.onFilterIconMouseClick=function (evt){
    var filterControl = this.getGrid().getFilterContainer().getCellForRowColumn(this.getGrid().getFilterContainer().rows[0].getData(),this.getColumn()).getRenderer();
    filterControl.showPopup();
};

/**
 * Base functionality:
 * Draws the little gray line between the header that does the actual sort
 * and the multi column sort part of the header that adds the current column to the existing sort.
 *
 * Overriden functionality
 * Place icon to the left, place filter icon to the right.
 */
flexiciousNmsp.FlexDataGridHeaderCell.prototype.drawSortSeparator=function (){
    var  uiUtil = flexiciousNmsp.UIUtils, flxConstants = flexiciousNmsp.Constants;
    if(this.icon)
    {
        uiUtil.attachClass(this.icon.domElement,'flexiciousUnSelectableText');
    }
    if(this.level&&this.level.grid.getEnableSplitHeader()&&this.getColumn()&&this.getColumn().sortable){
        var right=this.level.grid.getHeaderSortSeparatorRight();
        if(!this.sortSeparator){
            this.sortSeparator = new flexiciousNmsp.UIComponent("span");
            uiUtil.addChild(this,this.sortSeparator);
        }
        this.sortSeparator.setActualSize(1,this.getHeight()-6);
        this.sortSeparator.move(18,3);
        this.sortSeparator.domElement.className="sortSeparator";
    }
    this.placeSortIcon();

};


/**
 * Sets the size of the renderer, accounting for the width of the split header or the icon.
 * If enableSplitHeader is set to true, reduces the renderer's width by grid.headerSortSeparatorRight
 * If sort icon is rendererd, reduces the renderer's width by the icons width.
 * @inheritDoc
 *
 * Overriden functionality
 * Place icon to the left, place filter icon to the right.
 */
flexiciousNmsp.FlexDataGridHeaderCell.prototype.setRendererSize=function(cellRenderer,w, h){

    flexiciousNmsp.FlexDataGridCell.prototype.setRendererSize.apply(this,[cellRenderer,w, h]);

};

/**
 *  setting the correct position of the Icon.
 *
 *  Overriden functionality = we use colIcon for filter icon, so we remove all roll overs etc.
 */

flexiciousNmsp.FlexDataGridHeaderCell.prototype.getIconUrl=function (over){
    var filterVal = this.getGrid().getFilterValue(this.getColumn().dataField);
    if(this.getColumn().enableFilters == true) {
    	if(filterVal == "" || filterVal==null){
    		return this.getGrid().imagesRoot+"/custom/filter.png";
    	}else{
    		return this.getGrid().imagesRoot+"/custom/filter_applied.png";
    	}
    }
    return "";
};

