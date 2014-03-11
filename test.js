var remotely = require("./");
var test = require("tape");
var host = process.argv[2];

test('piping stdout', function (assert) {
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
