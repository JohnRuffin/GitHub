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
flexiciousNmsp.FlexDataGridHeaderCell.prototype.placeSortIcon = function() {
    if (this.icon) {
        var pt = new flexiciousNmsp.Point(1, (this.getHeight() - 18) / 2);
        pt = this.icon.parent.globalToLocal(this.localToGlobal(pt));
        this.icon.move(pt.getX() + this.getWidth() - 12, pt.getY());
        if (this.sortLabel && this.level.getEnableMultiColumnSort()) {
            var right = this.level.grid.headerSortSeparatorRight;
            this.sortLabel.setWidth(this.level.grid.getStyle("multiColumnSortNumberWidth"));
            this.sortLabel.setHeight(this.level.grid.getStyle("multiColumnSortNumberHeight"));
            this.sortLabel.move(pt.getX() + this.getWidth() - 12, pt.getY() + 4);
        }
    }
};