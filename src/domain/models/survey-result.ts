export interface ISurveyResultModel {
    survey_id: string | any
    question: string
    answers: ISurveyResultAnswerModel[]
    date: Date
}

export interface ISurveyResultAnswerModel {
    image?: string
    answer: string
    count: number
    percent: number
}
