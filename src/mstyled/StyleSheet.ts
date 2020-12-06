// type SheetConstructorArgs = {
//   isServer?,
//   useCSSOMInjection?,
//   target?: HTMLElement,
// };

import { makeGroupedTag } from "./GroupedTag";
import { getGroupForId } from "./GroupId";
import { makeTag } from "./Tag";

// type GlobalStylesAllocationMap = { [key]: number };
// type NamesAllocationMap = Map<string, Set<string>>;

/** Contains the main stylesheet logic for stringification and caching */
export default class StyleSheet {
  gs;

  names: any;

  options: any;

  tag: any;

  /** Register a group ID to give it an index */
  static registerId(id: string) {
    return getGroupForId(id);
  }

  constructor(
    options = {},
    globalStyles = {},
    names: any
  ) {
    this.options = {
      ...options,
    };

    this.gs = globalStyles;
    this.names = new Map(names);
  }




  /** Lazily initialises a GroupedTag for when it's actually needed */
  getTag() {
    const _thisTag = this.tag;
    // makeTag返回一个包含style标签的CSSOMTag
    return this.tag || (this.tag = makeGroupedTag(makeTag(this.options)));
  }

  /** Check whether a name is known for caching */
  hasNameForId(id: string, name: string) {
    return this.names.has(id) && (this.names.get(id)).has(name);
  }

  /** Mark a group's name as known for caching */
  registerName(id: string, name: string) {
    getGroupForId(id);

    if (!this.names.has(id)) {
      const groupNames = new Set();
      groupNames.add(name);
      this.names.set(id, groupNames);
    } else {
      (this.names.get(id)).add(name);
    }
  }

  /** Insert new rules which also marks the name as known */
  // TODO 如何插入CSS
  //  styleSheet.insertRules(componentId, name, cssFormatted);
  insertRules(id: string, name: string, rules: string) {
    this.registerName(id, name);
    // 此处id 即为componentId，在样式声明时就已经确定好了
    this.getTag().insertRules(getGroupForId(id), rules);
  }
}
