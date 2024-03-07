import { ISurveyResultModel } from '../../models/survey-result'

export type ISaveSurveyResultModel = {
    survey_id: string | any
    account_id: string | any
    answer: string
    date: Date
}

export interface ISaveSurveyResult {
    save(data: ISaveSurveyResultModel): Promise<ISurveyResultModel>
}
