module.exports = async function (Tjs) {
  
  const tjs = Tjs.create(__dirname, {
    createFileIfNotExists: true,
    defaultFileContent: "555",
  });
  Usa_injection_syntax_como_include_await: {
    const fs = require("fs");
    const templateSource = await tjs.renderFile(`templates/injection-syntax/main.js`, { input:222 });
    const templateModule = new Function(templateSource);
    let result = undefined;
    try {
      result = templateModule();
    } catch (error) {
      result = error;
    }
    Tjs.assert(typeof result === "object", "no está renderizando bien el fichero con injection (punto 1)");
    Tjs.assert(result.a === 1, "no está renderizando bien el fichero con injection (punto 2)");
    Tjs.assert(result.b === 2, "no está renderizando bien el fichero con injection (punto 3)");
    Tjs.assert(result.c === 3, "no está renderizando bien el fichero con injection (punto 4)");
  }

}