import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'
import { ILoadSurveys } from '@/domain/useCases/survey/load-surveys'
import { DbLoadSurveys } from '@/data/useCases/survey/load-surveys/db-load-surveys'

export const makeDbLoadSurveys = (): ILoadSurveys => {
    const surveyMongoRepository = new SurveyMongoRepository()
    return new DbLoadSurveys(surveyMongoRepository)
}
