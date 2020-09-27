"use strict";
exports.__esModule = true;
var src_1 = require("../src");
var utils_1 = require("../src/utils");
var mockData2 = [
    {
        title: 'ARSON AT HALL OF JUSTICE',
        details: "<p>Seeking the public's assistance in identifying the individuals who participated in an arson that occurred at the Louisville Hall of Justice,</p>",
        dates_of_birth_used: ['January 21st, 2001', 'January 22nd, 2001'],
        description: 'Louisville, Kentucky\r\nSeptember 23, 2020',
        url: 'https://www.hojustice.com/at-hall-of-justice',
        uid: '061f36e9ed009amk387988c38459dd2',
        sex: null,
        modified: '2020-09-25T14:00:55+00:00',
        published: '2020-09-25T14:00:55+00:00',
        relatives: {
            sisters: ['Jeanie Mo', 'Jane Nurse'],
            brothers: ['Michael Mo', 'Solomon Mo', { firstName: 'Bennie', lastName: 'Mo' }]
        }
    },
    {
        title: 'HOMICIDE AT QUEENSVILLE',
        details: 'last seen walking at a park in queensland',
        description: 'Louisville, Kentucky\r\nSeptember 23, 2020',
        url: 'https://cardiac-homeland.com/homicide-at-queensville/',
        uid: '061f36e9a3d9w387988c38459dd2',
        sex: null,
        modified: '2020-09-28T14:00:55+00:00',
        published: '2020-09-26T14:00:55+00:00',
        relatives: null
    },
];
var combiner = new src_1["default"]();
var getSiblings = function (type) { return function (item) {
    var _a;
    if (item && item[type]) {
        return _a = {},
            _a[type] = item[type].map(function (fullName) {
                if (typeof fullName === 'string') {
                    var _a = fullName.split(' '), firstName = _a[0], lastName = _a[1];
                    return {
                        firstName: firstName,
                        lastName: lastName
                    };
                }
                else if (fullName && typeof fullName === 'object') {
                    return {
                        firstName: fullName.firstName,
                        lastName: fullName.lastName
                    };
                }
            }),
            _a;
    }
}; };
var getBrothers = getSiblings('brothers');
var getSisters = getSiblings('sisters');
var composeSiblingMappers = function () {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return function (item) {
        return fns.reduceRight(function (acc, fn) { return (acc ? Object.assign(acc, fn(item)) : fn(item) || acc); }, undefined);
    };
};
// prettier-ignore
combiner.createFetcher(function () { return Promise.resolve(mockData2); }, {
    keymappers: {
        subtitle: 'description',
        description: 'details',
        updatedAt: 'modified',
        siblings: function (item) { return composeSiblingMappers(getBrothers, getSisters)(utils_1.get(item, 'relatives')); }
    }
});
combiner
    .execute()
    .then(function (results) {
    console.log(JSON.stringify(results, null, 2));
})["catch"](console.error);
