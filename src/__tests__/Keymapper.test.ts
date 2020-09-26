import { expect } from 'chai'
import Keymapper from '../Keymapper'

let keymapper: Keymapper

beforeEach(() => {
  keymapper = new Keymapper()
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
    keymapper.set('fruit', mapper)
    expect(keymapper.get('fruit')).to.equal(mapper)
  })

  it('should parse and return the mapped value for string mappers', () => {
    keymapper.set('fruit', 'fruita.oppo.fruit')
    const result = keymapper.parse('fruita.oppo.fruit', dataObject)
    expect(result).to.equal('the path to fruit')
  })

  it('should parse and return the mapped value for stringed array mappers', () => {
    keymapper.set('fruit', ['fruita', 'oppo', 'fruit'])
    const result = keymapper.parse(['fruita', 'oppo', 'fruit'], dataObject)
    expect(result).to.equal('the path to fruit')
  })

  it('should parse and return the mapped value for func mappers', () => {
    keymapper.set('fruit', (item) => item.fruita.oppo.fruit)
    const result = keymapper.parse((item) => item.fruita.oppo.fruit, dataObject)
    expect(result).to.equal('the path to fruit')
  })
})
