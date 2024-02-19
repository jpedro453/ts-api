import { ISurveyModel } from '@/domain/models/survey'

export interface ILoadSurveys {
    load(id: string | any): Promise<ISurveyModel>
}
