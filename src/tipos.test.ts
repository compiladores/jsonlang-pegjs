import { testGrammar } from ".";

describe('Tipos test', () => {
  test('test 01', () => {
    expect(1).toBe(1);
  })

  test('Declare variable test', async () => {
    const res = await testGrammar('v out = 5;');

    const resObject = [
      {
        declare: 'out',
        value: 5
      }
    ]
    expect(res).toStrictEqual(resObject);
  })

  test('Set variable test', async () => {
    const res = await testGrammar('out = 5;');

    const resObject = [
      {
        set: 'out',
        value: 5
      }
    ]
    expect(res).toStrictEqual(resObject);
  })


  test('String assignment test', async () => {
    const res = await testGrammar('v str = "str"; str = "hola";');

    const resObject = [
      {
        declare: 'str',
        value: { literal: 'str' }
      },
      {
        set: 'str',
        value: { literal: 'hola' }
      }
    ]
    expect(res).toStrictEqual(resObject);
  })

  test('Boolean assignment test', async () => {
    const res = await testGrammar('v boolVar = true;');

    const resObject = [
      {
        declare: 'boolVar',
        value: true
      }
    ]
    expect(res).toStrictEqual(resObject);
  })

  test('Boolean assignment test', async () => {
    const res = await testGrammar('v boolVar = true; v negated = !boolvar;');

    const resObject = [
      {
        declare: 'boolVar',
        value: true
      },
      {
        declare: 'negated',
        value: {
          unop: '!',
          arg: 'boolvar'
        }
      }
    ]
    expect(res).toStrictEqual(resObject);
  })

  test('Array assignment test', async () => {
    const res = await testGrammar('v arr = [1,2,3]');

    const resObject = [
      {
        declare: 'arr',
        value: [1, 2, 3]
      }
    ]
    expect(res).toStrictEqual(resObject);
  })

  test('Array assignment with different types test', async () => {
    const res = await testGrammar('v arr = [id, (x+5), "Hola"]');

    const resObject = [
      {
        declare: 'arr',
        value: [
          'id',
          {
            binop: '+',
            argl: 'x',
            argr: 5
          },
          { literal: "Hola" }
        ]
      }
    ]
    expect(res).toStrictEqual(resObject);
  })

  
  test('Dictionary assignment test', async () => {
    const res = await testGrammar('v arr = {"Key": 1}');

    const resObject = [
      {
        declare: 'arr',
        value: [
          {
            key: {
              literal: 'Key'
            },
            value: 1
          }
        ]
      }
    ]
    expect(res).toStrictEqual(resObject);
  })

  test('Empty dictionary assignment test', async () => {
    const res = await testGrammar('v arr = {}');

    const resObject = [
      {
        declare: 'arr',
        value: []
      }
    ]
    expect(res).toStrictEqual(resObject);
  })

  test('Empty dictionary with white spaces assignment test', async () => {
    const res = await testGrammar('v arr = {       }');

    const resObject = [
      {
        declare: 'arr',
        value: []
      }
    ]
    expect(res).toStrictEqual(resObject);
  })

  test('should access array in position test', async () => {
    const res = await testGrammar('v x = arr[1]');

    const resObject = [
      {
        declare: 'x',
        value: {
          id: 'arr',
          pos: 1
        }
      }
    ]

    expect(res).toStrictEqual(resObject);
  })

  test('should access array in position given by expression test', async () => {
    const res = await testGrammar('v x = arr[x+1]');

    const resObject = [
      {
        declare: 'x',
        value: {
          id: 'arr',
          pos: {
            binop: '+',
            argl: 'x', 
            argr: 1
          }
        }
      }
    ]

    expect(res).toStrictEqual(resObject);
  })

  test('should return null in dictionary with null param test', async () => {
    const res = await testGrammar('v x = dic.gk()');

    const resObject = [
      {
        declare: 'x',
        value: {
          id: 'dic',
          key: null
        }
      }
    ]

    expect(res).toStrictEqual(resObject);
  })

  test('should return null in dictionary with string param test', async () => {
    const res = await testGrammar('v x = dic.gk("string")');

    const resObject = [
      {
        declare: 'x',
        value: {
          id: 'dic',
          key: {
            literal: 'string'
          }
        }
      }
    ]

    expect(res).toStrictEqual(resObject);
  })

  test('should return null in dictionary with expression param test', async () => {
    const res = await testGrammar('v x = dic.gk(x+4)');

    const resObject = [
      {
        declare: 'x',
        value: {
          id: 'dic',
          key: {
            binop: '+',
            argl: 'x',
            argr: 4
          }
        }
      }
    ]

    expect(res).toStrictEqual(resObject);
  })
})