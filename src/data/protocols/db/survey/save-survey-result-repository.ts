import { ISurveyResultModel } from '@/domain/models/survey-result'
import { ISaveSurveyResultModel } from '@/domain/useCases/save-survey-result'

export interface ISaveSurveyResultRepository {
    save(data: ISaveSurveyResultModel): Promise<ISurveyResultModel>
}
