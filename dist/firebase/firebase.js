"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.db = void 0;
var _app = require("firebase/app");
var _firestore = require("firebase/firestore");
var _firebaseConfig = _interopRequireDefault(require("./firebaseConfig"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var app = (0, _app.initializeApp)(_firebaseConfig["default"]);
var db = exports.db = (0, _firestore.getFirestore)(app);