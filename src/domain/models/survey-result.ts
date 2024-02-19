export interface ISurveyResultModel {
    // FIXME:
    // mongoDB ObjectID doesn't accept string, will change do Types.ObjectId later from mongoose:
    // https://www.designcise.com/web/tutorial/which-type-to-use-for-mongoose-objectid-in-a-typescript-interface
    id: string | any
    survey_id: string | any
    account_id: string | any
    answer: string
    date: Date
}
