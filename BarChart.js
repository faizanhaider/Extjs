Ext.define('Int.apps.cc.screen.charts.BarChart', {
    extend: 'Int.apps.cc.screen.charts.BaseChartPanel',

    alias: 'widget.barchart',
    yFields: ['DocumentsCount'],
    model: 'TopicsAnalytics',

    labelConfig: {
        rotate: {
            degrees: 270
        }
    }
});

Ext.define("TopicsAnalytics", {
    extend: 'Ext.data.Model',
    requires: ['Int.data.proxy.IntAjax'],
    proxy: {
        type: 'intajax',
        url: AppConfig.baseUrl + 'CommentChecker/Search/GetDocumentAnalytics',
        reader: {
            type: 'json',
            root: 'Contents.DocumentAnalytics',
            totalProperty: 'Contents.DocumentAnalytics'
        }
    },

    fields: ['Name', 'Key', 'DocumentsCount', 'AliasName']
});
