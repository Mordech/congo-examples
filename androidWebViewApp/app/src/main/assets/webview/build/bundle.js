(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var congoProxy = require("congo-proxy");

var CongoAndroidWebViewInvoker = require("congo-android-webview-js").congoAndroidWebViewInvoker;
var invoker = new CongoAndroidWebViewInvoker("bridge");

var proxy = congoProxy("myService", invoker);
proxy.registerMethod("someMethod");
proxy.registerObservable("streamThatNeverEnds");
proxy.registerObservable("streamThatEnds");

var myService = proxy.build();

myService.someMethod().then(function(result) {
    console.log(result);
})

myService.streamThatNeverEnds()
 .take(5)
 .doOnNext(function(result) {
    console.log(result);
 })
 .doOnCompleted(function() {
     console.log("streamThatNeverEnds: completed");
 })
 .subscribe();

myService.streamThatEnds()
  .doOnNext(function(result) {
     console.log(result);
  })
  .doOnCompleted(function() {
      console.log("streamThatEnds: completed");
  })
  .subscribe();
}).call(this,require("g5I+bs"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_37b802e9.js","/")
},{"buffer":4,"congo-android-webview-js":6,"congo-proxy":7,"g5I+bs":16}],2:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

}).call(this,require("g5I+bs"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/node_modules/base64-js/lib/b64.js","/node_modules/base64-js/lib")
},{"buffer":4,"g5I+bs":16}],3:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/* @preserve
 * The MIT License (MIT)
 * 
 * Copyright (c) 2013-2015 Petka Antonov
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */
/**
 * bluebird build version 3.4.1
 * Features enabled: core, race, call_get, generators, map, nodeify, promisify, props, reduce, settle, some, using, timers, filter, any, each
*/
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Promise=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof _dereq_=="function"&&_dereq_;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof _dereq_=="function"&&_dereq_;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise) {
var SomePromiseArray = Promise._SomePromiseArray;
function any(promises) {
    var ret = new SomePromiseArray(promises);
    var promise = ret.promise();
    ret.setHowMany(1);
    ret.setUnwrap();
    ret.init();
    return promise;
}

Promise.any = function (promises) {
    return any(promises);
};

Promise.prototype.any = function () {
    return any(this);
};

};

},{}],2:[function(_dereq_,module,exports){
"use strict";
var firstLineError;
try {throw new Error(); } catch (e) {firstLineError = e;}
var schedule = _dereq_("./schedule");
var Queue = _dereq_("./queue");
var util = _dereq_("./util");

function Async() {
    this._customScheduler = false;
    this._isTickUsed = false;
    this._lateQueue = new Queue(16);
    this._normalQueue = new Queue(16);
    this._haveDrainedQueues = false;
    this._trampolineEnabled = true;
    var self = this;
    this.drainQueues = function () {
        self._drainQueues();
    };
    this._schedule = schedule;
}

Async.prototype.setScheduler = function(fn) {
    var prev = this._schedule;
    this._schedule = fn;
    this._customScheduler = true;
    return prev;
};

Async.prototype.hasCustomScheduler = function() {
    return this._customScheduler;
};

Async.prototype.enableTrampoline = function() {
    this._trampolineEnabled = true;
};

Async.prototype.disableTrampolineIfNecessary = function() {
    if (util.hasDevTools) {
        this._trampolineEnabled = false;
    }
};

Async.prototype.haveItemsQueued = function () {
    return this._isTickUsed || this._haveDrainedQueues;
};


Async.prototype.fatalError = function(e, isNode) {
    if (isNode) {
        process.stderr.write("Fatal " + (e instanceof Error ? e.stack : e) +
            "\n");
        process.exit(2);
    } else {
        this.throwLater(e);
    }
};

Async.prototype.throwLater = function(fn, arg) {
    if (arguments.length === 1) {
        arg = fn;
        fn = function () { throw arg; };
    }
    if (typeof setTimeout !== "undefined") {
        setTimeout(function() {
            fn(arg);
        }, 0);
    } else try {
        this._schedule(function() {
            fn(arg);
        });
    } catch (e) {
        throw new Error("No async scheduler available\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
};

function AsyncInvokeLater(fn, receiver, arg) {
    this._lateQueue.push(fn, receiver, arg);
    this._queueTick();
}

function AsyncInvoke(fn, receiver, arg) {
    this._normalQueue.push(fn, receiver, arg);
    this._queueTick();
}

function AsyncSettlePromises(promise) {
    this._normalQueue._pushOne(promise);
    this._queueTick();
}

if (!util.hasDevTools) {
    Async.prototype.invokeLater = AsyncInvokeLater;
    Async.prototype.invoke = AsyncInvoke;
    Async.prototype.settlePromises = AsyncSettlePromises;
} else {
    Async.prototype.invokeLater = function (fn, receiver, arg) {
        if (this._trampolineEnabled) {
            AsyncInvokeLater.call(this, fn, receiver, arg);
        } else {
            this._schedule(function() {
                setTimeout(function() {
                    fn.call(receiver, arg);
                }, 100);
            });
        }
    };

    Async.prototype.invoke = function (fn, receiver, arg) {
        if (this._trampolineEnabled) {
            AsyncInvoke.call(this, fn, receiver, arg);
        } else {
            this._schedule(function() {
                fn.call(receiver, arg);
            });
        }
    };

    Async.prototype.settlePromises = function(promise) {
        if (this._trampolineEnabled) {
            AsyncSettlePromises.call(this, promise);
        } else {
            this._schedule(function() {
                promise._settlePromises();
            });
        }
    };
}

Async.prototype.invokeFirst = function (fn, receiver, arg) {
    this._normalQueue.unshift(fn, receiver, arg);
    this._queueTick();
};

Async.prototype._drainQueue = function(queue) {
    while (queue.length() > 0) {
        var fn = queue.shift();
        if (typeof fn !== "function") {
            fn._settlePromises();
            continue;
        }
        var receiver = queue.shift();
        var arg = queue.shift();
        fn.call(receiver, arg);
    }
};

Async.prototype._drainQueues = function () {
    this._drainQueue(this._normalQueue);
    this._reset();
    this._haveDrainedQueues = true;
    this._drainQueue(this._lateQueue);
};

Async.prototype._queueTick = function () {
    if (!this._isTickUsed) {
        this._isTickUsed = true;
        this._schedule(this.drainQueues);
    }
};

Async.prototype._reset = function () {
    this._isTickUsed = false;
};

module.exports = Async;
module.exports.firstLineError = firstLineError;

},{"./queue":26,"./schedule":29,"./util":36}],3:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise, INTERNAL, tryConvertToPromise, debug) {
var calledBind = false;
var rejectThis = function(_, e) {
    this._reject(e);
};

var targetRejected = function(e, context) {
    context.promiseRejectionQueued = true;
    context.bindingPromise._then(rejectThis, rejectThis, null, this, e);
};

var bindingResolved = function(thisArg, context) {
    if (((this._bitField & 50397184) === 0)) {
        this._resolveCallback(context.target);
    }
};

var bindingRejected = function(e, context) {
    if (!context.promiseRejectionQueued) this._reject(e);
};

Promise.prototype.bind = function (thisArg) {
    if (!calledBind) {
        calledBind = true;
        Promise.prototype._propagateFrom = debug.propagateFromFunction();
        Promise.prototype._boundValue = debug.boundValueFunction();
    }
    var maybePromise = tryConvertToPromise(thisArg);
    var ret = new Promise(INTERNAL);
    ret._propagateFrom(this, 1);
    var target = this._target();
    ret._setBoundTo(maybePromise);
    if (maybePromise instanceof Promise) {
        var context = {
            promiseRejectionQueued: false,
            promise: ret,
            target: target,
            bindingPromise: maybePromise
        };
        target._then(INTERNAL, targetRejected, undefined, ret, context);
        maybePromise._then(
            bindingResolved, bindingRejected, undefined, ret, context);
        ret._setOnCancel(maybePromise);
    } else {
        ret._resolveCallback(target);
    }
    return ret;
};

Promise.prototype._setBoundTo = function (obj) {
    if (obj !== undefined) {
        this._bitField = this._bitField | 2097152;
        this._boundTo = obj;
    } else {
        this._bitField = this._bitField & (~2097152);
    }
};

Promise.prototype._isBound = function () {
    return (this._bitField & 2097152) === 2097152;
};

Promise.bind = function (thisArg, value) {
    return Promise.resolve(value).bind(thisArg);
};
};

},{}],4:[function(_dereq_,module,exports){
"use strict";
var old;
if (typeof Promise !== "undefined") old = Promise;
function noConflict() {
    try { if (Promise === bluebird) Promise = old; }
    catch (e) {}
    return bluebird;
}
var bluebird = _dereq_("./promise")();
bluebird.noConflict = noConflict;
module.exports = bluebird;

},{"./promise":22}],5:[function(_dereq_,module,exports){
"use strict";
var cr = Object.create;
if (cr) {
    var callerCache = cr(null);
    var getterCache = cr(null);
    callerCache[" size"] = getterCache[" size"] = 0;
}

module.exports = function(Promise) {
var util = _dereq_("./util");
var canEvaluate = util.canEvaluate;
var isIdentifier = util.isIdentifier;

var getMethodCaller;
var getGetter;
if (!true) {
var makeMethodCaller = function (methodName) {
    return new Function("ensureMethod", "                                    \n\
        return function(obj) {                                               \n\
            'use strict'                                                     \n\
            var len = this.length;                                           \n\
            ensureMethod(obj, 'methodName');                                 \n\
            switch(len) {                                                    \n\
                case 1: return obj.methodName(this[0]);                      \n\
                case 2: return obj.methodName(this[0], this[1]);             \n\
                case 3: return obj.methodName(this[0], this[1], this[2]);    \n\
                case 0: return obj.methodName();                             \n\
                default:                                                     \n\
                    return obj.methodName.apply(obj, this);                  \n\
            }                                                                \n\
        };                                                                   \n\
        ".replace(/methodName/g, methodName))(ensureMethod);
};

var makeGetter = function (propertyName) {
    return new Function("obj", "                                             \n\
        'use strict';                                                        \n\
        return obj.propertyName;                                             \n\
        ".replace("propertyName", propertyName));
};

var getCompiled = function(name, compiler, cache) {
    var ret = cache[name];
    if (typeof ret !== "function") {
        if (!isIdentifier(name)) {
            return null;
        }
        ret = compiler(name);
        cache[name] = ret;
        cache[" size"]++;
        if (cache[" size"] > 512) {
            var keys = Object.keys(cache);
            for (var i = 0; i < 256; ++i) delete cache[keys[i]];
            cache[" size"] = keys.length - 256;
        }
    }
    return ret;
};

getMethodCaller = function(name) {
    return getCompiled(name, makeMethodCaller, callerCache);
};

getGetter = function(name) {
    return getCompiled(name, makeGetter, getterCache);
};
}

function ensureMethod(obj, methodName) {
    var fn;
    if (obj != null) fn = obj[methodName];
    if (typeof fn !== "function") {
        var message = "Object " + util.classString(obj) + " has no method '" +
            util.toString(methodName) + "'";
        throw new Promise.TypeError(message);
    }
    return fn;
}

function caller(obj) {
    var methodName = this.pop();
    var fn = ensureMethod(obj, methodName);
    return fn.apply(obj, this);
}
Promise.prototype.call = function (methodName) {
    var args = [].slice.call(arguments, 1);;
    if (!true) {
        if (canEvaluate) {
            var maybeCaller = getMethodCaller(methodName);
            if (maybeCaller !== null) {
                return this._then(
                    maybeCaller, undefined, undefined, args, undefined);
            }
        }
    }
    args.push(methodName);
    return this._then(caller, undefined, undefined, args, undefined);
};

function namedGetter(obj) {
    return obj[this];
}
function indexedGetter(obj) {
    var index = +this;
    if (index < 0) index = Math.max(0, index + obj.length);
    return obj[index];
}
Promise.prototype.get = function (propertyName) {
    var isIndex = (typeof propertyName === "number");
    var getter;
    if (!isIndex) {
        if (canEvaluate) {
            var maybeGetter = getGetter(propertyName);
            getter = maybeGetter !== null ? maybeGetter : namedGetter;
        } else {
            getter = namedGetter;
        }
    } else {
        getter = indexedGetter;
    }
    return this._then(getter, undefined, undefined, propertyName, undefined);
};
};

},{"./util":36}],6:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise, PromiseArray, apiRejection, debug) {
var util = _dereq_("./util");
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;
var async = Promise._async;

Promise.prototype["break"] = Promise.prototype.cancel = function() {
    if (!debug.cancellation()) return this._warn("cancellation is disabled");

    var promise = this;
    var child = promise;
    while (promise.isCancellable()) {
        if (!promise._cancelBy(child)) {
            if (child._isFollowing()) {
                child._followee().cancel();
            } else {
                child._cancelBranched();
            }
            break;
        }

        var parent = promise._cancellationParent;
        if (parent == null || !parent.isCancellable()) {
            if (promise._isFollowing()) {
                promise._followee().cancel();
            } else {
                promise._cancelBranched();
            }
            break;
        } else {
            if (promise._isFollowing()) promise._followee().cancel();
            child = promise;
            promise = parent;
        }
    }
};

Promise.prototype._branchHasCancelled = function() {
    this._branchesRemainingToCancel--;
};

Promise.prototype._enoughBranchesHaveCancelled = function() {
    return this._branchesRemainingToCancel === undefined ||
           this._branchesRemainingToCancel <= 0;
};

Promise.prototype._cancelBy = function(canceller) {
    if (canceller === this) {
        this._branchesRemainingToCancel = 0;
        this._invokeOnCancel();
        return true;
    } else {
        this._branchHasCancelled();
        if (this._enoughBranchesHaveCancelled()) {
            this._invokeOnCancel();
            return true;
        }
    }
    return false;
};

Promise.prototype._cancelBranched = function() {
    if (this._enoughBranchesHaveCancelled()) {
        this._cancel();
    }
};

Promise.prototype._cancel = function() {
    if (!this.isCancellable()) return;

    this._setCancelled();
    async.invoke(this._cancelPromises, this, undefined);
};

Promise.prototype._cancelPromises = function() {
    if (this._length() > 0) this._settlePromises();
};

Promise.prototype._unsetOnCancel = function() {
    this._onCancelField = undefined;
};

Promise.prototype.isCancellable = function() {
    return this.isPending() && !this.isCancelled();
};

Promise.prototype._doInvokeOnCancel = function(onCancelCallback, internalOnly) {
    if (util.isArray(onCancelCallback)) {
        for (var i = 0; i < onCancelCallback.length; ++i) {
            this._doInvokeOnCancel(onCancelCallback[i], internalOnly);
        }
    } else if (onCancelCallback !== undefined) {
        if (typeof onCancelCallback === "function") {
            if (!internalOnly) {
                var e = tryCatch(onCancelCallback).call(this._boundValue());
                if (e === errorObj) {
                    this._attachExtraTrace(e.e);
                    async.throwLater(e.e);
                }
            }
        } else {
            onCancelCallback._resultCancelled(this);
        }
    }
};

Promise.prototype._invokeOnCancel = function() {
    var onCancelCallback = this._onCancel();
    this._unsetOnCancel();
    async.invoke(this._doInvokeOnCancel, this, onCancelCallback);
};

Promise.prototype._invokeInternalOnCancel = function() {
    if (this.isCancellable()) {
        this._doInvokeOnCancel(this._onCancel(), true);
        this._unsetOnCancel();
    }
};

Promise.prototype._resultCancelled = function() {
    this.cancel();
};

};

},{"./util":36}],7:[function(_dereq_,module,exports){
"use strict";
module.exports = function(NEXT_FILTER) {
var util = _dereq_("./util");
var getKeys = _dereq_("./es5").keys;
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;

function catchFilter(instances, cb, promise) {
    return function(e) {
        var boundTo = promise._boundValue();
        predicateLoop: for (var i = 0; i < instances.length; ++i) {
            var item = instances[i];

            if (item === Error ||
                (item != null && item.prototype instanceof Error)) {
                if (e instanceof item) {
                    return tryCatch(cb).call(boundTo, e);
                }
            } else if (typeof item === "function") {
                var matchesPredicate = tryCatch(item).call(boundTo, e);
                if (matchesPredicate === errorObj) {
                    return matchesPredicate;
                } else if (matchesPredicate) {
                    return tryCatch(cb).call(boundTo, e);
                }
            } else if (util.isObject(e)) {
                var keys = getKeys(item);
                for (var j = 0; j < keys.length; ++j) {
                    var key = keys[j];
                    if (item[key] != e[key]) {
                        continue predicateLoop;
                    }
                }
                return tryCatch(cb).call(boundTo, e);
            }
        }
        return NEXT_FILTER;
    };
}

return catchFilter;
};

},{"./es5":13,"./util":36}],8:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise) {
var longStackTraces = false;
var contextStack = [];

Promise.prototype._promiseCreated = function() {};
Promise.prototype._pushContext = function() {};
Promise.prototype._popContext = function() {return null;};
Promise._peekContext = Promise.prototype._peekContext = function() {};

function Context() {
    this._trace = new Context.CapturedTrace(peekContext());
}
Context.prototype._pushContext = function () {
    if (this._trace !== undefined) {
        this._trace._promiseCreated = null;
        contextStack.push(this._trace);
    }
};

Context.prototype._popContext = function () {
    if (this._trace !== undefined) {
        var trace = contextStack.pop();
        var ret = trace._promiseCreated;
        trace._promiseCreated = null;
        return ret;
    }
    return null;
};

function createContext() {
    if (longStackTraces) return new Context();
}

function peekContext() {
    var lastIndex = contextStack.length - 1;
    if (lastIndex >= 0) {
        return contextStack[lastIndex];
    }
    return undefined;
}
Context.CapturedTrace = null;
Context.create = createContext;
Context.deactivateLongStackTraces = function() {};
Context.activateLongStackTraces = function() {
    var Promise_pushContext = Promise.prototype._pushContext;
    var Promise_popContext = Promise.prototype._popContext;
    var Promise_PeekContext = Promise._peekContext;
    var Promise_peekContext = Promise.prototype._peekContext;
    var Promise_promiseCreated = Promise.prototype._promiseCreated;
    Context.deactivateLongStackTraces = function() {
        Promise.prototype._pushContext = Promise_pushContext;
        Promise.prototype._popContext = Promise_popContext;
        Promise._peekContext = Promise_PeekContext;
        Promise.prototype._peekContext = Promise_peekContext;
        Promise.prototype._promiseCreated = Promise_promiseCreated;
        longStackTraces = false;
    };
    longStackTraces = true;
    Promise.prototype._pushContext = Context.prototype._pushContext;
    Promise.prototype._popContext = Context.prototype._popContext;
    Promise._peekContext = Promise.prototype._peekContext = peekContext;
    Promise.prototype._promiseCreated = function() {
        var ctx = this._peekContext();
        if (ctx && ctx._promiseCreated == null) ctx._promiseCreated = this;
    };
};
return Context;
};

},{}],9:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise, Context) {
var getDomain = Promise._getDomain;
var async = Promise._async;
var Warning = _dereq_("./errors").Warning;
var util = _dereq_("./util");
var canAttachTrace = util.canAttachTrace;
var unhandledRejectionHandled;
var possiblyUnhandledRejection;
var bluebirdFramePattern =
    /[\\\/]bluebird[\\\/]js[\\\/](release|debug|instrumented)/;
var stackFramePattern = null;
var formatStack = null;
var indentStackFrames = false;
var printWarning;
var debugging = !!(util.env("BLUEBIRD_DEBUG") != 0 &&
                        (true ||
                         util.env("BLUEBIRD_DEBUG") ||
                         util.env("NODE_ENV") === "development"));

var warnings = !!(util.env("BLUEBIRD_WARNINGS") != 0 &&
    (debugging || util.env("BLUEBIRD_WARNINGS")));

var longStackTraces = !!(util.env("BLUEBIRD_LONG_STACK_TRACES") != 0 &&
    (debugging || util.env("BLUEBIRD_LONG_STACK_TRACES")));

var wForgottenReturn = util.env("BLUEBIRD_W_FORGOTTEN_RETURN") != 0 &&
    (warnings || !!util.env("BLUEBIRD_W_FORGOTTEN_RETURN"));

Promise.prototype.suppressUnhandledRejections = function() {
    var target = this._target();
    target._bitField = ((target._bitField & (~1048576)) |
                      524288);
};

Promise.prototype._ensurePossibleRejectionHandled = function () {
    if ((this._bitField & 524288) !== 0) return;
    this._setRejectionIsUnhandled();
    async.invokeLater(this._notifyUnhandledRejection, this, undefined);
};

Promise.prototype._notifyUnhandledRejectionIsHandled = function () {
    fireRejectionEvent("rejectionHandled",
                                  unhandledRejectionHandled, undefined, this);
};

Promise.prototype._setReturnedNonUndefined = function() {
    this._bitField = this._bitField | 268435456;
};

Promise.prototype._returnedNonUndefined = function() {
    return (this._bitField & 268435456) !== 0;
};

Promise.prototype._notifyUnhandledRejection = function () {
    if (this._isRejectionUnhandled()) {
        var reason = this._settledValue();
        this._setUnhandledRejectionIsNotified();
        fireRejectionEvent("unhandledRejection",
                                      possiblyUnhandledRejection, reason, this);
    }
};

Promise.prototype._setUnhandledRejectionIsNotified = function () {
    this._bitField = this._bitField | 262144;
};

Promise.prototype._unsetUnhandledRejectionIsNotified = function () {
    this._bitField = this._bitField & (~262144);
};

Promise.prototype._isUnhandledRejectionNotified = function () {
    return (this._bitField & 262144) > 0;
};

Promise.prototype._setRejectionIsUnhandled = function () {
    this._bitField = this._bitField | 1048576;
};

Promise.prototype._unsetRejectionIsUnhandled = function () {
    this._bitField = this._bitField & (~1048576);
    if (this._isUnhandledRejectionNotified()) {
        this._unsetUnhandledRejectionIsNotified();
        this._notifyUnhandledRejectionIsHandled();
    }
};

Promise.prototype._isRejectionUnhandled = function () {
    return (this._bitField & 1048576) > 0;
};

Promise.prototype._warn = function(message, shouldUseOwnTrace, promise) {
    return warn(message, shouldUseOwnTrace, promise || this);
};

Promise.onPossiblyUnhandledRejection = function (fn) {
    var domain = getDomain();
    possiblyUnhandledRejection =
        typeof fn === "function" ? (domain === null ? fn : domain.bind(fn))
                                 : undefined;
};

Promise.onUnhandledRejectionHandled = function (fn) {
    var domain = getDomain();
    unhandledRejectionHandled =
        typeof fn === "function" ? (domain === null ? fn : domain.bind(fn))
                                 : undefined;
};

var disableLongStackTraces = function() {};
Promise.longStackTraces = function () {
    if (async.haveItemsQueued() && !config.longStackTraces) {
        throw new Error("cannot enable long stack traces after promises have been created\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    if (!config.longStackTraces && longStackTracesIsSupported()) {
        var Promise_captureStackTrace = Promise.prototype._captureStackTrace;
        var Promise_attachExtraTrace = Promise.prototype._attachExtraTrace;
        config.longStackTraces = true;
        disableLongStackTraces = function() {
            if (async.haveItemsQueued() && !config.longStackTraces) {
                throw new Error("cannot enable long stack traces after promises have been created\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
            }
            Promise.prototype._captureStackTrace = Promise_captureStackTrace;
            Promise.prototype._attachExtraTrace = Promise_attachExtraTrace;
            Context.deactivateLongStackTraces();
            async.enableTrampoline();
            config.longStackTraces = false;
        };
        Promise.prototype._captureStackTrace = longStackTracesCaptureStackTrace;
        Promise.prototype._attachExtraTrace = longStackTracesAttachExtraTrace;
        Context.activateLongStackTraces();
        async.disableTrampolineIfNecessary();
    }
};

Promise.hasLongStackTraces = function () {
    return config.longStackTraces && longStackTracesIsSupported();
};

var fireDomEvent = (function() {
    try {
        var event = document.createEvent("CustomEvent");
        event.initCustomEvent("testingtheevent", false, true, {});
        util.global.dispatchEvent(event);
        return function(name, event) {
            var domEvent = document.createEvent("CustomEvent");
            domEvent.initCustomEvent(name.toLowerCase(), false, true, event);
            return !util.global.dispatchEvent(domEvent);
        };
    } catch (e) {}
    return function() {
        return false;
    };
})();

var fireGlobalEvent = (function() {
    if (util.isNode) {
        return function() {
            return process.emit.apply(process, arguments);
        };
    } else {
        if (!util.global) {
            return function() {
                return false;
            };
        }
        return function(name) {
            var methodName = "on" + name.toLowerCase();
            var method = util.global[methodName];
            if (!method) return false;
            method.apply(util.global, [].slice.call(arguments, 1));
            return true;
        };
    }
})();

function generatePromiseLifecycleEventObject(name, promise) {
    return {promise: promise};
}

var eventToObjectGenerator = {
    promiseCreated: generatePromiseLifecycleEventObject,
    promiseFulfilled: generatePromiseLifecycleEventObject,
    promiseRejected: generatePromiseLifecycleEventObject,
    promiseResolved: generatePromiseLifecycleEventObject,
    promiseCancelled: generatePromiseLifecycleEventObject,
    promiseChained: function(name, promise, child) {
        return {promise: promise, child: child};
    },
    warning: function(name, warning) {
        return {warning: warning};
    },
    unhandledRejection: function (name, reason, promise) {
        return {reason: reason, promise: promise};
    },
    rejectionHandled: generatePromiseLifecycleEventObject
};

var activeFireEvent = function (name) {
    var globalEventFired = false;
    try {
        globalEventFired = fireGlobalEvent.apply(null, arguments);
    } catch (e) {
        async.throwLater(e);
        globalEventFired = true;
    }

    var domEventFired = false;
    try {
        domEventFired = fireDomEvent(name,
                    eventToObjectGenerator[name].apply(null, arguments));
    } catch (e) {
        async.throwLater(e);
        domEventFired = true;
    }

    return domEventFired || globalEventFired;
};

Promise.config = function(opts) {
    opts = Object(opts);
    if ("longStackTraces" in opts) {
        if (opts.longStackTraces) {
            Promise.longStackTraces();
        } else if (!opts.longStackTraces && Promise.hasLongStackTraces()) {
            disableLongStackTraces();
        }
    }
    if ("warnings" in opts) {
        var warningsOption = opts.warnings;
        config.warnings = !!warningsOption;
        wForgottenReturn = config.warnings;

        if (util.isObject(warningsOption)) {
            if ("wForgottenReturn" in warningsOption) {
                wForgottenReturn = !!warningsOption.wForgottenReturn;
            }
        }
    }
    if ("cancellation" in opts && opts.cancellation && !config.cancellation) {
        if (async.haveItemsQueued()) {
            throw new Error(
                "cannot enable cancellation after promises are in use");
        }
        Promise.prototype._clearCancellationData =
            cancellationClearCancellationData;
        Promise.prototype._propagateFrom = cancellationPropagateFrom;
        Promise.prototype._onCancel = cancellationOnCancel;
        Promise.prototype._setOnCancel = cancellationSetOnCancel;
        Promise.prototype._attachCancellationCallback =
            cancellationAttachCancellationCallback;
        Promise.prototype._execute = cancellationExecute;
        propagateFromFunction = cancellationPropagateFrom;
        config.cancellation = true;
    }
    if ("monitoring" in opts) {
        if (opts.monitoring && !config.monitoring) {
            config.monitoring = true;
            Promise.prototype._fireEvent = activeFireEvent;
        } else if (!opts.monitoring && config.monitoring) {
            config.monitoring = false;
            Promise.prototype._fireEvent = defaultFireEvent;
        }
    }
};

function defaultFireEvent() { return false; }

Promise.prototype._fireEvent = defaultFireEvent;
Promise.prototype._execute = function(executor, resolve, reject) {
    try {
        executor(resolve, reject);
    } catch (e) {
        return e;
    }
};
Promise.prototype._onCancel = function () {};
Promise.prototype._setOnCancel = function (handler) { ; };
Promise.prototype._attachCancellationCallback = function(onCancel) {
    ;
};
Promise.prototype._captureStackTrace = function () {};
Promise.prototype._attachExtraTrace = function () {};
Promise.prototype._clearCancellationData = function() {};
Promise.prototype._propagateFrom = function (parent, flags) {
    ;
    ;
};

function cancellationExecute(executor, resolve, reject) {
    var promise = this;
    try {
        executor(resolve, reject, function(onCancel) {
            if (typeof onCancel !== "function") {
                throw new TypeError("onCancel must be a function, got: " +
                                    util.toString(onCancel));
            }
            promise._attachCancellationCallback(onCancel);
        });
    } catch (e) {
        return e;
    }
}

function cancellationAttachCancellationCallback(onCancel) {
    if (!this.isCancellable()) return this;

    var previousOnCancel = this._onCancel();
    if (previousOnCancel !== undefined) {
        if (util.isArray(previousOnCancel)) {
            previousOnCancel.push(onCancel);
        } else {
            this._setOnCancel([previousOnCancel, onCancel]);
        }
    } else {
        this._setOnCancel(onCancel);
    }
}

function cancellationOnCancel() {
    return this._onCancelField;
}

function cancellationSetOnCancel(onCancel) {
    this._onCancelField = onCancel;
}

function cancellationClearCancellationData() {
    this._cancellationParent = undefined;
    this._onCancelField = undefined;
}

function cancellationPropagateFrom(parent, flags) {
    if ((flags & 1) !== 0) {
        this._cancellationParent = parent;
        var branchesRemainingToCancel = parent._branchesRemainingToCancel;
        if (branchesRemainingToCancel === undefined) {
            branchesRemainingToCancel = 0;
        }
        parent._branchesRemainingToCancel = branchesRemainingToCancel + 1;
    }
    if ((flags & 2) !== 0 && parent._isBound()) {
        this._setBoundTo(parent._boundTo);
    }
}

function bindingPropagateFrom(parent, flags) {
    if ((flags & 2) !== 0 && parent._isBound()) {
        this._setBoundTo(parent._boundTo);
    }
}
var propagateFromFunction = bindingPropagateFrom;

function boundValueFunction() {
    var ret = this._boundTo;
    if (ret !== undefined) {
        if (ret instanceof Promise) {
            if (ret.isFulfilled()) {
                return ret.value();
            } else {
                return undefined;
            }
        }
    }
    return ret;
}

function longStackTracesCaptureStackTrace() {
    this._trace = new CapturedTrace(this._peekContext());
}

function longStackTracesAttachExtraTrace(error, ignoreSelf) {
    if (canAttachTrace(error)) {
        var trace = this._trace;
        if (trace !== undefined) {
            if (ignoreSelf) trace = trace._parent;
        }
        if (trace !== undefined) {
            trace.attachExtraTrace(error);
        } else if (!error.__stackCleaned__) {
            var parsed = parseStackAndMessage(error);
            util.notEnumerableProp(error, "stack",
                parsed.message + "\n" + parsed.stack.join("\n"));
            util.notEnumerableProp(error, "__stackCleaned__", true);
        }
    }
}

function checkForgottenReturns(returnValue, promiseCreated, name, promise,
                               parent) {
    if (returnValue === undefined && promiseCreated !== null &&
        wForgottenReturn) {
        if (parent !== undefined && parent._returnedNonUndefined()) return;
        if ((promise._bitField & 65535) === 0) return;

        if (name) name = name + " ";
        var msg = "a promise was created in a " + name +
            "handler but was not returned from it";
        promise._warn(msg, true, promiseCreated);
    }
}

function deprecated(name, replacement) {
    var message = name +
        " is deprecated and will be removed in a future version.";
    if (replacement) message += " Use " + replacement + " instead.";
    return warn(message);
}

function warn(message, shouldUseOwnTrace, promise) {
    if (!config.warnings) return;
    var warning = new Warning(message);
    var ctx;
    if (shouldUseOwnTrace) {
        promise._attachExtraTrace(warning);
    } else if (config.longStackTraces && (ctx = Promise._peekContext())) {
        ctx.attachExtraTrace(warning);
    } else {
        var parsed = parseStackAndMessage(warning);
        warning.stack = parsed.message + "\n" + parsed.stack.join("\n");
    }

    if (!activeFireEvent("warning", warning)) {
        formatAndLogError(warning, "", true);
    }
}

function reconstructStack(message, stacks) {
    for (var i = 0; i < stacks.length - 1; ++i) {
        stacks[i].push("From previous event:");
        stacks[i] = stacks[i].join("\n");
    }
    if (i < stacks.length) {
        stacks[i] = stacks[i].join("\n");
    }
    return message + "\n" + stacks.join("\n");
}

function removeDuplicateOrEmptyJumps(stacks) {
    for (var i = 0; i < stacks.length; ++i) {
        if (stacks[i].length === 0 ||
            ((i + 1 < stacks.length) && stacks[i][0] === stacks[i+1][0])) {
            stacks.splice(i, 1);
            i--;
        }
    }
}

function removeCommonRoots(stacks) {
    var current = stacks[0];
    for (var i = 1; i < stacks.length; ++i) {
        var prev = stacks[i];
        var currentLastIndex = current.length - 1;
        var currentLastLine = current[currentLastIndex];
        var commonRootMeetPoint = -1;

        for (var j = prev.length - 1; j >= 0; --j) {
            if (prev[j] === currentLastLine) {
                commonRootMeetPoint = j;
                break;
            }
        }

        for (var j = commonRootMeetPoint; j >= 0; --j) {
            var line = prev[j];
            if (current[currentLastIndex] === line) {
                current.pop();
                currentLastIndex--;
            } else {
                break;
            }
        }
        current = prev;
    }
}

function cleanStack(stack) {
    var ret = [];
    for (var i = 0; i < stack.length; ++i) {
        var line = stack[i];
        var isTraceLine = "    (No stack trace)" === line ||
            stackFramePattern.test(line);
        var isInternalFrame = isTraceLine && shouldIgnore(line);
        if (isTraceLine && !isInternalFrame) {
            if (indentStackFrames && line.charAt(0) !== " ") {
                line = "    " + line;
            }
            ret.push(line);
        }
    }
    return ret;
}

function stackFramesAsArray(error) {
    var stack = error.stack.replace(/\s+$/g, "").split("\n");
    for (var i = 0; i < stack.length; ++i) {
        var line = stack[i];
        if ("    (No stack trace)" === line || stackFramePattern.test(line)) {
            break;
        }
    }
    if (i > 0) {
        stack = stack.slice(i);
    }
    return stack;
}

function parseStackAndMessage(error) {
    var stack = error.stack;
    var message = error.toString();
    stack = typeof stack === "string" && stack.length > 0
                ? stackFramesAsArray(error) : ["    (No stack trace)"];
    return {
        message: message,
        stack: cleanStack(stack)
    };
}

function formatAndLogError(error, title, isSoft) {
    if (typeof console !== "undefined") {
        var message;
        if (util.isObject(error)) {
            var stack = error.stack;
            message = title + formatStack(stack, error);
        } else {
            message = title + String(error);
        }
        if (typeof printWarning === "function") {
            printWarning(message, isSoft);
        } else if (typeof console.log === "function" ||
            typeof console.log === "object") {
            console.log(message);
        }
    }
}

function fireRejectionEvent(name, localHandler, reason, promise) {
    var localEventFired = false;
    try {
        if (typeof localHandler === "function") {
            localEventFired = true;
            if (name === "rejectionHandled") {
                localHandler(promise);
            } else {
                localHandler(reason, promise);
            }
        }
    } catch (e) {
        async.throwLater(e);
    }

    if (name === "unhandledRejection") {
        if (!activeFireEvent(name, reason, promise) && !localEventFired) {
            formatAndLogError(reason, "Unhandled rejection ");
        }
    } else {
        activeFireEvent(name, promise);
    }
}

function formatNonError(obj) {
    var str;
    if (typeof obj === "function") {
        str = "[function " +
            (obj.name || "anonymous") +
            "]";
    } else {
        str = obj && typeof obj.toString === "function"
            ? obj.toString() : util.toString(obj);
        var ruselessToString = /\[object [a-zA-Z0-9$_]+\]/;
        if (ruselessToString.test(str)) {
            try {
                var newStr = JSON.stringify(obj);
                str = newStr;
            }
            catch(e) {

            }
        }
        if (str.length === 0) {
            str = "(empty array)";
        }
    }
    return ("(<" + snip(str) + ">, no stack trace)");
}

function snip(str) {
    var maxChars = 41;
    if (str.length < maxChars) {
        return str;
    }
    return str.substr(0, maxChars - 3) + "...";
}

function longStackTracesIsSupported() {
    return typeof captureStackTrace === "function";
}

var shouldIgnore = function() { return false; };
var parseLineInfoRegex = /[\/<\(]([^:\/]+):(\d+):(?:\d+)\)?\s*$/;
function parseLineInfo(line) {
    var matches = line.match(parseLineInfoRegex);
    if (matches) {
        return {
            fileName: matches[1],
            line: parseInt(matches[2], 10)
        };
    }
}

function setBounds(firstLineError, lastLineError) {
    if (!longStackTracesIsSupported()) return;
    var firstStackLines = firstLineError.stack.split("\n");
    var lastStackLines = lastLineError.stack.split("\n");
    var firstIndex = -1;
    var lastIndex = -1;
    var firstFileName;
    var lastFileName;
    for (var i = 0; i < firstStackLines.length; ++i) {
        var result = parseLineInfo(firstStackLines[i]);
        if (result) {
            firstFileName = result.fileName;
            firstIndex = result.line;
            break;
        }
    }
    for (var i = 0; i < lastStackLines.length; ++i) {
        var result = parseLineInfo(lastStackLines[i]);
        if (result) {
            lastFileName = result.fileName;
            lastIndex = result.line;
            break;
        }
    }
    if (firstIndex < 0 || lastIndex < 0 || !firstFileName || !lastFileName ||
        firstFileName !== lastFileName || firstIndex >= lastIndex) {
        return;
    }

    shouldIgnore = function(line) {
        if (bluebirdFramePattern.test(line)) return true;
        var info = parseLineInfo(line);
        if (info) {
            if (info.fileName === firstFileName &&
                (firstIndex <= info.line && info.line <= lastIndex)) {
                return true;
            }
        }
        return false;
    };
}

function CapturedTrace(parent) {
    this._parent = parent;
    this._promisesCreated = 0;
    var length = this._length = 1 + (parent === undefined ? 0 : parent._length);
    captureStackTrace(this, CapturedTrace);
    if (length > 32) this.uncycle();
}
util.inherits(CapturedTrace, Error);
Context.CapturedTrace = CapturedTrace;

CapturedTrace.prototype.uncycle = function() {
    var length = this._length;
    if (length < 2) return;
    var nodes = [];
    var stackToIndex = {};

    for (var i = 0, node = this; node !== undefined; ++i) {
        nodes.push(node);
        node = node._parent;
    }
    length = this._length = i;
    for (var i = length - 1; i >= 0; --i) {
        var stack = nodes[i].stack;
        if (stackToIndex[stack] === undefined) {
            stackToIndex[stack] = i;
        }
    }
    for (var i = 0; i < length; ++i) {
        var currentStack = nodes[i].stack;
        var index = stackToIndex[currentStack];
        if (index !== undefined && index !== i) {
            if (index > 0) {
                nodes[index - 1]._parent = undefined;
                nodes[index - 1]._length = 1;
            }
            nodes[i]._parent = undefined;
            nodes[i]._length = 1;
            var cycleEdgeNode = i > 0 ? nodes[i - 1] : this;

            if (index < length - 1) {
                cycleEdgeNode._parent = nodes[index + 1];
                cycleEdgeNode._parent.uncycle();
                cycleEdgeNode._length =
                    cycleEdgeNode._parent._length + 1;
            } else {
                cycleEdgeNode._parent = undefined;
                cycleEdgeNode._length = 1;
            }
            var currentChildLength = cycleEdgeNode._length + 1;
            for (var j = i - 2; j >= 0; --j) {
                nodes[j]._length = currentChildLength;
                currentChildLength++;
            }
            return;
        }
    }
};

CapturedTrace.prototype.attachExtraTrace = function(error) {
    if (error.__stackCleaned__) return;
    this.uncycle();
    var parsed = parseStackAndMessage(error);
    var message = parsed.message;
    var stacks = [parsed.stack];

    var trace = this;
    while (trace !== undefined) {
        stacks.push(cleanStack(trace.stack.split("\n")));
        trace = trace._parent;
    }
    removeCommonRoots(stacks);
    removeDuplicateOrEmptyJumps(stacks);
    util.notEnumerableProp(error, "stack", reconstructStack(message, stacks));
    util.notEnumerableProp(error, "__stackCleaned__", true);
};

var captureStackTrace = (function stackDetection() {
    var v8stackFramePattern = /^\s*at\s*/;
    var v8stackFormatter = function(stack, error) {
        if (typeof stack === "string") return stack;

        if (error.name !== undefined &&
            error.message !== undefined) {
            return error.toString();
        }
        return formatNonError(error);
    };

    if (typeof Error.stackTraceLimit === "number" &&
        typeof Error.captureStackTrace === "function") {
        Error.stackTraceLimit += 6;
        stackFramePattern = v8stackFramePattern;
        formatStack = v8stackFormatter;
        var captureStackTrace = Error.captureStackTrace;

        shouldIgnore = function(line) {
            return bluebirdFramePattern.test(line);
        };
        return function(receiver, ignoreUntil) {
            Error.stackTraceLimit += 6;
            captureStackTrace(receiver, ignoreUntil);
            Error.stackTraceLimit -= 6;
        };
    }
    var err = new Error();

    if (typeof err.stack === "string" &&
        err.stack.split("\n")[0].indexOf("stackDetection@") >= 0) {
        stackFramePattern = /@/;
        formatStack = v8stackFormatter;
        indentStackFrames = true;
        return function captureStackTrace(o) {
            o.stack = new Error().stack;
        };
    }

    var hasStackAfterThrow;
    try { throw new Error(); }
    catch(e) {
        hasStackAfterThrow = ("stack" in e);
    }
    if (!("stack" in err) && hasStackAfterThrow &&
        typeof Error.stackTraceLimit === "number") {
        stackFramePattern = v8stackFramePattern;
        formatStack = v8stackFormatter;
        return function captureStackTrace(o) {
            Error.stackTraceLimit += 6;
            try { throw new Error(); }
            catch(e) { o.stack = e.stack; }
            Error.stackTraceLimit -= 6;
        };
    }

    formatStack = function(stack, error) {
        if (typeof stack === "string") return stack;

        if ((typeof error === "object" ||
            typeof error === "function") &&
            error.name !== undefined &&
            error.message !== undefined) {
            return error.toString();
        }
        return formatNonError(error);
    };

    return null;

})([]);

if (typeof console !== "undefined" && typeof console.warn !== "undefined") {
    printWarning = function (message) {
        console.warn(message);
    };
    if (util.isNode && process.stderr.isTTY) {
        printWarning = function(message, isSoft) {
            var color = isSoft ? "\u001b[33m" : "\u001b[31m";
            console.warn(color + message + "\u001b[0m\n");
        };
    } else if (!util.isNode && typeof (new Error().stack) === "string") {
        printWarning = function(message, isSoft) {
            console.warn("%c" + message,
                        isSoft ? "color: darkorange" : "color: red");
        };
    }
}

var config = {
    warnings: warnings,
    longStackTraces: false,
    cancellation: false,
    monitoring: false
};

if (longStackTraces) Promise.longStackTraces();

return {
    longStackTraces: function() {
        return config.longStackTraces;
    },
    warnings: function() {
        return config.warnings;
    },
    cancellation: function() {
        return config.cancellation;
    },
    monitoring: function() {
        return config.monitoring;
    },
    propagateFromFunction: function() {
        return propagateFromFunction;
    },
    boundValueFunction: function() {
        return boundValueFunction;
    },
    checkForgottenReturns: checkForgottenReturns,
    setBounds: setBounds,
    warn: warn,
    deprecated: deprecated,
    CapturedTrace: CapturedTrace,
    fireDomEvent: fireDomEvent,
    fireGlobalEvent: fireGlobalEvent
};
};

},{"./errors":12,"./util":36}],10:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise) {
function returner() {
    return this.value;
}
function thrower() {
    throw this.reason;
}

Promise.prototype["return"] =
Promise.prototype.thenReturn = function (value) {
    if (value instanceof Promise) value.suppressUnhandledRejections();
    return this._then(
        returner, undefined, undefined, {value: value}, undefined);
};

Promise.prototype["throw"] =
Promise.prototype.thenThrow = function (reason) {
    return this._then(
        thrower, undefined, undefined, {reason: reason}, undefined);
};

Promise.prototype.catchThrow = function (reason) {
    if (arguments.length <= 1) {
        return this._then(
            undefined, thrower, undefined, {reason: reason}, undefined);
    } else {
        var _reason = arguments[1];
        var handler = function() {throw _reason;};
        return this.caught(reason, handler);
    }
};

Promise.prototype.catchReturn = function (value) {
    if (arguments.length <= 1) {
        if (value instanceof Promise) value.suppressUnhandledRejections();
        return this._then(
            undefined, returner, undefined, {value: value}, undefined);
    } else {
        var _value = arguments[1];
        if (_value instanceof Promise) _value.suppressUnhandledRejections();
        var handler = function() {return _value;};
        return this.caught(value, handler);
    }
};
};

},{}],11:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise, INTERNAL) {
var PromiseReduce = Promise.reduce;
var PromiseAll = Promise.all;

function promiseAllThis() {
    return PromiseAll(this);
}

function PromiseMapSeries(promises, fn) {
    return PromiseReduce(promises, fn, INTERNAL, INTERNAL);
}

Promise.prototype.each = function (fn) {
    return this.mapSeries(fn)
            ._then(promiseAllThis, undefined, undefined, this, undefined);
};

Promise.prototype.mapSeries = function (fn) {
    return PromiseReduce(this, fn, INTERNAL, INTERNAL);
};

Promise.each = function (promises, fn) {
    return PromiseMapSeries(promises, fn)
            ._then(promiseAllThis, undefined, undefined, promises, undefined);
};

Promise.mapSeries = PromiseMapSeries;
};

},{}],12:[function(_dereq_,module,exports){
"use strict";
var es5 = _dereq_("./es5");
var Objectfreeze = es5.freeze;
var util = _dereq_("./util");
var inherits = util.inherits;
var notEnumerableProp = util.notEnumerableProp;

function subError(nameProperty, defaultMessage) {
    function SubError(message) {
        if (!(this instanceof SubError)) return new SubError(message);
        notEnumerableProp(this, "message",
            typeof message === "string" ? message : defaultMessage);
        notEnumerableProp(this, "name", nameProperty);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        } else {
            Error.call(this);
        }
    }
    inherits(SubError, Error);
    return SubError;
}

var _TypeError, _RangeError;
var Warning = subError("Warning", "warning");
var CancellationError = subError("CancellationError", "cancellation error");
var TimeoutError = subError("TimeoutError", "timeout error");
var AggregateError = subError("AggregateError", "aggregate error");
try {
    _TypeError = TypeError;
    _RangeError = RangeError;
} catch(e) {
    _TypeError = subError("TypeError", "type error");
    _RangeError = subError("RangeError", "range error");
}

var methods = ("join pop push shift unshift slice filter forEach some " +
    "every map indexOf lastIndexOf reduce reduceRight sort reverse").split(" ");

for (var i = 0; i < methods.length; ++i) {
    if (typeof Array.prototype[methods[i]] === "function") {
        AggregateError.prototype[methods[i]] = Array.prototype[methods[i]];
    }
}

es5.defineProperty(AggregateError.prototype, "length", {
    value: 0,
    configurable: false,
    writable: true,
    enumerable: true
});
AggregateError.prototype["isOperational"] = true;
var level = 0;
AggregateError.prototype.toString = function() {
    var indent = Array(level * 4 + 1).join(" ");
    var ret = "\n" + indent + "AggregateError of:" + "\n";
    level++;
    indent = Array(level * 4 + 1).join(" ");
    for (var i = 0; i < this.length; ++i) {
        var str = this[i] === this ? "[Circular AggregateError]" : this[i] + "";
        var lines = str.split("\n");
        for (var j = 0; j < lines.length; ++j) {
            lines[j] = indent + lines[j];
        }
        str = lines.join("\n");
        ret += str + "\n";
    }
    level--;
    return ret;
};

function OperationalError(message) {
    if (!(this instanceof OperationalError))
        return new OperationalError(message);
    notEnumerableProp(this, "name", "OperationalError");
    notEnumerableProp(this, "message", message);
    this.cause = message;
    this["isOperational"] = true;

    if (message instanceof Error) {
        notEnumerableProp(this, "message", message.message);
        notEnumerableProp(this, "stack", message.stack);
    } else if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
    }

}
inherits(OperationalError, Error);

var errorTypes = Error["__BluebirdErrorTypes__"];
if (!errorTypes) {
    errorTypes = Objectfreeze({
        CancellationError: CancellationError,
        TimeoutError: TimeoutError,
        OperationalError: OperationalError,
        RejectionError: OperationalError,
        AggregateError: AggregateError
    });
    es5.defineProperty(Error, "__BluebirdErrorTypes__", {
        value: errorTypes,
        writable: false,
        enumerable: false,
        configurable: false
    });
}

module.exports = {
    Error: Error,
    TypeError: _TypeError,
    RangeError: _RangeError,
    CancellationError: errorTypes.CancellationError,
    OperationalError: errorTypes.OperationalError,
    TimeoutError: errorTypes.TimeoutError,
    AggregateError: errorTypes.AggregateError,
    Warning: Warning
};

},{"./es5":13,"./util":36}],13:[function(_dereq_,module,exports){
var isES5 = (function(){
    "use strict";
    return this === undefined;
})();

if (isES5) {
    module.exports = {
        freeze: Object.freeze,
        defineProperty: Object.defineProperty,
        getDescriptor: Object.getOwnPropertyDescriptor,
        keys: Object.keys,
        names: Object.getOwnPropertyNames,
        getPrototypeOf: Object.getPrototypeOf,
        isArray: Array.isArray,
        isES5: isES5,
        propertyIsWritable: function(obj, prop) {
            var descriptor = Object.getOwnPropertyDescriptor(obj, prop);
            return !!(!descriptor || descriptor.writable || descriptor.set);
        }
    };
} else {
    var has = {}.hasOwnProperty;
    var str = {}.toString;
    var proto = {}.constructor.prototype;

    var ObjectKeys = function (o) {
        var ret = [];
        for (var key in o) {
            if (has.call(o, key)) {
                ret.push(key);
            }
        }
        return ret;
    };

    var ObjectGetDescriptor = function(o, key) {
        return {value: o[key]};
    };

    var ObjectDefineProperty = function (o, key, desc) {
        o[key] = desc.value;
        return o;
    };

    var ObjectFreeze = function (obj) {
        return obj;
    };

    var ObjectGetPrototypeOf = function (obj) {
        try {
            return Object(obj).constructor.prototype;
        }
        catch (e) {
            return proto;
        }
    };

    var ArrayIsArray = function (obj) {
        try {
            return str.call(obj) === "[object Array]";
        }
        catch(e) {
            return false;
        }
    };

    module.exports = {
        isArray: ArrayIsArray,
        keys: ObjectKeys,
        names: ObjectKeys,
        defineProperty: ObjectDefineProperty,
        getDescriptor: ObjectGetDescriptor,
        freeze: ObjectFreeze,
        getPrototypeOf: ObjectGetPrototypeOf,
        isES5: isES5,
        propertyIsWritable: function() {
            return true;
        }
    };
}

},{}],14:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise, INTERNAL) {
var PromiseMap = Promise.map;

Promise.prototype.filter = function (fn, options) {
    return PromiseMap(this, fn, options, INTERNAL);
};

Promise.filter = function (promises, fn, options) {
    return PromiseMap(promises, fn, options, INTERNAL);
};
};

},{}],15:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise, tryConvertToPromise) {
var util = _dereq_("./util");
var CancellationError = Promise.CancellationError;
var errorObj = util.errorObj;

function PassThroughHandlerContext(promise, type, handler) {
    this.promise = promise;
    this.type = type;
    this.handler = handler;
    this.called = false;
    this.cancelPromise = null;
}

PassThroughHandlerContext.prototype.isFinallyHandler = function() {
    return this.type === 0;
};

function FinallyHandlerCancelReaction(finallyHandler) {
    this.finallyHandler = finallyHandler;
}

FinallyHandlerCancelReaction.prototype._resultCancelled = function() {
    checkCancel(this.finallyHandler);
};

function checkCancel(ctx, reason) {
    if (ctx.cancelPromise != null) {
        if (arguments.length > 1) {
            ctx.cancelPromise._reject(reason);
        } else {
            ctx.cancelPromise._cancel();
        }
        ctx.cancelPromise = null;
        return true;
    }
    return false;
}

function succeed() {
    return finallyHandler.call(this, this.promise._target()._settledValue());
}
function fail(reason) {
    if (checkCancel(this, reason)) return;
    errorObj.e = reason;
    return errorObj;
}
function finallyHandler(reasonOrValue) {
    var promise = this.promise;
    var handler = this.handler;

    if (!this.called) {
        this.called = true;
        var ret = this.isFinallyHandler()
            ? handler.call(promise._boundValue())
            : handler.call(promise._boundValue(), reasonOrValue);
        if (ret !== undefined) {
            promise._setReturnedNonUndefined();
            var maybePromise = tryConvertToPromise(ret, promise);
            if (maybePromise instanceof Promise) {
                if (this.cancelPromise != null) {
                    if (maybePromise.isCancelled()) {
                        var reason =
                            new CancellationError("late cancellation observer");
                        promise._attachExtraTrace(reason);
                        errorObj.e = reason;
                        return errorObj;
                    } else if (maybePromise.isPending()) {
                        maybePromise._attachCancellationCallback(
                            new FinallyHandlerCancelReaction(this));
                    }
                }
                return maybePromise._then(
                    succeed, fail, undefined, this, undefined);
            }
        }
    }

    if (promise.isRejected()) {
        checkCancel(this);
        errorObj.e = reasonOrValue;
        return errorObj;
    } else {
        checkCancel(this);
        return reasonOrValue;
    }
}

Promise.prototype._passThrough = function(handler, type, success, fail) {
    if (typeof handler !== "function") return this.then();
    return this._then(success,
                      fail,
                      undefined,
                      new PassThroughHandlerContext(this, type, handler),
                      undefined);
};

Promise.prototype.lastly =
Promise.prototype["finally"] = function (handler) {
    return this._passThrough(handler,
                             0,
                             finallyHandler,
                             finallyHandler);
};

Promise.prototype.tap = function (handler) {
    return this._passThrough(handler, 1, finallyHandler);
};

return PassThroughHandlerContext;
};

},{"./util":36}],16:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise,
                          apiRejection,
                          INTERNAL,
                          tryConvertToPromise,
                          Proxyable,
                          debug) {
var errors = _dereq_("./errors");
var TypeError = errors.TypeError;
var util = _dereq_("./util");
var errorObj = util.errorObj;
var tryCatch = util.tryCatch;
var yieldHandlers = [];

function promiseFromYieldHandler(value, yieldHandlers, traceParent) {
    for (var i = 0; i < yieldHandlers.length; ++i) {
        traceParent._pushContext();
        var result = tryCatch(yieldHandlers[i])(value);
        traceParent._popContext();
        if (result === errorObj) {
            traceParent._pushContext();
            var ret = Promise.reject(errorObj.e);
            traceParent._popContext();
            return ret;
        }
        var maybePromise = tryConvertToPromise(result, traceParent);
        if (maybePromise instanceof Promise) return maybePromise;
    }
    return null;
}

function PromiseSpawn(generatorFunction, receiver, yieldHandler, stack) {
    if (debug.cancellation()) {
        var internal = new Promise(INTERNAL);
        var _finallyPromise = this._finallyPromise = new Promise(INTERNAL);
        this._promise = internal.lastly(function() {
            return _finallyPromise;
        });
        internal._captureStackTrace();
        internal._setOnCancel(this);
    } else {
        var promise = this._promise = new Promise(INTERNAL);
        promise._captureStackTrace();
    }
    this._stack = stack;
    this._generatorFunction = generatorFunction;
    this._receiver = receiver;
    this._generator = undefined;
    this._yieldHandlers = typeof yieldHandler === "function"
        ? [yieldHandler].concat(yieldHandlers)
        : yieldHandlers;
    this._yieldedPromise = null;
    this._cancellationPhase = false;
}
util.inherits(PromiseSpawn, Proxyable);

PromiseSpawn.prototype._isResolved = function() {
    return this._promise === null;
};

PromiseSpawn.prototype._cleanup = function() {
    this._promise = this._generator = null;
    if (debug.cancellation() && this._finallyPromise !== null) {
        this._finallyPromise._fulfill();
        this._finallyPromise = null;
    }
};

PromiseSpawn.prototype._promiseCancelled = function() {
    if (this._isResolved()) return;
    var implementsReturn = typeof this._generator["return"] !== "undefined";

    var result;
    if (!implementsReturn) {
        var reason = new Promise.CancellationError(
            "generator .return() sentinel");
        Promise.coroutine.returnSentinel = reason;
        this._promise._attachExtraTrace(reason);
        this._promise._pushContext();
        result = tryCatch(this._generator["throw"]).call(this._generator,
                                                         reason);
        this._promise._popContext();
    } else {
        this._promise._pushContext();
        result = tryCatch(this._generator["return"]).call(this._generator,
                                                          undefined);
        this._promise._popContext();
    }
    this._cancellationPhase = true;
    this._yieldedPromise = null;
    this._continue(result);
};

PromiseSpawn.prototype._promiseFulfilled = function(value) {
    this._yieldedPromise = null;
    this._promise._pushContext();
    var result = tryCatch(this._generator.next).call(this._generator, value);
    this._promise._popContext();
    this._continue(result);
};

PromiseSpawn.prototype._promiseRejected = function(reason) {
    this._yieldedPromise = null;
    this._promise._attachExtraTrace(reason);
    this._promise._pushContext();
    var result = tryCatch(this._generator["throw"])
        .call(this._generator, reason);
    this._promise._popContext();
    this._continue(result);
};

PromiseSpawn.prototype._resultCancelled = function() {
    if (this._yieldedPromise instanceof Promise) {
        var promise = this._yieldedPromise;
        this._yieldedPromise = null;
        promise.cancel();
    }
};

PromiseSpawn.prototype.promise = function () {
    return this._promise;
};

PromiseSpawn.prototype._run = function () {
    this._generator = this._generatorFunction.call(this._receiver);
    this._receiver =
        this._generatorFunction = undefined;
    this._promiseFulfilled(undefined);
};

PromiseSpawn.prototype._continue = function (result) {
    var promise = this._promise;
    if (result === errorObj) {
        this._cleanup();
        if (this._cancellationPhase) {
            return promise.cancel();
        } else {
            return promise._rejectCallback(result.e, false);
        }
    }

    var value = result.value;
    if (result.done === true) {
        this._cleanup();
        if (this._cancellationPhase) {
            return promise.cancel();
        } else {
            return promise._resolveCallback(value);
        }
    } else {
        var maybePromise = tryConvertToPromise(value, this._promise);
        if (!(maybePromise instanceof Promise)) {
            maybePromise =
                promiseFromYieldHandler(maybePromise,
                                        this._yieldHandlers,
                                        this._promise);
            if (maybePromise === null) {
                this._promiseRejected(
                    new TypeError(
                        "A value %s was yielded that could not be treated as a promise\u000a\u000a    See http://goo.gl/MqrFmX\u000a\u000a".replace("%s", value) +
                        "From coroutine:\u000a" +
                        this._stack.split("\n").slice(1, -7).join("\n")
                    )
                );
                return;
            }
        }
        maybePromise = maybePromise._target();
        var bitField = maybePromise._bitField;
        ;
        if (((bitField & 50397184) === 0)) {
            this._yieldedPromise = maybePromise;
            maybePromise._proxy(this, null);
        } else if (((bitField & 33554432) !== 0)) {
            this._promiseFulfilled(maybePromise._value());
        } else if (((bitField & 16777216) !== 0)) {
            this._promiseRejected(maybePromise._reason());
        } else {
            this._promiseCancelled();
        }
    }
};

Promise.coroutine = function (generatorFunction, options) {
    if (typeof generatorFunction !== "function") {
        throw new TypeError("generatorFunction must be a function\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    var yieldHandler = Object(options).yieldHandler;
    var PromiseSpawn$ = PromiseSpawn;
    var stack = new Error().stack;
    return function () {
        var generator = generatorFunction.apply(this, arguments);
        var spawn = new PromiseSpawn$(undefined, undefined, yieldHandler,
                                      stack);
        var ret = spawn.promise();
        spawn._generator = generator;
        spawn._promiseFulfilled(undefined);
        return ret;
    };
};

Promise.coroutine.addYieldHandler = function(fn) {
    if (typeof fn !== "function") {
        throw new TypeError("expecting a function but got " + util.classString(fn));
    }
    yieldHandlers.push(fn);
};

Promise.spawn = function (generatorFunction) {
    debug.deprecated("Promise.spawn()", "Promise.coroutine()");
    if (typeof generatorFunction !== "function") {
        return apiRejection("generatorFunction must be a function\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    var spawn = new PromiseSpawn(generatorFunction, this);
    var ret = spawn.promise();
    spawn._run(Promise.spawn);
    return ret;
};
};

},{"./errors":12,"./util":36}],17:[function(_dereq_,module,exports){
"use strict";
module.exports =
function(Promise, PromiseArray, tryConvertToPromise, INTERNAL) {
var util = _dereq_("./util");
var canEvaluate = util.canEvaluate;
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;
var reject;

if (!true) {
if (canEvaluate) {
    var thenCallback = function(i) {
        return new Function("value", "holder", "                             \n\
            'use strict';                                                    \n\
            holder.pIndex = value;                                           \n\
            holder.checkFulfillment(this);                                   \n\
            ".replace(/Index/g, i));
    };

    var promiseSetter = function(i) {
        return new Function("promise", "holder", "                           \n\
            'use strict';                                                    \n\
            holder.pIndex = promise;                                         \n\
            ".replace(/Index/g, i));
    };

    var generateHolderClass = function(total) {
        var props = new Array(total);
        for (var i = 0; i < props.length; ++i) {
            props[i] = "this.p" + (i+1);
        }
        var assignment = props.join(" = ") + " = null;";
        var cancellationCode= "var promise;\n" + props.map(function(prop) {
            return "                                                         \n\
                promise = " + prop + ";                                      \n\
                if (promise instanceof Promise) {                            \n\
                    promise.cancel();                                        \n\
                }                                                            \n\
            ";
        }).join("\n");
        var passedArguments = props.join(", ");
        var name = "Holder$" + total;


        var code = "return function(tryCatch, errorObj, Promise) {           \n\
            'use strict';                                                    \n\
            function [TheName](fn) {                                         \n\
                [TheProperties]                                              \n\
                this.fn = fn;                                                \n\
                this.now = 0;                                                \n\
            }                                                                \n\
            [TheName].prototype.checkFulfillment = function(promise) {       \n\
                var now = ++this.now;                                        \n\
                if (now === [TheTotal]) {                                    \n\
                    promise._pushContext();                                  \n\
                    var callback = this.fn;                                  \n\
                    var ret = tryCatch(callback)([ThePassedArguments]);      \n\
                    promise._popContext();                                   \n\
                    if (ret === errorObj) {                                  \n\
                        promise._rejectCallback(ret.e, false);               \n\
                    } else {                                                 \n\
                        promise._resolveCallback(ret);                       \n\
                    }                                                        \n\
                }                                                            \n\
            };                                                               \n\
                                                                             \n\
            [TheName].prototype._resultCancelled = function() {              \n\
                [CancellationCode]                                           \n\
            };                                                               \n\
                                                                             \n\
            return [TheName];                                                \n\
        }(tryCatch, errorObj, Promise);                                      \n\
        ";

        code = code.replace(/\[TheName\]/g, name)
            .replace(/\[TheTotal\]/g, total)
            .replace(/\[ThePassedArguments\]/g, passedArguments)
            .replace(/\[TheProperties\]/g, assignment)
            .replace(/\[CancellationCode\]/g, cancellationCode);

        return new Function("tryCatch", "errorObj", "Promise", code)
                           (tryCatch, errorObj, Promise);
    };

    var holderClasses = [];
    var thenCallbacks = [];
    var promiseSetters = [];

    for (var i = 0; i < 8; ++i) {
        holderClasses.push(generateHolderClass(i + 1));
        thenCallbacks.push(thenCallback(i + 1));
        promiseSetters.push(promiseSetter(i + 1));
    }

    reject = function (reason) {
        this._reject(reason);
    };
}}

Promise.join = function () {
    var last = arguments.length - 1;
    var fn;
    if (last > 0 && typeof arguments[last] === "function") {
        fn = arguments[last];
        if (!true) {
            if (last <= 8 && canEvaluate) {
                var ret = new Promise(INTERNAL);
                ret._captureStackTrace();
                var HolderClass = holderClasses[last - 1];
                var holder = new HolderClass(fn);
                var callbacks = thenCallbacks;

                for (var i = 0; i < last; ++i) {
                    var maybePromise = tryConvertToPromise(arguments[i], ret);
                    if (maybePromise instanceof Promise) {
                        maybePromise = maybePromise._target();
                        var bitField = maybePromise._bitField;
                        ;
                        if (((bitField & 50397184) === 0)) {
                            maybePromise._then(callbacks[i], reject,
                                               undefined, ret, holder);
                            promiseSetters[i](maybePromise, holder);
                        } else if (((bitField & 33554432) !== 0)) {
                            callbacks[i].call(ret,
                                              maybePromise._value(), holder);
                        } else if (((bitField & 16777216) !== 0)) {
                            ret._reject(maybePromise._reason());
                        } else {
                            ret._cancel();
                        }
                    } else {
                        callbacks[i].call(ret, maybePromise, holder);
                    }
                }
                if (!ret._isFateSealed()) {
                    ret._setAsyncGuaranteed();
                    ret._setOnCancel(holder);
                }
                return ret;
            }
        }
    }
    var args = [].slice.call(arguments);;
    if (fn) args.pop();
    var ret = new PromiseArray(args).promise();
    return fn !== undefined ? ret.spread(fn) : ret;
};

};

},{"./util":36}],18:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise,
                          PromiseArray,
                          apiRejection,
                          tryConvertToPromise,
                          INTERNAL,
                          debug) {
var getDomain = Promise._getDomain;
var util = _dereq_("./util");
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;
var EMPTY_ARRAY = [];

function MappingPromiseArray(promises, fn, limit, _filter) {
    this.constructor$(promises);
    this._promise._captureStackTrace();
    var domain = getDomain();
    this._callback = domain === null ? fn : domain.bind(fn);
    this._preservedValues = _filter === INTERNAL
        ? new Array(this.length())
        : null;
    this._limit = limit;
    this._inFlight = 0;
    this._queue = limit >= 1 ? [] : EMPTY_ARRAY;
    this._init$(undefined, -2);
}
util.inherits(MappingPromiseArray, PromiseArray);

MappingPromiseArray.prototype._init = function () {};

MappingPromiseArray.prototype._promiseFulfilled = function (value, index) {
    var values = this._values;
    var length = this.length();
    var preservedValues = this._preservedValues;
    var limit = this._limit;

    if (index < 0) {
        index = (index * -1) - 1;
        values[index] = value;
        if (limit >= 1) {
            this._inFlight--;
            this._drainQueue();
            if (this._isResolved()) return true;
        }
    } else {
        if (limit >= 1 && this._inFlight >= limit) {
            values[index] = value;
            this._queue.push(index);
            return false;
        }
        if (preservedValues !== null) preservedValues[index] = value;

        var promise = this._promise;
        var callback = this._callback;
        var receiver = promise._boundValue();
        promise._pushContext();
        var ret = tryCatch(callback).call(receiver, value, index, length);
        var promiseCreated = promise._popContext();
        debug.checkForgottenReturns(
            ret,
            promiseCreated,
            preservedValues !== null ? "Promise.filter" : "Promise.map",
            promise
        );
        if (ret === errorObj) {
            this._reject(ret.e);
            return true;
        }

        var maybePromise = tryConvertToPromise(ret, this._promise);
        if (maybePromise instanceof Promise) {
            maybePromise = maybePromise._target();
            var bitField = maybePromise._bitField;
            ;
            if (((bitField & 50397184) === 0)) {
                if (limit >= 1) this._inFlight++;
                values[index] = maybePromise;
                maybePromise._proxy(this, (index + 1) * -1);
                return false;
            } else if (((bitField & 33554432) !== 0)) {
                ret = maybePromise._value();
            } else if (((bitField & 16777216) !== 0)) {
                this._reject(maybePromise._reason());
                return true;
            } else {
                this._cancel();
                return true;
            }
        }
        values[index] = ret;
    }
    var totalResolved = ++this._totalResolved;
    if (totalResolved >= length) {
        if (preservedValues !== null) {
            this._filter(values, preservedValues);
        } else {
            this._resolve(values);
        }
        return true;
    }
    return false;
};

MappingPromiseArray.prototype._drainQueue = function () {
    var queue = this._queue;
    var limit = this._limit;
    var values = this._values;
    while (queue.length > 0 && this._inFlight < limit) {
        if (this._isResolved()) return;
        var index = queue.pop();
        this._promiseFulfilled(values[index], index);
    }
};

MappingPromiseArray.prototype._filter = function (booleans, values) {
    var len = values.length;
    var ret = new Array(len);
    var j = 0;
    for (var i = 0; i < len; ++i) {
        if (booleans[i]) ret[j++] = values[i];
    }
    ret.length = j;
    this._resolve(ret);
};

MappingPromiseArray.prototype.preservedValues = function () {
    return this._preservedValues;
};

function map(promises, fn, options, _filter) {
    if (typeof fn !== "function") {
        return apiRejection("expecting a function but got " + util.classString(fn));
    }

    var limit = 0;
    if (options !== undefined) {
        if (typeof options === "object" && options !== null) {
            if (typeof options.concurrency !== "number") {
                return Promise.reject(
                    new TypeError("'concurrency' must be a number but it is " +
                                    util.classString(options.concurrency)));
            }
            limit = options.concurrency;
        } else {
            return Promise.reject(new TypeError(
                            "options argument must be an object but it is " +
                             util.classString(options)));
        }
    }
    limit = typeof limit === "number" &&
        isFinite(limit) && limit >= 1 ? limit : 0;
    return new MappingPromiseArray(promises, fn, limit, _filter).promise();
}

Promise.prototype.map = function (fn, options) {
    return map(this, fn, options, null);
};

Promise.map = function (promises, fn, options, _filter) {
    return map(promises, fn, options, _filter);
};


};

},{"./util":36}],19:[function(_dereq_,module,exports){
"use strict";
module.exports =
function(Promise, INTERNAL, tryConvertToPromise, apiRejection, debug) {
var util = _dereq_("./util");
var tryCatch = util.tryCatch;

Promise.method = function (fn) {
    if (typeof fn !== "function") {
        throw new Promise.TypeError("expecting a function but got " + util.classString(fn));
    }
    return function () {
        var ret = new Promise(INTERNAL);
        ret._captureStackTrace();
        ret._pushContext();
        var value = tryCatch(fn).apply(this, arguments);
        var promiseCreated = ret._popContext();
        debug.checkForgottenReturns(
            value, promiseCreated, "Promise.method", ret);
        ret._resolveFromSyncValue(value);
        return ret;
    };
};

Promise.attempt = Promise["try"] = function (fn) {
    if (typeof fn !== "function") {
        return apiRejection("expecting a function but got " + util.classString(fn));
    }
    var ret = new Promise(INTERNAL);
    ret._captureStackTrace();
    ret._pushContext();
    var value;
    if (arguments.length > 1) {
        debug.deprecated("calling Promise.try with more than 1 argument");
        var arg = arguments[1];
        var ctx = arguments[2];
        value = util.isArray(arg) ? tryCatch(fn).apply(ctx, arg)
                                  : tryCatch(fn).call(ctx, arg);
    } else {
        value = tryCatch(fn)();
    }
    var promiseCreated = ret._popContext();
    debug.checkForgottenReturns(
        value, promiseCreated, "Promise.try", ret);
    ret._resolveFromSyncValue(value);
    return ret;
};

Promise.prototype._resolveFromSyncValue = function (value) {
    if (value === util.errorObj) {
        this._rejectCallback(value.e, false);
    } else {
        this._resolveCallback(value, true);
    }
};
};

},{"./util":36}],20:[function(_dereq_,module,exports){
"use strict";
var util = _dereq_("./util");
var maybeWrapAsError = util.maybeWrapAsError;
var errors = _dereq_("./errors");
var OperationalError = errors.OperationalError;
var es5 = _dereq_("./es5");

function isUntypedError(obj) {
    return obj instanceof Error &&
        es5.getPrototypeOf(obj) === Error.prototype;
}

var rErrorKey = /^(?:name|message|stack|cause)$/;
function wrapAsOperationalError(obj) {
    var ret;
    if (isUntypedError(obj)) {
        ret = new OperationalError(obj);
        ret.name = obj.name;
        ret.message = obj.message;
        ret.stack = obj.stack;
        var keys = es5.keys(obj);
        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            if (!rErrorKey.test(key)) {
                ret[key] = obj[key];
            }
        }
        return ret;
    }
    util.markAsOriginatingFromRejection(obj);
    return obj;
}

function nodebackForPromise(promise, multiArgs) {
    return function(err, value) {
        if (promise === null) return;
        if (err) {
            var wrapped = wrapAsOperationalError(maybeWrapAsError(err));
            promise._attachExtraTrace(wrapped);
            promise._reject(wrapped);
        } else if (!multiArgs) {
            promise._fulfill(value);
        } else {
            var args = [].slice.call(arguments, 1);;
            promise._fulfill(args);
        }
        promise = null;
    };
}

module.exports = nodebackForPromise;

},{"./errors":12,"./es5":13,"./util":36}],21:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise) {
var util = _dereq_("./util");
var async = Promise._async;
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;

function spreadAdapter(val, nodeback) {
    var promise = this;
    if (!util.isArray(val)) return successAdapter.call(promise, val, nodeback);
    var ret =
        tryCatch(nodeback).apply(promise._boundValue(), [null].concat(val));
    if (ret === errorObj) {
        async.throwLater(ret.e);
    }
}

function successAdapter(val, nodeback) {
    var promise = this;
    var receiver = promise._boundValue();
    var ret = val === undefined
        ? tryCatch(nodeback).call(receiver, null)
        : tryCatch(nodeback).call(receiver, null, val);
    if (ret === errorObj) {
        async.throwLater(ret.e);
    }
}
function errorAdapter(reason, nodeback) {
    var promise = this;
    if (!reason) {
        var newReason = new Error(reason + "");
        newReason.cause = reason;
        reason = newReason;
    }
    var ret = tryCatch(nodeback).call(promise._boundValue(), reason);
    if (ret === errorObj) {
        async.throwLater(ret.e);
    }
}

Promise.prototype.asCallback = Promise.prototype.nodeify = function (nodeback,
                                                                     options) {
    if (typeof nodeback == "function") {
        var adapter = successAdapter;
        if (options !== undefined && Object(options).spread) {
            adapter = spreadAdapter;
        }
        this._then(
            adapter,
            errorAdapter,
            undefined,
            this,
            nodeback
        );
    }
    return this;
};
};

},{"./util":36}],22:[function(_dereq_,module,exports){
"use strict";
module.exports = function() {
var makeSelfResolutionError = function () {
    return new TypeError("circular promise resolution chain\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
};
var reflectHandler = function() {
    return new Promise.PromiseInspection(this._target());
};
var apiRejection = function(msg) {
    return Promise.reject(new TypeError(msg));
};
function Proxyable() {}
var UNDEFINED_BINDING = {};
var util = _dereq_("./util");

var getDomain;
if (util.isNode) {
    getDomain = function() {
        var ret = process.domain;
        if (ret === undefined) ret = null;
        return ret;
    };
} else {
    getDomain = function() {
        return null;
    };
}
util.notEnumerableProp(Promise, "_getDomain", getDomain);

var es5 = _dereq_("./es5");
var Async = _dereq_("./async");
var async = new Async();
es5.defineProperty(Promise, "_async", {value: async});
var errors = _dereq_("./errors");
var TypeError = Promise.TypeError = errors.TypeError;
Promise.RangeError = errors.RangeError;
var CancellationError = Promise.CancellationError = errors.CancellationError;
Promise.TimeoutError = errors.TimeoutError;
Promise.OperationalError = errors.OperationalError;
Promise.RejectionError = errors.OperationalError;
Promise.AggregateError = errors.AggregateError;
var INTERNAL = function(){};
var APPLY = {};
var NEXT_FILTER = {};
var tryConvertToPromise = _dereq_("./thenables")(Promise, INTERNAL);
var PromiseArray =
    _dereq_("./promise_array")(Promise, INTERNAL,
                               tryConvertToPromise, apiRejection, Proxyable);
var Context = _dereq_("./context")(Promise);
 /*jshint unused:false*/
var createContext = Context.create;
var debug = _dereq_("./debuggability")(Promise, Context);
var CapturedTrace = debug.CapturedTrace;
var PassThroughHandlerContext =
    _dereq_("./finally")(Promise, tryConvertToPromise);
var catchFilter = _dereq_("./catch_filter")(NEXT_FILTER);
var nodebackForPromise = _dereq_("./nodeback");
var errorObj = util.errorObj;
var tryCatch = util.tryCatch;
function check(self, executor) {
    if (typeof executor !== "function") {
        throw new TypeError("expecting a function but got " + util.classString(executor));
    }
    if (self.constructor !== Promise) {
        throw new TypeError("the promise constructor cannot be invoked directly\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
}

function Promise(executor) {
    this._bitField = 0;
    this._fulfillmentHandler0 = undefined;
    this._rejectionHandler0 = undefined;
    this._promise0 = undefined;
    this._receiver0 = undefined;
    if (executor !== INTERNAL) {
        check(this, executor);
        this._resolveFromExecutor(executor);
    }
    this._promiseCreated();
    this._fireEvent("promiseCreated", this);
}

Promise.prototype.toString = function () {
    return "[object Promise]";
};

Promise.prototype.caught = Promise.prototype["catch"] = function (fn) {
    var len = arguments.length;
    if (len > 1) {
        var catchInstances = new Array(len - 1),
            j = 0, i;
        for (i = 0; i < len - 1; ++i) {
            var item = arguments[i];
            if (util.isObject(item)) {
                catchInstances[j++] = item;
            } else {
                return apiRejection("expecting an object but got " + util.classString(item));
            }
        }
        catchInstances.length = j;
        fn = arguments[i];
        return this.then(undefined, catchFilter(catchInstances, fn, this));
    }
    return this.then(undefined, fn);
};

Promise.prototype.reflect = function () {
    return this._then(reflectHandler,
        reflectHandler, undefined, this, undefined);
};

Promise.prototype.then = function (didFulfill, didReject) {
    if (debug.warnings() && arguments.length > 0 &&
        typeof didFulfill !== "function" &&
        typeof didReject !== "function") {
        var msg = ".then() only accepts functions but was passed: " +
                util.classString(didFulfill);
        if (arguments.length > 1) {
            msg += ", " + util.classString(didReject);
        }
        this._warn(msg);
    }
    return this._then(didFulfill, didReject, undefined, undefined, undefined);
};

Promise.prototype.done = function (didFulfill, didReject) {
    var promise =
        this._then(didFulfill, didReject, undefined, undefined, undefined);
    promise._setIsFinal();
};

Promise.prototype.spread = function (fn) {
    if (typeof fn !== "function") {
        return apiRejection("expecting a function but got " + util.classString(fn));
    }
    return this.all()._then(fn, undefined, undefined, APPLY, undefined);
};

Promise.prototype.toJSON = function () {
    var ret = {
        isFulfilled: false,
        isRejected: false,
        fulfillmentValue: undefined,
        rejectionReason: undefined
    };
    if (this.isFulfilled()) {
        ret.fulfillmentValue = this.value();
        ret.isFulfilled = true;
    } else if (this.isRejected()) {
        ret.rejectionReason = this.reason();
        ret.isRejected = true;
    }
    return ret;
};

Promise.prototype.all = function () {
    if (arguments.length > 0) {
        this._warn(".all() was passed arguments but it does not take any");
    }
    return new PromiseArray(this).promise();
};

Promise.prototype.error = function (fn) {
    return this.caught(util.originatesFromRejection, fn);
};

Promise.getNewLibraryCopy = module.exports;

Promise.is = function (val) {
    return val instanceof Promise;
};

Promise.fromNode = Promise.fromCallback = function(fn) {
    var ret = new Promise(INTERNAL);
    ret._captureStackTrace();
    var multiArgs = arguments.length > 1 ? !!Object(arguments[1]).multiArgs
                                         : false;
    var result = tryCatch(fn)(nodebackForPromise(ret, multiArgs));
    if (result === errorObj) {
        ret._rejectCallback(result.e, true);
    }
    if (!ret._isFateSealed()) ret._setAsyncGuaranteed();
    return ret;
};

Promise.all = function (promises) {
    return new PromiseArray(promises).promise();
};

Promise.cast = function (obj) {
    var ret = tryConvertToPromise(obj);
    if (!(ret instanceof Promise)) {
        ret = new Promise(INTERNAL);
        ret._captureStackTrace();
        ret._setFulfilled();
        ret._rejectionHandler0 = obj;
    }
    return ret;
};

Promise.resolve = Promise.fulfilled = Promise.cast;

Promise.reject = Promise.rejected = function (reason) {
    var ret = new Promise(INTERNAL);
    ret._captureStackTrace();
    ret._rejectCallback(reason, true);
    return ret;
};

Promise.setScheduler = function(fn) {
    if (typeof fn !== "function") {
        throw new TypeError("expecting a function but got " + util.classString(fn));
    }
    return async.setScheduler(fn);
};

Promise.prototype._then = function (
    didFulfill,
    didReject,
    _,    receiver,
    internalData
) {
    var haveInternalData = internalData !== undefined;
    var promise = haveInternalData ? internalData : new Promise(INTERNAL);
    var target = this._target();
    var bitField = target._bitField;

    if (!haveInternalData) {
        promise._propagateFrom(this, 3);
        promise._captureStackTrace();
        if (receiver === undefined &&
            ((this._bitField & 2097152) !== 0)) {
            if (!((bitField & 50397184) === 0)) {
                receiver = this._boundValue();
            } else {
                receiver = target === this ? undefined : this._boundTo;
            }
        }
        this._fireEvent("promiseChained", this, promise);
    }

    var domain = getDomain();
    if (!((bitField & 50397184) === 0)) {
        var handler, value, settler = target._settlePromiseCtx;
        if (((bitField & 33554432) !== 0)) {
            value = target._rejectionHandler0;
            handler = didFulfill;
        } else if (((bitField & 16777216) !== 0)) {
            value = target._fulfillmentHandler0;
            handler = didReject;
            target._unsetRejectionIsUnhandled();
        } else {
            settler = target._settlePromiseLateCancellationObserver;
            value = new CancellationError("late cancellation observer");
            target._attachExtraTrace(value);
            handler = didReject;
        }

        async.invoke(settler, target, {
            handler: domain === null ? handler
                : (typeof handler === "function" && domain.bind(handler)),
            promise: promise,
            receiver: receiver,
            value: value
        });
    } else {
        target._addCallbacks(didFulfill, didReject, promise, receiver, domain);
    }

    return promise;
};

Promise.prototype._length = function () {
    return this._bitField & 65535;
};

Promise.prototype._isFateSealed = function () {
    return (this._bitField & 117506048) !== 0;
};

Promise.prototype._isFollowing = function () {
    return (this._bitField & 67108864) === 67108864;
};

Promise.prototype._setLength = function (len) {
    this._bitField = (this._bitField & -65536) |
        (len & 65535);
};

Promise.prototype._setFulfilled = function () {
    this._bitField = this._bitField | 33554432;
    this._fireEvent("promiseFulfilled", this);
};

Promise.prototype._setRejected = function () {
    this._bitField = this._bitField | 16777216;
    this._fireEvent("promiseRejected", this);
};

Promise.prototype._setFollowing = function () {
    this._bitField = this._bitField | 67108864;
    this._fireEvent("promiseResolved", this);
};

Promise.prototype._setIsFinal = function () {
    this._bitField = this._bitField | 4194304;
};

Promise.prototype._isFinal = function () {
    return (this._bitField & 4194304) > 0;
};

Promise.prototype._unsetCancelled = function() {
    this._bitField = this._bitField & (~65536);
};

Promise.prototype._setCancelled = function() {
    this._bitField = this._bitField | 65536;
    this._fireEvent("promiseCancelled", this);
};

Promise.prototype._setAsyncGuaranteed = function() {
    if (async.hasCustomScheduler()) return;
    this._bitField = this._bitField | 134217728;
};

Promise.prototype._receiverAt = function (index) {
    var ret = index === 0 ? this._receiver0 : this[
            index * 4 - 4 + 3];
    if (ret === UNDEFINED_BINDING) {
        return undefined;
    } else if (ret === undefined && this._isBound()) {
        return this._boundValue();
    }
    return ret;
};

Promise.prototype._promiseAt = function (index) {
    return this[
            index * 4 - 4 + 2];
};

Promise.prototype._fulfillmentHandlerAt = function (index) {
    return this[
            index * 4 - 4 + 0];
};

Promise.prototype._rejectionHandlerAt = function (index) {
    return this[
            index * 4 - 4 + 1];
};

Promise.prototype._boundValue = function() {};

Promise.prototype._migrateCallback0 = function (follower) {
    var bitField = follower._bitField;
    var fulfill = follower._fulfillmentHandler0;
    var reject = follower._rejectionHandler0;
    var promise = follower._promise0;
    var receiver = follower._receiverAt(0);
    if (receiver === undefined) receiver = UNDEFINED_BINDING;
    this._addCallbacks(fulfill, reject, promise, receiver, null);
};

Promise.prototype._migrateCallbackAt = function (follower, index) {
    var fulfill = follower._fulfillmentHandlerAt(index);
    var reject = follower._rejectionHandlerAt(index);
    var promise = follower._promiseAt(index);
    var receiver = follower._receiverAt(index);
    if (receiver === undefined) receiver = UNDEFINED_BINDING;
    this._addCallbacks(fulfill, reject, promise, receiver, null);
};

Promise.prototype._addCallbacks = function (
    fulfill,
    reject,
    promise,
    receiver,
    domain
) {
    var index = this._length();

    if (index >= 65535 - 4) {
        index = 0;
        this._setLength(0);
    }

    if (index === 0) {
        this._promise0 = promise;
        this._receiver0 = receiver;
        if (typeof fulfill === "function") {
            this._fulfillmentHandler0 =
                domain === null ? fulfill : domain.bind(fulfill);
        }
        if (typeof reject === "function") {
            this._rejectionHandler0 =
                domain === null ? reject : domain.bind(reject);
        }
    } else {
        var base = index * 4 - 4;
        this[base + 2] = promise;
        this[base + 3] = receiver;
        if (typeof fulfill === "function") {
            this[base + 0] =
                domain === null ? fulfill : domain.bind(fulfill);
        }
        if (typeof reject === "function") {
            this[base + 1] =
                domain === null ? reject : domain.bind(reject);
        }
    }
    this._setLength(index + 1);
    return index;
};

Promise.prototype._proxy = function (proxyable, arg) {
    this._addCallbacks(undefined, undefined, arg, proxyable, null);
};

Promise.prototype._resolveCallback = function(value, shouldBind) {
    if (((this._bitField & 117506048) !== 0)) return;
    if (value === this)
        return this._rejectCallback(makeSelfResolutionError(), false);
    var maybePromise = tryConvertToPromise(value, this);
    if (!(maybePromise instanceof Promise)) return this._fulfill(value);

    if (shouldBind) this._propagateFrom(maybePromise, 2);

    var promise = maybePromise._target();

    if (promise === this) {
        this._reject(makeSelfResolutionError());
        return;
    }

    var bitField = promise._bitField;
    if (((bitField & 50397184) === 0)) {
        var len = this._length();
        if (len > 0) promise._migrateCallback0(this);
        for (var i = 1; i < len; ++i) {
            promise._migrateCallbackAt(this, i);
        }
        this._setFollowing();
        this._setLength(0);
        this._setFollowee(promise);
    } else if (((bitField & 33554432) !== 0)) {
        this._fulfill(promise._value());
    } else if (((bitField & 16777216) !== 0)) {
        this._reject(promise._reason());
    } else {
        var reason = new CancellationError("late cancellation observer");
        promise._attachExtraTrace(reason);
        this._reject(reason);
    }
};

Promise.prototype._rejectCallback =
function(reason, synchronous, ignoreNonErrorWarnings) {
    var trace = util.ensureErrorObject(reason);
    var hasStack = trace === reason;
    if (!hasStack && !ignoreNonErrorWarnings && debug.warnings()) {
        var message = "a promise was rejected with a non-error: " +
            util.classString(reason);
        this._warn(message, true);
    }
    this._attachExtraTrace(trace, synchronous ? hasStack : false);
    this._reject(reason);
};

Promise.prototype._resolveFromExecutor = function (executor) {
    var promise = this;
    this._captureStackTrace();
    this._pushContext();
    var synchronous = true;
    var r = this._execute(executor, function(value) {
        promise._resolveCallback(value);
    }, function (reason) {
        promise._rejectCallback(reason, synchronous);
    });
    synchronous = false;
    this._popContext();

    if (r !== undefined) {
        promise._rejectCallback(r, true);
    }
};

Promise.prototype._settlePromiseFromHandler = function (
    handler, receiver, value, promise
) {
    var bitField = promise._bitField;
    if (((bitField & 65536) !== 0)) return;
    promise._pushContext();
    var x;
    if (receiver === APPLY) {
        if (!value || typeof value.length !== "number") {
            x = errorObj;
            x.e = new TypeError("cannot .spread() a non-array: " +
                                    util.classString(value));
        } else {
            x = tryCatch(handler).apply(this._boundValue(), value);
        }
    } else {
        x = tryCatch(handler).call(receiver, value);
    }
    var promiseCreated = promise._popContext();
    bitField = promise._bitField;
    if (((bitField & 65536) !== 0)) return;

    if (x === NEXT_FILTER) {
        promise._reject(value);
    } else if (x === errorObj) {
        promise._rejectCallback(x.e, false);
    } else {
        debug.checkForgottenReturns(x, promiseCreated, "",  promise, this);
        promise._resolveCallback(x);
    }
};

Promise.prototype._target = function() {
    var ret = this;
    while (ret._isFollowing()) ret = ret._followee();
    return ret;
};

Promise.prototype._followee = function() {
    return this._rejectionHandler0;
};

Promise.prototype._setFollowee = function(promise) {
    this._rejectionHandler0 = promise;
};

Promise.prototype._settlePromise = function(promise, handler, receiver, value) {
    var isPromise = promise instanceof Promise;
    var bitField = this._bitField;
    var asyncGuaranteed = ((bitField & 134217728) !== 0);
    if (((bitField & 65536) !== 0)) {
        if (isPromise) promise._invokeInternalOnCancel();

        if (receiver instanceof PassThroughHandlerContext &&
            receiver.isFinallyHandler()) {
            receiver.cancelPromise = promise;
            if (tryCatch(handler).call(receiver, value) === errorObj) {
                promise._reject(errorObj.e);
            }
        } else if (handler === reflectHandler) {
            promise._fulfill(reflectHandler.call(receiver));
        } else if (receiver instanceof Proxyable) {
            receiver._promiseCancelled(promise);
        } else if (isPromise || promise instanceof PromiseArray) {
            promise._cancel();
        } else {
            receiver.cancel();
        }
    } else if (typeof handler === "function") {
        if (!isPromise) {
            handler.call(receiver, value, promise);
        } else {
            if (asyncGuaranteed) promise._setAsyncGuaranteed();
            this._settlePromiseFromHandler(handler, receiver, value, promise);
        }
    } else if (receiver instanceof Proxyable) {
        if (!receiver._isResolved()) {
            if (((bitField & 33554432) !== 0)) {
                receiver._promiseFulfilled(value, promise);
            } else {
                receiver._promiseRejected(value, promise);
            }
        }
    } else if (isPromise) {
        if (asyncGuaranteed) promise._setAsyncGuaranteed();
        if (((bitField & 33554432) !== 0)) {
            promise._fulfill(value);
        } else {
            promise._reject(value);
        }
    }
};

Promise.prototype._settlePromiseLateCancellationObserver = function(ctx) {
    var handler = ctx.handler;
    var promise = ctx.promise;
    var receiver = ctx.receiver;
    var value = ctx.value;
    if (typeof handler === "function") {
        if (!(promise instanceof Promise)) {
            handler.call(receiver, value, promise);
        } else {
            this._settlePromiseFromHandler(handler, receiver, value, promise);
        }
    } else if (promise instanceof Promise) {
        promise._reject(value);
    }
};

Promise.prototype._settlePromiseCtx = function(ctx) {
    this._settlePromise(ctx.promise, ctx.handler, ctx.receiver, ctx.value);
};

Promise.prototype._settlePromise0 = function(handler, value, bitField) {
    var promise = this._promise0;
    var receiver = this._receiverAt(0);
    this._promise0 = undefined;
    this._receiver0 = undefined;
    this._settlePromise(promise, handler, receiver, value);
};

Promise.prototype._clearCallbackDataAtIndex = function(index) {
    var base = index * 4 - 4;
    this[base + 2] =
    this[base + 3] =
    this[base + 0] =
    this[base + 1] = undefined;
};

Promise.prototype._fulfill = function (value) {
    var bitField = this._bitField;
    if (((bitField & 117506048) >>> 16)) return;
    if (value === this) {
        var err = makeSelfResolutionError();
        this._attachExtraTrace(err);
        return this._reject(err);
    }
    this._setFulfilled();
    this._rejectionHandler0 = value;

    if ((bitField & 65535) > 0) {
        if (((bitField & 134217728) !== 0)) {
            this._settlePromises();
        } else {
            async.settlePromises(this);
        }
    }
};

Promise.prototype._reject = function (reason) {
    var bitField = this._bitField;
    if (((bitField & 117506048) >>> 16)) return;
    this._setRejected();
    this._fulfillmentHandler0 = reason;

    if (this._isFinal()) {
        return async.fatalError(reason, util.isNode);
    }

    if ((bitField & 65535) > 0) {
        async.settlePromises(this);
    } else {
        this._ensurePossibleRejectionHandled();
    }
};

Promise.prototype._fulfillPromises = function (len, value) {
    for (var i = 1; i < len; i++) {
        var handler = this._fulfillmentHandlerAt(i);
        var promise = this._promiseAt(i);
        var receiver = this._receiverAt(i);
        this._clearCallbackDataAtIndex(i);
        this._settlePromise(promise, handler, receiver, value);
    }
};

Promise.prototype._rejectPromises = function (len, reason) {
    for (var i = 1; i < len; i++) {
        var handler = this._rejectionHandlerAt(i);
        var promise = this._promiseAt(i);
        var receiver = this._receiverAt(i);
        this._clearCallbackDataAtIndex(i);
        this._settlePromise(promise, handler, receiver, reason);
    }
};

Promise.prototype._settlePromises = function () {
    var bitField = this._bitField;
    var len = (bitField & 65535);

    if (len > 0) {
        if (((bitField & 16842752) !== 0)) {
            var reason = this._fulfillmentHandler0;
            this._settlePromise0(this._rejectionHandler0, reason, bitField);
            this._rejectPromises(len, reason);
        } else {
            var value = this._rejectionHandler0;
            this._settlePromise0(this._fulfillmentHandler0, value, bitField);
            this._fulfillPromises(len, value);
        }
        this._setLength(0);
    }
    this._clearCancellationData();
};

Promise.prototype._settledValue = function() {
    var bitField = this._bitField;
    if (((bitField & 33554432) !== 0)) {
        return this._rejectionHandler0;
    } else if (((bitField & 16777216) !== 0)) {
        return this._fulfillmentHandler0;
    }
};

function deferResolve(v) {this.promise._resolveCallback(v);}
function deferReject(v) {this.promise._rejectCallback(v, false);}

Promise.defer = Promise.pending = function() {
    debug.deprecated("Promise.defer", "new Promise");
    var promise = new Promise(INTERNAL);
    return {
        promise: promise,
        resolve: deferResolve,
        reject: deferReject
    };
};

util.notEnumerableProp(Promise,
                       "_makeSelfResolutionError",
                       makeSelfResolutionError);

_dereq_("./method")(Promise, INTERNAL, tryConvertToPromise, apiRejection,
    debug);
_dereq_("./bind")(Promise, INTERNAL, tryConvertToPromise, debug);
_dereq_("./cancel")(Promise, PromiseArray, apiRejection, debug);
_dereq_("./direct_resolve")(Promise);
_dereq_("./synchronous_inspection")(Promise);
_dereq_("./join")(
    Promise, PromiseArray, tryConvertToPromise, INTERNAL, debug);
Promise.Promise = Promise;
Promise.version = "3.4.0";
_dereq_('./map.js')(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
_dereq_('./call_get.js')(Promise);
_dereq_('./using.js')(Promise, apiRejection, tryConvertToPromise, createContext, INTERNAL, debug);
_dereq_('./timers.js')(Promise, INTERNAL, debug);
_dereq_('./generators.js')(Promise, apiRejection, INTERNAL, tryConvertToPromise, Proxyable, debug);
_dereq_('./nodeify.js')(Promise);
_dereq_('./promisify.js')(Promise, INTERNAL);
_dereq_('./props.js')(Promise, PromiseArray, tryConvertToPromise, apiRejection);
_dereq_('./race.js')(Promise, INTERNAL, tryConvertToPromise, apiRejection);
_dereq_('./reduce.js')(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
_dereq_('./settle.js')(Promise, PromiseArray, debug);
_dereq_('./some.js')(Promise, PromiseArray, apiRejection);
_dereq_('./filter.js')(Promise, INTERNAL);
_dereq_('./each.js')(Promise, INTERNAL);
_dereq_('./any.js')(Promise);
                                                         
    util.toFastProperties(Promise);                                          
    util.toFastProperties(Promise.prototype);                                
    function fillTypes(value) {                                              
        var p = new Promise(INTERNAL);                                       
        p._fulfillmentHandler0 = value;                                      
        p._rejectionHandler0 = value;                                        
        p._promise0 = value;                                                 
        p._receiver0 = value;                                                
    }                                                                        
    // Complete slack tracking, opt out of field-type tracking and           
    // stabilize map                                                         
    fillTypes({a: 1});                                                       
    fillTypes({b: 2});                                                       
    fillTypes({c: 3});                                                       
    fillTypes(1);                                                            
    fillTypes(function(){});                                                 
    fillTypes(undefined);                                                    
    fillTypes(false);                                                        
    fillTypes(new Promise(INTERNAL));                                        
    debug.setBounds(Async.firstLineError, util.lastLineError);               
    return Promise;                                                          

};

},{"./any.js":1,"./async":2,"./bind":3,"./call_get.js":5,"./cancel":6,"./catch_filter":7,"./context":8,"./debuggability":9,"./direct_resolve":10,"./each.js":11,"./errors":12,"./es5":13,"./filter.js":14,"./finally":15,"./generators.js":16,"./join":17,"./map.js":18,"./method":19,"./nodeback":20,"./nodeify.js":21,"./promise_array":23,"./promisify.js":24,"./props.js":25,"./race.js":27,"./reduce.js":28,"./settle.js":30,"./some.js":31,"./synchronous_inspection":32,"./thenables":33,"./timers.js":34,"./using.js":35,"./util":36}],23:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise, INTERNAL, tryConvertToPromise,
    apiRejection, Proxyable) {
var util = _dereq_("./util");
var isArray = util.isArray;

function toResolutionValue(val) {
    switch(val) {
    case -2: return [];
    case -3: return {};
    }
}

function PromiseArray(values) {
    var promise = this._promise = new Promise(INTERNAL);
    if (values instanceof Promise) {
        promise._propagateFrom(values, 3);
    }
    promise._setOnCancel(this);
    this._values = values;
    this._length = 0;
    this._totalResolved = 0;
    this._init(undefined, -2);
}
util.inherits(PromiseArray, Proxyable);

PromiseArray.prototype.length = function () {
    return this._length;
};

PromiseArray.prototype.promise = function () {
    return this._promise;
};

PromiseArray.prototype._init = function init(_, resolveValueIfEmpty) {
    var values = tryConvertToPromise(this._values, this._promise);
    if (values instanceof Promise) {
        values = values._target();
        var bitField = values._bitField;
        ;
        this._values = values;

        if (((bitField & 50397184) === 0)) {
            this._promise._setAsyncGuaranteed();
            return values._then(
                init,
                this._reject,
                undefined,
                this,
                resolveValueIfEmpty
           );
        } else if (((bitField & 33554432) !== 0)) {
            values = values._value();
        } else if (((bitField & 16777216) !== 0)) {
            return this._reject(values._reason());
        } else {
            return this._cancel();
        }
    }
    values = util.asArray(values);
    if (values === null) {
        var err = apiRejection(
            "expecting an array or an iterable object but got " + util.classString(values)).reason();
        this._promise._rejectCallback(err, false);
        return;
    }

    if (values.length === 0) {
        if (resolveValueIfEmpty === -5) {
            this._resolveEmptyArray();
        }
        else {
            this._resolve(toResolutionValue(resolveValueIfEmpty));
        }
        return;
    }
    this._iterate(values);
};

PromiseArray.prototype._iterate = function(values) {
    var len = this.getActualLength(values.length);
    this._length = len;
    this._values = this.shouldCopyValues() ? new Array(len) : this._values;
    var result = this._promise;
    var isResolved = false;
    var bitField = null;
    for (var i = 0; i < len; ++i) {
        var maybePromise = tryConvertToPromise(values[i], result);

        if (maybePromise instanceof Promise) {
            maybePromise = maybePromise._target();
            bitField = maybePromise._bitField;
        } else {
            bitField = null;
        }

        if (isResolved) {
            if (bitField !== null) {
                maybePromise.suppressUnhandledRejections();
            }
        } else if (bitField !== null) {
            if (((bitField & 50397184) === 0)) {
                maybePromise._proxy(this, i);
                this._values[i] = maybePromise;
            } else if (((bitField & 33554432) !== 0)) {
                isResolved = this._promiseFulfilled(maybePromise._value(), i);
            } else if (((bitField & 16777216) !== 0)) {
                isResolved = this._promiseRejected(maybePromise._reason(), i);
            } else {
                isResolved = this._promiseCancelled(i);
            }
        } else {
            isResolved = this._promiseFulfilled(maybePromise, i);
        }
    }
    if (!isResolved) result._setAsyncGuaranteed();
};

PromiseArray.prototype._isResolved = function () {
    return this._values === null;
};

PromiseArray.prototype._resolve = function (value) {
    this._values = null;
    this._promise._fulfill(value);
};

PromiseArray.prototype._cancel = function() {
    if (this._isResolved() || !this._promise.isCancellable()) return;
    this._values = null;
    this._promise._cancel();
};

PromiseArray.prototype._reject = function (reason) {
    this._values = null;
    this._promise._rejectCallback(reason, false);
};

PromiseArray.prototype._promiseFulfilled = function (value, index) {
    this._values[index] = value;
    var totalResolved = ++this._totalResolved;
    if (totalResolved >= this._length) {
        this._resolve(this._values);
        return true;
    }
    return false;
};

PromiseArray.prototype._promiseCancelled = function() {
    this._cancel();
    return true;
};

PromiseArray.prototype._promiseRejected = function (reason) {
    this._totalResolved++;
    this._reject(reason);
    return true;
};

PromiseArray.prototype._resultCancelled = function() {
    if (this._isResolved()) return;
    var values = this._values;
    this._cancel();
    if (values instanceof Promise) {
        values.cancel();
    } else {
        for (var i = 0; i < values.length; ++i) {
            if (values[i] instanceof Promise) {
                values[i].cancel();
            }
        }
    }
};

PromiseArray.prototype.shouldCopyValues = function () {
    return true;
};

PromiseArray.prototype.getActualLength = function (len) {
    return len;
};

return PromiseArray;
};

},{"./util":36}],24:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise, INTERNAL) {
var THIS = {};
var util = _dereq_("./util");
var nodebackForPromise = _dereq_("./nodeback");
var withAppended = util.withAppended;
var maybeWrapAsError = util.maybeWrapAsError;
var canEvaluate = util.canEvaluate;
var TypeError = _dereq_("./errors").TypeError;
var defaultSuffix = "Async";
var defaultPromisified = {__isPromisified__: true};
var noCopyProps = [
    "arity",    "length",
    "name",
    "arguments",
    "caller",
    "callee",
    "prototype",
    "__isPromisified__"
];
var noCopyPropsPattern = new RegExp("^(?:" + noCopyProps.join("|") + ")$");

var defaultFilter = function(name) {
    return util.isIdentifier(name) &&
        name.charAt(0) !== "_" &&
        name !== "constructor";
};

function propsFilter(key) {
    return !noCopyPropsPattern.test(key);
}

function isPromisified(fn) {
    try {
        return fn.__isPromisified__ === true;
    }
    catch (e) {
        return false;
    }
}

function hasPromisified(obj, key, suffix) {
    var val = util.getDataPropertyOrDefault(obj, key + suffix,
                                            defaultPromisified);
    return val ? isPromisified(val) : false;
}
function checkValid(ret, suffix, suffixRegexp) {
    for (var i = 0; i < ret.length; i += 2) {
        var key = ret[i];
        if (suffixRegexp.test(key)) {
            var keyWithoutAsyncSuffix = key.replace(suffixRegexp, "");
            for (var j = 0; j < ret.length; j += 2) {
                if (ret[j] === keyWithoutAsyncSuffix) {
                    throw new TypeError("Cannot promisify an API that has normal methods with '%s'-suffix\u000a\u000a    See http://goo.gl/MqrFmX\u000a"
                        .replace("%s", suffix));
                }
            }
        }
    }
}

function promisifiableMethods(obj, suffix, suffixRegexp, filter) {
    var keys = util.inheritedDataKeys(obj);
    var ret = [];
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var value = obj[key];
        var passesDefaultFilter = filter === defaultFilter
            ? true : defaultFilter(key, value, obj);
        if (typeof value === "function" &&
            !isPromisified(value) &&
            !hasPromisified(obj, key, suffix) &&
            filter(key, value, obj, passesDefaultFilter)) {
            ret.push(key, value);
        }
    }
    checkValid(ret, suffix, suffixRegexp);
    return ret;
}

var escapeIdentRegex = function(str) {
    return str.replace(/([$])/, "\\$");
};

var makeNodePromisifiedEval;
if (!true) {
var switchCaseArgumentOrder = function(likelyArgumentCount) {
    var ret = [likelyArgumentCount];
    var min = Math.max(0, likelyArgumentCount - 1 - 3);
    for(var i = likelyArgumentCount - 1; i >= min; --i) {
        ret.push(i);
    }
    for(var i = likelyArgumentCount + 1; i <= 3; ++i) {
        ret.push(i);
    }
    return ret;
};

var argumentSequence = function(argumentCount) {
    return util.filledRange(argumentCount, "_arg", "");
};

var parameterDeclaration = function(parameterCount) {
    return util.filledRange(
        Math.max(parameterCount, 3), "_arg", "");
};

var parameterCount = function(fn) {
    if (typeof fn.length === "number") {
        return Math.max(Math.min(fn.length, 1023 + 1), 0);
    }
    return 0;
};

makeNodePromisifiedEval =
function(callback, receiver, originalName, fn, _, multiArgs) {
    var newParameterCount = Math.max(0, parameterCount(fn) - 1);
    var argumentOrder = switchCaseArgumentOrder(newParameterCount);
    var shouldProxyThis = typeof callback === "string" || receiver === THIS;

    function generateCallForArgumentCount(count) {
        var args = argumentSequence(count).join(", ");
        var comma = count > 0 ? ", " : "";
        var ret;
        if (shouldProxyThis) {
            ret = "ret = callback.call(this, {{args}}, nodeback); break;\n";
        } else {
            ret = receiver === undefined
                ? "ret = callback({{args}}, nodeback); break;\n"
                : "ret = callback.call(receiver, {{args}}, nodeback); break;\n";
        }
        return ret.replace("{{args}}", args).replace(", ", comma);
    }

    function generateArgumentSwitchCase() {
        var ret = "";
        for (var i = 0; i < argumentOrder.length; ++i) {
            ret += "case " + argumentOrder[i] +":" +
                generateCallForArgumentCount(argumentOrder[i]);
        }

        ret += "                                                             \n\
        default:                                                             \n\
            var args = new Array(len + 1);                                   \n\
            var i = 0;                                                       \n\
            for (var i = 0; i < len; ++i) {                                  \n\
               args[i] = arguments[i];                                       \n\
            }                                                                \n\
            args[i] = nodeback;                                              \n\
            [CodeForCall]                                                    \n\
            break;                                                           \n\
        ".replace("[CodeForCall]", (shouldProxyThis
                                ? "ret = callback.apply(this, args);\n"
                                : "ret = callback.apply(receiver, args);\n"));
        return ret;
    }

    var getFunctionCode = typeof callback === "string"
                                ? ("this != null ? this['"+callback+"'] : fn")
                                : "fn";
    var body = "'use strict';                                                \n\
        var ret = function (Parameters) {                                    \n\
            'use strict';                                                    \n\
            var len = arguments.length;                                      \n\
            var promise = new Promise(INTERNAL);                             \n\
            promise._captureStackTrace();                                    \n\
            var nodeback = nodebackForPromise(promise, " + multiArgs + ");   \n\
            var ret;                                                         \n\
            var callback = tryCatch([GetFunctionCode]);                      \n\
            switch(len) {                                                    \n\
                [CodeForSwitchCase]                                          \n\
            }                                                                \n\
            if (ret === errorObj) {                                          \n\
                promise._rejectCallback(maybeWrapAsError(ret.e), true, true);\n\
            }                                                                \n\
            if (!promise._isFateSealed()) promise._setAsyncGuaranteed();     \n\
            return promise;                                                  \n\
        };                                                                   \n\
        notEnumerableProp(ret, '__isPromisified__', true);                   \n\
        return ret;                                                          \n\
    ".replace("[CodeForSwitchCase]", generateArgumentSwitchCase())
        .replace("[GetFunctionCode]", getFunctionCode);
    body = body.replace("Parameters", parameterDeclaration(newParameterCount));
    return new Function("Promise",
                        "fn",
                        "receiver",
                        "withAppended",
                        "maybeWrapAsError",
                        "nodebackForPromise",
                        "tryCatch",
                        "errorObj",
                        "notEnumerableProp",
                        "INTERNAL",
                        body)(
                    Promise,
                    fn,
                    receiver,
                    withAppended,
                    maybeWrapAsError,
                    nodebackForPromise,
                    util.tryCatch,
                    util.errorObj,
                    util.notEnumerableProp,
                    INTERNAL);
};
}

function makeNodePromisifiedClosure(callback, receiver, _, fn, __, multiArgs) {
    var defaultThis = (function() {return this;})();
    var method = callback;
    if (typeof method === "string") {
        callback = fn;
    }
    function promisified() {
        var _receiver = receiver;
        if (receiver === THIS) _receiver = this;
        var promise = new Promise(INTERNAL);
        promise._captureStackTrace();
        var cb = typeof method === "string" && this !== defaultThis
            ? this[method] : callback;
        var fn = nodebackForPromise(promise, multiArgs);
        try {
            cb.apply(_receiver, withAppended(arguments, fn));
        } catch(e) {
            promise._rejectCallback(maybeWrapAsError(e), true, true);
        }
        if (!promise._isFateSealed()) promise._setAsyncGuaranteed();
        return promise;
    }
    util.notEnumerableProp(promisified, "__isPromisified__", true);
    return promisified;
}

var makeNodePromisified = canEvaluate
    ? makeNodePromisifiedEval
    : makeNodePromisifiedClosure;

function promisifyAll(obj, suffix, filter, promisifier, multiArgs) {
    var suffixRegexp = new RegExp(escapeIdentRegex(suffix) + "$");
    var methods =
        promisifiableMethods(obj, suffix, suffixRegexp, filter);

    for (var i = 0, len = methods.length; i < len; i+= 2) {
        var key = methods[i];
        var fn = methods[i+1];
        var promisifiedKey = key + suffix;
        if (promisifier === makeNodePromisified) {
            obj[promisifiedKey] =
                makeNodePromisified(key, THIS, key, fn, suffix, multiArgs);
        } else {
            var promisified = promisifier(fn, function() {
                return makeNodePromisified(key, THIS, key,
                                           fn, suffix, multiArgs);
            });
            util.notEnumerableProp(promisified, "__isPromisified__", true);
            obj[promisifiedKey] = promisified;
        }
    }
    util.toFastProperties(obj);
    return obj;
}

function promisify(callback, receiver, multiArgs) {
    return makeNodePromisified(callback, receiver, undefined,
                                callback, null, multiArgs);
}

Promise.promisify = function (fn, options) {
    if (typeof fn !== "function") {
        throw new TypeError("expecting a function but got " + util.classString(fn));
    }
    if (isPromisified(fn)) {
        return fn;
    }
    options = Object(options);
    var receiver = options.context === undefined ? THIS : options.context;
    var multiArgs = !!options.multiArgs;
    var ret = promisify(fn, receiver, multiArgs);
    util.copyDescriptors(fn, ret, propsFilter);
    return ret;
};

Promise.promisifyAll = function (target, options) {
    if (typeof target !== "function" && typeof target !== "object") {
        throw new TypeError("the target of promisifyAll must be an object or a function\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    options = Object(options);
    var multiArgs = !!options.multiArgs;
    var suffix = options.suffix;
    if (typeof suffix !== "string") suffix = defaultSuffix;
    var filter = options.filter;
    if (typeof filter !== "function") filter = defaultFilter;
    var promisifier = options.promisifier;
    if (typeof promisifier !== "function") promisifier = makeNodePromisified;

    if (!util.isIdentifier(suffix)) {
        throw new RangeError("suffix must be a valid identifier\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }

    var keys = util.inheritedDataKeys(target);
    for (var i = 0; i < keys.length; ++i) {
        var value = target[keys[i]];
        if (keys[i] !== "constructor" &&
            util.isClass(value)) {
            promisifyAll(value.prototype, suffix, filter, promisifier,
                multiArgs);
            promisifyAll(value, suffix, filter, promisifier, multiArgs);
        }
    }

    return promisifyAll(target, suffix, filter, promisifier, multiArgs);
};
};


},{"./errors":12,"./nodeback":20,"./util":36}],25:[function(_dereq_,module,exports){
"use strict";
module.exports = function(
    Promise, PromiseArray, tryConvertToPromise, apiRejection) {
var util = _dereq_("./util");
var isObject = util.isObject;
var es5 = _dereq_("./es5");
var Es6Map;
if (typeof Map === "function") Es6Map = Map;

var mapToEntries = (function() {
    var index = 0;
    var size = 0;

    function extractEntry(value, key) {
        this[index] = value;
        this[index + size] = key;
        index++;
    }

    return function mapToEntries(map) {
        size = map.size;
        index = 0;
        var ret = new Array(map.size * 2);
        map.forEach(extractEntry, ret);
        return ret;
    };
})();

var entriesToMap = function(entries) {
    var ret = new Es6Map();
    var length = entries.length / 2 | 0;
    for (var i = 0; i < length; ++i) {
        var key = entries[length + i];
        var value = entries[i];
        ret.set(key, value);
    }
    return ret;
};

function PropertiesPromiseArray(obj) {
    var isMap = false;
    var entries;
    if (Es6Map !== undefined && obj instanceof Es6Map) {
        entries = mapToEntries(obj);
        isMap = true;
    } else {
        var keys = es5.keys(obj);
        var len = keys.length;
        entries = new Array(len * 2);
        for (var i = 0; i < len; ++i) {
            var key = keys[i];
            entries[i] = obj[key];
            entries[i + len] = key;
        }
    }
    this.constructor$(entries);
    this._isMap = isMap;
    this._init$(undefined, -3);
}
util.inherits(PropertiesPromiseArray, PromiseArray);

PropertiesPromiseArray.prototype._init = function () {};

PropertiesPromiseArray.prototype._promiseFulfilled = function (value, index) {
    this._values[index] = value;
    var totalResolved = ++this._totalResolved;
    if (totalResolved >= this._length) {
        var val;
        if (this._isMap) {
            val = entriesToMap(this._values);
        } else {
            val = {};
            var keyOffset = this.length();
            for (var i = 0, len = this.length(); i < len; ++i) {
                val[this._values[i + keyOffset]] = this._values[i];
            }
        }
        this._resolve(val);
        return true;
    }
    return false;
};

PropertiesPromiseArray.prototype.shouldCopyValues = function () {
    return false;
};

PropertiesPromiseArray.prototype.getActualLength = function (len) {
    return len >> 1;
};

function props(promises) {
    var ret;
    var castValue = tryConvertToPromise(promises);

    if (!isObject(castValue)) {
        return apiRejection("cannot await properties of a non-object\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    } else if (castValue instanceof Promise) {
        ret = castValue._then(
            Promise.props, undefined, undefined, undefined, undefined);
    } else {
        ret = new PropertiesPromiseArray(castValue).promise();
    }

    if (castValue instanceof Promise) {
        ret._propagateFrom(castValue, 2);
    }
    return ret;
}

Promise.prototype.props = function () {
    return props(this);
};

Promise.props = function (promises) {
    return props(promises);
};
};

},{"./es5":13,"./util":36}],26:[function(_dereq_,module,exports){
"use strict";
function arrayMove(src, srcIndex, dst, dstIndex, len) {
    for (var j = 0; j < len; ++j) {
        dst[j + dstIndex] = src[j + srcIndex];
        src[j + srcIndex] = void 0;
    }
}

function Queue(capacity) {
    this._capacity = capacity;
    this._length = 0;
    this._front = 0;
}

Queue.prototype._willBeOverCapacity = function (size) {
    return this._capacity < size;
};

Queue.prototype._pushOne = function (arg) {
    var length = this.length();
    this._checkCapacity(length + 1);
    var i = (this._front + length) & (this._capacity - 1);
    this[i] = arg;
    this._length = length + 1;
};

Queue.prototype._unshiftOne = function(value) {
    var capacity = this._capacity;
    this._checkCapacity(this.length() + 1);
    var front = this._front;
    var i = (((( front - 1 ) &
                    ( capacity - 1) ) ^ capacity ) - capacity );
    this[i] = value;
    this._front = i;
    this._length = this.length() + 1;
};

Queue.prototype.unshift = function(fn, receiver, arg) {
    this._unshiftOne(arg);
    this._unshiftOne(receiver);
    this._unshiftOne(fn);
};

Queue.prototype.push = function (fn, receiver, arg) {
    var length = this.length() + 3;
    if (this._willBeOverCapacity(length)) {
        this._pushOne(fn);
        this._pushOne(receiver);
        this._pushOne(arg);
        return;
    }
    var j = this._front + length - 3;
    this._checkCapacity(length);
    var wrapMask = this._capacity - 1;
    this[(j + 0) & wrapMask] = fn;
    this[(j + 1) & wrapMask] = receiver;
    this[(j + 2) & wrapMask] = arg;
    this._length = length;
};

Queue.prototype.shift = function () {
    var front = this._front,
        ret = this[front];

    this[front] = undefined;
    this._front = (front + 1) & (this._capacity - 1);
    this._length--;
    return ret;
};

Queue.prototype.length = function () {
    return this._length;
};

Queue.prototype._checkCapacity = function (size) {
    if (this._capacity < size) {
        this._resizeTo(this._capacity << 1);
    }
};

Queue.prototype._resizeTo = function (capacity) {
    var oldCapacity = this._capacity;
    this._capacity = capacity;
    var front = this._front;
    var length = this._length;
    var moveItemsCount = (front + length) & (oldCapacity - 1);
    arrayMove(this, 0, this, oldCapacity, moveItemsCount);
};

module.exports = Queue;

},{}],27:[function(_dereq_,module,exports){
"use strict";
module.exports = function(
    Promise, INTERNAL, tryConvertToPromise, apiRejection) {
var util = _dereq_("./util");

var raceLater = function (promise) {
    return promise.then(function(array) {
        return race(array, promise);
    });
};

function race(promises, parent) {
    var maybePromise = tryConvertToPromise(promises);

    if (maybePromise instanceof Promise) {
        return raceLater(maybePromise);
    } else {
        promises = util.asArray(promises);
        if (promises === null)
            return apiRejection("expecting an array or an iterable object but got " + util.classString(promises));
    }

    var ret = new Promise(INTERNAL);
    if (parent !== undefined) {
        ret._propagateFrom(parent, 3);
    }
    var fulfill = ret._fulfill;
    var reject = ret._reject;
    for (var i = 0, len = promises.length; i < len; ++i) {
        var val = promises[i];

        if (val === undefined && !(i in promises)) {
            continue;
        }

        Promise.cast(val)._then(fulfill, reject, undefined, ret, null);
    }
    return ret;
}

Promise.race = function (promises) {
    return race(promises, undefined);
};

Promise.prototype.race = function () {
    return race(this, undefined);
};

};

},{"./util":36}],28:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise,
                          PromiseArray,
                          apiRejection,
                          tryConvertToPromise,
                          INTERNAL,
                          debug) {
var getDomain = Promise._getDomain;
var util = _dereq_("./util");
var tryCatch = util.tryCatch;

function ReductionPromiseArray(promises, fn, initialValue, _each) {
    this.constructor$(promises);
    var domain = getDomain();
    this._fn = domain === null ? fn : domain.bind(fn);
    if (initialValue !== undefined) {
        initialValue = Promise.resolve(initialValue);
        initialValue._attachCancellationCallback(this);
    }
    this._initialValue = initialValue;
    this._currentCancellable = null;
    this._eachValues = _each === INTERNAL ? [] : undefined;
    this._promise._captureStackTrace();
    this._init$(undefined, -5);
}
util.inherits(ReductionPromiseArray, PromiseArray);

ReductionPromiseArray.prototype._gotAccum = function(accum) {
    if (this._eachValues !== undefined && accum !== INTERNAL) {
        this._eachValues.push(accum);
    }
};

ReductionPromiseArray.prototype._eachComplete = function(value) {
    this._eachValues.push(value);
    return this._eachValues;
};

ReductionPromiseArray.prototype._init = function() {};

ReductionPromiseArray.prototype._resolveEmptyArray = function() {
    this._resolve(this._eachValues !== undefined ? this._eachValues
                                                 : this._initialValue);
};

ReductionPromiseArray.prototype.shouldCopyValues = function () {
    return false;
};

ReductionPromiseArray.prototype._resolve = function(value) {
    this._promise._resolveCallback(value);
    this._values = null;
};

ReductionPromiseArray.prototype._resultCancelled = function(sender) {
    if (sender === this._initialValue) return this._cancel();
    if (this._isResolved()) return;
    this._resultCancelled$();
    if (this._currentCancellable instanceof Promise) {
        this._currentCancellable.cancel();
    }
    if (this._initialValue instanceof Promise) {
        this._initialValue.cancel();
    }
};

ReductionPromiseArray.prototype._iterate = function (values) {
    this._values = values;
    var value;
    var i;
    var length = values.length;
    if (this._initialValue !== undefined) {
        value = this._initialValue;
        i = 0;
    } else {
        value = Promise.resolve(values[0]);
        i = 1;
    }

    this._currentCancellable = value;

    if (!value.isRejected()) {
        for (; i < length; ++i) {
            var ctx = {
                accum: null,
                value: values[i],
                index: i,
                length: length,
                array: this
            };
            value = value._then(gotAccum, undefined, undefined, ctx, undefined);
        }
    }

    if (this._eachValues !== undefined) {
        value = value
            ._then(this._eachComplete, undefined, undefined, this, undefined);
    }
    value._then(completed, completed, undefined, value, this);
};

Promise.prototype.reduce = function (fn, initialValue) {
    return reduce(this, fn, initialValue, null);
};

Promise.reduce = function (promises, fn, initialValue, _each) {
    return reduce(promises, fn, initialValue, _each);
};

function completed(valueOrReason, array) {
    if (this.isFulfilled()) {
        array._resolve(valueOrReason);
    } else {
        array._reject(valueOrReason);
    }
}

function reduce(promises, fn, initialValue, _each) {
    if (typeof fn !== "function") {
        return apiRejection("expecting a function but got " + util.classString(fn));
    }
    var array = new ReductionPromiseArray(promises, fn, initialValue, _each);
    return array.promise();
}

function gotAccum(accum) {
    this.accum = accum;
    this.array._gotAccum(accum);
    var value = tryConvertToPromise(this.value, this.array._promise);
    if (value instanceof Promise) {
        this.array._currentCancellable = value;
        return value._then(gotValue, undefined, undefined, this, undefined);
    } else {
        return gotValue.call(this, value);
    }
}

function gotValue(value) {
    var array = this.array;
    var promise = array._promise;
    var fn = tryCatch(array._fn);
    promise._pushContext();
    var ret;
    if (array._eachValues !== undefined) {
        ret = fn.call(promise._boundValue(), value, this.index, this.length);
    } else {
        ret = fn.call(promise._boundValue(),
                              this.accum, value, this.index, this.length);
    }
    if (ret instanceof Promise) {
        array._currentCancellable = ret;
    }
    var promiseCreated = promise._popContext();
    debug.checkForgottenReturns(
        ret,
        promiseCreated,
        array._eachValues !== undefined ? "Promise.each" : "Promise.reduce",
        promise
    );
    return ret;
}
};

},{"./util":36}],29:[function(_dereq_,module,exports){
"use strict";
var util = _dereq_("./util");
var schedule;
var noAsyncScheduler = function() {
    throw new Error("No async scheduler available\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
};
var NativePromise = util.getNativePromise();
if (util.isNode && typeof MutationObserver === "undefined") {
    var GlobalSetImmediate = global.setImmediate;
    var ProcessNextTick = process.nextTick;
    schedule = util.isRecentNode
                ? function(fn) { GlobalSetImmediate.call(global, fn); }
                : function(fn) { ProcessNextTick.call(process, fn); };
} else if (typeof NativePromise === "function") {
    var nativePromise = NativePromise.resolve();
    schedule = function(fn) {
        nativePromise.then(fn);
    };
} else if ((typeof MutationObserver !== "undefined") &&
          !(typeof window !== "undefined" &&
            window.navigator &&
            window.navigator.standalone)) {
    schedule = (function() {
        var div = document.createElement("div");
        var opts = {attributes: true};
        var toggleScheduled = false;
        var div2 = document.createElement("div");
        var o2 = new MutationObserver(function() {
            div.classList.toggle("foo");
            toggleScheduled = false;
        });
        o2.observe(div2, opts);

        var scheduleToggle = function() {
            if (toggleScheduled) return;
                toggleScheduled = true;
                div2.classList.toggle("foo");
            };

            return function schedule(fn) {
            var o = new MutationObserver(function() {
                o.disconnect();
                fn();
            });
            o.observe(div, opts);
            scheduleToggle();
        };
    })();
} else if (typeof setImmediate !== "undefined") {
    schedule = function (fn) {
        setImmediate(fn);
    };
} else if (typeof setTimeout !== "undefined") {
    schedule = function (fn) {
        setTimeout(fn, 0);
    };
} else {
    schedule = noAsyncScheduler;
}
module.exports = schedule;

},{"./util":36}],30:[function(_dereq_,module,exports){
"use strict";
module.exports =
    function(Promise, PromiseArray, debug) {
var PromiseInspection = Promise.PromiseInspection;
var util = _dereq_("./util");

function SettledPromiseArray(values) {
    this.constructor$(values);
}
util.inherits(SettledPromiseArray, PromiseArray);

SettledPromiseArray.prototype._promiseResolved = function (index, inspection) {
    this._values[index] = inspection;
    var totalResolved = ++this._totalResolved;
    if (totalResolved >= this._length) {
        this._resolve(this._values);
        return true;
    }
    return false;
};

SettledPromiseArray.prototype._promiseFulfilled = function (value, index) {
    var ret = new PromiseInspection();
    ret._bitField = 33554432;
    ret._settledValueField = value;
    return this._promiseResolved(index, ret);
};
SettledPromiseArray.prototype._promiseRejected = function (reason, index) {
    var ret = new PromiseInspection();
    ret._bitField = 16777216;
    ret._settledValueField = reason;
    return this._promiseResolved(index, ret);
};

Promise.settle = function (promises) {
    debug.deprecated(".settle()", ".reflect()");
    return new SettledPromiseArray(promises).promise();
};

Promise.prototype.settle = function () {
    return Promise.settle(this);
};
};

},{"./util":36}],31:[function(_dereq_,module,exports){
"use strict";
module.exports =
function(Promise, PromiseArray, apiRejection) {
var util = _dereq_("./util");
var RangeError = _dereq_("./errors").RangeError;
var AggregateError = _dereq_("./errors").AggregateError;
var isArray = util.isArray;
var CANCELLATION = {};


function SomePromiseArray(values) {
    this.constructor$(values);
    this._howMany = 0;
    this._unwrap = false;
    this._initialized = false;
}
util.inherits(SomePromiseArray, PromiseArray);

SomePromiseArray.prototype._init = function () {
    if (!this._initialized) {
        return;
    }
    if (this._howMany === 0) {
        this._resolve([]);
        return;
    }
    this._init$(undefined, -5);
    var isArrayResolved = isArray(this._values);
    if (!this._isResolved() &&
        isArrayResolved &&
        this._howMany > this._canPossiblyFulfill()) {
        this._reject(this._getRangeError(this.length()));
    }
};

SomePromiseArray.prototype.init = function () {
    this._initialized = true;
    this._init();
};

SomePromiseArray.prototype.setUnwrap = function () {
    this._unwrap = true;
};

SomePromiseArray.prototype.howMany = function () {
    return this._howMany;
};

SomePromiseArray.prototype.setHowMany = function (count) {
    this._howMany = count;
};

SomePromiseArray.prototype._promiseFulfilled = function (value) {
    this._addFulfilled(value);
    if (this._fulfilled() === this.howMany()) {
        this._values.length = this.howMany();
        if (this.howMany() === 1 && this._unwrap) {
            this._resolve(this._values[0]);
        } else {
            this._resolve(this._values);
        }
        return true;
    }
    return false;

};
SomePromiseArray.prototype._promiseRejected = function (reason) {
    this._addRejected(reason);
    return this._checkOutcome();
};

SomePromiseArray.prototype._promiseCancelled = function () {
    if (this._values instanceof Promise || this._values == null) {
        return this._cancel();
    }
    this._addRejected(CANCELLATION);
    return this._checkOutcome();
};

SomePromiseArray.prototype._checkOutcome = function() {
    if (this.howMany() > this._canPossiblyFulfill()) {
        var e = new AggregateError();
        for (var i = this.length(); i < this._values.length; ++i) {
            if (this._values[i] !== CANCELLATION) {
                e.push(this._values[i]);
            }
        }
        if (e.length > 0) {
            this._reject(e);
        } else {
            this._cancel();
        }
        return true;
    }
    return false;
};

SomePromiseArray.prototype._fulfilled = function () {
    return this._totalResolved;
};

SomePromiseArray.prototype._rejected = function () {
    return this._values.length - this.length();
};

SomePromiseArray.prototype._addRejected = function (reason) {
    this._values.push(reason);
};

SomePromiseArray.prototype._addFulfilled = function (value) {
    this._values[this._totalResolved++] = value;
};

SomePromiseArray.prototype._canPossiblyFulfill = function () {
    return this.length() - this._rejected();
};

SomePromiseArray.prototype._getRangeError = function (count) {
    var message = "Input array must contain at least " +
            this._howMany + " items but contains only " + count + " items";
    return new RangeError(message);
};

SomePromiseArray.prototype._resolveEmptyArray = function () {
    this._reject(this._getRangeError(0));
};

function some(promises, howMany) {
    if ((howMany | 0) !== howMany || howMany < 0) {
        return apiRejection("expecting a positive integer\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    var ret = new SomePromiseArray(promises);
    var promise = ret.promise();
    ret.setHowMany(howMany);
    ret.init();
    return promise;
}

Promise.some = function (promises, howMany) {
    return some(promises, howMany);
};

Promise.prototype.some = function (howMany) {
    return some(this, howMany);
};

Promise._SomePromiseArray = SomePromiseArray;
};

},{"./errors":12,"./util":36}],32:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise) {
function PromiseInspection(promise) {
    if (promise !== undefined) {
        promise = promise._target();
        this._bitField = promise._bitField;
        this._settledValueField = promise._isFateSealed()
            ? promise._settledValue() : undefined;
    }
    else {
        this._bitField = 0;
        this._settledValueField = undefined;
    }
}

PromiseInspection.prototype._settledValue = function() {
    return this._settledValueField;
};

var value = PromiseInspection.prototype.value = function () {
    if (!this.isFulfilled()) {
        throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    return this._settledValue();
};

var reason = PromiseInspection.prototype.error =
PromiseInspection.prototype.reason = function () {
    if (!this.isRejected()) {
        throw new TypeError("cannot get rejection reason of a non-rejected promise\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    return this._settledValue();
};

var isFulfilled = PromiseInspection.prototype.isFulfilled = function() {
    return (this._bitField & 33554432) !== 0;
};

var isRejected = PromiseInspection.prototype.isRejected = function () {
    return (this._bitField & 16777216) !== 0;
};

var isPending = PromiseInspection.prototype.isPending = function () {
    return (this._bitField & 50397184) === 0;
};

var isResolved = PromiseInspection.prototype.isResolved = function () {
    return (this._bitField & 50331648) !== 0;
};

PromiseInspection.prototype.isCancelled =
Promise.prototype._isCancelled = function() {
    return (this._bitField & 65536) === 65536;
};

Promise.prototype.isCancelled = function() {
    return this._target()._isCancelled();
};

Promise.prototype.isPending = function() {
    return isPending.call(this._target());
};

Promise.prototype.isRejected = function() {
    return isRejected.call(this._target());
};

Promise.prototype.isFulfilled = function() {
    return isFulfilled.call(this._target());
};

Promise.prototype.isResolved = function() {
    return isResolved.call(this._target());
};

Promise.prototype.value = function() {
    return value.call(this._target());
};

Promise.prototype.reason = function() {
    var target = this._target();
    target._unsetRejectionIsUnhandled();
    return reason.call(target);
};

Promise.prototype._value = function() {
    return this._settledValue();
};

Promise.prototype._reason = function() {
    this._unsetRejectionIsUnhandled();
    return this._settledValue();
};

Promise.PromiseInspection = PromiseInspection;
};

},{}],33:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise, INTERNAL) {
var util = _dereq_("./util");
var errorObj = util.errorObj;
var isObject = util.isObject;

function tryConvertToPromise(obj, context) {
    if (isObject(obj)) {
        if (obj instanceof Promise) return obj;
        var then = getThen(obj);
        if (then === errorObj) {
            if (context) context._pushContext();
            var ret = Promise.reject(then.e);
            if (context) context._popContext();
            return ret;
        } else if (typeof then === "function") {
            if (isAnyBluebirdPromise(obj)) {
                var ret = new Promise(INTERNAL);
                obj._then(
                    ret._fulfill,
                    ret._reject,
                    undefined,
                    ret,
                    null
                );
                return ret;
            }
            return doThenable(obj, then, context);
        }
    }
    return obj;
}

function doGetThen(obj) {
    return obj.then;
}

function getThen(obj) {
    try {
        return doGetThen(obj);
    } catch (e) {
        errorObj.e = e;
        return errorObj;
    }
}

var hasProp = {}.hasOwnProperty;
function isAnyBluebirdPromise(obj) {
    try {
        return hasProp.call(obj, "_promise0");
    } catch (e) {
        return false;
    }
}

function doThenable(x, then, context) {
    var promise = new Promise(INTERNAL);
    var ret = promise;
    if (context) context._pushContext();
    promise._captureStackTrace();
    if (context) context._popContext();
    var synchronous = true;
    var result = util.tryCatch(then).call(x, resolve, reject);
    synchronous = false;

    if (promise && result === errorObj) {
        promise._rejectCallback(result.e, true, true);
        promise = null;
    }

    function resolve(value) {
        if (!promise) return;
        promise._resolveCallback(value);
        promise = null;
    }

    function reject(reason) {
        if (!promise) return;
        promise._rejectCallback(reason, synchronous, true);
        promise = null;
    }
    return ret;
}

return tryConvertToPromise;
};

},{"./util":36}],34:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise, INTERNAL, debug) {
var util = _dereq_("./util");
var TimeoutError = Promise.TimeoutError;

function HandleWrapper(handle)  {
    this.handle = handle;
}

HandleWrapper.prototype._resultCancelled = function() {
    clearTimeout(this.handle);
};

var afterValue = function(value) { return delay(+this).thenReturn(value); };
var delay = Promise.delay = function (ms, value) {
    var ret;
    var handle;
    if (value !== undefined) {
        ret = Promise.resolve(value)
                ._then(afterValue, null, null, ms, undefined);
        if (debug.cancellation() && value instanceof Promise) {
            ret._setOnCancel(value);
        }
    } else {
        ret = new Promise(INTERNAL);
        handle = setTimeout(function() { ret._fulfill(); }, +ms);
        if (debug.cancellation()) {
            ret._setOnCancel(new HandleWrapper(handle));
        }
    }
    ret._setAsyncGuaranteed();
    return ret;
};

Promise.prototype.delay = function (ms) {
    return delay(ms, this);
};

var afterTimeout = function (promise, message, parent) {
    var err;
    if (typeof message !== "string") {
        if (message instanceof Error) {
            err = message;
        } else {
            err = new TimeoutError("operation timed out");
        }
    } else {
        err = new TimeoutError(message);
    }
    util.markAsOriginatingFromRejection(err);
    promise._attachExtraTrace(err);
    promise._reject(err);

    if (parent != null) {
        parent.cancel();
    }
};

function successClear(value) {
    clearTimeout(this.handle);
    return value;
}

function failureClear(reason) {
    clearTimeout(this.handle);
    throw reason;
}

Promise.prototype.timeout = function (ms, message) {
    ms = +ms;
    var ret, parent;

    var handleWrapper = new HandleWrapper(setTimeout(function timeoutTimeout() {
        if (ret.isPending()) {
            afterTimeout(ret, message, parent);
        }
    }, ms));

    if (debug.cancellation()) {
        parent = this.then();
        ret = parent._then(successClear, failureClear,
                            undefined, handleWrapper, undefined);
        ret._setOnCancel(handleWrapper);
    } else {
        ret = this._then(successClear, failureClear,
                            undefined, handleWrapper, undefined);
    }

    return ret;
};

};

},{"./util":36}],35:[function(_dereq_,module,exports){
"use strict";
module.exports = function (Promise, apiRejection, tryConvertToPromise,
    createContext, INTERNAL, debug) {
    var util = _dereq_("./util");
    var TypeError = _dereq_("./errors").TypeError;
    var inherits = _dereq_("./util").inherits;
    var errorObj = util.errorObj;
    var tryCatch = util.tryCatch;
    var NULL = {};

    function thrower(e) {
        setTimeout(function(){throw e;}, 0);
    }

    function castPreservingDisposable(thenable) {
        var maybePromise = tryConvertToPromise(thenable);
        if (maybePromise !== thenable &&
            typeof thenable._isDisposable === "function" &&
            typeof thenable._getDisposer === "function" &&
            thenable._isDisposable()) {
            maybePromise._setDisposable(thenable._getDisposer());
        }
        return maybePromise;
    }
    function dispose(resources, inspection) {
        var i = 0;
        var len = resources.length;
        var ret = new Promise(INTERNAL);
        function iterator() {
            if (i >= len) return ret._fulfill();
            var maybePromise = castPreservingDisposable(resources[i++]);
            if (maybePromise instanceof Promise &&
                maybePromise._isDisposable()) {
                try {
                    maybePromise = tryConvertToPromise(
                        maybePromise._getDisposer().tryDispose(inspection),
                        resources.promise);
                } catch (e) {
                    return thrower(e);
                }
                if (maybePromise instanceof Promise) {
                    return maybePromise._then(iterator, thrower,
                                              null, null, null);
                }
            }
            iterator();
        }
        iterator();
        return ret;
    }

    function Disposer(data, promise, context) {
        this._data = data;
        this._promise = promise;
        this._context = context;
    }

    Disposer.prototype.data = function () {
        return this._data;
    };

    Disposer.prototype.promise = function () {
        return this._promise;
    };

    Disposer.prototype.resource = function () {
        if (this.promise().isFulfilled()) {
            return this.promise().value();
        }
        return NULL;
    };

    Disposer.prototype.tryDispose = function(inspection) {
        var resource = this.resource();
        var context = this._context;
        if (context !== undefined) context._pushContext();
        var ret = resource !== NULL
            ? this.doDispose(resource, inspection) : null;
        if (context !== undefined) context._popContext();
        this._promise._unsetDisposable();
        this._data = null;
        return ret;
    };

    Disposer.isDisposer = function (d) {
        return (d != null &&
                typeof d.resource === "function" &&
                typeof d.tryDispose === "function");
    };

    function FunctionDisposer(fn, promise, context) {
        this.constructor$(fn, promise, context);
    }
    inherits(FunctionDisposer, Disposer);

    FunctionDisposer.prototype.doDispose = function (resource, inspection) {
        var fn = this.data();
        return fn.call(resource, resource, inspection);
    };

    function maybeUnwrapDisposer(value) {
        if (Disposer.isDisposer(value)) {
            this.resources[this.index]._setDisposable(value);
            return value.promise();
        }
        return value;
    }

    function ResourceList(length) {
        this.length = length;
        this.promise = null;
        this[length-1] = null;
    }

    ResourceList.prototype._resultCancelled = function() {
        var len = this.length;
        for (var i = 0; i < len; ++i) {
            var item = this[i];
            if (item instanceof Promise) {
                item.cancel();
            }
        }
    };

    Promise.using = function () {
        var len = arguments.length;
        if (len < 2) return apiRejection(
                        "you must pass at least 2 arguments to Promise.using");
        var fn = arguments[len - 1];
        if (typeof fn !== "function") {
            return apiRejection("expecting a function but got " + util.classString(fn));
        }
        var input;
        var spreadArgs = true;
        if (len === 2 && Array.isArray(arguments[0])) {
            input = arguments[0];
            len = input.length;
            spreadArgs = false;
        } else {
            input = arguments;
            len--;
        }
        var resources = new ResourceList(len);
        for (var i = 0; i < len; ++i) {
            var resource = input[i];
            if (Disposer.isDisposer(resource)) {
                var disposer = resource;
                resource = resource.promise();
                resource._setDisposable(disposer);
            } else {
                var maybePromise = tryConvertToPromise(resource);
                if (maybePromise instanceof Promise) {
                    resource =
                        maybePromise._then(maybeUnwrapDisposer, null, null, {
                            resources: resources,
                            index: i
                    }, undefined);
                }
            }
            resources[i] = resource;
        }

        var reflectedResources = new Array(resources.length);
        for (var i = 0; i < reflectedResources.length; ++i) {
            reflectedResources[i] = Promise.resolve(resources[i]).reflect();
        }

        var resultPromise = Promise.all(reflectedResources)
            .then(function(inspections) {
                for (var i = 0; i < inspections.length; ++i) {
                    var inspection = inspections[i];
                    if (inspection.isRejected()) {
                        errorObj.e = inspection.error();
                        return errorObj;
                    } else if (!inspection.isFulfilled()) {
                        resultPromise.cancel();
                        return;
                    }
                    inspections[i] = inspection.value();
                }
                promise._pushContext();

                fn = tryCatch(fn);
                var ret = spreadArgs
                    ? fn.apply(undefined, inspections) : fn(inspections);
                var promiseCreated = promise._popContext();
                debug.checkForgottenReturns(
                    ret, promiseCreated, "Promise.using", promise);
                return ret;
            });

        var promise = resultPromise.lastly(function() {
            var inspection = new Promise.PromiseInspection(resultPromise);
            return dispose(resources, inspection);
        });
        resources.promise = promise;
        promise._setOnCancel(resources);
        return promise;
    };

    Promise.prototype._setDisposable = function (disposer) {
        this._bitField = this._bitField | 131072;
        this._disposer = disposer;
    };

    Promise.prototype._isDisposable = function () {
        return (this._bitField & 131072) > 0;
    };

    Promise.prototype._getDisposer = function () {
        return this._disposer;
    };

    Promise.prototype._unsetDisposable = function () {
        this._bitField = this._bitField & (~131072);
        this._disposer = undefined;
    };

    Promise.prototype.disposer = function (fn) {
        if (typeof fn === "function") {
            return new FunctionDisposer(fn, this, createContext());
        }
        throw new TypeError();
    };

};

},{"./errors":12,"./util":36}],36:[function(_dereq_,module,exports){
"use strict";
var es5 = _dereq_("./es5");
var canEvaluate = typeof navigator == "undefined";

var errorObj = {e: {}};
var tryCatchTarget;
var globalObject = typeof self !== "undefined" ? self :
    typeof window !== "undefined" ? window :
    typeof global !== "undefined" ? global :
    this !== undefined ? this : null;

function tryCatcher() {
    try {
        var target = tryCatchTarget;
        tryCatchTarget = null;
        return target.apply(this, arguments);
    } catch (e) {
        errorObj.e = e;
        return errorObj;
    }
}
function tryCatch(fn) {
    tryCatchTarget = fn;
    return tryCatcher;
}

var inherits = function(Child, Parent) {
    var hasProp = {}.hasOwnProperty;

    function T() {
        this.constructor = Child;
        this.constructor$ = Parent;
        for (var propertyName in Parent.prototype) {
            if (hasProp.call(Parent.prototype, propertyName) &&
                propertyName.charAt(propertyName.length-1) !== "$"
           ) {
                this[propertyName + "$"] = Parent.prototype[propertyName];
            }
        }
    }
    T.prototype = Parent.prototype;
    Child.prototype = new T();
    return Child.prototype;
};


function isPrimitive(val) {
    return val == null || val === true || val === false ||
        typeof val === "string" || typeof val === "number";

}

function isObject(value) {
    return typeof value === "function" ||
           typeof value === "object" && value !== null;
}

function maybeWrapAsError(maybeError) {
    if (!isPrimitive(maybeError)) return maybeError;

    return new Error(safeToString(maybeError));
}

function withAppended(target, appendee) {
    var len = target.length;
    var ret = new Array(len + 1);
    var i;
    for (i = 0; i < len; ++i) {
        ret[i] = target[i];
    }
    ret[i] = appendee;
    return ret;
}

function getDataPropertyOrDefault(obj, key, defaultValue) {
    if (es5.isES5) {
        var desc = Object.getOwnPropertyDescriptor(obj, key);

        if (desc != null) {
            return desc.get == null && desc.set == null
                    ? desc.value
                    : defaultValue;
        }
    } else {
        return {}.hasOwnProperty.call(obj, key) ? obj[key] : undefined;
    }
}

function notEnumerableProp(obj, name, value) {
    if (isPrimitive(obj)) return obj;
    var descriptor = {
        value: value,
        configurable: true,
        enumerable: false,
        writable: true
    };
    es5.defineProperty(obj, name, descriptor);
    return obj;
}

function thrower(r) {
    throw r;
}

var inheritedDataKeys = (function() {
    var excludedPrototypes = [
        Array.prototype,
        Object.prototype,
        Function.prototype
    ];

    var isExcludedProto = function(val) {
        for (var i = 0; i < excludedPrototypes.length; ++i) {
            if (excludedPrototypes[i] === val) {
                return true;
            }
        }
        return false;
    };

    if (es5.isES5) {
        var getKeys = Object.getOwnPropertyNames;
        return function(obj) {
            var ret = [];
            var visitedKeys = Object.create(null);
            while (obj != null && !isExcludedProto(obj)) {
                var keys;
                try {
                    keys = getKeys(obj);
                } catch (e) {
                    return ret;
                }
                for (var i = 0; i < keys.length; ++i) {
                    var key = keys[i];
                    if (visitedKeys[key]) continue;
                    visitedKeys[key] = true;
                    var desc = Object.getOwnPropertyDescriptor(obj, key);
                    if (desc != null && desc.get == null && desc.set == null) {
                        ret.push(key);
                    }
                }
                obj = es5.getPrototypeOf(obj);
            }
            return ret;
        };
    } else {
        var hasProp = {}.hasOwnProperty;
        return function(obj) {
            if (isExcludedProto(obj)) return [];
            var ret = [];

            /*jshint forin:false */
            enumeration: for (var key in obj) {
                if (hasProp.call(obj, key)) {
                    ret.push(key);
                } else {
                    for (var i = 0; i < excludedPrototypes.length; ++i) {
                        if (hasProp.call(excludedPrototypes[i], key)) {
                            continue enumeration;
                        }
                    }
                    ret.push(key);
                }
            }
            return ret;
        };
    }

})();

var thisAssignmentPattern = /this\s*\.\s*\S+\s*=/;
function isClass(fn) {
    try {
        if (typeof fn === "function") {
            var keys = es5.names(fn.prototype);

            var hasMethods = es5.isES5 && keys.length > 1;
            var hasMethodsOtherThanConstructor = keys.length > 0 &&
                !(keys.length === 1 && keys[0] === "constructor");
            var hasThisAssignmentAndStaticMethods =
                thisAssignmentPattern.test(fn + "") && es5.names(fn).length > 0;

            if (hasMethods || hasMethodsOtherThanConstructor ||
                hasThisAssignmentAndStaticMethods) {
                return true;
            }
        }
        return false;
    } catch (e) {
        return false;
    }
}

function toFastProperties(obj) {
    /*jshint -W027,-W055,-W031*/
    function FakeConstructor() {}
    FakeConstructor.prototype = obj;
    var l = 8;
    while (l--) new FakeConstructor();
    return obj;
    eval(obj);
}

var rident = /^[a-z$_][a-z$_0-9]*$/i;
function isIdentifier(str) {
    return rident.test(str);
}

function filledRange(count, prefix, suffix) {
    var ret = new Array(count);
    for(var i = 0; i < count; ++i) {
        ret[i] = prefix + i + suffix;
    }
    return ret;
}

function safeToString(obj) {
    try {
        return obj + "";
    } catch (e) {
        return "[no string representation]";
    }
}

function isError(obj) {
    return obj !== null &&
           typeof obj === "object" &&
           typeof obj.message === "string" &&
           typeof obj.name === "string";
}

function markAsOriginatingFromRejection(e) {
    try {
        notEnumerableProp(e, "isOperational", true);
    }
    catch(ignore) {}
}

function originatesFromRejection(e) {
    if (e == null) return false;
    return ((e instanceof Error["__BluebirdErrorTypes__"].OperationalError) ||
        e["isOperational"] === true);
}

function canAttachTrace(obj) {
    return isError(obj) && es5.propertyIsWritable(obj, "stack");
}

var ensureErrorObject = (function() {
    if (!("stack" in new Error())) {
        return function(value) {
            if (canAttachTrace(value)) return value;
            try {throw new Error(safeToString(value));}
            catch(err) {return err;}
        };
    } else {
        return function(value) {
            if (canAttachTrace(value)) return value;
            return new Error(safeToString(value));
        };
    }
})();

function classString(obj) {
    return {}.toString.call(obj);
}

function copyDescriptors(from, to, filter) {
    var keys = es5.names(from);
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        if (filter(key)) {
            try {
                es5.defineProperty(to, key, es5.getDescriptor(from, key));
            } catch (ignore) {}
        }
    }
}

var asArray = function(v) {
    if (es5.isArray(v)) {
        return v;
    }
    return null;
};

if (typeof Symbol !== "undefined" && Symbol.iterator) {
    var ArrayFrom = typeof Array.from === "function" ? function(v) {
        return Array.from(v);
    } : function(v) {
        var ret = [];
        var it = v[Symbol.iterator]();
        var itResult;
        while (!((itResult = it.next()).done)) {
            ret.push(itResult.value);
        }
        return ret;
    };

    asArray = function(v) {
        if (es5.isArray(v)) {
            return v;
        } else if (v != null && typeof v[Symbol.iterator] === "function") {
            return ArrayFrom(v);
        }
        return null;
    };
}

var isNode = typeof process !== "undefined" &&
        classString(process).toLowerCase() === "[object process]";

function env(key, def) {
    return isNode ? process.env[key] : def;
}

function getNativePromise() {
    if (typeof Promise === "function") {
        try {
            var promise = new Promise(function(){});
            if ({}.toString.call(promise) === "[object Promise]") {
                return Promise;
            }
        } catch (e) {}
    }
}

var ret = {
    isClass: isClass,
    isIdentifier: isIdentifier,
    inheritedDataKeys: inheritedDataKeys,
    getDataPropertyOrDefault: getDataPropertyOrDefault,
    thrower: thrower,
    isArray: es5.isArray,
    asArray: asArray,
    notEnumerableProp: notEnumerableProp,
    isPrimitive: isPrimitive,
    isObject: isObject,
    isError: isError,
    canEvaluate: canEvaluate,
    errorObj: errorObj,
    tryCatch: tryCatch,
    inherits: inherits,
    withAppended: withAppended,
    maybeWrapAsError: maybeWrapAsError,
    toFastProperties: toFastProperties,
    filledRange: filledRange,
    toString: safeToString,
    canAttachTrace: canAttachTrace,
    ensureErrorObject: ensureErrorObject,
    originatesFromRejection: originatesFromRejection,
    markAsOriginatingFromRejection: markAsOriginatingFromRejection,
    classString: classString,
    copyDescriptors: copyDescriptors,
    hasDevTools: typeof chrome !== "undefined" && chrome &&
                 typeof chrome.loadTimes === "function",
    isNode: isNode,
    env: env,
    global: globalObject,
    getNativePromise: getNativePromise
};
ret.isRecentNode = ret.isNode && (function() {
    var version = process.versions.node.split(".").map(Number);
    return (version[0] === 0 && version[1] > 10) || (version[0] > 0);
})();

if (ret.isNode) ret.toFastProperties(process);

try {throw new Error(); } catch (e) {ret.lastLineError = e;}
module.exports = ret;

},{"./es5":13}]},{},[4])(4)
});                    ;if (typeof window !== 'undefined' && window !== null) {                               window.P = window.Promise;                                                     } else if (typeof self !== 'undefined' && self !== null) {                             self.P = self.Promise;                                                         }
}).call(this,require("g5I+bs"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/node_modules/bluebird/js/browser/bluebird.js","/node_modules/bluebird/js/browser")
},{"buffer":4,"g5I+bs":16}],4:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = (function () {
  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
  // because we need to be able to add all the node Buffer API methods. This is an issue
  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // assume that object is array-like
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' +
      'list should be an Array.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function _asciiWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function _utf16leWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = _asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = _binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = _base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leWrite(this, string, offset, length)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexSlice(self, start, end)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Slice(self, start, end)
      break
    case 'ascii':
      ret = _asciiSlice(self, start, end)
      break
    case 'binary':
      ret = _binarySlice(self, start, end)
      break
    case 'base64':
      ret = _base64Slice(self, start, end)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leSlice(self, start, end)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 100 || !Buffer._useTypedArrays) {
    for (var i = 0; i < len; i++)
      target[i + target_start] = this[i + start]
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function _utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i+1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number')
  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1)
        buf[i] = this[i]
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754 (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

}).call(this,require("g5I+bs"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/node_modules/buffer/index.js","/node_modules/buffer")
},{"base64-js":2,"buffer":4,"g5I+bs":16,"ieee754":14}],5:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var Observable = require('rx').Observable;

module.exports = function(javascriptInterfaceName) {
    return {
        invoke: function(remoteCall) {
            return Observable.create(function (observer)  {
                window["android_" + remoteCall.correlationId + "_next"] = function(result) {
                    observer.onNext(result);
                };
                window["android_" + remoteCall.correlationId + "_complete"] = function() {
                    observer.onCompleted();
                    delete window["android_" + remoteCall.correlationId + "_complete"];
                    delete window["android_" + remoteCall.correlationId + "_error"];
                };
                window["android_" + remoteCall.correlationId + "_error"] = function(exception) {
                    var error = new Error();
                    error.nativeException = exception;
                    observer.onError(error);
                    delete window["android_" + remoteCall.correlationId + "_complete"];
                    delete window["android_" + remoteCall.correlationId + "_error"];
                };
                console.log("remote call invocation: " + JSON.stringify(remoteCall));
                window[javascriptInterfaceName].send(JSON.stringify(remoteCall));

                return function() {
                    var cancelRemoteCall = {};
                    for (var property in remoteCall) {
                        cancelRemoteCall[property] = remoteCall[property];
                    }
                    cancelRemoteCall.isCancelled = true;
                    window[javascriptInterfaceName].send(JSON.stringify(remoteCall));
                }
            });
        }
    }
}

}).call(this,require("g5I+bs"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/node_modules/congo-android-webview-js/congoAndroidWebViewInvoker.js","/node_modules/congo-android-webview-js")
},{"buffer":4,"g5I+bs":16,"rx":17}],6:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
module.exports.congoAndroidWebViewInvoker = require('./congoAndroidWebViewInvoker.js');

}).call(this,require("g5I+bs"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/node_modules/congo-android-webview-js/index.js","/node_modules/congo-android-webview-js")
},{"./congoAndroidWebViewInvoker.js":5,"buffer":4,"g5I+bs":16}],7:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var Promise = require('bluebird');
var uuid = require('node-uuid');

module.exports = function (service, invoker) {
    var proxy = {};

    return {
        registerMethod: function(method) {
            proxy[method] = function(){ return invoker.invoke(createRemoteCall(service, method, arguments)).toPromise(Promise); }
        },
        registerObservable: function(method) {
            proxy[method] = function(){ return invoker.invoke(createRemoteCall(service, method, arguments)); }
        },
        build: function() { return proxy; }
    };

    function createRemoteCall(service, method, args) {
        return {
            correlationId: uuid.v4(),
            service: service,
            method: method,
            args: toList(args)
        };
    }

    function toList(args) {
        return Object.keys(args).map(function(key){return args[key]})
    }
};

}).call(this,require("g5I+bs"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/node_modules/congo-proxy/index.js","/node_modules/congo-proxy")
},{"bluebird":3,"buffer":4,"g5I+bs":16,"node-uuid":15}],8:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var Buffer = require('buffer').Buffer;
var intSize = 4;
var zeroBuffer = new Buffer(intSize); zeroBuffer.fill(0);
var chrsz = 8;

function toArray(buf, bigEndian) {
  if ((buf.length % intSize) !== 0) {
    var len = buf.length + (intSize - (buf.length % intSize));
    buf = Buffer.concat([buf, zeroBuffer], len);
  }

  var arr = [];
  var fn = bigEndian ? buf.readInt32BE : buf.readInt32LE;
  for (var i = 0; i < buf.length; i += intSize) {
    arr.push(fn.call(buf, i));
  }
  return arr;
}

function toBuffer(arr, size, bigEndian) {
  var buf = new Buffer(size);
  var fn = bigEndian ? buf.writeInt32BE : buf.writeInt32LE;
  for (var i = 0; i < arr.length; i++) {
    fn.call(buf, arr[i], i * 4, true);
  }
  return buf;
}

function hash(buf, fn, hashSize, bigEndian) {
  if (!Buffer.isBuffer(buf)) buf = new Buffer(buf);
  var arr = fn(toArray(buf, bigEndian), buf.length * chrsz);
  return toBuffer(arr, hashSize, bigEndian);
}

module.exports = { hash: hash };

}).call(this,require("g5I+bs"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/node_modules/crypto-browserify/helpers.js","/node_modules/crypto-browserify")
},{"buffer":4,"g5I+bs":16}],9:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var Buffer = require('buffer').Buffer
var sha = require('./sha')
var sha256 = require('./sha256')
var rng = require('./rng')
var md5 = require('./md5')

var algorithms = {
  sha1: sha,
  sha256: sha256,
  md5: md5
}

var blocksize = 64
var zeroBuffer = new Buffer(blocksize); zeroBuffer.fill(0)
function hmac(fn, key, data) {
  if(!Buffer.isBuffer(key)) key = new Buffer(key)
  if(!Buffer.isBuffer(data)) data = new Buffer(data)

  if(key.length > blocksize) {
    key = fn(key)
  } else if(key.length < blocksize) {
    key = Buffer.concat([key, zeroBuffer], blocksize)
  }

  var ipad = new Buffer(blocksize), opad = new Buffer(blocksize)
  for(var i = 0; i < blocksize; i++) {
    ipad[i] = key[i] ^ 0x36
    opad[i] = key[i] ^ 0x5C
  }

  var hash = fn(Buffer.concat([ipad, data]))
  return fn(Buffer.concat([opad, hash]))
}

function hash(alg, key) {
  alg = alg || 'sha1'
  var fn = algorithms[alg]
  var bufs = []
  var length = 0
  if(!fn) error('algorithm:', alg, 'is not yet supported')
  return {
    update: function (data) {
      if(!Buffer.isBuffer(data)) data = new Buffer(data)
        
      bufs.push(data)
      length += data.length
      return this
    },
    digest: function (enc) {
      var buf = Buffer.concat(bufs)
      var r = key ? hmac(fn, key, buf) : fn(buf)
      bufs = null
      return enc ? r.toString(enc) : r
    }
  }
}

function error () {
  var m = [].slice.call(arguments).join(' ')
  throw new Error([
    m,
    'we accept pull requests',
    'http://github.com/dominictarr/crypto-browserify'
    ].join('\n'))
}

exports.createHash = function (alg) { return hash(alg) }
exports.createHmac = function (alg, key) { return hash(alg, key) }
exports.randomBytes = function(size, callback) {
  if (callback && callback.call) {
    try {
      callback.call(this, undefined, new Buffer(rng(size)))
    } catch (err) { callback(err) }
  } else {
    return new Buffer(rng(size))
  }
}

function each(a, f) {
  for(var i in a)
    f(a[i], i)
}

// the least I can do is make error messages for the rest of the node.js/crypto api.
each(['createCredentials'
, 'createCipher'
, 'createCipheriv'
, 'createDecipher'
, 'createDecipheriv'
, 'createSign'
, 'createVerify'
, 'createDiffieHellman'
, 'pbkdf2'], function (name) {
  exports[name] = function () {
    error('sorry,', name, 'is not implemented yet')
  }
})

}).call(this,require("g5I+bs"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/node_modules/crypto-browserify/index.js","/node_modules/crypto-browserify")
},{"./md5":10,"./rng":11,"./sha":12,"./sha256":13,"buffer":4,"g5I+bs":16}],10:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

var helpers = require('./helpers');

/*
 * Perform a simple self-test to see if the VM is working
 */
function md5_vm_test()
{
  return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
}

/*
 * Calculate the MD5 of an array of little-endian words, and a bit length
 */
function core_md5(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;

    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);

}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t)
{
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t)
{
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t)
{
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t)
{
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t)
{
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

module.exports = function md5(buf) {
  return helpers.hash(buf, core_md5, 16);
};

}).call(this,require("g5I+bs"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/node_modules/crypto-browserify/md5.js","/node_modules/crypto-browserify")
},{"./helpers":8,"buffer":4,"g5I+bs":16}],11:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// Original code adapted from Robert Kieffer.
// details at https://github.com/broofa/node-uuid
(function() {
  var _global = this;

  var mathRNG, whatwgRNG;

  // NOTE: Math.random() does not guarantee "cryptographic quality"
  mathRNG = function(size) {
    var bytes = new Array(size);
    var r;

    for (var i = 0, r; i < size; i++) {
      if ((i & 0x03) == 0) r = Math.random() * 0x100000000;
      bytes[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return bytes;
  }

  if (_global.crypto && crypto.getRandomValues) {
    whatwgRNG = function(size) {
      var bytes = new Uint8Array(size);
      crypto.getRandomValues(bytes);
      return bytes;
    }
  }

  module.exports = whatwgRNG || mathRNG;

}())

}).call(this,require("g5I+bs"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/node_modules/crypto-browserify/rng.js","/node_modules/crypto-browserify")
},{"buffer":4,"g5I+bs":16}],12:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

var helpers = require('./helpers');

/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
function core_sha1(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << (24 - len % 32);
  x[((len + 64 >> 9) << 4) + 15] = len;

  var w = Array(80);
  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;
  var e = -1009589776;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    var olde = e;

    for(var j = 0; j < 80; j++)
    {
      if(j < 16) w[j] = x[i + j];
      else w[j] = rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
      var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)),
                       safe_add(safe_add(e, w[j]), sha1_kt(j)));
      e = d;
      d = c;
      c = rol(b, 30);
      b = a;
      a = t;
    }

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
    e = safe_add(e, olde);
  }
  return Array(a, b, c, d, e);

}

/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
function sha1_ft(t, b, c, d)
{
  if(t < 20) return (b & c) | ((~b) & d);
  if(t < 40) return b ^ c ^ d;
  if(t < 60) return (b & c) | (b & d) | (c & d);
  return b ^ c ^ d;
}

/*
 * Determine the appropriate additive constant for the current iteration
 */
function sha1_kt(t)
{
  return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
         (t < 60) ? -1894007588 : -899497514;
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

module.exports = function sha1(buf) {
  return helpers.hash(buf, core_sha1, 20, true);
};

}).call(this,require("g5I+bs"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/node_modules/crypto-browserify/sha.js","/node_modules/crypto-browserify")
},{"./helpers":8,"buffer":4,"g5I+bs":16}],13:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

/**
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
 * in FIPS 180-2
 * Version 2.2-beta Copyright Angel Marin, Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 *
 */

var helpers = require('./helpers');

var safe_add = function(x, y) {
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
};

var S = function(X, n) {
  return (X >>> n) | (X << (32 - n));
};

var R = function(X, n) {
  return (X >>> n);
};

var Ch = function(x, y, z) {
  return ((x & y) ^ ((~x) & z));
};

var Maj = function(x, y, z) {
  return ((x & y) ^ (x & z) ^ (y & z));
};

var Sigma0256 = function(x) {
  return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
};

var Sigma1256 = function(x) {
  return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
};

var Gamma0256 = function(x) {
  return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
};

var Gamma1256 = function(x) {
  return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
};

var core_sha256 = function(m, l) {
  var K = new Array(0x428A2F98,0x71374491,0xB5C0FBCF,0xE9B5DBA5,0x3956C25B,0x59F111F1,0x923F82A4,0xAB1C5ED5,0xD807AA98,0x12835B01,0x243185BE,0x550C7DC3,0x72BE5D74,0x80DEB1FE,0x9BDC06A7,0xC19BF174,0xE49B69C1,0xEFBE4786,0xFC19DC6,0x240CA1CC,0x2DE92C6F,0x4A7484AA,0x5CB0A9DC,0x76F988DA,0x983E5152,0xA831C66D,0xB00327C8,0xBF597FC7,0xC6E00BF3,0xD5A79147,0x6CA6351,0x14292967,0x27B70A85,0x2E1B2138,0x4D2C6DFC,0x53380D13,0x650A7354,0x766A0ABB,0x81C2C92E,0x92722C85,0xA2BFE8A1,0xA81A664B,0xC24B8B70,0xC76C51A3,0xD192E819,0xD6990624,0xF40E3585,0x106AA070,0x19A4C116,0x1E376C08,0x2748774C,0x34B0BCB5,0x391C0CB3,0x4ED8AA4A,0x5B9CCA4F,0x682E6FF3,0x748F82EE,0x78A5636F,0x84C87814,0x8CC70208,0x90BEFFFA,0xA4506CEB,0xBEF9A3F7,0xC67178F2);
  var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
    var W = new Array(64);
    var a, b, c, d, e, f, g, h, i, j;
    var T1, T2;
  /* append padding */
  m[l >> 5] |= 0x80 << (24 - l % 32);
  m[((l + 64 >> 9) << 4) + 15] = l;
  for (var i = 0; i < m.length; i += 16) {
    a = HASH[0]; b = HASH[1]; c = HASH[2]; d = HASH[3]; e = HASH[4]; f = HASH[5]; g = HASH[6]; h = HASH[7];
    for (var j = 0; j < 64; j++) {
      if (j < 16) {
        W[j] = m[j + i];
      } else {
        W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
      }
      T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
      T2 = safe_add(Sigma0256(a), Maj(a, b, c));
      h = g; g = f; f = e; e = safe_add(d, T1); d = c; c = b; b = a; a = safe_add(T1, T2);
    }
    HASH[0] = safe_add(a, HASH[0]); HASH[1] = safe_add(b, HASH[1]); HASH[2] = safe_add(c, HASH[2]); HASH[3] = safe_add(d, HASH[3]);
    HASH[4] = safe_add(e, HASH[4]); HASH[5] = safe_add(f, HASH[5]); HASH[6] = safe_add(g, HASH[6]); HASH[7] = safe_add(h, HASH[7]);
  }
  return HASH;
};

module.exports = function sha256(buf) {
  return helpers.hash(buf, core_sha256, 32, true);
};

}).call(this,require("g5I+bs"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/node_modules/crypto-browserify/sha256.js","/node_modules/crypto-browserify")
},{"./helpers":8,"buffer":4,"g5I+bs":16}],14:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

}).call(this,require("g5I+bs"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/node_modules/ieee754/index.js","/node_modules/ieee754")
},{"buffer":4,"g5I+bs":16}],15:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
//     uuid.js
//
//     Copyright (c) 2010-2012 Robert Kieffer
//     MIT License - http://opensource.org/licenses/mit-license.php

/*global window, require, define */
(function(_window) {
  'use strict';

  // Unique ID creation requires a high quality random # generator.  We feature
  // detect to determine the best RNG source, normalizing to a function that
  // returns 128-bits of randomness, since that's what's usually required
  var _rng, _mathRNG, _nodeRNG, _whatwgRNG, _previousRoot;

  function setupBrowser() {
    // Allow for MSIE11 msCrypto
    var _crypto = _window.crypto || _window.msCrypto;

    if (!_rng && _crypto && _crypto.getRandomValues) {
      // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
      //
      // Moderately fast, high quality
      try {
        var _rnds8 = new Uint8Array(16);
        _whatwgRNG = _rng = function whatwgRNG() {
          _crypto.getRandomValues(_rnds8);
          return _rnds8;
        };
        _rng();
      } catch(e) {}
    }

    if (!_rng) {
      // Math.random()-based (RNG)
      //
      // If all else fails, use Math.random().  It's fast, but is of unspecified
      // quality.
      var  _rnds = new Array(16);
      _mathRNG = _rng = function() {
        for (var i = 0, r; i < 16; i++) {
          if ((i & 0x03) === 0) { r = Math.random() * 0x100000000; }
          _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
        }

        return _rnds;
      };
      if ('undefined' !== typeof console && console.warn) {
        console.warn("[SECURITY] node-uuid: crypto not usable, falling back to insecure Math.random()");
      }
    }
  }

  function setupNode() {
    // Node.js crypto-based RNG - http://nodejs.org/docs/v0.6.2/api/crypto.html
    //
    // Moderately fast, high quality
    if ('function' === typeof require) {
      try {
        var _rb = require('crypto').randomBytes;
        _nodeRNG = _rng = _rb && function() {return _rb(16);};
        _rng();
      } catch(e) {}
    }
  }

  if (_window) {
    setupBrowser();
  } else {
    setupNode();
  }

  // Buffer class to use
  var BufferClass = ('function' === typeof Buffer) ? Buffer : Array;

  // Maps for number <-> hex string conversion
  var _byteToHex = [];
  var _hexToByte = {};
  for (var i = 0; i < 256; i++) {
    _byteToHex[i] = (i + 0x100).toString(16).substr(1);
    _hexToByte[_byteToHex[i]] = i;
  }

  // **`parse()` - Parse a UUID into it's component bytes**
  function parse(s, buf, offset) {
    var i = (buf && offset) || 0, ii = 0;

    buf = buf || [];
    s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
      if (ii < 16) { // Don't overflow!
        buf[i + ii++] = _hexToByte[oct];
      }
    });

    // Zero out remaining bytes if string was short
    while (ii < 16) {
      buf[i + ii++] = 0;
    }

    return buf;
  }

  // **`unparse()` - Convert UUID byte array (ala parse()) into a string**
  function unparse(buf, offset) {
    var i = offset || 0, bth = _byteToHex;
    return  bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]];
  }

  // **`v1()` - Generate time-based UUID**
  //
  // Inspired by https://github.com/LiosK/UUID.js
  // and http://docs.python.org/library/uuid.html

  // random #'s we need to init node and clockseq
  var _seedBytes = _rng();

  // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
  var _nodeId = [
    _seedBytes[0] | 0x01,
    _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
  ];

  // Per 4.2.2, randomize (14 bit) clockseq
  var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

  // Previous uuid creation time
  var _lastMSecs = 0, _lastNSecs = 0;

  // See https://github.com/broofa/node-uuid for API details
  function v1(options, buf, offset) {
    var i = buf && offset || 0;
    var b = buf || [];

    options = options || {};

    var clockseq = (options.clockseq != null) ? options.clockseq : _clockseq;

    // UUID timestamps are 100 nano-second units since the Gregorian epoch,
    // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
    // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
    // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
    var msecs = (options.msecs != null) ? options.msecs : new Date().getTime();

    // Per 4.2.1.2, use count of uuid's generated during the current clock
    // cycle to simulate higher resolution clock
    var nsecs = (options.nsecs != null) ? options.nsecs : _lastNSecs + 1;

    // Time since last uuid creation (in msecs)
    var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

    // Per 4.2.1.2, Bump clockseq on clock regression
    if (dt < 0 && options.clockseq == null) {
      clockseq = clockseq + 1 & 0x3fff;
    }

    // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
    // time interval
    if ((dt < 0 || msecs > _lastMSecs) && options.nsecs == null) {
      nsecs = 0;
    }

    // Per 4.2.1.2 Throw error if too many uuids are requested
    if (nsecs >= 10000) {
      throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
    }

    _lastMSecs = msecs;
    _lastNSecs = nsecs;
    _clockseq = clockseq;

    // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
    msecs += 12219292800000;

    // `time_low`
    var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
    b[i++] = tl >>> 24 & 0xff;
    b[i++] = tl >>> 16 & 0xff;
    b[i++] = tl >>> 8 & 0xff;
    b[i++] = tl & 0xff;

    // `time_mid`
    var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
    b[i++] = tmh >>> 8 & 0xff;
    b[i++] = tmh & 0xff;

    // `time_high_and_version`
    b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
    b[i++] = tmh >>> 16 & 0xff;

    // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
    b[i++] = clockseq >>> 8 | 0x80;

    // `clock_seq_low`
    b[i++] = clockseq & 0xff;

    // `node`
    var node = options.node || _nodeId;
    for (var n = 0; n < 6; n++) {
      b[i + n] = node[n];
    }

    return buf ? buf : unparse(b);
  }

  // **`v4()` - Generate random UUID**

  // See https://github.com/broofa/node-uuid for API details
  function v4(options, buf, offset) {
    // Deprecated - 'format' argument, as supported in v1.2
    var i = buf && offset || 0;

    if (typeof(options) === 'string') {
      buf = (options === 'binary') ? new BufferClass(16) : null;
      options = null;
    }
    options = options || {};

    var rnds = options.random || (options.rng || _rng)();

    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    rnds[6] = (rnds[6] & 0x0f) | 0x40;
    rnds[8] = (rnds[8] & 0x3f) | 0x80;

    // Copy bytes to buffer, if provided
    if (buf) {
      for (var ii = 0; ii < 16; ii++) {
        buf[i + ii] = rnds[ii];
      }
    }

    return buf || unparse(rnds);
  }

  // Export public API
  var uuid = v4;
  uuid.v1 = v1;
  uuid.v4 = v4;
  uuid.parse = parse;
  uuid.unparse = unparse;
  uuid.BufferClass = BufferClass;
  uuid._rng = _rng;
  uuid._mathRNG = _mathRNG;
  uuid._nodeRNG = _nodeRNG;
  uuid._whatwgRNG = _whatwgRNG;

  if (('undefined' !== typeof module) && module.exports) {
    // Publish as node.js module
    module.exports = uuid;
  } else if (typeof define === 'function' && define.amd) {
    // Publish as AMD module
    define(function() {return uuid;});


  } else {
    // Publish as global (in browsers)
    _previousRoot = _window.uuid;

    // **`noConflict()` - (browser only) to reset global 'uuid' var**
    uuid.noConflict = function() {
      _window.uuid = _previousRoot;
      return uuid;
    };

    _window.uuid = uuid;
  }
})('undefined' !== typeof window ? window : null);

}).call(this,require("g5I+bs"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/node_modules/node-uuid/uuid.js","/node_modules/node-uuid")
},{"buffer":4,"crypto":9,"g5I+bs":16}],16:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

}).call(this,require("g5I+bs"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/node_modules/process/browser.js","/node_modules/process")
},{"buffer":4,"g5I+bs":16}],17:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// Copyright (c) Microsoft, All rights reserved. See License.txt in the project root for license information.

;(function (undefined) {

  var objectTypes = {
    'function': true,
    'object': true
  };

  function checkGlobal(value) {
    return (value && value.Object === Object) ? value : null;
  }

  var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType) ? exports : null;
  var freeModule = (objectTypes[typeof module] && module && !module.nodeType) ? module : null;
  var freeGlobal = checkGlobal(freeExports && freeModule && typeof global === 'object' && global);
  var freeSelf = checkGlobal(objectTypes[typeof self] && self);
  var freeWindow = checkGlobal(objectTypes[typeof window] && window);
  var moduleExports = (freeModule && freeModule.exports === freeExports) ? freeExports : null;
  var thisGlobal = checkGlobal(objectTypes[typeof this] && this);
  var root = freeGlobal || ((freeWindow !== (thisGlobal && thisGlobal.window)) && freeWindow) || freeSelf || thisGlobal || Function('return this')();

  var Rx = {
    internals: {},
    config: {
      Promise: root.Promise
    },
    helpers: { }
  };

  // Defaults
  var noop = Rx.helpers.noop = function () { },
    identity = Rx.helpers.identity = function (x) { return x; },
    defaultNow = Rx.helpers.defaultNow = Date.now,
    defaultComparer = Rx.helpers.defaultComparer = function (x, y) { return isEqual(x, y); },
    defaultSubComparer = Rx.helpers.defaultSubComparer = function (x, y) { return x > y ? 1 : (x < y ? -1 : 0); },
    defaultKeySerializer = Rx.helpers.defaultKeySerializer = function (x) { return x.toString(); },
    defaultError = Rx.helpers.defaultError = function (err) { throw err; },
    isPromise = Rx.helpers.isPromise = function (p) { return !!p && typeof p.subscribe !== 'function' && typeof p.then === 'function'; },
    isFunction = Rx.helpers.isFunction = (function () {

      var isFn = function (value) {
        return typeof value == 'function' || false;
      };

      // fallback for older versions of Chrome and Safari
      if (isFn(/x/)) {
        isFn = function(value) {
          return typeof value == 'function' && toString.call(value) == '[object Function]';
        };
      }

      return isFn;
    }());

  function cloneArray(arr) { for(var a = [], i = 0, len = arr.length; i < len; i++) { a.push(arr[i]); } return a;}

  var errorObj = {e: {}};
  
  function tryCatcherGen(tryCatchTarget) {
    return function tryCatcher() {
      try {
        return tryCatchTarget.apply(this, arguments);
      } catch (e) {
        errorObj.e = e;
        return errorObj;
      }
    };
  }

  var tryCatch = Rx.internals.tryCatch = function tryCatch(fn) {
    if (!isFunction(fn)) { throw new TypeError('fn must be a function'); }
    return tryCatcherGen(fn);
  };

  function thrower(e) {
    throw e;
  }

  Rx.config.longStackSupport = false;
  var hasStacks = false, stacks = tryCatch(function () { throw new Error(); })();
  hasStacks = !!stacks.e && !!stacks.e.stack;

  // All code after this point will be filtered from stack traces reported by RxJS
  var rStartingLine = captureLine(), rFileName;

  var STACK_JUMP_SEPARATOR = 'From previous event:';

  function makeStackTraceLong(error, observable) {
    // If possible, transform the error stack trace by removing Node and RxJS
    // cruft, then concatenating with the stack trace of `observable`.
    if (hasStacks &&
        observable.stack &&
        typeof error === 'object' &&
        error !== null &&
        error.stack &&
        error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1
    ) {
      var stacks = [];
      for (var o = observable; !!o; o = o.source) {
        if (o.stack) {
          stacks.unshift(o.stack);
        }
      }
      stacks.unshift(error.stack);

      var concatedStacks = stacks.join('\n' + STACK_JUMP_SEPARATOR + '\n');
      error.stack = filterStackString(concatedStacks);
    }
  }

  function filterStackString(stackString) {
    var lines = stackString.split('\n'), desiredLines = [];
    for (var i = 0, len = lines.length; i < len; i++) {
      var line = lines[i];

      if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
        desiredLines.push(line);
      }
    }
    return desiredLines.join('\n');
  }

  function isInternalFrame(stackLine) {
    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);
    if (!fileNameAndLineNumber) {
      return false;
    }
    var fileName = fileNameAndLineNumber[0], lineNumber = fileNameAndLineNumber[1];

    return fileName === rFileName &&
      lineNumber >= rStartingLine &&
      lineNumber <= rEndingLine;
  }

  function isNodeFrame(stackLine) {
    return stackLine.indexOf('(module.js:') !== -1 ||
      stackLine.indexOf('(node.js:') !== -1;
  }

  function captureLine() {
    if (!hasStacks) { return; }

    try {
      throw new Error();
    } catch (e) {
      var lines = e.stack.split('\n');
      var firstLine = lines[0].indexOf('@') > 0 ? lines[1] : lines[2];
      var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
      if (!fileNameAndLineNumber) { return; }

      rFileName = fileNameAndLineNumber[0];
      return fileNameAndLineNumber[1];
    }
  }

  function getFileNameAndLineNumber(stackLine) {
    // Named functions: 'at functionName (filename:lineNumber:columnNumber)'
    var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
    if (attempt1) { return [attempt1[1], Number(attempt1[2])]; }

    // Anonymous functions: 'at filename:lineNumber:columnNumber'
    var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
    if (attempt2) { return [attempt2[1], Number(attempt2[2])]; }

    // Firefox style: 'function@filename:lineNumber or @filename:lineNumber'
    var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
    if (attempt3) { return [attempt3[1], Number(attempt3[2])]; }
  }

  var EmptyError = Rx.EmptyError = function() {
    this.message = 'Sequence contains no elements.';
    Error.call(this);
  };
  EmptyError.prototype = Object.create(Error.prototype);
  EmptyError.prototype.name = 'EmptyError';

  var ObjectDisposedError = Rx.ObjectDisposedError = function() {
    this.message = 'Object has been disposed';
    Error.call(this);
  };
  ObjectDisposedError.prototype = Object.create(Error.prototype);
  ObjectDisposedError.prototype.name = 'ObjectDisposedError';

  var ArgumentOutOfRangeError = Rx.ArgumentOutOfRangeError = function () {
    this.message = 'Argument out of range';
    Error.call(this);
  };
  ArgumentOutOfRangeError.prototype = Object.create(Error.prototype);
  ArgumentOutOfRangeError.prototype.name = 'ArgumentOutOfRangeError';

  var NotSupportedError = Rx.NotSupportedError = function (message) {
    this.message = message || 'This operation is not supported';
    Error.call(this);
  };
  NotSupportedError.prototype = Object.create(Error.prototype);
  NotSupportedError.prototype.name = 'NotSupportedError';

  var NotImplementedError = Rx.NotImplementedError = function (message) {
    this.message = message || 'This operation is not implemented';
    Error.call(this);
  };
  NotImplementedError.prototype = Object.create(Error.prototype);
  NotImplementedError.prototype.name = 'NotImplementedError';

  var notImplemented = Rx.helpers.notImplemented = function () {
    throw new NotImplementedError();
  };

  var notSupported = Rx.helpers.notSupported = function () {
    throw new NotSupportedError();
  };

  // Shim in iterator support
  var $iterator$ = (typeof Symbol === 'function' && Symbol.iterator) ||
    '_es6shim_iterator_';
  // Bug for mozilla version
  if (root.Set && typeof new root.Set()['@@iterator'] === 'function') {
    $iterator$ = '@@iterator';
  }

  var doneEnumerator = Rx.doneEnumerator = { done: true, value: undefined };

  var isIterable = Rx.helpers.isIterable = function (o) {
    return o && o[$iterator$] !== undefined;
  };

  var isArrayLike = Rx.helpers.isArrayLike = function (o) {
    return o && o.length !== undefined;
  };

  Rx.helpers.iterator = $iterator$;

  var bindCallback = Rx.internals.bindCallback = function (func, thisArg, argCount) {
    if (typeof thisArg === 'undefined') { return func; }
    switch(argCount) {
      case 0:
        return function() {
          return func.call(thisArg)
        };
      case 1:
        return function(arg) {
          return func.call(thisArg, arg);
        };
      case 2:
        return function(value, index) {
          return func.call(thisArg, value, index);
        };
      case 3:
        return function(value, index, collection) {
          return func.call(thisArg, value, index, collection);
        };
    }

    return function() {
      return func.apply(thisArg, arguments);
    };
  };

  /** Used to determine if values are of the language type Object */
  var dontEnums = ['toString',
    'toLocaleString',
    'valueOf',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'constructor'],
  dontEnumsLength = dontEnums.length;

var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dateTag] = typedArrayTags[errorTag] =
typedArrayTags[funcTag] = typedArrayTags[mapTag] =
typedArrayTags[numberTag] = typedArrayTags[objectTag] =
typedArrayTags[regexpTag] = typedArrayTags[setTag] =
typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

var objectProto = Object.prototype,
    hasOwnProperty = objectProto.hasOwnProperty,
    objToString = objectProto.toString,
    MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

var keys = Object.keys || (function() {
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function(obj) {
      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());

function equalObjects(object, other, equalFunc, isLoose, stackA, stackB) {
  var objProps = keys(object),
      objLength = objProps.length,
      othProps = keys(other),
      othLength = othProps.length;

  if (objLength !== othLength && !isLoose) {
    return false;
  }
  var index = objLength, key;
  while (index--) {
    key = objProps[index];
    if (!(isLoose ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  var skipCtor = isLoose;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key],
        result;

    if (!(result === undefined ? equalFunc(objValue, othValue, isLoose, stackA, stackB) : result)) {
      return false;
    }
    skipCtor || (skipCtor = key === 'constructor');
  }
  if (!skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    if (objCtor !== othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor === 'function' && objCtor instanceof objCtor &&
          typeof othCtor === 'function' && othCtor instanceof othCtor)) {
      return false;
    }
  }
  return true;
}

function equalByTag(object, other, tag) {
  switch (tag) {
    case boolTag:
    case dateTag:
      return +object === +other;

    case errorTag:
      return object.name === other.name && object.message === other.message;

    case numberTag:
      return (object !== +object) ?
        other !== +other :
        object === +other;

    case regexpTag:
    case stringTag:
      return object === (other + '');
  }
  return false;
}

var isObject = Rx.internals.isObject = function(value) {
  var type = typeof value;
  return !!value && (type === 'object' || type === 'function');
};

function isObjectLike(value) {
  return !!value && typeof value === 'object';
}

function isLength(value) {
  return typeof value === 'number' && value > -1 && value % 1 === 0 && value <= MAX_SAFE_INTEGER;
}

var isHostObject = (function() {
  try {
    Object({ 'toString': 0 } + '');
  } catch(e) {
    return function() { return false; };
  }
  return function(value) {
    return typeof value.toString !== 'function' && typeof (value + '') === 'string';
  };
}());

function isTypedArray(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
}

var isArray = Array.isArray || function(value) {
  return isObjectLike(value) && isLength(value.length) && objToString.call(value) === arrayTag;
};

function arraySome (array, predicate) {
  var index = -1,
      length = array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

function equalArrays(array, other, equalFunc, isLoose, stackA, stackB) {
  var index = -1,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength !== othLength && !(isLoose && othLength > arrLength)) {
    return false;
  }
  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index],
        result;

    if (result !== undefined) {
      if (result) {
        continue;
      }
      return false;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (isLoose) {
      if (!arraySome(other, function(othValue) {
            return arrValue === othValue || equalFunc(arrValue, othValue, isLoose, stackA, stackB);
          })) {
        return false;
      }
    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, isLoose, stackA, stackB))) {
      return false;
    }
  }
  return true;
}

function baseIsEqualDeep(object, other, equalFunc, isLoose, stackA, stackB) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = arrayTag,
      othTag = arrayTag;

  if (!objIsArr) {
    objTag = objToString.call(object);
    if (objTag === argsTag) {
      objTag = objectTag;
    } else if (objTag !== objectTag) {
      objIsArr = isTypedArray(object);
    }
  }
  if (!othIsArr) {
    othTag = objToString.call(other);
    if (othTag === argsTag) {
      othTag = objectTag;
    }
  }
  var objIsObj = objTag === objectTag && !isHostObject(object),
      othIsObj = othTag === objectTag && !isHostObject(other),
      isSameTag = objTag === othTag;

  if (isSameTag && !(objIsArr || objIsObj)) {
    return equalByTag(object, other, objTag);
  }
  if (!isLoose) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      return equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, isLoose, stackA, stackB);
    }
  }
  if (!isSameTag) {
    return false;
  }
  // Assume cyclic values are equal.
  // For more information on detecting circular references see https://es5.github.io/#JO.
  stackA || (stackA = []);
  stackB || (stackB = []);

  var length = stackA.length;
  while (length--) {
    if (stackA[length] === object) {
      return stackB[length] === other;
    }
  }
  // Add `object` and `other` to the stack of traversed objects.
  stackA.push(object);
  stackB.push(other);

  var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, isLoose, stackA, stackB);

  stackA.pop();
  stackB.pop();

  return result;
}

function baseIsEqual(value, other, isLoose, stackA, stackB) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, baseIsEqual, isLoose, stackA, stackB);
}

var isEqual = Rx.internals.isEqual = function (value, other) {
  return baseIsEqual(value, other);
};

  var hasProp = {}.hasOwnProperty,
      slice = Array.prototype.slice;

  var inherits = Rx.internals.inherits = function (child, parent) {
    function __() { this.constructor = child; }
    __.prototype = parent.prototype;
    child.prototype = new __();
  };

  var addProperties = Rx.internals.addProperties = function (obj) {
    for(var sources = [], i = 1, len = arguments.length; i < len; i++) { sources.push(arguments[i]); }
    for (var idx = 0, ln = sources.length; idx < ln; idx++) {
      var source = sources[idx];
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    }
  };

  // Rx Utils
  var addRef = Rx.internals.addRef = function (xs, r) {
    return new AnonymousObservable(function (observer) {
      return new BinaryDisposable(r.getDisposable(), xs.subscribe(observer));
    });
  };

  function arrayInitialize(count, factory) {
    var a = new Array(count);
    for (var i = 0; i < count; i++) {
      a[i] = factory();
    }
    return a;
  }

  function IndexedItem(id, value) {
    this.id = id;
    this.value = value;
  }

  IndexedItem.prototype.compareTo = function (other) {
    var c = this.value.compareTo(other.value);
    c === 0 && (c = this.id - other.id);
    return c;
  };

  var PriorityQueue = Rx.internals.PriorityQueue = function (capacity) {
    this.items = new Array(capacity);
    this.length = 0;
  };

  var priorityProto = PriorityQueue.prototype;
  priorityProto.isHigherPriority = function (left, right) {
    return this.items[left].compareTo(this.items[right]) < 0;
  };

  priorityProto.percolate = function (index) {
    if (index >= this.length || index < 0) { return; }
    var parent = index - 1 >> 1;
    if (parent < 0 || parent === index) { return; }
    if (this.isHigherPriority(index, parent)) {
      var temp = this.items[index];
      this.items[index] = this.items[parent];
      this.items[parent] = temp;
      this.percolate(parent);
    }
  };

  priorityProto.heapify = function (index) {
    +index || (index = 0);
    if (index >= this.length || index < 0) { return; }
    var left = 2 * index + 1,
        right = 2 * index + 2,
        first = index;
    if (left < this.length && this.isHigherPriority(left, first)) {
      first = left;
    }
    if (right < this.length && this.isHigherPriority(right, first)) {
      first = right;
    }
    if (first !== index) {
      var temp = this.items[index];
      this.items[index] = this.items[first];
      this.items[first] = temp;
      this.heapify(first);
    }
  };

  priorityProto.peek = function () { return this.items[0].value; };

  priorityProto.removeAt = function (index) {
    this.items[index] = this.items[--this.length];
    this.items[this.length] = undefined;
    this.heapify();
  };

  priorityProto.dequeue = function () {
    var result = this.peek();
    this.removeAt(0);
    return result;
  };

  priorityProto.enqueue = function (item) {
    var index = this.length++;
    this.items[index] = new IndexedItem(PriorityQueue.count++, item);
    this.percolate(index);
  };

  priorityProto.remove = function (item) {
    for (var i = 0; i < this.length; i++) {
      if (this.items[i].value === item) {
        this.removeAt(i);
        return true;
      }
    }
    return false;
  };
  PriorityQueue.count = 0;

  /**
   * Represents a group of disposable resources that are disposed together.
   * @constructor
   */
  var CompositeDisposable = Rx.CompositeDisposable = function () {
    var args = [], i, len;
    if (Array.isArray(arguments[0])) {
      args = arguments[0];
    } else {
      len = arguments.length;
      args = new Array(len);
      for(i = 0; i < len; i++) { args[i] = arguments[i]; }
    }
    this.disposables = args;
    this.isDisposed = false;
    this.length = args.length;
  };

  var CompositeDisposablePrototype = CompositeDisposable.prototype;

  /**
   * Adds a disposable to the CompositeDisposable or disposes the disposable if the CompositeDisposable is disposed.
   * @param {Mixed} item Disposable to add.
   */
  CompositeDisposablePrototype.add = function (item) {
    if (this.isDisposed) {
      item.dispose();
    } else {
      this.disposables.push(item);
      this.length++;
    }
  };

  /**
   * Removes and disposes the first occurrence of a disposable from the CompositeDisposable.
   * @param {Mixed} item Disposable to remove.
   * @returns {Boolean} true if found; false otherwise.
   */
  CompositeDisposablePrototype.remove = function (item) {
    var shouldDispose = false;
    if (!this.isDisposed) {
      var idx = this.disposables.indexOf(item);
      if (idx !== -1) {
        shouldDispose = true;
        this.disposables.splice(idx, 1);
        this.length--;
        item.dispose();
      }
    }
    return shouldDispose;
  };

  /**
   *  Disposes all disposables in the group and removes them from the group.
   */
  CompositeDisposablePrototype.dispose = function () {
    if (!this.isDisposed) {
      this.isDisposed = true;
      var len = this.disposables.length, currentDisposables = new Array(len);
      for(var i = 0; i < len; i++) { currentDisposables[i] = this.disposables[i]; }
      this.disposables = [];
      this.length = 0;

      for (i = 0; i < len; i++) {
        currentDisposables[i].dispose();
      }
    }
  };

  /**
   * Provides a set of static methods for creating Disposables.
   * @param {Function} dispose Action to run during the first call to dispose. The action is guaranteed to be run at most once.
   */
  var Disposable = Rx.Disposable = function (action) {
    this.isDisposed = false;
    this.action = action || noop;
  };

  /** Performs the task of cleaning up resources. */
  Disposable.prototype.dispose = function () {
    if (!this.isDisposed) {
      this.action();
      this.isDisposed = true;
    }
  };

  /**
   * Creates a disposable object that invokes the specified action when disposed.
   * @param {Function} dispose Action to run during the first call to dispose. The action is guaranteed to be run at most once.
   * @return {Disposable} The disposable object that runs the given action upon disposal.
   */
  var disposableCreate = Disposable.create = function (action) { return new Disposable(action); };

  /**
   * Gets the disposable that does nothing when disposed.
   */
  var disposableEmpty = Disposable.empty = { dispose: noop };

  /**
   * Validates whether the given object is a disposable
   * @param {Object} Object to test whether it has a dispose method
   * @returns {Boolean} true if a disposable object, else false.
   */
  var isDisposable = Disposable.isDisposable = function (d) {
    return d && isFunction(d.dispose);
  };

  var checkDisposed = Disposable.checkDisposed = function (disposable) {
    if (disposable.isDisposed) { throw new ObjectDisposedError(); }
  };

  var disposableFixup = Disposable._fixup = function (result) {
    return isDisposable(result) ? result : disposableEmpty;
  };

  // Single assignment
  var SingleAssignmentDisposable = Rx.SingleAssignmentDisposable = function () {
    this.isDisposed = false;
    this.current = null;
  };
  SingleAssignmentDisposable.prototype.getDisposable = function () {
    return this.current;
  };
  SingleAssignmentDisposable.prototype.setDisposable = function (value) {
    if (this.current) { throw new Error('Disposable has already been assigned'); }
    var shouldDispose = this.isDisposed;
    !shouldDispose && (this.current = value);
    shouldDispose && value && value.dispose();
  };
  SingleAssignmentDisposable.prototype.dispose = function () {
    if (!this.isDisposed) {
      this.isDisposed = true;
      var old = this.current;
      this.current = null;
      old && old.dispose();
    }
  };

  // Multiple assignment disposable
  var SerialDisposable = Rx.SerialDisposable = function () {
    this.isDisposed = false;
    this.current = null;
  };
  SerialDisposable.prototype.getDisposable = function () {
    return this.current;
  };
  SerialDisposable.prototype.setDisposable = function (value) {
    var shouldDispose = this.isDisposed;
    if (!shouldDispose) {
      var old = this.current;
      this.current = value;
    }
    old && old.dispose();
    shouldDispose && value && value.dispose();
  };
  SerialDisposable.prototype.dispose = function () {
    if (!this.isDisposed) {
      this.isDisposed = true;
      var old = this.current;
      this.current = null;
    }
    old && old.dispose();
  };

  var BinaryDisposable = Rx.BinaryDisposable = function (first, second) {
    this._first = first;
    this._second = second;
    this.isDisposed = false;
  };

  BinaryDisposable.prototype.dispose = function () {
    if (!this.isDisposed) {
      this.isDisposed = true;
      var old1 = this._first;
      this._first = null;
      old1 && old1.dispose();
      var old2 = this._second;
      this._second = null;
      old2 && old2.dispose();
    }
  };

  var NAryDisposable = Rx.NAryDisposable = function (disposables) {
    this._disposables = disposables;
    this.isDisposed = false;
  };

  NAryDisposable.prototype.dispose = function () {
    if (!this.isDisposed) {
      this.isDisposed = true;
      for (var i = 0, len = this._disposables.length; i < len; i++) {
        this._disposables[i].dispose();
      }
      this._disposables.length = 0;
    }
  };

  /**
   * Represents a disposable resource that only disposes its underlying disposable resource when all dependent disposable objects have been disposed.
   */
  var RefCountDisposable = Rx.RefCountDisposable = (function () {

    function InnerDisposable(disposable) {
      this.disposable = disposable;
      this.disposable.count++;
      this.isInnerDisposed = false;
    }

    InnerDisposable.prototype.dispose = function () {
      if (!this.disposable.isDisposed && !this.isInnerDisposed) {
        this.isInnerDisposed = true;
        this.disposable.count--;
        if (this.disposable.count === 0 && this.disposable.isPrimaryDisposed) {
          this.disposable.isDisposed = true;
          this.disposable.underlyingDisposable.dispose();
        }
      }
    };

    /**
     * Initializes a new instance of the RefCountDisposable with the specified disposable.
     * @constructor
     * @param {Disposable} disposable Underlying disposable.
      */
    function RefCountDisposable(disposable) {
      this.underlyingDisposable = disposable;
      this.isDisposed = false;
      this.isPrimaryDisposed = false;
      this.count = 0;
    }

    /**
     * Disposes the underlying disposable only when all dependent disposables have been disposed
     */
    RefCountDisposable.prototype.dispose = function () {
      if (!this.isDisposed && !this.isPrimaryDisposed) {
        this.isPrimaryDisposed = true;
        if (this.count === 0) {
          this.isDisposed = true;
          this.underlyingDisposable.dispose();
        }
      }
    };

    /**
     * Returns a dependent disposable that when disposed decreases the refcount on the underlying disposable.
     * @returns {Disposable} A dependent disposable contributing to the reference count that manages the underlying disposable's lifetime.
     */
    RefCountDisposable.prototype.getDisposable = function () {
      return this.isDisposed ? disposableEmpty : new InnerDisposable(this);
    };

    return RefCountDisposable;
  })();

  function ScheduledDisposable(scheduler, disposable) {
    this.scheduler = scheduler;
    this.disposable = disposable;
    this.isDisposed = false;
  }

  function scheduleItem(s, self) {
    if (!self.isDisposed) {
      self.isDisposed = true;
      self.disposable.dispose();
    }
  }

  ScheduledDisposable.prototype.dispose = function () {
    this.scheduler.schedule(this, scheduleItem);
  };

  var ScheduledItem = Rx.internals.ScheduledItem = function (scheduler, state, action, dueTime, comparer) {
    this.scheduler = scheduler;
    this.state = state;
    this.action = action;
    this.dueTime = dueTime;
    this.comparer = comparer || defaultSubComparer;
    this.disposable = new SingleAssignmentDisposable();
  };

  ScheduledItem.prototype.invoke = function () {
    this.disposable.setDisposable(this.invokeCore());
  };

  ScheduledItem.prototype.compareTo = function (other) {
    return this.comparer(this.dueTime, other.dueTime);
  };

  ScheduledItem.prototype.isCancelled = function () {
    return this.disposable.isDisposed;
  };

  ScheduledItem.prototype.invokeCore = function () {
    return disposableFixup(this.action(this.scheduler, this.state));
  };

  /** Provides a set of static properties to access commonly used schedulers. */
  var Scheduler = Rx.Scheduler = (function () {

    function Scheduler() { }

    /** Determines whether the given object is a scheduler */
    Scheduler.isScheduler = function (s) {
      return s instanceof Scheduler;
    };

    var schedulerProto = Scheduler.prototype;

    /**
   * Schedules an action to be executed.
   * @param state State passed to the action to be executed.
   * @param {Function} action Action to be executed.
   * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
   */
    schedulerProto.schedule = function (state, action) {
      throw new NotImplementedError();
    };

  /**
   * Schedules an action to be executed after dueTime.
   * @param state State passed to the action to be executed.
   * @param {Function} action Action to be executed.
   * @param {Number} dueTime Relative time after which to execute the action.
   * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
   */
    schedulerProto.scheduleFuture = function (state, dueTime, action) {
      var dt = dueTime;
      dt instanceof Date && (dt = dt - this.now());
      dt = Scheduler.normalize(dt);

      if (dt === 0) { return this.schedule(state, action); }

      return this._scheduleFuture(state, dt, action);
    };

    schedulerProto._scheduleFuture = function (state, dueTime, action) {
      throw new NotImplementedError();
    };

    /** Gets the current time according to the local machine's system clock. */
    Scheduler.now = defaultNow;

    /** Gets the current time according to the local machine's system clock. */
    Scheduler.prototype.now = defaultNow;

    /**
     * Normalizes the specified TimeSpan value to a positive value.
     * @param {Number} timeSpan The time span value to normalize.
     * @returns {Number} The specified TimeSpan value if it is zero or positive; otherwise, 0
     */
    Scheduler.normalize = function (timeSpan) {
      timeSpan < 0 && (timeSpan = 0);
      return timeSpan;
    };

    return Scheduler;
  }());

  var normalizeTime = Scheduler.normalize, isScheduler = Scheduler.isScheduler;

  (function (schedulerProto) {

    function invokeRecImmediate(scheduler, pair) {
      var state = pair[0], action = pair[1], group = new CompositeDisposable();
      action(state, innerAction);
      return group;

      function innerAction(state2) {
        var isAdded = false, isDone = false;

        var d = scheduler.schedule(state2, scheduleWork);
        if (!isDone) {
          group.add(d);
          isAdded = true;
        }

        function scheduleWork(_, state3) {
          if (isAdded) {
            group.remove(d);
          } else {
            isDone = true;
          }
          action(state3, innerAction);
          return disposableEmpty;
        }
      }
    }

    function invokeRecDate(scheduler, pair) {
      var state = pair[0], action = pair[1], group = new CompositeDisposable();
      action(state, innerAction);
      return group;

      function innerAction(state2, dueTime1) {
        var isAdded = false, isDone = false;

        var d = scheduler.scheduleFuture(state2, dueTime1, scheduleWork);
        if (!isDone) {
          group.add(d);
          isAdded = true;
        }

        function scheduleWork(_, state3) {
          if (isAdded) {
            group.remove(d);
          } else {
            isDone = true;
          }
          action(state3, innerAction);
          return disposableEmpty;
        }
      }
    }

    /**
     * Schedules an action to be executed recursively.
     * @param {Mixed} state State passed to the action to be executed.
     * @param {Function} action Action to execute recursively. The last parameter passed to the action is used to trigger recursive scheduling of the action, passing in recursive invocation state.
     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
     */
    schedulerProto.scheduleRecursive = function (state, action) {
      return this.schedule([state, action], invokeRecImmediate);
    };

    /**
     * Schedules an action to be executed recursively after a specified relative or absolute due time.
     * @param {Mixed} state State passed to the action to be executed.
     * @param {Function} action Action to execute recursively. The last parameter passed to the action is used to trigger recursive scheduling of the action, passing in the recursive due time and invocation state.
     * @param {Number | Date} dueTime Relative or absolute time after which to execute the action for the first time.
     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
     */
    schedulerProto.scheduleRecursiveFuture = function (state, dueTime, action) {
      return this.scheduleFuture([state, action], dueTime, invokeRecDate);
    };

  }(Scheduler.prototype));

  (function (schedulerProto) {

    /**
     * Schedules a periodic piece of work by dynamically discovering the scheduler's capabilities. The periodic task will be scheduled using window.setInterval for the base implementation.
     * @param {Mixed} state Initial state passed to the action upon the first iteration.
     * @param {Number} period Period for running the work periodically.
     * @param {Function} action Action to be executed, potentially updating the state.
     * @returns {Disposable} The disposable object used to cancel the scheduled recurring action (best effort).
     */
    schedulerProto.schedulePeriodic = function(state, period, action) {
      if (typeof root.setInterval === 'undefined') { throw new NotSupportedError(); }
      period = normalizeTime(period);
      var s = state, id = root.setInterval(function () { s = action(s); }, period);
      return disposableCreate(function () { root.clearInterval(id); });
    };

  }(Scheduler.prototype));

  (function (schedulerProto) {
    /**
     * Returns a scheduler that wraps the original scheduler, adding exception handling for scheduled actions.
     * @param {Function} handler Handler that's run if an exception is caught. The exception will be rethrown if the handler returns false.
     * @returns {Scheduler} Wrapper around the original scheduler, enforcing exception handling.
     */
    schedulerProto.catchError = schedulerProto['catch'] = function (handler) {
      return new CatchScheduler(this, handler);
    };
  }(Scheduler.prototype));

  var SchedulePeriodicRecursive = Rx.internals.SchedulePeriodicRecursive = (function () {
    function createTick(self) {
      return function tick(command, recurse) {
        recurse(0, self._period);
        var state = tryCatch(self._action)(self._state);
        if (state === errorObj) {
          self._cancel.dispose();
          thrower(state.e);
        }
        self._state = state;
      };
    }

    function SchedulePeriodicRecursive(scheduler, state, period, action) {
      this._scheduler = scheduler;
      this._state = state;
      this._period = period;
      this._action = action;
    }

    SchedulePeriodicRecursive.prototype.start = function () {
      var d = new SingleAssignmentDisposable();
      this._cancel = d;
      d.setDisposable(this._scheduler.scheduleRecursiveFuture(0, this._period, createTick(this)));

      return d;
    };

    return SchedulePeriodicRecursive;
  }());

  /** Gets a scheduler that schedules work immediately on the current thread. */
   var ImmediateScheduler = (function (__super__) {
    inherits(ImmediateScheduler, __super__);
    function ImmediateScheduler() {
      __super__.call(this);
    }

    ImmediateScheduler.prototype.schedule = function (state, action) {
      return disposableFixup(action(this, state));
    };

    return ImmediateScheduler;
  }(Scheduler));

  var immediateScheduler = Scheduler.immediate = new ImmediateScheduler();

  /**
   * Gets a scheduler that schedules work as soon as possible on the current thread.
   */
  var CurrentThreadScheduler = (function (__super__) {
    var queue;

    function runTrampoline () {
      while (queue.length > 0) {
        var item = queue.dequeue();
        !item.isCancelled() && item.invoke();
      }
    }

    inherits(CurrentThreadScheduler, __super__);
    function CurrentThreadScheduler() {
      __super__.call(this);
    }

    CurrentThreadScheduler.prototype.schedule = function (state, action) {
      var si = new ScheduledItem(this, state, action, this.now());

      if (!queue) {
        queue = new PriorityQueue(4);
        queue.enqueue(si);

        var result = tryCatch(runTrampoline)();
        queue = null;
        if (result === errorObj) { thrower(result.e); }
      } else {
        queue.enqueue(si);
      }
      return si.disposable;
    };

    CurrentThreadScheduler.prototype.scheduleRequired = function () { return !queue; };

    return CurrentThreadScheduler;
  }(Scheduler));

  var currentThreadScheduler = Scheduler.currentThread = new CurrentThreadScheduler();

  var scheduleMethod, clearMethod;

  var localTimer = (function () {
    var localSetTimeout, localClearTimeout = noop;
    if (!!root.setTimeout) {
      localSetTimeout = root.setTimeout;
      localClearTimeout = root.clearTimeout;
    } else if (!!root.WScript) {
      localSetTimeout = function (fn, time) {
        root.WScript.Sleep(time);
        fn();
      };
    } else {
      throw new NotSupportedError();
    }

    return {
      setTimeout: localSetTimeout,
      clearTimeout: localClearTimeout
    };
  }());
  var localSetTimeout = localTimer.setTimeout,
    localClearTimeout = localTimer.clearTimeout;

  (function () {

    var nextHandle = 1, tasksByHandle = {}, currentlyRunning = false;

    clearMethod = function (handle) {
      delete tasksByHandle[handle];
    };

    function runTask(handle) {
      if (currentlyRunning) {
        localSetTimeout(function () { runTask(handle); }, 0);
      } else {
        var task = tasksByHandle[handle];
        if (task) {
          currentlyRunning = true;
          var result = tryCatch(task)();
          clearMethod(handle);
          currentlyRunning = false;
          if (result === errorObj) { thrower(result.e); }
        }
      }
    }

    var reNative = new RegExp('^' +
      String(toString)
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .replace(/toString| for [^\]]+/g, '.*?') + '$'
    );

    var setImmediate = typeof (setImmediate = freeGlobal && moduleExports && freeGlobal.setImmediate) == 'function' &&
      !reNative.test(setImmediate) && setImmediate;

    function postMessageSupported () {
      // Ensure not in a worker
      if (!root.postMessage || root.importScripts) { return false; }
      var isAsync = false, oldHandler = root.onmessage;
      // Test for async
      root.onmessage = function () { isAsync = true; };
      root.postMessage('', '*');
      root.onmessage = oldHandler;

      return isAsync;
    }

    // Use in order, setImmediate, nextTick, postMessage, MessageChannel, script readystatechanged, setTimeout
    if (isFunction(setImmediate)) {
      scheduleMethod = function (action) {
        var id = nextHandle++;
        tasksByHandle[id] = action;
        setImmediate(function () { runTask(id); });

        return id;
      };
    } else if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
      scheduleMethod = function (action) {
        var id = nextHandle++;
        tasksByHandle[id] = action;
        process.nextTick(function () { runTask(id); });

        return id;
      };
    } else if (postMessageSupported()) {
      var MSG_PREFIX = 'ms.rx.schedule' + Math.random();

      var onGlobalPostMessage = function (event) {
        // Only if we're a match to avoid any other global events
        if (typeof event.data === 'string' && event.data.substring(0, MSG_PREFIX.length) === MSG_PREFIX) {
          runTask(event.data.substring(MSG_PREFIX.length));
        }
      };

      root.addEventListener('message', onGlobalPostMessage, false);

      scheduleMethod = function (action) {
        var id = nextHandle++;
        tasksByHandle[id] = action;
        root.postMessage(MSG_PREFIX + id, '*');
        return id;
      };
    } else if (!!root.MessageChannel) {
      var channel = new root.MessageChannel();

      channel.port1.onmessage = function (e) { runTask(e.data); };

      scheduleMethod = function (action) {
        var id = nextHandle++;
        tasksByHandle[id] = action;
        channel.port2.postMessage(id);
        return id;
      };
    } else if ('document' in root && 'onreadystatechange' in root.document.createElement('script')) {

      scheduleMethod = function (action) {
        var scriptElement = root.document.createElement('script');
        var id = nextHandle++;
        tasksByHandle[id] = action;

        scriptElement.onreadystatechange = function () {
          runTask(id);
          scriptElement.onreadystatechange = null;
          scriptElement.parentNode.removeChild(scriptElement);
          scriptElement = null;
        };
        root.document.documentElement.appendChild(scriptElement);
        return id;
      };

    } else {
      scheduleMethod = function (action) {
        var id = nextHandle++;
        tasksByHandle[id] = action;
        localSetTimeout(function () {
          runTask(id);
        }, 0);

        return id;
      };
    }
  }());

  /**
   * Gets a scheduler that schedules work via a timed callback based upon platform.
   */
   var DefaultScheduler = (function (__super__) {
     inherits(DefaultScheduler, __super__);
     function DefaultScheduler() {
       __super__.call(this);
     }

     function scheduleAction(disposable, action, scheduler, state) {
       return function schedule() {
         disposable.setDisposable(Disposable._fixup(action(scheduler, state)));
       };
     }

     function ClearDisposable(id) {
       this._id = id;
       this.isDisposed = false;
     }

     ClearDisposable.prototype.dispose = function () {
       if (!this.isDisposed) {
         this.isDisposed = true;
         clearMethod(this._id);
       }
     };

     function LocalClearDisposable(id) {
       this._id = id;
       this.isDisposed = false;
     }

     LocalClearDisposable.prototype.dispose = function () {
       if (!this.isDisposed) {
         this.isDisposed = true;
         localClearTimeout(this._id);
       }
     };

    DefaultScheduler.prototype.schedule = function (state, action) {
      var disposable = new SingleAssignmentDisposable(),
          id = scheduleMethod(scheduleAction(disposable, action, this, state));
      return new BinaryDisposable(disposable, new ClearDisposable(id));
    };

    DefaultScheduler.prototype._scheduleFuture = function (state, dueTime, action) {
      if (dueTime === 0) { return this.schedule(state, action); }
      var disposable = new SingleAssignmentDisposable(),
          id = localSetTimeout(scheduleAction(disposable, action, this, state), dueTime);
      return new BinaryDisposable(disposable, new LocalClearDisposable(id));
    };

    function scheduleLongRunning(state, action, disposable) {
      return function () { action(state, disposable); };
    }

    DefaultScheduler.prototype.scheduleLongRunning = function (state, action) {
      var disposable = disposableCreate(noop);
      scheduleMethod(scheduleLongRunning(state, action, disposable));
      return disposable;
    };

    return DefaultScheduler;
  }(Scheduler));

  var defaultScheduler = Scheduler['default'] = Scheduler.async = new DefaultScheduler();

  var CatchScheduler = (function (__super__) {
    inherits(CatchScheduler, __super__);

    function CatchScheduler(scheduler, handler) {
      this._scheduler = scheduler;
      this._handler = handler;
      this._recursiveOriginal = null;
      this._recursiveWrapper = null;
      __super__.call(this);
    }

    CatchScheduler.prototype.schedule = function (state, action) {
      return this._scheduler.schedule(state, this._wrap(action));
    };

    CatchScheduler.prototype._scheduleFuture = function (state, dueTime, action) {
      return this._scheduler.schedule(state, dueTime, this._wrap(action));
    };

    CatchScheduler.prototype.now = function () { return this._scheduler.now(); };

    CatchScheduler.prototype._clone = function (scheduler) {
        return new CatchScheduler(scheduler, this._handler);
    };

    CatchScheduler.prototype._wrap = function (action) {
      var parent = this;
      return function (self, state) {
        var res = tryCatch(action)(parent._getRecursiveWrapper(self), state);
        if (res === errorObj) {
          if (!parent._handler(res.e)) { thrower(res.e); }
          return disposableEmpty;
        }
        return disposableFixup(res);
      };
    };

    CatchScheduler.prototype._getRecursiveWrapper = function (scheduler) {
      if (this._recursiveOriginal !== scheduler) {
        this._recursiveOriginal = scheduler;
        var wrapper = this._clone(scheduler);
        wrapper._recursiveOriginal = scheduler;
        wrapper._recursiveWrapper = wrapper;
        this._recursiveWrapper = wrapper;
      }
      return this._recursiveWrapper;
    };

    CatchScheduler.prototype.schedulePeriodic = function (state, period, action) {
      var self = this, failed = false, d = new SingleAssignmentDisposable();

      d.setDisposable(this._scheduler.schedulePeriodic(state, period, function (state1) {
        if (failed) { return null; }
        var res = tryCatch(action)(state1);
        if (res === errorObj) {
          failed = true;
          if (!self._handler(res.e)) { thrower(res.e); }
          d.dispose();
          return null;
        }
        return res;
      }));

      return d;
    };

    return CatchScheduler;
  }(Scheduler));

  /**
   *  Represents a notification to an observer.
   */
  var Notification = Rx.Notification = (function () {
    function Notification() {

    }

    Notification.prototype._accept = function (onNext, onError, onCompleted) {
      throw new NotImplementedError();
    };

    Notification.prototype._acceptObserver = function (onNext, onError, onCompleted) {
      throw new NotImplementedError();
    };

    /**
     * Invokes the delegate corresponding to the notification or the observer's method corresponding to the notification and returns the produced result.
     * @param {Function | Observer} observerOrOnNext Function to invoke for an OnNext notification or Observer to invoke the notification on..
     * @param {Function} onError Function to invoke for an OnError notification.
     * @param {Function} onCompleted Function to invoke for an OnCompleted notification.
     * @returns {Any} Result produced by the observation.
     */
    Notification.prototype.accept = function (observerOrOnNext, onError, onCompleted) {
      return observerOrOnNext && typeof observerOrOnNext === 'object' ?
        this._acceptObserver(observerOrOnNext) :
        this._accept(observerOrOnNext, onError, onCompleted);
    };

    /**
     * Returns an observable sequence with a single notification.
     *
     * @memberOf Notifications
     * @param {Scheduler} [scheduler] Scheduler to send out the notification calls on.
     * @returns {Observable} The observable sequence that surfaces the behavior of the notification upon subscription.
     */
    Notification.prototype.toObservable = function (scheduler) {
      var self = this;
      isScheduler(scheduler) || (scheduler = immediateScheduler);
      return new AnonymousObservable(function (o) {
        return scheduler.schedule(self, function (_, notification) {
          notification._acceptObserver(o);
          notification.kind === 'N' && o.onCompleted();
        });
      });
    };

    return Notification;
  })();

  var OnNextNotification = (function (__super__) {
    inherits(OnNextNotification, __super__);
    function OnNextNotification(value) {
      this.value = value;
      this.kind = 'N';
    }

    OnNextNotification.prototype._accept = function (onNext) {
      return onNext(this.value);
    };

    OnNextNotification.prototype._acceptObserver = function (o) {
      return o.onNext(this.value);
    };

    OnNextNotification.prototype.toString = function () {
      return 'OnNext(' + this.value + ')';
    };

    return OnNextNotification;
  }(Notification));

  var OnErrorNotification = (function (__super__) {
    inherits(OnErrorNotification, __super__);
    function OnErrorNotification(error) {
      this.error = error;
      this.kind = 'E';
    }

    OnErrorNotification.prototype._accept = function (onNext, onError) {
      return onError(this.error);
    };

    OnErrorNotification.prototype._acceptObserver = function (o) {
      return o.onError(this.error);
    };

    OnErrorNotification.prototype.toString = function () {
      return 'OnError(' + this.error + ')';
    };

    return OnErrorNotification;
  }(Notification));

  var OnCompletedNotification = (function (__super__) {
    inherits(OnCompletedNotification, __super__);
    function OnCompletedNotification() {
      this.kind = 'C';
    }

    OnCompletedNotification.prototype._accept = function (onNext, onError, onCompleted) {
      return onCompleted();
    };

    OnCompletedNotification.prototype._acceptObserver = function (o) {
      return o.onCompleted();
    };

    OnCompletedNotification.prototype.toString = function () {
      return 'OnCompleted()';
    };

    return OnCompletedNotification;
  }(Notification));

  /**
   * Creates an object that represents an OnNext notification to an observer.
   * @param {Any} value The value contained in the notification.
   * @returns {Notification} The OnNext notification containing the value.
   */
  var notificationCreateOnNext = Notification.createOnNext = function (value) {
    return new OnNextNotification(value);
  };

  /**
   * Creates an object that represents an OnError notification to an observer.
   * @param {Any} error The exception contained in the notification.
   * @returns {Notification} The OnError notification containing the exception.
   */
  var notificationCreateOnError = Notification.createOnError = function (error) {
    return new OnErrorNotification(error);
  };

  /**
   * Creates an object that represents an OnCompleted notification to an observer.
   * @returns {Notification} The OnCompleted notification.
   */
  var notificationCreateOnCompleted = Notification.createOnCompleted = function () {
    return new OnCompletedNotification();
  };

  /**
   * Supports push-style iteration over an observable sequence.
   */
  var Observer = Rx.Observer = function () { };

  /**
   *  Creates a notification callback from an observer.
   * @returns The action that forwards its input notification to the underlying observer.
   */
  Observer.prototype.toNotifier = function () {
    var observer = this;
    return function (n) { return n.accept(observer); };
  };

  /**
   *  Hides the identity of an observer.
   * @returns An observer that hides the identity of the specified observer.
   */
  Observer.prototype.asObserver = function () {
    var self = this;
    return new AnonymousObserver(
      function (x) { self.onNext(x); },
      function (err) { self.onError(err); },
      function () { self.onCompleted(); });
  };

  /**
   *  Checks access to the observer for grammar violations. This includes checking for multiple OnError or OnCompleted calls, as well as reentrancy in any of the observer methods.
   *  If a violation is detected, an Error is thrown from the offending observer method call.
   * @returns An observer that checks callbacks invocations against the observer grammar and, if the checks pass, forwards those to the specified observer.
   */
  Observer.prototype.checked = function () { return new CheckedObserver(this); };

  /**
   *  Creates an observer from the specified OnNext, along with optional OnError, and OnCompleted actions.
   * @param {Function} [onNext] Observer's OnNext action implementation.
   * @param {Function} [onError] Observer's OnError action implementation.
   * @param {Function} [onCompleted] Observer's OnCompleted action implementation.
   * @returns {Observer} The observer object implemented using the given actions.
   */
  var observerCreate = Observer.create = function (onNext, onError, onCompleted) {
    onNext || (onNext = noop);
    onError || (onError = defaultError);
    onCompleted || (onCompleted = noop);
    return new AnonymousObserver(onNext, onError, onCompleted);
  };

  /**
   *  Creates an observer from a notification callback.
   * @param {Function} handler Action that handles a notification.
   * @returns The observer object that invokes the specified handler using a notification corresponding to each message it receives.
   */
  Observer.fromNotifier = function (handler, thisArg) {
    var cb = bindCallback(handler, thisArg, 1);
    return new AnonymousObserver(function (x) {
      return cb(notificationCreateOnNext(x));
    }, function (e) {
      return cb(notificationCreateOnError(e));
    }, function () {
      return cb(notificationCreateOnCompleted());
    });
  };

  /**
   * Schedules the invocation of observer methods on the given scheduler.
   * @param {Scheduler} scheduler Scheduler to schedule observer messages on.
   * @returns {Observer} Observer whose messages are scheduled on the given scheduler.
   */
  Observer.prototype.notifyOn = function (scheduler) {
    return new ObserveOnObserver(scheduler, this);
  };

  Observer.prototype.makeSafe = function(disposable) {
    return new AnonymousSafeObserver(this._onNext, this._onError, this._onCompleted, disposable);
  };

  /**
   * Abstract base class for implementations of the Observer class.
   * This base class enforces the grammar of observers where OnError and OnCompleted are terminal messages.
   */
  var AbstractObserver = Rx.internals.AbstractObserver = (function (__super__) {
    inherits(AbstractObserver, __super__);

    /**
     * Creates a new observer in a non-stopped state.
     */
    function AbstractObserver() {
      this.isStopped = false;
    }

    // Must be implemented by other observers
    AbstractObserver.prototype.next = notImplemented;
    AbstractObserver.prototype.error = notImplemented;
    AbstractObserver.prototype.completed = notImplemented;

    /**
     * Notifies the observer of a new element in the sequence.
     * @param {Any} value Next element in the sequence.
     */
    AbstractObserver.prototype.onNext = function (value) {
      !this.isStopped && this.next(value);
    };

    /**
     * Notifies the observer that an exception has occurred.
     * @param {Any} error The error that has occurred.
     */
    AbstractObserver.prototype.onError = function (error) {
      if (!this.isStopped) {
        this.isStopped = true;
        this.error(error);
      }
    };

    /**
     * Notifies the observer of the end of the sequence.
     */
    AbstractObserver.prototype.onCompleted = function () {
      if (!this.isStopped) {
        this.isStopped = true;
        this.completed();
      }
    };

    /**
     * Disposes the observer, causing it to transition to the stopped state.
     */
    AbstractObserver.prototype.dispose = function () { this.isStopped = true; };

    AbstractObserver.prototype.fail = function (e) {
      if (!this.isStopped) {
        this.isStopped = true;
        this.error(e);
        return true;
      }

      return false;
    };

    return AbstractObserver;
  }(Observer));

  /**
   * Class to create an Observer instance from delegate-based implementations of the on* methods.
   */
  var AnonymousObserver = Rx.AnonymousObserver = (function (__super__) {
    inherits(AnonymousObserver, __super__);

    /**
     * Creates an observer from the specified OnNext, OnError, and OnCompleted actions.
     * @param {Any} onNext Observer's OnNext action implementation.
     * @param {Any} onError Observer's OnError action implementation.
     * @param {Any} onCompleted Observer's OnCompleted action implementation.
     */
    function AnonymousObserver(onNext, onError, onCompleted) {
      __super__.call(this);
      this._onNext = onNext;
      this._onError = onError;
      this._onCompleted = onCompleted;
    }

    /**
     * Calls the onNext action.
     * @param {Any} value Next element in the sequence.
     */
    AnonymousObserver.prototype.next = function (value) {
      this._onNext(value);
    };

    /**
     * Calls the onError action.
     * @param {Any} error The error that has occurred.
     */
    AnonymousObserver.prototype.error = function (error) {
      this._onError(error);
    };

    /**
     *  Calls the onCompleted action.
     */
    AnonymousObserver.prototype.completed = function () {
      this._onCompleted();
    };

    return AnonymousObserver;
  }(AbstractObserver));

  var CheckedObserver = (function (__super__) {
    inherits(CheckedObserver, __super__);

    function CheckedObserver(observer) {
      __super__.call(this);
      this._observer = observer;
      this._state = 0; // 0 - idle, 1 - busy, 2 - done
    }

    var CheckedObserverPrototype = CheckedObserver.prototype;

    CheckedObserverPrototype.onNext = function (value) {
      this.checkAccess();
      var res = tryCatch(this._observer.onNext).call(this._observer, value);
      this._state = 0;
      res === errorObj && thrower(res.e);
    };

    CheckedObserverPrototype.onError = function (err) {
      this.checkAccess();
      var res = tryCatch(this._observer.onError).call(this._observer, err);
      this._state = 2;
      res === errorObj && thrower(res.e);
    };

    CheckedObserverPrototype.onCompleted = function () {
      this.checkAccess();
      var res = tryCatch(this._observer.onCompleted).call(this._observer);
      this._state = 2;
      res === errorObj && thrower(res.e);
    };

    CheckedObserverPrototype.checkAccess = function () {
      if (this._state === 1) { throw new Error('Re-entrancy detected'); }
      if (this._state === 2) { throw new Error('Observer completed'); }
      if (this._state === 0) { this._state = 1; }
    };

    return CheckedObserver;
  }(Observer));

  var ScheduledObserver = Rx.internals.ScheduledObserver = (function (__super__) {
    inherits(ScheduledObserver, __super__);

    function ScheduledObserver(scheduler, observer) {
      __super__.call(this);
      this.scheduler = scheduler;
      this.observer = observer;
      this.isAcquired = false;
      this.hasFaulted = false;
      this.queue = [];
      this.disposable = new SerialDisposable();
    }

    function enqueueNext(observer, x) { return function () { observer.onNext(x); }; }
    function enqueueError(observer, e) { return function () { observer.onError(e); }; }
    function enqueueCompleted(observer) { return function () { observer.onCompleted(); }; }

    ScheduledObserver.prototype.next = function (x) {
      this.queue.push(enqueueNext(this.observer, x));
    };

    ScheduledObserver.prototype.error = function (e) {
      this.queue.push(enqueueError(this.observer, e));
    };

    ScheduledObserver.prototype.completed = function () {
      this.queue.push(enqueueCompleted(this.observer));
    };


    function scheduleMethod(state, recurse) {
      var work;
      if (state.queue.length > 0) {
        work = state.queue.shift();
      } else {
        state.isAcquired = false;
        return;
      }
      var res = tryCatch(work)();
      if (res === errorObj) {
        state.queue = [];
        state.hasFaulted = true;
        return thrower(res.e);
      }
      recurse(state);
    }

    ScheduledObserver.prototype.ensureActive = function () {
      var isOwner = false;
      if (!this.hasFaulted && this.queue.length > 0) {
        isOwner = !this.isAcquired;
        this.isAcquired = true;
      }
      isOwner &&
        this.disposable.setDisposable(this.scheduler.scheduleRecursive(this, scheduleMethod));
    };

    ScheduledObserver.prototype.dispose = function () {
      __super__.prototype.dispose.call(this);
      this.disposable.dispose();
    };

    return ScheduledObserver;
  }(AbstractObserver));

  var ObserveOnObserver = (function (__super__) {
    inherits(ObserveOnObserver, __super__);

    function ObserveOnObserver(scheduler, observer, cancel) {
      __super__.call(this, scheduler, observer);
      this._cancel = cancel;
    }

    ObserveOnObserver.prototype.next = function (value) {
      __super__.prototype.next.call(this, value);
      this.ensureActive();
    };

    ObserveOnObserver.prototype.error = function (e) {
      __super__.prototype.error.call(this, e);
      this.ensureActive();
    };

    ObserveOnObserver.prototype.completed = function () {
      __super__.prototype.completed.call(this);
      this.ensureActive();
    };

    ObserveOnObserver.prototype.dispose = function () {
      __super__.prototype.dispose.call(this);
      this._cancel && this._cancel.dispose();
      this._cancel = null;
    };

    return ObserveOnObserver;
  })(ScheduledObserver);

  var observableProto;

  /**
   * Represents a push-style collection.
   */
  var Observable = Rx.Observable = (function () {

    function makeSubscribe(self, subscribe) {
      return function (o) {
        var oldOnError = o.onError;
        o.onError = function (e) {
          makeStackTraceLong(e, self);
          oldOnError.call(o, e);
        };

        return subscribe.call(self, o);
      };
    }

    function Observable() {
      if (Rx.config.longStackSupport && hasStacks) {
        var oldSubscribe = this._subscribe;
        var e = tryCatch(thrower)(new Error()).e;
        this.stack = e.stack.substring(e.stack.indexOf('\n') + 1);
        this._subscribe = makeSubscribe(this, oldSubscribe);
      }
    }

    observableProto = Observable.prototype;

    /**
    * Determines whether the given object is an Observable
    * @param {Any} An object to determine whether it is an Observable
    * @returns {Boolean} true if an Observable, else false.
    */
    Observable.isObservable = function (o) {
      return o && isFunction(o.subscribe);
    };

    /**
     *  Subscribes an o to the observable sequence.
     *  @param {Mixed} [oOrOnNext] The object that is to receive notifications or an action to invoke for each element in the observable sequence.
     *  @param {Function} [onError] Action to invoke upon exceptional termination of the observable sequence.
     *  @param {Function} [onCompleted] Action to invoke upon graceful termination of the observable sequence.
     *  @returns {Diposable} A disposable handling the subscriptions and unsubscriptions.
     */
    observableProto.subscribe = observableProto.forEach = function (oOrOnNext, onError, onCompleted) {
      return this._subscribe(typeof oOrOnNext === 'object' ?
        oOrOnNext :
        observerCreate(oOrOnNext, onError, onCompleted));
    };

    /**
     * Subscribes to the next value in the sequence with an optional "this" argument.
     * @param {Function} onNext The function to invoke on each element in the observable sequence.
     * @param {Any} [thisArg] Object to use as this when executing callback.
     * @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
     */
    observableProto.subscribeOnNext = function (onNext, thisArg) {
      return this._subscribe(observerCreate(typeof thisArg !== 'undefined' ? function(x) { onNext.call(thisArg, x); } : onNext));
    };

    /**
     * Subscribes to an exceptional condition in the sequence with an optional "this" argument.
     * @param {Function} onError The function to invoke upon exceptional termination of the observable sequence.
     * @param {Any} [thisArg] Object to use as this when executing callback.
     * @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
     */
    observableProto.subscribeOnError = function (onError, thisArg) {
      return this._subscribe(observerCreate(null, typeof thisArg !== 'undefined' ? function(e) { onError.call(thisArg, e); } : onError));
    };

    /**
     * Subscribes to the next value in the sequence with an optional "this" argument.
     * @param {Function} onCompleted The function to invoke upon graceful termination of the observable sequence.
     * @param {Any} [thisArg] Object to use as this when executing callback.
     * @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
     */
    observableProto.subscribeOnCompleted = function (onCompleted, thisArg) {
      return this._subscribe(observerCreate(null, null, typeof thisArg !== 'undefined' ? function() { onCompleted.call(thisArg); } : onCompleted));
    };

    return Observable;
  })();

  var ObservableBase = Rx.ObservableBase = (function (__super__) {
    inherits(ObservableBase, __super__);

    function fixSubscriber(subscriber) {
      return subscriber && isFunction(subscriber.dispose) ? subscriber :
        isFunction(subscriber) ? disposableCreate(subscriber) : disposableEmpty;
    }

    function setDisposable(s, state) {
      var ado = state[0], self = state[1];
      var sub = tryCatch(self.subscribeCore).call(self, ado);
      if (sub === errorObj && !ado.fail(errorObj.e)) { thrower(errorObj.e); }
      ado.setDisposable(fixSubscriber(sub));
    }

    function ObservableBase() {
      __super__.call(this);
    }

    ObservableBase.prototype._subscribe = function (o) {
      var ado = new AutoDetachObserver(o), state = [ado, this];

      if (currentThreadScheduler.scheduleRequired()) {
        currentThreadScheduler.schedule(state, setDisposable);
      } else {
        setDisposable(null, state);
      }
      return ado;
    };

    ObservableBase.prototype.subscribeCore = notImplemented;

    return ObservableBase;
  }(Observable));

var FlatMapObservable = Rx.FlatMapObservable = (function(__super__) {

    inherits(FlatMapObservable, __super__);

    function FlatMapObservable(source, selector, resultSelector, thisArg) {
      this.resultSelector = isFunction(resultSelector) ? resultSelector : null;
      this.selector = bindCallback(isFunction(selector) ? selector : function() { return selector; }, thisArg, 3);
      this.source = source;
      __super__.call(this);
    }

    FlatMapObservable.prototype.subscribeCore = function(o) {
      return this.source.subscribe(new InnerObserver(o, this.selector, this.resultSelector, this));
    };

    inherits(InnerObserver, AbstractObserver);
    function InnerObserver(observer, selector, resultSelector, source) {
      this.i = 0;
      this.selector = selector;
      this.resultSelector = resultSelector;
      this.source = source;
      this.o = observer;
      AbstractObserver.call(this);
    }

    InnerObserver.prototype._wrapResult = function(result, x, i) {
      return this.resultSelector ?
        result.map(function(y, i2) { return this.resultSelector(x, y, i, i2); }, this) :
        result;
    };

    InnerObserver.prototype.next = function(x) {
      var i = this.i++;
      var result = tryCatch(this.selector)(x, i, this.source);
      if (result === errorObj) { return this.o.onError(result.e); }

      isPromise(result) && (result = observableFromPromise(result));
      (isArrayLike(result) || isIterable(result)) && (result = Observable.from(result));
      this.o.onNext(this._wrapResult(result, x, i));
    };

    InnerObserver.prototype.error = function(e) { this.o.onError(e); };

    InnerObserver.prototype.completed = function() { this.o.onCompleted(); };

    return FlatMapObservable;

}(ObservableBase));

  var Enumerable = Rx.internals.Enumerable = function () { };

  function IsDisposedDisposable(state) {
    this._s = state;
    this.isDisposed = false;
  }

  IsDisposedDisposable.prototype.dispose = function () {
    if (!this.isDisposed) {
      this.isDisposed = true;
      this._s.isDisposed = true;
    }
  };

  var ConcatEnumerableObservable = (function(__super__) {
    inherits(ConcatEnumerableObservable, __super__);
    function ConcatEnumerableObservable(sources) {
      this.sources = sources;
      __super__.call(this);
    }

    function scheduleMethod(state, recurse) {
      if (state.isDisposed) { return; }
      var currentItem = tryCatch(state.e.next).call(state.e);
      if (currentItem === errorObj) { return state.o.onError(currentItem.e); }
      if (currentItem.done) { return state.o.onCompleted(); }

      // Check if promise
      var currentValue = currentItem.value;
      isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));

      var d = new SingleAssignmentDisposable();
      state.subscription.setDisposable(d);
      d.setDisposable(currentValue.subscribe(new InnerObserver(state, recurse)));
    }

    ConcatEnumerableObservable.prototype.subscribeCore = function (o) {
      var subscription = new SerialDisposable();
      var state = {
        isDisposed: false,
        o: o,
        subscription: subscription,
        e: this.sources[$iterator$]()
      };

      var cancelable = currentThreadScheduler.scheduleRecursive(state, scheduleMethod);
      return new NAryDisposable([subscription, cancelable, new IsDisposedDisposable(state)]);
    };

    function InnerObserver(state, recurse) {
      this._state = state;
      this._recurse = recurse;
      AbstractObserver.call(this);
    }

    inherits(InnerObserver, AbstractObserver);

    InnerObserver.prototype.next = function (x) { this._state.o.onNext(x); };
    InnerObserver.prototype.error = function (e) { this._state.o.onError(e); };
    InnerObserver.prototype.completed = function () { this._recurse(this._state); };

    return ConcatEnumerableObservable;
  }(ObservableBase));

  Enumerable.prototype.concat = function () {
    return new ConcatEnumerableObservable(this);
  };

  var CatchErrorObservable = (function(__super__) {
    function CatchErrorObservable(sources) {
      this.sources = sources;
      __super__.call(this);
    }

    inherits(CatchErrorObservable, __super__);

    function scheduleMethod(state, recurse) {
      if (state.isDisposed) { return; }
      var currentItem = tryCatch(state.e.next).call(state.e);
      if (currentItem === errorObj) { return state.o.onError(currentItem.e); }
      if (currentItem.done) { return state.lastError !== null ? state.o.onError(state.lastError) : state.o.onCompleted(); }

      var currentValue = currentItem.value;
      isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));

      var d = new SingleAssignmentDisposable();
      state.subscription.setDisposable(d);
      d.setDisposable(currentValue.subscribe(new InnerObserver(state, recurse)));
    }

    CatchErrorObservable.prototype.subscribeCore = function (o) {
      var subscription = new SerialDisposable();
      var state = {
        isDisposed: false,
        e: this.sources[$iterator$](),
        subscription: subscription,
        lastError: null,
        o: o
      };

      var cancelable = currentThreadScheduler.scheduleRecursive(state, scheduleMethod);
      return new NAryDisposable([subscription, cancelable, new IsDisposedDisposable(state)]);
    };

    function InnerObserver(state, recurse) {
      this._state = state;
      this._recurse = recurse;
      AbstractObserver.call(this);
    }

    inherits(InnerObserver, AbstractObserver);

    InnerObserver.prototype.next = function (x) { this._state.o.onNext(x); };
    InnerObserver.prototype.error = function (e) { this._state.lastError = e; this._recurse(this._state); };
    InnerObserver.prototype.completed = function () { this._state.o.onCompleted(); };

    return CatchErrorObservable;
  }(ObservableBase));

  Enumerable.prototype.catchError = function () {
    return new CatchErrorObservable(this);
  };

  var RepeatEnumerable = (function (__super__) {
    inherits(RepeatEnumerable, __super__);
    function RepeatEnumerable(v, c) {
      this.v = v;
      this.c = c == null ? -1 : c;
    }

    RepeatEnumerable.prototype[$iterator$] = function () {
      return new RepeatEnumerator(this);
    };

    function RepeatEnumerator(p) {
      this.v = p.v;
      this.l = p.c;
    }

    RepeatEnumerator.prototype.next = function () {
      if (this.l === 0) { return doneEnumerator; }
      if (this.l > 0) { this.l--; }
      return { done: false, value: this.v };
    };

    return RepeatEnumerable;
  }(Enumerable));

  var enumerableRepeat = Enumerable.repeat = function (value, repeatCount) {
    return new RepeatEnumerable(value, repeatCount);
  };

  var OfEnumerable = (function(__super__) {
    inherits(OfEnumerable, __super__);
    function OfEnumerable(s, fn, thisArg) {
      this.s = s;
      this.fn = fn ? bindCallback(fn, thisArg, 3) : null;
    }
    OfEnumerable.prototype[$iterator$] = function () {
      return new OfEnumerator(this);
    };

    function OfEnumerator(p) {
      this.i = -1;
      this.s = p.s;
      this.l = this.s.length;
      this.fn = p.fn;
    }

    OfEnumerator.prototype.next = function () {
     return ++this.i < this.l ?
       { done: false, value: !this.fn ? this.s[this.i] : this.fn(this.s[this.i], this.i, this.s) } :
       doneEnumerator;
    };

    return OfEnumerable;
  }(Enumerable));

  var enumerableOf = Enumerable.of = function (source, selector, thisArg) {
    return new OfEnumerable(source, selector, thisArg);
  };

var ObserveOnObservable = (function (__super__) {
  inherits(ObserveOnObservable, __super__);
  function ObserveOnObservable(source, s) {
    this.source = source;
    this._s = s;
    __super__.call(this);
  }

  ObserveOnObservable.prototype.subscribeCore = function (o) {
    return this.source.subscribe(new ObserveOnObserver(this._s, o));
  };

  return ObserveOnObservable;
}(ObservableBase));

   /**
   *  Wraps the source sequence in order to run its observer callbacks on the specified scheduler.
   *
   *  This only invokes observer callbacks on a scheduler. In case the subscription and/or unsubscription actions have side-effects
   *  that require to be run on a scheduler, use subscribeOn.
   *
   *  @param {Scheduler} scheduler Scheduler to notify observers on.
   *  @returns {Observable} The source sequence whose observations happen on the specified scheduler.
   */
  observableProto.observeOn = function (scheduler) {
    return new ObserveOnObservable(this, scheduler);
  };

  var SubscribeOnObservable = (function (__super__) {
    inherits(SubscribeOnObservable, __super__);
    function SubscribeOnObservable(source, s) {
      this.source = source;
      this._s = s;
      __super__.call(this);
    }

    function scheduleMethod(scheduler, state) {
      var source = state[0], d = state[1], o = state[2];
      d.setDisposable(new ScheduledDisposable(scheduler, source.subscribe(o)));
    }

    SubscribeOnObservable.prototype.subscribeCore = function (o) {
      var m = new SingleAssignmentDisposable(), d = new SerialDisposable();
      d.setDisposable(m);
      m.setDisposable(this._s.schedule([this.source, d, o], scheduleMethod));
      return d;
    };

    return SubscribeOnObservable;
  }(ObservableBase));

   /**
   *  Wraps the source sequence in order to run its subscription and unsubscription logic on the specified scheduler. This operation is not commonly used;
   *  see the remarks section for more information on the distinction between subscribeOn and observeOn.

   *  This only performs the side-effects of subscription and unsubscription on the specified scheduler. In order to invoke observer
   *  callbacks on a scheduler, use observeOn.

   *  @param {Scheduler} scheduler Scheduler to perform subscription and unsubscription actions on.
   *  @returns {Observable} The source sequence whose subscriptions and unsubscriptions happen on the specified scheduler.
   */
  observableProto.subscribeOn = function (scheduler) {
    return new SubscribeOnObservable(this, scheduler);
  };

  var FromPromiseObservable = (function(__super__) {
    inherits(FromPromiseObservable, __super__);
    function FromPromiseObservable(p, s) {
      this._p = p;
      this._s = s;
      __super__.call(this);
    }

    function scheduleNext(s, state) {
      var o = state[0], data = state[1];
      o.onNext(data);
      o.onCompleted();
    }

    function scheduleError(s, state) {
      var o = state[0], err = state[1];
      o.onError(err);
    }

    FromPromiseObservable.prototype.subscribeCore = function(o) {
      var sad = new SingleAssignmentDisposable(), self = this, p = this._p;

      if (isFunction(p)) {
        p = tryCatch(p)();
        if (p === errorObj) {
          o.onError(p.e);
          return sad;
        }
      }

      p
        .then(function (data) {
          sad.setDisposable(self._s.schedule([o, data], scheduleNext));
        }, function (err) {
          sad.setDisposable(self._s.schedule([o, err], scheduleError));
        });

      return sad;
    };

    return FromPromiseObservable;
  }(ObservableBase));

  /**
  * Converts a Promise to an Observable sequence
  * @param {Promise} An ES6 Compliant promise.
  * @returns {Observable} An Observable sequence which wraps the existing promise success and failure.
  */
  var observableFromPromise = Observable.fromPromise = function (promise, scheduler) {
    scheduler || (scheduler = defaultScheduler);
    return new FromPromiseObservable(promise, scheduler);
  };

  /*
   * Converts an existing observable sequence to an ES6 Compatible Promise
   * @example
   * var promise = Rx.Observable.return(42).toPromise(RSVP.Promise);
   *
   * // With config
   * Rx.config.Promise = RSVP.Promise;
   * var promise = Rx.Observable.return(42).toPromise();
   * @param {Function} [promiseCtor] The constructor of the promise. If not provided, it looks for it in Rx.config.Promise.
   * @returns {Promise} An ES6 compatible promise with the last value from the observable sequence.
   */
  observableProto.toPromise = function (promiseCtor) {
    promiseCtor || (promiseCtor = Rx.config.Promise);
    if (!promiseCtor) { throw new NotSupportedError('Promise type not provided nor in Rx.config.Promise'); }
    var source = this;
    return new promiseCtor(function (resolve, reject) {
      // No cancellation can be done
      var value;
      source.subscribe(function (v) {
        value = v;
      }, reject, function () {
        resolve(value);
      });
    });
  };

  var ToArrayObservable = (function(__super__) {
    inherits(ToArrayObservable, __super__);
    function ToArrayObservable(source) {
      this.source = source;
      __super__.call(this);
    }

    ToArrayObservable.prototype.subscribeCore = function(o) {
      return this.source.subscribe(new InnerObserver(o));
    };

    inherits(InnerObserver, AbstractObserver);
    function InnerObserver(o) {
      this.o = o;
      this.a = [];
      AbstractObserver.call(this);
    }
    
    InnerObserver.prototype.next = function (x) { this.a.push(x); };
    InnerObserver.prototype.error = function (e) { this.o.onError(e);  };
    InnerObserver.prototype.completed = function () { this.o.onNext(this.a); this.o.onCompleted(); };

    return ToArrayObservable;
  }(ObservableBase));

  /**
  * Creates an array from an observable sequence.
  * @returns {Observable} An observable sequence containing a single element with a list containing all the elements of the source sequence.
  */
  observableProto.toArray = function () {
    return new ToArrayObservable(this);
  };

  /**
   *  Creates an observable sequence from a specified subscribe method implementation.
   * @example
   *  var res = Rx.Observable.create(function (observer) { return function () { } );
   *  var res = Rx.Observable.create(function (observer) { return Rx.Disposable.empty; } );
   *  var res = Rx.Observable.create(function (observer) { } );
   * @param {Function} subscribe Implementation of the resulting observable sequence's subscribe method, returning a function that will be wrapped in a Disposable.
   * @returns {Observable} The observable sequence with the specified implementation for the Subscribe method.
   */
  Observable.create = function (subscribe, parent) {
    return new AnonymousObservable(subscribe, parent);
  };

  var Defer = (function(__super__) {
    inherits(Defer, __super__);
    function Defer(factory) {
      this._f = factory;
      __super__.call(this);
    }

    Defer.prototype.subscribeCore = function (o) {
      var result = tryCatch(this._f)();
      if (result === errorObj) { return observableThrow(result.e).subscribe(o);}
      isPromise(result) && (result = observableFromPromise(result));
      return result.subscribe(o);
    };

    return Defer;
  }(ObservableBase));

  /**
   *  Returns an observable sequence that invokes the specified factory function whenever a new observer subscribes.
   *
   * @example
   *  var res = Rx.Observable.defer(function () { return Rx.Observable.fromArray([1,2,3]); });
   * @param {Function} observableFactory Observable factory function to invoke for each observer that subscribes to the resulting sequence or Promise.
   * @returns {Observable} An observable sequence whose observers trigger an invocation of the given observable factory function.
   */
  var observableDefer = Observable.defer = function (observableFactory) {
    return new Defer(observableFactory);
  };

  var EmptyObservable = (function(__super__) {
    inherits(EmptyObservable, __super__);
    function EmptyObservable(scheduler) {
      this.scheduler = scheduler;
      __super__.call(this);
    }

    EmptyObservable.prototype.subscribeCore = function (observer) {
      var sink = new EmptySink(observer, this.scheduler);
      return sink.run();
    };

    function EmptySink(observer, scheduler) {
      this.observer = observer;
      this.scheduler = scheduler;
    }

    function scheduleItem(s, state) {
      state.onCompleted();
      return disposableEmpty;
    }

    EmptySink.prototype.run = function () {
      var state = this.observer;
      return this.scheduler === immediateScheduler ?
        scheduleItem(null, state) :
        this.scheduler.schedule(state, scheduleItem);
    };

    return EmptyObservable;
  }(ObservableBase));

  var EMPTY_OBSERVABLE = new EmptyObservable(immediateScheduler);

  /**
   *  Returns an empty observable sequence, using the specified scheduler to send out the single OnCompleted message.
   *
   * @example
   *  var res = Rx.Observable.empty();
   *  var res = Rx.Observable.empty(Rx.Scheduler.timeout);
   * @param {Scheduler} [scheduler] Scheduler to send the termination call on.
   * @returns {Observable} An observable sequence with no elements.
   */
  var observableEmpty = Observable.empty = function (scheduler) {
    isScheduler(scheduler) || (scheduler = immediateScheduler);
    return scheduler === immediateScheduler ? EMPTY_OBSERVABLE : new EmptyObservable(scheduler);
  };

  var FromObservable = (function(__super__) {
    inherits(FromObservable, __super__);
    function FromObservable(iterable, fn, scheduler) {
      this._iterable = iterable;
      this._fn = fn;
      this._scheduler = scheduler;
      __super__.call(this);
    }

    function createScheduleMethod(o, it, fn) {
      return function loopRecursive(i, recurse) {
        var next = tryCatch(it.next).call(it);
        if (next === errorObj) { return o.onError(next.e); }
        if (next.done) { return o.onCompleted(); }

        var result = next.value;

        if (isFunction(fn)) {
          result = tryCatch(fn)(result, i);
          if (result === errorObj) { return o.onError(result.e); }
        }

        o.onNext(result);
        recurse(i + 1);
      };
    }

    FromObservable.prototype.subscribeCore = function (o) {
      var list = Object(this._iterable),
          it = getIterable(list);

      return this._scheduler.scheduleRecursive(0, createScheduleMethod(o, it, this._fn));
    };

    return FromObservable;
  }(ObservableBase));

  var maxSafeInteger = Math.pow(2, 53) - 1;

  function StringIterable(s) {
    this._s = s;
  }

  StringIterable.prototype[$iterator$] = function () {
    return new StringIterator(this._s);
  };

  function StringIterator(s) {
    this._s = s;
    this._l = s.length;
    this._i = 0;
  }

  StringIterator.prototype[$iterator$] = function () {
    return this;
  };

  StringIterator.prototype.next = function () {
    return this._i < this._l ? { done: false, value: this._s.charAt(this._i++) } : doneEnumerator;
  };

  function ArrayIterable(a) {
    this._a = a;
  }

  ArrayIterable.prototype[$iterator$] = function () {
    return new ArrayIterator(this._a);
  };

  function ArrayIterator(a) {
    this._a = a;
    this._l = toLength(a);
    this._i = 0;
  }

  ArrayIterator.prototype[$iterator$] = function () {
    return this;
  };

  ArrayIterator.prototype.next = function () {
    return this._i < this._l ? { done: false, value: this._a[this._i++] } : doneEnumerator;
  };

  function numberIsFinite(value) {
    return typeof value === 'number' && root.isFinite(value);
  }

  function isNan(n) {
    return n !== n;
  }

  function getIterable(o) {
    var i = o[$iterator$], it;
    if (!i && typeof o === 'string') {
      it = new StringIterable(o);
      return it[$iterator$]();
    }
    if (!i && o.length !== undefined) {
      it = new ArrayIterable(o);
      return it[$iterator$]();
    }
    if (!i) { throw new TypeError('Object is not iterable'); }
    return o[$iterator$]();
  }

  function sign(value) {
    var number = +value;
    if (number === 0) { return number; }
    if (isNaN(number)) { return number; }
    return number < 0 ? -1 : 1;
  }

  function toLength(o) {
    var len = +o.length;
    if (isNaN(len)) { return 0; }
    if (len === 0 || !numberIsFinite(len)) { return len; }
    len = sign(len) * Math.floor(Math.abs(len));
    if (len <= 0) { return 0; }
    if (len > maxSafeInteger) { return maxSafeInteger; }
    return len;
  }

  /**
  * This method creates a new Observable sequence from an array-like or iterable object.
  * @param {Any} arrayLike An array-like or iterable object to convert to an Observable sequence.
  * @param {Function} [mapFn] Map function to call on every element of the array.
  * @param {Any} [thisArg] The context to use calling the mapFn if provided.
  * @param {Scheduler} [scheduler] Optional scheduler to use for scheduling.  If not provided, defaults to Scheduler.currentThread.
  */
  var observableFrom = Observable.from = function (iterable, mapFn, thisArg, scheduler) {
    if (iterable == null) {
      throw new Error('iterable cannot be null.')
    }
    if (mapFn && !isFunction(mapFn)) {
      throw new Error('mapFn when provided must be a function');
    }
    if (mapFn) {
      var mapper = bindCallback(mapFn, thisArg, 2);
    }
    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
    return new FromObservable(iterable, mapper, scheduler);
  }

  var FromArrayObservable = (function(__super__) {
    inherits(FromArrayObservable, __super__);
    function FromArrayObservable(args, scheduler) {
      this._args = args;
      this._scheduler = scheduler;
      __super__.call(this);
    }

    function scheduleMethod(o, args) {
      var len = args.length;
      return function loopRecursive (i, recurse) {
        if (i < len) {
          o.onNext(args[i]);
          recurse(i + 1);
        } else {
          o.onCompleted();
        }
      };
    }

    FromArrayObservable.prototype.subscribeCore = function (o) {
      return this._scheduler.scheduleRecursive(0, scheduleMethod(o, this._args));
    };

    return FromArrayObservable;
  }(ObservableBase));

  /**
  *  Converts an array to an observable sequence, using an optional scheduler to enumerate the array.
  * @deprecated use Observable.from or Observable.of
  * @param {Scheduler} [scheduler] Scheduler to run the enumeration of the input sequence on.
  * @returns {Observable} The observable sequence whose elements are pulled from the given enumerable sequence.
  */
  var observableFromArray = Observable.fromArray = function (array, scheduler) {
    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
    return new FromArrayObservable(array, scheduler)
  };

  var GenerateObservable = (function (__super__) {
    inherits(GenerateObservable, __super__);
    function GenerateObservable(state, cndFn, itrFn, resFn, s) {
      this._initialState = state;
      this._cndFn = cndFn;
      this._itrFn = itrFn;
      this._resFn = resFn;
      this._s = s;
      __super__.call(this);
    }

    function scheduleRecursive(state, recurse) {
      if (state.first) {
        state.first = false;
      } else {
        state.newState = tryCatch(state.self._itrFn)(state.newState);
        if (state.newState === errorObj) { return state.o.onError(state.newState.e); }
      }
      var hasResult = tryCatch(state.self._cndFn)(state.newState);
      if (hasResult === errorObj) { return state.o.onError(hasResult.e); }
      if (hasResult) {
        var result = tryCatch(state.self._resFn)(state.newState);
        if (result === errorObj) { return state.o.onError(result.e); }
        state.o.onNext(result);
        recurse(state);
      } else {
        state.o.onCompleted();
      }
    }

    GenerateObservable.prototype.subscribeCore = function (o) {
      var state = {
        o: o,
        self: this,
        first: true,
        newState: this._initialState
      };
      return this._s.scheduleRecursive(state, scheduleRecursive);
    };

    return GenerateObservable;
  }(ObservableBase));

  /**
   *  Generates an observable sequence by running a state-driven loop producing the sequence's elements, using the specified scheduler to send out observer messages.
   *
   * @example
   *  var res = Rx.Observable.generate(0, function (x) { return x < 10; }, function (x) { return x + 1; }, function (x) { return x; });
   *  var res = Rx.Observable.generate(0, function (x) { return x < 10; }, function (x) { return x + 1; }, function (x) { return x; }, Rx.Scheduler.timeout);
   * @param {Mixed} initialState Initial state.
   * @param {Function} condition Condition to terminate generation (upon returning false).
   * @param {Function} iterate Iteration step function.
   * @param {Function} resultSelector Selector function for results produced in the sequence.
   * @param {Scheduler} [scheduler] Scheduler on which to run the generator loop. If not provided, defaults to Scheduler.currentThread.
   * @returns {Observable} The generated sequence.
   */
  Observable.generate = function (initialState, condition, iterate, resultSelector, scheduler) {
    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
    return new GenerateObservable(initialState, condition, iterate, resultSelector, scheduler);
  };

  function observableOf (scheduler, array) {
    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
    return new FromArrayObservable(array, scheduler);
  }

  /**
  *  This method creates a new Observable instance with a variable number of arguments, regardless of number or type of the arguments.
  * @returns {Observable} The observable sequence whose elements are pulled from the given arguments.
  */
  Observable.of = function () {
    var len = arguments.length, args = new Array(len);
    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
    return new FromArrayObservable(args, currentThreadScheduler);
  };

  /**
  *  This method creates a new Observable instance with a variable number of arguments, regardless of number or type of the arguments.
  * @param {Scheduler} scheduler A scheduler to use for scheduling the arguments.
  * @returns {Observable} The observable sequence whose elements are pulled from the given arguments.
  */
  Observable.ofWithScheduler = function (scheduler) {
    var len = arguments.length, args = new Array(len - 1);
    for(var i = 1; i < len; i++) { args[i - 1] = arguments[i]; }
    return new FromArrayObservable(args, scheduler);
  };

  /**
   * Creates an Observable sequence from changes to an array using Array.observe.
   * @param {Array} array An array to observe changes.
   * @returns {Observable} An observable sequence containing changes to an array from Array.observe.
   */
  Observable.ofArrayChanges = function(array) {
    if (!Array.isArray(array)) { throw new TypeError('Array.observe only accepts arrays.'); }
    if (typeof Array.observe !== 'function' && typeof Array.unobserve !== 'function') { throw new TypeError('Array.observe is not supported on your platform') }
    return new AnonymousObservable(function(observer) {
      function observerFn(changes) {
        for(var i = 0, len = changes.length; i < len; i++) {
          observer.onNext(changes[i]);
        }
      }
      
      Array.observe(array, observerFn);

      return function () {
        Array.unobserve(array, observerFn);
      };
    });
  };

  /**
   * Creates an Observable sequence from changes to an object using Object.observe.
   * @param {Object} obj An object to observe changes.
   * @returns {Observable} An observable sequence containing changes to an object from Object.observe.
   */
  Observable.ofObjectChanges = function(obj) {
    if (obj == null) { throw new TypeError('object must not be null or undefined.'); }
    if (typeof Object.observe !== 'function' && typeof Object.unobserve !== 'function') { throw new TypeError('Object.observe is not supported on your platform') }
    return new AnonymousObservable(function(observer) {
      function observerFn(changes) {
        for(var i = 0, len = changes.length; i < len; i++) {
          observer.onNext(changes[i]);
        }
      }

      Object.observe(obj, observerFn);

      return function () {
        Object.unobserve(obj, observerFn);
      };
    });
  };

  var NeverObservable = (function(__super__) {
    inherits(NeverObservable, __super__);
    function NeverObservable() {
      __super__.call(this);
    }

    NeverObservable.prototype.subscribeCore = function (observer) {
      return disposableEmpty;
    };

    return NeverObservable;
  }(ObservableBase));

  var NEVER_OBSERVABLE = new NeverObservable();

  /**
   * Returns a non-terminating observable sequence, which can be used to denote an infinite duration (e.g. when using reactive joins).
   * @returns {Observable} An observable sequence whose observers will never get called.
   */
  var observableNever = Observable.never = function () {
    return NEVER_OBSERVABLE;
  };

  var PairsObservable = (function(__super__) {
    inherits(PairsObservable, __super__);
    function PairsObservable(o, scheduler) {
      this._o = o;
      this._keys = Object.keys(o);
      this._scheduler = scheduler;
      __super__.call(this);
    }

    function scheduleMethod(o, obj, keys) {
      return function loopRecursive(i, recurse) {
        if (i < keys.length) {
          var key = keys[i];
          o.onNext([key, obj[key]]);
          recurse(i + 1);
        } else {
          o.onCompleted();
        }
      };
    }

    PairsObservable.prototype.subscribeCore = function (o) {
      return this._scheduler.scheduleRecursive(0, scheduleMethod(o, this._o, this._keys));
    };

    return PairsObservable;
  }(ObservableBase));

  /**
   * Convert an object into an observable sequence of [key, value] pairs.
   * @param {Object} obj The object to inspect.
   * @param {Scheduler} [scheduler] Scheduler to run the enumeration of the input sequence on.
   * @returns {Observable} An observable sequence of [key, value] pairs from the object.
   */
  Observable.pairs = function (obj, scheduler) {
    scheduler || (scheduler = currentThreadScheduler);
    return new PairsObservable(obj, scheduler);
  };

    var RangeObservable = (function(__super__) {
    inherits(RangeObservable, __super__);
    function RangeObservable(start, count, scheduler) {
      this.start = start;
      this.rangeCount = count;
      this.scheduler = scheduler;
      __super__.call(this);
    }

    function loopRecursive(start, count, o) {
      return function loop (i, recurse) {
        if (i < count) {
          o.onNext(start + i);
          recurse(i + 1);
        } else {
          o.onCompleted();
        }
      };
    }

    RangeObservable.prototype.subscribeCore = function (o) {
      return this.scheduler.scheduleRecursive(
        0,
        loopRecursive(this.start, this.rangeCount, o)
      );
    };

    return RangeObservable;
  }(ObservableBase));

  /**
  *  Generates an observable sequence of integral numbers within a specified range, using the specified scheduler to send out observer messages.
  * @param {Number} start The value of the first integer in the sequence.
  * @param {Number} count The number of sequential integers to generate.
  * @param {Scheduler} [scheduler] Scheduler to run the generator loop on. If not specified, defaults to Scheduler.currentThread.
  * @returns {Observable} An observable sequence that contains a range of sequential integral numbers.
  */
  Observable.range = function (start, count, scheduler) {
    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
    return new RangeObservable(start, count, scheduler);
  };

  var RepeatObservable = (function(__super__) {
    inherits(RepeatObservable, __super__);
    function RepeatObservable(value, repeatCount, scheduler) {
      this.value = value;
      this.repeatCount = repeatCount == null ? -1 : repeatCount;
      this.scheduler = scheduler;
      __super__.call(this);
    }

    RepeatObservable.prototype.subscribeCore = function (observer) {
      var sink = new RepeatSink(observer, this);
      return sink.run();
    };

    return RepeatObservable;
  }(ObservableBase));

  function RepeatSink(observer, parent) {
    this.observer = observer;
    this.parent = parent;
  }

  RepeatSink.prototype.run = function () {
    var observer = this.observer, value = this.parent.value;
    function loopRecursive(i, recurse) {
      if (i === -1 || i > 0) {
        observer.onNext(value);
        i > 0 && i--;
      }
      if (i === 0) { return observer.onCompleted(); }
      recurse(i);
    }

    return this.parent.scheduler.scheduleRecursive(this.parent.repeatCount, loopRecursive);
  };

  /**
   *  Generates an observable sequence that repeats the given element the specified number of times, using the specified scheduler to send out observer messages.
   * @param {Mixed} value Element to repeat.
   * @param {Number} repeatCount [Optiona] Number of times to repeat the element. If not specified, repeats indefinitely.
   * @param {Scheduler} scheduler Scheduler to run the producer loop on. If not specified, defaults to Scheduler.immediate.
   * @returns {Observable} An observable sequence that repeats the given element the specified number of times.
   */
  Observable.repeat = function (value, repeatCount, scheduler) {
    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
    return new RepeatObservable(value, repeatCount, scheduler);
  };

  var JustObservable = (function(__super__) {
    inherits(JustObservable, __super__);
    function JustObservable(value, scheduler) {
      this._value = value;
      this._scheduler = scheduler;
      __super__.call(this);
    }

    JustObservable.prototype.subscribeCore = function (o) {
      var state = [this._value, o];
      return this._scheduler === immediateScheduler ?
        scheduleItem(null, state) :
        this._scheduler.schedule(state, scheduleItem);
    };

    function scheduleItem(s, state) {
      var value = state[0], observer = state[1];
      observer.onNext(value);
      observer.onCompleted();
      return disposableEmpty;
    }

    return JustObservable;
  }(ObservableBase));

  /**
   *  Returns an observable sequence that contains a single element, using the specified scheduler to send out observer messages.
   *  There is an alias called 'just' or browsers <IE9.
   * @param {Mixed} value Single element in the resulting observable sequence.
   * @param {Scheduler} scheduler Scheduler to send the single element on. If not specified, defaults to Scheduler.immediate.
   * @returns {Observable} An observable sequence containing the single specified element.
   */
  var observableReturn = Observable['return'] = Observable.just = function (value, scheduler) {
    isScheduler(scheduler) || (scheduler = immediateScheduler);
    return new JustObservable(value, scheduler);
  };

  var ThrowObservable = (function(__super__) {
    inherits(ThrowObservable, __super__);
    function ThrowObservable(error, scheduler) {
      this._error = error;
      this._scheduler = scheduler;
      __super__.call(this);
    }

    ThrowObservable.prototype.subscribeCore = function (o) {
      var state = [this._error, o];
      return this._scheduler === immediateScheduler ?
        scheduleItem(null, state) :
        this._scheduler.schedule(state, scheduleItem);
    };

    function scheduleItem(s, state) {
      var e = state[0], o = state[1];
      o.onError(e);
      return disposableEmpty;
    }

    return ThrowObservable;
  }(ObservableBase));

  /**
   *  Returns an observable sequence that terminates with an exception, using the specified scheduler to send out the single onError message.
   *  There is an alias to this method called 'throwError' for browsers <IE9.
   * @param {Mixed} error An object used for the sequence's termination.
   * @param {Scheduler} scheduler Scheduler to send the exceptional termination call on. If not specified, defaults to Scheduler.immediate.
   * @returns {Observable} The observable sequence that terminates exceptionally with the specified exception object.
   */
  var observableThrow = Observable['throw'] = function (error, scheduler) {
    isScheduler(scheduler) || (scheduler = immediateScheduler);
    return new ThrowObservable(error, scheduler);
  };

  var UsingObservable = (function (__super__) {
    inherits(UsingObservable, __super__);
    function UsingObservable(resFn, obsFn) {
      this._resFn = resFn;
      this._obsFn = obsFn;
      __super__.call(this);
    }

    UsingObservable.prototype.subscribeCore = function (o) {
      var disposable = disposableEmpty;
      var resource = tryCatch(this._resFn)();
      if (resource === errorObj) {
        return new BinaryDisposable(observableThrow(resource.e).subscribe(o), disposable);
      }
      resource && (disposable = resource);
      var source = tryCatch(this._obsFn)(resource);
      if (source === errorObj) {
        return new BinaryDisposable(observableThrow(source.e).subscribe(o), disposable);
      }
      return new BinaryDisposable(source.subscribe(o), disposable);
    };

    return UsingObservable;
  }(ObservableBase));

  /**
   * Constructs an observable sequence that depends on a resource object, whose lifetime is tied to the resulting observable sequence's lifetime.
   * @param {Function} resourceFactory Factory function to obtain a resource object.
   * @param {Function} observableFactory Factory function to obtain an observable sequence that depends on the obtained resource.
   * @returns {Observable} An observable sequence whose lifetime controls the lifetime of the dependent resource object.
   */
  Observable.using = function (resourceFactory, observableFactory) {
    return new UsingObservable(resourceFactory, observableFactory);
  };

  /**
   * Propagates the observable sequence or Promise that reacts first.
   * @param {Observable} rightSource Second observable sequence or Promise.
   * @returns {Observable} {Observable} An observable sequence that surfaces either of the given sequences, whichever reacted first.
   */
  observableProto.amb = function (rightSource) {
    var leftSource = this;
    return new AnonymousObservable(function (observer) {
      var choice,
        leftChoice = 'L', rightChoice = 'R',
        leftSubscription = new SingleAssignmentDisposable(),
        rightSubscription = new SingleAssignmentDisposable();

      isPromise(rightSource) && (rightSource = observableFromPromise(rightSource));

      function choiceL() {
        if (!choice) {
          choice = leftChoice;
          rightSubscription.dispose();
        }
      }

      function choiceR() {
        if (!choice) {
          choice = rightChoice;
          leftSubscription.dispose();
        }
      }

      var leftSubscribe = observerCreate(
        function (left) {
          choiceL();
          choice === leftChoice && observer.onNext(left);
        },
        function (e) {
          choiceL();
          choice === leftChoice && observer.onError(e);
        },
        function () {
          choiceL();
          choice === leftChoice && observer.onCompleted();
        }
      );
      var rightSubscribe = observerCreate(
        function (right) {
          choiceR();
          choice === rightChoice && observer.onNext(right);
        },
        function (e) {
          choiceR();
          choice === rightChoice && observer.onError(e);
        },
        function () {
          choiceR();
          choice === rightChoice && observer.onCompleted();
        }
      );

      leftSubscription.setDisposable(leftSource.subscribe(leftSubscribe));
      rightSubscription.setDisposable(rightSource.subscribe(rightSubscribe));

      return new BinaryDisposable(leftSubscription, rightSubscription);
    });
  };

  function amb(p, c) { return p.amb(c); }

  /**
   * Propagates the observable sequence or Promise that reacts first.
   * @returns {Observable} An observable sequence that surfaces any of the given sequences, whichever reacted first.
   */
  Observable.amb = function () {
    var acc = observableNever(), items;
    if (Array.isArray(arguments[0])) {
      items = arguments[0];
    } else {
      var len = arguments.length;
      items = new Array(items);
      for(var i = 0; i < len; i++) { items[i] = arguments[i]; }
    }
    for (var i = 0, len = items.length; i < len; i++) {
      acc = amb(acc, items[i]);
    }
    return acc;
  };

  var CatchObservable = (function (__super__) {
    inherits(CatchObservable, __super__);
    function CatchObservable(source, fn) {
      this.source = source;
      this._fn = fn;
      __super__.call(this);
    }

    CatchObservable.prototype.subscribeCore = function (o) {
      var d1 = new SingleAssignmentDisposable(), subscription = new SerialDisposable();
      subscription.setDisposable(d1);
      d1.setDisposable(this.source.subscribe(new CatchObserver(o, subscription, this._fn)));
      return subscription;
    };

    return CatchObservable;
  }(ObservableBase));

  var CatchObserver = (function(__super__) {
    inherits(CatchObserver, __super__);
    function CatchObserver(o, s, fn) {
      this._o = o;
      this._s = s;
      this._fn = fn;
      __super__.call(this);
    }

    CatchObserver.prototype.next = function (x) { this._o.onNext(x); };
    CatchObserver.prototype.completed = function () { return this._o.onCompleted(); };
    CatchObserver.prototype.error = function (e) {
      var result = tryCatch(this._fn)(e);
      if (result === errorObj) { return this._o.onError(result.e); }
      isPromise(result) && (result = observableFromPromise(result));

      var d = new SingleAssignmentDisposable();
      this._s.setDisposable(d);
      d.setDisposable(result.subscribe(this._o));
    };

    return CatchObserver;
  }(AbstractObserver));

  /**
   * Continues an observable sequence that is terminated by an exception with the next observable sequence.
   * @param {Mixed} handlerOrSecond Exception handler function that returns an observable sequence given the error that occurred in the first sequence, or a second observable sequence used to produce results when an error occurred in the first sequence.
   * @returns {Observable} An observable sequence containing the first sequence's elements, followed by the elements of the handler sequence in case an exception occurred.
   */
  observableProto['catch'] = function (handlerOrSecond) {
    return isFunction(handlerOrSecond) ? new CatchObservable(this, handlerOrSecond) : observableCatch([this, handlerOrSecond]);
  };

  /**
   * Continues an observable sequence that is terminated by an exception with the next observable sequence.
   * @param {Array | Arguments} args Arguments or an array to use as the next sequence if an error occurs.
   * @returns {Observable} An observable sequence containing elements from consecutive source sequences until a source sequence terminates successfully.
   */
  var observableCatch = Observable['catch'] = function () {
    var items;
    if (Array.isArray(arguments[0])) {
      items = arguments[0];
    } else {
      var len = arguments.length;
      items = new Array(len);
      for(var i = 0; i < len; i++) { items[i] = arguments[i]; }
    }
    return enumerableOf(items).catchError();
  };

  /**
   * Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences or Promises produces an element.
   * This can be in the form of an argument list of observables or an array.
   *
   * @example
   * 1 - obs = observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
   * 2 - obs = observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });
   * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
   */
  observableProto.combineLatest = function () {
    var len = arguments.length, args = new Array(len);
    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
    if (Array.isArray(args[0])) {
      args[0].unshift(this);
    } else {
      args.unshift(this);
    }
    return combineLatest.apply(this, args);
  };

  function falseFactory() { return false; }
  function argumentsToArray() {
    var len = arguments.length, args = new Array(len);
    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
    return args;
  }

  var CombineLatestObservable = (function(__super__) {
    inherits(CombineLatestObservable, __super__);
    function CombineLatestObservable(params, cb) {
      this._params = params;
      this._cb = cb;
      __super__.call(this);
    }

    CombineLatestObservable.prototype.subscribeCore = function(observer) {
      var len = this._params.length,
          subscriptions = new Array(len);

      var state = {
        hasValue: arrayInitialize(len, falseFactory),
        hasValueAll: false,
        isDone: arrayInitialize(len, falseFactory),
        values: new Array(len)
      };

      for (var i = 0; i < len; i++) {
        var source = this._params[i], sad = new SingleAssignmentDisposable();
        subscriptions[i] = sad;
        isPromise(source) && (source = observableFromPromise(source));
        sad.setDisposable(source.subscribe(new CombineLatestObserver(observer, i, this._cb, state)));
      }

      return new NAryDisposable(subscriptions);
    };

    return CombineLatestObservable;
  }(ObservableBase));

  var CombineLatestObserver = (function (__super__) {
    inherits(CombineLatestObserver, __super__);
    function CombineLatestObserver(o, i, cb, state) {
      this._o = o;
      this._i = i;
      this._cb = cb;
      this._state = state;
      __super__.call(this);
    }

    function notTheSame(i) {
      return function (x, j) {
        return j !== i;
      };
    }

    CombineLatestObserver.prototype.next = function (x) {
      this._state.values[this._i] = x;
      this._state.hasValue[this._i] = true;
      if (this._state.hasValueAll || (this._state.hasValueAll = this._state.hasValue.every(identity))) {
        var res = tryCatch(this._cb).apply(null, this._state.values);
        if (res === errorObj) { return this._o.onError(res.e); }
        this._o.onNext(res);
      } else if (this._state.isDone.filter(notTheSame(this._i)).every(identity)) {
        this._o.onCompleted();
      }
    };

    CombineLatestObserver.prototype.error = function (e) {
      this._o.onError(e);
    };

    CombineLatestObserver.prototype.completed = function () {
      this._state.isDone[this._i] = true;
      this._state.isDone.every(identity) && this._o.onCompleted();
    };

    return CombineLatestObserver;
  }(AbstractObserver));

  /**
  * Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences or Promises produces an element.
  *
  * @example
  * 1 - obs = Rx.Observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
  * 2 - obs = Rx.Observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });
  * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
  */
  var combineLatest = Observable.combineLatest = function () {
    var len = arguments.length, args = new Array(len);
    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
    var resultSelector = isFunction(args[len - 1]) ? args.pop() : argumentsToArray;
    Array.isArray(args[0]) && (args = args[0]);
    return new CombineLatestObservable(args, resultSelector);
  };

  /**
   * Concatenates all the observable sequences.  This takes in either an array or variable arguments to concatenate.
   * @returns {Observable} An observable sequence that contains the elements of each given sequence, in sequential order.
   */
  observableProto.concat = function () {
    for(var args = [], i = 0, len = arguments.length; i < len; i++) { args.push(arguments[i]); }
    args.unshift(this);
    return observableConcat.apply(null, args);
  };

  var ConcatObserver = (function(__super__) {
    inherits(ConcatObserver, __super__);
    function ConcatObserver(s, fn) {
      this._s = s;
      this._fn = fn;
      __super__.call(this);
    }

    ConcatObserver.prototype.next = function (x) { this._s.o.onNext(x); };
    ConcatObserver.prototype.error = function (e) { this._s.o.onError(e); };
    ConcatObserver.prototype.completed = function () { this._s.i++; this._fn(this._s); };

    return ConcatObserver;
  }(AbstractObserver));

  var ConcatObservable = (function(__super__) {
    inherits(ConcatObservable, __super__);
    function ConcatObservable(sources) {
      this._sources = sources;
      __super__.call(this);
    }

    function scheduleRecursive (state, recurse) {
      if (state.disposable.isDisposed) { return; }
      if (state.i === state.sources.length) { return state.o.onCompleted(); }

      // Check if promise
      var currentValue = state.sources[state.i];
      isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));

      var d = new SingleAssignmentDisposable();
      state.subscription.setDisposable(d);
      d.setDisposable(currentValue.subscribe(new ConcatObserver(state, recurse)));
    }

    ConcatObservable.prototype.subscribeCore = function(o) {
      var subscription = new SerialDisposable();
      var disposable = disposableCreate(noop);
      var state = {
        o: o,
        i: 0,
        subscription: subscription,
        disposable: disposable,
        sources: this._sources
      };

      var cancelable = immediateScheduler.scheduleRecursive(state, scheduleRecursive);
      return new NAryDisposable([subscription, disposable, cancelable]);
    };

    return ConcatObservable;
  }(ObservableBase));

  /**
   * Concatenates all the observable sequences.
   * @param {Array | Arguments} args Arguments or an array to concat to the observable sequence.
   * @returns {Observable} An observable sequence that contains the elements of each given sequence, in sequential order.
   */
  var observableConcat = Observable.concat = function () {
    var args;
    if (Array.isArray(arguments[0])) {
      args = arguments[0];
    } else {
      args = new Array(arguments.length);
      for(var i = 0, len = arguments.length; i < len; i++) { args[i] = arguments[i]; }
    }
    return new ConcatObservable(args);
  };

  /**
   * Concatenates an observable sequence of observable sequences.
   * @returns {Observable} An observable sequence that contains the elements of each observed inner sequence, in sequential order.
   */
  observableProto.concatAll = function () {
    return this.merge(1);
  };

  var MergeObservable = (function (__super__) {
    inherits(MergeObservable, __super__);

    function MergeObservable(source, maxConcurrent) {
      this.source = source;
      this.maxConcurrent = maxConcurrent;
      __super__.call(this);
    }

    MergeObservable.prototype.subscribeCore = function(observer) {
      var g = new CompositeDisposable();
      g.add(this.source.subscribe(new MergeObserver(observer, this.maxConcurrent, g)));
      return g;
    };

    return MergeObservable;

  }(ObservableBase));

  var MergeObserver = (function (__super__) {
    function MergeObserver(o, max, g) {
      this.o = o;
      this.max = max;
      this.g = g;
      this.done = false;
      this.q = [];
      this.activeCount = 0;
      __super__.call(this);
    }

    inherits(MergeObserver, __super__);

    MergeObserver.prototype.handleSubscribe = function (xs) {
      var sad = new SingleAssignmentDisposable();
      this.g.add(sad);
      isPromise(xs) && (xs = observableFromPromise(xs));
      sad.setDisposable(xs.subscribe(new InnerObserver(this, sad)));
    };

    MergeObserver.prototype.next = function (innerSource) {
      if(this.activeCount < this.max) {
        this.activeCount++;
        this.handleSubscribe(innerSource);
      } else {
        this.q.push(innerSource);
      }
    };
    MergeObserver.prototype.error = function (e) { this.o.onError(e); };
    MergeObserver.prototype.completed = function () { this.done = true; this.activeCount === 0 && this.o.onCompleted(); };

    function InnerObserver(parent, sad) {
      this.parent = parent;
      this.sad = sad;
      __super__.call(this);
    }

    inherits(InnerObserver, __super__);

    InnerObserver.prototype.next = function (x) { this.parent.o.onNext(x); };
    InnerObserver.prototype.error = function (e) { this.parent.o.onError(e); };
    InnerObserver.prototype.completed = function () {
      this.parent.g.remove(this.sad);
      if (this.parent.q.length > 0) {
        this.parent.handleSubscribe(this.parent.q.shift());
      } else {
        this.parent.activeCount--;
        this.parent.done && this.parent.activeCount === 0 && this.parent.o.onCompleted();
      }
    };

    return MergeObserver;
  }(AbstractObserver));

  /**
  * Merges an observable sequence of observable sequences into an observable sequence, limiting the number of concurrent subscriptions to inner sequences.
  * Or merges two observable sequences into a single observable sequence.
  * @param {Mixed} [maxConcurrentOrOther] Maximum number of inner observable sequences being subscribed to concurrently or the second observable sequence.
  * @returns {Observable} The observable sequence that merges the elements of the inner sequences.
  */
  observableProto.merge = function (maxConcurrentOrOther) {
    return typeof maxConcurrentOrOther !== 'number' ?
      observableMerge(this, maxConcurrentOrOther) :
      new MergeObservable(this, maxConcurrentOrOther);
  };

  /**
   * Merges all the observable sequences into a single observable sequence.
   * The scheduler is optional and if not specified, the immediate scheduler is used.
   * @returns {Observable} The observable sequence that merges the elements of the observable sequences.
   */
  var observableMerge = Observable.merge = function () {
    var scheduler, sources = [], i, len = arguments.length;
    if (!arguments[0]) {
      scheduler = immediateScheduler;
      for(i = 1; i < len; i++) { sources.push(arguments[i]); }
    } else if (isScheduler(arguments[0])) {
      scheduler = arguments[0];
      for(i = 1; i < len; i++) { sources.push(arguments[i]); }
    } else {
      scheduler = immediateScheduler;
      for(i = 0; i < len; i++) { sources.push(arguments[i]); }
    }
    if (Array.isArray(sources[0])) {
      sources = sources[0];
    }
    return observableOf(scheduler, sources).mergeAll();
  };

  var MergeAllObservable = (function (__super__) {
    inherits(MergeAllObservable, __super__);

    function MergeAllObservable(source) {
      this.source = source;
      __super__.call(this);
    }

    MergeAllObservable.prototype.subscribeCore = function (o) {
      var g = new CompositeDisposable(), m = new SingleAssignmentDisposable();
      g.add(m);
      m.setDisposable(this.source.subscribe(new MergeAllObserver(o, g)));
      return g;
    };

    return MergeAllObservable;
  }(ObservableBase));

  var MergeAllObserver = (function (__super__) {
    function MergeAllObserver(o, g) {
      this.o = o;
      this.g = g;
      this.done = false;
      __super__.call(this);
    }

    inherits(MergeAllObserver, __super__);

    MergeAllObserver.prototype.next = function(innerSource) {
      var sad = new SingleAssignmentDisposable();
      this.g.add(sad);
      isPromise(innerSource) && (innerSource = observableFromPromise(innerSource));
      sad.setDisposable(innerSource.subscribe(new InnerObserver(this, sad)));
    };

    MergeAllObserver.prototype.error = function (e) {
      this.o.onError(e);
    };

    MergeAllObserver.prototype.completed = function () {
      this.done = true;
      this.g.length === 1 && this.o.onCompleted();
    };

    function InnerObserver(parent, sad) {
      this.parent = parent;
      this.sad = sad;
      __super__.call(this);
    }

    inherits(InnerObserver, __super__);

    InnerObserver.prototype.next = function (x) {
      this.parent.o.onNext(x);
    };
    InnerObserver.prototype.error = function (e) {
      this.parent.o.onError(e);
    };
    InnerObserver.prototype.completed = function () {
      this.parent.g.remove(this.sad);
      this.parent.done && this.parent.g.length === 1 && this.parent.o.onCompleted();
    };

    return MergeAllObserver;
  }(AbstractObserver));

  /**
  * Merges an observable sequence of observable sequences into an observable sequence.
  * @returns {Observable} The observable sequence that merges the elements of the inner sequences.
  */
  observableProto.mergeAll = function () {
    return new MergeAllObservable(this);
  };

  var CompositeError = Rx.CompositeError = function(errors) {
    this.innerErrors = errors;
    this.message = 'This contains multiple errors. Check the innerErrors';
    Error.call(this);
  };
  CompositeError.prototype = Object.create(Error.prototype);
  CompositeError.prototype.name = 'CompositeError';

  var MergeDelayErrorObservable = (function(__super__) {
    inherits(MergeDelayErrorObservable, __super__);
    function MergeDelayErrorObservable(source) {
      this.source = source;
      __super__.call(this);
    }

    MergeDelayErrorObservable.prototype.subscribeCore = function (o) {
      var group = new CompositeDisposable(),
        m = new SingleAssignmentDisposable(),
        state = { isStopped: false, errors: [], o: o };

      group.add(m);
      m.setDisposable(this.source.subscribe(new MergeDelayErrorObserver(group, state)));

      return group;
    };

    return MergeDelayErrorObservable;
  }(ObservableBase));

  var MergeDelayErrorObserver = (function(__super__) {
    inherits(MergeDelayErrorObserver, __super__);
    function MergeDelayErrorObserver(group, state) {
      this._group = group;
      this._state = state;
      __super__.call(this);
    }

    function setCompletion(o, errors) {
      if (errors.length === 0) {
        o.onCompleted();
      } else if (errors.length === 1) {
        o.onError(errors[0]);
      } else {
        o.onError(new CompositeError(errors));
      }
    }

    MergeDelayErrorObserver.prototype.next = function (x) {
      var inner = new SingleAssignmentDisposable();
      this._group.add(inner);

      // Check for promises support
      isPromise(x) && (x = observableFromPromise(x));
      inner.setDisposable(x.subscribe(new InnerObserver(inner, this._group, this._state)));
    };

    MergeDelayErrorObserver.prototype.error = function (e) {
      this._state.errors.push(e);
      this._state.isStopped = true;
      this._group.length === 1 && setCompletion(this._state.o, this._state.errors);
    };

    MergeDelayErrorObserver.prototype.completed = function () {
      this._state.isStopped = true;
      this._group.length === 1 && setCompletion(this._state.o, this._state.errors);
    };

    inherits(InnerObserver, __super__);
    function InnerObserver(inner, group, state) {
      this._inner = inner;
      this._group = group;
      this._state = state;
      __super__.call(this);
    }

    InnerObserver.prototype.next = function (x) { this._state.o.onNext(x); };
    InnerObserver.prototype.error = function (e) {
      this._state.errors.push(e);
      this._group.remove(this._inner);
      this._state.isStopped && this._group.length === 1 && setCompletion(this._state.o, this._state.errors);
    };
    InnerObserver.prototype.completed = function () {
      this._group.remove(this._inner);
      this._state.isStopped && this._group.length === 1 && setCompletion(this._state.o, this._state.errors);
    };

    return MergeDelayErrorObserver;
  }(AbstractObserver));

  /**
  * Flattens an Observable that emits Observables into one Observable, in a way that allows an Observer to
  * receive all successfully emitted items from all of the source Observables without being interrupted by
  * an error notification from one of them.
  *
  * This behaves like Observable.prototype.mergeAll except that if any of the merged Observables notify of an
  * error via the Observer's onError, mergeDelayError will refrain from propagating that
  * error notification until all of the merged Observables have finished emitting items.
  * @param {Array | Arguments} args Arguments or an array to merge.
  * @returns {Observable} an Observable that emits all of the items emitted by the Observables emitted by the Observable
  */
  Observable.mergeDelayError = function() {
    var args;
    if (Array.isArray(arguments[0])) {
      args = arguments[0];
    } else {
      var len = arguments.length;
      args = new Array(len);
      for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
    }
    var source = observableOf(null, args);
    return new MergeDelayErrorObservable(source);
  };

  /**
   * Continues an observable sequence that is terminated normally or by an exception with the next observable sequence.
   * @param {Observable} second Second observable sequence used to produce results after the first sequence terminates.
   * @returns {Observable} An observable sequence that concatenates the first and second sequence, even if the first sequence terminates exceptionally.
   */
  observableProto.onErrorResumeNext = function (second) {
    if (!second) { throw new Error('Second observable is required'); }
    return onErrorResumeNext([this, second]);
  };

  var OnErrorResumeNextObservable = (function(__super__) {
    inherits(OnErrorResumeNextObservable, __super__);
    function OnErrorResumeNextObservable(sources) {
      this.sources = sources;
      __super__.call(this);
    }

    function scheduleMethod(state, recurse) {
      if (state.pos < state.sources.length) {
        var current = state.sources[state.pos++];
        isPromise(current) && (current = observableFromPromise(current));
        var d = new SingleAssignmentDisposable();
        state.subscription.setDisposable(d);
        d.setDisposable(current.subscribe(new OnErrorResumeNextObserver(state, recurse)));
      } else {
        state.o.onCompleted();
      }
    }

    OnErrorResumeNextObservable.prototype.subscribeCore = function (o) {
      var subscription = new SerialDisposable(),
          state = {pos: 0, subscription: subscription, o: o, sources: this.sources },
          cancellable = immediateScheduler.scheduleRecursive(state, scheduleMethod);

      return new BinaryDisposable(subscription, cancellable);
    };

    return OnErrorResumeNextObservable;
  }(ObservableBase));

  var OnErrorResumeNextObserver = (function(__super__) {
    inherits(OnErrorResumeNextObserver, __super__);
    function OnErrorResumeNextObserver(state, recurse) {
      this._state = state;
      this._recurse = recurse;
      __super__.call(this);
    }

    OnErrorResumeNextObserver.prototype.next = function (x) { this._state.o.onNext(x); };
    OnErrorResumeNextObserver.prototype.error = function () { this._recurse(this._state); };
    OnErrorResumeNextObserver.prototype.completed = function () { this._recurse(this._state); };

    return OnErrorResumeNextObserver;
  }(AbstractObserver));

  /**
   * Continues an observable sequence that is terminated normally or by an exception with the next observable sequence.
   * @returns {Observable} An observable sequence that concatenates the source sequences, even if a sequence terminates exceptionally.
   */
  var onErrorResumeNext = Observable.onErrorResumeNext = function () {
    var sources = [];
    if (Array.isArray(arguments[0])) {
      sources = arguments[0];
    } else {
      var len = arguments.length;
      sources = new Array(len);
      for(var i = 0; i < len; i++) { sources[i] = arguments[i]; }
    }
    return new OnErrorResumeNextObservable(sources);
  };

  var SkipUntilObservable = (function(__super__) {
    inherits(SkipUntilObservable, __super__);

    function SkipUntilObservable(source, other) {
      this._s = source;
      this._o = isPromise(other) ? observableFromPromise(other) : other;
      this._open = false;
      __super__.call(this);
    }

    SkipUntilObservable.prototype.subscribeCore = function(o) {
      var leftSubscription = new SingleAssignmentDisposable();
      leftSubscription.setDisposable(this._s.subscribe(new SkipUntilSourceObserver(o, this)));

      isPromise(this._o) && (this._o = observableFromPromise(this._o));

      var rightSubscription = new SingleAssignmentDisposable();
      rightSubscription.setDisposable(this._o.subscribe(new SkipUntilOtherObserver(o, this, rightSubscription)));

      return new BinaryDisposable(leftSubscription, rightSubscription);
    };

    return SkipUntilObservable;
  }(ObservableBase));

  var SkipUntilSourceObserver = (function(__super__) {
    inherits(SkipUntilSourceObserver, __super__);
    function SkipUntilSourceObserver(o, p) {
      this._o = o;
      this._p = p;
      __super__.call(this);
    }

    SkipUntilSourceObserver.prototype.next = function (x) {
      this._p._open && this._o.onNext(x);
    };

    SkipUntilSourceObserver.prototype.error = function (err) {
      this._o.onError(err);
    };

    SkipUntilSourceObserver.prototype.onCompleted = function () {
      this._p._open && this._o.onCompleted();
    };

    return SkipUntilSourceObserver;
  }(AbstractObserver));

  var SkipUntilOtherObserver = (function(__super__) {
    inherits(SkipUntilOtherObserver, __super__);
    function SkipUntilOtherObserver(o, p, r) {
      this._o = o;
      this._p = p;
      this._r = r;
      __super__.call(this);
    }

    SkipUntilOtherObserver.prototype.next = function () {
      this._p._open = true;
      this._r.dispose();
    };

    SkipUntilOtherObserver.prototype.error = function (err) {
      this._o.onError(err);
    };

    SkipUntilOtherObserver.prototype.onCompleted = function () {
      this._r.dispose();
    };

    return SkipUntilOtherObserver;
  }(AbstractObserver));

  /**
   * Returns the values from the source observable sequence only after the other observable sequence produces a value.
   * @param {Observable | Promise} other The observable sequence or Promise that triggers propagation of elements of the source sequence.
   * @returns {Observable} An observable sequence containing the elements of the source sequence starting from the point the other sequence triggered propagation.
   */
  observableProto.skipUntil = function (other) {
    return new SkipUntilObservable(this, other);
  };

  var SwitchObservable = (function(__super__) {
    inherits(SwitchObservable, __super__);
    function SwitchObservable(source) {
      this.source = source;
      __super__.call(this);
    }

    SwitchObservable.prototype.subscribeCore = function (o) {
      var inner = new SerialDisposable(), s = this.source.subscribe(new SwitchObserver(o, inner));
      return new BinaryDisposable(s, inner);
    };

    inherits(SwitchObserver, AbstractObserver);
    function SwitchObserver(o, inner) {
      this.o = o;
      this.inner = inner;
      this.stopped = false;
      this.latest = 0;
      this.hasLatest = false;
      AbstractObserver.call(this);
    }

    SwitchObserver.prototype.next = function (innerSource) {
      var d = new SingleAssignmentDisposable(), id = ++this.latest;
      this.hasLatest = true;
      this.inner.setDisposable(d);
      isPromise(innerSource) && (innerSource = observableFromPromise(innerSource));
      d.setDisposable(innerSource.subscribe(new InnerObserver(this, id)));
    };

    SwitchObserver.prototype.error = function (e) {
      this.o.onError(e);
    };

    SwitchObserver.prototype.completed = function () {
      this.stopped = true;
      !this.hasLatest && this.o.onCompleted();
    };

    inherits(InnerObserver, AbstractObserver);
    function InnerObserver(parent, id) {
      this.parent = parent;
      this.id = id;
      AbstractObserver.call(this);
    }
    InnerObserver.prototype.next = function (x) {
      this.parent.latest === this.id && this.parent.o.onNext(x);
    };

    InnerObserver.prototype.error = function (e) {
      this.parent.latest === this.id && this.parent.o.onError(e);
    };

    InnerObserver.prototype.completed = function () {
      if (this.parent.latest === this.id) {
        this.parent.hasLatest = false;
        this.parent.stopped && this.parent.o.onCompleted();
      }
    };

    return SwitchObservable;
  }(ObservableBase));

  /**
  * Transforms an observable sequence of observable sequences into an observable sequence producing values only from the most recent observable sequence.
  * @returns {Observable} The observable sequence that at any point in time produces the elements of the most recent inner observable sequence that has been received.
  */
  observableProto['switch'] = observableProto.switchLatest = function () {
    return new SwitchObservable(this);
  };

  var TakeUntilObservable = (function(__super__) {
    inherits(TakeUntilObservable, __super__);

    function TakeUntilObservable(source, other) {
      this.source = source;
      this.other = isPromise(other) ? observableFromPromise(other) : other;
      __super__.call(this);
    }

    TakeUntilObservable.prototype.subscribeCore = function(o) {
      return new BinaryDisposable(
        this.source.subscribe(o),
        this.other.subscribe(new TakeUntilObserver(o))
      );
    };

    return TakeUntilObservable;
  }(ObservableBase));

  var TakeUntilObserver = (function(__super__) {
    inherits(TakeUntilObserver, __super__);
    function TakeUntilObserver(o) {
      this._o = o;
      __super__.call(this);
    }

    TakeUntilObserver.prototype.next = function () {
      this._o.onCompleted();
    };

    TakeUntilObserver.prototype.error = function (err) {
      this._o.onError(err);
    };

    TakeUntilObserver.prototype.onCompleted = noop;

    return TakeUntilObserver;
  }(AbstractObserver));

  /**
   * Returns the values from the source observable sequence until the other observable sequence produces a value.
   * @param {Observable | Promise} other Observable sequence or Promise that terminates propagation of elements of the source sequence.
   * @returns {Observable} An observable sequence containing the elements of the source sequence up to the point the other sequence interrupted further propagation.
   */
  observableProto.takeUntil = function (other) {
    return new TakeUntilObservable(this, other);
  };

  function falseFactory() { return false; }
  function argumentsToArray() {
    var len = arguments.length, args = new Array(len);
    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
    return args;
  }

  var WithLatestFromObservable = (function(__super__) {
    inherits(WithLatestFromObservable, __super__);
    function WithLatestFromObservable(source, sources, resultSelector) {
      this._s = source;
      this._ss = sources;
      this._cb = resultSelector;
      __super__.call(this);
    }

    WithLatestFromObservable.prototype.subscribeCore = function (o) {
      var len = this._ss.length;
      var state = {
        hasValue: arrayInitialize(len, falseFactory),
        hasValueAll: false,
        values: new Array(len)
      };

      var n = this._ss.length, subscriptions = new Array(n + 1);
      for (var i = 0; i < n; i++) {
        var other = this._ss[i], sad = new SingleAssignmentDisposable();
        isPromise(other) && (other = observableFromPromise(other));
        sad.setDisposable(other.subscribe(new WithLatestFromOtherObserver(o, i, state)));
        subscriptions[i] = sad;
      }

      var outerSad = new SingleAssignmentDisposable();
      outerSad.setDisposable(this._s.subscribe(new WithLatestFromSourceObserver(o, this._cb, state)));
      subscriptions[n] = outerSad;

      return new NAryDisposable(subscriptions);
    };

    return WithLatestFromObservable;
  }(ObservableBase));

  var WithLatestFromOtherObserver = (function (__super__) {
    inherits(WithLatestFromOtherObserver, __super__);
    function WithLatestFromOtherObserver(o, i, state) {
      this._o = o;
      this._i = i;
      this._state = state;
      __super__.call(this);
    }

    WithLatestFromOtherObserver.prototype.next = function (x) {
      this._state.values[this._i] = x;
      this._state.hasValue[this._i] = true;
      this._state.hasValueAll = this._state.hasValue.every(identity);
    };

    WithLatestFromOtherObserver.prototype.error = function (e) {
      this._o.onError(e);
    };

    WithLatestFromOtherObserver.prototype.completed = noop;

    return WithLatestFromOtherObserver;
  }(AbstractObserver));

  var WithLatestFromSourceObserver = (function (__super__) {
    inherits(WithLatestFromSourceObserver, __super__);
    function WithLatestFromSourceObserver(o, cb, state) {
      this._o = o;
      this._cb = cb;
      this._state = state;
      __super__.call(this);
    }

    WithLatestFromSourceObserver.prototype.next = function (x) {
      var allValues = [x].concat(this._state.values);
      if (!this._state.hasValueAll) { return; }
      var res = tryCatch(this._cb).apply(null, allValues);
      if (res === errorObj) { return this._o.onError(res.e); }
      this._o.onNext(res);
    };

    WithLatestFromSourceObserver.prototype.error = function (e) {
      this._o.onError(e);
    };

    WithLatestFromSourceObserver.prototype.completed = function () {
      this._o.onCompleted();
    };

    return WithLatestFromSourceObserver;
  }(AbstractObserver));

  /**
   * Merges the specified observable sequences into one observable sequence by using the selector function only when the (first) source observable sequence produces an element.
   * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
   */
  observableProto.withLatestFrom = function () {
    if (arguments.length === 0) { throw new Error('invalid arguments'); }

    var len = arguments.length, args = new Array(len);
    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
    var resultSelector = isFunction(args[len - 1]) ? args.pop() : argumentsToArray;
    Array.isArray(args[0]) && (args = args[0]);

    return new WithLatestFromObservable(this, args, resultSelector);
  };

  function falseFactory() { return false; }
  function emptyArrayFactory() { return []; }

  var ZipObservable = (function(__super__) {
    inherits(ZipObservable, __super__);
    function ZipObservable(sources, resultSelector) {
      this._s = sources;
      this._cb = resultSelector;
      __super__.call(this);
    }

    ZipObservable.prototype.subscribeCore = function(observer) {
      var n = this._s.length,
          subscriptions = new Array(n),
          done = arrayInitialize(n, falseFactory),
          q = arrayInitialize(n, emptyArrayFactory);

      for (var i = 0; i < n; i++) {
        var source = this._s[i], sad = new SingleAssignmentDisposable();
        subscriptions[i] = sad;
        isPromise(source) && (source = observableFromPromise(source));
        sad.setDisposable(source.subscribe(new ZipObserver(observer, i, this, q, done)));
      }

      return new NAryDisposable(subscriptions);
    };

    return ZipObservable;
  }(ObservableBase));

  var ZipObserver = (function (__super__) {
    inherits(ZipObserver, __super__);
    function ZipObserver(o, i, p, q, d) {
      this._o = o;
      this._i = i;
      this._p = p;
      this._q = q;
      this._d = d;
      __super__.call(this);
    }

    function notEmpty(x) { return x.length > 0; }
    function shiftEach(x) { return x.shift(); }
    function notTheSame(i) {
      return function (x, j) {
        return j !== i;
      };
    }

    ZipObserver.prototype.next = function (x) {
      this._q[this._i].push(x);
      if (this._q.every(notEmpty)) {
        var queuedValues = this._q.map(shiftEach);
        var res = tryCatch(this._p._cb).apply(null, queuedValues);
        if (res === errorObj) { return this._o.onError(res.e); }
        this._o.onNext(res);
      } else if (this._d.filter(notTheSame(this._i)).every(identity)) {
        this._o.onCompleted();
      }
    };

    ZipObserver.prototype.error = function (e) {
      this._o.onError(e);
    };

    ZipObserver.prototype.completed = function () {
      this._d[this._i] = true;
      this._d.every(identity) && this._o.onCompleted();
    };

    return ZipObserver;
  }(AbstractObserver));

  /**
   * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences or an array have produced an element at a corresponding index.
   * The last element in the arguments must be a function to invoke for each series of elements at corresponding indexes in the args.
   * @returns {Observable} An observable sequence containing the result of combining elements of the args using the specified result selector function.
   */
  observableProto.zip = function () {
    if (arguments.length === 0) { throw new Error('invalid arguments'); }

    var len = arguments.length, args = new Array(len);
    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
    var resultSelector = isFunction(args[len - 1]) ? args.pop() : argumentsToArray;
    Array.isArray(args[0]) && (args = args[0]);

    var parent = this;
    args.unshift(parent);

    return new ZipObservable(args, resultSelector);
  };

  /**
   * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences have produced an element at a corresponding index.
   * @param arguments Observable sources.
   * @param {Function} resultSelector Function to invoke for each series of elements at corresponding indexes in the sources.
   * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
   */
  Observable.zip = function () {
    var len = arguments.length, args = new Array(len);
    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
    if (Array.isArray(args[0])) {
      args = isFunction(args[1]) ? args[0].concat(args[1]) : args[0];
    }
    var first = args.shift();
    return first.zip.apply(first, args);
  };

function falseFactory() { return false; }
function emptyArrayFactory() { return []; }
function argumentsToArray() {
  var len = arguments.length, args = new Array(len);
  for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
  return args;
}

var ZipIterableObservable = (function(__super__) {
  inherits(ZipIterableObservable, __super__);
  function ZipIterableObservable(sources, cb) {
    this.sources = sources;
    this._cb = cb;
    __super__.call(this);
  }

  ZipIterableObservable.prototype.subscribeCore = function (o) {
    var sources = this.sources, len = sources.length, subscriptions = new Array(len);

    var state = {
      q: arrayInitialize(len, emptyArrayFactory),
      done: arrayInitialize(len, falseFactory),
      cb: this._cb,
      o: o
    };

    for (var i = 0; i < len; i++) {
      (function (i) {
        var source = sources[i], sad = new SingleAssignmentDisposable();
        (isArrayLike(source) || isIterable(source)) && (source = observableFrom(source));

        subscriptions[i] = sad;
        sad.setDisposable(source.subscribe(new ZipIterableObserver(state, i)));
      }(i));
    }

    return new NAryDisposable(subscriptions);
  };

  return ZipIterableObservable;
}(ObservableBase));

var ZipIterableObserver = (function (__super__) {
  inherits(ZipIterableObserver, __super__);
  function ZipIterableObserver(s, i) {
    this._s = s;
    this._i = i;
    __super__.call(this);
  }

  function notEmpty(x) { return x.length > 0; }
  function shiftEach(x) { return x.shift(); }
  function notTheSame(i) {
    return function (x, j) {
      return j !== i;
    };
  }

  ZipIterableObserver.prototype.next = function (x) {
    this._s.q[this._i].push(x);
    if (this._s.q.every(notEmpty)) {
      var queuedValues = this._s.q.map(shiftEach),
          res = tryCatch(this._s.cb).apply(null, queuedValues);
      if (res === errorObj) { return this._s.o.onError(res.e); }
      this._s.o.onNext(res);
    } else if (this._s.done.filter(notTheSame(this._i)).every(identity)) {
      this._s.o.onCompleted();
    }
  };

  ZipIterableObserver.prototype.error = function (e) { this._s.o.onError(e); };

  ZipIterableObserver.prototype.completed = function () {
    this._s.done[this._i] = true;
    this._s.done.every(identity) && this._s.o.onCompleted();
  };

  return ZipIterableObserver;
}(AbstractObserver));

/**
 * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences or an array have produced an element at a corresponding index.
 * The last element in the arguments must be a function to invoke for each series of elements at corresponding indexes in the args.
 * @returns {Observable} An observable sequence containing the result of combining elements of the args using the specified result selector function.
 */
observableProto.zipIterable = function () {
  if (arguments.length === 0) { throw new Error('invalid arguments'); }

  var len = arguments.length, args = new Array(len);
  for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
  var resultSelector = isFunction(args[len - 1]) ? args.pop() : argumentsToArray;

  var parent = this;
  args.unshift(parent);
  return new ZipIterableObservable(args, resultSelector);
};

  function asObservable(source) {
    return function subscribe(o) { return source.subscribe(o); };
  }

  /**
   *  Hides the identity of an observable sequence.
   * @returns {Observable} An observable sequence that hides the identity of the source sequence.
   */
  observableProto.asObservable = function () {
    return new AnonymousObservable(asObservable(this), this);
  };

  function toArray(x) { return x.toArray(); }
  function notEmpty(x) { return x.length > 0; }

  /**
   *  Projects each element of an observable sequence into zero or more buffers which are produced based on element count information.
   * @param {Number} count Length of each buffer.
   * @param {Number} [skip] Number of elements to skip between creation of consecutive buffers. If not provided, defaults to the count.
   * @returns {Observable} An observable sequence of buffers.
   */
  observableProto.bufferWithCount = observableProto.bufferCount = function (count, skip) {
    typeof skip !== 'number' && (skip = count);
    return this.windowWithCount(count, skip)
      .flatMap(toArray)
      .filter(notEmpty);
  };

  var DematerializeObservable = (function (__super__) {
    inherits(DematerializeObservable, __super__);
    function DematerializeObservable(source) {
      this.source = source;
      __super__.call(this);
    }

    DematerializeObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new DematerializeObserver(o));
    };

    return DematerializeObservable;
  }(ObservableBase));

  var DematerializeObserver = (function (__super__) {
    inherits(DematerializeObserver, __super__);

    function DematerializeObserver(o) {
      this._o = o;
      __super__.call(this);
    }

    DematerializeObserver.prototype.next = function (x) { x.accept(this._o); };
    DematerializeObserver.prototype.error = function (e) { this._o.onError(e); };
    DematerializeObserver.prototype.completed = function () { this._o.onCompleted(); };

    return DematerializeObserver;
  }(AbstractObserver));

  /**
   * Dematerializes the explicit notification values of an observable sequence as implicit notifications.
   * @returns {Observable} An observable sequence exhibiting the behavior corresponding to the source sequence's notification values.
   */
  observableProto.dematerialize = function () {
    return new DematerializeObservable(this);
  };

  var DistinctUntilChangedObservable = (function(__super__) {
    inherits(DistinctUntilChangedObservable, __super__);
    function DistinctUntilChangedObservable(source, keyFn, comparer) {
      this.source = source;
      this.keyFn = keyFn;
      this.comparer = comparer;
      __super__.call(this);
    }

    DistinctUntilChangedObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new DistinctUntilChangedObserver(o, this.keyFn, this.comparer));
    };

    return DistinctUntilChangedObservable;
  }(ObservableBase));

  var DistinctUntilChangedObserver = (function(__super__) {
    inherits(DistinctUntilChangedObserver, __super__);
    function DistinctUntilChangedObserver(o, keyFn, comparer) {
      this.o = o;
      this.keyFn = keyFn;
      this.comparer = comparer;
      this.hasCurrentKey = false;
      this.currentKey = null;
      __super__.call(this);
    }

    DistinctUntilChangedObserver.prototype.next = function (x) {
      var key = x, comparerEquals;
      if (isFunction(this.keyFn)) {
        key = tryCatch(this.keyFn)(x);
        if (key === errorObj) { return this.o.onError(key.e); }
      }
      if (this.hasCurrentKey) {
        comparerEquals = tryCatch(this.comparer)(this.currentKey, key);
        if (comparerEquals === errorObj) { return this.o.onError(comparerEquals.e); }
      }
      if (!this.hasCurrentKey || !comparerEquals) {
        this.hasCurrentKey = true;
        this.currentKey = key;
        this.o.onNext(x);
      }
    };
    DistinctUntilChangedObserver.prototype.error = function(e) {
      this.o.onError(e);
    };
    DistinctUntilChangedObserver.prototype.completed = function () {
      this.o.onCompleted();
    };

    return DistinctUntilChangedObserver;
  }(AbstractObserver));

  /**
  *  Returns an observable sequence that contains only distinct contiguous elements according to the keyFn and the comparer.
  * @param {Function} [keyFn] A function to compute the comparison key for each element. If not provided, it projects the value.
  * @param {Function} [comparer] Equality comparer for computed key values. If not provided, defaults to an equality comparer function.
  * @returns {Observable} An observable sequence only containing the distinct contiguous elements, based on a computed key value, from the source sequence.
  */
  observableProto.distinctUntilChanged = function (keyFn, comparer) {
    comparer || (comparer = defaultComparer);
    return new DistinctUntilChangedObservable(this, keyFn, comparer);
  };

  var TapObservable = (function(__super__) {
    inherits(TapObservable,__super__);
    function TapObservable(source, observerOrOnNext, onError, onCompleted) {
      this.source = source;
      this._oN = observerOrOnNext;
      this._oE = onError;
      this._oC = onCompleted;
      __super__.call(this);
    }

    TapObservable.prototype.subscribeCore = function(o) {
      return this.source.subscribe(new InnerObserver(o, this));
    };

    inherits(InnerObserver, AbstractObserver);
    function InnerObserver(o, p) {
      this.o = o;
      this.t = !p._oN || isFunction(p._oN) ?
        observerCreate(p._oN || noop, p._oE || noop, p._oC || noop) :
        p._oN;
      this.isStopped = false;
      AbstractObserver.call(this);
    }
    InnerObserver.prototype.next = function(x) {
      var res = tryCatch(this.t.onNext).call(this.t, x);
      if (res === errorObj) { this.o.onError(res.e); }
      this.o.onNext(x);
    };
    InnerObserver.prototype.error = function(err) {
      var res = tryCatch(this.t.onError).call(this.t, err);
      if (res === errorObj) { return this.o.onError(res.e); }
      this.o.onError(err);
    };
    InnerObserver.prototype.completed = function() {
      var res = tryCatch(this.t.onCompleted).call(this.t);
      if (res === errorObj) { return this.o.onError(res.e); }
      this.o.onCompleted();
    };

    return TapObservable;
  }(ObservableBase));

  /**
  *  Invokes an action for each element in the observable sequence and invokes an action upon graceful or exceptional termination of the observable sequence.
  *  This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
  * @param {Function | Observer} observerOrOnNext Action to invoke for each element in the observable sequence or an o.
  * @param {Function} [onError]  Action to invoke upon exceptional termination of the observable sequence. Used if only the observerOrOnNext parameter is also a function.
  * @param {Function} [onCompleted]  Action to invoke upon graceful termination of the observable sequence. Used if only the observerOrOnNext parameter is also a function.
  * @returns {Observable} The source sequence with the side-effecting behavior applied.
  */
  observableProto['do'] = observableProto.tap = observableProto.doAction = function (observerOrOnNext, onError, onCompleted) {
    return new TapObservable(this, observerOrOnNext, onError, onCompleted);
  };

  /**
  *  Invokes an action for each element in the observable sequence.
  *  This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
  * @param {Function} onNext Action to invoke for each element in the observable sequence.
  * @param {Any} [thisArg] Object to use as this when executing callback.
  * @returns {Observable} The source sequence with the side-effecting behavior applied.
  */
  observableProto.doOnNext = observableProto.tapOnNext = function (onNext, thisArg) {
    return this.tap(typeof thisArg !== 'undefined' ? function (x) { onNext.call(thisArg, x); } : onNext);
  };

  /**
  *  Invokes an action upon exceptional termination of the observable sequence.
  *  This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
  * @param {Function} onError Action to invoke upon exceptional termination of the observable sequence.
  * @param {Any} [thisArg] Object to use as this when executing callback.
  * @returns {Observable} The source sequence with the side-effecting behavior applied.
  */
  observableProto.doOnError = observableProto.tapOnError = function (onError, thisArg) {
    return this.tap(noop, typeof thisArg !== 'undefined' ? function (e) { onError.call(thisArg, e); } : onError);
  };

  /**
  *  Invokes an action upon graceful termination of the observable sequence.
  *  This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
  * @param {Function} onCompleted Action to invoke upon graceful termination of the observable sequence.
  * @param {Any} [thisArg] Object to use as this when executing callback.
  * @returns {Observable} The source sequence with the side-effecting behavior applied.
  */
  observableProto.doOnCompleted = observableProto.tapOnCompleted = function (onCompleted, thisArg) {
    return this.tap(noop, null, typeof thisArg !== 'undefined' ? function () { onCompleted.call(thisArg); } : onCompleted);
  };

  var FinallyObservable = (function (__super__) {
    inherits(FinallyObservable, __super__);
    function FinallyObservable(source, fn, thisArg) {
      this.source = source;
      this._fn = bindCallback(fn, thisArg, 0);
      __super__.call(this);
    }

    FinallyObservable.prototype.subscribeCore = function (o) {
      var d = tryCatch(this.source.subscribe).call(this.source, o);
      if (d === errorObj) {
        this._fn();
        thrower(d.e);
      }

      return new FinallyDisposable(d, this._fn);
    };

    function FinallyDisposable(s, fn) {
      this.isDisposed = false;
      this._s = s;
      this._fn = fn;
    }
    FinallyDisposable.prototype.dispose = function () {
      if (!this.isDisposed) {
        var res = tryCatch(this._s.dispose).call(this._s);
        this._fn();
        res === errorObj && thrower(res.e);
      }
    };

    return FinallyObservable;

  }(ObservableBase));

  /**
   *  Invokes a specified action after the source observable sequence terminates gracefully or exceptionally.
   * @param {Function} finallyAction Action to invoke after the source observable sequence terminates.
   * @returns {Observable} Source sequence with the action-invoking termination behavior applied.
   */
  observableProto['finally'] = function (action, thisArg) {
    return new FinallyObservable(this, action, thisArg);
  };

  var IgnoreElementsObservable = (function(__super__) {
    inherits(IgnoreElementsObservable, __super__);

    function IgnoreElementsObservable(source) {
      this.source = source;
      __super__.call(this);
    }

    IgnoreElementsObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new InnerObserver(o));
    };

    function InnerObserver(o) {
      this.o = o;
      this.isStopped = false;
    }
    InnerObserver.prototype.onNext = noop;
    InnerObserver.prototype.onError = function (err) {
      if(!this.isStopped) {
        this.isStopped = true;
        this.o.onError(err);
      }
    };
    InnerObserver.prototype.onCompleted = function () {
      if(!this.isStopped) {
        this.isStopped = true;
        this.o.onCompleted();
      }
    };
    InnerObserver.prototype.dispose = function() { this.isStopped = true; };
    InnerObserver.prototype.fail = function (e) {
      if (!this.isStopped) {
        this.isStopped = true;
        this.observer.onError(e);
        return true;
      }

      return false;
    };

    return IgnoreElementsObservable;
  }(ObservableBase));

  /**
   *  Ignores all elements in an observable sequence leaving only the termination messages.
   * @returns {Observable} An empty observable sequence that signals termination, successful or exceptional, of the source sequence.
   */
  observableProto.ignoreElements = function () {
    return new IgnoreElementsObservable(this);
  };

  var MaterializeObservable = (function (__super__) {
    inherits(MaterializeObservable, __super__);
    function MaterializeObservable(source, fn) {
      this.source = source;
      __super__.call(this);
    }

    MaterializeObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new MaterializeObserver(o));
    };

    return MaterializeObservable;
  }(ObservableBase));

  var MaterializeObserver = (function (__super__) {
    inherits(MaterializeObserver, __super__);

    function MaterializeObserver(o) {
      this._o = o;
      __super__.call(this);
    }

    MaterializeObserver.prototype.next = function (x) { this._o.onNext(notificationCreateOnNext(x)) };
    MaterializeObserver.prototype.error = function (e) { this._o.onNext(notificationCreateOnError(e)); this._o.onCompleted(); };
    MaterializeObserver.prototype.completed = function () { this._o.onNext(notificationCreateOnCompleted()); this._o.onCompleted(); };

    return MaterializeObserver;
  }(AbstractObserver));

  /**
   *  Materializes the implicit notifications of an observable sequence as explicit notification values.
   * @returns {Observable} An observable sequence containing the materialized notification values from the source sequence.
   */
  observableProto.materialize = function () {
    return new MaterializeObservable(this);
  };

  /**
   *  Repeats the observable sequence a specified number of times. If the repeat count is not specified, the sequence repeats indefinitely.
   * @param {Number} [repeatCount]  Number of times to repeat the sequence. If not provided, repeats the sequence indefinitely.
   * @returns {Observable} The observable sequence producing the elements of the given sequence repeatedly.
   */
  observableProto.repeat = function (repeatCount) {
    return enumerableRepeat(this, repeatCount).concat();
  };

  /**
   *  Repeats the source observable sequence the specified number of times or until it successfully terminates. If the retry count is not specified, it retries indefinitely.
   *  Note if you encounter an error and want it to retry once, then you must use .retry(2);
   *
   * @example
   *  var res = retried = retry.repeat();
   *  var res = retried = retry.repeat(2);
   * @param {Number} [retryCount]  Number of times to retry the sequence. If not provided, retry the sequence indefinitely.
   * @returns {Observable} An observable sequence producing the elements of the given sequence repeatedly until it terminates successfully.
   */
  observableProto.retry = function (retryCount) {
    return enumerableRepeat(this, retryCount).catchError();
  };

  function repeat(value) {
    return {
      '@@iterator': function () {
        return {
          next: function () {
            return { done: false, value: value };
          }
        };
      }
    };
  }

  var RetryWhenObservable = (function(__super__) {
    function createDisposable(state) {
      return {
        isDisposed: false,
        dispose: function () {
          if (!this.isDisposed) {
            this.isDisposed = true;
            state.isDisposed = true;
          }
        }
      };
    }

    function RetryWhenObservable(source, notifier) {
      this.source = source;
      this._notifier = notifier;
      __super__.call(this);
    }

    inherits(RetryWhenObservable, __super__);

    RetryWhenObservable.prototype.subscribeCore = function (o) {
      var exceptions = new Subject(),
        notifier = new Subject(),
        handled = this._notifier(exceptions),
        notificationDisposable = handled.subscribe(notifier);

      var e = this.source['@@iterator']();

      var state = { isDisposed: false },
        lastError,
        subscription = new SerialDisposable();
      var cancelable = currentThreadScheduler.scheduleRecursive(null, function (_, recurse) {
        if (state.isDisposed) { return; }
        var currentItem = e.next();

        if (currentItem.done) {
          if (lastError) {
            o.onError(lastError);
          } else {
            o.onCompleted();
          }
          return;
        }

        // Check if promise
        var currentValue = currentItem.value;
        isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));

        var outer = new SingleAssignmentDisposable();
        var inner = new SingleAssignmentDisposable();
        subscription.setDisposable(new BinaryDisposable(inner, outer));
        outer.setDisposable(currentValue.subscribe(
          function(x) { o.onNext(x); },
          function (exn) {
            inner.setDisposable(notifier.subscribe(recurse, function(ex) {
              o.onError(ex);
            }, function() {
              o.onCompleted();
            }));

            exceptions.onNext(exn);
            outer.dispose();
          },
          function() { o.onCompleted(); }));
      });

      return new NAryDisposable([notificationDisposable, subscription, cancelable, createDisposable(state)]);
    };

    return RetryWhenObservable;
  }(ObservableBase));

  observableProto.retryWhen = function (notifier) {
    return new RetryWhenObservable(repeat(this), notifier);
  };

  function repeat(value) {
    return {
      '@@iterator': function () {
        return {
          next: function () {
            return { done: false, value: value };
          }
        };
      }
    };
  }

  var RepeatWhenObservable = (function(__super__) {
    function createDisposable(state) {
      return {
        isDisposed: false,
        dispose: function () {
          if (!this.isDisposed) {
            this.isDisposed = true;
            state.isDisposed = true;
          }
        }
      };
    }

    function RepeatWhenObservable(source, notifier) {
      this.source = source;
      this._notifier = notifier;
      __super__.call(this);
    }

    inherits(RepeatWhenObservable, __super__);

    RepeatWhenObservable.prototype.subscribeCore = function (o) {
      var completions = new Subject(),
        notifier = new Subject(),
        handled = this._notifier(completions),
        notificationDisposable = handled.subscribe(notifier);

      var e = this.source['@@iterator']();

      var state = { isDisposed: false },
        lastError,
        subscription = new SerialDisposable();
      var cancelable = currentThreadScheduler.scheduleRecursive(null, function (_, recurse) {
        if (state.isDisposed) { return; }
        var currentItem = e.next();

        if (currentItem.done) {
          if (lastError) {
            o.onError(lastError);
          } else {
            o.onCompleted();
          }
          return;
        }

        // Check if promise
        var currentValue = currentItem.value;
        isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));

        var outer = new SingleAssignmentDisposable();
        var inner = new SingleAssignmentDisposable();
        subscription.setDisposable(new BinaryDisposable(inner, outer));
        outer.setDisposable(currentValue.subscribe(
          function(x) { o.onNext(x); },
          function (exn) { o.onError(exn); },
          function() {
            inner.setDisposable(notifier.subscribe(recurse, function(ex) {
              o.onError(ex);
            }, function() {
              o.onCompleted();
            }));

            completions.onNext(null);
            outer.dispose();
          }));
      });

      return new NAryDisposable([notificationDisposable, subscription, cancelable, createDisposable(state)]);
    };

    return RepeatWhenObservable;
  }(ObservableBase));

  observableProto.repeatWhen = function (notifier) {
    return new RepeatWhenObservable(repeat(this), notifier);
  };

  var ScanObservable = (function(__super__) {
    inherits(ScanObservable, __super__);
    function ScanObservable(source, accumulator, hasSeed, seed) {
      this.source = source;
      this.accumulator = accumulator;
      this.hasSeed = hasSeed;
      this.seed = seed;
      __super__.call(this);
    }

    ScanObservable.prototype.subscribeCore = function(o) {
      return this.source.subscribe(new ScanObserver(o,this));
    };

    return ScanObservable;
  }(ObservableBase));

  var ScanObserver = (function (__super__) {
    inherits(ScanObserver, __super__);
    function ScanObserver(o, parent) {
      this._o = o;
      this._p = parent;
      this._fn = parent.accumulator;
      this._hs = parent.hasSeed;
      this._s = parent.seed;
      this._ha = false;
      this._a = null;
      this._hv = false;
      this._i = 0;
      __super__.call(this);
    }

    ScanObserver.prototype.next = function (x) {
      !this._hv && (this._hv = true);
      if (this._ha) {
        this._a = tryCatch(this._fn)(this._a, x, this._i, this._p);
      } else {
        this._a = this._hs ? tryCatch(this._fn)(this._s, x, this._i, this._p) : x;
        this._ha = true;
      }
      if (this._a === errorObj) { return this._o.onError(this._a.e); }
      this._o.onNext(this._a);
      this._i++;
    };

    ScanObserver.prototype.error = function (e) {
      this._o.onError(e);
    };

    ScanObserver.prototype.completed = function () {
      !this._hv && this._hs && this._o.onNext(this._s);
      this._o.onCompleted();
    };

    return ScanObserver;
  }(AbstractObserver));

  /**
  *  Applies an accumulator function over an observable sequence and returns each intermediate result. The optional seed value is used as the initial accumulator value.
  *  For aggregation behavior with no intermediate results, see Observable.aggregate.
  * @param {Mixed} [seed] The initial accumulator value.
  * @param {Function} accumulator An accumulator function to be invoked on each element.
  * @returns {Observable} An observable sequence containing the accumulated values.
  */
  observableProto.scan = function () {
    var hasSeed = false, seed, accumulator = arguments[0];
    if (arguments.length === 2) {
      hasSeed = true;
      seed = arguments[1];
    }
    return new ScanObservable(this, accumulator, hasSeed, seed);
  };

  var SkipLastObservable = (function (__super__) {
    inherits(SkipLastObservable, __super__);
    function SkipLastObservable(source, c) {
      this.source = source;
      this._c = c;
      __super__.call(this);
    }

    SkipLastObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new SkipLastObserver(o, this._c));
    };

    return SkipLastObservable;
  }(ObservableBase));

  var SkipLastObserver = (function (__super__) {
    inherits(SkipLastObserver, __super__);
    function SkipLastObserver(o, c) {
      this._o = o;
      this._c = c;
      this._q = [];
      __super__.call(this);
    }

    SkipLastObserver.prototype.next = function (x) {
      this._q.push(x);
      this._q.length > this._c && this._o.onNext(this._q.shift());
    };

    SkipLastObserver.prototype.error = function (e) {
      this._o.onError(e);
    };

    SkipLastObserver.prototype.completed = function () {
      this._o.onCompleted();
    };

    return SkipLastObserver;
  }(AbstractObserver));

  /**
   *  Bypasses a specified number of elements at the end of an observable sequence.
   * @description
   *  This operator accumulates a queue with a length enough to store the first `count` elements. As more elements are
   *  received, elements are taken from the front of the queue and produced on the result sequence. This causes elements to be delayed.
   * @param count Number of elements to bypass at the end of the source sequence.
   * @returns {Observable} An observable sequence containing the source sequence elements except for the bypassed ones at the end.
   */
  observableProto.skipLast = function (count) {
    if (count < 0) { throw new ArgumentOutOfRangeError(); }
    return new SkipLastObservable(this, count);
  };

  /**
   *  Prepends a sequence of values to an observable sequence with an optional scheduler and an argument list of values to prepend.
   *  @example
   *  var res = source.startWith(1, 2, 3);
   *  var res = source.startWith(Rx.Scheduler.timeout, 1, 2, 3);
   * @param {Arguments} args The specified values to prepend to the observable sequence
   * @returns {Observable} The source sequence prepended with the specified values.
   */
  observableProto.startWith = function () {
    var values, scheduler, start = 0;
    if (!!arguments.length && isScheduler(arguments[0])) {
      scheduler = arguments[0];
      start = 1;
    } else {
      scheduler = immediateScheduler;
    }
    for(var args = [], i = start, len = arguments.length; i < len; i++) { args.push(arguments[i]); }
    return observableConcat.apply(null, [observableFromArray(args, scheduler), this]);
  };

  var TakeLastObserver = (function (__super__) {
    inherits(TakeLastObserver, __super__);
    function TakeLastObserver(o, c) {
      this._o = o;
      this._c = c;
      this._q = [];
      __super__.call(this);
    }

    TakeLastObserver.prototype.next = function (x) {
      this._q.push(x);
      this._q.length > this._c && this._q.shift();
    };

    TakeLastObserver.prototype.error = function (e) {
      this._o.onError(e);
    };

    TakeLastObserver.prototype.completed = function () {
      while (this._q.length > 0) { this._o.onNext(this._q.shift()); }
      this._o.onCompleted();
    };

    return TakeLastObserver;
  }(AbstractObserver));

  /**
   *  Returns a specified number of contiguous elements from the end of an observable sequence.
   * @description
   *  This operator accumulates a buffer with a length enough to store elements count elements. Upon completion of
   *  the source sequence, this buffer is drained on the result sequence. This causes the elements to be delayed.
   * @param {Number} count Number of elements to take from the end of the source sequence.
   * @returns {Observable} An observable sequence containing the specified number of elements from the end of the source sequence.
   */
  observableProto.takeLast = function (count) {
    if (count < 0) { throw new ArgumentOutOfRangeError(); }
    var source = this;
    return new AnonymousObservable(function (o) {
      return source.subscribe(new TakeLastObserver(o, count));
    }, source);
  };

  var TakeLastBufferObserver = (function (__super__) {
    inherits(TakeLastBufferObserver, __super__);
    function TakeLastBufferObserver(o, c) {
      this._o = o;
      this._c = c;
      this._q = [];
      __super__.call(this);
    }

    TakeLastBufferObserver.prototype.next = function (x) {
      this._q.push(x);
      this._q.length > this._c && this._q.shift();
    };

    TakeLastBufferObserver.prototype.error = function (e) {
      this._o.onError(e);
    };

    TakeLastBufferObserver.prototype.completed = function () {
      this._o.onNext(this._q);
      this._o.onCompleted();
    };

    return TakeLastBufferObserver;
  }(AbstractObserver));

  /**
   *  Returns an array with the specified number of contiguous elements from the end of an observable sequence.
   *
   * @description
   *  This operator accumulates a buffer with a length enough to store count elements. Upon completion of the
   *  source sequence, this buffer is produced on the result sequence.
   * @param {Number} count Number of elements to take from the end of the source sequence.
   * @returns {Observable} An observable sequence containing a single array with the specified number of elements from the end of the source sequence.
   */
  observableProto.takeLastBuffer = function (count) {
    if (count < 0) { throw new ArgumentOutOfRangeError(); }
    var source = this;
    return new AnonymousObservable(function (o) {
      return source.subscribe(new TakeLastBufferObserver(o, count));
    }, source);
  };

  /**
   *  Projects each element of an observable sequence into zero or more windows which are produced based on element count information.
   * @param {Number} count Length of each window.
   * @param {Number} [skip] Number of elements to skip between creation of consecutive windows. If not specified, defaults to the count.
   * @returns {Observable} An observable sequence of windows.
   */
  observableProto.windowWithCount = observableProto.windowCount = function (count, skip) {
    var source = this;
    +count || (count = 0);
    Math.abs(count) === Infinity && (count = 0);
    if (count <= 0) { throw new ArgumentOutOfRangeError(); }
    skip == null && (skip = count);
    +skip || (skip = 0);
    Math.abs(skip) === Infinity && (skip = 0);

    if (skip <= 0) { throw new ArgumentOutOfRangeError(); }
    return new AnonymousObservable(function (observer) {
      var m = new SingleAssignmentDisposable(),
        refCountDisposable = new RefCountDisposable(m),
        n = 0,
        q = [];

      function createWindow () {
        var s = new Subject();
        q.push(s);
        observer.onNext(addRef(s, refCountDisposable));
      }

      createWindow();

      m.setDisposable(source.subscribe(
        function (x) {
          for (var i = 0, len = q.length; i < len; i++) { q[i].onNext(x); }
          var c = n - count + 1;
          c >= 0 && c % skip === 0 && q.shift().onCompleted();
          ++n % skip === 0 && createWindow();
        },
        function (e) {
          while (q.length > 0) { q.shift().onError(e); }
          observer.onError(e);
        },
        function () {
          while (q.length > 0) { q.shift().onCompleted(); }
          observer.onCompleted();
        }
      ));
      return refCountDisposable;
    }, source);
  };

  function concatMap(source, selector, thisArg) {
    var selectorFunc = bindCallback(selector, thisArg, 3);
    return source.map(function (x, i) {
      var result = selectorFunc(x, i, source);
      isPromise(result) && (result = observableFromPromise(result));
      (isArrayLike(result) || isIterable(result)) && (result = observableFrom(result));
      return result;
    }).concatAll();
  }

  /**
   *  One of the Following:
   *  Projects each element of an observable sequence to an observable sequence and merges the resulting observable sequences into one observable sequence.
   *
   * @example
   *  var res = source.concatMap(function (x) { return Rx.Observable.range(0, x); });
   *  Or:
   *  Projects each element of an observable sequence to an observable sequence, invokes the result selector for the source element and each of the corresponding inner sequence's elements, and merges the results into one observable sequence.
   *
   *  var res = source.concatMap(function (x) { return Rx.Observable.range(0, x); }, function (x, y) { return x + y; });
   *  Or:
   *  Projects each element of the source observable sequence to the other observable sequence and merges the resulting observable sequences into one observable sequence.
   *
   *  var res = source.concatMap(Rx.Observable.fromArray([1,2,3]));
   * @param {Function} selector A transform function to apply to each element or an observable sequence to project each element from the
   * source sequence onto which could be either an observable or Promise.
   * @param {Function} [resultSelector]  A transform function to apply to each element of the intermediate sequence.
   * @returns {Observable} An observable sequence whose elements are the result of invoking the one-to-many transform function collectionSelector on each element of the input sequence and then mapping each of those sequence elements and their corresponding source element to a result element.
   */
  observableProto.selectConcat = observableProto.concatMap = function (selector, resultSelector, thisArg) {
    if (isFunction(selector) && isFunction(resultSelector)) {
      return this.concatMap(function (x, i) {
        var selectorResult = selector(x, i);
        isPromise(selectorResult) && (selectorResult = observableFromPromise(selectorResult));
        (isArrayLike(selectorResult) || isIterable(selectorResult)) && (selectorResult = observableFrom(selectorResult));

        return selectorResult.map(function (y, i2) {
          return resultSelector(x, y, i, i2);
        });
      });
    }
    return isFunction(selector) ?
      concatMap(this, selector, thisArg) :
      concatMap(this, function () { return selector; });
  };

  /**
   * Projects each notification of an observable sequence to an observable sequence and concats the resulting observable sequences into one observable sequence.
   * @param {Function} onNext A transform function to apply to each element; the second parameter of the function represents the index of the source element.
   * @param {Function} onError A transform function to apply when an error occurs in the source sequence.
   * @param {Function} onCompleted A transform function to apply when the end of the source sequence is reached.
   * @param {Any} [thisArg] An optional "this" to use to invoke each transform.
   * @returns {Observable} An observable sequence whose elements are the result of invoking the one-to-many transform function corresponding to each notification in the input sequence.
   */
  observableProto.concatMapObserver = observableProto.selectConcatObserver = function(onNext, onError, onCompleted, thisArg) {
    var source = this,
        onNextFunc = bindCallback(onNext, thisArg, 2),
        onErrorFunc = bindCallback(onError, thisArg, 1),
        onCompletedFunc = bindCallback(onCompleted, thisArg, 0);
    return new AnonymousObservable(function (observer) {
      var index = 0;
      return source.subscribe(
        function (x) {
          var result;
          try {
            result = onNextFunc(x, index++);
          } catch (e) {
            observer.onError(e);
            return;
          }
          isPromise(result) && (result = observableFromPromise(result));
          observer.onNext(result);
        },
        function (err) {
          var result;
          try {
            result = onErrorFunc(err);
          } catch (e) {
            observer.onError(e);
            return;
          }
          isPromise(result) && (result = observableFromPromise(result));
          observer.onNext(result);
          observer.onCompleted();
        },
        function () {
          var result;
          try {
            result = onCompletedFunc();
          } catch (e) {
            observer.onError(e);
            return;
          }
          isPromise(result) && (result = observableFromPromise(result));
          observer.onNext(result);
          observer.onCompleted();
        });
    }, this).concatAll();
  };

  var DefaultIfEmptyObserver = (function (__super__) {
    inherits(DefaultIfEmptyObserver, __super__);
    function DefaultIfEmptyObserver(o, d) {
      this._o = o;
      this._d = d;
      this._f = false;
      __super__.call(this);
    }

    DefaultIfEmptyObserver.prototype.next = function (x) {
      this._f = true;
      this._o.onNext(x);
    };

    DefaultIfEmptyObserver.prototype.error = function (e) {
      this._o.onError(e);
    };

    DefaultIfEmptyObserver.prototype.completed = function () {
      !this._f && this._o.onNext(this._d);
      this._o.onCompleted();
    };

    return DefaultIfEmptyObserver;
  }(AbstractObserver));

  /**
   *  Returns the elements of the specified sequence or the specified value in a singleton sequence if the sequence is empty.
   *
   *  var res = obs = xs.defaultIfEmpty();
   *  2 - obs = xs.defaultIfEmpty(false);
   *
   * @memberOf Observable#
   * @param defaultValue The value to return if the sequence is empty. If not provided, this defaults to null.
   * @returns {Observable} An observable sequence that contains the specified default value if the source is empty; otherwise, the elements of the source itself.
   */
    observableProto.defaultIfEmpty = function (defaultValue) {
      var source = this;
      defaultValue === undefined && (defaultValue = null);
      return new AnonymousObservable(function (o) {
        return source.subscribe(new DefaultIfEmptyObserver(o, defaultValue));
      }, source);
    };

  // Swap out for Array.findIndex
  function arrayIndexOfComparer(array, item, comparer) {
    for (var i = 0, len = array.length; i < len; i++) {
      if (comparer(array[i], item)) { return i; }
    }
    return -1;
  }

  function HashSet(comparer) {
    this.comparer = comparer;
    this.set = [];
  }
  HashSet.prototype.push = function(value) {
    var retValue = arrayIndexOfComparer(this.set, value, this.comparer) === -1;
    retValue && this.set.push(value);
    return retValue;
  };

  var DistinctObservable = (function (__super__) {
    inherits(DistinctObservable, __super__);
    function DistinctObservable(source, keyFn, cmpFn) {
      this.source = source;
      this._keyFn = keyFn;
      this._cmpFn = cmpFn;
      __super__.call(this);
    }

    DistinctObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new DistinctObserver(o, this._keyFn, this._cmpFn));
    };

    return DistinctObservable;
  }(ObservableBase));

  var DistinctObserver = (function (__super__) {
    inherits(DistinctObserver, __super__);
    function DistinctObserver(o, keyFn, cmpFn) {
      this._o = o;
      this._keyFn = keyFn;
      this._h = new HashSet(cmpFn);
      __super__.call(this);
    }

    DistinctObserver.prototype.next = function (x) {
      var key = x;
      if (isFunction(this._keyFn)) {
        key = tryCatch(this._keyFn)(x);
        if (key === errorObj) { return this._o.onError(key.e); }
      }
      this._h.push(key) && this._o.onNext(x);
    };

    DistinctObserver.prototype.error = function (e) { this._o.onError(e); };
    DistinctObserver.prototype.completed = function () { this._o.onCompleted(); };

    return DistinctObserver;
  }(AbstractObserver));

  /**
   *  Returns an observable sequence that contains only distinct elements according to the keySelector and the comparer.
   *  Usage of this operator should be considered carefully due to the maintenance of an internal lookup structure which can grow large.
   *
   * @example
   *  var res = obs = xs.distinct();
   *  2 - obs = xs.distinct(function (x) { return x.id; });
   *  2 - obs = xs.distinct(function (x) { return x.id; }, function (a,b) { return a === b; });
   * @param {Function} [keySelector]  A function to compute the comparison key for each element.
   * @param {Function} [comparer]  Used to compare items in the collection.
   * @returns {Observable} An observable sequence only containing the distinct elements, based on a computed key value, from the source sequence.
   */
  observableProto.distinct = function (keySelector, comparer) {
    comparer || (comparer = defaultComparer);
    return new DistinctObservable(this, keySelector, comparer);
  };

  /**
   *  Groups the elements of an observable sequence according to a specified key selector function and comparer and selects the resulting elements by using a specified function.
   *
   * @example
   *  var res = observable.groupBy(function (x) { return x.id; });
   *  2 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; });
   *  3 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; }, function (x) { return x.toString(); });
   * @param {Function} keySelector A function to extract the key for each element.
   * @param {Function} [elementSelector]  A function to map each source element to an element in an observable group.
   * @returns {Observable} A sequence of observable groups, each of which corresponds to a unique key value, containing all elements that share that same key value.
   */
  observableProto.groupBy = function (keySelector, elementSelector) {
    return this.groupByUntil(keySelector, elementSelector, observableNever);
  };

    /**
     *  Groups the elements of an observable sequence according to a specified key selector function.
     *  A duration selector function is used to control the lifetime of groups. When a group expires, it receives an OnCompleted notification. When a new element with the same
     *  key value as a reclaimed group occurs, the group will be reborn with a new lifetime request.
     *
     * @example
     *  var res = observable.groupByUntil(function (x) { return x.id; }, null,  function () { return Rx.Observable.never(); });
     *  2 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; },  function () { return Rx.Observable.never(); });
     *  3 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; },  function () { return Rx.Observable.never(); }, function (x) { return x.toString(); });
     * @param {Function} keySelector A function to extract the key for each element.
     * @param {Function} durationSelector A function to signal the expiration of a group.
     * @returns {Observable}
     *  A sequence of observable groups, each of which corresponds to a unique key value, containing all elements that share that same key value.
     *  If a group's lifetime expires, a new group with the same key value can be created once an element with such a key value is encoutered.
     *
     */
    observableProto.groupByUntil = function (keySelector, elementSelector, durationSelector) {
      var source = this;
      return new AnonymousObservable(function (o) {
        var map = new Map(),
          groupDisposable = new CompositeDisposable(),
          refCountDisposable = new RefCountDisposable(groupDisposable),
          handleError = function (e) { return function (item) { item.onError(e); }; };

        groupDisposable.add(
          source.subscribe(function (x) {
            var key = tryCatch(keySelector)(x);
            if (key === errorObj) {
              map.forEach(handleError(key.e));
              return o.onError(key.e);
            }

            var fireNewMapEntry = false, writer = map.get(key);
            if (writer === undefined) {
              writer = new Subject();
              map.set(key, writer);
              fireNewMapEntry = true;
            }

            if (fireNewMapEntry) {
              var group = new GroupedObservable(key, writer, refCountDisposable),
                durationGroup = new GroupedObservable(key, writer);
              var duration = tryCatch(durationSelector)(durationGroup);
              if (duration === errorObj) {
                map.forEach(handleError(duration.e));
                return o.onError(duration.e);
              }

              o.onNext(group);

              var md = new SingleAssignmentDisposable();
              groupDisposable.add(md);

              md.setDisposable(duration.take(1).subscribe(
                noop,
                function (e) {
                  map.forEach(handleError(e));
                  o.onError(e);
                },
                function () {
                  if (map['delete'](key)) { writer.onCompleted(); }
                  groupDisposable.remove(md);
                }));
            }

            var element = x;
            if (isFunction(elementSelector)) {
              element = tryCatch(elementSelector)(x);
              if (element === errorObj) {
                map.forEach(handleError(element.e));
                return o.onError(element.e);
              }
            }

            writer.onNext(element);
        }, function (e) {
          map.forEach(handleError(e));
          o.onError(e);
        }, function () {
          map.forEach(function (item) { item.onCompleted(); });
          o.onCompleted();
        }));

      return refCountDisposable;
    }, source);
  };

  var MapObservable = (function (__super__) {
    inherits(MapObservable, __super__);

    function MapObservable(source, selector, thisArg) {
      this.source = source;
      this.selector = bindCallback(selector, thisArg, 3);
      __super__.call(this);
    }

    function innerMap(selector, self) {
      return function (x, i, o) { return selector.call(this, self.selector(x, i, o), i, o); };
    }

    MapObservable.prototype.internalMap = function (selector, thisArg) {
      return new MapObservable(this.source, innerMap(selector, this), thisArg);
    };

    MapObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new InnerObserver(o, this.selector, this));
    };

    inherits(InnerObserver, AbstractObserver);
    function InnerObserver(o, selector, source) {
      this.o = o;
      this.selector = selector;
      this.source = source;
      this.i = 0;
      AbstractObserver.call(this);
    }

    InnerObserver.prototype.next = function(x) {
      var result = tryCatch(this.selector)(x, this.i++, this.source);
      if (result === errorObj) { return this.o.onError(result.e); }
      this.o.onNext(result);
    };

    InnerObserver.prototype.error = function (e) {
      this.o.onError(e);
    };

    InnerObserver.prototype.completed = function () {
      this.o.onCompleted();
    };

    return MapObservable;

  }(ObservableBase));

  /**
  * Projects each element of an observable sequence into a new form by incorporating the element's index.
  * @param {Function} selector A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
  * @param {Any} [thisArg] Object to use as this when executing callback.
  * @returns {Observable} An observable sequence whose elements are the result of invoking the transform function on each element of source.
  */
  observableProto.map = observableProto.select = function (selector, thisArg) {
    var selectorFn = typeof selector === 'function' ? selector : function () { return selector; };
    return this instanceof MapObservable ?
      this.internalMap(selectorFn, thisArg) :
      new MapObservable(this, selectorFn, thisArg);
  };

  function plucker(args, len) {
    return function mapper(x) {
      var currentProp = x;
      for (var i = 0; i < len; i++) {
        var p = currentProp[args[i]];
        if (typeof p !== 'undefined') {
          currentProp = p;
        } else {
          return undefined;
        }
      }
      return currentProp;
    };
  }

  /**
   * Retrieves the value of a specified nested property from all elements in
   * the Observable sequence.
   * @param {Arguments} arguments The nested properties to pluck.
   * @returns {Observable} Returns a new Observable sequence of property values.
   */
  observableProto.pluck = function () {
    var len = arguments.length, args = new Array(len);
    if (len === 0) { throw new Error('List of properties cannot be empty.'); }
    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
    return this.map(plucker(args, len));
  };

observableProto.flatMap = observableProto.selectMany = observableProto.mergeMap = function(selector, resultSelector, thisArg) {
    return new FlatMapObservable(this, selector, resultSelector, thisArg).mergeAll();
};

  /**
   * Projects each notification of an observable sequence to an observable sequence and merges the resulting observable sequences into one observable sequence.
   * @param {Function} onNext A transform function to apply to each element; the second parameter of the function represents the index of the source element.
   * @param {Function} onError A transform function to apply when an error occurs in the source sequence.
   * @param {Function} onCompleted A transform function to apply when the end of the source sequence is reached.
   * @param {Any} [thisArg] An optional "this" to use to invoke each transform.
   * @returns {Observable} An observable sequence whose elements are the result of invoking the one-to-many transform function corresponding to each notification in the input sequence.
   */
  observableProto.flatMapObserver = observableProto.selectManyObserver = function (onNext, onError, onCompleted, thisArg) {
    var source = this;
    return new AnonymousObservable(function (observer) {
      var index = 0;

      return source.subscribe(
        function (x) {
          var result;
          try {
            result = onNext.call(thisArg, x, index++);
          } catch (e) {
            observer.onError(e);
            return;
          }
          isPromise(result) && (result = observableFromPromise(result));
          observer.onNext(result);
        },
        function (err) {
          var result;
          try {
            result = onError.call(thisArg, err);
          } catch (e) {
            observer.onError(e);
            return;
          }
          isPromise(result) && (result = observableFromPromise(result));
          observer.onNext(result);
          observer.onCompleted();
        },
        function () {
          var result;
          try {
            result = onCompleted.call(thisArg);
          } catch (e) {
            observer.onError(e);
            return;
          }
          isPromise(result) && (result = observableFromPromise(result));
          observer.onNext(result);
          observer.onCompleted();
        });
    }, source).mergeAll();
  };

observableProto.flatMapLatest = observableProto.switchMap = function(selector, resultSelector, thisArg) {
    return new FlatMapObservable(this, selector, resultSelector, thisArg).switchLatest();
};

  var SkipObservable = (function(__super__) {
    inherits(SkipObservable, __super__);
    function SkipObservable(source, count) {
      this.source = source;
      this._count = count;
      __super__.call(this);
    }

    SkipObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new SkipObserver(o, this._count));
    };

    function SkipObserver(o, c) {
      this._o = o;
      this._r = c;
      AbstractObserver.call(this);
    }

    inherits(SkipObserver, AbstractObserver);

    SkipObserver.prototype.next = function (x) {
      if (this._r <= 0) {
        this._o.onNext(x);
      } else {
        this._r--;
      }
    };
    SkipObserver.prototype.error = function(e) { this._o.onError(e); };
    SkipObserver.prototype.completed = function() { this._o.onCompleted(); };

    return SkipObservable;
  }(ObservableBase));

  /**
   * Bypasses a specified number of elements in an observable sequence and then returns the remaining elements.
   * @param {Number} count The number of elements to skip before returning the remaining elements.
   * @returns {Observable} An observable sequence that contains the elements that occur after the specified index in the input sequence.
   */
  observableProto.skip = function (count) {
    if (count < 0) { throw new ArgumentOutOfRangeError(); }
    return new SkipObservable(this, count);
  };

  var SkipWhileObservable = (function (__super__) {
    inherits(SkipWhileObservable, __super__);
    function SkipWhileObservable(source, fn) {
      this.source = source;
      this._fn = fn;
      __super__.call(this);
    }

    SkipWhileObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new SkipWhileObserver(o, this));
    };

    return SkipWhileObservable;
  }(ObservableBase));

  var SkipWhileObserver = (function (__super__) {
    inherits(SkipWhileObserver, __super__);

    function SkipWhileObserver(o, p) {
      this._o = o;
      this._p = p;
      this._i = 0;
      this._r = false;
      __super__.call(this);
    }

    SkipWhileObserver.prototype.next = function (x) {
      if (!this._r) {
        var res = tryCatch(this._p._fn)(x, this._i++, this._p);
        if (res === errorObj) { return this._o.onError(res.e); }
        this._r = !res;
      }
      this._r && this._o.onNext(x);
    };
    SkipWhileObserver.prototype.error = function (e) { this._o.onError(e); };
    SkipWhileObserver.prototype.completed = function () { this._o.onCompleted(); };

    return SkipWhileObserver;
  }(AbstractObserver));

  /**
   *  Bypasses elements in an observable sequence as long as a specified condition is true and then returns the remaining elements.
   *  The element's index is used in the logic of the predicate function.
   *
   *  var res = source.skipWhile(function (value) { return value < 10; });
   *  var res = source.skipWhile(function (value, index) { return value < 10 || index < 10; });
   * @param {Function} predicate A function to test each element for a condition; the second parameter of the function represents the index of the source element.
   * @param {Any} [thisArg] Object to use as this when executing callback.
   * @returns {Observable} An observable sequence that contains the elements from the input sequence starting at the first element in the linear series that does not pass the test specified by predicate.
   */
  observableProto.skipWhile = function (predicate, thisArg) {
    var fn = bindCallback(predicate, thisArg, 3);
    return new SkipWhileObservable(this, fn);
  };

  var TakeObservable = (function(__super__) {
    inherits(TakeObservable, __super__);
    function TakeObservable(source, count) {
      this.source = source;
      this._count = count;
      __super__.call(this);
    }

    TakeObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new TakeObserver(o, this._count));
    };

    function TakeObserver(o, c) {
      this._o = o;
      this._c = c;
      this._r = c;
      AbstractObserver.call(this);
    }

    inherits(TakeObserver, AbstractObserver);

    TakeObserver.prototype.next = function (x) {
      if (this._r-- > 0) {
        this._o.onNext(x);
        this._r <= 0 && this._o.onCompleted();
      }
    };

    TakeObserver.prototype.error = function (e) { this._o.onError(e); };
    TakeObserver.prototype.completed = function () { this._o.onCompleted(); };

    return TakeObservable;
  }(ObservableBase));

  /**
   *  Returns a specified number of contiguous elements from the start of an observable sequence, using the specified scheduler for the edge case of take(0).
   * @param {Number} count The number of elements to return.
   * @param {Scheduler} [scheduler] Scheduler used to produce an OnCompleted message in case <paramref name="count count</paramref> is set to 0.
   * @returns {Observable} An observable sequence that contains the specified number of elements from the start of the input sequence.
   */
  observableProto.take = function (count, scheduler) {
    if (count < 0) { throw new ArgumentOutOfRangeError(); }
    if (count === 0) { return observableEmpty(scheduler); }
    return new TakeObservable(this, count);
  };

  var TakeWhileObservable = (function (__super__) {
    inherits(TakeWhileObservable, __super__);
    function TakeWhileObservable(source, fn) {
      this.source = source;
      this._fn = fn;
      __super__.call(this);
    }

    TakeWhileObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new TakeWhileObserver(o, this));
    };

    return TakeWhileObservable;
  }(ObservableBase));

  var TakeWhileObserver = (function (__super__) {
    inherits(TakeWhileObserver, __super__);

    function TakeWhileObserver(o, p) {
      this._o = o;
      this._p = p;
      this._i = 0;
      this._r = true;
      __super__.call(this);
    }

    TakeWhileObserver.prototype.next = function (x) {
      if (this._r) {
        this._r = tryCatch(this._p._fn)(x, this._i++, this._p);
        if (this._r === errorObj) { return this._o.onError(this._r.e); }
      }
      if (this._r) {
        this._o.onNext(x);
      } else {
        this._o.onCompleted();
      }
    };
    TakeWhileObserver.prototype.error = function (e) { this._o.onError(e); };
    TakeWhileObserver.prototype.completed = function () { this._o.onCompleted(); };

    return TakeWhileObserver;
  }(AbstractObserver));

  /**
   *  Returns elements from an observable sequence as long as a specified condition is true.
   *  The element's index is used in the logic of the predicate function.
   * @param {Function} predicate A function to test each element for a condition; the second parameter of the function represents the index of the source element.
   * @param {Any} [thisArg] Object to use as this when executing callback.
   * @returns {Observable} An observable sequence that contains the elements from the input sequence that occur before the element at which the test no longer passes.
   */
  observableProto.takeWhile = function (predicate, thisArg) {
    var fn = bindCallback(predicate, thisArg, 3);
    return new TakeWhileObservable(this, fn);
  };

  var FilterObservable = (function (__super__) {
    inherits(FilterObservable, __super__);

    function FilterObservable(source, predicate, thisArg) {
      this.source = source;
      this.predicate = bindCallback(predicate, thisArg, 3);
      __super__.call(this);
    }

    FilterObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new InnerObserver(o, this.predicate, this));
    };

    function innerPredicate(predicate, self) {
      return function(x, i, o) { return self.predicate(x, i, o) && predicate.call(this, x, i, o); }
    }

    FilterObservable.prototype.internalFilter = function(predicate, thisArg) {
      return new FilterObservable(this.source, innerPredicate(predicate, this), thisArg);
    };

    inherits(InnerObserver, AbstractObserver);
    function InnerObserver(o, predicate, source) {
      this.o = o;
      this.predicate = predicate;
      this.source = source;
      this.i = 0;
      AbstractObserver.call(this);
    }

    InnerObserver.prototype.next = function(x) {
      var shouldYield = tryCatch(this.predicate)(x, this.i++, this.source);
      if (shouldYield === errorObj) {
        return this.o.onError(shouldYield.e);
      }
      shouldYield && this.o.onNext(x);
    };

    InnerObserver.prototype.error = function (e) {
      this.o.onError(e);
    };

    InnerObserver.prototype.completed = function () {
      this.o.onCompleted();
    };

    return FilterObservable;

  }(ObservableBase));

  /**
  *  Filters the elements of an observable sequence based on a predicate by incorporating the element's index.
  * @param {Function} predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element.
  * @param {Any} [thisArg] Object to use as this when executing callback.
  * @returns {Observable} An observable sequence that contains elements from the input sequence that satisfy the condition.
  */
  observableProto.filter = observableProto.where = function (predicate, thisArg) {
    return this instanceof FilterObservable ? this.internalFilter(predicate, thisArg) :
      new FilterObservable(this, predicate, thisArg);
  };

  var ExtremaByObservable = (function (__super__) {
    inherits(ExtremaByObservable, __super__);
    function ExtremaByObservable(source, k, c) {
      this.source = source;
      this._k = k;
      this._c = c;
      __super__.call(this);
    }

    ExtremaByObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new ExtremaByObserver(o, this._k, this._c));
    };

    return ExtremaByObservable;
  }(ObservableBase));

  var ExtremaByObserver = (function (__super__) {
    inherits(ExtremaByObserver, __super__);
    function ExtremaByObserver(o, k, c) {
      this._o = o;
      this._k = k;
      this._c = c;
      this._v = null;
      this._hv = false;
      this._l = [];
      __super__.call(this);
    }

    ExtremaByObserver.prototype.next = function (x) {
      var key = tryCatch(this._k)(x);
      if (key === errorObj) { return this._o.onError(key.e); }
      var comparison = 0;
      if (!this._hv) {
        this._hv = true;
        this._v = key;
      } else {
        comparison = tryCatch(this._c)(key, this._v);
        if (comparison === errorObj) { return this._o.onError(comparison.e); }
      }
      if (comparison > 0) {
        this._v = key;
        this._l = [];
      }
      if (comparison >= 0) { this._l.push(x); }
    };

    ExtremaByObserver.prototype.error = function (e) {
      this._o.onError(e);
    };

    ExtremaByObserver.prototype.completed = function () {
      this._o.onNext(this._l);
      this._o.onCompleted();
    };

    return ExtremaByObserver;
  }(AbstractObserver));

  function firstOnly(x) {
    if (x.length === 0) { throw new EmptyError(); }
    return x[0];
  }

  var ReduceObservable = (function(__super__) {
    inherits(ReduceObservable, __super__);
    function ReduceObservable(source, accumulator, hasSeed, seed) {
      this.source = source;
      this.accumulator = accumulator;
      this.hasSeed = hasSeed;
      this.seed = seed;
      __super__.call(this);
    }

    ReduceObservable.prototype.subscribeCore = function(observer) {
      return this.source.subscribe(new ReduceObserver(observer,this));
    };

    return ReduceObservable;
  }(ObservableBase));

  var ReduceObserver = (function (__super__) {
    inherits(ReduceObserver, __super__);
    function ReduceObserver(o, parent) {
      this._o = o;
      this._p = parent;
      this._fn = parent.accumulator;
      this._hs = parent.hasSeed;
      this._s = parent.seed;
      this._ha = false;
      this._a = null;
      this._hv = false;
      this._i = 0;
      __super__.call(this);
    }

    ReduceObserver.prototype.next = function (x) {
      !this._hv && (this._hv = true);
      if (this._ha) {
        this._a = tryCatch(this._fn)(this._a, x, this._i, this._p);
      } else {
        this._a = this._hs ? tryCatch(this._fn)(this._s, x, this._i, this._p) : x;
        this._ha = true;
      }
      if (this._a === errorObj) { return this._o.onError(this._a.e); }
      this._i++;
    };

    ReduceObserver.prototype.error = function (e) {
      this._o.onError(e);
    };

    ReduceObserver.prototype.completed = function () {
      this._hv && this._o.onNext(this._a);
      !this._hv && this._hs && this._o.onNext(this._s);
      !this._hv && !this._hs && this._o.onError(new EmptyError());
      this._o.onCompleted();
    };

    return ReduceObserver;
  }(AbstractObserver));

  /**
  * Applies an accumulator function over an observable sequence, returning the result of the aggregation as a single element in the result sequence. The specified seed value is used as the initial accumulator value.
  * For aggregation behavior with incremental intermediate results, see Observable.scan.
  * @param {Function} accumulator An accumulator function to be invoked on each element.
  * @param {Any} [seed] The initial accumulator value.
  * @returns {Observable} An observable sequence containing a single element with the final accumulator value.
  */
  observableProto.reduce = function () {
    var hasSeed = false, seed, accumulator = arguments[0];
    if (arguments.length === 2) {
      hasSeed = true;
      seed = arguments[1];
    }
    return new ReduceObservable(this, accumulator, hasSeed, seed);
  };

  var SomeObservable = (function (__super__) {
    inherits(SomeObservable, __super__);
    function SomeObservable(source, fn) {
      this.source = source;
      this._fn = fn;
      __super__.call(this);
    }

    SomeObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new SomeObserver(o, this._fn, this.source));
    };

    return SomeObservable;
  }(ObservableBase));

  var SomeObserver = (function (__super__) {
    inherits(SomeObserver, __super__);

    function SomeObserver(o, fn, s) {
      this._o = o;
      this._fn = fn;
      this._s = s;
      this._i = 0;
      __super__.call(this);
    }

    SomeObserver.prototype.next = function (x) {
      var result = tryCatch(this._fn)(x, this._i++, this._s);
      if (result === errorObj) { return this._o.onError(result.e); }
      if (Boolean(result)) {
        this._o.onNext(true);
        this._o.onCompleted();
      }
    };
    SomeObserver.prototype.error = function (e) { this._o.onError(e); };
    SomeObserver.prototype.completed = function () {
      this._o.onNext(false);
      this._o.onCompleted();
    };

    return SomeObserver;
  }(AbstractObserver));

  /**
   * Determines whether any element of an observable sequence satisfies a condition if present, else if any items are in the sequence.
   * @param {Function} [predicate] A function to test each element for a condition.
   * @returns {Observable} An observable sequence containing a single element determining whether any elements in the source sequence pass the test in the specified predicate if given, else if any items are in the sequence.
   */
  observableProto.some = function (predicate, thisArg) {
    var fn = bindCallback(predicate, thisArg, 3);
    return new SomeObservable(this, fn);
  };

  var IsEmptyObservable = (function (__super__) {
    inherits(IsEmptyObservable, __super__);
    function IsEmptyObservable(source) {
      this.source = source;
      __super__.call(this);
    }

    IsEmptyObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new IsEmptyObserver(o));
    };

    return IsEmptyObservable;
  }(ObservableBase));

  var IsEmptyObserver = (function(__super__) {
    inherits(IsEmptyObserver, __super__);
    function IsEmptyObserver(o) {
      this._o = o;
      __super__.call(this);
    }

    IsEmptyObserver.prototype.next = function () {
      this._o.onNext(false);
      this._o.onCompleted();
    };
    IsEmptyObserver.prototype.error = function (e) { this._o.onError(e); };
    IsEmptyObserver.prototype.completed = function () {
      this._o.onNext(true);
      this._o.onCompleted();
    };

    return IsEmptyObserver;
  }(AbstractObserver));

  /**
   * Determines whether an observable sequence is empty.
   * @returns {Observable} An observable sequence containing a single element determining whether the source sequence is empty.
   */
  observableProto.isEmpty = function () {
    return new IsEmptyObservable(this);
  };

  var EveryObservable = (function (__super__) {
    inherits(EveryObservable, __super__);
    function EveryObservable(source, fn) {
      this.source = source;
      this._fn = fn;
      __super__.call(this);
    }

    EveryObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new EveryObserver(o, this._fn, this.source));
    };

    return EveryObservable;
  }(ObservableBase));

  var EveryObserver = (function (__super__) {
    inherits(EveryObserver, __super__);

    function EveryObserver(o, fn, s) {
      this._o = o;
      this._fn = fn;
      this._s = s;
      this._i = 0;
      __super__.call(this);
    }

    EveryObserver.prototype.next = function (x) {
      var result = tryCatch(this._fn)(x, this._i++, this._s);
      if (result === errorObj) { return this._o.onError(result.e); }
      if (!Boolean(result)) {
        this._o.onNext(false);
        this._o.onCompleted();
      }
    };
    EveryObserver.prototype.error = function (e) { this._o.onError(e); };
    EveryObserver.prototype.completed = function () {
      this._o.onNext(true);
      this._o.onCompleted();
    };

    return EveryObserver;
  }(AbstractObserver));

  /**
   * Determines whether all elements of an observable sequence satisfy a condition.
   * @param {Function} [predicate] A function to test each element for a condition.
   * @param {Any} [thisArg] Object to use as this when executing callback.
   * @returns {Observable} An observable sequence containing a single element determining whether all elements in the source sequence pass the test in the specified predicate.
   */
  observableProto.every = function (predicate, thisArg) {
    var fn = bindCallback(predicate, thisArg, 3);
    return new EveryObservable(this, fn);
  };

  var IncludesObservable = (function (__super__) {
    inherits(IncludesObservable, __super__);
    function IncludesObservable(source, elem, idx) {
      var n = +idx || 0;
      Math.abs(n) === Infinity && (n = 0);

      this.source = source;
      this._elem = elem;
      this._n = n;
      __super__.call(this);
    }

    IncludesObservable.prototype.subscribeCore = function (o) {
      if (this._n < 0) {
        o.onNext(false);
        o.onCompleted();
        return disposableEmpty;
      }

      return this.source.subscribe(new IncludesObserver(o, this._elem, this._n));
    };

    return IncludesObservable;
  }(ObservableBase));

  var IncludesObserver = (function (__super__) {
    inherits(IncludesObserver, __super__);
    function IncludesObserver(o, elem, n) {
      this._o = o;
      this._elem = elem;
      this._n = n;
      this._i = 0;
      __super__.call(this);
    }

    function comparer(a, b) {
      return (a === 0 && b === 0) || (a === b || (isNaN(a) && isNaN(b)));
    }

    IncludesObserver.prototype.next = function (x) {
      if (this._i++ >= this._n && comparer(x, this._elem)) {
        this._o.onNext(true);
        this._o.onCompleted();
      }
    };
    IncludesObserver.prototype.error = function (e) { this._o.onError(e); };
    IncludesObserver.prototype.completed = function () { this._o.onNext(false); this._o.onCompleted(); };

    return IncludesObserver;
  }(AbstractObserver));

  /**
   * Determines whether an observable sequence includes a specified element with an optional equality comparer.
   * @param searchElement The value to locate in the source sequence.
   * @param {Number} [fromIndex] An equality comparer to compare elements.
   * @returns {Observable} An observable sequence containing a single element determining whether the source sequence includes an element that has the specified value from the given index.
   */
  observableProto.includes = function (searchElement, fromIndex) {
    return new IncludesObservable(this, searchElement, fromIndex);
  };

  var CountObservable = (function (__super__) {
    inherits(CountObservable, __super__);
    function CountObservable(source, fn) {
      this.source = source;
      this._fn = fn;
      __super__.call(this);
    }

    CountObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new CountObserver(o, this._fn, this.source));
    };

    return CountObservable;
  }(ObservableBase));

  var CountObserver = (function (__super__) {
    inherits(CountObserver, __super__);

    function CountObserver(o, fn, s) {
      this._o = o;
      this._fn = fn;
      this._s = s;
      this._i = 0;
      this._c = 0;
      __super__.call(this);
    }

    CountObserver.prototype.next = function (x) {
      if (this._fn) {
        var result = tryCatch(this._fn)(x, this._i++, this._s);
        if (result === errorObj) { return this._o.onError(result.e); }
        Boolean(result) && (this._c++);
      } else {
        this._c++;
      }
    };
    CountObserver.prototype.error = function (e) { this._o.onError(e); };
    CountObserver.prototype.completed = function () {
      this._o.onNext(this._c);
      this._o.onCompleted();
    };

    return CountObserver;
  }(AbstractObserver));

  /**
   * Returns an observable sequence containing a value that represents how many elements in the specified observable sequence satisfy a condition if provided, else the count of items.
   * @example
   * res = source.count();
   * res = source.count(function (x) { return x > 3; });
   * @param {Function} [predicate]A function to test each element for a condition.
   * @param {Any} [thisArg] Object to use as this when executing callback.
   * @returns {Observable} An observable sequence containing a single element with a number that represents how many elements in the input sequence satisfy the condition in the predicate function if provided, else the count of items in the sequence.
   */
  observableProto.count = function (predicate, thisArg) {
    var fn = bindCallback(predicate, thisArg, 3);
    return new CountObservable(this, fn);
  };

  var IndexOfObservable = (function (__super__) {
    inherits(IndexOfObservable, __super__);
    function IndexOfObservable(source, e, n) {
      this.source = source;
      this._e = e;
      this._n = n;
      __super__.call(this);
    }

    IndexOfObservable.prototype.subscribeCore = function (o) {
      if (this._n < 0) {
        o.onNext(-1);
        o.onCompleted();
        return disposableEmpty;
      }

      return this.source.subscribe(new IndexOfObserver(o, this._e, this._n));
    };

    return IndexOfObservable;
  }(ObservableBase));

  var IndexOfObserver = (function (__super__) {
    inherits(IndexOfObserver, __super__);
    function IndexOfObserver(o, e, n) {
      this._o = o;
      this._e = e;
      this._n = n;
      this._i = 0;
      __super__.call(this);
    }

    IndexOfObserver.prototype.next = function (x) {
      if (this._i >= this._n && x === this._e) {
        this._o.onNext(this._i);
        this._o.onCompleted();
      }
      this._i++;
    };
    IndexOfObserver.prototype.error = function (e) { this._o.onError(e); };
    IndexOfObserver.prototype.completed = function () { this._o.onNext(-1); this._o.onCompleted(); };

    return IndexOfObserver;
  }(AbstractObserver));

  /**
   * Returns the first index at which a given element can be found in the observable sequence, or -1 if it is not present.
   * @param {Any} searchElement Element to locate in the array.
   * @param {Number} [fromIndex] The index to start the search.  If not specified, defaults to 0.
   * @returns {Observable} And observable sequence containing the first index at which a given element can be found in the observable sequence, or -1 if it is not present.
   */
  observableProto.indexOf = function(searchElement, fromIndex) {
    var n = +fromIndex || 0;
    Math.abs(n) === Infinity && (n = 0);
    return new IndexOfObservable(this, searchElement, n);
  };

  var SumObservable = (function (__super__) {
    inherits(SumObservable, __super__);
    function SumObservable(source, fn) {
      this.source = source;
      this._fn = fn;
      __super__.call(this);
    }

    SumObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new SumObserver(o, this._fn, this.source));
    };

    return SumObservable;
  }(ObservableBase));

  var SumObserver = (function (__super__) {
    inherits(SumObserver, __super__);

    function SumObserver(o, fn, s) {
      this._o = o;
      this._fn = fn;
      this._s = s;
      this._i = 0;
      this._c = 0;
      __super__.call(this);
    }

    SumObserver.prototype.next = function (x) {
      if (this._fn) {
        var result = tryCatch(this._fn)(x, this._i++, this._s);
        if (result === errorObj) { return this._o.onError(result.e); }
        this._c += result;
      } else {
        this._c += x;
      }
    };
    SumObserver.prototype.error = function (e) { this._o.onError(e); };
    SumObserver.prototype.completed = function () {
      this._o.onNext(this._c);
      this._o.onCompleted();
    };

    return SumObserver;
  }(AbstractObserver));

  /**
   * Computes the sum of a sequence of values that are obtained by invoking an optional transform function on each element of the input sequence, else if not specified computes the sum on each item in the sequence.
   * @param {Function} [selector] A transform function to apply to each element.
   * @param {Any} [thisArg] Object to use as this when executing callback.
   * @returns {Observable} An observable sequence containing a single element with the sum of the values in the source sequence.
   */
  observableProto.sum = function (keySelector, thisArg) {
    var fn = bindCallback(keySelector, thisArg, 3);
    return new SumObservable(this, fn);
  };

  /**
   * Returns the elements in an observable sequence with the minimum key value according to the specified comparer.
   * @example
   * var res = source.minBy(function (x) { return x.value; });
   * var res = source.minBy(function (x) { return x.value; }, function (x, y) { return x - y; });
   * @param {Function} keySelector Key selector function.
   * @param {Function} [comparer] Comparer used to compare key values.
   * @returns {Observable} An observable sequence containing a list of zero or more elements that have a minimum key value.
   */
  observableProto.minBy = function (keySelector, comparer) {
    comparer || (comparer = defaultSubComparer);
    return new ExtremaByObservable(this, keySelector, function (x, y) { return comparer(x, y) * -1; });
  };

  /**
   * Returns the minimum element in an observable sequence according to the optional comparer else a default greater than less than check.
   * @example
   * var res = source.min();
   * var res = source.min(function (x, y) { return x.value - y.value; });
   * @param {Function} [comparer] Comparer used to compare elements.
   * @returns {Observable} An observable sequence containing a single element with the minimum element in the source sequence.
   */
  observableProto.min = function (comparer) {
    return this.minBy(identity, comparer).map(firstOnly);
  };

  /**
   * Returns the elements in an observable sequence with the maximum  key value according to the specified comparer.
   * @example
   * var res = source.maxBy(function (x) { return x.value; });
   * var res = source.maxBy(function (x) { return x.value; }, function (x, y) { return x - y;; });
   * @param {Function} keySelector Key selector function.
   * @param {Function} [comparer]  Comparer used to compare key values.
   * @returns {Observable} An observable sequence containing a list of zero or more elements that have a maximum key value.
   */
  observableProto.maxBy = function (keySelector, comparer) {
    comparer || (comparer = defaultSubComparer);
    return new ExtremaByObservable(this, keySelector, comparer);
  };

  /**
   * Returns the maximum value in an observable sequence according to the specified comparer.
   * @example
   * var res = source.max();
   * var res = source.max(function (x, y) { return x.value - y.value; });
   * @param {Function} [comparer] Comparer used to compare elements.
   * @returns {Observable} An observable sequence containing a single element with the maximum element in the source sequence.
   */
  observableProto.max = function (comparer) {
    return this.maxBy(identity, comparer).map(firstOnly);
  };

  var AverageObservable = (function (__super__) {
    inherits(AverageObservable, __super__);
    function AverageObservable(source, fn) {
      this.source = source;
      this._fn = fn;
      __super__.call(this);
    }

    AverageObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new AverageObserver(o, this._fn, this.source));
    };

    return AverageObservable;
  }(ObservableBase));

  var AverageObserver = (function(__super__) {
    inherits(AverageObserver, __super__);
    function AverageObserver(o, fn, s) {
      this._o = o;
      this._fn = fn;
      this._s = s;
      this._c = 0;
      this._t = 0;
      __super__.call(this);
    }

    AverageObserver.prototype.next = function (x) {
      if(this._fn) {
        var r = tryCatch(this._fn)(x, this._c++, this._s);
        if (r === errorObj) { return this._o.onError(r.e); }
        this._t += r;
      } else {
        this._c++;
        this._t += x;
      }
    };
    AverageObserver.prototype.error = function (e) { this._o.onError(e); };
    AverageObserver.prototype.completed = function () {
      if (this._c === 0) { return this._o.onError(new EmptyError()); }
      this._o.onNext(this._t / this._c);
      this._o.onCompleted();
    };

    return AverageObserver;
  }(AbstractObserver));

  /**
   * Computes the average of an observable sequence of values that are in the sequence or obtained by invoking a transform function on each element of the input sequence if present.
   * @param {Function} [selector] A transform function to apply to each element.
   * @param {Any} [thisArg] Object to use as this when executing callback.
   * @returns {Observable} An observable sequence containing a single element with the average of the sequence of values.
   */
  observableProto.average = function (keySelector, thisArg) {
    var source = this, fn;
    if (isFunction(keySelector)) {
      fn = bindCallback(keySelector, thisArg, 3);
    }
    return new AverageObservable(source, fn);
  };

  /**
   *  Determines whether two sequences are equal by comparing the elements pairwise using a specified equality comparer.
   *
   * @example
   * var res = res = source.sequenceEqual([1,2,3]);
   * var res = res = source.sequenceEqual([{ value: 42 }], function (x, y) { return x.value === y.value; });
   * 3 - res = source.sequenceEqual(Rx.Observable.returnValue(42));
   * 4 - res = source.sequenceEqual(Rx.Observable.returnValue({ value: 42 }), function (x, y) { return x.value === y.value; });
   * @param {Observable} second Second observable sequence or array to compare.
   * @param {Function} [comparer] Comparer used to compare elements of both sequences.
   * @returns {Observable} An observable sequence that contains a single element which indicates whether both sequences are of equal length and their corresponding elements are equal according to the specified equality comparer.
   */
  observableProto.sequenceEqual = function (second, comparer) {
    var first = this;
    comparer || (comparer = defaultComparer);
    return new AnonymousObservable(function (o) {
      var donel = false, doner = false, ql = [], qr = [];
      var subscription1 = first.subscribe(function (x) {
        if (qr.length > 0) {
          var v = qr.shift();
          var equal = tryCatch(comparer)(v, x);
          if (equal === errorObj) { return o.onError(equal.e); }
          if (!equal) {
            o.onNext(false);
            o.onCompleted();
          }
        } else if (doner) {
          o.onNext(false);
          o.onCompleted();
        } else {
          ql.push(x);
        }
      }, function(e) { o.onError(e); }, function () {
        donel = true;
        if (ql.length === 0) {
          if (qr.length > 0) {
            o.onNext(false);
            o.onCompleted();
          } else if (doner) {
            o.onNext(true);
            o.onCompleted();
          }
        }
      });

      (isArrayLike(second) || isIterable(second)) && (second = observableFrom(second));
      isPromise(second) && (second = observableFromPromise(second));
      var subscription2 = second.subscribe(function (x) {
        if (ql.length > 0) {
          var v = ql.shift();
          var equal = tryCatch(comparer)(v, x);
          if (equal === errorObj) { return o.onError(equal.e); }
          if (!equal) {
            o.onNext(false);
            o.onCompleted();
          }
        } else if (donel) {
          o.onNext(false);
          o.onCompleted();
        } else {
          qr.push(x);
        }
      }, function(e) { o.onError(e); }, function () {
        doner = true;
        if (qr.length === 0) {
          if (ql.length > 0) {
            o.onNext(false);
            o.onCompleted();
          } else if (donel) {
            o.onNext(true);
            o.onCompleted();
          }
        }
      });
      return new BinaryDisposable(subscription1, subscription2);
    }, first);
  };

  var ElementAtObservable = (function (__super__) {
    inherits(ElementAtObservable, __super__);
    function ElementAtObservable(source, i, d) {
      this.source = source;
      this._i = i;
      this._d = d;
      __super__.call(this);
    }

    ElementAtObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new ElementAtObserver(o, this._i, this._d));
    };

    return ElementAtObservable;
  }(ObservableBase));

  var ElementAtObserver = (function (__super__) {
    inherits(ElementAtObserver, __super__);

    function ElementAtObserver(o, i, d) {
      this._o = o;
      this._i = i;
      this._d = d;
      __super__.call(this);
    }

    ElementAtObserver.prototype.next = function (x) {
      if (this._i-- === 0) {
        this._o.onNext(x);
        this._o.onCompleted();
      }
    };
    ElementAtObserver.prototype.error = function (e) { this._o.onError(e); };
    ElementAtObserver.prototype.completed = function () {
      if (this._d === undefined) {
        this._o.onError(new ArgumentOutOfRangeError());
      } else {
        this._o.onNext(this._d);
        this._o.onCompleted();
      }
    };

    return ElementAtObserver;
  }(AbstractObserver));

  /**
   * Returns the element at a specified index in a sequence or default value if not found.
   * @param {Number} index The zero-based index of the element to retrieve.
   * @param {Any} [defaultValue] The default value to use if elementAt does not find a value.
   * @returns {Observable} An observable sequence that produces the element at the specified position in the source sequence.
   */
  observableProto.elementAt =  function (index, defaultValue) {
    if (index < 0) { throw new ArgumentOutOfRangeError(); }
    return new ElementAtObservable(this, index, defaultValue);
  };

  var SingleObserver = (function(__super__) {
    inherits(SingleObserver, __super__);
    function SingleObserver(o, obj, s) {
      this._o = o;
      this._obj = obj;
      this._s = s;
      this._i = 0;
      this._hv = false;
      this._v = null;
      __super__.call(this);
    }

    SingleObserver.prototype.next = function (x) {
      var shouldYield = false;
      if (this._obj.predicate) {
        var res = tryCatch(this._obj.predicate)(x, this._i++, this._s);
        if (res === errorObj) { return this._o.onError(res.e); }
        Boolean(res) && (shouldYield = true);
      } else if (!this._obj.predicate) {
        shouldYield = true;
      }
      if (shouldYield) {
        if (this._hv) {
          return this._o.onError(new Error('Sequence contains more than one matching element'));
        }
        this._hv = true;
        this._v = x;
      }
    };
    SingleObserver.prototype.error = function (e) { this._o.onError(e); };
    SingleObserver.prototype.completed = function () {
      if (this._hv) {
        this._o.onNext(this._v);
        this._o.onCompleted();
      }
      else if (this._obj.defaultValue === undefined) {
        this._o.onError(new EmptyError());
      } else {
        this._o.onNext(this._obj.defaultValue);
        this._o.onCompleted();
      }
    };

    return SingleObserver;
  }(AbstractObserver));


    /**
     * Returns the only element of an observable sequence that satisfies the condition in the optional predicate, and reports an exception if there is not exactly one element in the observable sequence.
     * @returns {Observable} Sequence containing the single element in the observable sequence that satisfies the condition in the predicate.
     */
    observableProto.single = function (predicate, thisArg) {
      var obj = {}, source = this;
      if (typeof arguments[0] === 'object') {
        obj = arguments[0];
      } else {
        obj = {
          predicate: arguments[0],
          thisArg: arguments[1],
          defaultValue: arguments[2]
        };
      }
      if (isFunction (obj.predicate)) {
        var fn = obj.predicate;
        obj.predicate = bindCallback(fn, obj.thisArg, 3);
      }
      return new AnonymousObservable(function (o) {
        return source.subscribe(new SingleObserver(o, obj, source));
      }, source);
    };

  var FirstObservable = (function (__super__) {
    inherits(FirstObservable, __super__);
    function FirstObservable(source, obj) {
      this.source = source;
      this._obj = obj;
      __super__.call(this);
    }

    FirstObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new FirstObserver(o, this._obj, this.source));
    };

    return FirstObservable;
  }(ObservableBase));

  var FirstObserver = (function(__super__) {
    inherits(FirstObserver, __super__);
    function FirstObserver(o, obj, s) {
      this._o = o;
      this._obj = obj;
      this._s = s;
      this._i = 0;
      __super__.call(this);
    }

    FirstObserver.prototype.next = function (x) {
      if (this._obj.predicate) {
        var res = tryCatch(this._obj.predicate)(x, this._i++, this._s);
        if (res === errorObj) { return this._o.onError(res.e); }
        if (Boolean(res)) {
          this._o.onNext(x);
          this._o.onCompleted();
        }
      } else if (!this._obj.predicate) {
        this._o.onNext(x);
        this._o.onCompleted();
      }
    };
    FirstObserver.prototype.error = function (e) { this._o.onError(e); };
    FirstObserver.prototype.completed = function () {
      if (this._obj.defaultValue === undefined) {
        this._o.onError(new EmptyError());
      } else {
        this._o.onNext(this._obj.defaultValue);
        this._o.onCompleted();
      }
    };

    return FirstObserver;
  }(AbstractObserver));

  /**
   * Returns the first element of an observable sequence that satisfies the condition in the predicate if present else the first item in the sequence.
   * @returns {Observable} Sequence containing the first element in the observable sequence that satisfies the condition in the predicate if provided, else the first item in the sequence.
   */
  observableProto.first = function () {
    var obj = {}, source = this;
    if (typeof arguments[0] === 'object') {
      obj = arguments[0];
    } else {
      obj = {
        predicate: arguments[0],
        thisArg: arguments[1],
        defaultValue: arguments[2]
      };
    }
    if (isFunction (obj.predicate)) {
      var fn = obj.predicate;
      obj.predicate = bindCallback(fn, obj.thisArg, 3);
    }
    return new FirstObservable(this, obj);
  };

  var LastObservable = (function (__super__) {
    inherits(LastObservable, __super__);
    function LastObservable(source, obj) {
      this.source = source;
      this._obj = obj;
      __super__.call(this);
    }

    LastObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new LastObserver(o, this._obj, this.source));
    };

    return LastObservable;
  }(ObservableBase));

  var LastObserver = (function(__super__) {
    inherits(LastObserver, __super__);
    function LastObserver(o, obj, s) {
      this._o = o;
      this._obj = obj;
      this._s = s;
      this._i = 0;
      this._hv = false;
      this._v = null;
      __super__.call(this);
    }

    LastObserver.prototype.next = function (x) {
      var shouldYield = false;
      if (this._obj.predicate) {
        var res = tryCatch(this._obj.predicate)(x, this._i++, this._s);
        if (res === errorObj) { return this._o.onError(res.e); }
        Boolean(res) && (shouldYield = true);
      } else if (!this._obj.predicate) {
        shouldYield = true;
      }
      if (shouldYield) {
        this._hv = true;
        this._v = x;
      }
    };
    LastObserver.prototype.error = function (e) { this._o.onError(e); };
    LastObserver.prototype.completed = function () {
      if (this._hv) {
        this._o.onNext(this._v);
        this._o.onCompleted();
      }
      else if (this._obj.defaultValue === undefined) {
        this._o.onError(new EmptyError());
      } else {
        this._o.onNext(this._obj.defaultValue);
        this._o.onCompleted();
      }
    };

    return LastObserver;
  }(AbstractObserver));

  /**
   * Returns the last element of an observable sequence that satisfies the condition in the predicate if specified, else the last element.
   * @returns {Observable} Sequence containing the last element in the observable sequence that satisfies the condition in the predicate.
   */
  observableProto.last = function () {
    var obj = {}, source = this;
    if (typeof arguments[0] === 'object') {
      obj = arguments[0];
    } else {
      obj = {
        predicate: arguments[0],
        thisArg: arguments[1],
        defaultValue: arguments[2]
      };
    }
    if (isFunction (obj.predicate)) {
      var fn = obj.predicate;
      obj.predicate = bindCallback(fn, obj.thisArg, 3);
    }
    return new LastObservable(this, obj);
  };

  var FindValueObserver = (function(__super__) {
    inherits(FindValueObserver, __super__);
    function FindValueObserver(observer, source, callback, yieldIndex) {
      this._o = observer;
      this._s = source;
      this._cb = callback;
      this._y = yieldIndex;
      this._i = 0;
      __super__.call(this);
    }

    FindValueObserver.prototype.next = function (x) {
      var shouldRun = tryCatch(this._cb)(x, this._i, this._s);
      if (shouldRun === errorObj) { return this._o.onError(shouldRun.e); }
      if (shouldRun) {
        this._o.onNext(this._y ? this._i : x);
        this._o.onCompleted();
      } else {
        this._i++;
      }
    };

    FindValueObserver.prototype.error = function (e) {
      this._o.onError(e);
    };

    FindValueObserver.prototype.completed = function () {
      this._y && this._o.onNext(-1);
      this._o.onCompleted();
    };

    return FindValueObserver;
  }(AbstractObserver));

  function findValue (source, predicate, thisArg, yieldIndex) {
    var callback = bindCallback(predicate, thisArg, 3);
    return new AnonymousObservable(function (o) {
      return source.subscribe(new FindValueObserver(o, source, callback, yieldIndex));
    }, source);
  }

  /**
   * Searches for an element that matches the conditions defined by the specified predicate, and returns the first occurrence within the entire Observable sequence.
   * @param {Function} predicate The predicate that defines the conditions of the element to search for.
   * @param {Any} [thisArg] Object to use as `this` when executing the predicate.
   * @returns {Observable} An Observable sequence with the first element that matches the conditions defined by the specified predicate, if found; otherwise, undefined.
   */
  observableProto.find = function (predicate, thisArg) {
    return findValue(this, predicate, thisArg, false);
  };

  /**
   * Searches for an element that matches the conditions defined by the specified predicate, and returns
   * an Observable sequence with the zero-based index of the first occurrence within the entire Observable sequence.
   * @param {Function} predicate The predicate that defines the conditions of the element to search for.
   * @param {Any} [thisArg] Object to use as `this` when executing the predicate.
   * @returns {Observable} An Observable sequence with the zero-based index of the first occurrence of an element that matches the conditions defined by match, if found; otherwise, –1.
  */
  observableProto.findIndex = function (predicate, thisArg) {
    return findValue(this, predicate, thisArg, true);
  };

  var ToSetObservable = (function (__super__) {
    inherits(ToSetObservable, __super__);
    function ToSetObservable(source) {
      this.source = source;
      __super__.call(this);
    }

    ToSetObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new ToSetObserver(o));
    };

    return ToSetObservable;
  }(ObservableBase));

  var ToSetObserver = (function (__super__) {
    inherits(ToSetObserver, __super__);
    function ToSetObserver(o) {
      this._o = o;
      this._s = new root.Set();
      __super__.call(this);
    }

    ToSetObserver.prototype.next = function (x) {
      this._s.add(x);
    };

    ToSetObserver.prototype.error = function (e) {
      this._o.onError(e);
    };

    ToSetObserver.prototype.completed = function () {
      this._o.onNext(this._s);
      this._o.onCompleted();
    };

    return ToSetObserver;
  }(AbstractObserver));

  /**
   * Converts the observable sequence to a Set if it exists.
   * @returns {Observable} An observable sequence with a single value of a Set containing the values from the observable sequence.
   */
  observableProto.toSet = function () {
    if (typeof root.Set === 'undefined') { throw new TypeError(); }
    return new ToSetObservable(this);
  };

  var ToMapObservable = (function (__super__) {
    inherits(ToMapObservable, __super__);
    function ToMapObservable(source, k, e) {
      this.source = source;
      this._k = k;
      this._e = e;
      __super__.call(this);
    }

    ToMapObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new ToMapObserver(o, this._k, this._e));
    };

    return ToMapObservable;
  }(ObservableBase));

  var ToMapObserver = (function (__super__) {
    inherits(ToMapObserver, __super__);
    function ToMapObserver(o, k, e) {
      this._o = o;
      this._k = k;
      this._e = e;
      this._m = new root.Map();
      __super__.call(this);
    }

    ToMapObserver.prototype.next = function (x) {
      var key = tryCatch(this._k)(x);
      if (key === errorObj) { return this._o.onError(key.e); }
      var elem = x;
      if (this._e) {
        elem = tryCatch(this._e)(x);
        if (elem === errorObj) { return this._o.onError(elem.e); }
      }

      this._m.set(key, elem);
    };

    ToMapObserver.prototype.error = function (e) {
      this._o.onError(e);
    };

    ToMapObserver.prototype.completed = function () {
      this._o.onNext(this._m);
      this._o.onCompleted();
    };

    return ToMapObserver;
  }(AbstractObserver));

  /**
  * Converts the observable sequence to a Map if it exists.
  * @param {Function} keySelector A function which produces the key for the Map.
  * @param {Function} [elementSelector] An optional function which produces the element for the Map. If not present, defaults to the value from the observable sequence.
  * @returns {Observable} An observable sequence with a single value of a Map containing the values from the observable sequence.
  */
  observableProto.toMap = function (keySelector, elementSelector) {
    if (typeof root.Map === 'undefined') { throw new TypeError(); }
    return new ToMapObservable(this, keySelector, elementSelector);
  };

  var SliceObservable = (function (__super__) {
    inherits(SliceObservable, __super__);
    function SliceObservable(source, b, e) {
      this.source = source;
      this._b = b;
      this._e = e;
      __super__.call(this);
    }

    SliceObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new SliceObserver(o, this._b, this._e));
    };

    return SliceObservable;
  }(ObservableBase));

  var SliceObserver = (function (__super__) {
    inherits(SliceObserver, __super__);

    function SliceObserver(o, b, e) {
      this._o = o;
      this._b = b;
      this._e = e;
      this._i = 0;
      __super__.call(this);
    }

    SliceObserver.prototype.next = function (x) {
      if (this._i >= this._b) {
        if (this._e === this._i) {
          this._o.onCompleted();
        } else {
          this._o.onNext(x);
        }
      }
      this._i++;
    };
    SliceObserver.prototype.error = function (e) { this._o.onError(e); };
    SliceObserver.prototype.completed = function () { this._o.onCompleted(); };

    return SliceObserver;
  }(AbstractObserver));

  /*
  * The slice() method returns a shallow copy of a portion of an Observable into a new Observable object.
  * Unlike the array version, this does not support negative numbers for being or end.
  * @param {Number} [begin] Zero-based index at which to begin extraction. If omitted, this will default to zero.
  * @param {Number} [end] Zero-based index at which to end extraction. slice extracts up to but not including end.
  * If omitted, this will emit the rest of the Observable object.
  * @returns {Observable} A shallow copy of a portion of an Observable into a new Observable object.
  */
  observableProto.slice = function (begin, end) {
    var start = begin || 0;
    if (start < 0) { throw new Rx.ArgumentOutOfRangeError(); }
    if (typeof end === 'number' && end < start) {
      throw new Rx.ArgumentOutOfRangeError();
    }
    return new SliceObservable(this, start, end);
  };

  var LastIndexOfObservable = (function (__super__) {
    inherits(LastIndexOfObservable, __super__);
    function LastIndexOfObservable(source, e, n) {
      this.source = source;
      this._e = e;
      this._n = n;
      __super__.call(this);
    }

    LastIndexOfObservable.prototype.subscribeCore = function (o) {
      if (this._n < 0) {
        o.onNext(-1);
        o.onCompleted();
        return disposableEmpty;
      }

      return this.source.subscribe(new LastIndexOfObserver(o, this._e, this._n));
    };

    return LastIndexOfObservable;
  }(ObservableBase));

  var LastIndexOfObserver = (function (__super__) {
    inherits(LastIndexOfObserver, __super__);
    function LastIndexOfObserver(o, e, n) {
      this._o = o;
      this._e = e;
      this._n = n;
      this._v = 0;
      this._hv = false;
      this._i = 0;
      __super__.call(this);
    }

    LastIndexOfObserver.prototype.next = function (x) {
      if (this._i >= this._n && x === this._e) {
        this._hv = true;
        this._v = this._i;
      }
      this._i++;
    };
    LastIndexOfObserver.prototype.error = function (e) { this._o.onError(e); };
    LastIndexOfObserver.prototype.completed = function () {
      if (this._hv) {
        this._o.onNext(this._v);
      } else {
        this._o.onNext(-1);
      }
      this._o.onCompleted();
    };

    return LastIndexOfObserver;
  }(AbstractObserver));

  /**
   * Returns the last index at which a given element can be found in the observable sequence, or -1 if it is not present.
   * @param {Any} searchElement Element to locate in the array.
   * @param {Number} [fromIndex] The index to start the search.  If not specified, defaults to 0.
   * @returns {Observable} And observable sequence containing the last index at which a given element can be found in the observable sequence, or -1 if it is not present.
   */
  observableProto.lastIndexOf = function(searchElement, fromIndex) {
    var n = +fromIndex || 0;
    Math.abs(n) === Infinity && (n = 0);
    return new LastIndexOfObservable(this, searchElement, n);
  };

  Observable.wrap = function (fn) {
    function createObservable() {
      return Observable.spawn.call(this, fn.apply(this, arguments));
    }

    createObservable.__generatorFunction__ = fn;
    return createObservable;
  };

  var spawn = Observable.spawn = function () {
    var gen = arguments[0], self = this, args = [];
    for (var i = 1, len = arguments.length; i < len; i++) { args.push(arguments[i]); }

    return new AnonymousObservable(function (o) {
      var g = new CompositeDisposable();

      if (isFunction(gen)) { gen = gen.apply(self, args); }
      if (!gen || !isFunction(gen.next)) {
        o.onNext(gen);
        return o.onCompleted();
      }

      function processGenerator(res) {
        var ret = tryCatch(gen.next).call(gen, res);
        if (ret === errorObj) { return o.onError(ret.e); }
        next(ret);
      }

      processGenerator();

      function onError(err) {
        var ret = tryCatch(gen.next).call(gen, err);
        if (ret === errorObj) { return o.onError(ret.e); }
        next(ret);
      }

      function next(ret) {
        if (ret.done) {
          o.onNext(ret.value);
          o.onCompleted();
          return;
        }
        var obs = toObservable.call(self, ret.value);
        var value = null;
        var hasValue = false;
        if (Observable.isObservable(obs)) {
          g.add(obs.subscribe(function(val) {
            hasValue = true;
            value = val;
          }, onError, function() {
            hasValue && processGenerator(value);
          }));
        } else {
          onError(new TypeError('type not supported'));
        }
      }

      return g;
    });
  };

  function toObservable(obj) {
    if (!obj) { return obj; }
    if (Observable.isObservable(obj)) { return obj; }
    if (isPromise(obj)) { return Observable.fromPromise(obj); }
    if (isGeneratorFunction(obj) || isGenerator(obj)) { return spawn.call(this, obj); }
    if (isFunction(obj)) { return thunkToObservable.call(this, obj); }
    if (isArrayLike(obj) || isIterable(obj)) { return arrayToObservable.call(this, obj); }
    if (isObject(obj)) {return objectToObservable.call(this, obj);}
    return obj;
  }

  function arrayToObservable (obj) {
    return Observable.from(obj).concatMap(function(o) {
      if(Observable.isObservable(o) || isObject(o)) {
        return toObservable.call(null, o);
      } else {
        return Rx.Observable.just(o);
      }
    }).toArray();
  }

  function objectToObservable (obj) {
    var results = new obj.constructor(), keys = Object.keys(obj), observables = [];
    for (var i = 0, len = keys.length; i < len; i++) {
      var key = keys[i];
      var observable = toObservable.call(this, obj[key]);

      if(observable && Observable.isObservable(observable)) {
        defer(observable, key);
      } else {
        results[key] = obj[key];
      }
    }

    return Observable.forkJoin.apply(Observable, observables).map(function() {
      return results;
    });


    function defer (observable, key) {
      results[key] = undefined;
      observables.push(observable.map(function (next) {
        results[key] = next;
      }));
    }
  }

  function thunkToObservable(fn) {
    var self = this;
    return new AnonymousObservable(function (o) {
      fn.call(self, function () {
        var err = arguments[0], res = arguments[1];
        if (err) { return o.onError(err); }
        if (arguments.length > 2) {
          var args = [];
          for (var i = 1, len = arguments.length; i < len; i++) { args.push(arguments[i]); }
          res = args;
        }
        o.onNext(res);
        o.onCompleted();
      });
    });
  }

  function isGenerator(obj) {
    return isFunction (obj.next) && isFunction (obj['throw']);
  }

  function isGeneratorFunction(obj) {
    var ctor = obj.constructor;
    if (!ctor) { return false; }
    if (ctor.name === 'GeneratorFunction' || ctor.displayName === 'GeneratorFunction') { return true; }
    return isGenerator(ctor.prototype);
  }

  function isObject(val) {
    return Object == val.constructor;
  }

  /**
   * Invokes the specified function asynchronously on the specified scheduler, surfacing the result through an observable sequence.
   *
   * @example
   * var res = Rx.Observable.start(function () { console.log('hello'); });
   * var res = Rx.Observable.start(function () { console.log('hello'); }, Rx.Scheduler.timeout);
   * var res = Rx.Observable.start(function () { this.log('hello'); }, Rx.Scheduler.timeout, console);
   *
   * @param {Function} func Function to run asynchronously.
   * @param {Scheduler} [scheduler]  Scheduler to run the function on. If not specified, defaults to Scheduler.timeout.
   * @param [context]  The context for the func parameter to be executed.  If not specified, defaults to undefined.
   * @returns {Observable} An observable sequence exposing the function's result value, or an exception.
   *
   * Remarks
   * * The function is called immediately, not during the subscription of the resulting sequence.
   * * Multiple subscriptions to the resulting sequence can observe the function's result.
   */
  Observable.start = function (func, context, scheduler) {
    return observableToAsync(func, context, scheduler)();
  };

  /**
   * Converts the function into an asynchronous function. Each invocation of the resulting asynchronous function causes an invocation of the original synchronous function on the specified scheduler.
   * @param {Function} function Function to convert to an asynchronous function.
   * @param {Scheduler} [scheduler] Scheduler to run the function on. If not specified, defaults to Scheduler.timeout.
   * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
   * @returns {Function} Asynchronous function.
   */
  var observableToAsync = Observable.toAsync = function (func, context, scheduler) {
    isScheduler(scheduler) || (scheduler = defaultScheduler);
    return function () {
      var args = arguments,
        subject = new AsyncSubject();

      scheduler.schedule(null, function () {
        var result;
        try {
          result = func.apply(context, args);
        } catch (e) {
          subject.onError(e);
          return;
        }
        subject.onNext(result);
        subject.onCompleted();
      });
      return subject.asObservable();
    };
  };

function createCbObservable(fn, ctx, selector, args) {
  var o = new AsyncSubject();

  args.push(createCbHandler(o, ctx, selector));
  fn.apply(ctx, args);

  return o.asObservable();
}

function createCbHandler(o, ctx, selector) {
  return function handler () {
    var len = arguments.length, results = new Array(len);
    for(var i = 0; i < len; i++) { results[i] = arguments[i]; }

    if (isFunction(selector)) {
      results = tryCatch(selector).apply(ctx, results);
      if (results === errorObj) { return o.onError(results.e); }
      o.onNext(results);
    } else {
      if (results.length <= 1) {
        o.onNext(results[0]);
      } else {
        o.onNext(results);
      }
    }

    o.onCompleted();
  };
}

/**
 * Converts a callback function to an observable sequence.
 *
 * @param {Function} fn Function with a callback as the last parameter to convert to an Observable sequence.
 * @param {Mixed} [ctx] The context for the func parameter to be executed.  If not specified, defaults to undefined.
 * @param {Function} [selector] A selector which takes the arguments from the callback to produce a single item to yield on next.
 * @returns {Function} A function, when executed with the required parameters minus the callback, produces an Observable sequence with a single value of the arguments to the callback as an array.
 */
Observable.fromCallback = function (fn, ctx, selector) {
  return function () {
    typeof ctx === 'undefined' && (ctx = this); 

    var len = arguments.length, args = new Array(len)
    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
    return createCbObservable(fn, ctx, selector, args);
  };
};

function createNodeObservable(fn, ctx, selector, args) {
  var o = new AsyncSubject();

  args.push(createNodeHandler(o, ctx, selector));
  fn.apply(ctx, args);

  return o.asObservable();
}

function createNodeHandler(o, ctx, selector) {
  return function handler () {
    var err = arguments[0];
    if (err) { return o.onError(err); }

    var len = arguments.length, results = [];
    for(var i = 1; i < len; i++) { results[i - 1] = arguments[i]; }

    if (isFunction(selector)) {
      var results = tryCatch(selector).apply(ctx, results);
      if (results === errorObj) { return o.onError(results.e); }
      o.onNext(results);
    } else {
      if (results.length <= 1) {
        o.onNext(results[0]);
      } else {
        o.onNext(results);
      }
    }

    o.onCompleted();
  };
}

/**
 * Converts a Node.js callback style function to an observable sequence.  This must be in function (err, ...) format.
 * @param {Function} fn The function to call
 * @param {Mixed} [ctx] The context for the func parameter to be executed.  If not specified, defaults to undefined.
 * @param {Function} [selector] A selector which takes the arguments from the callback minus the error to produce a single item to yield on next.
 * @returns {Function} An async function which when applied, returns an observable sequence with the callback arguments as an array.
 */
Observable.fromNodeCallback = function (fn, ctx, selector) {
  return function () {
    typeof ctx === 'undefined' && (ctx = this); 
    var len = arguments.length, args = new Array(len);
    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
    return createNodeObservable(fn, ctx, selector, args);
  };
};

  function isNodeList(el) {
    if (root.StaticNodeList) {
      // IE8 Specific
      // instanceof is slower than Object#toString, but Object#toString will not work as intended in IE8
      return el instanceof root.StaticNodeList || el instanceof root.NodeList;
    } else {
      return Object.prototype.toString.call(el) === '[object NodeList]';
    }
  }

  function ListenDisposable(e, n, fn) {
    this._e = e;
    this._n = n;
    this._fn = fn;
    this._e.addEventListener(this._n, this._fn, false);
    this.isDisposed = false;
  }
  ListenDisposable.prototype.dispose = function () {
    if (!this.isDisposed) {
      this._e.removeEventListener(this._n, this._fn, false);
      this.isDisposed = true;
    }
  };

  function createEventListener (el, eventName, handler) {
    var disposables = new CompositeDisposable();

    // Asume NodeList or HTMLCollection
    var elemToString = Object.prototype.toString.call(el);
    if (isNodeList(el) || elemToString === '[object HTMLCollection]') {
      for (var i = 0, len = el.length; i < len; i++) {
        disposables.add(createEventListener(el.item(i), eventName, handler));
      }
    } else if (el) {
      disposables.add(new ListenDisposable(el, eventName, handler));
    }

    return disposables;
  }

  /**
   * Configuration option to determine whether to use native events only
   */
  Rx.config.useNativeEvents = false;

  var EventObservable = (function(__super__) {
    inherits(EventObservable, __super__);
    function EventObservable(el, name, fn) {
      this._el = el;
      this._n = name;
      this._fn = fn;
      __super__.call(this);
    }

    function createHandler(o, fn) {
      return function handler () {
        var results = arguments[0];
        if (isFunction(fn)) {
          results = tryCatch(fn).apply(null, arguments);
          if (results === errorObj) { return o.onError(results.e); }
        }
        o.onNext(results);
      };
    }

    EventObservable.prototype.subscribeCore = function (o) {
      return createEventListener(
        this._el,
        this._n,
        createHandler(o, this._fn));
    };

    return EventObservable;
  }(ObservableBase));

  /**
   * Creates an observable sequence by adding an event listener to the matching DOMElement or each item in the NodeList.
   * @param {Object} element The DOMElement or NodeList to attach a listener.
   * @param {String} eventName The event name to attach the observable sequence.
   * @param {Function} [selector] A selector which takes the arguments from the event handler to produce a single item to yield on next.
   * @returns {Observable} An observable sequence of events from the specified element and the specified event.
   */
  Observable.fromEvent = function (element, eventName, selector) {
    // Node.js specific
    if (element.addListener) {
      return fromEventPattern(
        function (h) { element.addListener(eventName, h); },
        function (h) { element.removeListener(eventName, h); },
        selector);
    }

    // Use only if non-native events are allowed
    if (!Rx.config.useNativeEvents) {
      // Handles jq, Angular.js, Zepto, Marionette, Ember.js
      if (typeof element.on === 'function' && typeof element.off === 'function') {
        return fromEventPattern(
          function (h) { element.on(eventName, h); },
          function (h) { element.off(eventName, h); },
          selector);
      }
    }

    return new EventObservable(element, eventName, selector).publish().refCount();
  };

  var EventPatternObservable = (function(__super__) {
    inherits(EventPatternObservable, __super__);
    function EventPatternObservable(add, del, fn) {
      this._add = add;
      this._del = del;
      this._fn = fn;
      __super__.call(this);
    }

    function createHandler(o, fn) {
      return function handler () {
        var results = arguments[0];
        if (isFunction(fn)) {
          results = tryCatch(fn).apply(null, arguments);
          if (results === errorObj) { return o.onError(results.e); }
        }
        o.onNext(results);
      };
    }

    EventPatternObservable.prototype.subscribeCore = function (o) {
      var fn = createHandler(o, this._fn);
      var returnValue = this._add(fn);
      return new EventPatternDisposable(this._del, fn, returnValue);
    };

    function EventPatternDisposable(del, fn, ret) {
      this._del = del;
      this._fn = fn;
      this._ret = ret;
      this.isDisposed = false;
    }

    EventPatternDisposable.prototype.dispose = function () {
      if(!this.isDisposed) {
        isFunction(this._del) && this._del(this._fn, this._ret);
        this.isDisposed = true;
      }
    };

    return EventPatternObservable;
  }(ObservableBase));

  /**
   * Creates an observable sequence from an event emitter via an addHandler/removeHandler pair.
   * @param {Function} addHandler The function to add a handler to the emitter.
   * @param {Function} [removeHandler] The optional function to remove a handler from an emitter.
   * @param {Function} [selector] A selector which takes the arguments from the event handler to produce a single item to yield on next.
   * @returns {Observable} An observable sequence which wraps an event from an event emitter
   */
  var fromEventPattern = Observable.fromEventPattern = function (addHandler, removeHandler, selector) {
    return new EventPatternObservable(addHandler, removeHandler, selector).publish().refCount();
  };

  /**
   * Invokes the asynchronous function, surfacing the result through an observable sequence.
   * @param {Function} functionAsync Asynchronous function which returns a Promise to run.
   * @returns {Observable} An observable sequence exposing the function's result value, or an exception.
   */
  Observable.startAsync = function (functionAsync) {
    var promise = tryCatch(functionAsync)();
    if (promise === errorObj) { return observableThrow(promise.e); }
    return observableFromPromise(promise);
  };

  var PausableObservable = (function (__super__) {
    inherits(PausableObservable, __super__);
    function PausableObservable(source, pauser) {
      this.source = source;
      this.controller = new Subject();
      this.paused = true;

      if (pauser && pauser.subscribe) {
        this.pauser = this.controller.merge(pauser);
      } else {
        this.pauser = this.controller;
      }

      __super__.call(this);
    }

    PausableObservable.prototype._subscribe = function (o) {
      var conn = this.source.publish(),
        subscription = conn.subscribe(o),
        connection = disposableEmpty;

      var pausable = this.pauser.startWith(!this.paused).distinctUntilChanged().subscribe(function (b) {
        if (b) {
          connection = conn.connect();
        } else {
          connection.dispose();
          connection = disposableEmpty;
        }
      });

      return new NAryDisposable([subscription, connection, pausable]);
    };

    PausableObservable.prototype.pause = function () {
      this.paused = true;
      this.controller.onNext(false);
    };

    PausableObservable.prototype.resume = function () {
      this.paused = false;
      this.controller.onNext(true);
    };

    return PausableObservable;

  }(Observable));

  /**
   * Pauses the underlying observable sequence based upon the observable sequence which yields true/false.
   * @example
   * var pauser = new Rx.Subject();
   * var source = Rx.Observable.interval(100).pausable(pauser);
   * @param {Observable} pauser The observable sequence used to pause the underlying sequence.
   * @returns {Observable} The observable sequence which is paused based upon the pauser.
   */
  observableProto.pausable = function (pauser) {
    return new PausableObservable(this, pauser);
  };

  function combineLatestSource(source, subject, resultSelector) {
    return new AnonymousObservable(function (o) {
      var hasValue = [false, false],
        hasValueAll = false,
        isDone = false,
        values = new Array(2),
        err;

      function next(x, i) {
        values[i] = x;
        hasValue[i] = true;
        if (hasValueAll || (hasValueAll = hasValue.every(identity))) {
          if (err) { return o.onError(err); }
          var res = tryCatch(resultSelector).apply(null, values);
          if (res === errorObj) { return o.onError(res.e); }
          o.onNext(res);
        }
        isDone && values[1] && o.onCompleted();
      }

      return new BinaryDisposable(
        source.subscribe(
          function (x) {
            next(x, 0);
          },
          function (e) {
            if (values[1]) {
              o.onError(e);
            } else {
              err = e;
            }
          },
          function () {
            isDone = true;
            values[1] && o.onCompleted();
          }),
        subject.subscribe(
          function (x) {
            next(x, 1);
          },
          function (e) { o.onError(e); },
          function () {
            isDone = true;
            next(true, 1);
          })
        );
    }, source);
  }

  var PausableBufferedObservable = (function (__super__) {
    inherits(PausableBufferedObservable, __super__);
    function PausableBufferedObservable(source, pauser) {
      this.source = source;
      this.controller = new Subject();
      this.paused = true;

      if (pauser && pauser.subscribe) {
        this.pauser = this.controller.merge(pauser);
      } else {
        this.pauser = this.controller;
      }

      __super__.call(this);
    }

    PausableBufferedObservable.prototype._subscribe = function (o) {
      var q = [], previousShouldFire;

      function drainQueue() { while (q.length > 0) { o.onNext(q.shift()); } }

      var subscription =
        combineLatestSource(
          this.source,
          this.pauser.startWith(!this.paused).distinctUntilChanged(),
          function (data, shouldFire) {
            return { data: data, shouldFire: shouldFire };
          })
          .subscribe(
            function (results) {
              if (previousShouldFire !== undefined && results.shouldFire !== previousShouldFire) {
                previousShouldFire = results.shouldFire;
                // change in shouldFire
                if (results.shouldFire) { drainQueue(); }
              } else {
                previousShouldFire = results.shouldFire;
                // new data
                if (results.shouldFire) {
                  o.onNext(results.data);
                } else {
                  q.push(results.data);
                }
              }
            },
            function (err) {
              drainQueue();
              o.onError(err);
            },
            function () {
              drainQueue();
              o.onCompleted();
            }
          );
      return subscription;      
    };

    PausableBufferedObservable.prototype.pause = function () {
      this.paused = true;
      this.controller.onNext(false);
    };

    PausableBufferedObservable.prototype.resume = function () {
      this.paused = false;
      this.controller.onNext(true);
    };

    return PausableBufferedObservable;

  }(Observable));

  /**
   * Pauses the underlying observable sequence based upon the observable sequence which yields true/false,
   * and yields the values that were buffered while paused.
   * @example
   * var pauser = new Rx.Subject();
   * var source = Rx.Observable.interval(100).pausableBuffered(pauser);
   * @param {Observable} pauser The observable sequence used to pause the underlying sequence.
   * @returns {Observable} The observable sequence which is paused based upon the pauser.
   */
  observableProto.pausableBuffered = function (pauser) {
    return new PausableBufferedObservable(this, pauser);
  };

  var ControlledObservable = (function (__super__) {
    inherits(ControlledObservable, __super__);
    function ControlledObservable (source, enableQueue, scheduler) {
      __super__.call(this);
      this.subject = new ControlledSubject(enableQueue, scheduler);
      this.source = source.multicast(this.subject).refCount();
    }

    ControlledObservable.prototype._subscribe = function (o) {
      return this.source.subscribe(o);
    };

    ControlledObservable.prototype.request = function (numberOfItems) {
      return this.subject.request(numberOfItems == null ? -1 : numberOfItems);
    };

    return ControlledObservable;

  }(Observable));

  var ControlledSubject = (function (__super__) {
    inherits(ControlledSubject, __super__);
    function ControlledSubject(enableQueue, scheduler) {
      enableQueue == null && (enableQueue = true);

      __super__.call(this);
      this.subject = new Subject();
      this.enableQueue = enableQueue;
      this.queue = enableQueue ? [] : null;
      this.requestedCount = 0;
      this.requestedDisposable = null;
      this.error = null;
      this.hasFailed = false;
      this.hasCompleted = false;
      this.scheduler = scheduler || currentThreadScheduler;
    }

    addProperties(ControlledSubject.prototype, Observer, {
      _subscribe: function (o) {
        return this.subject.subscribe(o);
      },
      onCompleted: function () {
        this.hasCompleted = true;
        if (!this.enableQueue || this.queue.length === 0) {
          this.subject.onCompleted();
          this.disposeCurrentRequest();
        } else {
          this.queue.push(Notification.createOnCompleted());
        }
      },
      onError: function (error) {
        this.hasFailed = true;
        this.error = error;
        if (!this.enableQueue || this.queue.length === 0) {
          this.subject.onError(error);
          this.disposeCurrentRequest();
        } else {
          this.queue.push(Notification.createOnError(error));
        }
      },
      onNext: function (value) {
        if (this.requestedCount <= 0) {
          this.enableQueue && this.queue.push(Notification.createOnNext(value));
        } else {
          (this.requestedCount-- === 0) && this.disposeCurrentRequest();
          this.subject.onNext(value);
        }
      },
      _processRequest: function (numberOfItems) {
        if (this.enableQueue) {
          while (this.queue.length > 0 && (numberOfItems > 0 || this.queue[0].kind !== 'N')) {
            var first = this.queue.shift();
            first.accept(this.subject);
            if (first.kind === 'N') {
              numberOfItems--;
            } else {
              this.disposeCurrentRequest();
              this.queue = [];
            }
          }
        }

        return numberOfItems;
      },
      request: function (number) {
        this.disposeCurrentRequest();
        var self = this;

        this.requestedDisposable = this.scheduler.schedule(number,
        function(s, i) {
          var remaining = self._processRequest(i);
          var stopped = self.hasCompleted || self.hasFailed;
          if (!stopped && remaining > 0) {
            self.requestedCount = remaining;

            return disposableCreate(function () {
              self.requestedCount = 0;
            });
              // Scheduled item is still in progress. Return a new
              // disposable to allow the request to be interrupted
              // via dispose.
          }
        });

        return this.requestedDisposable;
      },
      disposeCurrentRequest: function () {
        if (this.requestedDisposable) {
          this.requestedDisposable.dispose();
          this.requestedDisposable = null;
        }
      }
    });

    return ControlledSubject;
  }(Observable));

  /**
   * Attaches a controller to the observable sequence with the ability to queue.
   * @example
   * var source = Rx.Observable.interval(100).controlled();
   * source.request(3); // Reads 3 values
   * @param {bool} enableQueue truthy value to determine if values should be queued pending the next request
   * @param {Scheduler} scheduler determines how the requests will be scheduled
   * @returns {Observable} The observable sequence which only propagates values on request.
   */
  observableProto.controlled = function (enableQueue, scheduler) {

    if (enableQueue && isScheduler(enableQueue)) {
      scheduler = enableQueue;
      enableQueue = true;
    }

    if (enableQueue == null) {  enableQueue = true; }
    return new ControlledObservable(this, enableQueue, scheduler);
  };

  var StopAndWaitObservable = (function (__super__) {
    inherits(StopAndWaitObservable, __super__);
    function StopAndWaitObservable (source) {
      __super__.call(this);
      this.source = source;
    }

    function scheduleMethod(s, self) {
      return self.source.request(1);
    }

    StopAndWaitObservable.prototype._subscribe = function (o) {
      this.subscription = this.source.subscribe(new StopAndWaitObserver(o, this, this.subscription));
      return new BinaryDisposable(
        this.subscription,
        defaultScheduler.schedule(this, scheduleMethod)
      );
    };

    var StopAndWaitObserver = (function (__sub__) {
      inherits(StopAndWaitObserver, __sub__);
      function StopAndWaitObserver (observer, observable, cancel) {
        __sub__.call(this);
        this.observer = observer;
        this.observable = observable;
        this.cancel = cancel;
        this.scheduleDisposable = null;
      }

      StopAndWaitObserver.prototype.completed = function () {
        this.observer.onCompleted();
        this.dispose();
      };

      StopAndWaitObserver.prototype.error = function (error) {
        this.observer.onError(error);
        this.dispose();
      };

      function innerScheduleMethod(s, self) {
        return self.observable.source.request(1);
      }

      StopAndWaitObserver.prototype.next = function (value) {
        this.observer.onNext(value);
        this.scheduleDisposable = defaultScheduler.schedule(this, innerScheduleMethod);
      };

      StopAndWaitObserver.dispose = function () {
        this.observer = null;
        if (this.cancel) {
          this.cancel.dispose();
          this.cancel = null;
        }
        if (this.scheduleDisposable) {
          this.scheduleDisposable.dispose();
          this.scheduleDisposable = null;
        }
        __sub__.prototype.dispose.call(this);
      };

      return StopAndWaitObserver;
    }(AbstractObserver));

    return StopAndWaitObservable;
  }(Observable));


  /**
   * Attaches a stop and wait observable to the current observable.
   * @returns {Observable} A stop and wait observable.
   */
  ControlledObservable.prototype.stopAndWait = function () {
    return new StopAndWaitObservable(this);
  };

  var WindowedObservable = (function (__super__) {
    inherits(WindowedObservable, __super__);
    function WindowedObservable(source, windowSize) {
      __super__.call(this);
      this.source = source;
      this.windowSize = windowSize;
    }

    function scheduleMethod(s, self) {
      return self.source.request(self.windowSize);
    }

    WindowedObservable.prototype._subscribe = function (o) {
      this.subscription = this.source.subscribe(new WindowedObserver(o, this, this.subscription));
      return new BinaryDisposable(
        this.subscription,
        defaultScheduler.schedule(this, scheduleMethod)
      );
    };

    var WindowedObserver = (function (__sub__) {
      inherits(WindowedObserver, __sub__);
      function WindowedObserver(observer, observable, cancel) {
        this.observer = observer;
        this.observable = observable;
        this.cancel = cancel;
        this.received = 0;
        this.scheduleDisposable = null;
        __sub__.call(this);
      }

      WindowedObserver.prototype.completed = function () {
        this.observer.onCompleted();
        this.dispose();
      };

      WindowedObserver.prototype.error = function (error) {
        this.observer.onError(error);
        this.dispose();
      };

      function innerScheduleMethod(s, self) {
        return self.observable.source.request(self.observable.windowSize);
      }

      WindowedObserver.prototype.next = function (value) {
        this.observer.onNext(value);
        this.received = ++this.received % this.observable.windowSize;
        this.received === 0 && (this.scheduleDisposable = defaultScheduler.schedule(this, innerScheduleMethod));
      };

      WindowedObserver.prototype.dispose = function () {
        this.observer = null;
        if (this.cancel) {
          this.cancel.dispose();
          this.cancel = null;
        }
        if (this.scheduleDisposable) {
          this.scheduleDisposable.dispose();
          this.scheduleDisposable = null;
        }
        __sub__.prototype.dispose.call(this);
      };

      return WindowedObserver;
    }(AbstractObserver));

    return WindowedObservable;
  }(Observable));

  /**
   * Creates a sliding windowed observable based upon the window size.
   * @param {Number} windowSize The number of items in the window
   * @returns {Observable} A windowed observable based upon the window size.
   */
  ControlledObservable.prototype.windowed = function (windowSize) {
    return new WindowedObservable(this, windowSize);
  };

  /**
   * Pipes the existing Observable sequence into a Node.js Stream.
   * @param {Stream} dest The destination Node.js stream.
   * @returns {Stream} The destination stream.
   */
  observableProto.pipe = function (dest) {
    var source = this.pausableBuffered();

    function onDrain() {
      source.resume();
    }

    dest.addListener('drain', onDrain);

    source.subscribe(
      function (x) {
        !dest.write(x) && source.pause();
      },
      function (err) {
        dest.emit('error', err);
      },
      function () {
        // Hack check because STDIO is not closable
        !dest._isStdio && dest.end();
        dest.removeListener('drain', onDrain);
      });

    source.resume();

    return dest;
  };

  var MulticastObservable = (function (__super__) {
    inherits(MulticastObservable, __super__);
    function MulticastObservable(source, fn1, fn2) {
      this.source = source;
      this._fn1 = fn1;
      this._fn2 = fn2;
      __super__.call(this);
    }

    MulticastObservable.prototype.subscribeCore = function (o) {
      var connectable = this.source.multicast(this._fn1());
      return new BinaryDisposable(this._fn2(connectable).subscribe(o), connectable.connect());
    };

    return MulticastObservable;
  }(ObservableBase));

  /**
   * Multicasts the source sequence notifications through an instantiated subject into all uses of the sequence within a selector function. Each
   * subscription to the resulting sequence causes a separate multicast invocation, exposing the sequence resulting from the selector function's
   * invocation. For specializations with fixed subject types, see Publish, PublishLast, and Replay.
   *
   * @example
   * 1 - res = source.multicast(observable);
   * 2 - res = source.multicast(function () { return new Subject(); }, function (x) { return x; });
   *
   * @param {Function|Subject} subjectOrSubjectSelector
   * Factory function to create an intermediate subject through which the source sequence's elements will be multicast to the selector function.
   * Or:
   * Subject to push source elements into.
   *
   * @param {Function} [selector] Optional selector function which can use the multicasted source sequence subject to the policies enforced by the created subject. Specified only if <paramref name="subjectOrSubjectSelector" is a factory function.
   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
   */
  observableProto.multicast = function (subjectOrSubjectSelector, selector) {
    return isFunction(subjectOrSubjectSelector) ?
      new MulticastObservable(this, subjectOrSubjectSelector, selector) :
      new ConnectableObservable(this, subjectOrSubjectSelector);
  };

  /**
   * Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence.
   * This operator is a specialization of Multicast using a regular Subject.
   *
   * @example
   * var resres = source.publish();
   * var res = source.publish(function (x) { return x; });
   *
   * @param {Function} [selector] Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive all notifications of the source from the time of the subscription on.
   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
   */
  observableProto.publish = function (selector) {
    return selector && isFunction(selector) ?
      this.multicast(function () { return new Subject(); }, selector) :
      this.multicast(new Subject());
  };

  /**
   * Returns an observable sequence that shares a single subscription to the underlying sequence.
   * This operator is a specialization of publish which creates a subscription when the number of observers goes from zero to one, then shares that subscription with all subsequent observers until the number of observers returns to zero, at which point the subscription is disposed.
   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence.
   */
  observableProto.share = function () {
    return this.publish().refCount();
  };

  /**
   * Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence containing only the last notification.
   * This operator is a specialization of Multicast using a AsyncSubject.
   *
   * @example
   * var res = source.publishLast();
   * var res = source.publishLast(function (x) { return x; });
   *
   * @param selector [Optional] Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will only receive the last notification of the source.
   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
   */
  observableProto.publishLast = function (selector) {
    return selector && isFunction(selector) ?
      this.multicast(function () { return new AsyncSubject(); }, selector) :
      this.multicast(new AsyncSubject());
  };

  /**
   * Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence and starts with initialValue.
   * This operator is a specialization of Multicast using a BehaviorSubject.
   *
   * @example
   * var res = source.publishValue(42);
   * var res = source.publishValue(function (x) { return x.select(function (y) { return y * y; }) }, 42);
   *
   * @param {Function} [selector] Optional selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive immediately receive the initial value, followed by all notifications of the source from the time of the subscription on.
   * @param {Mixed} initialValue Initial value received by observers upon subscription.
   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
   */
  observableProto.publishValue = function (initialValueOrSelector, initialValue) {
    return arguments.length === 2 ?
      this.multicast(function () {
        return new BehaviorSubject(initialValue);
      }, initialValueOrSelector) :
      this.multicast(new BehaviorSubject(initialValueOrSelector));
  };

  /**
   * Returns an observable sequence that shares a single subscription to the underlying sequence and starts with an initialValue.
   * This operator is a specialization of publishValue which creates a subscription when the number of observers goes from zero to one, then shares that subscription with all subsequent observers until the number of observers returns to zero, at which point the subscription is disposed.
   * @param {Mixed} initialValue Initial value received by observers upon subscription.
   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence.
   */
  observableProto.shareValue = function (initialValue) {
    return this.publishValue(initialValue).refCount();
  };

  /**
   * Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence replaying notifications subject to a maximum time length for the replay buffer.
   * This operator is a specialization of Multicast using a ReplaySubject.
   *
   * @example
   * var res = source.replay(null, 3);
   * var res = source.replay(null, 3, 500);
   * var res = source.replay(null, 3, 500, scheduler);
   * var res = source.replay(function (x) { return x.take(6).repeat(); }, 3, 500, scheduler);
   *
   * @param selector [Optional] Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive all the notifications of the source subject to the specified replay buffer trimming policy.
   * @param bufferSize [Optional] Maximum element count of the replay buffer.
   * @param windowSize [Optional] Maximum time length of the replay buffer.
   * @param scheduler [Optional] Scheduler where connected observers within the selector function will be invoked on.
   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
   */
  observableProto.replay = function (selector, bufferSize, windowSize, scheduler) {
    return selector && isFunction(selector) ?
      this.multicast(function () { return new ReplaySubject(bufferSize, windowSize, scheduler); }, selector) :
      this.multicast(new ReplaySubject(bufferSize, windowSize, scheduler));
  };

  /**
   * Returns an observable sequence that shares a single subscription to the underlying sequence replaying notifications subject to a maximum time length for the replay buffer.
   * This operator is a specialization of replay which creates a subscription when the number of observers goes from zero to one, then shares that subscription with all subsequent observers until the number of observers returns to zero, at which point the subscription is disposed.
   *
   * @example
   * var res = source.shareReplay(3);
   * var res = source.shareReplay(3, 500);
   * var res = source.shareReplay(3, 500, scheduler);
   *

   * @param bufferSize [Optional] Maximum element count of the replay buffer.
   * @param window [Optional] Maximum time length of the replay buffer.
   * @param scheduler [Optional] Scheduler where connected observers within the selector function will be invoked on.
   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence.
   */
  observableProto.shareReplay = function (bufferSize, windowSize, scheduler) {
    return this.replay(null, bufferSize, windowSize, scheduler).refCount();
  };

  var InnerSubscription = function (s, o) {
    this._s = s;
    this._o = o;
  };

  InnerSubscription.prototype.dispose = function () {
    if (!this._s.isDisposed && this._o !== null) {
      var idx = this._s.observers.indexOf(this._o);
      this._s.observers.splice(idx, 1);
      this._o = null;
    }
  };

  var RefCountObservable = (function (__super__) {
    inherits(RefCountObservable, __super__);
    function RefCountObservable(source) {
      this.source = source;
      this._count = 0;
      this._connectableSubscription = null;
      __super__.call(this);
    }

    RefCountObservable.prototype.subscribeCore = function (o) {
      var subscription = this.source.subscribe(o);
      ++this._count === 1 && (this._connectableSubscription = this.source.connect());
      return new RefCountDisposable(this, subscription);
    };

    function RefCountDisposable(p, s) {
      this._p = p;
      this._s = s;
      this.isDisposed = false;
    }

    RefCountDisposable.prototype.dispose = function () {
      if (!this.isDisposed) {
        this.isDisposed = true;
        this._s.dispose();
        --this._p._count === 0 && this._p._connectableSubscription.dispose();
      }
    };

    return RefCountObservable;
  }(ObservableBase));

  var ConnectableObservable = Rx.ConnectableObservable = (function (__super__) {
    inherits(ConnectableObservable, __super__);
    function ConnectableObservable(source, subject) {
      this.source = source;
      this._connection = null;
      this._source = source.asObservable();
      this._subject = subject;
      __super__.call(this);
    }

    function ConnectDisposable(parent, subscription) {
      this._p = parent;
      this._s = subscription;
    }

    ConnectDisposable.prototype.dispose = function () {
      if (this._s) {
        this._s.dispose();
        this._s = null;
        this._p._connection = null;
      }
    };

    ConnectableObservable.prototype.connect = function () {
      if (!this._connection) {
        if (this._subject.isStopped) {
          return disposableEmpty;
        }
        var subscription = this._source.subscribe(this._subject);
        this._connection = new ConnectDisposable(this, subscription);
      }
      return this._connection;
    };

    ConnectableObservable.prototype._subscribe = function (o) {
      return this._subject.subscribe(o);
    };

    ConnectableObservable.prototype.refCount = function () {
      return new RefCountObservable(this);
    };

    return ConnectableObservable;
  }(Observable));

  /**
   * Returns an observable sequence that shares a single subscription to the underlying sequence. This observable sequence
   * can be resubscribed to, even if all prior subscriptions have ended. (unlike `.publish().refCount()`)
   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source.
   */
  observableProto.singleInstance = function() {
    var source = this, hasObservable = false, observable;

    function getObservable() {
      if (!hasObservable) {
        hasObservable = true;
        observable = source['finally'](function() { hasObservable = false; }).publish().refCount();
      }
      return observable;
    }

    return new AnonymousObservable(function(o) {
      return getObservable().subscribe(o);
    });
  };

  /**
   *  Correlates the elements of two sequences based on overlapping durations.
   *
   *  @param {Observable} right The right observable sequence to join elements for.
   *  @param {Function} leftDurationSelector A function to select the duration (expressed as an observable sequence) of each element of the left observable sequence, used to determine overlap.
   *  @param {Function} rightDurationSelector A function to select the duration (expressed as an observable sequence) of each element of the right observable sequence, used to determine overlap.
   *  @param {Function} resultSelector A function invoked to compute a result element for any two overlapping elements of the left and right observable sequences. The parameters passed to the function correspond with the elements from the left and right source sequences for which overlap occurs.
   *  @returns {Observable} An observable sequence that contains result elements computed from source elements that have an overlapping duration.
   */
  observableProto.join = function (right, leftDurationSelector, rightDurationSelector, resultSelector) {
    var left = this;
    return new AnonymousObservable(function (o) {
      var group = new CompositeDisposable();
      var leftDone = false, rightDone = false;
      var leftId = 0, rightId = 0;
      var leftMap = new Map(), rightMap = new Map();
      var handleError = function (e) { o.onError(e); };

      group.add(left.subscribe(
        function (value) {
          var id = leftId++, md = new SingleAssignmentDisposable();

          leftMap.set(id, value);
          group.add(md);

          var duration = tryCatch(leftDurationSelector)(value);
          if (duration === errorObj) { return o.onError(duration.e); }

          md.setDisposable(duration.take(1).subscribe(
            noop,
            handleError,
            function () {
              leftMap['delete'](id) && leftMap.size === 0 && leftDone && o.onCompleted();
              group.remove(md);
            }));

          rightMap.forEach(function (v) {
            var result = tryCatch(resultSelector)(value, v);
            if (result === errorObj) { return o.onError(result.e); }
            o.onNext(result);
          });
        },
        handleError,
        function () {
          leftDone = true;
          (rightDone || leftMap.size === 0) && o.onCompleted();
        })
      );

      group.add(right.subscribe(
        function (value) {
          var id = rightId++, md = new SingleAssignmentDisposable();

          rightMap.set(id, value);
          group.add(md);

          var duration = tryCatch(rightDurationSelector)(value);
          if (duration === errorObj) { return o.onError(duration.e); }

          md.setDisposable(duration.take(1).subscribe(
            noop,
            handleError,
            function () {
              rightMap['delete'](id) && rightMap.size === 0 && rightDone && o.onCompleted();
              group.remove(md);
            }));

          leftMap.forEach(function (v) {
            var result = tryCatch(resultSelector)(v, value);
            if (result === errorObj) { return o.onError(result.e); }
            o.onNext(result);
          });
        },
        handleError,
        function () {
          rightDone = true;
          (leftDone || rightMap.size === 0) && o.onCompleted();
        })
      );
      return group;
    }, left);
  };

  /**
   *  Correlates the elements of two sequences based on overlapping durations, and groups the results.
   *
   *  @param {Observable} right The right observable sequence to join elements for.
   *  @param {Function} leftDurationSelector A function to select the duration (expressed as an observable sequence) of each element of the left observable sequence, used to determine overlap.
   *  @param {Function} rightDurationSelector A function to select the duration (expressed as an observable sequence) of each element of the right observable sequence, used to determine overlap.
   *  @param {Function} resultSelector A function invoked to compute a result element for any element of the left sequence with overlapping elements from the right observable sequence. The first parameter passed to the function is an element of the left sequence. The second parameter passed to the function is an observable sequence with elements from the right sequence that overlap with the left sequence's element.
   *  @returns {Observable} An observable sequence that contains result elements computed from source elements that have an overlapping duration.
   */
  observableProto.groupJoin = function (right, leftDurationSelector, rightDurationSelector, resultSelector) {
    var left = this;
    return new AnonymousObservable(function (o) {
      var group = new CompositeDisposable();
      var r = new RefCountDisposable(group);
      var leftMap = new Map(), rightMap = new Map();
      var leftId = 0, rightId = 0;
      var handleError = function (e) { return function (v) { v.onError(e); }; };

      function handleError(e) { };

      group.add(left.subscribe(
        function (value) {
          var s = new Subject();
          var id = leftId++;
          leftMap.set(id, s);

          var result = tryCatch(resultSelector)(value, addRef(s, r));
          if (result === errorObj) {
            leftMap.forEach(handleError(result.e));
            return o.onError(result.e);
          }
          o.onNext(result);

          rightMap.forEach(function (v) { s.onNext(v); });

          var md = new SingleAssignmentDisposable();
          group.add(md);

          var duration = tryCatch(leftDurationSelector)(value);
          if (duration === errorObj) {
            leftMap.forEach(handleError(duration.e));
            return o.onError(duration.e);
          }

          md.setDisposable(duration.take(1).subscribe(
            noop,
            function (e) {
              leftMap.forEach(handleError(e));
              o.onError(e);
            },
            function () {
              leftMap['delete'](id) && s.onCompleted();
              group.remove(md);
            }));
        },
        function (e) {
          leftMap.forEach(handleError(e));
          o.onError(e);
        },
        function () { o.onCompleted(); })
      );

      group.add(right.subscribe(
        function (value) {
          var id = rightId++;
          rightMap.set(id, value);

          var md = new SingleAssignmentDisposable();
          group.add(md);

          var duration = tryCatch(rightDurationSelector)(value);
          if (duration === errorObj) {
            leftMap.forEach(handleError(duration.e));
            return o.onError(duration.e);
          }

          md.setDisposable(duration.take(1).subscribe(
            noop,
            function (e) {
              leftMap.forEach(handleError(e));
              o.onError(e);
            },
            function () {
              rightMap['delete'](id);
              group.remove(md);
            }));

          leftMap.forEach(function (v) { v.onNext(value); });
        },
        function (e) {
          leftMap.forEach(handleError(e));
          o.onError(e);
        })
      );

      return r;
    }, left);
  };

  function toArray(x) { return x.toArray(); }

  /**
   *  Projects each element of an observable sequence into zero or more buffers.
   *  @param {Mixed} bufferOpeningsOrClosingSelector Observable sequence whose elements denote the creation of new windows, or, a function invoked to define the boundaries of the produced windows (a new window is started when the previous one is closed, resulting in non-overlapping windows).
   *  @param {Function} [bufferClosingSelector] A function invoked to define the closing of each produced window. If a closing selector function is specified for the first parameter, this parameter is ignored.
   *  @returns {Observable} An observable sequence of windows.
   */
  observableProto.buffer = function () {
    return this.window.apply(this, arguments)
      .flatMap(toArray);
  };

  /**
   *  Projects each element of an observable sequence into zero or more windows.
   *
   *  @param {Mixed} windowOpeningsOrClosingSelector Observable sequence whose elements denote the creation of new windows, or, a function invoked to define the boundaries of the produced windows (a new window is started when the previous one is closed, resulting in non-overlapping windows).
   *  @param {Function} [windowClosingSelector] A function invoked to define the closing of each produced window. If a closing selector function is specified for the first parameter, this parameter is ignored.
   *  @returns {Observable} An observable sequence of windows.
   */
  observableProto.window = function (windowOpeningsOrClosingSelector, windowClosingSelector) {
    if (arguments.length === 1 && typeof arguments[0] !== 'function') {
      return observableWindowWithBoundaries.call(this, windowOpeningsOrClosingSelector);
    }
    return typeof windowOpeningsOrClosingSelector === 'function' ?
      observableWindowWithClosingSelector.call(this, windowOpeningsOrClosingSelector) :
      observableWindowWithOpenings.call(this, windowOpeningsOrClosingSelector, windowClosingSelector);
  };

  function observableWindowWithOpenings(windowOpenings, windowClosingSelector) {
    return windowOpenings.groupJoin(this, windowClosingSelector, observableEmpty, function (_, win) {
      return win;
    });
  }

  function observableWindowWithBoundaries(windowBoundaries) {
    var source = this;
    return new AnonymousObservable(function (observer) {
      var win = new Subject(),
        d = new CompositeDisposable(),
        r = new RefCountDisposable(d);

      observer.onNext(addRef(win, r));

      d.add(source.subscribe(function (x) {
        win.onNext(x);
      }, function (err) {
        win.onError(err);
        observer.onError(err);
      }, function () {
        win.onCompleted();
        observer.onCompleted();
      }));

      isPromise(windowBoundaries) && (windowBoundaries = observableFromPromise(windowBoundaries));

      d.add(windowBoundaries.subscribe(function (w) {
        win.onCompleted();
        win = new Subject();
        observer.onNext(addRef(win, r));
      }, function (err) {
        win.onError(err);
        observer.onError(err);
      }, function () {
        win.onCompleted();
        observer.onCompleted();
      }));

      return r;
    }, source);
  }

  function observableWindowWithClosingSelector(windowClosingSelector) {
    var source = this;
    return new AnonymousObservable(function (observer) {
      var m = new SerialDisposable(),
        d = new CompositeDisposable(m),
        r = new RefCountDisposable(d),
        win = new Subject();
      observer.onNext(addRef(win, r));
      d.add(source.subscribe(function (x) {
          win.onNext(x);
      }, function (err) {
          win.onError(err);
          observer.onError(err);
      }, function () {
          win.onCompleted();
          observer.onCompleted();
      }));

      function createWindowClose () {
        var windowClose;
        try {
          windowClose = windowClosingSelector();
        } catch (e) {
          observer.onError(e);
          return;
        }

        isPromise(windowClose) && (windowClose = observableFromPromise(windowClose));

        var m1 = new SingleAssignmentDisposable();
        m.setDisposable(m1);
        m1.setDisposable(windowClose.take(1).subscribe(noop, function (err) {
          win.onError(err);
          observer.onError(err);
        }, function () {
          win.onCompleted();
          win = new Subject();
          observer.onNext(addRef(win, r));
          createWindowClose();
        }));
      }

      createWindowClose();
      return r;
    }, source);
  }

  var PairwiseObservable = (function (__super__) {
    inherits(PairwiseObservable, __super__);
    function PairwiseObservable(source) {
      this.source = source;
      __super__.call(this);
    }

    PairwiseObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new PairwiseObserver(o));
    };

    return PairwiseObservable;
  }(ObservableBase));

  var PairwiseObserver = (function(__super__) {
    inherits(PairwiseObserver, __super__);
    function PairwiseObserver(o) {
      this._o = o;
      this._p = null;
      this._hp = false;
      __super__.call(this);
    }

    PairwiseObserver.prototype.next = function (x) {
      if (this._hp) {
        this._o.onNext([this._p, x]);
      } else {
        this._hp = true;
      }
      this._p = x;
    };
    PairwiseObserver.prototype.error = function (err) { this._o.onError(err); };
    PairwiseObserver.prototype.completed = function () { this._o.onCompleted(); };

    return PairwiseObserver;
  }(AbstractObserver));

  /**
   * Returns a new observable that triggers on the second and subsequent triggerings of the input observable.
   * The Nth triggering of the input observable passes the arguments from the N-1th and Nth triggering as a pair.
   * The argument passed to the N-1th triggering is held in hidden internal state until the Nth triggering occurs.
   * @returns {Observable} An observable that triggers on successive pairs of observations from the input observable as an array.
   */
  observableProto.pairwise = function () {
    return new PairwiseObservable(this);
  };

  /**
   * Returns two observables which partition the observations of the source by the given function.
   * The first will trigger observations for those values for which the predicate returns true.
   * The second will trigger observations for those values where the predicate returns false.
   * The predicate is executed once for each subscribed observer.
   * Both also propagate all error observations arising from the source and each completes
   * when the source completes.
   * @param {Function} predicate
   *    The function to determine which output Observable will trigger a particular observation.
   * @returns {Array}
   *    An array of observables. The first triggers when the predicate returns true,
   *    and the second triggers when the predicate returns false.
  */
  observableProto.partition = function(predicate, thisArg) {
    var fn = bindCallback(predicate, thisArg, 3);
    return [
      this.filter(predicate, thisArg),
      this.filter(function (x, i, o) { return !fn(x, i, o); })
    ];
  };

  var WhileEnumerable = (function(__super__) {
    inherits(WhileEnumerable, __super__);
    function WhileEnumerable(c, s) {
      this.c = c;
      this.s = s;
    }
    WhileEnumerable.prototype[$iterator$] = function () {
      var self = this;
      return {
        next: function () {
          return self.c() ?
           { done: false, value: self.s } :
           { done: true, value: void 0 };
        }
      };
    };
    return WhileEnumerable;
  }(Enumerable));
  
  function enumerableWhile(condition, source) {
    return new WhileEnumerable(condition, source);
  }  

   /**
   *  Returns an observable sequence that is the result of invoking the selector on the source sequence, without sharing subscriptions.
   *  This operator allows for a fluent style of writing queries that use the same sequence multiple times.
   *
   * @param {Function} selector Selector function which can use the source sequence as many times as needed, without sharing subscriptions to the source sequence.
   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
   */
  observableProto.letBind = observableProto['let'] = function (func) {
    return func(this);
  };

   /**
   *  Determines whether an observable collection contains values. 
   *
   * @example
   *  1 - res = Rx.Observable.if(condition, obs1);
   *  2 - res = Rx.Observable.if(condition, obs1, obs2);
   *  3 - res = Rx.Observable.if(condition, obs1, scheduler);
   * @param {Function} condition The condition which determines if the thenSource or elseSource will be run.
   * @param {Observable} thenSource The observable sequence or Promise that will be run if the condition function returns true.
   * @param {Observable} [elseSource] The observable sequence or Promise that will be run if the condition function returns false. If this is not provided, it defaults to Rx.Observabe.Empty with the specified scheduler.
   * @returns {Observable} An observable sequence which is either the thenSource or elseSource.
   */
  Observable['if'] = function (condition, thenSource, elseSourceOrScheduler) {
    return observableDefer(function () {
      elseSourceOrScheduler || (elseSourceOrScheduler = observableEmpty());

      isPromise(thenSource) && (thenSource = observableFromPromise(thenSource));
      isPromise(elseSourceOrScheduler) && (elseSourceOrScheduler = observableFromPromise(elseSourceOrScheduler));

      // Assume a scheduler for empty only
      typeof elseSourceOrScheduler.now === 'function' && (elseSourceOrScheduler = observableEmpty(elseSourceOrScheduler));
      return condition() ? thenSource : elseSourceOrScheduler;
    });
  };

   /**
   *  Concatenates the observable sequences obtained by running the specified result selector for each element in source.
   * There is an alias for this method called 'forIn' for browsers <IE9
   * @param {Array} sources An array of values to turn into an observable sequence.
   * @param {Function} resultSelector A function to apply to each item in the sources array to turn it into an observable sequence.
   * @returns {Observable} An observable sequence from the concatenated observable sequences.
   */
  Observable['for'] = Observable.forIn = function (sources, resultSelector, thisArg) {
    return enumerableOf(sources, resultSelector, thisArg).concat();
  };

   /**
   *  Repeats source as long as condition holds emulating a while loop.
   * There is an alias for this method called 'whileDo' for browsers <IE9
   *
   * @param {Function} condition The condition which determines if the source will be repeated.
   * @param {Observable} source The observable sequence that will be run if the condition function returns true.
   * @returns {Observable} An observable sequence which is repeated as long as the condition holds.
   */
  var observableWhileDo = Observable['while'] = Observable.whileDo = function (condition, source) {
    isPromise(source) && (source = observableFromPromise(source));
    return enumerableWhile(condition, source).concat();
  };

   /**
   *  Repeats source as long as condition holds emulating a do while loop.
   *
   * @param {Function} condition The condition which determines if the source will be repeated.
   * @param {Observable} source The observable sequence that will be run if the condition function returns true.
   * @returns {Observable} An observable sequence which is repeated as long as the condition holds.
   */
  observableProto.doWhile = function (condition) {
    return observableConcat([this, observableWhileDo(condition, this)]);
  };

   /**
   *  Uses selector to determine which source in sources to use.
   * @param {Function} selector The function which extracts the value for to test in a case statement.
   * @param {Array} sources A object which has keys which correspond to the case statement labels.
   * @param {Observable} [elseSource] The observable sequence or Promise that will be run if the sources are not matched. If this is not provided, it defaults to Rx.Observabe.empty with the specified scheduler.
   *
   * @returns {Observable} An observable sequence which is determined by a case statement.
   */
  Observable['case'] = function (selector, sources, defaultSourceOrScheduler) {
    return observableDefer(function () {
      isPromise(defaultSourceOrScheduler) && (defaultSourceOrScheduler = observableFromPromise(defaultSourceOrScheduler));
      defaultSourceOrScheduler || (defaultSourceOrScheduler = observableEmpty());

      isScheduler(defaultSourceOrScheduler) && (defaultSourceOrScheduler = observableEmpty(defaultSourceOrScheduler));

      var result = sources[selector()];
      isPromise(result) && (result = observableFromPromise(result));

      return result || defaultSourceOrScheduler;
    });
  };

  var ExpandObservable = (function(__super__) {
    inherits(ExpandObservable, __super__);
    function ExpandObservable(source, fn, scheduler) {
      this.source = source;
      this._fn = fn;
      this._scheduler = scheduler;
      __super__.call(this);
    }

    function scheduleRecursive(args, recurse) {
      var state = args[0], self = args[1];
      var work;
      if (state.q.length > 0) {
        work = state.q.shift();
      } else {
        state.isAcquired = false;
        return;
      }
      var m1 = new SingleAssignmentDisposable();
      state.d.add(m1);
      m1.setDisposable(work.subscribe(new ExpandObserver(state, self, m1)));
      recurse([state, self]);
    }

    ExpandObservable.prototype._ensureActive = function (state) {
      var isOwner = false;
      if (state.q.length > 0) {
        isOwner = !state.isAcquired;
        state.isAcquired = true;
      }
      isOwner && state.m.setDisposable(this._scheduler.scheduleRecursive([state, this], scheduleRecursive));
    };

    ExpandObservable.prototype.subscribeCore = function (o) {
      var m = new SerialDisposable(),
        d = new CompositeDisposable(m),
        state = {
          q: [],
          m: m,
          d: d,
          activeCount: 0,
          isAcquired: false,
          o: o
        };

      state.q.push(this.source);
      state.activeCount++;
      this._ensureActive(state);
      return d;
    };

    return ExpandObservable;
  }(ObservableBase));

  var ExpandObserver = (function(__super__) {
    inherits(ExpandObserver, __super__);
    function ExpandObserver(state, parent, m1) {
      this._s = state;
      this._p = parent;
      this._m1 = m1;
      __super__.call(this);
    }

    ExpandObserver.prototype.next = function (x) {
      this._s.o.onNext(x);
      var result = tryCatch(this._p._fn)(x);
      if (result === errorObj) { return this._s.o.onError(result.e); }
      this._s.q.push(result);
      this._s.activeCount++;
      this._p._ensureActive(this._s);
    };

    ExpandObserver.prototype.error = function (e) {
      this._s.o.onError(e);
    };

    ExpandObserver.prototype.completed = function () {
      this._s.d.remove(this._m1);
      this._s.activeCount--;
      this._s.activeCount === 0 && this._s.o.onCompleted();
    };

    return ExpandObserver;
  }(AbstractObserver));

   /**
   *  Expands an observable sequence by recursively invoking selector.
   *
   * @param {Function} selector Selector function to invoke for each produced element, resulting in another sequence to which the selector will be invoked recursively again.
   * @param {Scheduler} [scheduler] Scheduler on which to perform the expansion. If not provided, this defaults to the current thread scheduler.
   * @returns {Observable} An observable sequence containing all the elements produced by the recursive expansion.
   */
  observableProto.expand = function (selector, scheduler) {
    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
    return new ExpandObservable(this, selector, scheduler);
  };

  function argumentsToArray() {
    var len = arguments.length, args = new Array(len);
    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
    return args;
  }

  var ForkJoinObservable = (function (__super__) {
    inherits(ForkJoinObservable, __super__);
    function ForkJoinObservable(sources, cb) {
      this._sources = sources;
      this._cb = cb;
      __super__.call(this);
    }

    ForkJoinObservable.prototype.subscribeCore = function (o) {
      if (this._sources.length === 0) {
        o.onCompleted();
        return disposableEmpty;
      }

      var count = this._sources.length;
      var state = {
        finished: false,
        hasResults: new Array(count),
        hasCompleted: new Array(count),
        results: new Array(count)
      };

      var subscriptions = new CompositeDisposable();
      for (var i = 0, len = this._sources.length; i < len; i++) {
        var source = this._sources[i];
        isPromise(source) && (source = observableFromPromise(source));
        subscriptions.add(source.subscribe(new ForkJoinObserver(o, state, i, this._cb, subscriptions)));
      }

      return subscriptions;
    };

    return ForkJoinObservable;
  }(ObservableBase));

  var ForkJoinObserver = (function(__super__) {
    inherits(ForkJoinObserver, __super__);
    function ForkJoinObserver(o, s, i, cb, subs) {
      this._o = o;
      this._s = s;
      this._i = i;
      this._cb = cb;
      this._subs = subs;
      __super__.call(this);
    }

    ForkJoinObserver.prototype.next = function (x) {
      if (!this._s.finished) {
        this._s.hasResults[this._i] = true;
        this._s.results[this._i] = x;
      }
    };

    ForkJoinObserver.prototype.error = function (e) {
      this._s.finished = true;
      this._o.onError(e);
      this._subs.dispose();
    };

    ForkJoinObserver.prototype.completed = function () {
      if (!this._s.finished) {
        if (!this._s.hasResults[this._i]) {
          return this._o.onCompleted();
        }
        this._s.hasCompleted[this._i] = true;
        for (var i = 0; i < this._s.results.length; i++) {
          if (!this._s.hasCompleted[i]) { return; }
        }
        this._s.finished = true;

        var res = tryCatch(this._cb).apply(null, this._s.results);
        if (res === errorObj) { return this._o.onError(res.e); }

        this._o.onNext(res);
        this._o.onCompleted();
      }
    };

    return ForkJoinObserver;
  }(AbstractObserver));

   /**
   *  Runs all observable sequences in parallel and collect their last elements.
   *
   * @example
   *  1 - res = Rx.Observable.forkJoin([obs1, obs2]);
   *  1 - res = Rx.Observable.forkJoin(obs1, obs2, ...);
   * @returns {Observable} An observable sequence with an array collecting the last elements of all the input sequences.
   */
  Observable.forkJoin = function () {
    var len = arguments.length, args = new Array(len);
    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
    var resultSelector = isFunction(args[len - 1]) ? args.pop() : argumentsToArray;
    Array.isArray(args[0]) && (args = args[0]);
    return new ForkJoinObservable(args, resultSelector);
  };

   /**
   *  Runs two observable sequences in parallel and combines their last elemenets.
   * @param {Observable} second Second observable sequence.
   * @param {Function} resultSelector Result selector function to invoke with the last elements of both sequences.
   * @returns {Observable} An observable sequence with the result of calling the selector function with the last elements of both input sequences.
   */
  observableProto.forkJoin = function () {
    var len = arguments.length, args = new Array(len);
    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
    if (Array.isArray(args[0])) {
      args[0].unshift(this);
    } else {
      args.unshift(this);
    }
    return Observable.forkJoin.apply(null, args);
  };

  /**
   * Comonadic bind operator.
   * @param {Function} selector A transform function to apply to each element.
   * @param {Object} scheduler Scheduler used to execute the operation. If not specified, defaults to the ImmediateScheduler.
   * @returns {Observable} An observable sequence which results from the comonadic bind operation.
   */
  observableProto.manySelect = observableProto.extend = function (selector, scheduler) {
    isScheduler(scheduler) || (scheduler = Rx.Scheduler.immediate);
    var source = this;
    return observableDefer(function () {
      var chain;

      return source
        .map(function (x) {
          var curr = new ChainObservable(x);

          chain && chain.onNext(x);
          chain = curr;

          return curr;
        })
        .tap(
          noop,
          function (e) { chain && chain.onError(e); },
          function () { chain && chain.onCompleted(); }
        )
        .observeOn(scheduler)
        .map(selector);
    }, source);
  };

  var ChainObservable = (function (__super__) {
    inherits(ChainObservable, __super__);
    function ChainObservable(head) {
      __super__.call(this);
      this.head = head;
      this.tail = new AsyncSubject();
    }

    addProperties(ChainObservable.prototype, Observer, {
      _subscribe: function (o) {
        var g = new CompositeDisposable();
        g.add(currentThreadScheduler.schedule(this, function (_, self) {
          o.onNext(self.head);
          g.add(self.tail.mergeAll().subscribe(o));
        }));

        return g;
      },
      onCompleted: function () {
        this.onNext(Observable.empty());
      },
      onError: function (e) {
        this.onNext(Observable['throw'](e));
      },
      onNext: function (v) {
        this.tail.onNext(v);
        this.tail.onCompleted();
      }
    });

    return ChainObservable;

  }(Observable));

  var Map = root.Map || (function () {
    function Map() {
      this.size = 0;
      this._values = [];
      this._keys = [];
    }

    Map.prototype['delete'] = function (key) {
      var i = this._keys.indexOf(key);
      if (i === -1) { return false; }
      this._values.splice(i, 1);
      this._keys.splice(i, 1);
      this.size--;
      return true;
    };

    Map.prototype.get = function (key) {
      var i = this._keys.indexOf(key);
      return i === -1 ? undefined : this._values[i];
    };

    Map.prototype.set = function (key, value) {
      var i = this._keys.indexOf(key);
      if (i === -1) {
        this._keys.push(key);
        this._values.push(value);
        this.size++;
      } else {
        this._values[i] = value;
      }
      return this;
    };

    Map.prototype.forEach = function (cb, thisArg) {
      for (var i = 0; i < this.size; i++) {
        cb.call(thisArg, this._values[i], this._keys[i]);
      }
    };

    return Map;
  }());

  /**
   * @constructor
   * Represents a join pattern over observable sequences.
   */
  function Pattern(patterns) {
    this.patterns = patterns;
  }

  /**
   *  Creates a pattern that matches the current plan matches and when the specified observable sequences has an available value.
   *  @param other Observable sequence to match in addition to the current pattern.
   *  @return {Pattern} Pattern object that matches when all observable sequences in the pattern have an available value.
   */
  Pattern.prototype.and = function (other) {
    return new Pattern(this.patterns.concat(other));
  };

  /**
   *  Matches when all observable sequences in the pattern (specified using a chain of and operators) have an available value and projects the values.
   *  @param {Function} selector Selector that will be invoked with available values from the source sequences, in the same order of the sequences in the pattern.
   *  @return {Plan} Plan that produces the projected values, to be fed (with other plans) to the when operator.
   */
  Pattern.prototype.thenDo = function (selector) {
    return new Plan(this, selector);
  };

  function Plan(expression, selector) {
    this.expression = expression;
    this.selector = selector;
  }

  function handleOnError(o) { return function (e) { o.onError(e); }; }
  function handleOnNext(self, observer) {
    return function onNext () {
      var result = tryCatch(self.selector).apply(self, arguments);
      if (result === errorObj) { return observer.onError(result.e); }
      observer.onNext(result);
    };
  }

  Plan.prototype.activate = function (externalSubscriptions, observer, deactivate) {
    var joinObservers = [], errHandler = handleOnError(observer);
    for (var i = 0, len = this.expression.patterns.length; i < len; i++) {
      joinObservers.push(planCreateObserver(externalSubscriptions, this.expression.patterns[i], errHandler));
    }
    var activePlan = new ActivePlan(joinObservers, handleOnNext(this, observer), function () {
      for (var j = 0, jlen = joinObservers.length; j < jlen; j++) {
        joinObservers[j].removeActivePlan(activePlan);
      }
      deactivate(activePlan);
    });
    for (i = 0, len = joinObservers.length; i < len; i++) {
      joinObservers[i].addActivePlan(activePlan);
    }
    return activePlan;
  };

  function planCreateObserver(externalSubscriptions, observable, onError) {
    var entry = externalSubscriptions.get(observable);
    if (!entry) {
      var observer = new JoinObserver(observable, onError);
      externalSubscriptions.set(observable, observer);
      return observer;
    }
    return entry;
  }

  function ActivePlan(joinObserverArray, onNext, onCompleted) {
    this.joinObserverArray = joinObserverArray;
    this.onNext = onNext;
    this.onCompleted = onCompleted;
    this.joinObservers = new Map();
    for (var i = 0, len = this.joinObserverArray.length; i < len; i++) {
      var joinObserver = this.joinObserverArray[i];
      this.joinObservers.set(joinObserver, joinObserver);
    }
  }

  ActivePlan.prototype.dequeue = function () {
    this.joinObservers.forEach(function (v) { v.queue.shift(); });
  };

  ActivePlan.prototype.match = function () {
    var i, len, hasValues = true;
    for (i = 0, len = this.joinObserverArray.length; i < len; i++) {
      if (this.joinObserverArray[i].queue.length === 0) {
        hasValues = false;
        break;
      }
    }
    if (hasValues) {
      var firstValues = [],
          isCompleted = false;
      for (i = 0, len = this.joinObserverArray.length; i < len; i++) {
        firstValues.push(this.joinObserverArray[i].queue[0]);
        this.joinObserverArray[i].queue[0].kind === 'C' && (isCompleted = true);
      }
      if (isCompleted) {
        this.onCompleted();
      } else {
        this.dequeue();
        var values = [];
        for (i = 0, len = firstValues.length; i < firstValues.length; i++) {
          values.push(firstValues[i].value);
        }
        this.onNext.apply(this, values);
      }
    }
  };

  var JoinObserver = (function (__super__) {
    inherits(JoinObserver, __super__);

    function JoinObserver(source, onError) {
      __super__.call(this);
      this.source = source;
      this.onError = onError;
      this.queue = [];
      this.activePlans = [];
      this.subscription = new SingleAssignmentDisposable();
      this.isDisposed = false;
    }

    var JoinObserverPrototype = JoinObserver.prototype;

    JoinObserverPrototype.next = function (notification) {
      if (!this.isDisposed) {
        if (notification.kind === 'E') {
          return this.onError(notification.error);
        }
        this.queue.push(notification);
        var activePlans = this.activePlans.slice(0);
        for (var i = 0, len = activePlans.length; i < len; i++) {
          activePlans[i].match();
        }
      }
    };

    JoinObserverPrototype.error = noop;
    JoinObserverPrototype.completed = noop;

    JoinObserverPrototype.addActivePlan = function (activePlan) {
      this.activePlans.push(activePlan);
    };

    JoinObserverPrototype.subscribe = function () {
      this.subscription.setDisposable(this.source.materialize().subscribe(this));
    };

    JoinObserverPrototype.removeActivePlan = function (activePlan) {
      this.activePlans.splice(this.activePlans.indexOf(activePlan), 1);
      this.activePlans.length === 0 && this.dispose();
    };

    JoinObserverPrototype.dispose = function () {
      __super__.prototype.dispose.call(this);
      if (!this.isDisposed) {
        this.isDisposed = true;
        this.subscription.dispose();
      }
    };

    return JoinObserver;
  } (AbstractObserver));

  /**
   *  Creates a pattern that matches when both observable sequences have an available value.
   *
   *  @param right Observable sequence to match with the current sequence.
   *  @return {Pattern} Pattern object that matches when both observable sequences have an available value.
   */
  observableProto.and = function (right) {
    return new Pattern([this, right]);
  };

  /**
   *  Matches when the observable sequence has an available value and projects the value.
   *
   *  @param {Function} selector Selector that will be invoked for values in the source sequence.
   *  @returns {Plan} Plan that produces the projected values, to be fed (with other plans) to the when operator.
   */
  observableProto.thenDo = function (selector) {
    return new Pattern([this]).thenDo(selector);
  };

  /**
   *  Joins together the results from several patterns.
   *
   *  @param plans A series of plans (specified as an Array of as a series of arguments) created by use of the Then operator on patterns.
   *  @returns {Observable} Observable sequence with the results form matching several patterns.
   */
  Observable.when = function () {
    var len = arguments.length, plans;
    if (Array.isArray(arguments[0])) {
      plans = arguments[0];
    } else {
      plans = new Array(len);
      for(var i = 0; i < len; i++) { plans[i] = arguments[i]; }
    }
    return new AnonymousObservable(function (o) {
      var activePlans = [],
          externalSubscriptions = new Map();
      var outObserver = observerCreate(
        function (x) { o.onNext(x); },
        function (err) {
          externalSubscriptions.forEach(function (v) { v.onError(err); });
          o.onError(err);
        },
        function (x) { o.onCompleted(); }
      );
      try {
        for (var i = 0, len = plans.length; i < len; i++) {
          activePlans.push(plans[i].activate(externalSubscriptions, outObserver, function (activePlan) {
            var idx = activePlans.indexOf(activePlan);
            activePlans.splice(idx, 1);
            activePlans.length === 0 && o.onCompleted();
          }));
        }
      } catch (e) {
        return observableThrow(e).subscribe(o);
      }
      var group = new CompositeDisposable();
      externalSubscriptions.forEach(function (joinObserver) {
        joinObserver.subscribe();
        group.add(joinObserver);
      });

      return group;
    });
  };

  var TimerObservable = (function(__super__) {
    inherits(TimerObservable, __super__);
    function TimerObservable(dt, s) {
      this._dt = dt;
      this._s = s;
      __super__.call(this);
    }

    TimerObservable.prototype.subscribeCore = function (o) {
      return this._s.scheduleFuture(o, this._dt, scheduleMethod);
    };

    function scheduleMethod(s, o) {
      o.onNext(0);
      o.onCompleted();
    }

    return TimerObservable;
  }(ObservableBase));

  function _observableTimer(dueTime, scheduler) {
    return new TimerObservable(dueTime, scheduler);
  }

  function observableTimerDateAndPeriod(dueTime, period, scheduler) {
    return new AnonymousObservable(function (observer) {
      var d = dueTime, p = normalizeTime(period);
      return scheduler.scheduleRecursiveFuture(0, d, function (count, self) {
        if (p > 0) {
          var now = scheduler.now();
          d = new Date(d.getTime() + p);
          d.getTime() <= now && (d = new Date(now + p));
        }
        observer.onNext(count);
        self(count + 1, new Date(d));
      });
    });
  }

  function observableTimerTimeSpanAndPeriod(dueTime, period, scheduler) {
    return dueTime === period ?
      new AnonymousObservable(function (observer) {
        return scheduler.schedulePeriodic(0, period, function (count) {
          observer.onNext(count);
          return count + 1;
        });
      }) :
      observableDefer(function () {
        return observableTimerDateAndPeriod(new Date(scheduler.now() + dueTime), period, scheduler);
      });
  }

  /**
   *  Returns an observable sequence that produces a value after each period.
   *
   * @example
   *  1 - res = Rx.Observable.interval(1000);
   *  2 - res = Rx.Observable.interval(1000, Rx.Scheduler.timeout);
   *
   * @param {Number} period Period for producing the values in the resulting sequence (specified as an integer denoting milliseconds).
   * @param {Scheduler} [scheduler] Scheduler to run the timer on. If not specified, Rx.Scheduler.timeout is used.
   * @returns {Observable} An observable sequence that produces a value after each period.
   */
  var observableinterval = Observable.interval = function (period, scheduler) {
    return observableTimerTimeSpanAndPeriod(period, period, isScheduler(scheduler) ? scheduler : defaultScheduler);
  };

  /**
   *  Returns an observable sequence that produces a value after dueTime has elapsed and then after each period.
   * @param {Number} dueTime Absolute (specified as a Date object) or relative time (specified as an integer denoting milliseconds) at which to produce the first value.
   * @param {Mixed} [periodOrScheduler]  Period to produce subsequent values (specified as an integer denoting milliseconds), or the scheduler to run the timer on. If not specified, the resulting timer is not recurring.
   * @param {Scheduler} [scheduler]  Scheduler to run the timer on. If not specified, the timeout scheduler is used.
   * @returns {Observable} An observable sequence that produces a value after due time has elapsed and then each period.
   */
  var observableTimer = Observable.timer = function (dueTime, periodOrScheduler, scheduler) {
    var period;
    isScheduler(scheduler) || (scheduler = defaultScheduler);
    if (periodOrScheduler != null && typeof periodOrScheduler === 'number') {
      period = periodOrScheduler;
    } else if (isScheduler(periodOrScheduler)) {
      scheduler = periodOrScheduler;
    }
    if ((dueTime instanceof Date || typeof dueTime === 'number') && period === undefined) {
      return _observableTimer(dueTime, scheduler);
    }
    if (dueTime instanceof Date && period !== undefined) {
      return observableTimerDateAndPeriod(dueTime, periodOrScheduler, scheduler);
    }
    return observableTimerTimeSpanAndPeriod(dueTime, period, scheduler);
  };

  function observableDelayRelative(source, dueTime, scheduler) {
    return new AnonymousObservable(function (o) {
      var active = false,
        cancelable = new SerialDisposable(),
        exception = null,
        q = [],
        running = false,
        subscription;
      subscription = source.materialize().timestamp(scheduler).subscribe(function (notification) {
        var d, shouldRun;
        if (notification.value.kind === 'E') {
          q = [];
          q.push(notification);
          exception = notification.value.error;
          shouldRun = !running;
        } else {
          q.push({ value: notification.value, timestamp: notification.timestamp + dueTime });
          shouldRun = !active;
          active = true;
        }
        if (shouldRun) {
          if (exception !== null) {
            o.onError(exception);
          } else {
            d = new SingleAssignmentDisposable();
            cancelable.setDisposable(d);
            d.setDisposable(scheduler.scheduleRecursiveFuture(null, dueTime, function (_, self) {
              var e, recurseDueTime, result, shouldRecurse;
              if (exception !== null) {
                return;
              }
              running = true;
              do {
                result = null;
                if (q.length > 0 && q[0].timestamp - scheduler.now() <= 0) {
                  result = q.shift().value;
                }
                if (result !== null) {
                  result.accept(o);
                }
              } while (result !== null);
              shouldRecurse = false;
              recurseDueTime = 0;
              if (q.length > 0) {
                shouldRecurse = true;
                recurseDueTime = Math.max(0, q[0].timestamp - scheduler.now());
              } else {
                active = false;
              }
              e = exception;
              running = false;
              if (e !== null) {
                o.onError(e);
              } else if (shouldRecurse) {
                self(null, recurseDueTime);
              }
            }));
          }
        }
      });
      return new BinaryDisposable(subscription, cancelable);
    }, source);
  }

  function observableDelayAbsolute(source, dueTime, scheduler) {
    return observableDefer(function () {
      return observableDelayRelative(source, dueTime - scheduler.now(), scheduler);
    });
  }

  function delayWithSelector(source, subscriptionDelay, delayDurationSelector) {
    var subDelay, selector;
    if (isFunction(subscriptionDelay)) {
      selector = subscriptionDelay;
    } else {
      subDelay = subscriptionDelay;
      selector = delayDurationSelector;
    }
    return new AnonymousObservable(function (o) {
      var delays = new CompositeDisposable(), atEnd = false, subscription = new SerialDisposable();

      function start() {
        subscription.setDisposable(source.subscribe(
          function (x) {
            var delay = tryCatch(selector)(x);
            if (delay === errorObj) { return o.onError(delay.e); }
            var d = new SingleAssignmentDisposable();
            delays.add(d);
            d.setDisposable(delay.subscribe(
              function () {
                o.onNext(x);
                delays.remove(d);
                done();
              },
              function (e) { o.onError(e); },
              function () {
                o.onNext(x);
                delays.remove(d);
                done();
              }
            ));
          },
          function (e) { o.onError(e); },
          function () {
            atEnd = true;
            subscription.dispose();
            done();
          }
        ));
      }

      function done () {
        atEnd && delays.length === 0 && o.onCompleted();
      }

      if (!subDelay) {
        start();
      } else {
        subscription.setDisposable(subDelay.subscribe(start, function (e) { o.onError(e); }, start));
      }

      return new BinaryDisposable(subscription, delays);
    }, source);
  }

  /**
   *  Time shifts the observable sequence by dueTime.
   *  The relative time intervals between the values are preserved.
   *
   * @param {Number} dueTime Absolute (specified as a Date object) or relative time (specified as an integer denoting milliseconds) by which to shift the observable sequence.
   * @param {Scheduler} [scheduler] Scheduler to run the delay timers on. If not specified, the timeout scheduler is used.
   * @returns {Observable} Time-shifted sequence.
   */
  observableProto.delay = function () {
    var firstArg = arguments[0];
    if (typeof firstArg === 'number' || firstArg instanceof Date) {
      var dueTime = firstArg, scheduler = arguments[1];
      isScheduler(scheduler) || (scheduler = defaultScheduler);
      return dueTime instanceof Date ?
        observableDelayAbsolute(this, dueTime, scheduler) :
        observableDelayRelative(this, dueTime, scheduler);
    } else if (Observable.isObservable(firstArg) || isFunction(firstArg)) {
      return delayWithSelector(this, firstArg, arguments[1]);
    } else {
      throw new Error('Invalid arguments');
    }
  };

  var DebounceObservable = (function (__super__) {
    inherits(DebounceObservable, __super__);
    function DebounceObservable(source, dt, s) {
      isScheduler(s) || (s = defaultScheduler);
      this.source = source;
      this._dt = dt;
      this._s = s;
      __super__.call(this);
    }

    DebounceObservable.prototype.subscribeCore = function (o) {
      var cancelable = new SerialDisposable();
      return new BinaryDisposable(
        this.source.subscribe(new DebounceObserver(o, this._dt, this._s, cancelable)),
        cancelable);
    };

    return DebounceObservable;
  }(ObservableBase));

  var DebounceObserver = (function (__super__) {
    inherits(DebounceObserver, __super__);
    function DebounceObserver(observer, dueTime, scheduler, cancelable) {
      this._o = observer;
      this._d = dueTime;
      this._scheduler = scheduler;
      this._c = cancelable;
      this._v = null;
      this._hv = false;
      this._id = 0;
      __super__.call(this);
    }

    function scheduleFuture(s, state) {
      state.self._hv && state.self._id === state.currentId && state.self._o.onNext(state.x);
      state.self._hv = false;
    }

    DebounceObserver.prototype.next = function (x) {
      this._hv = true;
      this._v = x;
      var currentId = ++this._id, d = new SingleAssignmentDisposable();
      this._c.setDisposable(d);
      d.setDisposable(this._scheduler.scheduleFuture(this, this._d, function (_, self) {
        self._hv && self._id === currentId && self._o.onNext(x);
        self._hv = false;
      }));
    };

    DebounceObserver.prototype.error = function (e) {
      this._c.dispose();
      this._o.onError(e);
      this._hv = false;
      this._id++;
    };

    DebounceObserver.prototype.completed = function () {
      this._c.dispose();
      this._hv && this._o.onNext(this._v);
      this._o.onCompleted();
      this._hv = false;
      this._id++;
    };

    return DebounceObserver;
  }(AbstractObserver));

  function debounceWithSelector(source, durationSelector) {
    return new AnonymousObservable(function (o) {
      var value, hasValue = false, cancelable = new SerialDisposable(), id = 0;
      var subscription = source.subscribe(
        function (x) {
          var throttle = tryCatch(durationSelector)(x);
          if (throttle === errorObj) { return o.onError(throttle.e); }

          isPromise(throttle) && (throttle = observableFromPromise(throttle));

          hasValue = true;
          value = x;
          id++;
          var currentid = id, d = new SingleAssignmentDisposable();
          cancelable.setDisposable(d);
          d.setDisposable(throttle.subscribe(
            function () {
              hasValue && id === currentid && o.onNext(value);
              hasValue = false;
              d.dispose();
            },
            function (e) { o.onError(e); },
            function () {
              hasValue && id === currentid && o.onNext(value);
              hasValue = false;
              d.dispose();
            }
          ));
        },
        function (e) {
          cancelable.dispose();
          o.onError(e);
          hasValue = false;
          id++;
        },
        function () {
          cancelable.dispose();
          hasValue && o.onNext(value);
          o.onCompleted();
          hasValue = false;
          id++;
        }
      );
      return new BinaryDisposable(subscription, cancelable);
    }, source);
  }

  observableProto.debounce = function () {
    if (isFunction (arguments[0])) {
      return debounceWithSelector(this, arguments[0]);
    } else if (typeof arguments[0] === 'number') {
      return new DebounceObservable(this, arguments[0], arguments[1]);
    } else {
      throw new Error('Invalid arguments');
    }
  };

  /**
   *  Projects each element of an observable sequence into zero or more windows which are produced based on timing information.
   * @param {Number} timeSpan Length of each window (specified as an integer denoting milliseconds).
   * @param {Mixed} [timeShiftOrScheduler]  Interval between creation of consecutive windows (specified as an integer denoting milliseconds), or an optional scheduler parameter. If not specified, the time shift corresponds to the timeSpan parameter, resulting in non-overlapping adjacent windows.
   * @param {Scheduler} [scheduler]  Scheduler to run windowing timers on. If not specified, the timeout scheduler is used.
   * @returns {Observable} An observable sequence of windows.
   */
  observableProto.windowWithTime = observableProto.windowTime = function (timeSpan, timeShiftOrScheduler, scheduler) {
    var source = this, timeShift;
    timeShiftOrScheduler == null && (timeShift = timeSpan);
    isScheduler(scheduler) || (scheduler = defaultScheduler);
    if (typeof timeShiftOrScheduler === 'number') {
      timeShift = timeShiftOrScheduler;
    } else if (isScheduler(timeShiftOrScheduler)) {
      timeShift = timeSpan;
      scheduler = timeShiftOrScheduler;
    }
    return new AnonymousObservable(function (observer) {
      var groupDisposable,
        nextShift = timeShift,
        nextSpan = timeSpan,
        q = [],
        refCountDisposable,
        timerD = new SerialDisposable(),
        totalTime = 0;
        groupDisposable = new CompositeDisposable(timerD),
        refCountDisposable = new RefCountDisposable(groupDisposable);

       function createTimer () {
        var m = new SingleAssignmentDisposable(),
          isSpan = false,
          isShift = false;
        timerD.setDisposable(m);
        if (nextSpan === nextShift) {
          isSpan = true;
          isShift = true;
        } else if (nextSpan < nextShift) {
            isSpan = true;
        } else {
          isShift = true;
        }
        var newTotalTime = isSpan ? nextSpan : nextShift,
          ts = newTotalTime - totalTime;
        totalTime = newTotalTime;
        if (isSpan) {
          nextSpan += timeShift;
        }
        if (isShift) {
          nextShift += timeShift;
        }
        m.setDisposable(scheduler.scheduleFuture(null, ts, function () {
          if (isShift) {
            var s = new Subject();
            q.push(s);
            observer.onNext(addRef(s, refCountDisposable));
          }
          isSpan && q.shift().onCompleted();
          createTimer();
        }));
      };
      q.push(new Subject());
      observer.onNext(addRef(q[0], refCountDisposable));
      createTimer();
      groupDisposable.add(source.subscribe(
        function (x) {
          for (var i = 0, len = q.length; i < len; i++) { q[i].onNext(x); }
        },
        function (e) {
          for (var i = 0, len = q.length; i < len; i++) { q[i].onError(e); }
          observer.onError(e);
        },
        function () {
          for (var i = 0, len = q.length; i < len; i++) { q[i].onCompleted(); }
          observer.onCompleted();
        }
      ));
      return refCountDisposable;
    }, source);
  };

  /**
   *  Projects each element of an observable sequence into a window that is completed when either it's full or a given amount of time has elapsed.
   * @param {Number} timeSpan Maximum time length of a window.
   * @param {Number} count Maximum element count of a window.
   * @param {Scheduler} [scheduler]  Scheduler to run windowing timers on. If not specified, the timeout scheduler is used.
   * @returns {Observable} An observable sequence of windows.
   */
  observableProto.windowWithTimeOrCount = observableProto.windowTimeOrCount = function (timeSpan, count, scheduler) {
    var source = this;
    isScheduler(scheduler) || (scheduler = defaultScheduler);
    return new AnonymousObservable(function (observer) {
      var timerD = new SerialDisposable(),
          groupDisposable = new CompositeDisposable(timerD),
          refCountDisposable = new RefCountDisposable(groupDisposable),
          n = 0,
          windowId = 0,
          s = new Subject();

      function createTimer(id) {
        var m = new SingleAssignmentDisposable();
        timerD.setDisposable(m);
        m.setDisposable(scheduler.scheduleFuture(null, timeSpan, function () {
          if (id !== windowId) { return; }
          n = 0;
          var newId = ++windowId;
          s.onCompleted();
          s = new Subject();
          observer.onNext(addRef(s, refCountDisposable));
          createTimer(newId);
        }));
      }

      observer.onNext(addRef(s, refCountDisposable));
      createTimer(0);

      groupDisposable.add(source.subscribe(
        function (x) {
          var newId = 0, newWindow = false;
          s.onNext(x);
          if (++n === count) {
            newWindow = true;
            n = 0;
            newId = ++windowId;
            s.onCompleted();
            s = new Subject();
            observer.onNext(addRef(s, refCountDisposable));
          }
          newWindow && createTimer(newId);
        },
        function (e) {
          s.onError(e);
          observer.onError(e);
        }, function () {
          s.onCompleted();
          observer.onCompleted();
        }
      ));
      return refCountDisposable;
    }, source);
  };

  function toArray(x) { return x.toArray(); }

  /**
   *  Projects each element of an observable sequence into zero or more buffers which are produced based on timing information.
   * @param {Number} timeSpan Length of each buffer (specified as an integer denoting milliseconds).
   * @param {Mixed} [timeShiftOrScheduler]  Interval between creation of consecutive buffers (specified as an integer denoting milliseconds), or an optional scheduler parameter. If not specified, the time shift corresponds to the timeSpan parameter, resulting in non-overlapping adjacent buffers.
   * @param {Scheduler} [scheduler]  Scheduler to run buffer timers on. If not specified, the timeout scheduler is used.
   * @returns {Observable} An observable sequence of buffers.
   */
  observableProto.bufferWithTime = observableProto.bufferTime = function (timeSpan, timeShiftOrScheduler, scheduler) {
    return this.windowWithTime(timeSpan, timeShiftOrScheduler, scheduler).flatMap(toArray);
  };

  function toArray(x) { return x.toArray(); }

  /**
   *  Projects each element of an observable sequence into a buffer that is completed when either it's full or a given amount of time has elapsed.
   * @param {Number} timeSpan Maximum time length of a buffer.
   * @param {Number} count Maximum element count of a buffer.
   * @param {Scheduler} [scheduler]  Scheduler to run bufferin timers on. If not specified, the timeout scheduler is used.
   * @returns {Observable} An observable sequence of buffers.
   */
  observableProto.bufferWithTimeOrCount = observableProto.bufferTimeOrCount = function (timeSpan, count, scheduler) {
    return this.windowWithTimeOrCount(timeSpan, count, scheduler).flatMap(toArray);
  };

  var TimeIntervalObservable = (function (__super__) {
    inherits(TimeIntervalObservable, __super__);
    function TimeIntervalObservable(source, s) {
      this.source = source;
      this._s = s;
      __super__.call(this);
    }

    TimeIntervalObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new TimeIntervalObserver(o, this._s));
    };

    return TimeIntervalObservable;
  }(ObservableBase));

  var TimeIntervalObserver = (function (__super__) {
    inherits(TimeIntervalObserver, __super__);

    function TimeIntervalObserver(o, s) {
      this._o = o;
      this._s = s;
      this._l = s.now();
      __super__.call(this);
    }

    TimeIntervalObserver.prototype.next = function (x) {
      var now = this._s.now(), span = now - this._l;
      this._l = now;
      this._o.onNext({ value: x, interval: span });
    };
    TimeIntervalObserver.prototype.error = function (e) { this._o.onError(e); };
    TimeIntervalObserver.prototype.completed = function () { this._o.onCompleted(); };

    return TimeIntervalObserver;
  }(AbstractObserver));

  /**
   *  Records the time interval between consecutive values in an observable sequence.
   *
   * @example
   *  1 - res = source.timeInterval();
   *  2 - res = source.timeInterval(Rx.Scheduler.timeout);
   *
   * @param [scheduler]  Scheduler used to compute time intervals. If not specified, the timeout scheduler is used.
   * @returns {Observable} An observable sequence with time interval information on values.
   */
  observableProto.timeInterval = function (scheduler) {
    isScheduler(scheduler) || (scheduler = defaultScheduler);
    return new TimeIntervalObservable(this, scheduler);
  };

  var TimestampObservable = (function (__super__) {
    inherits(TimestampObservable, __super__);
    function TimestampObservable(source, s) {
      this.source = source;
      this._s = s;
      __super__.call(this);
    }

    TimestampObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new TimestampObserver(o, this._s));
    };

    return TimestampObservable;
  }(ObservableBase));

  var TimestampObserver = (function (__super__) {
    inherits(TimestampObserver, __super__);
    function TimestampObserver(o, s) {
      this._o = o;
      this._s = s;
      __super__.call(this);
    }

    TimestampObserver.prototype.next = function (x) {
      this._o.onNext({ value: x, timestamp: this._s.now() });
    };

    TimestampObserver.prototype.error = function (e) {
      this._o.onError(e);
    };

    TimestampObserver.prototype.completed = function () {
      this._o.onCompleted();
    };

    return TimestampObserver;
  }(AbstractObserver));

  /**
   *  Records the timestamp for each value in an observable sequence.
   *
   * @example
   *  1 - res = source.timestamp(); // produces { value: x, timestamp: ts }
   *  2 - res = source.timestamp(Rx.Scheduler.default);
   *
   * @param {Scheduler} [scheduler]  Scheduler used to compute timestamps. If not specified, the default scheduler is used.
   * @returns {Observable} An observable sequence with timestamp information on values.
   */
  observableProto.timestamp = function (scheduler) {
    isScheduler(scheduler) || (scheduler = defaultScheduler);
    return new TimestampObservable(this, scheduler);
  };

  var SampleObservable = (function(__super__) {
    inherits(SampleObservable, __super__);
    function SampleObservable(source, sampler) {
      this.source = source;
      this._sampler = sampler;
      __super__.call(this);
    }

    SampleObservable.prototype.subscribeCore = function (o) {
      var state = {
        o: o,
        atEnd: false,
        value: null,
        hasValue: false,
        sourceSubscription: new SingleAssignmentDisposable()
      };

      state.sourceSubscription.setDisposable(this.source.subscribe(new SampleSourceObserver(state)));
      return new BinaryDisposable(
        state.sourceSubscription,
        this._sampler.subscribe(new SamplerObserver(state))
      );
    };

    return SampleObservable;
  }(ObservableBase));

  var SamplerObserver = (function(__super__) {
    inherits(SamplerObserver, __super__);
    function SamplerObserver(s) {
      this._s = s;
      __super__.call(this);
    }

    SamplerObserver.prototype._handleMessage = function () {
      if (this._s.hasValue) {
        this._s.hasValue = false;
        this._s.o.onNext(this._s.value);
      }
      this._s.atEnd && this._s.o.onCompleted();
    };

    SamplerObserver.prototype.next = function () { this._handleMessage(); };
    SamplerObserver.prototype.error = function (e) { this._s.onError(e); };
    SamplerObserver.prototype.completed = function () { this._handleMessage(); };

    return SamplerObserver;
  }(AbstractObserver));

  var SampleSourceObserver = (function(__super__) {
    inherits(SampleSourceObserver, __super__);
    function SampleSourceObserver(s) {
      this._s = s;
      __super__.call(this);
    }

    SampleSourceObserver.prototype.next = function (x) {
      this._s.hasValue = true;
      this._s.value = x;
    };
    SampleSourceObserver.prototype.error = function (e) { this._s.o.onError(e); };
    SampleSourceObserver.prototype.completed = function () {
      this._s.atEnd = true;
      this._s.sourceSubscription.dispose();
    };

    return SampleSourceObserver;
  }(AbstractObserver));

  /**
   *  Samples the observable sequence at each interval.
   *
   * @example
   *  1 - res = source.sample(sampleObservable); // Sampler tick sequence
   *  2 - res = source.sample(5000); // 5 seconds
   *  2 - res = source.sample(5000, Rx.Scheduler.timeout); // 5 seconds
   *
   * @param {Mixed} intervalOrSampler Interval at which to sample (specified as an integer denoting milliseconds) or Sampler Observable.
   * @param {Scheduler} [scheduler]  Scheduler to run the sampling timer on. If not specified, the timeout scheduler is used.
   * @returns {Observable} Sampled observable sequence.
   */
  observableProto.sample = function (intervalOrSampler, scheduler) {
    isScheduler(scheduler) || (scheduler = defaultScheduler);
    return typeof intervalOrSampler === 'number' ?
      new SampleObservable(this, observableinterval(intervalOrSampler, scheduler)) :
      new SampleObservable(this, intervalOrSampler);
  };

  var TimeoutError = Rx.TimeoutError = function(message) {
    this.message = message || 'Timeout has occurred';
    this.name = 'TimeoutError';
    Error.call(this);
  };
  TimeoutError.prototype = Object.create(Error.prototype);

  function timeoutWithSelector(source, firstTimeout, timeoutDurationSelector, other) {
    if (isFunction(firstTimeout)) {
      other = timeoutDurationSelector;
      timeoutDurationSelector = firstTimeout;
      firstTimeout = observableNever();
    }
    Observable.isObservable(other) || (other = observableThrow(new TimeoutError()));
    return new AnonymousObservable(function (o) {
      var subscription = new SerialDisposable(),
        timer = new SerialDisposable(),
        original = new SingleAssignmentDisposable();

      subscription.setDisposable(original);

      var id = 0, switched = false;

      function setTimer(timeout) {
        var myId = id, d = new SingleAssignmentDisposable();

        function timerWins() {
          switched = (myId === id);
          return switched;
        }

        timer.setDisposable(d);
        d.setDisposable(timeout.subscribe(function () {
          timerWins() && subscription.setDisposable(other.subscribe(o));
          d.dispose();
        }, function (e) {
          timerWins() && o.onError(e);
        }, function () {
          timerWins() && subscription.setDisposable(other.subscribe(o));
        }));
      };

      setTimer(firstTimeout);

      function oWins() {
        var res = !switched;
        if (res) { id++; }
        return res;
      }

      original.setDisposable(source.subscribe(function (x) {
        if (oWins()) {
          o.onNext(x);
          var timeout = tryCatch(timeoutDurationSelector)(x);
          if (timeout === errorObj) { return o.onError(timeout.e); }
          setTimer(isPromise(timeout) ? observableFromPromise(timeout) : timeout);
        }
      }, function (e) {
        oWins() && o.onError(e);
      }, function () {
        oWins() && o.onCompleted();
      }));
      return new BinaryDisposable(subscription, timer);
    }, source);
  }

  function timeout(source, dueTime, other, scheduler) {
    if (isScheduler(other)) {
      scheduler = other;
      other = observableThrow(new TimeoutError());
    }
    if (other instanceof Error) { other = observableThrow(other); }
    isScheduler(scheduler) || (scheduler = defaultScheduler);
    Observable.isObservable(other) || (other = observableThrow(new TimeoutError()));
    return new AnonymousObservable(function (o) {
      var id = 0,
        original = new SingleAssignmentDisposable(),
        subscription = new SerialDisposable(),
        switched = false,
        timer = new SerialDisposable();

      subscription.setDisposable(original);

      function createTimer() {
        var myId = id;
        timer.setDisposable(scheduler.scheduleFuture(null, dueTime, function () {
          switched = id === myId;
          if (switched) {
            isPromise(other) && (other = observableFromPromise(other));
            subscription.setDisposable(other.subscribe(o));
          }
        }));
      }

      createTimer();

      original.setDisposable(source.subscribe(function (x) {
        if (!switched) {
          id++;
          o.onNext(x);
          createTimer();
        }
      }, function (e) {
        if (!switched) {
          id++;
          o.onError(e);
        }
      }, function () {
        if (!switched) {
          id++;
          o.onCompleted();
        }
      }));
      return new BinaryDisposable(subscription, timer);
    }, source);
  }

  observableProto.timeout = function () {
    var firstArg = arguments[0];
    if (firstArg instanceof Date || typeof firstArg === 'number') {
      return timeout(this, firstArg, arguments[1], arguments[2]);
    } else if (Observable.isObservable(firstArg) || isFunction(firstArg)) {
      return timeoutWithSelector(this, firstArg, arguments[1], arguments[2]);
    } else {
      throw new Error('Invalid arguments');
    }
  };

  var GenerateAbsoluteObservable = (function (__super__) {
    inherits(GenerateAbsoluteObservable, __super__);
    function GenerateAbsoluteObservable(state, cndFn, itrFn, resFn, timeFn, s) {
      this._state = state;
      this._cndFn = cndFn;
      this._itrFn = itrFn;
      this._resFn = resFn;
      this._timeFn = timeFn;
      this._s = s;
      __super__.call(this);
    }

    function scheduleRecursive(state, recurse) {
      state.hasResult && state.o.onNext(state.result);

      if (state.first) {
        state.first = false;
      } else {
        state.newState = tryCatch(state.self._itrFn)(state.newState);
        if (state.newState === errorObj) { return state.o.onError(state.newState.e); }
      }
      state.hasResult = tryCatch(state.self._cndFn)(state.newState);
      if (state.hasResult === errorObj) { return state.o.onError(state.hasResult.e); }
      if (state.hasResult) {
        state.result = tryCatch(state.self._resFn)(state.newState);
        if (state.result === errorObj) { return state.o.onError(state.result.e); }
        var time = tryCatch(state.self._timeFn)(state.newState);
        if (time === errorObj) { return state.o.onError(time.e); }
        recurse(state, time);
      } else {
        state.o.onCompleted();
      }
    }

    GenerateAbsoluteObservable.prototype.subscribeCore = function (o) {
      var state = {
        o: o,
        self: this,
        newState: this._state,
        first: true,
        hasResult: false
      };
      return this._s.scheduleRecursiveFuture(state, new Date(this._s.now()), scheduleRecursive);
    };

    return GenerateAbsoluteObservable;
  }(ObservableBase));

  /**
   *  GenerateAbsolutes an observable sequence by iterating a state from an initial state until the condition fails.
   *
   * @example
   *  res = source.generateWithAbsoluteTime(0,
   *      function (x) { return return true; },
   *      function (x) { return x + 1; },
   *      function (x) { return x; },
   *      function (x) { return new Date(); }
   *  });
   *
   * @param {Mixed} initialState Initial state.
   * @param {Function} condition Condition to terminate generation (upon returning false).
   * @param {Function} iterate Iteration step function.
   * @param {Function} resultSelector Selector function for results produced in the sequence.
   * @param {Function} timeSelector Time selector function to control the speed of values being produced each iteration, returning Date values.
   * @param {Scheduler} [scheduler]  Scheduler on which to run the generator loop. If not specified, the timeout scheduler is used.
   * @returns {Observable} The generated sequence.
   */
  Observable.generateWithAbsoluteTime = function (initialState, condition, iterate, resultSelector, timeSelector, scheduler) {
    isScheduler(scheduler) || (scheduler = defaultScheduler);
    return new GenerateAbsoluteObservable(initialState, condition, iterate, resultSelector, timeSelector, scheduler);
  };

  var GenerateRelativeObservable = (function (__super__) {
    inherits(GenerateRelativeObservable, __super__);
    function GenerateRelativeObservable(state, cndFn, itrFn, resFn, timeFn, s) {
      this._state = state;
      this._cndFn = cndFn;
      this._itrFn = itrFn;
      this._resFn = resFn;
      this._timeFn = timeFn;
      this._s = s;
      __super__.call(this);
    }

    function scheduleRecursive(state, recurse) {
      state.hasResult && state.o.onNext(state.result);

      if (state.first) {
        state.first = false;
      } else {
        state.newState = tryCatch(state.self._itrFn)(state.newState);
        if (state.newState === errorObj) { return state.o.onError(state.newState.e); }
      }

      state.hasResult = tryCatch(state.self._cndFn)(state.newState);
      if (state.hasResult === errorObj) { return state.o.onError(state.hasResult.e); }
      if (state.hasResult) {
        state.result = tryCatch(state.self._resFn)(state.newState);
        if (state.result === errorObj) { return state.o.onError(state.result.e); }
        var time = tryCatch(state.self._timeFn)(state.newState);
        if (time === errorObj) { return state.o.onError(time.e); }
        recurse(state, time);
      } else {
        state.o.onCompleted();
      }
    }

    GenerateRelativeObservable.prototype.subscribeCore = function (o) {
      var state = {
        o: o,
        self: this,
        newState: this._state,
        first: true,
        hasResult: false
      };
      return this._s.scheduleRecursiveFuture(state, 0, scheduleRecursive);
    };

    return GenerateRelativeObservable;
  }(ObservableBase));

  /**
   *  Generates an observable sequence by iterating a state from an initial state until the condition fails.
   *
   * @example
   *  res = source.generateWithRelativeTime(0,
   *      function (x) { return return true; },
   *      function (x) { return x + 1; },
   *      function (x) { return x; },
   *      function (x) { return 500; }
   *  );
   *
   * @param {Mixed} initialState Initial state.
   * @param {Function} condition Condition to terminate generation (upon returning false).
   * @param {Function} iterate Iteration step function.
   * @param {Function} resultSelector Selector function for results produced in the sequence.
   * @param {Function} timeSelector Time selector function to control the speed of values being produced each iteration, returning integer values denoting milliseconds.
   * @param {Scheduler} [scheduler]  Scheduler on which to run the generator loop. If not specified, the timeout scheduler is used.
   * @returns {Observable} The generated sequence.
   */
  Observable.generateWithRelativeTime = function (initialState, condition, iterate, resultSelector, timeSelector, scheduler) {
    isScheduler(scheduler) || (scheduler = defaultScheduler);
    return new GenerateRelativeObservable(initialState, condition, iterate, resultSelector, timeSelector, scheduler);
  };

  var DelaySubscription = (function(__super__) {
    inherits(DelaySubscription, __super__);
    function DelaySubscription(source, dt, s) {
      this.source = source;
      this._dt = dt;
      this._s = s;
      __super__.call(this);
    }

    DelaySubscription.prototype.subscribeCore = function (o) {
      var d = new SerialDisposable();

      d.setDisposable(this._s.scheduleFuture([this.source, o, d], this._dt, scheduleMethod));

      return d;
    };

    function scheduleMethod(s, state) {
      var source = state[0], o = state[1], d = state[2];
      d.setDisposable(source.subscribe(o));
    }

    return DelaySubscription;
  }(ObservableBase));

  /**
   *  Time shifts the observable sequence by delaying the subscription with the specified relative time duration, using the specified scheduler to run timers.
   *
   * @example
   *  1 - res = source.delaySubscription(5000); // 5s
   *  2 - res = source.delaySubscription(5000, Rx.Scheduler.default); // 5 seconds
   *
   * @param {Number} dueTime Relative or absolute time shift of the subscription.
   * @param {Scheduler} [scheduler]  Scheduler to run the subscription delay timer on. If not specified, the timeout scheduler is used.
   * @returns {Observable} Time-shifted sequence.
   */
  observableProto.delaySubscription = function (dueTime, scheduler) {
    isScheduler(scheduler) || (scheduler = defaultScheduler);
    return new DelaySubscription(this, dueTime, scheduler);
  };

  var SkipLastWithTimeObservable = (function (__super__) {
    inherits(SkipLastWithTimeObservable, __super__);
    function SkipLastWithTimeObservable(source, d, s) {
      this.source = source;
      this._d = d;
      this._s = s;
      __super__.call(this);
    }

    SkipLastWithTimeObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new SkipLastWithTimeObserver(o, this));
    };

    return SkipLastWithTimeObservable;
  }(ObservableBase));

  var SkipLastWithTimeObserver = (function (__super__) {
    inherits(SkipLastWithTimeObserver, __super__);

    function SkipLastWithTimeObserver(o, p) {
      this._o = o;
      this._s = p._s;
      this._d = p._d;
      this._q = [];
      __super__.call(this);
    }

    SkipLastWithTimeObserver.prototype.next = function (x) {
      var now = this._s.now();
      this._q.push({ interval: now, value: x });
      while (this._q.length > 0 && now - this._q[0].interval >= this._d) {
        this._o.onNext(this._q.shift().value);
      }
    };
    SkipLastWithTimeObserver.prototype.error = function (e) { this._o.onError(e); };
    SkipLastWithTimeObserver.prototype.completed = function () {
      var now = this._s.now();
      while (this._q.length > 0 && now - this._q[0].interval >= this._d) {
        this._o.onNext(this._q.shift().value);
      }
      this._o.onCompleted();
    };

    return SkipLastWithTimeObserver;
  }(AbstractObserver));

  /**
   *  Skips elements for the specified duration from the end of the observable source sequence, using the specified scheduler to run timers.
   * @description
   *  This operator accumulates a queue with a length enough to store elements received during the initial duration window.
   *  As more elements are received, elements older than the specified duration are taken from the queue and produced on the
   *  result sequence. This causes elements to be delayed with duration.
   * @param {Number} duration Duration for skipping elements from the end of the sequence.
   * @param {Scheduler} [scheduler]  Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout
   * @returns {Observable} An observable sequence with the elements skipped during the specified duration from the end of the source sequence.
   */
  observableProto.skipLastWithTime = function (duration, scheduler) {
    isScheduler(scheduler) || (scheduler = defaultScheduler);
    return new SkipLastWithTimeObservable(this, duration, scheduler);
  };

  var TakeLastWithTimeObservable = (function (__super__) {
    inherits(TakeLastWithTimeObservable, __super__);
    function TakeLastWithTimeObservable(source, d, s) {
      this.source = source;
      this._d = d;
      this._s = s;
      __super__.call(this);
    }

    TakeLastWithTimeObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new TakeLastWithTimeObserver(o, this._d, this._s));
    };

    return TakeLastWithTimeObservable;
  }(ObservableBase));

  var TakeLastWithTimeObserver = (function (__super__) {
    inherits(TakeLastWithTimeObserver, __super__);

    function TakeLastWithTimeObserver(o, d, s) {
      this._o = o;
      this._d = d;
      this._s = s;
      this._q = [];
      __super__.call(this);
    }

    TakeLastWithTimeObserver.prototype.next = function (x) {
      var now = this._s.now();
      this._q.push({ interval: now, value: x });
      while (this._q.length > 0 && now - this._q[0].interval >= this._d) {
        this._q.shift();
      }
    };
    TakeLastWithTimeObserver.prototype.error = function (e) { this._o.onError(e); };
    TakeLastWithTimeObserver.prototype.completed = function () {
      var now = this._s.now();
      while (this._q.length > 0) {
        var next = this._q.shift();
        if (now - next.interval <= this._d) { this._o.onNext(next.value); }
      }
      this._o.onCompleted();
    };

    return TakeLastWithTimeObserver;
  }(AbstractObserver));

  /**
   *  Returns elements within the specified duration from the end of the observable source sequence, using the specified schedulers to run timers and to drain the collected elements.
   * @description
   *  This operator accumulates a queue with a length enough to store elements received during the initial duration window.
   *  As more elements are received, elements older than the specified duration are taken from the queue and produced on the
   *  result sequence. This causes elements to be delayed with duration.
   * @param {Number} duration Duration for taking elements from the end of the sequence.
   * @param {Scheduler} [scheduler]  Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
   * @returns {Observable} An observable sequence with the elements taken during the specified duration from the end of the source sequence.
   */
  observableProto.takeLastWithTime = function (duration, scheduler) {
    isScheduler(scheduler) || (scheduler = defaultScheduler);
    return new TakeLastWithTimeObservable(this, duration, scheduler);
  };

  /**
   *  Returns an array with the elements within the specified duration from the end of the observable source sequence, using the specified scheduler to run timers.
   * @description
   *  This operator accumulates a queue with a length enough to store elements received during the initial duration window.
   *  As more elements are received, elements older than the specified duration are taken from the queue and produced on the
   *  result sequence. This causes elements to be delayed with duration.
   * @param {Number} duration Duration for taking elements from the end of the sequence.
   * @param {Scheduler} scheduler Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
   * @returns {Observable} An observable sequence containing a single array with the elements taken during the specified duration from the end of the source sequence.
   */
  observableProto.takeLastBufferWithTime = function (duration, scheduler) {
    var source = this;
    isScheduler(scheduler) || (scheduler = defaultScheduler);
    return new AnonymousObservable(function (o) {
      var q = [];
      return source.subscribe(function (x) {
        var now = scheduler.now();
        q.push({ interval: now, value: x });
        while (q.length > 0 && now - q[0].interval >= duration) {
          q.shift();
        }
      }, function (e) { o.onError(e); }, function () {
        var now = scheduler.now(), res = [];
        while (q.length > 0) {
          var next = q.shift();
          now - next.interval <= duration && res.push(next.value);
        }
        o.onNext(res);
        o.onCompleted();
      });
    }, source);
  };

  var TakeWithTimeObservable = (function (__super__) {
    inherits(TakeWithTimeObservable, __super__);
    function TakeWithTimeObservable(source, d, s) {
      this.source = source;
      this._d = d;
      this._s = s;
      __super__.call(this);
    }

    function scheduleMethod(s, o) {
      o.onCompleted();
    }

    TakeWithTimeObservable.prototype.subscribeCore = function (o) {
      return new BinaryDisposable(
        this._s.scheduleFuture(o, this._d, scheduleMethod),
        this.source.subscribe(o)
      );
    };

    return TakeWithTimeObservable;
  }(ObservableBase));

  /**
   *  Takes elements for the specified duration from the start of the observable source sequence, using the specified scheduler to run timers.
   *
   * @example
   *  1 - res = source.takeWithTime(5000,  [optional scheduler]);
   * @description
   *  This operator accumulates a queue with a length enough to store elements received during the initial duration window.
   *  As more elements are received, elements older than the specified duration are taken from the queue and produced on the
   *  result sequence. This causes elements to be delayed with duration.
   * @param {Number} duration Duration for taking elements from the start of the sequence.
   * @param {Scheduler} scheduler Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
   * @returns {Observable} An observable sequence with the elements taken during the specified duration from the start of the source sequence.
   */
  observableProto.takeWithTime = function (duration, scheduler) {
    isScheduler(scheduler) || (scheduler = defaultScheduler);
    return new TakeWithTimeObservable(this, duration, scheduler);
  };

  var SkipWithTimeObservable = (function (__super__) {
    inherits(SkipWithTimeObservable, __super__);
    function SkipWithTimeObservable(source, d, s) {
      this.source = source;
      this._d = d;
      this._s = s;
      this._open = false;
      __super__.call(this);
    }

    function scheduleMethod(s, self) {
      self._open = true;
    }

    SkipWithTimeObservable.prototype.subscribeCore = function (o) {
      return new BinaryDisposable(
        this._s.scheduleFuture(this, this._d, scheduleMethod),
        this.source.subscribe(new SkipWithTimeObserver(o, this))
      );
    };

    return SkipWithTimeObservable;
  }(ObservableBase));

  var SkipWithTimeObserver = (function (__super__) {
    inherits(SkipWithTimeObserver, __super__);

    function SkipWithTimeObserver(o, p) {
      this._o = o;
      this._p = p;
      __super__.call(this);
    }

    SkipWithTimeObserver.prototype.next = function (x) { this._p._open && this._o.onNext(x); };
    SkipWithTimeObserver.prototype.error = function (e) { this._o.onError(e); };
    SkipWithTimeObserver.prototype.completed = function () { this._o.onCompleted(); };

    return SkipWithTimeObserver;
  }(AbstractObserver));

  /**
   *  Skips elements for the specified duration from the start of the observable source sequence, using the specified scheduler to run timers.
   * @description
   *  Specifying a zero value for duration doesn't guarantee no elements will be dropped from the start of the source sequence.
   *  This is a side-effect of the asynchrony introduced by the scheduler, where the action that causes callbacks from the source sequence to be forwarded
   *  may not execute immediately, despite the zero due time.
   *
   *  Errors produced by the source sequence are always forwarded to the result sequence, even if the error occurs before the duration.
   * @param {Number} duration Duration for skipping elements from the start of the sequence.
   * @param {Scheduler} scheduler Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
   * @returns {Observable} An observable sequence with the elements skipped during the specified duration from the start of the source sequence.
   */
  observableProto.skipWithTime = function (duration, scheduler) {
    isScheduler(scheduler) || (scheduler = defaultScheduler);
    return new SkipWithTimeObservable(this, duration, scheduler);
  };

  var SkipUntilWithTimeObservable = (function (__super__) {
    inherits(SkipUntilWithTimeObservable, __super__);
    function SkipUntilWithTimeObservable(source, startTime, scheduler) {
      this.source = source;
      this._st = startTime;
      this._s = scheduler;
      __super__.call(this);
    }

    function scheduleMethod(s, state) {
      state._open = true;
    }

    SkipUntilWithTimeObservable.prototype.subscribeCore = function (o) {
      this._open = false;
      return new BinaryDisposable(
        this._s.scheduleFuture(this, this._st, scheduleMethod),
        this.source.subscribe(new SkipUntilWithTimeObserver(o, this))
      );
    };

    return SkipUntilWithTimeObservable;
  }(ObservableBase));

  var SkipUntilWithTimeObserver = (function (__super__) {
    inherits(SkipUntilWithTimeObserver, __super__);

    function SkipUntilWithTimeObserver(o, p) {
      this._o = o;
      this._p = p;
      __super__.call(this);
    }

    SkipUntilWithTimeObserver.prototype.next = function (x) { this._p._open && this._o.onNext(x); };
    SkipUntilWithTimeObserver.prototype.error = function (e) { this._o.onError(e); };
    SkipUntilWithTimeObserver.prototype.completed = function () { this._o.onCompleted(); };

    return SkipUntilWithTimeObserver;
  }(AbstractObserver));


  /**
   *  Skips elements from the observable source sequence until the specified start time, using the specified scheduler to run timers.
   *  Errors produced by the source sequence are always forwarded to the result sequence, even if the error occurs before the start time.
   *
   * @examples
   *  1 - res = source.skipUntilWithTime(new Date(), [scheduler]);
   *  2 - res = source.skipUntilWithTime(5000, [scheduler]);
   * @param {Date|Number} startTime Time to start taking elements from the source sequence. If this value is less than or equal to Date(), no elements will be skipped.
   * @param {Scheduler} [scheduler] Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
   * @returns {Observable} An observable sequence with the elements skipped until the specified start time.
   */
  observableProto.skipUntilWithTime = function (startTime, scheduler) {
    isScheduler(scheduler) || (scheduler = defaultScheduler);
    return new SkipUntilWithTimeObservable(this, startTime, scheduler);
  };

  /**
   *  Takes elements for the specified duration until the specified end time, using the specified scheduler to run timers.
   * @param {Number | Date} endTime Time to stop taking elements from the source sequence. If this value is less than or equal to new Date(), the result stream will complete immediately.
   * @param {Scheduler} [scheduler] Scheduler to run the timer on.
   * @returns {Observable} An observable sequence with the elements taken until the specified end time.
   */
  observableProto.takeUntilWithTime = function (endTime, scheduler) {
    isScheduler(scheduler) || (scheduler = defaultScheduler);
    var source = this;
    return new AnonymousObservable(function (o) {
      return new BinaryDisposable(
        scheduler.scheduleFuture(o, endTime, function (_, o) { o.onCompleted(); }),
        source.subscribe(o));
    }, source);
  };

  /**
   * Returns an Observable that emits only the first item emitted by the source Observable during sequential time windows of a specified duration.
   * @param {Number} windowDuration time to wait before emitting another item after emitting the last item
   * @param {Scheduler} [scheduler] the Scheduler to use internally to manage the timers that handle timeout for each item. If not provided, defaults to Scheduler.timeout.
   * @returns {Observable} An Observable that performs the throttle operation.
   */
  observableProto.throttle = function (windowDuration, scheduler) {
    isScheduler(scheduler) || (scheduler = defaultScheduler);
    var duration = +windowDuration || 0;
    if (duration <= 0) { throw new RangeError('windowDuration cannot be less or equal zero.'); }
    var source = this;
    return new AnonymousObservable(function (o) {
      var lastOnNext = 0;
      return source.subscribe(
        function (x) {
          var now = scheduler.now();
          if (lastOnNext === 0 || now - lastOnNext >= duration) {
            lastOnNext = now;
            o.onNext(x);
          }
        },function (e) { o.onError(e); }, function () { o.onCompleted(); }
      );
    }, source);
  };

  var TransduceObserver = (function (__super__) {
    inherits(TransduceObserver, __super__);
    function TransduceObserver(o, xform) {
      this._o = o;
      this._xform = xform;
      __super__.call(this);
    }

    TransduceObserver.prototype.next = function (x) {
      var res = tryCatch(this._xform['@@transducer/step']).call(this._xform, this._o, x);
      if (res === errorObj) { this._o.onError(res.e); }
    };

    TransduceObserver.prototype.error = function (e) { this._o.onError(e); };

    TransduceObserver.prototype.completed = function () {
      this._xform['@@transducer/result'](this._o);
    };

    return TransduceObserver;
  }(AbstractObserver));

  function transformForObserver(o) {
    return {
      '@@transducer/init': function() {
        return o;
      },
      '@@transducer/step': function(obs, input) {
        return obs.onNext(input);
      },
      '@@transducer/result': function(obs) {
        return obs.onCompleted();
      }
    };
  }

  /**
   * Executes a transducer to transform the observable sequence
   * @param {Transducer} transducer A transducer to execute
   * @returns {Observable} An Observable sequence containing the results from the transducer.
   */
  observableProto.transduce = function(transducer) {
    var source = this;
    return new AnonymousObservable(function(o) {
      var xform = transducer(transformForObserver(o));
      return source.subscribe(new TransduceObserver(o, xform));
    }, source);
  };

  var SwitchFirstObservable = (function (__super__) {
    inherits(SwitchFirstObservable, __super__);
    function SwitchFirstObservable(source) {
      this.source = source;
      __super__.call(this);
    }

    SwitchFirstObservable.prototype.subscribeCore = function (o) {
      var m = new SingleAssignmentDisposable(),
        g = new CompositeDisposable(),
        state = {
          hasCurrent: false,
          isStopped: false,
          o: o,
          g: g
        };

      g.add(m);
      m.setDisposable(this.source.subscribe(new SwitchFirstObserver(state)));
      return g;
    };

    return SwitchFirstObservable;
  }(ObservableBase));

  var SwitchFirstObserver = (function(__super__) {
    inherits(SwitchFirstObserver, __super__);
    function SwitchFirstObserver(state) {
      this._s = state;
      __super__.call(this);
    }

    SwitchFirstObserver.prototype.next = function (x) {
      if (!this._s.hasCurrent) {
        this._s.hasCurrent = true;
        isPromise(x) && (x = observableFromPromise(x));
        var inner = new SingleAssignmentDisposable();
        this._s.g.add(inner);
        inner.setDisposable(x.subscribe(new InnerObserver(this._s, inner)));
      }
    };

    SwitchFirstObserver.prototype.error = function (e) {
      this._s.o.onError(e);
    };

    SwitchFirstObserver.prototype.completed = function () {
      this._s.isStopped = true;
      !this._s.hasCurrent && this._s.g.length === 1 && this._s.o.onCompleted();
    };

    inherits(InnerObserver, __super__);
    function InnerObserver(state, inner) {
      this._s = state;
      this._i = inner;
      __super__.call(this);
    }

    InnerObserver.prototype.next = function (x) { this._s.o.onNext(x); };
    InnerObserver.prototype.error = function (e) { this._s.o.onError(e); };
    InnerObserver.prototype.completed = function () {
      this._s.g.remove(this._i);
      this._s.hasCurrent = false;
      this._s.isStopped && this._s.g.length === 1 && this._s.o.onCompleted();
    };

    return SwitchFirstObserver;
  }(AbstractObserver));

  /**
   * Performs a exclusive waiting for the first to finish before subscribing to another observable.
   * Observables that come in between subscriptions will be dropped on the floor.
   * @returns {Observable} A exclusive observable with only the results that happen when subscribed.
   */
  observableProto.switchFirst = function () {
    return new SwitchFirstObservable(this);
  };

observableProto.flatMapFirst = observableProto.exhaustMap = function(selector, resultSelector, thisArg) {
    return new FlatMapObservable(this, selector, resultSelector, thisArg).switchFirst();
};

observableProto.flatMapWithMaxConcurrent = observableProto.flatMapMaxConcurrent = function(limit, selector, resultSelector, thisArg) {
    return new FlatMapObservable(this, selector, resultSelector, thisArg).merge(limit);
};

  /** Provides a set of extension methods for virtual time scheduling. */
  var VirtualTimeScheduler = Rx.VirtualTimeScheduler = (function (__super__) {
    inherits(VirtualTimeScheduler, __super__);

    /**
     * Creates a new virtual time scheduler with the specified initial clock value and absolute time comparer.
     *
     * @constructor
     * @param {Number} initialClock Initial value for the clock.
     * @param {Function} comparer Comparer to determine causality of events based on absolute time.
     */
    function VirtualTimeScheduler(initialClock, comparer) {
      this.clock = initialClock;
      this.comparer = comparer;
      this.isEnabled = false;
      this.queue = new PriorityQueue(1024);
      __super__.call(this);
    }

    var VirtualTimeSchedulerPrototype = VirtualTimeScheduler.prototype;

    VirtualTimeSchedulerPrototype.now = function () {
      return this.toAbsoluteTime(this.clock);
    };

    VirtualTimeSchedulerPrototype.schedule = function (state, action) {
      return this.scheduleAbsolute(state, this.clock, action);
    };

    VirtualTimeSchedulerPrototype.scheduleFuture = function (state, dueTime, action) {
      var dt = dueTime instanceof Date ?
        this.toRelativeTime(dueTime - this.now()) :
        this.toRelativeTime(dueTime);

      return this.scheduleRelative(state, dt, action);
    };

    /**
     * Adds a relative time value to an absolute time value.
     * @param {Number} absolute Absolute virtual time value.
     * @param {Number} relative Relative virtual time value to add.
     * @return {Number} Resulting absolute virtual time sum value.
     */
    VirtualTimeSchedulerPrototype.add = notImplemented;

    /**
     * Converts an absolute time to a number
     * @param {Any} The absolute time.
     * @returns {Number} The absolute time in ms
     */
    VirtualTimeSchedulerPrototype.toAbsoluteTime = notImplemented;

    /**
     * Converts the TimeSpan value to a relative virtual time value.
     * @param {Number} timeSpan TimeSpan value to convert.
     * @return {Number} Corresponding relative virtual time value.
     */
    VirtualTimeSchedulerPrototype.toRelativeTime = notImplemented;

    /**
     * Schedules a periodic piece of work by dynamically discovering the scheduler's capabilities. The periodic task will be emulated using recursive scheduling.
     * @param {Mixed} state Initial state passed to the action upon the first iteration.
     * @param {Number} period Period for running the work periodically.
     * @param {Function} action Action to be executed, potentially updating the state.
     * @returns {Disposable} The disposable object used to cancel the scheduled recurring action (best effort).
     */
    VirtualTimeSchedulerPrototype.schedulePeriodic = function (state, period, action) {
      var s = new SchedulePeriodicRecursive(this, state, period, action);
      return s.start();
    };

    /**
     * Schedules an action to be executed after dueTime.
     * @param {Mixed} state State passed to the action to be executed.
     * @param {Number} dueTime Relative time after which to execute the action.
     * @param {Function} action Action to be executed.
     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
     */
    VirtualTimeSchedulerPrototype.scheduleRelative = function (state, dueTime, action) {
      var runAt = this.add(this.clock, dueTime);
      return this.scheduleAbsolute(state, runAt, action);
    };

    /**
     * Starts the virtual time scheduler.
     */
    VirtualTimeSchedulerPrototype.start = function () {
      if (!this.isEnabled) {
        this.isEnabled = true;
        do {
          var next = this.getNext();
          if (next !== null) {
            this.comparer(next.dueTime, this.clock) > 0 && (this.clock = next.dueTime);
            next.invoke();
          } else {
            this.isEnabled = false;
          }
        } while (this.isEnabled);
      }
    };

    /**
     * Stops the virtual time scheduler.
     */
    VirtualTimeSchedulerPrototype.stop = function () {
      this.isEnabled = false;
    };

    /**
     * Advances the scheduler's clock to the specified time, running all work till that point.
     * @param {Number} time Absolute time to advance the scheduler's clock to.
     */
    VirtualTimeSchedulerPrototype.advanceTo = function (time) {
      var dueToClock = this.comparer(this.clock, time);
      if (this.comparer(this.clock, time) > 0) { throw new ArgumentOutOfRangeError(); }
      if (dueToClock === 0) { return; }
      if (!this.isEnabled) {
        this.isEnabled = true;
        do {
          var next = this.getNext();
          if (next !== null && this.comparer(next.dueTime, time) <= 0) {
            this.comparer(next.dueTime, this.clock) > 0 && (this.clock = next.dueTime);
            next.invoke();
          } else {
            this.isEnabled = false;
          }
        } while (this.isEnabled);
        this.clock = time;
      }
    };

    /**
     * Advances the scheduler's clock by the specified relative time, running all work scheduled for that timespan.
     * @param {Number} time Relative time to advance the scheduler's clock by.
     */
    VirtualTimeSchedulerPrototype.advanceBy = function (time) {
      var dt = this.add(this.clock, time),
          dueToClock = this.comparer(this.clock, dt);
      if (dueToClock > 0) { throw new ArgumentOutOfRangeError(); }
      if (dueToClock === 0) {  return; }

      this.advanceTo(dt);
    };

    /**
     * Advances the scheduler's clock by the specified relative time.
     * @param {Number} time Relative time to advance the scheduler's clock by.
     */
    VirtualTimeSchedulerPrototype.sleep = function (time) {
      var dt = this.add(this.clock, time);
      if (this.comparer(this.clock, dt) >= 0) { throw new ArgumentOutOfRangeError(); }

      this.clock = dt;
    };

    /**
     * Gets the next scheduled item to be executed.
     * @returns {ScheduledItem} The next scheduled item.
     */
    VirtualTimeSchedulerPrototype.getNext = function () {
      while (this.queue.length > 0) {
        var next = this.queue.peek();
        if (next.isCancelled()) {
          this.queue.dequeue();
        } else {
          return next;
        }
      }
      return null;
    };

    /**
     * Schedules an action to be executed at dueTime.
     * @param {Mixed} state State passed to the action to be executed.
     * @param {Number} dueTime Absolute time at which to execute the action.
     * @param {Function} action Action to be executed.
     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
     */
    VirtualTimeSchedulerPrototype.scheduleAbsolute = function (state, dueTime, action) {
      var self = this;

      function run(scheduler, state1) {
        self.queue.remove(si);
        return action(scheduler, state1);
      }

      var si = new ScheduledItem(this, state, run, dueTime, this.comparer);
      this.queue.enqueue(si);

      return si.disposable;
    };

    return VirtualTimeScheduler;
  }(Scheduler));

  /** Provides a virtual time scheduler that uses Date for absolute time and number for relative time. */
  Rx.HistoricalScheduler = (function (__super__) {
    inherits(HistoricalScheduler, __super__);

    /**
     * Creates a new historical scheduler with the specified initial clock value.
     * @constructor
     * @param {Number} initialClock Initial value for the clock.
     * @param {Function} comparer Comparer to determine causality of events based on absolute time.
     */
    function HistoricalScheduler(initialClock, comparer) {
      var clock = initialClock == null ? 0 : initialClock;
      var cmp = comparer || defaultSubComparer;
      __super__.call(this, clock, cmp);
    }

    var HistoricalSchedulerProto = HistoricalScheduler.prototype;

    /**
     * Adds a relative time value to an absolute time value.
     * @param {Number} absolute Absolute virtual time value.
     * @param {Number} relative Relative virtual time value to add.
     * @return {Number} Resulting absolute virtual time sum value.
     */
    HistoricalSchedulerProto.add = function (absolute, relative) {
      return absolute + relative;
    };

    HistoricalSchedulerProto.toAbsoluteTime = function (absolute) {
      return new Date(absolute).getTime();
    };

    /**
     * Converts the TimeSpan value to a relative virtual time value.
     * @memberOf HistoricalScheduler
     * @param {Number} timeSpan TimeSpan value to convert.
     * @return {Number} Corresponding relative virtual time value.
     */
    HistoricalSchedulerProto.toRelativeTime = function (timeSpan) {
      return timeSpan;
    };

    return HistoricalScheduler;
  }(Rx.VirtualTimeScheduler));

function OnNextPredicate(predicate) {
    this.predicate = predicate;
}

OnNextPredicate.prototype.equals = function (other) {
  if (other === this) { return true; }
  if (other == null) { return false; }
  if (other.kind !== 'N') { return false; }
  return this.predicate(other.value);
};

function OnErrorPredicate(predicate) {
  this.predicate = predicate;
}

OnErrorPredicate.prototype.equals = function (other) {
  if (other === this) { return true; }
  if (other == null) { return false; }
  if (other.kind !== 'E') { return false; }
  return this.predicate(other.error);
};

var ReactiveTest = Rx.ReactiveTest = {
  /** Default virtual time used for creation of observable sequences in unit tests. */
  created: 100,
  /** Default virtual time used to subscribe to observable sequences in unit tests. */
  subscribed: 200,
  /** Default virtual time used to dispose subscriptions in unit tests. */
  disposed: 1000,

  /**
   * Factory method for an OnNext notification record at a given time with a given value or a predicate function.
   *
   * 1 - ReactiveTest.onNext(200, 42);
   * 2 - ReactiveTest.onNext(200, function (x) { return x.length == 2; });
   *
   * @param ticks Recorded virtual time the OnNext notification occurs.
   * @param value Recorded value stored in the OnNext notification or a predicate.
   * @return Recorded OnNext notification.
   */
  onNext: function (ticks, value) {
    return typeof value === 'function' ?
      new Recorded(ticks, new OnNextPredicate(value)) :
      new Recorded(ticks, Notification.createOnNext(value));
  },
  /**
   * Factory method for an OnError notification record at a given time with a given error.
   *
   * 1 - ReactiveTest.onNext(200, new Error('error'));
   * 2 - ReactiveTest.onNext(200, function (e) { return e.message === 'error'; });
   *
   * @param ticks Recorded virtual time the OnError notification occurs.
   * @param exception Recorded exception stored in the OnError notification.
   * @return Recorded OnError notification.
   */
  onError: function (ticks, error) {
    return typeof error === 'function' ?
      new Recorded(ticks, new OnErrorPredicate(error)) :
      new Recorded(ticks, Notification.createOnError(error));
  },
  /**
   * Factory method for an OnCompleted notification record at a given time.
   *
   * @param ticks Recorded virtual time the OnCompleted notification occurs.
   * @return Recorded OnCompleted notification.
   */
  onCompleted: function (ticks) {
    return new Recorded(ticks, Notification.createOnCompleted());
  },
  /**
   * Factory method for a subscription record based on a given subscription and disposal time.
   *
   * @param start Virtual time indicating when the subscription was created.
   * @param end Virtual time indicating when the subscription was disposed.
   * @return Subscription object.
   */
  subscribe: function (start, end) {
    return new Subscription(start, end);
  }
};

  /**
   * Creates a new object recording the production of the specified value at the given virtual time.
   *
   * @constructor
   * @param {Number} time Virtual time the value was produced on.
   * @param {Mixed} value Value that was produced.
   * @param {Function} comparer An optional comparer.
   */
  var Recorded = Rx.Recorded = function (time, value, comparer) {
    this.time = time;
    this.value = value;
    this.comparer = comparer || defaultComparer;
  };

  /**
   * Checks whether the given recorded object is equal to the current instance.
   *
   * @param {Recorded} other Recorded object to check for equality.
   * @returns {Boolean} true if both objects are equal; false otherwise.
   */
  Recorded.prototype.equals = function (other) {
    return this.time === other.time && this.comparer(this.value, other.value);
  };

  /**
   * Returns a string representation of the current Recorded value.
   *
   * @returns {String} String representation of the current Recorded value.
   */
  Recorded.prototype.toString = function () {
    return this.value.toString() + '@' + this.time;
  };

  /**
   * Creates a new subscription object with the given virtual subscription and unsubscription time.
   *
   * @constructor
   * @param {Number} subscribe Virtual time at which the subscription occurred.
   * @param {Number} unsubscribe Virtual time at which the unsubscription occurred.
   */
  var Subscription = Rx.Subscription = function (start, end) {
    this.subscribe = start;
    this.unsubscribe = end || Number.MAX_VALUE;
  };

  /**
   * Checks whether the given subscription is equal to the current instance.
   * @param other Subscription object to check for equality.
   * @returns {Boolean} true if both objects are equal; false otherwise.
   */
  Subscription.prototype.equals = function (other) {
    return this.subscribe === other.subscribe && this.unsubscribe === other.unsubscribe;
  };

  /**
   * Returns a string representation of the current Subscription value.
   * @returns {String} String representation of the current Subscription value.
   */
  Subscription.prototype.toString = function () {
    return '(' + this.subscribe + ', ' + (this.unsubscribe === Number.MAX_VALUE ? 'Infinite' : this.unsubscribe) + ')';
  };

  var MockDisposable = Rx.MockDisposable = function (scheduler) {
    this.scheduler = scheduler;
    this.disposes = [];
    this.disposes.push(this.scheduler.clock);
  };

  MockDisposable.prototype.dispose = function () {
    this.disposes.push(this.scheduler.clock);
  };

  var MockObserver = (function (__super__) {
    inherits(MockObserver, __super__);

    function MockObserver(scheduler) {
      __super__.call(this);
      this.scheduler = scheduler;
      this.messages = [];
    }

    var MockObserverPrototype = MockObserver.prototype;

    MockObserverPrototype.onNext = function (value) {
      this.messages.push(new Recorded(this.scheduler.clock, Notification.createOnNext(value)));
    };

    MockObserverPrototype.onError = function (e) {
      this.messages.push(new Recorded(this.scheduler.clock, Notification.createOnError(e)));
    };

    MockObserverPrototype.onCompleted = function () {
      this.messages.push(new Recorded(this.scheduler.clock, Notification.createOnCompleted()));
    };

    return MockObserver;
  })(Observer);

  function MockPromise(scheduler, messages) {
    var self = this;
    this.scheduler = scheduler;
    this.messages = messages;
    this.subscriptions = [];
    this.observers = [];
    for (var i = 0, len = this.messages.length; i < len; i++) {
      var message = this.messages[i],
          notification = message.value;
      (function (innerNotification) {
        scheduler.scheduleAbsolute(null, message.time, function () {
          var obs = self.observers.slice(0);

          for (var j = 0, jLen = obs.length; j < jLen; j++) {
            innerNotification.accept(obs[j]);
          }
          return disposableEmpty;
        });
      })(notification);
    }
  }

  MockPromise.prototype.then = function (onResolved, onRejected) {
    var self = this;

    this.subscriptions.push(new Subscription(this.scheduler.clock));
    var index = this.subscriptions.length - 1;

    var newPromise;

    var observer = Rx.Observer.create(
      function (x) {
        var retValue = onResolved(x);
        if (retValue && typeof retValue.then === 'function') {
          newPromise = retValue;
        } else {
          var ticks = self.scheduler.clock;
          newPromise = new MockPromise(self.scheduler, [Rx.ReactiveTest.onNext(ticks, undefined), Rx.ReactiveTest.onCompleted(ticks)]);
        }
        var idx = self.observers.indexOf(observer);
        self.observers.splice(idx, 1);
        self.subscriptions[index] = new Subscription(self.subscriptions[index].subscribe, self.scheduler.clock);
      },
      function (err) {
        onRejected(err);
        var idx = self.observers.indexOf(observer);
        self.observers.splice(idx, 1);
        self.subscriptions[index] = new Subscription(self.subscriptions[index].subscribe, self.scheduler.clock);
      }
    );
    this.observers.push(observer);

    return newPromise || new MockPromise(this.scheduler, this.messages);
  };

  var HotObservable = (function (__super__) {
    inherits(HotObservable, __super__);

    function HotObservable(scheduler, messages) {
      __super__.call(this);
      var message, notification, observable = this;
      this.scheduler = scheduler;
      this.messages = messages;
      this.subscriptions = [];
      this.observers = [];
      for (var i = 0, len = this.messages.length; i < len; i++) {
        message = this.messages[i];
        notification = message.value;
        (function (innerNotification) {
          scheduler.scheduleAbsolute(null, message.time, function () {
            var obs = observable.observers.slice(0);

            for (var j = 0, jLen = obs.length; j < jLen; j++) {
              innerNotification.accept(obs[j]);
            }
            return disposableEmpty;
          });
        })(notification);
      }
    }

    HotObservable.prototype._subscribe = function (o) {
      var observable = this;
      this.observers.push(o);
      this.subscriptions.push(new Subscription(this.scheduler.clock));
      var index = this.subscriptions.length - 1;
      return disposableCreate(function () {
        var idx = observable.observers.indexOf(o);
        observable.observers.splice(idx, 1);
        observable.subscriptions[index] = new Subscription(observable.subscriptions[index].subscribe, observable.scheduler.clock);
      });
    };

    return HotObservable;
  })(Observable);

  var ColdObservable = (function (__super__) {
    inherits(ColdObservable, __super__);

    function ColdObservable(scheduler, messages) {
      __super__.call(this);
      this.scheduler = scheduler;
      this.messages = messages;
      this.subscriptions = [];
    }

    ColdObservable.prototype._subscribe = function (o) {
      var message, notification, observable = this;
      this.subscriptions.push(new Subscription(this.scheduler.clock));
      var index = this.subscriptions.length - 1;
      var d = new CompositeDisposable();
      for (var i = 0, len = this.messages.length; i < len; i++) {
        message = this.messages[i];
        notification = message.value;
        (function (innerNotification) {
          d.add(observable.scheduler.scheduleRelative(null, message.time, function () {
            innerNotification.accept(o);
            return disposableEmpty;
          }));
        })(notification);
      }
      return disposableCreate(function () {
        observable.subscriptions[index] = new Subscription(observable.subscriptions[index].subscribe, observable.scheduler.clock);
        d.dispose();
      });
    };

    return ColdObservable;
  })(Observable);

  /** Virtual time scheduler used for testing applications and libraries built using Reactive Extensions. */
  Rx.TestScheduler = (function (__super__) {
    inherits(TestScheduler, __super__);

    function baseComparer(x, y) {
      return x > y ? 1 : (x < y ? -1 : 0);
    }

    function TestScheduler() {
      __super__.call(this, 0, baseComparer);
    }

    /**
     * Schedules an action to be executed at the specified virtual time.
     *
     * @param state State passed to the action to be executed.
     * @param dueTime Absolute virtual time at which to execute the action.
     * @param action Action to be executed.
     * @return Disposable object used to cancel the scheduled action (best effort).
     */
    TestScheduler.prototype.scheduleAbsolute = function (state, dueTime, action) {
      dueTime <= this.clock && (dueTime = this.clock + 1);
      return __super__.prototype.scheduleAbsolute.call(this, state, dueTime, action);
    };
    /**
     * Adds a relative virtual time to an absolute virtual time value.
     *
     * @param absolute Absolute virtual time value.
     * @param relative Relative virtual time value to add.
     * @return Resulting absolute virtual time sum value.
     */
    TestScheduler.prototype.add = function (absolute, relative) {
      return absolute + relative;
    };
    /**
     * Converts the absolute virtual time value to a DateTimeOffset value.
     *
     * @param absolute Absolute virtual time value to convert.
     * @return Corresponding DateTimeOffset value.
     */
    TestScheduler.prototype.toAbsoluteTime = function (absolute) {
      return new Date(absolute).getTime();
    };
    /**
     * Converts the TimeSpan value to a relative virtual time value.
     *
     * @param timeSpan TimeSpan value to convert.
     * @return Corresponding relative virtual time value.
     */
    TestScheduler.prototype.toRelativeTime = function (timeSpan) {
      return timeSpan;
    };
    /**
     * Starts the test scheduler and uses the specified virtual times to invoke the factory function, subscribe to the resulting sequence, and dispose the subscription.
     *
     * @param create Factory method to create an observable sequence.
     * @param created Virtual time at which to invoke the factory to create an observable sequence.
     * @param subscribed Virtual time at which to subscribe to the created observable sequence.
     * @param disposed Virtual time at which to dispose the subscription.
     * @return Observer with timestamped recordings of notification messages that were received during the virtual time window when the subscription to the source sequence was active.
     */
    TestScheduler.prototype.startScheduler = function (createFn, settings) {
      settings || (settings = {});
      settings.created == null && (settings.created = ReactiveTest.created);
      settings.subscribed == null && (settings.subscribed = ReactiveTest.subscribed);
      settings.disposed == null && (settings.disposed = ReactiveTest.disposed);

      var observer = this.createObserver(), source, subscription;

      this.scheduleAbsolute(null, settings.created, function () {
        source = createFn();
        return disposableEmpty;
      });

      this.scheduleAbsolute(null, settings.subscribed, function () {
        subscription = source.subscribe(observer);
        return disposableEmpty;
      });

      this.scheduleAbsolute(null, settings.disposed, function () {
        subscription.dispose();
        return disposableEmpty;
      });

      this.start();

      return observer;
    };

    /**
     * Creates a hot observable using the specified timestamped notification messages either as an array or arguments.
     * @param messages Notifications to surface through the created sequence at their specified absolute virtual times.
     * @return Hot observable sequence that can be used to assert the timing of subscriptions and notifications.
     */
    TestScheduler.prototype.createHotObservable = function () {
      var len = arguments.length, args;
      if (Array.isArray(arguments[0])) {
        args = arguments[0];
      } else {
        args = new Array(len);
        for (var i = 0; i < len; i++) { args[i] = arguments[i]; }
      }
      return new HotObservable(this, args);
    };

    /**
     * Creates a cold observable using the specified timestamped notification messages either as an array or arguments.
     * @param messages Notifications to surface through the created sequence at their specified virtual time offsets from the sequence subscription time.
     * @return Cold observable sequence that can be used to assert the timing of subscriptions and notifications.
     */
    TestScheduler.prototype.createColdObservable = function () {
      var len = arguments.length, args;
      if (Array.isArray(arguments[0])) {
        args = arguments[0];
      } else {
        args = new Array(len);
        for (var i = 0; i < len; i++) { args[i] = arguments[i]; }
      }
      return new ColdObservable(this, args);
    };

    /**
     * Creates a resolved promise with the given value and ticks
     * @param {Number} ticks The absolute time of the resolution.
     * @param {Any} value The value to yield at the given tick.
     * @returns {MockPromise} A mock Promise which fulfills with the given value.
     */
    TestScheduler.prototype.createResolvedPromise = function (ticks, value) {
      return new MockPromise(this, [Rx.ReactiveTest.onNext(ticks, value), Rx.ReactiveTest.onCompleted(ticks)]);
    };

    /**
     * Creates a rejected promise with the given reason and ticks
     * @param {Number} ticks The absolute time of the resolution.
     * @param {Any} reason The reason for rejection to yield at the given tick.
     * @returns {MockPromise} A mock Promise which rejects with the given reason.
     */
    TestScheduler.prototype.createRejectedPromise = function (ticks, reason) {
      return new MockPromise(this, [Rx.ReactiveTest.onError(ticks, reason)]);
    };

    /**
     * Creates an observer that records received notification messages and timestamps those.
     * @return Observer that can be used to assert the timing of received notifications.
     */
    TestScheduler.prototype.createObserver = function () {
      return new MockObserver(this);
    };

    return TestScheduler;
  })(VirtualTimeScheduler);

  var AnonymousObservable = Rx.AnonymousObservable = (function (__super__) {
    inherits(AnonymousObservable, __super__);

    // Fix subscriber to check for undefined or function returned to decorate as Disposable
    function fixSubscriber(subscriber) {
      return subscriber && isFunction(subscriber.dispose) ? subscriber :
        isFunction(subscriber) ? disposableCreate(subscriber) : disposableEmpty;
    }

    function setDisposable(s, state) {
      var ado = state[0], self = state[1];
      var sub = tryCatch(self.__subscribe).call(self, ado);
      if (sub === errorObj && !ado.fail(errorObj.e)) { thrower(errorObj.e); }
      ado.setDisposable(fixSubscriber(sub));
    }

    function AnonymousObservable(subscribe, parent) {
      this.source = parent;
      this.__subscribe = subscribe;
      __super__.call(this);
    }

    AnonymousObservable.prototype._subscribe = function (o) {
      var ado = new AutoDetachObserver(o), state = [ado, this];

      if (currentThreadScheduler.scheduleRequired()) {
        currentThreadScheduler.schedule(state, setDisposable);
      } else {
        setDisposable(null, state);
      }
      return ado;
    };

    return AnonymousObservable;

  }(Observable));

  var AutoDetachObserver = (function (__super__) {
    inherits(AutoDetachObserver, __super__);

    function AutoDetachObserver(observer) {
      __super__.call(this);
      this.observer = observer;
      this.m = new SingleAssignmentDisposable();
    }

    var AutoDetachObserverPrototype = AutoDetachObserver.prototype;

    AutoDetachObserverPrototype.next = function (value) {
      var result = tryCatch(this.observer.onNext).call(this.observer, value);
      if (result === errorObj) {
        this.dispose();
        thrower(result.e);
      }
    };

    AutoDetachObserverPrototype.error = function (err) {
      var result = tryCatch(this.observer.onError).call(this.observer, err);
      this.dispose();
      result === errorObj && thrower(result.e);
    };

    AutoDetachObserverPrototype.completed = function () {
      var result = tryCatch(this.observer.onCompleted).call(this.observer);
      this.dispose();
      result === errorObj && thrower(result.e);
    };

    AutoDetachObserverPrototype.setDisposable = function (value) { this.m.setDisposable(value); };
    AutoDetachObserverPrototype.getDisposable = function () { return this.m.getDisposable(); };

    AutoDetachObserverPrototype.dispose = function () {
      __super__.prototype.dispose.call(this);
      this.m.dispose();
    };

    return AutoDetachObserver;
  }(AbstractObserver));

  var UnderlyingObservable = (function (__super__) {
    inherits(UnderlyingObservable, __super__);
    function UnderlyingObservable(m, u) {
      this._m = m;
      this._u = u;
      __super__.call(this);
    }

    UnderlyingObservable.prototype.subscribeCore = function (o) {
      return new BinaryDisposable(this._m.getDisposable(), this._u.subscribe(o));
    };

    return UnderlyingObservable;
  }(ObservableBase));

  var GroupedObservable = (function (__super__) {
    inherits(GroupedObservable, __super__);
    function GroupedObservable(key, underlyingObservable, mergedDisposable) {
      __super__.call(this);
      this.key = key;
      this.underlyingObservable = !mergedDisposable ?
        underlyingObservable :
        new UnderlyingObservable(mergedDisposable, underlyingObservable);
    }

    GroupedObservable.prototype._subscribe = function (o) {
      return this.underlyingObservable.subscribe(o);
    };

    return GroupedObservable;
  }(Observable));

  /**
   *  Represents an object that is both an observable sequence as well as an observer.
   *  Each notification is broadcasted to all subscribed observers.
   */
  var Subject = Rx.Subject = (function (__super__) {
    inherits(Subject, __super__);
    function Subject() {
      __super__.call(this);
      this.isDisposed = false;
      this.isStopped = false;
      this.observers = [];
      this.hasError = false;
    }

    addProperties(Subject.prototype, Observer.prototype, {
      _subscribe: function (o) {
        checkDisposed(this);
        if (!this.isStopped) {
          this.observers.push(o);
          return new InnerSubscription(this, o);
        }
        if (this.hasError) {
          o.onError(this.error);
          return disposableEmpty;
        }
        o.onCompleted();
        return disposableEmpty;
      },
      /**
       * Indicates whether the subject has observers subscribed to it.
       * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
       */
      hasObservers: function () { checkDisposed(this); return this.observers.length > 0; },
      /**
       * Notifies all subscribed observers about the end of the sequence.
       */
      onCompleted: function () {
        checkDisposed(this);
        if (!this.isStopped) {
          this.isStopped = true;
          for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
            os[i].onCompleted();
          }

          this.observers.length = 0;
        }
      },
      /**
       * Notifies all subscribed observers about the exception.
       * @param {Mixed} error The exception to send to all observers.
       */
      onError: function (error) {
        checkDisposed(this);
        if (!this.isStopped) {
          this.isStopped = true;
          this.error = error;
          this.hasError = true;
          for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
            os[i].onError(error);
          }

          this.observers.length = 0;
        }
      },
      /**
       * Notifies all subscribed observers about the arrival of the specified element in the sequence.
       * @param {Mixed} value The value to send to all observers.
       */
      onNext: function (value) {
        checkDisposed(this);
        if (!this.isStopped) {
          for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
            os[i].onNext(value);
          }
        }
      },
      /**
       * Unsubscribe all observers and release resources.
       */
      dispose: function () {
        this.isDisposed = true;
        this.observers = null;
      }
    });

    /**
     * Creates a subject from the specified observer and observable.
     * @param {Observer} observer The observer used to send messages to the subject.
     * @param {Observable} observable The observable used to subscribe to messages sent from the subject.
     * @returns {Subject} Subject implemented using the given observer and observable.
     */
    Subject.create = function (observer, observable) {
      return new AnonymousSubject(observer, observable);
    };

    return Subject;
  }(Observable));

  /**
   *  Represents the result of an asynchronous operation.
   *  The last value before the OnCompleted notification, or the error received through OnError, is sent to all subscribed observers.
   */
  var AsyncSubject = Rx.AsyncSubject = (function (__super__) {
    inherits(AsyncSubject, __super__);

    /**
     * Creates a subject that can only receive one value and that value is cached for all future observations.
     * @constructor
     */
    function AsyncSubject() {
      __super__.call(this);
      this.isDisposed = false;
      this.isStopped = false;
      this.hasValue = false;
      this.observers = [];
      this.hasError = false;
    }

    addProperties(AsyncSubject.prototype, Observer.prototype, {
      _subscribe: function (o) {
        checkDisposed(this);

        if (!this.isStopped) {
          this.observers.push(o);
          return new InnerSubscription(this, o);
        }

        if (this.hasError) {
          o.onError(this.error);
        } else if (this.hasValue) {
          o.onNext(this.value);
          o.onCompleted();
        } else {
          o.onCompleted();
        }

        return disposableEmpty;
      },
      /**
       * Indicates whether the subject has observers subscribed to it.
       * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
       */
      hasObservers: function () { checkDisposed(this); return this.observers.length > 0; },
      /**
       * Notifies all subscribed observers about the end of the sequence, also causing the last received value to be sent out (if any).
       */
      onCompleted: function () {
        var i, len;
        checkDisposed(this);
        if (!this.isStopped) {
          this.isStopped = true;
          var os = cloneArray(this.observers), len = os.length;

          if (this.hasValue) {
            for (i = 0; i < len; i++) {
              var o = os[i];
              o.onNext(this.value);
              o.onCompleted();
            }
          } else {
            for (i = 0; i < len; i++) {
              os[i].onCompleted();
            }
          }

          this.observers.length = 0;
        }
      },
      /**
       * Notifies all subscribed observers about the error.
       * @param {Mixed} error The Error to send to all observers.
       */
      onError: function (error) {
        checkDisposed(this);
        if (!this.isStopped) {
          this.isStopped = true;
          this.hasError = true;
          this.error = error;

          for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
            os[i].onError(error);
          }

          this.observers.length = 0;
        }
      },
      /**
       * Sends a value to the subject. The last value received before successful termination will be sent to all subscribed and future observers.
       * @param {Mixed} value The value to store in the subject.
       */
      onNext: function (value) {
        checkDisposed(this);
        if (this.isStopped) { return; }
        this.value = value;
        this.hasValue = true;
      },
      /**
       * Unsubscribe all observers and release resources.
       */
      dispose: function () {
        this.isDisposed = true;
        this.observers = null;
        this.error = null;
        this.value = null;
      }
    });

    return AsyncSubject;
  }(Observable));

  /**
   *  Represents a value that changes over time.
   *  Observers can subscribe to the subject to receive the last (or initial) value and all subsequent notifications.
   */
  var BehaviorSubject = Rx.BehaviorSubject = (function (__super__) {
    inherits(BehaviorSubject, __super__);
    function BehaviorSubject(value) {
      __super__.call(this);
      this.value = value;
      this.observers = [];
      this.isDisposed = false;
      this.isStopped = false;
      this.hasError = false;
    }

    addProperties(BehaviorSubject.prototype, Observer.prototype, {
      _subscribe: function (o) {
        checkDisposed(this);
        if (!this.isStopped) {
          this.observers.push(o);
          o.onNext(this.value);
          return new InnerSubscription(this, o);
        }
        if (this.hasError) {
          o.onError(this.error);
        } else {
          o.onCompleted();
        }
        return disposableEmpty;
      },
      /**
       * Gets the current value or throws an exception.
       * Value is frozen after onCompleted is called.
       * After onError is called always throws the specified exception.
       * An exception is always thrown after dispose is called.
       * @returns {Mixed} The initial value passed to the constructor until onNext is called; after which, the last value passed to onNext.
       */
      getValue: function () {
        checkDisposed(this);
        if (this.hasError) { thrower(this.error); }
        return this.value;
      },
      /**
       * Indicates whether the subject has observers subscribed to it.
       * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
       */
      hasObservers: function () { checkDisposed(this); return this.observers.length > 0; },
      /**
       * Notifies all subscribed observers about the end of the sequence.
       */
      onCompleted: function () {
        checkDisposed(this);
        if (this.isStopped) { return; }
        this.isStopped = true;
        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
          os[i].onCompleted();
        }

        this.observers.length = 0;
      },
      /**
       * Notifies all subscribed observers about the exception.
       * @param {Mixed} error The exception to send to all observers.
       */
      onError: function (error) {
        checkDisposed(this);
        if (this.isStopped) { return; }
        this.isStopped = true;
        this.hasError = true;
        this.error = error;

        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
          os[i].onError(error);
        }

        this.observers.length = 0;
      },
      /**
       * Notifies all subscribed observers about the arrival of the specified element in the sequence.
       * @param {Mixed} value The value to send to all observers.
       */
      onNext: function (value) {
        checkDisposed(this);
        if (this.isStopped) { return; }
        this.value = value;
        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
          os[i].onNext(value);
        }
      },
      /**
       * Unsubscribe all observers and release resources.
       */
      dispose: function () {
        this.isDisposed = true;
        this.observers = null;
        this.value = null;
        this.error = null;
      }
    });

    return BehaviorSubject;
  }(Observable));

  /**
   * Represents an object that is both an observable sequence as well as an observer.
   * Each notification is broadcasted to all subscribed and future observers, subject to buffer trimming policies.
   */
  var ReplaySubject = Rx.ReplaySubject = (function (__super__) {

    var maxSafeInteger = Math.pow(2, 53) - 1;

    function createRemovableDisposable(subject, observer) {
      return disposableCreate(function () {
        observer.dispose();
        !subject.isDisposed && subject.observers.splice(subject.observers.indexOf(observer), 1);
      });
    }

    inherits(ReplaySubject, __super__);

    /**
     *  Initializes a new instance of the ReplaySubject class with the specified buffer size, window size and scheduler.
     *  @param {Number} [bufferSize] Maximum element count of the replay buffer.
     *  @param {Number} [windowSize] Maximum time length of the replay buffer.
     *  @param {Scheduler} [scheduler] Scheduler the observers are invoked on.
     */
    function ReplaySubject(bufferSize, windowSize, scheduler) {
      this.bufferSize = bufferSize == null ? maxSafeInteger : bufferSize;
      this.windowSize = windowSize == null ? maxSafeInteger : windowSize;
      this.scheduler = scheduler || currentThreadScheduler;
      this.q = [];
      this.observers = [];
      this.isStopped = false;
      this.isDisposed = false;
      this.hasError = false;
      this.error = null;
      __super__.call(this);
    }

    addProperties(ReplaySubject.prototype, Observer.prototype, {
      _subscribe: function (o) {
        checkDisposed(this);
        var so = new ScheduledObserver(this.scheduler, o), subscription = createRemovableDisposable(this, so);

        this._trim(this.scheduler.now());
        this.observers.push(so);

        for (var i = 0, len = this.q.length; i < len; i++) {
          so.onNext(this.q[i].value);
        }

        if (this.hasError) {
          so.onError(this.error);
        } else if (this.isStopped) {
          so.onCompleted();
        }

        so.ensureActive();
        return subscription;
      },
      /**
       * Indicates whether the subject has observers subscribed to it.
       * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
       */
      hasObservers: function () { checkDisposed(this); return this.observers.length > 0; },
      _trim: function (now) {
        while (this.q.length > this.bufferSize) {
          this.q.shift();
        }
        while (this.q.length > 0 && (now - this.q[0].interval) > this.windowSize) {
          this.q.shift();
        }
      },
      /**
       * Notifies all subscribed observers about the arrival of the specified element in the sequence.
       * @param {Mixed} value The value to send to all observers.
       */
      onNext: function (value) {
        checkDisposed(this);
        if (this.isStopped) { return; }
        var now = this.scheduler.now();
        this.q.push({ interval: now, value: value });
        this._trim(now);

        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
          var observer = os[i];
          observer.onNext(value);
          observer.ensureActive();
        }
      },
      /**
       * Notifies all subscribed observers about the exception.
       * @param {Mixed} error The exception to send to all observers.
       */
      onError: function (error) {
        checkDisposed(this);
        if (this.isStopped) { return; }
        this.isStopped = true;
        this.error = error;
        this.hasError = true;
        var now = this.scheduler.now();
        this._trim(now);
        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
          var observer = os[i];
          observer.onError(error);
          observer.ensureActive();
        }
        this.observers.length = 0;
      },
      /**
       * Notifies all subscribed observers about the end of the sequence.
       */
      onCompleted: function () {
        checkDisposed(this);
        if (this.isStopped) { return; }
        this.isStopped = true;
        var now = this.scheduler.now();
        this._trim(now);
        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
          var observer = os[i];
          observer.onCompleted();
          observer.ensureActive();
        }
        this.observers.length = 0;
      },
      /**
       * Unsubscribe all observers and release resources.
       */
      dispose: function () {
        this.isDisposed = true;
        this.observers = null;
      }
    });

    return ReplaySubject;
  }(Observable));

  var AnonymousSubject = Rx.AnonymousSubject = (function (__super__) {
    inherits(AnonymousSubject, __super__);
    function AnonymousSubject(observer, observable) {
      this.observer = observer;
      this.observable = observable;
      __super__.call(this);
    }

    addProperties(AnonymousSubject.prototype, Observer.prototype, {
      _subscribe: function (o) {
        return this.observable.subscribe(o);
      },
      onCompleted: function () {
        this.observer.onCompleted();
      },
      onError: function (error) {
        this.observer.onError(error);
      },
      onNext: function (value) {
        this.observer.onNext(value);
      }
    });

    return AnonymousSubject;
  }(Observable));

  /**
  * Used to pause and resume streams.
  */
  Rx.Pauser = (function (__super__) {
    inherits(Pauser, __super__);
    function Pauser() {
      __super__.call(this);
    }

    /**
     * Pauses the underlying sequence.
     */
    Pauser.prototype.pause = function () { this.onNext(false); };

    /**
    * Resumes the underlying sequence.
    */
    Pauser.prototype.resume = function () { this.onNext(true); };

    return Pauser;
  }(Subject));

  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    root.Rx = Rx;

    define(function() {
      return Rx;
    });
  } else if (freeExports && freeModule) {
    // in Node.js or RingoJS
    if (moduleExports) {
      (freeModule.exports = Rx).Rx = Rx;
    } else {
      freeExports.Rx = Rx;
    }
  } else {
    // in a browser or Rhino
    root.Rx = Rx;
  }

  // All code before this point will be filtered from stack traces.
  var rEndingLine = captureLine();

}.call(this));

}).call(this,require("g5I+bs"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/node_modules/rx/dist/rx.all.js","/node_modules/rx/dist")
},{"buffer":4,"g5I+bs":16}]},{},[1])