
import StyleSheet from '../sheet';
import throwStyledError from '../utils/error';
import { masterStylis } from './StyleSheetManager';

export default class Keyframes {
  id;

  name;

  rules;

  constructor(name, rules) {
    this.name = name;
    this.id = `sc-keyframes-${name}`;
    this.rules = rules;
  }

  inject = (styleSheet, stylisInstance = masterStylis) => {
    const resolvedName = this.name + stylisInstance.hash;

    if (!styleSheet.hasNameForId(this.id, resolvedName)) {
      styleSheet.insertRules(
        this.id,
        resolvedName,
        stylisInstance(this.rules, resolvedName, '@keyframes')
      );
    }
  };

  toString = () => {
    return throwStyledError(12, String(this.name));
  };

  getName(stylisInstance = masterStylis) {
    return this.name + stylisInstance.hash;
  }
}
