import EventService from "../../ports/event-sender";
import { assertSendEventMeta } from "../../domain/workflow";
import Action from "../../domain/action";

type CreateSendEventAction = (eventService: EventService) => Action;

const createSendEventAction: CreateSendEventAction = eventService => async (
  context,
  meta
) => {
  assertSendEventMeta(meta);

  if ("id" in context.attributes) {
    await eventService(
      meta.eventId,
      context.event_attributes,
      context.attributes.id
    );
  } else {
    await eventService(meta.eventId, context.event_attributes);
  }

  return { type: "continue" };
};

export default createSendEventAction;
