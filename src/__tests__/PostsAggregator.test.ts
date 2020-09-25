import { expect } from 'chai'
import sinon from 'sinon'
import { assign, entries } from '../utils'
import Keymapper from '../Keymapper'
import PostsAggregator from '../PostsAggregator'
import { getMockDataObject } from './test-utils'

let aggregator: PostsAggregator

beforeEach(() => {
  aggregator = new PostsAggregator()
})

describe('PostsAggregator', () => {
  it('should call the fetchers when executing', async () => {
    const spy = sinon.spy()
    aggregator.createFetcher(spy)
    await aggregator.execute()
    expect(spy.called).to.be.true
  })

  it.skip('should return undefined when undefined was the result of the fetch call', () => {
    //
  })

  it('should return expected results', async () => {
    const keymappers = {
      title: 'user.email',
      firstName: ['user', 'name', 'first'],
      lastName: 'user.name.last',
      socialMedia: (item) => ({
        twitter: item.user.socialMedia.twitter.url,
        facebook: item.user.socialMedia.facebook.url,
      }),
    }
    const dataObject = getMockDataObject()
    const someAggregator1 = aggregator.createFetcher(async () => [dataObject], {
      keymappers,
    })
    // const result = await aggregator.execute()
    const compose = (mappers: [string, T.FuncMapper<DataObject>][]) => {
      return (accumulate) => {
        const combined = entries(mappers).reduce(accumulate, {})
        return (item) => combined(item)
      }
    }

    const step = (item) => (acc, [key, mapper]) => assign(acc, { [key]: mapper })
    const composed = compose(keymappers)
    const xform = composed(step)
    console.log(xform(dataObject))
  })

  it('should use the target keys to create the mapped keys', () => {
    const dataObject = {
      title: 'this is my title. pistachios are good',
      description: 'what do you want?',
      age: 14,
      chips: 'no remarks',
      forensics: 'is useful',
    }
    const targetKeys = ['pistachios', 'chips']
    const keymap = {
      // pistachios:
    }
  })
})
