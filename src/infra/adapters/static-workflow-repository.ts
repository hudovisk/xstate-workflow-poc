import WorkflowRepository from "../../application/ports/workflow-repository";
import workflows from "./workflows";

class StaticWorkflowRepository implements WorkflowRepository {
  getAll() {
    return Promise.resolve(workflows);
  }
}

export default StaticWorkflowRepository;
