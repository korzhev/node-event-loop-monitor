var time,
    diff_old=[0,0],
    ticks = [],
    pid = process.pid,
    CartesianTree = require('./CartesianTree'), // Äåêàðòîâî äåðåâî.
    interval = 10;

function EventLoopMonitor() {

    this._loopMonitor = null;
    this._counter = null;

    events.EventEmitter.call(this);
}

util.inherits(EventLoopMonitor, events.EventEmitter);

EventLoopMonitor.prototype.stop = function() {
    clearInterval(this._loopMonitor);
    clearInterval(this._counter);
};

EventLoopMonitor.prototype.start = function(customInterval, rawFlag, percentileList) {
    time = process.hrtime(); // https://nodejs.org/api/process.html#process_process_hrtime
    var customInterval = customInterval || 4000,
        percentileList = percentileList || [0.5, 0.9, 0.99];

    this._loopMonitor = setInterval(function () {
        var diff = process.hrtime(time);
        ticks.push({diff: diff, diff_old: diff_old});
        diff_old = diff;
    }, interval);

    this._counter = setInterval(function() {

        var _ticks = ticks.reduce(function(obj, tick, i){
            var key = Math.floor((
            tick.diff[0]*1e9 + tick.diff[0][1] -
            tick.diff_old[0]*1e9 - tick.diff_old[1] -
            interval*1e6) / 1000); // finding diff between 2 hrtime
            obj[key] = obj[key] || 0;
            obj[key]++;
            return obj;
        }, {});

        if (rawFlag) {
            this.emit('rawData', {
                    memory: process.memoryUsage(),
                    pid: pid,
                    ticks: _ticks
                }
            );

        } else {

            var ct = new CartesianTree();
            for (var key in _ticks) {
                ct.add(parseInt(key, 10), _ticks[key]);
            }

            var json = ct.statByPercentile(percentileList);

            this.emit('data', {
                    memory: process.memoryUsage(),
                    pid: pid,
                    latency: percentileList.reduce(function(res, current) {
                        res['p' + current*100] = Math.floor(json[current].k || 0);
                        return res;
                    }, {})
                }
            );

        }

        // https://www.scirra.com/blog/76/how-to-write-low-garbage-real-time-javascript
        /*
         * Assigning [] to an array is often used as a shorthand to clear it (e.g.
         * arr = [];), but note this creates a new empty array and garbages the old
         * one! It's better to write arr.length = 0; which has the same effect but
         * while re-using the same array object.
         */
        ticks.length = 0;
    }.bind(this), customInterval);
};

module.exports = EventLoopMonitor;
