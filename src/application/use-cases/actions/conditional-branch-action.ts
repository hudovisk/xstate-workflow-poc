import { ComparisonOperation } from "./../../domain/comparison-operation";
import {
  assertConditionalBranchMeta,
  StateMachineContext
} from "./../../../application/domain/workflow";
import Action from "../../domain/action";
import getComparisonOperationFunction from "../comparison-operations/get-comparison-operation-function";

const getContextValue = (
  context: StateMachineContext,
  { type, field }: ComparisonOperation
): string => {
  if (type === "attribute") {
    return context.attributes[field];
  } else if (type === "event_attribute") {
    return context.event_attributes[field];
  }
};

const evaluate = (
  context: StateMachineContext,
  condition: ComparisonOperation
) => {
  const contextValue = getContextValue(context, condition);
  const comparisonFunction = getComparisonOperationFunction(condition);

  return comparisonFunction(contextValue);
};

type CreateConditionalBranchAction = () => Action;
const createConditionalBranchAction: CreateConditionalBranchAction = () => async (
  context,
  meta
) => {
  assertConditionalBranchMeta(meta);

  for (const [idx, condition] of meta.conditions.entries()) {
    if (evaluate(context, condition)) {
      return { type: idx.toString() };
    }
  }

  return { type: meta.conditions.length.toString() };
};

export default createConditionalBranchAction;
