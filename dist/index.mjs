var __knownSymbol = (name, symbol) => {
  return (symbol = Symbol[name]) ? symbol : Symbol.for("Symbol." + name);
};
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

// lib/walk.ts
import { existsSync, readdirSync } from "fs";
import { join, parse } from "path";
function* walkIterator(directory, options = {}, accumulator = []) {
  const { depth, extension } = options;
  if (accumulator.length === depth)
    return;
  if (existsSync(directory)) {
    for (const file of readdirSync(directory, { withFileTypes: true })) {
      const { ext, name } = parse(file.name);
      if (file.isDirectory()) {
        const entry = join(directory, file.name);
        yield* __yieldStar(walkIterator(entry, options, [...accumulator, file.name]));
      } else if (file.isFile() && (!extension || ext === extension)) {
        yield [...accumulator, name];
      }
    }
  }
}
var walk = (directory, options) => Array.from(walkIterator(directory, options));
export {
  walk
};
