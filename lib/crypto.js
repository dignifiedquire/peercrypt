// Crypto
// ======

var Crypto = require('crypto');
var Ursa = require('ursa');

function decodeKey(key) {
  return (new Buffer(key.trim(), 'base64'));
}

function computeFingerprint(key) {
  return Crypto.createHash('sha256').update(key.toPublicPem()).digest('hex');
}

function matchFingerprints(key, fingerprint) {
  if (!fingerprint) return true;

  return computeFingerprint(key) === fingerprint;
}

function verifyMessage(msg, key, signature, fingerprint) {
  try {
    var pubKey = Ursa.coercePublicKey(key);
  } catch (error) {
    return false;
  }

  if (!matchFingerprints(pubKey, fingerprint)) return false;

  var msgBuffer = new Buffer(msg, 'utf8');
  try {
    var result = pubKey.hashAndVerify('sha256', msgBuffer, signature, 'hex');
  } catch (error) {
    return false;
  }
  return result;
};

function toPublicKey(privateKey) {
  return Ursa.coercePrivateKey(privateKey).toPublicPem().toString('utf8');
};

function sign(key, msg) {
  var privateKey = Ursa.coercePrivateKey(key);
  return privateKey.hashAndSign('sha256', msg, 'utf8', 'hex');
};

function signMessage(privateKey, msg) {
  return {
    message: msg,
    key: toPublicKey(privateKey),
    signature: sign(privateKey, msg)
  }
};

module.exports = {
  signMessage: signMessage,
  toPublicKey: toPublicKey,
  sign: sign,
  verifyMessage: verifyMessage,
  computeFingerprint: computeFingerprint
};
