Ext.define('Int.apps.cc.screen.charts.AnalyticsViewPanel', {
    extend: 'Int.screen.Screen',
    title: 'Analytics',
    isAnalyticsScreen: true,
    ScreenType: 'Analytics',

    requires: [
        "Int.export.option.cc.SelectedCategory",
        "Int.toolbar.header.AnalyticsHeaderToolBar",
        "Int.apps.cc.screen.charts.AnalyticsViewInfoPanel"
    ],

    exports: {
        uri: "CommentChecker/Export",

        save: {
            options: [
                {
                    name: 'Int.export.option.ExportFilingToFileOption',
                    opt: {
                        showFileNameFormatOption: true,
                        showOnlyExcelOption: true,
                        showZipOption: false,
                        showIncludeCoverOption: false,
                        suboptions: [
                            { name: 'Int.export.option.cc.SelectedCategory', opt: { key: 'ListWithoutSnippets', defaultOptionText: 'Leading Topics', isDocument: false } }
                        ]
                    }
                }
            ]
        },

        email: {
            options: [
                {
                    name: 'Int.export.option.ExportFilingToFileOption',
                    opt: {
                        defaultOptionText: 'Email as an attachment',
                        showFileNameFormatOption: true,
                        showOnlyExcelOption: true,
                        showZipOption: false,
                        showIncludeCoverOption: false,
                        suboptions: [
                            { name: 'Int.export.option.cc.SelectedCategory', opt: { key: 'ListWithoutSnippets', defaultOptionText: 'Leading Topics', isDocument: false } }
                        ]
                    }
                }
            ]
        }
    },

    initComponent: function () {
        var me = this;
        me.callParent();
        me.addManagedListener(me, 'activate', me.onActivate, me);
    },

    onActivate: function () {
        var me = this;
        App.getScreensManager().getFiltersPanel().setFiltersInternalValue(me.params);
    },

    getSelectionStatus: function () {
        var me = this;

        var params =  me.grid.getSelectionStatus();
        params["IsAnalyticView"] = true;

        return params;
    },

    _getLeftPanel: function () {
        var me = this;
        return App.getScreensManager().getFiltersPanel();
    },

    _getRightPanel: function () {
        var me = this;

        me.headerPanel = Ext.create('Int.apps.core.screen.document.DocumentHeaderPanel', {
            tbar: me._getToolbars(),
            owner: me
        });
                
        me._rightPanel = Ext.create('Ext.panel.Panel', {

            layout: {
                type: 'vbox',
                align: 'stretch',
                pack: 'start'
            }, 

            items: [
                me.headerPanel
            ]
        });

        me._rightPanel.mon(me._rightPanel, 'afterrender', function () {
            me.setLoading(true);
            me._loadData();
        }, me);

        return me._rightPanel;
    },

    _getToolbars: function () {
        var me = this;

        me.toolbar = Ext.create('Int.toolbar.header.AnalyticsHeaderToolBar', {
            dock: 'top',
            owner: me
        });
        return me.toolbar;
    },
    
    _createPanels: function () {
        var me = this;

        return {
            left: me._getLeftPanel(),
            right: me._getRightPanel()
        }
    },

    _loadData: function () {
        var me = this;

        //load leading topics count
        Ext.Ajax.request({
            url: AppConfig.baseUrl + 'CommentChecker/Search/GetTopicsAnalyticsForResults',
            method: "post",
            headers: { 'Content-Type': 'application/json' },
            jsonData: Ext.JSON.encode({
                SearchLogId: me.searchLogId
            }),
            success: function (response, request) {
                var responseData = Ext.JSON.decode(response.responseText);
                if (responseData && responseData.Contents) {

                    me.responseData = responseData.Contents;
                    me.topicsStore = Ext.create('Ext.data.Store', {
                        model: 'AnalyticsModel',
                        data: responseData.Contents.DocumentAnalytics
                    });
                    me._onChartsPanelLoad();
                }
            },

            failure: function(){
                me._onLoadError();
            },

            scope: this
        });
    },

    _onChartsPanelLoad: function () {
        var me = this;
        
        me.setLoading(false);
        me.isChartsLoaded = true;

        if (me.isVisible()) { //add charts if its active 
            me._addChartItems();
        }
    },

    _addChartItems: function(){
        var me = this;

        me.isChartsAdded = true;

        if (me.responseData.DocumentAnalyticsListView && me.responseData.DocumentAnalyticsListView.length > 0) {

            me.infoPanel = Ext.create('Int.apps.cc.screen.charts.AnalyticsViewInfoPanel', { owner: me });
            me.chartPanel = Ext.create('Int.apps.cc.screen.charts.ColumnChart', {
                model: 'TopicsAnalyticsBarForResult',
                searchLogId: me.searchLogId,
                owner: me,
                grid: me.grid,
                minHeight: (Ext.isIE7 || Ext.isIE8 ? 520 : 460),
                minWidth: 500,
                majorTicksCount: 4,
                store: me.topicsStore
            });

            me.rightInnerPanel = Ext.create('Ext.panel.Panel', {
                autoScroll: true,
                cls: 'pa-stats-panel',
                layout: 'column',
                flex: 1,
                items: [
                    me.chartPanel,
                    {
                        xtype: 'panel',
                        border: false,
                        autoScroll: true,
                        padding: 5,
                        items: [me.infoPanel]
                    }
                ]
            });

            me._rightPanel.add(me.rightInnerPanel);
            var html = me.infoPanel._getHtmlForLeftPanel(me.responseData.DocumentAnalyticsListView);
            me.infoPanel.update(html);
        } else {
            me._onLoadError();
        }
    },

    _onLoadError: function () {
        var me = this;
        me.setLoading(false);
        me.toolbar.reAddItems();
    },

    reloadChartPanel: function () {
        var me = this;

        if (me.isChartsLoaded && !me.isChartsAdded) {
            me._addChartItems();
        }
    }
});