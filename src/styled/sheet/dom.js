

import { SC_ATTR, SC_ATTR_ACTIVE, SC_ATTR_VERSION, SC_VERSION } from '../constants';
import getNonce from '../utils/nonce';
import throwStyledError from '../utils/error';

const ELEMENT_TYPE = 1; /* Node.ELEMENT_TYPE */

/** Find last style element if any inside target */
const findLastStyleTag = (target) => {
  const { childNodes } = target;

  for (let i = childNodes.length; i >= 0; i--) {
    const child = ((childNodes[i]));
    if (child && child.nodeType === ELEMENT_TYPE && child.hasAttribute(SC_ATTR)) {
      return ((child));
    }
  }

  return undefined;
};

/** Create a style element inside `target` or <head> after the last */
export const makeStyleTag = (target) => {
  const head = ((document.head));
  const parent = target || head;
  const style = document.createElement('style');
  const prevStyle = findLastStyleTag(parent);
  const nextSibling = prevStyle !== undefined ? prevStyle.nextSibling : null;

  style.setAttribute(SC_ATTR, SC_ATTR_ACTIVE);
  style.setAttribute(SC_ATTR_VERSION, SC_VERSION);

  const nonce = getNonce();

  if (nonce) style.setAttribute('nonce', nonce);

  parent.insertBefore(style, nextSibling);

  return style;
};

/** Get the CSSStyleSheet instance for a given style element */
export const getSheet = (tag) => {
  if (tag.sheet) {
    return ((tag.sheet));
  }

  // Avoid Firefox quirk where the style element might not have a sheet property
  const { styleSheets } = document;
  for (let i = 0, l = styleSheets.length; i < l; i++) {
    const sheet = styleSheets[i];
    if (sheet.ownerNode === tag) {
      return ((sheet));
    }
  }

  throwStyledError(17);
  return (undefined);
};
