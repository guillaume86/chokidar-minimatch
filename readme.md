# chokidar-minimatch

chokidar watcher with globs support


extracted from karma: https://github.com/karma-runner/karma/blob/master/lib/watcher.js

# API

The module returns a `watch` function:

## watch(patterns, excludes = [], options = {})
  
 - patterns is a string or an array of strings containing the glob patterns you want to watch
 - exludes is an optional array of glob patterns you want to ignore
 - options is a optional option object to pass to chokidar, 
   note that the `ignored` property on that object will be overridden internally
   so don't use it.

# Sample

    var resolve = require('path').resolve;
    var watch = require('chokidar-miniwatch');

    var watcher = watch(resolve('./*+(js|coffee)'), null, { persistent: true });
    watcher
      .on('add', function(path) { console.log('file added: %s', path); })
      .on('change', function(path) { console.log('file modified: %s', path); })
      .on('unlink', function(path) { console.log('file removed: %s', path); });
