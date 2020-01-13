import { StateMachineContext, StateMeta, StateMachineEvent } from "./workflow";

export interface TransitionEvent {
  type: StateMachineEvent;
}

type Action = (
  context: StateMachineContext,
  meta: StateMeta
) => Promise<TransitionEvent>;

export default Action;
