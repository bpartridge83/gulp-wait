'use strict';

var map = require('map-stream'),
  _log = console.log;

function runAfter(settings) {
  if (typeof settings.after === 'function') {
    _log('Wait: Calling after()');
    settings.after();
  }
}

module.exports = function (settings) {

  if (typeof settings !== 'object') {

    if (typeof settings === 'function') {
      settings = {
        callback: settings
      };
    } else {
      settings = {
        duration: settings
      };
    }
  }

  if (!settings.verbose) {
    _log = function () {
      return;
    };
  }

  settings.duration = settings.duration || 1000;

  return map(function (file, cb) {

    if (typeof settings.before === 'function') {
      _log('Wait: Calling before()');
      settings.before();
    }

    if (typeof settings.callback === 'function') {
      var result = false;
      var run_count = 0;
      _log('Waiting for callback to return true');

      while(true) {
        run_count++;
        result = settings.callback();

        if (result) {
          break;
        }
      }

      _log('Callback has return truthy. Times called', run_count);

      runAfter(settings);

    } else {
      var timeout = setTimeout(function () {
        timeout = null;
        _log('Wait: Waited', settings.duration);

        runAfter(settings);

        cb(null, file);
      }, settings.duration);
    }
  });
};
