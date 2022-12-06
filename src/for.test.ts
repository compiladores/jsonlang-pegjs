import { testGrammar } from ".";

describe('for tests', () => {

  test('should create simple empty for', async () => {
    const res = await testGrammar('f (it; 0; 8) <>');

    const resObject = [
      {
        iterator: 'it',
        from: 0,
        to: 8,
        do: []
      }
    ]
    expect(res).toStrictEqual(resObject);
  })

  test('should create simple while with only one action', async () => {
    const res = await testGrammar('f (it; 0; 8) < x = x + 5;>');

    const resObject = [
      {
        iterator: 'it',
        from: 0,
        to: 8,
        do: [
          {
            set: 'x',
            value: {
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

  test('should create simple while with multiple actions action', async () => {
    const res = await testGrammar('f (it; 0; 8) < x = x + 5; y = y + 5; z = x+y;>');

    const resObject = [
      {
        iterator: 'it',
        from: 0,
        to: 8,
        do: [
          {
            set: 'x',
            value: {
              binop: '+',
              argl: 'x',
              argr: 5
            }
          },
          {
            set: 'y',
            value: {
              binop: '+',
              argl: 'y',
              argr: 5
            }
          },
          {
            set: 'z',
            value: {
              binop: '+',
              argl: 'x',
              argr: 'y'
            }
          }
        ]
      }
    ]

    expect(res).toStrictEqual(resObject);
  })

  test('should create simple for with multiple actions action', async () => {
    const res = await testGrammar('f (it; 0; 8) < x = x + 5; y = y + 5; i (x < 5) <c>; z = x+y;>');

    const resObject = [
      {
        iterator: 'it',
        from: 0,
        to: 8,
        do: [
          {
            set: 'x',
            value: {
              binop: '+',
              argl: 'x',
              argr: 5
            }
          },
          {
            set: 'y',
            value: {
              binop: '+',
              argl: 'y',
              argr: 5
            }
          },
          {
            if: [
              {
                cond: {
                  binop: '<',
                  argl: 'x',
                  argr: 5
                },
                then: [
                  'continue'
                ]
              }
            ]
          },
          null,
          {
            set: 'z',
            value: {
              binop: '+',
              argl: 'x',
              argr: 'y'
            }
          }
        ]
      }
    ]

    expect(res).toStrictEqual(resObject);
  })
});