export interface IUpdateAccessTokenRepository {
    updateAccessToken(id: any, token: string): Promise<void>
}
