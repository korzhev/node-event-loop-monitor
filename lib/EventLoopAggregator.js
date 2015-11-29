var time,
    diff_old=[0,0],
    ticks = [],
    pid = process.pid,
    CartesianTree = require('./CartesianTree'), // Декартово дерево.
    interval = 10;

function aggregateArray(arr) {
    arr.for
}

function EventLoopAggregator() {
    this.data = [];
    this._counter = null;
}

EventLoopAggregator.prototype.stop = function() {
    clearInterval(this._counter);
};

EventLoopAggregator.prototype.add = function(rawData) {
    this.data.push(rawData);
};

EventLoopAggregator.prototype.start = function(customInterval, percentileList) {
    var customInterval = customInterval || 4000,
        percentileList = percentileList || [0.5, 0.9, 0.99];

    this._counter = setInterval(function() {
        var ct = new CartesianTree(),
            memUsage = {rss: 0, heapTotal: 0, heapUsed: 0};

        this.data.forEach(function(currentValue) {
            memUsage = ['rss', 'heapTotal', 'heapUsed'].reduce(function(prev, k) {
                    return prev[k] += currentValue.memory[k];
            }, memUsage);

            for (var key in currentValue.latency) {
                ct.add(parseInt(key, 10), currentValue.latency[key]);
            }
        });

        var json = ct.statByPercentile(percentileList);
        this.emit('data', {
                memory: memUsage,
                pid: this.data.map(function(d) { return d.pid }),
                latency: percentileList.reduce(function(res, current) {
                    res['p' + current*100] = Math.floor(json[current].k || 0);
                    return res;
                }, {})
            }
        );
        this.data.length = 0;
    }.bind(this), customInterval);
};

module.exports = EventLoopAggregator;
