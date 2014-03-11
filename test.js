var remotely = require("./");
var test = require("tape");
var resumer = require("resumer");
var concat = require("concat-stream");
var host = process.argv[2] || 'nonexisting.com';

test('stdout', function (assert) {
  remotely(host, 'echo $HOME').stdout.on('data', function (data) {
    assert.equal(data, '/home/azer\n');
    assert.end();
  });
});

test('callback', function (assert) {
  remotely(host, 'echo $HOME', { timeout: 5000 }, function (error, stdout, stderr) {
    assert.equal(error, null);
    assert.equal(stdout, '/home/azer\n');
    console.log(typeof stderr);
    assert.end();
  });
});

test('generateCommand', function (assert) {
  var options = { 'UserKnownHostsFile': '/dev/null', 'StrictHostKeyChecking': 'no' };

  assert.equal(remotely.generateCommand(host), 'ssh ' + host);
  assert.equal(remotely.generateCommand(host, null, 'echo $HOME'), 'ssh ' + host + ' "echo \\$HOME"');
  assert.equal(remotely.generateCommand(host, { options: options }, 'echo $HOME'), 'ssh ' + host + ' -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no "echo \\$HOME"');
  assert.equal(remotely.generateCommand(host, { identity: '~/.ssh-bak/.id_rsa' }, 'echo $HOME'), 'ssh ' + host + ' -i ~/.ssh-bak/.id_rsa "echo \\$HOME"');
  assert.equal(remotely.generateCommand(host, { options: options, identity: '~/.ssh-bak/.id_rsa' }, 'echo $HOME'), 'ssh ' + host + ' -i ~/.ssh-bak/.id_rsa -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no "echo \\$HOME"');

  assert.end();
});
