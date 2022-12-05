{{
  function filledArray(count, value) {
    return Array.apply(null, new Array(count))
      .map(function() { return value; });
  }
  function extractOptional(optional, index) {
    return optional ? optional[index] : null;
  }
  function extractList(list, index) {
    return list.map(function(element) { return element[index]; });
  }
  function buildList(head, tail, index) {
    return [head].concat(extractList(tail, index));
  }
  function optionalList(value) {
    return value !== null ? value : [];
  }
  function getCorrectTypeName(type) {
  	switch (type) {
    	case '[]': 
        	return "array"
        case '{}':
        	return "dictionary"
        default:
        	return type
    }
  }
}}

Start = __ program:Program __ { return program; }
  
Program = body:SourceElements? {
      return optionalList(body)
    }
    
SourceElements
  = head:SourceElement tail:(__ SourceElement)* {
      return buildList(head, tail, 1);
    }

SourceElement = Statement / Function

Statement
	= Block
    / AssignmentStatement
    / ReturnStatement
    / EmptyStatement
    / FunctionExpression
    / IfStatement
   

Block
  = "<" __ body:(StatementList __)? ">" {
      return {
        type: "BlockStatement",
        body: optionalList(extractOptional(body, 0))
      };
    }
    
AssignmentStatement
	= type: TypeToken __ id: Identifier __ "=" __ str: StringLiteral EOS {
      return {
        declare: id,
        value: str
      };
    }
    / id: Identifier __ "=" __ exp: Expression EOS {
    	return {
        	set: id,
            value: exp
        }
    }
    / type:TypeToken __ id:Identifier __ "=" __ exp: Expression EOS {
      return {
        declare: id,
        value: exp
      };
    }
    
TypeToken = 'v'
EmptyStatement = ";" { return { type: "EmptyStatement" }; }

StatementList
  = head:Statement tail:(__ Statement)* { return buildList(head, tail, 1); }
  
// --------------------------- --------------- RETURN -----------------------------------------    
ReturnStatement
  = 'r' EOS {
      return { type: "ReturnStatement", argument: null };
    }
  / 'r' _ argument:Expression EOS {
      return { return: argument };
    }
// --------------------------- --------------- IF -----------------------------------------    
IfStatement
  = 'if' __ "(" __ cond:Expression __ ")" __
    next:Statement __
    'else' __
    elseStmt:Statement
    {
      return {
        type: "IfElse",
        condition: cond,
        next: next,
        elseStmt: elseStmt
      };
    }
  / 'if' __ "(" __ cond:Expression __ ")" __
    next:Statement {
      return {
        type: "If",
        cond: cond,
        next: next,
        alternate: null
      };
    }

    
// ------------------- -------------------  FUNCTIONS ------------------- ------------------- 
Function
  = 'fn' __ id:Identifier __
    "(" __ params:(FunctionParams __)? ")" __
    "<" __ body:FunctionBody __ ">"
    {
      return {
        type: "function",
        id: id,
        params: optionalList(extractOptional(params, 0)),
        body: body
      };
    }
 
FunctionParams
	= first: Identifier following:(__ "," __ Identifier)* {
    	return buildList(first, following, 3);
    }

FunctionBody 
	= body: SourceElements? {
    	return {
        	type: "FunctionBody",
            body: optionalList(body)
        }
    }
 
FunctionExpression 
	= id:Identifier __  "(" __ ")" __ EOS {
    	return { type: 'FunctionCall', call: id }
    }
    
// ------------------- -------------------  EXPRESSIONS ------------------- ------------------- 
Expression
	= Exception
    / argl:Term _ op:BinOperator _ argr:Expression { return {op, argl, argr} }
    / op:UnOperator __ arg:Term __  { return {op, arg} }
    / f:FunctionExpression { return f } 
    / a:Term? { return a }

// ------------------- -------------------  EXCEPTIONS ------------------- ------------------- 

Exception 
	= BinComparatorException
    / op:'!' __ arg: !(Identifier / BooleanLiteral) { throw new Error("ERROR: Negated value must be boolean or an identifier") }
    / SingleComparatorException

BinComparatorException
	= argl: Number __ op: BinComparator __ argr: !(Number) { throw new Error("ERROR: Invalid comparison") }
    / argl: BooleanLiteral __ op: BinComparator __ argr: !(BooleanLiteral) { throw new Error("ERROR: Invalid comparison") }
    / argl: StringLiteral _ op: BinComparator _ argr: !(StringLiteral) { throw new Error("ERROR: Invalid comparison") }
    / argl: ArrayLiteral _ op: BinComparator _ argr: !(ArrayLiteral) { throw new Error("ERROR: Invalid comparison") }
    / argl: DictionaryLiteral _ op: BinComparator _ argr: !(DictionaryLiteral) { throw new Error("ERROR: Invalid comparison") }

SingleComparatorException
	= argl:BooleanLiteral __ op:SingleComparator __ argr:Expression { throw new Error("Error: INVALID OP for BOOLEAN") }
    / argl:Term __ op:SingleComparator __ argr:BooleanLiteral { throw new Error("Error: INVALID OP for BOOLEAN") }
    / argl:StringLiteral __ op:SingleComparator __ argr:Expression { throw new Error("Error: INVALID OP for STRING") }
    / argl:Term __ op:SingleComparator __ argr:StringLiteral { throw new Error("Error: INVALID OP for STRING") } 
    / argl:ArrayLiteral __ op:SingleComparator __ argr:Expression { throw new Error("Error: INVALID OP for ARRAY") }
    / argl:Term __ op:SingleComparator __ argr:ArrayLiteral { throw new Error("Error: INVALID OP for ARRAY") }
    / argl:DictionaryLiteral __ op:SingleComparator __ argr:Expression { throw new Error("Error: INVALID OP for DICTIONARY") }
    / argl:Term __ op:SingleComparator __ argr:DictionaryLiteral { throw new Error("Error: INVALID OP for DICTIONARY") }

