import { ILoadSurveysRepository } from '../../../../data/protocols/db/survey/load-surveys-repository'
import { IAddSurveyModel, IAddSurveyRepository } from '../../../../data/useCases/add-survey/db-add-survey-protocols'
import { ISurveyModel } from '../../../../domain/models/survey'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements IAddSurveyRepository, ILoadSurveysRepository {
    async add(surveyData: IAddSurveyModel): Promise<void> {
        const surveyCollection = await MongoHelper.getCollection('surveys')
        const result = await surveyCollection.insertOne(surveyData)
    }
    loadAll(): Promise<ISurveyModel[]> {
        throw new Error('Method not implemented.')
    }
}
