var util = require('util');
var bleno = require('bleno');

function TopicCharacteristic(config, client) {
	bleno.Characteristic.call(this, {
		uuid: '6bcb06e2747542a9a62a54a1f3ce11e6',
		properties: ['read', 'write', 'notify'],
		descriptors: [
			new bleno.Descriptor({
				uuid: '2901',
				value: 'Topic: ' + config.topic
			})
		]
	});

	this._value = new Buffer(0);
	this._updateValueCallback = null;
	this._client = client;
	this._topic = config.topic;
}

util.inherits(TopicCharacteristic, bleno.Characteristic);

TopicCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
	this._value = data;

	this._client.publish(this._topic, data);

	callback(this.RESULT_SUCCESS);
}


TopicCharacteristic.prototype.onReadRequest = function(offset, callback) {
	console.log("READING: " + this._value.toString());
	console.log("OFFSET: " + offset);
	callback(this.RESULT_SUCCESS, this._value);
}

TopicCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
	this._updateValueCallback = updateValueCallback;
}

TopicCharacteristic.prototype.onUnsubscribe = function () {
	this._updateValueCallback = null;
}

TopicCharacteristic.prototype.update = function(value) {
	this._value = value;
	console.log(this._value.toString());
	if (this._updateValueCallback) {
		this._updateValueCallback(this._value);
	}
}

module.exports = TopicCharacteristic;
