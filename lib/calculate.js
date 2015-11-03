/**
 * Created by REGION\vn.korzhev on 26.10.15.
 */
"use strict";

var CartesianTree = require('./CartesianTree');

module.exports = {
    calculate: function (data) {

        var ct = new CartesianTree();
        data.forEach((obj)=>{
            Object.keys(obj).forEach((key)=> {
                ct.add(parseInt(key, 10), obj[key]);
            });
        });

        var json = ct.statByPercentile([0.5, 0.9, 0.99]);
        return {
            'p50': Math.floor(json[0.5].k || 0),
            'p90': Math.floor(json[0.9].k || 0),
            'p99': Math.floor(json[0.99].k || 0)
        };
    }
};