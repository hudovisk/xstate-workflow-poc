import Workflow from "../../../application/domain/workflow";
import EmailConfirmedMyAccount from "./email-confirmed-myaccount-workflow.json";
import EmailConfirmedGo from "./email-confirmed-go-workflow.json";

const workflows: Workflow[] = [
  (EmailConfirmedMyAccount as any) as Workflow,
  (EmailConfirmedGo as any) as Workflow
];

export default workflows;
