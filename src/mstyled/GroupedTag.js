
/** Create a GroupedTag with an underlying Tag implementation */
export const makeGroupedTag = (tag) => {
  return new DefaultGroupedTag(tag);
};

const BASE_SIZE = 1 << 9; // 512

class DefaultGroupedTag  {
  groupSizes;

  length;

  tag;

  constructor(tag) {
    this.groupSizes = new Uint32Array(BASE_SIZE);
    this.length = BASE_SIZE;
    this.tag = tag;
  }

  indexOfGroup(group) {
    let index = 0;
    for (let i = 0; i < group; i++) {
      index += this.groupSizes[i];
    }

    return index;
  }
  // group是一个数值，如果表示的是同一个生命，rules不一样，但group是一样的
  // 如
  // .kMTGzd { background: transparent; border-radius: 3px; color: gray; margin: 0px 1em; padding: 0.25em 1em; }
  // .kOMEcw { background: transparent; border-radius: 3px; border: 2px dashed gray; color: rgb(117, 221, 221); margin: 0px 1em; padding: 0.25em 1em; } 
  // ? 是如何保证顺序的
  insertRules(group, rules) {
    // groupSizes扩展
    // if (group >= this.groupSizes.length) {
    //   const oldBuffer = this.groupSizes;
    //   const oldSize = oldBuffer.length;

    //   let newSize = oldSize;
    //   while (group >= newSize) {
    //     newSize <<= 1;
    //     if (newSize < 0) {
    //       throwStyledError(16, `${group}`);
    //     }
    //   }

    //   this.groupSizes = new Uint32Array(newSize);
    //   this.groupSizes.set(oldBuffer);
    //   this.length = newSize;

    //   for (let i = oldSize; i < newSize; i++) {
    //     this.groupSizes[i] = 0;
    //   }
    // }

    let ruleIndex = this.indexOfGroup(group + 1);

    if (Array.isArray(rules)) {
      for (let i = 0, l = rules.length; i < l; i++) {
        if (this.tag.insertRule(ruleIndex, rules[i])) {
          this.groupSizes[group]++;
          ruleIndex++;
        }
      }
    } else {
      if (this.tag.insertRule(ruleIndex, rules)) {
        this.groupSizes[group]++;
      }
    }
  }
}
