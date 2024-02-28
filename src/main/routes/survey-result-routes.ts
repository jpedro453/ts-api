import { Router } from 'express'
import { adaptRoute } from '@/main/adapters/express/express-route-adapter'
import { auth } from '@/main/middlewares/auth'
import { makeSaveSurveyResultController } from '../factories/controllers/survey-results/save-survey-result/save-survey-result-controller-factory'

export default (router: Router): void => {
    router.put('/surveys/:survey_id/results', auth, adaptRoute(makeSaveSurveyResultController()))
}
