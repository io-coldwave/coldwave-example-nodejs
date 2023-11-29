import {Response} from "node-fetch";

export async function extractObjectFromResponseOrThrow<T extends Record<string, unknown>>(response: Response): Promise<T> {
    if (!response.ok) {
        console.error(`Response status was ${response.status} - NOT_OK`, response.url);
        throw new Error("RESPONSE_NOT_OK");
    }
    try {
        const json = await response.json();
        return json as T
    } catch (e) {
        console.error("Unable to parse json from response");
        throw e;
    }
}