import { Response } from "node-fetch";

import { LOG_API_RESPONSES } from "../config";

/**
 * Extract the json data from a fetch response. The result is type casted so it is not completely type safe.
 */
export async function extractObjectFromResponseOrThrow<T>(response: Response): Promise<T> {
    if (!response.ok) {
        console.error(`Response status was ${response.status} - NOT_OK`, response.url);
        throw new Error("RESPONSE_NOT_OK");
    }
    try {
        const json = await response.json();
        if (LOG_API_RESPONSES) {
            console.log(`Response for ${response.url}:`, JSON.stringify(response, null, 4));
        }
        return json as T;
    } catch (e) {
        console.error("Unable to parse json from response");
        throw e;
    }
}
