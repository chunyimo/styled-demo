
// Helper to call a given function, only once
export default (cb) => {
  let called = false;

  // $FlowFixMe this works if F is "(...any[]) => any" but that would imply the return value si forwarded
  return (...args) => {
    if (!called) {
      called = true;
      cb(...args);
    }
  };
};
