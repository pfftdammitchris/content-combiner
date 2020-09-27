"use strict";
exports.__esModule = true;
var utils_1 = require("./utils");
var Keymapper = /** @class */ (function () {
    function Keymapper() {
        this.keymap = new Map();
    }
    /**
     * Uses the key to retrieve the mapped value, which is used on the obj
     * @param { string } key
     */
    Keymapper.prototype.parse = function (mapper, obj) {
        if (arguments.length < 2) {
            throw new Error('Missing mapper or data object');
        }
        var result;
        if (obj) {
            if (utils_1.isStr(mapper) || utils_1.isArr(mapper)) {
                result = utils_1.get(obj, mapper);
            }
            else if (utils_1.isFnc(mapper)) {
                result = mapper(obj);
            }
            else {
                result = utils_1.get(obj, utils_1.isStr(mapper) ? mapper : String(mapper));
            }
        }
        else {
            throw new TypeError('Argument "obj" is null or undefined');
        }
        return result;
    };
    Keymapper.prototype.get = function (key) {
        return this.keymap.get(key);
    };
    /**
     * Sets the mapper into the keymap by the key
     * @param { string } key
     */
    Keymapper.prototype.set = function (key, mapper) {
        this.keymap.set(key, mapper);
        return this;
    };
    return Keymapper;
}());
exports["default"] = Keymapper;
