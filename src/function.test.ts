import { testGrammar } from ".";

describe('Function test', () => {

  test('should create function', async () => { 
    const res = await testGrammar('fn main () <>');

    const resObject = [
      {
        type: 'function',
        id: 'main',
        params: [],
        body: {
          type: 'FunctionBody',
          body: []
        }
      },
    ]

    expect(res).toStrictEqual(resObject);
  })

  test('should create function with a parameter', async () => { 
    const res = await testGrammar('fn main (x) <>');

    const resObject = [
      {
        type: 'function',
        id: 'main',
        params: [
          "x"
        ],
        body: {
          type: 'FunctionBody',
          body: []
        }
      },
    ]

    expect(res).toStrictEqual(resObject);
  })
})