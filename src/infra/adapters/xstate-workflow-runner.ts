import { Machine } from "xstate";
import WorkflowRunner from "../../application/ports/workflow-runner";
import ActionFactory from "../../application/use-cases/actions/action-factory";
import Workflow from "../../application/domain/workflow";
import Event from "../../application/domain/event";
import Profile from "../../application/domain/profile";

function getMeta(machine, currentState) {
  return currentState.meta[`${machine.id}.${currentState.value}`];
}

class XStateWorkflowRunner implements WorkflowRunner {
  constructor(private actionsFactory: ActionFactory) {}

  async run(workflow: Workflow, event: Event, profile?: Profile) {
    const machine = Machine({
      id: workflow.id,
      context: {
        attributes: profile || {},
        event_attributes: event
      },
      initial: workflow.initialState,
      states: workflow.states
    });

    let currentState = machine.initialState;
    while (!currentState.done) {
      const meta = getMeta(machine, currentState);
      const action = this.actionsFactory.getAction(meta.type);

      const transitionEvent = await action(currentState.context, meta);

      currentState = machine.transition(currentState, transitionEvent);
    }
  }
}

export default XStateWorkflowRunner;
