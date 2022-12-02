// const peggy = require("peggy");
import peggy from 'peggy'
import fs from 'fs'
import { stringify } from 'querystring';
var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function parseLine (grammar: any) {
  rl.question('> ', (value: any) => {
    if (value == 'exit') 
      return rl.close();
    executeInt(grammar, value)
    parseLine(grammar);
  });
};


fs.readFile('./src/grammar.pegjs', 'utf-8', (err, grammar) => {
  if (err) {
    return console.log(err);
  }
  parseLine(grammar)
  // fs.readFile('./programs/p01.txt', 'utf-8', (err, program) => {
  //   if (err) {
  //     return console.log(err);
  //   }
    // console.log(grammar);
    // console.log(program);
    // executeGrammar(grammar, program)
  // })
})

function executeGrammar(grammar: any, program: any) {
  const options: any = {}
  
  if (program) {
    const parser = peggy.generate(grammar, options);
    console.log(parser.parse(program));
  } else {
  }
}

function executeInt(grammar: any, value: any) {
  try {
    const parser = peggy.generate(grammar);
    console.log(JSON.stringify(parser.parse(value)));
  } catch (e: any) {
    console.log(e.message);
  }
}


