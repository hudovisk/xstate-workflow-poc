export type ComparisonOperator = "eq" | "exists";
export type ComparisonType = "attribute" | "event_attribute";
export interface ComparisonOperation {
  field: string;
  operator: ComparisonOperator;
  value?: string;
  type: ComparisonType;
  inverse?: boolean;
}
