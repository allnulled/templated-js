# templated-js

Como EJS pero orientado a generar código JavaScript.

## Instalación

Hay que importar el fichero `tjs.js`. Solamente funciona en node.js, así:

```js
const Tjs = require("./tjs.js");
```

## Uso

### Opciones del constructor

```js
Tjs.create(__dirname, {
  createFileIfNotExists: false, // en true, el include intenta crear el fichero si no lo encuentra
  defaultFileContent: "", // cuando incurre createFileIfNotExists, el contenido al crear el fichero es este
})
```

### Contra textos

Renderizar un texto sin directorio ancla (por tanto, sin `include` también):

```js
// Síncrono:
Tjs.render("Hola, <$=usuario$>!", { usuario: "developer" });
// Asíncrono:
await Tjs.render("Hola asíncronamente, <$=await usuario$>!", { usuario: (async() => "developer")() }, { async: true });
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
  static Transaction = /*<$=await include("tests/templates/DatabaseDemo/Transaction.js")$>*/"template";
}
```

## Métodos de renderizado

Hay varias opciones para renderizar, para que se adapten a cada caso de uso.

En el test de [./tests/003. ejemplos del readme.test.js](#) puedes encontrar todas las formas:

Se exponen en orden de creación, no el de frecuencia de uso.

```js
module.exports = async function (Tjs) {

  ////////////////////////////////////////////////////////////////
  // Métodos sin instancia: no usan rutas INTERNAS ni RELATIVAS

  // Método 1. String estático:
  Tjs.assert("Aquí ya valen 123" === Tjs.render(`Aquí ya valen <$=valores$>`, {valores:123}), "no renderiza string estático");
  
  // Método 2. String estático con soporte para asincronicidad:
  Tjs.assert("Aquí ya valen 123" === await Tjs.render(`Aquí ya valen <$=await new Promise(ok => { setTimeout(() => ok(valores), 1) })$>`, {valores:123}, {async:true}), "no renderiza string estático con soporte para asincronicidad");

  // Método 3. Fichero estático (con lectura asíncrona) sin asincronicidad:
  Tjs.assert("Esto es 444" === await Tjs.renderFile(`${__dirname}/templates/files/por-dos.js`, { input:222 }), "no renderiza fichero estático");

  // Método 4. Fichero estático (con lectura asíncrona) con asincronicidad:
  Tjs.assert("Esto es 444" === await Tjs.renderFile(`${__dirname}/templates/files/por-dos-async.js`, { input:222 }, {async: true}), "no renderiza fichero estático con asincronicidad");

  // Método 5. Fichero estático (con lectura síncrona):
  Tjs.assert("Esto es 444" === Tjs.renderFileSync(`${__dirname}/templates/files/por-dos.js`, { input:222 }), "no renderiza fichero estático con lectura síncrona");

  // Método 6. Fichero estático (con lectura síncrona) con asincronicidad:
  // Este método es una combinación extraña, porque lees el fichero de forma síncrona, pero esperas que haya awaits dentro.
  // Pero bueno, puede pasarte:
  Tjs.assert("Esto es 444" === await Tjs.renderFileSync(`${__dirname}/templates/files/por-dos-async.js`, { input:222 }, { async: true }), "no renderiza fichero estático con lectura síncrona y con asincronicidad");

  ////////////////////////////////////////////////////////////////
  // Métodos con instancia que usan rutas INTERNAS
  const tjs = Tjs.create(__dirname);

  // Método 7. Fichero interno (con lectura asíncrona) con asincronicidad:
  // Nótese que aquí no tenemos que especificar {async:true} porque se sobreentiende
  Tjs.assert("Esto es 444" === await tjs.renderFile("templates/files/por-dos-async.js", { input: 222 }), "no renderiza fichero interno con lectura asinrcona y con asincronicidad"); 

  // Método 8. Fichero interno (con lectura síncrona) sin asincronicidad:
  // Nótese que aquí no tenemos que especificar {async:false} porque se sobreentiende
  Tjs.assert("Esto es 444" === tjs.renderFileSync("templates/files/por-dos.js", { input: 222 }), "no renderiza fichero interno con lectura sinrcona y sin asincronicidad");

  ////////////////////////////////////////////////////////////////
  // Métodos con instancia que usan rutas RELATIVAS

  // Método 9. Fichero interno con rutas relativas y asincronicidad:
  // El fichero de plantilla tiene esto dentro:
  // class Whatever {
  //   /*<$=await include("./clase-a/prop-uno.js")$>*/
  //   /*<$=await include("./clase-a/prop-dos.js")$>*/
  //   /*<$=await include("./clase-a/prop-tres.js")$>*/
  // }
  Tjs.assert("class Whatever {\n  prop1 = 1;\n  prop2 = 2;\n  prop3 = 3;\n}" === await tjs.renderFile(`${__dirname}/templates/files/clase-a.js`), "no renderiza fichero interno con rutas relativas con lectura asíncrona con asincronicidad");

  // Método 10. Fichero interno con rutas relativas y sincronicidad:
  // El fichero de plantilla tiene esto dentro:
  // class Whatever {
  //   /*<$=includeSync("./clase-a/prop-uno.js")$>*/
  //   /*<$=includeSync("./clase-a/prop-dos.js")$>*/
  //   /*<$=includeSync("./clase-a/prop-tres.js")$>*/
  // }
  Tjs.assert("class Whatever {\n  prop1 = 1;\n  prop2 = 2;\n  prop3 = 3;\n}" === tjs.renderFileSync(`${__dirname}/templates/files/clase-a-sync.js`), "no renderiza fichero interno con rutas relativas con lectura síncrona y sin asincronicidad");

}
```
