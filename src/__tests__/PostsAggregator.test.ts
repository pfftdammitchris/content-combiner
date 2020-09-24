import { expect } from 'chai'
import sinon from 'sinon'
import PostsAggregator from '../PostsAggregator'

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
