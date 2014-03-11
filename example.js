var remotely = require('./');

// pipe
remotely(process.argv[2], 'echo $HOME').stdout.pipe(process.stdout);

// callback
remotely(process.argv[2], 'echo $HOME', { timeout: 100 }, function (error) {
});
