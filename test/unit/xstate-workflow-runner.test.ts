import { expect } from "chai";
import XStateWorkflowRunner from "../../src/infra/adapters/xstate-workflow-runner";
import ActionFactory from "../../src/application/use-cases/actions/action-factory";

import EmailConfirmedMyAccountWorkflow from "../../src/infra/adapters/workflows/email-confirmed-myaccount-workflow.json";
import Workflow from "../../src/application/domain/workflow";
import Event from "../../src/application/domain/event";
import Profile from "../../src/application/domain/profile";

describe("xstate-workflow-runner", () => {
  it("should run workflow", async () => {
    const eventSender = () => Promise.resolve();
    const actionFactory = new ActionFactory(eventSender);
    const workflowRunner = new XStateWorkflowRunner(actionFactory);

    const workflow: Workflow = EmailConfirmedMyAccountWorkflow as any;
    const event: Event = {
      name: "email_confirmed",
      createdAt: new Date().toISOString(),
      requestCreatedAt: new Date().toISOString(),
      status: "CREATED",
      statusReason: "",
      payload: {},
      profileId: "123"
    };
    const profile: Profile = {
      country_residence: "br"
    };
    const promise = workflowRunner.run(workflow, event, profile);

    await expect(promise).to.be.fulfilled;
  });
});
