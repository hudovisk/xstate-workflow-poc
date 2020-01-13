import Workflow from "../domain/workflow";

interface WorkflowRepository {
  getAll(): Promise<Workflow[]>;
}

export default WorkflowRepository;
