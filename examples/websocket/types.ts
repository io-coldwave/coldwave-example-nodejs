export interface TicketResponse {
    ticket: string;
}

export interface MetaStatusChangeEvent {
    type: "META_STATUS_CHANGE";
    deviceIdentifier: string;
    status: "online" | "offline" | "idle";
    lastMessage: number;
}
