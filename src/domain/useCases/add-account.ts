import { IAccountModel } from '../models/account'

export interface IAddAccountModel {
    id: string
    name: string
    email: string
    password: string
}

export interface IAddAccount {
    add(account: IAddAccountModel): Promise<IAccountModel>
}
