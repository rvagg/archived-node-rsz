const fs     = require('fs')
    , Canvas = require('canvas')

module.exports = function () {
  var src
    , dst
    , callback
    , options
    , width
    , height
    , maintainAspect
    , jpeg
    , image
    , err
    , i
    , to

  for (i = 0; i < arguments.length; i++) {
    to = typeof arguments[i]
    if (to == 'string' || Buffer.isBuffer(arguments[i])) {
      if (!src)
        src = arguments[i]
      else if (!dst && to == 'string')
        dst = arguments[i]
    } else if (to == 'object' && !options) {
      options = arguments[i]
    } else if (to == 'number') {
      if (width == null)
        width = arguments[i]
      else if (height == null)
        height = arguments[i]
    } else if (to == 'function' && !callback) {
     callback = arguments[i]
    }
  }

  if (!options)
    options = {}

  if (width == null && typeof options.width == 'number')
    width = options.width

  if (height == null && typeof options.height == 'number')
    height = options.height

  maintainAspect = options.aspectRatio || false

  if (width == null && !maintainAspect) {
    err = new Error('must supply a `width` argument or option')
    if (callback)
      return callback(err)
    throw err
  }

  if (height == null && !maintainAspect) {
    err = new Error('must supply a `height` argument or option')
    if (callback)
      return callback(err)
    throw err
  }

  if (!(Buffer.isBuffer(src) || typeof src == 'string')) {
    err = new Error('must supply a Buffer or a String `src` argument')
    if (callback)
      return callback(err)
    throw err
  }

  jpeg = options.type == 'jpeg' || false
  image = new Canvas.Image()

  function write (err, buf) {
    if (err)
      return callback(err)
    fs.writeFile(dst, buf, callback)
  }

  function toBuffer (canvas, callback) {
    var buf = []
      , len = 0

    canvas[jpeg ? 'createJPEGStream' : 'createPNGStream'](options)
      .on('data', function (_buf) {
        buf.push(_buf)
        len += _buf.length
      })
      .on('error', function (err) {
        callback && callback(err)
        callback = null
      })
      .on('end', function () {
        callback && callback(null, Buffer.concat(buf, len))
      })
  }

  function onerror (err) {
    callback(err)
  }

  function onload () {
    var cb = dst ? write : callback
      , drawImage = typeof options.drawImage == 'function'
          ? options.drawImage
          : function () {
              ctx.imageSmoothingEnabled = true
              ctx.drawImage(image, 0, 0, width, height)
            }
      , ratio
      , canvas
      , ctx

    width  = width ? width : image.width
    height = height ? height : image.height

    if (maintainAspect) {
      ratio  = Math.min(width / image.width, height / image.height)
      width  = image.width * ratio
      height = image.height * ratio
    }

    canvas = new Canvas(width, height)
    ctx    = canvas.getContext('2d')
    drawImage(ctx, image, width, height)
    toBuffer(canvas, cb)
  }

  image.onerror = onerror
  image.onload  = onload

  // for Windows compatibility we're only going to pass a Buffer to src
  if (Buffer.isBuffer(src)) {
    image.src = src
  } else {
    fs.readFile(src, function (err, buf) {
      if (err)
        return callback(err)
      image.src = buf
    })
  }
}