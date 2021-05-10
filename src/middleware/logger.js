const logger = store => next => action => {
  // console.group(action.type);
  // console.info("dispatching", action);
  let result = next(action);
  // console.info());
  // console.groupEnd();
  return result;
};

export default logger;
