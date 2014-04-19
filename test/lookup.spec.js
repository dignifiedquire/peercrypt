// Load modules

var Lab = require('lab');
var PeerCrypt = require('..');

// Declare internals

var internals = {};


// Test shortcuts

var expect = Lab.expect;
var before = Lab.before;
var after = Lab.after;
var describe = Lab.experiment;
var it = Lab.test;


describe('Lookup Server', function () {

  it('handles invalid POSTs', function (done) {

    var server = new PeerCrypt.Server();

    server.inject({
      url: '/12345678',
      method: 'POST',
      payload: ''
    }, function (res) {

      expect(res.statusCode).to.equal(400);
      done();

    });
  });
});
