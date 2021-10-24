import ISecretStore from "./ISecretStore";
import { KeyVaultSecret, SecretClient } from "@azure/keyvault-secrets";
import { DefaultAzureCredential } from "@azure/identity";

const isProd = process.env.ENVIRONMENT=="PROD"
const KeyvaultUri = isProd ? "https://tscontentkvprod.vault.azure.net/" 
                           : "https://tscontentkvdev.vault.azure.net/";

export default class SecretStore implements ISecretStore{

    private _checkpointBlobStorageConnectionString: string;
    private _eventHubsConnectionString: string;
    private _databaseConnectionString: string;

    public constructor(){
        this._checkpointBlobStorageConnectionString = null;
        this._eventHubsConnectionString = null;
        this._databaseConnectionString = null;
    }

    public async GetCheckpointBlobStorageConnectionString(): Promise<string> {
        if (this._checkpointBlobStorageConnectionString !== null){
            return this._checkpointBlobStorageConnectionString;
        }
        this._checkpointBlobStorageConnectionString = await this.LoadSecret("CheckpointBlobStorageConnectionString");
        return this._checkpointBlobStorageConnectionString;
    }

    public async GetEventHubsConnectionString(): Promise<string>{
        if (this._eventHubsConnectionString !== null){
            return this._eventHubsConnectionString;
        }
        this._eventHubsConnectionString = await this.LoadSecret("EventHubsConnectionString");
        return this._eventHubsConnectionString;
    }

    public async GetDatabaseConnectionString(): Promise<string>{
        if (this._databaseConnectionString !== null){
            return this._databaseConnectionString;
        }
        this._databaseConnectionString = await this.LoadSecret("DocDbConnectionString");
        return this._databaseConnectionString;
    }

    private async LoadSecret(secretKey: string): Promise<string>{
        const credential = new DefaultAzureCredential();
        const secretClient = new SecretClient(KeyvaultUri, credential);
        const secret:KeyVaultSecret = await secretClient.getSecret(secretKey);
        return secret.value;
    }
}