export interface ISurveyModel {
    id: string | any
    question: string
    answers: ISurveyAnswerModel[]
    date: Date
}

export interface ISurveyAnswerModel {
    image?: string
    answer: string
}
