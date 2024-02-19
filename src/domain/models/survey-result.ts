export interface ISurveyResultModel {
    // mongoDB ObjectID doesn't accept string, will change do Types.ObjectId later from mongoose
    id: string | any
    survey_id: string | any
    account_id: string | any
    answer: string
    date: Date
}
