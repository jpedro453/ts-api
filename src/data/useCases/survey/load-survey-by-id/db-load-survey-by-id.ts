import { ILoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { ISurveyModel } from '@/domain/models/survey'
import { ILoadSurveyById } from '@/domain/useCases/load-survey-by-id'

export class DbLoadSurveyById implements ILoadSurveyById {
    constructor(private readonly loadSurveyByIdRepository: ILoadSurveyByIdRepository) {}
    async loadById(id: any): Promise<ISurveyModel> {
        const survey = await this.loadSurveyByIdRepository.loadById(id)
        return survey
    }
}
