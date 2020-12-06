
import validAttr from '@emotion/is-prop-valid';
import React, { createElement, type , useContext, useDebugValue } from 'react';
import { SC_VERSION } from '../constants';
import determineTheme from '../utils/determineTheme';
import domElements from '../utils/domElements';
import { EMPTY_ARRAY, EMPTY_OBJECT } from '../utils/empties';
import escape from '../utils/escape';
import generateComponentId from '../utils/generateComponentId';
import generateDisplayName from '../utils/generateDisplayName';
import isFunction from '../utils/isFunction';
import isStyledComponent from '../utils/isStyledComponent';
import isTag from '../utils/isTag';
import joinStrings from '../utils/joinStrings';
import ComponentStyle from './ComponentStyle';
import { useStyleSheet, useStylis } from './StyleSheetManager';
import { ThemeContext } from './ThemeProvider';

const identifiers = {};

/* We depend on components having unique IDs */
function generateId(displayName, parentComponentId) {
  const name = typeof displayName !== 'string' ? 'sc' : escape(displayName);
  // Ensure that no displayName can lead to duplicate componentIds
  identifiers[name] = (identifiers[name] || 0) + 1;
  const _SC_VERSION = SC_VERSION;
  const componentId = `${name}-${generateComponentId(
    // SC_VERSION gives us isolation between multiple runtimes on the page at once
    // this is improved further with use of the babel plugin "namespace" feature
    _SC_VERSION + name + identifiers[name]
  )}`;

  return parentComponentId ? `${parentComponentId}-${componentId}` : componentId;
}

/**
 *? 不知道这个函数是干什么的？
 *
 * @param {*} [theme=EMPTY_OBJECT]
 * @param {*} props
 * @param {*} [attrs=[]]
 * @return {*} 
 */
function useResolvedAttrs(theme = EMPTY_OBJECT, props, attrs = []) {
  // NOTE: can't memoize this
  // returns [context, resolvedAttrs]
  // where resolvedAttrs is only the things injected by the attrs themselves
  const context = { ...props, theme };
  const resolvedAttrs = {};
  if (attrs) {
    attrs.forEach(attrDef => {
    let resolvedAttrDef = attrDef;
    let key;

    if (isFunction(resolvedAttrDef)) {
      resolvedAttrDef = resolvedAttrDef(context);
    }

    /* eslint-disable guard-for-in */
    for (key in resolvedAttrDef) {
      context[key] = resolvedAttrs[key] =
        key === 'className'
          ? joinStrings(resolvedAttrs[key], resolvedAttrDef[key])
          : resolvedAttrDef[key];
    }
    /* eslint-enable guard-for-in */
  });
  }
  

  return [context, resolvedAttrs];
}

