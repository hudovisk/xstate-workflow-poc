import Event, {
  EventRequest,
  fromRequest,
  markAsSent,
  markAsFailed
} from "../domain/event";
import EventRepository from "../ports/event-repository";
import { ApplicationError } from "../domain/application-error";
import WorkflowRepository from "../ports/workflow-repository";
import WorkflowRunner from "../ports/workflow-runner";
import evaluateWorkflowTrigger from "./evaluate-workflow-trigger";
import Profile from "../domain/profile";
import ProfileRepository from "../ports/profile-repository";

class ReceiveEvent {
  constructor(
    private eventRepository: EventRepository,
    private profileRepository: ProfileRepository,
    private workflowRepository: WorkflowRepository,
    private workflowRunner: WorkflowRunner
  ) {}

  async process(request: EventRequest) {
    // 1. persist and guarantee idempotency
    const event = fromRequest(request);
    await this.eventRepository.create(event);

    // 2. get profile
    let profile: Profile | undefined;
    if (request.profileId) {
      profile = await this.profileRepository.getById(request.profileId);
    }

    // 3. get all triggered workflows
    const workflows = await this.workflowRepository.getAll();
    const workflowsTriggered = workflows.filter(workflow =>
      evaluateWorkflowTrigger(workflow, event)
    );

    // 4. run workflows and update event status
    const workflowRunPromises = workflowsTriggered.map(workflow =>
      this.workflowRunner
        .run(workflow, event, profile)
        .then(this.persistAsSent(event))
        .catch(this.persistAsFailed(event))
    );
    await Promise.all(workflowRunPromises);
  }

  private persistAsSent = (event: Event) => () => {
    let sentEvent = markAsSent(event);
    return this.eventRepository.update(sentEvent);
  };

  private persistAsFailed = (event: Event) => async (error: Error) => {
    let failedEvent;

    if (error instanceof ApplicationError) {
      failedEvent = markAsFailed(event, error.code);
    } else {
      failedEvent = markAsFailed(event, error.message);
    }

    await this.eventRepository.update(failedEvent);
  };
}

export default ReceiveEvent;
