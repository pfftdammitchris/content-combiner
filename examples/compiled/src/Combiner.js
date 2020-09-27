"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _keymapper, _fetchers, _dataKeys, _createId;
exports.__esModule = true;
var Keymapper_1 = require("./Keymapper");
var utils_1 = require("./utils");
var PostsAggregator = /** @class */ (function () {
    function PostsAggregator(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.dataKeys, dataKeys = _c === void 0 ? [] : _c, _d = _b.fetchers, fetchers = _d === void 0 ? [] : _d, keymapper = _b.keymapper;
        _keymapper.set(this, new Keymapper_1["default"]());
        _fetchers.set(this, void 0);
        _dataKeys.set(this, []);
        _createId.set(this, function () {
            return "_" + Math.random().toString(36).substr(2, 9);
        });
        __classPrivateFieldSet(this, _fetchers, fetchers);
        __classPrivateFieldSet(this, _keymapper, keymapper && keymapper instanceof Keymapper_1["default"] ? keymapper : new Keymapper_1["default"]());
        this.setDataKeys(dataKeys);
    }
    /**
     * Runs each fetcher and parses each list of results using the keymappers that
     * are currently registered
     * @param { object } options - Options passed to each fetch function
     */
    PostsAggregator.prototype.execute = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var results, numFetchers, index, fetch_1, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        results = [];
                        numFetchers = __classPrivateFieldGet(this, _fetchers).length;
                        index = 0;
                        _a.label = 1;
                    case 1:
                        if (!(index < numFetchers)) return [3 /*break*/, 4];
                        fetch_1 = __classPrivateFieldGet(this, _fetchers)[index];
                        return [4 /*yield*/, fetch_1(options)];
                    case 2:
                        result = _a.sent();
                        if (result) {
                            if (utils_1.isArr(result)) {
                                results = results.concat(result);
                            }
                            else {
                                results.push([result]);
                            }
                        }
                        _a.label = 3;
                    case 3:
                        index++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, results];
                }
            });
        });
    };
    PostsAggregator.prototype.createFetcher = function (fetch, options) {
        var _this = this;
        var parseDataObject = function (dataObject, keymappers) {
            return utils_1.entries(keymappers).reduce(function (acc, _a) {
                var key = _a[0], mapper = _a[1];
                acc[key] = __classPrivateFieldGet(_this, _keymapper).parse(mapper, dataObject);
                return acc;
            }, {});
        };
        var err;
        // prettier-ignore
        if (!utils_1.isFnc(fetch))
            err = new Error('The fetch function provided as the first argument is not a function');
        if (!options.keymappers)
            err = new TypeError('keymappers is not an object');
        if (err)
            throw err;
        var fetcher = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return __awaiter(_this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, fetch.apply(void 0, args)];
                        case 1:
                            result = _a.sent();
                            if (!result)
                                return [2 /*return*/, result];
                            return [2 /*return*/, utils_1.isArr(result)
                                    ? result.reduce(function (acc, item) {
                                        return item ? acc.concat(parseDataObject(item, options.keymappers)) : acc;
                                    }, [])
                                    : parseDataObject(result, options.keymappers)];
                    }
                });
            });
        };
        fetcher.id = __classPrivateFieldGet(this, _createId).call(this);
        __classPrivateFieldGet(this, _fetchers).push(fetcher);
        return fetcher;
    };
    /** Formats/parses the keymappers and returns the keymap used on the executor */
    PostsAggregator.prototype.getKeymap = function () {
        var _this = this;
        return Array.from(new Set(Array.from(__classPrivateFieldGet(this, _keymapper).keymap.keys()).concat(this.getDataKeys()))).reduce(function (acc, key) {
            var mapper = __classPrivateFieldGet(_this, _keymapper).get(key);
            if (utils_1.isStr(mapper) || utils_1.isArr(mapper)) {
                // Mapped directly by property swapping
                acc[key] = function (item) { return __classPrivateFieldGet(_this, _keymapper).parse(mapper, item); };
            }
            else if (utils_1.isFnc(mapper)) {
                // Function mapper
                acc[key] = mapper;
            }
            else {
                // Default mapper (the key itself)
                acc[key] = function (item) { return __classPrivateFieldGet(_this, _keymapper).parse(key, item); };
            }
            return acc;
        }, {});
    };
    PostsAggregator.prototype.getKeymapper = function (key) {
        return __classPrivateFieldGet(this, _keymapper).get(key);
    };
    PostsAggregator.prototype.setKeymapper = function (key, mapper) {
        var _this = this;
        if (utils_1.isStr(key)) {
            __classPrivateFieldGet(this, _keymapper).set(key, mapper);
        }
        else if (utils_1.isObj(key)) {
            utils_1.entries(key).forEach(function (_a) {
                var k = _a[0], v = _a[1];
                __classPrivateFieldGet(_this, _keymapper).set(k, v);
            });
        }
        return this;
    };
    PostsAggregator.prototype.getDataKeys = function () {
        return __classPrivateFieldGet(this, _dataKeys);
    };
    PostsAggregator.prototype.setDataKeys = function (keys) {
        __classPrivateFieldSet(this, _dataKeys, keys);
        return this;
    };
    return PostsAggregator;
}());
_keymapper = new WeakMap(), _fetchers = new WeakMap(), _dataKeys = new WeakMap(), _createId = new WeakMap();
exports["default"] = PostsAggregator;
