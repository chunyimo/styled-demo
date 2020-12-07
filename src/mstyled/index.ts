import React from "react";
import { ReactElement } from "react";
import ComponentStyle from "./ComponentStyles";
import { useStyleSheet } from "./StyleSheetManager";

const templateFunction = (...cssRules: string[]) => {};
function useInjectedStyle(
  componentStyle: any, // 组件的样式信息
  resolvedAttrs: any // context 包括theme props
) {
  // 获取styleSheet，一个空的styleSheet模板
  const styleSheet = useStyleSheet();
  const className = componentStyle.generateAndInjectStyles(
    resolvedAttrs,
    styleSheet
  );
  return className;
}
// 该函数在组件渲染的时候会执行
function useStyledComponentImpl(
  forwardedComponent: any,
  props: any,
  forwardedRef: any
) {
  const {
    componentStyle, // 组件的样式信息
    defaultProps,
    componentId,
    foldedComponentIds,
    target,
  } = forwardedComponent;

  const generatedClassName = useInjectedStyle(componentStyle, props);

  const refToForward = forwardedRef;
  const elementToBeCreated = target;

  const computedProps = props;
  const propsForElement: any = {};

  // eslint-disable-next-line guard-for-in
  for (const key in computedProps) {
    // Don't pass through non HTML tags through to HTML elements
    propsForElement[key] = computedProps[key];
  }

  // 主要是加上className
  propsForElement["className"] = foldedComponentIds
    .concat(componentId, props.className, generatedClassName)
    .filter(Boolean)
    .join(" ");

  propsForElement.ref = refToForward;
  const createdElement = React.createElement(
    elementToBeCreated,
    propsForElement
  );
  return React.createElement(elementToBeCreated, propsForElement);
}
const componentConstructor = (
  element: string | ReactElement,
  cssRules: (string | Function)[]
) => {
  const componentId = Math.random().toString(32).slice(2);
  const componentStyle = new ComponentStyle(cssRules, componentId);
  let WrappedStyledComponent: any;

  const forwardRef = (props: any, ref: any) =>
    // eslint-disable-next-line
    useStyledComponentImpl(WrappedStyledComponent, props, ref);

  // 使用高阶组件进行包裹，将声明的样式保存在比包之中，当组件渲染的时候，将样式插入style sheet。
  WrappedStyledComponent = React.forwardRef(forwardRef);
  WrappedStyledComponent.componentStyle = componentStyle;
  WrappedStyledComponent.componentId = componentId;
  WrappedStyledComponent.target = element;
  WrappedStyledComponent.foldedComponentIds = [];
  return WrappedStyledComponent;
};
const interleave = (strings: string[], interpolations: Function[]) => {
  const cssRules: Array<string | Function> = [strings[0]];

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
  for (let i = 0; i < cssRules.length; i += 1) {
    if (typeof cssRules[i] === "string") ruleSet.push(cssRules[i] as string);
    if (typeof cssRules[i] === "function")
      ruleSet.push((cssRules[i] as Function)(executionContext));
  }

  return ruleSet;
};

const css: (
  styles: string[],
  ...interpolations: Function[]
) => (string | Function)[] = (styles, ...interpolations) => {
  if (
    interpolations.length === 0 &&
    styles.length === 1 &&
    typeof styles[0] === "string"
  ) {
    return styles;
  }
  return interleave(styles, interpolations);
};
const makeTemplateFunction = (element: string | ReactElement) => {
  const templateFunction = (...cssStr: any[]) => {
    return componentConstructor(element, css(cssStr));
  };
  return templateFunction;
};
const mstyled = (element: string | ReactElement) => {
  const templateFunction = (styles: any, ...interpolations: Function[]) => {
    return componentConstructor(element, css([...styles], ...interpolations));
  };
  return templateFunction;
};

export default mstyled;
