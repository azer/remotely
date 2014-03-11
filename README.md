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

### Streams

You can pipe commands to call:

```js
remotely = require('remotely')('azer.io', { timeout: 9999 })

remotely.stdout.pipe(process.stdout)

process.stdin.resume()
process.stdin.pipe(remotely.stdin)
```

See `example.js` for a working example

### Child Process options

Remotely has a similar interface to `child_process.exec`. You can pass child options as third parameter:

```js
remotely('user@hostname', 'echo $HOME', { timeout: 2000 }).stdout.pipe(process.stdout)
```

See `test.js` and `example.js` for more information.

### SSH Options

To specify SSH options like `UserKnownHostsFile`:

```js
remotely('user@host', 'pwd', { options: { UserKnownHostsFile: '/dev/null' } }).pipe(process.stdout)
```

### SSH Identity

You can specify a custom identity file:

```js
remotely('user@host', 'pwd', { identity: '/home/azer/ssh-foo/.id_rsa' }).pipe(process.stdout)
```

## Testing

Test module requires a hostname as third parameter.

```bash
$ node test.js user@hostname
```
