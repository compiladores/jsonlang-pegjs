import { testGrammar } from ".";

describe('Binops test', () => {
  test('Add binop test', async () => {
    const res = await testGrammar('v out = 1 + 2;');

    const resObject = [
      {
        declare: 'out',
        value: {
          binop: '+',
          argl: 1,
          argr: 2
        }
      }
    ]
    expect(res).toStrictEqual(resObject);
  })

  test('Substract binop test', async () => {
    const res = await testGrammar('v out = 1 - 2;');

    const resObject = [
      {
        declare: 'out',
        value: {
          binop: '-',
          argl: 1,
          argr: 2
        }
      }
    ]
    expect(res).toStrictEqual(resObject);
  })

  test('Multiply binop test', async () => {
    const res = await testGrammar('v out = 1 * 2;');

    const resObject = [
      {
        declare: 'out',
        value: {
          binop: '*',
          argl: 1,
          argr: 2
        }
      }
    ]
    expect(res).toStrictEqual(resObject);
  })

  test('Divide binop test', async () => {
    const res = await testGrammar('v out = 1 / 2;');

    const resObject = [
      {
        declare: 'out',
        value: {
          binop: '/',
          argl: 1,
          argr: 2
        }
      }
    ]
    expect(res).toStrictEqual(resObject);
  })

  test('Multiply and add test', async () => {
    const res = await testGrammar('v out = (3*2) + 5;');

    const resObject = [
      {
        declare: 'out',
        value: {
          binop: '+',
          argl: {
            binop: '*',
            argl: 3,
            argr: 2
          },
          argr: 5
        }
      }
    ]
    expect(res).toStrictEqual(resObject);
  })

  test('Multiply and add with variables test', async () => {
    const res = await testGrammar('v out = (x*y) + z;');

    const resObject = [
      {
        declare: 'out',
        value: {
          binop: '+',
          argl: {
            binop: '*',
            argl: 'x',
            argr: 'y'
          },
          argr: 'z'
        }
      }
    ]
    expect(res).toStrictEqual(resObject);
  })

  test('Multiply and add with variables different orders test', async () => {
    const res = await testGrammar('v out = z + (x*y);');

    const resObject = [
      {
        declare: 'out',
        value: {
          binop: '+',
          argl: 'z',
          argr: {
            binop: '*',
            argl: 'x',
            argr: 'y'
          }
        }
      }
    ]
    expect(res).toStrictEqual(resObject);
  })

  test('ADD: First value is boolean', async () =>  {        
    await expect(testGrammar('v out = false + 9;'))
    .rejects
    .toThrow('Error: INVALID OP for BOOLEAN');
  });

  test('ADD: Second value is boolean', async () =>  {        
    await expect(testGrammar('v out = 8 + false;'))
    .rejects
    .toThrow('Error: INVALID OP for BOOLEAN');
  });

  test('ADD: First value is string', async () =>  {        
    await expect(testGrammar('v out = "string" + 9;'))
    .rejects
    .toThrow('Error: INVALID OP for STRING');
  });

  test('ADD: Second value is string', async () =>  {        
    await expect(testGrammar('v out = 8 + "string";'))
    .rejects
    .toThrow('Error: INVALID OP for STRING');
  });

  //

  test('ADD: First value is array', async () =>  {        
    await expect(testGrammar('v out = [1,2,3] + 9;'))
    .rejects
    .toThrow('Error: INVALID OP for ARRAY');
  });

  test('ADD: Second value is array', async () =>  {        
    await expect(testGrammar('v out = 8 + [1,2,3];'))
    .rejects
    .toThrow('Error: INVALID OP for ARRAY');
  });

  test('ADD: First value is dictionary', async () =>  {        
    await expect(testGrammar('v x = 5 + { "key": 1 }'))
    .rejects
    .toThrow('Error: INVALID OP for DICTIONARY');
  });

  test('ADD: Second value is dictionary', async () =>  {        
    await expect(testGrammar('v x = 5 + { "key": 1 }'))
    .rejects
    .toThrow('Error: INVALID OP for DICTIONARY');
  });


  test('Multiple values and one is a boolean', async () =>  {        
    await expect(testGrammar('v out = 8 + 8 + false;'))
    .rejects
    .toThrow('Error: INVALID OP for BOOLEAN');
  });

  test('Multiple values and one is a string', async () =>  {        
    await expect(testGrammar('v out = 8 + 8 + "false";'))
    .rejects
    .toThrow('Error: INVALID OP for STRING');
  });

  test('Multiple values and one is an array', async () =>  {        
    await expect(testGrammar('v out = 8 + 8 + [1,2,3];'))
    .rejects
    .toThrow('Error: INVALID OP for ARRAY');
  });

  test('Multiple values and one is a dictionary', async () =>  {        
    await expect(testGrammar('v out = 8 + 8 + { "key": 1 };'))
    .rejects
    .toThrow('Error: INVALID OP for DICTIONARY');
  });

  test('Compare bool values', async () => {
    const res = await testGrammar('v x = false ?= true;');

    const resObject = [
      {
        declare: 'x',
        value: {
          binop: '==',
          argl: false,
          argr: true
        }
      }
    ]
    expect(res).toStrictEqual(resObject);
  })

  test('Compare bool values with non bool', async () =>  {        
    await expect(testGrammar('v x = false ?= 5;'))
    .rejects
    .toThrow('ERROR: Invalid comparison');
  });


  test('Compare integer values', async () => {
    const res = await testGrammar('v x = 1 ?= 1;');

    const resObject = [
      {
        declare: 'x',
        value: {
          binop: '==',
          argl: 1,
          argr: 1
        }
      }
    ]
    expect(res).toStrictEqual(resObject);
  })

  test('Compare integer values with non integer', async () =>  {        
    await expect(testGrammar('v x = [1,2,3] ?= 5;'))
    .rejects
    .toThrow('ERROR: Invalid comparison');
  });


  test('Compare bool values with non bool', async () =>  {        
    await expect(testGrammar('v x = false ?= 5;'))
    .rejects
    .toThrow('ERROR: Invalid comparison');
  });

  test('Compare string values', async () => {
    const res = await testGrammar('v x = "String" ?= "Otro";');

    const resObject = [
      {
        declare: 'x',
        value: {
          binop: '==',
          argl: { literal: "String" },
          argr: { literal: "Otro" }
        }
      }
    ]
    expect(res).toStrictEqual(resObject);
  })

  test('Compare string values with non string', async () =>  {        
    await expect(testGrammar('v x = "string" ?= 5;'))
    .rejects
    .toThrow('ERROR: Invalid comparison');
  });

  test('Compare array values', async () => {
    const res = await testGrammar('v x = [1,2,3] ?= [1,2,3,4];');

    const resObject = [
      {
        declare: 'x',
        value: {
          binop: '==',
          argl: [1,2,3],
          argr: [1,2,3,4]
        }
      }
    ]
    expect(res).toStrictEqual(resObject);
  })

  test('Compare array values with non array', async () =>  {        
    await expect(testGrammar('v x = [1,2,3] ?= 5;'))
    .rejects
    .toThrow('ERROR: Invalid comparison');
  });

  test('Compare dictionaries values', async () => {
    const res = await testGrammar('v x = {"Hola": 1} ?= {"Hola": 1}');

    const resObject = [
      {
        declare: 'x',
        value: {
          binop: '==',
          argl: [
            { 
              key: { literal: "Hola" },
              value: 1
            }
          ],
          argr: [
            { 
              key: { literal: "Hola" },
              value: 1
            }
          ]
        }
      }
    ]
    expect(res).toStrictEqual(resObject);
  })

  test('Multiple operations', async () => {
    const res = await testGrammar('v out = (x+y+5) * (y-z+2|3)');

    const resObject = [
      {
        declare: 'out',
        value: {
          binop: '*',
          argl: {
            binop: '+',
            argl: 'x',
            argr: {
              binop: '+',
              argl: 'y',
              argr: 5
            }
          },
          argr: {
            binop: '-',
            argl: 'y',
            argr: {
              binop: '+',
              argl: 'z',
              argr: {
                binop: '|',
                argl: 2,
                argr: 3
              }
            }
          }
        }
      }
    ]
    expect(res).toStrictEqual(resObject);
  })

  test('Compare dictionary with non dictionary', async () =>  {        
    await expect(testGrammar('v x = {"Hola":1} ?= 5;'))
    .rejects
    .toThrow('ERROR: Invalid comparison');
  });

  test('Multiple operations', async () => {
    const res = await testGrammar('v x = 2^(3^2)');

    const resObject = [
      {
        declare: 'x',
        value: {
          binop: '^',
          argl: 2,
          argr: {
            binop: '^',
            argl: 3,
            argr: 2
          }
        }
      }
    ]
    expect(res).toStrictEqual(resObject);
  })

});