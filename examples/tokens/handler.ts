import fetch, {RequestInit, RequestInfo, Response} from "node-fetch";
import {LOG_API_RESPONSES} from "../config";
import {TokenResponse} from "./types";
import {parseJwt} from "../utils/token";

const HTTP_STATUS_UNAUTHORIZED = 401;

/**
 * Provides a fetch function that keeps the user logged in always and updates the tokens if required.
 */
export class TokenHandler {
    /**
     * The token the user receives after successfully logging in
     * @private
     */
    private token: string | null = null;
    /**
     * The refreshToken that can be used to generate a new token and refresh token
     * @private
     */
    private refreshToken: string | null = null;

    constructor(
        private readonly user: string,
        private readonly password: string,
        private readonly url: string,
    ) {
    }

    /**
     * Requests a completely new set of tokens disregarding the current state of tokens
     * @private
     */
    private async requestNewTokens() {
        console.debug("Requesting new tokens...");
        const authHeader = `Basic ` + Buffer.from(this.user + ":" + this.password).toString("base64");
        const requestOptions = {
            method: "GET",
            headers: {
                "Authorization": authHeader
            }
        };
        try {
            const res = await fetch(`${this.url}/iam/token?scope=offline`, requestOptions);
            if (!res.ok) {
            } else {
                const json = await res.json() as TokenResponse;
                this.token = json.token || null;
                this.refreshToken = json.refreshToken || null;
                this.log(json);
            }
        } catch (e) {
            console.error("Error while getting new tokens", e);
        }
        if (this.token === null) {
            console.error(`Unable to sign in with the given credentials for user [${this.user}] at the URL [${this.url}].`);
            throw new Error("UNABLE TO SIGN IN");
        }
    }

    /**
     * Uses the refresh token to generate a new pair of tokens
     * @private
     */
    private async useRefreshToken() {
        console.debug("Using refresh token...");
        try {
            const requestOptions = {
                method: "POST",
                body: JSON.stringify({refreshToken: this.refreshToken})
            };
            const res = await fetch(`${this.url}/iam/token?scope=offline&grant_type=refresh_token`, requestOptions);
            if (res.status === HTTP_STATUS_UNAUTHORIZED) {
                return this.requestNewTokens();
            } else {
                const json = await res.json() as TokenResponse;
                this.token = json.token || null;
                this.refreshToken = json.refreshToken || null;
                this.log(json);
            }
        } catch (e) {
            console.error("Error while refreshing tokens", e);
        }

        if (this.token === null) {
            console.error(`Unable to refresh tokens for the user [${this.user}] at the URL [${this.url}].`);
            throw new Error("UNABLE TO REFRESH TOKENS");
        }
    }

    private async updateTokens() {
        console.debug("Updating tokens...");
        if (this.refreshToken !== null) {
            return this.useRefreshToken();
        } else {
            return this.requestNewTokens()
        }
    }

    private log(json: TokenResponse){
        if(LOG_API_RESPONSES){
            if (LOG_API_RESPONSES) {
                console.log("Token Response", JSON.stringify(json), this.refreshToken);
                console.log("Token Info", parseJwt(this.token || ""))
                console.log("Refresh Token Info", parseJwt(this.refreshToken || ""))
            }
        }
    }

    /**
     * This function can be used in place of the fetch function in order to always have a valid token in the auth header.
     * Given, the username and password are correct.
     */
    public fetchWithToken: (url: RequestInfo, init?: RequestInit) => Promise<Response> =
        async (url: RequestInfo,
               init?: RequestInit) => {

            //no current token
            if (this.token === null) {
                await this.requestNewTokens();
                return this.fetchWithToken(url, init);
            }

            //add auth header to the correct object
            if (typeof url === "string" || "href" in url) {
                const headers = Object.assign(init?.headers || {}, {"Authorization": `Bearer ${this.token}`})
                init = Object.assign(init || {}, {headers: headers});
            } else {
                url.headers.set("Authorization", `Bearer ${this.token}`);
            }

            const res = await fetch(url, init);
            if (res.status == HTTP_STATUS_UNAUTHORIZED) {
                await this.updateTokens();
                return this.fetchWithToken(url, init);
            } else {
                return res;
            }
        }
}