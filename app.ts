import DeviceEventsHandlerService from "./DeviceEventsHandlerService"
import DocDbDatabase from "./DocDbDatabase";
import IDocDbDatabase from "./IDocDbDatabase";
import ISecretStore from "./ISecretStore";
import SecretStore from "./SecretStore"

async function run(): Promise<void>{
    const secretStore:ISecretStore = new SecretStore();
    const database:IDocDbDatabase = new DocDbDatabase(secretStore)
    const iotEventsHandler = new DeviceEventsHandlerService(secretStore, database);
    await iotEventsHandler.Run();
}

run().then((success)=>{
    console.log("succeeded");
    console.log(success);
}, (error)=>{
    console.log(error);
})
