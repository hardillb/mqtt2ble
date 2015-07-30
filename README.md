MQTT2BLE
----------

A way to bridge MQTT topics to BLE Gatt characteristics 

run:
    node index.js -c config.js

Where config.js looks like this:

    module.exports = {
      broker: "mqtt://localhost",
      topic: "some/topic"
    } 


The primary serivce UUID is

   ba42561bb1d2440a8d040cefb43faece

and the topic charactristic is

   6bcb06e2747542a9a62a54a1f3ce11e6


Known issues
-------------

You have to be careful that the payload fits in the MTU

#### Running without root/sudo

Run the following command in the directory you ran ```npm install``` from:

```sh
find -path '*bleno*Release/hci-ble' -exec sudo setcap cap_net_raw+eip '{}' \;
```

This grants bleno's ```hci-ble``` binary ```cap_net_raw``` privileges, so it can start/stop BLE advertising.

__Note:__ The above command requires ```setcap``` to be installed, it can be installed using the following:

 * apt: ```sudo apt-get install libcap2-bin```
 * yum: ```su -c \'yum install libcap2-bin\'```