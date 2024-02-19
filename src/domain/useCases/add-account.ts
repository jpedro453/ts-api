import { IAccountModel } from '@/domain/models/account'

export type IAddAccountModel = Omit<IAccountModel, 'id'>

export interface IAddAccount {
    add(account: IAddAccountModel): Promise<IAccountModel>
}
