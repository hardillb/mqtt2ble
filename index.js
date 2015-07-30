var util = require('util');
var bleno = require('bleno');
var path = require('path');
var mqtt = require('mqtt');

var BlenoPrimarySerivce = bleno.PrimaryService;

var TopicCharacteristic = require('./topicCharacteristic');

var config;
var cwd = process.cwd();

var args = process.argv;

if (args) {
  if (args[0] == '-c') {
    if (args[1].indexOf('/') === 0) {
      config = require(args[1]);
    } else {
      config = require(path.join(cwd, args[1]));
    }
  } else {
    config = require(path.join(cwd, 'config.js'));
  }
}

if (!config) {
  console.log("Must provide a config.js");
  process.exit();
}

var client = mqtt.connect(config.broker);

var topicCharacteristic = new TopicCharacteristic(config);

client.on('connect', function(){
  client.subscribe(config.topic);
});

client.on('message',function(topic, message){
	console.log(message.toString());
  topicCharacteristic.update(message);
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
  	  	  topicCharacteristic
  	  	]
  	  })
  	]);
  }
});