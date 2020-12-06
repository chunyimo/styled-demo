let groupIDRegister = new Map();
let reverseRegister = new Map();
let nextFreeGroup = 1;

export const resetGroupIds = () => {
  groupIDRegister = new Map();
  reverseRegister = new Map();
  nextFreeGroup = 1;
};

export const getGroupForId = (id: string) => {
  if (groupIDRegister.has(id)) {
    return (groupIDRegister.get(id));
  }

  while (reverseRegister.has(nextFreeGroup)) {
    nextFreeGroup++;
  }

  const group = nextFreeGroup++;
  groupIDRegister.set(id, group);
  reverseRegister.set(group, id);
  return group;
};

export const getIdForGroup = (group: number) => {
  return reverseRegister.get(group);
};

export const setGroupForId = (id: string, group: number) => {
  groupIDRegister.set(id, group);
  reverseRegister.set(group, id);
};

export default {};