export interface IUpdateAccessTokenRepository {
    // id is any because mongo _id doesn't accept string
    updateAccessToken(id: any, token: string): Promise<void>
}
