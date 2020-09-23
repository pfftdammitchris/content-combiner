export function getMockDataObject() {
  return {
    apples: {
      numExpired: 2,
      numGood: 5,
    },
    bananas: {
      numExpired: 0,
      numGood: 4,
      tests: [
        { type: 'virus', subject: 'apple', passed: false },
        { type: 'bacteria', subject: 'microbes', passed: false },
      ],
    },
    user: {
      email: 'abc@gmail.com',
      name: {
        first: 'Bobbie',
        last: 'Mendoza',
      },
      age: 24,
      single: true,
      socialMedia: {
        twitter: {
          username: 'myTwitterUsername',
          url: 'https://twitter.com/myTwitterUsername',
        },
        facebook: {
          username: 'ib.21x123',
          url: 'https://facebook.com/ib.21x123',
        },
      },
    },
  }
}
