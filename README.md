# @jsmanifest/content-combiner

Grab data from multiple sources by providing a fetcher and a keymapping that you provide for each source which will translate their data structures to a unified one that you define by using the **Keymapper** API from this library.

## Installation

```bash
npm install --save @jsmanifest/content-combiner
```

## Usage

### Set up a fetcher for data and assign a keymapper to transform its data objects:

```js
import api from '../../reporter-api'
import Keymapper from '../Keymapper'
import ContentCombiner from '../Combiner'

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
  if (item && item[type]) {
    return {
      [type]: item[type].map((fullName) => {
        if (typeof fullName === 'string') {
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
    fns.reduceRight(
      (acc, fn) => (acc ? Object.assign(acc, fn(item)) : fn(item) || acc),
      undefined,
    )
}

// prettier-ignore
combiner#createFetcher(() => Promise.resolve(mockData2), {
  keymappers: {
    subtitle: 'description',
    description: 'details',
    updatedAt: 'modified',
    siblings: (item) => composeSiblingMappers(
      getBrothers,
      getSisters
    )(get(item, 'relatives')),
  },
})

combiner
  .execute()
  .then((results) => {
    console.log(JSON.stringify(results, null, 2))
  })
  .catch(console.error)
```

**Result**:

```json
[
  {
    "subtitle": "Louisville, Kentucky\r\nSeptember 23, 2020",
    "description": "<p>Seeking the public's assistance in identifying the individuals who participated in an arson that occurred at the Louisville Hall of Justice,</p>",
    "updatedAt": "2020-09-25T14:00:55+00:00",
    "siblings": {
      "sisters": [
        {
          "firstName": "Jeanie",
          "lastName": "Mo"
        },
        {
          "firstName": "Jane",
          "lastName": "Nurse"
        }
      ],
      "brothers": [
        {
          "firstName": "Michael",
          "lastName": "Mo"
        },
        {
          "firstName": "Solomon",
          "lastName": "Mo"
        },
        {
          "firstName": "Bennie",
          "lastName": "Mo"
        }
      ]
    }
  },
  {
    "subtitle": "Louisville, Kentucky\r\nSeptember 23, 2020",
    "description": "last seen walking at a park in queensland",
    "updatedAt": "2020-09-28T14:00:55+00:00"
  }
]
```

### Combining multiple fetchers from different sources/apis to return the same data structure

Apply the previous steps starting with `createFetcher`. Once `execute` is called the fetcher will be called and each returned result of each fetcher will be used to apply the keymappings. If the result you return from the fetch function is an array, it will map over each item and return an array of the mapped results. If the fetch function returns an object, it will return a single object with the mapped result.

When you have lets say 10 different fetchers and call `execute`, you will receive an array of 10 items (each of which will be an array or the single object from the corresponding fetcher)

You have now a unified data structure and what you want to do with that data is all up to you.

## API

### `Combiner`

#### `Combiner#execute`

#### `Combiner#createFetcher

#### `Combiner#getKeymap`

#### `Combiner#getKeymapper`

#### `Combiner#setKeymapper`

#### `Combiner#getDataKeys`

#### `Combiner#setDataKeys`

### `Keymapper`

#### `Keymapper#get`

#### `Keymapper#set`

#### `Keymapper#parse`
