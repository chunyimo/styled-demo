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
  const templateFunction = (...args) => componentConstructor(tag, options, css(...args));

  /* If config methods are called, wrap up a new template function and merge options */
  templateFunction.withConfig = config =>
    constructWithOptions(componentConstructor, tag, { ...options, ...config });

  /* Modify/inject new props at runtime */
  templateFunction.attrs = attrs =>
    constructWithOptions(componentConstructor, tag, {
      ...options,
      attrs: Array.prototype.concat(options.attrs, attrs).filter(Boolean),
    });

  return templateFunction;
}
