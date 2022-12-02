// -- SYNTAX --
// Program is the root of the Grammar.

{
  function removeEscapedChars(text) {
    let newString = ""
    for (const char of text) {
      if (char !== '\"') newString += char;
    }
    return newString;
  }
}

Program = statements: StatementList? _ { return statements }

StatementList  = statements:(_ Statement / _ ';' )*
                       { return statements.filter((stmt) => stmt[1] !== ';').map((stmt) => stmt[1]) }

Statement = Expression

Expression = Assignment

Assignment = IntAssignment / StringAssignment

IntAssignment = 'int' __ key: Identifier _ '=' _ value:Number {
  return { int: key, value }
}

StringAssignment = 'string' __ key: Identifier _ '=' _ value:String {
  return { string: key, value }
}

Identifier = ! (ReservedWord Alone) IdentifierStart IdentifierPart*
                   { return text() }
IdentifierStart = [$_a-zA-Z]
IdentifierPart  = [$_a-zA-Z0-9]

Number = [0-9]* { return parseInt(text()) }
String = '"' str: Identifier '"' { return removeEscapedChars(text()) }

Alone = ! IdentifierPart

ReservedWord = 
              / 'null' / 'true' / 'false' /
              / 'div' / 'mod' / 'and' / 'or' / 'not'
              / 'if' / 'then' / 'else' / 'select' / 'when' / 'otherwise'
              / 'for' / 'from' / 'down' / 'to' /
              / 'while' / 'until' / 'continue' / 'break' / 'return'

Comment       = (LineComment / BlockComment) { return {} }
LineComment  = '//' [^\n\r]* [\n\r]*
BlockComment = '/*' (!'*/' .)* '*/'

_       = ([ \t\n\r] / Comment)* { return {} }
__      = ([ \t\n\r] / Comment)+ { return {} }