import { testGrammar } from ".";

describe('Tipos test', () => {

  test('Negate number test', async () => {
    const res = await testGrammar('v out = -5;');

    const resObject = [
      {
        declare: 'out',
        value: {
          op: '-',
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
          op: '~',
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
          op: '!',
          arg: true
        }
      }
    ]
    expect(res).toStrictEqual(resObject);
  })

  test('Negate not bool should throw test', async () => {
    try {
      await testGrammar('v out = !5;')
    } catch (e) {
      expect(e).toThrow('Error, not a boolean');
    }
  });

})