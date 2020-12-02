
import { typeOf } from 'react-is';

export default (x) =>
  x !== null &&
  typeof x === 'object' &&
  (x.toString ? x.toString() : Object.prototype.toString.call(x)) === '[object Object]' &&
  !typeOf(x);
