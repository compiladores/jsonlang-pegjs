import { testGrammar } from ".";

describe('Tipos test', () => {

  test('Negate number test', async () => {
    const res = await testGrammar('v out = -5;');

    const resObject = [
      {
        declare: 'out',
        value: {
          unop: '-',
          arg: 5
        }
      }
    ]
    expect(res).toStrictEqual(resObject);
  })
  
  test('Not operation on number test', async () => {
    const res = await testGrammar('v out = ~5;');

    const resObject = [
      {
        declare: 'out',
        value: {
          unop: '~',
          arg: 5 
        }
      }
    ]
    expect(res).toStrictEqual(resObject);
  })

  test('Negate bool test', async () => {
    const res = await testGrammar('v out = !true;');

    const resObject = [
      {
        declare: 'out',
        value: {
          unop: '!',
          arg: true
        }
      }
    ]
    expect(res).toStrictEqual(resObject);
  })

  test('Negate not bool should throw test', async () =>  {        
    await expect(testGrammar('v out = !5;'))
    .rejects
    .toThrow('ERROR: Negated value must be boolean or an identifier');
  });

})