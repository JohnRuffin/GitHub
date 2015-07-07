//Using a custom sort icon. We could do this using the styles as well, but that would require a live server, not local.
flexiciousNmsp.StyleDefaults.defaults.sortArrowSkin = '/custom/customsortArrow.png';
//make space for the sort icon
flexiciousNmsp.StyleDefaults.defaults.headerPaddingLeft = 16;
//we move the sort icon to the left, and no longer need mcs
flexiciousNmsp.StyleDefaults.defaults.enableSplitHeader=false;
//we move the sort icon to the left, and no longer need mcs
flexiciousNmsp.StyleDefaults.defaults.enableMultiColumnSort=false;
//we move the sort icon to the left, and no longer need mcs
flexiciousNmsp.StyleDefaults.defaults.alternatingItemColors=[0xF2F7FA, 0xFFFFFF];
//custom colors
flexiciousNmsp.StyleDefaults.defaults.headerColors=[0xEDECDF, 0xEDECDF];
//custom colors
flexiciousNmsp.StyleDefaults.defaults.columnGroupColors=[0xEDECDF, 0xEDECDF];
//custom colors
flexiciousNmsp.StyleDefaults.defaults.pagerColors=[0xEDECDF, 0xEDECDF];
//custom colors
flexiciousNmsp.StyleDefaults.defaults.footerColors=[0xEDECDF, 0xEDECDF];
//custom colors
flexiciousNmsp.StyleDefaults.defaults.alternatingTextColors=[0x475055, 0x475055];

//we center align the column headers.
flexiciousNmsp.FlexDataGridColumn.prototype.constructed = function () {
    flexiciousNmsp.EventDispatcher.prototype.constructed.apply(this);
    this.headerAlign = "center";
    //regardless of what the configuration says, we use a custom filter control
    this._filterRenderer = new flexiciousNmsp.ClassFactory(myCompanyNameSpace.SpaceTime_CustomFilterControl);
};
