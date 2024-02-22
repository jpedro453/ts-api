import { ILoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { ILoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { IAddSurveyModel, IAddSurveyRepository } from '@/data/useCases/add-survey/db-add-survey-protocols'
import { ISurveyModel } from '@/domain/models/survey'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

export class SurveyMongoRepository implements IAddSurveyRepository, ILoadSurveysRepository, ILoadSurveyByIdRepository {
    async add(surveyData: IAddSurveyModel): Promise<void> {
        const surveyCollection = await MongoHelper.getCollection('surveys')
        const result = await surveyCollection.insertOne(surveyData)
    }
    async loadAll(): Promise<ISurveyModel[]> {
        const surveyCollection = await MongoHelper.getCollection('surveys')
        const surveys = await surveyCollection.find().toArray()
        return MongoHelper.mapArray(surveys)
    }
    async loadById(id: any): Promise<ISurveyModel> {
        const surveyCollectoin = await MongoHelper.getCollection('surveys')
        const result = await surveyCollectoin.findOne({ _id: id })
        const survey: ISurveyModel = MongoHelper.map(result)
        return MongoHelper.map(survey)
    }
}
