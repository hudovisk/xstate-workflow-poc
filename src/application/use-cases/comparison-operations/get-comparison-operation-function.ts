import {
  ComparisonOperator,
  ComparisonOperation
} from "../../domain/comparison-operation";
import eqOperation from "./eq-operation";
import existsOperation from "./exists-operation";

type ComparisonFunction = (contextValue: string) => boolean;
type ComparisonOperatorFunction = (value: string) => ComparisonFunction;

function negate<T extends Function>(fn: T) {
  return (...args) => !fn(...args);
}

const OPERATOR_FUNCTIONS: Record<
  ComparisonOperator,
  ComparisonOperatorFunction
> = {
  eq: eqOperation,
  exists: existsOperation
};

function getComparisonOperationFunction({
  operator,
  value,
  inverse
}: ComparisonOperation): ComparisonFunction {
  const operatorFunction = OPERATOR_FUNCTIONS[operator](value);
  if (inverse) {
    return negate(operatorFunction);
  }

  return operatorFunction;
}

export default getComparisonOperationFunction;
