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
        value: 'str'
      },
      {
        set: 'str',
        value: 'hola'
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
          op: '!',
          arg: 'boolvar'
        }
      }
    ]
    expect(res).toStrictEqual(resObject);
  })

})