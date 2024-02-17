import { LoadSurveysController } from '../../../../../presentation/controllers/survey/load-surveys/load-surveys.protocols'
import { IController } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { makeDbLoadSurveys } from '../../../useCases/survey/load-surveys/db-load-surveys-factory'

export const makeLoadSurveysController = (): IController => {
    const controller = new LoadSurveysController(makeDbLoadSurveys())
    return makeLogControllerDecorator(controller)
}