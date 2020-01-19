import EventService from "../../../application/ports/event-sender";
import { StateNodeType } from "../../../application/domain/workflow";
import createSendEventAction from "./send-event-action";
import createConditionalBranchAction from "./conditional-branch-action";
import createFinalAction from "./final-action";
import createStartAction from "./start-action";
import Action from "../../domain/action";

class ActionFactory {
  private actions: Record<StateNodeType, Action>;

  constructor(eventService: EventService) {
    this.actions = {
      send_event: createSendEventAction(eventService),
      conditional_branch: createConditionalBranchAction(),
      final: createFinalAction(),
      start: createStartAction()
    };
  }

  getAction(type: StateNodeType): Action {
    return this.actions[type];
  }
}

export default ActionFactory;
