## remotely

Run given command remotely via SSH

```js
remotely = require('remotely')

remotely('user@hostname', 'echo $HOME').stdout.pipe(process.stdout)
// => /home/username
```

## Install

```bash
$ npm install remotely
```

## Usage

### Callbacks

If callbacks work better than piping in your case, pass a function as last parameter:

```js
remotely = require('remotely')

remotely('user@hostname', 'echo $HOME', function (error, stdout, stderr) {

  stdout
  // => /home/username
})

```

### Child Process options

Remotely has a very similar interface to `child_process.exec`. You can pass child options as third parameter:

```js
remotely('user@hostname', 'echo $HOME', { timeout: 2000 }).stdout.pipe(process.stdout)
```

See `test.js` and `example.js` for more information.

## Testing

Test module requires a hostname as third parameter.

```bash
$ node test.js user@hostname
```
