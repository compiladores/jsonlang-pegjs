Para probar la gramática sin dsecargar nada se puede ingresar a 

https://peggyjs.org/online.html

Ahí podes pegar la gramática en "grammar.pegjs" y probar como va el trabajo.
Sé que todavía no se parece a como es JsonLang, pero antes de hacer eso quería hacer los tests 
y no pude hacer funcionar deno.


Algunas cosas que se pueden ir probando:

Declarar variables (por ahora con var y const)
var x = 5;
const y = 5;

var z = y + 5;
const boolVal = false;

Arrays
const x = [1,2,3]

Dictionaries
const x = { "val": 1, "value": 2 }

Funciones
fn foo() <
    var x = 5;
>

var y = foo();
y();

Condicional
<
  if (5+3) <
     if () <>
  >
  else <
    var x = 5+3;
  >
>

Proximos pasos
-  Testing
-  Reserved words
-  While, For
-  Break y continue
-  Return

