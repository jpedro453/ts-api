import { IAccountModel, IAddAccountModel } from '../useCases/add-account/db-add-account-protocols'

export interface ILogErrorRepository {
    logError(stack: string): Promise<void>
}
