Para probar la gramática sin dsecargar nada se puede ingresar a 

https://peggyjs.org/online.html

Ahí podes pegar la gramática en "grammar.pegjs" y probar como va el trabajo.
Sé que todavía no se parece a como es JsonLang, pero antes de hacer eso quería hacer los tests 
y no pude hacer funcionar deno.


Algunas cosas que se pueden ir probando:

Declarar variables (por ahora con var y const)
v x = 5;
v y = 5;

v z = y + 5;
v boolVal = false;

Arrays
v x = [1,2,3]

Dictionaries
v x = { "val": 1, "value": 2 }

Funciones
f foo() <
    var x = 5;
>

v y = foo();
y();

Condicional
<
  i (5+3) <
     i () <>
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