function useInjectedStyle(
  componentStyle, // 组件的样式信息
  isStatic,
  resolvedAttrs, // context 包括theme props
  warnTooManyClasses
) {
  // 获取styleSheet，一个空的styleSheet模板
  const styleSheet = useStyleSheet();
  const stylis = useStylis();

  const className = isStatic
    ? componentStyle.generateAndInjectStyles(EMPTY_OBJECT, styleSheet, stylis)
    : componentStyle.generateAndInjectStyles(resolvedAttrs, styleSheet, stylis);
  return className;
}
// 该函数在组件渲染的时候会执行
function useStyledComponentImpl(
  forwardedComponent,
  props,
  forwardedRef,
  isStatic
) {
  const {
    attrs: componentAttrs,
    componentStyle, // 组件的样式信息
    defaultProps,
    foldedComponentIds,
    shouldForwardProp,
    styledComponentId,
    target,
  } = forwardedComponent;
  
  // eslint-disable-next-line react-hooks/rules-of-hooks
  if (process.env.NODE_ENV !== 'production') useDebugValue(styledComponentId);

  // NOTE: the non-hooks version only subscribes to this when !componentStyle.isStatic,
  // but that'd be against the rules-of-hooks. We could be naughty and do it anyway as it
  // should be an immutable value, but behave for now.
  /**
   * 决定theme的由来 
   * @type {*} */
  const theme = determineTheme(props, useContext(ThemeContext), defaultProps);
  // attrs 可以认为是css attr函数的处理
  const [context, attrs] = useResolvedAttrs(theme || EMPTY_OBJECT, props, componentAttrs);

  const generatedClassName = useInjectedStyle(
    componentStyle,
    isStatic,
    context,
    process.env.NODE_ENV !== 'production' ? forwardedComponent.warnTooManyClasses : undefined
  );

  const refToForward = forwardedRef;
  const elementToBeCreated =  target;
  // const elementToBeCreated = target;

  const isTargetTag = isTag(elementToBeCreated);
  const computedProps = attrs !== props ? { ...props, ...attrs } : props;
  const propsForElement = {};

  // eslint-disable-next-line guard-for-in
  for (const key in computedProps) {
      // Don't pass through non HTML tags through to HTML elements
      propsForElement[key] = computedProps[key];
  }

  if (props.style && attrs.style !== props.style) {
    propsForElement.style = { ...props.style, ...attrs.style };
  }
  // 主要是加上className
  propsForElement[
    // handle custom elements which React doesn't properly alias
    isTargetTag && domElements.indexOf(elementToBeCreated) === -1 ? 'class' : 'className'
  ] = foldedComponentIds
    .concat(
      styledComponentId,
      generatedClassName !== styledComponentId ? generatedClassName : null,
      props.className,
      attrs.className
    )
    .filter(Boolean)
    .join(' ');

  propsForElement.ref = refToForward;

  return createElement(elementToBeCreated, propsForElement);
}
// componentConstructor 相当于 styled.button
/*
templateFunction 相当于 styled.button
const templateFunction = (...args) => {
  return createStyledComponent(tag, options, css(...args));
} 

*/
export default function createStyledComponent(
  target,
  options,
  rules   // css 样式相关的
) {
  // 根据styleComponentId的值的有无来判断是否是styledComponent，即已经是被styled过了的
  const isTargetStyledComp = isStyledComponent(target);
  // 是否是原生的dom元素
  const isCompositeComponent = !isTag(target);

  const {
    attrs = EMPTY_ARRAY,
    componentId = generateId(options.displayName, options.parentComponentId),
    displayName = generateDisplayName(target),
  } = options;

  const styledComponentId =
    options.displayName && options.componentId
      ? `${escape(options.displayName)}-${options.componentId}`
      : options.componentId || componentId;

  // fold the underlying StyledComponent attrs up (implicit extend)
  // 和css attr挂钩，
  const finalAttrs =
    isTargetStyledComp && ((target)).attrs
      ? ((target)).attrs.concat(attrs).filter(Boolean) : null
      ;

  // 记录style信息的实例,在声明组件样式的时候，就记录了该信息
  const componentStyle = new ComponentStyle(
    rules,
    styledComponentId,
    isTargetStyledComp ? ((target).componentStyle) : undefined
  );

  // statically styled-components don't need to build an execution context object,
  // and shouldn't be increasing the number of class names
  const isStatic = componentStyle.isStatic && attrs.length === 0;

  /**
   * forwardRef creates a new interim（中间的，临时的） component, which we'll take advantage of
   * instead of extending ParentComponent to create _another_ interim class
   */
  let WrappedStyledComponent;

  const forwardRef = (props, ref) =>
    // eslint-disable-next-line
    useStyledComponentImpl(WrappedStyledComponent, props, ref, isStatic);

  forwardRef.displayName = displayName;
  // 使用高阶组件进行包裹，将声明的样式保存在比包之中，当组件渲染的时候，将样式插入style sheet。
  WrappedStyledComponent = ((React.forwardRef(forwardRef)));
  WrappedStyledComponent.attrs = finalAttrs;
  WrappedStyledComponent.componentStyle = componentStyle;
  WrappedStyledComponent.displayName = displayName;

  // this static is used to preserve the cascade of static classes for component selector
  // purposes; this is especially important with usage of the css prop
  WrappedStyledComponent.foldedComponentIds = isTargetStyledComp
    ? ((target)).foldedComponentIds.concat(
        ((target)).styledComponentId
      )
    : EMPTY_ARRAY;

  WrappedStyledComponent.styledComponentId = styledComponentId;

  // fold the underlying StyledComponent target up since we folded the styles
  WrappedStyledComponent.target = isTargetStyledComp
    ? ((target)).target
    : target;
  return WrappedStyledComponent;
}
