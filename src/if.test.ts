import { testGrammar } from ".";

describe('Function test', () => {
	test('should create if statement', async () => {
		const res = await testGrammar('i (x>5) <>');

		const resObject = [
			{
				if: [
					{
						cond: {
							binop: '>',
							argl: 'x',
							argr: 5
						},
						then: []
					}
				]
			}
		]

		expect(res).toStrictEqual(resObject);
	})

	test('should create if with else statement', async () => {
		const res = await testGrammar('i (x>5) <> e <>');

		const resObject = [
			{
				if: [
					{
						cond: {
							binop: '>',
							argl: 'x',
							argr: 5
						},
						then: [],
						else: []
					}
				]
			}
		]

		expect(res).toStrictEqual(resObject);
	})

	test('should create anidated ifs', async () => {
		const res = await testGrammar('i (x>5) < i (x>6) <>>');

		const resObject = [
			{
				if: [
					{
						cond: {
							binop: '>',
							argl: 'x',
							argr: 5
						},
						then: [
							{
								if: [
									{
										cond: {
											binop: '>',
											argl: 'x',
											argr: 6
										},
										then: []
									}
								]
							}
						]
					}
				]
			}
		]

		expect(res).toStrictEqual(resObject);
	})
})