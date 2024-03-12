import { ILoadSurveyResultRepository } from '@/data/protocols/db/survey/load-survey-result-repository'
import { ISurveyResultModel } from '@/domain/models/survey-result'
import { ILoadSurveyResult } from '@/domain/useCases/survey/load-survey-result'

export class DbLoadSurveyResult implements ILoadSurveyResult {
    constructor(private readonly loadSurveyResultRepository: ILoadSurveyResultRepository) {}

    async load(survey_id: string): Promise<ISurveyResultModel> {
        await this.loadSurveyResultRepository.loadBySurveyId(survey_id)
        return null
    }
}
