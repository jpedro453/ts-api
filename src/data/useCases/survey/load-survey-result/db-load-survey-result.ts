import { ILoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { ILoadSurveyResultRepository } from '@/data/protocols/db/survey/load-survey-result-repository'
import { ISurveyResultModel } from '@/domain/models/survey-result'
import { ILoadSurveyResult } from '@/domain/useCases/survey/load-survey-result'

export class DbLoadSurveyResult implements ILoadSurveyResult {
    constructor(
        private readonly loadSurveyResultRepository: ILoadSurveyResultRepository,
        private readonly loadSurveyByIdRepository: ILoadSurveyByIdRepository
    ) {}

    async load(survey_id: string): Promise<ISurveyResultModel> {
        const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(survey_id)
        if (!surveyResult) {
            await this.loadSurveyByIdRepository.loadById(survey_id)
        }
        return surveyResult
    }
}
