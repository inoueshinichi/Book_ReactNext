// Utility

const perf = require('node:perf_hooks');

// 時間計測
function perfElapsedTime(func) {
    const tp_start = perf.performance.now();
    func();
    const tp_end = perf.performance.now();
    console.log(`Elapsed time: ${pt_end - pt_start}[ms]`);
}

exports.perfElapsedTime = perfElapsedTime;