import { ISaveSurveyResult } from '@/domain/useCases/survey/save-survey-result'
import { DbSaveSurveyResult } from '@/data/useCases/survey/save-survey-result/db-save-survey-result'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result/survey-result-mongo-repository'

export const makeDbSaveSurveyResult = (): ISaveSurveyResult => {
    const surveyResultMongoRepository = new SurveyResultMongoRepository()
    return new DbSaveSurveyResult(surveyResultMongoRepository, surveyResultMongoRepository)
}
