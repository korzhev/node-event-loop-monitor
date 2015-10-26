/**
 * Created by REGION\vn.korzhev on 26.10.15.
 */
var CartesianTree = require('./CartesianTree');

module.exports = {
    aggregate: function (prevData, lastData) {
        "use strict";
        var res = {},
            allKeys = new Set(
                Object.keys(prevData).concat(Object.keys(lastData))
            );

        allKeys.forEach((v)=> {
            res[v] = (prevData[v] || 0) + (lastData[v] || 0);
        });
        return res;
    },
    calculate: function (data) {
        "use strict";
        var ct = new CartesianTree();
        Object.keys(data).forEach((key)=> {
            ct.add(parseInt(key, 10), data[key]);
        });

        var json = ct.statByPercentile([0.5, 0.9, 0.99]);

        return {
            'p50': Math.floor(json[0.5].k || 0),
            'p90': Math.floor(json[0.9].k || 0),
            'p99': Math.floor(json[0.99].k || 0)
        };
    }
};