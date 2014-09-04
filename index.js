var chokidar = require('chokidar');
var mm = require ('minimatch');

var DIR_SEP = require('path').sep;

function shallowCopy(obj) {
    var temp = {};
    for(var key in obj) {
        if(obj.hasOwnProperty(key)) {
            temp[key] = obj[key];
        }
    }
    return temp;
}

// Get parent folder, that be watched (does not contain any special globbing character)
function baseDirFromPattern(pattern) {
  return pattern
    .replace(/[\/\\][^\/\\]*\*.*$/, '')               // remove parts with *
    .replace(/[\/\\][^\/\\]*[\!\+]\(.*$/, '')         // remove parts with !(...) and +(...)
    .replace(/[\/\\][^\/\\]*\)\?.*$/, '') || DIR_SEP; // remove parts with (...)?
}
  
function watchPatterns(patterns, watcher) {
  // filter only unique non url patterns paths
  var pathsToWatch = [];
  var uniqueMap = {};

  patterns.forEach(function(pattern) {
    var path = baseDirFromPattern(pattern);
    if (!uniqueMap[path]) {
      uniqueMap[path] = true;
      pathsToWatch.push(path);
    }
  });

  // watch only common parents, no sub paths
  pathsToWatch.forEach(function(path) {
    if(!pathsToWatch.some(function(p) {
      return p !== path && path.substr(0, p.length + 1) === p + DIR_SEP;
    })) {
      watcher.add(path);
      console.log('Watching "%s"', path);
    }
  });
}

// Function to test if a path should be ignored by chokidar.
function createIgnore(patterns, excludes) {
  return function(path, stat) {
    if (!stat || stat.isDirectory())
      return false;

    // Check if the path matches any of the watched patterns.
    if (!patterns.some(function(pattern) { 
        return mm(path, pattern, {dot: true});
    }))
      return true;

    // Check if the path matches any of the exclude patterns.
    if (excludes.some(function(pattern) { 
      return mm(path, pattern, {dot: true});
    }))
      return true;

    return false;
  };
}

module.exports = function watch(patterns, excludes, options) {
  if (!excludes) excludes = [];
  if (!options) options = {};
  if (!Array.isArray(patterns)) patterns = [patterns];
  options = shallowCopy(options);
  options.ignored = createIgnore(patterns, excludes);
  
  var chokidarWatcher = new chokidar.FSWatcher(options);
  watchPatterns(patterns, chokidarWatcher);
  return chokidarWatcher;
};
