const fs     = require('fs')
    , Canvas = require('canvas')

module.exports = function (src, width, height, dst, callback) {
  var image     = new Canvas.Image()
    , _oo       = typeof width == 'object'
    , _width    = _oo ? width.width  : width
    , _height   = _oo ? width.height : height
    , _dst      = typeof (_oo ? height : dst) == 'string'
          ? (_oo ? height : dst)
          : null
    , _callback = typeof height == 'function'
          ? height
          : typeof dst == 'function' ? dst : callback

    , write  = function (err, buf) {
        if (err)
          return _callback(err)
        fs.writeFile(_dst, buf, _callback)
      }

    , onerror = function (err) {
        _callback(err)
      }

    , onload  = function () {
        var canvas = new Canvas(_width, _height)
          , ctx    = canvas.getContext('2d')
          , cb     = _dst ? write : _callback

        ctx.imageSmoothingEnabled = true
        ctx.drawImage(image, 0, 0, _width, _height)

        canvas.toBuffer(cb)
      }

  image.onerror = onerror
  image.onload = onload
  image.src = src
}