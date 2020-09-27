import sinon from 'sinon'
import { expect } from 'chai'
import { entries, keys } from '../utils'
import Keymapper from '../Keymapper'
import ContentCombiner from '../Combiner'

const mockData = getMockData()

const dataKeys = [
  'title',
  'subtitle',
  'description',
  'age',
  'birthdates',
  'id',
  'gender',
  'weight',
  'url',
  'race',
  'lastUpdated',
]

let aggregator: ContentCombiner<typeof mockData[0]>

beforeEach(() => {
  aggregator = new ContentCombiner()
})

describe('ContentCombiner', () => {
  it('should call the fetchers when executing', async () => {
    const spy = sinon.spy()
    aggregator.createFetcher(spy, { keymappers: {} as any })
    await aggregator.execute()
    expect(spy.called).to.be.true
  })

  it('should set and get mappers as expected', () => {
    expect(aggregator.getKeymapper('subtitle')).to.be.undefined
    aggregator.setKeymapper('subtitle', 'description')
    expect(aggregator.getKeymapper('subtitle')).to.equal('description')
  })

  it('should set the data keys', () => {
    const dataKeys = ['title', 'subtitle', 'lastUpdated']
    aggregator.setDataKeys(dataKeys)
    expect(aggregator.getDataKeys()).to.equal(dataKeys)
  })

  it('should return the finalized keymap in the right structure', () => {
    aggregator.setDataKeys(dataKeys)
    const keymap = aggregator.getKeymap()
    entries(keymap).forEach(([key, value]) => {
      expect(value).to.be.a('function')
      expect(value).to.equal(keymap[key])
    })
  })

  it('should return the expected parsed results', () => {
    const keymappers = {
      subtitle: 'description',
      description: 'details',
      age: (item: any) =>
        item.age_min !== undefined
          ? item.age_min
          : item.age_max !== undefined
          ? item.age_max
          : undefined,
      birthdates: (item: any) =>
        (item.dates_of_birth_used && item.dates_of_birth_used.join(', ')) || '',
      id: 'uid',
      gender: 'sex',
      race: ['race', 'race_raw'],
      lastUpdated: 'modified',
    }
    aggregator.setDataKeys(dataKeys)
    aggregator.createFetcher(async () => mockData.slice(0, 5), { keymappers })
    return aggregator
      .execute()
      .then((result) => {
        expect(Object.keys(result[0])).to.have.deep.members(keys(keymappers))
      })
      .catch((err) => {
        throw err
      })
  })

  it('should return the expected parsed results', async () => {
    const _dataKeys = [
      'title',
      'subtitle',
      'description',
      'age',
      'birthdates',
      'age',
      'id',
      'gender',
      'weight',
      'url',
      'race',
      'lastUpdated',
    ]
    const keymappers = {
      subtitle: 'description',
      description: 'details',
      age: (item: any) =>
        item.age_min !== undefined
          ? item.age_min
          : item.age_max !== undefined
          ? item.age_max
          : undefined,
      birthdates: (item: any) =>
        item.dates_of_birth_used && item.dates_of_birth_used.join(', '),
      id: 'uid',
      gender: 'sex',
      race: ['race', 'race_raw'],
      lastUpdated: 'modified',
    }
    const keymapper = new Keymapper()
    _dataKeys.forEach((dataKey) => {
      if (dataKey in keymappers) {
        keymapper.set(dataKey, keymappers[dataKey])
      } else {
        keymapper.set(dataKey, dataKey)
      }
    })
    const data = mockData.slice(0, 2)
    aggregator.setDataKeys(_dataKeys)
    aggregator.createFetcher(() => Promise.resolve(data), { keymappers })
    return aggregator.execute().then((results) => {
      return results.forEach((dataObject, index) => {
        const expectedResult = {}
        keys(dataObject).forEach((dataKey) => {
          expectedResult[dataKey] = keymapper.parse(
            keymapper.get(dataKey) as string,
            mockData[index],
          )
        })
        expect(dataObject).to.deep.eq(expectedResult)
      })
    })
  })
})

const mockData2 = [
  {
    title: 'ARSON AT HALL OF JUSTICE',
    details:
      "<p>Seeking the public's assistance in identifying the individuals who participated in an arson that occurred at the Louisville Hall of Justice,</p>",
    dates_of_birth_used: ['January 21st, 2001', 'January 22nd, 2001'],
    description: 'Louisville, Kentucky\r\nSeptember 23, 2020',
    url: 'https://www.hojustice.com/at-hall-of-justice',
    uid: '061f36e9ed009amk387988c38459dd2',
    sex: null,
    modified: '2020-09-25T14:00:55+00:00',
    published: '2020-09-25T14:00:55+00:00',
    relatives: {
      sisters: ['Jeanie Mo', 'Jane Nurse'],
      brothers: ['Michael Mo', 'Solomon Mo', { firstName: 'Bennie', lastName: 'Mo' }],
    },
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
    relatives: null,
  },
]

