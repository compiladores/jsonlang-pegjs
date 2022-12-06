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
										}},
									  then: [
										{
										  set: 'x',
										  value: 8
										}]
									}]
								}]
							}]
						}]
					}]
				}]
			}]
		expect(res).toStrictEqual(resObject);
	})

  test('005', async () => {
		const res = await parseFile('p05.red')

		const resObject = [
      {
        set: 'x',
        value: 1
      },
      [
        {
          set: 'x',
          value: 2
        },
        {
          set: 'y',
          value: 4
        }
      ],
      {
        set: 'out',
        value: 'x'
      }
    ]
		expect(res).toStrictEqual(resObject);
	})

  test('006', async () => {
		const res = await parseFile('p06.red')

		const resObject = [
      {
        function: 'main',
        args: [],
        block: [
          {
            declare: 'x',
            value: 5
          },
          {
            if: [
              {
                cond: {
                  binop: '>',
                  argl: 'x',
                  argr: 10
                },
                then: [
                  {
                    return: null
                  }
                ],
                else: [
                  {
                    return: {
                      binop: '+',
                      argl: 'x',
                      argr: 10
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        call: 'main',
        args: []
      }
    ]
		expect(res).toStrictEqual(resObject);
	})

  test('007', async () => {
		const res = await parseFile('p07.red')

		const resObject = [
      {
        function: 'main',
        args: [],
        block: [
          {
            declare: 'x',
            value: 0
          },
          {
            iterator: 'it',
            from: 0,
            to: 8,
            do: [
              {
                set: 'x',
                value: {
                  binop: '+',
                  argl: 'x',
                  argr: 'it'
                }
              }
            ]
          },
          {
            return: 'x'
          }
        ]
      },
      {
        call: 'main',
        args: []
      }
    ]
		expect(res).toStrictEqual(resObject);
	})

  test('008', async () => {
		const res = await parseFile('p08.red')

		const resObject = [
      {
        function: 'main',
        args: [],
        block: [
          {
            declare: 'x',
            value: 0
          },
          {
            do: [
              {
                set: 'x',
                value: {
                  binop: '+',
                  argl: 'x',
                  argr: 'it'
                }
              },
              {
                do: [
                  {
                    set: 'x',
                    value: {
                      binop: '+',
                      argl: 'x',
                      argr: 'it'
                    }
                  }
                ],
                until: {
                  binop: '>',
                  argl: 'x',
                  argr: 5
                }
              }
            ],
            until: {
              binop: '>',
              argl: 'x',
              argr: 5
            }
          },
          {
            return: 'x'
          }
        ]
      },
      {
        call: 'main',
        args: []
      }
    ]
		expect(res).toStrictEqual(resObject);
	})

  test('009', async () => {
		const res = await parseFile('p09.red')

		const resObject = [
      {
        function: 'main',
        args: [],
        block: [
          {
            declare: 'x',
            value: 0
          },
          {
            iterator: 'it',
            from: 0,
            to: 10,
            do: [
              {
                set: 'x',
                value: {
                  binop: '+',
                  argl: 'x',
                  argr: 'it'
                }
              },
              {
                iterator: 'it2',
                from: 10,
                to: 20,
                do: [
                  {
                    set: 'x',
                    value: {
                      binop: '+',
                      argl: 'x',
                      argr: 'it'
                    }
                  }
                ]
              }
            ]
          },
          {
            return: 'x'
          }
        ]
      },
      {
        call: 'main',
        args: []
      }
    ]
		expect(res).toStrictEqual(resObject);
	})

  test('010', async () => {
		const res = await parseFile('p10.red')

		const resObject = [
      {
        function: 'main',
        args: [],
        block: [
          {
            declare: 'x',
            value: 0
          },
          {
            iterator: 'it',
            from: 0,
            to: 10,
            do: [
              {
                set: 'x',
                value: {
                  binop: '+',
                  argl: 'x',
                  argr: 'it'
                }
              },
              {
                iterator: 'it2',
                from: 10,
                to: 20,
                do: [
                  {
                    set: 'x',
                    value: {
                      binop: '+',
                      argl: 'x',
                      argr: 'it'
                    }
                  }
                ]
              }
            ]
          },
          {
            return: 'x'
          }
        ]
      },
      {
        declare: 'x',
        value: {
          call: 'main',
          args: []
        }
      }
    ]
		expect(res).toStrictEqual(resObject);
	})
  //
  test('011', async () => {
		const res = await parseFile('p11.red')

		const resObject = [
      {
        function: 'main',
        args: [],
        block: [
          {
            declare: 'x',
            value: 0
          },
          {
            iterator: 'it',
            from: 0,
            to: 10,
            do: [
              {
                set: 'x',
                value: {
                  binop: '+',
                  argl: 'x',
                  argr: 'it'
                }
              },
              {
                iterator: 'it2',
                from: 10,
                to: 20,
                do: [
                  {
                    set: 'x',
                    value: {
                      binop: '+',
                      argl: 'x',
                      argr: 'it'
                    }
                  }
                ]
              }
            ]
          },
          {
            return: 'x'
          }
        ]
      },
      {
        declare: 'x',
        value: [
          'main',
          1,
          2
        ]
      }
    ]
		expect(res).toStrictEqual(resObject);
	})
  //
  test('012', async () => {
		const res = await parseFile('p12.red')

		const resObject = [
      {
        function: 'main',
        args: [],
        block: [
          {
            declare: 'x',
            value: 0
          },
          {
            iterator: 'it',
            from: 0,
            to: 10,
            do: [
              {
                set: 'x',
                value: {
                  binop: '+',
                  argl: 'x',
                  argr: 'it'
                }
              },
              {
                iterator: 'it2',
                from: 10,
                to: 20,
                do: [
                  {
                    set: 'x',
                    value: {
                      binop: '+',
                      argl: 'x',
                      argr: 'it'
                    }
                  }
                ]
              }
            ]
          },
          {
            return: 'x'
          }
        ]
      },
      {
        declare: 'x',
        value: [
          {
            key: {
              literal: 'function'
            },
            value: 'main'
          },
          {
            key: {
              literal: 'otro'
            },
            value: 2
          }
        ]
      }
    ]
		expect(res).toStrictEqual(resObject);
	})

  test('013', async () => {
		const res = await parseFile('p13.red')

		const resObject = [
      {
        declare: 'arr',
        value: [
          {
            key: {
              literal: 'Key'
            },
            value: 1
          },
          {
            key: {
              literal: 'Another'
            },
            value: {
              binop: '+',
              argl: 'x',
              argr: 5
            }
          },
          {
            key: {
              literal: 'AndAnother'
            },
            value: 'main'
          },
          {
            key: {
              literal: 'FunctionResult'
            },
            value: {
              call: 'main',
              args: [
                'aVar',
                10
              ]
            }
          }
        ]
      }
    ]
		expect(res).toStrictEqual(resObject);
	})

  test('014', async () => { 
    const res = await parseFile('p14.red')

    const resObject = [
      {
        function: 'makeFunc',
        args: [],
        block: [
          {
            declare: 'name',
            value: {
              literal: 'Mozilla'
            }
          },
          {
            function: 'displayName',
            args: [],
            block: [
              {
                declare: 'x',
                value: 5
              }
            ]
          },
          {
            return: 'displayName'
          }
        ]
      },
      {
        declare: 'myFunc',
        value: {
          call: 'makeFunc',
          args: []
        }
      },
      {
        call: 'myFunc',
        args: []
      }
    ]
		expect(res).toStrictEqual(resObject);
  })

  test('015', async () => {
		const res = await parseFile('p15.red')

		const resObject = [
      {
        function: 'InsertionSort',
        args: [
          'arr',
          'begin',
          'end'
        ],
        block: [
          {
            declare: 'left',
            value: {
              binop: '-',
              argl: 'begin',
              argr: 'arr'
            }
          },
          {
            declare: 'right',
            value: {
              binop: '-',
              argl: 'end',
              argr: 'arr'
            }
          },
          {
            iterator: 'it',
            from: {
              binop: '+',
              argl: 'left',
              argr: 1
            },
            to: 'right',
            do: [
              {
                declare: 'key',
                value: {
                  id: 'arr',
                  pos: 'it'
                }
              },
              {
                declare: 'j',
                value: {
                  binop: '-',
                  argl: 'it',
                  argr: 1
                }
              },
              {
                while: {
                  binop: 'and',
                  argl: {
                    binop: '>',
                    argl: 'j',
                    argr: 'left'
                  },
                  argr: {
                    binop: '>',
                    argl: {
                      id: 'arr',
                      pos: 'j'
                    },
                    argr: 'key'
                  }
                },
                do: [
                  {
                    set: {
                      id: 'arr',
                      pos: {
                        binop: '+',
                        argl: 'j',
                        argr: 1
                      }
                    },
                    value: {
                      id: 'arr',
                      pos: 'j'
                    }
                  },
                  {
                    set: 'j',
                    value: {
                      binop: '-',
                      argl: 'j',
                      argr: 1
                    }
                  }
                ]
              },
              {
                set: {
                  id: 'arr',
                  pos: {
                    binop: '+',
                    argl: 'j',
                    argr: 1
                  }
                },
                value: 'key'
              }
            ]
          },
          {
            return: null
          }
        ]
      }
    ]
		expect(res).toStrictEqual(resObject);
	})
})