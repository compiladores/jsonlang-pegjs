import { testGrammar } from ".";

describe('Binops test', () => {

  test('Add binop test', async () => {
    const res = await testGrammar('v out = 1 + 2;');

    const resObject = [
      {
        declare: 'out',
        value: {
          op: '+',
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
          op: '-',
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
          op: '*',
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
          op: '/',
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
          op: '+',
          argl: {
            op: '*',
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
          op: '+',
          argl: {
            op: '*',
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
          op: '+',
          argl: 'z',
          argr: {
            op: '*',
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
          op: '==',
          argl: false,
          argr: true
        }
      }
    ]
    expect(res).toStrictEqual(resObject);
  })

  test('Compare integer values', async () => {
    const res = await testGrammar('v x = 1 ?= 1;');

    const resObject = [
      {
        declare: 'x',
        value: {
          op: '==',
          argl: 1,
          argr: 1
        }
      }
    ]
    expect(res).toStrictEqual(resObject);
  })

  test('Compare string values', async () => {
    const res = await testGrammar('v x = "String" ?= "Otro";');

    const resObject = [
      {
        declare: 'x',
        value: {
          op: '==',
          argl: "String",
          argr: "Otro"
        }
      }
    ]
    expect(res).toStrictEqual(resObject);
  })

  test('Compare array values', async () => {
    const res = await testGrammar('v x = [1,2,3] ?= [1,2,3,4];');

    const resObject = [
      {
        declare: 'x',
        value: {
          op: '==',
          argl: [1,2,3],
          argr: [1,2,3,4]
        }
      }
    ]
    expect(res).toStrictEqual(resObject);
  })

  test('Compare dictionaries values', async () => {
    const res = await testGrammar('v x = {"Hola": 1} ?= {"Hola": 1}');

    const resObject = [
      {
        declare: 'x',
        value: {
          op: '==',
          argl: [
            { 
              key: "Hola",
              value: 1
            }
          ],
          argr: [
            { 
              key: "Hola",
              value: 1
            }
          ]
        }
      }
    ]
    expect(res).toStrictEqual(resObject);
  })
});