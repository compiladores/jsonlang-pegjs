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

SourceElement = Statement

Statement = 
 		Block
        / AssignmentStatement
		/ EmptyStatement
       

Block
  = "{" __ body:(StatementList __)? "}" {
      return {
        type: "BlockStatement",
        body: optionalList(extractOptional(body, 0))
      };
    }
    
AssignmentStatement
  = type:TypeToken __ Identifier __ "=" __ exp: Expression EOS {
      return {
        type: getCorrectTypeName(type),
        value: exp
      };
    }
    
TypeToken = 'int' / 'string' / '[]' / '{}'
EmptyStatement = ";" { return { type: "EmptyStatement" }; }

StatementList
  = head:Statement tail:(__ Statement)* { return buildList(head, tail, 1); }
  
  
// EXPRESSIONS
Expression
	= argl:Term _ op:Operator _ argr:Expression { return {op, argl, argr} }
    / a:Term? { return a }
    
Term 
    = SingleLiteral
    / GroupLiteral
    / Parenthetical
    / Identifier
    
Parenthetical "Parenthetical" = '(' e:Expression ')' { return e }

Operator
    = '+' 
    / '*' 
    / '-' 
    / '/' 
    / '%' 
    / '&&' 
    / '||' 
    / '='
    / '!='

// LITERALS
AllLiterals = SingleLiteral / GroupLiteral
SingleLiteral = Number / StringLiteral
GroupLiteral = ArrayLiteral / DictionaryLiteral


// LITERALS - DICTIONARY
DictionaryLiteral = "{" __ pairs:KeyValueList __ "}" {
	return { 
    	type: 'object',
        values: pairs
    }
}

KeyValueList
  = head:PairKeyValue tail:(__ "," __ PairKeyValue)* {
      return buildList(head, tail, 3);
    }
    
PairKeyValue
	= key: StringLiteral __ ":" __ value: AllLiterals

// LITERALS - ARRAY
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

// LITERALS - STRING
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


//ESCAPE CHARS
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
 
// AUX
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