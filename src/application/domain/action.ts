import { StateMachineContext, StateNode, StateMachineEvent } from "./workflow";

export interface TransitionEvent {
  type: StateMachineEvent;
}

type Action = (
  context: StateMachineContext,
  state: StateNode
) => Promise<TransitionEvent>;

export default Action;
