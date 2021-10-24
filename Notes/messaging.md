These notes on the messaging system

The event hub service (aka event hub namespace): eventhub417
The actual event hub: mikedice-iot-device-events
This hub gets all events from my personal devices which are registered on the Azure IoT event hub
The hub has two SAS policies:
1) iothubroutes_iothub417, permission to send. This was automatically created when the iothub endpoint was created below
2) events_consumer, permssion to listen. This was manually created.  The connection string primary is stored in the Secret Store under key EventHubsConnectionString

The iot hub: iothub417
message route: mikedice-iot-devices-message-routing
    Uses iot endpoint: mikedice-iot-events-endpoint
        Which routes all messages to eventhub named above. There is no logic in the routing rule other than the statement 'true'

All IOT devices must first be registered with the iot hub
Once a device is registered it will generate a connection string for that device. The device will use that connection string to connect to the hub and send telemetry messages. Also with that connection string the device Twin can be managed.

When a device is registered with iot hub it is given a device name. This device name is later used to identify the device. The name is unique in the hub namespace (iothub417).

The document db:
The document DB collects the messages for all devices up into containers in the database. There is one container for each device. The container names are {device name}_messages. Inside the container will be all messages received for the container's device. The messages have an id which is set to the eventhub sequence number of the message, a messagekind field currently always set to 'deviceEvent' and a body property. The body of the event hub message is copied into the body property of the docdb document. This body can contain anything. It is up to devices to determine what data to send in the body. Typically it would be measurements from sensors, state of the device and so on and so forth.
