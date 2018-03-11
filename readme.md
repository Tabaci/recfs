# recfs

This *npm* module provides utility functions for listing all files in a 
directory either synchronously or asynchronously.

## Installation

```javascript
$ npm install recfs
```

## Usage

First, we need to require the module:

```javascript
const recfs = require('recfs')
```

Inside the *recfs* module, there are two functions: 
`readdir(directory[, options[, regex]])` and 
`readdirSync(directory[, options[, regex]])`. 

* The `directory` is the directiory we would like to list all files recursively from.
* The `options` is the same options as provided to `fs.readdir` and `fs.readdirSync` (by having this set to `undefined`, the character encoding will default to `utf8`).
* The `regex` allows us to specify a search pattern. If a file does not match this pattern, it will not be returned.

Furthermore, `readdirSync` returns a `Promise`, whilst `readdir` returns the 
list of files located.

### Directory Structure

For the following two examples, let us assume we have the directory structure:

```
cache/
	more/
		love.js
		test.htm
	test.c
	test.js
```

### `readdir`

To read a directory asynchronously, we can do:

```javascript
recfs.readdir('cache').then((files) => {
	console.log(files)
}).catch((err) => {
	throw err
})

// Expected output: [ 'cache/test.c', 'cache/test.js', 'cache/more/love.js', 'cache/more/test.htm' ]
```

Furthermore, if we are only interested in files ending in '.js', we can add a 
regular expression:

```javascript
recfs.readdir('cache', undefined, /^.*\.js$/).then((files) => {
	console.log(files)
}).catch((err) => {
	throw err
})

// Expected output: [ 'cache/test.js', 'cache/more/love.js' ]
```

This allows us to retrieve a more specific set of files.

### `readdirSync`

To read a directory synchronously, we can do:

```javascript
let files = recfs.readdirSync('cache')

console.log(files)

// Expected output: [ 'cache/test.c', 'cache/test.js', 'cache/more/love.js', 'cache/more/test.htm' ]
```

Like with the asynchronous version of the function, we can provide it with a 
regular expression to retrieve a more specific set of files:

```javascript
let files = recfs.readdirSync('cache', undefined, /^.*\.js$/)

console.log(files)

// Expected output: [ 'cache/test.js', 'cache/more/love.js' ]
```

## License

This module, and the code therein, is licensed under ISC.
