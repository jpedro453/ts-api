import { ILoadSurveyResultRepository } from '@/data/protocols/db/survey/load-survey-result-repository'
import { ISaveSurveyResultRepository } from '@/data/protocols/db/survey/save-survey-result-repository'
import { ISurveyResultModel } from '@/domain/models/survey-result'
import { ISaveSurveyResult, ISaveSurveyResultModel } from '@/domain/useCases/survey/save-survey-result'

export class DbSaveSurveyResult implements ISaveSurveyResult {
    constructor(
        private readonly saveSurveyResultRepository: ISaveSurveyResultRepository,
        private readonly loadSurveyResultRepository: ILoadSurveyResultRepository
    ) {}
    async save(data: ISaveSurveyResultModel): Promise<ISurveyResultModel> {
        await this.saveSurveyResultRepository.save(data)
        const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(data.survey_id)
        return surveyResult
    }
}
