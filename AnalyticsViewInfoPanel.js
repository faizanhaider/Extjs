Ext.define('Int.apps.cc.screen.charts.AnalyticsViewInfoPanel', {
    extend: 'Ext.panel.Panel',
    
    height: '80%',
    title: 'Leading Topics',
    cls: 'x-chart-info-panel',

    _getHtmlForLeftPanel: function (data) {
        var me = this,
            html = "";

        if (!data) {

            if (me.owner._onLoadError) {
                me.owner._onLoadError();
            }
            return;
        }

        html += "<div>";
        html += "<table>";

        for (var i = 0; i < data.length; i++) {
            var node = data[i],
                index = i + 1;

            if (node) {
                html += "<tr>";
                html += "<td style='width:30px'>" + index + ".</td>";
                html += "<td style='width:250px'>";
                html += '<a class="x-cc-topic-name" onclick="Ext.getCmp(\'' + me.id + '\').onNodeClick(\'' + node.Key + '\',\'' + node.Name + '\' )">' + node.Name + '</a>';
                html += "</td>";

                html += "<td>" + Ext.util.Format.number(node.DocumentsCount, '0,0') + "</td>";
                html += "</tr>";
            }
        }

        html += "</table>";
        html += "</div>";

        return html;
    },

    onNodeClick: function (Key, Name) {
        var me = this;
        App.getSearchManager().serachOnTopics({
            Name: Name,
            Value: Key
        });
    }
});