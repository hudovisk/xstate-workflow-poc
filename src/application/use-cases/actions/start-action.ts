import { assertStartStateNode } from "../../domain/workflow";
import Action from "../../domain/action";

type CreateStartAction = () => Action;

const createStartAction: CreateStartAction = () => (_, state) => {
  assertStartStateNode(state);

  return Promise.resolve({ type: "continue" });
};

export default createStartAction;
