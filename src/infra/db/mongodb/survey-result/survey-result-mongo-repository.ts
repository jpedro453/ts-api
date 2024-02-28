import { ISaveSurveyResultRepository } from '@/data/protocols/db/survey/save-survey-result-repository'
import { ISurveyResultModel } from '@/domain/models/survey-result'
import { ISaveSurveyResultModel } from '@/domain/useCases/survey/save-survey-result'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyResultMongoRepository implements ISaveSurveyResultRepository {
    async save(data: ISaveSurveyResultModel): Promise<ISurveyResultModel> {
        const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
        const res = await surveyResultCollection.findOneAndUpdate(
            {
                survey_id: data.survey_id,
                account_id: data.account_id
            },
            {
                $set: {
                    answer: data.answer,
                    date: data.date
                }
            },
            {
                upsert: true,
                returnDocument: 'after'
            }
        )
        return MongoHelper.map(res)
    }
}
