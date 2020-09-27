# content-combiner

## Installation

```bash
npm install --save @jsmanifest/content-combiner
```

## Usage

```js
import api from '../../reporter-api'
import Keymapper from '../Keymapper'
import ContentCombiner from '../Combiner'

const mockData = [
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
        const [firstName, lastName] = fullName.split(' ')
        return { firstName, lastName }
      }),
    }
  }
}

const getBrothers = getSiblings('brothers')
const getSisters = getSiblings('sisters')

const composeSi


blingMappers = (...fns) => (item) =>
  fns.reduce((acc, fn) => (acc ? Object.assign(acc, fn(item)) : fn(item) || acc))

const keymappers = {
  subtitle: 'description',
  description: 'details',
  updatedAt: 'modified',
  siblings: (item) => ({
    ...getSiblings,
  }),
}

combiner.createFetcher(
  async ({ limit = 50 }) => {
    const results = mockData

    if (results.length > limit) {
      return results.slice(0, limit)
    }

    return results
  },
  {
    keymappers: {},
  },
)
```
