import { ISaveSurveyResultRepository } from '@/data/protocols/db/survey/save-survey-result-repository'
import { ISurveyResultModel } from '@/domain/models/survey-result'
import { ISaveSurveyResultModel } from '@/domain/useCases/survey/save-survey-result'
import { MongoHelper } from '../helpers/mongo-helper'
import { ObjectId } from 'mongodb'
import { QueryBuilder } from '../helpers/query-builder'

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

        const query = new QueryBuilder()
            .match({
                survey_id: new ObjectId(surveyId)
            })
            .group({
                _id: 0,
                data: {
                    $push: '$$ROOT'
                },
                total: {
                    $sum: 1
                }
            })
            .unwind({
                path: '$data'
            })
            .lookup({
                from: 'surveys',
                foreignField: '_id',
                localField: 'data.survey_id',
                as: 'survey'
            })
            .unwind({ path: '$survey' })
            .group({
                _id: {
                    survey_id: '$survey._id',
                    question: '$survey.question',
                    date: '$survey.date',
                    total: '$total',
                    answer: '$data.answer',
                    answers: '$survey.answers'
                },

                count: {
                    $sum: 1
                }
            })
            .project({
                _id: 0,
                survey_id: '$_id.survey_id',
                question: '$_id.question',
                date: '$_id.date',
                answers: {
                    $map: {
                        input: '$_id.answers',
                        as: 'item',
                        in: {
                            $mergeObjects: [
                                '$$item',
                                {
                                    count: {
                                        $cond: {
                                            if: {
                                                $eq: ['$$item.answer', '$_id.answer']
                                            },
                                            then: '$count',
                                            else: 0
                                        }
                                    },
                                    percent: {
                                        $cond: {
                                            if: {
                                                $eq: ['$$item.answer', '$_id.answer']
                                            },
                                            then: {
                                                $multiply: [
                                                    {
                                                        $divide: ['$count', '$_id.total']
                                                    },
                                                    100
                                                ]
                                            },
                                            else: 0
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            })
            .group({
                _id: {
                    survey_id: '$survey_id',
                    question: '$question',
                    date: '$date'
                },
                answers: {
                    $push: '$answers'
                }
            })
            .project({
                _id: 0,
                survey_id: '$_id.survey_id',
                question: '$_id.question',
                date: '$_id.date',
                answers: {
                    $reduce: {
                        input: '$answers',
                        initialValue: [],
                        in: {
                            $concatArrays: ['$$value', '$$this']
                        }
                    }
                }
            })
            .unwind({
                path: '$answers'
            })
            .group({
                _id: {
                    survey_id: '$survey_id',
                    question: '$question',
                    date: '$date',
                    answer: '$answers.answer',
                    image: '$answers.image'
                },
                count: {
                    $sum: '$answers.count'
                },
                percent: {
                    $sum: '$answers.percent'
                }
            })
            .project({
                _id: 0,
                survey_id: '$_id.survey_id',
                question: '$_id.question',
                date: '$_id.date',
                answer: {
                    answer: '$_id.answer',
                    image: '$_id.image',
                    count: '$count',
                    percent: '$percent'
                }
            })
            .sort({
                'answer.count': -1
            })
            .group({
                _id: {
                    survey_id: '$survey_id',
                    question: '$question',
                    date: '$date'
                },
                answers: {
                    $push: '$answer'
                }
            })
            .project({
                _id: 0,
                survey_id: '$_id.survey_id',
                question: '$_id.question',
                date: '$_id.date',
                answers: '$answers'
            })
            .build()

        const surveyResult = await surveyResultCollection.aggregate(query).toArray()
        return surveyResult?.length ? MongoHelper.map(surveyResult[0]) : null
    }
}
