import { expect } from 'chai'
import { get } from '../utils'

it('should get the result', () => {
  const obj = {
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
  const result = get(obj, 'food.fruits.apples.numGood')
  expect(result).to.be.a('number')
  expect(result).to.eq(5)
})
