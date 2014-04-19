// Load modules

var Lab = require('lab');
var PeerCrypt = require('..');
var Fix = require('./fixtures');

// Declare internals

var internals = {};


// Test shortcuts

var expect = Lab.expect;
var before = Lab.before;
var after = Lab.after;
var describe = Lab.experiment;
var it = Lab.test;


describe('Lookup Server', function() {

  it('handles invalid POSTs', function(done) {

    var server = new PeerCrypt.Server();

    server.inject({
      url: '/12345678',
      method: 'POST',
      payload: null
    }, function(res) {

      expect(res.statusCode).to.equal(400);
      done();

    });
  });
  it('handles invalid POST signatures', function(done) {

    var server = new PeerCrypt.Server();

    server.inject({
      url: '/12345678',
      method: 'POST',
      payload: JSON.stringify({
        key: '123',
        message: '456',
        signature: '102938'
      })
    }, function(res) {

      expect(res.statusCode).to.equal(400);
      done();

    });
  });
    it('handles mistmatching POST fingerprints', function(done) {

    var server = new PeerCrypt.Server();

    server.inject({
      url: '/12345678',
      method: 'POST',
      payload: PeerCrypt.crypto.signMessage(Fix.privateKey, '456')
    }, function (res) {

      expect(res.statusCode).to.equal(400);
      done();

    });
  });
});
