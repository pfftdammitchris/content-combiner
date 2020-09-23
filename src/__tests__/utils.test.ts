import { expect } from 'chai'
import { getMockDataObject } from './test-utils'
import {
  assign,
  compose,
  entries,
  get,
  isArr,
  isFnc,
  isObj,
  isStr,
  map,
  spread,
} from '../utils'
import { Mapper } from 'types'

describe('get', () => {
  let obj: { [key: string]: any }

  beforeEach(() => {
    obj = {
      food: {
        fruits: {
          apples: {
            numExpired: 2,
            numGood: 5,
          },
          bananas: {
            numExpired: 0,
            numGood: 4,
          },
        },
      },
    }
  })

  it('should get the result', () => {
    const result = get(obj, 'food.fruits.apples.numGood')
    expect(result).to.be.a('number')
    expect(result).to.eq(5)
  })

  it('should get the result', () => {
    const result = get(obj, 'food.fruits.bananas.numGood')
    expect(result).to.be.a('number')
    expect(result).to.eq(4)
  })

  const invalidGetPaths = ['food.fruits.gold.numGood', '', 2, 0, {}]

  invalidGetPaths.forEach((val) => {
    it(`should be undefined when using ${JSON.stringify(
      val,
    )} as a path`, () => {
      expect(get(obj, val as any)).to.be.undefined
    })
  })
})

describe('transducing', () => {
  const dataObject = getMockDataObject()
  const targetKeys = [
    'banana',
    'userAge',
    'userEmail',
    'userFirstName',
    'userLastName',
    'twitter',
    'facebook',
    'testings',
  ]
  const keymap = {
    banana: 'bananas',
    userAge: 'user.age',
    userEmail: 'user.email',
    userFirstName: 'user.name.first',
    userLastName: 'user.name.last',
    twitter: (item: typeof dataObject) => item.user.socialMedia.twitter,
    facebook: (item: typeof dataObject) => item.user.socialMedia.facebook,
    testings: (item: typeof dataObject) =>
      item.bananas.tests.map((t) => ({
        title: t.subject,
        isPassed: t.passed,
        testType: t.type,
      })),
  }

  it('', () => {
    function createKeymapAccumulator(key: string, mapper: Mapper) {
      return (acc: any, item: any) =>
        isStr(mapper) || isArr(mapper)
          ? assign(acc, { [key]: get(item, mapper) })
          : isFnc(mapper)
          ? assign(acc, { [key]: mapper(item) })
          : acc
    }

    const transducer = compose(
      ...map(entries(keymap), spread(createKeymapAccumulator)),
    )((acc: any, reducer: Function) => reducer(acc))

    console.log(transducer(dataObject))
  })
})
