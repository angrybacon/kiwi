"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __knownSymbol = (name, symbol) => {
  return (symbol = Symbol[name]) ? symbol : Symbol.for("Symbol." + name);
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __await = function(promise, isYieldStar) {
  this[0] = promise;
  this[1] = isYieldStar;
};
var __yieldStar = (value) => {
  var obj = value[__knownSymbol("asyncIterator")];
  var isAwait = false;
  var method;
  var it = {};
  if (obj == null) {
    obj = value[__knownSymbol("iterator")]();
    method = (k) => it[k] = (x) => obj[k](x);
  } else {
    obj = obj.call(value);
    method = (k) => it[k] = (v) => {
      if (isAwait) {
        isAwait = false;
        if (k === "throw")
          throw v;
        return v;
      }
      isAwait = true;
      return {
        done: false,
        value: new __await(new Promise((resolve) => {
          var x = obj[k](v);
          if (!(x instanceof Object))
            throw TypeError("Object expected");
          resolve(x);
        }), 1)
      };
    };
  }
  return it[__knownSymbol("iterator")] = () => it, method("next"), "throw" in obj ? method("throw") : it.throw = (x) => {
    throw x;
  }, "return" in obj && method("return"), it;
};

// index.ts
var kiwi_exports = {};
__export(kiwi_exports, {
  walk: () => walk
});
module.exports = __toCommonJS(kiwi_exports);

// lib/walk.ts
var import_fs = require("fs");
var import_path = require("path");
function* walkIterator(directory, options = {}, accumulator = []) {
  const { depth, extension } = options;
  if (accumulator.length === depth)
    return;
  if ((0, import_fs.existsSync)(directory)) {
    for (const file of (0, import_fs.readdirSync)(directory, { withFileTypes: true })) {
      const { ext, name } = (0, import_path.parse)(file.name);
      if (file.isDirectory()) {
        const entry = (0, import_path.join)(directory, file.name);
        yield* __yieldStar(walkIterator(entry, options, [...accumulator, file.name]));
      } else if (file.isFile() && (!extension || ext === extension)) {
        yield [...accumulator, name];
      }
    }
  }
}
var walk = (directory, options) => Array.from(walkIterator(directory, options));
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  walk
});
