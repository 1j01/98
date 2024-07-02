"use strict";
var ZenFS = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __knownSymbol = (name, symbol) => (symbol = Symbol[name]) ? symbol : Symbol.for("Symbol." + name);
  var __typeError = (msg) => {
    throw TypeError(msg);
  };
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
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
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var __using = (stack, value, async) => {
    if (value != null) {
      if (typeof value !== "object" && typeof value !== "function") __typeError("Object expected");
      var dispose;
      if (async) dispose = value[__knownSymbol("asyncDispose")];
      if (dispose === void 0) dispose = value[__knownSymbol("dispose")];
      if (typeof dispose !== "function") __typeError("Object not disposable");
      stack.push([async, dispose, value]);
    } else if (async) {
      stack.push([async]);
    }
    return value;
  };
  var __callDispose = (stack, error, hasError) => {
    var E = typeof SuppressedError === "function" ? SuppressedError : function(e, s, m, _) {
      return _ = Error(m), _.name = "SuppressedError", _.error = e, _.suppressed = s, _;
    };
    var fail = (e) => error = hasError ? new E(e, error, "An error was suppressed during disposal") : (hasError = true, e);
    var next = (it) => {
      while (it = stack.pop()) {
        try {
          var result = it[1] && it[1].call(it[2]);
          if (it[0]) return Promise.resolve(result).then(next, (e) => (fail(e), next()));
        } catch (e) {
          fail(e);
        }
      }
      if (hasError) throw error;
    };
    return next();
  };

  // node_modules/base64-js/index.js
  var require_base64_js = __commonJS({
    "node_modules/base64-js/index.js"(exports) {
      "use strict";
      exports.byteLength = byteLength;
      exports.toByteArray = toByteArray;
      exports.fromByteArray = fromByteArray;
      var lookup = [];
      var revLookup = [];
      var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
      var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      for (i = 0, len = code.length; i < len; ++i) {
        lookup[i] = code[i];
        revLookup[code.charCodeAt(i)] = i;
      }
      var i;
      var len;
      revLookup["-".charCodeAt(0)] = 62;
      revLookup["_".charCodeAt(0)] = 63;
      function getLens(b64) {
        var len2 = b64.length;
        if (len2 % 4 > 0) {
          throw new Error("Invalid string. Length must be a multiple of 4");
        }
        var validLen = b64.indexOf("=");
        if (validLen === -1) validLen = len2;
        var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
        return [validLen, placeHoldersLen];
      }
      __name(getLens, "getLens");
      function byteLength(b64) {
        var lens = getLens(b64);
        var validLen = lens[0];
        var placeHoldersLen = lens[1];
        return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
      }
      __name(byteLength, "byteLength");
      function _byteLength(b64, validLen, placeHoldersLen) {
        return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
      }
      __name(_byteLength, "_byteLength");
      function toByteArray(b64) {
        var tmp;
        var lens = getLens(b64);
        var validLen = lens[0];
        var placeHoldersLen = lens[1];
        var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
        var curByte = 0;
        var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
        var i2;
        for (i2 = 0; i2 < len2; i2 += 4) {
          tmp = revLookup[b64.charCodeAt(i2)] << 18 | revLookup[b64.charCodeAt(i2 + 1)] << 12 | revLookup[b64.charCodeAt(i2 + 2)] << 6 | revLookup[b64.charCodeAt(i2 + 3)];
          arr[curByte++] = tmp >> 16 & 255;
          arr[curByte++] = tmp >> 8 & 255;
          arr[curByte++] = tmp & 255;
        }
        if (placeHoldersLen === 2) {
          tmp = revLookup[b64.charCodeAt(i2)] << 2 | revLookup[b64.charCodeAt(i2 + 1)] >> 4;
          arr[curByte++] = tmp & 255;
        }
        if (placeHoldersLen === 1) {
          tmp = revLookup[b64.charCodeAt(i2)] << 10 | revLookup[b64.charCodeAt(i2 + 1)] << 4 | revLookup[b64.charCodeAt(i2 + 2)] >> 2;
          arr[curByte++] = tmp >> 8 & 255;
          arr[curByte++] = tmp & 255;
        }
        return arr;
      }
      __name(toByteArray, "toByteArray");
      function tripletToBase64(num) {
        return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
      }
      __name(tripletToBase64, "tripletToBase64");
      function encodeChunk(uint8, start, end) {
        var tmp;
        var output = [];
        for (var i2 = start; i2 < end; i2 += 3) {
          tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
          output.push(tripletToBase64(tmp));
        }
        return output.join("");
      }
      __name(encodeChunk, "encodeChunk");
      function fromByteArray(uint8) {
        var tmp;
        var len2 = uint8.length;
        var extraBytes = len2 % 3;
        var parts = [];
        var maxChunkLength = 16383;
        for (var i2 = 0, len22 = len2 - extraBytes; i2 < len22; i2 += maxChunkLength) {
          parts.push(encodeChunk(uint8, i2, i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength));
        }
        if (extraBytes === 1) {
          tmp = uint8[len2 - 1];
          parts.push(
            lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "=="
          );
        } else if (extraBytes === 2) {
          tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
          parts.push(
            lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
          );
        }
        return parts.join("");
      }
      __name(fromByteArray, "fromByteArray");
    }
  });

  // node_modules/ieee754/index.js
  var require_ieee754 = __commonJS({
    "node_modules/ieee754/index.js"(exports) {
      exports.read = function(buffer, offset, isLE, mLen, nBytes) {
        var e, m;
        var eLen = nBytes * 8 - mLen - 1;
        var eMax = (1 << eLen) - 1;
        var eBias = eMax >> 1;
        var nBits = -7;
        var i = isLE ? nBytes - 1 : 0;
        var d = isLE ? -1 : 1;
        var s = buffer[offset + i];
        i += d;
        e = s & (1 << -nBits) - 1;
        s >>= -nBits;
        nBits += eLen;
        for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
        }
        m = e & (1 << -nBits) - 1;
        e >>= -nBits;
        nBits += mLen;
        for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
        }
        if (e === 0) {
          e = 1 - eBias;
        } else if (e === eMax) {
          return m ? NaN : (s ? -1 : 1) * Infinity;
        } else {
          m = m + Math.pow(2, mLen);
          e = e - eBias;
        }
        return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
      };
      exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
        var e, m, c;
        var eLen = nBytes * 8 - mLen - 1;
        var eMax = (1 << eLen) - 1;
        var eBias = eMax >> 1;
        var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
        var i = isLE ? 0 : nBytes - 1;
        var d = isLE ? 1 : -1;
        var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
        value = Math.abs(value);
        if (isNaN(value) || value === Infinity) {
          m = isNaN(value) ? 1 : 0;
          e = eMax;
        } else {
          e = Math.floor(Math.log(value) / Math.LN2);
          if (value * (c = Math.pow(2, -e)) < 1) {
            e--;
            c *= 2;
          }
          if (e + eBias >= 1) {
            value += rt / c;
          } else {
            value += rt * Math.pow(2, 1 - eBias);
          }
          if (value * c >= 2) {
            e++;
            c /= 2;
          }
          if (e + eBias >= eMax) {
            m = 0;
            e = eMax;
          } else if (e + eBias >= 1) {
            m = (value * c - 1) * Math.pow(2, mLen);
            e = e + eBias;
          } else {
            m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
            e = 0;
          }
        }
        for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
        }
        e = e << mLen | m;
        eLen += mLen;
        for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
        }
        buffer[offset + i - d] |= s * 128;
      };
    }
  });

  // node_modules/buffer/index.js
  var require_buffer = __commonJS({
    "node_modules/buffer/index.js"(exports) {
      "use strict";
      var base64 = require_base64_js();
      var ieee754 = require_ieee754();
      var customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
      exports.Buffer = Buffer5;
      exports.SlowBuffer = SlowBuffer;
      exports.INSPECT_MAX_BYTES = 50;
      var K_MAX_LENGTH = 2147483647;
      exports.kMaxLength = K_MAX_LENGTH;
      Buffer5.TYPED_ARRAY_SUPPORT = typedArraySupport();
      if (!Buffer5.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
        console.error(
          "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
        );
      }
      function typedArraySupport() {
        try {
          const arr = new Uint8Array(1);
          const proto = { foo: /* @__PURE__ */ __name(function() {
            return 42;
          }, "foo") };
          Object.setPrototypeOf(proto, Uint8Array.prototype);
          Object.setPrototypeOf(arr, proto);
          return arr.foo() === 42;
        } catch (e) {
          return false;
        }
      }
      __name(typedArraySupport, "typedArraySupport");
      Object.defineProperty(Buffer5.prototype, "parent", {
        enumerable: true,
        get: /* @__PURE__ */ __name(function() {
          if (!Buffer5.isBuffer(this)) return void 0;
          return this.buffer;
        }, "get")
      });
      Object.defineProperty(Buffer5.prototype, "offset", {
        enumerable: true,
        get: /* @__PURE__ */ __name(function() {
          if (!Buffer5.isBuffer(this)) return void 0;
          return this.byteOffset;
        }, "get")
      });
      function createBuffer(length) {
        if (length > K_MAX_LENGTH) {
          throw new RangeError('The value "' + length + '" is invalid for option "size"');
        }
        const buf = new Uint8Array(length);
        Object.setPrototypeOf(buf, Buffer5.prototype);
        return buf;
      }
      __name(createBuffer, "createBuffer");
      function Buffer5(arg, encodingOrOffset, length) {
        if (typeof arg === "number") {
          if (typeof encodingOrOffset === "string") {
            throw new TypeError(
              'The "string" argument must be of type string. Received type number'
            );
          }
          return allocUnsafe(arg);
        }
        return from(arg, encodingOrOffset, length);
      }
      __name(Buffer5, "Buffer");
      Buffer5.poolSize = 8192;
      function from(value, encodingOrOffset, length) {
        if (typeof value === "string") {
          return fromString(value, encodingOrOffset);
        }
        if (ArrayBuffer.isView(value)) {
          return fromArrayView(value);
        }
        if (value == null) {
          throw new TypeError(
            "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
          );
        }
        if (isInstance2(value, ArrayBuffer) || value && isInstance2(value.buffer, ArrayBuffer)) {
          return fromArrayBuffer(value, encodingOrOffset, length);
        }
        if (typeof SharedArrayBuffer !== "undefined" && (isInstance2(value, SharedArrayBuffer) || value && isInstance2(value.buffer, SharedArrayBuffer))) {
          return fromArrayBuffer(value, encodingOrOffset, length);
        }
        if (typeof value === "number") {
          throw new TypeError(
            'The "value" argument must not be of type number. Received type number'
          );
        }
        const valueOf = value.valueOf && value.valueOf();
        if (valueOf != null && valueOf !== value) {
          return Buffer5.from(valueOf, encodingOrOffset, length);
        }
        const b = fromObject(value);
        if (b) return b;
        if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
          return Buffer5.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length);
        }
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
        );
      }
      __name(from, "from");
      Buffer5.from = function(value, encodingOrOffset, length) {
        return from(value, encodingOrOffset, length);
      };
      Object.setPrototypeOf(Buffer5.prototype, Uint8Array.prototype);
      Object.setPrototypeOf(Buffer5, Uint8Array);
      function assertSize(size) {
        if (typeof size !== "number") {
          throw new TypeError('"size" argument must be of type number');
        } else if (size < 0) {
          throw new RangeError('The value "' + size + '" is invalid for option "size"');
        }
      }
      __name(assertSize, "assertSize");
      function alloc(size, fill, encoding) {
        assertSize(size);
        if (size <= 0) {
          return createBuffer(size);
        }
        if (fill !== void 0) {
          return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
        }
        return createBuffer(size);
      }
      __name(alloc, "alloc");
      Buffer5.alloc = function(size, fill, encoding) {
        return alloc(size, fill, encoding);
      };
      function allocUnsafe(size) {
        assertSize(size);
        return createBuffer(size < 0 ? 0 : checked(size) | 0);
      }
      __name(allocUnsafe, "allocUnsafe");
      Buffer5.allocUnsafe = function(size) {
        return allocUnsafe(size);
      };
      Buffer5.allocUnsafeSlow = function(size) {
        return allocUnsafe(size);
      };
      function fromString(string, encoding) {
        if (typeof encoding !== "string" || encoding === "") {
          encoding = "utf8";
        }
        if (!Buffer5.isEncoding(encoding)) {
          throw new TypeError("Unknown encoding: " + encoding);
        }
        const length = byteLength(string, encoding) | 0;
        let buf = createBuffer(length);
        const actual = buf.write(string, encoding);
        if (actual !== length) {
          buf = buf.slice(0, actual);
        }
        return buf;
      }
      __name(fromString, "fromString");
      function fromArrayLike(array) {
        const length = array.length < 0 ? 0 : checked(array.length) | 0;
        const buf = createBuffer(length);
        for (let i = 0; i < length; i += 1) {
          buf[i] = array[i] & 255;
        }
        return buf;
      }
      __name(fromArrayLike, "fromArrayLike");
      function fromArrayView(arrayView) {
        if (isInstance2(arrayView, Uint8Array)) {
          const copy = new Uint8Array(arrayView);
          return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
        }
        return fromArrayLike(arrayView);
      }
      __name(fromArrayView, "fromArrayView");
      function fromArrayBuffer(array, byteOffset, length) {
        if (byteOffset < 0 || array.byteLength < byteOffset) {
          throw new RangeError('"offset" is outside of buffer bounds');
        }
        if (array.byteLength < byteOffset + (length || 0)) {
          throw new RangeError('"length" is outside of buffer bounds');
        }
        let buf;
        if (byteOffset === void 0 && length === void 0) {
          buf = new Uint8Array(array);
        } else if (length === void 0) {
          buf = new Uint8Array(array, byteOffset);
        } else {
          buf = new Uint8Array(array, byteOffset, length);
        }
        Object.setPrototypeOf(buf, Buffer5.prototype);
        return buf;
      }
      __name(fromArrayBuffer, "fromArrayBuffer");
      function fromObject(obj) {
        if (Buffer5.isBuffer(obj)) {
          const len = checked(obj.length) | 0;
          const buf = createBuffer(len);
          if (buf.length === 0) {
            return buf;
          }
          obj.copy(buf, 0, 0, len);
          return buf;
        }
        if (obj.length !== void 0) {
          if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
            return createBuffer(0);
          }
          return fromArrayLike(obj);
        }
        if (obj.type === "Buffer" && Array.isArray(obj.data)) {
          return fromArrayLike(obj.data);
        }
      }
      __name(fromObject, "fromObject");
      function checked(length) {
        if (length >= K_MAX_LENGTH) {
          throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
        }
        return length | 0;
      }
      __name(checked, "checked");
      function SlowBuffer(length) {
        if (+length != length) {
          length = 0;
        }
        return Buffer5.alloc(+length);
      }
      __name(SlowBuffer, "SlowBuffer");
      Buffer5.isBuffer = /* @__PURE__ */ __name(function isBuffer(b) {
        return b != null && b._isBuffer === true && b !== Buffer5.prototype;
      }, "isBuffer");
      Buffer5.compare = /* @__PURE__ */ __name(function compare(a, b) {
        if (isInstance2(a, Uint8Array)) a = Buffer5.from(a, a.offset, a.byteLength);
        if (isInstance2(b, Uint8Array)) b = Buffer5.from(b, b.offset, b.byteLength);
        if (!Buffer5.isBuffer(a) || !Buffer5.isBuffer(b)) {
          throw new TypeError(
            'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
          );
        }
        if (a === b) return 0;
        let x = a.length;
        let y = b.length;
        for (let i = 0, len = Math.min(x, y); i < len; ++i) {
          if (a[i] !== b[i]) {
            x = a[i];
            y = b[i];
            break;
          }
        }
        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      }, "compare");
      Buffer5.isEncoding = /* @__PURE__ */ __name(function isEncoding(encoding) {
        switch (String(encoding).toLowerCase()) {
          case "hex":
          case "utf8":
          case "utf-8":
          case "ascii":
          case "latin1":
          case "binary":
          case "base64":
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return true;
          default:
            return false;
        }
      }, "isEncoding");
      Buffer5.concat = /* @__PURE__ */ __name(function concat(list, length) {
        if (!Array.isArray(list)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        }
        if (list.length === 0) {
          return Buffer5.alloc(0);
        }
        let i;
        if (length === void 0) {
          length = 0;
          for (i = 0; i < list.length; ++i) {
            length += list[i].length;
          }
        }
        const buffer = Buffer5.allocUnsafe(length);
        let pos = 0;
        for (i = 0; i < list.length; ++i) {
          let buf = list[i];
          if (isInstance2(buf, Uint8Array)) {
            if (pos + buf.length > buffer.length) {
              if (!Buffer5.isBuffer(buf)) buf = Buffer5.from(buf);
              buf.copy(buffer, pos);
            } else {
              Uint8Array.prototype.set.call(
                buffer,
                buf,
                pos
              );
            }
          } else if (!Buffer5.isBuffer(buf)) {
            throw new TypeError('"list" argument must be an Array of Buffers');
          } else {
            buf.copy(buffer, pos);
          }
          pos += buf.length;
        }
        return buffer;
      }, "concat");
      function byteLength(string, encoding) {
        if (Buffer5.isBuffer(string)) {
          return string.length;
        }
        if (ArrayBuffer.isView(string) || isInstance2(string, ArrayBuffer)) {
          return string.byteLength;
        }
        if (typeof string !== "string") {
          throw new TypeError(
            'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string
          );
        }
        const len = string.length;
        const mustMatch = arguments.length > 2 && arguments[2] === true;
        if (!mustMatch && len === 0) return 0;
        let loweredCase = false;
        for (; ; ) {
          switch (encoding) {
            case "ascii":
            case "latin1":
            case "binary":
              return len;
            case "utf8":
            case "utf-8":
              return utf8ToBytes(string).length;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return len * 2;
            case "hex":
              return len >>> 1;
            case "base64":
              return base64ToBytes(string).length;
            default:
              if (loweredCase) {
                return mustMatch ? -1 : utf8ToBytes(string).length;
              }
              encoding = ("" + encoding).toLowerCase();
              loweredCase = true;
          }
        }
      }
      __name(byteLength, "byteLength");
      Buffer5.byteLength = byteLength;
      function slowToString(encoding, start, end) {
        let loweredCase = false;
        if (start === void 0 || start < 0) {
          start = 0;
        }
        if (start > this.length) {
          return "";
        }
        if (end === void 0 || end > this.length) {
          end = this.length;
        }
        if (end <= 0) {
          return "";
        }
        end >>>= 0;
        start >>>= 0;
        if (end <= start) {
          return "";
        }
        if (!encoding) encoding = "utf8";
        while (true) {
          switch (encoding) {
            case "hex":
              return hexSlice(this, start, end);
            case "utf8":
            case "utf-8":
              return utf8Slice(this, start, end);
            case "ascii":
              return asciiSlice(this, start, end);
            case "latin1":
            case "binary":
              return latin1Slice(this, start, end);
            case "base64":
              return base64Slice(this, start, end);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return utf16leSlice(this, start, end);
            default:
              if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
              encoding = (encoding + "").toLowerCase();
              loweredCase = true;
          }
        }
      }
      __name(slowToString, "slowToString");
      Buffer5.prototype._isBuffer = true;
      function swap(b, n, m) {
        const i = b[n];
        b[n] = b[m];
        b[m] = i;
      }
      __name(swap, "swap");
      Buffer5.prototype.swap16 = /* @__PURE__ */ __name(function swap16() {
        const len = this.length;
        if (len % 2 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 16-bits");
        }
        for (let i = 0; i < len; i += 2) {
          swap(this, i, i + 1);
        }
        return this;
      }, "swap16");
      Buffer5.prototype.swap32 = /* @__PURE__ */ __name(function swap32() {
        const len = this.length;
        if (len % 4 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 32-bits");
        }
        for (let i = 0; i < len; i += 4) {
          swap(this, i, i + 3);
          swap(this, i + 1, i + 2);
        }
        return this;
      }, "swap32");
      Buffer5.prototype.swap64 = /* @__PURE__ */ __name(function swap64() {
        const len = this.length;
        if (len % 8 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 64-bits");
        }
        for (let i = 0; i < len; i += 8) {
          swap(this, i, i + 7);
          swap(this, i + 1, i + 6);
          swap(this, i + 2, i + 5);
          swap(this, i + 3, i + 4);
        }
        return this;
      }, "swap64");
      Buffer5.prototype.toString = /* @__PURE__ */ __name(function toString() {
        const length = this.length;
        if (length === 0) return "";
        if (arguments.length === 0) return utf8Slice(this, 0, length);
        return slowToString.apply(this, arguments);
      }, "toString");
      Buffer5.prototype.toLocaleString = Buffer5.prototype.toString;
      Buffer5.prototype.equals = /* @__PURE__ */ __name(function equals(b) {
        if (!Buffer5.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
        if (this === b) return true;
        return Buffer5.compare(this, b) === 0;
      }, "equals");
      Buffer5.prototype.inspect = /* @__PURE__ */ __name(function inspect() {
        let str = "";
        const max = exports.INSPECT_MAX_BYTES;
        str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
        if (this.length > max) str += " ... ";
        return "<Buffer " + str + ">";
      }, "inspect");
      if (customInspectSymbol) {
        Buffer5.prototype[customInspectSymbol] = Buffer5.prototype.inspect;
      }
      Buffer5.prototype.compare = /* @__PURE__ */ __name(function compare(target, start, end, thisStart, thisEnd) {
        if (isInstance2(target, Uint8Array)) {
          target = Buffer5.from(target, target.offset, target.byteLength);
        }
        if (!Buffer5.isBuffer(target)) {
          throw new TypeError(
            'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target
          );
        }
        if (start === void 0) {
          start = 0;
        }
        if (end === void 0) {
          end = target ? target.length : 0;
        }
        if (thisStart === void 0) {
          thisStart = 0;
        }
        if (thisEnd === void 0) {
          thisEnd = this.length;
        }
        if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
          throw new RangeError("out of range index");
        }
        if (thisStart >= thisEnd && start >= end) {
          return 0;
        }
        if (thisStart >= thisEnd) {
          return -1;
        }
        if (start >= end) {
          return 1;
        }
        start >>>= 0;
        end >>>= 0;
        thisStart >>>= 0;
        thisEnd >>>= 0;
        if (this === target) return 0;
        let x = thisEnd - thisStart;
        let y = end - start;
        const len = Math.min(x, y);
        const thisCopy = this.slice(thisStart, thisEnd);
        const targetCopy = target.slice(start, end);
        for (let i = 0; i < len; ++i) {
          if (thisCopy[i] !== targetCopy[i]) {
            x = thisCopy[i];
            y = targetCopy[i];
            break;
          }
        }
        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      }, "compare");
      function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
        if (buffer.length === 0) return -1;
        if (typeof byteOffset === "string") {
          encoding = byteOffset;
          byteOffset = 0;
        } else if (byteOffset > 2147483647) {
          byteOffset = 2147483647;
        } else if (byteOffset < -2147483648) {
          byteOffset = -2147483648;
        }
        byteOffset = +byteOffset;
        if (numberIsNaN(byteOffset)) {
          byteOffset = dir ? 0 : buffer.length - 1;
        }
        if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
        if (byteOffset >= buffer.length) {
          if (dir) return -1;
          else byteOffset = buffer.length - 1;
        } else if (byteOffset < 0) {
          if (dir) byteOffset = 0;
          else return -1;
        }
        if (typeof val === "string") {
          val = Buffer5.from(val, encoding);
        }
        if (Buffer5.isBuffer(val)) {
          if (val.length === 0) {
            return -1;
          }
          return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
        } else if (typeof val === "number") {
          val = val & 255;
          if (typeof Uint8Array.prototype.indexOf === "function") {
            if (dir) {
              return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
            } else {
              return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
            }
          }
          return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
        }
        throw new TypeError("val must be string, number or Buffer");
      }
      __name(bidirectionalIndexOf, "bidirectionalIndexOf");
      function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
        let indexSize = 1;
        let arrLength = arr.length;
        let valLength = val.length;
        if (encoding !== void 0) {
          encoding = String(encoding).toLowerCase();
          if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
            if (arr.length < 2 || val.length < 2) {
              return -1;
            }
            indexSize = 2;
            arrLength /= 2;
            valLength /= 2;
            byteOffset /= 2;
          }
        }
        function read2(buf, i2) {
          if (indexSize === 1) {
            return buf[i2];
          } else {
            return buf.readUInt16BE(i2 * indexSize);
          }
        }
        __name(read2, "read");
        let i;
        if (dir) {
          let foundIndex = -1;
          for (i = byteOffset; i < arrLength; i++) {
            if (read2(arr, i) === read2(val, foundIndex === -1 ? 0 : i - foundIndex)) {
              if (foundIndex === -1) foundIndex = i;
              if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
            } else {
              if (foundIndex !== -1) i -= i - foundIndex;
              foundIndex = -1;
            }
          }
        } else {
          if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
          for (i = byteOffset; i >= 0; i--) {
            let found = true;
            for (let j = 0; j < valLength; j++) {
              if (read2(arr, i + j) !== read2(val, j)) {
                found = false;
                break;
              }
            }
            if (found) return i;
          }
        }
        return -1;
      }
      __name(arrayIndexOf, "arrayIndexOf");
      Buffer5.prototype.includes = /* @__PURE__ */ __name(function includes(val, byteOffset, encoding) {
        return this.indexOf(val, byteOffset, encoding) !== -1;
      }, "includes");
      Buffer5.prototype.indexOf = /* @__PURE__ */ __name(function indexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
      }, "indexOf");
      Buffer5.prototype.lastIndexOf = /* @__PURE__ */ __name(function lastIndexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
      }, "lastIndexOf");
      function hexWrite(buf, string, offset, length) {
        offset = Number(offset) || 0;
        const remaining = buf.length - offset;
        if (!length) {
          length = remaining;
        } else {
          length = Number(length);
          if (length > remaining) {
            length = remaining;
          }
        }
        const strLen = string.length;
        if (length > strLen / 2) {
          length = strLen / 2;
        }
        let i;
        for (i = 0; i < length; ++i) {
          const parsed = parseInt(string.substr(i * 2, 2), 16);
          if (numberIsNaN(parsed)) return i;
          buf[offset + i] = parsed;
        }
        return i;
      }
      __name(hexWrite, "hexWrite");
      function utf8Write(buf, string, offset, length) {
        return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
      }
      __name(utf8Write, "utf8Write");
      function asciiWrite(buf, string, offset, length) {
        return blitBuffer(asciiToBytes(string), buf, offset, length);
      }
      __name(asciiWrite, "asciiWrite");
      function base64Write(buf, string, offset, length) {
        return blitBuffer(base64ToBytes(string), buf, offset, length);
      }
      __name(base64Write, "base64Write");
      function ucs2Write(buf, string, offset, length) {
        return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
      }
      __name(ucs2Write, "ucs2Write");
      Buffer5.prototype.write = /* @__PURE__ */ __name(function write2(string, offset, length, encoding) {
        if (offset === void 0) {
          encoding = "utf8";
          length = this.length;
          offset = 0;
        } else if (length === void 0 && typeof offset === "string") {
          encoding = offset;
          length = this.length;
          offset = 0;
        } else if (isFinite(offset)) {
          offset = offset >>> 0;
          if (isFinite(length)) {
            length = length >>> 0;
            if (encoding === void 0) encoding = "utf8";
          } else {
            encoding = length;
            length = void 0;
          }
        } else {
          throw new Error(
            "Buffer.write(string, encoding, offset[, length]) is no longer supported"
          );
        }
        const remaining = this.length - offset;
        if (length === void 0 || length > remaining) length = remaining;
        if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
          throw new RangeError("Attempt to write outside buffer bounds");
        }
        if (!encoding) encoding = "utf8";
        let loweredCase = false;
        for (; ; ) {
          switch (encoding) {
            case "hex":
              return hexWrite(this, string, offset, length);
            case "utf8":
            case "utf-8":
              return utf8Write(this, string, offset, length);
            case "ascii":
            case "latin1":
            case "binary":
              return asciiWrite(this, string, offset, length);
            case "base64":
              return base64Write(this, string, offset, length);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return ucs2Write(this, string, offset, length);
            default:
              if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
              encoding = ("" + encoding).toLowerCase();
              loweredCase = true;
          }
        }
      }, "write");
      Buffer5.prototype.toJSON = /* @__PURE__ */ __name(function toJSON() {
        return {
          type: "Buffer",
          data: Array.prototype.slice.call(this._arr || this, 0)
        };
      }, "toJSON");
      function base64Slice(buf, start, end) {
        if (start === 0 && end === buf.length) {
          return base64.fromByteArray(buf);
        } else {
          return base64.fromByteArray(buf.slice(start, end));
        }
      }
      __name(base64Slice, "base64Slice");
      function utf8Slice(buf, start, end) {
        end = Math.min(buf.length, end);
        const res = [];
        let i = start;
        while (i < end) {
          const firstByte = buf[i];
          let codePoint = null;
          let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
          if (i + bytesPerSequence <= end) {
            let secondByte, thirdByte, fourthByte, tempCodePoint;
            switch (bytesPerSequence) {
              case 1:
                if (firstByte < 128) {
                  codePoint = firstByte;
                }
                break;
              case 2:
                secondByte = buf[i + 1];
                if ((secondByte & 192) === 128) {
                  tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                  if (tempCodePoint > 127) {
                    codePoint = tempCodePoint;
                  }
                }
                break;
              case 3:
                secondByte = buf[i + 1];
                thirdByte = buf[i + 2];
                if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                  tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                  if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                    codePoint = tempCodePoint;
                  }
                }
                break;
              case 4:
                secondByte = buf[i + 1];
                thirdByte = buf[i + 2];
                fourthByte = buf[i + 3];
                if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                  tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                  if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                    codePoint = tempCodePoint;
                  }
                }
            }
          }
          if (codePoint === null) {
            codePoint = 65533;
            bytesPerSequence = 1;
          } else if (codePoint > 65535) {
            codePoint -= 65536;
            res.push(codePoint >>> 10 & 1023 | 55296);
            codePoint = 56320 | codePoint & 1023;
          }
          res.push(codePoint);
          i += bytesPerSequence;
        }
        return decodeCodePointsArray(res);
      }
      __name(utf8Slice, "utf8Slice");
      var MAX_ARGUMENTS_LENGTH = 4096;
      function decodeCodePointsArray(codePoints) {
        const len = codePoints.length;
        if (len <= MAX_ARGUMENTS_LENGTH) {
          return String.fromCharCode.apply(String, codePoints);
        }
        let res = "";
        let i = 0;
        while (i < len) {
          res += String.fromCharCode.apply(
            String,
            codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
          );
        }
        return res;
      }
      __name(decodeCodePointsArray, "decodeCodePointsArray");
      function asciiSlice(buf, start, end) {
        let ret = "";
        end = Math.min(buf.length, end);
        for (let i = start; i < end; ++i) {
          ret += String.fromCharCode(buf[i] & 127);
        }
        return ret;
      }
      __name(asciiSlice, "asciiSlice");
      function latin1Slice(buf, start, end) {
        let ret = "";
        end = Math.min(buf.length, end);
        for (let i = start; i < end; ++i) {
          ret += String.fromCharCode(buf[i]);
        }
        return ret;
      }
      __name(latin1Slice, "latin1Slice");
      function hexSlice(buf, start, end) {
        const len = buf.length;
        if (!start || start < 0) start = 0;
        if (!end || end < 0 || end > len) end = len;
        let out = "";
        for (let i = start; i < end; ++i) {
          out += hexSliceLookupTable[buf[i]];
        }
        return out;
      }
      __name(hexSlice, "hexSlice");
      function utf16leSlice(buf, start, end) {
        const bytes = buf.slice(start, end);
        let res = "";
        for (let i = 0; i < bytes.length - 1; i += 2) {
          res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
        }
        return res;
      }
      __name(utf16leSlice, "utf16leSlice");
      Buffer5.prototype.slice = /* @__PURE__ */ __name(function slice(start, end) {
        const len = this.length;
        start = ~~start;
        end = end === void 0 ? len : ~~end;
        if (start < 0) {
          start += len;
          if (start < 0) start = 0;
        } else if (start > len) {
          start = len;
        }
        if (end < 0) {
          end += len;
          if (end < 0) end = 0;
        } else if (end > len) {
          end = len;
        }
        if (end < start) end = start;
        const newBuf = this.subarray(start, end);
        Object.setPrototypeOf(newBuf, Buffer5.prototype);
        return newBuf;
      }, "slice");
      function checkOffset(offset, ext, length) {
        if (offset % 1 !== 0 || offset < 0) throw new RangeError("offset is not uint");
        if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length");
      }
      __name(checkOffset, "checkOffset");
      Buffer5.prototype.readUintLE = Buffer5.prototype.readUIntLE = /* @__PURE__ */ __name(function readUIntLE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) checkOffset(offset, byteLength2, this.length);
        let val = this[offset];
        let mul = 1;
        let i = 0;
        while (++i < byteLength2 && (mul *= 256)) {
          val += this[offset + i] * mul;
        }
        return val;
      }, "readUIntLE");
      Buffer5.prototype.readUintBE = Buffer5.prototype.readUIntBE = /* @__PURE__ */ __name(function readUIntBE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          checkOffset(offset, byteLength2, this.length);
        }
        let val = this[offset + --byteLength2];
        let mul = 1;
        while (byteLength2 > 0 && (mul *= 256)) {
          val += this[offset + --byteLength2] * mul;
        }
        return val;
      }, "readUIntBE");
      Buffer5.prototype.readUint8 = Buffer5.prototype.readUInt8 = /* @__PURE__ */ __name(function readUInt8(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 1, this.length);
        return this[offset];
      }, "readUInt8");
      Buffer5.prototype.readUint16LE = Buffer5.prototype.readUInt16LE = /* @__PURE__ */ __name(function readUInt16LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        return this[offset] | this[offset + 1] << 8;
      }, "readUInt16LE");
      Buffer5.prototype.readUint16BE = Buffer5.prototype.readUInt16BE = /* @__PURE__ */ __name(function readUInt16BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        return this[offset] << 8 | this[offset + 1];
      }, "readUInt16BE");
      Buffer5.prototype.readUint32LE = Buffer5.prototype.readUInt32LE = /* @__PURE__ */ __name(function readUInt32LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
      }, "readUInt32LE");
      Buffer5.prototype.readUint32BE = Buffer5.prototype.readUInt32BE = /* @__PURE__ */ __name(function readUInt32BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
      }, "readUInt32BE");
      Buffer5.prototype.readBigUInt64LE = defineBigIntMethod(/* @__PURE__ */ __name(function readBigUInt64LE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const lo = first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
        const hi = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last * 2 ** 24;
        return BigInt(lo) + (BigInt(hi) << BigInt(32));
      }, "readBigUInt64LE"));
      Buffer5.prototype.readBigUInt64BE = defineBigIntMethod(/* @__PURE__ */ __name(function readBigUInt64BE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const hi = first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
        const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last;
        return (BigInt(hi) << BigInt(32)) + BigInt(lo);
      }, "readBigUInt64BE"));
      Buffer5.prototype.readIntLE = /* @__PURE__ */ __name(function readIntLE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) checkOffset(offset, byteLength2, this.length);
        let val = this[offset];
        let mul = 1;
        let i = 0;
        while (++i < byteLength2 && (mul *= 256)) {
          val += this[offset + i] * mul;
        }
        mul *= 128;
        if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
        return val;
      }, "readIntLE");
      Buffer5.prototype.readIntBE = /* @__PURE__ */ __name(function readIntBE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) checkOffset(offset, byteLength2, this.length);
        let i = byteLength2;
        let mul = 1;
        let val = this[offset + --i];
        while (i > 0 && (mul *= 256)) {
          val += this[offset + --i] * mul;
        }
        mul *= 128;
        if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
        return val;
      }, "readIntBE");
      Buffer5.prototype.readInt8 = /* @__PURE__ */ __name(function readInt8(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 1, this.length);
        if (!(this[offset] & 128)) return this[offset];
        return (255 - this[offset] + 1) * -1;
      }, "readInt8");
      Buffer5.prototype.readInt16LE = /* @__PURE__ */ __name(function readInt16LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        const val = this[offset] | this[offset + 1] << 8;
        return val & 32768 ? val | 4294901760 : val;
      }, "readInt16LE");
      Buffer5.prototype.readInt16BE = /* @__PURE__ */ __name(function readInt16BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        const val = this[offset + 1] | this[offset] << 8;
        return val & 32768 ? val | 4294901760 : val;
      }, "readInt16BE");
      Buffer5.prototype.readInt32LE = /* @__PURE__ */ __name(function readInt32LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
      }, "readInt32LE");
      Buffer5.prototype.readInt32BE = /* @__PURE__ */ __name(function readInt32BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
      }, "readInt32BE");
      Buffer5.prototype.readBigInt64LE = defineBigIntMethod(/* @__PURE__ */ __name(function readBigInt64LE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last << 24);
        return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
      }, "readBigInt64LE"));
      Buffer5.prototype.readBigInt64BE = defineBigIntMethod(/* @__PURE__ */ __name(function readBigInt64BE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const val = (first << 24) + // Overflow
        this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
        return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last);
      }, "readBigInt64BE"));
      Buffer5.prototype.readFloatLE = /* @__PURE__ */ __name(function readFloatLE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, true, 23, 4);
      }, "readFloatLE");
      Buffer5.prototype.readFloatBE = /* @__PURE__ */ __name(function readFloatBE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, false, 23, 4);
      }, "readFloatBE");
      Buffer5.prototype.readDoubleLE = /* @__PURE__ */ __name(function readDoubleLE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, true, 52, 8);
      }, "readDoubleLE");
      Buffer5.prototype.readDoubleBE = /* @__PURE__ */ __name(function readDoubleBE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, false, 52, 8);
      }, "readDoubleBE");
      function checkInt(buf, value, offset, ext, max, min) {
        if (!Buffer5.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
        if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
        if (offset + ext > buf.length) throw new RangeError("Index out of range");
      }
      __name(checkInt, "checkInt");
      Buffer5.prototype.writeUintLE = Buffer5.prototype.writeUIntLE = /* @__PURE__ */ __name(function writeUIntLE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
          checkInt(this, value, offset, byteLength2, maxBytes, 0);
        }
        let mul = 1;
        let i = 0;
        this[offset] = value & 255;
        while (++i < byteLength2 && (mul *= 256)) {
          this[offset + i] = value / mul & 255;
        }
        return offset + byteLength2;
      }, "writeUIntLE");
      Buffer5.prototype.writeUintBE = Buffer5.prototype.writeUIntBE = /* @__PURE__ */ __name(function writeUIntBE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
          checkInt(this, value, offset, byteLength2, maxBytes, 0);
        }
        let i = byteLength2 - 1;
        let mul = 1;
        this[offset + i] = value & 255;
        while (--i >= 0 && (mul *= 256)) {
          this[offset + i] = value / mul & 255;
        }
        return offset + byteLength2;
      }, "writeUIntBE");
      Buffer5.prototype.writeUint8 = Buffer5.prototype.writeUInt8 = /* @__PURE__ */ __name(function writeUInt8(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 1, 255, 0);
        this[offset] = value & 255;
        return offset + 1;
      }, "writeUInt8");
      Buffer5.prototype.writeUint16LE = Buffer5.prototype.writeUInt16LE = /* @__PURE__ */ __name(function writeUInt16LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        return offset + 2;
      }, "writeUInt16LE");
      Buffer5.prototype.writeUint16BE = Buffer5.prototype.writeUInt16BE = /* @__PURE__ */ __name(function writeUInt16BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
        this[offset] = value >>> 8;
        this[offset + 1] = value & 255;
        return offset + 2;
      }, "writeUInt16BE");
      Buffer5.prototype.writeUint32LE = Buffer5.prototype.writeUInt32LE = /* @__PURE__ */ __name(function writeUInt32LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
        this[offset + 3] = value >>> 24;
        this[offset + 2] = value >>> 16;
        this[offset + 1] = value >>> 8;
        this[offset] = value & 255;
        return offset + 4;
      }, "writeUInt32LE");
      Buffer5.prototype.writeUint32BE = Buffer5.prototype.writeUInt32BE = /* @__PURE__ */ __name(function writeUInt32BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 255;
        return offset + 4;
      }, "writeUInt32BE");
      function wrtBigUInt64LE(buf, value, offset, min, max) {
        checkIntBI(value, min, max, buf, offset, 7);
        let lo = Number(value & BigInt(4294967295));
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        let hi = Number(value >> BigInt(32) & BigInt(4294967295));
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        return offset;
      }
      __name(wrtBigUInt64LE, "wrtBigUInt64LE");
      function wrtBigUInt64BE(buf, value, offset, min, max) {
        checkIntBI(value, min, max, buf, offset, 7);
        let lo = Number(value & BigInt(4294967295));
        buf[offset + 7] = lo;
        lo = lo >> 8;
        buf[offset + 6] = lo;
        lo = lo >> 8;
        buf[offset + 5] = lo;
        lo = lo >> 8;
        buf[offset + 4] = lo;
        let hi = Number(value >> BigInt(32) & BigInt(4294967295));
        buf[offset + 3] = hi;
        hi = hi >> 8;
        buf[offset + 2] = hi;
        hi = hi >> 8;
        buf[offset + 1] = hi;
        hi = hi >> 8;
        buf[offset] = hi;
        return offset + 8;
      }
      __name(wrtBigUInt64BE, "wrtBigUInt64BE");
      Buffer5.prototype.writeBigUInt64LE = defineBigIntMethod(/* @__PURE__ */ __name(function writeBigUInt64LE(value, offset = 0) {
        return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
      }, "writeBigUInt64LE"));
      Buffer5.prototype.writeBigUInt64BE = defineBigIntMethod(/* @__PURE__ */ __name(function writeBigUInt64BE(value, offset = 0) {
        return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
      }, "writeBigUInt64BE"));
      Buffer5.prototype.writeIntLE = /* @__PURE__ */ __name(function writeIntLE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          const limit = Math.pow(2, 8 * byteLength2 - 1);
          checkInt(this, value, offset, byteLength2, limit - 1, -limit);
        }
        let i = 0;
        let mul = 1;
        let sub = 0;
        this[offset] = value & 255;
        while (++i < byteLength2 && (mul *= 256)) {
          if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
            sub = 1;
          }
          this[offset + i] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength2;
      }, "writeIntLE");
      Buffer5.prototype.writeIntBE = /* @__PURE__ */ __name(function writeIntBE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          const limit = Math.pow(2, 8 * byteLength2 - 1);
          checkInt(this, value, offset, byteLength2, limit - 1, -limit);
        }
        let i = byteLength2 - 1;
        let mul = 1;
        let sub = 0;
        this[offset + i] = value & 255;
        while (--i >= 0 && (mul *= 256)) {
          if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
            sub = 1;
          }
          this[offset + i] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength2;
      }, "writeIntBE");
      Buffer5.prototype.writeInt8 = /* @__PURE__ */ __name(function writeInt8(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 1, 127, -128);
        if (value < 0) value = 255 + value + 1;
        this[offset] = value & 255;
        return offset + 1;
      }, "writeInt8");
      Buffer5.prototype.writeInt16LE = /* @__PURE__ */ __name(function writeInt16LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        return offset + 2;
      }, "writeInt16LE");
      Buffer5.prototype.writeInt16BE = /* @__PURE__ */ __name(function writeInt16BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
        this[offset] = value >>> 8;
        this[offset + 1] = value & 255;
        return offset + 2;
      }, "writeInt16BE");
      Buffer5.prototype.writeInt32LE = /* @__PURE__ */ __name(function writeInt32LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        this[offset + 2] = value >>> 16;
        this[offset + 3] = value >>> 24;
        return offset + 4;
      }, "writeInt32LE");
      Buffer5.prototype.writeInt32BE = /* @__PURE__ */ __name(function writeInt32BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
        if (value < 0) value = 4294967295 + value + 1;
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 255;
        return offset + 4;
      }, "writeInt32BE");
      Buffer5.prototype.writeBigInt64LE = defineBigIntMethod(/* @__PURE__ */ __name(function writeBigInt64LE(value, offset = 0) {
        return wrtBigUInt64LE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      }, "writeBigInt64LE"));
      Buffer5.prototype.writeBigInt64BE = defineBigIntMethod(/* @__PURE__ */ __name(function writeBigInt64BE(value, offset = 0) {
        return wrtBigUInt64BE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      }, "writeBigInt64BE"));
      function checkIEEE754(buf, value, offset, ext, max, min) {
        if (offset + ext > buf.length) throw new RangeError("Index out of range");
        if (offset < 0) throw new RangeError("Index out of range");
      }
      __name(checkIEEE754, "checkIEEE754");
      function writeFloat(buf, value, offset, littleEndian, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          checkIEEE754(buf, value, offset, 4, 34028234663852886e22, -34028234663852886e22);
        }
        ieee754.write(buf, value, offset, littleEndian, 23, 4);
        return offset + 4;
      }
      __name(writeFloat, "writeFloat");
      Buffer5.prototype.writeFloatLE = /* @__PURE__ */ __name(function writeFloatLE(value, offset, noAssert) {
        return writeFloat(this, value, offset, true, noAssert);
      }, "writeFloatLE");
      Buffer5.prototype.writeFloatBE = /* @__PURE__ */ __name(function writeFloatBE(value, offset, noAssert) {
        return writeFloat(this, value, offset, false, noAssert);
      }, "writeFloatBE");
      function writeDouble(buf, value, offset, littleEndian, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          checkIEEE754(buf, value, offset, 8, 17976931348623157e292, -17976931348623157e292);
        }
        ieee754.write(buf, value, offset, littleEndian, 52, 8);
        return offset + 8;
      }
      __name(writeDouble, "writeDouble");
      Buffer5.prototype.writeDoubleLE = /* @__PURE__ */ __name(function writeDoubleLE(value, offset, noAssert) {
        return writeDouble(this, value, offset, true, noAssert);
      }, "writeDoubleLE");
      Buffer5.prototype.writeDoubleBE = /* @__PURE__ */ __name(function writeDoubleBE(value, offset, noAssert) {
        return writeDouble(this, value, offset, false, noAssert);
      }, "writeDoubleBE");
      Buffer5.prototype.copy = /* @__PURE__ */ __name(function copy(target, targetStart, start, end) {
        if (!Buffer5.isBuffer(target)) throw new TypeError("argument should be a Buffer");
        if (!start) start = 0;
        if (!end && end !== 0) end = this.length;
        if (targetStart >= target.length) targetStart = target.length;
        if (!targetStart) targetStart = 0;
        if (end > 0 && end < start) end = start;
        if (end === start) return 0;
        if (target.length === 0 || this.length === 0) return 0;
        if (targetStart < 0) {
          throw new RangeError("targetStart out of bounds");
        }
        if (start < 0 || start >= this.length) throw new RangeError("Index out of range");
        if (end < 0) throw new RangeError("sourceEnd out of bounds");
        if (end > this.length) end = this.length;
        if (target.length - targetStart < end - start) {
          end = target.length - targetStart + start;
        }
        const len = end - start;
        if (this === target && typeof Uint8Array.prototype.copyWithin === "function") {
          this.copyWithin(targetStart, start, end);
        } else {
          Uint8Array.prototype.set.call(
            target,
            this.subarray(start, end),
            targetStart
          );
        }
        return len;
      }, "copy");
      Buffer5.prototype.fill = /* @__PURE__ */ __name(function fill(val, start, end, encoding) {
        if (typeof val === "string") {
          if (typeof start === "string") {
            encoding = start;
            start = 0;
            end = this.length;
          } else if (typeof end === "string") {
            encoding = end;
            end = this.length;
          }
          if (encoding !== void 0 && typeof encoding !== "string") {
            throw new TypeError("encoding must be a string");
          }
          if (typeof encoding === "string" && !Buffer5.isEncoding(encoding)) {
            throw new TypeError("Unknown encoding: " + encoding);
          }
          if (val.length === 1) {
            const code = val.charCodeAt(0);
            if (encoding === "utf8" && code < 128 || encoding === "latin1") {
              val = code;
            }
          }
        } else if (typeof val === "number") {
          val = val & 255;
        } else if (typeof val === "boolean") {
          val = Number(val);
        }
        if (start < 0 || this.length < start || this.length < end) {
          throw new RangeError("Out of range index");
        }
        if (end <= start) {
          return this;
        }
        start = start >>> 0;
        end = end === void 0 ? this.length : end >>> 0;
        if (!val) val = 0;
        let i;
        if (typeof val === "number") {
          for (i = start; i < end; ++i) {
            this[i] = val;
          }
        } else {
          const bytes = Buffer5.isBuffer(val) ? val : Buffer5.from(val, encoding);
          const len = bytes.length;
          if (len === 0) {
            throw new TypeError('The value "' + val + '" is invalid for argument "value"');
          }
          for (i = 0; i < end - start; ++i) {
            this[i + start] = bytes[i % len];
          }
        }
        return this;
      }, "fill");
      var errors = {};
      function E(sym, getMessage, Base) {
        errors[sym] = class NodeError extends Base {
          static {
            __name(this, "NodeError");
          }
          constructor() {
            super();
            Object.defineProperty(this, "message", {
              value: getMessage.apply(this, arguments),
              writable: true,
              configurable: true
            });
            this.name = `${this.name} [${sym}]`;
            this.stack;
            delete this.name;
          }
          get code() {
            return sym;
          }
          set code(value) {
            Object.defineProperty(this, "code", {
              configurable: true,
              enumerable: true,
              value,
              writable: true
            });
          }
          toString() {
            return `${this.name} [${sym}]: ${this.message}`;
          }
        };
      }
      __name(E, "E");
      E(
        "ERR_BUFFER_OUT_OF_BOUNDS",
        function(name) {
          if (name) {
            return `${name} is outside of buffer bounds`;
          }
          return "Attempt to access memory outside buffer bounds";
        },
        RangeError
      );
      E(
        "ERR_INVALID_ARG_TYPE",
        function(name, actual) {
          return `The "${name}" argument must be of type number. Received type ${typeof actual}`;
        },
        TypeError
      );
      E(
        "ERR_OUT_OF_RANGE",
        function(str, range, input) {
          let msg = `The value of "${str}" is out of range.`;
          let received = input;
          if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
            received = addNumericalSeparator(String(input));
          } else if (typeof input === "bigint") {
            received = String(input);
            if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
              received = addNumericalSeparator(received);
            }
            received += "n";
          }
          msg += ` It must be ${range}. Received ${received}`;
          return msg;
        },
        RangeError
      );
      function addNumericalSeparator(val) {
        let res = "";
        let i = val.length;
        const start = val[0] === "-" ? 1 : 0;
        for (; i >= start + 4; i -= 3) {
          res = `_${val.slice(i - 3, i)}${res}`;
        }
        return `${val.slice(0, i)}${res}`;
      }
      __name(addNumericalSeparator, "addNumericalSeparator");
      function checkBounds(buf, offset, byteLength2) {
        validateNumber(offset, "offset");
        if (buf[offset] === void 0 || buf[offset + byteLength2] === void 0) {
          boundsError(offset, buf.length - (byteLength2 + 1));
        }
      }
      __name(checkBounds, "checkBounds");
      function checkIntBI(value, min, max, buf, offset, byteLength2) {
        if (value > max || value < min) {
          const n = typeof min === "bigint" ? "n" : "";
          let range;
          if (byteLength2 > 3) {
            if (min === 0 || min === BigInt(0)) {
              range = `>= 0${n} and < 2${n} ** ${(byteLength2 + 1) * 8}${n}`;
            } else {
              range = `>= -(2${n} ** ${(byteLength2 + 1) * 8 - 1}${n}) and < 2 ** ${(byteLength2 + 1) * 8 - 1}${n}`;
            }
          } else {
            range = `>= ${min}${n} and <= ${max}${n}`;
          }
          throw new errors.ERR_OUT_OF_RANGE("value", range, value);
        }
        checkBounds(buf, offset, byteLength2);
      }
      __name(checkIntBI, "checkIntBI");
      function validateNumber(value, name) {
        if (typeof value !== "number") {
          throw new errors.ERR_INVALID_ARG_TYPE(name, "number", value);
        }
      }
      __name(validateNumber, "validateNumber");
      function boundsError(value, length, type) {
        if (Math.floor(value) !== value) {
          validateNumber(value, type);
          throw new errors.ERR_OUT_OF_RANGE(type || "offset", "an integer", value);
        }
        if (length < 0) {
          throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
        }
        throw new errors.ERR_OUT_OF_RANGE(
          type || "offset",
          `>= ${type ? 1 : 0} and <= ${length}`,
          value
        );
      }
      __name(boundsError, "boundsError");
      var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
      function base64clean(str) {
        str = str.split("=")[0];
        str = str.trim().replace(INVALID_BASE64_RE, "");
        if (str.length < 2) return "";
        while (str.length % 4 !== 0) {
          str = str + "=";
        }
        return str;
      }
      __name(base64clean, "base64clean");
      function utf8ToBytes(string, units) {
        units = units || Infinity;
        let codePoint;
        const length = string.length;
        let leadSurrogate = null;
        const bytes = [];
        for (let i = 0; i < length; ++i) {
          codePoint = string.charCodeAt(i);
          if (codePoint > 55295 && codePoint < 57344) {
            if (!leadSurrogate) {
              if (codePoint > 56319) {
                if ((units -= 3) > -1) bytes.push(239, 191, 189);
                continue;
              } else if (i + 1 === length) {
                if ((units -= 3) > -1) bytes.push(239, 191, 189);
                continue;
              }
              leadSurrogate = codePoint;
              continue;
            }
            if (codePoint < 56320) {
              if ((units -= 3) > -1) bytes.push(239, 191, 189);
              leadSurrogate = codePoint;
              continue;
            }
            codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
          } else if (leadSurrogate) {
            if ((units -= 3) > -1) bytes.push(239, 191, 189);
          }
          leadSurrogate = null;
          if (codePoint < 128) {
            if ((units -= 1) < 0) break;
            bytes.push(codePoint);
          } else if (codePoint < 2048) {
            if ((units -= 2) < 0) break;
            bytes.push(
              codePoint >> 6 | 192,
              codePoint & 63 | 128
            );
          } else if (codePoint < 65536) {
            if ((units -= 3) < 0) break;
            bytes.push(
              codePoint >> 12 | 224,
              codePoint >> 6 & 63 | 128,
              codePoint & 63 | 128
            );
          } else if (codePoint < 1114112) {
            if ((units -= 4) < 0) break;
            bytes.push(
              codePoint >> 18 | 240,
              codePoint >> 12 & 63 | 128,
              codePoint >> 6 & 63 | 128,
              codePoint & 63 | 128
            );
          } else {
            throw new Error("Invalid code point");
          }
        }
        return bytes;
      }
      __name(utf8ToBytes, "utf8ToBytes");
      function asciiToBytes(str) {
        const byteArray = [];
        for (let i = 0; i < str.length; ++i) {
          byteArray.push(str.charCodeAt(i) & 255);
        }
        return byteArray;
      }
      __name(asciiToBytes, "asciiToBytes");
      function utf16leToBytes(str, units) {
        let c, hi, lo;
        const byteArray = [];
        for (let i = 0; i < str.length; ++i) {
          if ((units -= 2) < 0) break;
          c = str.charCodeAt(i);
          hi = c >> 8;
          lo = c % 256;
          byteArray.push(lo);
          byteArray.push(hi);
        }
        return byteArray;
      }
      __name(utf16leToBytes, "utf16leToBytes");
      function base64ToBytes(str) {
        return base64.toByteArray(base64clean(str));
      }
      __name(base64ToBytes, "base64ToBytes");
      function blitBuffer(src, dst, offset, length) {
        let i;
        for (i = 0; i < length; ++i) {
          if (i + offset >= dst.length || i >= src.length) break;
          dst[i + offset] = src[i];
        }
        return i;
      }
      __name(blitBuffer, "blitBuffer");
      function isInstance2(obj, type) {
        return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
      }
      __name(isInstance2, "isInstance");
      function numberIsNaN(obj) {
        return obj !== obj;
      }
      __name(numberIsNaN, "numberIsNaN");
      var hexSliceLookupTable = function() {
        const alphabet = "0123456789abcdef";
        const table = new Array(256);
        for (let i = 0; i < 16; ++i) {
          const i16 = i * 16;
          for (let j = 0; j < 16; ++j) {
            table[i16 + j] = alphabet[i] + alphabet[j];
          }
        }
        return table;
      }();
      function defineBigIntMethod(fn) {
        return typeof BigInt === "undefined" ? BufferBigIntNotDefined : fn;
      }
      __name(defineBigIntMethod, "defineBigIntMethod");
      function BufferBigIntNotDefined() {
        throw new Error("BigInt not supported");
      }
      __name(BufferBigIntNotDefined, "BufferBigIntNotDefined");
    }
  });

  // node_modules/readable-stream/lib/ours/primordials.js
  var require_primordials = __commonJS({
    "node_modules/readable-stream/lib/ours/primordials.js"(exports, module) {
      "use strict";
      module.exports = {
        ArrayIsArray: /* @__PURE__ */ __name(function(self2) {
          return Array.isArray(self2);
        }, "ArrayIsArray"),
        ArrayPrototypeIncludes: /* @__PURE__ */ __name(function(self2, el) {
          return self2.includes(el);
        }, "ArrayPrototypeIncludes"),
        ArrayPrototypeIndexOf: /* @__PURE__ */ __name(function(self2, el) {
          return self2.indexOf(el);
        }, "ArrayPrototypeIndexOf"),
        ArrayPrototypeJoin: /* @__PURE__ */ __name(function(self2, sep) {
          return self2.join(sep);
        }, "ArrayPrototypeJoin"),
        ArrayPrototypeMap: /* @__PURE__ */ __name(function(self2, fn) {
          return self2.map(fn);
        }, "ArrayPrototypeMap"),
        ArrayPrototypePop: /* @__PURE__ */ __name(function(self2, el) {
          return self2.pop(el);
        }, "ArrayPrototypePop"),
        ArrayPrototypePush: /* @__PURE__ */ __name(function(self2, el) {
          return self2.push(el);
        }, "ArrayPrototypePush"),
        ArrayPrototypeSlice: /* @__PURE__ */ __name(function(self2, start, end) {
          return self2.slice(start, end);
        }, "ArrayPrototypeSlice"),
        Error,
        FunctionPrototypeCall: /* @__PURE__ */ __name(function(fn, thisArgs, ...args) {
          return fn.call(thisArgs, ...args);
        }, "FunctionPrototypeCall"),
        FunctionPrototypeSymbolHasInstance: /* @__PURE__ */ __name(function(self2, instance) {
          return Function.prototype[Symbol.hasInstance].call(self2, instance);
        }, "FunctionPrototypeSymbolHasInstance"),
        MathFloor: Math.floor,
        Number,
        NumberIsInteger: Number.isInteger,
        NumberIsNaN: Number.isNaN,
        NumberMAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER,
        NumberMIN_SAFE_INTEGER: Number.MIN_SAFE_INTEGER,
        NumberParseInt: Number.parseInt,
        ObjectDefineProperties: /* @__PURE__ */ __name(function(self2, props) {
          return Object.defineProperties(self2, props);
        }, "ObjectDefineProperties"),
        ObjectDefineProperty: /* @__PURE__ */ __name(function(self2, name, prop) {
          return Object.defineProperty(self2, name, prop);
        }, "ObjectDefineProperty"),
        ObjectGetOwnPropertyDescriptor: /* @__PURE__ */ __name(function(self2, name) {
          return Object.getOwnPropertyDescriptor(self2, name);
        }, "ObjectGetOwnPropertyDescriptor"),
        ObjectKeys: /* @__PURE__ */ __name(function(obj) {
          return Object.keys(obj);
        }, "ObjectKeys"),
        ObjectSetPrototypeOf: /* @__PURE__ */ __name(function(target, proto) {
          return Object.setPrototypeOf(target, proto);
        }, "ObjectSetPrototypeOf"),
        Promise,
        PromisePrototypeCatch: /* @__PURE__ */ __name(function(self2, fn) {
          return self2.catch(fn);
        }, "PromisePrototypeCatch"),
        PromisePrototypeThen: /* @__PURE__ */ __name(function(self2, thenFn, catchFn) {
          return self2.then(thenFn, catchFn);
        }, "PromisePrototypeThen"),
        PromiseReject: /* @__PURE__ */ __name(function(err) {
          return Promise.reject(err);
        }, "PromiseReject"),
        PromiseResolve: /* @__PURE__ */ __name(function(val) {
          return Promise.resolve(val);
        }, "PromiseResolve"),
        ReflectApply: Reflect.apply,
        RegExpPrototypeTest: /* @__PURE__ */ __name(function(self2, value) {
          return self2.test(value);
        }, "RegExpPrototypeTest"),
        SafeSet: Set,
        String,
        StringPrototypeSlice: /* @__PURE__ */ __name(function(self2, start, end) {
          return self2.slice(start, end);
        }, "StringPrototypeSlice"),
        StringPrototypeToLowerCase: /* @__PURE__ */ __name(function(self2) {
          return self2.toLowerCase();
        }, "StringPrototypeToLowerCase"),
        StringPrototypeToUpperCase: /* @__PURE__ */ __name(function(self2) {
          return self2.toUpperCase();
        }, "StringPrototypeToUpperCase"),
        StringPrototypeTrim: /* @__PURE__ */ __name(function(self2) {
          return self2.trim();
        }, "StringPrototypeTrim"),
        Symbol,
        SymbolFor: Symbol.for,
        SymbolAsyncIterator: Symbol.asyncIterator,
        SymbolHasInstance: Symbol.hasInstance,
        SymbolIterator: Symbol.iterator,
        SymbolDispose: Symbol.dispose || Symbol("Symbol.dispose"),
        SymbolAsyncDispose: Symbol.asyncDispose || Symbol("Symbol.asyncDispose"),
        TypedArrayPrototypeSet: /* @__PURE__ */ __name(function(self2, buf, len) {
          return self2.set(buf, len);
        }, "TypedArrayPrototypeSet"),
        Boolean,
        Uint8Array
      };
    }
  });

  // node_modules/abort-controller/browser.js
  var require_browser = __commonJS({
    "node_modules/abort-controller/browser.js"(exports, module) {
      "use strict";
      var { AbortController, AbortSignal } = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : (
        /* otherwise */
        void 0
      );
      module.exports = AbortController;
      module.exports.AbortSignal = AbortSignal;
      module.exports.default = AbortController;
    }
  });

  // node_modules/events/events.js
  var require_events = __commonJS({
    "node_modules/events/events.js"(exports, module) {
      "use strict";
      var R = typeof Reflect === "object" ? Reflect : null;
      var ReflectApply = R && typeof R.apply === "function" ? R.apply : /* @__PURE__ */ __name(function ReflectApply2(target, receiver, args) {
        return Function.prototype.apply.call(target, receiver, args);
      }, "ReflectApply");
      var ReflectOwnKeys;
      if (R && typeof R.ownKeys === "function") {
        ReflectOwnKeys = R.ownKeys;
      } else if (Object.getOwnPropertySymbols) {
        ReflectOwnKeys = /* @__PURE__ */ __name(function ReflectOwnKeys2(target) {
          return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
        }, "ReflectOwnKeys");
      } else {
        ReflectOwnKeys = /* @__PURE__ */ __name(function ReflectOwnKeys2(target) {
          return Object.getOwnPropertyNames(target);
        }, "ReflectOwnKeys");
      }
      function ProcessEmitWarning(warning) {
        if (console && console.warn) console.warn(warning);
      }
      __name(ProcessEmitWarning, "ProcessEmitWarning");
      var NumberIsNaN = Number.isNaN || /* @__PURE__ */ __name(function NumberIsNaN2(value) {
        return value !== value;
      }, "NumberIsNaN");
      function EventEmitter() {
        EventEmitter.init.call(this);
      }
      __name(EventEmitter, "EventEmitter");
      module.exports = EventEmitter;
      module.exports.once = once;
      EventEmitter.EventEmitter = EventEmitter;
      EventEmitter.prototype._events = void 0;
      EventEmitter.prototype._eventsCount = 0;
      EventEmitter.prototype._maxListeners = void 0;
      var defaultMaxListeners = 10;
      function checkListener(listener) {
        if (typeof listener !== "function") {
          throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
        }
      }
      __name(checkListener, "checkListener");
      Object.defineProperty(EventEmitter, "defaultMaxListeners", {
        enumerable: true,
        get: /* @__PURE__ */ __name(function() {
          return defaultMaxListeners;
        }, "get"),
        set: /* @__PURE__ */ __name(function(arg) {
          if (typeof arg !== "number" || arg < 0 || NumberIsNaN(arg)) {
            throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + ".");
          }
          defaultMaxListeners = arg;
        }, "set")
      });
      EventEmitter.init = function() {
        if (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) {
          this._events = /* @__PURE__ */ Object.create(null);
          this._eventsCount = 0;
        }
        this._maxListeners = this._maxListeners || void 0;
      };
      EventEmitter.prototype.setMaxListeners = /* @__PURE__ */ __name(function setMaxListeners(n) {
        if (typeof n !== "number" || n < 0 || NumberIsNaN(n)) {
          throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + ".");
        }
        this._maxListeners = n;
        return this;
      }, "setMaxListeners");
      function _getMaxListeners(that) {
        if (that._maxListeners === void 0)
          return EventEmitter.defaultMaxListeners;
        return that._maxListeners;
      }
      __name(_getMaxListeners, "_getMaxListeners");
      EventEmitter.prototype.getMaxListeners = /* @__PURE__ */ __name(function getMaxListeners() {
        return _getMaxListeners(this);
      }, "getMaxListeners");
      EventEmitter.prototype.emit = /* @__PURE__ */ __name(function emit(type) {
        var args = [];
        for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
        var doError = type === "error";
        var events = this._events;
        if (events !== void 0)
          doError = doError && events.error === void 0;
        else if (!doError)
          return false;
        if (doError) {
          var er;
          if (args.length > 0)
            er = args[0];
          if (er instanceof Error) {
            throw er;
          }
          var err = new Error("Unhandled error." + (er ? " (" + er.message + ")" : ""));
          err.context = er;
          throw err;
        }
        var handler = events[type];
        if (handler === void 0)
          return false;
        if (typeof handler === "function") {
          ReflectApply(handler, this, args);
        } else {
          var len = handler.length;
          var listeners = arrayClone(handler, len);
          for (var i = 0; i < len; ++i)
            ReflectApply(listeners[i], this, args);
        }
        return true;
      }, "emit");
      function _addListener(target, type, listener, prepend) {
        var m;
        var events;
        var existing;
        checkListener(listener);
        events = target._events;
        if (events === void 0) {
          events = target._events = /* @__PURE__ */ Object.create(null);
          target._eventsCount = 0;
        } else {
          if (events.newListener !== void 0) {
            target.emit(
              "newListener",
              type,
              listener.listener ? listener.listener : listener
            );
            events = target._events;
          }
          existing = events[type];
        }
        if (existing === void 0) {
          existing = events[type] = listener;
          ++target._eventsCount;
        } else {
          if (typeof existing === "function") {
            existing = events[type] = prepend ? [listener, existing] : [existing, listener];
          } else if (prepend) {
            existing.unshift(listener);
          } else {
            existing.push(listener);
          }
          m = _getMaxListeners(target);
          if (m > 0 && existing.length > m && !existing.warned) {
            existing.warned = true;
            var w = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + String(type) + " listeners added. Use emitter.setMaxListeners() to increase limit");
            w.name = "MaxListenersExceededWarning";
            w.emitter = target;
            w.type = type;
            w.count = existing.length;
            ProcessEmitWarning(w);
          }
        }
        return target;
      }
      __name(_addListener, "_addListener");
      EventEmitter.prototype.addListener = /* @__PURE__ */ __name(function addListener(type, listener) {
        return _addListener(this, type, listener, false);
      }, "addListener");
      EventEmitter.prototype.on = EventEmitter.prototype.addListener;
      EventEmitter.prototype.prependListener = /* @__PURE__ */ __name(function prependListener(type, listener) {
        return _addListener(this, type, listener, true);
      }, "prependListener");
      function onceWrapper() {
        if (!this.fired) {
          this.target.removeListener(this.type, this.wrapFn);
          this.fired = true;
          if (arguments.length === 0)
            return this.listener.call(this.target);
          return this.listener.apply(this.target, arguments);
        }
      }
      __name(onceWrapper, "onceWrapper");
      function _onceWrap(target, type, listener) {
        var state = { fired: false, wrapFn: void 0, target, type, listener };
        var wrapped = onceWrapper.bind(state);
        wrapped.listener = listener;
        state.wrapFn = wrapped;
        return wrapped;
      }
      __name(_onceWrap, "_onceWrap");
      EventEmitter.prototype.once = /* @__PURE__ */ __name(function once2(type, listener) {
        checkListener(listener);
        this.on(type, _onceWrap(this, type, listener));
        return this;
      }, "once");
      EventEmitter.prototype.prependOnceListener = /* @__PURE__ */ __name(function prependOnceListener(type, listener) {
        checkListener(listener);
        this.prependListener(type, _onceWrap(this, type, listener));
        return this;
      }, "prependOnceListener");
      EventEmitter.prototype.removeListener = /* @__PURE__ */ __name(function removeListener(type, listener) {
        var list, events, position, i, originalListener;
        checkListener(listener);
        events = this._events;
        if (events === void 0)
          return this;
        list = events[type];
        if (list === void 0)
          return this;
        if (list === listener || list.listener === listener) {
          if (--this._eventsCount === 0)
            this._events = /* @__PURE__ */ Object.create(null);
          else {
            delete events[type];
            if (events.removeListener)
              this.emit("removeListener", type, list.listener || listener);
          }
        } else if (typeof list !== "function") {
          position = -1;
          for (i = list.length - 1; i >= 0; i--) {
            if (list[i] === listener || list[i].listener === listener) {
              originalListener = list[i].listener;
              position = i;
              break;
            }
          }
          if (position < 0)
            return this;
          if (position === 0)
            list.shift();
          else {
            spliceOne(list, position);
          }
          if (list.length === 1)
            events[type] = list[0];
          if (events.removeListener !== void 0)
            this.emit("removeListener", type, originalListener || listener);
        }
        return this;
      }, "removeListener");
      EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
      EventEmitter.prototype.removeAllListeners = /* @__PURE__ */ __name(function removeAllListeners(type) {
        var listeners, events, i;
        events = this._events;
        if (events === void 0)
          return this;
        if (events.removeListener === void 0) {
          if (arguments.length === 0) {
            this._events = /* @__PURE__ */ Object.create(null);
            this._eventsCount = 0;
          } else if (events[type] !== void 0) {
            if (--this._eventsCount === 0)
              this._events = /* @__PURE__ */ Object.create(null);
            else
              delete events[type];
          }
          return this;
        }
        if (arguments.length === 0) {
          var keys = Object.keys(events);
          var key;
          for (i = 0; i < keys.length; ++i) {
            key = keys[i];
            if (key === "removeListener") continue;
            this.removeAllListeners(key);
          }
          this.removeAllListeners("removeListener");
          this._events = /* @__PURE__ */ Object.create(null);
          this._eventsCount = 0;
          return this;
        }
        listeners = events[type];
        if (typeof listeners === "function") {
          this.removeListener(type, listeners);
        } else if (listeners !== void 0) {
          for (i = listeners.length - 1; i >= 0; i--) {
            this.removeListener(type, listeners[i]);
          }
        }
        return this;
      }, "removeAllListeners");
      function _listeners(target, type, unwrap) {
        var events = target._events;
        if (events === void 0)
          return [];
        var evlistener = events[type];
        if (evlistener === void 0)
          return [];
        if (typeof evlistener === "function")
          return unwrap ? [evlistener.listener || evlistener] : [evlistener];
        return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
      }
      __name(_listeners, "_listeners");
      EventEmitter.prototype.listeners = /* @__PURE__ */ __name(function listeners(type) {
        return _listeners(this, type, true);
      }, "listeners");
      EventEmitter.prototype.rawListeners = /* @__PURE__ */ __name(function rawListeners(type) {
        return _listeners(this, type, false);
      }, "rawListeners");
      EventEmitter.listenerCount = function(emitter, type) {
        if (typeof emitter.listenerCount === "function") {
          return emitter.listenerCount(type);
        } else {
          return listenerCount.call(emitter, type);
        }
      };
      EventEmitter.prototype.listenerCount = listenerCount;
      function listenerCount(type) {
        var events = this._events;
        if (events !== void 0) {
          var evlistener = events[type];
          if (typeof evlistener === "function") {
            return 1;
          } else if (evlistener !== void 0) {
            return evlistener.length;
          }
        }
        return 0;
      }
      __name(listenerCount, "listenerCount");
      EventEmitter.prototype.eventNames = /* @__PURE__ */ __name(function eventNames() {
        return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
      }, "eventNames");
      function arrayClone(arr, n) {
        var copy = new Array(n);
        for (var i = 0; i < n; ++i)
          copy[i] = arr[i];
        return copy;
      }
      __name(arrayClone, "arrayClone");
      function spliceOne(list, index) {
        for (; index + 1 < list.length; index++)
          list[index] = list[index + 1];
        list.pop();
      }
      __name(spliceOne, "spliceOne");
      function unwrapListeners(arr) {
        var ret = new Array(arr.length);
        for (var i = 0; i < ret.length; ++i) {
          ret[i] = arr[i].listener || arr[i];
        }
        return ret;
      }
      __name(unwrapListeners, "unwrapListeners");
      function once(emitter, name) {
        return new Promise(function(resolve2, reject) {
          function errorListener(err) {
            emitter.removeListener(name, resolver);
            reject(err);
          }
          __name(errorListener, "errorListener");
          function resolver() {
            if (typeof emitter.removeListener === "function") {
              emitter.removeListener("error", errorListener);
            }
            resolve2([].slice.call(arguments));
          }
          __name(resolver, "resolver");
          ;
          eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
          if (name !== "error") {
            addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
          }
        });
      }
      __name(once, "once");
      function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
        if (typeof emitter.on === "function") {
          eventTargetAgnosticAddListener(emitter, "error", handler, flags);
        }
      }
      __name(addErrorHandlerIfEventEmitter, "addErrorHandlerIfEventEmitter");
      function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
        if (typeof emitter.on === "function") {
          if (flags.once) {
            emitter.once(name, listener);
          } else {
            emitter.on(name, listener);
          }
        } else if (typeof emitter.addEventListener === "function") {
          emitter.addEventListener(name, /* @__PURE__ */ __name(function wrapListener(arg) {
            if (flags.once) {
              emitter.removeEventListener(name, wrapListener);
            }
            listener(arg);
          }, "wrapListener"));
        } else {
          throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
        }
      }
      __name(eventTargetAgnosticAddListener, "eventTargetAgnosticAddListener");
    }
  });

  // node_modules/readable-stream/lib/ours/util.js
  var require_util = __commonJS({
    "node_modules/readable-stream/lib/ours/util.js"(exports, module) {
      "use strict";
      var bufferModule = require_buffer();
      var { kResistStopPropagation, SymbolDispose } = require_primordials();
      var AbortSignal = globalThis.AbortSignal || require_browser().AbortSignal;
      var AbortController = globalThis.AbortController || require_browser().AbortController;
      var AsyncFunction = Object.getPrototypeOf(async function() {
      }).constructor;
      var Blob2 = globalThis.Blob || bufferModule.Blob;
      var isBlob = typeof Blob2 !== "undefined" ? /* @__PURE__ */ __name(function isBlob2(b) {
        return b instanceof Blob2;
      }, "isBlob") : /* @__PURE__ */ __name(function isBlob2(b) {
        return false;
      }, "isBlob");
      var validateAbortSignal = /* @__PURE__ */ __name((signal, name) => {
        if (signal !== void 0 && (signal === null || typeof signal !== "object" || !("aborted" in signal))) {
          throw new ERR_INVALID_ARG_TYPE(name, "AbortSignal", signal);
        }
      }, "validateAbortSignal");
      var validateFunction = /* @__PURE__ */ __name((value, name) => {
        if (typeof value !== "function") throw new ERR_INVALID_ARG_TYPE(name, "Function", value);
      }, "validateFunction");
      var AggregateError = class extends Error {
        static {
          __name(this, "AggregateError");
        }
        constructor(errors) {
          if (!Array.isArray(errors)) {
            throw new TypeError(`Expected input to be an Array, got ${typeof errors}`);
          }
          let message = "";
          for (let i = 0; i < errors.length; i++) {
            message += `    ${errors[i].stack}
`;
          }
          super(message);
          this.name = "AggregateError";
          this.errors = errors;
        }
      };
      module.exports = {
        AggregateError,
        kEmptyObject: Object.freeze({}),
        once: /* @__PURE__ */ __name(function(callback) {
          let called = false;
          return function(...args) {
            if (called) {
              return;
            }
            called = true;
            callback.apply(this, args);
          };
        }, "once"),
        createDeferredPromise: /* @__PURE__ */ __name(function() {
          let resolve2;
          let reject;
          const promise = new Promise((res, rej) => {
            resolve2 = res;
            reject = rej;
          });
          return {
            promise,
            resolve: resolve2,
            reject
          };
        }, "createDeferredPromise"),
        promisify: /* @__PURE__ */ __name(function(fn) {
          return new Promise((resolve2, reject) => {
            fn((err, ...args) => {
              if (err) {
                return reject(err);
              }
              return resolve2(...args);
            });
          });
        }, "promisify"),
        debuglog: /* @__PURE__ */ __name(function() {
          return function() {
          };
        }, "debuglog"),
        format: /* @__PURE__ */ __name(function(format, ...args) {
          return format.replace(/%([sdifj])/g, function(...[_unused, type]) {
            const replacement = args.shift();
            if (type === "f") {
              return replacement.toFixed(6);
            } else if (type === "j") {
              return JSON.stringify(replacement);
            } else if (type === "s" && typeof replacement === "object") {
              const ctor = replacement.constructor !== Object ? replacement.constructor.name : "";
              return `${ctor} {}`.trim();
            } else {
              return replacement.toString();
            }
          });
        }, "format"),
        inspect: /* @__PURE__ */ __name(function(value) {
          switch (typeof value) {
            case "string":
              if (value.includes("'")) {
                if (!value.includes('"')) {
                  return `"${value}"`;
                } else if (!value.includes("`") && !value.includes("${")) {
                  return `\`${value}\``;
                }
              }
              return `'${value}'`;
            case "number":
              if (isNaN(value)) {
                return "NaN";
              } else if (Object.is(value, -0)) {
                return String(value);
              }
              return value;
            case "bigint":
              return `${String(value)}n`;
            case "boolean":
            case "undefined":
              return String(value);
            case "object":
              return "{}";
          }
        }, "inspect"),
        types: {
          isAsyncFunction: /* @__PURE__ */ __name(function(fn) {
            return fn instanceof AsyncFunction;
          }, "isAsyncFunction"),
          isArrayBufferView: /* @__PURE__ */ __name(function(arr) {
            return ArrayBuffer.isView(arr);
          }, "isArrayBufferView")
        },
        isBlob,
        deprecate: /* @__PURE__ */ __name(function(fn, message) {
          return fn;
        }, "deprecate"),
        addAbortListener: require_events().addAbortListener || /* @__PURE__ */ __name(function addAbortListener(signal, listener) {
          if (signal === void 0) {
            throw new ERR_INVALID_ARG_TYPE("signal", "AbortSignal", signal);
          }
          validateAbortSignal(signal, "signal");
          validateFunction(listener, "listener");
          let removeEventListener;
          if (signal.aborted) {
            queueMicrotask(() => listener());
          } else {
            signal.addEventListener("abort", listener, {
              __proto__: null,
              once: true,
              [kResistStopPropagation]: true
            });
            removeEventListener = /* @__PURE__ */ __name(() => {
              signal.removeEventListener("abort", listener);
            }, "removeEventListener");
          }
          return {
            __proto__: null,
            [SymbolDispose]() {
              var _removeEventListener;
              (_removeEventListener = removeEventListener) === null || _removeEventListener === void 0 ? void 0 : _removeEventListener();
            }
          };
        }, "addAbortListener"),
        AbortSignalAny: AbortSignal.any || /* @__PURE__ */ __name(function AbortSignalAny(signals) {
          if (signals.length === 1) {
            return signals[0];
          }
          const ac = new AbortController();
          const abort = /* @__PURE__ */ __name(() => ac.abort(), "abort");
          signals.forEach((signal) => {
            validateAbortSignal(signal, "signals");
            signal.addEventListener("abort", abort, {
              once: true
            });
          });
          ac.signal.addEventListener(
            "abort",
            () => {
              signals.forEach((signal) => signal.removeEventListener("abort", abort));
            },
            {
              once: true
            }
          );
          return ac.signal;
        }, "AbortSignalAny")
      };
      module.exports.promisify.custom = Symbol.for("nodejs.util.promisify.custom");
    }
  });

  // node_modules/readable-stream/lib/ours/errors.js
  var require_errors = __commonJS({
    "node_modules/readable-stream/lib/ours/errors.js"(exports, module) {
      "use strict";
      var { format, inspect, AggregateError: CustomAggregateError } = require_util();
      var AggregateError = globalThis.AggregateError || CustomAggregateError;
      var kIsNodeError = Symbol("kIsNodeError");
      var kTypes = [
        "string",
        "function",
        "number",
        "object",
        // Accept 'Function' and 'Object' as alternative to the lower cased version.
        "Function",
        "Object",
        "boolean",
        "bigint",
        "symbol"
      ];
      var classRegExp = /^([A-Z][a-z0-9]*)+$/;
      var nodeInternalPrefix = "__node_internal_";
      var codes = {};
      function assert(value, message) {
        if (!value) {
          throw new codes.ERR_INTERNAL_ASSERTION(message);
        }
      }
      __name(assert, "assert");
      function addNumericalSeparator(val) {
        let res = "";
        let i = val.length;
        const start = val[0] === "-" ? 1 : 0;
        for (; i >= start + 4; i -= 3) {
          res = `_${val.slice(i - 3, i)}${res}`;
        }
        return `${val.slice(0, i)}${res}`;
      }
      __name(addNumericalSeparator, "addNumericalSeparator");
      function getMessage(key, msg, args) {
        if (typeof msg === "function") {
          assert(
            msg.length <= args.length,
            // Default options do not count.
            `Code: ${key}; The provided arguments length (${args.length}) does not match the required ones (${msg.length}).`
          );
          return msg(...args);
        }
        const expectedLength = (msg.match(/%[dfijoOs]/g) || []).length;
        assert(
          expectedLength === args.length,
          `Code: ${key}; The provided arguments length (${args.length}) does not match the required ones (${expectedLength}).`
        );
        if (args.length === 0) {
          return msg;
        }
        return format(msg, ...args);
      }
      __name(getMessage, "getMessage");
      function E(code, message, Base) {
        if (!Base) {
          Base = Error;
        }
        class NodeError extends Base {
          static {
            __name(this, "NodeError");
          }
          constructor(...args) {
            super(getMessage(code, message, args));
          }
          toString() {
            return `${this.name} [${code}]: ${this.message}`;
          }
        }
        Object.defineProperties(NodeError.prototype, {
          name: {
            value: Base.name,
            writable: true,
            enumerable: false,
            configurable: true
          },
          toString: {
            value: /* @__PURE__ */ __name(function() {
              return `${this.name} [${code}]: ${this.message}`;
            }, "value"),
            writable: true,
            enumerable: false,
            configurable: true
          }
        });
        NodeError.prototype.code = code;
        NodeError.prototype[kIsNodeError] = true;
        codes[code] = NodeError;
      }
      __name(E, "E");
      function hideStackFrames(fn) {
        const hidden = nodeInternalPrefix + fn.name;
        Object.defineProperty(fn, "name", {
          value: hidden
        });
        return fn;
      }
      __name(hideStackFrames, "hideStackFrames");
      function aggregateTwoErrors(innerError, outerError) {
        if (innerError && outerError && innerError !== outerError) {
          if (Array.isArray(outerError.errors)) {
            outerError.errors.push(innerError);
            return outerError;
          }
          const err = new AggregateError([outerError, innerError], outerError.message);
          err.code = outerError.code;
          return err;
        }
        return innerError || outerError;
      }
      __name(aggregateTwoErrors, "aggregateTwoErrors");
      var AbortError = class extends Error {
        static {
          __name(this, "AbortError");
        }
        constructor(message = "The operation was aborted", options = void 0) {
          if (options !== void 0 && typeof options !== "object") {
            throw new codes.ERR_INVALID_ARG_TYPE("options", "Object", options);
          }
          super(message, options);
          this.code = "ABORT_ERR";
          this.name = "AbortError";
        }
      };
      E("ERR_ASSERTION", "%s", Error);
      E(
        "ERR_INVALID_ARG_TYPE",
        (name, expected, actual) => {
          assert(typeof name === "string", "'name' must be a string");
          if (!Array.isArray(expected)) {
            expected = [expected];
          }
          let msg = "The ";
          if (name.endsWith(" argument")) {
            msg += `${name} `;
          } else {
            msg += `"${name}" ${name.includes(".") ? "property" : "argument"} `;
          }
          msg += "must be ";
          const types3 = [];
          const instances = [];
          const other = [];
          for (const value of expected) {
            assert(typeof value === "string", "All expected entries have to be of type string");
            if (kTypes.includes(value)) {
              types3.push(value.toLowerCase());
            } else if (classRegExp.test(value)) {
              instances.push(value);
            } else {
              assert(value !== "object", 'The value "object" should be written as "Object"');
              other.push(value);
            }
          }
          if (instances.length > 0) {
            const pos = types3.indexOf("object");
            if (pos !== -1) {
              types3.splice(types3, pos, 1);
              instances.push("Object");
            }
          }
          if (types3.length > 0) {
            switch (types3.length) {
              case 1:
                msg += `of type ${types3[0]}`;
                break;
              case 2:
                msg += `one of type ${types3[0]} or ${types3[1]}`;
                break;
              default: {
                const last = types3.pop();
                msg += `one of type ${types3.join(", ")}, or ${last}`;
              }
            }
            if (instances.length > 0 || other.length > 0) {
              msg += " or ";
            }
          }
          if (instances.length > 0) {
            switch (instances.length) {
              case 1:
                msg += `an instance of ${instances[0]}`;
                break;
              case 2:
                msg += `an instance of ${instances[0]} or ${instances[1]}`;
                break;
              default: {
                const last = instances.pop();
                msg += `an instance of ${instances.join(", ")}, or ${last}`;
              }
            }
            if (other.length > 0) {
              msg += " or ";
            }
          }
          switch (other.length) {
            case 0:
              break;
            case 1:
              if (other[0].toLowerCase() !== other[0]) {
                msg += "an ";
              }
              msg += `${other[0]}`;
              break;
            case 2:
              msg += `one of ${other[0]} or ${other[1]}`;
              break;
            default: {
              const last = other.pop();
              msg += `one of ${other.join(", ")}, or ${last}`;
            }
          }
          if (actual == null) {
            msg += `. Received ${actual}`;
          } else if (typeof actual === "function" && actual.name) {
            msg += `. Received function ${actual.name}`;
          } else if (typeof actual === "object") {
            var _actual$constructor;
            if ((_actual$constructor = actual.constructor) !== null && _actual$constructor !== void 0 && _actual$constructor.name) {
              msg += `. Received an instance of ${actual.constructor.name}`;
            } else {
              const inspected = inspect(actual, {
                depth: -1
              });
              msg += `. Received ${inspected}`;
            }
          } else {
            let inspected = inspect(actual, {
              colors: false
            });
            if (inspected.length > 25) {
              inspected = `${inspected.slice(0, 25)}...`;
            }
            msg += `. Received type ${typeof actual} (${inspected})`;
          }
          return msg;
        },
        TypeError
      );
      E(
        "ERR_INVALID_ARG_VALUE",
        (name, value, reason = "is invalid") => {
          let inspected = inspect(value);
          if (inspected.length > 128) {
            inspected = inspected.slice(0, 128) + "...";
          }
          const type = name.includes(".") ? "property" : "argument";
          return `The ${type} '${name}' ${reason}. Received ${inspected}`;
        },
        TypeError
      );
      E(
        "ERR_INVALID_RETURN_VALUE",
        (input, name, value) => {
          var _value$constructor;
          const type = value !== null && value !== void 0 && (_value$constructor = value.constructor) !== null && _value$constructor !== void 0 && _value$constructor.name ? `instance of ${value.constructor.name}` : `type ${typeof value}`;
          return `Expected ${input} to be returned from the "${name}" function but got ${type}.`;
        },
        TypeError
      );
      E(
        "ERR_MISSING_ARGS",
        (...args) => {
          assert(args.length > 0, "At least one arg needs to be specified");
          let msg;
          const len = args.length;
          args = (Array.isArray(args) ? args : [args]).map((a) => `"${a}"`).join(" or ");
          switch (len) {
            case 1:
              msg += `The ${args[0]} argument`;
              break;
            case 2:
              msg += `The ${args[0]} and ${args[1]} arguments`;
              break;
            default:
              {
                const last = args.pop();
                msg += `The ${args.join(", ")}, and ${last} arguments`;
              }
              break;
          }
          return `${msg} must be specified`;
        },
        TypeError
      );
      E(
        "ERR_OUT_OF_RANGE",
        (str, range, input) => {
          assert(range, 'Missing "range" argument');
          let received;
          if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
            received = addNumericalSeparator(String(input));
          } else if (typeof input === "bigint") {
            received = String(input);
            if (input > 2n ** 32n || input < -(2n ** 32n)) {
              received = addNumericalSeparator(received);
            }
            received += "n";
          } else {
            received = inspect(input);
          }
          return `The value of "${str}" is out of range. It must be ${range}. Received ${received}`;
        },
        RangeError
      );
      E("ERR_MULTIPLE_CALLBACK", "Callback called multiple times", Error);
      E("ERR_METHOD_NOT_IMPLEMENTED", "The %s method is not implemented", Error);
      E("ERR_STREAM_ALREADY_FINISHED", "Cannot call %s after a stream was finished", Error);
      E("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable", Error);
      E("ERR_STREAM_DESTROYED", "Cannot call %s after a stream was destroyed", Error);
      E("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError);
      E("ERR_STREAM_PREMATURE_CLOSE", "Premature close", Error);
      E("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF", Error);
      E("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event", Error);
      E("ERR_STREAM_WRITE_AFTER_END", "write after end", Error);
      E("ERR_UNKNOWN_ENCODING", "Unknown encoding: %s", TypeError);
      module.exports = {
        AbortError,
        aggregateTwoErrors: hideStackFrames(aggregateTwoErrors),
        hideStackFrames,
        codes
      };
    }
  });

  // node_modules/readable-stream/lib/internal/validators.js
  var require_validators = __commonJS({
    "node_modules/readable-stream/lib/internal/validators.js"(exports, module) {
      "use strict";
      var {
        ArrayIsArray,
        ArrayPrototypeIncludes,
        ArrayPrototypeJoin,
        ArrayPrototypeMap,
        NumberIsInteger,
        NumberIsNaN,
        NumberMAX_SAFE_INTEGER,
        NumberMIN_SAFE_INTEGER,
        NumberParseInt,
        ObjectPrototypeHasOwnProperty,
        RegExpPrototypeExec,
        String: String2,
        StringPrototypeToUpperCase,
        StringPrototypeTrim
      } = require_primordials();
      var {
        hideStackFrames,
        codes: { ERR_SOCKET_BAD_PORT, ERR_INVALID_ARG_TYPE: ERR_INVALID_ARG_TYPE2, ERR_INVALID_ARG_VALUE, ERR_OUT_OF_RANGE, ERR_UNKNOWN_SIGNAL }
      } = require_errors();
      var { normalizeEncoding } = require_util();
      var { isAsyncFunction, isArrayBufferView } = require_util().types;
      var signals = {};
      function isInt32(value) {
        return value === (value | 0);
      }
      __name(isInt32, "isInt32");
      function isUint32(value) {
        return value === value >>> 0;
      }
      __name(isUint32, "isUint32");
      var octalReg = /^[0-7]+$/;
      var modeDesc = "must be a 32-bit unsigned integer or an octal string";
      function parseFileMode(value, name, def) {
        if (typeof value === "undefined") {
          value = def;
        }
        if (typeof value === "string") {
          if (RegExpPrototypeExec(octalReg, value) === null) {
            throw new ERR_INVALID_ARG_VALUE(name, value, modeDesc);
          }
          value = NumberParseInt(value, 8);
        }
        validateUint32(value, name);
        return value;
      }
      __name(parseFileMode, "parseFileMode");
      var validateInteger = hideStackFrames((value, name, min = NumberMIN_SAFE_INTEGER, max = NumberMAX_SAFE_INTEGER) => {
        if (typeof value !== "number") throw new ERR_INVALID_ARG_TYPE2(name, "number", value);
        if (!NumberIsInteger(value)) throw new ERR_OUT_OF_RANGE(name, "an integer", value);
        if (value < min || value > max) throw new ERR_OUT_OF_RANGE(name, `>= ${min} && <= ${max}`, value);
      });
      var validateInt32 = hideStackFrames((value, name, min = -2147483648, max = 2147483647) => {
        if (typeof value !== "number") {
          throw new ERR_INVALID_ARG_TYPE2(name, "number", value);
        }
        if (!NumberIsInteger(value)) {
          throw new ERR_OUT_OF_RANGE(name, "an integer", value);
        }
        if (value < min || value > max) {
          throw new ERR_OUT_OF_RANGE(name, `>= ${min} && <= ${max}`, value);
        }
      });
      var validateUint32 = hideStackFrames((value, name, positive = false) => {
        if (typeof value !== "number") {
          throw new ERR_INVALID_ARG_TYPE2(name, "number", value);
        }
        if (!NumberIsInteger(value)) {
          throw new ERR_OUT_OF_RANGE(name, "an integer", value);
        }
        const min = positive ? 1 : 0;
        const max = 4294967295;
        if (value < min || value > max) {
          throw new ERR_OUT_OF_RANGE(name, `>= ${min} && <= ${max}`, value);
        }
      });
      function validateString(value, name) {
        if (typeof value !== "string") throw new ERR_INVALID_ARG_TYPE2(name, "string", value);
      }
      __name(validateString, "validateString");
      function validateNumber(value, name, min = void 0, max) {
        if (typeof value !== "number") throw new ERR_INVALID_ARG_TYPE2(name, "number", value);
        if (min != null && value < min || max != null && value > max || (min != null || max != null) && NumberIsNaN(value)) {
          throw new ERR_OUT_OF_RANGE(
            name,
            `${min != null ? `>= ${min}` : ""}${min != null && max != null ? " && " : ""}${max != null ? `<= ${max}` : ""}`,
            value
          );
        }
      }
      __name(validateNumber, "validateNumber");
      var validateOneOf = hideStackFrames((value, name, oneOf) => {
        if (!ArrayPrototypeIncludes(oneOf, value)) {
          const allowed = ArrayPrototypeJoin(
            ArrayPrototypeMap(oneOf, (v) => typeof v === "string" ? `'${v}'` : String2(v)),
            ", "
          );
          const reason = "must be one of: " + allowed;
          throw new ERR_INVALID_ARG_VALUE(name, value, reason);
        }
      });
      function validateBoolean(value, name) {
        if (typeof value !== "boolean") throw new ERR_INVALID_ARG_TYPE2(name, "boolean", value);
      }
      __name(validateBoolean, "validateBoolean");
      function getOwnPropertyValueOrDefault(options, key, defaultValue) {
        return options == null || !ObjectPrototypeHasOwnProperty(options, key) ? defaultValue : options[key];
      }
      __name(getOwnPropertyValueOrDefault, "getOwnPropertyValueOrDefault");
      var validateObject = hideStackFrames((value, name, options = null) => {
        const allowArray = getOwnPropertyValueOrDefault(options, "allowArray", false);
        const allowFunction = getOwnPropertyValueOrDefault(options, "allowFunction", false);
        const nullable = getOwnPropertyValueOrDefault(options, "nullable", false);
        if (!nullable && value === null || !allowArray && ArrayIsArray(value) || typeof value !== "object" && (!allowFunction || typeof value !== "function")) {
          throw new ERR_INVALID_ARG_TYPE2(name, "Object", value);
        }
      });
      var validateDictionary = hideStackFrames((value, name) => {
        if (value != null && typeof value !== "object" && typeof value !== "function") {
          throw new ERR_INVALID_ARG_TYPE2(name, "a dictionary", value);
        }
      });
      var validateArray = hideStackFrames((value, name, minLength = 0) => {
        if (!ArrayIsArray(value)) {
          throw new ERR_INVALID_ARG_TYPE2(name, "Array", value);
        }
        if (value.length < minLength) {
          const reason = `must be longer than ${minLength}`;
          throw new ERR_INVALID_ARG_VALUE(name, value, reason);
        }
      });
      function validateStringArray(value, name) {
        validateArray(value, name);
        for (let i = 0; i < value.length; i++) {
          validateString(value[i], `${name}[${i}]`);
        }
      }
      __name(validateStringArray, "validateStringArray");
      function validateBooleanArray(value, name) {
        validateArray(value, name);
        for (let i = 0; i < value.length; i++) {
          validateBoolean(value[i], `${name}[${i}]`);
        }
      }
      __name(validateBooleanArray, "validateBooleanArray");
      function validateAbortSignalArray(value, name) {
        validateArray(value, name);
        for (let i = 0; i < value.length; i++) {
          const signal = value[i];
          const indexedName = `${name}[${i}]`;
          if (signal == null) {
            throw new ERR_INVALID_ARG_TYPE2(indexedName, "AbortSignal", signal);
          }
          validateAbortSignal(signal, indexedName);
        }
      }
      __name(validateAbortSignalArray, "validateAbortSignalArray");
      function validateSignalName(signal, name = "signal") {
        validateString(signal, name);
        if (signals[signal] === void 0) {
          if (signals[StringPrototypeToUpperCase(signal)] !== void 0) {
            throw new ERR_UNKNOWN_SIGNAL(signal + " (signals must use all capital letters)");
          }
          throw new ERR_UNKNOWN_SIGNAL(signal);
        }
      }
      __name(validateSignalName, "validateSignalName");
      var validateBuffer = hideStackFrames((buffer, name = "buffer") => {
        if (!isArrayBufferView(buffer)) {
          throw new ERR_INVALID_ARG_TYPE2(name, ["Buffer", "TypedArray", "DataView"], buffer);
        }
      });
      function validateEncoding(data, encoding) {
        const normalizedEncoding = normalizeEncoding(encoding);
        const length = data.length;
        if (normalizedEncoding === "hex" && length % 2 !== 0) {
          throw new ERR_INVALID_ARG_VALUE("encoding", encoding, `is invalid for data of length ${length}`);
        }
      }
      __name(validateEncoding, "validateEncoding");
      function validatePort(port, name = "Port", allowZero = true) {
        if (typeof port !== "number" && typeof port !== "string" || typeof port === "string" && StringPrototypeTrim(port).length === 0 || +port !== +port >>> 0 || port > 65535 || port === 0 && !allowZero) {
          throw new ERR_SOCKET_BAD_PORT(name, port, allowZero);
        }
        return port | 0;
      }
      __name(validatePort, "validatePort");
      var validateAbortSignal = hideStackFrames((signal, name) => {
        if (signal !== void 0 && (signal === null || typeof signal !== "object" || !("aborted" in signal))) {
          throw new ERR_INVALID_ARG_TYPE2(name, "AbortSignal", signal);
        }
      });
      var validateFunction = hideStackFrames((value, name) => {
        if (typeof value !== "function") throw new ERR_INVALID_ARG_TYPE2(name, "Function", value);
      });
      var validatePlainFunction = hideStackFrames((value, name) => {
        if (typeof value !== "function" || isAsyncFunction(value)) throw new ERR_INVALID_ARG_TYPE2(name, "Function", value);
      });
      var validateUndefined = hideStackFrames((value, name) => {
        if (value !== void 0) throw new ERR_INVALID_ARG_TYPE2(name, "undefined", value);
      });
      function validateUnion(value, name, union) {
        if (!ArrayPrototypeIncludes(union, value)) {
          throw new ERR_INVALID_ARG_TYPE2(name, `('${ArrayPrototypeJoin(union, "|")}')`, value);
        }
      }
      __name(validateUnion, "validateUnion");
      var linkValueRegExp = /^(?:<[^>]*>)(?:\s*;\s*[^;"\s]+(?:=(")?[^;"\s]*\1)?)*$/;
      function validateLinkHeaderFormat(value, name) {
        if (typeof value === "undefined" || !RegExpPrototypeExec(linkValueRegExp, value)) {
          throw new ERR_INVALID_ARG_VALUE(
            name,
            value,
            'must be an array or string of format "</styles.css>; rel=preload; as=style"'
          );
        }
      }
      __name(validateLinkHeaderFormat, "validateLinkHeaderFormat");
      function validateLinkHeaderValue(hints) {
        if (typeof hints === "string") {
          validateLinkHeaderFormat(hints, "hints");
          return hints;
        } else if (ArrayIsArray(hints)) {
          const hintsLength = hints.length;
          let result = "";
          if (hintsLength === 0) {
            return result;
          }
          for (let i = 0; i < hintsLength; i++) {
            const link3 = hints[i];
            validateLinkHeaderFormat(link3, "hints");
            result += link3;
            if (i !== hintsLength - 1) {
              result += ", ";
            }
          }
          return result;
        }
        throw new ERR_INVALID_ARG_VALUE(
          "hints",
          hints,
          'must be an array or string of format "</styles.css>; rel=preload; as=style"'
        );
      }
      __name(validateLinkHeaderValue, "validateLinkHeaderValue");
      module.exports = {
        isInt32,
        isUint32,
        parseFileMode,
        validateArray,
        validateStringArray,
        validateBooleanArray,
        validateAbortSignalArray,
        validateBoolean,
        validateBuffer,
        validateDictionary,
        validateEncoding,
        validateFunction,
        validateInt32,
        validateInteger,
        validateNumber,
        validateObject,
        validateOneOf,
        validatePlainFunction,
        validatePort,
        validateSignalName,
        validateString,
        validateUint32,
        validateUndefined,
        validateUnion,
        validateAbortSignal,
        validateLinkHeaderValue
      };
    }
  });

  // node_modules/process/browser.js
  var require_browser2 = __commonJS({
    "node_modules/process/browser.js"(exports, module) {
      var process = module.exports = {};
      var cachedSetTimeout;
      var cachedClearTimeout;
      function defaultSetTimout() {
        throw new Error("setTimeout has not been defined");
      }
      __name(defaultSetTimout, "defaultSetTimout");
      function defaultClearTimeout() {
        throw new Error("clearTimeout has not been defined");
      }
      __name(defaultClearTimeout, "defaultClearTimeout");
      (function() {
        try {
          if (typeof setTimeout === "function") {
            cachedSetTimeout = setTimeout;
          } else {
            cachedSetTimeout = defaultSetTimout;
          }
        } catch (e) {
          cachedSetTimeout = defaultSetTimout;
        }
        try {
          if (typeof clearTimeout === "function") {
            cachedClearTimeout = clearTimeout;
          } else {
            cachedClearTimeout = defaultClearTimeout;
          }
        } catch (e) {
          cachedClearTimeout = defaultClearTimeout;
        }
      })();
      function runTimeout(fun) {
        if (cachedSetTimeout === setTimeout) {
          return setTimeout(fun, 0);
        }
        if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
          cachedSetTimeout = setTimeout;
          return setTimeout(fun, 0);
        }
        try {
          return cachedSetTimeout(fun, 0);
        } catch (e) {
          try {
            return cachedSetTimeout.call(null, fun, 0);
          } catch (e2) {
            return cachedSetTimeout.call(this, fun, 0);
          }
        }
      }
      __name(runTimeout, "runTimeout");
      function runClearTimeout(marker) {
        if (cachedClearTimeout === clearTimeout) {
          return clearTimeout(marker);
        }
        if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
          cachedClearTimeout = clearTimeout;
          return clearTimeout(marker);
        }
        try {
          return cachedClearTimeout(marker);
        } catch (e) {
          try {
            return cachedClearTimeout.call(null, marker);
          } catch (e2) {
            return cachedClearTimeout.call(this, marker);
          }
        }
      }
      __name(runClearTimeout, "runClearTimeout");
      var queue = [];
      var draining = false;
      var currentQueue;
      var queueIndex = -1;
      function cleanUpNextTick() {
        if (!draining || !currentQueue) {
          return;
        }
        draining = false;
        if (currentQueue.length) {
          queue = currentQueue.concat(queue);
        } else {
          queueIndex = -1;
        }
        if (queue.length) {
          drainQueue();
        }
      }
      __name(cleanUpNextTick, "cleanUpNextTick");
      function drainQueue() {
        if (draining) {
          return;
        }
        var timeout = runTimeout(cleanUpNextTick);
        draining = true;
        var len = queue.length;
        while (len) {
          currentQueue = queue;
          queue = [];
          while (++queueIndex < len) {
            if (currentQueue) {
              currentQueue[queueIndex].run();
            }
          }
          queueIndex = -1;
          len = queue.length;
        }
        currentQueue = null;
        draining = false;
        runClearTimeout(timeout);
      }
      __name(drainQueue, "drainQueue");
      process.nextTick = function(fun) {
        var args = new Array(arguments.length - 1);
        if (arguments.length > 1) {
          for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
          }
        }
        queue.push(new Item(fun, args));
        if (queue.length === 1 && !draining) {
          runTimeout(drainQueue);
        }
      };
      function Item(fun, array) {
        this.fun = fun;
        this.array = array;
      }
      __name(Item, "Item");
      Item.prototype.run = function() {
        this.fun.apply(null, this.array);
      };
      process.title = "browser";
      process.browser = true;
      process.env = {};
      process.argv = [];
      process.version = "";
      process.versions = {};
      function noop() {
      }
      __name(noop, "noop");
      process.on = noop;
      process.addListener = noop;
      process.once = noop;
      process.off = noop;
      process.removeListener = noop;
      process.removeAllListeners = noop;
      process.emit = noop;
      process.prependListener = noop;
      process.prependOnceListener = noop;
      process.listeners = function(name) {
        return [];
      };
      process.binding = function(name) {
        throw new Error("process.binding is not supported");
      };
      process.cwd = function() {
        return "/";
      };
      process.chdir = function(dir) {
        throw new Error("process.chdir is not supported");
      };
      process.umask = function() {
        return 0;
      };
    }
  });

  // node_modules/readable-stream/lib/internal/streams/utils.js
  var require_utils = __commonJS({
    "node_modules/readable-stream/lib/internal/streams/utils.js"(exports, module) {
      "use strict";
      var { SymbolAsyncIterator, SymbolIterator, SymbolFor } = require_primordials();
      var kIsDestroyed = SymbolFor("nodejs.stream.destroyed");
      var kIsErrored = SymbolFor("nodejs.stream.errored");
      var kIsReadable = SymbolFor("nodejs.stream.readable");
      var kIsWritable = SymbolFor("nodejs.stream.writable");
      var kIsDisturbed = SymbolFor("nodejs.stream.disturbed");
      var kIsClosedPromise = SymbolFor("nodejs.webstream.isClosedPromise");
      var kControllerErrorFunction = SymbolFor("nodejs.webstream.controllerErrorFunction");
      function isReadableNodeStream(obj, strict = false) {
        var _obj$_readableState;
        return !!(obj && typeof obj.pipe === "function" && typeof obj.on === "function" && (!strict || typeof obj.pause === "function" && typeof obj.resume === "function") && (!obj._writableState || ((_obj$_readableState = obj._readableState) === null || _obj$_readableState === void 0 ? void 0 : _obj$_readableState.readable) !== false) && // Duplex
        (!obj._writableState || obj._readableState));
      }
      __name(isReadableNodeStream, "isReadableNodeStream");
      function isWritableNodeStream(obj) {
        var _obj$_writableState;
        return !!(obj && typeof obj.write === "function" && typeof obj.on === "function" && (!obj._readableState || ((_obj$_writableState = obj._writableState) === null || _obj$_writableState === void 0 ? void 0 : _obj$_writableState.writable) !== false));
      }
      __name(isWritableNodeStream, "isWritableNodeStream");
      function isDuplexNodeStream(obj) {
        return !!(obj && typeof obj.pipe === "function" && obj._readableState && typeof obj.on === "function" && typeof obj.write === "function");
      }
      __name(isDuplexNodeStream, "isDuplexNodeStream");
      function isNodeStream(obj) {
        return obj && (obj._readableState || obj._writableState || typeof obj.write === "function" && typeof obj.on === "function" || typeof obj.pipe === "function" && typeof obj.on === "function");
      }
      __name(isNodeStream, "isNodeStream");
      function isReadableStream(obj) {
        return !!(obj && !isNodeStream(obj) && typeof obj.pipeThrough === "function" && typeof obj.getReader === "function" && typeof obj.cancel === "function");
      }
      __name(isReadableStream, "isReadableStream");
      function isWritableStream(obj) {
        return !!(obj && !isNodeStream(obj) && typeof obj.getWriter === "function" && typeof obj.abort === "function");
      }
      __name(isWritableStream, "isWritableStream");
      function isTransformStream(obj) {
        return !!(obj && !isNodeStream(obj) && typeof obj.readable === "object" && typeof obj.writable === "object");
      }
      __name(isTransformStream, "isTransformStream");
      function isWebStream(obj) {
        return isReadableStream(obj) || isWritableStream(obj) || isTransformStream(obj);
      }
      __name(isWebStream, "isWebStream");
      function isIterable(obj, isAsync) {
        if (obj == null) return false;
        if (isAsync === true) return typeof obj[SymbolAsyncIterator] === "function";
        if (isAsync === false) return typeof obj[SymbolIterator] === "function";
        return typeof obj[SymbolAsyncIterator] === "function" || typeof obj[SymbolIterator] === "function";
      }
      __name(isIterable, "isIterable");
      function isDestroyed(stream) {
        if (!isNodeStream(stream)) return null;
        const wState = stream._writableState;
        const rState = stream._readableState;
        const state = wState || rState;
        return !!(stream.destroyed || stream[kIsDestroyed] || state !== null && state !== void 0 && state.destroyed);
      }
      __name(isDestroyed, "isDestroyed");
      function isWritableEnded(stream) {
        if (!isWritableNodeStream(stream)) return null;
        if (stream.writableEnded === true) return true;
        const wState = stream._writableState;
        if (wState !== null && wState !== void 0 && wState.errored) return false;
        if (typeof (wState === null || wState === void 0 ? void 0 : wState.ended) !== "boolean") return null;
        return wState.ended;
      }
      __name(isWritableEnded, "isWritableEnded");
      function isWritableFinished(stream, strict) {
        if (!isWritableNodeStream(stream)) return null;
        if (stream.writableFinished === true) return true;
        const wState = stream._writableState;
        if (wState !== null && wState !== void 0 && wState.errored) return false;
        if (typeof (wState === null || wState === void 0 ? void 0 : wState.finished) !== "boolean") return null;
        return !!(wState.finished || strict === false && wState.ended === true && wState.length === 0);
      }
      __name(isWritableFinished, "isWritableFinished");
      function isReadableEnded(stream) {
        if (!isReadableNodeStream(stream)) return null;
        if (stream.readableEnded === true) return true;
        const rState = stream._readableState;
        if (!rState || rState.errored) return false;
        if (typeof (rState === null || rState === void 0 ? void 0 : rState.ended) !== "boolean") return null;
        return rState.ended;
      }
      __name(isReadableEnded, "isReadableEnded");
      function isReadableFinished(stream, strict) {
        if (!isReadableNodeStream(stream)) return null;
        const rState = stream._readableState;
        if (rState !== null && rState !== void 0 && rState.errored) return false;
        if (typeof (rState === null || rState === void 0 ? void 0 : rState.endEmitted) !== "boolean") return null;
        return !!(rState.endEmitted || strict === false && rState.ended === true && rState.length === 0);
      }
      __name(isReadableFinished, "isReadableFinished");
      function isReadable2(stream) {
        if (stream && stream[kIsReadable] != null) return stream[kIsReadable];
        if (typeof (stream === null || stream === void 0 ? void 0 : stream.readable) !== "boolean") return null;
        if (isDestroyed(stream)) return false;
        return isReadableNodeStream(stream) && stream.readable && !isReadableFinished(stream);
      }
      __name(isReadable2, "isReadable");
      function isWritable(stream) {
        if (stream && stream[kIsWritable] != null) return stream[kIsWritable];
        if (typeof (stream === null || stream === void 0 ? void 0 : stream.writable) !== "boolean") return null;
        if (isDestroyed(stream)) return false;
        return isWritableNodeStream(stream) && stream.writable && !isWritableEnded(stream);
      }
      __name(isWritable, "isWritable");
      function isFinished(stream, opts) {
        if (!isNodeStream(stream)) {
          return null;
        }
        if (isDestroyed(stream)) {
          return true;
        }
        if ((opts === null || opts === void 0 ? void 0 : opts.readable) !== false && isReadable2(stream)) {
          return false;
        }
        if ((opts === null || opts === void 0 ? void 0 : opts.writable) !== false && isWritable(stream)) {
          return false;
        }
        return true;
      }
      __name(isFinished, "isFinished");
      function isWritableErrored(stream) {
        var _stream$_writableStat, _stream$_writableStat2;
        if (!isNodeStream(stream)) {
          return null;
        }
        if (stream.writableErrored) {
          return stream.writableErrored;
        }
        return (_stream$_writableStat = (_stream$_writableStat2 = stream._writableState) === null || _stream$_writableStat2 === void 0 ? void 0 : _stream$_writableStat2.errored) !== null && _stream$_writableStat !== void 0 ? _stream$_writableStat : null;
      }
      __name(isWritableErrored, "isWritableErrored");
      function isReadableErrored(stream) {
        var _stream$_readableStat, _stream$_readableStat2;
        if (!isNodeStream(stream)) {
          return null;
        }
        if (stream.readableErrored) {
          return stream.readableErrored;
        }
        return (_stream$_readableStat = (_stream$_readableStat2 = stream._readableState) === null || _stream$_readableStat2 === void 0 ? void 0 : _stream$_readableStat2.errored) !== null && _stream$_readableStat !== void 0 ? _stream$_readableStat : null;
      }
      __name(isReadableErrored, "isReadableErrored");
      function isClosed(stream) {
        if (!isNodeStream(stream)) {
          return null;
        }
        if (typeof stream.closed === "boolean") {
          return stream.closed;
        }
        const wState = stream._writableState;
        const rState = stream._readableState;
        if (typeof (wState === null || wState === void 0 ? void 0 : wState.closed) === "boolean" || typeof (rState === null || rState === void 0 ? void 0 : rState.closed) === "boolean") {
          return (wState === null || wState === void 0 ? void 0 : wState.closed) || (rState === null || rState === void 0 ? void 0 : rState.closed);
        }
        if (typeof stream._closed === "boolean" && isOutgoingMessage(stream)) {
          return stream._closed;
        }
        return null;
      }
      __name(isClosed, "isClosed");
      function isOutgoingMessage(stream) {
        return typeof stream._closed === "boolean" && typeof stream._defaultKeepAlive === "boolean" && typeof stream._removedConnection === "boolean" && typeof stream._removedContLen === "boolean";
      }
      __name(isOutgoingMessage, "isOutgoingMessage");
      function isServerResponse(stream) {
        return typeof stream._sent100 === "boolean" && isOutgoingMessage(stream);
      }
      __name(isServerResponse, "isServerResponse");
      function isServerRequest(stream) {
        var _stream$req;
        return typeof stream._consuming === "boolean" && typeof stream._dumped === "boolean" && ((_stream$req = stream.req) === null || _stream$req === void 0 ? void 0 : _stream$req.upgradeOrConnect) === void 0;
      }
      __name(isServerRequest, "isServerRequest");
      function willEmitClose(stream) {
        if (!isNodeStream(stream)) return null;
        const wState = stream._writableState;
        const rState = stream._readableState;
        const state = wState || rState;
        return !state && isServerResponse(stream) || !!(state && state.autoDestroy && state.emitClose && state.closed === false);
      }
      __name(willEmitClose, "willEmitClose");
      function isDisturbed(stream) {
        var _stream$kIsDisturbed;
        return !!(stream && ((_stream$kIsDisturbed = stream[kIsDisturbed]) !== null && _stream$kIsDisturbed !== void 0 ? _stream$kIsDisturbed : stream.readableDidRead || stream.readableAborted));
      }
      __name(isDisturbed, "isDisturbed");
      function isErrored(stream) {
        var _ref, _ref2, _ref3, _ref4, _ref5, _stream$kIsErrored, _stream$_readableStat3, _stream$_writableStat3, _stream$_readableStat4, _stream$_writableStat4;
        return !!(stream && ((_ref = (_ref2 = (_ref3 = (_ref4 = (_ref5 = (_stream$kIsErrored = stream[kIsErrored]) !== null && _stream$kIsErrored !== void 0 ? _stream$kIsErrored : stream.readableErrored) !== null && _ref5 !== void 0 ? _ref5 : stream.writableErrored) !== null && _ref4 !== void 0 ? _ref4 : (_stream$_readableStat3 = stream._readableState) === null || _stream$_readableStat3 === void 0 ? void 0 : _stream$_readableStat3.errorEmitted) !== null && _ref3 !== void 0 ? _ref3 : (_stream$_writableStat3 = stream._writableState) === null || _stream$_writableStat3 === void 0 ? void 0 : _stream$_writableStat3.errorEmitted) !== null && _ref2 !== void 0 ? _ref2 : (_stream$_readableStat4 = stream._readableState) === null || _stream$_readableStat4 === void 0 ? void 0 : _stream$_readableStat4.errored) !== null && _ref !== void 0 ? _ref : (_stream$_writableStat4 = stream._writableState) === null || _stream$_writableStat4 === void 0 ? void 0 : _stream$_writableStat4.errored));
      }
      __name(isErrored, "isErrored");
      module.exports = {
        isDestroyed,
        kIsDestroyed,
        isDisturbed,
        kIsDisturbed,
        isErrored,
        kIsErrored,
        isReadable: isReadable2,
        kIsReadable,
        kIsClosedPromise,
        kControllerErrorFunction,
        kIsWritable,
        isClosed,
        isDuplexNodeStream,
        isFinished,
        isIterable,
        isReadableNodeStream,
        isReadableStream,
        isReadableEnded,
        isReadableFinished,
        isReadableErrored,
        isNodeStream,
        isWebStream,
        isWritable,
        isWritableNodeStream,
        isWritableStream,
        isWritableEnded,
        isWritableFinished,
        isWritableErrored,
        isServerRequest,
        isServerResponse,
        willEmitClose,
        isTransformStream
      };
    }
  });

  // node_modules/readable-stream/lib/internal/streams/end-of-stream.js
  var require_end_of_stream = __commonJS({
    "node_modules/readable-stream/lib/internal/streams/end-of-stream.js"(exports, module) {
      var process = require_browser2();
      var { AbortError, codes } = require_errors();
      var { ERR_INVALID_ARG_TYPE: ERR_INVALID_ARG_TYPE2, ERR_STREAM_PREMATURE_CLOSE } = codes;
      var { kEmptyObject, once } = require_util();
      var { validateAbortSignal, validateFunction, validateObject, validateBoolean } = require_validators();
      var { Promise: Promise2, PromisePrototypeThen, SymbolDispose } = require_primordials();
      var {
        isClosed,
        isReadable: isReadable2,
        isReadableNodeStream,
        isReadableStream,
        isReadableFinished,
        isReadableErrored,
        isWritable,
        isWritableNodeStream,
        isWritableStream,
        isWritableFinished,
        isWritableErrored,
        isNodeStream,
        willEmitClose: _willEmitClose,
        kIsClosedPromise
      } = require_utils();
      var addAbortListener;
      function isRequest(stream) {
        return stream.setHeader && typeof stream.abort === "function";
      }
      __name(isRequest, "isRequest");
      var nop2 = /* @__PURE__ */ __name(() => {
      }, "nop");
      function eos(stream, options, callback) {
        var _options$readable, _options$writable;
        if (arguments.length === 2) {
          callback = options;
          options = kEmptyObject;
        } else if (options == null) {
          options = kEmptyObject;
        } else {
          validateObject(options, "options");
        }
        validateFunction(callback, "callback");
        validateAbortSignal(options.signal, "options.signal");
        callback = once(callback);
        if (isReadableStream(stream) || isWritableStream(stream)) {
          return eosWeb(stream, options, callback);
        }
        if (!isNodeStream(stream)) {
          throw new ERR_INVALID_ARG_TYPE2("stream", ["ReadableStream", "WritableStream", "Stream"], stream);
        }
        const readable = (_options$readable = options.readable) !== null && _options$readable !== void 0 ? _options$readable : isReadableNodeStream(stream);
        const writable = (_options$writable = options.writable) !== null && _options$writable !== void 0 ? _options$writable : isWritableNodeStream(stream);
        const wState = stream._writableState;
        const rState = stream._readableState;
        const onlegacyfinish = /* @__PURE__ */ __name(() => {
          if (!stream.writable) {
            onfinish();
          }
        }, "onlegacyfinish");
        let willEmitClose = _willEmitClose(stream) && isReadableNodeStream(stream) === readable && isWritableNodeStream(stream) === writable;
        let writableFinished = isWritableFinished(stream, false);
        const onfinish = /* @__PURE__ */ __name(() => {
          writableFinished = true;
          if (stream.destroyed) {
            willEmitClose = false;
          }
          if (willEmitClose && (!stream.readable || readable)) {
            return;
          }
          if (!readable || readableFinished) {
            callback.call(stream);
          }
        }, "onfinish");
        let readableFinished = isReadableFinished(stream, false);
        const onend = /* @__PURE__ */ __name(() => {
          readableFinished = true;
          if (stream.destroyed) {
            willEmitClose = false;
          }
          if (willEmitClose && (!stream.writable || writable)) {
            return;
          }
          if (!writable || writableFinished) {
            callback.call(stream);
          }
        }, "onend");
        const onerror = /* @__PURE__ */ __name((err) => {
          callback.call(stream, err);
        }, "onerror");
        let closed = isClosed(stream);
        const onclose = /* @__PURE__ */ __name(() => {
          closed = true;
          const errored = isWritableErrored(stream) || isReadableErrored(stream);
          if (errored && typeof errored !== "boolean") {
            return callback.call(stream, errored);
          }
          if (readable && !readableFinished && isReadableNodeStream(stream, true)) {
            if (!isReadableFinished(stream, false)) return callback.call(stream, new ERR_STREAM_PREMATURE_CLOSE());
          }
          if (writable && !writableFinished) {
            if (!isWritableFinished(stream, false)) return callback.call(stream, new ERR_STREAM_PREMATURE_CLOSE());
          }
          callback.call(stream);
        }, "onclose");
        const onclosed = /* @__PURE__ */ __name(() => {
          closed = true;
          const errored = isWritableErrored(stream) || isReadableErrored(stream);
          if (errored && typeof errored !== "boolean") {
            return callback.call(stream, errored);
          }
          callback.call(stream);
        }, "onclosed");
        const onrequest = /* @__PURE__ */ __name(() => {
          stream.req.on("finish", onfinish);
        }, "onrequest");
        if (isRequest(stream)) {
          stream.on("complete", onfinish);
          if (!willEmitClose) {
            stream.on("abort", onclose);
          }
          if (stream.req) {
            onrequest();
          } else {
            stream.on("request", onrequest);
          }
        } else if (writable && !wState) {
          stream.on("end", onlegacyfinish);
          stream.on("close", onlegacyfinish);
        }
        if (!willEmitClose && typeof stream.aborted === "boolean") {
          stream.on("aborted", onclose);
        }
        stream.on("end", onend);
        stream.on("finish", onfinish);
        if (options.error !== false) {
          stream.on("error", onerror);
        }
        stream.on("close", onclose);
        if (closed) {
          process.nextTick(onclose);
        } else if (wState !== null && wState !== void 0 && wState.errorEmitted || rState !== null && rState !== void 0 && rState.errorEmitted) {
          if (!willEmitClose) {
            process.nextTick(onclosed);
          }
        } else if (!readable && (!willEmitClose || isReadable2(stream)) && (writableFinished || isWritable(stream) === false)) {
          process.nextTick(onclosed);
        } else if (!writable && (!willEmitClose || isWritable(stream)) && (readableFinished || isReadable2(stream) === false)) {
          process.nextTick(onclosed);
        } else if (rState && stream.req && stream.aborted) {
          process.nextTick(onclosed);
        }
        const cleanup = /* @__PURE__ */ __name(() => {
          callback = nop2;
          stream.removeListener("aborted", onclose);
          stream.removeListener("complete", onfinish);
          stream.removeListener("abort", onclose);
          stream.removeListener("request", onrequest);
          if (stream.req) stream.req.removeListener("finish", onfinish);
          stream.removeListener("end", onlegacyfinish);
          stream.removeListener("close", onlegacyfinish);
          stream.removeListener("finish", onfinish);
          stream.removeListener("end", onend);
          stream.removeListener("error", onerror);
          stream.removeListener("close", onclose);
        }, "cleanup");
        if (options.signal && !closed) {
          const abort = /* @__PURE__ */ __name(() => {
            const endCallback = callback;
            cleanup();
            endCallback.call(
              stream,
              new AbortError(void 0, {
                cause: options.signal.reason
              })
            );
          }, "abort");
          if (options.signal.aborted) {
            process.nextTick(abort);
          } else {
            addAbortListener = addAbortListener || require_util().addAbortListener;
            const disposable = addAbortListener(options.signal, abort);
            const originalCallback = callback;
            callback = once((...args) => {
              disposable[SymbolDispose]();
              originalCallback.apply(stream, args);
            });
          }
        }
        return cleanup;
      }
      __name(eos, "eos");
      function eosWeb(stream, options, callback) {
        let isAborted = false;
        let abort = nop2;
        if (options.signal) {
          abort = /* @__PURE__ */ __name(() => {
            isAborted = true;
            callback.call(
              stream,
              new AbortError(void 0, {
                cause: options.signal.reason
              })
            );
          }, "abort");
          if (options.signal.aborted) {
            process.nextTick(abort);
          } else {
            addAbortListener = addAbortListener || require_util().addAbortListener;
            const disposable = addAbortListener(options.signal, abort);
            const originalCallback = callback;
            callback = once((...args) => {
              disposable[SymbolDispose]();
              originalCallback.apply(stream, args);
            });
          }
        }
        const resolverFn = /* @__PURE__ */ __name((...args) => {
          if (!isAborted) {
            process.nextTick(() => callback.apply(stream, args));
          }
        }, "resolverFn");
        PromisePrototypeThen(stream[kIsClosedPromise].promise, resolverFn, resolverFn);
        return nop2;
      }
      __name(eosWeb, "eosWeb");
      function finished(stream, opts) {
        var _opts;
        let autoCleanup = false;
        if (opts === null) {
          opts = kEmptyObject;
        }
        if ((_opts = opts) !== null && _opts !== void 0 && _opts.cleanup) {
          validateBoolean(opts.cleanup, "cleanup");
          autoCleanup = opts.cleanup;
        }
        return new Promise2((resolve2, reject) => {
          const cleanup = eos(stream, opts, (err) => {
            if (autoCleanup) {
              cleanup();
            }
            if (err) {
              reject(err);
            } else {
              resolve2();
            }
          });
        });
      }
      __name(finished, "finished");
      module.exports = eos;
      module.exports.finished = finished;
    }
  });

  // node_modules/readable-stream/lib/internal/streams/destroy.js
  var require_destroy = __commonJS({
    "node_modules/readable-stream/lib/internal/streams/destroy.js"(exports, module) {
      "use strict";
      var process = require_browser2();
      var {
        aggregateTwoErrors,
        codes: { ERR_MULTIPLE_CALLBACK },
        AbortError
      } = require_errors();
      var { Symbol: Symbol2 } = require_primordials();
      var { kIsDestroyed, isDestroyed, isFinished, isServerRequest } = require_utils();
      var kDestroy = Symbol2("kDestroy");
      var kConstruct = Symbol2("kConstruct");
      function checkError(err, w, r) {
        if (err) {
          err.stack;
          if (w && !w.errored) {
            w.errored = err;
          }
          if (r && !r.errored) {
            r.errored = err;
          }
        }
      }
      __name(checkError, "checkError");
      function destroy(err, cb) {
        const r = this._readableState;
        const w = this._writableState;
        const s = w || r;
        if (w !== null && w !== void 0 && w.destroyed || r !== null && r !== void 0 && r.destroyed) {
          if (typeof cb === "function") {
            cb();
          }
          return this;
        }
        checkError(err, w, r);
        if (w) {
          w.destroyed = true;
        }
        if (r) {
          r.destroyed = true;
        }
        if (!s.constructed) {
          this.once(kDestroy, function(er) {
            _destroy(this, aggregateTwoErrors(er, err), cb);
          });
        } else {
          _destroy(this, err, cb);
        }
        return this;
      }
      __name(destroy, "destroy");
      function _destroy(self2, err, cb) {
        let called = false;
        function onDestroy(err2) {
          if (called) {
            return;
          }
          called = true;
          const r = self2._readableState;
          const w = self2._writableState;
          checkError(err2, w, r);
          if (w) {
            w.closed = true;
          }
          if (r) {
            r.closed = true;
          }
          if (typeof cb === "function") {
            cb(err2);
          }
          if (err2) {
            process.nextTick(emitErrorCloseNT, self2, err2);
          } else {
            process.nextTick(emitCloseNT, self2);
          }
        }
        __name(onDestroy, "onDestroy");
        try {
          self2._destroy(err || null, onDestroy);
        } catch (err2) {
          onDestroy(err2);
        }
      }
      __name(_destroy, "_destroy");
      function emitErrorCloseNT(self2, err) {
        emitErrorNT(self2, err);
        emitCloseNT(self2);
      }
      __name(emitErrorCloseNT, "emitErrorCloseNT");
      function emitCloseNT(self2) {
        const r = self2._readableState;
        const w = self2._writableState;
        if (w) {
          w.closeEmitted = true;
        }
        if (r) {
          r.closeEmitted = true;
        }
        if (w !== null && w !== void 0 && w.emitClose || r !== null && r !== void 0 && r.emitClose) {
          self2.emit("close");
        }
      }
      __name(emitCloseNT, "emitCloseNT");
      function emitErrorNT(self2, err) {
        const r = self2._readableState;
        const w = self2._writableState;
        if (w !== null && w !== void 0 && w.errorEmitted || r !== null && r !== void 0 && r.errorEmitted) {
          return;
        }
        if (w) {
          w.errorEmitted = true;
        }
        if (r) {
          r.errorEmitted = true;
        }
        self2.emit("error", err);
      }
      __name(emitErrorNT, "emitErrorNT");
      function undestroy() {
        const r = this._readableState;
        const w = this._writableState;
        if (r) {
          r.constructed = true;
          r.closed = false;
          r.closeEmitted = false;
          r.destroyed = false;
          r.errored = null;
          r.errorEmitted = false;
          r.reading = false;
          r.ended = r.readable === false;
          r.endEmitted = r.readable === false;
        }
        if (w) {
          w.constructed = true;
          w.destroyed = false;
          w.closed = false;
          w.closeEmitted = false;
          w.errored = null;
          w.errorEmitted = false;
          w.finalCalled = false;
          w.prefinished = false;
          w.ended = w.writable === false;
          w.ending = w.writable === false;
          w.finished = w.writable === false;
        }
      }
      __name(undestroy, "undestroy");
      function errorOrDestroy(stream, err, sync) {
        const r = stream._readableState;
        const w = stream._writableState;
        if (w !== null && w !== void 0 && w.destroyed || r !== null && r !== void 0 && r.destroyed) {
          return this;
        }
        if (r !== null && r !== void 0 && r.autoDestroy || w !== null && w !== void 0 && w.autoDestroy)
          stream.destroy(err);
        else if (err) {
          err.stack;
          if (w && !w.errored) {
            w.errored = err;
          }
          if (r && !r.errored) {
            r.errored = err;
          }
          if (sync) {
            process.nextTick(emitErrorNT, stream, err);
          } else {
            emitErrorNT(stream, err);
          }
        }
      }
      __name(errorOrDestroy, "errorOrDestroy");
      function construct(stream, cb) {
        if (typeof stream._construct !== "function") {
          return;
        }
        const r = stream._readableState;
        const w = stream._writableState;
        if (r) {
          r.constructed = false;
        }
        if (w) {
          w.constructed = false;
        }
        stream.once(kConstruct, cb);
        if (stream.listenerCount(kConstruct) > 1) {
          return;
        }
        process.nextTick(constructNT, stream);
      }
      __name(construct, "construct");
      function constructNT(stream) {
        let called = false;
        function onConstruct(err) {
          if (called) {
            errorOrDestroy(stream, err !== null && err !== void 0 ? err : new ERR_MULTIPLE_CALLBACK());
            return;
          }
          called = true;
          const r = stream._readableState;
          const w = stream._writableState;
          const s = w || r;
          if (r) {
            r.constructed = true;
          }
          if (w) {
            w.constructed = true;
          }
          if (s.destroyed) {
            stream.emit(kDestroy, err);
          } else if (err) {
            errorOrDestroy(stream, err, true);
          } else {
            process.nextTick(emitConstructNT, stream);
          }
        }
        __name(onConstruct, "onConstruct");
        try {
          stream._construct((err) => {
            process.nextTick(onConstruct, err);
          });
        } catch (err) {
          process.nextTick(onConstruct, err);
        }
      }
      __name(constructNT, "constructNT");
      function emitConstructNT(stream) {
        stream.emit(kConstruct);
      }
      __name(emitConstructNT, "emitConstructNT");
      function isRequest(stream) {
        return (stream === null || stream === void 0 ? void 0 : stream.setHeader) && typeof stream.abort === "function";
      }
      __name(isRequest, "isRequest");
      function emitCloseLegacy(stream) {
        stream.emit("close");
      }
      __name(emitCloseLegacy, "emitCloseLegacy");
      function emitErrorCloseLegacy(stream, err) {
        stream.emit("error", err);
        process.nextTick(emitCloseLegacy, stream);
      }
      __name(emitErrorCloseLegacy, "emitErrorCloseLegacy");
      function destroyer(stream, err) {
        if (!stream || isDestroyed(stream)) {
          return;
        }
        if (!err && !isFinished(stream)) {
          err = new AbortError();
        }
        if (isServerRequest(stream)) {
          stream.socket = null;
          stream.destroy(err);
        } else if (isRequest(stream)) {
          stream.abort();
        } else if (isRequest(stream.req)) {
          stream.req.abort();
        } else if (typeof stream.destroy === "function") {
          stream.destroy(err);
        } else if (typeof stream.close === "function") {
          stream.close();
        } else if (err) {
          process.nextTick(emitErrorCloseLegacy, stream, err);
        } else {
          process.nextTick(emitCloseLegacy, stream);
        }
        if (!stream.destroyed) {
          stream[kIsDestroyed] = true;
        }
      }
      __name(destroyer, "destroyer");
      module.exports = {
        construct,
        destroyer,
        destroy,
        undestroy,
        errorOrDestroy
      };
    }
  });

  // node_modules/readable-stream/lib/internal/streams/legacy.js
  var require_legacy = __commonJS({
    "node_modules/readable-stream/lib/internal/streams/legacy.js"(exports, module) {
      "use strict";
      var { ArrayIsArray, ObjectSetPrototypeOf } = require_primordials();
      var { EventEmitter: EE } = require_events();
      function Stream(opts) {
        EE.call(this, opts);
      }
      __name(Stream, "Stream");
      ObjectSetPrototypeOf(Stream.prototype, EE.prototype);
      ObjectSetPrototypeOf(Stream, EE);
      Stream.prototype.pipe = function(dest, options) {
        const source = this;
        function ondata(chunk) {
          if (dest.writable && dest.write(chunk) === false && source.pause) {
            source.pause();
          }
        }
        __name(ondata, "ondata");
        source.on("data", ondata);
        function ondrain() {
          if (source.readable && source.resume) {
            source.resume();
          }
        }
        __name(ondrain, "ondrain");
        dest.on("drain", ondrain);
        if (!dest._isStdio && (!options || options.end !== false)) {
          source.on("end", onend);
          source.on("close", onclose);
        }
        let didOnEnd = false;
        function onend() {
          if (didOnEnd) return;
          didOnEnd = true;
          dest.end();
        }
        __name(onend, "onend");
        function onclose() {
          if (didOnEnd) return;
          didOnEnd = true;
          if (typeof dest.destroy === "function") dest.destroy();
        }
        __name(onclose, "onclose");
        function onerror(er) {
          cleanup();
          if (EE.listenerCount(this, "error") === 0) {
            this.emit("error", er);
          }
        }
        __name(onerror, "onerror");
        prependListener(source, "error", onerror);
        prependListener(dest, "error", onerror);
        function cleanup() {
          source.removeListener("data", ondata);
          dest.removeListener("drain", ondrain);
          source.removeListener("end", onend);
          source.removeListener("close", onclose);
          source.removeListener("error", onerror);
          dest.removeListener("error", onerror);
          source.removeListener("end", cleanup);
          source.removeListener("close", cleanup);
          dest.removeListener("close", cleanup);
        }
        __name(cleanup, "cleanup");
        source.on("end", cleanup);
        source.on("close", cleanup);
        dest.on("close", cleanup);
        dest.emit("pipe", source);
        return dest;
      };
      function prependListener(emitter, event, fn) {
        if (typeof emitter.prependListener === "function") return emitter.prependListener(event, fn);
        if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);
        else if (ArrayIsArray(emitter._events[event])) emitter._events[event].unshift(fn);
        else emitter._events[event] = [fn, emitter._events[event]];
      }
      __name(prependListener, "prependListener");
      module.exports = {
        Stream,
        prependListener
      };
    }
  });

  // node_modules/readable-stream/lib/internal/streams/add-abort-signal.js
  var require_add_abort_signal = __commonJS({
    "node_modules/readable-stream/lib/internal/streams/add-abort-signal.js"(exports, module) {
      "use strict";
      var { SymbolDispose } = require_primordials();
      var { AbortError, codes } = require_errors();
      var { isNodeStream, isWebStream, kControllerErrorFunction } = require_utils();
      var eos = require_end_of_stream();
      var { ERR_INVALID_ARG_TYPE: ERR_INVALID_ARG_TYPE2 } = codes;
      var addAbortListener;
      var validateAbortSignal = /* @__PURE__ */ __name((signal, name) => {
        if (typeof signal !== "object" || !("aborted" in signal)) {
          throw new ERR_INVALID_ARG_TYPE2(name, "AbortSignal", signal);
        }
      }, "validateAbortSignal");
      module.exports.addAbortSignal = /* @__PURE__ */ __name(function addAbortSignal(signal, stream) {
        validateAbortSignal(signal, "signal");
        if (!isNodeStream(stream) && !isWebStream(stream)) {
          throw new ERR_INVALID_ARG_TYPE2("stream", ["ReadableStream", "WritableStream", "Stream"], stream);
        }
        return module.exports.addAbortSignalNoValidate(signal, stream);
      }, "addAbortSignal");
      module.exports.addAbortSignalNoValidate = function(signal, stream) {
        if (typeof signal !== "object" || !("aborted" in signal)) {
          return stream;
        }
        const onAbort = isNodeStream(stream) ? () => {
          stream.destroy(
            new AbortError(void 0, {
              cause: signal.reason
            })
          );
        } : () => {
          stream[kControllerErrorFunction](
            new AbortError(void 0, {
              cause: signal.reason
            })
          );
        };
        if (signal.aborted) {
          onAbort();
        } else {
          addAbortListener = addAbortListener || require_util().addAbortListener;
          const disposable = addAbortListener(signal, onAbort);
          eos(stream, disposable[SymbolDispose]);
        }
        return stream;
      };
    }
  });

  // node_modules/readable-stream/lib/internal/streams/buffer_list.js
  var require_buffer_list = __commonJS({
    "node_modules/readable-stream/lib/internal/streams/buffer_list.js"(exports, module) {
      "use strict";
      var { StringPrototypeSlice, SymbolIterator, TypedArrayPrototypeSet, Uint8Array: Uint8Array2 } = require_primordials();
      var { Buffer: Buffer5 } = require_buffer();
      var { inspect } = require_util();
      module.exports = class BufferList {
        static {
          __name(this, "BufferList");
        }
        constructor() {
          this.head = null;
          this.tail = null;
          this.length = 0;
        }
        push(v) {
          const entry = {
            data: v,
            next: null
          };
          if (this.length > 0) this.tail.next = entry;
          else this.head = entry;
          this.tail = entry;
          ++this.length;
        }
        unshift(v) {
          const entry = {
            data: v,
            next: this.head
          };
          if (this.length === 0) this.tail = entry;
          this.head = entry;
          ++this.length;
        }
        shift() {
          if (this.length === 0) return;
          const ret = this.head.data;
          if (this.length === 1) this.head = this.tail = null;
          else this.head = this.head.next;
          --this.length;
          return ret;
        }
        clear() {
          this.head = this.tail = null;
          this.length = 0;
        }
        join(s) {
          if (this.length === 0) return "";
          let p = this.head;
          let ret = "" + p.data;
          while ((p = p.next) !== null) ret += s + p.data;
          return ret;
        }
        concat(n) {
          if (this.length === 0) return Buffer5.alloc(0);
          const ret = Buffer5.allocUnsafe(n >>> 0);
          let p = this.head;
          let i = 0;
          while (p) {
            TypedArrayPrototypeSet(ret, p.data, i);
            i += p.data.length;
            p = p.next;
          }
          return ret;
        }
        // Consumes a specified amount of bytes or characters from the buffered data.
        consume(n, hasStrings) {
          const data = this.head.data;
          if (n < data.length) {
            const slice = data.slice(0, n);
            this.head.data = data.slice(n);
            return slice;
          }
          if (n === data.length) {
            return this.shift();
          }
          return hasStrings ? this._getString(n) : this._getBuffer(n);
        }
        first() {
          return this.head.data;
        }
        *[SymbolIterator]() {
          for (let p = this.head; p; p = p.next) {
            yield p.data;
          }
        }
        // Consumes a specified amount of characters from the buffered data.
        _getString(n) {
          let ret = "";
          let p = this.head;
          let c = 0;
          do {
            const str = p.data;
            if (n > str.length) {
              ret += str;
              n -= str.length;
            } else {
              if (n === str.length) {
                ret += str;
                ++c;
                if (p.next) this.head = p.next;
                else this.head = this.tail = null;
              } else {
                ret += StringPrototypeSlice(str, 0, n);
                this.head = p;
                p.data = StringPrototypeSlice(str, n);
              }
              break;
            }
            ++c;
          } while ((p = p.next) !== null);
          this.length -= c;
          return ret;
        }
        // Consumes a specified amount of bytes from the buffered data.
        _getBuffer(n) {
          const ret = Buffer5.allocUnsafe(n);
          const retLen = n;
          let p = this.head;
          let c = 0;
          do {
            const buf = p.data;
            if (n > buf.length) {
              TypedArrayPrototypeSet(ret, buf, retLen - n);
              n -= buf.length;
            } else {
              if (n === buf.length) {
                TypedArrayPrototypeSet(ret, buf, retLen - n);
                ++c;
                if (p.next) this.head = p.next;
                else this.head = this.tail = null;
              } else {
                TypedArrayPrototypeSet(ret, new Uint8Array2(buf.buffer, buf.byteOffset, n), retLen - n);
                this.head = p;
                p.data = buf.slice(n);
              }
              break;
            }
            ++c;
          } while ((p = p.next) !== null);
          this.length -= c;
          return ret;
        }
        // Make sure the linked list only shows the minimal necessary information.
        [Symbol.for("nodejs.util.inspect.custom")](_, options) {
          return inspect(this, {
            ...options,
            // Only inspect one level.
            depth: 0,
            // It should not recurse.
            customInspect: false
          });
        }
      };
    }
  });

  // node_modules/readable-stream/lib/internal/streams/state.js
  var require_state = __commonJS({
    "node_modules/readable-stream/lib/internal/streams/state.js"(exports, module) {
      "use strict";
      var { MathFloor, NumberIsInteger } = require_primordials();
      var { validateInteger } = require_validators();
      var { ERR_INVALID_ARG_VALUE } = require_errors().codes;
      var defaultHighWaterMarkBytes = 16 * 1024;
      var defaultHighWaterMarkObjectMode = 16;
      function highWaterMarkFrom(options, isDuplex, duplexKey) {
        return options.highWaterMark != null ? options.highWaterMark : isDuplex ? options[duplexKey] : null;
      }
      __name(highWaterMarkFrom, "highWaterMarkFrom");
      function getDefaultHighWaterMark(objectMode) {
        return objectMode ? defaultHighWaterMarkObjectMode : defaultHighWaterMarkBytes;
      }
      __name(getDefaultHighWaterMark, "getDefaultHighWaterMark");
      function setDefaultHighWaterMark(objectMode, value) {
        validateInteger(value, "value", 0);
        if (objectMode) {
          defaultHighWaterMarkObjectMode = value;
        } else {
          defaultHighWaterMarkBytes = value;
        }
      }
      __name(setDefaultHighWaterMark, "setDefaultHighWaterMark");
      function getHighWaterMark(state, options, duplexKey, isDuplex) {
        const hwm = highWaterMarkFrom(options, isDuplex, duplexKey);
        if (hwm != null) {
          if (!NumberIsInteger(hwm) || hwm < 0) {
            const name = isDuplex ? `options.${duplexKey}` : "options.highWaterMark";
            throw new ERR_INVALID_ARG_VALUE(name, hwm);
          }
          return MathFloor(hwm);
        }
        return getDefaultHighWaterMark(state.objectMode);
      }
      __name(getHighWaterMark, "getHighWaterMark");
      module.exports = {
        getHighWaterMark,
        getDefaultHighWaterMark,
        setDefaultHighWaterMark
      };
    }
  });

  // node_modules/safe-buffer/index.js
  var require_safe_buffer = __commonJS({
    "node_modules/safe-buffer/index.js"(exports, module) {
      var buffer = require_buffer();
      var Buffer5 = buffer.Buffer;
      function copyProps(src, dst) {
        for (var key in src) {
          dst[key] = src[key];
        }
      }
      __name(copyProps, "copyProps");
      if (Buffer5.from && Buffer5.alloc && Buffer5.allocUnsafe && Buffer5.allocUnsafeSlow) {
        module.exports = buffer;
      } else {
        copyProps(buffer, exports);
        exports.Buffer = SafeBuffer;
      }
      function SafeBuffer(arg, encodingOrOffset, length) {
        return Buffer5(arg, encodingOrOffset, length);
      }
      __name(SafeBuffer, "SafeBuffer");
      SafeBuffer.prototype = Object.create(Buffer5.prototype);
      copyProps(Buffer5, SafeBuffer);
      SafeBuffer.from = function(arg, encodingOrOffset, length) {
        if (typeof arg === "number") {
          throw new TypeError("Argument must not be a number");
        }
        return Buffer5(arg, encodingOrOffset, length);
      };
      SafeBuffer.alloc = function(size, fill, encoding) {
        if (typeof size !== "number") {
          throw new TypeError("Argument must be a number");
        }
        var buf = Buffer5(size);
        if (fill !== void 0) {
          if (typeof encoding === "string") {
            buf.fill(fill, encoding);
          } else {
            buf.fill(fill);
          }
        } else {
          buf.fill(0);
        }
        return buf;
      };
      SafeBuffer.allocUnsafe = function(size) {
        if (typeof size !== "number") {
          throw new TypeError("Argument must be a number");
        }
        return Buffer5(size);
      };
      SafeBuffer.allocUnsafeSlow = function(size) {
        if (typeof size !== "number") {
          throw new TypeError("Argument must be a number");
        }
        return buffer.SlowBuffer(size);
      };
    }
  });

  // node_modules/string_decoder/lib/string_decoder.js
  var require_string_decoder = __commonJS({
    "node_modules/string_decoder/lib/string_decoder.js"(exports) {
      "use strict";
      var Buffer5 = require_safe_buffer().Buffer;
      var isEncoding = Buffer5.isEncoding || function(encoding) {
        encoding = "" + encoding;
        switch (encoding && encoding.toLowerCase()) {
          case "hex":
          case "utf8":
          case "utf-8":
          case "ascii":
          case "binary":
          case "base64":
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
          case "raw":
            return true;
          default:
            return false;
        }
      };
      function _normalizeEncoding(enc) {
        if (!enc) return "utf8";
        var retried;
        while (true) {
          switch (enc) {
            case "utf8":
            case "utf-8":
              return "utf8";
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return "utf16le";
            case "latin1":
            case "binary":
              return "latin1";
            case "base64":
            case "ascii":
            case "hex":
              return enc;
            default:
              if (retried) return;
              enc = ("" + enc).toLowerCase();
              retried = true;
          }
        }
      }
      __name(_normalizeEncoding, "_normalizeEncoding");
      function normalizeEncoding(enc) {
        var nenc = _normalizeEncoding(enc);
        if (typeof nenc !== "string" && (Buffer5.isEncoding === isEncoding || !isEncoding(enc))) throw new Error("Unknown encoding: " + enc);
        return nenc || enc;
      }
      __name(normalizeEncoding, "normalizeEncoding");
      exports.StringDecoder = StringDecoder;
      function StringDecoder(encoding) {
        this.encoding = normalizeEncoding(encoding);
        var nb;
        switch (this.encoding) {
          case "utf16le":
            this.text = utf16Text;
            this.end = utf16End;
            nb = 4;
            break;
          case "utf8":
            this.fillLast = utf8FillLast;
            nb = 4;
            break;
          case "base64":
            this.text = base64Text;
            this.end = base64End;
            nb = 3;
            break;
          default:
            this.write = simpleWrite;
            this.end = simpleEnd;
            return;
        }
        this.lastNeed = 0;
        this.lastTotal = 0;
        this.lastChar = Buffer5.allocUnsafe(nb);
      }
      __name(StringDecoder, "StringDecoder");
      StringDecoder.prototype.write = function(buf) {
        if (buf.length === 0) return "";
        var r;
        var i;
        if (this.lastNeed) {
          r = this.fillLast(buf);
          if (r === void 0) return "";
          i = this.lastNeed;
          this.lastNeed = 0;
        } else {
          i = 0;
        }
        if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
        return r || "";
      };
      StringDecoder.prototype.end = utf8End;
      StringDecoder.prototype.text = utf8Text;
      StringDecoder.prototype.fillLast = function(buf) {
        if (this.lastNeed <= buf.length) {
          buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
          return this.lastChar.toString(this.encoding, 0, this.lastTotal);
        }
        buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
        this.lastNeed -= buf.length;
      };
      function utf8CheckByte(byte) {
        if (byte <= 127) return 0;
        else if (byte >> 5 === 6) return 2;
        else if (byte >> 4 === 14) return 3;
        else if (byte >> 3 === 30) return 4;
        return byte >> 6 === 2 ? -1 : -2;
      }
      __name(utf8CheckByte, "utf8CheckByte");
      function utf8CheckIncomplete(self2, buf, i) {
        var j = buf.length - 1;
        if (j < i) return 0;
        var nb = utf8CheckByte(buf[j]);
        if (nb >= 0) {
          if (nb > 0) self2.lastNeed = nb - 1;
          return nb;
        }
        if (--j < i || nb === -2) return 0;
        nb = utf8CheckByte(buf[j]);
        if (nb >= 0) {
          if (nb > 0) self2.lastNeed = nb - 2;
          return nb;
        }
        if (--j < i || nb === -2) return 0;
        nb = utf8CheckByte(buf[j]);
        if (nb >= 0) {
          if (nb > 0) {
            if (nb === 2) nb = 0;
            else self2.lastNeed = nb - 3;
          }
          return nb;
        }
        return 0;
      }
      __name(utf8CheckIncomplete, "utf8CheckIncomplete");
      function utf8CheckExtraBytes(self2, buf, p) {
        if ((buf[0] & 192) !== 128) {
          self2.lastNeed = 0;
          return "\uFFFD";
        }
        if (self2.lastNeed > 1 && buf.length > 1) {
          if ((buf[1] & 192) !== 128) {
            self2.lastNeed = 1;
            return "\uFFFD";
          }
          if (self2.lastNeed > 2 && buf.length > 2) {
            if ((buf[2] & 192) !== 128) {
              self2.lastNeed = 2;
              return "\uFFFD";
            }
          }
        }
      }
      __name(utf8CheckExtraBytes, "utf8CheckExtraBytes");
      function utf8FillLast(buf) {
        var p = this.lastTotal - this.lastNeed;
        var r = utf8CheckExtraBytes(this, buf, p);
        if (r !== void 0) return r;
        if (this.lastNeed <= buf.length) {
          buf.copy(this.lastChar, p, 0, this.lastNeed);
          return this.lastChar.toString(this.encoding, 0, this.lastTotal);
        }
        buf.copy(this.lastChar, p, 0, buf.length);
        this.lastNeed -= buf.length;
      }
      __name(utf8FillLast, "utf8FillLast");
      function utf8Text(buf, i) {
        var total = utf8CheckIncomplete(this, buf, i);
        if (!this.lastNeed) return buf.toString("utf8", i);
        this.lastTotal = total;
        var end = buf.length - (total - this.lastNeed);
        buf.copy(this.lastChar, 0, end);
        return buf.toString("utf8", i, end);
      }
      __name(utf8Text, "utf8Text");
      function utf8End(buf) {
        var r = buf && buf.length ? this.write(buf) : "";
        if (this.lastNeed) return r + "\uFFFD";
        return r;
      }
      __name(utf8End, "utf8End");
      function utf16Text(buf, i) {
        if ((buf.length - i) % 2 === 0) {
          var r = buf.toString("utf16le", i);
          if (r) {
            var c = r.charCodeAt(r.length - 1);
            if (c >= 55296 && c <= 56319) {
              this.lastNeed = 2;
              this.lastTotal = 4;
              this.lastChar[0] = buf[buf.length - 2];
              this.lastChar[1] = buf[buf.length - 1];
              return r.slice(0, -1);
            }
          }
          return r;
        }
        this.lastNeed = 1;
        this.lastTotal = 2;
        this.lastChar[0] = buf[buf.length - 1];
        return buf.toString("utf16le", i, buf.length - 1);
      }
      __name(utf16Text, "utf16Text");
      function utf16End(buf) {
        var r = buf && buf.length ? this.write(buf) : "";
        if (this.lastNeed) {
          var end = this.lastTotal - this.lastNeed;
          return r + this.lastChar.toString("utf16le", 0, end);
        }
        return r;
      }
      __name(utf16End, "utf16End");
      function base64Text(buf, i) {
        var n = (buf.length - i) % 3;
        if (n === 0) return buf.toString("base64", i);
        this.lastNeed = 3 - n;
        this.lastTotal = 3;
        if (n === 1) {
          this.lastChar[0] = buf[buf.length - 1];
        } else {
          this.lastChar[0] = buf[buf.length - 2];
          this.lastChar[1] = buf[buf.length - 1];
        }
        return buf.toString("base64", i, buf.length - n);
      }
      __name(base64Text, "base64Text");
      function base64End(buf) {
        var r = buf && buf.length ? this.write(buf) : "";
        if (this.lastNeed) return r + this.lastChar.toString("base64", 0, 3 - this.lastNeed);
        return r;
      }
      __name(base64End, "base64End");
      function simpleWrite(buf) {
        return buf.toString(this.encoding);
      }
      __name(simpleWrite, "simpleWrite");
      function simpleEnd(buf) {
        return buf && buf.length ? this.write(buf) : "";
      }
      __name(simpleEnd, "simpleEnd");
    }
  });

  // node_modules/readable-stream/lib/internal/streams/from.js
  var require_from = __commonJS({
    "node_modules/readable-stream/lib/internal/streams/from.js"(exports, module) {
      "use strict";
      var process = require_browser2();
      var { PromisePrototypeThen, SymbolAsyncIterator, SymbolIterator } = require_primordials();
      var { Buffer: Buffer5 } = require_buffer();
      var { ERR_INVALID_ARG_TYPE: ERR_INVALID_ARG_TYPE2, ERR_STREAM_NULL_VALUES } = require_errors().codes;
      function from(Readable2, iterable, opts) {
        let iterator;
        if (typeof iterable === "string" || iterable instanceof Buffer5) {
          return new Readable2({
            objectMode: true,
            ...opts,
            read: /* @__PURE__ */ __name(function() {
              this.push(iterable);
              this.push(null);
            }, "read")
          });
        }
        let isAsync;
        if (iterable && iterable[SymbolAsyncIterator]) {
          isAsync = true;
          iterator = iterable[SymbolAsyncIterator]();
        } else if (iterable && iterable[SymbolIterator]) {
          isAsync = false;
          iterator = iterable[SymbolIterator]();
        } else {
          throw new ERR_INVALID_ARG_TYPE2("iterable", ["Iterable"], iterable);
        }
        const readable = new Readable2({
          objectMode: true,
          highWaterMark: 1,
          // TODO(ronag): What options should be allowed?
          ...opts
        });
        let reading = false;
        readable._read = function() {
          if (!reading) {
            reading = true;
            next();
          }
        };
        readable._destroy = function(error, cb) {
          PromisePrototypeThen(
            close2(error),
            () => process.nextTick(cb, error),
            // nextTick is here in case cb throws
            (e) => process.nextTick(cb, e || error)
          );
        };
        async function close2(error) {
          const hadError = error !== void 0 && error !== null;
          const hasThrow = typeof iterator.throw === "function";
          if (hadError && hasThrow) {
            const { value, done } = await iterator.throw(error);
            await value;
            if (done) {
              return;
            }
          }
          if (typeof iterator.return === "function") {
            const { value } = await iterator.return();
            await value;
          }
        }
        __name(close2, "close");
        async function next() {
          for (; ; ) {
            try {
              const { value, done } = isAsync ? await iterator.next() : iterator.next();
              if (done) {
                readable.push(null);
              } else {
                const res = value && typeof value.then === "function" ? await value : value;
                if (res === null) {
                  reading = false;
                  throw new ERR_STREAM_NULL_VALUES();
                } else if (readable.push(res)) {
                  continue;
                } else {
                  reading = false;
                }
              }
            } catch (err) {
              readable.destroy(err);
            }
            break;
          }
        }
        __name(next, "next");
        return readable;
      }
      __name(from, "from");
      module.exports = from;
    }
  });

  // node_modules/readable-stream/lib/internal/streams/readable.js
  var require_readable = __commonJS({
    "node_modules/readable-stream/lib/internal/streams/readable.js"(exports, module) {
      var process = require_browser2();
      var {
        ArrayPrototypeIndexOf,
        NumberIsInteger,
        NumberIsNaN,
        NumberParseInt,
        ObjectDefineProperties,
        ObjectKeys,
        ObjectSetPrototypeOf,
        Promise: Promise2,
        SafeSet,
        SymbolAsyncDispose,
        SymbolAsyncIterator,
        Symbol: Symbol2
      } = require_primordials();
      module.exports = Readable2;
      Readable2.ReadableState = ReadableState;
      var { EventEmitter: EE } = require_events();
      var { Stream, prependListener } = require_legacy();
      var { Buffer: Buffer5 } = require_buffer();
      var { addAbortSignal } = require_add_abort_signal();
      var eos = require_end_of_stream();
      var debug = require_util().debuglog("stream", (fn) => {
        debug = fn;
      });
      var BufferList = require_buffer_list();
      var destroyImpl = require_destroy();
      var { getHighWaterMark, getDefaultHighWaterMark } = require_state();
      var {
        aggregateTwoErrors,
        codes: {
          ERR_INVALID_ARG_TYPE: ERR_INVALID_ARG_TYPE2,
          ERR_METHOD_NOT_IMPLEMENTED,
          ERR_OUT_OF_RANGE,
          ERR_STREAM_PUSH_AFTER_EOF,
          ERR_STREAM_UNSHIFT_AFTER_END_EVENT
        },
        AbortError
      } = require_errors();
      var { validateObject } = require_validators();
      var kPaused = Symbol2("kPaused");
      var { StringDecoder } = require_string_decoder();
      var from = require_from();
      ObjectSetPrototypeOf(Readable2.prototype, Stream.prototype);
      ObjectSetPrototypeOf(Readable2, Stream);
      var nop2 = /* @__PURE__ */ __name(() => {
      }, "nop");
      var { errorOrDestroy } = destroyImpl;
      var kObjectMode = 1 << 0;
      var kEnded = 1 << 1;
      var kEndEmitted = 1 << 2;
      var kReading = 1 << 3;
      var kConstructed = 1 << 4;
      var kSync = 1 << 5;
      var kNeedReadable = 1 << 6;
      var kEmittedReadable = 1 << 7;
      var kReadableListening = 1 << 8;
      var kResumeScheduled = 1 << 9;
      var kErrorEmitted = 1 << 10;
      var kEmitClose = 1 << 11;
      var kAutoDestroy = 1 << 12;
      var kDestroyed = 1 << 13;
      var kClosed = 1 << 14;
      var kCloseEmitted = 1 << 15;
      var kMultiAwaitDrain = 1 << 16;
      var kReadingMore = 1 << 17;
      var kDataEmitted = 1 << 18;
      function makeBitMapDescriptor(bit) {
        return {
          enumerable: false,
          get: /* @__PURE__ */ __name(function() {
            return (this.state & bit) !== 0;
          }, "get"),
          set: /* @__PURE__ */ __name(function(value) {
            if (value) this.state |= bit;
            else this.state &= ~bit;
          }, "set")
        };
      }
      __name(makeBitMapDescriptor, "makeBitMapDescriptor");
      ObjectDefineProperties(ReadableState.prototype, {
        objectMode: makeBitMapDescriptor(kObjectMode),
        ended: makeBitMapDescriptor(kEnded),
        endEmitted: makeBitMapDescriptor(kEndEmitted),
        reading: makeBitMapDescriptor(kReading),
        // Stream is still being constructed and cannot be
        // destroyed until construction finished or failed.
        // Async construction is opt in, therefore we start as
        // constructed.
        constructed: makeBitMapDescriptor(kConstructed),
        // A flag to be able to tell if the event 'readable'/'data' is emitted
        // immediately, or on a later tick.  We set this to true at first, because
        // any actions that shouldn't happen until "later" should generally also
        // not happen before the first read call.
        sync: makeBitMapDescriptor(kSync),
        // Whenever we return null, then we set a flag to say
        // that we're awaiting a 'readable' event emission.
        needReadable: makeBitMapDescriptor(kNeedReadable),
        emittedReadable: makeBitMapDescriptor(kEmittedReadable),
        readableListening: makeBitMapDescriptor(kReadableListening),
        resumeScheduled: makeBitMapDescriptor(kResumeScheduled),
        // True if the error was already emitted and should not be thrown again.
        errorEmitted: makeBitMapDescriptor(kErrorEmitted),
        emitClose: makeBitMapDescriptor(kEmitClose),
        autoDestroy: makeBitMapDescriptor(kAutoDestroy),
        // Has it been destroyed.
        destroyed: makeBitMapDescriptor(kDestroyed),
        // Indicates whether the stream has finished destroying.
        closed: makeBitMapDescriptor(kClosed),
        // True if close has been emitted or would have been emitted
        // depending on emitClose.
        closeEmitted: makeBitMapDescriptor(kCloseEmitted),
        multiAwaitDrain: makeBitMapDescriptor(kMultiAwaitDrain),
        // If true, a maybeReadMore has been scheduled.
        readingMore: makeBitMapDescriptor(kReadingMore),
        dataEmitted: makeBitMapDescriptor(kDataEmitted)
      });
      function ReadableState(options, stream, isDuplex) {
        if (typeof isDuplex !== "boolean") isDuplex = stream instanceof require_duplex();
        this.state = kEmitClose | kAutoDestroy | kConstructed | kSync;
        if (options && options.objectMode) this.state |= kObjectMode;
        if (isDuplex && options && options.readableObjectMode) this.state |= kObjectMode;
        this.highWaterMark = options ? getHighWaterMark(this, options, "readableHighWaterMark", isDuplex) : getDefaultHighWaterMark(false);
        this.buffer = new BufferList();
        this.length = 0;
        this.pipes = [];
        this.flowing = null;
        this[kPaused] = null;
        if (options && options.emitClose === false) this.state &= ~kEmitClose;
        if (options && options.autoDestroy === false) this.state &= ~kAutoDestroy;
        this.errored = null;
        this.defaultEncoding = options && options.defaultEncoding || "utf8";
        this.awaitDrainWriters = null;
        this.decoder = null;
        this.encoding = null;
        if (options && options.encoding) {
          this.decoder = new StringDecoder(options.encoding);
          this.encoding = options.encoding;
        }
      }
      __name(ReadableState, "ReadableState");
      function Readable2(options) {
        if (!(this instanceof Readable2)) return new Readable2(options);
        const isDuplex = this instanceof require_duplex();
        this._readableState = new ReadableState(options, this, isDuplex);
        if (options) {
          if (typeof options.read === "function") this._read = options.read;
          if (typeof options.destroy === "function") this._destroy = options.destroy;
          if (typeof options.construct === "function") this._construct = options.construct;
          if (options.signal && !isDuplex) addAbortSignal(options.signal, this);
        }
        Stream.call(this, options);
        destroyImpl.construct(this, () => {
          if (this._readableState.needReadable) {
            maybeReadMore(this, this._readableState);
          }
        });
      }
      __name(Readable2, "Readable");
      Readable2.prototype.destroy = destroyImpl.destroy;
      Readable2.prototype._undestroy = destroyImpl.undestroy;
      Readable2.prototype._destroy = function(err, cb) {
        cb(err);
      };
      Readable2.prototype[EE.captureRejectionSymbol] = function(err) {
        this.destroy(err);
      };
      Readable2.prototype[SymbolAsyncDispose] = function() {
        let error;
        if (!this.destroyed) {
          error = this.readableEnded ? null : new AbortError();
          this.destroy(error);
        }
        return new Promise2((resolve2, reject) => eos(this, (err) => err && err !== error ? reject(err) : resolve2(null)));
      };
      Readable2.prototype.push = function(chunk, encoding) {
        return readableAddChunk(this, chunk, encoding, false);
      };
      Readable2.prototype.unshift = function(chunk, encoding) {
        return readableAddChunk(this, chunk, encoding, true);
      };
      function readableAddChunk(stream, chunk, encoding, addToFront) {
        debug("readableAddChunk", chunk);
        const state = stream._readableState;
        let err;
        if ((state.state & kObjectMode) === 0) {
          if (typeof chunk === "string") {
            encoding = encoding || state.defaultEncoding;
            if (state.encoding !== encoding) {
              if (addToFront && state.encoding) {
                chunk = Buffer5.from(chunk, encoding).toString(state.encoding);
              } else {
                chunk = Buffer5.from(chunk, encoding);
                encoding = "";
              }
            }
          } else if (chunk instanceof Buffer5) {
            encoding = "";
          } else if (Stream._isUint8Array(chunk)) {
            chunk = Stream._uint8ArrayToBuffer(chunk);
            encoding = "";
          } else if (chunk != null) {
            err = new ERR_INVALID_ARG_TYPE2("chunk", ["string", "Buffer", "Uint8Array"], chunk);
          }
        }
        if (err) {
          errorOrDestroy(stream, err);
        } else if (chunk === null) {
          state.state &= ~kReading;
          onEofChunk(stream, state);
        } else if ((state.state & kObjectMode) !== 0 || chunk && chunk.length > 0) {
          if (addToFront) {
            if ((state.state & kEndEmitted) !== 0) errorOrDestroy(stream, new ERR_STREAM_UNSHIFT_AFTER_END_EVENT());
            else if (state.destroyed || state.errored) return false;
            else addChunk(stream, state, chunk, true);
          } else if (state.ended) {
            errorOrDestroy(stream, new ERR_STREAM_PUSH_AFTER_EOF());
          } else if (state.destroyed || state.errored) {
            return false;
          } else {
            state.state &= ~kReading;
            if (state.decoder && !encoding) {
              chunk = state.decoder.write(chunk);
              if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);
              else maybeReadMore(stream, state);
            } else {
              addChunk(stream, state, chunk, false);
            }
          }
        } else if (!addToFront) {
          state.state &= ~kReading;
          maybeReadMore(stream, state);
        }
        return !state.ended && (state.length < state.highWaterMark || state.length === 0);
      }
      __name(readableAddChunk, "readableAddChunk");
      function addChunk(stream, state, chunk, addToFront) {
        if (state.flowing && state.length === 0 && !state.sync && stream.listenerCount("data") > 0) {
          if ((state.state & kMultiAwaitDrain) !== 0) {
            state.awaitDrainWriters.clear();
          } else {
            state.awaitDrainWriters = null;
          }
          state.dataEmitted = true;
          stream.emit("data", chunk);
        } else {
          state.length += state.objectMode ? 1 : chunk.length;
          if (addToFront) state.buffer.unshift(chunk);
          else state.buffer.push(chunk);
          if ((state.state & kNeedReadable) !== 0) emitReadable(stream);
        }
        maybeReadMore(stream, state);
      }
      __name(addChunk, "addChunk");
      Readable2.prototype.isPaused = function() {
        const state = this._readableState;
        return state[kPaused] === true || state.flowing === false;
      };
      Readable2.prototype.setEncoding = function(enc) {
        const decoder = new StringDecoder(enc);
        this._readableState.decoder = decoder;
        this._readableState.encoding = this._readableState.decoder.encoding;
        const buffer = this._readableState.buffer;
        let content = "";
        for (const data of buffer) {
          content += decoder.write(data);
        }
        buffer.clear();
        if (content !== "") buffer.push(content);
        this._readableState.length = content.length;
        return this;
      };
      var MAX_HWM = 1073741824;
      function computeNewHighWaterMark(n) {
        if (n > MAX_HWM) {
          throw new ERR_OUT_OF_RANGE("size", "<= 1GiB", n);
        } else {
          n--;
          n |= n >>> 1;
          n |= n >>> 2;
          n |= n >>> 4;
          n |= n >>> 8;
          n |= n >>> 16;
          n++;
        }
        return n;
      }
      __name(computeNewHighWaterMark, "computeNewHighWaterMark");
      function howMuchToRead(n, state) {
        if (n <= 0 || state.length === 0 && state.ended) return 0;
        if ((state.state & kObjectMode) !== 0) return 1;
        if (NumberIsNaN(n)) {
          if (state.flowing && state.length) return state.buffer.first().length;
          return state.length;
        }
        if (n <= state.length) return n;
        return state.ended ? state.length : 0;
      }
      __name(howMuchToRead, "howMuchToRead");
      Readable2.prototype.read = function(n) {
        debug("read", n);
        if (n === void 0) {
          n = NaN;
        } else if (!NumberIsInteger(n)) {
          n = NumberParseInt(n, 10);
        }
        const state = this._readableState;
        const nOrig = n;
        if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
        if (n !== 0) state.state &= ~kEmittedReadable;
        if (n === 0 && state.needReadable && ((state.highWaterMark !== 0 ? state.length >= state.highWaterMark : state.length > 0) || state.ended)) {
          debug("read: emitReadable", state.length, state.ended);
          if (state.length === 0 && state.ended) endReadable(this);
          else emitReadable(this);
          return null;
        }
        n = howMuchToRead(n, state);
        if (n === 0 && state.ended) {
          if (state.length === 0) endReadable(this);
          return null;
        }
        let doRead = (state.state & kNeedReadable) !== 0;
        debug("need readable", doRead);
        if (state.length === 0 || state.length - n < state.highWaterMark) {
          doRead = true;
          debug("length less than watermark", doRead);
        }
        if (state.ended || state.reading || state.destroyed || state.errored || !state.constructed) {
          doRead = false;
          debug("reading, ended or constructing", doRead);
        } else if (doRead) {
          debug("do read");
          state.state |= kReading | kSync;
          if (state.length === 0) state.state |= kNeedReadable;
          try {
            this._read(state.highWaterMark);
          } catch (err) {
            errorOrDestroy(this, err);
          }
          state.state &= ~kSync;
          if (!state.reading) n = howMuchToRead(nOrig, state);
        }
        let ret;
        if (n > 0) ret = fromList(n, state);
        else ret = null;
        if (ret === null) {
          state.needReadable = state.length <= state.highWaterMark;
          n = 0;
        } else {
          state.length -= n;
          if (state.multiAwaitDrain) {
            state.awaitDrainWriters.clear();
          } else {
            state.awaitDrainWriters = null;
          }
        }
        if (state.length === 0) {
          if (!state.ended) state.needReadable = true;
          if (nOrig !== n && state.ended) endReadable(this);
        }
        if (ret !== null && !state.errorEmitted && !state.closeEmitted) {
          state.dataEmitted = true;
          this.emit("data", ret);
        }
        return ret;
      };
      function onEofChunk(stream, state) {
        debug("onEofChunk");
        if (state.ended) return;
        if (state.decoder) {
          const chunk = state.decoder.end();
          if (chunk && chunk.length) {
            state.buffer.push(chunk);
            state.length += state.objectMode ? 1 : chunk.length;
          }
        }
        state.ended = true;
        if (state.sync) {
          emitReadable(stream);
        } else {
          state.needReadable = false;
          state.emittedReadable = true;
          emitReadable_(stream);
        }
      }
      __name(onEofChunk, "onEofChunk");
      function emitReadable(stream) {
        const state = stream._readableState;
        debug("emitReadable", state.needReadable, state.emittedReadable);
        state.needReadable = false;
        if (!state.emittedReadable) {
          debug("emitReadable", state.flowing);
          state.emittedReadable = true;
          process.nextTick(emitReadable_, stream);
        }
      }
      __name(emitReadable, "emitReadable");
      function emitReadable_(stream) {
        const state = stream._readableState;
        debug("emitReadable_", state.destroyed, state.length, state.ended);
        if (!state.destroyed && !state.errored && (state.length || state.ended)) {
          stream.emit("readable");
          state.emittedReadable = false;
        }
        state.needReadable = !state.flowing && !state.ended && state.length <= state.highWaterMark;
        flow(stream);
      }
      __name(emitReadable_, "emitReadable_");
      function maybeReadMore(stream, state) {
        if (!state.readingMore && state.constructed) {
          state.readingMore = true;
          process.nextTick(maybeReadMore_, stream, state);
        }
      }
      __name(maybeReadMore, "maybeReadMore");
      function maybeReadMore_(stream, state) {
        while (!state.reading && !state.ended && (state.length < state.highWaterMark || state.flowing && state.length === 0)) {
          const len = state.length;
          debug("maybeReadMore read 0");
          stream.read(0);
          if (len === state.length)
            break;
        }
        state.readingMore = false;
      }
      __name(maybeReadMore_, "maybeReadMore_");
      Readable2.prototype._read = function(n) {
        throw new ERR_METHOD_NOT_IMPLEMENTED("_read()");
      };
      Readable2.prototype.pipe = function(dest, pipeOpts) {
        const src = this;
        const state = this._readableState;
        if (state.pipes.length === 1) {
          if (!state.multiAwaitDrain) {
            state.multiAwaitDrain = true;
            state.awaitDrainWriters = new SafeSet(state.awaitDrainWriters ? [state.awaitDrainWriters] : []);
          }
        }
        state.pipes.push(dest);
        debug("pipe count=%d opts=%j", state.pipes.length, pipeOpts);
        const doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
        const endFn = doEnd ? onend : unpipe;
        if (state.endEmitted) process.nextTick(endFn);
        else src.once("end", endFn);
        dest.on("unpipe", onunpipe);
        function onunpipe(readable, unpipeInfo) {
          debug("onunpipe");
          if (readable === src) {
            if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
              unpipeInfo.hasUnpiped = true;
              cleanup();
            }
          }
        }
        __name(onunpipe, "onunpipe");
        function onend() {
          debug("onend");
          dest.end();
        }
        __name(onend, "onend");
        let ondrain;
        let cleanedUp = false;
        function cleanup() {
          debug("cleanup");
          dest.removeListener("close", onclose);
          dest.removeListener("finish", onfinish);
          if (ondrain) {
            dest.removeListener("drain", ondrain);
          }
          dest.removeListener("error", onerror);
          dest.removeListener("unpipe", onunpipe);
          src.removeListener("end", onend);
          src.removeListener("end", unpipe);
          src.removeListener("data", ondata);
          cleanedUp = true;
          if (ondrain && state.awaitDrainWriters && (!dest._writableState || dest._writableState.needDrain)) ondrain();
        }
        __name(cleanup, "cleanup");
        function pause() {
          if (!cleanedUp) {
            if (state.pipes.length === 1 && state.pipes[0] === dest) {
              debug("false write response, pause", 0);
              state.awaitDrainWriters = dest;
              state.multiAwaitDrain = false;
            } else if (state.pipes.length > 1 && state.pipes.includes(dest)) {
              debug("false write response, pause", state.awaitDrainWriters.size);
              state.awaitDrainWriters.add(dest);
            }
            src.pause();
          }
          if (!ondrain) {
            ondrain = pipeOnDrain(src, dest);
            dest.on("drain", ondrain);
          }
        }
        __name(pause, "pause");
        src.on("data", ondata);
        function ondata(chunk) {
          debug("ondata");
          const ret = dest.write(chunk);
          debug("dest.write", ret);
          if (ret === false) {
            pause();
          }
        }
        __name(ondata, "ondata");
        function onerror(er) {
          debug("onerror", er);
          unpipe();
          dest.removeListener("error", onerror);
          if (dest.listenerCount("error") === 0) {
            const s = dest._writableState || dest._readableState;
            if (s && !s.errorEmitted) {
              errorOrDestroy(dest, er);
            } else {
              dest.emit("error", er);
            }
          }
        }
        __name(onerror, "onerror");
        prependListener(dest, "error", onerror);
        function onclose() {
          dest.removeListener("finish", onfinish);
          unpipe();
        }
        __name(onclose, "onclose");
        dest.once("close", onclose);
        function onfinish() {
          debug("onfinish");
          dest.removeListener("close", onclose);
          unpipe();
        }
        __name(onfinish, "onfinish");
        dest.once("finish", onfinish);
        function unpipe() {
          debug("unpipe");
          src.unpipe(dest);
        }
        __name(unpipe, "unpipe");
        dest.emit("pipe", src);
        if (dest.writableNeedDrain === true) {
          pause();
        } else if (!state.flowing) {
          debug("pipe resume");
          src.resume();
        }
        return dest;
      };
      function pipeOnDrain(src, dest) {
        return /* @__PURE__ */ __name(function pipeOnDrainFunctionResult() {
          const state = src._readableState;
          if (state.awaitDrainWriters === dest) {
            debug("pipeOnDrain", 1);
            state.awaitDrainWriters = null;
          } else if (state.multiAwaitDrain) {
            debug("pipeOnDrain", state.awaitDrainWriters.size);
            state.awaitDrainWriters.delete(dest);
          }
          if ((!state.awaitDrainWriters || state.awaitDrainWriters.size === 0) && src.listenerCount("data")) {
            src.resume();
          }
        }, "pipeOnDrainFunctionResult");
      }
      __name(pipeOnDrain, "pipeOnDrain");
      Readable2.prototype.unpipe = function(dest) {
        const state = this._readableState;
        const unpipeInfo = {
          hasUnpiped: false
        };
        if (state.pipes.length === 0) return this;
        if (!dest) {
          const dests = state.pipes;
          state.pipes = [];
          this.pause();
          for (let i = 0; i < dests.length; i++)
            dests[i].emit("unpipe", this, {
              hasUnpiped: false
            });
          return this;
        }
        const index = ArrayPrototypeIndexOf(state.pipes, dest);
        if (index === -1) return this;
        state.pipes.splice(index, 1);
        if (state.pipes.length === 0) this.pause();
        dest.emit("unpipe", this, unpipeInfo);
        return this;
      };
      Readable2.prototype.on = function(ev, fn) {
        const res = Stream.prototype.on.call(this, ev, fn);
        const state = this._readableState;
        if (ev === "data") {
          state.readableListening = this.listenerCount("readable") > 0;
          if (state.flowing !== false) this.resume();
        } else if (ev === "readable") {
          if (!state.endEmitted && !state.readableListening) {
            state.readableListening = state.needReadable = true;
            state.flowing = false;
            state.emittedReadable = false;
            debug("on readable", state.length, state.reading);
            if (state.length) {
              emitReadable(this);
            } else if (!state.reading) {
              process.nextTick(nReadingNextTick, this);
            }
          }
        }
        return res;
      };
      Readable2.prototype.addListener = Readable2.prototype.on;
      Readable2.prototype.removeListener = function(ev, fn) {
        const res = Stream.prototype.removeListener.call(this, ev, fn);
        if (ev === "readable") {
          process.nextTick(updateReadableListening, this);
        }
        return res;
      };
      Readable2.prototype.off = Readable2.prototype.removeListener;
      Readable2.prototype.removeAllListeners = function(ev) {
        const res = Stream.prototype.removeAllListeners.apply(this, arguments);
        if (ev === "readable" || ev === void 0) {
          process.nextTick(updateReadableListening, this);
        }
        return res;
      };
      function updateReadableListening(self2) {
        const state = self2._readableState;
        state.readableListening = self2.listenerCount("readable") > 0;
        if (state.resumeScheduled && state[kPaused] === false) {
          state.flowing = true;
        } else if (self2.listenerCount("data") > 0) {
          self2.resume();
        } else if (!state.readableListening) {
          state.flowing = null;
        }
      }
      __name(updateReadableListening, "updateReadableListening");
      function nReadingNextTick(self2) {
        debug("readable nexttick read 0");
        self2.read(0);
      }
      __name(nReadingNextTick, "nReadingNextTick");
      Readable2.prototype.resume = function() {
        const state = this._readableState;
        if (!state.flowing) {
          debug("resume");
          state.flowing = !state.readableListening;
          resume(this, state);
        }
        state[kPaused] = false;
        return this;
      };
      function resume(stream, state) {
        if (!state.resumeScheduled) {
          state.resumeScheduled = true;
          process.nextTick(resume_, stream, state);
        }
      }
      __name(resume, "resume");
      function resume_(stream, state) {
        debug("resume", state.reading);
        if (!state.reading) {
          stream.read(0);
        }
        state.resumeScheduled = false;
        stream.emit("resume");
        flow(stream);
        if (state.flowing && !state.reading) stream.read(0);
      }
      __name(resume_, "resume_");
      Readable2.prototype.pause = function() {
        debug("call pause flowing=%j", this._readableState.flowing);
        if (this._readableState.flowing !== false) {
          debug("pause");
          this._readableState.flowing = false;
          this.emit("pause");
        }
        this._readableState[kPaused] = true;
        return this;
      };
      function flow(stream) {
        const state = stream._readableState;
        debug("flow", state.flowing);
        while (state.flowing && stream.read() !== null) ;
      }
      __name(flow, "flow");
      Readable2.prototype.wrap = function(stream) {
        let paused = false;
        stream.on("data", (chunk) => {
          if (!this.push(chunk) && stream.pause) {
            paused = true;
            stream.pause();
          }
        });
        stream.on("end", () => {
          this.push(null);
        });
        stream.on("error", (err) => {
          errorOrDestroy(this, err);
        });
        stream.on("close", () => {
          this.destroy();
        });
        stream.on("destroy", () => {
          this.destroy();
        });
        this._read = () => {
          if (paused && stream.resume) {
            paused = false;
            stream.resume();
          }
        };
        const streamKeys = ObjectKeys(stream);
        for (let j = 1; j < streamKeys.length; j++) {
          const i = streamKeys[j];
          if (this[i] === void 0 && typeof stream[i] === "function") {
            this[i] = stream[i].bind(stream);
          }
        }
        return this;
      };
      Readable2.prototype[SymbolAsyncIterator] = function() {
        return streamToAsyncIterator(this);
      };
      Readable2.prototype.iterator = function(options) {
        if (options !== void 0) {
          validateObject(options, "options");
        }
        return streamToAsyncIterator(this, options);
      };
      function streamToAsyncIterator(stream, options) {
        if (typeof stream.read !== "function") {
          stream = Readable2.wrap(stream, {
            objectMode: true
          });
        }
        const iter = createAsyncIterator(stream, options);
        iter.stream = stream;
        return iter;
      }
      __name(streamToAsyncIterator, "streamToAsyncIterator");
      async function* createAsyncIterator(stream, options) {
        let callback = nop2;
        function next(resolve2) {
          if (this === stream) {
            callback();
            callback = nop2;
          } else {
            callback = resolve2;
          }
        }
        __name(next, "next");
        stream.on("readable", next);
        let error;
        const cleanup = eos(
          stream,
          {
            writable: false
          },
          (err) => {
            error = err ? aggregateTwoErrors(error, err) : null;
            callback();
            callback = nop2;
          }
        );
        try {
          while (true) {
            const chunk = stream.destroyed ? null : stream.read();
            if (chunk !== null) {
              yield chunk;
            } else if (error) {
              throw error;
            } else if (error === null) {
              return;
            } else {
              await new Promise2(next);
            }
          }
        } catch (err) {
          error = aggregateTwoErrors(error, err);
          throw error;
        } finally {
          if ((error || (options === null || options === void 0 ? void 0 : options.destroyOnReturn) !== false) && (error === void 0 || stream._readableState.autoDestroy)) {
            destroyImpl.destroyer(stream, null);
          } else {
            stream.off("readable", next);
            cleanup();
          }
        }
      }
      __name(createAsyncIterator, "createAsyncIterator");
      ObjectDefineProperties(Readable2.prototype, {
        readable: {
          __proto__: null,
          get: /* @__PURE__ */ __name(function() {
            const r = this._readableState;
            return !!r && r.readable !== false && !r.destroyed && !r.errorEmitted && !r.endEmitted;
          }, "get"),
          set: /* @__PURE__ */ __name(function(val) {
            if (this._readableState) {
              this._readableState.readable = !!val;
            }
          }, "set")
        },
        readableDidRead: {
          __proto__: null,
          enumerable: false,
          get: /* @__PURE__ */ __name(function() {
            return this._readableState.dataEmitted;
          }, "get")
        },
        readableAborted: {
          __proto__: null,
          enumerable: false,
          get: /* @__PURE__ */ __name(function() {
            return !!(this._readableState.readable !== false && (this._readableState.destroyed || this._readableState.errored) && !this._readableState.endEmitted);
          }, "get")
        },
        readableHighWaterMark: {
          __proto__: null,
          enumerable: false,
          get: /* @__PURE__ */ __name(function() {
            return this._readableState.highWaterMark;
          }, "get")
        },
        readableBuffer: {
          __proto__: null,
          enumerable: false,
          get: /* @__PURE__ */ __name(function() {
            return this._readableState && this._readableState.buffer;
          }, "get")
        },
        readableFlowing: {
          __proto__: null,
          enumerable: false,
          get: /* @__PURE__ */ __name(function() {
            return this._readableState.flowing;
          }, "get"),
          set: /* @__PURE__ */ __name(function(state) {
            if (this._readableState) {
              this._readableState.flowing = state;
            }
          }, "set")
        },
        readableLength: {
          __proto__: null,
          enumerable: false,
          get: /* @__PURE__ */ __name(function() {
            return this._readableState.length;
          }, "get")
        },
        readableObjectMode: {
          __proto__: null,
          enumerable: false,
          get: /* @__PURE__ */ __name(function() {
            return this._readableState ? this._readableState.objectMode : false;
          }, "get")
        },
        readableEncoding: {
          __proto__: null,
          enumerable: false,
          get: /* @__PURE__ */ __name(function() {
            return this._readableState ? this._readableState.encoding : null;
          }, "get")
        },
        errored: {
          __proto__: null,
          enumerable: false,
          get: /* @__PURE__ */ __name(function() {
            return this._readableState ? this._readableState.errored : null;
          }, "get")
        },
        closed: {
          __proto__: null,
          get: /* @__PURE__ */ __name(function() {
            return this._readableState ? this._readableState.closed : false;
          }, "get")
        },
        destroyed: {
          __proto__: null,
          enumerable: false,
          get: /* @__PURE__ */ __name(function() {
            return this._readableState ? this._readableState.destroyed : false;
          }, "get"),
          set: /* @__PURE__ */ __name(function(value) {
            if (!this._readableState) {
              return;
            }
            this._readableState.destroyed = value;
          }, "set")
        },
        readableEnded: {
          __proto__: null,
          enumerable: false,
          get: /* @__PURE__ */ __name(function() {
            return this._readableState ? this._readableState.endEmitted : false;
          }, "get")
        }
      });
      ObjectDefineProperties(ReadableState.prototype, {
        // Legacy getter for `pipesCount`.
        pipesCount: {
          __proto__: null,
          get: /* @__PURE__ */ __name(function() {
            return this.pipes.length;
          }, "get")
        },
        // Legacy property for `paused`.
        paused: {
          __proto__: null,
          get: /* @__PURE__ */ __name(function() {
            return this[kPaused] !== false;
          }, "get"),
          set: /* @__PURE__ */ __name(function(value) {
            this[kPaused] = !!value;
          }, "set")
        }
      });
      Readable2._fromList = fromList;
      function fromList(n, state) {
        if (state.length === 0) return null;
        let ret;
        if (state.objectMode) ret = state.buffer.shift();
        else if (!n || n >= state.length) {
          if (state.decoder) ret = state.buffer.join("");
          else if (state.buffer.length === 1) ret = state.buffer.first();
          else ret = state.buffer.concat(state.length);
          state.buffer.clear();
        } else {
          ret = state.buffer.consume(n, state.decoder);
        }
        return ret;
      }
      __name(fromList, "fromList");
      function endReadable(stream) {
        const state = stream._readableState;
        debug("endReadable", state.endEmitted);
        if (!state.endEmitted) {
          state.ended = true;
          process.nextTick(endReadableNT, state, stream);
        }
      }
      __name(endReadable, "endReadable");
      function endReadableNT(state, stream) {
        debug("endReadableNT", state.endEmitted, state.length);
        if (!state.errored && !state.closeEmitted && !state.endEmitted && state.length === 0) {
          state.endEmitted = true;
          stream.emit("end");
          if (stream.writable && stream.allowHalfOpen === false) {
            process.nextTick(endWritableNT, stream);
          } else if (state.autoDestroy) {
            const wState = stream._writableState;
            const autoDestroy = !wState || wState.autoDestroy && // We don't expect the writable to ever 'finish'
            // if writable is explicitly set to false.
            (wState.finished || wState.writable === false);
            if (autoDestroy) {
              stream.destroy();
            }
          }
        }
      }
      __name(endReadableNT, "endReadableNT");
      function endWritableNT(stream) {
        const writable = stream.writable && !stream.writableEnded && !stream.destroyed;
        if (writable) {
          stream.end();
        }
      }
      __name(endWritableNT, "endWritableNT");
      Readable2.from = function(iterable, opts) {
        return from(Readable2, iterable, opts);
      };
      var webStreamsAdapters;
      function lazyWebStreams() {
        if (webStreamsAdapters === void 0) webStreamsAdapters = {};
        return webStreamsAdapters;
      }
      __name(lazyWebStreams, "lazyWebStreams");
      Readable2.fromWeb = function(readableStream, options) {
        return lazyWebStreams().newStreamReadableFromReadableStream(readableStream, options);
      };
      Readable2.toWeb = function(streamReadable, options) {
        return lazyWebStreams().newReadableStreamFromStreamReadable(streamReadable, options);
      };
      Readable2.wrap = function(src, options) {
        var _ref, _src$readableObjectMo;
        return new Readable2({
          objectMode: (_ref = (_src$readableObjectMo = src.readableObjectMode) !== null && _src$readableObjectMo !== void 0 ? _src$readableObjectMo : src.objectMode) !== null && _ref !== void 0 ? _ref : true,
          ...options,
          destroy: /* @__PURE__ */ __name(function(err, callback) {
            destroyImpl.destroyer(src, err);
            callback(err);
          }, "destroy")
        }).wrap(src);
      };
    }
  });

  // node_modules/readable-stream/lib/internal/streams/writable.js
  var require_writable = __commonJS({
    "node_modules/readable-stream/lib/internal/streams/writable.js"(exports, module) {
      var process = require_browser2();
      var {
        ArrayPrototypeSlice,
        Error: Error2,
        FunctionPrototypeSymbolHasInstance,
        ObjectDefineProperty,
        ObjectDefineProperties,
        ObjectSetPrototypeOf,
        StringPrototypeToLowerCase,
        Symbol: Symbol2,
        SymbolHasInstance
      } = require_primordials();
      module.exports = Writable2;
      Writable2.WritableState = WritableState;
      var { EventEmitter: EE } = require_events();
      var Stream = require_legacy().Stream;
      var { Buffer: Buffer5 } = require_buffer();
      var destroyImpl = require_destroy();
      var { addAbortSignal } = require_add_abort_signal();
      var { getHighWaterMark, getDefaultHighWaterMark } = require_state();
      var {
        ERR_INVALID_ARG_TYPE: ERR_INVALID_ARG_TYPE2,
        ERR_METHOD_NOT_IMPLEMENTED,
        ERR_MULTIPLE_CALLBACK,
        ERR_STREAM_CANNOT_PIPE,
        ERR_STREAM_DESTROYED,
        ERR_STREAM_ALREADY_FINISHED,
        ERR_STREAM_NULL_VALUES,
        ERR_STREAM_WRITE_AFTER_END,
        ERR_UNKNOWN_ENCODING
      } = require_errors().codes;
      var { errorOrDestroy } = destroyImpl;
      ObjectSetPrototypeOf(Writable2.prototype, Stream.prototype);
      ObjectSetPrototypeOf(Writable2, Stream);
      function nop2() {
      }
      __name(nop2, "nop");
      var kOnFinished = Symbol2("kOnFinished");
      function WritableState(options, stream, isDuplex) {
        if (typeof isDuplex !== "boolean") isDuplex = stream instanceof require_duplex();
        this.objectMode = !!(options && options.objectMode);
        if (isDuplex) this.objectMode = this.objectMode || !!(options && options.writableObjectMode);
        this.highWaterMark = options ? getHighWaterMark(this, options, "writableHighWaterMark", isDuplex) : getDefaultHighWaterMark(false);
        this.finalCalled = false;
        this.needDrain = false;
        this.ending = false;
        this.ended = false;
        this.finished = false;
        this.destroyed = false;
        const noDecode = !!(options && options.decodeStrings === false);
        this.decodeStrings = !noDecode;
        this.defaultEncoding = options && options.defaultEncoding || "utf8";
        this.length = 0;
        this.writing = false;
        this.corked = 0;
        this.sync = true;
        this.bufferProcessing = false;
        this.onwrite = onwrite.bind(void 0, stream);
        this.writecb = null;
        this.writelen = 0;
        this.afterWriteTickInfo = null;
        resetBuffer(this);
        this.pendingcb = 0;
        this.constructed = true;
        this.prefinished = false;
        this.errorEmitted = false;
        this.emitClose = !options || options.emitClose !== false;
        this.autoDestroy = !options || options.autoDestroy !== false;
        this.errored = null;
        this.closed = false;
        this.closeEmitted = false;
        this[kOnFinished] = [];
      }
      __name(WritableState, "WritableState");
      function resetBuffer(state) {
        state.buffered = [];
        state.bufferedIndex = 0;
        state.allBuffers = true;
        state.allNoop = true;
      }
      __name(resetBuffer, "resetBuffer");
      WritableState.prototype.getBuffer = /* @__PURE__ */ __name(function getBuffer() {
        return ArrayPrototypeSlice(this.buffered, this.bufferedIndex);
      }, "getBuffer");
      ObjectDefineProperty(WritableState.prototype, "bufferedRequestCount", {
        __proto__: null,
        get: /* @__PURE__ */ __name(function() {
          return this.buffered.length - this.bufferedIndex;
        }, "get")
      });
      function Writable2(options) {
        const isDuplex = this instanceof require_duplex();
        if (!isDuplex && !FunctionPrototypeSymbolHasInstance(Writable2, this)) return new Writable2(options);
        this._writableState = new WritableState(options, this, isDuplex);
        if (options) {
          if (typeof options.write === "function") this._write = options.write;
          if (typeof options.writev === "function") this._writev = options.writev;
          if (typeof options.destroy === "function") this._destroy = options.destroy;
          if (typeof options.final === "function") this._final = options.final;
          if (typeof options.construct === "function") this._construct = options.construct;
          if (options.signal) addAbortSignal(options.signal, this);
        }
        Stream.call(this, options);
        destroyImpl.construct(this, () => {
          const state = this._writableState;
          if (!state.writing) {
            clearBuffer(this, state);
          }
          finishMaybe(this, state);
        });
      }
      __name(Writable2, "Writable");
      ObjectDefineProperty(Writable2, SymbolHasInstance, {
        __proto__: null,
        value: /* @__PURE__ */ __name(function(object) {
          if (FunctionPrototypeSymbolHasInstance(this, object)) return true;
          if (this !== Writable2) return false;
          return object && object._writableState instanceof WritableState;
        }, "value")
      });
      Writable2.prototype.pipe = function() {
        errorOrDestroy(this, new ERR_STREAM_CANNOT_PIPE());
      };
      function _write(stream, chunk, encoding, cb) {
        const state = stream._writableState;
        if (typeof encoding === "function") {
          cb = encoding;
          encoding = state.defaultEncoding;
        } else {
          if (!encoding) encoding = state.defaultEncoding;
          else if (encoding !== "buffer" && !Buffer5.isEncoding(encoding)) throw new ERR_UNKNOWN_ENCODING(encoding);
          if (typeof cb !== "function") cb = nop2;
        }
        if (chunk === null) {
          throw new ERR_STREAM_NULL_VALUES();
        } else if (!state.objectMode) {
          if (typeof chunk === "string") {
            if (state.decodeStrings !== false) {
              chunk = Buffer5.from(chunk, encoding);
              encoding = "buffer";
            }
          } else if (chunk instanceof Buffer5) {
            encoding = "buffer";
          } else if (Stream._isUint8Array(chunk)) {
            chunk = Stream._uint8ArrayToBuffer(chunk);
            encoding = "buffer";
          } else {
            throw new ERR_INVALID_ARG_TYPE2("chunk", ["string", "Buffer", "Uint8Array"], chunk);
          }
        }
        let err;
        if (state.ending) {
          err = new ERR_STREAM_WRITE_AFTER_END();
        } else if (state.destroyed) {
          err = new ERR_STREAM_DESTROYED("write");
        }
        if (err) {
          process.nextTick(cb, err);
          errorOrDestroy(stream, err, true);
          return err;
        }
        state.pendingcb++;
        return writeOrBuffer(stream, state, chunk, encoding, cb);
      }
      __name(_write, "_write");
      Writable2.prototype.write = function(chunk, encoding, cb) {
        return _write(this, chunk, encoding, cb) === true;
      };
      Writable2.prototype.cork = function() {
        this._writableState.corked++;
      };
      Writable2.prototype.uncork = function() {
        const state = this._writableState;
        if (state.corked) {
          state.corked--;
          if (!state.writing) clearBuffer(this, state);
        }
      };
      Writable2.prototype.setDefaultEncoding = /* @__PURE__ */ __name(function setDefaultEncoding(encoding) {
        if (typeof encoding === "string") encoding = StringPrototypeToLowerCase(encoding);
        if (!Buffer5.isEncoding(encoding)) throw new ERR_UNKNOWN_ENCODING(encoding);
        this._writableState.defaultEncoding = encoding;
        return this;
      }, "setDefaultEncoding");
      function writeOrBuffer(stream, state, chunk, encoding, callback) {
        const len = state.objectMode ? 1 : chunk.length;
        state.length += len;
        const ret = state.length < state.highWaterMark;
        if (!ret) state.needDrain = true;
        if (state.writing || state.corked || state.errored || !state.constructed) {
          state.buffered.push({
            chunk,
            encoding,
            callback
          });
          if (state.allBuffers && encoding !== "buffer") {
            state.allBuffers = false;
          }
          if (state.allNoop && callback !== nop2) {
            state.allNoop = false;
          }
        } else {
          state.writelen = len;
          state.writecb = callback;
          state.writing = true;
          state.sync = true;
          stream._write(chunk, encoding, state.onwrite);
          state.sync = false;
        }
        return ret && !state.errored && !state.destroyed;
      }
      __name(writeOrBuffer, "writeOrBuffer");
      function doWrite(stream, state, writev2, len, chunk, encoding, cb) {
        state.writelen = len;
        state.writecb = cb;
        state.writing = true;
        state.sync = true;
        if (state.destroyed) state.onwrite(new ERR_STREAM_DESTROYED("write"));
        else if (writev2) stream._writev(chunk, state.onwrite);
        else stream._write(chunk, encoding, state.onwrite);
        state.sync = false;
      }
      __name(doWrite, "doWrite");
      function onwriteError(stream, state, er, cb) {
        --state.pendingcb;
        cb(er);
        errorBuffer(state);
        errorOrDestroy(stream, er);
      }
      __name(onwriteError, "onwriteError");
      function onwrite(stream, er) {
        const state = stream._writableState;
        const sync = state.sync;
        const cb = state.writecb;
        if (typeof cb !== "function") {
          errorOrDestroy(stream, new ERR_MULTIPLE_CALLBACK());
          return;
        }
        state.writing = false;
        state.writecb = null;
        state.length -= state.writelen;
        state.writelen = 0;
        if (er) {
          er.stack;
          if (!state.errored) {
            state.errored = er;
          }
          if (stream._readableState && !stream._readableState.errored) {
            stream._readableState.errored = er;
          }
          if (sync) {
            process.nextTick(onwriteError, stream, state, er, cb);
          } else {
            onwriteError(stream, state, er, cb);
          }
        } else {
          if (state.buffered.length > state.bufferedIndex) {
            clearBuffer(stream, state);
          }
          if (sync) {
            if (state.afterWriteTickInfo !== null && state.afterWriteTickInfo.cb === cb) {
              state.afterWriteTickInfo.count++;
            } else {
              state.afterWriteTickInfo = {
                count: 1,
                cb,
                stream,
                state
              };
              process.nextTick(afterWriteTick, state.afterWriteTickInfo);
            }
          } else {
            afterWrite(stream, state, 1, cb);
          }
        }
      }
      __name(onwrite, "onwrite");
      function afterWriteTick({ stream, state, count, cb }) {
        state.afterWriteTickInfo = null;
        return afterWrite(stream, state, count, cb);
      }
      __name(afterWriteTick, "afterWriteTick");
      function afterWrite(stream, state, count, cb) {
        const needDrain = !state.ending && !stream.destroyed && state.length === 0 && state.needDrain;
        if (needDrain) {
          state.needDrain = false;
          stream.emit("drain");
        }
        while (count-- > 0) {
          state.pendingcb--;
          cb();
        }
        if (state.destroyed) {
          errorBuffer(state);
        }
        finishMaybe(stream, state);
      }
      __name(afterWrite, "afterWrite");
      function errorBuffer(state) {
        if (state.writing) {
          return;
        }
        for (let n = state.bufferedIndex; n < state.buffered.length; ++n) {
          var _state$errored;
          const { chunk, callback } = state.buffered[n];
          const len = state.objectMode ? 1 : chunk.length;
          state.length -= len;
          callback(
            (_state$errored = state.errored) !== null && _state$errored !== void 0 ? _state$errored : new ERR_STREAM_DESTROYED("write")
          );
        }
        const onfinishCallbacks = state[kOnFinished].splice(0);
        for (let i = 0; i < onfinishCallbacks.length; i++) {
          var _state$errored2;
          onfinishCallbacks[i](
            (_state$errored2 = state.errored) !== null && _state$errored2 !== void 0 ? _state$errored2 : new ERR_STREAM_DESTROYED("end")
          );
        }
        resetBuffer(state);
      }
      __name(errorBuffer, "errorBuffer");
      function clearBuffer(stream, state) {
        if (state.corked || state.bufferProcessing || state.destroyed || !state.constructed) {
          return;
        }
        const { buffered, bufferedIndex, objectMode } = state;
        const bufferedLength = buffered.length - bufferedIndex;
        if (!bufferedLength) {
          return;
        }
        let i = bufferedIndex;
        state.bufferProcessing = true;
        if (bufferedLength > 1 && stream._writev) {
          state.pendingcb -= bufferedLength - 1;
          const callback = state.allNoop ? nop2 : (err) => {
            for (let n = i; n < buffered.length; ++n) {
              buffered[n].callback(err);
            }
          };
          const chunks = state.allNoop && i === 0 ? buffered : ArrayPrototypeSlice(buffered, i);
          chunks.allBuffers = state.allBuffers;
          doWrite(stream, state, true, state.length, chunks, "", callback);
          resetBuffer(state);
        } else {
          do {
            const { chunk, encoding, callback } = buffered[i];
            buffered[i++] = null;
            const len = objectMode ? 1 : chunk.length;
            doWrite(stream, state, false, len, chunk, encoding, callback);
          } while (i < buffered.length && !state.writing);
          if (i === buffered.length) {
            resetBuffer(state);
          } else if (i > 256) {
            buffered.splice(0, i);
            state.bufferedIndex = 0;
          } else {
            state.bufferedIndex = i;
          }
        }
        state.bufferProcessing = false;
      }
      __name(clearBuffer, "clearBuffer");
      Writable2.prototype._write = function(chunk, encoding, cb) {
        if (this._writev) {
          this._writev(
            [
              {
                chunk,
                encoding
              }
            ],
            cb
          );
        } else {
          throw new ERR_METHOD_NOT_IMPLEMENTED("_write()");
        }
      };
      Writable2.prototype._writev = null;
      Writable2.prototype.end = function(chunk, encoding, cb) {
        const state = this._writableState;
        if (typeof chunk === "function") {
          cb = chunk;
          chunk = null;
          encoding = null;
        } else if (typeof encoding === "function") {
          cb = encoding;
          encoding = null;
        }
        let err;
        if (chunk !== null && chunk !== void 0) {
          const ret = _write(this, chunk, encoding);
          if (ret instanceof Error2) {
            err = ret;
          }
        }
        if (state.corked) {
          state.corked = 1;
          this.uncork();
        }
        if (err) {
        } else if (!state.errored && !state.ending) {
          state.ending = true;
          finishMaybe(this, state, true);
          state.ended = true;
        } else if (state.finished) {
          err = new ERR_STREAM_ALREADY_FINISHED("end");
        } else if (state.destroyed) {
          err = new ERR_STREAM_DESTROYED("end");
        }
        if (typeof cb === "function") {
          if (err || state.finished) {
            process.nextTick(cb, err);
          } else {
            state[kOnFinished].push(cb);
          }
        }
        return this;
      };
      function needFinish(state) {
        return state.ending && !state.destroyed && state.constructed && state.length === 0 && !state.errored && state.buffered.length === 0 && !state.finished && !state.writing && !state.errorEmitted && !state.closeEmitted;
      }
      __name(needFinish, "needFinish");
      function callFinal(stream, state) {
        let called = false;
        function onFinish(err) {
          if (called) {
            errorOrDestroy(stream, err !== null && err !== void 0 ? err : ERR_MULTIPLE_CALLBACK());
            return;
          }
          called = true;
          state.pendingcb--;
          if (err) {
            const onfinishCallbacks = state[kOnFinished].splice(0);
            for (let i = 0; i < onfinishCallbacks.length; i++) {
              onfinishCallbacks[i](err);
            }
            errorOrDestroy(stream, err, state.sync);
          } else if (needFinish(state)) {
            state.prefinished = true;
            stream.emit("prefinish");
            state.pendingcb++;
            process.nextTick(finish, stream, state);
          }
        }
        __name(onFinish, "onFinish");
        state.sync = true;
        state.pendingcb++;
        try {
          stream._final(onFinish);
        } catch (err) {
          onFinish(err);
        }
        state.sync = false;
      }
      __name(callFinal, "callFinal");
      function prefinish(stream, state) {
        if (!state.prefinished && !state.finalCalled) {
          if (typeof stream._final === "function" && !state.destroyed) {
            state.finalCalled = true;
            callFinal(stream, state);
          } else {
            state.prefinished = true;
            stream.emit("prefinish");
          }
        }
      }
      __name(prefinish, "prefinish");
      function finishMaybe(stream, state, sync) {
        if (needFinish(state)) {
          prefinish(stream, state);
          if (state.pendingcb === 0) {
            if (sync) {
              state.pendingcb++;
              process.nextTick(
                (stream2, state2) => {
                  if (needFinish(state2)) {
                    finish(stream2, state2);
                  } else {
                    state2.pendingcb--;
                  }
                },
                stream,
                state
              );
            } else if (needFinish(state)) {
              state.pendingcb++;
              finish(stream, state);
            }
          }
        }
      }
      __name(finishMaybe, "finishMaybe");
      function finish(stream, state) {
        state.pendingcb--;
        state.finished = true;
        const onfinishCallbacks = state[kOnFinished].splice(0);
        for (let i = 0; i < onfinishCallbacks.length; i++) {
          onfinishCallbacks[i]();
        }
        stream.emit("finish");
        if (state.autoDestroy) {
          const rState = stream._readableState;
          const autoDestroy = !rState || rState.autoDestroy && // We don't expect the readable to ever 'end'
          // if readable is explicitly set to false.
          (rState.endEmitted || rState.readable === false);
          if (autoDestroy) {
            stream.destroy();
          }
        }
      }
      __name(finish, "finish");
      ObjectDefineProperties(Writable2.prototype, {
        closed: {
          __proto__: null,
          get: /* @__PURE__ */ __name(function() {
            return this._writableState ? this._writableState.closed : false;
          }, "get")
        },
        destroyed: {
          __proto__: null,
          get: /* @__PURE__ */ __name(function() {
            return this._writableState ? this._writableState.destroyed : false;
          }, "get"),
          set: /* @__PURE__ */ __name(function(value) {
            if (this._writableState) {
              this._writableState.destroyed = value;
            }
          }, "set")
        },
        writable: {
          __proto__: null,
          get: /* @__PURE__ */ __name(function() {
            const w = this._writableState;
            return !!w && w.writable !== false && !w.destroyed && !w.errored && !w.ending && !w.ended;
          }, "get"),
          set: /* @__PURE__ */ __name(function(val) {
            if (this._writableState) {
              this._writableState.writable = !!val;
            }
          }, "set")
        },
        writableFinished: {
          __proto__: null,
          get: /* @__PURE__ */ __name(function() {
            return this._writableState ? this._writableState.finished : false;
          }, "get")
        },
        writableObjectMode: {
          __proto__: null,
          get: /* @__PURE__ */ __name(function() {
            return this._writableState ? this._writableState.objectMode : false;
          }, "get")
        },
        writableBuffer: {
          __proto__: null,
          get: /* @__PURE__ */ __name(function() {
            return this._writableState && this._writableState.getBuffer();
          }, "get")
        },
        writableEnded: {
          __proto__: null,
          get: /* @__PURE__ */ __name(function() {
            return this._writableState ? this._writableState.ending : false;
          }, "get")
        },
        writableNeedDrain: {
          __proto__: null,
          get: /* @__PURE__ */ __name(function() {
            const wState = this._writableState;
            if (!wState) return false;
            return !wState.destroyed && !wState.ending && wState.needDrain;
          }, "get")
        },
        writableHighWaterMark: {
          __proto__: null,
          get: /* @__PURE__ */ __name(function() {
            return this._writableState && this._writableState.highWaterMark;
          }, "get")
        },
        writableCorked: {
          __proto__: null,
          get: /* @__PURE__ */ __name(function() {
            return this._writableState ? this._writableState.corked : 0;
          }, "get")
        },
        writableLength: {
          __proto__: null,
          get: /* @__PURE__ */ __name(function() {
            return this._writableState && this._writableState.length;
          }, "get")
        },
        errored: {
          __proto__: null,
          enumerable: false,
          get: /* @__PURE__ */ __name(function() {
            return this._writableState ? this._writableState.errored : null;
          }, "get")
        },
        writableAborted: {
          __proto__: null,
          enumerable: false,
          get: /* @__PURE__ */ __name(function() {
            return !!(this._writableState.writable !== false && (this._writableState.destroyed || this._writableState.errored) && !this._writableState.finished);
          }, "get")
        }
      });
      var destroy = destroyImpl.destroy;
      Writable2.prototype.destroy = function(err, cb) {
        const state = this._writableState;
        if (!state.destroyed && (state.bufferedIndex < state.buffered.length || state[kOnFinished].length)) {
          process.nextTick(errorBuffer, state);
        }
        destroy.call(this, err, cb);
        return this;
      };
      Writable2.prototype._undestroy = destroyImpl.undestroy;
      Writable2.prototype._destroy = function(err, cb) {
        cb(err);
      };
      Writable2.prototype[EE.captureRejectionSymbol] = function(err) {
        this.destroy(err);
      };
      var webStreamsAdapters;
      function lazyWebStreams() {
        if (webStreamsAdapters === void 0) webStreamsAdapters = {};
        return webStreamsAdapters;
      }
      __name(lazyWebStreams, "lazyWebStreams");
      Writable2.fromWeb = function(writableStream, options) {
        return lazyWebStreams().newStreamWritableFromWritableStream(writableStream, options);
      };
      Writable2.toWeb = function(streamWritable) {
        return lazyWebStreams().newWritableStreamFromStreamWritable(streamWritable);
      };
    }
  });

  // node_modules/readable-stream/lib/internal/streams/duplexify.js
  var require_duplexify = __commonJS({
    "node_modules/readable-stream/lib/internal/streams/duplexify.js"(exports, module) {
      var process = require_browser2();
      var bufferModule = require_buffer();
      var {
        isReadable: isReadable2,
        isWritable,
        isIterable,
        isNodeStream,
        isReadableNodeStream,
        isWritableNodeStream,
        isDuplexNodeStream,
        isReadableStream,
        isWritableStream
      } = require_utils();
      var eos = require_end_of_stream();
      var {
        AbortError,
        codes: { ERR_INVALID_ARG_TYPE: ERR_INVALID_ARG_TYPE2, ERR_INVALID_RETURN_VALUE }
      } = require_errors();
      var { destroyer } = require_destroy();
      var Duplex = require_duplex();
      var Readable2 = require_readable();
      var Writable2 = require_writable();
      var { createDeferredPromise } = require_util();
      var from = require_from();
      var Blob2 = globalThis.Blob || bufferModule.Blob;
      var isBlob = typeof Blob2 !== "undefined" ? /* @__PURE__ */ __name(function isBlob2(b) {
        return b instanceof Blob2;
      }, "isBlob") : /* @__PURE__ */ __name(function isBlob2(b) {
        return false;
      }, "isBlob");
      var AbortController = globalThis.AbortController || require_browser().AbortController;
      var { FunctionPrototypeCall } = require_primordials();
      var Duplexify = class extends Duplex {
        static {
          __name(this, "Duplexify");
        }
        constructor(options) {
          super(options);
          if ((options === null || options === void 0 ? void 0 : options.readable) === false) {
            this._readableState.readable = false;
            this._readableState.ended = true;
            this._readableState.endEmitted = true;
          }
          if ((options === null || options === void 0 ? void 0 : options.writable) === false) {
            this._writableState.writable = false;
            this._writableState.ending = true;
            this._writableState.ended = true;
            this._writableState.finished = true;
          }
        }
      };
      module.exports = /* @__PURE__ */ __name(function duplexify(body, name) {
        if (isDuplexNodeStream(body)) {
          return body;
        }
        if (isReadableNodeStream(body)) {
          return _duplexify({
            readable: body
          });
        }
        if (isWritableNodeStream(body)) {
          return _duplexify({
            writable: body
          });
        }
        if (isNodeStream(body)) {
          return _duplexify({
            writable: false,
            readable: false
          });
        }
        if (isReadableStream(body)) {
          return _duplexify({
            readable: Readable2.fromWeb(body)
          });
        }
        if (isWritableStream(body)) {
          return _duplexify({
            writable: Writable2.fromWeb(body)
          });
        }
        if (typeof body === "function") {
          const { value, write: write2, final, destroy } = fromAsyncGen(body);
          if (isIterable(value)) {
            return from(Duplexify, value, {
              // TODO (ronag): highWaterMark?
              objectMode: true,
              write: write2,
              final,
              destroy
            });
          }
          const then2 = value === null || value === void 0 ? void 0 : value.then;
          if (typeof then2 === "function") {
            let d;
            const promise = FunctionPrototypeCall(
              then2,
              value,
              (val) => {
                if (val != null) {
                  throw new ERR_INVALID_RETURN_VALUE("nully", "body", val);
                }
              },
              (err) => {
                destroyer(d, err);
              }
            );
            return d = new Duplexify({
              // TODO (ronag): highWaterMark?
              objectMode: true,
              readable: false,
              write: write2,
              final: /* @__PURE__ */ __name(function(cb) {
                final(async () => {
                  try {
                    await promise;
                    process.nextTick(cb, null);
                  } catch (err) {
                    process.nextTick(cb, err);
                  }
                });
              }, "final"),
              destroy
            });
          }
          throw new ERR_INVALID_RETURN_VALUE("Iterable, AsyncIterable or AsyncFunction", name, value);
        }
        if (isBlob(body)) {
          return duplexify(body.arrayBuffer());
        }
        if (isIterable(body)) {
          return from(Duplexify, body, {
            // TODO (ronag): highWaterMark?
            objectMode: true,
            writable: false
          });
        }
        if (isReadableStream(body === null || body === void 0 ? void 0 : body.readable) && isWritableStream(body === null || body === void 0 ? void 0 : body.writable)) {
          return Duplexify.fromWeb(body);
        }
        if (typeof (body === null || body === void 0 ? void 0 : body.writable) === "object" || typeof (body === null || body === void 0 ? void 0 : body.readable) === "object") {
          const readable = body !== null && body !== void 0 && body.readable ? isReadableNodeStream(body === null || body === void 0 ? void 0 : body.readable) ? body === null || body === void 0 ? void 0 : body.readable : duplexify(body.readable) : void 0;
          const writable = body !== null && body !== void 0 && body.writable ? isWritableNodeStream(body === null || body === void 0 ? void 0 : body.writable) ? body === null || body === void 0 ? void 0 : body.writable : duplexify(body.writable) : void 0;
          return _duplexify({
            readable,
            writable
          });
        }
        const then = body === null || body === void 0 ? void 0 : body.then;
        if (typeof then === "function") {
          let d;
          FunctionPrototypeCall(
            then,
            body,
            (val) => {
              if (val != null) {
                d.push(val);
              }
              d.push(null);
            },
            (err) => {
              destroyer(d, err);
            }
          );
          return d = new Duplexify({
            objectMode: true,
            writable: false,
            read: /* @__PURE__ */ __name(function() {
            }, "read")
          });
        }
        throw new ERR_INVALID_ARG_TYPE2(
          name,
          [
            "Blob",
            "ReadableStream",
            "WritableStream",
            "Stream",
            "Iterable",
            "AsyncIterable",
            "Function",
            "{ readable, writable } pair",
            "Promise"
          ],
          body
        );
      }, "duplexify");
      function fromAsyncGen(fn) {
        let { promise, resolve: resolve2 } = createDeferredPromise();
        const ac = new AbortController();
        const signal = ac.signal;
        const value = fn(
          async function* () {
            while (true) {
              const _promise = promise;
              promise = null;
              const { chunk, done, cb } = await _promise;
              process.nextTick(cb);
              if (done) return;
              if (signal.aborted)
                throw new AbortError(void 0, {
                  cause: signal.reason
                });
              ({ promise, resolve: resolve2 } = createDeferredPromise());
              yield chunk;
            }
          }(),
          {
            signal
          }
        );
        return {
          value,
          write: /* @__PURE__ */ __name(function(chunk, encoding, cb) {
            const _resolve = resolve2;
            resolve2 = null;
            _resolve({
              chunk,
              done: false,
              cb
            });
          }, "write"),
          final: /* @__PURE__ */ __name(function(cb) {
            const _resolve = resolve2;
            resolve2 = null;
            _resolve({
              done: true,
              cb
            });
          }, "final"),
          destroy: /* @__PURE__ */ __name(function(err, cb) {
            ac.abort();
            cb(err);
          }, "destroy")
        };
      }
      __name(fromAsyncGen, "fromAsyncGen");
      function _duplexify(pair) {
        const r = pair.readable && typeof pair.readable.read !== "function" ? Readable2.wrap(pair.readable) : pair.readable;
        const w = pair.writable;
        let readable = !!isReadable2(r);
        let writable = !!isWritable(w);
        let ondrain;
        let onfinish;
        let onreadable;
        let onclose;
        let d;
        function onfinished(err) {
          const cb = onclose;
          onclose = null;
          if (cb) {
            cb(err);
          } else if (err) {
            d.destroy(err);
          }
        }
        __name(onfinished, "onfinished");
        d = new Duplexify({
          // TODO (ronag): highWaterMark?
          readableObjectMode: !!(r !== null && r !== void 0 && r.readableObjectMode),
          writableObjectMode: !!(w !== null && w !== void 0 && w.writableObjectMode),
          readable,
          writable
        });
        if (writable) {
          eos(w, (err) => {
            writable = false;
            if (err) {
              destroyer(r, err);
            }
            onfinished(err);
          });
          d._write = function(chunk, encoding, callback) {
            if (w.write(chunk, encoding)) {
              callback();
            } else {
              ondrain = callback;
            }
          };
          d._final = function(callback) {
            w.end();
            onfinish = callback;
          };
          w.on("drain", function() {
            if (ondrain) {
              const cb = ondrain;
              ondrain = null;
              cb();
            }
          });
          w.on("finish", function() {
            if (onfinish) {
              const cb = onfinish;
              onfinish = null;
              cb();
            }
          });
        }
        if (readable) {
          eos(r, (err) => {
            readable = false;
            if (err) {
              destroyer(r, err);
            }
            onfinished(err);
          });
          r.on("readable", function() {
            if (onreadable) {
              const cb = onreadable;
              onreadable = null;
              cb();
            }
          });
          r.on("end", function() {
            d.push(null);
          });
          d._read = function() {
            while (true) {
              const buf = r.read();
              if (buf === null) {
                onreadable = d._read;
                return;
              }
              if (!d.push(buf)) {
                return;
              }
            }
          };
        }
        d._destroy = function(err, callback) {
          if (!err && onclose !== null) {
            err = new AbortError();
          }
          onreadable = null;
          ondrain = null;
          onfinish = null;
          if (onclose === null) {
            callback(err);
          } else {
            onclose = callback;
            destroyer(w, err);
            destroyer(r, err);
          }
        };
        return d;
      }
      __name(_duplexify, "_duplexify");
    }
  });

  // node_modules/readable-stream/lib/internal/streams/duplex.js
  var require_duplex = __commonJS({
    "node_modules/readable-stream/lib/internal/streams/duplex.js"(exports, module) {
      "use strict";
      var {
        ObjectDefineProperties,
        ObjectGetOwnPropertyDescriptor,
        ObjectKeys,
        ObjectSetPrototypeOf
      } = require_primordials();
      module.exports = Duplex;
      var Readable2 = require_readable();
      var Writable2 = require_writable();
      ObjectSetPrototypeOf(Duplex.prototype, Readable2.prototype);
      ObjectSetPrototypeOf(Duplex, Readable2);
      {
        const keys = ObjectKeys(Writable2.prototype);
        for (let i = 0; i < keys.length; i++) {
          const method = keys[i];
          if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable2.prototype[method];
        }
      }
      function Duplex(options) {
        if (!(this instanceof Duplex)) return new Duplex(options);
        Readable2.call(this, options);
        Writable2.call(this, options);
        if (options) {
          this.allowHalfOpen = options.allowHalfOpen !== false;
          if (options.readable === false) {
            this._readableState.readable = false;
            this._readableState.ended = true;
            this._readableState.endEmitted = true;
          }
          if (options.writable === false) {
            this._writableState.writable = false;
            this._writableState.ending = true;
            this._writableState.ended = true;
            this._writableState.finished = true;
          }
        } else {
          this.allowHalfOpen = true;
        }
      }
      __name(Duplex, "Duplex");
      ObjectDefineProperties(Duplex.prototype, {
        writable: {
          __proto__: null,
          ...ObjectGetOwnPropertyDescriptor(Writable2.prototype, "writable")
        },
        writableHighWaterMark: {
          __proto__: null,
          ...ObjectGetOwnPropertyDescriptor(Writable2.prototype, "writableHighWaterMark")
        },
        writableObjectMode: {
          __proto__: null,
          ...ObjectGetOwnPropertyDescriptor(Writable2.prototype, "writableObjectMode")
        },
        writableBuffer: {
          __proto__: null,
          ...ObjectGetOwnPropertyDescriptor(Writable2.prototype, "writableBuffer")
        },
        writableLength: {
          __proto__: null,
          ...ObjectGetOwnPropertyDescriptor(Writable2.prototype, "writableLength")
        },
        writableFinished: {
          __proto__: null,
          ...ObjectGetOwnPropertyDescriptor(Writable2.prototype, "writableFinished")
        },
        writableCorked: {
          __proto__: null,
          ...ObjectGetOwnPropertyDescriptor(Writable2.prototype, "writableCorked")
        },
        writableEnded: {
          __proto__: null,
          ...ObjectGetOwnPropertyDescriptor(Writable2.prototype, "writableEnded")
        },
        writableNeedDrain: {
          __proto__: null,
          ...ObjectGetOwnPropertyDescriptor(Writable2.prototype, "writableNeedDrain")
        },
        destroyed: {
          __proto__: null,
          get: /* @__PURE__ */ __name(function() {
            if (this._readableState === void 0 || this._writableState === void 0) {
              return false;
            }
            return this._readableState.destroyed && this._writableState.destroyed;
          }, "get"),
          set: /* @__PURE__ */ __name(function(value) {
            if (this._readableState && this._writableState) {
              this._readableState.destroyed = value;
              this._writableState.destroyed = value;
            }
          }, "set")
        }
      });
      var webStreamsAdapters;
      function lazyWebStreams() {
        if (webStreamsAdapters === void 0) webStreamsAdapters = {};
        return webStreamsAdapters;
      }
      __name(lazyWebStreams, "lazyWebStreams");
      Duplex.fromWeb = function(pair, options) {
        return lazyWebStreams().newStreamDuplexFromReadableWritablePair(pair, options);
      };
      Duplex.toWeb = function(duplex) {
        return lazyWebStreams().newReadableWritablePairFromDuplex(duplex);
      };
      var duplexify;
      Duplex.from = function(body) {
        if (!duplexify) {
          duplexify = require_duplexify();
        }
        return duplexify(body, "body");
      };
    }
  });

  // node_modules/readable-stream/lib/internal/streams/transform.js
  var require_transform = __commonJS({
    "node_modules/readable-stream/lib/internal/streams/transform.js"(exports, module) {
      "use strict";
      var { ObjectSetPrototypeOf, Symbol: Symbol2 } = require_primordials();
      module.exports = Transform;
      var { ERR_METHOD_NOT_IMPLEMENTED } = require_errors().codes;
      var Duplex = require_duplex();
      var { getHighWaterMark } = require_state();
      ObjectSetPrototypeOf(Transform.prototype, Duplex.prototype);
      ObjectSetPrototypeOf(Transform, Duplex);
      var kCallback = Symbol2("kCallback");
      function Transform(options) {
        if (!(this instanceof Transform)) return new Transform(options);
        const readableHighWaterMark = options ? getHighWaterMark(this, options, "readableHighWaterMark", true) : null;
        if (readableHighWaterMark === 0) {
          options = {
            ...options,
            highWaterMark: null,
            readableHighWaterMark,
            // TODO (ronag): 0 is not optimal since we have
            // a "bug" where we check needDrain before calling _write and not after.
            // Refs: https://github.com/nodejs/node/pull/32887
            // Refs: https://github.com/nodejs/node/pull/35941
            writableHighWaterMark: options.writableHighWaterMark || 0
          };
        }
        Duplex.call(this, options);
        this._readableState.sync = false;
        this[kCallback] = null;
        if (options) {
          if (typeof options.transform === "function") this._transform = options.transform;
          if (typeof options.flush === "function") this._flush = options.flush;
        }
        this.on("prefinish", prefinish);
      }
      __name(Transform, "Transform");
      function final(cb) {
        if (typeof this._flush === "function" && !this.destroyed) {
          this._flush((er, data) => {
            if (er) {
              if (cb) {
                cb(er);
              } else {
                this.destroy(er);
              }
              return;
            }
            if (data != null) {
              this.push(data);
            }
            this.push(null);
            if (cb) {
              cb();
            }
          });
        } else {
          this.push(null);
          if (cb) {
            cb();
          }
        }
      }
      __name(final, "final");
      function prefinish() {
        if (this._final !== final) {
          final.call(this);
        }
      }
      __name(prefinish, "prefinish");
      Transform.prototype._final = final;
      Transform.prototype._transform = function(chunk, encoding, callback) {
        throw new ERR_METHOD_NOT_IMPLEMENTED("_transform()");
      };
      Transform.prototype._write = function(chunk, encoding, callback) {
        const rState = this._readableState;
        const wState = this._writableState;
        const length = rState.length;
        this._transform(chunk, encoding, (err, val) => {
          if (err) {
            callback(err);
            return;
          }
          if (val != null) {
            this.push(val);
          }
          if (wState.ended || // Backwards compat.
          length === rState.length || // Backwards compat.
          rState.length < rState.highWaterMark) {
            callback();
          } else {
            this[kCallback] = callback;
          }
        });
      };
      Transform.prototype._read = function() {
        if (this[kCallback]) {
          const callback = this[kCallback];
          this[kCallback] = null;
          callback();
        }
      };
    }
  });

  // node_modules/readable-stream/lib/internal/streams/passthrough.js
  var require_passthrough = __commonJS({
    "node_modules/readable-stream/lib/internal/streams/passthrough.js"(exports, module) {
      "use strict";
      var { ObjectSetPrototypeOf } = require_primordials();
      module.exports = PassThrough;
      var Transform = require_transform();
      ObjectSetPrototypeOf(PassThrough.prototype, Transform.prototype);
      ObjectSetPrototypeOf(PassThrough, Transform);
      function PassThrough(options) {
        if (!(this instanceof PassThrough)) return new PassThrough(options);
        Transform.call(this, options);
      }
      __name(PassThrough, "PassThrough");
      PassThrough.prototype._transform = function(chunk, encoding, cb) {
        cb(null, chunk);
      };
    }
  });

  // node_modules/readable-stream/lib/internal/streams/pipeline.js
  var require_pipeline = __commonJS({
    "node_modules/readable-stream/lib/internal/streams/pipeline.js"(exports, module) {
      var process = require_browser2();
      var { ArrayIsArray, Promise: Promise2, SymbolAsyncIterator, SymbolDispose } = require_primordials();
      var eos = require_end_of_stream();
      var { once } = require_util();
      var destroyImpl = require_destroy();
      var Duplex = require_duplex();
      var {
        aggregateTwoErrors,
        codes: {
          ERR_INVALID_ARG_TYPE: ERR_INVALID_ARG_TYPE2,
          ERR_INVALID_RETURN_VALUE,
          ERR_MISSING_ARGS,
          ERR_STREAM_DESTROYED,
          ERR_STREAM_PREMATURE_CLOSE
        },
        AbortError
      } = require_errors();
      var { validateFunction, validateAbortSignal } = require_validators();
      var {
        isIterable,
        isReadable: isReadable2,
        isReadableNodeStream,
        isNodeStream,
        isTransformStream,
        isWebStream,
        isReadableStream,
        isReadableFinished
      } = require_utils();
      var AbortController = globalThis.AbortController || require_browser().AbortController;
      var PassThrough;
      var Readable2;
      var addAbortListener;
      function destroyer(stream, reading, writing) {
        let finished = false;
        stream.on("close", () => {
          finished = true;
        });
        const cleanup = eos(
          stream,
          {
            readable: reading,
            writable: writing
          },
          (err) => {
            finished = !err;
          }
        );
        return {
          destroy: /* @__PURE__ */ __name((err) => {
            if (finished) return;
            finished = true;
            destroyImpl.destroyer(stream, err || new ERR_STREAM_DESTROYED("pipe"));
          }, "destroy"),
          cleanup
        };
      }
      __name(destroyer, "destroyer");
      function popCallback(streams) {
        validateFunction(streams[streams.length - 1], "streams[stream.length - 1]");
        return streams.pop();
      }
      __name(popCallback, "popCallback");
      function makeAsyncIterable(val) {
        if (isIterable(val)) {
          return val;
        } else if (isReadableNodeStream(val)) {
          return fromReadable(val);
        }
        throw new ERR_INVALID_ARG_TYPE2("val", ["Readable", "Iterable", "AsyncIterable"], val);
      }
      __name(makeAsyncIterable, "makeAsyncIterable");
      async function* fromReadable(val) {
        if (!Readable2) {
          Readable2 = require_readable();
        }
        yield* Readable2.prototype[SymbolAsyncIterator].call(val);
      }
      __name(fromReadable, "fromReadable");
      async function pumpToNode(iterable, writable, finish, { end }) {
        let error;
        let onresolve = null;
        const resume = /* @__PURE__ */ __name((err) => {
          if (err) {
            error = err;
          }
          if (onresolve) {
            const callback = onresolve;
            onresolve = null;
            callback();
          }
        }, "resume");
        const wait = /* @__PURE__ */ __name(() => new Promise2((resolve2, reject) => {
          if (error) {
            reject(error);
          } else {
            onresolve = /* @__PURE__ */ __name(() => {
              if (error) {
                reject(error);
              } else {
                resolve2();
              }
            }, "onresolve");
          }
        }), "wait");
        writable.on("drain", resume);
        const cleanup = eos(
          writable,
          {
            readable: false
          },
          resume
        );
        try {
          if (writable.writableNeedDrain) {
            await wait();
          }
          for await (const chunk of iterable) {
            if (!writable.write(chunk)) {
              await wait();
            }
          }
          if (end) {
            writable.end();
            await wait();
          }
          finish();
        } catch (err) {
          finish(error !== err ? aggregateTwoErrors(error, err) : err);
        } finally {
          cleanup();
          writable.off("drain", resume);
        }
      }
      __name(pumpToNode, "pumpToNode");
      async function pumpToWeb(readable, writable, finish, { end }) {
        if (isTransformStream(writable)) {
          writable = writable.writable;
        }
        const writer = writable.getWriter();
        try {
          for await (const chunk of readable) {
            await writer.ready;
            writer.write(chunk).catch(() => {
            });
          }
          await writer.ready;
          if (end) {
            await writer.close();
          }
          finish();
        } catch (err) {
          try {
            await writer.abort(err);
            finish(err);
          } catch (err2) {
            finish(err2);
          }
        }
      }
      __name(pumpToWeb, "pumpToWeb");
      function pipeline(...streams) {
        return pipelineImpl(streams, once(popCallback(streams)));
      }
      __name(pipeline, "pipeline");
      function pipelineImpl(streams, callback, opts) {
        if (streams.length === 1 && ArrayIsArray(streams[0])) {
          streams = streams[0];
        }
        if (streams.length < 2) {
          throw new ERR_MISSING_ARGS("streams");
        }
        const ac = new AbortController();
        const signal = ac.signal;
        const outerSignal = opts === null || opts === void 0 ? void 0 : opts.signal;
        const lastStreamCleanup = [];
        validateAbortSignal(outerSignal, "options.signal");
        function abort() {
          finishImpl(new AbortError());
        }
        __name(abort, "abort");
        addAbortListener = addAbortListener || require_util().addAbortListener;
        let disposable;
        if (outerSignal) {
          disposable = addAbortListener(outerSignal, abort);
        }
        let error;
        let value;
        const destroys = [];
        let finishCount = 0;
        function finish(err) {
          finishImpl(err, --finishCount === 0);
        }
        __name(finish, "finish");
        function finishImpl(err, final) {
          var _disposable;
          if (err && (!error || error.code === "ERR_STREAM_PREMATURE_CLOSE")) {
            error = err;
          }
          if (!error && !final) {
            return;
          }
          while (destroys.length) {
            destroys.shift()(error);
          }
          ;
          (_disposable = disposable) === null || _disposable === void 0 ? void 0 : _disposable[SymbolDispose]();
          ac.abort();
          if (final) {
            if (!error) {
              lastStreamCleanup.forEach((fn) => fn());
            }
            process.nextTick(callback, error, value);
          }
        }
        __name(finishImpl, "finishImpl");
        let ret;
        for (let i = 0; i < streams.length; i++) {
          const stream = streams[i];
          const reading = i < streams.length - 1;
          const writing = i > 0;
          const end = reading || (opts === null || opts === void 0 ? void 0 : opts.end) !== false;
          const isLastStream = i === streams.length - 1;
          if (isNodeStream(stream)) {
            let onError2 = function(err) {
              if (err && err.name !== "AbortError" && err.code !== "ERR_STREAM_PREMATURE_CLOSE") {
                finish(err);
              }
            };
            var onError = onError2;
            __name(onError2, "onError");
            if (end) {
              const { destroy, cleanup } = destroyer(stream, reading, writing);
              destroys.push(destroy);
              if (isReadable2(stream) && isLastStream) {
                lastStreamCleanup.push(cleanup);
              }
            }
            stream.on("error", onError2);
            if (isReadable2(stream) && isLastStream) {
              lastStreamCleanup.push(() => {
                stream.removeListener("error", onError2);
              });
            }
          }
          if (i === 0) {
            if (typeof stream === "function") {
              ret = stream({
                signal
              });
              if (!isIterable(ret)) {
                throw new ERR_INVALID_RETURN_VALUE("Iterable, AsyncIterable or Stream", "source", ret);
              }
            } else if (isIterable(stream) || isReadableNodeStream(stream) || isTransformStream(stream)) {
              ret = stream;
            } else {
              ret = Duplex.from(stream);
            }
          } else if (typeof stream === "function") {
            if (isTransformStream(ret)) {
              var _ret;
              ret = makeAsyncIterable((_ret = ret) === null || _ret === void 0 ? void 0 : _ret.readable);
            } else {
              ret = makeAsyncIterable(ret);
            }
            ret = stream(ret, {
              signal
            });
            if (reading) {
              if (!isIterable(ret, true)) {
                throw new ERR_INVALID_RETURN_VALUE("AsyncIterable", `transform[${i - 1}]`, ret);
              }
            } else {
              var _ret2;
              if (!PassThrough) {
                PassThrough = require_passthrough();
              }
              const pt = new PassThrough({
                objectMode: true
              });
              const then = (_ret2 = ret) === null || _ret2 === void 0 ? void 0 : _ret2.then;
              if (typeof then === "function") {
                finishCount++;
                then.call(
                  ret,
                  (val) => {
                    value = val;
                    if (val != null) {
                      pt.write(val);
                    }
                    if (end) {
                      pt.end();
                    }
                    process.nextTick(finish);
                  },
                  (err) => {
                    pt.destroy(err);
                    process.nextTick(finish, err);
                  }
                );
              } else if (isIterable(ret, true)) {
                finishCount++;
                pumpToNode(ret, pt, finish, {
                  end
                });
              } else if (isReadableStream(ret) || isTransformStream(ret)) {
                const toRead = ret.readable || ret;
                finishCount++;
                pumpToNode(toRead, pt, finish, {
                  end
                });
              } else {
                throw new ERR_INVALID_RETURN_VALUE("AsyncIterable or Promise", "destination", ret);
              }
              ret = pt;
              const { destroy, cleanup } = destroyer(ret, false, true);
              destroys.push(destroy);
              if (isLastStream) {
                lastStreamCleanup.push(cleanup);
              }
            }
          } else if (isNodeStream(stream)) {
            if (isReadableNodeStream(ret)) {
              finishCount += 2;
              const cleanup = pipe(ret, stream, finish, {
                end
              });
              if (isReadable2(stream) && isLastStream) {
                lastStreamCleanup.push(cleanup);
              }
            } else if (isTransformStream(ret) || isReadableStream(ret)) {
              const toRead = ret.readable || ret;
              finishCount++;
              pumpToNode(toRead, stream, finish, {
                end
              });
            } else if (isIterable(ret)) {
              finishCount++;
              pumpToNode(ret, stream, finish, {
                end
              });
            } else {
              throw new ERR_INVALID_ARG_TYPE2(
                "val",
                ["Readable", "Iterable", "AsyncIterable", "ReadableStream", "TransformStream"],
                ret
              );
            }
            ret = stream;
          } else if (isWebStream(stream)) {
            if (isReadableNodeStream(ret)) {
              finishCount++;
              pumpToWeb(makeAsyncIterable(ret), stream, finish, {
                end
              });
            } else if (isReadableStream(ret) || isIterable(ret)) {
              finishCount++;
              pumpToWeb(ret, stream, finish, {
                end
              });
            } else if (isTransformStream(ret)) {
              finishCount++;
              pumpToWeb(ret.readable, stream, finish, {
                end
              });
            } else {
              throw new ERR_INVALID_ARG_TYPE2(
                "val",
                ["Readable", "Iterable", "AsyncIterable", "ReadableStream", "TransformStream"],
                ret
              );
            }
            ret = stream;
          } else {
            ret = Duplex.from(stream);
          }
        }
        if (signal !== null && signal !== void 0 && signal.aborted || outerSignal !== null && outerSignal !== void 0 && outerSignal.aborted) {
          process.nextTick(abort);
        }
        return ret;
      }
      __name(pipelineImpl, "pipelineImpl");
      function pipe(src, dst, finish, { end }) {
        let ended = false;
        dst.on("close", () => {
          if (!ended) {
            finish(new ERR_STREAM_PREMATURE_CLOSE());
          }
        });
        src.pipe(dst, {
          end: false
        });
        if (end) {
          let endFn2 = function() {
            ended = true;
            dst.end();
          };
          var endFn = endFn2;
          __name(endFn2, "endFn");
          if (isReadableFinished(src)) {
            process.nextTick(endFn2);
          } else {
            src.once("end", endFn2);
          }
        } else {
          finish();
        }
        eos(
          src,
          {
            readable: true,
            writable: false
          },
          (err) => {
            const rState = src._readableState;
            if (err && err.code === "ERR_STREAM_PREMATURE_CLOSE" && rState && rState.ended && !rState.errored && !rState.errorEmitted) {
              src.once("end", finish).once("error", finish);
            } else {
              finish(err);
            }
          }
        );
        return eos(
          dst,
          {
            readable: false,
            writable: true
          },
          finish
        );
      }
      __name(pipe, "pipe");
      module.exports = {
        pipelineImpl,
        pipeline
      };
    }
  });

  // node_modules/readable-stream/lib/internal/streams/compose.js
  var require_compose = __commonJS({
    "node_modules/readable-stream/lib/internal/streams/compose.js"(exports, module) {
      "use strict";
      var { pipeline } = require_pipeline();
      var Duplex = require_duplex();
      var { destroyer } = require_destroy();
      var {
        isNodeStream,
        isReadable: isReadable2,
        isWritable,
        isWebStream,
        isTransformStream,
        isWritableStream,
        isReadableStream
      } = require_utils();
      var {
        AbortError,
        codes: { ERR_INVALID_ARG_VALUE, ERR_MISSING_ARGS }
      } = require_errors();
      var eos = require_end_of_stream();
      module.exports = /* @__PURE__ */ __name(function compose(...streams) {
        if (streams.length === 0) {
          throw new ERR_MISSING_ARGS("streams");
        }
        if (streams.length === 1) {
          return Duplex.from(streams[0]);
        }
        const orgStreams = [...streams];
        if (typeof streams[0] === "function") {
          streams[0] = Duplex.from(streams[0]);
        }
        if (typeof streams[streams.length - 1] === "function") {
          const idx = streams.length - 1;
          streams[idx] = Duplex.from(streams[idx]);
        }
        for (let n = 0; n < streams.length; ++n) {
          if (!isNodeStream(streams[n]) && !isWebStream(streams[n])) {
            continue;
          }
          if (n < streams.length - 1 && !(isReadable2(streams[n]) || isReadableStream(streams[n]) || isTransformStream(streams[n]))) {
            throw new ERR_INVALID_ARG_VALUE(`streams[${n}]`, orgStreams[n], "must be readable");
          }
          if (n > 0 && !(isWritable(streams[n]) || isWritableStream(streams[n]) || isTransformStream(streams[n]))) {
            throw new ERR_INVALID_ARG_VALUE(`streams[${n}]`, orgStreams[n], "must be writable");
          }
        }
        let ondrain;
        let onfinish;
        let onreadable;
        let onclose;
        let d;
        function onfinished(err) {
          const cb = onclose;
          onclose = null;
          if (cb) {
            cb(err);
          } else if (err) {
            d.destroy(err);
          } else if (!readable && !writable) {
            d.destroy();
          }
        }
        __name(onfinished, "onfinished");
        const head = streams[0];
        const tail = pipeline(streams, onfinished);
        const writable = !!(isWritable(head) || isWritableStream(head) || isTransformStream(head));
        const readable = !!(isReadable2(tail) || isReadableStream(tail) || isTransformStream(tail));
        d = new Duplex({
          // TODO (ronag): highWaterMark?
          writableObjectMode: !!(head !== null && head !== void 0 && head.writableObjectMode),
          readableObjectMode: !!(tail !== null && tail !== void 0 && tail.readableObjectMode),
          writable,
          readable
        });
        if (writable) {
          if (isNodeStream(head)) {
            d._write = function(chunk, encoding, callback) {
              if (head.write(chunk, encoding)) {
                callback();
              } else {
                ondrain = callback;
              }
            };
            d._final = function(callback) {
              head.end();
              onfinish = callback;
            };
            head.on("drain", function() {
              if (ondrain) {
                const cb = ondrain;
                ondrain = null;
                cb();
              }
            });
          } else if (isWebStream(head)) {
            const writable2 = isTransformStream(head) ? head.writable : head;
            const writer = writable2.getWriter();
            d._write = async function(chunk, encoding, callback) {
              try {
                await writer.ready;
                writer.write(chunk).catch(() => {
                });
                callback();
              } catch (err) {
                callback(err);
              }
            };
            d._final = async function(callback) {
              try {
                await writer.ready;
                writer.close().catch(() => {
                });
                onfinish = callback;
              } catch (err) {
                callback(err);
              }
            };
          }
          const toRead = isTransformStream(tail) ? tail.readable : tail;
          eos(toRead, () => {
            if (onfinish) {
              const cb = onfinish;
              onfinish = null;
              cb();
            }
          });
        }
        if (readable) {
          if (isNodeStream(tail)) {
            tail.on("readable", function() {
              if (onreadable) {
                const cb = onreadable;
                onreadable = null;
                cb();
              }
            });
            tail.on("end", function() {
              d.push(null);
            });
            d._read = function() {
              while (true) {
                const buf = tail.read();
                if (buf === null) {
                  onreadable = d._read;
                  return;
                }
                if (!d.push(buf)) {
                  return;
                }
              }
            };
          } else if (isWebStream(tail)) {
            const readable2 = isTransformStream(tail) ? tail.readable : tail;
            const reader = readable2.getReader();
            d._read = async function() {
              while (true) {
                try {
                  const { value, done } = await reader.read();
                  if (!d.push(value)) {
                    return;
                  }
                  if (done) {
                    d.push(null);
                    return;
                  }
                } catch {
                  return;
                }
              }
            };
          }
        }
        d._destroy = function(err, callback) {
          if (!err && onclose !== null) {
            err = new AbortError();
          }
          onreadable = null;
          ondrain = null;
          onfinish = null;
          if (onclose === null) {
            callback(err);
          } else {
            onclose = callback;
            if (isNodeStream(tail)) {
              destroyer(tail, err);
            }
          }
        };
        return d;
      }, "compose");
    }
  });

  // node_modules/readable-stream/lib/internal/streams/operators.js
  var require_operators = __commonJS({
    "node_modules/readable-stream/lib/internal/streams/operators.js"(exports, module) {
      "use strict";
      var AbortController = globalThis.AbortController || require_browser().AbortController;
      var {
        codes: { ERR_INVALID_ARG_VALUE, ERR_INVALID_ARG_TYPE: ERR_INVALID_ARG_TYPE2, ERR_MISSING_ARGS, ERR_OUT_OF_RANGE },
        AbortError
      } = require_errors();
      var { validateAbortSignal, validateInteger, validateObject } = require_validators();
      var kWeakHandler = require_primordials().Symbol("kWeak");
      var kResistStopPropagation = require_primordials().Symbol("kResistStopPropagation");
      var { finished } = require_end_of_stream();
      var staticCompose = require_compose();
      var { addAbortSignalNoValidate } = require_add_abort_signal();
      var { isWritable, isNodeStream } = require_utils();
      var { deprecate } = require_util();
      var {
        ArrayPrototypePush,
        Boolean: Boolean2,
        MathFloor,
        Number: Number2,
        NumberIsNaN,
        Promise: Promise2,
        PromiseReject,
        PromiseResolve,
        PromisePrototypeThen,
        Symbol: Symbol2
      } = require_primordials();
      var kEmpty = Symbol2("kEmpty");
      var kEof = Symbol2("kEof");
      function compose(stream, options) {
        if (options != null) {
          validateObject(options, "options");
        }
        if ((options === null || options === void 0 ? void 0 : options.signal) != null) {
          validateAbortSignal(options.signal, "options.signal");
        }
        if (isNodeStream(stream) && !isWritable(stream)) {
          throw new ERR_INVALID_ARG_VALUE("stream", stream, "must be writable");
        }
        const composedStream = staticCompose(this, stream);
        if (options !== null && options !== void 0 && options.signal) {
          addAbortSignalNoValidate(options.signal, composedStream);
        }
        return composedStream;
      }
      __name(compose, "compose");
      function map(fn, options) {
        if (typeof fn !== "function") {
          throw new ERR_INVALID_ARG_TYPE2("fn", ["Function", "AsyncFunction"], fn);
        }
        if (options != null) {
          validateObject(options, "options");
        }
        if ((options === null || options === void 0 ? void 0 : options.signal) != null) {
          validateAbortSignal(options.signal, "options.signal");
        }
        let concurrency = 1;
        if ((options === null || options === void 0 ? void 0 : options.concurrency) != null) {
          concurrency = MathFloor(options.concurrency);
        }
        let highWaterMark = concurrency - 1;
        if ((options === null || options === void 0 ? void 0 : options.highWaterMark) != null) {
          highWaterMark = MathFloor(options.highWaterMark);
        }
        validateInteger(concurrency, "options.concurrency", 1);
        validateInteger(highWaterMark, "options.highWaterMark", 0);
        highWaterMark += concurrency;
        return (/* @__PURE__ */ __name(async function* map2() {
          const signal = require_util().AbortSignalAny(
            [options === null || options === void 0 ? void 0 : options.signal].filter(Boolean2)
          );
          const stream = this;
          const queue = [];
          const signalOpt = {
            signal
          };
          let next;
          let resume;
          let done = false;
          let cnt = 0;
          function onCatch() {
            done = true;
            afterItemProcessed();
          }
          __name(onCatch, "onCatch");
          function afterItemProcessed() {
            cnt -= 1;
            maybeResume();
          }
          __name(afterItemProcessed, "afterItemProcessed");
          function maybeResume() {
            if (resume && !done && cnt < concurrency && queue.length < highWaterMark) {
              resume();
              resume = null;
            }
          }
          __name(maybeResume, "maybeResume");
          async function pump() {
            try {
              for await (let val of stream) {
                if (done) {
                  return;
                }
                if (signal.aborted) {
                  throw new AbortError();
                }
                try {
                  val = fn(val, signalOpt);
                  if (val === kEmpty) {
                    continue;
                  }
                  val = PromiseResolve(val);
                } catch (err) {
                  val = PromiseReject(err);
                }
                cnt += 1;
                PromisePrototypeThen(val, afterItemProcessed, onCatch);
                queue.push(val);
                if (next) {
                  next();
                  next = null;
                }
                if (!done && (queue.length >= highWaterMark || cnt >= concurrency)) {
                  await new Promise2((resolve2) => {
                    resume = resolve2;
                  });
                }
              }
              queue.push(kEof);
            } catch (err) {
              const val = PromiseReject(err);
              PromisePrototypeThen(val, afterItemProcessed, onCatch);
              queue.push(val);
            } finally {
              done = true;
              if (next) {
                next();
                next = null;
              }
            }
          }
          __name(pump, "pump");
          pump();
          try {
            while (true) {
              while (queue.length > 0) {
                const val = await queue[0];
                if (val === kEof) {
                  return;
                }
                if (signal.aborted) {
                  throw new AbortError();
                }
                if (val !== kEmpty) {
                  yield val;
                }
                queue.shift();
                maybeResume();
              }
              await new Promise2((resolve2) => {
                next = resolve2;
              });
            }
          } finally {
            done = true;
            if (resume) {
              resume();
              resume = null;
            }
          }
        }, "map")).call(this);
      }
      __name(map, "map");
      function asIndexedPairs(options = void 0) {
        if (options != null) {
          validateObject(options, "options");
        }
        if ((options === null || options === void 0 ? void 0 : options.signal) != null) {
          validateAbortSignal(options.signal, "options.signal");
        }
        return (/* @__PURE__ */ __name(async function* asIndexedPairs2() {
          let index = 0;
          for await (const val of this) {
            var _options$signal;
            if (options !== null && options !== void 0 && (_options$signal = options.signal) !== null && _options$signal !== void 0 && _options$signal.aborted) {
              throw new AbortError({
                cause: options.signal.reason
              });
            }
            yield [index++, val];
          }
        }, "asIndexedPairs")).call(this);
      }
      __name(asIndexedPairs, "asIndexedPairs");
      async function some(fn, options = void 0) {
        for await (const unused of filter.call(this, fn, options)) {
          return true;
        }
        return false;
      }
      __name(some, "some");
      async function every(fn, options = void 0) {
        if (typeof fn !== "function") {
          throw new ERR_INVALID_ARG_TYPE2("fn", ["Function", "AsyncFunction"], fn);
        }
        return !await some.call(
          this,
          async (...args) => {
            return !await fn(...args);
          },
          options
        );
      }
      __name(every, "every");
      async function find(fn, options) {
        for await (const result of filter.call(this, fn, options)) {
          return result;
        }
        return void 0;
      }
      __name(find, "find");
      async function forEach(fn, options) {
        if (typeof fn !== "function") {
          throw new ERR_INVALID_ARG_TYPE2("fn", ["Function", "AsyncFunction"], fn);
        }
        async function forEachFn(value, options2) {
          await fn(value, options2);
          return kEmpty;
        }
        __name(forEachFn, "forEachFn");
        for await (const unused of map.call(this, forEachFn, options)) ;
      }
      __name(forEach, "forEach");
      function filter(fn, options) {
        if (typeof fn !== "function") {
          throw new ERR_INVALID_ARG_TYPE2("fn", ["Function", "AsyncFunction"], fn);
        }
        async function filterFn(value, options2) {
          if (await fn(value, options2)) {
            return value;
          }
          return kEmpty;
        }
        __name(filterFn, "filterFn");
        return map.call(this, filterFn, options);
      }
      __name(filter, "filter");
      var ReduceAwareErrMissingArgs = class extends ERR_MISSING_ARGS {
        static {
          __name(this, "ReduceAwareErrMissingArgs");
        }
        constructor() {
          super("reduce");
          this.message = "Reduce of an empty stream requires an initial value";
        }
      };
      async function reduce(reducer, initialValue, options) {
        var _options$signal2;
        if (typeof reducer !== "function") {
          throw new ERR_INVALID_ARG_TYPE2("reducer", ["Function", "AsyncFunction"], reducer);
        }
        if (options != null) {
          validateObject(options, "options");
        }
        if ((options === null || options === void 0 ? void 0 : options.signal) != null) {
          validateAbortSignal(options.signal, "options.signal");
        }
        let hasInitialValue = arguments.length > 1;
        if (options !== null && options !== void 0 && (_options$signal2 = options.signal) !== null && _options$signal2 !== void 0 && _options$signal2.aborted) {
          const err = new AbortError(void 0, {
            cause: options.signal.reason
          });
          this.once("error", () => {
          });
          await finished(this.destroy(err));
          throw err;
        }
        const ac = new AbortController();
        const signal = ac.signal;
        if (options !== null && options !== void 0 && options.signal) {
          const opts = {
            once: true,
            [kWeakHandler]: this,
            [kResistStopPropagation]: true
          };
          options.signal.addEventListener("abort", () => ac.abort(), opts);
        }
        let gotAnyItemFromStream = false;
        try {
          for await (const value of this) {
            var _options$signal3;
            gotAnyItemFromStream = true;
            if (options !== null && options !== void 0 && (_options$signal3 = options.signal) !== null && _options$signal3 !== void 0 && _options$signal3.aborted) {
              throw new AbortError();
            }
            if (!hasInitialValue) {
              initialValue = value;
              hasInitialValue = true;
            } else {
              initialValue = await reducer(initialValue, value, {
                signal
              });
            }
          }
          if (!gotAnyItemFromStream && !hasInitialValue) {
            throw new ReduceAwareErrMissingArgs();
          }
        } finally {
          ac.abort();
        }
        return initialValue;
      }
      __name(reduce, "reduce");
      async function toArray(options) {
        if (options != null) {
          validateObject(options, "options");
        }
        if ((options === null || options === void 0 ? void 0 : options.signal) != null) {
          validateAbortSignal(options.signal, "options.signal");
        }
        const result = [];
        for await (const val of this) {
          var _options$signal4;
          if (options !== null && options !== void 0 && (_options$signal4 = options.signal) !== null && _options$signal4 !== void 0 && _options$signal4.aborted) {
            throw new AbortError(void 0, {
              cause: options.signal.reason
            });
          }
          ArrayPrototypePush(result, val);
        }
        return result;
      }
      __name(toArray, "toArray");
      function flatMap(fn, options) {
        const values = map.call(this, fn, options);
        return (/* @__PURE__ */ __name(async function* flatMap2() {
          for await (const val of values) {
            yield* val;
          }
        }, "flatMap")).call(this);
      }
      __name(flatMap, "flatMap");
      function toIntegerOrInfinity(number) {
        number = Number2(number);
        if (NumberIsNaN(number)) {
          return 0;
        }
        if (number < 0) {
          throw new ERR_OUT_OF_RANGE("number", ">= 0", number);
        }
        return number;
      }
      __name(toIntegerOrInfinity, "toIntegerOrInfinity");
      function drop(number, options = void 0) {
        if (options != null) {
          validateObject(options, "options");
        }
        if ((options === null || options === void 0 ? void 0 : options.signal) != null) {
          validateAbortSignal(options.signal, "options.signal");
        }
        number = toIntegerOrInfinity(number);
        return (/* @__PURE__ */ __name(async function* drop2() {
          var _options$signal5;
          if (options !== null && options !== void 0 && (_options$signal5 = options.signal) !== null && _options$signal5 !== void 0 && _options$signal5.aborted) {
            throw new AbortError();
          }
          for await (const val of this) {
            var _options$signal6;
            if (options !== null && options !== void 0 && (_options$signal6 = options.signal) !== null && _options$signal6 !== void 0 && _options$signal6.aborted) {
              throw new AbortError();
            }
            if (number-- <= 0) {
              yield val;
            }
          }
        }, "drop")).call(this);
      }
      __name(drop, "drop");
      function take(number, options = void 0) {
        if (options != null) {
          validateObject(options, "options");
        }
        if ((options === null || options === void 0 ? void 0 : options.signal) != null) {
          validateAbortSignal(options.signal, "options.signal");
        }
        number = toIntegerOrInfinity(number);
        return (/* @__PURE__ */ __name(async function* take2() {
          var _options$signal7;
          if (options !== null && options !== void 0 && (_options$signal7 = options.signal) !== null && _options$signal7 !== void 0 && _options$signal7.aborted) {
            throw new AbortError();
          }
          for await (const val of this) {
            var _options$signal8;
            if (options !== null && options !== void 0 && (_options$signal8 = options.signal) !== null && _options$signal8 !== void 0 && _options$signal8.aborted) {
              throw new AbortError();
            }
            if (number-- > 0) {
              yield val;
            }
            if (number <= 0) {
              return;
            }
          }
        }, "take")).call(this);
      }
      __name(take, "take");
      module.exports.streamReturningOperators = {
        asIndexedPairs: deprecate(asIndexedPairs, "readable.asIndexedPairs will be removed in a future version."),
        drop,
        filter,
        flatMap,
        map,
        take,
        compose
      };
      module.exports.promiseReturningOperators = {
        every,
        forEach,
        reduce,
        toArray,
        some,
        find
      };
    }
  });

  // node_modules/readable-stream/lib/stream/promises.js
  var require_promises = __commonJS({
    "node_modules/readable-stream/lib/stream/promises.js"(exports, module) {
      "use strict";
      var { ArrayPrototypePop, Promise: Promise2 } = require_primordials();
      var { isIterable, isNodeStream, isWebStream } = require_utils();
      var { pipelineImpl: pl } = require_pipeline();
      var { finished } = require_end_of_stream();
      require_stream();
      function pipeline(...streams) {
        return new Promise2((resolve2, reject) => {
          let signal;
          let end;
          const lastArg = streams[streams.length - 1];
          if (lastArg && typeof lastArg === "object" && !isNodeStream(lastArg) && !isIterable(lastArg) && !isWebStream(lastArg)) {
            const options = ArrayPrototypePop(streams);
            signal = options.signal;
            end = options.end;
          }
          pl(
            streams,
            (err, value) => {
              if (err) {
                reject(err);
              } else {
                resolve2(value);
              }
            },
            {
              signal,
              end
            }
          );
        });
      }
      __name(pipeline, "pipeline");
      module.exports = {
        finished,
        pipeline
      };
    }
  });

  // node_modules/readable-stream/lib/stream.js
  var require_stream = __commonJS({
    "node_modules/readable-stream/lib/stream.js"(exports, module) {
      var { Buffer: Buffer5 } = require_buffer();
      var { ObjectDefineProperty, ObjectKeys, ReflectApply } = require_primordials();
      var {
        promisify: { custom: customPromisify }
      } = require_util();
      var { streamReturningOperators, promiseReturningOperators } = require_operators();
      var {
        codes: { ERR_ILLEGAL_CONSTRUCTOR }
      } = require_errors();
      var compose = require_compose();
      var { setDefaultHighWaterMark, getDefaultHighWaterMark } = require_state();
      var { pipeline } = require_pipeline();
      var { destroyer } = require_destroy();
      var eos = require_end_of_stream();
      var promises = require_promises();
      var utils = require_utils();
      var Stream = module.exports = require_legacy().Stream;
      Stream.isDestroyed = utils.isDestroyed;
      Stream.isDisturbed = utils.isDisturbed;
      Stream.isErrored = utils.isErrored;
      Stream.isReadable = utils.isReadable;
      Stream.isWritable = utils.isWritable;
      Stream.Readable = require_readable();
      for (const key of ObjectKeys(streamReturningOperators)) {
        let fn2 = function(...args) {
          if (new.target) {
            throw ERR_ILLEGAL_CONSTRUCTOR();
          }
          return Stream.Readable.from(ReflectApply(op, this, args));
        };
        fn = fn2;
        __name(fn2, "fn");
        const op = streamReturningOperators[key];
        ObjectDefineProperty(fn2, "name", {
          __proto__: null,
          value: op.name
        });
        ObjectDefineProperty(fn2, "length", {
          __proto__: null,
          value: op.length
        });
        ObjectDefineProperty(Stream.Readable.prototype, key, {
          __proto__: null,
          value: fn2,
          enumerable: false,
          configurable: true,
          writable: true
        });
      }
      var fn;
      for (const key of ObjectKeys(promiseReturningOperators)) {
        let fn2 = function(...args) {
          if (new.target) {
            throw ERR_ILLEGAL_CONSTRUCTOR();
          }
          return ReflectApply(op, this, args);
        };
        fn = fn2;
        __name(fn2, "fn");
        const op = promiseReturningOperators[key];
        ObjectDefineProperty(fn2, "name", {
          __proto__: null,
          value: op.name
        });
        ObjectDefineProperty(fn2, "length", {
          __proto__: null,
          value: op.length
        });
        ObjectDefineProperty(Stream.Readable.prototype, key, {
          __proto__: null,
          value: fn2,
          enumerable: false,
          configurable: true,
          writable: true
        });
      }
      var fn;
      Stream.Writable = require_writable();
      Stream.Duplex = require_duplex();
      Stream.Transform = require_transform();
      Stream.PassThrough = require_passthrough();
      Stream.pipeline = pipeline;
      var { addAbortSignal } = require_add_abort_signal();
      Stream.addAbortSignal = addAbortSignal;
      Stream.finished = eos;
      Stream.destroy = destroyer;
      Stream.compose = compose;
      Stream.setDefaultHighWaterMark = setDefaultHighWaterMark;
      Stream.getDefaultHighWaterMark = getDefaultHighWaterMark;
      ObjectDefineProperty(Stream, "promises", {
        __proto__: null,
        configurable: true,
        enumerable: true,
        get: /* @__PURE__ */ __name(function() {
          return promises;
        }, "get")
      });
      ObjectDefineProperty(pipeline, customPromisify, {
        __proto__: null,
        enumerable: true,
        get: /* @__PURE__ */ __name(function() {
          return promises.pipeline;
        }, "get")
      });
      ObjectDefineProperty(eos, customPromisify, {
        __proto__: null,
        enumerable: true,
        get: /* @__PURE__ */ __name(function() {
          return promises.finished;
        }, "get")
      });
      Stream.Stream = Stream;
      Stream._isUint8Array = /* @__PURE__ */ __name(function isUint8Array(value) {
        return value instanceof Uint8Array;
      }, "isUint8Array");
      Stream._uint8ArrayToBuffer = /* @__PURE__ */ __name(function _uint8ArrayToBuffer(chunk) {
        return Buffer5.from(chunk.buffer, chunk.byteOffset, chunk.byteLength);
      }, "_uint8ArrayToBuffer");
    }
  });

  // node_modules/readable-stream/lib/ours/browser.js
  var require_browser3 = __commonJS({
    "node_modules/readable-stream/lib/ours/browser.js"(exports, module) {
      "use strict";
      var CustomStream = require_stream();
      var promises = require_promises();
      var originalDestroy = CustomStream.Readable.destroy;
      module.exports = CustomStream.Readable;
      module.exports._uint8ArrayToBuffer = CustomStream._uint8ArrayToBuffer;
      module.exports._isUint8Array = CustomStream._isUint8Array;
      module.exports.isDisturbed = CustomStream.isDisturbed;
      module.exports.isErrored = CustomStream.isErrored;
      module.exports.isReadable = CustomStream.isReadable;
      module.exports.Readable = CustomStream.Readable;
      module.exports.Writable = CustomStream.Writable;
      module.exports.Duplex = CustomStream.Duplex;
      module.exports.Transform = CustomStream.Transform;
      module.exports.PassThrough = CustomStream.PassThrough;
      module.exports.addAbortSignal = CustomStream.addAbortSignal;
      module.exports.finished = CustomStream.finished;
      module.exports.destroy = CustomStream.destroy;
      module.exports.destroy = originalDestroy;
      module.exports.pipeline = CustomStream.pipeline;
      module.exports.compose = CustomStream.compose;
      Object.defineProperty(CustomStream, "promises", {
        configurable: true,
        enumerable: true,
        get: /* @__PURE__ */ __name(function() {
          return promises;
        }, "get")
      });
      module.exports.Stream = CustomStream.Stream;
      module.exports.default = module.exports;
    }
  });

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    Async: () => Async,
    AsyncTransaction: () => AsyncTransaction,
    BigIntStats: () => BigIntStats,
    BigIntStatsFs: () => BigIntStatsFs,
    Dir: () => Dir,
    Dirent: () => Dirent,
    Errno: () => Errno,
    ErrnoError: () => ErrnoError,
    Fetch: () => Fetch,
    FetchFS: () => FetchFS,
    File: () => File,
    FileSystem: () => FileSystem,
    FileType: () => FileType,
    InMemory: () => InMemory,
    InMemoryStore: () => InMemoryStore,
    IndexFS: () => IndexFS,
    Inode: () => Inode,
    Locked: () => Locked,
    LockedFS: () => LockedFS,
    NoSyncFile: () => NoSyncFile,
    Overlay: () => Overlay,
    OverlayFS: () => OverlayFS,
    Port: () => Port,
    PortFS: () => PortFS,
    PortFile: () => PortFile,
    PreloadFile: () => PreloadFile,
    ReadStream: () => ReadStream,
    Readonly: () => Readonly,
    SimpleAsyncStore: () => SimpleAsyncStore,
    SimpleTransaction: () => SimpleTransaction,
    Stats: () => Stats,
    StatsCommon: () => StatsCommon,
    StatsFs: () => StatsFs,
    StoreFS: () => StoreFS,
    Sync: () => Sync,
    SyncTransaction: () => SyncTransaction,
    Transaction: () => Transaction,
    UnlockedOverlayFS: () => UnlockedOverlayFS,
    WriteStream: () => WriteStream,
    ZenFsType: () => ZenFsType,
    _toUnixTimestamp: () => _toUnixTimestamp,
    access: () => access2,
    accessSync: () => accessSync,
    appendFile: () => appendFile2,
    appendFileSync: () => appendFileSync,
    attachFS: () => attachFS,
    checkOptions: () => checkOptions,
    chmod: () => chmod2,
    chmodSync: () => chmodSync,
    chown: () => chown2,
    chownSync: () => chownSync,
    close: () => close,
    closeSync: () => closeSync,
    configure: () => configure,
    constants: () => constants_exports,
    copyFile: () => copyFile2,
    copyFileSync: () => copyFileSync,
    cp: () => cp2,
    cpSync: () => cpSync,
    createReadStream: () => createReadStream,
    createWriteStream: () => createWriteStream,
    decode: () => decode,
    decodeDirListing: () => decodeDirListing,
    default: () => src_default,
    detachFS: () => detachFS,
    encode: () => encode,
    encodeDirListing: () => encodeDirListing,
    errorMessages: () => errorMessages,
    exists: () => exists2,
    existsSync: () => existsSync,
    fchmod: () => fchmod,
    fchmodSync: () => fchmodSync,
    fchown: () => fchown,
    fchownSync: () => fchownSync,
    fdatasync: () => fdatasync,
    fdatasyncSync: () => fdatasyncSync,
    flagToMode: () => flagToMode,
    flagToNumber: () => flagToNumber,
    flagToString: () => flagToString,
    fs: () => emulation_exports,
    fstat: () => fstat,
    fstatSync: () => fstatSync,
    fsync: () => fsync,
    fsyncSync: () => fsyncSync,
    ftruncate: () => ftruncate,
    ftruncateSync: () => ftruncateSync,
    futimes: () => futimes,
    futimesSync: () => futimesSync,
    isAppendable: () => isAppendable,
    isBackend: () => isBackend,
    isBackendConfig: () => isBackendConfig,
    isExclusive: () => isExclusive,
    isReadable: () => isReadable,
    isSynchronous: () => isSynchronous,
    isTruncating: () => isTruncating,
    isWriteable: () => isWriteable,
    lchmod: () => lchmod2,
    lchmodSync: () => lchmodSync,
    lchown: () => lchown2,
    lchownSync: () => lchownSync,
    levenshtein: () => levenshtein,
    link: () => link2,
    linkSync: () => linkSync,
    lopenSync: () => lopenSync,
    lstat: () => lstat2,
    lstatSync: () => lstatSync,
    lutimes: () => lutimes2,
    lutimesSync: () => lutimesSync,
    mkdir: () => mkdir2,
    mkdirSync: () => mkdirSync,
    mkdirpSync: () => mkdirpSync,
    mkdtemp: () => mkdtemp2,
    mkdtempSync: () => mkdtempSync,
    mount: () => mount,
    mountObject: () => mountObject,
    mounts: () => mounts,
    nop: () => nop,
    normalizeMode: () => normalizeMode,
    normalizeOptions: () => normalizeOptions,
    normalizePath: () => normalizePath,
    normalizeTime: () => normalizeTime,
    open: () => open2,
    openAsBlob: () => openAsBlob,
    openSync: () => openSync,
    opendir: () => opendir2,
    opendirSync: () => opendirSync,
    parseFlag: () => parseFlag,
    promises: () => promises_exports,
    randomIno: () => randomIno,
    read: () => read,
    readFile: () => readFile2,
    readFileSync: () => readFileSync,
    readSync: () => readSync,
    readdir: () => readdir2,
    readdirSync: () => readdirSync,
    readlink: () => readlink2,
    readlinkSync: () => readlinkSync,
    readv: () => readv,
    readvSync: () => readvSync,
    realpath: () => realpath2,
    realpathSync: () => realpathSync,
    rename: () => rename2,
    renameSync: () => renameSync,
    resolveMountConfig: () => resolveMountConfig,
    rm: () => rm2,
    rmSync: () => rmSync,
    rmdir: () => rmdir2,
    rmdirSync: () => rmdirSync,
    rootCred: () => rootCred,
    rootIno: () => rootIno,
    setImmediate: () => setImmediate,
    size_max: () => size_max,
    stat: () => stat2,
    statSync: () => statSync,
    statfs: () => statfs2,
    statfsSync: () => statfsSync,
    symlink: () => symlink2,
    symlinkSync: () => symlinkSync,
    truncate: () => truncate2,
    truncateSync: () => truncateSync,
    umount: () => umount,
    unlink: () => unlink2,
    unlinkSync: () => unlinkSync,
    unwatchFile: () => unwatchFile,
    utimes: () => utimes2,
    utimesSync: () => utimesSync,
    watch: () => watch2,
    watchFile: () => watchFile,
    write: () => write,
    writeFile: () => writeFile2,
    writeFileSync: () => writeFileSync,
    writeSync: () => writeSync,
    writev: () => writev,
    writevSync: () => writevSync
  });

  // src/error.ts
  var Errno = /* @__PURE__ */ ((Errno2) => {
    Errno2[Errno2["EPERM"] = 1] = "EPERM";
    Errno2[Errno2["ENOENT"] = 2] = "ENOENT";
    Errno2[Errno2["EINTR"] = 4] = "EINTR";
    Errno2[Errno2["EIO"] = 5] = "EIO";
    Errno2[Errno2["ENXIO"] = 6] = "ENXIO";
    Errno2[Errno2["EBADF"] = 9] = "EBADF";
    Errno2[Errno2["EAGAIN"] = 11] = "EAGAIN";
    Errno2[Errno2["ENOMEM"] = 12] = "ENOMEM";
    Errno2[Errno2["EACCES"] = 13] = "EACCES";
    Errno2[Errno2["EFAULT"] = 14] = "EFAULT";
    Errno2[Errno2["ENOTBLK"] = 15] = "ENOTBLK";
    Errno2[Errno2["EBUSY"] = 16] = "EBUSY";
    Errno2[Errno2["EEXIST"] = 17] = "EEXIST";
    Errno2[Errno2["EXDEV"] = 18] = "EXDEV";
    Errno2[Errno2["ENODEV"] = 19] = "ENODEV";
    Errno2[Errno2["ENOTDIR"] = 20] = "ENOTDIR";
    Errno2[Errno2["EISDIR"] = 21] = "EISDIR";
    Errno2[Errno2["EINVAL"] = 22] = "EINVAL";
    Errno2[Errno2["ENFILE"] = 23] = "ENFILE";
    Errno2[Errno2["EMFILE"] = 24] = "EMFILE";
    Errno2[Errno2["ETXTBSY"] = 26] = "ETXTBSY";
    Errno2[Errno2["EFBIG"] = 27] = "EFBIG";
    Errno2[Errno2["ENOSPC"] = 28] = "ENOSPC";
    Errno2[Errno2["ESPIPE"] = 29] = "ESPIPE";
    Errno2[Errno2["EROFS"] = 30] = "EROFS";
    Errno2[Errno2["EMLINK"] = 31] = "EMLINK";
    Errno2[Errno2["EPIPE"] = 32] = "EPIPE";
    Errno2[Errno2["EDOM"] = 33] = "EDOM";
    Errno2[Errno2["ERANGE"] = 34] = "ERANGE";
    Errno2[Errno2["EDEADLK"] = 35] = "EDEADLK";
    Errno2[Errno2["ENAMETOOLONG"] = 36] = "ENAMETOOLONG";
    Errno2[Errno2["ENOLCK"] = 37] = "ENOLCK";
    Errno2[Errno2["ENOSYS"] = 38] = "ENOSYS";
    Errno2[Errno2["ENOTEMPTY"] = 39] = "ENOTEMPTY";
    Errno2[Errno2["ELOOP"] = 40] = "ELOOP";
    Errno2[Errno2["ENOMSG"] = 42] = "ENOMSG";
    Errno2[Errno2["EBADE"] = 52] = "EBADE";
    Errno2[Errno2["EBADR"] = 53] = "EBADR";
    Errno2[Errno2["EXFULL"] = 54] = "EXFULL";
    Errno2[Errno2["ENOANO"] = 55] = "ENOANO";
    Errno2[Errno2["EBADRQC"] = 56] = "EBADRQC";
    Errno2[Errno2["ENOSTR"] = 60] = "ENOSTR";
    Errno2[Errno2["ENODATA"] = 61] = "ENODATA";
    Errno2[Errno2["ETIME"] = 62] = "ETIME";
    Errno2[Errno2["ENOSR"] = 63] = "ENOSR";
    Errno2[Errno2["ENONET"] = 64] = "ENONET";
    Errno2[Errno2["EREMOTE"] = 66] = "EREMOTE";
    Errno2[Errno2["ENOLINK"] = 67] = "ENOLINK";
    Errno2[Errno2["ECOMM"] = 70] = "ECOMM";
    Errno2[Errno2["EPROTO"] = 71] = "EPROTO";
    Errno2[Errno2["EBADMSG"] = 74] = "EBADMSG";
    Errno2[Errno2["EOVERFLOW"] = 75] = "EOVERFLOW";
    Errno2[Errno2["EBADFD"] = 77] = "EBADFD";
    Errno2[Errno2["ESTRPIPE"] = 86] = "ESTRPIPE";
    Errno2[Errno2["ENOTSOCK"] = 88] = "ENOTSOCK";
    Errno2[Errno2["EDESTADDRREQ"] = 89] = "EDESTADDRREQ";
    Errno2[Errno2["EMSGSIZE"] = 90] = "EMSGSIZE";
    Errno2[Errno2["EPROTOTYPE"] = 91] = "EPROTOTYPE";
    Errno2[Errno2["ENOPROTOOPT"] = 92] = "ENOPROTOOPT";
    Errno2[Errno2["EPROTONOSUPPORT"] = 93] = "EPROTONOSUPPORT";
    Errno2[Errno2["ESOCKTNOSUPPORT"] = 94] = "ESOCKTNOSUPPORT";
    Errno2[Errno2["ENOTSUP"] = 95] = "ENOTSUP";
    Errno2[Errno2["ENETDOWN"] = 100] = "ENETDOWN";
    Errno2[Errno2["ENETUNREACH"] = 101] = "ENETUNREACH";
    Errno2[Errno2["ENETRESET"] = 102] = "ENETRESET";
    Errno2[Errno2["ETIMEDOUT"] = 110] = "ETIMEDOUT";
    Errno2[Errno2["ECONNREFUSED"] = 111] = "ECONNREFUSED";
    Errno2[Errno2["EHOSTDOWN"] = 112] = "EHOSTDOWN";
    Errno2[Errno2["EHOSTUNREACH"] = 113] = "EHOSTUNREACH";
    Errno2[Errno2["EALREADY"] = 114] = "EALREADY";
    Errno2[Errno2["EINPROGRESS"] = 115] = "EINPROGRESS";
    Errno2[Errno2["ESTALE"] = 116] = "ESTALE";
    Errno2[Errno2["EREMOTEIO"] = 121] = "EREMOTEIO";
    Errno2[Errno2["EDQUOT"] = 122] = "EDQUOT";
    return Errno2;
  })(Errno || {});
  var errorMessages = {
    [1 /* EPERM */]: "Operation not permitted",
    [2 /* ENOENT */]: "No such file or directory",
    [4 /* EINTR */]: "Interrupted system call",
    [5 /* EIO */]: "Input/output error",
    [6 /* ENXIO */]: "No such device or address",
    [9 /* EBADF */]: "Bad file descriptor",
    [11 /* EAGAIN */]: "Resource temporarily unavailable",
    [12 /* ENOMEM */]: "Cannot allocate memory",
    [13 /* EACCES */]: "Permission denied",
    [14 /* EFAULT */]: "Bad address",
    [15 /* ENOTBLK */]: "Block device required",
    [16 /* EBUSY */]: "Resource busy or locked",
    [17 /* EEXIST */]: "File exists",
    [18 /* EXDEV */]: "Invalid cross-device link",
    [19 /* ENODEV */]: "No such device",
    [20 /* ENOTDIR */]: "File is not a directory",
    [21 /* EISDIR */]: "File is a directory",
    [22 /* EINVAL */]: "Invalid argument",
    [23 /* ENFILE */]: "Too many open files in system",
    [24 /* EMFILE */]: "Too many open files",
    [26 /* ETXTBSY */]: "Text file busy",
    [27 /* EFBIG */]: "File is too big",
    [28 /* ENOSPC */]: "No space left on disk",
    [29 /* ESPIPE */]: "Illegal seek",
    [30 /* EROFS */]: "Cannot modify a read-only file system",
    [31 /* EMLINK */]: "Too many links",
    [32 /* EPIPE */]: "Broken pipe",
    [33 /* EDOM */]: "Numerical argument out of domain",
    [34 /* ERANGE */]: "Numerical result out of range",
    [35 /* EDEADLK */]: "Resource deadlock would occur",
    [36 /* ENAMETOOLONG */]: "File name too long",
    [37 /* ENOLCK */]: "No locks available",
    [38 /* ENOSYS */]: "Function not implemented",
    [39 /* ENOTEMPTY */]: "Directory is not empty",
    [40 /* ELOOP */]: "Too many levels of symbolic links",
    [42 /* ENOMSG */]: "No message of desired type",
    [52 /* EBADE */]: "Invalid exchange",
    [53 /* EBADR */]: "Invalid request descriptor",
    [54 /* EXFULL */]: "Exchange full",
    [55 /* ENOANO */]: "No anode",
    [56 /* EBADRQC */]: "Invalid request code",
    [60 /* ENOSTR */]: "Device not a stream",
    [61 /* ENODATA */]: "No data available",
    [62 /* ETIME */]: "Timer expired",
    [63 /* ENOSR */]: "Out of streams resources",
    [64 /* ENONET */]: "Machine is not on the network",
    [66 /* EREMOTE */]: "Object is remote",
    [67 /* ENOLINK */]: "Link has been severed",
    [70 /* ECOMM */]: "Communication error on send",
    [71 /* EPROTO */]: "Protocol error",
    [74 /* EBADMSG */]: "Bad message",
    [75 /* EOVERFLOW */]: "Value too large for defined data type",
    [77 /* EBADFD */]: "File descriptor in bad state",
    [86 /* ESTRPIPE */]: "Streams pipe error",
    [88 /* ENOTSOCK */]: "Socket operation on non-socket",
    [89 /* EDESTADDRREQ */]: "Destination address required",
    [90 /* EMSGSIZE */]: "Message too long",
    [91 /* EPROTOTYPE */]: "Protocol wrong type for socket",
    [92 /* ENOPROTOOPT */]: "Protocol not available",
    [93 /* EPROTONOSUPPORT */]: "Protocol not supported",
    [94 /* ESOCKTNOSUPPORT */]: "Socket type not supported",
    [95 /* ENOTSUP */]: "Operation is not supported",
    [100 /* ENETDOWN */]: "Network is down",
    [101 /* ENETUNREACH */]: "Network is unreachable",
    [102 /* ENETRESET */]: "Network dropped connection on reset",
    [110 /* ETIMEDOUT */]: "Connection timed out",
    [111 /* ECONNREFUSED */]: "Connection refused",
    [112 /* EHOSTDOWN */]: "Host is down",
    [113 /* EHOSTUNREACH */]: "No route to host",
    [114 /* EALREADY */]: "Operation already in progress",
    [115 /* EINPROGRESS */]: "Operation now in progress",
    [116 /* ESTALE */]: "Stale file handle",
    [121 /* EREMOTEIO */]: "Remote I/O error",
    [122 /* EDQUOT */]: "Disk quota exceeded"
  };
  var ErrnoError = class _ErrnoError extends Error {
    /**
     * Represents a ZenFS error. Passed back to applications after a failed
     * call to the ZenFS API.
     *
     * Error codes mirror those returned by regular Unix file operations, which is
     * what Node returns.
     * @param type The type of the error.
     * @param message A descriptive error message.
     */
    constructor(errno, message = errorMessages[errno], path, syscall = "") {
      super(message);
      this.errno = errno;
      this.path = path;
      this.syscall = syscall;
      this.code = Errno[errno];
      this.message = `${this.code}: ${message}${this.path ? `, '${this.path}'` : ""}`;
    }
    static {
      __name(this, "ErrnoError");
    }
    static fromJSON(json) {
      const err = new _ErrnoError(json.errno, json.message, json.path, json.syscall);
      err.code = json.code;
      err.stack = json.stack;
      return err;
    }
    static With(code, path, syscall) {
      return new _ErrnoError(Errno[code], errorMessages[Errno[code]], path, syscall);
    }
    code;
    /**
     * @return A friendly error message.
     */
    toString() {
      return this.message;
    }
    toJSON() {
      return {
        errno: this.errno,
        code: this.code,
        path: this.path,
        stack: this.stack,
        message: this.message,
        syscall: this.syscall
      };
    }
    /**
     * The size of the API error in buffer-form in bytes.
     */
    bufferSize() {
      return 4 + JSON.stringify(this.toJSON()).length;
    }
  };

  // src/emulation/constants.ts
  var constants_exports = {};
  __export(constants_exports, {
    COPYFILE_EXCL: () => COPYFILE_EXCL,
    COPYFILE_FICLONE: () => COPYFILE_FICLONE,
    COPYFILE_FICLONE_FORCE: () => COPYFILE_FICLONE_FORCE,
    F_OK: () => F_OK,
    O_APPEND: () => O_APPEND,
    O_CREAT: () => O_CREAT,
    O_DIRECT: () => O_DIRECT,
    O_DIRECTORY: () => O_DIRECTORY,
    O_DSYNC: () => O_DSYNC,
    O_EXCL: () => O_EXCL,
    O_NOATIME: () => O_NOATIME,
    O_NOCTTY: () => O_NOCTTY,
    O_NOFOLLOW: () => O_NOFOLLOW,
    O_NONBLOCK: () => O_NONBLOCK,
    O_RDONLY: () => O_RDONLY,
    O_RDWR: () => O_RDWR,
    O_SYMLINK: () => O_SYMLINK,
    O_SYNC: () => O_SYNC,
    O_TRUNC: () => O_TRUNC,
    O_WRONLY: () => O_WRONLY,
    R_OK: () => R_OK,
    S_IFBLK: () => S_IFBLK,
    S_IFCHR: () => S_IFCHR,
    S_IFDIR: () => S_IFDIR,
    S_IFIFO: () => S_IFIFO,
    S_IFLNK: () => S_IFLNK,
    S_IFMT: () => S_IFMT,
    S_IFREG: () => S_IFREG,
    S_IFSOCK: () => S_IFSOCK,
    S_IRGRP: () => S_IRGRP,
    S_IROTH: () => S_IROTH,
    S_IRUSR: () => S_IRUSR,
    S_IRWXG: () => S_IRWXG,
    S_IRWXO: () => S_IRWXO,
    S_IRWXU: () => S_IRWXU,
    S_ISGID: () => S_ISGID,
    S_ISUID: () => S_ISUID,
    S_ISVTX: () => S_ISVTX,
    S_IWGRP: () => S_IWGRP,
    S_IWOTH: () => S_IWOTH,
    S_IWUSR: () => S_IWUSR,
    S_IXGRP: () => S_IXGRP,
    S_IXOTH: () => S_IXOTH,
    S_IXUSR: () => S_IXUSR,
    UV_FS_O_FILEMAP: () => UV_FS_O_FILEMAP,
    W_OK: () => W_OK,
    X_OK: () => X_OK
  });
  var F_OK = 0;
  var R_OK = 4;
  var W_OK = 2;
  var X_OK = 1;
  var COPYFILE_EXCL = 1;
  var COPYFILE_FICLONE = 2;
  var COPYFILE_FICLONE_FORCE = 4;
  var O_RDONLY = 0;
  var O_WRONLY = 1;
  var O_RDWR = 2;
  var O_CREAT = 64;
  var O_EXCL = 128;
  var O_NOCTTY = 256;
  var O_TRUNC = 512;
  var O_APPEND = 1024;
  var O_DIRECTORY = 65536;
  var O_NOATIME = 262144;
  var O_NOFOLLOW = 131072;
  var O_SYNC = 1052672;
  var O_DSYNC = 4096;
  var O_SYMLINK = 32768;
  var O_DIRECT = 16384;
  var O_NONBLOCK = 2048;
  var S_IFMT = 61440;
  var S_IFSOCK = 49152;
  var S_IFLNK = 40960;
  var S_IFREG = 32768;
  var S_IFBLK = 24576;
  var S_IFDIR = 16384;
  var S_IFCHR = 8192;
  var S_IFIFO = 4096;
  var S_ISUID = 2048;
  var S_ISGID = 1024;
  var S_ISVTX = 512;
  var S_IRWXU = 448;
  var S_IRUSR = 256;
  var S_IWUSR = 128;
  var S_IXUSR = 64;
  var S_IRWXG = 56;
  var S_IRGRP = 32;
  var S_IWGRP = 16;
  var S_IXGRP = 8;
  var S_IRWXO = 7;
  var S_IROTH = 4;
  var S_IWOTH = 2;
  var S_IXOTH = 1;
  var UV_FS_O_FILEMAP = 0;

  // src/stats.ts
  var FileType = /* @__PURE__ */ ((FileType2) => {
    FileType2[FileType2["FILE"] = S_IFREG] = "FILE";
    FileType2[FileType2["DIRECTORY"] = S_IFDIR] = "DIRECTORY";
    FileType2[FileType2["SYMLINK"] = S_IFLNK] = "SYMLINK";
    return FileType2;
  })(FileType || {});
  var StatsCommon = class {
    static {
      __name(this, "StatsCommon");
    }
    _convert(arg) {
      return this._isBigint ? BigInt(arg) : Number(arg);
    }
    get blocks() {
      return this._convert(Math.ceil(Number(this.size) / 512));
    }
    /**
     * Unix-style file mode (e.g. 0o644) that includes the type of the item.
     * Type of the item can be FILE, DIRECTORY, SYMLINK, or SOCKET
     */
    mode;
    /**
     * ID of device containing file
     */
    dev = this._convert(0);
    /**
     * inode number
     */
    ino = this._convert(0);
    /**
     * device ID (if special file)
     */
    rdev = this._convert(0);
    /**
     * number of hard links
     */
    nlink = this._convert(1);
    /**
     * blocksize for file system I/O
     */
    blksize = this._convert(4096);
    /**
     * user ID of owner
     */
    uid = this._convert(0);
    /**
     * group ID of owner
     */
    gid = this._convert(0);
    /**
     * Some file systems stash data on stats objects.
     */
    fileData;
    /**
     * time of last access, in milliseconds since epoch
     */
    atimeMs;
    get atime() {
      return new Date(Number(this.atimeMs));
    }
    set atime(value) {
      this.atimeMs = this._convert(value.getTime());
    }
    /**
     * time of last modification, in milliseconds since epoch
     */
    mtimeMs;
    get mtime() {
      return new Date(Number(this.mtimeMs));
    }
    set mtime(value) {
      this.mtimeMs = this._convert(value.getTime());
    }
    /**
     * time of last time file status was changed, in milliseconds since epoch
     */
    ctimeMs;
    get ctime() {
      return new Date(Number(this.ctimeMs));
    }
    set ctime(value) {
      this.ctimeMs = this._convert(value.getTime());
    }
    /**
     * time of file creation, in milliseconds since epoch
     */
    birthtimeMs;
    get birthtime() {
      return new Date(Number(this.birthtimeMs));
    }
    set birthtime(value) {
      this.birthtimeMs = this._convert(value.getTime());
    }
    /**
     * Size of the item in bytes.
     * For directories/symlinks, this is normally the size of the struct that represents the item.
     */
    size;
    /**
     * Creates a new stats instance from a stats-like object. Can be used to copy stats (note)
     */
    constructor({ atimeMs, mtimeMs, ctimeMs, birthtimeMs, uid, gid, size, mode, ino } = {}) {
      const now = Date.now();
      this.atimeMs = this._convert(atimeMs ?? now);
      this.mtimeMs = this._convert(mtimeMs ?? now);
      this.ctimeMs = this._convert(ctimeMs ?? now);
      this.birthtimeMs = this._convert(birthtimeMs ?? now);
      this.uid = this._convert(uid ?? 0);
      this.gid = this._convert(gid ?? 0);
      this.size = this._convert(size ?? 0);
      this.ino = this._convert(ino ?? 0);
      const itemType = Number(mode) & S_IFMT || FileType.FILE;
      if (mode) {
        this.mode = this._convert(mode);
      } else {
        switch (itemType) {
          case FileType.FILE:
            this.mode = this._convert(420);
            break;
          case FileType.DIRECTORY:
          default:
            this.mode = this._convert(511);
        }
      }
      if ((this.mode & S_IFMT) == 0) {
        this.mode = this.mode | this._convert(itemType);
      }
    }
    /**
     * @returns true if this item is a file.
     */
    isFile() {
      return (this.mode & S_IFMT) === S_IFREG;
    }
    /**
     * @returns True if this item is a directory.
     */
    isDirectory() {
      return (this.mode & S_IFMT) === S_IFDIR;
    }
    /**
     * @returns true if this item is a symbolic link
     */
    isSymbolicLink() {
      return (this.mode & S_IFMT) === S_IFLNK;
    }
    // Currently unsupported
    isSocket() {
      return (this.mode & S_IFMT) === S_IFSOCK;
    }
    isBlockDevice() {
      return (this.mode & S_IFMT) === S_IFBLK;
    }
    isCharacterDevice() {
      return (this.mode & S_IFMT) === S_IFCHR;
    }
    isFIFO() {
      return (this.mode & S_IFMT) === S_IFIFO;
    }
    /**
     * Checks if a given user/group has access to this item
     * @param mode The requested access, combination of W_OK, R_OK, and X_OK
     * @param cred The requesting credentials
     * @returns True if the request has access, false if the request does not
     * @internal
     */
    hasAccess(mode, cred2) {
      if (cred2.euid === 0 || cred2.egid === 0) {
        return true;
      }
      const adjusted = (cred2.uid == this.uid ? S_IRWXU : 0) | (cred2.gid == this.gid ? S_IRWXG : 0) | S_IRWXO;
      return (mode & this.mode & adjusted) == mode;
    }
    /**
     * Convert the current stats object into a credentials object
     * @internal
     */
    cred(uid = Number(this.uid), gid = Number(this.gid)) {
      return {
        uid,
        gid,
        suid: Number(this.uid),
        sgid: Number(this.gid),
        euid: uid,
        egid: gid
      };
    }
    /**
     * Change the mode of the file. We use this helper function to prevent messing
     * up the type of the file, which is encoded in mode.
     * @internal
     */
    chmod(mode) {
      this.mode = this._convert(this.mode & S_IFMT | mode);
    }
    /**
     * Change the owner user/group of the file.
     * This function makes sure it is a valid UID/GID (that is, a 32 unsigned int)
     * @internal
     */
    chown(uid, gid) {
      uid = Number(uid);
      gid = Number(gid);
      if (!isNaN(uid) && 0 <= uid && uid < 2 ** 32) {
        this.uid = this._convert(uid);
      }
      if (!isNaN(gid) && 0 <= gid && gid < 2 ** 32) {
        this.gid = this._convert(gid);
      }
    }
    get atimeNs() {
      return BigInt(this.atimeMs) * 1000n;
    }
    get mtimeNs() {
      return BigInt(this.mtimeMs) * 1000n;
    }
    get ctimeNs() {
      return BigInt(this.ctimeMs) * 1000n;
    }
    get birthtimeNs() {
      return BigInt(this.birthtimeMs) * 1000n;
    }
  };
  var Stats = class extends StatsCommon {
    static {
      __name(this, "Stats");
    }
    _isBigint = false;
  };
  var BigIntStats = class extends StatsCommon {
    static {
      __name(this, "BigIntStats");
    }
    _isBigint = true;
  };
  var ZenFsType = 525687744115;
  var StatsFs = class {
    static {
      __name(this, "StatsFs");
    }
    /** Type of file system. */
    type = 525687744115;
    /**  Optimal transfer block size. */
    bsize = 4096;
    /**  Total data blocks in file system. */
    blocks = 0;
    /** Free blocks in file system. */
    bfree = 0;
    /** Available blocks for unprivileged users */
    bavail = 0;
    /** Total file nodes in file system. */
    files = size_max;
    /** Free file nodes in file system. */
    ffree = size_max;
  };
  var BigIntStatsFs = class {
    static {
      __name(this, "BigIntStatsFs");
    }
    /** Type of file system. */
    type = 0x7a656e6673n;
    /**  Optimal transfer block size. */
    bsize = 4096n;
    /**  Total data blocks in file system. */
    blocks = 0n;
    /** Free blocks in file system. */
    bfree = 0n;
    /** Available blocks for unprivileged users */
    bavail = 0n;
    /** Total file nodes in file system. */
    files = BigInt(size_max);
    /** Free file nodes in file system. */
    ffree = BigInt(size_max);
  };

  // src/inode.ts
  var size_max = 2 ** 32 - 1;
  var rootIno = 0n;
  function _random() {
    return Math.round(Math.random() * 2 ** 32).toString(16);
  }
  __name(_random, "_random");
  function randomIno() {
    return BigInt("0x" + _random() + _random());
  }
  __name(randomIno, "randomIno");
  var Inode = class {
    static {
      __name(this, "Inode");
    }
    buffer;
    get data() {
      return new Uint8Array(this.buffer);
    }
    view;
    constructor(buffer) {
      const setDefaults = !buffer;
      buffer ??= new ArrayBuffer(58 /* end */);
      if (buffer?.byteLength < 58 /* end */) {
        throw new RangeError(`Can not create an inode from a buffer less than ${58 /* end */} bytes`);
      }
      this.view = new DataView(buffer);
      this.buffer = buffer;
      if (!setDefaults) {
        return;
      }
      this.ino = randomIno();
      this.nlink = 1;
      this.size = 4096;
      const now = Date.now();
      this.atimeMs = now;
      this.mtimeMs = now;
      this.ctimeMs = now;
      this.birthtimeMs = now;
    }
    get ino() {
      return this.view.getBigUint64(0 /* ino */, true);
    }
    set ino(value) {
      this.view.setBigUint64(0 /* ino */, value, true);
    }
    get size() {
      return this.view.getUint32(8 /* size */, true);
    }
    set size(value) {
      this.view.setUint32(8 /* size */, value, true);
    }
    get mode() {
      return this.view.getUint16(12 /* mode */, true);
    }
    set mode(value) {
      this.view.setUint16(12 /* mode */, value, true);
    }
    get nlink() {
      return this.view.getUint32(14 /* nlink */, true);
    }
    set nlink(value) {
      this.view.setUint32(14 /* nlink */, value, true);
    }
    get uid() {
      return this.view.getUint32(18 /* uid */, true);
    }
    set uid(value) {
      this.view.setUint32(18 /* uid */, value, true);
    }
    get gid() {
      return this.view.getUint32(22 /* gid */, true);
    }
    set gid(value) {
      this.view.setUint32(22 /* gid */, value, true);
    }
    get atimeMs() {
      return this.view.getFloat64(26 /* atime */, true);
    }
    set atimeMs(value) {
      this.view.setFloat64(26 /* atime */, value, true);
    }
    get birthtimeMs() {
      return this.view.getFloat64(34 /* birthtime */, true);
    }
    set birthtimeMs(value) {
      this.view.setFloat64(34 /* birthtime */, value, true);
    }
    get mtimeMs() {
      return this.view.getFloat64(42 /* mtime */, true);
    }
    set mtimeMs(value) {
      this.view.setFloat64(42 /* mtime */, value, true);
    }
    get ctimeMs() {
      return this.view.getFloat64(50 /* ctime */, true);
    }
    set ctimeMs(value) {
      this.view.setFloat64(50 /* ctime */, value, true);
    }
    /**
     * Handy function that converts the Inode to a Node Stats object.
     */
    toStats() {
      return new Stats(this);
    }
    /**
     * Updates the Inode using information from the stats object. Used by file
     * systems at sync time, e.g.:
     * - Program opens file and gets a File object.
     * - Program mutates file. File object is responsible for maintaining
     *   metadata changes locally -- typically in a Stats object.
     * - Program closes file. File object's metadata changes are synced with the
     *   file system.
     * @return True if any changes have occurred.
     */
    update(stats) {
      let hasChanged = false;
      if (this.size !== stats.size) {
        this.size = stats.size;
        hasChanged = true;
      }
      if (this.mode !== stats.mode) {
        this.mode = stats.mode;
        hasChanged = true;
      }
      if (this.nlink !== stats.nlink) {
        this.nlink = stats.nlink;
        hasChanged = true;
      }
      if (this.uid !== stats.uid) {
        this.uid = stats.uid;
        hasChanged = true;
      }
      if (this.uid !== stats.uid) {
        this.uid = stats.uid;
        hasChanged = true;
      }
      if (this.atimeMs !== stats.atimeMs) {
        this.atimeMs = stats.atimeMs;
        hasChanged = true;
      }
      if (this.mtimeMs !== stats.mtimeMs) {
        this.mtimeMs = stats.mtimeMs;
        hasChanged = true;
      }
      if (this.ctimeMs !== stats.ctimeMs) {
        this.ctimeMs = stats.ctimeMs;
        hasChanged = true;
      }
      return hasChanged;
    }
  };

  // src/symbol-dispose.ts
  Symbol["dispose"] ??= Symbol("Symbol.dispose");
  Symbol["asyncDispose"] ??= Symbol("Symbol.asyncDispose");

  // src/file.ts
  var validFlags = ["r", "r+", "rs", "rs+", "w", "wx", "w+", "wx+", "a", "ax", "a+", "ax+"];
  function parseFlag(flag) {
    if (typeof flag === "number") {
      return flagToString(flag);
    }
    if (!validFlags.includes(flag)) {
      throw new Error("Invalid flag string: " + flag);
    }
    return flag;
  }
  __name(parseFlag, "parseFlag");
  function flagToString(flag) {
    switch (flag) {
      case O_RDONLY:
        return "r";
      case O_RDONLY | O_SYNC:
        return "rs";
      case O_RDWR:
        return "r+";
      case O_RDWR | O_SYNC:
        return "rs+";
      case O_TRUNC | O_CREAT | O_WRONLY:
        return "w";
      case O_TRUNC | O_CREAT | O_WRONLY | O_EXCL:
        return "wx";
      case O_TRUNC | O_CREAT | O_RDWR:
        return "w+";
      case O_TRUNC | O_CREAT | O_RDWR | O_EXCL:
        return "wx+";
      case O_APPEND | O_CREAT | O_WRONLY:
        return "a";
      case O_APPEND | O_CREAT | O_WRONLY | O_EXCL:
        return "ax";
      case O_APPEND | O_CREAT | O_RDWR:
        return "a+";
      case O_APPEND | O_CREAT | O_RDWR | O_EXCL:
        return "ax+";
      default:
        throw new Error("Invalid flag number: " + flag);
    }
  }
  __name(flagToString, "flagToString");
  function flagToNumber(flag) {
    switch (flag) {
      case "r":
        return O_RDONLY;
      case "rs":
        return O_RDONLY | O_SYNC;
      case "r+":
        return O_RDWR;
      case "rs+":
        return O_RDWR | O_SYNC;
      case "w":
        return O_TRUNC | O_CREAT | O_WRONLY;
      case "wx":
        return O_TRUNC | O_CREAT | O_WRONLY | O_EXCL;
      case "w+":
        return O_TRUNC | O_CREAT | O_RDWR;
      case "wx+":
        return O_TRUNC | O_CREAT | O_RDWR | O_EXCL;
      case "a":
        return O_APPEND | O_CREAT | O_WRONLY;
      case "ax":
        return O_APPEND | O_CREAT | O_WRONLY | O_EXCL;
      case "a+":
        return O_APPEND | O_CREAT | O_RDWR;
      case "ax+":
        return O_APPEND | O_CREAT | O_RDWR | O_EXCL;
      default:
        throw new Error("Invalid flag string: " + flag);
    }
  }
  __name(flagToNumber, "flagToNumber");
  function flagToMode(flag) {
    let mode = 0;
    mode <<= 1;
    mode += +isReadable(flag);
    mode <<= 1;
    mode += +isWriteable(flag);
    mode <<= 1;
    return mode;
  }
  __name(flagToMode, "flagToMode");
  function isReadable(flag) {
    return flag.indexOf("r") !== -1 || flag.indexOf("+") !== -1;
  }
  __name(isReadable, "isReadable");
  function isWriteable(flag) {
    return flag.indexOf("w") !== -1 || flag.indexOf("a") !== -1 || flag.indexOf("+") !== -1;
  }
  __name(isWriteable, "isWriteable");
  function isTruncating(flag) {
    return flag.indexOf("w") !== -1;
  }
  __name(isTruncating, "isTruncating");
  function isAppendable(flag) {
    return flag.indexOf("a") !== -1;
  }
  __name(isAppendable, "isAppendable");
  function isSynchronous(flag) {
    return flag.indexOf("s") !== -1;
  }
  __name(isSynchronous, "isSynchronous");
  function isExclusive(flag) {
    return flag.indexOf("x") !== -1;
  }
  __name(isExclusive, "isExclusive");
  var File = class {
    static {
      __name(this, "File");
    }
    [Symbol.asyncDispose]() {
      return this.close();
    }
    [Symbol.dispose]() {
      return this.closeSync();
    }
    /**
     * Asynchronous `datasync`.
     *
     * Default implementation maps to `sync`.
     */
    datasync() {
      return this.sync();
    }
    /**
     * Synchronous `datasync`.
     *
     * Default implementation maps to `syncSync`.
     */
    datasyncSync() {
      return this.syncSync();
    }
  };
  var PreloadFile = class extends File {
    /**
     * Creates a file with the given path and, optionally, the given contents. Note
     * that, if contents is specified, it will be mutated by the file!
     * @param _mode The mode that the file was opened using.
     *   Dictates permissions and where the file pointer starts.
     * @param stats The stats object for the given file.
     *   PreloadFile will mutate this object. Note that this object must contain
     *   the appropriate mode that the file was opened as.
     * @param buffer A buffer containing the entire
     *   contents of the file. PreloadFile will mutate this buffer. If not
     *   specified, we assume it is a new file.
     */
    constructor(fs, path, flag, stats, _buffer = new Uint8Array(new ArrayBuffer(0, fs.metadata().noResizableBuffers ? {} : { maxByteLength: size_max }))) {
      super();
      this.fs = fs;
      this.path = path;
      this.flag = flag;
      this.stats = stats;
      this._buffer = _buffer;
      if (this.stats.size == _buffer.byteLength) {
        return;
      }
      if (isReadable(this.flag)) {
        throw new Error(`Size mismatch: buffer length ${_buffer.byteLength}, stats size ${this.stats.size}`);
      }
      this.dirty = true;
    }
    static {
      __name(this, "PreloadFile");
    }
    _position = 0;
    dirty = false;
    /**
     * Get the underlying buffer for this file. Mutating not recommended and will mess up dirty tracking.
     */
    get buffer() {
      return this._buffer;
    }
    /**
     * Get the current file position.
     *
     * We emulate the following bug mentioned in the Node documentation:
     * > On Linux, positional writes don't work when the file is opened in append
     *   mode. The kernel ignores the position argument and always appends the data
     *   to the end of the file.
     * @return The current file position.
     */
    get position() {
      if (isAppendable(this.flag)) {
        return this.stats.size;
      }
      return this._position;
    }
    /**
     * Set the file position.
     * @param newPos new position
     */
    set position(newPos) {
      this._position = newPos;
    }
    async sync() {
      if (!this.dirty) {
        return;
      }
      await this.fs.sync(this.path, this._buffer, this.stats);
      this.dirty = false;
    }
    syncSync() {
      if (!this.dirty) {
        return;
      }
      this.fs.syncSync(this.path, this._buffer, this.stats);
      this.dirty = false;
    }
    async close() {
      await this.sync();
    }
    closeSync() {
      this.syncSync();
    }
    /**
     * Asynchronous `stat`.
     */
    async stat() {
      return new Stats(this.stats);
    }
    /**
     * Synchronous `stat`.
     */
    statSync() {
      return new Stats(this.stats);
    }
    _truncate(length) {
      this.dirty = true;
      if (!isWriteable(this.flag)) {
        throw new ErrnoError(1 /* EPERM */, "File not opened with a writeable mode.");
      }
      this.stats.mtimeMs = Date.now();
      if (length > this._buffer.length) {
        const data = new Uint8Array(length - this._buffer.length);
        this.writeSync(data, 0, data.length, this._buffer.length);
        return;
      }
      this.stats.size = length;
      this._buffer = this._buffer.slice(0, length);
    }
    /**
     * Asynchronous truncate.
     * @param length
     */
    async truncate(length) {
      this._truncate(length);
      await this.sync();
    }
    /**
     * Synchronous truncate.
     * @param length
     */
    truncateSync(length) {
      this._truncate(length);
      this.syncSync();
    }
    _write(buffer, offset = 0, length = this.stats.size, position = this.position) {
      this.dirty = true;
      if (!isWriteable(this.flag)) {
        throw new ErrnoError(1 /* EPERM */, "File not opened with a writeable mode.");
      }
      const end = position + length;
      if (end > this.stats.size) {
        this.stats.size = end;
        if (end > this._buffer.byteLength) {
          if (this._buffer.buffer.resizable && this._buffer.buffer.maxByteLength <= end) {
            this._buffer.buffer.resize(end);
          } else {
            const newBuffer = new Uint8Array(new ArrayBuffer(end, this.fs.metadata().noResizableBuffers ? {} : { maxByteLength: size_max }));
            newBuffer.set(this._buffer);
            this._buffer = newBuffer;
          }
        }
      }
      const slice = buffer.slice(offset, offset + length);
      this._buffer.set(slice, position);
      this.stats.mtimeMs = Date.now();
      this.position = position + slice.byteLength;
      return slice.byteLength;
    }
    /**
     * Write buffer to the file.
     * Note that it is unsafe to use fs.write multiple times on the same file
     * without waiting for the callback.
     * @param buffer Uint8Array containing the data to write to
     *  the file.
     * @param offset Offset in the buffer to start reading data from.
     * @param length The amount of bytes to write to the file.
     * @param position Offset from the beginning of the file where this
     *   data should be written. If position is null, the data will be written at
     *   the current position.
     */
    async write(buffer, offset, length, position) {
      const bytesWritten = this._write(buffer, offset, length, position);
      await this.sync();
      return bytesWritten;
    }
    /**
     * Write buffer to the file.
     * Note that it is unsafe to use fs.writeSync multiple times on the same file
     * without waiting for the callback.
     * @param buffer Uint8Array containing the data to write to
     *  the file.
     * @param offset Offset in the buffer to start reading data from.
     * @param length The amount of bytes to write to the file.
     * @param position Offset from the beginning of the file where this
     *   data should be written. If position is null, the data will be written at
     *   the current position.
     * @returns bytes written
     */
    writeSync(buffer, offset = 0, length = this.stats.size, position = this.position) {
      const bytesWritten = this._write(buffer, offset, length, position);
      this.syncSync();
      return bytesWritten;
    }
    _read(buffer, offset = 0, length = this.stats.size, position) {
      if (!isReadable(this.flag)) {
        throw new ErrnoError(1 /* EPERM */, "File not opened with a readable mode.");
      }
      this.dirty = true;
      position ??= this.position;
      let end = position + length;
      if (end > this.stats.size) {
        end = position + Math.max(this.stats.size - position, 0);
      }
      this.stats.atimeMs = Date.now();
      this._position = end;
      const bytesRead = end - position;
      if (bytesRead == 0) {
        return bytesRead;
      }
      new Uint8Array(buffer.buffer, offset, length).set(this._buffer.slice(position, end));
      return bytesRead;
    }
    /**
     * Read data from the file.
     * @param buffer The buffer that the data will be
     *   written to.
     * @param offset The offset within the buffer where writing will
     *   start.
     * @param length An integer specifying the number of bytes to read.
     * @param position An integer specifying where to begin reading from
     *   in the file. If position is null, data will be read from the current file
     *   position.
     */
    async read(buffer, offset, length, position) {
      const bytesRead = this._read(buffer, offset, length, position);
      await this.sync();
      return { bytesRead, buffer };
    }
    /**
     * Read data from the file.
     * @param buffer The buffer that the data will be
     *   written to.
     * @param offset The offset within the buffer where writing will start.
     * @param length An integer specifying the number of bytes to read.
     * @param position An integer specifying where to begin reading from
     *   in the file. If position is null, data will be read from the current file
     *   position.
     * @returns number of bytes written
     */
    readSync(buffer, offset, length, position) {
      const bytesRead = this._read(buffer, offset, length, position);
      this.statSync();
      return bytesRead;
    }
    /**
     * Asynchronous `fchmod`.
     * @param mode the mode
     */
    async chmod(mode) {
      this.dirty = true;
      this.stats.chmod(mode);
      await this.sync();
    }
    /**
     * Synchronous `fchmod`.
     * @param mode
     */
    chmodSync(mode) {
      this.dirty = true;
      this.stats.chmod(mode);
      this.syncSync();
    }
    /**
     * Asynchronous `fchown`.
     * @param uid
     * @param gid
     */
    async chown(uid, gid) {
      this.dirty = true;
      this.stats.chown(uid, gid);
      await this.sync();
    }
    /**
     * Synchronous `fchown`.
     * @param uid
     * @param gid
     */
    chownSync(uid, gid) {
      this.dirty = true;
      this.stats.chown(uid, gid);
      this.syncSync();
    }
    async utimes(atime, mtime) {
      this.dirty = true;
      this.stats.atime = atime;
      this.stats.mtime = mtime;
      await this.sync();
    }
    utimesSync(atime, mtime) {
      this.dirty = true;
      this.stats.atime = atime;
      this.stats.mtime = mtime;
      this.syncSync();
    }
    async _setType(type) {
      this.dirty = true;
      this.stats.mode = this.stats.mode & ~S_IFMT | type;
      await this.sync();
    }
    _setTypeSync(type) {
      this.dirty = true;
      this.stats.mode = this.stats.mode & ~S_IFMT | type;
      this.syncSync();
    }
  };
  var NoSyncFile = class extends PreloadFile {
    static {
      __name(this, "NoSyncFile");
    }
    constructor(fs, path, flag, stats, contents) {
      super(fs, path, flag, stats, contents);
    }
    /**
     * Asynchronous sync. Doesn't do anything, simply calls the cb.
     */
    async sync() {
      return;
    }
    /**
     * Synchronous sync. Doesn't do anything.
     */
    syncSync() {
    }
    /**
     * Asynchronous close. Doesn't do anything, simply calls the cb.
     */
    async close() {
      return;
    }
    /**
     * Synchronous close. Doesn't do anything.
     */
    closeSync() {
    }
  };

  // src/cred.ts
  var rootCred = {
    uid: 0,
    gid: 0,
    suid: 0,
    sgid: 0,
    euid: 0,
    egid: 0
  };

  // src/emulation/path.ts
  var cwd = "/";
  function normalizeString(path, allowAboveRoot) {
    let res = "";
    let lastSegmentLength = 0;
    let lastSlash = -1;
    let dots = 0;
    let char = "\0";
    for (let i = 0; i <= path.length; ++i) {
      if (i < path.length) {
        char = path[i];
      } else if (char == "/") {
        break;
      } else {
        char = "/";
      }
      if (char == "/") {
        if (lastSlash === i - 1 || dots === 1) {
        } else if (dots === 2) {
          if (res.length < 2 || lastSegmentLength !== 2 || res.at(-1) !== "." || res.at(-2) !== ".") {
            if (res.length > 2) {
              const lastSlashIndex = res.lastIndexOf("/");
              if (lastSlashIndex === -1) {
                res = "";
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
              }
              lastSlash = i;
              dots = 0;
              continue;
            } else if (res.length !== 0) {
              res = "";
              lastSegmentLength = 0;
              lastSlash = i;
              dots = 0;
              continue;
            }
          }
          if (allowAboveRoot) {
            res += res.length > 0 ? "/.." : "..";
            lastSegmentLength = 2;
          }
        } else {
          if (res.length > 0) res += "/" + path.slice(lastSlash + 1, i);
          else res = path.slice(lastSlash + 1, i);
          lastSegmentLength = i - lastSlash - 1;
        }
        lastSlash = i;
        dots = 0;
      } else if (char === "." && dots !== -1) {
        ++dots;
      } else {
        dots = -1;
      }
    }
    return res;
  }
  __name(normalizeString, "normalizeString");
  function resolve(...parts) {
    let resolved = "";
    for (const part of [...parts.reverse(), cwd]) {
      if (!part.length) {
        continue;
      }
      resolved = `${part}/${resolved}`;
      if (part.startsWith("/")) {
        break;
      }
    }
    const absolute = resolved.startsWith("/");
    resolved = normalizeString(resolved, !absolute);
    if (absolute) {
      return `/${resolved}`;
    }
    return resolved.length ? resolved : "/";
  }
  __name(resolve, "resolve");
  function normalize(path) {
    if (!path.length) return ".";
    const isAbsolute = path.startsWith("/");
    const trailingSeparator = path.endsWith("/");
    path = normalizeString(path, !isAbsolute);
    if (!path.length) {
      if (isAbsolute) return "/";
      return trailingSeparator ? "./" : ".";
    }
    if (trailingSeparator) path += "/";
    return isAbsolute ? `/${path}` : path;
  }
  __name(normalize, "normalize");
  function join(...parts) {
    if (!parts.length) return ".";
    const joined = parts.join("/");
    if (!joined?.length) return ".";
    return normalize(joined);
  }
  __name(join, "join");
  function dirname(path) {
    if (path.length === 0) return ".";
    const hasRoot = path[0] === "/";
    let end = -1;
    let matchedSlash = true;
    for (let i = path.length - 1; i >= 1; --i) {
      if (path[i] === "/") {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
        matchedSlash = false;
      }
    }
    if (end === -1) return hasRoot ? "/" : ".";
    if (hasRoot && end === 1) return "//";
    return path.slice(0, end);
  }
  __name(dirname, "dirname");
  function basename(path, suffix) {
    let start = 0;
    let end = -1;
    let matchedSlash = true;
    if (suffix !== void 0 && suffix.length > 0 && suffix.length <= path.length) {
      if (suffix === path) return "";
      let extIdx = suffix.length - 1;
      let firstNonSlashEnd = -1;
      for (let i = path.length - 1; i >= 0; --i) {
        if (path[i] === "/") {
          if (!matchedSlash) {
            start = i + 1;
            break;
          }
        } else {
          if (firstNonSlashEnd === -1) {
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            if (path[i] === suffix[extIdx]) {
              if (--extIdx === -1) {
                end = i;
              }
            } else {
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }
      if (start === end) end = firstNonSlashEnd;
      else if (end === -1) end = path.length;
      return path.slice(start, end);
    }
    for (let i = path.length - 1; i >= 0; --i) {
      if (path[i] === "/") {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
        matchedSlash = false;
        end = i + 1;
      }
    }
    if (end === -1) return "";
    return path.slice(start, end);
  }
  __name(basename, "basename");
  function parse(path) {
    const isAbsolute = path.startsWith("/");
    const ret = { root: isAbsolute ? "/" : "", dir: "", base: "", ext: "", name: "" };
    if (path.length === 0) return ret;
    const start = isAbsolute ? 1 : 0;
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let i = path.length - 1;
    let preDotState = 0;
    for (; i >= start; --i) {
      if (path[i] === "/") {
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
      if (end === -1) {
        matchedSlash = false;
        end = i + 1;
      }
      if (path[i] === ".") {
        if (startDot === -1) startDot = i;
        else if (preDotState !== 1) preDotState = 1;
      } else if (startDot !== -1) {
        preDotState = -1;
      }
    }
    if (end !== -1) {
      const start2 = startPart === 0 && isAbsolute ? 1 : startPart;
      if (startDot === -1 || // We saw a non-dot character immediately before the dot
      preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        ret.base = ret.name = path.slice(start2, end);
      } else {
        ret.name = path.slice(start2, startDot);
        ret.base = path.slice(start2, end);
        ret.ext = path.slice(startDot, end);
      }
    }
    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);
    else if (isAbsolute) ret.dir = "/";
    return ret;
  }
  __name(parse, "parse");

  // src/filesystem.ts
  var FileSystem = class {
    static {
      __name(this, "FileSystem");
    }
    /**
     * Get metadata about the current file system
     */
    metadata() {
      return {
        name: this.constructor.name.toLowerCase(),
        readonly: false,
        totalSpace: 0,
        freeSpace: 0,
        noResizableBuffers: false,
        noAsyncCache: this._disableSync ?? false,
        type: ZenFsType
      };
    }
    /**
     * Whether the sync cache should be disabled.
     * Only affects async things.
     * @internal @protected
     */
    _disableSync;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    constructor(...args) {
    }
    async ready() {
    }
    /**
     * Test whether or not the given path exists by checking with the file system.
     */
    async exists(path, cred2) {
      try {
        await this.stat(path, cred2);
        return true;
      } catch (e) {
        return e.code != "ENOENT";
      }
    }
    /**
     * Test whether or not the given path exists by checking with the file system.
     */
    existsSync(path, cred2) {
      try {
        this.statSync(path, cred2);
        return true;
      } catch (e) {
        return e.code != "ENOENT";
      }
    }
  };
  function Sync(FS) {
    class SyncFS extends FS {
      static {
        __name(this, "SyncFS");
      }
      async exists(path, cred2) {
        return this.existsSync(path, cred2);
      }
      async rename(oldPath, newPath, cred2) {
        return this.renameSync(oldPath, newPath, cred2);
      }
      async stat(path, cred2) {
        return this.statSync(path, cred2);
      }
      async createFile(path, flag, mode, cred2) {
        return this.createFileSync(path, flag, mode, cred2);
      }
      async openFile(path, flag, cred2) {
        return this.openFileSync(path, flag, cred2);
      }
      async unlink(path, cred2) {
        return this.unlinkSync(path, cred2);
      }
      async rmdir(path, cred2) {
        return this.rmdirSync(path, cred2);
      }
      async mkdir(path, mode, cred2) {
        return this.mkdirSync(path, mode, cred2);
      }
      async readdir(path, cred2) {
        return this.readdirSync(path, cred2);
      }
      async link(srcpath, dstpath, cred2) {
        return this.linkSync(srcpath, dstpath, cred2);
      }
      async sync(path, data, stats) {
        return this.syncSync(path, data, stats);
      }
    }
    return SyncFS;
  }
  __name(Sync, "Sync");
  function Async(FS) {
    class AsyncFS extends FS {
      static {
        __name(this, "AsyncFS");
      }
      /**
       * Queue of pending asynchronous operations.
       */
      _queue = [];
      get _queueRunning() {
        return !!this._queue.length;
      }
      queueDone() {
        return new Promise((resolve2) => {
          const check = /* @__PURE__ */ __name(() => this._queueRunning ? setTimeout(check) : resolve2(), "check");
          check();
        });
      }
      _isInitialized = false;
      async ready() {
        await super.ready();
        if (this._isInitialized || this._disableSync) {
          return;
        }
        this.checkSync();
        await this._sync.ready();
        try {
          await this.crossCopy("/");
          this._isInitialized = true;
        } catch (e) {
          this._isInitialized = false;
          throw e;
        }
      }
      checkSync(path, syscall) {
        if (this._disableSync) {
          throw new ErrnoError(95 /* ENOTSUP */, "Sync caching has been disabled for this async file system", path, syscall);
        }
        if (!this._sync) {
          throw new ErrnoError(95 /* ENOTSUP */, "No sync cache is attached to this async file system", path, syscall);
        }
      }
      renameSync(oldPath, newPath, cred2) {
        this.checkSync(oldPath, "rename");
        this._sync.renameSync(oldPath, newPath, cred2);
        this.queue("rename", oldPath, newPath, cred2);
      }
      statSync(path, cred2) {
        this.checkSync(path, "stat");
        return this._sync.statSync(path, cred2);
      }
      createFileSync(path, flag, mode, cred2) {
        this.checkSync(path, "createFile");
        this._sync.createFileSync(path, flag, mode, cred2);
        this.queue("createFile", path, flag, mode, cred2);
        return this.openFileSync(path, flag, cred2);
      }
      openFileSync(path, flag, cred2) {
        this.checkSync(path, "openFile");
        const file = this._sync.openFileSync(path, flag, cred2);
        const stats = file.statSync();
        const buffer = new Uint8Array(stats.size);
        file.readSync(buffer);
        return new PreloadFile(this, path, flag, stats, buffer);
      }
      unlinkSync(path, cred2) {
        this.checkSync(path, "unlinkSync");
        this._sync.unlinkSync(path, cred2);
        this.queue("unlink", path, cred2);
      }
      rmdirSync(path, cred2) {
        this.checkSync(path, "rmdir");
        this._sync.rmdirSync(path, cred2);
        this.queue("rmdir", path, cred2);
      }
      mkdirSync(path, mode, cred2) {
        this.checkSync(path, "mkdir");
        this._sync.mkdirSync(path, mode, cred2);
        this.queue("mkdir", path, mode, cred2);
      }
      readdirSync(path, cred2) {
        this.checkSync(path, "readdir");
        return this._sync.readdirSync(path, cred2);
      }
      linkSync(srcpath, dstpath, cred2) {
        this.checkSync(srcpath, "link");
        this._sync.linkSync(srcpath, dstpath, cred2);
        this.queue("link", srcpath, dstpath, cred2);
      }
      syncSync(path, data, stats) {
        this.checkSync(path, "sync");
        this._sync.syncSync(path, data, stats);
        this.queue("sync", path, data, stats);
      }
      existsSync(path, cred2) {
        this.checkSync(path, "exists");
        return this._sync.existsSync(path, cred2);
      }
      /**
       * @internal
       */
      async crossCopy(path) {
        this.checkSync(path, "crossCopy");
        const stats = await this.stat(path, rootCred);
        if (stats.isDirectory()) {
          if (path !== "/") {
            const stats2 = await this.stat(path, rootCred);
            this._sync.mkdirSync(path, stats2.mode, stats2.cred());
          }
          const files = await this.readdir(path, rootCred);
          for (const file of files) {
            await this.crossCopy(join(path, file));
          }
        } else {
          var _stack = [];
          try {
            const asyncFile = __using(_stack, await this.openFile(path, parseFlag("r"), rootCred), true);
            const syncFile = __using(_stack, this._sync.createFileSync(path, parseFlag("w"), stats.mode, stats.cred()));
            const buffer = new Uint8Array(stats.size);
            await asyncFile.read(buffer);
            syncFile.writeSync(buffer, 0, stats.size);
          } catch (_) {
            var _error = _, _hasError = true;
          } finally {
            var _promise = __callDispose(_stack, _error, _hasError);
            _promise && await _promise;
          }
        }
      }
      /**
       * @internal
       */
      async _next() {
        if (!this._queueRunning) {
          return;
        }
        const [method, ...args] = this._queue.shift();
        await this[method](...args);
        await this._next();
      }
      /**
       * @internal
       */
      queue(...op) {
        this._queue.push(op);
        this._next();
      }
    }
    return AsyncFS;
  }
  __name(Async, "Async");
  function Readonly(FS) {
    class ReadonlyFS extends FS {
      static {
        __name(this, "ReadonlyFS");
      }
      metadata() {
        return { ...super.metadata(), readonly: true };
      }
      /* eslint-disable @typescript-eslint/no-unused-vars */
      async rename(oldPath, newPath, cred2) {
        throw new ErrnoError(30 /* EROFS */);
      }
      renameSync(oldPath, newPath, cred2) {
        throw new ErrnoError(30 /* EROFS */);
      }
      async createFile(path, flag, mode, cred2) {
        throw new ErrnoError(30 /* EROFS */);
      }
      createFileSync(path, flag, mode, cred2) {
        throw new ErrnoError(30 /* EROFS */);
      }
      async unlink(path, cred2) {
        throw new ErrnoError(30 /* EROFS */);
      }
      unlinkSync(path, cred2) {
        throw new ErrnoError(30 /* EROFS */);
      }
      async rmdir(path, cred2) {
        throw new ErrnoError(30 /* EROFS */);
      }
      rmdirSync(path, cred2) {
        throw new ErrnoError(30 /* EROFS */);
      }
      async mkdir(path, mode, cred2) {
        throw new ErrnoError(30 /* EROFS */);
      }
      mkdirSync(path, mode, cred2) {
        throw new ErrnoError(30 /* EROFS */);
      }
      async link(srcpath, dstpath, cred2) {
        throw new ErrnoError(30 /* EROFS */);
      }
      linkSync(srcpath, dstpath, cred2) {
        throw new ErrnoError(30 /* EROFS */);
      }
      async sync(path, data, stats) {
        throw new ErrnoError(30 /* EROFS */);
      }
      syncSync(path, data, stats) {
        throw new ErrnoError(30 /* EROFS */);
      }
      /* eslint-enable @typescript-eslint/no-unused-vars */
    }
    return ReadonlyFS;
  }
  __name(Readonly, "Readonly");

  // src/utils.ts
  function mkdirpSync(path, mode, cred2, fs) {
    if (!fs.existsSync(path, cred2)) {
      mkdirpSync(dirname(path), mode, cred2, fs);
      fs.mkdirSync(path, mode, cred2);
    }
  }
  __name(mkdirpSync, "mkdirpSync");
  function _min(d0, d1, d2, bx, ay) {
    return Math.min(d0 + 1, d1 + 1, d2 + 1, bx === ay ? d1 : d1 + 1);
  }
  __name(_min, "_min");
  function levenshtein(a, b) {
    if (a === b) {
      return 0;
    }
    if (a.length > b.length) {
      [a, b] = [b, a];
    }
    let la = a.length;
    let lb = b.length;
    while (la > 0 && a.charCodeAt(la - 1) === b.charCodeAt(lb - 1)) {
      la--;
      lb--;
    }
    let offset = 0;
    while (offset < la && a.charCodeAt(offset) === b.charCodeAt(offset)) {
      offset++;
    }
    la -= offset;
    lb -= offset;
    if (la === 0 || lb === 1) {
      return lb;
    }
    const vector = new Array(la << 1);
    for (let y = 0; y < la; ) {
      vector[la + y] = a.charCodeAt(offset + y);
      vector[y] = ++y;
    }
    let x;
    let d0;
    let d1;
    let d2;
    let d3;
    for (x = 0; x + 3 < lb; ) {
      const bx0 = b.charCodeAt(offset + (d0 = x));
      const bx1 = b.charCodeAt(offset + (d1 = x + 1));
      const bx2 = b.charCodeAt(offset + (d2 = x + 2));
      const bx3 = b.charCodeAt(offset + (d3 = x + 3));
      let dd2 = x += 4;
      for (let y = 0; y < la; ) {
        const ay = vector[la + y];
        const dy = vector[y];
        d0 = _min(dy, d0, d1, bx0, ay);
        d1 = _min(d0, d1, d2, bx1, ay);
        d2 = _min(d1, d2, d3, bx2, ay);
        dd2 = _min(d2, d3, dd2, bx3, ay);
        vector[y++] = dd2;
        d3 = d2;
        d2 = d1;
        d1 = d0;
        d0 = dy;
      }
    }
    let dd = 0;
    for (; x < lb; ) {
      const bx0 = b.charCodeAt(offset + (d0 = x));
      dd = ++x;
      for (let y = 0; y < la; y++) {
        const dy = vector[y];
        vector[y] = dd = dy < d0 || dd < d0 ? dy > dd ? dd + 1 : dy + 1 : bx0 === vector[la + y] ? d0 : d0 + 1;
        d0 = dy;
      }
    }
    return dd;
  }
  __name(levenshtein, "levenshtein");
  var setImmediate = typeof globalThis.setImmediate == "function" ? globalThis.setImmediate : (cb) => setTimeout(cb, 0);
  function encode(input) {
    if (typeof input != "string") {
      throw new ErrnoError(22 /* EINVAL */, "Can not encode a non-string");
    }
    return new Uint8Array(Array.from(input).map((char) => char.charCodeAt(0)));
  }
  __name(encode, "encode");
  function decode(input) {
    if (!(input instanceof Uint8Array)) {
      throw new ErrnoError(22 /* EINVAL */, "Can not decode a non-Uint8Array");
    }
    return Array.from(input).map((char) => String.fromCharCode(char)).join("");
  }
  __name(decode, "decode");
  function decodeDirListing(data) {
    return JSON.parse(decode(data), (k, v) => {
      if (k == "") {
        return v;
      }
      return BigInt(v);
    });
  }
  __name(decodeDirListing, "decodeDirListing");
  function encodeDirListing(data) {
    return encode(
      JSON.stringify(data, (k, v) => {
        if (k == "") {
          return v;
        }
        return v.toString();
      })
    );
  }
  __name(encodeDirListing, "encodeDirListing");
  function _toUnixTimestamp(time) {
    if (typeof time === "number") {
      return Math.floor(time);
    }
    if (time instanceof Date) {
      return Math.floor(time.getTime() / 1e3);
    }
    throw new Error("Cannot parse time: " + time);
  }
  __name(_toUnixTimestamp, "_toUnixTimestamp");
  function normalizeMode(mode, def) {
    if (typeof mode == "number") {
      return mode;
    }
    if (typeof mode == "string") {
      const parsed = parseInt(mode, 8);
      if (!isNaN(parsed)) {
        return parsed;
      }
    }
    if (typeof def == "number") {
      return def;
    }
    throw new ErrnoError(22 /* EINVAL */, "Invalid mode: " + mode?.toString());
  }
  __name(normalizeMode, "normalizeMode");
  function normalizeTime(time) {
    if (time instanceof Date) {
      return time;
    }
    if (typeof time == "number") {
      return new Date(time * 1e3);
    }
    if (typeof time == "string") {
      return new Date(time);
    }
    throw new ErrnoError(22 /* EINVAL */, "Invalid time.");
  }
  __name(normalizeTime, "normalizeTime");
  function normalizePath(p) {
    p = p.toString();
    if (p.includes("\0")) {
      throw new ErrnoError(22 /* EINVAL */, "Path can not contain null character");
    }
    if (p.length == 0) {
      throw new ErrnoError(22 /* EINVAL */, "Path can not be empty");
    }
    return resolve(p.replaceAll(/[/\\]+/g, "/"));
  }
  __name(normalizePath, "normalizePath");
  function normalizeOptions(options, encoding = "utf8", flag, mode = 0) {
    if (typeof options != "object" || options === null) {
      return {
        encoding: typeof options == "string" ? options : encoding ?? null,
        flag,
        mode
      };
    }
    return {
      encoding: typeof options?.encoding == "string" ? options.encoding : encoding ?? null,
      flag: typeof options?.flag == "string" ? options.flag : flag,
      mode: normalizeMode("mode" in options ? options?.mode : null, mode)
    };
  }
  __name(normalizeOptions, "normalizeOptions");
  function nop() {
  }
  __name(nop, "nop");

  // src/backends/store/fs.ts
  var maxInodeAllocTries = 5;
  var StoreFS = class extends FileSystem {
    constructor(store) {
      super();
      this.store = store;
    }
    static {
      __name(this, "StoreFS");
    }
    _initialized = false;
    async ready() {
      if (this._initialized) {
        return;
      }
      await this.checkRoot();
      this._initialized = true;
    }
    metadata() {
      return {
        ...super.metadata(),
        name: this.store.name
      };
    }
    /**
     * Delete all contents stored in the file system.
     * @deprecated
     */
    async empty() {
      await this.store.clear();
      await this.checkRoot();
    }
    /**
     * Delete all contents stored in the file system.
     * @deprecated
     */
    emptySync() {
      this.store.clearSync();
      this.checkRootSync();
    }
    /**
     * @todo Make rename compatible with the cache.
     */
    async rename(oldPath, newPath, cred2) {
      const tx = this.store.transaction(), oldParent = dirname(oldPath), oldName = basename(oldPath), newParent = dirname(newPath), newName = basename(newPath), oldDirNode = await this.findINode(tx, oldParent), oldDirList = await this.getDirListing(tx, oldDirNode, oldParent);
      if (!oldDirNode.toStats().hasAccess(W_OK, cred2)) {
        throw ErrnoError.With("EACCES", oldPath, "rename");
      }
      if (!oldDirList[oldName]) {
        throw ErrnoError.With("ENOENT", oldPath, "rename");
      }
      const nodeId = oldDirList[oldName];
      delete oldDirList[oldName];
      if ((newParent + "/").indexOf(oldPath + "/") === 0) {
        throw new ErrnoError(16 /* EBUSY */, oldParent);
      }
      let newDirNode, newDirList;
      if (newParent === oldParent) {
        newDirNode = oldDirNode;
        newDirList = oldDirList;
      } else {
        newDirNode = await this.findINode(tx, newParent);
        newDirList = await this.getDirListing(tx, newDirNode, newParent);
      }
      if (newDirList[newName]) {
        const newNameNode = await this.getINode(tx, newDirList[newName], newPath);
        if (newNameNode.toStats().isFile()) {
          try {
            await tx.remove(newNameNode.ino);
            await tx.remove(newDirList[newName]);
          } catch (e) {
            await tx.abort();
            throw e;
          }
        } else {
          throw ErrnoError.With("EPERM", newPath, "rename");
        }
      }
      newDirList[newName] = nodeId;
      try {
        await tx.set(oldDirNode.ino, encodeDirListing(oldDirList));
        await tx.set(newDirNode.ino, encodeDirListing(newDirList));
      } catch (e) {
        await tx.abort();
        throw e;
      }
      await tx.commit();
    }
    renameSync(oldPath, newPath, cred2) {
      const tx = this.store.transaction(), oldParent = dirname(oldPath), oldName = basename(oldPath), newParent = dirname(newPath), newName = basename(newPath), oldDirNode = this.findINodeSync(tx, oldParent), oldDirList = this.getDirListingSync(tx, oldDirNode, oldParent);
      if (!oldDirNode.toStats().hasAccess(W_OK, cred2)) {
        throw ErrnoError.With("EACCES", oldPath, "rename");
      }
      if (!oldDirList[oldName]) {
        throw ErrnoError.With("ENOENT", oldPath, "rename");
      }
      const ino = oldDirList[oldName];
      delete oldDirList[oldName];
      if ((newParent + "/").indexOf(oldPath + "/") == 0) {
        throw new ErrnoError(16 /* EBUSY */, oldParent);
      }
      let newDirNode, newDirList;
      if (newParent === oldParent) {
        newDirNode = oldDirNode;
        newDirList = oldDirList;
      } else {
        newDirNode = this.findINodeSync(tx, newParent);
        newDirList = this.getDirListingSync(tx, newDirNode, newParent);
      }
      if (newDirList[newName]) {
        const newNameNode = this.getINodeSync(tx, newDirList[newName], newPath);
        if (newNameNode.toStats().isFile()) {
          try {
            tx.removeSync(newNameNode.ino);
            tx.removeSync(newDirList[newName]);
          } catch (e) {
            tx.abortSync();
            throw e;
          }
        } else {
          throw ErrnoError.With("EPERM", newPath, "rename");
        }
      }
      newDirList[newName] = ino;
      try {
        tx.setSync(oldDirNode.ino, encodeDirListing(oldDirList));
        tx.setSync(newDirNode.ino, encodeDirListing(newDirList));
      } catch (e) {
        tx.abortSync();
        throw e;
      }
      tx.commitSync();
    }
    async stat(path, cred2) {
      const tx = this.store.transaction();
      const inode = await this.findINode(tx, path);
      if (!inode) {
        throw ErrnoError.With("ENOENT", path, "stat");
      }
      const stats = inode.toStats();
      if (!stats.hasAccess(R_OK, cred2)) {
        throw ErrnoError.With("EACCES", path, "stat");
      }
      return stats;
    }
    statSync(path, cred2) {
      const stats = this.findINodeSync(this.store.transaction(), path).toStats();
      if (!stats.hasAccess(R_OK, cred2)) {
        throw ErrnoError.With("EACCES", path, "stat");
      }
      return stats;
    }
    async createFile(path, flag, mode, cred2) {
      const data = new Uint8Array(0);
      const file = await this.commitNew(this.store.transaction(), path, FileType.FILE, mode, cred2, data);
      return new PreloadFile(this, path, flag, file.toStats(), data);
    }
    createFileSync(path, flag, mode, cred2) {
      this.commitNewSync(path, FileType.FILE, mode, cred2);
      return this.openFileSync(path, flag, cred2);
    }
    async openFile(path, flag, cred2) {
      const tx = this.store.transaction(), node = await this.findINode(tx, path), data = await tx.get(node.ino);
      if (!node.toStats().hasAccess(flagToMode(flag), cred2)) {
        throw ErrnoError.With("EACCES", path, "openFile");
      }
      if (!data) {
        throw ErrnoError.With("ENOENT", path, "openFile");
      }
      return new PreloadFile(this, path, flag, node.toStats(), data);
    }
    openFileSync(path, flag, cred2) {
      const tx = this.store.transaction(), node = this.findINodeSync(tx, path), data = tx.getSync(node.ino);
      if (!node.toStats().hasAccess(flagToMode(flag), cred2)) {
        throw ErrnoError.With("EACCES", path, "openFile");
      }
      if (!data) {
        throw ErrnoError.With("ENOENT", path, "openFile");
      }
      return new PreloadFile(this, path, flag, node.toStats(), data);
    }
    async unlink(path, cred2) {
      return this.remove(path, false, cred2);
    }
    unlinkSync(path, cred2) {
      this.removeSync(path, false, cred2);
    }
    async rmdir(path, cred2) {
      const list = await this.readdir(path, cred2);
      if (list.length > 0) {
        throw ErrnoError.With("ENOTEMPTY", path, "rmdir");
      }
      await this.remove(path, true, cred2);
    }
    rmdirSync(path, cred2) {
      if (this.readdirSync(path, cred2).length > 0) {
        throw ErrnoError.With("ENOTEMPTY", path, "rmdir");
      } else {
        this.removeSync(path, true, cred2);
      }
    }
    async mkdir(path, mode, cred2) {
      const tx = this.store.transaction(), data = encode("{}");
      await this.commitNew(tx, path, FileType.DIRECTORY, mode, cred2, data);
    }
    mkdirSync(path, mode, cred2) {
      this.commitNewSync(path, FileType.DIRECTORY, mode, cred2, encode("{}"));
    }
    async readdir(path, cred2) {
      const tx = this.store.transaction();
      const node = await this.findINode(tx, path);
      if (!node.toStats().hasAccess(R_OK, cred2)) {
        throw ErrnoError.With("EACCES", path, "readdur");
      }
      return Object.keys(await this.getDirListing(tx, node, path));
    }
    readdirSync(path, cred2) {
      const tx = this.store.transaction();
      const node = this.findINodeSync(tx, path);
      if (!node.toStats().hasAccess(R_OK, cred2)) {
        throw ErrnoError.With("EACCES", path, "readdir");
      }
      return Object.keys(this.getDirListingSync(tx, node, path));
    }
    /**
     * Updated the inode and data node at the given path
     * @todo Ensure mtime updates properly, and use that to determine if a data update is required.
     */
    async sync(path, data, stats) {
      const tx = this.store.transaction(), fileInodeId = await this._findINode(tx, dirname(path), basename(path)), fileInode = await this.getINode(tx, fileInodeId, path), inodeChanged = fileInode.update(stats);
      try {
        await tx.set(fileInode.ino, data);
        if (inodeChanged) {
          await tx.set(fileInodeId, fileInode.data);
        }
      } catch (e) {
        await tx.abort();
        throw e;
      }
      await tx.commit();
    }
    /**
     * Updated the inode and data node at the given path
     * @todo Ensure mtime updates properly, and use that to determine if a data update is required.
     */
    syncSync(path, data, stats) {
      const tx = this.store.transaction(), fileInodeId = this._findINodeSync(tx, dirname(path), basename(path)), fileInode = this.getINodeSync(tx, fileInodeId, path), inodeChanged = fileInode.update(stats);
      try {
        tx.setSync(fileInode.ino, data);
        if (inodeChanged) {
          tx.setSync(fileInodeId, fileInode.data);
        }
      } catch (e) {
        tx.abortSync();
        throw e;
      }
      tx.commitSync();
    }
    async link(existing, newpath, cred2) {
      const tx = this.store.transaction(), existingDir = dirname(existing), existingDirNode = await this.findINode(tx, existingDir);
      if (!existingDirNode.toStats().hasAccess(R_OK, cred2)) {
        throw ErrnoError.With("EACCES", existingDir, "link");
      }
      const newDir = dirname(newpath), newDirNode = await this.findINode(tx, newDir), newListing = await this.getDirListing(tx, newDirNode, newDir);
      if (!newDirNode.toStats().hasAccess(W_OK, cred2)) {
        throw ErrnoError.With("EACCES", newDir, "link");
      }
      const ino = await this._findINode(tx, existingDir, basename(existing));
      const node = await this.getINode(tx, ino, existing);
      if (!node.toStats().hasAccess(W_OK, cred2)) {
        throw ErrnoError.With("EACCES", newpath, "link");
      }
      node.nlink++;
      newListing[basename(newpath)] = ino;
      try {
        tx.setSync(ino, node.data);
        tx.setSync(newDirNode.ino, encodeDirListing(newListing));
      } catch (e) {
        tx.abortSync();
        throw e;
      }
      tx.commitSync();
    }
    linkSync(existing, newpath, cred2) {
      const tx = this.store.transaction(), existingDir = dirname(existing), existingDirNode = this.findINodeSync(tx, existingDir);
      if (!existingDirNode.toStats().hasAccess(R_OK, cred2)) {
        throw ErrnoError.With("EACCES", existingDir, "link");
      }
      const newDir = dirname(newpath), newDirNode = this.findINodeSync(tx, newDir), newListing = this.getDirListingSync(tx, newDirNode, newDir);
      if (!newDirNode.toStats().hasAccess(W_OK, cred2)) {
        throw ErrnoError.With("EACCES", newDir, "link");
      }
      const ino = this._findINodeSync(tx, existingDir, basename(existing));
      const node = this.getINodeSync(tx, ino, existing);
      if (!node.toStats().hasAccess(W_OK, cred2)) {
        throw ErrnoError.With("EACCES", newpath, "link");
      }
      node.nlink++;
      newListing[basename(newpath)] = ino;
      try {
        tx.setSync(ino, node.data);
        tx.setSync(newDirNode.ino, encodeDirListing(newListing));
      } catch (e) {
        tx.abortSync();
        throw e;
      }
      tx.commitSync();
    }
    /**
     * Checks if the root directory exists. Creates it if it doesn't.
     */
    async checkRoot() {
      const tx = this.store.transaction();
      if (await tx.get(rootIno)) {
        return;
      }
      const inode = new Inode();
      inode.mode = 511 | FileType.DIRECTORY;
      await tx.set(inode.ino, encode("{}"));
      await tx.set(rootIno, inode.data);
      await tx.commit();
    }
    /**
     * Checks if the root directory exists. Creates it if it doesn't.
     */
    checkRootSync() {
      const tx = this.store.transaction();
      if (tx.getSync(rootIno)) {
        return;
      }
      const inode = new Inode();
      inode.mode = 511 | FileType.DIRECTORY;
      tx.setSync(inode.ino, encode("{}"));
      tx.setSync(rootIno, inode.data);
      tx.commitSync();
    }
    /**
     * Helper function for findINode.
     * @param parent The parent directory of the file we are attempting to find.
     * @param filename The filename of the inode we are attempting to find, minus
     *   the parent.
     */
    async _findINode(tx, parent, filename, visited = /* @__PURE__ */ new Set()) {
      const currentPath = join(parent, filename);
      if (visited.has(currentPath)) {
        throw new ErrnoError(5 /* EIO */, "Infinite loop detected while finding inode", currentPath);
      }
      visited.add(currentPath);
      if (parent == "/" && filename === "") {
        return rootIno;
      }
      const inode = parent == "/" ? await this.getINode(tx, rootIno, parent) : await this.findINode(tx, parent, visited);
      const dirList = await this.getDirListing(tx, inode, parent);
      if (!(filename in dirList)) {
        throw ErrnoError.With("ENOENT", resolve(parent, filename), "_findINode");
      }
      return dirList[filename];
    }
    /**
     * Helper function for findINode.
     * @param parent The parent directory of the file we are attempting to find.
     * @param filename The filename of the inode we are attempting to find, minus
     *   the parent.
     * @return string The ID of the file's inode in the file system.
     */
    _findINodeSync(tx, parent, filename, visited = /* @__PURE__ */ new Set()) {
      const currentPath = join(parent, filename);
      if (visited.has(currentPath)) {
        throw new ErrnoError(5 /* EIO */, "Infinite loop detected while finding inode", currentPath);
      }
      visited.add(currentPath);
      if (parent == "/" && filename === "") {
        return rootIno;
      }
      const inode = parent == "/" ? this.getINodeSync(tx, rootIno, parent) : this.findINodeSync(tx, parent, visited);
      const dir = this.getDirListingSync(tx, inode, parent);
      if (!(filename in dir)) {
        throw ErrnoError.With("ENOENT", resolve(parent, filename), "_findINode");
      }
      return dir[filename];
    }
    /**
     * Finds the Inode of the given path.
     * @param path The path to look up.
     * @todo memoize/cache
     */
    async findINode(tx, path, visited = /* @__PURE__ */ new Set()) {
      const id = await this._findINode(tx, dirname(path), basename(path), visited);
      return this.getINode(tx, id, path);
    }
    /**
     * Finds the Inode of the given path.
     * @param path The path to look up.
     * @return The Inode of the path p.
     * @todo memoize/cache
     */
    findINodeSync(tx, path, visited = /* @__PURE__ */ new Set()) {
      const ino = this._findINodeSync(tx, dirname(path), basename(path), visited);
      return this.getINodeSync(tx, ino, path);
    }
    /**
     * Given the ID of a node, retrieves the corresponding Inode.
     * @param tx The transaction to use.
     * @param path The corresponding path to the file (used for error messages).
     * @param id The ID to look up.
     */
    async getINode(tx, id, path) {
      const data = await tx.get(id);
      if (!data) {
        throw ErrnoError.With("ENOENT", path, "getINode");
      }
      return new Inode(data.buffer);
    }
    /**
     * Given the ID of a node, retrieves the corresponding Inode.
     * @param tx The transaction to use.
     * @param path The corresponding path to the file (used for error messages).
     * @param id The ID to look up.
     */
    getINodeSync(tx, id, path) {
      const data = tx.getSync(id);
      if (!data) {
        throw ErrnoError.With("ENOENT", path, "getINode");
      }
      const inode = new Inode(data.buffer);
      return inode;
    }
    /**
     * Given the Inode of a directory, retrieves the corresponding directory
     * listing.
     */
    async getDirListing(tx, inode, path) {
      if (!inode.toStats().isDirectory()) {
        throw ErrnoError.With("ENOTDIR", path, "getDirListing");
      }
      const data = await tx.get(inode.ino);
      if (!data) {
        throw ErrnoError.With("ENOENT", path, "getDirListing");
      }
      return decodeDirListing(data);
    }
    /**
     * Given the Inode of a directory, retrieves the corresponding directory listing.
     */
    getDirListingSync(tx, inode, p) {
      if (!inode.toStats().isDirectory()) {
        throw ErrnoError.With("ENOTDIR", p, "getDirListing");
      }
      const data = tx.getSync(inode.ino);
      if (!data) {
        throw ErrnoError.With("ENOENT", p, "getDirListing");
      }
      return decodeDirListing(data);
    }
    /**
     * Adds a new node under a random ID. Retries before giving up in
     * the exceedingly unlikely chance that we try to reuse a random ino.
     */
    async addNew(tx, data, path) {
      for (let i = 0; i < maxInodeAllocTries; i++) {
        const ino = randomIno();
        if (await tx.get(ino)) {
          continue;
        }
        await tx.set(ino, data);
        return ino;
      }
      throw new ErrnoError(28 /* ENOSPC */, "No inode IDs available", path, "addNewNode");
    }
    /**
     * Creates a new node under a random ID. Retries before giving up in
     * the exceedingly unlikely chance that we try to reuse a random ino.
     * @return The ino that the data was stored under.
     */
    addNewSync(tx, data, path) {
      for (let i = 0; i < maxInodeAllocTries; i++) {
        const ino = randomIno();
        if (tx.getSync(ino)) {
          continue;
        }
        tx.setSync(ino, data);
        return ino;
      }
      throw new ErrnoError(28 /* ENOSPC */, "No inode IDs available", path, "addNewNode");
    }
    /**
     * Commits a new file (well, a FILE or a DIRECTORY) to the file system with
     * the given mode.
     * Note: This will commit the transaction.
     * @param path The path to the new file.
     * @param type The type of the new file.
     * @param mode The mode to create the new file with.
     * @param cred The UID/GID to create the file with
     * @param data The data to store at the file's data node.
     */
    async commitNew(tx, path, type, mode, cred2, data) {
      const parentPath = dirname(path), parent = await this.findINode(tx, parentPath);
      if (!parent.toStats().hasAccess(W_OK, cred2)) {
        throw ErrnoError.With("EACCES", path, "commitNewFile");
      }
      const fname = basename(path), listing = await this.getDirListing(tx, parent, parentPath);
      if (path === "/") {
        throw ErrnoError.With("EEXIST", path, "commitNewFile");
      }
      if (listing[fname]) {
        await tx.abort();
        throw ErrnoError.With("EEXIST", path, "commitNewFile");
      }
      try {
        const inode = new Inode();
        inode.ino = await this.addNew(tx, data, path);
        inode.mode = mode | type;
        inode.uid = cred2.uid;
        inode.gid = cred2.gid;
        inode.size = data.length;
        listing[fname] = await this.addNew(tx, inode.data, path);
        await tx.set(parent.ino, encodeDirListing(listing));
        await tx.commit();
        return inode;
      } catch (e) {
        tx.abort();
        throw e;
      }
    }
    /**
     * Commits a new file (well, a FILE or a DIRECTORY) to the file system with the given mode.
     * Note: This will commit the transaction.
     * @param path The path to the new file.
     * @param type The type of the new file.
     * @param mode The mode to create the new file with.
     * @param data The data to store at the file's data node.
     * @return The Inode for the new file.
     */
    commitNewSync(path, type, mode, cred2, data = new Uint8Array()) {
      const tx = this.store.transaction(), parentPath = dirname(path), parent = this.findINodeSync(tx, parentPath);
      if (!parent.toStats().hasAccess(W_OK, cred2)) {
        throw ErrnoError.With("EACCES", path, "commitNewFile");
      }
      const fname = basename(path), listing = this.getDirListingSync(tx, parent, parentPath);
      if (path === "/") {
        throw ErrnoError.With("EEXIST", path, "commitNewFile");
      }
      if (listing[fname]) {
        throw ErrnoError.With("EEXIST", path, "commitNewFile");
      }
      const node = new Inode();
      try {
        node.ino = this.addNewSync(tx, data, path);
        node.size = data.length;
        node.mode = mode | type;
        node.uid = cred2.uid;
        node.gid = cred2.gid;
        listing[fname] = this.addNewSync(tx, node.data, path);
        tx.setSync(parent.ino, encodeDirListing(listing));
      } catch (e) {
        tx.abortSync();
        throw e;
      }
      tx.commitSync();
      return node;
    }
    /**
     * Remove all traces of the given path from the file system.
     * @param path The path to remove from the file system.
     * @param isDir Does the path belong to a directory, or a file?
     * @todo Update mtime.
     */
    async remove(path, isDir, cred2) {
      const tx = this.store.transaction(), parent = dirname(path), parentNode = await this.findINode(tx, parent), listing = await this.getDirListing(tx, parentNode, parent), fileName = basename(path);
      if (!listing[fileName]) {
        throw ErrnoError.With("ENOENT", path, "removeEntry");
      }
      const fileIno = listing[fileName];
      const fileNode = await this.getINode(tx, fileIno, path);
      if (!fileNode.toStats().hasAccess(W_OK, cred2)) {
        throw ErrnoError.With("EACCES", path, "removeEntry");
      }
      delete listing[fileName];
      if (!isDir && fileNode.toStats().isDirectory()) {
        throw ErrnoError.With("EISDIR", path, "removeEntry");
      }
      if (isDir && !fileNode.toStats().isDirectory()) {
        throw ErrnoError.With("ENOTDIR", path, "removeEntry");
      }
      try {
        await tx.set(parentNode.ino, encodeDirListing(listing));
        if (--fileNode.nlink < 1) {
          await tx.remove(fileNode.ino);
          await tx.remove(fileIno);
        }
      } catch (e) {
        await tx.abort();
        throw e;
      }
      await tx.commit();
    }
    /**
     * Remove all traces of the given path from the file system.
     * @param path The path to remove from the file system.
     * @param isDir Does the path belong to a directory, or a file?
     * @todo Update mtime.
     */
    removeSync(path, isDir, cred2) {
      const tx = this.store.transaction(), parent = dirname(path), parentNode = this.findINodeSync(tx, parent), listing = this.getDirListingSync(tx, parentNode, parent), fileName = basename(path), fileIno = listing[fileName];
      if (!fileIno) {
        throw ErrnoError.With("ENOENT", path, "removeEntry");
      }
      const fileNode = this.getINodeSync(tx, fileIno, path);
      if (!fileNode.toStats().hasAccess(W_OK, cred2)) {
        throw ErrnoError.With("EACCES", path, "removeEntry");
      }
      delete listing[fileName];
      if (!isDir && fileNode.toStats().isDirectory()) {
        throw ErrnoError.With("EISDIR", path, "removeEntry");
      }
      if (isDir && !fileNode.toStats().isDirectory()) {
        throw ErrnoError.With("ENOTDIR", path, "removeEntry");
      }
      try {
        tx.setSync(parentNode.ino, encodeDirListing(listing));
        if (--fileNode.nlink < 1) {
          tx.removeSync(fileNode.ino);
          tx.removeSync(fileIno);
        }
      } catch (e) {
        tx.abortSync();
        throw e;
      }
      tx.commitSync();
    }
  };

  // src/backends/store/store.ts
  var Transaction = class {
    constructor(store) {
      this.store = store;
    }
    static {
      __name(this, "Transaction");
    }
    aborted = false;
    async [Symbol.asyncDispose]() {
      if (this.aborted) {
        return;
      }
      await this.commit();
    }
    [Symbol.dispose]() {
      if (this.aborted) {
        return;
      }
      this.commitSync();
    }
  };
  var SyncTransaction = class extends Transaction {
    static {
      __name(this, "SyncTransaction");
    }
    async get(ino) {
      return this.getSync(ino);
    }
    async set(ino, data) {
      return this.setSync(ino, data);
    }
    async remove(ino) {
      return this.removeSync(ino);
    }
    async commit() {
      return this.commitSync();
    }
    async abort() {
      return this.abortSync();
    }
  };
  var AsyncTransaction = class extends Transaction {
    static {
      __name(this, "AsyncTransaction");
    }
    getSync() {
      throw ErrnoError.With("ENOSYS", void 0, "AsyncTransaction.getSync");
    }
    setSync() {
      throw ErrnoError.With("ENOSYS", void 0, "AsyncTransaction.setSync");
    }
    removeSync() {
      throw ErrnoError.With("ENOSYS", void 0, "AsyncTransaction.removeSync");
    }
    commitSync() {
      throw ErrnoError.With("ENOSYS", void 0, "AsyncTransaction.commitSync");
    }
    abortSync() {
      throw ErrnoError.With("ENOSYS", void 0, "AsyncTransaction.abortSync");
    }
  };

  // src/backends/store/simple.ts
  var SimpleAsyncStore = class {
    static {
      __name(this, "SimpleAsyncStore");
    }
    cache = /* @__PURE__ */ new Map();
    queue = /* @__PURE__ */ new Set();
    get(ino) {
      return this.cache.get(ino);
    }
    set(ino, data) {
      this.cache.set(ino, data);
      this.queue.add(this._set(ino, data));
    }
    delete(ino) {
      this.cache.delete(ino);
      this.queue.add(this._delete(ino));
    }
    clearSync() {
      this.cache.clear();
      this.queue.add(this.clear());
    }
    async sync() {
      for (const [ino, data] of await this.entries()) {
        if (!this.cache.has(ino)) {
          this.cache.set(ino, data);
        }
      }
      for (const promise of this.queue) {
        await promise;
      }
    }
    transaction() {
      return new SimpleTransaction(this);
    }
  };
  var SimpleTransaction = class extends SyncTransaction {
    static {
      __name(this, "SimpleTransaction");
    }
    /**
     * Stores data in the keys we modify prior to modifying them.
     * Allows us to roll back commits.
     */
    originalData = /* @__PURE__ */ new Map();
    /**
     * List of keys modified in this transaction, if any.
     */
    modifiedKeys = /* @__PURE__ */ new Set();
    constructor(store) {
      super(store);
    }
    getSync(ino) {
      const val = this.store.get(ino);
      this.stashOldValue(ino, val);
      return val;
    }
    setSync(ino, data) {
      this.markModified(ino);
      return this.store.set(ino, data);
    }
    removeSync(ino) {
      this.markModified(ino);
      this.store.delete(ino);
    }
    commitSync() {
    }
    abortSync() {
      for (const key of this.modifiedKeys) {
        const value = this.originalData.get(key);
        if (!value) {
          this.store.delete(key);
        } else {
          this.store.set(key, value);
        }
      }
    }
    /**
     * Stashes given key value pair into `originalData` if it doesn't already
     * exist. Allows us to stash values the program is requesting anyway to
     * prevent needless `get` requests if the program modifies the data later
     * on during the transaction.
     */
    stashOldValue(ino, value) {
      if (!this.originalData.has(ino)) {
        this.originalData.set(ino, value);
      }
    }
    /**
     * Marks the given key as modified, and stashes its value if it has not been
     * stashed already.
     */
    markModified(ino) {
      this.modifiedKeys.add(ino);
      if (!this.originalData.has(ino)) {
        this.originalData.set(ino, this.store.get(ino));
      }
    }
  };

  // src/backends/memory.ts
  var InMemoryStore = class extends Map {
    constructor(name = "tmp") {
      super();
      this.name = name;
    }
    static {
      __name(this, "InMemoryStore");
    }
    async sync() {
    }
    clearSync() {
      this.clear();
    }
    transaction() {
      return new SimpleTransaction(this);
    }
  };
  var InMemory = {
    name: "InMemory",
    isAvailable: /* @__PURE__ */ __name(function() {
      return true;
    }, "isAvailable"),
    options: {
      name: {
        type: "string",
        required: false,
        description: "The name of the store"
      }
    },
    create: /* @__PURE__ */ __name(function({ name }) {
      const fs = new StoreFS(new InMemoryStore(name));
      fs.checkRootSync();
      return fs;
    }, "create")
  };

  // src/backends/port/rpc.ts
  function isFileData(value) {
    return typeof value == "object" && value != null && "fd" in value && "path" in value && "position" in value;
  }
  __name(isFileData, "isFileData");
  function isMessage(arg) {
    return typeof arg == "object" && arg != null && "_zenfs" in arg && !!arg._zenfs;
  }
  __name(isMessage, "isMessage");
  var executors = /* @__PURE__ */ new Map();
  function request(request2, { port, timeout = 1e3, fs } = {}) {
    const stack = new Error().stack.slice("Error:".length);
    if (!port) {
      throw ErrnoError.With("EINVAL");
    }
    return new Promise((resolve2, reject) => {
      const id = Math.random().toString(16).slice(10);
      executors.set(id, { resolve: resolve2, reject, fs });
      port.postMessage({ ...request2, _zenfs: true, id, stack });
      const _ = setTimeout(() => {
        const error = new ErrnoError(5 /* EIO */, "RPC Failed");
        error.stack += stack;
        reject(error);
        if (typeof _ == "object") _.unref();
      }, timeout);
    });
  }
  __name(request, "request");
  function handleResponse(response) {
    if (!isMessage(response)) {
      return;
    }
    const { id, value, error, stack } = response;
    if (!executors.has(id)) {
      const error2 = new ErrnoError(5 /* EIO */, "Invalid RPC id:" + id);
      error2.stack += stack;
      throw error2;
    }
    const { resolve: resolve2, reject, fs } = executors.get(id);
    if (error) {
      const e = ErrnoError.fromJSON(value);
      e.stack += stack;
      reject(e);
      executors.delete(id);
      return;
    }
    if (isFileData(value)) {
      const { fd, path, position } = value;
      const file = new PortFile(fs, fd, path, position);
      resolve2(file);
      executors.delete(id);
      return;
    }
    resolve2(value);
    executors.delete(id);
    return;
  }
  __name(handleResponse, "handleResponse");
  function attach(port, handler) {
    if (!port) {
      throw ErrnoError.With("EINVAL");
    }
    port["on" in port ? "on" : "addEventListener"]("message", (message) => {
      handler("data" in message ? message.data : message);
    });
  }
  __name(attach, "attach");
  function detach(port, handler) {
    if (!port) {
      throw ErrnoError.With("EINVAL");
    }
    port["off" in port ? "off" : "removeEventListener"]("message", (message) => {
      handler("data" in message ? message.data : message);
    });
  }
  __name(detach, "detach");

  // src/backends/port/fs.ts
  var PortFile = class extends File {
    constructor(fs, fd, path, position) {
      super();
      this.fs = fs;
      this.fd = fd;
      this.path = path;
      this.position = position;
    }
    static {
      __name(this, "PortFile");
    }
    rpc(method, ...args) {
      return request(
        {
          scope: "file",
          fd: this.fd,
          method,
          args
        },
        this.fs.options
      );
    }
    _throwNoSync(syscall) {
      throw new ErrnoError(95 /* ENOTSUP */, "Syncrohnous operations not support on PortFile", this.path, syscall);
    }
    stat() {
      return this.rpc("stat");
    }
    statSync() {
      this._throwNoSync("stat");
    }
    truncate(len) {
      return this.rpc("truncate", len);
    }
    truncateSync() {
      this._throwNoSync("truncate");
    }
    write(buffer, offset, length, position) {
      return this.rpc("write", buffer, offset, length, position);
    }
    writeSync() {
      this._throwNoSync("write");
    }
    async read(buffer, offset, length, position) {
      const result = await this.rpc("read", buffer, offset, length, position);
      return result;
    }
    readSync() {
      this._throwNoSync("read");
    }
    chown(uid, gid) {
      return this.rpc("chown", uid, gid);
    }
    chownSync() {
      this._throwNoSync("chown");
    }
    chmod(mode) {
      return this.rpc("chmod", mode);
    }
    chmodSync() {
      this._throwNoSync("chmod");
    }
    utimes(atime, mtime) {
      return this.rpc("utimes", atime, mtime);
    }
    utimesSync() {
      this._throwNoSync("utimes");
    }
    _setType(type) {
      return this.rpc("_setType", type);
    }
    _setTypeSync() {
      this._throwNoSync("_setType");
    }
    close() {
      return this.rpc("close");
    }
    closeSync() {
      this._throwNoSync("close");
    }
    sync() {
      return this.rpc("sync");
    }
    syncSync() {
      this._throwNoSync("sync");
    }
  };
  var PortFS = class extends Async(FileSystem) {
    /**
     * Constructs a new PortFS instance that connects with ZenFS running on
     * the specified port.
     */
    constructor(options) {
      super();
      this.options = options;
      this.port = options.port;
      attach(this.port, handleResponse);
    }
    static {
      __name(this, "PortFS");
    }
    port;
    /**
     * @hidden
     */
    _sync = InMemory.create({ name: "port-tmpfs" });
    metadata() {
      return {
        ...super.metadata(),
        name: "PortFS"
      };
    }
    rpc(method, ...args) {
      return request(
        {
          scope: "fs",
          method,
          args
        },
        { ...this.options, fs: this }
      );
    }
    async ready() {
      await this.rpc("ready");
      await super.ready();
    }
    rename(oldPath, newPath, cred2) {
      return this.rpc("rename", oldPath, newPath, cred2);
    }
    async stat(path, cred2) {
      return new Stats(await this.rpc("stat", path, cred2));
    }
    sync(path, data, stats) {
      return this.rpc("sync", path, data, stats);
    }
    openFile(path, flag, cred2) {
      return this.rpc("openFile", path, flag, cred2);
    }
    createFile(path, flag, mode, cred2) {
      return this.rpc("createFile", path, flag, mode, cred2);
    }
    unlink(path, cred2) {
      return this.rpc("unlink", path, cred2);
    }
    rmdir(path, cred2) {
      return this.rpc("rmdir", path, cred2);
    }
    mkdir(path, mode, cred2) {
      return this.rpc("mkdir", path, mode, cred2);
    }
    readdir(path, cred2) {
      return this.rpc("readdir", path, cred2);
    }
    exists(path, cred2) {
      return this.rpc("exists", path, cred2);
    }
    link(srcpath, dstpath, cred2) {
      return this.rpc("link", srcpath, dstpath, cred2);
    }
  };
  var nextFd = 0;
  var descriptors = /* @__PURE__ */ new Map();
  async function handleRequest(port, fs, request2) {
    if (!isMessage(request2)) {
      return;
    }
    const { method, args, id, scope, stack } = request2;
    let value, error = false;
    try {
      switch (scope) {
        case "fs":
          value = await fs[method](...args);
          if (value instanceof File) {
            descriptors.set(++nextFd, value);
            value = {
              fd: nextFd,
              path: value.path,
              position: value.position
            };
          }
          break;
        case "file":
          const { fd } = request2;
          if (!descriptors.has(fd)) {
            throw new ErrnoError(9 /* EBADF */);
          }
          value = await descriptors.get(fd)[method](...args);
          if (method == "close") {
            descriptors.delete(fd);
          }
          break;
        default:
          return;
      }
    } catch (e) {
      value = e;
      error = true;
    }
    port.postMessage({
      _zenfs: true,
      scope,
      id,
      error,
      method,
      stack,
      value: value instanceof ErrnoError ? value.toJSON() : value
    });
  }
  __name(handleRequest, "handleRequest");
  function attachFS(port, fs) {
    attach(port, (request2) => handleRequest(port, fs, request2));
  }
  __name(attachFS, "attachFS");
  function detachFS(port, fs) {
    detach(port, (request2) => handleRequest(port, fs, request2));
  }
  __name(detachFS, "detachFS");
  var Port = {
    name: "Port",
    options: {
      port: {
        type: "object",
        required: true,
        description: "The target port that you want to connect to",
        validator: /* @__PURE__ */ __name(function(port) {
          if (typeof port?.postMessage != "function") {
            throw new ErrnoError(22 /* EINVAL */, "option must be a port.");
          }
        }, "validator")
      },
      timeout: {
        type: "number",
        required: false,
        description: "How long to wait before the request times out"
      }
    },
    isAvailable: /* @__PURE__ */ __name(async function() {
      return true;
    }, "isAvailable"),
    create: /* @__PURE__ */ __name(function(options) {
      return new PortFS(options);
    }, "create")
  };

  // node_modules/utilium/dist/objects.js
  function isJSON(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }
  __name(isJSON, "isJSON");

  // node_modules/utilium/dist/string.js
  function capitalize(value) {
    return value.at(0).toUpperCase() + value.slice(1);
  }
  __name(capitalize, "capitalize");

  // node_modules/utilium/dist/internal/struct.js
  var init = Symbol("struct_init");
  var metadata = Symbol("struct");

  // node_modules/utilium/dist/internal/primitives.js
  var types = ["int8", "uint8", "int16", "uint16", "int32", "uint32", "int64", "uint64", "float32", "float64"];
  var valids = [...types, ...types.map((t) => capitalize(t)), "char"];

  // node_modules/utilium/dist/struct.js
  function member(type, length) {
    return function(target, context) {
      let name = typeof context == "object" ? context.name : context;
      if (typeof name == "symbol") {
        console.warn("Symbol used for struct member name will be coerced to string: " + name.toString());
        name = name.toString();
      }
      if (!name) {
        throw new ReferenceError("Invalid name for struct member");
      }
      if (typeof target != "object") {
        throw new TypeError("Invalid member for struct field");
      }
      if (!("constructor" in target)) {
        throw new TypeError("Invalid member for struct field");
      }
      const struct = target.constructor;
      struct[init] ||= [];
      struct[init].push({ name, type, length });
    };
  }
  __name(member, "member");
  function _member(type) {
    function _(targetOrLength, context) {
      if (typeof targetOrLength == "number") {
        return member(type, targetOrLength);
      }
      return member(type)(targetOrLength, context);
    }
    __name(_, "_");
    return _;
  }
  __name(_member, "_member");
  var types2 = Object.fromEntries(valids.map((t) => [t, _member(t)]));

  // src/backends/index/index.ts
  var version = 1;
  var Index = class _Index extends Map {
    static {
      __name(this, "Index");
    }
    constructor() {
      super();
    }
    /**
     * Convience method
     */
    files() {
      const files = /* @__PURE__ */ new Map();
      for (const [path, stats] of this) {
        if (stats.isFile()) {
          files.set(path, stats);
        }
      }
      return files;
    }
    /**
     * Converts the index to JSON
     */
    toJSON() {
      return {
        version,
        entries: Object.fromEntries(this)
      };
    }
    /**
     * Converts the index to a string
     */
    toString() {
      return JSON.stringify(this.toJSON());
    }
    /**
     * Returns the files in the directory `dir`.
     * This is expensive so it is only called once per directory.
     */
    dirEntries(dir) {
      const entries = [];
      for (const entry of this.keys()) {
        if (dirname(entry) == dir) {
          entries.push(basename(entry));
        }
      }
      return entries;
    }
    /**
     * Loads the index from JSON data
     */
    fromJSON(json) {
      if (json.version != version) {
        throw new ErrnoError(22 /* EINVAL */, "Index version mismatch");
      }
      this.clear();
      for (const [path, data] of Object.entries(json.entries)) {
        const stats = new Stats(data);
        if (stats.isDirectory()) {
          stats.fileData = encode(JSON.stringify(this.dirEntries(path)));
        }
        this.set(path, stats);
      }
    }
    /**
     * Parses an index from a string
     */
    static parse(data) {
      if (!isJSON(data)) {
        throw new ErrnoError(22 /* EINVAL */, "Invalid JSON");
      }
      const json = JSON.parse(data);
      const index = new _Index();
      index.fromJSON(json);
      return index;
    }
  };

  // src/backends/index/fs.ts
  var IndexFS = class extends Readonly(FileSystem) {
    constructor(indexData) {
      super();
      this.indexData = indexData;
    }
    static {
      __name(this, "IndexFS");
    }
    index = new Index();
    _isInitialized = false;
    async ready() {
      await super.ready();
      if (this._isInitialized) {
        return;
      }
      this.index.fromJSON(await this.indexData);
      this._isInitialized = true;
    }
    async reloadFiles() {
      for (const [path, stats] of this.index.files()) {
        delete stats.fileData;
        stats.fileData = await this.getData(path, stats);
      }
    }
    reloadFilesSync() {
      for (const [path, stats] of this.index.files()) {
        delete stats.fileData;
        stats.fileData = this.getDataSync(path, stats);
      }
    }
    async stat(path) {
      return this.statSync(path);
    }
    statSync(path) {
      if (!this.index.has(path)) {
        throw ErrnoError.With("ENOENT", path, "stat");
      }
      return this.index.get(path);
    }
    async openFile(path, flag, cred2) {
      if (isWriteable(flag)) {
        throw new ErrnoError(1 /* EPERM */, path);
      }
      const stats = this.index.get(path);
      if (!stats) {
        throw ErrnoError.With("ENOENT", path, "openFile");
      }
      if (!stats.hasAccess(flagToMode(flag), cred2)) {
        throw ErrnoError.With("EACCES", path, "openFile");
      }
      return new NoSyncFile(this, path, flag, stats, stats.isDirectory() ? stats.fileData : await this.getData(path, stats));
    }
    openFileSync(path, flag, cred2) {
      if (isWriteable(flag)) {
        throw new ErrnoError(1 /* EPERM */, path);
      }
      const stats = this.index.get(path);
      if (!stats) {
        throw ErrnoError.With("ENOENT", path, "openFile");
      }
      if (!stats.hasAccess(flagToMode(flag), cred2)) {
        throw ErrnoError.With("EACCES", path, "openFile");
      }
      return new NoSyncFile(this, path, flag, stats, stats.isDirectory() ? stats.fileData : this.getDataSync(path, stats));
    }
    async readdir(path) {
      return this.readdirSync(path);
    }
    readdirSync(path) {
      const stats = this.index.get(path);
      if (!stats) {
        throw ErrnoError.With("ENOENT", path, "readdir");
      }
      if (!stats.isDirectory()) {
        throw ErrnoError.With("ENOTDIR", path, "readdir");
      }
      return JSON.parse(decode(stats.fileData));
    }
  };

  // src/backends/fetch.ts
  async function fetchFile(path, type) {
    const response = await fetch(path).catch((e) => {
      throw new ErrnoError(5 /* EIO */, e.message);
    });
    if (!response.ok) {
      throw new ErrnoError(5 /* EIO */, "fetch failed: response returned code " + response.status);
    }
    switch (type) {
      case "buffer":
        const arrayBuffer = await response.arrayBuffer().catch((e) => {
          throw new ErrnoError(5 /* EIO */, e.message);
        });
        return new Uint8Array(arrayBuffer);
      case "json":
        return response.json().catch((e) => {
          throw new ErrnoError(5 /* EIO */, e.message);
        });
      default:
        throw new ErrnoError(22 /* EINVAL */, "Invalid download type: " + type);
    }
  }
  __name(fetchFile, "fetchFile");
  var FetchFS = class _FetchFS extends IndexFS {
    static {
      __name(this, "FetchFS");
    }
    baseUrl;
    async ready() {
      if (this._isInitialized) {
        return;
      }
      await super.ready();
      for (const [path, stats] of this.index.files()) {
        await this.getData(path, stats);
      }
    }
    constructor({ index = "index.json", baseUrl = "" }) {
      super(typeof index != "string" ? index : fetchFile(index, "json"));
      if (baseUrl.at(-1) != "/") {
        baseUrl += "/";
      }
      this.baseUrl = baseUrl;
    }
    metadata() {
      return {
        ...super.metadata(),
        name: _FetchFS.name,
        readonly: true
      };
    }
    /**
     * Preload the given file into the index.
     * @param path
     * @param buffer
     */
    preload(path, buffer) {
      const stats = this.index.get(path);
      if (!stats) {
        throw ErrnoError.With("ENOENT", path, "preloadFile");
      }
      if (!stats.isFile()) {
        throw ErrnoError.With("EISDIR", path, "preloadFile");
      }
      stats.size = buffer.length;
      stats.fileData = buffer;
    }
    /**
     * @todo Be lazier about actually requesting the data?
     */
    async getData(path, stats) {
      if (stats.fileData) {
        return stats.fileData;
      }
      const data = await fetchFile(this.baseUrl + (path.startsWith("/") ? path.slice(1) : path), "buffer");
      stats.fileData = data;
      return data;
    }
    getDataSync(path, stats) {
      if (stats.fileData) {
        return stats.fileData;
      }
      throw new ErrnoError(61 /* ENODATA */, "", path, "getData");
    }
  };
  var Fetch = {
    name: "Fetch",
    options: {
      index: {
        type: ["string", "object"],
        required: false,
        description: "URL to a file index as a JSON file or the file index object itself, generated with the make-index script. Defaults to `index.json`."
      },
      baseUrl: {
        type: "string",
        required: false,
        description: "Used as the URL prefix for fetched files. Default: Fetch files relative to the index."
      }
    },
    isAvailable: /* @__PURE__ */ __name(function() {
      return typeof globalThis.fetch == "function";
    }, "isAvailable"),
    create: /* @__PURE__ */ __name(function(options) {
      return new FetchFS(options);
    }, "create")
  };

  // src/backends/locked.ts
  var LockedFS = class {
    constructor(fs) {
      this.fs = fs;
    }
    static {
      __name(this, "LockedFS");
    }
    /**
     * The current locks
     */
    locks = /* @__PURE__ */ new Map();
    addLock(path) {
      const lock = {
        ...Promise.withResolvers(),
        [Symbol.dispose]: () => {
          this.unlock(path);
        }
      };
      this.locks.set(path, lock);
      return lock;
    }
    /**
     * Locks `path` asynchronously.
     * If the path is currently locked, waits for it to be unlocked.
     * @internal
     */
    async lock(path) {
      if (this.locks.has(path)) {
        await this.locks.get(path).promise;
      }
      return this.addLock(path);
    }
    /**
     * Locks `path` asynchronously.
     * If the path is currently locked, an error will be thrown
     * @internal
     */
    lockSync(path) {
      if (this.locks.has(path)) {
        throw ErrnoError.With("EBUSY", path, "lockSync");
      }
      return this.addLock(path);
    }
    /**
     * Unlocks a path
     * @param path The path to lock
     * @param noThrow If true, an error will not be thrown if the path is already unlocked
     * @returns Whether the path was unlocked
     * @internal
     */
    unlock(path, noThrow = false) {
      if (!this.locks.has(path)) {
        if (noThrow) {
          return false;
        }
        throw new ErrnoError(1 /* EPERM */, "Can not unlock an already unlocked path", path);
      }
      this.locks.get(path).resolve();
      this.locks.delete(path);
      return true;
    }
    /**
     * Whether `path` is locked
     * @internal
     */
    isLocked(path) {
      return this.locks.has(path);
    }
    async ready() {
      await this.fs.ready();
    }
    metadata() {
      return {
        ...this.fs.metadata(),
        name: "Locked<" + this.fs.metadata().name + ">"
      };
    }
    async rename(oldPath, newPath, cred2) {
      var _stack = [];
      try {
        const _ = __using(_stack, await this.lock(oldPath));
        await this.fs.rename(oldPath, newPath, cred2);
      } catch (_2) {
        var _error = _2, _hasError = true;
      } finally {
        __callDispose(_stack, _error, _hasError);
      }
    }
    renameSync(oldPath, newPath, cred2) {
      var _stack = [];
      try {
        const _ = __using(_stack, this.lockSync(oldPath));
        return this.fs.renameSync(oldPath, newPath, cred2);
      } catch (_2) {
        var _error = _2, _hasError = true;
      } finally {
        __callDispose(_stack, _error, _hasError);
      }
    }
    async stat(path, cred2) {
      var _stack = [];
      try {
        const _ = __using(_stack, await this.lock(path));
        return await this.fs.stat(path, cred2);
      } catch (_2) {
        var _error = _2, _hasError = true;
      } finally {
        __callDispose(_stack, _error, _hasError);
      }
    }
    statSync(path, cred2) {
      var _stack = [];
      try {
        const _ = __using(_stack, this.lockSync(path));
        return this.fs.statSync(path, cred2);
      } catch (_2) {
        var _error = _2, _hasError = true;
      } finally {
        __callDispose(_stack, _error, _hasError);
      }
    }
    async openFile(path, flag, cred2) {
      var _stack = [];
      try {
        const _ = __using(_stack, await this.lock(path));
        return await this.fs.openFile(path, flag, cred2);
      } catch (_2) {
        var _error = _2, _hasError = true;
      } finally {
        __callDispose(_stack, _error, _hasError);
      }
    }
    openFileSync(path, flag, cred2) {
      var _stack = [];
      try {
        const _ = __using(_stack, this.lockSync(path));
        return this.fs.openFileSync(path, flag, cred2);
      } catch (_2) {
        var _error = _2, _hasError = true;
      } finally {
        __callDispose(_stack, _error, _hasError);
      }
    }
    async createFile(path, flag, mode, cred2) {
      var _stack = [];
      try {
        const _ = __using(_stack, await this.lock(path));
        return await this.fs.createFile(path, flag, mode, cred2);
      } catch (_2) {
        var _error = _2, _hasError = true;
      } finally {
        __callDispose(_stack, _error, _hasError);
      }
    }
    createFileSync(path, flag, mode, cred2) {
      var _stack = [];
      try {
        const _ = __using(_stack, this.lockSync(path));
        return this.fs.createFileSync(path, flag, mode, cred2);
      } catch (_2) {
        var _error = _2, _hasError = true;
      } finally {
        __callDispose(_stack, _error, _hasError);
      }
    }
    async unlink(path, cred2) {
      var _stack = [];
      try {
        const _ = __using(_stack, await this.lock(path));
        await this.fs.unlink(path, cred2);
      } catch (_2) {
        var _error = _2, _hasError = true;
      } finally {
        __callDispose(_stack, _error, _hasError);
      }
    }
    unlinkSync(path, cred2) {
      var _stack = [];
      try {
        const _ = __using(_stack, this.lockSync(path));
        return this.fs.unlinkSync(path, cred2);
      } catch (_2) {
        var _error = _2, _hasError = true;
      } finally {
        __callDispose(_stack, _error, _hasError);
      }
    }
    async rmdir(path, cred2) {
      var _stack = [];
      try {
        const _ = __using(_stack, await this.lock(path));
        await this.fs.rmdir(path, cred2);
      } catch (_2) {
        var _error = _2, _hasError = true;
      } finally {
        __callDispose(_stack, _error, _hasError);
      }
    }
    rmdirSync(path, cred2) {
      var _stack = [];
      try {
        const _ = __using(_stack, this.lockSync(path));
        return this.fs.rmdirSync(path, cred2);
      } catch (_2) {
        var _error = _2, _hasError = true;
      } finally {
        __callDispose(_stack, _error, _hasError);
      }
    }
    async mkdir(path, mode, cred2) {
      var _stack = [];
      try {
        const _ = __using(_stack, await this.lock(path));
        await this.fs.mkdir(path, mode, cred2);
      } catch (_2) {
        var _error = _2, _hasError = true;
      } finally {
        __callDispose(_stack, _error, _hasError);
      }
    }
    mkdirSync(path, mode, cred2) {
      var _stack = [];
      try {
        const _ = __using(_stack, this.lockSync(path));
        return this.fs.mkdirSync(path, mode, cred2);
      } catch (_2) {
        var _error = _2, _hasError = true;
      } finally {
        __callDispose(_stack, _error, _hasError);
      }
    }
    async readdir(path, cred2) {
      var _stack = [];
      try {
        const _ = __using(_stack, await this.lock(path));
        return await this.fs.readdir(path, cred2);
      } catch (_2) {
        var _error = _2, _hasError = true;
      } finally {
        __callDispose(_stack, _error, _hasError);
      }
    }
    readdirSync(path, cred2) {
      var _stack = [];
      try {
        const _ = __using(_stack, this.lockSync(path));
        return this.fs.readdirSync(path, cred2);
      } catch (_2) {
        var _error = _2, _hasError = true;
      } finally {
        __callDispose(_stack, _error, _hasError);
      }
    }
    async exists(path, cred2) {
      var _stack = [];
      try {
        const _ = __using(_stack, await this.lock(path));
        return await this.fs.exists(path, cred2);
      } catch (_2) {
        var _error = _2, _hasError = true;
      } finally {
        __callDispose(_stack, _error, _hasError);
      }
    }
    existsSync(path, cred2) {
      var _stack = [];
      try {
        const _ = __using(_stack, this.lockSync(path));
        return this.fs.existsSync(path, cred2);
      } catch (_2) {
        var _error = _2, _hasError = true;
      } finally {
        __callDispose(_stack, _error, _hasError);
      }
    }
    async link(srcpath, dstpath, cred2) {
      var _stack = [];
      try {
        const _ = __using(_stack, await this.lock(srcpath));
        await this.fs.link(srcpath, dstpath, cred2);
      } catch (_2) {
        var _error = _2, _hasError = true;
      } finally {
        __callDispose(_stack, _error, _hasError);
      }
    }
    linkSync(srcpath, dstpath, cred2) {
      var _stack = [];
      try {
        const _ = __using(_stack, this.lockSync(srcpath));
        return this.fs.linkSync(srcpath, dstpath, cred2);
      } catch (_2) {
        var _error = _2, _hasError = true;
      } finally {
        __callDispose(_stack, _error, _hasError);
      }
    }
    async sync(path, data, stats) {
      var _stack = [];
      try {
        const _ = __using(_stack, await this.lock(path));
        await this.fs.sync(path, data, stats);
      } catch (_2) {
        var _error = _2, _hasError = true;
      } finally {
        __callDispose(_stack, _error, _hasError);
      }
    }
    syncSync(path, data, stats) {
      var _stack = [];
      try {
        const _ = __using(_stack, this.lockSync(path));
        return this.fs.syncSync(path, data, stats);
      } catch (_2) {
        var _error = _2, _hasError = true;
      } finally {
        __callDispose(_stack, _error, _hasError);
      }
    }
  };
  var Locked = {
    name: "Locked",
    options: {
      fs: {
        type: "object",
        required: true,
        description: "",
        validator: /* @__PURE__ */ __name(function(fs) {
          if (!(fs instanceof FileSystem)) {
            throw new ErrnoError(22 /* EINVAL */, "fs passed to LockedFS must be a FileSystem");
          }
        }, "validator")
      }
    },
    isAvailable: /* @__PURE__ */ __name(function() {
      return true;
    }, "isAvailable"),
    create: /* @__PURE__ */ __name(function({ fs }) {
      return new LockedFS(fs);
    }, "create")
  };

  // src/backends/overlay.ts
  var deletionLogPath = "/.deleted";
  var UnlockedOverlayFS = class extends FileSystem {
    static {
      __name(this, "UnlockedOverlayFS");
    }
    async ready() {
      await this._readable.ready();
      await this._writable.ready();
      await this._ready;
    }
    _writable;
    _readable;
    _isInitialized = false;
    _deletedFiles = /* @__PURE__ */ new Set();
    _deleteLog = "";
    // If 'true', we have scheduled a delete log update.
    _deleteLogUpdatePending = false;
    // If 'true', a delete log update is needed after the scheduled delete log
    // update finishes.
    _deleteLogUpdateNeeded = false;
    // If there was an error updating the delete log...
    _deleteLogError;
    _ready;
    constructor({ writable, readable }) {
      super();
      this._writable = writable;
      this._readable = readable;
      if (this._writable.metadata().readonly) {
        throw new ErrnoError(22 /* EINVAL */, "Writable file system must be writable.");
      }
      this._ready = this._initialize();
    }
    metadata() {
      return {
        ...super.metadata(),
        name: OverlayFS.name
      };
    }
    getOverlayedFileSystems() {
      return {
        readable: this._readable,
        writable: this._writable
      };
    }
    async sync(path, data, stats) {
      const cred2 = stats.cred(0, 0);
      await this.createParentDirectories(path, cred2);
      if (!await this._writable.exists(path, cred2)) {
        await this._writable.createFile(path, "w", 420, cred2);
      }
      await this._writable.sync(path, data, stats);
    }
    syncSync(path, data, stats) {
      const cred2 = stats.cred(0, 0);
      this.createParentDirectoriesSync(path, cred2);
      this._writable.syncSync(path, data, stats);
    }
    /**
     * Called once to load up metadata stored on the writable file system.
     * @internal
     */
    async _initialize() {
      if (this._isInitialized) {
        return;
      }
      try {
        const file = await this._writable.openFile(deletionLogPath, parseFlag("r"), rootCred);
        const { size } = await file.stat();
        const { buffer } = await file.read(new Uint8Array(size));
        this._deleteLog = decode(buffer);
      } catch (err) {
        if (err.errno !== 2 /* ENOENT */) {
          throw err;
        }
      }
      this._isInitialized = true;
      this._reparseDeletionLog();
    }
    getDeletionLog() {
      return this._deleteLog;
    }
    restoreDeletionLog(log, cred2) {
      this._deleteLog = log;
      this._reparseDeletionLog();
      this.updateLog("", cred2);
    }
    async rename(oldPath, newPath, cred2) {
      this.checkInitialized();
      this.checkPath(oldPath);
      this.checkPath(newPath);
      try {
        await this._writable.rename(oldPath, newPath, cred2);
      } catch (e) {
        if (this._deletedFiles.has(oldPath)) {
          throw ErrnoError.With("ENOENT", oldPath, "rename");
        }
      }
    }
    renameSync(oldPath, newPath, cred2) {
      this.checkInitialized();
      this.checkPath(oldPath);
      this.checkPath(newPath);
      try {
        this._writable.renameSync(oldPath, newPath, cred2);
      } catch (e) {
        if (this._deletedFiles.has(oldPath)) {
          throw ErrnoError.With("ENOENT", oldPath, "rename");
        }
      }
    }
    async stat(path, cred2) {
      this.checkInitialized();
      try {
        return await this._writable.stat(path, cred2);
      } catch (e) {
        if (this._deletedFiles.has(path)) {
          throw ErrnoError.With("ENOENT", path, "stat");
        }
        const oldStat = new Stats(await this._readable.stat(path, cred2));
        oldStat.mode |= 146;
        return oldStat;
      }
    }
    statSync(path, cred2) {
      this.checkInitialized();
      try {
        return this._writable.statSync(path, cred2);
      } catch (e) {
        if (this._deletedFiles.has(path)) {
          throw ErrnoError.With("ENOENT", path, "stat");
        }
        const oldStat = new Stats(this._readable.statSync(path, cred2));
        oldStat.mode |= 146;
        return oldStat;
      }
    }
    async openFile(path, flag, cred2) {
      if (await this._writable.exists(path, cred2)) {
        return this._writable.openFile(path, flag, cred2);
      }
      const file = await this._readable.openFile(path, parseFlag("r"), cred2);
      const stats = new Stats(await file.stat());
      const { buffer } = await file.read(new Uint8Array(stats.size));
      return new PreloadFile(this, path, flag, stats, buffer);
    }
    openFileSync(path, flag, cred2) {
      if (this._writable.existsSync(path, cred2)) {
        return this._writable.openFileSync(path, flag, cred2);
      }
      const file = this._readable.openFileSync(path, parseFlag("r"), cred2);
      const stats = new Stats(file.statSync());
      const data = new Uint8Array(stats.size);
      file.readSync(data);
      return new PreloadFile(this, path, flag, stats, data);
    }
    async createFile(path, flag, mode, cred2) {
      this.checkInitialized();
      await this._writable.createFile(path, flag, mode, cred2);
      return this.openFile(path, flag, cred2);
    }
    createFileSync(path, flag, mode, cred2) {
      this.checkInitialized();
      this._writable.createFileSync(path, flag, mode, cred2);
      return this.openFileSync(path, flag, cred2);
    }
    async link(srcpath, dstpath, cred2) {
      this.checkInitialized();
      await this._writable.link(srcpath, dstpath, cred2);
    }
    linkSync(srcpath, dstpath, cred2) {
      this.checkInitialized();
      this._writable.linkSync(srcpath, dstpath, cred2);
    }
    async unlink(path, cred2) {
      this.checkInitialized();
      this.checkPath(path);
      if (!await this.exists(path, cred2)) {
        throw ErrnoError.With("ENOENT", path, "unlink");
      }
      if (await this._writable.exists(path, cred2)) {
        await this._writable.unlink(path, cred2);
      }
      if (await this.exists(path, cred2)) {
        this.deletePath(path, cred2);
      }
    }
    unlinkSync(path, cred2) {
      this.checkInitialized();
      this.checkPath(path);
      if (!this.existsSync(path, cred2)) {
        throw ErrnoError.With("ENOENT", path, "unlink");
      }
      if (this._writable.existsSync(path, cred2)) {
        this._writable.unlinkSync(path, cred2);
      }
      if (this.existsSync(path, cred2)) {
        this.deletePath(path, cred2);
      }
    }
    async rmdir(path, cred2) {
      this.checkInitialized();
      if (!await this.exists(path, cred2)) {
        throw ErrnoError.With("ENOENT", path, "rmdir");
      }
      if (await this._writable.exists(path, cred2)) {
        await this._writable.rmdir(path, cred2);
      }
      if (await this.exists(path, cred2)) {
        if ((await this.readdir(path, cred2)).length > 0) {
          throw ErrnoError.With("ENOTEMPTY", path, "rmdir");
        } else {
          this.deletePath(path, cred2);
        }
      }
    }
    rmdirSync(path, cred2) {
      this.checkInitialized();
      if (!this.existsSync(path, cred2)) {
        throw ErrnoError.With("ENOENT", path, "rmdir");
      }
      if (this._writable.existsSync(path, cred2)) {
        this._writable.rmdirSync(path, cred2);
      }
      if (this.existsSync(path, cred2)) {
        if (this.readdirSync(path, cred2).length > 0) {
          throw ErrnoError.With("ENOTEMPTY", path, "rmdir");
        } else {
          this.deletePath(path, cred2);
        }
      }
    }
    async mkdir(path, mode, cred2) {
      this.checkInitialized();
      if (await this.exists(path, cred2)) {
        throw ErrnoError.With("EEXIST", path, "mkdir");
      }
      await this.createParentDirectories(path, cred2);
      await this._writable.mkdir(path, mode, cred2);
    }
    mkdirSync(path, mode, cred2) {
      this.checkInitialized();
      if (this.existsSync(path, cred2)) {
        throw ErrnoError.With("EEXIST", path, "mkdir");
      }
      this.createParentDirectoriesSync(path, cred2);
      this._writable.mkdirSync(path, mode, cred2);
    }
    async readdir(path, cred2) {
      this.checkInitialized();
      const dirStats = await this.stat(path, cred2);
      if (!dirStats.isDirectory()) {
        throw ErrnoError.With("ENOTDIR", path, "readdir");
      }
      const contents = [];
      try {
        contents.push(...await this._writable.readdir(path, cred2));
      } catch (e) {
      }
      try {
        contents.push(...(await this._readable.readdir(path, cred2)).filter((fPath) => !this._deletedFiles.has(`${path}/${fPath}`)));
      } catch (e) {
      }
      const seenMap = {};
      return contents.filter((path2) => {
        const result = !seenMap[path2];
        seenMap[path2] = true;
        return result;
      });
    }
    readdirSync(path, cred2) {
      this.checkInitialized();
      const dirStats = this.statSync(path, cred2);
      if (!dirStats.isDirectory()) {
        throw ErrnoError.With("ENOTDIR", path, "readdir");
      }
      let contents = [];
      try {
        contents = contents.concat(this._writable.readdirSync(path, cred2));
      } catch (e) {
      }
      try {
        contents = contents.concat(this._readable.readdirSync(path, cred2).filter((fPath) => !this._deletedFiles.has(`${path}/${fPath}`)));
      } catch (e) {
      }
      const seenMap = {};
      return contents.filter((path2) => {
        const result = !seenMap[path2];
        seenMap[path2] = true;
        return result;
      });
    }
    deletePath(path, cred2) {
      this._deletedFiles.add(path);
      this.updateLog(`d${path}
`, cred2);
    }
    async updateLog(addition, cred2) {
      this._deleteLog += addition;
      if (this._deleteLogUpdatePending) {
        this._deleteLogUpdateNeeded = true;
        return;
      }
      this._deleteLogUpdatePending = true;
      const log = await this._writable.openFile(deletionLogPath, parseFlag("w"), cred2);
      try {
        await log.write(encode(this._deleteLog));
        if (this._deleteLogUpdateNeeded) {
          this._deleteLogUpdateNeeded = false;
          this.updateLog("", cred2);
        }
      } catch (e) {
        this._deleteLogError = e;
      } finally {
        this._deleteLogUpdatePending = false;
      }
    }
    _reparseDeletionLog() {
      this._deletedFiles.clear();
      for (const entry of this._deleteLog.split("\n")) {
        if (!entry.startsWith("d")) {
          continue;
        }
        this._deletedFiles.add(entry.slice(1));
      }
    }
    checkInitialized() {
      if (!this._isInitialized) {
        throw new ErrnoError(1 /* EPERM */, "OverlayFS is not initialized. Please initialize OverlayFS using its initialize() method before using it.");
      }
      if (!this._deleteLogError) {
        return;
      }
      const error = this._deleteLogError;
      delete this._deleteLogError;
      throw error;
    }
    checkPath(path) {
      if (path == deletionLogPath) {
        throw ErrnoError.With("EPERM", path, "checkPath");
      }
    }
    /**
     * With the given path, create the needed parent directories on the writable storage
     * should they not exist. Use modes from the read-only storage.
     */
    createParentDirectoriesSync(path, cred2) {
      let parent = dirname(path), toCreate = [];
      while (!this._writable.existsSync(parent, cred2)) {
        toCreate.push(parent);
        parent = dirname(parent);
      }
      toCreate = toCreate.reverse();
      for (const p of toCreate) {
        this._writable.mkdirSync(p, this.statSync(p, cred2).mode, cred2);
      }
    }
    async createParentDirectories(path, cred2) {
      let parent = dirname(path), toCreate = [];
      while (!await this._writable.exists(parent, cred2)) {
        toCreate.push(parent);
        parent = dirname(parent);
      }
      toCreate = toCreate.reverse();
      for (const p of toCreate) {
        const stats = await this.stat(p, cred2);
        await this._writable.mkdir(p, stats.mode, cred2);
      }
    }
    /**
     * Helper function:
     * - Ensures p is on writable before proceeding. Throws an error if it doesn't exist.
     * - Calls f to perform operation on writable.
     */
    operateOnWritable(path, cred2) {
      if (!this.existsSync(path, cred2)) {
        throw ErrnoError.With("ENOENT", path, "operateOnWriteable");
      }
      if (!this._writable.existsSync(path, cred2)) {
        this.copyToWritableSync(path, cred2);
      }
    }
    async operateOnWritableAsync(path, cred2) {
      if (!await this.exists(path, cred2)) {
        throw ErrnoError.With("ENOENT", path, "operateOnWritable");
      }
      if (!await this._writable.exists(path, cred2)) {
        return this.copyToWritable(path, cred2);
      }
    }
    /**
     * Copy from readable to writable storage.
     * PRECONDITION: File does not exist on writable storage.
     */
    copyToWritableSync(path, cred2) {
      const stats = this.statSync(path, cred2);
      if (stats.isDirectory()) {
        this._writable.mkdirSync(path, stats.mode, cred2);
        return;
      }
      const data = new Uint8Array(stats.size);
      const readable = this._readable.openFileSync(path, parseFlag("r"), cred2);
      readable.readSync(data);
      readable.closeSync();
      const writable = this._writable.openFileSync(path, parseFlag("w"), cred2);
      writable.writeSync(data);
      writable.closeSync();
    }
    async copyToWritable(path, cred2) {
      const stats = await this.stat(path, cred2);
      if (stats.isDirectory()) {
        await this._writable.mkdir(path, stats.mode, cred2);
        return;
      }
      const data = new Uint8Array(stats.size);
      const readable = await this._readable.openFile(path, parseFlag("r"), cred2);
      await readable.read(data);
      await readable.close();
      const writable = await this._writable.openFile(path, parseFlag("w"), cred2);
      await writable.write(data);
      await writable.close();
    }
  };
  var OverlayFS = class extends LockedFS {
    static {
      __name(this, "OverlayFS");
    }
    /**
     * @param options The options to initialize the OverlayFS with
     */
    constructor(options) {
      super(new UnlockedOverlayFS(options));
    }
    getOverlayedFileSystems() {
      return super.fs.getOverlayedFileSystems();
    }
    getDeletionLog() {
      return super.fs.getDeletionLog();
    }
    resDeletionLog() {
      return super.fs.getDeletionLog();
    }
    unwrap() {
      return super.fs;
    }
  };
  var Overlay = {
    name: "Overlay",
    options: {
      writable: {
        type: "object",
        required: true,
        description: "The file system to write modified files to."
      },
      readable: {
        type: "object",
        required: true,
        description: "The file system that initially populates this file system."
      }
    },
    isAvailable: /* @__PURE__ */ __name(function() {
      return true;
    }, "isAvailable"),
    create: /* @__PURE__ */ __name(function(options) {
      return new OverlayFS(options);
    }, "create")
  };

  // src/backends/backend.ts
  function isBackend(arg) {
    return arg != null && typeof arg == "object" && "isAvailable" in arg && typeof arg.isAvailable == "function" && "create" in arg && typeof arg.create == "function";
  }
  __name(isBackend, "isBackend");
  async function checkOptions(backend, opts) {
    if (typeof opts != "object" || opts === null) {
      throw new ErrnoError(22 /* EINVAL */, "Invalid options");
    }
    for (const [optName, opt] of Object.entries(backend.options)) {
      const providedValue = opts?.[optName];
      if (providedValue === void 0 || providedValue === null) {
        if (!opt.required) {
          continue;
        }
        const incorrectOptions = Object.keys(opts).filter((o) => !(o in backend.options)).map((a) => {
          return { str: a, distance: levenshtein(optName, a) };
        }).filter((o) => o.distance < 5).sort((a, b) => a.distance - b.distance);
        throw new ErrnoError(
          22 /* EINVAL */,
          `${backend.name}: Required option '${optName}' not provided.${incorrectOptions.length > 0 ? ` You provided '${incorrectOptions[0].str}', did you mean '${optName}'.` : ""}`
        );
      }
      const typeMatches = Array.isArray(opt.type) ? opt.type.indexOf(typeof providedValue) != -1 : typeof providedValue == opt.type;
      if (!typeMatches) {
        throw new ErrnoError(
          22 /* EINVAL */,
          `${backend.name}: Value provided for option ${optName} is not the proper type. Expected ${Array.isArray(opt.type) ? `one of {${opt.type.join(", ")}}` : opt.type}, but received ${typeof providedValue}`
        );
      }
      if (opt.validator) {
        await opt.validator(providedValue);
      }
    }
  }
  __name(checkOptions, "checkOptions");
  function isBackendConfig(arg) {
    return arg != null && typeof arg == "object" && "backend" in arg && isBackend(arg.backend);
  }
  __name(isBackendConfig, "isBackendConfig");

  // src/emulation/index.ts
  var emulation_exports = {};
  __export(emulation_exports, {
    BigIntStatsFs: () => BigIntStatsFs,
    Dir: () => Dir,
    Dirent: () => Dirent,
    ReadStream: () => ReadStream,
    Stats: () => Stats,
    StatsFs: () => StatsFs,
    WriteStream: () => WriteStream,
    access: () => access2,
    accessSync: () => accessSync,
    appendFile: () => appendFile2,
    appendFileSync: () => appendFileSync,
    chmod: () => chmod2,
    chmodSync: () => chmodSync,
    chown: () => chown2,
    chownSync: () => chownSync,
    close: () => close,
    closeSync: () => closeSync,
    constants: () => constants_exports,
    copyFile: () => copyFile2,
    copyFileSync: () => copyFileSync,
    cp: () => cp2,
    cpSync: () => cpSync,
    createReadStream: () => createReadStream,
    createWriteStream: () => createWriteStream,
    exists: () => exists2,
    existsSync: () => existsSync,
    fchmod: () => fchmod,
    fchmodSync: () => fchmodSync,
    fchown: () => fchown,
    fchownSync: () => fchownSync,
    fdatasync: () => fdatasync,
    fdatasyncSync: () => fdatasyncSync,
    fstat: () => fstat,
    fstatSync: () => fstatSync,
    fsync: () => fsync,
    fsyncSync: () => fsyncSync,
    ftruncate: () => ftruncate,
    ftruncateSync: () => ftruncateSync,
    futimes: () => futimes,
    futimesSync: () => futimesSync,
    lchmod: () => lchmod2,
    lchmodSync: () => lchmodSync,
    lchown: () => lchown2,
    lchownSync: () => lchownSync,
    link: () => link2,
    linkSync: () => linkSync,
    lopenSync: () => lopenSync,
    lstat: () => lstat2,
    lstatSync: () => lstatSync,
    lutimes: () => lutimes2,
    lutimesSync: () => lutimesSync,
    mkdir: () => mkdir2,
    mkdirSync: () => mkdirSync,
    mkdtemp: () => mkdtemp2,
    mkdtempSync: () => mkdtempSync,
    mount: () => mount,
    mountObject: () => mountObject,
    mounts: () => mounts,
    open: () => open2,
    openAsBlob: () => openAsBlob,
    openSync: () => openSync,
    opendir: () => opendir2,
    opendirSync: () => opendirSync,
    promises: () => promises_exports,
    read: () => read,
    readFile: () => readFile2,
    readFileSync: () => readFileSync,
    readSync: () => readSync,
    readdir: () => readdir2,
    readdirSync: () => readdirSync,
    readlink: () => readlink2,
    readlinkSync: () => readlinkSync,
    readv: () => readv,
    readvSync: () => readvSync,
    realpath: () => realpath2,
    realpathSync: () => realpathSync,
    rename: () => rename2,
    renameSync: () => renameSync,
    rm: () => rm2,
    rmSync: () => rmSync,
    rmdir: () => rmdir2,
    rmdirSync: () => rmdirSync,
    stat: () => stat2,
    statSync: () => statSync,
    statfs: () => statfs2,
    statfsSync: () => statfsSync,
    symlink: () => symlink2,
    symlinkSync: () => symlinkSync,
    truncate: () => truncate2,
    truncateSync: () => truncateSync,
    umount: () => umount,
    unlink: () => unlink2,
    unlinkSync: () => unlinkSync,
    unwatchFile: () => unwatchFile,
    utimes: () => utimes2,
    utimesSync: () => utimesSync,
    watch: () => watch2,
    watchFile: () => watchFile,
    write: () => write,
    writeFile: () => writeFile2,
    writeFileSync: () => writeFileSync,
    writeSync: () => writeSync,
    writev: () => writev,
    writevSync: () => writevSync
  });

  // src/emulation/async.ts
  var import_buffer3 = __toESM(require_buffer(), 1);

  // src/emulation/promises.ts
  var promises_exports = {};
  __export(promises_exports, {
    FileHandle: () => FileHandle,
    access: () => access,
    appendFile: () => appendFile,
    chmod: () => chmod,
    chown: () => chown,
    constants: () => constants_exports,
    copyFile: () => copyFile,
    cp: () => cp,
    exists: () => exists,
    lchmod: () => lchmod,
    lchown: () => lchown,
    link: () => link,
    lstat: () => lstat,
    lutimes: () => lutimes,
    mkdir: () => mkdir,
    mkdtemp: () => mkdtemp,
    open: () => open,
    opendir: () => opendir,
    readFile: () => readFile,
    readdir: () => readdir,
    readlink: () => readlink,
    realpath: () => realpath,
    rename: () => rename,
    rm: () => rm,
    rmdir: () => rmdir,
    stat: () => stat,
    statfs: () => statfs,
    symlink: () => symlink,
    truncate: () => truncate,
    unlink: () => unlink,
    utimes: () => utimes,
    watch: () => watch,
    writeFile: () => writeFile
  });
  var import_buffer2 = __toESM(require_buffer(), 1);

  // src/emulation/sync.ts
  var import_buffer = __toESM(require_buffer(), 1);

  // src/emulation/shared.ts
  var cred = rootCred;
  function setCred(val) {
    cred = val;
  }
  __name(setCred, "setCred");
  var fdMap = /* @__PURE__ */ new Map();
  var nextFd2 = 100;
  function file2fd(file) {
    const fd = nextFd2++;
    fdMap.set(fd, file);
    return fd;
  }
  __name(file2fd, "file2fd");
  function fd2file(fd) {
    if (!fdMap.has(fd)) {
      throw new ErrnoError(9 /* EBADF */);
    }
    return fdMap.get(fd);
  }
  __name(fd2file, "fd2file");
  var mounts = /* @__PURE__ */ new Map();
  mount("/", InMemory.create({ name: "root" }));
  function mount(mountPoint, fs) {
    if (mountPoint[0] !== "/") {
      mountPoint = "/" + mountPoint;
    }
    mountPoint = resolve(mountPoint);
    if (mounts.has(mountPoint)) {
      throw new ErrnoError(22 /* EINVAL */, "Mount point " + mountPoint + " is already in use.");
    }
    mounts.set(mountPoint, fs);
  }
  __name(mount, "mount");
  function umount(mountPoint) {
    if (mountPoint[0] !== "/") {
      mountPoint = `/${mountPoint}`;
    }
    mountPoint = resolve(mountPoint);
    if (!mounts.has(mountPoint)) {
      throw new ErrnoError(22 /* EINVAL */, "Mount point " + mountPoint + " is already unmounted.");
    }
    mounts.delete(mountPoint);
  }
  __name(umount, "umount");
  function resolveMount(path) {
    path = normalizePath(path);
    const sortedMounts = [...mounts].sort((a, b) => a[0].length > b[0].length ? -1 : 1);
    for (const [mountPoint, fs] of sortedMounts) {
      if (mountPoint.length <= path.length && path.startsWith(mountPoint)) {
        path = path.slice(mountPoint.length > 1 ? mountPoint.length : 0);
        if (path === "") {
          path = "/";
        }
        return { fs, path, mountPoint };
      }
    }
    throw new ErrnoError(5 /* EIO */, "ZenFS not initialized with a file system");
  }
  __name(resolveMount, "resolveMount");
  function fixPaths(text, paths) {
    for (const [from, to] of Object.entries(paths)) {
      text = text?.replaceAll(from, to);
    }
    return text;
  }
  __name(fixPaths, "fixPaths");
  function fixError(e, paths) {
    if (typeof e.stack == "string") {
      e.stack = fixPaths(e.stack, paths);
    }
    e.message = fixPaths(e.message, paths);
    return e;
  }
  __name(fixError, "fixError");
  function mountObject(mounts2) {
    if ("/" in mounts2) {
      umount("/");
    }
    for (const [point, fs] of Object.entries(mounts2)) {
      mount(point, fs);
    }
  }
  __name(mountObject, "mountObject");
  function _statfs(fs, bigint) {
    const md = fs.metadata();
    const bs = md.blockSize || 4096;
    return {
      type: (bigint ? BigInt : Number)(md.type),
      bsize: (bigint ? BigInt : Number)(bs),
      ffree: (bigint ? BigInt : Number)(md.freeNodes || size_max),
      files: (bigint ? BigInt : Number)(md.totalNodes || size_max),
      bavail: (bigint ? BigInt : Number)(md.freeSpace / bs),
      bfree: (bigint ? BigInt : Number)(md.freeSpace / bs),
      blocks: (bigint ? BigInt : Number)(md.totalSpace / bs)
    };
  }
  __name(_statfs, "_statfs");

  // src/emulation/sync.ts
  function renameSync(oldPath, newPath) {
    oldPath = normalizePath(oldPath);
    newPath = normalizePath(newPath);
    const _old = resolveMount(oldPath);
    const _new = resolveMount(newPath);
    const paths = { [_old.path]: oldPath, [_new.path]: newPath };
    try {
      if (_old === _new) {
        return _old.fs.renameSync(_old.path, _new.path, cred);
      }
      writeFileSync(newPath, readFileSync(oldPath));
      unlinkSync(oldPath);
    } catch (e) {
      throw fixError(e, paths);
    }
  }
  __name(renameSync, "renameSync");
  function existsSync(path) {
    path = normalizePath(path);
    try {
      const { fs, path: resolvedPath } = resolveMount(realpathSync(path));
      return fs.existsSync(resolvedPath, cred);
    } catch (e) {
      if (e.errno == 2 /* ENOENT */) {
        return false;
      }
      throw e;
    }
  }
  __name(existsSync, "existsSync");
  function statSync(path, options) {
    path = normalizePath(path);
    const { fs, path: resolved } = resolveMount(existsSync(path) ? realpathSync(path) : path);
    try {
      const stats = fs.statSync(resolved, cred);
      return options?.bigint ? new BigIntStats(stats) : stats;
    } catch (e) {
      throw fixError(e, { [resolved]: path });
    }
  }
  __name(statSync, "statSync");
  function lstatSync(path, options) {
    path = normalizePath(path);
    const { fs, path: resolved } = resolveMount(path);
    try {
      const stats = fs.statSync(resolved, cred);
      return options?.bigint ? new BigIntStats(stats) : stats;
    } catch (e) {
      throw fixError(e, { [resolved]: path });
    }
  }
  __name(lstatSync, "lstatSync");
  function truncateSync(path, len = 0) {
    var _stack = [];
    try {
      const file = __using(_stack, _openSync(path, "r+"));
      len ||= 0;
      if (len < 0) {
        throw new ErrnoError(22 /* EINVAL */);
      }
      file.truncateSync(len);
    } catch (_) {
      var _error = _, _hasError = true;
    } finally {
      __callDispose(_stack, _error, _hasError);
    }
  }
  __name(truncateSync, "truncateSync");
  function unlinkSync(path) {
    path = normalizePath(path);
    const { fs, path: resolved } = resolveMount(path);
    try {
      return fs.unlinkSync(resolved, cred);
    } catch (e) {
      throw fixError(e, { [resolved]: path });
    }
  }
  __name(unlinkSync, "unlinkSync");
  function _openSync(path, _flag, _mode, resolveSymlinks = true) {
    path = normalizePath(path);
    const mode = normalizeMode(_mode, 420), flag = parseFlag(_flag);
    path = resolveSymlinks && existsSync(path) ? realpathSync(path) : path;
    const { fs, path: resolved } = resolveMount(path);
    if (!fs.existsSync(resolved, cred)) {
      if (!isWriteable(flag) && !isAppendable(flag) || flag == "r+") {
        throw ErrnoError.With("ENOENT", path, "_open");
      }
      const parentStats = fs.statSync(dirname(resolved), cred);
      if (!parentStats.isDirectory()) {
        throw ErrnoError.With("ENOTDIR", dirname(path), "_open");
      }
      return fs.createFileSync(resolved, flag, mode, cred);
    }
    const stats = fs.statSync(resolved, cred);
    if (!stats.hasAccess(mode, cred)) {
      throw ErrnoError.With("EACCES", path, "_open");
    }
    if (isExclusive(flag)) {
      throw ErrnoError.With("EEXIST", path, "_open");
    }
    if (!isTruncating(flag)) {
      return fs.openFileSync(resolved, flag, cred);
    }
    fs.unlinkSync(resolved, cred);
    return fs.createFileSync(resolved, flag, stats.mode, cred);
  }
  __name(_openSync, "_openSync");
  function openSync(path, flag, mode = F_OK) {
    return file2fd(_openSync(path, flag, mode, true));
  }
  __name(openSync, "openSync");
  function lopenSync(path, flag, mode) {
    return file2fd(_openSync(path, flag, mode, false));
  }
  __name(lopenSync, "lopenSync");
  function _readFileSync(fname, flag, resolveSymlinks) {
    var _stack = [];
    try {
      const file = __using(_stack, _openSync(fname, flag, 420, resolveSymlinks));
      const stat3 = file.statSync();
      const data = new Uint8Array(stat3.size);
      file.readSync(data, 0, stat3.size, 0);
      file.closeSync();
      return data;
    } catch (_) {
      var _error = _, _hasError = true;
    } finally {
      __callDispose(_stack, _error, _hasError);
    }
  }
  __name(_readFileSync, "_readFileSync");
  function readFileSync(path, _options = {}) {
    const options = normalizeOptions(_options, null, "r", 420);
    const flag = parseFlag(options.flag);
    if (!isReadable(flag)) {
      throw new ErrnoError(22 /* EINVAL */, "Flag passed to readFile must allow for reading.");
    }
    const data = import_buffer.Buffer.from(_readFileSync(typeof path == "number" ? fd2file(path).path : path.toString(), options.flag, true));
    return options.encoding ? data.toString(options.encoding) : data;
  }
  __name(readFileSync, "readFileSync");
  function writeFileSync(path, data, _options = {}) {
    var _stack = [];
    try {
      const options = normalizeOptions(_options, "utf8", "w+", 420);
      const flag = parseFlag(options.flag);
      if (!isWriteable(flag)) {
        throw new ErrnoError(22 /* EINVAL */, "Flag passed to writeFile must allow for writing.");
      }
      if (typeof data != "string" && !options.encoding) {
        throw new ErrnoError(22 /* EINVAL */, "Encoding not specified");
      }
      const encodedData = typeof data == "string" ? import_buffer.Buffer.from(data, options.encoding) : new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
      if (!encodedData) {
        throw new ErrnoError(22 /* EINVAL */, "Data not specified");
      }
      const file = __using(_stack, _openSync(typeof path == "number" ? fd2file(path).path : path.toString(), flag, options.mode, true));
      file.writeSync(encodedData, 0, encodedData.byteLength, 0);
    } catch (_) {
      var _error = _, _hasError = true;
    } finally {
      __callDispose(_stack, _error, _hasError);
    }
  }
  __name(writeFileSync, "writeFileSync");
  function appendFileSync(filename, data, _options = {}) {
    var _stack = [];
    try {
      const options = normalizeOptions(_options, "utf8", "a", 420);
      const flag = parseFlag(options.flag);
      if (!isAppendable(flag)) {
        throw new ErrnoError(22 /* EINVAL */, "Flag passed to appendFile must allow for appending.");
      }
      if (typeof data != "string" && !options.encoding) {
        throw new ErrnoError(22 /* EINVAL */, "Encoding not specified");
      }
      const encodedData = typeof data == "string" ? import_buffer.Buffer.from(data, options.encoding) : new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
      const file = __using(_stack, _openSync(typeof filename == "number" ? fd2file(filename).path : filename.toString(), flag, options.mode, true));
      file.writeSync(encodedData, 0, encodedData.byteLength);
    } catch (_) {
      var _error = _, _hasError = true;
    } finally {
      __callDispose(_stack, _error, _hasError);
    }
  }
  __name(appendFileSync, "appendFileSync");
  function fstatSync(fd, options) {
    const stats = fd2file(fd).statSync();
    return options?.bigint ? new BigIntStats(stats) : stats;
  }
  __name(fstatSync, "fstatSync");
  function closeSync(fd) {
    fd2file(fd).closeSync();
    fdMap.delete(fd);
  }
  __name(closeSync, "closeSync");
  function ftruncateSync(fd, len = 0) {
    len ||= 0;
    if (len < 0) {
      throw new ErrnoError(22 /* EINVAL */);
    }
    fd2file(fd).truncateSync(len);
  }
  __name(ftruncateSync, "ftruncateSync");
  function fsyncSync(fd) {
    fd2file(fd).syncSync();
  }
  __name(fsyncSync, "fsyncSync");
  function fdatasyncSync(fd) {
    fd2file(fd).datasyncSync();
  }
  __name(fdatasyncSync, "fdatasyncSync");
  function writeSync(fd, data, posOrOff, lenOrEnc, pos) {
    let buffer, offset, length, position;
    if (typeof data === "string") {
      position = typeof posOrOff === "number" ? posOrOff : null;
      const encoding = typeof lenOrEnc === "string" ? lenOrEnc : "utf8";
      offset = 0;
      buffer = import_buffer.Buffer.from(data, encoding);
      length = buffer.byteLength;
    } else {
      buffer = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
      offset = posOrOff;
      length = lenOrEnc;
      position = typeof pos === "number" ? pos : null;
    }
    const file = fd2file(fd);
    position ??= file.position;
    return file.writeSync(buffer, offset, length, position);
  }
  __name(writeSync, "writeSync");
  function readSync(fd, buffer, opts, length, position) {
    const file = fd2file(fd);
    const offset = typeof opts == "object" ? opts.offset : opts;
    if (typeof opts == "object") {
      length = opts.length;
      position = opts.position;
    }
    position = Number(position);
    if (isNaN(position)) {
      position = file.position;
    }
    return file.readSync(buffer, offset, length, position);
  }
  __name(readSync, "readSync");
  function fchownSync(fd, uid, gid) {
    fd2file(fd).chownSync(uid, gid);
  }
  __name(fchownSync, "fchownSync");
  function fchmodSync(fd, mode) {
    const numMode = normalizeMode(mode, -1);
    if (numMode < 0) {
      throw new ErrnoError(22 /* EINVAL */, `Invalid mode.`);
    }
    fd2file(fd).chmodSync(numMode);
  }
  __name(fchmodSync, "fchmodSync");
  function futimesSync(fd, atime, mtime) {
    fd2file(fd).utimesSync(normalizeTime(atime), normalizeTime(mtime));
  }
  __name(futimesSync, "futimesSync");
  function rmdirSync(path) {
    path = normalizePath(path);
    const { fs, path: resolved } = resolveMount(existsSync(path) ? realpathSync(path) : path);
    try {
      fs.rmdirSync(resolved, cred);
    } catch (e) {
      throw fixError(e, { [resolved]: path });
    }
  }
  __name(rmdirSync, "rmdirSync");
  function mkdirSync(path, options) {
    options = typeof options === "object" ? options : { mode: options };
    const mode = normalizeMode(options?.mode, 511);
    path = normalizePath(path);
    path = existsSync(path) ? realpathSync(path) : path;
    const { fs, path: resolved } = resolveMount(path);
    const errorPaths = { [resolved]: path };
    try {
      if (!options?.recursive) {
        return fs.mkdirSync(resolved, mode, cred);
      }
      const dirs = [];
      for (let dir = resolved, original = path; !fs.existsSync(dir, cred); dir = dirname(dir), original = dirname(original)) {
        dirs.unshift(dir);
        errorPaths[dir] = original;
      }
      for (const dir of dirs) {
        fs.mkdirSync(dir, mode, cred);
      }
      return dirs[0];
    } catch (e) {
      throw fixError(e, errorPaths);
    }
  }
  __name(mkdirSync, "mkdirSync");
  function readdirSync(path, options) {
    path = normalizePath(path);
    const { fs, path: resolved } = resolveMount(existsSync(path) ? realpathSync(path) : path);
    let entries;
    try {
      entries = fs.readdirSync(resolved, cred);
    } catch (e) {
      throw fixError(e, { [resolved]: path });
    }
    for (const mount2 of mounts.keys()) {
      if (!mount2.startsWith(path)) {
        continue;
      }
      const entry = mount2.slice(path.length);
      if (entry.includes("/") || entry.length == 0) {
        continue;
      }
      entries.push(entry);
    }
    return entries.map((entry) => {
      if (typeof options == "object" && options?.withFileTypes) {
        return new Dirent(entry, statSync(join(path.toString(), entry)));
      }
      if (options == "buffer" || typeof options == "object" && options?.encoding == "buffer") {
        return import_buffer.Buffer.from(entry);
      }
      return entry;
    });
  }
  __name(readdirSync, "readdirSync");
  function linkSync(existing, newpath) {
    existing = normalizePath(existing);
    newpath = normalizePath(newpath);
    const { fs, path: resolved } = resolveMount(existing);
    try {
      return fs.linkSync(resolved, newpath, cred);
    } catch (e) {
      throw fixError(e, { [resolved]: existing });
    }
  }
  __name(linkSync, "linkSync");
  function symlinkSync(target, path, type = "file") {
    if (!["file", "dir", "junction"].includes(type)) {
      throw new ErrnoError(22 /* EINVAL */, "Invalid type: " + type);
    }
    if (existsSync(path)) {
      throw ErrnoError.With("EEXIST", path.toString(), "symlink");
    }
    writeFileSync(path, target.toString());
    const file = _openSync(path, "r+", 420, false);
    file._setTypeSync(FileType.SYMLINK);
  }
  __name(symlinkSync, "symlinkSync");
  function readlinkSync(path, options) {
    const value = import_buffer.Buffer.from(_readFileSync(path.toString(), "r", false));
    const encoding = typeof options == "object" ? options?.encoding : options;
    if (encoding == "buffer") {
      return value;
    }
    return value.toString(encoding);
  }
  __name(readlinkSync, "readlinkSync");
  function chownSync(path, uid, gid) {
    const fd = openSync(path, "r+");
    fchownSync(fd, uid, gid);
    closeSync(fd);
  }
  __name(chownSync, "chownSync");
  function lchownSync(path, uid, gid) {
    const fd = lopenSync(path, "r+");
    fchownSync(fd, uid, gid);
    closeSync(fd);
  }
  __name(lchownSync, "lchownSync");
  function chmodSync(path, mode) {
    const fd = openSync(path, "r+");
    fchmodSync(fd, mode);
    closeSync(fd);
  }
  __name(chmodSync, "chmodSync");
  function lchmodSync(path, mode) {
    const fd = lopenSync(path, "r+");
    fchmodSync(fd, mode);
    closeSync(fd);
  }
  __name(lchmodSync, "lchmodSync");
  function utimesSync(path, atime, mtime) {
    const fd = openSync(path, "r+");
    futimesSync(fd, atime, mtime);
    closeSync(fd);
  }
  __name(utimesSync, "utimesSync");
  function lutimesSync(path, atime, mtime) {
    const fd = lopenSync(path, "r+");
    futimesSync(fd, atime, mtime);
    closeSync(fd);
  }
  __name(lutimesSync, "lutimesSync");
  function realpathSync(path, options) {
    path = normalizePath(path);
    const { base, dir } = parse(path);
    const lpath = join(dir == "/" ? "/" : realpathSync(dir), base);
    const { fs, path: resolvedPath, mountPoint } = resolveMount(lpath);
    try {
      const stats = fs.statSync(resolvedPath, cred);
      if (!stats.isSymbolicLink()) {
        return lpath;
      }
      return realpathSync(mountPoint + readlinkSync(lpath));
    } catch (e) {
      throw fixError(e, { [resolvedPath]: lpath });
    }
  }
  __name(realpathSync, "realpathSync");
  function accessSync(path, mode = 384) {
    const stats = statSync(path);
    if (!stats.hasAccess(mode, cred)) {
      throw new ErrnoError(13 /* EACCES */);
    }
  }
  __name(accessSync, "accessSync");
  function rmSync(path, options) {
    path = normalizePath(path);
    const stats = statSync(path);
    switch (stats.mode & S_IFMT) {
      case S_IFDIR:
        if (options?.recursive) {
          for (const entry of readdirSync(path)) {
            rmSync(join(path, entry));
          }
        }
        rmdirSync(path);
        return;
      case S_IFREG:
      case S_IFLNK:
        unlinkSync(path);
        return;
      case S_IFBLK:
      case S_IFCHR:
      case S_IFIFO:
      case S_IFSOCK:
      default:
        throw new ErrnoError(1 /* EPERM */, "File type not supported", path, "rm");
    }
  }
  __name(rmSync, "rmSync");
  function mkdtempSync(prefix, options) {
    const encoding = typeof options === "object" ? options?.encoding : options || "utf8";
    const fsName = `${prefix}${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const resolvedPath = "/tmp/" + fsName;
    mkdirSync(resolvedPath);
    return encoding == "buffer" ? import_buffer.Buffer.from(resolvedPath) : resolvedPath;
  }
  __name(mkdtempSync, "mkdtempSync");
  function copyFileSync(src, dest, flags) {
    src = normalizePath(src);
    dest = normalizePath(dest);
    if (flags && flags & COPYFILE_EXCL && existsSync(dest)) {
      throw new ErrnoError(17 /* EEXIST */, "Destination file already exists.", dest, "copyFile");
    }
    writeFileSync(dest, readFileSync(src));
  }
  __name(copyFileSync, "copyFileSync");
  function readvSync(fd, buffers, position) {
    const file = fd2file(fd);
    let bytesRead = 0;
    for (const buffer of buffers) {
      bytesRead += file.readSync(buffer, 0, buffer.byteLength, position + bytesRead);
    }
    return bytesRead;
  }
  __name(readvSync, "readvSync");
  function writevSync(fd, buffers, position) {
    const file = fd2file(fd);
    let bytesWritten = 0;
    for (const buffer of buffers) {
      bytesWritten += file.writeSync(new Uint8Array(buffer.buffer), 0, buffer.byteLength, position + bytesWritten);
    }
    return bytesWritten;
  }
  __name(writevSync, "writevSync");
  function opendirSync(path, options) {
    path = normalizePath(path);
    return new Dir(path);
  }
  __name(opendirSync, "opendirSync");
  function cpSync(source, destination, opts) {
    source = normalizePath(source);
    destination = normalizePath(destination);
    const srcStats = lstatSync(source);
    if (opts?.errorOnExist && existsSync(destination)) {
      throw new ErrnoError(17 /* EEXIST */, "Destination file or directory already exists.", destination, "cp");
    }
    switch (srcStats.mode & S_IFMT) {
      case S_IFDIR:
        if (!opts?.recursive) {
          throw new ErrnoError(21 /* EISDIR */, source + " is a directory (not copied)", source, "cp");
        }
        mkdirSync(destination, { recursive: true });
        for (const dirent of readdirSync(source, { withFileTypes: true })) {
          if (opts.filter && !opts.filter(join(source, dirent.name), join(destination, dirent.name))) {
            continue;
          }
          cpSync(join(source, dirent.name), join(destination, dirent.name), opts);
        }
        break;
      case S_IFREG:
      case S_IFLNK:
        copyFileSync(source, destination);
        break;
      case S_IFBLK:
      case S_IFCHR:
      case S_IFIFO:
      case S_IFSOCK:
      default:
        throw new ErrnoError(1 /* EPERM */, "File type not supported", source, "rm");
    }
    if (opts?.preserveTimestamps) {
      utimesSync(destination, srcStats.atime, srcStats.mtime);
    }
  }
  __name(cpSync, "cpSync");
  function statfsSync(path, options) {
    path = normalizePath(path);
    const { fs } = resolveMount(path);
    return _statfs(fs, options?.bigint);
  }
  __name(statfsSync, "statfsSync");

  // src/emulation/dir.ts
  var Dirent = class {
    constructor(path, stats) {
      this.path = path;
      this.stats = stats;
    }
    static {
      __name(this, "Dirent");
    }
    get name() {
      return basename(this.path);
    }
    get parentPath() {
      return this.path;
    }
    isFile() {
      return this.stats.isFile();
    }
    isDirectory() {
      return this.stats.isDirectory();
    }
    isBlockDevice() {
      return this.stats.isBlockDevice();
    }
    isCharacterDevice() {
      return this.stats.isCharacterDevice();
    }
    isSymbolicLink() {
      return this.stats.isSymbolicLink();
    }
    isFIFO() {
      return this.stats.isFIFO();
    }
    isSocket() {
      return this.stats.isSocket();
    }
  };
  var Dir = class {
    constructor(path) {
      this.path = path;
    }
    static {
      __name(this, "Dir");
    }
    closed = false;
    checkClosed() {
      if (this.closed) {
        throw new ErrnoError(9 /* EBADF */, "Can not use closed Dir");
      }
    }
    _entries = [];
    close(cb) {
      this.closed = true;
      if (!cb) {
        return Promise.resolve();
      }
      cb();
    }
    /**
     * Synchronously close the directory's underlying resource handle.
     * Subsequent reads will result in errors.
     */
    closeSync() {
      this.closed = true;
    }
    async _read() {
      if (!this._entries) {
        this._entries = await readdir(this.path, { withFileTypes: true });
      }
      if (!this._entries.length) {
        return null;
      }
      return this._entries.shift() || null;
    }
    read(cb) {
      if (!cb) {
        return this._read();
      }
      this._read().then((value) => cb(void 0, value));
    }
    /**
     * Synchronously read the next directory entry via `readdir(3)` as a `Dirent`.
     * If there are no more directory entries to read, null will be returned.
     * Directory entries returned by this function are in no particular order as provided by the operating system's underlying directory mechanisms.
     */
    readSync() {
      if (!this._entries) {
        this._entries = readdirSync(this.path, { withFileTypes: true });
      }
      if (!this._entries.length) {
        return null;
      }
      return this._entries.shift() || null;
    }
    /**
     * Asynchronously iterates over the directory via `readdir(3)` until all entries have been read.
     */
    [Symbol.asyncIterator]() {
      const _this = this;
      return {
        [Symbol.asyncIterator]: this[Symbol.asyncIterator],
        next: /* @__PURE__ */ __name(async function() {
          const value = await _this._read();
          if (value != null) {
            return { done: false, value };
          }
          await _this.close();
          return { done: true, value: void 0 };
        }, "next")
      };
    }
  };

  // src/emulation/streams.ts
  var import_readable_stream = __toESM(require_browser3(), 1);
  var ReadStream = class extends import_readable_stream.Readable {
    static {
      __name(this, "ReadStream");
    }
    close(callback = () => null) {
      try {
        super.destroy();
        super.emit("close");
        callback();
      } catch (err) {
        callback(new ErrnoError(5 /* EIO */, err.toString()));
      }
    }
  };
  var WriteStream = class extends import_readable_stream.Writable {
    static {
      __name(this, "WriteStream");
    }
    close(callback = () => null) {
      try {
        super.destroy();
        super.emit("close");
        callback();
      } catch (err) {
        callback(new ErrnoError(5 /* EIO */, err.toString()));
      }
    }
  };

  // src/emulation/promises.ts
  var FileHandle = class {
    static {
      __name(this, "FileHandle");
    }
    /**
     * The file descriptor for this file handle.
     */
    fd;
    /**
     * @internal
     * The file for this file handle
     */
    file;
    constructor(fdOrFile) {
      const isFile = typeof fdOrFile != "number";
      this.fd = isFile ? file2fd(fdOrFile) : fdOrFile;
      this.file = isFile ? fdOrFile : fd2file(fdOrFile);
    }
    /**
     * Asynchronous fchown(2) - Change ownership of a file.
     */
    chown(uid, gid) {
      return this.file.chown(uid, gid);
    }
    /**
     * Asynchronous fchmod(2) - Change permissions of a file.
     * @param mode A file mode. If a string is passed, it is parsed as an octal integer.
     */
    chmod(mode) {
      const numMode = normalizeMode(mode, -1);
      if (numMode < 0) {
        throw new ErrnoError(22 /* EINVAL */, "Invalid mode.");
      }
      return this.file.chmod(numMode);
    }
    /**
     * Asynchronous fdatasync(2) - synchronize a file's in-core state with storage device.
     */
    datasync() {
      return this.file.datasync();
    }
    /**
     * Asynchronous fsync(2) - synchronize a file's in-core state with the underlying storage device.
     */
    sync() {
      return this.file.sync();
    }
    /**
     * Asynchronous ftruncate(2) - Truncate a file to a specified length.
     * @param len If not specified, defaults to `0`.
     */
    truncate(len) {
      len ||= 0;
      if (len < 0) {
        throw new ErrnoError(22 /* EINVAL */);
      }
      return this.file.truncate(len);
    }
    /**
     * Asynchronously change file timestamps of the file.
     * @param atime The last access time. If a string is provided, it will be coerced to number.
     * @param mtime The last modified time. If a string is provided, it will be coerced to number.
     */
    utimes(atime, mtime) {
      return this.file.utimes(normalizeTime(atime), normalizeTime(mtime));
    }
    /**
     * Asynchronously append data to a file, creating the file if it does not exist. The underlying file will _not_ be closed automatically.
     * The `FileHandle` must have been opened for appending.
     * @param data The data to write. If something other than a `Buffer` or `Uint8Array` is provided, the value is coerced to a string.
     * @param _options Either the encoding for the file, or an object optionally specifying the encoding, file mode, and flag.
     * If `encoding` is not supplied, the default of `'utf8'` is used.
     * If `mode` is not supplied, the default of `0o666` is used.
     * If `mode` is a string, it is parsed as an octal integer.
     * If `flag` is not supplied, the default of `'a'` is used.
     */
    async appendFile(data, _options = {}) {
      const options = normalizeOptions(_options, "utf8", "a", 420);
      const flag = parseFlag(options.flag);
      if (!isAppendable(flag)) {
        throw new ErrnoError(22 /* EINVAL */, "Flag passed to appendFile must allow for appending.");
      }
      if (typeof data != "string" && !options.encoding) {
        throw new ErrnoError(22 /* EINVAL */, "Encoding not specified");
      }
      const encodedData = typeof data == "string" ? import_buffer2.Buffer.from(data, options.encoding) : data;
      await this.file.write(encodedData, 0, encodedData.length);
    }
    /**
     * Asynchronously reads data from the file.
     * The `FileHandle` must have been opened for reading.
     * @param buffer The buffer that the data will be written to.
     * @param offset The offset in the buffer at which to start writing.
     * @param length The number of bytes to read.
     * @param position The offset from the beginning of the file from which data should be read. If `null`, data will be read from the current position.
     */
    read(buffer, offset, length, position) {
      if (isNaN(+position)) {
        position = this.file.position;
      }
      return this.file.read(buffer, offset, length, position);
    }
    async readFile(_options) {
      const options = normalizeOptions(_options, null, "r", 292);
      const flag = parseFlag(options.flag);
      if (!isReadable(flag)) {
        throw new ErrnoError(22 /* EINVAL */, "Flag passed must allow for reading.");
      }
      const { size } = await this.stat();
      const { buffer: data } = await this.file.read(new Uint8Array(size), 0, size, 0);
      const buffer = import_buffer2.Buffer.from(data);
      return options.encoding ? buffer.toString(options.encoding) : buffer;
    }
    /**
     * Returns a `ReadableStream` that may be used to read the files data.
     *
     * An error will be thrown if this method is called more than once or is called after the `FileHandle` is closed
     * or closing.
     *
     * While the `ReadableStream` will read the file to completion, it will not close the `FileHandle` automatically. User code must still call the `fileHandle.close()` method.
     *
     * @since v17.0.0
     * @experimental
     */
    readableWebStream(options = {}) {
      const start = /* @__PURE__ */ __name(async ({ close: close2, enqueue, error }) => {
        try {
          const chunkSize = 64 * 1024, maxChunks = 1e7;
          let i = 0, position = 0, bytesRead = NaN;
          while (bytesRead > 0) {
            const result = await this.read(new Uint8Array(chunkSize), 0, chunkSize, position);
            if (!result.bytesRead) {
              close2();
              return;
            }
            enqueue(result.buffer.slice(0, result.bytesRead));
            position += result.bytesRead;
            if (++i >= maxChunks) {
              throw new ErrnoError(27 /* EFBIG */, "Too many iterations on readable stream", this.file.path, "FileHandle.readableWebStream");
            }
            bytesRead = result.bytesRead;
          }
        } catch (e) {
          error(e);
        }
      }, "start");
      return new globalThis.ReadableStream({ start, type: options.type });
    }
    readLines(options) {
      throw ErrnoError.With("ENOSYS", this.file.path, "FileHandle.readLines");
    }
    [Symbol.asyncDispose]() {
      return this.close();
    }
    async stat(opts) {
      const stats = await this.file.stat();
      return opts?.bigint ? new BigIntStats(stats) : stats;
    }
    async write(data, posOrOff, lenOrEnc, position) {
      let buffer, offset, length;
      if (typeof data === "string") {
        position = typeof posOrOff === "number" ? posOrOff : null;
        const encoding = typeof lenOrEnc === "string" ? lenOrEnc : "utf8";
        offset = 0;
        buffer = import_buffer2.Buffer.from(data, encoding);
        length = buffer.length;
      } else {
        buffer = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
        offset = posOrOff;
        length = lenOrEnc;
        position = typeof position === "number" ? position : null;
      }
      position ??= this.file.position;
      const bytesWritten = await this.file.write(buffer, offset, length, position);
      return { buffer, bytesWritten };
    }
    /**
     * Asynchronously writes data to a file, replacing the file if it already exists. The underlying file will _not_ be closed automatically.
     * The `FileHandle` must have been opened for writing.
     * It is unsafe to call `writeFile()` multiple times on the same file without waiting for the `Promise` to be resolved (or rejected).
     * @param data The data to write. If something other than a `Buffer` or `Uint8Array` is provided, the value is coerced to a string.
     * @param _options Either the encoding for the file, or an object optionally specifying the encoding, file mode, and flag.
     * If `encoding` is not supplied, the default of `'utf8'` is used.
     * If `mode` is not supplied, the default of `0o666` is used.
     * If `mode` is a string, it is parsed as an octal integer.
     * If `flag` is not supplied, the default of `'w'` is used.
     */
    async writeFile(data, _options = {}) {
      const options = normalizeOptions(_options, "utf8", "w", 420);
      const flag = parseFlag(options.flag);
      if (!isWriteable(flag)) {
        throw new ErrnoError(22 /* EINVAL */, "Flag passed must allow for writing.");
      }
      if (typeof data != "string" && !options.encoding) {
        throw new ErrnoError(22 /* EINVAL */, "Encoding not specified");
      }
      const encodedData = typeof data == "string" ? import_buffer2.Buffer.from(data, options.encoding) : data;
      await this.file.write(encodedData, 0, encodedData.length, 0);
    }
    /**
     * Asynchronous close(2) - close a `FileHandle`.
     */
    async close() {
      await this.file.close();
      fdMap.delete(this.fd);
    }
    /**
     * Asynchronous `writev`. Writes from multiple buffers.
     * @param buffers An array of Uint8Array buffers.
     * @param position The position in the file where to begin writing.
     * @returns The number of bytes written.
     */
    async writev(buffers, position) {
      let bytesWritten = 0;
      for (const buffer of buffers) {
        bytesWritten += (await this.write(buffer, 0, buffer.length, position + bytesWritten)).bytesWritten;
      }
      return { bytesWritten, buffers };
    }
    /**
     * Asynchronous `readv`. Reads into multiple buffers.
     * @param buffers An array of Uint8Array buffers.
     * @param position The position in the file where to begin reading.
     * @returns The number of bytes read.
     */
    async readv(buffers, position) {
      let bytesRead = 0;
      for (const buffer of buffers) {
        bytesRead += (await this.read(buffer, 0, buffer.byteLength, position + bytesRead)).bytesRead;
      }
      return { bytesRead, buffers };
    }
    /**
     * Creates a `ReadStream` for reading from the file.
     *
     * @param options Options for the readable stream
     * @returns A `ReadStream` object.
     */
    createReadStream(options) {
      const stream = new ReadStream({
        highWaterMark: options?.highWaterMark || 64 * 1024,
        encoding: options.encoding,
        read: /* @__PURE__ */ __name(async (size) => {
          try {
            const result = await this.read(new Uint8Array(size), 0, size, this.file.position);
            stream.push(!result.bytesRead ? null : result.buffer.slice(0, result.bytesRead));
            this.file.position += result.bytesRead;
          } catch (error) {
            stream.destroy(error);
          }
        }, "read")
      });
      stream.path = this.file.path;
      return stream;
    }
    /**
     * Creates a `WriteStream` for writing to the file.
     *
     * @param options Options for the writeable stream.
     * @returns A `WriteStream` object
     */
    createWriteStream(options) {
      const streamOptions = {
        highWaterMark: options?.highWaterMark,
        encoding: options?.encoding,
        write: /* @__PURE__ */ __name(async (chunk, encoding, callback) => {
          try {
            const { bytesWritten } = await this.write(chunk, null, encoding);
            callback(bytesWritten == chunk.length ? null : new Error("Failed to write full chunk"));
          } catch (error) {
            callback(error);
          }
        }, "write")
      };
      const stream = new WriteStream(streamOptions);
      stream.path = this.file.path;
      return stream;
    }
  };
  async function rename(oldPath, newPath) {
    oldPath = normalizePath(oldPath);
    newPath = normalizePath(newPath);
    const src = resolveMount(oldPath);
    const dst = resolveMount(newPath);
    try {
      if (src.mountPoint == dst.mountPoint) {
        await src.fs.rename(src.path, dst.path, cred);
        return;
      }
      await writeFile(newPath, await readFile(oldPath));
      await unlink(oldPath);
    } catch (e) {
      throw fixError(e, { [src.path]: oldPath, [dst.path]: newPath });
    }
  }
  __name(rename, "rename");
  async function exists(path) {
    try {
      const { fs, path: resolved } = resolveMount(await realpath(path));
      return await fs.exists(resolved, cred);
    } catch (e) {
      if (e instanceof ErrnoError && e.code == "ENOENT") {
        return false;
      }
      throw e;
    }
  }
  __name(exists, "exists");
  async function stat(path, options) {
    path = normalizePath(path);
    const { fs, path: resolved } = resolveMount(await exists(path) ? await realpath(path) : path);
    try {
      const stats = await fs.stat(resolved, cred);
      return options?.bigint ? new BigIntStats(stats) : stats;
    } catch (e) {
      throw fixError(e, { [resolved]: path });
    }
  }
  __name(stat, "stat");
  async function lstat(path, options) {
    path = normalizePath(path);
    const { fs, path: resolved } = resolveMount(path);
    try {
      const stats = await fs.stat(resolved, cred);
      return options?.bigint ? new BigIntStats(stats) : stats;
    } catch (e) {
      throw fixError(e, { [resolved]: path });
    }
  }
  __name(lstat, "lstat");
  async function truncate(path, len = 0) {
    var _stack = [];
    try {
      const handle = __using(_stack, await open(path, "r+"), true);
      await handle.truncate(len);
    } catch (_) {
      var _error = _, _hasError = true;
    } finally {
      var _promise = __callDispose(_stack, _error, _hasError);
      _promise && await _promise;
    }
  }
  __name(truncate, "truncate");
  async function unlink(path) {
    path = normalizePath(path);
    const { fs, path: resolved } = resolveMount(path);
    try {
      await fs.unlink(resolved, cred);
    } catch (e) {
      throw fixError(e, { [resolved]: path });
    }
  }
  __name(unlink, "unlink");
  async function _open(path, _flag, _mode = 420, resolveSymlinks) {
    path = normalizePath(path);
    const mode = normalizeMode(_mode, 420), flag = parseFlag(_flag);
    path = resolveSymlinks && await exists(path) ? await realpath(path) : path;
    const { fs, path: resolved } = resolveMount(path);
    if (!await fs.exists(resolved, cred)) {
      if (!isWriteable(flag) && !isAppendable(flag) || flag == "r+") {
        throw ErrnoError.With("ENOENT", path, "_open");
      }
      const parentStats = await fs.stat(dirname(resolved), cred);
      if (parentStats && !parentStats.isDirectory()) {
        throw ErrnoError.With("ENOTDIR", dirname(path), "_open");
      }
      return new FileHandle(await fs.createFile(resolved, flag, mode, cred));
    }
    if (isExclusive(flag)) {
      throw ErrnoError.With("EEXIST", path, "_open");
    }
    if (!isTruncating(flag)) {
      return new FileHandle(await fs.openFile(resolved, flag, cred));
    }
    const file = await fs.openFile(resolved, flag, cred);
    await file.truncate(0);
    await file.sync();
    return new FileHandle(file);
  }
  __name(_open, "_open");
  async function open(path, flag = "r", mode = 420) {
    return await _open(path, flag, mode, true);
  }
  __name(open, "open");
  async function readFile(path, _options) {
    var _stack = [];
    try {
      const options = normalizeOptions(_options, null, "r", 420);
      const handle = __using(_stack, typeof path == "object" && "fd" in path ? path : await open(path, options.flag, options.mode), true);
      return await handle.readFile(options);
    } catch (_) {
      var _error = _, _hasError = true;
    } finally {
      var _promise = __callDispose(_stack, _error, _hasError);
      _promise && await _promise;
    }
  }
  __name(readFile, "readFile");
  async function writeFile(path, data, _options) {
    var _stack = [];
    try {
      const options = normalizeOptions(_options, "utf8", "w+", 420);
      const handle = __using(_stack, path instanceof FileHandle ? path : await open(path.toString(), options.flag, options.mode), true);
      const _data = typeof data == "string" ? data : data;
      if (typeof _data != "string" && !(_data instanceof Uint8Array)) {
        throw new ErrnoError(22 /* EINVAL */, "Iterables and streams not supported", handle.file.path, "writeFile");
      }
      await handle.writeFile(_data, options);
    } catch (_) {
      var _error = _, _hasError = true;
    } finally {
      var _promise = __callDispose(_stack, _error, _hasError);
      _promise && await _promise;
    }
  }
  __name(writeFile, "writeFile");
  async function appendFile(path, data, _options) {
    var _stack = [];
    try {
      const options = normalizeOptions(_options, "utf8", "a", 420);
      const flag = parseFlag(options.flag);
      if (!isAppendable(flag)) {
        throw new ErrnoError(22 /* EINVAL */, "Flag passed to appendFile must allow for appending.");
      }
      if (typeof data != "string" && !options.encoding) {
        throw new ErrnoError(22 /* EINVAL */, "Encoding not specified");
      }
      const encodedData = typeof data == "string" ? import_buffer2.Buffer.from(data, options.encoding) : new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
      const handle = __using(_stack, typeof path == "object" && "fd" in path ? path : await open(path, options.flag, options.mode), true);
      await handle.appendFile(encodedData, options);
    } catch (_) {
      var _error = _, _hasError = true;
    } finally {
      var _promise = __callDispose(_stack, _error, _hasError);
      _promise && await _promise;
    }
  }
  __name(appendFile, "appendFile");
  async function rmdir(path) {
    path = normalizePath(path);
    path = await exists(path) ? await realpath(path) : path;
    const { fs, path: resolved } = resolveMount(path);
    try {
      await fs.rmdir(resolved, cred);
    } catch (e) {
      throw fixError(e, { [resolved]: path });
    }
  }
  __name(rmdir, "rmdir");
  async function mkdir(path, options) {
    options = typeof options === "object" ? options : { mode: options };
    const mode = normalizeMode(options?.mode, 511);
    path = normalizePath(path);
    path = await exists(path) ? await realpath(path) : path;
    const { fs, path: resolved } = resolveMount(path);
    const errorPaths = { [resolved]: path };
    try {
      if (!options?.recursive) {
        await fs.mkdir(resolved, mode, cred);
      }
      const dirs = [];
      for (let dir = resolved, origDir = path; !await fs.exists(dir, cred); dir = dirname(dir), origDir = dirname(origDir)) {
        dirs.unshift(dir);
        errorPaths[dir] = origDir;
      }
      for (const dir of dirs) {
        await fs.mkdir(dir, mode, cred);
      }
      return dirs[0];
    } catch (e) {
      throw fixError(e, errorPaths);
    }
  }
  __name(mkdir, "mkdir");
  async function readdir(path, options) {
    path = normalizePath(path);
    path = await exists(path) ? await realpath(path) : path;
    const { fs, path: resolved } = resolveMount(path);
    let entries;
    try {
      entries = await fs.readdir(resolved, cred);
    } catch (e) {
      throw fixError(e, { [resolved]: path });
    }
    for (const point of mounts.keys()) {
      if (point.startsWith(path)) {
        const entry = point.slice(path.length);
        if (entry.includes("/") || entry.length == 0) {
          continue;
        }
        entries.push(entry);
      }
    }
    const values = [];
    for (const entry of entries) {
      values.push(typeof options == "object" && options?.withFileTypes ? new Dirent(entry, await stat(join(path, entry))) : entry);
    }
    return values;
  }
  __name(readdir, "readdir");
  async function link(existing, newpath) {
    existing = normalizePath(existing);
    newpath = normalizePath(newpath);
    const { fs, path: resolved } = resolveMount(newpath);
    try {
      return await fs.link(existing, newpath, cred);
    } catch (e) {
      throw fixError(e, { [resolved]: newpath });
    }
  }
  __name(link, "link");
  async function symlink(target, path, type = "file") {
    if (!["file", "dir", "junction"].includes(type)) {
      throw new ErrnoError(22 /* EINVAL */, "Invalid symlink type: " + type);
    }
    if (await exists(path)) {
      throw ErrnoError.With("EEXIST", path.toString(), "symlink");
    }
    await writeFile(path, target.toString());
    const handle = await _open(path, "r+", 420, false);
    await handle.file._setType(FileType.SYMLINK);
  }
  __name(symlink, "symlink");
  async function readlink(path, options) {
    var _stack = [];
    try {
      const handle = __using(_stack, await _open(normalizePath(path), "r", 420, false), true);
      const value = await handle.readFile();
      const encoding = typeof options == "object" ? options?.encoding : options;
      return encoding == "buffer" ? value : value.toString(encoding);
    } catch (_) {
      var _error = _, _hasError = true;
    } finally {
      var _promise = __callDispose(_stack, _error, _hasError);
      _promise && await _promise;
    }
  }
  __name(readlink, "readlink");
  async function chown(path, uid, gid) {
    var _stack = [];
    try {
      const handle = __using(_stack, await open(path, "r+"), true);
      await handle.chown(uid, gid);
    } catch (_) {
      var _error = _, _hasError = true;
    } finally {
      var _promise = __callDispose(_stack, _error, _hasError);
      _promise && await _promise;
    }
  }
  __name(chown, "chown");
  async function lchown(path, uid, gid) {
    var _stack = [];
    try {
      const handle = __using(_stack, await _open(path, "r+", 420, false), true);
      await handle.chown(uid, gid);
    } catch (_) {
      var _error = _, _hasError = true;
    } finally {
      var _promise = __callDispose(_stack, _error, _hasError);
      _promise && await _promise;
    }
  }
  __name(lchown, "lchown");
  async function chmod(path, mode) {
    var _stack = [];
    try {
      const handle = __using(_stack, await open(path, "r+"), true);
      await handle.chmod(mode);
    } catch (_) {
      var _error = _, _hasError = true;
    } finally {
      var _promise = __callDispose(_stack, _error, _hasError);
      _promise && await _promise;
    }
  }
  __name(chmod, "chmod");
  async function lchmod(path, mode) {
    var _stack = [];
    try {
      const handle = __using(_stack, await _open(path, "r+", 420, false), true);
      await handle.chmod(mode);
    } catch (_) {
      var _error = _, _hasError = true;
    } finally {
      var _promise = __callDispose(_stack, _error, _hasError);
      _promise && await _promise;
    }
  }
  __name(lchmod, "lchmod");
  async function utimes(path, atime, mtime) {
    var _stack = [];
    try {
      const handle = __using(_stack, await open(path, "r+"), true);
      await handle.utimes(atime, mtime);
    } catch (_) {
      var _error = _, _hasError = true;
    } finally {
      var _promise = __callDispose(_stack, _error, _hasError);
      _promise && await _promise;
    }
  }
  __name(utimes, "utimes");
  async function lutimes(path, atime, mtime) {
    var _stack = [];
    try {
      const handle = __using(_stack, await _open(path, "r+", 420, false), true);
      await handle.utimes(new Date(atime), new Date(mtime));
    } catch (_) {
      var _error = _, _hasError = true;
    } finally {
      var _promise = __callDispose(_stack, _error, _hasError);
      _promise && await _promise;
    }
  }
  __name(lutimes, "lutimes");
  async function realpath(path, options) {
    path = normalizePath(path);
    const { base, dir } = parse(path);
    const lpath = join(dir == "/" ? "/" : await realpath(dir), base);
    const { fs, path: resolvedPath, mountPoint } = resolveMount(lpath);
    try {
      const stats = await fs.stat(resolvedPath, cred);
      if (!stats.isSymbolicLink()) {
        return lpath;
      }
      return realpath(mountPoint + await readlink(lpath));
    } catch (e) {
      throw fixError(e, { [resolvedPath]: lpath });
    }
  }
  __name(realpath, "realpath");
  function watch(filename, options = {}) {
    throw ErrnoError.With("ENOSYS", filename.toString(), "watch");
  }
  __name(watch, "watch");
  async function access(path, mode = F_OK) {
    const stats = await stat(path);
    if (!stats.hasAccess(mode, cred)) {
      throw new ErrnoError(13 /* EACCES */);
    }
  }
  __name(access, "access");
  async function rm(path, options) {
    path = normalizePath(path);
    const stats = await stat(path);
    switch (stats.mode & S_IFMT) {
      case S_IFDIR:
        if (options?.recursive) {
          for (const entry of await readdir(path)) {
            await rm(join(path, entry));
          }
        }
        await rmdir(path);
        return;
      case S_IFREG:
      case S_IFLNK:
        await unlink(path);
        return;
      case S_IFBLK:
      case S_IFCHR:
      case S_IFIFO:
      case S_IFSOCK:
      default:
        throw new ErrnoError(1 /* EPERM */, "File type not supported", path, "rm");
    }
  }
  __name(rm, "rm");
  async function mkdtemp(prefix, options) {
    const encoding = typeof options === "object" ? options?.encoding : options || "utf8";
    const fsName = `${prefix}${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const resolvedPath = "/tmp/" + fsName;
    await mkdir(resolvedPath);
    return encoding == "buffer" ? import_buffer2.Buffer.from(resolvedPath) : resolvedPath;
  }
  __name(mkdtemp, "mkdtemp");
  async function copyFile(src, dest, mode) {
    src = normalizePath(src);
    dest = normalizePath(dest);
    if (mode && mode & COPYFILE_EXCL && await exists(dest)) {
      throw new ErrnoError(17 /* EEXIST */, "Destination file already exists.", dest, "copyFile");
    }
    await writeFile(dest, await readFile(src));
  }
  __name(copyFile, "copyFile");
  async function opendir(path, options) {
    path = normalizePath(path);
    return new Dir(path);
  }
  __name(opendir, "opendir");
  async function cp(source, destination, opts) {
    source = normalizePath(source);
    destination = normalizePath(destination);
    const srcStats = await lstat(source);
    if (opts?.errorOnExist && await exists(destination)) {
      throw new ErrnoError(17 /* EEXIST */, "Destination file or directory already exists.", destination, "cp");
    }
    switch (srcStats.mode & S_IFMT) {
      case S_IFDIR:
        if (!opts?.recursive) {
          throw new ErrnoError(21 /* EISDIR */, source + " is a directory (not copied)", source, "cp");
        }
        await mkdir(destination, { recursive: true });
        for (const dirent of await readdir(source, { withFileTypes: true })) {
          if (opts.filter && !opts.filter(join(source, dirent.name), join(destination, dirent.name))) {
            continue;
          }
          await cp(join(source, dirent.name), join(destination, dirent.name), opts);
        }
        break;
      case S_IFREG:
      case S_IFLNK:
        await copyFile(source, destination);
        break;
      case S_IFBLK:
      case S_IFCHR:
      case S_IFIFO:
      case S_IFSOCK:
      default:
        throw new ErrnoError(1 /* EPERM */, "File type not supported", source, "rm");
    }
    if (opts?.preserveTimestamps) {
      await utimes(destination, srcStats.atime, srcStats.mtime);
    }
  }
  __name(cp, "cp");
  async function statfs(path, opts) {
    path = normalizePath(path);
    const { fs } = resolveMount(path);
    return _statfs(fs, opts?.bigint);
  }
  __name(statfs, "statfs");

  // src/emulation/async.ts
  function rename2(oldPath, newPath, cb = nop) {
    rename(oldPath, newPath).then(() => cb()).catch(cb);
  }
  __name(rename2, "rename");
  function exists2(path, cb = nop) {
    exists(path).then(cb).catch(() => cb(false));
  }
  __name(exists2, "exists");
  function stat2(path, options, callback = nop) {
    callback = typeof options == "function" ? options : callback;
    stat(path, typeof options != "function" ? options : {}).then((stats) => callback(void 0, stats)).catch(callback);
  }
  __name(stat2, "stat");
  function lstat2(path, options, callback = nop) {
    callback = typeof options == "function" ? options : callback;
    lstat(path, typeof options != "function" ? options : {}).then((stats) => callback(void 0, stats)).catch(callback);
  }
  __name(lstat2, "lstat");
  function truncate2(path, cbLen = 0, cb = nop) {
    cb = typeof cbLen === "function" ? cbLen : cb;
    const len = typeof cbLen === "number" ? cbLen : 0;
    truncate(path, len).then(() => cb()).catch(cb);
  }
  __name(truncate2, "truncate");
  function unlink2(path, cb = nop) {
    unlink(path).then(() => cb()).catch(cb);
  }
  __name(unlink2, "unlink");
  function open2(path, flag, cbMode, cb = nop) {
    const mode = normalizeMode(cbMode, 420);
    cb = typeof cbMode === "function" ? cbMode : cb;
    open(path, flag, mode).then((handle) => cb(void 0, handle.fd)).catch(cb);
  }
  __name(open2, "open");
  function readFile2(filename, options, cb = nop) {
    cb = typeof options === "function" ? options : cb;
    readFile(filename, typeof options === "function" ? null : options).then((data) => cb(void 0, data)).catch(cb);
  }
  __name(readFile2, "readFile");
  function writeFile2(filename, data, cbEncOpts, cb = nop) {
    cb = typeof cbEncOpts === "function" ? cbEncOpts : cb;
    writeFile(filename, data, typeof cbEncOpts != "function" ? cbEncOpts : null).then(() => cb(void 0)).catch(cb);
  }
  __name(writeFile2, "writeFile");
  function appendFile2(filename, data, cbEncOpts, cb = nop) {
    cb = typeof cbEncOpts === "function" ? cbEncOpts : cb;
    appendFile(filename, data, typeof cbEncOpts === "function" ? null : cbEncOpts).then(() => cb()).catch(cb);
  }
  __name(appendFile2, "appendFile");
  function fstat(fd, options, cb = nop) {
    cb = typeof options == "function" ? options : cb;
    fd2file(fd).stat().then((stats) => cb(void 0, typeof options == "object" && options?.bigint ? new BigIntStats(stats) : stats)).catch(cb);
  }
  __name(fstat, "fstat");
  function close(fd, cb = nop) {
    new FileHandle(fd).close().then(() => cb()).catch(cb);
  }
  __name(close, "close");
  function ftruncate(fd, lenOrCB, cb = nop) {
    const length = typeof lenOrCB === "number" ? lenOrCB : 0;
    cb = typeof lenOrCB === "function" ? lenOrCB : cb;
    const file = fd2file(fd);
    if (length < 0) {
      throw new ErrnoError(22 /* EINVAL */);
    }
    file.truncate(length).then(() => cb()).catch(cb);
  }
  __name(ftruncate, "ftruncate");
  function fsync(fd, cb = nop) {
    fd2file(fd).sync().then(() => cb()).catch(cb);
  }
  __name(fsync, "fsync");
  function fdatasync(fd, cb = nop) {
    fd2file(fd).datasync().then(() => cb()).catch(cb);
  }
  __name(fdatasync, "fdatasync");
  function write(fd, data, cbPosOff, cbLenEnc, cbPos, cb = nop) {
    let buffer, offset, length, position, encoding;
    const handle = new FileHandle(fd);
    if (typeof data === "string") {
      encoding = "utf8";
      switch (typeof cbPosOff) {
        case "function":
          cb = cbPosOff;
          break;
        case "number":
          position = cbPosOff;
          encoding = typeof cbLenEnc === "string" ? cbLenEnc : "utf8";
          cb = typeof cbPos === "function" ? cbPos : cb;
          break;
        default:
          cb = typeof cbLenEnc === "function" ? cbLenEnc : typeof cbPos === "function" ? cbPos : cb;
          cb(new ErrnoError(22 /* EINVAL */, "Invalid arguments."));
          return;
      }
      buffer = import_buffer3.Buffer.from(data);
      offset = 0;
      length = buffer.length;
      const _cb = cb;
      handle.write(buffer, offset, length, position).then(({ bytesWritten }) => _cb(void 0, bytesWritten, buffer.toString(encoding))).catch(_cb);
    } else {
      buffer = import_buffer3.Buffer.from(data.buffer);
      offset = cbPosOff;
      length = cbLenEnc;
      position = typeof cbPos === "number" ? cbPos : null;
      const _cb = typeof cbPos === "function" ? cbPos : cb;
      handle.write(buffer, offset, length, position).then(({ bytesWritten }) => _cb(void 0, bytesWritten, buffer)).catch(_cb);
    }
  }
  __name(write, "write");
  function read(fd, buffer, offset, length, position, cb = nop) {
    new FileHandle(fd).read(buffer, offset, length, position).then(({ bytesRead, buffer: buffer2 }) => cb(void 0, bytesRead, buffer2)).catch(cb);
  }
  __name(read, "read");
  function fchown(fd, uid, gid, cb = nop) {
    new FileHandle(fd).chown(uid, gid).then(() => cb()).catch(cb);
  }
  __name(fchown, "fchown");
  function fchmod(fd, mode, cb) {
    new FileHandle(fd).chmod(mode).then(() => cb()).catch(cb);
  }
  __name(fchmod, "fchmod");
  function futimes(fd, atime, mtime, cb = nop) {
    new FileHandle(fd).utimes(atime, mtime).then(() => cb()).catch(cb);
  }
  __name(futimes, "futimes");
  function rmdir2(path, cb = nop) {
    rmdir(path).then(() => cb()).catch(cb);
  }
  __name(rmdir2, "rmdir");
  function mkdir2(path, mode, cb = nop) {
    mkdir(path, mode).then(() => cb()).catch(cb);
  }
  __name(mkdir2, "mkdir");
  function readdir2(path, _options, cb = nop) {
    cb = typeof _options == "function" ? _options : cb;
    const options = typeof _options != "function" ? _options : {};
    readdir(path, options).then((entries) => cb(void 0, entries)).catch(cb);
  }
  __name(readdir2, "readdir");
  function link2(existing, newpath, cb = nop) {
    link(existing, newpath).then(() => cb()).catch(cb);
  }
  __name(link2, "link");
  function symlink2(target, path, typeOrCB, cb = nop) {
    const type = typeof typeOrCB === "string" ? typeOrCB : "file";
    cb = typeof typeOrCB === "function" ? typeOrCB : cb;
    symlink(target, path, type).then(() => cb()).catch(cb);
  }
  __name(symlink2, "symlink");
  function readlink2(path, options, callback = nop) {
    callback = typeof options == "function" ? options : callback;
    readlink(path).then((result) => callback(void 0, result)).catch(callback);
  }
  __name(readlink2, "readlink");
  function chown2(path, uid, gid, cb = nop) {
    chown(path, uid, gid).then(() => cb()).catch(cb);
  }
  __name(chown2, "chown");
  function lchown2(path, uid, gid, cb = nop) {
    lchown(path, uid, gid).then(() => cb()).catch(cb);
  }
  __name(lchown2, "lchown");
  function chmod2(path, mode, cb = nop) {
    chmod(path, mode).then(() => cb()).catch(cb);
  }
  __name(chmod2, "chmod");
  function lchmod2(path, mode, cb = nop) {
    lchmod(path, mode).then(() => cb()).catch(cb);
  }
  __name(lchmod2, "lchmod");
  function utimes2(path, atime, mtime, cb = nop) {
    utimes(path, atime, mtime).then(() => cb()).catch(cb);
  }
  __name(utimes2, "utimes");
  function lutimes2(path, atime, mtime, cb = nop) {
    lutimes(path, atime, mtime).then(() => cb()).catch(cb);
  }
  __name(lutimes2, "lutimes");
  function realpath2(path, arg2, cb = nop) {
    cb = typeof arg2 === "function" ? arg2 : cb;
    realpath(path, typeof arg2 === "function" ? null : arg2).then((result) => cb(void 0, result)).catch(cb);
  }
  __name(realpath2, "realpath");
  function access2(path, cbMode, cb = nop) {
    const mode = typeof cbMode === "number" ? cbMode : R_OK;
    cb = typeof cbMode === "function" ? cbMode : cb;
    access(path, typeof cbMode === "function" ? null : cbMode).then(() => cb()).catch(cb);
  }
  __name(access2, "access");
  function watchFile(path, optsListener, listener = nop) {
    throw ErrnoError.With("ENOSYS", path.toString(), "watchFile");
  }
  __name(watchFile, "watchFile");
  function unwatchFile(path, listener = nop) {
    throw ErrnoError.With("ENOSYS", path.toString(), "unwatchFile");
  }
  __name(unwatchFile, "unwatchFile");
  function watch2(path, options, listener = nop) {
    throw ErrnoError.With("ENOSYS", path.toString(), "watch");
  }
  __name(watch2, "watch");
  function createReadStream(path, _options) {
    const options = typeof _options == "object" ? _options : { encoding: _options };
    let handle;
    const stream = new ReadStream({
      highWaterMark: options.highWaterMark || 64 * 1024,
      encoding: options.encoding || "utf8",
      read: /* @__PURE__ */ __name(async function(size) {
        try {
          handle ||= await open(path, "r", options?.mode);
          const result = await handle.read(new Uint8Array(size), 0, size, handle.file.position);
          stream.push(!result.bytesRead ? null : result.buffer.slice(0, result.bytesRead));
          handle.file.position += result.bytesRead;
          if (!result.bytesRead) {
            await handle.close();
          }
        } catch (error) {
          await handle?.close();
          stream.destroy(error);
        }
      }, "read"),
      destroy: /* @__PURE__ */ __name(function(error, callback) {
        handle?.close().then(() => callback(error)).catch(callback);
      }, "destroy")
    });
    stream.path = path.toString();
    return stream;
  }
  __name(createReadStream, "createReadStream");
  function createWriteStream(path, _options) {
    const options = typeof _options == "object" ? _options : { encoding: _options };
    let handle;
    const stream = new WriteStream({
      highWaterMark: options?.highWaterMark,
      write: /* @__PURE__ */ __name(async function(chunk, encoding, callback) {
        try {
          handle ||= await open(path, "w", options?.mode || 438);
          await handle.write(chunk, 0, encoding);
          callback(void 0);
        } catch (error) {
          await handle?.close();
          callback(error);
        }
      }, "write"),
      destroy: /* @__PURE__ */ __name(function(error, callback) {
        callback(error);
        handle?.close().then(() => callback(error)).catch(callback);
      }, "destroy"),
      final: /* @__PURE__ */ __name(function(callback) {
        handle?.close().then(() => callback()).catch(callback);
      }, "final")
    });
    stream.path = path.toString();
    return stream;
  }
  __name(createWriteStream, "createWriteStream");
  function rm2(path, options, callback = nop) {
    callback = typeof options === "function" ? options : callback;
    rm(path, typeof options === "function" ? void 0 : options).then(() => callback(void 0)).catch(callback);
  }
  __name(rm2, "rm");
  function mkdtemp2(prefix, options, callback = nop) {
    callback = typeof options === "function" ? options : callback;
    mkdtemp(prefix, typeof options != "function" ? options : null).then((result) => callback(void 0, result)).catch(callback);
  }
  __name(mkdtemp2, "mkdtemp");
  function copyFile2(src, dest, flags, callback = nop) {
    callback = typeof flags === "function" ? flags : callback;
    copyFile(src, dest, typeof flags === "function" ? void 0 : flags).then(() => callback(void 0)).catch(callback);
  }
  __name(copyFile2, "copyFile");
  function readv(fd, buffers, position, cb = nop) {
    cb = typeof position === "function" ? position : cb;
    new FileHandle(fd).readv(buffers, typeof position === "function" ? void 0 : position).then(({ buffers: buffers2, bytesRead }) => cb(void 0, bytesRead, buffers2)).catch(cb);
  }
  __name(readv, "readv");
  function writev(fd, buffers, position, cb = nop) {
    cb = typeof position === "function" ? position : cb;
    new FileHandle(fd).writev(buffers, typeof position === "function" ? void 0 : position).then(({ buffers: buffers2, bytesWritten }) => cb(void 0, bytesWritten, buffers2)).catch(cb);
  }
  __name(writev, "writev");
  function opendir2(path, options, cb = nop) {
    cb = typeof options === "function" ? options : cb;
    opendir(path, typeof options === "function" ? void 0 : options).then((result) => cb(void 0, result)).catch(cb);
  }
  __name(opendir2, "opendir");
  function cp2(source, destination, opts, callback = nop) {
    callback = typeof opts === "function" ? opts : callback;
    cp(source, destination, typeof opts === "function" ? void 0 : opts).then(() => callback(void 0)).catch(callback);
  }
  __name(cp2, "cp");
  function statfs2(path, options, callback = nop) {
    callback = typeof options === "function" ? options : callback;
    statfs(path, typeof options === "function" ? void 0 : options).then((result) => callback(void 0, result)).catch(callback);
  }
  __name(statfs2, "statfs");
  async function openAsBlob(path, options) {
    const handle = await open(path.toString(), "r");
    const buffer = await handle.readFile();
    await handle.close();
    return new Blob([buffer], options);
  }
  __name(openAsBlob, "openAsBlob");

  // src/config.ts
  function isMountConfig(arg) {
    return isBackendConfig(arg) || isBackend(arg) || arg instanceof FileSystem;
  }
  __name(isMountConfig, "isMountConfig");
  async function resolveMountConfig(config, _depth = 0) {
    if (typeof config !== "object" || config == null) {
      throw new ErrnoError(22 /* EINVAL */, "Invalid options on mount configuration");
    }
    if (!isMountConfig(config)) {
      throw new ErrnoError(22 /* EINVAL */, "Invalid mount configuration");
    }
    if (config instanceof FileSystem) {
      return config;
    }
    if (isBackend(config)) {
      config = { backend: config };
    }
    for (const [key, value] of Object.entries(config)) {
      if (key == "backend") {
        continue;
      }
      if (!isMountConfig(value)) {
        continue;
      }
      if (_depth > 10) {
        throw new ErrnoError(22 /* EINVAL */, "Invalid configuration, too deep and possibly infinite");
      }
      config[key] = await resolveMountConfig(value, ++_depth);
    }
    const { backend } = config;
    if (!await backend.isAvailable()) {
      throw new ErrnoError(1 /* EPERM */, "Backend not available: " + backend);
    }
    checkOptions(backend, config);
    const mount2 = await backend.create(config);
    if ("_disableSync" in mount2) {
      mount2._disableSync = config.disableAsyncCache || false;
    }
    await mount2.ready();
    return mount2;
  }
  __name(resolveMountConfig, "resolveMountConfig");
  async function configure(config) {
    const uid = "uid" in config ? config.uid || 0 : 0;
    const gid = "gid" in config ? config.gid || 0 : 0;
    if (isMountConfig(config)) {
      config = { mounts: { "/": config } };
    }
    setCred({ uid, gid, suid: uid, sgid: gid, euid: uid, egid: gid });
    if (!config.mounts) {
      return;
    }
    for (const [point, mountConfig] of Object.entries(config.mounts)) {
      if (!point.startsWith("/")) {
        throw new ErrnoError(22 /* EINVAL */, "Mount points must have absolute paths");
      }
      if (isBackendConfig(mountConfig)) {
        mountConfig.disableAsyncCache ??= config.disableAsyncCache || false;
      }
      config.mounts[point] = await resolveMountConfig(mountConfig);
    }
    mountObject(config.mounts);
  }
  __name(configure, "configure");

  // src/index.ts
  var src_default = emulation_exports;
  return __toCommonJS(src_exports);
})();
/*! Bundled license information:

ieee754/index.js:
  (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)

buffer/index.js:
  (*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)

safe-buffer/index.js:
  (*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> *)
*/
//# sourceMappingURL=zenfs-browser.js.map
