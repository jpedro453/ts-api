import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result/survey-result-mongo-repository'
import { ILoadSurveyResult } from '@/domain/useCases/survey/load-survey-result'
import { DbLoadSurveyResult } from '@/data/useCases/survey/load-survey-result/db-load-survey-result'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbLoadSurveyResult = (): ILoadSurveyResult => {
    const surveyResultMongoRepository = new SurveyResultMongoRepository()
    const loadSurveyByIdRepository = new SurveyMongoRepository()
    return new DbLoadSurveyResult(surveyResultMongoRepository, loadSurveyByIdRepository)
}
