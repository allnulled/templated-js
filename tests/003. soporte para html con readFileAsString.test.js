module.exports = async function (Tjs) {
  
  const tjs = Tjs.create(__dirname);
  Puede_inyectar_un_fichero_como_string: {
    const templateSource = await tjs.renderFile(`templates/files/ejemplo-html-1.js`, { input:222 });
    Tjs.assert('static source = "some text in file";' === templateSource, "no renderiza bien con el readFileAsString");
  }
  Puede_usar_path_relativo_para_inyectar_un_fichero_como_string: {
    const templateSource = await tjs.renderFile(`templates/files/ejemplo-html-2.js`, { input:222 });
    Tjs.assert('static source = "some text in file";' === templateSource, "no renderiza bien con el stringifyFile");
  }
  Puede_usar_path_relativo_para_inyectar_un_fichero_como_codigo: {
    const templateSource = await tjs.renderFile(`templates/files/ejemplo-html-3.js`, { input:222 });
    Tjs.assert('static source = "esto es otro texto";' === templateSource, "no renderiza bien con el pasteFile");
  }

}