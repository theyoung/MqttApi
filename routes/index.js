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
    clientConnected
);


function clientConnected(client){
    console.log('Client Connected = ' + client.id);
}


server.on(
    MOSCA_SERVER_EVENT.CLIENT_DISCONNECTING,
    clientDisconnecting
);

function clientDisconnecting(client){
    console.log('Client CLIENT_DISCONNECTING = ' + client.id);
}


server.on(
    MOSCA_SERVER_EVENT.CLIENT_DISCONNECTED,
    clientDisconnected
);

function clientDisconnected(client){
    console.log('Client CLIENT_DISCONNECTED = ' + client.id);
}


server.on(
    MOSCA_SERVER_EVENT.PUBLISHED,
    published
);

function published(packet,client){
    var id = 'none Client Info';
    if (client != null && client != undefined){
        id = client.id;
    }
    console.log('Client PUBLISHED = ' + packet.topic + ' / ' + id);

    if(packet.payload != null && packet.payload !=undefined){
        var payload = packet.payload;
        if(typeof payload == 'string'){
            console.log('Client PUBLISHED Payload = ' + payload);
        } else if (payload instanceof Uint8Array){
            console.log('Client PUBLISHED Payload = Uint8Array [ ' + payload + ' ]');
        }
    }
}


server.on(
    MOSCA_SERVER_EVENT.SUBSCRIBED,
    subscribed
);

function subscribed(topic,client){
    console.log('Client SUBSCRIBED = ' + topic + ' / ' + client.id);
}


server.on(
    MOSCA_SERVER_EVENT.UNSUBSCRIBED,
    unsubscribed
);

function unsubscribed(topic,client){
    console.log('Client UNSUBSCRIBED = ' + topic + ' / ' + client.id);
}


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

router.post('/get/clients',function(req,res){

    var clients = [];

    for (name in server.clients){
        obj = server.clients[name];

        protoType = obj.constructor.name;


        if(protoType == 'Client'){
            clients.push({id:obj.id});
        }
    }

    return res.send(clients);
});

module.exports = router;
