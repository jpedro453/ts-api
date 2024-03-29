import { LoadSurveysController } from '@/presentation/controllers/survey/load-surveys/load-surveys.protocols'
import { IController } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbLoadSurveys } from '@/main/factories/useCases/survey/load-surveys/db-load-surveys-factory'

export const makeLoadSurveysController = (): IController => {
    const controller = new LoadSurveysController(makeDbLoadSurveys())
    return makeLogControllerDecorator(controller)
}
