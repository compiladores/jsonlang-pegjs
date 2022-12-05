import { testGrammar } from ".";

describe('Function test', () => {

	test('should call function foo without parameters', async () => {
		const res = await testGrammar('v var = foo();');

		const resObject = [
			{
				declare: 'var',
				value: {
					call: 'foo',
					args: []
				}
			},
		]

		expect(res).toStrictEqual(resObject);
	})

	test('should call function foo with parameters', async () => {
		const res = await testGrammar('v var = foo(x);');

		const resObject = [
			{
				declare: 'var',
				value: {
					call: 'foo',
					args: ['x']
				}
			},
		]

		expect(res).toStrictEqual(resObject);
	})

	test('should set variable with function call without parameters', async () => {
		const res = await testGrammar('var = foo();');

		const resObject = [
			{
				set: 'var',
				value: {
					call: 'foo',
					args: []
				}
			},
		]

		expect(res).toStrictEqual(resObject);
	})

	test('should set variable with function call with parameters', async () => {
		const res = await testGrammar('var = foo(x, y, z);');

		const resObject = [
			{
				set: 'var',
				value: {
					call: 'foo',
					args: ['x', 'y', 'z']
				}
			},
		]

		expect(res).toStrictEqual(resObject);
	})

	test('should set variable with function call with mixed parameter types', async () => {
		const res = await testGrammar('var = foo(x, y, z, 10, "Hola");');

		const resObject = [
			{
				set: 'var',
				value: {
					call: 'foo',
					args: ['x', 'y', 'z', 10, "Hola"]
				}
			},
		]

		expect(res).toStrictEqual(resObject);
	})

})