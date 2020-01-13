const caseNormalization = value =>
  typeof value === "string" ? value.toUpperCase() : value;

const createEqOperation = (attribute: any) => (value: any) => {
  const lhs = caseNormalization(attribute);
  const rhs = caseNormalization(value);

  return lhs === rhs;
};

export default createEqOperation;
