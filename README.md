# rsz

**Resize image files or `Buffer`s**

Depends on [node-canvas](https://github.com/LearnBoost/node-canvas) which has special [build instructions](https://github.com/LearnBoost/node-canvas/wiki/_pages) as it requires **Cairo** to be installed on your system.

## API

There is one method but multiple ways to use it:

<b>rsz(src, width, height, function (err, buf) { /* */ })</b>

Where <b><code>src</code></b> is a `String` specifying the path to the image or a `Buffer` containing the image data, and <b><code>buf</code></b> is a `Buffer` containing the resized image data.

<b>rsz(src, width, height, dst, function (err) { /* */ })</b>

Where <b><code>src</code></b> is a `String` specifying the path to the image or a `Buffer` containing the image data, and <b><code>dst</code></b> is a `String` specifying the path to write the output file to.

<b>rsz(src, { width: w, height: h }, function (err, buf) { /* */ })</b>

Where <b><code>w</code></b> and <b><code>h</code></b> are the width and height respectively, <b><code>src</code></b> is a `String` specifying the path to the image or a `Buffer` containing the image data, and <b><code>buf</code></b> is a `Buffer` containing the resized image data.

<b>rsz(src, { width: w, height: h }, dst, function (err) { /* */ })</b>

Where <b><code>w</code></b> and <b><code>h</code></b> are the width and height respectively, <b><code>src</code></b> is a `String` specifying the path to the image or a `Buffer` containing the image data, and <b><code>dst</code></b> is a `String` specifying the path to write the output file to.

## Example

```js
var rsz = require('rsz')
  , fs  = require('fs')

rsz('/path/to/nyancat.gif', 200, 350, function (err, buf) {
  fs.writeFileSync('/path/to/nyancat_200_350.gif', buf)
})

// or

rsz('/path/to/nyancat.gif', 200, 350, '/path/to/nyancat_200_350.gif', function (err) {
})

// or

rsz('/path/to/nyancat.gif', { width: 200, height: 350 }, function (err, buf) {
  fs.writeFileSync('/path/to/nyancat_200_350.gif', buf)
})

// or

rsz('/path/to/nyancat.gif', { width: 200, height: 350 }, '/path/to/nyancat_200_350.gif', function (err) {
})
```

## Licence

rsz is Copyright (c) 2013 Rod Vagg [@rvagg](https://twitter.com/rvagg) and licensed under the MIT licence. All rights not explicitly granted in the MIT license are reserved. See the included LICENSE file for more details.