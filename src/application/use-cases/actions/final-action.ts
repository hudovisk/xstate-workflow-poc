import { assertFinalStateNode } from "../../domain/workflow";
import Action from "../../domain/action";

type CreateFinalAction = () => Action;

const createFinalAction: CreateFinalAction = () => (_, state) => {
  assertFinalStateNode(state);

  return Promise.resolve({ type: "continue" });
};

export default createFinalAction;
