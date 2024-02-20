import { ISaveSurveyResultRepository } from '@/data/protocols/db/survey/save-survey-result-repository'
import { ISurveyResultModel } from '@/domain/models/survey-result'
import { ISaveSurveyResult, ISaveSurveyResultModel } from '@/domain/useCases/save-survey-result'

export class DbSaveSurveyResult implements ISaveSurveyResult {
    constructor(private readonly saveSurveyResultRepository: ISaveSurveyResultRepository) {}
    async save(data: ISaveSurveyResultModel): Promise<ISurveyResultModel> {
        const survey = await this.saveSurveyResultRepository.save(data)
        return survey
    }
}
