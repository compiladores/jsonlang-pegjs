import { testGrammar } from ".";

describe('while tests', () => {

    test('should create simple empty while', async () => {
        const res = await testGrammar('w (x ?= 5) <>');

        const resObject = [
            {
              while: {
                binop: '==',
                argl: 'x',
                argr: 5
              },
              do: []
            }
          ]
    
        expect(res).toStrictEqual(resObject);
    })

    test('should create simple while with only one action', async () => {
        const res = await testGrammar('w (x ?= 5) <v x = 5;>');

        const resObject = [
            {
              while: {
                binop: '==',
                argl: 'x',
                argr: 5
              },
              do: [
                {
                  declare: 'x',
                  value: 5
                }
              ]
            }
          ]
    
        expect(res).toStrictEqual(resObject);
    })

    test('should create simple while with multiple actions action', async () => {
        const res = await testGrammar('w (x ?= 5) <v x = 5; v y = 6; v z = x + y; >');

        const resObject = [
            {
              while: {
                binop: '==',
                argl: 'x',
                argr: 5
              },
              do: [
                {
                  declare: 'x',
                  value: 5
                },
                {
									declare: 'y',
									value: 6
                },
								{
									declare: 'z',
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