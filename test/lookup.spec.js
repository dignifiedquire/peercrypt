// Load modules

var Lab = require('lab');
var PeerCrypt = require('..');
var Fix = require('./fixtures');


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
  it('handles mismatching POST fingerprints', function(done) {

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

  it('saves and returns a valid POST', function(done) {

    var server = new PeerCrypt.Server();

    var url = '/' + PeerCrypt.crypto.computeFingerprint(Fix.publicKey);
    var payload = PeerCrypt.crypto.signMessage(Fix.privateKey, 'hello world');

    server.inject({
      url: url,
      method: 'POST',
      payload: payload
    }, function(res) {

      expect(res.statusCode).to.equal(200);

      server.inject(url, function(res) {

        expect(res.statusCode).to.equal(200);
        expect(res.payload).to.equal(JSON.stringify(payload));

        done();
      });

    });

  });
});
