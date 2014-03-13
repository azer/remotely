var debug = require("debug");
var remote = debug('remotely:remote');
var local = debug('remotely:local');
var concat = require("concat-stream");
var format = require("format-text");
var spawn = require("child_process").spawn;

module.exports = remotely;
module.exports.childProcessParams = childProcessParams;

function remotely (host) {
  var options;
  var callback;
  var remoteCommand;

  if (typeof arguments[arguments.length - 1] == 'function') {
    callback = arguments[arguments.length - 1];
 }

  if (arguments.length > 2 && typeof arguments[2] == 'object') {
    options = arguments[2];
  }

  if (arguments.length > 1 && typeof arguments[1] == 'string') {
    remoteCommand = arguments[1];
  } else if (typeof arguments[1] == 'object') {
    options = arguments[1];
  }

  // Remove SSH specific fields from options object before passing it to child_process.exec
  if (options) {
    delete options.options;
    delete options.identity;
  }

  var command = childProcessParams(host, options, remoteCommand);

  remote('Running "%s" on %s', remoteCommand || '(empty)', host);
  local('Running "ssh %s"', command.join(' '));

  var ps = spawn('ssh', command, options, callback);
  var stdout, stderr;

  if (callback) {
    ps.on('error', callback);

    ps.on('close', function () {
      callback(undefined, stdout, stderr);
    });

    ps.stdout.pipe(concat(function (stdoutbf) {
      stdout = stdoutbf.toString();
    }));

    ps.stderr.pipe(concat(function (stderrbf) {
      stderr = stderrbf.toString();
    }));
  }

  return ps;
}

function childProcessParams (host, options, remoteCommand) {
  var result = [host];
  var params = '';
  var key;

  if (options && options.identity) {
    result.push('-i');
    result.push(options.identity);
  }

  if (options && options.options) {
    for (key in options.options) {
      result.push('-o', key + '=' + options.options[key]);
    }
  }

  if (remoteCommand != undefined) result.push(remoteCommand);

  return result;
}
