import { ILoadSurveyById } from '@/domain/useCases/survey/load-survey-by-id'
import { IController, IHttpRequest, IHttpResponse } from '../add-survey/add-survey-controller-protocols'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'

export class SaveSurveyResultController implements IController {
    constructor(private readonly loadSurveyById: ILoadSurveyById) {}
    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        try {
            const { surveyId } = httpRequest.params
            const { answer } = httpRequest.body
            const survey = await this.loadSurveyById.loadById(surveyId)

            if (survey) {
                const answers = survey.answers.map((a) => a.answer)

                if (!answers.includes(answer)) {
                    return forbidden(new InvalidParamError('answer'))
                }
            } else {
                return forbidden(new InvalidParamError('SurveyID'))
            }
            return null
        } catch (error) {
            return serverError(error)
        }
    }
}
