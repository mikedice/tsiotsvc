import IDocDbDatabase from "./IDocDbDatabase";
import { CosmosClient, Container, Database } from "@azure/cosmos";
import ISecretStore from "./ISecretStore";

export default class DocDbDatabase implements IDocDbDatabase {
    private client: CosmosClient;
    private secretStore: ISecretStore;

    public constructor(secretStore: ISecretStore) {
        this.client = null;
        this.secretStore = secretStore;
    }

    public async storeEvent(deviceId: string, timestamp: number, sequenceNumber: number, body: any): Promise<void> {
        const container = await this.findOrCreateDeviceContainer(deviceId);
        const msg = {
            id: sequenceNumber.toString(),
            messageKind: 'deviceEvent',
            body: body
        };
        await container
            .items
            .upsert(msg);
    }

    private async findOrCreateDeviceContainer(deviceId: string): Promise<Container> {
        const db = await this.findDatabase();
        const response = await db.containers.createIfNotExists(
            { id: `${deviceId}_messages`, partitionKey: { paths: ['/messageKind'] } }
        )
        return response.container
    }

    private async findDatabase(): Promise<Database> {
        const client = await this.loadClient();
        const db: Database = await client.database(
            process.env.ENVIRONMENT == 'PROD' ? 'Devices' : 'DevicesTest'
        );
        return db;
    }

    private async loadClient(): Promise<CosmosClient> {
        if (this.client !== null) {
            return this.client;
        }
        const connStr = await this.secretStore.GetDatabaseConnectionString()
        this.client = new CosmosClient(connStr);
        return this.client;
    }
}