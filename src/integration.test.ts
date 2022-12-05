import { parseFile } from "."

describe('Function test', () => {
	test('001', async () => {
		const res = await parseFile('p01.red')

		const resObject = [
			{
				declare: 'out',
				value: 1
			}
		]

		expect(res).toStrictEqual(resObject);
	})

	test('002', async () => {
		const res = await parseFile('p02.red')

		const resObject = [
			{
				function: 'main',
				args: [],
				block: [
					{
						declare: 'x',
						value: 1
					},
					{
						declare: 'y',
						value: 2
					},
					{
						return: {
							op: '+',
							argl: 'x',
							argr: 'y'
						}
					}
				]

			}
		]

		expect(res).toStrictEqual(resObject);
	})

	test('003', async () => {
		const res = await parseFile('p03.red')

		const resObject = [
			{
				function: 'foo',
				args: [
					'x',
					'y'
				],
				block: [
					{
						return: {
							op: '+',
							argl: 'x',
							argr: 'y'
						}
					}
				]
			},
			{
				function: 'main',
				args: [],
				block: [
					{
						declare: 'x',
						value: {
							call: 'foo',
							args: [
								10,
								20
							]
						}
					},
					{
						return: 'x'
					}
				]
			}
		]

		expect(res).toStrictEqual(resObject);
	})
})