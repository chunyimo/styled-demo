
import { SC_VERSION } from '../constants';
import StyleSheet from '../sheet';
import flatten from '../utils/flatten';
import generateName from '../utils/generateAlphabeticName';
import { hash, phash } from '../utils/hash';
import isStaticRules from '../utils/isStaticRules';

const SEED = hash(SC_VERSION);

/**
 * ComponentStyle is all the CSS-specific stuff, not the React-specific stuff.
 */
export default class ComponentStyle {
  baseHash;

  baseStyle;

  componentId;

  isStatic;

  rules;

  staticRulesId;

  constructor(rules, componentId, baseStyle) {
    this.rules = rules;
    this.staticRulesId = '';
    this.isStatic =
      process.env.NODE_ENV === 'production' &&
      (baseStyle === undefined || baseStyle.isStatic) &&
      isStaticRules(rules); // 所有的rule都是非函数的
    this.componentId = componentId;

    // SC_VERSION gives us isolation between multiple runtimes on the page at once
    // this is improved further with use of the babel plugin "namespace" feature
    this.baseHash = phash(SEED, componentId);

    this.baseStyle = baseStyle;

    // NOTE: This registers the componentId, which ensures a consistent order
    // for this component's styles compared to others
    StyleSheet.registerId(componentId);
  }

  /*
   * Flattens a rule set into valid CSS
   * Hashes it, wraps the whole chunk in a .hash1234 {}
   * Returns the hash to be injected on render()
   * */
  // executionContext 包括了context和props
  generateAndInjectStyles(executionContext, styleSheet, stylis) {
    const { componentId } = this;

    const names = [];

    if (this.baseStyle) {
      names.push(this.baseStyle.generateAndInjectStyles(executionContext, styleSheet, stylis));
    }

    // force dynamic classnames if user-supplied stylis plugins are in use
    if (this.isStatic && !stylis.hash) {
      if (this.staticRulesId && styleSheet.hasNameForId(componentId, this.staticRulesId)) {
        names.push(this.staticRulesId);
      } else {
        const cssStatic = flatten(this.rules, executionContext, styleSheet, stylis).join('');
        const name = generateName(phash(this.baseHash, cssStatic.length) >>> 0);

        if (!styleSheet.hasNameForId(componentId, name)) {
          const cssStaticFormatted = stylis(cssStatic, `.${name}`, undefined, componentId);
          styleSheet.insertRules(componentId, name, cssStaticFormatted);
        }

        names.push(name);
        this.staticRulesId = name;
      }
    } else {
      const { length } = this.rules;
      let dynamicHash = phash(this.baseHash, stylis.hash);
      let css = '';

      for (let i = 0; i < length; i++) {
        const partRule = this.rules[i];

        if (typeof partRule === 'string') {
          css += partRule;

          if (process.env.NODE_ENV !== 'production') dynamicHash = phash(dynamicHash, partRule + i);
        } else if (partRule) {
          const partChunk = flatten(partRule, executionContext, styleSheet, stylis);
          const partString = Array.isArray(partChunk) ? partChunk.join('') : partChunk;
          dynamicHash = phash(dynamicHash, partString + i);
          css += partString;
        }
      }

      if (css) {
        const name = generateName(dynamicHash >>> 0);

        if (!styleSheet.hasNameForId(componentId, name)) {
          // css
          /* 
            "
              background: transparent;
              border-radius: 3px;
              border: 2px undefined gray;
              color: gray;
              margin: 0 1em;
              padding: 0.25em 1em;
            "
          */


          // stylis预处理之后，生成css ，如
          // .kOMEcw{background:transparent;border-radius:3px;border:2px dashed gray;color:#75dddd;margin:0 1em;padding:0.25em 1em;}
    
          const cssFormatted = stylis(css, `.${name}`, undefined, componentId);
          // TODO 看到插入rules
          styleSheet.insertRules(componentId, name, cssFormatted);
        }

        names.push(name);
      }
    }

    return names.join(' ');
  }
}
