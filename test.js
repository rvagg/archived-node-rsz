const os     = require('os')
    , fs     = require('fs')
    , path   = require('path')
    , test   = require('tap').test
    , canvas = require('canvas')
    , sz     = require('sz')
    , rsz    = require('./')

function resizeTest (name, src, width, height) {
  test(name, function (t) {
    t.plan(4)
    rsz(src, width, height, function (err, dst) {
      t.notOk(err, 'no error')
      t.ok(Buffer.isBuffer(dst), 'response is a Buffer')
      sz(dst, function (err, size) {
        t.notOk(err, 'no error')
        t.deepEqual(size, { width: width, height: height }, 'resized image is correct size')
      })
    })
  })
}

resizeTest(
    'test resize jpg file'
  , path.join(__dirname, 'node_modules/sz/test-data/avatar.jpg')
  , 10, 20
)

resizeTest(
    'test resize jpg buffer'
  , fs.readFileSync(path.join(__dirname, 'node_modules/sz/test-data/avatar.jpg'))
  , 100, 200
)

resizeTest(
    'test resize gif file'
  , path.join(__dirname, 'node_modules/sz/test-data/python_logo.gif')
  , 1000, 2000
)

resizeTest(
    'test resize gif buffer'
  , fs.readFileSync(path.join(__dirname, 'node_modules/sz/test-data/python_logo.gif'))
  , 1, 2
)

resizeTest(
    'test resize png file'
  , path.join(__dirname, 'node_modules/sz/test-data/node_logo.png')
  , 200, 20
)

resizeTest(
    'test resize png buffer'
  , fs.readFileSync(path.join(__dirname, 'node_modules/sz/test-data/node_logo.png'))
  , 100, 100
)

resizeTest(
    'test resize animated gif file'
  , path.join(__dirname, 'node_modules/sz/test-data/nyan.gif')
  , 10, 10
)

resizeTest(
    'test resize animated gif buffer'
  , fs.readFileSync(path.join(__dirname, 'node_modules/sz/test-data/nyan.gif'))
  , 500, 5
)

test('test no such file', function (t) {
  t.plan(2)
  rsz('foobar.gif', 10, 10, function (err, size) {
    t.ok((/error/i).test(err), 'got error message')
    t.ok(size === undefined, 'no size provided')
  })
})

test('test writing straight to file', function (t) {
  var src = path.join(__dirname, 'node_modules/sz/test-data/avatar.jpg')
    , dst = path.join(os.tmpDir(), String(Math.random()) + 'avatar.jpg')

  t.plan(3)
  rsz(src, 100, 200, dst, function (err) {
    t.notOk(err, 'no error')
    sz(dst, function (err, size) {
      t.notOk(err, 'no error')
      t.deepEqual(size, { width: 100, height: 200 }, 'resized image is correct size')
      fs.unlinkSync(dst)
    })
  })
})

test('test height and width in options object', function (t) {
  var src = path.join(__dirname, 'node_modules/sz/test-data/avatar.jpg')

  t.plan(3)
  rsz(src, { width: 100, height: 200 }, function (err, dst) {
    t.notOk(err, 'no error')
    sz(dst, function (err, size) {
      t.notOk(err, 'no error')
      t.deepEqual(size, { width: 100, height: 200 }, 'resized image is correct size')
    })
  })
})

test('test height and width in options object and write to file', function (t) {
  var src = path.join(__dirname, 'node_modules/sz/test-data/avatar.jpg')
    , dst = path.join(os.tmpDir(), String(Math.random()) + 'avatar.jpg')

  t.plan(3)
  rsz(src, { width: 100, height: 200 }, dst, function (err) {
    t.notOk(err, 'no error')
    sz(dst, function (err, size) {
      t.notOk(err, 'no error')
      t.deepEqual(size, { width: 100, height: 200 }, 'resized image is correct size')
      fs.unlinkSync(dst)
    })
  })
})
