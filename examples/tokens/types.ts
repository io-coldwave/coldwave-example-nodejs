export interface TokenResponse {
    token: string;
    refreshToken: string;
}

export type MetaResponse = Array<{ deviceIdentifier: string }>;
