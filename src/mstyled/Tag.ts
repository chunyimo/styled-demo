/** Create a CSSStyleSheet-like tag depending on the environment */
export const makeTag = ({ target }: { target: any }) => {
  return new CSSOMTag(target);
};

export class CSSOMTag {
  element;

  sheet;

  length;

  constructor(target: any) {
    // makeStyleTag 生成style标签，如
    // <style data-styled="active" data-styled-version="__VERSION__" nonce="__webpack_nonce__"></style>
    // !插入style标签
    const element = (this.element = makeStyleTag(target));

    // Avoid Edge bug where empty style elements don't create sheets
    element.appendChild(document.createTextNode(""));
    // 获取标签的sheet属性
    this.sheet = getSheet(element);
    this.length = 0;
  }

  insertRule(index: number, rule: string) {
    try {
      this.sheet.insertRule(rule, index);
      // @ts-ignore
      document.mcysheet = this.sheet;
      console.log(this.sheet);
      this.length++;
      return true;
    } catch (_error) {
      return false;
    }
  }
}
const ELEMENT_TYPE = 1; /* Node.ELEMENT_TYPE */
/** Find last style element if any inside target */
const findLastStyleTag = (target: any) => {
  const { childNodes } = target;

  for (let i = childNodes.length; i >= 0; i--) {
    const child = childNodes[i];
    if (child && child.nodeType === ELEMENT_TYPE) {
      return child;
    }
  }

  return undefined;
};
export const makeStyleTag = (target: any) => {
  const head = document.head;
  const parent = target || head;
  const style = document.createElement("style");
  const prevStyle = findLastStyleTag(parent);
  const nextSibling = prevStyle !== undefined ? prevStyle.nextSibling : null;

  parent.insertBefore(style, nextSibling);

  return style;
};

/** Get the CSSStyleSheet instance for a given style element */
export const getSheet = (tag: any) => {
  if (tag.sheet) {
    return tag.sheet;
  }
  return undefined;
};
