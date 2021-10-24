import { ContainerClient } from "@azure/storage-blob";
import { BlobCheckpointStore } from "@azure/eventhubs-checkpointstore-blob";
import { EventHubConsumerClient } from "@azure/event-hubs";
import ISecretStore from "./ISecretStore";
import IDocDbDatabase from "./IDocDbDatabase";

export default class DeviceEventsHandlerService {
    private eventHubsCheckpointBlobContainerName = "mikedice-iothub-checkpoint-store";
    private eventHubsConsumerGroup = "$Default";
    private eventHubsHubName = "mikedice-iot-device-events";
    private secretStore: ISecretStore;
    private database: IDocDbDatabase;

    public constructor(secretStore: ISecretStore, database: IDocDbDatabase) {
        this.secretStore = secretStore;
        this.database = database;
    }

    public async Run() {
        // Create a blob container client and a blob checkpoint store using the client.
        const containerClient = new ContainerClient(
            await this.secretStore.GetCheckpointBlobStorageConnectionString(),
            this.eventHubsCheckpointBlobContainerName);

        const checkpointStore = new BlobCheckpointStore(containerClient);

        // Create a consumer client for the event hub by specifying the checkpoint store.
        const consumerClient = new EventHubConsumerClient(this.eventHubsConsumerGroup,
            await this.secretStore.GetEventHubsConnectionString(),
            this.eventHubsHubName, checkpointStore);

        // Subscribe to the events, and specify handlers for processing the events and errors.
        const subscription = consumerClient.subscribe({
            processEvents: async (events, context) => {
                if (events.length === 0) {
                    console.log(`No events received within wait time. Waiting for next interval`);
                    return;
                }

                for (const event of events) {
                    const timestamp = event.systemProperties["iothub-enqueuedtime"] as number;
                    const deviceId = event.systemProperties["iothub-connection-device-id"] as string;
                    this.database.storeEvent(deviceId, timestamp, event.sequenceNumber, event.body);
                    console.log(`Received event: '${JSON.stringify(event.body)}' from partition: '${context.partitionId}' and consumer group: '${context.consumerGroup}'`);
                }
                // Update the checkpoint.
                await context.updateCheckpoint(events[events.length - 1]);
            },

            processError: async (err, context) => {
                console.log(`Error : ${err}`);
            }
        });
    }
}
