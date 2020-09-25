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

describe('Keymapper', () => {
  it('should set the mapper', () => {
    const mapper = 'fruita.oppo.fruit'
    translator.set('fruit', mapper)
    expect(translator.getMapper('fruit')).to.equal(mapper)
  })

  it('should return the mapped value for string mappers', () => {
    translator.set('fruit', 'fruita.oppo.fruit')
    const result = translator.get('fruit', dataObject)
    expect(result).to.equal('the path to fruit')
  })

  it('should return the mapped value for stringed array mappers', () => {
    translator.set('fruit', ['fruita', 'oppo', 'fruit'])
    const result = translator.get('fruit', dataObject)
    expect(result).to.equal('the path to fruit')
  })

  it('should return the mapped value for func mappers', () => {
    translator.set('fruit', (item) => item.fruita.oppo.fruit)
    const result = translator.get('fruit', dataObject)
    expect(result).to.equal('the path to fruit')
  })
})
