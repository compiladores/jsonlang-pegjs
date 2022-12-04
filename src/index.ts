const peggy = require("peggy");
const fs = require('fs').promises;

// var readline = require('readline');

// var rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// function parseLine (grammar: any) {
//   rl.question('> ', (value: any) => {
//     if (value == 'exit') 
//       return rl.close();
//     executeInt(grammar, value)
//     parseLine(grammar);
//   });
// };


// function executeGrammar(grammar: any, program: any) {
//   const options: any = {}
  
//   if (program) {
//     const parser = peggy.generate(grammar, options);
//     console.log(parser.parse(program));
//   } else {
//   }
// }

async function executeInt(grammar: any, value: any) {
  try {
    const parser = peggy.generate(grammar);
    return parser.parse(value);
  } catch (e: any) {
    throw e
  }
}

export async function getCodeFromFile(fileName: string) {
  const fs = await import("fs");
  fs.readFile(fileName, 'utf-8', (err, program) => {
    if (err) return console.log(err);
    else return program;
  })
}

export async function testGrammar(code: any) {
  try {
    const grammar = await fs.readFile('./src/grammar.pegjs', 'utf-8');
    return executeInt(grammar, code)
  } catch (e) {
    throw e
  }
}


