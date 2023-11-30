import { WebsocketHandler } from "./handler";
import { MetaStatusChangeEvent } from "./types";

(async () => {
    const socketHandler = await WebsocketHandler.connect();

    //chose the events you are interested in
    socketHandler.on("META_STATUS_CHANGE", (payload: MetaStatusChangeEvent) => {
        console.log(`Device ${payload.deviceIdentifier} meta update`);
    });
    //Example event - wont trigger
    socketHandler.on("EVENT_NAME", (/* event payload */) => {
        console.log("Got event");
    });
})();