const combiner = new ContentCombiner()

const getSiblings = (type) => (item) => {
  if (item[type]) {
    return {
      [type]: item[type].map((fullName) => {
        if (Array.isArray(fullName)) {
          const [firstName, lastName] = fullName.split(' ')
          return {
            firstName,
            lastName,
          }
        } else if (fullName && typeof fullName === 'object') {
          return {
            firstName: fullName.firstName,
            lastName: fullName.lastName,
          }
        }
      }),
    }
  }
}

const getBrothers = getSiblings('brothers')
const getSisters = getSiblings('sisters')

const composeSiblingMappers = (...fns) => {
  return (item) =>
    fns.reduce(
      (acc, fn) => (acc ? Object.assign(acc, fn(item)) : fn(item) || acc),
      undefined,
    )
}

// prettier-ignore
combiner.createFetcher(() => Promise.resolve(mockData2), {
  keymappers: {
    subtitle: 'description',
    description: 'details',
    updatedAt: 'modified',
    siblings: composeSiblingMappers(
      getBrothers,
      getSisters
    ),
  },
})

function getMockData() {
  return [
    {
      title: 'MARGARET THORNTON LAMMERS',
      details:
        '<p>On July 11, 2017, Margaret “Peggy” Thornton Lammers was found deceased inside her family’s vacation home on Stove Point in Deltaville, Virginia. A resident of Cuyahoga County, Ohio, Lammers, who was a married mother of three adult children, was settling the estate of her parents in the Richmond and Middlesex County (Virginia) areas. Lammers departed Richmond for the Deltaville home on July 8, 2017. Her last known contact was the afternoon of July 10, 2017. After receiving a request for a welfare check, Middlesex County Sheriff’s Office arrived at the Deltaville home, where Lammers was found deceased, as a result of blunt force trauma. The FBI is asking for cooperation from the public regarding any information pertaining to Lammers’ death, people she was known to communicate with, or activity occurring near the residence.</p>\r\n<p> </p>',
      dates_of_birth_used: ['January 24, 1956'],
      description: 'Homicide Victim\r\nDeltaville, Virginia\r\nJuly 11, 2017',
      height_max: 68,
      weight: '135 pounds',
      weight_max: 135,
      race_raw: 'White',
      race: 'white',
      age_range: null,
      uid: 'a5c3e19fce0f41db994af0df6fac397c',
      sex: 'Female',
      modified: '2020-09-25T18:44:13+00:00',
    },
    {
      age_min: null,
      age_max: null,
      title: 'ARSON AT HALL OF JUSTICE',
      details:
        "<p>The Federal Bureau of Investigation's (FBI) Louisville Field Office is seeking the public's assistance in identifying the individuals who participated in an arson that occurred at the Louisville Hall of Justice, located at 600 West Jefferson Street, Louisville, Kentucky. </p>\r\n<p> </p>\r\n<p>On September 23, 2020, at approximately 7:36 p.m., two individuals set fire to the Hall of Justice using an accelerant in a white bottle. The first unknown suspect is described as a Black male wearing a blue hoodie, dark shorts, dark socks, and red shoes. The second unknown suspect is described as a Black male wearing a black hoodie, dark pants, and white shoes.</p>\r\n<p> </p>\r\n<p> </p>",
      dates_of_birth_used: null,
      eyes_raw: null,
      description: 'Louisville, Kentucky\r\nSeptember 23, 2020',
      url: 'https://www.fbi.gov/wanted/seeking-info/-arson-at-hall-of-justice-',
      weight_min: null,
      height_min: null,
      race: null,
      age_range: null,
      uid: '061f36e9ed0e49a1a387988c38459dd2',
      sex: null,
      modified: '2020-09-25T14:00:55+00:00',
    },
    {
      age_min: null,
      age_max: null,
      title: 'APT 41 GROUP',
      details: null,
      description: '',
      weight: null,
      weight_max: null,
      url: 'https://www.fbi.gov/wanted/cyber/apt-41-group',
      status: 'na',
      race_raw: null,
      race: null,
      age_range: null,
      uid: '32eeba50d906400786c23ed38133fd04',
      sex: null,
      modified: '2020-09-24T15:39:20+00:00',
    },
  ]
}
