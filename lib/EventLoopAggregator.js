var time,
    diff_old=[0,0],
    ticks = [],
    pid = process.pid,
    CartesianTree = require('./CartesianTree'), // Декартово дерево.
    interval = 10;


module.exports = EventLoopAggregator;