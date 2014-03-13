// Usage: node test.js user@host

var remotely = require("./");
var test = require("tape");
var resumer = require("resumer");
var concat = require("concat-stream");
var host = process.argv[2];
var user = host.split('@')[0];

test('stdout', function (assert) {
  var r = remotely(host, 'echo $HOME');

  r.stderr.on('data', function (data) {
    console.error('error', data.toString());
  });

  r.stdout.on('data', function (data) {
    assert.equal(data.toString(), '/home/' + user + '\n');
    assert.end();
  })
});

test('callback', function (assert) {
  remotely(host, 'echo $HOME', { timeout: 5000 }, function (error, stdout, stderr) {
    assert.equal(error, undefined);
    assert.equal(stdout, '/home/'+user+'\n');
    assert.end();
  });
});

test('child process parameters', function (assert) {
  var options = { 'UserKnownHostsFile': '/dev/null', 'StrictHostKeyChecking': 'no' };

  assert.deepEqual(remotely.childProcessParams(host), [host]);
  assert.deepEqual(remotely.childProcessParams(host, null, 'echo $HOME'), [host, 'echo $HOME']);
  assert.deepEqual(remotely.childProcessParams(host, { options: options }, 'echo $HOME'), [host, '-o', 'UserKnownHostsFile=/dev/null', '-o', 'StrictHostKeyChecking=no','echo $HOME']);
  assert.deepEqual(remotely.childProcessParams(host, { identity: '~/.ssh-bak/.id_rsa' }, 'echo $HOME'), [host, '-i', '~/.ssh-bak/.id_rsa', 'echo $HOME']);
  assert.deepEqual(remotely.childProcessParams(host, { options: options, identity: '~/.ssh-bak/.id_rsa' }, 'echo $HOME'), [host, '-i', '~/.ssh-bak/.id_rsa', '-o', 'UserKnownHostsFile=/dev/null', '-o', 'StrictHostKeyChecking=no', 'echo $HOME']);

  assert.end();
});
