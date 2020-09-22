import { expect } from 'chai'
import Keymapper from '../Keymapper'

let translator: Keymapper

beforeEach(() => {
  translator = new Keymapper()
})

const dataObject = {
  fruits: ['apples'],
  fruita: {
    apple: true,
    banana: false,
    oppo: {
      fruit: 'the path to fruit',
    },
  },
}

it('should set the mapper', () => {
  const mapper = 'fruita.oppo.fruit'
  translator.setMapper('fruit', mapper)
  expect(translator.getMapper('fruit')).to.equal(mapper)
})

it('should return the mapped value for string mappers', () => {
  translator.setMapper('fruit', 'fruita.oppo.fruit')
  const result = translator.get('fruit', dataObject)
  expect(result).to.equal('the path to fruit')
})

it('should return the mapped value for stringed array mappers', () => {
  translator.setMapper('fruit', ['fruita', 'oppo', 'fruit'])
  const result = translator.get('fruit', dataObject)
  expect(result).to.equal('the path to fruit')
})

it('should return the mapped value for func mappers', () => {
  translator.setMapper('fruit', (item) => item.fruita.oppo.fruit)
  const result = translator.get('fruit', dataObject)
  expect(result).to.equal('the path to fruit')
})
