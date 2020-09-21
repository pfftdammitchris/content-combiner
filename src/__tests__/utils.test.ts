import { expect } from 'chai'
import { get } from '../utils'

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

  const invalidGetPaths = ['food.fruits.gold.numGood', '', 2, 0, {}, []]

  invalidGetPaths.forEach((val) => {
    it(`should be undefined when using ${JSON.stringify(
      val,
    )} as a path`, () => {
      expect(get(obj, val as any)).to.be.undefined
    })
  })
})
