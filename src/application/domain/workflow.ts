import { ComparisonOperation } from "./comparison-operation";
import Profile from "./profile";
import Event from "./event";
import { AssertionError } from "assert";

export type LogicalOperation = "and" | "or";
export type LogicalExpression = Record<LogicalOperation, ComparisonOperation[]>;

export interface StateMachineContext {
  attributes: Profile | {};
  event_attributes: Event | {};
}

export type StateNodeType =
  | "conditional_branch"
  | "send_event"
  | "final"
  | "start";

export interface SendEventStateNode extends StateNode {
  type: "send_event";
  eventId: string;
  eventProvider: "adobe";
}

export interface ConditionalBranchStateNode extends StateNode {
  type: "conditional_branch";
  conditions: ComparisonOperation[];
}

export type StateNodes = ConditionalBranchStateNode | SendEventStateNode;

export type StateMachineEvent = "continue" | string;

export interface StateNode {
  type: StateNodeType;
  on?: Record<StateMachineEvent, string>;
}

export interface StateMachine {
  [name: string]: StateNode;
}

export interface Trigger {
  eventName: string;
  expression: LogicalExpression;
}

export default interface Workflow {
  id: string;
  triggers: Trigger[];
  initialState: string;
  context: StateMachineContext;
  states: StateMachine;
}

function assertStateNode(state: StateNode, expectedType: StateNodeType) {
  if (state.type !== expectedType) {
    throw new AssertionError({
      message: "StateNode type mismatch",
      actual: state.type,
      expected: expectedType
    });
  }
}

export function assertSendEventStateNode(
  state: StateNode
): asserts state is SendEventStateNode {
  assertStateNode(state, "send_event");
}

export function assertConditionalBranchStateNode(
  state: StateNode
): asserts state is ConditionalBranchStateNode {
  assertStateNode(state, "conditional_branch");
}

export function assertFinalStateNode(
  state: StateNode
): asserts state is ConditionalBranchStateNode {
  assertStateNode(state, "final");
}

export function assertStartStateNode(
  state: StateNode
): asserts state is ConditionalBranchStateNode {
  assertStateNode(state, "start");
}
