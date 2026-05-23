module.exports = async function (Tjs) {

  Tjs.assert(Tjs.render(`<$ for(let i=0; i<10; i++) { $><$=i!==0?'\\n':''$>Hola, <$= user $> <$=i$>!<$ } $>`, { user: "usuario" }) === `Hola, usuario 0!\nHola, usuario 1!\nHola, usuario 2!\nHola, usuario 3!\nHola, usuario 4!\nHola, usuario 5!\nHola, usuario 6!\nHola, usuario 7!\nHola, usuario 8!\nHola, usuario 9!`, "no imprime un bucle simple bien con la inyección normal");
  Tjs.assert(Tjs.render(`/*<$ for(let i=0; i<10; i++) { $>*//*<$=i!==0?'\\n':''$>*/Hola, /*<$= user $>*/ /*<$=i$>*/!/*<$ } $>*/`, { user: "usuario" }) === `Hola, usuario 0!\nHola, usuario 1!\nHola, usuario 2!\nHola, usuario 3!\nHola, usuario 4!\nHola, usuario 5!\nHola, usuario 6!\nHola, usuario 7!\nHola, usuario 8!\nHola, usuario 9!`, "no imprime un bucle simple bien con la inyección por comentario");
  Tjs.assert(Tjs.render("<$=typeof Tjs === 'function'$>") === "true", `no encuentra a Tjs desde las plantillas`);
  Tjs.assert(Tjs.render("<$=Tjs.render('Numero <'+'$=n$'+'>', {n:100})$>") === "Numero 100", `no puedes usar plantillas dentro de plantillas (rompiendo los patrones sensibles)`);
  Tjs.assert(Tjs.render("console.log(/*<$=Tjs.render('<'+'$=n$'+'>', {n:100})$>*/);") === "console.log(100);", `no puedes usarlo en comentarios multilinea`);
  Tjs.assertThrows(() => Tjs.render("/*<$ 'opened but not closed' "), "no detecta cuando has dejado abierto un bloque");
  Tjs.assertThrows(() => Tjs.render("/*<$= 'opened but not closed' $"), "no detecta cuando has dejado abierto un valor (1)");
  Tjs.assertThrows(() => Tjs.render("/*<$= 'opened but not closed' $>"), "no detecta cuando has dejado abierto un valor (2)");
  Tjs.assertThrows(() => Tjs.render("<$= 'opened but not closed' $"), "no detecta cuando has dejado abierto un valor (2)");
  Tjs.assertThrows(() => Tjs.render("<$ 'opened but not closed'"), "no detecta cuando has dejado abierto un valor (2)");
  Tjs.assertThrows(() => Tjs.render("/*<$= 'opened but not closed' $>*"), "no detecta cuando has dejado abierto un valor (3)");
  Tjs.assert(Tjs.render("/*<$= 'opened and closed' $>*/") === "opened and closed", "no detecta cuando has dejado abierto un valor (4)");
  Tjs.assert(await Tjs.render('<$=await new Promise(ok => setTimeout(() => ok("900"),0))$>', {}, { async: true }) === "900", "no puede usarse con awaits dentro de la plantilla");

}