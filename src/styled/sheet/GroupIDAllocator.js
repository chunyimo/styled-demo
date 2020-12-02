

import throwStyledError from '../utils/error';

const MAX_SMI = 1 << (31 - 1);

let groupIDRegister = new Map();
let reverseRegister = new Map();
let nextFreeGroup = 1;

export const resetGroupIds = () => {
  groupIDRegister = new Map();
  reverseRegister = new Map();
  nextFreeGroup = 1;
};

export const getGroupForId = (id) => {
  if (groupIDRegister.has(id)) {
    return (groupIDRegister.get(id));
  }

  while (reverseRegister.has(nextFreeGroup)) {
    nextFreeGroup++;
  }

  const group = nextFreeGroup++;

  if (process.env.NODE_ENV !== 'production' && ((group | 0) < 0 || group > MAX_SMI)) {
    throwStyledError(16, `${group}`);
  }

  groupIDRegister.set(id, group);
  reverseRegister.set(group, id);
  return group;
};

export const getIdForGroup = (group) => {
  return reverseRegister.get(group);
};

export const setGroupForId = (id, group) => {
  groupIDRegister.set(id, group);
  reverseRegister.set(group, id);
};
