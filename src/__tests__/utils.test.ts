import { expect } from 'chai'
import { get } from '../utils'

const mockDataObject = {
  apples: {
    numExpired: 2,
    numGood: 5,
  },
  bananas: {
    numExpired: 0,
    numGood: 4,
    tests: [
      { type: 'virus', subject: 'apple', passed: false },
      { type: 'bacteria', subject: 'microbes', passed: false },
    ],
  },
  user: {
    email: 'abc@gmail.com',
    name: {
      first: 'Bobbie',
      last: 'Mendoza',
    },
    age: 24,
    single: true,
    socialMedia: {
      twitter: {
        username: 'myTwitterUsername',
        url: 'https://twitter.com/myTwitterUsername',
      },
      facebook: {
        username: 'ib.21x123',
        url: 'https://facebook.com/ib.21x123',
      },
    },
  },
}

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

  const invalidGetPaths = ['food.fruits.gold.numGood', 2, 0, {}]

  invalidGetPaths.forEach((val) => {
    it(`should be undefined when using ${JSON.stringify(val)} as a path`, () => {
      expect(get(obj, val as any)).to.be.undefined
    })
  })
})

describe.skip('transducing', () => {
  const keymap = {
    banana: 'bananas',
    userAge: 'user.age',
    userEmail: 'user.email',
    userFirstName: 'user.name.first',
    userLastName: 'user.name.last',
    twitter: (item: typeof mockDataObject) => item.user.socialMedia.twitter,
    facebook: (item: typeof mockDataObject) => item.user.socialMedia.facebook,
    testings: (item: typeof mockDataObject) =>
      item.bananas.tests.map((t) => ({
        title: t.subject,
        isPassed: t.passed,
        testType: t.type,
      })),
  }
})
