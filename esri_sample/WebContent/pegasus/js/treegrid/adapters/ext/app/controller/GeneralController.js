Ext.define('mvc.controller.GeneralController', {
	extend : 'Ext.app.Controller',
	models : [],
	stores : [],
	views : ['TreeView', 'MainTabView'],
	init : function() {
		this.control({
			//'treepanelId': {
              //  itemclick: this.onItemClicked
            //}
		});
	},
	onItemClicked: function() {
        console.log('ItemClicked');
    }
});
