Ext.define('Int.apps.cc.screen.charts.BaseChartPanel', {
    extend: 'Ext.chart.Chart',

    legend: false,// { position: 'top' },
    animate: true,
    shadow: true,
    yFields: [],
    
    initComponent: function () {
        var me = this;

        me._initComponent();
        me.callParent();
    },

    _initComponent: function () {
        var me = this;
        
        if (me.searchLogId) {
            me.mon(me.store, "beforeload", function (store, operation, opt) {
                me.store.getProxy().extraParams['SearchLogId'] = me.searchLogId;
            });
        }

        me.mon(me.store, "load", me._onStoreLoadEvent, me);

        me.axes = me._getAxisArray();
        me.series = me._getSeriesArray();
    },

    _getAxisArray:function(){
        var me = this;

        return [{ //x-axis
            type: 'Category',
            position: 'bottom',
            fields: ['AliasName'],
            title: ['AliasName'],
            label: me.labelConfig,
            minimum: 0/*,
            minorTickSteps: 1 //one minor tick between two major ticks*/

        }, { //y-axis
            type: 'Numeric',
            position: 'left',
            fields: me.yFields,
            title: false,
            label: {
                renderer: function (v) {
                    if (v % 1 == 0) { //Show ticks value in integer
                        return v;
                    } else {
                        return "";
                    }
                }
            }
        }];
    },

    _getSeriesArray: function () {
        var me = this;
        
        return [{
            type: 'column',
            axis: 'bottom',
            xField: 'AliasName',
            yField: me.yFields,
            /*highlight: true,
            style: {
                fill: '#456d9f'
            },
            highlightCfg: {
                fill: '#a2b5ca'
            },
            showMarkers: true,
            markerConfig: {
                radius: 4,
                size: 4,
                fill: 'rgb(69,109,159)'
            },

            style: {
                fill: 'rgb(194,214,240)',
                opacity: 0.5,
                'stroke-width': 0.5
            },

            label: {
                display: 'outside',
                orientation: 'vertical',
                field: 'DocumentsCount'
            },*/

            tips: {
                trackMouse: true,
                renderer: function (storeItem, item) {
                    this.update(item.value[1] + ' letters in ' + item.value[0]);
                }
            }
        }];
    },

    _onStoreLoadEvent: function (store) {
        var me = this;

        me.responseStore = store;

        if (me.owner) {
            if (me.owner.onChartPanelLoad) {
                var rawData = me.store.getProxy().getReader().rawData;
                if (rawData) {
                    me.owner.onChartPanelLoad(rawData.Contents.DocumentAnalyticsListView, store);
                }
            }
        }

        me.reloadChartPanel = function () {
            var me = this;

            if (me.responseStore && me.responseStore.data && me.responseStore.data.items && me.responseStore.data.items.length > 0) {
                me.responseStore.loadData(me.responseStore.data.items);
            }
        }
    }
});
