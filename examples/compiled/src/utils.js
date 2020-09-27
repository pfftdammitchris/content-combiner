"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.has = exports.isArrMemberRegex = exports.isArrMember = exports.get = exports.spread = exports.map = exports.keys = exports.isFnc = exports.isStr = exports.isObj = exports.isArr = exports.forEach = exports.entries = exports.assign = void 0;
exports.assign = function (o, opts) { return Object.assign(o, opts); };
exports.entries = function (o) { return Object.entries(o); };
exports.forEach = function (arr, cb) { return arr.forEach(cb); };
exports.isArr = function (val) { return Array.isArray(val); };
exports.isObj = function (v) { return !!v && typeof v === 'object'; };
exports.isStr = function (v) { return !!v && typeof v === 'string'; };
exports.isFnc = function (v) { return typeof v === 'function'; };
exports.keys = function (obj) { return (exports.isObj(obj) ? Object.keys(obj) : []); };
exports.map = function (arr, cb) { return arr.map(cb); };
exports.spread = function (cb) { return function (args) {
    var rest = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        rest[_i - 1] = arguments[_i];
    }
    return cb.apply(void 0, __spreadArrays([args], rest));
}; };
exports.get = function (obj, path) {
    if (typeof path !== 'string' && !exports.isArr(path))
        return undefined;
    var result = obj;
    var parts = exports.isArr(path) ? path.slice() : path.split('.');
    var totalParts = parts.length;
    if (exports.isObj(result)) {
        for (var index = 0; index < totalParts; index++) {
            var key = parts[index];
            if (exports.isStr(key))
                result = result && result[key];
        }
    }
    return result;
};
exports.isArrMember = function (str) { return /\[[0-9]\]/i.test(str); };
exports.isArrMemberRegex = /\[[0-9]\]/i;
exports.has = function (obj, path) {
    if (!exports.isStr(path) && !exports.isArr(path))
        return false;
    var result = obj;
    var parts = (exports.isArr(path) ? path.slice() : path.split('.'));
    var key;
    if (exports.isObj(obj)) {
        while (parts.length) {
            key = parts.shift();
            if (exports.isStr(key)) {
                var match = key.match(exports.isArrMemberRegex);
                if (match) {
                    var bracket = match[0];
                    var bracketStartIndex = match.index;
                    var matchInput = match.input || '';
                    key = matchInput.substring(0, matchInput.indexOf(bracket));
                    if (bracketStartIndex !== undefined) {
                        if (bracketStartIndex > 0) {
                            result = result[key];
                            parts.unshift(bracket);
                            continue;
                        }
                        else {
                            var index = Number(match[0].replace(/(\[|\])/gi, ''));
                            if (exports.isArr(result)) {
                                if (index + 1 > result.length)
                                    return false;
                            }
                            // Start off with entering the array
                            result = result[0];
                        }
                    }
                }
                else {
                    result = result && result[key];
                    if (!result)
                        return false;
                }
            }
            else
                return false;
        }
        if (!result)
            return false;
    }
    else
        return false;
    return true;
};
