import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'
import { DbLoadSurveyById } from '@/data/useCases/survey/load-survey-by-id/db-load-survey-by-id'
import { ILoadSurveyById } from '@/domain/useCases/survey/load-survey-by-id'

export const makeDbLoadSurveyById = (): ILoadSurveyById => {
    const surveyMongoRepository = new SurveyMongoRepository()
    return new DbLoadSurveyById(surveyMongoRepository)
}
