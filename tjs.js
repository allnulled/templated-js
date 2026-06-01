class TjsRender {
  static AsyncFunction = (async function () { }).constructor;
  static beautifyJs(code, options = { indent_size: 1 }) {
    return require("js-beautify/js").js(code, options === true ? { indent_size: 1 } : options);
  }
  static render(template, injection = {}, options = {}) {
    const args = { ...injection, Tjs };
    const renderer = this.createRenderer(template, options, Object.keys(args))
    if(options.async) {
      return renderer(...Object.values(args)).then(newSource => {
        if (options.beautify) {
          newSource = TjsRender.beautifyJs(newSource, options.beautify);
        }
        return newSource;
      });
    } else {
      let newSource = renderer(...Object.values(args));
      if (options.beautify) {
        newSource = TjsRender.beautifyJs(newSource, options.beautify);
      }
      return newSource;
    }
  }
  static createRendererSource(template, options = {}) {
    const {
      delimiter = "$",
      // name = false,
      // async: isAsync = false,
      beautifyRender = false,
    } = options;
    const openBlock = `<${delimiter}`;
    const openBlockComment = `/*${openBlock}`;
    const openValue = `<${delimiter}=`;
    const openValueComment = `/*${openValue}`;
    const close = `${delimiter}>`;
    const closeComment = `${close}*/`;
    let code = 'let $templatedJs="";\n';
    let pos = 0;
    Iterating_characters:
    do {
      if (template.startsWith(openBlockComment, pos)) {
        const isValue = template.startsWith(openValueComment, pos);
        const offset = isValue ? openValueComment.length : openBlockComment.length;
        pos += offset;
        const startedAt = pos;
        Injecting_comment:
        while (pos < template.length) {
          if (template.startsWith(closeComment, pos)) {
            const endedAt = pos;
            const interjection = template.substring(startedAt, endedAt);
            const subcode = isValue ? `$templatedJs += (${interjection.trim()});\n` : `${interjection.trim()}\n`;
            code += subcode;
            pos += closeComment.length;
            Eliminar_apendices_polifilers: {
              if (template.startsWith("(){}", pos)) {
                pos += 4;
              } else if (template.startsWith("0", pos)) {
                pos += 1;
              } else if (template.startsWith('"template"', pos)) {
                pos += '"template"'.length;
              }
            }
            continue Iterating_characters;
          }
          pos++;
        }
        throw new Error(`unclosed injected commented ${isValue ? "value" : "expression"}: [pos=${startedAt}] ${template.substr(startedAt, 20)}`);
      } else if (template.startsWith(openBlock, pos)) {
        const isValue = template.startsWith(openValue, pos);
        const offset = isValue ? openValue.length : openBlock.length;
        pos += offset;
        const startedAt = pos;
        Injecting_expression:
        while (pos < template.length) {
          if (template.startsWith(close, pos)) {
            const endedAt = pos;
            const interjection = template.substring(startedAt, endedAt);
            const subcode = isValue ? `$templatedJs += (${interjection.trim()});\n` : `${interjection.trim()}\n`;
            code += subcode;
            pos += close.length;
            continue Iterating_characters;
          }
          pos++;
        }
        throw new Error(`unclosed injected ${isValue ? "value" : "expression"}: [pos=${startedAt}] ${template.substr(startedAt, 20)}`);
      } else {
        const startedAt = pos;
        Injecting_string: {
          while (pos < template.length) {
            if (template.startsWith(openBlockComment, pos) || template.startsWith(openBlock, pos)) {
              const endedAt = pos;
              const interjection = template.substring(startedAt, endedAt);
              const subcode = `$templatedJs += ${JSON.stringify(interjection)};\n`;
              code += subcode;
              pos += 0;
              continue Iterating_characters;
            }
            pos++;
          }
          const interjection = template.substring(startedAt, pos);
          const subcode = `$templatedJs += ${JSON.stringify(interjection)};\n`;
          code += subcode;
        }
      }
    } while (pos < template.length);
    code += "return $templatedJs;\n";
    if (beautifyRender) {
      code = TjsRender.beautifyJs(code, beautifyRender);
    }
    return code;
  }
  static createRenderer(template, options, argKeys = ["data"]) {
    const renderedSource = this.createRendererSource(template, options, argKeys);
    return options.async ? new TjsRender.AsyncFunction(...argKeys, renderedSource) : new Function(...argKeys, renderedSource);
  }
}
class TjsReader {
  static default = this;
  static readFile(file) {
    return require("fs").promises.readFile(file, "utf8");
  }
  static readFileAsString(file) {
    return require("fs").promises.readFile(file, "utf8").then(source => JSON.stringify(source));
  }
  static readFileSync(file) {
    return require("fs").readFileSync(file, "utf8");
  }
  static readFileSyncAsString(file) {
    return JSON.stringify(require("fs").readFileSync(file, "utf8"));
  }
  static readUrl(url) {
    return fetch(url, { method: "GET" }).then(response => response.text());
  }
  static renderFile(file, args, options) {
    return TjsReader.readFile(file).then(source => TjsRender.render(source, args, options));
  }
  static renderFileSync(file, args, options) {
    const source = TjsReader.readFileSync(file, "utf8");
    return TjsRender.render(source, args, options);
  }
  static renderUrl(url, args, options) {
    return TjsReader.readUrl(url).then(source => TjsRender.render(source, args, options));
  }
}
class Tjs {
  static assert(condition, message) { if (!condition) throw new Error("assertion error (by Tjs): " + message); }
  static assertThrows(callback, message) {
    let failed = false;
    try {
      callback();
    } catch (error) {
      failed = error;
    }
    if (failed === false) {
      throw new Error("assertionThrows did not throw error (by Tjs): " + message);
    }
  }
  static Render = TjsRender;
  static Reader = TjsReader;
  static {
    this.render = TjsRender.render;
    this.renderUrl = TjsReader.renderUrl;
    this.renderFile = TjsReader.renderFile;
    this.renderFileSync = TjsReader.renderFileSync;
    this.readFile = TjsReader.readFile;
    this.readFileAsString = TjsReader.readFileAsString;
    this.readFileSync = TjsReader.readFileSync;
    this.readFileSyncAsString = TjsReader.readFileSyncAsString;
    this.createRenderer = TjsRender.createRenderer;
    this.createRendererSource = TjsRender.createRendererSource;
  }
  static create(...args) {
    return new this(...args);
  }
  constructor(basedir) {
    this.basedir = basedir;
  }
  fullpathOf(file, relativeDir = false) {
    this.constructor.assert(typeof file === "string", "required file as string on Tjs.prototype.fullpathOf");
    if(file.startsWith("./")) {
      return require("path").resolve(relativeDir, file);
    }
    return require("path").resolve(this.basedir, file);
  }
  directoryOf(file) {
    return require("path").dirname(this.fullpathOf(file));
  }
  renderFileSync(file, args, options = {}) {
    return this.constructor.renderFileSync(this.fullpathOf(file), this.generateParameters(args, file, options), options);
  }
  renderFile(file, args, options = {}) {
    return this.constructor.renderFile(this.fullpathOf(file), this.generateParameters(args, file, options), { ...options, async: true });
  }
  readFileSync(file) {
    return this.constructor.readFileSync(this.fullpathOf(file));
  }
  readFile(file) {
    return this.constructor.readFile(this.fullpathOf(file));
  }
  readFileAsString(file) {
    return this.constructor.readFileAsString(this.fullpathOf(file));
  }
  readFileSyncAsString(file) {
    return this.constructor.readFileSyncAsString(this.fullpathOf(file));
  }
  readFileAsString(file) {
    return this.constructor.readFileAsString(this.fullpathOf(file));
  }
  generateParameters(args, file, options) {
    const fullfilepath = this.fullpathOf(file);
    const fulldirpath = require("path").dirname(fullfilepath);
    return {
        ...args,
        tjs: this,
        __dirname: fulldirpath,
        __filename: fullfilepath,
        stringifyFile: (targetFile) => {
          return this.readFileAsString(this.fullpathOf(targetFile, fulldirpath));
        },
        stringifyFileSync: (targetFile) => {
          return this.readFileSyncAsString(this.fullpathOf(targetFile, fulldirpath));
        },
        pasteFile: (targetFile) => {
          return this.readFile(this.fullpathOf(targetFile, fulldirpath));
        },
        pasteFileSync: (targetFile) => {
          return this.readFileSync(this.fullpathOf(targetFile, fulldirpath));
        },
        includeSync: (targetFile, ...others) => {
          return this.renderFileSync(this.fullpathOf(targetFile, fulldirpath), ...others);
        },
        include: (targetFile, ...others) => {
          return this.renderFile(this.fullpathOf(targetFile, fulldirpath), ...others);
        },
    };
  }
}
module.exports = Tjs;