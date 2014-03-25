Ext.define('Int.apps.cc.screen.charts.ChartWinPanel', {
    extend: 'Ext.window.Window',

    cls: 'x-chart-panel x-chart-window',

    modal: true,
    height: 415,
    width: 750,
    //maximizable: true,
    layout: 'fit',

    title: 'Most Common Categories',
    requires:[
        "Int.export.option.cc.SelectedCategory"
    ],

    
    initComponent: function () {
        var me = this;

        me._initComponent();
        me.callParent(arguments);
    },

    _initComponent: function () {
        var me = this;

        me.leftPanel = Ext.create('Ext.panel.Panel', { flex: 1, cls:'x-chart-info-panel' });
        me.items = [{
            xtype: 'panel',
            padding: 5,
            flex: 1,
            layout: {
                type: 'hbox'
            },
            items: [
                {
                    xtype: 'columnchart',
                    model: 'TopicsAnalyticsBarForResult',
                    searchLogId: me.searchLogId,
                    owner: me,
                    minHeight: 300,
                    minWidth: 400
                },
                me.leftPanel
            ]
        }];

        me._addExportControl();
    },

    _addExportControl: function () {
        var me = this;

        me.saveAction = Ext.create('Int.export.action.SaveAction', {
            owner: me
        });

        me.emailAction = Ext.create('Int.export.action.EmailAction', {
            owner: me
        });

        me.tbar = [
            '->',
            me.saveAction,
            me.emailAction
        ];
    },

    onChartPanelLoad: function (data) {
        var me = this, html = "";

        if (data && data.items) {
            html = me._getHtmlForLeftPanel(data.items);
            me.leftPanel.update(html);
        }
    },

    _getHtmlForLeftPanel: function (data) {
        var me = this,
            html = "";

        html += "<table>";
        for (var i = 0; i < data.length; i++) {
            var node = data[i].data, index = i + 1;

            html += "<tr>";
            html += "<td style='width:20px'>" + index + ".</td>";
            html += "<td style='width:200px'>" + node.Key + "</td>";
            html += "<td>" + Ext.util.Format.number(node.Name, '0,0') + "</td>";
            html += "</tr>";
        }

        html += "</table>";
        return html;
    }
});

