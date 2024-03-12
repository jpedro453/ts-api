import { ISurveyResultModel } from '@/domain/models/survey-result'

export interface ILoadSurveyResultRepository {
    loadBySurveyId(surveyId: string): Promise<ISurveyResultModel>
}
