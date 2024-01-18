import { MongoClient, Collection } from 'mongodb'

export const MongoHelper = {
    client: null as MongoClient,

    async connect(uri: string): Promise<void> {
        this.client = await MongoClient.connect(uri)
    },

    async disconnect(): Promise<void> {
        if (this.client) {
            await this.client.close()
        }
    },

    map(collection: any): any {
        const { _id, ...collectionWithoutId } = collection

        return Object.assign({}, collectionWithoutId, { id: _id })
    },

    async getCollection(name: string): Promise<Collection> {
        return this.client.db().collection(name)
    },

    // FIXME: TEMPORÁRIO: mongodb não aceita mais o .ops apos o insertOne
    async getCollectionItemById(collection: string, id: any): Promise<any> {
        return this.client.db().collection(collection).findOne({ _id: id })
    }
}
