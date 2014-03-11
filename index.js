var debug = require("debug")('remotely');
var format = require("format-text");
var exec = require("child_process").exec;

module.exports = remotely;
module.exports.generateCommand = generateCommand;

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

  var sshCommand = generateCommand(host, options, remoteCommand);

  // Remove SSH specific fields from options object before passing it to child_process.exec
  if (options) {
    delete options.options;
    delete options.identity;
  }

  debug('Running "%s" on %s', remoteCommand || '(not given yet)', host);

  return exec(sshCommand, options, callback);
}

function generateCommand (host, options, remoteCommand) {
  var params = '';
  var sshOptions;
  var key;

  if (options) {
    if (options.options) {
      sshOptions = '';

      for (key in options.options) {
        sshOptions += ' -o ' + key + '=' + options.options[key];
      }
    }

    if (options.identity) {
      params += ' -i ' + options.identity;
    }
  }

  if (remoteCommand) {
    remoteCommand = remoteCommand
      .replace(/"/g, "\\\"")
      .replace(/\$/g, "\\$");

    remoteCommand = ' "' + remoteCommand + '"';
  }

  return format('ssh {host}{params}{options}{command}', {
    host: host,
    options: sshOptions || '',
    params: params || '',
    command: remoteCommand || ''
  });
}
