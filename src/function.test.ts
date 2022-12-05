import { testGrammar } from ".";

describe('Function test', () => {

  test('should create function', async () => {
    const res = await testGrammar('fn main () <>');

    const resObject = [
      {
        function: 'main',
        args: [],
        block: []
      }
    ]

    expect(res).toStrictEqual(resObject);
  })

  test('should create function with a parameter', async () => {
    const res = await testGrammar('fn main (x) <>');

    const resObject = [
      {
        function: 'main',
        args: [
          'x'
        ],
        block: []
      }
    ]

    expect(res).toStrictEqual(resObject);
  })

  test('should create function with a parameter and return value', async () => {
    const res = await testGrammar('fn foo(x) < r x+5;>');

    const resObject = [
      {
        function: 'foo',
        args: [
          'x'
        ],
        block: [
          {
            return: {
              binop: '+',
              argl: 'x',
              argr: 5
            }
          }
        ]

      }
    ]
    expect(res).toStrictEqual(resObject);
  })

  test('should create function with multiple parameters', async () => {
    const res = await testGrammar('fn main (x, y, z) <>');

    const resObject = [
      {
        function: 'main',
        args: [
          'x',
          'y',
          'z'
        ],
        block: []

      }
    ]

    expect(res).toStrictEqual(resObject);
  })

  test('should create function that returns null', async () => {
    const res = await testGrammar('fn main (x, y, z) < r;>');

    const resObject = [
      {
        function: 'main',
        args: [
          'x',
          'y',
          'z'
        ],
        block: [
          {
            return: null
          }
        ]

      }
    ]

    expect(res).toStrictEqual(resObject);
  })
})