import { ReactElement } from "react";

const templateFunction = (...cssRules: string[]) => {};
const componentConstructor = (
  element: string | ReactElement,
  cssRules: (string | Function)[]
) => {
  const styleInfo = {
    componentId: Math.random().toString(32).slice(2),
    cssRules:cssRules,
  }
};
const interleave =  (
  strings: string[],
  interpolations: Function[]
) => {
  const cssRules: Array<string|Function> = [strings[0]];

  for (let i = 0, len = interpolations.length; i < len; i += 1) {
    cssRules.push(interpolations[i], strings[i + 1]);
  }

  return cssRules;
};
export const flatten = (
  cssRules: Array<string | Function>,
  executionContext: Record<string, any> = {}
) => {
  const ruleSet: Array<string> = [];
    for (let i = 0 ; i < cssRules.length; i += 1) {
      if (typeof cssRules[i] === 'string') ruleSet.push(cssRules[i] as string);
      if (typeof cssRules[i] === 'function') ruleSet.push((cssRules[i] as Function)(executionContext));
    }

    return ruleSet;
}

const css: (styles: string[], ...interpolations: Function[]) => (string|Function)[] = (styles, ...interpolations) => {
  if (interpolations.length === 0 && styles.length === 1 && typeof styles[0] === 'string') {
    return styles;
  }
  return interleave(styles, interpolations);
};
const makeTemplateFunction = (element: string | ReactElement) => {
  const templateFunction = (...cssStr: any[]) => {
    componentConstructor(element, css(cssStr));
  };
};
const mstyled = (element: string | ReactElement) => {};
