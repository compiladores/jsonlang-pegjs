| Reducciones   | Traducción    |
| ------------- |:-------------:|
| i-e      | if-else     |
| w      | while     |
| du      | do until     |


# Entregable

* Instalación de dependencias adicionales

Para la instalación de dependencias lo unico que hay que hacer luego de pullear el repositorio es: 
    `npm install`

* Cómo ejecutar la suite de tests
    `npm test`


* ¿Cómo agregaste soporte para strings?

El soporte para strings se agregó de la siguiente manera:

```
StringLiteral "string"
  = '"' chars:DoubleStringCharacter* '"' {
      return { literal: chars.join("") };
    }
  / "'" chars:SingleStringCharacter* "'" {
      return { literal: chars.join("") };
    }
```

De esta manera se manejan los strings con comillas simples y dobles de la misma manera. Internamente un string podría tener de 0 a n caracteres. A continuación se deja como se realizó para cada caso en particular:

```
DoubleStringCharacter
  = !('"' / "\\" / LineTerminator) SourceCharacter { return text(); }
  / "\\" sequence:EscapeSequence { return sequence; }
  / LineContinuation
```

```
SingleStringCharacter
  = !("'" / "\\" / LineTerminator) SourceCharacter { return text(); }
  / "\\" sequence:EscapeSequence { return sequence; }
  / LineContinuation
```

De esta manera se agrega el manejo de caracteres escapeados. 

Caso de uso:

`v x = "string_de_prueba"`
```
[
  {
    declare: 'x',
    value: {
      literal: 'string_de_prueba'
    }
  }
]
```

* ¿Cómo agregaste soporte para arrays?

El array literal es parte de los "GroupLiteral" que data de tipos de variables que pueden albergar mas de un dato. El lenguaje solo maneja 2, el array mismo y el diccionario del que se habla más adelante.

```
ArrayLiteral = "[" __ arr:ElementList __ "]" {
	return arr
}
```

El regex chequea que exista un corchete antes y después de los elementos del array. Una vez matcheado el regex, se ejecuta código javascript para decidir qué retornar.

```
ElementList
  = first:(
      sep:(Separator __)? element: Term {
        return optionalList(extractOptional(sep, 0)).concat(element);
      }
    )
    following:(
      __ "," __ sep:(Separator __)? element:Term {
        return optionalList(extractOptional(sep, 0)).concat(element);
      }
    )*
    { return Array.prototype.concat.apply(first, following); }

Separator
  = "," commas:(__ ",")* { return filledArray(commas.length + 1, null); }
```

El separator lo que hace es ignorar los espacios y la respectiva coma (el separador definido para el lenguaje) y devuelve un array. La función `filledArray` lo que hace es formar un array lleno de nulls con el largo de la cantidad de comas mas uno. Luego se decide si se toma o no dependiendo de si este se encuentra vacío.

##### Ejemplo de uso

```
v arr = [
  1,
  x+5,
  funcion(x),
  { "hola": 1 }
]
```

Produce

```
[
  {
    declare: 'arr',
    value: [
      1,
      { binop: '+', argl: 'x', argr: 5 },
      {
        call: 'funcion',
        args: ['x']
      },
      {
        key: { literal: 'hola' },
        value: 1
      }
    ]
  }
]
```


* ¿Cómo agregaste soporte para diccionarios?

Los diccionarios se matchean de la siguiente manera
```
DictionaryLiteral 
	= "{" __ pairs:KeyValueList __ "}" {
		return pairs
    }
    / "{" __ "}" { return [] }
```

Debe estar rodeado por llaves, puede dentro tener entre 0 y n espacios en blanco y luego viene el par clave valor.
En caso de estar vacío o solo conformado por espacios, devuelve un diccionario vacío.

```
KeyValueList
  = head:PairKeyValue tail:(__ "," __ PairKeyValue)* {
      return buildList(head, tail, 3);
    }
    
PairKeyValue
	= key: StringLiteral __ ":" __ value: Expression { return {key, value} }

```

#### Ejemplo de uso

```
v diccionario = {
  "entero": 1,
  "string": "string",
  "arr": [1, 2, 3],
  "exp": x + 5
}

```

Produce

```
[
  {
    declare: 'diccionario',
    value: [
      {
        key: { literal: 'entero' },
        value: 1
      },
      {
        key: { literal: 'string' },
        value: { literal: 'string' }
      },
      {
        key: { literal: 'arr' },
        value: [1, 2, 3]
      },
      {
        key: { literal: 'exp' },
        value: { binop: '+', argl: 'x', argr: 5}
      }
    ]
  }
]
```

* ¿Cómo agregaste funciones como first class citizen?

Para esto debería contar como se manejan las funciones como expresiones. Estas comienzan con un identificador que es el nombre de la función, entre 0 y n whitespaces y una lista de parámetros entre paréntesis. Por último puede tener o no un final de línea. 

```
FunctionExpression 
	= id:Identifier __  "(" params:(FunctionCallParams __)? ")" __ EOS? {
    	return { call: id, args: optionalList(extractOptional(params, 0)) }
    }
    
```

Esto permite por ejemplo hacer lo siguiente:
```
v myFunc = makeFunc();

// Nos entrega lo siguiente

[
  {
    declare: 'myFunc',
    value: {
      call: 'makeFunc',
      args: []
    }
  }
]
```

Al tratarlo como expresión puedo utilizarlo en las asignaciones de cualquier tipo.
Podría incluso agregarlo a un array como uno de sus elementos

```
v funcion = makeFunc();

v arr = [1, 2, funcion()]
```

Que nos entrega el siguiente output
```
[
  {
    declare: 'funcion',
    value: {
      call: 'makeFunc',
      args: []
    }
  },
  {
    declare: 'arr',
    value: [
      1,
      2,
      {
        call: 'funcion',
        args: []
      }
    ]
  }
]
```

¿Cómo agregaste cierres?

Para entender esto se debe analizar como está compuesto el programa, el cual es una lista de "SourceElements". Estos elements pueden ser tanto statements como funciones. 

```
SourceElement = Statement / Function
```
Al no ser un statement, se matchea con Function y con todo su cuerpo correspondientemente. Por último se devuelve su valor hacia arriba agregándola en este caso al bloque en cuestión. Un ejemplo:

```
fn makeFunc () <
  v name = 'Mozilla';
  fn displayName() <
    v x = 5;
  >
  r displayName;
>

v myFunc = makeFunc();
myFunc();
```
Produce el siguiente output:
```
[
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
```

¿Cómo agregaste Verificación de tipos estáticos?

A pesar de no ser necesario, agregué chequeo de tipos para evitar operaciones y comparaciones inválidas. Para esto, una expresión se fija primero que no matchee ninguna excepción antes de ser comparada con las operaciones válidas.

```
Expression
	= Exception
    / argl:Term _ binop:BinOperator _ argr:Expression { return {binop, argl, argr} }
    / unop:UnOperator __ arg:Term __  { return {unop, arg} }
    / f:FunctionExpression { return f } 
    / a:Term? { return a }
```

Donde una excepción puede ser lo siguiente:
```
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
```

