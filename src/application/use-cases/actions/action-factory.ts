import EventService from "../../../application/ports/event-sender";
import { StateType } from "../../../application/domain/workflow";
import createSendEventAction from "./send-event-action";
import createConditionalBranchAction from "./conditional-branch-action";
import Action from "../../domain/action";

class ActionFactory {
  private actions: Record<StateType, Action>;

  constructor(eventService: EventService) {
    this.actions = {
      send_event: createSendEventAction(eventService),
      conditional_branch: createConditionalBranchAction()
    };
  }

  getAction(type: StateType): Action {
    return this.actions[type];
  }
}

export default ActionFactory;
