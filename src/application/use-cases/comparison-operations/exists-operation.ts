const createExistsOperation = (attribute: any) => () => {
  return attribute !== undefined && attribute !== null;
};

export default createExistsOperation;
