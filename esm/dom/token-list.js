import {OWNER_ELEMENT} from '../shared/symbols.js';
import {setAttribute} from '../shared/attributes.js';

import {Attr} from '../interface/attr.js';

const update = ({[OWNER_ELEMENT]: ownerElement, value}) => {
  const attribute = ownerElement.getAttributeNode('class');
  if (attribute)
    attribute.value = value;
  else
    setAttribute(
      ownerElement,
      new Attr(ownerElement.ownerDocument, 'class', value)
    );
};

/**
 * @implements globalThis.DOMTokenList
 */
export class DOMTokenList extends Set {

  constructor(ownerElement) {
    super();
    this[OWNER_ELEMENT] = ownerElement;
  }

  get length() { return this.size; }

  get value() { return [...this].join(' '); }

  /**
   * @param  {...string} tokens
   */
  add(...tokens) {
    for (const token of tokens) {
      if (token)
        super.add(token);
    }
    update(this);
  }

  /**
   * @param {string} token
   */
  contains(token) { return this.has(token); }

  /**
   * @param  {...string} tokens
   */
  remove(...tokens) {
    for (const token of tokens)
      this.delete(token);
    update(this);
  }

  /**
   * @param {string} token
   * @param {boolean?} force
   */
  toggle(token, force) {
    if (this.has(token)) {
      if (force)
        return true;
      this.delete(token);
      update(this);
    }
    else if (force || arguments.length === 1) {
      super.add(token);
      update(this);
      return true;
    }
    return false;
  }

  /**
   * @param {string} token
   * @param {string} newToken
   */
  replace(token, newToken) {
    if (this.has(token)) {
      this.delete(token);
      super.add(newToken);
      update(this);
      return true;
    }
    return false;
  }

  /**
   * @param {string} token
   */
  supports() { return true; }
}
