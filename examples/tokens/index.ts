import {TokenHandler} from "./handler";
import {PASSWORD, USER, URL, PATH} from "../config";
import {extractObjectFromResponseOrThrow} from "../utils/response";

const handler = new TokenHandler(USER, PASSWORD, URL);

(async () => {
   const fetch = handler.fetchWithToken.bind(handler);
   const res = await fetch(`${URL}${PATH}`,{method: "GET"});
   const data = await extractObjectFromResponseOrThrow<any>(res);
   console.log(data);
})()