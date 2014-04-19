var Fs = require('fs');
var Path = require('path');

var privateKey = Fs.readFileSync(Path.join(__dirname, 'key.pem')).toString('utf8');
var publicKey = Fs.readFileSync(Path.join(__dirname, 'pubkey.pem')).toString('utf8');

var fingerprint = '738cbcd20991a073f4712884c1efafb741663088e0b1e7ef5dc9a531c4bb1abd';

module.exports = {
  privateKey: privateKey,
  publicKey: publicKey,
  fingerprint: fingerprint
};
