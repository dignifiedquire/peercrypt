// Lookup Server
// =============


var Hapi = require('hapi');
var Joi = require('joi');

var Crypto = require('./crypto');

function verifySignedPayload(pubkeyId, load) {
  return Crypto.verifyMessage(load.message, load.key, load.signature, pubkeyId);
}

function get(store, request, reply) {
  var payload = store[request.params.pubkeyId];
  if (payload == null) return reply(Hapi.error.notFound('No data.'));

  reply(payload);
}

function post(store, request, reply) {
  if (verifySignedPayload(request.params.pubkeyId, request.payload)) {
    store[request.params.pubkeyId] = request.payload;
    return reply();
  }
  reply(Hapi.error.badRequest('Bad message integrity.'));
}

var Server = module.exports = function() {
  var server = new Hapi.Server();

  // Store data in memory
  var store = {};

  server.route([{
    path: '/{pubkeyId}',
    method: 'POST',
    config: {
      handler: post.bind(null, store),
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
  },{
    path: '/{pubkeyId}',
    method: 'GET',
    config: {
      handler: get.bind(null, store),
      validate: {
        path: {
          pubkeyId: Joi.string().alphanum().required()
        }
      }
    }
  }]);

  return server;
};
