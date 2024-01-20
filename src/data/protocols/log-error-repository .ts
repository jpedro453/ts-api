import { IAccountModel, IAddAccountModel } from '../useCases/add-account/db-add-account-protocols'

export interface ILogErrorRepository {
    log(stack: string): Promise<void>
}
