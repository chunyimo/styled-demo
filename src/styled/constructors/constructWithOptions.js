import { isValidElementType } from 'react-is';
import css from './css';
import throwStyledError from '../utils/error';
import { EMPTY_OBJECT } from '../utils/empties';


export default function constructWithOptions(
  componentConstructor,
  tag,
  options = EMPTY_OBJECT
) {
  // 使用react-is库来判断是否是React类型
  if (!isValidElementType(tag)) {
    return throwStyledError(1, String(tag));
  }

  /* This is callable directly as a template function */
  // $FlowFixMe: Not typed to avoid destructuring arguments
  // tag template 函数将传入的字符串拆分为字符串和插值，需要重新将他们组合成一个有序的数组，css就是在干这个事
  // templateFunction执行后 返回一个高阶函数。该高阶函数用于转发处理props，根据props实时渲染出组件样式。
  const templateFunction = (...args) => {
    return componentConstructor(tag, options, css(...args));
  } 

  /* If config methods are called, wrap up a new template function and merge options */
  templateFunction.withConfig = config =>
    constructWithOptions(componentConstructor, tag, { ...options, ...config });

  /* Modify/inject new props at runtime */
  templateFunction.attrs = attrs => {
    console.log("attrs:", attrs);
    return constructWithOptions(componentConstructor, tag, {
      ...options,
      attrs: Array.prototype.concat(options.attrs, attrs).filter(Boolean),
    });
  }
    

  return templateFunction;
}
