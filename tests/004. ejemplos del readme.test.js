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