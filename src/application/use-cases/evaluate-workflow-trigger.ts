import { ComparisonOperation } from "./../domain/comparison-operation";
import Event from "../domain/event";
import Workflow, { LogicalExpression } from "../domain/workflow";
import getComparisonOperationFunction from "./comparison-operations/get-comparison-operation-function";

const evaluateComparison = (event: Event) => (
  comparison: ComparisonOperation
) => {
  const comparisonFunction = getComparisonOperationFunction(comparison);
  return comparisonFunction(event.payload[comparison.field]);
};

const evaluateLogicalExpression = (
  expression: LogicalExpression,
  event: Event
): boolean => {
  if (expression.and) {
    return expression.and.every(evaluateComparison(event));
  } else if (expression.or) {
    return expression.or.some(evaluateComparison(event));
  } else {
    return true;
  }
};

const evaluateWorkflowTrigger = (workflow: Workflow, event: Event) =>
  workflow.triggers.some(({ eventName, expression }) => {
    if (eventName !== event.name) {
      return false;
    }

    return evaluateLogicalExpression(expression, event);
  });

export default evaluateWorkflowTrigger;
