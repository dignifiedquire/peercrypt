// Load modules

var net = require('net');
var Lab = require('lab');
var PeerCrypt = require('..');
var Fix = require('./fixtures');


// Test shortcuts

var expect = Lab.expect;
var before = Lab.before;
var after = Lab.after;
var describe = Lab.experiment;
var it = Lab.test;


describe('Node', function() {
  it('can receive connect messages from new contacts', function(done) {
    var msg = {
      type: 'connect',
      data: {
        fingerprint: PeerCrypt.crypto.computeFingerprint(Fix.publicKey),
        contact: PeerCrypt.crypto.signMessage(Fix.privateKey, {
          name: 'Mario'
        })
      }
    };

    // Setup Server
    var server = net.createServer(function(c) {
      c.write(JSON.stringify(msg));
    });
    server.listen(3333);

    // Setup Node
    var config = {
      host: 'localhost',
      port: 3333
    };
    var nod = new PeerCrypt.Node(Fix.privateKey, config);

    nod.on('connect', function(fingerprint) {
      expect(fingerprint).to.equal(msg.data.fingerprint);
      expect(nod._contacts).to.have.a.property(fingerprint);
      expect(nod._contacts[fingerprint]).to.be.eql(msg.data.contact);
      nod.close();
      server.close(done);
    });

  });

  it('can receive messages', function(done) {
    var msg = {
      type: 'message',
      data: 'hello world'
    };
    // Setup Server
    var server = net.createServer(function(c) {
      c.write(JSON.stringify(msg));
    });
    server.listen(3333);

    // Setup Node
    var config = {
      host: 'localhost',
      port: 3333
    };
    var nod = new PeerCrypt.Node(Fix.privateKey, config);

    nod.on('message', function(msg) {
      expect(msg).to.equal('hello world');
      nod.close();
      server.close(done);
    });
  });

});
