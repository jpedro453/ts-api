import {
    IAccountModel,
    IAddAccountModel,
} from '../useCases/add-account/db-add-account-protocols'

export interface IAddAccountRepository {
    add(accountData: IAddAccountModel): Promise<IAccountModel>
}
