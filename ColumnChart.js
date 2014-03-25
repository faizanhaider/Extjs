Ext.define('Int.apps.cc.screen.charts.ColumnChart', {
    extend: 'Int.apps.cc.screen.charts.BaseChartPanel',

    alias: 'widget.columnchart',
    yField: ['DocumentsCount'],
    model: 'TopicsAnalyticsBar',

    
    _getAxisArray: function () {
        var me = this;

        return [{
            type: 'Numeric',
            position: 'bottom',
            fields: me.yField,
            minimum: 0,
            //maximum: 10,
            majorTickSteps: (me.majorTicksCount ? me.majorTicksCount : 8),
            label: {
                renderer: Ext.util.Format.numberRenderer('0,0')
            }
        }, {
            type: 'Category',
            position: 'left',
            fields: ['AliasName'],
            title: ['AliasName']
        }];
    },

    _getSeriesArray: function () {
        var me = this;

        return [{
            type: 'bar',
            axis: 'bottom',
            xField: 'AliasName',
            yField: me.yField,
            style : {
                cursor : 'pointer'
            },
            tips: {
                trackMouse: true,
                renderer: function (storeItem, item) {
                    var verb = (item.value[1] == 1 ? 'question/answer' : 'questions/answers');
                    if (me.grid && me.grid.isDocumentGrid) {
                        verb = (item.value[1] == 1 ? 'document' : 'documents');
                    }

                    this.update(Ext.util.Format.number(item.value[1], '0,0') + ' ' + verb + ' regarding ' + item.value[0]);
                }
            },

            //to limit the bar width
            renderer: function (sprite, record, attr, index, store) {
                if (store.getCount() == 1) {
                    attr.height = 70;
                    attr.y = 180;
                }
                return attr;
            },

            listeners: {
                itemclick: function (params) {
                    if (params && params.storeItem && params.storeItem.raw) {
                        App.getSearchManager().serachOnTopics({
                            Name: params.storeItem.raw.Name,
                            Value: params.storeItem.raw.Key
                        });
                    }
                }
            }

        }];
    }
});

Ext.define("AnalyticsModel", {
    extend: 'Ext.data.Model',
    fields: ['Name', 'Key', 'DocumentsCount', 'AliasName']
});
