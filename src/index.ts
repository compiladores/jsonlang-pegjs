// const peggy = require("peggy");
// import fs from 'fs'
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
    const peggy = await import('peggy')
    const parser = peggy.generate(grammar);
    console.log(JSON.stringify(parser.parse(value)));
  } catch (e: any) {
    console.log(e.message);
  }
}

export async function getCodeFromFile(fileName: string) {
  const fs = await import("fs");
  fs.readFile(fileName, 'utf-8', (err, program) => {
    if (err) return console.log(err);
    else return program;
  })
}

export async function testGramar(code: any) {
  const fs = await import("fs");
  fs.readFile('./src/grammar.pegjs', 'utf-8', (err, grammar) => {
    if (err) {
      return console.log(err);
    }
    executeInt(grammar, code)
  })
}


