{{
  function filledArray(count, value) {
    var arr = []
    for (var i=0; i<count; i++) {
      arr.push(value)
    }
    return arr;
  }
  function extractOptional(optional, index) {
    return optional ? optional[index] : null;
  }
  function extractList(list, index) {
    return list.map((element) => { return element[index]; });
  }
  function buildList(head, tail, index) {
    return [head].concat(extractList(tail, index));
  }
  function optionalList(value) {
    return value !== null ? value : [];
  }
  function getIfElseParsedValue(cond, then, elseValue) {
  	if (!elseValue) {
      	return [{
       		cond, then
        }]
    } else {
    	return [{
        	cond, then, else: elseValue
        }]
    }
  }

  function checkReservedWord(word) {
    const reservedWords = ['b', 'false' , 'true', 'w', 'i', 'fr', 'v', 'continue', 
                'return', 'function', 'print'] 
    if (reservedWords.includes(word)) throw new Error('ERROR: Reserved word (' + word + ")");
    else return word;
  }
}}

Start = __ program:Program __ { return program; }
  
Program = body:SourceElements? {
      return optionalList(body)
    }
    
SourceElements
  = first:SourceElement following:(__ SourceElement)* {
      return buildList(first, following, 1);
    }

SourceElement = Statement / Function

Statement
	= Block
    / AssignmentStatement
    / ReturnStatement
    / EmptyStatement
    / FunctionExpression
    / IfStatement
    / DoWhileStatement
    / WhileStatement
    / ForStatement
    / ContinueStatement
    / BreakStatement
   

Block
  = "<" __ body:(StatementList __)? ">" {
      return optionalList(extractOptional(body, 0))
    }
    
AssignmentStatement
	= 'v' ___ id: Identifier __ "=" __ str: StringLiteral EOS {
      return {
        declare: id,
        value: str
      };
    }
    / 'v' ___ id:Identifier __ "=" __ exp: Expression EOS {
      return {
        declare: id,
        value: exp
      };
    }
    / id: Identifier __ "=" __ exp: Expression EOS {
    	return {
        	set: id,
            value: exp
        }
    }
    / id: AccessIdentifier __ "=" __ exp: Expression EOS {
    	return {
        	set: id, 
            value: exp
        }
    }
        
EmptyStatement = ";" { return null; }

StatementList
  = head:Statement tail:(__ Statement)* { return buildList(head, tail, 1); }

// --------------------------- --------------- LOOPS - WHILE -----------------------------------------   

WhileStatement = 'w' __ "(" __ cond:Expression __ ")" __
    block:Statement
    { return { while: cond, do: block }}
// --------------------------- --------------- LOOPS - FOR -----------------------------------------       

ForStatement = 'f' __
    "(" __
    iterator:Identifier __ (";" / ",") __
    from: Expression __ (";" / ",") __
    to: Expression
    ")" __
    block:Statement
    {
      return {
        iterator, from, to, do: block
      };
    }
    
// --------------------------- --------------- LOOPS - DO WHILE ----------------------------------------- 
DoWhileStatement 
	= 'du' __
    body:Statement __
    "(" __ cond:Expression __ ")" EOS
    { return { do: body, until: cond }; }
    
// --------------------------- --------------- BREAK - CONTINUE -----------------------------------------   

ContinueStatement
  = 'c' EOS { return "continue"; }

BreakStatement
  = 'b' EOS { return "break"; }

// --------------------------- --------------- RETURN -----------------------------------------    
ReturnStatement
  = 'r' EOS {
      return { return: null };
    }
  / 'r' _ argument:Expression EOS {
      return { return: argument };
    }
// --------------------------- --------------- IF -----------------------------------------    
IfStatement
  = 'i' __ "(" __ cond:Expression __ ")" __
    next:Statement __
    'e' __
    elseStmt:Statement
    {
      return {
		if: getIfElseParsedValue(cond, next, elseStmt),
        
      };
    }
  / 'i' __ "(" __ cond:Expression __ ")" __
    next:Statement {
      return {
        if: getIfElseParsedValue(cond, next, null)
      };
    }

    
// ------------------- -------------------  FUNCTIONS ------------------- ------------------- 
Function
  = 'fn' __ id:Identifier __
    "(" __ params:(FunctionParams __)? ")" __
    "<" __ body:FunctionBody __ ">" EOS
    {
      return {
        "function": id,
        args: optionalList(extractOptional(params, 0)),
        block: body
      };
    }
 
