import { Machine, StatesConfig as XStateConfig } from "xstate";
import WorkflowRunner from "../../application/ports/workflow-runner";
import ActionFactory from "../../application/use-cases/actions/action-factory";
import Workflow, {
  StateMachine,
  StateMachineContext,
  StateNode,
  StateMachineEvent
} from "../../application/domain/workflow";
import Event from "../../application/domain/event";
import Profile from "../../application/domain/profile";

interface XState {
  meta?: Omit<StateNode, "on">;
  on?: StateNode["on"];
}

interface XEvent {
  type: StateMachineEvent;
}

function getMeta(machine, currentState): XState["meta"] {
  return currentState.meta[`${machine.id}.${currentState.value}`];
}

function toXStateMachineStates(
  states: StateMachine
): XStateConfig<StateMachineContext, XState, XEvent> {
  const xstates = {};
  for (const state in states) {
    const { on, ...meta } = states[state];
    xstates[state] = { on, meta };
    if (meta.type === "final") {
      xstates[state].type = "final";
    }
  }

  return xstates;
}

function getMachineFromWorkflow(
  workflow: Workflow,
  event: Event,
  profile?: Profile
) {
  return Machine({
    id: workflow.id,
    context: {
      attributes: profile || {},
      event_attributes: event
    },
    initial: workflow.initialState,
    states: toXStateMachineStates(workflow.states)
  });
}

class XStateWorkflowRunner implements WorkflowRunner {
  constructor(private actionsFactory: ActionFactory) {}

  async run(workflow: Workflow, event: Event, profile?: Profile) {
    const machine = getMachineFromWorkflow(workflow, event, profile);

    let currentState = machine.initialState;
    while (true) {
      const transitionEvent = await this.runStateAction(machine, currentState);
      if (currentState.done) {
        break;
      }

      currentState = this.getNextState(machine, currentState, transitionEvent);
    }
  }

  runStateAction(machine, currentState) {
    const meta = getMeta(machine, currentState);
    const action = this.actionsFactory.getAction(meta.type);
    return action(currentState.context, meta);
  }

  getNextState(machine, currentState, transitionEvent) {
    const nextState = machine.transition(currentState, transitionEvent);
    if (nextState.value === currentState.value) {
      // Possible infinite loop
      throw new Error(
        `invalid transition detected, state: ${JSON.stringify(
          currentState
        )} event: ${JSON.stringify(transitionEvent)}`
      );
    }

    return nextState;
  }
}

export default XStateWorkflowRunner;
