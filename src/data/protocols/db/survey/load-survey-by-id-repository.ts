import { ISurveyModel } from '@/domain/models/survey'

export interface ILoadSurveyByIdRepository {
    loadById(id: string | any): Promise<ISurveyModel>
}
