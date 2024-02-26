import { ILoadSurveyById } from '@/domain/useCases/survey/load-survey-by-id'
import { IController, IHttpRequest, IHttpResponse } from '../add-survey/add-survey-controller-protocols'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'

export class SaveSurveyResultController implements IController {
    constructor(private readonly loadSurveyById: ILoadSurveyById) {}
    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        try {
            const survey = await this.loadSurveyById.loadById(httpRequest.params.surveyId)
            if (!survey) {
                return forbidden(new InvalidParamError('SurveyID'))
            }
            return null
        } catch (error) {
            return serverError(error)
        }
    }
}
