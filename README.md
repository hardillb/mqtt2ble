MQTT2BLE
----------

A way to bridge MQTT topics to BLE Gatt characteristics 

run:
    node index.js config.js

Where config.js looks like this:

    module.exports = {
      broker: "mqtt://localhost",
      topic: "some/topic"
    } 

Known issues
-------------

You have to be careful that the payload fits in the MTU