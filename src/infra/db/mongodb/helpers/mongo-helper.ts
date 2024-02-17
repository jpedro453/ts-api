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

    mapArray(array: any[]): any[] {
        function mapObject(item: any): any {
            const { _id, ...itemWithoutId } = item
            return Object.assign({}, itemWithoutId, { id: _id })
        }
        return array.map((item) => mapObject(item))
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
