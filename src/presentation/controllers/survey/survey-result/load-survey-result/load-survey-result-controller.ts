import { ILoadSurveyById } from '@/domain/useCases/survey/load-survey-by-id'
import { IController, IHttpRequest, IHttpResponse } from '../../add-survey/add-survey-controller-protocols'

export class LoadSurveyResultController implements IController {
    constructor(private readonly loadSurveyById: ILoadSurveyById) {}

    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        const { survey_id } = httpRequest.params
        await this.loadSurveyById.loadById(survey_id)
        return null
    }
}