Term 
    = SingleLiteral
    / GroupLiteral
    / Parenthetical
    / Identifier
    
Parenthetical "Parenthetical" = '(' e:Expression ')' { return e }

BinOperator
    = BinComparator
    / SingleComparator

SingleComparator 
	= '+'
    / '*' 
    / '-'
    / '/' 
    / '^'
    / '%'
    / '&'
    / '>>'
    / '<<'
    / '|'

    
BinComparator
	= '&&' { return 'and' } 
    / '||' { return 'or' }
    / '?=' { return '==' }
    / '!=' { return '~=' }
    / '<'
    / '<='
    / '>'
    / '>='
    
 UnOperator
 	= '-' { return '-' }
    / '!' { return '!' }
    / '~' { return '~' }

// ------------------- -------------------  LITERALS ------------------- ------------------- 
AllLiterals = SingleLiteral / GroupLiteral
SingleLiteral 
	= Number 
    / StringLiteral 
    /  BooleanLiteral
GroupLiteral = ArrayLiteral / DictionaryLiteral

//------------------- ------------------- LITERALS - BOOLEANS ------------------- ------------------- 
BooleanLiteral 
	= 'true' { return true }
    / 'TRUE' { return true }
    / 'FALSE' { return false }
    / 'false' { return false }

//------------------- ------------------- LITERALS - DICTIONARY ------------------- ------------------- 
DictionaryLiteral 
	= "{" __ pairs:KeyValueList __ "}" {
		return pairs
    }
    / "{" __ "}" { return { type: "Dictionary", pairs: [] }}

KeyValueList
  = head:PairKeyValue tail:(__ "," __ PairKeyValue)* {
      return buildList(head, tail, 3);
    }
    
PairKeyValue
	= key: StringLiteral __ ":" __ value: AllLiterals { return {key, value} }

// ------------------- -------------------  LITERALS - ARRAY ------------------- ------------------- 
ArrayLiteral = "[" __ arr:ElementList __ "]" {
	return arr
}

ElementList
  = head:(
      elision:(Elision __)? element:SingleLiteral {
        return optionalList(extractOptional(elision, 0)).concat(element);
      }
    )
    tail:(
      __ "," __ elision:(Elision __)? element:SingleLiteral {
        return optionalList(extractOptional(elision, 0)).concat(element);
      }
    )*
    { return Array.prototype.concat.apply(head, tail); }

Elision
  = "," commas:(__ ",")* { return filledArray(commas.length + 1, null); }

// ------------------- -------------------  LITERALS - STRING ------------------- ------------------- 
StringLiteral "string"
  = '"' chars:DoubleStringCharacter* '"' {
      return chars.join("");
    }
  / "'" chars:SingleStringCharacter* "'" {
      return { type: "Literal", value: chars.join("") };
    }

DoubleStringCharacter
  = !('"' / "\\" / LineTerminator) SourceCharacter { return text(); }
  / "\\" sequence:EscapeSequence { return sequence; }
  / LineContinuation

SingleStringCharacter
  = !("'" / "\\" / LineTerminator) SourceCharacter { return text(); }
  / "\\" sequence:EscapeSequence { return sequence; }
  / LineContinuation


//------------------- -------------------  ESCAPE CHARS ------------------- ------------------- 
EscapeSequence
  = CharacterEscapeSequence
  / "0" !"." { return "\0"; }

CharacterEscapeSequence
  = SingleEscapeCharacter
  / NonEscapeCharacter

SingleEscapeCharacter
  = "'"
  / '"'
  / "\\"
  / "b"  { return "\b"; }
  / "f"  { return "\f"; }
  / "n"  { return "\n"; }
  / "r"  { return "\r"; }
  / "t"  { return "\t"; }
  / "v"  { return "\v"; }
  
LineContinuation
  = "\\" LineTerminatorSequence { return ""; }

NonEscapeCharacter
  = !(EscapeCharacter / LineTerminator) SourceCharacter { return text(); }

EscapeCharacter
  = SingleEscapeCharacter
  / "."
  / "x"
  / "u"
 
// ------------------- ------------------- AUX ------------------- ------------------- 
WhiteSpace "whitespace" = "\t" / "\v" / "\f" / " " / "\u00A0"/ "\uFEFF"
LineTerminator= [\n\r\u2028\u2029]
LineTerminatorSequence "end of line" = "\n" / "\r\n" / "\r" / "\u2028"/ "\u2029"
Number "Number" = n:[0-9]+ { return parseInt(n.join('')) }
Identifier "Identifier" = !ReservedWord n:[a-zA-Z?]+ { return n.join('') }
ReservedWord 
	= 'break' / 'false' / 'true' / 'while' / 'if' 
    / 'for' / 'var' / 'const' / 'continue' / 'return'
    / 'function' / 'print'
Terminator "Terminator" = LineTerminator / ';'
SourceCharacter = .
_ = (WhiteSpace)*
__ = (WhiteSpace / LineTerminatorSequence)*
EOS = __ ";" / _ LineTerminatorSequence / _ &"}" / __ EOF
EOF = !.