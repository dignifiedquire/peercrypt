// Lookup Server
// =============


var Hapi = require('hapi');
var Joi = require('joi');

var Crypto = require('./crypto');

function verifySignedPayload(pubkeyId, load) {
  if (Crypto.verifyMessage(load.message, load.key, load.signature, pubkeyId)) {
    return;
  }
  return Hapi.error.badRequest('Bad message integrity.');
}

function post(request, reply) {
  var params = request.params;
  var result = verifySignedPayload(params.pubkeyId, request.payload);
  reply(result);
}

var Server = module.exports = function() {
  var server = new Hapi.Server();

  server.route({
    path: '/{pubkeyId}',
    method: 'POST',
    config: {
      handler: post,
      validate: {
        path: {
          pubkeyId: Joi.string().alphanum().required()
        },
        payload: Joi.object({
            signature: Joi.string().required(),
            key: Joi.string().required(),
            message: Joi.string().required()
        })
      }
    }
  });
  return server;
};
