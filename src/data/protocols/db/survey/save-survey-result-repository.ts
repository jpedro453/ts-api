import { ISaveSurveyResultModel } from '@/domain/useCases/survey/save-survey-result'

export interface ISaveSurveyResultRepository {
    save(data: ISaveSurveyResultModel): Promise<void>
}
