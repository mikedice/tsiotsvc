export default interface ISecretStore {
    GetCheckpointBlobStorageConnectionString(): Promise<string>;
    GetEventHubsConnectionString(): Promise<string>;
    GetDatabaseConnectionString(): Promise<string>;
}