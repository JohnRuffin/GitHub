

TreeViewUi = Ext.extend(Ext.Panel, {
    initComponent: function () {

        var json =[];
        for(var i = 1; i < myCompanyNameSpace.allExamples.length; i++) {
            var temp_allex = myCompanyNameSpace.allExamples[i];
            json.push({ "text": temp_allex.name, "id": temp_allex.id, "leaf": true, "cls": "file",item:temp_allex });
        }

        this.items = [{
            xtype: 'treepanel',
            id: 'treepanelId',
            height:200,
            autoScroll:true,
            border:true,
            root: {
                expanded: true,
                children: [{
                    text: "All Examples",
                    expanded: true,
                    children: json
                }]
            }
            , rootVisible: false
        }];
        TreeViewUi.superclass.initComponent.apply(this);


    }
});