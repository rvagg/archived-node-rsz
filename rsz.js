const fs     = require('fs')
    , Canvas = require('canvas')

module.exports = function (src, width, height, dst, callback) {
  var image     = new Canvas.Image()
    , _oo       = typeof width == 'object'
    , _width    = _oo ? width.width  : width
    , _height   = _oo ? width.height : height
    , _jpeg     = _oo ? width.type == 'jpeg' : false
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

    , toBuffer = function (canvas, callback) {
        var buf = []
          , len = 0

        canvas[_jpeg ? 'createJPEGStream' : 'createPNGStream'](_oo ? width : {})
          .on('data', function (_buf) {
            buf.push(_buf)
            len += _buf.length
          })
          .on('error', function (err) {
            callback(err)
            callback = null
          })
          .on('end', function () {
            callback && callback(null, Buffer.concat(buf, len))
          })
      }

    , onerror = function (err) {
        _callback(err)
      }

    , onload  = function () {
        var canvas = new Canvas(_width, _height)
          , ctx    = canvas.getContext('2d')
          , cb     = _dst ? write : _callback

          , drawImage = _oo && typeof width.drawImage == 'function'
              ? width.drawImage
              : function () {
                  ctx.imageSmoothingEnabled = true
                  ctx.drawImage(image, 0, 0, _width, _height)
                }

        drawImage(ctx, image, _width, _height)
        toBuffer(canvas, cb)
      }

  image.onerror = onerror
  image.onload = onload

  // for Windows compatibility we're only going to pass a Buffer to src
  if (Buffer.isBuffer(src)) {
    image.src = src
  } else {
    fs.readFile(src, function (err, buf) {
      if (err)
        return _callback(err)
      image.src = buf
    })
  }
}