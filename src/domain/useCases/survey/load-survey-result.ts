import { ISurveyResultModel } from '../../models/survey-result'

export interface ILoadSurveyResult {
    load(survey_id: string): Promise<ISurveyResultModel>
}
