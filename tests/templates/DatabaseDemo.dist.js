class DatabaseDemo {
 static version = "1.0.0";
 constructor(basedir) {
  console.log("constructor method");
  this.basedir = basedir;
 }
 static open(id) {
  console.log("open method");
 }
 static close() {
  console.log("close method");
 }
 static select(filter) {
  console.log("select method");
 }
 static insert(item) {
  console.log("insert method");
 }
 static update(filter, values) {
  console.log("update method");
 }
 static delete(id) {
  console.log("delete method");
 }
 static Transaction = class DatabaseTransactionDemo {
  constructor() {
   console.log("Transaction constructor method");
  }
  start() {
   console.log("start method");
  }
  commit() {
   console.log("commit method");
  }
 };
}