export default interface IDocDbDatabase{
    storeEvent(devicId:string, timestamp:number, sequenceNumber:number, body:any): Promise<void>;
}