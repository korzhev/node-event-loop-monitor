/**
 * Created by REGION\vn.korzhev on 26.10.15.
 */
"use strict";

var CartesianTree = require('./CartesianTree');

module.exports = {
    calculate: function (data, percentileList) {
        var percentileList = percentileList || [0.5, 0.9, 0.99];
        var ct = new CartesianTree();
        data.forEach((obj)=>{
            Object.keys(obj).forEach((key)=> {
                ct.add(parseInt(key, 10), obj[key]);
            });
        });

        var json = ct.statByPercentile(percentileList);
        return percentileList.reduce(function(res, current) {
            res['p' + current] = Math.floor(json[current].k || 0);
            return res;
        }, {});
    }
};