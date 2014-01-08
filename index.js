'use strict';

var map = require('map-stream');

module.exports = function (settings) {

  if (typeof(settings) !== 'object') {
    settings = {
      duration: settings
    };
  }

  settings.duration || (settings.duration = 1000);

  return map(function (file, cb) {    

    if (typeof(settings.before) === 'function') {
      settings.before();
    }

    var timeout = setTimeout(function() {
      timeout = null;
      console.log('Reloaded after', settings.duration);
      if (typeof(settings.after) === 'function') {
        settings.after();
      }
      cb(null, file);
    }, settings.duration);

  });

};