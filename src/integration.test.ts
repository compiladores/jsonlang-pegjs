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
							binop: '+',
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
	test('004', async () => {
		const res = await parseFile('p04.red')

		const resObject = [
			{
			  function: 'main',
			  args: [],
			  block: [
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
								binop: '==',
								argl: 'x',
								argr: 6
							  },
							  then: [
								{
								  if: [
									{
									  cond: {
										binop: 'and',
										argl: {
										  binop: '==',
										  argl: 'x',
										  argr: 7
										},
										argr: {
										  binop: '<',
										  argl: 'x',
										  argr: 8
										}
									  },
									  then: [
										{
										  set: 'x',
										  value: 8
										}
									  ]
									}
								  ]
								}
							  ]
							}
						  ]
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