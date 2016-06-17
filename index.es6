'use strict';

const map = require('map-stream');
let log = console.log;

function waitByTime(opts) {
  return (file, callback) => {
    if (opts.before) {
      opts.before(opts);
    }

    setTimeout(() => {
      log(`Waiting for ${opts}ms`);
      callback(null, file);

      if (typeof opts.after !== 'undefined') {
        opts.after(opts);
      }
    }, opts.time)
  }
}

function waitByCallback(opts) {
  return (file, callback) => {
    if (opts.before) {
      opts.before(opts);
    }

    let run_count = 0;

    log('Waiting for callback to return truthy');

    while (!opts.callback()) {
      run_count++;
    }

    callback(null, file);

    log(`Ran callback ${run_count} times`);

    if (opts.after) {
      opts.after(opts);
    }
  }
}

module.exports = (opts) => {
  if (typeof opts === 'number' || typeof opts === 'undefined') {
    opts = {
      time: opts || 1000
    };
  }

  if (typeof opts === 'function') {
    opts = {
      callback: opts
    }
  };

  if (!opts.verbose) {
    log = () => {};
  }

  if (opts.callback) {
    return map(waitByCallback(opts));
  } else {
    return map(waitByTime(opts));
  }
};
