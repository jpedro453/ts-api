import { ISaveSurveyResultRepository } from '@/data/protocols/db/survey/save-survey-result-repository'
import { ISurveyResultModel } from '@/domain/models/survey-result'
import { ISaveSurveyResultModel } from '@/domain/useCases/survey/save-survey-result'
import { MongoHelper } from '../helpers/mongo-helper'
import { ObjectId } from 'mongodb'

export class SurveyResultMongoRepository implements ISaveSurveyResultRepository {
    async save(data: ISaveSurveyResultModel): Promise<ISurveyResultModel> {
        const surveyResultCollection = await MongoHelper.getCollection('surveyResults')

        await surveyResultCollection.findOneAndUpdate(
            {
                survey_id: new ObjectId(data.survey_id),
                account_id: new ObjectId(data.account_id)
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
        const surveyResult = await this.loadSurveyById(data.survey_id)
        return surveyResult
    }

    private async loadSurveyById(surveyId: string | any): Promise<ISurveyResultModel> {
        const surveyResultCollection = await MongoHelper.getCollection('surveyResults')

        const query = surveyResultCollection.aggregate([
            {
                $match: {
                    survey_id: new ObjectId(surveyId)
                }
            },
            {
                $group: {
                    _id: 0,
                    data: {
                        $push: '$$ROOT'
                    },
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $unwind: {
                    path: '$data'
                }
            },
            {
                $lookup: {
                    from: 'surveys',
                    foreignField: '_id',
                    localField: 'data.survey_id',
                    as: 'survey'
                }
            },
            {
                $unwind: {
                    path: '$survey'
                }
            },

            {
                $group: {
                    _id: {
                        survey_id: '$survey._id',
                        question: '$survey.question',
                        date: '$survey.date',
                        total: '$count',
                        answer: {
                            $filter: {
                                input: '$survey.answers',
                                as: 'item',
                                cond: {
                                    $eq: ['$$item.answer', '$data.answer']
                                }
                            }
                        }
                    },

                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $unwind: {
                    path: '$_id.answer'
                }
            },
            {
                $addFields: {
                    '_id.answer.count': '$count',
                    '_id.answer.percent': {
                        $multiply: [
                            {
                                $divide: ['$count', '$_id.total']
                            },
                            100
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: {
                        survey_id: '$_id.survey_id',
                        question: '$_id.question',
                        date: '$_id.date'
                    },
                    answers: {
                        $push: '$_id.answer'
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    survey_id: '$_id.survey_id',
                    question: '$_id.question',
                    date: '$_id.date',
                    answers: '$answers'
                }
            }
        ])

        const surveyResult = await query.toArray()
        return surveyResult?.length ? MongoHelper.map(surveyResult[0]) : null
    }
}
