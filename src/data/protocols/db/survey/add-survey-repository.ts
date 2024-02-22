import { IAddSurveyModel } from '@/domain/useCases/survey/add-survey'

export interface IAddSurveyRepository {
    add(surveyData: IAddSurveyModel): Promise<void>
}
