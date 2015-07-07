Ext.define('mvc.view.TreeView', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.TreeView',
	initComponent : function() {
		var json = [];
		for(var i = 1; i < myCompanyNameSpace.allExamples.length; i++) {
			var temp_allex = myCompanyNameSpace.allExamples[i];
			json.push({
				"text" : temp_allex.name,
				"id" : temp_allex.id,
				"leaf" : true,
				"cls" : "file",
				item : temp_allex
			});
		}
		this.items = {
			xtype : 'treepanel',
			border : false,
			id : 'treepanelId',
			height : document.documentElement.clientHeight - 55,
			autoScroll : true,
			root : {
				expanded : true,
				children : [{
                    text: "All Examples",
                    expanded: true,
                    children: json
                }]
			},
			rootVisible : false,
			listeners : {
				itemclick : function(view, rec, item, index, eventObj) {
                    item = rec.raw.item;
                    if(!item)return;{

                        myCompanyNameSpace.loadExample(item.id,item.dataProvider,item.showIFrame,item.iframeWidth,item.iframeHeight,item.styles);
                    }
				},
                afterrender: function(pnl) {
                    var result = {}, queryString = location.search.slice(1),
                        re = /([^&=]+)=([^&]*)/g, m;
                    while (m = re.exec(queryString)) {
                        result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
                    }
                    if(result["example"]){
                        for(var i = 1; i < myCompanyNameSpace.allExamples.length; i++) {
                            var item = myCompanyNameSpace.allExamples[i];
                            if(item.name==result["example"]){
                                var rec="";
                                setTimeout( function(){
                                        document.getElementById('lblName').innerHTML=rec.raw.item.id;
                                        document.getElementById('lblDescription').innerHTML=rec.raw.item.description;
                                   });
                                if (pnl.getRootNode().hasChildNodes()) {
                                    var mypanel= Ext.getCmp('treepanelId');
                                    rec=mypanel.getRootNode().findChild("id",item.id, true);
                                    mypanel.getSelectionModel().select(rec);

                                } else {
                                    console.log('no childs');
                                }
                            }
                        }
                    }else {
                        var rec="";
                        setTimeout( function(){
                            document.getElementById('lblName').innerHTML=rec.raw.item.id;
                            document.getElementById('lblDescription').innerHTML=rec.raw.item.description;
                        });
                        if (pnl.getRootNode().hasChildNodes()) {
                            var mypanel= Ext.getCmp('treepanelId');
                            rec=mypanel.getRootNode().findChild("id","Simple", true);
                            mypanel.getSelectionModel().select(rec);

                        } else {
                            console.log('no childs');
                        }
                    }

                }
			}
		};
		this.callParent();
	}
});
