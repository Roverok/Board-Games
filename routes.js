
/*
 * GET home page.
 */

var urls = require('./app/enums/urlConstants').urls
module.exports = function(app){
  var userController = require('./app/controllers/user')
  app.get(urls.WEB.USER_INDEX, userController.index);
  app.get(urls.WEB.USER_INDEX2, userController.index2);
  app.get(urls.WEB.USER_GET,userController.list);

  var testController = require('./app/controllers/test')
  app.get(urls.WEB.TEST_INDEX, testController.testIndex);
  app.get(urls.WEB.TEST_INDEX2, testController.testIndex2);
  app.get(urls.WEB.TEST_GET, testController.testList);

}