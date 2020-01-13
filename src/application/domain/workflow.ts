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

export type StateType = "conditional_branch" | "send_event";
export interface StateMeta {
  type: StateType;
}

export interface SendEventStateMeta extends StateMeta {
  type: "send_event";
  eventId: string;
  eventProvider: "adobe";
}

export interface ConditionalBranchStateMeta extends StateMeta {
  type: "conditional_branch";
  conditions: ComparisonOperation[];
}

export interface StateSchema {
  meta: StateMeta;
}

export type StateMachineEvent = "continue" | string;

export interface StateMachine {
  [name: string]: {
    meta?: StateMeta;
    type?: "final";
    on?: Record<StateMachineEvent, string>;
  };
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

function assertMeta(meta: StateMeta, expectedType: StateType) {
  if (meta.type !== expectedType) {
    throw new AssertionError({
      message: "StateMeta type mismatch",
      actual: meta.type,
      expected: expectedType
    });
  }
}

export function assertSendEventMeta(meta): asserts meta is SendEventStateMeta {
  assertMeta(meta, "send_event");
}

export function assertConditionalBranchMeta(
  meta
): asserts meta is ConditionalBranchStateMeta {
  assertMeta(meta, "conditional_branch");
}
