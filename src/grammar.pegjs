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
      return {
        type: "Program",
        body: optionalList(body)
      };
    }
    
SourceElements
  = head:SourceElement tail:(__ SourceElement)* {
      return buildList(head, tail, 1);
    }

SourceElement = Statement / Function

Statement
	= Block
    / AssignmentStatement
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
  = type:TypeToken __ id:Identifier __ "=" __ exp: Expression EOS {
      return {
        type: getCorrectTypeName(type),
        id: id,
        value: exp
      };
    }
    
TypeToken = 'var' / 'const'
EmptyStatement = ";" { return { type: "EmptyStatement" }; }

StatementList
  = head:Statement tail:(__ Statement)* { return buildList(head, tail, 1); }
    
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
        id: id[0],
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
	= argl:Term _ op:BinOperator _ argr:Expression { return {op, argl, argr} }
    / op:UnOperator _ arg:Term _  { return {op, arg} }
    / f:FunctionExpression { return f } 
    / a:Term? { return a }
     
Term 
    = SingleLiteral
    / GroupLiteral
    / Parenthetical
    / Identifier
    
Parenthetical "Parenthetical" = '(' e:Expression ')' { return e }

BinOperator
    = '+' 
    / '*' 
    / '-' 
    / '/' 
    / '%' 
    / '&&' 
    / '||' 
    / '='
    / '!='
    
 UnOperator
 	= '-' { return 'neg' }

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
    / 'false' { return false }

//------------------- ------------------- LITERALS - DICTIONARY ------------------- ------------------- 
DictionaryLiteral 
	= "{" __ pairs:KeyValueList __ "}" {
		return { 
    		type: 'object',
        	values: pairs
    	}
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
	return { arr }
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
Number "Number" = n:[0-9]+ { return n.join('') }
Identifier "Identifier" = n:[a-zA-Z?]+ { return n.join('') }
Terminator "Terminator" = LineTerminator / ';'
SourceCharacter = .
_ = (WhiteSpace)*
__ = (WhiteSpace / LineTerminatorSequence)*
EOS = __ ";" / _ LineTerminatorSequence / _ &"}" / __ EOF
EOF = !.