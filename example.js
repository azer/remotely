// Usage: echo "pwd" | node example.js azer.io

var remotely = require('./')(process.argv[2], { timeout: 5000 });

remotely.stdout.pipe(process.stdout);
process.stdin.resume();
process.stdin.pipe(remotely.stdin);
