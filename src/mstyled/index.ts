import { ReactElement } from "react";

const templateFunction = (...cssRules) => {};
const componentConstructor = (
  element: string | ReactElement,
  cssRules: string[]
) => {};
const css: (cssStr: string[]) => string[] = (cssStr) => [];
const makeTemplateFunction = (element: string | ReactElement) => {
  const templateFunction = (...cssStr: string[]) => {
    componentConstructor(element, css(cssStr));
  };
};
const mstyled = (element: string | ReactElement) => {};
