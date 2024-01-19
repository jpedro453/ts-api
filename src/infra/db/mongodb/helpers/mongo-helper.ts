import { MongoClient, Collection } from 'mongodb'

export const MongoHelper = {
    client: null as MongoClient,
    uri: null as string,

    async connect(uri: string): Promise<void> {
        this.uri = uri
        this.client = await MongoClient.connect(uri)
    },

    async disconnect(): Promise<void> {
        if (this.client) {
            await this.client.close()
            this.client = null
        }
    },

    map(collection: any): any {
        const { _id, ...collectionWithoutId } = collection

        return Object.assign({}, collectionWithoutId, { id: _id })
    },

    async getCollection(name: string): Promise<Collection> {
        if (this.client == null) {
            await this.connect(this.uri)
        }
        return this.client.db().collection(name)
    },

    // FIXME: TEMPORÁRIO: mongodb não aceita mais o .ops apos o insertOne
    async getCollectionItemById(collection: string, id: any): Promise<any> {
        if (this.client == null) {
            await this.connect(this.uri)
        }
        return this.client.db().collection(collection).findOne({ _id: id })
    }
}
