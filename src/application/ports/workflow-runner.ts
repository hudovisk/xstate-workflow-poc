import Event from "../domain/event";
import Workflow from "../domain/workflow";
import Profile from "../domain/profile";

interface WorkflowRunner {
  run(workflow: Workflow, event: Event, profile?: Profile): Promise<void>;
}

export default WorkflowRunner;
