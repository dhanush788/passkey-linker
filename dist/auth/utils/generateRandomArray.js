"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
// auth/utils/generateRandomArray.js
function generateRandomArray(length) {
  var array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return array;
}
var _default = exports["default"] = generateRandomArray;