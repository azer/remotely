var format = require("format-text");
var exec = require("child_process").exec;

module.exports = remotely;

function remotely (host, command) {
  var callback;
  var options;

  if (typeof arguments[arguments.length - 1] == 'function') {
    callback = arguments[arguments.length - 1];
  }

  if (arguments.length > 2 && typeof arguments[2] == 'object') {
    options = arguments[2];
  }

  var cmd = format('ssh {host} "{command}"', {
    host: host,
    command: command
      .replace(/"/g, "\\\"")
      .replace(/\$/g, "\\$")
  });

  return exec(cmd, options, callback);
}
