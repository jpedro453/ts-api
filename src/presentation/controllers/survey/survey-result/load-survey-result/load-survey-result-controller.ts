import { ILoadSurveyById } from '@/domain/useCases/survey/load-survey-by-id'
import { IController, IHttpRequest, IHttpResponse } from '../../add-survey/add-survey-controller-protocols'
import { forbidden } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'

export class LoadSurveyResultController implements IController {
    constructor(private readonly loadSurveyById: ILoadSurveyById) {}

    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        const { survey_id } = httpRequest.params
        const survey = await this.loadSurveyById.loadById(survey_id)
        if (!survey) {
            return forbidden(new InvalidParamError('survey_id'))
        }
        return null
    }
}
