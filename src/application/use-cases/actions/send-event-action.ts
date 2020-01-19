import EventService from "../../ports/event-sender";
import { assertSendEventStateNode } from "../../domain/workflow";
import Action from "../../domain/action";

type CreateSendEventAction = (eventService: EventService) => Action;

const createSendEventAction: CreateSendEventAction = eventService => async (
  context,
  state
) => {
  assertSendEventStateNode(state);

  if ("id" in context.attributes) {
    await eventService(
      state.eventId,
      context.event_attributes,
      context.attributes.id
    );
  } else {
    await eventService(state.eventId, context.event_attributes);
  }

  return { type: "continue" };
};

export default createSendEventAction;
