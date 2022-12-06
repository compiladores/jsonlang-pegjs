import { testGrammar } from ".";

describe('do-until tests', () => {

  test('should create simple empty do until ', async () => {
    const res = await testGrammar('du <> ();');

    const resObject = [
      {
        do: [],
        until: null
      }
    ]
    expect(res).toStrictEqual(resObject);
  })

  test('should create simple empty do until with condition', async () => {
    const res = await testGrammar('du <> (x > 5);');

    const resObject = [
      {
        do: [],
        until: { binop: '>', argl: 'x', argr: 5 }
      }
    ]
    expect(res).toStrictEqual(resObject);
  })

  test('should create simple until with only one action', async () => {
    const res = await testGrammar('du <x = x + 5;> (x > 5);');

    const resObject = [
      {
        do: [
          {
            set: 'x',
            value: {
              binop: '+',
              argl: 'x',
              argr: 5
            }
          }
        ],
        until: {
          binop: '>',
          argl: 'x',
          argr: 5
        }
      }
    ]

    expect(res).toStrictEqual(resObject);
  })

  test('should create simple while with multiple actions action', async () => {
    const res = await testGrammar('du < x = x + 5; y = y + 5; z = x+y;> (x > 5)');

    const resObject = [
      {
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
        ],
        until: {
          binop: '>',
          argl: 'x',
          argr: 5
        }
      }
    ]

    expect(res).toStrictEqual(resObject);
  })
});