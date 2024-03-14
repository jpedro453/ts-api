import { ILoadSurveyById } from '@/domain/useCases/survey/load-survey-by-id'
import { IController, IHttpRequest, IHttpResponse } from '../../add-survey/add-survey-controller-protocols'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'
import { ISaveSurveyResult } from '@/domain/useCases/survey/save-survey-result'

export class SaveSurveyResultController implements IController {
    constructor(
        private readonly loadSurveyById: ILoadSurveyById,
        private readonly saveSurveyResult: ISaveSurveyResult
    ) {}
    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        try {
            const { survey_id } = httpRequest.params
            const { answer } = httpRequest.body
            const { account_id } = httpRequest

            const survey = await this.loadSurveyById.loadById(survey_id)

            if (survey) {
                const answers = survey.answers.map((a) => a.answer)

                if (!answers.includes(answer)) {
                    return forbidden(new InvalidParamError('answer'))
                }
            } else {
                return forbidden(new InvalidParamError('SurveyID'))
            }
            const surveyResult = await this.saveSurveyResult.save({
                survey_id,
                account_id,
                answer,
                date: new Date()
            })
            if (surveyResult) {
                return ok(surveyResult)
            }

            return null
        } catch (error) {
            return serverError(error)
        }
    }
}
