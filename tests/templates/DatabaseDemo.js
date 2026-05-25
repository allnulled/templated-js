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