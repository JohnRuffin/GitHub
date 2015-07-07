Ext.define('mvc.view.MainTabView', {
    extend:'Ext.panel.Panel',
    alias:'widget.MainTabView',
    initComponent:function () {
        this.items = {
            xtype:'panel',
            layout:{
                align:'stretch',
                type:'vbox'
            },
            items:[
                {
                    xtype:'panel',
                    title:' HTMLTreeGrid Demo Console',
                    items:[
                        {
                            padding:5,
                            html:'<div style="float: left; font-weight: bold;">Example Name&nbsp;:&nbsp;</div><div id="lblName">&nbsp;</div> <div  style="float: left; font-weight: bold;">Description&nbsp;:&nbsp;</div><div id="lblDescription">&nbsp;</div>'
                        }
                    ]
                },
                {
                    xtype:'tabpanel',
                    id:'tabId',
                    height:'86%',
                    activeTab:0,
                    items:[
                        {
                            title:'Demo',
                            autoScroll:true,
                            layout:'fit',
                            style:'padding: 20px;',
                            items:[
                                {
                                    html:'<div id="gridContainer" style="height:99%;width:99%;"></div>'
                                }
                            ]
                        },
                        {
                            title:'Explanation',
                            autoScroll:true,
                            layout:'fit',
                            items:[
                                {
                                    html:'<iframe id="explanationFrame" style="width:100%;height: 100%" frameborder="0"></iframe>'
                                }
                            ]
                        },
                        {
                            title:'Source',
                            autoScroll:true,
                            layout:'fit',
                            items:[
                                {
                                    html:'<pre id="sourceContainer" style="width:100%;height: 100%; overflow:scroll" class="prettyprint"></pre>'
                                }
                            ]
                        },
                        {
                            title:'Themes',
                            autoScroll:true,
                            height:'90%',
                            layout:'fit',
                            items:[
                                {
                                    html:'<div id="themeContainer" style="width:100%;height: 100%; overflow: scroll;" ></div>'
                                }
                            ]
                        }
                    ],
                    listeners:{
                        'tabchange':function (tabPanel, tab) {
                            if (tab.title == "Demo" && myCompanyNameSpace.currentConfig) {
                                myCompanyNameSpace.reloadConfig();
                            } else if (tab.title == "Themes") {
                                myCompanyNameSpace.buildThemes();
                            }
                            else if(tab.title=="Source")
                            {
                                myCompanyNameSpace.reloadConfig();
                            }
                            else if(tab.title=="Explanation")
                            {

                                myCompanyNameSpace.reloadConfig();
                            }
                        }
                    }
                },
                {
                    html:'<div style="height: 20px;">&nbsp;gffsg<div>'
                }
            ]
        };
        setTimeout(myCompanyNameSpace.onBodyLoad, 100);
        this.callParent();
    }
});

