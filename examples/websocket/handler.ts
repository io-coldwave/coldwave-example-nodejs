import EventEmitter from "events";

import { MessageEvent, WebSocket } from "ws";

import { LOG_WS_MESSAGES, PASSWORD, URL, USER } from "../config";
import { TokenHandler } from "../tokens/handler";
import { extractObjectFromResponseOrThrow } from "../utils/response";

import { TicketResponse } from "./types";

function parseSocketURL(url: string) {
    return url.replace("https", "wss").replace("http", "ws");
}

export class WebsocketHandler {
    private readonly emitter = new EventEmitter();

    private constructor(socket: WebSocket) {
        socket.onopen = () => {
            console.log("Socket opened");
        };
        socket.onclose = () => {
            console.log("Socket closed");
        };
        socket.onerror = (e) => {
            console.log("Socket error", e);
        };
        socket.onmessage = (event: MessageEvent) => {
            //websocket transmits string data;
            try {
                const data = JSON.parse(event.data as string);
                if (LOG_WS_MESSAGES) {
                    console.debug(data);
                }
                this.emitter.emit(data.type, data);
            } catch (e) {
                console.log("Error handling websocket message", e);
            }
        };
    }

    public on(event: string, handler: (...args: unknown[]) => void) {
        this.emitter.on(event, handler);
    }

    public once(event: string, handler: (...args: unknown[]) => void) {
        this.emitter.once(event, handler);
    }

    public off(event: string, handler: (...args: unknown[]) => void) {
        this.emitter.off(event, handler);
    }

    static async connect(): Promise<WebsocketHandler> {
        const handler = new TokenHandler(USER, PASSWORD, URL);
        const response = await handler.fetchWithToken(`${URL}/events/ticket`, { method: "GET" });
        const ticket = (await extractObjectFromResponseOrThrow<TicketResponse>(response)).ticket;
        const socketURL = parseSocketURL(URL) + `/events/${ticket}`;
        const socket = new WebSocket(socketURL);
        return new WebsocketHandler(socket);
    }
}
