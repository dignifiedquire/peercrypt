// Crypto
// ======

var Crypto = require('crypto');
var Ursa = require('ursa');

function decodeKey(key) {
  return (new Buffer(key.trim(), 'base64')).toString();
}

function getFingerprint(key) {
  return Crypto.createHash('sha256').update(key).digest('hex');
}

function matchFingerprints(key, fingerprint) {
  if (!fingerprint) return false;

  return getFingerprint(key) === fingerprint;
}

function verifyMessage(msg, key, signature, fingerprint) {
  var pubKey = decodeKey(key);

  if (!matchFingerprints(pubKey, fingerprint)) return false;

  var verifier = Crypto.createVerify('RSA-MD5');
  verifier.update(msg);
  return verifier.verify(key, signature, 'base64');
};

function toPublicKey(privateKey) {
  return Ursa.coercePrivateKey(privateKey).toPublicPem().toString('utf8');
};

function sign(privateKey, msg) {
  var sign = Crypto.createSign('sha256');
  sign.update(msg);
  return sign.sign(privateKey, 'base64');
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
  verifyMessage: verifyMessage
};
