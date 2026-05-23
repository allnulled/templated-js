module.exports = async function (Tjs) {

  const tjs = Tjs.create(__dirname + "/..");

  Test_clase_simple: {
    const output1 = await tjs.renderFile("tests/templates/DatabaseDemo.js", {}, { beautify: true });
    const eval1 = (new Function("return " + output1))();
    Tjs.assert(typeof eval1 === "function", "no evalua bien (1)");
    Tjs.assert(eval1.version === "1.0.0", "no evalua bien (2)");
    Tjs.assert(typeof eval1.open === "function", "no evalua bien (3)");
    Tjs.assert(typeof eval1.close === "function", "no evalua bien (4)");
    Tjs.assert(typeof eval1.select === "function", "no evalua bien (5)");
    Tjs.assert(typeof eval1.insert === "function", "no evalua bien (6)");
    Tjs.assert(typeof eval1.update === "function", "no evalua bien (7)");
    Tjs.assert(typeof eval1.delete === "function", "no evalua bien (8)");
    Tjs.assert(typeof eval1.Transaction === "function", "no evalua bien (9)");
    Tjs.assert(typeof eval1.Transaction.prototype.start === "function", "no evalua bien (10)");
    Tjs.assert(typeof eval1.Transaction.prototype.commit === "function", "no evalua bien (11)");
    Tjs.assert(output1.includes('console.log("constructor method");'), "no genera el código bien (1)");
    Tjs.assert(output1.includes('console.log("open method");'), "no genera el código bien (2)");
    Tjs.assert(output1.includes('console.log("close method");'), "no genera el código bien (3)");
    Tjs.assert(output1.includes('console.log("select method");'), "no genera el código bien (4)");
    Tjs.assert(output1.includes('console.log("insert method");'), "no genera el código bien (5)");
    Tjs.assert(output1.includes('console.log("update method");'), "no genera el código bien (6)");
    Tjs.assert(output1.includes('console.log("delete method");'), "no genera el código bien (7)");
    Tjs.assert(output1.includes('console.log("Transaction constructor method");'), "no genera el código bien (8)");
    Tjs.assert(output1.includes('console.log("start method");'), "no genera el código bien (9)");
    Tjs.assert(output1.includes('console.log("commit method");'), "no genera el código bien (10)");
    await require("fs").promises.writeFile(tjs.fullpathOf("tests/templates/DatabaseDemo.dist.js"), output1, "utf8");
  }
  
}