import { IController } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { SaveSurveyResultController } from '@/presentation/controllers/survey/survey-result/save-survey-result/save-survey-result-controller'
import { makeDbSaveSurveyResult } from '@/main/factories/useCases/survey-result/save-survey-result/db-save-survey-result-factory'
import { makeDbLoadSurveyById } from '@/main/factories/useCases/survey/load-survey-by-id/db-load-survey-by-id-factory'

export const makeSaveSurveyResultController = (): IController => {
    const controller = new SaveSurveyResultController(makeDbLoadSurveyById(), makeDbSaveSurveyResult())
    return makeLogControllerDecorator(controller)
}
