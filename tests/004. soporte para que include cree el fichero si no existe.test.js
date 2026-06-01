module.exports = async function (Tjs) {
  
  const tjs = Tjs.create(__dirname, {
    createFileIfNotExists: true,
    defaultFileContent: "555"
  });
  Puede_crear_fichero_si_no_existe: {
    const fs = require("fs");
    await fs.promises.unlink(tjs.fullpathOf("templates/include-autocreate/ejemplo.js")).catch(error => false);
    const templateSource = await tjs.renderFile(`templates/include-autocreate/main.js`, { input:222 });
    const exists = await (fs.promises.lstat(tjs.fullpathOf("templates/include-autocreate/ejemplo.js")).catch(error => false));
    Tjs.assert(exists, "no está generando el fichero con include + autocreate");
    Tjs.assert(templateSource === "555", "no está renderizando bien el fichero con include + autocreate + autocontent");
  }

}