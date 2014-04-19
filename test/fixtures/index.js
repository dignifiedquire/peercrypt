var Fs = require('fs');
var Path = require('path');

var privateKey = Fs.readFileSync(Path.join(__dirname, 'key.pem')).toString('utf8');
var publicKey = Fs.readFileSync(Path.join(__dirname, 'pubkey.pem')).toString('utf8');


module.exports = {
  privateKey: privateKey,
  publicKey: publicKey
};
