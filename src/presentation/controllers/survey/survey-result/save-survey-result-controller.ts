import { ILoadSurveyById } from '@/domain/useCases/survey/load-survey-by-id'
import { IController, IHttpRequest, IHttpResponse } from '../add-survey/add-survey-controller-protocols'

export class SaveSurveyResultController implements IController {
    constructor(private readonly loadSurveyById: ILoadSurveyById) {}
    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        await this.loadSurveyById.loadById(httpRequest.params.surveyId)
        return null
    }
}
