import { ILoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { ILoadSurveyResultRepository } from '@/data/protocols/db/survey/load-survey-result-repository'
import { ISurveyResultModel } from '@/domain/models/survey-result'
import { ILoadSurveyResult } from '@/domain/useCases/survey/load-survey-result'

export class DbLoadSurveyResult implements ILoadSurveyResult {
    constructor(
        private readonly loadSurveyResultRepository: ILoadSurveyResultRepository,
        private readonly loadSurveyByIdRepository: ILoadSurveyByIdRepository
    ) {}

    async load(survey_id: string): Promise<ISurveyResultModel> {
        let surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(survey_id)
        if (!surveyResult) {
            const survey = await this.loadSurveyByIdRepository.loadById(survey_id)
            surveyResult = {
                survey_id: survey.id,
                question: survey.question,
                date: survey.date,
                answers: survey.answers.map((answer) =>
                    Object.assign({}, answer, {
                        count: 0,
                        percent: 0
                    })
                )
            }
        }
        return surveyResult
    }
}
