
/**
 * Ext.ux.ToastWindow
 *
 * @author  Edouard Fattal
 * @date    March 14, 2008
 *
 * @class Ext.ux.ToastWindow
 * @extends Ext.Window
 */

Ext.namespace("Ext.ux");


Ext.ux.NotificationMgr = {
    positions:[]
};

Ext.ux.Notification = Ext.extend(Ext.Window, {
    initComponent:function () {
        Ext.apply(this, {
            iconCls:this.iconCls || 'x-icon-information',
            cls:'x-notification',
            width:200,
            autoHeight:true,
            plain:false,
            draggable:false,
            bodyStyle:'text-align:center'
        });
        if (this.autoDestroy) {
            this.task = new Ext.util.DelayedTask(this.hide, this);
        } else {
            this.closable = true;
        }
        Ext.ux.Notification.superclass.initComponent.call(this);
    },
    setMessage:function (msg) {
        this.body.update(msg);
    },
    setTitle:function (title, iconCls) {
        Ext.ux.Notification.superclass.setTitle.call(this, title, iconCls || this.iconCls);
    },
    onRender:function (ct, position) {
        Ext.ux.Notification.superclass.onRender.call(this, ct, position);
    },
    onDestroy:function () {
        Ext.ux.NotificationMgr.positions.remove(this.pos);
        Ext.ux.Notification.superclass.onDestroy.call(this);
    },
    cancelHiding:function () {
        this.addClass('fixed');
        if (this.autoDestroy) {
            this.task.cancel();
        }
    },
    afterShow:function () {
        Ext.ux.Notification.superclass.afterShow.call(this);
        Ext.fly(this.body.dom).on('click', this.cancelHiding, this);
        if (this.autoDestroy) {
            this.task.delay(this.hideDelay || 5000);
        }
    },
    animShow:function () {
        this.pos = 0;
        while (Ext.ux.NotificationMgr.positions.indexOf(this.pos) > -1)
            this.pos++;
        Ext.ux.NotificationMgr.positions.push(this.pos);
        this.setSize(200, 100);
        this.el.alignTo(document, "t-t", [ -20, -20 - ((this.getSize().height + 10) * this.pos) ]);
        this.el.slideIn('t', {
            duration:1,
            callback:this.afterShow,
            scope:this
        });
    },
    animHide:function () {
        Ext.ux.NotificationMgr.positions.remove(this.pos);
        this.el.disableShadow();
        this.el.ghost("t", {
            duration:1,
            remove:true
        });
    },

    focus:Ext.emptyFn

});


Ext.onReady(function () {
    var tab = new Ext.TabPanel({
        activeTab: 0,
        id:'tabId',
       // cls:'viewTab',
        items: [{
            title: 'Demo',
            autoScroll: true,
            layout: 'fit',
            style: 'padding: 20px;',
            items:[{
                html:'<div id="gridContainer" style="height:99%;width:99%;"></div>'
            }]

        }, {
            title: 'Explanation',
            autoScroll: true,
            layout: 'fit',
            items:[{
                html:'<iframe id="explanationFrame" style="width:100%;height: 100%" frameborder="0"></iframe>'
            }]
        }, {
            title: 'Source',
            autoScroll: true,
            layout: 'fit',
            items:[{
                html:'<pre id="sourceContainer" style="width:100%;height: 100%;overflow:scroll" class="prettyprint"></pre>'
            }]
        }, {
            title: 'Themes',
            autoScroll: true,
            layout: 'fit',
            items:[{
                html:'<div id="themeContainer" style="width:100%;height: 100%;" ></div>'
            }]
        }],
        listeners: {
            'tabchange': function(tabPanel, tab){
                if(tab.title=="Demo" && myCompanyNameSpace.currentConfig){
                    myCompanyNameSpace.reloadConfig();
                }else if(tab.title=="Themes" ){
                    myCompanyNameSpace.buildThemes();
                }
            }
        }
    });
    var viewport = new Ext.Viewport({
        layout: 'border',
        items: [{
            region: 'west',
            id: 'west-panel',
            split: true,
            width: 200,

            collapsible: true,
            margins: '0 0 0 5',
            layout: 'fit',
            xtype:'Ext-TreeView'
        },{
            region: 'center',
            layout: 'fit',
            items:tab
        }]
    });
    myCompanyNameSpace.onBodyLoad();
});
