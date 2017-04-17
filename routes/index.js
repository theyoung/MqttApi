var express = require('express');
//Load Mosca Library for Mqtt Broker
var mosca = require('mosca');

//Load Mongo Server Config
var globalConfig = require('../config/globalConfig');

//Bind Method to focus on same memory
var bind = function(method,scope){
  return function(){
    return method.apply(scope,arguments);
  }
};


var backendConfig = {
  type : 'mongo',
  url : globalConfig.mongo.url,
  pubsubCollection : globalConfig.mongo.pubsubCollection,
  mongo : {
    id : globalConfig.mongo.id,
    pwd : globalConfig.mongo.pwd
  }
};

var mqttConfig = {
  port : globalConfig.port,
  backend : backendConfig
};

var server = new mosca.Server(mqttConfig);

// Listing All Event Emitters of Mosca
var MOSCA_SERVER_EVENT = {
  CLIENT_CONNECTED : 'clientConnected',
  CLIENT_DISCONNECTING : 'clientDisconnecting',
  CLIENT_DISCONNECTED : 'clientDisconnected',
  PUBLISHED : 'published',
  SUBSCRIBED : 'subscribed',
  UNSUBSCRIBED : 'unsubscribed',
  READY : 'ready',
  CLOSED : 'closed',
  ERROR : 'error'
};

server.on(
    MOSCA_SERVER_EVENT.CLIENT_CONNECTED,
    function(client){
      console.log('Client Connected = ' + client.id)
    }
);

server.on(
    MOSCA_SERVER_EVENT.CLIENT_DISCONNECTING,
    function(client){
        console.log('Client CLIENT_DISCONNECTING = ' + client.id)
    }
);
server.on(
    MOSCA_SERVER_EVENT.CLIENT_DISCONNECTED,
    function(client){
        console.log('Client CLIENT_DISCONNECTED = ' + client.id)
    }
);

server.on(
    MOSCA_SERVER_EVENT.PUBLISHED,
    function(packet,client){
        var id = 'none Client Info'
        if (client != null && client != undefined){
            id = client.id
        }
        console.log('Client PUBLISHED = ' + packet.topic + ' / ' + id)
    }
);

server.on(
    MOSCA_SERVER_EVENT.SUBSCRIBED,
    function(topic,client){
        console.log('Client SUBSCRIBED = ' + topic + ' / ' + client.id)
    }
);

server.on(
    MOSCA_SERVER_EVENT.UNSUBSCRIBED,
    function(topic,client){
        console.log('Client UNSUBSCRIBED = ' + topic + ' / ' + client.id)
    }
);

server.on(
    MOSCA_SERVER_EVENT.READY,
    function(){
        console.log('Server READY')
    }
);

server.on(
    MOSCA_SERVER_EVENT.CLOSED,
    function(){
        console.log('Server CLOSED')
    }
);

server.on(
    MOSCA_SERVER_EVENT.ERROR,
    function(){
        console.log('Server ERROR')
    }
);


var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html', { title: 'Express' });
});

module.exports = router;