FunctionParams
	= first: Identifier following:(__ "," __ Identifier)* {
    	return buildList(first, following, 3);
    }
    
FunctionCallParams
	= first: Term following:(__ "," __ Term)* {
    	return buildList(first, following, 3);
    }

FunctionBody 
	= body: SourceElements? {
    	return optionalList(body)
    }
 
FunctionExpression 
	= id:Identifier __  "(" params:(FunctionCallParams __)? ")" __ EOS? {
    	return { call: id, args: optionalList(extractOptional(params, 0)) }
    }
    
// ------------------- -------------------  EXPRESSIONS ------------------- ------------------- 
Expression
	= Exception
    / argl:Term _ binop:BinOperator _ argr:Expression { return {binop, argl, argr} }
    / unop:UnOperator __ arg:Term __  { return {unop, arg} }
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
	/ AccessIdentifier
    / Identifier
    
AccessIdentifier
	= id:Identifier "." "gk" __ "(" __ e:Expression __")"__ { return {id, key: e}}
    / id:Identifier "[" n:Expression "]" { return { id, pos: n }}
    
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
  / BooleanLiteral
  / NullLiteral
  
GroupLiteral = ArrayLiteral / DictionaryLiteral

//------------------- ------------------- LITERALS - NULL ------------------- ------------------- 
NullLiteral = 'null' { return null }
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
    / "{" __ "}" { return []}

KeyValueList
  = head:PairKeyValue tail:(__ "," __ PairKeyValue)* {
      return buildList(head, tail, 3);
    }
    
PairKeyValue
	= key: StringLiteral __ ":" __ value: Expression { return {key, value} }

// ------------------- -------------------  LITERALS - ARRAY ------------------- ------------------- 
ArrayLiteral = "[" __ arr:ElementList __ "]" {
	return arr
}

ElementList
  = first:(
      sep:(Separator __)? element: Expression {
        return optionalList(extractOptional(sep, 0)).concat(element);
      }
    )
    following:(
      __ "," __ sep:(Separator __)? element:Expression {
        return optionalList(extractOptional(sep, 0)).concat(element);
      }
    )*
    { return Array.prototype.concat.apply(first, following); }

Separator
  = "," commas:(__ ",")* { return filledArray(commas.length + 1, null); }

// ------------------- -------------------  LITERALS - STRING ------------------- ------------------- 
StringLiteral "string"
  = '"' chars:DoubleStringCharacter* '"' {
      return { literal: chars.join("") };
    }
  / "'" chars:SingleStringCharacter* "'" {
      return { literal: chars.join("") };
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

  
LineContinuation
  = "\\" LineTerminatorSequence { return ""; }

NonEscapeCharacter
  = !(EscapeCharacter / LineTerminator) SourceCharacter { return text(); }

EscapeCharacter
  = SingleEscapeCharacter
  / "."
  / "x"
  / "u"
  
// ------------------- ------------------- Identifier ------------------- -------------------
Identifier       = ! (ReservedWord Alone) IdentifierStart IdentifierPart*
                   { return text() }
IdentifierStart = [$_a-zA-Z]
IdentifierPart  = [$_a-zA-Z0-9] 
Alone = ! IdentifierPart
// ------------------- ------------------- AUX ------------------- ------------------- 
WhiteSpace "whitespace" = "\t" / "\v" / "\f" / " " / "\u00A0"/ "\uFEFF"
LineTerminator= [\n\r\u2028\u2029]
LineTerminatorSequence "end of line" = "\n" / "\r\n" / "\r" / "\u2028"/ "\u2029"
Number "Number" = n:[0-9]+ { return parseInt(n.join('')) }
ReservedWord
  = Keyword / 'null' / BooleanLiteral
Keyword = 'b' / 'c' / 'e' / 'f' / 'fn' / 'i' / 'r' / 'v' / 'w' 
Terminator "Terminator" = LineTerminator / ';'
SourceCharacter = .
___ = (WhiteSpace)+
_ = (WhiteSpace)*
__ = (WhiteSpace / LineTerminatorSequence)*
EOS = __ ";" / _ LineTerminatorSequence / _ &">" / __ EOF
EOF = !.
