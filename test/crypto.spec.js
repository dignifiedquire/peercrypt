// Load modules

var Lab = require('lab');
var PeerCrypt = require('..');
var Fix = require('./fixtures');
var Ursa = require('ursa');


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
  describe('verifyMessage', function() {

    it('fails on a tempered message', function(done) {
      var data = PeerCrypt.crypto.signMessage(Fix.privateKey, 'hello world');
      data.message += '!';

      expect(PeerCrypt.crypto.verifyMessage(data.message, data.key, data.signature)).to.equal(false);
      done();

    });

    it('fails on a tempered signature', function(done) {
      var data = PeerCrypt.crypto.signMessage(Fix.privateKey, 'hello world');
      data.signature += '1';

      expect(PeerCrypt.crypto.verifyMessage(data.message, data.key, data.signature)).to.equal(false);
      done();

    });

    it('fails on a bad public key', function(done) {
      var data = PeerCrypt.crypto.signMessage(Fix.privateKey, 'hello world');
      data.key = 'aba' + data.key + 'aba';

      expect(PeerCrypt.crypto.verifyMessage(data.message, data.key, data.signature)).to.equal(false);
      done();

    });


    it('succeeds on signed message', function(done) {
      var data = PeerCrypt.crypto.signMessage(Fix.privateKey, 'hello world');

      expect(PeerCrypt.crypto.verifyMessage(data.message, data.key, data.signature)).to.equal(true);
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

  describe('computeFingerprint', function () {

    it('generates the cryptographical fingerprint from a given key', function (done) {
      var key = Ursa.coercePublicKey(Fix.publicKey);
      var fingerprint = PeerCrypt.crypto.computeFingerprint(key);

      expect(fingerprint).to.equal(Fix.fingerprint);
      done();

    });

  });
});
