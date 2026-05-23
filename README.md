# templated-js

Como EJS pero orientado a generar código JavaScript.

## Instalación

Hay que importar el fichero `tjs.js`. Solamente funciona en node.js, así:

```js
const Tjs = require("./tjs.js");
```

## Uso

### Contra textos

Renderizar un texto sin directorio ancla (por tanto, sin `include` también):

```js
// Síncrono:
Tjs.render("Hola, <$=usuario$>!", { usuario: "developer" });
// Asíncrono:
await Tjs.render("Hola asíncronamente, <$=usuario$>!", { usuario: "developer" }, { async: true });
// Entre comentarios:
Tjs.render("class /*<$=className$>*/ {}", { className: "BasicObject" });
// Entre comentarios con apéndice:
Tjs.render("class { method/*<$=methodContent$>*/(){} }", { methodContent: "() { console.log('Hi'); }" });
// Con plantillas internas:
await Tjs.render("class { method/*<$=await Tjs.asyncFile('/path/to/method.js')$>*/(){} }", {}, { async: true });
```


### Contra ficheros

Renderizar un texto sin directorio ancla (por tanto, permite `include`):

```js
const source = await Tjs.create(__dirname).renderFile("some/file.js");
```

Luego en el `file.js`:

```js
class {
    // Aquí usamos ruta relativa al fichero con soporte para await interno:
    /*<$=await include("./propiedadA.js")$>*/

    // Aquí usamos ruta relativa al fichero sin soporte para await interno:
    /*<$=includeSync("./propiedadB.js")$>*/
    
    // Aquí usamos ruta relativa al directorio (con soporte para await interno):
    /*<$=await include("propiedadC.js")$>*/
    
    // Aquí usamos ruta relativa al directorio sin soporte para await interno:
    /*<$=await include("propiedadD.js")$>*/
}
```

### Ejemplos

La primer demo es una base de datos:

```js
class DatabaseDemo {
  static version = /*<$=await include("tests/templates/DatabaseDemo/version.js")$>*/;
  constructor/*<$=await include("tests/templates/DatabaseDemo/constructor.js")$>*/(){}
  static open/*<$=await include("tests/templates/DatabaseDemo/open.js")$>*/(){}
  static close/*<$=await include("tests/templates/DatabaseDemo/close.js")$>*/(){}
  static select/*<$=await include("./DatabaseDemo/select.js")$>*/(){}
  static insert/*<$=await include("./DatabaseDemo/insert.js")$>*/(){}
  static update/*<$=await include("./DatabaseDemo/update.js")$>*/(){}
  static delete/*<$=await include("./DatabaseDemo/delete.js")$>*/(){}
  static Transaction = /*<$=await include("tests/templates/DatabaseDemo/Transaction.js")$>*/;
}
```