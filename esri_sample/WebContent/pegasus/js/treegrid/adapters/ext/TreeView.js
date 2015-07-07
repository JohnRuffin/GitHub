TreeView = Ext.extend(TreeViewUi, {
    initComponent: function () {
        TreeView.superclass.initComponent.call(this);
        Ext.getCmp('treepanelId').on('click', this.showWin, this);
    },
    showWin:function(n)
    {
        var item=n.attributes.item;
        myCompanyNameSpace.loadExample(item.id,item.dataProvider,item.showIFrame,item.iframeWidth,item.iframeHeight,item.styles)
    }
});
Ext.reg('Ext-TreeView', TreeView);