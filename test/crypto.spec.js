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


describe('Crypto', function() {

  describe('signMessage', function() {

    it('signs a message', function(done) {
      var data = PeerCrypt.crypto.signMessage(Fix.privateKey, 'hello world');

      expect(data.message).to.equal('hello world');
      expect(data.key).to.equal(Fix.publicKey);
      expect(data).to.have.a.property('signature');
      done();
    });
  });

  describe('toPublicKey', function() {
    it('creates a public key from a private key', function(done) {
      var publicKey = PeerCrypt.crypto.toPublicKey(Fix.privateKey);
      expect(publicKey).to.equal(Fix.publicKey);
      done();
    });
  });

});
