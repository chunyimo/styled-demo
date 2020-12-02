
/* eslint-disable camelcase, no-undef */

const  __webpack_nonce__ = '__webpack_nonce__';

const getNonce = () => {
  return typeof __webpack_nonce__ !== 'undefined' ? __webpack_nonce__ : null;
};

export default getNonce;
