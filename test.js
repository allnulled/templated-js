(async function ([Tjs, testFiles]) {
  for (let index = 0; index < testFiles.length; index++) {
    const testName = testFiles[index];
    console.log(`[*] Test ${testName}`);
    const testCallback = require(`${__dirname}/tests/${testName}`);
    await testCallback(Tjs);
  }
})([
  require(__dirname + "/tjs.js"),
  require("fs").readdirSync(__dirname + "/tests").filter(file => file.endsWith(".test.js"))
]);