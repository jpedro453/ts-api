import { IAccountModel, IAddAccountModel } from '@/data/useCases/account/add-account/db-add-account-protocols'

export interface IAddAccountRepository {
    add(accountData: IAddAccountModel): Promise<IAccountModel>
}
