//https://github.com/trentm/node-bunyan

var bunyan = require('bunyan');

var log = bunyan.createLogger({
    name: 'amdocs-monitor',
    streams: [{
        stream: process.stdout
        // `type: 'stream'` is implied
    },
	{
        path: './log/amdocs-monitor.log',
        // `type: 'file'` is implied
        type: 'rotating-file',
        period: '1h',   // daily rotation
        count: 3        // keep 3 back copies
    }]
	});

log.level('debug');

exports.log = log;