import { IAddAccountRepository } from '../../../../data/protocols/db/add-account-repository'
import { ILoadAccountByEmailRepository } from '../../../../data/protocols/db/load-account-by-email-repository'
import { IUpdateAccessTokenRepository } from '../../../../data/protocols/db/update-acess-token-repository'
import { IAccountModel } from '../../../../domain/models/account'
import { IAddAccountModel } from '../../../../domain/useCases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository
    implements IAddAccountRepository, ILoadAccountByEmailRepository, IUpdateAccessTokenRepository
{
    async add(accountData: IAddAccountModel): Promise<IAccountModel> {
        const accountCollection = await MongoHelper.getCollection('accounts')
        const result = await accountCollection.insertOne(accountData)
        const account = await MongoHelper.getCollectionItemById('accounts', result.insertedId)
        return MongoHelper.map(account)
    }

    async loadByEmail(email: string): Promise<IAccountModel> {
        const accountCollection = await MongoHelper.getCollection('accounts')
        const account = await accountCollection.findOne({ email })
        return account && MongoHelper.map(account)
    }

    async updateAccessToken(id: any, token: string): Promise<void> {
        const accountCollection = await MongoHelper.getCollection('accounts')
        await accountCollection.updateOne(
            {
                _id: id
            },
            {
                $set: {
                    accessToken: token
                }
            }
        )
    }
}
