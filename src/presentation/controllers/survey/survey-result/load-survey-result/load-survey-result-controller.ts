import { ILoadSurveyById } from '@/domain/useCases/survey/load-survey-by-id'
import { IController, IHttpRequest, IHttpResponse } from '../../add-survey/add-survey-controller-protocols'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'
import { ILoadSurveyResult } from '@/domain/useCases/survey/load-survey-result'

export class LoadSurveyResultController implements IController {
    constructor(
        private readonly loadSurveyById: ILoadSurveyById,
        private readonly loadSurveyResult: ILoadSurveyResult
    ) {}

    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        try {
            const { survey_id } = httpRequest.params
            const survey = await this.loadSurveyById.loadById(survey_id)
            if (!survey) {
                return forbidden(new InvalidParamError('survey_id'))
            }
            const surveyResult = await this.loadSurveyResult.load(survey_id)
            return ok(surveyResult)
        } catch (error) {
            return serverError(error)
        }
    }
}
