import { expect } from "chai";
import sinon from "sinon";
import { stubInterface } from "ts-sinon";
import ReceiveEvent from "../../src/application/use-cases/receive-event";
import StaticWorkflowRepository from "../../src/infra/adapters/static-workflow-repository";
import EventRepository from "../../src/application/ports/event-repository";
import ProfileRepository from "../../src/application/ports/profile-repository";
import XStateWorkflowRunner from "../../src/infra/adapters/xstate-workflow-runner";
import ActionFactory from "../../src/application/use-cases/actions/action-factory";

describe("receive-email-confirmed-neobank", () => {
  it("should send email event to BR", async () => {
    const workflowRepository = new StaticWorkflowRepository();
    const eventRepository = stubInterface<EventRepository>();
    const profileRepository = stubInterface<ProfileRepository>();
    const eventSender = sinon.mock().resolves();
    const actionFactory = new ActionFactory(eventSender);
    const workflowRunner = new XStateWorkflowRunner(actionFactory);
    const receiveEvent = new ReceiveEvent(
      eventRepository,
      profileRepository,
      workflowRepository,
      workflowRunner
    );

    profileRepository.getById.resolves({ country_residence: "Br" });
    const promise = receiveEvent.process({
      name: "email_confirmed",
      createdAt: new Date().toISOString(),
      profileId: "123",
      payload: {
        __project: "neo"
      }
    });

    await expect(promise).to.be.fulfilled;
    expect(eventSender).to.be.calledOnce;
    expect(eventSender).to.be.calledWith("AdobeEmailNeoEvtBR");
  });

  it("should send email event to MX", async () => {
    const workflowRepository = new StaticWorkflowRepository();
    const eventRepository = stubInterface<EventRepository>();
    const profileRepository = stubInterface<ProfileRepository>();
    const eventSender = sinon.mock().resolves();
    const actionFactory = new ActionFactory(eventSender);
    const workflowRunner = new XStateWorkflowRunner(actionFactory);
    const receiveEvent = new ReceiveEvent(
      eventRepository,
      profileRepository,
      workflowRepository,
      workflowRunner
    );

    profileRepository.getById.resolves({ country_residence: "mx" });
    const promise = receiveEvent.process({
      name: "email_confirmed",
      createdAt: new Date().toISOString(),
      profileId: "123",
      payload: {
        __project: "neo"
      }
    });

    await expect(promise).to.be.fulfilled;
    expect(eventSender).to.be.calledOnce;
    expect(eventSender).to.be.calledWith("AdobeEmailNeoEvtMX");
  });
});
