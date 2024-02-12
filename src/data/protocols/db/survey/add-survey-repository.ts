import { IAddSurveyModel, IAddSurvey } from '../../../../domain/useCases/add-survey'

export interface IAddSurveyRepository {
    add(surveyData: IAddSurveyModel): Promise<void>
}