// Node
// ====
//
// A single network node.


var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;
var net = require('net');
var _ = require('lodash');
var Ursa = require('ursa');
var Crypto = require('./crypto');

var Node = module.exports = function(privateKey, config) {
  EventEmitter.call(this);

  this._privateKey = Ursa.coercePrivateKey(privateKey);
  this._config = config;

  this._contacts = {};

  var connectionHandler = this._connectionHandler.bind(this);
  var dataHandler = this._dataHandler.bind(this);

  this._socket = net.connect(config.port, config.host, dataHandler);
  this._socket.on('data', dataHandler);
};

inherits(Node, EventEmitter);

Object.defineProperty(Node.prototype, 'publicKey', {
  get: function() {
    return Crypto.toPublicKey(this._privateKey);
  }
});

Node.prototype._connectionHandler = function() {
  //this.emit('connect');
};

Node.prototype._connectHandler = function (data) {
  var id = data.fingerprint;

  // Update all contact data
  this._contacts[id] = data.contact;

  this.emit('connect', id);
};

Node.prototype._dataHandler = function(raw) {
  if (!raw) return;
  var data = this.parse(raw);
  if (!data.type) this.emit('error', new Error('Must specify a type'));

  switch (data.type) {
  case 'connect':
    this._connectHandler(data.data)
    break;
  case 'message':
    this.emit('message', data.data);
    break;
  default:
    this.emit('error', new Error('Unkown type: ' + data.type));
  }
};

Node.prototype.parse = function(raw) {
  try {
    var result = JSON.parse(raw.toString());
  } catch (error) {
    this.emit('error', error);
  }
  return result;
};

Node.prototype.close = function() {
  this._socket.end();
};
