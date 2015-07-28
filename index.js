var util = require('util');
var bleno = require('bleno');
var mqtt = require('mqtt');

var BlenoPrimarySerivce = bleno.PrimaryService;

var TopicCharacteristic = require('./topicCharacteristic');

var config = require("./config");

var client = mqtt.connect(config.broker);

var topic = new TopicCharacteristic(config);

client.on('connect', function(){
  client.subscribe(config.topic);
});

client.on('message',function(topic, message){
  topic.update(message.payload);
});

bleno.on('stateChange', function(state){
  if (state === 'poweredOn') {
    bleno.startAdvertising('mqtt', ['ba42561bb1d2440a8d040cefb43faece']);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(error){
  if(!error) {
  	bleno.setServices([
  	  new BlenoPrimarySerivce({
  	  	uuid: 'ba42561bb1d2440a8d040cefb43faece',
  	  	characteristics: [
  	  	  topic
  	  	]
  	  })
  	]);
  }
});