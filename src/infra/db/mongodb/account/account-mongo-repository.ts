import { IAddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository'
import { ILoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository'
import { ILoadAccountByTokenRepository } from '../../../../data/protocols/db/account/load-account-by-token-repository'
import { IUpdateAccessTokenRepository } from '../../../../data/protocols/db/account/update-acess-token-repository'
import { IAccountModel } from '../../../../domain/models/account'
import { IAddAccountModel } from '../../../../domain/useCases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository
    implements
        IAddAccountRepository,
        ILoadAccountByEmailRepository,
        IUpdateAccessTokenRepository,
        ILoadAccountByTokenRepository
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
    async loadByToken(token: string, role?: string): Promise<IAccountModel> {
        const accountCollection = await MongoHelper.getCollection('accounts')
        const account = await accountCollection.findOne({
            accessToken: token,
            $or: [
                {
                    role
                },
                {
                    role: 'admin'
                }
            ]
        })
        return account && MongoHelper.map(account)
    }
}
