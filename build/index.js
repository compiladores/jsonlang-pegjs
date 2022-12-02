"use strict";
const peggy = require("peggy");
const grammar = "start = ('a' / 'b')+";
const options = {};
const parser = peggy.generate(grammar, options);
console.log(parser);
