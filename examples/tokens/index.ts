import { PASSWORD, PATH, URL, USER } from "../config";
import { extractObjectFromResponseOrThrow } from "../utils/response";

import { TokenHandler } from "./handler";
import { MetaResponse } from "./types";

const handler = new TokenHandler(USER, PASSWORD, URL);

(async () => {
    const fetch = handler.fetchWithToken.bind(handler);
    const callback = async () => {
        const res = await fetch(`${URL}${PATH}`, { method: "GET" });
        const data = await extractObjectFromResponseOrThrow<MetaResponse>(res);
        console.log(`Got ${data.length} items.`);
    };
    await callback();
    setInterval(callback, 10_000);
})();
