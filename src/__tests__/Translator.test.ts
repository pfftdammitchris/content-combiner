import { expect } from 'chai'
import Translator from '../Translator'

let translator: Translator

beforeEach(() => {
  translator = new Translator()
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

it('should set the key mapper', () => {
  const keymapper = 'fruita.oppo.fruit'
  translator.setKeymapper('fruit', keymapper)
  expect(translator.getKeymapper('fruit')).to.equal(keymapper)
})

it('should return the mapped value for string mappers', () => {
  translator.setKeymapper('fruit', 'fruita.oppo.fruit')
  const result = translator.get('fruit', dataObject)
  expect(result).to.equal('the path to fruit')
})

it('should return the mapped value for stringed array mappers', () => {
  translator.setKeymapper('fruit', ['fruita', 'oppo', 'fruit'])
  const result = translator.get('fruit', dataObject)
  expect(result).to.equal('the path to fruit')
})
