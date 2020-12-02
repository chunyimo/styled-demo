// 

// /** CSSStyleSheet-like Tag abstraction for CSS rules */
// export interface Tag {
//   constructor(target?: HTMLElement): void;
//   insertRule(index: number, rule);
//   deleteRule(index: number): void;
//   getRule(index: number);
//   length: number;
// }

// /** Group-aware Tag that sorts rules by indices */
// export interface GroupedTag {
//   constructor(tag: Tag): void;
//   insertRules(group: number, rules | string[]): void;
//   clearGroup(group: number): void;
//   getGroup(group: number);
//   length: number;
// }

// export type SheetOptions = {
//   isServer,
//   target?: HTMLElement,
//   useCSSOMInjection,
// };

// export interface Sheet {
//   allocateGSInstance(id): number;
//   clearNames(id): void;
//   clearRules(id): void;
//   clearTag(): void;
//   getTag(): GroupedTag;
//   hasNameForId(id, name);
//   insertRules(id, name, rules | string[]): void;
//   options: SheetOptions;
//   names: Map<string, Set<string>>;
//   registerName(id, name): void;
//   toString();
// }
