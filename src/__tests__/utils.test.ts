import { expect } from 'chai'
import { getMockDataObject } from './test-utils'
import { get } from '../utils'
import { FinalizedKeymap, Mapper } from 'types'

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
  function getMappedValue(key, item, mapper) {
    return { [key]: getMapper(mapper)?.(item) }
  }
  function getMapper(mapper: Mapper) {
    if (typeof mapper === 'string' || Array.isArray(mapper)) {
      return (item: any) => get(item, mapper)
    } else if (typeof mapper === 'function') {
      return mapper
    }
  }
  const formattedKeymapper = Object.entries(keymap).reduce(
    (acc: FinalizedKeymap<any>, [key, mapper]) => {
      acc[key] = getMapper(mapper)
      return acc
    },
    {},
  )

  function createTransducedKeymapper(
    key: string,
    mapper: string | string[] | ((item: any) => any),
  ) {
    return (step: (acc: any, item: any) => any) => {
      return (acc: any, item: any) => {
        return step(acc, getMapper())
      }
    }
  }

  it('', () => {
    const bananaMapper = (mapper: Function) => (
      step: (acc: any, item: any) => typeof acc,
    ) => (acc: any, item: any) => step(acc, mapper(item))
    const userAgeMapper = (mapper: Function) => (acc: any, item: any) =>
      _.get(item, keymap.userAge)
    const userEmailMapper = (mapper: Function) => (acc: any, item: any) =>
      _.get(item, keymap.userEmail)
    const userFirstNameMapper = (mapper: Function) => (acc: any, item: any) =>
      _.get(item, keymap.userFirstName)
    const userLastNameMapper = (mapper: Function) => (acc: any, item: any) =>
      _.get(item, keymap.userLastName)

    const step = (acc: any, val: any) => _.assign(acc, val)

    const xform = _.flowRight(
      bananaMapper,
      userAgeMapper,
      userEmailMapper,
      userFirstNameMapper,
      userLastNameMapper,
      (reducer: Function) => keymap.twitter,
      (reducer: Function) => keymap.facebook,
      (reducer: Function) => keymap.testings,
    )(step)

    const transducer = _.reduce()
  })
})
