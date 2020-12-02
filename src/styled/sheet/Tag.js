
/* eslint-disable no-use-before-define */

import { makeStyleTag, getSheet } from './dom';

/** Create a CSSStyleSheet-like tag depending on the environment */
export const makeTag = ({ isServer, useCSSOMInjection, target }) => {
  if (isServer) {
    return new VirtualTag(target);
  } else if (useCSSOMInjection) {
    return new CSSOMTag(target);
  } else {
    return new TextTag(target);
  }
};

export class CSSOMTag {
  element;

  sheet;

  length;

  constructor(target) {
    const element = (this.element = makeStyleTag(target));

    // Avoid Edge bug where empty style elements don't create sheets
    element.appendChild(document.createTextNode(''));

    this.sheet = getSheet(element);
    this.length = 0;
  }

  insertRule(index, rule) {
    try {
      this.sheet.insertRule(rule, index);
      this.length++;
      return true;
    } catch (_error) {
      return false;
    }
  }

  deleteRule(index) {
    this.sheet.deleteRule(index);
    this.length--;
  }

  getRule(index) {
    const rule = this.sheet.cssRules[index];
    // Avoid IE11 quirk where cssText is inaccessible on some invalid rules
    if (rule !== undefined && typeof rule.cssText === 'string') {
      return rule.cssText;
    } else {
      return '';
    }
  }
}

/** A Tag that emulates the CSSStyleSheet API but uses text nodes */
export class TextTag {
  element;

  nodes;

  length;

  constructor(target) {
    const element = (this.element = makeStyleTag(target));
    this.nodes = element.childNodes;
    this.length = 0;
  }

  insertRule(index, rule) {
    if (index <= this.length && index >= 0) {
      const node = document.createTextNode(rule);
      const refNode = this.nodes[index];
      this.element.insertBefore(node, refNode || null);
      this.length++;
      return true;
    } else {
      return false;
    }
  }

  deleteRule(index) {
    this.element.removeChild(this.nodes[index]);
    this.length--;
  }

  getRule(index) {
    if (index < this.length) {
      return this.nodes[index].textContent;
    } else {
      return '';
    }
  }
}

/** A completely virtual (server-side) Tag that doesn't manipulate the DOM */
export class VirtualTag {
  rules;

  length;

  constructor(_target) {
    this.rules = [];
    this.length = 0;
  }

  insertRule(index, rule) {
    if (index <= this.length) {
      this.rules.splice(index, 0, rule);
      this.length++;
      return true;
    } else {
      return false;
    }
  }

  deleteRule(index) {
    this.rules.splice(index, 1);
    this.length--;
  }

  getRule(index) {
    if (index < this.length) {
      return this.rules[index];
    } else {
      return '';
    }
  }
}
