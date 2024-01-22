import { IAddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { IAccountModel } from '../../../../domain/models/account'
import { IAddAccountModel } from '../../../../domain/useCases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements IAddAccountRepository {
    async add(accountData: IAddAccountModel): Promise<IAccountModel> {
        const accountCollection = await MongoHelper.getCollection('accounts')
        const result = await accountCollection.insertOne(123)
        const account = await MongoHelper.getCollectionItemById('accounts', result.insertedId)
        return MongoHelper.map(account)
    }
}
