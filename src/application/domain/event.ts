export type EventStatus = "SENT" | "CREATED" | "FAILED";

export default interface Event {
  name: string;
  profileId?: string;
  payload?: Record<string, any>;
  status: EventStatus;
  statusReason: string;
  sentAt?: string;
  createdAt: string;
  requestCreatedAt: string;
}

export interface EventRequest {
  name: string;
  profileId?: string;
  payload?: Record<string, any>;
  createdAt: string;
}

export const fromRequest = (request: EventRequest) =>
  ({
    name: request.name,
    profileId: request.profileId,
    payload: request.payload,
    status: "CREATED",
    statusReason: "",
    sentAt: null,
    requestCreatedAt: request.createdAt,
    createdAt: new Date().toISOString()
  } as const);

export const markAsSent = (event: Event) =>
  ({
    ...event,
    status: "SENT",
    statusReason: ""
  } as const);

export const markAsFailed = (event: Event, reason: string) =>
  ({
    ...event,
    status: "FAILED",
    statusReason: reason
  } as const);
