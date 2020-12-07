import StyleSheet from "./StyleSheet";
import { hash } from "./hash";
/**
 * ComponentStyle is all the CSS-specific stuff, not the React-specific stuff.
 */
export default class ComponentStyle {
  componentId;
  rules;
  constructor(rules: (string | Function)[], componentId: string) {
    this.rules = rules;
    this.componentId = componentId;
    StyleSheet.registerId(componentId);
  }

  /*
   * Flattens a rule set into valid CSS
   * Hashes it, wraps the whole chunk in a .hash1234 {}
   * Returns the hash to be injected on render()
   * */
  // executionContext 包括了context和props
  generateAndInjectStyles(executionContext: any, styleSheet: any) {
    const { componentId, rules: cssRules } = this;

    const ruleSet: Array<string> = [];
    for (let i = 0; i < cssRules.length; i += 1) {
      if (typeof cssRules[i] === "string") {
        ruleSet.push(cssRules[i] as string);
      }
      if (typeof cssRules[i] === "function") {
        ruleSet.push((cssRules[i] as Function)(executionContext));
      }
    }
    const css: string = ruleSet.join("");
    const name = "mstyled" + hash(css);
    if (css) {
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

        const cssFormatted = `.${name}` + `{${css}}`;
        // TODO 看到插入rules
        styleSheet.insertRules(componentId, name, cssFormatted);
      }
    }
    return name;
  }
}
