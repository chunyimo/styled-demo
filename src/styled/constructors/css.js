
import interleave from '../utils/interleave';
import isPlainObject from '../utils/isPlainObject';
import { EMPTY_ARRAY } from '../utils/empties';
import isFunction from '../utils/isFunction';
import flatten from '../utils/flatten';
// interpolations 表示插值，利用tag template 自动分离的特性。
export default function css(styles, ...interpolations) {
  if (isFunction(styles) || isPlainObject(styles)) {
    return flatten(interleave(EMPTY_ARRAY, [styles, ...interpolations]));
  }

  if (interpolations.length === 0 && styles.length === 1 && typeof styles[0] === 'string') {
    return styles;
  }
  return flatten(interleave(styles, interpolations));
}
